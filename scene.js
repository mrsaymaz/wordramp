import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {createPerformanceBudget,samplePerformance} from './presentation.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {createDrivingFeel,updateDrivingFeel} from './driving-feel.js';
import {forkBounds,forkSurface} from './route-road.js';
import {createBodyGeometry,createCanopyGeometry} from './vehicle-geometry.js';
import {BoostEffects} from './boost-effects.js';
import {RaceSpectators} from './spectators.js';
import {CarDamageEffects} from './damage-effects.js';
const palettes=[
  {sky:0x86c7eb,fog:0xc9deec,road:0x334355,ground:0x83b19c,rail:0xd3ddd7,sun:0xffdab0,ambient:0xc0ddf4,water:0x399ab4,buildings:[0xdcc7b1,0xd6dddf,0x96b6bf,0xc4b5a0,0x688ea6]},
  {sky:0x6ccbe4,fog:0xbde3df,road:0x2f4252,ground:0x609d8b,rail:0xd6e7de,sun:0xffefd1,ambient:0xaedce8,water:0x2e9eb3,buildings:[0xd5ddd6,0x879fa9,0x79a7a3,0xc8d9d2,0x557a8e]},
  {sky:0x313e6b,fog:0x8798b7,road:0x28344d,ground:0x5d7182,rail:0xa7b6c6,sun:0xb3c7ff,ambient:0x919ccc,water:0x435b83,buildings:[0x8492ac,0x687d98,0x899ca6,0x536985,0xa5afbc]}
];
const materials=new Map(),paints=new Map(),liveryPlates=new Map();
const glassMaterial=new THREE.MeshPhysicalMaterial({color:0x375f76,roughness:.12,metalness:.35,clearcoat:1,clearcoatRoughness:.08});
function paintMat(color){if(!paints.has(color))paints.set(color,new THREE.MeshPhysicalMaterial({color,roughness:.3,metalness:.28,clearcoat:.65,clearcoatRoughness:.22}));return paints.get(color);}
function mat(color,roughness=.7,metalness=0,emissive=0){let key=[color,roughness,metalness,emissive].join();if(!materials.has(key))materials.set(key,new THREE.MeshStandardMaterial({color,roughness,metalness,emissive,emissiveIntensity:emissive?.7:0}));return materials.get(key);}
const geo={body:createBodyGeometry(),canopy:createCanopyGeometry(),arch:new THREE.TorusGeometry(.48,.07,5,18,Math.PI),rock:new THREE.IcosahedronGeometry(1,1),leaf:new THREE.SphereGeometry(1,10,5),carTrim:new RoundedBoxGeometry(1,1,1,2,.09),contact:new THREE.PlaneGeometry(1,1),coach:new RoundedBoxGeometry(1,1,1,1,.09),box:new THREE.BoxGeometry(1,1,1),sphere:new THREE.SphereGeometry(1,12,8),cone:new THREE.ConeGeometry(1,1,6),cylinder:new THREE.CylinderGeometry(1,1,1,18)};
function mesh(group,shape,color,x,y,z,sx=1,sy=1,sz=1,roughness=.7,metalness=0,emissive=0){let m=new THREE.Mesh(geo[shape],mat(color,roughness,metalness,emissive));m.position.set(x,y,z);m.scale.set(sx,sy,sz);group.add(m);return m;}
function compact(group){group.updateMatrixWorld(true);const inverse=group.matrixWorld.clone().invert();let byMat=new Map(),paint=new Set();group.traverse(m=>{if(m.isMesh){if(m.userData.paint)paint.add(m.material);let a=byMat.get(m.material)||[];a.push(m.geometry.clone().applyMatrix4(m.matrixWorld.clone().premultiply(inverse)));byMat.set(m.material,a);}});let result=new THREE.Group();for(let [material,geos]of byMat){if(geos.some(g=>g.index)&&geos.some(g=>!g.index))for(let i=0;i<geos.length;i++)if(geos[i].index){const old=geos[i];geos[i]=old.toNonIndexed();old.dispose();}let merged=mergeGeometries(geos);let m=new THREE.Mesh(merged,material);m.receiveShadow=true;m.castShadow=true;m.userData.paint=paint.has(material);result.add(m);geos.forEach(g=>g.dispose());}return result;}
function canvasTexture(draw,w=512,h=1024){let c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);let t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
function signTexture(text,color='#ffd976',sub=''){return canvasTexture((c,w,h)=>{c.fillStyle='#192c43';c.fillRect(0,0,w,h);c.strokeStyle=color;c.lineWidth=12;c.strokeRect(12,12,w-24,h-24);c.textAlign='center';c.fillStyle=color;c.font='900 120px sans-serif';c.fillText(text,w/2,145);if(sub){c.fillStyle='#fff';c.font='bold 28px sans-serif';c.fillText(sub,w/2,207);}},512,256);}
function liveryPlate(key,label,color){if(!liveryPlates.has(key)){const texture=canvasTexture((c,w,h)=>{c.fillStyle='#11283b';c.fillRect(0,0,w,h);c.strokeStyle='#'+color.toString(16).padStart(6,'0');c.lineWidth=12;c.strokeRect(7,7,w-14,h-14);c.fillStyle='#fff5dd';c.font='900 142px sans-serif';c.textAlign='center';c.fillText(label,w/2,163);c.font='bold 22px sans-serif';c.fillStyle='#a9c9d9';c.fillText('WORDRIFT',w/2,212);},192,256);liveryPlates.set(key,new THREE.MeshStandardMaterial({map:texture,roughness:.56,metalness:.08}));}return liveryPlates.get(key);}
export class RallyScene{
  constructor(container,renderer){
    this.container=container;this.viewport={width:innerWidth,height:innerHeight};
    this.renderer=renderer||new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});this.preferences={graphics:'auto',reduced:false};this.performanceBudget=createPerformanceBudget('auto',window.devicePixelRatio||1);this.renderer.setPixelRatio(this.performanceBudget.ratio);this.renderer.setSize(innerWidth,innerHeight);this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.12;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;container.append(this.renderer.domElement);
    this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(52,innerWidth/innerHeight,.1,450);this.scene.add(new THREE.HemisphereLight(0xd8eeff,0x536e69,1.4));this.sun=new THREE.DirectionalLight(0xffe1b3,3.4);this.sun.position.set(-40,65,25);this.sun.castShadow=true;this.sun.shadow.mapSize.set(1024,1024);this.sun.shadow.camera.left=-38;this.sun.shadow.camera.right=38;this.sun.shadow.camera.top=50;this.sun.shadow.camera.bottom=-38;this.sun.shadow.camera.far=180;this.sun.shadow.bias=-.0002;this.sun.shadow.normalBias=.025;this.scene.add(this.sun,this.sun.target);this.rim=new THREE.DirectionalLight(0x9bdcf0,1.05);this.rim.position.set(30,20,-50);this.scene.add(this.rim);
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
  makeCar(color,player=false){
    let g=new THREE.Group(),wheels=[],brakeLights=[],indicators=[];mesh(g,'body',color,0,0,0);
    const glass=mesh(g,'canopy',0x375f76,0,0,0);glass.material=glassMaterial;
    mesh(g,'carTrim',color,0,1.49,.17,1.56,.13,1.08,.22,.35);
    for(const side of [-1,1]){const vent=mesh(g,'box',0x162c3c,side*.62,.93,-1.19,.22,.025,.56,.5,.25);vent.rotation.x=.06;const lip=mesh(g,'coach',color,side*.88,.59,-1.9,.25,.24,.55,.3,.35);lip.rotation.y=side*.13;}
    for(let side of[-1,1]){
      mesh(g,'box',color,side*.79,1.24,.12,.045,.45,.10,.25,.3);mesh(g,'box',0xa4c3cd,side*1.047,.91,.36,.035,.025,1.20,.22,.55);mesh(g,'box',0x192b41,side*1.15,1.02,-.54,.3,.16,.3,.3,.35);
      for(let z of[-1.38,1.4]){const axle=new THREE.Group(),spin=new THREE.Group();axle.position.set(side*1.09,.46,z);axle.add(spin);g.add(axle);axle.userData.front=z<0;axle.userData.spin=spin;wheels.push(axle);let arch=mesh(g,'arch',0x1a2c3b,side*1.065,.46,z,1,1,1,.7,.05);arch.rotation.y=Math.PI/2;let tire=mesh(spin,'cylinder',0x111e2c,0,0,0,.43,.24,.43,.9,.1);tire.rotation.z=Math.PI/2;let rim=mesh(spin,'cylinder',0x8298a5,side*.13,0,0,.26,.025,.26,.24,.75);rim.rotation.z=Math.PI/2;for(let a=0;a<3;a++){let spoke=mesh(spin,'box',0xd8e5e8,side*.15,0,0,.026,.44,.055,.24,.7);spoke.rotation.x=a*Math.PI/3;}}
      const indicator=mesh(g,'box',0xffbf55,side*.98,.8,2.2,.12,.1,.04,.3,.1,0xffa328);indicator.userData.indicator=side;indicator.visible=false;
      indicators.push(indicator);mesh(g,'coach',0xfff5ca,side*.69,.68,-2.17,.58,.065,.045,.2,.2,0xffe7a0);mesh(g,'box',0xc8f1ef,side*.96,.60,-2.08,.045,.17,.045,.2,.2,0x85e3ff);brakeLights.push(mesh(g,'coach',0x873943,side*.53,.76,2.13,.95,.07,.045,.2,.2,0x5b1820));
    }
    // Trim catches the sun; the silhouette stays readable at mobile scale.
    for(const side of [-1,1]){
      mesh(g,'coach',0x233445,side*1.105,.44,.05,.08,.13,3.5,.33,.55);
      mesh(g,'box',0xdce7e8,side*.91,1.02,.85,.14,.035,.26,.2,.65);
      const pipe=mesh(g,'cylinder',0x586d7b,side*.69,.37,2.27,.10,.15,.10,.18,.8);pipe.rotation.x=Math.PI/2;
      mesh(g,'box',0xf3e7b8,side*.97,.78,-2.13,.07,.14,.08,.2,.2,0xffdfaa);
    }
    mesh(g,'box',0x82919b,0,.68,2.20,.48,.16,.025,.3,.4);
    mesh(g,'box',0x1b2b3b,0,.86,2.19,.72,.06,.05,.25,.3);
    mesh(g,'box',0x18283a,0,.47,-2.22,1.54,.19,.05,.3,.4);mesh(g,'box',0x1b2b3b,0,.4,2.23,1.65,.19,.12,.3,.4);
    if(player){for(let x of[-.3,.3]){const stripe=mesh(g,'box',0x233a50,x,.943,-1.10,.14,.012,.78);stripe.rotation.x=.06;mesh(g,'box',0x22374b,x,1.562,.2,.14,.014,1.32);}mesh(g,'box',0x24374a,0,1.11,1.98,2.37,.1,.28,.3,.5);for(let x of[-.78,.78])mesh(g,'box',0x29394d,x,.99,1.93,.12,.22,.12);}
    g.traverse(m=>{if(m.isMesh){m.castShadow=true;m.receiveShadow=true;if(m.material.color.getHex()===color){m.userData.paint=true;m.material=paintMat(color);}}});
    for(const axle of wheels){const spin=axle.userData.spin,body=compact(spin);spin.clear();spin.add(body);}
    {const animated=[...wheels,...brakeLights,...indicators];animated.forEach(m=>g.remove(m));const body=compact(g);animated.forEach(m=>body.add(m));body.traverse(m=>{if(m.isMesh){m.castShadow=true;m.receiveShadow=true;}});body.userData={indicators,wheels,brakeLights,wheelAngle:0};body.userData.hitBounds=new THREE.Box3().setFromObject(body);return body;}
  }
  animateCar(car,wheelAngle,steer,braking){
    for(const axle of car.userData.wheels||[]){axle.rotation.y=axle.userData.front?steer:0;axle.userData.spin.rotation.x=wheelAngle;}
    for(const lamp of car.userData.brakeLights||[])lamp.material=braking?mat(0xff6564,.2,.2,0xff2929):mat(0x873943,.2,.2,0x5b1820);
  }
  setCosmetics(look){this.lookConfig=look;
    if(!this.teamRoundel){this.teamRoundel=new THREE.Mesh(new THREE.PlaneGeometry(.73,.97).rotateX(-Math.PI/2));this.teamRoundel.position.set(0,1.574,.2);this.player.add(this.teamRoundel);}
    this.teamRoundel.visible=!!look.teamId;if(look.teamId)this.teamRoundel.material=liveryPlate(look.teamId,look.teamId[0].toUpperCase(),look.color);
    this.player.traverse(m=>{if(m.userData.paint)m.material=paintMat(look.color);});if(!this.hoodBadge){this.hoodBadge=mesh(this.player,'cylinder',0xf7dfa1,0,.925,-1.43,.20,.02,.20,.3,.6,0x584520);this.hoodBadge.userData.cosmetic=true;const shape=new THREE.Shape();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?.065:.15;if(i===0)shape.moveTo(Math.cos(a)*r,Math.sin(a)*r);else shape.lineTo(Math.cos(a)*r,Math.sin(a)*r);}shape.closePath();this.badgeStar=new THREE.Mesh(new THREE.ShapeGeometry(shape),mat(0x3d4d5b,.3,.5));this.badgeStar.rotation.x=-Math.PI/2;this.badgeStar.position.set(0,.94,-1.43);this.player.add(this.badgeStar);}this.hoodBadge.visible=this.badgeStar.visible=look.badge>0;this.hoodBadge.material=mat([0xf7dfa1,0xa9d2ce,0xe9c373,0xd2c2ec][look.badge]||0xf7dfa1,.3,.6);}
  addContactShadow(car){
    if(!this.contactMaterial){this.contactMaterial=this.shadow.material.clone();this.contactMaterial.opacity=.52;}
    const shadow=new THREE.Mesh(geo.contact,this.contactMaterial);shadow.rotation.x=-Math.PI/2;shadow.scale.set(3.3,5.7,1);shadow.position.y=.055;this.scene.add(shadow);car.userData.contactShadow=shadow;
  }
  placeContactShadow(car){const shadow=car.userData.contactShadow;if(shadow){shadow.visible=car.visible;shadow.position.set(car.position.x,.055,car.position.z);shadow.rotation.z=-car.rotation.y;}}
  syncRivals(state){
    if(this.rivalState===state)return;for(const m of this.rivalCars){if(m.userData.contactShadow)this.scene.remove(m.userData.contactShadow);this.scene.remove(m);m.traverse(n=>{if(n.isMesh&&!Object.values(geo).includes(n.geometry))n.geometry.dispose();});}this.rivalCars=[];this.rivalState=state;
    for(const r of state?.rivals||[]){const m=this.makeCar(r.color,true);m.scale.x=.84;m.userData.rival=r;const plate=new THREE.Mesh(new THREE.PlaneGeometry(.73,.97).rotateX(-Math.PI/2),liveryPlate('rival'+r.id,String(r.id+2).padStart(2,'0'),r.color));plate.position.set(0,1.574,.2);m.add(plate);const exhaust=new THREE.Group();for(const side of [-1,1]){const flame=mesh(exhaust,'cone',r.id?0xffc697:0x93e5ff,side*.65,.4,2.7,.13,.85,.13,.2,0,r.id?0xff9658:0x45b8ef);flame.rotation.x=-Math.PI/2;}exhaust.visible=false;m.add(exhaust);m.userData.nitroExhaust=exhaust;this.scene.add(m);this.addContactShadow(m);this.rivalCars.push(m);}
  }
  rivalProjection(){this.camera.updateMatrixWorld();return this.rivalCars.map(m=>{const p=m.position.clone();p.y+=2.5;p.project(this.camera);return {id:m.userData.rival.id,x:(p.x*.5+.5)*this.viewport.width,y:(-.5*p.y+.5)*this.viewport.height,visible:m.visible&&p.z>-1&&p.z<1&&m.position.z<-3};});}
  ribbon(g,points,width,color,y=.13){const vertices=[];for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1];vertices.push(a.x-width/2,y,-a.at,a.x+width/2,y,-a.at,b.x-width/2,y,-b.at,b.x-width/2,y,-b.at,a.x+width/2,y,-a.at,b.x+width/2,y,-b.at);}const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.computeVertexNormals();const uvs=[];for(let i=0;i<vertices.length;i+=3)uvs.push(vertices[i]/10.8,-vertices[i+2]/20);geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));const m=new THREE.Mesh(geometry,color===this.palette.road?this.asphaltMaterial:mat(color));m.receiveShadow=true;g.add(m);return m;}
  setup(index){
    if(index===this.index)return;
    this.index=index;this.palette=palettes[index];this.world.traverse(o=>{if(o.isMesh&&!Object.values(geo).includes(o.geometry))o.geometry.dispose();});this.world.clear();this.roadTexture?.dispose();this.roadMaterial?.dispose();this.asphaltTexture?.dispose();this.asphaltMaterial?.dispose();this.skyTexture?.dispose();this.reflectionTexture?.dispose();this.waterNormal?.dispose();this.waterMaterial?.dispose();this.segments=[];this.courseState=undefined;
    const p=this.palette;this.skyTexture=canvasTexture((c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#'+p.sky.toString(16));g.addColorStop(.62,'#'+p.fog.toString(16));g.addColorStop(1,index===2?'#d5adba':'#f4e5cc');c.fillStyle=g;c.fillRect(0,0,w,h);},16,256);this.scene.background=this.skyTexture;this.scene.fog=new THREE.Fog(p.fog,105,310);this.sun.color.set(p.sun);this.scene.children.find(c=>c.isHemisphereLight).color.set(p.ambient);
    this.reflectionTexture=canvasTexture((c,w,h)=>{const sky=c.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#d9edff');sky.addColorStop(.42,'#a4c6d7');sky.addColorStop(.5,'#f7e3bd');sky.addColorStop(.57,'#526b72');sky.addColorStop(1,'#253c4d');c.fillStyle=sky;c.fillRect(0,0,w,h);const glow=c.createRadialGradient(w*.25,h*.3,1,w*.25,h*.3,38);glow.addColorStop(0,'#fff6d9');glow.addColorStop(1,'#fff6d900');c.fillStyle=glow;c.fillRect(0,0,w,h);},256,128);this.reflectionTexture.mapping=THREE.EquirectangularReflectionMapping;this.scene.environment=this.reflectionTexture;this.scene.environmentIntensity=index===2?.48:.65;
    this.asphaltTexture=canvasTexture((c,w,h)=>{c.fillStyle='#'+p.road.toString(16);c.fillRect(0,0,w,h);const rng=window.RallyCore.random(101);for(let i=0;i<4200;i++){c.fillStyle=i%2?'#ffffff06':'#00000008';c.fillRect(rng()*w,rng()*h,2,2);}},512,512);this.asphaltTexture.wrapS=this.asphaltTexture.wrapT=THREE.RepeatWrapping;this.asphaltTexture.anisotropy=Math.min(8,this.renderer.capabilities?.getMaxAnisotropy?.()||1);this.asphaltMaterial=new THREE.MeshStandardMaterial({map:this.asphaltTexture,roughness:index===2?.4:.85,metalness:index===2?.25:.04});
    this.roadTexture=canvasTexture((c,w,h)=>{c.drawImage(this.asphaltTexture.image,0,0,w,h);c.strokeStyle=index===2?'#d6d9ec':'#e8e5d7';c.lineWidth=4;c.beginPath();c.moveTo(13,0);c.lineTo(13,h);c.moveTo(w-13,0);c.lineTo(w-13,h);c.stroke();c.setLineDash([85,75]);c.lineWidth=5;for(let x of[w/3,w*2/3]){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}});
    this.roadTexture.wrapS=this.roadTexture.wrapT=THREE.RepeatWrapping;this.roadTexture.anisotropy=Math.min(8,this.renderer.capabilities?.getMaxAnisotropy?.()||1);let roadMaterial=new THREE.MeshStandardMaterial({map:this.roadTexture,roughness:index===2?.4:.85,metalness:index===2?.25:.04});this.roadMaterial=roadMaterial;
    let ground=mesh(this.world,'box',p.ground,0,-1.1,-125,700,1,600);ground.receiveShadow=true;
    if(index===1){ground.visible=false;this.waterNormal=canvasTexture((c,w,h)=>{c.fillStyle='#8080ff';c.fillRect(0,0,w,h);for(let y=0;y<h;y+=4)for(let x=0;x<w;x+=4){const v=Math.sin(x*.07+Math.sin(y*.08)*2),u=Math.cos(y*.13+Math.sin(x*.04));c.fillStyle=`rgb(${128+Math.round(v*28)},${128+Math.round(u*22)},245)`;c.fillRect(x,y,4,4);}},256,256);this.waterNormal.colorSpace=THREE.NoColorSpace;this.waterNormal.wrapS=this.waterNormal.wrapT=THREE.RepeatWrapping;this.waterNormal.repeat.set(22,22);this.waterMaterial=new THREE.MeshStandardMaterial({color:0x278da6,roughness:.21,metalness:.38,normalMap:this.waterNormal,normalScale:new THREE.Vector2(.45,.45)});let water=mesh(this.world,'box',p.water,0,-3.3,-130,800,.2,700,.26,.4);water.material=this.waterMaterial;water.receiveShadow=false;for(let i=0;i<34;i++)mesh(this.world,'box',0x7acddd,(i%2?-1:1)*(10+i*2),-3.1,-i*14,12,.02,.08,.4,.3);}
    let rng=window.RallyCore.random(921+index);
    for(let i=0;i<19;i++){
      let group=new THREE.Group();let road=new THREE.Mesh(new THREE.PlaneGeometry(10.8,20,1,8).rotateX(-Math.PI/2),roadMaterial);road.position.y=.02;road.receiveShadow=true;group.add(road);const shoulder=new THREE.Mesh(new THREE.PlaneGeometry(10.8,20,1,8).rotateX(-Math.PI/2),this.asphaltMaterial);shoulder.position.y=.02;shoulder.receiveShadow=true;group.add(shoulder);group.userData.roadSurfaces=[road,shoulder];group.userData.flexSurfaces=[road,shoulder];
      for(let side of[-1,1]){
        let roadside=new THREE.Group();
        mesh(roadside,'box',p.rail,side*6,-.16,0,1.2,.5,20.25);mesh(roadside,'box',index===0?0xb6c7c0:0x849da7,side*6.48,.52,0,.12,.28,20.25);
        if(index!==0)for(let z of[-6,6])mesh(roadside,'box',0x879baa,side*6.47,.32,z,.18,.7,.18);
        let decor=new THREE.Group();
        if(index===0){
          let h=5+rng()*15,bw=5+rng()*3,bc=p.buildings[Math.floor(rng()*p.buildings.length)],x=side*(12+rng()*5);mesh(decor,'box',bc,x,h/2,-1,bw,h,8);mesh(decor,'box',0x536b7c,x,h+.3,-1,bw+.12,.45,8.1);
          for(let y=2;y<h-1;y+=2.3)for(let zz of[-3,0,3])mesh(decor,'box',0x536f85,x-side*(bw/2+.015),y,zz,.025,.9,1.2,.45,.3);
          mesh(decor,'box',0x899b9b,x,.24,-1,bw+1,.45,8.8);mesh(decor,'box',0x334f62,x,h+.7,-1,bw*.66,.5,6.6);mesh(decor,'box',0xb8c9c9,x+side, h+1.3,-1,1.4,.8,1.6);
          const face=x-side*(bw/2+.08);mesh(decor,'box',i%2?0x5da9a5:0xd7a779,face,2,-1,.55,.20,7.4);mesh(decor,'box',0x263f51,face,1.1,-1,.035,1.5,6.8);
          for(const z of [-3.5,-1,1.5]){mesh(decor,'box',0xc2d7d8,face-side*.03,1.1,z,.045,1.5,.055);mesh(decor,'box',0xb6d5dd,face-side*.06,3.1,z,.045,.09,1.3);}
          if(h>11){mesh(decor,'box',0xb9cbd0,face-side*.45,5,-1,1,.15,3.6);mesh(decor,'box',0x637e8b,face-side*.93,5.4,-1,.06,.65,3.6);for(const z of [-2.6,.6])mesh(decor,'box',0x637e8b,face-side*.5,5.4,z,.95,.65,.06);}
          mesh(decor,'box',0xb0bcb2,side*10.8,.04,0,4.8,.18,20);for(const z of [-7,6]){mesh(decor,'coach',0xc6bdab,side*10.5,.3,z,1.8,.5,2.2);mesh(decor,'sphere',0x6a9c76,side*10.5,.7,z,1,.55,1.1);for(let k=0;k<3;k++)mesh(decor,'sphere',k%2?0xe7bd89:0xbf8b9c,side*10.5+(k-1)*.45,1,z,.25,.25,.25);}
          for(let z of[-6,6]){let tx=side*(8.3+rng());mesh(decor,'cylinder',0x776454,tx,1.5,z,.17,3,.17);mesh(decor,'sphere',0x4f8e72,tx,3.4,z,1.8,2.1,1.6);mesh(decor,'sphere',0x70ac82,tx+.6,4,z,1.4,1.4,1.2);}
        }else if(index===1){
          if(i%6===1){const bx=side*(27+rng()*7),bz=-4;mesh(decor,'coach',0xe2e9df,bx,-2.65,bz,6.4,.7,2.4);mesh(decor,'coach',0x28576d,bx,-2.25,bz,3.7,.25,1.9);mesh(decor,'coach',0xf3e8ce,bx,-1.8,bz,2.3,.8,1.5);mesh(decor,'cylinder',0x8aa7b5,bx,-.1,bz,.055,5,.055);const sailGeometry=new THREE.BufferGeometry();sailGeometry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,0,4.1,0,0,0,2.9],3));sailGeometry.computeVertexNormals();const sail=new THREE.Mesh(sailGeometry,mat(0xf5ecdc));sail.material.side=THREE.DoubleSide;sail.position.set(bx,-2,bz);decor.add(sail);}
          if(i%4===0){mesh(decor,'box',0xd9e6dc,side*7.7,9,0,1.1,18,1.5);mesh(decor,'box',0xccd9cc,side*7.7,17,0,1.8,.8,2);for(let z of[-8,-4,4,8]){let cable=mesh(decor,'box',0xe7e2d2,side*7.2,8,z,.09,17,.09);cable.rotation.x=z*.11;}}
          if(i%6===0){const x=side*8.2;for(const offset of [-1.2,1.2])mesh(decor,'coach',0xd9e2d6,x+offset,11.8,0,.7,23.6,1.35);mesh(decor,'coach',0xd0dcd2,x,22.8,0,4.4,.65,1.5);mesh(decor,'coach',0x65a9aa,x,20.6,0,4.4,.35,1.5);for(const z of [-22,22]){const cable=mesh(decor,'box',0xbdd9d7,x,10.9,z/2,.11,29,.11);cable.rotation.x=z<0?-.78:.78;}}
          if(i%2===0){const x=side*(14+rng()*8),z=3;mesh(decor,'cylinder',0xa58b66,x,3.6,z,.20,7.2,.20);for(let leaf=0;leaf<7;leaf++){const a=leaf*Math.PI*2/7,l=mesh(decor,'leaf',leaf%2?0x56a883:0x438b73,x+Math.cos(a)*1.3,7+Math.sin(leaf)*.15,z+Math.sin(a)*1.3,2.45,.16,.52);l.rotation.y=-a;l.rotation.z=Math.cos(a)*-.20;}mesh(decor,'sphere',0xb99b69,x,6.7,z,.36,.32,.36);}
          if(i%3===0){let tx=side*(18+rng()*12);mesh(decor,'sphere',0x699b86,tx,-2.8,3,9,3,9);mesh(decor,'cone',0x6fa08a,tx,.1,2,6,4,6);}
        }else{
          let tx=side*(22+rng()*19),h=15+rng()*28;const mountain=mesh(decor,'rock',0x6c8198,tx,h/3-5,0,14,h*.65,18);mountain.rotation.y=rng();mesh(decor,'rock',0xc1d2dd,tx,h*.68-5,0,5,h*.16,6);
          for(let z of[-5,7]){let tx=side*(9.4+rng()*2);mesh(decor,'cylinder',0x635c62,tx,1,z,.19,2,.19);mesh(decor,'cone',0x354f66,tx,2.4,z,1.6,4,1.6);mesh(decor,'cone',0x526b80,tx,3.5,z,1.1,2.5,1.1);}
        }
        if(index===2){mesh(decor,'rock',0x627b8b,side*12.8,.8,-5,2.5,2,3.2);mesh(decor,'rock',0x9fb7c3,side*12.7,2,-5,1.7,.5,2);for(const z of [-6,6]){mesh(decor,'cone',0x779d98,side*15,3.7,z,1.7,3.4,1.7);mesh(decor,'cone',0xc6dbdd,side*15,4.5,z,1.2,2,1.2);}}
        mesh(roadside,'cylinder',0x526c7c,side*6.05,3.4,-7,.075,6.8,.075);mesh(roadside,'box',0x526c7c,side*5.45,6.8,-7,1.3,.1,.1);mesh(roadside,'box',0xffedc2,side*4.9,6.7,-7,.55,.12,.4,.3,.1,index===2?0xffce7c:0);
        mesh(roadside,'box',index===2?0x8ba7d0:0x6b959b,side*6.4,.70,0,.08,.055,20,.25,.25,index===2?0x3d527e:0);
        for(const z of [-7.5,-2.5,2.5,7.5])mesh(roadside,'box',index===0?0xc2b397:0xe0e6df,side*5.43,.045,z,.17,.035,1.6);
        // Paired reflectors and restrained race pennants give the road a rhythm.
        for(const z of [-8,2]){mesh(roadside,'box',index===2?0xa9d9e7:0xf1d69e,side*5.62,.12,z,.12,.06,.32,.3,0,index===2?0x4e7d90:0);}
        if(i%4===0){mesh(roadside,'cylinder',0x637f8c,side*7,3.2,6,.07,6.4,.07);mesh(roadside,'box',index===0?0xdcb46d:index===1?0x55b7b0:0x8e8fca,side*7,5.3,6,1.1,2.1,.04,.7);mesh(roadside,'box',0xe6eadf,side*7,5.3,6.04,.13,1.25,.025);}
        if(index===0){mesh(decor,'coach',0xaebbb1,side*8.8,.28,3,2.1,.5,1.1);mesh(decor,'sphere',0x599376,side*8.8,.6,3,1,.5,.45);}
        const scenery=compact(decor);scenery.position.x=side*13;group.add(scenery);(group.userData.scenery||=[]).push({group:scenery,side});const edge=compact(roadside);group.add(edge);(group.userData.roadside||=[]).push(edge);group.userData.flexSurfaces.push(...edge.children);
      }
      for(const m of group.userData.flexSurfaces){m.userData.flatPositions=m.geometry.attributes.position.array.slice();m.userData.flatNormals=m.geometry.attributes.normal.array.slice();}this.world.add(group);this.segments.push(group);
    }
    let distant=new THREE.Group();for(let i=0;i<16;i++){let h=index===2?40+rng()*40:12+rng()*50;mesh(distant,index===2?'cone':'box',p.buildings[i%5],(i-8)*22,h/2-5,-290,15,h,16);}this.world.add(compact(distant));
    let sunDisk=mesh(this.world,'sphere',index===2?0xe3d8f6:0xffedbc,-65,72,-265,13,13,13,.9,0,index===2?0x959dc7:0xffcb74);sunDisk.material=new THREE.MeshBasicMaterial({color:index===2?0xb6c6ec:0xffe1a1});
    this.clouds=[];for(let i=0;i<9;i++){let cloud=new THREE.Group(),x=(rng()-.5)*230,y=42+rng()*25,z=-60-rng()*170;for(let j=0;j<3;j++)mesh(cloud,'sphere',index===2?0x67728c:0xe6eff2,j*6,Math.sin(j)*2,0,7,3,5);cloud.position.set(x,y,z);this.world.add(cloud);this.clouds.push(cloud);}
    this.clearGate();
  }
  curve(at){return window.RallyCore.courseCurve(this.index,at);}
  heading(at,route){const C=window.RallyCore;return -Math.atan((this.curve(at+1)+C.routeOffset(route,at+1)-this.curve(at-1)-C.routeOffset(route,at-1))/2);}
  prepareCourse(state){
    if(this.courseState===state&&this.courseRevision===state?.taskRevision)return;
    this.courseState=state;this.courseRevision=state?.taskRevision;this.roadReservations=[];this.forkRanges=[];this.apronRanges=[];
    for(const t of state?.tasks||[]){const zone=window.RallyCore.taskZone(t);this.roadReservations.push({start:zone.start-80,end:zone.end+80});this.apronRanges.push({start:zone.start-70,fullStart:zone.start-30,fullEnd:zone.end+25,end:zone.end+80});if(t.kind==='junction')this.forkRanges.push(forkBounds(window.RallyCore.makeRoute(state,t,0,true)));}
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
    if(o.type==='traffic')return this.makeCar([0x628fac,0xed897d,0xc9d5dd,0xaaa0d2,0x92b7a0][o.color]);
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

  update(dt,state,mode='home'){
    const worldDt=dt*(state?.worldTimeScale??1);
    if(!state||!['paused','finished','failed','countdown'].includes(state.status))this.elapsed+=worldDt;this.syncTraffic(state);this.syncRivals(state);
    this.prepareCourse(state);
    const playing=!!state,d=playing?state.distance:(this.showcaseDistance+=dt*6),base=this.curve(d)+window.RallyCore.routeOffset(state?.route,d);
    // Keep each chunk at its course coordinate until it is safely behind the camera.
    const first=Math.floor(d/20)-3,count=this.segments.length;
    for(let i=0;i<count;i++){let n=first+((i-first)%count+count)%count,at=n*20+10,ahead=at-d,g=this.segments[i];g.userData.courseIndex=n;g.position.set(this.curve(at)-base,0,-ahead+4);g.rotation.y=-Math.atan((this.curve(at+10)-this.curve(at-10))/20);// Bend the road and curbs at shared course coordinates, including chunk seams.
      if(g.userData.curveIndex!==n){g.userData.curveIndex=n;const forkNearby=this.forkRanges.some(r=>at>r.start-20&&at<r.end+20);for(const prop of g.userData.scenery||[])prop.group.position.x=prop.side*(forkNearby?20:13);for(const [i,road]of g.userData.roadSurfaces.entries()){road.geometry.dispose();road.geometry=this.mainRoadGeometry(at,i===1);road.userData.flatPositions=road.geometry.attributes.position.array.slice();road.userData.flatNormals=road.geometry.attributes.normal.array.slice();}const angle=g.rotation.y,c=Math.cos(angle),sn=Math.sin(angle);for(const m of g.userData.flexSurfaces){const attr=m.geometry.attributes.position,normal=m.geometry.attributes.normal,flat=m.userData.flatPositions,normals=m.userData.flatNormals;for(let v=0;v<flat.length;v+=3){const z=flat[v+2],xx=flat[v]+this.curve(at-z)-this.curve(at);attr.array[v]=c*xx-sn*z;attr.array[v+2]=sn*xx+c*z;const nx=normals[v],ny=normals[v+1],nz=normals[v+2]+(this.curve(at-z+.1)-this.curve(at-z-.1))/.2*nx,len=Math.hypot(nx,ny,nz)||1;normal.array[v]=(c*nx-sn*nz)/len;normal.array[v+1]=ny/len;normal.array[v+2]=(sn*nx+c*nz)/len;}attr.needsUpdate=true;normal.needsUpdate=true;m.geometry.computeBoundingSphere();}}
      const reserved=this.roadReservations.some(r=>at>r.start&&at<r.end);for(const edge of g.userData.roadside||[])edge.visible=!reserved;}
    const frozen=state&&['paused','finished','failed','countdown'].includes(state.status);
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
