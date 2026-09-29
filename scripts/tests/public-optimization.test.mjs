import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import canonicalPublicUrl from '../../netlify/edge-functions/canonical-public-url.js';
import { pageMetadata, getPageMetadata } from '../../src/data/pageMetadata.js';
const next = () => new Response('pass');

test('public URLs redirect once, preserve query strings, and canonical URLs pass through', async () => {
  for (const route of Object.keys(pageMetadata).filter(route => route !== '/')) {
    const response = canonicalPublicUrl(new Request(`https://omoniyialimi.com${route}/?utm_source=test`), {next});
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('location'), `https://omoniyialimi.com${route}?utm_source=test`);
    assert.equal(await canonicalPublicUrl(new Request(response.headers.get('location')), {next}).text(), 'pass');
  }
  for (const route of ['/uikits', '/uikits/']) {
    assert.equal(canonicalPublicUrl(new Request(`https://omoniyialimi.com${route}`), {next}).headers.get('location'), 'https://omoniyialimi.com/uikit');
  }
});

test('private tools, assets, unknown pages, home and POST requests are untouched', async () => {
  for (const route of ['/', '/tools/', '/tools/planner/', '/.netlify/functions/planner-data', '/assets/example.webp', '/missing/']) {
    assert.equal(await canonicalPublicUrl(new Request(`https://omoniyialimi.com${route}`), {next}).text(), 'pass');
  }
  assert.equal(await canonicalPublicUrl(new Request('https://omoniyialimi.com/studio/', {method:'POST'}), {next}).text(), 'pass');
});

test('built public pages have a single canonical, title, description and social image', async () => {
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  for (const route of Object.keys(pageMetadata)) {
    const html = await readFile(`dist${route === '/' ? '' : route}/index.html`, 'utf8');
    const metadata = getPageMetadata(route);
    for (const expression of [/<title>/g, /rel="canonical"/g, /name="description"/g, /property="og:image"/g, /name="twitter:image"/g]) assert.equal([...html.matchAll(expression)].length, 1, route);
    assert.ok(html.includes(`href="${metadata.canonical}"`), route);
    assert.ok(sitemap.includes(`<loc>${metadata.canonical}</loc>`), route);
    await access(`dist${metadata.image}`);
  }
});
