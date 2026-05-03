# Roomy — Home Swap Platform

![Roomy Logo](/public/images/roomylogo.png)

Roomy is a web application that connects people who want to swap homes for travel. Instead of paying for hotels or short-term rentals, users list their own property and browse others to arrange direct home exchanges. Travel more, spend less, live like a local.

> **Status:** In development. Core listing, search, and profile features are complete. Swap matching is planned but not yet built.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Security](#security)
  - [Threat Model](#threat-model)
  - [Implemented Security Measures](#implemented-security-measures)

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

Network-layer security (TLS 1.3, DDoS protection, HTTPS) is handled automatically by Vercel's edge infrastructure.

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

| Variable                            | Description                                              |
| ----------------------------------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (safe to expose to the browser)    |
| `CLERK_SECRET_KEY`                  | Clerk secret key — server only, never sent to the client |
| `NEXT_PUBLIC_SUPABASE_URL`          | Supabase project URL                                     |
| `SUPABASE_SERVICE_ROLE_KEY`         | Supabase service role key — server only, bypasses RLS    |
| `DATABASE_URL`                      | Postgres connection string                               |

> Never commit `.env.local`. All credentials are loaded from environment variables at runtime — nothing is hardcoded in source.

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

### Threat Model

This section covers the threat model for Roomy using the STRIDE framework (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege).

#### Assets

The following are the things most worth protecting in this application:

| Asset           | Notes                                                                     |
| --------------- | ------------------------------------------------------------------------- |
| User identities | Clerk session JWTs and verified user IDs                                  |
| Listing data    | Flat records, addresses, availability dates, owner relationships          |
| Uploaded images | Property photos in Supabase flat-images bucket                            |
| Database        | Postgres via DATABASE_URL — Flat, Address, Swap tables                    |
| Secrets         | CLERK_SECRET_KEY, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL — env vars only |

#### Entry Points

| Endpoint                   | Method | Auth                                    |
| -------------------------- | ------ | --------------------------------------- |
| `/api/flats/search`        | POST   | None — public search                    |
| `/api/flats/[flatId]`      | GET    | None — public read                      |
| `/api/flats/[flatId]`      | DELETE | auth() + ownership check                |
| `/api/flats/[flatId]/date` | PUT    | auth() + ownership check                |
| `/api/flats/user/[userId]` | POST   | auth() — identity from session, not URL |
| `/api/flats/all/[userId]`  | GET    | None — public read                      |
| `/api/upload`              | POST   | auth() + ownership check                |

#### Trust Boundaries

A trust boundary is where data moves from one zone to another. These are the points where things go wrong if controls are missing.

- **Browser to Next.js API routes** — all user input enters here. Client-side validation is advisory only, everything gets checked again server-side.
- **Server to Supabase Postgres** — the app holds `DATABASE_URL`. Drizzle ORM uses parameterized queries so SQL injection isn't possible at this boundary.
- **Server to Supabase Storage** — uses `SUPABASE_SERVICE_ROLE_KEY` server-side, which bypasses Row Level Security. That's intentional, access control is handled at the API layer instead. The key never reaches the client.
- **Server to Clerk** — session JWTs are verified via `auth()` from `@clerk/nextjs/server` using Clerk's public key.
- **Network** — TLS 1.3 is enforced by Vercel's edge on all traffic automatically.

#### STRIDE Threat Analysis

| ID   | Threat                                                     | STRIDE | Component                     | Severity | Status     |
| ---- | ---------------------------------------------------------- | ------ | ----------------------------- | -------- | ---------- |
| T-01 | Unauthenticated flat creation — no auth() on POST          | E / S  | POST /api/flats/user/[userId] | CRITICAL | ✅ Fixed   |
| T-02 | Unauthenticated date mutation — no auth() on PUT           | T / E  | PUT /api/flats/[flatId]/date  | CRITICAL | ✅ Fixed   |
| T-03 | IDOR — URL userId used as identity without session check   | S / E  | POST /api/flats/user/[userId] | HIGH     | ✅ Fixed   |
| T-04 | Internal error messages returned to client                 | I      | withLogging.ts                | MEDIUM   | 🔴 Open    |
| T-05 | Rate limiting per-instance only — not globally consistent  | D      | All routes                    | MEDIUM   | 🟡 Partial |
| T-06 | No schema validation on request bodies                     | T      | All mutation routes           | HIGH     | 🔴 Open    |
| T-07 | Public storage bucket — image URLs accessible without auth | I      | Supabase Storage              | LOW      | 🔴 Open    |
| T-08 | No CSP headers — XSS via injected scripts                  | T / E  | next.config.js                | MEDIUM   | ✅ Fixed   |
| T-09 | Swap table has no auth layer — routes not yet built        | E / T  | DB Schema                     | HIGH     | 🔴 Open    |
| T-10 | Service-role key bypasses RLS for all server operations    | E      | supabase-server.ts            | MEDIUM   | 🔴 Open    |
| T-11 | DELETE flat did not clean up images from storage           | I      | DELETE /api/flats/[flatId]    | LOW      | ✅ Fixed   |
| T-12 | Clerk middleware passive — no default-deny on routes       | E      | proxy.ts                      | MEDIUM   | 🔴 Open    |

**Fixed threats:**

**T-01 & T-02** were probably the most critical ones. The flat creation and date update routes had no login check at all, so anyone who knew the URL could create or change listings without a session. Both now call `auth()` first and return 401 if there's no session, 403 if the user doesn't own the resource.

**T-03** (IDOR, Insecure Direct Object Reference) was fixed by ignoring the `userId` URL parameter and always using the owner ID from the verified Clerk session instead. Using a user-supplied ID for ownership is a classic mistake.

**T-08** CSP and security headers got added in `next.config.js`. XSS (Cross-Site Scripting) is when an attacker injects malicious scripts into a page. CSP limits the damage by restricting which domains can run scripts. One tradeoff: `unsafe-inline` is needed for Clerk's components which slightly weakens this.

**T-11** came out of doing this threat model. When a flat was deleted the database row was removed but the images stayed in Supabase Storage with their public URLs still working. That's a GDPR right to erasure issue so the DELETE handler now cleans up storage first.

**Open threats and known limitations:**

**T-04** raw error messages from the ORM currently show up in API responses. In production that should be a generic message with the full error staying in server logs only.

**T-05** rate limiting is in place but the counters are in-memory per serverless instance. Vercel runs multiple instances that don't share state so the effective limit is softer than configured. A Redis-backed store would fix this properly.

**T-06** no schema validation library like Zod on mutation routes. Field values reach the database after only basic manual checks.

**T-07** the flat-images bucket is public so image URLs work for anyone who has them. Fine for a listings platform but worth noting. A private bucket with short-lived signed URLs would be the proper fix.

**T-09** the Swap table exists in the schema but no routes have been built yet. Flagged so auth and ownership checks go in from the start when that gets built.

**T-10** the Supabase client uses the service-role key which bypasses RLS entirely. Intentional, the app handles access control at the API layer. The tradeoff is there's no database-level fallback if an auth bug were ever introduced.

**T-12** Clerk middleware in `proxy.ts` only logs timing. Route protection is opt-in via individual `auth()` calls so a new route without one is silently unprotected.

---

### Implemented Security Measures

#### Authentication & Ownership

All write routes check for a valid Clerk session first. The user ID always comes from the session, never from URL parameters.

```ts
const { userId } = await auth();
if (!userId) {
  return NextResponse.json(
    { error: "Authentication required" },
    { status: 401 },
  );
}

if (flat[0].ownerId !== userId) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

#### File Upload Validation

Checking the `Content-Type` header isn't enough. Anyone can rename a file and the header will lie. The upload route reads the actual binary signature at the start of the file (magic bytes) to check what it really is.

```ts
function isSupportedImageMagicBytes(bytes: Uint8Array) {
  if (bytes.length < 4) return false;

  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47;
  const isWebp =
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46;

  return isJpeg || isPng || isWebp;
}
```

Also enforced: max 3 files, max 5 MB each, MIME type allowlist, filename sanitisation before the name is used as a storage path.

#### Rate Limiting

Per-IP rate limiting on upload (10/min), flat creation (5/min), and search (30/min). Returns `429 Too Many Requests` with a `Retry-After` header when exceeded.

```ts
export function enforceRateLimit(
  request: NextRequest,
  options: RateLimitOptions,
): NextResponse | null {
  const ip = getClientIp(request);
  const existing = store.get(`${options.key}:${ip}`);

  if (!existing || existing.resetAt <= Date.now()) {
    store.set(`${options.key}:${ip}`, {
      count: 1,
      resetAt: Date.now() + options.windowMs,
    });
    return null;
  }

  if (existing.count >= options.limit) {
    const retryAfter = Math.ceil((existing.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: `Rate limit exceeded. Try again in ${retryAfter}s.` },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  existing.count += 1;
  return null;
}
```

#### Security Headers

Configured globally in `next.config.js`:

- **CSP** restricts which domains can run scripts and load resources
- **X-Frame-Options: DENY** prevents the app being embedded in an iframe (clickjacking)
- **X-Content-Type-Options: nosniff** stops the browser guessing file types
- **Referrer-Policy** controls what URL info gets passed to other sites
- **Permissions-Policy** disables browser features the app doesn't use (camera, microphone, geolocation)

#### Storage Cleanup on Delete

When a flat is deleted, images get removed from Supabase Storage before the database row is touched. If storage removal fails the error gets logged but the deletion still goes through. Leaving a user unable to delete their listing is worse than a file sitting in storage a bit longer.

```ts
if (flat.imagesPaths.length > 0) {
  const { error: storageError } = await supabase.storage
    .from("flat-images")
    .remove(flat.imagesPaths);

  if (storageError) {
    logger.warn("Failed to remove flat images from storage", {
      flatId: parsedFlatId,
      error: storageError,
    });
  }
}
```

#### Open Redirect Prevention

After login users can be sent back to the page they came from via a `redirectUrl` query param. Without validation this could send someone to a phishing site after a legitimate login. Only relative paths starting with `/` are accepted, anything else falls back to `/home`.

```ts
const fallbackRedirectUrl =
  redirectUrlParam && redirectUrlParam.startsWith("/")
    ? redirectUrlParam
    : "/home";
```

#### SQL Injection Prevention

All database queries go through Drizzle ORM which parameterizes queries by default. No raw SQL string interpolation in the codebase.

#### Secrets Management

No credentials hardcoded anywhere in source. All secrets loaded via `process.env`. The Supabase client throws at startup if required variables are missing. Passwords are never stored or processed by the app, authentication is fully delegated to Clerk.
