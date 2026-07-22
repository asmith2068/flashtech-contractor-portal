// Secure server-side data API for the Flash-Tech Contractor Portal.
//
// The browser calls THIS instead of talking to Supabase directly, so the database
// is only ever reached with the SECRET service-role key, which never ships to the
// client. Every action verifies a signed session token and enforces on the server
// who is allowed to see and change what:
//
//   admin        – everything
//   distributor  – only customers linked to them (portal_users.distributor_id)
//                  and those customers' requests; may message, order on their
//                  behalf, convert quotes to orders, and set discounts up to
//                  their own max_discount_pct
//   contractor   – only their own account, requests and saved parts
//
// Required Vercel env vars:
//   SUPABASE_SERVICE_ROLE  – service_role key (Supabase → Settings → API). SECRET.
//   SESSION_SECRET         – any long random string used to sign session tokens.
//   SUPABASE_URL           – optional; defaults to the project URL below.
//   RESEND_API_KEY / EMAIL_FROM – optional; used for the password-reset email.
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const URL = process.env.SUPABASE_URL || "https://iriayxfpzqettovzqple.supabase.co";
const SERVICE = process.env.SUPABASE_SERVICE_ROLE || "";
const SECRET = process.env.SESSION_SECRET || "";
const db = SERVICE ? createClient(URL, SERVICE, { auth: { persistSession: false } }) : null;

const sha256 = (s) => crypto.createHash("sha256").update(String(s)).digest("hex");
const TTL = 1000 * 60 * 60 * 24 * 30; // 30-day session

function signToken(u) {
  const body = Buffer.from(JSON.stringify({ id: u.id, role: u.role, exp: Date.now() + TTL })).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}
function verifyToken(token) {
  if (!token || !SECRET) return null;
  const [body, sig] = String(token).split(".");
  if (!body || !sig) return null;
  const expect = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  const a = Buffer.from(sig), b = Buffer.from(expect);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString());
    if (!p.exp || Date.now() > p.exp) return null;
    return p;
  } catch { return null; }
}

// Only ever hand the client safe user fields — never password_hash / reset_token.
const CLEAN = "id,email,name,company,phone,distributor,sales_rep,role,discount_pct,distributor_id,max_discount_pct,created_at";
const clean = (u) => u && {
  id: u.id, email: u.email, name: u.name, company: u.company, phone: u.phone,
  distributor: u.distributor, sales_rep: u.sales_rep, role: u.role,
  discount_pct: u.discount_pct, distributor_id: u.distributor_id,
  max_discount_pct: u.max_discount_pct, created_at: u.created_at,
  // the client uses this flag to force a password change on first sign-in
  must_change_pw: u.reset_token === "__MUSTCHANGE__" || undefined,
};
// Fields a client is allowed to write onto a user row. Anything else (role,
// password_hash, distributor_id, reset_token…) is set by the server alone.
const USER_FIELDS = ["name", "company", "email", "phone", "distributor", "sales_rep", "discount_pct"];
const pickUserFields = (f = {}) => Object.fromEntries(Object.entries(f).filter(([k]) => USER_FIELDS.includes(k)));

const err = (code, message) => { const e = new Error(message); e.code = code; throw e; };

