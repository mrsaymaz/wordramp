// Bridge Builder repairs: blocks are placed one at a time in sentence order.
// A wrong block bounces back out (1.5 s and first-try credit, as before);
// placed blocks stay. The bulk connectRepair path is unchanged.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
global.window={};for(const f of ['language-bank','match-bank','repair-bank','emoji-bank','game-core'])require(path.resolve((fs.existsSync('dist/game-core.js')?'dist/':'')+f+'.js'));
const C=window.RallyCore,units=window.LANGUAGE_BANK.flatMap(g=>g.units);let cases=0;
function atRepair(unit,arena,difficulty='relaxed'){const s=C.createRace(unit,difficulty,arena,unit.id.length+arena),t=s.tasks.find(t=>t.kind==='repair');s.status='driving';s.taskIndex=s.tasks.indexOf(t);s.distance=t.at-60;for(let i=0;i<200&&s.status!=='task';i++)C.tick(s,.05,s.lane);assert.equal(s.status,'task');assert.equal(s.task,t);return {s,t};}
for(const unit of units.slice(0,8))for(let arena=0;arena<3;arena++){
 // A clean build: three placements, first-try credit, the bridge is built.
 {const {s,t}=atRepair(unit,arena),time=s.time,correct=s.correct;
  assert.equal(C.placeRepairBlock(s,0),'placed');assert.deepEqual(t.chosen,[0]);assert.equal(C.placeRepairBlock(s,0),false,'A placed block cannot be placed twice');
  assert.equal(C.placeRepairBlock(s,1),'placed');assert.equal(C.placeRepairBlock(s,2),'solved');
  assert(t.solved&&t.success,'A clean build earns first-try credit');assert.equal(s.correct,correct+1);assert(Math.abs(s.time-time)<.5,'No penalty');assert.equal(s.status,'resolving');assert.deepEqual(t.connection,[0,1,2]);
  assert.equal(C.placeRepairBlock(s,0),false,'A built bridge takes no more blocks');cases++;}
 // A wrong block bounces: 1.5 s, no first-try credit, the placed prefix stays.
 {const {s,t}=atRepair(unit,arena),time=s.time;
  assert.equal(C.placeRepairBlock(s,2),'wrong');assert.deepEqual(t.chosen,[]);assert.equal(t.lastWrong.block,2);assert.equal(t.lastWrong.slot,0);assert(s.time<=time-1.5+1e-9);
  assert.equal(C.placeRepairBlock(s,0),'placed');assert.equal(C.placeRepairBlock(s,2),'wrong');assert.deepEqual(t.chosen,[0],'Placed slabs stay after a wrong block');assert.equal(t.lastWrong.count,2);
  assert.equal(C.placeRepairBlock(s,1),'placed');assert.equal(C.placeRepairBlock(s,2),'solved');assert(t.solved&&!t.success,'A bounced block costs first-try credit');
  assert(s.review.some(i=>i.id===t.id||i.learningKey==='sentence:'+(t.sourceId||t.id)),'A missed sentence returns for review');cases++;}
 // The car still waits safely before the gap until the bridge is built.
 {const {s,t}=atRepair(unit,arena);for(let i=0;i<400;i++)C.tick(s,.05,s.lane);assert(s.distance<t.at,'The car never drives into an open gap');assert(!t.solved);
  for(const id of [0,1,2])C.placeRepairBlock(s,id);for(let i=0;i<400&&s.distance<t.at+60;i++)C.tick(s,.05,s.lane);assert(s.distance>=t.at+60,'Once built the car crosses');assert.equal(s.damage,0);cases++;}
 // Bulk connection (used by autoplay and older paths) behaves as before.
 {const {s,t}=atRepair(unit,arena);assert.equal(C.connectRepair(s,[1,0,2]),false);assert.deepEqual(t.chosen,[]);assert(C.connectRepair(s,[0,1,2]));assert(t.solved);cases++;}
}
console.log(`PASS: ${cases} Bridge Builder cases in all three arenas: one block at a time in sentence order, wrong blocks bounce with the usual 1.5 s and lose first-try credit while placed slabs stay, sentences return for review, the car waits before the open gap and crosses once built; bulk connection unchanged.`);
