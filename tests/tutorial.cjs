// Driving School practice pad and first-race coach (pure logic).
const assert=require('node:assert/strict');
const P=require('./presentation-compiled.cjs');
const run=(p,s)=>{for(let t=0;t<s;t+=.05)P.practiceTick(p,.05);};
assert.deepEqual(P.TUTORIAL_STEPS,['drive','steer','nitro','tasks','race']);
// Hold to drive: a held thumb speeds up to 90 km/h, letting go coasts down.
{const p=P.createPractice('drive');P.practicePress(p,200,400);run(p,.6);assert(!p.goals.hold,'A quick tap is not yet a hold');run(p,1.4);assert(p.goals.hold);assert(p.speed>80&&p.speed<=90,`Held speed ${p.speed}`);assert(!p.goals.coast);
 P.practiceRelease(p);run(p,1);assert(p.goals.coast&&P.practiceDone(p));assert(p.speed<40,'Letting go slows the car');}
// Swipes use the race's own gesture reader: 28 px sideways changes lane, and
// the thumb can keep swiping without lifting. Lanes stop at the edges.
{const p=P.createPractice('steer');P.practicePress(p,200,400);P.practiceMove(p,180,401);assert.equal(p.lane,0,'Under 28 px is not a swipe');
 P.practiceMove(p,165,402);assert.equal(p.lane,-1);P.practiceMove(p,120,402);assert.equal(p.lane,-1,'The left edge stops the car');assert(p.goals.left&&!p.goals.right);
 P.practiceMove(p,160,402);P.practiceMove(p,200,402);assert.equal(p.lane,1);assert(P.practiceDone(p));}
// Slide up for Nitro: 44 px per level, each new level costs 30 of 90 practice
// fuel; slide down to save the rest (the charge resumes free).
{const p=P.createPractice('nitro');P.practicePress(p,200,400);P.practiceMove(p,200,370);assert(!p.boost,'Under 44 px is not Nitro');
 P.practiceMove(p,200,350);assert(p.boost&&p.level===1&&p.fuel===60);run(p,2);assert(p.speed>130,'Nitro is faster than driving');
 P.practiceMove(p,200,300);assert.equal(p.level,2);assert.equal(p.fuel,30);P.practiceMove(p,200,260);assert.equal(p.level,3);assert.equal(p.fuel,0);assert(!p.goals.save);
 P.practiceMove(p,200,300);assert(!p.boost&&p.goals.save,'Sliding down saves the charge');assert(P.practiceDone(p));run(p,5);assert(p.speed<=92,'Back to regular acceleration');
 P.practiceMove(p,200,250);assert(p.boost&&p.fuel===0,'A saved charge resumes free');}
{const p=P.createPractice('nitro');P.practicePress(p,200,400);P.practiceMove(p,200,350);P.practiceRelease(p);assert(p.goals.save,'Letting go also saves the rest');}
{const p=P.createPractice('steer');P.practicePress(p,200,400);P.practiceMove(p,200,330);assert(!p.boost,'No Nitro outside the Nitro lesson');}
// Keyboards: ↑ drives, ← → / A D steer, Space boosts, N adds a level.
{const p=P.createPractice('drive');assert(P.practiceKey(p,'ArrowUp',true));run(p,1.3);assert(p.goals.hold);P.practiceKey(p,'ArrowUp',false);run(p,.1);assert(P.practiceDone(p));assert(!P.practiceKey(p,'x',true));}
{const p=P.createPractice('steer');P.practiceKey(p,'a',true);P.practiceKey(p,'D',true);P.practiceKey(p,'ArrowRight',true);assert.equal(p.lane,1);assert(P.practiceDone(p));}
{const p=P.createPractice('nitro');P.practiceKey(p,' ',true);assert(p.boost&&p.level===1);P.practiceKey(p,'n',true);assert(p.level===2&&p.fuel===30);P.practiceKey(p,' ',false);assert(P.practiceDone(p));}
// The self-playing demo shows each move inside its 4 s loop.
{const d=t=>P.practiceDemo('drive',t);assert(!d(.1).held&&d(1).held&&!d(3).held&&d(5).held);
 const lanes=new Set();for(let t=0;t<4;t+=.1)lanes.add(P.practiceDemo('steer',t).lane);assert.deepEqual([...lanes].sort(),[-1,0,1]);
 const levels=new Set();for(let t=0;t<4;t+=.1)levels.add(P.practiceDemo('nitro',t).level);assert.deepEqual([...levels].sort(),[0,1,2]);}
