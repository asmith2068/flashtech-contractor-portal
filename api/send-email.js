// Vercel serverless function — sends email via Resend.
// The API key stays server-side (set RESEND_API_KEY in Vercel env vars).
// Optional: EMAIL_FROM (e.g. "Flash-Tech <sales@flash-techinc.com>" once the
// domain is verified; defaults to Resend's onboarding sender for testing).
//
// A valid portal session token is required, so this can't be used by outsiders
// as an open relay to send mail from the Flash-Tech address.
import crypto from "crypto";

const SECRET = process.env.SESSION_SECRET || "";
function verifyToken(token) {
  if (!token || !SECRET) return null;
  const [body, sig] = String(token).split(".");
  if (!body || !sig) return null;
  const expect = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  const a = Buffer.from(sig), b = Buffer.from(expect);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString());
    return !p.exp || Date.now() > p.exp ? null : p;
  } catch { return null; }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const key = process.env.RESEND_API_KEY;
  // If no key configured yet, no-op so the app keeps working (email just doesn't send).
  if (!key) return res.status(200).json({ skipped: true, reason: "RESEND_API_KEY not set" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { to, subject, html, replyTo } = body;
    if (!verifyToken(body.token)) return res.status(401).json({ error: "Sign in required." });
    if (!to || !subject || !html) return res.status(400).json({ error: "Missing to/subject/html" });

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Flash-Tech Portal <onboarding@resend.dev>",
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(502).json({ error: data });
    return res.status(200).json({ ok: true, id: data.id });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
