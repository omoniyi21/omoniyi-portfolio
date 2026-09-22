import { portfolioStudies } from './caseStudies.js';
import { getPublishedObservations } from './observations.js';

export const siteOrigin = 'https://omoniyialimi.com';
const page = (title, description, image = 'home', imageAlt = 'Omoniyi Alimi portfolio homepage') => ({ title, description, image: `/social/${image}.png`, imageAlt });
export const pageMetadata = {
  '/': page('Omoniyi Alimi — Senior Product Designer', 'Explore Omoniyi Alimi’s product design portfolio: thoughtful digital experiences, enterprise systems, and human-centered work across government and healthcare.'),
  '/work': page('Selected Work | Omoniyi Alimi', 'Explore seven design case studies spanning legislative voting, copyright systems, financial workflows, agricultural applications, patient onboarding, a wedding identity, and this portfolio’s own design.'),
  '/resume': page('Résumé | Omoniyi Alimi, Senior Product Designer', 'Résumé of Omoniyi Alimi, a senior product designer with nine years designing government, healthcare, and enterprise systems.'),
  '/resume/experience': page('Résumé | Omoniyi Alimi, Product & Experience Designer', 'Résumé of Omoniyi Alimi, a product and experience designer who designs and builds interactive, visual, and systems-driven work.'),
  '/about': page('About | Omoniyi Alimi', 'Meet Omoniyi Alimi, a senior product designer bringing curiosity, research, and systems thinking to complex digital products.'),
  '/observations': page('Observations | Omoniyi Alimi', 'Field notes by Omoniyi Alimi on design, work, remote life, and the everyday observations that shape a creative practice.'),
  '/studio': page('Omoniyi Studio | Product Design & Strategy', 'Thoughtful product design with Omoniyi Studio. Explore design services, a collaborative process, and selected work that makes complex systems easier to use.', 'studio', 'Omoniyi Studio homepage showing product design services'),
  '/studio/inquire': page('Start a Project | Omoniyi Studio', 'Tell Omoniyi Studio about your product, goals, and design needs to start a conversation about working together.', 'studio', 'Omoniyi Studio homepage showing product design services'),
  '/uikit': page('Omoniyi UI — Thoughtful Figma UI Kits', 'Reusable Figma UI kits for getting version one out the door. Explore the component playground and start with LaunchKit Free.', 'uikit', 'Omoniyi UI homepage featuring LaunchKit Figma UI kits'),
};
for (const study of portfolioStudies) {
  pageMetadata[`/${study.slug}`] = page(`${study.client} ${study.title} | Omoniyi Alimi`, study.summary, study.slug, `${study.client}: ${study.title} case study`);
}
for (const post of getPublishedObservations()) {
  pageMetadata[`/observations/${post.slug}`] = { ...page(`${post.title} | Omoniyi Alimi`, post.excerpt), type: 'article' };
}
export function getPageMetadata(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  const canonicalPath = path === '/uikits' ? '/uikit' : path;
  return { ...(pageMetadata[canonicalPath] || page('Page Not Found | Omoniyi Alimi', 'This page could not be found. Explore Omoniyi Alimi’s selected work, studio, and observations.')), canonical: `${siteOrigin}${canonicalPath}` };
}
export function metadataTags(metadata) {
  return [
    ['name', 'description', metadata.description],
    ['property', 'og:type', metadata.type || 'website'],
    ['property', 'og:site_name', 'Omoniyi Alimi'],
    ['property', 'og:title', metadata.title],
    ['property', 'og:description', metadata.description],
    ['property', 'og:url', metadata.canonical],
    ['property', 'og:image', `${siteOrigin}${metadata.image}`],
    ['property', 'og:image:type', 'image/png'],
    ['property', 'og:image:width', '1200'],
    ['property', 'og:image:height', '630'],
    ['property', 'og:image:alt', metadata.imageAlt],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', metadata.title],
    ['name', 'twitter:description', metadata.description],
    ['name', 'twitter:image', `${siteOrigin}${metadata.image}`],
    ['name', 'twitter:image:alt', metadata.imageAlt],
  ];
}
