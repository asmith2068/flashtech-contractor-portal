import React from "react";
import { anyMat } from "./catalog.js";

// ─── 3D-look SVG renderer for single-ply membrane boots & wraps ───
// Round (conical / cylindrical) or square sleeves on a flat membrane flange,
// optionally mitered (sheared) for an angled penetration. Axonometric
// projection, painter-sorted faces, angle-based shading.

const YAW = 32, PITCH = 22;
const cyaw = Math.cos((YAW * Math.PI) / 180), syaw = Math.sin((YAW * Math.PI) / 180);
const cpit = Math.cos((PITCH * Math.PI) / 180), spit = Math.sin((PITCH * Math.PI) / 180);

// model: x right, y DOWN (flange at y=0, height rises into -y), z depth.
const proj = (x, y, z) => {
  const x1 = x * cyaw + z * syaw;
  const z1 = -x * syaw + z * cyaw;
  const y1 = y * cpit - z1 * spit;
  const z2 = y * spit + z1 * cpit;
  return [x1, y1, z2];
};
const LIGHT = (() => { const v = [-0.4, -0.72, 0.56]; const n = Math.hypot(...v); return v.map((a) => a / n); })();

export default function SinglePly3D({ geo, materialCode = "TPO-W", split = false, height = 280 }) {
  if (!geo) return null;
  const mat = anyMat(materialCode);
  const N = 60;
  const tan = Math.tan(((geo.tilt || 0) * Math.PI) / 180);   // miter shear: x offset per unit height
  const isSquare = geo.shape === "square";

  const faces = [];
  const pushQuad = (m0, m1, m2, m3) => {
    const P = [proj(...m0), proj(...m1), proj(...m2), proj(...m3)];
    const u = [m1[0] - m0[0], m1[1] - m0[1], m1[2] - m0[2]];
    const v = [m3[0] - m0[0], m3[1] - m0[1], m3[2] - m0[2]];
    const nx = u[1] * v[2] - u[2] * v[1], ny = u[2] * v[0] - u[0] * v[2], nz = u[0] * v[1] - u[1] * v[0];
    const nl = Math.hypot(nx, ny, nz) || 1;
    const [rx, ry, rz] = proj(nx / nl, ny / nl, nz / nl);
    const bright = Math.abs(rx * LIGHT[0] + ry * LIGHT[1] + rz * LIGHT[2]);
    const depth = (P[0][2] + P[1][2] + P[2][2] + P[3][2]) / 4;
    faces.push({ P, bright, depth });
  };

  // round point (with miter shear); a = angle, up = height above flange
  const cp = (r, up, a) => [r * Math.cos(a) + up * tan, -up, r * Math.sin(a)];
  // square corners (with miter shear); returns 4 model points
  const sq = (half, up) => [[-half, -half], [half, -half], [half, half], [-half, half]].map(([x, z]) => [x + up * tan, -up, z]);

  let rims = [], shadowPts;

  if (geo.shape === "scupper") {
    // Rectangular through-wall scupper: front flange frame + throat box going back (+z).
    const { w, h, throat, flange } = geo;
    const rect = (hw, hh, z) => [[-hw, -hh, z], [hw, -hh, z], [hw, hh, z], [-hw, hh, z]];
    const oc = rect(w / 2 + flange, h / 2 + flange, 0);   // flange outer (front)
    const ic = rect(w / 2, h / 2, 0);                      // opening (front)
    const bk = rect(w / 2, h / 2, throat);                 // opening (back)
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; pushQuad(oc[i], oc[j], ic[j], ic[i]); }  // flange frame
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; pushQuad(ic[i], ic[j], bk[j], bk[i]); }  // throat walls
    const close = (a) => [...a, a[0]].map((m) => proj(...m));
    rims = [{ pts: close(oc), w: 6 }, { pts: close(ic), w: 7 }, { pts: close(bk), w: 9 }];
    shadowPts = close(oc);
  } else if (isSquare) {
    const { half, height: H, flange } = geo;
    const b = sq(half, 0), tp = sq(half, H), ci = sq(half, 0), co = sq(half + flange, 0);
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; pushQuad(b[i], b[j], tp[j], tp[i]); }       // sleeve walls
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; pushQuad(co[i], co[j], ci[j], ci[i]); }       // flange frame
    const close = (a) => [...a, a[0]].map((m) => proj(...m));
    rims = [{ pts: close(co), w: 6 }, { pts: close(b), w: 9 }, { pts: close(tp), w: 5 }];
    if (split) rims.push({ line: [proj(...b[0]), proj(...tp[0])], w: 4 }); // split seam down a face
    shadowPts = close(co);
  } else {
    const { botR, topR, flangeR, height: H } = geo;
    const gap = split ? 0.34 : 0;
    const a0 = -Math.PI / 2 + gap / 2;
    const span = Math.PI * 2 - gap;
    for (let i = 0; i < N; i++) { const aa = a0 + span * (i / N), ab = a0 + span * ((i + 1) / N); pushQuad(cp(botR, 0, aa), cp(botR, 0, ab), cp(topR, H, ab), cp(topR, H, aa)); }
    for (let i = 0; i < N; i++) { const aa = a0 + span * (i / N), ab = a0 + span * ((i + 1) / N); pushQuad(cp(botR, 0, aa), cp(flangeR, 0, aa), cp(flangeR, 0, ab), cp(botR, 0, ab)); }
    const ring = (r, up, s = a0, sp = span) => { const a = []; for (let i = 0; i <= N; i++) { a.push(proj(...cp(r, up, s + sp * (i / N)))); } return a; };
    rims = [{ pts: ring(flangeR, 0), w: 6 }, { pts: ring(botR, 0), w: 9 }, { pts: ring(topR, H), w: 5 }];
    if (split) rims.push({ line: [proj(...cp(botR, 0, a0)), proj(...cp(topR, H, a0))], w: 4 }, { line: [proj(...cp(botR, 0, a0 + span)), proj(...cp(topR, H, a0 + span))], w: 4 });
    shadowPts = ring(flangeR, 0, -Math.PI / 2, Math.PI * 2);
  }
  faces.sort((a, b) => b.depth - a.depth); // far faces first

  // Fit to viewBox
  const all = [...faces.flatMap((f) => f.P), ...rims.flatMap((r) => r.pts || r.line)];
  const minX = Math.min(...all.map((p) => p[0])), maxX = Math.max(...all.map((p) => p[0]));
  const minY = Math.min(...all.map((p) => p[1])), maxY = Math.max(...all.map((p) => p[1]));
  const size = Math.max(maxX - minX, maxY - minY);
  const pad = size * 0.14 + 1;
  const vb = `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2 + size * 0.12}`;
  const fs = size / 22;

  const shade = (b) => `hsl(${mat.hue} ${mat.sat}% ${Math.max(16, Math.min(88, mat.lum * (0.45 + 0.75 * b)))}%)`;
  const edge = `hsl(${mat.hue} ${mat.sat + 6}% ${Math.max(12, mat.lum - 40)}%)`;
  const poly = (pts) => pts.map((p) => `${p[0]},${p[1]}`).join(" ");
  const label = geo.shape === "scupper" ? "scupper drain" : (geo.tilt ? "mitered " : "") + (isSquare ? "square wrap" : geo.shape === "cone" ? "conical boot" : "cylindrical boot");

  return (
    <svg viewBox={vb} style={{ width: "100%", height, display: "block" }} preserveAspectRatio="xMidYMid meet">
      <polygon points={poly(shadowPts)} fill="rgba(15,23,42,0.16)" transform={`translate(${size * 0.015} ${size * 0.05})`} />
      {faces.map((f, i) => (
        <polygon key={i} points={poly(f.P)} fill={shade(f.bright)} stroke={edge} strokeWidth={fs / 18} strokeLinejoin="round" />
      ))}
      {rims.map((r, i) => r.line
        ? <line key={i} x1={r.line[0][0]} y1={r.line[0][1]} x2={r.line[1][0]} y2={r.line[1][1]} stroke={edge} strokeWidth={fs / r.w} strokeLinecap="round" />
        : <polyline key={i} points={poly(r.pts)} fill="none" stroke={edge} strokeWidth={fs / r.w} strokeLinecap="round" strokeLinejoin="round" />
      )}
      <text x={(minX + maxX) / 2} y={maxY + pad + size * 0.06} fontSize={fs * 0.95} fill="var(--mut, #6b7280)" textAnchor="middle" fontWeight="600">
        {split ? "Split " : ""}{label} — {mat.name}
      </text>
    </svg>
  );
}
