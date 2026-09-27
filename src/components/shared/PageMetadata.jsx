import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageMetadata, metadataTags, faviconFor } from '../../data/pageMetadata.js';

export default function PageMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
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
  }, [pathname]);
  return null;
}
