-- ─────────────────────────────────────────────────────────────
-- Flash-Tech Contractor Portal — DISTRIBUTOR LOGINS
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Safe to re-run: every statement is IF NOT EXISTS / idempotent.
-- ─────────────────────────────────────────────────────────────

-- 1. Link a customer (contractor) to the distributor that owns them.
--    NULL = house account, only Flash-Tech admins see it.
alter table portal_users add column if not exists distributor_id uuid references portal_users(id) on delete set null;
create index if not exists portal_users_distributor_id_idx on portal_users (distributor_id);

-- 2. How much discount a distributor is allowed to give their own customers.
--    Set per distributor by a Flash-Tech admin on the Team page. 0 = none.
alter table portal_users add column if not exists max_discount_pct numeric default 0;

-- 3. Who actually submitted a request (a distributor ordering for their customer).
--    NULL = the customer submitted it themselves.
alter table portal_requests add column if not exists placed_by uuid references portal_users(id) on delete set null;

-- 4. Sign-up PINs a distributor generates for their customers. The customer types
--    the PIN on the Create Account screen, which links the new account to them.
create table if not exists portal_invite_codes (
  id             uuid primary key default gen_random_uuid(),
  code           text unique not null,
  distributor_id uuid not null references portal_users(id) on delete cascade,
  label          text,                       -- who the distributor made it for
  created_at     timestamptz default now(),
  expires_at     timestamptz,
  used_at        timestamptz,
  used_by        uuid references portal_users(id) on delete set null
);
create index if not exists portal_invite_codes_dist_idx on portal_invite_codes (distributor_id);

alter table portal_invite_codes enable row level security;
do $$ begin
  create policy "Allow all access" on portal_invite_codes for all using (true) with check (true);
exception when duplicate_object then null;
end $$;

-- ─── Optional: create your first distributor login by hand ───
-- (you can also do this in the portal: Team → Add User → Role = Distributor)
-- password below is the sha256 of the plain password; use the portal UI instead
-- unless you know the hash.
--
-- insert into portal_users (email, name, company, role, max_discount_pct, password_hash)
-- values ('abcsupply', 'ABC Supply', 'ABC Supply Co.', 'distributor', 10, '<sha256 hash>');
