const assert=require('node:assert/strict');
global.window={};for(const name of ['language-bank','repair-bank','match-bank','game-core'])require('../dist/'+name+'.js');
const C=window.RallyCore,{displaySpeed}=require('./presentation-compiled.cjs'),unit=window.LANGUAGE_BANK[0].units[0];
function open(fuel=100){const s=C.createRace(unit,'challenge',2,11,{fuel,rivals:false});s.status='driving';s.tasks=[];s.obstacles=[];C.setAccelerating(s,true);return s;}
for(const hz of [30,60,120]){
 const normal=open();for(let i=0;i<hz*2;i++)C.tick(normal,1/hz);
 assert(Math.abs(normal.speedFactor-1.55)<.0001,'Regular world throttle is unchanged');assert.equal(displaySpeed(normal),90);
 const single=open(30);single.speedFactor=1.55;assert(C.activateNitro(single));let elapsed=0;
 while(single.speedFactor<C.nitroSpeed(1)-.1&&elapsed<1){C.tick(single,1/hz);elapsed+=1/hz;}
 assert(elapsed<.25,'Nitro reaches its stronger target with a rapid surge');assert(single.speedFactor>1.55*1.6);
 const max=open();max.speedFactor=1.55;
 for(let level=1;level<=3;level++){assert(C.activateNitro(max));assert.equal(max.nitroLevel,level);assert.equal(max.fuel,100-level*30);}
 assert.equal(max.nitroUses,3);assert.equal(max.nitro,C.NITRO_DURATION*3);max.fuel=100;const charge=max.nitro;assert(!C.activateNitro(max));assert.equal(max.fuel,100);assert.equal(max.nitro,charge,'A capped stack never consumes fuel');
 const before=max.distance;for(let i=0;i<hz;i++)C.tick(max,1/hz);
 assert(max.speedFactor>3.44&&max.speedFactor<=C.MAX_SPEED);assert.equal(displaySpeed(max),200);assert(max.distance-before>normal.arena.speed*1.55*1.8,'Maximum Nitro is substantially faster than regular throttle');
 const paused=[max.distance,max.nitro,max.nitroLevel,max.fuel];C.pause(max);C.tick(max,.1);assert.deepEqual([max.distance,max.nitro,max.nitroLevel,max.fuel],paused);assert(!C.activateNitro(max));C.resume(max);
 const task=C.createRace(unit,'challenge',2,4,{fuel:100,rivals:false});task.obstacles=[];task.status='driving';for(let i=0;i<3;i++)C.activateNitro(task);task.status='task';task.task=task.tasks[0];task.distance=task.task.at-60;task.speedFactor=3.45;const saved=task.nitro;
 for(let i=0;i<hz/2;i++)C.tick(task,1/hz,task.lane);
 assert.equal(task.nitro,saved);assert.equal(task.nitroLevel,3);assert(!task.nitroActive);assert(!C.activateNitro(task));assert(task.speedFactor<=1.55,'Reading immediately sheds surplus Nitro speed');
 // A very fast frame must stop at a solid model, even if its endpoint is clear.
 const block=open();block.distance=0;block.speedFactor=3.45;block.obstacles=[{id:99,type:'barrier',at:12,lane:0,lanePos:0,speed:0,cruiseSpeed:0,halfWidth:1.35,halfLength:1.6}];for(let i=0;i<3;i++)C.activateNitro(block);
 for(let i=0;i<10;i++)C.tick(block,.1,0);
 // Held Nitro drives into real contact (v0.23.1), so the swept stop is the
 // physical bumper boundary and exactly one hit is recorded.
 assert(block.distance<=12-(2.3+1.6+.25)+1e-5,'Boost cannot tunnel through an obstacle');assert.equal(block.collisions,1,'A boosted impact is a single real collision');
}
for(const arena of C.ARENAS)for(const factor of [0,.3,1,1.55,2.65,3.05,3.45,20]){const s={status:'driving',arena,speedFactor:factor},value=displaySpeed(s);assert(value>=0&&value<=200);if(factor<=1.55)assert(value<=90);}
assert.equal(displaySpeed(null),0);
console.log('PASS: 30/60/120 Hz boost surge, three fuel-funded stacks, 90/200 dashboard limits, unchanged regular throttle, >2x top acceleration, protected reading/paused charges, capped fuel spending and swept obstacle stopping.');
