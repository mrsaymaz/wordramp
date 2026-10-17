import {TEAMS,teamById,newIdentity,ultiSnapshot,ultiWinOutcome,exportUlti,ultiPointsFor,ultiEarnedToday,ULTI_POINTS,ULTI_MIN_STARS,ULTI_DAILY_CAP,isFinishEligible} from './teams-ulti.js';
import {Sound} from './audio.js';
import {normalisePreferences,roadGesture,createTouchDrive,touchDriveGesture,touchContentBottom,displaySpeed,raceHudContext,GRADE_LEVELS,lessonSummary} from './presentation.js';
import {RallyScene} from './scene.js';
import {laneLayout,strokeHits,roadVerticalLayout,visibleRivalLabels,wordFontSize,categoryTitle} from './road-layout.js';
import {normaliseProgress,arenaUnlocked,recordArenaWin,recordLearning,finishUnitArena,masteryStats,garageTier,equip,resolvedLook} from './progression.js';
const C=window.RallyCore,$=id=>document.getElementById(id),BANK=window.LANGUAGE_BANK;
// Mr. Saymaz hosts the off-road moments: guide, pause, results and garage.
// Decorative only (the text already carries the meaning); never on the road.
const host=pose=>`<span class="modal-host" aria-hidden="true"><img src="img/saymaz-${pose}.png" alt="" draggable="false"></span>`;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Native selection and image/link menus must not take a held driving pointer.
// Real form controls retain their normal editing and picker behavior.
function nativeEditingTarget(node){
  const target=node?.closest?node:node?.parentElement;
  return ['input','textarea','select','[contenteditable="true"]','[contenteditable="plaintext-only"]'].some(selector=>target?.closest?.(selector));
}
for(const type of ['selectstart','dragstart','contextmenu'])$('app').addEventListener(type,e=>{if(!nativeEditingTarget(e.target))e.preventDefault();},{capture:true});
function clearGameSelection(){const selection=window.getSelection?.();if(selection?.rangeCount)selection.removeAllRanges();}
const STORAGE='wordshift-rally.v1';
let saved={grade:5,unit:'g5u1',difficulty:'relaxed',sound:false,progress:{},tutorial:false},storageAvailable=true;
try{let raw=localStorage.getItem(STORAGE);if(raw)saved={...saved,...JSON.parse(raw)};}catch{storageAvailable=false;}
if(!BANK.some(g=>g.grade===saved.grade))saved.grade=5;
if(!saved.progress||typeof saved.progress!=='object')saved.progress={};
normaliseProgress(saved);
if(!C.DIFFICULTIES[saved.difficulty])saved.difficulty='relaxed';
let selectedArena=0,race=null,scene,mode='home',lastStatus='',lastTask='',lastResult=null,toastEnd=0,modalFocus=null,autoResume=false;
let settledAnswers=0,latestUnlock=0;
const unit=()=>BANK.find(g=>g.grade===saved.grade).units.find(u=>u.id===saved.unit)||BANK.find(g=>g.grade===saved.grade).units[0];
const progressKey=()=>saved.unit+':'+saved.difficulty;
const scores=()=>saved.progress[progressKey()]||[0,0,0];
const arenaOpen=index=>arenaUnlocked(saved,saved.unit,saved.difficulty,index);
const arenaRequirement=index=>C.ARENAS.find((_,i)=>i<index&&!saved.arenaWins[progressKey()]?.[i])?.name;
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(saved));}catch{storageAvailable=false;}}
const sound=new Sound(()=>saved.sound);
const systemMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const coarseInput=window.matchMedia('(pointer: coarse)');
const touchPreview=new URLSearchParams(globalThis.location?.search||'').get('touch')==='1';
let touchControls=touchPreview||coarseInput.matches||navigator.maxTouchPoints>0&&!window.matchMedia('(hover: hover)').matches;
let launchNumber=0,lastPlace=null,heldThrottleId=null,roadFeedbackEnd=0,pendingToast=null;
const preferences=()=>normalisePreferences(saved.preferences,systemMotion.matches);
let layoutDirty=true,signFontEpoch=0,signTextContext;
const signFontCache=new WeakMap();
let layoutCache={hudBottom:155,controlsTop:innerHeight-90,promptHeight:60,answerHeight:80};
const layoutObserver=typeof ResizeObserver==='function'?new ResizeObserver(()=>{layoutDirty=true;}):null;
function invalidateLayout(){layoutDirty=true;signFontEpoch++;}
const emojiSrc=stem=>`emoji/${stem}.webp`;
// Fetch this race's picture-sign images at the start line, not mid-approach.
const preloadPictures=r=>{if(typeof Image!=='function')return;for(const t of r?.tasks||[])for(const stem of [t.image,...(t.optionImages||[])])if(stem)new Image().src=emojiSrc(stem);};
const signWords=text=>String(text).split(/(\s+)/u).map(word=>/^\s*$/u.test(word)?escape(word):`<span class="sign-word">${escape(word)}</span>`).join('');
function fitSignWords(card,text,width){
  const key=signFontEpoch+'|'+width.toFixed(1)+'|'+text.textContent;
  if(signFontCache.get(text)===key)return;
  signTextContext??=document.createElement('canvas').getContext('2d');
  const css=getComputedStyle(card),base=parseFloat(css.fontSize),inset=['paddingLeft','paddingRight','borderLeftWidth','borderRightWidth'].reduce((sum,k)=>sum+(parseFloat(css[k])||0),0);
  signTextContext.font=`${css.fontWeight} ${base}px ${css.fontFamily}`;
  const size=wordFontSize(text.textContent,width-inset,base,word=>signTextContext.measureText(word).width);
  setStyle(text,'fontSize',size+'px');signFontCache.set(text,key);layoutDirty=true;
}
document.fonts?.ready.then(invalidateLayout);
for(const id of ['app','hud','controls','road-prompt'])layoutObserver?.observe($(id));
function setTouchControls(active){
  active=touchPreview||!!active;const changed=touchControls!==active;touchControls=active;
  document.body.classList.toggle('touch-controls',touchControls);
  $('controls').setAttribute('aria-hidden',String(touchControls));
  if(touchControls)$('controls').hidden=true;
  $('touch-nitro').hidden=!touchControls||!race||!['driving','task','resolving'].includes(race.status);
  if(changed)invalidateLayout();
}
coarseInput.addEventListener?.('change',()=>setTouchControls(coarseInput.matches));
document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.pointerType==='pen')setTouchControls(true);else if(e.pointerType==='mouse'&&!coarseInput.matches)setTouchControls(false);},{capture:true});
function syncViewport(){
  const viewport=window.visualViewport;
  // Browser bars change the visible height. Preserve the layout during pinch zoom.
  if(viewport&&Math.abs((viewport.scale||1)-1)>.01)return;
  const height=viewport?.height||innerHeight,width=viewport?.width||innerWidth;
  if(height>0&&Number.isFinite(height))document.documentElement.style.setProperty('--play-height',height+'px');
  document.body.classList.toggle('short-viewport',width<=760&&height<640&&height>=width);
  document.body.classList.toggle('compact-landscape',width>height&&height<=300);
  setTouchControls(touchControls);
  scene?.resize();invalidateLayout();
}
window.addEventListener('resize',syncViewport);
window.addEventListener('pageshow',syncViewport);
window.visualViewport?.addEventListener('resize',syncViewport);
syncViewport();
function setStyle(el,key,value){if(el.style[key]!==value)el.style[key]=value;}
function setText(id,value){const el=$(id),text=String(value);if(el.textContent!==text){el.textContent=text;if(['road-question','road-feedback','road-kicker'].includes(id))invalidateLayout();}}
function measureLayout(){
  if(layoutDirty){layoutDirty=false;const buttons=[...$('road-answers').querySelectorAll('button')],viewport=window.visualViewport,width=viewport?.width||innerWidth,height=viewport?.height||innerHeight;layoutCache={hudBottom:$('hud').getBoundingClientRect().bottom,controlsTop:touchControls?touchContentBottom(width,height):$('controls').getBoundingClientRect().top,promptHeight:$('road-prompt').offsetHeight,answerHeight:Math.max(56,...buttons.map(b=>b.offsetHeight))};document.body.style.setProperty('--hud-bottom',layoutCache.hudBottom+'px');}
  return layoutCache;
}
function applyPreferences(){const p=preferences();document.body.classList.toggle('reduced-motion',p.reduced);scene?.setPreferences(p);}
systemMotion.addEventListener?.('change',applyPreferences);
function haptic(kind){if(!preferences().haptics||!window.matchMedia('(pointer: coarse)').matches)return;try{navigator.vibrate?.({click:8,correct:[12,30,18],collision:45,go:[15,25,25],finish:[20,50,30,50,50]}[kind]||8);}catch{}}
function settings(){
  const resume=!!race&&C.pause(race);
  const draw=()=>{
    const p=preferences();showModal(`<span class="modal-kicker">MAKE IT YOUR DRIVE</span><h2 id="modal-title">Driver settings.</h2><p>Comfort, sound and performance. Your choices are saved on this device.</p><div class="setting-row"><div><strong>Sound</strong><small>Engine, road and answer cues</small></div><button class="setting-toggle" id="setting-sound" aria-pressed="${saved.sound}">${saved.sound?'ON':'OFF'}</button></div><div class="setting-row"><div><strong>Vibration</strong><small>Light feedback on supported phones</small></div><button class="setting-toggle" id="setting-haptics" aria-pressed="${p.haptics}">${p.haptics?'ON':'OFF'}</button></div><label class="setting-label" for="setting-graphics">GRAPHICS</label><select id="setting-graphics"><option value="auto">Auto · adapts to your device</option><option value="high">High · sharper picture</option><option value="battery">Battery saver · lighter rendering</option></select><label class="setting-label" for="setting-motion">MOTION</label><select id="setting-motion"><option value="system">Follow device settings</option><option value="full">Full · camera and effects</option><option value="reduced">Reduced · steady camera, fewer effects</option></select><p class="save-note">Auto lowers rendering resolution if frame times stay high. Battery saver reduces shadows and effects.</p><button class="primary" id="settings-done">${resume?'BACK TO THE RACE':'DONE'} ↗</button>`);
    $('setting-graphics').value=p.graphics;$('setting-motion').value=p.motion;
    const change=(key,value)=>{saved.preferences={...preferences(),[key]:value};persist();applyPreferences();};
    $('setting-sound').onclick=()=>{saved.sound=!saved.sound;sound.unlock();soundButton();persist();draw();};
    $('setting-haptics').onclick=()=>{change('haptics',!p.haptics);haptic('click');draw();};
    $('setting-graphics').onchange=e=>change('graphics',e.target.value);$('setting-motion').onchange=e=>change('motion',e.target.value);
    $('settings-done').onclick=()=>{closeModal();if(resume)C.resume(race);$('settings').focus();};
  };draw();
}
function celebrate(){
  const el=$('celebration');el.hidden=false;el.innerHTML=preferences().reduced?'':Array.from({length:30},(_,i)=>`<i style="--x:${(i*37)%100}%;--delay:${(i%7)*.09}s;--turn:${i*47}deg;--colour:${['#fbd477','#83decc','#fff4d6'][i%3]}"></i>`).join('');
  document.body.classList.add('race-finished');haptic('finish');
}
function soundButton(){$('sound').classList.toggle('off',!saved.sound);$('sound').setAttribute('aria-pressed',String(saved.sound));$('sound').setAttribute('aria-label',saved.sound?'Mute sound':'Enable sound');}
function toast(text,bad=false,valid=null){
  if(race&&['task','resolving'].includes(race.status)){setText('road-feedback',text);$('road-feedback').classList.toggle('bad',bad);roadFeedbackEnd=performance.now()+1600;return;}
  if(!pendingToast||bad||!pendingToast.bad)pendingToast={text,bad,valid,expiresAt:performance.now()+5000};
}
function updateAnnouncements(now,context){
  if(pendingToast&&(pendingToast.expiresAt<now||pendingToast.valid&&!pendingToast.valid()))pendingToast=null;
  if(!context.announcementsAllowed){$('toast').classList.remove('visible');toastEnd=0;return;}
  if(pendingToast&&now>=toastEnd){const message=pendingToast;pendingToast=null;$('toast').textContent=message.text;$('toast').className='visible'+(message.bad?' bad':'');toastEnd=now+1500;}
  if(now>toastEnd)$('toast').classList.remove('visible');
}
function arenaArtwork(index){
  const sky=['#83c6dc','#63ced3','#4b5c89'][index],ground=['#76a88c','#3c98a3','#455d77'][index];
  const view=index===0?'<path fill="#d2d7bc" d="M6 70V39h16v31h8V28h19v42h24V44h20v26h12V22h19v48Z"/><path fill="#64897d" d="M0 73 35 55 66 70 101 51 150 70v30H0Z"/>':index===1?'<path d="M0 75q15-7 30 0t30 0t30 0t30 0t30 0" fill="none" stroke="#a4e6da" stroke-width="2"/><path d="M13 68V30m116 38V30M13 36q57 42 116 0M13 30l57 38 59-38" stroke="#dce9d9" stroke-width="3" fill="none"/>':'<path fill="#899aab" d="m0 72 37-50 30 38 28-48 55 62v26H0Z"/><path fill="#bfcbd2" d="m22 42 15-20 15 19-14-4Zm57-6 16-24 19 24-19-6Z"/><path fill="#415a72" d="m0 92 40-35 33 34 33-28 44 30v7H0Z"/>';
  return `<svg viewBox="0 0 150 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="150" height="100" fill="${sky}"/><circle cx="119" cy="22" r="10" fill="${index===2?'#d5d5dc':'#ffe4a3'}"/><path d="M0 65h150v35H0Z" fill="${ground}"/>${view}<path fill="#2c475b" d="m68 54 14 0 39 46H30Z"/><path d="m74 59-2 9m-1 7-5 15" fill="none" stroke="#fff0bd" stroke-width="2"/><path d="M0 94h150v6H0Z" fill="#102e48" opacity=".5"/></svg>`;
}
function refreshHome(){
  saved.unit=unit().id;
  document.querySelectorAll('[data-team]').forEach(b=>{const chosen=b.dataset.team===saved.teamId;b.classList.toggle('selected',chosen);b.setAttribute('aria-pressed',String(chosen));});
  $('start').disabled=!teamById(saved.teamId);$('start').querySelector('span').textContent=saved.teamId?'START YOUR ENGINE':'CHOOSE YOUR TEAM';
  refreshUltiUI();
  setText('lesson-grade',saved.grade);setText('lesson-meta',`GRADE ${saved.grade} ${GRADE_LEVELS[saved.grade]} · UNIT ${BANK.find(g=>g.grade===saved.grade).units.indexOf(unit())+1}`);setText('lesson-unit',unit().title);
  $('lesson-picker').setAttribute('aria-label',`Choose your lesson: Grade ${saved.grade} ${GRADE_LEVELS[saved.grade]}, ${unit().title}`);
  document.querySelectorAll('[data-diff]').forEach(b=>{b.classList.toggle('selected',b.dataset.diff===saved.difficulty);b.setAttribute('aria-pressed',String(b.dataset.diff===saved.difficulty));});
  $('difficulty-note').textContent={relaxed:'More time. Real racing.',challenge:'Fast rivals. Race to win.'}[saved.difficulty];
  let p=scores();if(!arenaOpen(selectedArena))selectedArena=0;
  $('total-stars').textContent=p.reduce((a,b)=>a+b,0)+' / 9 stars';
  $('arena-cards').innerHTML=C.ARENAS.map((a,i)=>{let locked=!arenaOpen(i);return`<button class="arena-card ${selectedArena===i?'selected ':''}${locked?'locked':''}" data-arena="${i}" style="--accent:${a.color}" aria-pressed="${selectedArena===i}" aria-label="${escape(a.name)}${locked?', locked. Finish first in '+arenaRequirement(i)+' to unlock.':', '+p[i]+' stars'}"><span class="arena-number">${locked?'LOCKED':String(i+1).padStart(2,'0')}</span><span class="arena-mini ${a.id==='coast'?'coast':a.id==='storm'?'storm':''}">${arenaArtwork(i)}</span><strong>${escape(a.name)}</strong><span class="stars">${locked?'—':('★'.repeat(p[i])+'☆'.repeat(3-p[i]))}</span></button>`;}).join('');
  $('arena-cards').querySelectorAll('button').forEach(b=>b.onclick=()=>{const i=+b.dataset.arena;if(!arenaOpen(i)){toast('Finish first in '+arenaRequirement(i)+' to unlock.');return;}selectedArena=i;sound.tone('click');refreshHome();});
  $('scene-name').textContent=C.ARENAS[selectedArena].name.toUpperCase();$('scene-name').nextElementSibling.textContent=String(selectedArena+1).padStart(2,'0')+' / 03';document.documentElement.style.setProperty('--accent',C.ARENAS[selectedArena].color);scene?.setup(selectedArena);persist();
  setText('arena-length',(C.ARENAS[selectedArena].length/1000).toFixed(2)+' KM');setText('arena-checkpoints',C.ARENAS[selectedArena].checkpoints+' CHECKPOINTS');setText('ride-name',teamById(saved.teamId)?.name.toUpperCase()||'CHOOSE A TEAM');
  const mastery=masteryStats(saved,saved.unit);$('mastery-preview').textContent=`UNIT MASTERY · ${mastery.unique} ITEMS · ${mastery.accuracy}% FIRST TRY${mastery.tier?' · '+['','EXPLORER','SCHOLAR','MASTER'][mastery.tier]:''}`;scene?.setCosmetics(resolvedLook(saved));
}
function lessonChooser(){
  if(mode!=='home')return;
  let grade=saved.grade,unitId=saved.unit;
  showModal(`<div class="lessons-heading"><div><h2 id="modal-title">Lessons</h2><p id="lessons-intro">Choose your lesson</p></div><button id="lesson-close" class="lesson-close" aria-label="Close Lessons">×</button></div><div class="lessons-grades-section"><span class="setting-label" id="grade-label">GRADE / LEVEL</span><div class="grades lesson-grades" role="group" aria-labelledby="grade-label">${BANK.map(g=>`<button type="button" data-grade="${g.grade}" aria-label="Grade ${g.grade} ${GRADE_LEVELS[g.grade]}" aria-pressed="${g.grade===grade}"><span>GRADE ${g.grade}</span><strong>${GRADE_LEVELS[g.grade]}</strong></button>`).join('')}</div></div><span class="setting-label" id="unit-label">THEME / UNIT</span><div id="unit" class="lesson-units" role="group" aria-labelledby="unit-label"></div><div class="lesson-confirm"><p id="lesson-preview" class="lesson-preview"></p><div class="modal-actions"><button id="lesson-cancel" class="secondary">CANCEL</button><button id="lesson-apply" class="primary">USE THIS LESSON ↗</button></div></div>`);
  $('modal').classList.add('lessons-modal');
  const draw=()=>{
    const units=BANK.find(g=>g.grade===grade).units;
    if(!units.some(u=>u.id===unitId))unitId=units[0].id;
    document.querySelectorAll('[data-grade]').forEach(b=>{const selected=+b.dataset.grade===grade;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});
    $('unit').innerHTML=units.map((u,i)=>`<button type="button" class="lesson-unit-option" data-unit="${u.id}" aria-label="Unit ${i+1}: ${escape(u.title)}" aria-describedby="lesson-summary-${u.id}"><span class="unit-number" aria-hidden="true">${i+1}</span><span class="unit-copy"><strong class="unit-title">${escape(u.title)}</strong><span id="lesson-summary-${u.id}" class="unit-summary">${escape(lessonSummary(u))}</span>${u.subthemes?.length?`<span class="unit-subthemes">Includes: ${u.subthemes.map(s=>escape(s.title)).join(' · ')}</span>`:''}</span><span class="unit-check" aria-hidden="true">✓</span></button>`).join('');
    const select=()=>{
      $('unit').querySelectorAll('button').forEach(b=>{const chosen=b.dataset.unit===unitId;b.classList.toggle('selected',chosen);b.setAttribute('aria-pressed',String(chosen));});
      $('lesson-preview').textContent=units.find(u=>u.id===unitId).title;
    };
    $('unit').querySelectorAll('button').forEach(b=>b.onclick=()=>{unitId=b.dataset.unit;select();});select();
  };
  document.querySelectorAll('[data-grade]').forEach(b=>b.onclick=()=>{grade=+b.dataset.grade;unitId=BANK.find(g=>g.grade===grade).units[0].id;draw();});
  $('lesson-close').onclick=closeModal;$('lesson-cancel').onclick=closeModal;$('lesson-apply').onclick=()=>{saved.grade=grade;saved.unit=unitId;selectedArena=0;closeModal();refreshHome();};draw();
}
function refreshUltiUI(){
  const snapshot=ultiSnapshot(saved),team=teamById(saved.teamId);
  setText('ulti-balance',team?`${snapshot.totals[team.id]} ULTI`:'TEAM POINTS');
  document.querySelectorAll('[data-ulti-total]').forEach(el=>{const text=String(snapshot.totals[el.dataset.ultiTotal]||0);if(el.textContent!==text)el.textContent=text;});
  const expiry=$('ulti-expiry');if(expiry){const first=Math.min(...snapshot.receipts.map(r=>r.expiresAt));const text=Number.isFinite(first)?'Next expiry: '+new Date(first).toLocaleString():'No active points. Finish first to earn 10 for your team.';if(expiry.textContent!==text)expiry.textContent=text;}
}
function ultiWallet(){
  showModal(`${host('cheer')}<span class="modal-kicker">YOUR TEAM · YOUR VICTORY</span><h2 id="modal-title">Ulti points.</h2><p>Finish first with <strong>${ULTI_MIN_STARS}+ stars</strong> to earn points for the team you raced with. Each reward expires after <strong>3 days</strong>.</p><table class="ulti-rules"><thead><tr><th></th>${C.ARENAS.map(a=>`<th>${escape(a.name)}</th>`).join('')}</tr></thead><tbody>${Object.entries(ULTI_POINTS).map(([mode,row])=>`<tr><th>${mode==='challenge'?'Challenge':'Relaxed'}</th>${row.map(p=>`<td>${p}</td>`).join('')}</tr>`).join('')}</tbody></table><p class="save-note">Today on this device: <strong>${Math.min(ultiEarnedToday(saved),ULTI_DAILY_CAP)} / ${ULTI_DAILY_CAP}</strong> points. The limit resets at midnight.</p><div class="ulti-teams">${TEAMS.map(t=>`<div class="ulti-team ${saved.teamId===t.id?'selected':''}" style="--team:${t.accent}"><span class="team-letter">${t.letter}</span><span>${t.name}</span><strong data-ulti-total="${t.id}">0</strong></div>`).join('')}</div><p id="ulti-expiry" class="save-note"></p><button id="ulti-export" class="review-lap-button">EXPORT POINTS RECORD ↗</button><p class="save-note">Points are saved in this browser. The connection to the other game will be added later. Exporting keeps the original expiry.</p><button id="ulti-done" class="primary">BACK TO GARAGE</button>`);
  refreshUltiUI();$('ulti-done').onclick=closeModal;$('ulti-export').onclick=()=>{
    const url=URL.createObjectURL(new Blob([exportUlti(saved)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='wordramp-ulti-points.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
}
function settleLearning(){if(!race)return;const events=race.answerEvents.slice(settledAnswers);let changed=events.length||saved.fuel!==race.fuel;if(events.length){latestUnlock=Math.max(latestUnlock,recordLearning(saved,race.unit.id,events));settledAnswers=race.answerEvents.length;}saved.fuel=race.fuel;saved.reviewQueue[race.unit.id]=race.review.filter(i=>!i.recovered).map(i=>({...i}));if(changed)persist();}
function garage(){
  const tier=garageTier(saved),m=masteryStats(saved,saved.unit),look=resolvedLook(saved);
  showModal(`${host('smile')}<span class="modal-kicker">MASTERY GARAGE</span><h2 id="modal-title">Wear what you learn.</h2><p>${escape(unit().title)} · ${m.unique} distinct items · ${m.accuracy}% first try · ${m.arenas}/3 arenas</p><p>Your team sets your car colour. Earn badges and a trail through unit mastery.</p><div class="paint-grid">${TEAMS.map(t=>`<button class="paint-option ${saved.teamId===t.id?'selected':''}" data-livery="${t.id}" aria-pressed="${saved.teamId===t.id}"><span class="paint-swatch" style="--paint:#${t.color.toString(16)}"></span><strong>${t.name}</strong><small>TEAM LIVERY</small></button>`).join('')}</div><p class="garage-label">BADGE</p><div class="badge-options">${['Off','Explorer','Scholar','Master'].map((name,i)=>`<button data-badge="${i}" ${i>tier?'disabled':''} class="${look.badge===i?'selected':''}">${name}</button>`).join('')}</div><button id="trail-option" class="trail-option" ${tier<3?'disabled':''} aria-pressed="${look.trail}">Aurora trail · ${tier<3?'MASTER REWARD':look.trail?'ON':'OFF'}</button><div class="mastery-rules">At 90% first-try accuracy: <strong>Explorer</strong> needs 6 distinct items + 1 arena; <strong>Scholar</strong> needs 12 + 2 arenas; <strong>Master</strong> needs 18 + all 3. Earn rewards in any unit and equip them throughout your garage.</div><p class="save-note">Fuel ${saved.fuel}/100 · each first-try answer earns 10; every third in a streak adds 5. Each charge costs 30, up to three levels. ${touchControls?'Slide up for Nitro, slide down to save it while keeping regular acceleration. Slide farther up to stack.':'Hold NITRO or Space to use it; release to save the remainder.'} Driving always remains available.</p><button id="garage-done" class="primary">BACK TO GARAGE</button>`);
  $('modal').querySelectorAll('[data-livery]').forEach(b=>b.onclick=()=>{saved.teamId=b.dataset.livery;persist();scene.setCosmetics(resolvedLook(saved));garage();});$('modal').querySelectorAll('[data-badge]').forEach(b=>b.onclick=()=>{if(equip(saved,'badge',+b.dataset.badge)){persist();scene.setCosmetics(resolvedLook(saved));garage();}});$('trail-option').onclick=()=>{if(equip(saved,'trail',!saved.look.trail)){persist();scene.setCosmetics(resolvedLook(saved));garage();}};$('garage-done').onclick=()=>{closeModal();refreshHome();};
}
let upHeld=false,throttleKeyHeld=false,heldCarId=null,spaceHeld=false,heldNitroId=null,heldRoadNitroId=null,previousBoostLevel=0;
function drivingHeld(){return upHeld||throttleKeyHeld||heldCarId!==null||heldThrottleId!==null;}
// Physical holds remain live through autopilot; the core owns when they apply.
function applyAcceleration(){if(race){const legacyBoost=upHeld||throttleKeyHeld||heldThrottleId!==null||heldCarId!==null&&!pointerStart?.touch;C.setAccelerating(race,drivingHeld(),!!legacyBoost);C.setNitroHeld(race,spaceHeld||heldNitroId!==null||heldRoadNitroId!==null);}}
function clearAcceleration(){
  const worldId=pointerStart?.id;pointerStart=null;
  const nitroId=heldNitroId;heldNitroId=null;heldRoadNitroId=null;spaceHeld=false;if(nitroId!==null&&$('nitro').hasPointerCapture?.(nitroId))$('nitro').releasePointerCapture(nitroId);
  const id=heldCarId;heldCarId=null;upHeld=false;throttleKeyHeld=false;const throttleId=heldThrottleId;heldThrottleId=null;if(throttleId!==null&&$('throttle').hasPointerCapture?.(throttleId))$('throttle').releasePointerCapture(throttleId);
  if(id!==null&&$('world').hasPointerCapture?.(id))$('world').releasePointerCapture(id);
  if(worldId!=null&&$('world').hasPointerCapture?.(worldId))$('world').releasePointerCapture(worldId);
  if(race){C.setAccelerating(race,false);C.setNitroHeld(race,false);}
}
function showModal(html){pendingToast=null;toastEnd=0;$('toast').classList.remove('visible');clearAcceleration();if(connection.pointerId!==null)endStroke({pointerId:connection.pointerId});$('modal').classList.remove('finish-modal','dnf-result');$('modal').classList.remove('lessons-modal');modalFocus=document.activeElement;$('modal').innerHTML=html;$('modal-backdrop').hidden=false;setTimeout(()=>$('modal').focus(),0);}
function closeModal(){$('modal-backdrop').hidden=true;$('modal').classList.remove('lessons-modal');$('modal').innerHTML='';modalFocus?.focus?.();}
function help(startAfter=false){
  const driveHelp=(touchControls?'Hold anywhere on the road to accelerate. Keep your thumb down and swipe left or right to change lanes. You can swipe again without lifting.':'Swipe the road, tap the arrows, or use ← → / A D. Hold your car or the speed button to accelerate. On a computer, hold ↑.')+' Release acceleration and Nitro to coast and brake for traffic.';
  const boostHelp=touchControls?'Slide your driving thumb forward to use Nitro, then hold it there. Slide down to save the remaining charge and keep regular acceleration. Slide farther forward for a second or third charge, up to three levels. Each new charge costs 30 fuel; resuming a saved charge is free. Lifting your thumb releases acceleration and Nitro. Fuel and Nitro status sit beside your race position.':'Hold NITRO or Space to boost; release to save the remaining charge. An upward swipe also boosts while your finger stays down. A new charge costs 30 fuel. Tap +30 or press N to stack up to three levels. Holding acceleration also uses a loaded charge. Regular acceleration displays up to 90 km/h; maximum Nitro displays 200 km/h.';
  const returnHelp=touchControls?'After choosing, keep holding the road to return to normal pace sooner.':'After choosing, hold your car, the speed button or ↑ to return to normal pace sooner.';
  if(race&&!['finished','failed','paused'].includes(race.status))autoResume=C.pause(race);
  showModal(`${host('point')}<span class="modal-kicker">WELCOME TO WORDRAMP</span><h2 id="modal-title">Your team.<br>Your open road.</h2><div class="help-step"><span class="step-num">1</span><div><strong>Find your line.</strong><p>${driveHelp}</p></div></div><div class="help-step"><span class="step-num">2</span><div><strong>Read the road.</strong><p>Steer towards the correct full-text answer, or tap its sign. Rivals match your progress during every English task, even if you hold acceleration. Correct exits protect your speed recovery too. Lights and forks enter slow motion close to the signs. Steering stays active. ${returnHelp} Already holding? Keep holding. The answer locks at the road line.</p></div></div><div class="help-task-grid"><div><b>GREEN LIGHT</b><span>Read in slow motion, then steer into the matching answer to turn the light green.</span></div><div><b>ROAD REPAIR</b><span>Release the car: autopilot holds your entry speed and lane while the world slows into a green-gold focus effect. Connect the three blocks; the road repairs immediately, then normal pace and driving controls return smoothly. Extra thinking time safely freezes the approach before the gap. A held Up key or driving touch resumes automatically after autopilot.</span></div><div><b>SHORTCUT</b><span>Choose a sign in close-range slow motion. The right lane leads into a visible shortcut.</span></div><div><b>CROSSWALK</b><span>Sort each visitor’s word while autopilot approaches in slow motion. Clear the crossing before you arrive; all cars wait if anyone is still on the road.</span></div></div><div class="help-step"><span class="step-num">3</span><div><strong>Earn your next boost.</strong><p>First-try English answers earn fuel. Every third adds a streak bonus. ${boostHelp}</p></div></div><div class="help-step"><span class="step-num">4</span><div><strong>Look after your car.</strong><p>Three small marks below the clock show your remaining hits. Each driving bump damages the car; the third ends the race. Change lanes into clear gaps. Every new race starts fully repaired.</p></div></div><p class="save-note">Choose Slytherin, Hufflepuff, Gryffindor or Ravenclaw in the garage. A first-place finish with 2+ stars earns your team Ulti points, valid for 3 days: Relaxed 2/4/6 and Challenge 5/7/9 by arena, up to 40 points a day. Plan about five minutes per arena, with 12–16 checkpoints and longer open-road stretches. Holding acceleration and using Nitro can shorten your run. Your stars reward accurate English and clean driving. Your racing position is separate. All cars wait for pedestrians to reach the sidewalk.</p><details><summary>Race rules & keyboard shortcuts</summary><p>Finish first to unlock the next arena for this unit and difficulty. Stars still reward your English at every finishing position. Wrong answers cost 1.5 seconds and never damage your car. Each separate driving impact costs ${C.DIFFICULTIES[saved.difficulty].penalty} seconds and one condition mark. Three hits end the race. A cracked windscreen warns after the first hit; a loose bonnet and smoke mean one hit left. Rivals can close the gap while you recover, using their normal driving. Autopilot protects your car and reading time. Relaxed gives 3 seconds of impact protection; Challenge gives 2. Each retry starts fully repaired. Correct shortcuts add 3 seconds; wrong routes take a recoverable detour. Rivals share your regular top speed and earn fuel for boosts. Nitro waits through tasks and crossings. Use 1 / 2 / 3 for the road signs or repair blocks. Use ← / → at crosswalks. Escape / P pauses. Missed words return later, with an optional review lap after the finish.</p></details><button id="help-done" class="primary">${startAfter?'LET’S DRIVE':'GOT IT'} ↗</button>`);
  $('help-done').onclick=()=>{closeModal();if(startAfter){saved.crosswalkTutorial=true;persist();begin();}else if(autoResume){C.resume(race);autoResume=false;}};
}
function begin(reviewItems=null){
  if(!teamById(saved.teamId)){goHome();return;}
  if(!Array.isArray(reviewItems)&&!arenaOpen(selectedArena)){goHome();toast('Finish first to unlock the next arena.');return;}
  clearGameSelection();
  $('launch-caption').textContent=touchControls?'HOLD TO DRIVE · SWIPE TO STEER · SLIDE ↑ FOR NITRO':'READ THE ROAD. RACE YOUR RIVALS.';
  invalidateLayout();launchNumber=0;lastPlace=null;pendingToast=null;toastEnd=0;$('toast').classList.remove('visible');$('celebration').hidden=true;$('celebration').innerHTML='';document.body.classList.remove('race-finished','car-critical','car-breaking');const items=Array.isArray(reviewItems)?reviewItems:null;settleLearning();clearAcceleration();closeModal();race=items?C.createReviewLap(unit(),items,saved.difficulty,Date.now(),{fuel:saved.fuel}):C.createRace(unit(),saved.difficulty,selectedArena,Date.now(),{fuel:saved.fuel,reviews:saved.reviewQueue[unit().id]||[]});preloadPictures(race);race.teamId=saved.teamId;race.runId=newIdentity('run');settledAnswers=0;latestUnlock=0;mode='race';lastStatus='';lastTask='';lastResult=null;scene.setup(items?0:selectedArena);scene.clearGate();scene.currentLane=0;scene.setCosmetics(resolvedLook(saved));$('rival-tags').innerHTML=race.rivals.map(r=>`<span data-rival="${r.id}" style="--rival:#${r.color.toString(16)}">${r.name}<small></small></span>`).join('');document.body.classList.add('racing');$('home').hidden=true;$('hud').hidden=false;$('pause').hidden=false;$('countdown').hidden=false;$('warning').hidden=true;$('road-learning').hidden=true;$('controls').hidden=true;
  previousBoostLevel=0;$('launch-kicker').textContent=race.arena.name.toUpperCase();$('launch-caption').textContent=race.reviewLap?'A SHORT LAP. A STRONGER NEXT DRIVE.':'YOU · COBALT · EMBER';sound.unlock();sound.tone('click');
}
function goHome(){document.body.dataset.nitroLevel='0';settleLearning();clearAcceleration();race=null;mode='home';lastTask='';lastStatus='';lastResult=null;autoResume=false;scene?.clearGate();closeModal();document.body.classList.remove('racing','nitro-active','race-finished','nitro-ready','car-critical','car-breaking');pendingToast=null;toastEnd=0;$('toast').classList.remove('visible');$('celebration').hidden=true;$('celebration').innerHTML='';$('rival-tags').innerHTML='';for(let id of['route-status','hud','pause','countdown','warning','road-learning','controls'])$(id).hidden=true;$('home').hidden=false;refreshHome();sound.update(null);}
function pauseRace(){
  if(!race||!C.pause(race))return;
  sound.tone('pause');const team=teamById(race.teamId),place=C.raceOrder(race).findIndex(r=>r.id==='player')+1;
  showModal(`${host('think')}<span class="modal-kicker">PIT STOP · WORDRAMP</span><h2 id="modal-title">Take a breath.</h2><p>Your race clock is paused.</p><div class="pause-lesson"><strong>${escape(race.arena.name)}</strong><span>Grade ${saved.grade} · ${escape(race.unit.title)} · ${C.DIFFICULTIES[race.difficulty].label}</span><span class="pause-team" style="--team:${team.accent}">${escape(team.name)}</span></div><dl class="pause-stats"><div><dt>FIRST TRY</dt><dd id="pause-accuracy">${race.correct} / ${race.tasks.length}</dd></div><div><dt>DISTANCE</dt><dd id="pause-distance">${Math.floor(race.distance)} / ${race.arena.length} m</dd></div><div><dt>CHECKPOINTS</dt><dd id="pause-checkpoints">${race.taskIndex} / ${race.tasks.length}</dd></div><div><dt>${C.raceFailed(race)?'STATUS':'POSITION'}</dt><dd>${C.raceFailed(race)?'DNF':race.reviewLap?'Review lap':place+' / 3'}</dd></div><div><dt>BEST STREAK</dt><dd>${race.bestStreak}</dd></div><div><dt>CAR CONDITION</dt><dd>${C.carCondition(race).remaining} / 3 hits left</dd></div></dl><button id="resume" class="primary">BACK ON THE ROAD ↗</button><div class="pause-tools"><button id="pause-settings">Settings</button><button id="pause-help">How to play</button><button id="pause-sound">Sound ${saved.sound?'on':'off'}</button></div><div class="modal-actions"><button id="restart" class="secondary">Restart race</button><button id="exit-race" class="secondary">Return to garage</button></div>`);
  $('resume').onclick=()=>{closeModal();C.resume(race);};$('pause-settings').onclick=()=>{C.resume(race);settings();};$('pause-help').onclick=()=>{C.resume(race);help();};
  $('pause-sound').onclick=()=>{saved.sound=!saved.sound;sound.unlock();soundButton();persist();$('pause-sound').textContent='Sound '+(saved.sound?'on':'off');};
  $('restart').onclick=begin;$('exit-race').onclick=goHome;
}
function askExit(){if(mode==='home'){goHome();return;}if(race&&['finished','failed'].includes(race.status)){goHome();return;}pauseRace();}
let connection={key:'',sequence:[],pointerId:null,point:null,dragging:false,errorUntil:0};
function connectionRects(){return [...$('road-answers').querySelectorAll('[data-block]')].map(b=>{const r=b.getBoundingClientRect();return{id:+b.dataset.block,left:r.left-3,right:r.right+3,top:r.top-3,bottom:r.bottom+3};});}
function clearConnection(){
  if(connection.pointerId!==null&&$('road-answers').hasPointerCapture?.(connection.pointerId))$('road-answers').releasePointerCapture(connection.pointerId);
  connection={key:'',sequence:[],pointerId:null,point:null,dragging:false,errorUntil:0};
  $('repair-path').setAttribute('d','');$('repair-tip').setAttribute('d','');
}
function drawConnection(){
  const points=connection.sequence.map(id=>{const b=$('road-answers').querySelector(`[data-block="${id}"]`);return b?{x:parseFloat(b.style.left),y:parseFloat(b.style.top)}:null;}).filter(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y));
  $('repair-path').setAttribute('d',points.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' '));
  const last=points.at(-1),tip=connection.dragging&&connection.point;
  $('repair-tip').setAttribute('d',last&&tip?'M'+last.x+' '+last.y+' L'+tip.x+' '+tip.y:'');
  $('repair-links').classList.toggle('error',performance.now()<connection.errorUntil);
  $('repair-links').classList.toggle('complete',!!race?.task?.solved);
}
function connectHit(id){
  if(race?.status!=='task'||race.task.kind!=='repair'||race.task.solved||performance.now()<connection.errorUntil||connection.sequence.includes(id))return;
  connection.sequence.push(id);sound.tone('build');
  if(connection.sequence.length===3){
    const ok=C.connectRepair(race,connection.sequence);
    connection.dragging=false;connection.point=null;
    if(!ok)connection.errorUntil=performance.now()+650;
  }
}
function beginStroke(e){
  if(connection.pointerId!==null&&connection.pointerId!==e.pointerId)return;
  if(race?.status!=='task'||race.task.kind!=='repair'||race.task.solved||performance.now()<connection.errorUntil)return;
  const b=e.target.closest('[data-block]');if(!b)return;
  e.preventDefault();e.stopPropagation();sound.unlock();
  connection.pointerId=e.pointerId;connection.dragging=true;connection.point={x:e.clientX,y:e.clientY};$('road-answers').setPointerCapture(e.pointerId);connectHit(+b.dataset.block);drawConnection();
}
function moveStroke(e){
  if(!connection.dragging||e.pointerId!==connection.pointerId)return;
  e.preventDefault();const samples=e.getCoalescedEvents?.();
  for(const point of samples?.length?samples:[e]){
    const to={x:point.clientX,y:point.clientY},from=connection.point||to;
    for(const id of strokeHits(from,to,connectionRects(),connection.sequence))connectHit(id);
    connection.point=to;
  }
  drawConnection();
}
function endStroke(e){
  if(e.pointerId!==connection.pointerId)return;
  connection.dragging=false;connection.point=null;
  if($('road-answers').hasPointerCapture?.(e.pointerId))$('road-answers').releasePointerCapture(e.pointerId);
  connection.pointerId=null;drawConnection();
}
$('road-answers').addEventListener('pointerdown',beginStroke);
$('road-answers').addEventListener('pointermove',moveStroke);
$('road-answers').addEventListener('pointerup',endStroke);
$('road-answers').addEventListener('pointercancel',endStroke);
let pedestrianSwipe=null;
$('pedestrian-words').addEventListener('pointerdown',e=>{
  const b=e.target.closest('[data-person]');if(!b||race?.status!=='task'||race.task.kind!=='pedestrian'||race.task.pedWait>0)return;
  e.preventDefault();sound.unlock();pedestrianSwipe={id:e.pointerId,x:e.clientX,y:e.clientY,person:race.task.personIndex};b.setPointerCapture(e.pointerId);
});
function endPedestrianSwipe(e){
  if(pedestrianSwipe?.id!==e.pointerId)return;
  const start=pedestrianSwipe;pedestrianSwipe=null;
  if(e.type!=='pointercancel'&&race?.task?.personIndex===start.person&&Math.abs(e.clientX-start.x)>22&&Math.abs(e.clientX-start.x)>Math.abs(e.clientY-start.y)*.7){if(C.sortPerson(race,e.clientX>start.x?1:0))sound.tone('click');}
  if(e.target.hasPointerCapture?.(e.pointerId))e.target.releasePointerCapture(e.pointerId);
}
$('pedestrian-words').addEventListener('pointerup',endPedestrianSwipe);
$('pedestrian-words').addEventListener('pointercancel',endPedestrianSwipe);
function roadLearning(){
  const active=['task','resolving'].includes(race?.status),t=race?.task,row=active?(C.currentRow(race)||t?.rows[0]):null;
  const sinceComplete=t?.completed?race.elapsed-t.completedAt:0,leaving=race?.status==='resolving'&&sinceComplete>.6;
  $('road-learning').hidden=!row||sinceComplete>1.05;
  $('road-learning').classList.toggle('leaving',leaving);
  if(!row){if(connection.key&&race?.status!=='paused')clearConnection();return;}
  const repair=t.kind==='repair',pedestrian=t.kind==='pedestrian',key=t.id;
  $('road-learning').classList.toggle('repair-mode',repair);$('road-learning').classList.toggle('pedestrian-mode',pedestrian);$('repair-links').hidden=!repair;$('pedestrian-words').hidden=!pedestrian;
  // One set of immutable word cards per checkpoint. Resolving retains the same nodes.
  if(lastTask!==key){
    layoutObserver?.disconnect();for(const id of ['app','hud','controls','road-prompt'])layoutObserver?.observe($(id));invalidateLayout();clearConnection();setText('road-feedback','');roadFeedbackEnd=0;lastTask=key;connection.key=key;pedestrianSwipe=null;
    $('road-kicker').textContent=repair?(t.reviewOf?'REVIEW REPAIR · AUTO CRUISE':'ROAD REPAIR · AUTO CRUISE'):t.reviewOf?'SECOND LOOK · A DIFFERENT CLUE':pedestrian?'CROSSWALK':t.picture?(t.kind==='light'?'PICTURE SIGN · GREEN LIGHT':'PICTURE ROUTE'):t.kind==='light'?'GREEN LIGHT':'CHOOSE YOUR ROUTE';
    $('road-question').textContent=repair?(t.reviewOf?t.prompt:'Release the car. Connect the 3 blocks.'):pedestrian?'Which category does each word belong to?':t.prompt;
    // Picture to word: the Fluent picture is the clue above the question.
    if(t.picture==='word')$('road-question').insertAdjacentHTML('afterbegin',`<img class="sign-emoji" src="${emojiSrc(t.image)}" alt="Picture clue" draggable="false">`);
    $('road-prompt').classList.toggle('picture-sign',!!t.picture);
    $('road-instruction').textContent=repair?'DRAG THROUGH ALL 3 BLOCKS IN THE RIGHT ORDER':pedestrian?'SWIPE THE WORD LEFT / RIGHT · OR TAP A CATEGORY':'STEER INTO YOUR ANSWER · TAP A SIGN TO STEER';
    $('road-answers').innerHTML=row.options.map((text,i)=>`<button class="road-answer ${repair?'repair-block':pedestrian?'category-sign':''}" ${repair?`data-block="${t.order[i]}"`:pedestrian?`data-side="${i}"`:`data-lane="${i}"`} aria-label="${repair?'Connect block':pedestrian?`Send person ${i===0?'left':'right'}`:`Steer into ${['left','middle','right'][i]} lane`}: ${escape(text)}"><span class="answer-letter">${repair?'◉':pedestrian?(i===0?'← LEFT':'RIGHT →'):['A)','B)','C)'][i]}</span><span class="answer-text">${t.optionImages?`<img class="answer-emoji" src="${emojiSrc(t.optionImages[i])}" alt="${escape(text)}" draggable="false">`:signWords(pedestrian?categoryTitle(text):text.replace(/^…\s*/,''))}</span></button>`).join('');
    $('road-answers').querySelectorAll('button').forEach(b=>{layoutObserver?.observe(b);b.onclick=e=>{
      if(race?.status!=='task')return;
      if(repair){if(e.detail===0)connectHit(+b.dataset.block);}
      else if(pedestrian){sound.unlock();if(C.sortPerson(race,+b.dataset.side))sound.tone('click');}
      else{sound.unlock();C.choose(race,+b.dataset.lane);sound.tone('click');haptic('click');}
    };});
    $('pedestrian-words').innerHTML=pedestrian?t.people.map(p=>`<button class="person-word" data-person="${p.id}" aria-label="Swipe ${escape(p.word)} left or right"><span>${signWords(p.word)}</span><small>← SWIPE →</small></button>`).join(''):'';
  }
  if(repair){
    if(t.solved&&connection.sequence.length!==3)connection.sequence=t.connection.slice();
    if(connection.errorUntil&&performance.now()>=connection.errorUntil){connection.sequence=[];connection.errorUntil=0;}
    setText('road-question',t.solved?t.answer:t.reviewOf?t.prompt:'Release the car. Connect the 3 blocks.');
    setText('road-kicker',t.solved?'ROAD REPAIRED':t.reviewOf?'REVIEW REPAIR · AUTO CRUISE':'ROAD REPAIR · AUTO CRUISE');
    setText('road-instruction',t.solved?'SENTENCE CONNECTED · ROAD REPAIRED':connection.errorUntil?'TRY A DIFFERENT ORDER':'DRAG THROUGH ALL 3 BLOCKS IN THE RIGHT ORDER');
  }else if(pedestrian){
    setText('road-kicker',t.completed?(C.crosswalkOccupied(race,t)?'VISITORS LEAVING':'CROSSWALK CLEAR'):`CROSSWALK · VISITOR ${Math.min(t.personIndex+1,t.people.length)} / ${t.people.length}`);
  }
  const p=scene.roadProjection(),prompt=$('road-prompt'),anchors=p.answers;if(anchors.length!==3)return;
  const {width,height}=scene.viewport||{width:innerWidth,height:innerHeight};
  const landscape=height<600&&width>height;
  const positions=laneLayout(width,anchors),buttons=[...$('road-answers').querySelectorAll('button')];
  buttons.forEach((b,i)=>{const width=positions[pedestrian?i*2:i].width;setStyle(b,'width',width.toFixed(1)+'px');fitSignWords(b,b.querySelector('.answer-text'),width);});
  if(pedestrian)for(const b of $('pedestrian-words').children){setStyle(b,'width',positions[1].width.toFixed(1)+'px');fitSignWords(b,b.querySelector('span'),positions[1].width);}
  const {hudBottom,controlsTop,promptHeight,answerHeight}=measureLayout(),gap=landscape?10:17;
  const bottomLimit=controlsTop-12;
  const {py,ay,stagger}=roadVerticalLayout({hudBottom,promptHeight,answerHeight,promptY:p.prompt.y,answerY:anchors[1].y,controlsTop,repair,landscape,viewportHeight:height});
  setStyle(prompt,'left',width/2+'px');setStyle(prompt,'top',py.toFixed(1)+'px');
  buttons.forEach((b,i)=>{
    const value=repair?+b.dataset.block:null,position=connection.sequence.indexOf(value),visited=repair&&position>=0;
    b.disabled=race.status!=='task'||pedestrian&&(t.pedWait>0||!C.pedestrianReady(race,t));
    b.classList.toggle('selected',!repair&&!pedestrian&&race.lane===i-1);b.classList.toggle('linked',visited);b.classList.toggle('connected',repair&&t.solved||!repair&&!pedestrian&&t.completed&&i===t.correctIndex);b.classList.toggle('error',visited&&performance.now()<connection.errorUntil);
    b.setAttribute('aria-pressed',String(repair?visited:!pedestrian&&race.lane===i-1));
    if(repair){const letter=b.querySelector('.answer-letter'),text=visited?String(position+1):'◉';if(letter.textContent!==text)letter.textContent=text;}
    const pos=positions[pedestrian?i*2:i];setStyle(b,'left',pos.x.toFixed(1)+'px');setStyle(b,'top',(ay+(repair&&i===1?stagger:0)).toFixed(1)+'px');
  });
  if(pedestrian){
    $('road-instruction').textContent=t.completed?(C.crosswalkOccupied(race,t)?'WAIT UNTIL ALL VISITORS REACH THE SIDEWALK':'CROSSWALK CLEAR · LET’S GO'):!C.pedestrianReady(race,t)?(t.peopleEntryAt==null?'TRAFFIC CLEARING THE STRIPES':'VISITORS APPROACHING · READ THE CATEGORIES'):`SWIPE LEFT / RIGHT · ${Math.ceil(C.crosswalkTimeLeft(race,t))}s`;
    const projections=scene.pedestrianProjection(race);
    [...$('pedestrian-words').children].forEach((b,i)=>{
      const person=t.people[i],projection=projections[i],age=person.sent?race.elapsed-person.sentAt:0,visible=projection?.visible&&C.pedestrianReady(race,t)&&(i===t.personIndex&&!person.sent||person.sent&&age<1.4);
      b.hidden=!visible;b.disabled=person.sent||t.pedWait>0||race.status!=='task';b.classList.toggle('departing',person.sent);b.classList.toggle('wrong',person.sent&&!person.correct);
      b.style.opacity=person.sent?String(Math.max(0,1-age/1.4)):String(C.clamp((race.elapsed-person.entryAt)/.25,0,1));
      b.style.width=positions[1].width+'px';b.style.left=(person.sent?projection?.x:positions[1].x)+'px';
      // The word moves with its holder; the next person's own card fades in.
      b.style.top=Math.max(py+promptHeight/2+b.offsetHeight/2+gap,Math.min(projection?.y||ay,bottomLimit-b.offsetHeight/2))+'px';
      b.querySelector('small').textContent=person.sent?(person.correct?'✓ SORTED':'↗ CORRECTION'):'← SWIPE →';
    });
  }
  $('decision-fill').style.width=(t.completed?0:pedestrian?C.crosswalkTimeLeft(race,t)/t.sortDuration*100:C.clamp((row.at-race.distance)/(repair?82:70)*100,0,100))+'%';
  if(repair)drawConnection();
}
function result(){
  clearAcceleration();
  settleLearning();const finished=isFinishEligible(race),broken=race.failureReason==='breakdown'||race.damage>=C.DAMAGE_LIMIT||!!race.breakdown,stars=C.stars(race),accuracy=Math.round(100*race.correct/Math.max(1,race.tasks.length)),position=finished?C.raceOrder(race).findIndex(r=>r.id==='player')+1:null;
  if(finished&&!race.reviewLap){const key=race.unit.id+':'+race.difficulty,p=(saved.progress[key]||[0,0,0]).slice();p[race.arenaIndex]=Math.max(p[race.arenaIndex],stars);saved.progress[key]=p;latestUnlock=Math.max(latestUnlock,finishUnitArena(saved,race.unit.id,race.arenaIndex));recordArenaWin(saved,race,position);persist();}
  const ultiOutcome=ultiWinOutcome(saved,race,position,stars),ultiReward=ultiOutcome.status==='awarded'&&!ultiOutcome.duplicate?ultiOutcome.receipt:null;if(ultiReward)persist();
  const ultiMissed=ultiOutcome.status==='stars'?`Ulti points need ${ULTI_MIN_STARS} stars: answer 3 in 4 signs right first time to earn ${ultiPointsFor(race.difficulty,race.arenaIndex)}.`:ultiOutcome.status==='cap'?`Today's ${ULTI_DAILY_CAP} Ulti points are already earned on this device. Wins count again tomorrow.`:'';
  lastResult={finished,stars};sound.tone(finished?'finish':broken?'breakdown':'wrong');$('road-learning').hidden=true;$('controls').hidden=true;$('warning').hidden=true;$('pause').hidden=true;
  const review=race.review.filter(i=>!i.recovered),mastery=masteryStats(saved,race.unit.id),next=finished&&position===1&&!race.reviewLap&&race.arenaIndex<2&&arenaUnlocked(saved,race.unit.id,race.difficulty,race.arenaIndex+1);
  showModal(`${host(finished?(position===1&&!race.reviewLap?'cheer':'smile'):'think')}<span class="modal-kicker">${race.reviewLap?(finished?'REVIEW LOOP COMPLETE':'REVIEW LOOP · TRY AGAIN'):finished?'ENGLISH GRAND PRIX':broken?'THREE HITS · RACE ENDED':'THE ROAD IS WORTH ANOTHER TRY'}</span><div class="finish-emblem" aria-hidden="true"><span>${finished?'FINISH':broken?'BREAKDOWN':'KEEP GOING'}</span><strong>${finished?(race.reviewLap?'✓':String(position).padStart(2,'0')):broken?'!':'↗'}</strong><small>${race.reviewLap?'REVIEW':finished?'RACE POSITION':broken?'BACK TO THE GARAGE':'NEXT TIME'}</small></div><h2 id="modal-title">${finished?(race.reviewLap?'A stronger next drive.':position===1?'You took the lead.':'What a drive!'):broken?'Car broken down.':race.failureReason==='time'?'Time ran out.':'Race not finished.'}</h2><p>${escape(race.arena.name)} · ${C.DIFFICULTIES[saved.difficulty].label}${finished&&!race.reviewLap?' · POSITION '+position+'/3':''}</p>${!finished?`<div class="result-dnf" role="status"><strong>DNF</strong><span>DID NOT FINISH</span></div>`:''}<div class="result-stars" aria-label="${stars} out of 3 stars">${Array.from({length:3},(_,i)=>`<span class="${i<stars?'':'empty'}">★</span>`).join('')}</div><div class="result-stats"><div class="result-stat"><strong>${Math.ceil(race.time)}s</strong><small>TIME LEFT</small></div><div class="result-stat"><strong>${accuracy}%</strong><small>FIRST TRY</small></div><div class="result-stat"><strong>${race.collisions}</strong><small>BUMPS</small></div></div>${finished&&!race.reviewLap?`<div class="podium">${C.raceOrder(race).map((r,i)=>`<span class="${r.id==='player'?'you':''}"><b>${i+1}</b> ${escape(r.name)}</span>`).join('')}</div>`:''}<p>${race.reviewLap?'Review strengthens your English. Win the full race to unlock the next arena.':finished?'Stars reward your English and clean driving. First place unlocks the next arena.':broken?'Three separate hits ended this race. Your next drive starts with a fully repaired car. Read the gaps and save Nitro for a clear stretch.':'Try Relaxed for more thinking time, or take a short review lap before the next race.'}</p>${ultiReward?`<div class="ulti-win" style="--team:${teamById(race.teamId).accent}"><span>FIRST PLACE · ${teamById(race.teamId).name.toUpperCase()}</span><strong>+${ultiReward.points} <small>ULTI POINTS</small></strong><p>${ultiOutcome.capped?`Daily limit reached (${ULTI_DAILY_CAP}) · `:''}Valid for 3 days · expires ${escape(new Date(ultiReward.expiresAt).toLocaleString())}</p></div>`:ultiMissed?`<div class="ulti-win ulti-missed" style="--team:${teamById(race.teamId)?.accent||'#a5caff'}"><span>FIRST PLACE · NO ULTI POINTS</span><p>${escape(ultiMissed)}</p></div>`:''}<div class="achievement">FUEL ${race.fuel}/100 · BEST STREAK ${race.bestStreak} · CHARGES LOADED ${race.nitroUses}</div>${latestUnlock?`<div class="achievement">MASTERY REWARD · ${['','EXPLORER BADGE','SCHOLAR BADGE','MASTER BADGE + AURORA TRAIL'][latestUnlock]}</div>`:''}<p class="save-note">Unit mastery: ${mastery.unique} distinct items · ${mastery.accuracy}% first try · ${mastery.arenas}/3 arenas</p>${next?`<div class="achievement">UNLOCKED · ${escape(C.ARENAS[race.arenaIndex+1].name)}</div>`:finished&&!race.reviewLap&&race.arenaIndex<2&&position!==1?`<p class="arena-goal">${arenaUnlocked(saved,race.unit.id,race.difficulty,race.arenaIndex+1)?'Finish first to advance from this race.':`Finish first in ${escape(race.arena.name)} to unlock ${escape(C.ARENAS[race.arenaIndex+1].name)}.`}</p>`:''}${review.length?`<details><summary>Review ${review.length} missed item${review.length>1?'s':''}</summary>${review.map(item=>`<div class="review-item"><span>${escape(item.prompt)}</span><strong>${escape(item.answer)}</strong>${item.tr?`<small>${escape(item.tr)}</small>`:''}</div>`).join('')}</details><button id="review-lap" class="review-lap-button">SHORT REVIEW LAP · UP TO 6 ITEMS ↗</button>`:race.review.length?'<div class="achievement">MISSED ITEMS RECOVERED ON THE ROAD</div>':''}<div class="modal-actions"><button id="replay" class="${next?'secondary':'primary'}">DRIVE AGAIN</button>${next?'<button id="next-arena" class="primary">NEXT ARENA ↗</button>':''}</div><button class="text-button" id="result-home">Return to garage</button><p class="save-note">${storageAvailable?'Wins, stars, fuel and mastery are saved in this browser.':'This browser is blocking saves. Keep this tab open to retain your progress.'}</p>`);
  $('modal').classList.add('finish-modal');$('modal').classList.toggle('dnf-result',!finished);if(finished)celebrate();
  $('replay').onclick=()=>begin();$('result-home').onclick=goHome;if($('review-lap'))$('review-lap').onclick=()=>begin(review);if($('next-arena'))$('next-arena').onclick=()=>{if(!next||race.status!=='finished'||C.raceOrder(race)[0]?.id!=='player')return;const target=race.arenaIndex+1;if(!arenaUnlocked(saved,race.unit.id,race.difficulty,target))return;selectedArena=target;begin();};
}
function journal(){showModal(`<span class="modal-kicker">RACE JOURNAL · GRADE ${saved.grade}</span><h2 id="modal-title">Every road counts.</h2><p>${C.DIFFICULTIES[saved.difficulty].label} difficulty · three arenas per unit</p>${BANK.find(g=>g.grade===saved.grade).units.map(u=>{let p=saved.progress[u.id+':'+saved.difficulty]||[0,0,0],n=p.reduce((a,b)=>a+b,0);return`<div class="journal-unit"><span>${escape(u.title)}</span><span>${n} / 9 ★</span></div>`;}).join('')}<p class="save-note">Progress is kept separately for each unit and difficulty in this browser.</p><button id="journal-ulti" class="review-lap-button">TEAM ULTI POINTS ↗</button><button id="journal-done" class="primary">BACK TO GARAGE</button>`);$('journal-done').onclick=closeModal;$('journal-ulti').onclick=ultiWallet;}
let ultiRefreshAt=-Infinity;
function updateUI(now){
  if(now-ultiRefreshAt>1000){ultiRefreshAt=now;refreshUltiUI();}
  const context=raceHudContext(race,{modalOpen:!$('modal-backdrop').hidden}),reading=context.question;
  if(document.body.classList.contains('reading-zone')!==reading)invalidateLayout();
  document.body.classList.toggle('reading-zone',reading);document.body.dataset.hudPhase=context.phase;
  const cruising=C.focusCruise(race),returning=cruising&&race.focusAuto?.returning!=null,quickReturn=C.canShortenFocus(race);document.body.classList.toggle('focus-cruise',cruising);document.body.classList.toggle('repair-cruise',C.repairCruise(race));
  document.body.style.setProperty('--focus-amount',cruising?Math.max(0,Math.min(1,race.focusAmount||0)):0);
  document.body.dataset.focusPhase=returning?'return':cruising?'cruise':'off';
  $('throttle').disabled=false;$('throttle').setAttribute('aria-label',cruising?(quickReturn?'Hold to return to normal pace sooner.':drivingHeld()?'Acceleration held. Quick return begins after your choice is ready.':'Autopilot holds your entry speed. After choosing, hold to return to normal pace sooner.'):'Hold to accelerate');
  document.body.classList.toggle('accelerating',!!race?.accelerating&&race.speedFactor>.05);
  if(!race){updateAnnouncements(now,context);return;}
  $('controls').hidden=touchControls||!['driving','task','resolving'].includes(race.status);
  settleLearning();
  document.body.classList.toggle('nitro-active',!!race.nitroActive&&['driving','resolving'].includes(race.status));
  const order=C.raceOrder(race),place=order.findIndex(r=>r.id==='player')+1;
  const dnf=C.raceFailed(race);setText('race-place',dnf?'DNF':race.reviewLap?'REVIEW':place+' / 3');setText('place-label',dnf?'STATUS':race.reviewLap?'LAP':'POSITION');
  if(lastPlace!==null&&place<lastPlace&&race.status==='driving'){
    toast(place===1?'Taking the lead':'Clean overtake',false,()=>race&&C.raceOrder(race).findIndex(r=>r.id==='player')+1===place);
    if(context.announcementsAllowed)sound.tone('overtake');
  }
  lastPlace=place;
  const condition=C.carCondition(race),conditionMeter=$('car-condition');
  conditionMeter.dataset.damage=String(condition.damage);conditionMeter.setAttribute('aria-label',condition.broken?'Car condition: broken down':`Car condition: ${condition.remaining} ${condition.remaining===1?'hit':'hits'} remaining${condition.critical?'; critical':''}`);
  [...conditionMeter.children].forEach((pip,i)=>pip.classList.toggle('intact',i<condition.remaining));
  document.body.classList.toggle('car-critical',condition.critical);document.body.classList.toggle('car-breaking',race.status==='breakdown');
  const impactNotice=$('condition-notice');impactNotice.hidden=!race.lastImpact||race.elapsed-race.lastImpact.at>2.4||!['driving','breakdown'].includes(race.status)||C.learningPaceProtected(race);impactNotice.dataset.damage=String(condition.damage);
  if(!impactNotice.hidden)setText('condition-notice',condition.broken?'CAR BROKEN DOWN':condition.critical?'CRITICAL · ONE HIT LEFT':'DAMAGED · TWO HITS LEFT');
  $('pause').hidden=['breakdown','finished','failed'].includes(race.status);
  setText('fuel-value',race.fuel);$('fuel-fill').style.width=race.fuel+'%';setText('streak-count',race.streak);
  $('fuel-value').parentElement.setAttribute('aria-label','Fuel '+race.fuel+' out of 100');
  $('streak-count').parentElement.setAttribute('aria-label','English streak '+race.streak);
  [...$('streak-pips').children].forEach((p,i)=>p.classList.toggle('lit',i<(race.streak?((race.streak-1)%3)+1:0)));
  const nitroReady=C.canEngageNitro(race),stackReady=C.canNitro(race),level=race.nitro>0?race.nitroLevel||1:0;
  $('nitro').disabled=!nitroReady;$('nitro-stack').disabled=!stackReady;
  $('nitro-stack').setAttribute('aria-label',level===3?'Maximum charge level reached':'Add Nitro charge: 30 fuel');setText('stack-label',level===3?'MAX':'30');
  $('nitro').classList.toggle('ready',nitroReady);$('nitro').classList.toggle('saved',level>0&&!race.nitroActive);document.body.classList.toggle('nitro-ready',nitroReady);
  setText('nitro-title',level&&!race.nitroActive?'SAVED':level===3?'MAX POWER':level===2?'DOUBLE':'NITRO');
  setText('nitro-label',level?race.nitro.toFixed(1)+'s'+(race.nitroActive?'':' · HOLD'):race.fuel>=30?'HOLD · 30':race.fuel+' / 30');
  [...$('nitro-slots').children].forEach((pip,i)=>pip.classList.toggle('lit',i<level));
  $('nitro-ring-fill').style.strokeDashoffset=String(100*(1-(level?race.nitro/(C.NITRO_DURATION*level):Math.min(1,race.fuel/30))));
  $('nitro').style.setProperty('--charge',level?race.nitro/(C.NITRO_DURATION*level):Math.min(1,race.fuel/30));$('nitro').setAttribute('aria-pressed',String(!!race.nitroHeld));
  $('nitro').setAttribute('aria-label',level?`Hold to use saved level ${level} Nitro: ${race.nitro.toFixed(1)} seconds remaining; release to save`:'Hold to load and use Nitro: 30 fuel');
  const touchNitro=$('touch-nitro');touchNitro.hidden=!touchControls||!['driving','task','resolving'].includes(race.status);
  setText('touch-nitro-state',race.nitroActive?'BOOST ×'+level:level?'SAVED ×'+level:nitroReady?'NITRO':'FUEL');
  setText('touch-fuel',race.fuel);
  touchNitro.classList.toggle('boosting',!!race.nitroActive);touchNitro.classList.toggle('ready',nitroReady);
  $('touch-nitro-fill').style.width=Math.min(100,100*(level?race.nitro/(C.NITRO_DURATION*level):race.fuel/30))+'%';
  [...$('touch-nitro-levels').children].forEach((pip,i)=>pip.classList.toggle('lit',i<level));
  touchNitro.setAttribute('aria-label',`Nitro ${race.nitroActive?'boosting':level?'saved':'ready at 30 fuel'}; level ${level} of 3; fuel ${race.fuel} out of 100${level?'; '+race.nitro.toFixed(1)+' seconds saved':''}`);
  const boostLevel=race.nitroActive?level:0;
  if(boostLevel&&boostLevel!==previousBoostLevel){sound.tone('nitro'+boostLevel);haptic('go');}previousBoostLevel=boostLevel;
  const projections=scene.rivalProjection(),labels=visibleRivalLabels(projections.map(p=>({...p,distance:(race.rivals.find(r=>r.id===p.id)?.at??0)-race.distance})),{width:scene.viewport?.width||innerWidth,top:layoutCache.hudBottom+(context.approaching||context.route?60:0),bottom:layoutCache.controlsTop});
  for(const tag of $('rival-tags').children){
    const r=race.rivals.find(r=>r.id===+tag.dataset.rival),p=projections.find(p=>p.id===r.id);
    tag.hidden=!labels.includes(r.id)||reading||['finished','failed'].includes(race.status);
    tag.style.left=(p?.x||0)+'px';tag.style.top=(p?.y||0)+'px';tag.classList.toggle('boosting',!!r.nitroActive);
    tag.querySelector('small').textContent=(r.nitroActive?'NITRO · ':'')+(r.at>=race.distance?'+':'')+Math.round(r.at-race.distance)+'m';
  }
  const t=Math.max(0,Math.ceil(race.time)),progress=Math.min(100,race.distance/race.arena.length*100);
  setText('time',Math.floor(t/60)+':'+String(t%60).padStart(2,'0'));$('time').parentElement.classList.toggle('urgent',t<20);
  $('progress-fill').style.width=progress+'%';$('progress-fill').parentElement.setAttribute('aria-valuenow',String(Math.round(progress)));
  setText('road-fairness',C.learningPaceProtected(race)?'TASK PACE PROTECTED · RIVALS MATCH YOU':'');
  const dashboardSpeed=displaySpeed(race,C.REGULAR_MAX_SPEED,C.MAX_SPEED);setText('speed',dashboardSpeed);$('throttle').style.setProperty('--speed-fill',dashboardSpeed/200);
  document.body.dataset.nitroLevel=String(race.nitroActive&&['driving','resolving'].includes(race.status)?race.nitroLevel||1:0);$('throttle').setAttribute('aria-pressed',String(!!race.accelerating||cruising&&drivingHeld()));
  $('speedlines').classList.toggle('boost',race.boost>0&&race.status==='driving');$('speedlines').classList.toggle('focus',race.status==='task');$('speedlines').classList.toggle('accelerating',race.accelerating&&race.speedFactor>.05);
  $('left').setAttribute('aria-label',race.status==='task'&&race.task.kind==='pedestrian'?'Send visitor left':'Steer left');$('right').setAttribute('aria-label',race.status==='task'&&race.task.kind==='pedestrian'?'Send visitor right':'Steer right');
  const sorting=race.status==='task'&&race.task?.kind==='pedestrian';
  $('left').disabled=$('right').disabled=sorting?race.task.pedWait>0||!C.pedestrianReady(race):C.steeringLocked(race)||!!C.exitAssist(race)||!!race.route;
  setText('drive-hint',returning?'RESUMING':quickReturn?(window.matchMedia('(pointer: coarse)').matches?'HOLD TO RESUME':'HOLD ↑ TO RESUME'):cruising?(C.steeringLocked(race)?'AUTO CRUISE':'FOCUS · STEER'):race.speedFactor<.05&&(race.yielding||race.followingTraffic)?(race.yielding?'WAITING':'CHANGE LANE'):C.exitAssist(race)?'ACCELERATE':race.route?(race.route.shortcut?'SHORTCUT':'DETOUR'):race.nitroActive?'NITRO BOOST':race.accelerating?'ACCELERATING':window.matchMedia('(pointer: coarse)').matches?'HOLD TO DRIVE':'HOLD ↑');
  if(race.notice){
    const n=race.notice;race.notice=null;
    if(n.type==='nitro')toast(n.text,false,()=>race?.nitro>0);
    else if(n.type==='collision'||n.type==='breakdown'){$('hit-flash').classList.remove('active');void $('hit-flash').offsetWidth;$('hit-flash').classList.add('active');sound.tone(n.type==='breakdown'?'breakdown':'collision');haptic('collision');}
    else if(n.type==='correct'||n.type==='sorted'){sound.tone('correct');haptic('correct');toast(n.text);}
    else if(n.type==='wrong'){sound.tone('wrong');toast(n.text,true);}
  }
  if(race.status==='countdown'){
    $('countdown').hidden=false;const n=Math.max(1,Math.ceil(race.countdown));
    if(n!==launchNumber){launchNumber=n;setText('launch-number',n);$('countdown').dataset.step=n;[...$('countdown').querySelectorAll('.launch-lights i')].forEach((lamp,i)=>lamp.classList.toggle('lit',i<4-n));sound.tone('tick');haptic('click');}
  }
  // The launch overlay belongs to the countdown only, whatever state follows it.
  if(race.status!=='countdown'&&!$('countdown').hidden)$('countdown').hidden=true;
  if(race.status!==lastStatus){
    const was=lastStatus;lastStatus=race.status;
    if(race.status==='driving'){$('countdown').hidden=true;$('controls').hidden=touchControls;$('road-learning').hidden=true;if(was==='countdown'){sound.tone('go');haptic('go');toast('GO · FIND YOUR LINE');}}
    if(race.status==='task'){$('controls').hidden=touchControls;$('warning').hidden=true;}
    if(['finished','failed'].includes(race.status)&&!lastResult)result();
  }
  const route=context.route,routeActive=!!route&&!context.approaching&&!reading&&!['finished','failed'].includes(race.status);
  $('route-status').hidden=!routeActive;
  if(routeActive){const merging=!race.route;$('route-status').classList.toggle('detour',!route.shortcut);setText('route-label',merging?'MERGING':route.shortcut?'SHORTCUT · −18m':'DETOUR · +32m');setText('route-remaining',Math.max(0,Math.ceil((merging?route.exitEndAt:route.end)-race.distance))+'m');$('route-status').style.setProperty('--route-progress',C.clamp((race.distance-route.start)/(route.exitEndAt-route.start),0,1));}
  $('warning').hidden=!context.approaching;
  if(context.approaching){
    const kind=context.next.kind;$('warning-title').textContent={light:'Traffic light ahead',repair:'Road repair ahead',junction:'Choose your route',pedestrian:'Crosswalk ahead'}[kind];
    $('warning-icon').textContent={light:'●',repair:'▰',junction:'⑂',pedestrian:'↔'}[kind];setText('warning-distance',Math.ceil(context.ahead)+'m');
  }
  measureLayout();roadLearning();updateAnnouncements(now,context);
}
function requestNitro(){sound.unlock();if(C.activateNitro(race)){haptic('go');return true;}return false;}
$('nitro').addEventListener('pointerdown',e=>{if(e.button>0||heldNitroId!==null)return;e.preventDefault();if(C.engageNitro(race)){sound.unlock();heldNitroId=e.pointerId;$('nitro').setPointerCapture(e.pointerId);applyAcceleration();}});
for(const event of ['pointerup','pointercancel','lostpointercapture'])$('nitro').addEventListener(event,e=>{if(heldNitroId!==e.pointerId)return;heldNitroId=null;applyAcceleration();if($('nitro').hasPointerCapture?.(e.pointerId))$('nitro').releasePointerCapture(e.pointerId);});
$('nitro').addEventListener('keydown',e=>{if(e.code==='Space'||e.key==='Enter'){if(!e.repeat&&C.engageNitro(race)){spaceHeld=true;sound.unlock();applyAcceleration();}e.preventDefault();e.stopPropagation();}});
$('nitro').addEventListener('keyup',e=>{if(e.code==='Space'||e.key==='Enter'){spaceHeld=false;applyAcceleration();e.preventDefault();e.stopPropagation();}});
$('nitro').addEventListener('blur',()=>{spaceHeld=false;applyAcceleration();});
$('nitro-stack').addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter')e.stopPropagation();});
function steer(delta){sound.unlock();if(race&&C.move(race,delta)){sound.tone('click');haptic('click');}}
document.querySelectorAll('[data-team]').forEach(b=>b.onclick=()=>{saved.teamId=b.dataset.team;sound.tone('click');refreshHome();});
$('ulti-button').onclick=ultiWallet;
$('lesson-picker').onclick=lessonChooser;
document.querySelectorAll('[data-diff]').forEach(b=>b.onclick=()=>{saved.difficulty=b.dataset.diff;selectedArena=0;refreshHome();});
$('settings').onclick=settings;
$('start').onclick=()=>{sound.unlock();if(saved.crosswalkTutorial)begin();else help(true);};$('help').onclick=()=>help();$('progress-button').onclick=journal;$('garage-button').onclick=garage;$('nitro').onclick=e=>{if(e.detail===0&&race&&race.nitro<=0)requestNitro();};$('nitro-stack').onclick=requestNitro;$('pause').onclick=pauseRace;$('brand-home').onclick=e=>{e.preventDefault();askExit();};for(const [id,direction]of [['left',-1],['right',1]]){$(id).onpointerdown=e=>{if(e.button>0)return;e.preventDefault();steer(direction);};$(id).onclick=e=>{if(e.detail===0)steer(direction);};}
$('sound').onclick=()=>{saved.sound=!saved.sound;sound.unlock();soundButton();persist();sound.tone('click');};
$('throttle').addEventListener('pointerdown',e=>{if(e.button>0||heldThrottleId!==null||!race||!['driving','task','resolving'].includes(race.status))return;e.preventDefault();heldThrottleId=e.pointerId;$('throttle').setPointerCapture(e.pointerId);sound.unlock();applyAcceleration();});
for(const event of ['pointerup','pointercancel','lostpointercapture'])$('throttle').addEventListener(event,e=>{if(heldThrottleId!==e.pointerId)return;heldThrottleId=null;applyAcceleration();if($('throttle').hasPointerCapture?.(e.pointerId))$('throttle').releasePointerCapture(e.pointerId);});
$('throttle').addEventListener('keydown',e=>{if(e.key==='Enter'){if(!e.repeat&&race&&['driving','task','resolving'].includes(race.status)){throttleKeyHeld=true;sound.unlock();applyAcceleration();}e.preventDefault();e.stopPropagation();}});
$('throttle').addEventListener('keyup',e=>{if(e.key==='Enter'){throttleKeyHeld=false;applyAcceleration();e.preventDefault();e.stopPropagation();}});
$('throttle').addEventListener('blur',()=>{throttleKeyHeld=false;applyAcceleration();});
let pointerStart=null;
$('world').addEventListener('pointerdown',e=>{
  if(e.button>0||pointerStart&&pointerStart.id!==e.pointerId)return;
  if(e.pointerType==='touch'||e.pointerType==='pen')setTouchControls(true);
  const touch=touchPreview||e.pointerType==='touch'||e.pointerType==='pen'||touchControls&&e.pointerType!=='mouse';
  const driving=race&&(['driving','task','resolving'].includes(race.status)||touch&&race.status==='countdown');
  if(driving){e.preventDefault();clearGameSelection();}
  if(!driving)return;
  const hold=touch||scene.isCarHit(e.clientX,e.clientY);
  pointerStart={x:e.clientX,y:e.clientY,id:e.pointerId,hold,touch,drive:touch?createTouchDrive(e.clientX,e.clientY):null,nitroAllowed:C.canEngageNitro(race)};$('world').setPointerCapture(e.pointerId);
  if(hold){heldCarId=e.pointerId;$('world').setPointerCapture(e.pointerId);sound.unlock();applyAcceleration();e.preventDefault();}
});
function applyRoadGesture(e){
  if(pointerStart?.id!==e.pointerId)return;
  if(pointerStart.touch){
    const action=touchDriveGesture(pointerStart.drive,e.clientX,e.clientY);e.preventDefault();
    if(action.steer)steer(action.steer);
    if(action.boostChanged&&!action.boost)heldRoadNitroId=null;
    if(action.boost&&(action.boostChanged||action.levelChanged)&&C.canEngageNitro(race)){
      if(C.engageNitro(race)){
        sound.unlock();heldRoadNitroId=e.pointerId;
        while((race.nitroLevel||0)<action.level&&C.canNitro(race))C.activateNitro(race);
      }
    }
    applyAcceleration();return;
  }
  const action=roadGesture(pointerStart,e.clientX,e.clientY);if(!action)return;
  e.preventDefault();heldCarId=null;pointerStart.hold=false;applyAcceleration();
  if(action.type==='steer')steer(action.direction);
  else if(action.type==='nitro'&&pointerStart.nitroAllowed&&C.engageNitro(race)){sound.unlock();heldRoadNitroId=e.pointerId;applyAcceleration();}
}
$('world').addEventListener('pointermove',applyRoadGesture);
$('world').addEventListener('pointerup',e=>{
  if(pointerStart?.id===e.pointerId&&pointerStart.touch){const action=touchDriveGesture(pointerStart.drive,e.clientX,e.clientY);if(action.steer)steer(action.steer);releaseRoadTouch(e.pointerId);return;}
  if(heldRoadNitroId===e.pointerId){heldRoadNitroId=null;applyAcceleration();}
  const wasHold=heldCarId===e.pointerId;
  if(wasHold){heldCarId=null;applyAcceleration();}
  if(pointerStart?.id===e.pointerId){applyRoadGesture(e);pointerStart=null;}
  if(heldRoadNitroId===e.pointerId){heldRoadNitroId=null;applyAcceleration();}
  if($('world').hasPointerCapture?.(e.pointerId))$('world').releasePointerCapture(e.pointerId);
});
function releaseRoadTouch(id){
  if(pointerStart?.id===id)pointerStart=null;
  if(heldRoadNitroId===id)heldRoadNitroId=null;
  if(heldCarId===id)heldCarId=null;
  applyAcceleration();if($('world').hasPointerCapture?.(id))$('world').releasePointerCapture(id);
}
$('world').addEventListener('pointercancel',e=>{if(heldRoadNitroId===e.pointerId){heldRoadNitroId=null;applyAcceleration();}if(heldCarId===e.pointerId){heldCarId=null;applyAcceleration();}if(pointerStart?.id===e.pointerId)pointerStart=null;});
$('world').addEventListener('lostpointercapture',e=>{if(heldRoadNitroId===e.pointerId){heldRoadNitroId=null;applyAcceleration();}if(heldCarId===e.pointerId){heldCarId=null;applyAcceleration();}if(pointerStart?.id===e.pointerId)pointerStart=null;});
document.addEventListener('keydown',e=>{
  if(['SELECT','INPUT'].includes(document.activeElement.tagName))return;
  if(!$('modal-backdrop').hidden){
    if(e.key==='Tab'){let focusable=[...$('modal').querySelectorAll('button:not(:disabled),select,summary,[tabindex="0"]')],first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&(document.activeElement===first||document.activeElement===$('modal'))){last?.focus();e.preventDefault();}else if(!e.shiftKey&&document.activeElement===last){first?.focus();e.preventDefault();}}
    if(e.key==='Escape'&&$('lesson-cancel')){$('lesson-cancel').click();return;}if(e.key==='Escape'&&$('settings-done')){$('settings-done').click();return;}if(e.key==='Escape'&&race?.status==='paused'){$('resume')?.click();if(!$('resume')&&$('help-done'))$('help-done').click();}return;
  }
  if(e.key==='ArrowUp'&&race&&['driving','task','resolving'].includes(race.status)){if(!e.repeat){upHeld=true;sound.unlock();applyAcceleration();}e.preventDefault();return;}
  if(e.key===' '&&race){if(!e.repeat&&C.engageNitro(race)){spaceHeld=true;sound.unlock();applyAcceleration();}e.preventDefault();return;}
  if(!e.repeat&&race&&['n','N'].includes(e.key)){requestNitro();e.preventDefault();return;}
  if(e.repeat)return;
  if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a'){steer(-1);e.preventDefault();}if(e.key==='ArrowRight'||e.key.toLowerCase()==='d'){steer(1);e.preventDefault();}
  if(e.key==='Escape'||e.key.toLowerCase()==='p')pauseRace();
  if(race?.status==='task'&&/^[1-3]$/.test(e.key)){if(race.task.kind==='repair')connectHit(race.task.order[Number(e.key)-1]);else if(race.task.kind==='pedestrian'){if(e.key!=='2')C.sortPerson(race,e.key==='1'?0:1);}else C.choose(race,Number(e.key)-1);e.preventDefault();}
  if(mode==='home'&&e.key==='Enter')$('start').click();
});
document.addEventListener('keyup',e=>{if(e.key===' '){spaceHeld=false;applyAcceleration();if(race)e.preventDefault();}if(e.key==='ArrowUp'){upHeld=false;applyAcceleration();if(race)e.preventDefault();}});
window.addEventListener('blur',()=>{clearAcceleration();pauseRace();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseRace();else refreshUltiUI();});
document.addEventListener('graphicslost',()=>{pauseRace();$('graphics-error').hidden=false;});
try{scene=new RallyScene($('world'));}catch(error){console.error(error);$('graphics-error').hidden=false;$('loading').hidden=true;}
refreshHome();soundButton();applyPreferences();
let previous=performance.now(),idleFrames=0;
function frame(now){let rawDt=(now-previous)/1000,dt=Math.min(rawDt,.06);previous=now;scene?.samplePerformance(rawDt,!!race&&['driving','task','resolving'].includes(race.status));applyAcceleration();if(race)C.tick(race,dt,scene?.currentLane??race.lane);
  // A full-screen panel over an idle or paused scene needs only an occasional
  // frame; this saves battery and keeps panel transitions smooth on phones.
  const idleBehindModal=!$('modal-backdrop').hidden&&(!race||['paused','finished','failed'].includes(race.status));idleFrames=idleBehindModal?idleFrames+1:0;
  if(idleFrames%6===0)scene?.update(dt,race,mode);updateUI(now);sound.update(race,scene?.spectators?.proximity||0);if(now>toastEnd)$('toast').classList.remove('visible');if(roadFeedbackEnd&&now>roadFeedbackEnd){setText('road-feedback','');roadFeedbackEnd=0;}requestAnimationFrame(frame);}
requestAnimationFrame(frame);setTimeout(()=>$('loading').hidden=true,500);
window.WORDRAMP=window.WORDRIFT=window.WORDSHIFT={version:'0.24.0',ulti:Object.freeze({snapshot:()=>ultiSnapshot(saved),export:()=>exportUlti(saved)}),get race(){return race;},get settings(){return saved;},get scene(){return scene;}};
