import * as THREE from 'three';
import { LAUNCH_DATA, ORG_COLORS, DEST_COLORS } from '../data/launchData.js';
import { _mkTex, _sfbm, _pTexFns, loadRealEarthTexture } from './noiseUtils.js';

let _launchHistoryActive = false;
let _lhFilter            = 'All';
// Earth viewer state
let _ehRenderer=null,_ehScene=null,_ehCam=null,_ehEarth=null;
let _ehSites={};
let _ehCamAngle=0,_ehLastT=0;
let _ehLaunches=[]; // animated launch trajectories
let _ehOrbits=[];   // orbiting objects

let _getStarted = () => false;

function _getOC(org){ return ORG_COLORS[org]||{css:'#8ac',bg:'rgba(136,170,204,0.1)',bd:'rgba(136,170,204,0.28)'}; }

function _filteredData() {
  return LAUNCH_DATA.filter(m => _lhFilter==='All' || m.org===_lhFilter ||
    (_lhFilter==='Roscosmos' && (m.org==='Soviet'||m.org==='Roscosmos')));
}

function _fmtMass(kg) {
  if (kg >= 1000) return (kg/1000).toFixed(1) + ' t';
  return kg + ' kg';
}

function _truncate(str, len) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export function openLaunchHistory() {
  _launchHistoryActive = true;
  document.getElementById('launch-history').classList.add('open');
  _renderAll();
  setTimeout(() => { _initEarthViewer(); }, 60);
  requestAnimationFrame(t => { _ehLastT=t; _ehAnimate(t); });
}

export function closeLaunchHistory() {
  _launchHistoryActive = false;
  // Clean up orbit labels
  _ehOrbits.forEach(o => { if (o.label && o.label.parentElement) o.label.parentElement.removeChild(o.label); });
  _ehOrbits = [];
  _ehLaunches = [];
  if (_ehRenderer) { _ehRenderer.dispose(); _ehRenderer = null; }
  document.getElementById('launch-history').classList.remove('open');
  if (!_getStarted()) {
    const sp = document.getElementById('splash');
    sp.classList.remove('hidden'); sp.style.opacity='';
  }
}

// ─── Render All Sections ─────────────────────────────────────────
function _renderAll() {
  const data = _filteredData();
  _renderStatsOverview(data);
  _renderCompanyGrid(data);
  _renderTimeline(data);
  _renderMissionsGrid(data);
}

// ─── Stats Overview ──────────────────────────────────────────────
function _renderStatsOverview(data) {
  const el = document.getElementById('lh-stats-overview');
  if (!el) return;

  const total = data.length;
  const successes = data.filter(m => m.status === 'success').length;
  const rate = total > 0 ? Math.round((successes / total) * 100) : 0;

  const totalMassKg = data.filter(m => m.status === 'success').reduce((s, m) => s + (m.mass || 0), 0);
  const totalMassTonnes = (totalMassKg / 1000).toFixed(1);

  const countries = new Set();
  data.forEach(m => countries.add(m.org));

  const years = data.map(m => parseInt(m.date.slice(0, 4)));
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const yearSpan = minYear === maxYear ? `${minYear}` : `${minYear} - ${maxYear}`;

  const totalFirsts = data.reduce((s, m) => s + (m.firsts ? m.firsts.length : 0), 0);

  el.innerHTML =
    _statCard(total, 'Total Missions') +
    _statCard(rate + '%', 'Success Rate') +
    _statCard(totalMassTonnes + ' t', 'Mass to Orbit') +
    _statCard(countries.size, 'Organizations') +
    _statCard(yearSpan, 'Year Span') +
    _statCard(totalFirsts, 'Firsts Achieved');
}

function _statCard(value, label) {
  return `<div class="lh-stat-card"><div class="lh-stat-card-value">${value}</div><div class="lh-stat-card-label">${label}</div></div>`;
}

