// Content and integration checks against the actual supplied grade files.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..'),reference=path.join(root,'reference/language-expansion-2026'),reference2=path.join(root,'reference/language-expansion-2026b');
const referenceFor=item=>item.importTag==='grade-files-2026-10b'?reference2:reference;
global.window={};for(const name of ['language-bank','match-bank','repair-bank','game-core'])require(path.join(root,'dist',name+'.js'));
const bank=window.LANGUAGE_BANK,M=window.MATCH_BANK,R=window.REPAIR_BANK,C=window.RallyCore;
const key=s=>s.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}_]+/gu,' ').trim();
const expectedMap={g5u9:'g5u3',g5u10:'g5u10',g7u11:'g7u5',g7u12:'g7u8',g8u11:'g8u2',g8u12:'g8u2'};
// The second batch numbers its extra topics differently (see expand-language-bank.py).
const expectedMap2={g5u9:'g5u3',g5u10:'g5u9',g6u9:'g6u10',g6u10:'g6u10',g7u12:'g7u12',g8u11:'g8u2',g8u12:'g8u2'};
const expectedTitles={g5u9:'Jobs and Workplaces',g5u10:'At the Toy Shop',g7u11:'Food and Cooking',g7u12:'Travel and Holidays',g8u11:'Shopping and Services',g8u12:'Animals and Pet Care'};
assert.deepEqual(bank.map(g=>[g.grade,g.units.length]),[[5,10],[6,10],[7,12],[8,12]],'Sub-themes must not add or renumber lessons');
for(const [id,title] of Object.entries(expectedTitles))assert.equal(bank.flatMap(g=>g.units).find(u=>u.id===id).title,title);
const report=JSON.parse(fs.readFileSync(path.join(reference,'import-report.json'),'utf8')),report2=JSON.parse(fs.readFileSync(path.join(reference2,'import-report.json'),'utf8'));
let matches=0,repairs=0,sourceChecks=0,questionSigns=0,categoryPairs=0;
const globalIds=new Set();
for(const grade of bank){
 for(const u of grade.units){
  assert(!globalIds.has(u.id));globalIds.add(u.id);
  const sourceIds=new Set();
  for(const collection of ['descriptions','questions','pictures','completions','sentences','translations','categories'])for(const item of u[collection]){
   assert(!sourceIds.has(item.id),`Duplicate source ID ${item.id}`);sourceIds.add(item.id);
   if(item.origin){const file=JSON.parse(fs.readFileSync(path.join(referenceFor(item),item.origin.file),'utf8'));
    assert.equal(file.grade,grade.grade,'Never import across grades');
    assert(file.units.find(x=>x.id===item.origin.unitId)?.[item.origin.collection].some(x=>x.id===item.origin.itemId));sourceChecks++;
   }
  }
  for(const pair of u.categoryPairs||[u.categories.slice(0,2).map(c=>c.id)]){
   assert.equal(pair.length,2);const [a,b]=pair.map(id=>u.categories.find(c=>c.id===id));assert(a&&b);
   const words=new Set(a.yes.map(key));assert(b.yes.every(w=>!words.has(key(w))),'Each visitor belongs to exactly one displayed category');assert(a.yes.length>=2&&b.yes.length>=2);categoryPairs++;
  }
  const ids=new Set();
  for(const item of M[u.id]){
   matches++;assert(!ids.has(item.id),`Duplicate playable ID ${item.id}`);ids.add(item.id);
   assert(sourceIds.has(item.sourceId),`Unknown match source ${item.id}`);
   assert(item.prompt.trim()&&item.answer.trim());
   const options=item.options||[item.answer,...item.decoys];
   assert.equal(new Set(options.map(key)).size,options.length,`Duplicate answer labels ${item.id}`);
   assert.equal(options.filter(x=>x===item.answer).length,1);
   if(item.options)assert.equal(options.length,3);else assert(item.decoys.length>=2);
   if(item.type==='question'){
    questionSigns++;assert(item.reviewPrompt&&item.reviewPrompt!==item.prompt);
    assert(item.prompt.length<=65&&options.every(x=>x.length<=40),'Question signs stay short enough to read while driving');
   }
   if(item.importTag){let review={...item,kind:item.type==='grammar'?'junction':'light'};for(let n=0;n<3;n++){review=C.alternateReview(u,review,C.random(19+n));assert(review,'Repeated misses must retain a review: '+item.id);assert.equal(new Set(review.options).size,3);}}
   if(item.importTag&&item.type==='translation'){
    const meaning=u.translations.find(x=>key(x.en)===key(item.answer));assert(meaning);
    for(const decoy of item.decoys){const other=u.translations.find(x=>x.en===decoy);assert(other);assert.notEqual(key(other.tr),key(meaning.tr),'Do not offer another translation of the correct meaning');}
   }
  }
  for(const item of R[u.id]){
   repairs++;assert(!ids.has(item.id),`Duplicate repair ID ${item.id}`);ids.add(item.id);assert(sourceIds.has(item.sourceId));
   assert.equal(item.blocks.length,3);assert.equal(new Set(item.blocks).size,3);assert(item.blocks.every(x=>x.trim()));assert(item.tr.trim());
   if(item.importTag){assert(item.blocks.every(x=>x.length<=34));assert(item.blocks.join(' ').length<=80);}
  }
  // Generate actual courses, rather than only checking stored arrays: each
  // reviewed new card and category pair must be reachable in normal play.
  const seen=new Set(),pairsSeen=new Set();
  for(let seed=1;seed<=192;seed++){
   const race=C.createRace(u,seed%2?'relaxed':'challenge',seed%3,seed);
   for(const task of race.tasks){
    seen.add(task.id);
    if(task.kind==='pedestrian'){
     pairsSeen.add(task.categoryIds.join('|'));
     for(const person of task.people){const pair=task.categoryIds;
      const categories=pair.map(id=>u.categories.find(c=>c.id===id));assert(categories[person.side].yes.includes(person.word));assert(!categories[1-person.side].yes.includes(person.word));}
    }else if(task.kind==='repair')assert.equal(task.blocks.length,3);
    else {assert.equal(new Set(task.options).size,3);assert.equal(task.options[task.correctIndex],task.answer);}
   }
  }
  for(const item of [...M[u.id],...R[u.id]])if(item.importTag)assert(seen.has(item.id),'Imported item must be playable: '+item.id);
  assert.equal(pairsSeen.size,(u.categoryPairs||[null]).length,'Every connected category pair is playable');
 }
 for(const [dir,file,map,rep,skipped] of [[reference,`grade${grade.grade}.json`,expectedMap,report,[]],[reference2,`grade${grade.grade}-2.json`,expectedMap2,report2,['pilot','plan']]]){
  const source=JSON.parse(fs.readFileSync(path.join(dir,file),'utf8'));
  for(const incoming of source.units){
   const id=map[incoming.id]||incoming.id,u=grade.units.find(x=>x.id===id);assert(u);
   const mapping=rep.mappings.find(x=>x.grade===grade.grade&&x.sourceId===incoming.id);assert.equal(mapping.targetId,id);
   for(const item of incoming.translations)if(!skipped.includes(item.en))assert(u.translations.some(x=>key(x.en)===key(item.en)),`${incoming.id}: missing vocabulary ${item.en}`);
   for(const item of incoming.questions)assert(u.questions.some(x=>key(x.q)===key(item.q)),`${incoming.id}: missing source question ${item.id}`);
   for(const item of incoming.sentences)assert(u.sentences.some(x=>key(x.blocks.join(' '))===key(item.blocks.join(' '))),`${incoming.id}: missing source sentence ${item.id}`);
   if(incoming.id in map)assert(u.subthemes.some(x=>x.title===incoming.title),'Connected topics must be discoverable under their existing lesson');
  }
 }
}
assert.equal(questionSigns,260);
// Second-batch review fixes: these must survive a repeat import.
const all=Object.values(M).flat();
assert.equal(all.find(x=>x.id==='g6u2-ext26-g6u2-t5').prompt,'English for “çalışma arkadaşı”: ','A study partner is not a spouse (eş)');
assert(!all.some(x=>x.importTag==='grade-files-2026-10b'&&x.type==='translation'&&key(x.answer)===key(x.tr)),'No new sign asks for a word spelled the same in both languages');
assert(/___/.test(M.g8u8.find(x=>x.id==='g8u8-ext26b-g8u8-d1').prompt),'Chore verbs are clued with a blank');
assert(/^The (activity|sport) of/.test(M.g8u6.find(x=>x.id==='g8u6-ext26b-g8u6-d1').prompt),'Activity answers get activity clues');
assert.equal(M.g7u12.filter(x=>x.type==='question').length,3,'Travel and Holidays gains reviewed Q&A signs');
for(const u of ['g5u9','g7u11','g7u12'])assert(R[u].some(x=>x.importTag==='grade-files-2026-10b'),'Lessons without imported material gain repairs: '+u);
assert.equal(Object.values(M).flat().filter(x=>!x.importTag).length,792,'Retain every original match ID');
assert.equal(Object.values(R).flat().filter(x=>!x.importTag).length,264,'Retain every original repair ID');
// Regression fixtures for source cards with multiple reasonable choices.
for(const id of ['g6u9-ext26-g6u9-d4','g7u8-ext26-g7u12-d4'])assert(!Object.values(M).flat().find(x=>x.id===id).options.includes('shopkeeper'),'A shopkeeper can also take payments');
assert(!M.g7u2.find(x=>x.id==='g7u2-ext26-g7u2-d4').options.includes('teammate'),'A teammate may also be an athlete');
assert(/no rotating funnel/.test(M.g6u8.find(x=>x.id==='g6u8-ext26-g6u8-d4').prompt),'Distinguish storms from tornadoes');
assert(Object.values(R).flat().some(x=>x.origin?.itemId==='g8u3s1'&&x.blocks.join(' ')==='We peel the potatoes.'));
// Re-running an import must preserve task IDs, progress keys and exact output.
const outputs=['public/language-bank.js','public/match-bank.js','public/repair-bank.js','reference/language-expansion-2026/import-report.json','reference/language-expansion-2026b/import-report.json'];
const hash=f=>createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex');
const before=outputs.map(hash);
execFileSync('python3',[path.join(root,'scripts/expand-language-bank.py')],{stdio:'pipe'});
assert.deepEqual(outputs.map(hash),before,'A repeat import must be byte-for-byte stable');
console.log(`PASS: both batches of grade files (eight files) mapped within their grades; 44 existing lessons preserved; ${sourceChecks} source/provenance checks, ${matches} playable signs, ${repairs} three-block repairs, ${questionSigns} reviewed Q&A signs and ${categoryPairs} disjoint category pairs. 8,448 generated courses verify item reachability; repeat import is stable.`);
// v0.24: a random distractor never contains the answer as a whole word (or
// the reverse), e.g. “kapı” → gate is never paired with “school gate”.
{const C=window.RallyCore,w=t=>' '+String(t).toLowerCase().replace(/[^a-z0-9çğıöşü' ]+/g,' ').trim()+' ';let signs=0;
 for(const g of window.LANGUAGE_BANK)for(const u of g.units)for(let arena=0;arena<3;arena++)for(const seed of [1,2]){const s=C.createRace(u,'relaxed',arena,seed);for(const t of s.tasks)if(t.options&&!['pedestrian','repair'].includes(t.kind)&&!['grammar','question'].includes(t.type)){signs++;for(const o of t.options)if(o!==t.answer)assert(!w(o).includes(w(t.answer))&&!w(t.answer).includes(w(o)),`Ambiguous distractor ${u.id}: ${t.answer} / ${o}`);}}
 console.log(`PASS: ${signs} generated vocabulary signs without answer-containing distractors.`);}
