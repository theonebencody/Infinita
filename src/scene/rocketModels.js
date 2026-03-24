import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Shared materials
// ---------------------------------------------------------------------------

function whiteMat() {
  return new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    roughness: 0.4,
    metalness: 0.1,
  });
}

function engineMat() {
  return new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.3,
    metalness: 0.6,
  });
}

function orangeMat() {
  return new THREE.MeshStandardMaterial({
    color: 0xcc6611,
    roughness: 0.5,
    metalness: 0.1,
  });
}

function steelMat() {
  return new THREE.MeshStandardMaterial({
    color: 0xbbbbcc,
    roughness: 0.25,
    metalness: 0.7,
  });
}

function darkGrayMat() {
  return new THREE.MeshStandardMaterial({
    color: 0x555555,
    roughness: 0.4,
    metalness: 0.3,
  });
}

function blueTintMat() {
  return new THREE.MeshStandardMaterial({
    color: 0x8899cc,
    roughness: 0.4,
    metalness: 0.2,
  });
}

// ---------------------------------------------------------------------------
// Helper: add a small engine bell (cone pointing downward)
// ---------------------------------------------------------------------------

function addEngineBell(parent, x, y, z, radius, height) {
  const geo = new THREE.ConeGeometry(radius, height, 12);
  const mesh = new THREE.Mesh(geo, engineMat());
  mesh.position.set(x, y - height / 2, z);
  mesh.rotation.x = Math.PI; // point the cone downward
  parent.add(mesh);
  return mesh;
}

// ---------------------------------------------------------------------------
// Falcon 9
// ---------------------------------------------------------------------------

function buildFalcon9() {
  const group = new THREE.Group();

  // -- First stage --
  const firstStageGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.13, 16);
  const firstStage = new THREE.Mesh(firstStageGeo, whiteMat());
  firstStage.position.y = 0.13 / 2;
  group.add(firstStage);

  // -- Interstage ring --
  const interstageGeo = new THREE.CylinderGeometry(0.013, 0.013, 0.008, 16);
  const interstage = new THREE.Mesh(interstageGeo, darkGrayMat());
  interstage.position.y = 0.13 + 0.008 / 2;
  group.add(interstage);

  // -- Second stage --
  const secondStageGeo = new THREE.CylinderGeometry(0.011, 0.011, 0.035, 16);
  const secondStage = new THREE.Mesh(secondStageGeo, whiteMat());
  secondStage.position.y = 0.13 + 0.008 + 0.035 / 2;
  group.add(secondStage);

  // -- Fairing (cone) --
  const fairingGeo = new THREE.ConeGeometry(0.014, 0.04, 16);
  const fairing = new THREE.Mesh(fairingGeo, whiteMat());
  fairing.position.y = 0.13 + 0.008 + 0.035 + 0.04 / 2;
  group.add(fairing);

  // -- 4 grid fins at base --
  const finGeo = new THREE.BoxGeometry(0.018, 0.008, 0.003);
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(finGeo, darkGrayMat());
    const angle = (i * Math.PI) / 2;
    fin.position.set(
      Math.cos(angle) * 0.018,
      0.012,
      Math.sin(angle) * 0.018
    );
    fin.rotation.y = angle;
    group.add(fin);
  }

  // -- Engine bell cluster: 1 center + 8 ring --
  addEngineBell(group, 0, 0, 0, 0.004, 0.008);
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    addEngineBell(
      group,
      Math.cos(angle) * 0.008,
      0,
      Math.sin(angle) * 0.008,
      0.003,
      0.007
    );
  }

  // Center the rocket so its midpoint is at y=0
  const totalHeight = 0.13 + 0.008 + 0.035 + 0.04;
  group.position.y = -totalHeight / 2;

  const wrapper = new THREE.Group();
  wrapper.add(group);
  return wrapper;
}

// ---------------------------------------------------------------------------
// Falcon Heavy
// ---------------------------------------------------------------------------

