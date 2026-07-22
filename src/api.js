// Client wrapper for the secure server API (/api/portal).
//
// This replaces direct Supabase access: the browser never holds a database key
// and never talks to the database. Every call carries the signed session token,
// which the server verifies before deciding what this login may see or change.

const TOKEN_KEY = "ftp_token";

// `vite dev` has no /api routes, so local development talks to the deployed
// serverless function (and therefore the live database — same as before).
const BASE = (typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname))
  ? "https://flashtech-contractor-portal.vercel.app"
  : "";

export function getToken() { try { return localStorage.getItem(TOKEN_KEY) || null; } catch { return null; } }
export function setToken(t) { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ } }

export async function api(action, payload = {}) {
  let r;
  try {
    r = await fetch(`${BASE}/api/portal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, token: getToken(), ...payload }),
    });
  } catch {
    throw new Error("Can't reach the server. Check your connection and try again.");
  }
  const data = await r.json().catch(() => ({}));
  if (!r.ok || data.error) {
    const e = new Error(data.error || `Request failed (${r.status})`);
    e.status = r.status;
    throw e;
  }
  return data;
}
