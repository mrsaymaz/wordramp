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

// Driving School: five short steps for first-time players. The practice pad
// uses the race's own touch gesture reader, so hold / swipe / slide feel the
// same in the lesson as on the road. Keyboards practise with the race keys.
export const TUTORIAL_STEPS=['drive','steer','nitro','tasks','race'];
export const PRACTICE_GOALS={drive:['hold','coast'],steer:['left','right'],nitro:['boost','save']};
export const PRACTICE_FUEL=90,PRACTICE_COST=30;
export function createPractice(step){
  return {step,speed:0,lane:0,held:false,heldFor:0,gesture:null,boost:false,level:0,charges:0,fuel:PRACTICE_FUEL,keyBoost:false,goals:Object.fromEntries((PRACTICE_GOALS[step]||[]).map(g=>[g,false]))};
}
export const practiceDone=p=>Object.values(p.goals).every(Boolean);
const practiceSteer=(p,direction)=>{if(!direction)return;const lane=Math.max(-1,Math.min(1,p.lane+direction));if(lane!==p.lane){p.lane=lane;const goal=direction<0?'left':'right';if(goal in p.goals)p.goals[goal]=true;}};
// A boost needs a bought charge: each new level costs 30 practice fuel; a
// saved charge resumes free.
function practiceBoost(p,on,level=1){
  if(p.step!=='nitro')return;
  if(!on){if(p.boost)p.goals.save=true;p.boost=false;p.level=0;return;}
  while(p.charges<level&&p.fuel>=PRACTICE_COST){p.fuel-=PRACTICE_COST;p.charges++;}
  p.level=Math.min(level,p.charges);p.boost=p.level>0;if(p.boost)p.goals.boost=true;
}
export function practicePress(p,x,y){p.held=true;p.gesture=createTouchDrive(x,y);}
export function practiceMove(p,x,y){
  if(!p.held||!p.gesture)return;const a=touchDriveGesture(p.gesture,x,y);practiceSteer(p,a.steer);
  if(a.boost&&(a.boostChanged||a.levelChanged))practiceBoost(p,true,a.level);else if(a.boostChanged&&!a.boost)practiceBoost(p,false);
}
export function practiceRelease(p){if(!p.held)return;p.held=false;p.gesture=null;if(p.boost)practiceBoost(p,false);}
// Keys: hold ↑ to drive, ← → / A D to steer, hold Space for Nitro (release
// saves the charge), N loads another level.
export function practiceKey(p,key,down){
  const k=key.length===1?key.toLowerCase():key;
  if(k==='ArrowUp'){if(down)p.held=true;else practiceRelease(p);return true;}
  if(down&&(k==='ArrowLeft'||k==='a')){practiceSteer(p,-1);return true;}
  if(down&&(k==='ArrowRight'||k==='d')){practiceSteer(p,1);return true;}
  if(k===' '){p.keyBoost=down;practiceBoost(p,down,Math.max(1,p.charges));return true;}
  if(down&&k==='n'){if(p.step==='nitro'&&p.charges<3&&p.fuel>=PRACTICE_COST){p.fuel-=PRACTICE_COST;p.charges++;if(p.boost)practiceBoost(p,true,p.charges);}return true;}
  return false;
}
// Display speed: 90 km/h held, up to 200 with three Nitro levels, coasting
// down when released.
export function practiceTick(p,dt){
  const driving=p.held||p.keyBoost;if(driving)p.heldFor+=dt;
  if(p.heldFor>=1.2&&'hold' in p.goals)p.goals.hold=true;
  if(p.goals.hold&&!driving&&'coast' in p.goals)p.goals.coast=true;
  const target=p.boost?[90,140,170,200][p.level]:driving?90:0;
  p.speed+=(target-p.speed)*Math.min(1,dt*(target>p.speed?2.4:1.1));
  return p;
}
// First-race coach: one prompt at a time, only on the open road.
// The Nitro prompt rests after 12 s on screen in one race (it returns next race).
export function coachPrompt(race,coach,canNitro=false,run=null){
  if(!race||race.reviewLap||!coach||race.status!=='driving')return null;
  if(!coach.drive)return race.accelerating?null:'drive';
  if(!coach.steer)return 'steer';
  if(!coach.nitro&&(canNitro||race.nitro>0)&&!(run?.nitroTime>=12))return 'nitro';
  return null;
}
// `coach` holds the saved lessons (drive / steer / nitro); `run` is this
// race's scratch. Returns true when a lesson was just learned.
export function coachProgress(race,coach,run,dt,prompt){
  if(!race||!coach||!run)return false;const before=[coach.drive,coach.steer,coach.nitro].join();
  if(race.status==='driving'&&race.accelerating){run.held=(run.held||0)+dt;if(run.held>=1.5)coach.drive=true;}
  if(run.lane!=null&&race.lane!==run.lane&&coach.drive)coach.steer=true;run.lane=race.lane;
  if(prompt==='steer'){run.steerTime=(run.steerTime||0)+dt;if(run.steerTime>=10)coach.steer=true;}
  if(prompt==='nitro')run.nitroTime=(run.nitroTime||0)+dt;
  if(race.nitroHeld&&race.nitro>0)coach.nitro=true;
  return [coach.drive,coach.steer,coach.nitro].join()!==before;
}
// The self-playing demo shown until the player first touches the pad: a 4 s
// loop of the same moves (the demo hand's CSS animation follows this script).
export const DEMO_CYCLE=4;
export function practiceDemo(step,t){
  t=((t%DEMO_CYCLE)+DEMO_CYCLE)%DEMO_CYCLE;
  if(step==='drive')return {held:t>=.4&&t<2.6,lane:0,level:0};
  if(step==='steer')return {held:t>=.3&&t<3.8,lane:t<1?0:t<1.8?-1:t<2.6?0:t<3.4?1:0,level:0};
  if(step==='nitro')return {held:t>=.3&&t<3.6,lane:0,level:t>=1.2&&t<2.8?(t<1.9?1:2):0};
  return {held:false,lane:0,level:0};
}
