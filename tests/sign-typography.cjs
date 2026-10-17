const assert=require('node:assert/strict');
const {wordFontSize,categoryTitle,laneLayout}=require('./layout-compiled.cjs');
global.window={};for(const f of ['language-bank','repair-bank','match-bank','emoji-bank','game-core'])require('../dist/'+f+'.js');
const labels=new Set(['Personality','Appearance','Appearance Words','Personality Traits','hard-working']);
for(const grade of window.LANGUAGE_BANK)for(const unit of grade.units){
 for(const item of window.MATCH_BANK[unit.id]){
  for(const option of item.options||[item.answer,...item.decoys]){
   labels.add(option);
   if(item.type==='grammar')labels.add(item.prompt.replace(/^(GRAMMAR|PAST TENSE):\s*/,'').replace(/_{2,}/,option));
  }
 }
 for(const item of window.REPAIR_BANK[unit.id])for(const block of item.blocks)labels.add(block);
 for(const item of unit.translations)labels.add(item.tr);
 for(const category of unit.categories){labels.add(categoryTitle(category.title));for(const word of category.yes)labels.add(word);}
 for(const task of window.RallyCore.createRace(unit,'challenge',2,17).tasks){
  for(const text of task.rows[0].options)labels.add(task.kind==='pedestrian'?categoryTitle(text):text);
  for(const p of task.people||[])labels.add(p.word);
 }
}
assert.equal(categoryTitle('PERSONALITY'),'Personality');assert.equal(categoryTitle('APPEARANCE WORDS'),'Appearance Words');assert.equal(categoryTitle('TV PROGRAMMES'),'TV Programmes');
// Independent proportional-font metric fixtures exercise wide capitals,
// narrow glyphs and unusually long words. Runtime uses the browser's canvas
// and actual computed font, rather than character counts or fixed cut-offs.
let cases=0;
for(const width of [280,320,360,390,430,568,768,1440])for(const stretch of [.9,1,1.12])for(const text of labels){
 const card=laneLayout(width,[{x:width/2-115},{x:width/2},{x:width/2+115}])[0],base=width<360?12:14,inner=card.width-14;
 const units=word=>Array.from(word).reduce((n,c)=>n+(/[ilIt.,'!]/.test(c)?.28:/[MW@]/.test(c)?.9:/[A-Z]/.test(c)?.7:.56),0)*stretch;
 const size=wordFontSize(text,inner,base,word=>units(word)*base);
 assert(size>0&&size<=base);
 for(const word of text.trim().split(/\s+/u))assert(units(word)*size<=inner+.01,`${word} must fit as a whole word at ${width}px`);
 cases++;
}
assert.equal(wordFontSize('a great library',150,14,w=>w.length*7),14,'Short text retains its preferred size');
console.log(`PASS: ${cases} whole-word font fits over ${labels.size} real answer/category/visitor labels at phone, tablet and desktop widths; spaces wrap, complete words fit, category case and TV acronym retained. Font metric fixtures are not browser screenshots.`);
