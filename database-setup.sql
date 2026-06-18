-- =====================================================
-- Flash-Tech Contractor Portal — Database Setup
-- Run this in the Supabase SQL Editor.
-- All tables are prefixed portal_* so this can safely run
-- in the SAME Supabase project as the Sales Assistant.
-- =====================================================

-- 1. PORTAL USERS (contractors + Flash-Tech admins)
CREATE TABLE IF NOT EXISTS portal_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,           -- login id (email for contractors, username ok for admins)
  password_hash TEXT NOT NULL,          -- SHA-256 hex of the password
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  distributor TEXT,                     -- where the contractor orders through
  sales_rep TEXT,                       -- their sales rep at that distributor
  discount_pct NUMERIC DEFAULT 0,       -- % discount off all prices this contractor sees
  reset_token TEXT,                     -- password-reset link token
  reset_expires TIMESTAMPTZ,            -- when that token expires
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
  ('andrew', '64502d55e7e89f45383c0e29ec9c4ae1826da6a5fcd7122b69c1cc2ba059140c', 'Andrew', 'Flash-Tech Mfg, Inc.', 'admin')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- SEED THE PARTS CATALOG
-- =====================================================
INSERT INTO portal_products (sku, category, description, unit, price) VALUES
  ('WSE-1001TPO', 'Edge Metal', '3x3 Clad Metal Drip Edge — TPO', 'ea', 33.35),
  ('WSE-1001PVC', 'Edge Metal', '3x3 Clad Metal Drip Edge — PVC', 'ea', 34.5),
  ('WS-1001TPO', 'Pipe Boots & Flashings', '1-6" Conical Boot — TPO', 'ea', 24.38),
  ('WS-1001PVC', 'Pipe Boots & Flashings', '1-6" Conical Boot — PVC', 'ea', 26.22),
  ('WS-1006TPO', 'Pipe Boots & Flashings', '6-8" Conical Boot — TPO', 'ea', 32.89),
  ('WS-1006PVC', 'Pipe Boots & Flashings', '6-8" Conical Boot — PVC', 'ea', 34.15),
  ('WS-1008TPO', 'Pipe Boots & Flashings', '8-10" Conical Boot — TPO', 'ea', 35.36),
  ('WS-1008PVC', 'Pipe Boots & Flashings', '8-10" Conical Boot — PVC', 'ea', 37.78),
  ('WS-1011TPO', 'Pipe Boots & Flashings', '2" Pipe Flashing — TPO', 'ea', 23.17),
  ('WS-1011PVC', 'Pipe Boots & Flashings', '2" Pipe Flashing — PVC', 'ea', 27.43),
  ('WS-1013TPO', 'Pipe Boots & Flashings', '3" Pipe Flashing — TPO', 'ea', 25.59),
  ('WS-1013PVC', 'Pipe Boots & Flashings', '3" Pipe Flashing — PVC', 'ea', 28.63),
  ('WS-1015TPO', 'Pipe Boots & Flashings', '4" Vent Pipe Flashing — TPO', 'ea', 27.89),
  ('WS-1015PVC', 'Pipe Boots & Flashings', '4" Vent Pipe Flashing — PVC', 'ea', 30.19),
  ('WS-1017TPO', 'Pipe Boots & Flashings', '6" Vent Pipe Flashing — TPO', 'ea', 33.52),
  ('WS-1017PVC', 'Pipe Boots & Flashings', '6" Vent Pipe Flashing — PVC', 'ea', 34.73),
  ('WS-1020TPO', 'Pipe Boots & Flashings', '4" Square Wrap — TPO', 'ea', 31.11),
  ('WS-1020PVC', 'Pipe Boots & Flashings', '4" Square Wrap — PVC', 'ea', 32.31),
  ('WS-1022TPO', 'Pipe Boots & Flashings', '6" Square Wrap — TPO', 'ea', 31.97),
  ('WS-1022PVC', 'Pipe Boots & Flashings', '6" Square Wrap — PVC', 'ea', 34.44),
  ('WS-1002TPO', 'Pipe Boots & Flashings', '1-6" Split Conical Boot — TPO', 'ea', 27.14),
  ('WS-1002PVC', 'Pipe Boots & Flashings', '1-6" Split Conical Boot — PVC', 'ea', 29.27),
  ('WS-1005TPO', 'Pipe Boots & Flashings', 'Compact Split Conical Pipe Boot — TPO', 'ea', 23.17),
  ('WS-1005PVC', 'Pipe Boots & Flashings', 'Compact Split Conical Pipe Boot — PVC', 'ea', 25.01),
  ('WS-1007TPO', 'Pipe Boots & Flashings', '6-8" Split Conical Boot — TPO', 'ea', 35.36),
  ('WS-1007PVC', 'Pipe Boots & Flashings', '6-8" Split Conical Boot — PVC', 'ea', 36.57),
  ('WS-1009TPO', 'Pipe Boots & Flashings', '8-10" Split Conical Boot — TPO', 'ea', 36.57),
  ('WS-1009PVC', 'Pipe Boots & Flashings', '8-10" Split Conical Boot — PVC', 'ea', 37.78),
  ('WS-1010TPO', 'Pipe Boots & Flashings', '1.5" Split Pipe Flashing — TPO', 'ea', 23.17),
  ('WS-1010PVC', 'Pipe Boots & Flashings', '1.5" Split Pipe Flashing — PVC', 'ea', 26.22),
  ('WS-1012TPO', 'Pipe Boots & Flashings', '2" Split Pipe Flashing — TPO', 'ea', 23.75),
  ('WS-1012PVC', 'Pipe Boots & Flashings', '2" Split Pipe Flashing — PVC', 'ea', 28.63),
  ('WS-1014TPO', 'Pipe Boots & Flashings', '3" Split Pipe Flashing — TPO', 'ea', 26.22),
  ('WS-1014PVC', 'Pipe Boots & Flashings', '3" Split Pipe Flashing — PVC', 'ea', 30.19),
  ('WS-1016TPO', 'Pipe Boots & Flashings', '4" Split Pipe Flashing — TPO', 'ea', 28.35),
  ('WS-1016PVC', 'Pipe Boots & Flashings', '4" Split Pipe Flashing — PVC', 'ea', 31.11),
  ('WS-1018TPO', 'Pipe Boots & Flashings', '6" Split Vent Pipe Flashing — TPO', 'ea', 34.44),
  ('WS-1021TPO', 'Pipe Boots & Flashings', '4" Split Square Wrap — TPO', 'ea', 33.81),
  ('WS-1021PVC', 'Pipe Boots & Flashings', '4" Split Square Wrap — PVC', 'ea', 35.07),
  ('WS-1023TPO', 'Pipe Boots & Flashings', '6" Split Square Wrap — TPO', 'ea', 34.73),
  ('WS-1023PVC', 'Pipe Boots & Flashings', '6" Split Square Wrap — PVC', 'ea', 35.94),
  ('WS-1030', 'Drains', '9x9 Balcony Deck Drain - Bonderized (2" NPT Hub)', 'ea', 47.55),
  ('WS-1031', 'Drains', '9x9 Balcony Deck Drain - Copper (2" NPT Hub)', 'ea', 48.76),
  ('WS-1032', 'Drains', '9x9 Balcony Deck Drain - Copper (3" NPT Hub)', 'ea', 56.06),
  ('WS-1042', 'Drains', '9x9 Balcony Deck Drain - Bonderized (2" Std Hub)', 'ea', 46.34),
  ('WS-1043', 'Drains', '9x9 Balcony Deck Drain - Copper (2" Std Hub)', 'ea', 47.55),
  ('WS-1044', 'Drains', '9x9 Balcony Deck Drain - Copper (3" Std Hub)', 'ea', 53.65),
  ('WS-1033', 'Drains', '2" Copper Bowl Drain (2" Hub)', 'ea', 134.09),
  ('WS-1034', 'Drains', '3" Copper Bowl Drain (2" Hub)', 'ea', 164.56),
  ('WS-1035', 'Drains', '4" Copper Bowl Drain (2" Hub)', 'ea', 195.04),
  ('WS-1045', 'Drains', '2" Copper Bowl Drain w/ Overflow', 'ea', 219.42),
  ('WS-1046', 'Drains', '3" Copper Bowl Drain w/ Overflow', 'ea', 255.99),
  ('WS-1047', 'Drains', '4" Copper Bowl Drain w/ Overflow', 'ea', 298.65),
  ('WS-2001SS', 'Drains', '2" Deck Drain Stainless Steel', 'ea', 51.17),
  ('WS-2002SS', 'Drains', '3" Deck Drain Stainless Steel', 'ea', 54.85),
  ('WS-1036', 'Drains', '2" Bowl Drain — TPO', 'ea', 146.28),
  ('WS-1039', 'Drains', '2" Bowl Drain — PVC', 'ea', 152.38),
  ('WS-1037', 'Drains', '3" Bowl Drain — TPO', 'ea', 164.56),
  ('WS-1040', 'Drains', '3" Bowl Drain — PVC', 'ea', 170.66),
  ('WS-1038', 'Drains', '4" Bowl Drain — TPO', 'ea', 195.04),
  ('WS-1041', 'Drains', '4" Bowl Drain — PVC', 'ea', 201.13),
  ('WS-1048', 'Drains', '2" Bowl Drain w/ Overflow — TPO', 'ea', 204.81),
  ('WS-1051', 'Drains', '2" Bowl Drain w/ Overflow — PVC', 'ea', 207.23),
  ('WS-1049', 'Drains', '3" Bowl Drain w/ Overflow — TPO', 'ea', 230.4),
  ('WS-1052', 'Drains', '3" Bowl Drain w/ Overflow — PVC', 'ea', 232.82),
  ('WS-1050', 'Drains', '4" Bowl Drain w/ Overflow — TPO', 'ea', 271.86),
  ('WS-1053', 'Drains', '4" Bowl Drain w/ Overflow — PVC', 'ea', 286.46),
  ('WSD-1010TPO', 'Drains', '2" Drain Insert (SS) Retrofit — TPO', 'ea', 172.79),
  ('WSD-1010PVC', 'Drains', '2" Drain Insert (SS) Retrofit — PVC', 'ea', 174.34),
  ('WSD-1012TPO', 'Drains', '3" Drain Insert (SS) Retrofit — TPO', 'ea', 198.37),
  ('WSD-1012PVC', 'Drains', '3" Drain Insert (SS) Retrofit — PVC', 'ea', 190.15),
  ('WSD-1020TPO', 'Drains', '2" Bowl Drain (pricing-sheet) — TPO', 'ea', 164.85),
  ('WSD-1020PVC', 'Drains', '2" Bowl Drain (pricing-sheet) — PVC', 'ea', 168.82),
  ('WSD-1021TPO', 'Drains', '2" Bowl Drain Side Outlet — TPO', 'ea', 202.05),
  ('WSD-1021PVC', 'Drains', '2" Bowl Drain Side Outlet — PVC', 'ea', 204.81),
  ('WSD-1022TPO', 'Drains', '2" Bowl Drain w/ Overflow — TPO', 'ea', 204.81),
  ('WSD-1022PVC', 'Drains', '2" Bowl Drain w/ Overflow — PVC', 'ea', 207.23),
  ('WSD-1023TPO', 'Drains', '3" Bowl Drain (pricing-sheet) — TPO', 'ea', 179.17),
  ('WSD-1023PVC', 'Drains', '3" Bowl Drain (pricing-sheet) — PVC', 'ea', 181.64),
  ('WSD-1024TPO', 'Drains', '3" Bowl Drain Side Outlet — TPO', 'ea', 220.63),
  ('WSD-1024PVC', 'Drains', '3" Bowl Drain Side Outlet — PVC', 'ea', 227.64),
  ('WSD-1025TPO', 'Drains', '3" Bowl Drain w/ Overflow — TPO', 'ea', 230.4),
  ('WSD-1025PVC', 'Drains', '3" Bowl Drain w/ Overflow — PVC', 'ea', 232.82),
  ('WSD-1026TPO', 'Drains', '4" Bowl Drain (pricing-sheet) — TPO', 'ea', 249.89),
  ('WSD-1026PVC', 'Drains', '4" Bowl Drain (pricing-sheet) — PVC', 'ea', 262.08),
  ('WSD-1027TPO', 'Drains', '4" Bowl Drain Side Outlet — TPO', 'ea', 304.75),
  ('WSD-1027PVC', 'Drains', '4" Bowl Drain Side Outlet — PVC', 'ea', 316.94),
  ('WSD-1028TPO', 'Drains', '4" Bowl Drain w/ Overflow — TPO', 'ea', 316.94),
  ('WSD-1028PVC', 'Drains', '4" Bowl Drain w/ Overflow — PVC', 'ea', 335.22),
  ('WSD-1001TPO', 'Scuppers', '<10" Scupper Drain (combined total of 4 sides) — TPO', 'ea', 72.85),
  ('WSD-1001PVC', 'Scuppers', '<10" Scupper Drain (combined total of 4 sides) — PVC', 'ea', 75.55),
  ('WSD-1002TPO', 'Scuppers', '<16" Scupper Drain — TPO', 'ea', 80.44),
  ('WSD-1002PVC', 'Scuppers', '<16" Scupper Drain — PVC', 'ea', 83.83),
  ('WSD-1003TPO', 'Scuppers', '<24" Scupper Drain — TPO', 'ea', 85.62),
  ('WSD-1003PVC', 'Scuppers', '<24" Scupper Drain — PVC', 'ea', 87.46),
  ('WSD-1004TPO', 'Scuppers', '<27" Scupper Drain — TPO', 'ea', 87.46),
  ('WSD-1004PVC', 'Scuppers', '<27" Scupper Drain — PVC', 'ea', 89.01),
  ('WSD-1005TPO', 'Scuppers', '<34" Scupper Drain — TPO', 'ea', 89.58),
  ('WSD-1005PVC', 'Scuppers', '<34" Scupper Drain — PVC', 'ea', 92.06),
  ('WSG-1001TPO', 'Vents', '12" Gravity Vent — TPO', 'ea', 207.86),
  ('WSG-1001PVC', 'Vents', '12" Gravity Vent — PVC', 'ea', 215.11),
  ('WSG-1002TPO', 'Vents', '14" Gravity Vent — TPO', 'ea', 220.4),
  ('WSG-1002PVC', 'Vents', '14" Gravity Vent — PVC', 'ea', 226.66),
  ('WSG-1003TPO', 'Vents', '16" Gravity Vent — TPO', 'ea', 230.23),
  ('WSG-1003PVC', 'Vents', '16" Gravity Vent — PVC', 'ea', 227.93),
  ('WSG-1004TPO', 'Vents', '18" Gravity Vent — TPO', 'ea', 240.18),
  ('WSG-1004PVC', 'Vents', '18" Gravity Vent — PVC', 'ea', 246.44),
  ('WSG-1005TPO', 'Vents', '20" Gravity Vent — TPO', 'ea', 260.88),
  ('WSG-1005PVC', 'Vents', '20" Gravity Vent — PVC', 'ea', 264.84),
  ('WSG-1006TPO', 'Vents', '24" Gravity Vent — TPO', 'ea', 265.42),
  ('WSG-1006PVC', 'Vents', '24" Gravity Vent — PVC', 'ea', 272.15),
  ('WST-1001TPO', 'Vents', '4" T-Top Vent — TPO', 'ea', 56.06),
  ('WST-1001PVC', 'Vents', '4" T-Top Vent — PVC', 'ea', 57.33),
  ('WST-1002TPO', 'Vents', '6" T-Top Vent — TPO', 'ea', 60.03),
  ('WST-1002PVC', 'Vents', '6" T-Top Vent — PVC', 'ea', 61.24),
  ('WST-1003TPO', 'Vents', '8" T-Top Vent — TPO', 'ea', 72.85),
  ('WST-1003PVC', 'Vents', '8" T-Top Vent — PVC', 'ea', 74.06),
  ('WST-1004TPO', 'Vents', '4x12 Rectangular T-Top Vent — TPO', 'ea', 127.99),
  ('WST-1004PVC', 'Vents', '4x12 Rectangular T-Top Vent — PVC', 'ea', 134.38),
  ('WSV-1001TPO', 'Vents', '14x12 Gable Vent — TPO', 'ea', 125.23),
  ('WSV-1001PVC', 'Vents', '14x12 Gable Vent — PVC', 'ea', 125.23),
  ('WSV-1002TPO', 'Vents', '14x18 Gable Vent — TPO', 'ea', 134.38),
  ('WSV-1002PVC', 'Vents', '14x18 Gable Vent — PVC', 'ea', 134.38),
  ('WSV-1004TPO', 'Vents', '4" Breather Vent (One Way) — TPO', 'ea', 40.71),
  ('WSV-1004PVC', 'Vents', '4" Breather Vent (One Way) — PVC', 'ea', 41.97),
  ('WSV-1013TPO', 'Vents', '4" Breather Vent (Two Way) — TPO', 'ea', 34.15),
  ('WSV-1013PVC', 'Vents', '4" Breather Vent (Two Way) — PVC', 'ea', 35.36),
  ('WSV-1005TPO', 'Vents', '12" Turbine Roof Vent — TPO', 'ea', 162.9),
  ('WSV-1005PVC', 'Vents', '12" Turbine Roof Vent — PVC', 'ea', 164.16),
  ('WSV-1009TPO', 'Vents', '14" Turbine Roof Vent — TPO', 'ea', 174.28),
  ('WSV-1009PVC', 'Vents', '14" Turbine Roof Vent — PVC', 'ea', 175.55),
  ('WSV-1006TPO', 'Vents', '4" Wall Mount Flapper / Dryer Vent — TPO', 'ea', 97.23),
  ('WSV-1006PVC', 'Vents', '4" Wall Mount Flapper / Dryer Vent — PVC', 'ea', 99.65),
  ('WSP-1005TPO', 'Sealant Pockets & Ovals', '4" Sealant Pocket — TPO', 'ea', 36.28),
  ('WSP-1005PVC', 'Sealant Pockets & Ovals', '4" Sealant Pocket — PVC', 'ea', 38.98),
  ('WSP-1006TPO', 'Sealant Pockets & Ovals', '6" Sealant Pocket — TPO', 'ea', 45.42),
  ('WSP-1006PVC', 'Sealant Pockets & Ovals', '6" Sealant Pocket — PVC', 'ea', 47.84),
  ('WSP-1007TPO', 'Sealant Pockets & Ovals', '8" Sealant Pocket — TPO', 'ea', 55.49),
  ('WSP-1007PVC', 'Sealant Pockets & Ovals', '8" Sealant Pocket — PVC', 'ea', 57.61),
  ('WSV-1007TPO', 'Sealant Pockets & Ovals', '4" Oval Flashing w/ Sub Base — TPO', 'ea', 68.88),
  ('WSV-1007PVC', 'Sealant Pockets & Ovals', '4" Oval Flashing w/ Sub Base — PVC', 'ea', 70.15),
  ('WSV-1008TPO', 'Sealant Pockets & Ovals', '7" Oval Flashing w/ Sub Base — TPO', 'ea', 76.82),
  ('WSV-1008PVC', 'Sealant Pockets & Ovals', '7" Oval Flashing w/ Sub Base — PVC', 'ea', 80.44),
  ('WSA-1018', 'Corners & Accessories', 'Solar Anchor Boot — TPO', 'ea', 23.17),
  ('WSA-1019', 'Corners & Accessories', 'Solar Anchor Boot — PVC', 'ea', 23.17),
  ('WSA-1001TPO', 'Corners & Accessories', '3.5" Injection-Molded Outside Corner (White) — TPO', 'ea', 4.43),
  ('WSA-1001PVC', 'Corners & Accessories', '3.5" Injection-Molded Outside Corner (White) — PVC', 'ea', 5.12),
  ('WSA-1002TPO', 'Corners & Accessories', '6" Non-Reinforced Outside Corner — TPO', 'ea', 9.26),
  ('WSA-1002PVC', 'Corners & Accessories', '6" Non-Reinforced Outside Corner — PVC', 'ea', 10.23),
  ('WSA-1003TPO', 'Corners & Accessories', '6" Non-Reinforced Inside Corner — TPO', 'ea', 9.26),
  ('WSA-1003PVC', 'Corners & Accessories', '6" Non-Reinforced Inside Corner — PVC', 'ea', 10.23),
  ('WSA-1004TPO', 'Corners & Accessories', '4.5" T-Joint Cover (100 pc) — TPO', 'ea', 118.97),
  ('WSA-1004PVC', 'Corners & Accessories', '4.5" T-Joint Cover (100 pc) — PVC', 'ea', 120.23),
  ('WSA-1010', 'Corners & Accessories', 'Rubber Coupler 2"', 'ea', 6.61),
  ('WSA-1011', 'Corners & Accessories', 'Rubber Coupler 3"', 'ea', 8.22),
  ('WSA-1008', 'Corners & Accessories', 'Clamp (1-6")', 'ea', 2.76),
  ('WSA-1014', 'Corners & Accessories', 'Hose Clamps 1.5"-2.5"', 'ea', 2.42),
  ('WSA-1013', 'Corners & Accessories', 'Clamp (1/2"-1.5")', 'ea', 2.36),
  ('WSA-1017', 'Corners & Accessories', 'Flat Roof Attachment', 'ea', 34.15)
ON CONFLICT (sku) DO UPDATE SET category=EXCLUDED.category, description=EXCLUDED.description, unit=EXCLUDED.unit, price=EXCLUDED.price, active=true;

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
