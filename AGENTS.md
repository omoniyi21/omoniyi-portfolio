# Working on omoniyialimi.com

Instructions for AI coding agents (Codex, Claude Code) working in this repo.
Omoniyi reviews and merges every change herself.

## The site

- React 19 single-page app built with Vite 8 and React Router 7. Not Next.js.
- Hosted on Netlify: functions in `netlify/functions`, edge functions in
  `netlify/edge-functions`. `scripts/build-metadata.mjs` writes each route's
  static HTML head, sitemap and redirects at build time.
- Package manager is **npm**. Do not add pnpm, yarn or a second lockfile.
- Content lives in `src/data` (case studies, observations, résumé).

## Workflow

- Never commit to `main`. Work on a branch and open a pull request with a
  short, plain summary and a checklist of what to look at on the deploy
  preview.
- Discuss design changes before building them. Small, routine fixes can go
  straight into the PR.
- Before opening a PR, run all of these and make sure they pass:
  - `npm run lint`
  - `npm run build`
  - `node --test scripts/tests/*.mjs`

## Skills to follow

Both live in `.claude/skills/` and are copied unchanged from their sources
(see `.claude/skills/SOURCES.md`).

**`react-best-practices`** (Vercel). Use it when writing or reviewing React
code. On this site:
- Apply the bundle, client, re-render, rendering, JavaScript and advanced
  rules.
- Skip the `server-*` rules, `async-api-routes`, and the hydration rules:
  there is no server rendering here.
- Where a rule says `next/dynamic`, use `React.lazy` with `Suspense`.
- Pages are already split by route and preload when someone hovers or focuses
  a link to them (`src/App.jsx`). Keep large data out of the main bundle:
  import it from the page that needs it, not from `App.jsx` or anything that
  renders on every page.

**`craft-design-engineering`** (Craft). Use it when building or reviewing UI.
Its rules hold here: instant hover, transitions (not keyframes) for anything
a person can toggle, a faint inner outline on images, tabular numbers for
changing digits, and spending motion only on rare moments.

## Design rules for this site

- Identity: an editorial field journal. Warm paper, graph-paper grid,
  handwritten notes in Caveat, a lavender accent, Newsreader for display and
  Satoshi for body text.
- Motion: one source of truth. CSS reads `html[data-motion="reduce"]` and JS
  reads `isMotionReduced()` from `src/lib/motionPreference.js`. Content must
  be complete and visible with motion off.
- Novelty budget: at most one or two expressive moments per page. Everything
  else is calm and quick.
- Phones (600px and below) keep a flat, plain reading card on the homepage:
  no paper texture behind text.
- Accessibility: visible focus on every control, decorative art
  `aria-hidden`, text contrast at WCAG AA, and nothing that moves for more
  than five seconds without a way to stop it.
- Copy: write in Omoniyi's plain, direct voice. No em dashes in on-page copy.
  Never invent outcomes or metrics; case studies only claim what the work
  shows.
