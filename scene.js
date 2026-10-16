import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {createPerformanceBudget,samplePerformance} from './presentation.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {createDrivingFeel,updateDrivingFeel} from './driving-feel.js';
import {forkBounds,forkSurface} from './route-road.js';
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
function signTexture(text,color='#ffd976',sub=''){return canvasTexture((c,w,h)=>{c.fillStyle='#192c43';c.fillRect(0,0,w,h);c.strokeStyle=color;c.lineWidth=12;c.strokeRect(12,12,w-24,h-24);c.textAlign='center';c.fillStyle=color;c.font='900 120px sans-serif';c.fillText(text,w/2,145);if(sub){c.fillStyle='#fff';c.font='bold 28px sans-serif';c.fillText(sub,w/2,207);}},512,256);}
function liveryPlate(key,label,color){if(!liveryPlates.has(key)){const texture=canvasTexture((c,w,h)=>{c.fillStyle='#11283b';c.fillRect(0,0,w,h);c.strokeStyle='#'+color.toString(16).padStart(6,'0');c.lineWidth=12;c.strokeRect(7,7,w-14,h-14);c.fillStyle='#fff5dd';c.font='900 142px sans-serif';c.textAlign='center';c.fillText(label,w/2,163);c.font='bold 22px sans-serif';c.fillStyle='#a9c9d9';c.fillText('WORDRIFT',w/2,212);},192,256);liveryPlates.set(key,new THREE.MeshStandardMaterial({map:texture,roughness:.56,metalness:.08}));}return liveryPlates.get(key);}
export class RallyScene{
  constructor(container,renderer){
    this.container=container;this.viewport={width:innerWidth,height:innerHeight};
    this.renderer=renderer||new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});this.preferences={graphics:'auto',reduced:false};this.performanceBudget=createPerformanceBudget('auto',window.devicePixelRatio||1);this.renderer.setPixelRatio(this.performanceBudget.ratio);this.renderer.setSize(innerWidth,innerHeight);this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.12;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;container.append(this.renderer.domElement);
    this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(52,innerWidth/innerHeight,.25,700);this.hemi=new THREE.HemisphereLight(0xd8eeff,0x536e69,1.4);this.scene.add(this.hemi);
    // Real-time shadows are reserved for actors near the car. Static scenery
    // carries baked contact shading, so nothing pops in at the frustum edge.
    this.sun=new THREE.DirectionalLight(0xffe1b3,3.4);this.sunOffset=new THREE.Vector3(-34,62,38);this.sun.target.position.set(0,0,-14);this.sun.position.copy(this.sun.target.position).add(this.sunOffset);this.sun.castShadow=true;this.sun.shadow.mapSize.set(1024,1024);Object.assign(this.sun.shadow.camera,{left:-26,right:26,top:34,bottom:-34,near:10,far:170});this.sun.shadow.bias=-.0004;this.sun.shadow.normalBias=.035;this.sun.shadow.radius=3;this.scene.add(this.sun,this.sun.target);this.rim=new THREE.DirectionalLight(0x9bdcf0,1.05);this.rim.position.set(30,20,-50);this.scene.add(this.rim);
    this.player=this.makeCar(0xf3bc55,true);this.scene.add(this.player);this.player.position.z=4;
    this.damageFx=new CarDamageEffects(this.scene,this.player);
    this.rivalCars=[];this.spectators=new RaceSpectators(this.scene);this.trail=new THREE.Group();this.scene.add(this.trail);for(let i=0;i<12;i++){const p=mesh(this.trail,'box',0x80cbb8,0,.08,0,.08,.025,.32,.4,0,0x58a58f);p.visible=false;}this.boostFx=new BoostEffects(this.scene,this.player);this.exhaust=this.boostFx.exhaust;this.lookConfig={color:0xf3bc55,badge:0,trail:false};
    this.shadow=new THREE.Mesh(new THREE.PlaneGeometry(3.6,6.5),new THREE.MeshBasicMaterial({map:canvasTexture((c,w,h)=>{let gr=c.createRadialGradient(w/2,h/2,20,w/2,h/2,w/2);gr.addColorStop(0,'#0007');gr.addColorStop(1,'#0000');c.fillStyle=gr;c.fillRect(0,0,w,h);},128,128),transparent:true,depthWrite:false}));this.shadow.rotation.x=-Math.PI/2;this.shadow.position.set(0,.07,4);this.scene.add(this.shadow);
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
    const shadow=new THREE.Mesh(geo.contact,this.contactMaterial);shadow.rotation.x=-Math.PI/2;shadow.scale.set(3.3,5.7,1);shadow.position.y=.055;this.scene.add(shadow);car.userData.contactShadow=shadow;
  }
  placeContactShadow(car){const shadow=car.userData.contactShadow;if(shadow){shadow.visible=car.visible;shadow.position.set(car.position.x,.055,car.position.z);shadow.rotation.z=-car.rotation.y;}}
  syncRivals(state){
    if(this.rivalState===state)return;for(const m of this.rivalCars){if(m.userData.contactShadow)this.scene.remove(m.userData.contactShadow);this.scene.remove(m);m.traverse(n=>{if(n.isMesh&&!Object.values(geo).includes(n.geometry))n.geometry.dispose();});}this.rivalCars=[];this.rivalState=state;
    for(const r of state?.rivals||[]){const m=this.makeCar(r.color,false,'gt'),a=m.userData.anchors;m.userData.rival=r;const plate=new THREE.Mesh(new THREE.PlaneGeometry(.62,.8).rotateX(-Math.PI/2),liveryPlate('rival'+r.id,String(r.id+2).padStart(2,'0'),r.color));plate.position.set(0,a.roofY+.004,a.roofZ);m.add(plate);const exhaust=new THREE.Group();for(const side of [-1,1]){const flame=mesh(exhaust,'cone',r.id?0xffc697:0x93e5ff,side*a.exhaust[0],a.exhaust[1],a.exhaust[2]+.5,.11,.85,.11,.2,0,r.id?0xff9658:0x45b8ef);flame.rotation.x=-Math.PI/2;flame.material=r.id?rivalFlameB:rivalFlameA;}exhaust.visible=false;m.add(exhaust);m.userData.nitroExhaust=exhaust;this.scene.add(m);this.addContactShadow(m);this.rivalCars.push(m);}
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
    const plan=chunkPlan(this.index,n,{tunnels:this.tunnels});g.userData.plan=plan;
    for(const [i,road]of g.userData.roadSurfaces.entries()){road.geometry.dispose();road.geometry=this.mainRoadGeometry(at,i===1);road.userData.flatPositions=road.geometry.attributes.position.array.slice();road.userData.flatNormals=road.geometry.attributes.normal.array.slice();}
    for(const m of g.userData.roadside){const [name,v]=plan.roadside[m.userData.side],list=this.kit.roadside[name],src=list[v%list.length][m.userData.side];m.geometry.dispose();m.geometry=src.clone();m.userData.flatPositions=src.attributes.position.array;m.userData.flatNormals=src.attributes.normal.array;m.castShadow=!!plan.tunnel;}
    const edgeMax={'-1':5.4,'1':5.4};for(let z=-10;z<=10;z+=2.5)for(const s of [-1,1])edgeMax[s]=Math.max(edgeMax[s],this.edge(at-z,s));
    for(const sc of g.userData.scenery){const v=plan.scenery[sc.side];sc.mesh.geometry=v<0?this.kit.empty:this.kit.scenery[sc.side][v];sc.mesh.position.x=sc.side*(edgeMax[sc.side]+5.6);}
    const angle=g.rotation.y,c=Math.cos(angle),sn=Math.sin(angle);
    for(const m of g.userData.flexSurfaces){
      const attr=m.geometry.attributes.position,normal=m.geometry.attributes.normal,flat=m.userData.flatPositions,normals=m.userData.flatNormals,side=m.userData.side||0;
      for(let v=0;v<flat.length;v+=3){const z=flat[v+2],course=at-z,xx=flat[v]+(side?side*(this.edge(course,side)-5.4):0)+this.curve(course)-this.curve(at);attr.array[v]=c*xx-sn*z;attr.array[v+1]=flat[v+1];attr.array[v+2]=sn*xx+c*z;const nx=normals[v],ny=normals[v+1],nz=normals[v+2]+(this.curve(course+.1)-this.curve(course-.1))/.2*nx,len=Math.hypot(nx,ny,nz)||1;normal.array[v]=(c*nx-sn*nz)/len;normal.array[v+1]=ny/len;normal.array[v+2]=(sn*nx+c*nz)/len;}
      attr.needsUpdate=true;normal.needsUpdate=true;m.geometry.computeBoundingSphere();
    }
  }
  curve(at){return window.RallyCore.courseCurve(this.index,at);}
  heading(at,route){const C=window.RallyCore;return -Math.atan((this.curve(at+1)+C.routeOffset(route,at+1)-this.curve(at-1)-C.routeOffset(route,at-1))/2);}
  prepareCourse(state){
    if(this.courseState===state&&this.courseRevision===state?.taskRevision)return;
    this.courseState=state;this.courseRevision=state?.taskRevision;this.roadReservations=[];this.forkRanges=[];this.apronRanges=[];
    for(const t of state?.tasks||[]){const zone=window.RallyCore.taskZone(t);this.roadReservations.push({start:zone.start-80,end:zone.end+80});this.apronRanges.push({start:zone.start-70,fullStart:zone.start-30,fullEnd:zone.end+25,end:zone.end+80});if(t.kind==='junction')this.forkRanges.push(forkBounds(window.RallyCore.makeRoute(state,t,0,true)));}
    const C=window.RallyCore;this.forkRoutes=(state?.tasks||[]).filter(t=>t.kind==='junction').map(t=>{const routes=[0,1,2].map(i=>C.makeRoute(state,t,i,i===t.correctIndex));return {routes,bounds:forkBounds(routes[0])};});
    // Tunnels avoid every task zone, spectator stand and the finish straight.
    const zones=(state?.tasks||[]).map(t=>C.taskZone(t)),blocked=zones.map(z=>({start:z.start-80,end:z.end+80}));
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
    for(const r of this.forkRanges||[])for(const edge of [r.start,r.end])if(edge>start&&edge<end)ats.add(edge);
    const rows=[...ats].sort((a,b)=>a-b),positions=[],uvs=[],indices=[],normals=[],stride=shoulder?4:2;
    rows.forEach(p=>{const width=this.apronWidth(p),xs=shoulder?[-width,-5.4,5.4,width]:[-5.4,5.4];for(const x of xs){positions.push(x,0,at-p);normals.push(0,1,0);uvs.push(shoulder?x/10.8:x<0?0:1,p/20);}});
    for(let i=0;i<rows.length-1;i++){const mid=(rows[i]+rows[i+1])/2;if(this.forkRanges?.some(r=>mid>r.start&&mid<r.end)||shoulder&&this.apronWidth(mid)<5.40001)continue;for(let j=0;j<stride;j+=2){const n=i*stride+j;indices.push(n,n+1,n+stride,n+stride,n+1,n+stride+1);}}
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
      const length=task.blocks.length*16;mesh(g,'box',0x9d7155,0,.03,-length/2,10.5,.05,length);
      for(let j=0;j<task.blocks.length;j++){let slab=mesh(g,'box',0x536b7f,0,-1.5,-8-j*16,10.45,.12,15.85);g.userData.repairSlabs.push(slab);}
      for(let side of[-1,1]){g.userData.barriers.push(mesh(g,'box',0xec9252,side*3,1.3,-2,4,.25,.12));for(let j=0;j<3;j++)g.userData.barriers.push(mesh(g,'cone',0xf19657,side*(3.2+j*.75),.5,1,.27,1,.27));}
    }else{
      const C=window.RallyCore,routes=[0,1,2].map(index=>C.makeRoute(state,task,index,index===task.correctIndex));
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
    for(const t of tasks){const ahead=t.at-d,keep=t.kind==='finish'?80:window.RallyCore.taskZone(t).end-t.at+120;const g=this.gates.get(t.id);if(!g)continue;g.visible=ahead<=window.RallyCore.TASK_VIEW_DISTANCE&&ahead>=-keep;if(!g.visible)continue;g.position.set(this.curve(t.at)-base,0,-ahead+4);
      if(t.kind==='junction'&&t.completed&&g.userData.chosenIndex!==t.chosenIndex){g.userData.chosenIndex=t.chosenIndex;for(const path of g.userData.routePaths||[]){const chosen=path.index===t.chosenIndex,paint=mat(chosen?(t.success?0xa9eccb:0xf1c187):0x748895,.55,0,chosen?(t.success?0x28674b:0x6b4c29):0);path.left.material=path.right.material=paint;path.chevrons.traverse(m=>{if(m.isMesh)m.material=paint;});}}
      if(t.kind==='junction')g.userData.mergeGuide.visible=!!state.mergeAssist&&state.mergeAssist.taskId===t.id&&window.RallyCore.exitAssist(state)===state.mergeAssist;
      if(t.kind==='light'&&t.success)g.traverse(m=>{if(m.userData.bulb===0)m.material=mat(0x5b3439);if(m.userData.bulb===2)m.material=mat(0x69f3b7,.3,0,0x3ceb91);});
      if(t.kind==='repair'){g.userData.repairSlabs.forEach((m,j)=>{const filled=j<(t.chosen?.length||0);m.position.y=t.solved?.12:THREE.MathUtils.damp(m.position.y,filled?.12:-1.5,12,dt);});g.userData.barriers.forEach(m=>m.visible=!t.solved);}
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
    for(const [id,g]of this.gates){if(g.userData.task.at-d<-(g.userData.task.kind==='finish'?80:window.RallyCore.taskZone(g.userData.task).end-g.userData.task.at+120)){this.disposeGate(g);this.gates.delete(id);}}
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
    g.traverse(m=>{if(m.isMesh){m.castShadow=true;m.receiveShadow=true;}});return g;
  }
  syncTraffic(state){if(this.trafficState===state)return;this.traffic.forEach(m=>{if(m.userData.contactShadow)this.scene.remove(m.userData.contactShadow);this.scene.remove(m);m.traverse(n=>{if(n.isMesh&&!Object.values(geo).includes(n.geometry))n.geometry.dispose();});});this.traffic=[];this.trafficState=state;if(!state)return;for(const o of state.obstacles){const m=this.makeObstacle(o);m.userData.obstacle=o;this.scene.add(m);if(o.type==='traffic')this.addContactShadow(m);this.traffic.push(m);}}

  updateAtmosphere(dt,worldDt,d,base,frozen){
    const reduced=this.preferences.reduced,battery=this.preferences.graphics==='battery';
    for(const item of this.landmarks||[]){
      const ahead=item.at-d,visible=ahead>-90&&ahead<620;item.group.visible=visible;if(!visible)continue;
      const x=item.overRoad?0:item.side*(this.edge(item.at,item.side)+item.offset);item.group.position.set(this.curve(item.at)-base+x,0,-ahead+4);item.group.rotation.y=item.overRoad?-Math.atan((this.curve(item.at+1)-this.curve(item.at-1))/2):item.side*.35;
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
    const worldDt=dt*(state?.worldTimeScale??1);
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
    for(const m of this.rivalCars){const r=m.userData.rival,ahead=r.at-d;m.visible=ahead>-60&&ahead<330;m.position.set(this.curve(r.at)+window.RallyCore.routeOffset(r.route,r.at)-base+r.lanePos*3.35+(r.passingOffset||0),0,-ahead+4);m.rotation.y=this.heading(r.at,r.route)-THREE.MathUtils.clamp((r.lane-r.lanePos)*.16,-.16,.16);if(!frozen){m.userData.wheelAngle=((m.userData.wheelAngle||0)+Math.max(0,r.at-(m.userData.previousAt??r.at))/.43)%(Math.PI*2);m.userData.previousAt=r.at;}this.animateCar(m,m.userData.wheelAngle||0,-(r.lane-r.lanePos)*.28,r.braking);m.userData.nitroExhaust.visible=!!r.nitroActive&&!frozen;this.placeContactShadow(m);const direction=Math.sign((r.plannedLane??r.lane)-r.lanePos);for(const lamp of m.userData.indicators||[])lamp.visible=direction!==0&&(r.plannedLane!=null||Math.abs(r.lane-r.lanePos)>.05)&&lamp.userData.indicator===direction&&Math.floor((state.elapsed||0)*3)%2===0;}
    for(let m of this.traffic){const o=m.userData.obstacle,ahead=o.at-d;m.visible=ahead>-50&&ahead<360;m.position.set(window.RallyCore.actorX(state,o)-base,0,-ahead+4);const turning=o.changed&&o.laneProgress<1,steer=turning?THREE.MathUtils.clamp(-(o.target-o.fromLane)*Math.sin(o.laneProgress*Math.PI)*.12,-.16,.16):0;m.rotation.y=this.heading(o.at,o.route)+steer;(m.userData.indicators||[]).forEach(n=>{n.visible=(o.moving||o.routeChanging)&&turning&&n.userData.indicator===Math.sign(o.target-o.fromLane)&&Math.floor((state?.elapsed||0)*3)%2===0;});m.rotation.z=o.hit&&state.elapsed-(o.hitAt??0)<.45?Math.sin(state.elapsed*18)*.08:0;if(!frozen){m.userData.wheelAngle=((m.userData.wheelAngle||0)+Math.max(0,o.at-(m.userData.previousAt??o.at))/.43)%(Math.PI*2);m.userData.previousAt=o.at;}this.animateCar(m,m.userData.wheelAngle||0,steer,o.braking||o.waiting);this.placeContactShadow(m);}
    this.updateGates(state,d,base,worldDt);
    if(this.motionState!==state){this.motionState=state;this.motion=createDrivingFeel(this.currentLane,state?.roadTravel??d);}
    const speed=state?state.arena.speed*state.speedFactor*(state.worldTimeScale??1):6;
    // Time dilation changes the animation clock, rather than applying brakes.
    if(state?.focusAuto)this.motion.lastSpeed=speed;
    const oldLane=this.motion.lane;updateDrivingFeel(this.motion,state?.lane||0,state?.roadTravel||d,speed,state?.focusAuto&&['light','junction'].includes(state.task?.kind)?dt:worldDt,frozen);if(state&&!frozen&&!window.RallyCore.playerLaneClear(state,oldLane,this.motion.lane)){const blocker=window.RallyCore.playerLaneBlocker(state,oldLane,this.motion.lane);this.motion.lane=oldLane;this.motion.velocity=0;this.motion.steer=0;window.RallyCore.contactBump(state,blocker);}this.currentLane=this.motion.lane;
    let x=this.currentLane*3.35;const playerZ=mode==='home'&&this.viewport.width<760&&this.viewport.height>this.viewport.width?-9:4;this.player.position.set(x,.04+(this.preferences.reduced?0:this.motion.bob),playerZ);this.player.rotation.set(this.preferences.reduced?0:this.motion.pitch,this.heading(d,state?.route)+this.motion.steer*.22,this.preferences.reduced?0:this.motion.roll);this.animateCar(this.player,this.motion.wheelAngle,this.motion.steer,this.motion.braking||!!state?.yielding&&speed<.5);this.player.visible=true;this.shadow.position.set(x,.07,playerZ);this.shadow.rotation.z=-this.player.rotation.y;this.nitroReadyGlow.position.set(x,.08,playerZ);this.nitroReadyGlow.rotation.z=-this.player.rotation.y;this.nitroReadyGlow.visible=!frozen&&!state?.nitroActive&&window.RallyCore.canEngageNitro(state);this.nitroReadyGlow.scale.setScalar(this.preferences.reduced?1:1+Math.sin(this.elapsed*3)*.025);
    this.damageFx.update(dt,state,this.preferences,frozen);
    this.boostFx.update(worldDt,state,this.preferences,frozen);if(this.waterNormal&&!frozen&&!this.preferences.reduced)this.waterNormal.offset.set(this.elapsed*.009,this.elapsed*.005);this.trail.children.forEach((p,i)=>{p.visible=!!state&&!frozen&&!this.preferences.reduced&&this.preferences.graphics!=='battery'&&(this.lookConfig.trail||state.nitroActive)&&speed>2;p.position.set(x+(i%2?1:-1)*.64,.08,playerZ+3+i*.45);p.material=mat(state?.nitroActive?0x89ddff:0x80cbb8,.5,0,state?.nitroActive?0x2698c9:0x367c67);p.scale.z=1-i/16;});
    const cameraFrozen=state&&['paused','finished','failed'].includes(state.status);
    const isPortrait=this.viewport.width<760&&this.viewport.height>this.viewport.width,home=mode==='home';let cx=home?(isPortrait?2:-7):state?.status==='task'?x*.7:x*.35,cy=home?(isPortrait?9:8.5):state?.status==='task'?7.2:6.2,cz=home?(isPortrait?16:17):state?.status==='task'?17:16;
    // A small speed pullback conveys acceleration without shaking the signs.
    if(!home&&!this.preferences.reduced&&state?.status!=='task')cz+=Math.min(2.4,Math.max(0,state.speedFactor-1)*.9);
    if(!cameraFrozen){this.camera.position.x=THREE.MathUtils.damp(this.camera.position.x,cx,4,dt);this.camera.position.y=THREE.MathUtils.damp(this.camera.position.y,cy,4,dt);this.camera.position.z=THREE.MathUtils.damp(this.camera.position.z,cz,4,dt);}
    const readingFov=Math.max(24,Math.min(52,2*Math.atan(this.viewport.height*3.35/(2*27*Math.min(140,(this.viewport.width-24)/3)))*180/Math.PI));if(!cameraFrozen)this.camera.fov=THREE.MathUtils.damp(this.camera.fov,state?.status==='task'?readingFov:playing?52+(this.preferences.reduced?0:Math.min(15,Math.max(0,state.speedFactor-1)*6.2)):52,state?.nitroActive?9:4,dt);this.camera.updateProjectionMatrix();const raceTilt=Math.atan2(this.camera.position.y-.8,Math.max(1,this.camera.position.z-4))-Math.atan(.58*Math.tan(this.camera.fov*Math.PI/360));const raceLookY=this.camera.position.y-Math.tan(raceTilt)*(this.camera.position.z+11);if(!cameraFrozen){const bendLook=this.preferences.reduced?0:THREE.MathUtils.clamp(-this.heading(d+10,state?.route)*6,-2.2,2.2);this.look.set(home?(isPortrait?-1.8:-4):state?.status==='task'?x*.65:x*.25+bendLook,home?(isPortrait?-1:1):raceLookY,home?(isPortrait?-9:-8):-11);this.camera.lookAt(this.look);}
    // A steady dusk light avoids full-screen storm flashes during reading.
    this.sun.intensity=this.index===2?2.7:3.4;
    this.updateRoadBoards(state,base);this.renderer.render(this.scene,this.camera);
  }
}
