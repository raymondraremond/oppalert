data: {"type":"start"}

data: {"type":"start-step"}

data: {"type":"tool-input-start","toolCallId":"xnanwt23x","toolName":"search_opportunities"}

data: {"type":"tool-input-delta","toolCallId":"xnanwt23x","inputTextDelta":"{\"category\":\"all\",\"keyword\":\"fgedbh\",\"limit\":5}"}

data: {"type":"tool-input-available","toolCallId":"xnanwt23x","toolName":"search_opportunities","input":{"keyword":"fgedbh","category":"all","limit":5}}

data: {"type":"tool-output-available","toolCallId":"xnanwt23x","output":[]}

data: {"type":"finish-step"}

data: {"type":"finish","finishReason":"tool-calls"}

data: [DONE]

# OppFetch 🚀

> **"Never miss an opportunity again."**

A production-ready, mobile-first opportunity discovery platform for African students, graduates, and founders. Discover scholarships, remote jobs, fellowships, grants, and startup funding — all in one place.

---

## Quick Start (VS Code)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your real keys (see setup guide below)

# 3. Run development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

That's it. The app runs fully with mock data out of the box — no database required to start.

---

## Project Structure

```
oppfetch/
├── app/
│   ├── page.tsx                    ← Landing page
│   ├── opportunities/
│   │   ├── page.tsx                ← Listings + filters
│   │   └── [id]/page.tsx           ← Opportunity detail + SEO
│   ├── dashboard/page.tsx          ← User dashboard
│   ├── admin/page.tsx              ← Admin panel
│   ├── pricing/page.tsx            ← Pricing page
│   └── api/
│       ├── opportunities/route.ts  ← GET/POST opportunities
│       ├── auth/register/route.ts  ← User registration
│       ├── auth/login/route.ts     ← User login
│       ├── user/saved/route.ts     ← Save/unsave opportunities
│       ├── stripe/checkout/route.ts← Create Stripe session
│       ├── stripe/webhook/route.ts ← Stripe event handler
│       └── newsletter/route.ts     ← Newsletter subscription
├── components/
│   ├── Navbar.tsx
│   ├── OpportunityCard.tsx
│   ├── PremiumBanner.tsx
│   └── Footer.tsx
├── lib/
│   ├── data.ts                     ← Seed data (replace with DB queries)
│   ├── types.ts                    ← TypeScript interfaces
│   └── utils.ts                    ← Helper functions
└── .env.example                    ← Environment variable template
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, featured listings, categories, newsletter |
| `/opportunities` | Full listings with sidebar filters |
| `/opportunities/[id]` | Opportunity detail with countdown, apply button, related |
| `/dashboard` | User dashboard — overview, saved, alerts, profile |
| `/admin` | Admin panel — manage listings, users, analytics |
| `/pricing` | Pricing page — Free vs Premium, org packages |

---

## Environment Variables Setup

### 1. Database — Neon (free PostgreSQL)
1. Go to [neon.tech](https://neon.tech) → Create free project
2. Copy the connection string
3. Set `DATABASE_URL=postgresql://...` in `.env.local`

### 2. Auth
Generate a strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Set `JWT_SECRET=<output>`

### 3. Stripe (payments)
1. Sign up at [stripe.com](https://stripe.com)
2. Dashboard → Developers → API Keys → copy keys
3. Create a Product → Recurring → $3/month
4. Copy the Price ID (starts with `price_`)
5. Set up webhook: Dashboard → Webhooks → Add endpoint
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`

### 4. Email — Resend (free: 3,000 emails/month)
1. Sign up at [resend.com](https://resend.com)
2. Create API key
3. Add `RESEND_API_KEY=re_...`

---

## Database Schema (PostgreSQL)

Run this SQL in your Neon / Supabase console to create all tables:

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  status VARCHAR(50) DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunities
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon VARCHAR(10),
  title VARCHAR(500) NOT NULL,
  organization VARCHAR(255),
  category VARCHAR(100),
  location VARCHAR(255),
  funding_type VARCHAR(100),
  description TEXT,
  about TEXT,
  eligibility TEXT[],
  benefits TEXT[],
  application_url TEXT,
  deadline DATE,
  days_remaining INT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved opportunities
CREATE TABLE saved_opportunities (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, opportunity_id)
);

-- Stripe subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  stripe_subscription_id TEXT UNIQUE,
  status VARCHAR(50),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  frequency VARCHAR(20) DEFAULT 'weekly',
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alert preferences
CREATE TABLE alert_preferences (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  new_opportunity_email BOOLEAN DEFAULT TRUE,
  deadline_reminders BOOLEAN DEFAULT TRUE,
  weekly_digest BOOLEAN DEFAULT TRUE,
  instant_alerts BOOLEAN DEFAULT FALSE,
  categories TEXT[],
  countries TEXT[]
);
```

---

## Connecting a Real Database

In `app/api/`, all routes contain commented-out PostgreSQL queries ready to activate.

Install the driver:
```bash
npm install pg @types/pg bcryptjs @types/bcryptjs jsonwebtoken @types/jsonwebtoken
```

Create `lib/db.ts`:
```typescript
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Neon
})

export default pool
```

Then in your API routes, replace mock code with:
```typescript
import db from '@/lib/db'
const result = await db.query('SELECT * FROM opportunities WHERE id = $1', [id])
```

---

## Deployment

### Deploy to Vercel (recommended, free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# Project Settings → Environment Variables → add all from .env.example
```

Or connect your GitHub repo to Vercel for automatic deploys on every push.

### Production Checklist

- [ ] Set all environment variables in Vercel dashboard
- [ ] Run database schema SQL in production DB
- [ ] Create Stripe webhook pointing to `https://yourdomain.com/api/stripe/webhook`
- [ ] Verify `NEXT_PUBLIC_APP_URL` is set to production URL
- [ ] Test payment flow end-to-end with Stripe test cards
- [ ] Replace mock data in `lib/data.ts` with DB queries

---

## Monetization

| Stream | Implementation |
|---|---|
| **Premium subscription ($3/mo)** | Stripe Checkout → `/api/stripe/checkout` |
| **Featured listings ($25–$150)** | Admin panel → mark as featured |
| **Newsletter sponsorship** | Contact form → custom pricing |
| **Affiliate links** | Replace apply buttons with tracked affiliate links |

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon / Supabase)
- **Payments**: Stripe
- **Email**: Resend
- **Auth**: JWT + bcrypt
- **Deployment**: Vercel

---

## Support

Built with ❤️ by the OppFetch team.
