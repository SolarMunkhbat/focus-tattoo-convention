# FOCUS Tattoo Convention 2026

Next.js 16 (App Router) + TypeScript + Tailwind CSS site for FOCUS Tattoo
Convention (2026.09.19–20, Улаанбаатар). All public content — artists,
schedule, tattoo battle categories, sponsors, gallery, FAQ — lives in a single
JSON file on **Vercel Blob** and is managed through the `/admin` dashboard.
No Firebase, no separate database — everything runs on Vercel.

## Stack

- **Next.js 16** App Router, TypeScript, Turbopack, Route Handlers for the API
- **Tailwind CSS v4**
- **Vercel Blob** — stores `content.json` (all site data) and every uploaded image
- **Framer Motion** for scroll/entrance animation
- Admin auth: a single username/password (env vars) + a signed, HttpOnly session cookie — no external auth service

## How content works

`GET /api/content` returns one JSON object with every section
(`artists, schedule, battles, sponsors, gallery, faq`), read from a
`content.json` blob. The public site polls it every 20s, so admin edits show
up on their own without a redeploy or a page refresh.

Admin writes go through their own routes (`POST/PUT/DELETE
/api/content/[section]/[id]`), each of which re-reads the blob, edits the one
array, and writes it back — simple, no external database to run.

## 1. Set up Vercel Blob

1. Push this repo to GitHub and [import it into Vercel](https://vercel.com/new) (auto-detected as Next.js, no config needed) — **or**, for local dev first, just create the Blob store before deploying:
2. Vercel Dashboard → your project (or **Storage** tab if not yet deployed) → **Create Database** → **Blob** → connect it to this project.
3. Pull the generated token down locally:
   ```bash
   npx vercel link          # once, links this folder to the Vercel project
   npx vercel env pull .env.local
   ```
   This writes `BLOB_READ_WRITE_TOKEN` into `.env.local` for you. (Alternatively copy it manually from Storage → your Blob store → **.env.local** tab.)

## 2. Set the admin login + session secret

Add to `.env.local` (see `.env.local.example`):

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<pick something strong>
SESSION_SECRET=<random string, e.g. `openssl rand -base64 24`>
NEXT_PUBLIC_EVENT_START=2026-09-19T09:00:00+08:00
```

These three (plus `BLOB_READ_WRITE_TOKEN`) also need to be added in **Vercel
→ Project → Settings → Environment Variables** before deploying.

## 3. Run locally

```bash
npm install
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000) — works even
  before Blob is connected (falls back to built-in default content, including
  the real Day 1/Day 2 battle categories).
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin) — log in
  with `ADMIN_USERNAME` / `ADMIN_PASSWORD`. Everything you add (artists,
  schedule rows, battle categories, sponsors, gallery images, FAQ) appears on
  the public site within ~20s, no redeploy.

## 4. Deploy to Vercel

1. Push to GitHub, import into Vercel (if not already done in step 1).
2. Add the env vars from step 2 (+ `BLOB_READ_WRITE_TOKEN`) in **Settings → Environment Variables**.
3. Deploy. Point your domain (e.g. `focustattooconvention.com`) at the project under **Settings → Domains**.

## Content sections

| Section | Fields |
|---|---|
| `artists` | `name, country, studio, style, instagram, bio, photoUrl, photoPath` |
| `schedule` | `day (1\|2), time, stage, title, description` |
| `battles` | `day (1\|2), groupName, itemNumber, itemText, order` — seeded by default with the real competition categories |
| `sponsors` | `name, website, description, logoUrl, logoPath` |
| `gallery` | `imageUrl, storagePath, caption` |
| `faq` | `question, answer, order` |

Images upload to Vercel Blob under `artists/`, `gallery/`, `sponsors/`; the
`...Path` field stored alongside each item is what admin deletes use to also
remove the file from Blob.

## Project structure

```
src/
  app/
    page.tsx              public one-page site
    api/
      content/route.ts               GET — public, whole content.json
      content/[section]/route.ts     POST — admin, add item
      content/[section]/[id]/route.ts PUT/DELETE — admin, edit/remove item
      upload/route.ts                POST/DELETE — admin, image upload/delete
      admin/login|logout|me/route.ts admin session
    admin/                 admin dashboard (auth-gated)
      layout.tsx            route guard: shows LoginForm or AdminShell
      page.tsx               dashboard stats
      artists/ schedule/ battles/ sponsors/ gallery/ faq/
  components/               public site sections
  components/admin/         LoginForm, AdminShell, ImageUploadField
  lib/
    blob-content.ts          server-only: read/write content.json on Blob
    session.ts                server-only: signed cookie session + password check
    require-admin.ts          server-only: reads the session from a route handler
    content-context.tsx       client: ContentProvider, polls /api/content
    content-client.ts         client: addItem/updateItem/deleteItem/uploadImage/deleteImage
    hooks/useCollection.ts    client: {data,loading,error} for one section
    types.ts                  shared document shapes
```

## Notes

- There's exactly one admin account, checked against `ADMIN_USERNAME` /
  `ADMIN_PASSWORD` server-side; the session is a signed cookie (HMAC with
  `SESSION_SECRET`), not stored anywhere server-side — works fine on
  serverless/Vercel since there's no shared memory between invocations.
- The `content.json` blob is a single JSON document — every write re-reads,
  edits, and re-writes the whole thing. Fine for one admin editing
  occasionally; if edits ever need to happen concurrently from multiple
  people, that's the thing to revisit first.
- The map in the Contact section is a keyless Google Maps embed; swap
  `MAP_QUERY` in `src/components/ContactSection.tsx` if the venue changes.
