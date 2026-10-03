import { portfolioStudies } from './caseStudies.js';
import { getPublishedObservations } from './observations.js';

export const siteOrigin = 'https://omoniyialimi.com';
const page = (title, description, image = 'home', imageAlt = 'Omoniyi Alimi portfolio homepage') => ({ title, description, image: `/social/${image}.png`, imageAlt });
export const pageMetadata = {
  '/': page('Omoniyi Alimi — Senior Product Designer', 'Explore Omoniyi Alimi’s product design portfolio: thoughtful digital experiences, enterprise systems, and human-centered work across government and healthcare.'),
  '/work': page('Selected Work | Omoniyi Alimi', 'Explore eight design case studies spanning legislative voting, copyright systems, financial workflows, agricultural applications, patient onboarding, a wedding identity, a nail-artist brand, and this portfolio’s own design.'),
  '/resume': page('Résumé | Omoniyi Alimi, Senior Product Designer', 'Résumé of Omoniyi Alimi, a senior product designer with nine years designing government, healthcare, and enterprise systems.'),
  '/resume/experience': page('Résumé | Omoniyi Alimi, Product & Experience Designer', 'Résumé of Omoniyi Alimi, a product and experience designer who designs and builds interactive, visual, and systems-driven work.'),
  '/visual': page('Visual & Illustration | Omoniyi Alimi', 'Illustration, custom lettering, and brand identity from Omoniyi Alimi, rooted in the OMDesigns practice that grew into Omoniyi Studio.', 'visual', 'Omoniyi Alimi visual and illustration archive'),
  '/about': page('About | Omoniyi Alimi', 'Meet Omoniyi Alimi, a senior product designer bringing curiosity, research, and systems thinking to complex digital products.'),
  '/observations': { ...page('Observations | Omoniyi Alimi', 'Field notes by Omoniyi Alimi on design, work, remote life, and the everyday observations that shape a creative practice.', 'observations', 'Observations — Things I’m noticing. Notes on systems, stories, design, and life.'), imageWidth: 1200, imageHeight: 575 },
  '/studio': page('Omoniyi Studio | Diagnose First, Then Design', 'Omoniyi Studio diagnoses what isn’t working on your website or product before designing anything. Every project starts with a $500 diagnosis, credited toward the work.', 'studio', 'Omoniyi Studio homepage'),
  '/studio/admission': page('Admission: The $500 Diagnosis | Omoniyi Studio', 'Admission is a $500 diagnosis of your website. Nine things your customers feel, checked with free industry tools and by hand, with proof for every finding.', 'studio', 'Omoniyi Studio homepage'),
  '/studio/about': page('About | Omoniyi Studio', 'The Omoniyi Studio manifesto: good design should leave you clearer than it found you. Diagnose before prescribing, and leave clients more capable, not more dependent.', 'studio', 'Omoniyi Studio homepage'),
  '/studio/inquire': page('Tell Me What Isn’t Working | Omoniyi Studio', 'Tell Omoniyi Studio what isn’t working. A few questions, then a free 20-minute fit call.', 'studio', 'Omoniyi Studio homepage'),
  '/uikit': page('Omoniyi UI — Thoughtful Figma UI Kits', 'Reusable Figma UI kits for getting version one out the door. Explore the component playground and start with LaunchKit Free.', 'uikit', 'Omoniyi UI homepage featuring LaunchKit Figma UI kits'),
};
for (const study of portfolioStudies) {
  pageMetadata[`/${study.slug}`] = page(`${study.client}: ${study.title} | Omoniyi Alimi`, study.summary, study.slug, `${study.client}: ${study.title} case study`);
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
    ['property', 'og:image:width', String(metadata.imageWidth || 1200)],
    ['property', 'og:image:height', String(metadata.imageHeight || 630)],
    ['property', 'og:image:alt', metadata.imageAlt],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', metadata.title],
    ['name', 'twitter:description', metadata.description],
    ['name', 'twitter:image', `${siteOrigin}${metadata.image}`],
    ['name', 'twitter:image:alt', metadata.imageAlt],
  ];
}

// Each space gets its own favicon (public/favicons/*.svg), from the Stardust
// brand sheet: Studio and UI Kit pages use theirs, everything else Portfolio.
export function faviconFor(pathname = '/') {
  if (/^\/studio(\/|$)/.test(pathname)) return '/favicons/studio.svg';
  if (/^\/uikits?(\/|$)/.test(pathname)) return '/favicons/ui.svg';
  return '/favicons/portfolio.svg';
}
