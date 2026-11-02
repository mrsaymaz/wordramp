// "Who are you?" (English League v11.7.0): the roster request, its checks and
// cache, the student field in start, the credited grade/team in the win
// message, and the picker steps. Mocked endpoint and a DOM double: no network.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const L=require('./league-compiled.cjs'),P=require('./student-picker-compiled.cjs');
const memoryStorage=()=>{const data={};return {getItem:k=>k in data?data[k]:null,setItem:(k,v)=>{data[k]=String(v);},data};};
function endpoint(handler){
  const calls=[];
  const fetchImpl=async(url,init)=>{const body=JSON.parse(init.body);calls.push(body);const r=await handler(body);if(r instanceof Error)throw r;return {ok:r.status>=200&&r.status<300,status:r.status,json:async()=>r.body};};
  return {calls,fetchImpl};
}
const ok=body=>({status:200,body:{status:'success',...body}});
const ROSTER={rosterVersion:1,grade:5,classes:['5-A','5-C'],students:[
  {id:'5-A:slytherin:0',name:'Zeynep',className:'5-A',team:'slytherin'},
  {id:'5-A:slytherin:1',name:'Ömer',className:'5-A',team:'slytherin'},
  {id:'5-A:slytherin:2',name:'Can',className:'5-A',team:'slytherin'},
  {id:'5-A:slytherin:3',name:'Çağla',className:'5-A',team:'slytherin'},
  {id:'5-A:slytherin:4',name:'İrem',className:'5-A',team:'slytherin'},
  {id:'5-A:slytherin:5',name:'Ilgaz',className:'5-A',team:'slytherin'},
  {id:'5-A:slytherin:6',name:'Şule',className:'5-A',team:'slytherin'},
  {id:'5-A:slytherin:7',name:'Sena',className:'5-A',team:'slytherin'},
  {id:'5-A:gryffindor:0',name:'Ada',className:'5-A',team:'gryffindor'},
  {id:'5-C:hufflepuff:0',name:'<img src=x onerror=alert(1)>',className:'5-C',team:'hufflepuff'},
  {id:'5-C:slytherin:0',name:'Emir',className:'5-C',team:'slytherin'},
  // Every one of these is dropped.
  {id:'bad id!',name:'Space in id',className:'5-A',team:'slytherin'},
  {id:'x'.repeat(101),name:'Too long',className:'5-A',team:'slytherin'},
  {id:'5-A:dragons:0',name:'Wrong team',className:'5-A',team:'dragons'},
  {id:'5a:slytherin:0',name:'Wrong class',className:'5a',team:'slytherin'},
  {id:'6-A:slytherin:0',name:'Other grade',className:'6-A',team:'slytherin'},
  {id:'5-A:slytherin:9',name:'',className:'5-A',team:'slytherin'},
  {id:'5-A:slytherin:0',name:'Duplicate',className:'5-A',team:'slytherin'},
  null,'text',{name:'No id',className:'5-A',team:'slytherin'}]};

