import * as THREE from 'three';
import {PartSet,hash,seeded} from './parts.js';

// Art direction per arena. Every colour, light and fog value lives here so the
// three roads read as one game with three distinct moods.
export const LOOKS=[
  {name:'boulevard',zenith:0x5fa8e0,horizon:0xd9e7ee,sunGlow:0xffe3b0,fog:0xd9e7ee,fogNear:70,fogFar:315,sun:0xffe0b4,sunIntensity:3.3,sunPosition:[-34,62,38],hemiSky:0xd4e8ff,hemiGround:0x8a7a62,hemi:1.25,rim:0xa8dcf0,rimIntensity:.9,exposure:1.08,
    road:0x3a4654,roadRough:.86,ground:0x8db08a,curb:0xcfc9bc,walk:0xc9c2b4,walk2:0xb9b2a4,verge:0x7fae6e,rail:0xd2d8d6,lamp:0x4a5d6c,
    buildings:[0xe7d4ba,0xd9e1e2,0xb9cdd0,0xe2c7a6,0xc9b8a8,0xa7bfc9,0xefe2cc,0xd3b597],accents:[0xe06d53,0x3f8f8a,0xf0b54a,0x5470a8,0xc65d7b,0x6aa36d],glass:0x5d87a3,trees:[0x4f8e5f,0x5f9d63,0x3f7d55,0x76a865],trunk:0x6e5641},
  {name:'coast',zenith:0x3fa9d8,horizon:0xd6eef0,sunGlow:0xfff2cf,fog:0xd6eef0,fogNear:80,fogFar:320,sun:0xfff1d8,sunIntensity:3.5,sunPosition:[-26,70,30],hemiSky:0xc9ecff,hemiGround:0x4f8c95,hemi:1.3,rim:0x9be6ee,rimIntensity:.9,exposure:1.1,
    road:0x37475a,roadRough:.84,ground:0xd9cda6,curb:0xd8dcd6,walk:0xbfc7c4,walk2:0xaab4b2,verge:0x86b48a,rail:0xe4ebe8,lamp:0x5b7280,water:0x1f8fae,deepWater:0x13617f,
    buildings:[0xf2ede2,0xe7dccb,0xd8e6e4,0xf4d9c2,0xcfe0e8],accents:[0x2f8fa3,0xe0784f,0xf2c14e,0x3c6e9c],glass:0x6fa6bf,trees:[0x4fa07a,0x3f8a6c,0x6fb08a],trunk:0x9a7a55,rock:0x8a8f86,rock2:0xa8a493},
  {name:'storm',zenith:0x26304f,horizon:0x8995ad,sunGlow:0xb9c2e4,fog:0x8995ad,fogNear:55,fogFar:300,sun:0xc2cdf2,sunIntensity:2.1,sunPosition:[-30,55,30],hemiSky:0xa9b6dc,hemiGround:0x3c4652,hemi:1.55,rim:0x9fb7ff,rimIntensity:1.15,exposure:1.12,
    road:0x2b3342,roadRough:.42,ground:0x5f6e66,curb:0xa9b0b5,walk:0x7d8790,walk2:0x6b747c,verge:0x55665c,rail:0xb6c2cc,lamp:0x46525e,
    buildings:[0x8a96a8,0x6f7c8f,0x9aa4b0],accents:[0xf2b950,0xe36d55,0x7fb0d9],glass:0x41566e,trees:[0x2f4a43,0x385649,0x264036,0x41604f],trunk:0x4a3d36,rock:0x6d7480,rock2:0x87909b,snow:0xe9eef4}
];
const box=new THREE.BoxGeometry(1,1,1),cyl=new THREE.CylinderGeometry(1,1,1,10),cyl6=new THREE.CylinderGeometry(1,1,1,6),cone=new THREE.ConeGeometry(1,1,7),ico=new THREE.IcosahedronGeometry(1,0),ico1=new THREE.IcosahedronGeometry(1,1),disc=new THREE.CircleGeometry(1,14),sphere=new THREE.SphereGeometry(1,10,7);
const mix=(a,b,t)=>new THREE.Color(a).lerp(new THREE.Color(b),t).getHex();
const shade=(c,k)=>{const col=new THREE.Color(c);col.multiplyScalar(k);return col.getHex();};
const flat=(g,x,y,z,sx,sz,color)=>g.add('s',disc,color,x,y,z,sx,sz,1,-Math.PI/2,0,0);

