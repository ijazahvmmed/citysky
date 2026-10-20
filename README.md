# Citysky

Next.js App Router website with React, CSS Modules, GSAP and a lazy-loaded Three.js architectural viewer.

## Local development

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Validate with `npm run lint`, `npx tsc --noEmit` and `npm run build`; serve the production build with `npm start`.

Read the installed Next.js guides in `node_modules/next/dist/docs/` before changing framework-specific code.

## Shared content

- `src/lib/site.ts`: contact details, navigation, supplied Maps link and canonical site URL.
- `src/lib/data/projects.ts`: projects, galleries and furnishing options. `STARTING_PRICE` is the homepage's ₹65 lakh campaign price. Mirzad Road has its own ₹72/76/80 lakh finish quotation; other projects retain their existing prices. `projectTierPrice` resolves each project's finish prices for the website and catalogues. The homepage finish overview intentionally has no tier prices.
- `src/components/build/`: scroll-driven construction stages, finish selection and 3D camera interaction. The viewer supports drag, keyboard rotation, zoom/reset buttons, reduced motion and a static fallback.

The canonical public address is `https://cityskyhomes.com`. Metadata, sitemap, public links and catalogues share this value. `NEXT_PUBLIC_SITE_URL` can override it before a build; see `.env.example`.

## Project catalogues

Published PDFs are in `public/catalogs/`. Regenerate after changing prices, images or contact details:

```bash
python scripts/generate-catalogues.py
```

Requires Python 3, ReportLab, Pillow, Node and the installed repository dependencies. The generator also updates page counts and file sizes used by the download UI. See [scripts/README.md](scripts/README.md) for content and review requirements.

## Analytics

`@vercel/analytics/next` is mounted once in the root layout through `SiteAnalytics`. Page views and existing project, furnishing, catalogue and contact interactions are connected to Vercel Web Analytics.

Enable Web Analytics for the Vercel project and deploy this version to collect production traffic. Local development uses the SDK's debug mode. Page URLs have their query strings and fragments removed; form values, names, phone numbers and email addresses are not sent as event properties. Custom-event availability depends on the Vercel plan.

## Location data

The supplied Maps short link is used for map actions. Embedded maps are explicitly neighbourhood references. Numerical distances have been removed until exact project entrances and driving routes are verified; a neighbourhood search or an unidentified short link is not enough to establish them.
