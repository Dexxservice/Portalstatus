-- Enable http extension if needed (for functions approach). Not required for Database Webhooks UI.
-- create extension if not exists http with schema extensions;

-- Basic applicant cases table
create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  applicant_user uuid, -- link to auth.users.id
  applicant_email text,
  status text not null default 'DOCS_RECEIVED',
  updated_at timestamp with time zone default now()
);

-- Simple RLS: applicants can see their rows, admins (role in app_metadata) can see all
alter table public.cases enable row level security;

create policy "read own case" on public.cases
for select using (auth.uid() = applicant_user);

create policy "admin read all" on public.cases
for select using (
  coalesce((auth.jwt() -> 'app_metadata' ->> 'role')::text, '') = 'admin'
);

create policy "admin update" on public.cases
for update using (
  coalesce((auth.jwt() -> 'app_metadata' ->> 'role')::text, '') = 'admin'
);

-- Trigger to update timestamp
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.cases;
create trigger set_updated_at
before update on public.cases
for each row execute procedure public.tg_set_updated_at();

-- NOTE: Configure a Database Webhook in Supabase UI:
--   Event: UPDATE on public.cases (column filter: status changed)
--   URL: https://<your-vercel-domain>/api/status-webhook
--   Secret header name: x-webhook-secret
--   Secret value: WEBHOOK_SECRET (same as in Vercel env)
