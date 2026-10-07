// Shared logic for the Link Tagger tool: tagging single links and retagging
// every omoniyialimi.com link inside a PDF. No DOM here, so it can be tested
// in Node (scripts/tests/link-tagger.test.mjs).

export const BASE = 'https://www.omoniyialimi.com';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const SITE_HOSTS = new Set(['omoniyialimi.com', 'www.omoniyialimi.com']);

export const slug = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export function makeTags({ company, medium, campaign }) {
  return {
    utm_source: slug(company) || 'company',
    utm_medium: medium || 'application',
    utm_campaign: slug(campaign) || 'job-search',
  };
}

// Drops any old UTM tags, then adds these ones. Keeps the page and any other query.
export function withTags(url, tags) {
  const u = new URL(url);
  UTM_KEYS.forEach((k) => u.searchParams.delete(k));
  Object.keys(tags).forEach((k) => u.searchParams.set(k, tags[k]));
  return u.toString();
}

// Strips the stray punctuation that breaks links, like "/house)" or "/athletico)."
export function cleanPasted(raw) {
  let s = String(raw || '').trim().split(/\s+/)[0] || '';
  s = s.replace(/^[(<[“"']+/, '').replace(/[)\]>.,;:!?”"']+$/, '');
  if (s && !/^https?:\/\//i.test(s)) s = 'https://' + s;
  return s;
}

// The same clean-up for a link's path, so "?utm..." links with ")" before the
// query are fixed too.
function cleanPath(u) {
  const trimmed = u.pathname.replace(/[)\]>.,;:!?”"']+$/, '');
  const changed = trimmed !== u.pathname;
  if (changed) u.pathname = trimmed || '/';
  return changed;
}

export function isSiteUrl(url) {
  try {
    const u = new URL(url);
    return /^https?:$/.test(u.protocol) && SITE_HOSTS.has(u.hostname.toLowerCase());
  } catch {
    return false;
  }
}

// Retags one link from a PDF. Returns { before, after, kind } where kind is
// 'tagged' (site link), 'skipped' (other site) or 'broken' (not a valid link).
export function retagLink(raw, tags) {
  const before = String(raw || '');
  let cleaned = before.trim();
  if (cleaned && !/^[a-z][a-z0-9+.-]*:/i.test(cleaned) && /omoniyialimi\.com/i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }
  if (!isSiteUrl(cleaned)) {
    let valid = true;
    try { new URL(cleaned); } catch { valid = false; }
    return { before, after: before, kind: valid ? 'skipped' : 'broken' };
  }
  const u = new URL(cleaned);
  const fixed = cleanPath(u);
  return { before, after: withTags(u.toString(), tags), kind: 'tagged', fixed };
}

// Rewrites every link annotation in a PDF. Needs pdf-lib (passed in so this
// file stays free of a 500 KB import until the PDF tab is used).
export async function retagPdf(bytes, tags, PDFLib) {
  const { PDFDocument, PDFName, PDFString, PDFDict, PDFArray } = PDFLib;
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  const results = [];
  const pages = doc.getPages();

  pages.forEach((page, pageIndex) => {
    const annots = page.node.lookupMaybe(PDFName.of('Annots'), PDFArray);
    if (!annots) return;
    for (let i = 0; i < annots.size(); i++) {
      const annot = annots.lookupMaybe(i, PDFDict);
      if (!annot) continue;
      const action = annot.lookupMaybe(PDFName.of('A'), PDFDict);
      if (!action) continue;
      const type = action.lookupMaybe(PDFName.of('S'), PDFName);
      if (!type || type.asString() !== '/URI') continue;
      const uriObj = action.lookup(PDFName.of('URI'));
      if (!uriObj || typeof uriObj.decodeText !== 'function') continue;
      const result = retagLink(uriObj.decodeText(), tags);
      if (result.kind === 'tagged' && result.after !== result.before) {
        action.set(PDFName.of('URI'), PDFString.of(result.after));
      }
      results.push({ page: pageIndex + 1, ...result });
    }
  });

  const out = await doc.save({ useObjectStreams: false });
  return { bytes: out, results, pageCount: pages.length };
}

// "Resume - Omoniyi A.pdf" + sandboxaq -> "Resume - Omoniyi A-sandboxaq.pdf"
export function taggedFileName(name, source) {
  const base = String(name || 'document.pdf').replace(/\.pdf$/i, '');
  const suffix = `-${source}`;
  const clean = base.toLowerCase().endsWith(suffix) ? base.slice(0, -suffix.length) : base;
  return `${clean}${suffix}.pdf`;
}