// ─── Company Comparison Grid ─────────────────────────────────────
function _renderCompanyGrid(data) {
  const el = document.getElementById('lh-company-grid');
  if (!el) return;

  const orgs = {};
  data.forEach(m => {
    if (!orgs[m.org]) orgs[m.org] = { launches: 0, success: 0, failed: 0, mass: 0, firsts: [] };
    const o = orgs[m.org];
    o.launches++;
    if (m.status === 'success') o.success++;
    else if (m.status === 'failed') o.failed++;
    o.mass += (m.mass || 0);
    if (m.firsts && m.firsts.length > 0 && o.firsts.length === 0) {
      o.firsts.push(m.firsts[0]);
    }
  });

  let html = '';
  for (const [orgName, o] of Object.entries(orgs)) {
    const oc = _getOC(orgName);
    const massTonnes = (o.mass / 1000).toFixed(1);
    const firstNote = o.firsts.length > 0 ? o.firsts[0] : '—';
    html += `<div class="lh-company-card" style="border-left-color:${oc.css}">` +
      `<div class="lh-company-name">${orgName}</div>` +
      `<div class="lh-company-stat">Launches <span>${o.launches}</span></div>` +
      `<div class="lh-company-stat">Success / Fail <span>${o.success} / ${o.failed}</span></div>` +
      `<div class="lh-company-stat">Total Mass <span>${massTonnes} t</span></div>` +
      `<div class="lh-company-stat" style="margin-top:6px;font-size:9px;color:rgba(255,185,0,0.7);border-top:1px solid rgba(0,238,255,0.06);padding-top:6px">\u2605 ${_truncate(firstNote, 60)}</div>` +
      `</div>`;
  }
  el.innerHTML = html;
}

// ─── Key Milestones Timeline ─────────────────────────────────────
function _renderTimeline(data) {
  const el = document.getElementById('lh-timeline');
  if (!el) return;

  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));

  let html = '';
  sorted.forEach(m => {
    const year = m.date.slice(0, 4);
    const desc = _truncate(m.desc, 100);
    const firstTag = (m.firsts && m.firsts.length > 0)
      ? `<div class="lh-timeline-firsts">\u2605 ${m.firsts[0]}</div>`
      : '';
    const failClass = m.status === 'failed' ? ' failed' : '';
    html += `<div class="lh-timeline-item${failClass}">` +
      `<div class="lh-timeline-year">${year}</div>` +
      `<div class="lh-timeline-content">` +
        `<div class="lh-timeline-name">${m.name}</div>` +
        `<div class="lh-timeline-desc">${desc}</div>` +
        firstTag +
      `</div>` +
      `</div>`;
  });
  el.innerHTML = html;
}

// ─── All Missions Grid ───────────────────────────────────────────
function _renderMissionsGrid(data) {
  const el = document.getElementById('lh-missions-grid');
  if (!el) return;

  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));

  let html = '';
  sorted.forEach(m => {
    const oc = _getOC(m.org);
    const d = new Date(m.date + 'T00:00:00Z');
    const ds = d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' });
    const desc = _truncate(m.desc, 120);
    const mass = _fmtMass(m.mass);

    const statusLabel = m.status === 'success' ? 'SUCCESS' : m.status === 'failed' ? 'FAILED' : 'PARTIAL';
    const statusClass = m.status;

    html += `<div class="lh-mission-card">` +
      `<div class="lh-mission-card-header">` +
        `<div class="lh-mission-card-name">${m.name}</div>` +
        `<div class="lh-mission-card-date">${ds}</div>` +
      `</div>` +
      `<span class="lh-mission-card-org" style="background:${oc.bg};border:1px solid ${oc.bd};color:${oc.css}">${m.org}</span>` +
      `<span class="lh-mission-card-status ${statusClass}">${statusLabel}</span>` +
      `<div class="lh-mission-card-desc">${desc}</div>` +
      `<div class="lh-mission-card-stats">` +
        `<div>Rocket: <span>${m.rocket}</span></div>` +
        `<div>Mass: <span>${mass}</span></div>` +
        `<div>Dest: <span>${m.destination}</span></div>` +
      `</div>` +
      `</div>`;
  });
  el.innerHTML = html;
}

