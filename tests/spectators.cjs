const assert=require('node:assert/strict'),THREE=require('three');
global.window={};for(const f of ['language-bank','repair-bank','match-bank','game-core'])require('../dist/'+f+'.js');
const C=window.RallyCore,{RaceSpectators,STAND_OFFSET}=require('./spectators-compiled.cjs'),u=window.LANGUAGE_BANK[0].units[0];
const scene=new THREE.Scene(),crowd=new RaceSpectators(scene),identities=crowd.stands.map(s=>s.group),prefs={graphics:'auto',reduced:false};let checks=0,recycles=0;
for(let arena=0;arena<3;arena++){
 const s=C.createRace(u,'relaxed',arena,5);s.status='driving';const curve=at=>C.courseCurve(arena,at);
 for(let d=0;d<s.arena.length+150;d+=5){
  const before=crowd.state===s?crowd.stands.map(st=>({id:st.station,at:crowd.stations[st.station]?.at})):[];
  crowd.update(1/60,s,arena,d,curve(d),curve,prefs,false);assert.deepEqual(crowd.stands.map(st=>st.group),identities,'Crowd models persist for the whole game');
  crowd.stands.forEach((stand,i)=>{if(before[i]?.id>=0&&before[i].id!==stand.station){assert(before[i].at<d-95,'A visible stand cannot teleport to another station');recycles++;}if(!stand.group.visible)return;const station=crowd.stations[stand.station];assert(Math.abs(stand.group.position.x-(curve(station.at)-curve(d)+station.side*STAND_OFFSET))<1e-9);assert.equal(stand.bodies.count,8);
   // Check actual instanced fan transforms against the road, including curve.
   stand.group.updateMatrixWorld(true);const local=new THREE.Matrix4(),world=new THREE.Matrix4(),pos=new THREE.Vector3();
   for(let fan=0;fan<8;fan++){stand.bodies.getMatrixAt(fan,local);world.multiplyMatrices(stand.bodies.matrixWorld,local);pos.setFromMatrixPosition(world);const at=d+4-pos.z,x=pos.x+curve(d)-curve(at);assert(C.roadSpans(s,at).every(([left,right])=>x<left-1.5||x>right+1.5),'Fans stay behind the barriers, outside every asphalt surface');checks++;}
  });
 }
 const station=crowd.stations[4];crowd.update(.016,s,arena,station.at,curve(station.at),curve,prefs,false);const visible=crowd.stands.filter(st=>st.group.visible);assert(visible.some(st=>st.lastCheer>.8),'Spectators react to a nearby racer');
 const snapshot=()=>visible.map(st=>JSON.stringify({fans:[...st.arms.instanceMatrix.array],heads:[...st.heads.instanceMatrix.array],flag:[...st.flags[0].geometry.attributes.position.array]}));const frozen=snapshot();s.status='paused';crowd.update(.1,s,arena,station.at,curve(station.at),curve,prefs,true);assert.deepEqual(snapshot(),frozen,'Pause freezes the crowd and cloth');
 s.status='driving';const reduced={graphics:'battery',reduced:true};crowd.update(.1,s,arena,station.at,curve(station.at),curve,reduced,false);const calm=snapshot();crowd.update(.1,s,arena,station.at,curve(station.at),curve,reduced,false);assert.deepEqual(snapshot(),calm,'Reduced motion suppresses cheering motion and flag flutter');assert(visible.every(st=>st.bodies.count===4),'Battery saver reduces crowd density');
}
console.log(`PASS: ${checks} off-road fan transforms, ${recycles} hidden-only stand reassignments, stable six-stand pool, nearby cheering, paused animation, reduced motion and battery density across all arenas.`);
