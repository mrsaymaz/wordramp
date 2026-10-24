import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {createPerformanceBudget,samplePerformance} from './presentation.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {createDrivingFeel,updateDrivingFeel} from './driving-feel.js';
import {forkBounds,forkSurface} from './route-road.js';
import {rideFrames,sweep,supportPlan,framePose,frameRuns,DECK_SECTION,railSection,wallSection,ribSection,TRACK_PASS,TRACK_HALF} from './coaster-track.js';
import {vehicleParts,TRAFFIC_KINDS} from './vehicle-geometry.js';
import {PartSet} from './parts.js';
import {LOOKS,createKit,chunkPlan,planTunnels,skyDome,backdrop,landmarkPlan,landmarkGeometry,rotorGeometry} from './world.js';
import {BoostEffects} from './boost-effects.js';
import {RaceSpectators} from './spectators.js';
import {CarDamageEffects} from './damage-effects.js';
const materials=new Map(),paints=new Map(),liveryPlates=new Map();
const glassMaterial=new THREE.MeshPhysicalMaterial({color:0x35576b,roughness:.06,metalness:.4,clearcoat:1,clearcoatRoughness:.04,envMapIntensity:1.6});
const trimMaterial=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.52,metalness:.32});
const wheelMaterial=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.6,metalness:.28});
const lampMaterial=new THREE.MeshBasicMaterial({vertexColors:true});
const indicatorMaterial=new THREE.MeshBasicMaterial({vertexColors:true});
const obstacleMaterial=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.6,metalness:.05});
const rivalFlameA=new THREE.MeshBasicMaterial({color:0x93e5ff,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false}),rivalFlameB=new THREE.MeshBasicMaterial({color:0xffc697,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false});
// Civilian paint is deliberately muted so racers and team colours stand out.
const TRAFFIC_COLOURS=[0x8fa3ad,0xc9cfd1,0x6f7f8c,0xb7a58f,0x8d9f8a,0xd8d2c4,0x5f6c7a];
function paintMat(color){if(!paints.has(color))paints.set(color,new THREE.MeshPhysicalMaterial({color,roughness:.34,metalness:.22,clearcoat:.85,clearcoatRoughness:.16}));return paints.get(color);}
const shadeHex=(c,k)=>new THREE.Color(c).multiplyScalar(k).getHex();
function mat(color,roughness=.7,metalness=0,emissive=0){let key=[color,roughness,metalness,emissive].join();if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,roughness,metalness,emissive,emissiveIntensity:emissive?.7:0}));return materials.get(key);}
const geo={arch:new THREE.TorusGeometry(.48,.07,5,18,Math.PI),rock:new THREE.IcosahedronGeometry(1,1),leaf:new THREE.SphereGeometry(1,10,5),carTrim:new RoundedBoxGeometry(1,1,1,2,.09),contact:new THREE.PlaneGeometry(1,1),coach:new RoundedBoxGeometry(1,1,1,1,.09),box:new THREE.BoxGeometry(1,1,1),sphere:new THREE.SphereGeometry(1,12,8),cone:new THREE.ConeGeometry(1,1,6),cylinder:new THREE.CylinderGeometry(1,1,1,18)};
function mesh(group,shape,color,x,y,z,sx=1,sy=1,sz=1,roughness=.7,metalness=0,emissive=0){let m=new THREE.Mesh(geo[shape],mat(color,roughness,metalness,emissive));m.position.set(x,y,z);m.scale.set(sx,sy,sz);group.add(m);return m;}
function compact(group){group.updateMatrixWorld(true);const inverse=group.matrixWorld.clone().invert();let byMat=new Map(),paint=new Set();group.traverse(m=>{if(m.isMesh){if(m.userData.paint)paint.add(m.material);let a=byMat.get(m.material)||[];a.push(m.geometry.clone().applyMatrix4(m.matrixWorld.clone().premultiply(inverse)));byMat.set(m.material,a);}});let result=new THREE.Group();for(let [material,geos]of byMat){if(geos.some(g=>g.index)&&geos.some(g=>!g.index))for(let i=0;i<geos.length;i++)if(geos[i].index){const old=geos[i];geos[i]=old.toNonIndexed();old.dispose();}let merged=mergeGeometries(geos);let m=new THREE.Mesh(merged,material);m.receiveShadow=true;m.castShadow=true;m.userData.paint=paint.has(material);result.add(m);geos.forEach(g=>g.dispose());}return result;}
function canvasTexture(draw,w=512,h=1024){let c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);let t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
// Bridge Builder: three 16 m word slabs span the repair gap.
const BRIDGE_SLOT=16,BRIDGE_LENGTH=48;
function wordTexture(word){return canvasTexture((c,w,h)=>{c.clearRect(0,0,w,h);c.textAlign='center';c.textBaseline='middle';let size=150;c.font='900 '+size+'px sans-serif';while((c.measureText(word)?.width||0)>w-60&&size>40){size-=6;c.font='900 '+size+'px sans-serif';}c.lineWidth=14;c.strokeStyle='rgba(20,34,52,.85)';c.strokeText(word,w/2,h/2);c.fillStyle='#ffffff';c.fillText(word,w/2,h/2);},1024,320);}
function stripeTexture(text){return canvasTexture((c,w,h)=>{for(let x=-h;x<w;x+=56){c.fillStyle='#e8443a';c.beginPath();c.moveTo(x,0);c.lineTo(x+28,0);c.lineTo(x+28+h,h);c.lineTo(x+h,h);c.fill();}c.fillStyle='#f6f1e7';c.fillRect(24,h*.2,w-48,h*.6);c.fillStyle='#c62f27';c.textAlign='center';c.textBaseline='middle';c.font='900 '+Math.round(h*.42)+'px sans-serif';c.fillText(text,w/2,h/2+4);},1024,256);}
function signTexture(text,color='#ffd976',sub=''){return canvasTexture((c,w,h)=>{c.fillStyle='#192c43';c.fillRect(0,0,w,h);c.strokeStyle=color;c.lineWidth=12;c.strokeRect(12,12,w-24,h-24);c.textAlign='center';c.fillStyle=color;c.font='900 120px sans-serif';c.fillText(text,w/2,145);if(sub){c.fillStyle='#fff';c.font='bold 28px sans-serif';c.fillText(sub,w/2,207);}},512,256);}
function liveryPlate(key,label,color){if(!liveryPlates.has(key)){const texture=canvasTexture((c,w,h)=>{c.fillStyle='#11283b';c.fillRect(0,0,w,h);c.strokeStyle='#'+color.toString(16).padStart(6,'0');c.lineWidth=12;c.strokeRect(7,7,w-14,h-14);c.fillStyle='#fff5dd';c.font='900 142px sans-serif';c.textAlign='center';c.fillText(label,w/2,163);c.font='bold 22px sans-serif';c.fillStyle='#a9c9d9';c.fillText('WORDRAMP',w/2,212);},192,256);liveryPlates.set(key,new THREE.MeshStandardMaterial({map:texture,roughness:.56,metalness:.08}));}return liveryPlates.get(key);}
export class RallyScene{
  constructor(container,renderer){
    this.container=container;this.viewport={width:innerWidth,height:innerHeight};
    this.renderer=renderer||new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});this.preferences={graphics:'auto',reduced:false};this.performanceBudget=createPerformanceBudget('auto',window.devicePixelRatio||1);this.renderer.setPixelRatio(this.performanceBudget.ratio);this.renderer.setSize(innerWidth,innerHeight);this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.12;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;container.append(this.renderer.domElement);
    this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(52,innerWidth/innerHeight,.25,700);this.hemi=new THREE.HemisphereLight(0xd8eeff,0x536e69,1.4);this.scene.add(this.hemi);
    // Real-time shadows are reserved for actors near the car. Static scenery
    // carries baked contact shading, so nothing pops in at the frustum edge.
    this.sun=new THREE.DirectionalLight(0xffe1b3,3.4);this.sunOffset=new THREE.Vector3(-34,62,38);this.focusTint=new THREE.Color(0x9cc4b4);this.sun.target.position.set(0,0,-14);this.sun.position.copy(this.sun.target.position).add(this.sunOffset);this.sun.castShadow=true;this.sun.shadow.mapSize.set(1024,1024);Object.assign(this.sun.shadow.camera,{left:-26,right:26,top:34,bottom:-34,near:10,far:170});this.sun.shadow.bias=-.0004;this.sun.shadow.normalBias=.035;this.sun.shadow.radius=3;this.scene.add(this.sun,this.sun.target);this.rim=new THREE.DirectionalLight(0x9bdcf0,1.05);this.rim.position.set(30,20,-50);this.scene.add(this.rim);
    this.player=this.makeCar(0xf3bc55,true);this.scene.add(this.player);this.player.position.z=4;
    this.damageFx=new CarDamageEffects(this.scene,this.player);
    this.rivalCars=[];this.spectators=new RaceSpectators(this.scene);this.trail=new THREE.Group();this.scene.add(this.trail);for(let i=0;i<12;i++){const p=mesh(this.trail,'box',0x80cbb8,0,.08,0,.08,.025,.32,.4,0,0x58a58f);p.visible=false;}this.boostFx=new BoostEffects(this.scene,this.player);this.exhaust=this.boostFx.exhaust;this.lookConfig={color:0xf3bc55,badge:0,trail:false};
    this.shadow=new THREE.Mesh(new THREE.PlaneGeometry(3.2,5.9),new THREE.MeshBasicMaterial({map:canvasTexture((c,w,h)=>{c.shadowColor='rgba(0,0,0,.62)';c.shadowBlur=22;c.fillStyle='rgba(0,0,0,.62)';const x=w*.2,y=h*.14,rw=w*.6,rh=h*.72,r=26;c.beginPath();c.moveTo(x+r,y);c.arcTo(x+rw,y,x+rw,y+rh,r);c.arcTo(x+rw,y+rh,x,y+rh,r);c.arcTo(x,y+rh,x,y,r);c.arcTo(x,y,x+rw,y,r);c.fill();},128,256),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}));this.shadow.rotation.x=-Math.PI/2;this.shadow.position.set(0,.07,4);this.scene.add(this.shadow);
    this.nitroReadyGlow=new THREE.Mesh(new THREE.PlaneGeometry(4.8,6.9),new THREE.MeshBasicMaterial({map:canvasTexture((c,w,h)=>{const glow=c.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);glow.addColorStop(0,'#71daff00');glow.addColorStop(.42,'#71daff00');glow.addColorStop(.7,'#71daff88');glow.addColorStop(1,'#71daff00');c.fillStyle=glow;c.fillRect(0,0,w,h);},128,128),transparent:true,depthWrite:false,opacity:.65}));this.nitroReadyGlow.rotation.x=-Math.PI/2;this.nitroReadyGlow.visible=false;this.scene.add(this.nitroReadyGlow);
    this.world=new THREE.Group();this.scene.add(this.world);this.gates=new Map();this.gate=new THREE.Group();this.roadBoards=new THREE.Group();this.scene.add(this.roadBoards);this.signAnchors=[];this.promptAnchor=new THREE.Vector3();this.traffic=[];this.elapsed=0;this.showcaseDistance=0;this.currentLane=0;this.index=-1;this.lastGate='';this.gateTextures=[];this.setup(0);
    this.look=new THREE.Vector3();this.resize();window.addEventListener('resize',()=>this.resize());
    this.viewportObserver=typeof ResizeObserver==='function'?new ResizeObserver(()=>this.resize()):null;this.viewportObserver?.observe(container);
    this.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();document.dispatchEvent(new Event('graphicslost'));});
    this.renderer.domElement.addEventListener('webglcontextrestored',()=>location.reload());
  }
  setPreferences(p){
    const changed=this.preferences.graphics!==p.graphics;this.preferences=p;
    if(changed){this.performanceBudget=createPerformanceBudget(p.graphics,window.devicePixelRatio||1);this.renderer.setPixelRatio(this.performanceBudget.ratio);this.resize();}
    this.renderer.shadowMap.enabled=p.graphics!=='battery';
  }
  samplePerformance(dt,active){if(samplePerformance(this.performanceBudget,dt,active)){this.renderer.setPixelRatio(this.performanceBudget.ratio);this.resize();}}
  resize(){const width=Math.max(1,this.container.clientWidth||innerWidth),height=Math.max(1,this.container.clientHeight||innerHeight);if(this.resized&&width===this.viewport.width&&height===this.viewport.height)return;this.viewport={width,height};this.resized=true;this.renderer.setSize(width,height);this.camera.aspect=width/height;this.camera.updateProjectionMatrix();}
  makeCar(color,player=false,kind=player?'coupe':'sedan'){
    // One draw call per material class: paint, glass, trim, lamps and wheels.
    const parts=vehicleParts(kind),a=parts.anchors,g=new THREE.Group(),wheels=[],brakeLights=[],indicators=[];
    const paint=new THREE.Mesh(parts.paint,paintMat(color));paint.userData.paint=true;g.add(paint);
    const glass=new THREE.Mesh(parts.glass,glassMaterial);g.add(glass);
    g.add(new THREE.Mesh(parts.trim,trimMaterial),new THREE.Mesh(parts.lights,lampMaterial));
    if(parts.stripes){const stripes=new THREE.Mesh(parts.stripes,trimMaterial);stripes.userData.stripes=true;g.add(stripes);}
    for(const side of [-1,1]){
      for(const z of parts.wheelSpec.z){const axle=new THREE.Group(),spin=new THREE.Group();axle.position.set(side*parts.wheelSpec.x,parts.wheelSpec.r,z);axle.add(spin);spin.add(new THREE.Mesh(parts.wheel,wheelMaterial));g.add(axle);axle.userData.front=z<0;axle.userData.spin=spin;wheels.push(axle);}
      brakeLights.push(mesh(g,'coach',0x873943,side*a.lamps.x,a.lamps.y,a.lamps.z,a.lamps.w,.11,.05,.2,.2,0x5b1820));
      const signal=new PartSet();signal.add('i',geo.box,0xffb347,side*(a.lamps.x+a.lamps.w/2+.05),a.lamps.y,a.lamps.z+.01,.12,.08,.04);signal.add('i',geo.box,0xffb347,side*(a.head.x+.24),a.head.y,a.head.z+.06,.12,.06,.04);
      const indicator=new THREE.Mesh(signal.merge('i'),indicatorMaterial);indicator.userData.indicator=side;indicator.visible=false;indicators.push(indicator);g.add(indicator);
    }
    g.traverse(m=>{if(m.isMesh){m.castShadow=m!==glass;m.receiveShadow=true;}});
    g.userData={indicators,wheels,brakeLights,wheelAngle:0,anchors:a,kind};g.userData.hitBounds=new THREE.Box3().setFromObject(g);return g;
  }
  animateCar(car,wheelAngle,steer,braking){
    for(const axle of car.userData.wheels||[]){axle.rotation.y=axle.userData.front?steer:0;axle.userData.spin.rotation.x=wheelAngle;}
    for(const lamp of car.userData.brakeLights||[])lamp.material=braking?mat(0xff6564,.2,.2,0xff2929):mat(0x873943,.2,.2,0x5b1820);
  }
  setCosmetics(look){this.lookConfig=look;
    if(!this.teamRoundel){this.teamRoundel=new THREE.Mesh(new THREE.PlaneGeometry(.73,.97).rotateX(-Math.PI/2));const a=this.player.userData.anchors;this.teamRoundel.position.set(0,a.roofY+.004,a.roofZ);this.teamRoundel.scale.setScalar(.82);this.player.add(this.teamRoundel);}
    this.teamRoundel.visible=!!look.teamId;if(look.teamId)this.teamRoundel.material=liveryPlate(look.teamId,look.teamId[0].toUpperCase(),look.color);
    this.player.traverse(m=>{if(m.userData.paint)m.material=paintMat(look.color);});if(!this.hoodBadge){const badge=this.player.userData.anchors.badge;this.hoodBadge=mesh(this.player,'cylinder',0xf7dfa1,0,badge.y+.006,badge.z,.20,.02,.20,.3,.6,0x584520);this.hoodBadge.userData.cosmetic=true;const shape=new THREE.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?.065:.15;if(i===0)shape.moveTo(Math.cos(a)*r,Math.sin(a)*r);else shape.lineTo(Math.cos(a)*r,Math.sin(a)*r);}shape.closePath();this.badgeStar=new THREE.Mesh(new THREE.ShapeGeometry(shape),mat(0x3d4d5b,.3,.5));this.badgeStar.rotation.x=-Math.PI/2;this.badgeStar.position.set(0,badge.y+.02,badge.z);this.player.add(this.badgeStar);}this.hoodBadge.visible=this.badgeStar.visible=look.badge>0;this.hoodBadge.material=mat([0xf7dfa1,0xa9d2ce,0xe9c373,0xd2c2ec][look.badge]||0xf7dfa1,.3,.6);}
  addContactShadow(car){
    if(!this.contactMaterial){this.contactMaterial=this.shadow.material.clone();this.contactMaterial.opacity=.52;}
    const shadow=new THREE.Mesh(geo.contact,this.contactMaterial);shadow.rotation.x=-Math.PI/2;shadow.scale.set(3.0,5.4,1);shadow.position.y=.055;this.scene.add(shadow);car.userData.contactShadow=shadow;
  }
  placeContactShadow(car){const shadow=car.userData.contactShadow;if(shadow){shadow.visible=car.visible&&1-2*(car.quaternion.x**2+car.quaternion.z**2)>.8;shadow.position.set(car.position.x,car.position.y+.055,car.position.z);shadow.rotation.z=-car.rotation.y;}}
  syncRivals(state){
    if(this.rivalState===state)return;for(const m of this.rivalCars){if(m.userData.contactShadow)this.scene.remove(m.userData.contactShadow);this.scene.remove(m);m.traverse(n=>{if(n.isMesh&&n.userData.ownGeometry)n.geometry.dispose();});}this.rivalCars=[];this.rivalState=state;
    for(const r of state?.rivals||[]){const m=this.makeCar(r.color,false,'gt'),a=m.userData.anchors;m.userData.rival=r;const plate=new THREE.Mesh(new THREE.PlaneGeometry(.62,.8).rotateX(-Math.PI/2),liveryPlate('rival'+r.id,String(r.id+2).padStart(2,'0'),r.color));plate.userData.ownGeometry=true;plate.position.set(0,a.roofY+.004,a.roofZ);m.add(plate);const exhaust=new THREE.Group();for(const side of [-1,1]){const flame=mesh(exhaust,'cone',r.id?0xffc697:0x93e5ff,side*a.exhaust[0],a.exhaust[1],a.exhaust[2]+.5,.11,.85,.11,.2,0,r.id?0xff9658:0x45b8ef);flame.rotation.x=-Math.PI/2;flame.material=r.id?rivalFlameB:rivalFlameA;}exhaust.visible=false;m.add(exhaust);m.userData.nitroExhaust=exhaust;this.scene.add(m);this.addContactShadow(m);this.rivalCars.push(m);}
  }
  rivalProjection(){this.camera.updateMatrixWorld();return this.rivalCars.map(m=>{const p=m.position.clone();p.y+=2.5;p.project(this.camera);return {id:m.userData.rival.id,x:(p.x*.5+.5)*this.viewport.width,y:(-.5*p.y+.5)*this.viewport.height,visible:m.visible&&p.z>-1&&p.z<1&&m.position.z<-3};});}
  ribbon(g,points,width,color,y=.13){const vertices=[];for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1];vertices.push(a.x-width/2,y,-a.at,a.x+width/2,y,-a.at,b.x-width/2,y,-b.at,b.x-width/2,y,-b.at,a.x+width/2,y,-a.at,b.x+width/2,y,-b.at);}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.computeVertexNormals();const uvs=[];for(let i=0;i<vertices.length;i+=3)uvs.push(vertices[i]/10.8,-vertices[i+2]/20);geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));const m=new THREE.Mesh(geometry,color===this.palette.road?this.asphaltMaterial:mat(color));m.receiveShadow=true;g.add(m);return m;}
  setup(index){
    if(index===this.index)return;
    this.index=index;const look=LOOKS[index];this.arenaLook=look;this.palette={road:look.road};
    // Release the previous arena: per-chunk roadside copies, kit, textures.
    for(const g of this.segments||[]){for(const m of [...g.userData.roadSurfaces,...g.userData.roadside])m.geometry.dispose();}
    for(const item of this.landmarks||[])item.group.traverse(m=>{if(m.isMesh&&m.geometry!==this.rotorGeometry)m.geometry.dispose();});
    this.world.traverse(o=>{if(o.isMesh&&o.userData.ownGeometry)o.geometry.dispose();});this.world.clear();this.kit?.dispose();
    for(const t of [this.roadTexture,this.asphaltTexture,this.reflectionTexture,this.waterNormal,this.cloudTexture])t?.dispose();for(const m of [this.roadMaterial,this.asphaltMaterial,this.waterMaterial,this.sceneryMaterial])m?.dispose();
    if(this.rain){this.scene.remove(this.rain);this.rain.geometry.dispose();this.rain.material.dispose();this.rain=null;}
    this.waterNormal=null;this.segments=[];this.courseState=undefined;this.kit=createKit(index);
    // Light, fog and sky share one horizon colour: fully fogged scenery
    // dissolves into the sky instead of appearing as a pale silhouette.
    this.scene.fog=new THREE.Fog(look.fog,look.fogNear,look.fogFar);this.scene.background=new THREE.Color(look.horizon);
    this.sun.color.set(look.sun);this.sun.intensity=look.sunIntensity;this.sunOffset.set(...look.sunPosition);
    this.hemi.color.set(look.hemiSky);this.hemi.groundColor.set(look.hemiGround);this.hemi.intensity=look.hemi;this.rim.color.set(look.rim);this.rim.intensity=look.rimIntensity;this.renderer.toneMappingExposure=look.exposure;
    const sky=skyDome(look);sky.userData.ownGeometry=true;this.world.add(sky);this.skyDome=sky;
    const far=backdrop(index,look);far.userData.ownGeometry=true;this.world.add(far);
    const hex=c=>'#'+new THREE.Color(c).getHexString();
    this.reflectionTexture=canvasTexture((c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,hex(look.zenith));g.addColorStop(.46,hex(look.horizon));g.addColorStop(.5,hex(look.sunGlow));g.addColorStop(.54,hex(look.hemiGround));g.addColorStop(1,hex(shadeHex(look.hemiGround,.5)));c.fillStyle=g;c.fillRect(0,0,w,h);const glow=c.createRadialGradient(w*.3,h*.32,1,w*.3,h*.32,30);glow.addColorStop(0,'#fff8e4');glow.addColorStop(1,'#fff8e400');c.fillStyle=glow;c.fillRect(0,0,w,h);},256,128);this.reflectionTexture.mapping=THREE.EquirectangularReflectionMapping;this.scene.environment=this.reflectionTexture;this.scene.environmentIntensity=index===2?.62:.7;
    // Asphalt: two grain sizes, tyre polish in each lane and sealed cracks.
    const anisotropy=Math.min(8,this.renderer.capabilities?.getMaxAnisotropy?.()||1);
    this.asphaltTexture=canvasTexture((c,w,h)=>{c.fillStyle=hex(look.road);c.fillRect(0,0,w,h);const rng=window.RallyCore.random(101+index);for(let i=0;i<6000;i++){c.fillStyle=i%3?'#ffffff07':'#0000000c';const size=i%7?2:3;c.fillRect(rng()*w,rng()*h,size,size);}for(const lane of [1,3,5])for(const o of [-.045,.045]){const x=w*(lane/6+o);const g=c.createLinearGradient(x-14,0,x+14,0);g.addColorStop(0,'#00000000');g.addColorStop(.5,index===2?'#ffffff0d':'#0000000f');g.addColorStop(1,'#00000000');c.fillStyle=g;c.fillRect(x-14,0,28,h);}c.strokeStyle='#00000024';c.lineWidth=2;for(let i=0;i<5;i++){c.beginPath();let x=rng()*w,y=rng()*h;c.moveTo(x,y);for(let k=0;k<5;k++){x+=(rng()-.5)*40;y+=rng()*30;c.lineTo(x,y);}c.stroke();}},512,512);
    this.asphaltTexture.wrapS=this.asphaltTexture.wrapT=THREE.RepeatWrapping;this.asphaltTexture.anisotropy=anisotropy;
    this.asphaltMaterial=new THREE.MeshStandardMaterial({map:this.asphaltTexture,roughness:look.roadRough,metalness:index===2?.18:.02});
    this.roadTexture=canvasTexture((c,w,h)=>{c.drawImage(this.asphaltTexture.image,0,0,w,h);c.strokeStyle=index===2?'#e6e9f4':'#f1ede0';c.lineWidth=7;c.beginPath();c.moveTo(16,0);c.lineTo(16,h);c.moveTo(w-16,0);c.lineTo(w-16,h);c.stroke();c.setLineDash([88,72]);c.lineWidth=6;for(let x of[w/3,w*2/3]){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}},512,1024);
    this.roadTexture.wrapS=this.roadTexture.wrapT=THREE.RepeatWrapping;this.roadTexture.anisotropy=anisotropy;
    const roadMaterial=new THREE.MeshStandardMaterial({map:this.roadTexture,roughness:look.roadRough,metalness:index===2?.18:.02});this.roadMaterial=roadMaterial;
    this.sceneryMaterial=new THREE.MeshStandardMaterial({vertexColors:true,roughness:index===2?.74:.88,metalness:0});
    if(index===1){
      this.waterNormal=canvasTexture((c,w,h)=>{c.fillStyle='#8080ff';c.fillRect(0,0,w,h);for(let y=0;y<h;y+=4)for(let x=0;x<w;x+=4){const v=Math.sin(x*.07+Math.sin(y*.08)*2),u=Math.cos(y*.13+Math.sin(x*.04));c.fillStyle=`rgb(${128+Math.round(v*28)},${128+Math.round(u*22)},245)`;c.fillRect(x,y,4,4);}},256,256);this.waterNormal.colorSpace=THREE.NoColorSpace;this.waterNormal.wrapS=this.waterNormal.wrapT=THREE.RepeatWrapping;this.waterNormal.repeat.set(40,40);
      this.waterMaterial=new THREE.MeshStandardMaterial({color:look.water,roughness:.16,metalness:.18,normalMap:this.waterNormal,normalScale:new THREE.Vector2(.5,.5),envMapIntensity:1.3});
      const water=new THREE.Mesh(new THREE.PlaneGeometry(1600,1100).rotateX(-Math.PI/2),this.waterMaterial);water.position.set(0,-3.3,-260);water.userData.ownGeometry=true;water.receiveShadow=true;this.world.add(water);
    }else{const ground=new THREE.Mesh(new THREE.BoxGeometry(1100,1,900),new THREE.MeshStandardMaterial({color:look.ground,roughness:1}));ground.position.set(0,-.56,-230);ground.userData.ownGeometry=true;ground.receiveShadow=true;this.world.add(ground);}
    for(let i=0;i<19;i++){
      const group=new THREE.Group(),road=new THREE.Mesh(new THREE.PlaneGeometry(10.8,20,1,8).rotateX(-Math.PI/2),roadMaterial);road.position.y=.02;road.receiveShadow=true;group.add(road);
      const shoulder=new THREE.Mesh(new THREE.PlaneGeometry(10.8,20,1,8).rotateX(-Math.PI/2),this.asphaltMaterial);shoulder.position.y=.02;shoulder.receiveShadow=true;group.add(shoulder);
      group.userData.roadSurfaces=[road,shoulder];group.userData.flexSurfaces=[road,shoulder];group.userData.roadside=[];group.userData.scenery=[];
      for(const side of [-1,1]){
        const src=Object.values(this.kit.roadside)[0][0][side],edge=new THREE.Mesh(src.clone(),this.sceneryMaterial);edge.userData.side=side;edge.receiveShadow=true;edge.userData.flatPositions=src.attributes.position.array;edge.userData.flatNormals=src.attributes.normal.array;group.add(edge);group.userData.roadside.push(edge);group.userData.flexSurfaces.push(edge);
        const scenery=new THREE.Mesh(this.kit.empty,this.sceneryMaterial);group.add(scenery);group.userData.scenery.push({mesh:scenery,group:scenery,side});
      }
      for(const m of [road,shoulder]){m.userData.flatPositions=m.geometry.attributes.position.array.slice();m.userData.flatNormals=m.geometry.attributes.normal.array.slice();}this.world.add(group);this.segments.push(group);
    }
    // Landmarks give each arena a few memorable silhouettes.
    this.landmarks=[];this.rotorGeometry??=rotorGeometry();
    for(const item of landmarkPlan(index,window.RallyCore.ARENAS[index].length)){
      const parts=landmarkGeometry(index,item.kind,look),group=new THREE.Group(),body=new THREE.Mesh(parts.static,this.sceneryMaterial);group.add(body);
      const rotors=(parts.rotors||[]).map(([x,y,z])=>{const rotor=new THREE.Mesh(this.rotorGeometry,this.sceneryMaterial);rotor.position.set(x,y,z);group.add(rotor);return rotor;});
      group.visible=false;this.world.add(group);this.landmarks.push({...item,...parts,group,rotors});
    }
    // Soft sky sprites. Storm clouds sit lower and darker.
    this.cloudTexture=canvasTexture((c,w,h)=>{for(let i=0;i<9;i++){const x=w*(.2+.6*Math.random()),y=h*(.45+.2*Math.random()),r=w*(.12+.12*Math.random()),g=c.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,'#ffffffcc');g.addColorStop(1,'#ffffff00');c.fillStyle=g;c.fillRect(0,0,w,h);}},256,128);
    this.clouds=[];const rng=window.RallyCore.random(921+index);
    for(let i=0;i<(index===2?14:9);i++){const cloud=new THREE.Sprite(new THREE.SpriteMaterial({map:this.cloudTexture,color:index===2?0x6d7893:0xffffff,opacity:index===2?.85:index===1?.5:.62,transparent:true,fog:false,depthWrite:false}));const w=index===2?120+rng()*90:70+rng()*70;cloud.scale.set(w,w*.36,1);cloud.position.set((rng()-.5)*620,index===2?48+rng()*30:70+rng()*50,-300-rng()*170);cloud.renderOrder=-8;cloud.userData.drift=.6+rng()*.8;this.world.add(cloud);this.clouds.push(cloud);}
    if(index===2){
      // Restrained rain: thin streaks around the camera, never over the HUD.
      const rain=new THREE.InstancedMesh(new THREE.BoxGeometry(.018,1.1,.018),new THREE.MeshBasicMaterial({color:0xc7d4ec,transparent:true,opacity:.2,depthWrite:false,fog:false}),320);rain.frustumCulled=false;rain.instanceMatrix.setUsage(THREE.DynamicDrawUsage);rain.userData.drops=Array.from({length:320},(_,i)=>[(rng()-.5)*44,rng()*20,-rng()*70+4,.7+rng()*.6]);this.scene.add(rain);this.rain=rain;
    }
    this.tunnels=planTunnels(index,window.RallyCore.ARENAS[index].length,[]);
    this.clearGate();
  }
  // Outer road edge for one side, including task aprons and fork branches.
  edge(at,side){
    let w=this.apronWidth(at);
    for(const f of this.forkRoutes||[]){
      if(at<f.bounds.start||at>f.bounds.end)continue;const r=f.routes[0],ease=p=>{p=THREE.MathUtils.clamp(p,0,1);return p*p*p*(10+p*(-15+6*p));};let ext;
      if(at<r.start)ext=3.35+8.2-2.8*ease((at-f.bounds.start)/30);else if(at>r.end)ext=3.35+5.4+2.8*ease((at-r.end)/40);
      else{const xs=f.routes.map(q=>q.lane*3.35+window.RallyCore.routeOffset(q,at));ext=side>0?Math.max(...xs)+5.4:5.4-Math.min(...xs);}
      w=Math.max(w,ext);
    }
    return w;
  }
  // Rebuild one recycled chunk at its course position (only behind the camera).
  rebuildChunk(g,n,at){
    const plan=chunkPlan(this.index,n,{tunnels:this.tunnels,open:this.coasterRanges});g.userData.plan=plan;
    for(const [i,road]of g.userData.roadSurfaces.entries()){road.geometry.dispose();road.geometry=this.mainRoadGeometry(at,i===1);road.userData.flatPositions=road.geometry.attributes.position.array.slice();road.userData.flatNormals=road.geometry.attributes.normal.array.slice();}
    for(const m of g.userData.roadside){const [name,v]=plan.roadside[m.userData.side],list=this.kit.roadside[name],src=list[v%list.length][m.userData.side];m.geometry.dispose();m.geometry=src.clone();m.userData.flatPositions=src.attributes.position.array;m.userData.flatNormals=src.attributes.normal.array;m.castShadow=!!plan.tunnel;}
    const edgeMax={'-1':5.4,'1':5.4};for(let z=-10;z<=10;z+=2.5)for(const s of [-1,1])edgeMax[s]=Math.max(edgeMax[s],this.sceneryEdge(at-z,s));
    for(const sc of g.userData.scenery){const v=plan.scenery[sc.side];sc.mesh.geometry=v<0?this.kit.empty:this.kit.scenery[sc.side][v];sc.mesh.position.x=sc.side*(edgeMax[sc.side]+5.6);}
    const angle=g.rotation.y,c=Math.cos(angle),sn=Math.sin(angle);
    for(const m of g.userData.flexSurfaces){
      const attr=m.geometry.attributes.position,normal=m.geometry.attributes.normal,flat=m.userData.flatPositions,normals=m.userData.flatNormals,side=m.userData.side||0;
      for(let v=0;v<flat.length;v+=3){const z=flat[v+2],course=at-z,xx=flat[v]+(side?side*(this.edge(course,side)-5.4):0)+this.curve(course)-this.curve(at);attr.array[v]=c*xx-sn*z;attr.array[v+1]=flat[v+1];attr.array[v+2]=sn*xx+c*z;const nx=normals[v],ny=normals[v+1],nz=normals[v+2]+(this.curve(course+.1)-this.curve(course-.1))/.2*nx,len=Math.hypot(nx,ny,nz)||1;normal.array[v]=(c*nx-sn*nz)/len;normal.array[v+1]=ny/len;normal.array[v+2]=(sn*nx+c*nz)/len;}
      attr.needsUpdate=true;normal.needsUpdate=true;m.geometry.computeBoundingSphere();
    }
  }
  // Buildings and landmarks keep clear of a coaster track on either side.
  sceneryEdge(at,side){let clear=0;for(const r of this.coasterRanges||[])if(at>r.start&&at<r.end)clear=Math.max(clear,r.wide.some(w=>at>w.start&&at<w.end)?54:27);return Math.max(this.edge(at,side),clear);}
  curve(at){return window.RallyCore.courseCurve(this.index,at);}
  heading(at,route){const C=window.RallyCore;return -Math.atan((this.curve(at+1)+C.routeOffset(route,at+1)-this.curve(at-1)-C.routeOffset(route,at-1))/2);}
  prepareCourse(state){
    if(this.courseState===state&&this.courseRevision===state?.taskRevision)return;
    this.courseState=state;this.courseRevision=state?.taskRevision;this.roadReservations=[];this.forkRanges=[];this.apronRanges=[];
    // Bridge Builder: the road itself is missing over each repair gap.
    this.gapRanges=(state?.tasks||[]).filter(t=>t.kind==='repair').map(t=>({start:t.at,end:t.at+BRIDGE_LENGTH}));
    for(const t of state?.tasks||[]){const zone=window.RallyCore.taskZone(t);this.roadReservations.push({start:zone.start-80,end:zone.end+80});this.apronRanges.push({start:zone.start-70,fullStart:zone.start-30,fullEnd:zone.end+25,end:zone.end+80});
      // The same landing shoulder as the core (see landingZone).
      if(t.coaster){const at=t.at+t.coaster.span;this.apronRanges.push({start:at-110,fullStart:at-70,fullEnd:at+45,end:at+100});}if(t.kind==='junction')this.forkRanges.push(forkBounds(window.RallyCore.makeRoute(state,t,0,true,true)));}
    const C=window.RallyCore;this.forkRoutes=(state?.tasks||[]).filter(t=>t.kind==='junction').map(t=>{const routes=C.groundRoutes(state,t);return {routes,bounds:forkBounds(routes[0])};});
    // Buildings step back on both sides of a Sky Coaster, so neither the track
    // nor the cleared side hints at the answer before it is judged.
    this.coasterRanges=(state?.tasks||[]).filter(t=>t.coaster).map(t=>{const layout=C.RIDE_LAYOUTS[t.coaster.layout],at=u=>t.at+u*t.coaster.span/layout.span;return {start:t.at-40,end:t.at+t.coaster.span+30,wide:layout.elements.filter(d=>d.kind==='helix').map(d=>({start:at(d.start-12),end:at(d.end+12)}))};});
    // Tunnels avoid every task zone, spectator stand and the finish straight.
    const zones=(state?.tasks||[]).map(t=>C.taskZone(t)),blocked=zones.map(z=>({start:z.start-80,end:z.reach+80}));
    const length=state?.arena?.length??C.ARENAS[this.index].length;blocked.push({start:length-260,end:length+200});
    this.tunnels=planTunnels(this.index,length,state?blocked:[]);this.spectators.blocked=this.tunnels;
    for(const g of this.segments)g.userData.curveIndex=undefined;
  }
  apronWidth(at){
    const ease=p=>{p=THREE.MathUtils.clamp(p,0,1);return p*p*p*(10+p*(-15+6*p));};let width=5.4;
    for(const r of this.apronRanges||[]){const envelope=Math.min(ease((at-r.start)/(r.fullStart-r.start)),ease((r.end-at)/(r.end-r.fullEnd)));width=Math.max(width,5.4+6.15*envelope);}
    return width;
  }
  mainRoadGeometry(at,shoulder=false){
    const start=at-10,end=at+10,ats=new Set();for(let i=0;i<=8;i++)ats.add(start+i*2.5);
    for(const r of [...this.forkRanges||[],...this.gapRanges||[]])for(const edge of [r.start,r.end])if(edge>start&&edge<end)ats.add(edge);
    const rows=[...ats].sort((a,b)=>a-b),positions=[],uvs=[],indices=[],normals=[],stride=shoulder?4:2;
    rows.forEach(p=>{const width=this.apronWidth(p),xs=shoulder?[-width,-5.4,5.4,width]:[-5.4,5.4];for(const x of xs){positions.push(x,0,at-p);normals.push(0,1,0);uvs.push(shoulder?x/10.8:x<0?0:1,p/20);}});
    for(let i=0;i<rows.length-1;i++){const mid=(rows[i]+rows[i+1])/2;if(this.forkRanges?.some(r=>mid>r.start&&mid<r.end)||!shoulder&&this.gapRanges?.some(r=>mid>r.start&&mid<r.end)||shoulder&&this.apronWidth(mid)<5.40001)continue;for(let j=0;j<stride;j+=2){const n=i*stride+j;indices.push(n,n+1,n+stride,n+stride,n+1,n+stride+1);}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);return g;
  }
  clearGate(){
    for(const g of this.gates.values())this.disposeGate(g);
    this.gates.clear();this.gate=new THREE.Group();this.lastGate='';this.preparedState=null;
  }
  disposeGate(g){this.scene.remove(g);g.traverse(m=>{if((m.isMesh||m.isLine)&&!Object.values(geo).includes(m.geometry))m.geometry.dispose();});(g.userData.textures||[]).forEach(t=>t.dispose());(g.userData.ownMaterials||[]).forEach(m=>m.dispose());}
  makePerson(word,index,g){
    const p=new THREE.Group();p.scale.setScalar(1.5);const skin=[0xd4a484,0xc58e70,0xe2b99a,0xa77458][index%4],shirt=[0x71afaa,0xba9466,0x8e9cc0,0xb37e8d][index%4];
    mesh(p,'box',shirt,0,1.48,0,.65,.84,.38);mesh(p,'sphere',skin,0,2.18,0,.29,.32,.27);mesh(p,'sphere',0x493e3b,0,2.39,-.02,.3,.15,.27);
    for(const side of [-1,1]){let leg=mesh(p,'box',0x34475c,side*.19,.66,0,.23,.75,.25);leg.userData.leg=side;mesh(p,'box',0x24354a,side*.19,.2,.07,.28,.2,.43);let arm=mesh(p,'box',shirt,side*.39,1.44,.12,.2,.72,.23);arm.rotation.z=side*.18;mesh(p,'sphere',skin,side*.42,1.16,.25,.12,.12,.12);mesh(p,'sphere',0x263442,side*.1,2.21,.25,.036,.036,.016);}
    const tex=canvasTexture((c,w,h)=>{c.fillStyle='#f4e9d0';c.fillRect(0,0,w,h);c.strokeStyle='#44696b';c.lineWidth=12;c.strokeRect(7,7,w-14,h-14);c.textAlign='center';c.fillStyle='#20394c';c.font='bold '+(word.length>16?36:50)+'px sans-serif';c.fillText(word,w/2,145,w-40);},512,256);g.userData.textures.push(tex);
    const material=new THREE.MeshBasicMaterial({map:tex});g.userData.ownMaterials.push(material);const board=new THREE.Mesh(new THREE.PlaneGeometry(1.45,.72),material);board.position.set(0,1.22,.31);p.add(board);p.userData.personIndex=index;p.userData.signPoint=new THREE.Vector3(0,1.22,.34);return p;
  }
  // Sky Coaster: twin banked tracks on white supports, in 40 m pieces that
  // rise out of the ground once the route choice is judged. One vertex-coloured
  // mesh per piece keeps the draw calls low.
  // Rides (Sky Coaster, Sea Jump, Cliff Plunge): twin banked tracks in the
  // arena's style, in 40 m pieces that rise out of the ground once the route
  // choice is judged. One vertex-coloured mesh per piece keeps draw calls low.
  buildCoaster(g,task,state){
    const C=window.RallyCore,route=C.makeRoute(state,task,task.correctIndex,true),layout=C.rideLayout(route),reduced=!!this.preferences.reduced,old=g.userData.coaster;
    if(old){g.remove(old.group);old.group.traverse(m=>{if(m.isMesh)m.geometry.dispose();});}
    const frames=rideFrames({route,curve:at=>this.curve(at),offset:C.routeOffset,height:C.coasterHeight,origin:task.at,span:layout.span,elements:layout.elements,reduced});
    const centre=at=>this.curve(at)-this.curve(task.at),supports=supportPlan(frames,centre,(at,side)=>this.edge(at,side));
    // Sunlit: steel and red rails; Coastal: white deck, teal rails, pylons into
    // the sea; Stormcrest: timber deck, steel rails, dark rock tunnel.
    const style=[{deck:0x3d4f63,rail:0xe8574a,support:0xf1efe8,base:0,rock:0x6d6a66},{deck:0xe3e9ec,rail:0x26aebc,support:0xb7c3c8,base:-3.3,rock:0x7d8a8c},{deck:0x6e5440,rail:0x9aa5ad,support:0x574d45,base:0,rock:0x55504b}][this.index]||{deck:0x3d4f63,rail:0xe8574a,support:0xf1efe8,base:0,rock:0x6d6a66};
    const group=new THREE.Group(),pieces=[],colour=new THREE.Color(),piece=40,battery=this.preferences.graphics==='battery';
    for(let start=route.start;start<route.end-1;start+=piece){
      const slice=frames.filter((f,i)=>f.at>=start-1e-6&&f.at<=start+piece+.51&&(!battery||i%2===0||f.inDetour)),parts=[];
      const add=(geometry,hex)=>{const count=geometry.positions.length/3,colours=new Float32Array(count*3);colour.setHex(hex);for(let i=0;i<count;i++)colours.set([colour.r,colour.g,colour.b],i*3);parts.push({...geometry,colours});};
      // A flight leaves a real gap; a half-pipe swaps the rails for walls.
      for(const run of frameRuns(slice,f=>!f.air&&f.p[1]>.12))for(const track of [0,route.side*TRACK_PASS]){
        add(sweep(run,DECK_SECTION,track),style.deck);
        for(const part of frameRuns(run,f=>!f.halfpipe))for(const rail of [-TRACK_HALF+.12,TRACK_HALF-.12])add(sweep(part,railSection(rail),track),style.rail);
        for(const part of frameRuns(run,f=>f.halfpipe))for(const rail of [-TRACK_HALF,TRACK_HALF])add(sweep(part,wallSection(rail),track),style.rail);
      }
      // Rock ribs every few metres: a tunnel the camera can still see into.
      const ribs=slice.filter(f=>f.tunnel);for(let i=0;i<ribs.length-3;i+=9)add(sweep(ribs.slice(i,i+3),ribSection(route.side*TRACK_PASS/2),0),style.rock);
      const box=(x0,x1,y0,y1,z,depth)=>{const xs=[x0,x1],ys=[y0,y1],zs=[z-depth/2,z+depth/2],positions=[];for(const x of xs)for(const y of ys)for(const zz of zs)positions.push(x,y,zz);
        return {positions,indices:[0,1,3,0,3,2,4,6,7,4,7,5,0,4,5,0,5,1,2,3,7,2,7,6,0,2,6,0,6,4,1,5,7,1,7,3]};};
      for(const p of supports.filter(p=>p.at>=start&&p.at<start+piece)){
        if(p.kind==='column')add(box(p.x-.32,p.x+.32,style.base,p.top,p.z,.64),style.support);
        else{for(const x of [p.left,p.right])add(box(x-.3,x+.3,style.base,p.top,p.z,.6),style.support);add(box(p.left-.3,p.right+.3,p.top-.55,p.top,p.z,.7),style.support);}
      }
      if(!parts.length)continue;
      const positions=[],colours=[],indices=[];for(const part of parts){const offset=positions.length/3;positions.push(...part.positions);colours.push(...part.colours);for(const i of part.indices)indices.push(i+offset);}
      const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colours,3));geometry.setIndex(indices);geometry.computeVertexNormals();
      const m=new THREE.Mesh(geometry,this.coasterMaterial||=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.48,metalness:.2,side:THREE.DoubleSide,flatShading:true}));m.castShadow=!battery;m.visible=false;m.scale.y=.001;
      // The reveal is a quick wave: the whole track is up within half a second.
      group.add(m);pieces.push({mesh:m,start,end:start+piece,delay:(start-route.start)/(route.end-route.start)*.32,rise:0});
    }
    // A billboard before the fork promises the ride without showing the lane.
    if(!old){const board=new THREE.Group();for(const x of [-1.4,1.4])mesh(board,'cylinder',0x58707f,x,3.2,0,.12,6.4,.12);
      const tex=signTexture(layout.title,'#ffd976',layout.tagline);g.userData.textures.push(tex);const material=new THREE.MeshBasicMaterial({map:tex});g.userData.ownMaterials.push(material);
      const face=new THREE.Mesh(new THREE.PlaneGeometry(5.4,2.7),material);face.position.set(0,5.4,.15);board.add(face);
      const at=task.at-130;board.position.set(this.curve(at)-this.curve(task.at)+this.edge(at,1)+3.2,0,130);board.rotation.y=-.35;g.add(board);}
    g.add(group);g.userData.coaster={group,pieces,frames,route,reduced,revealedAt:old?.revealedAt??null};
  }
  updateCoaster(g,t,state){
    const ride=g.userData.coaster;if(!ride)return;
    if(ride.reduced!==!!this.preferences.reduced)this.buildCoaster(g,t,state);
    const live=g.userData.coaster;
    // Revealed only once the player's own answer is judged: before that the
    // track (and so the correct lane) stays hidden, even if a rival rides it.
    if(live.revealedAt==null&&t.completed)live.revealedAt=this.clock;
    if(live.revealedAt==null)return;
    const age=this.clock-live.revealedAt;
    for(const p of live.pieces){const k=THREE.MathUtils.clamp((age-p.delay)/.2,0,1);p.rise=this.preferences.reduced?1:1-(1-k)**3;p.mesh.visible=p.rise>0;p.mesh.scale.y=Math.max(.001,p.rise);}
  }
  // How far the track under a ride position has risen (0 hidden, 1 built).
  rideRise(route,at){const ride=this.gates.get(route.taskId)?.userData.coaster;if(!ride||ride.revealedAt==null)return 0;const p=ride.pieces.find(p=>at>=p.start&&at<p.end);return p?p.rise:1;}
  // World pose of a car riding a Sky Coaster at a lateral track offset, or
  // null off a ride. Until its track has risen, a car is drawn where the
  // ordinary shortcut branch would carry it (fallback), then lifted onto the
  // track. `speed` is the visual speed relative to the road.
  ridePose(route,at,offset,d,base,fallback){
    if(!route?.coaster)return null;const ride=this.gates.get(route.taskId)?.userData.coaster;if(!ride)return null;
    const C=window.RallyCore,pose=framePose(ride.frames,at,offset),rise=this.rideRise(route,at),gateX=this.curve(ride.route.start)-base,gateZ=-(ride.route.start-d)+4;
    const position=new THREE.Vector3(pose.position[0]+gateX,pose.position[1]*(fallback?1:rise),pose.position[2]+gateZ);
    const basis=new THREE.Matrix4().makeBasis(new THREE.Vector3(...pose.right),new THREE.Vector3(...pose.up),new THREE.Vector3(...pose.forward).negate()),quaternion=new THREE.Quaternion().setFromRotationMatrix(basis);
    if(rise<1&&fallback){position.lerpVectors(fallback.position,position,rise);quaternion.slerpQuaternions(fallback.quaternion,quaternion,rise);}
    return {position,quaternion,forward:pose.forward,up:pose.up,speed:pose.speed*C.coasterPace(route,at),detour:pose.detour*rise,wide:pose.wide*rise,kind:pose.kind,air:pose.air,side:route.side,rise};
  }
  // Bridge Builder: a real gap with a BRIDGE OUT board. Each word slab drops
  // in as its block is connected (Sunlit: a crane lowers it; Coastal: a
  // drawbridge leaf folds down; Stormcrest: a carved stone slams in), a wrong
  // block's slab wobbles and swings back out, the words light up under the
  // wheels, and a kick ramp on the last slab gives a small hop.
  buildBridge(g,task){
    const curveAt=at=>this.curve(at)-this.curve(task.at),heading=at=>-Math.atan((this.curve(at+1)-this.curve(at-1))/2),arena=this.index;
    const style=[{slab:0x8e979e,pit:0x1d1815,wall:0x3a3532,depth:5},{slab:0x7f939e,pit:0,wall:0xc9d1d5,depth:1.4},{slab:0x7d746c,pit:0x221f1c,wall:0x37322e,depth:16}][arena]||{slab:0x8e979e,pit:0x1d1815,wall:0x3a3532,depth:5};
    // The hole follows the road's bend in 4 m pieces. Over land it is a dark
    // shaded void just under the road (the ground sits right below it); on the
    // Coastal bridge it opens to the sea, with the deck's cut edges showing.
    const voidTex=canvasTexture((c,w,h)=>{const grad=c.createLinearGradient(0,0,w,0);grad.addColorStop(0,'#2b2622');grad.addColorStop(.18,'#0d0b0a');grad.addColorStop(.82,'#0d0b0a');grad.addColorStop(1,'#2b2622');c.fillStyle=grad;c.fillRect(0,0,w,h);},128,8);g.userData.textures.push(voidTex);
    const voidMat=new THREE.MeshBasicMaterial({map:voidTex,color:style.pit||0x0d0b0a});g.userData.ownMaterials.push(voidMat);
    // Gap pieces and slabs bend with the road (baked into their geometry), so
    // their edges meet the cut road edges exactly on every curve.
    const follow=(m,source,start,zBase=0)=>{m.updateMatrix();const shape=source.clone().applyMatrix4(m.matrix),p=shape.attributes.position;for(let i=0;i<p.count;i++)p.setX(i,p.getX(i)+curveAt(start-zBase-p.getZ(i))-curveAt(start));shape.computeVertexNormals();m.geometry=shape;m.position.set(0,0,0);m.rotation.set(0,0,0);m.scale.set(1,1,1);return m;};
    const strip=(segments=8)=>new THREE.BoxGeometry(1,1,1,1,1,segments);
    if(arena===1)for(let at=task.at;at<task.at+BRIDGE_LENGTH-1e-6;at+=4){const mid=at+2,x=curveAt(mid),z=task.at-mid,r=heading(mid);for(const side of [-1,1]){const wall=mesh(g,'box',style.wall,x+side*5.5,-style.depth/2,z,.25,style.depth,4.05);wall.rotation.y=r;}}
    else{const hole=new THREE.Mesh(geo.contact,voidMat);hole.rotation.x=-Math.PI/2;hole.scale.set(10.8,BRIDGE_LENGTH,1);hole.position.set(0,-.035,-BRIDGE_LENGTH/2);g.add(hole);follow(hole,new THREE.PlaneGeometry(1,1,1,24),task.at);}
    if(arena===1)for(const z of [0,-BRIDGE_LENGTH]){const end=mesh(g,'box',style.wall,curveAt(task.at-z),-style.depth/2,z,10.8,style.depth,.3);end.rotation.y=heading(task.at-z);}
    // A hazard edge at the drop, and BRIDGE OUT signs at both road sides
    // (never across the road, so the open gap stays visible behind them).
    const hazard=canvasTexture((c,w,h)=>{for(let x=-h;x<w;x+=48){c.fillStyle='#f2c230';c.fillRect(x,0,24,h);c.fillStyle='#1d1d1d';c.fillRect(x+24,0,24,h);}},512,32);hazard.wrapS=THREE.RepeatWrapping;g.userData.textures.push(hazard);
    const edgeMat=new THREE.MeshBasicMaterial({map:hazard,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});g.userData.ownMaterials.push(edgeMat);const edge=new THREE.Mesh(new THREE.PlaneGeometry(10.8,.7),edgeMat);edge.rotation.x=-Math.PI/2;edge.position.set(0,.05,.35);g.add(edge);g.userData.barriers.push(edge);
    const tex=stripeTexture('BRIDGE OUT');g.userData.textures.push(tex);const boardMat=new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide});g.userData.ownMaterials.push(boardMat);
    for(const side of [-1,1]){const board=new THREE.Mesh(new THREE.PlaneGeometry(4.4,1.1),boardMat);board.position.set(side*7.4,2.5,4);board.rotation.y=-side*.45;g.add(board);g.userData.barriers.push(board);g.userData.barriers.push(mesh(g,'cylinder',0xd9dde0,side*7.4,1.2,4.1,.1,2.4,.1));}
    const wordMats=task.blocks.map(word=>{const t=wordTexture(word);g.userData.textures.push(t);const m=new THREE.MeshBasicMaterial({map:t,transparent:true,color:0xb7c7d4,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});g.userData.ownMaterials.push(m);return m;});
    const makeSlab=(j,word)=>{const slab=new THREE.Group(),start=task.at+j*BRIDGE_SLOT,half=BRIDGE_SLOT/2;slab.position.set(curveAt(start),.12,-j*BRIDGE_SLOT);slab.userData.mid=new THREE.Vector3(curveAt(start+half)-curveAt(start),0,-half);
      // Each slab fills its whole 16 m slot and the full road width. Coastal
      // slots are bascule spans: two leaves hinged at the slot ends.
      const near=new THREE.Group(),far=new THREE.Group();far.position.z=-BRIDGE_SLOT;slab.add(near,far);slab.userData.leaves=arena===1?[near,far]:null;
      const part=(leaf,color,y,z,sy,sz,segments)=>follow(mesh(leaf,'box',color,0,y,z,10.8,sy,sz),strip(segments),start,leaf===far?-BRIDGE_SLOT:0);
      if(arena===1){part(near,style.slab,-.35,-half/2,.5,half,4);part(far,style.slab,-.35,half/2,.5,half,4);for(const leaf of [near,far])part(leaf,0x26aebc,-.05,leaf===near?-half+.09:half-.09,.12,.18,1);}
      else part(near,style.slab,-.35,-half,.5,BRIDGE_SLOT,8);
      const face=new THREE.Mesh(new THREE.PlaneGeometry(9.4,2.94),word);face.rotation.x=-Math.PI/2;face.position.set(0,-.07,arena===1?-4.2:-half);near.add(face);follow(face,new THREE.PlaneGeometry(1,1,1,2).scale(9.4,2.94,1),start);slab.userData.face=face;
      if(j===task.blocks.length-1){const kick=mesh(far,'box',0xf1c35a,0,-.05,1.2,10.8,.3,2.6);kick.rotation.x=.16;follow(kick,strip(2),start,-BRIDGE_SLOT);}
      g.add(slab);return slab;};
    const slabs=task.blocks.map((_,j)=>makeSlab(j,wordMats[j]));
    // The bouncing slab of a wrong block (its word is set when it appears).
    const ghost=makeSlab(0,new THREE.MeshBasicMaterial({transparent:true,color:0xffc2b8,depthWrite:false}));g.userData.ownMaterials.push(ghost.userData.face.material);ghost.visible=false;
    const bridge={slabs,ghost,wordMats,placed:0,placedAt:[],lit:[],lastWrong:0,style,planks:[]},bridge0=bridge;
    if(arena===0){
      // A road crew: a crane on the right, three cheering workers on the left.
      const side=1,edge=this.edge(task.at+24,side)+5,crane=new THREE.Group();crane.position.set(curveAt(task.at+24)+side*edge,0,-24);
      mesh(crane,'box',0xf0b532,0,8,0,.8,16,.8);const jib=new THREE.Group();jib.position.y=16;crane.add(jib);mesh(jib,'box',0xf0b532,-side*8,0,0,18,.6,.6);mesh(jib,'box',0x3c4b57,side*3,-.5,0,3,1.4,1.4);
      const cable=mesh(crane,'box',0x2d3742,0,0,0,.06,1,.06);cable.visible=false;g.add(crane);bridge.crane={crane,jib,cable,side,yaw:0};
      bridge.workers=[0,1,2].map(i=>{const w=new THREE.Group();w.position.set(curveAt(task.at+6+i*14)-(this.edge(task.at+6+i*14,-1)+2.4),0,-6-i*14);mesh(w,'box',0xff7a1a,0,1.2,0,.6,.9,.4);mesh(w,'box',0x2f3e52,0,.45,0,.5,.8,.35);mesh(w,'sphere',0xd6a37f,0,1.9,0,.24,.26,.24);mesh(w,'sphere',0xffd23a,0,2.08,0,.27,.14,.27);w.rotation.y=Math.PI/2;g.add(w);return w;});
    }else if(arena===1){
      // Drawbridge leaves wait raised (blank); spray rises from the sea below.
      slabs.forEach(slab=>{this.placeSlab(bridge0,slab,0,false);slab.userData.face.visible=false;});
      bridge.spray=[0,1,2,3].map(i=>{const m=mesh(g,'sphere',0xffffff,-3+i*2,-2.8,-8-i*11,.9,.5,.9,.2);m.material=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.45,depthWrite:false});g.userData.ownMaterials.push(m.material);return m;});
    }else{
      const dust=mesh(g,'sphere',0xd9d4cb,0,.6,-8,1,1,1);dust.material=new THREE.MeshBasicMaterial({color:0xd9d4cb,transparent:true,opacity:0,depthWrite:false});g.userData.ownMaterials.push(dust.material);dust.visible=false;bridge.dust={mesh:dust,at:-Infinity};
    }
    if(arena!==1)slabs.forEach(slab=>{slab.visible=false;});
    for(let i=0;i<4;i++){const plank=mesh(g,'box',0x7d8b95,0,-.05,0,2.8,.22,BRIDGE_SLOT-.4);plank.visible=false;bridge.planks.push(plank);}
    g.userData.bridge=bridge;g.userData.repairSlabs=slabs;
  }
  // Slab j's resting pose, and its pose t (0..1) of the way through placing.
  placeSlab(bridge,slab,t,reduced){
    const e=1-(1-t)**3;
    if(this.index===1){const raised=1.2*(1-(reduced?t:e));slab.position.y=.12;slab.rotation.x=0;if(slab.userData.leaves){slab.userData.leaves[0].rotation.x=raised;slab.userData.leaves[1].rotation.x=-raised;}}
    else if(this.index===2){slab.rotation.x=0;slab.position.y=.12+(reduced?4*(1-t):16*(1-t*t));}
    else{slab.rotation.x=0;slab.position.y=.12+(reduced?4:13)*(1-e);}
  }
  updateBridge(g,t,state,dt){
    const bridge=g.userData.bridge;if(!bridge)return;const reduced=!!this.preferences.reduced,chosen=t.chosen?.length||0;
    // Newly placed slabs animate in; slabs solved all at once appear in place.
    if(chosen>bridge.placed){const bulk=chosen-bridge.placed>1;for(let j=bridge.placed;j<chosen;j++)bridge.placedAt[j]=bulk?-Infinity:this.clock;bridge.placed=chosen;}
    const duration=this.index===2?.32:.42;
    bridge.slabs.forEach((slab,j)=>{
      if(j>=chosen){if(this.index===1){slab.visible=true;this.placeSlab(bridge,slab,0,reduced);slab.userData.face.visible=false;}else slab.visible=false;return;}
      const p=THREE.MathUtils.clamp((this.clock-bridge.placedAt[j])/duration,0,1);slab.visible=true;slab.userData.face.visible=true;this.placeSlab(bridge,slab,p,reduced);
      if(p>=1&&!bridge.seated?.[j]){(bridge.seated||=[])[j]=true;if(this.index===2&&bridge.placedAt[j]>-Infinity){this.onCue?.('slam');if(bridge.dust){bridge.dust.at=this.clock;bridge.dust.mesh.position.copy(slab.position).add(slab.userData.mid).y+=.4;}if(!reduced)this.shake=.35;}}
    });
    // The crane follows the slab it is lowering.
    if(bridge.crane){const c=bridge.crane,j=Math.max(0,Math.min(2,chosen-1)),slab=bridge.slabs[j],mid=slab.position.clone().add(slab.userData.mid),target=Math.atan2(c.side*(mid.z-c.crane.position.z),-c.side*(mid.x-c.crane.position.x));c.yaw=THREE.MathUtils.damp(c.yaw,chosen?target:0,6,dt);c.jib.rotation.y=c.yaw;
      const lowering=chosen&&this.clock-bridge.placedAt[j]<duration+.15&&slab.position.y>.2;c.cable.visible=!!lowering;if(lowering){const tip=new THREE.Vector3(-c.side*17,16,0).applyAxisAngle(new THREE.Vector3(0,1,0),c.yaw).add(c.crane.position),top=slab.position.y+.3,length=Math.max(.1,tip.y-top);c.cable.position.set(tip.x-c.crane.position.x,top+length/2,tip.z-c.crane.position.z);c.cable.scale.y=length;}}
    // A wrong block: its slab drops short, wobbles and swings back out.
    const wrong=t.lastWrong;if(wrong&&wrong.count!==bridge.lastWrong){bridge.lastWrong=wrong.count;bridge.wrongAt=this.clock;const ghost=bridge.ghost,m=ghost.userData.face.material;m.map=bridge.wordMats[wrong.block].map;m.needsUpdate=true;bridge.wrongSlot=Math.min(2,wrong.slot);}
    const ghost=bridge.ghost,age=this.clock-(bridge.wrongAt??-Infinity);ghost.visible=age<.7&&!t.solved;
    if(ghost.visible){const home=bridge.slabs[bridge.wrongSlot],p=age/.7;ghost.position.copy(home.position);ghost.rotation.copy(home.rotation);ghost.rotation.x=0;(ghost.userData.leaves||[]).forEach(l=>{l.rotation.x=0;});
      if(reduced){ghost.position.y=.12+1.5;ghost.userData.face.material.opacity=1-p;}
      else{const drop=Math.min(1,p/.3),out=Math.max(0,(p-.55)/.45);ghost.position.y=.12+4*(1-drop)+1.2*drop+5*out*out;ghost.position.x+=10*out*out*(bridge.wrongSlot%2?-1:1);ghost.rotation.z=Math.sin(p*38)*.14*Math.min(1,p*3)*(1-out);ghost.userData.face.material.opacity=1-out;}}
    // Words light up as the wheels cross them, each with its note again.
    if(t.solved)bridge.slabs.forEach((slab,j)=>{if(!bridge.lit[j]&&state.distance>=t.at+j*BRIDGE_SLOT+6&&state.distance<t.at+j*BRIDGE_SLOT+BRIDGE_SLOT+8){bridge.lit[j]=true;slab.userData.face.material.color.setHex(0xffd96b);this.onCue?.('word'+(j+1));}});
    // Workers cheer once the bridge locks.
    if(t.solved&&bridge.lockedAt==null)bridge.lockedAt=this.clock;
    (bridge.workers||[]).forEach((w,i)=>{const cheer=bridge.lockedAt!=null&&this.clock-bridge.lockedAt<2.2&&!reduced;w.position.y=cheer?Math.abs(Math.sin((this.clock-bridge.lockedAt)*9+i))*.55:0;});
    (bridge.spray||[]).forEach((m,i)=>{const k=reduced?.5:.5+.5*Math.sin(this.clock*2.4+i*1.7);m.scale.set(.8+k,.4+k*.5,.8+k);m.material.opacity=.25+.25*k;});
    if(bridge.dust){const a=this.clock-bridge.dust.at,d=bridge.dust.mesh;d.visible=a<.8&&!reduced;if(d.visible){d.scale.setScalar(1+a*8);d.material.opacity=.55*(1-a/.8);}}
    // A rival or traffic car reaching the gap first rides a temporary plank
    // under its own wheels, so it never floats over the open gap.
    let used=0;const actors=[...state.rivals,...state.obstacles.filter(o=>o.type==='traffic'&&!o.dormant)];
    for(const o of actors){if(used>=bridge.planks.length)break;const slot=Math.floor((o.at-t.at)/BRIDGE_SLOT);if(o.at<t.at-2.3||o.at>t.at+BRIDGE_LENGTH+2.3||Math.abs(o.lanePos??o.lane)>1.3)continue;
      for(const k of [slot,Math.floor((o.at+2.3-t.at)/BRIDGE_SLOT)]){if(k<0||k>2||k<chosen||used>=bridge.planks.length)continue;const plank=bridge.planks[used++],slab=bridge.slabs[k];plank.visible=true;plank.position.set(window.RallyCore.actorX(state,o)-this.curve(t.at),.01,slab.position.z-8);plank.rotation.y=-Math.atan((this.curve(o.at+1)-this.curve(o.at-1))/2);}}
    for(let i=used;i<bridge.planks.length;i++)bridge.planks[i].visible=false;
  }
  // The kick ramp's hop for a car at course position at (feel only).
  bridgeHop(state,at){if(!state||this.preferences.reduced)return 0;const t=state.tasks.find(q=>q.kind==='repair'&&q.solved&&at>q.at+BRIDGE_LENGTH-2&&at<q.at+BRIDGE_LENGTH+12);if(!t)return 0;const p=(at-(t.at+BRIDGE_LENGTH-2))/14;return Math.sin(Math.PI*p)*1.1;}
  makeGate(task,state){
    const g=new THREE.Group();g.userData={task,textures:[],ownMaterials:[],barriers:[],repairSlabs:[]};
    if(task.kind==='finish'){
      for(const x of [-5.7,5.7])mesh(g,'box',0xfbd57b,x,3,0,.45,6,.45);mesh(g,'box',0xffd877,0,6,0,12,.8,.45);
      const tex=signTexture('FINISH','#ffe296');g.userData.textures.push(tex);const mat=new THREE.MeshBasicMaterial({map:tex});g.userData.ownMaterials.push(mat);const m=new THREE.Mesh(new THREE.PlaneGeometry(5,2.5),mat);m.position.set(0,6,.3);g.add(m);for(let x=-5;x<5;x++)for(let z=0;z<3;z++)mesh(g,'box',(x+z)%2?0xe4edf3:0x24374d,x+.5,.055,z,1,.025,1);
    }else if(task.kind==='pedestrian'){
      for(let z=-11;z<12;z+=2)mesh(g,'box',0xf2eed8,0,.075,z,16.8,.025,.8);
      for(const side of [-1,1]){mesh(g,'box',0xb5c9b6,side*9.4,.12,0,2,.22,19);mesh(g,'cylinder',0x82939e,side*5.9,2.4,-8,.12,4.8,.12);const signal=mesh(g,'box',0xe67d69,side*5.9,4.6,-8,1.1,.6,.12);signal.userData.crossingSignal=true;}
      mesh(g,'box',0xf2eed8,0,.075,12,10.5,.025,.35);
      const guide=new THREE.Group();for(let z=-32;z<=12;z+=8)mesh(guide,'box',0x88e5c5,0,.085,z,.16,.025,3,.4,0,0x39b98c);guide.visible=false;g.add(guide);g.userData.exitGuide=guide;
      g.userData.people=task.people.map((p,i)=>{const m=this.makePerson(p.word,i,g);g.add(m);return m;});
    }else if(task.kind==='light'){
      for(let side of[-1,1]){mesh(g,'cylinder',0x43586a,side*12.1,3.2,0,.15,6.4,.15);mesh(g,'box',0x405768,side*6.1,6.4,0,12.2,.2,.25);mesh(g,'box',0x152638,side*3.25,5.6,0,.8,1.8,.7);for(let j=0;j<3;j++){let bulb=mesh(g,'sphere',j===0?0xff6663:j===1?0x5e5144:0x334b46,side*3.25,6.2-j*.57,.38,.22,.22,.08,.25,0,j===0?0xff4039:0);bulb.userData.bulb=j;}}
      for(let z of[-1,-.4,.2])mesh(g,'box',0xf3eed8,0,.04,z,10.3,.015,.22);
    }else if(task.kind==='repair'){
      this.buildBridge(g,task);
      for(let side of[-1,1]){g.userData.barriers.push(mesh(g,'box',0xec9252,side*3,1.3,2,4,.25,.12));for(let j=0;j<3;j++)g.userData.barriers.push(mesh(g,'cone',0xf19657,side*(3.2+j*.75),.5,3,.27,1,.27));}
    }else{
      const C=window.RallyCore,routes=C.groundRoutes(state,task);
      const surface=forkSurface(routes,at=>this.curve(at),C.routeOffset,task.at),geometry=new THREE.BufferGeometry();
      geometry.setAttribute('position',new THREE.Float32BufferAttribute(surface.positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(surface.uvs,2));geometry.setIndex(surface.indices);geometry.computeVertexNormals();
      const asphalt=new THREE.Mesh(geometry,this.asphaltMaterial);asphalt.position.y=.02;asphalt.receiveShadow=true;g.add(asphalt);g.userData.forkSurface=asphalt;g.userData.forkRows=surface.rows;
      // Islands between branches: planted in the city, a concrete deck over
      // the sea, gravel in the mountains. Never water showing through a fork.
      const hull=[];for(let i=0;i<surface.rows.length-1;i++){const a=surface.rows[i],b=surface.rows[i+1],l=r=>Math.min(...r.intervals.map(v=>v[0])),rr=r=>Math.max(...r.intervals.map(v=>v[1]));hull.push(l(a),0,-a.at,rr(a),0,-a.at,l(b),0,-b.at,l(b),0,-b.at,rr(a),0,-a.at,rr(b),0,-b.at);}
      const islandGeometry=new THREE.BufferGeometry();islandGeometry.setAttribute('position',new THREE.Float32BufferAttribute(hull,3));islandGeometry.computeVertexNormals();
      const island=new THREE.Mesh(islandGeometry,mat([0x86b07c,0xc4ccc9,0x5d6b63][this.index]||0x86b07c,.95));island.position.y=-.03;island.receiveShadow=true;g.add(island);
      // Only the outside of the union receives an edge line. No seams inside a merge.
      const edgePoints=[];for(const [a,b]of surface.edges)edgePoints.push(a[0],.043,-a[1],b[0],.043,-b[1]);
      const edgeGeometry=new THREE.BufferGeometry();edgeGeometry.setAttribute('position',new THREE.Float32BufferAttribute(edgePoints,3));const edge=new THREE.LineSegments(edgeGeometry,new THREE.LineBasicMaterial({color:0xd4e4da}));g.add(edge);g.userData.edgeLine=edge;g.userData.ownMaterials.push(edge.material);
      for(const [from,to]of [[surface.bounds.start,task.at],[routes[0].end,surface.bounds.end]])for(let at=from+4;at<to-2;at+=8)for(const lane of [-.5,.5]){const mark=mesh(g,'box',0xd6e0da,this.curve(at)-this.curve(task.at)+lane*3.35,.043,task.at-at,.10,.015,2.2);mark.rotation.y=this.heading(at);}
      const merge=routes[0],guide=new THREE.Group();for(let at=merge.end+4;at<=merge.exitEndAt;at+=7)mesh(guide,'box',0x98d8bb,this.curve(at)-this.curve(task.at),.075,task.at-at,.18,.025,2.5,.4,0,0x318b67);guide.visible=false;g.add(guide);g.userData.mergeGuide=guide;g.userData.routePaths=[];
      for(let index=0;index<3;index++){
        const route=routes[index],points=[];for(let j=0;j<=48;j++){const at=route.start+(route.end-route.start)*j/48;points.push({at:at-task.at,x:this.curve(at)-this.curve(task.at)+route.lane*3.35+C.routeOffset(route,at)});}
        const left=this.ribbon(g,points.map(p=>({...p,x:p.x-1.48})),.10,0xb4b5d4,.045),right=this.ribbon(g,points.map(p=>({...p,x:p.x+1.48})),.10,0xb4b5d4,.045);
        const chevrons=new THREE.Group();for(let at=route.start+8;at<route.end-5;at+=12){const x=this.curve(at)-this.curve(task.at)+route.lane*3.35+C.routeOffset(route,at),heading=this.heading(at,route);for(const side of [-1,1]){const mark=mesh(chevrons,'box',0xb4b5d4,x+side*.28,.055,task.at-at,.09,.015,.8,.6);mark.rotation.y=heading+side*.7;}}g.add(chevrons);
        g.userData.routePaths.push({left,right,index,route,points,chevrons});
      }
      if(task.coaster)this.buildCoaster(g,task,state);
    }
    this.scene.add(g);this.gates.set(task.id,g);return g;
  }
  updateGates(state,d,base,dt){
    if(!state)return;
    const tasks=state.tasks.concat({id:'finish',kind:'finish',at:state.arena.length});
    if(this.preparedState!==state){this.clearGate();this.preparedState=state;for(const t of tasks)this.makeGate(t,state).visible=false;this.preparedRevision=state.taskRevision;}
    if(this.preparedRevision!==state.taskRevision){
      // Adaptive clues are prepared beyond the fog. Visible gates keep their
      // identity and wording throughout the complete driving approach.
      const live=new Set(tasks.map(t=>t.id));for(const [id,g]of this.gates)if(!live.has(id)){this.disposeGate(g);this.gates.delete(id);}
      for(const t of tasks)if(!this.gates.has(t.id)&&t.at-d>window.RallyCore.TASK_VIEW_DISTANCE)this.makeGate(t,state).visible=false;
      this.preparedRevision=state.taskRevision;
    }
    for(const t of tasks){const ahead=t.at-d,keep=t.kind==='finish'?80:window.RallyCore.taskZone(t).reach-t.at+120;const g=this.gates.get(t.id);if(!g)continue;g.visible=ahead<=window.RallyCore.TASK_VIEW_DISTANCE&&ahead>=-keep;if(!g.visible)continue;g.position.set(this.curve(t.at)-base,0,-ahead+4);
      if(t.kind==='junction'&&t.completed&&g.userData.chosenIndex!==t.chosenIndex){g.userData.chosenIndex=t.chosenIndex;for(const path of g.userData.routePaths||[]){const chosen=path.index===t.chosenIndex,paint=mat(chosen?(t.success?0xa9eccb:0xf1c187):0x748895,.55,0,chosen?(t.success?0x28674b:0x6b4c29):0);path.left.material=path.right.material=paint;path.chevrons.traverse(m=>{if(m.isMesh)m.material=paint;});}}
      if(t.kind==='junction')this.updateCoaster(g,t,state);
      if(t.kind==='junction')g.userData.mergeGuide.visible=!!state.mergeAssist&&state.mergeAssist.taskId===t.id&&window.RallyCore.exitAssist(state)===state.mergeAssist;
      if(t.kind==='light'&&t.success)g.traverse(m=>{if(m.userData.bulb===0)m.material=mat(0x5b3439);if(m.userData.bulb===2)m.material=mat(0x69f3b7,.3,0,0x3ceb91);});
      if(t.kind==='repair'){this.updateBridge(g,t,state,dt);g.userData.barriers.forEach(m=>m.visible=!t.solved);}
      if(t.kind==='pedestrian'){g.userData.exitGuide.visible=!!window.RallyCore.exitAssist(state)&&state.exitTask===t.id&&!window.RallyCore.crosswalkOccupied(state,t);g.traverse(n=>{if(n.userData.crossingSignal)n.material=window.RallyCore.crosswalkOccupied(state,t)?mat(0xe67d69,.3,0,0xff6444):mat(0x87d6bd,.3,0,0x4ae6a4);});}
      if(t.kind==='pedestrian')g.userData.people.forEach((m,i)=>{
        const p=t.people[i],walk=p.sent?Math.min(1,(state.elapsed-p.sentAt)/window.RallyCore.PEDESTRIAN_WALK_TIME):0,side=p.side===0?-1:1;
        const entryAt=p.sent?p.sentAt:state.elapsed,enter=t.peopleEntryAt==null?0:Math.min(1,Math.max(0,(entryAt-t.peopleEntryAt)/window.RallyCore.PEDESTRIAN_ENTRY_TIME)),entry=enter*enter*(3-2*enter),startX=p.originSide*8.4*(1-entry);
        const progress=p.correct===false?Math.max(0,(walk-.35)/.65):walk,a=progress*progress*(3-2*progress);
        const reconsider=p.correct===false&&walk<.35?(p.selectedSide===0?-1:1)*2.4*Math.sin(walk/.35*Math.PI):0;
        m.position.set(startX*(1-a)+side*8.4*a+reconsider,.03,t.at-p.at+walk*1.5);m.rotation.y=side*a*1.05;
        m.traverse(n=>{if(n.userData.leg)n.rotation.x=p.sent||enter>0&&enter<1?Math.sin(this.elapsed*9)*.3*n.userData.leg:Math.sin(this.elapsed*2+i)*.025;});
      });
    }
    for(const [id,g]of this.gates){if(g.userData.task.at-d<-(g.userData.task.kind==='finish'?80:window.RallyCore.taskZone(g.userData.task).reach-g.userData.task.at+120)){this.disposeGate(g);this.gates.delete(id);}}
    const active=state.task||state.tasks[state.taskIndex];if(active){this.gate=this.gates.get(active.id)||this.gate;this.lastGate=active.id;this.repairSlabs=this.gate.userData.repairSlabs||[];}else if(state.distance>state.arena.length-170){this.gate=this.gates.get('finish')||this.gate;this.lastGate='finish';}
  }
  pedestrianProjection(state){
    const g=this.gates.get(state.task?.id);if(!g?.userData.people)return [];
    g.updateWorldMatrix(true,true);this.camera.updateMatrixWorld();return g.userData.people.map(m=>{const v=m.userData.signPoint.clone();m.localToWorld(v);v.project(this.camera);return{x:(v.x*.5+.5)*this.viewport.width,y:(-.5*v.y+.5)*this.viewport.height,visible:v.z>-1&&v.z<1};});
  }
  updateRoadBoards(state,base){
    const t=state?.task,active=['task','resolving'].includes(state?.status);
    this.roadBoards.visible=active;
    if(!active){this.signAnchors=[];return;}
    if(this.roadBoards.children.length===0){
      for(let i=0;i<3;i++){let g=new THREE.Group();mesh(g,'cylinder',0x688496,0,1.3,0,.065,2.6,.065);mesh(g,'box',0xfcd478,0,.05,0,2.5,.025,1.2);this.roadBoards.add(g);}
    }
    const row=window.RallyCore.currentRow(state)||state.task?.rows[0],curve=this.curve(state.distance+13)-base;
    const signZ=-9+(t.completed?Math.max(0,state.distance-t.completedDistance):0);this.roadBoards.position.set(curve,0,signZ);
    this.signAnchors=[];
    for(let i=0;i<3;i++){const g=this.roadBoards.children[i];g.visible=t.kind!=='repair'&&!(t.kind==='pedestrian'&&i===1);g.position.set((i-1)*3.35,0,0);this.signAnchors.push(new THREE.Vector3(g.position.x+curve,3.4,signZ));}
    this.promptAnchor.set(curve,6.2,-30);
  }
  roadProjection(){
    this.camera.updateMatrixWorld();
    const project=v=>{let p=v.clone().project(this.camera);return {x:(p.x*.5+.5)*this.viewport.width,y:(-.5*p.y+.5)*this.viewport.height,visible:p.z>-1&&p.z<1};};
    return {prompt:project(this.promptAnchor),answers:this.signAnchors.map(project)};
  }
  carScreenBounds(){
    this.player.updateWorldMatrix(true,true);this.camera.updateMatrixWorld();
    const b=this.player.userData.hitBounds.clone().applyMatrix4(this.player.matrixWorld),points=[];
    for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z]){
      const p=new THREE.Vector3(x,y,z).project(this.camera);if(p.z>-1&&p.z<1)points.push({x:(p.x*.5+.5)*this.viewport.width,y:(-.5*p.y+.5)*this.viewport.height});
    }
    if(!points.length)return null;
    const left=Math.min(...points.map(p=>p.x))-10,right=Math.max(...points.map(p=>p.x))+10,top=Math.min(...points.map(p=>p.y))-10,bottom=Math.max(...points.map(p=>p.y))+10;
    return {left,right,top,bottom};
  }
  isCarHit(x,y){const b=this.carScreenBounds();return !!b&&x>=b.left&&x<=b.right&&y>=b.top&&y<=b.bottom;}
  makeObstacle(o){
    if(o.type==='traffic')return this.makeCar(TRAFFIC_COLOURS[(o.color+o.id)%TRAFFIC_COLOURS.length],false,TRAFFIC_KINDS[(o.color*3+o.id)%TRAFFIC_KINDS.length]);
    const g=new THREE.Group();
    if(o.type==='cones'){
      for(const [x,z]of [[-.7,.45],[.7,.45],[0,-.65]]){mesh(g,'box',0x333c45,x,.07,z,.7,.14,.7);mesh(g,'cone',0xf19c5a,x,.62,z,.34,1.1,.34);mesh(g,'cone',0xf3e4bd,x,.76,z,.22,.30,.22);}
    }else if(o.type==='crates'){
      for(const [x,y,z]of [[-.5,.45,.2],[.5,.45,-.3],[.1,1.25,0]]){mesh(g,'coach',0xab7e59,x,y,z,.95,.85,.95);for(const side of [-1,1])mesh(g,'box',0xe1bd84,x+side*.35,y,z+.49,.075,.75,.03);}
    }else if(o.type==='pothole'){
      mesh(g,'cylinder',0x726b62,0,.027,0,1.35,.035,1.7);mesh(g,'cylinder',0x182b3b,0,.05,0,1.1,.025,1.45);mesh(g,'cylinder',0x304657,0,.065,-.05,.75,.025,1.1,.18,.25);for(const x of [-1.15,1.15])mesh(g,'box',0xe8bc6f,x,.08,.9,.22,.1,.25);
    }else if(o.type==='barrels'){
      for(const [x,z]of [[-.6,.3],[.6,-.3]]){mesh(g,'cylinder',0xb8734f,x,.62,z,.46,1.2,.46);for(const y of [.28,.87])mesh(g,'cylinder',0xe4ceb0,x,y,z,.475,.12,.475);}
    }else if(o.type==='fallen_branch'){
      const log=mesh(g,'cylinder',0x80664f,0,.4,0,.30,2.65,.30);log.rotation.z=Math.PI/2;const branch=mesh(g,'cylinder',0x9a7959,.4,.58,-.35,.15,1.65,.15);branch.rotation.z=.9;branch.rotation.x=.5;mesh(g,'sphere',0x527d66,-.65,.72,-.5,.65,.43,.6);mesh(g,'sphere',0x6b9777,.65,.9,-.5,.8,.5,.7);
    }else if(o.type==='tire_stack'){
      for(const [x,z,height]of [[-.5,.2,2],[.55,-.3,3]])for(let n=0;n<height;n++){
        mesh(g,'cylinder',0x233345,x,.2+n*.34,z,.48,.3,.48,.95);mesh(g,'cylinder',0x485968,x,.36+n*.34,z,.23,.025,.23,.6,.3);
      }
      mesh(g,'box',0xf7d18a,0,.5,.73,.36,.13,.04);
    }else if(o.type==='road_panels'){
      mesh(g,'box',0x987458,0,.12,0,2.1,.22,1.9);
      for(let n=0;n<3;n++){const panel=mesh(g,'box',n===2?0x86a6ae:0x607e8d,0,.29+n*.16,n*.07,2.12,.13,1.7,.45,.35);panel.rotation.y=n*.045;}
      for(const x of [-.72,.72]){const strip=mesh(g,'box',0xffd98a,x,.73,.12,.18,.03,1.65);strip.rotation.y=.09;}
    }else if(o.type==='rockfall'){
      for(const [x,y,z,size]of [[-.55,.48,.15,.65],[.52,.6,-.3,.72],[.05,.28,.85,.4]]){const rock=mesh(g,'rock',0xa1a8ad,x,y,z,size,size*.85,size);rock.rotation.set(.25+x,.4+y,.3);}
      for(const x of [-.95,.95]){mesh(g,'box',0xeead72,x,.18,.9,.19,.36,.18);mesh(g,'box',0xffe3a1,x,.28,1,.19,.1,.025);}
    }else{
      mesh(g,'box',0xffcf72,0,.85,0,2.6,.75,.4);for(const x of [-.9,0,.9]){const stripe=mesh(g,'box',0x24394b,x,.85,.22,.3,.76,.025);stripe.rotation.z=.25;}for(const x of [-.9,.9])mesh(g,'box',0x637e8e,x,.3,0,.2,.6,.6);
    }
    // Bake the hazard into one vertex-coloured mesh: one draw call each.
    g.updateMatrixWorld(true);const baked=new PartSet();g.traverse(m=>{if(m.isMesh){const part=m.geometry.clone().applyMatrix4(m.matrixWorld);baked.add('o',part,m.material.color.getHex());part.dispose();}});
    const body=new THREE.Mesh(baked.merge('o'),obstacleMaterial);body.castShadow=true;body.receiveShadow=true;body.userData.ownGeometry=true;const out=new THREE.Group();out.add(body);return out;
  }
  syncTraffic(state){if(this.trafficState===state)return;this.traffic.forEach(m=>{if(m.userData.contactShadow)this.scene.remove(m.userData.contactShadow);this.scene.remove(m);m.traverse(n=>{if(n.isMesh&&n.userData.ownGeometry)n.geometry.dispose();});});this.traffic=[];this.trafficState=state;if(!state)return;for(const o of state.obstacles){const m=this.makeObstacle(o);m.userData.obstacle=o;this.scene.add(m);if(o.type==='traffic')this.addContactShadow(m);this.traffic.push(m);}}

  updateAtmosphere(dt,worldDt,d,base,frozen){
    const reduced=this.preferences.reduced,battery=this.preferences.graphics==='battery';
    for(const item of this.landmarks||[]){
      const ahead=item.at-d,visible=ahead>-90&&ahead<620;item.group.visible=visible;if(!visible)continue;
      const x=item.overRoad?0:item.side*(this.sceneryEdge(item.at,item.side)+item.offset);item.group.position.set(this.curve(item.at)-base+x,0,-ahead+4);item.group.rotation.y=item.overRoad?-Math.atan((this.curve(item.at+1)-this.curve(item.at-1))/2):item.side*.35;
      if(!frozen&&!reduced)for(const [i,rotor]of item.rotors.entries())rotor.rotation.z+=worldDt*(.9+i*.15);
    }
    if(!frozen)for(const cloud of this.clouds||[]){cloud.position.x+=worldDt*cloud.userData.drift;if(cloud.position.x>340)cloud.position.x=-340;}
    if(this.rain){
      const count=reduced?0:battery?110:320;this.rain.visible=count>0;this.rain.count=count;
      if(count&&!frozen){const m=this.rainMatrix||=new THREE.Object3D(),fall=worldDt*24,drift=worldDt*(8+(this.motion?.lastSpeed||0)*.6);
        for(let i=0;i<count;i++){const p=this.rain.userData.drops[i];p[1]-=fall*p[3];p[2]+=drift;if(p[1]<-.5||p[2]>6){p[1]=16+Math.random()*4;p[2]=-60+Math.random()*20;p[0]=(Math.random()-.5)*44;}m.position.set(p[0],p[1],p[2]);m.rotation.x=-.18;m.updateMatrix();this.rain.setMatrixAt(i,m.matrix);}
        this.rain.instanceMatrix.needsUpdate=true;}
    }
  }
  update(dt,state,mode='home'){
    const worldDt=dt*(state?.worldTimeScale??1);this.clock=(this.clock||0)+dt;
    if(!state||!['paused','finished','failed','countdown'].includes(state.status))this.elapsed+=worldDt;this.syncTraffic(state);this.syncRivals(state);
    this.prepareCourse(state);
    const playing=!!state,d=playing?state.distance:(this.showcaseDistance+=dt*6),base=this.curve(d)+window.RallyCore.routeOffset(state?.route,d);
    // Keep each chunk at its course coordinate until it is safely behind the camera.
    const first=Math.floor(d/20)-3,count=this.segments.length;
    for(let i=0;i<count;i++){let n=first+((i-first)%count+count)%count,at=n*20+10,ahead=at-d,g=this.segments[i];g.userData.courseIndex=n;g.position.set(this.curve(at)-base,0,-ahead+4);g.rotation.y=-Math.atan((this.curve(at+10)-this.curve(at-10))/20);// Bend the road and curbs at shared course coordinates, including chunk seams.
      if(g.userData.curveIndex!==n){g.userData.curveIndex=n;this.rebuildChunk(g,n,at);}}
    const frozen=state&&['paused','finished','failed','countdown'].includes(state.status);
    this.updateAtmosphere(dt,worldDt,d,base,frozen);
    this.spectators.update(worldDt,state,this.index,d,base,at=>this.curve(at),this.preferences,frozen);
    for(const m of this.rivalCars){const r=m.userData.rival,ahead=r.at-d;m.visible=ahead>-60&&ahead<330;m.position.set(this.curve(r.at)+window.RallyCore.routeOffset(r.route,r.at)-base+r.lanePos*3.35+(r.passingOffset||0),0,-ahead+4);m.rotation.y=this.heading(r.at,r.route)-THREE.MathUtils.clamp((r.lane-r.lanePos)*.16,-.16,.16);m.position.y+=this.bridgeHop(state,r.at);if(r.route?.coaster){const task=state.tasks.find(t=>t.id===r.route.taskId),ground=task&&window.RallyCore.makeRoute(state,task,task.correctIndex,true,true);
      m.position.x+=ground?window.RallyCore.routeOffset(ground,r.at)-window.RallyCore.routeOffset(r.route,r.at):0;
      const ride=this.ridePose(r.route,r.at,r.passingOffset||0,d,base,{position:m.position.clone(),quaternion:m.quaternion.clone()});if(ride){m.position.copy(ride.position);m.quaternion.copy(ride.quaternion);}}if(!frozen){m.userData.wheelAngle=((m.userData.wheelAngle||0)+Math.max(0,r.at-(m.userData.previousAt??r.at))/.43)%(Math.PI*2);m.userData.previousAt=r.at;}this.animateCar(m,m.userData.wheelAngle||0,-(r.lane-r.lanePos)*.28,r.braking);m.userData.nitroExhaust.visible=!!r.nitroActive&&!frozen;this.placeContactShadow(m);const direction=Math.sign((r.plannedLane??r.lane)-r.lanePos);for(const lamp of m.userData.indicators||[])lamp.visible=direction!==0&&(r.plannedLane!=null||Math.abs(r.lane-r.lanePos)>.05)&&lamp.userData.indicator===direction&&Math.floor((state.elapsed||0)*3)%2===0;}
    for(let m of this.traffic){const o=m.userData.obstacle,ahead=o.at-d;m.visible=!o.dormant&&ahead>-50&&ahead<360;m.position.set(window.RallyCore.actorX(state,o)-base,0,-ahead+4);const turning=o.changed&&o.laneProgress<1,steer=turning?THREE.MathUtils.clamp(-(o.target-o.fromLane)*Math.sin(o.laneProgress*Math.PI)*.12,-.16,.16):0;m.rotation.y=this.heading(o.at,o.route)+steer;(m.userData.indicators||[]).forEach(n=>{n.visible=(o.moving||o.routeChanging)&&turning&&n.userData.indicator===Math.sign(o.target-o.fromLane)&&Math.floor((state?.elapsed||0)*3)%2===0;});m.rotation.z=o.hit&&state.elapsed-(o.hitAt??0)<.45?Math.sin(state.elapsed*18)*.08:0;if(!frozen){m.userData.wheelAngle=((m.userData.wheelAngle||0)+Math.max(0,o.at-(m.userData.previousAt??o.at))/.43)%(Math.PI*2);m.userData.previousAt=o.at;}this.animateCar(m,m.userData.wheelAngle||0,steer,o.braking||o.waiting);this.placeContactShadow(m);}
    this.updateGates(state,d,base,worldDt);
    if(this.motionState!==state){this.motionState=state;this.motion=createDrivingFeel(this.currentLane,state?.roadTravel??d);}
    const speed=state?state.arena.speed*state.speedFactor*(state.worldTimeScale??1):6;
    // Time dilation changes the animation clock, rather than applying brakes.
    if(state?.focusAuto)this.motion.lastSpeed=speed;
    const oldLane=this.motion.lane;updateDrivingFeel(this.motion,state?.lane||0,state?.roadTravel||d,speed,state?.focusAuto&&['light','junction'].includes(state.task?.kind)?dt:worldDt,frozen);if(state&&!frozen&&!window.RallyCore.playerLaneClear(state,oldLane,this.motion.lane)){const blocker=window.RallyCore.playerLaneBlocker(state,oldLane,this.motion.lane);this.motion.lane=oldLane;this.motion.velocity=0;this.motion.steer=0;window.RallyCore.contactBump(state,blocker);}this.currentLane=this.motion.lane;
    let x=this.currentLane*3.35;const playerZ=mode==='home'&&this.viewport.width<760&&this.viewport.height>this.viewport.width?-9:4,ride=this.ridePose(state?.route,d,0,d,base,null);
    // Touchdown: a short suspension settle as the coaster hands back to the road.
    if(this.lastRide&&!ride)this.landedAt=this.clock;this.lastRide=!!ride;const landing=this.landedAt!=null&&!this.preferences.reduced?this.clock-this.landedAt:Infinity,settle=landing<1.2?-.11*Math.exp(-landing*4.5)*Math.sin(landing*15):0;
    const hop=this.bridgeHop(state,d);if(hop>.05&&!this.hopping)this.onCue?.('hop');this.hopping=hop>.05;
    this.player.position.set(x,.04+settle+hop+(this.preferences.reduced?0:this.motion.bob),playerZ);this.player.rotation.set(this.preferences.reduced?0:this.motion.pitch,this.heading(d,state?.route)+this.motion.steer*.22,this.preferences.reduced?0:this.motion.roll);
    if(ride){this.player.position.copy(ride.position);this.player.quaternion.copy(ride.quaternion);}
    const rideY=ride?ride.position.y:hop;this.rideSpeed=ride?ride.speed:1;this.animateCar(this.player,this.motion.wheelAngle,this.motion.steer,this.motion.braking||!!state?.yielding&&speed<.5);this.player.visible=true;this.shadow.position.set(ride?ride.position.x:x,.07+rideY,ride?ride.position.z:playerZ);this.shadow.visible=!ride||ride.up[1]>.8;this.shadow.rotation.z=-this.player.rotation.y;this.nitroReadyGlow.position.set(ride?ride.position.x:x,.08+rideY,ride?ride.position.z:playerZ);this.nitroReadyGlow.rotation.z=-this.player.rotation.y;this.nitroReadyGlow.visible=!frozen&&!state?.nitroActive&&window.RallyCore.canEngageNitro(state);this.nitroReadyGlow.scale.setScalar(this.preferences.reduced?1:1+Math.sin(this.elapsed*3)*.025);
    this.damageFx.update(dt,state,this.preferences,frozen);
    this.boostFx.update(worldDt,state,this.preferences,frozen);if(this.waterNormal&&!frozen&&!this.preferences.reduced)this.waterNormal.offset.set(this.elapsed*.009,this.elapsed*.005);this.trail.children.forEach((p,i)=>{p.visible=!!state&&!frozen&&!this.preferences.reduced&&this.preferences.graphics!=='battery'&&(this.lookConfig.trail||state.nitroActive)&&speed>2;p.position.set(x+(i%2?1:-1)*.64,.08+rideY,playerZ+3+i*.45);p.material=mat(state?.nitroActive?0x89ddff:0x80cbb8,.5,0,state?.nitroActive?0x2698c9:0x367c67);p.scale.z=1-i/16;});
    const cameraFrozen=state&&['paused','finished','failed'].includes(state.status);
    const isPortrait=this.viewport.width<760&&this.viewport.height>this.viewport.width,home=mode==='home';let cx=home?(isPortrait?2:-5):state?.status==='task'?x*.7:x*.35,cy=home?(isPortrait?9:4.4):state?.status==='task'?7.2:6.2,cz=home?(isPortrait?16:20):state?.status==='task'?17:16;
    // A small speed pullback conveys acceleration without shaking the signs.
    if(!home&&!this.preferences.reduced&&state?.status!=='task')cz+=Math.min(2.4,Math.max(0,state.speedFactor-1)*.9);
    // Sky Coaster: the chase camera rides along, slightly wider and higher.
    // It follows the car through the loop and the helix without rolling,
    // so the horizon stays level while the car turns upside down.
    this.rideCam??=new THREE.Vector3(0,0,4);const rideFocus=ride?ride.position:new THREE.Vector3(x,0,playerZ);
    for(const axis of ['x','y','z'])this.rideCam[axis]=THREE.MathUtils.damp(this.rideCam[axis],rideFocus[axis],axis==='y'?7:5,dt);
    // Loops and the helix are framed in three-quarter view from outside the
    // ride, so the whole circle shows and the far arm never hides the car.
    this.rideWide=THREE.MathUtils.damp(this.rideWide||0,ride?.wide||0,3.5,dt);const wide=this.rideWide;this.rideSide=ride?ride.side:this.rideSide||1;if(ride?.kind)this.rideKind=ride.kind;const helix=this.rideKind==='helix',flight=this.rideKind==='air';
    this.rideLift=this.rideCam.y;cy+=this.rideLift+(helix?9:flight?1.5:4.5)*wide;cz+=(this.rideCam.z-playerZ)*.55*(1-wide)+(helix?8:flight?-2:4)*wide;cx+=(this.rideCam.x-x)*.6+this.rideSide*(helix?-4:flight?-15:13)*wide;if(ride&&!this.preferences.reduced){cz+=1.4+Math.min(2.2,Math.max(0,this.rideSpeed-1)*1.6);cy+=.6;}
    // Nitro: a restrained low dive behind the car, scaled by charge level.
    if(!home&&!this.preferences.reduced&&state?.status!=='task'){cy-=.45*this.boostFx.intensity;cz+=.9*this.boostFx.intensity;}
    // Narrow portrait screens see too little road beside the car. Pull the
    // chase camera back and up so both neighbouring lanes stay readable.
    if(!home&&state?.status!=='task'){const narrow=THREE.MathUtils.clamp((.95-this.viewport.width/this.viewport.height)/.5,0,1);cz+=6.5*narrow;cy+=2.4*narrow;}
    if(!cameraFrozen){this.camera.position.x=THREE.MathUtils.damp(this.camera.position.x,cx,4,dt);this.camera.position.y=THREE.MathUtils.damp(this.camera.position.y,cy,4,dt);this.camera.position.z=THREE.MathUtils.damp(this.camera.position.z,cz,4,dt);}
    // A stone slab landing shakes the camera briefly (never with reduced motion).
    if(this.shake>0){this.shake=Math.max(0,this.shake-dt*1.6);if(!this.preferences.reduced&&!cameraFrozen){this.camera.position.x+=(Math.random()-.5)*this.shake*.5;this.camera.position.y+=(Math.random()-.5)*this.shake*.4;}}
    const readingFov=Math.max(24,Math.min(52,2*Math.atan(this.viewport.height*3.35/(2*27*Math.min(140,(this.viewport.width-24)/3)))*180/Math.PI));if(!cameraFrozen)this.camera.fov=THREE.MathUtils.damp(this.camera.fov,state?.status==='task'?readingFov:playing?52+(this.preferences.reduced?0:Math.min(12,Math.max(0,state.speedFactor-1)*5.4)+(ride?THREE.MathUtils.clamp((this.rideSpeed-1)*10,0,13):0)):52,state?.nitroActive?9:4,dt);this.camera.updateProjectionMatrix();const raceTilt=Math.atan2(this.camera.position.y-this.rideLift-.8,Math.max(1,this.camera.position.z-4))-Math.atan(.58*Math.tan(this.camera.fov*Math.PI/360));const raceLookY=this.camera.position.y-Math.tan(raceTilt)*(this.camera.position.z+11);if(!cameraFrozen){const bendLook=this.preferences.reduced?0:THREE.MathUtils.clamp(-this.heading(d+10,state?.route)*6,-2.2,2.2);const rideLook=home?0:(this.rideCam.x-x)*.85;this.look.set(home?(isPortrait?-1.8:-6.5):state?.status==='task'?x*.65:x*.25+bendLook+rideLook,home?(isPortrait?-1:-.5):raceLookY+(ride&&!this.preferences.reduced?THREE.MathUtils.clamp(ride.forward[1]*7,-4,6):0),home?(isPortrait?-9:-6):-11+(this.rideCam.z-playerZ)*.8);if(!home&&wide>.001){const car=ride?ride.position:this.rideCam;this.look.lerp(new THREE.Vector3(car.x,car.y+1,car.z),wide);}this.camera.lookAt(this.look);}
    // A steady dusk light avoids full-screen storm flashes during reading.
    // Focus grade: the world cools and dims slightly while English text
    // (HTML above the canvas) stays crisp. Reduced motion keeps this calm cue.
    const look=this.arenaLook,focus=THREE.MathUtils.clamp(state?.focusAmount||0,0,1),boost=this.preferences.reduced?0:this.boostFx.intensity;
    this.sun.intensity=look.sunIntensity*(1-.2*focus);this.hemi.intensity=look.hemi*(1-.08*focus);
    this.renderer.toneMappingExposure=look.exposure*(1-.07*focus)+boost*.05;
    this.scene.fog.color.setHex(look.fog).lerp(this.focusTint,.24*focus);
    this.updateRoadBoards(state,base);this.renderer.render(this.scene,this.camera);
  }
}
