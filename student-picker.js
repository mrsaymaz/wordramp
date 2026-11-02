// "Who are you?" (League v11.7.0): with the English League on, a student taps
// their name from the League roster once on this device, so every Ulti win
// says who earned it. They have already chosen a team and a lesson grade in
// the garage, so the list is that grade's classes and, in a class, only that
// team's names. A grade with one class goes straight to the names. "Show
// everyone" opens every grade and team. A named student's wins go to their
// own class grade and League team. Markup and pure helpers only: app.js keeps
// the picker state and wires the data-student buttons.
import {teamById} from './teams-ulti.js';
import {validStudentId,LEAGUE_GRADES} from './league.js';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const teamName=id=>teamById(id)?.name||'';
const teamColour=id=>teamById(id)?.accent||'#a5caff';
// Turkish alphabet order: Ç after C, İ/I, Ö after O, Ş after S, Ü after U.
export const collateNames=(a,b)=>a.localeCompare(b,'tr',{sensitivity:'base'});
export const sortStudents=list=>list.slice().sort((a,b)=>collateNames(a.name,b.name)||a.id.localeCompare(b.id));

// Ask on PLAY only when the League is on and this device has neither chosen a
// name nor chosen "Play without a name".
export const needsStudent=({enabled,student,skip})=>!!enabled&&!validStudentId(student?.id)&&!skip;
// The saved form of a chosen roster entry.
export const studentRecord=s=>({id:s.id,name:s.name,className:s.className,team:s.team,grade:Number(s.className.charAt(0))});
// A saved student from localStorage, or null when it is missing or damaged.
export function savedStudent(value){
  const s=value&&typeof value==='object'?value:null;
  if(!s||!validStudentId(s.id)||typeof s.name!=='string'||!/^[5-8]-[A-Z]$/.test(s.className)||!teamById(s.team))return null;
  return studentRecord(s);
}

// The students listed: the chosen team only, unless "everyone" is on.
export const teammates=(students=[],team='',all=false)=>students.filter(p=>all||!team||p.team===team);
// The classes worth a button: those with at least one listed student.
export function pickerClasses(classes=[],students=[],team='',all=false){
  const listed=new Set(teammates(students,team,all).map(p=>p.className));
  return classes.filter(c=>listed.has(c));
}
// Which screen the picker shows. p: {grade, team, all, className, studentId,
// roster, loading, offline}. A grade with a single class for this team skips
// the class step (6-C, 7-A and 8-B are one-class grades); "everyone" keeps its
// grade tabs, so it always starts at the classes.
export function pickerStep(p){
  const students=p.roster?.students||[],chosen=p.studentId&&students.find(s=>s.id===p.studentId);
  if(chosen)return {step:'confirm',student:chosen};
  if(p.className)return {step:'names',className:p.className,auto:!!p.auto};
  if(!students.length)return {step:p.loading?'loading':p.offline?'offline':'empty'};
  const classes=pickerClasses(p.roster.classes,students,p.team,p.all);
  if(!classes.length)return {step:p.loading?'loading':'empty'};
  if(!p.all&&classes.length===1)return {step:'names',className:classes[0],auto:true};
  return {step:'classes',classes};
}

const links=all=>`<div class="student-links">${all?'':'<button type="button" class="student-link" data-student="all">Not here? Show everyone</button>'}<button type="button" class="student-link" data-student="skip">Not on the list? Play without a name</button></div>`;
const ask=text=>`<p class="student-ask">${text}</p>`;
function gradeTabs(grade){
  return `<div class="grades student-grades" role="group" aria-label="Grade">${LEAGUE_GRADES.map(g=>`<button type="button" data-student="grade" data-value="${g}" class="${g===grade?'selected':''}" aria-pressed="${g===grade}">Grade ${g}</button>`).join('')}</div>`;
}
// The whole picker body for one step. host: Mr. Saymaz's picture markup.
export function pickerMarkup(p,{host=''}={}){
  const view=pickerStep(p),team=teamName(p.team),grade=p.grade;
  const head=(kicker,figure='')=>`<div class="student-heading">${figure}<div><span class="modal-kicker">${kicker}</span><h2 id="modal-title">Who are you?</h2></div><button type="button" class="lesson-close student-close" data-student="close" aria-label="Close and go back to the garage">×</button></div>`;
  const kicker=p.all?'ENGLISH LEAGUE · EVERYONE':`ENGLISH LEAGUE · GRADE ${esc(grade)}${team?' '+esc(team.toUpperCase()):''}`;
  if(view.step==='confirm'){
    const s=view.student,name=teamName(s.team),g=s.className.charAt(0);
    return `${head('ENGLISH LEAGUE',host)}${ask(`Are you ${esc(s.name)}?`)}<div class="student-card" style="--team:${teamColour(s.team)}"><b>${esc(s.name)}</b><span>${esc(s.className)} · Team ${esc(name)}</span><small>Your wins add Ulti to Grade ${esc(g)} ${esc(name)}.</small></div><div class="modal-actions student-actions"><button type="button" class="secondary" data-student="back-names">No, go back</button><button type="button" class="primary" data-student="confirm">Yes, that's me!</button></div>`;
  }
  if(view.step==='names'){
    const list=sortStudents(teammates(p.roster?.students||[],p.team,p.all).filter(s=>s.className===view.className));
    const hello=p.all||!team?`Hello, ${esc(view.className)}!`:`Hello, ${esc(view.className)} ${esc(team)}!`;
    const back=view.auto?'':'<button type="button" class="secondary student-back" data-student="back">◀ Classes</button>';
    return `${head(kicker)}${ask(`${hello} Tap your name.`)}<div class="student-names">${list.map(s=>`<button type="button" class="student-name" data-student="pick" data-value="${esc(s.id)}" style="--team:${teamColour(s.team)}"><i aria-hidden="true"></i><span>${esc(s.name)}</span></button>`).join('')||'<p class="student-note">No names in this class yet.</p>'}</div>${back}${links(p.all)}`;
  }
  const tabs=p.all?gradeTabs(grade):'';
  if(view.step==='classes'){
    const question=p.all||!team?'Which class are you in?':`Grade ${esc(grade)} ${esc(team)}! Which class are you in?`;
    return `${head(kicker,p.all?'':host)}${ask(question)}${tabs}<div class="student-classes">${view.classes.map(c=>`<button type="button" class="student-class" data-student="class" data-value="${esc(c)}">${esc(c)}</button>`).join('')}</div>${links(p.all)}`;
  }
  const note=view.step==='loading'?'<p class="student-note" role="status">Loading the class list…</p>':view.step==='offline'?`<p class="student-note" role="status">The class list can't be loaded right now.</p><button type="button" class="secondary student-retry" data-student="retry">Try again</button>`:`<p class="student-note">No names are on the list for ${p.all?`Grade ${esc(grade)}`:`Grade ${esc(grade)} ${esc(team)}`} yet.</p>`;
  return `${head(kicker,p.all?'':host)}${ask('Find your name to collect Ulti for your team.')}${tabs}${note}${links(p.all)}`;
}
// The pill on the garage: who is playing, and a way to change (shared tablets).
export function studentPillMarkup(student){
  if(!student)return `<span class="student-pill-name">Who are you?</span><small>Choose</small>`;
  return `<i class="student-dot" style="--team:${teamColour(student.team)}" aria-hidden="true"></i><span class="student-pill-name"><em>Playing as </em><b>${esc(student.name)}</b> · ${esc(student.className)}</span><small>Change</small>`;
}
export const studentPillLabel=student=>student?`Playing as ${student.name}, ${student.className}. Change`:'Who are you? Choose your name';
