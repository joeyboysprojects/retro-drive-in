# Starlite Drive-In

A React + Vite frontend for a retro-themed drive-in theater experience, now scaffolded for public deployment with Supabase authentication, Stripe billing, and Vercel hosting.

## Tech stack

- Frontend: React + Vite
- Auth and database: Supabase
- Billing: Stripe
- Hosting and API routes: Vercel

## Local development

Install dependencies:

```bash
npm install
```

Start the Vite dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Environment setup

Copy [.env.example](.env.example) to a local `.env` file and fill in the required values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `APP_BASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID_MONTHLY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Supabase setup

Run the SQL in [supabase/schema.sql](supabase/schema.sql) inside your Supabase SQL editor.

This creates:

- `profiles`
- `subscriptions`
- `billing_events`

and applies row-level security policies for user-scoped access.

## Stripe and Vercel API routes

The project includes scaffolding for these Vercel routes:

- [api/create-checkout-session.js](api/create-checkout-session.js)
- [api/create-customer-portal-session.js](api/create-customer-portal-session.js)
- [api/stripe-webhook.js](api/stripe-webhook.js)

These files are intentionally scaffolded so you can connect real keys and then add database sync logic.

## Frontend integration status

The account and membership UI in [src/App.jsx](src/App.jsx) is now structured for:

- free account signup and sign-in states
- paid membership upgrade entry points
- profile management fields
- previous charge display placeholders
- Stripe billing management hooks

The current UI uses local demo state until live Supabase and Stripe credentials are connected.

## Planning artifacts

Architecture and rollout plan:

- [plans/supabase-stripe-vercel-plan.md](plans/supabase-stripe-vercel-plan.md)

## Recommended next steps

1. Install the needed SDK packages in [package.json](package.json)
2. Create the Supabase project and run [supabase/schema.sql](supabase/schema.sql)
3. Create the Stripe product and monthly price
4. Add environment variables in Vercel and local `.env`
5. Replace the local auth and billing placeholders in [src/App.jsx](src/App.jsx) with live calls through [src/lib/supabase.js](src/lib/supabase.js) and the Vercel API routes
6. Test the full upgrade flow end to end in Stripe test mode
