# WemmyPro World — Unified site (marketing + studio)

One Next.js app for Vercel:

| Route | What |
|-------|------|
| `/` `/about` `/services` `/work` `/gear` `/academy` `/contact` | Marketing site |
| `/book` | Public booking (writes to Supabase) |
| `/login` | Studio admin login |
| `/admin/*` | Galleries, bookings, invoices, clients |
| `/g/[slug]` | Client galleries |
| `/i/[id]` | Public invoices |

## Deploy on Vercel

1. Push this `studio-gallery` folder (or the whole repo with root = this folder).
2. Import project in Vercel → Framework: **Next.js**.
3. Environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

4. In Supabase SQL Editor run `supabase/migrations/001_init.sql`.
5. Auth → create admin user (email + password).
6. Deploy.

**Admin from marketing:** Nav → **Admin** → `/admin` (redirects to `/login` if signed out).

## Local

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000

## Note

The old static HTML files in the parent `artifacts/` folder are superseded by this app for production. Keep them only as reference if needed.
