// Vercel serverless function — identifies a roofing flashing from a photo using
// Claude's vision API. The API key stays server-side (set ANTHROPIC_API_KEY in
// Vercel env vars). Safely no-ops if the key isn't configured.
import Anthropic from "@anthropic-ai/sdk";
import crypto from "crypto";

// Signed-in users only — otherwise anyone could burn the Anthropic key.
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

// Builder type IDs the photo can map to (must match FLASHING_TYPES in src/catalog.js).
const TYPES = [
  { id: "conicalBoot", label: "Conical Pipe Boot" },
  { id: "cylBoot", label: "Cylindrical Pipe Boot" },
  { id: "squareWrap", label: "Square Wrap" },
  { id: "miterCyl", label: "Mitered Cylindrical Wrap" },
  { id: "miterSquare", label: "Mitered Square Wrap" },
  { id: "scupper", label: "Scupper Drain" },
  { id: "dripEdge", label: "Drip Edge" },
  { id: "coping", label: "Coping Cap" },
  { id: "gravelStop", label: "Gravel Stop / Fascia" },
  { id: "lFlashing", label: "L / Counter Flashing" },
  { id: "zFlashing", label: "Z Flashing / Z-Bar" },
  { id: "valley", label: "Valley Metal" },
];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(200).json({ skipped: true, reason: "ANTHROPIC_API_KEY not set" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { imageBase64, mediaType } = body;
    if (!verifyToken(body.token)) return res.status(401).json({ error: "Sign in required." });
    if (!imageBase64) return res.status(400).json({ error: "Missing imageBase64" });

    const client = new Anthropic({ apiKey: key });
    const list = TYPES.map((t) => `- ${t.id}: ${t.label}`).join("\n");

    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 400,
      output_config: {
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              typeId: { type: "string", enum: TYPES.map((t) => t.id) },
              label: { type: "string" },
              confidence: { type: "string", enum: ["high", "medium", "low"] },
              note: { type: "string" },
            },
            required: ["typeId", "label", "confidence", "note"],
            additionalProperties: false,
          },
        },
      },
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType || "image/jpeg", data: imageBase64 } },
          { type: "text", text:
`Identify the single roofing flashing / sheet-metal part in this photo for the Flash-Tech catalog. Choose the best match from this list (return its id):
${list}

Guidance:
- A tapered (cone-shaped) round pipe sleeve on a membrane base → conicalBoot
- A straight round pipe sleeve → cylBoot
- A square/rectangular tube sleeve → squareWrap
- If the sleeve clearly leans/angles for a pitched (non-vertical) penetration → the matching "miter" variant (miterCyl for round, miterSquare for square)
- A rectangular through-wall drain opening / parapet scupper → scupper
- Bent flat sheet metal running along a roof edge → dripEdge, gravelStop (has a raised lip), coping (caps a wall, two faces), lFlashing, zFlashing, or valley (V-shaped)

Pick the closest type even if unsure, set confidence accordingly, and give a one-sentence note describing what you see.` },
        ],
      }],
    });

    const text = response.content.find((b) => b.type === "text")?.text || "{}";
    const data = JSON.parse(text);
    return res.status(200).json({ ok: true, ...data });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