// ---------------------------------------------------------------- props
function tree(g,x,z,r,look,kind='round',scale=1){
  const leaf=look.trees[Math.floor(r()*look.trees.length)],h=(2.6+r()*1.6)*scale;
  flat(g,x+.6,.035,z+.4,1.9*scale,1.5*scale,shade(look.ground,.72));
  g.add('s',cyl6,look.trunk,x,h*.4,z,.16*scale,h*.8,.16*scale);
  if(kind==='pine'){for(let i=0;i<3;i++)g.add('s',cone,shade(leaf,1-i*.06),x,h*.55+i*1.15*scale,z,(1.7-i*.42)*scale,2.1*scale,(1.7-i*.42)*scale);if(look.snow&&r()<.45)g.add('s',cone,look.snow,x,h*.55+3.05*scale,z,.5*scale,.7*scale,.5*scale);return;}
  if(kind==='palm'){
    for(let i=0;i<4;i++)g.add('s',cyl6,shade(look.trunk,1-i*.04),x+i*.12,1+i*1.6,z,.2-i*.02,1.7,.2-i*.02,0,0,-.07);
    for(let i=0;i<7;i++){const a=i*Math.PI*2/7+r();g.add('s',sphere,i%2?leaf:shade(leaf,.9),x+.5+Math.cos(a)*1.25,6.7-Math.abs(Math.sin(a))*.2,z+Math.sin(a)*1.25,1.6,.12,.42,0,-a,Math.cos(a)*-.25);}
    g.add('s',sphere,0x8a6a3c,x+.5,6.6,z,.35,.3,.35);return;
  }
  g.add('s',ico1,leaf,x,h+.9*scale,z,1.55*scale,1.35*scale,1.5*scale);
  g.add('s',ico1,shade(leaf,1.12),x+.55*scale,h+1.5*scale,z-.3*scale,1.05*scale,.95*scale,1.0*scale);
  g.add('s',ico1,shade(leaf,.88),x-.5*scale,h+.55*scale,z+.4*scale,1.0*scale,.85*scale,.95*scale);
}
function windows(g,x0,face,y0,y1,z0,z1,cols,color,frame,side,{band=false,floor=3.1}={}){
  // `face` is the x of the road-facing wall; windows protrude 3 cm toward the road.
  for(let y=y0;y<y1-1.2;y+=floor){
    if(band){g.add('s',box,color,face-side*.03,y+1.1,(z0+z1)/2,.06,1.25,z1-z0-.6);g.add('s',box,frame,face-side*.05,y+.38,(z0+z1)/2,.05,.12,z1-z0-.4);continue;}
    const step=(z1-z0)/cols;for(let i=0;i<cols;i++){const z=z0+step*(i+.5);g.add('s',box,color,face-side*.03,y+1.1,z,.06,1.35,step*.58);}
  }
}
function frontWindows(g,x,w,zFace,y0,y1,color,cols){for(let y=y0;y<y1-1.2;y+=3.1)for(let i=0;i<cols;i++)g.add('s',box,color,x-w/2+w*(i+.5)/cols,y+1.1,zFace+.03,w/cols*.56,1.35,.06);}
// One city block facing the road. Local x grows away from the road (times side).
function cityBuilding(g,r,look,side,z0,z1,style){
  const depth=9+r()*6,front=side*(1+r()*2.5),cx=front+side*depth/2,len=z1-z0,cz=(z0+z1)/2,base=look.buildings[Math.floor(r()*look.buildings.length)],accent=look.accents[Math.floor(r()*look.accents.length)];
  const h=style==='tower'?26+r()*22:style==='low'?7+r()*4:12+r()*12,glass=style==='tower'?look.glass:shade(look.glass,.82),frame=shade(base,.78);
  // Ground-floor shopfront, awning and sign.
  g.add('s',box,shade(base,.9),cx,2,cz,depth,4,len);
  g.add('s',box,0x2c4152,front-side*.02,1.55,cz,.06,2.4,len-1.2);
  for(let z=z0+1.6;z<z1-1;z+=2.4)g.add('s',box,shade(base,.72),front-side*.05,1.55,z,.08,2.5,.12);
  g.add('s',box,accent,front-side*.65,3.2,cz,1.3,.12,len-.8,0,0,side*.18);
  g.add('s',box,shade(accent,.75),front-side*1.28,3.05,cz,.05,.32,len-.8);
  g.add('s',box,0xf6f0e2,front-side*.06,3.85,cz,.08,.55,Math.min(len-2,6));
  g.add('s',box,shade(accent,.9),front-side*.09,3.85,cz,.04,.36,Math.min(len-2.6,5.2));
  if(style==='tower'){
    g.add('s',box,glass,cx+side*1,4+h/2,cz,depth-2,h,len-1.5);
    for(let z=z0+1;z<=z1-1;z+=1.6)g.add('s',box,0xdfe8ec,front+side*.97,4+h/2,z,.06,h,.1);
    for(let y=4;y<4+h;y+=3.3)g.add('s',box,0xc9d6dc,front+side*.96,y,cz,.08,.14,len-1.5);
    g.add('s',box,0xb7c4cc,cx+side*1,4.4+h,cz,depth-3,.8,len-3);g.add('s',box,0x9aa8b2,cx+side*1.5,5.6+h,cz,2.4,1.8,2.4);
    return h+4;
  }
  g.add('s',box,base,cx,4+h/2,cz,depth,h,len);
  // Belt course, windows on the road face and the face toward the camera.
  g.add('s',box,frame,front-side*.04,4.15,cz,.12,.3,len+.05);
  windows(g,cx,front,4.2,4+h,z0+.8,z1-.8,Math.max(2,Math.round(len/3)),glass,frame,side,{band:style==='band'});
  frontWindows(g,cx,depth-1.5,z1,4.2,4+h,glass,Math.max(2,Math.round(depth/3)));
  if(style==='balcony')for(let y=7;y<4+h-1;y+=3.1)g.add('s',box,0xe9ecea,front-side*.55,y,cz,1.1,.12,len-2.4);
  // Parapet and rooftop kit.
  g.add('s',box,frame,cx,4+h+.25,cz,depth+.2,.5,len+.2);
  g.add('s',box,shade(base,.68),cx,4+h+.05,cz,depth-.8,.3,len-.8);
  if(r()<.6){g.add('s',box,0xa9b4b8,cx+side*(r()*2-1),4+h+.9,cz-1,2,1.2,1.6);g.add('s',box,0x8f9ba1,cx-side*1.5,4+h+.7,cz+2,1.2,.8,1.2);}
  if(r()<.35){g.add('s',cyl,0x8e7158,cx+side*2,4+h+1.6,cz+1.5,.9,2.2,.9);g.add('s',cone,0x6d5847,cx+side*2,4+h+3.1,cz+1.5,1,.8,1);}
  if(r()<.3)g.add('s',box,look.trees[0],cx,4+h+.6,cz,depth-2,.5,len-2.5);
  return h+4;
}
// ---------------------------------------------------------------- scenery variants
function boulevardScenery(look,side,v){
  const g=new PartSet(),r=seeded(1000+v*31+(side>0?7:0));
  // Plaza ground so buildings never float over the field.
  g.add('s',box,shade(look.walk2,.96),side*22,-.04,0,44,.1,20.2);
  if(v===7){ // Pocket park with fountain and trees.
    g.add('s',box,look.verge,side*16,0.02,0,22,.06,18);
    g.add('s',cyl,0xd6d0c4,side*14,.3,0,3,.6,3);g.add('s',cyl,0x6fb8d6,side*14,.62,0,2.6,.05,2.6);g.add('s',cyl,0xe8e4da,side*14,1.3,0,.25,1.5,.25);
    for(const [x,z]of [[6,-6],[9,5],[20,-4],[23,6],[17,-8]])tree(g,side*x,z,r,look,'round',1.15);
    for(const z of [-3,3])g.add('s',box,0x7a5a43,side*6.5,.45,z,.6,.12,2.2);
    return g.merge('s');
  }
  const styles=['grid','band','balcony','tower','low','grid','band','balcony'],style=styles[v%styles.length];
  if(v%3===1){cityBuilding(g,r,look,side,-9.6,-.3,style);cityBuilding(g,r,look,side,.3,9.6,styles[(v+3)%8]);}
  else cityBuilding(g,r,look,side,-9.4,9.4,style);
  // Second row adds depth to the skyline.
  const back=seeded(77+v*13+(side>0?3:0));const bh=18+back()*30,bc=look.buildings[Math.floor(back()*look.buildings.length)];
  g.add('s',box,shade(bc,.92),side*(30+back()*6),bh/2,-2+back()*4,10,bh,14);
  return g.merge('s');
}
function coastScenery(look,side,v){
  const g=new PartSet(),r=seeded(2000+v*17+(side>0?5:0));
  if(v===0)return emptyGeometry();
  if(v===1){ // Sailboat.
    const x=side*(26+r()*16),z=r()*10-5;g.add('s',box,0xf4f0e6,x,-3.0,z,2.2,.6,6);g.add('s',box,0x2a5b70,x,-2.7,z,2.25,.12,6.05);g.add('s',box,0xf2e6cc,x,-2.4,z+.6,1.4,.6,2.2);g.add('s',cyl,0xd4dade,x,1,z,.06,7,.06);
    const sail=new THREE.BufferGeometry();sail.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,0,6,0,0,0,3.6,0,0,0,0,0,3.6,0,6,0],3));sail.computeVertexNormals();g.add('s',sail,0xfdf8ee,x,-2,z-1.5);sail.dispose();return g.merge('s');
  }
  if(v===2){ // Buoys and a channel marker.
    for(const [x,z,c]of [[12,-5,0xe2593f],[18,6,0x3fa36d],[30,-2,0xf0c24a]]){g.add('s',cyl,c,side*x,-2.9,z,.5,1.1,.5);g.add('s',cone,c,side*x,-2,z,.4,.9,.4);}
    return g.merge('s');
  }
  if(v===3||v===4){ // Rock islet with palms.
    const x=side*(32+r()*14);g.add('s',ico,look.rock,x,-3.4,0,9,3.2,8);g.add('s',ico,look.rock2,x+side*2,-2.2,2,5,2.2,4.5);g.add('s',sphere,look.ground,x,-1.6,0,6,.9,5.5);
    tree(g,x-1,-1,r,look,'palm');if(v===4)tree(g,x+2,2,r,look,'palm',.9);return g.merge('s');
  }
  // v5+: waterfront town on land sections.
  g.add('s',box,look.ground,side*24,-1.7,0,40,3.4,20.4);g.add('s',box,shade(look.ground,.85),side*4.6,-2.2,0,1.2,2.4,20.4);
  const n=v%3;for(let i=0;i<2;i++){const z=-5+i*10,w=6+r()*3,h=5+r()*7,x=side*(9+r()*4+i*7),c=look.buildings[(v+i)%look.buildings.length];g.add('s',box,c,x,h/2,z,w,h,6.5);g.add('s',box,look.accents[(v+i+n)%look.accents.length],x,h+.5,z,w+.6,1,7.1,0,0,0);frontWindows(g,x,w-1,z+3.25,1,h,look.glass,2);windows(g,x,x-side*w/2,1,h,z-2.6,z+2.6,2,look.glass,0xffffff,side);}
  tree(g,side*6,-8,r,look,'palm');tree(g,side*7,8,r,look,'palm',.95);
  return g.merge('s');
}
function stormScenery(look,side,v){
  const g=new PartSet(),r=seeded(3000+v*19+(side>0?11:0));
  g.add('s',box,look.ground,side*24,-.06,0,46,.1,20.4);
  // Rolling ground and boulders.
  g.add('s',ico,shade(look.ground,.92),side*(18+r()*8),-.8,r()*8-4,7,2.6,6,0,r()*3,0);
  if(v%4===0){const x=side*(10+r()*6);g.add('s',ico,look.rock,x,.6,-3,2.2,1.6,2.6,0,r()*3,0);g.add('s',ico,look.rock2,x+side,.4,-1,1.4,1,1.5,0,r()*3,0);}
  const count=v%4===3?3:7+Math.floor(r()*5);
  for(let i=0;i<count;i++){const x=side*(7+r()*30),z=r()*18-9;tree(g,x,z,r,look,'pine',.85+r()*.6);}
  if(v===5){ // Mountain hut.
    const x=side*15;g.add('s',box,0x6d5a4a,x,1.6,2,5,3.2,6);g.add('s',box,0x3d3a40,x,3.9,2,5.8,.3,6.8,0,0,side*.42);g.add('s',box,0x3d3a40,x+side*1.2,3.9,2,5.8,.3,6.8,0,0,-side*.42);g.add('s',box,0xf2c56a,x-side*2.52,1.6,1,.06,1,1);
  }
  if(v===6){ // Rock outcrop wall.
    for(let i=0;i<4;i++)g.add('s',ico,i%2?look.rock:look.rock2,side*(12+i*2.5),2+i*1.2,-6+i*4,3.5,4+i,3.2,0,i,0);
  }
  return g.merge('s');
}
function emptyGeometry(){const g=new THREE.BufferGeometry();for(const n of ['position','normal','color'])g.setAttribute(n,new THREE.Float32BufferAttribute([],3));return g;}
// ---------------------------------------------------------------- roadside
// Flat chunk geometry for one side; the scene bends it along the course and
// pushes it outward with the apron or fork edge. x is signed for that side.
function roadsideStreet(look,side,v){
  const g=new PartSet(),s=side;
  g.add('s',box,look.curb,s*5.53,.075,0,.26,.15,20.02);
  g.add('s',box,look.verge,s*6.5,.06,0,1.7,.1,20.02);
  g.add('s',box,look.walk,s*8.9,.1,0,3.1,.12,20.02);
  for(const z of [-7.5,-2.5,2.5,7.5])g.add('s',box,look.walk2,s*8.9,.163,z,3.05,.01,.08);
  g.add('s',box,shade(look.walk2,.9),s*10.5,.16,0,.15,.22,20.02);
  // Planters, trees and a street lamp whose arm reaches over the lane edge.
  for(const z of [-5,5]){g.add('s',box,0xa59882,s*6.5,.25,z,1.5,.38,2.6);g.add('s',box,shade(look.verge,.85),s*6.5,.45,z,1.3,.06,2.4);}
  const r=seeded(400+v);tree(g,s*6.5,-5,r,look,'round',.7);tree(g,s*6.5,5,r,look,'round',.65);
  if(v%2===0){g.add('s',cyl,look.lamp,s*6.3,3.4,0,.07,6.8,.07);g.add('s',box,look.lamp,s*5.75,6.75,0,1.2,.09,.1);g.add('s',box,0xfff3d6,s*5.25,6.66,0,.55,.1,.36);}
  else{g.add('s',box,0x4a6170,s*9.9,.65,-3,.5,1.1,.5);g.add('s',box,0x2f6f68,s*7.9,.5,4,.5,.6,1.8);g.add('s',box,0x8a6b4f,s*7.9,.85,4,.5,.06,1.9);}
  if(v===3){g.add('s',box,0xdfe6e8,s*9.7,1.3,-1,.06,2.4,3.6);g.add('s',box,0x5c8fb0,s*9.65,1.3,-1,.04,2.2,3.4);g.add('s',box,look.lamp,s*9.7,2.55,-1,1.2,.08,3.8);}
  return g.merge('s');
}
function roadsideBridge(look,side,v){
  const g=new PartSet(),s=side;
  // Deck fascia and walkway follow the edge; piers drop into the sea.
  g.add('s',box,0xc9d2d0,s*6.6,-.55,0,2.6,1.3,20.02);
  g.add('s',box,shade(0xc9d2d0,.82),s*3.2,-1.05,0,4.4,.3,20.02);
  g.add('s',box,0xe2e8e5,s*5.75,.42,0,.6,.84,20.02);
  g.add('s',box,look.walk,s*7,.1,0,1.9,.12,20.02);
  g.add('s',box,look.rail,s*7.95,1.05,0,.07,.07,20.02);g.add('s',box,look.rail,s*7.95,.62,0,.05,.05,20.02);
  for(let z=-9;z<=9;z+=3)g.add('s',box,look.rail,s*7.95,.6,z,.06,.95,.06);
  g.add('s',box,0x2c8fa6,s*5.75,.86,0,.62,.05,20.02);
  if(v===0){g.add('s',box,0xbac4c2,s*3.6,-6,0,2.2,10,2.6);g.add('s',box,shade(0xbac4c2,.85),s*3.6,-3,0,3.4,.6,3.6);}
  if(v===1){g.add('s',cyl,look.lamp,s*7.7,3.6,-4,.07,7.2,.07);g.add('s',box,look.lamp,s*7,7.15,-4,1.5,.09,.1);g.add('s',box,0xfff3d6,s*6.3,7.06,-4,.55,.1,.36);}
  return g.merge('s');
}
function roadsideShore(look,side,v){
  const g=new PartSet(),s=side;
  g.add('s',box,look.curb,s*5.53,.075,0,.26,.15,20.02);
  g.add('s',box,look.walk,s*7.4,.1,0,3.5,.12,20.02);
  g.add('s',box,0xd8d2c0,s*9.3,.35,0,.4,.6,20.02);
  g.add('s',box,look.ground,s*12.5,-1.2,0,6,2.6,20.02);
  for(const z of [-6,4])tree(g,s*11,z,seeded(500+v),look,'palm',.85);
  if(v%2===0){g.add('s',cyl,look.lamp,s*6,3.4,2,.07,6.8,.07);g.add('s',box,look.lamp,s*5.45,6.75,2,1.2,.09,.1);g.add('s',box,0xfff3d6,s*4.95,6.66,2,.55,.1,.36);}
  return g.merge('s');
}
function roadsideTunnel(look,side,v,portal=0){
  const g=new PartSet(),s=side,wall=0xd9d6cc,lit=0xfff4d2;
  // Tube: curb, tiled wall, cornice and vault, all outside the road corridor.
  g.add('s',box,look.curb,s*5.6,.12,0,.4,.24,20.02);
  g.add('s',box,wall,s*6.25,3.2,0,.5,6.4,20.02);
  g.add('s',box,0x2b6f86,s*5.99,1.1,0,.04,.5,20.02);
  g.add('s',box,shade(wall,.9),s*5.2,6.75,0,2.4,.5,20.02,0,0,s*.55);
  g.add('s',box,shade(wall,.78),s*2.3,7.45,0,4.8,.5,20.02);
  for(const z of [-7.5,-2.5,2.5,7.5])g.add('s',box,lit,s*4.6,7.08,z,.3,.08,3.4);
  // Hill mass sits above and beside the vault, never inside it.
  g.add('s',box,look.rock,s*12,4.5,0,11,9,20.02);
  g.add('s',box,shade(look.verge??look.ground,.95),s*6,8.35,0,12.2,1.4,20.02);
  for(let i=0;i<3;i++)g.add('s',ico,i%2?look.rock2:look.rock,s*(12+i*3),9+i*1.5,-7+i*7,4.5,3+i,5.5,0,v+i,0);
  g.add('s',ico,look.verge??look.ground,s*8,9.6,3,5,1.6,6);
  if(portal){
    // Portal facade faces the approaching driver, with a yellow clearance band.
    const z=portal*10;g.add('s',box,0xd4cfc2,s*2.6,8.9,z,5.6,2.4,1);g.add('s',box,0xc5bfb1,s*12,6,z+portal*.2,12,12,1.2);
    g.add('s',box,0xf2c14e,s*2.6,7.85,z+portal*.52,5.2,.28,.06);g.add('s',box,0x24343f,s*2.6,7.85,z+portal*.55,1.2,.12,.04);
    for(let i=0;i<3;i++)g.add('s',ico,look.rock,s*(9+i*4),12+i,z-portal*2,5,4,4,0,i,0);
  }
  return g.merge('s');
}
function roadsideMountain(look,side,v,cliff){
  const g=new PartSet(),s=side,r=seeded(600+v+(s>0?50:0));
  g.add('s',box,shade(look.road,1.3),s*6.4,.03,0,2,.06,20.02);
  // Guardrail with posts and reflectors, readable in low light.
  g.add('s',box,look.rail,s*7.45,.62,0,.06,.3,20.02);g.add('s',box,shade(look.rail,.7),s*7.45,.62,0,.04,.08,20.04);
  for(let z=-8;z<=8;z+=4){g.add('s',box,0x6b7681,s*7.55,.35,z,.1,.7,.1);g.add('s',box,0xbfe3ff,s*7.42,.66,z,.02,.08,.18);}
  for(const z of [-5,5]){g.add('s',box,0xe9eef2,s*6.9,.55,z,.12,1.1,.12);g.add('s',box,0xf0a640,s*6.9,.95,z,.13,.18,.13);}
  if(cliff){
    // Faceted rock cut rising beside the road.
    for(let i=0;i<4;i++){const z=-7.5+i*5,h=7+r()*6;g.add('s',ico,i%2?look.rock:look.rock2,s*(10.8+r()),h*.45,z,3.2+r(),h,3.4,r(),r()*2,s*.15);}
    g.add('s',box,shade(look.rock,.9),s*13,5,0,4,10,20.02);
    if(look.snow)g.add('s',box,look.snow,s*13.6,10.1,0,3.2,.3,20.02);
  }else{
    g.add('s',box,shade(look.ground,.85),s*11,-1.6,0,6,3,20.02,0,0,-s*.35);
  }
  return g.merge('s');
}
// ---------------------------------------------------------------- course plan
const VARIANTS=8;
export function createKit(index){
  const look=LOOKS[index],kit={look,roadside:{},scenery:{'-1':[],'1':[]}};
  const sideKit=(fn,count,...args)=>Array.from({length:count},(_,v)=>({'-1':fn(look,-1,v,...args),'1':fn(look,1,v,...args)}));
  if(index===0){kit.roadside.street=sideKit(roadsideStreet,4);for(const s of [-1,1])for(let v=0;v<VARIANTS;v++)kit.scenery[s].push(boulevardScenery(look,s,v));}
  if(index===1){kit.roadside.bridge=sideKit(roadsideBridge,3);kit.roadside.shore=sideKit(roadsideShore,2);kit.roadside.tunnel=[{'-1':roadsideTunnel(look,-1,0),'1':roadsideTunnel(look,1,0)}];kit.roadside.portalIn=[{'-1':roadsideTunnel(look,-1,1,1),'1':roadsideTunnel(look,1,1,1)}];kit.roadside.portalOut=[{'-1':roadsideTunnel(look,-1,2,-1),'1':roadsideTunnel(look,1,2,-1)}];for(const s of [-1,1])for(let v=0;v<VARIANTS;v++)kit.scenery[s].push(coastScenery(look,s,v));}
  if(index===2){kit.roadside.cliff=sideKit(roadsideMountain,3,true);kit.roadside.drop=sideKit(roadsideMountain,3,false);for(const s of [-1,1])for(let v=0;v<VARIANTS;v++)kit.scenery[s].push(stormScenery(look,s,v));}
  kit.empty=emptyGeometry();
  kit.dispose=()=>{for(const list of Object.values(kit.roadside))for(const pair of list)for(const g of Object.values(pair))g.dispose();for(const s of ['-1','1'])kit.scenery[s].forEach(g=>g.dispose());kit.empty.dispose();};
  return kit;
}
// Deterministic per course chunk: a segment always has the same look.
export function chunkPlan(index,n,ctx={}){
  // ctx.open: ride ranges. Both sides stay open there (sea in Coastal, the low
  // drop side in Stormcrest), so the scenery never hints at the ride's side.
  const at=n*20+10,h=(k)=>hash(n,k,index),inTunnel=(ctx.tunnels||[]).find(t=>at>t.start&&at<t.end),open=(ctx.open||[]).some(r=>at>r.start&&at<r.end);
  if(index===0){const v=Math.floor(h(1)*4);return {roadside:{'-1':['street',v],'1':['street',(v+2)%4]},scenery:{'-1':Math.floor(h(2)*VARIANTS),'1':Math.floor(h(3)*VARIANTS)}};}
  if(index===1){
    if(inTunnel){const first=at-20<inTunnel.start,last=at+20>inTunnel.end,kind=first?'portalIn':last?'portalOut':'tunnel';return {roadside:{'-1':[kind,0],'1':[kind,0]},scenery:{'-1':-1,'1':-1},tunnel:true};}
    const band=Math.floor(at/240),land=!open&&hash(band,7,index)<.38,landSide=hash(band,8,index)<.5?-1:1,pier=n%2===0?0:n%4===1?1:2;
    const side=s=>land&&s===landSide?['shore',n%2]:['bridge',pier];
    const scen=s=>land&&s===landSide?5+Math.floor(h(4+s)*3):Math.floor(h(5+s)*5);
    return {roadside:{'-1':side(-1),'1':side(1)},scenery:{'-1':scen(-1),'1':scen(1)},land:land?landSide:0};
  }
  const band=Math.floor(at/320),cliffSide=open?0:hash(band,9,index)<.5?-1:1,v=Math.floor(h(1)*3);
  return {roadside:{'-1':[cliffSide===-1?'cliff':'drop',v],'1':[cliffSide===1?'cliff':'drop',(v+1)%3]},scenery:{'-1':Math.floor(h(2)*VARIANTS),'1':Math.floor(h(3)*VARIANTS)}};
}
// Tunnels sit in long clear stretches only: never across a task zone,
// fork or spectator station, so signs and choices stay in daylight.
export function planTunnels(index,length,blocked){
  if(index!==1)return [];
  const merged=[...blocked].sort((a,b)=>a.start-b.start).reduce((out,b)=>{const last=out.at(-1);if(last&&b.start<=last.end)last.end=Math.max(last.end,b.end);else out.push({...b});return out;},[]);
  const free=[];let cursor=240;for(const b of [...merged,{start:length-320,end:Infinity}]){if(b.start-cursor>=220)free.push({start:cursor,end:b.start});cursor=Math.max(cursor,b.end);}
  // Every other clear stretch gets one 140 m tunnel, centred and snapped to chunks.
  return free.filter((_,i)=>i%2===1).map(f=>{const mid=Math.round((f.start+f.end)/2/20)*20;return {start:mid-80,end:mid+60};});
}
// ---------------------------------------------------------------- sky and backdrop
export function skyDome(look){
  const g=new THREE.SphereGeometry(560,40,20),pos=g.attributes.position,col=new Float32Array(pos.count*3),sun=new THREE.Vector3(...look.sunPosition).normalize().multiply(new THREE.Vector3(1,.6,-1)).normalize();
  const zen=new THREE.Color(look.zenith),hor=new THREE.Color(look.horizon),glow=new THREE.Color(look.sunGlow),c=new THREE.Color(),d=new THREE.Vector3();
  for(let i=0;i<pos.count;i++){d.fromBufferAttribute(pos,i).normalize();const y=Math.max(0,d.y);c.copy(hor).lerp(zen,Math.pow(y,.55));const s=Math.max(0,d.dot(sun));c.lerp(glow,Math.pow(s,8)*.55+Math.pow(s,64)*.4);col.set([c.r,c.g,c.b],i*3);}
  g.setAttribute('color',new THREE.BufferAttribute(col,3));
  const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,depthWrite:false}));m.renderOrder=-10;m.frustumCulled=false;return m;
}
// Distant silhouettes are pre-tinted toward the horizon rather than fogged,
// so they stay visible and never pop as the course advances.
export function backdrop(index,look){
  const g=new PartSet(),r=seeded(90+index),hz=look.horizon,layer=(c,t)=>mix(c,hz,t);
  if(index===0){
    for(let i=0;i<34;i++){const x=(i-17)*24+r()*10,h=22+r()*70,w=12+r()*16;g.add('s',box,layer(0x8ea4b7,.55),x,h/2-4,-470-r()*20,w,h,10);}
    for(let i=0;i<26;i++){const x=(i-13)*30+r()*12,h=14+r()*40,w=14+r()*14;g.add('s',box,layer(0x9db2c0,.38),x,h/2-4,-420-r()*10,w,h,10);}
    g.add('s',cyl,layer(0x7f95a8,.4),-120,40,-430,3,90,3);g.add('s',sphere,layer(0x8ea4b7,.4),-120,72,-430,8,6,8);
  }else if(index===1){
    for(let i=0;i<9;i++){const x=(i-4)*110+r()*40,w=80+r()*90,h=16+r()*30;g.add('s',ico,layer(0x5f8f88,.5),x,-6,-470,w,h,30);}
    g.add('s',box,layer(0x3d5f72,.45),180,-1.5,-440,40,4,8);g.add('s',box,layer(0xd9573f,.45),172,1.6,-440,6,3,8);
  }else{
    for(const [d,c,t,count,hmin,hvar]of [[520,0x5d6a86,.62,12,90,110],[470,0x4a5672,.42,14,60,80],[430,0x3c465e,.25,16,35,55]])for(let i=0;i<count;i++){const x=(i-count/2)*(900/count)+r()*40,h=hmin+r()*hvar,w=90+r()*80;g.add('s',cone,layer(c,t),x,h/2-8,-d-r()*20,w,h,30);if(t>.4)g.add('s',cone,layer(0xe7edf5,t*.8),x,h-8-h*.12,-d-r()*20+2,w*.25,h*.25,8);}
  }
  const m=new THREE.Mesh(g.merge('s'),new THREE.MeshBasicMaterial({vertexColors:true,fog:false}));m.renderOrder=-5;return m;
}
// ---------------------------------------------------------------- landmarks
// A few memorable shapes instead of uniform clutter. Each has a course
// position, a side and a lateral distance well outside the road corridor.
export function landmarkPlan(index,length){
  const kinds=[['wheel','clock','stadium','twin'],['lighthouse','towers','ship','lighthouse'],['turbines','observatory','mast','turbines']][index],out=[];
  for(let i=0,at=520;at<length-200;i++,at+=1150)out.push({kind:kinds[i%kinds.length],at,side:i%2?1:-1});
  return out;
}
export function landmarkGeometry(index,kind,look){
  const g=new PartSet(),r=seeded(kind.length*7+index);
  if(kind==='wheel'){g.add('s',box,0xd9dfe2,0,0,0,30,1,12);for(const z of [-2,2]){g.add('s',box,0xcfd6da,-6,18,z,.8,36,.8,0,0,-.32);g.add('s',box,0xcfd6da,6,18,z,.8,36,.8,0,0,.32);}g.add('s',cyl,0x8d99a3,0,34,0,1.2,5,1.2,Math.PI/2,0,0);return {static:g.merge('s'),offset:62};}
  if(kind==='clock'){g.add('s',box,0xe8d9bf,0,18,0,7,36,7);g.add('s',box,0xd7c5a6,0,37,0,8,2,8);g.add('s',cone,0x6d7f8c,0,43,0,6,9,6);for(const [x,z,ry]of [[0,3.55,0],[3.55,0,Math.PI/2]]){g.add('s',cyl,0xf8f2e2,x,30,z,2.4,.2,2.4,Math.PI/2,ry,0);g.add('s',box,0x2c3945,x,30.6,z+(ry?0:.12),.18,1.6,.05,0,ry,0);}return {static:g.merge('s'),offset:52};}
  if(kind==='stadium'){g.add('s',new THREE.CylinderGeometry(32,28,16,24,1,true),0xd8dde0,0,8,0);g.add('s',new THREE.TorusGeometry(31,1.2,6,24),0xe8574a,0,16,0,1,1,1,Math.PI/2,0,0);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;g.add('s',box,0xbcc6cc,Math.cos(a)*30,22,Math.sin(a)*30,.8,12,.8);}return {static:g.merge('s'),offset:78};}
  if(kind==='twin'){for(const x of [-7,7]){g.add('s',box,look.glass,x,32,0,10,64,10);g.add('s',box,0xdfe8ec,x,65,0,8,3,8);g.add('s',cyl,0xcfd9de,x,72,0,.3,12,.3);}g.add('s',box,0xcfd9de,0,42,0,6,2,3);return {static:g.merge('s'),offset:70};}
  if(kind==='lighthouse'){g.add('s',ico,look.rock,0,-3,0,14,6,12);g.add('s',cyl,0xf4f1ea,0,9,0,2.6,22,2.6);for(const y of [4,12])g.add('s',cyl,0xd9473b,0,y,0,2.62,3,2.62);g.add('s',cyl,0x2d3a44,0,21,0,3.2,.5,3.2);g.add('s',cyl,0xfff1c1,0,22.6,0,1.8,2.6,1.8);g.add('s',cone,0xd9473b,0,25,0,2.4,2.4,2.4);return {static:g.merge('s'),offset:58,beacon:[0,22.6,0]};}
  if(kind==='towers'){for(const x of [-1,1]){g.add('s',box,0xe4e9e6,x*11.2,15,0,1.6,30,2.2);g.add('s',box,0xe4e9e6,x*11.2,-6,0,2.6,12,3.2);}g.add('s',box,0xd5ddd9,0,28,0,24,1.6,2.2);g.add('s',box,0x2c8fa6,0,26.8,0,22,.5,2.3);for(const x of [-1,1])for(const z of [-1,1])for(let k=0;k<4;k++){const len=Math.hypot(22-k*2,18+k*6);g.add('s',box,0xcfe3e4,x*11,28-(22-k*2)/2,z*(18+k*6)/2,.12,len,.12,z*Math.atan2(18+k*6,22-k*2),0,0);}return {static:g.merge('s'),offset:0,overRoad:true};}
  if(kind==='ship'){g.add('s',box,0x2f4a5c,0,-2.4,0,9,3.4,44);g.add('s',box,0xe4e8ea,0,1.6,16,8,5,8);for(let i=0;i<5;i++)g.add('s',box,look.accents[i%look.accents.length],0,.6,-14+i*6,8,3,5.5);return {static:g.merge('s'),offset:95};}
  if(kind==='turbines'){for(const [x,z,h]of [[0,0,40],[30,-40,46],[-26,-70,38]]){g.add('s',ico,look.rock,x,0,z,16,8,14);g.add('s',cyl,0xe8edf0,x,h/2,z,.9,h,.9);g.add('s',box,0xe8edf0,x,h,z+1.2,1.8,1.8,3.2);}return {static:g.merge('s'),offset:92,rotors:[[0,40,-1.6],[30,46,-41.6],[-26,38,-71.6]]};}
  if(kind==='observatory'){g.add('s',cone,look.rock,0,14,0,40,40,36);g.add('s',cone,look.snow,0,30,0,13,10,12);g.add('s',cyl,0xdfe5ea,0,36,0,4,4,4);g.add('s',sphere,0xf1f4f6,0,38.5,0,4,3.6,4);g.add('s',box,0x46525e,0,39,1,1.2,4,6,0,0,.5);return {static:g.merge('s'),offset:120};}
  g.add('s',cone,look.rock,0,10,0,30,30,26);g.add('s',cyl,0xb7c0c8,0,40,0,.6,34,.6);for(let y=26;y<56;y+=6)g.add('s',box,0xb7c0c8,0,y,0,3,.2,.2);return {static:g.merge('s'),offset:105,beacon:[0,57.5,0]};
}
export function rotorGeometry(){const g=new PartSet(),blade=new THREE.BoxGeometry(.9,16,.3).translate(0,8.4,0);for(let i=0;i<3;i++)g.add('s',blade,0xf2f5f7,0,0,0,1,1,1,0,0,i*Math.PI*2/3);g.add('s',sphere,0xe8edf0,0,0,.3,.9,.9,.9);blade.dispose();return g.merge('s');}
