import * as THREE from 'three';
import {PartSet} from './parts.js';

// Sculpted cross sections. The profile runs up the left side, over the top
// and down the right; `tumble` narrows the upper edge for glasshouses.
const PROFILE=[[-.84,0],[-.965,.09],[-1,.28],[-.995,.5],[-.965,.7],[-.88,.87],[-.66,.98],[-.3,1],[.3,1],[.66,.98],[.88,.87],[.965,.7],[.995,.5],[1,.28],[.965,.09],[.84,0]];
const SLAB=[[-1,0],[-1,1],[1,1],[1,0]];
export function loft(sections,{profile=PROFILE,tumble=1}={}){
  const N=profile.length,side=[],cap=[],sideIndex=[],capIndex=[];
  const point=(s,[x,y])=>{const k=1+((s.tumble??tumble)-1)*y;return [x*s.w*k+(s.x||0),s.low+y*(s.high-s.low),s.z];};
  sections.forEach(s=>profile.forEach(p=>side.push(...point(s,p))));
  for(let i=0;i<sections.length-1;i++)for(let j=0;j<N;j++){const a=i*N+j,b=i*N+(j+1)%N,c=a+N,d=b+N;sideIndex.push(a,c,b,b,c,d);}
  // End caps keep their own vertices so the sides stay smoothly shaded.
  for(const [k,s]of [[0,sections[0]],[1,sections.at(-1)]]){const base=cap.length/3;profile.forEach(p=>cap.push(...point(s,p)));for(let j=1;j<N-1;j++)k?capIndex.push(base,base+j+1,base+j):capIndex.push(base,base+j,base+j+1);}
  const a=new THREE.BufferGeometry();a.setAttribute('position',new THREE.Float32BufferAttribute(side,3));a.setIndex(sideIndex);a.computeVertexNormals();
  const b=new THREE.BufferGeometry();b.setAttribute('position',new THREE.Float32BufferAttribute(cap,3));b.setIndex(capIndex);b.computeVertexNormals();
  const g=new THREE.BufferGeometry(),A=a.toNonIndexed(),B=b.toNonIndexed();
  for(const name of ['position','normal'])g.setAttribute(name,new THREE.Float32BufferAttribute([...A.attributes[name].array,...B.attributes[name].array],3));
  [a,b,A,B].forEach(x=>x.dispose());return g;
}
function sample(sections,z){
  if(z<=sections[0].z)return {...sections[0]};if(z>=sections.at(-1).z)return {...sections.at(-1)};
  for(let i=1;i<sections.length;i++)if(z<=sections[i].z){const a=sections[i-1],b=sections[i],t=(z-a.z)/(b.z-a.z),out={z};for(const k of ['w','low','high','tumble'])out[k]=(a[k]??1)+((b[k]??1)-(a[k]??1))*t;return out;}
}
const B=(z,w,low,high,tumble)=>({z,w,low,high,tumble});
// Archetypes give the player, rivals and civilian traffic distinct silhouettes.
export const VEHICLE_KINDS={
  coupe:{body:[B(-2.25,.78,.37,.6,.92),B(-2.13,.95,.3,.69),B(-1.88,1.04,.28,.77),B(-1.25,1.07,.28,.85),B(-.78,1.075,.28,.9),B(.35,1.065,.28,.93),B(1.1,1.095,.28,.95),B(1.78,1.075,.3,.95),B(2.12,.99,.34,.9),B(2.26,.84,.42,.82)],
    canopy:[B(-.9,.86,.84,.9,.86),B(-.32,.82,.86,1.29,.76),B(.12,.8,.88,1.37,.74),B(.74,.78,.88,1.36,.74),B(1.36,.82,.88,1.08,.8),B(1.78,.88,.9,.95,.9)],
    wheel:{r:.42,w:.3,x:.99,z:[-1.38,1.42]},lamps:{y:.79,z:2.2,x:.56,w:.66},head:{y:.64,z:-2.13,x:.68},exhaust:[.62,.36,2.24],stripes:true,spoiler:'lip'},
  gt:{body:[B(-2.3,.82,.33,.52,.9),B(-2.16,1.0,.27,.62),B(-1.85,1.1,.25,.72),B(-1.2,1.12,.25,.79),B(-.7,1.11,.25,.83),B(.4,1.1,.25,.86),B(1.12,1.15,.25,.9),B(1.82,1.12,.27,.9),B(2.18,1.03,.32,.86),B(2.3,.88,.4,.78)],
    canopy:[B(-.72,.84,.78,.83,.84),B(-.18,.8,.8,1.19,.72),B(.3,.78,.82,1.25,.7),B(.86,.76,.82,1.23,.72),B(1.42,.82,.82,.99,.8),B(1.8,.88,.84,.88,.9)],
    wheel:{r:.42,w:.34,x:1.03,z:[-1.42,1.46]},lamps:{y:.74,z:2.25,x:.58,w:.7},head:{y:.58,z:-2.18,x:.72},exhaust:[.5,.33,2.28],wing:true,splitter:true},
  sedan:{body:[B(-2.28,.86,.4,.68,.95),B(-2.12,.98,.34,.8),B(-1.7,1.03,.32,.86),B(-.9,1.04,.32,.9),B(.6,1.04,.32,.92),B(1.6,1.03,.32,.94),B(2.12,.97,.36,.92),B(2.26,.86,.44,.86)],
    canopy:[B(-1.02,.88,.86,.92,.88),B(-.45,.85,.88,1.44,.82),B(.95,.84,.9,1.46,.82),B(1.45,.86,.9,1.06,.86),B(1.72,.9,.9,.95,.92)],
    wheel:{r:.4,w:.26,x:.95,z:[-1.42,1.42]},lamps:{y:.84,z:2.22,x:.6,w:.5},head:{y:.72,z:-2.15,x:.68},exhaust:[.55,.38,2.24]},
  hatch:{body:[B(-2.0,.86,.4,.7,.95),B(-1.86,.97,.34,.82),B(-1.4,1.02,.32,.88),B(-.7,1.03,.32,.93),B(.8,1.03,.32,.96),B(1.62,1.0,.34,.98),B(1.84,.92,.4,.96)],
    canopy:[B(-.82,.88,.88,.95,.88),B(-.25,.85,.9,1.48,.84),B(1.2,.84,.9,1.5,.84),B(1.62,.86,.92,1.34,.86),B(1.76,.88,.94,1.0,.9)],
    wheel:{r:.38,w:.25,x:.93,z:[-1.22,1.25]},lamps:{y:1.0,z:1.8,x:.66,w:.36},head:{y:.74,z:-1.94,x:.64},exhaust:[.5,.4,1.86]},
  suv:{body:[B(-2.3,.92,.5,.86,.96),B(-2.14,1.03,.44,1.0),B(-1.7,1.08,.42,1.08),B(-.9,1.09,.42,1.12),B(.9,1.09,.42,1.14),B(1.9,1.07,.44,1.14),B(2.22,1.0,.48,1.1),B(2.3,.92,.56,1.04)],
    canopy:[B(-1.0,.94,1.06,1.12,.92),B(-.45,.92,1.08,1.74,.88),B(1.75,.92,1.1,1.78,.9),B(2.1,.94,1.1,1.6,.92),B(2.22,.95,1.1,1.14,.95)],
    wheel:{r:.47,w:.32,x:1.0,z:[-1.45,1.5]},lamps:{y:1.12,z:2.26,x:.74,w:.34},head:{y:.92,z:-2.2,x:.7},exhaust:[.6,.48,2.3],rack:true},
  van:{body:[B(-2.4,.92,.46,.86,.96),B(-2.22,1.04,.4,1.0),B(-1.7,1.08,.38,1.1),B(-1.2,1.1,.38,1.14),B(2.25,1.1,.38,1.16),B(2.4,1.04,.42,1.12)],
    canopy:[B(-1.62,1.0,1.06,1.12,.94),B(-1.0,1.0,1.08,2.02,.94),B(2.28,1.04,1.1,2.06,.95),B(2.38,1.0,1.1,1.2,.96)],
    wheel:{r:.44,w:.3,x:1.0,z:[-1.6,1.55]},lamps:{y:1.12,z:2.38,x:.86,w:.22},head:{y:.86,z:-2.32,x:.74},exhaust:[.6,.44,2.38],panelRoof:true}
};
export const TRAFFIC_KINDS=['sedan','hatch','suv','sedan','van'];

