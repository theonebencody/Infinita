import * as THREE from 'three';
import { sampleContinent } from './continentData.js';

// --- Value noise utilities ---
export function _hash(n) { return ((Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1; }

export function _sN(x, y, z) {
  const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z);
  const fx=x-ix,fy=y-iy,fz=z-iz;
  const ux=fx*fx*(3-2*fx),uy=fy*fy*(3-2*fy),uz=fz*fz*(3-2*fz);
  const h=_hash;
  return h(ix+iy*57+iz*113)*(1-ux)*(1-uy)*(1-uz)+h(ix+1+iy*57+iz*113)*ux*(1-uy)*(1-uz)+
         h(ix+(iy+1)*57+iz*113)*(1-ux)*uy*(1-uz)+h(ix+1+(iy+1)*57+iz*113)*ux*uy*(1-uz)+
         h(ix+iy*57+(iz+1)*113)*(1-ux)*(1-uy)*uz+h(ix+1+iy*57+(iz+1)*113)*ux*(1-uy)*uz+
         h(ix+(iy+1)*57+(iz+1)*113)*(1-ux)*uy*uz+h(ix+1+(iy+1)*57+(iz+1)*113)*ux*uy*uz;
}

export function _sfbm(x,y,z,oct){ let v=0,a=0.5,f=1; for(let i=0;i<oct;i++){v+=_sN(x*f,y*f,z*f)*a;a*=0.5;f*=2;} return v; }

// Equirectangular texture generator: fn(u,v,nx,ny,nz,lat,lon) -> [r,g,b] 0-255
export function _mkTex(w,h,fn){
  const c=document.createElement('canvas'); c.width=w; c.height=h;
  const ctx=c.getContext('2d'),img=ctx.createImageData(w,h);
  for(let j=0;j<h;j++){
    const lat=Math.PI*(j/h-0.5),v=j/h;
    for(let i=0;i<w;i++){
      const lon=Math.PI*2*(i/w)-Math.PI,u=i/w;
      const nx=Math.cos(lat)*Math.cos(lon),ny=Math.sin(lat),nz=Math.cos(lat)*Math.sin(lon);
      const rgb=fn(u,v,nx,ny,nz,lat,lon);
      const k=(j*w+i)*4; img.data[k]=rgb[0]|0; img.data[k+1]=rgb[1]|0; img.data[k+2]=rgb[2]|0; img.data[k+3]=255;
    }
  }
  ctx.putImageData(img,0,0); return new THREE.CanvasTexture(c);
}

// --- Real texture loader for all solar system bodies (NASA/public domain) ---
// Solar System Scope textures (CC BY 4.0) — high quality equirectangular maps
const SSS = 'https://www.solarsystemscope.com/textures/download';
const _REAL_TEX_URLS = {
  Sun:     [`${SSS}/2k_sun.jpg`],
  Mercury: [`${SSS}/2k_mercury.jpg`],
  Venus:   [`${SSS}/2k_venus_atmosphere.jpg`],
  Earth:   ['https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg', `${SSS}/2k_earth_daymap.jpg`],
  Mars:    [`${SSS}/2k_mars.jpg`],
  Jupiter: [`${SSS}/2k_jupiter.jpg`],
  Saturn:  [`${SSS}/2k_saturn.jpg`],
  Uranus:  [`${SSS}/2k_uranus.jpg`],
  Neptune: [`${SSS}/2k_neptune.jpg`],
  Moon:    [`${SSS}/2k_moon.jpg`],
  SaturnRing: [`${SSS}/2k_saturn_ring_alpha.png`],
};

const _texCache = {};   // name → THREE.Texture
const _texLoading = {}; // name → boolean
const _texQueues = {};  // name → callback[]

const _texLoader = new THREE.TextureLoader();
_texLoader.setCrossOrigin('anonymous');

export function loadRealTexture(name, callback) {
  if (_texCache[name]) { callback(_texCache[name]); return; }
  if (!_texQueues[name]) _texQueues[name] = [];
  _texQueues[name].push(callback);
  if (_texLoading[name]) return;
  _texLoading[name] = true;

  const urls = _REAL_TEX_URLS[name];
  if (!urls || !urls.length) { _texLoading[name] = false; callback(null); return; }

  let idx = 0;
  function tryNext() {
    if (idx >= urls.length) {
      _texLoading[name] = false;
      (_texQueues[name] || []).forEach(cb => cb(null));
      _texQueues[name] = [];
      return;
    }
    _texLoader.load(
      urls[idx],
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        _texCache[name] = tex;
        _texLoading[name] = false;
        (_texQueues[name] || []).forEach(cb => cb(tex));
        _texQueues[name] = [];
      },
      undefined,
      () => { idx++; tryNext(); }
    );
  }
  tryNext();
}

// Backward compat wrapper
export function loadRealEarthTexture(callback) { loadRealTexture('Earth', callback); }

