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

1. Push this folder (or set project root to this folder).
2. Import project in Vercel → Framework: **Next.js**.
3. **Environment variables** (Project → Settings → Environment Variables). Set for **Production**, **Preview**, and **Development**:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

4. Redeploy after adding env vars (Deployments → … → Redeploy). Env vars are only applied on a new deploy.
5. In Supabase SQL Editor run `supabase/migrations/001_init.sql`.
6. Auth → Users → Add user (email + password) for admin login.
7. Deploy.

**Admin:** `/admin` redirects to `/login` if signed out.

## Local

```bash
cp .env.example .env.local
# fill in Supabase values
npm install
npm run dev
```

Open http://localhost:3000

## Troubleshooting: `500 MIDDLEWARE_INVOCATION_FAILED` on `/admin`

This error means the Edge middleware threw. Usual causes:

1. **Missing env vars on Vercel** — `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` not set (or not set for Production). Fix: add them, then **redeploy**.
2. **Wrong values** — URL must be `https://xxxx.supabase.co` (no trailing slash). Keys from Supabase → Project Settings → API.
3. **Old deployment** — after changing env vars you must trigger a new deployment.

Middleware is hardened to log missing keys and redirect `/admin` → `/login` instead of crashing. Check **Vercel → Deployment → Functions / Logs** for `Missing NEXT_PUBLIC_SUPABASE_...` or `Supabase middleware error`.

## Note

Static HTML in the parent `artifacts/` folder is superseded by this app for production.
