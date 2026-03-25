import * as THREE from 'three';
import { LAUNCH_DATA, ORG_COLORS, DEST_COLORS } from '../data/launchData.js';
import { _mkTex, _sfbm, _pTexFns } from './noiseUtils.js';

let _launchHistoryActive = false;
let _selectedMission     = null;
let _lhFilter            = 'All';
// Earth viewer state
let _ehRenderer=null,_ehScene=null,_ehCam=null,_ehEarth=null;
let _ehSites={};
let _ehTrajLine=null,_ehTrajPts=null,_ehTrajT=0;
let _ehCamAngle=0,_ehLastT=0;

let _getStarted = () => false;

function _getOC(org){ return ORG_COLORS[org]||{css:'#8ac',bg:'rgba(136,170,204,0.1)',bd:'rgba(136,170,204,0.28)'}; }

export function openLaunchHistory() {
  _launchHistoryActive = true;
  document.getElementById('launch-history').classList.add('open');
  _renderMissionList();
  setTimeout(() => { _initEarthViewer(); _renderMissionList(); }, 60);
  requestAnimationFrame(t => { _ehLastT=t; _ehAnimate(t); });
}
export function closeLaunchHistory() {
  _launchHistoryActive = false;
  document.getElementById('launch-history').classList.remove('open');
  if (!_getStarted()) {
    const sp = document.getElementById('splash');
    sp.classList.remove('hidden'); sp.style.opacity='';
  }
}

function _renderMissionList() {
  const list = document.getElementById('lh-mission-list');
  if (!list) return;
  list.innerHTML = '';
  const filt = LAUNCH_DATA.filter(m => _lhFilter==='All' || m.org===_lhFilter ||
    (_lhFilter==='Roscosmos' && (m.org==='Soviet'||m.org==='Roscosmos')));
  filt.forEach(m => {
    const oc=_getOC(m.org);
    const div=document.createElement('div');
    div.className='lh-mission-item'+(_selectedMission?.id===m.id?' active':'');
    const d=new Date(m.date+'T00:00:00Z');
    const ds=d.toLocaleDateString('en-US',{timeZone:'UTC',month:'short',day:'numeric',year:'numeric'});
    div.innerHTML=`<div class="lh-mission-date">${ds}</div><div class="lh-mission-name">${m.name}</div>`+
      `<span class="lh-mission-org" style="background:${oc.bg};border:1px solid ${oc.bd};color:${oc.css}">${m.org}</span>`;
    div.addEventListener('click',()=>selectMission(m.id));
    list.appendChild(div);
  });
}

function selectMission(id) {
  _selectedMission=LAUNCH_DATA.find(m=>m.id===id); if(!_selectedMission) return;
  _renderMissionList(); _renderDetail(); _showTrajectory(_selectedMission);
  // Orient camera toward launch site longitude
  const lo=_selectedMission.siteLon*Math.PI/180;
  _ehCamAngle = -lo - Math.PI*0.5;
}

function _renderDetail() {
  const panel=document.getElementById('lh-detail-panel'); if(!panel) return;
  const m=_selectedMission;
  if(!m){panel.innerHTML='<div class="lh-detail-empty">SELECT A MISSION<br>TO VIEW DETAILS</div>';return;}
  const oc=_getOC(m.org);
  const stext=m.status==='success'?'✓ SUCCESS':m.status==='failed'?'✗ FAILED':'⚠ PARTIAL';
  const dc=DEST_COLORS[m.destType]||'#0ef';
  const mass=m.mass>=1000?(m.mass/1000).toFixed(1)+' t':m.mass+' kg';
  const d=new Date(m.date+'T00:00:00Z');
  const ds=d.toLocaleDateString('en-US',{timeZone:'UTC',weekday:'short',month:'long',day:'numeric',year:'numeric'});
  const firsts=m.firsts.map(f=>`<div class="lh-first-item">${f}</div>`).join('');
  panel.innerHTML=
    `<span class="lh-detail-org-badge" style="background:${oc.bg};border:1px solid ${oc.bd};color:${oc.css};font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:2px;padding:3px 10px;border-radius:2px">${m.org}</span>`+
    `<div class="lh-detail-name">${m.name}</div>`+
    `<div class="lh-detail-date">${ds}</div>`+
    `<span class="lh-detail-status ${m.status}">${stext}</span>`+
    `<div class="lh-detail-desc">${m.desc}</div>`+
    `<div class="lh-stats-grid">`+
      `<div class="lh-stat"><div class="lh-stat-label">Rocket</div><div class="lh-stat-value" style="font-size:9px">${m.rocket}</div></div>`+
      `<div class="lh-stat"><div class="lh-stat-label">Launch Site</div><div class="lh-stat-value" style="font-size:9px">${m.site}</div></div>`+
      `<div class="lh-stat"><div class="lh-stat-label">Destination</div><div class="lh-stat-value" style="color:${dc}">${m.destination}</div></div>`+
      `<div class="lh-stat"><div class="lh-stat-label">Payload Mass</div><div class="lh-stat-value">${mass}</div></div>`+
    `</div>`+
    `<div class="lh-firsts-title">KEY MILESTONES</div>${firsts}`;
}

