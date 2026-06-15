// ─── Flash-Tech Mfg — Parts Catalog, Materials & Custom Flashing Engine ───

// Fallback catalog used when the portal_products table hasn't been created yet
// (the database seed in database-setup.sql contains this same list).
export const SEED_PRODUCTS = [
  // ── Edge metal & coping — sold by the LINEAR FOOT ──
  { sku: "FT-EM-1001", category: "Drip Edge", description: 'Drip Edge 2" x 2" — Galvanized 26ga', unit: "lf", price: 1.95 },
  { sku: "FT-EM-1002", category: "Drip Edge", description: 'Drip Edge 3" x 3" — Galvanized 26ga', unit: "lf", price: 2.45 },
  { sku: "FT-EM-1003", category: "Drip Edge", description: 'Drip Edge 2" x 4" — Galvanized 26ga', unit: "lf", price: 2.65 },
  { sku: "FT-EM-1004", category: "Drip Edge", description: 'Drip Edge 2" x 2" — Bonderized 26ga', unit: "lf", price: 2.10 },
  { sku: "FT-EM-1010", category: "Gravel Stop", description: 'Gravel Stop 4" Face — Galvanized 24ga', unit: "lf", price: 3.85 },
  { sku: "FT-EM-1011", category: "Gravel Stop", description: 'Gravel Stop 6" Face — Galvanized 24ga', unit: "lf", price: 4.65 },
  { sku: "FT-EM-1020", category: "L Flashing", description: 'L Flashing 4" x 4" — Galvanized 26ga', unit: "lf", price: 2.95 },
  { sku: "FT-EM-1021", category: "L Flashing", description: 'L Flashing 6" x 6" — Galvanized 26ga', unit: "lf", price: 3.95 },
  { sku: "FT-EM-1030", category: "Z Flashing", description: 'Z-Bar Flashing 1.5" x 3" x 1.5" — Galvanized 26ga', unit: "lf", price: 2.75 },
  { sku: "FT-EM-1040", category: "Valley Metal", description: 'Valley Metal 16" Girth — Galvanized 26ga', unit: "lf", price: 4.25 },
  { sku: "FT-EM-1050", category: "Counter Flashing", description: 'Counter Flashing / Reglet 4" — Galvanized 26ga', unit: "lf", price: 3.15 },
  { sku: "FT-CM-1001", category: "Coping Metal", description: 'Coping Cap — 12" Wall — Galvanized 24ga', unit: "lf", price: 8.50 },
  { sku: "FT-CM-1002", category: "Coping Metal", description: 'Coping Cap — 16" Wall — Galvanized 24ga', unit: "lf", price: 10.75 },
  { sku: "FT-CM-1003", category: "Coping Metal", description: 'Coping Cap — 20" Wall — Galvanized 24ga', unit: "lf", price: 12.95 },
  // ── Roofing accessories — sold EACH ──
  { sku: "WS-1001TPO", category: "Pipe Boots", description: '1-6" Conical Boot — TPO', unit: "ea", price: 24.80 },
  { sku: "WS-1006TPO", category: "Pipe Boots", description: '6-8" Conical Boot — TPO', unit: "ea", price: 32.00 },
  { sku: "WS-1002TPO", category: "Pipe Boots", description: '1-6" Split Conical Boot — TPO', unit: "ea", price: 24.80 },
  { sku: "WS-1011TPO", category: "Pipe Boots", description: '2" Pipe Flashing — TPO', unit: "ea", price: 27.90 },
  { sku: "WS-1015TPO", category: "Pipe Boots", description: '4" Vent Pipe Flashing — TPO', unit: "ea", price: 35.10 },
  { sku: "WS-1020TPO", category: "Pipe Boots", description: '4" Square Wrap — TPO', unit: "ea", price: 37.50 },
  { sku: "WSD-1001TPO", category: "Scuppers & Drains", description: '<10" Scupper Drain (4 sides) — TPO', unit: "ea", price: 107.50 },
  { sku: "WS-2001SS", category: "Scuppers & Drains", description: '2" Deck Drain — Stainless Steel', unit: "ea", price: 55.00 },
  { sku: "WSD-1020TPO", category: "Scuppers & Drains", description: '2" Bowl Drain — TPO', unit: "ea", price: 162.00 },
  { sku: "WSP1005TPO", category: "Sealant Pockets", description: '4" Sealant Pocket — TPO', unit: "ea", price: 37.00 },
  { sku: "WSP-1006TPO", category: "Sealant Pockets", description: '6" Sealant Pocket — TPO', unit: "ea", price: 42.00 },
  { sku: "WSA-1001TPO", category: "Corners & Accessories", description: '3.5" Injection Molded Outside Corner — TPO', unit: "ea", price: 4.50 },
  { sku: "WSA-1003TPO", category: "Corners & Accessories", description: '6" Non-Reinforced Inside Corner — TPO', unit: "ea", price: 10.00 },
  { sku: "WSA-1004TPO", category: "Corners & Accessories", description: '4.5" T-Joint Cover (100 pc) — TPO', unit: "ea", price: 120.00 },
  { sku: "WSA-1018", category: "Corners & Accessories", description: "Solar Anchor Boot", unit: "ea", price: 19.00 },
  { sku: "WSA-1008", category: "Corners & Accessories", description: 'Clamp (1-6")', unit: "ea", price: 2.50 },
];

