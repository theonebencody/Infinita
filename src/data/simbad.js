// Map SIMBAD otype codes -> display label, marker color, scale level
export function simbadOtypeInfo(otype) {
  const t = (otype || '').trim();
  if (/^BH/.test(t))                    return { label: 'Black Hole',        color: 0x6666cc, scale: 2 };
  if (/^NS$/.test(t))                   return { label: 'Neutron Star',      color: 0x88aaff, scale: 2 };
  if (/^PN/.test(t))                    return { label: 'Planetary Nebula',  color: 0x44ffaa, scale: 3 };
  if (/^SNR/.test(t))                   return { label: 'Supernova Remnant', color: 0xff5533, scale: 3 };
  if (/^HII|^Neb|^MoC|^Cld|^DNe|^glb/.test(t)) return { label: 'Nebula', color: 0x6688ff, scale: 3 };
  if (/^GlCl/.test(t))                  return { label: 'Globular Cluster',  color: 0xffaa44, scale: 3 };
  if (/^OpCl|^Cl\*|^As\*/.test(t))     return { label: 'Star Cluster',      color: 0xffdd77, scale: 3 };
  if (/^GrG|^CGG|^ClG/.test(t))        return { label: 'Galaxy Cluster',    color: 0x7788ee, scale: 3 };
  if (/^G$|^GiG|^GiC|^GiP|^rG|^SBG|^EmG|^IG|^PaG|^LSB|^BCG/.test(t))
                                         return { label: 'Galaxy',           color: 0x8899ff, scale: 3 };
  if (/^QSO|^AGN|^Sy|^BLL|^Bla/.test(t)) return { label: 'Quasar / AGN',   color: 0x44ccff, scale: 3 };
  if (/^\*\*|^SB\*/.test(t))           return { label: 'Double Star',       color: 0xfff0c0, scale: 2 };
  if (!t || /^\*|^Star|^sg\*|^s\*|^WD\*|^HB\*|^HS\*|^Be\*/.test(t))
                                         return { label: 'Star',             color: 0xfff5d0, scale: 2 };
  return { label: t, color: 0xcccccc, scale: 2 };
}

// Estimate distance in AU from SIMBAD parallax or redshift
export function simbadDistAU(plx, z, typeInfo) {
  if (plx && plx > 0)  return (1000 / plx) * 3.26156 * 63241;
  if (z  && z  > 0 && z < 10) return (z * 299792.458 / 70) * 3.26156e6 * 63241;
  // Nearby galaxy with blueshift (e.g. M31 z~-0.001): use Local Group nominal distance
  if (z  && z  < 0 && z > -0.01 && typeInfo.label === 'Galaxy') return 2.5e6 * 63241;
  if (typeInfo.label === 'Galaxy' || typeInfo.label === 'Galaxy Cluster' || typeInfo.label === 'Quasar / AGN') return 50e6 * 63241;
  if (typeInfo.scale === 3) return 5000  * 63241;  // nominal 5 kly for nebulae
  return 300 * 63241;                               // nominal 300 ly for stars
}

export function simbadMarkerRadius(scale, label) {
  if (label === 'Galaxy' || label === 'Galaxy Cluster' || label === 'Quasar / AGN') return 8e8;
  if (scale === 3) return 2500;
  return 0.04;
}

export function formatDistFromAU(au) {
  const ly = au / 63241;
  if (ly < 1)       return (au).toFixed(1) + ' AU';
  if (ly < 1000)    return ly.toFixed(1) + ' ly';
  if (ly < 1e6)     return (ly / 1000).toFixed(1) + ' kly';
  return (ly / 1e6).toFixed(2) + ' Mly';
}

export function titleCase(s) {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}

// Common name aliases -> exact SIMBAD main_id
export const COMMON_ALIASES = {
  'andromeda': 'M  31', 'andromeda galaxy': 'M  31', 'm31': 'M  31', 'm 31': 'M  31',
  'triangulum galaxy': 'M  33', 'm33': 'M  33', 'm 33': 'M  33',
  'whirlpool galaxy': 'M  51', 'whirlpool': 'M  51', 'm51': 'M  51',
  'sombrero galaxy': 'M 104', 'sombrero': 'M 104',
  'pinwheel galaxy': 'M 101', 'm101': 'M 101',
  "bode's galaxy": 'M  81', 'bode galaxy': 'M  81', 'm81': 'M  81',
  'cigar galaxy': 'M  82', 'm82': 'M  82',
  'orion nebula': 'M  42', 'm42': 'M  42',
  'crab nebula': 'M   1', 'm1': 'M   1',
  'large magellanic cloud': 'NAME LMC', 'lmc': 'NAME LMC',
  'small magellanic cloud': 'NAME SMC', 'smc': 'NAME SMC',
  'centaurus a': 'NGC 5128',
};

// Query SIMBAD TAP for live search
export async function queryLiveSIMBAD(query, reqId, exactId) {
  let q;
  if (exactId) {
    const safeId = exactId.replace(/'/g, "''");
    q = `SELECT TOP 1 b.main_id,b.ra,b.dec,b.otype,b.plx_value,b.rvz_redshift,b.sp_type ` +
        `FROM basic b WHERE b.main_id = '${safeId}' AND b.ra IS NOT NULL`;
  } else {
    const safe = titleCase(query.trim()).replace(/'/g, "''");
    q = `SELECT TOP 12 b.main_id,b.ra,b.dec,b.otype,b.plx_value,b.rvz_redshift,b.sp_type ` +
        `FROM basic b JOIN ident i ON i.oidref=b.oid ` +
        `WHERE i.id LIKE '%${safe}%' AND b.ra IS NOT NULL`;
  }
  const url = `https://simbad.cds.unistra.fr/simbad/sim-tap/sync?REQUEST=doQuery&LANG=ADQL&FORMAT=json&QUERY=${encodeURIComponent(q)}`;
  const resp = await fetch(url);
  const json = await resp.json();
  return { reqId, json };
}
