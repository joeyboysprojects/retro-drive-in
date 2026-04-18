create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key,
  email text unique not null,
  first_name text not null,
  last_name text not null,
  phone text,
  membership_type text not null default 'free' check (membership_type in ('free', 'paid')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan_code text not null,
  status text not null,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.billing_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_invoice_id text,
  stripe_payment_intent_id text,
  event_type text not null,
  amount numeric,
  currency text,
  status text,
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.billing_events enable row level security;

create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id);

create policy "subscriptions_select_own" on public.subscriptions
for select using (auth.uid() = user_id);

create policy "billing_events_select_own" on public.billing_events
for select using (auth.uid() = user_id);
