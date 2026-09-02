# Admin app (Next.js)

This directory contains a minimal Next.js (App Router) + TypeScript scaffold for the admin UI.

Quick start (local):

1. cd admin
2. npm install
3. npm run dev

Deploying to Vercel:

- In Vercel, create a new project and point the Root Directory to `admin`.
- Build Command: `npm run build` (Vercel will auto-detect Next.js)
- Add any environment variables (e.g. NEXT_PUBLIC_API_URL) in the Vercel project settings.

Notes:
- This is a minimal scaffold. Replace the placeholder pages/components with your actual admin UI code.
- If you prefer the Pages Router instead of the App Router, move `app/page.tsx` to `pages/index.tsx` and adjust package.json as needed.