async function sendResetEmail(to, link) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;background:#f2f3f2;padding:24px"><div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #e1e4e1"><div style="background:#000;padding:16px 22px;border-bottom:3px solid #0DD714;color:#0DD714;font-weight:bold;letter-spacing:.06em">FLASH-TECH</div><div style="padding:22px"><p style="margin:0 0 14px">We received a request to reset your Flash-Tech Portal password. This link is valid for 1 hour:</p><p><a href="${link}" style="display:inline-block;background:#0DD714;color:#000;font-weight:bold;padding:12px 22px;text-decoration:none">Reset My Password</a></p><p style="font-size:12px;color:#6a7278;margin-top:16px">If you didn't request this, you can safely ignore this email.</p></div></div></div>`;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.EMAIL_FROM || "Flash-Tech Portal <onboarding@resend.dev>", to: [to], subject: "Reset your Flash-Tech password", html }),
    });
  } catch { /* never block the request on email */ }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!db) return res.status(500).json({ error: "Server not configured — set SUPABASE_SERVICE_ROLE in Vercel." });
  if (!SECRET) return res.status(500).json({ error: "Server not configured — set SESSION_SECRET in Vercel." });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const { action } = body;
  const auth = verifyToken(body.token);

  const needAuth = () => auth || err(401, "Please sign in again.");
  const needAdmin = () => { const a = needAuth(); if (a.role !== "admin") err(403, "Not allowed."); return a; };
  // Admin or distributor — the two roles that manage other people's accounts.
  const needStaff = () => { const a = needAuth(); if (a.role !== "admin" && a.role !== "distributor") err(403, "Not allowed."); return a; };

  // Which contractor ids this login may see. null = no restriction (admin).
  const scopeOf = async (a) => {
    if (a.role === "admin") return null;
    if (a.role !== "distributor") return [a.id];
    const { data } = await db.from("portal_users").select("id").eq("distributor_id", a.id);
    return (data || []).map((c) => c.id);
  };
  // Load a request and confirm this login is allowed to touch it.
  const reqInScope = async (a, reqId) => {
    const { data: rq } = await db.from("portal_requests").select("*").eq("id", reqId).maybeSingle();
    if (!rq) err(404, "Request not found.");
    const scope = await scopeOf(a);
    if (scope && !scope.includes(rq.contractor_id)) err(403, "Not allowed.");
    return rq;
  };
  // Confirm this login may manage the given customer account.
  const customerInScope = async (a, id) => {
    const { data: c } = await db.from("portal_users").select("*").eq("id", id).maybeSingle();
    if (!c || c.role !== "contractor") err(404, "Customer not found.");
    if (a.role === "distributor" && c.distributor_id !== a.id) err(403, "That customer isn't on your account.");
    if (a.role === "contractor") err(403, "Not allowed.");
    return c;
  };
  // A distributor can never give a bigger discount than the admin allowed them.
  const capDiscount = async (a, fields) => {
    if (a.role !== "distributor" || fields.discount_pct == null) return fields;
    const { data: me } = await db.from("portal_users").select("max_discount_pct").eq("id", a.id).maybeSingle();
    const cap = Number(me?.max_discount_pct) || 0;
    return { ...fields, discount_pct: Math.max(0, Math.min(cap, Number(fields.discount_pct) || 0)) };
  };

  try {
    switch (action) {
      // ── public ──────────────────────────────────────────────
      case "login": {
        const email = String(body.email || "").trim().toLowerCase();
        const { data: u } = await db.from("portal_users").select("*").eq("email", email).maybeSingle();
        if (!u || u.password_hash !== sha256(body.password || "")) return res.status(401).json({ error: "Wrong email or password." });
        return res.json({ token: signToken(u), user: clean(u) });
      }
      case "signup": {
        const f = body.fields || {};
        const email = String(f.email || "").trim().toLowerCase();
        if (!email || !f.name || !f.company) return res.status(400).json({ error: "Please fill in your name, company and email." });
        if (String(body.password || "").length < 4) return res.status(400).json({ error: "Password must be at least 4 characters." });
        // A distributor sign-up PIN links the new account to that distributor.
        let invite = null, distName = "";
        const pin = String(body.pin || "").trim().toUpperCase();
        if (pin) {
          const { data: code } = await db.from("portal_invite_codes").select("*").eq("code", pin).maybeSingle();
          if (!code) return res.status(400).json({ error: "That sign-up PIN isn't valid — check it with your distributor." });
          if (code.used_at) return res.status(400).json({ error: "That sign-up PIN has already been used." });
          if (code.expires_at && new Date(code.expires_at) < new Date()) return res.status(400).json({ error: "That sign-up PIN has expired — ask your distributor for a new one." });
          const { data: d } = await db.from("portal_users").select("name,company").eq("id", code.distributor_id).maybeSingle();
          invite = code; distName = d?.company || d?.name || "";
        }
        if (!pin && !String(f.distributor || "").trim()) return res.status(400).json({ error: "Please enter your distributor, or the sign-up PIN they gave you." });
        const row = {
          email, password_hash: sha256(body.password), name: f.name, company: f.company,
          phone: f.phone || null, distributor: String(f.distributor || "").trim() || distName,
          sales_rep: f.salesRep || null, role: "contractor",
          distributor_id: invite ? invite.distributor_id : null,
        };
        const { data: u, error } = await db.from("portal_users").insert(row).select().single();
        if (error) return res.status(400).json({ error: error.code === "23505" ? "An account with that email already exists." : error.message });
        if (invite) await db.from("portal_invite_codes").update({ used_at: new Date().toISOString(), used_by: u.id }).eq("id", invite.id);
        return res.json({ token: signToken(u), user: clean(u) });
      }
      case "requestReset": {
        // Always answers the same way, so this can't be used to discover which
        // email addresses have accounts.
        const email = String(body.email || "").trim().toLowerCase();
        if (email) {
          const { data: u } = await db.from("portal_users").select("id").eq("email", email).maybeSingle();
          if (u) {
            const tok = crypto.randomUUID();
            await db.from("portal_users").update({ reset_token: tok, reset_expires: new Date(Date.now() + 3600000).toISOString() }).eq("id", u.id);
            await sendResetEmail(email, `${body.origin || ""}/?reset=${tok}`);
          }
        }
        return res.json({ ok: true });
      }
      case "checkReset": {
        const { data: u } = await db.from("portal_users").select("email,reset_expires").eq("reset_token", body.resetToken || "__none__").maybeSingle();
        if (!u || !u.reset_expires || new Date(u.reset_expires) < new Date()) return res.json({ valid: false });
        return res.json({ valid: true, email: u.email });
      }
      case "resetPassword": {
        const tok = body.resetToken, pw = String(body.password || "");
        if (!tok || pw.length < 4) return res.status(400).json({ error: "Enter a new password (at least 4 characters)." });
        const { data: u } = await db.from("portal_users").select("id,reset_expires").eq("reset_token", tok).maybeSingle();
        if (!u || !u.reset_expires || new Date(u.reset_expires) < new Date()) return res.status(400).json({ error: "This reset link is invalid or has expired." });
        await db.from("portal_users").update({ password_hash: sha256(pw), reset_token: null, reset_expires: null }).eq("id", u.id);
        return res.json({ ok: true });
      }
      case "health": {
        const { error } = await db.from("portal_products").select("sku").limit(1);
        return res.json({ ok: !error });
      }
      case "products": { // public catalog (guest builder / login screen)
        const { data } = await db.from("portal_products").select("*").eq("active", true).order("category").order("sku");
        return res.json({ products: data || [] });
      }

      // ── signed in ───────────────────────────────────────────
      case "changePassword": {
        const a = needAuth();
        const pw = String(body.password || "");
        if (pw.length < 4) return res.status(400).json({ error: "Password must be at least 4 characters." });
        await db.from("portal_users").update({ password_hash: sha256(pw), reset_token: null, reset_expires: null }).eq("id", a.id);
        const { data: u } = await db.from("portal_users").select("*").eq("id", a.id).maybeSingle();
        return res.json({ user: clean(u) });
      }
      case "loadAll": {
        const a = needAuth();
        const { data: me } = await db.from("portal_users").select("*").eq("id", a.id).maybeSingle();
        if (!me) err(401, "Please sign in again.");
        const { data: products } = await db.from("portal_products").select("*").eq("active", true).order("category").order("sku");
        const scope = await scopeOf(a);

        let requests = [];
        if (!scope || scope.length) {
          let q = db.from("portal_requests").select("*").order("created_at", { ascending: false });
          if (scope) q = q.in("contractor_id", scope);
          const { data } = await q;
          requests = data || [];
        }
        const ids = requests.map((r) => r.id);
        let items = [], messages = [];
        if (ids.length) {
          const [it, ms] = await Promise.all([
            db.from("portal_request_items").select("*").in("request_id", ids),
            db.from("portal_messages").select("*").in("request_id", ids).order("created_at"),
          ]);
          items = it.data || []; messages = ms.data || [];
        }
        let contractors = [], staff = [], parts = [], invites = [];
        if (a.role === "admin") {
          const [{ data: cons }, { data: users }] = await Promise.all([
            db.from("portal_users").select(CLEAN).eq("role", "contractor").order("company"),
            db.from("portal_users").select(CLEAN).in("role", ["admin", "distributor"]).order("name"),
          ]);
          contractors = cons || []; staff = users || [];
        } else if (a.role === "distributor") {
          const [{ data: cons }, { data: codes }] = await Promise.all([
            db.from("portal_users").select(CLEAN).eq("distributor_id", a.id).order("company"),
            db.from("portal_invite_codes").select("*").eq("distributor_id", a.id).order("created_at", { ascending: false }),
          ]);
          contractors = cons || []; invites = codes || [];
        } else {
          const { data } = await db.from("portal_custom_flashings").select("*").eq("contractor_id", a.id).order("created_at", { ascending: false });
          parts = data || [];
        }
        return res.json({ user: clean(me), products: products || [], requests, items, messages, contractors, staff, parts, invites });
      }

      // ── saved custom parts (contractor's own) ───────────────
      case "savePart": {
        const a = needAuth();
        const cf = body.part || {};
        const row = { contractor_id: a.id, part_number: cf.part_number, name: cf.name, flashing_type: cf.flashing_type, material_code: cf.material_code, params: cf.params, girth: cf.girth, bends: cf.bends, piece_length_ft: cf.piece_length_ft, price_per_piece: cf.price_per_piece };
        const { data, error } = await db.from("portal_custom_flashings").insert(row).select().single();
        if (error) return res.status(400).json({ error: error.message });
        return res.json({ part: data });
      }
      case "delPart": {
        const a = needAuth();
        await db.from("portal_custom_flashings").delete().eq("id", body.id).eq("contractor_id", a.id);
        return res.json({ ok: true });
      }

      // ── requests ────────────────────────────────────────────
      case "submitRequest": {
        const a = needAuth();
        const meta = body.meta || {}, cart = body.cart || [];
        // A distributor orders on behalf of one of their own customers.
        let buyerId = a.id;
        if (a.role === "distributor") {
          if (!body.forCustomerId) err(400, "Pick which customer this request is for.");
          const c = await customerInScope(a, body.forCustomerId);
          buyerId = c.id;
        } else if (a.role === "admin") {
          err(403, "Flash-Tech staff can't submit requests — use a customer or distributor login.");
        }
        const row = { contractor_id: buyerId, placed_by: a.role === "distributor" ? a.id : null, req_type: meta.req_type === "order" ? "order" : "quote", status: "new", job_name: meta.job_name || null, po_number: meta.po_number || null, needed_by: meta.needed_by || null, notes: meta.notes || null, subtotal: body.subtotal };
        const { data: request, error } = await db.from("portal_requests").insert(row).select().single();
        if (error) return res.status(400).json({ error: error.message });
        const lines = cart.map((i) => ({ request_id: request.id, item_kind: i.kind, sku: i.sku, description: i.description, unit: i.unit, qty: i.qty, unit_price: i.unit_price, line_total: i.line_total, detail: i.detail || null }));
        if (lines.length) {
          const { error: e2 } = await db.from("portal_request_items").insert(lines);
          if (e2) return res.status(400).json({ error: e2.message });
        }
        return res.json({ request });
      }
      case "sendMsg": {
        const a = needAuth();
        await reqInScope(a, body.reqId);
        const { data: me } = await db.from("portal_users").select("name,company").eq("id", a.id).maybeSingle();
        const sender_name = a.role === "admin" ? "Flash-Tech"
          : a.role === "distributor" ? `${me?.name || "Distributor"} — ${me?.company || "Distributor"}`
          : (me?.name || "Contractor");
        const { data, error } = await db.from("portal_messages").insert({ request_id: body.reqId, sender_role: a.role, sender_name, body: String(body.body || "").slice(0, 5000) }).select().single();
        if (error) return res.status(400).json({ error: error.message });
        return res.json({ message: data });
      }
      case "setStatus": {
        needAdmin();
        const { error } = await db.from("portal_requests").update({ status: body.status, updated_at: new Date().toISOString() }).eq("id", body.reqId);
        if (error) return res.status(400).json({ error: error.message });
        return res.json({ ok: true });
      }
      case "setQuoteTotal": {
        needAdmin();
        const { error } = await db.from("portal_requests").update({ admin_quote_total: body.total, updated_at: new Date().toISOString() }).eq("id", body.reqId);
        if (error) return res.status(400).json({ error: error.message });
        return res.json({ ok: true });
      }
      case "saveQuote": {
        // Admin edits the quote line-by-line: prices, quantities, added/removed lines.
        needAdmin();
        const rows = (body.rows || []).map((r) => {
          const qty = Math.max(0, parseFloat(r.qty) || 0);
          const unit_price = Math.max(0, parseFloat(r.unit_price) || 0);
          return { ...r, qty, unit_price, line_total: Math.round(qty * unit_price * 100) / 100 };
        });
        const total = Math.round(rows.reduce((s, r) => s + r.line_total, 0) * 100) / 100;
        const { data: orig } = await db.from("portal_request_items").select("id").eq("request_id", body.reqId);
        const keep = rows.filter((r) => r.id).map((r) => r.id);
        const toDelete = (orig || []).filter((o) => !keep.includes(o.id)).map((o) => o.id);
        if (toDelete.length) {
          const { error } = await db.from("portal_request_items").delete().in("id", toDelete);
          if (error) return res.status(400).json({ error: error.message });
        }
        for (const r of rows.filter((r) => r.id)) {
          const { error } = await db.from("portal_request_items")
            .update({ description: r.description, qty: r.qty, unit_price: r.unit_price, line_total: r.line_total })
            .eq("id", r.id).eq("request_id", body.reqId);
          if (error) return res.status(400).json({ error: error.message });
        }
        const inserts = rows.filter((r) => !r.id).map((r) => ({ request_id: body.reqId, item_kind: r.item_kind || "custom", sku: r.sku || null, description: r.description, unit: r.unit || "ea", qty: r.qty, unit_price: r.unit_price, line_total: r.line_total, detail: r.detail || null }));
        if (inserts.length) {
          const { error } = await db.from("portal_request_items").insert(inserts);
          if (error) return res.status(400).json({ error: error.message });
        }
        const { error } = await db.from("portal_requests").update({ admin_quote_total: total, status: "responded", updated_at: new Date().toISOString() }).eq("id", body.reqId);
        if (error) return res.status(400).json({ error: error.message });
        return res.json({ ok: true, total });
      }
      case "convertToOrder": {
        // Admin, the customer themselves, or their distributor may accept a quote.
        const a = needAuth();
        const rq = await reqInScope(a, body.reqId);
        if (rq.req_type === "order") return res.json({ ok: true, already: true });
        const patch = { req_type: "order", updated_at: new Date().toISOString() };
        const po = String(body.po || "").trim();
        if (po) patch.po_number = po;
        const { error } = await db.from("portal_requests").update(patch).eq("id", body.reqId);
        if (error) return res.status(400).json({ error: error.message });
        return res.json({ ok: true, patch });
      }
      case "revertToQuote": {
        needAdmin();
        const { data: rq } = await db.from("portal_requests").select("qb_status").eq("id", body.reqId).maybeSingle();
        if (rq && (rq.qb_status || "none") !== "none") return res.status(400).json({ error: "This order is already queued for / pushed to QuickBooks. Remove it from the QuickBooks queue first." });
        const patch = { req_type: "quote", updated_at: new Date().toISOString() };
        const { error } = await db.from("portal_requests").update(patch).eq("id", body.reqId);
        if (error) return res.status(400).json({ error: error.message });
        return res.json({ ok: true, patch });
      }
      case "setQbQueue": {
        needAdmin();
        const patch = body.queued ? { qb_status: "queued", qb_error: null } : { qb_status: "none" };
        const { error } = await db.from("portal_requests").update(patch).eq("id", body.reqId);
        if (error) return res.status(400).json({ error: error.message });
        return res.json({ ok: true, patch });
      }
      case "deleteRequest": {
        needAdmin();
        await db.from("portal_messages").delete().eq("request_id", body.reqId);
        await db.from("portal_request_items").delete().eq("request_id", body.reqId);
        const { error } = await db.from("portal_requests").delete().eq("id", body.reqId);
        if (error) return res.status(400).json({ error: error.message });
        return res.json({ ok: true });
      }

      // ── customer accounts (admin + distributor) ─────────────
      case "createContractor": {
        const a = needStaff();
        let fields = pickUserFields(body.fields);
        if (!fields.name || !fields.email) return res.status(400).json({ error: "Name and login/email are required." });
        if (String(body.password || "").length < 4) return res.status(400).json({ error: "Set a temporary password (at least 4 characters)." });
        fields = await capDiscount(a, fields);
        const row = { ...fields, email: String(fields.email).trim().toLowerCase(), password_hash: sha256(body.password), role: "contractor" };
        if (a.role === "distributor") {
          const { data: me } = await db.from("portal_users").select("company,name").eq("id", a.id).maybeSingle();
          row.distributor_id = a.id;                 // always their own book — never someone else's
          row.distributor = row.distributor || me?.company || me?.name || null;
        } else if (body.fields?.distributor_id !== undefined) {
          row.distributor_id = body.fields.distributor_id || null;
        }
        const { error } = await db.from("portal_users").insert(row);
        if (error) return res.status(400).json({ error: error.code === "23505" ? "That login/email is already in use." : error.message });
        return res.json({ ok: true });
      }
      case "saveContractor": {
        const a = needStaff();
        await customerInScope(a, body.id);
        let fields = await capDiscount(a, pickUserFields(body.fields));
        if (fields.email) fields.email = String(fields.email).trim().toLowerCase();
        // Only an admin may move a customer between distributors.
        if (a.role === "admin" && body.fields?.distributor_id !== undefined) fields.distributor_id = body.fields.distributor_id || null;
        if (body.newPassword) {
          if (String(body.newPassword).length < 4) return res.status(400).json({ error: "New password must be at least 4 characters." });
          fields.password_hash = sha256(body.newPassword);
        }
        const { error } = await db.from("portal_users").update(fields).eq("id", body.id);
        if (error) return res.status(400).json({ error: error.code === "23505" ? "That login/email is already taken." : error.message });
        return res.json({ ok: true });
      }
      case "deleteContractor": {
        needAdmin();
        const { error } = await db.from("portal_users").delete().eq("id", body.id);
        if (error) return res.status(400).json({ error: error.message });
        return res.json({ ok: true });
      }
      case "resetCustomerPassword": {
        // Sets a fresh temporary password and flags a forced change at next sign-in.
        // The plain password is returned so the caller can email it to the customer.
        const a = needStaff();
        const c = await customerInScope(a, body.id);
        const tempPw = crypto.randomBytes(4).toString("hex").slice(0, 6);
        const { error } = await db.from("portal_users").update({ password_hash: sha256(tempPw), reset_token: "__MUSTCHANGE__", reset_expires: null }).eq("id", c.id);
        if (error) return res.status(400).json({ error: error.message });
        return res.json({ tempPw, email: c.email, name: c.name });
      }

      // ── staff + distributor logins (admin only) ─────────────
      case "createUser": {
        needAdmin();
        const f = body.fields || {};
        const role = f.role === "distributor" ? "distributor" : "admin";
        if (!f.name || !f.email) return res.status(400).json({ error: "Name and login/email are required." });
        if (String(body.password || "").length < 4) return res.status(400).json({ error: "Set a temporary password (at least 4 characters)." });
        const row = { name: f.name, email: String(f.email).trim().toLowerCase(), phone: f.phone || null, company: f.company || null, role,
          max_discount_pct: role === "distributor" ? Math.max(0, Math.min(100, Number(f.max_discount_pct) || 0)) : 0,
          password_hash: sha256(body.password) };
        const { error } = await db.from("portal_users").insert(row);
        if (error) return res.status(400).json({ error: error.code === "23505" ? "That login/email is already in use." : error.message });
        return res.json({ ok: true });
      }
      case "saveUser": {
        needAdmin();
        const f = body.fields || {};
        const role = f.role === "distributor" ? "distributor" : "admin";
        const patch = { name: f.name, email: String(f.email || "").trim().toLowerCase(), phone: f.phone || null, company: f.company || null, role,
          max_discount_pct: role === "distributor" ? Math.max(0, Math.min(100, Number(f.max_discount_pct) || 0)) : 0 };
        if (body.newPassword) {
          if (String(body.newPassword).length < 4) return res.status(400).json({ error: "New password must be at least 4 characters." });
          patch.password_hash = sha256(body.newPassword);
        }
        const { error } = await db.from("portal_users").update(patch).eq("id", body.id);
        if (error) return res.status(400).json({ error: error.code === "23505" ? "That login/email is already taken." : error.message });
        return res.json({ ok: true });
      }
      case "deleteUser": {
        const a = needAdmin();
        if (body.id === a.id) return res.status(400).json({ error: "You can't delete the account you're signed in with." });
        const { data: target } = await db.from("portal_users").select("role").eq("id", body.id).maybeSingle();
        if (target?.role === "admin") {
          const { data: admins } = await db.from("portal_users").select("id").eq("role", "admin");
          if ((admins || []).length <= 1) return res.status(400).json({ error: "You can't delete the last admin account." });
        }
        const { error } = await db.from("portal_users").delete().eq("id", body.id);
        if (error) return res.status(400).json({ error: error.message });
        return res.json({ ok: true });
      }

      // ── distributor customer sign-up PINs ──────────────────
      case "genPin": {
        const a = needAuth();
        if (a.role !== "distributor") err(403, "Only distributor logins can create sign-up PINs.");
        const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0 or I/1 — safe to read aloud
        const code = Array.from(crypto.randomBytes(6)).map((b) => CHARS[b % CHARS.length]).join("");
        const row = { code, distributor_id: a.id, label: String(body.label || "").trim() || null, expires_at: new Date(Date.now() + 30 * 864e5).toISOString() };
        const { data, error } = await db.from("portal_invite_codes").insert(row).select().single();
        if (error) return res.status(400).json({ error: error.message });
        return res.json({ invite: data });
      }
      case "revokePin": {
        const a = needAuth();
        if (a.role !== "distributor" && a.role !== "admin") err(403, "Not allowed.");
        let q = db.from("portal_invite_codes").delete().eq("id", body.id);
        if (a.role === "distributor") q = q.eq("distributor_id", a.id); // only their own
        const { error } = await q;
        if (error) return res.status(400).json({ error: error.message });
        return res.json({ ok: true });
      }

      default:
        return res.status(400).json({ error: "Unknown action" });
    }
  } catch (e) {
    return res.status(e.code || 500).json({ error: e.message || String(e) });
  }
}
