// Picture signs: reviewed Fluent Emoji as the clue (picture to word) or as each
// answer (word to picture). Checks the shipped pictures, that no option can
// also match the picture, how often they appear, and that language content
// never moves the road layout.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
global.window={};for(const name of ['language-bank','repair-bank','match-bank','emoji-bank','game-core'])require(path.join(dist,name+'.js'));
const C=window.RallyCore,E=window.EMOJI_BANK,bank=window.LANGUAGE_BANK,M=window.MATCH_BANK;
const source=JSON.parse(fs.readFileSync(path.join(root,'reference/fluent-emoji/word-emoji.json'),'utf8'));

// The reviewed list, the bank and the shipped files agree.
assert.deepEqual(Object.keys(E.words).sort(),Object.keys(source.words).sort());
for(const stem of new Set(Object.values(E.words)))assert(fs.statSync(path.join(dist,'emoji',stem+'.webp')).size>500,'Picture ships: '+stem);
const answers=new Set(Object.values(M).flat().filter(x=>x.type==='translation').map(x=>x.answer.toLowerCase()));
for(const word of Object.keys(E.words))assert(answers.has(word),'Every pictured word is a played translation: '+word);
for(const group of source.confusable)for(const word of group)assert.equal(E.groups[word],E.groups[group[0]]);

const stats={},layoutFields=race=>JSON.stringify([race.obstacles,race.patterns,race.rivals,race.tasks.map(t=>[t.kind,t.at])]);
let signs=0,races=0;
for(const grade of bank)for(const unit of grade.units)for(let arena=0;arena<3;arena++)for(let seed=1;seed<=6;seed++){
 const difficulty=seed%2?'relaxed':'challenge',race=C.createRace(unit,difficulty,arena,seed);races++;
 const key=`${grade.grade}/${arena}`;stats[key]=stats[key]||{races:0,signs:0};stats[key].races++;
 for(const [i,t] of race.tasks.entries()){
  if(!t.picture)continue;signs++;stats[key].signs++;
  assert.equal(t.type,'translation');assert(['word','image'].includes(t.picture));
  assert(t.picture==='word'?t.kind==='light'&&i===4:(t.kind==='light'&&i===12&&grade.grade<=6)||(t.kind==='junction'&&i===14),'Picture signs keep their slots');
  assert.equal(t.image,C.emojiFor(t.answer));assert.equal(t.options[t.correctIndex],t.answer);assert.equal(new Set(t.options).size,3);
  for(const option of t.options)if(option!==t.answer)assert(C.pictureDistinct(t.answer,option),`Only one option can match the picture: ${unit.id} ${t.answer} / ${option}`);
  if(t.picture==='image'){assert.deepEqual(t.optionImages,t.options.map(C.emojiFor));assert.equal(new Set(t.optionImages).size,3);}
  else assert.equal(t.optionImages,null);
 }
 // Language content has its own random stream: without pictures, or with a
 // different bank, the road (obstacles, traffic, rivals, task positions) is the same.
 const bankCopy=window.EMOJI_BANK;window.EMOJI_BANK=undefined;const plain=C.createRace(unit,difficulty,arena,seed);window.EMOJI_BANK=bankCopy;
 assert.equal(layoutFields(plain),layoutFields(race),'Pictures never move the road layout');
 assert(plain.tasks.every(t=>!t.picture));
}
const trimmed=bank[0].units[0];
const saved=M[trimmed.id];M[trimmed.id]=saved.filter((x,i)=>x.type!=='translation'||i%2);
assert.equal(layoutFields(C.createRace(trimmed,'challenge',1,9)),(M[trimmed.id]=saved,layoutFields(C.createRace(trimmed,'challenge',1,9))),'Editing the language bank never moves the road layout');
for(const grade of [5,6,7,8]){
 const perRace=a=>stats[`${grade}/${a}`].signs/stats[`${grade}/${a}`].races;
 assert(perRace(0)>=.5&&perRace(1)>=.5&&perRace(2)>=1.2,`Grade ${grade} meets picture signs often enough: ${[0,1,2].map(perRace)}`);
 assert(perRace(2)<=3,'Reading stays the main skill');
}
console.log(`PASS: ${Object.keys(E.words).length} reviewed words, ${new Set(Object.values(E.words)).size} shipped Fluent pictures; ${signs} picture signs in ${races} races (${[5,6,7,8].map(g=>g+': '+[0,1,2].map(a=>(stats[g+'/'+a].signs/stats[g+'/'+a].races).toFixed(1)).join('/')).join(', ')} per race by arena), one matching option each; road layout independent of pictures and language bank edits.`);
