# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

### Page metadata and sharing previews

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
