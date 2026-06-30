import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { supabase, hasSupabase } from "./supabaseClient.js";
import Flashing3D from "./Flashing3D.jsx";
import SinglePly3D from "./SinglePly3D.jsx";
import {
  SEED_PRODUCTS, MATERIALS, COATED_METALS, MEMBRANE_TYPES, MEMBRANE_COLORS, matByCode, anyMat, FLASHING_TYPES, typeById,
  profileGirth, profileBends, piecePrice, customPartNumber, customDescription, defaultParams,
  membranePrice, membranePartNumber, membraneDescription,
  scupperPrice, scupperPartNumber, scupperSides, scupperTier, productImage, POPULAR_SKUS,
  customProfilePoints,
} from "./catalog.js";

// ─── UTILITIES ───────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);
const fmtDate = (iso) => { if (!iso) return ""; return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); };
const fmtDateTime = (iso) => { if (!iso) return ""; return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); };
const hoursSince = (iso) => (Date.now() - new Date(iso).getTime()) / 36e5;
const ageLabel = (iso) => {
  const h = hoursSince(iso);
  if (h < 1) return "just now";
  if (h < 24) return `${Math.floor(h)}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};
const uid = () => Math.random().toString(36).slice(2, 10);

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ─── EMAIL (posts to the /api/send-email serverless function; safely no-ops if not configured) ───
const PORTAL_URL = "https://flashtech-contractor-portal.vercel.app";
// TEMP: pointed at asmith@ so alerts deliver in Resend test mode. Switch back to
// sales@flash-techinc.com once the flash-techinc.com domain is verified in Resend.
const NOTIFY_EMAIL = "asmith@flash-techinc.com"; // where new-request alerts are sent
async function sendMail(to, subject, html, replyTo) {
  if (!to) return;
  try { await fetch("/api/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to, subject, html, replyTo }) }); }
  catch (e) { console.error("email send failed", e); }
}
const emailShell = (heading, inner) => `<div style="font-family:Arial,Helvetica,sans-serif;background:#f2f3f2;padding:24px"><div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e1e4e1">
<div style="background:#000;padding:16px 22px;border-bottom:3px solid #0DD714"><span style="color:#fff;font-size:20px;font-weight:800;letter-spacing:.5px">FLASH-<span style="color:#0DD714">TECH</span></span></div>
<div style="padding:22px;color:#1c201d"><h2 style="margin:0 0 12px;font-size:18px">${heading}</h2>${inner}</div>
<div style="padding:14px 22px;background:#0b0d0b;color:#9aa39a;font-size:12px">Flash-Tech Mfg, Inc. &middot; 215 Denny Way Suite D, El Cajon, CA 92020 &middot; (619) 334-9491</div>
</div></div>`;
const mailItems = (items) => `<table style="width:100%;border-collapse:collapse;font-size:13px;margin:10px 0"><tr style="background:#2b2f31;color:#fff"><th style="text-align:left;padding:6px 8px">Part</th><th style="text-align:center;padding:6px 8px">Qty</th><th style="text-align:right;padding:6px 8px">Total</th></tr>${items.map((i) => `<tr><td style="padding:6px 8px;border-bottom:1px solid #e1e4e1">${i.sku || ""} — ${i.description}</td><td style="text-align:center;padding:6px 8px;border-bottom:1px solid #e1e4e1">${i.qty} ${i.unit === "lf" ? "LF" : i.unit === "pc" ? "pcs" : "ea"}</td><td style="text-align:right;padding:6px 8px;border-bottom:1px solid #e1e4e1">${fmt(i.line_total)}</td></tr>`).join("")}</table>`;
const mailBtn = (label, href) => `<a href="${href}" style="display:inline-block;background:#0DD714;color:#000;font-weight:bold;padding:11px 22px;text-decoration:none;margin-top:8px">${label}</a>`;

// ─── PRINTABLE QUOTE ─────────────────────────────────────────
const FT_INFO = { addr: "215 Denny Way Suite D, El Cajon, CA 92020", phone: "(619) 334-9491", email: "sales@flash-techinc.com" };
const unitLabel = (u) => (u === "lf" ? "LF" : u === "pc" ? "pcs" : "ea");
function printQuote({ kind = "quote", reqId, created, status, billTo, meta = {}, items, subtotal, quotedTotal }) {
  const esc = (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const rows = items.map((i) => `<tr><td>${esc(i.sku || "")}</td><td>${esc(i.description)}</td><td class="c">${i.qty} ${unitLabel(i.unit)}</td><td class="r">${fmt(i.unit_price)}</td><td class="r">${fmt(i.line_total)}</td></tr>`).join("");
  const total = quotedTotal != null ? quotedTotal : subtotal;
  const heading = kind === "order" ? "ORDER" : "QUOTE";
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Flash-Tech ${heading}${reqId ? " #" + reqId.slice(0, 8) : ""}</title>
<style>body{font-family:Arial,Helvetica,sans-serif;color:#23282b;margin:34px;}
.hd{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #5aa01e;padding-bottom:12px}
.hd h1{margin:0;font-size:24px;letter-spacing:.5px}.grn{color:#5aa01e}
.sub{font-size:12px;color:#6a7278;margin-top:4px}
.doc{text-align:right}.doc h2{margin:0;font-size:20px;color:#2b2f31}
.meta{display:flex;justify-content:space-between;gap:24px;margin:20px 0;font-size:13px}
table{width:100%;border-collapse:collapse;font-size:13px}
th{background:#2b2f31;color:#fff;text-align:left;padding:9px 8px}
td{padding:7px 8px;border-bottom:1px solid #e3e6e8}.c{text-align:center}.r{text-align:right}
.tot{text-align:right;margin-top:16px;font-size:14px}.tot .big{font-size:22px;color:#5aa01e;font-weight:bold}
.note{margin-top:28px;font-size:11px;color:#6a7278;border-top:1px solid #e3e6e8;padding-top:10px}
button{margin-bottom:18px;padding:9px 18px;background:#5aa01e;color:#fff;border:none;border-radius:6px;font-size:14px;cursor:pointer}
@media print{button{display:none}}</style></head><body>
<button onclick="window.print()">🖨 Print / Save as PDF</button>
<div class="hd"><div><h1>FLASH-<span class="grn">TECH</span></h1><div class="sub">Single-Ply Roofing Accessories<br>${FT_INFO.addr}<br>${FT_INFO.phone} &middot; ${FT_INFO.email}</div></div>
<div class="doc"><h2>${heading}</h2>${reqId ? `<div class="sub">#${reqId.slice(0, 8)}</div>` : ""}<div class="sub">${fmtDate(created || new Date().toISOString())}</div>${status ? `<div class="sub">Status: ${esc(status)}</div>` : ""}</div></div>
<div class="meta"><div><b>Prepared For</b><br>${billTo ? `${esc(billTo.company || "")}<br>${esc(billTo.name || "")}<br>${esc(billTo.phone || "")}<br>${esc(billTo.email || "")}` : "&mdash;"}</div>
<div class="r">${meta.job_name ? `<b>Job:</b> ${esc(meta.job_name)}<br>` : ""}${meta.po_number ? `<b>PO #:</b> ${esc(meta.po_number)}<br>` : ""}${meta.needed_by ? `<b>Needed By:</b> ${fmtDate(meta.needed_by)}<br>` : ""}${billTo && billTo.distributor ? `<b>Distributor:</b> ${esc(billTo.distributor)}<br>` : ""}${billTo && billTo.sales_rep ? `<b>Sales Rep:</b> ${esc(billTo.sales_rep)}` : ""}</div></div>
<table><thead><tr><th>Part #</th><th>Description</th><th class="c">Qty</th><th class="r">Unit Price</th><th class="r">Total</th></tr></thead><tbody>${rows}</tbody></table>
<div class="tot">${quotedTotal != null ? `Estimated subtotal: ${fmt(subtotal)}<br>Flash-Tech ${heading.toLowerCase()} total: ` : "Estimated total: "}<span class="big">${fmt(total)}</span></div>
<div class="note">${kind === "quote" ? "This is an estimate; final pricing is confirmed by Flash-Tech. " : ""}All prices in USD. Thank you for your business.</div>
</body></html>`;
  const w = window.open("", "_blank");
  if (!w) { alert("Please allow pop-ups for this site to print the quote."); return; }
  w.document.write(html); w.document.close(); w.focus();
}

const STATUS_META = {
  new: { label: "New", cls: "b-new" },
  in_review: { label: "In Review", cls: "b-review" },
  responded: { label: "Responded", cls: "b-resp" },
  closed: { label: "Closed", cls: "b-closed" },
};
const REMIND_HOURS = 24; // flag requests unanswered longer than this

// A request still needs a Flash-Tech response if it's new, or the last
// message in its thread came from the contractor and it isn't closed.
const needsResponse = (req, msgs) => {
  if (req.status === "closed") return false;
  const thread = msgs.filter((m) => m.request_id === req.id);
  if (!thread.length) return req.status === "new" || req.status === "in_review";
  return thread[thread.length - 1].sender_role === "contractor";
};
const waitingSince = (req, msgs) => {
  const thread = msgs.filter((m) => m.request_id === req.id && m.sender_role === "contractor");
  return thread.length ? thread[thread.length - 1].created_at : req.created_at;
};

// ─── ICONS ───────────────────────────────────────────────────
const I = ({ d, s = 18, c = "currentColor" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const IC = {
  home: <I d={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>} />,
  box: <I d={<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>} />,
  wrench: <I d={<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />} />,
  cart: <I d={<><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>} />,
  list: <I d={<><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></>} />,
  bookmark: <I d={<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />} />,
  users: <I d={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>} />,
  bell: <I d={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>} />,
  out: <I d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>} />,
  x: <I d={<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>} />,
  trash: <I s={16} d={<><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>} />,
  send: <I s={16} d={<><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>} />,
  print: <I s={16} d={<><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></>} />,
  camera: <I d={<><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></>} />,
  alert: <I d={<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>} />,
  back: <I d={<><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>} />,
  plus: <I s={16} d={<><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>} />,
};

// ─── STYLES ──────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Barlow:wght@400;500;600;700&display=swap');
:root { --grn:#0DD714; --grn-d:#0aa810; --lime:#39ff14; --ink:#1c201d; --mut:#6a7278; --bg:#f2f3f2; --card:#fff; --line:#e1e4e1; --dark:#0b0d0b; --darker:#000; --red:#dc2626; --amber:#d97706; }
* { box-sizing:border-box; margin:0; padding:0; }
body { font-family:'Barlow','Segoe UI',system-ui,-apple-system,sans-serif; background:var(--bg); color:var(--ink); }
h1,h2,h3,.side .logo b { font-family:'Oswald','Barlow',sans-serif; text-transform:uppercase; letter-spacing:.02em; }
button { font-family:inherit; cursor:pointer; }
input,select,textarea { font-family:inherit; font-size:14px; padding:9px 11px; border:1px solid var(--line); border-radius:0; background:#fff; width:100%; }
input:focus,select:focus,textarea:focus { outline:2px solid var(--grn); border-color:var(--grn); }
label { font-size:12px; font-weight:600; color:var(--mut); display:block; margin-bottom:4px; text-transform:uppercase; letter-spacing:.03em; }
.app { display:flex; min-height:100vh; }
/* SIDEBAR */
.side { width:218px; background:var(--dark); color:#cbd5e1; display:flex; flex-direction:column; position:fixed; top:0; bottom:0; left:0; z-index:20; }
.side .logo { padding:20px 18px 14px; border-bottom:1px solid #1a1a1a; }
.side .logo b { color:#fff; font-size:17px; }
.side .logo span { color:var(--lime); }
.side .logo small { display:block; color:#64748b; font-size:11px; margin-top:3px; }
.side nav { flex:1; padding:10px 8px; }
.side nav button { display:flex; align-items:center; gap:11px; width:100%; padding:11px 12px; background:none; border:none; color:#cbd5e1; font-size:14px; border-radius:0; margin-bottom:2px; text-align:left; }
.side nav button:hover { background:#161816; color:#fff; }
.side nav button.on { background:var(--grn); color:#000; font-weight:700; box-shadow: inset 2px 2px 0 rgba(255,255,255,.45), inset -2px -2px 0 rgba(0,0,0,.30); }
.side nav button .n { margin-left:auto; background:var(--red); color:#fff; border-radius:99px; font-size:11px; font-weight:700; padding:1px 7px; }
.side .who { padding:14px 18px; border-top:1px solid #1a1a1a; font-size:13px; }
.side .who b { color:#fff; display:block; }
.side .who small { color:#64748b; }
/* MAIN */
.main { flex:1; margin-left:218px; padding:24px 28px 80px; max-width:1280px; }
.topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:22px; gap:12px; }
.topbar h1 { font-size:22px; }
.topbar .sub { color:var(--mut); font-size:13px; margin-top:2px; }
/* BUTTONS */
.btn { display:inline-flex; align-items:center; gap:7px; padding:10px 16px; border-radius:0; border:none; font-size:14px; font-weight:600;
  box-shadow: inset 1px 1px 0 rgba(255,255,255,.4), inset -2px -2px 0 rgba(0,0,0,.20), 0 2px 4px rgba(0,0,0,.22); transition:transform .06s ease, box-shadow .06s ease, background .15s; }
.btn:hover { box-shadow: inset 1px 1px 0 rgba(255,255,255,.5), inset -2px -2px 0 rgba(0,0,0,.22), 0 3px 7px rgba(0,0,0,.26); }
.btn:active { transform:translateY(1px); box-shadow: inset -1px -1px 0 rgba(255,255,255,.35), inset 2px 2px 0 rgba(0,0,0,.24), 0 1px 2px rgba(0,0,0,.18); }
.btn-p { background:var(--grn); color:#000; } .btn-p:hover { background:var(--grn-d); color:#000; }
.btn-lime { background:var(--lime); color:#14532d; } .btn-lime:hover { background:#bef264; }
.btn-o { background:#fff; border:1px solid var(--line); color:var(--ink); } .btn-o:hover { border-color:var(--grn); }
.btn-d { background:#fef2f2; color:var(--red); } .btn-d:hover { background:#fee2e2; }
.btn-sm { padding:6px 11px; font-size:13px; }
.btn:disabled { opacity:.5; cursor:not-allowed; box-shadow:none; }
/* CARDS / STATS */
.card { background:var(--card); border:1px solid var(--line); border-radius:0; padding:18px; box-shadow:0 2px 7px rgba(0,0,0,.07); }
/* SHOP / CATEGORY GRID */
.shopgrid { display:grid; grid-template-columns:repeat(auto-fill,minmax(214px,1fr)); gap:16px; }
.tile { display:flex; flex-direction:column; text-align:left; padding:0; background:#fff; border:1px solid var(--line); color:var(--ink); overflow:hidden; position:relative;
  box-shadow: inset 2px 2px 0 rgba(255,255,255,.9), inset -3px -3px 0 rgba(0,0,0,.10), 0 6px 14px rgba(0,0,0,.18); transition:transform .09s ease, box-shadow .09s ease, border-color .15s; }
.tile:hover { transform:translateY(-3px); border-color:var(--grn); box-shadow: inset 2px 2px 0 rgba(255,255,255,.9), inset -3px -3px 0 rgba(0,0,0,.10), 0 12px 24px rgba(0,0,0,.26); }
.tile:active { transform:translateY(1px); box-shadow: inset -2px -2px 0 rgba(255,255,255,.7), inset 3px 3px 0 rgba(0,0,0,.16), 0 2px 6px rgba(0,0,0,.2); }
.tile-img { height:148px; background:#fff; display:flex; align-items:center; justify-content:center; border-bottom:3px solid var(--grn); }
.tile-img img { max-width:86%; max-height:128px; object-fit:contain; }
.tile-ph { color:#cfd4cf; }
.tile-txt { padding:12px 14px; }
.tile-txt b { font-family:'Oswald','Barlow',sans-serif; text-transform:uppercase; font-size:16px; letter-spacing:.02em; display:block; line-height:1.15; }
.tile-txt small { color:var(--mut); font-size:12px; display:block; margin-top:3px; }
.tile-badge { position:absolute; top:9px; right:9px; background:var(--lime); color:#14532d; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:.05em; padding:3px 8px; display:flex; align-items:center; gap:4px;
  box-shadow: inset 1px 1px 0 rgba(255,255,255,.5), inset -1px -1px 0 rgba(0,0,0,.18), 0 2px 4px rgba(0,0,0,.25); }
.tile-go .tile-img { border-bottom-color:var(--lime); }
.tile-go .tile-txt { background:var(--grn); }
.tile-go .tile-txt b { color:#000; } .tile-go .tile-txt small { color:#0b3d0b; font-weight:600; }
.stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:14px; margin-bottom:20px; }
.stat { background:var(--card); border:1px solid var(--line); border-radius:0; padding:16px; box-shadow:0 2px 7px rgba(0,0,0,.07); }
.stat .v { font-size:26px; font-weight:800; } .stat .l { font-size:12px; color:var(--mut); font-weight:600; text-transform:uppercase; }
.stat.warn { border-color:#fecaca; background:#fef2f2; } .stat.warn .v { color:var(--red); }
/* TABLE */
table { width:100%; border-collapse:collapse; font-size:14px; }
th { text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:.04em; color:var(--mut); padding:9px 10px; border-bottom:2px solid var(--line); }
td { padding:11px 10px; border-bottom:1px solid var(--line); vertical-align:middle; }
tr.click:hover { background:#f0fdf4; cursor:pointer; }
/* BADGES */
.b { display:inline-block; padding:3px 10px; border-radius:99px; font-size:12px; font-weight:700; }
.b-new { background:#dbeafe; color:#1d4ed8; } .b-review { background:#fef3c7; color:#b45309; }
.b-resp { background:#dcfce7; color:#15803d; } .b-closed { background:#e5e7eb; color:#4b5563; }
.b-quote { background:#ede9fe; color:#6d28d9; } .b-order { background:#dcfce7; color:#15803d; }
.b-late { background:#fee2e2; color:var(--red); }
/* GRID HELPERS */
.g2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; } .g3 { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.row { display:flex; gap:10px; align-items:center; } .grow { flex:1; }
/* BELL */
.bellwrap { position:relative; }
.bellbtn { position:relative; background:#fff; border:1px solid var(--line); border-radius:99px; width:42px; height:42px; display:flex; align-items:center; justify-content:center; }
.bellbtn .dot { position:absolute; top:-4px; right:-4px; background:var(--red); color:#fff; font-size:11px; font-weight:700; border-radius:99px; min-width:19px; height:19px; display:flex; align-items:center; justify-content:center; padding:0 4px; }
.belldrop { position:absolute; right:0; top:50px; width:330px; background:#fff; border:1px solid var(--line); border-radius:0; box-shadow:0 12px 32px rgba(0,0,0,.14); z-index:50; overflow:hidden; }
.belldrop .hd { padding:12px 14px; font-weight:700; border-bottom:1px solid var(--line); font-size:14px; }
.belldrop .it { padding:11px 14px; border-bottom:1px solid var(--line); font-size:13px; cursor:pointer; }
.belldrop .it:hover { background:#f0fdf4; }
.belldrop .it small { color:var(--mut); }
.belldrop .none { padding:18px 14px; color:var(--mut); font-size:13px; }
/* MODAL */
.ovl { position:fixed; inset:0; background:rgba(15,23,42,.55); display:flex; align-items:center; justify-content:center; z-index:100; padding:16px; }
.mod { background:#fff; border-radius:0; width:100%; max-width:560px; max-height:92vh; overflow-y:auto; }
.mod .mh { display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid var(--line); }
.mod .mb { padding:20px; } .mod .mf { padding:14px 20px; border-top:1px solid var(--line); display:flex; justify-content:flex-end; gap:10px; }
/* THREAD */
.thread { display:flex; flex-direction:column; gap:10px; }
.msg { max-width:78%; padding:10px 14px; border-radius:0; font-size:14px; }
.msg.me { align-self:flex-end; background:var(--grn); color:#fff; border-bottom-right-radius:4px; }
.msg.them { align-self:flex-start; background:#fff; border:1px solid var(--line); border-bottom-left-radius:4px; }
.msg small { display:block; opacity:.75; font-size:11px; margin-top:4px; }
/* BUILDER */
.builder { display:grid; grid-template-columns:340px 1fr; gap:18px; align-items:start; }
.preview3d { background:linear-gradient(160deg,#f8fafc,#e2e8f0); border:1px solid var(--line); border-radius:0; padding:10px; }
.spec { display:grid; grid-template-columns:repeat(auto-fit,minmax(120px,1fr)); gap:10px; margin-top:12px; }
.spec div { background:#f8fafc; border:1px solid var(--line); border-radius:0; padding:9px 11px; }
/* CUSTOM PROFILE EDITOR */
.profrows { display:flex; flex-direction:column; gap:7px; }
.profrow { display:flex; align-items:flex-end; gap:8px; }
.profrow .seglet { font-family:'Oswald',sans-serif; font-weight:700; font-size:15px; background:#0b0d0b; color:var(--lime); width:28px; height:34px; display:flex; align-items:center; justify-content:center; flex:0 0 28px; }
.profrow .segf { flex:1; }
.profrow .segf label { font-size:10px; margin-bottom:2px; }
.profrow .segf input { padding:6px 8px; }
.spec b { display:block; font-size:15px; } .spec span { font-size:11px; color:var(--mut); text-transform:uppercase; font-weight:600; }
/* LOGIN */
.login { min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(160deg,#000 0%,#0a140a 65%,#11320f 130%); padding:18px; }
.lbox { background:#fff; border-radius:0; padding:32px; width:100%; max-width:420px; }
.lbox h1 { font-size:22px; margin-bottom:4px; } .lbox h1 span { color:var(--grn); }
.lbox .tabs { display:flex; gap:6px; margin:18px 0 16px; background:var(--bg); border-radius:9px; padding:4px; }
.lbox .tabs button { flex:1; padding:9px; border:none; border-radius:7px; background:none; font-weight:600; font-size:14px; color:var(--mut); }
.lbox .tabs button.on { background:#fff; color:var(--ink); box-shadow:0 1px 4px rgba(0,0,0,.1); }
.fld { margin-bottom:12px; }
.err { background:#fef2f2; color:var(--red); padding:10px 13px; border-radius:0; font-size:13px; margin-bottom:12px; }
.note { background:#f0fdf4; color:#166534; padding:10px 13px; border-radius:0; font-size:13px; margin-bottom:12px; }
.banner { display:flex; gap:11px; align-items:flex-start; background:#fef2f2; border:1px solid #fecaca; color:#991b1b; padding:13px 16px; border-radius:0; margin-bottom:18px; font-size:14px; }
.disclaimer { display:flex; gap:10px; align-items:flex-start; background:#fffbeb; border:1px solid #fde68a; border-left:3px solid var(--amber); color:#92400e; padding:11px 14px; margin-top:12px; font-size:12.5px; line-height:1.45; }
.disclaimer svg { flex:0 0 auto; width:18px; height:18px; margin-top:1px; }
/* MOBILE */
@media (max-width: 860px) {
  .side { width:100%; height:auto; bottom:0; top:auto; flex-direction:row; align-items:center; }
  .side .logo, .side .who { display:none; }
  .side nav { display:flex; padding:6px; gap:2px; overflow-x:auto; }
  .side nav button { flex-direction:column; gap:3px; font-size:10px; padding:8px 10px; white-space:nowrap; }
  .main { margin-left:0; padding:16px 14px 110px; }
  .builder, .g2, .g3 { grid-template-columns:1fr; }
}
`;

// ─── SHARED WIDGETS ──────────────────────────────────────────
const Modal = ({ title, onClose, children, footer }) => (
  <div className="ovl" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div className="mod">
      <div className="mh"><b>{title}</b><button className="btn btn-o btn-sm" onClick={onClose}>{IC.x}</button></div>
      <div className="mb">{children}</div>
      {footer && <div className="mf">{footer}</div>}
    </div>
  </div>
);
const StatusBadge = ({ s }) => <span className={`b ${STATUS_META[s]?.cls || "b-closed"}`}>{STATUS_META[s]?.label || s}</span>;
const TypeBadge = ({ t }) => <span className={`b ${t === "order" ? "b-order" : "b-quote"}`}>{t === "order" ? "Order" : "Quote"}</span>;

function Bell({ items, onPick }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="bellwrap" ref={ref}>
      <button className="bellbtn" onClick={() => setOpen(!open)} title="Notifications">
        {IC.bell}{items.length > 0 && <span className="dot">{items.length}</span>}
      </button>
      {open && (
        <div className="belldrop">
          <div className="hd">Notifications</div>
          {items.length === 0 && <div className="none">You're all caught up.</div>}
          {items.map((n) => (
            <div className="it" key={n.key} onClick={() => { setOpen(false); n.go && onPick(n); }}>
              {n.urgent && <span className="b b-late" style={{ marginRight: 6 }}>Needs response</span>}
              {n.text}<br /><small>{n.sub}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── LOGIN / REGISTER ────────────────────────────────────────
function LoginScreen({ onLogin, onGuest, dbError }) {
  const [tab, setTab] = useState("in");
  const [f, setF] = useState({ email: "", password: "", name: "", company: "", phone: "", distributor: "", salesRep: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const requestReset = async () => {
    const em = forgotEmail.trim().toLowerCase();
    if (!em) return;
    setForgotMsg("sending");
    try {
      const { data } = await supabase.from("portal_users").select("id").eq("email", em).maybeSingle();
      if (data) {
        const token = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
        await supabase.from("portal_users").update({ reset_token: token, reset_expires: new Date(Date.now() + 3600000).toISOString() }).eq("id", data.id);
        const link = `${window.location.origin}/?reset=${token}`;
        await sendMail(em, "Reset your Flash-Tech password", emailShell("Password Reset", `<p>We received a request to reset your Flash-Tech Portal password. This link is valid for 1 hour:</p>${mailBtn("Reset My Password", link)}<p style="font-size:12px;color:#6a7278;margin-top:14px">If you didn't request this, you can safely ignore this email.</p>`), NOTIFY_EMAIL);
      }
    } catch (e) { /* show generic message regardless */ }
    setForgotMsg("sent");
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      if (!hasSupabase) throw new Error("Database not configured. Add your Supabase keys to .env.local.");
      const hash = await sha256(f.password);
      if (tab === "in") {
        const { data, error } = await supabase.from("portal_users").select("*").eq("email", f.email.trim().toLowerCase()).maybeSingle();
        if (error) throw new Error(error.message.includes("does not exist") ? "Database tables not set up yet — run database-setup.sql in Supabase." : error.message);
        if (!data || data.password_hash !== hash) throw new Error("Wrong email or password.");
        onLogin(data);
      } else {
        if (!f.name.trim()) throw new Error("Please enter your name.");
        if (!f.company.trim()) throw new Error("Please enter your company name.");
        if (!f.distributor.trim()) throw new Error("Please enter your distributor (who you order through).");
        if (!f.email.trim()) throw new Error("Please enter your email.");
        if (f.password.length < 4) throw new Error("Password must be at least 4 characters.");
        const row = { email: f.email.trim().toLowerCase(), password_hash: hash, name: f.name, company: f.company, phone: f.phone, distributor: f.distributor, sales_rep: f.salesRep, role: "contractor" };
        const { data, error } = await supabase.from("portal_users").insert(row).select().single();
        if (error) throw new Error(error.code === "23505" ? "An account with that email already exists." : error.message);
        onLogin(data);
      }
    } catch (ex) { setErr(ex.message); }
    setBusy(false);
  };

  return (
    <div className="login">
      <div className="lbox">
        <h1>Flash-Tech <span>Contractor Portal</span></h1>
        <div style={{ color: "var(--mut)", fontSize: 14 }}>Quotes, orders & custom flashings — Flash-Tech Mfg, Inc.</div>
        {dbError && <div className="err" style={{ marginTop: 14 }}>Heads up: the portal database tables weren't found. Run <b>database-setup.sql</b> in your Supabase SQL editor first.</div>}
        <div className="tabs">
          <button className={tab === "in" ? "on" : ""} onClick={() => setTab("in")}>Sign In</button>
          <button className={tab === "up" ? "on" : ""} onClick={() => setTab("up")}>Create Account</button>
        </div>
        <form onSubmit={submit}>
          {err && <div className="err">{err}</div>}
          {tab === "up" && (<>
            <div className="fld"><label>Your Name</label><input value={f.name} onChange={set("name")} placeholder="Mike Rivera" /></div>
            <div className="fld"><label>Company</label><input value={f.company} onChange={set("company")} placeholder="Rivera Roofing LLC" /></div>
            <div className="fld"><label>Phone</label><input value={f.phone} onChange={set("phone")} placeholder="(619) 555-0123" /></div>
            <div className="g2">
              <div className="fld"><label>Distributor</label><input value={f.distributor} onChange={set("distributor")} placeholder="ABC Supply, SRS, Beacon…" /></div>
              <div className="fld"><label>Sales Rep (optional)</label><input value={f.salesRep} onChange={set("salesRep")} placeholder="Rep name" /></div>
            </div>
          </>)}
          <div className="fld"><label>{tab === "in" ? "Email or Username" : "Email"}</label><input type={tab === "in" ? "text" : "email"} value={f.email} onChange={set("email")} placeholder={tab === "in" ? "you@company.com" : "you@company.com"} /></div>
          <div className="fld"><label>Password</label><input type="password" value={f.password} onChange={set("password")} /></div>
          <button className="btn btn-p" style={{ width: "100%", justifyContent: "center", marginTop: 4 }} disabled={busy}>
            {busy ? "Working..." : tab === "in" ? "Sign In" : "Create Account"}
          </button>
        </form>
        {tab === "in" && (
          <div style={{ marginTop: 10, textAlign: "center" }}>
            <button type="button" onClick={() => { setForgot(!forgot); setForgotMsg(""); }} style={{ background: "none", border: "none", color: "var(--grn)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Forgot your password?</button>
            {forgot && (forgotMsg === "sent"
              ? <div className="note" style={{ marginTop: 8, textAlign: "left" }}>If an account exists for that email, we've sent a password-reset link. Check your inbox (and spam).</div>
              : <div style={{ marginTop: 8, textAlign: "left" }}>
                  <div className="fld"><label>Account Email</label><input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="you@company.com" /></div>
                  <button type="button" className="btn btn-o" style={{ width: "100%", justifyContent: "center" }} disabled={forgotMsg === "sending"} onClick={requestReset}>{forgotMsg === "sending" ? "Sending…" : "Email me a reset link"}</button>
                  <div style={{ fontSize: 12, color: "var(--mut)", marginTop: 6 }}>Or call Flash-Tech at (619) 334-9491 and we'll reset it for you.</div>
                </div>)}
          </div>
        )}
        <button className="btn btn-o" style={{ width: "100%", justifyContent: "center", marginTop: 10 }} onClick={onGuest}>
          {IC.wrench}&nbsp;Try the Custom Flashing Builder (no account)
        </button>
        <div style={{ marginTop: 14, fontSize: 12, color: "var(--mut)" }}>
          Flash-Tech staff: sign in with your admin account.
        </div>
      </div>
    </div>
  );
}

// ─── CATALOG ─────────────────────────────────────────────────
// ─── SHOP HOME (category grid of 3D tiles) ───────────────────
function ShopPage({ products, onPickCategory, onBuilder, discPct = 0 }) {
  const rep = (pred) => { const p = products.find(pred); return p ? productImage(p) : null; };
  const catImg = (c) => rep((p) => p.category === c && productImage(p));
  const cats = [...new Set(products.map((p) => p.category))];
  const coneImg = rep((p) => p.sku === "FT-1001TPO") || rep((p) => p.category === "Pipe Boots & Flashings" && productImage(p));
  const edgeImg = catImg("Edge Metal");
  const allImg = catImg("Drains") || rep((p) => productImage(p));
  const PIPE = "Pipe Boots & Flashings";

  const tiles = [
    { key: "b-cone", label: "Custom Flashings", sub: "Boots, cones, wraps & scuppers — designed to size", img: coneImg, go: true, badge: "Builder", icon: IC.wrench, onClick: () => onBuilder("conicalBoot") },
    { key: "b-metal", label: "Metal Builder", sub: "Drip edge, coping, gravel stop & more", img: edgeImg, go: true, badge: "Builder", icon: IC.wrench, onClick: () => onBuilder("dripEdge") },
    { key: "catalog", label: "Full Catalog", sub: "Browse every part & price", img: allImg, go: true, badge: "All Parts", icon: IC.box, onClick: () => onPickCategory("All") },
    { key: "c-" + PIPE, label: PIPE, sub: "Browse catalog", img: catImg(PIPE), onClick: () => onPickCategory(PIPE) },
    ...cats.filter((c) => c !== PIPE).map((c) => ({ key: "c-" + c, label: c, sub: "Browse catalog", img: catImg(c), onClick: () => onPickCategory(c) })),
  ];

  return (
    <div className="card">
      {discPct > 0 && <div className="note" style={{ marginBottom: 14 }}>Your account pricing includes a <b>{discPct}% discount</b> — applied automatically to every price.</div>}
      <div className="shopgrid">
        {tiles.map((t) => (
          <button key={t.key} className={"tile" + (t.go ? " tile-go" : "")} onClick={t.onClick}>
            {t.badge && <span className="tile-badge">{t.icon}{t.badge}</span>}
            <div className="tile-img">
              {t.img
                ? <img src={t.img} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                : <div className="tile-ph">{IC.box}</div>}
            </div>
            <div className="tile-txt"><b>{t.label}</b><small>{t.sub}</small></div>
          </button>
        ))}
      </div>
    </div>
  );
}

function CatalogPage({ products, onAdd, disc = (x) => x, discPct = 0, seedCat = null, seedNonce = 0, readOnly = false }) {
  const [cat, setCat] = useState("Popular Items");
  const [q, setQ] = useState("");
  const [qty, setQty] = useState({});
  const cats = ["Popular Items", "All", ...new Set(products.map((p) => p.category))];
  const inCat = (p) => cat === "Popular Items" ? POPULAR_SKUS.has(p.sku) : (cat === "All" || p.category === cat);
  const list = products.filter((p) => inCat(p) && (p.description + p.sku).toLowerCase().includes(q.toLowerCase()));
  // jump to a category when arriving from the Home grid
  useEffect(() => { if (seedNonce && seedCat) setCat(seedCat); /* eslint-disable-next-line */ }, [seedNonce]);
  return (
    <div className="card">
      {discPct > 0 && <div className="note" style={{ marginBottom: 12 }}>Your account pricing includes a <b>{discPct}% discount</b> — prices below already reflect it.</div>}
      <div className="row" style={{ marginBottom: 14, flexWrap: "wrap" }}>
        <select style={{ width: 220 }} value={cat} onChange={(e) => setCat(e.target.value)}>{cats.map((c) => <option key={c}>{c}</option>)}</select>
        <input className="grow" placeholder="Search parts & part numbers..." value={q} onChange={(e) => setQ(e.target.value)} style={{ minWidth: 180 }} />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table><thead><tr><th style={{ width: 52 }}></th><th>Part #</th><th>Description</th><th>Price</th>{!readOnly && <th style={{ width: 210 }}>Add to Request</th>}</tr></thead>
          <tbody>
            {list.map((p) => {
              const img = productImage(p);
              return (
              <tr key={p.sku}>
                <td style={{ width: 52 }}>
                  {img
                    ? <img src={img} alt="" loading="lazy" width="44" height="44" style={{ objectFit: "contain", background: "#fff", border: "1px solid var(--line)", display: "block" }} onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />
                    : <div style={{ width: 44, height: 44, border: "1px solid var(--line)", background: "#f7f7f7" }} />}
                </td>
                <td style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{p.sku}</td>
                <td>{p.description}<br /><small style={{ color: "var(--mut)" }}>{p.category}</small></td>
                <td style={{ whiteSpace: "nowrap" }}>{discPct > 0 && <s style={{ color: "var(--mut)", marginRight: 6, fontWeight: 400 }}>{fmt(p.price)}</s>}<b>{fmt(disc(p.price))}</b> / {p.unit === "lf" ? "LF" : "EA"}</td>
                {!readOnly && <td>
                  <div className="row">
                    <input type="number" min="1" style={{ width: 86 }} placeholder={p.unit === "lf" ? "Lin. ft" : "Qty"}
                      value={qty[p.sku] || ""} onChange={(e) => setQty({ ...qty, [p.sku]: e.target.value })} />
                    <button className="btn btn-lime btn-sm" onClick={() => { const n = parseFloat(qty[p.sku]); if (n > 0) { onAdd(p, n); setQty({ ...qty, [p.sku]: "" }); } }}>{IC.plus}Add</button>
                  </div>
                </td>}
              </tr>
              );
            })}
            {list.length === 0 && <tr><td colSpan={readOnly ? 4 : 5} style={{ color: "var(--mut)" }}>No parts match.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── CUSTOM PROFILE: segment editor (A/B/C lengths + bend angles) ───
function ProfileEditor({ segs, onChange }) {
  const set = (i, key, val) => onChange(segs.map((s, j) => (j === i ? { ...s, [key]: val } : s)));
  const add = () => { if (segs.length < 11) onChange([...segs, { len: 2, ang: 90 }]); };
  const removeLast = () => { if (segs.length > 2) onChange(segs.slice(0, -1)); };
  return (
    <div className="fld">
      <label>Profile Segments — length &amp; bend angle</label>
      <div style={{ fontSize: 12, color: "var(--mut)", margin: "0 0 9px" }}>
        Draw it on the canvas, or type here. Each row is a straight run (A, B, C…) and the bend angle before it. Negative angle bends the opposite way; up to 10 bends.
      </div>
      <div className="profrows">
        {segs.map((s, i) => {
          const U = String.fromCharCode(65 + i), L = String.fromCharCode(97 + i);
          return (
            <div className="profrow" key={i}>
              <span className="seglet">{U}</span>
              <div className="segf"><label>Length (in)</label>
                <input type="number" min="0" step="0.25" value={s.len}
                  onChange={(e) => set(i, "len", e.target.value)} /></div>
              <div className="segf"><label>{i === 0 ? "Start °" : `Bend ${L} (°)`}</label>
                <input type="number" step={i === 0 ? 1 : 5} value={s.ang}
                  placeholder="°" onChange={(e) => set(i, "ang", e.target.value)} /></div>
            </div>
          );
        })}
      </div>
      <div className="row" style={{ marginTop: 9 }}>
        <button className="btn btn-o btn-sm" onClick={add} disabled={segs.length >= 11}>{IC.plus}Add Bend</button>
        <button className="btn btn-o btn-sm" onClick={removeLast} disabled={segs.length <= 2}>Remove Last</button>
      </div>
    </div>
  );
}

// ─── CUSTOM PROFILE: snapping helpers ───
const SNAP_IN = 1 / 16;                                   // snap lengths to nearest 1/16"
const snapLen = (v) => Math.max(SNAP_IN, Math.round(v / SNAP_IN) * SNAP_IN);
const snapDeg = (v) => Math.round(v);                      // snap angles to nearest degree
const normDeg = (a) => { a = ((a % 360) + 360) % 360; return a > 180 ? a - 360 : a; }; // tidy to (-180, 180]
const fmtIn = (v) => {                                     // 3.0625 -> 3 1/16"
  let s16 = Math.round((parseFloat(v) || 0) * 16);
  const neg = s16 < 0; s16 = Math.abs(s16);
  const whole = Math.floor(s16 / 16);
  let num = s16 % 16, den = 16;
  while (num && num % 2 === 0) { num /= 2; den /= 2; }
  const body = num ? `${whole ? whole + " " : ""}${num}/${den}` : `${whole}`;
  return `${neg ? "-" : ""}${body}"`;
};

// ─── CUSTOM PROFILE: drawable 2D cross-section (mouse / touch) ───
function ProfileCanvas({ segs, onChange, drawMode = false, onFinish = () => {}, color = "#0DD714", height = 300 }) {
  const svgRef = useRef(null);
  const [start, setStart] = useState(null);   // inch-space anchor of the first vertex
  const [cursor, setCursor] = useState(null); // inch-space cursor while drawing
  useEffect(() => { if (drawMode) { setStart(null); setCursor(null); } }, [drawMode]);

  const pts = customProfilePoints(segs);
  const heading = segs.reduce((h, s) => h + (parseFloat(s.ang) || 0), 0); // current pen heading (deg)
  const off = drawMode && start ? start : { x: 0, y: 0 };
  const tip = pts[pts.length - 1];
  const penTip = { x: off.x + tip[0], y: off.y + tip[1] };

  const toInch = (e) => {
    const svg = svgRef.current; if (!svg) return null;
    const m = svg.getScreenCTM(); if (!m) return null;
    const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    const loc = p.matrixTransform(m.inverse());
    return { x: loc.x, y: loc.y };
  };
  const calcSeg = (target) => {
    const dx = target.x - penTip.x, dy = target.y - penTip.y;
    return { len: snapLen(Math.hypot(dx, dy)), absAng: snapDeg(Math.atan2(dy, dx) * 180 / Math.PI) };
  };
  const onDown = (e) => {
    if (!drawMode) return;
    e.preventDefault();
    const ip = toInch(e); if (!ip) return;
    if (!start) { setStart(ip); setCursor(ip); return; }
    if (segs.length >= 11) return;
    const { len, absAng } = calcSeg(ip);
    if (segs.length === 0) onChange([{ len, ang: normDeg(absAng) }]);
    else onChange([...segs, { len, ang: normDeg(absAng - heading) }]);
  };
  const onMove = (e) => { if (drawMode) { const ip = toInch(e); if (ip) setCursor(ip); } };

  // viewBox: fixed inch grid while drawing, auto-fit when static
  let vb, grid = null, scale;
  if (drawMode) {
    const GX0 = -2, GY0 = -9, GW = 18, GH = 18; scale = 18;
    vb = `${GX0} ${GY0} ${GW} ${GH}`;
    const g = [];
    for (let x = GX0; x <= GX0 + GW; x++) g.push(<line key={"gx" + x} x1={x} y1={GY0} x2={x} y2={GY0 + GH} stroke={x === 0 ? "#cbd5e1" : "#e8edf2"} strokeWidth="0.03" />);
    for (let y = GY0; y <= GY0 + GH; y++) g.push(<line key={"gy" + y} x1={GX0} y1={y} x2={GX0 + GW} y2={y} stroke={y === 0 ? "#cbd5e1" : "#e8edf2"} strokeWidth="0.03" />);
    grid = g;
  } else {
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const w = Math.max(0.5, maxX - minX), h = Math.max(0.5, maxY - minY); scale = Math.max(w, h);
    const pad = scale * 0.22 + 0.5;
    vb = `${minX - pad} ${minY - pad} ${w + pad * 2} ${h + pad * 2}`;
  }
  const lw = scale * 0.02, fs = scale * 0.058, r2 = (n) => Math.round(n * 100) / 100;
  const dpts = pts.map((p) => [p[0] + off.x, p[1] + off.y]);
  const poly = dpts.map((p) => `${p[0]},${p[1]}`).join(" ");

  // rubber-band preview of the next snapped segment
  let preview = null;
  if (drawMode && start && cursor) {
    const { len, absAng } = calcSeg(cursor);
    const rr = absAng * Math.PI / 180;
    const end = { x: penTip.x + Math.cos(rr) * len, y: penTip.y + Math.sin(rr) * len };
    const showAng = normDeg(segs.length === 0 ? absAng : absAng - heading);
    preview = (
      <g>
        <line x1={penTip.x} y1={penTip.y} x2={end.x} y2={end.y} stroke="#0aa810" strokeWidth={lw} strokeDasharray={`${lw * 3} ${lw * 2}`} strokeLinecap="round" />
        <circle cx={end.x} cy={end.y} r={lw * 1.5} fill="#0aa810" />
        <text x={end.x + fs * 0.4} y={end.y - fs * 0.4} fontSize={fs} fill="#0aa810" fontWeight="700" style={{ fontFamily: "Oswald, sans-serif" }}>{fmtIn(len)} · {showAng}°</text>
      </g>
    );
  }

  return (
    <svg ref={svgRef} viewBox={vb} width="100%" height={height}
      onPointerDown={onDown} onPointerMove={onMove} onDoubleClick={() => drawMode && onFinish()}
      style={{ display: "block", touchAction: "none", cursor: drawMode ? "crosshair" : "default" }}>
      {grid}
      {drawMode && start && <circle cx={start.x} cy={start.y} r={lw * 1.6} fill="#0b0d0b" />}
      <polyline points={poly} fill="none" stroke={color} strokeWidth={lw} strokeLinejoin="round" strokeLinecap="round" />
      {dpts.map((p, i) => <circle key={"v" + i} cx={p[0]} cy={p[1]} r={lw * 1.15} fill="#0b0d0b" />)}
      {dpts.slice(1).map((b, i) => {
        const a = dpts[i];
        const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
        const nx = -(b[1] - a[1]) / len, ny = (b[0] - a[0]) / len;
        return <text key={"s" + i} x={mx + nx * fs * 1.05} y={my + ny * fs * 1.05} fontSize={fs} fill="#0b0d0b"
          textAnchor="middle" dominantBaseline="middle" fontWeight="700" style={{ fontFamily: "Oswald, sans-serif" }}>{String.fromCharCode(65 + i)}={r2(len)}"</text>;
      })}
      {segs.map((s, i) => (i > 0 && Math.abs(parseFloat(s.ang) || 0) > 0
        ? <text key={"a" + i} x={dpts[i][0]} y={dpts[i][1] - fs * 0.55} fontSize={fs * 0.82} fill="#0aa810"
            textAnchor="middle" dominantBaseline="middle" fontWeight="700">{parseFloat(s.ang)}°</text>
        : null))}
      {preview}
    </svg>
  );
}

// ─── CUSTOM FLASHING BUILDER ─────────────────────────────────
function BuilderPage({ guest, onAddToCart, onSavePart, disc = (x) => x, discPct = 0, detectInfo = null, detectNonce = 0, seedType = null, seedNonce = 0 }) {
  const [typeId, setTypeId] = useState("dripEdge");
  const [matCode, setMatCode] = useState("G26");
  const [params, setParams] = useState(defaultParams("dripEdge"));
  const [lenFt, setLenFt] = useState(10);
  const [pieces, setPieces] = useState(10);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState("");
  const [drawMode, setDrawMode] = useState(false);

  const t = typeById(typeId);
  const isSheet = (t.kind || "sheet") === "sheet";

  // Valid/sanitized params for all math & saving — lets the inputs hold blank/partial
  // values mid-edit (so you can clear and retype) without breaking the live preview.
  const isCustom = isSheet && !!t.custom;
  const vp = useMemo(() => {
    const o = { ...params };
    for (const f of t.fields) {
      if (f.type === "choice") continue;
      const n = parseFloat(params[f.key]);
      o[f.key] = isNaN(n) ? f.def : Math.max(f.min, Math.min(f.max, n));
    }
    if (t.custom && Array.isArray(o.segs)) {
      // First angle = absolute start heading; the rest are bends. All kept (drawing sets the start tilt).
      o.segs = o.segs.map((s) => ({ len: Math.max(0, parseFloat(s.len) || 0), ang: parseFloat(s.ang) || 0 }));
    }
    return o;
  }, [t, params]);

  // sheet-metal path. Custom drawn profiles are always priced as a 10' piece.
  const effLen = isCustom ? 10 : lenFt;
  const pts = useMemo(() => (isSheet ? t.points(vp) : []), [isSheet, t, vp]);
  const girth = isSheet ? profileGirth(pts) : 0;
  const bends = isSheet ? profileBends(pts) : 0;
  // single-ply membrane path
  const geo = useMemo(() => (isSheet ? null : t.geometry(vp)), [isSheet, t, vp]);
  const split = !!vp.split;
  const isScupper = !isSheet && geo && geo.shape === "scupper";

  const perPiece = isSheet ? piecePrice(girth, bends, effLen, matCode)
    : isScupper ? scupperPrice(geo, matCode)
    : membranePrice(geo, matCode, split, vp.mil);
  const perLF = isSheet ? Math.round((perPiece / effLen) * 100) / 100 : null;
  const partNo = isSheet ? customPartNumber(typeId, matCode, girth)
    : isScupper ? scupperPartNumber(matCode, geo)
    : membranePartNumber(typeId, matCode, geo, split);
  const desc = isSheet ? customDescription(typeId, matCode, vp, effLen, girth) : membraneDescription(typeId, matCode, vp, split);
  const total = Math.round(perPiece * pieces * 100) / 100;

  const pickType = (id) => {
    const nk = typeById(id).kind || "sheet";
    setTypeId(id); setParams(defaultParams(id)); setMatCode(nk === "sheet" ? "G26" : "TPO-W"); setDrawMode(false);
  };
  // when a photo is identified, jump the builder to the detected type
  useEffect(() => {
    if (detectNonce && detectInfo?.typeId && typeById(detectInfo.typeId)) { pickType(detectInfo.typeId); setSaved(""); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detectNonce]);
  // when arriving from a Home tile (Custom Flashings / Metal Builder)
  useEffect(() => {
    if (seedNonce && seedType && typeById(seedType)) { pickType(seedType); setSaved(""); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedNonce]);
  const custom = isSheet
    ? { part_number: partNo, name: name || `${t.name} ${girth}"`, flashing_type: typeId, material_code: matCode, params: vp, girth, bends, piece_length_ft: effLen, price_per_piece: perPiece, description: desc }
    : { part_number: partNo, name: name || `${split ? "Split " : ""}${t.name}`, flashing_type: typeId, material_code: matCode, params: vp, girth: null, bends: null, piece_length_ft: null, price_per_piece: perPiece, description: desc };
  const matType = matCode.split("-")[0], matColor = matCode.split("-")[1] || "G";

  return (
    <>
    {detectInfo && detectNonce > 0 && (
      <div className="note" style={{ marginBottom: 14 }}>
        {IC.camera}&nbsp;From your photo, this looks like a <b>{detectInfo.label}</b> <span style={{ color: "var(--mut)" }}>({detectInfo.confidence} confidence)</span>{detectInfo.note ? ` — ${detectInfo.note}` : ""}. Confirm the type below and enter the sizes (change it if it's not right).
      </div>
    )}
    <div className="builder">
      <div className="card">
        <div className="fld"><label>Flashing Type</label>
          <select value={typeId} onChange={(e) => pickType(e.target.value)}>
            <optgroup label="Sheet Metal (by the foot)">
              {FLASHING_TYPES.filter((ft) => (ft.kind || "sheet") === "sheet").map((ft) => <option key={ft.id} value={ft.id}>{ft.name}</option>)}
            </optgroup>
            <optgroup label="Single-Ply Membrane (TPO / PVC)">
              {FLASHING_TYPES.filter((ft) => ft.kind === "membrane").map((ft) => <option key={ft.id} value={ft.id}>{ft.name}</option>)}
            </optgroup>
          </select>
        </div>
        {isSheet ? (
          <>
            <div className="fld"><label>Material</label>
              <select value={matType} onChange={(e) => { const v = e.target.value; setMatCode(COATED_METALS.some((m) => m.code === v) ? `${v}-${matColor}` : v); }}>
                <optgroup label="Bare Metal">{MATERIALS.map((m) => <option key={m.code} value={m.code}>{m.name}</option>)}</optgroup>
                <optgroup label="Coated Metal (heat-weldable)">{COATED_METALS.map((m) => <option key={m.code} value={m.code}>{m.name}</option>)}</optgroup>
              </select>
            </div>
            {matCode.includes("-") && (
              <div className="fld"><label>Color</label>
                <select value={matColor} onChange={(e) => setMatCode(`${matType}-${e.target.value}`)}>{MEMBRANE_COLORS.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}</select>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="g2">
              <div className="fld"><label>Membrane</label>
                <select value={matType} onChange={(e) => setMatCode(`${e.target.value}-${matColor}`)}>{MEMBRANE_TYPES.map((m) => <option key={m.code} value={m.code}>{m.name}</option>)}</select>
              </div>
              <div className="fld"><label>Color</label>
                <select value={matColor} onChange={(e) => setMatCode(`${matType}-${e.target.value}`)}>{MEMBRANE_COLORS.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}</select>
              </div>
            </div>
          </>
        )}
        {isCustom && <ProfileEditor segs={params.segs || []} onChange={(segs) => setParams((pp) => ({ ...pp, segs }))} />}
        {t.fields.map((f) => (
          <div className="fld" key={f.key}>
            <label>{f.label}</label>
            {f.type === "choice"
              ? <select value={params[f.key]} onChange={(e) => setParams({ ...params, [f.key]: e.target.value })}>{f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
              : <input type="number" min={f.min} max={f.max} step={f.step || 0.5} value={params[f.key]}
                  onChange={(e) => setParams((pp) => ({ ...pp, [f.key]: e.target.value }))}
                  onBlur={(e) => { const n = parseFloat(e.target.value); setParams((pp) => ({ ...pp, [f.key]: isNaN(n) ? f.def : Math.max(f.min, Math.min(f.max, n)) })); }} />}
          </div>
        ))}
        {t.splittable && (
          <div className="fld"><label>Split (wraps an existing pipe)</label>
            <div className="row">
              <button className={`btn grow ${!split ? "btn-p" : "btn-o"}`} style={{ justifyContent: "center" }} onClick={() => setParams({ ...params, split: false })}>Solid</button>
              <button className={`btn grow ${split ? "btn-p" : "btn-o"}`} style={{ justifyContent: "center" }} onClick={() => setParams({ ...params, split: true })}>Split</button>
            </div>
          </div>
        )}
        {isSheet ? (
          <div className="g2">
            <div className="fld"><label>Piece Length (ft)</label>
              {isCustom
                ? <input value={`10'-0"`} disabled title="Custom profiles are priced per 10' piece" />
                : <select value={lenFt} onChange={(e) => setLenFt(parseFloat(e.target.value))}>{[8, 10, 12].map((l) => <option key={l} value={l}>{l}'-0"</option>)}</select>}
            </div>
            <div className="fld"><label># of Pieces</label>
              <input type="number" min="1" value={pieces} onChange={(e) => setPieces(Math.max(1, parseInt(e.target.value) || 1))} />
            </div>
          </div>
        ) : (
          <div className="fld"><label>Quantity (each)</label>
            <input type="number" min="1" value={pieces} onChange={(e) => setPieces(Math.max(1, parseInt(e.target.value) || 1))} />
          </div>
        )}
        <div className="fld"><label>Save As (optional)</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder='e.g. "Smith job 4&quot; vents"' /></div>
        {guest ? (
          <div className="note">Create a free account to add this part to a quote or order request.</div>
        ) : (
          <>
            {saved && <div className="note">{saved}</div>}
            <div className="row">
              <button className="btn btn-p grow" style={{ justifyContent: "center" }} onClick={() => { onAddToCart(custom, pieces); setSaved("Added to your request cart."); }}>{IC.cart}&nbsp;Add to Cart</button>
              <button className="btn btn-o" onClick={async () => { await onSavePart(custom); setSaved("Saved to My Parts."); }}>{IC.bookmark}&nbsp;Save</button>
            </div>
          </>
        )}
      </div>
      <div>
        {isCustom && (
          <div className="row" style={{ marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
            {!drawMode
              ? <button className="btn btn-p btn-sm" onClick={() => { setParams((pp) => ({ ...pp, segs: [] })); setDrawMode(true); }}>✏️&nbsp;Draw New</button>
              : <>
                  <button className="btn btn-o btn-sm" onClick={() => setParams((pp) => ({ ...pp, segs: (pp.segs || []).slice(0, -1) }))}>Undo Point</button>
                  <button className="btn btn-p btn-sm" onClick={() => setDrawMode(false)}>Finish</button>
                </>}
            <span style={{ fontSize: 12, color: "var(--mut)", alignSelf: "center" }}>
              {drawMode ? "Tap to drop each corner — snaps to 1° & 1/16″. Double-tap or Finish when done." : "Tap a corner to draw, or edit the fields on the left."}
            </span>
          </div>
        )}
        <div className="preview3d">
          {isSheet
            ? (isCustom
                ? <ProfileCanvas segs={params.segs || []} onChange={(segs) => setParams((pp) => ({ ...pp, segs }))} drawMode={drawMode} onFinish={() => setDrawMode(false)} height={300} />
                : <Flashing3D points={pts} lengthFt={lenFt} materialCode={matCode} height={300} />)
            : <SinglePly3D geo={geo} materialCode={matCode} split={split} height={300} />}
        </div>
        <div className="spec">
          <div><span>Part Number</span><b style={{ fontSize: 13 }}>{partNo}</b></div>
          {isSheet ? (<>
            <div><span>{isCustom ? "Stretch-Out" : "Girth"}</span><b>{girth}"</b></div>
            <div><span>Bends</span><b>{bends}</b></div>
            <div><span>Per Piece ({effLen}')</span><b>{fmt(disc(perPiece))}</b></div>
            <div><span>Per Lin. Ft</span><b>{fmt(disc(perLF))}</b></div>
            <div><span>{pieces} pcs ({pieces * effLen} LF)</span><b>{fmt(disc(total))}</b></div>
          </>) : isScupper ? (<>
            <div><span>Opening</span><b>{geo.w}"×{geo.h}"</b></div>
            <div><span>Throat</span><b>{geo.throat}"</b></div>
            <div><span>4 Sides</span><b>{scupperSides(geo.w, geo.h)}"</b></div>
            <div><span>Each</span><b>{fmt(disc(perPiece))}</b></div>
            <div><span>{pieces} each</span><b>{fmt(disc(total))}</b></div>
          </>) : (<>
            <div><span>{geo.shape === "square" ? "Tube" : geo.shape === "cone" ? "Base ⌀" : "Pipe ⌀"}</span><b>{geo.shape === "square" ? `${geo.half * 2}"×${geo.half * 2}"` : `${geo.botR * 2}"`}</b></div>
            <div><span>{geo.tilt ? "Miter" : geo.shape === "cone" ? "Top ⌀" : "Height"}</span><b>{geo.tilt ? `${geo.tilt}°` : geo.shape === "cone" ? `${geo.topR * 2}"` : `${geo.height}"`}</b></div>
            <div><span>Each</span><b>{fmt(disc(perPiece))}</b></div>
            <div><span>{pieces} each</span><b>{fmt(disc(total))}</b></div>
          </>)}
        </div>
        <div className="card" style={{ marginTop: 12, fontSize: 14 }}>
          <b>Description:</b> {desc}{!isSheet && t.fits ? ` — ${t.fits(vp)}` : ""}
          <div style={{ color: "var(--mut)", fontSize: 12, marginTop: 6 }}>Estimated customer pricing{discPct > 0 ? ` (your ${discPct}% account discount applied)` : ""} — final pricing is confirmed by Flash-Tech on your quote.</div>
        </div>
        {isSheet && (
          <div className="disclaimer">
            {IC.alert}
            <div><b>Reference only.</b> Not all part geometry can be produced on current sheet-metal folding equipment. The price shown is an estimate for reference — more complex parts may increase the price. Flash-Tech confirms feasibility and final pricing on your quote.</div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

// ─── MY SAVED PARTS ──────────────────────────────────────────
function MyPartsPage({ parts, onAdd, onDel, disc = (x) => x }) {
  const [qty, setQty] = useState({});
  if (!parts.length) return <div className="card" style={{ color: "var(--mut)" }}>No saved custom parts yet — build one in the Custom Flashing Builder and hit Save.</div>;
  return (
    <div className="g2">
      {parts.map((p) => {
        const t = typeById(p.flashing_type);
        const isSheet = (t.kind || "sheet") === "sheet";
        return (
          <div className="card" key={p.id}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <b>{p.name || t.name}</b>
              <button className="btn btn-d btn-sm" onClick={() => onDel(p)}>{IC.trash}</button>
            </div>
            <div style={{ fontSize: 13, color: "var(--mut)", margin: "2px 0 8px" }}>{p.part_number} — {anyMat(p.material_code).name} — {fmt(disc(p.price_per_piece))}{isSheet ? `/pc (${p.piece_length_ft}')` : " ea"}</div>
            <div className="preview3d">
              {isSheet
                ? <Flashing3D points={t.points(p.params)} lengthFt={p.piece_length_ft} materialCode={p.material_code} height={150} showDims={false} />
                : <SinglePly3D geo={t.geometry(p.params)} materialCode={p.material_code} split={!!p.params.split} height={150} />}
            </div>
            <div className="row" style={{ marginTop: 10 }}>
              <input type="number" min="1" placeholder={isSheet ? "# pieces" : "# each"} style={{ width: 100 }} value={qty[p.id] || ""} onChange={(e) => setQty({ ...qty, [p.id]: e.target.value })} />
              <button className="btn btn-lime btn-sm" onClick={() => { const n = parseInt(qty[p.id]); if (n > 0) { onAdd(p, n); setQty({ ...qty, [p.id]: "" }); } }}>{IC.plus}Add to Cart</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── CART / SUBMIT REQUEST ───────────────────────────────────
function CartPage({ cart, onRemove, onClear, onSubmit, busy, user }) {
  const [meta, setMeta] = useState({ req_type: "quote", job_name: "", po_number: "", needed_by: "", notes: "" });
  const subtotal = cart.reduce((s, i) => s + i.line_total, 0);
  const set = (k) => (e) => setMeta({ ...meta, [k]: e.target.value });
  const doPrint = () => printQuote({ kind: meta.req_type, billTo: user, meta, items: cart, subtotal });
  if (!cart.length) return <div className="card" style={{ color: "var(--mut)" }}>Your cart is empty — add parts from the Catalog or the Custom Flashing Builder.</div>;
  return (
    <div className="g2" style={{ gridTemplateColumns: "1.4fr 1fr", alignItems: "start" }}>
      <div className="card">
        <table><thead><tr><th>Part</th><th>Qty</th><th>Price</th><th>Total</th><th></th></tr></thead>
          <tbody>
            {cart.map((i) => (
              <tr key={i.key}>
                <td><b>{i.sku}</b><br /><small>{i.description}</small></td>
                <td style={{ whiteSpace: "nowrap" }}>{i.qty} {i.unit === "lf" ? "LF" : i.unit === "pc" ? "pcs" : "EA"}</td>
                <td>{fmt(i.unit_price)}</td>
                <td>{fmt(i.line_total)}</td>
                <td><button className="btn btn-d btn-sm" onClick={() => onRemove(i.key)}>{IC.trash}</button></td>
              </tr>
            ))}
            <tr><td colSpan="3" style={{ textAlign: "right", fontWeight: 700 }}>Estimated Subtotal</td><td style={{ fontWeight: 800 }}>{fmt(subtotal)}</td><td></td></tr>
          </tbody>
        </table>
        <div className="row" style={{ marginTop: 10 }}>
          <button className="btn btn-o btn-sm" onClick={onClear}>Clear cart</button>
          <button className="btn btn-o btn-sm" onClick={doPrint}>{IC.print}&nbsp;Print Quote</button>
        </div>
      </div>
      <div className="card">
        <div className="fld"><label>Request Type</label>
          <div className="row">
            {["quote", "order"].map((tp) => (
              <button key={tp} className={`btn grow ${meta.req_type === tp ? "btn-p" : "btn-o"}`} style={{ justifyContent: "center" }}
                onClick={() => setMeta({ ...meta, req_type: tp })}>{tp === "quote" ? "Quote Request" : "Order Request"}</button>
            ))}
          </div>
        </div>
        <div className="fld"><label>Job Name</label><input value={meta.job_name} onChange={set("job_name")} placeholder="Smith Residence Re-roof" /></div>
        <div className="g2">
          <div className="fld"><label>PO # (optional)</label><input value={meta.po_number} onChange={set("po_number")} /></div>
          <div className="fld"><label>Needed By</label><input type="date" value={meta.needed_by} onChange={set("needed_by")} /></div>
        </div>
        <div className="fld"><label>Notes</label><textarea rows="3" value={meta.notes} onChange={set("notes")} placeholder="Delivery instructions, colors, etc." /></div>
        <button className="btn btn-p" style={{ width: "100%", justifyContent: "center" }} disabled={busy} onClick={() => onSubmit(meta, subtotal)}>
          {IC.send}&nbsp;{busy ? "Sending..." : `Send ${meta.req_type === "quote" ? "Quote" : "Order"} Request to Flash-Tech`}
        </button>
      </div>
    </div>
  );
}

// ─── REQUEST DETAIL (shared contractor/admin) ────────────────
function RequestDetail({ req, items, msgs, role, contractor, user, onBack, onSend, onStatus, onQuoteTotal }) {
  const [body, setBody] = useState("");
  const [quote, setQuote] = useState(req.admin_quote_total || "");
  const myItems = items.filter((i) => i.request_id === req.id);
  const thread = msgs.filter((m) => m.request_id === req.id);
  const doPrint = () => printQuote({ kind: req.req_type, reqId: req.id, created: req.created_at, status: STATUS_META[req.status]?.label,
    billTo: contractor || user, meta: req, items: myItems, subtotal: req.subtotal, quotedTotal: req.admin_quote_total });
  return (
    <div>
      <div className="row" style={{ marginBottom: 14, justifyContent: "space-between" }}>
        <button className="btn btn-o btn-sm" onClick={onBack}>{IC.back}&nbsp;Back to all requests</button>
        <button className="btn btn-o btn-sm" onClick={doPrint}>{IC.print}&nbsp;Print Quote</button>
      </div>
      <div className="g2" style={{ gridTemplateColumns: "1.5fr 1fr", alignItems: "start" }}>
        <div className="card">
          <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap", marginBottom: 4 }}>
            <b style={{ fontSize: 17 }}>{req.job_name || "Untitled job"}</b>
            <span><TypeBadge t={req.req_type} /> <StatusBadge s={req.status} /></span>
          </div>
          <div style={{ fontSize: 13, color: "var(--mut)", marginBottom: 12 }}>
            #{req.id.slice(0, 8)} · {fmtDateTime(req.created_at)}
            {contractor && <> · <b style={{ color: "var(--ink)" }}>{contractor.company}</b> ({contractor.name}{contractor.phone ? `, ${contractor.phone}` : ""}){contractor.distributor ? <> · Distributor: <b style={{ color: "var(--ink)" }}>{contractor.distributor}</b></> : ""}{contractor.sales_rep ? ` · Rep: ${contractor.sales_rep}` : ""}</>}
            {req.po_number && <> · PO {req.po_number}</>}
            {req.needed_by && <> · Needed by {fmtDate(req.needed_by)}</>}
          </div>
          {req.notes && <div className="note">{req.notes}</div>}
          <table><thead><tr><th>Part</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
            <tbody>
              {myItems.map((i) => (
                <React.Fragment key={i.id}>
                  <tr>
                    <td><b>{i.sku}</b><br /><small>{i.description}</small></td>
                    <td style={{ whiteSpace: "nowrap" }}>{i.qty} {i.unit === "lf" ? "LF" : i.unit === "pc" ? "pcs" : "EA"}</td>
                    <td>{fmt(i.unit_price)}</td><td>{fmt(i.line_total)}</td>
                  </tr>
                  {i.item_kind === "custom" && i.detail?.params && (
                    <tr><td colSpan="4" style={{ background: "#f8fafc" }}>
                      <div className="preview3d" style={{ maxWidth: 420 }}>
                        {(typeById(i.detail.flashing_type).kind || "sheet") === "sheet"
                          ? <Flashing3D points={typeById(i.detail.flashing_type).points(i.detail.params)} lengthFt={i.detail.piece_length_ft} materialCode={i.detail.material_code} height={170} />
                          : <SinglePly3D geo={typeById(i.detail.flashing_type).geometry(i.detail.params)} materialCode={i.detail.material_code} split={!!i.detail.params.split} height={170} />}
                      </div>
                    </td></tr>
                  )}
                </React.Fragment>
              ))}
              <tr>
                <td colSpan="3" style={{ textAlign: "right", fontWeight: 700 }}>Estimated Subtotal</td>
                <td style={{ fontWeight: 800 }}>{fmt(req.subtotal)}</td>
              </tr>
              {req.admin_quote_total != null && (
                <tr><td colSpan="3" style={{ textAlign: "right", fontWeight: 700, color: "var(--grn)" }}>Flash-Tech Quoted Total</td>
                  <td style={{ fontWeight: 800, color: "var(--grn)" }}>{fmt(req.admin_quote_total)}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div>
          {role === "admin" && (
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="g2">
                <div className="fld"><label>Status</label>
                  <select value={req.status} onChange={(e) => onStatus(req, e.target.value)}>
                    {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div className="fld"><label>Quoted Total ($)</label>
                  <div className="row">
                    <input type="number" step="0.01" value={quote} onChange={(e) => setQuote(e.target.value)} />
                    <button className="btn btn-o btn-sm" onClick={() => onQuoteTotal(req, parseFloat(quote))}>Set</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="card">
            <b style={{ display: "block", marginBottom: 10 }}>Messages</b>
            <div className="thread" style={{ maxHeight: 320, overflowY: "auto", marginBottom: 12, background: "var(--bg)", padding: 12, borderRadius: 10 }}>
              {thread.length === 0 && <small style={{ color: "var(--mut)" }}>No messages yet.</small>}
              {thread.map((m) => (
                <div key={m.id} className={`msg ${m.sender_role === role ? "me" : "them"}`}>
                  {m.body}<small>{m.sender_name} · {fmtDateTime(m.created_at)}</small>
                </div>
              ))}
            </div>
            <div className="row">
              <textarea rows="2" className="grow" placeholder={role === "admin" ? "Respond to the customer..." : "Message Flash-Tech..."} value={body} onChange={(e) => setBody(e.target.value)} />
              <button className="btn btn-p" onClick={() => { if (body.trim()) { onSend(req, body.trim()); setBody(""); } }}>{IC.send}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── REQUEST LIST (shared) ───────────────────────────────────
function RequestList({ requests, msgs, role, contractorsById, onOpen }) {
  const [fStatus, setFStatus] = useState("all");
  const [fType, setFType] = useState("all");
  const list = requests.filter((r) => (fStatus === "all" || r.status === fStatus) && (fType === "all" || r.req_type === fType));
  return (
    <div className="card">
      <div className="row" style={{ marginBottom: 12, flexWrap: "wrap" }}>
        <select style={{ width: 160 }} value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select style={{ width: 140 }} value={fType} onChange={(e) => setFType(e.target.value)}>
          <option value="all">All types</option><option value="quote">Quotes</option><option value="order">Orders</option>
        </select>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table><thead><tr>
          <th>Req #</th>{role === "admin" && <th>Customer</th>}<th>Job</th><th>Type</th><th>Status</th><th>Est. Total</th><th>Submitted</th>{role === "admin" && <th></th>}
        </tr></thead>
          <tbody>
            {list.map((r) => {
              const late = role === "admin" && needsResponse(r, msgs) && hoursSince(waitingSince(r, msgs)) >= REMIND_HOURS;
              return (
                <tr key={r.id} className="click" onClick={() => onOpen(r)}>
                  <td style={{ fontWeight: 700 }}>#{r.id.slice(0, 8)}</td>
                  {role === "admin" && <td>{contractorsById[r.contractor_id]?.company || "—"}</td>}
                  <td>{r.job_name || "—"}</td>
                  <td><TypeBadge t={r.req_type} /></td>
                  <td><StatusBadge s={r.status} /></td>
                  <td>{fmt(r.admin_quote_total ?? r.subtotal)}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{fmtDate(r.created_at)}</td>
                  {role === "admin" && <td>{late && <span className="b b-late">Waiting {Math.floor(hoursSince(waitingSince(r, msgs)) / 24)}d+</span>}</td>}
                </tr>
              );
            })}
            {list.length === 0 && <tr><td colSpan="8" style={{ color: "var(--mut)" }}>No requests yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────
function AdminDashboard({ requests, msgs, contractorsById, onOpen }) {
  const open = requests.filter((r) => r.status !== "closed");
  const pending = requests.filter((r) => needsResponse(r, msgs));
  const overdue = pending.filter((r) => hoursSince(waitingSince(r, msgs)) >= REMIND_HOURS);
  return (
    <div>
      {overdue.length > 0 && (
        <div className="banner">
          {IC.alert}
          <div><b>{overdue.length} request{overdue.length > 1 ? "s have" : " has"} gone unanswered for over {REMIND_HOURS} hours.</b><br />
            Customers are waiting — open them below and send a response.</div>
        </div>
      )}
      <div className="stats">
        <div className="stat"><div className="v">{requests.filter((r) => r.status === "new").length}</div><div className="l">New Requests</div></div>
        <div className="stat"><div className="v">{pending.length}</div><div className="l">Awaiting Response</div></div>
        <div className={`stat ${overdue.length ? "warn" : ""}`}><div className="v">{overdue.length}</div><div className="l">Overdue ({REMIND_HOURS}h+)</div></div>
        <div className="stat"><div className="v">{open.length}</div><div className="l">Open Requests</div></div>
      </div>
      <div className="card">
        <b style={{ display: "block", marginBottom: 10 }}>Needs a response</b>
        {pending.length === 0 && <small style={{ color: "var(--mut)" }}>Nothing waiting — nice work.</small>}
        <table><tbody>
          {pending.map((r) => {
            const w = waitingSince(r, msgs);
            const late = hoursSince(w) >= REMIND_HOURS;
            return (
              <tr key={r.id} className="click" onClick={() => onOpen(r)}>
                <td style={{ fontWeight: 700 }}>#{r.id.slice(0, 8)}</td>
                <td>{contractorsById[r.contractor_id]?.company || "—"}</td>
                <td>{r.job_name || "—"}</td>
                <td><TypeBadge t={r.req_type} /></td>
                <td style={{ whiteSpace: "nowrap" }}>{late ? <span className="b b-late">waiting {ageLabel(w)}</span> : <small style={{ color: "var(--mut)" }}>waiting {ageLabel(w)}</small>}</td>
              </tr>
            );
          })}
        </tbody></table>
      </div>
    </div>
  );
}

function AdminCustomers({ contractors, requests, onSave, onDelete }) {
  const [edit, setEdit] = useState(null);
  return (
    <div className="card">
      <table><thead><tr><th>Company</th><th>Contact</th><th>Login</th><th>Phone</th><th>Distributor</th><th>Sales Rep</th><th>Disc %</th><th>Requests</th><th></th></tr></thead>
        <tbody>
          {contractors.map((c) => (
            <tr key={c.id}>
              <td style={{ fontWeight: 700 }}>{c.company || "—"}</td><td>{c.name}</td><td>{c.email}</td><td>{c.phone || "—"}</td>
              <td>{c.distributor || "—"}</td><td>{c.sales_rep || "—"}</td>
              <td>{Number(c.discount_pct) > 0 ? <b style={{ color: "var(--grn-d)" }}>{c.discount_pct}%</b> : "—"}</td>
              <td>{requests.filter((r) => r.contractor_id === c.id).length}</td>
              <td style={{ whiteSpace: "nowrap" }}><button className="btn btn-o btn-sm" onClick={() => setEdit(c)}>Edit / Reset</button></td>
            </tr>
          ))}
          {contractors.length === 0 && <tr><td colSpan="9" style={{ color: "var(--mut)" }}>No contractor accounts yet.</td></tr>}
        </tbody>
      </table>
      {edit && <ContractorForm contractor={edit} onClose={() => setEdit(null)} onSave={onSave} onDelete={onDelete} />}
    </div>
  );
}

function ContractorForm({ contractor, onClose, onSave, onDelete }) {
  const [f, setF] = useState({ name: contractor.name || "", company: contractor.company || "", email: contractor.email || "", phone: contractor.phone || "", distributor: contractor.distributor || "", sales_rep: contractor.sales_rep || "", discount_pct: contractor.discount_pct || 0 });
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const save = async () => {
    if (!f.name.trim() || !f.email.trim()) { alert("Name and login/email are required."); return; }
    if (pw && pw.length < 4) { alert("New password must be at least 4 characters."); return; }
    const dpct = Math.max(0, Math.min(100, Number(f.discount_pct) || 0));
    setBusy(true);
    const ok = await onSave(contractor.id, { name: f.name, company: f.company, email: f.email.trim().toLowerCase(), phone: f.phone, distributor: f.distributor, sales_rep: f.sales_rep, discount_pct: dpct }, pw || null);
    setBusy(false);
    if (ok) onClose();
  };
  return (
    <Modal title={`Edit ${contractor.company || contractor.name}`} onClose={onClose}
      footer={<>
        <button className="btn btn-d" onClick={() => { if (confirm(`Delete ${contractor.name}'s account? This cannot be undone.`)) { onDelete(contractor.id); onClose(); } }}>{IC.trash}&nbsp;Delete</button>
        <button className="btn btn-o" onClick={onClose}>Cancel</button>
        <button className="btn btn-p" disabled={busy} onClick={save}>{busy ? "Saving..." : "Save Changes"}</button>
      </>}>
      <div className="g2">
        <div className="fld"><label>Contact Name</label><input value={f.name} onChange={set("name")} /></div>
        <div className="fld"><label>Company</label><input value={f.company} onChange={set("company")} /></div>
      </div>
      <div className="g2">
        <div className="fld"><label>Login / Email</label><input value={f.email} onChange={set("email")} /></div>
        <div className="fld"><label>Phone</label><input value={f.phone} onChange={set("phone")} /></div>
      </div>
      <div className="g2">
        <div className="fld"><label>Distributor</label><input value={f.distributor} onChange={set("distributor")} /></div>
        <div className="fld"><label>Sales Rep</label><input value={f.sales_rep} onChange={set("sales_rep")} /></div>
      </div>
      <div className="fld" style={{ marginTop: 6, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
        <label>Account Discount (%)</label>
        <input type="number" min="0" max="100" step="1" value={f.discount_pct} onChange={set("discount_pct")} placeholder="0" />
        <div style={{ fontSize: 12, color: "var(--mut)", marginTop: 4 }}>This % comes off every price this contractor sees — catalog, builder, and their requests. Set by purchase level.</div>
      </div>
      <div className="fld">
        <label>Reset Password</label>
        <input value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Type a new password to reset it (leave blank to keep current)" />
        <div style={{ fontSize: 12, color: "var(--mut)", marginTop: 4 }}>Set a temporary password here and share it with the customer if they're locked out.</div>
      </div>
    </Modal>
  );
}

// ─── PASSWORD RESET (from emailed ?reset=token link) ─────────
function ResetPassword({ token, onDone }) {
  const [stage, setStage] = useState("checking"); // checking | ready | invalid | done
  const [user, setUser] = useState(null);
  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => {
    (async () => {
      if (!hasSupabase) return setStage("invalid");
      try {
        const { data } = await supabase.from("portal_users").select("id,email,reset_expires").eq("reset_token", token).maybeSingle();
        if (!data || !data.reset_expires || new Date(data.reset_expires) < new Date()) return setStage("invalid");
        setUser(data); setStage("ready");
      } catch { setStage("invalid"); }
    })();
  }, [token]);
  const submit = async (e) => {
    e.preventDefault(); setErr("");
    if (pw.length < 4) return setErr("Password must be at least 4 characters.");
    if (pw !== pw2) return setErr("Passwords don't match.");
    setBusy(true);
    const hash = await sha256(pw);
    const { error } = await supabase.from("portal_users").update({ password_hash: hash, reset_token: null, reset_expires: null }).eq("id", user.id);
    setBusy(false);
    if (error) return setErr(error.message);
    setStage("done");
  };
  return (
    <div className="login"><div className="lbox">
      <h1>Reset <span>Password</span></h1>
      {stage === "checking" && <p style={{ color: "var(--mut)", marginTop: 12 }}>Checking your reset link…</p>}
      {stage === "invalid" && <><div className="err" style={{ marginTop: 14 }}>This reset link is invalid or has expired. Request a new one from the sign-in screen.</div><button className="btn btn-p" style={{ width: "100%", justifyContent: "center", marginTop: 10 }} onClick={onDone}>Back to Sign In</button></>}
      {stage === "ready" && <form onSubmit={submit}>
        <div style={{ color: "var(--mut)", fontSize: 14, margin: "6px 0 14px" }}>Set a new password for <b>{user.email}</b>.</div>
        {err && <div className="err">{err}</div>}
        <div className="fld"><label>New Password</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
        <div className="fld"><label>Confirm Password</label><input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} /></div>
        <button className="btn btn-p" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>{busy ? "Saving…" : "Set New Password"}</button>
      </form>}
      {stage === "done" && <><div className="note" style={{ marginTop: 14 }}>Your password has been reset. You can sign in now.</div><button className="btn btn-p" style={{ width: "100%", justifyContent: "center", marginTop: 10 }} onClick={onDone}>Go to Sign In</button></>}
    </div></div>
  );
}

// ─── APP ─────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState(() => { try { return JSON.parse(localStorage.getItem("ftp_session")) || null; } catch { return null; } });
  const [guest, setGuest] = useState(false);
  const [resetToken, setResetToken] = useState(() => { try { return new URLSearchParams(window.location.search).get("reset"); } catch { return null; } });
  const [page, setPage] = useState(() => { try { const s = JSON.parse(localStorage.getItem("ftp_session")); return s ? (s.role === "admin" ? "dashboard" : "shop") : "home"; } catch { return "home"; } });
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [parts, setParts] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [cart, setCart] = useState([]);
  const [selReq, setSelReq] = useState(null);
  const [busy, setBusy] = useState(false);
  const [dbError, setDbError] = useState(false);
  const [toast, setToast] = useState("");
  // camera / AI photo identify
  const cameraRef = useRef(null);
  const [camBusy, setCamBusy] = useState(false);
  const [camResult, setCamResult] = useState(null); // {typeId,label,confidence,note}
  const [camNonce, setCamNonce] = useState(0);
  const [catSeed, setCatSeed] = useState({ cat: null, nonce: 0 }); // Home tile -> catalog category
  const [bSeed, setBSeed] = useState({ type: null, nonce: 0 });    // Home tile -> builder type
  const openCategory = (c) => { setCatSeed((s) => ({ cat: c, nonce: s.nonce + 1 })); setSelReq(null); setPage("catalog"); };
  const openBuilder = (type) => { setBSeed((s) => ({ type, nonce: s.nonce + 1 })); setSelReq(null); setPage("builder"); };

  const role = session?.role || "contractor";
  const isAdmin = role === "admin";
  const contractorsById = useMemo(() => Object.fromEntries(contractors.map((c) => [c.id, c])), [contractors]);
  // Per-contractor discount: list prices are stored everywhere; this applies their % when shown/added.
  const discPct = (!isAdmin && Number(session?.discount_pct)) || 0;
  const applyDisc = (p) => Math.round(p * (1 - discPct / 100) * 100) / 100;

  const loadAll = useCallback(async (sess) => {
    if (!hasSupabase || !sess) return;
    try {
      const { data: prods, error: pe } = await supabase.from("portal_products").select("*").eq("active", true).order("category").order("sku");
      if (pe) throw pe;
      if (prods?.length) setProducts(prods);
      let reqQ = supabase.from("portal_requests").select("*").order("created_at", { ascending: false });
      if (sess.role !== "admin") reqQ = reqQ.eq("contractor_id", sess.id);
      const { data: reqs, error: re } = await reqQ;
      if (re) throw re;
      setRequests(reqs || []);
      const ids = (reqs || []).map((r) => r.id);
      if (ids.length) {
        const [{ data: its }, { data: mss }] = await Promise.all([
          supabase.from("portal_request_items").select("*").in("request_id", ids),
          supabase.from("portal_messages").select("*").in("request_id", ids).order("created_at"),
        ]);
        setItems(its || []); setMsgs(mss || []);
      } else { setItems([]); setMsgs([]); }
      if (sess.role === "admin") {
        const { data: cons } = await supabase.from("portal_users").select("*").eq("role", "contractor").order("company");
        setContractors(cons || []);
      } else {
        const { data: ps } = await supabase.from("portal_custom_flashings").select("*").eq("contractor_id", sess.id).order("created_at", { ascending: false });
        setParts(ps || []);
      }
      setDbError(false);
    } catch (e) {
      console.error(e);
      if (String(e.message || "").includes("does not exist")) setDbError(true);
    }
  }, []);

  useEffect(() => { if (session) loadAll(session); }, [session, loadAll]);
  // Auto-refresh so the admin sees new requests / replies come in
  useEffect(() => {
    if (!session) return;
    const iv = setInterval(() => loadAll(session), 60000);
    return () => clearInterval(iv);
  }, [session, loadAll]);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(""), 3500); };

  // ── camera: snap a photo, downscale, send to AI for type identification ──
  const fileToBase64 = (file, maxDim = 1024) => new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.8).split(",")[1]);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Couldn't read that image.")); };
    img.src = url;
  });
  const onCameraFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setCamBusy(true);
    try {
      const imageBase64 = await fileToBase64(file);
      const r = await fetch("/api/identify-flashing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageBase64, mediaType: "image/jpeg" }) });
      const data = await r.json();
      if (data.skipped) { setPage("builder"); flash("AI photo identify isn't set up yet — pick the type manually."); }
      else if (data.ok && data.typeId) { setCamResult(data); setCamNonce((n) => n + 1); setPage("builder"); }
      else throw new Error(typeof data.error === "string" ? data.error : "Couldn't identify the photo");
    } catch (ex) {
      setPage("builder");
      flash("Couldn't identify the photo — pick the type manually. (" + ex.message + ")");
    }
    setCamBusy(false);
  };

  const login = (u) => { localStorage.setItem("ftp_session", JSON.stringify(u)); setSession(u); setGuest(false); setPage(u.role === "admin" ? "dashboard" : "shop"); };
  const logout = () => { localStorage.removeItem("ftp_session"); setSession(null); setCart([]); setSelReq(null); setPage("home"); };

  // ── cart ops ──
  const addProduct = (p, qty) => {
    const up = applyDisc(p.price);
    setCart((c) => [...c, { key: uid(), kind: "product", sku: p.sku, description: p.description, unit: p.unit, qty, unit_price: up, line_total: Math.round(up * qty * 100) / 100 }]);
    flash(`Added ${qty} ${p.unit === "lf" ? "LF" : "x"} ${p.sku}`);
  };
  const addCustom = (cf, pieces) => {
    const isSheet = (typeById(cf.flashing_type).kind || "sheet") === "sheet";
    const description = cf.description || (isSheet
      ? customDescription(cf.flashing_type, cf.material_code, cf.params, cf.piece_length_ft, cf.girth)
      : membraneDescription(cf.flashing_type, cf.material_code, cf.params, !!cf.params.split));
    const up = applyDisc(cf.price_per_piece);
    setCart((c) => [...c, {
      key: uid(), kind: "custom", sku: cf.part_number, description,
      unit: isSheet ? "pc" : "ea", qty: pieces, unit_price: up, line_total: Math.round(up * pieces * 100) / 100,
      detail: { flashing_type: cf.flashing_type, material_code: cf.material_code, params: cf.params, girth: cf.girth, piece_length_ft: cf.piece_length_ft },
    }]);
    flash(`Added ${pieces} ${isSheet ? "pcs" : "ea"} ${cf.part_number}`);
  };
  const savePart = async (cf) => {
    if (!hasSupabase) return;
    const row = { contractor_id: session.id, part_number: cf.part_number, name: cf.name, flashing_type: cf.flashing_type, material_code: cf.material_code, params: cf.params, girth: cf.girth, bends: cf.bends, piece_length_ft: cf.piece_length_ft, price_per_piece: cf.price_per_piece };
    const { data, error } = await supabase.from("portal_custom_flashings").insert(row).select().single();
    if (!error && data) setParts((p) => [data, ...p]);
  };
  const delPart = async (p) => {
    await supabase.from("portal_custom_flashings").delete().eq("id", p.id);
    setParts((ps) => ps.filter((x) => x.id !== p.id));
  };

  // ── submit request ──
  const submitRequest = async (meta, subtotal) => {
    setBusy(true);
    try {
      const row = { contractor_id: session.id, req_type: meta.req_type, status: "new", job_name: meta.job_name || null, po_number: meta.po_number || null, needed_by: meta.needed_by || null, notes: meta.notes || null, subtotal };
      const { data: req, error } = await supabase.from("portal_requests").insert(row).select().single();
      if (error) throw error;
      const lines = cart.map((i) => ({ request_id: req.id, item_kind: i.kind, sku: i.sku, description: i.description, unit: i.unit, qty: i.qty, unit_price: i.unit_price, line_total: i.line_total, detail: i.detail || null }));
      const { error: e2 } = await supabase.from("portal_request_items").insert(lines);
      if (e2) throw e2;
      const emailItems = [...cart];
      setCart([]);
      await loadAll(session);
      setPage("requests"); setSelReq(req.id);
      flash(`${meta.req_type === "quote" ? "Quote" : "Order"} request sent to Flash-Tech!`);
      // ── email notifications ──
      const lbl = meta.req_type === "quote" ? "Quote" : "Order";
      const who = `${session.company || session.name}${session.name && session.company ? ` (${session.name})` : ""}`;
      sendMail(NOTIFY_EMAIL, `New ${lbl} request — ${session.company || session.name}`,
        emailShell(`New ${lbl} Request`, `<p><b>${who}</b> submitted a ${meta.req_type} request${meta.job_name ? ` for <b>${meta.job_name}</b>` : ""}.</p>${session.distributor ? `<p>Distributor: <b>${session.distributor}</b>${session.sales_rep ? ` · Rep: ${session.sales_rep}` : ""}</p>` : ""}${mailItems(emailItems)}<p>Estimated subtotal: <b>${fmt(subtotal)}</b></p>${mailBtn("Open in Portal", PORTAL_URL)}`),
        session.email);
      sendMail(session.email, `We received your ${meta.req_type} request`,
        emailShell(`Thanks, ${session.name}!`, `<p>We've received your ${meta.req_type} request${meta.job_name ? ` for <b>${meta.job_name}</b>` : ""}. Our team will review it and get back to you shortly.</p>${mailItems(emailItems)}<p>Estimated subtotal: <b>${fmt(subtotal)}</b> — final pricing is confirmed by Flash-Tech.</p>${mailBtn("View Your Requests", PORTAL_URL)}`),
        NOTIFY_EMAIL);
    } catch (e) { alert("Could not submit request: " + e.message); }
    setBusy(false);
  };

  // ── messaging & admin ops ──
  const sendMsg = async (req, body) => {
    const row = { request_id: req.id, sender_role: role, sender_name: isAdmin ? "Flash-Tech" : session.name, body };
    const { data, error } = await supabase.from("portal_messages").insert(row).select().single();
    if (!error && data) {
      setMsgs((m) => [...m, data]);
      if (isAdmin && (req.status === "new" || req.status === "in_review")) setStatus(req, "responded");
      const c = contractorsById[req.contractor_id];
      if (isAdmin && c?.email) {
        sendMail(c.email, `Flash-Tech replied to your ${req.req_type} request`,
          emailShell("You have a new message", `<p>Flash-Tech responded on your request${req.job_name ? ` for <b>${req.job_name}</b>` : ""}:</p><blockquote style="border-left:3px solid #0DD714;margin:10px 0;padding:6px 14px;color:#333">${body}</blockquote>${mailBtn("View & Reply", PORTAL_URL)}`),
          NOTIFY_EMAIL);
      } else if (!isAdmin) {
        sendMail(NOTIFY_EMAIL, `New message on ${req.req_type} request — ${session.company || session.name}`,
          emailShell("New customer message", `<p><b>${session.company || session.name}</b> messaged on request${req.job_name ? ` <b>${req.job_name}</b>` : ` #${req.id.slice(0, 8)}`}:</p><blockquote style="border-left:3px solid #0DD714;margin:10px 0;padding:6px 14px;color:#333">${body}</blockquote>${mailBtn("Open in Portal", PORTAL_URL)}`),
          session.email);
      }
    }
  };
  const setStatus = async (req, status) => {
    await supabase.from("portal_requests").update({ status, updated_at: new Date().toISOString() }).eq("id", req.id);
    setRequests((rs) => rs.map((r) => (r.id === req.id ? { ...r, status } : r)));
  };
  const setQuoteTotal = async (req, total) => {
    if (!(total >= 0)) return;
    await supabase.from("portal_requests").update({ admin_quote_total: total, updated_at: new Date().toISOString() }).eq("id", req.id);
    setRequests((rs) => rs.map((r) => (r.id === req.id ? { ...r, admin_quote_total: total } : r)));
    flash("Quoted total saved.");
    const c = contractorsById[req.contractor_id];
    if (c?.email) sendMail(c.email, `Flash-Tech sent you a quote — ${fmt(total)}`,
      emailShell("Your quote is ready", `<p>Flash-Tech has quoted your request${req.job_name ? ` for <b>${req.job_name}</b>` : ""}:</p><p style="font-size:24px;color:#0aa810;font-weight:bold">${fmt(total)}</p>${mailBtn("View Quote", PORTAL_URL)}`),
      NOTIFY_EMAIL);
  };

  // ── admin: manage contractor accounts ──
  const saveContractor = async (id, fields, newPassword) => {
    const patch = { ...fields };
    if (newPassword) patch.password_hash = await sha256(newPassword);
    const { error } = await supabase.from("portal_users").update(patch).eq("id", id);
    if (error) { alert(error.code === "23505" ? "That login/email is already taken." : "Could not save: " + error.message); return false; }
    await loadAll(session);
    flash(newPassword ? "Customer updated & password reset." : "Customer updated.");
    return true;
  };
  const deleteContractor = async (id) => {
    const { error } = await supabase.from("portal_users").delete().eq("id", id);
    if (error) { alert("Could not delete: " + error.message); return; }
    setContractors((cs) => cs.filter((c) => c.id !== id));
    flash("Customer account deleted.");
  };

  // ── notifications ──
  const seenKey = session ? `ftp_seen_${session.id}` : "";
  const getSeen = () => { try { return JSON.parse(localStorage.getItem(seenKey)) || {}; } catch { return {}; } };
  const markSeen = (reqId) => { const s = getSeen(); s[reqId] = new Date().toISOString(); localStorage.setItem(seenKey, JSON.stringify(s)); };
  const notifs = useMemo(() => {
    if (!session) return [];
    if (isAdmin) {
      return requests.filter((r) => needsResponse(r, msgs)).map((r) => {
        const w = waitingSince(r, msgs);
        return {
          key: r.id, go: r, urgent: hoursSince(w) >= REMIND_HOURS,
          text: `${contractorsById[r.contractor_id]?.company || "A contractor"} — ${r.req_type} request ${r.job_name ? `"${r.job_name}"` : `#${r.id.slice(0, 8)}`}`,
          sub: `waiting ${ageLabel(w)}`,
        };
      });
    }
    const seen = getSeen();
    return requests.filter((r) => {
      const thread = msgs.filter((m) => m.request_id === r.id && m.sender_role === "admin");
      if (!thread.length) return false;
      const last = thread[thread.length - 1].created_at;
      return !seen[r.id] || new Date(last) > new Date(seen[r.id]);
    }).map((r) => ({ key: r.id, go: r, text: `Flash-Tech replied on ${r.job_name ? `"${r.job_name}"` : `#${r.id.slice(0, 8)}`}`, sub: ageLabel(msgs.filter((m) => m.request_id === r.id).slice(-1)[0]?.created_at) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests, msgs, session, isAdmin, contractorsById]);

  const openRequest = (r) => { setSelReq(r.id); setPage("requests"); if (!isAdmin) markSeen(r.id); };

  // ─── render ───
  if (resetToken && !session) {
    return (<><style>{CSS}</style><ResetPassword token={resetToken} onDone={() => { try { window.history.replaceState({}, "", window.location.pathname); } catch (e) {} setResetToken(null); }} /></>);
  }
  if (!session && guest) {
    return (
      <>
        <style>{CSS}</style>
        <div className="main" style={{ margin: "0 auto", maxWidth: 1100 }}>
          <div className="topbar">
            <div><h1>Custom Flashing Builder</h1><div className="sub">Guest preview — Flash-Tech Mfg, Inc.</div></div>
            <button className="btn btn-p" onClick={() => setGuest(false)}>Sign In / Create Account</button>
          </div>
          <BuilderPage guest onAddToCart={() => {}} onSavePart={() => {}} />
        </div>
      </>
    );
  }
  if (!session) return (<><style>{CSS}</style><LoginScreen onLogin={login} onGuest={() => setGuest(true)} dbError={dbError} /></>);

  const nav = isAdmin
    ? [["dashboard", "Dashboard", IC.home], ["requests", "Requests", IC.list], ["customers", "Customers", IC.users], ["catalog", "Catalog", IC.box]]
    : [["shop", "Home", IC.home], ["catalog", "Parts Catalog", IC.box], ["builder", "Custom Flashing", IC.wrench], ["cart", "Cart / Send Request", IC.cart], ["requests", "My Requests", IC.list], ["parts", "My Saved Parts", IC.bookmark]];

  const titles = {
    shop: ["Welcome to Flash-Tech", "Pick a category — or jump straight into a custom builder"],
    dashboard: ["Dashboard", "Incoming quote & order requests at a glance"],
    requests: [isAdmin ? "Quote & Order Requests" : "My Requests", isAdmin ? "Click a request to review and respond" : "Track your quotes and orders"],
    customers: ["Customers", "Contractor accounts on the portal"],
    catalog: [isAdmin ? "Parts Catalog" : "Parts Catalog", isAdmin ? "Full price list — search and filter by category" : "Drip edge, coping & accessories — add by linear foot or each"],
    builder: ["Custom Flashing Builder", "Dimensions in, 3D model + price out"],
    cart: ["Cart / Send Request", "Review your items and send a quote or order request"],
    parts: ["My Saved Parts", "Your saved custom flashings"],
  };
  const curReq = requests.find((r) => r.id === selReq);

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <aside className="side">
          <div className="logo"><b>FLASH-<span>TECH</span></b><small>Contractor Portal</small></div>
          <nav>
            {nav.map(([id, label, icon]) => (
              <button key={id} className={page === id ? "on" : ""} onClick={() => { setPage(id); setSelReq(null); }}>
                {icon}<span>{label}</span>
                {id === "cart" && cart.length > 0 && <span className="n">{cart.length}</span>}
                {id === "dashboard" && notifs.filter((n) => n.urgent).length > 0 && <span className="n">{notifs.filter((n) => n.urgent).length}</span>}
              </button>
            ))}
          </nav>
          {!isAdmin && (
            <div style={{ padding: "0 8px 8px" }}>
              <button className="btn btn-lime" style={{ width: "100%", justifyContent: "center" }} disabled={camBusy} onClick={() => cameraRef.current?.click()}>
                {IC.camera}&nbsp;{camBusy ? "Identifying…" : "Snap to Identify"}
              </button>
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={onCameraFile} />
            </div>
          )}
          <div className="who"><b>{session.name}</b><small>{session.company || (isAdmin ? "Flash-Tech Mfg, Inc." : "")}</small>
            <button className="btn btn-o btn-sm" style={{ marginTop: 8, width: "100%", justifyContent: "center" }} onClick={logout}>{IC.out}&nbsp;Sign out</button>
          </div>
        </aside>
        <main className="main">
          <div className="topbar">
            <div><h1>{titles[page]?.[0] || ""}</h1><div className="sub">{titles[page]?.[1] || ""}</div></div>
            <Bell items={notifs} onPick={(n) => openRequest(n.go)} />
          </div>
          {toast && <div className="note">{toast}</div>}
          {dbError && <div className="banner">{IC.alert}<div><b>Database tables not found.</b> Run database-setup.sql in your Supabase SQL editor, then reload.</div></div>}

          {page === "dashboard" && isAdmin && <AdminDashboard requests={requests} msgs={msgs} contractorsById={contractorsById} onOpen={openRequest} />}
          {page === "customers" && isAdmin && <AdminCustomers contractors={contractors} requests={requests} onSave={saveContractor} onDelete={deleteContractor} />}
          {page === "shop" && !isAdmin && <ShopPage products={products} discPct={discPct} onPickCategory={openCategory} onBuilder={openBuilder} />}
          {page === "catalog" && isAdmin && <CatalogPage products={products} readOnly />}
          {page === "catalog" && !isAdmin && <CatalogPage products={products} onAdd={addProduct} disc={applyDisc} discPct={discPct} seedCat={catSeed.cat} seedNonce={catSeed.nonce} />}
          {page === "builder" && !isAdmin && <BuilderPage guest={false} onAddToCart={addCustom} onSavePart={savePart} disc={applyDisc} discPct={discPct} detectInfo={camResult} detectNonce={camNonce} seedType={bSeed.type} seedNonce={bSeed.nonce} />}
          {page === "cart" && !isAdmin && <CartPage cart={cart} onRemove={(k) => setCart((c) => c.filter((i) => i.key !== k))} onClear={() => setCart([])} onSubmit={submitRequest} busy={busy} user={session} />}
          {page === "parts" && !isAdmin && <MyPartsPage parts={parts} onAdd={addCustom} onDel={delPart} disc={applyDisc} discPct={discPct} />}
          {page === "requests" && (curReq ? (
            <RequestDetail req={curReq} items={items} msgs={msgs} role={role}
              contractor={isAdmin ? contractorsById[curReq.contractor_id] : null} user={session}
              onBack={() => setSelReq(null)} onSend={sendMsg} onStatus={setStatus} onQuoteTotal={setQuoteTotal} />
          ) : (
            <RequestList requests={requests} msgs={msgs} role={role} contractorsById={contractorsById} onOpen={openRequest} />
          ))}
        </main>
      </div>
    </>
  );
}
