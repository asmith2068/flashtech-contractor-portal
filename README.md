# Flash-Tech Contractor Portal

Customer-facing portal for Flash-Tech Mfg, Inc.
Roofing contractors create an account, add drip edge / coping metal / accessories
to a cart (by linear foot or each), design **custom flashings with a live 3D
preview + auto part numbers + estimated pricing**, and send **quote or order
requests** straight to the Flash-Tech admin dashboard.

This is a separate app from the internal **flashtech-sales-assistant** — same
stack (React + Vite + Supabase + Vercel), and it can share the same Supabase
project because every table is prefixed `portal_`.

---

## What's inside

**Contractor side**
- Create account / sign in (contractors self-register)
- Parts Catalog — drip edge, gravel stop, coping metal (priced per linear foot)
  plus boots, drains, sealant pockets, corners (priced each)
- Custom Flashing Builder — pick a profile (Drip Edge, L/Counter, Z-Bar,
  Coping Cap, Gravel Stop, Valley), enter dimensions and material, and get a
  shaded 3D model, girth, bend count, part number, description, and estimated
  price per piece / per LF
- Save custom parts to "My Saved Parts" and reuse them on future requests
- Cart → submit as a **Quote Request** or **Order Request** (job name, PO,
  needed-by date, notes)
- My Requests — status tracking + message thread with Flash-Tech
- Bell notifications when Flash-Tech replies

**Admin side** (Flash-Tech staff)
- Dashboard — new requests, awaiting-response count, and a red **overdue
  banner for anything unanswered over 24 hours**
- Full request list with filters; open any request to see line items
  (custom flashings re-render in 3D), set status, set a final quoted total,
  and message the customer
- Notification bell with every request waiting on a response, oldest flagged
- Customers list
- Auto-refreshes every 60 seconds so new requests appear on their own

---

## QUICK DEPLOY

### STEP 1: Database (Supabase)

You can use your **existing** Supabase project (the one the Sales Assistant
uses) — the portal tables are all prefixed `portal_` so nothing collides.

1. Go to your project at [supabase.com](https://supabase.com) → **SQL Editor**
2. New Query → paste ALL of `database-setup.sql` → **Run**
3. Done — tables, demo logins, and the seeded parts catalog are created.

### STEP 2: Run locally

```
cd flashtech-contractor-portal
npm install
npm run dev
```

`.env.local` is already pointed at your existing Supabase project.
Open http://localhost:5173

### STEP 3: Deploy to Vercel

1. Push to a new GitHub repo:
   ```
   git init
   git add .
   git commit -m "Flash-Tech Contractor Portal"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/flashtech-contractor-portal.git
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. Add the environment variables (see **Security setup** below)
4. **Deploy** → share the URL with your contractors

---

## Security setup (required)

The browser never talks to the database. It calls `/api/portal`, a serverless
function that verifies a signed session token and decides what each login is
allowed to see: admins see everything, a **distributor** sees only the customers
linked to them, and a contractor sees only their own account.

Vercel environment variables:

| Name | What it is |
|---|---|
| `SUPABASE_SERVICE_ROLE` | service_role key — Supabase → Settings → API. **Secret. Never put this in `VITE_*`.** |
| `SESSION_SECRET` | any long random string, used to sign session tokens |
| `SUPABASE_URL` | optional — defaults to the project URL in `api/portal.js` |
| `RESEND_API_KEY` / `EMAIL_FROM` | email (already set) |
| `ANTHROPIC_API_KEY` | photo identify (already set) |

The old `VITE_SUPABASE_*` variables are no longer used and can be removed.

SQL to run in the Supabase SQL editor, **in this order**:

1. `DISTRIBUTOR-SETUP.sql` — adds distributor links, discount caps and sign-up PINs
2. deploy, and confirm sign-in / requests / admin pages all work
3. `LOCKDOWN.sql` — **last**: removes the "allow all" policies so the public key
   can no longer read or write anything. The portal keeps working because the
   server API uses the service-role key, which bypasses row level security.

---

## Default logins (change before going live!)

| Email | Password | Role |
|---|---|---|
| admin@flash-techinc.com | admin | Flash-Tech admin |
| demo@contractor.com | 1234 | Demo contractor |

Passwords are stored as SHA-256 hashes in `portal_users`. To change one, sign
in as the user — or generate a new hash and update the row in Supabase.

## Adjusting pricing

- **Catalog parts:** edit prices in the `portal_products` table (Supabase →
  Table Editor). The app reads the catalog from the database.
- **Custom flashing rates:** edit `MATERIALS` rates, `BEND_CHARGE` and
  `MIN_PIECE` in `src/catalog.js` ($ per inch of girth per linear foot).
  All custom prices are labeled "estimated" — you confirm the final number
  on each quote from the admin dashboard.

## Notes

- RLS policies are open (same simple pattern as the Sales Assistant). Fine to
  start; tighten before storing anything sensitive.
- Reminder window for "needs response" alerts is `REMIND_HOURS` in
  `src/App.jsx` (default 24).

Flash-Tech Mfg, Inc. — 215 Denny Way Suite D, El Cajon, CA 92020
(619) 334-9491 | sales@flash-techinc.com
