// Client wrapper for the secure server API (/api/portal).
//
// This replaces direct Supabase access: the browser never holds a database key
// and never talks to the database. Every call carries the signed session token,
// which the server verifies before deciding what this login may see or change.

const TOKEN_KEY = "ftp_token";

const PROD = "https://flashtech-contractor-portal.vercel.app";
const isLocalhost = typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);

// Where the data API lives:
//
//   • .env.local has SUPABASE_SERVICE_ROLE + SESSION_SECRET → vite serves api/
//     locally (see vite.config.js) and we call that. Dev is isolated, pointed at
//     whichever database those credentials name.
//
//   • Otherwise there is no local server to call, so we fall back to the deployed
//     function — which means LOCAL DEV IS READING AND WRITING PRODUCTION DATA.
//     USING_PRODUCTION_DATA drives the warning banner in App.jsx. Set up a
//     staging Supabase project (see README) to get out of this mode.
const hasLocalApi = typeof __LOCAL_API__ !== "undefined" && __LOCAL_API__;

export const USING_PRODUCTION_DATA = isLocalhost && !hasLocalApi;
const BASE = USING_PRODUCTION_DATA ? PROD : "";

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
