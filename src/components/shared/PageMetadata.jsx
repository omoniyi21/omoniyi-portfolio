import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { metadataPathFor } from '../../lib/siteHost';

// The metadata table imports every case study and post, so it loads on
// demand instead of in the main bundle. On first load the page's static
// HTML already carries the right head (scripts/build-metadata.mjs); this
// keeps it right as people move between pages.
const loadMetadata = () => import('../../data/pageMetadata.js');

function applyMetadata({ getPageMetadata, metadataTags, faviconFor }, pathname) {
  const metadata = getPageMetadata(pathname);
  document.title = metadata.title;
  for (const [attribute, key, content] of metadataTags(metadata)) {
    let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, key);
      document.head.appendChild(element);
    }
    element.content = content;
  }
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = metadata.canonical;
  const favicon = faviconFor(pathname);
  for (const icon of document.head.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]')) {
    if (icon.getAttribute('href') !== favicon) icon.setAttribute('href', favicon);
  }
}

export default function PageMetadata() {
  const { pathname: routePath } = useLocation();
  const pathname = metadataPathFor(routePath);
  // Each page's head is written into its static HTML at build time, so on
  // the first page the table is only needed when that prebuilt head is for
  // a different path (a 404 is served the homepage's HTML, for example).
  const firstVisit = useRef(true);
  useEffect(() => {
    if (firstVisit.current) {
      firstVisit.current = false;
      const canonical = document.head.querySelector('link[rel="canonical"]')?.href;
      const prebuilt = canonical && new URL(canonical).pathname.replace(/\/+$/, '');
      if (prebuilt === pathname.replace(/\/+$/, '')) return;
    }
    let cancelled = false;
    loadMetadata().then((table) => {
      if (!cancelled) applyMetadata(table, pathname);
    });
    return () => { cancelled = true; };
  }, [pathname]);
  return null;
}
