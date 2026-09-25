# omoniyialimi.com

Portfolio of Omoniyi Alimi, a senior product designer who designs complex and regulated products. It is designed and coded as an editorial field journal, and it also hosts Omoniyi Studio and LaunchKit UI.

**Live site:** [omoniyialimi.com](https://omoniyialimi.com)

## What's inside

- **Persona-aware home page.** Visitors pick "someone hiring" or "someone building," and the hero copy, work cards and background animation change to match.
- **Case studies** for the U.S. House voting platform, the Library of Congress copyright system, USDA and Athletico.
- **Studio and LaunchKit UI pages**, including a qualification-to-booking inquiry flow.
- **Observations**, a short-form writing section.
- **Accessibility.** Keyboard and focus states, and a motion toggle that pauses the ambient animation.

## Stack

- React 19 and React Router 7, built with Vite
- Netlify for hosting, with Netlify Functions for the contact, Studio inquiry and sign-up forms (email sent over SMTP with nodemailer, server-side only)
- A build step (`scripts/build-metadata.mjs`) that generates per-route HTML so link previews work without JavaScript
- GA4 for funnel analytics

## Run it locally

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/, plus per-route metadata
npm run lint
```

The forms run as Netlify Functions, so they only send from a deployed site or `netlify dev`, not `npm run dev`. Copy `.env.example` to `.env` for local function testing. [CONTACT_FORM_SETUP.md](CONTACT_FORM_SETUP.md) covers the Netlify environment variables.

## Project structure

```
src/pages/          one component per route
src/data/           page metadata and content
netlify/functions/  form handlers (server-side)
scripts/            build-time metadata generation
public/social/      1200 x 630 link-preview images
```

## Page metadata and sharing previews

Page titles, descriptions, canonical URLs, and social tags are defined in
`src/data/pageMetadata.js`. `npm run build` creates a separate HTML entry for
each published route and writes Netlify rewrites ahead of the SPA fallback,
so link-preview crawlers receive metadata without running JavaScript.

The 1200 × 630 PNG screenshots in `public/social/` provide sharing previews:
the portfolio homepage is the default, Studio and UI kit pages use their own
homepages, and each case study has a dedicated screenshot. Refresh those
screenshots when the corresponding page design changes. Lightweight project
image previews live in `public/case-studies/previews/`.

Deploy the complete generated `dist` folder (including `_redirects`, route
folders, and `social`) or let Netlify run the configured build command.
