const assert=require('node:assert/strict');
const {createTouchDrive,touchDriveGesture,touchContentBottom}=require('./presentation-compiled.cjs');
const {roadVerticalLayout}=require('./layout-compiled.cjs');
global.window={};for(const f of ['language-bank','repair-bank','match-bank','game-core'])require('../dist/'+f+'.js');
const C=window.RallyCore,unit=window.LANGUAGE_BANK[0].units[0];
let thumb=createTouchDrive(260,600);
for(const [x,direction]of [[300,1],[260,-1],[220,-1],[260,1]]){
 const action=touchDriveGesture(thumb,x,600);assert.equal(action.steer,direction);assert(!action.boost);
 assert.equal(touchDriveGesture(thumb,x,600).steer,0,'Holding a position never repeats a lane change');
}
let action=touchDriveGesture(thumb,260,550);assert(action.boost&&action.boostChanged);assert.equal(action.level,1);
action=touchDriveGesture(thumb,300,550);assert.equal(action.steer,1);assert(action.boost,'Horizontal steering preserves Nitro');
action=touchDriveGesture(thumb,260,550);assert.equal(action.steer,-1);assert(action.boost);
action=touchDriveGesture(thumb,260,520);assert.equal(action.level,1);assert(action.boost);
action=touchDriveGesture(thumb,260,505);assert.equal(action.level,2);assert(action.levelChanged);
action=touchDriveGesture(thumb,260,460);assert.equal(action.level,3);assert(action.levelChanged);
action=touchDriveGesture(thumb,260,489);assert(!action.boost&&action.boostChanged,'A deliberate downward return cancels Nitro before reaching the starting point');
action=touchDriveGesture(thumb,260,440);assert(action.boost);assert.equal(action.level,1,'A new forward movement resumes from the new thumb position');
thumb=createTouchDrive(260,600);for(const [x,y]of [[268,603],[255,597],[262,604],[260,600]]){action=touchDriveGesture(thumb,x,y);assert.equal(action.steer,0);assert(!action.boost);}
thumb=createTouchDrive(260,600);action=touchDriveGesture(thumb,300,560);assert.equal(action.steer,0);assert(!action.boost,'An ambiguous diagonal does not spend fuel');

let motionCases=0;
for(const hz of [30,60,120])for(const level of [1,2,3]){
 const s=C.createRace(unit,'challenge',0,4,{fuel:100,rivals:false});s.status='driving';s.tasks=[];s.obstacles=[];
 C.setAccelerating(s,true,false);for(let i=0;i<hz;i++)C.tick(s,1/hz);
 assert(Math.abs(s.speedFactor-C.REGULAR_MAX_SPEED)<.01);
 for(let i=0;i<level;i++)assert(C.activateNitro(s));
 const loaded=s.nitro,fuel=s.fuel;
 for(let i=0;i<hz;i++)C.tick(s,1/hz);
 assert.equal(s.nitro,loaded,'A regular touch hold cannot consume a saved charge');
 assert(C.engageNitro(s));for(let i=0;i<Math.round(hz*.3);i++)C.tick(s,1/hz);
 assert(s.nitroActive&&s.speedFactor>C.REGULAR_MAX_SPEED+.8);
 const charge=s.nitro,distance=s.distance;
 C.setNitroHeld(s,false);assert(!s.nitroActive&&s.accelerating);
 for(let i=0;i<hz*2;i++)C.tick(s,1/hz);
 assert.equal(s.nitro,charge,'Sliding down conserves the remaining charge while accelerating');
 assert.equal(s.fuel,fuel);assert(s.distance>distance);assert(Math.abs(s.speedFactor-C.REGULAR_MAX_SPEED)<.001);
 assert(C.engageNitro(s));C.tick(s,1/hz);assert(s.nitro<charge);assert.equal(s.nitroUses,level,'Resuming never buys a replacement charge');
 C.setNitroHeld(s,false);C.setAccelerating(s,false,false);const released=s.nitro;
 for(let i=0;i<hz;i++)C.tick(s,1/hz);assert.equal(s.nitro,released);
 C.setAccelerating(s,true);C.tick(s,1/hz);assert(s.nitroActive,'Desktop accelerator compatibility is preserved');motionCases++;
}

let layoutCases=0;
for(const [width,height]of [[280,396],[320,396],[390,672],[430,760],[768,900],[1024,680],[568,242],[844,300],[1024,420],[1366,900]])for(const repair of [false,true]){
 const controlsTop=touchContentBottom(width,height),landscape=width>height&&height<600;
 assert(controlsTop<height-40&&controlsTop>height-125);
 const promptHeight=landscape?48:64,answerHeight=landscape?60:82,hudBottom=landscape?50:68;
 const result=roadVerticalLayout({hudBottom,promptHeight,answerHeight,answerY:height*.55,controlsTop,repair,landscape,viewportHeight:height});
 assert(result.py-promptHeight/2>=hudBottom);assert(result.ay-answerHeight/2>=result.py+promptHeight/2+8);
 assert(result.ay+answerHeight/2<=controlsTop-12+.01,'Side signs stay above the thumb area');
 assert(result.ay+result.stagger+answerHeight/2<=height-12+.01,'The middle repair block remains on the visible screen');layoutCases++;
}
console.log(`PASS: continuous thumb steering, horizontal steering while boosting, forward stack levels, downward cancellation, re-arming, jitter and diagonal rejection; ${motionCases} charge-conservation/acceleration cases at 30/60/120 Hz; ${layoutCases} phone/tablet portrait and landscape task bounds.`);