// First-race coach: hold to drive, then change lanes, then Nitro when fuel
// allows; each prompt stops once the move is done, and is saved.
{const coach={drive:false,steer:false,nitro:false},runState={};const race={status:'countdown',lane:0,accelerating:false,nitro:0,nitroHeld:false};
 assert.equal(P.coachPrompt(race,coach),null,'Quiet during the countdown');race.status='driving';assert.equal(P.coachPrompt(race,coach),'drive');
 race.accelerating=true;assert.equal(P.coachPrompt(race,coach),null,'Hidden while already holding');
 for(let i=0;i<20;i++)P.coachProgress(race,coach,runState,.05,null);assert(!coach.drive);let learned=false;for(let i=0;i<12;i++)learned=P.coachProgress(race,coach,runState,.05,null)||learned;assert(coach.drive&&learned);
 assert.equal(P.coachPrompt(race,coach),'steer');race.status='task';assert.equal(P.coachPrompt(race,coach),null,'Never during an English task');race.status='driving';
 race.lane=-1;P.coachProgress(race,coach,runState,.05,'steer');assert(coach.steer);
 assert.equal(P.coachPrompt(race,coach,false),null,'No Nitro prompt without fuel');assert.equal(P.coachPrompt(race,coach,true,runState),'nitro');
 for(let t=0;t<12;t+=.5)P.coachProgress(race,coach,runState,.5,'nitro');assert.equal(P.coachPrompt(race,coach,true,runState),null,'The Nitro prompt rests after 12 s');assert(!coach.nitro);
 const next={};assert.equal(P.coachPrompt(race,coach,true,next),'nitro','and returns next race');race.nitro=3;race.nitroHeld=true;P.coachProgress(race,coach,next,.05,'nitro');assert(coach.nitro);assert.equal(P.coachPrompt(race,coach,true,next),null);
 race.reviewLap=true;assert.equal(P.coachPrompt(race,{drive:false},true),null,'No coach on review laps');}
{const coach={drive:true,steer:false,nitro:false},runState={};const race={status:'driving',lane:0,accelerating:true,nitro:0};for(let t=0;t<10;t+=.5)P.coachProgress(race,coach,runState,.5,'steer');assert(coach.steer,'The lane prompt gives up after 10 s');}
// Task tips: the first time each kind of English task appears its finger tip
// shows how to answer, until that task is answered; then never again.
{const coach={drive:true,steer:true,nitro:true,tasks:Object.fromEntries(P.TASK_TIPS.map(k=>[k,false]))},runState={};
 const task={id:'t1',kind:'light',completed:false};const race={status:'task',task,lane:0,nitro:0};
 assert.deepEqual(P.TASK_TIPS,['light','junction','repair','pedestrian']);
 assert.equal(P.coachPrompt(race,coach),'task-light');P.coachProgress(race,coach,runState,.05,'task-light');assert(!coach.tasks.light,'Still learning while the task is open');
 task.completed=true;assert.equal(P.coachPrompt(race,coach),null);assert(P.coachProgress(race,coach,runState,.05,null));assert(coach.tasks.light,'Learned once answered');
 const next={id:'t2',kind:'light',completed:false};race.task=next;assert.equal(P.coachPrompt(race,coach),null,'Shown once per kind');
 race.task={id:'t3',kind:'repair',solved:false};assert.equal(P.coachPrompt(race,coach),'task-repair');P.coachProgress(race,coach,runState,.05,'task-repair');race.task.solved=true;P.coachProgress(race,coach,runState,.05,null);assert(coach.tasks.repair,'A built bridge counts');
 race.task={id:'t4',kind:'pedestrian'};race.reviewLap=true;assert.equal(P.coachPrompt(race,coach),null,'No tips on review laps');
 assert.equal(P.coachPrompt({status:'task',task:{id:'x',kind:'junction'}},{drive:true,steer:true,nitro:true}),null,'Players without task tips (older saves) see none');}
// The sign tour never hints at an answer: over a whole loop every sign gets
// the same time under the finger and the same tap.
{const dwell=[0,0,0],taps=[0,0,0],dt=.001;for(let t=0;t<P.FINGER_CYCLE.signs;t+=dt){const p=P.fingerPose('signs',t);if(p.mix>=1){dwell[p.index]+=dt;if(p.press)taps[p.index]+=dt;}}
 for(const k of [1,2])assert(Math.abs(dwell[k]-dwell[0])<.01&&Math.abs(taps[k]-taps[0])<.01,`Equal visits ${dwell.map(d=>d.toFixed(3))} / taps ${taps.map(d=>d.toFixed(3))}`);
 for(let t=0;t<9;t+=.37){const p=P.fingerPose('signs',t);assert(p.index>=0&&p.index<3&&p.from===(p.index+2)%3);}}
// Driving fingers: hold presses in place; the swipe and the word flick reach
// both sides equally; the Nitro finger slides up, then down to save.
{let min=0,max=0,pressed=false;for(let t=0;t<3.2;t+=.01){const p=P.fingerPose('steer',t);min=Math.min(min,p.dx);max=Math.max(max,p.dx);}assert(min<-60&&max>60&&Math.abs(min+max)<1);
 min=0;max=0;for(let t=0;t<3.2;t+=.01){const p=P.fingerPose('sort',t);min=Math.min(min,p.dx);max=Math.max(max,p.dx);}assert(min<-50&&max>50&&Math.abs(min+max)<1,'The word flick shows both groups equally');
 for(let t=0;t<2.4;t+=.01){const p=P.fingerPose('drive',t);assert(p.dx===0&&p.dy===0);pressed||=p.press;}assert(pressed);
 const up=P.fingerPose('nitro',1.6),saved=P.fingerPose('nitro',2.8);assert(up.dy<-90&&up.boost&&up.press);assert(saved.dy>up.dy&&!saved.boost&&saved.press,'Slides back down to save the rest');}
console.log('PASS: finger tips: one tip per English task kind until answered, never on review laps; the sign tour gives each sign equal time and taps; swipes and word flicks show both sides equally; the Nitro finger slides up then down to save.');
console.log('PASS: Driving School practice pad (hold, swipe, slide-up Nitro levels and saving, keyboard keys, self-playing demo) and the first-race coach (order, quiet during tasks and countdown, Nitro only with fuel, rests after 12 s, saved once learned).');