const DARK=0x15212c,RUBBER=0x1a1e23,CHROME=0xc9d4da,TRIM=0x26333f;
const box=new THREE.BoxGeometry(1,1,1),cyl=new THREE.CylinderGeometry(1,1,1,20),disc=new THREE.CircleGeometry(1,20,0,Math.PI),round=new THREE.SphereGeometry(1,12,8);
const wheelCache=new Map();
function wheelGeometry(spec){
  const key=spec.r+':'+spec.w;if(wheelCache.has(key))return wheelCache.get(key);
  const p=new PartSet(),r=spec.r,w=spec.w,Z=Math.PI/2;
  p.add('w',cyl,RUBBER,0,0,0,r,w,r,0,0,Z);
  p.add('w',cyl,0x2c333b,0,0,0,r*.93,w+.012,r*.93,0,0,Z);
  for(const s of [-1,1]){
    p.add('w',cyl,0x8f9ca6,s*(w*.5+.004),0,0,r*.66,.02,r*.66,0,0,Z);
    p.add('w',cyl,0x39434d,s*(w*.5+.01),0,0,r*.5,.012,r*.5,0,0,Z);
    for(let a=0;a<5;a++)p.add('w',box,CHROME,s*(w*.5+.016),0,0,.035,r*1.22,.075,a*Math.PI*2/5,0,0);
    p.add('w',cyl,0xe4ecef,s*(w*.5+.024),0,0,r*.16,.014,r*.16,0,0,Z);
  }
  const g=p.merge('w');wheelCache.set(key,g);return g;
}
const vehicleCache=new Map();
// Returns shared geometries and anchor points; materials stay with the scene.
export function vehicleParts(kind='coupe'){
  if(vehicleCache.has(kind))return vehicleCache.get(kind);
  const k=VEHICLE_KINDS[kind]||VEHICLE_KINDS.coupe,p=new PartSet(),body=k.body,canopy=k.canopy,wheel=k.wheel;
  const front=body[0].z,rear=body.at(-1).z,top=Math.max(...canopy.map(c=>c.high));
  p.add('paint',loft(body),0xffffff);
  p.add('glass',loft(canopy),0xffffff);
  // A painted roof panel and pillars keep the glasshouse from looking like a bubble.
  const roofZ=canopy.filter(c=>c.high>top-.1).map(c=>c.z),r0=Math.min(...roofZ)-.16,r1=Math.max(...roofZ)+.14;
  const roof=[r0,r0+.08,(r0+r1)/2,r1-.08,r1].map((z,i)=>{const c=sample(canopy,z),edge=i===0||i===4;return B(z,c.w*c.tumble*(edge?.84:.9),c.high-(edge?.07:.13),c.high+.018,.94);});
  p.add('paint',loft(roof),0xffffff);
  for(const s of [-1,1]){
    // Wheel wells and painted flares define each arch from the chase camera.
    for(const z of wheel.z){
      const sec=sample(body,z),x=s*(sec.w*.985);
      p.add('trim',disc,0x0b1218,x+s*.012,wheel.r*.98,z,wheel.r*1.18,wheel.r*1.18,1,0,s*Math.PI/2,0);
      const flare=new THREE.TorusGeometry(wheel.r*1.2,.055,5,14,Math.PI);p.add('paint',flare,0xffffff,x+s*.02,wheel.r*.98,z,1,1,1.6,0,s*Math.PI/2,0);flare.dispose();
    }
    // Side skirt, mirror and window line.
    p.add('trim',box,TRIM,s*(sample(body,0).w*.97),body[3].low+.07,(wheel.z[0]+wheel.z[1])/2,.06,.1,wheel.z[1]-wheel.z[0]-wheel.r*2.3);
    const m=sample(canopy,canopy[0].z+.25),mx=s*(sample(body,canopy[0].z+.2).w*.93);
    p.add('paint',round,0xffffff,mx+s*.1,m.low+.09,canopy[0].z+.22,.12,.07,.09);p.add('trim',box,DARK,mx+s*.04,m.low+.04,canopy[0].z+.25,.12,.03,.05);
    p.add('trim',box,CHROME,s*(sample(body,.4).w*.985),sample(body,.4).high-.03,(canopy[0].z+canopy.at(-1).z)/2,.015,.022,(canopy.at(-1).z-canopy[0].z)*.82);
    // Head lamps and running lights.
    const lampZ=front+.13,lamp=sample(body,lampZ),ly=Math.min(k.head.y,lamp.high-.07);
    p.add('trim',box,0x0d151c,s*k.head.x,ly,lampZ,.42,.12,.2,0,s*.16,0);
    p.add('lights',box,0xfff8e6,s*k.head.x,ly+.005,lampZ-.012,.36,.07,.2,0,s*.16,0);
    p.add('lights',box,0xbfefff,s*(k.head.x-.02),ly-.075,lampZ-.004,.28,.02,.2,0,s*.16,0);
    // Exhaust tips sit where the boost jets originate.
    const [ex,ey,ez]=k.exhaust;p.add('trim',cyl,CHROME,s*ex,ey,ez,.07,.12,.07,Math.PI/2,0,0);p.add('trim',cyl,0x0b0f13,s*ex,ey,ez+.05,.05,.04,.05,Math.PI/2,0,0);
  }
  // Grille, lower intake, bumpers, diffuser and plate.
  const nose=sample(body,front+.05),tail=sample(body,rear-.05);
  p.add('trim',box,DARK,0,nose.low+.13,front+.03,nose.w*1.45,.16,.06);
  p.add('trim',box,0x0f1820,0,k.head.y-.04,front+.05,nose.w*.8,.09,.05);
  p.add('trim',box,DARK,0,tail.low+.12,rear+.01,tail.w*1.6,.16,.06);
  p.add('trim',box,0xe9e3cf,0,tail.low+.27,rear+.03,.42,.12,.02);
  p.add('trim',box,0x5a1f27,0,k.lamps.y,k.lamps.z+.012,(k.lamps.x-k.lamps.w/2)*2,.045,.03);
  if(k.splitter)p.add('trim',box,0x111a22,0,body[1].low-.02,front+.12,body[1].w*1.9,.035,.32);
  if(k.spoiler==='lip')p.add('paint',box,0xffffff,0,body.at(-3).high+.04,body.at(-3).z+.12,body.at(-3).w*1.62,.04,.2,-.18,0,0);
  if(k.wing){for(const s of [-1,1])p.add('trim',box,0x18232d,s*.62,1.0,1.92,.06,.26,.12);p.add('trim',box,0x18232d,0,1.14,1.97,2.0,.05,.38,-.08,0,0);for(const s of [-1,1])p.add('trim',box,0x18232d,s*1.0,1.1,1.97,.03,.2,.42);}
  if(k.rack){for(const s of [-1,1])p.add('trim',box,0x9aa6ae,s*.6,top+.06,.6,.05,.05,2.2);for(const z of [-.2,.6,1.4])p.add('trim',box,0x9aa6ae,0,top+.07,z,1.22,.035,.05);}
  if(k.panelRoof)p.add('paint',box,0xffffff,0,top-.18,.62,1.98,.36,3.3);
  // Twin racing stripes are reserved for the player's car.
  let stripes=null;
  if(k.stripes){
    const stripe=(zs,src,lift)=>zs.map(z=>{const c=sample(src,z);return B(z,.085,c.high+lift-.012,c.high+lift+.006,1);});
    const pieces=[];for(const x of [-.25,.25]){
      for(const [zs,src,lift]of [[[front+.06,front+.25,-1.6,-1.2,-.82],body,0],[[r0+.02,(r0+r1)/2,r1-.02],roof.map(c=>({...c,high:c.high})),0],[[canopy.at(-1).z+.05,1.95,rear-.1],body,0]]){const g=loft(stripe(zs,src,lift),{profile:SLAB});g.translate(x,.004,0);pieces.push(g);}
    }
    stripes=new PartSet();pieces.forEach(g=>{stripes.add('s',g,0xf4efe1);g.dispose();});stripes=stripes.merge('s');
  }
  const windshield={bottom:[canopy[0].high,canopy[0].z],top:[sample(canopy,canopy[1].z).high,canopy[1].z]};
  const last=canopy.length-1,rearGlass={bottom:[canopy[last].high,canopy[last].z],top:[canopy[last-1].high,canopy[last-1].z]};
  const hoodBack=canopy[0].z-.02,hoodFront=front+.35;
  const parts={kind,paint:p.merge('paint'),glass:p.merge('glass'),trim:p.merge('trim'),lights:p.merge('lights'),stripes,wheel:wheelGeometry(wheel),wheelSpec:wheel,
    anchors:{badge:{z:front+.78,y:sample(body,front+.78).high},roofY:top+.016,roofZ:(r0+r1)/2,hood:{y:sample(body,hoodBack).high,back:hoodBack,front:hoodFront,frontY:sample(body,hoodFront).high,w:sample(body,hoodBack).w*.8},windshield,rearGlass,side:{x:sample(body,.86).w,y:sample(body,.86).high-.18,z:.86},lamps:k.lamps,head:k.head,exhaust:k.exhaust,front,rear,width:Math.max(...body.map(s=>s.w))}};
  vehicleCache.set(kind,parts);return parts;
}
// Retained for compatibility with existing imports.
export function createBodyGeometry(){return vehicleParts('coupe').paint;}
export function createCanopyGeometry(){return vehicleParts('coupe').glass;}
