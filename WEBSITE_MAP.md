# Website Map

If you want the shortest path to the live Rushi site, start here.

## App entry and routes

- `src/App.tsx`: route tree for `/`, `/studio`, `/studio/brief`, `/studio/project/:code`, `/remote`, and the public redirects.
- `src/pages/PortfolioHome.tsx`: homepage entry point.
- `src/pages/StudioLibraryPage.tsx`: public `/studio` experience.
- `src/pages/StudioBriefPage.tsx`: brief submission flow.
- `src/pages/PublicDocumentPage.tsx`: shared public project route, including presentations.
- `src/pages/PresentationRemotePage.tsx`: universal remote for presentation decks.

## Public project and presentation logic

- `src/components/studio/ProjectShowcase.tsx`: public project, brochure, quote, and packet rendering.
- `src/components/studio/KeynotePresentationExperience.tsx`: live presentation, presenter, and screen experience.
- `src/lib/projectDocuments.ts`: project document normalization and derived brochure/quote data.
- `src/lib/presentationRemote.ts`: realtime channel/session helpers.

## Content and assets

- `src/data/portfolioContent.ts`: homepage copy, featured work, logos, contact info.
- `src/data/infs5700KeynoteProject.ts`: INFS5700 presentation content and public session config.
- `public/images/`: homepage, studio, presentation, and supporting graphics.
- `public/files/`: downloadable public files and PDFs.
- `public/models/` and `public/draco/`: 3D scene assets for the homepage.

## Public data access

- `src/lib/documents.ts`: public document fetchers and studio library loading.
- `api/rushi-personal-documents/`: public Vercel API routes for project lookup and library cards.
- `api/rushi-personal-presentation/remote-access.js`: protected remote access for the permanent INFS5700 remote.

## Backend support

- `src/lib/supabase.ts`: client Supabase setup.
- `supabase/functions/`: AI-assisted copy helpers.
- `supabase/migrations/`: document, brochure, quote, and studio schema history.

## Daily commands

- `npm run dev`
- `npm run build`
- `npm run check`
- `npm run preview`
