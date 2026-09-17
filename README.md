# Maison Drape

Production-ready, SEO-optimized e-commerce and lead-generation website for a curtains and blinds business.

Built with Next.js (App Router), Tailwind CSS, and Supabase (Postgres + Auth + Storage).

## Tech stack

- Next.js 14+ (App Router, Server Components, Server Actions)
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui primitives
- Supabase: Postgres (RLS), Auth (`@supabase/ssr`), Storage
- sharp for server-side image processing
- Zod + react-hook-form
- Framer Motion

## Getting started

```bash
# Install dependencies
npm install

# Copy environment template and fill in values
cp .env.example .env.local

# Run the development server
npm run dev
```

Apply `supabase/schema.sql` (and optionally `supabase/seed.sql`) in the Supabase SQL editor before using live data.

Without Supabase credentials the public site and admin demo still run on fallback content.

## Environment

See `.env.example` for Supabase, site URL, WhatsApp, and analytics variables.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
