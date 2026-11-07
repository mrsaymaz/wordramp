// Learning log (LEARNING_LOG.md): real races driven by the game core with a
// student who makes chosen mistakes, the record they produce, and the League
// "learn" request (off until the League switches it on, one per ticket,
// offline queue). Mocked endpoint: no network.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
global.window=global;for(const f of ['language-bank','repair-bank','match-bank','emoji-bank','game-core'])require('../dist/'+f+'.js');
const C=window.RallyCore,BANK=window.LANGUAGE_BANK;
const LL=require('./learning-log-compiled.cjs'),L=require('./league-compiled.cjs'),P=require('./student-picker-compiled.cjs');

// Drive one race to the end. mistakes: which tasks the student gets wrong.
function drive(unit,{arena=0,difficulty='relaxed',seed=3,wrongSigns=1,wrongBlocks=1,wrongSorts=1,leaveUnsorted=1,stopAfter=Infinity}={}){
  const s=C.createRace(unit,difficulty,arena,seed,{rivals:false});s.obstacles=[];
  let signs=0,blocks=0,sorts=0,unsorted=0,seenTasks=new Set(),readyAt=null;
  for(let step=0;step<40000&&!['finished','failed'].includes(s.status);step++){
    if(s.status==='task'){
      const t=s.task;if(!seenTasks.has(t.id)){seenTasks.add(t.id);readyAt=s.elapsed;if(seenTasks.size>stopAfter)break;}
      if(t.kind==='pedestrian'){
        const p=t.people[t.personIndex];
        if(p&&!p.sent&&C.pedestrianReady(s)&&!t.pedWait&&s.elapsed-readyAt>.6){
          if(t.personIndex===t.people.length-1&&(t.leftUnsorted||unsorted<leaveUnsorted)){if(!t.leftUnsorted){t.leftUnsorted=true;unsorted++;}}
          else{const wrong=sorts<wrongSorts;if(wrong)sorts++;C.sortPerson(s,wrong?1-p.side:p.side);}
          readyAt=s.elapsed;
        }
      }else if(t.kind==='repair'){
        if(!t.solved&&s.elapsed-readyAt>1){if(blocks<wrongBlocks&&!t.attempts){blocks++;C.placeRepairBlock(s,2);}else C.placeRepairBlock(s,t.chosen.length);}
      }else if(s.elapsed-readyAt>1&&!t.decided){
        const row=C.currentRow(s);t.decided=true;const wrong=signs<wrongSigns;if(wrong)signs++;C.choose(s,wrong?(row.correctIndex+1)%3:row.correctIndex);
      }
    }
    C.tick(s,1/30,s.lane);
  }
  return s;
}

const unit=BANK[0].units[0];
const race=drive(unit,{wrongSigns:2,wrongBlocks:1,wrongSorts:1,leaveUnsorted:1});
assert.equal(race.status,'finished','The scripted race reaches the finish');
const log=LL.roundLog(race,{place:1});
assert(LL.validLog(log));
assert.deepEqual(Object.keys(log).sort(),['arena','finished','first','items','pace','place','seconds','total','unit','v']);
assert.deepEqual([log.v,log.unit,log.arena,log.pace,log.finished,log.place],[1,'g5u1',0,'relaxed',true,1]);
assert(log.seconds>60);assert.equal(log.total,log.items.length);assert.equal(log.first,log.items.filter(i=>i.result==='first').length);
// Every completed task is logged once; a crosswalk logs each visitor.
const people=race.tasks.filter(t=>t.kind==='pedestrian').reduce((n,t)=>n+t.people.length,0),signsAndBlocks=race.tasks.filter(t=>t.kind!=='pedestrian').length;
assert.equal(log.items.length,Math.min(LL.LEARN_MAX_ITEMS,people+signsAndBlocks));
for(const i of log.items){
  assert(i.item.startsWith('wordramp:'),'Item ids name the game');assert(LL.LEARN_SKILLS.includes(i.skill));assert(LL.LEARN_RESULTS.includes(i.result));
  assert.match(i.target,/^(word|grammar|sentence|reading):\S/);assert(!('points' in i));
  for(const v of Object.values(i))if(typeof v==='string')assert(v.length<=200);
}
// The sign answered wrong: missed, with the wrong option the student chose.
const missedSigns=log.items.filter(i=>/^(light|shortcut)-/.test(i.type)&&i.result==='missed');
assert.equal(missedSigns.length,2);
for(const i of missedSigns){const t=race.tasks.find(x=>'wordramp:'+x.id===i.item);assert.equal(i.wrong,t.rows[0].options[t.chosenIndex]);assert.notEqual(i.wrong,t.answer);assert.equal(i.answer,t.answer);}
// The bridge with a misplaced block: right on a retry, with the block placed too early.
const bridges=log.items.filter(i=>i.type==='bridge-blocks');assert(bridges.length>=1);
const retried=bridges.find(i=>i.result==='retry');assert(retried,'A bridge solved after a wrong block is a retry');assert.equal(retried.tries,2);assert(retried.wrong);assert.equal(retried.skill,'sentence-order');assert.match(retried.target,/^sentence:/);
assert(bridges.filter(i=>i!==retried).every(i=>i.result==='first'&&!i.wrong));
// Crosswalk: one visitor sorted into the wrong group, one left on the road.
const sorts=log.items.filter(i=>i.type==='crosswalk-sort');
assert.equal(sorts.filter(i=>i.result==='missed').length,1);const wrongSort=sorts.find(i=>i.result==='missed');assert(wrongSort.wrong&&wrongSort.wrong!==wrongSort.answer,'The group the visitor was sent to');
assert.equal(sorts.filter(i=>i.result==='timeout').length,1);assert(!sorts.find(i=>i.result==='timeout').wrong);
for(const i of sorts){assert.match(i.item,/^wordramp:[^:]+:/);assert.equal(i.skill,'vocabulary');assert.match(i.target,/^word:/);}
// Grammar and question signs carry the sentence they asked; skills follow the task.
for(const i of log.items.filter(i=>i.skill==='grammar'||i.skill==='reading'))assert(i.prompt);
for(const i of log.items){const t=race.tasks.find(x=>'wordramp:'+x.id===i.item);if(!t)continue;
  if(t.type==='grammar')assert.equal(i.skill,'grammar');if(t.type==='question')assert.equal(i.skill,'reading');if(['translation','description'].includes(t.type))assert.equal(i.skill,'vocabulary');}
