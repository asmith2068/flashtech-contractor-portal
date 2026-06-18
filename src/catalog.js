// ─── Flash-Tech Mfg — Parts Catalog, Materials & Custom Flashing Engine ───

// Fallback catalog used when the portal_products table hasn't been created yet
// (the database seed in database-setup.sql contains this same list).
export const SEED_PRODUCTS = [
  // -- Edge Metal --
  { sku: "WSE-1001TPO", category: "Edge Metal", description: "3x3 Clad Metal Drip Edge — TPO", unit: "ea", price: 33.35 },
  { sku: "WSE-1001PVC", category: "Edge Metal", description: "3x3 Clad Metal Drip Edge — PVC", unit: "ea", price: 34.5 },
  // -- Pipe Boots & Flashings --
  { sku: "WS-1001TPO", category: "Pipe Boots & Flashings", description: "1-6\" Conical Boot — TPO", unit: "ea", price: 24.38 },
  { sku: "WS-1001PVC", category: "Pipe Boots & Flashings", description: "1-6\" Conical Boot — PVC", unit: "ea", price: 26.22 },
  { sku: "WS-1006TPO", category: "Pipe Boots & Flashings", description: "6-8\" Conical Boot — TPO", unit: "ea", price: 32.89 },
  { sku: "WS-1006PVC", category: "Pipe Boots & Flashings", description: "6-8\" Conical Boot — PVC", unit: "ea", price: 34.15 },
  { sku: "WS-1008TPO", category: "Pipe Boots & Flashings", description: "8-10\" Conical Boot — TPO", unit: "ea", price: 35.36 },
  { sku: "WS-1008PVC", category: "Pipe Boots & Flashings", description: "8-10\" Conical Boot — PVC", unit: "ea", price: 37.78 },
  { sku: "WS-1011TPO", category: "Pipe Boots & Flashings", description: "2\" Pipe Flashing — TPO", unit: "ea", price: 23.17 },
  { sku: "WS-1011PVC", category: "Pipe Boots & Flashings", description: "2\" Pipe Flashing — PVC", unit: "ea", price: 27.43 },
  { sku: "WS-1013TPO", category: "Pipe Boots & Flashings", description: "3\" Pipe Flashing — TPO", unit: "ea", price: 25.59 },
  { sku: "WS-1013PVC", category: "Pipe Boots & Flashings", description: "3\" Pipe Flashing — PVC", unit: "ea", price: 28.63 },
  { sku: "WS-1015TPO", category: "Pipe Boots & Flashings", description: "4\" Vent Pipe Flashing — TPO", unit: "ea", price: 27.89 },
  { sku: "WS-1015PVC", category: "Pipe Boots & Flashings", description: "4\" Vent Pipe Flashing — PVC", unit: "ea", price: 30.19 },
  { sku: "WS-1017TPO", category: "Pipe Boots & Flashings", description: "6\" Vent Pipe Flashing — TPO", unit: "ea", price: 33.52 },
  { sku: "WS-1017PVC", category: "Pipe Boots & Flashings", description: "6\" Vent Pipe Flashing — PVC", unit: "ea", price: 34.73 },
  { sku: "WS-1020TPO", category: "Pipe Boots & Flashings", description: "4\" Square Wrap — TPO", unit: "ea", price: 31.11 },
  { sku: "WS-1020PVC", category: "Pipe Boots & Flashings", description: "4\" Square Wrap — PVC", unit: "ea", price: 32.31 },
  { sku: "WS-1022TPO", category: "Pipe Boots & Flashings", description: "6\" Square Wrap — TPO", unit: "ea", price: 31.97 },
  { sku: "WS-1022PVC", category: "Pipe Boots & Flashings", description: "6\" Square Wrap — PVC", unit: "ea", price: 34.44 },
  { sku: "WS-1002TPO", category: "Pipe Boots & Flashings", description: "1-6\" Split Conical Boot — TPO", unit: "ea", price: 27.14 },
  { sku: "WS-1002PVC", category: "Pipe Boots & Flashings", description: "1-6\" Split Conical Boot — PVC", unit: "ea", price: 29.27 },
  { sku: "WS-1005TPO", category: "Pipe Boots & Flashings", description: "Compact Split Conical Pipe Boot — TPO", unit: "ea", price: 23.17 },
  { sku: "WS-1005PVC", category: "Pipe Boots & Flashings", description: "Compact Split Conical Pipe Boot — PVC", unit: "ea", price: 25.01 },
  { sku: "WS-1007TPO", category: "Pipe Boots & Flashings", description: "6-8\" Split Conical Boot — TPO", unit: "ea", price: 35.36 },
  { sku: "WS-1007PVC", category: "Pipe Boots & Flashings", description: "6-8\" Split Conical Boot — PVC", unit: "ea", price: 36.57 },
  { sku: "WS-1009TPO", category: "Pipe Boots & Flashings", description: "8-10\" Split Conical Boot — TPO", unit: "ea", price: 36.57 },
  { sku: "WS-1009PVC", category: "Pipe Boots & Flashings", description: "8-10\" Split Conical Boot — PVC", unit: "ea", price: 37.78 },
  { sku: "WS-1010TPO", category: "Pipe Boots & Flashings", description: "1.5\" Split Pipe Flashing — TPO", unit: "ea", price: 23.17 },
  { sku: "WS-1010PVC", category: "Pipe Boots & Flashings", description: "1.5\" Split Pipe Flashing — PVC", unit: "ea", price: 26.22 },
  { sku: "WS-1012TPO", category: "Pipe Boots & Flashings", description: "2\" Split Pipe Flashing — TPO", unit: "ea", price: 23.75 },
  { sku: "WS-1012PVC", category: "Pipe Boots & Flashings", description: "2\" Split Pipe Flashing — PVC", unit: "ea", price: 28.63 },
  { sku: "WS-1014TPO", category: "Pipe Boots & Flashings", description: "3\" Split Pipe Flashing — TPO", unit: "ea", price: 26.22 },
  { sku: "WS-1014PVC", category: "Pipe Boots & Flashings", description: "3\" Split Pipe Flashing — PVC", unit: "ea", price: 30.19 },
  { sku: "WS-1016TPO", category: "Pipe Boots & Flashings", description: "4\" Split Pipe Flashing — TPO", unit: "ea", price: 28.35 },
  { sku: "WS-1016PVC", category: "Pipe Boots & Flashings", description: "4\" Split Pipe Flashing — PVC", unit: "ea", price: 31.11 },
  { sku: "WS-1018TPO", category: "Pipe Boots & Flashings", description: "6\" Split Vent Pipe Flashing — TPO", unit: "ea", price: 34.44 },
  { sku: "WS-1021TPO", category: "Pipe Boots & Flashings", description: "4\" Split Square Wrap — TPO", unit: "ea", price: 33.81 },
  { sku: "WS-1021PVC", category: "Pipe Boots & Flashings", description: "4\" Split Square Wrap — PVC", unit: "ea", price: 35.07 },
  { sku: "WS-1023TPO", category: "Pipe Boots & Flashings", description: "6\" Split Square Wrap — TPO", unit: "ea", price: 34.73 },
  { sku: "WS-1023PVC", category: "Pipe Boots & Flashings", description: "6\" Split Square Wrap — PVC", unit: "ea", price: 35.94 },
  // -- Drains --
  { sku: "WS-1030", category: "Drains", description: "9x9 Balcony Deck Drain - Bonderized (2\" NPT Hub)", unit: "ea", price: 47.55 },
  { sku: "WS-1031", category: "Drains", description: "9x9 Balcony Deck Drain - Copper (2\" NPT Hub)", unit: "ea", price: 48.76 },
  { sku: "WS-1032", category: "Drains", description: "9x9 Balcony Deck Drain - Copper (3\" NPT Hub)", unit: "ea", price: 56.06 },
  { sku: "WS-1042", category: "Drains", description: "9x9 Balcony Deck Drain - Bonderized (2\" Std Hub)", unit: "ea", price: 46.34 },
  { sku: "WS-1043", category: "Drains", description: "9x9 Balcony Deck Drain - Copper (2\" Std Hub)", unit: "ea", price: 47.55 },
  { sku: "WS-1044", category: "Drains", description: "9x9 Balcony Deck Drain - Copper (3\" Std Hub)", unit: "ea", price: 53.65 },
  { sku: "WS-1033", category: "Drains", description: "2\" Copper Bowl Drain (2\" Hub)", unit: "ea", price: 134.09 },
  { sku: "WS-1034", category: "Drains", description: "3\" Copper Bowl Drain (2\" Hub)", unit: "ea", price: 164.56 },
  { sku: "WS-1035", category: "Drains", description: "4\" Copper Bowl Drain (2\" Hub)", unit: "ea", price: 195.04 },
  { sku: "WS-1045", category: "Drains", description: "2\" Copper Bowl Drain w/ Overflow", unit: "ea", price: 219.42 },
  { sku: "WS-1046", category: "Drains", description: "3\" Copper Bowl Drain w/ Overflow", unit: "ea", price: 255.99 },
  { sku: "WS-1047", category: "Drains", description: "4\" Copper Bowl Drain w/ Overflow", unit: "ea", price: 298.65 },
  { sku: "WS-2001SS", category: "Drains", description: "2\" Deck Drain Stainless Steel", unit: "ea", price: 51.17 },
  { sku: "WS-2002SS", category: "Drains", description: "3\" Deck Drain Stainless Steel", unit: "ea", price: 54.85 },
  { sku: "WS-1036", category: "Drains", description: "2\" Bowl Drain — TPO", unit: "ea", price: 146.28 },
  { sku: "WS-1039", category: "Drains", description: "2\" Bowl Drain — PVC", unit: "ea", price: 152.38 },
  { sku: "WS-1037", category: "Drains", description: "3\" Bowl Drain — TPO", unit: "ea", price: 164.56 },
  { sku: "WS-1040", category: "Drains", description: "3\" Bowl Drain — PVC", unit: "ea", price: 170.66 },
  { sku: "WS-1038", category: "Drains", description: "4\" Bowl Drain — TPO", unit: "ea", price: 195.04 },
  { sku: "WS-1041", category: "Drains", description: "4\" Bowl Drain — PVC", unit: "ea", price: 201.13 },
  { sku: "WS-1048", category: "Drains", description: "2\" Bowl Drain w/ Overflow — TPO", unit: "ea", price: 204.81 },
  { sku: "WS-1051", category: "Drains", description: "2\" Bowl Drain w/ Overflow — PVC", unit: "ea", price: 207.23 },
  { sku: "WS-1049", category: "Drains", description: "3\" Bowl Drain w/ Overflow — TPO", unit: "ea", price: 230.4 },
  { sku: "WS-1052", category: "Drains", description: "3\" Bowl Drain w/ Overflow — PVC", unit: "ea", price: 232.82 },
  { sku: "WS-1050", category: "Drains", description: "4\" Bowl Drain w/ Overflow — TPO", unit: "ea", price: 271.86 },
  { sku: "WS-1053", category: "Drains", description: "4\" Bowl Drain w/ Overflow — PVC", unit: "ea", price: 286.46 },
  { sku: "WSD-1010TPO", category: "Drains", description: "2\" Drain Insert (SS) Retrofit — TPO", unit: "ea", price: 172.79 },
  { sku: "WSD-1010PVC", category: "Drains", description: "2\" Drain Insert (SS) Retrofit — PVC", unit: "ea", price: 174.34 },
  { sku: "WSD-1012TPO", category: "Drains", description: "3\" Drain Insert (SS) Retrofit — TPO", unit: "ea", price: 198.37 },
  { sku: "WSD-1012PVC", category: "Drains", description: "3\" Drain Insert (SS) Retrofit — PVC", unit: "ea", price: 190.15 },
  { sku: "WSD-1020TPO", category: "Drains", description: "2\" Bowl Drain (pricing-sheet) — TPO", unit: "ea", price: 164.85 },
  { sku: "WSD-1020PVC", category: "Drains", description: "2\" Bowl Drain (pricing-sheet) — PVC", unit: "ea", price: 168.82 },
  { sku: "WSD-1021TPO", category: "Drains", description: "2\" Bowl Drain Side Outlet — TPO", unit: "ea", price: 202.05 },
  { sku: "WSD-1021PVC", category: "Drains", description: "2\" Bowl Drain Side Outlet — PVC", unit: "ea", price: 204.81 },
  { sku: "WSD-1022TPO", category: "Drains", description: "2\" Bowl Drain w/ Overflow — TPO", unit: "ea", price: 204.81 },
  { sku: "WSD-1022PVC", category: "Drains", description: "2\" Bowl Drain w/ Overflow — PVC", unit: "ea", price: 207.23 },
  { sku: "WSD-1023TPO", category: "Drains", description: "3\" Bowl Drain (pricing-sheet) — TPO", unit: "ea", price: 179.17 },
  { sku: "WSD-1023PVC", category: "Drains", description: "3\" Bowl Drain (pricing-sheet) — PVC", unit: "ea", price: 181.64 },
  { sku: "WSD-1024TPO", category: "Drains", description: "3\" Bowl Drain Side Outlet — TPO", unit: "ea", price: 220.63 },
  { sku: "WSD-1024PVC", category: "Drains", description: "3\" Bowl Drain Side Outlet — PVC", unit: "ea", price: 227.64 },
  { sku: "WSD-1025TPO", category: "Drains", description: "3\" Bowl Drain w/ Overflow — TPO", unit: "ea", price: 230.4 },
  { sku: "WSD-1025PVC", category: "Drains", description: "3\" Bowl Drain w/ Overflow — PVC", unit: "ea", price: 232.82 },
  { sku: "WSD-1026TPO", category: "Drains", description: "4\" Bowl Drain (pricing-sheet) — TPO", unit: "ea", price: 249.89 },
  { sku: "WSD-1026PVC", category: "Drains", description: "4\" Bowl Drain (pricing-sheet) — PVC", unit: "ea", price: 262.08 },
  { sku: "WSD-1027TPO", category: "Drains", description: "4\" Bowl Drain Side Outlet — TPO", unit: "ea", price: 304.75 },
  { sku: "WSD-1027PVC", category: "Drains", description: "4\" Bowl Drain Side Outlet — PVC", unit: "ea", price: 316.94 },
  { sku: "WSD-1028TPO", category: "Drains", description: "4\" Bowl Drain w/ Overflow — TPO", unit: "ea", price: 316.94 },
  { sku: "WSD-1028PVC", category: "Drains", description: "4\" Bowl Drain w/ Overflow — PVC", unit: "ea", price: 335.22 },
  // -- Scuppers --
  { sku: "WSD-1001TPO", category: "Scuppers", description: "<10\" Scupper Drain (combined total of 4 sides) — TPO", unit: "ea", price: 72.85 },
  { sku: "WSD-1001PVC", category: "Scuppers", description: "<10\" Scupper Drain (combined total of 4 sides) — PVC", unit: "ea", price: 75.55 },
  { sku: "WSD-1002TPO", category: "Scuppers", description: "<16\" Scupper Drain — TPO", unit: "ea", price: 80.44 },
  { sku: "WSD-1002PVC", category: "Scuppers", description: "<16\" Scupper Drain — PVC", unit: "ea", price: 83.83 },
  { sku: "WSD-1003TPO", category: "Scuppers", description: "<24\" Scupper Drain — TPO", unit: "ea", price: 85.62 },
  { sku: "WSD-1003PVC", category: "Scuppers", description: "<24\" Scupper Drain — PVC", unit: "ea", price: 87.46 },
  { sku: "WSD-1004TPO", category: "Scuppers", description: "<27\" Scupper Drain — TPO", unit: "ea", price: 87.46 },
  { sku: "WSD-1004PVC", category: "Scuppers", description: "<27\" Scupper Drain — PVC", unit: "ea", price: 89.01 },
  { sku: "WSD-1005TPO", category: "Scuppers", description: "<34\" Scupper Drain — TPO", unit: "ea", price: 89.58 },
  { sku: "WSD-1005PVC", category: "Scuppers", description: "<34\" Scupper Drain — PVC", unit: "ea", price: 92.06 },
  // -- Vents --
  { sku: "WSG-1001TPO", category: "Vents", description: "12\" Gravity Vent — TPO", unit: "ea", price: 207.86 },
  { sku: "WSG-1001PVC", category: "Vents", description: "12\" Gravity Vent — PVC", unit: "ea", price: 215.11 },
  { sku: "WSG-1002TPO", category: "Vents", description: "14\" Gravity Vent — TPO", unit: "ea", price: 220.4 },
  { sku: "WSG-1002PVC", category: "Vents", description: "14\" Gravity Vent — PVC", unit: "ea", price: 226.66 },
  { sku: "WSG-1003TPO", category: "Vents", description: "16\" Gravity Vent — TPO", unit: "ea", price: 230.23 },
  { sku: "WSG-1003PVC", category: "Vents", description: "16\" Gravity Vent — PVC", unit: "ea", price: 227.93 },
  { sku: "WSG-1004TPO", category: "Vents", description: "18\" Gravity Vent — TPO", unit: "ea", price: 240.18 },
  { sku: "WSG-1004PVC", category: "Vents", description: "18\" Gravity Vent — PVC", unit: "ea", price: 246.44 },
  { sku: "WSG-1005TPO", category: "Vents", description: "20\" Gravity Vent — TPO", unit: "ea", price: 260.88 },
  { sku: "WSG-1005PVC", category: "Vents", description: "20\" Gravity Vent — PVC", unit: "ea", price: 264.84 },
  { sku: "WSG-1006TPO", category: "Vents", description: "24\" Gravity Vent — TPO", unit: "ea", price: 265.42 },
  { sku: "WSG-1006PVC", category: "Vents", description: "24\" Gravity Vent — PVC", unit: "ea", price: 272.15 },
  { sku: "WST-1001TPO", category: "Vents", description: "4\" T-Top Vent — TPO", unit: "ea", price: 56.06 },
  { sku: "WST-1001PVC", category: "Vents", description: "4\" T-Top Vent — PVC", unit: "ea", price: 57.33 },
  { sku: "WST-1002TPO", category: "Vents", description: "6\" T-Top Vent — TPO", unit: "ea", price: 60.03 },
  { sku: "WST-1002PVC", category: "Vents", description: "6\" T-Top Vent — PVC", unit: "ea", price: 61.24 },
  { sku: "WST-1003TPO", category: "Vents", description: "8\" T-Top Vent — TPO", unit: "ea", price: 72.85 },
  { sku: "WST-1003PVC", category: "Vents", description: "8\" T-Top Vent — PVC", unit: "ea", price: 74.06 },
  { sku: "WST-1004TPO", category: "Vents", description: "4x12 Rectangular T-Top Vent — TPO", unit: "ea", price: 127.99 },
  { sku: "WST-1004PVC", category: "Vents", description: "4x12 Rectangular T-Top Vent — PVC", unit: "ea", price: 134.38 },
  { sku: "WSV-1001TPO", category: "Vents", description: "14x12 Gable Vent — TPO", unit: "ea", price: 125.23 },
  { sku: "WSV-1001PVC", category: "Vents", description: "14x12 Gable Vent — PVC", unit: "ea", price: 125.23 },
  { sku: "WSV-1002TPO", category: "Vents", description: "14x18 Gable Vent — TPO", unit: "ea", price: 134.38 },
  { sku: "WSV-1002PVC", category: "Vents", description: "14x18 Gable Vent — PVC", unit: "ea", price: 134.38 },
  { sku: "WSV-1004TPO", category: "Vents", description: "4\" Breather Vent (One Way) — TPO", unit: "ea", price: 40.71 },
  { sku: "WSV-1004PVC", category: "Vents", description: "4\" Breather Vent (One Way) — PVC", unit: "ea", price: 41.97 },
  { sku: "WSV-1013TPO", category: "Vents", description: "4\" Breather Vent (Two Way) — TPO", unit: "ea", price: 34.15 },
  { sku: "WSV-1013PVC", category: "Vents", description: "4\" Breather Vent (Two Way) — PVC", unit: "ea", price: 35.36 },
  { sku: "WSV-1005TPO", category: "Vents", description: "12\" Turbine Roof Vent — TPO", unit: "ea", price: 162.9 },
  { sku: "WSV-1005PVC", category: "Vents", description: "12\" Turbine Roof Vent — PVC", unit: "ea", price: 164.16 },
  { sku: "WSV-1009TPO", category: "Vents", description: "14\" Turbine Roof Vent — TPO", unit: "ea", price: 174.28 },
  { sku: "WSV-1009PVC", category: "Vents", description: "14\" Turbine Roof Vent — PVC", unit: "ea", price: 175.55 },
  { sku: "WSV-1006TPO", category: "Vents", description: "4\" Wall Mount Flapper / Dryer Vent — TPO", unit: "ea", price: 97.23 },
  { sku: "WSV-1006PVC", category: "Vents", description: "4\" Wall Mount Flapper / Dryer Vent — PVC", unit: "ea", price: 99.65 },
  // -- Sealant Pockets & Ovals --
  { sku: "WSP-1005TPO", category: "Sealant Pockets & Ovals", description: "4\" Sealant Pocket — TPO", unit: "ea", price: 36.28 },
  { sku: "WSP-1005PVC", category: "Sealant Pockets & Ovals", description: "4\" Sealant Pocket — PVC", unit: "ea", price: 38.98 },
  { sku: "WSP-1006TPO", category: "Sealant Pockets & Ovals", description: "6\" Sealant Pocket — TPO", unit: "ea", price: 45.42 },
  { sku: "WSP-1006PVC", category: "Sealant Pockets & Ovals", description: "6\" Sealant Pocket — PVC", unit: "ea", price: 47.84 },
  { sku: "WSP-1007TPO", category: "Sealant Pockets & Ovals", description: "8\" Sealant Pocket — TPO", unit: "ea", price: 55.49 },
  { sku: "WSP-1007PVC", category: "Sealant Pockets & Ovals", description: "8\" Sealant Pocket — PVC", unit: "ea", price: 57.61 },
  { sku: "WSV-1007TPO", category: "Sealant Pockets & Ovals", description: "4\" Oval Flashing w/ Sub Base — TPO", unit: "ea", price: 68.88 },
  { sku: "WSV-1007PVC", category: "Sealant Pockets & Ovals", description: "4\" Oval Flashing w/ Sub Base — PVC", unit: "ea", price: 70.15 },
  { sku: "WSV-1008TPO", category: "Sealant Pockets & Ovals", description: "7\" Oval Flashing w/ Sub Base — TPO", unit: "ea", price: 76.82 },
  { sku: "WSV-1008PVC", category: "Sealant Pockets & Ovals", description: "7\" Oval Flashing w/ Sub Base — PVC", unit: "ea", price: 80.44 },
  // -- Corners & Accessories --
  { sku: "WSA-1018", category: "Corners & Accessories", description: "Solar Anchor Boot — TPO", unit: "ea", price: 23.17 },
  { sku: "WSA-1019", category: "Corners & Accessories", description: "Solar Anchor Boot — PVC", unit: "ea", price: 23.17 },
  { sku: "WSA-1001TPO", category: "Corners & Accessories", description: "3.5\" Injection-Molded Outside Corner (White) — TPO", unit: "ea", price: 4.43 },
  { sku: "WSA-1001PVC", category: "Corners & Accessories", description: "3.5\" Injection-Molded Outside Corner (White) — PVC", unit: "ea", price: 5.12 },
  { sku: "WSA-1002TPO", category: "Corners & Accessories", description: "6\" Non-Reinforced Outside Corner — TPO", unit: "ea", price: 9.26 },
  { sku: "WSA-1002PVC", category: "Corners & Accessories", description: "6\" Non-Reinforced Outside Corner — PVC", unit: "ea", price: 10.23 },
  { sku: "WSA-1003TPO", category: "Corners & Accessories", description: "6\" Non-Reinforced Inside Corner — TPO", unit: "ea", price: 9.26 },
  { sku: "WSA-1003PVC", category: "Corners & Accessories", description: "6\" Non-Reinforced Inside Corner — PVC", unit: "ea", price: 10.23 },
  { sku: "WSA-1004TPO", category: "Corners & Accessories", description: "4.5\" T-Joint Cover (100 pc) — TPO", unit: "ea", price: 118.97 },
  { sku: "WSA-1004PVC", category: "Corners & Accessories", description: "4.5\" T-Joint Cover (100 pc) — PVC", unit: "ea", price: 120.23 },
  { sku: "WSA-1010", category: "Corners & Accessories", description: "Rubber Coupler 2\"", unit: "ea", price: 6.61 },
  { sku: "WSA-1011", category: "Corners & Accessories", description: "Rubber Coupler 3\"", unit: "ea", price: 8.22 },
  { sku: "WSA-1008", category: "Corners & Accessories", description: "Clamp (1-6\")", unit: "ea", price: 2.76 },
  { sku: "WSA-1014", category: "Corners & Accessories", description: "Hose Clamps 1.5\"-2.5\"", unit: "ea", price: 2.42 },
  { sku: "WSA-1013", category: "Corners & Accessories", description: "Clamp (1/2\"-1.5\")", unit: "ea", price: 2.36 },
  { sku: "WSA-1017", category: "Corners & Accessories", description: "Flat Roof Attachment", unit: "ea", price: 34.15 },
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
  { max: 10, sku: "WSD-1001", tpo: 72.85, pvc: 75.55 },
  { max: 16, sku: "WSD-1002", tpo: 80.44, pvc: 83.83 },
  { max: 24, sku: "WSD-1003", tpo: 85.62, pvc: 87.46 },
  { max: 27, sku: "WSD-1004", tpo: 87.46, pvc: 89.01 },
  { max: 34, sku: "WSD-1005", tpo: 89.58, pvc: 92.06 },
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