// ─── Sheet metal materials for the custom flashing builder ───
// rate = $ per inch of girth, per linear foot (estimated customer pricing)
export const MATERIALS = [
  { code: "G26", name: "Galvanized 26ga", rate: 0.26, hue: 210, sat: 8, lum: 62 },
  { code: "G24", name: "Galvanized 24ga", rate: 0.32, hue: 210, sat: 8, lum: 60 },
  { code: "B26", name: "Bonderized 26ga", rate: 0.28, hue: 35, sat: 7, lum: 46 },
  { code: "B24", name: "Bonderized 24ga", rate: 0.34, hue: 35, sat: 7, lum: 44 },
  { code: "A32", name: 'Aluminum .032"', rate: 0.36, hue: 215, sat: 4, lum: 72 },
  { code: "A40", name: 'Aluminum .040"', rate: 0.46, hue: 215, sat: 4, lum: 70 },
  { code: "CU16", name: "Copper 16oz", rate: 1.45, hue: 22, sat: 60, lum: 48 },
  { code: "SS24", name: "Stainless 24ga", rate: 0.95, hue: 210, sat: 6, lum: 74 },
];

// ─── Single-ply membrane: type (TPO / PVC), color, thickness ───
// Membrane material code is composed as "<TYPE>-<COLOR>", e.g. "TPO-G".
export const MEMBRANE_TYPES = [
  { code: "TPO", name: "TPO", rate: 1.00 },
  { code: "PVC", name: "PVC", rate: 1.06 },
];
export const MEMBRANE_COLORS = [
  { code: "W", name: "White", hue: 205, sat: 8, lum: 90 },
  { code: "G", name: "Gray", hue: 210, sat: 6, lum: 60 },
  { code: "T", name: "Tan", hue: 38, sat: 24, lum: 76 },
];
export const MEMBRANE_MILS = [45, 60, 80];

// Coated sheet metal (membrane-laminated, heat-weldable to the roof) for edge metal.
// rate = $ per inch of girth, per linear foot (like the bare MATERIALS rates).
export const COATED_METALS = [
  { code: "TPOC", name: "TPO-Coated Metal", rate: 0.44 },
  { code: "PVCC", name: "PVC-Coated Metal", rate: 0.46 },
];

// All composite (type-color) codes share one resolver. Membrane rates are
// price multipliers; coated-metal rates are $/girth-inch/ft like bare metals.
const COMPOSITE_TYPES = [...MEMBRANE_TYPES, ...COATED_METALS];