function buildFalconHeavy() {
  const group = new THREE.Group();

  // ---------- Center core (same proportions as Falcon 9) ----------

  // First stage
  const centerFirstGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.13, 16);
  const centerFirst = new THREE.Mesh(centerFirstGeo, whiteMat());
  centerFirst.position.y = 0.13 / 2;
  group.add(centerFirst);

  // Interstage
  const interstageGeo = new THREE.CylinderGeometry(0.013, 0.013, 0.008, 16);
  const interstage = new THREE.Mesh(interstageGeo, darkGrayMat());
  interstage.position.y = 0.13 + 0.008 / 2;
  group.add(interstage);

  // Second stage
  const secondStageGeo = new THREE.CylinderGeometry(0.011, 0.011, 0.035, 16);
  const secondStage = new THREE.Mesh(secondStageGeo, whiteMat());
  secondStage.position.y = 0.13 + 0.008 + 0.035 / 2;
  group.add(secondStage);

  // Fairing
  const fairingGeo = new THREE.ConeGeometry(0.014, 0.04, 16);
  const fairing = new THREE.Mesh(fairingGeo, whiteMat());
  fairing.position.y = 0.13 + 0.008 + 0.035 + 0.04 / 2;
  group.add(fairing);

  // Center core grid fins
  const finGeo = new THREE.BoxGeometry(0.018, 0.008, 0.003);
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(finGeo, darkGrayMat());
    const angle = (i * Math.PI) / 2;
    fin.position.set(
      Math.cos(angle) * 0.018,
      0.012,
      Math.sin(angle) * 0.018
    );
    fin.rotation.y = angle;
    group.add(fin);
  }

  // Center core engines: 1 center + 8 ring
  addEngineBell(group, 0, 0, 0, 0.004, 0.008);
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    addEngineBell(
      group,
      Math.cos(angle) * 0.008,
      0,
      Math.sin(angle) * 0.008,
      0.003,
      0.007
    );
  }

  // ---------- Side boosters (×2) ----------
  const boosterOffsets = [-0.028, 0.028];

  boosterOffsets.forEach((xOffset) => {
    // Booster body
    const boosterGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.12, 16);
    const booster = new THREE.Mesh(boosterGeo, whiteMat());
    booster.position.set(xOffset, 0.12 / 2, 0);
    group.add(booster);

    // Nose cone on booster
    const noseConeGeo = new THREE.ConeGeometry(0.012, 0.025, 16);
    const noseCone = new THREE.Mesh(noseConeGeo, whiteMat());
    noseCone.position.set(xOffset, 0.12 + 0.025 / 2, 0);
    group.add(noseCone);

    // Booster grid fins
    for (let i = 0; i < 4; i++) {
      const bFin = new THREE.Mesh(finGeo, darkGrayMat());
      const angle = (i * Math.PI) / 2;
      bFin.position.set(
        xOffset + Math.cos(angle) * 0.018,
        0.012,
        Math.sin(angle) * 0.018
      );
      bFin.rotation.y = angle;
      group.add(bFin);
    }

    // Booster engines: 1 center + 8 ring
    addEngineBell(group, xOffset, 0, 0, 0.004, 0.008);
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      addEngineBell(
        group,
        xOffset + Math.cos(angle) * 0.008,
        0,
        Math.sin(angle) * 0.008,
        0.003,
        0.007
      );
    }
  });

  // Center the whole rocket
  const totalHeight = 0.13 + 0.008 + 0.035 + 0.04;
  group.position.y = -totalHeight / 2;

  const wrapper = new THREE.Group();
  wrapper.add(group);
  return wrapper;
}

// ---------------------------------------------------------------------------
// Starship
// ---------------------------------------------------------------------------

