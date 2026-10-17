// Presentation preferences and frame-budget decisions do not change race physics.
export function normalisePreferences(value={},systemReduced=false){
  if(!value||typeof value!=='object')value={};
  return {graphics:['auto','high','battery'].includes(value.graphics)?value.graphics:'auto',motion:['system','full','reduced'].includes(value.motion)?value.motion:'system',haptics:value.haptics!==false,reduced:value.motion==='reduced'||value.motion!=='full'&&systemReduced};
}
export function createPerformanceBudget(graphics='auto',dpr=1){
  const ceiling=Math.min(dpr,graphics==='battery'?1:graphics==='high'?2:1.75);
  return {graphics,ceiling,ratio:ceiling,seconds:0,frames:0,slow:0,cooldown:0};
}
export function samplePerformance(b,seconds,active=true){
  if(!active||b.graphics!=='auto'||seconds<=0||seconds>.15)return false;
  b.cooldown=Math.max(0,b.cooldown-seconds);b.seconds+=seconds;b.frames++;if(seconds>1/38)b.slow++;
  if(b.seconds<2.5)return false;
  const overloaded=b.slow/b.frames>.35;let changed=false;
  if(overloaded&&b.cooldown===0&&b.ratio>.85){b.ratio=Math.max(.85,b.ratio-.2);b.cooldown=5;changed=true;}
  b.seconds=0;b.frames=0;b.slow=0;return changed;
}
// Dispatch a lane change as soon as the finger commits, only once per gesture.
export function swipeDirection(gesture,x,y){
  if(!gesture||gesture.dispatched)return 0;
  const dx=x-gesture.x,dy=y-gesture.y;
  if(Math.abs(dx)<28||Math.abs(dx)<Math.abs(dy)*1.2)return 0;
  gesture.dispatched=true;return Math.sign(dx);
}
// A committed gesture has one meaning; diagonal and downward flicks never boost.
export function roadGesture(gesture,x,y){
  if(!gesture||gesture.dispatched)return null;
  const dx=x-gesture.x,dy=y-gesture.y;
  if(-dy>=44&&-dy>Math.abs(dx)*1.25){gesture.dispatched=true;return {type:'nitro'};}
  if(Math.abs(dx)>=28&&Math.abs(dx)>Math.abs(dy)*1.2){gesture.dispatched=true;return {type:'steer',direction:Math.sign(dx)};}
  if(dy>=44&&dy>Math.abs(dx)*1.25){gesture.dispatched=true;return {type:'cancel'};}
  return null;
}

// A captured thumb stays down while steering, boosting and returning to cruise.
// Separate anchors let horizontal swipes work at any vertical boost position.
export function createTouchDrive(x,y){return {laneX:x,laneY:y,boostBase:y,peakY:y,boost:false,level:0};}
export function touchDriveGesture(gesture,x,y){
  const dx=x-gesture.laneX,dy=y-gesture.laneY;
  let steer=0,boostChanged=false,levelChanged=false;
  if(Math.abs(dx)>=28&&Math.abs(dx)>Math.abs(dy)*1.2){
    steer=Math.sign(dx);gesture.laneX=x;gesture.laneY=y;
    if(!gesture.boost)gesture.boostBase=y;
  }
  if(gesture.boost){
    gesture.peakY=Math.min(gesture.peakY,y);
    const drop=y-gesture.peakY;
    if(drop>=28&&drop>Math.abs(dx)*1.2){
      gesture.boost=false;gesture.level=0;gesture.boostBase=y;boostChanged=true;
    }else{
      const level=Math.min(3,Math.max(1,Math.floor((gesture.boostBase-y)/44)));
      if(level>gesture.level){gesture.level=level;levelChanged=true;}
    }
  }else{
    gesture.boostBase=Math.max(gesture.boostBase,y);
    const rise=gesture.boostBase-y;
    if(rise>=44&&rise>Math.abs(dx)*1.2){
      gesture.boost=true;gesture.peakY=y;gesture.level=Math.min(3,Math.max(1,Math.floor(rise/44)));boostChanged=true;
    }
  }
  if(Math.abs(dy)>Math.abs(dx)*1.2){gesture.laneX=x;gesture.laneY=y;}
  return {steer,boost:gesture.boost,level:gesture.level,boostChanged,levelChanged};
}
export function touchContentBottom(width,height){
  const thumbSpace=height>=width?Math.min(124,Math.max(80,height*.16)):Math.min(72,Math.max(42,height*.17));
  return height-thumbSpace;
}

// Calibrate the dashboard independently of world speed and arena difficulty.
export function displaySpeed(state,regularMax=1.55,boostMax=3.45){
  if(!state||!['driving','task','resolving'].includes(state.status))return 0;
  const factor=Math.max(0,Number(state.speedFactor)||0);
  const value=factor<=regularMax?factor/regularMax*90:90+(factor-regularMax)/(boostMax-regularMax)*110;
  return Math.max(0,Math.min(200,Math.round(value)));
}

