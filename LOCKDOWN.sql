-- ─────────────────────────────────────────────────────────────
-- Flash-Tech Contractor Portal — CLOSE THE DATABASE TO THE BROWSER
--
-- ⚠️  RUN THIS LAST. Only after the portal is deployed on the new /api/portal
--     server API and you've confirmed sign-in, requests and the admin pages all
--     work. This removes the "Allow all access" policies that let anyone holding
--     the public key read and write every row.
--
-- After this runs, the anon / publishable key can do NOTHING. The portal keeps
-- working because the serverless API uses the service-role key, which bypasses
-- row level security entirely.
--
-- To undo (if something breaks), re-run database-setup.sql's policies or:
--     create policy "Allow all access" on portal_users for all using (true) with check (true);
-- ─────────────────────────────────────────────────────────────

-- Drop every existing permissive policy on the portal tables.
do $$
declare t text; p record;
begin
  foreach t in array array['portal_users','portal_products','portal_requests','portal_request_items','portal_messages','portal_custom_flashings','portal_invite_codes']
  loop
    if to_regclass('public.'||t) is null then continue; end if;
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
      execute format('drop policy if exists %I on public.%I', p.policyname, t);
    end loop;
    execute format('alter table public.%I enable row level security', t);
    -- RLS on with zero policies = nothing is readable or writable by anon/authenticated.
    -- The service-role key used by /api/portal bypasses RLS, so the portal still works.
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end $$;

-- Verify: this should return no rows.
select tablename, policyname from pg_policies
where schemaname = 'public' and tablename like 'portal_%';

-- Verify: rls should be true for every portal table.
select relname, relrowsecurity from pg_class
where relname like 'portal_%' and relkind = 'r';