function buildStarship() {
  const group = new THREE.Group();

  // -- Super Heavy booster (bottom) --
  const boosterGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.10, 20);
  const booster = new THREE.Mesh(boosterGeo, darkGrayMat());
  booster.position.y = 0.10 / 2;
  group.add(booster);

  // -- Starship upper stage --
  const shipGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.08, 20);
  const ship = new THREE.Mesh(shipGeo, steelMat());
  ship.position.y = 0.10 + 0.08 / 2;
  group.add(ship);

  // -- Rounded nose (half sphere) --
  const noseGeo = new THREE.SphereGeometry(0.024, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2);
  const nose = new THREE.Mesh(noseGeo, steelMat());
  nose.position.y = 0.10 + 0.08;
  group.add(nose);

  // -- Forward flaps (2 small angled boxes near top of ship) --
  const fwdFlapGeo = new THREE.BoxGeometry(0.03, 0.015, 0.003);
  for (let side = -1; side <= 1; side += 2) {
    const flap = new THREE.Mesh(fwdFlapGeo, darkGrayMat());
    flap.position.set(side * 0.026, 0.10 + 0.065, 0);
    flap.rotation.z = side * 0.3;
    group.add(flap);
  }

  // -- Aft flaps (2 larger boxes near bottom of ship) --
  const aftFlapGeo = new THREE.BoxGeometry(0.035, 0.02, 0.003);
  for (let side = -1; side <= 1; side += 2) {
    const flap = new THREE.Mesh(aftFlapGeo, darkGrayMat());
    flap.position.set(side * 0.028, 0.10 + 0.015, 0);
    flap.rotation.z = side * 0.25;
    group.add(flap);
  }

  // -- Many engine bells at base of Super Heavy (grid pattern) --
  // Center cluster of 3×3
  for (let gx = -1; gx <= 1; gx++) {
    for (let gz = -1; gz <= 1; gz++) {
      addEngineBell(group, gx * 0.007, 0, gz * 0.007, 0.004, 0.008);
    }
  }
  // Outer ring of 12
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI * 2) / 12;
    addEngineBell(
      group,
      Math.cos(angle) * 0.016,
      0,
      Math.sin(angle) * 0.016,
      0.004,
      0.008
    );
  }

  // Center the rocket
  const totalHeight = 0.10 + 0.08 + 0.024; // booster + ship + nose radius
  group.position.y = -totalHeight / 2;

  const wrapper = new THREE.Group();
  wrapper.add(group);
  return wrapper;
}

// ---------------------------------------------------------------------------
// SLS (Space Launch System)
// ---------------------------------------------------------------------------

function buildSLS() {
  const group = new THREE.Group();

  // -- Orange core stage --
  const coreGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.14, 16);
  const core = new THREE.Mesh(coreGeo, orangeMat());
  core.position.y = 0.14 / 2;
  group.add(core);

  // -- 2 white SRBs flanking ±0.032 --
  const srbOffsets = [-0.032, 0.032];
  srbOffsets.forEach((xOffset) => {
    const srbGeo = new THREE.CylinderGeometry(0.011, 0.011, 0.12, 16);
    const srb = new THREE.Mesh(srbGeo, whiteMat());
    srb.position.set(xOffset, 0.12 / 2, 0);
    group.add(srb);

    // SRB nose cone
    const srbNoseGeo = new THREE.ConeGeometry(0.011, 0.02, 16);
    const srbNose = new THREE.Mesh(srbNoseGeo, whiteMat());
    srbNose.position.set(xOffset, 0.12 + 0.02 / 2, 0);
    group.add(srbNose);

    // SRB engine bell
    addEngineBell(group, xOffset, 0, 0, 0.008, 0.01);
  });

  // -- Core stage engines (4 RS-25s) --
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI * 2) / 4 + Math.PI / 4;
    addEngineBell(
      group,
      Math.cos(angle) * 0.01,
      0,
      Math.sin(angle) * 0.01,
      0.005,
      0.01
    );
  }

  // -- White upper stage (ICPS / EUS) --
  const upperGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 16);
  const upper = new THREE.Mesh(upperGeo, whiteMat());
  upper.position.y = 0.14 + 0.03 / 2;
  group.add(upper);

  // -- Orion capsule (small cone) --
  const orionGeo = new THREE.ConeGeometry(0.012, 0.02, 16);
  const orion = new THREE.Mesh(orionGeo, whiteMat());
  orion.position.y = 0.14 + 0.03 + 0.02 / 2;
  group.add(orion);

  // -- Launch abort tower (thin spike) --
  const lasGeo = new THREE.CylinderGeometry(0.002, 0.001, 0.025, 8);
  const las = new THREE.Mesh(lasGeo, darkGrayMat());
  las.position.y = 0.14 + 0.03 + 0.02 + 0.025 / 2;
  group.add(las);

  // Center the rocket
  const totalHeight = 0.14 + 0.03 + 0.02 + 0.025;
  group.position.y = -totalHeight / 2;

  const wrapper = new THREE.Group();
  wrapper.add(group);
  return wrapper;
}

// ---------------------------------------------------------------------------
// New Glenn
// ---------------------------------------------------------------------------