// Allocate attention to the current task or road before optional announcements.
export function raceHudContext(state,{modalOpen=false}={}){
  if(!state)return {phase:'garage',question:false,approaching:false,route:null,announcementsAllowed:!modalOpen};
  const question=['task','resolving'].includes(state.status),driving=state.status==='driving';
  const next=state.tasks?.[state.taskIndex],ahead=next?.at-state.distance;
  const approaching=driving&&ahead>0&&ahead<(next.kind==='pedestrian'?174:90);
  const route=state.route||(state.mergeAssist&&state.distance<state.mergeAssist.exitEndAt?state.mergeAssist:null);
  const hazardNear=(state.obstacles||[]).some(o=>!o.passed&&!o.dormant&&o.at>state.distance-8&&o.at<state.distance+80);
  const phase=question?'question':approaching?'approaching':route?'route':driving?'driving':'inactive';
  return {phase,question,approaching,next,ahead,route,announcementsAllowed:driving&&!question&&!approaching&&!route&&!hazardNear&&!state.yielding&&!state.followingTraffic&&!modalOpen};
}

// Lesson previews describe the existing language bank; they do not alter tasks.
export const GRADE_LEVELS=Object.freeze({5:'A1',6:'A1+',7:'A2',8:'A2+'});
const LESSON_SUMMARIES=Object.freeze({
  g5u1:'Naming school places and clubs, expressing likes and following school rules.',
  g5u2:'Following classroom instructions and talking about school subjects, objects and time.',
  g5u3:'Describing appearance, clothes and everyday routines.',
  g5u4:'Talking about family hobbies, routines and actions happening now.',
  g5u5:'Naming neighbourhood places and describing where things are in a city.',
  g5u6:'Ordering food and asking about quantities and prices.',
  g5u7:'Describing wild animals, their homes, abilities and size.',
  g5u8:'Describing natural places and making holiday plans.',
  g5u9:'Naming jobs and workplaces, and explaining what people do.',
  g5u10:'Asking about toys, colours, shapes and prices.',
  g6u1:'Talking about school roles, responsibilities and how often routines happen.',
  g6u2:'Describing study routines and comparing everyday activities with actions happening now.',
  g6u3:'Describing and comparing appearance, personality and personal belongings.',
  g6u4:'Talking about family jobs, homes and planned arrangements.',
  g6u5:'Describing festivals, transport and events in the past.',
  g6u6:'Talking about countries, languages, food culture and past food experiences.',
  g6u7:'Describing nature activities, reducing waste and protecting the environment.',
  g6u8:'Talking about planets, weather, future plans and predictions.',
  g6u9:'Comparing products and asking about prices and sizes.',
  g6u10:'Expressing feelings and needs, asking for help and discussing healthy habits.',
  g7u1:'Describing appearance and personality traits, and comparing people.',
  g7u2:'Talking about sports, equipment and how often people exercise.',
  g7u3:'Telling life stories and describing achievements, dates and past events.',
  g7u4:'Describing wild animals, their habitats and ways to protect them.',
  g7u5:'Talking about TV programmes, expressing preferences and sharing opinions.',
  g7u6:'Planning parties, making offers and suggestions, and talking about quantities.',
  g7u7:'Expressing hopes and ambitions, and making predictions about the future.',
  g7u8:'Naming public places, explaining their purposes and giving directions.',
  g7u9:'Discussing environmental problems and giving advice about solutions.',
  g7u10:'Comparing planets and exploring facts about space and space history.',
  g7u11:'Naming ingredients, following recipes and putting cooking steps in order.',
  g7u12:'Describing past holidays, asking about journeys and making travel plans.',
  g8u1:'Making invitations, accepting or refusing, and giving reasons and excuses.',
  g8u2:'Talking about teen routines, habits, preferences and opinions.',
  g8u3:'Naming kitchen tools and ingredients, and explaining recipes step by step.',
  g8u4:'Having phone conversations, taking messages and asking for clarification.',
  g8u5:'Talking about internet tools, online habits and staying safe online.',
  g8u6:'Comparing adventure sports, choosing equipment and following safety rules.',
  g8u7:'Describing destinations, comparing holidays and talking about past trips.',
  g8u8:'Sharing household chores and explaining responsibilities, rules and obligations.',
  g8u9:'Describing scientific achievements, experiments and laboratory instructions.',
  g8u10:'Discussing natural events, their effects, safety precautions and predictions.',
  g8u11:'Making polite shopping requests, comparing products and explaining purchase problems.',
  g8u12:'Describing pets, their daily needs and responsible care.'
});
export function lessonSummary(unit){return LESSON_SUMMARIES[unit.id]||unit.targetLanguage?.slice(0,2).join(' · ')||'Practise this unit’s vocabulary and useful everyday English.';}