// Resolve a composite code ("TPO-G", "TPOC-W", or legacy "TPOG") to a render/price style.
export const membraneStyle = (code = "TPO-G") => {
  const [typeCode, colorCode] = code.includes("-") ? code.split("-") : [code.slice(0, 3), code.slice(3)];
  const tp = COMPOSITE_TYPES.find((t) => t.code === typeCode) || MEMBRANE_TYPES[0];
  const c = MEMBRANE_COLORS.find((x) => x.code === colorCode) || MEMBRANE_COLORS[1];
  return { code, hue: c.hue, sat: c.sat, lum: c.lum, rate: tp.rate, typeName: tp.name, colorName: c.name, name: `${tp.name} ${c.name}` };
};

// Look up by code: bare sheet metals first, otherwise treat as a composite code.
export const anyMat = (c) => MATERIALS.find((m) => m.code === c) || membraneStyle(c);
export const matByCode = anyMat;

const rad = (deg) => (deg * Math.PI) / 180;

// ─── Flashing profile types ───
// Each type lists its dimension fields (inches / degrees) and a points()
// function returning the bent cross-section as [x, y] pairs (y is DOWN).
export const FLASHING_TYPES = [
  {
    id: "dripEdge",
    code: "DE",
    name: "Drip Edge",
    fields: [
      { key: "flange", label: 'Deck Flange (in)', def: 3, min: 1, max: 12 },
      { key: "face", label: 'Face (in)', def: 2, min: 1, max: 12 },
      { key: "kick", label: 'Kick / Hem (in)', def: 0.75, min: 0, max: 3, step: 0.25 },
      { key: "kickAngle", label: "Kick Angle (°)", def: 35, min: 0, max: 75, step: 5 },
    ],
    points: (p) => {
      const pts = [[p.flange, 0], [0, 0], [0, p.face]];
      if (p.kick > 0) pts.push([-Math.sin(rad(p.kickAngle)) * p.kick, p.face + Math.cos(rad(p.kickAngle)) * p.kick]);
      return pts;
    },
    dims: (p) => `${p.flange}" flange x ${p.face}" face` + (p.kick > 0 ? `, ${p.kick}" kick @ ${p.kickAngle}°` : ""),
  },
  {
    id: "lFlashing",
    code: "LF",
    name: "L / Counter Flashing",
    fields: [
      { key: "rise", label: "Vertical Leg (in)", def: 4, min: 1, max: 18 },
      { key: "base", label: "Horizontal Leg (in)", def: 4, min: 1, max: 18 },
      { key: "angle", label: "Bend Angle (°)", def: 90, min: 90, max: 160, step: 5 },
    ],
    points: (p) => [
      [0, 0],
      [0, p.rise],
      [Math.sin(rad(p.angle)) * p.base, p.rise + Math.cos(rad(p.angle)) * p.base],
    ],
    dims: (p) => `${p.rise}" x ${p.base}" @ ${p.angle}°`,
  },
  {
    id: "zFlashing",
    code: "ZF",
    name: "Z Flashing / Z-Bar",
    fields: [
      { key: "top", label: "Top Leg (in)", def: 1.5, min: 0.5, max: 8, step: 0.25 },
      { key: "web", label: "Web / Rise (in)", def: 3, min: 1, max: 12 },
      { key: "bottom", label: "Bottom Leg (in)", def: 1.5, min: 0.5, max: 8, step: 0.25 },
    ],
    points: (p) => [[-p.top, 0], [0, 0], [0, p.web], [p.bottom, p.web]],
    dims: (p) => `${p.top}" x ${p.web}" x ${p.bottom}"`,
  },
  {
    id: "coping",
    code: "CP",
    name: "Coping Cap",
    fields: [
      { key: "width", label: "Wall Width (in)", def: 12, min: 4, max: 30 },
      { key: "front", label: "Front Face (in)", def: 4, min: 1, max: 12 },
      { key: "back", label: "Back Face (in)", def: 3, min: 1, max: 12 },
      { key: "kick", label: "Kick-Out (in)", def: 0.75, min: 0.25, max: 2, step: 0.25 },
      { key: "kickAngle", label: "Kick Angle (°)", def: 45, min: 15, max: 75, step: 5 },
      { key: "edge", label: "Bottom Edge", type: "choice", def: "kick", options: [{ value: "kick", label: "Kick only" }, { value: "hemkick", label: "Hem + Kick" }] },
    ],
    points: (p) => {
      const slope = 0.6; // top slopes for drainage
      const ka = rad(p.kickAngle ?? 45);
      const kick = p.kick ?? 0.75;
      const hem = p.edge === "hemkick";
      const hl = 0.5; // hemmed return length
      const pts = [];
      // front face (left, x=0) — kicks OUT, away from the wall (-x)
      const fKick = [-Math.sin(ka) * kick, p.front + Math.cos(ka) * kick];
      if (hem) pts.push([fKick[0] + hl, fKick[1]]); // folded return tucked under the kick
      pts.push(fKick, [0, p.front], [0, 0], [p.width, slope], [p.width, slope + p.back]);
      // back face (right, x=width) — kicks OUT (+x)
      const bKick = [p.width + Math.sin(ka) * kick, slope + p.back + Math.cos(ka) * kick];
      pts.push(bKick);
      if (hem) pts.push([bKick[0] - hl, bKick[1]]);
      return pts;
    },
    dims: (p) => `${p.width}" wall, ${p.front}"/${p.back}" faces, ${p.kick ?? 0.75}" kick-out @ ${p.kickAngle ?? 45}°${p.edge === "hemkick" ? ", hemmed" : ""}`,
  },
  {
    id: "gravelStop",
    code: "GS",
    name: "Gravel Stop / Fascia",
    fields: [
      { key: "lip", label: "Gravel Stop Lip (in)", def: 1, min: 0.5, max: 3, step: 0.25 },
      { key: "flange", label: "Roof Flange (in)", def: 3, min: 1, max: 12 },
      { key: "face", label: "Face (in)", def: 4, min: 1, max: 12 },
      { key: "cant", label: "Face Cant (°)", def: 12, min: 0, max: 45, step: 1 },
      { key: "kick", label: "Bottom Kick (in)", def: 0.5, min: 0, max: 2, step: 0.25 },
    ],
    points: (p) => {
      const c = rad(p.cant);
      const lip = p.lip ?? 1;
      const pts = [[p.flange, 0], [0, 0]];        // roof flange in to the outer edge
      if (lip > 0) pts.push([0, -lip]);            // raised lip that retains gravel on the roof
      const startY = lip > 0 ? -lip : 0;
      const fx = -Math.sin(c) * p.face, fy = startY + Math.cos(c) * p.face;
      pts.push([fx, fy]);                          // down the fascia face
      if (p.kick > 0) {
        const k = rad(p.cant + 35);
        pts.push([fx - Math.sin(k) * p.kick, fy + Math.cos(k) * p.kick]);
      }
      return pts;
    },
    dims: (p) => `${p.lip ?? 1}" gravel lip, ${p.flange}" flange x ${p.face}" face @ ${p.cant}° cant`,
  },
  {
    id: "valley",
    code: "VL",
    name: "Valley Metal",
    fields: [
      { key: "legA", label: "Leg A (in)", def: 8, min: 2, max: 18 },
      { key: "legB", label: "Leg B (in)", def: 8, min: 2, max: 18 },
      { key: "openAngle", label: "Open Angle (°)", def: 120, min: 60, max: 175, step: 5 },
    ],
    points: (p) => {
      const h = rad(p.openAngle / 2);
      return [
        [-Math.sin(h) * p.legA, -Math.cos(h) * p.legA],
        [0, 0],
        [Math.sin(h) * p.legB, -Math.cos(h) * p.legB],
      ];
    },
    dims: (p) => `${p.legA}" x ${p.legB}" legs @ ${p.openAngle}°`,
  },

  // ── Single-ply membrane flashings (TPO / PVC) — revolved, priced EACH ──
  {
    id: "conicalBoot", code: "CB", kind: "membrane", name: "Conical Pipe Boot", splittable: true,
    fields: [
      { key: "baseDia", label: "Base Diameter (in)", def: 6, min: 1.5, max: 16, step: 0.5 },
      { key: "topDia", label: "Top Diameter (in)", def: 1.5, min: 0.5, max: 14, step: 0.5 },
      { key: "height", label: "Stack Height (in)", def: 7, min: 2, max: 16, step: 0.5 },
      { key: "flange", label: "Flange Width (in)", def: 2.5, min: 1, max: 6, step: 0.25 },
    ],
    geometry: (p) => ({ shape: "cone", botR: p.baseDia / 2, topR: Math.min(p.topDia, p.baseDia) / 2, height: p.height, flangeR: p.baseDia / 2 + p.flange }),
    dims: (p) => `${p.baseDia}"⌀ base → ${p.topDia}"⌀ top, ${p.height}" tall, ${p.flange}" flange`,
    fits: (p) => `fits ${p.topDia}"–${p.baseDia}" pipe`,
  },
  {
    id: "cylBoot", code: "CY", kind: "membrane", name: "Cylindrical Pipe Boot", splittable: true,
    fields: [
      { key: "pipeDia", label: "Pipe Diameter (in)", def: 4, min: 1, max: 16, step: 0.5 },
      { key: "height", label: "Stack Height (in)", def: 8, min: 2, max: 18, step: 0.5 },
      { key: "flange", label: "Flange Width (in)", def: 2.5, min: 1, max: 6, step: 0.25 },
    ],
    geometry: (p) => ({ shape: "cylinder", botR: p.pipeDia / 2, topR: p.pipeDia / 2, height: p.height, flangeR: p.pipeDia / 2 + p.flange }),
    dims: (p) => `${p.pipeDia}"⌀ pipe, ${p.height}" tall, ${p.flange}" flange`,
    fits: (p) => `fits ${p.pipeDia}" pipe`,
  },
  {
    id: "squareWrap", code: "SW", kind: "membrane", name: "Square Wrap", splittable: true,
    fields: [
      { key: "side", label: "Tube Size (in, square)", def: 4, min: 1, max: 16, step: 0.5 },
      { key: "height", label: "Stack Height (in)", def: 8, min: 2, max: 18, step: 0.5 },
      { key: "flange", label: "Flange Width (in)", def: 2.5, min: 1, max: 6, step: 0.25 },
    ],
    geometry: (p) => ({ shape: "square", half: p.side / 2, height: p.height, flange: p.flange, tilt: 0 }),
    dims: (p) => `${p.side}"×${p.side}" tube, ${p.height}" tall, ${p.flange}" flange`,
    fits: (p) => `fits ${p.side}" square tube/post`,
  },
  {
    id: "miterCyl", code: "MC", kind: "membrane", name: "Mitered Cylindrical Wrap", splittable: true,
    fields: [
      { key: "pipeDia", label: "Pipe Diameter (in)", def: 4, min: 1, max: 16, step: 0.5 },
      { key: "height", label: "Stack Height (in)", def: 8, min: 2, max: 18, step: 0.5 },
      { key: "miter", label: "Miter Angle (° from vertical)", def: 30, min: 5, max: 60, step: 5 },
      { key: "flange", label: "Flange Width (in)", def: 2.5, min: 1, max: 6, step: 0.25 },
    ],
    geometry: (p) => ({ shape: "cylinder", botR: p.pipeDia / 2, topR: p.pipeDia / 2, height: p.height, flangeR: p.pipeDia / 2 + p.flange, tilt: p.miter }),
    dims: (p) => `${p.pipeDia}"⌀ pipe, ${p.height}" tall, ${p.miter}° miter, ${p.flange}" flange`,
    fits: (p) => `fits ${p.pipeDia}" pipe @ ${p.miter}° pitch`,
  },
  {
    id: "miterSquare", code: "MSW", kind: "membrane", name: "Mitered Square Wrap", splittable: true,
    fields: [
      { key: "side", label: "Tube Size (in, square)", def: 4, min: 1, max: 16, step: 0.5 },
      { key: "height", label: "Stack Height (in)", def: 8, min: 2, max: 18, step: 0.5 },
      { key: "miter", label: "Miter Angle (° from vertical)", def: 30, min: 5, max: 60, step: 5 },
      { key: "flange", label: "Flange Width (in)", def: 2.5, min: 1, max: 6, step: 0.25 },
    ],
    geometry: (p) => ({ shape: "square", half: p.side / 2, height: p.height, flange: p.flange, tilt: p.miter }),
    dims: (p) => `${p.side}"×${p.side}" tube, ${p.height}" tall, ${p.miter}° miter, ${p.flange}" flange`,
    fits: (p) => `fits ${p.side}" square @ ${p.miter}° pitch`,
  },
];
export const typeById = (id) => FLASHING_TYPES.find((t) => t.id === id) || FLASHING_TYPES[0];