// The targets match the game's own learning keys (mastery and reviews), except question signs, logged as reading.
const keys=new Set(race.answerEvents.map(e=>e.key.toLowerCase()));
for(const i of log.items.filter(i=>i.skill!=='reading'))assert(keys.has(i.target),'Target '+i.target+' is a learning key');

// A race left halfway logs only what the student reached.
const half=drive(unit,{seed:5,stopAfter:4});const partial=LL.roundLog(half);
assert.equal(partial.finished,false);assert.equal(partial.place,null);
assert(partial.items.length>0&&partial.items.length<log.items.length);
assert(partial.items.every(i=>{const t=half.tasks.find(x=>i.item==='wordramp:'+x.id);return !t||t.completed;}),'Unreached tasks are not logged');

// Every grade and arena: records stay valid, small and within the item cap.
let checked=0,maxBytes=0;
for(const g of BANK)for(const u of g.units.slice(0,3))for(const a of [0,2]){const r=drive(u,{arena:a,seed:a+1,wrongSigns:3,wrongBlocks:1,wrongSorts:2});const l=LL.roundLog(r,{place:1});assert(LL.validLog(l),u.id);maxBytes=Math.max(maxBytes,JSON.stringify(l).length);checked++;}
assert(maxBytes<12000,'One record stays small: '+maxBytes+' bytes');
// Review loops reuse the original item id and say so.
{const t={kind:'light',type:'review',id:'g5u1-t3-review',reviewOf:'g5u1-t3',learningKey:'word:lab',answer:'laboratuvar',options:['laboratuvar','kantin','spor salonu'],rows:[{options:['laboratuvar','kantin','spor salonu'],correctIndex:0}],completed:true,success:false,chosenIndex:1};
 const [i]=LL.roundLog({tasks:[t],unit:{id:'g5u1'}}).items;assert.deepEqual([i.item,i.skill,i.target,i.result,i.wrong,i.review],['wordramp:g5u1-t3','vocabulary','word:lab','missed','kantin',true]);}
assert.equal(LL.validLog({v:1,items:[{item:'x',skill:'cooking',result:'first',target:'word:x'}]}),false);assert.equal(LL.validLog(null),false);

