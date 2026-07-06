import { createClient } from "@supabase/supabase-js";

// Points at the Flash-Tech portal database.
// 2026-07-06: cut over to a NEW Supabase project after the original went down in a
// Supabase platform capacity incident. These are the PUBLIC project URL + publishable
// key (they ship in the client bundle anyway, so they're safe here). Hardcoded so the
// app uses the new database regardless of any older Vercel env vars.
const url = "https://iriayxfpzqettovzqple.supabase.co";
const key = "sb_publishable_dQzBTXsczSC1TOZckpd5YA_h-OjRNNu";

export const hasSupabase = Boolean(url && key);
export const supabase = hasSupabase ? createClient(url, key) : null;
