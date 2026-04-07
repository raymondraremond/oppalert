# ⚔️ Brutally Honest Audit: OppAlert

**Project Status:** Feature-Rich, Strategy-Poor.  
**Current Trajectory:** Fragmented "Kitchen Sink" platform destined for low conversion and technical collapse.

---

## Phase 1: The Assumption Destroyer
These are the most dangerous "Lies" the project is telling itself.

1.  **The "Luma for Africa" Illusion**: You assume you can build a premium event management platform (`/organizer`) alongside an opportunity aggregator (`/opportunities`). You are fighting a two-front war. Organizers won't pay 10k NGN to list on a platform where users are looking for "Free Scholarships." The intent is mismatched.
2.  **The "Scale-by-Scraping" Mirage**: Relying on Adzuna and Jooble adapters (`lib/services/`) means you are a "Second-Class Citizen" in the data world. If a scholarship is on Jooble, it’s already been seen by 10 million people. Your unique value prop is zero if you don't have human-curated, "Internal" opportunities that aren't on Google Jobs.
3.  **The "Stripe in Naira" Infrastructure**: Your code references Stripe (`lib/db.ts`, `prisma/schema.prisma`), but your UI says Paystack/Flutterwave. This mismatch indicates a chaotic transition. If your backend is built for Stripe and your frontend for Paystack, your checkout logic is likely a house of cards.
4.  **The "Hardcoded Success" Trap**: Your landing page claims "50k+ members" and "$12M+ funding disbursed." If these are mock values in a production-ready repo, you are building on a foundation of "Fake it 'till you make it" that will eventually lead to a PR disaster when your real stats show <100 active users.

---

## Phase 2: The Council’s Critique

### 🕵️ The Cynical VC
> "Your unit economics are a nightmare. 2,500 NGN/mo for 'Elite Access' is roughly $1.50 USD. Your payment processing fees from Flutterwave will eat a chunk of that. To hit a $10k MRR, you need ~7,000 paying students. There aren't 7,000 students in Nigeria with both the disposable income and the credit card stability to maintain a recurring subscription for 'Early Access' to info they can find on a 'Scholarship' Telegram bot for free. You're chasing pennies in a room full of people who are broke."

### 🏗️ The Technical Architect
> "The code is a 'Frankenstein' of philosophies. You have Prisma schemas you don't use, and a `lib/db.ts` file that manually defines SQL. Worse, your `SCHEMA_SQL` constant is out of sync with your API routes. Your code tries to `INSERT INTO events`, but the `events` table doesn't exist in your initialization script. This is a deployment time-bomb. Also, sequential API calls in `OpportunityService` without a cache (Redis) means your site performance is tied to the slowest external API. It's built to crawl."

### 🗣️ The User Advocate
> "The UI is 'Premium' in a way that feels alien. It’s too heavy. Glassmorphism and Backdrop Blurs are beautiful on a MacBook Pro in London, but they are 'Battery Killers' on a mid-range Infinix in Lagos on a 3G connection. Your 'Mobile First' claim is skin-deep. If the logic is heavy and the data-fetching is slow, the user will reach for their 2MB Telegram app every single time. You aren't solving for speed; you're solving for aesthetics. Wrong priority."

### 🚩 The Saboteur
> "The 'Red Team' finds your `auth.ts` implementation laughable. You’re using JWTs with `bcryptjs` on the edge without a secret rotation strategy. But the real kill-shot? Your 'Search' input on the landing page hits an API that triggers 4-5 external adapters. I could write a 3-line script to spam search queries and effectively DDOS your Adzuna/Jooble API keys, leaving you with a $0 credit balance and a broken site in 10 minutes. You have no rate-limiting, and no middleware protection on your most expensive routes."

---

## Phase 3: The Pre-Mortem (March 2027)

### 📰 HEADLINE: "OppAlert Pivot Fails; Domain Listed for Sale After Organizer Tier Hits 0 Registrations."

**Autopsy Report:**
The project failed because it tried to be everything to everyone. The "Organizer" feature was launched with fanfare but ignored by the market because the platform's audience was 99% "Seekers" with no money. The "Seeker Premium" tier saw a 95% churn rate after the first month because "48-hour Early Access" proved useless—scholarships don't disappear in 2 days. The technical team spent all their budget on Vercel and Database costs trying to keep up with bot scrapers who were stealing the data they had already scraped from elsewhere.

---

## Phase 4: Feature-by-Feature Autopsy

| Feature | Brutal Verdict | Fix or Kill? |
| :--- | :--- | :--- |
| **Seeker Dashboard** | A clone of every other job board. No "Alpha." | **Fix**: Add AI-powered "Match Score" based on user profile. |
| **Organizer Dashboard** | Ego project. Organizers use LinkedIn/Luma. | **Kill**: It's a distraction. Focus on user growth first. |
| **Aggregation Adapters** | Low-quality, high-latency data. | **Pivot**: Use them as "Fallback" ONLY. Human curation is your moat. |
| **Pricing (NGN)** | Too low for B2B, too high for B2C students. | **Pivot**: Move to an Affiliate/Ad model or B2B Lead Gen. |
| **SEO (Clean Slugs)** | "No hyphens" is an SEO suicide mission. | **Fix**: Use standard Kebab-case (`/scholarship-for-nigeria`). |

---

## Phase 5: The Path to 10/10 (Non-Negotiable Pivots)

1.  **MANDATORY: Database/ORM Alignment**: 
    Stop using two different schema definitions. Either commit to Prisma fully or update `lib/db.ts` to reflect the reality of the `events` and `registrations` tables. Your current infrastructure is a lie.
2.  **MANDATORY: Cache-First Architecture**: 
    Implement a background worker to fetch opportunities and store them locally. **NEVER** fetch from an external API during a user’s request. It’s slow, expensive, and a security risk. Your search should be hitting your own optimized Postgres index (or Meilisearch).
3.  **MANDATORY: Value Prop Realignment**: 
    Replace the "48h Early Access" (which is useless) with **"The Hidden List"**. Only premium users get access to niche, local, and low-competition African grants that aren't available on the global job boards. You sell *Discovery*, not *Speed*.
4.  **MANDATORY: "Distribution is King"**: 
    De-prioritize the Web App. Build the WhatsApp Bot **TODAY**. In your target market, the "Dashboard" is the thing people check once a week, but WhatsApp is the thing they check every 5 minutes. If you aren't in their notifications, you don't exist.

---
**The Council has finished the audit. We are ready to begin the demolition of these flaws, or you can continue to build on sand.**
