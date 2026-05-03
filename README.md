# Roomy — Home Swap Platform

![Roomy Logo](/public/images/roomylogo.png)

Roomy is a web application that connects people who want to swap homes for travel. Instead of paying for hotels or short-term rentals, users list their own property and browse others to arrange direct home exchanges. The idea: travel more, spend less, live like a local.

> **Status:** In development. Core listing, search, and profile features are complete. Swap matching is planned but not yet built.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)

---

## Features

**Currently implemented:**

- User registration, login, and logout via Clerk
- Create, edit, and delete your own property listing
- Upload and delete property images
- Set and update availability dates for your listing
- Browse all available listings
- Search and filter listings
- Bookmark listings you're interested in
- View individual listing detail pages

**Planned:**

- Swap request and matching system
- In-app messaging between matched users
- Swap history and status tracking

---

## Tech Stack

| Layer          | Technology                         |
| -------------- | ---------------------------------- |
| Framework      | Next.js 15 (App Router)            |
| Language       | TypeScript                         |
| Authentication | Clerk (OAuth 2.0 / OpenID Connect) |
| Database       | Supabase Postgres                  |
| ORM            | Drizzle ORM                        |
| File Storage   | Supabase Storage                   |
| Deployment     | Vercel                             |
| Styling        | Chakra UI + Framer Motion          |

---

## Architecture

Roomy is a full-stack Next.js application with no separate backend server. API routes live inside the Next.js app under `src/app/api/` and are deployed as Vercel serverless functions.
![Roomy web architechture diagram](/public/images/roomy_architecture_diagram.svg)

```
Browser
   │
   ▼
Next.js App (Vercel)
   ├── /app              → Pages and UI components
   ├── /app/api          → API route handlers (serverless)
   └── /lib              → Shared utilities (auth, rate limiting, logging)
   │
   ├──▶ Supabase Postgres   (via Drizzle ORM)
   ├──▶ Supabase Storage    (property images)
   └──▶ Clerk               (authentication)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Clerk](https://clerk.com) account
- A [Supabase](https://supabase.com) project

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/amandaht99/roomy-web
cd roomy-web
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

Duplicate `.env.example` and rename it to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the required values — see [Environment Variables](#environment-variables) below.

**4. Run database migrations**

```bash
npm run db:migrate
```

**5. Start the development server**

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

| Variable                            | Description                             |
| ----------------------------------- | --------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (public)          |
| `CLERK_SECRET_KEY`                  | Clerk secret key (server only)          |
| `NEXT_PUBLIC_SUPABASE_URL`          | Supabase project URL                    |
| `SUPABASE_SERVICE_ROLE_KEY`         | Supabase service role key (server only) |
| `DATABASE_URL`                      | Postgres connection string              |

> Never commit `.env.local` or any file containing real credentials. All secrets are loaded from environment variables at runtime — no credentials are hardcoded in the source.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── flats/          # Listing CRUD, search, date management
│   │   └── upload/         # Image upload handler
│   └── ...                 # Pages and UI
├── controllers/
│   └── flats.ts            # Database query logic
├── lib/
│   ├── rateLimit.ts        # Per-IP rate limiting
│   ├── withLogging.ts      # Request logging wrapper
│   ├── logger.ts           # Structured logger
│   └── supabase-server.ts  # Supabase client (server only)
└── db/
    └── schema.ts           # Drizzle ORM schema
```

---

## Security

A full threat model and security assessment is included in the repository documentation. Key measures implemented:

- Route-level authentication via Clerk on all write operations
- Ownership verification before any mutation or deletion
- Magic byte validation on file uploads (not just MIME type headers)
- Per-IP rate limiting on upload, search, and listing creation
- Security headers configured globally (CSP, X-Frame-Options, etc.)
- Parameterized queries via Drizzle ORM throughout
- All secrets stored in environment variables — none hardcoded in source

See `docs/threat-model.docx` for the full assessment.