function buildNewGlenn() {
  const group = new THREE.Group();

  // -- White first stage --
  const firstStageGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.13, 16);
  const firstStage = new THREE.Mesh(firstStageGeo, whiteMat());
  firstStage.position.y = 0.13 / 2;
  group.add(firstStage);

  // -- Blue-tinted second stage --
  const secondStageGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.04, 16);
  const secondStage = new THREE.Mesh(secondStageGeo, blueTintMat());
  secondStage.position.y = 0.13 + 0.04 / 2;
  group.add(secondStage);

  // -- Large fairing (wider cone) --
  const fairingGeo = new THREE.ConeGeometry(0.02, 0.05, 16);
  const fairing = new THREE.Mesh(fairingGeo, whiteMat());
  fairing.position.y = 0.13 + 0.04 + 0.05 / 2;
  group.add(fairing);

  // -- Engines: 7 BE-4 engines in hex pattern --
  addEngineBell(group, 0, 0, 0, 0.005, 0.01);
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    addEngineBell(
      group,
      Math.cos(angle) * 0.009,
      0,
      Math.sin(angle) * 0.009,
      0.004,
      0.009
    );
  }

  // Center the rocket
  const totalHeight = 0.13 + 0.04 + 0.05;
  group.position.y = -totalHeight / 2;

  const wrapper = new THREE.Group();
  wrapper.add(group);
  return wrapper;
}

// ---------------------------------------------------------------------------
// Ariane 6
// ---------------------------------------------------------------------------

function buildAriane6() {
  const group = new THREE.Group();

  // -- White core --
  const coreGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.13, 16);
  const core = new THREE.Mesh(coreGeo, whiteMat());
  core.position.y = 0.13 / 2;
  group.add(core);

  // -- 2 small SRBs flanking ±0.025 --
  const srbOffsets = [-0.025, 0.025];
  srbOffsets.forEach((xOffset) => {
    const srbGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.06, 12);
    const srb = new THREE.Mesh(srbGeo, whiteMat());
    srb.position.set(xOffset, 0.06 / 2, 0);
    group.add(srb);

    // SRB nose cone
    const srbNoseGeo = new THREE.ConeGeometry(0.007, 0.012, 12);
    const srbNose = new THREE.Mesh(srbNoseGeo, whiteMat());
    srbNose.position.set(xOffset, 0.06 + 0.012 / 2, 0);
    group.add(srbNose);

    // SRB engine bell
    addEngineBell(group, xOffset, 0, 0, 0.005, 0.008);
  });

  // -- Fairing on top --
  const fairingGeo = new THREE.ConeGeometry(0.018, 0.04, 16);
  const fairing = new THREE.Mesh(fairingGeo, whiteMat());
  fairing.position.y = 0.13 + 0.04 / 2;
  group.add(fairing);

  // -- Core engine (Vulcain) --
  addEngineBell(group, 0, 0, 0, 0.007, 0.012);

  // Center the rocket
  const totalHeight = 0.13 + 0.04;
  group.position.y = -totalHeight / 2;

  const wrapper = new THREE.Group();
  wrapper.add(group);
  return wrapper;
}

// ---------------------------------------------------------------------------
// Generic fallback rocket
// ---------------------------------------------------------------------------

function buildGenericRocket() {
  const group = new THREE.Group();

  // Simple body
  const bodyGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.14, 16);
  const body = new THREE.Mesh(bodyGeo, whiteMat());
  body.position.y = 0.14 / 2;
  group.add(body);

  // Nose cone
  const noseGeo = new THREE.ConeGeometry(0.014, 0.04, 16);
  const nose = new THREE.Mesh(noseGeo, whiteMat());
  nose.position.y = 0.14 + 0.04 / 2;
  group.add(nose);

  // 4 fins at base
  const finGeo = new THREE.BoxGeometry(0.02, 0.015, 0.003);
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(finGeo, darkGrayMat());
    const angle = (i * Math.PI) / 2;
    fin.position.set(
      Math.cos(angle) * 0.018,
      0.01,
      Math.sin(angle) * 0.018
    );
    fin.rotation.y = angle;
    group.add(fin);
  }

  // Single engine bell
  addEngineBell(group, 0, 0, 0, 0.006, 0.01);

  // Center
  const totalHeight = 0.14 + 0.04;
  group.position.y = -totalHeight / 2;

  const wrapper = new THREE.Group();
  wrapper.add(group);
  return wrapper;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const builders = {
  'Falcon 9': buildFalcon9,
  'Falcon Heavy': buildFalconHeavy,
  'Starship': buildStarship,
  'SLS': buildSLS,
  'New Glenn': buildNewGlenn,
  'Ariane 6': buildAriane6,
};

export function buildRocket(name) {
  const builder = builders[name];
  const rocketGroup = builder ? builder() : buildGenericRocket();
  rocketGroup.name = name || 'Generic Rocket';
  return rocketGroup;
}
