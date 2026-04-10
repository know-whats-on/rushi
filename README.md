# Rushi Website

This repository contains the current Rushi website and public studio stack.
It includes:

- the public homepage at `/`
- the studio library and brief flow at `/studio` and `/studio/brief`
- public project, brochure, quote, and presentation pages at `/studio/project/:code`
- the universal presentation remote at `/remote`
- Vercel API routes for public document access and protected presentation remote access
- Supabase functions and migrations that support the public studio experience

![Website Preview](public/images/preview1.png)

## Stack

- React 18 + TypeScript + Vite
- React Router
- GSAP + React Three Fiber / Three.js
- Supabase
- Vercel serverless API routes

## Key Routes

- `/`
- `/studio`
- `/studio/brief`
- `/studio/project/:code`
- `/remote`
- redirects for `/document/:code`, `/quote/:code`, and `/brochure/:code`

## Project Layout

```text
.
├── api/                  # Vercel serverless routes
├── public/               # Public assets, PDFs, models, presentation media
├── src/                  # App routes, components, data, and client libraries
├── supabase/
│   ├── functions/        # Edge functions used by studio helpers
│   └── migrations/       # Database migrations for documents and studio data
├── .env.example          # Environment contract
├── .vercelignore         # Deploy-time exclusions
└── WEBSITE_MAP.md        # High-signal file guide
```

## Local Development

```bash
npm install
npm run dev
```

Useful commands:

- `npm run build`
- `npm run lint`
- `npm run check`
- `npm run preview`

## Environment

Copy `.env.example` into a local `.env.local` or set the same values in Vercel.

Sensitive values are intentionally not committed. Public-safe client config can
remain exposed to the browser, but admin and protected-remote secrets must be
provided through environment variables.

## Deploy Notes

- This is a client-rendered Vite app with SPA rewrites configured in `vercel.json`.
- `.vercelignore` excludes local machine state such as `dist/`, `node_modules/`,
  temp files, and local env files from deploy uploads.

## License

MIT. See [LICENSE](LICENSE).
