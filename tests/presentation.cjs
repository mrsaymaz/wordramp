const assert=require('node:assert/strict');
const {normalisePreferences,createPerformanceBudget,samplePerformance,swipeDirection,roadGesture}=require('./presentation-compiled.cjs');
assert.equal(normalisePreferences(null,true).reduced,true);
assert.equal(normalisePreferences({motion:'full'},true).reduced,false);
assert.equal(normalisePreferences({motion:'reduced'},false).reduced,true);
assert.equal(normalisePreferences({graphics:'bad'}).graphics,'auto');
let budget=createPerformanceBudget('auto',3),changes=0;
for(let i=0;i<600;i++)changes+=samplePerformance(budget,1/60);
assert.equal(changes,0,'A smooth device keeps its detail');
for(let i=0;i<1200;i++)changes+=samplePerformance(budget,1/24);
assert(changes>0);assert.equal(budget.ratio,.85,'Sustained slow frames lower detail to a bounded floor');
const ratio=budget.ratio;for(let i=0;i<500;i++)samplePerformance(budget,1/60);assert.equal(budget.ratio,ratio,'Auto avoids visible resolution oscillation');
for(const graphics of ['high','battery']){const b=createPerformanceBudget(graphics,3);for(let i=0;i<500;i++)assert(!samplePerformance(b,1/24));assert.equal(b.ratio,graphics==='high'?2:1);}
budget=createPerformanceBudget('auto',2);for(let i=0;i<500;i++){samplePerformance(budget,1/24,false);samplePerformance(budget,2);}assert.equal(budget.ratio,1.75,'Menus and suspended tabs do not trigger degradation');
let g={x:100,y:100};assert.equal(swipeDirection(g,123,100),0);assert.equal(swipeDirection(g,130,101),1);assert.equal(swipeDirection(g,200,101),0,'One continuous swipe changes one lane');g={x:100,y:100};assert.equal(swipeDirection(g,60,150),0,'A vertical gesture cannot steer');assert.equal(swipeDirection(g,50,102),-1);g={x:100,y:100};assert.equal(swipeDirection(g,99,100),0,'Holding the accelerator does not steer');
console.log('PASS: reduced-motion preferences, graphics budgets, sustained-load adaptation, pause exclusion and immediate one-swipe/one-lane control.');
const {roadVerticalLayout}=require('./layout-compiled.cjs');
for(const viewport of [{h:568,hud:130,controls:488,prompt:145,answer:110},{h:844,hud:146,controls:764,prompt:122,answer:124},{h:672,hud:132,controls:582,prompt:60,answer:90},{h:396,hud:67,controls:287,prompt:54,answer:78,landscape:false},{h:242,hud:48,controls:178,prompt:48,answer:54,landscape:true},{h:390,hud:70,controls:326,prompt:85,answer:72},{h:320,hud:70,controls:256,prompt:82,answer:66}])for(const repair of [false,true]){
 const landscape=viewport.landscape??viewport.h<500;
 const p=roadVerticalLayout({hudBottom:viewport.hud,promptHeight:viewport.prompt,answerHeight:viewport.answer,promptY:250,answerY:350,controlsTop:viewport.controls,repair,landscape});
 assert(p.py+viewport.prompt/2<=viewport.hud+viewport.prompt+16,'The compact question stays immediately below the HUD');assert(p.py-viewport.prompt/2>=viewport.hud,'Questions sit below the HUD');assert(p.ay-viewport.answer/2>p.py+viewport.prompt/2,'Answers sit below the question');assert(p.ay+viewport.answer/2<=viewport.controls-12,'Side blocks stay above the steering controls');assert(p.ay+p.stagger+viewport.answer/2<=(landscape?viewport.h-20:viewport.controls-12),'Center repair block stays on screen in the clear central column');if(repair)assert(p.stagger>viewport.answer/2+3,'Crossing between outer blocks does not accidentally hit the center block');
}
console.log('PASS: short portrait and landscape prompt/block bounds remain clear of the HUD and driving controls.');

let up={x:100,y:200};assert.equal(roadGesture(up,103,170),null);assert.deepEqual(roadGesture(up,102,145),{type:'nitro'});assert.equal(roadGesture(up,100,100),null,'A swipe cannot fire twice');let diagonal={x:100,y:200};assert.equal(roadGesture(diagonal,150,150),null);let down={x:100,y:200};assert.deepEqual(roadGesture(down,103,260),{type:'cancel'});assert.equal(roadGesture(down,100,100),null,'Reversing a downward swipe cannot accidentally boost');let side={x:100,y:200};assert.deepEqual(roadGesture(side,140,190),{type:'steer',direction:1});assert.equal(roadGesture(side,140,100),null,'Steering cannot turn into a second Nitro action');
console.log('PASS: upward Nitro threshold, ambiguous diagonals, cancelled downward gestures and one-action-per-swipe protection.');

const {visibleRivalLabels}=require('./layout-compiled.cjs');
const labels=[{id:0,x:180,y:250,visible:true,distance:30},{id:1,x:205,y:259,visible:true,distance:15},{id:2,x:310,y:310,visible:true,distance:50},{id:3,x:100,y:170,visible:true,distance:5},{id:4,x:270,y:760,visible:true,distance:5},{id:5,x:200,y:380,visible:true,distance:180}];
assert.deepEqual(visibleRivalLabels(labels,{width:390,top:160,bottom:760}),[1,2],'Rival labels stay apart, clear the HUD/controls and prioritize the closest racer');
console.log('PASS: rival labels avoid each other, HUD, controls and distant traffic.');

const {raceHudContext}=require('./presentation-compiled.cjs');
const drive={status:'driving',distance:0,tasks:[{kind:'light',at:500}],taskIndex:0,obstacles:[]};
assert(raceHudContext(drive).announcementsAllowed);
for(const status of ['task','resolving']){const p=raceHudContext({...drive,status});assert(p.question);assert(!p.announcementsAllowed);assert.equal(p.phase,'question');}
for(const status of ['countdown','paused','finished','failed'])assert(!raceHudContext({...drive,status}).announcementsAllowed);
assert(!raceHudContext({...drive,distance:420}).announcementsAllowed);assert.equal(raceHudContext({...drive,distance:420}).phase,'approaching');
assert(raceHudContext({...drive,distance:390}).announcementsAllowed);assert(!raceHudContext({...drive,distance:390,tasks:[{kind:'pedestrian',at:500}]}).announcementsAllowed);
assert.equal(raceHudContext({...drive,distance:340,tasks:[{kind:'pedestrian',at:500}]}).phase,'approaching','The crosswalk cue precedes focus entry at 150m');
assert(!raceHudContext({...drive,route:{start:0,end:100}}).announcementsAllowed);assert(!raceHudContext({...drive,mergeAssist:{exitEndAt:10}}).announcementsAllowed);assert(raceHudContext({...drive,mergeAssist:{exitEndAt:-1}}).announcementsAllowed);
assert(!raceHudContext({...drive,obstacles:[{at:45}]}).announcementsAllowed);assert(raceHudContext({...drive,obstacles:[{at:180}]}).announcementsAllowed);
for(const flag of ['yielding','followingTraffic'])assert(!raceHudContext({...drive,[flag]:true}).announcementsAllowed);
assert(!raceHudContext(drive,{modalOpen:true}).announcementsAllowed);
console.log('PASS: questions, task approach, route merges, nearby hazards, traffic queues and Pause take priority over optional driving announcements.');
