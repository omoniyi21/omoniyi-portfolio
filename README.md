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

## Private Planner V1

`/tools/planner/` reads Notion through `/.netlify/functions/planner-data`.
The existing Tools landing is preserved; its Planner card now opens Home.
Career, Studio, Social, Lab and Wants each have a private, searchable table.
This first version is read-only: source links open Notion for edits.

### Connect Notion on Netlify

1. Set `NOTION_TOKEN` to the internal integration token in the portfolio site's
   Netlify environment variables, available to Functions. `NOTION_API_KEY` is
   also accepted for compatibility. Never put this value in a `VITE_` variable.
2. Give the integration Read content access to OUTLOUD and the original source
   databases. Linked database views do not grant access to their original sources.
3. Keep the existing `TOOLS_AUTH_SECRET` and `TOOLS_ALLOWED_EMAIL` configured.
   The data function verifies the signed session AND the current email allowlist,
   including when someone calls the function URL directly.
4. Deploy the changes and sign in through `/tools/login/`. Open Planner, then
   refresh from Notion. A setup/access error is deliberately shown instead of
   invented tasks, counts or a saved private-data snapshot.

Source IDs and property mappings are in `netlify/lib/planner-notion.mjs`.
The integration uses Notion API version `2025-09-03` and paginated data-source
queries. It retries rate limits, sets request timeouts, and returns no-store
responses. No Notion content is written to the static build or local storage.
Home's season, prompt and weekly list come from the dashboard blocks, above
Quick Links. Tasks use Date and When; explicitly dated old tasks are separated
from today's plan. Daily Rhythm and planning rows use the current Chicago date.
Appointments display the Calendar Read note; this is not a direct calendar sync.
Career Apply Next means Decision=Yes with Found status, matching the Notion view. Social
Published requires a Published URL, so Done is not assumed to mean published.

Run `node --test scripts/tests/planner.test.mjs` for API boundary, pagination,
normalization and date tests. Run `npm run build` for the production build.
A plain Vite preview cannot run Netlify Functions; use Netlify Dev for an
end-to-end local connection, or verify on the signed-in Netlify deployment.