// ─── Geometry & pricing ───
export const profileGirth = (pts) => {
  let g = 0;
  for (let i = 1; i < pts.length; i++) g += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return Math.round(g * 100) / 100;
};
export const profileBends = (pts) => Math.max(0, pts.length - 2);

const BEND_CHARGE = 0.5; // $ per bend per piece
const MIN_PIECE = 14; // shop minimum per piece

export const piecePrice = (girth, bends, lengthFt, matCode) => {
  const m = matByCode(matCode);
  const raw = girth * m.rate * lengthFt + bends * BEND_CHARGE;
  return Math.round(Math.max(MIN_PIECE, raw) * 100) / 100;
};

export const customPartNumber = (typeId, matCode, girth) => {
  const t = typeById(typeId);
  const g = String(Math.round(girth * 10)).padStart(3, "0");
  return `FT-CX-${t.code}-${matCode}-${g}`;
};

export const customDescription = (typeId, matCode, params, lengthFt, girth) => {
  const t = typeById(typeId);
  const m = matByCode(matCode);
  return `Custom ${t.name} — ${m.name}, ${t.dims(params)}, ${girth}" girth, ${lengthFt}'-0" lengths`;
};

// ─── Single-ply membrane pricing ───
const MEMBRANE_BASE = 12;  // $ base per boot
const MEMBRANE_MIN = 19;   // shop minimum each
const MIL_FACTOR = { 45: 0.92, 60: 1.0, 80: 1.18 };
export const membranePrice = (geo, matCode, split, mil = 60) => {
  const m = anyMat(matCode);
  let raw;
  if (geo.shape === "square") {
    raw = MEMBRANE_BASE + geo.half * 2 * 2.4 + geo.height * 0.9 + (split ? 5 : 0); // 4-sided = more material/welds
  } else {
    raw = MEMBRANE_BASE + geo.botR * 2 * 1.7 + geo.height * 0.9 + (split ? 5 : 0);
  }
  if (geo.tilt) raw += 8; // mitered fabrication surcharge
  return Math.round(Math.max(MEMBRANE_MIN, raw) * (m.rate || 1) * (MIL_FACTOR[mil] || 1) * 100) / 100;
};
export const membranePartNumber = (typeId, matCode, geo, split) => {
  const t = typeById(typeId);
  const size = geo.shape === "square" ? geo.half * 2 : geo.botR * 2;
  const d = String(Math.round(size * 10)).padStart(3, "0");
  return `FT-CX-${t.code}${split ? "S" : ""}-${matCode}-${d}`;
};
export const membraneDescription = (typeId, matCode, params, split) => {
  const t = typeById(typeId);
  const m = anyMat(matCode);
  return `Custom ${split ? "Split " : ""}${t.name} — ${m.name}, ${t.dims(params)}`;
};

export const defaultParams = (typeId) => {
  const t = typeById(typeId);
  const p = {};
  t.fields.forEach((f) => (p[f.key] = f.def));
  if (t.splittable) p.split = false;
  if (t.kind === "membrane") p.mil = 60;
  return p;
};