// ─── Earth Viewer ────────────────────────────────────────────────

function _latlonTo3D(lat,lon){
  const la=lat*Math.PI/180,lo=lon*Math.PI/180;
  return new THREE.Vector3(Math.cos(la)*Math.cos(lo),Math.sin(la),Math.cos(la)*Math.sin(lo));
}

function _initEarthViewer(){
  if(_ehRenderer) return;
  const canvas=document.getElementById('earth-canvas');
  const w=canvas.offsetWidth||700,h=canvas.offsetHeight||500;
  _ehRenderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
  _ehRenderer.setSize(w,h); _ehRenderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  _ehRenderer.setClearColor(0x010208,1);
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
}

function _showTrajectory(m){
  if(_ehTrajLine){_ehScene.remove(_ehTrajLine);_ehTrajLine=null;}
  // Reset all site marker sizes
  Object.values(_ehSites).forEach(s=>s.sprite.scale.setScalar(0.09));
  // Highlight selected site
  const key=`${m.siteLat},${m.siteLon}`;
  if(_ehSites[key]) _ehSites[key].sprite.scale.setScalar(0.16);

  const startP=_latlonTo3D(m.siteLat,m.siteLon);
  let endP,ctrl,col;
  switch(m.destType){
    case 'LEO':       endP=startP.clone().applyAxisAngle(new THREE.Vector3(0.1,1,0.1).normalize(),1.2); ctrl=1.6;  col=0x00aaff; break;
    case 'ISS':       endP=startP.clone().applyAxisAngle(new THREE.Vector3(0.15,1,0.05).normalize(),1.4); ctrl=1.7; col=0x44ffaa; break;
    case 'GTO':       endP=startP.clone().applyAxisAngle(new THREE.Vector3(0.2,1,0.1).normalize(),1.8); ctrl=2.4;  col=0xffaa00; break;
    case 'Moon':      endP=new THREE.Vector3(7,2,4);  ctrl=5.0;  col=0xeeeeff; break;
    case 'Mars':      endP=new THREE.Vector3(14,4,9); ctrl=9.0;  col=0xff6633; break;
    case 'Deep':      endP=new THREE.Vector3(20,6,13);ctrl=13.0; col=0xaa44ff; break;
    case 'Suborbital':endP=startP.clone().applyAxisAngle(new THREE.Vector3(0,1,0.1).normalize(),0.5); ctrl=1.4; col=0x44ffff; break;
    default:          endP=startP.clone().applyAxisAngle(new THREE.Vector3(0.1,1,0).normalize(),1.0); ctrl=1.5; col=0x00aaff;
  }
  const midP=startP.clone().add(endP).multiplyScalar(0.5).normalize().multiplyScalar(ctrl);
  const curve=new THREE.QuadraticBezierCurve3(startP,midP,endP);
  _ehTrajPts=curve.getPoints(60);
  const geo=new THREE.BufferGeometry().setFromPoints(_ehTrajPts);
  geo.setDrawRange(0,1);
  _ehTrajLine=new THREE.Line(geo,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:0.9}));
  _ehScene.add(_ehTrajLine);
  _ehTrajT=0;
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
  if(_ehTrajLine&&_ehTrajPts&&_ehTrajT<1){
    _ehTrajT=Math.min(1,_ehTrajT+dt*0.42);
    _ehTrajLine.geometry.setDrawRange(0,Math.max(2,Math.floor(_ehTrajT*_ehTrajPts.length)));
  }
  _ehRenderer.render(_ehScene,_ehCam);
}

export function initLaunchHistory(getStarted) {
  _getStarted = getStarted;

  document.querySelectorAll('.lh-filter-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.lh-filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active'); _lhFilter=btn.dataset.org; _renderMissionList();
    });
  });
  document.getElementById('lh-back-btn').addEventListener('click',closeLaunchHistory);

  window.addEventListener('resize',()=>{
    if(_ehRenderer&&_launchHistoryActive){
      const canvas=document.getElementById('earth-canvas');
      const w=canvas.offsetWidth,h=canvas.offsetHeight;
      if(w&&h){ _ehRenderer.setSize(w,h); _ehCam.aspect=w/h; _ehCam.updateProjectionMatrix(); }
    }
  });
}
