// English League connection with a mocked endpoint: no real network calls.
const assert=require('node:assert/strict');
const L=require('./league-compiled.cjs');
const memoryStorage=()=>{const data={};return {getItem:k=>k in data?data[k]:null,setItem:(k,v)=>{data[k]=String(v);},data};};
function endpoint(handler){
  const calls=[];
  const fetchImpl=async(url,init)=>{const body=JSON.parse(init.body);calls.push({url,body,init});const r=await handler(body,calls.length);if(r instanceof Error)throw r;return {ok:r.status>=200&&r.status<300,status:r.status,json:async()=>r.body};};
  return {calls,fetchImpl};
}
const ok=body=>({status:200,body:{status:'success',...body}});
const settings={capacity:100,maxStrength:2,hours:72,teamDailyCap:60,enabled:true,games:{wordramp:{enabled:true,points:{relaxed:[2,4,6],challenge:[5,7,9]},deviceDailyWins:6,minSeconds:150}}};
const minute=t=>Math.floor(t/60000);

(async()=>{
 // Config: missing config.js uses the League URL; '' switches everything off.
 assert.equal(L.leagueApi(undefined),L.LEAGUE_URL);assert.equal(L.leagueApi({}),L.LEAGUE_URL);assert.equal(L.leagueApi({ultiApi:''}),'');
 {let called=0;const off=L.createLeague({api:'',storage:memoryStorage(),fetchImpl:async()=>{called++;throw new Error('no calls');}});
  assert.equal(off.enabled,false);assert.equal(await off.start({runId:'r',grade:5,team:'ravenclaw',arena:0,pace:'relaxed'}),null);
  assert.deepEqual(await off.claim('r'),{state:'off'});assert.deepEqual(await off.flush(),[]);await off.refresh(5);assert.equal(called,0,'ultiApi "" makes no calls at all');}

 // Device id: 8-64 of A-Z a-z 0-9 _ -, made once and kept.
 const storage=memoryStorage();let t=Date.UTC(2026,9,20,9);const now=()=>t;
 {const e=endpoint(()=>ok({}));const a=L.createLeague({storage,fetchImpl:e.fetchImpl,now});const id=a.device();assert.match(id,/^[A-Za-z0-9_-]{8,64}$/);assert.equal(L.createLeague({storage,fetchImpl:e.fetchImpl,now}).device(),id);}

 // start: the right fields, never a points value; the ticket is kept per run.
 let mode='ok';
 const e=endpoint(body=>{
  if(body.action==='start')return mode==='offline'?new Error('offline'):ok({ticket:'T-'+body.arena+'-'+body.pace});
  if(body.action==='pools')return ok({settings,pools:{5:{ravenclaw:{points:0,players:3,entries:[[minute(t-3600000),20],[minute(t-73*3600000),50]]},gryffindor:{points:0,players:2,entries:[[minute(t-60000),130]]}}}});
  if(body.action==='claim'){
   if(mode==='offline')return new Error('offline');if(mode==='5xx')return {status:503,body:{status:'error'}};if(mode==='retry')return {status:200,body:{status:'error',retry:true}};
   if(mode==='too-fast'||mode==='expired')return {status:400,body:{status:'error',reason:mode}};
   const replies={ok:{points:6,requested:6,deviceWins:1},team:{points:2,requested:6,deviceWins:2,reason:'team-limit'},device:{points:0,requested:6,deviceWins:6,reason:'device-limit'},off:{points:0,requested:6,deviceWins:0,reason:'off'},dup:{points:6,requested:6,deviceWins:1,duplicate:true}};
   return ok({...replies[mode],settings,pools:{}});
  }
  return {status:400,body:{status:'error'}};
 });
 const league=L.createLeague({storage,fetchImpl:e.fetchImpl,now});
 const ticket=await league.start({runId:'run-1',grade:5,team:'ravenclaw',arena:2,pace:'relaxed',unit:'g5u1'});
 assert.equal(ticket,'T-2-relaxed');assert.equal(league.ticketFor('run-1'),ticket);
 const sent=e.calls.at(-1);assert.equal(sent.url,L.LEAGUE_URL);assert.equal(sent.init.method,'POST');
 assert.deepEqual(Object.keys(sent.body).sort(),['action','arena','device','game','grade','pace','team','unit']);assert.equal(sent.body.game,'wordramp');assert.equal(sent.body.unit,'g5u1');
 assert(!e.calls.some(c=>'points'in c.body),'The game never sends a points value');
 assert.equal(await league.start({runId:'run-1',grade:5,team:'ravenclaw',arena:2,pace:'relaxed'}),ticket,'A run keeps one ticket');

 // claim outcomes.
 const claimWith=async(m,run)=>{mode='ok';await league.start({runId:run,grade:5,team:'ravenclaw',arena:2,pace:'relaxed'});mode=m;return league.claim(run);};
 let r=await claimWith('ok','c-ok');assert.deepEqual([r.state,r.points,r.reason],['counted',6,null]);assert.equal(e.calls.at(-1).body.ticket,'T-2-relaxed');
 r=await claimWith('team','c-team');assert.deepEqual([r.state,r.points,r.requested,r.reason],['counted',2,6,'team-limit']);
 r=await claimWith('device','c-dev');assert.deepEqual([r.points,r.reason],[0,'device-limit']);
 r=await claimWith('off','c-off');assert.deepEqual([r.points,r.reason],[0,'off']);
 r=await claimWith('dup','c-dup');assert.equal(r.duplicate,true);
 r=await claimWith('too-fast','c-fast');assert.deepEqual(r,{state:'refused',reason:'too-fast'});
 r=await claimWith('expired','c-exp');assert.deepEqual(r,{state:'refused',reason:'expired'});
 assert.equal(league.outbox().length,0,'A 400 refusal is final, never queued');
 assert.deepEqual(await league.claim('never-started'),{state:'no-ticket'});
 assert.deepEqual(await league.claim('c-ok'),{state:'no-ticket'},'A ticket is claimed once');

 // Outbox: network errors, 5xx and retry:true queue the win; resend later.
 for(const m of ['offline','5xx','retry'])assert.deepEqual(await claimWith(m,'q-'+m),{state:'queued'});
 assert.equal(league.outbox().length,3);
 mode='5xx';await league.flush();assert.equal(league.outbox().length,3,'Still failing: kept');
 mode='ok';const flushed=await league.flush();assert.equal(flushed.length,3);assert(flushed.every(x=>x.state==='counted'));assert.equal(league.outbox().length,0);
 // Items older than 47 hours are dropped without being sent.
 await claimWith('offline','old');const callsBefore=e.calls.length;t+=47*3600000+60000;mode='ok';assert.deepEqual(await league.flush(),[]);assert.equal(league.outbox().length,0);assert.equal(e.calls.length,callsBefore,'Expired outbox items are not sent');
 // Offline at the start line: no ticket, nothing to claim.
 mode='offline';assert.equal(await league.start({runId:'off-start',grade:5,team:'ravenclaw',arena:0,pace:'relaxed'}),null);assert.deepEqual(await league.claim('off-start'),{state:'no-ticket'});

 // Pools: live points are entries newer than now - hours; strength formula.
 mode='ok';t=Date.UTC(2026,9,25,9);const snap=await league.refresh(5);
 assert.equal(snap.online,true);assert.equal(snap.capacity,100);assert.equal(snap.hours,72);assert.equal(snap.game.deviceDailyWins,6);
 const team=id=>snap.teams.find(x=>x.id===id);
 assert.equal(team('ravenclaw').points,20,'An entry older than 72 hours no longer counts');assert.equal(team('ravenclaw').players,3);
 assert.equal(team('gryffindor').points,130);assert.equal(team('gryffindor').strength,2,'Strength caps at maxStrength once points reach capacity');
 assert.equal(L.strength(25,100,2),1.5);assert.equal(L.strengthLabel(L.strength(10,100,2)),'x1.32');assert.equal(L.strength(0,100,3),1);
 assert.equal(L.livePoints([[minute(t-1000),5],[minute(t-2*3600000),7]],1,t),5);
 assert.equal(L.hoursLabel(72),'3 days');assert.equal(L.hoursLabel(24),'1 day');assert.equal(L.hoursLabel(36),'36 hours');
 // Cached settings survive going offline.
 mode='offline';const cached=L.createLeague({storage,fetchImpl:async()=>{throw new Error('offline');},now}).snapshot(5);assert.equal(cached.known,true);assert.equal(cached.teams.find(x=>x.id==='ravenclaw').points,20);

 // The game missing from settings.games (or switched off) earns nothing yet.
 assert.equal(L.gameSettings({...settings,games:{}}),null);assert.equal(L.gameSettings({...settings,games:{wordramp:{enabled:false}}}),null);assert.equal(L.gameSettings({...settings,enabled:false}),null);assert(L.gameSettings(settings));
 const fresh=L.createLeague({storage:memoryStorage(),fetchImpl:async()=>{throw new Error('offline');},now}).snapshot(5);assert.equal(fresh.known,false);assert.equal(fresh.game,null);assert.equal(fresh.capacity,L.LEAGUE_FALLBACK.capacity);

 // A slow League times out and queues instead of hanging the result screen.
 {const slow=L.createLeague({storage:memoryStorage(),now,timeoutMs:50,fetchImpl:(url,init)=>new Promise((_,reject)=>init.signal.addEventListener('abort',()=>reject(new Error('aborted'))))});
  assert.equal(await slow.start({runId:'s',grade:5,team:'ravenclaw',arena:0,pace:'relaxed'}),null);}
 console.log('PASS: English League module with a mocked endpoint: config URL/off (no calls at all), device id, start fields without any points value, claim success/team-limit/device-limit/off/duplicate, final too-fast/expired refusals, outbox retry for network/5xx/retry and the 47-hour drop, pool expiry, strength formula, cached settings offline, missing game, request timeout.');
})().catch(e=>{console.error(e);process.exit(1);});
