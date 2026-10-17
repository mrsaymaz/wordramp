const assert=require('node:assert/strict');
const {TEAMS,newIdentity,ultiWinStatus,retireLocalUlti,ULTI_MIN_STARS,ULTI_MIN_RELAXED_ACCURACY}=require('./ulti-compiled.cjs');
const U=require('./ulti-compiled.cjs');
const {normaliseProgress,resolvedLook,arenaUnlocked}=require('./progression-compiled.cjs');
const saved={difficulty:'standard',progress:{'g5u1:standard':[2,0,1],'g5u1:challenge':[1,3,0],'g5u2:relaxed':[3,0,0]},fuel:73,look:{paint:'ruby',badge:2,trail:true},mastery:{g5u1:{tier:3}}};
normaliseProgress(saved);assert.equal(saved.difficulty,'challenge');assert.deepEqual(saved.progress['g5u1:challenge'],[2,3,1]);assert(!('g5u1:standard'in saved.progress));assert.equal(saved.fuel,73);assert.equal(saved.look.paint,'ruby');
assert.equal(TEAMS.length,4);assert.equal(new Set(TEAMS.map(t=>t.color)).size,4);assert.equal(new Set(Array.from({length:1000},()=>newIdentity())).size,1000);
for(const team of TEAMS){saved.teamId=team.id;assert.equal(resolvedLook(saved).color,team.color);assert.equal(resolvedLook(saved).badge,2);assert(resolvedLook(saved).trail);}
// Browser-only team points are retired: no local points, caps or export remain.
for(const gone of ['ULTI_POINTS','ULTI_DAILY_CAP','ultiPointsFor','ultiSnapshot','awardUltiWin','exportUlti','ultiWinOutcome','normaliseUlti'])assert(!(gone in U),gone+' is retired');
// Which wins the game claims from the English League.
assert.equal(ULTI_MIN_STARS,2);assert.equal(ULTI_MIN_RELAXED_ACCURACY,.6);
const tasks=n=>Array.from({length:n},(_,i)=>({id:i}));
const race={status:'finished',teamId:'slytherin',runId:'run-one',unit:{id:'g5u1',grade:5},difficulty:'relaxed',arena:{id:'boulevard'},arenaIndex:0,tasks:tasks(12),correct:12};
assert.equal(ultiWinStatus(race,1,3),'qualified');
for(const bad of [{status:'failed'},{status:'driving'},{damage:3},{failureReason:'breakdown'},{breakdown:{age:1}},{arena:{id:'boulevard',length:7200},distance:7000},{reviewLap:true},{teamId:'unknown'},{runId:null},{runId:''}])assert.equal(ultiWinStatus({...race,...bad},1,3),'none',JSON.stringify(bad));
for(const place of [2,3,null])assert.equal(ultiWinStatus(race,place,3),'none');
const relaxed=(correct,n)=>({...race,tasks:tasks(n),correct});
assert.equal(ultiWinStatus(relaxed(8,12),1,1),'qualified','Relaxed: 8 of 12 (67%) qualifies at 1 star');
assert.equal(ultiWinStatus(relaxed(10,16),1,1),'qualified','Relaxed: 10 of 16 (62.5%)');
assert.equal(ultiWinStatus(relaxed(9,15),1,1),'qualified','Relaxed: exactly 60%');
assert.equal(ultiWinStatus(relaxed(7,12),1,1),'accuracy','Relaxed: 7 of 12 (58%) does not');
assert.equal(ultiWinStatus({...relaxed(8,12),difficulty:'challenge'},1,1),'accuracy','Challenge: 1 star is not enough');
assert.equal(ultiWinStatus({...relaxed(9,12),difficulty:'challenge'},1,2),'qualified','Challenge: 2 stars');
assert.equal(ultiWinStatus({...relaxed(9,12),difficulty:'standard'},1,2),'qualified','Former Standard counts as Challenge');
// Old saves: the local ledger is dropped, but its receipts still prove past first places.
const receipt=(o)=>({schemaVersion:2,sourceGame:'wordshift-rally',eventId:'e-'+o.runId,driverId:'d',teamId:'hufflepuff',points:4,earnedAt:1000,expiresAt:2000,unitId:'g5u1',difficulty:'relaxed',arenaId:'boulevard',...o});
const old=normaliseProgress({teamId:'hufflepuff',ulti:{schemaVersion:2,driverId:'d',receipts:[receipt({runId:'a'}),receipt({runId:'b',difficulty:'standard',arenaId:'coast'}),receipt({runId:'c',sourceGame:'other',unitId:'g5u2'}),receipt({runId:'d',teamId:'nope',unitId:'g5u3'}),null]}});
assert(!('ulti' in old),'The browser-only ledger is removed');
assert(arenaUnlocked(old,'g5u1','relaxed',1),'An old receipt still opens the next arena');
assert.deepEqual(old.arenaWins['g5u1:challenge'],[false,true,false],'Standard receipts migrate to Challenge');
assert(!old.arenaWins['g5u2:relaxed']&&!old.arenaWins['g5u3:relaxed'],'Foreign or invalid receipts are ignored');
assert.equal(retireLocalUlti(old),false);assert.equal(retireLocalUlti({ulti:{}}),true);assert.equal(retireLocalUlti(null),false);
console.log('PASS: four team liveries, saved-progress migration, unique run IDs; browser-only team points retired (no local points, cap or export); League claims only first places with 60%+ first-try accuracy on Relaxed or 2+ stars on Challenge; old ledgers dropped with their receipts kept as arena wins.');
