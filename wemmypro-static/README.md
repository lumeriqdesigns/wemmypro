# Wemmypro World — Static Marketing Site

Pure HTML + CSS + JavaScript. No build step. No database.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home |
| `about.html` | Brand story |
| `services.html` | Services |
| `work.html` | Portfolio (placeholders) |
| `gear.html` | Gear categories + terms |
| `academy.html` | Soft Academy page + enquiry form |
| `contact.html` | Contact info + form |
| `book.html` | Booking form + Wedding packages |

## How to view locally

Open any `.html` file in a browser, or run a simple local server:

```bash
# from inside this folder
npx serve .
# or
python3 -m http.server 8080
```

## Forms (Web3Forms)

Book, Contact, and Academy forms submit to:

`https://api.web3forms.com/submit`

The access key is **not** hardcoded. At build time it is injected from the environment variable:

```text
WEB3FORMS_ACCESS_KEY
```

Confirm the destination email in your [Web3Forms](https://web3forms.com) dashboard.

### Local build with key

```bash
# copy example env and paste your key
cp .env.example .env
# then either:
export WEB3FORMS_ACCESS_KEY=your-key-here
npm run build
```

## Deploy on Vercel (with environment variables)

### 1. Import the project
1. Push this folder to a GitHub/GitLab/Bitbucket repo (or use Vercel CLI).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. **Root Directory**: the folder that contains `index.html` and `vercel.json` (this site root).
4. Framework Preset: **Other**.
5. Build Command: `npm run build` (already in `vercel.json`).
6. Output Directory: `.` (site root).

### 2. Set Environment Variables
In the Vercel project → **Settings** → **Environment Variables**, add:

| Name | Value | Environments |
|------|--------|----------------|
| `WEB3FORMS_ACCESS_KEY` | `efcfb6cf-03b0-4817-9b49-4c5e03be41e3` | Production, Preview, Development |

Save, then **Redeploy** so the build injects the key into Book, Contact, and Academy forms.

### 3. Vercel CLI (optional)

```bash
npm i -g vercel
cd wemmypro-static
vercel login
vercel env add WEB3FORMS_ACCESS_KEY
# paste the key when prompted (for Production / Preview / Development)
vercel --prod
```

### 4. After deploy
- Open the live URL and send a test from **Book**, **Contact**, and **Academy**.
- In Web3Forms dashboard, restrict allowed domains to your Vercel domain (e.g. `your-project.vercel.app` and your custom domain).

## Other static hosts

Netlify, Cloudflare Pages, GitHub Pages, or cPanel also work.  
If the host has no build step, run `WEB3FORMS_ACCESS_KEY=... npm run build` locally first, then upload the folder.

## Contact details used on the site

- Phone / WhatsApp: +234 703 362 3929
- Email: wemmypro@gmail.com
- Location: Unity Road, Ilorin, Kwara State
- Instagram: @wemmyproworld

## Wedding packages (on Book page)

When the user selects **Wedding**, four packages appear:

- Silver — ₦400,000
- Golden — ₦800,000
- Crystal — ₦1,500,000
- Platinum — ₦2,700,000

© 2026 Wemmypro World