(async()=>{
 // League client: "learn" stays off until the League's settings switch it on for this game.
 const memoryStorage=()=>{const data={};return {getItem:k=>k in data?data[k]:null,setItem:(k,v)=>{data[k]=String(v);}};};
 const settings=learning=>({capacity:100,maxStrength:2,hours:72,enabled:true,games:{wordramp:{enabled:true,points:{relaxed:[2,4,6],challenge:[5,7,9]},...(learning===undefined?{}:{learning})}}});
 let mode='ok',learningSetting;const calls=[];
 const fetchImpl=async(url,init)=>{const b=JSON.parse(init.body);calls.push(b);if(mode==='offline')throw new Error('offline');
  const body=b.action==='start'?{status:'success',ticket:'T-'+b.arena+'-'+calls.length}:b.action==='pools'?{status:'success',settings:settings(learningSetting),pools:{}}:b.action==='learn'?(mode==='refuse'?{status:'error',reason:'bad-log'}:{status:'success'}):{status:'success',points:4,requested:4,grade:5,team:'slytherin'};
  return {ok:mode!=='refuse'&&mode!=='5xx',status:mode==='refuse'?400:mode==='5xx'?503:200,json:async()=>body};};
 let t=Date.UTC(2026,10,7,18);const storage=memoryStorage(),league=L.createLeague({api:'https://league.test/api/ulti',storage,fetchImpl,now:()=>t});
 const base={grade:5,team:'slytherin',arena:0,pace:'relaxed',unit:'g5u1'};
 await league.start({...base,runId:'r1',student:'5-A:slytherin:0'});
 assert.equal(league.learningOn(),false);assert.deepEqual(await league.learn('r1',log),{state:'off'});
 await league.refresh(5);assert.equal(league.learningOn(),false,'A League without the learning switch: nothing is sent');
 learningSetting=false;await league.refresh(5);assert.deepEqual(await league.learn('r1',log),{state:'off'});
 assert(!calls.some(c=>c.action==='learn'),'No learning request before the League switches it on');
 learningSetting=true;await league.refresh(5);assert.equal(league.learningOn(),true);
 // One record per race, with the race's own ticket; the claim still works after it.
 assert.deepEqual(await league.learn('r1',log),{state:'sent'});
 const sent=calls.at(-1);assert.deepEqual(Object.keys(sent).sort(),['action','device','game','log','ticket']);
 assert.deepEqual([sent.action,sent.game,sent.ticket],['learn','wordramp',league.ticketFor('r1')]);assert.deepEqual(sent.log,log);
 assert.deepEqual(await league.learn('r1',log),{state:'duplicate'},'A race is logged once');
 assert.equal((await league.claim('r1')).state,'counted','Logging first does not use up the ticket');
 assert.deepEqual(await league.learn('r1',log),{state:'no-ticket'});assert.deepEqual(await league.learn('never-started',log),{state:'no-ticket'});
 // Offline: queued and resent later; a refusal is final; 47 hours drops it.
 await league.start({...base,runId:'r2'});await league.start({...base,runId:'r3'});
 mode='offline';assert.deepEqual(await league.learn('r2',log),{state:'queued'});assert.deepEqual(await league.learn('r3',partial),{state:'queued'});
 assert.equal(league.learnOutbox().length,2);
 const before=calls.length;assert.deepEqual(await league.flushLearning(),['retry'],'Still offline: one try, then stop');assert.equal(calls.length,before+1);assert.equal(league.learnOutbox().length,2);
 mode='ok';assert.deepEqual(await league.flushLearning(),['sent','sent']);assert.equal(league.learnOutbox().length,0);
 assert.deepEqual(calls.slice(-2).map(c=>c.log.total),[log.total,partial.total]);
 await league.start({...base,runId:'r4'});mode='5xx';assert.deepEqual(await league.learn('r4',log),{state:'queued'});
 mode='refuse';assert.deepEqual(await league.flushLearning(),['refused']);assert.equal(league.learnOutbox().length,0,'A refused record is not resent');
 await league.start({...base,runId:'r5'});mode='offline';await league.learn('r5',log);t+=47*3600000+60000;mode='ok';
 assert.deepEqual(await league.flushLearning(),[]);assert.equal(league.learnOutbox().length,0,'Records older than 47 hours are dropped');
 // ultiApi '': nothing at all.
 {let n=0;const off=L.createLeague({api:'',storage:memoryStorage(),fetchImpl:async()=>{n++;}});assert.equal(off.learningOn(),false);assert.deepEqual(await off.learn('r',log),{state:'off'});assert.deepEqual(await off.flushLearning(),[]);assert.equal(n,0);}

 // Students are told when it is on; app.js logs before claiming and resends on launch.
 const zeynep={id:'5-A:slytherin:0',name:'Zeynep',className:'5-A',team:'slytherin'};
 const p={grade:5,team:'slytherin',all:false,className:null,studentId:zeynep.id,roster:{classes:['5-A'],students:[zeynep]},loading:false};
 assert.match(P.pickerMarkup(p,{learning:true}),/Your answers help Mr\. Saymaz plan your lessons\./);
 assert(!P.pickerMarkup(p).includes('plan your lessons'));
 const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
 const learnAt=app.indexOf('league.learn(race.runId,roundLog(race,{place:position}))'),claimAt=app.indexOf('league.claim(claimed.runId)');
 assert(learnAt>0&&learnAt<claimAt,'The race is logged before the claim uses up its ticket');
 assert.match(app,/if\(league\.enabled&&!race\.reviewLap&&race\.runId\)league\.learn/,'Review laps (no ticket) are not logged');
 assert.match(app,/league\.flush\(\)\.catch\(\(\)=>\{\}\);league\.flushLearning\(\)/,'Queued records are resent on launch');
 console.log(`PASS: learning log: a real race with chosen mistakes (wrong signs with the chosen option, a bridge retry with the misplaced block, a crosswalk visitor in the wrong group and one left unsorted), skills and targets matching the game's learning keys, partial races, ${checked} races across all grades (max ${maxBytes} bytes); League "learn" off until switched on, one per ticket before the claim, offline queue, refusal and 47-hour drop; the picker says so when it is on.`);
})().catch(e=>{console.error(e);process.exit(1);});
