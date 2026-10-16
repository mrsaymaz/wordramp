/* Wordrift v0.23.1 — deterministic gameplay and question adapter. */
(function(root){
  'use strict';
  const ARENAS=[
    {id:'boulevard',name:'Sunlit Boulevard',tag:'THE CITY RUN',length:7200,speed:21,checkpoints:12,spacing:34,color:'#ffd66b',description:'Wide streets. Warm skies. Your first green light.'},
    {id:'coast',name:'Coastal Overpass',tag:'THE BRIDGE RUN',length:8100,speed:24,checkpoints:14,spacing:29,color:'#62e5e1',description:'Ocean bridges, tunnel lights and moving traffic.'},
    {id:'storm',name:'Stormcrest Expressway',tag:'THE SUMMIT RUN',length:9000,speed:27,checkpoints:16,spacing:24,color:'#b4a3ff',description:'Mountain roads. Storm clouds. One final finish line.'}
  ];
  const DIFFICULTIES={relaxed:{label:'Relaxed',extra:45,penalty:3,spacing:1.3,focus:.17,clock:.38},challenge:{label:'Challenge',extra:26,penalty:5,spacing:.87,focus:.25,clock:.55}};
  const PEDESTRIAN_WALK_TIME=1.4,PEDESTRIAN_ENTRY_TIME=1.2,VEHICLE_GAP=7.2,TASK_VIEW_DISTANCE=500;
  const REGULAR_MAX_SPEED=1.55,MAX_SPEED=3.45,NITRO_COST=30,NITRO_DURATION=2.2,NITRO_MAX_STACKS=3;
  const FOCUS_ENTRY=.42,FOCUS_RETURN=1.35,FOCUS_FAST_RETURN=.25,CHOICE_FOCUS_DISTANCE=52;
  const DAMAGE_LIMIT=3,COLLISION_GRACE={relaxed:3,challenge:2},BREAKDOWN_DURATION=1.15,IMPACT_RECOVERY=4.25;
  const RIVAL_PROFILES={
    relaxed:[{pace:1.53,think:1.05,readPace:1.35,throttle:5.5,accuracy:.92,lookAhead:3.3,burst:2.8,push:.04,fuel:60},{pace:1.55,think:.90,readPace:1.40,throttle:6,accuracy:.88,lookAhead:3.1,burst:2.9,push:.04,fuel:60}],
    challenge:[{pace:1.62,think:.40,readPace:1.50,throttle:7,accuracy:.985,lookAhead:3.7,burst:2.9,push:.06,fuel:60},{pace:1.66,think:.30,readPace:1.55,throttle:7,accuracy:.95,lookAhead:3.3,burst:2.9,push:.08,fuel:60}]
  };
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  function random(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
  function shuffle(items,rng=Math.random){let a=items.slice();for(let i=a.length-1;i>0;i--){let j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function distinct(a){return [...new Set(a.map(x=>String(x).trim()))];}
  function makeTasks(unit,difficulty,arenaIndex,rng){
    const count=ARENAS[arenaIndex].checkpoints,used=new Set(),usedWords=new Set();
    const takeWords=words=>{const key=w=>w.toLowerCase(),fresh=words.filter(w=>!usedWords.has(key(w))),seen=words.filter(w=>usedWords.has(key(w))),picked=[...shuffle(fresh,rng),...shuffle(seen,rng)].slice(0,2);picked.forEach(w=>usedWords.add(key(w)));return picked;};
    const take=arr=>{let fresh=arr.filter(x=>!used.has(x.id));let item=shuffle(fresh.length?fresh:arr,rng)[0];used.add(item.id);return item;};
    const tasks=[];
    for(let i=0;i<count;i++){
      let kind=['light','repair','junction','pedestrian'][i%4], t;
      if(kind==='repair'){
        const candidates=root.REPAIR_BANK?.[unit.id]||unit.sentences.filter(x=>x.blocks.length===3);
        if(!candidates.length)throw new Error('Missing three-block repair bank: '+unit.id);
        let item=take(candidates),order=shuffle([0,1,2],rng);
        if(order.every((x,j)=>x===j))order.push(order.shift());
        t={kind,id:item.id,sourceId:item.sourceId||item.id,prompt:'Connect the three blocks in sentence order.',blocks:item.blocks.slice(),order,answer:item.blocks.join(' '),tr:item.tr||'',attempts:0,chosen:[],connection:[],solved:false};
      }else if(kind==='pedestrian'){
        const pairs=(unit.categoryPairs||[unit.categories.slice(0,2).map(c=>c.id)]).map((ids,j)=>({id:unit.id+'-category-pair-'+j,ids}));
        const pair=take(pairs),[left,right]=pair.ids.map(id=>unit.categories.find(c=>c.id===id));
        const overlap=new Set(left.yes.map(x=>x.toLowerCase()));
        const rightWords=right.yes.filter(x=>!overlap.has(x.toLowerCase()));
        const people=shuffle([...takeWords(left.yes).map(word=>({word,side:0})),...takeWords(rightWords).map(word=>({word,side:1}))],rng).map((p,j)=>({...p,id:j,originSide:j%2?-1:1,sent:false,at:0,entryAt:0,tr:unit.translations.find(t=>t.en.toLowerCase()===p.word.toLowerCase())?.tr||''}));
        t={kind,sortDuration:{relaxed:28,challenge:20}[difficulty],id:unit.id+'-crosswalk-'+i,prompt:'Guide each visitor to the right category.',categoryIds:pair.ids.slice(),labels:[left.title,right.title],options:[left.title,right.title],people,personIndex:0,pedWait:0,answer:left.title+' / '+right.title,tr:'',attempts:0};
      }else{
        // Introduce short Q&A signs on the third light, alongside vocabulary
        // clues and translations. Units absent from the upload retain their
        // complete existing bank. Each sign keeps its identity while visible.
        let type=kind==='light'?['description','translation','question','translation'][Math.floor(i/4)%4]:i<12?'grammar':'translation';
        if(type==='question'&&!root.MATCH_BANK?.[unit.id]?.some(x=>x.type===type))type='description';
        const candidates=root.MATCH_BANK?.[unit.id]?.filter(x=>x.type===type);
        if(!candidates?.length)throw new Error('Missing reviewed match bank: '+unit.id);
        const item=take(candidates),options=shuffle(item.options||[item.answer,...shuffle(item.decoys,rng).slice(0,2)],rng);
        t={kind,type,id:item.id,prompt:item.prompt,answer:item.answer,options,correctIndex:options.indexOf(item.answer),tr:item.tr||'',attempts:0};
      }
      t.at=220+i*(ARENAS[arenaIndex].length-440)/(count-1);
      if(t.kind==='pedestrian')t.rows=[{at:t.at+56,options:t.labels,answer:t.answer,correctIndex:null}];
      else if(t.kind==='repair')t.rows=[{at:t.at+12,options:t.order.map(j=>t.blocks[j]),answer:t.answer,correctIndex:null}];
      else t.rows=[{at:t.at,options:t.options,answer:t.answer,correctIndex:t.correctIndex}];
      t.rowIndex=0;t.endAt=t.rows.at(-1).at;t.success=null;t.completed=false;if(t.people){t.stopAt=t.at-16;t.exitEndAt=t.at+36;t.people.forEach((p,j)=>p.at=t.at+j*3);}tasks.push(t);
    }
    return tasks;
  }
  function createRace(unit,difficulty='relaxed',arenaIndex=0,seed=Date.now(),settings={}){
    difficulty=difficulty==='standard'?'challenge':DIFFICULTIES[difficulty]?difficulty:'relaxed';
    const rng=random(seed),arena=ARENAS[arenaIndex],diff=DIFFICULTIES[difficulty],tasks=makeTasks(unit,difficulty,arenaIndex,rng),obstacles=[];
    // Sparse moving traffic; stationary driving challenges belong to the open
    // intervals between generous task approaches, never inside answer lanes.
    const patterns=[],speed=8+arenaIndex*2,reactionTime={relaxed:2.3,challenge:1.6}[difficulty];
    const patternSpacing=(difficulty==='relaxed'?[66,48,44]:[58,46,42])[arenaIndex];let escape=0;
    const types=['cones','barrier','crates','pothole','barrels','fallen_branch',...(arenaIndex>0?['tire_stack','road_panels']:[]),...(arenaIndex===2?['rockfall']:[])];
    for(let i=0;i<=tasks.length;i++){
      // Preserve the full reading approach, fork merge and guided departure.
      const previous=tasks[i-1],next=tasks[i],start=previous?taskZone(previous).end+80:60,end=next?taskZone(next).start-120:arena.length-60;
      if(end-start<65)continue;
      escape=shuffle([-1,0,1].filter(l=>Math.abs(l-escape)<=1),rng)[0];
      const span=end-start-32,rows=1+Math.floor(span/patternSpacing);let blocked=[];
      for(let k=0;k<rows;k++){
        // Two-row beats let a driver read the gap, settle and move again.
        // Adjacent gaps prevent a sudden left-to-right demand at full Nitro.
        const oldEscape=escape,turn=k>0&&k%2===0;
        if(turn)escape=shuffle([-1,0,1].filter(l=>Math.abs(l-escape)===1),rng)[0];
        blocked=shuffle([-1,0,1].filter(l=>l!==escape),rng);
        if(turn)blocked.sort((a,b)=>(b===oldEscape)-(a===oldEscape));
        const at=rows===1?end-16:start+16+k*span/(rows-1),paired=k===0||turn||rng()<(difficulty==='relaxed'?[.35,.5,.6]:[.55,.68,.8])[arenaIndex];
        const pattern={id:patterns.length,sequenceId:i,entry:k===0,beatIndex:Math.floor(k/2),at,escapeLane:escape,turn,kind:paired?'pair':'single',obstacleIds:[]};patterns.push(pattern);
        for(let j=0;j<(paired?2:1);j++){
          const type=types[(i*3+k+arenaIndex+j*2)%types.length],id=obstacles.length,lane=blocked[j];
          obstacles.push({id,patternId:pattern.id,at,lane,lanePos:lane,type,speed:0,cruiseSpeed:0,passed:false,hit:false,halfLength:type==='pothole'?2:1.6,halfWidth:type==='rockfall'?1.3:1.2});pattern.obstacleIds.push(id);
        }
      }
      if(i%4===2){const lane=blocked[0],id=obstacles.length;obstacles.push({id,patternId:-1,at:end+8,lane,lanePos:lane,type:'traffic',speed,cruiseSpeed:speed,waiting:false,braking:false,color:Math.floor(rng()*5),passed:false,hit:false,moving:false,fromLane:lane,target:lane,changed:false,laneProgress:0});}
    }
    const initialTime=arena.length/arena.speed+diff.extra+tasks.filter(t=>t.kind==='pedestrian').length*6,raceFuel=clamp(Number(settings.fuel)||0,0,100);
    const rivals=settings.rivals===false?[]:['Cobalt','Ember'].map((name,i)=>{const profile=RIVAL_PROFILES[difficulty][i];return {id:i,name,halfWidth:1.1,halfLength:2.3,color:i?0xe57b75:0x68bbd0,at:12+i*12,lane:i?1:-1,lanePos:i?1:-1,speed:arena.speed,profile,basePace:Math.min(REGULAR_MAX_SPEED,profile.pace+arenaIndex*.025),thinkTime:profile.think,nextTask:0,reading:null,route:null,braking:false,finishedAt:null,decisions:tasks.map(()=>rng()<profile.accuracy),fuel:Math.min(raceFuel,profile.fuel+arenaIndex*10),streak:0,nitro:0,nitroLevel:0,nitroActive:false,nitroUses:0,lastNitroAt:-Infinity,plannedLane:null,signalAt:0,nextLaneChangeAt:0,laneChanges:0};});
    const s= {unit,difficulty,arenaIndex,arena,diff,rng,tasks,obstacles,patterns,patternSpacing,reactionTime,rivals,distance:0,roadTravel:0,time:initialTime,initialTime,lane:0,taskIndex:0,task:null,status:'countdown',countdown:3,invulnerable:0,slow:0,boost:0,resolve:0,correct:0,collisions:0,damage:0,damageContacts:[],lastImpact:null,impactRecovery:0,breakdown:null,failureReason:null,review:(settings.reviews||[]).filter(i=>!i.recovered).map(i=>({...i})),notice:null,elapsed:0,steered:false,speedFactor:1,worldTimeScale:1,focusAmount:0,focusAuto:null,clockFactor:1,lastPass:null,detour:0,accelerating:false,accelerationHeld:false,yielding:null,followingTraffic:false,crosswalkQueue:null,exitTask:null,fuel:raceFuel,streak:0,bestStreak:0,nitro:0,nitroLevel:0,nitroActive:false,nitroHeld:false,nitroUses:0,lastNitroAt:-Infinity,answerEvents:[],pendingReview:[],route:null,routeHistory:[],taskRevision:0,learningRecovery:0,reviewLap:false};
    if(s.review.length){const replacement=alternateReview(unit,s.review[0],rng);if(replacement){s.tasks[0]=placeReview(replacement,s.tasks[0].at);s.review[0].scheduled=true;}s.pendingReview=s.review.slice(1);scheduleReview(s);}
    return s;
  }
  function currentRow(s){return s.task?.rows[s.task.rowIndex]||null;}
  function learningKey(t){return t.learningKey||(t.kind==='repair'?'sentence:'+(t.sourceId||t.id):t.type==='grammar'?'grammar:'+(t.sourceId||t.id):'word:'+t.answer.toLowerCase());}
  function recordAnswer(s,key,firstTry,answer){
    s.answerEvents.push({key,firstTry,answer});
    if(!firstTry){s.streak=0;return;}
    s.streak++;s.bestStreak=Math.max(s.bestStreak,s.streak);s.fuel=Math.min(100,s.fuel+10);
    if(s.streak%3===0){s.fuel=Math.min(100,s.fuel+5);s.streakFlash=s.elapsed;}
  }
  function canNitro(s){return !!s&&!focusCruise(s)&&['driving','resolving'].includes(s.status)&&s.fuel>=NITRO_COST&&(s.nitro<=0||(s.nitroLevel||1)<NITRO_MAX_STACKS)&&!s.yielding&&!exitAssist(s)&&s.slow<=0;}
  function canEngageNitro(s){return !!s&&!focusCruise(s)&&['driving','resolving'].includes(s.status)&&!s.yielding&&!exitAssist(s)&&s.slow<=0&&(s.nitro>0||canNitro(s));}
  function laneChoice(t){return ['light','junction'].includes(t?.kind);}
  function focusCruise(s){return !!s&&['task','resolving'].includes(s.status)&&(!!s.focusAuto||s.status==='task'&&!s.task?.completed&&!s.task?.focusDone&&(['repair','pedestrian'].includes(s.task?.kind)||laneChoice(s.task)&&s.distance>=s.task.at-CHOICE_FOCUS_DISTANCE));}
  function steeringLocked(s){return focusCruise(s)&&!laneChoice(s.task);}
  function repairCruise(s){return focusCruise(s)&&s.task?.kind==='repair';}
  function canShortenFocus(s){return focusCruise(s)&&(s.focusAuto?.returning!=null||s.status==='task'&&laneChoice(s.task)&&s.task.focusLane===s.lane);}
  function beginFocusCruise(s){
    if(s.focusAuto?.taskId===s.task.id)return s.focusAuto;
    const entrySpeed=clamp(s.speedFactor,0,MAX_SPEED);
    s.focusAuto={taskId:s.task.id,kind:s.task.kind,entrySpeed,lane:s.task.kind==='pedestrian'?0:s.lane,age:0,scale:Math.min(.18,(s.difficulty==='relaxed'?3.6:4.2)/Math.max(1,s.arena.speed*entrySpeed)),returning:null};
    s.accelerating=false;s.nitroHeld=false;s.nitroActive=false;return s.focusAuto;
  }
  function returnFocusCruise(s,auto){if(auto.returning!=null)return;auto.returning=0;auto.returnScale=s.worldTimeScale??1;auto.returnFocus=s.focusAmount||0;}
  function setNitroHeld(s,active){if(!s)return false;s.nitroHeld=!!active&&!focusCruise(s)&&['driving','task','resolving'].includes(s.status);if(!s.nitroHeld&&(!s.accelerating||s.accelerationUsesNitro===false))s.nitroActive=false;return s.nitroHeld;}
  function engageNitro(s){if(!canEngageNitro(s))return false;if(s.nitro<=0&&!activateNitro(s))return false;setNitroHeld(s,true);return true;}
  function addNitro(actor,time){const live=actor.nitro>0;actor.fuel-=NITRO_COST;actor.nitroLevel=live?Math.min(NITRO_MAX_STACKS,(actor.nitroLevel||1)+1):1;actor.nitro=Math.min(NITRO_DURATION*NITRO_MAX_STACKS,(live?actor.nitro:0)+NITRO_DURATION);actor.nitroUses++;actor.lastNitroAt=time;}
  function nitroSpeed(level=1){return Math.min(MAX_SPEED,2.65+Math.max(0,level-1)*.4);}
  function activateNitro(s){if(!canNitro(s))return false;addNitro(s,s.elapsed);s.notice={type:'nitro',text:s.nitroLevel===3?'MAX CHARGE · HOLD TO BOOST':s.nitroLevel===2?'DOUBLE CHARGE · HOLD TO BOOST':'NITRO LOADED · HOLD TO BOOST',level:s.nitroLevel};return true;}
  function makeRoute(s,t,index,shortcut){
    const next=s.tasks.find(q=>q.at>t.at),span=Math.max(35,Math.min(90,(next?.at??s.arena.length)-t.at-70));
    return {id:t.id+'-route-exit',taskId:t.id,start:t.at,end:t.at+span,exitEndAt:t.at+span+36,lane:index-1,shortcut,extra:shortcut?-18:32,ratio:(span+(shortcut?-18:32))/span,amplitude:(index-1)*(shortcut?5:11),startedAt:s.elapsed};
  }
  function routeOffset(route,at){if(!route||at<route.start||at>route.end)return 0;const p=clamp((at-route.start)/(route.end-route.start),0,1);const envelope=Math.sin(p*Math.PI);return route.amplitude*envelope*envelope*envelope+(route.lane===0&&!route.shortcut?3*Math.sin(p*Math.PI*2)*envelope*envelope:0);}
  function alternateReview(unit,item,rng){
    const reviewSource=root.MATCH_BANK[unit.id].find(x=>x.id===item.id.replace(/(?:-review)+$/,''));
    // An inverse translation review answers in Turkish. Repeating that miss
    // must still look up its original English learning item.
    let t,word=item.kind==='pedestrian'?item.prompt:item.type==='review'&&reviewSource?.type==='translation'?reviewSource.answer:item.answer;
    const reviewedClues={g6u7d5:'Choose the waste container marked for recycling paper, cans and bottles.',g6u10d4:'My mouth is dry and I need water. I feel ___.',g6u10d5:'It is midnight and I can barely keep my eyes open. I feel ___.',g7u3d1:'A writer tells the story of their own childhood and life. Which book is it?',g7u3d2:'A journalist writes a book about another person’s life. Which book is it?',g7u9d6:'Which waste container has a recycling symbol and collects paper and cans?',g8u8d4:'I am a basket used to collect clothes that need washing. What am I?'};
    if(item.kind==='repair'&&item.blocks){let order=shuffle([0,1,2],rng);if(order.every((v,i)=>v===i))order.push(order.shift());t={kind:'repair',blocks:item.blocks.slice(),order,answer:item.blocks.join(' '),prompt:item.tr?'Build the English sentence: '+item.tr:'Reconnect this sentence from its meaning.',tr:item.tr,chosen:[],connection:[],solved:false};}
    else if(item.type==='question'&&root.MATCH_BANK[unit.id].some(x=>x.type==='question'&&x.id===item.id.replace(/(?:-review)+$/,''))){
      const original=root.MATCH_BANK[unit.id].find(x=>x.id===item.id.replace(/(?:-review)+$/,''));if(!original?.reviewPrompt)return null;
      const options=shuffle(original.options,rng);
      t={kind:'light',type:'question',prompt:original.reviewPrompt,options,answer:original.answer,correctIndex:options.indexOf(original.answer),tr:original.tr};
    }
    else if(item.type==='grammar'){
      const original=root.MATCH_BANK[unit.id].find(x=>x.id===item.id.replace(/(?:-review)+$/,''));if(!original)return null;
      const sentence=original.prompt.replace(/^(GRAMMAR|PAST TENSE):\s*/,'').replace(/^\([^)]*\)\s*/,'');
      const options=shuffle(original.options.map(option=>sentence.replace(/_{2,}/,option)),rng),answer=sentence.replace(/_{2,}/,original.answer);
      t={kind:'light',type:'grammar',prompt:/^PAST TENSE:/.test(original.prompt)?'Choose the sentence in the past tense.':'Choose the correct English sentence.',options,answer,correctIndex:options.indexOf(answer),tr:item.tr};
    }else{
      const bank=root.MATCH_BANK[unit.id],alternative=bank.find(x=>x.answer.toLowerCase()===word.toLowerCase()&&x.prompt!==item.prompt&&x.type!=='grammar');
      if(alternative){const options=shuffle(alternative.options||[alternative.answer,...shuffle(alternative.decoys,rng).slice(0,2)],rng);t={kind:'light',type:alternative.type,prompt:alternative.prompt,options,answer:alternative.answer,correctIndex:options.indexOf(alternative.answer),tr:alternative.tr};}
      else{
        const category=unit.categories.find(c=>c.yes.some(w=>w.toLowerCase()===word.toLowerCase())),translation=unit.translations.find(w=>w.en.toLowerCase()===word.toLowerCase()),picture=unit.pictures.find(w=>w.word.toLowerCase()===word.toLowerCase());
        let prompt,decoys,answer=word;
        if(category){prompt='Which word belongs to '+category.title.toLowerCase()+'?';decoys=shuffle(category.no.filter(w=>!category.yes.includes(w)),rng).slice(0,2);}
        else if(picture){prompt='Object clue: '+picture.drawing.replace(new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'),'this item');decoys=shuffle(unit.translations.filter(w=>w.en.toLowerCase()!==word.toLowerCase()).map(w=>w.en),rng).slice(0,2);}
        else if(translation){const card=bank.find(x=>x.type==='translation'&&x.answer.toLowerCase()===word.toLowerCase());prompt='What does “'+word+'” mean in Turkish?';answer=translation.tr;decoys=shuffle(distinct(unit.translations.filter(w=>w.tr!==answer&&(!card?.decoys||card.decoys.includes(w.en))).map(w=>w.tr)),rng).slice(0,2);}
        else {const original=bank.find(x=>x.id===item.id.replace(/(?:-review)+$/,'')),clue=original?.reviewPrompt||reviewedClues[original?.id];if(!original||!clue)return null;prompt=clue;decoys=original.options.filter(w=>w!==original.answer);}
        const options=shuffle([answer,...decoys],rng);t={kind:'light',type:'review',prompt,answer,options,correctIndex:options.indexOf(answer),tr:item.tr};
      }
    }
    return {...t,id:item.id+'-review',reviewOf:item.id,learningKey:item.learningKey||(item.kind==='pedestrian'?'word:'+word.toLowerCase():item.type==='grammar'?'grammar:'+item.id:'word:'+word.toLowerCase()),attempts:0,rowIndex:0,success:null,completed:false};
  }
  function placeReview(t,at){t.at=at;t.rows=[{at:at+(t.kind==='repair'?12:0),options:t.kind==='repair'?t.order.map(i=>t.blocks[i]):t.options,answer:t.answer,correctIndex:t.correctIndex??null}];t.endAt=t.rows[0].at;return t;}
  function scheduleReview(s){
    if(s.reviewLap||!s.pendingReview.length)return;
    // Only replace gates beyond the shared 3D visibility range, plus a margin.
    const index=s.tasks.findIndex((t,i)=>i>s.taskIndex&&t.kind==='light'&&!t.reviewOf&&t.at-s.distance>TASK_VIEW_DISTANCE+40);
    if(index<0)return;const item=s.pendingReview.shift(),t=alternateReview(s.unit,item,s.rng);
    if(t){s.tasks[index]=placeReview(t,s.tasks[index].at);s.taskRevision++;item.scheduled=true;}
  }
  function createReviewLap(unit,items,difficulty='relaxed',seed=Date.now(),settings={}){
    const s=createRace(unit,difficulty,0,seed,{...settings,rivals:false});s.reviewLap=true;s.tasks=[...new Map(items.filter(i=>!i.recovered).map(i=>[i.learningKey||i.id,i])).values()].slice(0,6).map(i=>alternateReview(unit,i,s.rng)).filter(Boolean).map((t,i)=>placeReview(t,120+i*145));
    s.review=items.filter(i=>!i.recovered).map(i=>({...i}));s.arena={...s.arena,id:'review',name:'Review Loop',length:(s.tasks.at(-1)?.endAt??120)+100,checkpoints:s.tasks.length};s.obstacles=[];s.patterns=[];s.rivals=[];s.time=s.initialTime=s.arena.length/s.arena.speed+45+s.tasks.length*15;return s;
  }
  function raceFailed(s){return !!s&&(['failed','breakdown'].includes(s.status)||!!s.failureReason||!!s.breakdown||(s.damage||0)>=DAMAGE_LIMIT);}
  function raceSucceeded(s){return !!s&&s.status==='finished'&&!raceFailed(s)&&s.distance>=s.arena.length;}
  function raceOrder(s){const dnf=raceFailed(s),racers=[{id:'player',name:'YOU',at:s.distance,finishedAt:dnf?null:s.finishedAt,dnf},...s.rivals];return racers.sort((a,b)=>!!a.dnf!==!!b.dnf?(a.dnf?1:-1):a.finishedAt!=null&&b.finishedAt!=null?a.finishedAt-b.finishedAt:a.finishedAt!=null?-1:b.finishedAt!=null?1:b.at-a.at||String(a.id).localeCompare(String(b.id)));}
  function taskZone(t){return {id:t.id,start:t.at-100,end:t.kind==='junction'?t.at+150:t.kind==='pedestrian'?t.at+84:t.kind==='repair'?t.endAt+48:t.at+48,task:t};}
  function taskRoadZone(s,at){return s.tasks.map(taskZone).find(z=>at>=z.start-70&&at<=z.end+25);}
  const roadCache=new WeakMap();
  function roadCourse(s){
    let c=roadCache.get(s);if(c?.tasks===s.tasks&&c.revision===s.taskRevision)return c;
    c={tasks:s.tasks,revision:s.taskRevision,zones:s.tasks.map(taskZone),forks:s.tasks.filter(t=>t.kind==='junction').map(t=>[0,1,2].map(i=>makeRoute(s,t,i,i===t.correctIndex)))};roadCache.set(s,c);return c;
  }
  const smoothRoad=t=>{t=clamp(t,0,1);return t*t*t*(10+t*(-15+6*t));};
  function apronWidth(s,at){let width=5.4;for(const z of roadCourse(s).zones)width=Math.max(width,5.4+6.15*Math.min(smoothRoad((at-z.start+70)/40),smoothRoad((z.end+80-at)/55)));return width;}
  // Cross sections are relative to the road centre, including the visible
  // three-way asphalt. Car bodies, rather than just lane targets, stay inside.
  function roadSpans(s,at){
    const routes=roadCourse(s).forks.find(rs=>at>=rs[0].start-30&&at<=rs[0].end+40);
    if(!routes){const width=apronWidth(s,at);return [[-width,width]];}
    const r=routes[0];let centers,half;
    if(at<r.start){centers=[-3.35,0,3.35];half=8.2-2.8*smoothRoad((at-r.start+30)/30);}
    else if(at>r.end){centers=[-3.35,0,3.35];half=5.4+2.8*smoothRoad((at-r.end)/40);}
    else{centers=routes.map(r=>r.lane*3.35+routeOffset(r,at));half=5.4;}
    const spans=centers.map(x=>[x-half,x+half]).sort((a,b)=>a[0]-b[0]),union=[];
    for(const span of spans){const last=union.at(-1);if(last&&span[0]<=last[1])last[1]=Math.max(last[1],span[1]);else union.push(span);}return union;
  }
  function vehicleOnRoad(s,body,at=body.at,lane=body.lanePos??body.lane){
    const centre=p=>courseCurve(s.arenaIndex,p)+routeOffset(body.route,p),slope=(centre(at+.1)-centre(at-.1))/.2;
    const x=lane*3.35+(body.passingOffset||0)+routeOffset(body.route,at),half=(body.halfWidth??1.25)+.42;
    return [-2.3,0,2.3].every(d=>{const edgeX=x+d*slope+courseCurve(s.arenaIndex,at)-courseCurve(s.arenaIndex,at+d);return roadSpans(s,at+d).some(([left,right])=>edgeX-half>=left&&edgeX+half<=right);});
  }
  function courseCurve(index,at){const amount=[3,7,9][index]||3;return Math.sin(at/145)*amount+Math.sin(at/320)*amount*.5;}
  function actorX(s,o,lane=o.lanePos??o.lane,at=o.at){return courseCurve(s.arenaIndex,at)+routeOffset(o.route,at)+(o.passingOffset||0)+lane*3.35;}
  function playerBody(s,physicalLane){return {id:'player',at:s.distance,lanePos:physicalLane,route:s.route,speed:s.arena.speed*s.speedFactor*(s.worldTimeScale??1),halfLength:2.3,halfWidth:1.25};}
  function actors(s,physicalLane){return [...s.obstacles,...s.rivals,playerBody(s,physicalLane)];}
  function sameRoadSpace(s,a,b){const width=(a.halfWidth??1.25)+(b.halfWidth??1.25)+.2;return Math.abs(actorX(s,a,a.lanePos??a.lane,b.at)-actorX(s,b))<width;}
  function openRoadDriving(s){return s.status==='driving'&&!s.route&&!learningPaceProtected(s)&&(s.accelerationHeld||s.accelerating||s.nitroHeld&&s.nitro>0);}
  function contactDistance(body,o){return (body.halfLength??2.3)+(o.halfLength??2.3)+.25;}
  function laneStepBlocker(s,body,from,to,physicalLane){
    const x0=actorX(s,body,from),x1=actorX(s,body,to),half=body.halfWidth??1.25;
    return actors(s,physicalLane).find(o=>{
      const length=body.id==='player'?(body.halfLength??2.3)+(o.halfLength??2.3)+.1:6;
      if(o===body||o.id==='player'&&body.id==='player'||Math.abs(o.at-body.at)>length)return false;
      const ox=actorX(s,o),otherHalf=o.halfWidth??1.25,fromGap=x0-ox,toGap=x1-ox;
      // A car already inside the extra safety margin may steer away. The
      // complete movement must stay on the same side and increase separation.
      if(Math.abs(fromGap)>=half+otherHalf&&fromGap*toGap>0&&Math.abs(toGap)>Math.abs(fromGap)+1e-8)return false;
      return !(Math.max(x0,x1)+half+.2<ox-otherHalf||Math.min(x0,x1)-half-.2>ox+otherHalf);
    })||null;
  }
  function laneStepClear(s,body,from,to,physicalLane){
    return (body.id==='player'||vehicleOnRoad(s,body,body.at,to))&&!laneStepBlocker(s,body,from,to,physicalLane);
  }
  function guideRouteLane(s,physicalLane){
    if(!s.route)return;
    const centre=s.route.lane,body=playerBody(s,physicalLane);
    const near=s.rivals.filter(r=>r.route?.taskId===s.route.taskId&&Math.abs(r.at-s.distance)<18);
    const clearance=lane=>Math.min(Infinity,...near.map(r=>Math.abs(actorX(s,body,lane)-actorX(s,r))));
    let target=centre;
    if(near.length&&clearance(centre)<3.5){
      const options=[centre,clamp(centre-.3,-1,1),clamp(centre+.3,-1,1)].filter(l=>playerLaneClear(s,physicalLane,l)&&vehicleOnRoad(s,body,s.distance,l));
      if(options.length)target=options.sort((a,b)=>clearance(b)-clearance(a))[0];
    }
    // Make room within the selected branch; the answer and route never change.
    if(playerLaneClear(s,physicalLane,target))s.lane=target;
  }
  function safeForwardTravel(s,body,travel,physicalLane){
    if(travel<=0)return 0;const others=actors(s,physicalLane).filter(o=>o!==body&&!(o.id==='player'&&body.id==='player'));
    const clear=at=>(body.id==='player'||vehicleOnRoad(s,body,at))&&others.every(o=>{
      const length=body.id==='player'&&openRoadDriving(s)?contactDistance(body,o)-.001:Math.max(6,(body.halfLength??2.3)+(o.halfLength??2.3)+.65);
      if(Math.abs(o.at-at)>length)return true;
      // A contacted leader may leave the extra following margin. Requiring
      // a complete 6 m gap first locks small high-frame-rate steps in place.
      const physical=(body.halfLength??2.3)+(o.halfLength??2.3)+.2;
      if(body.at-o.at>=physical&&at>body.at)return true;
      return Math.abs(actorX(s,body,body.lanePos??body.lane,at)-actorX(s,o))>(body.halfWidth??1.25)+(o.halfWidth??1.25)+.15;
    });
    let safe=0;const steps=Math.max(1,Math.ceil(travel/3));
    for(let step=1;step<=steps;step++){const distance=travel*step/steps;if(clear(body.at+distance)){safe=distance;continue;}let lo=safe,hi=distance;for(let i=0;i<16;i++){const mid=(lo+hi)/2;if(clear(body.at+mid))lo=mid;else hi=mid;}return lo;}return travel;
  }
  function playerLaneClear(s,from,to){return laneStepClear(s,playerBody(s,from),from,to,from);}
  function playerLaneBlocker(s,from,to){return laneStepBlocker(s,playerBody(s,from),from,to,from);}
  function mergingAcross(s,body,o){
    if(o.type!=='traffic'||Math.abs(o.target)>1||!o.changed||!(o.laneProgress<1&&(o.laneProgress>0||o.yieldForPlayer!=null)))return false;
    // Reserve the remaining sweep of a committed merge. A following rival
    // must leave its gap before the merging car reaches the lane centre.
    const x=actorX(s,body,body.lanePos??body.lane,o.at),from=actorX(s,o),to=actorX(s,o,o.target),width=(body.halfWidth??1.25)+(o.halfWidth??1.25)+.2;
    return x>=Math.min(from,to)-width&&x<=Math.max(from,to)+width;
  }
  function forwardSpace(s,body,physicalLane){
    let limit=Infinity,ceiling=Infinity,blocker=null;
    for(const o of actors(s,physicalLane))if(o!==body&&!(o.id==='player'&&body.id==='player')&&o.at>body.at+.001&&(sameRoadSpace(s,body,o)||mergingAcross(s,body,o))){
      const impact=body.id==='player'&&openRoadDriving(s),rear=o.at-(impact?contactDistance(body,o):Math.max(VEHICLE_GAP,(body.halfLength??2.3)+(o.halfLength??2.3)+.8)),gap=Math.max(0,rear-body.at);
      if(rear<limit){limit=rear;blocker=o;}
      // Open-road contacts are driving decisions. Brake assistance belongs
      // to crossings and task cruise, rather than the whole road.
      if(!impact)ceiling=Math.min(ceiling,(o.speed||0)+Math.sqrt(2*18*gap));
    }
    return {limit,ceiling,blocker};
  }
  function carCondition(s){const damage=clamp(s?.damage||0,0,DAMAGE_LIMIT);return {damage,remaining:DAMAGE_LIMIT-damage,critical:damage===DAMAGE_LIMIT-1,broken:damage===DAMAGE_LIMIT};}
  function stopInputs(s){s.accelerationHeld=false;s.accelerating=false;s.nitroHeld=false;s.nitroActive=false;}
  function contactBump(s,source=null){
    if(!s||s.status!=='driving'||s.route||learningPaceProtected(s))return false;
    // A contact remains latched until the two bodies separate. Protection
    // also latches a new scrape, so it cannot become a delayed extra strike.
    if(source){if(s.damageContacts.includes(source))return false;s.damageContacts.push(source);}
    if(s.invulnerable>0)return false;
    s.collisions++;s.damage=Math.min(DAMAGE_LIMIT,s.damage+1);
    s.lastImpact={at:s.elapsed,damage:s.damage};
    if(source){source.hit=true;source.hitAt=s.elapsed;}
    s.time=Math.max(0,s.time-s.diff.penalty);s.slow=3;s.impactRecovery=IMPACT_RECOVERY;s.invulnerable=COLLISION_GRACE[s.difficulty];s.nitroActive=false;
    s.speedFactor=Math.min(s.speedFactor,.55);
    if(s.damage===DAMAGE_LIMIT){
      s.status='breakdown';s.failureReason='breakdown';s.finishedAt=null;s.breakdown={age:0,entrySpeed:s.speedFactor,duration:BREAKDOWN_DURATION};s.worldTimeScale=1;s.focusAmount=0;stopInputs(s);
      s.notice={type:'breakdown',text:'Car broken down · three hits'};
    }else s.notice={type:'collision',text:s.damage===2?'Critical · one hit left':'Car damaged · two hits left'};
    return true;
  }
  function tickBreakdown(s,dt,physicalLane){
    const b=s.breakdown;b.age=Math.min(b.duration,b.age+dt);s.elapsed+=dt;
    s.speedFactor=b.entrySpeed*Math.pow(1-b.age/b.duration,3);
    const before=s.distance,travel=safeForwardTravel(s,playerBody(s,physicalLane),s.arena.speed*s.speedFactor*dt,physicalLane);
    // Coasting to a stop never turns a third strike into a finish-line win.
    s.distance=Math.min(s.arena.length-.001,s.distance+travel);s.roadTravel+=s.distance-before;
    updateTraffic(s,dt,before,physicalLane,false,dt);updateRivals(s,dt,physicalLane,null,dt);
    if(b.age>=b.duration){s.speedFactor=0;s.status='failed';}
  }
  function qClearanceEnd(q){return q.at+16.2+1e-6;}
  function vehicleClearingCrosswalk(s,body){return s.tasks.find(q=>q.kind==='pedestrian'&&q.activatedAt!=null&&body.at+2.2>q.at-12&&body.at-2.2<q.at+14);}
  // Mandatory English time is neutral even when a player holds the throttle.
  // Correct exits also cover the brief acceleration back to open-road pace.
  function learningPaceProtected(s){return !!s&&(!!s.yielding||!!exitAssist(s)||s.status==='task'||focusCruise(s)||s.learningRecovery>0||s.status==='resolving'&&s.task?.answeredRight&&!s.route);}
  function updateRivals(s,worldDt,physicalLane,protectedTravel=null,realDt=worldDt){
    const traffic=s.obstacles;
    for(const r of s.rivals){
      // A vehicle already on the stripes clears before visitors can enter.
      const clearing=vehicleClearingCrosswalk(s,r),dt=clearing?realDt:worldDt;
      if(r.finishedAt!=null){r.nitroActive=false;const space=forwardSpace(s,r,physicalLane);r.speed+=(s.arena.speed-r.speed)*(1-Math.exp(-dt*2));r.at+=safeForwardTravel(s,r,Math.min(Math.max(0,space.limit-r.at),Math.max(0,r.speed)*dt),physicalLane);continue;}
      const profile=r.profile,t=s.tasks[r.nextTask],preparingFork=!r.route&&t?.kind==='junction'&&r.at<t.at&&r.at>t.at-220,forkIndex=preparingFork?(r.decisions[r.nextTask]?t.correctIndex:(t.correctIndex+1)%3):null,forkLane=preparingFork?forkIndex-1:null,forkSide=preparingFork?(Math.sign(forkLane)||-Math.sign(t.correctIndex-1)||(r.id?1:-1)):0;
      if(r.route&&r.at>=r.route.end)r.route=null;
      const playerRoute=s.route||s.mergeAssist,passSide=r.route?(r.route.lane||((playerRoute?.taskId===r.route.taskId&&playerRoute.lane)?-Math.sign(playerRoute.lane):r.id?1:-1)):0;
      const passing=(r.passingOffset||0)+((r.route?passSide*3.2:0)-(r.passingOffset||0))*(1-Math.exp(-dt*10));const oldPassing=r.passingOffset||0;r.passingOffset=passing;if(!laneStepClear(s,r,r.lanePos,r.lanePos,physicalLane))r.passingOffset=oldPassing;
      if(t&&!r.reading&&r.at>=t.at-(t.kind==='junction'?110:70))r.reading={task:t,startedAt:s.elapsed};
      const late=r.at>s.arena.length*.8,pace=Math.min(REGULAR_MAX_SPEED,r.basePace+(late?profile.push:0));
      let desired=s.arena.speed*pace,stopAt=Infinity,routeLane=null;
      if(r.reading){
        const q=r.reading.task,occupied=q.kind==='pedestrian'&&r.at<=q.stopAt&&crosswalkOccupied(s,q);
        const wait=q.kind==='pedestrian'?Math.max(3,profile.think*1.5):r.thinkTime;
        if(s.elapsed-r.reading.startedAt<wait&&(q.kind!=='pedestrian'||r.at<=q.stopAt)||occupied){desired=s.arena.speed*profile.readPace;stopAt=q.kind==='pedestrian'?q.stopAt:q.at-4;}
        else {
          let right=r.decisions[r.nextTask]??true,index=right?q.correctIndex:(q.correctIndex+1)%3;
          if(q.kind==='junction')routeLane=index-1;
          if(r.at>=q.at){
            // A late blocked turn takes the reachable branch. Two drivers
            // must not cross through each other after the fork has begun.
            if(q.kind==='junction'&&!laneStepClear(s,r,r.lanePos,index-1,physicalLane)){
              index=Math.abs(r.lanePos)>.2?Math.sign(r.lanePos)+1:1;right=index===q.correctIndex;
            }
            if(right){const count=q.kind==='pedestrian'?4:1;for(let j=0;j<count;j++){r.streak++;r.fuel=Math.min(100,r.fuel+10+(r.streak%3===0?5:0));}}else r.streak=0;
            if(q.kind==='junction'){r.route=makeRoute(s,q,index,right);r.lane=r.route.lane;r.plannedLane=null;}
            r.nextTask++;r.reading=null;
          }
        }
      }
      const crossings=s.tasks.filter(q=>crosswalkOccupied(s,q)&&r.at<=q.stopAt);
      for(const q of crossings)stopAt=Math.min(stopAt,q.stopAt);
      const bodies=[...traffic,...s.rivals.filter(q=>q!==r)];
      const playerNear=Math.abs(r.at-s.distance)<32;
      const footprint=(o,l)=>Math.abs((o.lanePos??o.lane)-l)<.9||o.changed&&o.laneProgress<1&&Math.abs(o.target-l)<.9;
      const clear=l=>bodies.every(o=>Math.abs(o.at-r.at)>16||!footprint(o,l))&&(!playerNear||s.distance-r.at>18||Math.abs(l-physicalLane)>.9&&Math.abs(l-s.lane)>.9);
      // Evaluate the road ahead and relative closing speeds, rather than waiting
      // until a slow car is immediately in front. Preserve a clear player lane.
      const forecastSpeed=Math.max(r.speed,s.arena.speed*(r.fuel>=NITRO_COST||r.nitro>0?profile.burst:pace));
      const horizon=Math.max(55,forecastSpeed*profile.lookAhead),score=l=>{
        let seconds=profile.lookAhead+2;
        for(const o of bodies)if(o.at>r.at&&o.at-r.at<horizon&&footprint(o,l))seconds=Math.min(seconds,(o.at-r.at-10)/Math.max(1,forecastSpeed-(o.speed||0)));
        if(s.distance>r.at&&s.distance-r.at<horizon&&Math.abs(l-physicalLane)<.9)seconds=Math.min(seconds,(s.distance-r.at-12)/Math.max(1,forecastSpeed-s.arena.speed*s.speedFactor));
        return seconds-Math.abs(l-r.lanePos)*.28;
      };
      if(preparingFork)routeLane=r.lane+Math.sign((forkSide>0?1:-1)-r.lane);
      const shoulder=!r.route&&s.tasks.map(taskZone).find(z=>s.distance>=z.start-(z.task.kind==='pedestrian'?60:35)&&s.distance<=z.end&&r.at>=z.start-70&&r.at<=z.end+25);
      if(shoulder){
        const naturalSide=Math.sign(r.lanePos*3.35+(r.passingOffset||0))||(r.id?1:-1);
        let target=(preparingFork&&shoulder.task.kind==='junction'?forkSide:naturalSide)*2.05;
        // Side-by-side rivals must stagger before swapping fork shoulders.
        // Forcing both across each other's bodies can lock an entire approach.
        const peer=preparingFork&&s.rivals.find(o=>o!==r&&Math.abs(o.at-r.at)<14&&o.lanePos>Math.min(r.lanePos,target)&&o.lanePos<Math.max(r.lanePos,target));
        if(peer){target=naturalSide*2.05;if(r.id>peer.id)stopAt=Math.min(stopAt,r.at);}
        // A car overtaking on one side must leave the player room to leave.
        // Use the clear shoulder instead of trying to sweep across their body.
        if(!laneStepClear(s,r,r.lanePos,target,physicalLane)&&laneStepClear(s,r,r.lanePos,-target,physicalLane))target=-target;
        if(r.lane!==target)r.laneChanges++;r.lane=target;r.plannedLane=r.lane;
      }
      // A shoulder is temporary. The old adjacent-lane filter could not
      // reach lane 1 from 2.05, leaving cars outside the next narrow section.
      if(!r.route&&!shoulder&&Math.abs(r.lane)>1){r.lane=clamp(r.lane,-1,1);r.plannedLane=r.lane;r.laneChanges++;}
      if(!r.route&&!shoulder){
        const pattern=s.patterns.find(p=>p.at>r.at&&p.at-r.at<Math.max(160,horizon)&&s.obstacles.some(o=>o.patternId===p.id&&o.type!=='traffic'));
        const mergingPeer=pattern&&Math.abs(r.lanePos-pattern.escapeLane)>.3&&s.rivals.find(o=>o!==r&&Math.abs(o.at-r.at)<14&&(Math.abs(o.lanePos-pattern.escapeLane)<.3||(o.lane===pattern.escapeLane||o.plannedLane===pattern.escapeLane)&&o.id<r.id));
        const escapeLane=pattern&&clear(pattern.escapeLane)&&laneStepClear(s,r,r.lanePos,pattern.escapeLane,physicalLane)?pattern.escapeLane:null;
        // Reserve a single-file opening before two cars squeeze into it.
        // One driver eases off and holds their side until the first is clear.
        if(mergingPeer){desired=Math.min(desired,s.arena.speed*.55);r.lane=[-1,0,1].filter(l=>l!==pattern.escapeLane).sort((a,b)=>Math.abs(a-r.lanePos)-Math.abs(b-r.lanePos))[0];r.plannedLane=null;}
        const options=[-1,0,1].filter(l=>Math.abs(l-r.lane)<=1&&clear(l)).sort((a,b)=>score(b)-score(a)),best=mergingPeer?r.lane:escapeLane??(routeLane!=null&&Math.abs(routeLane-r.lane)<=1&&clear(routeLane)?routeLane:options[0]);
        if(best!=null&&best!==r.lane&&(escapeLane!=null||routeLane!=null||!clear(r.lane)||score(best)>score(r.lane)+.45)&&s.elapsed>=r.nextLaneChangeAt&&Math.abs(r.lane-r.lanePos)<.1){
          if(r.plannedLane!==best){r.plannedLane=best;r.signalAt=s.elapsed;}
          if(s.elapsed-r.signalAt>=(s.difficulty==='challenge'?.25:.4)&&clear(best)){r.lane=best;r.plannedLane=null;r.nextLaneChangeAt=s.elapsed+(s.difficulty==='challenge'?.45:1.1);r.laneChanges++;}
        }else if(r.plannedLane!=null&&(best===r.lane||best==null||!clear(r.plannedLane)))r.plannedLane=null;
      }
      // Task lanes must clear even if a nearby vehicle freezes world travel.
      const laneDt=shoulder&&(shoulder.task.kind==='pedestrian'||laneChoice(shoulder.task))?realDt:dt;
      const nextLane=r.lanePos+clamp((r.lane-r.lanePos)*(1-Math.exp(-laneDt*(shoulder?2.5:s.difficulty==='challenge'?8:4.5))),-1.8*laneDt,1.8*laneDt);if(laneStepClear(s,r,r.lanePos,nextLane,physicalLane))r.lanePos=nextLane;
      if(shoulder&&(Math.abs(r.lanePos)<1.85||preparingFork&&Math.sign(r.lanePos)!==forkSide)&&r.at<shoulder.start)stopAt=Math.min(stopAt,shoulder.start-12);
      let speedCeiling=Math.sqrt(2*22*Math.max(0,stopAt-r.at));
      const space=forwardSpace(s,r,physicalLane);stopAt=Math.min(stopAt,space.limit);speedCeiling=Math.min(speedCeiling,space.ceiling);
      const reserved=s.patterns.find(p=>s.obstacles.some(o=>o.patternId===p.id&&o.type!=='traffic')&&p.at>s.distance&&p.at-s.distance<s.arena.speed*Math.max(1.9,s.nitroActive?nitroSpeed(s.nitroLevel||1):s.speedFactor)*2.5+30);
      // Keep the approach gap readable before contact. After an impact the
      // courtesy window ends and rivals use their own clear racing lanes.
      const yieldHazard=reserved&&s.impactRecovery<=0&&r.at-s.distance>-14&&r.at-s.distance<60;
      if(yieldHazard)desired=Math.min(desired,s.arena.speed*Math.max(.3,s.speedFactor)*.35);
      const gap=Math.max(0,stopAt-r.at),clearRun=gap>Math.max(45,r.speed*1.4),catching=s.distance-r.at>-32;
      // Once the player is boosting after solving a task, rivals may answer
      // with their own fuel. The neutral-phase distance cap still applies.
      const canBoost=(protectedTravel===null||s.nitroActive)&&!yieldHazard&&!r.reading&&!crossings.length&&clearRun&&Math.abs(r.lane-r.lanePos)<.15;
      const strategic=catching||late||r.id===1&&t&&t.at-r.at>150;
      if(r.nitro<=0)r.nitroLevel=0;const stackLimit=s.difficulty==='challenge'||s.nitroActive&&s.nitroLevel>=2?2:1,stackNow=r.nitro>0&&r.nitroLevel<stackLimit&&s.elapsed-r.lastNitroAt>.55&&catching&&!r.route;if(canBoost&&strategic&&r.fuel>=NITRO_COST&&(r.nitro<=0||stackNow))addNitro(r,s.elapsed);
      r.nitroActive=r.nitro>0&&canBoost;
      if(r.nitroActive){desired=s.arena.speed*Math.min(MAX_SPEED,profile.burst+Math.max(0,(r.nitroLevel||1)-1)*.4);r.nitro=Math.max(0,r.nitro-dt);}
      desired=Math.min(desired,speedCeiling);
      const oldSpeed=r.speed;r.speed=Math.max(0,oldSpeed+(desired-oldSpeed)*(1-Math.exp(-dt*(desired<oldSpeed?8:profile.throttle))));
      const ratio=r.route?.ratio??1;
      let travel=Math.min(gap,(oldSpeed+r.speed)*.5*dt/ratio);
      if(protectedTravel!==null){
        // Reading is a shared neutral phase: moving opponents cannot earn a
        // bigger lead while the player waits at an answer line. Never move a
        // car backwards or add catch-up distance; ordinary blocking still wins.
        // A car already on a crossing must first clear the pedestrians' path.
        const clearance=clearing;
        const allowance=clearance?Math.max(protectedTravel,qClearanceEnd(clearance)-r.at):protectedTravel;
        travel=Math.min(travel,Math.max(0,allowance));
        if(dt>0)r.speed=Math.min(r.speed,travel*ratio/dt);
      }
      travel=safeForwardTravel(s,r,travel,physicalLane);if(dt>0)r.speed=Math.min(r.speed,travel*ratio/dt);r.at=Math.min(s.arena.length,r.at+travel);if(gap<.001)r.speed=0;
      r.braking=r.speed<oldSpeed-.05||r.speed<.5;
      if(r.at>=s.arena.length){r.finishedAt=s.elapsed;r.nitroActive=false;}
    }
  }
  function markLaneChoice(s){if(s.status==='task'&&laneChoice(s.task))s.task.focusLane=s.lane;}
  function move(s,delta){if(s.status==='task'&&s.task.kind==='pedestrian')return delta===0?true:sortPerson(s,delta<0?0:1);if(steeringLocked(s)||exitAssist(s)||s.route)return false;if(['driving','task','resolving'].includes(s.status)){s.lane=clamp(s.lane+delta,-1,1);s.steered=true;markLaneChoice(s);return true;}return false;}
  function choose(s,index){if(steeringLocked(s)||exitAssist(s)||s.route)return false;if(['driving','task','resolving'].includes(s.status)&&Number.isInteger(index)&&index>=0&&index<3){s.lane=index-1;s.steered=true;markLaneChoice(s);return true;}return false;}
  function setAccelerating(s,active,useLoadedNitro=true){if(!s)return false;s.accelerationHeld=!!active&&['driving','task','resolving'].includes(s.status);s.accelerationUsesNitro=!!useLoadedNitro;s.accelerating=s.accelerationHeld&&!focusCruise(s);if(!s.accelerating&&!s.nitroHeld)s.nitroActive=false;return s.accelerating;}
  function obstacleLane(s,o){return o.lanePos??o.lane;}
  function missed(s,t,detail){t.attempts++;s.streak=0;s.time=Math.max(0,s.time-1.5);const item=detail||{id:t.id,kind:t.kind,type:t.type,prompt:t.kind==='repair'?t.blocks.join(' '):t.prompt,answer:t.answer,tr:t.tr,blocks:t.blocks?.slice()};item.learningKey=detail?'word:'+item.prompt.toLowerCase():learningKey(t);if(!s.review.some(x=>x.id===item.id)){s.review.push(item);if(!t.reviewOf&&!s.reviewLap)s.pendingReview.push(item);}}
  function connectRepair(s,order){
    const t=s.task;
    if(s.status!=='task'||t?.kind!=='repair'||t.solved||!Array.isArray(order)||order.length!==3||new Set(order).size!==3||order.some(x=>!Number.isInteger(x)||x<0||x>2))return false;
    if(!order.every((x,j)=>x===j)){missed(s,t);s.notice={type:'wrong',kind:'repair',text:'Try another connection order · −1.5s'};return false;}
    t.connection=order.slice();t.chosen=[0,1,2];t.solved=true;finishTask(s,true,'SENTENCE CONNECTED · ROAD REPAIRED');return true;
  }
  function finishTask(s,right,text){
    const t=s.task;
    if(t.kind==='repair'&&right||t.kind==='pedestrian'){const auto=beginFocusCruise(s);if(t.kind==='repair'||!crosswalkOccupied(s,t))returnFocusCruise(s,auto);}
    if(laneChoice(t)&&s.focusAuto)returnFocusCruise(s,s.focusAuto);
    s.learningRecovery=right?1.2:0;t.answeredRight=right;t.completed=true;t.completedAt=s.elapsed;t.completedDistance=s.distance;t.rowIndex=1;t.success=right&&t.attempts===0;
    if(t.kind!=='pedestrian')recordAnswer(s,learningKey(t),t.success,t.answer);
    if(right&&t.reviewOf)for(const item of s.review)if(item.id===t.reviewOf||item.learningKey===learningKey(t))item.recovered=true;
    if(t.success){s.correct++;if(t.kind==='junction')s.time+=3;if(t.kind==='light')s.boost=3.5;}
    if(!right){s.slow=2.5;s.detour=2.5;}
    if(t.kind==='pedestrian'){s.exitTask=t.id;s.lane=0;}
    if(t.kind==='junction'){const index=t.chosenIndex??t.correctIndex,takeShort=right;s.route=makeRoute(s,t,index,takeShort);s.routeHistory.push(s.route);text=takeShort?'SHORTCUT · −18m · +3s':'DETOUR · +32m · YOU CAN CATCH UP';s.lane=index-1;}
    s.taskIndex++;s.status='resolving';s.resolve=2;
    s.notice={type:right?'correct':'wrong',kind:t.kind,text:text||(right?(t.kind==='light'?'GREEN LIGHT · GO!':t.kind==='pedestrian'?'CROSSWALK CLEAR!':'FAST ROUTE · +3s'):'CORRECT ANSWER: '+t.answer)};
    scheduleReview(s);
  }
  function sortPerson(s,side){
    const t=s.task;if(s.status!=='task'||t?.kind!=='pedestrian'||!pedestrianReady(s,t)||t.pedWait>0||![0,1].includes(side))return false;
    const p=t.people[t.personIndex];if(!p||p.sent)return false;
    p.sent=true;p.sentAt=s.elapsed;p.selectedSide=side;p.correct=side===p.side;t.pedWait=t.personIndex===t.people.length-1?PEDESTRIAN_WALK_TIME:.85;
    recordAnswer(s,'word:'+p.word.toLowerCase(),p.correct,p.word);
    if(!p.correct)missed(s,t,{id:t.id+':'+p.id,kind:'pedestrian',prompt:p.word,answer:t.labels[p.side],tr:p.tr});
    s.notice={type:p.correct?'sorted':'wrong',text:p.correct?'TO THE '+(p.side===0?'LEFT':'RIGHT')+' SIDEWALK':p.word+' → '+t.labels[p.side]+' · −1.5s'};return true;
  }
  function passRow(s,physicalLane){
    const t=s.task,row=currentRow(s);
    if(t.kind==='pedestrian'){
      for(const p of t.people)if(!p.sent){missed(s,t,{id:t.id+':'+p.id,kind:'pedestrian',prompt:p.word,answer:t.labels[p.side],tr:p.tr});recordAnswer(s,'word:'+p.word.toLowerCase(),false,p.word);p.sent=true;p.sentAt=s.elapsed;p.selectedSide=p.side;p.correct=false;}
      finishTask(s,false,'VISITORS LEAVING · REVIEW AT THE FINISH');return;
    }
    const index=t.kind==='repair'?null:clamp(Math.round(physicalLane)+1,0,2),right=t.kind==='repair'?t.solved:index===row.correctIndex;
    t.chosenIndex=index;
    s.lastPass={taskId:t.id,rowIndex:0,index,correctIndex:row.correctIndex,right,options:row.options,at:row.at,life:1.5};
    if(!right)missed(s,t);if(t.kind==='repair')t.chosen=[0,1,2];finishTask(s,right);
  }
  function crosswalkOccupied(s,t){return t.kind==='pedestrian'&&t.activatedAt!=null&&t.people.some(p=>!p.sent||s.elapsed-p.sentAt<PEDESTRIAN_WALK_TIME-1e-8);}
  function trafficControlZones(s){return s.tasks.flatMap(t=>t.kind==='pedestrian'?[t]:t.kind==='junction'&&(t.enteredAt!=null||t.completed)?[{id:t.id+'-route-exit',kind:'merge',at:makeRoute(s,t,0,true).end,activatedAt:t.enteredAt??t.completedAt}]:[]);}
  function exitAssist(s){if(s.mergeAssist&&s.distance<s.mergeAssist.exitEndAt)return s.mergeAssist;const t=s.tasks.find(t=>t.id===s.exitTask);return t&&s.distance<t.exitEndAt?t:null;}
  function controlledTraffic(s,o){const t=trafficControlZones(s).find(t=>t.id===o.crosswalkRoute);return !!t&&t.activatedAt!=null&&s.distance<t.at+70;}
  function pedestrianReady(s,t=s.task){return t?.kind==='pedestrian'&&t.peopleEntryAt!=null&&s.elapsed-t.peopleEntryAt>=PEDESTRIAN_ENTRY_TIME-1e-8;}
  function crosswalkTimeLeft(s,t=s.task){return t?.kind==='pedestrian'?clamp(t.sortDuration-(s.elapsed-(t.sortStartedAt??s.elapsed)),0,t.sortDuration):0;}
  function updateTraffic(s,worldDt,prev,physicalLane,focus,realDt=worldDt){
    const crossings=s.tasks.filter(t=>crosswalkOccupied(s,t));
    for(const t of s.tasks)if(t.kind==='pedestrian'&&t.activatedAt!=null&&!crosswalkOccupied(s,t)&&t.clearedAt==null)t.clearedAt=s.elapsed;
    const cars=s.obstacles.filter(o=>o.type==='traffic').sort((a,b)=>b.at-a.at);
    for(const o of cars){
      const dt=vehicleClearingCrosswalk(s,o)?realDt:worldDt;
      const oldSpeed=o.speed,zone=taskRoadZone(s,o.at);
      if(o.route&&o.at>=o.route.end)o.route=null;
      if(zone&&o.clearTask!==zone.id){
        o.roadTarget??=Math.abs(o.lanePos)<=1?o.lanePos:Math.sign(o.lanePos);o.clearTask=zone.id;o.crosswalkRoute=zone.id;
        o.fromLane=o.lanePos;o.target=(Math.abs(o.lanePos)>.4?Math.sign(o.lanePos):o.id%2?-1:1)*2.9;o.changed=true;o.laneProgress=0;o.routeChanging=true;o.signalAt=s.elapsed;
      }else if(!zone&&o.clearTask){
        o.clearTask=null;o.crosswalkRoute=null;o.fromLane=o.lanePos;o.target=o.roadTarget??Math.sign(o.lanePos);o.changed=true;o.laneProgress=0;o.routeChanging=true;o.signalAt=s.elapsed;
      }
      // Civilian queues pass through the central fork after the racers clear.
      // Rejoin before the fork narrows; shoulders are not separate roads.
      if(zone?.task?.kind==='junction'&&o.at>=zone.task.at-90&&o.forkTask!==zone.id){
        o.forkTask=zone.id;o.route={...makeRoute(s,zone.task,1,zone.task.correctIndex===1),ratio:1};
        o.fromLane=o.lanePos;o.target=0;o.changed=true;o.laneProgress=0;o.routeChanging=true;o.signalAt=s.elapsed;
      }
      const crossing=crossings.find(t=>o.at<=t.stopAt+1e-8),space=forwardSpace(s,o,physicalLane);
      const fork=s.tasks.find(t=>t.kind==='junction'&&o.at<=t.at-135+1e-7&&o.at>t.at-240&&(s.distance<t.at+150||s.rivals.some(r=>r.at<t.at+126)));
      // Civilians wait well before a cone sequence while racers pass. Parking
      // in its only opening would combine three individually safe lanes into
      // an unavoidable wall once the player's braking assist is removed.
      const raceOpening=!zone&&s.patterns.find(p=>p.entry!==false&&p.at>o.at&&p.at-o.at<120&&s.distance<p.at+60);
      const openingStop=raceOpening?Math.max(o.at,raceOpening.at-50):Infinity;
      const creep=o.yieldForPlayer!=null&&space.blocker?.cruiseSpeed===0?1:0;
      let limit=Math.min(fork?fork.at-135:Infinity,crossing?crossing.stopAt:Infinity,space.limit+creep,openingStop,zone&&Math.abs(o.lanePos)<2.7&&o.at<zone.start?zone.start-12:Infinity),gap=Math.max(0,limit-o.at);
      const desired=Math.min(o.cruiseSpeed,space.ceiling+creep*.8,Math.sqrt(2*8*Math.max(0,Math.min(crossing?crossing.stopAt:Infinity,openingStop)-o.at)));
      o.speed=Math.max(0,oldSpeed+clamp(desired-oldSpeed,-8*dt,3*dt));const travel=safeForwardTravel(s,o,Math.min(gap,(oldSpeed+o.speed)*.5*dt),physicalLane);o.at+=travel;if(dt>0)o.speed=Math.min(o.speed,travel/dt);if(gap<=travel+1e-8&&Number.isFinite(limit))o.speed=0;
      o.waiting=o.speed<.05&&Number.isFinite(limit);if(o.waiting&&crossing)o.waitedCrosswalk=crossing.id;o.braking=o.speed<o.cruiseSpeed-.15;
      if(o.moving&&!o.changed&&o.at-s.distance<120&&gap>20){o.changed=true;o.fromLane=o.lanePos;o.signalAt=s.elapsed;}
      // Clear a stopped side-by-side queue before it can trap the player.
      const queuePattern=!zone&&o.speed<1&&s.followingTraffic&&s.speedFactor<.2&&Math.abs(o.at-s.distance)<9?s.patterns.find(p=>p.at>o.at&&p.at-o.at<30&&s.obstacles.some(b=>b.patternId===p.id&&b.cruiseSpeed===0)):null;
      if(queuePattern&&!o.yieldReturn&&o.target!==queuePattern.escapeLane&&Math.abs(queuePattern.escapeLane-o.lanePos)<1.1&&Math.abs(queuePattern.escapeLane-physicalLane)>.8&&laneStepClear(s,o,o.lanePos,queuePattern.escapeLane,physicalLane)){o.yieldOriginLane=o.lanePos;o.fromLane=o.lanePos;o.target=queuePattern.escapeLane;o.changed=true;o.laneProgress=0;o.routeChanging=true;o.signalAt=s.elapsed;o.yieldForPlayer=queuePattern.id;}
      // If the player has moved alongside into the escape lane, yield back
      // to the original lane rather than complete a merge across their nose.
      if(o.yieldForPlayer!=null&&!o.yieldReturn&&Math.abs(o.at-s.distance)<6&&Math.abs(o.target-physicalLane)<.85&&laneStepClear(s,o,o.lanePos,o.yieldOriginLane,physicalLane)){o.fromLane=o.lanePos;o.target=o.yieldOriginLane;o.laneProgress=0;o.signalAt=s.elapsed-.65;o.yieldReturn=true;}
      if(o.yieldForPlayer!=null&&(!s.patterns.some(p=>p.id===o.yieldForPlayer&&s.distance<p.at+20))){o.yieldForPlayer=null;o.yieldReturn=false;}
      // Civilians read the next gap too. Excluding it could commit a car to
      // a newly blocked lane and lock a queue across all three lanes.
      const nextPattern=!zone&&s.patterns.find(p=>p.at>o.at&&p.at-o.at<110&&s.obstacles.some(b=>b.patternId===p.id&&b.type!=='traffic'));
      const nextGap=nextPattern?.escapeLane;
      if(nextPattern&&o.target!==nextGap&&laneStepClear(s,o,o.lanePos,nextGap,physicalLane)){
        o.fromLane=o.lanePos;o.target=nextGap;o.changed=true;o.laneProgress=0;o.routeChanging=true;o.signalAt=s.elapsed;
      }else if(!nextPattern&&!zone&&!o.routeChanging&&!o.moving&&gap<55&&gap>16){
        const choices=[-1,0,1].filter(l=>Math.abs(l-o.lanePos)<1.1&&Math.abs(l-o.lanePos)>.3&&laneStepClear(s,o,o.lanePos,l,physicalLane));
        if(choices.length){o.fromLane=o.lanePos;o.target=choices[0];o.changed=true;o.laneProgress=0;o.routeChanging=true;o.signalAt=s.elapsed;}
      }
      const relative=Math.max(1,s.arena.speed*Math.max(1.9,s.nitroActive?nitroSpeed(s.nitroLevel||1):s.speedFactor)-o.speed),ahead=o.at-s.distance,signaled=s.elapsed-(o.signalAt??s.elapsed)>=.65;
      const gapMove=!!nextPattern&&o.target===nextGap;
      const room=zone||gapMove||o.yieldForPlayer!=null||o.laneProgress>0||ahead<-12||ahead/relative>=3;
      if(o.changed&&o.laneProgress>=1&&!zone){o.routeChanging=false;o.changed=false;o.moving=false;o.lane=o.target;}
      if(o.changed&&o.laneProgress<1&&signaled&&room&&(zone||gapMove||o.speed>1||o.laneProgress>0||o.yieldForPlayer!=null)&&(zone||o.laneProgress>0||laneStepClear(s,o,o.fromLane,o.target,physicalLane))){
        const laneDt=zone&&(zone.task.kind==='pedestrian'||laneChoice(zone.task))?realDt:dt;
        const progress=Math.min(1,o.laneProgress+laneDt/2.2),a=progress*progress*(3-2*progress),lane=o.fromLane+(o.target-o.fromLane)*a;
        if(laneStepClear(s,o,o.lanePos,lane,physicalLane)){o.laneProgress=progress;o.lanePos=lane;}
      }
    }
    for(const o of s.obstacles)if(!o.passed&&o.at<=s.distance)o.passed=true;
  }
  function tick(s,dt,physicalLane=s.lane){
    dt=clamp(dt,0,.1);
    if(['paused','finished','failed'].includes(s.status))return;
    if(s.status==='breakdown'){tickBreakdown(s,dt,physicalLane);return;}
    if(s.status==='countdown'){s.countdown-=dt;if(s.countdown<=0)s.status='driving';return;}
    s.damageContacts=s.damageContacts.filter(o=>Math.abs(o.at-s.distance)<18);
    if(s.route&&s.distance>=s.route.end){s.route.endedAt=s.elapsed;s.mergeAssist=s.route;s.route=null;}
    for(const t of s.tasks)if(t.kind==='pedestrian'){
      if(t.activatedAt==null&&s.distance>=t.at-150)t.activatedAt=s.elapsed;
      // Traffic already on the stripes leaves before visitors step off the curb.
      if(t.activatedAt!=null&&t.peopleEntryAt==null&&![...s.obstacles.filter(o=>o.type==='traffic'),...s.rivals].some(o=>o.at+2.2>t.at-12&&o.at-2.2<t.at+14))t.peopleEntryAt=s.elapsed;
    }
    const pending=s.tasks[s.taskIndex];
    if(s.status==='driving'&&!s.route&&pending&&s.distance>=pending.at-(pending.kind==='pedestrian'?150:laneChoice(pending)?CHOICE_FOCUS_DISTANCE:70)){s.task=pending;s.status='task';pending.enteredAt=s.elapsed;if(pending.kind==='pedestrian'){pending.people[0].entryAt=s.elapsed;s.lane=0;}}
    if(s.status==='task'&&s.task.kind==='pedestrian'&&s.task.sortStartedAt==null&&s.task.peopleEntryAt!=null){const t=s.task;t.sortStartedAt=Math.max(t.enteredAt??s.elapsed,t.peopleEntryAt+PEDESTRIAN_ENTRY_TIME);t.people[0].entryAt=t.sortStartedAt;}
    if(s.status==='task'&&s.task.kind==='pedestrian'&&s.task.pedWait>0){const t=s.task;t.pedWait=Math.max(0,t.pedWait-dt);if(t.pedWait===0){t.personIndex++;if(t.personIndex>=t.people.length)finishTask(s,true);else t.people[t.personIndex].entryAt=s.elapsed;}}
    if(s.status==='task'&&s.task.kind==='pedestrian'&&s.task.people.some(p=>!p.sent)&&crosswalkTimeLeft(s)<=0)passRow(s,physicalLane);
    const row=currentRow(s),focus=s.status==='task',cruising=focusCruise(s);
    const auto=cruising?beginFocusCruise(s):null;
    if(auto){
      if(auto.kind==='pedestrian'&&s.task.completed&&auto.returning==null&&!crosswalkOccupied(s,s.task))returnFocusCruise(s,auto);
      s.accelerating=false;s.nitroHeld=false;s.nitroActive=false;if(!laneChoice(s.task))s.lane=auto.lane;
      // A deliberate sign tap or lane change can release the effect once the
      // car is aligned. This never grades the answer before its road line.
      if(laneChoice(s.task)&&auto.returning==null){auto.choiceSettle=s.task.focusLane===s.lane&&Math.abs(physicalLane-s.lane)<.15?(auto.choiceSettle||0)+dt:0;if((auto.age>=FOCUS_ENTRY||s.accelerationHeld)&&auto.choiceSettle>=.18)returnFocusCruise(s,auto);}
      if(auto.returning==null){auto.age+=dt;const p=smoothRoad(auto.age/FOCUS_ENTRY);s.worldTimeScale=1+(auto.scale-1)*p;s.focusAmount=p;s.speedFactor=auto.entrySpeed;}
      else{
        // Advance the same continuous fade faster only while a physical
        // accelerator stays held. Releasing it restores the gentle return.
        auto.returning+=dt*(s.accelerationHeld?FOCUS_RETURN/FOCUS_FAST_RETURN:1);
        const p=smoothRoad(auto.returning/FOCUS_RETURN);s.worldTimeScale=auto.returnScale+(1-auto.returnScale)*p;s.focusAmount=auto.returnFocus*(1-p);s.speedFactor=auto.entrySpeed+(Math.min(auto.entrySpeed,s.slow>0?.55:REGULAR_MAX_SPEED)-auto.entrySpeed)*p;
      }
    }else{s.worldTimeScale=1;s.focusAmount=0;}
    const approach=focus?clamp((row.at-s.distance-28)/42,0,1):1;
    const normalTarget=focus&&!laneChoice(s.task)?(s.task.solved?.55:s.diff.focus+(.6-s.diff.focus)*approach):s.slow>0?.55:s.boost>0?1.32:1;
    guideRouteLane(s,physicalLane);
    const crossing=s.tasks.find(t=>crosswalkOccupied(s,t)&&t.stopAt-s.distance<70&&s.distance<t.endAt+4);
    const assisted=exitAssist(s),queue=crossing||assisted;
    if(assisted)s.lane=0;
    s.yielding=crossing?.id||null;s.crosswalkQueue=queue?.id||null;s.followingTraffic=false;
    const protectedPhase=learningPaceProtected(s);
    let stopAt=Math.min(crossing?crossing.stopAt:Infinity,auto?.kind==='repair'&&auto.returning==null?s.task.at-8:Infinity),speedCeiling=Math.sqrt(2*18*Math.max(0,stopAt-s.distance));
    const body=playerBody(s,physicalLane),space=forwardSpace(s,body,physicalLane),manualDriving=openRoadDriving(s);
    if(!manualDriving){if(space.limit<stopAt){stopAt=space.limit;s.followingTraffic=stopAt-s.distance<45;}speedCeiling=Math.min(speedCeiling,space.ceiling);}
    if(s.nitro<=0)s.nitroLevel=0;
    if(focus&&!auto&&!laneChoice(s.task)&&s.speedFactor>REGULAR_MAX_SPEED)s.speedFactor=REGULAR_MAX_SPEED;
    // Only an intentional hold burns the stored charge. Stopped queues and
    // mandatory English time conserve it, even while a control stays held.
    const pinned=manualDriving&&space.limit-s.distance<.05&&s.speedFactor<.05;
    const nitroActive=!auto&&!pinned&&s.nitro>0&&(s.accelerating&&s.accelerationUsesNitro!==false||s.nitroHeld)&&!focus&&!crossing&&!assisted&&s.slow<=0&&speedCeiling>s.arena.speed*REGULAR_MAX_SPEED;
    s.nitroActive=nitroActive;
    const target=Math.min(nitroActive?nitroSpeed(s.nitroLevel||1):s.accelerating?(s.slow>0?.85:REGULAR_MAX_SPEED):normalTarget,speedCeiling/s.arena.speed);
    if(!auto)s.speedFactor+=(target-s.speedFactor)*(1-Math.exp(-dt*(nitroActive?(target>s.speedFactor?14:10):5)));
    s.clockFactor=focus||auto||s.yielding||assisted?s.diff.clock:1;s.time-=dt*s.clockFactor;s.elapsed+=dt;
    if(nitroActive)s.nitro=Math.max(0,s.nitro-dt);
    if(!focus&&!crossing&&!assisted)s.learningRecovery=Math.max(0,(s.learningRecovery||0)-dt);
    s.invulnerable=Math.max(0,s.invulnerable-dt);s.slow=Math.max(0,s.slow-dt);s.boost=Math.max(0,s.boost-dt);s.detour=Math.max(0,s.detour-dt);if(!protectedPhase)s.impactRecovery=Math.max(0,s.impactRecovery-dt);
    if(s.lastPass)s.lastPass.life=Math.max(0,s.lastPass.life-dt);
    if(s.time<=0){s.time=0;s.status='failed';s.failureReason='time';stopInputs(s);return;}
    const prev=s.distance,ratio=s.route?.ratio??1,nominal=s.arena.speed*s.speedFactor,worldDt=dt*s.worldTimeScale;
    // Resolve other vehicles first during manual driving. Their real travel
    // supplies the moving bumper position, without predictive jumps or early
    // player braking. Protected tasks keep their existing shared pace order.
    if(manualDriving){updateTraffic(s,worldDt,prev,physicalLane,false,dt);updateRivals(s,worldDt,physicalLane,null,dt);}
    const impactSpace=manualDriving?forwardSpace(s,body,physicalLane):null;
    if(impactSpace)stopAt=Math.min(stopAt,impactSpace.limit);
    const requested=(auto?Math.min(nominal*s.worldTimeScale,speedCeiling):nominal)*dt/ratio,travel=safeForwardTravel(s,body,requested,physicalLane);
    s.distance=Math.max(prev,Math.min(stopAt,s.distance+travel));
    if(travel<requested-1e-7){s.followingTraffic=true;if(!auto)s.speedFactor=dt>0?(s.distance-prev)*ratio/(s.arena.speed*dt):0;}
    s.roadTravel+=(s.distance-prev)*ratio;
    // Detect the actual swept bumper contact, before a later finish check.
    if(impactSpace?.blocker&&nominal-(impactSpace.blocker.speed||0)>1&&requested>0&&s.distance>=impactSpace.limit-.002)contactBump(s,impactSpace.blocker);
    if(auto&&nominal*dt>0)s.worldTimeScale=(s.distance-prev)*ratio/(nominal*dt);
    else if(Number.isFinite(stopAt)&&s.distance>=stopAt-1e-7)s.speedFactor=0;
    if(focus&&s.distance>=row.at)passRow(s,physicalLane);
    else if(s.status==='resolving'){s.resolve-=dt;if(s.resolve<=0&&!auto){s.task=null;s.status='driving';}}
    if(!manualDriving){updateTraffic(s,dt*s.worldTimeScale,prev,physicalLane,focus,dt);updateRivals(s,dt*s.worldTimeScale,physicalLane,protectedPhase?s.distance-prev:null,dt);}
    if(s.status==='breakdown')return;
    if(auto?.returning>=FOCUS_RETURN){s.task.focusDone=true;s.focusAuto=null;s.worldTimeScale=1;s.focusAmount=0;}
    if(s.time<=0){s.time=0;s.status='failed';s.failureReason='time';stopInputs(s);return;}
    if(s.distance>=s.arena.length&&!raceFailed(s)){s.distance=s.arena.length;s.status='finished';s.finishedAt=s.elapsed;stopInputs(s);}
  }
  // Choosing a sign steers the car; the answer is judged only at the road line.
  function answer(s,index){return choose(s,index);}
  function stars(s){if(!raceSucceeded(s))return 0;const accuracy=s.correct/s.tasks.length;return accuracy>=.9&&s.collisions<=2?3:accuracy>=.75?2:1;}
  function pause(s){if(!['finished','failed','paused'].includes(s.status)){s.previousStatus=s.status;s.status='paused';s.accelerationHeld=false;s.accelerating=false;s.nitroHeld=false;s.nitroActive=false;return true;}return false;}
  function resume(s){if(s.status==='paused')s.status=s.previousStatus;}
  root.RallyCore={ARENAS,DIFFICULTIES,RIVAL_PROFILES,PEDESTRIAN_WALK_TIME,PEDESTRIAN_ENTRY_TIME,VEHICLE_GAP,TASK_VIEW_DISTANCE,REGULAR_MAX_SPEED,MAX_SPEED,DAMAGE_LIMIT,COLLISION_GRACE,BREAKDOWN_DURATION,IMPACT_RECOVERY,carCondition,NITRO_COST,NITRO_DURATION,NITRO_MAX_STACKS,CHOICE_FOCUS_DISTANCE,nitroSpeed,taskZone,taskRoadZone,apronWidth,roadSpans,vehicleOnRoad,courseCurve,actorX,playerLaneClear,playerLaneBlocker,contactBump,learningPaceProtected,focusCruise,steeringLocked,repairCruise,canShortenFocus,canNitro,canEngageNitro,setNitroHeld,engageNitro,activateNitro,makeRoute,routeOffset,raceOrder,raceFailed,raceSucceeded,alternateReview,createReviewLap,exitAssist,pedestrianReady,crosswalkOccupied,crosswalkTimeLeft,random,shuffle,createRace,makeTasks,tick,move,choose,setAccelerating,currentRow,connectRepair,sortPerson,answer,stars,pause,resume,obstacleLane,clamp};
})(typeof window==='undefined'?globalThis:window);
