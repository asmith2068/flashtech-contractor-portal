// ─── Flash-Tech Mfg — Parts Catalog, Materials & Custom Flashing Engine ───

// Fallback catalog used when the portal_products table hasn't been created yet
// (the database seed in database-setup.sql contains this same list).
export const SEED_PRODUCTS = [
  // -- Edge Metal --
  { sku: "FTE-1001PVC", category: "Edge Metal", description: "3x3 Clad Metal Drip Edge — PVC", unit: "ea", price: 39.67 },
  { sku: "FTE-1001TPO", category: "Edge Metal", description: "3x3 Clad Metal Drip Edge — TPO", unit: "ea", price: 38.35 },
  // -- Pipe Boots & Flashings --
  { sku: "FT-1001PVC", category: "Pipe Boots & Flashings", description: "1-6\" Conical Boot — PVC", unit: "ea", price: 30.15 },
  { sku: "FT-1001TPO", category: "Pipe Boots & Flashings", description: "1-6\" Conical Boot — TPO", unit: "ea", price: 28.04 },
  { sku: "FT-1002PVC", category: "Pipe Boots & Flashings", description: "1-6\" Split Conical Boot — PVC", unit: "ea", price: 33.66 },
  { sku: "FT-1002TPO", category: "Pipe Boots & Flashings", description: "1-6\" Split Conical Boot — TPO", unit: "ea", price: 31.21 },
  { sku: "FT-1005PVC", category: "Pipe Boots & Flashings", description: "Compact Split Conical Pipe Boot — PVC", unit: "ea", price: 28.76 },
  { sku: "FT-1005TPO", category: "Pipe Boots & Flashings", description: "Compact Split Conical Pipe Boot — TPO", unit: "ea", price: 26.65 },
  { sku: "FT-1006PVC", category: "Pipe Boots & Flashings", description: "6-8\" Conical Boot — PVC", unit: "ea", price: 39.27 },
  { sku: "FT-1006TPO", category: "Pipe Boots & Flashings", description: "6-8\" Conical Boot — TPO", unit: "ea", price: 37.82 },
  { sku: "FT-1007PVC", category: "Pipe Boots & Flashings", description: "6-8\" Split Conical Boot — PVC", unit: "ea", price: 42.06 },
  { sku: "FT-1007TPO", category: "Pipe Boots & Flashings", description: "6-8\" Split Conical Boot — TPO", unit: "ea", price: 40.66 },
  { sku: "FT-1008PVC", category: "Pipe Boots & Flashings", description: "8-10\" Conical Boot — PVC", unit: "ea", price: 43.45 },
  { sku: "FT-1008TPO", category: "Pipe Boots & Flashings", description: "8-10\" Conical Boot — TPO", unit: "ea", price: 40.66 },
  { sku: "FT-1009PVC", category: "Pipe Boots & Flashings", description: "8-10\" Split Conical Boot — PVC", unit: "ea", price: 43.45 },
  { sku: "FT-1009TPO", category: "Pipe Boots & Flashings", description: "8-10\" Split Conical Boot — TPO", unit: "ea", price: 42.06 },
  { sku: "FT-1010PVC", category: "Pipe Boots & Flashings", description: "1.5\" Split Pipe Flashing — PVC", unit: "ea", price: 30.15 },
  { sku: "FT-1010TPO", category: "Pipe Boots & Flashings", description: "1.5\" Split Pipe Flashing — TPO", unit: "ea", price: 26.65 },
  { sku: "FT-1011PVC", category: "Pipe Boots & Flashings", description: "2\" Pipe Flashing — PVC", unit: "ea", price: 31.54 },
  { sku: "FT-1011TPO", category: "Pipe Boots & Flashings", description: "2\" Pipe Flashing — TPO", unit: "ea", price: 26.65 },
  { sku: "FT-1012PVC", category: "Pipe Boots & Flashings", description: "2\" Split Pipe Flashing — PVC", unit: "ea", price: 32.92 },
  { sku: "FT-1012TPO", category: "Pipe Boots & Flashings", description: "2\" Split Pipe Flashing — TPO", unit: "ea", price: 27.31 },
  { sku: "FT-1013PVC", category: "Pipe Boots & Flashings", description: "3\" Pipe Flashing — PVC", unit: "ea", price: 32.92 },
  { sku: "FT-1013TPO", category: "Pipe Boots & Flashings", description: "3\" Pipe Flashing — TPO", unit: "ea", price: 29.43 },
  { sku: "FT-1014PVC", category: "Pipe Boots & Flashings", description: "3\" Split Pipe Flashing — PVC", unit: "ea", price: 34.72 },
  { sku: "FT-1014TPO", category: "Pipe Boots & Flashings", description: "3\" Split Pipe Flashing — TPO", unit: "ea", price: 30.15 },
  { sku: "FT-1015PVC", category: "Pipe Boots & Flashings", description: "4\" Vent Pipe Flashing — PVC", unit: "ea", price: 34.72 },
  { sku: "FT-1015TPO", category: "Pipe Boots & Flashings", description: "4\" Vent Pipe Flashing — TPO", unit: "ea", price: 32.07 },
  { sku: "FT-1016PVC", category: "Pipe Boots & Flashings", description: "4\" Split Pipe Flashing — PVC", unit: "ea", price: 35.78 },
  { sku: "FT-1016TPO", category: "Pipe Boots & Flashings", description: "4\" Split Pipe Flashing — TPO", unit: "ea", price: 32.6 },
  { sku: "FT-1017PVC", category: "Pipe Boots & Flashings", description: "6\" Vent Pipe Flashing — PVC", unit: "ea", price: 39.94 },
  { sku: "FT-1017TPO", category: "Pipe Boots & Flashings", description: "6\" Vent Pipe Flashing — TPO", unit: "ea", price: 38.55 },
  { sku: "FT-1018TPO", category: "Pipe Boots & Flashings", description: "6\" Split Vent Pipe Flashing — TPO", unit: "ea", price: 39.61 },
  { sku: "FT-1020PVC", category: "Pipe Boots & Flashings", description: "4\" Square Wrap — PVC", unit: "ea", price: 37.16 },
  { sku: "FT-1020TPO", category: "Pipe Boots & Flashings", description: "4\" Square Wrap — TPO", unit: "ea", price: 35.78 },
  { sku: "FT-1021PVC", category: "Pipe Boots & Flashings", description: "4\" Split Square Wrap — PVC", unit: "ea", price: 40.33 },
  { sku: "FT-1021TPO", category: "Pipe Boots & Flashings", description: "4\" Split Square Wrap — TPO", unit: "ea", price: 38.88 },
  { sku: "FT-1022PVC", category: "Pipe Boots & Flashings", description: "6\" Square Wrap — PVC", unit: "ea", price: 39.61 },
  { sku: "FT-1022TPO", category: "Pipe Boots & Flashings", description: "6\" Square Wrap — TPO", unit: "ea", price: 36.77 },
  { sku: "FT-1023PVC", category: "Pipe Boots & Flashings", description: "6\" Split Square Wrap — PVC", unit: "ea", price: 41.33 },
  { sku: "FT-1023TPO", category: "Pipe Boots & Flashings", description: "6\" Split Square Wrap — TPO", unit: "ea", price: 39.94 },
  // -- Drains --
  { sku: "FT-1030", category: "Drains", description: "9x9 Balcony Deck Drain - Bonderized (2\" NPT Hub)", unit: "ea", price: 54.68 },
  { sku: "FT-1031", category: "Drains", description: "9x9 Balcony Deck Drain - Copper (2\" NPT Hub)", unit: "ea", price: 56.07 },
  { sku: "FT-1032", category: "Drains", description: "9x9 Balcony Deck Drain - Copper (3\" NPT Hub)", unit: "ea", price: 64.47 },
  { sku: "FT-1033", category: "Drains", description: "2\" Copper Bowl Drain (2\" Hub)", unit: "ea", price: 154.2 },
  { sku: "FT-1034", category: "Drains", description: "3\" Copper Bowl Drain (2\" Hub)", unit: "ea", price: 189.24 },
  { sku: "FT-1035", category: "Drains", description: "4\" Copper Bowl Drain (2\" Hub)", unit: "ea", price: 224.3 },
  { sku: "FT-1036", category: "Drains", description: "2\" Bowl Drain — TPO", unit: "ea", price: 168.22 },
  { sku: "FT-1037", category: "Drains", description: "3\" Bowl Drain — TPO", unit: "ea", price: 189.24 },
  { sku: "FT-1038", category: "Drains", description: "4\" Bowl Drain — TPO", unit: "ea", price: 224.3 },
  { sku: "FT-1039", category: "Drains", description: "2\" Bowl Drain — PVC", unit: "ea", price: 175.24 },
  { sku: "FT-1040", category: "Drains", description: "3\" Bowl Drain — PVC", unit: "ea", price: 196.26 },
  { sku: "FT-1041", category: "Drains", description: "4\" Bowl Drain — PVC", unit: "ea", price: 231.3 },
  { sku: "FT-1042", category: "Drains", description: "9x9 Balcony Deck Drain - Bonderized (2\" Std Hub)", unit: "ea", price: 53.29 },
  { sku: "FT-1043", category: "Drains", description: "9x9 Balcony Deck Drain - Copper (2\" Std Hub)", unit: "ea", price: 54.68 },
  { sku: "FT-1044", category: "Drains", description: "9x9 Balcony Deck Drain - Copper (3\" Std Hub)", unit: "ea", price: 61.7 },
  { sku: "FT-1045", category: "Drains", description: "2\" Copper Bowl Drain w/ Overflow", unit: "ea", price: 252.33 },
  { sku: "FT-1046", category: "Drains", description: "3\" Copper Bowl Drain w/ Overflow", unit: "ea", price: 294.39 },
  { sku: "FT-1047", category: "Drains", description: "4\" Copper Bowl Drain w/ Overflow", unit: "ea", price: 343.45 },
  { sku: "FT-1048", category: "Drains", description: "2\" Bowl Drain w/ Overflow — TPO", unit: "ea", price: 235.53 },
  { sku: "FT-1049", category: "Drains", description: "3\" Bowl Drain w/ Overflow — TPO", unit: "ea", price: 264.96 },
  { sku: "FT-1050", category: "Drains", description: "4\" Bowl Drain w/ Overflow — TPO", unit: "ea", price: 312.64 },
  { sku: "FT-1051", category: "Drains", description: "2\" Bowl Drain w/ Overflow — PVC", unit: "ea", price: 238.31 },
  { sku: "FT-1052", category: "Drains", description: "3\" Bowl Drain w/ Overflow — PVC", unit: "ea", price: 267.74 },
  { sku: "FT-1053", category: "Drains", description: "4\" Bowl Drain w/ Overflow — PVC", unit: "ea", price: 329.43 },
  { sku: "FT-2001SS", category: "Drains", description: "2\" Deck Drain Stainless Steel", unit: "ea", price: 58.85 },
  { sku: "FT-2002SS", category: "Drains", description: "3\" Deck Drain Stainless Steel", unit: "ea", price: 63.08 },
  { sku: "FTD-1010PVC", category: "Drains", description: "2\" Drain Insert (SS) Retrofit — PVC", unit: "ea", price: 200.49 },
  { sku: "FTD-1010TPO", category: "Drains", description: "2\" Drain Insert (SS) Retrofit — TPO", unit: "ea", price: 198.71 },
  { sku: "FTD-1012PVC", category: "Drains", description: "3\" Drain Insert (SS) Retrofit — PVC", unit: "ea", price: 218.67 },
  { sku: "FTD-1012TPO", category: "Drains", description: "3\" Drain Insert (SS) Retrofit — TPO", unit: "ea", price: 228.13 },
  { sku: "FTD-1020PVC", category: "Drains", description: "2\" Bowl Drain (pricing-sheet) — PVC", unit: "ea", price: 194.14 },
  { sku: "FTD-1020TPO", category: "Drains", description: "2\" Bowl Drain (pricing-sheet) — TPO", unit: "ea", price: 189.58 },
  { sku: "FTD-1021PVC", category: "Drains", description: "2\" Bowl Drain Side Outlet — PVC", unit: "ea", price: 235.53 },
  { sku: "FTD-1021TPO", category: "Drains", description: "2\" Bowl Drain Side Outlet — TPO", unit: "ea", price: 232.36 },
  { sku: "FTD-1022PVC", category: "Drains", description: "2\" Bowl Drain w/ Overflow — PVC", unit: "ea", price: 238.31 },
  { sku: "FTD-1022TPO", category: "Drains", description: "2\" Bowl Drain w/ Overflow — TPO", unit: "ea", price: 235.53 },
  { sku: "FTD-1023PVC", category: "Drains", description: "3\" Bowl Drain (pricing-sheet) — PVC", unit: "ea", price: 208.89 },
  { sku: "FTD-1023TPO", category: "Drains", description: "3\" Bowl Drain (pricing-sheet) — TPO", unit: "ea", price: 206.05 },
  { sku: "FTD-1024PVC", category: "Drains", description: "3\" Bowl Drain Side Outlet — PVC", unit: "ea", price: 261.79 },
  { sku: "FTD-1024TPO", category: "Drains", description: "3\" Bowl Drain Side Outlet — TPO", unit: "ea", price: 253.72 },
  { sku: "FTD-1025PVC", category: "Drains", description: "3\" Bowl Drain w/ Overflow — PVC", unit: "ea", price: 267.74 },
  { sku: "FTD-1025TPO", category: "Drains", description: "3\" Bowl Drain w/ Overflow — TPO", unit: "ea", price: 264.96 },
  { sku: "FTD-1026PVC", category: "Drains", description: "4\" Bowl Drain (pricing-sheet) — PVC", unit: "ea", price: 301.39 },
  { sku: "FTD-1026TPO", category: "Drains", description: "4\" Bowl Drain (pricing-sheet) — TPO", unit: "ea", price: 287.37 },
  { sku: "FTD-1027PVC", category: "Drains", description: "4\" Bowl Drain Side Outlet — PVC", unit: "ea", price: 364.48 },
  { sku: "FTD-1027TPO", category: "Drains", description: "4\" Bowl Drain Side Outlet — TPO", unit: "ea", price: 350.46 },
  { sku: "FTD-1028PVC", category: "Drains", description: "4\" Bowl Drain w/ Overflow — PVC", unit: "ea", price: 385.5 },
  { sku: "FTD-1028TPO", category: "Drains", description: "4\" Bowl Drain w/ Overflow — TPO", unit: "ea", price: 364.48 },
  // -- Scuppers --
  { sku: "FTD-1001PVC", category: "Scuppers", description: "<10\" Scupper Drain (combined total of 4 sides) — PVC", unit: "ea", price: 86.88 },
  { sku: "FTD-1001TPO", category: "Scuppers", description: "<10\" Scupper Drain (combined total of 4 sides) — TPO", unit: "ea", price: 83.78 },
  { sku: "FTD-1002PVC", category: "Scuppers", description: "<16\" Scupper Drain — PVC", unit: "ea", price: 96.4 },
  { sku: "FTD-1002TPO", category: "Scuppers", description: "<16\" Scupper Drain — TPO", unit: "ea", price: 92.51 },
  { sku: "FTD-1003PVC", category: "Scuppers", description: "<24\" Scupper Drain — PVC", unit: "ea", price: 100.58 },
  { sku: "FTD-1003TPO", category: "Scuppers", description: "<24\" Scupper Drain — TPO", unit: "ea", price: 98.46 },
  { sku: "FTD-1004PVC", category: "Scuppers", description: "<27\" Scupper Drain — PVC", unit: "ea", price: 102.36 },
  { sku: "FTD-1004TPO", category: "Scuppers", description: "<27\" Scupper Drain — TPO", unit: "ea", price: 100.58 },
  { sku: "FTD-1005PVC", category: "Scuppers", description: "<34\" Scupper Drain — PVC", unit: "ea", price: 105.87 },
  { sku: "FTD-1005TPO", category: "Scuppers", description: "<34\" Scupper Drain — TPO", unit: "ea", price: 103.02 },
  // -- Vents --
  { sku: "FTG-1001PVC", category: "Vents", description: "12\" Gravity Vent — PVC", unit: "ea", price: 247.38 },
  { sku: "FTG-1001TPO", category: "Vents", description: "12\" Gravity Vent — TPO", unit: "ea", price: 239.04 },
  { sku: "FTG-1002PVC", category: "Vents", description: "14\" Gravity Vent — PVC", unit: "ea", price: 260.66 },
  { sku: "FTG-1002TPO", category: "Vents", description: "14\" Gravity Vent — TPO", unit: "ea", price: 253.46 },
  { sku: "FTG-1003PVC", category: "Vents", description: "16\" Gravity Vent — PVC", unit: "ea", price: 262.12 },
  { sku: "FTG-1003TPO", category: "Vents", description: "16\" Gravity Vent — TPO", unit: "ea", price: 264.76 },
  { sku: "FTG-1004PVC", category: "Vents", description: "18\" Gravity Vent — PVC", unit: "ea", price: 283.41 },
  { sku: "FTG-1004TPO", category: "Vents", description: "18\" Gravity Vent — TPO", unit: "ea", price: 276.21 },
  { sku: "FTG-1005PVC", category: "Vents", description: "20\" Gravity Vent — PVC", unit: "ea", price: 304.57 },
  { sku: "FTG-1005TPO", category: "Vents", description: "20\" Gravity Vent — TPO", unit: "ea", price: 300.01 },
  { sku: "FTG-1006PVC", category: "Vents", description: "24\" Gravity Vent — PVC", unit: "ea", price: 312.97 },
  { sku: "FTG-1006TPO", category: "Vents", description: "24\" Gravity Vent — TPO", unit: "ea", price: 305.23 },
  { sku: "FTT-1001PVC", category: "Vents", description: "4\" T-Top Vent — PVC", unit: "ea", price: 65.93 },
  { sku: "FTT-1001TPO", category: "Vents", description: "4\" T-Top Vent — TPO", unit: "ea", price: 64.47 },
  { sku: "FTT-1002PVC", category: "Vents", description: "6\" T-Top Vent — PVC", unit: "ea", price: 70.43 },
  { sku: "FTT-1002TPO", category: "Vents", description: "6\" T-Top Vent — TPO", unit: "ea", price: 69.03 },
  { sku: "FTT-1003PVC", category: "Vents", description: "8\" T-Top Vent — PVC", unit: "ea", price: 85.17 },
  { sku: "FTT-1003TPO", category: "Vents", description: "8\" T-Top Vent — TPO", unit: "ea", price: 83.78 },
  { sku: "FTT-1004PVC", category: "Vents", description: "4x12 Rectangular T-Top Vent — PVC", unit: "ea", price: 154.54 },
  { sku: "FTT-1004TPO", category: "Vents", description: "4x12 Rectangular T-Top Vent — TPO", unit: "ea", price: 147.19 },
  { sku: "FTV-1001PVC", category: "Vents", description: "14x12 Gable Vent — PVC", unit: "ea", price: 144.01 },
  { sku: "FTV-1001TPO", category: "Vents", description: "14x12 Gable Vent — TPO", unit: "ea", price: 144.01 },
  { sku: "FTV-1002PVC", category: "Vents", description: "14x18 Gable Vent — PVC", unit: "ea", price: 154.54 },
  { sku: "FTV-1002TPO", category: "Vents", description: "14x18 Gable Vent — TPO", unit: "ea", price: 154.54 },
  { sku: "FTV-1004PVC", category: "Vents", description: "4\" Breather Vent (One Way) — PVC", unit: "ea", price: 48.27 },
  { sku: "FTV-1004TPO", category: "Vents", description: "4\" Breather Vent (One Way) — TPO", unit: "ea", price: 46.82 },
  { sku: "FTV-1005PVC", category: "Vents", description: "12\" Turbine Roof Vent — PVC", unit: "ea", price: 188.78 },
  { sku: "FTV-1005TPO", category: "Vents", description: "12\" Turbine Roof Vent — TPO", unit: "ea", price: 187.33 },
  { sku: "FTV-1006PVC", category: "Vents", description: "4\" Wall Mount Flapper / Dryer Vent — PVC", unit: "ea", price: 114.6 },
  { sku: "FTV-1006TPO", category: "Vents", description: "4\" Wall Mount Flapper / Dryer Vent — TPO", unit: "ea", price: 111.81 },
  { sku: "FTV-1009PVC", category: "Vents", description: "14\" Turbine Roof Vent — PVC", unit: "ea", price: 201.88 },
  { sku: "FTV-1009TPO", category: "Vents", description: "14\" Turbine Roof Vent — TPO", unit: "ea", price: 200.42 },
  { sku: "FTV-1013PVC", category: "Vents", description: "4\" Breather Vent (Two Way) — PVC", unit: "ea", price: 40.66 },
  { sku: "FTV-1013TPO", category: "Vents", description: "4\" Breather Vent (Two Way) — TPO", unit: "ea", price: 39.27 },
  // -- Sealant Pockets & Ovals --
  { sku: "FTP-1005PVC", category: "Sealant Pockets & Ovals", description: "4\" Sealant Pocket — PVC", unit: "ea", price: 44.83 },
  { sku: "FTP-1005TPO", category: "Sealant Pockets & Ovals", description: "4\" Sealant Pocket — TPO", unit: "ea", price: 41.72 },
  { sku: "FTP-1006PVC", category: "Sealant Pockets & Ovals", description: "6\" Sealant Pocket — PVC", unit: "ea", price: 55.02 },
  { sku: "FTP-1006TPO", category: "Sealant Pockets & Ovals", description: "6\" Sealant Pocket — TPO", unit: "ea", price: 52.23 },
  { sku: "FTP-1007PVC", category: "Sealant Pockets & Ovals", description: "8\" Sealant Pocket — PVC", unit: "ea", price: 66.25 },
  { sku: "FTP-1007TPO", category: "Sealant Pockets & Ovals", description: "8\" Sealant Pocket — TPO", unit: "ea", price: 63.81 },
  { sku: "FTV-1007PVC", category: "Sealant Pockets & Ovals", description: "4\" Oval Flashing w/ Sub Base — PVC", unit: "ea", price: 80.67 },
  { sku: "FTV-1007TPO", category: "Sealant Pockets & Ovals", description: "4\" Oval Flashing w/ Sub Base — TPO", unit: "ea", price: 79.21 },
  { sku: "FTV-1008PVC", category: "Sealant Pockets & Ovals", description: "7\" Oval Flashing w/ Sub Base — PVC", unit: "ea", price: 92.51 },
  { sku: "FTV-1008TPO", category: "Sealant Pockets & Ovals", description: "7\" Oval Flashing w/ Sub Base — TPO", unit: "ea", price: 88.34 },
  // -- Corners & Accessories --
  { sku: "FTA-1001PVC", category: "Corners & Accessories", description: "3.5\" Injection-Molded Outside Corner (White) — PVC", unit: "ea", price: 5.89 },
  { sku: "FTA-1001TPO", category: "Corners & Accessories", description: "3.5\" Injection-Molded Outside Corner (White) — TPO", unit: "ea", price: 5.09 },
  { sku: "FTA-1002PVC", category: "Corners & Accessories", description: "6\" Non-Reinforced Outside Corner — PVC", unit: "ea", price: 11.76 },
  { sku: "FTA-1002TPO", category: "Corners & Accessories", description: "6\" Non-Reinforced Outside Corner — TPO", unit: "ea", price: 10.65 },
  { sku: "FTA-1003PVC", category: "Corners & Accessories", description: "6\" Non-Reinforced Inside Corner — PVC", unit: "ea", price: 11.76 },
  { sku: "FTA-1003TPO", category: "Corners & Accessories", description: "6\" Non-Reinforced Inside Corner — TPO", unit: "ea", price: 10.65 },
  { sku: "FTA-1004PVC", category: "Corners & Accessories", description: "4.5\" T-Joint Cover (100 pc) — PVC", unit: "ea", price: 138.26 },
  { sku: "FTA-1004TPO", category: "Corners & Accessories", description: "4.5\" T-Joint Cover (100 pc) — TPO", unit: "ea", price: 136.82 },
  { sku: "FTA-1008", category: "Corners & Accessories", description: "Clamp (1-6\")", unit: "ea", price: 3.17 },
  { sku: "FTA-1010", category: "Corners & Accessories", description: "Rubber Coupler 2\"", unit: "ea", price: 7.6 },
  { sku: "FTA-1011", category: "Corners & Accessories", description: "Rubber Coupler 3\"", unit: "ea", price: 9.45 },
  { sku: "FTA-1013", category: "Corners & Accessories", description: "Clamp (1/2\"-1.5\")", unit: "ea", price: 2.71 },
  { sku: "FTA-1014", category: "Corners & Accessories", description: "Hose Clamps 1.5\"-2.5\"", unit: "ea", price: 2.78 },
  { sku: "FTA-1017", category: "Corners & Accessories", description: "Flat Roof Attachment", unit: "ea", price: 39.27 },
  { sku: "FTA-1018", category: "Corners & Accessories", description: "Solar Anchor Boot — TPO", unit: "ea", price: 26.65 },
  { sku: "FTA-1019", category: "Corners & Accessories", description: "Solar Anchor Boot — PVC", unit: "ea", price: 26.65 },
];