// ─── Earth Viewer ────────────────────────────────────────────────

function _latlonTo3D(lat,lon){
  const la=lat*Math.PI/180,lo=lon*Math.PI/180;
  return new THREE.Vector3(Math.cos(la)*Math.cos(lo),Math.sin(la),Math.cos(la)*Math.sin(lo));
}

function _initEarthViewer(){
  if(_ehRenderer) return;
  const canvas=document.getElementById('earth-canvas');
  if (!canvas) return;
  const container = canvas.parentElement;
  const w = container.clientWidth || 500;
  const h = container.clientHeight || 300;
  _ehRenderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
  _ehRenderer.setSize(w, h, false); // false = don't set CSS style, let container control it
  _ehRenderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  _ehRenderer.setClearColor(0x010208,1);
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  _ehScene=new THREE.Scene();
  _ehCam=new THREE.PerspectiveCamera(40,w/h,0.01,500);
  _ehCam.position.set(0,0.6,3.6);

  // Lighting
  _ehScene.add(new THREE.AmbientLight(0x223344,0.55));
  const sunL=new THREE.DirectionalLight(0xfff5dd,1.4); sunL.position.set(6,3,5); _ehScene.add(sunL);
  const fillL=new THREE.DirectionalLight(0x334466,0.3); fillL.position.set(-5,2,-3); _ehScene.add(fillL);

  // Earth — uses the same continent-based texture as the main scene
  const earthTex = _mkTex(512, 256, _pTexFns.Earth);
  _ehEarth=new THREE.Mesh(new THREE.SphereGeometry(1,64,64),
    new THREE.MeshStandardMaterial({map:earthTex,roughness:0.7,metalness:0.05}));
  _ehScene.add(_ehEarth);

  // Swap in real NASA texture when loaded
  loadRealEarthTexture((tex) => {
    if (tex && _ehEarth) {
      _ehEarth.material.map = tex;
      _ehEarth.material.needsUpdate = true;
    }
  });

  // Cloud layer
  const cloudTex = _mkTex(256, 128, (u,v,nx,ny,nz) => {
    const n1 = _sfbm(nx*4+10,ny*4+10,nz*4+10,4);
    const n2 = _sfbm(nx*8+20,ny*8,nz*8+20,3)*0.3;
    const cloud = Math.max(0, n1+n2-0.42)*2.5;
    const c = Math.min(255,(cloud*255)|0);
    return [c,c,c];
  });
  const cloudMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.015, 48, 48),
    new THREE.MeshStandardMaterial({ map: cloudTex, transparent: true, opacity: 0.4, depthWrite: false, roughness: 1, metalness: 0 })
  );
  _ehEarth.add(cloudMesh);

  // Atmosphere sprite
  const ac=document.createElement('canvas'); ac.width=128; ac.height=128;
  const ax=ac.getContext('2d'),ag=ax.createRadialGradient(64,64,44,64,64,64);
  ag.addColorStop(0,'rgba(60,140,255,0)'); ag.addColorStop(0.72,'rgba(60,140,255,0)');
  ag.addColorStop(0.86,'rgba(60,140,255,0.32)'); ag.addColorStop(1,'rgba(60,140,255,0)');
  ax.fillStyle=ag; ax.fillRect(0,0,128,128);
  const atmo=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(ac),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));
  atmo.scale.setScalar(2.65); _ehScene.add(atmo);

  // Stars
  const sp=new Float32Array(2000*3),sc=new Float32Array(2000*3);
  for(let i=0;i<2000;i++){
    const th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1),r=80+Math.random()*120;
    sp[i*3]=r*Math.sin(ph)*Math.cos(th);sp[i*3+1]=r*Math.sin(ph)*Math.sin(th);sp[i*3+2]=r*Math.cos(ph);
    const b=0.5+Math.random()*0.5;sc[i*3]=b*0.9;sc[i*3+1]=b*0.95;sc[i*3+2]=b;
  }
  const sGeo=new THREE.BufferGeometry();
  sGeo.setAttribute('position',new THREE.BufferAttribute(sp,3));
  sGeo.setAttribute('color',new THREE.BufferAttribute(sc,3));
  _ehScene.add(new THREE.Points(sGeo,new THREE.PointsMaterial({size:0.4,vertexColors:true,sizeAttenuation:true,transparent:true,opacity:0.8})));

  // Site markers
  const seen=new Set();
  LAUNCH_DATA.forEach(m=>{
    const key=`${m.siteLat},${m.siteLon}`; if(seen.has(key)) return; seen.add(key);
    const pos=_latlonTo3D(m.siteLat,m.siteLon);
    const mc=document.createElement('canvas'); mc.width=32; mc.height=32;
    const mx=mc.getContext('2d'),mg=mx.createRadialGradient(16,16,0,16,16,16);
    mg.addColorStop(0,'rgba(0,238,255,1)'); mg.addColorStop(0.4,'rgba(0,238,255,0.5)'); mg.addColorStop(1,'rgba(0,238,255,0)');
    mx.fillStyle=mg; mx.fillRect(0,0,32,32);
    const mkSp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(mc),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));
    mkSp.scale.setScalar(0.09); mkSp.position.copy(pos).multiplyScalar(1.015);
    _ehScene.add(mkSp); _ehSites[key]={sprite:mkSp,pos:pos.clone()};
  });

  // ── Animated launch trajectories (rockets launching from sites) ──
  _ehLaunches = [];
  const launchSites = [];
  const seenSites2 = new Set();
  LAUNCH_DATA.forEach(m => {
    const key = `${m.siteLat},${m.siteLon}`;
    if (seenSites2.has(key)) return; seenSites2.add(key);
    launchSites.push({ lat: m.siteLat, lon: m.siteLon });
  });

  // Create 4 cycling launch animations
  for (let i = 0; i < 4; i++) {
    const site = launchSites[i % launchSites.length];
    const origin = _latlonTo3D(site.lat, site.lon).multiplyScalar(1.02);

    // Trajectory curve: from surface up and out
    const apex = origin.clone().multiplyScalar(2.2);
    apex.x += (Math.random() - 0.5) * 0.5;
    apex.z += (Math.random() - 0.5) * 0.5;

    const curve = new THREE.QuadraticBezierCurve3(origin, apex, apex.clone().multiplyScalar(1.3));
    const pts = curve.getPoints(40);
    const trailPos = new Float32Array(40 * 3);
    const trailCol = new Float32Array(40 * 3);
    pts.forEach((p, j) => {
      trailPos[j*3] = p.x; trailPos[j*3+1] = p.y; trailPos[j*3+2] = p.z;
      const fade = 1 - j / 40;
      trailCol[j*3] = fade; trailCol[j*3+1] = fade * 0.7; trailCol[j*3+2] = fade * 0.3;
    });
    const tGeo = new THREE.BufferGeometry();
    tGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
    tGeo.setAttribute('color', new THREE.BufferAttribute(trailCol, 3));
    const trail = new THREE.Line(tGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.5, depthWrite: false }));
    _ehScene.add(trail);

    // Small rocket dot at the head
    const dotC = document.createElement('canvas'); dotC.width = 16; dotC.height = 16;
    const dotCtx = dotC.getContext('2d'), dotG = dotCtx.createRadialGradient(8,8,0,8,8,8);
    dotG.addColorStop(0, 'rgba(255,200,50,1)'); dotG.addColorStop(0.4, 'rgba(255,140,20,0.6)'); dotG.addColorStop(1, 'rgba(255,60,0,0)');
    dotCtx.fillStyle = dotG; dotCtx.fillRect(0,0,16,16);
    const dot = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(dotC), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
    dot.scale.setScalar(0.04);
    _ehScene.add(dot);

    _ehLaunches.push({ trail, dot, pts, progress: i * 0.25, site, speed: 0.12 + Math.random() * 0.08 });
  }

  // ── Orbiting objects (ISS, Hubble, etc.) ──
  _ehOrbits = [];
  const orbitDefs = [
    { name: 'ISS', r: 1.15, speed: 0.4, color: 0xffffff, size: 0.025 },
    { name: 'Hubble', r: 1.12, speed: 0.35, color: 0xaaccff, size: 0.018 },
    { name: 'Apollo', r: 1.25, speed: 0.15, color: 0xffcc44, size: 0.02 },
    { name: 'Starship', r: 1.18, speed: 0.3, color: 0xcccccc, size: 0.022 },
    { name: 'Tiangong', r: 1.14, speed: 0.38, color: 0xff8844, size: 0.02 },
  ];
  orbitDefs.forEach((od, i) => {
    // Orbit ring
    const ringGeo = new THREE.RingGeometry(od.r - 0.002, od.r + 0.002, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: od.color, side: THREE.DoubleSide, transparent: true, opacity: 0.08 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2 + (i - 2) * 0.15; // slight inclination variety
    ring.rotation.z = i * 0.3;
    _ehScene.add(ring);

    // Object sprite
    const oc = document.createElement('canvas'); oc.width = 16; oc.height = 16;
    const octx = oc.getContext('2d'), og = octx.createRadialGradient(8,8,0,8,8,8);
    const c3 = new THREE.Color(od.color);
    og.addColorStop(0, `rgba(${(c3.r*255)|0},${(c3.g*255)|0},${(c3.b*255)|0},1)`);
    og.addColorStop(0.5, `rgba(${(c3.r*255)|0},${(c3.g*255)|0},${(c3.b*255)|0},0.4)`);
    og.addColorStop(1, 'rgba(0,0,0,0)');
    octx.fillStyle = og; octx.fillRect(0,0,16,16);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(oc), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
    sp.scale.setScalar(od.size);
    _ehScene.add(sp);

    // Label
    const labelDiv = document.createElement('div');
    labelDiv.style.cssText = 'position:absolute;font-family:Orbitron,sans-serif;font-size:7px;color:rgba(0,238,255,0.5);letter-spacing:1px;pointer-events:none;white-space:nowrap';
    labelDiv.textContent = od.name;
    const container2 = document.getElementById('earth-canvas')?.parentElement;
    if (container2) container2.appendChild(labelDiv);

    _ehOrbits.push({ sprite: sp, ring, angle: i * 1.3, r: od.r, speed: od.speed, incX: ring.rotation.x, incZ: ring.rotation.z, label: labelDiv, name: od.name });
  });
}

