import { pageMetadata, getPageMetadata } from '../../src/data/pageMetadata.js';

// Edge functions run before Netlify normalizes paths for redirect matching.
export default function canonicalPublicUrl(request, context) {
  if (!['GET', 'HEAD'].includes(request.method)) return context.next();
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  if (!Object.hasOwn(pageMetadata, path) && path !== '/uikits') return context.next();
  const canonicalPath = new URL(getPageMetadata(path).canonical).pathname;
  if (url.pathname === canonicalPath) return context.next();
  url.pathname = canonicalPath;
  return Response.redirect(url, 301);
}

export const config = { path: '/*' };