// Curated "Popular Items" — shown as the first catalog category by default.
export const POPULAR_SKUS = new Set([
  "FT-1011TPO", "FT-1011PVC",   // 2" pipe wrap
  "FT-1010TPO", "FT-1010PVC",   // 1.5" pipe wrap (split)
  "FTT-1001TPO", "FTT-1001PVC", // 4" T-Top vent
  "FTT-1002TPO", "FTT-1002PVC", // 6" T-Top vent
  "FT-1037",                     // 3" TPO roof (bowl) drain
  "FTG-1001TPO", "FTG-1001PVC", // 12" gravity vent
  "FTG-1004TPO", "FTG-1004PVC", // 18" gravity vent
  "FT-1001TPO", "FT-1001PVC",   // 1-6" conical boot
]);

// Product photos from flash-techinc.com (mapped by description keywords).
// Returns a thumbnail URL, or null when there's no matching photo.
const FT_IMG = "https://flash-techinc.com/wp-content/uploads";
export const productImage = (p) => {
  const d = (p.description || "").toLowerCase();
  const cat = p.category || "";
  // Pipe boots & flashings
  if (d.includes("conical") && d.includes("split")) return `${FT_IMG}/2023/02/ConicalBootSplitWhite-300x300.webp`;
  if (d.includes("conical")) return `${FT_IMG}/2023/02/ConicalBootWhite-300x300.webp`;
  if (d.includes("square wrap") && d.includes("split")) return `${FT_IMG}/2023/02/SquareBootSplitWhite-300x300.webp`;
  if (d.includes("square wrap")) return `${FT_IMG}/2023/02/SquareBootWhite-300x300.webp`;
  if (d.includes("split") && (d.includes("pipe flashing") || d.includes("vent pipe"))) return `${FT_IMG}/2023/02/CircularBootSplitWhite-300x300.webp`;
  if (d.includes("pipe flashing") || d.includes("vent pipe")) return `${FT_IMG}/2023/02/CircularBootWhite-300x300.webp`;
  // Edge metal
  if (d.includes("drip edge")) return `${FT_IMG}/2024/01/DripEdgeHemWhite-300x300.webp`;
  if (d.includes("coping")) return `${FT_IMG}/2024/01/CopingMetal-300x300.webp`;
  // Scuppers
  if (d.includes("scupper")) return `${FT_IMG}/2023/02/ScupperWallWhite-300x300.webp`;
  // Drains
  if (cat === "Drains" || d.includes("drain")) return d.includes("copper") ? `${FT_IMG}/2026/03/BasketDrainComboCopper-300x300.webp` : `${FT_IMG}/2026/03/BasketDrainComboPVC-300x300.webp`;
  // Vents
  if (d.includes("gravity vent")) return `${FT_IMG}/2023/02/GravityVentSide-300x300.webp`;
  if (d.includes("t-top")) return `${FT_IMG}/2023/02/TTopWhite-300x300.webp`;
  if (d.includes("gable vent")) return `${FT_IMG}/2023/02/LouverVentWhite-300x300.webp`;
  if (d.includes("breather")) return `${FT_IMG}/2023/02/BreatherWhite-300x300.webp`;
  if (d.includes("turbine")) return `${FT_IMG}/2025/07/new-Turbine-Vent-300x300.webp`;
  if (d.includes("wall mount") || d.includes("dryer")) return `${FT_IMG}/2023/02/LouverVentWhite-300x300.webp`;
  // Sealant pockets & ovals
  if (d.includes("sealant pocket")) return `${FT_IMG}/2023/02/PocketWhite-300x300.webp`;
  if (d.includes("oval flashing")) return `${FT_IMG}/2023/02/OvalFlashingWhite-300x300.webp`;
  // Corners & accessories
  if (d.includes("injection-molded outside corner") || d.includes("injection molded outside corner")) return `${FT_IMG}/2023/02/3.5_-Injection-Molded-Outside-Corner-300x300.jpg`;
  if (d.includes("outside corner")) return `${FT_IMG}/2023/02/ExteriorCornerPatchWhite-300x300.webp`;
  if (d.includes("inside corner")) return `${FT_IMG}/2023/02/InteriorCornerPatchWhite-300x300.webp`;
  if (d.includes("t-joint")) return `${FT_IMG}/2023/02/CirclePatchWhite-300x300.webp`;
  if (d.includes("solar anchor")) return `${FT_IMG}/2024/01/Solar-Stanchion-Cross-Sect-300x300.webp`;
  return null;
};