function _ehAnimate(now=0){
  if(!_launchHistoryActive) return;
  requestAnimationFrame(_ehAnimate);
  if(!_ehRenderer||!_ehScene||!_ehCam) return;
  const dt=Math.min((now-_ehLastT)/1000,0.1); _ehLastT=now;
  _ehCamAngle+=dt*0.07;
  const cd=3.6,ce=0.45;
  _ehCam.position.set(Math.cos(_ehCamAngle)*cd,ce,Math.sin(_ehCamAngle)*cd);
  _ehCam.lookAt(0,0,0);
  _ehEarth.rotation.y+=dt*0.04;

  // Animate launch trajectories
  _ehLaunches.forEach(l => {
    l.progress += l.speed * dt;
    if (l.progress > 1.3) {
      // Reset with a new random site
      l.progress = 0;
      const sites = [];
      const seen3 = new Set();
      LAUNCH_DATA.forEach(m => {
        const k = `${m.siteLat},${m.siteLon}`;
        if (!seen3.has(k)) { seen3.add(k); sites.push({ lat: m.siteLat, lon: m.siteLon }); }
      });
      const site = sites[Math.floor(Math.random() * sites.length)];
      const origin = _latlonTo3D(site.lat, site.lon).multiplyScalar(1.02);
      const apex = origin.clone().multiplyScalar(2.2);
      apex.x += (Math.random() - 0.5) * 0.5;
      apex.z += (Math.random() - 0.5) * 0.5;
      const curve = new THREE.QuadraticBezierCurve3(origin, apex, apex.clone().multiplyScalar(1.3));
      l.pts = curve.getPoints(40);
      const p = l.trail.geometry.attributes.position.array;
      const c = l.trail.geometry.attributes.color.array;
      l.pts.forEach((pt, j) => {
        p[j*3] = pt.x; p[j*3+1] = pt.y; p[j*3+2] = pt.z;
        const fade = 1 - j / 40;
        c[j*3] = fade; c[j*3+1] = fade * 0.7; c[j*3+2] = fade * 0.3;
      });
      l.trail.geometry.attributes.position.needsUpdate = true;
      l.trail.geometry.attributes.color.needsUpdate = true;
    }
    // Draw partial trail up to current progress
    const drawCount = Math.min(40, Math.floor(l.progress * 40));
    l.trail.geometry.setDrawRange(0, Math.max(2, drawCount));
    l.trail.material.opacity = l.progress > 1 ? Math.max(0, 1 - (l.progress - 1) * 3.3) : 0.5;
    // Position dot at head
    if (drawCount > 0 && drawCount <= 40 && l.progress <= 1) {
      const pt = l.pts[Math.min(drawCount - 1, 39)];
      l.dot.position.set(pt.x, pt.y, pt.z);
      l.dot.visible = true;
    } else {
      l.dot.visible = false;
    }
  });

  // Animate orbiting objects
  const canvas = document.getElementById('earth-canvas');
  _ehOrbits.forEach(o => {
    o.angle += o.speed * dt;
    // Orbit in inclined plane
    const x = Math.cos(o.angle) * o.r;
    const z = Math.sin(o.angle) * o.r;
    // Apply inclination rotation
    const cosI = Math.cos(o.incX - Math.PI/2), sinI = Math.sin(o.incX - Math.PI/2);
    const cosZ = Math.cos(o.incZ), sinZ = Math.sin(o.incZ);
    const y2 = z * sinI;
    const z2 = z * cosI;
    const x3 = x * cosZ - y2 * sinZ;
    const y3 = x * sinZ + y2 * cosZ;
    o.sprite.position.set(x3, y3, z2);

    // Project to screen for label positioning
    if (o.label && canvas) {
      const proj = o.sprite.position.clone().project(_ehCam);
      if (proj.z > 0 && proj.z < 1) {
        const rect = canvas.getBoundingClientRect();
        const sx = (proj.x + 1) * 0.5 * rect.width;
        const sy = (-proj.y + 1) * 0.5 * rect.height;
        o.label.style.left = sx + 'px';
        o.label.style.top = (sy - 12) + 'px';
        o.label.style.display = '';
      } else {
        o.label.style.display = 'none';
      }
    }
  });

  _ehRenderer.render(_ehScene,_ehCam);
}

export function initLaunchHistory(getStarted) {
  _getStarted = getStarted;

  document.querySelectorAll('.lh-filter-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.lh-filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active'); _lhFilter=btn.dataset.org;
      _renderAll();
    });
  });
  document.getElementById('lh-back-btn').addEventListener('click',closeLaunchHistory);

  window.addEventListener('resize',()=>{
    if(_ehRenderer&&_launchHistoryActive){
      const canvas=document.getElementById('earth-canvas');
      if (!canvas) return;
      const container=canvas.parentElement;
      const w=container.clientWidth,h=container.clientHeight;
      if(w&&h){ _ehRenderer.setSize(w,h,false); _ehCam.aspect=w/h; _ehCam.updateProjectionMatrix(); }
    }
  });
}
