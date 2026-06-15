-- =====================================================
-- Flash-Tech Contractor Portal — Database Setup
-- Run this in the Supabase SQL Editor.
-- All tables are prefixed portal_* so this can safely run
-- in the SAME Supabase project as the Sales Assistant.
-- =====================================================

-- 1. PORTAL USERS (contractors + Flash-Tech admins)
CREATE TABLE IF NOT EXISTS portal_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,          -- SHA-256 hex of the password
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'contractor' CHECK (role IN ('contractor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PARTS CATALOG
CREATE TABLE IF NOT EXISTS portal_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'ea' CHECK (unit IN ('lf', 'ea')),  -- linear foot or each
  price DECIMAL(10,2) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SAVED CUSTOM FLASHINGS (from the custom flashing builder)
CREATE TABLE IF NOT EXISTS portal_custom_flashings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_id UUID REFERENCES portal_users(id) ON DELETE CASCADE,
  part_number TEXT NOT NULL,
  name TEXT,
  flashing_type TEXT NOT NULL,
  material_code TEXT NOT NULL,
  params JSONB NOT NULL,                -- dimension inputs
  girth DECIMAL(8,2),
  bends INTEGER,
  piece_length_ft DECIMAL(6,2) DEFAULT 10,
  price_per_piece DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. QUOTE / ORDER REQUESTS
CREATE TABLE IF NOT EXISTS portal_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_id UUID REFERENCES portal_users(id) ON DELETE SET NULL,
  req_type TEXT NOT NULL DEFAULT 'quote' CHECK (req_type IN ('quote', 'order')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'responded', 'closed')),
  job_name TEXT,
  po_number TEXT,
  needed_by DATE,
  notes TEXT,
  subtotal DECIMAL(12,2) DEFAULT 0,     -- estimated, from catalog pricing
  admin_quote_total DECIMAL(12,2),      -- final total set by Flash-Tech
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REQUEST LINE ITEMS
CREATE TABLE IF NOT EXISTS portal_request_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES portal_requests(id) ON DELETE CASCADE,
  item_kind TEXT NOT NULL DEFAULT 'product' CHECK (item_kind IN ('product', 'custom')),
  sku TEXT,
  description TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'ea',      -- 'lf', 'ea', or 'pc' for custom pieces
  qty DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  line_total DECIMAL(12,2) NOT NULL,
  detail JSONB,                         -- custom flashing params for 3D re-render
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MESSAGE THREADS (admin <-> contractor, per request)
CREATE TABLE IF NOT EXISTS portal_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES portal_requests(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('contractor', 'admin')),
  sender_name TEXT,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DEFAULT LOGINS — change these passwords before going live!
--   admin@flash-techinc.com / admin     (Flash-Tech admin)
--   demo@contractor.com     / 1234      (demo contractor)
-- (password_hash is SHA-256 of the password)
-- =====================================================
INSERT INTO portal_users (email, password_hash, name, company, role) VALUES
  ('admin@flash-techinc.com', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'Flash-Tech Admin', 'Flash-Tech Mfg, Inc.', 'admin'),
  ('demo@contractor.com', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'Demo Contractor', 'Demo Roofing Co.', 'contractor')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- SEED THE PARTS CATALOG
-- =====================================================
INSERT INTO portal_products (sku, category, description, unit, price) VALUES
  ('FT-EM-1001', 'Drip Edge', 'Drip Edge 2" x 2" — Galvanized 26ga', 'lf', 1.95),
  ('FT-EM-1002', 'Drip Edge', 'Drip Edge 3" x 3" — Galvanized 26ga', 'lf', 2.45),
  ('FT-EM-1003', 'Drip Edge', 'Drip Edge 2" x 4" — Galvanized 26ga', 'lf', 2.65),
  ('FT-EM-1004', 'Drip Edge', 'Drip Edge 2" x 2" — Bonderized 26ga', 'lf', 2.10),
  ('FT-EM-1010', 'Gravel Stop', 'Gravel Stop 4" Face — Galvanized 24ga', 'lf', 3.85),
  ('FT-EM-1011', 'Gravel Stop', 'Gravel Stop 6" Face — Galvanized 24ga', 'lf', 4.65),
  ('FT-EM-1020', 'L Flashing', 'L Flashing 4" x 4" — Galvanized 26ga', 'lf', 2.95),
  ('FT-EM-1021', 'L Flashing', 'L Flashing 6" x 6" — Galvanized 26ga', 'lf', 3.95),
  ('FT-EM-1030', 'Z Flashing', 'Z-Bar Flashing 1.5" x 3" x 1.5" — Galvanized 26ga', 'lf', 2.75),
  ('FT-EM-1040', 'Valley Metal', 'Valley Metal 16" Girth — Galvanized 26ga', 'lf', 4.25),
  ('FT-EM-1050', 'Counter Flashing', 'Counter Flashing / Reglet 4" — Galvanized 26ga', 'lf', 3.15),
  ('FT-CM-1001', 'Coping Metal', 'Coping Cap — 12" Wall — Galvanized 24ga', 'lf', 8.50),
  ('FT-CM-1002', 'Coping Metal', 'Coping Cap — 16" Wall — Galvanized 24ga', 'lf', 10.75),
  ('FT-CM-1003', 'Coping Metal', 'Coping Cap — 20" Wall — Galvanized 24ga', 'lf', 12.95),
  ('WS-1001TPO', 'Pipe Boots', '1-6" Conical Boot — TPO', 'ea', 24.80),
  ('WS-1006TPO', 'Pipe Boots', '6-8" Conical Boot — TPO', 'ea', 32.00),
  ('WS-1002TPO', 'Pipe Boots', '1-6" Split Conical Boot — TPO', 'ea', 24.80),
  ('WS-1011TPO', 'Pipe Boots', '2" Pipe Flashing — TPO', 'ea', 27.90),
  ('WS-1015TPO', 'Pipe Boots', '4" Vent Pipe Flashing — TPO', 'ea', 35.10),
  ('WS-1020TPO', 'Pipe Boots', '4" Square Wrap — TPO', 'ea', 37.50),
  ('WSD-1001TPO', 'Scuppers & Drains', '<10" Scupper Drain (4 sides) — TPO', 'ea', 107.50),
  ('WS-2001SS', 'Scuppers & Drains', '2" Deck Drain — Stainless Steel', 'ea', 55.00),
  ('WSD-1020TPO', 'Scuppers & Drains', '2" Bowl Drain — TPO', 'ea', 162.00),
  ('WSP1005TPO', 'Sealant Pockets', '4" Sealant Pocket — TPO', 'ea', 37.00),
  ('WSP-1006TPO', 'Sealant Pockets', '6" Sealant Pocket — TPO', 'ea', 42.00),
  ('WSA-1001TPO', 'Corners & Accessories', '3.5" Injection Molded Outside Corner — TPO', 'ea', 4.50),
  ('WSA-1003TPO', 'Corners & Accessories', '6" Non-Reinforced Inside Corner — TPO', 'ea', 10.00),
  ('WSA-1004TPO', 'Corners & Accessories', '4.5" T-Joint Cover (100 pc) — TPO', 'ea', 120.00),
  ('WSA-1018', 'Corners & Accessories', 'Solar Anchor Boot', 'ea', 19.00),
  ('WSA-1008', 'Corners & Accessories', 'Clamp (1-6")', 'ea', 2.50)
ON CONFLICT (sku) DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (simple open policies, same pattern
-- as the Sales Assistant — tighten later if needed)
-- =====================================================
ALTER TABLE portal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_custom_flashings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access" ON portal_users FOR ALL USING (true);
CREATE POLICY "Allow all access" ON portal_products FOR ALL USING (true);
CREATE POLICY "Allow all access" ON portal_custom_flashings FOR ALL USING (true);
CREATE POLICY "Allow all access" ON portal_requests FOR ALL USING (true);
CREATE POLICY "Allow all access" ON portal_request_items FOR ALL USING (true);
CREATE POLICY "Allow all access" ON portal_messages FOR ALL USING (true);

-- =====================================================
-- DONE! Your contractor portal database is ready.
-- =====================================================
