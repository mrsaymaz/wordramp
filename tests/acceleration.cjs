const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{}};vm.createContext(ctx);for(const file of ['language-bank.js','repair-bank.js','match-bank.js','game-core.js'])vm.runInContext(fs.readFileSync((fs.existsSync('dist/language-bank.js')?'dist/':'')+file,'utf8'),ctx);
const C=ctx.window.RallyCore,u=ctx.window.LANGUAGE_BANK[0].units[0];
function approach(){const s=C.createRace(u,'relaxed',0,15,{rivals:false});s.status='driving';s.taskIndex=0;s.distance=s.tasks[0].at-C.CHOICE_FOCUS_DISTANCE;s.lane=s.tasks[0].correctIndex-1;s.speedFactor=1;s.obstacles=[];return s;}
let slow=approach(),fast=approach(),normalElapsed=0,fastElapsed=0;
while(!slow.tasks[0].completed&&normalElapsed<30){C.tick(slow,.02);normalElapsed+=.02;}
while(!fast.tasks[0].completed&&fastElapsed<30){C.setAccelerating(fast,true);if(fast.status==='task'&&fastElapsed>.5)C.choose(fast,fast.task.correctIndex);C.tick(fast,.02);fastElapsed+=.02;}
assert.equal(fast.correct,1);assert.equal(slow.correct,1);assert(fastElapsed<normalElapsed*.5,'A deliberate known answer and held acceleration remove most of the decision-line wait');
function road(){const s=approach();s.tasks=[];s.distance=0;return s;}
let release=road();C.setAccelerating(release,true);for(let i=0;i<10;i++)C.tick(release,.02);const accelerated=release.speedFactor;C.setAccelerating(release,false);for(let i=0;i<50;i++)C.tick(release,.02);assert(release.speedFactor<accelerated);assert(!release.accelerating);
let wrong=approach();C.tick(wrong,.02);C.choose(wrong,(wrong.task.correctIndex+1)%3);for(let i=0;i<1500&&!wrong.tasks[0].completed;i++){C.setAccelerating(wrong,true);C.tick(wrong,.02);}assert.equal(wrong.correct,0);assert.equal(wrong.review.length,1,'Fast choice recovery must not bypass answer accuracy');
let paused=approach();C.setAccelerating(paused,true);C.pause(paused);assert(!paused.accelerating);const distance=paused.distance;C.tick(paused,.1);assert.equal(paused.distance,distance);C.resume(paused);assert(!paused.accelerating,'Resuming must not leave an old hold active');
let collision=road();collision.slow=2;C.setAccelerating(collision,true);for(let i=0;i<20;i++)C.tick(collision,.02);assert(collision.speedFactor<.88,'Manual acceleration must preserve collision slowdown');
let failed=approach();failed.time=.001;C.setAccelerating(failed,true);C.tick(failed,.1);assert.equal(failed.status,'failed');assert(!failed.accelerating);
console.log(`PASS: deliberate choice with held acceleration locks the same correct answer in ${fastElapsed.toFixed(1)}s instead of ${normalElapsed.toFixed(1)}s. Release, pause/resume, wrong answers, collision slowdown and timeout verified.`);
