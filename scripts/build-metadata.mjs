import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { pageMetadata, getPageMetadata, metadataTags } from '../src/data/pageMetadata.js';

const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const template = (await readFile('dist/index.html', 'utf8'))
  .replace(/<title>[\s\S]*?<\/title>/g, '')
  .replace(/<meta\s+(?:name|property)="(?:description|og:[^"]+|twitter:[^"]+)"[^>]*>/g, '')
  .replace(/<link\s+rel="canonical"[^>]*>/g, '');
for (const route of [...Object.keys(pageMetadata), '/uikits']) {
  const metadata = getPageMetadata(route);
  await access(`dist${metadata.image}`);
  const head = `<title>${escape(metadata.title)}</title>\n<link rel="canonical" href="${escape(metadata.canonical)}" />\n` + metadataTags(metadata).map(([attribute, key, content]) => `<meta ${attribute}="${key}" content="${escape(content)}" />`).join('\n');
  const preload = route === '/work' ? '<link rel="preload" as="image" href="/case-studies/house-dashboard.webp" fetchpriority="high" />' : '';
  const directory = `dist${route === '/' ? '' : route}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, template.replace('</head>', `${head}\n${preload}\n</head>`));
}
console.log(`Generated metadata for ${Object.keys(pageMetadata).length + 1} routes.`);
// Exact rewrites precede Netlify's SPA fallback, including links without a trailing slash.
await writeFile('dist/_redirects', [...Object.keys(pageMetadata), '/uikits'].filter(route => route !== '/').flatMap(route => [`${route} ${route}/index.html 200`, `${route}/ ${route}/index.html 200`]).join('\n') + '\n' + await readFile('public/_redirects', 'utf8'));
