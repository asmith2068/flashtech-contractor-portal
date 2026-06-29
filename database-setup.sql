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
  ('andrew',  '64502d55e7e89f45383c0e29ec9c4ae1826da6a5fcd7122b69c1cc2ba059140c', 'Andrew', 'Flash-Tech Mfg, Inc.', 'admin'),
  ('tiffany', '64502d55e7e89f45383c0e29ec9c4ae1826da6a5fcd7122b69c1cc2ba059140c', 'Tiffany Cook', 'Flash-Tech Mfg, Inc.', 'admin'),
  ('lex',     '64502d55e7e89f45383c0e29ec9c4ae1826da6a5fcd7122b69c1cc2ba059140c', 'Lex', 'Flash-Tech Mfg, Inc.', 'admin'),
  ('marissa', '64502d55e7e89f45383c0e29ec9c4ae1826da6a5fcd7122b69c1cc2ba059140c', 'Marissa', 'Flash-Tech Mfg, Inc.', 'admin')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- SEED THE PARTS CATALOG
-- =====================================================
INSERT INTO portal_products (sku, category, description, unit, price) VALUES
  ('FTE-1001PVC', 'Edge Metal', '3x3 Clad Metal Drip Edge — PVC', 'ea', 39.67),
  ('FTE-1001TPO', 'Edge Metal', '3x3 Clad Metal Drip Edge — TPO', 'ea', 38.35),
  ('FT-1001PVC', 'Pipe Boots & Flashings', '1-6" Conical Boot — PVC', 'ea', 30.15),
  ('FT-1001TPO', 'Pipe Boots & Flashings', '1-6" Conical Boot — TPO', 'ea', 28.04),
  ('FT-1002PVC', 'Pipe Boots & Flashings', '1-6" Split Conical Boot — PVC', 'ea', 33.66),
  ('FT-1002TPO', 'Pipe Boots & Flashings', '1-6" Split Conical Boot — TPO', 'ea', 31.21),
  ('FT-1005PVC', 'Pipe Boots & Flashings', 'Compact Split Conical Pipe Boot — PVC', 'ea', 28.76),
  ('FT-1005TPO', 'Pipe Boots & Flashings', 'Compact Split Conical Pipe Boot — TPO', 'ea', 26.65),
  ('FT-1006PVC', 'Pipe Boots & Flashings', '6-8" Conical Boot — PVC', 'ea', 39.27),
  ('FT-1006TPO', 'Pipe Boots & Flashings', '6-8" Conical Boot — TPO', 'ea', 37.82),
  ('FT-1007PVC', 'Pipe Boots & Flashings', '6-8" Split Conical Boot — PVC', 'ea', 42.06),
  ('FT-1007TPO', 'Pipe Boots & Flashings', '6-8" Split Conical Boot — TPO', 'ea', 40.66),
  ('FT-1008PVC', 'Pipe Boots & Flashings', '8-10" Conical Boot — PVC', 'ea', 43.45),
  ('FT-1008TPO', 'Pipe Boots & Flashings', '8-10" Conical Boot — TPO', 'ea', 40.66),
  ('FT-1009PVC', 'Pipe Boots & Flashings', '8-10" Split Conical Boot — PVC', 'ea', 43.45),
  ('FT-1009TPO', 'Pipe Boots & Flashings', '8-10" Split Conical Boot — TPO', 'ea', 42.06),
  ('FT-1010PVC', 'Pipe Boots & Flashings', '1.5" Split Pipe Flashing — PVC', 'ea', 30.15),
  ('FT-1010TPO', 'Pipe Boots & Flashings', '1.5" Split Pipe Flashing — TPO', 'ea', 26.65),
  ('FT-1011PVC', 'Pipe Boots & Flashings', '2" Pipe Flashing — PVC', 'ea', 31.54),
  ('FT-1011TPO', 'Pipe Boots & Flashings', '2" Pipe Flashing — TPO', 'ea', 26.65),
  ('FT-1012PVC', 'Pipe Boots & Flashings', '2" Split Pipe Flashing — PVC', 'ea', 32.92),
  ('FT-1012TPO', 'Pipe Boots & Flashings', '2" Split Pipe Flashing — TPO', 'ea', 27.31),
  ('FT-1013PVC', 'Pipe Boots & Flashings', '3" Pipe Flashing — PVC', 'ea', 32.92),
  ('FT-1013TPO', 'Pipe Boots & Flashings', '3" Pipe Flashing — TPO', 'ea', 29.43),
  ('FT-1014PVC', 'Pipe Boots & Flashings', '3" Split Pipe Flashing — PVC', 'ea', 34.72),
  ('FT-1014TPO', 'Pipe Boots & Flashings', '3" Split Pipe Flashing — TPO', 'ea', 30.15),
  ('FT-1015PVC', 'Pipe Boots & Flashings', '4" Vent Pipe Flashing — PVC', 'ea', 34.72),
  ('FT-1015TPO', 'Pipe Boots & Flashings', '4" Vent Pipe Flashing — TPO', 'ea', 32.07),
  ('FT-1016PVC', 'Pipe Boots & Flashings', '4" Split Pipe Flashing — PVC', 'ea', 35.78),
  ('FT-1016TPO', 'Pipe Boots & Flashings', '4" Split Pipe Flashing — TPO', 'ea', 32.6),
  ('FT-1017PVC', 'Pipe Boots & Flashings', '6" Vent Pipe Flashing — PVC', 'ea', 39.94),
  ('FT-1017TPO', 'Pipe Boots & Flashings', '6" Vent Pipe Flashing — TPO', 'ea', 38.55),
  ('FT-1018TPO', 'Pipe Boots & Flashings', '6" Split Vent Pipe Flashing — TPO', 'ea', 39.61),
  ('FT-1020PVC', 'Pipe Boots & Flashings', '4" Square Wrap — PVC', 'ea', 37.16),
  ('FT-1020TPO', 'Pipe Boots & Flashings', '4" Square Wrap — TPO', 'ea', 35.78),
  ('FT-1021PVC', 'Pipe Boots & Flashings', '4" Split Square Wrap — PVC', 'ea', 40.33),
  ('FT-1021TPO', 'Pipe Boots & Flashings', '4" Split Square Wrap — TPO', 'ea', 38.88),
  ('FT-1022PVC', 'Pipe Boots & Flashings', '6" Square Wrap — PVC', 'ea', 39.61),
  ('FT-1022TPO', 'Pipe Boots & Flashings', '6" Square Wrap — TPO', 'ea', 36.77),
  ('FT-1023PVC', 'Pipe Boots & Flashings', '6" Split Square Wrap — PVC', 'ea', 41.33),
  ('FT-1023TPO', 'Pipe Boots & Flashings', '6" Split Square Wrap — TPO', 'ea', 39.94),
  ('FT-1030', 'Drains', '9x9 Balcony Deck Drain - Bonderized (2" NPT Hub)', 'ea', 54.68),
  ('FT-1031', 'Drains', '9x9 Balcony Deck Drain - Copper (2" NPT Hub)', 'ea', 56.07),
  ('FT-1032', 'Drains', '9x9 Balcony Deck Drain - Copper (3" NPT Hub)', 'ea', 64.47),
  ('FT-1033', 'Drains', '2" Copper Bowl Drain (2" Hub)', 'ea', 154.2),
  ('FT-1034', 'Drains', '3" Copper Bowl Drain (2" Hub)', 'ea', 189.24),
  ('FT-1035', 'Drains', '4" Copper Bowl Drain (2" Hub)', 'ea', 224.3),
  ('FT-1036', 'Drains', '2" Bowl Drain — TPO', 'ea', 168.22),
  ('FT-1037', 'Drains', '3" Bowl Drain — TPO', 'ea', 189.24),
  ('FT-1038', 'Drains', '4" Bowl Drain — TPO', 'ea', 224.3),
  ('FT-1039', 'Drains', '2" Bowl Drain — PVC', 'ea', 175.24),
  ('FT-1040', 'Drains', '3" Bowl Drain — PVC', 'ea', 196.26),
  ('FT-1041', 'Drains', '4" Bowl Drain — PVC', 'ea', 231.3),
  ('FT-1042', 'Drains', '9x9 Balcony Deck Drain - Bonderized (2" Std Hub)', 'ea', 53.29),
  ('FT-1043', 'Drains', '9x9 Balcony Deck Drain - Copper (2" Std Hub)', 'ea', 54.68),
  ('FT-1044', 'Drains', '9x9 Balcony Deck Drain - Copper (3" Std Hub)', 'ea', 61.7),
  ('FT-1045', 'Drains', '2" Copper Bowl Drain w/ Overflow', 'ea', 252.33),
  ('FT-1046', 'Drains', '3" Copper Bowl Drain w/ Overflow', 'ea', 294.39),
  ('FT-1047', 'Drains', '4" Copper Bowl Drain w/ Overflow', 'ea', 343.45),
  ('FT-1048', 'Drains', '2" Bowl Drain w/ Overflow — TPO', 'ea', 235.53),
  ('FT-1049', 'Drains', '3" Bowl Drain w/ Overflow — TPO', 'ea', 264.96),
  ('FT-1050', 'Drains', '4" Bowl Drain w/ Overflow — TPO', 'ea', 312.64),
  ('FT-1051', 'Drains', '2" Bowl Drain w/ Overflow — PVC', 'ea', 238.31),
  ('FT-1052', 'Drains', '3" Bowl Drain w/ Overflow — PVC', 'ea', 267.74),
  ('FT-1053', 'Drains', '4" Bowl Drain w/ Overflow — PVC', 'ea', 329.43),
  ('FT-2001SS', 'Drains', '2" Deck Drain Stainless Steel', 'ea', 58.85),
  ('FT-2002SS', 'Drains', '3" Deck Drain Stainless Steel', 'ea', 63.08),
  ('FTD-1010PVC', 'Drains', '2" Drain Insert (SS) Retrofit — PVC', 'ea', 200.49),
  ('FTD-1010TPO', 'Drains', '2" Drain Insert (SS) Retrofit — TPO', 'ea', 198.71),
  ('FTD-1012PVC', 'Drains', '3" Drain Insert (SS) Retrofit — PVC', 'ea', 218.67),
  ('FTD-1012TPO', 'Drains', '3" Drain Insert (SS) Retrofit — TPO', 'ea', 228.13),
  ('FTD-1020PVC', 'Drains', '2" Bowl Drain (pricing-sheet) — PVC', 'ea', 194.14),
  ('FTD-1020TPO', 'Drains', '2" Bowl Drain (pricing-sheet) — TPO', 'ea', 189.58),
  ('FTD-1021PVC', 'Drains', '2" Bowl Drain Side Outlet — PVC', 'ea', 235.53),
  ('FTD-1021TPO', 'Drains', '2" Bowl Drain Side Outlet — TPO', 'ea', 232.36),
  ('FTD-1022PVC', 'Drains', '2" Bowl Drain w/ Overflow — PVC', 'ea', 238.31),
  ('FTD-1022TPO', 'Drains', '2" Bowl Drain w/ Overflow — TPO', 'ea', 235.53),
  ('FTD-1023PVC', 'Drains', '3" Bowl Drain (pricing-sheet) — PVC', 'ea', 208.89),
  ('FTD-1023TPO', 'Drains', '3" Bowl Drain (pricing-sheet) — TPO', 'ea', 206.05),
  ('FTD-1024PVC', 'Drains', '3" Bowl Drain Side Outlet — PVC', 'ea', 261.79),
  ('FTD-1024TPO', 'Drains', '3" Bowl Drain Side Outlet — TPO', 'ea', 253.72),
  ('FTD-1025PVC', 'Drains', '3" Bowl Drain w/ Overflow — PVC', 'ea', 267.74),
  ('FTD-1025TPO', 'Drains', '3" Bowl Drain w/ Overflow — TPO', 'ea', 264.96),
  ('FTD-1026PVC', 'Drains', '4" Bowl Drain (pricing-sheet) — PVC', 'ea', 301.39),
  ('FTD-1026TPO', 'Drains', '4" Bowl Drain (pricing-sheet) — TPO', 'ea', 287.37),
  ('FTD-1027PVC', 'Drains', '4" Bowl Drain Side Outlet — PVC', 'ea', 364.48),
  ('FTD-1027TPO', 'Drains', '4" Bowl Drain Side Outlet — TPO', 'ea', 350.46),
  ('FTD-1028PVC', 'Drains', '4" Bowl Drain w/ Overflow — PVC', 'ea', 385.5),
  ('FTD-1028TPO', 'Drains', '4" Bowl Drain w/ Overflow — TPO', 'ea', 364.48),
  ('FTD-1001PVC', 'Scuppers', '<10" Scupper Drain (combined total of 4 sides) — PVC', 'ea', 86.88),
  ('FTD-1001TPO', 'Scuppers', '<10" Scupper Drain (combined total of 4 sides) — TPO', 'ea', 83.78),
  ('FTD-1002PVC', 'Scuppers', '<16" Scupper Drain — PVC', 'ea', 96.4),
  ('FTD-1002TPO', 'Scuppers', '<16" Scupper Drain — TPO', 'ea', 92.51),
  ('FTD-1003PVC', 'Scuppers', '<24" Scupper Drain — PVC', 'ea', 100.58),
  ('FTD-1003TPO', 'Scuppers', '<24" Scupper Drain — TPO', 'ea', 98.46),
  ('FTD-1004PVC', 'Scuppers', '<27" Scupper Drain — PVC', 'ea', 102.36),
  ('FTD-1004TPO', 'Scuppers', '<27" Scupper Drain — TPO', 'ea', 100.58),
  ('FTD-1005PVC', 'Scuppers', '<34" Scupper Drain — PVC', 'ea', 105.87),
  ('FTD-1005TPO', 'Scuppers', '<34" Scupper Drain — TPO', 'ea', 103.02),
  ('FTG-1001PVC', 'Vents', '12" Gravity Vent — PVC', 'ea', 247.38),
  ('FTG-1001TPO', 'Vents', '12" Gravity Vent — TPO', 'ea', 239.04),
  ('FTG-1002PVC', 'Vents', '14" Gravity Vent — PVC', 'ea', 260.66),
  ('FTG-1002TPO', 'Vents', '14" Gravity Vent — TPO', 'ea', 253.46),
  ('FTG-1003PVC', 'Vents', '16" Gravity Vent — PVC', 'ea', 262.12),
  ('FTG-1003TPO', 'Vents', '16" Gravity Vent — TPO', 'ea', 264.76),
  ('FTG-1004PVC', 'Vents', '18" Gravity Vent — PVC', 'ea', 283.41),
  ('FTG-1004TPO', 'Vents', '18" Gravity Vent — TPO', 'ea', 276.21),
  ('FTG-1005PVC', 'Vents', '20" Gravity Vent — PVC', 'ea', 304.57),
  ('FTG-1005TPO', 'Vents', '20" Gravity Vent — TPO', 'ea', 300.01),
  ('FTG-1006PVC', 'Vents', '24" Gravity Vent — PVC', 'ea', 312.97),
  ('FTG-1006TPO', 'Vents', '24" Gravity Vent — TPO', 'ea', 305.23),
  ('FTT-1001PVC', 'Vents', '4" T-Top Vent — PVC', 'ea', 65.93),
  ('FTT-1001TPO', 'Vents', '4" T-Top Vent — TPO', 'ea', 64.47),
  ('FTT-1002PVC', 'Vents', '6" T-Top Vent — PVC', 'ea', 70.43),
  ('FTT-1002TPO', 'Vents', '6" T-Top Vent — TPO', 'ea', 69.03),
  ('FTT-1003PVC', 'Vents', '8" T-Top Vent — PVC', 'ea', 85.17),
  ('FTT-1003TPO', 'Vents', '8" T-Top Vent — TPO', 'ea', 83.78),
  ('FTT-1004PVC', 'Vents', '4x12 Rectangular T-Top Vent — PVC', 'ea', 154.54),
  ('FTT-1004TPO', 'Vents', '4x12 Rectangular T-Top Vent — TPO', 'ea', 147.19),
  ('FTV-1001PVC', 'Vents', '14x12 Gable Vent — PVC', 'ea', 144.01),
  ('FTV-1001TPO', 'Vents', '14x12 Gable Vent — TPO', 'ea', 144.01),
  ('FTV-1002PVC', 'Vents', '14x18 Gable Vent — PVC', 'ea', 154.54),
  ('FTV-1002TPO', 'Vents', '14x18 Gable Vent — TPO', 'ea', 154.54),
  ('FTV-1004PVC', 'Vents', '4" Breather Vent (One Way) — PVC', 'ea', 48.27),
  ('FTV-1004TPO', 'Vents', '4" Breather Vent (One Way) — TPO', 'ea', 46.82),
  ('FTV-1005PVC', 'Vents', '12" Turbine Roof Vent — PVC', 'ea', 188.78),
  ('FTV-1005TPO', 'Vents', '12" Turbine Roof Vent — TPO', 'ea', 187.33),
  ('FTV-1006PVC', 'Vents', '4" Wall Mount Flapper / Dryer Vent — PVC', 'ea', 114.6),
  ('FTV-1006TPO', 'Vents', '4" Wall Mount Flapper / Dryer Vent — TPO', 'ea', 111.81),
  ('FTV-1009PVC', 'Vents', '14" Turbine Roof Vent — PVC', 'ea', 201.88),
  ('FTV-1009TPO', 'Vents', '14" Turbine Roof Vent — TPO', 'ea', 200.42),
  ('FTV-1013PVC', 'Vents', '4" Breather Vent (Two Way) — PVC', 'ea', 40.66),
  ('FTV-1013TPO', 'Vents', '4" Breather Vent (Two Way) — TPO', 'ea', 39.27),
  ('FTP-1005PVC', 'Sealant Pockets & Ovals', '4" Sealant Pocket — PVC', 'ea', 44.83),
  ('FTP-1005TPO', 'Sealant Pockets & Ovals', '4" Sealant Pocket — TPO', 'ea', 41.72),
  ('FTP-1006PVC', 'Sealant Pockets & Ovals', '6" Sealant Pocket — PVC', 'ea', 55.02),
  ('FTP-1006TPO', 'Sealant Pockets & Ovals', '6" Sealant Pocket — TPO', 'ea', 52.23),
  ('FTP-1007PVC', 'Sealant Pockets & Ovals', '8" Sealant Pocket — PVC', 'ea', 66.25),
  ('FTP-1007TPO', 'Sealant Pockets & Ovals', '8" Sealant Pocket — TPO', 'ea', 63.81),
  ('FTV-1007PVC', 'Sealant Pockets & Ovals', '4" Oval Flashing w/ Sub Base — PVC', 'ea', 80.67),
  ('FTV-1007TPO', 'Sealant Pockets & Ovals', '4" Oval Flashing w/ Sub Base — TPO', 'ea', 79.21),
  ('FTV-1008PVC', 'Sealant Pockets & Ovals', '7" Oval Flashing w/ Sub Base — PVC', 'ea', 92.51),
  ('FTV-1008TPO', 'Sealant Pockets & Ovals', '7" Oval Flashing w/ Sub Base — TPO', 'ea', 88.34),
  ('FTA-1001PVC', 'Corners & Accessories', '3.5" Injection-Molded Outside Corner (White) — PVC', 'ea', 5.89),
  ('FTA-1001TPO', 'Corners & Accessories', '3.5" Injection-Molded Outside Corner (White) — TPO', 'ea', 5.09),
  ('FTA-1002PVC', 'Corners & Accessories', '6" Non-Reinforced Outside Corner — PVC', 'ea', 11.76),
  ('FTA-1002TPO', 'Corners & Accessories', '6" Non-Reinforced Outside Corner — TPO', 'ea', 10.65),
  ('FTA-1003PVC', 'Corners & Accessories', '6" Non-Reinforced Inside Corner — PVC', 'ea', 11.76),
  ('FTA-1003TPO', 'Corners & Accessories', '6" Non-Reinforced Inside Corner — TPO', 'ea', 10.65),
  ('FTA-1004PVC', 'Corners & Accessories', '4.5" T-Joint Cover (100 pc) — PVC', 'ea', 138.26),
  ('FTA-1004TPO', 'Corners & Accessories', '4.5" T-Joint Cover (100 pc) — TPO', 'ea', 136.82),
  ('FTA-1008', 'Corners & Accessories', 'Clamp (1-6")', 'ea', 3.17),
  ('FTA-1010', 'Corners & Accessories', 'Rubber Coupler 2"', 'ea', 7.6),
  ('FTA-1011', 'Corners & Accessories', 'Rubber Coupler 3"', 'ea', 9.45),
  ('FTA-1013', 'Corners & Accessories', 'Clamp (1/2"-1.5")', 'ea', 2.71),
  ('FTA-1014', 'Corners & Accessories', 'Hose Clamps 1.5"-2.5"', 'ea', 2.78),
  ('FTA-1017', 'Corners & Accessories', 'Flat Roof Attachment', 'ea', 39.27),
  ('FTA-1018', 'Corners & Accessories', 'Solar Anchor Boot — TPO', 'ea', 26.65),
  ('FTA-1019', 'Corners & Accessories', 'Solar Anchor Boot — PVC', 'ea', 26.65)
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
