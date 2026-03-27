/**
 * Catalog of ~110 well-known deep-sky objects with real J2000 coordinates.
 *
 * Fields:
 *   name     – Messier or NGC/IC designation
 *   altName  – Common name (empty string if none)
 *   ra       – Right ascension in degrees (J2000)
 *   dec      – Declination in degrees (J2000)
 *   dist     – Distance in light-years
 *   type     – 'nebula' | 'globular' | 'open_cluster' | 'planetary_nebula' | 'snr' | 'galaxy'
 *   mag        – Apparent visual magnitude
 *   galaxyType – (galaxies only) 'spiral'|'barredSpiral'|'grandDesign'|'elliptical'|'irregular'|'lenticular'
 *   diameter   – (galaxies only) approximate diameter in light-years
 */

export const DEEP_SKY_OBJECTS = [
  // ───────────────────────────── Messier objects ─────────────────────────────

  // M1 – Crab Nebula (supernova remnant in Taurus)
  { name: 'M1', altName: 'Crab Nebula', ra: 83.6331, dec: 22.0145, dist: 6500, type: 'snr', mag: 8.4 },

  // M2 – globular cluster in Aquarius
  { name: 'M2', altName: '', ra: 323.3626, dec: -0.8233, dist: 37500, type: 'globular', mag: 6.5 },

  // M3 – globular cluster in Canes Venatici
  { name: 'M3', altName: '', ra: 205.5484, dec: 28.3773, dist: 33900, type: 'globular', mag: 6.2 },

  // M4 – globular cluster in Scorpius
  { name: 'M4', altName: '', ra: 245.8968, dec: -26.5257, dist: 7200, type: 'globular', mag: 5.6 },

  // M5 – globular cluster in Serpens
  { name: 'M5', altName: '', ra: 229.6384, dec: 2.0810, dist: 24500, type: 'globular', mag: 5.6 },

  // M6 – Butterfly Cluster (open cluster in Scorpius)
  { name: 'M6', altName: 'Butterfly Cluster', ra: 265.0833, dec: -32.2167, dist: 1600, type: 'open_cluster', mag: 4.2 },

  // M7 – Ptolemy Cluster (open cluster in Scorpius)
  { name: 'M7', altName: 'Ptolemy Cluster', ra: 268.4667, dec: -34.7933, dist: 980, type: 'open_cluster', mag: 3.3 },

  // M8 – Lagoon Nebula in Sagittarius
  { name: 'M8', altName: 'Lagoon Nebula', ra: 270.9042, dec: -24.3833, dist: 4100, type: 'nebula', mag: 6.0 },

  // M9 – globular cluster in Ophiuchus
  { name: 'M9', altName: '', ra: 259.7980, dec: -18.5161, dist: 25800, type: 'globular', mag: 7.7 },

  // M10 – globular cluster in Ophiuchus
  { name: 'M10', altName: '', ra: 254.2877, dec: -4.1003, dist: 14300, type: 'globular', mag: 6.6 },

  // M11 – Wild Duck Cluster (open cluster in Scutum)
  { name: 'M11', altName: 'Wild Duck Cluster', ra: 282.7667, dec: -6.2667, dist: 6200, type: 'open_cluster', mag: 5.8 },

  // M12 – globular cluster in Ophiuchus
  { name: 'M12', altName: '', ra: 251.8092, dec: -1.9483, dist: 15700, type: 'globular', mag: 6.7 },

  // M13 – Hercules Globular Cluster
  { name: 'M13', altName: 'Hercules Cluster', ra: 250.4217, dec: 36.4613, dist: 22200, type: 'globular', mag: 5.8 },

  // M14 – globular cluster in Ophiuchus
  { name: 'M14', altName: '', ra: 264.4004, dec: -3.2457, dist: 30300, type: 'globular', mag: 7.6 },

  // M15 – globular cluster in Pegasus
  { name: 'M15', altName: '', ra: 322.4930, dec: 12.1670, dist: 33600, type: 'globular', mag: 6.2 },

  // M16 – Eagle Nebula in Serpens
  { name: 'M16', altName: 'Eagle Nebula', ra: 274.7000, dec: -13.8067, dist: 7000, type: 'nebula', mag: 6.0 },

  // M17 – Omega Nebula in Sagittarius
  { name: 'M17', altName: 'Omega Nebula', ra: 275.1958, dec: -16.1714, dist: 5500, type: 'nebula', mag: 6.0 },

  // M19 – globular cluster in Ophiuchus
  { name: 'M19', altName: '', ra: 255.6573, dec: -26.2680, dist: 28700, type: 'globular', mag: 6.8 },

  // M20 – Trifid Nebula in Sagittarius
  { name: 'M20', altName: 'Trifid Nebula', ra: 270.6225, dec: -23.0300, dist: 5200, type: 'nebula', mag: 6.3 },

  // M22 – globular cluster in Sagittarius
  { name: 'M22', altName: '', ra: 279.0998, dec: -23.9047, dist: 10600, type: 'globular', mag: 5.1 },

  // M27 – Dumbbell Nebula in Vulpecula
  { name: 'M27', altName: 'Dumbbell Nebula', ra: 299.9015, dec: 22.7212, dist: 1360, type: 'planetary_nebula', mag: 7.5 },

  // M31 – Andromeda Galaxy
  { name: 'M31', altName: 'Andromeda Galaxy', ra: 10.6848, dec: 41.2690, dist: 2537000, type: 'galaxy', mag: 3.4, galaxyType: 'spiral', diameter: 220000 },

  // M32 – satellite of Andromeda
  { name: 'M32', altName: '', ra: 10.6742, dec: 40.8652, dist: 2490000, type: 'galaxy', mag: 8.1, galaxyType: 'elliptical', diameter: 6500 },

  // M33 – Triangulum Galaxy
  { name: 'M33', altName: 'Triangulum Galaxy', ra: 23.4621, dec: 30.6602, dist: 2730000, type: 'galaxy', mag: 5.7, galaxyType: 'spiral', diameter: 60000 },

  // M34 – open cluster in Perseus
  { name: 'M34', altName: '', ra: 40.5117, dec: 42.7608, dist: 1500, type: 'open_cluster', mag: 5.2 },

  // M35 – open cluster in Gemini
  { name: 'M35', altName: '', ra: 92.2500, dec: 24.3333, dist: 2800, type: 'open_cluster', mag: 5.1 },

  // M36 – open cluster in Auriga
  { name: 'M36', altName: '', ra: 84.0833, dec: 34.1333, dist: 4100, type: 'open_cluster', mag: 6.0 },

  // M37 – open cluster in Auriga
  { name: 'M37', altName: '', ra: 88.0708, dec: 32.5533, dist: 4500, type: 'open_cluster', mag: 5.6 },

  // M38 – open cluster in Auriga
  { name: 'M38', altName: '', ra: 82.1667, dec: 35.8333, dist: 4200, type: 'open_cluster', mag: 6.4 },

  // M41 – open cluster in Canis Major
  { name: 'M41', altName: '', ra: 101.5042, dec: -20.7572, dist: 2300, type: 'open_cluster', mag: 4.5 },

  // M42 – Orion Nebula
  { name: 'M42', altName: 'Orion Nebula', ra: 83.8221, dec: -5.3911, dist: 1344, type: 'nebula', mag: 4.0 },

  // M43 – De Mairan's Nebula (part of Orion complex)
  { name: 'M43', altName: "De Mairan's Nebula", ra: 83.8875, dec: -5.2672, dist: 1344, type: 'nebula', mag: 9.0 },

  // M44 – Beehive Cluster / Praesepe in Cancer
  { name: 'M44', altName: 'Beehive Cluster', ra: 130.0250, dec: 19.6683, dist: 577, type: 'open_cluster', mag: 3.7 },

  // M45 – Pleiades in Taurus
  { name: 'M45', altName: 'Pleiades', ra: 56.8500, dec: 24.1167, dist: 444, type: 'open_cluster', mag: 1.6 },

  // M46 – open cluster in Puppis
  { name: 'M46', altName: '', ra: 115.4333, dec: -14.8167, dist: 5400, type: 'open_cluster', mag: 6.1 },

  // M47 – open cluster in Puppis
  { name: 'M47', altName: '', ra: 114.1500, dec: -14.4833, dist: 1600, type: 'open_cluster', mag: 4.4 },

  // M48 – open cluster in Hydra
  { name: 'M48', altName: '', ra: 123.4167, dec: -5.7500, dist: 2500, type: 'open_cluster', mag: 5.8 },

  // M49 – elliptical galaxy in Virgo
  { name: 'M49', altName: '', ra: 187.4442, dec: 8.0003, dist: 55900000, type: 'galaxy', mag: 8.4, galaxyType: 'elliptical', diameter: 157000 },

  // M50 – open cluster in Monoceros
  { name: 'M50', altName: '', ra: 105.6917, dec: -8.3500, dist: 3200, type: 'open_cluster', mag: 5.9 },

  // M51 – Whirlpool Galaxy in Canes Venatici
  { name: 'M51', altName: 'Whirlpool Galaxy', ra: 202.4696, dec: 47.1952, dist: 23000000, type: 'galaxy', mag: 8.4, galaxyType: 'grandDesign', diameter: 76000 },

  // M52 – open cluster in Cassiopeia
  { name: 'M52', altName: '', ra: 351.2042, dec: 61.5933, dist: 5000, type: 'open_cluster', mag: 6.9 },

  // M53 – globular cluster in Coma Berenices
  { name: 'M53', altName: '', ra: 198.2302, dec: 18.1683, dist: 58000, type: 'globular', mag: 7.6 },

  // M54 – globular cluster in Sagittarius
  { name: 'M54', altName: '', ra: 283.7636, dec: -30.4783, dist: 87400, type: 'globular', mag: 7.6 },

  // M56 – globular cluster in Lyra
  { name: 'M56', altName: '', ra: 289.1483, dec: 30.1836, dist: 32900, type: 'globular', mag: 8.3 },

  // M57 – Ring Nebula in Lyra
  { name: 'M57', altName: 'Ring Nebula', ra: 283.3963, dec: 33.0286, dist: 2283, type: 'planetary_nebula', mag: 8.8 },

  // M58 – barred spiral galaxy in Virgo
  { name: 'M58', altName: '', ra: 189.4313, dec: 11.8183, dist: 62000000, type: 'galaxy', mag: 9.7, galaxyType: 'barredSpiral', diameter: 105000 },

  // M59 – elliptical galaxy in Virgo
  { name: 'M59', altName: '', ra: 190.5092, dec: 11.6467, dist: 60000000, type: 'galaxy', mag: 9.6, galaxyType: 'elliptical', diameter: 90000 },

  // M61 – spiral galaxy in Virgo
  { name: 'M61', altName: '', ra: 185.4788, dec: 4.4739, dist: 52500000, type: 'galaxy', mag: 9.7, galaxyType: 'barredSpiral', diameter: 100000 },

  // M63 – Sunflower Galaxy in Canes Venatici
  { name: 'M63', altName: 'Sunflower Galaxy', ra: 198.9554, dec: 42.0293, dist: 29300000, type: 'galaxy', mag: 8.6, galaxyType: 'spiral', diameter: 98000 },

  // M64 – Black Eye Galaxy in Coma Berenices
  { name: 'M64', altName: 'Black Eye Galaxy', ra: 194.1838, dec: 21.6828, dist: 17000000, type: 'galaxy', mag: 8.5, galaxyType: 'spiral', diameter: 70000 },

  // M65 – spiral galaxy in Leo (Leo Triplet)
  { name: 'M65', altName: '', ra: 169.7330, dec: 13.0922, dist: 35000000, type: 'galaxy', mag: 9.3, galaxyType: 'spiral', diameter: 90000 },

  // M66 – spiral galaxy in Leo (Leo Triplet)
  { name: 'M66', altName: '', ra: 170.0625, dec: 12.9914, dist: 36000000, type: 'galaxy', mag: 8.9, galaxyType: 'barredSpiral', diameter: 95000 },

  // M67 – open cluster in Cancer
  { name: 'M67', altName: '', ra: 132.8250, dec: 11.8167, dist: 2700, type: 'open_cluster', mag: 6.9 },

  // M74 – spiral galaxy in Pisces
  { name: 'M74', altName: '', ra: 24.1742, dec: 15.7833, dist: 35000000, type: 'galaxy', mag: 9.4, galaxyType: 'grandDesign', diameter: 95000 },

  // M76 – Little Dumbbell Nebula in Perseus
  { name: 'M76', altName: 'Little Dumbbell Nebula', ra: 25.5817, dec: 51.5753, dist: 2500, type: 'planetary_nebula', mag: 10.1 },

  // M78 – reflection nebula in Orion
  { name: 'M78', altName: '', ra: 86.6500, dec: 0.0778, dist: 1600, type: 'nebula', mag: 8.3 },

  // M79 – globular cluster in Lepus
  { name: 'M79', altName: '', ra: 81.0462, dec: -24.5247, dist: 41000, type: 'globular', mag: 7.7 },

  // M81 – Bode's Galaxy in Ursa Major
  { name: 'M81', altName: "Bode's Galaxy", ra: 148.8882, dec: 69.0653, dist: 11800000, type: 'galaxy', mag: 6.9, galaxyType: 'spiral', diameter: 90000 },

  // M82 – Cigar Galaxy in Ursa Major
  { name: 'M82', altName: 'Cigar Galaxy', ra: 148.9685, dec: 69.6797, dist: 11400000, type: 'galaxy', mag: 8.4, galaxyType: 'irregular', diameter: 37000 },

  // M83 – Southern Pinwheel Galaxy in Hydra
  { name: 'M83', altName: 'Southern Pinwheel Galaxy', ra: 204.2538, dec: -29.8656, dist: 14700000, type: 'galaxy', mag: 7.6, galaxyType: 'barredSpiral', diameter: 55000 },

  // M84 – lenticular galaxy in Virgo
  { name: 'M84', altName: '', ra: 186.2655, dec: 12.8869, dist: 60000000, type: 'galaxy', mag: 9.1, galaxyType: 'elliptical', diameter: 95000 },

  // M86 – lenticular galaxy in Virgo
  { name: 'M86', altName: '', ra: 186.5491, dec: 12.9461, dist: 52000000, type: 'galaxy', mag: 8.9, galaxyType: 'elliptical', diameter: 135000 },

  // M87 – Virgo A (giant elliptical in Virgo)
  { name: 'M87', altName: 'Virgo A', ra: 187.7059, dec: 12.3911, dist: 53500000, type: 'galaxy', mag: 8.6, galaxyType: 'elliptical', diameter: 240000 },

  // M92 – globular cluster in Hercules
  { name: 'M92', altName: '', ra: 259.2808, dec: 43.1364, dist: 26700, type: 'globular', mag: 6.4 },

  // M97 – Owl Nebula in Ursa Major
  { name: 'M97', altName: 'Owl Nebula', ra: 168.6988, dec: 55.0192, dist: 2030, type: 'planetary_nebula', mag: 9.9 },

  // M101 – Pinwheel Galaxy in Ursa Major
  { name: 'M101', altName: 'Pinwheel Galaxy', ra: 210.8023, dec: 54.3490, dist: 20870000, type: 'galaxy', mag: 7.9, galaxyType: 'grandDesign', diameter: 170000 },

  // M104 – Sombrero Galaxy in Virgo
  { name: 'M104', altName: 'Sombrero Galaxy', ra: 189.9976, dec: -11.6231, dist: 31100000, type: 'galaxy', mag: 8.0, galaxyType: 'spiral', diameter: 50000 },

  // M106 – spiral galaxy in Canes Venatici
  { name: 'M106', altName: '', ra: 184.7397, dec: 47.3039, dist: 23700000, type: 'galaxy', mag: 8.4, galaxyType: 'barredSpiral', diameter: 135000 },

  // M108 – barred spiral galaxy in Ursa Major
  { name: 'M108', altName: '', ra: 167.8792, dec: 55.6742, dist: 45000000, type: 'galaxy', mag: 10.0, galaxyType: 'barredSpiral', diameter: 80000 },

  // M109 – barred spiral galaxy in Ursa Major
  { name: 'M109', altName: '', ra: 179.3996, dec: 53.3744, dist: 83500000, type: 'galaxy', mag: 9.8, galaxyType: 'barredSpiral', diameter: 115000 },

  // M110 – satellite of Andromeda
  { name: 'M110', altName: '', ra: 10.0917, dec: 41.6853, dist: 2690000, type: 'galaxy', mag: 8.5, galaxyType: 'elliptical', diameter: 17000 },

  // ──────────────────────────── NGC objects ────────────────────────────────

  // NGC 104 – 47 Tucanae (globular cluster)
  { name: 'NGC 104', altName: '47 Tucanae', ra: 6.0239, dec: -72.0813, dist: 13000, type: 'globular', mag: 4.1 },

  // NGC 253 – Sculptor Galaxy
  { name: 'NGC 253', altName: 'Sculptor Galaxy', ra: 11.8880, dec: -25.2887, dist: 11400000, type: 'galaxy', mag: 7.1, galaxyType: 'barredSpiral', diameter: 90000 },

  // NGC 457 – Owl Cluster (open cluster in Cassiopeia)
  { name: 'NGC 457', altName: 'Owl Cluster', ra: 19.8375, dec: 58.2833, dist: 7900, type: 'open_cluster', mag: 6.4 },

  // NGC 663 – open cluster in Cassiopeia
  { name: 'NGC 663', altName: '', ra: 25.9833, dec: 61.2167, dist: 6850, type: 'open_cluster', mag: 7.1 },

  // NGC 869 – Double Cluster h Persei
  { name: 'NGC 869', altName: 'Double Cluster (h Per)', ra: 34.7500, dec: 57.1333, dist: 7500, type: 'open_cluster', mag: 5.3 },

  // NGC 884 – Double Cluster chi Persei
  { name: 'NGC 884', altName: 'Double Cluster (chi Per)', ra: 35.5833, dec: 57.1500, dist: 7500, type: 'open_cluster', mag: 6.1 },

  // NGC 1316 – Fornax A (lenticular galaxy)
  { name: 'NGC 1316', altName: 'Fornax A', ra: 50.6738, dec: -37.2083, dist: 62000000, type: 'galaxy', mag: 8.1, galaxyType: 'elliptical', diameter: 60000 },

  // NGC 1365 – barred spiral galaxy in Fornax
  { name: 'NGC 1365', altName: '', ra: 53.4015, dec: -36.1404, dist: 56000000, type: 'galaxy', mag: 9.6, galaxyType: 'barredSpiral', diameter: 200000 },

  // NGC 1976 – same as M42 (Orion Nebula) – omitted to avoid duplicate

  // NGC 2024 – Flame Nebula in Orion
  { name: 'NGC 2024', altName: 'Flame Nebula', ra: 85.4250, dec: -1.8500, dist: 1350, type: 'nebula', mag: 10.0 },

  // NGC 2070 – Tarantula Nebula in LMC
  { name: 'NGC 2070', altName: 'Tarantula Nebula', ra: 84.6763, dec: -69.1009, dist: 160000, type: 'nebula', mag: 8.2 },

  // NGC 2237 – Rosette Nebula in Monoceros
  { name: 'NGC 2237', altName: 'Rosette Nebula', ra: 97.9667, dec: 5.0333, dist: 5200, type: 'nebula', mag: 9.0 },

  // NGC 2264 – Christmas Tree Cluster / Cone Nebula in Monoceros
  { name: 'NGC 2264', altName: 'Christmas Tree Cluster', ra: 100.2417, dec: 9.8944, dist: 2500, type: 'nebula', mag: 3.9 },

  // NGC 2392 – Eskimo Nebula in Gemini
  { name: 'NGC 2392', altName: 'Eskimo Nebula', ra: 112.2946, dec: 20.9117, dist: 2870, type: 'planetary_nebula', mag: 9.2 },

  // NGC 2403 – spiral galaxy in Camelopardalis
  { name: 'NGC 2403', altName: '', ra: 114.2142, dec: 65.6025, dist: 8000000, type: 'galaxy', mag: 8.5, galaxyType: 'spiral', diameter: 72000 },

  // NGC 2841 – spiral galaxy in Ursa Major
  { name: 'NGC 2841', altName: '', ra: 140.5108, dec: 50.9764, dist: 46000000, type: 'galaxy', mag: 9.2, galaxyType: 'spiral', diameter: 150000 },

  // NGC 3115 – Spindle Galaxy in Sextans
  { name: 'NGC 3115', altName: 'Spindle Galaxy', ra: 151.3083, dec: -7.7186, dist: 32000000, type: 'galaxy', mag: 8.9, galaxyType: 'lenticular', diameter: 60000 },

  // NGC 3242 – Ghost of Jupiter in Hydra
  { name: 'NGC 3242', altName: 'Ghost of Jupiter', ra: 156.1821, dec: -18.6375, dist: 1400, type: 'planetary_nebula', mag: 7.3 },

  // NGC 3372 – Carina Nebula
  { name: 'NGC 3372', altName: 'Carina Nebula', ra: 160.8917, dec: -59.8667, dist: 8500, type: 'nebula', mag: 1.0 },

  // NGC 3628 – Hamburger Galaxy in Leo (Leo Triplet member)
  { name: 'NGC 3628', altName: 'Hamburger Galaxy', ra: 170.0708, dec: 13.5894, dist: 35000000, type: 'galaxy', mag: 9.5, galaxyType: 'barredSpiral', diameter: 100000 },

  // NGC 4038 – Antennae Galaxies in Corvus
  { name: 'NGC 4038', altName: 'Antennae Galaxies', ra: 180.4709, dec: -18.8677, dist: 45000000, type: 'galaxy', mag: 10.3, galaxyType: 'irregular', diameter: 65000 },

  // NGC 4258 – same as M106 – omitted to avoid duplicate

  // NGC 4565 – Needle Galaxy in Coma Berenices
  { name: 'NGC 4565', altName: 'Needle Galaxy', ra: 189.0867, dec: 25.9875, dist: 42000000, type: 'galaxy', mag: 9.6, galaxyType: 'spiral', diameter: 100000 },

  // NGC 4631 – Whale Galaxy in Canes Venatici
  { name: 'NGC 4631', altName: 'Whale Galaxy', ra: 190.5333, dec: 32.5414, dist: 25000000, type: 'galaxy', mag: 9.2, galaxyType: 'barredSpiral', diameter: 140000 },

  // NGC 4755 – Jewel Box Cluster in Crux
  { name: 'NGC 4755', altName: 'Jewel Box Cluster', ra: 193.4000, dec: -60.3667, dist: 6440, type: 'open_cluster', mag: 4.2 },

  // NGC 5128 – Centaurus A
  { name: 'NGC 5128', altName: 'Centaurus A', ra: 201.3651, dec: -43.0191, dist: 13000000, type: 'galaxy', mag: 6.8, galaxyType: 'elliptical', diameter: 97000 },

  // NGC 5139 – Omega Centauri (globular cluster)
  { name: 'NGC 5139', altName: 'Omega Centauri', ra: 201.6968, dec: -47.4797, dist: 15800, type: 'globular', mag: 3.7 },

  // NGC 5907 – Splinter Galaxy in Draco
  { name: 'NGC 5907', altName: 'Splinter Galaxy', ra: 228.9733, dec: 56.3286, dist: 53000000, type: 'galaxy', mag: 10.3, galaxyType: 'spiral', diameter: 150000 },

  // NGC 6210 – planetary nebula in Hercules
  { name: 'NGC 6210', altName: '', ra: 251.1233, dec: 23.7997, dist: 6500, type: 'planetary_nebula', mag: 8.8 },

  // NGC 6397 – globular cluster in Ara
  { name: 'NGC 6397', altName: '', ra: 265.1754, dec: -53.6744, dist: 7800, type: 'globular', mag: 5.7 },

  // NGC 6543 – Cat's Eye Nebula in Draco
  { name: 'NGC 6543', altName: "Cat's Eye Nebula", ra: 269.6392, dec: 66.6328, dist: 3300, type: 'planetary_nebula', mag: 8.1 },

  // NGC 6752 – globular cluster in Pavo
  { name: 'NGC 6752', altName: '', ra: 287.7171, dec: -59.9847, dist: 13000, type: 'globular', mag: 5.4 },

  // NGC 6826 – Blinking Planetary in Cygnus
  { name: 'NGC 6826', altName: 'Blinking Planetary', ra: 296.2004, dec: 50.5253, dist: 2200, type: 'planetary_nebula', mag: 8.8 },

  // NGC 6888 – Crescent Nebula in Cygnus
  { name: 'NGC 6888', altName: 'Crescent Nebula', ra: 303.0583, dec: 38.3500, dist: 5000, type: 'nebula', mag: 7.4 },

  // NGC 6960 – Western Veil Nebula in Cygnus
  { name: 'NGC 6960', altName: 'Western Veil Nebula', ra: 312.2333, dec: 30.7167, dist: 2400, type: 'snr', mag: 7.0 },

  // NGC 6992 – Eastern Veil Nebula in Cygnus
  { name: 'NGC 6992', altName: 'Eastern Veil Nebula', ra: 313.3917, dec: 31.7167, dist: 2400, type: 'snr', mag: 7.0 },

  // NGC 7000 – North America Nebula in Cygnus
  { name: 'NGC 7000', altName: 'North America Nebula', ra: 314.6833, dec: 44.3167, dist: 2590, type: 'nebula', mag: 4.0 },

  // NGC 7009 – Saturn Nebula in Aquarius
  { name: 'NGC 7009', altName: 'Saturn Nebula', ra: 316.0554, dec: -11.3636, dist: 2400, type: 'planetary_nebula', mag: 8.0 },

  // NGC 7023 – Iris Nebula in Cepheus
  { name: 'NGC 7023', altName: 'Iris Nebula', ra: 315.3958, dec: 68.1700, dist: 1300, type: 'nebula', mag: 7.1 },

  // NGC 7293 – Helix Nebula in Aquarius
  { name: 'NGC 7293', altName: 'Helix Nebula', ra: 337.4108, dec: -20.8372, dist: 655, type: 'planetary_nebula', mag: 7.6 },

  // NGC 7331 – spiral galaxy in Pegasus
  { name: 'NGC 7331', altName: '', ra: 339.2667, dec: 34.4158, dist: 40000000, type: 'galaxy', mag: 9.5, galaxyType: 'spiral', diameter: 120000 },

  // NGC 7635 – Bubble Nebula in Cassiopeia
  { name: 'NGC 7635', altName: 'Bubble Nebula', ra: 350.2000, dec: 61.2017, dist: 7100, type: 'nebula', mag: 10.0 },

  // NGC 7662 – Blue Snowball in Andromeda
  { name: 'NGC 7662', altName: 'Blue Snowball', ra: 351.6458, dec: 42.5408, dist: 1800, type: 'planetary_nebula', mag: 8.3 },

  // ──────────────────── IC and other notable objects ────────────────────────

  // IC 434 – Horsehead Nebula region (emission nebula in Orion)
  { name: 'IC 434', altName: 'Horsehead Nebula Region', ra: 85.2458, dec: -2.4583, dist: 1500, type: 'nebula', mag: 7.3 },

  // Barnard 33 – Horsehead Nebula (dark nebula, catalogued visually)
  { name: 'Barnard 33', altName: 'Horsehead Nebula', ra: 85.2375, dec: -2.4597, dist: 1500, type: 'nebula', mag: 11.0 },

  // IC 1396 – Elephant Trunk Nebula region in Cepheus
  { name: 'IC 1396', altName: 'Elephant Trunk Nebula', ra: 324.7500, dec: 57.5000, dist: 2400, type: 'nebula', mag: 3.5 },

  // IC 2118 – Witch Head Nebula near Rigel
  { name: 'IC 2118', altName: 'Witch Head Nebula', ra: 77.7500, dec: -7.8333, dist: 800, type: 'nebula', mag: 13.0 },

  // IC 5070 – Pelican Nebula in Cygnus
  { name: 'IC 5070', altName: 'Pelican Nebula', ra: 313.6333, dec: 44.3500, dist: 2590, type: 'nebula', mag: 8.0 },

  // IC 5146 – Cocoon Nebula in Cygnus
  { name: 'IC 5146', altName: 'Cocoon Nebula', ra: 328.3917, dec: 47.2667, dist: 3300, type: 'nebula', mag: 7.2 },

  // ──────────────────── Additional Notable Galaxies ────────────────────────
  { name: 'Milky Way', altName: 'Our Galaxy', ra: 266.405, dec: -28.936, dist: 0, type: 'galaxy', mag: -6.5, galaxyType: 'barredSpiral', diameter: 105700 },
  { name: 'LMC', altName: 'Large Magellanic Cloud', ra: 80.894, dec: -69.756, dist: 163000, type: 'galaxy', mag: 0.9, galaxyType: 'irregular', diameter: 32200 },
  { name: 'SMC', altName: 'Small Magellanic Cloud', ra: 13.187, dec: -72.829, dist: 200000, type: 'galaxy', mag: 2.7, galaxyType: 'irregular', diameter: 18900 },
  { name: 'SagDEG', altName: 'Sagittarius Dwarf Galaxy', ra: 283.831, dec: -30.545, dist: 65000, type: 'galaxy', mag: 4.5, galaxyType: 'elliptical', diameter: 10000 },
  { name: 'UMi Dwarf', altName: 'Ursa Minor Dwarf Galaxy', ra: 227.285, dec: 67.222, dist: 200000, type: 'galaxy', mag: 11.9, galaxyType: 'elliptical', diameter: 2000 },
  { name: 'Draco Dwarf', altName: 'Draco Dwarf Galaxy', ra: 260.052, dec: 57.915, dist: 260000, type: 'galaxy', mag: 10.9, galaxyType: 'elliptical', diameter: 3400 },
  { name: 'Fornax Dwarf', altName: 'Fornax Dwarf Galaxy', ra: 39.997, dec: -34.449, dist: 460000, type: 'galaxy', mag: 9.3, galaxyType: 'elliptical', diameter: 6000 },
  { name: 'Leo I', altName: 'Leo I Dwarf Galaxy', ra: 152.117, dec: 12.306, dist: 820000, type: 'galaxy', mag: 11.2, galaxyType: 'elliptical', diameter: 2600 },
  { name: 'NGC 6822', altName: "Barnard's Galaxy", ra: 296.236, dec: -14.789, dist: 1630000, type: 'galaxy', mag: 9.3, galaxyType: 'irregular', diameter: 7000 },
  { name: 'IC 10', altName: 'IC 10 Starburst Galaxy', ra: 5.099, dec: 59.302, dist: 2200000, type: 'galaxy', mag: 11.8, galaxyType: 'irregular', diameter: 5000 },
  { name: 'NGC 185', altName: '', ra: 9.742, dec: 48.337, dist: 2050000, type: 'galaxy', mag: 9.2, galaxyType: 'elliptical', diameter: 8000 },
  { name: 'NGC 147', altName: '', ra: 8.300, dec: 48.509, dist: 2530000, type: 'galaxy', mag: 9.5, galaxyType: 'elliptical', diameter: 10000 },
  { name: 'IC 1613', altName: '', ra: 16.199, dec: 2.119, dist: 2380000, type: 'galaxy', mag: 9.9, galaxyType: 'irregular', diameter: 10000 },
  { name: 'NGC 300', altName: '', ra: 13.723, dec: -37.684, dist: 6070000, type: 'galaxy', mag: 8.1, galaxyType: 'spiral', diameter: 44000 },
  { name: 'NGC 55', altName: '', ra: 3.675, dec: -39.197, dist: 6500000, type: 'galaxy', mag: 7.9, galaxyType: 'irregular', diameter: 70000 },
  { name: 'NGC 891', altName: '', ra: 35.639, dec: 42.349, dist: 30000000, type: 'galaxy', mag: 9.9, galaxyType: 'spiral', diameter: 110000 },
  { name: 'Maffei 1', altName: '', ra: 36.867, dec: 59.650, dist: 9800000, type: 'galaxy', mag: 11.4, galaxyType: 'elliptical', diameter: 75000 },
  { name: 'Circinus', altName: 'Circinus Galaxy', ra: 213.291, dec: -65.339, dist: 13000000, type: 'galaxy', mag: 10.6, galaxyType: 'spiral', diameter: 42000 },
  { name: 'ESO 350-40', altName: 'Cartwheel Galaxy', ra: 9.408, dec: -33.718, dist: 489000000, type: 'galaxy', mag: 15.2, galaxyType: 'irregular', diameter: 150000 },
  { name: 'UGC 1810', altName: 'Arp 273 (Hubble Rose)', ra: 35.549, dec: 39.355, dist: 300000000, type: 'galaxy', mag: 13.8, galaxyType: 'spiral', diameter: 100000 },
  { name: 'UGC 10214', altName: 'Tadpole Galaxy', ra: 240.853, dec: 55.514, dist: 420000000, type: 'galaxy', mag: 14.4, galaxyType: 'barredSpiral', diameter: 280000 },
];
