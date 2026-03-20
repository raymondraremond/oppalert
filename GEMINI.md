# OppAlert - Project Context

OppAlert is a production-ready, mobile-first opportunity discovery platform designed for African students, graduates, and founders. It aggregates scholarships, remote jobs, fellowships, grants, and startup funding.

## Project Overview

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via `pg` driver, no ORM currently active in code, though `prisma/schema.prisma` exists as a reference)
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` for password hashing
- **Payments**: Stripe integration for premium subscriptions
- **Email**: Resend for newsletter and notifications
- **Icons**: Lucide React

## Architecture

- **App Router (`app/`)**: Standard Next.js 14 structure with API routes and page components.
- **Service Layer (`lib/services/`)**: Uses an adapter pattern (`OpportunityService`) to fetch data from multiple sources:
  - `DbAdapter`: Fetches from the internal PostgreSQL database via API calls.
  - `AdzunaAdapter` & `JoobleAdapter`: (Placeholders/Implementations for external job APIs).
- **Database Layer (`lib/db.ts`)**: Manages a PostgreSQL connection pool and contains the SQL schema for initialization.
- **Mock Data (`lib/data.ts`)**: Provides a fallback when `DATABASE_URL` is not configured, allowing for immediate development.

## Building and Running

### Commands

- **Install dependencies**: `npm install`
- **Run development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Start production server**: `npm run start`
- **Linting**: `npm run lint`

### Environment Setup

Create a `.env.local` based on `.env.example`. Key variables include:
- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: Secret for signing tokens.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`: For payment processing.
- `RESEND_API_KEY`: For email services.

## Development Conventions

- **API Routes**: Located in `app/api/`, following RESTful patterns.
- **Components**: Functional React components using Tailwind CSS for styling.
- **Types**: Shared interfaces are defined in `lib/types.ts` and `lib/services/types.ts`.
- **Database**: Use direct SQL queries via the `query` function in `lib/db.ts` for database interactions.
- **Validation**: Ensure `DATABASE_URL` is set to enable real database features; otherwise, the app defaults to seed data.

## Key Files

- `oppalert/prisma/schema.prisma`: Reference database schema (Note: Prisma client is not currently a dependency).
- `oppalert/lib/db.ts`: Contains the source-of-truth SQL schema in the `SCHEMA_SQL` constant.
- `oppalert/middleware.ts`: Handles session management and protected routes.
- `oppalert/lib/auth.ts`: Logic for JWT verification and token management.