// ─── Sheet metal materials for the custom flashing builder ───
// rate = $ per inch of girth, per linear foot (estimated customer pricing)
export const MATERIALS = [
  { code: "G26", name: "Galvanized 26ga", rate: 0.26, hue: 210, sat: 8, lum: 62 },
  { code: "G24", name: "Galvanized 24ga", rate: 0.32, hue: 210, sat: 8, lum: 60 },
  { code: "B26", name: "Bonderized 26ga", rate: 0.28, hue: 35, sat: 7, lum: 46 },
  { code: "B24", name: "Bonderized 24ga", rate: 0.34, hue: 35, sat: 7, lum: 44 },
  { code: "A32", name: 'Aluminum .032"', rate: 0.36, hue: 215, sat: 4, lum: 72 },
  { code: "A40", name: 'Aluminum .040"', rate: 0.46, hue: 215, sat: 4, lum: 70 },
  // Bare-metal rates anchored to Galv 24ga sheet cost ($40 / 120×48): stainless = 2.5× ($100), copper = 8.75× ($350).
  { code: "CU16", name: "Copper 16oz", rate: 2.80, hue: 22, sat: 60, lum: 48 },
  { code: "SS24", name: "Stainless 24ga", rate: 0.80, hue: 210, sat: 6, lum: 74 },
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
export const membraneStyle = (code = "TPO-W") => {
  const [typeCode, colorCode] = code.includes("-") ? code.split("-") : [code.slice(0, 3), code.slice(3)];
  const tp = COMPOSITE_TYPES.find((t) => t.code === typeCode) || MEMBRANE_TYPES[0];
  const c = MEMBRANE_COLORS.find((x) => x.code === colorCode) || MEMBRANE_COLORS[0];
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
  {
    id: "cap",
    code: "CAP",
    name: "Box / Pan Cap",
    pan: true, // 4-sided box cap: closed top L×W, sides fold DOWN by H, kick-out + hemmed-tab corners. Priced EACH.
    fields: [
      { key: "length", label: "Length — L (in)", def: 12, min: 2, max: 120 },
      { key: "width", label: "Width — W (in)", def: 24, min: 2, max: 120 },
      { key: "height", label: "Side Height — H (in)", def: 3, min: 0.5, max: 16, step: 0.25 },
      { key: "kick", label: "Kick-Out (in)", def: 0.5, min: 0, max: 2, step: 0.25 },
      { key: "kickAngle", label: "Kick Angle (°)", def: 35, min: 0, max: 75, step: 5 },
      { key: "hem", label: "Bottom Edge", type: "choice", def: "hem", options: [
        { value: "hem", label: 'Hemmed edge (½")' },
        { value: "raw", label: "Raw edge" },
      ] },
    ],
    dims: (p) => `${p.length}"L × ${p.width}"W × ${p.height}"H box cap` +
      (p.kick > 0 ? `, ${p.kick}" kick @ ${p.kickAngle}°` : "") +
      (p.hem === "hem" ? ', ½" hemmed edge' : "") + ", hemmed-tab corners",
  },
  {
    id: "customProfile",
    code: "PRO",
    name: "Custom Profile (draw your own)",
    custom: true,
    fields: [],
    // Segments: [{ len, ang }] — ang is the bend angle (deg) applied BEFORE the segment; first segment has no bend.
    defaultSegs: () => [{ len: 3, ang: 0 }, { len: 3, ang: 90 }, { len: 0.5, ang: 35 }],
    points: (p) => customProfilePoints(p.segs || []),
    dims: (p) => customProfileDims(p.segs || []),
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
  {
    id: "scupper", code: "SCD", kind: "membrane", name: "Scupper Drain",
    fields: [
      { key: "w", label: "Opening Width (in)", def: 6, min: 2, max: 20, step: 0.5 },
      { key: "h", label: "Opening Height (in)", def: 4, min: 2, max: 20, step: 0.5 },
      { key: "throat", label: "Throat Depth (in)", def: 4, min: 2, max: 18, step: 0.5 },
    ],
    geometry: (p) => ({ shape: "scupper", w: p.w, h: p.h, throat: p.throat, flange: 2.5 }),
    dims: (p) => `${p.w}"×${p.h}" opening × ${p.throat}" throat`,
    fits: (p) => `${scupperSides(p.w, p.h)}" combined sides → ${scupperTier(scupperSides(p.w, p.h)).sku}`,
  },
];
export const typeById = (id) => FLASHING_TYPES.find((t) => t.id === id) || FLASHING_TYPES[0];

// ─── Scupper drains — priced by the combined total of all 4 sides of the opening ───
export const SCUPPER_TIERS = [
  { max: 10, sku: "FTD-1001", tpo: 83.78, pvc: 86.88 },
  { max: 16, sku: "FTD-1002", tpo: 92.51, pvc: 96.40 },
  { max: 24, sku: "FTD-1003", tpo: 98.46, pvc: 100.58 },
  { max: 27, sku: "FTD-1004", tpo: 100.58, pvc: 102.36 },
  { max: 34, sku: "FTD-1005", tpo: 103.02, pvc: 105.87 },
];
export const scupperSides = (w, h) => Math.round(2 * (w + h) * 100) / 100;
export const scupperTier = (sides) => SCUPPER_TIERS.find((t) => sides <= t.max) || SCUPPER_TIERS[SCUPPER_TIERS.length - 1];
const isPVCmat = (matCode) => (anyMat(matCode).typeName || "TPO").startsWith("PVC");
export const scupperPrice = (geo, matCode) => { const t = scupperTier(scupperSides(geo.w, geo.h)); return isPVCmat(matCode) ? t.pvc : t.tpo; };
export const scupperPartNumber = (matCode, geo) => scupperTier(scupperSides(geo.w, geo.h)).sku + (isPVCmat(matCode) ? "PVC" : "TPO");

// ─── Geometry & pricing ───
export const profileGirth = (pts) => {
  let g = 0;
  for (let i = 1; i < pts.length; i++) g += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return Math.round(g * 100) / 100;
};
export const profileBends = (pts) => Math.max(0, pts.length - 2);

// ─── Custom drawn profile — segments [{len, ang}] traced as a polyline ───
// ang = bend angle in degrees applied before the segment (first segment's is ignored).
// Screen coords: x right, y down. Positive angle bends downward/clockwise; negative bends the other way.
export const customProfilePoints = (segs) => {
  const pts = [[0, 0]];
  // First segment's angle is the absolute start heading; later segments' angles are bends.
  let heading = (segs && segs[0] ? (parseFloat(segs[0].ang) || 0) : 0), x = 0, y = 0;
  (segs || []).forEach((s, i) => {
    const len = Math.max(0, parseFloat(s.len) || 0);
    if (i > 0) heading += (parseFloat(s.ang) || 0);
    const r = rad(heading);
    x += Math.cos(r) * len; y += Math.sin(r) * len;
    pts.push([x, y]);
  });
  return pts;
};
export const customProfileStretch = (segs) =>
  Math.round((segs || []).reduce((g, s) => g + Math.max(0, parseFloat(s.len) || 0), 0) * 100) / 100;
export const customProfileDims = (segs) => (segs || []).map((s, i) => {
  const U = String.fromCharCode(65 + i);
  const len = Math.round((parseFloat(s.len) || 0) * 100) / 100;
  const ang = parseFloat(s.ang) || 0;
  if (i === 0) return ang ? `${U}=${len}" @${ang}°` : `${U}=${len}"`;
  return `${U}=${len}" (${ang}°)`;
}).join(" · ");

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
  const girthLabel = t.custom ? `${girth}" stretch-out` : `${girth}" girth`;
  return `${t.custom ? "" : "Custom "}${t.name} — ${m.name}, ${t.dims(params)}, ${girthLabel}, ${lengthFt}'-0" lengths`;
};

// ─── Box / Pan cap — 4-sided box, priced EACH ───
// Side stretch-out S = vertical height + kick + hem; flat blank = (L+2S)(W+2S).
export const panSide = (p) => (parseFloat(p.height) || 0) + (parseFloat(p.kick) || 0) + (p.hem === "hem" ? 0.5 : 0);
export const panBlank = (p) => {
  const L = parseFloat(p.length) || 0, W = parseFloat(p.width) || 0, S = panSide(p);
  return { l: Math.round((L + 2 * S) * 100) / 100, w: Math.round((W + 2 * S) * 100) / 100, s: Math.round(S * 100) / 100 };
};
// Calibrated to Flash-Tech list pricing (galvanized): 36×48×3" (½" kick+hem) = $175, 12×24×3" = $105.
// price = (PAN_BASE + PAN_AREA × flatBlankArea), scaled by material vs. galvanized 26ga.
const PAN_BASE = 80.44;
const PAN_AREA = 0.038377; // $ per sq-in of flat blank
export const panPrice = (p, matCode) => {
  const L = parseFloat(p.length) || 0, W = parseFloat(p.width) || 0, S = panSide(p);
  const blankArea = (L + 2 * S) * (W + 2 * S);
  const usd = PAN_BASE + PAN_AREA * blankArea;
  const mult = (matByCode(matCode).rate || 0.26) / (matByCode("G26").rate || 0.26);
  return Math.round(Math.max(MIN_PIECE, usd * mult) * 100) / 100;
};
export const panPartNumber = (matCode, p) =>
  `FT-CX-CAP-${matCode}-${Math.round(parseFloat(p.length) || 0)}x${Math.round(parseFloat(p.width) || 0)}x${Math.round(parseFloat(p.height) || 0)}`;
export const panDescription = (matCode, p) => {
  const m = matByCode(matCode);
  return `Custom Box / Pan Cap — ${m.name}, ${p.length}"L × ${p.width}"W × ${p.height}"H, hemmed-tab corners${p.hem === "hem" ? ', ½" hemmed edge' : ""}`;
};

// ─── DXF export (R12 ASCII, inches) — for the Roper Whitney / brake software ───
const r4 = (n) => Math.round(n * 10000) / 10000;
const dxfHeader = () => `0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1009\n9\n$INSUNITS\n70\n1\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n`;
const dxfFooter = () => `0\nENDSEC\n0\nEOF\n`;
const dxfLine = (x1, y1, x2, y2, layer) => `0\nLINE\n8\n${layer}\n10\n${r4(x1)}\n20\n${r4(y1)}\n30\n0\n11\n${r4(x2)}\n21\n${r4(y2)}\n31\n0\n`;
// Linear profile cross-section -> connected LINE entities (y flipped to CAD up).
export const profileDXF = (points) => {
  let s = dxfHeader();
  for (let i = 1; i < points.length; i++) s += dxfLine(points[i - 1][0], -points[i - 1][1], points[i][0], -points[i][1], "PROFILE");
  return s + dxfFooter();
};
// Box/pan flat blank: cross/plus outline (CUT) with hemmed corner tabs + all fold lines (BEND).
export const panFlatDXF = (p) => {
  const L = Math.max(0.1, parseFloat(p.length) || 0), W = Math.max(0.1, parseFloat(p.width) || 0);
  const H = Math.max(0.1, parseFloat(p.height) || 0), kick = Math.max(0, parseFloat(p.kick) || 0), hem = p.hem === "hem" ? 0.5 : 0;
  const a = H + kick + hem, t = 0.625; // a = full side stretch-out, t = hemmed corner tab
  const V = [
    [a, 0], [a + L, 0], [a + L, a - t], [2 * a + L, a - t], [2 * a + L, a + W + t], [a + L, a + W + t],
    [a + L, 2 * a + W], [a, 2 * a + W], [a, a + W + t], [0, a + W + t], [0, a - t], [a, a - t],
  ];
  let s = dxfHeader();
  for (let i = 0; i < V.length; i++) { const j = (i + 1) % V.length; s += dxfLine(V[i][0], V[i][1], V[j][0], V[j][1], "CUT"); }
  const foldH = (y) => dxfLine(a, y, a + L, y, "BEND");   // across bottom/top flaps
  const foldV = (x) => dxfLine(x, a, x, a + W, "BEND");   // across left/right flaps
  // main panel folds (top rim of each side)
  s += foldH(a) + foldH(a + W) + foldV(a) + foldV(a + L);
  // kick folds (bottom of the vertical side)
  if (kick > 0) s += foldH(a - H) + foldH(a + W + H) + foldV(a - H) + foldV(a + L + H);
  // hem folds (the turned ½" edge)
  if (hem > 0) s += foldH(a - H - kick) + foldH(a + W + H + kick) + foldV(a - H - kick) + foldV(a + L + H + kick);
  return s + dxfFooter();
};
// Pick the right DXF for a saved sheet-metal part (pan flat blank vs linear profile).
export const partDXF = (flashingType, params) => {
  const t = typeById(flashingType);
  if (t.pan) return panFlatDXF(params);
  if ((t.kind || "sheet") === "sheet") return profileDXF(t.custom ? customProfilePoints(params.segs || []) : t.points(params));
  return null;
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
  if (t.custom) p.segs = t.defaultSegs ? t.defaultSegs() : [{ len: 3, ang: 0 }, { len: 3, ang: 90 }];
  if (t.splittable) p.split = false;
  if (t.kind === "membrane") p.mil = 60;
  return p;
};
