import React from "react";
import { matByCode } from "./catalog.js";

// ─── 3D-look SVG renderer for bent sheet-metal profiles ───
// Takes the 2D cross-section (inches, y down) and extrudes it along Z with a
// rotated axonometric projection, painter-sorted faces and angle-based shading.

const YAW = 32, PITCH = 24;
const cy = Math.cos((YAW * Math.PI) / 180), sy = Math.sin((YAW * Math.PI) / 180);
const cp = Math.cos((PITCH * Math.PI) / 180), sp = Math.sin((PITCH * Math.PI) / 180);

// rotate about vertical axis (yaw), then about screen-x (pitch); returns [sx, sy, depth]
const proj = (x, y, z) => {
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const y1 = y * cp - z1 * sp;
  const z2 = y * sp + z1 * cp;
  return [x1, y1, z2];
};

const LIGHT = (() => {
  const v = [-0.45, -0.7, 0.55];
  const n = Math.hypot(...v);
  return v.map((a) => a / n);
})();

export default function Flashing3D({ points, lengthFt = 10, materialCode = "G26", height = 280, showDims = true }) {
  if (!points || points.length < 2) return null;
  const mat = matByCode(materialCode);

  // Display length: long enough to read as a "stick" without dwarfing the profile
  const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
  const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 2);
  const L = Math.min(lengthFt * 12, Math.max(span * 2.6, 14));

  // Build extruded faces (one quad per profile segment)
  const faces = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [ax, ay] = points[i], [bx, by] = points[i + 1];
    const quad = [proj(ax, ay, 0), proj(bx, by, 0), proj(bx, by, L), proj(ax, ay, L)];
    // segment normal in profile plane, rotated like the geometry
    const dx = bx - ax, dy = by - ay;
    const nl = Math.hypot(dx, dy) || 1;
    const [nx0, ny0, nz0] = [dy / nl, -dx / nl, 0];
    const nx1 = nx0 * cy, nz1 = -nx0 * sy;
    const ny1 = ny0 * cp - nz1 * sp;
    const nz2 = ny0 * sp + nz1 * cp;
    const bright = Math.abs(nx1 * LIGHT[0] + ny1 * LIGHT[1] + nz2 * LIGHT[2]);
    const depth = quad.reduce((s, q) => s + q[2], 0) / 4;
    faces.push({ quad, bright, depth, i });
  }
  faces.sort((a, b) => b.depth - a.depth); // far faces first

  // Fit to viewBox
  const all = faces.flatMap((f) => f.quad);
  const minX = Math.min(...all.map((p) => p[0])), maxX = Math.max(...all.map((p) => p[0]));
  const minY = Math.min(...all.map((p) => p[1])), maxY = Math.max(...all.map((p) => p[1]));
  const pad = Math.max(maxX - minX, maxY - minY) * 0.16 + 1.2;
  const vb = `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`;
  const fs = Math.max(maxX - minX, maxY - minY) / 22; // label font size in viewBox units

  const shade = (b) => {
    const l = Math.max(16, Math.min(88, mat.lum * (0.45 + 0.75 * b)));
    return `hsl(${mat.hue} ${mat.sat}% ${l}%)`;
  };
  const edge = `hsl(${mat.hue} ${mat.sat + 4}% ${Math.max(10, mat.lum - 38)}%)`;

  const frontPath = points.map((p, i) => `${i ? "L" : "M"}${proj(p[0], p[1], 0)[0]},${proj(p[0], p[1], 0)[1]}`).join(" ");
  const backPath = points.map((p, i) => `${i ? "L" : "M"}${proj(p[0], p[1], L)[0]},${proj(p[0], p[1], L)[1]}`).join(" ");

  // Per-segment dimension labels on the front profile
  const labels = [];
  if (showDims) {
    for (let i = 0; i < points.length - 1; i++) {
      const [ax, ay] = points[i], [bx, by] = points[i + 1];
      const len = Math.hypot(bx - ax, by - ay);
      if (len < 0.6) continue;
      const mx = (ax + bx) / 2, my = (ay + by) / 2;
      const pm = proj(mx, my, 0);
      const lx = pm[0] + (pm[0] - proj(mx, my, L / 2)[0]) * 0.35;
      const ly = pm[1] + (pm[1] - proj(mx, my, L / 2)[1]) * 0.35;
      labels.push(
        <text key={i} x={lx} y={ly} fontSize={fs} fill="var(--ink, #1f2937)" fontWeight="700"
          textAnchor="middle" paintOrder="stroke" stroke="#ffffff" strokeWidth={fs / 4}>
          {Math.round(len * 100) / 100}&quot;
        </text>
      );
    }
  }

  return (
    <svg viewBox={vb} style={{ width: "100%", height, display: "block" }} preserveAspectRatio="xMidYMid meet">
      {faces.map((f) => (
        <polygon key={f.i}
          points={f.quad.map((q) => `${q[0]},${q[1]}`).join(" ")}
          fill={shade(f.bright)} stroke={edge} strokeWidth={fs / 14} strokeLinejoin="round" />
      ))}
      <path d={backPath} fill="none" stroke={edge} strokeWidth={fs / 8} strokeLinecap="round" opacity="0.55" />
      <path d={frontPath} fill="none" stroke={edge} strokeWidth={fs / 4.5} strokeLinecap="round" strokeLinejoin="round" />
      {labels}
      {showDims && (
        <text x={(minX + maxX) / 2} y={maxY + pad * 0.72} fontSize={fs * 0.95} fill="var(--mut, #6b7280)"
          textAnchor="middle" fontWeight="600">
          {lengthFt}&apos;-0&quot; piece — {mat.name}
        </text>
      )}
    </svg>
  );
}