// --- Planet texture functions ---
export const _pTexFns={
  Earth:(u,v,nx,ny,nz,lat)=>{
    const latD=lat*180/Math.PI;
    const land=sampleContinent(u,v); // 0=ocean, 1=land
    const n=_sfbm(nx*3,ny*3,nz*3,4);
    const detail=_sfbm(nx*8,ny*8,nz*8,3);

    // Ice caps
    const iceEdge=68+n*10;
    if(Math.abs(latD)>iceEdge){
      const iceFade=Math.min(1,(Math.abs(latD)-iceEdge)/8);
      return [(220+detail*35)*iceFade+(!iceFade?0:0)|0,(235+detail*20)*iceFade|0,(250+detail*5)|0];
    }

    if(land>0.45){
      // Land
      const elev=land*0.6+n*0.4; // terrain height
      const absLat=Math.abs(latD);
      if(elev>0.82){
        // Mountains/highlands — snowy peaks at high elevation
        const snow=elev>0.92?0.6:0;
        return [(140+detail*40+snow*80)|0,(115+detail*35+snow*90)|0,(85+detail*25+snow*80)|0];
      }
      if(absLat>50){
        // Boreal/tundra — darker greens, browns
        return [(55+n*50+detail*25)|0,(75+n*45+detail*20)|0,(40+n*25)|0];
      }
      if(absLat>25){
        // Temperate — greens
        return [(30+n*40+detail*20)|0,(95+n*55+detail*25)|0,(20+n*20)|0];
      }
      // Tropical — vibrant greens + some desert
      const desert=_sfbm(nx*5+3,ny*5,nz*5,2);
      if(desert>0.6&&absLat>10){
        return [(180+detail*40)|0,(155+detail*30)|0,(95+detail*25)|0]; // desert/savanna
      }
      return [(15+n*35+detail*20)|0,(100+n*60+detail*30)|0,(10+n*15)|0];
    }

    // Coastline transition
    if(land>0.3){
      const blend=((land-0.3)/0.15);
      const or=10+detail*15, og=50+detail*40, ob=110+detail*55;
      const lr=40+n*40, lg=90+n*50, lb=30+n*20;
      return [(or+(lr-or)*blend)|0,(og+(lg-og)*blend)|0,(ob+(lb-ob)*blend)|0];
    }

    // Ocean
    const depth=_sfbm(nx*6,ny*6,nz*6,3);
    const shallow=land>0.15?0.3:0;
    return [(8+depth*18+shallow*25)|0,(38+depth*40+shallow*30)|0,(95+depth*65+shallow*15)|0];
  },
  Mars:(u,v,nx,ny,nz,lat)=>{
    const latD=lat*180/Math.PI,n=_sfbm(nx*4,ny*4,nz*4,4);
    // Polar ice caps
    if(Math.abs(latD)>70+n*10) return [235,245,255];
    // Olympus Mons (~18°N, 226°E → u≈0.628+0.5=0.128 wrapped)
    const omLat=latD-18, omLon=((u+0.5)%1-0.128)*360;
    const omDist=Math.sqrt(omLat*omLat+omLon*omLon);
    if(omDist<8) return [(195+n*30)|0,(130+n*25)|0,(90+n*20)|0]; // bright shield volcano
    // Valles Marineris (~-14°, 290°E → u≈0.306)
    const vmLat=latD+14, vmLon=((u+0.5)%1-0.306)*360;
    if(Math.abs(vmLat)<3&&Math.abs(vmLon)<28){
      const vmDepth=Math.max(0,1-Math.abs(vmLat)/3);
      return [(100+n*30)*vmDepth+(140+n*60)*(1-vmDepth)|0,(45+n*20)*vmDepth+(68+n*38)*(1-vmDepth)|0,(30+n*15)*vmDepth+(42+n*22)*(1-vmDepth)|0];
    }
    const cr=_sfbm(nx*12+5,ny*12,nz*12,2);
    const detail=_sfbm(nx*7,ny*7,nz*7,3);
    return (cr>0.63&&cr<0.67)?[165,100,80]:[(135+n*55+detail*15)|0,(65+n*35+detail*10)|0,(38+n*22+detail*8)|0];
  },
  Jupiter:(u,v,nx,ny,nz,lat)=>{
    const latD=lat*180/Math.PI;
    const turb=_sfbm(nx*3,ny*1.5,nz*3,3)*8;
    const bandRaw=Math.sin((latD+turb)*0.32)*0.5+0.5;
    // Multiple band colors
    const zone=Math.sin(latD*0.16+turb*0.3)*0.5+0.5; // secondary frequency
    const r=160+bandRaw*55+zone*25;
    const g=100+bandRaw*50+zone*20-bandRaw*zone*15;
    const b=60+bandRaw*25+zone*15;
    // Great Red Spot with swirl
    const grsLat=latD+23, grsLon=((u-0.5)*360-5);
    const grsDist=Math.sqrt((grsLat/8)**2+(grsLon/16)**2);
    if(grsDist<1){
      const swirl=_sfbm(nx*6+grsLon*0.02,ny*6,nz*6+grsLat*0.02,3);
      const fade=1-grsDist;
      const sr=r+fade*65+swirl*20, sg=g-fade*40-swirl*15, sb=b-fade*30-swirl*10;
      return [Math.min(255,sr|0),Math.max(0,sg|0),Math.max(0,sb|0)];
    }
    // Small white ovals
    const wo1Lat=latD-33, wo1Lon=((u-0.5)*360-40);
    if(Math.sqrt(wo1Lat*wo1Lat+wo1Lon*wo1Lon/4)<5) return [Math.min(255,(r+40)|0),Math.min(255,(g+45)|0),Math.min(255,(b+35)|0)];
    return [Math.min(255,r|0),Math.min(255,g|0),Math.min(255,b|0)];
  },
  Saturn:(u,v,nx,ny,nz,lat)=>{
    const latD=lat*180/Math.PI;
    const turb=_sfbm(nx*2,ny*8,nz*2,3)*4;
    const band=Math.sin((latD+turb)*0.35)*0.5+0.5;
    const zone=Math.sin(latD*0.18+turb*0.2)*0.5+0.5;
    const detail=_sfbm(nx*5,ny*5,nz*5,2)*0.12;
    // Hexagonal polar vortex hint at north pole
    const hexMod=Math.abs(latD)>75?Math.cos(6*((u*Math.PI*2)+latD*0.05))*0.08:0;
    return [(188+band*45+zone*18+detail*30+hexMod*25)|0,(158+band*38+zone*15+detail*25)|0,(95+band*22+zone*10+detail*15)|0];
  },
  Venus:(u,v,nx,ny,nz)=>{
    const n=_sfbm(nx*3+1,ny*4,nz*3,4);
    const sw=_sfbm(nx*8,ny*2,nz*8,2)*0.3;
    // Thicker cloud band swirls
    const swirl=_sfbm(nx*2+n*2,ny*6+n,nz*2,3)*0.2;
    const band=Math.sin(ny*6+swirl*12)*0.5+0.5;
    return [(195+n*45+band*15+sw*20)|0,(152+n*38+band*12+sw*15)|0,(70+n*28+band*8)|0];
  },
  Mercury:(u,v,nx,ny,nz)=>{
    const n=_sfbm(nx*5,ny*5,nz*5,4);
    const cr=_sfbm(nx*15+3,ny*15,nz*15,2);
    const cr2=_sfbm(nx*22+7,ny*22,nz*22,2); // more craters
    const detail=_sfbm(nx*10,ny*10,nz*10,3)*0.15;
    // Caloris Basin (~30°N, 170°E)
    const cbLat=ny*90-30, cbLon=((u+0.5)%1-0.472)*360;
    const cbDist=Math.sqrt(cbLat*cbLat+cbLon*cbLon);
    const cbEffect=cbDist<18?Math.max(0,1-cbDist/18)*0.15:0;
    const base=(cr>0.63&&cr<0.67)||(cr2>0.65&&cr2<0.68)?1:0;
    return base?[155+cbEffect*60,150+cbEffect*55,145+cbEffect*50]:
      [(95+n*58+detail*30+cbEffect*60)|0,(90+n*53+detail*25+cbEffect*55)|0,(85+n*48+detail*20+cbEffect*50)|0];
  },
  Uranus:(u,v,nx,ny,nz,lat)=>{
    const latD=lat*180/Math.PI;
    const band=Math.sin(latD*0.22)*0.5+0.5;
    const n=_sfbm(nx*3,ny*3,nz*3,2)*0.15;
    const haze=_sfbm(nx*1.5,ny*4,nz*1.5,3)*0.1;
    // Subtle banded haze
    return [(55+band*25+n*20+haze*15)|0,(172+band*35+n*22+haze*10)|0,(185+band*35+n*22+haze*8)|0];
  },
  Neptune:(u,v,nx,ny,nz,lat)=>{
    const latD=lat*180/Math.PI;
    const n=_sfbm(nx*4,ny*4,nz*4,4);
    const band=Math.sin(latD*0.25+n*3)*0.5+0.5;
    // Great Dark Spot (~-20°lat)
    const gdsLat=latD+20, gdsLon=((u-0.5)*360+30);
    const gdsDist=Math.sqrt((gdsLat/10)**2+(gdsLon/18)**2);
    const gds=gdsDist<1?Math.max(0,1-gdsDist)*0.4:0;
    // Bright companion cloud
    const bcLat=latD+15, bcLon=((u-0.5)*360+10);
    const bcDist=Math.sqrt(bcLat*bcLat+(bcLon*bcLon)/9);
    const bc=bcDist<5?Math.max(0,1-bcDist/5)*0.3:0;
    return [(15+n*28+band*12-gds*35+bc*80)|0,(42+n*38+band*18-gds*25+bc*85)|0,(145+n*60+band*20-gds*15+bc*50)|0];
  }
};
