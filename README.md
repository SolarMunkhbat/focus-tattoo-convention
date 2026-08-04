# FOCUS Tattoo Convention 2026

Next.js 16 (App Router) + TypeScript + Tailwind CSS + Firebase site for FOCUS
Tattoo Convention (2026.09.19–20, Улаанбаатар). All public content — artists,
schedule, sponsors, gallery, FAQ — is read live from Firestore/Storage, and is
managed through the `/admin` dashboard with no redeploy required.

## Stack

- **Next.js 16** App Router, TypeScript, Turbopack
- **Tailwind CSS v4**
- **Firebase**: Authentication (admin login), Firestore (content), Storage (images)
- **Framer Motion** for scroll/entrance animation

## 1. Create the Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com/) → **Add project**.
2. Inside the project, add a **Web app** (</> icon) → copy the `firebaseConfig` values.
3. **Build → Authentication** → Get started → enable the **Email/Password** provider.
4. **Build → Authentication → Users** → Add user → create the one admin account
   (this is the only login `/admin` will accept).
5. **Build → Firestore Database** → Create database → start in production mode.
6. **Build → Storage** → Get started.

## 2. Configure environment variables

Copy the example file and fill in the values from step 1:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

NEXT_PUBLIC_ADMIN_EMAIL=admin@focustattoo.mn   # same address as the user created in step 1.4
NEXT_PUBLIC_EVENT_START=2026-09-19T09:00:00+08:00
```

## 3. Lock down Firestore & Storage

`firestore.rules` and `storage.rules` in the repo root allow public **read** on
every collection, and **write** only from the admin account. Open both files
and replace the placeholder email with the same address as
`NEXT_PUBLIC_ADMIN_EMAIL`, then deploy them:

```bash
npm install -g firebase-tools   # once
firebase login
firebase use --add              # pick the project you created in step 1
firebase deploy --only firestore:rules,storage:rules
```

Without this step the app still runs, but writes from `/admin` will be
rejected by Firestore/Storage's default rules.

## 4. Run locally

```bash
npm install
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin) — log in
  with the account created in step 1.4. Everything you add (artists, schedule
  rows, sponsors, gallery images, FAQ) appears on the public site immediately.

## 5. Deploy to Vercel

1. Push this repo to GitHub.
2. [Import the repo in Vercel](https://vercel.com/new) — it auto-detects Next.js, no config needed.
3. In the Vercel project → **Settings → Environment Variables**, add the same
   variables from your `.env.local` (steps 2).
4. Deploy. Point your domain (e.g. `focustattooconvention.com`) at the Vercel
   project under **Settings → Domains**.

Because content lives in Firestore/Storage rather than in the repo, adding an
artist or a gallery photo through `/admin` afterward does **not** require a
new deploy.

## Firestore data model

| Collection | Fields |
|---|---|
| `artists` | `name, country, studio, style, instagram, bio, photoUrl, photoPath` |
| `schedule` | `day (1\|2), time, stage, title, description` |
| `sponsors` | `name, website, description, logoUrl, logoPath` |
| `gallery` | `imageUrl, storagePath, caption` |
| `faq` | `question, answer, order` |

Storage layout: `artists/`, `gallery/`, `sponsors/` — each object's `...Path`
field in Firestore is what admin deletes use to also remove the file from
Storage.

## Project structure

```
src/
  app/
    page.tsx              public one-page site
    admin/                admin dashboard (auth-gated)
      layout.tsx           route guard: shows LoginForm or AdminShell
      page.tsx              dashboard stats
      artists/ schedule/ sponsors/ gallery/ faq/
  components/              public site sections
  components/admin/        LoginForm, AdminShell, ImageUploadField
  lib/
    firebase.ts             client SDK init
    auth-context.tsx         React context around onAuthStateChanged
    firestore-crud.ts        addItem/updateItem/deleteItem, uploadImage/deleteImage
    hooks/useCollection.ts   realtime onSnapshot hook used by every section
    types.ts                 Firestore document shapes
firestore.rules / storage.rules / firebase.json
```

## Notes

- Admin access is a single hardcoded address (`NEXT_PUBLIC_ADMIN_EMAIL`),
  checked both client-side (UX) and in the Firestore/Storage rules (the real
  security boundary). To support multiple admins, switch the rules to check a
  custom claim instead and grant it via the Firebase Admin SDK.
- `.env.local` ships with clearly-fake placeholder values so `npm install &&
  npm run dev` doesn't crash before Firebase is connected — replace them with
  your real project's config per step 2.
- The map in the Contact section is a keyless Google Maps embed centered on
  Ulaanbaatar; swap `MAP_QUERY` in `src/components/ContactSection.tsx` for
  the exact venue address once it's confirmed.
