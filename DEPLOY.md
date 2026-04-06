# RankPulse - Deployment Instructions

## Your app is ready. Follow these 3 steps to go live.

---

### Step 1: Deploy to Vercel (2 minutes)

1. Go to **https://vercel.com/new** (sign up with any account)
2. Choose **"Add New..." → Project**
3. Click **"Deploy"** button on the page (it will ask you to import from Git or upload)
4. If you want to import from Git: push your repo to GitHub first
   ```bash
   cd C:\Users\Admin\Desktop\test
   git remote add origin https://github.com/YOUR-USERNAME/rankpulse.git
   git push -u origin main
   ```

Or, simply run this from the project directory:
```bash
npx vercel deploy
```
It will open your browser to log in, then deploy automatically.

---

### Step 2: Add Environment Variables (in Vercel dashboard)

Go to: Project → Settings → Environment Variables → Add these:

| Key                      | Value                                    |
|--------------------------|------------------------------------------|
| `DATABASE_URL`           | `file:./dev.db` (see Step 3 for SQLite workaround) |
| `NEXTAUTH_SECRET`        | `865ddd0a74ea68a386729455a54de65d1cc4caf753948601395bf4bc6bd58096` |
| `NEXTAUTH_URL`           | `https://YOUR-PROJECT.vercel.app` (replace with your Vercel URL) |
| `STRIPE_SECRET_KEY`      | `sk_live_xxx` (from dashboard.stripe.com, or leave empty for testing) |
| `STRIPE_WEBHOOK_SECRET`  | `whsec_xxx` (from Stripe Webhooks) |
| `STRIPE_PRO_PRICE_ID`    | `price_xxx` (from Stripe Product) |
| `STRIPE_AGENCY_PRICE_ID` | `price_xxx` (from Stripe Product) |
| `OPENAI_API_KEY`         | `sk-xxx` (optional, for AI suggestions) |

**IMPORTANT - Database**: Vercel serverless doesn't support SQLite well. Use one of these free PostgreSQL providers:
- **Neon.tech** (free, instant): Go to neon.tech → sign up → copy connection string → paste as `DATABASE_URL`
- **Supabase** (free): Go to supabase.com → new project → Settings → Database → copy URI
- **Railway** (free tier): Go to railway.app → new PostgreSQL project

---

### Step 3: Set Up Stripe (for real payments)

1. Create account at **dashboard.stripe.com/register**
2. Go to **Products** → Create:
   - "RankPulse Pro" → $29/month → copy the `price_xxx` ID
   - "RankPulse Agency" → $79/month → copy the `price_xxx` ID
3. Go to **Developers → API Keys** → copy "Secret key" (`sk_live_...`)
4. Go to **Developers → Webhooks** → Add endpoint:
   - URL: `https://YOUR-VERCEL-URL.vercel.app/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`
5. Copy the webhook secret (`whsec_...`)
6. Add all 4 values to Vercel environment variables

---

### Step 4: Get a Custom Domain (optional but looks professional)

1. Buy domain from Namecheap or Cloudflare (~$12/year)
2. In Vercel → Settings → Domains → Add domain
3. Follow DNS setup instructions
4. Update `NEXTAUTH_URL` to your new domain

---

## You're Live. Revenue starts flowing.

Your landing page converts visitors at the URL. Free tier hooks them, paywall upsells to Pro.
