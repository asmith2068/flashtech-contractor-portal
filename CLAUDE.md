# Flash-Tech Contractor Portal

Customer-facing portal for Flash-Tech Mfg, Inc. Roofing contractors order edge metal
and accessories, design custom flashings in a live 3D builder, and submit quote /
order requests. Flash-Tech staff answer them from an admin dashboard.
React 18 + Vite 5 + Vercel serverless functions + Supabase.

**Real contractors and real Flash-Tech staff use this daily.** Additive changes over
refactors.

See `README.md` for setup, deploy, and the feature list. This file covers what's easy
to get wrong.

---

## Run / build / deploy

```
npm run dev      # port 5173 (launch config "portal")
npm run build    # the ONLY verification gate — must pass before anything is done
```

No tests, no linter, no TypeScript. `npm run build` is the whole safety net.

Deploy is automatic: push to `main` on `asmith2068/flashtech-contractor-portal`
→ Vercel → `flashtech-contractor-portal.vercel.app`.

**Never push to `main` without being asked.** A push is a production deploy.

### ⚠️ Local dev writes to the PRODUCTION database

`vite dev` doesn't serve `/api` routes, so `src/api.js` sets `BASE` to the live
Vercel URL whenever the hostname is localhost. Every action you take on
`localhost:5173` — creating users, submitting requests, changing statuses, queuing
QuickBooks orders — hits the real serverless function and the real database.

Use obviously-fake data when testing locally, and never run destructive actions
(`deleteRequest`, `deleteUser`, `deleteContractor`) against real records.

---

## Architecture — the one rule that matters

**The browser never talks to Supabase.** There is no database key in the client.
Everything goes through one serverless endpoint:

```
src/api.js  →  POST /api/portal  { action, token, ...payload }  →  api/portal.js
```

`api/portal.js` verifies a signed session token, then a big `switch (action)` decides
what this login is allowed to see and change:

- **admin** — everything
- **distributor** — only customers linked via `portal_users.distributor_id`, and their
  requests; may order on their behalf and set discounts up to their own `max_discount_pct`
- **contractor** — only their own account, requests, and saved parts

**Adding a feature means adding a `case` to that switch and calling `api('yourAction')`
from the client.** Do not add a Supabase client to `src/`. Do not add a
`VITE_SUPABASE_*` variable — the old ones are dead and deliberately unused.

Server-side rules to preserve:

- Authorization is decided from the **token**, never from an id in the request body.
  Always re-check ownership server-side before touching a row.
- `CLEAN` is the whitelist of user fields that may ever reach the client. It excludes
  `password_hash` and `reset_token`. Don't widen it.
- `USER_FIELDS` is the whitelist of fields a client may *write*. `role`,
  `password_hash`, `distributor_id` are server-set only.

### Files

| File | What's in it |
|---|---|
| `api/portal.js` | ~31kb. Auth, session tokens, and every data action. |
| `api/identify-flashing.js` | photo → flashing profile via Anthropic API |
| `api/send-email.js` | Resend wrapper |
| `src/App.jsx` | ~215kb. Every component, all styling, all pages, all email templates. |
| `src/catalog.js` | ~63kb. Product catalog + custom-flashing pricing model. |
| `src/api.js` | thin client wrapper for `/api/portal` |
| `src/Flashing3D.jsx`, `src/SinglePly3D.jsx` | 3D preview |

`App.jsx` being one file is intentional. **Do not split it up** unless asked. Read
with offset/limit rather than loading the whole thing.

---

## Domain rules

**Everything in Supabase is prefixed `portal_`.** This project shares its Supabase
instance with the internal **flashtech-sales-assistant**, which owns the unprefixed
tables (`contacts`, `calls`, `tasks`, `users`, …). **Never touch an unprefixed table
from here.**

**SQL runs in a fixed order** — `database-setup.sql`, then `DISTRIBUTOR-SETUP.sql`,
then `LOCKDOWN.sql` **last**. `LOCKDOWN.sql` removes the permissive RLS policies; the
portal keeps working because the server uses the service-role key, which bypasses RLS.
Running it early breaks things; skipping it leaves the database open.

**QuickBooks pushes are pull-based and manual.** `qb_status` moves
`none → queued → pushed | error`. This codebase only ever *flags* an order as queued
(`setQbQueue`); the QuickBooks Web Connector on the QB Enterprise machine pulls the
queue on its own schedule. **Nothing in this repo calls a QuickBooks API, and nothing
should start to.** Only orders push, never quotes. Once `qb_status !== "none"`, an
order can't be reverted to a quote until it's pulled from the queue.

**Custom flashing pricing** lives in `src/catalog.js` — `MATERIALS` rates,
`BEND_CHARGE`, `MIN_PIECE`, priced as $ per inch of girth per linear foot. Catalog
part prices live in the `portal_products` table, not in code. All custom prices are
labeled "estimated"; a human confirms the final number on the quote.

**`REMIND_HOURS = 24`** in `App.jsx` drives the red overdue banner and the admin
notification bell.

---

## Conventions

- **Styling** is the `CSS` template string in `App.jsx` (~line 189). No CSS files, no
  Tailwind. Brand green is `#0DD714`.
- **Icons** are the `IC` object of SVG path strings, rendered via `<I d={IC.foo} />`.
  Don't add an icon library.
- **3D and profile drawing are hand-rolled SVG/canvas** (`ProfileCanvas`, `Pan3D`,
  `Flashing3D`). There is no three.js and no 3D dependency. Keep it that way — it
  has to load fast on a phone in a parking lot.
- **Emails** are inline-styled HTML built by `emailShell` / `mailBtn`, sent through
  `sendMail` → `/api/send-email` (Resend). Images must be hosted URLs — base64 gets
  stripped by some mail clients, which is why `FT_LOGO_URL` exists.
- Lengths snap to 1/16" (`SNAP_IN`) and display as fractions via `fmtIn`.

## Environment variables (Vercel)

| Name | Notes |
|---|---|
| `SUPABASE_SERVICE_ROLE` | **secret** — never expose as `VITE_*` |
| `SESSION_SECRET` | signs session tokens |
| `SUPABASE_URL` | optional; falls back to the URL in `api/portal.js` |
| `RESEND_API_KEY` / `EMAIL_FROM` | email |
| `ANTHROPIC_API_KEY` | photo flashing identification |
