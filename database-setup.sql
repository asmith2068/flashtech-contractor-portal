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
  ('WSE-1001TPO', 'Edge Metal', '3x3 Clad Metal Drip Edge — TPO', 'ea', 29.0),
  ('WSE-1001PVC', 'Edge Metal', '3x3 Clad Metal Drip Edge — PVC', 'ea', 30.0),
  ('WS-1001TPO', 'Pipe Boots & Flashings', '1-6" Conical Boot — TPO', 'ea', 21.2),
  ('WS-1001PVC', 'Pipe Boots & Flashings', '1-6" Conical Boot — PVC', 'ea', 22.8),
  ('WS-1006TPO', 'Pipe Boots & Flashings', '6-8" Conical Boot — TPO', 'ea', 28.6),
  ('WS-1006PVC', 'Pipe Boots & Flashings', '6-8" Conical Boot — PVC', 'ea', 29.7),
  ('WS-1008TPO', 'Pipe Boots & Flashings', '8-10" Conical Boot — TPO', 'ea', 30.75),
  ('WS-1008PVC', 'Pipe Boots & Flashings', '8-10" Conical Boot — PVC', 'ea', 32.85),
  ('WS-1011TPO', 'Pipe Boots & Flashings', '2" Pipe Flashing — TPO', 'ea', 20.15),
  ('WS-1011PVC', 'Pipe Boots & Flashings', '2" Pipe Flashing — PVC', 'ea', 23.85),
  ('WS-1013TPO', 'Pipe Boots & Flashings', '3" Pipe Flashing — TPO', 'ea', 22.25),
  ('WS-1013PVC', 'Pipe Boots & Flashings', '3" Pipe Flashing — PVC', 'ea', 24.9),
  ('WS-1015TPO', 'Pipe Boots & Flashings', '4" Vent Pipe Flashing — TPO', 'ea', 24.25),
  ('WS-1015PVC', 'Pipe Boots & Flashings', '4" Vent Pipe Flashing — PVC', 'ea', 26.25),
  ('WS-1017TPO', 'Pipe Boots & Flashings', '6" Vent Pipe Flashing — TPO', 'ea', 29.15),
  ('WS-1017PVC', 'Pipe Boots & Flashings', '6" Vent Pipe Flashing — PVC', 'ea', 30.2),
  ('WS-1020TPO', 'Pipe Boots & Flashings', '4" Square Wrap — TPO', 'ea', 27.05),
  ('WS-1020PVC', 'Pipe Boots & Flashings', '4" Square Wrap — PVC', 'ea', 28.1),
  ('WS-1022TPO', 'Pipe Boots & Flashings', '6" Square Wrap — TPO', 'ea', 27.8),
  ('WS-1022PVC', 'Pipe Boots & Flashings', '6" Square Wrap — PVC', 'ea', 29.95),
  ('WS-1002TPO', 'Pipe Boots & Flashings', '1-6" Split Conical Boot — TPO', 'ea', 23.6),
  ('WS-1002PVC', 'Pipe Boots & Flashings', '1-6" Split Conical Boot — PVC', 'ea', 25.45),
  ('WS-1005TPO', 'Pipe Boots & Flashings', 'Compact Split Conical Pipe Boot — TPO', 'ea', 20.15),
  ('WS-1005PVC', 'Pipe Boots & Flashings', 'Compact Split Conical Pipe Boot — PVC', 'ea', 21.75),
  ('WS-1007TPO', 'Pipe Boots & Flashings', '6-8" Split Conical Boot — TPO', 'ea', 30.75),
  ('WS-1007PVC', 'Pipe Boots & Flashings', '6-8" Split Conical Boot — PVC', 'ea', 31.8),
  ('WS-1009TPO', 'Pipe Boots & Flashings', '8-10" Split Conical Boot — TPO', 'ea', 31.8),
  ('WS-1009PVC', 'Pipe Boots & Flashings', '8-10" Split Conical Boot — PVC', 'ea', 32.85),
  ('WS-1010TPO', 'Pipe Boots & Flashings', '1.5" Split Pipe Flashing — TPO', 'ea', 20.15),
  ('WS-1010PVC', 'Pipe Boots & Flashings', '1.5" Split Pipe Flashing — PVC', 'ea', 22.8),
  ('WS-1012TPO', 'Pipe Boots & Flashings', '2" Split Pipe Flashing — TPO', 'ea', 20.65),
  ('WS-1012PVC', 'Pipe Boots & Flashings', '2" Split Pipe Flashing — PVC', 'ea', 24.9),
  ('WS-1014TPO', 'Pipe Boots & Flashings', '3" Split Pipe Flashing — TPO', 'ea', 22.8),
  ('WS-1014PVC', 'Pipe Boots & Flashings', '3" Split Pipe Flashing — PVC', 'ea', 26.25),
  ('WS-1016TPO', 'Pipe Boots & Flashings', '4" Split Pipe Flashing — TPO', 'ea', 24.65),
  ('WS-1016PVC', 'Pipe Boots & Flashings', '4" Split Pipe Flashing — PVC', 'ea', 27.05),
  ('WS-1018TPO', 'Pipe Boots & Flashings', '6" Split Vent Pipe Flashing — TPO', 'ea', 29.95),
  ('WS-1021TPO', 'Pipe Boots & Flashings', '4" Split Square Wrap — TPO', 'ea', 29.4),
  ('WS-1021PVC', 'Pipe Boots & Flashings', '4" Split Square Wrap — PVC', 'ea', 30.5),
  ('WS-1023TPO', 'Pipe Boots & Flashings', '6" Split Square Wrap — TPO', 'ea', 30.2),
  ('WS-1023PVC', 'Pipe Boots & Flashings', '6" Split Square Wrap — PVC', 'ea', 31.25),
  ('WS-1030', 'Drains', '9x9 Balcony Deck Drain - Bonderized (2" NPT Hub)', 'ea', 41.35),
  ('WS-1031', 'Drains', '9x9 Balcony Deck Drain - Copper (2" NPT Hub)', 'ea', 42.4),
  ('WS-1032', 'Drains', '9x9 Balcony Deck Drain - Copper (3" NPT Hub)', 'ea', 48.75),
  ('WS-1042', 'Drains', '9x9 Balcony Deck Drain - Bonderized (2" Std Hub)', 'ea', 40.3),
  ('WS-1043', 'Drains', '9x9 Balcony Deck Drain - Copper (2" Std Hub)', 'ea', 41.35),
  ('WS-1044', 'Drains', '9x9 Balcony Deck Drain - Copper (3" Std Hub)', 'ea', 46.65),
  ('WS-1033', 'Drains', '2" Copper Bowl Drain (2" Hub)', 'ea', 116.6),
  ('WS-1034', 'Drains', '3" Copper Bowl Drain (2" Hub)', 'ea', 143.1),
  ('WS-1035', 'Drains', '4" Copper Bowl Drain (2" Hub)', 'ea', 169.6),
  ('WS-1045', 'Drains', '2" Copper Bowl Drain w/ Overflow', 'ea', 190.8),
  ('WS-1046', 'Drains', '3" Copper Bowl Drain w/ Overflow', 'ea', 222.6),
  ('WS-1047', 'Drains', '4" Copper Bowl Drain w/ Overflow', 'ea', 259.7),
  ('WS-2001SS', 'Drains', '2" Deck Drain Stainless Steel', 'ea', 44.5),
  ('WS-2002SS', 'Drains', '3" Deck Drain Stainless Steel', 'ea', 47.7),
  ('WS-1036', 'Drains', '2" Bowl Drain — TPO', 'ea', 127.2),
  ('WS-1039', 'Drains', '2" Bowl Drain — PVC', 'ea', 132.5),
  ('WS-1037', 'Drains', '3" Bowl Drain — TPO', 'ea', 143.1),
  ('WS-1040', 'Drains', '3" Bowl Drain — PVC', 'ea', 148.4),
  ('WS-1038', 'Drains', '4" Bowl Drain — TPO', 'ea', 169.6),
  ('WS-1041', 'Drains', '4" Bowl Drain — PVC', 'ea', 174.9),
  ('WS-1048', 'Drains', '2" Bowl Drain w/ Overflow — TPO', 'ea', 178.1),
  ('WS-1051', 'Drains', '2" Bowl Drain w/ Overflow — PVC', 'ea', 180.2),
  ('WS-1049', 'Drains', '3" Bowl Drain w/ Overflow — TPO', 'ea', 200.35),
  ('WS-1052', 'Drains', '3" Bowl Drain w/ Overflow — PVC', 'ea', 202.45),
  ('WS-1050', 'Drains', '4" Bowl Drain w/ Overflow — TPO', 'ea', 236.4),
  ('WS-1053', 'Drains', '4" Bowl Drain w/ Overflow — PVC', 'ea', 249.1),
  ('WSD-1010TPO', 'Drains', '2" Drain Insert (SS) Retrofit — TPO', 'ea', 150.25),
  ('WSD-1010PVC', 'Drains', '2" Drain Insert (SS) Retrofit — PVC', 'ea', 151.6),
  ('WSD-1012TPO', 'Drains', '3" Drain Insert (SS) Retrofit — TPO', 'ea', 172.5),
  ('WSD-1012PVC', 'Drains', '3" Drain Insert (SS) Retrofit — PVC', 'ea', 165.35),
  ('WSD-1020TPO', 'Drains', '2" Bowl Drain (pricing-sheet) — TPO', 'ea', 143.35),
  ('WSD-1020PVC', 'Drains', '2" Bowl Drain (pricing-sheet) — PVC', 'ea', 146.8),
  ('WSD-1021TPO', 'Drains', '2" Bowl Drain Side Outlet — TPO', 'ea', 175.7),
  ('WSD-1021PVC', 'Drains', '2" Bowl Drain Side Outlet — PVC', 'ea', 178.1),
  ('WSD-1022TPO', 'Drains', '2" Bowl Drain w/ Overflow — TPO', 'ea', 178.1),
  ('WSD-1022PVC', 'Drains', '2" Bowl Drain w/ Overflow — PVC', 'ea', 180.2),
  ('WSD-1023TPO', 'Drains', '3" Bowl Drain (pricing-sheet) — TPO', 'ea', 155.8),
  ('WSD-1023PVC', 'Drains', '3" Bowl Drain (pricing-sheet) — PVC', 'ea', 157.95),
  ('WSD-1024TPO', 'Drains', '3" Bowl Drain Side Outlet — TPO', 'ea', 191.85),
  ('WSD-1024PVC', 'Drains', '3" Bowl Drain Side Outlet — PVC', 'ea', 197.95),
  ('WSD-1025TPO', 'Drains', '3" Bowl Drain w/ Overflow — TPO', 'ea', 200.35),
  ('WSD-1025PVC', 'Drains', '3" Bowl Drain w/ Overflow — PVC', 'ea', 202.45),
  ('WSD-1026TPO', 'Drains', '4" Bowl Drain (pricing-sheet) — TPO', 'ea', 217.3),
  ('WSD-1026PVC', 'Drains', '4" Bowl Drain (pricing-sheet) — PVC', 'ea', 227.9),
  ('WSD-1027TPO', 'Drains', '4" Bowl Drain Side Outlet — TPO', 'ea', 265.0),
  ('WSD-1027PVC', 'Drains', '4" Bowl Drain Side Outlet — PVC', 'ea', 275.6),
  ('WSD-1028TPO', 'Drains', '4" Bowl Drain w/ Overflow — TPO', 'ea', 275.6),
  ('WSD-1028PVC', 'Drains', '4" Bowl Drain w/ Overflow — PVC', 'ea', 291.5),
  ('WSD-1001TPO', 'Scuppers', '<10" Scupper Drain (combined total of 4 sides) — TPO', 'ea', 63.35),
  ('WSD-1001PVC', 'Scuppers', '<10" Scupper Drain (combined total of 4 sides) — PVC', 'ea', 65.7),
  ('WSD-1002TPO', 'Scuppers', '<16" Scupper Drain — TPO', 'ea', 69.95),
  ('WSD-1002PVC', 'Scuppers', '<16" Scupper Drain — PVC', 'ea', 72.9),
  ('WSD-1003TPO', 'Scuppers', '<24" Scupper Drain — TPO', 'ea', 74.45),
  ('WSD-1003PVC', 'Scuppers', '<24" Scupper Drain — PVC', 'ea', 76.05),
  ('WSD-1004TPO', 'Scuppers', '<27" Scupper Drain — TPO', 'ea', 76.05),
  ('WSD-1004PVC', 'Scuppers', '<27" Scupper Drain — PVC', 'ea', 77.4),
  ('WSD-1005TPO', 'Scuppers', '<34" Scupper Drain — TPO', 'ea', 77.9),
  ('WSD-1005PVC', 'Scuppers', '<34" Scupper Drain — PVC', 'ea', 80.05),
  ('WSG-1001TPO', 'Vents', '12" Gravity Vent — TPO', 'ea', 180.75),
  ('WSG-1001PVC', 'Vents', '12" Gravity Vent — PVC', 'ea', 187.05),
  ('WSG-1002TPO', 'Vents', '14" Gravity Vent — TPO', 'ea', 191.65),
  ('WSG-1002PVC', 'Vents', '14" Gravity Vent — PVC', 'ea', 197.1),
  ('WSG-1003TPO', 'Vents', '16" Gravity Vent — TPO', 'ea', 200.2),
  ('WSG-1003PVC', 'Vents', '16" Gravity Vent — PVC', 'ea', 198.2),
  ('WSG-1004TPO', 'Vents', '18" Gravity Vent — TPO', 'ea', 208.85),
  ('WSG-1004PVC', 'Vents', '18" Gravity Vent — PVC', 'ea', 214.3),
  ('WSG-1005TPO', 'Vents', '20" Gravity Vent — TPO', 'ea', 226.85),
  ('WSG-1005PVC', 'Vents', '20" Gravity Vent — PVC', 'ea', 230.3),
  ('WSG-1006TPO', 'Vents', '24" Gravity Vent — TPO', 'ea', 230.8),
  ('WSG-1006PVC', 'Vents', '24" Gravity Vent — PVC', 'ea', 236.65),
  ('WST-1001TPO', 'Vents', '4" T-Top Vent — TPO', 'ea', 48.75),
  ('WST-1001PVC', 'Vents', '4" T-Top Vent — PVC', 'ea', 49.85),
  ('WST-1002TPO', 'Vents', '6" T-Top Vent — TPO', 'ea', 52.2),
  ('WST-1002PVC', 'Vents', '6" T-Top Vent — PVC', 'ea', 53.25),
  ('WST-1003TPO', 'Vents', '8" T-Top Vent — TPO', 'ea', 63.35),
  ('WST-1003PVC', 'Vents', '8" T-Top Vent — PVC', 'ea', 64.4),
  ('WST-1004TPO', 'Vents', '4x12 Rectangular T-Top Vent — TPO', 'ea', 111.3),
  ('WST-1004PVC', 'Vents', '4x12 Rectangular T-Top Vent — PVC', 'ea', 116.85),
  ('WSV-1001TPO', 'Vents', '14x12 Gable Vent — TPO', 'ea', 108.9),
  ('WSV-1001PVC', 'Vents', '14x12 Gable Vent — PVC', 'ea', 108.9),
  ('WSV-1002TPO', 'Vents', '14x18 Gable Vent — TPO', 'ea', 116.85),
  ('WSV-1002PVC', 'Vents', '14x18 Gable Vent — PVC', 'ea', 116.85),
  ('WSV-1004TPO', 'Vents', '4" Breather Vent (One Way) — TPO', 'ea', 35.4),
  ('WSV-1004PVC', 'Vents', '4" Breather Vent (One Way) — PVC', 'ea', 36.5),
  ('WSV-1013TPO', 'Vents', '4" Breather Vent (Two Way) — TPO', 'ea', 29.7),
  ('WSV-1013PVC', 'Vents', '4" Breather Vent (Two Way) — PVC', 'ea', 30.75),
  ('WSV-1005TPO', 'Vents', '12" Turbine Roof Vent — TPO', 'ea', 141.65),
  ('WSV-1005PVC', 'Vents', '12" Turbine Roof Vent — PVC', 'ea', 142.75),
  ('WSV-1009TPO', 'Vents', '14" Turbine Roof Vent — TPO', 'ea', 151.55),
  ('WSV-1009PVC', 'Vents', '14" Turbine Roof Vent — PVC', 'ea', 152.65),
  ('WSV-1006TPO', 'Vents', '4" Wall Mount Flapper / Dryer Vent — TPO', 'ea', 84.55),
  ('WSV-1006PVC', 'Vents', '4" Wall Mount Flapper / Dryer Vent — PVC', 'ea', 86.65),
  ('WSP-1005TPO', 'Sealant Pockets & Ovals', '4" Sealant Pocket — TPO', 'ea', 31.55),
  ('WSP-1005PVC', 'Sealant Pockets & Ovals', '4" Sealant Pocket — PVC', 'ea', 33.9),
  ('WSP-1006TPO', 'Sealant Pockets & Ovals', '6" Sealant Pocket — TPO', 'ea', 39.5),
  ('WSP-1006PVC', 'Sealant Pockets & Ovals', '6" Sealant Pocket — PVC', 'ea', 41.6),
  ('WSP-1007TPO', 'Sealant Pockets & Ovals', '8" Sealant Pocket — TPO', 'ea', 48.25),
  ('WSP-1007PVC', 'Sealant Pockets & Ovals', '8" Sealant Pocket — PVC', 'ea', 50.1),
  ('WSV-1007TPO', 'Sealant Pockets & Ovals', '4" Oval Flashing w/ Sub Base — TPO', 'ea', 59.9),
  ('WSV-1007PVC', 'Sealant Pockets & Ovals', '4" Oval Flashing w/ Sub Base — PVC', 'ea', 61.0),
  ('WSV-1008TPO', 'Sealant Pockets & Ovals', '7" Oval Flashing w/ Sub Base — TPO', 'ea', 66.8),
  ('WSV-1008PVC', 'Sealant Pockets & Ovals', '7" Oval Flashing w/ Sub Base — PVC', 'ea', 69.95),
  ('WSA-1018', 'Corners & Accessories', 'Solar Anchor Boot — TPO', 'ea', 20.15),
  ('WSA-1019', 'Corners & Accessories', 'Solar Anchor Boot — PVC', 'ea', 20.15),
  ('WSA-1001TPO', 'Corners & Accessories', '3.5" Injection-Molded Outside Corner (White) — TPO', 'ea', 3.85),
  ('WSA-1001PVC', 'Corners & Accessories', '3.5" Injection-Molded Outside Corner (White) — PVC', 'ea', 4.45),
  ('WSA-1002TPO', 'Corners & Accessories', '6" Non-Reinforced Outside Corner — TPO', 'ea', 8.05),
  ('WSA-1002PVC', 'Corners & Accessories', '6" Non-Reinforced Outside Corner — PVC', 'ea', 8.9),
  ('WSA-1003TPO', 'Corners & Accessories', '6" Non-Reinforced Inside Corner — TPO', 'ea', 8.05),
  ('WSA-1003PVC', 'Corners & Accessories', '6" Non-Reinforced Inside Corner — PVC', 'ea', 8.9),
  ('WSA-1004TPO', 'Corners & Accessories', '4.5" T-Joint Cover (100 pc) — TPO', 'ea', 103.45),
  ('WSA-1004PVC', 'Corners & Accessories', '4.5" T-Joint Cover (100 pc) — PVC', 'ea', 104.55),
  ('WSA-1010', 'Corners & Accessories', 'Rubber Coupler 2"', 'ea', 5.75),
  ('WSA-1011', 'Corners & Accessories', 'Rubber Coupler 3"', 'ea', 7.15),
  ('WSA-1008', 'Corners & Accessories', 'Clamp (1-6")', 'ea', 2.4),
  ('WSA-1014', 'Corners & Accessories', 'Hose Clamps 1.5"-2.5"', 'ea', 2.1),
  ('WSA-1013', 'Corners & Accessories', 'Clamp (1/2"-1.5")', 'ea', 2.05),
  ('WSA-1017', 'Corners & Accessories', 'Flat Roof Attachment', 'ea', 29.7)
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
