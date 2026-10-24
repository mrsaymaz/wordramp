import {createLeague,leagueApi,LEAGUE_TEAMS,strengthLabel,hoursLabel} from './league.js';
import {TEAMS,teamById,newIdentity,ultiWinStatus,ULTI_MIN_STARS,ULTI_MIN_RELAXED_ACCURACY,isFinishEligible} from './teams-ulti.js';
import {Sound} from './audio.js';
import {normalisePreferences,roadGesture,createTouchDrive,touchDriveGesture,TUTORIAL_STEPS,PRACTICE_GOALS,createPractice,practiceDone,practicePress,practiceMove,practiceRelease,practiceKey,practiceTick,practiceDemo,coachPrompt,coachProgress,touchContentBottom,displaySpeed,raceHudContext,GRADE_LEVELS,lessonSummary} from './presentation.js';
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
// Driving School and the first-race coach. Players from before the tutorial
// (who saw the welcome guide) skip both.
if(!saved.tutorial||typeof saved.tutorial!=='object'){const known=!!saved.crosswalkTutorial;saved.tutorial={done:known,drive:known,steer:known,nitro:known};}
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
function haptic(kind){if(!preferences().haptics||!window.matchMedia('(pointer: coarse)').matches)return;try{navigator.vibrate?.({click:8,correct:[12,30,18],wrong:[30,40,30],collision:45,go:[15,25,25],finish:[20,50,30,50,50]}[kind]||8);}catch{}}
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
  refreshLeagueButton();
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
// English League: wins add Ulti points to the student's (grade, team) pool.
// Ulti points live only there; config.js ultiApi '' turns all of it off.
const league=createLeague({api:leagueApi(window.WORDRAMP_CONFIG)});
let leagueStartAt=-Infinity,leagueStarting=false,leagueTaskIndex=-1;
const leagueGrade=r=>r?.unit?.grade??(Number(String(r?.unit?.id||saved.unit).match(/^g(\d+)/)?.[1])||saved.grade);
function leagueStart(r){
  if(!league.enabled||!r||r.reviewLap||r.leagueTicket||leagueStarting||!teamById(r.teamId)||['finished','failed'].includes(r.status))return;
  leagueStarting=true;leagueStartAt=performance.now();
  league.start({runId:r.runId,grade:leagueGrade(r),team:r.teamId,arena:r.arenaIndex,pace:r.difficulty==='challenge'?'challenge':'relaxed',unit:r.unit.id}).then(ticket=>{if(ticket)r.leagueTicket=ticket;}).finally(()=>{leagueStarting=false;});
}
function leagueMessage(result,grade,team){
  const name=team?.name||'your team';
  if(result.state==='counted'){
    if(result.duplicate)return {text:'This win was already counted in the English League.',good:true};
    if(result.points>0)return {text:`+${result.points} Ulti for Grade ${grade} ${name}!${result.reason==='team-limit'?` ${name} reached today's team limit, so this win counted ${result.points} of ${result.requested}.`:''}`,good:true};
    if(result.reason==='device-limit')return {text:"Today's Ulti wins on this phone are used. Tomorrow they count again."};
    if(result.reason==='team-limit')return {text:`${name} reached today's Ulti limit for Grade ${grade}. Tomorrow wins count again.`};
    if(result.reason==='off')return {text:'Ulti points are switched off in the English League right now.'};
    return {text:'This win added no Ulti points.'};
  }
  if(result.state==='queued')return {text:"You're offline. This win will be sent to the English League when you're online."};
  if(result.state==='refused')return {text:result.reason==='too-fast'?'That win was faster than the English League allows, so it did not count.':result.reason==='expired'?'This race ticket expired before it could be sent.':'The English League did not accept this win.'};
  if(result.state==='no-ticket')return {text:'This race could not reach the English League when it started, so it cannot count.'};
  return null;
}
function renderLeagueResult(result,grade,team){const el=$('league-result');const m=leagueMessage(result,grade,team);if(!el||!m)return;el.textContent=m.text;el.classList.toggle('good',!!m.good);el.classList.remove('pending');}
function refreshLeagueButton(){if(!league.enabled){$('league-button').hidden=true;return;}$('league-button').hidden=false;setText('league-label',`LEAGUE · GRADE ${saved.grade}`);}
function leagueHelp(snap){
  if(!snap.known)return '<p class="save-note">The English League will show its Ulti rules here once it can be reached.</p>';
  if(!snap.game)return '<p class="league-help">Ulti points are not switched on for this game yet.</p>';
  const list=row=>C.ARENAS.map((a,i)=>row?.[i]!=null?`${escape(a.name)} +${row[i]}`:'').filter(Boolean).join(' · ');
  return `<p class="league-help">${list(snap.game.points?.relaxed)}.</p><p class="league-help">On Challenge pace: ${list(snap.game.points?.challenge)}.</p><p class="save-note">${snap.game.deviceDailyWins?`Your first ${snap.game.deviceDailyWins} wins each day count on this phone. `:''}Points last ${hoursLabel(snap.hours)}. Your win also needs ${Math.round(ULTI_MIN_RELAXED_ACCURACY*100)}% of tasks right first time on Relaxed, or ${ULTI_MIN_STARS} stars on Challenge.</p>`;
}
function leagueBars(snap){
  return `<div class="league-teams">${snap.teams.map(t=>{const team=teamById(t.id),share=Math.min(1,t.points/Math.max(1,snap.capacity));return `<div class="league-team ${saved.teamId===t.id?'selected':''}" style="--team:${team.accent};--share:${(share*100).toFixed(1)}%"><span class="team-letter">${team.letter}</span><span class="league-name">${team.name}${saved.teamId===t.id?' · YOU':''}</span><span class="league-bar" aria-hidden="true"><i></i></span><strong>${Math.round(t.points)} / ${snap.capacity}</strong><small>${strengthLabel(t.strength)}</small></div>`;}).join('')}</div>`;
}
function leaguePanel(){
  if(!league.enabled)return;
  const grade=saved.grade,draw=(snap,status)=>{if(!$('league-done'))return;$('league-body').innerHTML=`${leagueBars(snap)}${leagueHelp(snap)}<p class="save-note">${status}</p>`;};
  showModal(`${host('cheer')}<span class="modal-kicker">ENGLISH LEAGUE · BATTLE ARENA</span><h2 id="modal-title">Ulti · Grade ${grade}</h2><p>Arena wins add Ulti points to your grade's team pool in Mr. Saymaz's English League. Stronger teams hit harder in the Battle Arena.</p><div id="league-body"></div><button id="league-done" class="primary">BACK TO GARAGE</button>`);
  $('league-done').onclick=closeModal;
  const cached=league.snapshot(grade);draw(cached,cached.updatedAt?'Updating…':'Connecting to the English League…');
  league.refresh(grade).then(snap=>draw(snap,snap.online?'Live from the English League.':snap.updatedAt?`Offline · last updated ${new Date(snap.updatedAt).toLocaleString()}.`:'The English League cannot be reached right now.'));
}
// Team cards show the League's live points for this grade (last known values).
function refreshUltiUI(){
  const cards=document.querySelectorAll('.team-points');
  if(!league.enabled){cards.forEach(el=>{el.hidden=true;});return;}
  const snap=league.snapshot(saved.grade);
  cards.forEach(el=>{el.hidden=!snap.updatedAt;});
  document.querySelectorAll('[data-ulti-total]').forEach(el=>{const text=String(Math.round(snap.teams.find(t=>t.id===el.dataset.ultiTotal)?.points||0));if(el.textContent!==text)el.textContent=text;});
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
function showModal(html){pendingToast=null;toastEnd=0;$('toast').classList.remove('visible');clearAcceleration();if(connection.pointerId!==null)endStroke({pointerId:connection.pointerId});$('modal').classList.remove('finish-modal','dnf-result','tutorial-modal');$('modal').classList.remove('lessons-modal');modalFocus=document.activeElement;$('modal').innerHTML=html;$('modal-backdrop').hidden=false;setTimeout(()=>$('modal').focus(),0);}
function closeModal(){$('modal-backdrop').hidden=true;$('modal').classList.remove('lessons-modal');$('modal').innerHTML='';modalFocus?.focus?.();}
function rules(startAfter=false){
  const driveHelp=(touchControls?'Hold anywhere on the road to accelerate. Keep your thumb down and swipe left or right to change lanes. You can swipe again without lifting.':'Swipe the road, tap the arrows, or use ← → / A D. Hold your car or the speed button to accelerate. On a computer, hold ↑.')+' Release acceleration and Nitro to coast and brake for traffic.';
  const boostHelp=touchControls?'Slide your driving thumb forward to use Nitro, then hold it there. Slide down to save the remaining charge and keep regular acceleration. Slide farther forward for a second or third charge, up to three levels. Each new charge costs 30 fuel; resuming a saved charge is free. Lifting your thumb releases acceleration and Nitro. Fuel and Nitro status sit beside your race position.':'Hold NITRO or Space to boost; release to save the remaining charge. An upward swipe also boosts while your finger stays down. A new charge costs 30 fuel. Tap +30 or press N to stack up to three levels. Holding acceleration also uses a loaded charge. Regular acceleration displays up to 90 km/h; maximum Nitro displays 200 km/h.';
  const returnHelp=touchControls?'After choosing, keep holding the road to return to normal pace sooner.':'After choosing, hold your car, the speed button or ↑ to return to normal pace sooner.';
  if(race&&!['finished','failed','paused'].includes(race.status))autoResume=C.pause(race);
  showModal(`${host('point')}<span class="modal-kicker">WELCOME TO WORDRAMP</span><h2 id="modal-title">Your team.<br>Your open road.</h2><div class="help-step"><span class="step-num">1</span><div><strong>Find your line.</strong><p>${driveHelp}</p></div></div><div class="help-step"><span class="step-num">2</span><div><strong>Read the road.</strong><p>Steer towards the correct full-text answer, or tap its sign. Rivals match your progress during every English task, even if you hold acceleration. Correct exits protect your speed recovery too. Lights and forks enter slow motion close to the signs. Steering stays active. ${returnHelp} Already holding? Keep holding. The answer locks at the road line.</p></div></div><div class="help-task-grid"><div><b>GREEN LIGHT</b><span>Read in slow motion, then steer into the matching answer to turn the light green.</span></div><div><b>BRIDGE OUT</b><span>Release the car: autopilot holds your entry speed and lane while the world slows into a green-gold focus effect. Connect the three blocks in sentence order: each one drops its word slab into the gap with a note, and a wrong block bounces back out. Then drive over your sentence as each word lights up, with a small hop at the end. Extra thinking time safely freezes the approach before the gap. A held Up key or driving touch resumes automatically after autopilot.</span></div><div><b>SHORTCUT</b><span>Choose a sign in close-range slow motion. The right lane leads into a visible shortcut and a ride: the Sky Coaster in Sunlit, the Sea Jump on the Coastal Overpass and the Cliff Plunge in Stormcrest.</span></div><div><b>CROSSWALK</b><span>Sort each visitor’s word while autopilot approaches in slow motion. Clear the crossing before you arrive; all cars wait if anyone is still on the road.</span></div></div><div class="help-step"><span class="step-num">3</span><div><strong>Earn your next boost.</strong><p>First-try English answers earn fuel. Every third adds a streak bonus. ${boostHelp}</p></div></div><div class="help-step"><span class="step-num">4</span><div><strong>Look after your car.</strong><p>Three small marks below the clock show your remaining hits. Each driving bump damages the car; the third ends the race. Change lanes into clear gaps. Every new race starts fully repaired.</p></div></div><p class="save-note">Choose Slytherin, Hufflepuff, Gryffindor or Ravenclaw in the garage. ${league.enabled?`A first-place finish with ${Math.round(ULTI_MIN_RELAXED_ACCURACY*100)}% of tasks right first time on Relaxed, or ${ULTI_MIN_STARS}+ stars on Challenge, adds Ulti points to your team in Mr. Saymaz's English League. Tap LEAGUE in the garage to see the team pools. `:''}Plan about five minutes per arena, with 12–16 checkpoints and longer open-road stretches. Holding acceleration and using Nitro can shorten your run. Your stars reward accurate English and clean driving. Your racing position is separate. All cars wait for pedestrians to reach the sidewalk.</p><details><summary>Race rules & keyboard shortcuts</summary><p>Finish first to unlock the next arena for this unit and difficulty. Stars still reward your English at every finishing position. Wrong answers cost 1.5 seconds and never damage your car. Each separate driving impact costs ${C.DIFFICULTIES[saved.difficulty].penalty} seconds and one condition mark. Three hits end the race. A cracked windscreen warns after the first hit; a loose bonnet and smoke mean one hit left. Rivals can close the gap while you recover, using their normal driving. Autopilot protects your car and reading time. Relaxed gives 3 seconds of impact protection; Challenge gives 2. Each retry starts fully repaired. Correct shortcuts add 3 seconds; wrong routes take a recoverable detour. Rivals share your regular top speed and earn fuel for boosts. Nitro waits through tasks and crossings. Use 1 / 2 / 3 for the road signs or repair blocks. Use ← / → at crosswalks. Escape / P pauses. Missed words return later, with an optional review lap after the finish.</p></details><button id="help-done" class="primary">${startAfter?'LET’S DRIVE':'GOT IT'} ↗</button>`);
  $('help-done').onclick=()=>{closeModal();if(startAfter){saved.crosswalkTutorial=true;saved.tutorial.done=true;persist();begin();}else if(autoResume){C.resume(race);autoResume=false;}};
}
// Driving School: hold to drive, swipe to steer, slide up for Nitro (each with
// a practice pad), the four English tasks, then fuel, bumps and winning.
let practice=null,practiceAt=0;
const keyCap=k=>`<kbd>${k}</kbd>`;
const TUTORIAL_TASKS=[
  {kind:'light',name:'GREEN LIGHT',see:'Three answer signs across the road.',touch:'Steer into the lane with the right answer, or tap its sign.',keys:`Steer with ${keyCap('←')} ${keyCap('→')} or press ${keyCap('1')} ${keyCap('2')} ${keyCap('3')}.`},
  {kind:'fork',name:'SHORTCUT',see:'The road splits at answer signs.',touch:'Steer into the right sign: it opens a shortcut and a ride!',keys:`Steer with ${keyCap('←')} ${keyCap('→')} or press ${keyCap('1')} ${keyCap('2')} ${keyCap('3')}.`},
  {kind:'bridge',name:'BRIDGE OUT',see:'A gap in the road and three word blocks.',touch:'Your car drives itself. Draw one line through the blocks in sentence order.',keys:`Your car drives itself. Press ${keyCap('1')} ${keyCap('2')} ${keyCap('3')} in sentence order.`},
  {kind:'walk',name:'CROSSWALK',see:'People carry words to two groups.',touch:'Swipe each word left or right into its group before you arrive.',keys:`Sort each word with ${keyCap('←')} ${keyCap('→')} before you arrive.`}];
const GOAL_TEXT={hold:['Hold your thumb on the road','Hold ↑ for a moment'],coast:['Let go to slow down','Let go of ↑ to slow down'],left:['Swipe left','Press ← or A'],right:['Swipe right','Press → or D'],boost:['Slide up for Nitro','Hold Space for Nitro'],save:['Slide down or let go to save the rest','Let go of Space to save the rest']};
function taskIcon(kind){
  const icons={
    light:'<rect x="25" y="6" width="14" height="30" rx="4" class="ti-dark"/><circle cx="32" cy="14" r="4" class="ti-dim"/><circle cx="32" cy="27" r="4" class="ti-go"/><rect x="4" y="44" width="16" height="9" rx="2" class="ti-sign"/><rect x="24" y="44" width="16" height="9" rx="2" class="ti-sign ti-right"/><rect x="44" y="44" width="16" height="9" rx="2" class="ti-sign"/>',
    fork:'<path d="M32 60V38L14 10M32 38l18-28" class="ti-road"/><path d="M32 38l18-28" class="ti-path"/><rect x="40" y="6" width="20" height="9" rx="2" class="ti-sign ti-right"/><rect x="4" y="6" width="20" height="9" rx="2" class="ti-sign"/>',
    bridge:'<rect x="4" y="38" width="14" height="10" class="ti-dark"/><rect x="46" y="38" width="14" height="10" class="ti-dark"/><rect x="20" y="38" width="7" height="6" rx="1" class="ti-sign ti-right"/><rect x="28.5" y="38" width="7" height="6" rx="1" class="ti-sign ti-right"/><rect x="37" y="38" width="7" height="6" rx="1" class="ti-sign"/><path d="M10 20h14l8 8 14-14" class="ti-path"/><circle cx="10" cy="20" r="3" class="ti-go"/><circle cx="32" cy="28" r="3" class="ti-go"/><circle cx="46" cy="14" r="3" class="ti-go"/>',
    walk:'<rect x="4" y="44" width="56" height="10" class="ti-stripes"/><circle cx="32" cy="16" r="5" class="ti-sign"/><path d="M32 22v14M26 28h12M32 36l-5 8M32 36l5 8" class="ti-person"/><path d="M20 20l-10 0M14 15l-5 5 5 5" class="ti-path"/><path d="M44 20h10M50 15l5 5-5 5" class="ti-path"/>'};
  return `<svg viewBox="0 0 64 64" aria-hidden="true" class="task-icon">${icons[kind]}</svg>`;
}
function practicePad(step){
  const touch=touchControls,demo=touch?`<span class="pp-hand pp-hand-${step}" aria-hidden="true"><svg viewBox="0 0 40 52"><path d="M15 22V7a4 4 0 0 1 8 0v13l9 2c4 1 6 4 5 8l-3 13c-1 4-4 7-8 7h-7c-3 0-5-1-7-4L4 32c-2-3 1-6 4-5l7 4" /></svg></span>`:`<span class="pp-keys" aria-hidden="true">${step==='drive'?keyCap('↑'):step==='steer'?keyCap('←')+keyCap('→'):keyCap('Space')+keyCap('N')}</span>`;
  const label={drive:touch?'Practice pad: hold your thumb here to drive.':'Practice: hold the Up arrow key to drive.',steer:touch?'Practice pad: swipe left or right to change lanes.':'Practice: press Left and Right to change lanes.',nitro:touch?'Practice pad: hold, then slide up for Nitro.':'Practice: hold Space for Nitro.'}[step];
  return `<div id="practice" class="practice-pad" data-step="${step}" tabindex="0" role="application" aria-label="${label}"><div class="pp-road"><i class="pp-lines"></i><span id="pp-car" class="pp-car" aria-hidden="true"></span>${demo}</div><div class="pp-gauges"><span class="pp-speed"><b id="pp-speed">0</b> KM/H</span>${step==='nitro'?`<span class="pp-nitro" aria-label="Nitro level"><i></i><i></i><i></i></span><span class="pp-fuel">FUEL <b id="pp-fuel">90</b></span>`:''}</div></div><ul id="pp-goals" class="pp-goals">${PRACTICE_GOALS[step].map(g=>`<li data-goal="${g}">${GOAL_TEXT[g][touch?0:1]}</li>`).join('')}</ul>`;
}
function tutorialStep(i,startAfter){
  const step=TUTORIAL_STEPS[i],touch=touchControls,last=i===TUTORIAL_STEPS.length-1;
  const copy={
    drive:[touch?'Hold to drive.':'Hold ↑ to drive.',touch?'Put your thumb anywhere on the road and keep it there: your car speeds up. Let go to slow down.':`Hold ${keyCap('↑')} (or hold the speed button) to speed up. Let go to slow down.`],
    steer:[touch?'Swipe to change lanes.':'Change lanes.',touch?'Keep your thumb down and swipe left or right. You can swipe again without lifting.':`Tap ${keyCap('←')} ${keyCap('→')} or ${keyCap('A')} ${keyCap('D')}, or the arrow buttons on screen.`],
    nitro:[touch?'Slide up for Nitro.':'Hold Space for Nitro.',touch?'While you drive, slide your thumb up for Nitro. Slide higher for level 2 and 3. Slide down, or let go, to save the rest for later.':`Hold ${keyCap('Space')} or the NITRO button to boost. Press ${keyCap('N')} or +30 to add a level. Let go to save the rest for later.`],
    tasks:['Answer with your car.','The road asks you English questions. Slow motion gives you time to read.'],
    race:['Win the race.','Good English fills your tank. Clean driving keeps your car in one piece.']}[step];
  let body='';
  if(PRACTICE_GOALS[step])body=practicePad(step)+(step==='nitro'?'<p class="tutorial-note">Each new Nitro level costs 30 fuel. In the race you earn fuel with right answers.</p>':'');
  else if(step==='tasks')body=`<div class="tutorial-tasks">${TUTORIAL_TASKS.map(t=>`<div class="tutorial-task">${taskIcon(t.kind)}<div><b>${t.name}</b><span>${t.see}</span><p>${touch?t.touch:t.keys}</p></div></div>`).join('')}</div><p class="tutorial-note">A wrong answer costs 1.5 seconds. It never damages your car.</p>`;
  else body=`<div class="tutorial-tiles"><div><b>FUEL</b><span>Right first time: +10 fuel. Every third in a row: +5 more. 30 fuel loads one Nitro.</span></div><div><b>YOUR CAR</b><span>Three bumps end the race. Change lanes into clear gaps.</span></div><div><b>THE FINISH</b><span>Finish first to open the next arena. Stars reward your English.</span></div></div>`;
  const dots=TUTORIAL_STEPS.map((_,k)=>`<i class="${k===i?'on':k<i?'past':''}"></i>`).join('');
  return `${host(i===0?'point':last?'smile':'think')}<span class="modal-kicker">DRIVING SCHOOL · ${i+1} OF ${TUTORIAL_STEPS.length}</span><h2 id="modal-title">${copy[0]}</h2><p class="tutorial-lead">${copy[1]}</p>${body}<div class="tutorial-dots" aria-hidden="true">${dots}</div><div class="modal-actions tutorial-actions">${i>0?'<button id="tutorial-back" class="secondary">BACK</button>':startAfter?'<button id="tutorial-skip" class="secondary">SKIP</button>':''}${last?'<button id="tutorial-rules" class="secondary">ALL RULES</button>':''}<button id="tutorial-next" class="primary">${last?(startAfter?'LET’S DRIVE ↗':'DONE'):'NEXT'}</button></div>`;
}
function stopPractice(){practice=null;}
function renderPractice(dt){
  if(!practice||!$('practice')){stopPractice();return;}
  // Until the first touch or key, the pad plays the move by itself.
  const pad=$('practice'),tried=pad.classList.contains('tried');let p=practice;
  if(!tried){const d=practiceDemo(p.step,(performance.now()-p.demoStart)/1000),demo=p.demo||=createPractice(p.step);if(d.level>0&&d.level>demo.level)demo.charges=Math.max(demo.charges,d.level);if(!d.held)demo.charges=0;demo.held=d.held;demo.lane=d.lane;demo.boost=d.level>0;demo.level=d.level;demo.fuel=90-30*demo.charges;practiceTick(demo,dt);p=demo;}
  p.offset=((p.offset||0)+p.speed*dt*4)%64;pad.style.setProperty('--pp-offset',p.offset.toFixed(1)+'px');
  setText('pp-speed',Math.round(p.speed));if($('pp-fuel'))setText('pp-fuel',p.fuel);
  pad.dataset.lane=String(p.lane);pad.dataset.level=String(p.boost?p.level:0);pad.classList.toggle('held',p.held||p.keyBoost);pad.style.setProperty('--pp-speed',String(p.speed/200));
  for(const li of $('pp-goals').querySelectorAll('[data-goal]'))li.classList.toggle('done',!!practice.goals[li.dataset.goal]);
  const done=practiceDone(practice);if(done&&!practice.cheered){practice.cheered=true;sound.tone('chime');$('tutorial-next').classList.add('ready');}
}
// Ticked from the main frame loop (real time, so slow devices hold just as long).
function stepPractice(now){const dt=Math.max(0,Math.min(.25,(now-practiceAt)/1000));practiceAt=now;practiceTick(practice,dt);renderPractice(dt);}
function tutorial(startAfter=false,i=0){
  if(race&&!['finished','failed','paused'].includes(race.status))autoResume=C.pause(race);
  stopPractice();showModal(tutorialStep(i,startAfter));$('modal').classList.add('tutorial-modal');practiceAt=performance.now();
  const step=TUTORIAL_STEPS[i],finish=()=>{stopPractice();saved.tutorial.done=true;saved.crosswalkTutorial=true;persist();closeModal();$('modal').classList.remove('tutorial-modal');if(startAfter)begin();else if(autoResume){C.resume(race);autoResume=false;}};
  $('tutorial-next').onclick=()=>{sound.tone('click');if(i<TUTORIAL_STEPS.length-1)tutorial(startAfter,i+1);else finish();};
  if($('tutorial-back'))$('tutorial-back').onclick=()=>{sound.tone('click');tutorial(startAfter,i-1);};
  if($('tutorial-skip'))$('tutorial-skip').onclick=finish;
  if($('tutorial-rules'))$('tutorial-rules').onclick=()=>{stopPractice();saved.tutorial.done=true;saved.crosswalkTutorial=true;persist();$('modal').classList.remove('tutorial-modal');rules(startAfter);};
  if(!PRACTICE_GOALS[step])return;
  practice=createPractice(step);practice.demoStart=performance.now();const pad=$('practice');
  pad.addEventListener('pointerdown',e=>{if(e.button>0||practice.pointer!=null)return;e.preventDefault();sound.unlock();practice.pointer=e.pointerId;pad.setPointerCapture?.(e.pointerId);pad.classList.add('tried');practicePress(practice,e.clientX,e.clientY);});
  pad.addEventListener('pointermove',e=>{if(practice?.pointer!==e.pointerId)return;e.preventDefault();const lane=practice.lane,level=practice.boost?practice.level:0;practiceMove(practice,e.clientX,e.clientY);if(lane!==practice.lane){sound.tone('click');haptic('click');}if(practice.boost&&practice.level>level){sound.tone('nitro'+practice.level);haptic('go');}});
  const up=e=>{if(practice?.pointer!==e.pointerId)return;practice.pointer=null;practiceRelease(practice);};
  for(const n of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(n,up);
  practiceAt=performance.now();setTimeout(()=>pad.focus(),0);
}
function practiceKeys(e,down){
  if(!practice||$('modal-backdrop').hidden||!$('practice'))return false;
  if(down&&e.repeat&&e.key!==' '&&e.key!=='ArrowUp')return false;if(e.repeat){e.preventDefault();return true;}
  const lane=practice.lane,level=practice.boost?practice.level:0;if(!practiceKey(practice,e.key,down))return false;
  e.preventDefault();$('practice').classList.add('tried');if(lane!==practice.lane)sound.tone('click');if(practice.boost&&practice.level>level)sound.tone('nitro'+practice.level);return true;
}
const help=()=>tutorial(false);
// First-race coach: hold to drive, then change lanes, then (once fuel allows)
// Nitro. Each prompt goes away for good once the move is done.
const COACH_TEXT={drive:[['HOLD THE ROAD TO DRIVE','Keep your thumb down'],['HOLD ↑ TO DRIVE','or hold the speed button']],steer:[['SWIPE ← → TO CHANGE LANES','Keep your thumb down while you swipe'],['PRESS ← → TO CHANGE LANES','or A / D']],nitro:[['NITRO READY! SLIDE YOUR THUMB UP','Slide down to save the rest'],['NITRO READY! HOLD SPACE','or hold the NITRO button']]};
let coachRun=null,coachAt=0;
function updateCoach(now){
  const el=$('coach'),dt=Math.max(0,Math.min(.25,(now-coachAt)/1000));coachAt=now;
  if(!race||!$('modal-backdrop').hidden||mode!=='race'){el.hidden=true;return;}
  if(coachRun?.race!==race)coachRun={race};
  const before=coachPrompt(race,saved.tutorial,C.canNitro(race),coachRun);
  if(coachProgress(race,saved.tutorial,coachRun,dt,before))persist();
  const prompt=coachPrompt(race,saved.tutorial,C.canNitro(race),coachRun);
  if(!prompt){el.hidden=true;el.dataset.prompt='';return;}
  const [text,sub]=COACH_TEXT[prompt][touchControls?0:1];el.hidden=false;
  if(el.dataset.prompt!==prompt||el.dataset.touch!==String(touchControls)){el.dataset.prompt=prompt;el.dataset.touch=String(touchControls);setText('coach-text',text);setText('coach-sub',sub);}
}
function begin(reviewItems=null){
  if(!teamById(saved.teamId)){goHome();return;}
  if(!Array.isArray(reviewItems)&&!arenaOpen(selectedArena)){goHome();toast('Finish first to unlock the next arena.');return;}
  clearGameSelection();
  $('launch-caption').textContent=touchControls?'HOLD TO DRIVE · SWIPE TO STEER · SLIDE ↑ FOR NITRO':'READ THE ROAD. RACE YOUR RIVALS.';
  invalidateLayout();launchNumber=0;lastPlace=null;pendingToast=null;toastEnd=0;$('toast').classList.remove('visible');$('celebration').hidden=true;$('celebration').innerHTML='';document.body.classList.remove('race-finished','car-critical','car-breaking');const items=Array.isArray(reviewItems)?reviewItems:null;settleLearning();clearAcceleration();closeModal();race=items?C.createReviewLap(unit(),items,saved.difficulty,Date.now(),{fuel:saved.fuel}):C.createRace(unit(),saved.difficulty,selectedArena,Date.now(),{fuel:saved.fuel,reviews:saved.reviewQueue[unit().id]||[]});preloadPictures(race);race.teamId=saved.teamId;race.runId=newIdentity('run');if(!items)leagueStart(race);settledAnswers=0;latestUnlock=0;mode='race';lastStatus='';lastTask='';lastResult=null;scene.setup(items?0:selectedArena);scene.clearGate();scene.currentLane=0;scene.setCosmetics(resolvedLook(saved));$('rival-tags').innerHTML=race.rivals.map(r=>`<span data-rival="${r.id}" style="--rival:#${r.color.toString(16)}">${r.name}<small></small></span>`).join('');document.body.classList.add('racing');$('home').hidden=true;$('hud').hidden=false;$('pause').hidden=false;$('countdown').hidden=false;$('warning').hidden=true;$('road-learning').hidden=true;$('controls').hidden=true;
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
  // Bridge Builder: each block in sentence order drops its slab with a note;
  // a wrong block bounces back out with a buzz and the placed slabs stay.
  const result=C.placeRepairBlock(race,id);
  if(result==='wrong'){connection.errorUntil=performance.now()+650;connection.dragging=false;connection.point=null;sound.tone('buzz');haptic('wrong');return;}
  if(!result)return;
  connection.sequence=race.task.chosen.slice();sound.tone(result==='solved'?'chime':'note'+connection.sequence.length);
  if(result==='solved'){connection.dragging=false;connection.point=null;haptic('correct');}
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
    if(connection.errorUntil&&performance.now()>=connection.errorUntil){connection.sequence=t.chosen.slice();connection.errorUntil=0;}
    setText('road-question',t.solved?t.answer:t.reviewOf?t.prompt:'Release the car. Connect the 3 blocks.');
    setText('road-kicker',t.solved?'BRIDGE BUILT':t.reviewOf?'REVIEW BRIDGE · AUTO CRUISE':'BRIDGE OUT · AUTO CRUISE');
    setText('road-instruction',t.solved?'SENTENCE CONNECTED · BRIDGE BUILT':connection.errorUntil?'NOT THAT BLOCK YET · TRY ANOTHER':'DRAG THROUGH THE 3 BLOCKS IN SENTENCE ORDER');
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
  // The League counts only first places that meet this game's accuracy rule
  // and decides the points itself.
  const ultiStatus=league.enabled?ultiWinStatus(race,position,stars):'none',leagueClaim=ultiStatus==='qualified',leagueTeam=teamById(race.teamId),leagueGradeNow=leagueGrade(race);
  if(leagueClaim){const claimed=race;league.claim(claimed.runId).then(r=>{if(race===claimed)renderLeagueResult(r,leagueGradeNow,leagueTeam);refreshUltiUI();return league.flush();}).catch(()=>{});}
  const ultiMissed=ultiStatus==='accuracy'?(race.difficulty==='challenge'?`English League Ulti points need ${ULTI_MIN_STARS} stars on Challenge: answer 3 in 4 tasks right first time.`:`English League Ulti points need ${Math.round(ULTI_MIN_RELAXED_ACCURACY*100)}% of tasks right first time on Relaxed.`):'';
  lastResult={finished,stars};sound.tone(finished?'finish':broken?'breakdown':'wrong');$('road-learning').hidden=true;$('controls').hidden=true;$('warning').hidden=true;$('pause').hidden=true;
  const review=race.review.filter(i=>!i.recovered),mastery=masteryStats(saved,race.unit.id),next=finished&&position===1&&!race.reviewLap&&race.arenaIndex<2&&arenaUnlocked(saved,race.unit.id,race.difficulty,race.arenaIndex+1);
  showModal(`${host(finished?(position===1&&!race.reviewLap?'cheer':'smile'):'think')}<span class="modal-kicker">${race.reviewLap?(finished?'REVIEW LOOP COMPLETE':'REVIEW LOOP · TRY AGAIN'):finished?'ENGLISH GRAND PRIX':broken?'THREE HITS · RACE ENDED':'THE ROAD IS WORTH ANOTHER TRY'}</span><div class="finish-emblem" aria-hidden="true"><span>${finished?'FINISH':broken?'BREAKDOWN':'KEEP GOING'}</span><strong>${finished?(race.reviewLap?'✓':String(position).padStart(2,'0')):broken?'!':'↗'}</strong><small>${race.reviewLap?'REVIEW':finished?'RACE POSITION':broken?'BACK TO THE GARAGE':'NEXT TIME'}</small></div><h2 id="modal-title">${finished?(race.reviewLap?'A stronger next drive.':position===1?'You took the lead.':'What a drive!'):broken?'Car broken down.':race.failureReason==='time'?'Time ran out.':'Race not finished.'}</h2><p>${escape(race.arena.name)} · ${C.DIFFICULTIES[saved.difficulty].label}${finished&&!race.reviewLap?' · POSITION '+position+'/3':''}</p>${!finished?`<div class="result-dnf" role="status"><strong>DNF</strong><span>DID NOT FINISH</span></div>`:''}<div class="result-stars" aria-label="${stars} out of 3 stars">${Array.from({length:3},(_,i)=>`<span class="${i<stars?'':'empty'}">★</span>`).join('')}</div><div class="result-stats"><div class="result-stat"><strong>${Math.ceil(race.time)}s</strong><small>TIME LEFT</small></div><div class="result-stat"><strong>${accuracy}%</strong><small>FIRST TRY</small></div><div class="result-stat"><strong>${race.collisions}</strong><small>BUMPS</small></div></div>${finished&&!race.reviewLap?`<div class="podium">${C.raceOrder(race).map((r,i)=>`<span class="${r.id==='player'?'you':''}"><b>${i+1}</b> ${escape(r.name)}</span>`).join('')}</div>`:''}<p>${race.reviewLap?'Review strengthens your English. Win the full race to unlock the next arena.':finished?'Stars reward your English and clean driving. First place unlocks the next arena.':broken?'Three separate hits ended this race. Your next drive starts with a fully repaired car. Read the gaps and save Nitro for a clear stretch.':'Try Relaxed for more thinking time, or take a short review lap before the next race.'}</p>${ultiMissed?`<div class="ulti-win ulti-missed" style="--team:${teamById(race.teamId)?.accent||'#a5caff'}"><span>FIRST PLACE · NO ULTI POINTS</span><p>${escape(ultiMissed)}</p></div>`:''}${leagueClaim?`<p id="league-result" class="league-result pending" role="status">Sending your win to the English League…</p>`:''}<div class="achievement">FUEL ${race.fuel}/100 · BEST STREAK ${race.bestStreak} · CHARGES LOADED ${race.nitroUses}</div>${latestUnlock?`<div class="achievement">MASTERY REWARD · ${['','EXPLORER BADGE','SCHOLAR BADGE','MASTER BADGE + AURORA TRAIL'][latestUnlock]}</div>`:''}<p class="save-note">Unit mastery: ${mastery.unique} distinct items · ${mastery.accuracy}% first try · ${mastery.arenas}/3 arenas</p>${next?`<div class="achievement">UNLOCKED · ${escape(C.ARENAS[race.arenaIndex+1].name)}</div>`:finished&&!race.reviewLap&&race.arenaIndex<2&&position!==1?`<p class="arena-goal">${arenaUnlocked(saved,race.unit.id,race.difficulty,race.arenaIndex+1)?'Finish first to advance from this race.':`Finish first in ${escape(race.arena.name)} to unlock ${escape(C.ARENAS[race.arenaIndex+1].name)}.`}</p>`:''}${review.length?`<details><summary>Review ${review.length} missed item${review.length>1?'s':''}</summary>${review.map(item=>`<div class="review-item"><span>${escape(item.prompt)}</span><strong>${escape(item.answer)}</strong>${item.tr?`<small>${escape(item.tr)}</small>`:''}</div>`).join('')}</details><button id="review-lap" class="review-lap-button">SHORT REVIEW LAP · UP TO 6 ITEMS ↗</button>`:race.review.length?'<div class="achievement">MISSED ITEMS RECOVERED ON THE ROAD</div>':''}<div class="modal-actions"><button id="replay" class="${next?'secondary':'primary'}">DRIVE AGAIN</button>${next?'<button id="next-arena" class="primary">NEXT ARENA ↗</button>':''}</div><button class="text-button" id="result-home">Return to garage</button><p class="save-note">${storageAvailable?'Wins, stars, fuel and mastery are saved in this browser.':'This browser is blocking saves. Keep this tab open to retain your progress.'}</p>`);
  $('modal').classList.add('finish-modal');$('modal').classList.toggle('dnf-result',!finished);if(finished)celebrate();
  $('replay').onclick=()=>begin();$('result-home').onclick=goHome;if($('review-lap'))$('review-lap').onclick=()=>begin(review);if($('next-arena'))$('next-arena').onclick=()=>{if(!next||race.status!=='finished'||C.raceOrder(race)[0]?.id!=='player')return;const target=race.arenaIndex+1;if(!arenaUnlocked(saved,race.unit.id,race.difficulty,target))return;selectedArena=target;begin();};
}
function journal(){showModal(`<span class="modal-kicker">RACE JOURNAL · GRADE ${saved.grade}</span><h2 id="modal-title">Every road counts.</h2><p>${C.DIFFICULTIES[saved.difficulty].label} difficulty · three arenas per unit</p>${BANK.find(g=>g.grade===saved.grade).units.map(u=>{let p=saved.progress[u.id+':'+saved.difficulty]||[0,0,0],n=p.reduce((a,b)=>a+b,0);return`<div class="journal-unit"><span>${escape(u.title)}</span><span>${n} / 9 ★</span></div>`;}).join('')}<p class="save-note">Progress is kept separately for each unit and difficulty in this browser.</p>${league.enabled?'<button id="journal-ulti" class="review-lap-button">ENGLISH LEAGUE ULTI ↗</button>':''}<button id="journal-done" class="primary">BACK TO GARAGE</button>`);$('journal-done').onclick=closeModal;if($('journal-ulti'))$('journal-ulti').onclick=leaguePanel;}
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
  if(practice)stepPractice(now);updateCoach(now);
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
  // On a Sky Coaster the dashboard shows the speed you see along the track.
  const dashboardSpeed=displaySpeed(race.route?.coaster?{...race,speedFactor:race.speedFactor*(scene?.rideSpeed||1)}:race,C.REGULAR_MAX_SPEED,C.MAX_SPEED);setText('speed',dashboardSpeed);$('throttle').style.setProperty('--speed-fill',dashboardSpeed/200);
  document.body.dataset.nitroLevel=String(race.nitroActive&&['driving','resolving'].includes(race.status)?race.nitroLevel||1:0);$('throttle').setAttribute('aria-pressed',String(!!race.accelerating||cruising&&drivingHeld()));
  const rushing=!!race.route?.coaster&&!preferences().reduced&&(scene?.rideSpeed||1)>1.35;$('speedlines').classList.toggle('boost',(race.boost>0||rushing)&&race.status==='driving');$('speedlines').classList.toggle('focus',race.status==='task');$('speedlines').classList.toggle('accelerating',race.accelerating&&race.speedFactor>.05);
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
    // No ticket yet (offline at the start line): ask again at each checkpoint.
    if(league.enabled&&!race.leagueTicket&&!race.reviewLap&&race.taskIndex!==leagueTaskIndex){leagueTaskIndex=race.taskIndex;if(performance.now()-leagueStartAt>4000)leagueStart(race);}
    if(race.status==='driving'){$('countdown').hidden=true;$('controls').hidden=touchControls;$('road-learning').hidden=true;if(was==='countdown'){sound.tone('go');haptic('go');toast('GO · FIND YOUR LINE');}}
    if(race.status==='task'){$('controls').hidden=touchControls;$('warning').hidden=true;}
    if(['finished','failed'].includes(race.status)&&!lastResult)result();
  }
  const route=context.route,routeActive=!!route&&!context.approaching&&!reading&&!['finished','failed'].includes(race.status);
  $('route-status').hidden=!routeActive;
  if(routeActive){const merging=!race.route;$('route-status').classList.toggle('detour',!route.shortcut);setText('route-label',merging?'MERGING':route.coaster?C.rideTitle(route)+' · −18m':route.shortcut?'SHORTCUT · −18m':'DETOUR · +32m');setText('route-remaining',Math.max(0,Math.ceil((merging?route.exitEndAt:route.end)-race.distance))+'m');$('route-status').style.setProperty('--route-progress',C.clamp((race.distance-route.start)/(route.exitEndAt-route.start),0,1));}
  $('warning').hidden=!context.approaching;
  if(context.approaching){
    const kind=context.next.kind;$('warning-title').textContent={light:'Traffic light ahead',repair:'Road repair ahead',junction:'Choose your route',pedestrian:'Crosswalk ahead'}[kind];setText('warning-sub',context.next.coaster?C.RIDE_LAYOUTS[context.next.coaster.layout].hint:'Get ready to read.');
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
$('league-button').onclick=leaguePanel;refreshLeagueButton();if(league.enabled){league.flush().catch(()=>{});league.refresh(saved.grade).then(refreshUltiUI,()=>{});}
$('lesson-picker').onclick=lessonChooser;
document.querySelectorAll('[data-diff]').forEach(b=>b.onclick=()=>{saved.difficulty=b.dataset.diff;selectedArena=0;refreshHome();});
$('settings').onclick=settings;
$('start').onclick=()=>{sound.unlock();if(saved.tutorial.done)begin();else tutorial(true);};$('help').onclick=()=>help();$('progress-button').onclick=journal;$('garage-button').onclick=garage;$('nitro').onclick=e=>{if(e.detail===0&&race&&race.nitro<=0)requestNitro();};$('nitro-stack').onclick=requestNitro;$('pause').onclick=pauseRace;$('brand-home').onclick=e=>{e.preventDefault();askExit();};for(const [id,direction]of [['left',-1],['right',1]]){$(id).onpointerdown=e=>{if(e.button>0)return;e.preventDefault();steer(direction);};$(id).onclick=e=>{if(e.detail===0)steer(direction);};}
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
  if(practiceKeys(e,true))return;
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
document.addEventListener('keyup',e=>{if(practiceKeys(e,false))return;if(e.key===' '){spaceHeld=false;applyAcceleration();if(race)e.preventDefault();}if(e.key==='ArrowUp'){upHeld=false;applyAcceleration();if(race)e.preventDefault();}});
window.addEventListener('blur',()=>{clearAcceleration();pauseRace();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseRace();else refreshUltiUI();});
document.addEventListener('graphicslost',()=>{pauseRace();$('graphics-error').hidden=false;});
try{scene=new RallyScene($('world'));scene.onCue=name=>sound.tone(name);}catch(error){console.error(error);$('graphics-error').hidden=false;$('loading').hidden=true;}
refreshHome();soundButton();applyPreferences();
let previous=performance.now(),idleFrames=0;
function frame(now){let rawDt=(now-previous)/1000,dt=Math.min(rawDt,.06);previous=now;scene?.samplePerformance(rawDt,!!race&&['driving','task','resolving'].includes(race.status));applyAcceleration();if(race)C.tick(race,dt,scene?.currentLane??race.lane);
  // A full-screen panel over an idle or paused scene needs only an occasional
  // frame; this saves battery and keeps panel transitions smooth on phones.
  const idleBehindModal=!$('modal-backdrop').hidden&&(!race||['paused','finished','failed'].includes(race.status));idleFrames=idleBehindModal?idleFrames+1:0;
  if(idleFrames%6===0)scene?.update(dt,race,mode);updateUI(now);sound.update(race,scene?.spectators?.proximity||0);if(now>toastEnd)$('toast').classList.remove('visible');if(roadFeedbackEnd&&now>roadFeedbackEnd){setText('road-feedback','');roadFeedbackEnd=0;}requestAnimationFrame(frame);}
requestAnimationFrame(frame);setTimeout(()=>$('loading').hidden=true,500);
window.WORDRAMP=window.WORDRIFT=window.WORDSHIFT={version:'0.28.0',ulti:Object.freeze({snapshot:grade=>league.snapshot(grade??saved.grade),enabled:league.enabled}),get race(){return race;},get settings(){return saved;},get scene(){return scene;}};
