// Interaction integration checks using a small DOM double. No browser rendering.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let layoutReads=0;
class Element{
 constructor(tag='div',attrs={}){this.tagName=tag.toUpperCase();this.attrs=attrs;this.id=attrs.id;this.dataset={};for(const [k,v]of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;this.hidden='hidden'in attrs;this.disabled='disabled'in attrs;this.children=[];this.listeners={};this.style={setProperty(k,v){this[k]=v;}};this.classes=new Set((attrs.class||'').split(/\s+/));this.classList={add:(...s)=>s.forEach(x=>this.classes.add(x)),remove:(...s)=>s.forEach(x=>this.classes.delete(x)),toggle:(s,on)=>{on??=!this.classes.has(s);on?this.classes.add(s):this.classes.delete(s);return on;},contains:s=>this.classes.has(s)};this.captures=new Set();this._text='';}
 append(e){e.parentElement=this;this.children.push(e);}
 set innerHTML(html){this.children=[];parse(html,this);}
 insertAdjacentHTML(where,html){const box=new Element();parse(html,box);box.children.forEach(c=>c.parentElement=this);this.children=where==='afterbegin'?[...box.children,...this.children]:[...this.children,...box.children];}
 get innerHTML(){return '';}
 set textContent(text){this._text=String(text);this.children=[];}
 get textContent(){return this._text+this.children.map(n=>n.textContent).join('');}
 set className(v){this.classes=new Set(v.split(/\s+/));}
 get className(){return [...this.classes].join(' ');}
 get nextElementSibling(){const a=this.parentElement.children;return a[a.indexOf(this)+1];}
 matches(selector){if(selector.startsWith('.'))return this.classes.has(selector.slice(1));if(selector.startsWith('[')){const [k,v]=selector.slice(1,-1).split('=');return k in this.attrs&&(!v||this.attrs[k]===v.replaceAll('"',''));}return this.tagName.toLowerCase()===selector;}
 querySelectorAll(selector){const out=[];const visit=e=>{for(const child of e.children){if(selector.split(',').some(s=>child.matches(s)))out.push(child);visit(child);}};visit(this);return out;}
 querySelector(s){return this.querySelectorAll(s)[0]||null;}
 closest(s){return this.matches(s)?this:this.parentElement?.closest(s);}
 setAttribute(k,v){this.attrs[k]=String(v);}
 addEventListener(n,fn){(this.listeners[n]||=[]).push(fn);}
 dispatch(n,props={}){const e={target:this,pointerId:1,button:0,detail:1,preventDefault(){},stopPropagation(){},...props};this['on'+n]?.(e);for(const f of this.listeners[n]||[])f(e);}
 click(){if(!this.disabled)this.dispatch('click');}
 focus(){document.activeElement=this;}
 setPointerCapture(id){this.captures.add(id);}hasPointerCapture(id){return this.captures.has(id);}releasePointerCapture(id){this.captures.delete(id);}
 getBoundingClientRect(){layoutReads++;return this.id==='hud'?{top:14,bottom:67,height:53}:this.id==='controls'?{top:760,bottom:825,height:65}:{left:20,right:120,top:250,bottom:330,width:100,height:80};}
 get offsetWidth(){return 100;}get offsetHeight(){layoutReads++;return 65;}
}
const decodeHTML=text=>text.replace(/&(?:amp|lt|gt|quot|#39);/g,value=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'\"','&#39;':"'"}[value]));
function parse(html,parent){const stack=[parent];for(const token of html.matchAll(/<\/?([a-z][\w-]*)([^>]*)>|([^<]+)/gi)){if(token[3]){stack.at(-1)._text+=decodeHTML(token[3]);continue;}const tag=token[1].toLowerCase();if(token[0].startsWith('</')){if(stack.length>1)stack.pop();continue;}const attrs={};for(const m of token[2].matchAll(/([\w-]+)(?:="([^"]*)"|='([^']*)')?/g))attrs[m[1]]=decodeHTML(m[2]??m[3]??'');const e=new Element(tag,attrs);stack.at(-1).append(e);if(!['meta','link','input','br','hr','img'].includes(tag)&&!/\/\s*>$/.test(token[0]))stack.push(e);}}
const root=new Element();parse(fs.readFileSync('dist/index.html','utf8'),root);
const findId=id=>{let found;const visit=e=>{if(e.id===id)found=e;e.children.forEach(visit);};visit(root);return found;};
global.document={documentElement:root.querySelector('html'),body:root.querySelector('body'),getElementById:findId,querySelectorAll:s=>root.querySelectorAll(s),activeElement:new Element(),listeners:{},addEventListener(n,f){(this.listeners[n]||=[]).push(f);}};
// Canvas font metrics are deterministic here; actual browser rendering is separate QA.
global.getComputedStyle=card=>({fontSize:card.classList.contains('person-word')?'14px':'14px',fontWeight:'750',fontFamily:'sans-serif',paddingLeft:'5px',paddingRight:'5px',borderLeftWidth:'2px',borderRightWidth:'2px'});
document.createElement=()=>({getContext:()=>({font:'',measureText(text){const size=parseFloat(this.font.match(/([\d.]+)px/)[1]);return {width:Array.from(text).reduce((n,c)=>n+(/[ilIt.,'!]/.test(c)?.28:/[MW@]/.test(c)?.9:/[A-Z]/.test(c)?.7:.56),0)*size};}})});
global.innerWidth=390;global.innerHeight=844;global.navigator={};let storage=JSON.stringify({grade:5,unit:'g5u1',difficulty:'challenge',crosswalkTutorial:true,sound:false,fuel:60,progress:{}});
global.localStorage={getItem:()=>storage,setItem:(k,v)=>storage=v};global.window={visualViewport:{width:390,height:672,scale:1,listeners:{},addEventListener(n,f){(this.listeners[n]||=[]).push(f);}},listeners:{},matchMedia:()=>({matches:false,addEventListener(){}}),addEventListener(n,f){(this.listeners[n]||=[]).push(f);}};
let selectedRanges=1,selectionClears=0;window.getSelection=()=>({get rangeCount(){return selectedRanges;},removeAllRanges(){selectedRanges=0;selectionClears++;}});
for(const file of ['language-bank','repair-bank','match-bank','emoji-bank','game-core'])require('../dist/'+file+'.js');
Object.assign(global,require('./presentation-compiled.cjs'),require('./progression-compiled.cjs'),require('./layout-compiled.cjs'),require('./ulti-compiled.cjs'),require('./league-compiled.cjs'));
// Practice-only copy: config.js ultiApi '' means no League UI and no requests.
let leagueRequests=0;global.fetch=async()=>{leagueRequests++;throw new Error('No network in UI tests');};window.WORDRAMP_CONFIG={ultiApi:''};
global.Sound=class{unlock(){}tone(){}update(){}};
global.RallyScene=class{constructor(){this.currentLane=0;}resize(){}setup(){}clearGate(){}setCosmetics(look){this.look=look;}setPreferences(p){this.preferences=p;}samplePerformance(){}update(){}rivalProjection(){return [];}isCarHit(x,y){return y>500;}pedestrianProjection(){return Array.from({length:4},()=>({x:195,y:300,visible:true}));}roadProjection(){return {prompt:{x:195,y:200},answers:[{x:80,y:320},{x:195,y:320},{x:310,y:320}]};}};
let nextFrame;global.requestAnimationFrame=cb=>nextFrame=cb;global.setTimeout=fn=>fn();
const source=fs.readFileSync('app.js','utf8').replace(/^import .*;\n/gm,'');vm.runInThisContext(source,{filename:'app-ui-test.js'});
const el=findId,C=window.RallyCore;
assert.equal(window.WORDRIFT,window.WORDSHIFT,'The old API remains an alias after rebranding');assert.equal(window.WORDRAMP,window.WORDRIFT,'Wordramp is the current API name; older names stay aliases');assert.equal(window.WORDRIFT.version,'0.28.0');assert.equal(window.WORDRIFT.settings.fuel,60,'Existing saved fuel loads after renaming');
assert(el('pause').closest('.hud-top'));assert(el('fuel-value').closest('.nitro-pod'));assert(el('streak-count').closest('.nitro-pod'));assert(!el('hud').querySelector('.race-meta'));assert(!el('hud').querySelector('.accuracy-pill'));assert(!el('race-position-feedback'));assert(!el('nitro-hint'));
assert.equal(document.documentElement.style['--play-height'],'672px','Browser controls reserve space even when innerHeight stays 844');
window.visualViewport.height=396;for(const f of window.visualViewport.listeners.resize)f();assert(document.body.classList.contains('short-viewport'));assert.equal(document.documentElement.style['--play-height'],'396px');
window.visualViewport.scale=2;window.visualViewport.height=198;for(const f of window.visualViewport.listeners.resize)f();assert.equal(document.documentElement.style['--play-height'],'396px','Pinch zoom must not rebuild the game at half its size');
window.visualViewport.scale=1;window.visualViewport.height=788;for(const f of window.visualViewport.listeners.resize)f();assert.equal(document.documentElement.style['--play-height'],'788px');assert(!document.body.classList.contains('short-viewport'));
window.visualViewport.width=568;window.visualViewport.height=242;for(const f of window.visualViewport.listeners.resize)f();assert(document.body.classList.contains('compact-landscape'),'Short landscape uses visible dimensions even if CSS/window height remains larger');window.visualViewport.width=390;window.visualViewport.height=788;for(const f of window.visualViewport.listeners.resize)f();assert(!document.body.classList.contains('compact-landscape'));
assert.deepEqual(window.WORDRAMP.settings.tutorial,{done:true,drive:true,steer:true,nitro:true},'Players who saw the old welcome guide skip the Driving School and coach');
assert(el('start').disabled,'A pupil explicitly chooses a team before racing');
assert.equal(document.querySelectorAll('[data-diff]').length,2);
// The reference layout keeps arenas first, four visible team cards, then
// one lesson card beside the two pace choices. Grade/unit stay one tap away.
const panel=el('lesson-picker').closest('.garage-panel');
assert(panel.children.indexOf(el('arena-cards'))<panel.children.indexOf(panel.querySelector('.team-choices')));
assert(el('lesson-picker').closest('.lesson-pace-row'));assert(panel.querySelector('.pace-section'));
assert.equal(document.querySelectorAll('[data-team]').length,4);assert(document.querySelectorAll('[data-team]').every(b=>b.querySelector('.team-crest')&&b.querySelector('.team-points')));
let lessonSelections=0;
for(const grade of window.LANGUAGE_BANK)for(const u of grade.units){
 el('lesson-picker').click();assert(!el('modal-backdrop').hidden);assert(el('modal').classList.contains('lessons-modal'));assert.equal(el('modal-title').textContent,'Lessons');assert.equal(el('lessons-intro').textContent,'Choose your lesson');assert.equal(document.querySelectorAll('[data-grade]').length,4);
 assert.deepEqual(document.querySelectorAll('[data-grade]').map(b=>b.attrs['aria-label']),['Grade 5 A1','Grade 6 A1+','Grade 7 A2','Grade 8 A2+']);
 const before=window.WORDRIFT.settings.grade;document.querySelectorAll('[data-grade]').find(b=>+b.dataset.grade===grade.grade).click();assert.equal(window.WORDRIFT.settings.grade,before,'Draft grade changes wait for Apply');
 assert.equal(el('unit').tagName,'DIV','Theme/unit is an open list, not a select');assert.equal(el('unit').children.length,grade.units.length,'The unit list follows the draft grade');
 assert.deepEqual(el('unit').children.map(b=>b.querySelector('.unit-number').textContent),grade.units.map((_,i)=>String(i+1)));
 assert.deepEqual(el('unit').children.map(b=>b.querySelector('.unit-title').textContent),grade.units.map(u=>u.title),'Every complete title appears in curriculum order');
 for(const row of el('unit').children){const item=grade.units.find(u=>u.id===row.dataset.unit),summary=row.querySelector('.unit-summary');assert.equal(row.querySelector('.unit-title').tagName,'STRONG');assert.equal(summary.textContent,lessonSummary(item));assert(summary.textContent.length>=40&&summary.textContent.length<=125,'A short specific description accompanies every unit');assert.equal(row.attrs['aria-describedby'],summary.id);const subthemes=row.querySelector('.unit-subthemes');assert.equal(!!subthemes,!!item.subthemes?.length);if(subthemes)for(const subtheme of item.subthemes)assert(subthemes.textContent.includes(subtheme.title),'Connected sub-themes are visible under the existing lesson');}
 const stableRows=el('unit').children.slice();
 const row=el('unit').children.find(b=>b.dataset.unit===u.id);row.focus();row.click();assert.deepEqual(el('unit').children,stableRows,'Changing selection preserves the list and focus');assert.equal(document.activeElement,row);assert(row.classList.contains('selected'));assert.equal(row.attrs['aria-pressed'],'true');assert.equal(el('unit').children.filter(b=>b.attrs['aria-pressed']==='true').length,1);assert.equal(window.WORDRIFT.settings.grade,before,'Unit taps wait for Apply');assert.equal(el('lesson-preview').textContent,u.title);
 el('lesson-apply').click();assert(el('modal-backdrop').hidden);assert(!el('modal').classList.contains('lessons-modal'));assert.equal(window.WORDRIFT.settings.grade,grade.grade);assert.equal(window.WORDRIFT.settings.unit,u.id);assert.equal(el('lesson-unit').textContent,u.title);assert.equal(el('lesson-grade').textContent,String(grade.grade));lessonSelections++;
}
const savedLesson=window.WORDRIFT.settings.unit;el('lesson-picker').click();document.querySelectorAll('[data-grade]').find(b=>b.dataset.grade==='5').click();for(const fn of document.listeners.keydown)fn({key:'Escape',preventDefault(){}});assert(el('modal-backdrop').hidden);assert.equal(window.WORDRIFT.settings.unit,savedLesson,'Cancel/Escape preserves the lesson');
el('lesson-picker').click();document.querySelectorAll('[data-grade]').find(b=>b.dataset.grade==='7').click();assert.deepEqual(el('unit').children.slice(0,3).map(b=>b.querySelector('.unit-title').textContent),['Appearance and Personality','Sports','Biographies']);assert.equal(el('unit').children[0].querySelector('.unit-summary').textContent,'Describing appearance and personality traits, and comparing people.');el('unit').children[2].click();el('lesson-close').click();assert.equal(window.WORDRIFT.settings.unit,savedLesson,'Closing Lessons cancels the draft');assert(!el('modal').classList.contains('lessons-modal'));
el('lesson-picker').click();document.querySelectorAll('[data-grade]').find(b=>b.dataset.grade==='5').click();el('unit').children.find(b=>b.dataset.unit==='g5u1').click();el('lesson-apply').click();
console.log(`PASS: ${lessonSelections} grade/unit selections from the compact lesson card; Lessons heading, four grade/level options, bold numbered titles and 44 unit descriptions; stable keyboard focus, draft selection, Apply/Cancel/Close/Escape and unchanged setup ordering.`);
for(const t of TEAMS){document.querySelectorAll('[data-team]').find(b=>b.dataset.team===t.id).click();assert.equal(window.WORDSHIFT.settings.teamId,t.id);assert.equal(window.WORDSHIFT.scene.look.color,t.color);}
assert(!el('start').disabled);assert(!el('ulti-button'),'Browser-only team points are retired');assert(document.querySelectorAll('.team-points').every(p=>p.hidden),'Practice-only copies show no team Ulti points');assert.equal(window.WORDRIFT.ulti.enabled,false);
el('start').click();let race=window.WORDSHIFT.race;assert.equal(race.teamId,'ravenclaw');assert(race.runId);assert.equal(race.status,'countdown');race.status='driving';
assert.equal(selectedRanges,0,'Starting a race removes an old browser selection');assert.equal(selectionClears,1);
function nativeGesture(type,target){let blocked=false;el('app').dispatch(type,{target,preventDefault(){blocked=true;}});return blocked;}
selectedRanges=1;el('world').dispatch('pointerdown',{clientX:195,clientY:600,pointerId:600});assert(race.accelerating);assert.equal(selectedRanges,0,'A road press clears selection handles that already existed');
const image=new Element('img');el('world').append(image);
for(const type of ['selectstart','dragstart','contextmenu'])for(const target of [el('world'),el('speed'),el('time'),el('nitro').querySelector('svg'),image]){assert(nativeGesture(type,target),type+' must be blocked on game content');assert(race.accelerating,'Native browser gestures do not release a held car');assert(el('world').hasPointerCapture(600));}
el('world').dispatch('pointerup',{clientX:195,clientY:600,pointerId:600});assert(!race.accelerating,'Releasing the finger still releases acceleration');el('world').children.pop();
for(const control of [new Element('input'),new Element('textarea'),new Element('select'),new Element('span',{contenteditable:'true'}),new Element('span',{contenteditable:'plaintext-only'})]){
 const text={parentElement:control};for(const type of ['selectstart','dragstart','contextmenu']){assert(!nativeGesture(type,control),'Native editing remains available');assert(!nativeGesture(type,text),'Text nodes inside editable controls remain editable');}
}
console.log('PASS: native selection, drag and context menus are blocked on held car/canvas, HUD, icons and images; old selections clear, pointer holds survive, release works and genuine form editing remains available.');

el('throttle').dispatch('pointerdown',{pointerId:7});assert(race.accelerating);el('throttle').dispatch('pointercancel',{pointerId:7});assert(!race.accelerating,'Cancelled touches release the throttle');
el('throttle').dispatch('pointerdown',{pointerId:8});el('settings').click();assert.equal(race.status,'paused');assert(!race.accelerating,'Opening settings releases held acceleration');
el('setting-graphics').value='battery';el('setting-graphics').dispatch('change');assert.equal(window.WORDSHIFT.scene.preferences.graphics,'battery');
el('setting-motion').value='reduced';el('setting-motion').dispatch('change');assert(document.body.classList.contains('reduced-motion'));el('settings-done').click();assert.equal(race.status,'driving');assert.equal(JSON.parse(storage).preferences.motion,'reduced');
// An upward road gesture spends once, and never begins inside an English task.
race.fuel=60;race.nitro=0;let used=race.nitroUses;el('world').dispatch('pointerdown',{clientX:190,clientY:600,pointerId:20});el('world').dispatch('pointermove',{clientX:192,clientY:530,pointerId:20});assert.equal(race.nitroUses,used+1);assert.equal(race.fuel,30);assert(!race.accelerating);el('world').dispatch('pointermove',{clientX:191,clientY:480,pointerId:20});el('world').dispatch('pointerup',{clientX:191,clientY:460,pointerId:20});assert.equal(race.nitroUses,used+1,'A continuous upward swipe spends fuel once');
race.nitro=0;race.status='task';race.task=race.tasks[1];el('world').dispatch('pointerdown',{clientX:190,clientY:450,pointerId:21});race.status='driving';race.task=null;el('world').dispatch('pointermove',{clientX:192,clientY:380,pointerId:21});el('world').dispatch('pointerup',{clientX:192,clientY:360,pointerId:21});assert.equal(race.nitroUses,used+1,'A gesture begun during a task cannot fire after it clears');
race.fuel=0;el('world').dispatch('pointerdown',{clientX:190,clientY:450,pointerId:22});el('world').dispatch('pointermove',{clientX:190,clientY:380,pointerId:22});el('world').dispatch('pointerup',{clientX:190,clientY:360,pointerId:22});assert.equal(race.nitroUses,used+1);assert.equal(race.fuel,0);race.fuel=60;
race.lane=0;el('world').dispatch('pointerdown',{clientX:190,clientY:600,pointerId:9});assert(race.accelerating);el('world').dispatch('pointermove',{clientX:235,clientY:602,pointerId:9});assert.equal(race.lane,1);assert(!race.accelerating,'Swiping off the car releases acceleration');el('world').dispatch('pointermove',{clientX:100,clientY:602,pointerId:9});assert.equal(race.lane,1,'The same gesture cannot steer twice');el('world').dispatch('pointerup',{clientX:100,clientY:602,pointerId:9});assert.equal(race.lane,1);
el('left').dispatch('pointerdown');assert.equal(race.lane,0,'Touch steering responds on press');el('left').dispatch('click',{detail:1});assert.equal(race.lane,0,'Synthetic click does not duplicate the move');el('left').dispatch('click',{detail:0});assert.equal(race.lane,-1,'Keyboard activation still steers');
el('pause').click();assert.equal(race.status,'paused');assert.equal(el('pause-accuracy').textContent,race.correct+' / '+race.tasks.length);assert.equal(el('pause-checkpoints').textContent,race.taskIndex+' / '+race.tasks.length);assert(el('pause-distance').textContent.includes(String(race.arena.length)));const previousSound=window.WORDRIFT.settings.sound;el('pause-sound').click();assert.equal(window.WORDRIFT.settings.sound,!previousSound);el('pause-sound').click();el('pause-help').click();assert.equal(race.status,'paused');
// Help opens the Driving School: three practice pads, the English tasks and
// the race basics. Pressing on a pad never touches the paused race.
assert(el('practice'),'Help opens the Driving School practice pad');assert(el('modal-title').textContent.includes('drive'));assert.equal(el('pp-goals').children.length,2);
el('practice').dispatch('pointerdown',{clientX:200,clientY:400});el('practice').dispatch('pointermove',{clientX:200,clientY:330});el('practice').dispatch('pointerup',{clientX:200,clientY:330});assert.equal(race.status,'paused');assert(!race.accelerating);
for(const step of ['steer','nitro','tasks','race']){el('tutorial-next').click();assert.equal(Boolean(el('practice')),['steer','nitro'].includes(step),step);}
assert(el('tutorial-rules'));assert.equal(el('tutorial-next').textContent.trim(),'DONE');assert(!el('tutorial-skip'),'Help from a race has no Skip, only Back');
el('tutorial-back').click();assert.equal(document.querySelectorAll('.tutorial-task').length,4,'Four English task cards');el('tutorial-next').click();el('tutorial-next').click();assert.equal(race.status,'driving');el('pause').click();el('pause-settings').click();assert(el('settings-done'));el('settings-done').click();assert.equal(race.status,'driving');
for(const f of window.listeners.blur)f();assert.equal(race.status,'paused','Losing focus pauses the race');el('resume').click();assert.equal(race.status,'driving');
let now=performance.now();nextFrame(now+16);
// Drive messages wait for the task cue and clear when a question takes focus.
const trafficBefore=race.obstacles;race.obstacles=[];race.distance=race.tasks[0].at-85;race.status='driving';race.task=null;race.notice=null;toast('Road warning',true);updateUI(now+17);
assert(!el('warning').hidden);assert(!el('toast').classList.contains('visible'),'An upcoming task cue has priority over queued messages');
race.distance=0;updateUI(now+18);assert(el('toast').classList.contains('visible'));assert.equal(el('toast').textContent,'Road warning');
race.status='task';race.task=race.tasks[0];race.distance=race.task.at-40;updateUI(now+19);assert(!el('toast').classList.contains('visible'));assert(el('warning').hidden);assert.equal(document.body.dataset.hudPhase,'question');
race.status='resolving';updateUI(now+20);assert(document.body.classList.contains('reading-zone'),'Answer feedback retains the quiet HUD');race.obstacles=trafficBefore;

race.status='task';race.task=race.tasks[0];race.distance=race.task.at-40;nextFrame(now+32);const signs=el('road-answers').children.slice();assert.equal(signs.length,3);race.notice={type:'wrong',text:'Try a different match.'};nextFrame(now+48);assert.equal(el('road-feedback').textContent,'Try a different match.');assert.deepEqual(el('road-answers').children,signs,'Answer signs keep their identity while feedback updates');
const measured=layoutReads;for(let i=0;i<30;i++)nextFrame(now+49+i*.01);assert.equal(layoutReads,measured,'Stable task frames do not force DOM layout reads');for(const f of window.listeners.resize)f();nextFrame(now+50);assert(layoutReads>measured,'Viewport changes refresh measured sign/controls bounds');
// Start a fresh open-road segment before the next independent input case.
clearAcceleration();race.status='driving';race.task=null;race.focusAuto=null;race.worldTimeScale=1;race.focusAmount=0;race.distance=0;
// Repair cruise preserves physical holds, finger-by-finger connections and Pause state.
el('world').dispatch('pointerdown',{clientX:195,clientY:600,pointerId:70});assert(race.accelerating);
const repair=race.tasks.find(t=>t.kind==='repair');race.task=repair;race.taskIndex=race.tasks.indexOf(repair);race.status='task';race.distance=repair.at-40;race.speedFactor=C.REGULAR_MAX_SPEED;nextFrame(now+50.1);
assert(C.repairCruise(race));assert(!race.accelerating);assert(el('world').hasPointerCapture(70));assert(document.body.classList.contains('repair-cruise'));assert(!el('throttle').disabled);assert(el('left').disabled&&el('right').disabled);assert.equal(el('drive-hint').textContent,'AUTO CRUISE');assert.equal(el('speed').textContent,'90');
const block=id=>el('road-answers').children.find(b=>+b.dataset.block===id),repairBefore=race.distance;
el('road-answers').dispatch('pointerdown',{target:block(0),pointerId:71,clientX:40,clientY:300});el('road-answers').dispatch('pointerup',{pointerId:71});nextFrame(now+50.2);assert(block(0).classList.contains('linked'));assert(race.distance>repairBefore,'The car cruises while fingers are released');
el('world').dispatch('pointerup',{pointerId:70,clientX:195,clientY:600});el('pause').click();nextFrame(now+50.3);assert.equal(race.status,'paused');el('resume').click();nextFrame(now+50.4);assert(block(0).classList.contains('linked'),'Pause keeps the already connected block');
el('road-answers').dispatch('pointerdown',{target:block(1),pointerId:72,clientX:190,clientY:330});el('road-answers').dispatch('pointerup',{pointerId:72});
el('road-answers').dispatch('pointerdown',{target:block(2),pointerId:73,clientX:330,clientY:300});el('road-answers').dispatch('pointerup',{pointerId:73});assert(repair.solved);assert.equal(race.status,'resolving');
for(const fn of document.listeners.keydown)fn({key:'ArrowUp',repeat:false,preventDefault(){}});nextFrame(now+50.5);assert(!race.accelerating,'Autopilot still owns acceleration during its return');assert(!el('throttle').disabled);assert(document.body.classList.contains('repair-cruise'));assert.equal(el('drive-hint').textContent,'RESUMING');assert.equal(document.body.dataset.focusPhase,'return');for(let i=0;i<30;i++)C.tick(race,.05,race.lane);nextFrame(now+50.6);assert(!C.repairCruise(race));assert(!el('throttle').disabled);assert(!document.body.classList.contains('repair-cruise'));assert.equal(document.body.style['--focus-amount'],0);assert(race.accelerating,'Up held during the return resumes without another press');for(const fn of document.listeners.keyup)fn({key:'ArrowUp',preventDefault(){}});
// Holds begun before, during or at the end of either focus task resume live.
let handoffCases=0;
function handoffStep(){applyAcceleration();C.tick(race,.05,0);updateUI(now+50.7);}
function handoffInput(type,held,cancel=false){
 const event={pointerId:900,button:0,clientX:195,clientY:600,key:'ArrowUp',repeat:false,preventDefault(){},stopPropagation(){}};
 if(type==='up'){for(const fn of document.listeners[held?'keydown':'keyup'])fn(event);}
 else el(type==='car'?'world':'throttle').dispatch(held?'pointerdown':cancel?(type==='car'?'pointercancel':'lostpointercapture'):'pointerup',event);
}
for(const kind of ['repair','pedestrian'])for(const type of ['up','car','throttle'])for(const phase of ['before','during','return','cancel']){
 clearAcceleration();const fresh=C.createRace(race.unit,'challenge',0,41,{fuel:0,rivals:false});Object.assign(race,fresh);race.status='driving';race.obstacles=[];el('rival-tags').innerHTML='';
 const task=race.tasks.find(t=>t.kind===kind);task.id+='-handoff-'+handoffCases;race.taskIndex=race.tasks.indexOf(task);race.distance=task.at-(kind==='pedestrian'?150:70);race.speedFactor=C.REGULAR_MAX_SPEED;
 if(phase==='before')handoffInput(type,true);handoffStep();assert(C.focusCruise(race));assert(!race.accelerating);assert(!el('throttle').disabled);
 if(phase==='during'||phase==='cancel')handoffInput(type,true);
 if(phase==='cancel')handoffInput(type,false,true);
 if(kind==='repair')C.connectRepair(race,[0,1,2]);
 else {for(let i=0;i<300&&race.status==='task';i++){if(C.pedestrianReady(race)&&!task.pedWait){const side=task.people[task.personIndex].side;assert(!el(side?'right':'left').disabled);el(side?'right':'left').dispatch('pointerdown',{pointerId:901,button:0});assert.equal(race.lane,0);}handoffStep();}assert(task.completed);assert(race.distance<task.stopAt,'Sorting finishes before the crossing');}
 assert.equal(race.status,'resolving');if(phase==='return')handoffInput(type,true);const returnAt=race.elapsed;
 for(let i=0;i<60&&C.focusCruise(race);i++)handoffStep();handoffStep();assert(!C.focusCruise(race));assert(phase==='cancel'?race.elapsed-returnAt>=1.2:race.elapsed-returnAt<.4,`${kind}/${type}/${phase}: holding shortens the return; cancellation retains the gentle fade`);assert.equal(race.accelerating,phase!=='cancel',`${kind}/${type}/${phase}: a live hold resumes; a released hold does not`);
 handoffInput(type,false);handoffStep();assert(!race.accelerating);handoffCases++;
}
console.log(`PASS: ${handoffCases} UI handoffs: Up, car touch and throttle touch begun before/during/return; release/cancel prevents phantom acceleration; pedestrian arrow sorting stays enabled under autopilot.`);
clearAcceleration();race.exitTask=null;race.focusAuto=null;race.worldTimeScale=1;race.status='driving';race.task=null;
const pauseRepair=race.tasks.find(t=>t.kind==='repair');pauseRepair.id+='-pause-held';race.taskIndex=race.tasks.indexOf(pauseRepair);race.distance=pauseRepair.at-70;handoffInput('up',true);handoffStep();assert(C.focusCruise(race));el('pause').click();assert.equal(race.status,'paused');el('resume').click();assert(C.connectRepair(race,[0,1,2]));for(let i=0;i<35;i++)handoffStep();assert(!race.accelerating,'Pause clears a held key even inside autopilot');for(const fn of document.listeners.keydown)fn({key:'ArrowUp',repeat:true,preventDefault(){}});handoffStep();assert(!race.accelerating,'An old repeat after Pause cannot restart acceleration');handoffInput('up',true);handoffStep();assert(race.accelerating);handoffInput('up',false);handoffStep();
// Lane-answer focus keeps the actual UI steerable and preserves held input.
let choiceHandoffs=0;
for(const kind of ['light','junction'])for(const type of ['up','car','throttle'])for(const cancel of [false,true]){
 clearAcceleration();Object.assign(race,C.createRace(race.unit,'challenge',0,53,{rivals:false,fuel:0}));race.status='driving';race.obstacles=[];el('rival-tags').innerHTML='';
 const t=race.tasks.find(t=>t.kind===kind);t.id+='-ui-'+choiceHandoffs;race.taskIndex=race.tasks.indexOf(t);race.distance=t.at-52;race.speedFactor=C.REGULAR_MAX_SPEED;
 handoffInput(type,true);handoffStep();assert(C.focusCruise(race));assert(!race.accelerating);assert(!el('left').disabled&&!el('right').disabled,'Steering stays enabled during lane-choice slow motion');
 el('left').dispatch('pointerdown');assert.equal(race.lane,-1);
 el('road-answers').children[t.correctIndex].click();assert.equal(race.lane,t.correctIndex-1,'Full-text sign taps still steer during focus');
 if(cancel)handoffInput(type,false,true);const choiceAt=race.elapsed;
 for(let i=0;i<80&&C.focusCruise(race);i++){applyAcceleration();C.tick(race,.05,race.lane);updateUI(now+50.9);}applyAcceleration();
 assert(!C.focusCruise(race));assert(cancel?race.elapsed-choiceAt>=1.3:race.elapsed-choiceAt<.6,`${kind}/${type}: the live input controls return duration`);assert.equal(race.accelerating,!cancel);handoffInput(type,false);choiceHandoffs++;
}
// Picture signs: the Fluent picture is the clue (word mode) or each answer
// (image mode, alt text = the word); a tap on the right picture still steers.
let pictureSigns=0;const handoffUnit=race.unit;
for(const mode of ['word','image']){
 let seed=1,unit=null;for(const u of window.LANGUAGE_BANK.flatMap(g=>g.units)){for(seed=1;seed<60;seed++)if(C.createRace(u,'challenge',2,seed,{rivals:false,fuel:0}).tasks.some(t=>t.picture===mode)){unit=u;break;}if(unit)break;}
 clearAcceleration();Object.assign(race,C.createRace(unit,'challenge',2,seed,{rivals:false,fuel:0}));race.status='driving';race.obstacles=[];el('rival-tags').innerHTML='';
 const t=race.tasks.find(t=>t.picture===mode);assert(t,'A picture sign of each mode is reachable: '+mode);race.taskIndex=race.tasks.indexOf(t);race.distance=t.at-52;race.speedFactor=C.REGULAR_MAX_SPEED;
 handoffInput('up',true);handoffStep();assert(/^PICTURE/.test(el('road-kicker').textContent),'Picture signs are labelled');
 const clue=el('road-question').querySelector('.sign-emoji'),pictures=el('road-answers').querySelectorAll('.answer-emoji');
 if(mode==='word'){assert.equal(clue.attrs.src,'emoji/'+t.image+'.webp');assert.equal(pictures.length,0);}
 else{assert(!clue);assert.deepEqual(pictures.map(p=>p.attrs.alt),t.options,'Picture answers carry their word for screen readers');assert.deepEqual(pictures.map(p=>p.attrs.src),t.optionImages.map(x=>'emoji/'+x+'.webp'));}
 el('road-answers').children[t.correctIndex].click();assert.equal(race.lane,t.correctIndex-1,'A tap on the right picture steers into it');handoffInput('up',false);pictureSigns++;
}
clearAcceleration();Object.assign(race,C.createRace(handoffUnit,'challenge',0,53,{rivals:false,fuel:0}));race.status='driving';race.obstacles=[];
console.log(`PASS: ${choiceHandoffs} light/fork UI handoffs; enabled arrows, working full-text sign taps, held Up/car/throttle restoration and cancellation; ${pictureSigns} picture-sign modes render and steer.`);
// The reported category labels remain complete words in the real DOM path.
clearAcceleration();Object.assign(race,C.createRace(race.unit,'relaxed',0,29,{rivals:false}));race.status='task';race.obstacles=[];race.task=race.tasks.find(t=>t.kind==='pedestrian');race.task.id+='-category-type';race.taskIndex=race.tasks.indexOf(race.task);race.distance=race.task.at-100;
race.task.rows[0].options=['PERSONALITY','APPEARANCE'];updateUI(now+50.95);
assert.deepEqual(el('road-answers').children.map(b=>b.querySelector('.answer-text').textContent),['Personality','Appearance']);
assert(el('road-answers').children.every(b=>b.querySelector('.answer-text').querySelectorAll('.sign-word').length===1));
assert(el('road-answers').children.every(b=>parseFloat(b.querySelector('.answer-text').style.fontSize)>0));
clearAcceleration();race.focusAuto=null;race.worldTimeScale=1;race.focusAmount=0;race.task=null;race.status='driving';race.exitTask=null;
const fork=race.tasks.find(t=>t.kind==='junction'),route=C.makeRoute(race,fork,fork.correctIndex,true);race.route=route;race.status='driving';race.task=null;race.taskIndex=3;race.distance=route.start+10;nextFrame(now+51);assert(!el('route-status').hidden);assert(el('route-label').textContent.includes(route.coaster?'SKY COASTER':'SHORTCUT'),'A Sunlit right answer rides the Sky Coaster');race.route=null;race.mergeAssist=route;race.distance=route.exitEndAt+1;nextFrame(now+52);assert(el('route-status').hidden,'The route instrument clears after the merge');
// Separate presses stack, while a single continuous gesture still spends once.
race.status='driving';race.route=null;race.mergeAssist=null;race.yielding=null;race.slow=0;race.nitro=0;race.nitroLevel=0;race.fuel=100;race.speedFactor=1.55;race.distance=10;race.taskIndex=0;race.task=null;nextFrame(now+53);
for(let level=1;level<=3;level++){el('nitro-stack').click();nextFrame(now+53+level*.01);assert.equal(race.nitroLevel,level);assert.equal(el('nitro-slots').children.filter(p=>p.classList.contains('lit')).length,level);}
assert.equal(race.fuel,10);assert(el('nitro-stack').disabled);assert(!el('nitro').disabled,'A full saved charge stays usable');assert.equal(el('nitro-title').textContent,'SAVED');
el('nitro').dispatch('pointerdown',{pointerId:31});nextFrame(now+53.04);assert(race.nitroActive);assert.equal(document.body.dataset.nitroLevel,'3');const remaining=race.nitro,loaded=race.nitroUses;el('nitro').dispatch('pointerup',{pointerId:31});el('nitro').dispatch('click',{detail:1});nextFrame(now+53.05);assert.equal(race.nitro,remaining);assert.equal(race.nitroUses,loaded,'A synthetic click does not buy another stack');
el('nitro').dispatch('pointerdown',{pointerId:32});nextFrame(now+53.06);assert(race.nitroActive);assert.equal(race.nitroUses,loaded,'A new hold resumes the existing charge');el('nitro').dispatch('pointercancel',{pointerId:32});assert(!race.nitroHeld);const keyEvent={key:' ',code:'Space',repeat:false,preventDefault(){},stopPropagation(){}};for(const fn of document.listeners.keydown)fn(keyEvent);nextFrame(now+53.07);assert(race.nitroHeld&&race.nitroActive);for(const fn of document.listeners.keyup)fn(keyEvent);const savedCharge=race.nitro;nextFrame(now+53.08);assert.equal(race.nitro,savedCharge,'Keyboard release preserves the reservoir');race.status='paused';nextFrame(now+54);assert(!document.body.classList.contains('nitro-active'));assert.equal(document.body.dataset.nitroLevel,'0','Paused overlays cannot retain boost edge effects');
race.difficulty=window.WORDRIFT.settings.difficulty;race.diff=C.DIFFICULTIES[race.difficulty];race.task=null;race.distance=race.arena.length;race.finishedAt=race.elapsed;race.status='finished';race.correct=race.tasks.length;race.time=25;nextFrame(now+64);assert(el('modal').classList.contains('finish-modal'));assert(!el('celebration').hidden);assert.equal(el('celebration').children.length,0,'Reduced motion has no confetti');assert(!el('modal').querySelector('.ulti-win'));assert(el('next-arena'),'First place offers the next arena');assert.equal(window.WORDSHIFT.settings.arenaWins['g5u1:challenge'][0],true);assert(!('export' in window.WORDSHIFT.ulti),'No local points record to export');assert(!('ulti' in window.WORDSHIFT.settings),'No browser-only ledger is saved');nextFrame(now+65);el('result-home').click();assert.equal(window.WORDSHIFT.race,null);assert(el('celebration').hidden);
console.log('PASS: hands-free repair cruise, pointer release, lifted-finger connections, Pause preservation and safe keyboard rearming; quiet HUD structure, grouped resources, deferred announcements, task priority, Pause statistics/settings/help, saved-progress/API compatibility, browser-bar height changes, pinch-zoom preservation, compact viewport state, UI wiring, throttle cancellation, immediate swipes, no double steering, persisted settings, pause/resume, blur protection, finish flow and reduced-motion celebration. DOM and scene were mocked; no visual/browser QA.');

// A clean English score does not substitute for a racing victory.
const arenaCard=i=>el('arena-cards').children.find(b=>+b.dataset.arena===i);
function completeAt(position,status='finished'){
 race=window.WORDRIFT.race;race.task=null;race.distance=race.arena.length;race.elapsed=30;race.finishedAt=30;race.status=status;race.correct=race.tasks.length;race.time=25;
 race.rivals.forEach((r,i)=>Object.assign(r,{finishedAt:i<position-1?27+i:null,at:race.arena.length-10-i*10}));result();
}
assert(!arenaCard(1).classList.contains('locked'));assert(arenaCard(2).classList.contains('locked'));
arenaCard(1).click();el('start').click();assert.equal(window.WORDRIFT.race.arenaIndex,1);completeAt(2);
assert(!el('next-arena'));assert(el('modal').textContent.includes('Finish first in Coastal Overpass'));
assert.equal(window.WORDRIFT.settings.progress['g5u1:challenge'][1],3,'Second place keeps English stars');
assert(!window.WORDRIFT.settings.arenaWins['g5u1:challenge'][1]);assert(!el('modal').querySelector('.ulti-win'));
el('replay').click();completeAt(3);assert(!el('next-arena'));assert(!window.WORDRIFT.settings.arenaWins['g5u1:challenge'][1]);
el('replay').click();completeAt(1,'failed');assert(!el('next-arena'));assert(!window.WORDRIFT.settings.arenaWins['g5u1:challenge'][1]);
el('result-home').click();assert(arenaCard(2).classList.contains('locked'));arenaCard(2).click();assert.equal(el('scene-name').textContent,'COASTAL OVERPASS');
// The start handler also enforces the gate if an internal selection is stale.
selectedArena=2;begin();assert.equal(window.WORDRIFT.race,null);assert.equal(el('scene-name').textContent,'SUNLIT BOULEVARD');
arenaCard(1).click();el('start').click();completeAt(1);assert(el('next-arena'));assert(!el('modal').textContent.includes('ULTI')&&!el('league-result'),'Practice-only wins show no Ulti reward');
{el('replay').click();race=window.WORDRIFT.race;race.task=null;race.distance=race.arena.length;race.elapsed=30;race.finishedAt=30;race.status='finished';race.correct=Math.floor(race.tasks.length/2);race.time=25;race.rivals.forEach((r,i)=>Object.assign(r,{finishedAt:null,at:race.arena.length-10-i*10}));result();assert(!el('modal').textContent.includes('NO ULTI POINTS'),'Practice-only copies never mention the Ulti accuracy rule');}
const reload=normaliseProgress(JSON.parse(storage));assert(arenaUnlocked(reload,'g5u1','challenge',2));assert(!arenaUnlocked(reload,'g5u1','relaxed',1));assert(!arenaUnlocked(reload,'g5u2','challenge',1));
el('next-arena').click();assert.equal(window.WORDRIFT.race.arenaIndex,2);completeAt(1);assert(!el('next-arena'),'Final arena has no nonexistent next race');
el('result-home').click();document.querySelectorAll('[data-diff]').find(b=>b.dataset.diff==='relaxed').click();assert(arenaCard(1).classList.contains('locked'));el('start').click();race=window.WORDRIFT.race;race.reviewLap=true;completeAt(1);assert(!el('next-arena'));assert(el('modal').textContent.includes('Win the full race'));assert(!window.WORDRIFT.settings.arenaWins['g5u1:relaxed']);
console.log('PASS: first-place-only result advancement; second/third/failed/review finishes keep gates closed; stars survive losses; stale start selections are guarded; saved wins reopen the correct unit/difficulty arenas and final wins stop at arena three.');

// Real touch pointers use a continuous driving hold, independently of the
// legacy desktop mouse/keyboard cases above. A captured road pointer owns the
// gesture even when it crosses sign or former control-button coordinates.
goHome();selectedArena=0;setTouchControls(false);begin();race=window.WORDRIFT.race;
function resetTouchRace(fuel=100){clearAcceleration();Object.assign(race,C.createRace(race.unit,'challenge',0,77,{fuel,rivals:false}));race.status='driving';race.tasks=[];race.obstacles=[];race.speedFactor=C.REGULAR_MAX_SPEED;el('rival-tags').innerHTML='';updateUI(now+200);}
const touch=(id,x,y)=>({pointerId:id,pointerType:'touch',button:0,clientX:x,clientY:y});
function thumbDown(id=1200,x=260,y=740){el('world').dispatch('pointerdown',touch(id,x,y));}
function thumbMove(x,y,id=1200){el('world').dispatch('pointermove',touch(id,x,y));}
function thumbUp(id=1200,x=260,y=740){el('world').dispatch('pointerup',touch(id,x,y));}
resetTouchRace();thumbDown();assert(race.accelerating);assert(document.body.classList.contains('touch-controls'));
updateUI(now+200.1);assert(el('controls').hidden);assert.equal(el('controls').attrs['aria-hidden'],'true');assert(!el('touch-nitro').hidden);assert(el('touch-nitro').closest('.hud-top'));
el('world').dispatch('pointerdown',touch(1201,120,740));assert(!el('world').hasPointerCapture(1201));assert(el('world').hasPointerCapture(1200),'A second road finger cannot steal the driving thumb');
for(const [x,lane]of [[300,1],[260,0],[220,-1],[260,0]]){thumbMove(x,740);assert.equal(race.lane,lane);assert(race.accelerating);assert(el('world').hasPointerCapture(1200));}
thumbMove(260,690);assert.equal(race.nitroLevel,1);assert.equal(race.fuel,70);C.tick(race,.05,race.lane);assert(race.nitroActive);
for(let i=0;i<50;i++)thumbMove(260,690);assert.equal(race.nitroUses,1,'A held forward position never loads repeated charges');
thumbMove(260,645);assert.equal(race.nitroLevel,2);thumbMove(260,600);assert.equal(race.nitroLevel,3);assert.equal(race.fuel,10);
C.tick(race,.05,race.lane);updateUI(now+200.2);assert.equal(el('touch-nitro-state').textContent,'BOOST ×3');assert.equal(el('touch-fuel').textContent,'10');
thumbMove(300,600);assert.equal(race.lane,1);assert(race.accelerating&&race.nitroHeld,'Steering keeps both the driving and Nitro hold');thumbMove(260,600);assert.equal(race.lane,0);
thumbMove(260,640);assert(race.accelerating);assert(!race.nitroHeld&&!race.nitroActive);assert(el('world').hasPointerCapture(1200));
const thumbSaved=race.nitro,thumbDistance=race.distance;
for(let i=0;i<40;i++){applyAcceleration();C.tick(race,.05,race.lane);}updateUI(now+200.3);
assert.equal(race.nitro,thumbSaved);assert(race.distance>thumbDistance);assert(Math.abs(race.speedFactor-C.REGULAR_MAX_SPEED)<.001);assert.equal(el('touch-nitro-state').textContent,'SAVED ×3');
thumbMove(260,590);assert(race.nitroHeld);assert.equal(race.nitroUses,3,'Slide forward again to resume the saved stack for free');C.tick(race,.05,race.lane);thumbUp(1200,260,590);assert(!race.accelerating&&!race.nitroHeld);assert(!el('world').hasPointerCapture(1200));
const afterLift=race.nitro;thumbDown(1202,260,400);assert(race.accelerating,'An empty road press works outside the exact car silhouette');for(let i=0;i<10;i++){applyAcceleration();C.tick(race,.05,race.lane);}assert.equal(race.nitro,afterLift,'A new ordinary hold conserves the loaded reservoir');
const purchases=race.nitroUses;thumbUp(1202,260,200);assert.equal(race.nitroUses,purchases,'A lifted finger cannot make a final phantom Nitro purchase');assert(!race.accelerating&&!race.nitroHeld);
for(const event of ['pointercancel','lostpointercapture']){thumbDown(1203);thumbMove(260,690,1203);C.tick(race,.05,race.lane);assert(race.nitroHeld);el('world').dispatch(event,touch(1203,260,690));assert(!race.accelerating&&!race.nitroHeld);const charge=race.nitro;for(let i=0;i<10;i++){applyAcceleration();C.tick(race,.05,race.lane);}assert.equal(race.nitro,charge);}
resetTouchRace();race.status='countdown';race.countdown=.1;thumbDown();assert(!race.accelerating);assert(el('world').hasPointerCapture(1200));for(let i=0;i<5;i++){applyAcceleration();C.tick(race,.05,race.lane);}assert.equal(race.status,'driving');assert(race.accelerating,'A thumb held during the countdown starts driving at GO without a new press');thumbUp();
resetTouchRace();thumbDown();thumbMove(260,590);assert.equal(race.nitroUses,3);for(let i=0;i<180;i++){applyAcceleration();C.tick(race,.05,race.lane);}assert.equal(race.nitroUses,3,'Exhausting a held charge never automatically buys another one');assert.equal(race.fuel,10);thumbUp(1200,260,590);

let touchHandoffs=0;
for(const kind of ['repair','pedestrian','light','junction']){
 clearAcceleration();Object.assign(race,C.createRace(race.unit,'challenge',0,85,{fuel:100,rivals:false}));race.status='driving';race.obstacles=[];el('rival-tags').innerHTML='';
 const t=race.tasks.find(t=>t.kind===kind);race.taskIndex=race.tasks.indexOf(t);race.distance=t.at-(kind==='pedestrian'?150:kind==='repair'?70:52);race.speedFactor=C.REGULAR_MAX_SPEED;
 thumbDown();thumbMove(260,690);const heldFuel=race.fuel,heldCharge=race.nitro,heldUses=race.nitroUses;
 function touchStep(){applyAcceleration();C.tick(race,.05,race.lane);updateUI(now+201+touchHandoffs*.01);}
 touchStep();assert(C.focusCruise(race));assert(!race.nitroActive);assert(el('controls').hidden);assert(!el('touch-nitro').hidden);
 // Return to regular acceleration while autopilot still owns the car.
 thumbMove(260,730);assert(!race.nitroHeld);assert(el('world').hasPointerCapture(1200));
 if(kind==='repair'){
  for(let blockIndex=0;blockIndex<3;blockIndex++){
   const b=el('road-answers').children.find(b=>+b.dataset.block===blockIndex),id=1300+blockIndex;
   el('road-answers').dispatch('pointerdown',{...touch(id,40+blockIndex*130,300),target:b});el('road-answers').dispatch('pointerup',touch(id,40+blockIndex*130,300));
   assert(el('world').hasPointerCapture(1200),'A repair finger does not interrupt the driving thumb');
  }
  assert(t.solved);
 }else if(kind==='pedestrian'){
  for(let i=0;i<300&&race.status==='task';i++){if(C.pedestrianReady(race)&&!t.pedWait){const sign=el('road-answers').children[t.people[t.personIndex].side];sign.click();}touchStep();}assert(t.completed);
 }else {el('road-answers').children[t.correctIndex].click();assert.equal(race.lane,t.correctIndex-1);}
 for(let i=0;i<100&&C.focusCruise(race);i++)touchStep();touchStep();assert(!C.focusCruise(race));assert(race.accelerating,'The same thumb hold resumes after '+kind);
 assert(!race.nitroHeld&&!race.nitroActive,'Downward cancellation remains effective after '+kind);assert(race.fuel>=heldFuel,'Tasks may earn fuel but cannot spend it');assert.equal(race.nitroUses,heldUses);assert.equal(race.nitro,heldCharge);thumbUp(1200,260,730);touchHandoffs++;
}
resetTouchRace();thumbDown();thumbMove(260,690);el('pause').click();assert.equal(race.status,'paused');el('resume').click();applyAcceleration();assert(!race.accelerating&&!race.nitroHeld,'Pause cannot restore an abandoned thumb hold');
setTouchControls(false);race.status='driving';race.task=null;updateUI(now+203);assert(!el('controls').hidden);assert(el('touch-nitro').hidden,'Desktop mode keeps its original controls');
const touchCss=fs.readFileSync('dist/style.css','utf8');assert(/body\.touch-controls #controls\{[^}]*display:none!important/.test(touchCss));assert(/#touch-nitro \*\{pointer-events:none!important/.test(touchCss),'Nitro information never intercepts a finger');

// Condition marks share the time panel; a breakdown cannot award race rewards.
goHome();selectedArena=0;setTouchControls(true);begin();race=window.WORDRIFT.race;race.status='driving';race.tasks=[];race.obstacles=[];race.speedFactor=C.REGULAR_MAX_SPEED;race.distance=500;race.rivals.forEach((r,i)=>r.at=300-i*30);
assert.equal(C.raceOrder(race)[0].id,'player','The player leads before breaking down');updateUI(now+210);assert.equal(el('car-condition').children.filter(p=>p.classList.contains('intact')).length,3);assert(el('car-condition').closest('.timer-pill'));assert(el('car-condition').attrs['aria-label'].includes('3 hits remaining'));
assert(C.contactBump(race));race.followingTraffic=true;updateUI(now+211);assert.equal(el('car-condition').children.filter(p=>p.classList.contains('intact')).length,2);assert.equal(el('car-condition').dataset.damage,'1');assert(!el('condition-notice').hidden);assert.equal(el('condition-notice').textContent,'DAMAGED · TWO HITS LEFT');race.followingTraffic=false;
race.invulnerable=0;assert(C.contactBump(race));updateUI(now+212);assert.equal(el('car-condition').children.filter(p=>p.classList.contains('intact')).length,1);assert(el('car-condition').attrs['aria-label'].includes('critical'));assert(document.body.classList.contains('car-critical'));assert.equal(el('condition-notice').textContent,'CRITICAL · ONE HIT LEFT');
const winsBefore=JSON.stringify(window.WORDRIFT.settings.arenaWins);
race.invulnerable=0;assert(C.contactBump(race));updateUI(now+213);assert.equal(race.status,'breakdown');assert(el('controls').hidden&&el('touch-nitro').hidden&&el('pause').hidden);assert(el('modal-backdrop').hidden,'The stop animation runs before the result modal');assert.equal(el('car-condition').children.filter(p=>p.classList.contains('intact')).length,0);
pauseRace();assert.equal(race.status,'paused');assert(el('modal').querySelector('.pause-stats').textContent.includes('DNF'));el('resume').click();assert.equal(race.status,'breakdown');
for(let i=0;i<72;i++)C.tick(race,1/60,race.lane);updateUI(now+214);assert.equal(race.status,'failed');assert.equal(el('modal-title').textContent,'Car broken down.');assert(el('modal').textContent.includes('fully repaired'));assert(!el('next-arena'));assert(el('celebration').hidden);assert(!el('league-result'));assert.equal(JSON.stringify(window.WORDRIFT.settings.arenaWins),winsBefore);
assert.equal(el('race-place').textContent,'DNF');assert.equal(el('place-label').textContent,'STATUS');assert(el('modal').querySelector('.result-dnf'));assert(el('modal').classList.contains('dnf-result'));assert(!el('modal').querySelector('.podium'));assert(!el('modal').textContent.includes('POSITION 1/3'));assert(!lastResult.finished);
race.status='finished';race.finishedAt=1;race.distance=race.arena.length;result();assert(!lastResult.finished);assert.equal(el('modal-title').textContent,'Car broken down.');assert(!el('modal').querySelector('.podium'));assert(!el('next-arena'));assert(!el('league-result'));assert.equal(JSON.stringify(window.WORDRIFT.settings.arenaWins),winsBefore);
el('replay').click();race=window.WORDRIFT.race;updateUI(now+215);assert.equal(race.status,'countdown');assert.equal(race.damage,0);assert.equal(el('car-condition').children.filter(p=>p.classList.contains('intact')).length,3);assert(!document.body.classList.contains('car-critical')&&!document.body.classList.contains('car-breaking'));assert.equal(race.failureReason,null);assert(el('condition-notice').hidden);
assert(/#car-condition \*\{pointer-events:none!important/.test(touchCss));
console.log('PASS: quiet, non-intercepting three-mark condition HUD, critical warning, breakdown animation before failure, clear result, no Ulti/unlock/celebration on breakdown, and fully repaired retry. DOM and scene were mocked.');
console.log(`PASS: touch-mode control removal, compact HUD status, retained capture through repeated lane swipes, deliberate three-level stacking, saved-charge cruise, free resume, no lift/exhaustion purchases, cancellation, second-finger safety and ${touchHandoffs} task handoffs. Desktop mouse and keyboard paths remain available. DOM and scene were mocked.`);

// Running out of time while leading is also DNF, with no finishing position.
race.status='driving';race.tasks=[];race.obstacles=[];race.distance=500;race.rivals.forEach((r,i)=>r.at=300-i*30);race.time=.001;C.tick(race,.01,race.lane);assert.equal(race.status,'failed');result();updateUI(now+220);assert.equal(el('modal-title').textContent,'Time ran out.');assert.equal(el('race-place').textContent,'DNF');assert(el('modal').querySelector('.result-dnf'));assert(el('modal').classList.contains('dnf-result'));assert(!el('modal').querySelector('.podium'));assert(!el('next-arena'));assert(!lastResult.finished);
assert(el('league-button').hidden,'No League button when ultiApi is empty');assert(!el('modal').textContent.includes('English League'));assert.equal(leagueRequests,0,'ultiApi "" makes no network requests');
console.log('PASS: failed leaders and stale first-place/finished metadata never show a podium or finishing place; breakdown and timeout are DNF with no win rewards.');