(async()=>{
 // Student IDs: only the roster form is ever sent.
 for(const good of ['5-A:slytherin:0','8-B:ravenclaw:12','a_b-c'])assert(L.validStudentId(good),good);
 for(const bad of ['','a b','x'.repeat(101),null,undefined,5,'<b>','5-A;drop','ü'])assert.equal(L.validStudentId(bad),false,String(bad));

 // Roster: public request {action:'roster',grade}, checked, cached per grade.
 let online=true;const storage=memoryStorage();
 const e=endpoint(body=>!online?new Error('offline'):body.action==='roster'?(body.grade===5?ok(ROSTER):body.grade===6?ok({grade:6,classes:['6-C'],students:[{id:'6-C:slytherin:0',name:'Deniz',className:'6-C',team:'slytherin'}]}):{status:400,body:{status:'error'}}):ok({ticket:'T'}));
 const league=L.createLeague({api:'https://league.test/api/ulti',storage,fetchImpl:e.fetchImpl,now:()=>1000});
 assert.equal(league.cachedRoster(5),null,'Nothing cached on a new device');
 const r5=await league.roster(5);
 assert.deepEqual(e.calls[0],{action:'roster',grade:5},'Only the action and grade: no key, PIN or device');
 assert.equal(r5.online,true);assert.deepEqual(r5.classes,['5-A','5-C']);
 assert.equal(r5.students.length,11,'Bad ids, classes, teams, other grades, empty names and duplicates are dropped');
 assert(r5.students.every(s=>Object.keys(s).sort().join()==='className,id,name,team'),'Only the four roster fields are kept');
 assert.equal(r5.students.find(s=>s.id==='5-A:slytherin:0').name,'Zeynep','The first entry for an id wins');
 assert.equal(await league.roster(9),null,'Grades are 5-8 only');assert.equal(await league.roster('x'),null);
 assert.equal(e.calls.length,1,'An invalid grade makes no request');
 const unknown=await league.roster(7);assert.equal(unknown,null,'{status:"error"} with nothing cached gives null');
 await league.roster(6);
 // Offline: the cached list comes back at once, marked offline.
 online=false;
 const again=L.createLeague({api:'https://league.test/api/ulti',storage,fetchImpl:e.fetchImpl});
 assert.equal(again.cachedRoster(5).students.length,11);assert.equal(again.cachedRoster(5).online,false);
 const offline=await again.roster(5);assert.equal(offline.online,false);assert.deepEqual(offline.classes,['5-A','5-C']);
 assert.equal((await again.roster(6)).students[0].name,'Deniz','Each grade has its own cache');
 assert.equal(await again.roster(8),null,'Offline and never cached: null (the picker says the list cannot load)');
 // A broken cache is ignored rather than trusted.
 {const s=memoryStorage();s.setItem('wordramp-league.v1',JSON.stringify({rosters:{5:{students:'nope'}}}));assert.equal(L.createLeague({api:'x',storage:s,fetchImpl:e.fetchImpl}).cachedRoster(5),null);}
 // League off: no roster, no requests at all.
 {let called=0;const off=L.createLeague({api:'',storage:memoryStorage(),fetchImpl:async()=>{called++;}});assert.equal(await off.roster(5),null);assert.equal(off.cachedRoster(5),null);assert.equal(called,0);}

 // start: the student field only when valid; otherwise exactly as before.
 online=true;
 const t=endpoint(body=>body.action==='start'?ok({ticket:'T-'+body.arena}):ok({points:8,requested:8,deviceWins:1,grade:5,team:'slytherin',student:{id:'5-A:slytherin:0',name:'Zeynep',className:'5-A'}}));
 const lt=L.createLeague({api:'https://league.test/api/ulti',storage:memoryStorage(),fetchImpl:t.fetchImpl});
 const base={grade:7,team:'gryffindor',pace:'relaxed',unit:'g7u2'};
 await lt.start({...base,runId:'a',arena:0,student:'5-A:slytherin:0'});
 assert.equal(t.calls[0].student,'5-A:slytherin:0');assert.equal(t.calls[0].game,'wordramp','This game keeps its own League id');
 assert.deepEqual(Object.keys(t.calls[0]).sort(),['action','arena','device','game','grade','pace','student','team','unit']);
 for(const [runId,student] of [['b','bad id!'],['c',''],['d',undefined],['e','x'.repeat(101)],['f',{id:'5-A:slytherin:0'}]]){
  await lt.start({...base,runId,arena:1,student});
  const sent=t.calls.at(-1);assert.equal('student' in sent,false,'No student field for '+JSON.stringify(student));
  assert.deepEqual(Object.keys(sent).sort(),['action','arena','device','game','grade','pace','team','unit'],'Without a name the start is as before');
 }
 assert(!t.calls.some(c=>'points' in c),'The game never sends a points value');
 // claim: the credited grade and team come back; invalid values are ignored.
 const claimed=await lt.claim('a');
 assert.deepEqual([claimed.state,claimed.points,claimed.grade,claimed.team],['counted',8,5,'slytherin']);
 const odd=endpoint(body=>body.action==='start'?ok({ticket:'T'}):ok({points:4,requested:4,grade:'5; drop',team:'dragons'}));
 const lo=L.createLeague({api:'x',storage:memoryStorage(),fetchImpl:odd.fetchImpl});await lo.start({...base,runId:'z',arena:0});
 const plain=await lo.claim('z');assert.equal('grade' in plain,false);assert.equal('team' in plain,false,'An older League reply has no grade/team: the game uses its own');

 // The win message uses the League's credited grade/team when present.
 const app=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
 assert.match(app,/renderLeagueResult\(r,r\.grade\?\?leagueGradeNow,teamById\(r\.team\)\|\|leagueTeam\)/,'Claim reply grade/team first, then the game\'s own');
 assert.match(app,/student:r\.studentId\}/,'Every start ticket carries the race\'s student id');
 assert.match(app,/race\.studentId=saved\.student\?\.id\|\|''/,'The race takes the saved student');
 const msg=app.match(/function leagueMessage\(result,grade,team\)\{[\s\S]*?\n\}/)[0];
 const leagueMessage=new Function(msg+';return leagueMessage;')();
 const slytherin={name:'Slytherin'},gryffindor={name:'Gryffindor'};
 const show=(r,fallbackGrade,fallbackTeam)=>leagueMessage(r,r.grade??fallbackGrade,(r.team==='slytherin'?slytherin:null)||fallbackTeam).text;
 assert.equal(show(claimed,7,gryffindor),'+8 Ulti for Grade 5 Slytherin!','A named student\'s own class grade and team');
 assert.equal(show(plain,7,gryffindor),'+4 Ulti for Grade 7 Gryffindor!','Fallback: the game\'s own grade and team');

 // Turkish sort order: Ç after C, I before İ, Ö after O, Ş after S.
 const sorted=P.sortStudents(r5.students.filter(s=>s.className==='5-A'&&s.team==='slytherin')).map(s=>s.name);
 assert.deepEqual(sorted,['Can','Çağla','Ilgaz','İrem','Ömer','Sena','Şule','Zeynep']);
 assert(P.collateNames('Şule','Sena')>0&&P.collateNames('Çağla','Can')>0&&P.collateNames('İrem','Ilgaz')>0);

 // Team filtering, the class step and "Show everyone".
 const roster={classes:r5.classes,students:r5.students};
 const p=(over={})=>({grade:5,team:'slytherin',all:false,className:null,studentId:null,roster,loading:false,offline:false,...over});
 assert.deepEqual(P.pickerClasses(roster.classes,roster.students,'slytherin'),['5-A','5-C']);
 assert.deepEqual(P.pickerClasses(roster.classes,roster.students,'hufflepuff'),['5-C'],'Only classes with names in this team');
 assert.deepEqual(P.pickerClasses(roster.classes,roster.students,'gryffindor',true),['5-A','5-C'],'Everyone lists every class');
 assert.deepEqual(P.pickerStep(p()),{step:'classes',classes:['5-A','5-C']});
 const classes=P.pickerMarkup(p());
 assert.match(classes,/Grade 5 Slytherin! Which class are you in\?/);assert.equal((classes.match(/data-student="class"/g)||[]).length,2);
 assert(!classes.includes('data-student="grade"'),'No grade tabs: the lesson grade is used');
 assert.match(classes,/Not here\? Show everyone/);assert.match(classes,/Not on the list\? Play without a name/);assert.match(classes,/data-student="close"/);
 const names=html=>[...html.matchAll(/data-student="pick"[^>]*><i aria-hidden="true"><\/i><span>([^<]*)<\/span>/g)].map(m=>m[1]);
 const teamNames=P.pickerMarkup(p({className:'5-A'}));
 assert.deepEqual(names(teamNames),['Can','Çağla','Ilgaz','İrem','Ömer','Sena','Şule','Zeynep'],'Teammates only (no Ada of Gryffindor), Turkish order');
 assert.match(teamNames,/Hello, 5-A Slytherin! Tap your name\./);assert.match(teamNames,/data-student="back"/);
 // One class for this team (Hufflepuff in grade 5, or a one-class grade such as 6-C): straight to the names.
 assert.deepEqual(P.pickerStep(p({team:'hufflepuff'})),{step:'names',className:'5-C',auto:true});
 const one=P.pickerMarkup(p({team:'hufflepuff'}));assert(!one.includes('data-student="class"'));assert(!one.includes('data-student="back"'),'No class step to go back to');
 const g6={classes:['6-C'],students:[{id:'6-C:slytherin:0',name:'Deniz',className:'6-C',team:'slytherin'},{id:'6-C:ravenclaw:0',name:'Eda',className:'6-C',team:'ravenclaw'}]};
 assert.deepEqual(P.pickerStep(p({grade:6,roster:g6})),{step:'names',className:'6-C',auto:true});
 assert.deepEqual(names(P.pickerMarkup(p({grade:6,roster:g6}))),['Deniz']);
 // Show everyone: grade tabs 5-8, every team, starting at the classes.
 const all=P.pickerMarkup(p({all:true}));
 assert.equal((all.match(/data-student="grade"/g)||[]).length,4);assert.match(all,/data-value="5" class="selected" aria-pressed="true">Grade 5/);
 assert(!all.includes('Show everyone'),'Already showing everyone');assert.match(all,/Play without a name/);
 assert.deepEqual(P.pickerStep(p({all:true,grade:6,roster:g6})),{step:'classes',classes:['6-C']},'Everyone keeps its grade tabs');
 assert.deepEqual(names(P.pickerMarkup(p({all:true,className:'5-A'}))),['Ada','Can','Çağla','Ilgaz','İrem','Ömer','Sena','Şule','Zeynep']);
 // Confirmation.
 const confirm=P.pickerMarkup(p({studentId:'5-A:slytherin:0'}));
 assert.match(confirm,/Are you Zeynep\?/);assert.match(confirm,/5-A · Team Slytherin/);assert.match(confirm,/Your wins add Ulti to Grade 5 Slytherin\./);
 assert.match(confirm,/data-student="back-names">No, go back</);assert.match(confirm,/data-student="confirm">Yes, that's me!</);
 // A student from another grade/team via "everyone": their own grade and team.
 assert.match(P.pickerMarkup(p({all:true,grade:6,roster:g6,studentId:'6-C:ravenclaw:0'})),/Your wins add Ulti to Grade 6 Ravenclaw\./);
 // Names are text, never markup.
 const hostile=P.pickerMarkup(p({all:true,className:'5-C'}));assert(!hostile.includes('<img src=x'));assert.match(hostile,/&lt;img src=x onerror=alert\(1\)&gt;/);
 assert(!P.studentPillMarkup({name:'<b>x</b>',className:'5-A',team:'slytherin'}).includes('<b>x</b>'));
 // Loading, offline (Try again), empty.
 assert.match(P.pickerMarkup(p({roster:null,loading:true})),/Loading the class list/);
 const off=P.pickerMarkup(p({roster:null,offline:true}));assert.match(off,/The class list can't be loaded right now\./);assert.match(off,/data-student="retry">Try again/);assert.match(off,/Play without a name/);
 assert.match(P.pickerMarkup(p({team:'ravenclaw'})),/No names are on the list for Grade 5 Ravenclaw yet/);

 // When to ask, and what is saved.
 assert.equal(P.needsStudent({enabled:true}),true);
 assert.equal(P.needsStudent({enabled:false}),false,'ultiApi "" (League off): no picker');
 assert.equal(P.needsStudent({enabled:true,skip:true}),false,'"Play without a name" is remembered');
 assert.equal(P.needsStudent({enabled:true,student:{id:'5-A:slytherin:0'}}),false,'A chosen name is remembered');
 assert.deepEqual(P.studentRecord(r5.students[0]),{id:'5-A:slytherin:0',name:'Zeynep',className:'5-A',team:'slytherin',grade:5});
 assert.equal(P.savedStudent({id:'bad id',name:'x',className:'5-A',team:'slytherin'}),null);assert.equal(P.savedStudent('x'),null);
 assert.deepEqual(P.savedStudent({...r5.students[0],grade:9,extra:1}),P.studentRecord(r5.students[0]),'A saved student is re-checked on load');
 // The pill.
 assert.match(P.studentPillMarkup(null),/Who are you\?<\/span><small>Choose/);
 assert.match(P.studentPillMarkup(r5.students[0]),/<em>Playing as <\/em><b>Zeynep<\/b> · 5-A<\/span><small>Change/);
 assert.equal(P.studentPillLabel(r5.students[0]),'Playing as Zeynep, 5-A. Change');
 // Wiring: START asks only when needed, the pill sits in the existing LEAGUE row.
 assert.match(app,/\$\('start'\)\.onclick=\(\)=>\{sound\.unlock\(\);if\(needsStudent\(\{enabled:league\.enabled,student:saved\.student,skip:saved\.studentSkip\}\)&&openStudentPicker\(true\)\)return;play\(\);\}/);
 assert.match(app,/picker=\{grade:saved\.grade,team:saved\.teamId\|\|''/,'The garage grade and team filter the list');
 const html=fs.readFileSync(path.join(__dirname,'../public/index.html'),'utf8');
 assert.match(html,/<span class="team-links"><button id="student-button" class="student-pill" hidden[^>]*><\/button><button id="league-button"/,'The pill shares the LEAGUE row, so the garage does not grow');
 console.log('PASS: "Who are you?": roster request (no key) with id/class/team/grade checks and a per-grade offline cache; student field only when valid; credited grade/team in the win message with the game\'s own as fallback; team filtering, one-class grades, Show everyone, Turkish order, escaping, loading/offline/empty; asks only with the League on and remembers the choice.');
})().catch(e=>{console.error(e);process.exit(1);});
