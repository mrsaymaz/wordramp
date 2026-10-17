const fs=require('node:fs');const assert=require('node:assert/strict');
global.window={devicePixelRatio:2,addEventListener(){}};global.innerWidth=390;global.innerHeight=844;
const noop=()=>{};const gradient={addColorStop:noop};const context=new Proxy({}, {get:(t,k)=>['createRadialGradient','createLinearGradient'].includes(k)?()=>gradient:noop,set:()=>true});
global.document={createElement:()=>({width:0,height:0,getContext:()=>context}),dispatchEvent:noop};
require('../dist/match-bank.js');require('../dist/repair-bank.js');require('../dist/emoji-bank.js');require('../dist/game-core.js');require('../dist/language-bank.js');
const {RallyScene}=require('./scene-compiled.cjs');
let renderedSize;
const renderer={setPixelRatio:noop,setSize:(w,h)=>renderedSize=[w,h],shadowMap:{},domElement:{addEventListener:noop},render(scene,camera){scene.updateMatrixWorld();camera.updateMatrixWorld();}};
const container={append:noop};let scene=new RallyScene(container,renderer),C=window.RallyCore;
let meshes=0,positions=0;
for(let arena=0;arena<3;arena++){
  scene.setup(arena);let s=C.createRace(window.LANGUAGE_BANK[0].units[0],'challenge',arena,35);
  for(let f=0;f<120;f++)scene.update(1/60,null,'home');
  assert(scene.camera.position.y>5);assert.equal(scene.segments.length,19);
  s.status='driving';
  for(const task of s.tasks){s.distance=task.at;s.task=task;s.status='task';scene.update(.05,s,'race');assert.equal(scene.lastGate,task.id);assert(scene.gate.visible);assert.equal(scene.gate.position.z,4);if(task.kind==='repair'){assert.equal(scene.repairSlabs.length,task.blocks.length);task.chosen=task.blocks.map((_,i)=>i);task.solved=true;for(let i=0;i<60;i++)scene.update(.05,s,'race');assert(scene.repairSlabs.every(m=>m.position.y>.1));}s.task=null;s.taskIndex++;}
  s.status='driving';s.task=null;s.distance=19.9;scene.update(.01,s,'race');let previous=scene.segments.map(g=>({n:g.userData.courseIndex,z:g.position.z}));s.distance=20.1;scene.update(.01,s,'race');let recycled=0;scene.segments.forEach((g,i)=>{if(g.userData.courseIndex!==previous[i].n){recycled++;assert(previous[i].z>60,'Only chunks behind the camera may recycle');assert(g.position.z<-290,'Recycled chunks must enter beyond the fog');}else assert(Math.abs(g.position.z-previous[i].z-.2)<1e-8,'Visible scenery must advance smoothly across chunk boundaries');});assert.equal(recycled,1,'One chunk recycles; the visible world must not jump');
  s.status='task';s.task=s.tasks[0];s.task.rowIndex=0;s.distance=s.task.at-40;scene.update(.05,s,'race');let signs=scene.roadProjection();assert.equal(signs.answers.length,3);assert(signs.answers.every(a=>Number.isFinite(a.x)&&Number.isFinite(a.y)));
  s.status='finished';s.task=null;s.distance=s.arena.length;scene.update(.05,s,'race');assert.equal(scene.lastGate,'finish');assert.equal(scene.gate.position.z,4);
  scene.scene.traverse(o=>{assert([o.position.x,o.position.y,o.position.z,o.scale.x,o.scale.y,o.scale.z].every(Number.isFinite));if(o.isMesh){meshes++;for(let n of o.geometry.attributes.position.array){positions++;assert(Number.isFinite(n),'Every geometry vertex must be finite');}}});
}
for(const [w,h]of [[390,844],[390,672],[320,396],[844,312],[568,242],[844,390],[320,568],[1440,900]]){
  global.innerWidth=w;global.innerHeight=h;scene.resize();
  for(const lane of [-1,0,1]){const s=C.createRace(window.LANGUAGE_BANK[0].units[0]);s.status='task';s.task=s.tasks[0];s.distance=s.task.at-35;s.lane=lane;for(let i=0;i<180;i++)scene.update(1/60,s,'race');const b=scene.carScreenBounds();assert(b);const x=(b.left+b.right)/2,y=(b.top+b.bottom)/2;assert(x>0&&x<w&&y>0&&y<h,'The car must remain visible and touchable in every lane / screen shape');assert(scene.isCarHit(x,y));assert(!scene.isCarHit(-500,-500));}
}
// Browser chrome can shrink the canvas while the layout/window metrics stay large.
global.innerWidth=390;global.innerHeight=844;container.clientWidth=390;container.clientHeight=672;scene.resize();assert.deepEqual(renderedSize,[390,672]);assert.equal(scene.camera.aspect,390/672);
for(const height of [672,396,788]){
 container.clientHeight=height;scene.resize();assert.deepEqual(renderedSize,[390,height]);assert.equal(scene.camera.aspect,390/height);
 const s=C.createRace(window.LANGUAGE_BANK[0].units[0]);s.status='task';s.task=s.tasks[0];s.distance=s.task.at-35;
 for(let i=0;i<180;i++)scene.update(1/60,s,'race');
 const bounds=scene.carScreenBounds(),x=(bounds.left+bounds.right)/2,y=(bounds.top+bounds.bottom)/2;assert(x>0&&x<390&&y>0&&y<height);assert(scene.isCarHit(x,y),'Rendered car and touch coordinates follow the shortened game area');
 assert.equal(scene.roadProjection().answers.length,3);assert(scene.roadProjection().answers.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
}
delete container.clientWidth;delete container.clientHeight;scene.resize();
console.log('PASS: shortened browser viewports resize the 3D camera, projections and car touch targets independently of innerHeight.');
scene.setup(0);scene.clearGate();
let persist=C.createRace(window.LANGUAGE_BANK[0].units[0],'challenge',0,13);persist.status='task';persist.task=persist.tasks[1];persist.taskIndex=1;persist.distance=persist.task.at-30;
scene.update(.05,persist,'race');const oldGate=scene.gates.get(persist.task.id),textures=oldGate.userData.textures.slice();
const gateZ=oldGate.position.z;C.connectRepair(persist,[0,1,2]);scene.update(.05,persist,'race');
assert.equal(scene.gates.get(persist.task.id),oldGate,'A completed checkpoint stays on the road');assert(oldGate.userData.repairSlabs.every(m=>m.position.y===.12),'Every slab repairs immediately');assert(oldGate.userData.barriers.every(m=>!m.visible));
persist.distance+=2;scene.update(.05,persist,'race');assert(Math.abs(oldGate.position.z-gateZ-2)<1e-8);assert.deepEqual(oldGate.userData.textures,textures);
persist.status='driving';persist.task=null;scene.update(.05,persist,'race');assert.equal(scene.gates.get(persist.tasks[1].id),oldGate,'Preparing a later gate cannot replace a visible old gate');
persist.distance=persist.tasks[1].at+181;scene.update(.05,persist,'race');assert(!scene.gates.has(persist.tasks[1].id),'Only checkpoints behind the camera can be removed');
// A review must be built before it enters view, and cannot rewrite a visible
// gate, even if that gate is still far beyond the UI question trigger.
const adaptive=C.createRace(window.LANGUAGE_BANK[0].units[0],'challenge',0,13);adaptive.status='task';adaptive.task=adaptive.tasks[0];adaptive.distance=adaptive.task.at-.01;adaptive.obstacles=[];adaptive.rivals=[];
const visible=adaptive.tasks[4];visible.at=adaptive.distance+450;visible.rows[0].at=visible.endAt=visible.at;
scene.clearGate();scene.update(.05,adaptive,'race');const visibleGate=scene.gates.get(visible.id),oldDistant=adaptive.tasks[8];assert(visibleGate.visible);
adaptive.lane=(adaptive.task.correctIndex+1)%3-1;C.tick(adaptive,.05,adaptive.lane);const review=adaptive.tasks.find(t=>t.reviewOf);assert(review);assert(review.at-adaptive.distance>C.TASK_VIEW_DISTANCE+40);scene.update(.05,adaptive,'race');
assert.equal(adaptive.tasks[4],visible);assert.equal(scene.gates.get(visible.id),visibleGate);assert(!scene.gates.has(oldDistant.id));assert(scene.gates.has(review.id),'An unseen adaptive review needs its own prepared 3D gate');assert(!scene.gates.get(review.id).visible);
let pedestrians=C.createRace(window.LANGUAGE_BANK[0].units[0]);pedestrians.status='task';pedestrians.task=pedestrians.tasks[3];pedestrians.taskIndex=3;pedestrians.distance=pedestrians.task.at-60;scene.clearGate();scene.update(.05,pedestrians,'race');
const people=scene.gates.get(pedestrians.task.id).userData.people.slice();assert.equal(people.length,4);assert(people.every(m=>Math.abs(m.position.x)===8.4),'Visitors wait on the sidewalks before the crossing activates');pedestrians.task.activatedAt=0;pedestrians.task.peopleEntryAt=0;pedestrians.elapsed=.6;scene.update(.05,pedestrians,'race');assert(people.every(m=>Math.abs(Math.abs(m.position.x)-4.2)<1e-7),'Visitors walk into the road continuously');pedestrians.elapsed=1.2;scene.update(.05,pedestrians,'race');assert(people.every(m=>Math.abs(m.position.x)<1e-8));assert.equal(scene.pedestrianProjection(pedestrians).length,4);
pedestrians.task.activatedAt=0;pedestrians.task.peopleEntryAt=0;pedestrians.elapsed=2;C.sortPerson(pedestrians,pedestrians.task.people[0].side);C.tick(pedestrians,.1);scene.update(.1,pedestrians,'race');assert.equal(scene.gates.get(pedestrians.task.id).userData.people[0],people[0]);assert(Math.abs(people[0].position.x)>0);assert.equal(scene.gates.get(pedestrians.task.id).userData.people[1],people[1],'The next word has its own pedestrian model');
let drive=C.createRace(window.LANGUAGE_BANK[0].units[0]);drive.status='driving';scene.currentLane=0;scene.update(.05,drive,'race');
const wheels=scene.player.userData.wheels,lamps=scene.player.userData.brakeLights;assert.equal(wheels.length,4);assert.equal(lamps.length,2);
drive.distance=2;scene.update(.05,drive,'race');const spin=wheels[0].userData.spin.rotation.x;assert(spin!==0,'Player wheels turn with actual road travel');assert(lamps.every(n=>n.material.color.getHex()===0x873943),'Cruising uses dim tail lights');
drive.lane=1;drive.distance+=1;scene.update(.05,drive,'race');assert(wheels.filter(n=>n.userData.front).every(n=>n.rotation.y<0),'Front wheels steer into the lane change');assert(wheels.filter(n=>!n.userData.front).every(n=>n.rotation.y===0),'Rear wheels keep their axle direction');assert(scene.player.rotation.z>0,'The body leans as it changes lanes');
for(let i=0;i<25;i++){drive.distance+=1;scene.update(.05,drive,'race');}assert(scene.currentLane>.999);assert(Math.abs(scene.player.rotation.z)<.001);assert(Math.abs(wheels[0].rotation.y)<.001,'Steering settles when the lane change finishes');
drive.speedFactor=.1;drive.distance+=.1;scene.update(.05,drive,'race');assert(lamps.every(n=>n.material.color.getHex()===0xff6564),'Deceleration brightens both brake lamps');
drive.speedFactor=0;scene.update(.05,drive,'race');assert.equal(scene.player.position.y,.04,'A stopped car does not vibrate as if it is moving');const stoppedSpin=wheels[0].userData.spin.rotation.x;scene.update(.05,drive,'race');assert.equal(wheels[0].userData.spin.rotation.x,stoppedSpin,'Stopped wheels do not rotate');
const visualSnapshot=()=>JSON.stringify({player:scene.player.position.toArray(),rotation:scene.player.rotation.toArray(),wheels:wheels.map(n=>[n.rotation.y,n.userData.spin.rotation.x]),camera:scene.camera.position.toArray(),angle:scene.camera.quaternion.toArray(),fov:scene.camera.fov});
const frozen=visualSnapshot();drive.status='paused';scene.update(.1,drive,'race');assert.equal(visualSnapshot(),frozen,'Pause freezes the car, steering, suspension and camera');
drive.status='driving';drive.speedFactor=1;const npc=scene.traffic.find(n=>n.userData.obstacle.type==='traffic'),o=npc.userData.obstacle;o.braking=true;scene.update(.05,drive,'race');assert(npc.userData.brakeLights.every(n=>n.material.color.getHex()===0xff6564),'Queued NPC traffic has working brake lights');const npcSpin=npc.userData.wheels[0].userData.spin.rotation.x;o.at+=1;o.braking=false;scene.update(.05,drive,'race');assert.notEqual(npc.userData.wheels[0].userData.spin.rotation.x,npcSpin,'NPC wheels also follow travel');assert(npc.userData.brakeLights.every(n=>n.material.color.getHex()===0x873943));
scene.setCosmetics({color:0x7973b5,badge:3,trail:true});let painted=0;scene.player.traverse(m=>{if(m.userData.paint){painted++;assert.equal(m.material.color.getHex(),0x7973b5);}});assert(painted>0);assert(scene.hoodBadge.visible&&scene.badgeStar.visible);assert(scene.badgeStar.geometry.attributes.position.array.every(Number.isFinite));
let routing=C.createRace(window.LANGUAGE_BANK[0].units[0],'challenge',0,11);routing.status='driving';routing.taskIndex=3;const junction=routing.tasks[2];junction.completed=true;junction.completedAt=0;junction.chosenIndex=junction.correctIndex;scene.clearGate();
for(let lane=-1;lane<=1;lane++){
 const route=C.makeRoute(routing,junction,lane+1,lane+1===junction.correctIndex);routing.route=route;routing.lane=lane;routing.distance=route.start;for(let i=0;i<60;i++)scene.update(1/60,routing,'race');
 routing.distance=(route.start+route.end)/2;routing.roadTravel+=20;scene.update(.05,routing,'race');const g=scene.gates.get(junction.id),paths=g.userData.routePaths;assert.equal(paths.length,3);const path=paths[lane+1],a=path.left.geometry.attributes.position.array,b=path.right.geometry.attributes.position.array,offset=24*18,center=(a[offset]+a[offset+3]+b[offset]+b[offset+3])/4+g.position.x;assert(Math.abs(center-lane*3.35)<1e-5,'The chosen branch stays under the car as the world follows the route');assert(Math.abs(a[offset+2]+g.position.z-4)<1e-5,'Route course coordinates meet the player at the same longitudinal origin');assert.equal(g.userData.forkSurface.position.y,.02,'Fork and main road have the same asphalt height');const bounds=scene.carScreenBounds();assert(bounds&&Number.isFinite(bounds.left)&&Number.isFinite(bounds.bottom));
}
assert.equal(scene.rivalCars.length,2);const identities=scene.rivalCars.slice();routing.distance+=1;routing.rivals.forEach(r=>r.at+=1);scene.update(.05,routing,'race');assert.deepEqual(scene.rivalCars,identities,'Racing cars retain their models as they move');assert.equal(scene.rivalProjection().length,2);
const rivalModel=scene.rivalCars[0],rival=rivalModel.userData.rival;rival.nitroActive=true;rival.plannedLane=0;rival.lane=-1;rival.lanePos=-1;routing.elapsed=0;scene.update(.05,routing,'race');assert(rivalModel.userData.nitroExhaust.visible,'A rival’s active boost has a visible exhaust');assert(rivalModel.userData.indicators.some(m=>m.visible&&m.userData.indicator===1),'Rival lane-change intent has a visible signal before steering');rival.nitroActive=false;rival.plannedLane=null;scene.update(.05,routing,'race');assert(!rivalModel.userData.nitroExhaust.visible);
routing.nitroActive=true;routing.roadTravel+=1;scene.update(.05,routing,'race');assert(scene.exhaust.visible);assert(scene.trail.children.every(p=>p.visible));routing.nitroActive=false;scene.update(.05,routing,'race');assert(!scene.exhaust.visible);assert(scene.trail.children.every(p=>p.visible),'An earned trail stays available outside nitro');
scene.setCosmetics({color:0xf3bc55,badge:0,trail:false});scene.update(.05,routing,'race');assert(!scene.hoodBadge.visible&&!scene.badgeStar.visible);assert(scene.trail.children.every(p=>!p.visible));
console.log(`PASS: three 3D environments, road sign projections, bridge assembly, persistent checkpoint identities, instant road repairs, pedestrian models, finish gates and smooth chunk recycling; ${meshes} meshes / ${positions} finite coordinates. Player/NPC wheel travel, front steering, brake lamps, stopped suspension and frozen camera verified. A single continuous fork surface and three route guides align under the car; two stable rival models, projected labels, paint, mastery badges, trails and nitro exhaust verified. Renderer was mocked: this is geometry QA, not a browser or visual check.`);
// Road endpoints must meet exactly, including the steepest parts of all curves.
for(let arena=0;arena<3;arena++){
 scene.setup(arena);const s=C.createRace(window.LANGUAGE_BANK[0].units[0],'challenge',arena,9);s.status='driving';
 for(const distance of [0,159.9,160.1,408,740,1100]){
  s.distance=distance;scene.update(.016,s,'race');scene.scene.updateMatrixWorld(true);
  const chunks=[...scene.segments].sort((a,b)=>a.userData.courseIndex-b.userData.courseIndex);
  for(let i=1;i<chunks.length;i++){
   const a=chunks[i-1].userData.flexSurfaces[0],b=chunks[i].userData.flexSurfaces[0];
   const endpoints=(m,z)=>{const arr=m.geometry.attributes.position.array,flat=m.userData.flatPositions,out=[];for(let k=0;k<flat.length;k+=3)if(Math.abs(flat[k+2]-z)<.001){const point=m.position.clone().set(arr[k],arr[k+1],arr[k+2]);m.localToWorld(point);out.push(point);}return out.sort((a,b)=>a.x-b.x);};
   const edgeA=endpoints(a,-10),edgeB=endpoints(b,10);assert.equal(edgeA.length,2);assert.equal(edgeB.length,2);for(let j=0;j<2;j++)assert(edgeA[j].distanceTo(edgeB[j])<.00002,'Road pieces meet without a visible crack or step');
  }
 }
}
scene.setPreferences({graphics:'battery',reduced:true});assert.equal(renderer.shadowMap.enabled,false);scene.setPreferences({graphics:'auto',reduced:false});assert.equal(renderer.shadowMap.enabled,true);
const grid=C.createRace(window.LANGUAGE_BANK[0].units[0]);scene.camera.position.set(-7,8,17);const x=scene.camera.position.x;scene.update(.05,grid,'race');assert(scene.camera.position.x>x,'Camera settles into the driving view during the starting lights');grid.status='driving';grid.speedFactor=1.9;scene.setPreferences({graphics:'auto',reduced:true});for(let i=0;i<180;i++)scene.update(1/60,grid,'race');assert(Math.abs(scene.camera.fov-52)<.001,'Reduced motion removes speed zoom');assert.equal(scene.player.rotation.x,0);assert.equal(scene.player.rotation.z,0);assert.equal(scene.player.position.y,.04);assert(scene.trail.children.every(p=>!p.visible));
console.log('PASS: continuous road endpoints in all arenas, camera launch transition, reduced-motion camera/body, and battery-saver shadow controls.');

const charged=C.createRace(window.LANGUAGE_BANK[0].units[0],'challenge',0,4,{fuel:60});charged.status='driving';scene.setPreferences({graphics:'auto',reduced:false});scene.update(.05,charged,'race');assert(scene.nitroReadyGlow.visible);assert.equal(scene.nitroReadyGlow.position.x,scene.player.position.x);assert(C.activateNitro(charged));scene.update(.05,charged,'race');assert(scene.nitroReadyGlow.visible,'A saved charge keeps its invitation');C.engageNitro(charged);C.tick(charged,.05);scene.update(.05,charged,'race');assert(!scene.nitroReadyGlow.visible,'The ready glow ends while a charge is being used');charged.nitro=0;charged.status='task';charged.task=charged.tasks[0];scene.update(.05,charged,'race');assert(!scene.nitroReadyGlow.visible,'No Nitro invitation during an English task');console.log('PASS: charged-car halo follows the car and hides during boost / English tasks.');

// Check cutouts while forks are in view, including shoulder triangles.
let cutChunks=0;
for(let arena=0;arena<3;arena++){
 scene.setup(arena);const s=C.createRace(window.LANGUAGE_BANK[0].units[0],'challenge',arena,17);
 scene.clearGate();scene.update(.016,s,'race');assert.equal(scene.gates.size,s.tasks.length+1,'Starting lights prepare every checkpoint before driving');
 const identities=new Map(scene.gates);
 for(const task of s.tasks.filter(t=>t.kind==='junction')){
  const route=C.makeRoute(s,task,task.correctIndex,true);s.distance=route.start+45;s.status='driving';scene.update(.016,s,'race');
  assert.equal(scene.gates.get(task.id),identities.get(task.id),'A fork model is reused when approached');
  for(const g of scene.segments){
   const at=g.userData.courseIndex*20+10;
   if(at>route.start&&at<route.end){cutChunks++;assert.equal(g.userData.roadSurfaces[0].geometry.index.count,0);assert.equal(g.userData.roadSurfaces[1].geometry.index.count,0);}
   for(const road of g.userData.roadSurfaces){const p=road.userData.flatPositions,idx=road.geometry.index.array;for(let i=0;i<idx.length;i+=3){const course=at-(p[idx[i]*3+2]+p[idx[i+1]*3+2]+p[idx[i+2]*3+2])/3;assert(!scene.forkRanges.some(r=>course>r.start&&course<r.end),'Normal road and shoulders never draw below fork asphalt');}}
  }
  for(const bound of [route.start-30,route.end+40])assert(Math.abs(scene.apronWidth(bound)-11.55)<1e-8,'Fork edges meet full-width task shoulders');
 }
}
assert(cutChunks>20);console.log(`PASS: ${cutChunks} fork chunks with no duplicate underlying asphalt, exact shoulder widths and prepared checkpoint identities.`);

// Three boost stages alter effects, but never the physical car's touch bounds.
const overdrive=C.createRace(window.LANGUAGE_BANK[0].units[0],'challenge',0,5,{fuel:100,rivals:false});overdrive.status='driving';overdrive.tasks=[];overdrive.obstacles=[];C.setNitroHeld(overdrive,true);scene.setup(0);scene.setPreferences({graphics:'auto',reduced:false});scene.update(.016,overdrive,'race');
const hitSize=scene.player.userData.hitBounds.getSize(scene.player.position.clone());
for(let level=1;level<=3;level++){
 assert(C.activateNitro(overdrive));C.tick(overdrive,.016);scene.update(.016,overdrive,'race');
 assert.equal(scene.boostFx.level,level);assert(scene.exhaust.visible);assert(scene.boostFx.aura.visible);assert(scene.boostFx.wake.visible);assert(scene.boostFx.rings.some(r=>r.visible));
 assert.deepEqual(scene.player.userData.hitBounds.getSize(scene.player.position.clone()).toArray(),hitSize.toArray(),'Boost visuals never expand the car touch area');
 for(const jet of scene.boostFx.jets)assert(jet.scale.y>0&&jet.scale.y<1.1);
}
scene.setPreferences({graphics:'battery',reduced:true});scene.update(.016,overdrive,'race');assert(scene.exhaust.visible);assert(!scene.boostFx.wake.visible);assert(scene.boostFx.rings.every(r=>!r.visible));assert.equal(scene.player.rotation.x,0);assert.equal(scene.player.rotation.z,0);
C.pause(overdrive);const phase=scene.boostFx.burstAge;scene.update(.1,overdrive,'race');assert.equal(scene.boostFx.burstAge,phase);assert(!scene.exhaust.visible);assert(!scene.boostFx.aura.visible);
console.log('PASS: three distinct Nitro stages, exhaust/aura/wake/launch rings, stable touch bounds, reduced-motion/battery effects and frozen pause state.');

// Repair focus dilates world animation while the dashboard engine is steady.
const focus=C.createRace(window.LANGUAGE_BANK[0].units[0],'relaxed',0,17,{fuel:100,rivals:false});focus.status='driving';focus.taskIndex=1;focus.distance=focus.tasks[1].at-70;focus.speedFactor=C.REGULAR_MAX_SPEED;focus.obstacles=[];
scene.setup(0);scene.setPreferences({graphics:'auto',reduced:false});scene.update(.016,focus,'race');
const spectatorUpdate=scene.spectators.update.bind(scene.spectators);let spectatorDt=0;scene.spectators.update=(dt,...args)=>{spectatorDt=dt;return spectatorUpdate(dt,...args);};
for(let i=0;i<45;i++){C.tick(focus,1/60,0);const age=scene.elapsed;scene.update(1/60,focus,'race');assert(Math.abs(scene.elapsed-age-focus.worldTimeScale/60)<1e-9);assert(Math.abs(spectatorDt-focus.worldTimeScale/60)<1e-12);assert.equal(focus.speedFactor,C.REGULAR_MAX_SPEED);}
assert(focus.worldTimeScale<.2);assert(!scene.exhaust.visible);assert(scene.player.userData.brakeLights.every(n=>n.material.color.getHex()===0x873943),'Focus is time dilation rather than brake-lamp deceleration');
const heldWheel=scene.player.userData.wheels[0].userData.spin.rotation.x;C.pause(focus);const focusAge=scene.elapsed;scene.update(.1,focus,'race');assert.equal(scene.elapsed,focusAge);assert.equal(scene.player.userData.wheels[0].userData.spin.rotation.x,heldWheel);C.resume(focus);
assert(C.connectRepair(focus,[0,1,2]));scene.update(.016,focus,'race');assert(scene.gates.get(focus.tasks[1].id).userData.repairSlabs.every(m=>m.position.y===.12),'Repair visuals complete before the time scale recovers');
for(let i=0;i<100;i++){C.tick(focus,1/60,0);scene.update(1/60,focus,'race');}
assert.equal(focus.worldTimeScale,1);assert(!C.repairCruise(focus));scene.spectators.update=spectatorUpdate;
console.log('PASS: repair entry speed, world/spectator animation dilation, steady tail lights, frozen Pause, immediate construction and smooth normal-time handoff. Renderer mocked.');

for(let arena=0;arena<3;arena++){
 const s=C.createRace(window.LANGUAGE_BANK[0].units[0],'challenge',arena,17,{rivals:false}),t=s.tasks[3];s.status='driving';s.taskIndex=3;s.distance=t.at-150;s.speedFactor=C.REGULAR_MAX_SPEED;s.obstacles=[];scene.setup(arena);
 for(let i=0;i<30;i++){C.tick(s,.05,0);scene.update(.05,s,'race');}
 assert(C.focusCruise(s));assert(!C.repairCruise(s));assert(s.worldTimeScale<.2);assert(C.pedestrianReady(s));
 const p=scene.pedestrianProjection(s)[0];assert(p.visible&&Number.isFinite(p.x)&&Number.isFinite(p.y),'The active word carrier is projected during the early moving approach');
 for(let i=0;i<180&&s.status==='task';i++){if(C.pedestrianReady(s)&&!t.pedWait)C.sortPerson(s,t.people[t.personIndex].side);C.tick(s,.05,0);scene.update(.05,s,'race');}
 assert(t.completed);assert(s.distance<t.stopAt);assert(!C.crosswalkOccupied(s,t));assert.equal(s.speedFactor,C.REGULAR_MAX_SPEED);
}
console.log('PASS: all three arenas project pedestrian word carriers during early focus cruise; sorting clears the crossing before arrival. Renderer mocked.');

// Damage changes the actual player model and resets when the race identity changes.
const damaged=C.createRace(window.LANGUAGE_BANK[0].units[0],'challenge',0,96,{rivals:false});damaged.status='driving';damaged.tasks=[];damaged.obstacles=[];
scene.setup(0);scene.setPreferences({graphics:'auto',reduced:false});scene.update(.016,damaged,'race');
const fx=scene.damageFx,originalBody=fx.deformable.map(d=>d.mesh.geometry.attributes.position.array.slice()),originalHitSize=scene.player.userData.hitBounds.getSize(scene.player.position.clone()).toArray();
assert(!fx.cracks.visible&&!fx.hood.visible&&!fx.loosePanel.visible);
assert(C.contactBump(damaged));scene.update(.016,damaged,'race');assert.equal(fx.stage,1);assert(fx.cracks.visible&&fx.scrapes.visible);assert(!fx.hood.visible);assert(scene.player.visible,'Impact protection keeps the damaged car visible');assert(fx.protection.visible);assert(fx.sparks.some(p=>p.mesh.visible));
assert(fx.deformable.some((d,i)=>d.mesh.geometry.attributes.position.array.some((v,j)=>v!==originalBody[i][j])),'A hit dents the original painted geometry');
damaged.invulnerable=0;assert(C.contactBump(damaged));
for(let i=0;i<30;i++){C.tick(damaged,1/60,0);scene.update(1/60,damaged,'race');}
assert.equal(fx.stage,2);assert(fx.hood.visible&&fx.engineBay.visible&&fx.loosePanel.visible);assert(fx.smoke.some(p=>p.mesh.visible));assert(fx.hood.rotation.x>0&&fx.hood.rotation.x<.25);
fx.hood.updateMatrixWorld(true);const hoodPoint=scene.player.position.clone();
for(let i=0;i<fx.hoodPanel.geometry.attributes.position.count;i++){hoodPoint.fromBufferAttribute(fx.hoodPanel.geometry.attributes.position,i).applyMatrix4(fx.hoodPanel.matrixWorld);assert(hoodPoint.y<1.55,'The loose bonnet stays below the roof / camera sightline');}
assert.deepEqual(scene.player.userData.hitBounds.getSize(scene.player.position.clone()).toArray(),originalHitSize,'Damage never expands or steals the driving touch target');
scene.setCosmetics({color:0x60a8b2,badge:2,trail:false});assert.equal(fx.hoodPanel.material.color.getHex(),0x60a8b2,'Loose panels retain the chosen team paint');
C.pause(damaged);const smokeBefore=fx.smoke.map(p=>[p.life,...p.mesh.position.toArray()]);scene.update(.1,damaged,'race');assert.deepEqual(fx.smoke.map(p=>[p.life,...p.mesh.position.toArray()]),smokeBefore,'Pause freezes all damage particles');C.resume(damaged);
scene.setPreferences({graphics:'battery',reduced:true});scene.update(.016,damaged,'race');assert(fx.cracks.visible&&fx.hood.visible);assert(fx.smoke.every(p=>!p.mesh.visible)&&fx.sparks.every(p=>!p.mesh.visible),'Reduced motion retains damage cues without particles or shaking');
scene.setPreferences({graphics:'auto',reduced:false});damaged.invulnerable=0;assert(C.contactBump(damaged));
for(let i=0;i<72;i++){C.tick(damaged,1/60,0);scene.update(1/60,damaged,'race');}
assert.equal(damaged.status,'failed');assert.equal(fx.stage,3);assert(!fx.protection.visible);assert(fx.smoke.some(p=>p.mesh.visible));
for(const p of [...fx.smoke,...fx.sparks])assert([...p.mesh.position.toArray(),...p.mesh.scale.toArray()].every(Number.isFinite));
const repaired=C.createRace(window.LANGUAGE_BANK[0].units[0]);scene.update(.016,repaired,'race');assert.equal(fx.stage,0);assert(!fx.cracks.visible&&!fx.hood.visible&&!fx.loosePanel.visible);assert(fx.smoke.every(p=>!p.mesh.visible)&&fx.sparks.every(p=>!p.mesh.visible));fx.deformable.forEach((d,i)=>assert.deepEqual(d.mesh.geometry.attributes.position.array,originalBody[i],'Retry restores the original mesh exactly'));
scene.update(.016,null,'home');assert.equal(fx.stage,0);assert(!fx.protection.visible);
console.log('PASS: visible cracked glass, deformed paint, hinged bonnet below the roof, loose panel, smoke/spark pools, team paint, stable touch bounds, protected-car halo, reduced motion, frozen Pause/breakdown and exact retry/garage restoration. Geometry QA with a mocked renderer.');

const sideSwipe=C.createRace(window.LANGUAGE_BANK[0].units[0],'challenge',0,97,{rivals:false});sideSwipe.status='driving';sideSwipe.tasks=[];sideSwipe.lane=1;sideSwipe.obstacles=[{id:0,at:0,lane:1,lanePos:1,type:'barrier',speed:0,cruiseSpeed:0}];scene.currentLane=0;
for(let i=0;i<30;i++)scene.update(.05,sideSwipe,'race');
assert.equal(sideSwipe.collisions,1,'The real steering adapter must report a side impact');assert(sideSwipe.damageContacts.includes(sideSwipe.obstacles[0]),'The adapter passes the exact blocking actor');sideSwipe.invulnerable=0;sideSwipe.elapsed+=3;
for(let i=0;i<60;i++)scene.update(.05,sideSwipe,'race');
assert.equal(sideSwipe.collisions,1,'Repeated steering into the same actor remains a single scrape after grace expires');assert(C.playerLaneClear(sideSwipe,scene.currentLane,-1),'A damaged player can still steer into the clear escape lane');
console.log('PASS: real scene steering reports an identified side collision once, keeps bodies separated and leaves the escape lane available.');
