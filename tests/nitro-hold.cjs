const assert=require('node:assert/strict');
global.window={};for(const f of ['language-bank','repair-bank','match-bank','game-core'])require('../dist/'+f+'.js');
const C=window.RallyCore,u=window.LANGUAGE_BANK[0].units[0];
function road(fuel=100){const s=C.createRace(u,'challenge',0,2,{fuel,rivals:false});s.status='driving';s.tasks=[];s.obstacles=[];return s;}
for(const hz of [30,60,120]){
 const s=road(30);assert(C.engageNitro(s));assert.equal(s.fuel,0);C.tick(s,1/hz);assert(s.nitroActive);const used=s.nitro;C.setNitroHeld(s,false);assert(!s.nitroActive);for(let i=0;i<hz*3;i++)C.tick(s,1/hz);assert.equal(s.nitro,used,'Release banks every unused second');
 assert(C.canEngageNitro(s),'A saved charge resumes with zero fuel');assert(C.engageNitro(s));assert.equal(s.fuel,0);C.tick(s,1/hz);assert(s.nitro<used);assert.equal(s.nitroUses,1,'Resuming never purchases another charge');C.setNitroHeld(s,false);
 C.setAccelerating(s,true);C.tick(s,1/hz);assert(s.nitroActive);const accelerating=s.nitro;C.setAccelerating(s,false);C.tick(s,1/hz);assert.equal(s.nitro,accelerating,'Releasing acceleration banks the charge too');
 C.engageNitro(s);C.pause(s);const paused=s.nitro;C.tick(s,.1);C.resume(s);C.tick(s,1/hz);assert.equal(s.nitro,paused);assert(!s.nitroHeld&&!s.nitroActive,'Resume never restores an old hold');
 const stacked=road();for(let i=0;i<3;i++)assert(C.activateNitro(stacked));assert.equal(stacked.nitro,C.NITRO_DURATION*3);assert.equal(stacked.fuel,10);assert(!C.canNitro(stacked));assert(C.canEngageNitro(stacked));assert(C.engageNitro(stacked));C.tick(stacked,1/hz);assert.equal(stacked.nitroLevel,3);assert.equal(stacked.nitroUses,3);
 const blocked=road(30);assert(C.engageNitro(blocked));const crossing=C.createRace(u,'challenge',0,2).tasks[3];blocked.tasks=[crossing];blocked.task=crossing;blocked.status='task';blocked.distance=crossing.stopAt-7.2;blocked.obstacles=[{id:99,type:'traffic',at:crossing.stopAt,lane:0,lanePos:0,speed:0,cruiseSpeed:8,waiting:true,halfLength:2.3,halfWidth:1.25}];for(let i=0;i<hz;i++)C.tick(blocked,1/hz,0);assert.equal(blocked.nitro,C.NITRO_DURATION,'An actual crossing queue cannot burn a held charge');assert(!blocked.nitroActive);assert.equal(blocked.damage,0);

 const reading=C.createRace(u,'relaxed',0,2,{fuel:30,rivals:false});reading.status='driving';assert(C.engageNitro(reading));reading.status='task';reading.task=reading.tasks[0];reading.distance=reading.task.at-65;reading.obstacles=[];for(let i=0;i<hz;i++)C.tick(reading,1/hz);assert.equal(reading.nitro,C.NITRO_DURATION);assert(!reading.nitroActive);
}
console.log('PASS: held Nitro at 30/60/120 Hz; release conservation, free resume with zero fuel, accelerator release, pause/blur-safe latch, three retained charge levels, blocked traffic and protected reading.');
