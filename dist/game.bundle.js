(()=>{var cd="wordramp",hd="https://mrsaymaz.netlify.app/api/ulti",og=Object.freeze(["gryffindor","hufflepuff","slytherin","ravenclaw"]),lg=Object.freeze({capacity:100,maxStrength:2,hours:72}),ld="wordramp-league.v1",cg=48*36e5,hg=47*36e5;function ud(i){return i&&typeof i.ultiApi=="string"?i.ultiApi.trim():hd}function ug(i,e,t=Date.now()){let n=t-e*36e5;return(Array.isArray(i)?i:[]).reduce((s,[r,a])=>r*6e4>n&&Number.isFinite(a)?s+a:s,0)}function dg(i,e,t){return e>0?1+(t-1)*Math.sqrt(Math.min(Math.max(i,0),e)/e):1}var dd=i=>"x"+i.toFixed(2);function fg(i){let e=i?.games?.[cd];return i&&i.enabled!==!1&&e&&e.enabled!==!1?e:null}function fd(i){return i%24===0?`${i/24} day${i===24?"":"s"}`:`${i} hours`}function pg(i=24){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=new Uint8Array(i);if(globalThis.crypto?.getRandomValues)globalThis.crypto.getRandomValues(t);else for(let n=0;n<i;n++)t[n]=Math.floor(Math.random()*256);return Array.from(t,n=>e[n%e.length]).join("")}function pd({api:i=hd,storage:e=globalThis.localStorage,fetchImpl:t=globalThis.fetch?.bind(globalThis),now:n=()=>Date.now(),timeoutMs:s=8e3}={}){let r=!!i,a={},o=()=>{try{let y=e?.getItem(ld);if(y){let w=JSON.parse(y);if(w&&typeof w=="object")return w}}catch{}return a},c=y=>{a=y;try{e?.setItem(ld,JSON.stringify(y))}catch{}},l=()=>{let y=o();return y.pools||={},y.outbox||=[],y.tickets||={},y};function h(){let y=l();return(typeof y.device!="string"||!/^[A-Za-z0-9_-]{8,64}$/.test(y.device))&&(y.device=pg(),c(y)),y.device}async function u(y){if(!r||!t)return{kind:"off"};let w=typeof AbortController=="function"?new AbortController:null,A=w?setTimeout(()=>w.abort(),s):null;try{let M=await t(i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(y),signal:w?.signal}),_=null;try{_=await M.json()}catch{}return M.status>=500||_?.retry===!0?{kind:"retry",status:M.status,data:_}:M.ok&&_?.status==="success"?{kind:"ok",data:_}:{kind:"refused",status:M.status,data:_}}catch{return{kind:"retry"}}finally{A&&clearTimeout(A)}}function f(y){let w=l();if(y?.settings&&typeof y.settings=="object"&&(w.settings=y.settings),y?.pools&&typeof y.pools=="object")for(let[A,M]of Object.entries(y.pools))w.pools[A]={at:n(),pool:M};c(w)}function d(y){let w=l(),A=w.settings||null,M={...lg,...A||{}},_=w.pools[y]?.pool||{},P=n(),D=og.map(F=>{let k=ug(_[F]?.entries,M.hours,P);return{id:F,points:k,players:_[F]?.players||0,strength:dg(k,M.capacity,M.maxStrength)}});return{enabled:r,known:!!A,settings:A,game:fg(A),capacity:M.capacity,hours:M.hours,teams:D,updatedAt:w.pools[y]?.at||null}}async function p(y){if(!r)return d(y);let w=await u({action:"pools",grade:y});return w.kind==="ok"&&f(w.data),{...d(y),online:w.kind==="ok"}}function x(y){let w=n();for(let[A,M]of Object.entries(y.tickets))(!M||w-M.at>cg)&&delete y.tickets[A];y.outbox=y.outbox.filter(A=>A&&w-A.at<=hg)}async function g({runId:y,grade:w,team:A,arena:M,pace:_,unit:P=""}){if(!r)return null;let D=l().tickets[y];if(D)return D.ticket;let F=await u({action:"start",game:cd,grade:w,team:A,arena:M,pace:_,unit:String(P).replace(/[^A-Za-z0-9_-]/g,"").slice(0,24),device:h()});if(F.kind!=="ok"||typeof F.data.ticket!="string")return null;let k=l();return x(k),k.tickets[y]={ticket:F.data.ticket,at:n(),grade:w,team:A},c(k),F.data.ticket}let m=y=>l().tickets[y]?.ticket||null;async function b(y){let w=await u({action:"claim",ticket:y,device:h()});if(w.kind==="ok"){f(w.data);let A=w.data;return{state:"counted",points:A.points||0,requested:A.requested,deviceWins:A.deviceWins,reason:A.reason||null,duplicate:!!A.duplicate}}return w.kind==="refused"?{state:"refused",reason:w.data?.reason||"refused"}:{state:"retry"}}async function S(y){if(!r)return{state:"off"};let w=l(),A=w.tickets[y];if(!A)return{state:"no-ticket"};delete w.tickets[y],c(w);let M=await b(A.ticket);if(M.state==="retry"){let _=l();return _.outbox.push({ticket:A.ticket,at:A.at,grade:A.grade,team:A.team}),x(_),c(_),{state:"queued"}}return M}async function v(){if(!r)return[];let y=l();x(y),c(y);let w=[];for(let A of y.outbox.slice()){let M=await b(A.ticket);if(M.state!=="retry"){let _=l();_.outbox=_.outbox.filter(P=>P.ticket!==A.ticket),c(_)}w.push({...A,...M})}return w}return{enabled:r,device:h,refresh:p,snapshot:d,start:g,ticketFor:m,claim:S,flush:v,outbox:()=>l().outbox.slice()}}var $c=Object.freeze([{id:"slytherin",name:"Slytherin",color:3314796,accent:"#8ce4bd",letter:"S"},{id:"hufflepuff",name:"Hufflepuff",color:15317056,accent:"#ffe09b",letter:"H"},{id:"gryffindor",name:"Gryffindor",color:13125971,accent:"#ffadb1",letter:"G"},{id:"ravenclaw",name:"Ravenclaw",color:4685774,accent:"#a5caff",letter:"R"}].map(Object.freeze)),Or=2,kr=.6;function Br(i){return!i||i.status!=="finished"||i.failureReason||i.breakdown||(i.damage||0)>=3?!1:!Number.isFinite(i.arena?.length)||Number.isFinite(i.distance)&&i.distance>=i.arena.length}var an=i=>$c.find(e=>e.id===i)||null;function md(i="run"){let e=globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+"-"+Math.random().toString(36).slice(2)+"-"+Math.random().toString(36).slice(2);return i+"-"+e}function gd(i,e,t){if(!Br(i)||i.reviewLap||e!==1||!an(i.teamId)||typeof i.runId!="string"||!i.runId)return"none";let n=i.tasks?.length&&Number.isFinite(i.correct)?i.correct/i.tasks.length:null;return(i.difficulty!=="challenge"&&i.difficulty!=="standard"&&n!=null?n>=kr-1e-9:t>=Or)?"qualified":"accuracy"}function xd(i){let e=!!i&&"ulti"in i;return e&&delete i.ulti,e}var so=class{constructor(e){this.enabled=e,this.ctx=null,this.engine=null,this.arena=-1}unlock(){if(this.enabled())try{if(this.ctx||=new(window.AudioContext||window.webkitAudioContext),this.ctx.resume().catch(()=>{}),this.engine)return;let e=this.ctx;this.compressor=e.createDynamicsCompressor(),this.compressor.threshold.value=-18,this.compressor.ratio.value=4,this.compressor.connect(e.destination),this.master=e.createGain(),this.master.gain.value=.7,this.master.connect(this.compressor),this.focusFilter=e.createBiquadFilter(),this.focusFilter.type="lowpass",this.focusFilter.frequency.value=16e3,this.world=e.createGain(),this.world.gain.value=1,this.world.connect(this.focusFilter),this.focusFilter.connect(this.master);let t=(c,l)=>{let h=e.createOscillator(),u=e.createGain();return h.type=c,u.gain.value=0,h.connect(u),u.connect(l),h.start(),[h,u]};this.engineFilter=e.createBiquadFilter(),this.engineFilter.type="lowpass",this.engineFilter.frequency.value=500,this.engineFilter.Q.value=1.4,this.engineFilter.connect(this.world),[this.engine,this.engineGain]=t("sawtooth",this.engineFilter),[this.sub,this.subGain]=t("triangle",this.engineFilter),[this.harmonic,this.harmonicGain]=t("sine",this.world);let n=(c,l)=>{let h=e.createBuffer(1,e.sampleRate*c,e.sampleRate),u=h.getChannelData(0),f=0;for(let d=0;d<u.length;d++)f=l(f,Math.random()*2-1,d),u[d]=f;return h};this.noiseBuffer=n(2,(c,l)=>(c+l*.02)/1.02*1||0);{let c=this.noiseBuffer.getChannelData(0);for(let l=0;l<c.length;l++)c[l]*=3.5}this.whiteBuffer=n(2,(c,l)=>l);let s=(c,l,h,u=.7)=>{let f=e.createBufferSource(),d=e.createBiquadFilter(),p=e.createGain();return f.buffer=c,f.loop=!0,d.type=l,d.frequency.value=h,d.Q.value=u,p.gain.value=0,f.connect(d),d.connect(p),p.connect(this.world),f.start(),{source:f,filter:d,gain:p}};this.wind=s(this.noiseBuffer,"lowpass",450),this.windGain=this.wind.gain,this.filter=this.wind.filter,this.nitroLayer=s(this.whiteBuffer,"bandpass",1600,.9),[this.whine,this.whineGain]=t("sine",this.world),this.ambience=s(this.noiseBuffer,"lowpass",260,.5),this.ambienceSwell=e.createOscillator(),this.ambienceDepth=e.createGain(),this.ambienceDepth.gain.value=0,this.ambienceSwell.frequency.value=.12,this.ambienceSwell.connect(this.ambienceDepth),this.ambienceDepth.connect(this.ambience.gain.gain),this.ambienceSwell.start();let r=e.createBuffer(1,e.sampleRate*3,e.sampleRate),a=r.getChannelData(0),o=0;for(let c=0;c<a.length;c++)o=(o+(Math.random()*2-1)*.12)/1.12,a[c]=o*(.65+.35*Math.sin(c/e.sampleRate*3.7));this.crowdBuffer=r,this.crowd=s(r,"bandpass",850,.45),this.crowdGain=this.crowd.gain}catch(e){console.warn("Wordramp audio unavailable",e)}}setArena(e){if(!this.ambience||e===this.arena)return;this.arena=e;let t=this.ctx.currentTime,n=this.ambience,s=[{type:"lowpass",f:240,q:.5,depth:.004},{type:"bandpass",f:520,q:.6,depth:.018},{type:"highpass",f:2600,q:.4,depth:.003}][e]||{type:"lowpass",f:240,q:.5,depth:0};n.filter.type=s.type,n.filter.frequency.setTargetAtTime(s.f,t,.3),n.filter.Q.value=s.q,this.swellDepth=s.depth}voice(e,t,n,s,r,a=this.master,o=null){let c=this.ctx.createOscillator(),l=this.ctx.createGain();c.type=e,c.frequency.setValueAtTime(t,n),o&&c.frequency.exponentialRampToValueAtTime(o,n+s),l.gain.setValueAtTime(1e-4,n),l.gain.exponentialRampToValueAtTime(r,n+.012),l.gain.exponentialRampToValueAtTime(1e-4,n+s),c.connect(l),l.connect(a),c.start(n),c.stop(n+s+.02),c.onended=()=>{c.disconnect(),l.disconnect()}}burst(e,t,n,s,r,a=this.whiteBuffer){let o=this.ctx.createBufferSource(),c=this.ctx.createBiquadFilter(),l=this.ctx.createGain();o.buffer=a,c.type=s,c.frequency.value=r,l.gain.setValueAtTime(1e-4,e),l.gain.exponentialRampToValueAtTime(n,e+.006),l.gain.exponentialRampToValueAtTime(1e-4,e+t),o.connect(c),c.connect(l),l.connect(this.master),o.start(e,Math.random(),t+.05),o.onended=()=>{o.disconnect(),c.disconnect(),l.disconnect()}}tone(e){if(!this.enabled()||!this.ctx||!this.master)return;if(/^nitro[123]$/.test(e)){this.boost(+e.at(-1));return}let t=this.ctx.currentTime;if(e==="correct"){[659,880,1318].forEach((a,o)=>{this.voice("triangle",a,t+o*.07,.24,.075),this.voice("sine",a*2,t+o*.07,.16,.02)});return}if(e==="wrong"){this.voice("triangle",233,t,.22,.07),this.voice("triangle",196,t+.11,.3,.065);return}if(e==="collision"){this.voice("sine",140,t,.32,.22,this.master,42),this.burst(t,.18,.16,"lowpass",1400),this.burst(t+.02,.08,.07,"highpass",3200);return}if(e==="breakdown"){[110,92,74,58].forEach((a,o)=>this.voice("sawtooth",a,t+o*.17,.32,.06)),this.burst(t,.5,.12,"lowpass",700);return}if(e==="finish"){[523,659,784,1046,1318].forEach((a,o)=>{this.voice("triangle",a,t+o*.11,.4,.07),this.voice("sine",a/2,t+o*.11,.4,.03)});return}if(e==="go"){[392,587,784].forEach((a,o)=>this.voice("square",a,t+o*.08,.18,.035));return}if(e==="tick"){this.voice("square",440,t,.12,.03);return}let n=[523,659,784],s=/^(note|word)([123])$/.exec(e);if(s){let a=n[+s[2]-1],o=s[1]==="word";this.voice("triangle",a,t,o?.35:.5,o?.04:.085),this.voice("sine",a*2,t,o?.25:.35,o?.015:.03);return}if(e==="chime"){[523,659,784,1046].forEach((a,o)=>{this.voice("triangle",a,t+o*.09,.6,.08),this.voice("sine",a*2,t+o*.09,.4,.025)});return}if(e==="buzz"){this.voice("square",150,t,.22,.035),this.voice("square",142,t+.02,.2,.03);return}if(e==="slam"){this.voice("sine",70,t,.35,.2,this.master,38),this.burst(t,.25,.12,"lowpass",600);return}if(e==="hop"){this.voice("sine",220,t,.18,.04,this.master,440);return}({click:[520],build:[493,740],pause:[330],overtake:[740,988]}[e]||[440]).forEach((a,o)=>this.voice("sine",a,t+o*.065,.2,e==="click"?.035:.08))}boost(e){let t=this.ctx,n=t.currentTime,s=t.createBufferSource(),r=t.createBiquadFilter(),a=t.createGain();s.buffer=this.noiseBuffer,r.type="bandpass",r.Q.value=.65,r.frequency.setValueAtTime(1800+e*350,n),r.frequency.exponentialRampToValueAtTime(250,n+.42),a.gain.setValueAtTime(1e-4,n),a.gain.exponentialRampToValueAtTime(.16+e*.025,n+.025),a.gain.exponentialRampToValueAtTime(1e-4,n+.5),s.connect(r),r.connect(a),a.connect(this.master),s.start(n),s.stop(n+.52),s.onended=()=>{s.disconnect(),r.disconnect(),a.disconnect()},this.voice("triangle",150+e*25,n,.34,.085,this.master,52)}applause(){if(!this.enabled()||!this.ctx||!this.crowd)return;let e=this.ctx,t=e.currentTime;for(let n=0;n<3;n++){let s=e.createBufferSource(),r=e.createBiquadFilter(),a=e.createGain(),o=t+n*.14;s.buffer=this.crowdBuffer,r.type="highpass",r.frequency.value=1200,a.gain.setValueAtTime(1e-4,o),a.gain.exponentialRampToValueAtTime(.095,o+.006),a.gain.exponentialRampToValueAtTime(1e-4,o+.085),s.connect(r),r.connect(a),a.connect(this.master),s.start(o,n*.31,.1),s.onended=()=>{s.disconnect(),r.disconnect(),a.disconnect()}}}update(e,t=0){if(!this.ctx||!this.engine)return;e&&this.setArena(e.arenaIndex??0);let n=this.enabled(),s=n&&e&&["driving","task","resolving","breakdown"].includes(e.status),r=s?Math.max(0,e.speedFactor):0,a=this.ctx.currentTime,o=Math.floor(r*2.2),c=(52+r*30-o*8)*(e?.status==="breakdown"?.65+Math.abs(Math.sin(e.elapsed*24))*.25:1),l=e?.accelerating||e?.nitroActive?1:.55;this.engine.frequency.setTargetAtTime(c,a,.1),this.sub.frequency.setTargetAtTime(c*.5,a,.1),this.harmonic.frequency.setTargetAtTime(c*2.01,a,.12),this.engineFilter.frequency.setTargetAtTime(260+r*520*l,a,.15),this.engineGain.gain.setTargetAtTime(s?(.016+r*.006)*l:0,a,.1),this.subGain.gain.setTargetAtTime(s?.02+r*.004:0,a,.1),this.harmonicGain.gain.setTargetAtTime(s?.004+r*.002:0,a,.12);let h=globalThis.RallyCore,u=s&&h&&e.route?.coaster?e.route:null,f=0;if(u&&this.rideId!==u.id&&(this.rideId=u.id,this.boost(3),this.voice("sawtooth",180,a,.7,.045,this.master,720)),u||(this.rideId=null),u){let m=h.coasterHeight(u,e.distance),b=h.coasterHeight(u,e.distance+2)-m;f=Math.min(.06,Math.max(0,h.coasterPace(u,e.distance)-1)*.04+Math.max(0,-b)*.02),this.rideHeight>.4&&m<.05&&(this.voice("sine",92,a,.3,.11,this.master,46),this.burst(a,.14,.07,"lowpass",850)),this.rideHeight=m}else this.rideHeight=0;this.windGain.gain.setTargetAtTime(s?.008*r*r+f:0,a,.16),this.filter.frequency.setTargetAtTime(300+r*650,a,.2);let d=s&&e.nitroActive?Math.max(1,e.nitroLevel||1):0;this.nitroLayer.gain.gain.setTargetAtTime(d?.018+d*.008:0,a,d?.05:.2),this.nitroLayer.filter.frequency.setTargetAtTime(1300+d*450,a,.1),this.whine.frequency.setTargetAtTime(900+r*260,a,.1),this.whineGain.gain.setTargetAtTime(d?.006+d*.003:0,a,d?.05:.2);let p=n&&e&&!["paused","finished","failed"].includes(e.status);this.ambience.gain.gain.setTargetAtTime(p?[.02,.03,.026][e.arenaIndex??0]??.02:0,a,.5),this.ambienceDepth.gain.setTargetAtTime(p&&this.swellDepth||0,a,.5);let x=n&&e?Math.max(0,Math.min(1,e.focusAmount||0)):0;this.focusFilter.frequency.setTargetAtTime(16e3-x*14800,a,.15),this.world.gain.setTargetAtTime(1-x*.35,a,.15);let g=s&&e.status==="driving"&&!e.yielding?Math.max(0,Math.min(1,t)):0;this.crowdGain.gain.setTargetAtTime(g*.14,a,.3),g>.75&&!this.cheerNear&&(this.cheerNear=!0,this.applause()),g<.25&&(this.cheerNear=!1)}};function yd(i={},e=!1){return(!i||typeof i!="object")&&(i={}),{graphics:["auto","high","battery"].includes(i.graphics)?i.graphics:"auto",motion:["system","full","reduced"].includes(i.motion)?i.motion:"system",haptics:i.haptics!==!1,reduced:i.motion==="reduced"||i.motion!=="full"&&e}}function Kc(i="auto",e=1){let t=Math.min(e,i==="battery"?1:i==="high"?2:1.75);return{graphics:i,ceiling:t,ratio:t,seconds:0,frames:0,slow:0,cooldown:0}}function vd(i,e,t=!0){if(!t||i.graphics!=="auto"||e<=0||e>.15||(i.cooldown=Math.max(0,i.cooldown-e),i.seconds+=e,i.frames++,e>1/38&&i.slow++,i.seconds<2.5))return!1;let n=i.slow/i.frames>.35,s=!1;return n&&i.cooldown===0&&i.ratio>.85&&(i.ratio=Math.max(.85,i.ratio-.2),i.cooldown=5,s=!0),i.seconds=0,i.frames=0,i.slow=0,s}function _d(i,e,t){if(!i||i.dispatched)return null;let n=e-i.x,s=t-i.y;return-s>=44&&-s>Math.abs(n)*1.25?(i.dispatched=!0,{type:"nitro"}):Math.abs(n)>=28&&Math.abs(n)>Math.abs(s)*1.2?(i.dispatched=!0,{type:"steer",direction:Math.sign(n)}):s>=44&&s>Math.abs(n)*1.25?(i.dispatched=!0,{type:"cancel"}):null}function Jc(i,e){return{laneX:i,laneY:e,boostBase:e,peakY:e,boost:!1,level:0}}function ao(i,e,t){let n=e-i.laneX,s=t-i.laneY,r=0,a=!1,o=!1;if(Math.abs(n)>=28&&Math.abs(n)>Math.abs(s)*1.2&&(r=Math.sign(n),i.laneX=e,i.laneY=t,i.boost||(i.boostBase=t)),i.boost){i.peakY=Math.min(i.peakY,t);let c=t-i.peakY;if(c>=28&&c>Math.abs(n)*1.2)i.boost=!1,i.level=0,i.boostBase=t,a=!0;else{let l=Math.min(3,Math.max(1,Math.floor((i.boostBase-t)/44)));l>i.level&&(i.level=l,o=!0)}}else{i.boostBase=Math.max(i.boostBase,t);let c=i.boostBase-t;c>=44&&c>Math.abs(n)*1.2&&(i.boost=!0,i.peakY=t,i.level=Math.min(3,Math.max(1,Math.floor(c/44))),a=!0)}return Math.abs(s)>Math.abs(n)*1.2&&(i.laneX=e,i.laneY=t),{steer:r,boost:i.boost,level:i.level,boostChanged:a,levelChanged:o}}function bd(i,e){let t=e>=i?Math.min(124,Math.max(80,e*.16)):Math.min(72,Math.max(42,e*.17));return e-t}function Md(i,e=1.55,t=3.45){if(!i||!["driving","task","resolving"].includes(i.status))return 0;let n=Math.max(0,Number(i.speedFactor)||0),s=n<=e?n/e*90:90+(n-e)/(t-e)*110;return Math.max(0,Math.min(200,Math.round(s)))}function Sd(i,{modalOpen:e=!1}={}){if(!i)return{phase:"garage",question:!1,approaching:!1,route:null,announcementsAllowed:!e};let t=["task","resolving"].includes(i.status),n=i.status==="driving",s=i.tasks?.[i.taskIndex],r=s?.at-i.distance,a=n&&r>0&&r<(s.kind==="pedestrian"?174:90),o=i.route||(i.mergeAssist&&i.distance<i.mergeAssist.exitEndAt?i.mergeAssist:null),c=(i.obstacles||[]).some(h=>!h.passed&&!h.dormant&&h.at>i.distance-8&&h.at<i.distance+80);return{phase:t?"question":a?"approaching":o?"route":n?"driving":"inactive",question:t,approaching:a,next:s,ahead:r,route:o,announcementsAllowed:n&&!t&&!a&&!o&&!c&&!i.yielding&&!i.followingTraffic&&!e}}var zr=Object.freeze({5:"A1",6:"A1+",7:"A2",8:"A2+"}),mg=Object.freeze({g5u1:"Naming school places and clubs, expressing likes and following school rules.",g5u2:"Following classroom instructions and talking about school subjects, objects and time.",g5u3:"Describing appearance, clothes and everyday routines.",g5u4:"Talking about family hobbies, routines and actions happening now.",g5u5:"Naming neighbourhood places and describing where things are in a city.",g5u6:"Ordering food and asking about quantities and prices.",g5u7:"Describing wild animals, their homes, abilities and size.",g5u8:"Describing natural places and making holiday plans.",g5u9:"Naming jobs and workplaces, and explaining what people do.",g5u10:"Asking about toys, colours, shapes and prices.",g6u1:"Talking about school roles, responsibilities and how often routines happen.",g6u2:"Describing study routines and comparing everyday activities with actions happening now.",g6u3:"Describing and comparing appearance, personality and personal belongings.",g6u4:"Talking about family jobs, homes and planned arrangements.",g6u5:"Describing festivals, transport and events in the past.",g6u6:"Talking about countries, languages, food culture and past food experiences.",g6u7:"Describing nature activities, reducing waste and protecting the environment.",g6u8:"Talking about planets, weather, future plans and predictions.",g6u9:"Comparing products and asking about prices and sizes.",g6u10:"Expressing feelings and needs, asking for help and discussing healthy habits.",g7u1:"Describing appearance and personality traits, and comparing people.",g7u2:"Talking about sports, equipment and how often people exercise.",g7u3:"Telling life stories and describing achievements, dates and past events.",g7u4:"Describing wild animals, their habitats and ways to protect them.",g7u5:"Talking about TV programmes, expressing preferences and sharing opinions.",g7u6:"Planning parties, making offers and suggestions, and talking about quantities.",g7u7:"Expressing hopes and ambitions, and making predictions about the future.",g7u8:"Naming public places, explaining their purposes and giving directions.",g7u9:"Discussing environmental problems and giving advice about solutions.",g7u10:"Comparing planets and exploring facts about space and space history.",g7u11:"Naming ingredients, following recipes and putting cooking steps in order.",g7u12:"Describing past holidays, asking about journeys and making travel plans.",g8u1:"Making invitations, accepting or refusing, and giving reasons and excuses.",g8u2:"Talking about teen routines, habits, preferences and opinions.",g8u3:"Naming kitchen tools and ingredients, and explaining recipes step by step.",g8u4:"Having phone conversations, taking messages and asking for clarification.",g8u5:"Talking about internet tools, online habits and staying safe online.",g8u6:"Comparing adventure sports, choosing equipment and following safety rules.",g8u7:"Describing destinations, comparing holidays and talking about past trips.",g8u8:"Sharing household chores and explaining responsibilities, rules and obligations.",g8u9:"Describing scientific achievements, experiments and laboratory instructions.",g8u10:"Discussing natural events, their effects, safety precautions and predictions.",g8u11:"Making polite shopping requests, comparing products and explaining purchase problems.",g8u12:"Describing pets, their daily needs and responsible care."});function Ed(i){return mg[i.id]||i.targetLanguage?.slice(0,2).join(" \xB7 ")||"Practise this unit\u2019s vocabulary and useful everyday English."}var Ji=["drive","steer","nitro","tasks","race"],Gr={drive:["hold","coast"],steer:["left","right"],nitro:["boost","save"]},gg=90,ro=30;function jc(i){return{step:i,speed:0,lane:0,held:!1,heldFor:0,gesture:null,boost:!1,level:0,charges:0,fuel:gg,keyBoost:!1,goals:Object.fromEntries((Gr[i]||[]).map(e=>[e,!1]))}}var wd=i=>Object.values(i.goals).every(Boolean),Zc=(i,e)=>{if(!e)return;let t=Math.max(-1,Math.min(1,i.lane+e));if(t!==i.lane){i.lane=t;let n=e<0?"left":"right";n in i.goals&&(i.goals[n]=!0)}};function Hr(i,e,t=1){if(i.step==="nitro"){if(!e){i.boost&&(i.goals.save=!0),i.boost=!1,i.level=0;return}for(;i.charges<t&&i.fuel>=ro;)i.fuel-=ro,i.charges++;i.level=Math.min(t,i.charges),i.boost=i.level>0,i.boost&&(i.goals.boost=!0)}}function Td(i,e,t){i.held=!0,i.gesture=Jc(e,t)}function Ad(i,e,t){if(!i.held||!i.gesture)return;let n=ao(i.gesture,e,t);Zc(i,n.steer),n.boost&&(n.boostChanged||n.levelChanged)?Hr(i,!0,n.level):n.boostChanged&&!n.boost&&Hr(i,!1)}function Qc(i){i.held&&(i.held=!1,i.gesture=null,i.boost&&Hr(i,!1))}function Rd(i,e,t){let n=e.length===1?e.toLowerCase():e;return n==="ArrowUp"?(t?i.held=!0:Qc(i),!0):t&&(n==="ArrowLeft"||n==="a")?(Zc(i,-1),!0):t&&(n==="ArrowRight"||n==="d")?(Zc(i,1),!0):n===" "?(i.keyBoost=t,Hr(i,t,Math.max(1,i.charges)),!0):t&&n==="n"?(i.step==="nitro"&&i.charges<3&&i.fuel>=ro&&(i.fuel-=ro,i.charges++,i.boost&&Hr(i,!0,i.charges)),!0):!1}function eh(i,e){let t=i.held||i.keyBoost;t&&(i.heldFor+=e),i.heldFor>=1.2&&"hold"in i.goals&&(i.goals.hold=!0),i.goals.hold&&!t&&"coast"in i.goals&&(i.goals.coast=!0);let n=i.boost?[90,140,170,200][i.level]:t?90:0;return i.speed+=(n-i.speed)*Math.min(1,e*(n>i.speed?2.4:1.1)),i}var th=["light","junction","repair","pedestrian"];function nh(i,e,t=!1,n=null){if(!i||i.reviewLap||!e)return null;let s=i.task;return i.status==="task"&&s&&e.tasks?.[s.kind]===!1&&!s.completed&&!s.solved?"task-"+s.kind:i.status!=="driving"?null:e.drive?e.steer?!e.nitro&&(t||i.nitro>0)&&!(n?.nitroTime>=12)?"nitro":null:"steer":i.accelerating?null:"drive"}function Cd(i,e,t,n,s){if(!i||!e||!t)return!1;let r=()=>[e.drive,e.steer,e.nitro,...th.map(o=>e.tasks?.[o])].join(),a=r();return s?.startsWith("task-")?t.shownTask={id:i.task.id,kind:i.task.kind}:t.shownTask&&(i.status!=="task"||i.task?.id!==t.shownTask.id||i.task.completed||i.task.solved)&&(e.tasks&&(e.tasks[t.shownTask.kind]=!0),t.shownTask=null),i.status==="driving"&&i.accelerating&&(t.held=(t.held||0)+n,t.held>=1.5&&(e.drive=!0)),t.lane!=null&&i.lane!==t.lane&&e.drive&&(e.steer=!0),t.lane=i.lane,s==="steer"&&(t.steerTime=(t.steerTime||0)+n,t.steerTime>=10&&(e.steer=!0)),s==="nitro"&&(t.nitroTime=(t.nitroTime||0)+n),i.nitroHeld&&i.nitro>0&&(e.nitro=!0),r()!==a}var Jn=(i,e,t)=>{let n=Math.max(0,Math.min(1,(i-e)/(t-e)));return n*n*(3-2*n)},xg={drive:2.4,steer:3.2,nitro:3.4,signs:4.5,sort:3.2};function Id(i,e){let t=xg[i]||3;if(e=(e%t+t)%t,i==="drive")return{dx:0,dy:0,press:e>=.3&&e<1.9};if(i==="steer")return{dx:-70*Jn(e,.45,.9)+140*Jn(e,1.35,1.95)-70*Jn(e,2.4,2.8),dy:0,press:e>=.2&&e<3};if(i==="nitro")return{dx:0,dy:-95*Jn(e,.5,1.3)+50*Jn(e,2,2.5),press:e>=.2&&e<3.1,boost:e>=.9&&e<2.2};if(i==="sort")return{dx:-60*Jn(e,.4,.9)+60*Jn(e,1.1,1.45)+60*Jn(e,1.7,2.2)-60*Jn(e,2.5,2.9),dy:0,press:e>=.2&&e<1.45||e>=1.6&&e<2.95};if(i==="signs"){let n=Math.floor(e/1.5),s=e-n*1.5;return{index:n,from:(n+2)%3,mix:Jn(s,0,.4),dx:0,dy:0,press:s>=.55&&s<.95}}return{dx:0,dy:0,press:!1}}var Yc=4;function Pd(i,e){return e=(e%Yc+Yc)%Yc,i==="drive"?{held:e>=.4&&e<2.6,lane:0,level:0}:i==="steer"?{held:e>=.3&&e<3.8,lane:e<1?0:e<1.8?-1:e<2.6?0:e<3.4?1:0,level:0}:i==="nitro"?{held:e>=.3&&e<3.6,lane:0,level:e>=1.2&&e<2.8?e<1.9?1:2:0}:{held:!1,lane:0,level:0}}var df=0,Hh=1,ff=2;var zh=1,ml=2,ri=3,yi=0,Wt=1,Jt=2,Ai=0,is=1,wn=2,Gh=3,Vh=4,pf=5,Bi=100,mf=101,gf=102,xf=103,yf=104,vf=200,_f=201,bf=202,Mf=203,Fo=204,Oo=205,Sf=206,Ef=207,wf=208,Tf=209,Af=210,Rf=211,Cf=212,If=213,Pf=214,gl=0,xl=1,yl=2,ss=3,vl=4,_l=5,bl=6,Ml=7,Wh=0,Lf=1,Df=2,Ri=0,Uf=1,Nf=2,Ff=3,Sl=4,Of=5,kf=6,Bf=7;var Xh=300,hs=301,us=302,yr=303,El=304,Da=306,vi=1e3,ki=1001,ko=1002,un=1003,Hf=1004;var Ua=1005;var zn=1006,wl=1007;var Vi=1008;var qn=1009,qh=1010,$h=1011,vr=1012,Tl=1013,Wi=1014,$n=1015,_r=1016,Al=1017,Rl=1018,br=1020,Yh=35902,Zh=35899,Kh=1021,Jh=1022,Dn=1023,rr=1026,Mr=1027,Cl=1028,Il=1029,jh=1030,Pl=1031;var Ll=1033,Na=33776,Fa=33777,Oa=33778,ka=33779,Dl=35840,Ul=35841,Nl=35842,Fl=35843,Ol=36196,kl=37492,Bl=37496,Hl=37808,zl=37809,Gl=37810,Vl=37811,Wl=37812,Xl=37813,ql=37814,$l=37815,Yl=37816,Zl=37817,Kl=37818,Jl=37819,jl=37820,Ql=37821,ec=36492,tc=36494,nc=36495,ic=36283,sc=36284,rc=36285,ac=36286;var sa=2300,Bo=2301,No=2302,Ih=2400,Ph=2401,Lh=2402;var zf=3200,Gf=3201;var Qh=0,Vf=1,Yn="",zt="srgb",rs="srgb-linear",ra="linear",ut="srgb";var ns=7680;var Dh=519,Wf=512,Xf=513,qf=514,eu=515,$f=516,Yf=517,Zf=518,Kf=519,Ho=35044,ds=35048;var tu="300 es",Hn=2e3,aa=2001;var _i=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},en=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ld=1234567,ea=Math.PI/180,ar=180/Math.PI;function Qn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(en[i&255]+en[i>>8&255]+en[i>>16&255]+en[i>>24&255]+"-"+en[e&255]+en[e>>8&255]+"-"+en[e>>16&15|64]+en[e>>24&255]+"-"+en[t&63|128]+en[t>>8&255]+"-"+en[t>>16&255]+en[t>>24&255]+en[n&255]+en[n>>8&255]+en[n>>16&255]+en[n>>24&255]).toLowerCase()}function je(i,e,t){return Math.max(e,Math.min(t,i))}function nu(i,e){return(i%e+e)%e}function yg(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function vg(i,e,t){return i!==e?(t-i)/(e-i):0}function ta(i,e,t){return(1-t)*i+t*e}function _g(i,e,t,n){return ta(i,e,1-Math.exp(-t*n))}function bg(i,e=1){return e-Math.abs(nu(i,e*2)-e)}function Mg(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Sg(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Eg(i,e){return i+Math.floor(Math.random()*(e-i+1))}function wg(i,e){return i+Math.random()*(e-i)}function Tg(i){return i*(.5-Math.random())}function Ag(i){i!==void 0&&(Ld=i);let e=Ld+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Rg(i){return i*ea}function Cg(i){return i*ar}function Ig(i){return(i&i-1)===0&&i!==0}function Pg(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Lg(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Dg(i,e,t,n,s){let r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),f=a((e-n)/2),d=r((n-e)/2),p=a((n-e)/2);switch(s){case"XYX":i.set(o*h,c*u,c*f,o*l);break;case"YZY":i.set(c*f,o*h,c*u,o*l);break;case"ZXZ":i.set(c*u,c*f,o*h,o*l);break;case"XZX":i.set(o*h,c*p,c*d,o*l);break;case"YXY":i.set(c*d,o*h,c*p,o*l);break;case"ZYZ":i.set(c*p,c*d,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Bn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ht(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Tt={DEG2RAD:ea,RAD2DEG:ar,generateUUID:Qn,clamp:je,euclideanModulo:nu,mapLinear:yg,inverseLerp:vg,lerp:ta,damp:_g,pingpong:bg,smoothstep:Mg,smootherstep:Sg,randInt:Eg,randFloat:wg,randFloatSpread:Tg,seededRandom:Ag,degToRad:Rg,radToDeg:Cg,isPowerOfTwo:Ig,ceilPowerOfTwo:Pg,floorPowerOfTwo:Lg,setQuaternionFromProperEuler:Dg,normalize:ht,denormalize:Bn},pe=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(je(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(je(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Gn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3],f=r[a+0],d=r[a+1],p=r[a+2],x=r[a+3];if(o===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=f,e[t+1]=d,e[t+2]=p,e[t+3]=x;return}if(u!==x||c!==f||l!==d||h!==p){let g=1-o,m=c*f+l*d+h*p+u*x,b=m>=0?1:-1,S=1-m*m;if(S>Number.EPSILON){let I=Math.sqrt(S),y=Math.atan2(I,m*b);g=Math.sin(g*y)/I,o=Math.sin(o*y)/I}let v=o*b;if(c=c*g+f*v,l=l*g+d*v,h=h*g+p*v,u=u*g+x*v,g===1-o){let I=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=I,l*=I,h*=I,u*=I}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[a],f=r[a+1],d=r[a+2],p=r[a+3];return e[t]=o*p+h*u+c*d-l*f,e[t+1]=c*p+h*f+l*u-o*d,e[t+2]=l*p+h*d+o*f-c*u,e[t+3]=h*p-o*u-c*f-l*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),u=o(r/2),f=c(n/2),d=c(s/2),p=c(r/2);switch(a){case"XYZ":this._x=f*h*u+l*d*p,this._y=l*d*u-f*h*p,this._z=l*h*p+f*d*u,this._w=l*h*u-f*d*p;break;case"YXZ":this._x=f*h*u+l*d*p,this._y=l*d*u-f*h*p,this._z=l*h*p-f*d*u,this._w=l*h*u+f*d*p;break;case"ZXY":this._x=f*h*u-l*d*p,this._y=l*d*u+f*h*p,this._z=l*h*p+f*d*u,this._w=l*h*u-f*d*p;break;case"ZYX":this._x=f*h*u-l*d*p,this._y=l*d*u+f*h*p,this._z=l*h*p-f*d*u,this._w=l*h*u+f*d*p;break;case"YZX":this._x=f*h*u+l*d*p,this._y=l*d*u+f*h*p,this._z=l*h*p-f*d*u,this._w=l*h*u-f*d*p;break;case"XZY":this._x=f*h*u-l*d*p,this._y=l*d*u-f*h*p,this._z=l*h*p+f*d*u,this._w=l*h*u+f*d*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],u=t[10],f=n+o+u;if(f>0){let d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(r-l)*d,this._z=(a-s)*d}else if(n>o&&n>u){let d=2*Math.sqrt(1+n-o-u);this._w=(h-c)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+l)/d}else if(o>u){let d=2*Math.sqrt(1+o-n-u);this._w=(r-l)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(c+h)/d}else{let d=2*Math.sqrt(1+u-n-o);this._w=(a-s)/d,this._x=(r+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(je(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-s*o,this._w=a*h-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,a=this._w,o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;let c=1-o*o;if(c<=Number.EPSILON){let d=1-t;return this._w=d*a+t*this._w,this._x=d*n+t*this._x,this._y=d*s+t*this._y,this._z=d*r+t*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-t)*h)/l,f=Math.sin(t*h)/l;return this._w=a*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},U=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Dd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Dd.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),h=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+c*l+a*u-o*h,this.y=n+c*h+o*l-r*u,this.z=s+c*u+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this.z=je(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this.z=je(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(je(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return ih.copy(this).projectOnVector(e),this.sub(ih)}reflect(e){return this.sub(ih.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(je(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ih=new U,Dd=new Gn,Ye=class i{constructor(e,t,n,s,r,a,o,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],d=n[5],p=n[8],x=s[0],g=s[3],m=s[6],b=s[1],S=s[4],v=s[7],I=s[2],y=s[5],w=s[8];return r[0]=a*x+o*b+c*I,r[3]=a*g+o*S+c*y,r[6]=a*m+o*v+c*w,r[1]=l*x+h*b+u*I,r[4]=l*g+h*S+u*y,r[7]=l*m+h*v+u*w,r[2]=f*x+d*b+p*I,r[5]=f*g+d*S+p*y,r[8]=f*m+d*v+p*w,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-n*r*h+n*o*c+s*r*l-s*a*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=h*a-o*l,f=o*c-h*r,d=l*r-a*c,p=t*u+n*f+s*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/p;return e[0]=u*x,e[1]=(s*l-h*n)*x,e[2]=(o*n-s*a)*x,e[3]=f*x,e[4]=(h*t-s*c)*x,e[5]=(s*r-o*t)*x,e[6]=d*x,e[7]=(n*c-l*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(sh.makeScale(e,t)),this}rotate(e){return this.premultiply(sh.makeRotation(-e)),this}translate(e,t){return this.premultiply(sh.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},sh=new Ye;function iu(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function oa(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Jf(){let i=oa("canvas");return i.style.display="block",i}var Ud={};function or(i){i in Ud||(Ud[i]=!0,console.warn(i))}function jf(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var Nd=new Ye().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Fd=new Ye().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ug(){let i={enabled:!0,workingColorSpace:rs,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ut&&(s.r=xi(s.r),s.g=xi(s.g),s.b=xi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ut&&(s.r=ir(s.r),s.g=ir(s.g),s.b=ir(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Yn?ra:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return or("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return or("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[rs]:{primaries:e,whitePoint:n,transfer:ra,toXYZ:Nd,fromXYZ:Fd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:zt},outputColorSpaceConfig:{drawingBufferColorSpace:zt}},[zt]:{primaries:e,whitePoint:n,transfer:ut,toXYZ:Nd,fromXYZ:Fd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:zt}}}),i}var ot=Ug();function xi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ir(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Hs,zo=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Hs===void 0&&(Hs=oa("canvas")),Hs.width=e.width,Hs.height=e.height;let s=Hs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Hs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=oa("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=xi(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(xi(t[n]/255)*255):t[n]=xi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Ng=0,lr=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ng++}),this.uuid=Qn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(rh(s[a].image)):r.push(rh(s[a]))}else r=rh(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function rh(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?zo.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Fg=0,ah=new U,ln=class i extends _i{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=ki,s=ki,r=zn,a=Vi,o=Dn,c=qn,l=i.DEFAULT_ANISOTROPY,h=Yn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Fg++}),this.uuid=Qn(),this.name="",this.source=new lr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new pe(0,0),this.repeat=new pe(1,1),this.center=new pe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ah).x}get height(){return this.source.getSize(ah).y}get depth(){return this.source.getSize(ah).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Xh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case vi:e.x=e.x-Math.floor(e.x);break;case ki:e.x=e.x<0?0:1;break;case ko:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case vi:e.y=e.y-Math.floor(e.y);break;case ki:e.y=e.y<0?0:1;break;case ko:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};ln.DEFAULT_IMAGE=null;ln.DEFAULT_MAPPING=Xh;ln.DEFAULT_ANISOTROPY=1;var Ut=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,c=e.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],p=c[9],x=c[2],g=c[6],m=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-x)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+x)<.1&&Math.abs(p+g)<.1&&Math.abs(l+d+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let S=(l+1)/2,v=(d+1)/2,I=(m+1)/2,y=(h+f)/4,w=(u+x)/4,A=(p+g)/4;return S>v&&S>I?S<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(S),s=y/n,r=w/n):v>I?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=y/s,r=A/s):I<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(I),n=w/r,s=A/r),this.set(n,s,r,t),this}let b=Math.sqrt((g-p)*(g-p)+(u-x)*(u-x)+(f-h)*(f-h));return Math.abs(b)<.001&&(b=1),this.x=(g-p)/b,this.y=(u-x)/b,this.z=(f-h)/b,this.w=Math.acos((l+d+m-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this.z=je(this.z,e.z,t.z),this.w=je(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this.z=je(this.z,e,t),this.w=je(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(je(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Go=class extends _i{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:zn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ut(0,0,e,t),this.scissorTest=!1,this.viewport=new Ut(0,0,e,t);let s={width:e,height:t,depth:n.depth},r=new ln(s);this.textures=[];let a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:zn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new lr(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},ei=class extends Go{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},la=class extends ln{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=un,this.minFilter=un,this.wrapR=ki,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Vo=class extends ln{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=un,this.minFilter=un,this.wrapR=ki,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ln=class{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Fn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Fn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Fn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Fn):Fn.fromBufferAttribute(r,a),Fn.applyMatrix4(e.matrixWorld),this.expandByPoint(Fn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),oo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),oo.copy(n.boundingBox)),oo.applyMatrix4(e.matrixWorld),this.union(oo)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Fn),Fn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Vr),lo.subVectors(this.max,Vr),zs.subVectors(e.a,Vr),Gs.subVectors(e.b,Vr),Vs.subVectors(e.c,Vr),Li.subVectors(Gs,zs),Di.subVectors(Vs,Gs),ji.subVectors(zs,Vs);let t=[0,-Li.z,Li.y,0,-Di.z,Di.y,0,-ji.z,ji.y,Li.z,0,-Li.x,Di.z,0,-Di.x,ji.z,0,-ji.x,-Li.y,Li.x,0,-Di.y,Di.x,0,-ji.y,ji.x,0];return!oh(t,zs,Gs,Vs,lo)||(t=[1,0,0,0,1,0,0,0,1],!oh(t,zs,Gs,Vs,lo))?!1:(co.crossVectors(Li,Di),t=[co.x,co.y,co.z],oh(t,zs,Gs,Vs,lo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Fn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Fn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ui[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ui[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ui[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ui[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ui[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ui[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ui[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ui[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ui),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},ui=[new U,new U,new U,new U,new U,new U,new U,new U],Fn=new U,oo=new Ln,zs=new U,Gs=new U,Vs=new U,Li=new U,Di=new U,ji=new U,Vr=new U,lo=new U,co=new U,Qi=new U;function oh(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Qi.fromArray(i,r);let o=s.x*Math.abs(Qi.x)+s.y*Math.abs(Qi.y)+s.z*Math.abs(Qi.z),c=e.dot(Qi),l=t.dot(Qi),h=n.dot(Qi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}var Og=new Ln,Wr=new U,lh=new U,bi=class{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Og.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Wr.subVectors(e,this.center);let t=Wr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Wr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(lh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Wr.copy(e.center).add(lh)),this.expandByPoint(Wr.copy(e.center).sub(lh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},di=new U,ch=new U,ho=new U,Ui=new U,hh=new U,uo=new U,uh=new U,ca=class{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,di)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=di.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(di.copy(this.origin).addScaledVector(this.direction,t),di.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){ch.copy(e).add(t).multiplyScalar(.5),ho.copy(t).sub(e).normalize(),Ui.copy(this.origin).sub(ch);let r=e.distanceTo(t)*.5,a=-this.direction.dot(ho),o=Ui.dot(this.direction),c=-Ui.dot(ho),l=Ui.lengthSq(),h=Math.abs(1-a*a),u,f,d,p;if(h>0)if(u=a*c-o,f=a*o-c,p=r*h,u>=0)if(f>=-p)if(f<=p){let x=1/h;u*=x,f*=x,d=u*(u+a*f+2*o)+f*(a*u+f+2*c)+l}else f=r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*c)+l;else f<=-p?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l):f<=p?(u=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+l):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ch).addScaledVector(ho,f),d}intersectSphere(e,t){di.subVectors(e.center,this.origin);let n=di.dot(this.direction),s=di.dot(di)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(e.min.x-f.x)*l,s=(e.max.x-f.x)*l):(n=(e.max.x-f.x)*l,s=(e.min.x-f.x)*l),h>=0?(r=(e.min.y-f.y)*h,a=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,a=(e.min.y-f.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-f.z)*u,c=(e.max.z-f.z)*u):(o=(e.max.z-f.z)*u,c=(e.min.z-f.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,di)!==null}intersectTriangle(e,t,n,s,r){hh.subVectors(t,e),uo.subVectors(n,e),uh.crossVectors(hh,uo);let a=this.direction.dot(uh),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ui.subVectors(this.origin,e);let c=o*this.direction.dot(uo.crossVectors(Ui,uo));if(c<0)return null;let l=o*this.direction.dot(hh.cross(Ui));if(l<0||c+l>a)return null;let h=-o*Ui.dot(uh);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},dt=class i{constructor(e,t,n,s,r,a,o,c,l,h,u,f,d,p,x,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,h,u,f,d,p,x,g)}set(e,t,n,s,r,a,o,c,l,h,u,f,d,p,x,g){let m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=c,m[2]=l,m[6]=h,m[10]=u,m[14]=f,m[3]=d,m[7]=p,m[11]=x,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/Ws.setFromMatrixColumn(e,0).length(),r=1/Ws.setFromMatrixColumn(e,1).length(),a=1/Ws.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let f=a*h,d=a*u,p=o*h,x=o*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=d+p*l,t[5]=f-x*l,t[9]=-o*c,t[2]=x-f*l,t[6]=p+d*l,t[10]=a*c}else if(e.order==="YXZ"){let f=c*h,d=c*u,p=l*h,x=l*u;t[0]=f+x*o,t[4]=p*o-d,t[8]=a*l,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=d*o-p,t[6]=x+f*o,t[10]=a*c}else if(e.order==="ZXY"){let f=c*h,d=c*u,p=l*h,x=l*u;t[0]=f-x*o,t[4]=-a*u,t[8]=p+d*o,t[1]=d+p*o,t[5]=a*h,t[9]=x-f*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){let f=a*h,d=a*u,p=o*h,x=o*u;t[0]=c*h,t[4]=p*l-d,t[8]=f*l+x,t[1]=c*u,t[5]=x*l+f,t[9]=d*l-p,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){let f=a*c,d=a*l,p=o*c,x=o*l;t[0]=c*h,t[4]=x-f*u,t[8]=p*u+d,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=d*u+p,t[10]=f-x*u}else if(e.order==="XZY"){let f=a*c,d=a*l,p=o*c,x=o*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=f*u+x,t[5]=a*h,t[9]=d*u-p,t[2]=p*u-d,t[6]=o*h,t[10]=x*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(kg,e,Bg)}lookAt(e,t,n){let s=this.elements;return bn.subVectors(e,t),bn.lengthSq()===0&&(bn.z=1),bn.normalize(),Ni.crossVectors(n,bn),Ni.lengthSq()===0&&(Math.abs(n.z)===1?bn.x+=1e-4:bn.z+=1e-4,bn.normalize(),Ni.crossVectors(n,bn)),Ni.normalize(),fo.crossVectors(bn,Ni),s[0]=Ni.x,s[4]=fo.x,s[8]=bn.x,s[1]=Ni.y,s[5]=fo.y,s[9]=bn.y,s[2]=Ni.z,s[6]=fo.z,s[10]=bn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],d=n[13],p=n[2],x=n[6],g=n[10],m=n[14],b=n[3],S=n[7],v=n[11],I=n[15],y=s[0],w=s[4],A=s[8],M=s[12],_=s[1],P=s[5],D=s[9],F=s[13],k=s[2],G=s[6],V=s[10],ee=s[14],W=s[3],ce=s[7],$=s[11],Z=s[15];return r[0]=a*y+o*_+c*k+l*W,r[4]=a*w+o*P+c*G+l*ce,r[8]=a*A+o*D+c*V+l*$,r[12]=a*M+o*F+c*ee+l*Z,r[1]=h*y+u*_+f*k+d*W,r[5]=h*w+u*P+f*G+d*ce,r[9]=h*A+u*D+f*V+d*$,r[13]=h*M+u*F+f*ee+d*Z,r[2]=p*y+x*_+g*k+m*W,r[6]=p*w+x*P+g*G+m*ce,r[10]=p*A+x*D+g*V+m*$,r[14]=p*M+x*F+g*ee+m*Z,r[3]=b*y+S*_+v*k+I*W,r[7]=b*w+S*P+v*G+I*ce,r[11]=b*A+S*D+v*V+I*$,r[15]=b*M+S*F+v*ee+I*Z,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],u=e[6],f=e[10],d=e[14],p=e[3],x=e[7],g=e[11],m=e[15];return p*(+r*c*u-s*l*u-r*o*f+n*l*f+s*o*d-n*c*d)+x*(+t*c*d-t*l*f+r*a*f-s*a*d+s*l*h-r*c*h)+g*(+t*l*u-t*o*d-r*a*u+n*a*d+r*o*h-n*l*h)+m*(-s*o*h-t*c*u+t*o*f+s*a*u-n*a*f+n*c*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=e[9],f=e[10],d=e[11],p=e[12],x=e[13],g=e[14],m=e[15],b=u*g*l-x*f*l+x*c*d-o*g*d-u*c*m+o*f*m,S=p*f*l-h*g*l-p*c*d+a*g*d+h*c*m-a*f*m,v=h*x*l-p*u*l+p*o*d-a*x*d-h*o*m+a*u*m,I=p*u*c-h*x*c-p*o*f+a*x*f+h*o*g-a*u*g,y=t*b+n*S+s*v+r*I;if(y===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let w=1/y;return e[0]=b*w,e[1]=(x*f*r-u*g*r-x*s*d+n*g*d+u*s*m-n*f*m)*w,e[2]=(o*g*r-x*c*r+x*s*l-n*g*l-o*s*m+n*c*m)*w,e[3]=(u*c*r-o*f*r-u*s*l+n*f*l+o*s*d-n*c*d)*w,e[4]=S*w,e[5]=(h*g*r-p*f*r+p*s*d-t*g*d-h*s*m+t*f*m)*w,e[6]=(p*c*r-a*g*r-p*s*l+t*g*l+a*s*m-t*c*m)*w,e[7]=(a*f*r-h*c*r+h*s*l-t*f*l-a*s*d+t*c*d)*w,e[8]=v*w,e[9]=(p*u*r-h*x*r-p*n*d+t*x*d+h*n*m-t*u*m)*w,e[10]=(a*x*r-p*o*r+p*n*l-t*x*l-a*n*m+t*o*m)*w,e[11]=(h*o*r-a*u*r-h*n*l+t*u*l+a*n*d-t*o*d)*w,e[12]=I*w,e[13]=(h*x*s-p*u*s+p*n*f-t*x*f-h*n*g+t*u*g)*w,e[14]=(p*o*s-a*x*s-p*n*c+t*x*c+a*n*g-t*o*g)*w,e[15]=(a*u*s-h*o*s+h*n*c-t*u*c-a*n*f+t*o*f)*w,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,h=a+a,u=o+o,f=r*l,d=r*h,p=r*u,x=a*h,g=a*u,m=o*u,b=c*l,S=c*h,v=c*u,I=n.x,y=n.y,w=n.z;return s[0]=(1-(x+m))*I,s[1]=(d+v)*I,s[2]=(p-S)*I,s[3]=0,s[4]=(d-v)*y,s[5]=(1-(f+m))*y,s[6]=(g+b)*y,s[7]=0,s[8]=(p+S)*w,s[9]=(g-b)*w,s[10]=(1-(f+x))*w,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=Ws.set(s[0],s[1],s[2]).length(),a=Ws.set(s[4],s[5],s[6]).length(),o=Ws.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],On.copy(this);let l=1/r,h=1/a,u=1/o;return On.elements[0]*=l,On.elements[1]*=l,On.elements[2]*=l,On.elements[4]*=h,On.elements[5]*=h,On.elements[6]*=h,On.elements[8]*=u,On.elements[9]*=u,On.elements[10]*=u,t.setFromRotationMatrix(On),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=Hn,c=!1){let l=this.elements,h=2*r/(t-e),u=2*r/(n-s),f=(t+e)/(t-e),d=(n+s)/(n-s),p,x;if(c)p=r/(a-r),x=a*r/(a-r);else if(o===Hn)p=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===aa)p=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Hn,c=!1){let l=this.elements,h=2/(t-e),u=2/(n-s),f=-(t+e)/(t-e),d=-(n+s)/(n-s),p,x;if(c)p=1/(a-r),x=a/(a-r);else if(o===Hn)p=-2/(a-r),x=-(a+r)/(a-r);else if(o===aa)p=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=u,l[9]=0,l[13]=d,l[2]=0,l[6]=0,l[10]=p,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Ws=new U,On=new dt,kg=new U(0,0,0),Bg=new U(1,1,1),Ni=new U,fo=new U,bn=new U,Od=new dt,kd=new Gn,Vn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(je(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-je(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(je(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-je(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(je(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-je(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Od.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Od,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return kd.setFromEuler(this),this.setFromQuaternion(kd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Vn.DEFAULT_ORDER="XYZ";var ha=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Hg=0,Bd=new U,Xs=new Gn,fi=new dt,po=new U,Xr=new U,zg=new U,Gg=new Gn,Hd=new U(1,0,0),zd=new U(0,1,0),Gd=new U(0,0,1),Vd={type:"added"},Vg={type:"removed"},qs={type:"childadded",child:null},dh={type:"childremoved",child:null},bt=class i extends _i{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Hg++}),this.uuid=Qn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new U,t=new Vn,n=new Gn,s=new U(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new dt},normalMatrix:{value:new Ye}}),this.matrix=new dt,this.matrixWorld=new dt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ha,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Xs.setFromAxisAngle(e,t),this.quaternion.multiply(Xs),this}rotateOnWorldAxis(e,t){return Xs.setFromAxisAngle(e,t),this.quaternion.premultiply(Xs),this}rotateX(e){return this.rotateOnAxis(Hd,e)}rotateY(e){return this.rotateOnAxis(zd,e)}rotateZ(e){return this.rotateOnAxis(Gd,e)}translateOnAxis(e,t){return Bd.copy(e).applyQuaternion(this.quaternion),this.position.add(Bd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Hd,e)}translateY(e){return this.translateOnAxis(zd,e)}translateZ(e){return this.translateOnAxis(Gd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(fi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?po.copy(e):po.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Xr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fi.lookAt(Xr,po,this.up):fi.lookAt(po,Xr,this.up),this.quaternion.setFromRotationMatrix(fi),s&&(fi.extractRotation(s.matrixWorld),Xs.setFromRotationMatrix(fi),this.quaternion.premultiply(Xs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Vd),qs.child=e,this.dispatchEvent(qs),qs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Vg),dh.child=e,this.dispatchEvent(dh),dh.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),fi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),fi.multiply(e.parent.matrixWorld)),e.applyMatrix4(fi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Vd),qs.child=e,this.dispatchEvent(qs),qs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xr,e,zg),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Xr,Gg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){let o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),u=a(e.shapes),f=a(e.skeletons),d=a(e.animations),p=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),p.length>0&&(n.nodes=p)}return n.object=s,n;function a(o){let c=[];for(let l in o){let h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};bt.DEFAULT_UP=new U(0,1,0);bt.DEFAULT_MATRIX_AUTO_UPDATE=!0;bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var kn=new U,pi=new U,fh=new U,mi=new U,$s=new U,Ys=new U,Wd=new U,ph=new U,mh=new U,gh=new U,xh=new Ut,yh=new Ut,vh=new Ut,gi=class i{constructor(e=new U,t=new U,n=new U){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),kn.subVectors(e,t),s.cross(kn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){kn.subVectors(s,t),pi.subVectors(n,t),fh.subVectors(e,t);let a=kn.dot(kn),o=kn.dot(pi),c=kn.dot(fh),l=pi.dot(pi),h=pi.dot(fh),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;let f=1/u,d=(l*c-o*h)*f,p=(a*h-o*c)*f;return r.set(1-d-p,p,d)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,mi)===null?!1:mi.x>=0&&mi.y>=0&&mi.x+mi.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,mi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,mi.x),c.addScaledVector(a,mi.y),c.addScaledVector(o,mi.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return xh.setScalar(0),yh.setScalar(0),vh.setScalar(0),xh.fromBufferAttribute(e,t),yh.fromBufferAttribute(e,n),vh.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(xh,r.x),a.addScaledVector(yh,r.y),a.addScaledVector(vh,r.z),a}static isFrontFacing(e,t,n,s){return kn.subVectors(n,t),pi.subVectors(e,t),kn.cross(pi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return kn.subVectors(this.c,this.b),pi.subVectors(this.a,this.b),kn.cross(pi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;$s.subVectors(s,n),Ys.subVectors(r,n),ph.subVectors(e,n);let c=$s.dot(ph),l=Ys.dot(ph);if(c<=0&&l<=0)return t.copy(n);mh.subVectors(e,s);let h=$s.dot(mh),u=Ys.dot(mh);if(h>=0&&u<=h)return t.copy(s);let f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return a=c/(c-h),t.copy(n).addScaledVector($s,a);gh.subVectors(e,r);let d=$s.dot(gh),p=Ys.dot(gh);if(p>=0&&d<=p)return t.copy(r);let x=d*l-c*p;if(x<=0&&l>=0&&p<=0)return o=l/(l-p),t.copy(n).addScaledVector(Ys,o);let g=h*p-d*u;if(g<=0&&u-h>=0&&d-p>=0)return Wd.subVectors(r,s),o=(u-h)/(u-h+(d-p)),t.copy(s).addScaledVector(Wd,o);let m=1/(g+x+f);return a=x*m,o=f*m,t.copy(n).addScaledVector($s,a).addScaledVector(Ys,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Qf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fi={h:0,s:0,l:0},mo={h:0,s:0,l:0};function _h(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Ae=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=zt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ot.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=ot.workingColorSpace){return this.r=e,this.g=t,this.b=n,ot.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=ot.workingColorSpace){if(e=nu(e,1),t=je(t,0,1),n=je(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=_h(a,r,e+1/3),this.g=_h(a,r,e),this.b=_h(a,r,e-1/3)}return ot.colorSpaceToWorking(this,s),this}setStyle(e,t=zt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=zt){let n=Qf[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=xi(e.r),this.g=xi(e.g),this.b=xi(e.b),this}copyLinearToSRGB(e){return this.r=ir(e.r),this.g=ir(e.g),this.b=ir(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=zt){return ot.workingToColorSpace(tn.copy(this),e),Math.round(je(tn.r*255,0,255))*65536+Math.round(je(tn.g*255,0,255))*256+Math.round(je(tn.b*255,0,255))}getHexString(e=zt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ot.workingColorSpace){ot.workingToColorSpace(tn.copy(this),t);let n=tn.r,s=tn.g,r=tn.b,a=Math.max(n,s,r),o=Math.min(n,s,r),c,l,h=(o+a)/2;if(o===a)c=0,l=0;else{let u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=ot.workingColorSpace){return ot.workingToColorSpace(tn.copy(this),t),e.r=tn.r,e.g=tn.g,e.b=tn.b,e}getStyle(e=zt){ot.workingToColorSpace(tn.copy(this),e);let t=tn.r,n=tn.g,s=tn.b;return e!==zt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Fi),this.setHSL(Fi.h+e,Fi.s+t,Fi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Fi),e.getHSL(mo);let n=ta(Fi.h,mo.h,t),s=ta(Fi.s,mo.s,t),r=ta(Fi.l,mo.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},tn=new Ae;Ae.NAMES=Qf;var Wg=0,ti=class extends _i{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Wg++}),this.uuid=Qn(),this.name="",this.type="Material",this.blending=is,this.side=yi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Fo,this.blendDst=Oo,this.blendEquation=Bi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ae(0,0,0),this.blendAlpha=0,this.depthFunc=ss,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Dh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ns,this.stencilZFail=ns,this.stencilZPass=ns,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==is&&(n.blending=this.blending),this.side!==yi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Fo&&(n.blendSrc=this.blendSrc),this.blendDst!==Oo&&(n.blendDst=this.blendDst),this.blendEquation!==Bi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ss&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Dh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ns&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ns&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ns&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},st=class extends ti{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Vn,this.combine=Wh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Ht=new U,go=new pe,Xg=0,kt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Xg++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ho,this.updateRanges=[],this.gpuType=$n,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)go.fromBufferAttribute(this,t),go.applyMatrix3(e),this.setXY(t,go.x,go.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ht.fromBufferAttribute(this,t),Ht.applyMatrix3(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ht.fromBufferAttribute(this,t),Ht.applyMatrix4(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ht.fromBufferAttribute(this,t),Ht.applyNormalMatrix(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ht.fromBufferAttribute(this,t),Ht.transformDirection(e),this.setXYZ(t,Ht.x,Ht.y,Ht.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ht(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Bn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Bn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Bn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Bn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ht(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),s=ht(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),s=ht(s,this.array),r=ht(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ho&&(e.usage=this.usage),e}};var ua=class extends kt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var da=class extends kt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Le=class extends kt{constructor(e,t,n){super(new Float32Array(e),t,n)}},qg=0,Pn=new dt,bh=new bt,Zs=new U,Mn=new Ln,qr=new Ln,Zt=new U,tt=class i extends _i{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:qg++}),this.uuid=Qn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(iu(e)?da:ua)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ye().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Pn.makeRotationFromQuaternion(e),this.applyMatrix4(Pn),this}rotateX(e){return Pn.makeRotationX(e),this.applyMatrix4(Pn),this}rotateY(e){return Pn.makeRotationY(e),this.applyMatrix4(Pn),this}rotateZ(e){return Pn.makeRotationZ(e),this.applyMatrix4(Pn),this}translate(e,t,n){return Pn.makeTranslation(e,t,n),this.applyMatrix4(Pn),this}scale(e,t,n){return Pn.makeScale(e,t,n),this.applyMatrix4(Pn),this}lookAt(e){return bh.lookAt(e),bh.updateMatrix(),this.applyMatrix4(bh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Zs).negate(),this.translate(Zs.x,Zs.y,Zs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Le(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ln);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Mn.setFromBufferAttribute(r),this.morphTargetsRelative?(Zt.addVectors(this.boundingBox.min,Mn.min),this.boundingBox.expandByPoint(Zt),Zt.addVectors(this.boundingBox.max,Mn.max),this.boundingBox.expandByPoint(Zt)):(this.boundingBox.expandByPoint(Mn.min),this.boundingBox.expandByPoint(Mn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new bi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(e){let n=this.boundingSphere.center;if(Mn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];qr.setFromBufferAttribute(o),this.morphTargetsRelative?(Zt.addVectors(Mn.min,qr.min),Mn.expandByPoint(Zt),Zt.addVectors(Mn.max,qr.max),Mn.expandByPoint(Zt)):(Mn.expandByPoint(qr.min),Mn.expandByPoint(qr.max))}Mn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Zt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Zt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Zt.fromBufferAttribute(o,l),c&&(Zs.fromBufferAttribute(e,l),Zt.add(Zs)),s=Math.max(s,n.distanceToSquared(Zt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new kt(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],c=[];for(let A=0;A<n.count;A++)o[A]=new U,c[A]=new U;let l=new U,h=new U,u=new U,f=new pe,d=new pe,p=new pe,x=new U,g=new U;function m(A,M,_){l.fromBufferAttribute(n,A),h.fromBufferAttribute(n,M),u.fromBufferAttribute(n,_),f.fromBufferAttribute(r,A),d.fromBufferAttribute(r,M),p.fromBufferAttribute(r,_),h.sub(l),u.sub(l),d.sub(f),p.sub(f);let P=1/(d.x*p.y-p.x*d.y);isFinite(P)&&(x.copy(h).multiplyScalar(p.y).addScaledVector(u,-d.y).multiplyScalar(P),g.copy(u).multiplyScalar(d.x).addScaledVector(h,-p.x).multiplyScalar(P),o[A].add(x),o[M].add(x),o[_].add(x),c[A].add(g),c[M].add(g),c[_].add(g))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let A=0,M=b.length;A<M;++A){let _=b[A],P=_.start,D=_.count;for(let F=P,k=P+D;F<k;F+=3)m(e.getX(F+0),e.getX(F+1),e.getX(F+2))}let S=new U,v=new U,I=new U,y=new U;function w(A){I.fromBufferAttribute(s,A),y.copy(I);let M=o[A];S.copy(M),S.sub(I.multiplyScalar(I.dot(M))).normalize(),v.crossVectors(y,M);let P=v.dot(c[A])<0?-1:1;a.setXYZW(A,S.x,S.y,S.z,P)}for(let A=0,M=b.length;A<M;++A){let _=b[A],P=_.start,D=_.count;for(let F=P,k=P+D;F<k;F+=3)w(e.getX(F+0)),w(e.getX(F+1)),w(e.getX(F+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new kt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);let s=new U,r=new U,a=new U,o=new U,c=new U,l=new U,h=new U,u=new U;if(e)for(let f=0,d=e.count;f<d;f+=3){let p=e.getX(f+0),x=e.getX(f+1),g=e.getX(f+2);s.fromBufferAttribute(t,p),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,g),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,p),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),o.add(h),c.add(h),l.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let f=0,d=t.count;f<d;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Zt.fromBufferAttribute(e,t),Zt.normalize(),e.setXYZ(t,Zt.x,Zt.y,Zt.z)}toNonIndexed(){function e(o,c){let l=o.array,h=o.itemSize,u=o.normalized,f=new l.constructor(c.length*h),d=0,p=0;for(let x=0,g=c.length;x<g;x++){o.isInterleavedBufferAttribute?d=c[x]*o.data.stride+o.offset:d=c[x]*h;for(let m=0;m<h;m++)f[p++]=l[d++]}return new kt(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=e(c,n);t.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){let f=l[h],d=e(f,n);c.push(d)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){let d=l[u];h.push(d.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(t))}let r=e.morphAttributes;for(let l in r){let h=[],u=r[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let l=0,h=a.length;l<h;l++){let u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Xd=new dt,es=new ca,xo=new bi,qd=new U,yo=new U,vo=new U,_o=new U,Mh=new U,bo=new U,$d=new U,Mo=new U,ve=class extends bt{constructor(e=new tt,t=new st){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){bo.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=o[c],u=r[c];h!==0&&(Mh.fromBufferAttribute(u,e),a?bo.addScaledVector(Mh,h):bo.addScaledVector(Mh.sub(t),h))}t.add(bo)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),xo.copy(n.boundingSphere),xo.applyMatrix4(r),es.copy(e.ray).recast(e.near),!(xo.containsPoint(es.origin)===!1&&(es.intersectSphere(xo,qd)===null||es.origin.distanceToSquared(qd)>(e.far-e.near)**2))&&(Xd.copy(r).invert(),es.copy(e.ray).applyMatrix4(Xd),!(n.boundingBox!==null&&es.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,es)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,x=f.length;p<x;p++){let g=f[p],m=a[g.materialIndex],b=Math.max(g.start,d.start),S=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let v=b,I=S;v<I;v+=3){let y=o.getX(v),w=o.getX(v+1),A=o.getX(v+2);s=So(this,m,e,n,l,h,u,y,w,A),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let p=Math.max(0,d.start),x=Math.min(o.count,d.start+d.count);for(let g=p,m=x;g<m;g+=3){let b=o.getX(g),S=o.getX(g+1),v=o.getX(g+2);s=So(this,a,e,n,l,h,u,b,S,v),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let p=0,x=f.length;p<x;p++){let g=f[p],m=a[g.materialIndex],b=Math.max(g.start,d.start),S=Math.min(c.count,Math.min(g.start+g.count,d.start+d.count));for(let v=b,I=S;v<I;v+=3){let y=v,w=v+1,A=v+2;s=So(this,m,e,n,l,h,u,y,w,A),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let p=Math.max(0,d.start),x=Math.min(c.count,d.start+d.count);for(let g=p,m=x;g<m;g+=3){let b=g,S=g+1,v=g+2;s=So(this,a,e,n,l,h,u,b,S,v),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function $g(i,e,t,n,s,r,a,o){let c;if(e.side===Wt?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===yi,o),c===null)return null;Mo.copy(o),Mo.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(Mo);return l<t.near||l>t.far?null:{distance:l,point:Mo.clone(),object:i}}function So(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,yo),i.getVertexPosition(c,vo),i.getVertexPosition(l,_o);let h=$g(i,e,t,n,yo,vo,_o,$d);if(h){let u=new U;gi.getBarycoord($d,yo,vo,_o,u),s&&(h.uv=gi.getInterpolatedAttribute(s,o,c,l,u,new pe)),r&&(h.uv1=gi.getInterpolatedAttribute(r,o,c,l,u,new pe)),a&&(h.normal=gi.getInterpolatedAttribute(a,o,c,l,u,new U),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let f={a:o,b:c,c:l,normal:new U,materialIndex:0};gi.getNormal(yo,vo,_o,f.normal),h.face=f,h.barycoord=u}return h}var xt=class i extends tt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],h=[],u=[],f=0,d=0;p("z","y","x",-1,-1,n,t,e,a,r,0),p("z","y","x",1,-1,n,t,-e,a,r,1),p("x","z","y",1,1,e,n,t,s,a,2),p("x","z","y",1,-1,e,n,-t,s,a,3),p("x","y","z",1,-1,e,t,n,s,r,4),p("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Le(l,3)),this.setAttribute("normal",new Le(h,3)),this.setAttribute("uv",new Le(u,2));function p(x,g,m,b,S,v,I,y,w,A,M){let _=v/w,P=I/A,D=v/2,F=I/2,k=y/2,G=w+1,V=A+1,ee=0,W=0,ce=new U;for(let $=0;$<V;$++){let Z=$*P-F;for(let Re=0;Re<G;Re++){let nt=Re*_-D;ce[x]=nt*b,ce[g]=Z*S,ce[m]=k,l.push(ce.x,ce.y,ce.z),ce[x]=0,ce[g]=0,ce[m]=y>0?1:-1,h.push(ce.x,ce.y,ce.z),u.push(Re/w),u.push(1-$/A),ee+=1}}for(let $=0;$<A;$++)for(let Z=0;Z<w;Z++){let Re=f+Z+G*$,nt=f+Z+G*($+1),Xe=f+(Z+1)+G*($+1),et=f+(Z+1)+G*$;c.push(Re,nt,et),c.push(nt,Xe,et),W+=6}o.addGroup(d,W,M),d+=W,f+=ee}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function fs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function sn(i){let e={};for(let t=0;t<i.length;t++){let n=fs(i[t]);for(let s in n)e[s]=n[s]}return e}function Yg(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function su(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ot.workingColorSpace}var ep={clone:fs,merge:sn},Zg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Kg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Wn=class extends ti{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Zg,this.fragmentShader=Kg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=fs(e.uniforms),this.uniformsGroups=Yg(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},fa=class extends bt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new dt,this.projectionMatrix=new dt,this.projectionMatrixInverse=new dt,this.coordinateSystem=Hn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Oi=new U,Yd=new pe,Zd=new pe,nn=class extends fa{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=ar*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ea*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ar*2*Math.atan(Math.tan(ea*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Oi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Oi.x,Oi.y).multiplyScalar(-e/Oi.z),Oi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Oi.x,Oi.y).multiplyScalar(-e/Oi.z)}getViewSize(e,t){return this.getViewBounds(e,Yd,Zd),t.subVectors(Zd,Yd)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ea*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ks=-90,Js=1,Wo=class extends bt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new nn(Ks,Js,e,t);s.layers=this.layers,this.add(s);let r=new nn(Ks,Js,e,t);r.layers=this.layers,this.add(r);let a=new nn(Ks,Js,e,t);a.layers=this.layers,this.add(a);let o=new nn(Ks,Js,e,t);o.layers=this.layers,this.add(o);let c=new nn(Ks,Js,e,t);c.layers=this.layers,this.add(c);let l=new nn(Ks,Js,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(let l of t)this.remove(l);if(e===Hn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===aa)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,f,d),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},pa=class extends ln{constructor(e=[],t=hs,n,s,r,a,o,c,l,h){super(e,t,n,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Xo=class extends ei{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new pa(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new xt(5,5,5),r=new Wn({name:"CubemapFromEquirect",uniforms:fs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Wt,blending:Ai});r.uniforms.tEquirect.value=t;let a=new ve(s,r),o=t.minFilter;return t.minFilter===Vi&&(t.minFilter=zn),new Wo(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}},Ge=class extends bt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Jg={type:"move"},cr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ge,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ge,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ge,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(let x of e.hand.values()){let g=t.getJointPose(x,n),m=this._getHandJoint(l,x);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,p=.005;l.inputState.pinching&&f>d+p?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=d-p&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Jg)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Ge;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var ma=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ae(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},ga=class extends bt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Vn,this.environmentIntensity=1,this.environmentRotation=new Vn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},xa=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ho,this.updateRanges=[],this.version=0,this.uuid=Qn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},on=new U,hr=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)on.fromBufferAttribute(this,t),on.applyMatrix4(e),this.setXYZ(t,on.x,on.y,on.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)on.fromBufferAttribute(this,t),on.applyNormalMatrix(e),this.setXYZ(t,on.x,on.y,on.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)on.fromBufferAttribute(this,t),on.transformDirection(e),this.setXYZ(t,on.x,on.y,on.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ht(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ht(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Bn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Bn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Bn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Bn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),s=ht(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ht(t,this.array),n=ht(n,this.array),s=ht(s,this.array),r=ht(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new kt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},ni=class extends ti{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ae(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},js,$r=new U,Qs=new U,er=new U,tr=new pe,Yr=new pe,tp=new dt,Eo=new U,Zr=new U,wo=new U,Kd=new pe,Sh=new pe,Jd=new pe,Mi=class extends bt{constructor(e=new ni){if(super(),this.isSprite=!0,this.type="Sprite",js===void 0){js=new tt;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new xa(t,5);js.setIndex([0,1,2,0,2,3]),js.setAttribute("position",new hr(n,3,0,!1)),js.setAttribute("uv",new hr(n,2,3,!1))}this.geometry=js,this.material=e,this.center=new pe(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Qs.setFromMatrixScale(this.matrixWorld),tp.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),er.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Qs.multiplyScalar(-er.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let a=this.center;To(Eo.set(-.5,-.5,0),er,a,Qs,s,r),To(Zr.set(.5,-.5,0),er,a,Qs,s,r),To(wo.set(.5,.5,0),er,a,Qs,s,r),Kd.set(0,0),Sh.set(1,0),Jd.set(1,1);let o=e.ray.intersectTriangle(Eo,Zr,wo,!1,$r);if(o===null&&(To(Zr.set(-.5,.5,0),er,a,Qs,s,r),Sh.set(0,1),o=e.ray.intersectTriangle(Eo,wo,Zr,!1,$r),o===null))return;let c=e.ray.origin.distanceTo($r);c<e.near||c>e.far||t.push({distance:c,point:$r.clone(),uv:gi.getInterpolation($r,Eo,Zr,wo,Kd,Sh,Jd,new pe),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function To(i,e,t,n,s,r){tr.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Yr.x=r*tr.x-s*tr.y,Yr.y=s*tr.x+r*tr.y):Yr.copy(tr),i.copy(e),i.x+=Yr.x,i.y+=Yr.y,i.applyMatrix4(tp)}var qo=class extends ln{constructor(e=null,t=1,n=1,s,r,a,o,c,l=un,h=un,u,f){super(null,a,o,c,l,h,s,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ur=class extends kt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},nr=new dt,jd=new dt,Ao=[],Qd=new Ln,jg=new dt,Kr=new ve,Jr=new bi,Si=class extends ve{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ur(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,jg)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ln),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,nr),Qd.copy(e.boundingBox).applyMatrix4(nr),this.boundingBox.union(Qd)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new bi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,nr),Jr.copy(e.boundingSphere).applyMatrix4(nr),this.boundingSphere.union(Jr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Kr.geometry=this.geometry,Kr.material=this.material,Kr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Jr.copy(this.boundingSphere),Jr.applyMatrix4(n),e.ray.intersectsSphere(Jr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,nr),jd.multiplyMatrices(n,nr),Kr.matrixWorld=jd,Kr.raycast(e,Ao);for(let a=0,o=Ao.length;a<o;a++){let c=Ao[a];c.instanceId=r,c.object=this,t.push(c)}Ao.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new ur(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new qo(new Float32Array(s*this.count),s,this.count,Cl,$n));let r=this.morphTexture.source.data.data,a=0;for(let l=0;l<n.length;l++)a+=n[l];let o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Eh=new U,Qg=new U,e0=new Ye,jn=class{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Eh.subVectors(n,t).cross(Qg.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Eh),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||e0.getNormalMatrix(e),s=this.coplanarPoint(Eh).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},ts=new bi,t0=new pe(.5,.5),Ro=new U,dr=class{constructor(e=new jn,t=new jn,n=new jn,s=new jn,r=new jn,a=new jn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Hn,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],u=r[5],f=r[6],d=r[7],p=r[8],x=r[9],g=r[10],m=r[11],b=r[12],S=r[13],v=r[14],I=r[15];if(s[0].setComponents(l-a,d-h,m-p,I-b).normalize(),s[1].setComponents(l+a,d+h,m+p,I+b).normalize(),s[2].setComponents(l+o,d+u,m+x,I+S).normalize(),s[3].setComponents(l-o,d-u,m-x,I-S).normalize(),n)s[4].setComponents(c,f,g,v).normalize(),s[5].setComponents(l-c,d-f,m-g,I-v).normalize();else if(s[4].setComponents(l-c,d-f,m-g,I-v).normalize(),t===Hn)s[5].setComponents(l+c,d+f,m+g,I+v).normalize();else if(t===aa)s[5].setComponents(c,f,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ts.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ts.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ts)}intersectsSprite(e){ts.center.set(0,0,0);let t=t0.distanceTo(e.center);return ts.radius=.7071067811865476+t,ts.applyMatrix4(e.matrixWorld),this.intersectsSphere(ts)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Ro.x=s.normal.x>0?e.max.x:e.min.x,Ro.y=s.normal.y>0?e.max.y:e.min.y,Ro.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ro)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Ei=class extends ti{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ae(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},$o=new U,Yo=new U,ef=new dt,jr=new ca,Co=new bi,wh=new U,tf=new U,Zo=class extends bt{constructor(e=new tt,t=new Ei){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)$o.fromBufferAttribute(t,s-1),Yo.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=$o.distanceTo(Yo);e.setAttribute("lineDistance",new Le(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Co.copy(n.boundingSphere),Co.applyMatrix4(s),Co.radius+=r,e.ray.intersectsSphere(Co)===!1)return;ef.copy(s).invert(),jr.copy(e.ray).applyMatrix4(ef);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){let d=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let x=d,g=p-1;x<g;x+=l){let m=h.getX(x),b=h.getX(x+1),S=Io(this,e,jr,c,m,b,x);S&&t.push(S)}if(this.isLineLoop){let x=h.getX(p-1),g=h.getX(d),m=Io(this,e,jr,c,x,g,p-1);m&&t.push(m)}}else{let d=Math.max(0,a.start),p=Math.min(f.count,a.start+a.count);for(let x=d,g=p-1;x<g;x+=l){let m=Io(this,e,jr,c,x,x+1,x);m&&t.push(m)}if(this.isLineLoop){let x=Io(this,e,jr,c,p-1,d,p-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Io(i,e,t,n,s,r,a){let o=i.geometry.attributes.position;if($o.fromBufferAttribute(o,s),Yo.fromBufferAttribute(o,r),t.distanceSqToSegment($o,Yo,wh,tf)>n)return;wh.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(wh);if(!(l<e.near||l>e.far))return{distance:l,point:tf.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var nf=new U,sf=new U,Hi=class extends Zo{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)nf.fromBufferAttribute(t,s),sf.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+nf.distanceTo(sf);e.setAttribute("lineDistance",new Le(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var wi=class extends ln{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},ya=class extends ln{constructor(e,t,n=Wi,s,r,a,o=un,c=un,l,h=rr,u=1){if(h!==rr&&h!==Mr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:e,height:t,depth:u};super(f,s,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new lr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},va=class extends ln{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var as=class i extends tt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],a=[],o=[],c=[],l=new U,h=new pe;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=t;u++,f+=3){let d=n+u/t*s;l.x=e*Math.cos(d),l.y=e*Math.sin(d),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[f]/e+1)/2,h.y=(a[f+1]/e+1)/2,c.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Le(a,3)),this.setAttribute("normal",new Le(o,3)),this.setAttribute("uv",new Le(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},dn=class i extends tt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],f=[],d=[],p=0,x=[],g=n/2,m=0;b(),a===!1&&(e>0&&S(!0),t>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new Le(u,3)),this.setAttribute("normal",new Le(f,3)),this.setAttribute("uv",new Le(d,2));function b(){let v=new U,I=new U,y=0,w=(t-e)/n;for(let A=0;A<=r;A++){let M=[],_=A/r,P=_*(t-e)+e;for(let D=0;D<=s;D++){let F=D/s,k=F*c+o,G=Math.sin(k),V=Math.cos(k);I.x=P*G,I.y=-_*n+g,I.z=P*V,u.push(I.x,I.y,I.z),v.set(G,w,V).normalize(),f.push(v.x,v.y,v.z),d.push(F,1-_),M.push(p++)}x.push(M)}for(let A=0;A<s;A++)for(let M=0;M<r;M++){let _=x[M][A],P=x[M+1][A],D=x[M+1][A+1],F=x[M][A+1];(e>0||M!==0)&&(h.push(_,P,F),y+=3),(t>0||M!==r-1)&&(h.push(P,D,F),y+=3)}l.addGroup(m,y,0),m+=y}function S(v){let I=p,y=new pe,w=new U,A=0,M=v===!0?e:t,_=v===!0?1:-1;for(let D=1;D<=s;D++)u.push(0,g*_,0),f.push(0,_,0),d.push(.5,.5),p++;let P=p;for(let D=0;D<=s;D++){let k=D/s*c+o,G=Math.cos(k),V=Math.sin(k);w.x=M*V,w.y=g*_,w.z=M*G,u.push(w.x,w.y,w.z),f.push(0,_,0),y.x=G*.5+.5,y.y=V*.5*_+.5,d.push(y.x,y.y),p++}for(let D=0;D<s;D++){let F=I+D,k=P+D;v===!0?h.push(k,k+1,F):h.push(k+1,k,F),A+=3}l.addGroup(m,A,v===!0?1:2),m+=A}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},ii=class i extends dn{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Ko=class i extends tt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),l(n),h(),this.setAttribute("position",new Le(r,3)),this.setAttribute("normal",new Le(r.slice(),3)),this.setAttribute("uv",new Le(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(b){let S=new U,v=new U,I=new U;for(let y=0;y<t.length;y+=3)d(t[y+0],S),d(t[y+1],v),d(t[y+2],I),c(S,v,I,b)}function c(b,S,v,I){let y=I+1,w=[];for(let A=0;A<=y;A++){w[A]=[];let M=b.clone().lerp(v,A/y),_=S.clone().lerp(v,A/y),P=y-A;for(let D=0;D<=P;D++)D===0&&A===y?w[A][D]=M:w[A][D]=M.clone().lerp(_,D/P)}for(let A=0;A<y;A++)for(let M=0;M<2*(y-A)-1;M++){let _=Math.floor(M/2);M%2===0?(f(w[A][_+1]),f(w[A+1][_]),f(w[A][_])):(f(w[A][_+1]),f(w[A+1][_+1]),f(w[A+1][_]))}}function l(b){let S=new U;for(let v=0;v<r.length;v+=3)S.x=r[v+0],S.y=r[v+1],S.z=r[v+2],S.normalize().multiplyScalar(b),r[v+0]=S.x,r[v+1]=S.y,r[v+2]=S.z}function h(){let b=new U;for(let S=0;S<r.length;S+=3){b.x=r[S+0],b.y=r[S+1],b.z=r[S+2];let v=g(b)/2/Math.PI+.5,I=m(b)/Math.PI+.5;a.push(v,1-I)}p(),u()}function u(){for(let b=0;b<a.length;b+=6){let S=a[b+0],v=a[b+2],I=a[b+4],y=Math.max(S,v,I),w=Math.min(S,v,I);y>.9&&w<.1&&(S<.2&&(a[b+0]+=1),v<.2&&(a[b+2]+=1),I<.2&&(a[b+4]+=1))}}function f(b){r.push(b.x,b.y,b.z)}function d(b,S){let v=b*3;S.x=e[v+0],S.y=e[v+1],S.z=e[v+2]}function p(){let b=new U,S=new U,v=new U,I=new U,y=new pe,w=new pe,A=new pe;for(let M=0,_=0;M<r.length;M+=9,_+=6){b.set(r[M+0],r[M+1],r[M+2]),S.set(r[M+3],r[M+4],r[M+5]),v.set(r[M+6],r[M+7],r[M+8]),y.set(a[_+0],a[_+1]),w.set(a[_+2],a[_+3]),A.set(a[_+4],a[_+5]),I.copy(b).add(S).add(v).divideScalar(3);let P=g(I);x(y,_+0,b,P),x(w,_+2,S,P),x(A,_+4,v,P)}}function x(b,S,v,I){I<0&&b.x===1&&(a[S]=b.x-1),v.x===0&&v.z===0&&(a[S]=I/2/Math.PI+.5)}function g(b){return Math.atan2(b.z,-b.x)}function m(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}};var Sn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);let h=n[s],f=n[s+1]-h,d=(a-h)/f;return(s+d)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new pe:new U);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new U,s=[],r=[],a=[],o=new U,c=new dt;for(let d=0;d<=e;d++){let p=d/e;s[d]=this.getTangentAt(p,new U)}r[0]=new U,a[0]=new U;let l=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();let p=Math.acos(je(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(c.makeRotationAxis(o,p))}a[d].crossVectors(s[d],r[d])}if(t===!0){let d=Math.acos(je(r[0].dot(r[e]),-1,1));d/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(d=-d);for(let p=1;p<=e;p++)r[p].applyMatrix4(c.makeRotationAxis(s[p],d*p)),a[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},fr=class extends Sn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new pe){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,d=l-this.aY;c=f*h-d*u+this.aX,l=f*u+d*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Jo=class extends fr{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function ru(){let i=0,e=0,t=0,n=0;function s(r,a,o,c){i=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,u){let f=(a-r)/l-(o-r)/(l+h)+(o-a)/h,d=(o-a)/h-(c-a)/(h+u)+(c-o)/u;f*=h,d*=h,s(a,o,f,d)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var Po=new U,Th=new ru,Ah=new ru,Rh=new ru,jo=class extends Sn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new U){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=s[(o-1)%r]:(Po.subVectors(s[0],s[1]).add(s[0]),l=Po);let u=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Po.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Po),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,p=Math.pow(l.distanceToSquared(u),d),x=Math.pow(u.distanceToSquared(f),d),g=Math.pow(f.distanceToSquared(h),d);x<1e-4&&(x=1),p<1e-4&&(p=x),g<1e-4&&(g=x),Th.initNonuniformCatmullRom(l.x,u.x,f.x,h.x,p,x,g),Ah.initNonuniformCatmullRom(l.y,u.y,f.y,h.y,p,x,g),Rh.initNonuniformCatmullRom(l.z,u.z,f.z,h.z,p,x,g)}else this.curveType==="catmullrom"&&(Th.initCatmullRom(l.x,u.x,f.x,h.x,this.tension),Ah.initCatmullRom(l.y,u.y,f.y,h.y,this.tension),Rh.initCatmullRom(l.z,u.z,f.z,h.z,this.tension));return n.set(Th.calc(c),Ah.calc(c),Rh.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new U().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function rf(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,c=i*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*i+t}function n0(i,e){let t=1-i;return t*t*e}function i0(i,e){return 2*(1-i)*i*e}function s0(i,e){return i*i*e}function na(i,e,t,n){return n0(i,e)+i0(i,t)+s0(i,n)}function r0(i,e){let t=1-i;return t*t*t*e}function a0(i,e){let t=1-i;return 3*t*t*i*e}function o0(i,e){return 3*(1-i)*i*i*e}function l0(i,e){return i*i*i*e}function ia(i,e,t,n,s){return r0(i,e)+a0(i,t)+o0(i,n)+l0(i,s)}var _a=class extends Sn{constructor(e=new pe,t=new pe,n=new pe,s=new pe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new pe){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ia(e,s.x,r.x,a.x,o.x),ia(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Qo=class extends Sn{constructor(e=new U,t=new U,n=new U,s=new U){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new U){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ia(e,s.x,r.x,a.x,o.x),ia(e,s.y,r.y,a.y,o.y),ia(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ba=class extends Sn{constructor(e=new pe,t=new pe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new pe){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new pe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},el=class extends Sn{constructor(e=new U,t=new U){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new U){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new U){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ma=class extends Sn{constructor(e=new pe,t=new pe,n=new pe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new pe){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(na(e,s.x,r.x,a.x),na(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},tl=class extends Sn{constructor(e=new U,t=new U,n=new U){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new U){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(na(e,s.x,r.x,a.x),na(e,s.y,r.y,a.y),na(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Sa=class extends Sn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new pe){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(rf(o,c.x,l.x,h.x,u.x),rf(o,c.y,l.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new pe().fromArray(s))}return this}},af=Object.freeze({__proto__:null,ArcCurve:Jo,CatmullRomCurve3:jo,CubicBezierCurve:_a,CubicBezierCurve3:Qo,EllipseCurve:fr,LineCurve:ba,LineCurve3:el,QuadraticBezierCurve:Ma,QuadraticBezierCurve3:tl,SplineCurve:Sa}),nl=class extends Sn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new af[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new af[s.type]().fromJSON(s))}return this}},Ea=class extends nl{constructor(e){super(),this.type="Path",this.currentPoint=new pe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new ba(this.currentPoint.clone(),new pe(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new Ma(this.currentPoint.clone(),new pe(e,t),new pe(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new _a(this.currentPoint.clone(),new pe(e,t),new pe(n,s),new pe(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Sa(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,s,r,a,o,c),this}absellipse(e,t,n,s,r,a,o,c){let l=new fr(e,t,n,s,r,a,o,c);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},pr=class extends Ea{constructor(e){super(e),this.uuid=Qn(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new Ea().fromJSON(s))}return this}};function c0(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=np(i,0,s,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=p0(i,e,r,t)),i.length>80*t){o=1/0,c=1/0;let h=-1/0,u=-1/0;for(let f=t;f<s;f+=t){let d=i[f],p=i[f+1];d<o&&(o=d),p<c&&(c=p),d>h&&(h=d),p>u&&(u=p)}l=Math.max(h-o,u-c),l=l!==0?32767/l:0}return wa(r,a,t,o,c,l,0),a}function np(i,e,t,n,s){let r;if(s===w0(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=of(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=of(a/n|0,i[a],i[a+1],r);return r&&mr(r,r.next)&&(Aa(r),r=r.next),r}function os(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(mr(t,t.next)||Dt(t.prev,t,t.next)===0)){if(Aa(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function wa(i,e,t,n,s,r,a){if(!i)return;!a&&r&&v0(i,n,s,r);let o=i;for(;i.prev!==i.next;){let c=i.prev,l=i.next;if(r?u0(i,n,s,r):h0(i)){e.push(c.i,i.i,l.i),Aa(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=d0(os(i),e),wa(i,e,t,n,s,r,2)):a===2&&f0(i,e,t,n,s,r):wa(os(i),e,t,n,s,r,1);break}}}function h0(i){let e=i.prev,t=i,n=i.next;if(Dt(e,t,n)>=0)return!1;let s=e.x,r=t.x,a=n.x,o=e.y,c=t.y,l=n.y,h=Math.min(s,r,a),u=Math.min(o,c,l),f=Math.max(s,r,a),d=Math.max(o,c,l),p=n.next;for(;p!==e;){if(p.x>=h&&p.x<=f&&p.y>=u&&p.y<=d&&Qr(s,o,r,c,a,l,p.x,p.y)&&Dt(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function u0(i,e,t,n){let s=i.prev,r=i,a=i.next;if(Dt(s,r,a)>=0)return!1;let o=s.x,c=r.x,l=a.x,h=s.y,u=r.y,f=a.y,d=Math.min(o,c,l),p=Math.min(h,u,f),x=Math.max(o,c,l),g=Math.max(h,u,f),m=Uh(d,p,e,t,n),b=Uh(x,g,e,t,n),S=i.prevZ,v=i.nextZ;for(;S&&S.z>=m&&v&&v.z<=b;){if(S.x>=d&&S.x<=x&&S.y>=p&&S.y<=g&&S!==s&&S!==a&&Qr(o,h,c,u,l,f,S.x,S.y)&&Dt(S.prev,S,S.next)>=0||(S=S.prevZ,v.x>=d&&v.x<=x&&v.y>=p&&v.y<=g&&v!==s&&v!==a&&Qr(o,h,c,u,l,f,v.x,v.y)&&Dt(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;S&&S.z>=m;){if(S.x>=d&&S.x<=x&&S.y>=p&&S.y<=g&&S!==s&&S!==a&&Qr(o,h,c,u,l,f,S.x,S.y)&&Dt(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;v&&v.z<=b;){if(v.x>=d&&v.x<=x&&v.y>=p&&v.y<=g&&v!==s&&v!==a&&Qr(o,h,c,u,l,f,v.x,v.y)&&Dt(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function d0(i,e){let t=i;do{let n=t.prev,s=t.next.next;!mr(n,s)&&sp(n,t,t.next,s)&&Ta(n,s)&&Ta(s,n)&&(e.push(n.i,t.i,s.i),Aa(t),Aa(t.next),t=i=s),t=t.next}while(t!==i);return os(t)}function f0(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&M0(a,o)){let c=rp(a,o);a=os(a,a.next),c=os(c,c.next),wa(a,e,t,n,s,r,0),wa(c,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function p0(i,e,t,n){let s=[];for(let r=0,a=e.length;r<a;r++){let o=e[r]*n,c=r<a-1?e[r+1]*n:i.length,l=np(i,o,c,n,!1);l===l.next&&(l.steiner=!0),s.push(b0(l))}s.sort(m0);for(let r=0;r<s.length;r++)t=g0(s[r],t);return t}function m0(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function g0(i,e){let t=x0(i,e);if(!t)return e;let n=rp(t,i);return os(n,n.next),os(t,t.next)}function x0(i,e){let t=e,n=i.x,s=i.y,r=-1/0,a;if(mr(i,t))return t;do{if(mr(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;let o=a,c=a.x,l=a.y,h=1/0;t=a;do{if(n>=t.x&&t.x>=c&&n!==t.x&&ip(s<l?n:r,s,c,l,s<l?r:n,s,t.x,t.y)){let u=Math.abs(s-t.y)/(n-t.x);Ta(t,i)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&y0(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function y0(i,e){return Dt(i.prev,i,e.prev)<0&&Dt(e.next,i,i.next)<0}function v0(i,e,t,n){let s=i;do s.z===0&&(s.z=Uh(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,_0(s)}function _0(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let l=0;l<t&&(o++,a=a.nextZ,!!a);l++);let c=t;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function Uh(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function b0(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function ip(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function Qr(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&ip(i,e,t,n,s,r,a,o)}function M0(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!S0(i,e)&&(Ta(i,e)&&Ta(e,i)&&E0(i,e)&&(Dt(i.prev,i,e.prev)||Dt(i,e.prev,e))||mr(i,e)&&Dt(i.prev,i,i.next)>0&&Dt(e.prev,e,e.next)>0)}function Dt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function mr(i,e){return i.x===e.x&&i.y===e.y}function sp(i,e,t,n){let s=Do(Dt(i,e,t)),r=Do(Dt(i,e,n)),a=Do(Dt(t,n,i)),o=Do(Dt(t,n,e));return!!(s!==r&&a!==o||s===0&&Lo(i,t,e)||r===0&&Lo(i,n,e)||a===0&&Lo(t,i,n)||o===0&&Lo(t,e,n))}function Lo(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Do(i){return i>0?1:i<0?-1:0}function S0(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&sp(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Ta(i,e){return Dt(i.prev,i,i.next)<0?Dt(i,e,i.next)>=0&&Dt(i,i.prev,e)>=0:Dt(i,e,i.prev)<0||Dt(i,i.next,e)<0}function E0(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function rp(i,e){let t=Nh(i.i,i.x,i.y),n=Nh(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function of(i,e,t,n){let s=Nh(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Aa(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Nh(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function w0(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var Fh=class{static triangulate(e,t,n=2){return c0(e,t,n)}},sr=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];lf(e),cf(n,e);let a=e.length;t.forEach(lf);for(let c=0;c<t.length;c++)s.push(a),a+=t[c].length,cf(n,t[c]);let o=Fh.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}};function lf(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function cf(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var si=class i extends Ko{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var Mt=class i extends tt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,u=e/o,f=t/c,d=[],p=[],x=[],g=[];for(let m=0;m<h;m++){let b=m*f-a;for(let S=0;S<l;S++){let v=S*u-r;p.push(v,-b,0),x.push(0,0,1),g.push(S/o),g.push(1-m/c)}}for(let m=0;m<c;m++)for(let b=0;b<o;b++){let S=b+l*m,v=b+l*(m+1),I=b+1+l*(m+1),y=b+1+l*m;d.push(S,v,y),d.push(v,I,y)}this.setIndex(d),this.setAttribute("position",new Le(p,3)),this.setAttribute("normal",new Le(x,3)),this.setAttribute("uv",new Le(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},ls=class i extends tt{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],c=[],l=[],h=[],u=e,f=(t-e)/s,d=new U,p=new pe;for(let x=0;x<=s;x++){for(let g=0;g<=n;g++){let m=r+g/n*a;d.x=u*Math.cos(m),d.y=u*Math.sin(m),c.push(d.x,d.y,d.z),l.push(0,0,1),p.x=(d.x/t+1)/2,p.y=(d.y/t+1)/2,h.push(p.x,p.y)}u+=f}for(let x=0;x<s;x++){let g=x*(n+1);for(let m=0;m<n;m++){let b=m+g,S=b,v=b+n+1,I=b+n+2,y=b+1;o.push(S,v,y),o.push(v,I,y)}}this.setIndex(o),this.setAttribute("position",new Le(c,3)),this.setAttribute("normal",new Le(l,3)),this.setAttribute("uv",new Le(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},Ra=class i extends tt{constructor(e=new pr([new pe(0,.5),new pe(-.5,-.5),new pe(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],a=[],o=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let h=0;h<e.length;h++)l(e[h]),this.addGroup(o,c,h),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new Le(s,3)),this.setAttribute("normal",new Le(r,3)),this.setAttribute("uv",new Le(a,2));function l(h){let u=s.length/3,f=h.extractPoints(t),d=f.shape,p=f.holes;sr.isClockWise(d)===!1&&(d=d.reverse());for(let g=0,m=p.length;g<m;g++){let b=p[g];sr.isClockWise(b)===!0&&(p[g]=b.reverse())}let x=sr.triangulateShape(d,p);for(let g=0,m=p.length;g<m;g++){let b=p[g];d=d.concat(b)}for(let g=0,m=d.length;g<m;g++){let b=d[g];s.push(b.x,b.y,0),r.push(0,0,1),a.push(b.x,b.y)}for(let g=0,m=x.length;g<m;g++){let b=x[g],S=b[0]+u,v=b[1]+u,I=b[2]+u;n.push(S,v,I),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return T0(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let a=t[e.shapes[s]];n.push(a)}return new i(n,e.curveSegments)}};function T0(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}var Xn=class i extends tt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),l=0,h=[],u=new U,f=new U,d=[],p=[],x=[],g=[];for(let m=0;m<=n;m++){let b=[],S=m/n,v=0;m===0&&a===0?v=.5/t:m===n&&c===Math.PI&&(v=-.5/t);for(let I=0;I<=t;I++){let y=I/t;u.x=-e*Math.cos(s+y*r)*Math.sin(a+S*o),u.y=e*Math.cos(a+S*o),u.z=e*Math.sin(s+y*r)*Math.sin(a+S*o),p.push(u.x,u.y,u.z),f.copy(u).normalize(),x.push(f.x,f.y,f.z),g.push(y+v,1-S),b.push(l++)}h.push(b)}for(let m=0;m<n;m++)for(let b=0;b<t;b++){let S=h[m][b+1],v=h[m][b],I=h[m+1][b],y=h[m+1][b+1];(m!==0||a>0)&&d.push(S,v,y),(m!==n-1||c<Math.PI)&&d.push(v,I,y)}this.setIndex(d),this.setAttribute("position",new Le(p,3)),this.setAttribute("normal",new Le(x,3)),this.setAttribute("uv",new Le(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Ti=class i extends tt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let a=[],o=[],c=[],l=[],h=new U,u=new U,f=new U;for(let d=0;d<=n;d++)for(let p=0;p<=s;p++){let x=p/s*r,g=d/n*Math.PI*2;u.x=(e+t*Math.cos(g))*Math.cos(x),u.y=(e+t*Math.cos(g))*Math.sin(x),u.z=t*Math.sin(g),o.push(u.x,u.y,u.z),h.x=e*Math.cos(x),h.y=e*Math.sin(x),f.subVectors(u,h).normalize(),c.push(f.x,f.y,f.z),l.push(p/s),l.push(d/n)}for(let d=1;d<=n;d++)for(let p=1;p<=s;p++){let x=(s+1)*d+p-1,g=(s+1)*(d-1)+p-1,m=(s+1)*(d-1)+p,b=(s+1)*d+p;a.push(x,g,b),a.push(g,m,b)}this.setIndex(a),this.setAttribute("position",new Le(o,3)),this.setAttribute("normal",new Le(c,3)),this.setAttribute("uv",new Le(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Ct=class extends ti{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ae(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Qh,this.normalScale=new pe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Vn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},gr=class extends Ct{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new pe(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return je(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ae(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ae(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ae(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var il=class extends ti{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=zf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},sl=class extends ti{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Uo(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function A0(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var cs=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},rl=class extends cs{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ih,endingEnd:Ih}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ph:r=e,o=2*t-n;break;case Lh:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Ph:a=e,c=2*n-t;break;case Lh:a=1,c=n+s[1]-s[0];break;default:a=e-1,c=t}let l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,p=(n-t)/(s-t),x=p*p,g=x*p,m=-f*g+2*f*x-f*p,b=(1+f)*g+(-1.5-2*f)*x+(-.5+f)*p+1,S=(-1-d)*g+(1.5+d)*x+.5*p,v=d*g-d*x;for(let I=0;I!==o;++I)r[I]=m*a[h+I]+b*a[l+I]+S*a[c+I]+v*a[u+I];return r}},al=class extends cs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=(n-t)/(s-t),u=1-h;for(let f=0;f!==o;++f)r[f]=a[l+f]*u+a[c+f]*h;return r}},ol=class extends cs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},En=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Uo(t,this.TimeBufferType),this.values=Uo(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Uo(e.times,Array),values:Uo(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ol(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new al(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new rl(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case sa:t=this.InterpolantFactoryMethodDiscrete;break;case Bo:t=this.InterpolantFactoryMethodLinear;break;case No:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return sa;case this.InterpolantFactoryMethodLinear:return Bo;case this.InterpolantFactoryMethodSmooth:return No}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(s!==void 0&&A0(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===No,r=e.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=e[o],h=e[o+1];if(l!==h&&(o!==1||l!==e[0]))if(s)c=!0;else{let u=o*n,f=u-n,d=u+n;for(let p=0;p!==n;++p){let x=t[u+p];if(x!==t[f+p]||x!==t[d+p]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];let u=o*n,f=a*n;for(let d=0;d!==n;++d)t[f+d]=t[u+d]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)t[c+l]=t[o+l];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};En.prototype.ValueTypeName="";En.prototype.TimeBufferType=Float32Array;En.prototype.ValueBufferType=Float32Array;En.prototype.DefaultInterpolation=Bo;var zi=class extends En{constructor(e,t,n){super(e,t,n)}};zi.prototype.ValueTypeName="bool";zi.prototype.ValueBufferType=Array;zi.prototype.DefaultInterpolation=sa;zi.prototype.InterpolantFactoryMethodLinear=void 0;zi.prototype.InterpolantFactoryMethodSmooth=void 0;var ll=class extends En{constructor(e,t,n,s){super(e,t,n,s)}};ll.prototype.ValueTypeName="color";var cl=class extends En{constructor(e,t,n,s){super(e,t,n,s)}};cl.prototype.ValueTypeName="number";var hl=class extends cs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-t)/(s-t),l=e*o;for(let h=l+o;l!==h;l+=4)Gn.slerpFlat(r,0,a,l-o,a,l,c);return r}},Ca=class extends En{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new hl(this.times,this.values,this.getValueSize(),e)}};Ca.prototype.ValueTypeName="quaternion";Ca.prototype.InterpolantFactoryMethodSmooth=void 0;var Gi=class extends En{constructor(e,t,n){super(e,t,n)}};Gi.prototype.ValueTypeName="string";Gi.prototype.ValueBufferType=Array;Gi.prototype.DefaultInterpolation=sa;Gi.prototype.InterpolantFactoryMethodLinear=void 0;Gi.prototype.InterpolantFactoryMethodSmooth=void 0;var ul=class extends En{constructor(e,t,n,s){super(e,t,n,s)}};ul.prototype.ValueTypeName="vector";var dl=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=l.length;u<f;u+=2){let d=l[u],p=l[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},ap=new dl,fl=class{constructor(e){this.manager=e!==void 0?e:ap,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};fl.DEFAULT_MATERIAL_NAME="__DEFAULT";var Ia=class extends bt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ae(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Pa=class extends Ia{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ae(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Ch=new dt,hf=new U,uf=new U,Oh=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new pe(512,512),this.mapType=qn,this.map=null,this.mapPass=null,this.matrix=new dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new dr,this._frameExtents=new pe(1,1),this._viewportCount=1,this._viewports=[new Ut(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;hf.setFromMatrixPosition(e.matrixWorld),t.position.copy(hf),uf.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(uf),t.updateMatrixWorld(),Ch.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ch,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ch)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var La=class extends fa{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},kh=class extends Oh{constructor(){super(new La(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},xr=class extends Ia{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.target=new bt,this.shadow=new kh}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var pl=class extends nn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var au="\\[\\]\\.:\\/",R0=new RegExp("["+au+"]","g"),ou="[^"+au+"]",C0="[^"+au.replace("\\.","")+"]",I0=/((?:WC+[\/:])*)/.source.replace("WC",ou),P0=/(WCOD+)?/.source.replace("WCOD",C0),L0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ou),D0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ou),U0=new RegExp("^"+I0+P0+L0+D0+"$"),N0=["material","materials","bones","map"],Bh=class{constructor(e,t,n){let s=n||wt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},wt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(R0,"")}static parseTrackName(e){let t=U0.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);N0.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let c=n(o.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let a=e[s];if(a===void 0){let l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};wt.Composite=Bh;wt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};wt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};wt.prototype.GetterByBindingType=[wt.prototype._getValue_direct,wt.prototype._getValue_array,wt.prototype._getValue_arrayElement,wt.prototype._getValue_toArray];wt.prototype.SetterByBindingTypeAndVersioning=[[wt.prototype._setValue_direct,wt.prototype._setValue_direct_setNeedsUpdate,wt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[wt.prototype._setValue_array,wt.prototype._setValue_array_setNeedsUpdate,wt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[wt.prototype._setValue_arrayElement,wt.prototype._setValue_arrayElement_setNeedsUpdate,wt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[wt.prototype._setValue_fromArray,wt.prototype._setValue_fromArray_setNeedsUpdate,wt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Db=new Float32Array(1);function lu(i,e,t,n){let s=F0(n);switch(t){case Kh:return i*e;case Cl:return i*e/s.components*s.byteLength;case Il:return i*e/s.components*s.byteLength;case jh:return i*e*2/s.components*s.byteLength;case Pl:return i*e*2/s.components*s.byteLength;case Jh:return i*e*3/s.components*s.byteLength;case Dn:return i*e*4/s.components*s.byteLength;case Ll:return i*e*4/s.components*s.byteLength;case Na:case Fa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Oa:case ka:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ul:case Fl:return Math.max(i,16)*Math.max(e,8)/4;case Dl:case Nl:return Math.max(i,8)*Math.max(e,8)/2;case Ol:case kl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Bl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Hl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case zl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Gl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Vl:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Wl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Xl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ql:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case $l:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Yl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Zl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Kl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Jl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case jl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Ql:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case ec:case tc:case nc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case ic:case sc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case rc:case ac:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function F0(i){switch(i){case qn:case qh:return{byteLength:1,components:1};case vr:case $h:case _r:return{byteLength:2,components:1};case Al:case Rl:return{byteLength:2,components:4};case Wi:case Tl:case $n:return{byteLength:4,components:1};case Yh:case Zh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Ip(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function z0(i){let e=new WeakMap;function t(o,c){let l=o.array,h=o.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,h),o.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)d=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){let h=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,h);else{u.sort((d,p)=>d.start-p.start);let f=0;for(let d=1;d<u.length;d++){let p=u[f],x=u[d];x.start<=p.start+p.count+1?p.count=Math.max(p.count,x.start+x.count-p.start):(++f,u[f]=x)}u.length=f+1;for(let d=0,p=u.length;d<p;d++){let x=u[d];i.bufferSubData(l,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var G0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,V0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,W0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,X0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,q0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,$0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Y0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Z0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,K0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,J0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,j0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Q0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ex=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,tx=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,nx=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ix=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,sx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,rx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ax=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ox=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,lx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,cx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,hx=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,ux=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,dx=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,fx=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,px=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,mx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,gx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,xx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,yx="gl_FragColor = linearToOutputTexel( gl_FragColor );",vx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,_x=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,bx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Mx=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Sx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ex=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,wx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Tx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ax=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Rx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Cx=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ix=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Px=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Lx=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Dx=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ux=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Nx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Fx=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ox=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,kx=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Bx=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Hx=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,zx=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Gx=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Vx=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Wx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Xx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$x=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Yx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Zx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Kx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Jx=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,jx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Qx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ey=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ty=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ny=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,iy=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,sy=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ry=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ay=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,oy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ly=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cy=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,hy=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,uy=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,dy=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,fy=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,py=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,my=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,gy=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,xy=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,yy=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,vy=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,_y=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,by=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,My=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Sy=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Ey=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,wy=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Ty=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Ay=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ry=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Cy=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Iy=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Py=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ly=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Dy=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Uy=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ny=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Fy=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Oy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ky=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,By=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Hy=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,zy=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Gy=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Wy=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qy=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$y=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Yy=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Zy=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Ky=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Jy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,jy=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qy=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ev=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,tv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,nv=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,iv=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sv=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rv=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,av=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ov=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,lv=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,cv=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,uv=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,dv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pv=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mv=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,gv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,xv=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yv=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,vv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,_v=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Je={alphahash_fragment:G0,alphahash_pars_fragment:V0,alphamap_fragment:W0,alphamap_pars_fragment:X0,alphatest_fragment:q0,alphatest_pars_fragment:$0,aomap_fragment:Y0,aomap_pars_fragment:Z0,batching_pars_vertex:K0,batching_vertex:J0,begin_vertex:j0,beginnormal_vertex:Q0,bsdfs:ex,iridescence_fragment:tx,bumpmap_pars_fragment:nx,clipping_planes_fragment:ix,clipping_planes_pars_fragment:sx,clipping_planes_pars_vertex:rx,clipping_planes_vertex:ax,color_fragment:ox,color_pars_fragment:lx,color_pars_vertex:cx,color_vertex:hx,common:ux,cube_uv_reflection_fragment:dx,defaultnormal_vertex:fx,displacementmap_pars_vertex:px,displacementmap_vertex:mx,emissivemap_fragment:gx,emissivemap_pars_fragment:xx,colorspace_fragment:yx,colorspace_pars_fragment:vx,envmap_fragment:_x,envmap_common_pars_fragment:bx,envmap_pars_fragment:Mx,envmap_pars_vertex:Sx,envmap_physical_pars_fragment:Ux,envmap_vertex:Ex,fog_vertex:wx,fog_pars_vertex:Tx,fog_fragment:Ax,fog_pars_fragment:Rx,gradientmap_pars_fragment:Cx,lightmap_pars_fragment:Ix,lights_lambert_fragment:Px,lights_lambert_pars_fragment:Lx,lights_pars_begin:Dx,lights_toon_fragment:Nx,lights_toon_pars_fragment:Fx,lights_phong_fragment:Ox,lights_phong_pars_fragment:kx,lights_physical_fragment:Bx,lights_physical_pars_fragment:Hx,lights_fragment_begin:zx,lights_fragment_maps:Gx,lights_fragment_end:Vx,logdepthbuf_fragment:Wx,logdepthbuf_pars_fragment:Xx,logdepthbuf_pars_vertex:qx,logdepthbuf_vertex:$x,map_fragment:Yx,map_pars_fragment:Zx,map_particle_fragment:Kx,map_particle_pars_fragment:Jx,metalnessmap_fragment:jx,metalnessmap_pars_fragment:Qx,morphinstance_vertex:ey,morphcolor_vertex:ty,morphnormal_vertex:ny,morphtarget_pars_vertex:iy,morphtarget_vertex:sy,normal_fragment_begin:ry,normal_fragment_maps:ay,normal_pars_fragment:oy,normal_pars_vertex:ly,normal_vertex:cy,normalmap_pars_fragment:hy,clearcoat_normal_fragment_begin:uy,clearcoat_normal_fragment_maps:dy,clearcoat_pars_fragment:fy,iridescence_pars_fragment:py,opaque_fragment:my,packing:gy,premultiplied_alpha_fragment:xy,project_vertex:yy,dithering_fragment:vy,dithering_pars_fragment:_y,roughnessmap_fragment:by,roughnessmap_pars_fragment:My,shadowmap_pars_fragment:Sy,shadowmap_pars_vertex:Ey,shadowmap_vertex:wy,shadowmask_pars_fragment:Ty,skinbase_vertex:Ay,skinning_pars_vertex:Ry,skinning_vertex:Cy,skinnormal_vertex:Iy,specularmap_fragment:Py,specularmap_pars_fragment:Ly,tonemapping_fragment:Dy,tonemapping_pars_fragment:Uy,transmission_fragment:Ny,transmission_pars_fragment:Fy,uv_pars_fragment:Oy,uv_pars_vertex:ky,uv_vertex:By,worldpos_vertex:Hy,background_vert:zy,background_frag:Gy,backgroundCube_vert:Vy,backgroundCube_frag:Wy,cube_vert:Xy,cube_frag:qy,depth_vert:$y,depth_frag:Yy,distanceRGBA_vert:Zy,distanceRGBA_frag:Ky,equirect_vert:Jy,equirect_frag:jy,linedashed_vert:Qy,linedashed_frag:ev,meshbasic_vert:tv,meshbasic_frag:nv,meshlambert_vert:iv,meshlambert_frag:sv,meshmatcap_vert:rv,meshmatcap_frag:av,meshnormal_vert:ov,meshnormal_frag:lv,meshphong_vert:cv,meshphong_frag:hv,meshphysical_vert:uv,meshphysical_frag:dv,meshtoon_vert:fv,meshtoon_frag:pv,points_vert:mv,points_frag:gv,shadow_vert:xv,shadow_frag:yv,sprite_vert:vv,sprite_frag:_v},me={common:{diffuse:{value:new Ae(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ye}},envmap:{envMap:{value:null},envMapRotation:{value:new Ye},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ye},normalScale:{value:new pe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ae(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ae(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0},uvTransform:{value:new Ye}},sprite:{diffuse:{value:new Ae(16777215)},opacity:{value:1},center:{value:new pe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ye},alphaMap:{value:null},alphaMapTransform:{value:new Ye},alphaTest:{value:0}}},ai={basic:{uniforms:sn([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:Je.meshbasic_vert,fragmentShader:Je.meshbasic_frag},lambert:{uniforms:sn([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Ae(0)}}]),vertexShader:Je.meshlambert_vert,fragmentShader:Je.meshlambert_frag},phong:{uniforms:sn([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Ae(0)},specular:{value:new Ae(1118481)},shininess:{value:30}}]),vertexShader:Je.meshphong_vert,fragmentShader:Je.meshphong_frag},standard:{uniforms:sn([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new Ae(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag},toon:{uniforms:sn([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new Ae(0)}}]),vertexShader:Je.meshtoon_vert,fragmentShader:Je.meshtoon_frag},matcap:{uniforms:sn([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:Je.meshmatcap_vert,fragmentShader:Je.meshmatcap_frag},points:{uniforms:sn([me.points,me.fog]),vertexShader:Je.points_vert,fragmentShader:Je.points_frag},dashed:{uniforms:sn([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Je.linedashed_vert,fragmentShader:Je.linedashed_frag},depth:{uniforms:sn([me.common,me.displacementmap]),vertexShader:Je.depth_vert,fragmentShader:Je.depth_frag},normal:{uniforms:sn([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:Je.meshnormal_vert,fragmentShader:Je.meshnormal_frag},sprite:{uniforms:sn([me.sprite,me.fog]),vertexShader:Je.sprite_vert,fragmentShader:Je.sprite_frag},background:{uniforms:{uvTransform:{value:new Ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Je.background_vert,fragmentShader:Je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ye}},vertexShader:Je.backgroundCube_vert,fragmentShader:Je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Je.cube_vert,fragmentShader:Je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Je.equirect_vert,fragmentShader:Je.equirect_frag},distanceRGBA:{uniforms:sn([me.common,me.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Je.distanceRGBA_vert,fragmentShader:Je.distanceRGBA_frag},shadow:{uniforms:sn([me.lights,me.fog,{color:{value:new Ae(0)},opacity:{value:1}}]),vertexShader:Je.shadow_vert,fragmentShader:Je.shadow_frag}};ai.physical={uniforms:sn([ai.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ye},clearcoatNormalScale:{value:new pe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ye},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ye},sheen:{value:0},sheenColor:{value:new Ae(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ye},transmissionSamplerSize:{value:new pe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ye},attenuationDistance:{value:0},attenuationColor:{value:new Ae(0)},specularColor:{value:new Ae(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ye},anisotropyVector:{value:new pe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ye}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag};var oc={r:0,b:0,g:0},ps=new Vn,bv=new dt;function Mv(i,e,t,n,s,r,a){let o=new Ae(0),c=r===!0?0:1,l,h,u=null,f=0,d=null;function p(S){let v=S.isScene===!0?S.background:null;return v&&v.isTexture&&(v=(S.backgroundBlurriness>0?t:e).get(v)),v}function x(S){let v=!1,I=p(S);I===null?m(o,c):I&&I.isColor&&(m(I,1),v=!0);let y=i.xr.getEnvironmentBlendMode();y==="additive"?n.buffers.color.setClear(0,0,0,1,a):y==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(S,v){let I=p(v);I&&(I.isCubeTexture||I.mapping===Da)?(h===void 0&&(h=new ve(new xt(1,1,1),new Wn({name:"BackgroundCubeMaterial",uniforms:fs(ai.backgroundCube.uniforms),vertexShader:ai.backgroundCube.vertexShader,fragmentShader:ai.backgroundCube.fragmentShader,side:Wt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(y,w,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ps.copy(v.backgroundRotation),ps.x*=-1,ps.y*=-1,ps.z*=-1,I.isCubeTexture&&I.isRenderTargetTexture===!1&&(ps.y*=-1,ps.z*=-1),h.material.uniforms.envMap.value=I,h.material.uniforms.flipEnvMap.value=I.isCubeTexture&&I.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(bv.makeRotationFromEuler(ps)),h.material.toneMapped=ot.getTransfer(I.colorSpace)!==ut,(u!==I||f!==I.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=I,f=I.version,d=i.toneMapping),h.layers.enableAll(),S.unshift(h,h.geometry,h.material,0,0,null)):I&&I.isTexture&&(l===void 0&&(l=new ve(new Mt(2,2),new Wn({name:"BackgroundMaterial",uniforms:fs(ai.background.uniforms),vertexShader:ai.background.vertexShader,fragmentShader:ai.background.fragmentShader,side:yi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=I,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=ot.getTransfer(I.colorSpace)!==ut,I.matrixAutoUpdate===!0&&I.updateMatrix(),l.material.uniforms.uvTransform.value.copy(I.matrix),(u!==I||f!==I.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,u=I,f=I.version,d=i.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function m(S,v){S.getRGB(oc,su(i)),n.buffers.color.setClear(oc.r,oc.g,oc.b,v,a)}function b(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,v=1){o.set(S),c=v,m(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(S){c=S,m(o,c)},render:x,addToRenderList:g,dispose:b}}function Sv(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null),r=s,a=!1;function o(_,P,D,F,k){let G=!1,V=u(F,D,P);r!==V&&(r=V,l(r.object)),G=d(_,F,D,k),G&&p(_,F,D,k),k!==null&&e.update(k,i.ELEMENT_ARRAY_BUFFER),(G||a)&&(a=!1,v(_,P,D,F),k!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function c(){return i.createVertexArray()}function l(_){return i.bindVertexArray(_)}function h(_){return i.deleteVertexArray(_)}function u(_,P,D){let F=D.wireframe===!0,k=n[_.id];k===void 0&&(k={},n[_.id]=k);let G=k[P.id];G===void 0&&(G={},k[P.id]=G);let V=G[F];return V===void 0&&(V=f(c()),G[F]=V),V}function f(_){let P=[],D=[],F=[];for(let k=0;k<t;k++)P[k]=0,D[k]=0,F[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:D,attributeDivisors:F,object:_,attributes:{},index:null}}function d(_,P,D,F){let k=r.attributes,G=P.attributes,V=0,ee=D.getAttributes();for(let W in ee)if(ee[W].location>=0){let $=k[W],Z=G[W];if(Z===void 0&&(W==="instanceMatrix"&&_.instanceMatrix&&(Z=_.instanceMatrix),W==="instanceColor"&&_.instanceColor&&(Z=_.instanceColor)),$===void 0||$.attribute!==Z||Z&&$.data!==Z.data)return!0;V++}return r.attributesNum!==V||r.index!==F}function p(_,P,D,F){let k={},G=P.attributes,V=0,ee=D.getAttributes();for(let W in ee)if(ee[W].location>=0){let $=G[W];$===void 0&&(W==="instanceMatrix"&&_.instanceMatrix&&($=_.instanceMatrix),W==="instanceColor"&&_.instanceColor&&($=_.instanceColor));let Z={};Z.attribute=$,$&&$.data&&(Z.data=$.data),k[W]=Z,V++}r.attributes=k,r.attributesNum=V,r.index=F}function x(){let _=r.newAttributes;for(let P=0,D=_.length;P<D;P++)_[P]=0}function g(_){m(_,0)}function m(_,P){let D=r.newAttributes,F=r.enabledAttributes,k=r.attributeDivisors;D[_]=1,F[_]===0&&(i.enableVertexAttribArray(_),F[_]=1),k[_]!==P&&(i.vertexAttribDivisor(_,P),k[_]=P)}function b(){let _=r.newAttributes,P=r.enabledAttributes;for(let D=0,F=P.length;D<F;D++)P[D]!==_[D]&&(i.disableVertexAttribArray(D),P[D]=0)}function S(_,P,D,F,k,G,V){V===!0?i.vertexAttribIPointer(_,P,D,k,G):i.vertexAttribPointer(_,P,D,F,k,G)}function v(_,P,D,F){x();let k=F.attributes,G=D.getAttributes(),V=P.defaultAttributeValues;for(let ee in G){let W=G[ee];if(W.location>=0){let ce=k[ee];if(ce===void 0&&(ee==="instanceMatrix"&&_.instanceMatrix&&(ce=_.instanceMatrix),ee==="instanceColor"&&_.instanceColor&&(ce=_.instanceColor)),ce!==void 0){let $=ce.normalized,Z=ce.itemSize,Re=e.get(ce);if(Re===void 0)continue;let nt=Re.buffer,Xe=Re.type,et=Re.bytesPerElement,Q=Xe===i.INT||Xe===i.UNSIGNED_INT||ce.gpuType===Tl;if(ce.isInterleavedBufferAttribute){let ne=ce.data,Me=ne.stride,Ve=ce.offset;if(ne.isInstancedInterleavedBuffer){for(let Ue=0;Ue<W.locationSize;Ue++)m(W.location+Ue,ne.meshPerAttribute);_.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Ue=0;Ue<W.locationSize;Ue++)g(W.location+Ue);i.bindBuffer(i.ARRAY_BUFFER,nt);for(let Ue=0;Ue<W.locationSize;Ue++)S(W.location+Ue,Z/W.locationSize,Xe,$,Me*et,(Ve+Z/W.locationSize*Ue)*et,Q)}else{if(ce.isInstancedBufferAttribute){for(let ne=0;ne<W.locationSize;ne++)m(W.location+ne,ce.meshPerAttribute);_.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let ne=0;ne<W.locationSize;ne++)g(W.location+ne);i.bindBuffer(i.ARRAY_BUFFER,nt);for(let ne=0;ne<W.locationSize;ne++)S(W.location+ne,Z/W.locationSize,Xe,$,Z*et,Z/W.locationSize*ne*et,Q)}}else if(V!==void 0){let $=V[ee];if($!==void 0)switch($.length){case 2:i.vertexAttrib2fv(W.location,$);break;case 3:i.vertexAttrib3fv(W.location,$);break;case 4:i.vertexAttrib4fv(W.location,$);break;default:i.vertexAttrib1fv(W.location,$)}}}}b()}function I(){A();for(let _ in n){let P=n[_];for(let D in P){let F=P[D];for(let k in F)h(F[k].object),delete F[k];delete P[D]}delete n[_]}}function y(_){if(n[_.id]===void 0)return;let P=n[_.id];for(let D in P){let F=P[D];for(let k in F)h(F[k].object),delete F[k];delete P[D]}delete n[_.id]}function w(_){for(let P in n){let D=n[P];if(D[_.id]===void 0)continue;let F=D[_.id];for(let k in F)h(F[k].object),delete F[k];delete D[_.id]}}function A(){M(),a=!0,r!==s&&(r=s,l(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:M,dispose:I,releaseStatesOfGeometry:y,releaseStatesOfProgram:w,initAttributes:x,enableAttribute:g,disableUnusedAttributes:b}}function Ev(i,e,t){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),t.update(h,n,1)}function a(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),t.update(h,n,u))}function o(l,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let d=0;for(let p=0;p<u;p++)d+=h[p];t.update(d,n,1)}function c(l,h,u,f){if(u===0)return;let d=e.get("WEBGL_multi_draw");if(d===null)for(let p=0;p<l.length;p++)a(l[p],h[p],f[p]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,f,0,u);let p=0;for(let x=0;x<u;x++)p+=h[x]*f[x];t.update(p,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function wv(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let w=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(w){return!(w!==Dn&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){let A=w===_r&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==qn&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==$n&&!A)}function c(w){if(w==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),S=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),I=p>0,y=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:p,maxTextureSize:x,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:b,maxVaryings:S,maxFragmentUniforms:v,vertexTextures:I,maxSamples:y}}function Tv(i){let e=this,t=null,n=0,s=!1,r=!1,a=new jn,o=new Ye,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,d){let p=u.clippingPlanes,x=u.clipIntersection,g=u.clipShadows,m=i.get(u);if(!s||p===null||p.length===0||r&&!g)r?h(null):l();else{let b=r?0:n,S=b*4,v=m.clippingState||null;c.value=v,v=h(p,f,S,d);for(let I=0;I!==S;++I)v[I]=t[I];m.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=b}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,d,p){let x=u!==null?u.length:0,g=null;if(x!==0){if(g=c.value,p!==!0||g===null){let m=d+x*4,b=f.matrixWorldInverse;o.getNormalMatrix(b),(g===null||g.length<m)&&(g=new Float32Array(m));for(let S=0,v=d;S!==x;++S,v+=4)a.copy(u[S]).applyMatrix4(b,o),a.normal.toArray(g,v),g[v+3]=a.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}function Av(i){let e=new WeakMap;function t(a,o){return o===yr?a.mapping=hs:o===El&&(a.mapping=us),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===yr||o===El)if(e.has(a)){let c=e.get(a).texture;return t(c,a.mapping)}else{let c=a.image;if(c&&c.height>0){let l=new Xo(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",s),t(l.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var Er=4,op=[.125,.215,.35,.446,.526,.582],xs=20,cu=new La,lp=new Ae,hu=null,uu=0,du=0,fu=!1,gs=(1+Math.sqrt(5))/2,Sr=1/gs,cp=[new U(-gs,Sr,0),new U(gs,Sr,0),new U(-Sr,0,gs),new U(Sr,0,gs),new U(0,gs,-Sr),new U(0,gs,Sr),new U(-1,1,-1),new U(1,1,-1),new U(-1,1,1),new U(1,1,1)],Rv=new U,hc=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=Rv}=r;hu=this._renderer.getRenderTarget(),uu=this._renderer.getActiveCubeFace(),du=this._renderer.getActiveMipmapLevel(),fu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=dp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=up(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(hu,uu,du),this._renderer.xr.enabled=fu,e.scissorTest=!1,lc(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===hs||e.mapping===us?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),hu=this._renderer.getRenderTarget(),uu=this._renderer.getActiveCubeFace(),du=this._renderer.getActiveMipmapLevel(),fu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:zn,minFilter:zn,generateMipmaps:!1,type:_r,format:Dn,colorSpace:rs,depthBuffer:!1},s=hp(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=hp(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Cv(r)),this._blurMaterial=Iv(r,e,t)}return s}_compileMaterial(e){let t=new ve(this._lodPlanes[0],e);this._renderer.compile(t,cu)}_sceneToCubeUV(e,t,n,s,r){let c=new nn(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(lp),u.toneMapping=Ri,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let x=new st({name:"PMREM.Background",side:Wt,depthWrite:!1,depthTest:!1}),g=new ve(new xt,x),m=!1,b=e.background;b?b.isColor&&(x.color.copy(b),e.background=null,m=!0):(x.color.copy(lp),m=!0);for(let S=0;S<6;S++){let v=S%3;v===0?(c.up.set(0,l[S],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[S],r.y,r.z)):v===1?(c.up.set(0,0,l[S]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[S],r.z)):(c.up.set(0,l[S],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[S]));let I=this._cubeSize;lc(s,v*I,S>2?I:0,I,I),u.setRenderTarget(s),m&&u.render(g,c),u.render(e,c)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=d,u.autoClear=f,e.background=b}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===hs||e.mapping===us;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=dp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=up());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new ve(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;let c=this._cubeSize;lc(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,cu)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=cp[(s-r-1)%cp.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){let c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new ve(this._lodPlanes[s],l),f=l.uniforms,d=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*xs-1),x=r/p,g=isFinite(r)?1+Math.floor(h*x):xs;g>xs&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${xs}`);let m=[],b=0;for(let w=0;w<xs;++w){let A=w/x,M=Math.exp(-A*A/2);m.push(M),w===0?b+=M:w<g&&(b+=2*M)}for(let w=0;w<m.length;w++)m[w]=m[w]/b;f.envMap.value=e.texture,f.samples.value=g,f.weights.value=m,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);let{_lodMax:S}=this;f.dTheta.value=p,f.mipInt.value=S-n;let v=this._sizeLods[s],I=3*v*(s>S-Er?s-S+Er:0),y=4*(this._cubeSize-v);lc(t,I,y,3*v,2*v),c.setRenderTarget(t),c.render(u,cu)}};function Cv(i){let e=[],t=[],n=[],s=i,r=i-Er+1+op.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);t.push(o);let c=1/o;a>i-Er?c=op[a-i+Er-1]:a===0&&(c=0),n.push(c);let l=1/(o-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,p=6,x=3,g=2,m=1,b=new Float32Array(x*p*d),S=new Float32Array(g*p*d),v=new Float32Array(m*p*d);for(let y=0;y<d;y++){let w=y%3*2/3-1,A=y>2?0:-1,M=[w,A,0,w+2/3,A,0,w+2/3,A+1,0,w,A,0,w+2/3,A+1,0,w,A+1,0];b.set(M,x*p*y),S.set(f,g*p*y);let _=[y,y,y,y,y,y];v.set(_,m*p*y)}let I=new tt;I.setAttribute("position",new kt(b,x)),I.setAttribute("uv",new kt(S,g)),I.setAttribute("faceIndex",new kt(v,m)),e.push(I),s>Er&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function hp(i,e,t){let n=new ei(i,e,t);return n.texture.mapping=Da,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function lc(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Iv(i,e,t){let n=new Float32Array(xs),s=new U(0,1,0);return new Wn({name:"SphericalGaussianBlur",defines:{n:xs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Su(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function up(){return new Wn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Su(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function dp(){return new Wn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Su(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function Su(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Pv(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){let c=o.mapping,l=c===yr||c===El,h=c===hs||c===us;if(l||h){let u=e.get(o),f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new hc(i)),u=l?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{let d=o.image;return l&&d&&d.height>0||h&&d&&s(d)?(t===null&&(t=new hc(i)),u=l?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0,l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){let c=o.target;c.removeEventListener("dispose",r);let l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Lv(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&or("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Dv(i,e,t,n){let s={},r=new WeakMap;function a(u){let f=u.target;f.index!==null&&e.remove(f.index);for(let p in f.attributes)e.remove(f.attributes[p]);f.removeEventListener("dispose",a),delete s[f.id];let d=r.get(f);d&&(e.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function c(u){let f=u.attributes;for(let d in f)e.update(f[d],i.ARRAY_BUFFER)}function l(u){let f=[],d=u.index,p=u.attributes.position,x=0;if(d!==null){let b=d.array;x=d.version;for(let S=0,v=b.length;S<v;S+=3){let I=b[S+0],y=b[S+1],w=b[S+2];f.push(I,y,y,w,w,I)}}else if(p!==void 0){let b=p.array;x=p.version;for(let S=0,v=b.length/3-1;S<v;S+=3){let I=S+0,y=S+1,w=S+2;f.push(I,y,y,w,w,I)}}else return;let g=new(iu(f)?da:ua)(f,1);g.version=x;let m=r.get(u);m&&e.remove(m),r.set(u,g)}function h(u){let f=r.get(u);if(f){let d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function Uv(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function c(f,d){i.drawElements(n,d,r,f*a),t.update(d,n,1)}function l(f,d,p){p!==0&&(i.drawElementsInstanced(n,d,r,f*a,p),t.update(d,n,p))}function h(f,d,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,p);let g=0;for(let m=0;m<p;m++)g+=d[m];t.update(g,n,1)}function u(f,d,p,x){if(p===0)return;let g=e.get("WEBGL_multi_draw");if(g===null)for(let m=0;m<f.length;m++)l(f[m]/a,d[m],x[m]);else{g.multiDrawElementsInstancedWEBGL(n,d,0,r,f,0,x,0,p);let m=0;for(let b=0;b<p;b++)m+=d[b]*x[b];t.update(m,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Nv(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Fv(i,e,t){let n=new WeakMap,s=new Ut;function r(a,o,c){let l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0,f=n.get(o);if(f===void 0||f.count!==u){let M=function(){w.dispose(),n.delete(o),o.removeEventListener("dispose",M)};f!==void 0&&f.texture.dispose();let d=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],b=o.morphAttributes.color||[],S=0;d===!0&&(S=1),p===!0&&(S=2),x===!0&&(S=3);let v=o.attributes.position.count*S,I=1;v>e.maxTextureSize&&(I=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let y=new Float32Array(v*I*4*u),w=new la(y,v,I,u);w.type=$n,w.needsUpdate=!0;let A=S*4;for(let _=0;_<u;_++){let P=g[_],D=m[_],F=b[_],k=v*I*4*_;for(let G=0;G<P.count;G++){let V=G*A;d===!0&&(s.fromBufferAttribute(P,G),y[k+V+0]=s.x,y[k+V+1]=s.y,y[k+V+2]=s.z,y[k+V+3]=0),p===!0&&(s.fromBufferAttribute(D,G),y[k+V+4]=s.x,y[k+V+5]=s.y,y[k+V+6]=s.z,y[k+V+7]=0),x===!0&&(s.fromBufferAttribute(F,G),y[k+V+8]=s.x,y[k+V+9]=s.y,y[k+V+10]=s.z,y[k+V+11]=F.itemSize===4?s.w:1)}}f={count:u,texture:w,size:new pe(v,I)},n.set(o,f),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let d=0;for(let x=0;x<l.length;x++)d+=l[x];let p=o.morphTargetsRelative?1:1-d;c.getUniforms().setValue(i,"morphTargetBaseInfluence",p),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function Ov(i,e,t,n){let s=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,u=e.get(c,h);if(s.get(u)!==l&&(e.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function a(){s=new WeakMap}function o(c){let l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:a}}var Pp=new ln,fp=new ya(1,1),Lp=new la,Dp=new Vo,Up=new pa,pp=[],mp=[],gp=new Float32Array(16),xp=new Float32Array(9),yp=new Float32Array(4);function Tr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=pp[s];if(r===void 0&&(r=new Float32Array(s),pp[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Xt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function qt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function dc(i,e){let t=mp[e];t===void 0&&(t=new Int32Array(e),mp[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function kv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Bv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;i.uniform2fv(this.addr,e),qt(t,e)}}function Hv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Xt(t,e))return;i.uniform3fv(this.addr,e),qt(t,e)}}function zv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;i.uniform4fv(this.addr,e),qt(t,e)}}function Gv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;yp.set(n),i.uniformMatrix2fv(this.addr,!1,yp),qt(t,n)}}function Vv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;xp.set(n),i.uniformMatrix3fv(this.addr,!1,xp),qt(t,n)}}function Wv(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;gp.set(n),i.uniformMatrix4fv(this.addr,!1,gp),qt(t,n)}}function Xv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function qv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;i.uniform2iv(this.addr,e),qt(t,e)}}function $v(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Xt(t,e))return;i.uniform3iv(this.addr,e),qt(t,e)}}function Yv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;i.uniform4iv(this.addr,e),qt(t,e)}}function Zv(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Kv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;i.uniform2uiv(this.addr,e),qt(t,e)}}function Jv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Xt(t,e))return;i.uniform3uiv(this.addr,e),qt(t,e)}}function jv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;i.uniform4uiv(this.addr,e),qt(t,e)}}function Qv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(fp.compareFunction=eu,r=fp):r=Pp,t.setTexture2D(e||r,s)}function e_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Dp,s)}function t_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Up,s)}function n_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Lp,s)}function i_(i){switch(i){case 5126:return kv;case 35664:return Bv;case 35665:return Hv;case 35666:return zv;case 35674:return Gv;case 35675:return Vv;case 35676:return Wv;case 5124:case 35670:return Xv;case 35667:case 35671:return qv;case 35668:case 35672:return $v;case 35669:case 35673:return Yv;case 5125:return Zv;case 36294:return Kv;case 36295:return Jv;case 36296:return jv;case 35678:case 36198:case 36298:case 36306:case 35682:return Qv;case 35679:case 36299:case 36307:return e_;case 35680:case 36300:case 36308:case 36293:return t_;case 36289:case 36303:case 36311:case 36292:return n_}}function s_(i,e){i.uniform1fv(this.addr,e)}function r_(i,e){let t=Tr(e,this.size,2);i.uniform2fv(this.addr,t)}function a_(i,e){let t=Tr(e,this.size,3);i.uniform3fv(this.addr,t)}function o_(i,e){let t=Tr(e,this.size,4);i.uniform4fv(this.addr,t)}function l_(i,e){let t=Tr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function c_(i,e){let t=Tr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function h_(i,e){let t=Tr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function u_(i,e){i.uniform1iv(this.addr,e)}function d_(i,e){i.uniform2iv(this.addr,e)}function f_(i,e){i.uniform3iv(this.addr,e)}function p_(i,e){i.uniform4iv(this.addr,e)}function m_(i,e){i.uniform1uiv(this.addr,e)}function g_(i,e){i.uniform2uiv(this.addr,e)}function x_(i,e){i.uniform3uiv(this.addr,e)}function y_(i,e){i.uniform4uiv(this.addr,e)}function v_(i,e,t){let n=this.cache,s=e.length,r=dc(t,s);Xt(n,r)||(i.uniform1iv(this.addr,r),qt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Pp,r[a])}function __(i,e,t){let n=this.cache,s=e.length,r=dc(t,s);Xt(n,r)||(i.uniform1iv(this.addr,r),qt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Dp,r[a])}function b_(i,e,t){let n=this.cache,s=e.length,r=dc(t,s);Xt(n,r)||(i.uniform1iv(this.addr,r),qt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Up,r[a])}function M_(i,e,t){let n=this.cache,s=e.length,r=dc(t,s);Xt(n,r)||(i.uniform1iv(this.addr,r),qt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Lp,r[a])}function S_(i){switch(i){case 5126:return s_;case 35664:return r_;case 35665:return a_;case 35666:return o_;case 35674:return l_;case 35675:return c_;case 35676:return h_;case 5124:case 35670:return u_;case 35667:case 35671:return d_;case 35668:case 35672:return f_;case 35669:case 35673:return p_;case 5125:return m_;case 36294:return g_;case 36295:return x_;case 36296:return y_;case 35678:case 36198:case 36298:case 36306:case 35682:return v_;case 35679:case 36299:case 36307:return __;case 35680:case 36300:case 36308:case 36293:return b_;case 36289:case 36303:case 36311:case 36292:return M_}}var mu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=i_(t.type)}},gu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=S_(t.type)}},xu=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},pu=/(\w+)(\])?(\[|\.)?/g;function vp(i,e){i.seq.push(e),i.map[e.id]=e}function E_(i,e,t){let n=i.name,s=n.length;for(pu.lastIndex=0;;){let r=pu.exec(n),a=pu.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){vp(t,l===void 0?new mu(o,i,e):new gu(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new xu(o),vp(t,u)),t=u}}}var wr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);E_(r,a,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function _p(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var w_=37297,T_=0;function A_(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var bp=new Ye;function R_(i){ot._getMatrix(bp,ot.workingColorSpace,i);let e=`mat3( ${bp.elements.map(t=>t.toFixed(4))} )`;switch(ot.getTransfer(i)){case ra:return[e,"LinearTransferOETF"];case ut:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Mp(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+A_(i.getShaderSource(e),o)}else return r}function C_(i,e){let t=R_(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function I_(i,e){let t;switch(e){case Uf:t="Linear";break;case Nf:t="Reinhard";break;case Ff:t="Cineon";break;case Sl:t="ACESFilmic";break;case kf:t="AgX";break;case Bf:t="Neutral";break;case Of:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var cc=new U;function P_(){ot.getLuminanceCoefficients(cc);let i=cc.x.toFixed(4),e=cc.y.toFixed(4),t=cc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function L_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ba).join(`
`)}function D_(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function U_(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Ba(i){return i!==""}function Sp(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ep(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var N_=/^[ \t]*#include +<([\w\d./]+)>/gm;function yu(i){return i.replace(N_,O_)}var F_=new Map;function O_(i,e){let t=Je[e];if(t===void 0){let n=F_.get(e);if(n!==void 0)t=Je[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return yu(t)}var k_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function wp(i){return i.replace(k_,B_)}function B_(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Tp(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function H_(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===zh?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===ml?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===ri&&(e="SHADOWMAP_TYPE_VSM"),e}function z_(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case hs:case us:e="ENVMAP_TYPE_CUBE";break;case Da:e="ENVMAP_TYPE_CUBE_UV";break}return e}function G_(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case us:e="ENVMAP_MODE_REFRACTION";break}return e}function V_(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Wh:e="ENVMAP_BLENDING_MULTIPLY";break;case Lf:e="ENVMAP_BLENDING_MIX";break;case Df:e="ENVMAP_BLENDING_ADD";break}return e}function W_(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function X_(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,c=H_(t),l=z_(t),h=G_(t),u=V_(t),f=W_(t),d=L_(t),p=D_(r),x=s.createProgram(),g,m,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(Ba).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(Ba).join(`
`),m.length>0&&(m+=`
`)):(g=[Tp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ba).join(`
`),m=[Tp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ri?"#define TONE_MAPPING":"",t.toneMapping!==Ri?Je.tonemapping_pars_fragment:"",t.toneMapping!==Ri?I_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Je.colorspace_pars_fragment,C_("linearToOutputTexel",t.outputColorSpace),P_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ba).join(`
`)),a=yu(a),a=Sp(a,t),a=Ep(a,t),o=yu(o),o=Sp(o,t),o=Ep(o,t),a=wp(a),o=wp(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",t.glslVersion===tu?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===tu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let S=b+g+a,v=b+m+o,I=_p(s,s.VERTEX_SHADER,S),y=_p(s,s.FRAGMENT_SHADER,v);s.attachShader(x,I),s.attachShader(x,y),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function w(P){if(i.debug.checkShaderErrors){let D=s.getProgramInfoLog(x)||"",F=s.getShaderInfoLog(I)||"",k=s.getShaderInfoLog(y)||"",G=D.trim(),V=F.trim(),ee=k.trim(),W=!0,ce=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,I,y);else{let $=Mp(s,I,"vertex"),Z=Mp(s,y,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+G+`
`+$+`
`+Z)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(V===""||ee==="")&&(ce=!1);ce&&(P.diagnostics={runnable:W,programLog:G,vertexShader:{log:V,prefix:g},fragmentShader:{log:ee,prefix:m}})}s.deleteShader(I),s.deleteShader(y),A=new wr(s,x),M=U_(s,x)}let A;this.getUniforms=function(){return A===void 0&&w(this),A};let M;this.getAttributes=function(){return M===void 0&&w(this),M};let _=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(x,w_)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=T_++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=I,this.fragmentShader=y,this}var q_=0,vu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new _u(e),t.set(e,n)),n}},_u=class{constructor(e){this.id=q_++,this.code=e,this.usedTimes=0}};function $_(i,e,t,n,s,r,a){let o=new ha,c=new vu,l=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures,d=s.precision,p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(M){return l.add(M),M===0?"uv":`uv${M}`}function g(M,_,P,D,F){let k=D.fog,G=F.geometry,V=M.isMeshStandardMaterial?D.environment:null,ee=(M.isMeshStandardMaterial?t:e).get(M.envMap||V),W=ee&&ee.mapping===Da?ee.image.height:null,ce=p[M.type];M.precision!==null&&(d=s.getMaxPrecision(M.precision),d!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",d,"instead."));let $=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Z=$!==void 0?$.length:0,Re=0;G.morphAttributes.position!==void 0&&(Re=1),G.morphAttributes.normal!==void 0&&(Re=2),G.morphAttributes.color!==void 0&&(Re=3);let nt,Xe,et,Q;if(ce){let ct=ai[ce];nt=ct.vertexShader,Xe=ct.fragmentShader}else nt=M.vertexShader,Xe=M.fragmentShader,c.update(M),et=c.getVertexShaderID(M),Q=c.getFragmentShaderID(M);let ne=i.getRenderTarget(),Me=i.state.buffers.depth.getReversed(),Ve=F.isInstancedMesh===!0,Ue=F.isBatchedMesh===!0,at=!!M.map,Qt=!!M.matcap,N=!!ee,At=!!M.aoMap,$e=!!M.lightMap,He=!!M.bumpMap,we=!!M.normalMap,Rt=!!M.displacementMap,Te=!!M.emissiveMap,Ke=!!M.metalnessMap,Yt=!!M.roughnessMap,Ot=M.anisotropy>0,L=M.clearcoat>0,E=M.dispersion>0,z=M.iridescence>0,j=M.sheen>0,ie=M.transmission>0,K=Ot&&!!M.anisotropyMap,De=L&&!!M.clearcoatMap,he=L&&!!M.clearcoatNormalMap,Ce=L&&!!M.clearcoatRoughnessMap,Ie=z&&!!M.iridescenceMap,oe=z&&!!M.iridescenceThicknessMap,ye=j&&!!M.sheenColorMap,Be=j&&!!M.sheenRoughnessMap,Pe=!!M.specularMap,ge=!!M.specularColorMap,Ze=!!M.specularIntensityMap,O=ie&&!!M.transmissionMap,le=ie&&!!M.thicknessMap,de=!!M.gradientMap,be=!!M.alphaMap,re=M.alphaTest>0,te=!!M.alphaHash,Ee=!!M.extensions,qe=Ri;M.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(qe=i.toneMapping);let _t={shaderID:ce,shaderType:M.type,shaderName:M.name,vertexShader:nt,fragmentShader:Xe,defines:M.defines,customVertexShaderID:et,customFragmentShaderID:Q,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:d,batching:Ue,batchingColor:Ue&&F._colorsTexture!==null,instancing:Ve,instancingColor:Ve&&F.instanceColor!==null,instancingMorph:Ve&&F.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ne===null?i.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:rs,alphaToCoverage:!!M.alphaToCoverage,map:at,matcap:Qt,envMap:N,envMapMode:N&&ee.mapping,envMapCubeUVHeight:W,aoMap:At,lightMap:$e,bumpMap:He,normalMap:we,displacementMap:f&&Rt,emissiveMap:Te,normalMapObjectSpace:we&&M.normalMapType===Vf,normalMapTangentSpace:we&&M.normalMapType===Qh,metalnessMap:Ke,roughnessMap:Yt,anisotropy:Ot,anisotropyMap:K,clearcoat:L,clearcoatMap:De,clearcoatNormalMap:he,clearcoatRoughnessMap:Ce,dispersion:E,iridescence:z,iridescenceMap:Ie,iridescenceThicknessMap:oe,sheen:j,sheenColorMap:ye,sheenRoughnessMap:Be,specularMap:Pe,specularColorMap:ge,specularIntensityMap:Ze,transmission:ie,transmissionMap:O,thicknessMap:le,gradientMap:de,opaque:M.transparent===!1&&M.blending===is&&M.alphaToCoverage===!1,alphaMap:be,alphaTest:re,alphaHash:te,combine:M.combine,mapUv:at&&x(M.map.channel),aoMapUv:At&&x(M.aoMap.channel),lightMapUv:$e&&x(M.lightMap.channel),bumpMapUv:He&&x(M.bumpMap.channel),normalMapUv:we&&x(M.normalMap.channel),displacementMapUv:Rt&&x(M.displacementMap.channel),emissiveMapUv:Te&&x(M.emissiveMap.channel),metalnessMapUv:Ke&&x(M.metalnessMap.channel),roughnessMapUv:Yt&&x(M.roughnessMap.channel),anisotropyMapUv:K&&x(M.anisotropyMap.channel),clearcoatMapUv:De&&x(M.clearcoatMap.channel),clearcoatNormalMapUv:he&&x(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ce&&x(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Ie&&x(M.iridescenceMap.channel),iridescenceThicknessMapUv:oe&&x(M.iridescenceThicknessMap.channel),sheenColorMapUv:ye&&x(M.sheenColorMap.channel),sheenRoughnessMapUv:Be&&x(M.sheenRoughnessMap.channel),specularMapUv:Pe&&x(M.specularMap.channel),specularColorMapUv:ge&&x(M.specularColorMap.channel),specularIntensityMapUv:Ze&&x(M.specularIntensityMap.channel),transmissionMapUv:O&&x(M.transmissionMap.channel),thicknessMapUv:le&&x(M.thicknessMap.channel),alphaMapUv:be&&x(M.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(we||Ot),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!G.attributes.uv&&(at||be),fog:!!k,useFog:M.fog===!0,fogExp2:!!k&&k.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Me,skinning:F.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:Z,morphTextureStride:Re,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:qe,decodeVideoTexture:at&&M.map.isVideoTexture===!0&&ot.getTransfer(M.map.colorSpace)===ut,decodeVideoTextureEmissive:Te&&M.emissiveMap.isVideoTexture===!0&&ot.getTransfer(M.emissiveMap.colorSpace)===ut,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Jt,flipSided:M.side===Wt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Ee&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ee&&M.extensions.multiDraw===!0||Ue)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return _t.vertexUv1s=l.has(1),_t.vertexUv2s=l.has(2),_t.vertexUv3s=l.has(3),l.clear(),_t}function m(M){let _=[];if(M.shaderID?_.push(M.shaderID):(_.push(M.customVertexShaderID),_.push(M.customFragmentShaderID)),M.defines!==void 0)for(let P in M.defines)_.push(P),_.push(M.defines[P]);return M.isRawShaderMaterial===!1&&(b(_,M),S(_,M),_.push(i.outputColorSpace)),_.push(M.customProgramCacheKey),_.join()}function b(M,_){M.push(_.precision),M.push(_.outputColorSpace),M.push(_.envMapMode),M.push(_.envMapCubeUVHeight),M.push(_.mapUv),M.push(_.alphaMapUv),M.push(_.lightMapUv),M.push(_.aoMapUv),M.push(_.bumpMapUv),M.push(_.normalMapUv),M.push(_.displacementMapUv),M.push(_.emissiveMapUv),M.push(_.metalnessMapUv),M.push(_.roughnessMapUv),M.push(_.anisotropyMapUv),M.push(_.clearcoatMapUv),M.push(_.clearcoatNormalMapUv),M.push(_.clearcoatRoughnessMapUv),M.push(_.iridescenceMapUv),M.push(_.iridescenceThicknessMapUv),M.push(_.sheenColorMapUv),M.push(_.sheenRoughnessMapUv),M.push(_.specularMapUv),M.push(_.specularColorMapUv),M.push(_.specularIntensityMapUv),M.push(_.transmissionMapUv),M.push(_.thicknessMapUv),M.push(_.combine),M.push(_.fogExp2),M.push(_.sizeAttenuation),M.push(_.morphTargetsCount),M.push(_.morphAttributeCount),M.push(_.numDirLights),M.push(_.numPointLights),M.push(_.numSpotLights),M.push(_.numSpotLightMaps),M.push(_.numHemiLights),M.push(_.numRectAreaLights),M.push(_.numDirLightShadows),M.push(_.numPointLightShadows),M.push(_.numSpotLightShadows),M.push(_.numSpotLightShadowsWithMaps),M.push(_.numLightProbes),M.push(_.shadowMapType),M.push(_.toneMapping),M.push(_.numClippingPlanes),M.push(_.numClipIntersection),M.push(_.depthPacking)}function S(M,_){o.disableAll(),_.supportsVertexTextures&&o.enable(0),_.instancing&&o.enable(1),_.instancingColor&&o.enable(2),_.instancingMorph&&o.enable(3),_.matcap&&o.enable(4),_.envMap&&o.enable(5),_.normalMapObjectSpace&&o.enable(6),_.normalMapTangentSpace&&o.enable(7),_.clearcoat&&o.enable(8),_.iridescence&&o.enable(9),_.alphaTest&&o.enable(10),_.vertexColors&&o.enable(11),_.vertexAlphas&&o.enable(12),_.vertexUv1s&&o.enable(13),_.vertexUv2s&&o.enable(14),_.vertexUv3s&&o.enable(15),_.vertexTangents&&o.enable(16),_.anisotropy&&o.enable(17),_.alphaHash&&o.enable(18),_.batching&&o.enable(19),_.dispersion&&o.enable(20),_.batchingColor&&o.enable(21),_.gradientMap&&o.enable(22),M.push(o.mask),o.disableAll(),_.fog&&o.enable(0),_.useFog&&o.enable(1),_.flatShading&&o.enable(2),_.logarithmicDepthBuffer&&o.enable(3),_.reversedDepthBuffer&&o.enable(4),_.skinning&&o.enable(5),_.morphTargets&&o.enable(6),_.morphNormals&&o.enable(7),_.morphColors&&o.enable(8),_.premultipliedAlpha&&o.enable(9),_.shadowMapEnabled&&o.enable(10),_.doubleSided&&o.enable(11),_.flipSided&&o.enable(12),_.useDepthPacking&&o.enable(13),_.dithering&&o.enable(14),_.transmission&&o.enable(15),_.sheen&&o.enable(16),_.opaque&&o.enable(17),_.pointsUvs&&o.enable(18),_.decodeVideoTexture&&o.enable(19),_.decodeVideoTextureEmissive&&o.enable(20),_.alphaToCoverage&&o.enable(21),M.push(o.mask)}function v(M){let _=p[M.type],P;if(_){let D=ai[_];P=ep.clone(D.uniforms)}else P=M.uniforms;return P}function I(M,_){let P;for(let D=0,F=h.length;D<F;D++){let k=h[D];if(k.cacheKey===_){P=k,++P.usedTimes;break}}return P===void 0&&(P=new X_(i,_,M,r),h.push(P)),P}function y(M){if(--M.usedTimes===0){let _=h.indexOf(M);h[_]=h[h.length-1],h.pop(),M.destroy()}}function w(M){c.remove(M)}function A(){c.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:v,acquireProgram:I,releaseProgram:y,releaseShaderCache:w,programs:h,dispose:A}}function Y_(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Z_(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Ap(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Rp(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u,f,d,p,x,g){let m=i[e];return m===void 0?(m={id:u.id,object:u,geometry:f,material:d,groupOrder:p,renderOrder:u.renderOrder,z:x,group:g},i[e]=m):(m.id=u.id,m.object=u,m.geometry=f,m.material=d,m.groupOrder=p,m.renderOrder=u.renderOrder,m.z=x,m.group=g),e++,m}function o(u,f,d,p,x,g){let m=a(u,f,d,p,x,g);d.transmission>0?n.push(m):d.transparent===!0?s.push(m):t.push(m)}function c(u,f,d,p,x,g){let m=a(u,f,d,p,x,g);d.transmission>0?n.unshift(m):d.transparent===!0?s.unshift(m):t.unshift(m)}function l(u,f){t.length>1&&t.sort(u||Z_),n.length>1&&n.sort(f||Ap),s.length>1&&s.sort(f||Ap)}function h(){for(let u=e,f=i.length;u<f;u++){let d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:h,sort:l}}function K_(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new Rp,i.set(n,[a])):s>=r.length?(a=new Rp,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function J_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new U,color:new Ae};break;case"SpotLight":t={position:new U,direction:new U,color:new Ae,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new U,color:new Ae,distance:0,decay:0};break;case"HemisphereLight":t={direction:new U,skyColor:new Ae,groundColor:new Ae};break;case"RectAreaLight":t={color:new Ae,position:new U,halfWidth:new U,halfHeight:new U};break}return i[e.id]=t,t}}}function j_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var Q_=0;function e1(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function t1(i){let e=new J_,t=j_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new U);let s=new U,r=new dt,a=new dt;function o(l){let h=0,u=0,f=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let d=0,p=0,x=0,g=0,m=0,b=0,S=0,v=0,I=0,y=0,w=0;l.sort(e1);for(let M=0,_=l.length;M<_;M++){let P=l[M],D=P.color,F=P.intensity,k=P.distance,G=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=D.r*F,u+=D.g*F,f+=D.b*F;else if(P.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(P.sh.coefficients[V],F);w++}else if(P.isDirectionalLight){let V=e.get(P);if(V.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let ee=P.shadow,W=t.get(P);W.shadowIntensity=ee.intensity,W.shadowBias=ee.bias,W.shadowNormalBias=ee.normalBias,W.shadowRadius=ee.radius,W.shadowMapSize=ee.mapSize,n.directionalShadow[d]=W,n.directionalShadowMap[d]=G,n.directionalShadowMatrix[d]=P.shadow.matrix,b++}n.directional[d]=V,d++}else if(P.isSpotLight){let V=e.get(P);V.position.setFromMatrixPosition(P.matrixWorld),V.color.copy(D).multiplyScalar(F),V.distance=k,V.coneCos=Math.cos(P.angle),V.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),V.decay=P.decay,n.spot[x]=V;let ee=P.shadow;if(P.map&&(n.spotLightMap[I]=P.map,I++,ee.updateMatrices(P),P.castShadow&&y++),n.spotLightMatrix[x]=ee.matrix,P.castShadow){let W=t.get(P);W.shadowIntensity=ee.intensity,W.shadowBias=ee.bias,W.shadowNormalBias=ee.normalBias,W.shadowRadius=ee.radius,W.shadowMapSize=ee.mapSize,n.spotShadow[x]=W,n.spotShadowMap[x]=G,v++}x++}else if(P.isRectAreaLight){let V=e.get(P);V.color.copy(D).multiplyScalar(F),V.halfWidth.set(P.width*.5,0,0),V.halfHeight.set(0,P.height*.5,0),n.rectArea[g]=V,g++}else if(P.isPointLight){let V=e.get(P);if(V.color.copy(P.color).multiplyScalar(P.intensity),V.distance=P.distance,V.decay=P.decay,P.castShadow){let ee=P.shadow,W=t.get(P);W.shadowIntensity=ee.intensity,W.shadowBias=ee.bias,W.shadowNormalBias=ee.normalBias,W.shadowRadius=ee.radius,W.shadowMapSize=ee.mapSize,W.shadowCameraNear=ee.camera.near,W.shadowCameraFar=ee.camera.far,n.pointShadow[p]=W,n.pointShadowMap[p]=G,n.pointShadowMatrix[p]=P.shadow.matrix,S++}n.point[p]=V,p++}else if(P.isHemisphereLight){let V=e.get(P);V.skyColor.copy(P.color).multiplyScalar(F),V.groundColor.copy(P.groundColor).multiplyScalar(F),n.hemi[m]=V,m++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=me.LTC_FLOAT_1,n.rectAreaLTC2=me.LTC_FLOAT_2):(n.rectAreaLTC1=me.LTC_HALF_1,n.rectAreaLTC2=me.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;let A=n.hash;(A.directionalLength!==d||A.pointLength!==p||A.spotLength!==x||A.rectAreaLength!==g||A.hemiLength!==m||A.numDirectionalShadows!==b||A.numPointShadows!==S||A.numSpotShadows!==v||A.numSpotMaps!==I||A.numLightProbes!==w)&&(n.directional.length=d,n.spot.length=x,n.rectArea.length=g,n.point.length=p,n.hemi.length=m,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=v+I-y,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=y,n.numLightProbes=w,A.directionalLength=d,A.pointLength=p,A.spotLength=x,A.rectAreaLength=g,A.hemiLength=m,A.numDirectionalShadows=b,A.numPointShadows=S,A.numSpotShadows=v,A.numSpotMaps=I,A.numLightProbes=w,n.version=Q_++)}function c(l,h){let u=0,f=0,d=0,p=0,x=0,g=h.matrixWorldInverse;for(let m=0,b=l.length;m<b;m++){let S=l[m];if(S.isDirectionalLight){let v=n.directional[u];v.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),u++}else if(S.isSpotLight){let v=n.spot[d];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(g),v.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(g),d++}else if(S.isRectAreaLight){let v=n.rectArea[p];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(g),a.identity(),r.copy(S.matrixWorld),r.premultiply(g),a.extractRotation(r),v.halfWidth.set(S.width*.5,0,0),v.halfHeight.set(0,S.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),p++}else if(S.isPointLight){let v=n.point[f];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(g),f++}else if(S.isHemisphereLight){let v=n.hemi[x];v.direction.setFromMatrixPosition(S.matrixWorld),v.direction.transformDirection(g),x++}}}return{setup:o,setupView:c,state:n}}function Cp(i){let e=new t1(i),t=[],n=[];function s(h){l.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function c(h){e.setupView(t,h)}let l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function n1(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new Cp(i),e.set(s,[o])):r>=a.length?(o=new Cp(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var i1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,s1=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function r1(i,e,t){let n=new dr,s=new pe,r=new pe,a=new Ut,o=new il({depthPacking:Gf}),c=new sl,l={},h=t.maxTextureSize,u={[yi]:Wt,[Wt]:yi,[Jt]:Jt},f=new Wn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new pe},radius:{value:4}},vertexShader:i1,fragmentShader:s1}),d=f.clone();d.defines.HORIZONTAL_PASS=1;let p=new tt;p.setAttribute("position",new kt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new ve(p,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=zh;let m=this.type;this.render=function(y,w,A){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||y.length===0)return;let M=i.getRenderTarget(),_=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),D=i.state;D.setBlending(Ai),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);let F=m!==ri&&this.type===ri,k=m===ri&&this.type!==ri;for(let G=0,V=y.length;G<V;G++){let ee=y[G],W=ee.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",ee,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);let ce=W.getFrameExtents();if(s.multiply(ce),r.copy(W.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ce.x),s.x=r.x*ce.x,W.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ce.y),s.y=r.y*ce.y,W.mapSize.y=r.y)),W.map===null||F===!0||k===!0){let Z=this.type!==ri?{minFilter:un,magFilter:un}:{};W.map!==null&&W.map.dispose(),W.map=new ei(s.x,s.y,Z),W.map.texture.name=ee.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();let $=W.getViewportCount();for(let Z=0;Z<$;Z++){let Re=W.getViewport(Z);a.set(r.x*Re.x,r.y*Re.y,r.x*Re.z,r.y*Re.w),D.viewport(a),W.updateMatrices(ee,Z),n=W.getFrustum(),v(w,A,W.camera,ee,this.type)}W.isPointLightShadow!==!0&&this.type===ri&&b(W,A),W.needsUpdate=!1}m=this.type,g.needsUpdate=!1,i.setRenderTarget(M,_,P)};function b(y,w){let A=e.update(x);f.defines.VSM_SAMPLES!==y.blurSamples&&(f.defines.VSM_SAMPLES=y.blurSamples,d.defines.VSM_SAMPLES=y.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),y.mapPass===null&&(y.mapPass=new ei(s.x,s.y)),f.uniforms.shadow_pass.value=y.map.texture,f.uniforms.resolution.value=y.mapSize,f.uniforms.radius.value=y.radius,i.setRenderTarget(y.mapPass),i.clear(),i.renderBufferDirect(w,null,A,f,x,null),d.uniforms.shadow_pass.value=y.mapPass.texture,d.uniforms.resolution.value=y.mapSize,d.uniforms.radius.value=y.radius,i.setRenderTarget(y.map),i.clear(),i.renderBufferDirect(w,null,A,d,x,null)}function S(y,w,A,M){let _=null,P=A.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(P!==void 0)_=P;else if(_=A.isPointLight===!0?c:o,i.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){let D=_.uuid,F=w.uuid,k=l[D];k===void 0&&(k={},l[D]=k);let G=k[F];G===void 0&&(G=_.clone(),k[F]=G,w.addEventListener("dispose",I)),_=G}if(_.visible=w.visible,_.wireframe=w.wireframe,M===ri?_.side=w.shadowSide!==null?w.shadowSide:w.side:_.side=w.shadowSide!==null?w.shadowSide:u[w.side],_.alphaMap=w.alphaMap,_.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,_.map=w.map,_.clipShadows=w.clipShadows,_.clippingPlanes=w.clippingPlanes,_.clipIntersection=w.clipIntersection,_.displacementMap=w.displacementMap,_.displacementScale=w.displacementScale,_.displacementBias=w.displacementBias,_.wireframeLinewidth=w.wireframeLinewidth,_.linewidth=w.linewidth,A.isPointLight===!0&&_.isMeshDistanceMaterial===!0){let D=i.properties.get(_);D.light=A}return _}function v(y,w,A,M,_){if(y.visible===!1)return;if(y.layers.test(w.layers)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&_===ri)&&(!y.frustumCulled||n.intersectsObject(y))){y.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,y.matrixWorld);let F=e.update(y),k=y.material;if(Array.isArray(k)){let G=F.groups;for(let V=0,ee=G.length;V<ee;V++){let W=G[V],ce=k[W.materialIndex];if(ce&&ce.visible){let $=S(y,ce,M,_);y.onBeforeShadow(i,y,w,A,F,$,W),i.renderBufferDirect(A,null,F,$,y,W),y.onAfterShadow(i,y,w,A,F,$,W)}}}else if(k.visible){let G=S(y,k,M,_);y.onBeforeShadow(i,y,w,A,F,G,null),i.renderBufferDirect(A,null,F,G,y,null),y.onAfterShadow(i,y,w,A,F,G,null)}}let D=y.children;for(let F=0,k=D.length;F<k;F++)v(D[F],w,A,M,_)}function I(y){y.target.removeEventListener("dispose",I);for(let A in l){let M=l[A],_=y.target.uuid;_ in M&&(M[_].dispose(),delete M[_])}}}var a1={[gl]:xl,[yl]:bl,[vl]:Ml,[ss]:_l,[xl]:gl,[bl]:yl,[Ml]:vl,[_l]:ss};function o1(i,e){function t(){let O=!1,le=new Ut,de=null,be=new Ut(0,0,0,0);return{setMask:function(re){de!==re&&!O&&(i.colorMask(re,re,re,re),de=re)},setLocked:function(re){O=re},setClear:function(re,te,Ee,qe,_t){_t===!0&&(re*=qe,te*=qe,Ee*=qe),le.set(re,te,Ee,qe),be.equals(le)===!1&&(i.clearColor(re,te,Ee,qe),be.copy(le))},reset:function(){O=!1,de=null,be.set(-1,0,0,0)}}}function n(){let O=!1,le=!1,de=null,be=null,re=null;return{setReversed:function(te){if(le!==te){let Ee=e.get("EXT_clip_control");te?Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.ZERO_TO_ONE_EXT):Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.NEGATIVE_ONE_TO_ONE_EXT),le=te;let qe=re;re=null,this.setClear(qe)}},getReversed:function(){return le},setTest:function(te){te?ne(i.DEPTH_TEST):Me(i.DEPTH_TEST)},setMask:function(te){de!==te&&!O&&(i.depthMask(te),de=te)},setFunc:function(te){if(le&&(te=a1[te]),be!==te){switch(te){case gl:i.depthFunc(i.NEVER);break;case xl:i.depthFunc(i.ALWAYS);break;case yl:i.depthFunc(i.LESS);break;case ss:i.depthFunc(i.LEQUAL);break;case vl:i.depthFunc(i.EQUAL);break;case _l:i.depthFunc(i.GEQUAL);break;case bl:i.depthFunc(i.GREATER);break;case Ml:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}be=te}},setLocked:function(te){O=te},setClear:function(te){re!==te&&(le&&(te=1-te),i.clearDepth(te),re=te)},reset:function(){O=!1,de=null,be=null,re=null,le=!1}}}function s(){let O=!1,le=null,de=null,be=null,re=null,te=null,Ee=null,qe=null,_t=null;return{setTest:function(ct){O||(ct?ne(i.STENCIL_TEST):Me(i.STENCIL_TEST))},setMask:function(ct){le!==ct&&!O&&(i.stencilMask(ct),le=ct)},setFunc:function(ct,hi,Kn){(de!==ct||be!==hi||re!==Kn)&&(i.stencilFunc(ct,hi,Kn),de=ct,be=hi,re=Kn)},setOp:function(ct,hi,Kn){(te!==ct||Ee!==hi||qe!==Kn)&&(i.stencilOp(ct,hi,Kn),te=ct,Ee=hi,qe=Kn)},setLocked:function(ct){O=ct},setClear:function(ct){_t!==ct&&(i.clearStencil(ct),_t=ct)},reset:function(){O=!1,le=null,de=null,be=null,re=null,te=null,Ee=null,qe=null,_t=null}}}let r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap,h={},u={},f=new WeakMap,d=[],p=null,x=!1,g=null,m=null,b=null,S=null,v=null,I=null,y=null,w=new Ae(0,0,0),A=0,M=!1,_=null,P=null,D=null,F=null,k=null,G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),V=!1,ee=0,W=i.getParameter(i.VERSION);W.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(W)[1]),V=ee>=1):W.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),V=ee>=2);let ce=null,$={},Z=i.getParameter(i.SCISSOR_BOX),Re=i.getParameter(i.VIEWPORT),nt=new Ut().fromArray(Z),Xe=new Ut().fromArray(Re);function et(O,le,de,be){let re=new Uint8Array(4),te=i.createTexture();i.bindTexture(O,te),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ee=0;Ee<de;Ee++)O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY?i.texImage3D(le,0,i.RGBA,1,1,be,0,i.RGBA,i.UNSIGNED_BYTE,re):i.texImage2D(le+Ee,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,re);return te}let Q={};Q[i.TEXTURE_2D]=et(i.TEXTURE_2D,i.TEXTURE_2D,1),Q[i.TEXTURE_CUBE_MAP]=et(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[i.TEXTURE_2D_ARRAY]=et(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Q[i.TEXTURE_3D]=et(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ne(i.DEPTH_TEST),a.setFunc(ss),He(!1),we(Hh),ne(i.CULL_FACE),At(Ai);function ne(O){h[O]!==!0&&(i.enable(O),h[O]=!0)}function Me(O){h[O]!==!1&&(i.disable(O),h[O]=!1)}function Ve(O,le){return u[O]!==le?(i.bindFramebuffer(O,le),u[O]=le,O===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=le),O===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=le),!0):!1}function Ue(O,le){let de=d,be=!1;if(O){de=f.get(le),de===void 0&&(de=[],f.set(le,de));let re=O.textures;if(de.length!==re.length||de[0]!==i.COLOR_ATTACHMENT0){for(let te=0,Ee=re.length;te<Ee;te++)de[te]=i.COLOR_ATTACHMENT0+te;de.length=re.length,be=!0}}else de[0]!==i.BACK&&(de[0]=i.BACK,be=!0);be&&i.drawBuffers(de)}function at(O){return p!==O?(i.useProgram(O),p=O,!0):!1}let Qt={[Bi]:i.FUNC_ADD,[mf]:i.FUNC_SUBTRACT,[gf]:i.FUNC_REVERSE_SUBTRACT};Qt[xf]=i.MIN,Qt[yf]=i.MAX;let N={[vf]:i.ZERO,[_f]:i.ONE,[bf]:i.SRC_COLOR,[Fo]:i.SRC_ALPHA,[Af]:i.SRC_ALPHA_SATURATE,[wf]:i.DST_COLOR,[Sf]:i.DST_ALPHA,[Mf]:i.ONE_MINUS_SRC_COLOR,[Oo]:i.ONE_MINUS_SRC_ALPHA,[Tf]:i.ONE_MINUS_DST_COLOR,[Ef]:i.ONE_MINUS_DST_ALPHA,[Rf]:i.CONSTANT_COLOR,[Cf]:i.ONE_MINUS_CONSTANT_COLOR,[If]:i.CONSTANT_ALPHA,[Pf]:i.ONE_MINUS_CONSTANT_ALPHA};function At(O,le,de,be,re,te,Ee,qe,_t,ct){if(O===Ai){x===!0&&(Me(i.BLEND),x=!1);return}if(x===!1&&(ne(i.BLEND),x=!0),O!==pf){if(O!==g||ct!==M){if((m!==Bi||v!==Bi)&&(i.blendEquation(i.FUNC_ADD),m=Bi,v=Bi),ct)switch(O){case is:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case wn:i.blendFunc(i.ONE,i.ONE);break;case Gh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Vh:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case is:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case wn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Gh:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Vh:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}b=null,S=null,I=null,y=null,w.set(0,0,0),A=0,g=O,M=ct}return}re=re||le,te=te||de,Ee=Ee||be,(le!==m||re!==v)&&(i.blendEquationSeparate(Qt[le],Qt[re]),m=le,v=re),(de!==b||be!==S||te!==I||Ee!==y)&&(i.blendFuncSeparate(N[de],N[be],N[te],N[Ee]),b=de,S=be,I=te,y=Ee),(qe.equals(w)===!1||_t!==A)&&(i.blendColor(qe.r,qe.g,qe.b,_t),w.copy(qe),A=_t),g=O,M=!1}function $e(O,le){O.side===Jt?Me(i.CULL_FACE):ne(i.CULL_FACE);let de=O.side===Wt;le&&(de=!de),He(de),O.blending===is&&O.transparent===!1?At(Ai):At(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),r.setMask(O.colorWrite);let be=O.stencilWrite;o.setTest(be),be&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),Te(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?ne(i.SAMPLE_ALPHA_TO_COVERAGE):Me(i.SAMPLE_ALPHA_TO_COVERAGE)}function He(O){_!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),_=O)}function we(O){O!==df?(ne(i.CULL_FACE),O!==P&&(O===Hh?i.cullFace(i.BACK):O===ff?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Me(i.CULL_FACE),P=O}function Rt(O){O!==D&&(V&&i.lineWidth(O),D=O)}function Te(O,le,de){O?(ne(i.POLYGON_OFFSET_FILL),(F!==le||k!==de)&&(i.polygonOffset(le,de),F=le,k=de)):Me(i.POLYGON_OFFSET_FILL)}function Ke(O){O?ne(i.SCISSOR_TEST):Me(i.SCISSOR_TEST)}function Yt(O){O===void 0&&(O=i.TEXTURE0+G-1),ce!==O&&(i.activeTexture(O),ce=O)}function Ot(O,le,de){de===void 0&&(ce===null?de=i.TEXTURE0+G-1:de=ce);let be=$[de];be===void 0&&(be={type:void 0,texture:void 0},$[de]=be),(be.type!==O||be.texture!==le)&&(ce!==de&&(i.activeTexture(de),ce=de),i.bindTexture(O,le||Q[O]),be.type=O,be.texture=le)}function L(){let O=$[ce];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function E(){try{i.compressedTexImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function z(){try{i.compressedTexImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function j(){try{i.texSubImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ie(){try{i.texSubImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function K(){try{i.compressedTexSubImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function De(){try{i.compressedTexSubImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function he(){try{i.texStorage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ce(){try{i.texStorage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ie(){try{i.texImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function oe(){try{i.texImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ye(O){nt.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),nt.copy(O))}function Be(O){Xe.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),Xe.copy(O))}function Pe(O,le){let de=l.get(le);de===void 0&&(de=new WeakMap,l.set(le,de));let be=de.get(O);be===void 0&&(be=i.getUniformBlockIndex(le,O.name),de.set(O,be))}function ge(O,le){let be=l.get(le).get(O);c.get(le)!==be&&(i.uniformBlockBinding(le,be,O.__bindingPointIndex),c.set(le,be))}function Ze(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ce=null,$={},u={},f=new WeakMap,d=[],p=null,x=!1,g=null,m=null,b=null,S=null,v=null,I=null,y=null,w=new Ae(0,0,0),A=0,M=!1,_=null,P=null,D=null,F=null,k=null,nt.set(0,0,i.canvas.width,i.canvas.height),Xe.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ne,disable:Me,bindFramebuffer:Ve,drawBuffers:Ue,useProgram:at,setBlending:At,setMaterial:$e,setFlipSided:He,setCullFace:we,setLineWidth:Rt,setPolygonOffset:Te,setScissorTest:Ke,activeTexture:Yt,bindTexture:Ot,unbindTexture:L,compressedTexImage2D:E,compressedTexImage3D:z,texImage2D:Ie,texImage3D:oe,updateUBOMapping:Pe,uniformBlockBinding:ge,texStorage2D:he,texStorage3D:Ce,texSubImage2D:j,texSubImage3D:ie,compressedTexSubImage2D:K,compressedTexSubImage3D:De,scissor:ye,viewport:Be,reset:Ze}}function l1(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new pe,h=new WeakMap,u,f=new WeakMap,d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(L,E){return d?new OffscreenCanvas(L,E):oa("canvas")}function x(L,E,z){let j=1,ie=Ot(L);if((ie.width>z||ie.height>z)&&(j=z/Math.max(ie.width,ie.height)),j<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){let K=Math.floor(j*ie.width),De=Math.floor(j*ie.height);u===void 0&&(u=p(K,De));let he=E?p(K,De):u;return he.width=K,he.height=De,he.getContext("2d").drawImage(L,0,0,K,De),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ie.width+"x"+ie.height+") to ("+K+"x"+De+")."),he}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ie.width+"x"+ie.height+")."),L;return L}function g(L){return L.generateMipmaps}function m(L){i.generateMipmap(L)}function b(L){return L.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?i.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function S(L,E,z,j,ie=!1){if(L!==null){if(i[L]!==void 0)return i[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let K=E;if(E===i.RED&&(z===i.FLOAT&&(K=i.R32F),z===i.HALF_FLOAT&&(K=i.R16F),z===i.UNSIGNED_BYTE&&(K=i.R8)),E===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(K=i.R8UI),z===i.UNSIGNED_SHORT&&(K=i.R16UI),z===i.UNSIGNED_INT&&(K=i.R32UI),z===i.BYTE&&(K=i.R8I),z===i.SHORT&&(K=i.R16I),z===i.INT&&(K=i.R32I)),E===i.RG&&(z===i.FLOAT&&(K=i.RG32F),z===i.HALF_FLOAT&&(K=i.RG16F),z===i.UNSIGNED_BYTE&&(K=i.RG8)),E===i.RG_INTEGER&&(z===i.UNSIGNED_BYTE&&(K=i.RG8UI),z===i.UNSIGNED_SHORT&&(K=i.RG16UI),z===i.UNSIGNED_INT&&(K=i.RG32UI),z===i.BYTE&&(K=i.RG8I),z===i.SHORT&&(K=i.RG16I),z===i.INT&&(K=i.RG32I)),E===i.RGB_INTEGER&&(z===i.UNSIGNED_BYTE&&(K=i.RGB8UI),z===i.UNSIGNED_SHORT&&(K=i.RGB16UI),z===i.UNSIGNED_INT&&(K=i.RGB32UI),z===i.BYTE&&(K=i.RGB8I),z===i.SHORT&&(K=i.RGB16I),z===i.INT&&(K=i.RGB32I)),E===i.RGBA_INTEGER&&(z===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),z===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),z===i.UNSIGNED_INT&&(K=i.RGBA32UI),z===i.BYTE&&(K=i.RGBA8I),z===i.SHORT&&(K=i.RGBA16I),z===i.INT&&(K=i.RGBA32I)),E===i.RGB&&(z===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),z===i.UNSIGNED_INT_10F_11F_11F_REV&&(K=i.R11F_G11F_B10F)),E===i.RGBA){let De=ie?ra:ot.getTransfer(j);z===i.FLOAT&&(K=i.RGBA32F),z===i.HALF_FLOAT&&(K=i.RGBA16F),z===i.UNSIGNED_BYTE&&(K=De===ut?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function v(L,E){let z;return L?E===null||E===Wi||E===br?z=i.DEPTH24_STENCIL8:E===$n?z=i.DEPTH32F_STENCIL8:E===vr&&(z=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Wi||E===br?z=i.DEPTH_COMPONENT24:E===$n?z=i.DEPTH_COMPONENT32F:E===vr&&(z=i.DEPTH_COMPONENT16),z}function I(L,E){return g(L)===!0||L.isFramebufferTexture&&L.minFilter!==un&&L.minFilter!==zn?Math.log2(Math.max(E.width,E.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?E.mipmaps.length:1}function y(L){let E=L.target;E.removeEventListener("dispose",y),A(E),E.isVideoTexture&&h.delete(E)}function w(L){let E=L.target;E.removeEventListener("dispose",w),_(E)}function A(L){let E=n.get(L);if(E.__webglInit===void 0)return;let z=L.source,j=f.get(z);if(j){let ie=j[E.__cacheKey];ie.usedTimes--,ie.usedTimes===0&&M(L),Object.keys(j).length===0&&f.delete(z)}n.remove(L)}function M(L){let E=n.get(L);i.deleteTexture(E.__webglTexture);let z=L.source,j=f.get(z);delete j[E.__cacheKey],a.memory.textures--}function _(L){let E=n.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),n.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(E.__webglFramebuffer[j]))for(let ie=0;ie<E.__webglFramebuffer[j].length;ie++)i.deleteFramebuffer(E.__webglFramebuffer[j][ie]);else i.deleteFramebuffer(E.__webglFramebuffer[j]);E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer[j])}else{if(Array.isArray(E.__webglFramebuffer))for(let j=0;j<E.__webglFramebuffer.length;j++)i.deleteFramebuffer(E.__webglFramebuffer[j]);else i.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&i.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let j=0;j<E.__webglColorRenderbuffer.length;j++)E.__webglColorRenderbuffer[j]&&i.deleteRenderbuffer(E.__webglColorRenderbuffer[j]);E.__webglDepthRenderbuffer&&i.deleteRenderbuffer(E.__webglDepthRenderbuffer)}let z=L.textures;for(let j=0,ie=z.length;j<ie;j++){let K=n.get(z[j]);K.__webglTexture&&(i.deleteTexture(K.__webglTexture),a.memory.textures--),n.remove(z[j])}n.remove(L)}let P=0;function D(){P=0}function F(){let L=P;return L>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+s.maxTextures),P+=1,L}function k(L){let E=[];return E.push(L.wrapS),E.push(L.wrapT),E.push(L.wrapR||0),E.push(L.magFilter),E.push(L.minFilter),E.push(L.anisotropy),E.push(L.internalFormat),E.push(L.format),E.push(L.type),E.push(L.generateMipmaps),E.push(L.premultiplyAlpha),E.push(L.flipY),E.push(L.unpackAlignment),E.push(L.colorSpace),E.join()}function G(L,E){let z=n.get(L);if(L.isVideoTexture&&Ke(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&z.__version!==L.version){let j=L.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Q(z,L,E);return}}else L.isExternalTexture&&(z.__webglTexture=L.sourceTexture?L.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+E)}function V(L,E){let z=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&z.__version!==L.version){Q(z,L,E);return}t.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+E)}function ee(L,E){let z=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&z.__version!==L.version){Q(z,L,E);return}t.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+E)}function W(L,E){let z=n.get(L);if(L.version>0&&z.__version!==L.version){ne(z,L,E);return}t.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+E)}let ce={[vi]:i.REPEAT,[ki]:i.CLAMP_TO_EDGE,[ko]:i.MIRRORED_REPEAT},$={[un]:i.NEAREST,[Hf]:i.NEAREST_MIPMAP_NEAREST,[Ua]:i.NEAREST_MIPMAP_LINEAR,[zn]:i.LINEAR,[wl]:i.LINEAR_MIPMAP_NEAREST,[Vi]:i.LINEAR_MIPMAP_LINEAR},Z={[Wf]:i.NEVER,[Kf]:i.ALWAYS,[Xf]:i.LESS,[eu]:i.LEQUAL,[qf]:i.EQUAL,[Zf]:i.GEQUAL,[$f]:i.GREATER,[Yf]:i.NOTEQUAL};function Re(L,E){if(E.type===$n&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===zn||E.magFilter===wl||E.magFilter===Ua||E.magFilter===Vi||E.minFilter===zn||E.minFilter===wl||E.minFilter===Ua||E.minFilter===Vi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(L,i.TEXTURE_WRAP_S,ce[E.wrapS]),i.texParameteri(L,i.TEXTURE_WRAP_T,ce[E.wrapT]),(L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY)&&i.texParameteri(L,i.TEXTURE_WRAP_R,ce[E.wrapR]),i.texParameteri(L,i.TEXTURE_MAG_FILTER,$[E.magFilter]),i.texParameteri(L,i.TEXTURE_MIN_FILTER,$[E.minFilter]),E.compareFunction&&(i.texParameteri(L,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(L,i.TEXTURE_COMPARE_FUNC,Z[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===un||E.minFilter!==Ua&&E.minFilter!==Vi||E.type===$n&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||n.get(E).__currentAnisotropy){let z=e.get("EXT_texture_filter_anisotropic");i.texParameterf(L,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy}}}function nt(L,E){let z=!1;L.__webglInit===void 0&&(L.__webglInit=!0,E.addEventListener("dispose",y));let j=E.source,ie=f.get(j);ie===void 0&&(ie={},f.set(j,ie));let K=k(E);if(K!==L.__cacheKey){ie[K]===void 0&&(ie[K]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,z=!0),ie[K].usedTimes++;let De=ie[L.__cacheKey];De!==void 0&&(ie[L.__cacheKey].usedTimes--,De.usedTimes===0&&M(E)),L.__cacheKey=K,L.__webglTexture=ie[K].texture}return z}function Xe(L,E,z){return Math.floor(Math.floor(L/z)/E)}function et(L,E,z,j){let K=L.updateRanges;if(K.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,E.width,E.height,z,j,E.data);else{K.sort((oe,ye)=>oe.start-ye.start);let De=0;for(let oe=1;oe<K.length;oe++){let ye=K[De],Be=K[oe],Pe=ye.start+ye.count,ge=Xe(Be.start,E.width,4),Ze=Xe(ye.start,E.width,4);Be.start<=Pe+1&&ge===Ze&&Xe(Be.start+Be.count-1,E.width,4)===ge?ye.count=Math.max(ye.count,Be.start+Be.count-ye.start):(++De,K[De]=Be)}K.length=De+1;let he=i.getParameter(i.UNPACK_ROW_LENGTH),Ce=i.getParameter(i.UNPACK_SKIP_PIXELS),Ie=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,E.width);for(let oe=0,ye=K.length;oe<ye;oe++){let Be=K[oe],Pe=Math.floor(Be.start/4),ge=Math.ceil(Be.count/4),Ze=Pe%E.width,O=Math.floor(Pe/E.width),le=ge,de=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ze),i.pixelStorei(i.UNPACK_SKIP_ROWS,O),t.texSubImage2D(i.TEXTURE_2D,0,Ze,O,le,de,z,j,E.data)}L.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,he),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ce),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ie)}}function Q(L,E,z){let j=i.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(j=i.TEXTURE_2D_ARRAY),E.isData3DTexture&&(j=i.TEXTURE_3D);let ie=nt(L,E),K=E.source;t.bindTexture(j,L.__webglTexture,i.TEXTURE0+z);let De=n.get(K);if(K.version!==De.__version||ie===!0){t.activeTexture(i.TEXTURE0+z);let he=ot.getPrimaries(ot.workingColorSpace),Ce=E.colorSpace===Yn?null:ot.getPrimaries(E.colorSpace),Ie=E.colorSpace===Yn||he===Ce?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ie);let oe=x(E.image,!1,s.maxTextureSize);oe=Yt(E,oe);let ye=r.convert(E.format,E.colorSpace),Be=r.convert(E.type),Pe=S(E.internalFormat,ye,Be,E.colorSpace,E.isVideoTexture);Re(j,E);let ge,Ze=E.mipmaps,O=E.isVideoTexture!==!0,le=De.__version===void 0||ie===!0,de=K.dataReady,be=I(E,oe);if(E.isDepthTexture)Pe=v(E.format===Mr,E.type),le&&(O?t.texStorage2D(i.TEXTURE_2D,1,Pe,oe.width,oe.height):t.texImage2D(i.TEXTURE_2D,0,Pe,oe.width,oe.height,0,ye,Be,null));else if(E.isDataTexture)if(Ze.length>0){O&&le&&t.texStorage2D(i.TEXTURE_2D,be,Pe,Ze[0].width,Ze[0].height);for(let re=0,te=Ze.length;re<te;re++)ge=Ze[re],O?de&&t.texSubImage2D(i.TEXTURE_2D,re,0,0,ge.width,ge.height,ye,Be,ge.data):t.texImage2D(i.TEXTURE_2D,re,Pe,ge.width,ge.height,0,ye,Be,ge.data);E.generateMipmaps=!1}else O?(le&&t.texStorage2D(i.TEXTURE_2D,be,Pe,oe.width,oe.height),de&&et(E,oe,ye,Be)):t.texImage2D(i.TEXTURE_2D,0,Pe,oe.width,oe.height,0,ye,Be,oe.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){O&&le&&t.texStorage3D(i.TEXTURE_2D_ARRAY,be,Pe,Ze[0].width,Ze[0].height,oe.depth);for(let re=0,te=Ze.length;re<te;re++)if(ge=Ze[re],E.format!==Dn)if(ye!==null)if(O){if(de)if(E.layerUpdates.size>0){let Ee=lu(ge.width,ge.height,E.format,E.type);for(let qe of E.layerUpdates){let _t=ge.data.subarray(qe*Ee/ge.data.BYTES_PER_ELEMENT,(qe+1)*Ee/ge.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,qe,ge.width,ge.height,1,ye,_t)}E.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,0,ge.width,ge.height,oe.depth,ye,ge.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,re,Pe,ge.width,ge.height,oe.depth,0,ge.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else O?de&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,0,ge.width,ge.height,oe.depth,ye,Be,ge.data):t.texImage3D(i.TEXTURE_2D_ARRAY,re,Pe,ge.width,ge.height,oe.depth,0,ye,Be,ge.data)}else{O&&le&&t.texStorage2D(i.TEXTURE_2D,be,Pe,Ze[0].width,Ze[0].height);for(let re=0,te=Ze.length;re<te;re++)ge=Ze[re],E.format!==Dn?ye!==null?O?de&&t.compressedTexSubImage2D(i.TEXTURE_2D,re,0,0,ge.width,ge.height,ye,ge.data):t.compressedTexImage2D(i.TEXTURE_2D,re,Pe,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):O?de&&t.texSubImage2D(i.TEXTURE_2D,re,0,0,ge.width,ge.height,ye,Be,ge.data):t.texImage2D(i.TEXTURE_2D,re,Pe,ge.width,ge.height,0,ye,Be,ge.data)}else if(E.isDataArrayTexture)if(O){if(le&&t.texStorage3D(i.TEXTURE_2D_ARRAY,be,Pe,oe.width,oe.height,oe.depth),de)if(E.layerUpdates.size>0){let re=lu(oe.width,oe.height,E.format,E.type);for(let te of E.layerUpdates){let Ee=oe.data.subarray(te*re/oe.data.BYTES_PER_ELEMENT,(te+1)*re/oe.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,te,oe.width,oe.height,1,ye,Be,Ee)}E.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,ye,Be,oe.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Pe,oe.width,oe.height,oe.depth,0,ye,Be,oe.data);else if(E.isData3DTexture)O?(le&&t.texStorage3D(i.TEXTURE_3D,be,Pe,oe.width,oe.height,oe.depth),de&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,ye,Be,oe.data)):t.texImage3D(i.TEXTURE_3D,0,Pe,oe.width,oe.height,oe.depth,0,ye,Be,oe.data);else if(E.isFramebufferTexture){if(le)if(O)t.texStorage2D(i.TEXTURE_2D,be,Pe,oe.width,oe.height);else{let re=oe.width,te=oe.height;for(let Ee=0;Ee<be;Ee++)t.texImage2D(i.TEXTURE_2D,Ee,Pe,re,te,0,ye,Be,null),re>>=1,te>>=1}}else if(Ze.length>0){if(O&&le){let re=Ot(Ze[0]);t.texStorage2D(i.TEXTURE_2D,be,Pe,re.width,re.height)}for(let re=0,te=Ze.length;re<te;re++)ge=Ze[re],O?de&&t.texSubImage2D(i.TEXTURE_2D,re,0,0,ye,Be,ge):t.texImage2D(i.TEXTURE_2D,re,Pe,ye,Be,ge);E.generateMipmaps=!1}else if(O){if(le){let re=Ot(oe);t.texStorage2D(i.TEXTURE_2D,be,Pe,re.width,re.height)}de&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ye,Be,oe)}else t.texImage2D(i.TEXTURE_2D,0,Pe,ye,Be,oe);g(E)&&m(j),De.__version=K.version,E.onUpdate&&E.onUpdate(E)}L.__version=E.version}function ne(L,E,z){if(E.image.length!==6)return;let j=nt(L,E),ie=E.source;t.bindTexture(i.TEXTURE_CUBE_MAP,L.__webglTexture,i.TEXTURE0+z);let K=n.get(ie);if(ie.version!==K.__version||j===!0){t.activeTexture(i.TEXTURE0+z);let De=ot.getPrimaries(ot.workingColorSpace),he=E.colorSpace===Yn?null:ot.getPrimaries(E.colorSpace),Ce=E.colorSpace===Yn||De===he?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce);let Ie=E.isCompressedTexture||E.image[0].isCompressedTexture,oe=E.image[0]&&E.image[0].isDataTexture,ye=[];for(let te=0;te<6;te++)!Ie&&!oe?ye[te]=x(E.image[te],!0,s.maxCubemapSize):ye[te]=oe?E.image[te].image:E.image[te],ye[te]=Yt(E,ye[te]);let Be=ye[0],Pe=r.convert(E.format,E.colorSpace),ge=r.convert(E.type),Ze=S(E.internalFormat,Pe,ge,E.colorSpace),O=E.isVideoTexture!==!0,le=K.__version===void 0||j===!0,de=ie.dataReady,be=I(E,Be);Re(i.TEXTURE_CUBE_MAP,E);let re;if(Ie){O&&le&&t.texStorage2D(i.TEXTURE_CUBE_MAP,be,Ze,Be.width,Be.height);for(let te=0;te<6;te++){re=ye[te].mipmaps;for(let Ee=0;Ee<re.length;Ee++){let qe=re[Ee];E.format!==Dn?Pe!==null?O?de&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ee,0,0,qe.width,qe.height,Pe,qe.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ee,Ze,qe.width,qe.height,0,qe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ee,0,0,qe.width,qe.height,Pe,ge,qe.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ee,Ze,qe.width,qe.height,0,Pe,ge,qe.data)}}}else{if(re=E.mipmaps,O&&le){re.length>0&&be++;let te=Ot(ye[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,be,Ze,te.width,te.height)}for(let te=0;te<6;te++)if(oe){O?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,ye[te].width,ye[te].height,Pe,ge,ye[te].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Ze,ye[te].width,ye[te].height,0,Pe,ge,ye[te].data);for(let Ee=0;Ee<re.length;Ee++){let _t=re[Ee].image[te].image;O?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ee+1,0,0,_t.width,_t.height,Pe,ge,_t.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ee+1,Ze,_t.width,_t.height,0,Pe,ge,_t.data)}}else{O?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Pe,ge,ye[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Ze,Pe,ge,ye[te]);for(let Ee=0;Ee<re.length;Ee++){let qe=re[Ee];O?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ee+1,0,0,Pe,ge,qe.image[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,Ee+1,Ze,Pe,ge,qe.image[te])}}}g(E)&&m(i.TEXTURE_CUBE_MAP),K.__version=ie.version,E.onUpdate&&E.onUpdate(E)}L.__version=E.version}function Me(L,E,z,j,ie,K){let De=r.convert(z.format,z.colorSpace),he=r.convert(z.type),Ce=S(z.internalFormat,De,he,z.colorSpace),Ie=n.get(E),oe=n.get(z);if(oe.__renderTarget=E,!Ie.__hasExternalTextures){let ye=Math.max(1,E.width>>K),Be=Math.max(1,E.height>>K);ie===i.TEXTURE_3D||ie===i.TEXTURE_2D_ARRAY?t.texImage3D(ie,K,Ce,ye,Be,E.depth,0,De,he,null):t.texImage2D(ie,K,Ce,ye,Be,0,De,he,null)}t.bindFramebuffer(i.FRAMEBUFFER,L),Te(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,j,ie,oe.__webglTexture,0,Rt(E)):(ie===i.TEXTURE_2D||ie>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ie<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,j,ie,oe.__webglTexture,K),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ve(L,E,z){if(i.bindRenderbuffer(i.RENDERBUFFER,L),E.depthBuffer){let j=E.depthTexture,ie=j&&j.isDepthTexture?j.type:null,K=v(E.stencilBuffer,ie),De=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,he=Rt(E);Te(E)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,he,K,E.width,E.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,he,K,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,K,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,De,i.RENDERBUFFER,L)}else{let j=E.textures;for(let ie=0;ie<j.length;ie++){let K=j[ie],De=r.convert(K.format,K.colorSpace),he=r.convert(K.type),Ce=S(K.internalFormat,De,he,K.colorSpace),Ie=Rt(E);z&&Te(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ie,Ce,E.width,E.height):Te(E)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ie,Ce,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,Ce,E.width,E.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ue(L,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,L),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let j=n.get(E.depthTexture);j.__renderTarget=E,(!j.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),G(E.depthTexture,0);let ie=j.__webglTexture,K=Rt(E);if(E.depthTexture.format===rr)Te(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ie,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ie,0);else if(E.depthTexture.format===Mr)Te(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ie,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ie,0);else throw new Error("Unknown depthTexture format")}function at(L){let E=n.get(L),z=L.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==L.depthTexture){let j=L.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),j){let ie=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,j.removeEventListener("dispose",ie)};j.addEventListener("dispose",ie),E.__depthDisposeCallback=ie}E.__boundDepthTexture=j}if(L.depthTexture&&!E.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");let j=L.texture.mipmaps;j&&j.length>0?Ue(E.__webglFramebuffer[0],L):Ue(E.__webglFramebuffer,L)}else if(z){E.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[j]),E.__webglDepthbuffer[j]===void 0)E.__webglDepthbuffer[j]=i.createRenderbuffer(),Ve(E.__webglDepthbuffer[j],L,!1);else{let ie=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=E.__webglDepthbuffer[j];i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,ie,i.RENDERBUFFER,K)}}else{let j=L.texture.mipmaps;if(j&&j.length>0?t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=i.createRenderbuffer(),Ve(E.__webglDepthbuffer,L,!1);else{let ie=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=E.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,ie,i.RENDERBUFFER,K)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Qt(L,E,z){let j=n.get(L);E!==void 0&&Me(j.__webglFramebuffer,L,L.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&at(L)}function N(L){let E=L.texture,z=n.get(L),j=n.get(E);L.addEventListener("dispose",w);let ie=L.textures,K=L.isWebGLCubeRenderTarget===!0,De=ie.length>1;if(De||(j.__webglTexture===void 0&&(j.__webglTexture=i.createTexture()),j.__version=E.version,a.memory.textures++),K){z.__webglFramebuffer=[];for(let he=0;he<6;he++)if(E.mipmaps&&E.mipmaps.length>0){z.__webglFramebuffer[he]=[];for(let Ce=0;Ce<E.mipmaps.length;Ce++)z.__webglFramebuffer[he][Ce]=i.createFramebuffer()}else z.__webglFramebuffer[he]=i.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){z.__webglFramebuffer=[];for(let he=0;he<E.mipmaps.length;he++)z.__webglFramebuffer[he]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(De)for(let he=0,Ce=ie.length;he<Ce;he++){let Ie=n.get(ie[he]);Ie.__webglTexture===void 0&&(Ie.__webglTexture=i.createTexture(),a.memory.textures++)}if(L.samples>0&&Te(L)===!1){z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let he=0;he<ie.length;he++){let Ce=ie[he];z.__webglColorRenderbuffer[he]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[he]);let Ie=r.convert(Ce.format,Ce.colorSpace),oe=r.convert(Ce.type),ye=S(Ce.internalFormat,Ie,oe,Ce.colorSpace,L.isXRRenderTarget===!0),Be=Rt(L);i.renderbufferStorageMultisample(i.RENDERBUFFER,Be,ye,L.width,L.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+he,i.RENDERBUFFER,z.__webglColorRenderbuffer[he])}i.bindRenderbuffer(i.RENDERBUFFER,null),L.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),Ve(z.__webglDepthRenderbuffer,L,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(K){t.bindTexture(i.TEXTURE_CUBE_MAP,j.__webglTexture),Re(i.TEXTURE_CUBE_MAP,E);for(let he=0;he<6;he++)if(E.mipmaps&&E.mipmaps.length>0)for(let Ce=0;Ce<E.mipmaps.length;Ce++)Me(z.__webglFramebuffer[he][Ce],L,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+he,Ce);else Me(z.__webglFramebuffer[he],L,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0);g(E)&&m(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(De){for(let he=0,Ce=ie.length;he<Ce;he++){let Ie=ie[he],oe=n.get(Ie),ye=i.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(ye=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ye,oe.__webglTexture),Re(ye,Ie),Me(z.__webglFramebuffer,L,Ie,i.COLOR_ATTACHMENT0+he,ye,0),g(Ie)&&m(ye)}t.unbindTexture()}else{let he=i.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(he=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(he,j.__webglTexture),Re(he,E),E.mipmaps&&E.mipmaps.length>0)for(let Ce=0;Ce<E.mipmaps.length;Ce++)Me(z.__webglFramebuffer[Ce],L,E,i.COLOR_ATTACHMENT0,he,Ce);else Me(z.__webglFramebuffer,L,E,i.COLOR_ATTACHMENT0,he,0);g(E)&&m(he),t.unbindTexture()}L.depthBuffer&&at(L)}function At(L){let E=L.textures;for(let z=0,j=E.length;z<j;z++){let ie=E[z];if(g(ie)){let K=b(L),De=n.get(ie).__webglTexture;t.bindTexture(K,De),m(K),t.unbindTexture()}}}let $e=[],He=[];function we(L){if(L.samples>0){if(Te(L)===!1){let E=L.textures,z=L.width,j=L.height,ie=i.COLOR_BUFFER_BIT,K=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,De=n.get(L),he=E.length>1;if(he)for(let Ie=0;Ie<E.length;Ie++)t.bindFramebuffer(i.FRAMEBUFFER,De.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ie,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,De.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ie,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,De.__webglMultisampledFramebuffer);let Ce=L.texture.mipmaps;Ce&&Ce.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,De.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,De.__webglFramebuffer);for(let Ie=0;Ie<E.length;Ie++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(ie|=i.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(ie|=i.STENCIL_BUFFER_BIT)),he){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,De.__webglColorRenderbuffer[Ie]);let oe=n.get(E[Ie]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,oe,0)}i.blitFramebuffer(0,0,z,j,0,0,z,j,ie,i.NEAREST),c===!0&&($e.length=0,He.length=0,$e.push(i.COLOR_ATTACHMENT0+Ie),L.depthBuffer&&L.resolveDepthBuffer===!1&&($e.push(K),He.push(K),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,He)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,$e))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),he)for(let Ie=0;Ie<E.length;Ie++){t.bindFramebuffer(i.FRAMEBUFFER,De.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ie,i.RENDERBUFFER,De.__webglColorRenderbuffer[Ie]);let oe=n.get(E[Ie]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,De.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ie,i.TEXTURE_2D,oe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,De.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&c){let E=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[E])}}}function Rt(L){return Math.min(s.maxSamples,L.samples)}function Te(L){let E=n.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Ke(L){let E=a.render.frame;h.get(L)!==E&&(h.set(L,E),L.update())}function Yt(L,E){let z=L.colorSpace,j=L.format,ie=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||z!==rs&&z!==Yn&&(ot.getTransfer(z)===ut?(j!==Dn||ie!==qn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),E}function Ot(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(l.width=L.naturalWidth||L.width,l.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(l.width=L.displayWidth,l.height=L.displayHeight):(l.width=L.width,l.height=L.height),l}this.allocateTextureUnit=F,this.resetTextureUnits=D,this.setTexture2D=G,this.setTexture2DArray=V,this.setTexture3D=ee,this.setTextureCube=W,this.rebindTextures=Qt,this.setupRenderTarget=N,this.updateRenderTargetMipmap=At,this.updateMultisampleRenderTarget=we,this.setupDepthRenderbuffer=at,this.setupFrameBufferTexture=Me,this.useMultisampledRTT=Te}function c1(i,e){function t(n,s=Yn){let r,a=ot.getTransfer(s);if(n===qn)return i.UNSIGNED_BYTE;if(n===Al)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Rl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Yh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Zh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===qh)return i.BYTE;if(n===$h)return i.SHORT;if(n===vr)return i.UNSIGNED_SHORT;if(n===Tl)return i.INT;if(n===Wi)return i.UNSIGNED_INT;if(n===$n)return i.FLOAT;if(n===_r)return i.HALF_FLOAT;if(n===Kh)return i.ALPHA;if(n===Jh)return i.RGB;if(n===Dn)return i.RGBA;if(n===rr)return i.DEPTH_COMPONENT;if(n===Mr)return i.DEPTH_STENCIL;if(n===Cl)return i.RED;if(n===Il)return i.RED_INTEGER;if(n===jh)return i.RG;if(n===Pl)return i.RG_INTEGER;if(n===Ll)return i.RGBA_INTEGER;if(n===Na||n===Fa||n===Oa||n===ka)if(a===ut)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Na)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Fa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Oa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ka)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Na)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Fa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Oa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ka)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Dl||n===Ul||n===Nl||n===Fl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Dl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ul)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Nl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Fl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ol||n===kl||n===Bl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ol||n===kl)return a===ut?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Bl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Hl||n===zl||n===Gl||n===Vl||n===Wl||n===Xl||n===ql||n===$l||n===Yl||n===Zl||n===Kl||n===Jl||n===jl||n===Ql)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Hl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===zl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Gl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Vl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Wl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Xl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ql)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===$l)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Yl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Zl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Kl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Jl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===jl)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ql)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ec||n===tc||n===nc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===ec)return a===ut?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===tc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===nc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ic||n===sc||n===rc||n===ac)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===ic)return r.COMPRESSED_RED_RGTC1_EXT;if(n===sc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===rc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ac)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===br?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var h1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,u1=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,bu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new va(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Wn({vertexShader:h1,fragmentShader:u1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ve(new Mt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Mu=class extends _i{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,p=null,x=typeof XRWebGLBinding<"u",g=new bu,m={},b=t.getContextAttributes(),S=null,v=null,I=[],y=[],w=new pe,A=null,M=new nn;M.viewport=new Ut;let _=new nn;_.viewport=new Ut;let P=[M,_],D=new pl,F=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let ne=I[Q];return ne===void 0&&(ne=new cr,I[Q]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(Q){let ne=I[Q];return ne===void 0&&(ne=new cr,I[Q]=ne),ne.getGripSpace()},this.getHand=function(Q){let ne=I[Q];return ne===void 0&&(ne=new cr,I[Q]=ne),ne.getHandSpace()};function G(Q){let ne=y.indexOf(Q.inputSource);if(ne===-1)return;let Me=I[ne];Me!==void 0&&(Me.update(Q.inputSource,Q.frame,l||a),Me.dispatchEvent({type:Q.type,data:Q.inputSource}))}function V(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",V),s.removeEventListener("inputsourceschange",ee);for(let Q=0;Q<I.length;Q++){let ne=y[Q];ne!==null&&(y[Q]=null,I[Q].disconnect(ne))}F=null,k=null,g.reset();for(let Q in m)delete m[Q];e.setRenderTarget(S),d=null,f=null,u=null,s=null,v=null,et.stop(),n.isPresenting=!1,e.setPixelRatio(A),e.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){r=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){o=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Q){l=Q},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(Q){if(s=Q,s!==null){if(S=e.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",V),s.addEventListener("inputsourceschange",ee),b.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(w),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let Me=null,Ve=null,Ue=null;b.depth&&(Ue=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Me=b.stencil?Mr:rr,Ve=b.stencil?br:Wi);let at={colorFormat:t.RGBA8,depthFormat:Ue,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(at),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),v=new ei(f.textureWidth,f.textureHeight,{format:Dn,type:qn,depthTexture:new ya(f.textureWidth,f.textureHeight,Ve,void 0,void 0,void 0,void 0,void 0,void 0,Me),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let Me={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,Me),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),v=new ei(d.framebufferWidth,d.framebufferHeight,{format:Dn,type:qn,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),et.setContext(s),et.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function ee(Q){for(let ne=0;ne<Q.removed.length;ne++){let Me=Q.removed[ne],Ve=y.indexOf(Me);Ve>=0&&(y[Ve]=null,I[Ve].disconnect(Me))}for(let ne=0;ne<Q.added.length;ne++){let Me=Q.added[ne],Ve=y.indexOf(Me);if(Ve===-1){for(let at=0;at<I.length;at++)if(at>=y.length){y.push(Me),Ve=at;break}else if(y[at]===null){y[at]=Me,Ve=at;break}if(Ve===-1)break}let Ue=I[Ve];Ue&&Ue.connect(Me)}}let W=new U,ce=new U;function $(Q,ne,Me){W.setFromMatrixPosition(ne.matrixWorld),ce.setFromMatrixPosition(Me.matrixWorld);let Ve=W.distanceTo(ce),Ue=ne.projectionMatrix.elements,at=Me.projectionMatrix.elements,Qt=Ue[14]/(Ue[10]-1),N=Ue[14]/(Ue[10]+1),At=(Ue[9]+1)/Ue[5],$e=(Ue[9]-1)/Ue[5],He=(Ue[8]-1)/Ue[0],we=(at[8]+1)/at[0],Rt=Qt*He,Te=Qt*we,Ke=Ve/(-He+we),Yt=Ke*-He;if(ne.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(Yt),Q.translateZ(Ke),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),Ue[10]===-1)Q.projectionMatrix.copy(ne.projectionMatrix),Q.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{let Ot=Qt+Ke,L=N+Ke,E=Rt-Yt,z=Te+(Ve-Yt),j=At*N/L*Ot,ie=$e*N/L*Ot;Q.projectionMatrix.makePerspective(E,z,j,ie,Ot,L),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function Z(Q,ne){ne===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(ne.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(s===null)return;let ne=Q.near,Me=Q.far;g.texture!==null&&(g.depthNear>0&&(ne=g.depthNear),g.depthFar>0&&(Me=g.depthFar)),D.near=_.near=M.near=ne,D.far=_.far=M.far=Me,(F!==D.near||k!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),F=D.near,k=D.far),D.layers.mask=Q.layers.mask|6,M.layers.mask=D.layers.mask&3,_.layers.mask=D.layers.mask&5;let Ve=Q.parent,Ue=D.cameras;Z(D,Ve);for(let at=0;at<Ue.length;at++)Z(Ue[at],Ve);Ue.length===2?$(D,M,_):D.projectionMatrix.copy(M.projectionMatrix),Re(Q,D,Ve)};function Re(Q,ne,Me){Me===null?Q.matrix.copy(ne.matrixWorld):(Q.matrix.copy(Me.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(ne.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(ne.projectionMatrix),Q.projectionMatrixInverse.copy(ne.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=ar*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(Q){c=Q,f!==null&&(f.fixedFoveation=Q),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Q)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(D)},this.getCameraTexture=function(Q){return m[Q]};let nt=null;function Xe(Q,ne){if(h=ne.getViewerPose(l||a),p=ne,h!==null){let Me=h.views;d!==null&&(e.setRenderTargetFramebuffer(v,d.framebuffer),e.setRenderTarget(v));let Ve=!1;Me.length!==D.cameras.length&&(D.cameras.length=0,Ve=!0);for(let N=0;N<Me.length;N++){let At=Me[N],$e=null;if(d!==null)$e=d.getViewport(At);else{let we=u.getViewSubImage(f,At);$e=we.viewport,N===0&&(e.setRenderTargetTextures(v,we.colorTexture,we.depthStencilTexture),e.setRenderTarget(v))}let He=P[N];He===void 0&&(He=new nn,He.layers.enable(N),He.viewport=new Ut,P[N]=He),He.matrix.fromArray(At.transform.matrix),He.matrix.decompose(He.position,He.quaternion,He.scale),He.projectionMatrix.fromArray(At.projectionMatrix),He.projectionMatrixInverse.copy(He.projectionMatrix).invert(),He.viewport.set($e.x,$e.y,$e.width,$e.height),N===0&&(D.matrix.copy(He.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),Ve===!0&&D.cameras.push(He)}let Ue=s.enabledFeatures;if(Ue&&Ue.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=n.getBinding();let N=u.getDepthInformation(Me[0]);N&&N.isValid&&N.texture&&g.init(N,s.renderState)}if(Ue&&Ue.includes("camera-access")&&x){e.state.unbindTexture(),u=n.getBinding();for(let N=0;N<Me.length;N++){let At=Me[N].camera;if(At){let $e=m[At];$e||($e=new va,m[At]=$e);let He=u.getCameraImage(At);$e.sourceTexture=He}}}}for(let Me=0;Me<I.length;Me++){let Ve=y[Me],Ue=I[Me];Ve!==null&&Ue!==void 0&&Ue.update(Ve,ne,l||a)}nt&&nt(Q,ne),ne.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ne}),p=null}let et=new Ip;et.setAnimationLoop(Xe),this.setAnimationLoop=function(Q){nt=Q},this.dispose=function(){}}},ms=new Vn,d1=new dt;function f1(i,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,su(i)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function s(g,m,b,S,v){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(g,m):m.isMeshToonMaterial?(r(g,m),u(g,m)):m.isMeshPhongMaterial?(r(g,m),h(g,m)):m.isMeshStandardMaterial?(r(g,m),f(g,m),m.isMeshPhysicalMaterial&&d(g,m,v)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),x(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(a(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?c(g,m,b,S):m.isSpriteMaterial?l(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===Wt&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===Wt&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);let b=e.get(m),S=b.envMap,v=b.envMapRotation;S&&(g.envMap.value=S,ms.copy(v),ms.x*=-1,ms.y*=-1,ms.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(ms.y*=-1,ms.z*=-1),g.envMapRotation.value.setFromMatrix4(d1.makeRotationFromEuler(ms)),g.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function a(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function c(g,m,b,S){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*b,g.scale.value=S*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function l(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function u(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function f(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function d(g,m,b){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Wt&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=b.texture,g.transmissionSamplerSize.value.set(b.width,b.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function x(g,m){let b=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(b.matrixWorld),g.nearDistance.value=b.shadow.camera.near,g.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function p1(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(b,S){let v=S.program;n.uniformBlockBinding(b,v)}function l(b,S){let v=s[b.id];v===void 0&&(p(b),v=h(b),s[b.id]=v,b.addEventListener("dispose",g));let I=S.program;n.updateUBOMapping(b,I);let y=e.render.frame;r[b.id]!==y&&(f(b),r[b.id]=y)}function h(b){let S=u();b.__bindingPointIndex=S;let v=i.createBuffer(),I=b.__size,y=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,I,y),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,v),v}function u(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(b){let S=s[b.id],v=b.uniforms,I=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let y=0,w=v.length;y<w;y++){let A=Array.isArray(v[y])?v[y]:[v[y]];for(let M=0,_=A.length;M<_;M++){let P=A[M];if(d(P,y,M,I)===!0){let D=P.__offset,F=Array.isArray(P.value)?P.value:[P.value],k=0;for(let G=0;G<F.length;G++){let V=F[G],ee=x(V);typeof V=="number"||typeof V=="boolean"?(P.__data[0]=V,i.bufferSubData(i.UNIFORM_BUFFER,D+k,P.__data)):V.isMatrix3?(P.__data[0]=V.elements[0],P.__data[1]=V.elements[1],P.__data[2]=V.elements[2],P.__data[3]=0,P.__data[4]=V.elements[3],P.__data[5]=V.elements[4],P.__data[6]=V.elements[5],P.__data[7]=0,P.__data[8]=V.elements[6],P.__data[9]=V.elements[7],P.__data[10]=V.elements[8],P.__data[11]=0):(V.toArray(P.__data,k),k+=ee.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,D,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(b,S,v,I){let y=b.value,w=S+"_"+v;if(I[w]===void 0)return typeof y=="number"||typeof y=="boolean"?I[w]=y:I[w]=y.clone(),!0;{let A=I[w];if(typeof y=="number"||typeof y=="boolean"){if(A!==y)return I[w]=y,!0}else if(A.equals(y)===!1)return A.copy(y),!0}return!1}function p(b){let S=b.uniforms,v=0,I=16;for(let w=0,A=S.length;w<A;w++){let M=Array.isArray(S[w])?S[w]:[S[w]];for(let _=0,P=M.length;_<P;_++){let D=M[_],F=Array.isArray(D.value)?D.value:[D.value];for(let k=0,G=F.length;k<G;k++){let V=F[k],ee=x(V),W=v%I,ce=W%ee.boundary,$=W+ce;v+=ce,$!==0&&I-$<ee.storage&&(v+=I-$),D.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=v,v+=ee.storage}}}let y=v%I;return y>0&&(v+=I-y),b.__size=v,b.__cache={},this}function x(b){let S={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(S.boundary=4,S.storage=4):b.isVector2?(S.boundary=8,S.storage=8):b.isVector3||b.isColor?(S.boundary=16,S.storage=12):b.isVector4?(S.boundary=16,S.storage=16):b.isMatrix3?(S.boundary=48,S.storage=48):b.isMatrix4?(S.boundary=64,S.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),S}function g(b){let S=b.target;S.removeEventListener("dispose",g);let v=a.indexOf(S.__bindingPointIndex);a.splice(v,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function m(){for(let b in s)i.deleteBuffer(s[b]);a=[],s={},r={}}return{bind:c,update:l,dispose:m}}var uc=class{constructor(e={}){let{canvas:t=Jf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=a;let p=new Uint32Array(4),x=new Int32Array(4),g=null,m=null,b=[],S=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ri,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let v=this,I=!1;this._outputColorSpace=zt;let y=0,w=0,A=null,M=-1,_=null,P=new Ut,D=new Ut,F=null,k=new Ae(0),G=0,V=t.width,ee=t.height,W=1,ce=null,$=null,Z=new Ut(0,0,V,ee),Re=new Ut(0,0,V,ee),nt=!1,Xe=new dr,et=!1,Q=!1,ne=new dt,Me=new U,Ve=new Ut,Ue={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},at=!1;function Qt(){return A===null?W:1}let N=n;function At(R,B){return t.getContext(R,B)}try{let R={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",de,!1),t.addEventListener("webglcontextrestored",be,!1),t.addEventListener("webglcontextcreationerror",re,!1),N===null){let B="webgl2";if(N=At(B,R),N===null)throw At(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let $e,He,we,Rt,Te,Ke,Yt,Ot,L,E,z,j,ie,K,De,he,Ce,Ie,oe,ye,Be,Pe,ge,Ze;function O(){$e=new Lv(N),$e.init(),Pe=new c1(N,$e),He=new wv(N,$e,e,Pe),we=new o1(N,$e),He.reversedDepthBuffer&&f&&we.buffers.depth.setReversed(!0),Rt=new Nv(N),Te=new Y_,Ke=new l1(N,$e,we,Te,He,Pe,Rt),Yt=new Av(v),Ot=new Pv(v),L=new z0(N),ge=new Sv(N,L),E=new Dv(N,L,Rt,ge),z=new Ov(N,E,L,Rt),oe=new Fv(N,He,Ke),he=new Tv(Te),j=new $_(v,Yt,Ot,$e,He,ge,he),ie=new f1(v,Te),K=new K_,De=new n1($e),Ie=new Mv(v,Yt,Ot,we,z,d,c),Ce=new r1(v,z,He),Ze=new p1(N,Rt,He,we),ye=new Ev(N,$e,Rt),Be=new Uv(N,$e,Rt),Rt.programs=j.programs,v.capabilities=He,v.extensions=$e,v.properties=Te,v.renderLists=K,v.shadowMap=Ce,v.state=we,v.info=Rt}O();let le=new Mu(v,N);this.xr=le,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let R=$e.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){let R=$e.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(R){R!==void 0&&(W=R,this.setSize(V,ee,!1))},this.getSize=function(R){return R.set(V,ee)},this.setSize=function(R,B,X=!0){if(le.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}V=R,ee=B,t.width=Math.floor(R*W),t.height=Math.floor(B*W),X===!0&&(t.style.width=R+"px",t.style.height=B+"px"),this.setViewport(0,0,R,B)},this.getDrawingBufferSize=function(R){return R.set(V*W,ee*W).floor()},this.setDrawingBufferSize=function(R,B,X){V=R,ee=B,W=X,t.width=Math.floor(R*X),t.height=Math.floor(B*X),this.setViewport(0,0,R,B)},this.getCurrentViewport=function(R){return R.copy(P)},this.getViewport=function(R){return R.copy(Z)},this.setViewport=function(R,B,X,q){R.isVector4?Z.set(R.x,R.y,R.z,R.w):Z.set(R,B,X,q),we.viewport(P.copy(Z).multiplyScalar(W).round())},this.getScissor=function(R){return R.copy(Re)},this.setScissor=function(R,B,X,q){R.isVector4?Re.set(R.x,R.y,R.z,R.w):Re.set(R,B,X,q),we.scissor(D.copy(Re).multiplyScalar(W).round())},this.getScissorTest=function(){return nt},this.setScissorTest=function(R){we.setScissorTest(nt=R)},this.setOpaqueSort=function(R){ce=R},this.setTransparentSort=function(R){$=R},this.getClearColor=function(R){return R.copy(Ie.getClearColor())},this.setClearColor=function(){Ie.setClearColor(...arguments)},this.getClearAlpha=function(){return Ie.getClearAlpha()},this.setClearAlpha=function(){Ie.setClearAlpha(...arguments)},this.clear=function(R=!0,B=!0,X=!0){let q=0;if(R){let H=!1;if(A!==null){let ae=A.texture.format;H=ae===Ll||ae===Pl||ae===Il}if(H){let ae=A.texture.type,xe=ae===qn||ae===Wi||ae===vr||ae===br||ae===Al||ae===Rl,Se=Ie.getClearColor(),_e=Ie.getClearAlpha(),ke=Se.r,ze=Se.g,Ne=Se.b;xe?(p[0]=ke,p[1]=ze,p[2]=Ne,p[3]=_e,N.clearBufferuiv(N.COLOR,0,p)):(x[0]=ke,x[1]=ze,x[2]=Ne,x[3]=_e,N.clearBufferiv(N.COLOR,0,x))}else q|=N.COLOR_BUFFER_BIT}B&&(q|=N.DEPTH_BUFFER_BIT),X&&(q|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",de,!1),t.removeEventListener("webglcontextrestored",be,!1),t.removeEventListener("webglcontextcreationerror",re,!1),Ie.dispose(),K.dispose(),De.dispose(),Te.dispose(),Yt.dispose(),Ot.dispose(),z.dispose(),ge.dispose(),Ze.dispose(),j.dispose(),le.dispose(),le.removeEventListener("sessionstart",Kn),le.removeEventListener("sessionend",nd),Zi.stop()};function de(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),I=!0}function be(){console.log("THREE.WebGLRenderer: Context Restored."),I=!1;let R=Rt.autoReset,B=Ce.enabled,X=Ce.autoUpdate,q=Ce.needsUpdate,H=Ce.type;O(),Rt.autoReset=R,Ce.enabled=B,Ce.autoUpdate=X,Ce.needsUpdate=q,Ce.type=H}function re(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function te(R){let B=R.target;B.removeEventListener("dispose",te),Ee(B)}function Ee(R){qe(R),Te.remove(R)}function qe(R){let B=Te.get(R).programs;B!==void 0&&(B.forEach(function(X){j.releaseProgram(X)}),R.isShaderMaterial&&j.releaseShaderCache(R))}this.renderBufferDirect=function(R,B,X,q,H,ae){B===null&&(B=Ue);let xe=H.isMesh&&H.matrixWorld.determinant()<0,Se=tg(R,B,X,q,H);we.setMaterial(q,xe);let _e=X.index,ke=1;if(q.wireframe===!0){if(_e=E.getWireframeAttribute(X),_e===void 0)return;ke=2}let ze=X.drawRange,Ne=X.attributes.position,it=ze.start*ke,pt=(ze.start+ze.count)*ke;ae!==null&&(it=Math.max(it,ae.start*ke),pt=Math.min(pt,(ae.start+ae.count)*ke)),_e!==null?(it=Math.max(it,0),pt=Math.min(pt,_e.count)):Ne!=null&&(it=Math.max(it,0),pt=Math.min(pt,Ne.count));let Ft=pt-it;if(Ft<0||Ft===1/0)return;ge.setup(H,q,Se,X,_e);let Et,gt=ye;if(_e!==null&&(Et=L.get(_e),gt=Be,gt.setIndex(Et)),H.isMesh)q.wireframe===!0?(we.setLineWidth(q.wireframeLinewidth*Qt()),gt.setMode(N.LINES)):gt.setMode(N.TRIANGLES);else if(H.isLine){let Fe=q.linewidth;Fe===void 0&&(Fe=1),we.setLineWidth(Fe*Qt()),H.isLineSegments?gt.setMode(N.LINES):H.isLineLoop?gt.setMode(N.LINE_LOOP):gt.setMode(N.LINE_STRIP)}else H.isPoints?gt.setMode(N.POINTS):H.isSprite&&gt.setMode(N.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)or("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),gt.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if($e.get("WEBGL_multi_draw"))gt.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{let Fe=H._multiDrawStarts,Pt=H._multiDrawCounts,lt=H._multiDrawCount,vn=_e?L.get(_e).bytesPerElement:1,Bs=Te.get(q).currentProgram.getUniforms();for(let _n=0;_n<lt;_n++)Bs.setValue(N,"_gl_DrawID",_n),gt.render(Fe[_n]/vn,Pt[_n])}else if(H.isInstancedMesh)gt.renderInstances(it,Ft,H.count);else if(X.isInstancedBufferGeometry){let Fe=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Pt=Math.min(X.instanceCount,Fe);gt.renderInstances(it,Ft,Pt)}else gt.render(it,Ft)};function _t(R,B,X){R.transparent===!0&&R.side===Jt&&R.forceSinglePass===!1?(R.side=Wt,R.needsUpdate=!0,io(R,B,X),R.side=yi,R.needsUpdate=!0,io(R,B,X),R.side=Jt):io(R,B,X)}this.compile=function(R,B,X=null){X===null&&(X=R),m=De.get(X),m.init(B),S.push(m),X.traverseVisible(function(H){H.isLight&&H.layers.test(B.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),R!==X&&R.traverseVisible(function(H){H.isLight&&H.layers.test(B.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),m.setupLights();let q=new Set;return R.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;let ae=H.material;if(ae)if(Array.isArray(ae))for(let xe=0;xe<ae.length;xe++){let Se=ae[xe];_t(Se,X,H),q.add(Se)}else _t(ae,X,H),q.add(ae)}),m=S.pop(),q},this.compileAsync=function(R,B,X=null){let q=this.compile(R,B,X);return new Promise(H=>{function ae(){if(q.forEach(function(xe){Te.get(xe).currentProgram.isReady()&&q.delete(xe)}),q.size===0){H(R);return}setTimeout(ae,10)}$e.get("KHR_parallel_shader_compile")!==null?ae():setTimeout(ae,10)})};let ct=null;function hi(R){ct&&ct(R)}function Kn(){Zi.stop()}function nd(){Zi.start()}let Zi=new Ip;Zi.setAnimationLoop(hi),typeof self<"u"&&Zi.setContext(self),this.setAnimationLoop=function(R){ct=R,le.setAnimationLoop(R),R===null?Zi.stop():Zi.start()},le.addEventListener("sessionstart",Kn),le.addEventListener("sessionend",nd),this.render=function(R,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),le.enabled===!0&&le.isPresenting===!0&&(le.cameraAutoUpdate===!0&&le.updateCamera(B),B=le.getCamera()),R.isScene===!0&&R.onBeforeRender(v,R,B,A),m=De.get(R,S.length),m.init(B),S.push(m),ne.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Xe.setFromProjectionMatrix(ne,Hn,B.reversedDepth),Q=this.localClippingEnabled,et=he.init(this.clippingPlanes,Q),g=K.get(R,b.length),g.init(),b.push(g),le.enabled===!0&&le.isPresenting===!0){let ae=v.xr.getDepthSensingMesh();ae!==null&&Xc(ae,B,-1/0,v.sortObjects)}Xc(R,B,0,v.sortObjects),g.finish(),v.sortObjects===!0&&g.sort(ce,$),at=le.enabled===!1||le.isPresenting===!1||le.hasDepthSensing()===!1,at&&Ie.addToRenderList(g,R),this.info.render.frame++,et===!0&&he.beginShadows();let X=m.state.shadowsArray;Ce.render(X,R,B),et===!0&&he.endShadows(),this.info.autoReset===!0&&this.info.reset();let q=g.opaque,H=g.transmissive;if(m.setupLights(),B.isArrayCamera){let ae=B.cameras;if(H.length>0)for(let xe=0,Se=ae.length;xe<Se;xe++){let _e=ae[xe];sd(q,H,R,_e)}at&&Ie.render(R);for(let xe=0,Se=ae.length;xe<Se;xe++){let _e=ae[xe];id(g,R,_e,_e.viewport)}}else H.length>0&&sd(q,H,R,B),at&&Ie.render(R),id(g,R,B);A!==null&&w===0&&(Ke.updateMultisampleRenderTarget(A),Ke.updateRenderTargetMipmap(A)),R.isScene===!0&&R.onAfterRender(v,R,B),ge.resetDefaultState(),M=-1,_=null,S.pop(),S.length>0?(m=S[S.length-1],et===!0&&he.setGlobalState(v.clippingPlanes,m.state.camera)):m=null,b.pop(),b.length>0?g=b[b.length-1]:g=null};function Xc(R,B,X,q){if(R.visible===!1)return;if(R.layers.test(B.layers)){if(R.isGroup)X=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(B);else if(R.isLight)m.pushLight(R),R.castShadow&&m.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||Xe.intersectsSprite(R)){q&&Ve.setFromMatrixPosition(R.matrixWorld).applyMatrix4(ne);let xe=z.update(R),Se=R.material;Se.visible&&g.push(R,xe,Se,X,Ve.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||Xe.intersectsObject(R))){let xe=z.update(R),Se=R.material;if(q&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Ve.copy(R.boundingSphere.center)):(xe.boundingSphere===null&&xe.computeBoundingSphere(),Ve.copy(xe.boundingSphere.center)),Ve.applyMatrix4(R.matrixWorld).applyMatrix4(ne)),Array.isArray(Se)){let _e=xe.groups;for(let ke=0,ze=_e.length;ke<ze;ke++){let Ne=_e[ke],it=Se[Ne.materialIndex];it&&it.visible&&g.push(R,xe,it,X,Ve.z,Ne)}}else Se.visible&&g.push(R,xe,Se,X,Ve.z,null)}}let ae=R.children;for(let xe=0,Se=ae.length;xe<Se;xe++)Xc(ae[xe],B,X,q)}function id(R,B,X,q){let H=R.opaque,ae=R.transmissive,xe=R.transparent;m.setupLightsView(X),et===!0&&he.setGlobalState(v.clippingPlanes,X),q&&we.viewport(P.copy(q)),H.length>0&&no(H,B,X),ae.length>0&&no(ae,B,X),xe.length>0&&no(xe,B,X),we.buffers.depth.setTest(!0),we.buffers.depth.setMask(!0),we.buffers.color.setMask(!0),we.setPolygonOffset(!1)}function sd(R,B,X,q){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[q.id]===void 0&&(m.state.transmissionRenderTarget[q.id]=new ei(1,1,{generateMipmaps:!0,type:$e.has("EXT_color_buffer_half_float")||$e.has("EXT_color_buffer_float")?_r:qn,minFilter:Vi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ot.workingColorSpace}));let ae=m.state.transmissionRenderTarget[q.id],xe=q.viewport||P;ae.setSize(xe.z*v.transmissionResolutionScale,xe.w*v.transmissionResolutionScale);let Se=v.getRenderTarget(),_e=v.getActiveCubeFace(),ke=v.getActiveMipmapLevel();v.setRenderTarget(ae),v.getClearColor(k),G=v.getClearAlpha(),G<1&&v.setClearColor(16777215,.5),v.clear(),at&&Ie.render(X);let ze=v.toneMapping;v.toneMapping=Ri;let Ne=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),m.setupLightsView(q),et===!0&&he.setGlobalState(v.clippingPlanes,q),no(R,X,q),Ke.updateMultisampleRenderTarget(ae),Ke.updateRenderTargetMipmap(ae),$e.has("WEBGL_multisampled_render_to_texture")===!1){let it=!1;for(let pt=0,Ft=B.length;pt<Ft;pt++){let Et=B[pt],gt=Et.object,Fe=Et.geometry,Pt=Et.material,lt=Et.group;if(Pt.side===Jt&&gt.layers.test(q.layers)){let vn=Pt.side;Pt.side=Wt,Pt.needsUpdate=!0,rd(gt,X,q,Fe,Pt,lt),Pt.side=vn,Pt.needsUpdate=!0,it=!0}}it===!0&&(Ke.updateMultisampleRenderTarget(ae),Ke.updateRenderTargetMipmap(ae))}v.setRenderTarget(Se,_e,ke),v.setClearColor(k,G),Ne!==void 0&&(q.viewport=Ne),v.toneMapping=ze}function no(R,B,X){let q=B.isScene===!0?B.overrideMaterial:null;for(let H=0,ae=R.length;H<ae;H++){let xe=R[H],Se=xe.object,_e=xe.geometry,ke=xe.group,ze=xe.material;ze.allowOverride===!0&&q!==null&&(ze=q),Se.layers.test(X.layers)&&rd(Se,B,X,_e,ze,ke)}}function rd(R,B,X,q,H,ae){R.onBeforeRender(v,B,X,q,H,ae),R.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),H.onBeforeRender(v,B,X,q,R,ae),H.transparent===!0&&H.side===Jt&&H.forceSinglePass===!1?(H.side=Wt,H.needsUpdate=!0,v.renderBufferDirect(X,B,q,H,R,ae),H.side=yi,H.needsUpdate=!0,v.renderBufferDirect(X,B,q,H,R,ae),H.side=Jt):v.renderBufferDirect(X,B,q,H,R,ae),R.onAfterRender(v,B,X,q,H,ae)}function io(R,B,X){B.isScene!==!0&&(B=Ue);let q=Te.get(R),H=m.state.lights,ae=m.state.shadowsArray,xe=H.state.version,Se=j.getParameters(R,H.state,ae,B,X),_e=j.getProgramCacheKey(Se),ke=q.programs;q.environment=R.isMeshStandardMaterial?B.environment:null,q.fog=B.fog,q.envMap=(R.isMeshStandardMaterial?Ot:Yt).get(R.envMap||q.environment),q.envMapRotation=q.environment!==null&&R.envMap===null?B.environmentRotation:R.envMapRotation,ke===void 0&&(R.addEventListener("dispose",te),ke=new Map,q.programs=ke);let ze=ke.get(_e);if(ze!==void 0){if(q.currentProgram===ze&&q.lightsStateVersion===xe)return od(R,Se),ze}else Se.uniforms=j.getUniforms(R),R.onBeforeCompile(Se,v),ze=j.acquireProgram(Se,_e),ke.set(_e,ze),q.uniforms=Se.uniforms;let Ne=q.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Ne.clippingPlanes=he.uniform),od(R,Se),q.needsLights=ig(R),q.lightsStateVersion=xe,q.needsLights&&(Ne.ambientLightColor.value=H.state.ambient,Ne.lightProbe.value=H.state.probe,Ne.directionalLights.value=H.state.directional,Ne.directionalLightShadows.value=H.state.directionalShadow,Ne.spotLights.value=H.state.spot,Ne.spotLightShadows.value=H.state.spotShadow,Ne.rectAreaLights.value=H.state.rectArea,Ne.ltc_1.value=H.state.rectAreaLTC1,Ne.ltc_2.value=H.state.rectAreaLTC2,Ne.pointLights.value=H.state.point,Ne.pointLightShadows.value=H.state.pointShadow,Ne.hemisphereLights.value=H.state.hemi,Ne.directionalShadowMap.value=H.state.directionalShadowMap,Ne.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Ne.spotShadowMap.value=H.state.spotShadowMap,Ne.spotLightMatrix.value=H.state.spotLightMatrix,Ne.spotLightMap.value=H.state.spotLightMap,Ne.pointShadowMap.value=H.state.pointShadowMap,Ne.pointShadowMatrix.value=H.state.pointShadowMatrix),q.currentProgram=ze,q.uniformsList=null,ze}function ad(R){if(R.uniformsList===null){let B=R.currentProgram.getUniforms();R.uniformsList=wr.seqWithValue(B.seq,R.uniforms)}return R.uniformsList}function od(R,B){let X=Te.get(R);X.outputColorSpace=B.outputColorSpace,X.batching=B.batching,X.batchingColor=B.batchingColor,X.instancing=B.instancing,X.instancingColor=B.instancingColor,X.instancingMorph=B.instancingMorph,X.skinning=B.skinning,X.morphTargets=B.morphTargets,X.morphNormals=B.morphNormals,X.morphColors=B.morphColors,X.morphTargetsCount=B.morphTargetsCount,X.numClippingPlanes=B.numClippingPlanes,X.numIntersection=B.numClipIntersection,X.vertexAlphas=B.vertexAlphas,X.vertexTangents=B.vertexTangents,X.toneMapping=B.toneMapping}function tg(R,B,X,q,H){B.isScene!==!0&&(B=Ue),Ke.resetTextureUnits();let ae=B.fog,xe=q.isMeshStandardMaterial?B.environment:null,Se=A===null?v.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:rs,_e=(q.isMeshStandardMaterial?Ot:Yt).get(q.envMap||xe),ke=q.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,ze=!!X.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Ne=!!X.morphAttributes.position,it=!!X.morphAttributes.normal,pt=!!X.morphAttributes.color,Ft=Ri;q.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Ft=v.toneMapping);let Et=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,gt=Et!==void 0?Et.length:0,Fe=Te.get(q),Pt=m.state.lights;if(et===!0&&(Q===!0||R!==_)){let rn=R===_&&q.id===M;he.setState(q,R,rn)}let lt=!1;q.version===Fe.__version?(Fe.needsLights&&Fe.lightsStateVersion!==Pt.state.version||Fe.outputColorSpace!==Se||H.isBatchedMesh&&Fe.batching===!1||!H.isBatchedMesh&&Fe.batching===!0||H.isBatchedMesh&&Fe.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Fe.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Fe.instancing===!1||!H.isInstancedMesh&&Fe.instancing===!0||H.isSkinnedMesh&&Fe.skinning===!1||!H.isSkinnedMesh&&Fe.skinning===!0||H.isInstancedMesh&&Fe.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Fe.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Fe.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Fe.instancingMorph===!1&&H.morphTexture!==null||Fe.envMap!==_e||q.fog===!0&&Fe.fog!==ae||Fe.numClippingPlanes!==void 0&&(Fe.numClippingPlanes!==he.numPlanes||Fe.numIntersection!==he.numIntersection)||Fe.vertexAlphas!==ke||Fe.vertexTangents!==ze||Fe.morphTargets!==Ne||Fe.morphNormals!==it||Fe.morphColors!==pt||Fe.toneMapping!==Ft||Fe.morphTargetsCount!==gt)&&(lt=!0):(lt=!0,Fe.__version=q.version);let vn=Fe.currentProgram;lt===!0&&(vn=io(q,B,H));let Bs=!1,_n=!1,Fr=!1,Lt=vn.getUniforms(),Cn=Fe.uniforms;if(we.useProgram(vn.program)&&(Bs=!0,_n=!0,Fr=!0),q.id!==M&&(M=q.id,_n=!0),Bs||_!==R){we.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),Lt.setValue(N,"projectionMatrix",R.projectionMatrix),Lt.setValue(N,"viewMatrix",R.matrixWorldInverse);let hn=Lt.map.cameraPosition;hn!==void 0&&hn.setValue(N,Me.setFromMatrixPosition(R.matrixWorld)),He.logarithmicDepthBuffer&&Lt.setValue(N,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&Lt.setValue(N,"isOrthographic",R.isOrthographicCamera===!0),_!==R&&(_=R,_n=!0,Fr=!0)}if(H.isSkinnedMesh){Lt.setOptional(N,H,"bindMatrix"),Lt.setOptional(N,H,"bindMatrixInverse");let rn=H.skeleton;rn&&(rn.boneTexture===null&&rn.computeBoneTexture(),Lt.setValue(N,"boneTexture",rn.boneTexture,Ke))}H.isBatchedMesh&&(Lt.setOptional(N,H,"batchingTexture"),Lt.setValue(N,"batchingTexture",H._matricesTexture,Ke),Lt.setOptional(N,H,"batchingIdTexture"),Lt.setValue(N,"batchingIdTexture",H._indirectTexture,Ke),Lt.setOptional(N,H,"batchingColorTexture"),H._colorsTexture!==null&&Lt.setValue(N,"batchingColorTexture",H._colorsTexture,Ke));let In=X.morphAttributes;if((In.position!==void 0||In.normal!==void 0||In.color!==void 0)&&oe.update(H,X,vn),(_n||Fe.receiveShadow!==H.receiveShadow)&&(Fe.receiveShadow=H.receiveShadow,Lt.setValue(N,"receiveShadow",H.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(Cn.envMap.value=_e,Cn.flipEnvMap.value=_e.isCubeTexture&&_e.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&B.environment!==null&&(Cn.envMapIntensity.value=B.environmentIntensity),_n&&(Lt.setValue(N,"toneMappingExposure",v.toneMappingExposure),Fe.needsLights&&ng(Cn,Fr),ae&&q.fog===!0&&ie.refreshFogUniforms(Cn,ae),ie.refreshMaterialUniforms(Cn,q,W,ee,m.state.transmissionRenderTarget[R.id]),wr.upload(N,ad(Fe),Cn,Ke)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(wr.upload(N,ad(Fe),Cn,Ke),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&Lt.setValue(N,"center",H.center),Lt.setValue(N,"modelViewMatrix",H.modelViewMatrix),Lt.setValue(N,"normalMatrix",H.normalMatrix),Lt.setValue(N,"modelMatrix",H.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){let rn=q.uniformsGroups;for(let hn=0,qc=rn.length;hn<qc;hn++){let Ki=rn[hn];Ze.update(Ki,vn),Ze.bind(Ki,vn)}}return vn}function ng(R,B){R.ambientLightColor.needsUpdate=B,R.lightProbe.needsUpdate=B,R.directionalLights.needsUpdate=B,R.directionalLightShadows.needsUpdate=B,R.pointLights.needsUpdate=B,R.pointLightShadows.needsUpdate=B,R.spotLights.needsUpdate=B,R.spotLightShadows.needsUpdate=B,R.rectAreaLights.needsUpdate=B,R.hemisphereLights.needsUpdate=B}function ig(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return y},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(R,B,X){let q=Te.get(R);q.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,q.__autoAllocateDepthBuffer===!1&&(q.__useRenderToTexture=!1),Te.get(R.texture).__webglTexture=B,Te.get(R.depthTexture).__webglTexture=q.__autoAllocateDepthBuffer?void 0:X,q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,B){let X=Te.get(R);X.__webglFramebuffer=B,X.__useDefaultFramebuffer=B===void 0};let sg=N.createFramebuffer();this.setRenderTarget=function(R,B=0,X=0){A=R,y=B,w=X;let q=!0,H=null,ae=!1,xe=!1;if(R){let _e=Te.get(R);if(_e.__useDefaultFramebuffer!==void 0)we.bindFramebuffer(N.FRAMEBUFFER,null),q=!1;else if(_e.__webglFramebuffer===void 0)Ke.setupRenderTarget(R);else if(_e.__hasExternalTextures)Ke.rebindTextures(R,Te.get(R.texture).__webglTexture,Te.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){let Ne=R.depthTexture;if(_e.__boundDepthTexture!==Ne){if(Ne!==null&&Te.has(Ne)&&(R.width!==Ne.image.width||R.height!==Ne.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ke.setupDepthRenderbuffer(R)}}let ke=R.texture;(ke.isData3DTexture||ke.isDataArrayTexture||ke.isCompressedArrayTexture)&&(xe=!0);let ze=Te.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(ze[B])?H=ze[B][X]:H=ze[B],ae=!0):R.samples>0&&Ke.useMultisampledRTT(R)===!1?H=Te.get(R).__webglMultisampledFramebuffer:Array.isArray(ze)?H=ze[X]:H=ze,P.copy(R.viewport),D.copy(R.scissor),F=R.scissorTest}else P.copy(Z).multiplyScalar(W).floor(),D.copy(Re).multiplyScalar(W).floor(),F=nt;if(X!==0&&(H=sg),we.bindFramebuffer(N.FRAMEBUFFER,H)&&q&&we.drawBuffers(R,H),we.viewport(P),we.scissor(D),we.setScissorTest(F),ae){let _e=Te.get(R.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+B,_e.__webglTexture,X)}else if(xe){let _e=B;for(let ke=0;ke<R.textures.length;ke++){let ze=Te.get(R.textures[ke]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+ke,ze.__webglTexture,X,_e)}}else if(R!==null&&X!==0){let _e=Te.get(R.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,_e.__webglTexture,X)}M=-1},this.readRenderTargetPixels=function(R,B,X,q,H,ae,xe,Se=0){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _e=Te.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&xe!==void 0&&(_e=_e[xe]),_e){we.bindFramebuffer(N.FRAMEBUFFER,_e);try{let ke=R.textures[Se],ze=ke.format,Ne=ke.type;if(!He.textureFormatReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!He.textureTypeReadable(Ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=R.width-q&&X>=0&&X<=R.height-H&&(R.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Se),N.readPixels(B,X,q,H,Pe.convert(ze),Pe.convert(Ne),ae))}finally{let ke=A!==null?Te.get(A).__webglFramebuffer:null;we.bindFramebuffer(N.FRAMEBUFFER,ke)}}},this.readRenderTargetPixelsAsync=async function(R,B,X,q,H,ae,xe,Se=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _e=Te.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&xe!==void 0&&(_e=_e[xe]),_e)if(B>=0&&B<=R.width-q&&X>=0&&X<=R.height-H){we.bindFramebuffer(N.FRAMEBUFFER,_e);let ke=R.textures[Se],ze=ke.format,Ne=ke.type;if(!He.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!He.textureTypeReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let it=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,it),N.bufferData(N.PIXEL_PACK_BUFFER,ae.byteLength,N.STREAM_READ),R.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Se),N.readPixels(B,X,q,H,Pe.convert(ze),Pe.convert(Ne),0);let pt=A!==null?Te.get(A).__webglFramebuffer:null;we.bindFramebuffer(N.FRAMEBUFFER,pt);let Ft=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await jf(N,Ft,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,it),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,ae),N.deleteBuffer(it),N.deleteSync(Ft),ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,B=null,X=0){let q=Math.pow(2,-X),H=Math.floor(R.image.width*q),ae=Math.floor(R.image.height*q),xe=B!==null?B.x:0,Se=B!==null?B.y:0;Ke.setTexture2D(R,0),N.copyTexSubImage2D(N.TEXTURE_2D,X,0,0,xe,Se,H,ae),we.unbindTexture()};let rg=N.createFramebuffer(),ag=N.createFramebuffer();this.copyTextureToTexture=function(R,B,X=null,q=null,H=0,ae=null){ae===null&&(H!==0?(or("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ae=H,H=0):ae=0);let xe,Se,_e,ke,ze,Ne,it,pt,Ft,Et=R.isCompressedTexture?R.mipmaps[ae]:R.image;if(X!==null)xe=X.max.x-X.min.x,Se=X.max.y-X.min.y,_e=X.isBox3?X.max.z-X.min.z:1,ke=X.min.x,ze=X.min.y,Ne=X.isBox3?X.min.z:0;else{let In=Math.pow(2,-H);xe=Math.floor(Et.width*In),Se=Math.floor(Et.height*In),R.isDataArrayTexture?_e=Et.depth:R.isData3DTexture?_e=Math.floor(Et.depth*In):_e=1,ke=0,ze=0,Ne=0}q!==null?(it=q.x,pt=q.y,Ft=q.z):(it=0,pt=0,Ft=0);let gt=Pe.convert(B.format),Fe=Pe.convert(B.type),Pt;B.isData3DTexture?(Ke.setTexture3D(B,0),Pt=N.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(Ke.setTexture2DArray(B,0),Pt=N.TEXTURE_2D_ARRAY):(Ke.setTexture2D(B,0),Pt=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,B.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,B.unpackAlignment);let lt=N.getParameter(N.UNPACK_ROW_LENGTH),vn=N.getParameter(N.UNPACK_IMAGE_HEIGHT),Bs=N.getParameter(N.UNPACK_SKIP_PIXELS),_n=N.getParameter(N.UNPACK_SKIP_ROWS),Fr=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,Et.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Et.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,ke),N.pixelStorei(N.UNPACK_SKIP_ROWS,ze),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Ne);let Lt=R.isDataArrayTexture||R.isData3DTexture,Cn=B.isDataArrayTexture||B.isData3DTexture;if(R.isDepthTexture){let In=Te.get(R),rn=Te.get(B),hn=Te.get(In.__renderTarget),qc=Te.get(rn.__renderTarget);we.bindFramebuffer(N.READ_FRAMEBUFFER,hn.__webglFramebuffer),we.bindFramebuffer(N.DRAW_FRAMEBUFFER,qc.__webglFramebuffer);for(let Ki=0;Ki<_e;Ki++)Lt&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Te.get(R).__webglTexture,H,Ne+Ki),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Te.get(B).__webglTexture,ae,Ft+Ki)),N.blitFramebuffer(ke,ze,xe,Se,it,pt,xe,Se,N.DEPTH_BUFFER_BIT,N.NEAREST);we.bindFramebuffer(N.READ_FRAMEBUFFER,null),we.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(H!==0||R.isRenderTargetTexture||Te.has(R)){let In=Te.get(R),rn=Te.get(B);we.bindFramebuffer(N.READ_FRAMEBUFFER,rg),we.bindFramebuffer(N.DRAW_FRAMEBUFFER,ag);for(let hn=0;hn<_e;hn++)Lt?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,In.__webglTexture,H,Ne+hn):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,In.__webglTexture,H),Cn?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,rn.__webglTexture,ae,Ft+hn):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,rn.__webglTexture,ae),H!==0?N.blitFramebuffer(ke,ze,xe,Se,it,pt,xe,Se,N.COLOR_BUFFER_BIT,N.NEAREST):Cn?N.copyTexSubImage3D(Pt,ae,it,pt,Ft+hn,ke,ze,xe,Se):N.copyTexSubImage2D(Pt,ae,it,pt,ke,ze,xe,Se);we.bindFramebuffer(N.READ_FRAMEBUFFER,null),we.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else Cn?R.isDataTexture||R.isData3DTexture?N.texSubImage3D(Pt,ae,it,pt,Ft,xe,Se,_e,gt,Fe,Et.data):B.isCompressedArrayTexture?N.compressedTexSubImage3D(Pt,ae,it,pt,Ft,xe,Se,_e,gt,Et.data):N.texSubImage3D(Pt,ae,it,pt,Ft,xe,Se,_e,gt,Fe,Et):R.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,ae,it,pt,xe,Se,gt,Fe,Et.data):R.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,ae,it,pt,Et.width,Et.height,gt,Et.data):N.texSubImage2D(N.TEXTURE_2D,ae,it,pt,xe,Se,gt,Fe,Et);N.pixelStorei(N.UNPACK_ROW_LENGTH,lt),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,vn),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Bs),N.pixelStorei(N.UNPACK_SKIP_ROWS,_n),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Fr),ae===0&&B.generateMipmaps&&N.generateMipmap(Pt),we.unbindTexture()},this.initRenderTarget=function(R){Te.get(R).__webglFramebuffer===void 0&&Ke.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?Ke.setTextureCube(R,0):R.isData3DTexture?Ke.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?Ke.setTexture2DArray(R,0):Ke.setTexture2D(R,0),we.unbindTexture()},this.resetState=function(){y=0,w=0,A=null,we.reset(),ge.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Hn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=ot._getDrawingBufferColorSpace(e),t.unpackColorSpace=ot._getUnpackColorSpace()}};var Ha=new U;function Un(i,e,t,n,s,r){let a=2*Math.PI*s/4,o=Math.max(r-2*s,0),c=Math.PI/4;Ha.copy(e),Ha[n]=0,Ha.normalize();let l=.5*a/(a+o),h=1-Ha.angleTo(i)/c;return Math.sign(Ha[t])===1?h*l:o/(a+o)+l+l*(1-h)}var za=class i extends xt{constructor(e=1,t=1,n=1,s=2,r=.1){let a=s*2+1;if(r=Math.min(e/2,t/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:n,segments:s,radius:r},a===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let c=new U,l=new U,h=new U(e,t,n).divideScalar(2).subScalar(r),u=this.attributes.position.array,f=this.attributes.normal.array,d=this.attributes.uv.array,p=u.length/6,x=new U,g=.5/a;for(let m=0,b=0;m<u.length;m+=3,b+=2)switch(c.fromArray(u,m),l.copy(c),l.x-=Math.sign(l.x)*g,l.y-=Math.sign(l.y)*g,l.z-=Math.sign(l.z)*g,l.normalize(),u[m+0]=h.x*Math.sign(c.x)+l.x*r,u[m+1]=h.y*Math.sign(c.y)+l.y*r,u[m+2]=h.z*Math.sign(c.z)+l.z*r,f[m+0]=l.x,f[m+1]=l.y,f[m+2]=l.z,Math.floor(m/p)){case 0:x.set(1,0,0),d[b+0]=Un(x,l,"z","y",r,n),d[b+1]=1-Un(x,l,"y","z",r,t);break;case 1:x.set(-1,0,0),d[b+0]=1-Un(x,l,"z","y",r,n),d[b+1]=1-Un(x,l,"y","z",r,t);break;case 2:x.set(0,1,0),d[b+0]=1-Un(x,l,"x","z",r,e),d[b+1]=Un(x,l,"z","x",r,n);break;case 3:x.set(0,-1,0),d[b+0]=1-Un(x,l,"x","z",r,e),d[b+1]=1-Un(x,l,"z","x",r,n);break;case 4:x.set(0,0,1),d[b+0]=1-Un(x,l,"x","y",r,e),d[b+1]=1-Un(x,l,"y","x",r,t);break;case 5:x.set(0,0,-1),d[b+0]=Un(x,l,"x","y",r,e),d[b+1]=1-Un(x,l,"y","x",r,t);break}}static fromJSON(e){return new i(e.width,e.height,e.depth,e.segments,e.radius)}};function fc(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,c=new tt,l=0;for(let h=0;h<i.length;++h){let u=i[h],f=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(u.morphAttributes[d])}if(e){let d;if(t)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,d,h),l+=d}}if(t){let h=0,u=[];for(let f=0;f<i.length;++f){let d=i[f].index;for(let p=0;p<d.count;++p)u.push(d.getX(p)+h);h+=i[f].attributes.position.count}c.setIndex(u)}for(let h in r){let u=Np(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(let h in a){let u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let f=0;f<u;++f){let d=[];for(let x=0;x<a[h].length;++x)d.push(a[h][x][f]);let p=Np(d);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(p)}}return c}function Np(i){let e,t,n,s=-1,r=0;for(let l=0;l<i.length;++l){let h=i[l];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let a=new e(r),o=new kt(a,t,n),c=0;for(let l=0;l<i.length;++l){let h=i[l];if(h.isInterleavedBufferAttribute){let u=c/t;for(let f=0,d=h.count;f<d;f++)for(let p=0;p<t;p++){let x=h.getComponent(f,p);o.setComponent(f+u,p,x)}}else a.set(h.array,c);c+=h.count*t}return s!==void 0&&(o.gpuType=s),o}var Ar=(i,e,t)=>Math.max(e,Math.min(t,i));function Fp(i=0,e=0){return{lane:i,velocity:0,distance:e,wheelAngle:0,lastSpeed:0,roll:0,pitch:0,steer:0,phase:0,bob:0,braking:!1}}function Op(i,e,t,n,s,r=!1){if(r||s<=0)return i;s=Math.min(s,.1);let a=24,o=i.lane-e,c=i.velocity+a*o,l=Math.exp(-a*s);i.lane=e+(o+c*s)*l,i.velocity=(i.velocity-a*c*s)*l,Math.abs(i.lane)>1&&(i.lane=Ar(i.lane,-1,1),i.velocity=0);let h=Math.max(0,t-i.distance);i.distance=t,i.wheelAngle=(i.wheelAngle+h/.43)%(Math.PI*2);let u=Ar((n-i.lastSpeed)/s,-24,16);i.lastSpeed=n,i.braking=u<-2||n<.4;let f=1-Math.exp(-12*s),d=Ar(n/20,0,1);return i.steer+=(Ar(-i.velocity*3.35/Math.max(8,n),-.38,.38)-i.steer)*f,i.roll+=(Ar(i.velocity*.023,-.105,.105)*d-i.roll)*f,i.pitch+=(Ar(-u*.0025,-.04,.06)-i.pitch)*f,i.phase+=h*1.05,i.bob=Math.sin(i.phase)*.018*d,i}function pc(i){return{start:i.start-30,end:i.end+40}}function m1(i){let e=[],t=[],n=[],s=[],r=(a,o,c)=>a+(o-a)*c;for(let a=0;a<i.length-1;a++){let o=i[a],c=i[a+1],l=[];for(let u=0;u<o.intervals.length;u++)for(let f=0;f<2;f++)l.push({a:o.intervals[u][f],b:c.intervals[u][f],id:u,side:f});let h=[0,1];for(let u=0;u<l.length;u++)for(let f=u+1;f<l.length;f++){let d=l[u],p=l[f],x=d.b-d.a-(p.b-p.a);if(Math.abs(x)>1e-9){let g=(p.a-d.a)/x;g>1e-7&&g<1-1e-7&&h.push(g)}}h.sort((u,f)=>u-f);for(let u=0;u<h.length-1;u++){let f=h[u],d=h[u+1];if(d-f<1e-7)continue;let p=(f+d)/2,x=S=>r(o.at,c.at,S),g=(S,v)=>r(S.a,S.b,v),m=o.intervals.map((S,v)=>({left:l[v*2],right:l[v*2+1]})).sort((S,v)=>g(S.left,p)-g(v.left,p)),b=[];for(let S of m){let v=b.at(-1);v&&g(S.left,p)<=g(v.right,p)+1e-8?g(S.right,p)>g(v.right,p)&&(v.right=S.right):b.push({...S})}for(let S of b){let v=[[g(S.left,f),x(f)],[g(S.right,f),x(f)],[g(S.left,d),x(d)],[g(S.right,d),x(d)]],I=e.length/3;for(let[y,w]of v)e.push(y,0,-w),t.push(y/10.8,w/20);n.push(I,I+1,I+2,I+2,I+1,I+3),s.push([v[0],v[2]],[v[1],v[3]])}}}return{positions:e,uvs:t,indices:n,edges:s}}function kp(i,e,t,n){let s=i[0],r=pc(s),a=new Set([r.start,s.start,s.end,r.end]);for(let l=r.start;l<r.end;l+=2)a.add(l);let o=l=>l*l*l*(10+l*(-15+6*l)),c=[...a].sort((l,h)=>l-h).map(l=>{let h,u;if(l<s.start){let d=o((l-r.start)/30);h=[-3.35,0,3.35],u=8.2-2.8*d}else if(l>s.end){let d=o((l-s.end)/40);h=[-3.35,0,3.35],u=5.4+2.8*d}else h=i.map(d=>d.lane*3.35+t(d,l)),u=5.4;let f=e(l)-e(n);return{at:l-n,intervals:h.map(d=>[f+d-u,f+d+u])}});return{...m1(c),rows:c,bounds:r}}var Ga=i=>(i=Math.max(0,Math.min(1,i)),i*i*i*(10+i*(-15+6*i))),Bp=(i,e)=>(i-e.start)/(e.end-e.start);function g1(i,e=!1){return e&&i>4?4+(i-4)*.4:i}function x1(i,e,t=!1,n=[]){let s={forward:0,lateral:0,up:0,roll:0};if(t)return s;for(let r of n){let a=Bp(i,r);if(r.kind==="loop"){let o=r.count||1;if(a>0&&a<1){let l=2*Math.PI*o*Ga(a);s.forward+=r.radius*Math.sin(l),s.up+=r.radius*(1-Math.cos(l))}let c=(r.end+r.settle-i)/r.settle;a>0&&(s.lateral+=e*r.shift*o*Math.min(Ga(a),Ga(c)))}else if(r.kind==="corkscrew"||r.kind==="roll")a>0&&a<1&&(s.roll+=-e*2*Math.PI*(r.turns||1)*Ga(a));else if(r.kind==="helix"&&a>0&&a<1){let o=2*Math.PI*Ga(a);s.forward+=r.radius*Math.sin(o),s.lateral+=e*r.radius*(1-Math.cos(o)),s.roll+=-e*r.bank*Math.sin(Math.PI*a)**2}else if(r.kind==="halfpipe"&&a>0&&a<1){let o=Math.sin(Math.PI*a)**2,c=Math.sin(2*Math.PI*(r.swerves||2)*a);s.lateral+=e*r.swing*c*o,s.roll+=e*r.bank*c*o}}return s}var Tu=(i,e=[],t=6)=>e.find(n=>i>n.start-t&&i<n.end+(n.settle||t))||null;function y1(i,e=[],t=0,n=!1){if(n)return 0;let s=Tu(i,e,0);return s?.kind==="air"?Math.sin(Math.PI*Math.max(0,Math.min(1,Bp(i,s))))**.6:Math.max(0,Math.min(1,t/5))}function v1(i,e,t=!1){if(t)return 0;let n=3,s=(i(e+n)-2*i(e)+i(e-n))/(n*n);return Math.max(-.34,Math.min(.34,-s*55))}var Eu=(i,e)=>[i[0]-e[0],i[1]-e[1],i[2]-e[2]],vs=(i,e,t=1)=>[i[0]+e[0]*t,i[1]+e[1]*t,i[2]+e[2]*t],wu=(i,e)=>i[0]*e[0]+i[1]*e[1]+i[2]*e[2],_1=(i,e)=>[i[1]*e[2]-i[2]*e[1],i[2]*e[0]-i[0]*e[2],i[0]*e[1]-i[1]*e[0]],Rr=i=>{let e=Math.hypot(...i)||1;return[i[0]/e,i[1]/e,i[2]/e]};function Hp({route:i,curve:e,offset:t,height:n,origin:s,span:r,elements:a=[],reduced:o=!1,step:c=.5}){let l=d=>e(d)-e(s)+i.lane*3.35+t(i,d),h=d=>[l(d),g1(n(i,d),o),-(d-s)],u=d=>(d-i.start)*r/(i.end-i.start),f=[];for(let d=i.start;d<=i.end+1e-6;d+=c){let p=h(d),x=h(d+.25),g=h(d-.25),m=Rr([x[0]-g[0],0,x[2]-g[2]]),b=[-m[2],0,m[0]],S=u(d),v=x1(S,i.side,o,a),I=Tu(S,a)?.kind||null,y=Tu(S,a,0),w=vs(vs(vs(p,m,v.forward),b,v.lateral),[0,1,0],v.up),A=Math.hypot(v.forward,v.lateral,v.up);f.push({at:d,u:S,kind:I,p:w,baseSide:b,detour:A,wide:y1(S,a,A,o),air:y?.kind==="air",tunnel:y?.kind==="tunnel",halfpipe:y?.kind==="halfpipe",roll:v1(l,d,o)+v.roll,inDetour:A+Math.abs(v.roll)>.01||y?.kind==="air"})}return f.forEach((d,p)=>{let x=f[Math.min(f.length-1,p+1)].p,g=f[Math.max(0,p-1)].p;d.t=Rr(Eu(x,g));let m=d.kind==="loop"?d.baseSide:[-d.t[2],0,d.t[0]];d.l=Rr(Eu(m,[d.t[0]*wu(m,d.t),d.t[1]*wu(m,d.t),d.t[2]*wu(m,d.t)])),d.n=_1(d.l,d.t);let b=Math.cos(d.roll),S=Math.sin(d.roll);d.right=[d.l[0]*b+d.n[0]*S,d.l[1]*b+d.n[1]*S,d.l[2]*b+d.n[2]*S],d.up=[-d.l[0]*S+d.n[0]*b,-d.l[1]*S+d.n[1]*b,-d.l[2]*S+d.n[2]*b],d.pivot=i.side*3.2/2,d.axis=vs(vs(d.p,d.l,d.pivot),d.n,.9),d.speed=p<f.length-1?Math.hypot(...Eu(f[p+1].p,d.p))/c:1}),f}function Au(i,e,t=0,n=0){return vs(vs(i.axis,i.right,e+t-i.pivot),i.up,n-.9)}function Va(i,e,t){let n=[],s=[],r=e.length;for(let a of i)for(let[o,c]of e)n.push(...Au(a,t,o,c));for(let a=0;a<i.length-1;a++)for(let o=0;o<r;o++){let c=a*r+o,l=a*r+(o+1)%r,h=c+r,u=l+r;s.push(c,h,l,l,h,u)}return{positions:n,indices:s}}var zp=[[-1.2,0],[1.2,0],[1.2,-.55],[-1.2,-.55]],Gp=i=>[[i-.09,.2],[i+.09,.2],[i+.09,0],[i-.09,0]],Vp=i=>[[i-.14,1.15],[i+.14,1.15],[i+.14,0],[i-.14,0]];function Wp(i,e=5.4,t=.9){let n=[],s=[];for(let r=0;r<=12;r++){let a=Math.PI*(-.08+1.16*r/12);n.push([i+Math.cos(a)*(e+t),Math.sin(a)*(e+t)-.6]),s.push([i+Math.cos(a)*e,Math.sin(a)*e-.6])}return[...n,...s.reverse()]}function mc(i,e){let t=[],n=[];for(let s of i)e(s)?n.push(s):(n.length>1&&t.push(n),n=[]);return n.length>1&&t.push(n),t}function Xp(i,e,t=0){if(!i.length)return null;let n=i.length>1?i[1].at-i[0].at:1,s=Math.max(0,Math.min(i.length-1,(e-i[0].at)/n)),r=Math.min(i.length-2,Math.floor(s)),a=s-r,o=i[r],c=i[Math.min(i.length-1,r+1)],l=(f,d)=>[f[0]+(d[0]-f[0])*a,f[1]+(d[1]-f[1])*a,f[2]+(d[2]-f[2])*a],h=Au(o,t),u=Au(c,t);return{position:l(h,u),right:Rr(l(o.right,c.right)),up:Rr(l(o.up,c.up)),forward:Rr(l(o.t,c.t)),speed:o.speed+(c.speed-o.speed)*a,detour:o.detour+(c.detour-o.detour)*a,wide:o.wide+(c.wide-o.wide)*a,kind:a<.5?o.kind:c.kind,air:o.air&&c.air,inverted:o.up[1]<0}}function qp(i,e,t,n=8){let s=[],r=-1/0;for(let a of i){if(a.p[1]<1.2||a.inDetour||a.air||a.up[1]<.85||a.at-r<n)continue;r=a.at;let o=a.axis[0],c=e(a.at),l=a.p[1]-.55,h=c-t(a.at,-1)-1.6,u=c+t(a.at,1)+1.6;o>h-1.2&&o<u+1.2?l>=4.6&&s.push({kind:"portal",at:a.at,z:a.p[2],top:l,left:h,right:u,x:o}):s.push({kind:"column",at:a.at,z:a.p[2],top:l,x:o})}return s}var Wa=new bt,gc=new Ae,Bt=class{constructor(){this.parts=new Map}add(e,t,n,s=0,r=0,a=0,o=1,c=1,l=1,h=0,u=0,f=0){let d=t.index?t.toNonIndexed():t.clone();for(let g of Object.keys(d.attributes))g!=="position"&&g!=="normal"&&d.deleteAttribute(g);Wa.position.set(s,r,a),Wa.rotation.set(h,u,f),Wa.scale.set(o,c,l),Wa.updateMatrix(),d.applyMatrix4(Wa.matrix),gc.set(n);let p=d.attributes.position.count,x=new Float32Array(p*3);for(let g=0;g<p;g++)x[g*3]=gc.r,x[g*3+1]=gc.g,x[g*3+2]=gc.b;return d.setAttribute("color",new kt(x,3)),this.parts.has(e)||this.parts.set(e,[]),this.parts.get(e).push(d),d}addGeometry(e,t,n){return this.add(e,t,n)}has(e){return!!this.parts.get(e)?.length}merge(e){let t=this.parts.get(e);if(!t?.length)return null;let n=t.length===1?t[0]:fc(t);return t.length>1&&t.forEach(s=>s.dispose()),this.parts.delete(e),n.computeBoundingSphere(),n}keys(){return[...this.parts.keys()]}};function Xa(...i){let e=2166136261;for(let t of i)e^=Math.floor(t*1e3)|0,e=Math.imul(e,16777619),e^=e>>>13;return(e>>>0)%1e5/1e5}function oi(i){let e=i>>>0||1;return()=>{e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var b1=[[-.84,0],[-.965,.09],[-1,.28],[-.995,.5],[-.965,.7],[-.88,.87],[-.66,.98],[-.3,1],[.3,1],[.66,.98],[.88,.87],[.965,.7],[.995,.5],[1,.28],[.965,.09],[.84,0]],M1=[[-1,0],[-1,1],[1,1],[1,0]];function xc(i,{profile:e=b1,tumble:t=1}={}){let n=e.length,s=[],r=[],a=[],o=[],c=(p,[x,g])=>{let m=1+((p.tumble??t)-1)*g;return[x*p.w*m+(p.x||0),p.low+g*(p.high-p.low),p.z]};i.forEach(p=>e.forEach(x=>s.push(...c(p,x))));for(let p=0;p<i.length-1;p++)for(let x=0;x<n;x++){let g=p*n+x,m=p*n+(x+1)%n,b=g+n,S=m+n;a.push(g,b,m,m,b,S)}for(let[p,x]of[[0,i[0]],[1,i.at(-1)]]){let g=r.length/3;e.forEach(m=>r.push(...c(x,m)));for(let m=1;m<n-1;m++)p?o.push(g,g+m+1,g+m):o.push(g,g+m,g+m+1)}let l=new tt;l.setAttribute("position",new Le(s,3)),l.setIndex(a),l.computeVertexNormals();let h=new tt;h.setAttribute("position",new Le(r,3)),h.setIndex(o),h.computeVertexNormals();let u=new tt,f=l.toNonIndexed(),d=h.toNonIndexed();for(let p of["position","normal"])u.setAttribute(p,new Le([...f.attributes[p].array,...d.attributes[p].array],3));return[l,h,f,d].forEach(p=>p.dispose()),u}function Kt(i,e){if(e<=i[0].z)return{...i[0]};if(e>=i.at(-1).z)return{...i.at(-1)};for(let t=1;t<i.length;t++)if(e<=i[t].z){let n=i[t-1],s=i[t],r=(e-n.z)/(s.z-n.z),a={z:e};for(let o of["w","low","high","tumble"])a[o]=(n[o]??1)+((s[o]??1)-(n[o]??1))*r;return a}}var ue=(i,e,t,n,s)=>({z:i,w:e,low:t,high:n,tumble:s}),$p={coupe:{body:[ue(-2.25,.78,.37,.6,.92),ue(-2.13,.95,.3,.69),ue(-1.88,1.04,.28,.77),ue(-1.25,1.07,.28,.85),ue(-.78,1.075,.28,.9),ue(.35,1.065,.28,.93),ue(1.1,1.095,.28,.95),ue(1.78,1.075,.3,.95),ue(2.12,.99,.34,.9),ue(2.26,.84,.42,.82)],canopy:[ue(-.9,.86,.84,.9,.86),ue(-.32,.82,.86,1.29,.76),ue(.12,.8,.88,1.37,.74),ue(.74,.78,.88,1.36,.74),ue(1.36,.82,.88,1.08,.8),ue(1.78,.88,.9,.95,.9)],wheel:{r:.42,w:.3,x:.99,z:[-1.38,1.42]},lamps:{y:.79,z:2.2,x:.56,w:.66},head:{y:.64,z:-2.13,x:.68},exhaust:[.62,.36,2.24],stripes:!0,spoiler:"lip"},gt:{body:[ue(-2.3,.82,.33,.52,.9),ue(-2.16,1,.27,.62),ue(-1.85,1.1,.25,.72),ue(-1.2,1.12,.25,.79),ue(-.7,1.11,.25,.83),ue(.4,1.1,.25,.86),ue(1.12,1.15,.25,.9),ue(1.82,1.12,.27,.9),ue(2.18,1.03,.32,.86),ue(2.3,.88,.4,.78)],canopy:[ue(-.72,.84,.78,.83,.84),ue(-.18,.8,.8,1.19,.72),ue(.3,.78,.82,1.25,.7),ue(.86,.76,.82,1.23,.72),ue(1.42,.82,.82,.99,.8),ue(1.8,.88,.84,.88,.9)],wheel:{r:.42,w:.34,x:1.03,z:[-1.42,1.46]},lamps:{y:.74,z:2.25,x:.58,w:.7},head:{y:.58,z:-2.18,x:.72},exhaust:[.5,.33,2.28],wing:!0,splitter:!0},sedan:{body:[ue(-2.28,.86,.4,.68,.95),ue(-2.12,.98,.34,.8),ue(-1.7,1.03,.32,.86),ue(-.9,1.04,.32,.9),ue(.6,1.04,.32,.92),ue(1.6,1.03,.32,.94),ue(2.12,.97,.36,.92),ue(2.26,.86,.44,.86)],canopy:[ue(-1.02,.88,.86,.92,.88),ue(-.45,.85,.88,1.44,.82),ue(.95,.84,.9,1.46,.82),ue(1.45,.86,.9,1.06,.86),ue(1.72,.9,.9,.95,.92)],wheel:{r:.4,w:.26,x:.95,z:[-1.42,1.42]},lamps:{y:.84,z:2.22,x:.6,w:.5},head:{y:.72,z:-2.15,x:.68},exhaust:[.55,.38,2.24]},hatch:{body:[ue(-2,.86,.4,.7,.95),ue(-1.86,.97,.34,.82),ue(-1.4,1.02,.32,.88),ue(-.7,1.03,.32,.93),ue(.8,1.03,.32,.96),ue(1.62,1,.34,.98),ue(1.84,.92,.4,.96)],canopy:[ue(-.82,.88,.88,.95,.88),ue(-.25,.85,.9,1.48,.84),ue(1.2,.84,.9,1.5,.84),ue(1.62,.86,.92,1.34,.86),ue(1.76,.88,.94,1,.9)],wheel:{r:.38,w:.25,x:.93,z:[-1.22,1.25]},lamps:{y:1,z:1.8,x:.66,w:.36},head:{y:.74,z:-1.94,x:.64},exhaust:[.5,.4,1.86]},suv:{body:[ue(-2.3,.92,.5,.86,.96),ue(-2.14,1.03,.44,1),ue(-1.7,1.08,.42,1.08),ue(-.9,1.09,.42,1.12),ue(.9,1.09,.42,1.14),ue(1.9,1.07,.44,1.14),ue(2.22,1,.48,1.1),ue(2.3,.92,.56,1.04)],canopy:[ue(-1,.94,1.06,1.12,.92),ue(-.45,.92,1.08,1.74,.88),ue(1.75,.92,1.1,1.78,.9),ue(2.1,.94,1.1,1.6,.92),ue(2.22,.95,1.1,1.14,.95)],wheel:{r:.47,w:.32,x:1,z:[-1.45,1.5]},lamps:{y:1.12,z:2.26,x:.74,w:.34},head:{y:.92,z:-2.2,x:.7},exhaust:[.6,.48,2.3],rack:!0},van:{body:[ue(-2.4,.92,.46,.86,.96),ue(-2.22,1.04,.4,1),ue(-1.7,1.08,.38,1.1),ue(-1.2,1.1,.38,1.14),ue(2.25,1.1,.38,1.16),ue(2.4,1.04,.42,1.12)],canopy:[ue(-1.62,1,1.06,1.12,.94),ue(-1,1,1.08,2.02,.94),ue(2.28,1.04,1.1,2.06,.95),ue(2.38,1,1.1,1.2,.96)],wheel:{r:.44,w:.3,x:1,z:[-1.6,1.55]},lamps:{y:1.12,z:2.38,x:.86,w:.22},head:{y:.86,z:-2.32,x:.74},exhaust:[.6,.44,2.38],panelRoof:!0}},Lu=["sedan","hatch","suv","sedan","van"],Ru=1384748,S1=1711651,Pu=13227226,E1=2503487,Gt=new xt(1,1,1),_s=new dn(1,1,1,20),w1=new as(1,20,0,Math.PI),T1=new Xn(1,12,8),Cu=new Map;function A1(i){let e=i.r+":"+i.w;if(Cu.has(e))return Cu.get(e);let t=new Bt,n=i.r,s=i.w,r=Math.PI/2;t.add("w",_s,S1,0,0,0,n,s,n,0,0,r),t.add("w",_s,2896699,0,0,0,n*.93,s+.012,n*.93,0,0,r);for(let o of[-1,1]){t.add("w",_s,9411750,o*(s*.5+.004),0,0,n*.66,.02,n*.66,0,0,r),t.add("w",_s,3752781,o*(s*.5+.01),0,0,n*.5,.012,n*.5,0,0,r);for(let c=0;c<5;c++)t.add("w",Gt,Pu,o*(s*.5+.016),0,0,.035,n*1.22,.075,c*Math.PI*2/5,0,0);t.add("w",_s,15002863,o*(s*.5+.024),0,0,n*.16,.014,n*.16,0,0,r)}let a=t.merge("w");return Cu.set(e,a),a}var Iu=new Map;function Yp(i="coupe"){if(Iu.has(i))return Iu.get(i);let e=$p[i]||$p.coupe,t=new Bt,n=e.body,s=e.canopy,r=e.wheel,a=n[0].z,o=n.at(-1).z,c=Math.max(...s.map(y=>y.high));t.add("paint",xc(n),16777215),t.add("glass",xc(s),16777215);let l=s.filter(y=>y.high>c-.1).map(y=>y.z),h=Math.min(...l)-.16,u=Math.max(...l)+.14,f=[h,h+.08,(h+u)/2,u-.08,u].map((y,w)=>{let A=Kt(s,y),M=w===0||w===4;return ue(y,A.w*A.tumble*(M?.84:.9),A.high-(M?.07:.13),A.high+.018,.94)});t.add("paint",xc(f),16777215);for(let y of[-1,1]){for(let G of r.z){let V=Kt(n,G),ee=y*(V.w*.985);t.add("trim",w1,725528,ee+y*.012,r.r*.98,G,r.r*1.18,r.r*1.18,1,0,y*Math.PI/2,0);let W=new Ti(r.r*1.2,.055,5,14,Math.PI);t.add("paint",W,16777215,ee+y*.02,r.r*.98,G,1,1,1.6,0,y*Math.PI/2,0),W.dispose()}t.add("trim",Gt,E1,y*(Kt(n,0).w*.97),n[3].low+.07,(r.z[0]+r.z[1])/2,.06,.1,r.z[1]-r.z[0]-r.r*2.3);let w=Kt(s,s[0].z+.25),A=y*(Kt(n,s[0].z+.2).w*.93);t.add("paint",T1,16777215,A+y*.1,w.low+.09,s[0].z+.22,.12,.07,.09),t.add("trim",Gt,Ru,A+y*.04,w.low+.04,s[0].z+.25,.12,.03,.05),t.add("trim",Gt,Pu,y*(Kt(n,.4).w*.985),Kt(n,.4).high-.03,(s[0].z+s.at(-1).z)/2,.015,.022,(s.at(-1).z-s[0].z)*.82);let M=a+.13,_=Kt(n,M),P=Math.min(e.head.y,_.high-.07);t.add("trim",Gt,857372,y*e.head.x,P,M,.42,.12,.2,0,y*.16,0),t.add("lights",Gt,16775398,y*e.head.x,P+.005,M-.012,.36,.07,.2,0,y*.16,0),t.add("lights",Gt,12578815,y*(e.head.x-.02),P-.075,M-.004,.28,.02,.2,0,y*.16,0);let[D,F,k]=e.exhaust;t.add("trim",_s,Pu,y*D,F,k,.07,.12,.07,Math.PI/2,0,0),t.add("trim",_s,724755,y*D,F,k+.05,.05,.04,.05,Math.PI/2,0,0)}let d=Kt(n,a+.05),p=Kt(n,o-.05);if(t.add("trim",Gt,Ru,0,d.low+.13,a+.03,d.w*1.45,.16,.06),t.add("trim",Gt,989216,0,e.head.y-.04,a+.05,d.w*.8,.09,.05),t.add("trim",Gt,Ru,0,p.low+.12,o+.01,p.w*1.6,.16,.06),t.add("trim",Gt,15328207,0,p.low+.27,o+.03,.42,.12,.02),t.add("trim",Gt,5906215,0,e.lamps.y,e.lamps.z+.012,(e.lamps.x-e.lamps.w/2)*2,.045,.03),e.splitter&&t.add("trim",Gt,1120802,0,n[1].low-.02,a+.12,n[1].w*1.9,.035,.32),e.spoiler==="lip"&&t.add("paint",Gt,16777215,0,n.at(-3).high+.04,n.at(-3).z+.12,n.at(-3).w*1.62,.04,.2,-.18,0,0),e.wing){for(let y of[-1,1])t.add("trim",Gt,1581869,y*.62,1,1.92,.06,.26,.12);t.add("trim",Gt,1581869,0,1.14,1.97,2,.05,.38,-.08,0,0);for(let y of[-1,1])t.add("trim",Gt,1581869,y*1,1.1,1.97,.03,.2,.42)}if(e.rack){for(let y of[-1,1])t.add("trim",Gt,10135214,y*.6,c+.06,.6,.05,.05,2.2);for(let y of[-.2,.6,1.4])t.add("trim",Gt,10135214,0,c+.07,y,1.22,.035,.05)}e.panelRoof&&t.add("paint",Gt,16777215,0,c-.18,.62,1.98,.36,3.3);let x=null;if(e.stripes){let y=(A,M,_)=>A.map(P=>{let D=Kt(M,P);return ue(P,.085,D.high+_-.012,D.high+_+.006,1)}),w=[];for(let A of[-.25,.25])for(let[M,_,P]of[[[a+.06,a+.25,-1.6,-1.2,-.82],n,0],[[h+.02,(h+u)/2,u-.02],f.map(D=>({...D,high:D.high})),0],[[s.at(-1).z+.05,1.95,o-.1],n,0]]){let D=xc(y(M,_,P),{profile:M1});D.translate(A,.004,0),w.push(D)}x=new Bt,w.forEach(A=>{x.add("s",A,16052193),A.dispose()}),x=x.merge("s")}let g={bottom:[s[0].high,s[0].z],top:[Kt(s,s[1].z).high,s[1].z]},m=s.length-1,b={bottom:[s[m].high,s[m].z],top:[s[m-1].high,s[m-1].z]},S=s[0].z-.02,v=a+.35,I={kind:i,paint:t.merge("paint"),glass:t.merge("glass"),trim:t.merge("trim"),lights:t.merge("lights"),stripes:x,wheel:A1(r),wheelSpec:r,anchors:{badge:{z:a+.78,y:Kt(n,a+.78).high},roofY:c+.016,roofZ:(h+u)/2,hood:{y:Kt(n,S).high,back:S,front:v,frontY:Kt(n,v).high,w:Kt(n,S).w*.8},windshield:g,rearGlass:b,side:{x:Kt(n,.86).w,y:Kt(n,.86).high-.18,z:.86},lamps:e.lamps,head:e.head,exhaust:e.exhaust,front:a,rear:o,width:Math.max(...n.map(y=>y.w))}};return Iu.set(i,I),I}var Nu=[{name:"boulevard",zenith:6269152,horizon:14280686,sunGlow:16769968,fog:14280686,fogNear:70,fogFar:315,sun:16769204,sunIntensity:3.3,sunPosition:[-34,62,38],hemiSky:13953279,hemiGround:9075298,hemi:1.25,rim:11066608,rimIntensity:.9,exposure:1.08,road:3819092,roadRough:.86,ground:9285770,curb:13617596,walk:13222580,walk2:12169892,verge:8367726,rail:13818070,lamp:4873580,buildings:[15193274,14279138,12176848,14862246,13220008,10993609,15721164,13874583],accents:[14708051,4165514,15775050,5533864,13000059,6988653],glass:6129571,trees:[5213791,6266211,4160853,7776357],trunk:7231041},{name:"coast",zenith:4172248,horizon:14085872,sunGlow:16773839,fog:14085872,fogNear:80,fogFar:320,sun:16773592,sunIntensity:3.5,sunPosition:[-26,70,30],hemiSky:13233407,hemiGround:5213333,hemi:1.3,rim:10217198,rimIntensity:.9,exposure:1.1,road:3622746,roadRough:.84,ground:14273958,curb:14212310,walk:12568516,walk2:11187378,verge:8828042,rail:15002600,lamp:5993088,water:2068398,deepWater:1270143,buildings:[15920610,15195339,14214884,16046530,13623528],accents:[3116963,14710863,15909198,3960476],glass:7317183,trees:[5218426,4164204,7319690],trunk:10123861,rock:9080710,rock2:11052179},{name:"storm",zenith:2502735,horizon:9016749,sunGlow:12174052,fog:9016749,fogNear:55,fogFar:300,sun:12766706,sunIntensity:2.1,sunPosition:[-30,55,30],hemiSky:11122396,hemiGround:3950162,hemi:1.55,rim:10467327,rimIntensity:1.15,exposure:1.12,road:2831170,roadRough:.42,ground:6254182,curb:11120821,walk:8226704,walk2:7042172,verge:5596764,rail:11977420,lamp:4608606,buildings:[9082536,7306383,10134704],accents:[15907152,14904661,8368345],glass:4281966,trees:[3099203,3692105,2506806,4284495],trunk:4865334,rock:7173248,rock2:8884379,snow:15331060}],J=new xt(1,1,1),Vt=new dn(1,1,1,10),Zp=new dn(1,1,1,6),Zn=new ii(1,1,7),Tn=new si(1,0),Du=new si(1,1),R1=new as(1,14),Ir=new Xn(1,10,7),C1=(i,e,t)=>new Ae(i).lerp(new Ae(e),t).getHex(),mt=(i,e)=>{let t=new Ae(i);return t.multiplyScalar(e),t.getHex()},I1=(i,e,t,n,s,r,a)=>i.add("s",R1,a,e,t,n,s,r,1,-Math.PI/2,0,0);function Ci(i,e,t,n,s,r="round",a=1){let o=s.trees[Math.floor(n()*s.trees.length)],c=(2.6+n()*1.6)*a;if(I1(i,e+.6,.035,t+.4,1.9*a,1.5*a,mt(s.ground,.72)),i.add("s",Zp,s.trunk,e,c*.4,t,.16*a,c*.8,.16*a),r==="pine"){for(let l=0;l<3;l++)i.add("s",Zn,mt(o,1-l*.06),e,c*.55+l*1.15*a,t,(1.7-l*.42)*a,2.1*a,(1.7-l*.42)*a);s.snow&&n()<.45&&i.add("s",Zn,s.snow,e,c*.55+3.05*a,t,.5*a,.7*a,.5*a);return}if(r==="palm"){for(let l=0;l<4;l++)i.add("s",Zp,mt(s.trunk,1-l*.04),e+l*.12,1+l*1.6,t,.2-l*.02,1.7,.2-l*.02,0,0,-.07);for(let l=0;l<7;l++){let h=l*Math.PI*2/7+n();i.add("s",Ir,l%2?o:mt(o,.9),e+.5+Math.cos(h)*1.25,6.7-Math.abs(Math.sin(h))*.2,t+Math.sin(h)*1.25,1.6,.12,.42,0,-h,Math.cos(h)*-.25)}i.add("s",Ir,9071164,e+.5,6.6,t,.35,.3,.35);return}i.add("s",Du,o,e,c+.9*a,t,1.55*a,1.35*a,1.5*a),i.add("s",Du,mt(o,1.12),e+.55*a,c+1.5*a,t-.3*a,1.05*a,.95*a,1*a),i.add("s",Du,mt(o,.88),e-.5*a,c+.55*a,t+.4*a,1*a,.85*a,.95*a)}function Jp(i,e,t,n,s,r,a,o,c,l,h,{band:u=!1,floor:f=3.1}={}){for(let d=n;d<s-1.2;d+=f){if(u){i.add("s",J,c,t-h*.03,d+1.1,(r+a)/2,.06,1.25,a-r-.6),i.add("s",J,l,t-h*.05,d+.38,(r+a)/2,.05,.12,a-r-.4);continue}let p=(a-r)/o;for(let x=0;x<o;x++){let g=r+p*(x+.5);i.add("s",J,c,t-h*.03,d+1.1,g,.06,1.35,p*.58)}}}function jp(i,e,t,n,s,r,a,o){for(let c=s;c<r-1.2;c+=3.1)for(let l=0;l<o;l++)i.add("s",J,a,e-t/2+t*(l+.5)/o,c+1.1,n+.03,t/o*.56,1.35,.06)}function Uu(i,e,t,n,s,r,a){let o=9+e()*6,c=n*(1+e()*2.5),l=c+n*o/2,h=r-s,u=(s+r)/2,f=t.buildings[Math.floor(e()*t.buildings.length)],d=t.accents[Math.floor(e()*t.accents.length)],p=a==="tower"?26+e()*22:a==="low"?7+e()*4:12+e()*12,x=a==="tower"?t.glass:mt(t.glass,.82),g=mt(f,.78);i.add("s",J,mt(f,.9),l,2,u,o,4,h),i.add("s",J,2900306,c-n*.02,1.55,u,.06,2.4,h-1.2);for(let m=s+1.6;m<r-1;m+=2.4)i.add("s",J,mt(f,.72),c-n*.05,1.55,m,.08,2.5,.12);if(i.add("s",J,d,c-n*.65,3.2,u,1.3,.12,h-.8,0,0,n*.18),i.add("s",J,mt(d,.75),c-n*1.28,3.05,u,.05,.32,h-.8),i.add("s",J,16183522,c-n*.06,3.85,u,.08,.55,Math.min(h-2,6)),i.add("s",J,mt(d,.9),c-n*.09,3.85,u,.04,.36,Math.min(h-2.6,5.2)),a==="tower"){i.add("s",J,x,l+n*1,4+p/2,u,o-2,p,h-1.5);for(let m=s+1;m<=r-1;m+=1.6)i.add("s",J,14674156,c+n*.97,4+p/2,m,.06,p,.1);for(let m=4;m<4+p;m+=3.3)i.add("s",J,13227740,c+n*.96,m,u,.08,.14,h-1.5);return i.add("s",J,12043468,l+n*1,4.4+p,u,o-3,.8,h-3),i.add("s",J,10135730,l+n*1.5,5.6+p,u,2.4,1.8,2.4),p+4}if(i.add("s",J,f,l,4+p/2,u,o,p,h),i.add("s",J,g,c-n*.04,4.15,u,.12,.3,h+.05),Jp(i,l,c,4.2,4+p,s+.8,r-.8,Math.max(2,Math.round(h/3)),x,g,n,{band:a==="band"}),jp(i,l,o-1.5,r,4.2,4+p,x,Math.max(2,Math.round(o/3))),a==="balcony")for(let m=7;m<4+p-1;m+=3.1)i.add("s",J,15330538,c-n*.55,m,u,1.1,.12,h-2.4);return i.add("s",J,g,l,4+p+.25,u,o+.2,.5,h+.2),i.add("s",J,mt(f,.68),l,4+p+.05,u,o-.8,.3,h-.8),e()<.6&&(i.add("s",J,11121848,l+n*(e()*2-1),4+p+.9,u-1,2,1.2,1.6),i.add("s",J,9411489,l-n*1.5,4+p+.7,u+2,1.2,.8,1.2)),e()<.35&&(i.add("s",Vt,9335128,l+n*2,4+p+1.6,u+1.5,.9,2.2,.9),i.add("s",Zn,7166023,l+n*2,4+p+3.1,u+1.5,1,.8,1)),e()<.3&&i.add("s",J,t.trees[0],l,4+p+.6,u,o-2,.5,h-2.5),p+4}function P1(i,e,t){let n=new Bt,s=oi(1e3+t*31+(e>0?7:0));if(n.add("s",J,mt(i.walk2,.96),e*22,-.04,0,44,.1,20.2),t===7){n.add("s",J,i.verge,e*16,.02,0,22,.06,18),n.add("s",Vt,14078148,e*14,.3,0,3,.6,3),n.add("s",Vt,7321814,e*14,.62,0,2.6,.05,2.6),n.add("s",Vt,15262938,e*14,1.3,0,.25,1.5,.25);for(let[h,u]of[[6,-6],[9,5],[20,-4],[23,6],[17,-8]])Ci(n,e*h,u,s,i,"round",1.15);for(let h of[-3,3])n.add("s",J,8018499,e*6.5,.45,h,.6,.12,2.2);return n.merge("s")}let r=["grid","band","balcony","tower","low","grid","band","balcony"],a=r[t%r.length];t%3===1?(Uu(n,s,i,e,-9.6,-.3,a),Uu(n,s,i,e,.3,9.6,r[(t+3)%8])):Uu(n,s,i,e,-9.4,9.4,a);let o=oi(77+t*13+(e>0?3:0)),c=18+o()*30,l=i.buildings[Math.floor(o()*i.buildings.length)];return n.add("s",J,mt(l,.92),e*(30+o()*6),c/2,-2+o()*4,10,c,14),n.merge("s")}function L1(i,e,t){let n=new Bt,s=oi(2e3+t*17+(e>0?5:0));if(t===0)return Qp();if(t===1){let a=e*(26+s()*16),o=s()*10-5;n.add("s",J,16052454,a,-3,o,2.2,.6,6),n.add("s",J,2775920,a,-2.7,o,2.25,.12,6.05),n.add("s",J,15918796,a,-2.4,o+.6,1.4,.6,2.2),n.add("s",Vt,13949662,a,1,o,.06,7,.06);let c=new tt;return c.setAttribute("position",new Le([0,0,0,0,6,0,0,0,3.6,0,0,0,0,0,3.6,0,6,0],3)),c.computeVertexNormals(),n.add("s",c,16644334,a,-2,o-1.5),c.dispose(),n.merge("s")}if(t===2){for(let[a,o,c]of[[12,-5,14833983],[18,6,4170605],[30,-2,15778378]])n.add("s",Vt,c,e*a,-2.9,o,.5,1.1,.5),n.add("s",Zn,c,e*a,-2,o,.4,.9,.4);return n.merge("s")}if(t===3||t===4){let a=e*(32+s()*14);return n.add("s",Tn,i.rock,a,-3.4,0,9,3.2,8),n.add("s",Tn,i.rock2,a+e*2,-2.2,2,5,2.2,4.5),n.add("s",Ir,i.ground,a,-1.6,0,6,.9,5.5),Ci(n,a-1,-1,s,i,"palm"),t===4&&Ci(n,a+2,2,s,i,"palm",.9),n.merge("s")}n.add("s",J,i.ground,e*24,-1.7,0,40,3.4,20.4),n.add("s",J,mt(i.ground,.85),e*4.6,-2.2,0,1.2,2.4,20.4);let r=t%3;for(let a=0;a<2;a++){let o=-5+a*10,c=6+s()*3,l=5+s()*7,h=e*(9+s()*4+a*7),u=i.buildings[(t+a)%i.buildings.length];n.add("s",J,u,h,l/2,o,c,l,6.5),n.add("s",J,i.accents[(t+a+r)%i.accents.length],h,l+.5,o,c+.6,1,7.1,0,0,0),jp(n,h,c-1,o+3.25,1,l,i.glass,2),Jp(n,h,h-e*c/2,1,l,o-2.6,o+2.6,2,i.glass,16777215,e)}return Ci(n,e*6,-8,s,i,"palm"),Ci(n,e*7,8,s,i,"palm",.95),n.merge("s")}function D1(i,e,t){let n=new Bt,s=oi(3e3+t*19+(e>0?11:0));if(n.add("s",J,i.ground,e*24,-.06,0,46,.1,20.4),n.add("s",Tn,mt(i.ground,.92),e*(18+s()*8),-.8,s()*8-4,7,2.6,6,0,s()*3,0),t%4===0){let a=e*(10+s()*6);n.add("s",Tn,i.rock,a,.6,-3,2.2,1.6,2.6,0,s()*3,0),n.add("s",Tn,i.rock2,a+e,.4,-1,1.4,1,1.5,0,s()*3,0)}let r=t%4===3?3:7+Math.floor(s()*5);for(let a=0;a<r;a++){let o=e*(7+s()*30),c=s()*18-9;Ci(n,o,c,s,i,"pine",.85+s()*.6)}if(t===5){let a=e*15;n.add("s",J,7166538,a,1.6,2,5,3.2,6),n.add("s",J,4012608,a,3.9,2,5.8,.3,6.8,0,0,e*.42),n.add("s",J,4012608,a+e*1.2,3.9,2,5.8,.3,6.8,0,0,-e*.42),n.add("s",J,15910250,a-e*2.52,1.6,1,.06,1,1)}if(t===6)for(let a=0;a<4;a++)n.add("s",Tn,a%2?i.rock:i.rock2,e*(12+a*2.5),2+a*1.2,-6+a*4,3.5,4+a,3.2,0,a,0);return n.merge("s")}function Qp(){let i=new tt;for(let e of["position","normal","color"])i.setAttribute(e,new Le([],3));return i}function U1(i,e,t){let n=new Bt,s=e;n.add("s",J,i.curb,s*5.53,.075,0,.26,.15,20.02),n.add("s",J,i.verge,s*6.5,.06,0,1.7,.1,20.02),n.add("s",J,i.walk,s*8.9,.1,0,3.1,.12,20.02);for(let a of[-7.5,-2.5,2.5,7.5])n.add("s",J,i.walk2,s*8.9,.163,a,3.05,.01,.08);n.add("s",J,mt(i.walk2,.9),s*10.5,.16,0,.15,.22,20.02);for(let a of[-5,5])n.add("s",J,10852482,s*6.5,.25,a,1.5,.38,2.6),n.add("s",J,mt(i.verge,.85),s*6.5,.45,a,1.3,.06,2.4);let r=oi(400+t);return Ci(n,s*6.5,-5,r,i,"round",.7),Ci(n,s*6.5,5,r,i,"round",.65),t%2===0?(n.add("s",Vt,i.lamp,s*6.3,3.4,0,.07,6.8,.07),n.add("s",J,i.lamp,s*5.75,6.75,0,1.2,.09,.1),n.add("s",J,16774102,s*5.25,6.66,0,.55,.1,.36)):(n.add("s",J,4874608,s*9.9,.65,-3,.5,1.1,.5),n.add("s",J,3108712,s*7.9,.5,4,.5,.6,1.8),n.add("s",J,9071439,s*7.9,.85,4,.5,.06,1.9)),t===3&&(n.add("s",J,14673640,s*9.7,1.3,-1,.06,2.4,3.6),n.add("s",J,6066096,s*9.65,1.3,-1,.04,2.2,3.4),n.add("s",J,i.lamp,s*9.7,2.55,-1,1.2,.08,3.8)),n.merge("s")}function N1(i,e,t){let n=new Bt,s=e;n.add("s",J,13226704,s*6.6,-.55,0,2.6,1.3,20.02),n.add("s",J,mt(13226704,.82),s*3.2,-1.05,0,4.4,.3,20.02),n.add("s",J,14870757,s*5.75,.42,0,.6,.84,20.02),n.add("s",J,i.walk,s*7,.1,0,1.9,.12,20.02),n.add("s",J,i.rail,s*7.95,1.05,0,.07,.07,20.02),n.add("s",J,i.rail,s*7.95,.62,0,.05,.05,20.02);for(let r=-9;r<=9;r+=3)n.add("s",J,i.rail,s*7.95,.6,r,.06,.95,.06);return n.add("s",J,2920358,s*5.75,.86,0,.62,.05,20.02),t===0&&(n.add("s",J,12240066,s*3.6,-6,0,2.2,10,2.6),n.add("s",J,mt(12240066,.85),s*3.6,-3,0,3.4,.6,3.6)),t===1&&(n.add("s",Vt,i.lamp,s*7.7,3.6,-4,.07,7.2,.07),n.add("s",J,i.lamp,s*7,7.15,-4,1.5,.09,.1),n.add("s",J,16774102,s*6.3,7.06,-4,.55,.1,.36)),n.merge("s")}function F1(i,e,t){let n=new Bt,s=e;n.add("s",J,i.curb,s*5.53,.075,0,.26,.15,20.02),n.add("s",J,i.walk,s*7.4,.1,0,3.5,.12,20.02),n.add("s",J,14209728,s*9.3,.35,0,.4,.6,20.02),n.add("s",J,i.ground,s*12.5,-1.2,0,6,2.6,20.02);for(let r of[-6,4])Ci(n,s*11,r,oi(500+t),i,"palm",.85);return t%2===0&&(n.add("s",Vt,i.lamp,s*6,3.4,2,.07,6.8,.07),n.add("s",J,i.lamp,s*5.45,6.75,2,1.2,.09,.1),n.add("s",J,16774102,s*4.95,6.66,2,.55,.1,.36)),n.merge("s")}function Cr(i,e,t,n=0){let s=new Bt,r=e,a=14276300,o=16774354;s.add("s",J,i.curb,r*5.6,.12,0,.4,.24,20.02),s.add("s",J,a,r*6.25,3.2,0,.5,6.4,20.02),s.add("s",J,2846598,r*5.99,1.1,0,.04,.5,20.02),s.add("s",J,mt(a,.9),r*5.2,6.75,0,2.4,.5,20.02,0,0,r*.55),s.add("s",J,mt(a,.78),r*2.3,7.45,0,4.8,.5,20.02);for(let c of[-7.5,-2.5,2.5,7.5])s.add("s",J,o,r*4.6,7.08,c,.3,.08,3.4);s.add("s",J,i.rock,r*12,4.5,0,11,9,20.02),s.add("s",J,mt(i.verge??i.ground,.95),r*6,8.35,0,12.2,1.4,20.02);for(let c=0;c<3;c++)s.add("s",Tn,c%2?i.rock2:i.rock,r*(12+c*3),9+c*1.5,-7+c*7,4.5,3+c,5.5,0,t+c,0);if(s.add("s",Tn,i.verge??i.ground,r*8,9.6,3,5,1.6,6),n){let c=n*10;s.add("s",J,13946818,r*2.6,8.9,c,5.6,2.4,1),s.add("s",J,12959665,r*12,6,c+n*.2,12,12,1.2),s.add("s",J,15909198,r*2.6,7.85,c+n*.52,5.2,.28,.06),s.add("s",J,2372671,r*2.6,7.85,c+n*.55,1.2,.12,.04);for(let l=0;l<3;l++)s.add("s",Tn,i.rock,r*(9+l*4),12+l,c-n*2,5,4,4,0,l,0)}return s.merge("s")}function Kp(i,e,t,n){let s=new Bt,r=e,a=oi(600+t+(r>0?50:0));s.add("s",J,mt(i.road,1.3),r*6.4,.03,0,2,.06,20.02),s.add("s",J,i.rail,r*7.45,.62,0,.06,.3,20.02),s.add("s",J,mt(i.rail,.7),r*7.45,.62,0,.04,.08,20.04);for(let o=-8;o<=8;o+=4)s.add("s",J,7042689,r*7.55,.35,o,.1,.7,.1),s.add("s",J,12575743,r*7.42,.66,o,.02,.08,.18);for(let o of[-5,5])s.add("s",J,15331058,r*6.9,.55,o,.12,1.1,.12),s.add("s",J,15771200,r*6.9,.95,o,.13,.18,.13);if(n){for(let o=0;o<4;o++){let c=-7.5+o*5,l=7+a()*6;s.add("s",Tn,o%2?i.rock:i.rock2,r*(10.8+a()),l*.45,c,3.2+a(),l,3.4,a(),a()*2,r*.15)}s.add("s",J,mt(i.rock,.9),r*13,5,0,4,10,20.02),i.snow&&s.add("s",J,i.snow,r*13.6,10.1,0,3.2,.3,20.02)}else s.add("s",J,mt(i.ground,.85),r*11,-1.6,0,6,3,20.02,0,0,-r*.35);return s.merge("s")}var bs=8;function em(i){let e=Nu[i],t={look:e,roadside:{},scenery:{"-1":[],1:[]}},n=(s,r,...a)=>Array.from({length:r},(o,c)=>({"-1":s(e,-1,c,...a),1:s(e,1,c,...a)}));if(i===0){t.roadside.street=n(U1,4);for(let s of[-1,1])for(let r=0;r<bs;r++)t.scenery[s].push(P1(e,s,r))}if(i===1){t.roadside.bridge=n(N1,3),t.roadside.shore=n(F1,2),t.roadside.tunnel=[{"-1":Cr(e,-1,0),1:Cr(e,1,0)}],t.roadside.portalIn=[{"-1":Cr(e,-1,1,1),1:Cr(e,1,1,1)}],t.roadside.portalOut=[{"-1":Cr(e,-1,2,-1),1:Cr(e,1,2,-1)}];for(let s of[-1,1])for(let r=0;r<bs;r++)t.scenery[s].push(L1(e,s,r))}if(i===2){t.roadside.cliff=n(Kp,3,!0),t.roadside.drop=n(Kp,3,!1);for(let s of[-1,1])for(let r=0;r<bs;r++)t.scenery[s].push(D1(e,s,r))}return t.empty=Qp(),t.dispose=()=>{for(let s of Object.values(t.roadside))for(let r of s)for(let a of Object.values(r))a.dispose();for(let s of["-1","1"])t.scenery[s].forEach(r=>r.dispose());t.empty.dispose()},t}function tm(i,e,t={}){let n=e*20+10,s=h=>Xa(e,h,i),r=(t.tunnels||[]).find(h=>n>h.start&&n<h.end),a=(t.open||[]).some(h=>n>h.start&&n<h.end);if(i===0){let h=Math.floor(s(1)*4);return{roadside:{"-1":["street",h],1:["street",(h+2)%4]},scenery:{"-1":Math.floor(s(2)*bs),1:Math.floor(s(3)*bs)}}}if(i===1){if(r){let g=n-20<r.start,m=n+20>r.end,b=g?"portalIn":m?"portalOut":"tunnel";return{roadside:{"-1":[b,0],1:[b,0]},scenery:{"-1":-1,1:-1},tunnel:!0}}let h=Math.floor(n/240),u=!a&&Xa(h,7,i)<.38,f=Xa(h,8,i)<.5?-1:1,d=e%2===0?0:e%4===1?1:2,p=g=>u&&g===f?["shore",e%2]:["bridge",d],x=g=>u&&g===f?5+Math.floor(s(4+g)*3):Math.floor(s(5+g)*5);return{roadside:{"-1":p(-1),1:p(1)},scenery:{"-1":x(-1),1:x(1)},land:u?f:0}}let o=Math.floor(n/320),c=a?0:Xa(o,9,i)<.5?-1:1,l=Math.floor(s(1)*3);return{roadside:{"-1":[c===-1?"cliff":"drop",l],1:[c===1?"cliff":"drop",(l+1)%3]},scenery:{"-1":Math.floor(s(2)*bs),1:Math.floor(s(3)*bs)}}}function Fu(i,e,t){if(i!==1)return[];let n=[...t].sort((a,o)=>a.start-o.start).reduce((a,o)=>{let c=a.at(-1);return c&&o.start<=c.end?c.end=Math.max(c.end,o.end):a.push({...o}),a},[]),s=[],r=240;for(let a of[...n,{start:e-320,end:1/0}])a.start-r>=220&&s.push({start:r,end:a.start}),r=Math.max(r,a.end);return s.filter((a,o)=>o%2===1).map(a=>{let o=Math.round((a.start+a.end)/2/20)*20;return{start:o-80,end:o+60}})}function nm(i){let e=new Xn(560,40,20),t=e.attributes.position,n=new Float32Array(t.count*3),s=new U(...i.sunPosition).normalize().multiply(new U(1,.6,-1)).normalize(),r=new Ae(i.zenith),a=new Ae(i.horizon),o=new Ae(i.sunGlow),c=new Ae,l=new U;for(let u=0;u<t.count;u++){l.fromBufferAttribute(t,u).normalize();let f=Math.max(0,l.y);c.copy(a).lerp(r,Math.pow(f,.55));let d=Math.max(0,l.dot(s));c.lerp(o,Math.pow(d,8)*.55+Math.pow(d,64)*.4),n.set([c.r,c.g,c.b],u*3)}e.setAttribute("color",new kt(n,3));let h=new ve(e,new st({vertexColors:!0,side:Wt,fog:!1,depthWrite:!1}));return h.renderOrder=-10,h.frustumCulled=!1,h}function im(i,e){let t=new Bt,n=oi(90+i),s=e.horizon,r=(o,c)=>C1(o,s,c);if(i===0){for(let o=0;o<34;o++){let c=(o-17)*24+n()*10,l=22+n()*70,h=12+n()*16;t.add("s",J,r(9348279,.55),c,l/2-4,-470-n()*20,h,l,10)}for(let o=0;o<26;o++){let c=(o-13)*30+n()*12,l=14+n()*40,h=14+n()*14;t.add("s",J,r(10334912,.38),c,l/2-4,-420-n()*10,h,l,10)}t.add("s",Vt,r(8361384,.4),-120,40,-430,3,90,3),t.add("s",Ir,r(9348279,.4),-120,72,-430,8,6,8)}else if(i===1){for(let o=0;o<9;o++){let c=(o-4)*110+n()*40,l=80+n()*90,h=16+n()*30;t.add("s",Tn,r(6262664,.5),c,-6,-470,l,h,30)}t.add("s",J,r(4022130,.45),180,-1.5,-440,40,4,8),t.add("s",J,r(14243647,.45),172,1.6,-440,6,3,8)}else for(let[o,c,l,h,u,f]of[[520,6122118,.62,12,90,110],[470,4871794,.42,14,60,80],[430,3950174,.25,16,35,55]])for(let d=0;d<h;d++){let p=(d-h/2)*(900/h)+n()*40,x=u+n()*f,g=90+n()*80;t.add("s",Zn,r(c,l),p,x/2-8,-o-n()*20,g,x,30),l>.4&&t.add("s",Zn,r(15199733,l*.8),p,x-8-x*.12,-o-n()*20+2,g*.25,x*.25,8)}let a=new ve(t.merge("s"),new st({vertexColors:!0,fog:!1}));return a.renderOrder=-5,a}function sm(i,e){let t=[["wheel","clock","stadium","twin"],["lighthouse","towers","ship","lighthouse"],["turbines","observatory","mast","turbines"]][i],n=[];for(let s=0,r=520;r<e-200;s++,r+=1150)n.push({kind:t[s%t.length],at:r,side:s%2?1:-1});return n}function rm(i,e,t){let n=new Bt,s=oi(e.length*7+i);if(e==="wheel"){n.add("s",J,14278626,0,0,0,30,1,12);for(let r of[-2,2])n.add("s",J,13620954,-6,18,r,.8,36,.8,0,0,-.32),n.add("s",J,13620954,6,18,r,.8,36,.8,0,0,.32);return n.add("s",Vt,9279907,0,34,0,1.2,5,1.2,Math.PI/2,0,0),{static:n.merge("s"),offset:62}}if(e==="clock"){n.add("s",J,15260095,0,18,0,7,36,7),n.add("s",J,14140838,0,37,0,8,2,8),n.add("s",Zn,7176076,0,43,0,6,9,6);for(let[r,a,o]of[[0,3.55,0],[3.55,0,Math.PI/2]])n.add("s",Vt,16315106,r,30,a,2.4,.2,2.4,Math.PI/2,o,0),n.add("s",J,2898245,r,30.6,a+(o?0:.12),.18,1.6,.05,0,o,0);return{static:n.merge("s"),offset:52}}if(e==="stadium"){n.add("s",new dn(32,28,16,24,1,!0),14212576,0,8,0),n.add("s",new Ti(31,1.2,6,24),15226698,0,16,0,1,1,1,Math.PI/2,0,0);for(let r=0;r<8;r++){let a=r/8*Math.PI*2;n.add("s",J,12371660,Math.cos(a)*30,22,Math.sin(a)*30,.8,12,.8)}return{static:n.merge("s"),offset:78}}if(e==="twin"){for(let r of[-7,7])n.add("s",J,t.glass,r,32,0,10,64,10),n.add("s",J,14674156,r,65,0,8,3,8),n.add("s",Vt,13621726,r,72,0,.3,12,.3);return n.add("s",J,13621726,0,42,0,6,2,3),{static:n.merge("s"),offset:70}}if(e==="lighthouse"){n.add("s",Tn,t.rock,0,-3,0,14,6,12),n.add("s",Vt,16052714,0,9,0,2.6,22,2.6);for(let r of[4,12])n.add("s",Vt,14239547,0,r,0,2.62,3,2.62);return n.add("s",Vt,2964036,0,21,0,3.2,.5,3.2),n.add("s",Vt,16773569,0,22.6,0,1.8,2.6,1.8),n.add("s",Zn,14239547,0,25,0,2.4,2.4,2.4),{static:n.merge("s"),offset:58,beacon:[0,22.6,0]}}if(e==="towers"){for(let r of[-1,1])n.add("s",J,15002086,r*11.2,15,0,1.6,30,2.2),n.add("s",J,15002086,r*11.2,-6,0,2.6,12,3.2);n.add("s",J,14015961,0,28,0,24,1.6,2.2),n.add("s",J,2920358,0,26.8,0,22,.5,2.3);for(let r of[-1,1])for(let a of[-1,1])for(let o=0;o<4;o++){let c=Math.hypot(22-o*2,18+o*6);n.add("s",J,13624292,r*11,28-(22-o*2)/2,a*(18+o*6)/2,.12,c,.12,a*Math.atan2(18+o*6,22-o*2),0,0)}return{static:n.merge("s"),offset:0,overRoad:!0}}if(e==="ship"){n.add("s",J,3099228,0,-2.4,0,9,3.4,44),n.add("s",J,15001834,0,1.6,16,8,5,8);for(let r=0;r<5;r++)n.add("s",J,t.accents[r%t.accents.length],0,.6,-14+r*6,8,3,5.5);return{static:n.merge("s"),offset:95}}if(e==="turbines"){for(let[r,a,o]of[[0,0,40],[30,-40,46],[-26,-70,38]])n.add("s",Tn,t.rock,r,0,a,16,8,14),n.add("s",Vt,15265264,r,o/2,a,.9,o,.9),n.add("s",J,15265264,r,o,a+1.2,1.8,1.8,3.2);return{static:n.merge("s"),offset:92,rotors:[[0,40,-1.6],[30,46,-41.6],[-26,38,-71.6]]}}if(e==="observatory")return n.add("s",Zn,t.rock,0,14,0,40,40,36),n.add("s",Zn,t.snow,0,30,0,13,10,12),n.add("s",Vt,14673386,0,36,0,4,4,4),n.add("s",Ir,15856886,0,38.5,0,4,3.6,4),n.add("s",J,4608606,0,39,1,1.2,4,6,0,0,.5),{static:n.merge("s"),offset:120};n.add("s",Zn,t.rock,0,10,0,30,30,26),n.add("s",Vt,12042440,0,40,0,.6,34,.6);for(let r=26;r<56;r+=6)n.add("s",J,12042440,0,r,0,3,.2,.2);return{static:n.merge("s"),offset:105,beacon:[0,57.5,0]}}function am(){let i=new Bt,e=new xt(.9,16,.3).translate(0,8.4,0);for(let t=0;t<3;t++)i.add("s",e,15922679,0,0,0,1,1,1,0,0,t*Math.PI*2/3);return i.add("s",Ir,15265264,0,0,.3,.9,.9,.9),e.dispose(),i.merge("s")}var yc=class{constructor(e,t){this.scene=e,this.car=t,this.level=0,this.uses=0,this.intensity=0,this.burstAge=2,this.matrix=new bt;let n=document.createElement("canvas");n.width=n.height=128;let s=n.getContext("2d"),r=s.createRadialGradient(64,64,1,64,64,64);r.addColorStop(0,"#ffffff"),r.addColorStop(.15,"#c8f7ffb0"),r.addColorStop(.48,"#57bfff35"),r.addColorStop(1,"#1a6cff00"),s.fillStyle=r,s.fillRect(0,0,128,128),this.texture=new wi(n),this.texture.colorSpace=zt,this.exhaust=new Ge,t.add(this.exhaust),this.jets=[],this.glows=[];for(let o of[-1,1]){let c=new ve(new ii(.22,2.8,10),new st({color:5819391,transparent:!0,opacity:.9,blending:wn,depthWrite:!1}));c.rotation.x=Math.PI/2,c.position.set(o*.69,.38,3.35),this.exhaust.add(c),this.jets.push(c);let l=new ve(new ii(.09,1.8,10),new st({color:15072511,transparent:!0,opacity:.95,blending:wn,depthWrite:!1}));l.rotation.x=Math.PI/2,l.position.set(o*.69,.38,3),this.exhaust.add(l);let h=new Mi(new ni({map:this.texture,color:7525887,transparent:!0,opacity:.75,blending:wn,depthWrite:!1}));h.position.set(o*.69,.42,2.6),h.scale.set(1.65,1.65,1),this.exhaust.add(h),this.glows.push(h)}this.exhaust.visible=!1,this.wake=new Si(new xt(.022,.022,1),new st({color:10414847,transparent:!0,opacity:.7,blending:wn,depthWrite:!1}),48),this.wake.frustumCulled=!1,this.wake.visible=!1,this.wake.instanceMatrix.setUsage(ds),e.add(this.wake),this.rings=[];let a=new ls(1.8,1.85,48);for(let o=0;o<3;o++){let c=new ve(a,new st({color:8317183,transparent:!0,opacity:0,side:Jt,blending:wn,depthWrite:!1}));c.visible=!1,e.add(c),this.rings.push(c)}this.aura=new ve(new Mt(5.4,8),new st({map:this.texture,color:5818879,transparent:!0,opacity:0,blending:wn,depthWrite:!1})),this.aura.rotation.x=-Math.PI/2,this.aura.visible=!1,e.add(this.aura)}update(e,t,n,s){this.state!==t&&(this.state=t,this.uses=t?.nitroUses||0,this.burstAge=2,this.intensity=0,this.wasActive=!1,this.previousLevel=0);let r=!!t?.nitroActive&&!s,a=Math.max(1,t?.nitroLevel||1),o=n.reduced,c=n.graphics==="battery";r&&(!this.wasActive||a!==this.previousLevel)&&(this.burstAge=0),this.wasActive=r,this.previousLevel=a,this.uses=t?.nitroUses||0,s||(this.burstAge+=e,this.intensity=Tt.damp(this.intensity,r?a/3:0,r?16:8,e)),this.level=r?a:0;let l=a===3?16765315:a===2?11972863:7004415;this.exhaust.visible=r;let h=o?1:1+Math.sin((t?.elapsed||0)*39)*.045;this.exhaust.scale.set(1+(a-1)*.12,1,1+(a-1)*.18),this.jets.forEach(d=>{d.material.color.setHex(l),d.scale.y=h}),this.glows.forEach(d=>d.material.color.setHex(l));let u=this.car.position.x,f=this.car.position.z;if(this.aura.visible=r,this.aura.position.set(u,.065,f+1),this.aura.rotation.z=-this.car.rotation.y,this.aura.material.color.setHex(l),this.aura.material.opacity=r?.16+a*.07:0,this.wake.visible=r&&!o,this.wake.count=c?12:48,this.wake.material.color.setHex(l),this.wake.visible){let d=(t.roadTravel||t.distance)*.08;for(let p=0;p<this.wake.count;p++){let x=((p*.618033+d)%1+1)%1,g=p%2?1:-1;this.matrix.position.set(u+g*(1.15+p%7*.2),.2+p%5*.14,f+2+x*12),this.matrix.scale.set(1,1,(.6+a*.5)*(1-x*.45)),this.matrix.rotation.set(0,0,g*.04),this.matrix.updateMatrix(),this.wake.setMatrixAt(p,this.matrix.matrix)}this.wake.instanceMatrix.needsUpdate=!0}this.rings.forEach((d,p)=>{let x=this.burstAge-p*.075,g=x/.5;d.visible=r&&!o&&!c&&g>=0&&g<1,d.visible&&(d.position.set(u,.8,f+2+g*8),d.scale.setScalar(.65+g*1.3),d.material.color.setHex(l),d.material.opacity=(1-g)*.32)})}};var O1=13.2,vc=[3775609,14792518,12471902,5014984],om=[15317401,12155991,8410431,13802100],k1=new xt(1,1,1),_c=new si(1,1),B1=new dn(.24,.29,.67,6),lm=new xt(1,1,1),li=new bt,Ms=new Ae;function Ss(i,e){let t=new Si(i,new Ct({roughness:.85}),e);return t.instanceMatrix.setUsage(ds),t.frustumCulled=!1,t}function Es(i,e,t,n,s,r,a,o,c=0,l=0,h=0){li.position.set(t,n,s),li.scale.set(r,a,o),li.rotation.set(c,l,h),li.updateMatrix(),i.setMatrixAt(e,li.matrix)}function ws(i,e,t){let n=e.map(([a,o,c,l,h,u])=>{let f=k1.clone();return li.position.set(a,o,c),li.scale.set(l,h,u),li.rotation.set(0,0,0),li.updateMatrix(),f.applyMatrix4(li.matrix)}),s=fc(n);n.forEach(a=>a.dispose());let r=new ve(s,new Ct({color:t,roughness:.76}));return r.receiveShadow=!0,i.add(r),r}var bc=class{constructor(e){this.root=new Ge,e.add(this.root),this.stands=[],this.elapsed=0,this.proximity=0,this.state=void 0;for(let t=0;t<6;t++){let n=new Ge,s=new Ge,r=new Ge;n.add(s,r),this.root.add(n);let a=ws(s,[[1.2,-.22,0,6,.4,15.8],[1.7,.05,0,2.5,.5,14.8],[3.4,.38,0,1.4,1.15,14.8]],11386556);ws(s,[[1.4,-1.5,-5,.45,2.6,.45],[1.4,-1.5,5,.45,2.6,.45]],5861760);let o=[[-1.8,.78,0,.11,.13,15.6],[-1.8,.3,0,.11,.07,15.6]];for(let b=-7.5;b<=7.5;b+=3)o.push([-1.8,.36,b,.12,.9,.12]);ws(s,o,13490134);let c=[];for(let b of[0,1])c.push([b*1.85+.7,.35+b*.56,0,.7,.12,13.5]);ws(s,c,2309714);for(let b=0;b<4;b++)ws(s,[[-1.9,.42,(b-1.5)*3.6,.07,.65,3.35]],vc[b]);let l=ws(s,[[-2.8,-.27,0,2,.3,15.8]],9546157);l.userData.bridgeDeck=!0;let h=Ss(B1,8),u=Ss(_c,8),f=Ss(_c,8),d=Ss(lm,16),p=Ss(_c,16),x=Ss(lm,16),g=Ss(_c,16);for(let b of[h,u,f,d,p,x,g])r.add(b);for(let b=0;b<8;b++){h.setColorAt(b,Ms.setHex(vc[(b+t)%4])),u.setColorAt(b,Ms.setHex(om[(b*3+t)%4])),f.setColorAt(b,Ms.setHex([4141099,5849145,3156786,10648136][b%4]));for(let S of[0,1])d.setColorAt(b*2+S,Ms.setHex(vc[(b+t)%4])),p.setColorAt(b*2+S,Ms.setHex(om[(b*3+t)%4])),x.setColorAt(b*2+S,Ms.setHex(2504263)),g.setColorAt(b*2+S,Ms.setHex(2371645))}let m=[];for(let b of[-7.2,7.2]){ws(s,[[4.3,2.5,b,.09,5,.09]],9611445);let S=new ve(new Mt(1.6,.8,5,2),new Ct({color:vc[(t+(b>0?1:0))%4],side:Jt,roughness:.85}));S.position.set(3.55,4.25,b),S.userData.flat=S.geometry.attributes.position.array.slice(),s.add(S),m.push(S)}this.stands.push({group:n,platform:s,base:a,bodies:h,heads:u,hair:f,arms:d,hands:p,legs:x,eyes:g,flags:m,slot:t,station:-1})}}prepare(e,t){if(this.state===e&&this.arena===t)return;this.state=e,this.arena=t;let n=window.RallyCore,s=[];if(e&&!e.reviewLap){s.push(25);for(let r=1;r<e.tasks.length;r++){let a=n.taskZone(e.tasks[r-1]).end+100,o=n.taskZone(e.tasks[r]).start-140;o-a>25&&s.push((a+o)/2)}s.push(e.arena.length-15)}else e||s.push(65,230,470,710,950);this.stations=s.flatMap((r,a)=>[-1,1].map(o=>({at:r,side:o,id:a*2+(o>0?1:0)})));for(let r of this.stands)r.station=-1,r.lastCheer=0,r.group.visible=!1,r.base.material.color.setHex(t===2?7176597:t===1?11652809:13154211)}update(e,t,n,s,r,a,o,c){this.prepare(t,n),c||(this.elapsed+=e);let l=this.stations.findIndex(f=>f.at>=s-100),h=l<0?[]:this.stations.slice(l,l+6).map(f=>f.id),u=new Set(this.stands.filter(f=>h.includes(f.station)).map(f=>f.station));this.proximity=0;for(let f of this.stands){if(!h.includes(f.station)){let v=h.find(I=>!u.has(I));f.station=v??-1,v!=null&&u.add(v)}let d=this.stations[f.station];if(!d){f.group.visible=!1;continue}let p=d.at-s,x=(this.blocked||[]).some(v=>d.at>v.start-40&&d.at<v.end+40);if(f.group.visible=!x&&p>-85&&p<300,!f.group.visible)continue;let g=d.side;f.group.position.set(a(d.at)-r+g*O1,0,4-p),f.group.rotation.y=-Math.atan((a(d.at+1)-a(d.at-1))/2),f.platform.scale.x=g;let m=Math.min(Math.abs(p),...(t?.rivals||[]).map(v=>Math.abs(v.at-d.at))),b=c?f.lastCheer||0:t&&t.status!=="countdown"?Tt.smoothstep(80-m,0,65):0;f.lastCheer=b,this.proximity=Math.max(this.proximity,Tt.clamp(1-Math.abs(p)/90,0,1));let S=o.graphics==="battery"?4:8;for(let v of[f.bodies,f.heads,f.hair])v.count=S;for(let v of[f.arms,f.hands,f.legs,f.eyes])v.count=S*2;for(let v=0;v<S;v++){let I=v>>2,y=g*(I*1.85+.7),w=(v%4-1.5)*3.3,A=.9+v%3*.07,M=.43+I*.56,_=this.elapsed*4.2+v*1.8+f.slot*.8,P=o.reduced?0:b*Math.max(0,Math.sin(_))*.07,D=M+.87*A+P,F=M+1.48*A+P;Es(f.bodies,v,y,D,w,A,A,A),Es(f.heads,v,y,F,w,.23*A,.27*A,.23*A),Es(f.hair,v,y+g*.025,F+.15*A,w,.235*A,.17*A,.24*A);for(let k=0;k<2;k++){let G=k?1:-1,V=o.reduced?0:Math.sin(_+(k?1.1:0))*.24,ee=o.reduced?0:b*(v%3===0?1.85:1.35)+V*b,W=G*(.15+ee),ce=w+G*.26*A,$=.55*A,Z=ce+G*Math.sin(ee)*$*.5;Es(f.arms,v*2+k,y,D-.04+Math.cos(ee)*(-$*.5),Z,.15*A,$,.16*A,W,0,0),Es(f.hands,v*2+k,y,D-.04-Math.cos(ee)*$,ce+G*Math.sin(ee)*$,.105*A,.105*A,.105*A),Es(f.legs,v*2+k,y,M+.29*A+P,w+G*.13*A,.17*A,.59*A,.2*A),Es(f.eyes,v*2+k,y-g*.222*A,F+.025*A,w+G*.08*A,.018,.025,.024)}}for(let v of[f.bodies,f.heads,f.hair,f.arms,f.hands,f.legs,f.eyes])v.instanceMatrix.needsUpdate=!0;for(let v of f.flags)if(!c){let I=v.geometry.attributes.position,y=v.userData.flat;for(let w=0;w<y.length;w+=3)I.array[w+2]=o.reduced?0:Math.sin(this.elapsed*3+y[w]*3+f.slot)*.09*(y[w]+.8)/1.6;I.needsUpdate=!0,v.geometry.computeVertexNormals()}}}};var Mc=(i,e,t)=>Math.max(e,Math.min(t,i)),Sc=class{constructor(e,t){this.car=t,this.state=null,this.stage=-1,this.lastImpact=null,this.spawnClock=0,this.deformable=t.children.filter(y=>y.isMesh&&y.userData.paint).map(y=>({mesh:y,base:y.geometry.attributes.position.array.slice()})),this.details=new Ge,t.add(this.details);let n=t.userData.anchors||{windshield:{bottom:[.92,-.945],top:[1.46,-.365]},rearGlass:{bottom:[.92,1.18],top:[1.46,.63]},hood:{y:.965,back:-.57,front:-2.04,frontY:.75,w:.86},side:{x:1.076,y:.78,z:.86}},s=new Ei({color:15661299,transparent:!0,opacity:.9,depthWrite:!1}),r=[];for(let y of[n.windshield,n.rearGlass])for(let[w,A,M]of[[-.24,.52,.27],[.36,.3,.15]]){let _=y===n.rearGlass,P=(F,k)=>[F,y.bottom[0]+k*(y.top[0]-y.bottom[0])+.012,y.bottom[1]+k*(y.top[1]-y.bottom[1])+(_?.014:-.014)],D=[[-1,-.22],[-.64,.85],[.18,1],[1,.37],[.83,-.65],[-.23,-1]];for(let F=0;F<D.length;F++){let[k,G]=D[F],V=P(w+k*M*.48,Mc(A+G*M*.65,.05,.92)),ee=P(w+k*M,Mc(A+G*M*1.15,.05,.92));r.push(...P(w,A),...V,...V,...ee),F%2===0&&r.push(...V,...P(w+k*M*.9+.06,Mc(A+G*M*.35,.05,.92)))}}this.cracks=new Hi(new tt().setAttribute("position",new Le(r,3)),s),this.cracks.renderOrder=2,this.details.add(this.cracks);let a=t.children.find(y=>y.userData.paint)?.material||new Ct({color:14268004}),o=n.hood,c=o.back-o.front,l=o.frontY-o.y;this.hood=new Ge,this.hood.position.set(0,o.y+.012,o.back),this.details.add(this.hood);let h=new tt;h.setAttribute("position",new Le([-o.w,0,0,o.w,0,0,o.w*1.04,l*.45+.02,-c*.62,o.w*.76,l+.06,-c,-o.w*.78,l+.03,-c,-o.w*1.05,l*.45+.01,-c*.62],3)),h.setIndex([0,1,2,0,2,5,5,2,3,5,3,4]),h.computeVertexNormals(),this.hoodPanel=new ve(h,a),this.hoodPanel.userData.paint=!0,this.hoodPanel.castShadow=!0,this.hood.add(this.hoodPanel);let u=new ve(h,new Ct({color:2306363,roughness:.86,side:Wt}));this.hood.add(u),this.engineBay=new ve(new xt(o.w*1.7,.025,c*.75),new Ct({color:1582380,roughness:.9})),this.engineBay.position.set(0,o.y+l*.5,o.back-c*.5),this.details.add(this.engineBay),this.loosePanel=new Ge,this.loosePanel.position.set(n.side.x+.005,n.side.y,n.side.z),this.details.add(this.loosePanel);let f=new ve(new xt(.035,.28,.64),a);f.position.set(.04,-.1,.2),f.userData.paint=!0,this.loosePanel.add(f);let d=n.side.x+.022,p=n.side.y,x=new tt().setAttribute("position",new Le([d,p-.09,-.25,d,p-.04,.7,d,p-.17,.02,d,p-.11,.9,d,p+.02,.21,d,p+.05,.73],3));this.scrapes=new Hi(x,new Ei({color:12240584})),this.details.add(this.scrapes),this.smokeAnchor=[.35,o.frontY+.06,o.front+.25],this.particles=new Ge,e.add(this.particles);let g=document.createElement("canvas");g.width=g.height=64;let m=g.getContext("2d"),b=m.createRadialGradient(32,32,0,32,32,32);b.addColorStop(0,"#d3dcdbbb"),b.addColorStop(.45,"#a4b4b76b"),b.addColorStop(1,"#73888d00"),m.fillStyle=b,m.fillRect(0,0,64,64);let S=new wi(g);S.colorSpace=zt,this.smoke=Array.from({length:12},(y,w)=>{let A=new Mi(new ni({map:S,transparent:!0,depthWrite:!1,opacity:0}));return A.visible=!1,this.particles.add(A),{mesh:A,life:2,seed:w}});let v=new xt(.025,.025,.14),I=new st({color:16766357});this.sparks=Array.from({length:10},(y,w)=>{let A=new ve(v,I);return A.visible=!1,this.particles.add(A),{mesh:A,life:1,seed:w}}),this.protection=new ve(new ls(1.65,1.71,40),new st({color:12052191,transparent:!0,opacity:.18,depthWrite:!1})),this.protection.rotation.x=-Math.PI/2,this.protection.scale.y=1.55,this.protection.visible=!1,e.add(this.protection),this.origin=new U,this.setStage(0)}setStage(e){if(this.stage!==e){this.stage=e;for(let{mesh:t,base:n}of this.deformable){let s=t.geometry.attributes.position;for(let r=0;r<n.length;r+=3){let a=Mc((-n[r+2]-1.25)/.9,0,1),o=e*a;s.array[r]=n[r]*(1-o*.035),s.array[r+1]=n[r+1]-o*(.022+.025*Math.max(0,n[r])),s.array[r+2]=n[r+2]+o*(.065+.025*Math.sin(n[r]*5))}s.needsUpdate=!0,t.geometry.computeVertexNormals(),t.geometry.computeBoundingSphere()}this.cracks.visible=this.scrapes.visible=e>0,this.hood.visible=this.engineBay.visible=this.loosePanel.visible=e>=2}}reset(e){this.state=e,this.lastImpact=e?.lastImpact||null,this.spawnClock=0,this.setStage(e?.damage||0);for(let t of[...this.smoke,...this.sparks])t.mesh.visible=!1,t.life=2;this.hood.rotation.set(0,0,0),this.loosePanel.rotation.set(0,0,0),this.protection.visible=!1}update(e,t,n={},s=!1){this.state!==t&&this.reset(t);let r=t?.damage||0;this.setStage(r),this.car.updateWorldMatrix(!0,!1),this.origin.set(...this.smokeAnchor).applyMatrix4(this.car.matrixWorld);let a=!!n.reduced,o=n.graphics==="battery";if((t?.lastImpact||null)!==this.lastImpact&&(this.lastImpact=t.lastImpact,!a))for(let u of this.sparks){let f=u.seed*2.4;u.life=0,u.mesh.position.copy(this.origin),u.vx=Math.sin(f)*3.3,u.vy=1.3+u.seed%3*.5,u.vz=2+u.seed%4,u.mesh.visible=!0}if(r>=2){let u=t?.elapsed||0;this.hood.rotation.x=.17+(r===3?.06:0)+(a?0:Math.sin(u*17)*.012),this.hood.rotation.z=-.025,this.loosePanel.rotation.z=-.14+(a?0:Math.sin(u*15)*.035)}this.protection.visible=!!t&&t.invulnerable>0&&r<3&&!["paused","finished","failed","countdown"].includes(t.status),this.protection.position.set(this.car.position.x,.065,this.car.position.z);let c=t?.lastImpact?t.elapsed-t.lastImpact.at:1/0;if(c<.45&&!a&&!s){let u=Math.sin(c*42)*(1-c/.45);this.car.rotation.z+=u*.065,this.car.position.y+=Math.abs(u)*.045}if(a)for(let u of[...this.smoke,...this.sparks])u.mesh.visible=!1;if(s)return;let l=(t?.arena.speed||0)*(t?.speedFactor||0)*(t?.worldTimeScale??1),h=e*(t?.worldTimeScale??1);if(r>=2&&!a){this.spawnClock+=h;let u=o?.25:r===3?.065:.13;if(this.spawnClock>=u){this.spawnClock%=u;let f=this.smoke.find(d=>!d.mesh.visible);f&&(f.life=0,f.mesh.position.copy(this.origin),f.mesh.visible=!0,f.mesh.material.color.setHex(r===3?7175041:14871012))}}for(let u of this.smoke)if(u.mesh.visible){u.life+=h,u.mesh.visible=u.life<1.1&&u.mesh.position.z<13,u.mesh.position.x+=h*(.7+Math.sin(u.seed)*.2),u.mesh.position.y+=h*.65,u.mesh.position.z+=h*(l+1.2);let f=.25+u.life*.65;u.mesh.scale.setScalar(f),u.mesh.material.opacity=(r===3?.55:.3)*Math.pow(Math.max(0,1-u.life/1.1),1.5)}for(let u of this.sparks)u.mesh.visible&&(u.life+=h,u.vy-=h*9,u.mesh.position.x+=u.vx*h,u.mesh.position.y+=u.vy*h,u.mesh.position.z+=(u.vz+l)*h,u.mesh.rotation.x=u.seed+u.life*12,u.mesh.visible=u.life<.45&&u.mesh.position.y>.06);if(a)for(let u of[...this.smoke,...this.sparks])u.mesh.visible=!1}};var Ou=new Map,ku=new Map,Bu=new Map,H1=new gr({color:3495787,roughness:.06,metalness:.4,clearcoat:1,clearcoatRoughness:.04,envMapIntensity:1.6}),hm=new Ct({vertexColors:!0,roughness:.52,metalness:.32}),z1=new Ct({vertexColors:!0,roughness:.6,metalness:.28}),G1=new st({vertexColors:!0}),V1=new st({vertexColors:!0}),W1=new Ct({vertexColors:!0,roughness:.6,metalness:.05}),X1=new st({color:9692671,transparent:!0,opacity:.85,blending:wn,depthWrite:!1}),q1=new st({color:16762519,transparent:!0,opacity:.85,blending:wn,depthWrite:!1}),um=[9413549,13225937,7307148,12035471,9281418,14209732,6253690];function dm(i){return ku.has(i)||ku.set(i,new gr({color:i,roughness:.34,metalness:.22,clearcoat:.85,clearcoatRoughness:.16})),ku.get(i)}var $1=(i,e)=>new Ae(i).multiplyScalar(e).getHex();function Rn(i,e=.7,t=0,n=0){let s=[i,e,t,n].join();return Ou.has(s)||Ou.set(s,new Ct({color:i,roughness:e,metalness:t,emissive:n,emissiveIntensity:n?.7:0})),Ou.get(s)}var Pr={arch:new Ti(.48,.07,5,18,Math.PI),rock:new si(1,1),leaf:new Xn(1,10,5),carTrim:new za(1,1,1,2,.09),contact:new Mt(1,1),coach:new za(1,1,1,1,.09),box:new xt(1,1,1),sphere:new Xn(1,12,8),cone:new ii(1,1,6),cylinder:new dn(1,1,1,18)};function fe(i,e,t,n,s,r,a=1,o=1,c=1,l=.7,h=0,u=0){let f=new ve(Pr[e],Rn(t,l,h,u));return f.position.set(n,s,r),f.scale.set(a,o,c),i.add(f),f}function fn(i,e=512,t=1024){let n=document.createElement("canvas");n.width=e,n.height=t,i(n.getContext("2d"),e,t);let s=new wi(n);return s.colorSpace=zt,s}var An=16,Ii=48;function Y1(i){return fn((e,t,n)=>{e.clearRect(0,0,t,n),e.textAlign="center",e.textBaseline="middle";let s=150;for(e.font="900 "+s+"px sans-serif";(e.measureText(i)?.width||0)>t-60&&s>40;)s-=6,e.font="900 "+s+"px sans-serif";e.lineWidth=14,e.strokeStyle="rgba(20,34,52,.85)",e.strokeText(i,t/2,n/2),e.fillStyle="#ffffff",e.fillText(i,t/2,n/2)},1024,320)}function Z1(i){return fn((e,t,n)=>{for(let s=-n;s<t;s+=56)e.fillStyle="#e8443a",e.beginPath(),e.moveTo(s,0),e.lineTo(s+28,0),e.lineTo(s+28+n,n),e.lineTo(s+n,n),e.fill();e.fillStyle="#f6f1e7",e.fillRect(24,n*.2,t-48,n*.6),e.fillStyle="#c62f27",e.textAlign="center",e.textBaseline="middle",e.font="900 "+Math.round(n*.42)+"px sans-serif",e.fillText(i,t/2,n/2+4)},1024,256)}function fm(i,e="#ffd976",t=""){return fn((n,s,r)=>{n.fillStyle="#192c43",n.fillRect(0,0,s,r),n.strokeStyle=e,n.lineWidth=12,n.strokeRect(12,12,s-24,r-24),n.textAlign="center",n.fillStyle=e,n.font="900 120px sans-serif",n.fillText(i,s/2,145),t&&(n.fillStyle="#fff",n.font="bold 28px sans-serif",n.fillText(t,s/2,207))},512,256)}function pm(i,e,t){if(!Bu.has(i)){let n=fn((s,r,a)=>{s.fillStyle="#11283b",s.fillRect(0,0,r,a),s.strokeStyle="#"+t.toString(16).padStart(6,"0"),s.lineWidth=12,s.strokeRect(7,7,r-14,a-14),s.fillStyle="#fff5dd",s.font="900 142px sans-serif",s.textAlign="center",s.fillText(e,r/2,163),s.font="bold 22px sans-serif",s.fillStyle="#a9c9d9",s.fillText("WORDRAMP",r/2,212)},192,256);Bu.set(i,new Ct({map:n,roughness:.56,metalness:.08}))}return Bu.get(i)}var wc=class{constructor(e,t){this.container=e,this.viewport={width:innerWidth,height:innerHeight},this.renderer=t||new uc({antialias:!0,powerPreference:"high-performance"}),this.preferences={graphics:"auto",reduced:!1},this.performanceBudget=Kc("auto",window.devicePixelRatio||1),this.renderer.setPixelRatio(this.performanceBudget.ratio),this.renderer.setSize(innerWidth,innerHeight),this.renderer.outputColorSpace=zt,this.renderer.toneMapping=Sl,this.renderer.toneMappingExposure=1.12,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=ml,e.append(this.renderer.domElement),this.scene=new ga,this.camera=new nn(52,innerWidth/innerHeight,.25,700),this.hemi=new Pa(14216959,5467753,1.4),this.scene.add(this.hemi),this.sun=new xr(16769459,3.4),this.sunOffset=new U(-34,62,38),this.focusTint=new Ae(10273972),this.sun.target.position.set(0,0,-14),this.sun.position.copy(this.sun.target.position).add(this.sunOffset),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(1024,1024),Object.assign(this.sun.shadow.camera,{left:-26,right:26,top:34,bottom:-34,near:10,far:170}),this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.035,this.sun.shadow.radius=3,this.scene.add(this.sun,this.sun.target),this.rim=new xr(10214640,1.05),this.rim.position.set(30,20,-50),this.scene.add(this.rim),this.player=this.makeCar(15973461,!0),this.scene.add(this.player),this.player.position.z=4,this.damageFx=new Sc(this.scene,this.player),this.rivalCars=[],this.spectators=new bc(this.scene),this.trail=new Ge,this.scene.add(this.trail);for(let n=0;n<12;n++){let s=fe(this.trail,"box",8440760,0,.08,0,.08,.025,.32,.4,0,5809551);s.visible=!1}this.boostFx=new yc(this.scene,this.player),this.exhaust=this.boostFx.exhaust,this.lookConfig={color:15973461,badge:0,trail:!1},this.shadow=new ve(new Mt(3.2,5.9),new st({map:fn((n,s,r)=>{n.shadowColor="rgba(0,0,0,.62)",n.shadowBlur=22,n.fillStyle="rgba(0,0,0,.62)";let a=s*.2,o=r*.14,c=s*.6,l=r*.72,h=26;n.beginPath(),n.moveTo(a+h,o),n.arcTo(a+c,o,a+c,o+l,h),n.arcTo(a+c,o+l,a,o+l,h),n.arcTo(a,o+l,a,o,h),n.arcTo(a,o,a+c,o,h),n.fill()},128,256),transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2})),this.shadow.rotation.x=-Math.PI/2,this.shadow.position.set(0,.07,4),this.scene.add(this.shadow),this.nitroReadyGlow=new ve(new Mt(4.8,6.9),new st({map:fn((n,s,r)=>{let a=n.createRadialGradient(s/2,r/2,0,s/2,r/2,s/2);a.addColorStop(0,"#71daff00"),a.addColorStop(.42,"#71daff00"),a.addColorStop(.7,"#71daff88"),a.addColorStop(1,"#71daff00"),n.fillStyle=a,n.fillRect(0,0,s,r)},128,128),transparent:!0,depthWrite:!1,opacity:.65})),this.nitroReadyGlow.rotation.x=-Math.PI/2,this.nitroReadyGlow.visible=!1,this.scene.add(this.nitroReadyGlow),this.world=new Ge,this.scene.add(this.world),this.gates=new Map,this.gate=new Ge,this.roadBoards=new Ge,this.scene.add(this.roadBoards),this.signAnchors=[],this.promptAnchor=new U,this.traffic=[],this.elapsed=0,this.showcaseDistance=0,this.currentLane=0,this.index=-1,this.lastGate="",this.gateTextures=[],this.setup(0),this.look=new U,this.resize(),window.addEventListener("resize",()=>this.resize()),this.viewportObserver=typeof ResizeObserver=="function"?new ResizeObserver(()=>this.resize()):null,this.viewportObserver?.observe(e),this.renderer.domElement.addEventListener("webglcontextlost",n=>{n.preventDefault(),document.dispatchEvent(new Event("graphicslost"))}),this.renderer.domElement.addEventListener("webglcontextrestored",()=>location.reload())}setPreferences(e){let t=this.preferences.graphics!==e.graphics;this.preferences=e,t&&(this.performanceBudget=Kc(e.graphics,window.devicePixelRatio||1),this.renderer.setPixelRatio(this.performanceBudget.ratio),this.resize()),this.renderer.shadowMap.enabled=e.graphics!=="battery"}samplePerformance(e,t){vd(this.performanceBudget,e,t)&&(this.renderer.setPixelRatio(this.performanceBudget.ratio),this.resize())}resize(){let e=Math.max(1,this.container.clientWidth||innerWidth),t=Math.max(1,this.container.clientHeight||innerHeight);this.resized&&e===this.viewport.width&&t===this.viewport.height||(this.viewport={width:e,height:t},this.resized=!0,this.renderer.setSize(e,t),this.camera.aspect=e/t,this.camera.updateProjectionMatrix())}makeCar(e,t=!1,n=t?"coupe":"sedan"){let s=Yp(n),r=s.anchors,a=new Ge,o=[],c=[],l=[],h=new ve(s.paint,dm(e));h.userData.paint=!0,a.add(h);let u=new ve(s.glass,H1);if(a.add(u),a.add(new ve(s.trim,hm),new ve(s.lights,G1)),s.stripes){let f=new ve(s.stripes,hm);f.userData.stripes=!0,a.add(f)}for(let f of[-1,1]){for(let x of s.wheelSpec.z){let g=new Ge,m=new Ge;g.position.set(f*s.wheelSpec.x,s.wheelSpec.r,x),g.add(m),m.add(new ve(s.wheel,z1)),a.add(g),g.userData.front=x<0,g.userData.spin=m,o.push(g)}c.push(fe(a,"coach",8862019,f*r.lamps.x,r.lamps.y,r.lamps.z,r.lamps.w,.11,.05,.2,.2,5969952));let d=new Bt;d.add("i",Pr.box,16757575,f*(r.lamps.x+r.lamps.w/2+.05),r.lamps.y,r.lamps.z+.01,.12,.08,.04),d.add("i",Pr.box,16757575,f*(r.head.x+.24),r.head.y,r.head.z+.06,.12,.06,.04);let p=new ve(d.merge("i"),V1);p.userData.indicator=f,p.visible=!1,l.push(p),a.add(p)}return a.traverse(f=>{f.isMesh&&(f.castShadow=f!==u,f.receiveShadow=!0)}),a.userData={indicators:l,wheels:o,brakeLights:c,wheelAngle:0,anchors:r,kind:n},a.userData.hitBounds=new Ln().setFromObject(a),a}animateCar(e,t,n,s){for(let r of e.userData.wheels||[])r.rotation.y=r.userData.front?n:0,r.userData.spin.rotation.x=t;for(let r of e.userData.brakeLights||[])r.material=s?Rn(16737636,.2,.2,16722217):Rn(8862019,.2,.2,5969952)}setCosmetics(e){if(this.lookConfig=e,!this.teamRoundel){this.teamRoundel=new ve(new Mt(.73,.97).rotateX(-Math.PI/2));let t=this.player.userData.anchors;this.teamRoundel.position.set(0,t.roofY+.004,t.roofZ),this.teamRoundel.scale.setScalar(.82),this.player.add(this.teamRoundel)}if(this.teamRoundel.visible=!!e.teamId,e.teamId&&(this.teamRoundel.material=pm(e.teamId,e.teamId[0].toUpperCase(),e.color)),this.player.traverse(t=>{t.userData.paint&&(t.material=dm(e.color))}),!this.hoodBadge){let t=this.player.userData.anchors.badge;this.hoodBadge=fe(this.player,"cylinder",16244641,0,t.y+.006,t.z,.2,.02,.2,.3,.6,5784864),this.hoodBadge.userData.cosmetic=!0;let n=new pr;for(let s=0;s<10;s++){let r=s*Math.PI/5-Math.PI/2,a=s%2?.065:.15;s===0?n.moveTo(Math.cos(r)*a,Math.sin(r)*a):n.lineTo(Math.cos(r)*a,Math.sin(r)*a)}n.closePath(),this.badgeStar=new ve(new Ra(n),Rn(4017499,.3,.5)),this.badgeStar.rotation.x=-Math.PI/2,this.badgeStar.position.set(0,t.y+.02,t.z),this.player.add(this.badgeStar)}this.hoodBadge.visible=this.badgeStar.visible=e.badge>0,this.hoodBadge.material=Rn([16244641,11129550,15319923,13812460][e.badge]||16244641,.3,.6)}addContactShadow(e){this.contactMaterial||(this.contactMaterial=this.shadow.material.clone(),this.contactMaterial.opacity=.52);let t=new ve(Pr.contact,this.contactMaterial);t.rotation.x=-Math.PI/2,t.scale.set(3,5.4,1),t.position.y=.055,this.scene.add(t),e.userData.contactShadow=t}placeContactShadow(e){let t=e.userData.contactShadow;t&&(t.visible=e.visible&&1-2*(e.quaternion.x**2+e.quaternion.z**2)>.8,t.position.set(e.position.x,e.position.y+.055,e.position.z),t.rotation.z=-e.rotation.y)}syncRivals(e){if(this.rivalState!==e){for(let t of this.rivalCars)t.userData.contactShadow&&this.scene.remove(t.userData.contactShadow),this.scene.remove(t),t.traverse(n=>{n.isMesh&&n.userData.ownGeometry&&n.geometry.dispose()});this.rivalCars=[],this.rivalState=e;for(let t of e?.rivals||[]){let n=this.makeCar(t.color,!1,"gt"),s=n.userData.anchors;n.userData.rival=t;let r=new ve(new Mt(.62,.8).rotateX(-Math.PI/2),pm("rival"+t.id,String(t.id+2).padStart(2,"0"),t.color));r.userData.ownGeometry=!0,r.position.set(0,s.roofY+.004,s.roofZ),n.add(r);let a=new Ge;for(let o of[-1,1]){let c=fe(a,"cone",t.id?16762519:9692671,o*s.exhaust[0],s.exhaust[1],s.exhaust[2]+.5,.11,.85,.11,.2,0,t.id?16750168:4569327);c.rotation.x=-Math.PI/2,c.material=t.id?q1:X1}a.visible=!1,n.add(a),n.userData.nitroExhaust=a,this.scene.add(n),this.addContactShadow(n),this.rivalCars.push(n)}}}rivalProjection(){return this.camera.updateMatrixWorld(),this.rivalCars.map(e=>{let t=e.position.clone();return t.y+=2.5,t.project(this.camera),{id:e.userData.rival.id,x:(t.x*.5+.5)*this.viewport.width,y:(-.5*t.y+.5)*this.viewport.height,visible:e.visible&&t.z>-1&&t.z<1&&e.position.z<-3}})}ribbon(e,t,n,s,r=.13){let a=[];for(let h=0;h<t.length-1;h++){let u=t[h],f=t[h+1];a.push(u.x-n/2,r,-u.at,u.x+n/2,r,-u.at,f.x-n/2,r,-f.at,f.x-n/2,r,-f.at,u.x+n/2,r,-u.at,f.x+n/2,r,-f.at)}let o=new tt;o.setAttribute("position",new Le(a,3)),o.computeVertexNormals();let c=[];for(let h=0;h<a.length;h+=3)c.push(a[h]/10.8,-a[h+2]/20);o.setAttribute("uv",new Le(c,2));let l=new ve(o,s===this.palette.road?this.asphaltMaterial:Rn(s));return l.receiveShadow=!0,e.add(l),l}setup(e){if(e===this.index)return;this.index=e;let t=Nu[e];this.arenaLook=t,this.palette={road:t.road};for(let l of this.segments||[])for(let h of[...l.userData.roadSurfaces,...l.userData.roadside])h.geometry.dispose();for(let l of this.landmarks||[])l.group.traverse(h=>{h.isMesh&&h.geometry!==this.rotorGeometry&&h.geometry.dispose()});this.world.traverse(l=>{l.isMesh&&l.userData.ownGeometry&&l.geometry.dispose()}),this.world.clear(),this.kit?.dispose();for(let l of[this.roadTexture,this.asphaltTexture,this.reflectionTexture,this.waterNormal,this.cloudTexture])l?.dispose();for(let l of[this.roadMaterial,this.asphaltMaterial,this.waterMaterial,this.sceneryMaterial])l?.dispose();this.rain&&(this.scene.remove(this.rain),this.rain.geometry.dispose(),this.rain.material.dispose(),this.rain=null),this.waterNormal=null,this.segments=[],this.courseState=void 0,this.kit=em(e),this.scene.fog=new ma(t.fog,t.fogNear,t.fogFar),this.scene.background=new Ae(t.horizon),this.sun.color.set(t.sun),this.sun.intensity=t.sunIntensity,this.sunOffset.set(...t.sunPosition),this.hemi.color.set(t.hemiSky),this.hemi.groundColor.set(t.hemiGround),this.hemi.intensity=t.hemi,this.rim.color.set(t.rim),this.rim.intensity=t.rimIntensity,this.renderer.toneMappingExposure=t.exposure;let n=nm(t);n.userData.ownGeometry=!0,this.world.add(n),this.skyDome=n;let s=im(e,t);s.userData.ownGeometry=!0,this.world.add(s);let r=l=>"#"+new Ae(l).getHexString();this.reflectionTexture=fn((l,h,u)=>{let f=l.createLinearGradient(0,0,0,u);f.addColorStop(0,r(t.zenith)),f.addColorStop(.46,r(t.horizon)),f.addColorStop(.5,r(t.sunGlow)),f.addColorStop(.54,r(t.hemiGround)),f.addColorStop(1,r($1(t.hemiGround,.5))),l.fillStyle=f,l.fillRect(0,0,h,u);let d=l.createRadialGradient(h*.3,u*.32,1,h*.3,u*.32,30);d.addColorStop(0,"#fff8e4"),d.addColorStop(1,"#fff8e400"),l.fillStyle=d,l.fillRect(0,0,h,u)},256,128),this.reflectionTexture.mapping=yr,this.scene.environment=this.reflectionTexture,this.scene.environmentIntensity=e===2?.62:.7;let a=Math.min(8,this.renderer.capabilities?.getMaxAnisotropy?.()||1);this.asphaltTexture=fn((l,h,u)=>{l.fillStyle=r(t.road),l.fillRect(0,0,h,u);let f=window.RallyCore.random(101+e);for(let d=0;d<6e3;d++){l.fillStyle=d%3?"#ffffff07":"#0000000c";let p=d%7?2:3;l.fillRect(f()*h,f()*u,p,p)}for(let d of[1,3,5])for(let p of[-.045,.045]){let x=h*(d/6+p),g=l.createLinearGradient(x-14,0,x+14,0);g.addColorStop(0,"#00000000"),g.addColorStop(.5,e===2?"#ffffff0d":"#0000000f"),g.addColorStop(1,"#00000000"),l.fillStyle=g,l.fillRect(x-14,0,28,u)}l.strokeStyle="#00000024",l.lineWidth=2;for(let d=0;d<5;d++){l.beginPath();let p=f()*h,x=f()*u;l.moveTo(p,x);for(let g=0;g<5;g++)p+=(f()-.5)*40,x+=f()*30,l.lineTo(p,x);l.stroke()}},512,512),this.asphaltTexture.wrapS=this.asphaltTexture.wrapT=vi,this.asphaltTexture.anisotropy=a,this.asphaltMaterial=new Ct({map:this.asphaltTexture,roughness:t.roadRough,metalness:e===2?.18:.02}),this.roadTexture=fn((l,h,u)=>{l.drawImage(this.asphaltTexture.image,0,0,h,u),l.strokeStyle=e===2?"#e6e9f4":"#f1ede0",l.lineWidth=7,l.beginPath(),l.moveTo(16,0),l.lineTo(16,u),l.moveTo(h-16,0),l.lineTo(h-16,u),l.stroke(),l.setLineDash([88,72]),l.lineWidth=6;for(let f of[h/3,h*2/3])l.beginPath(),l.moveTo(f,0),l.lineTo(f,u),l.stroke()},512,1024),this.roadTexture.wrapS=this.roadTexture.wrapT=vi,this.roadTexture.anisotropy=a;let o=new Ct({map:this.roadTexture,roughness:t.roadRough,metalness:e===2?.18:.02});if(this.roadMaterial=o,this.sceneryMaterial=new Ct({vertexColors:!0,roughness:e===2?.74:.88,metalness:0}),e===1){this.waterNormal=fn((h,u,f)=>{h.fillStyle="#8080ff",h.fillRect(0,0,u,f);for(let d=0;d<f;d+=4)for(let p=0;p<u;p+=4){let x=Math.sin(p*.07+Math.sin(d*.08)*2),g=Math.cos(d*.13+Math.sin(p*.04));h.fillStyle=`rgb(${128+Math.round(x*28)},${128+Math.round(g*22)},245)`,h.fillRect(p,d,4,4)}},256,256),this.waterNormal.colorSpace=Yn,this.waterNormal.wrapS=this.waterNormal.wrapT=vi,this.waterNormal.repeat.set(40,40),this.waterMaterial=new Ct({color:t.water,roughness:.16,metalness:.18,normalMap:this.waterNormal,normalScale:new pe(.5,.5),envMapIntensity:1.3});let l=new ve(new Mt(1600,1100).rotateX(-Math.PI/2),this.waterMaterial);l.position.set(0,-3.3,-260),l.userData.ownGeometry=!0,l.receiveShadow=!0,this.world.add(l)}else{let l=new ve(new xt(1100,1,900),new Ct({color:t.ground,roughness:1}));l.position.set(0,-.56,-230),l.userData.ownGeometry=!0,l.receiveShadow=!0,this.world.add(l)}for(let l=0;l<19;l++){let h=new Ge,u=new ve(new Mt(10.8,20,1,8).rotateX(-Math.PI/2),o);u.position.y=.02,u.receiveShadow=!0,h.add(u);let f=new ve(new Mt(10.8,20,1,8).rotateX(-Math.PI/2),this.asphaltMaterial);f.position.y=.02,f.receiveShadow=!0,h.add(f),h.userData.roadSurfaces=[u,f],h.userData.flexSurfaces=[u,f],h.userData.roadside=[],h.userData.scenery=[];for(let d of[-1,1]){let p=Object.values(this.kit.roadside)[0][0][d],x=new ve(p.clone(),this.sceneryMaterial);x.userData.side=d,x.receiveShadow=!0,x.userData.flatPositions=p.attributes.position.array,x.userData.flatNormals=p.attributes.normal.array,h.add(x),h.userData.roadside.push(x),h.userData.flexSurfaces.push(x);let g=new ve(this.kit.empty,this.sceneryMaterial);h.add(g),h.userData.scenery.push({mesh:g,group:g,side:d})}for(let d of[u,f])d.userData.flatPositions=d.geometry.attributes.position.array.slice(),d.userData.flatNormals=d.geometry.attributes.normal.array.slice();this.world.add(h),this.segments.push(h)}this.landmarks=[],this.rotorGeometry??=am();for(let l of sm(e,window.RallyCore.ARENAS[e].length)){let h=rm(e,l.kind,t),u=new Ge,f=new ve(h.static,this.sceneryMaterial);u.add(f);let d=(h.rotors||[]).map(([p,x,g])=>{let m=new ve(this.rotorGeometry,this.sceneryMaterial);return m.position.set(p,x,g),u.add(m),m});u.visible=!1,this.world.add(u),this.landmarks.push({...l,...h,group:u,rotors:d})}this.cloudTexture=fn((l,h,u)=>{for(let f=0;f<9;f++){let d=h*(.2+.6*Math.random()),p=u*(.45+.2*Math.random()),x=h*(.12+.12*Math.random()),g=l.createRadialGradient(d,p,1,d,p,x);g.addColorStop(0,"#ffffffcc"),g.addColorStop(1,"#ffffff00"),l.fillStyle=g,l.fillRect(0,0,h,u)}},256,128),this.clouds=[];let c=window.RallyCore.random(921+e);for(let l=0;l<(e===2?14:9);l++){let h=new Mi(new ni({map:this.cloudTexture,color:e===2?7174291:16777215,opacity:e===2?.85:e===1?.5:.62,transparent:!0,fog:!1,depthWrite:!1})),u=e===2?120+c()*90:70+c()*70;h.scale.set(u,u*.36,1),h.position.set((c()-.5)*620,e===2?48+c()*30:70+c()*50,-300-c()*170),h.renderOrder=-8,h.userData.drift=.6+c()*.8,this.world.add(h),this.clouds.push(h)}if(e===2){let l=new Si(new xt(.018,1.1,.018),new st({color:13096172,transparent:!0,opacity:.2,depthWrite:!1,fog:!1}),320);l.frustumCulled=!1,l.instanceMatrix.setUsage(ds),l.userData.drops=Array.from({length:320},(h,u)=>[(c()-.5)*44,c()*20,-c()*70+4,.7+c()*.6]),this.scene.add(l),this.rain=l}this.tunnels=Fu(e,window.RallyCore.ARENAS[e].length,[]),this.clearGate()}edge(e,t){let n=this.apronWidth(e);for(let s of this.forkRoutes||[]){if(e<s.bounds.start||e>s.bounds.end)continue;let r=s.routes[0],a=c=>(c=Tt.clamp(c,0,1),c*c*c*(10+c*(-15+6*c))),o;if(e<r.start)o=3.35+8.2-2.8*a((e-s.bounds.start)/30);else if(e>r.end)o=3.35+5.4+2.8*a((e-r.end)/40);else{let c=s.routes.map(l=>l.lane*3.35+window.RallyCore.routeOffset(l,e));o=t>0?Math.max(...c)+5.4:5.4-Math.min(...c)}n=Math.max(n,o)}return n}rebuildChunk(e,t,n){let s=tm(this.index,t,{tunnels:this.tunnels,open:this.coasterRanges});e.userData.plan=s;for(let[l,h]of e.userData.roadSurfaces.entries())h.geometry.dispose(),h.geometry=this.mainRoadGeometry(n,l===1),h.userData.flatPositions=h.geometry.attributes.position.array.slice(),h.userData.flatNormals=h.geometry.attributes.normal.array.slice();for(let l of e.userData.roadside){let[h,u]=s.roadside[l.userData.side],f=this.kit.roadside[h],d=f[u%f.length][l.userData.side];l.geometry.dispose(),l.geometry=d.clone(),l.userData.flatPositions=d.attributes.position.array,l.userData.flatNormals=d.attributes.normal.array,l.castShadow=!!s.tunnel}let r={"-1":5.4,1:5.4};for(let l=-10;l<=10;l+=2.5)for(let h of[-1,1])r[h]=Math.max(r[h],this.sceneryEdge(n-l,h));for(let l of e.userData.scenery){let h=s.scenery[l.side];l.mesh.geometry=h<0?this.kit.empty:this.kit.scenery[l.side][h],l.mesh.position.x=l.side*(r[l.side]+5.6)}let a=e.rotation.y,o=Math.cos(a),c=Math.sin(a);for(let l of e.userData.flexSurfaces){let h=l.geometry.attributes.position,u=l.geometry.attributes.normal,f=l.userData.flatPositions,d=l.userData.flatNormals,p=l.userData.side||0;for(let x=0;x<f.length;x+=3){let g=f[x+2],m=n-g,b=f[x]+(p?p*(this.edge(m,p)-5.4):0)+this.curve(m)-this.curve(n);h.array[x]=o*b-c*g,h.array[x+1]=f[x+1],h.array[x+2]=c*b+o*g;let S=d[x],v=d[x+1],I=d[x+2]+(this.curve(m+.1)-this.curve(m-.1))/.2*S,y=Math.hypot(S,v,I)||1;u.array[x]=(o*S-c*I)/y,u.array[x+1]=v/y,u.array[x+2]=(c*S+o*I)/y}h.needsUpdate=!0,u.needsUpdate=!0,l.geometry.computeBoundingSphere()}}sceneryEdge(e,t){let n=0;for(let s of this.coasterRanges||[])e>s.start&&e<s.end&&(n=Math.max(n,s.wide.some(r=>e>r.start&&e<r.end)?54:27));return Math.max(this.edge(e,t),n)}curve(e){return window.RallyCore.courseCurve(this.index,e)}heading(e,t){let n=window.RallyCore;return-Math.atan((this.curve(e+1)+n.routeOffset(t,e+1)-this.curve(e-1)-n.routeOffset(t,e-1))/2)}prepareCourse(e){if(this.courseState===e&&this.courseRevision===e?.taskRevision)return;this.courseState=e,this.courseRevision=e?.taskRevision,this.roadReservations=[],this.forkRanges=[],this.apronRanges=[],this.gapRanges=(e?.tasks||[]).filter(a=>a.kind==="repair").map(a=>({start:a.at,end:a.at+Ii}));for(let a of e?.tasks||[]){let o=window.RallyCore.taskZone(a);if(this.roadReservations.push({start:o.start-80,end:o.end+80}),this.apronRanges.push({start:o.start-70,fullStart:o.start-30,fullEnd:o.end+25,end:o.end+80}),a.coaster){let c=a.at+a.coaster.span;this.apronRanges.push({start:c-110,fullStart:c-70,fullEnd:c+45,end:c+100})}a.kind==="junction"&&this.forkRanges.push(pc(window.RallyCore.makeRoute(e,a,0,!0,!0)))}let t=window.RallyCore;this.forkRoutes=(e?.tasks||[]).filter(a=>a.kind==="junction").map(a=>{let o=t.groundRoutes(e,a);return{routes:o,bounds:pc(o[0])}}),this.coasterRanges=(e?.tasks||[]).filter(a=>a.coaster).map(a=>{let o=t.RIDE_LAYOUTS[a.coaster.layout],c=l=>a.at+l*a.coaster.span/o.span;return{start:a.at-40,end:a.at+a.coaster.span+30,wide:o.elements.filter(l=>l.kind==="helix").map(l=>({start:c(l.start-12),end:c(l.end+12)}))}});let n=(e?.tasks||[]).map(a=>t.taskZone(a)),s=n.map(a=>({start:a.start-80,end:a.reach+80})),r=e?.arena?.length??t.ARENAS[this.index].length;s.push({start:r-260,end:r+200}),this.tunnels=Fu(this.index,r,e?s:[]),this.spectators.blocked=this.tunnels;for(let a of this.segments)a.userData.curveIndex=void 0}apronWidth(e){let t=s=>(s=Tt.clamp(s,0,1),s*s*s*(10+s*(-15+6*s))),n=5.4;for(let s of this.apronRanges||[]){let r=Math.min(t((e-s.start)/(s.fullStart-s.start)),t((s.end-e)/(s.end-s.fullEnd)));n=Math.max(n,5.4+6.15*r)}return n}mainRoadGeometry(e,t=!1){let n=e-10,s=e+10,r=new Set;for(let d=0;d<=8;d++)r.add(n+d*2.5);for(let d of[...this.forkRanges||[],...this.gapRanges||[]])for(let p of[d.start,d.end])p>n&&p<s&&r.add(p);let a=[...r].sort((d,p)=>d-p),o=[],c=[],l=[],h=[],u=t?4:2;a.forEach(d=>{let p=this.apronWidth(d),x=t?[-p,-5.4,5.4,p]:[-5.4,5.4];for(let g of x)o.push(g,0,e-d),h.push(0,1,0),c.push(t?g/10.8:g<0?0:1,d/20)});for(let d=0;d<a.length-1;d++){let p=(a[d]+a[d+1])/2;if(!(this.forkRanges?.some(x=>p>x.start&&p<x.end)||!t&&this.gapRanges?.some(x=>p>x.start&&p<x.end)||t&&this.apronWidth(p)<5.40001))for(let x=0;x<u;x+=2){let g=d*u+x;l.push(g,g+1,g+u,g+u,g+1,g+u+1)}}let f=new tt;return f.setAttribute("position",new Le(o,3)),f.setAttribute("normal",new Le(h,3)),f.setAttribute("uv",new Le(c,2)),f.setIndex(l),f}clearGate(){for(let e of this.gates.values())this.disposeGate(e);this.gates.clear(),this.gate=new Ge,this.lastGate="",this.preparedState=null}disposeGate(e){this.scene.remove(e),e.traverse(t=>{(t.isMesh||t.isLine)&&!Object.values(Pr).includes(t.geometry)&&t.geometry.dispose()}),(e.userData.textures||[]).forEach(t=>t.dispose()),(e.userData.ownMaterials||[]).forEach(t=>t.dispose())}makePerson(e,t,n){let s=new Ge;s.scale.setScalar(1.5);let r=[13935748,12947056,14858650,10974296][t%4],a=[7450538,12227686,9346240,11763341][t%4];fe(s,"box",a,0,1.48,0,.65,.84,.38),fe(s,"sphere",r,0,2.18,0,.29,.32,.27),fe(s,"sphere",4800059,0,2.39,-.02,.3,.15,.27);for(let h of[-1,1]){let u=fe(s,"box",3426140,h*.19,.66,0,.23,.75,.25);u.userData.leg=h,fe(s,"box",2372938,h*.19,.2,.07,.28,.2,.43);let f=fe(s,"box",a,h*.39,1.44,.12,.2,.72,.23);f.rotation.z=h*.18,fe(s,"sphere",r,h*.42,1.16,.25,.12,.12,.12),fe(s,"sphere",2503746,h*.1,2.21,.25,.036,.036,.016)}let o=fn((h,u,f)=>{h.fillStyle="#f4e9d0",h.fillRect(0,0,u,f),h.strokeStyle="#44696b",h.lineWidth=12,h.strokeRect(7,7,u-14,f-14),h.textAlign="center",h.fillStyle="#20394c",h.font="bold "+(e.length>16?36:50)+"px sans-serif",h.fillText(e,u/2,145,u-40)},512,256);n.userData.textures.push(o);let c=new st({map:o});n.userData.ownMaterials.push(c);let l=new ve(new Mt(1.45,.72),c);return l.position.set(0,1.22,.31),s.add(l),s.userData.personIndex=t,s.userData.signPoint=new U(0,1.22,.34),s}buildCoaster(e,t,n){let s=window.RallyCore,r=s.makeRoute(n,t,t.correctIndex,!0),a=s.rideLayout(r),o=!!this.preferences.reduced,c=e.userData.coaster;c&&(e.remove(c.group),c.group.traverse(b=>{b.isMesh&&b.geometry.dispose()}));let l=Hp({route:r,curve:b=>this.curve(b),offset:s.routeOffset,height:s.coasterHeight,origin:t.at,span:a.span,elements:a.elements,reduced:o}),h=b=>this.curve(b)-this.curve(t.at),u=qp(l,h,(b,S)=>this.edge(b,S)),f=[{deck:4018019,rail:15226698,support:15855592,base:0,rock:7170662},{deck:14936556,rail:2535100,support:12043208,base:-3.3,rock:8227468},{deck:7230528,rail:10134957,support:5721413,base:0,rock:5591115}][this.index]||{deck:4018019,rail:15226698,support:15855592,base:0,rock:7170662},d=new Ge,p=[],x=new Ae,g=40,m=this.preferences.graphics==="battery";for(let b=r.start;b<r.end-1;b+=g){let S=l.filter((F,k)=>F.at>=b-1e-6&&F.at<=b+g+.51&&(!m||k%2===0||F.inDetour)),v=[],I=(F,k)=>{let G=F.positions.length/3,V=new Float32Array(G*3);x.setHex(k);for(let ee=0;ee<G;ee++)V.set([x.r,x.g,x.b],ee*3);v.push({...F,colours:V})};for(let F of mc(S,k=>!k.air&&k.p[1]>.12))for(let k of[0,r.side*3.2]){I(Va(F,zp,k),f.deck);for(let G of mc(F,V=>!V.halfpipe))for(let V of[-1.2+.12,1.2-.12])I(Va(G,Gp(V),k),f.rail);for(let G of mc(F,V=>V.halfpipe))for(let V of[-1.2,1.2])I(Va(G,Vp(V),k),f.rail)}let y=S.filter(F=>F.tunnel);for(let F=0;F<y.length-3;F+=9)I(Va(y.slice(F,F+3),Wp(r.side*3.2/2),0),f.rock);let w=(F,k,G,V,ee,W)=>{let ce=[F,k],$=[G,V],Z=[ee-W/2,ee+W/2],Re=[];for(let nt of ce)for(let Xe of $)for(let et of Z)Re.push(nt,Xe,et);return{positions:Re,indices:[0,1,3,0,3,2,4,6,7,4,7,5,0,4,5,0,5,1,2,3,7,2,7,6,0,2,6,0,6,4,1,5,7,1,7,3]}};for(let F of u.filter(k=>k.at>=b&&k.at<b+g))if(F.kind==="column")I(w(F.x-.32,F.x+.32,f.base,F.top,F.z,.64),f.support);else{for(let k of[F.left,F.right])I(w(k-.3,k+.3,f.base,F.top,F.z,.6),f.support);I(w(F.left-.3,F.right+.3,F.top-.55,F.top,F.z,.7),f.support)}if(!v.length)continue;let A=[],M=[],_=[];for(let F of v){let k=A.length/3;A.push(...F.positions),M.push(...F.colours);for(let G of F.indices)_.push(G+k)}let P=new tt;P.setAttribute("position",new Le(A,3)),P.setAttribute("color",new Le(M,3)),P.setIndex(_),P.computeVertexNormals();let D=new ve(P,this.coasterMaterial||=new Ct({vertexColors:!0,roughness:.48,metalness:.2,side:Jt,flatShading:!0}));D.castShadow=!m,D.visible=!1,D.scale.y=.001,d.add(D),p.push({mesh:D,start:b,end:b+g,delay:(b-r.start)/(r.end-r.start)*.32,rise:0})}if(!c){let b=new Ge;for(let w of[-1.4,1.4])fe(b,"cylinder",5795967,w,3.2,0,.12,6.4,.12);let S=fm(a.title,"#ffd976",a.tagline);e.userData.textures.push(S);let v=new st({map:S});e.userData.ownMaterials.push(v);let I=new ve(new Mt(5.4,2.7),v);I.position.set(0,5.4,.15),b.add(I);let y=t.at-130;b.position.set(this.curve(y)-this.curve(t.at)+this.edge(y,1)+3.2,0,130),b.rotation.y=-.35,e.add(b)}e.add(d),e.userData.coaster={group:d,pieces:p,frames:l,route:r,reduced:o,revealedAt:c?.revealedAt??null}}updateCoaster(e,t,n){let s=e.userData.coaster;if(!s)return;s.reduced!==!!this.preferences.reduced&&this.buildCoaster(e,t,n);let r=e.userData.coaster;if(r.revealedAt==null&&t.completed&&(r.revealedAt=this.clock),r.revealedAt==null)return;let a=this.clock-r.revealedAt;for(let o of r.pieces){let c=Tt.clamp((a-o.delay)/.2,0,1);o.rise=this.preferences.reduced?1:1-(1-c)**3,o.mesh.visible=o.rise>0,o.mesh.scale.y=Math.max(.001,o.rise)}}rideRise(e,t){let n=this.gates.get(e.taskId)?.userData.coaster;if(!n||n.revealedAt==null)return 0;let s=n.pieces.find(r=>t>=r.start&&t<r.end);return s?s.rise:1}ridePose(e,t,n,s,r,a){if(!e?.coaster)return null;let o=this.gates.get(e.taskId)?.userData.coaster;if(!o)return null;let c=window.RallyCore,l=Xp(o.frames,t,n),h=this.rideRise(e,t),u=this.curve(o.route.start)-r,f=-(o.route.start-s)+4,d=new U(l.position[0]+u,l.position[1]*(a?1:h),l.position[2]+f),p=new dt().makeBasis(new U(...l.right),new U(...l.up),new U(...l.forward).negate()),x=new Gn().setFromRotationMatrix(p);return h<1&&a&&(d.lerpVectors(a.position,d,h),x.slerpQuaternions(a.quaternion,x,h)),{position:d,quaternion:x,forward:l.forward,up:l.up,speed:l.speed*c.coasterPace(e,t),detour:l.detour*h,wide:l.wide*h,kind:l.kind,air:l.air,side:e.side,rise:h}}buildBridge(e,t){let n=y=>this.curve(y)-this.curve(t.at),s=y=>-Math.atan((this.curve(y+1)-this.curve(y-1))/2),r=this.index,a=[{slab:9344926,pit:1906709,wall:3814706,depth:5},{slab:8360862,pit:0,wall:13226453,depth:1.4},{slab:8221804,pit:2236188,wall:3617326,depth:16}][r]||{slab:9344926,pit:1906709,wall:3814706,depth:5},o=fn((y,w,A)=>{let M=y.createLinearGradient(0,0,w,0);M.addColorStop(0,"#2b2622"),M.addColorStop(.18,"#0d0b0a"),M.addColorStop(.82,"#0d0b0a"),M.addColorStop(1,"#2b2622"),y.fillStyle=M,y.fillRect(0,0,w,A)},128,8);e.userData.textures.push(o);let c=new st({map:o,color:a.pit||854794});e.userData.ownMaterials.push(c);let l=(y,w,A,M=0)=>{y.updateMatrix();let _=w.clone().applyMatrix4(y.matrix),P=_.attributes.position;for(let D=0;D<P.count;D++)P.setX(D,P.getX(D)+n(A-M-P.getZ(D))-n(A));return _.computeVertexNormals(),y.geometry=_,y.position.set(0,0,0),y.rotation.set(0,0,0),y.scale.set(1,1,1),y},h=(y=8)=>new xt(1,1,1,1,1,y);if(r===1)for(let y=t.at;y<t.at+Ii-1e-6;y+=4){let w=y+2,A=n(w),M=t.at-w,_=s(w);for(let P of[-1,1]){let D=fe(e,"box",a.wall,A+P*5.5,-a.depth/2,M,.25,a.depth,4.05);D.rotation.y=_}}else{let y=new ve(Pr.contact,c);y.rotation.x=-Math.PI/2,y.scale.set(10.8,Ii,1),y.position.set(0,-.035,-Ii/2),e.add(y),l(y,new Mt(1,1,1,24),t.at)}if(r===1)for(let y of[0,-Ii]){let w=fe(e,"box",a.wall,n(t.at-y),-a.depth/2,y,10.8,a.depth,.3);w.rotation.y=s(t.at-y)}let u=fn((y,w,A)=>{for(let M=-A;M<w;M+=48)y.fillStyle="#f2c230",y.fillRect(M,0,24,A),y.fillStyle="#1d1d1d",y.fillRect(M+24,0,24,A)},512,32);u.wrapS=vi,e.userData.textures.push(u);let f=new st({map:u,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2});e.userData.ownMaterials.push(f);let d=new ve(new Mt(10.8,.7),f);d.rotation.x=-Math.PI/2,d.position.set(0,.05,.35),e.add(d),e.userData.barriers.push(d);let p=Z1("BRIDGE OUT");e.userData.textures.push(p);let x=new st({map:p,side:Jt});e.userData.ownMaterials.push(x);for(let y of[-1,1]){let w=new ve(new Mt(4.4,1.1),x);w.position.set(y*7.4,2.5,4),w.rotation.y=-y*.45,e.add(w),e.userData.barriers.push(w),e.userData.barriers.push(fe(e,"cylinder",14278112,y*7.4,1.2,4.1,.1,2.4,.1))}let g=t.blocks.map(y=>{let w=Y1(y);e.userData.textures.push(w);let A=new st({map:w,transparent:!0,color:12044244,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2});return e.userData.ownMaterials.push(A),A}),m=(y,w)=>{let A=new Ge,M=t.at+y*An,_=An/2;A.position.set(n(M),.12,-y*An),A.userData.mid=new U(n(M+_)-n(M),0,-_);let P=new Ge,D=new Ge;D.position.z=-An,A.add(P,D),A.userData.leaves=r===1?[P,D]:null;let F=(G,V,ee,W,ce,$,Z)=>l(fe(G,"box",V,0,ee,W,10.8,ce,$),h(Z),M,G===D?-An:0);if(r===1){F(P,a.slab,-.35,-_/2,.5,_,4),F(D,a.slab,-.35,_/2,.5,_,4);for(let G of[P,D])F(G,2535100,-.05,G===P?-_+.09:_-.09,.12,.18,1)}else F(P,a.slab,-.35,-_,.5,An,8);let k=new ve(new Mt(9.4,2.94),w);if(k.rotation.x=-Math.PI/2,k.position.set(0,-.07,r===1?-4.2:-_),P.add(k),l(k,new Mt(1,1,1,2).scale(9.4,2.94,1),M),A.userData.face=k,y===t.blocks.length-1){let G=fe(D,"box",15844186,0,-.05,1.2,10.8,.3,2.6);G.rotation.x=.16,l(G,h(2),M,-An)}return e.add(A),A},b=t.blocks.map((y,w)=>m(w,g[w])),S=m(0,new st({transparent:!0,color:16761528,depthWrite:!1}));e.userData.ownMaterials.push(S.userData.face.material),S.visible=!1;let v={slabs:b,ghost:S,wordMats:g,placed:0,placedAt:[],lit:[],lastWrong:0,style:a,planks:[]},I=v;if(r===0){let w=this.edge(t.at+24,1)+5,A=new Ge;A.position.set(n(t.at+24)+1*w,0,-24),fe(A,"box",15775026,0,8,0,.8,16,.8);let M=new Ge;M.position.y=16,A.add(M),fe(M,"box",15775026,-8,0,0,18,.6,.6),fe(M,"box",3951447,3,-.5,0,3,1.4,1.4);let _=fe(A,"box",2963266,0,0,0,.06,1,.06);_.visible=!1,e.add(A),v.crane={crane:A,jib:M,cable:_,side:1,yaw:0},v.workers=[0,1,2].map(P=>{let D=new Ge;return D.position.set(n(t.at+6+P*14)-(this.edge(t.at+6+P*14,-1)+2.4),0,-6-P*14),fe(D,"box",16742938,0,1.2,0,.6,.9,.4),fe(D,"box",3096146,0,.45,0,.5,.8,.35),fe(D,"sphere",14066559,0,1.9,0,.24,.26,.24),fe(D,"sphere",16765498,0,2.08,0,.27,.14,.27),D.rotation.y=Math.PI/2,e.add(D),D})}else if(r===1)b.forEach(y=>{this.placeSlab(I,y,0,!1),y.userData.face.visible=!1}),v.spray=[0,1,2,3].map(y=>{let w=fe(e,"sphere",16777215,-3+y*2,-2.8,-8-y*11,.9,.5,.9,.2);return w.material=new st({color:16777215,transparent:!0,opacity:.45,depthWrite:!1}),e.userData.ownMaterials.push(w.material),w});else{let y=fe(e,"sphere",14275787,0,.6,-8,1,1,1);y.material=new st({color:14275787,transparent:!0,opacity:0,depthWrite:!1}),e.userData.ownMaterials.push(y.material),y.visible=!1,v.dust={mesh:y,at:-1/0}}r!==1&&b.forEach(y=>{y.visible=!1});for(let y=0;y<4;y++){let w=fe(e,"box",8227733,0,-.05,0,2.8,.22,An-.4);w.visible=!1,v.planks.push(w)}e.userData.bridge=v,e.userData.repairSlabs=b}placeSlab(e,t,n,s){let r=1-(1-n)**3;if(this.index===1){let a=1.2*(1-(s?n:r));t.position.y=.12,t.rotation.x=0,t.userData.leaves&&(t.userData.leaves[0].rotation.x=a,t.userData.leaves[1].rotation.x=-a)}else this.index===2?(t.rotation.x=0,t.position.y=.12+(s?4*(1-n):16*(1-n*n))):(t.rotation.x=0,t.position.y=.12+(s?4:13)*(1-r))}updateBridge(e,t,n,s){let r=e.userData.bridge;if(!r)return;let a=!!this.preferences.reduced,o=t.chosen?.length||0;if(o>r.placed){let p=o-r.placed>1;for(let x=r.placed;x<o;x++)r.placedAt[x]=p?-1/0:this.clock;r.placed=o}let c=this.index===2?.32:.42;if(r.slabs.forEach((p,x)=>{if(x>=o){this.index===1?(p.visible=!0,this.placeSlab(r,p,0,a),p.userData.face.visible=!1):p.visible=!1;return}let g=Tt.clamp((this.clock-r.placedAt[x])/c,0,1);p.visible=!0,p.userData.face.visible=!0,this.placeSlab(r,p,g,a),g>=1&&!r.seated?.[x]&&((r.seated||=[])[x]=!0,this.index===2&&r.placedAt[x]>-1/0&&(this.onCue?.("slam"),r.dust&&(r.dust.at=this.clock,r.dust.mesh.position.copy(p.position).add(p.userData.mid).y+=.4),a||(this.shake=.35)))}),r.crane){let p=r.crane,x=Math.max(0,Math.min(2,o-1)),g=r.slabs[x],m=g.position.clone().add(g.userData.mid),b=Math.atan2(p.side*(m.z-p.crane.position.z),-p.side*(m.x-p.crane.position.x));p.yaw=Tt.damp(p.yaw,o?b:0,6,s),p.jib.rotation.y=p.yaw;let S=o&&this.clock-r.placedAt[x]<c+.15&&g.position.y>.2;if(p.cable.visible=!!S,S){let v=new U(-p.side*17,16,0).applyAxisAngle(new U(0,1,0),p.yaw).add(p.crane.position),I=g.position.y+.3,y=Math.max(.1,v.y-I);p.cable.position.set(v.x-p.crane.position.x,I+y/2,v.z-p.crane.position.z),p.cable.scale.y=y}}let l=t.lastWrong;if(l&&l.count!==r.lastWrong){r.lastWrong=l.count,r.wrongAt=this.clock;let p=r.ghost,x=p.userData.face.material;x.map=r.wordMats[l.block].map,x.needsUpdate=!0,r.wrongSlot=Math.min(2,l.slot)}let h=r.ghost,u=this.clock-(r.wrongAt??-1/0);if(h.visible=u<.7&&!t.solved,h.visible){let p=r.slabs[r.wrongSlot],x=u/.7;if(h.position.copy(p.position),h.rotation.copy(p.rotation),h.rotation.x=0,(h.userData.leaves||[]).forEach(g=>{g.rotation.x=0}),a)h.position.y=.12+1.5,h.userData.face.material.opacity=1-x;else{let g=Math.min(1,x/.3),m=Math.max(0,(x-.55)/.45);h.position.y=.12+4*(1-g)+1.2*g+5*m*m,h.position.x+=10*m*m*(r.wrongSlot%2?-1:1),h.rotation.z=Math.sin(x*38)*.14*Math.min(1,x*3)*(1-m),h.userData.face.material.opacity=1-m}}if(t.solved&&r.slabs.forEach((p,x)=>{!r.lit[x]&&n.distance>=t.at+x*An+6&&n.distance<t.at+x*An+An+8&&(r.lit[x]=!0,p.userData.face.material.color.setHex(16767339),this.onCue?.("word"+(x+1)))}),t.solved&&r.lockedAt==null&&(r.lockedAt=this.clock),(r.workers||[]).forEach((p,x)=>{let g=r.lockedAt!=null&&this.clock-r.lockedAt<2.2&&!a;p.position.y=g?Math.abs(Math.sin((this.clock-r.lockedAt)*9+x))*.55:0}),(r.spray||[]).forEach((p,x)=>{let g=a?.5:.5+.5*Math.sin(this.clock*2.4+x*1.7);p.scale.set(.8+g,.4+g*.5,.8+g),p.material.opacity=.25+.25*g}),r.dust){let p=this.clock-r.dust.at,x=r.dust.mesh;x.visible=p<.8&&!a,x.visible&&(x.scale.setScalar(1+p*8),x.material.opacity=.55*(1-p/.8))}let f=0,d=[...n.rivals,...n.obstacles.filter(p=>p.type==="traffic"&&!p.dormant)];for(let p of d){if(f>=r.planks.length)break;let x=Math.floor((p.at-t.at)/An);if(!(p.at<t.at-2.3||p.at>t.at+Ii+2.3||Math.abs(p.lanePos??p.lane)>1.3))for(let g of[x,Math.floor((p.at+2.3-t.at)/An)]){if(g<0||g>2||g<o||f>=r.planks.length)continue;let m=r.planks[f++],b=r.slabs[g];m.visible=!0,m.position.set(window.RallyCore.actorX(n,p)-this.curve(t.at),.01,b.position.z-8),m.rotation.y=-Math.atan((this.curve(p.at+1)-this.curve(p.at-1))/2)}}for(let p=f;p<r.planks.length;p++)r.planks[p].visible=!1}bridgeHop(e,t){if(!e||this.preferences.reduced)return 0;let n=e.tasks.find(r=>r.kind==="repair"&&r.solved&&t>r.at+Ii-2&&t<r.at+Ii+12);if(!n)return 0;let s=(t-(n.at+Ii-2))/14;return Math.sin(Math.PI*s)*1.1}makeGate(e,t){let n=new Ge;if(n.userData={task:e,textures:[],ownMaterials:[],barriers:[],repairSlabs:[]},e.kind==="finish"){for(let o of[-5.7,5.7])fe(n,"box",16504187,o,3,0,.45,6,.45);fe(n,"box",16767095,0,6,0,12,.8,.45);let s=fm("FINISH","#ffe296");n.userData.textures.push(s);let r=new st({map:s});n.userData.ownMaterials.push(r);let a=new ve(new Mt(5,2.5),r);a.position.set(0,6,.3),n.add(a);for(let o=-5;o<5;o++)for(let c=0;c<3;c++)fe(n,"box",(o+c)%2?15003123:2373453,o+.5,.055,c,1,.025,1)}else if(e.kind==="pedestrian"){for(let r=-11;r<12;r+=2)fe(n,"box",15920856,0,.075,r,16.8,.025,.8);for(let r of[-1,1]){fe(n,"box",11913654,r*9.4,.12,0,2,.22,19),fe(n,"cylinder",8557470,r*5.9,2.4,-8,.12,4.8,.12);let a=fe(n,"box",15105385,r*5.9,4.6,-8,1.1,.6,.12);a.userData.crossingSignal=!0}fe(n,"box",15920856,0,.075,12,10.5,.025,.35);let s=new Ge;for(let r=-32;r<=12;r+=8)fe(s,"box",8971717,0,.085,r,.16,.025,3,.4,0,3783052);s.visible=!1,n.add(s),n.userData.exitGuide=s,n.userData.people=e.people.map((r,a)=>{let o=this.makePerson(r.word,a,n);return n.add(o),o})}else if(e.kind==="light"){for(let s of[-1,1]){fe(n,"cylinder",4413546,s*12.1,3.2,0,.15,6.4,.15),fe(n,"box",4216680,s*6.1,6.4,0,12.2,.2,.25),fe(n,"box",1386040,s*3.25,5.6,0,.8,1.8,.7);for(let r=0;r<3;r++){let a=fe(n,"sphere",r===0?16737891:r===1?6181188:3361606,s*3.25,6.2-r*.57,.38,.22,.22,.08,.25,0,r===0?16728121:0);a.userData.bulb=r}}for(let s of[-1,-.4,.2])fe(n,"box",15986392,0,.04,s,10.3,.015,.22)}else if(e.kind==="repair"){this.buildBridge(n,e);for(let s of[-1,1]){n.userData.barriers.push(fe(n,"box",15503954,s*3,1.3,2,4,.25,.12));for(let r=0;r<3;r++)n.userData.barriers.push(fe(n,"cone",15832663,s*(3.2+r*.75),.5,3,.27,1,.27))}}else{let s=window.RallyCore,r=s.groundRoutes(t,e),a=kp(r,m=>this.curve(m),s.routeOffset,e.at),o=new tt;o.setAttribute("position",new Le(a.positions,3)),o.setAttribute("uv",new Le(a.uvs,2)),o.setIndex(a.indices),o.computeVertexNormals();let c=new ve(o,this.asphaltMaterial);c.position.y=.02,c.receiveShadow=!0,n.add(c),n.userData.forkSurface=c,n.userData.forkRows=a.rows;let l=[];for(let m=0;m<a.rows.length-1;m++){let b=a.rows[m],S=a.rows[m+1],v=y=>Math.min(...y.intervals.map(w=>w[0])),I=y=>Math.max(...y.intervals.map(w=>w[1]));l.push(v(b),0,-b.at,I(b),0,-b.at,v(S),0,-S.at,v(S),0,-S.at,I(b),0,-b.at,I(S),0,-S.at)}let h=new tt;h.setAttribute("position",new Le(l,3)),h.computeVertexNormals();let u=new ve(h,Rn([8827004,12897481,6122339][this.index]||8827004,.95));u.position.y=-.03,u.receiveShadow=!0,n.add(u);let f=[];for(let[m,b]of a.edges)f.push(m[0],.043,-m[1],b[0],.043,-b[1]);let d=new tt;d.setAttribute("position",new Le(f,3));let p=new Hi(d,new Ei({color:13952218}));n.add(p),n.userData.edgeLine=p,n.userData.ownMaterials.push(p.material);for(let[m,b]of[[a.bounds.start,e.at],[r[0].end,a.bounds.end]])for(let S=m+4;S<b-2;S+=8)for(let v of[-.5,.5]){let I=fe(n,"box",14082266,this.curve(S)-this.curve(e.at)+v*3.35,.043,e.at-S,.1,.015,2.2);I.rotation.y=this.heading(S)}let x=r[0],g=new Ge;for(let m=x.end+4;m<=x.exitEndAt;m+=7)fe(g,"box",10016955,this.curve(m)-this.curve(e.at),.075,e.at-m,.18,.025,2.5,.4,0,3246951);g.visible=!1,n.add(g),n.userData.mergeGuide=g,n.userData.routePaths=[];for(let m=0;m<3;m++){let b=r[m],S=[];for(let w=0;w<=48;w++){let A=b.start+(b.end-b.start)*w/48;S.push({at:A-e.at,x:this.curve(A)-this.curve(e.at)+b.lane*3.35+s.routeOffset(b,A)})}let v=this.ribbon(n,S.map(w=>({...w,x:w.x-1.48})),.1,11843028,.045),I=this.ribbon(n,S.map(w=>({...w,x:w.x+1.48})),.1,11843028,.045),y=new Ge;for(let w=b.start+8;w<b.end-5;w+=12){let A=this.curve(w)-this.curve(e.at)+b.lane*3.35+s.routeOffset(b,w),M=this.heading(w,b);for(let _ of[-1,1]){let P=fe(y,"box",11843028,A+_*.28,.055,e.at-w,.09,.015,.8,.6);P.rotation.y=M+_*.7}}n.add(y),n.userData.routePaths.push({left:v,right:I,index:m,route:b,points:S,chevrons:y})}e.coaster&&this.buildCoaster(n,e,t)}return this.scene.add(n),this.gates.set(e.id,n),n}updateGates(e,t,n,s){if(!e)return;let r=e.tasks.concat({id:"finish",kind:"finish",at:e.arena.length});if(this.preparedState!==e){this.clearGate(),this.preparedState=e;for(let o of r)this.makeGate(o,e).visible=!1;this.preparedRevision=e.taskRevision}if(this.preparedRevision!==e.taskRevision){let o=new Set(r.map(c=>c.id));for(let[c,l]of this.gates)o.has(c)||(this.disposeGate(l),this.gates.delete(c));for(let c of r)!this.gates.has(c.id)&&c.at-t>window.RallyCore.TASK_VIEW_DISTANCE&&(this.makeGate(c,e).visible=!1);this.preparedRevision=e.taskRevision}for(let o of r){let c=o.at-t,l=o.kind==="finish"?80:window.RallyCore.taskZone(o).reach-o.at+120,h=this.gates.get(o.id);if(h&&(h.visible=c<=window.RallyCore.TASK_VIEW_DISTANCE&&c>=-l,!!h.visible)){if(h.position.set(this.curve(o.at)-n,0,-c+4),o.kind==="junction"&&o.completed&&h.userData.chosenIndex!==o.chosenIndex){h.userData.chosenIndex=o.chosenIndex;for(let u of h.userData.routePaths||[]){let f=u.index===o.chosenIndex,d=Rn(f?o.success?11136203:15843719:7637141,.55,0,f?o.success?2647883:7031849:0);u.left.material=u.right.material=d,u.chevrons.traverse(p=>{p.isMesh&&(p.material=d)})}}o.kind==="junction"&&this.updateCoaster(h,o,e),o.kind==="junction"&&(h.userData.mergeGuide.visible=!!e.mergeAssist&&e.mergeAssist.taskId===o.id&&window.RallyCore.exitAssist(e)===e.mergeAssist),o.kind==="light"&&o.success&&h.traverse(u=>{u.userData.bulb===0&&(u.material=Rn(5977145)),u.userData.bulb===2&&(u.material=Rn(6943671,.3,0,3992465))}),o.kind==="repair"&&(this.updateBridge(h,o,e,s),h.userData.barriers.forEach(u=>u.visible=!o.solved)),o.kind==="pedestrian"&&(h.userData.exitGuide.visible=!!window.RallyCore.exitAssist(e)&&e.exitTask===o.id&&!window.RallyCore.crosswalkOccupied(e,o),h.traverse(u=>{u.userData.crossingSignal&&(u.material=window.RallyCore.crosswalkOccupied(e,o)?Rn(15105385,.3,0,16737348):Rn(8902333,.3,0,4908708))})),o.kind==="pedestrian"&&h.userData.people.forEach((u,f)=>{let d=o.people[f],p=d.sent?Math.min(1,(e.elapsed-d.sentAt)/window.RallyCore.PEDESTRIAN_WALK_TIME):0,x=d.side===0?-1:1,g=d.sent?d.sentAt:e.elapsed,m=o.peopleEntryAt==null?0:Math.min(1,Math.max(0,(g-o.peopleEntryAt)/window.RallyCore.PEDESTRIAN_ENTRY_TIME)),b=m*m*(3-2*m),S=d.originSide*8.4*(1-b),v=d.correct===!1?Math.max(0,(p-.35)/.65):p,I=v*v*(3-2*v),y=d.correct===!1&&p<.35?(d.selectedSide===0?-1:1)*2.4*Math.sin(p/.35*Math.PI):0;u.position.set(S*(1-I)+x*8.4*I+y,.03,o.at-d.at+p*1.5),u.rotation.y=x*I*1.05,u.traverse(w=>{w.userData.leg&&(w.rotation.x=d.sent||m>0&&m<1?Math.sin(this.elapsed*9)*.3*w.userData.leg:Math.sin(this.elapsed*2+f)*.025)})})}}for(let[o,c]of this.gates)c.userData.task.at-t<-(c.userData.task.kind==="finish"?80:window.RallyCore.taskZone(c.userData.task).reach-c.userData.task.at+120)&&(this.disposeGate(c),this.gates.delete(o));let a=e.task||e.tasks[e.taskIndex];a?(this.gate=this.gates.get(a.id)||this.gate,this.lastGate=a.id,this.repairSlabs=this.gate.userData.repairSlabs||[]):e.distance>e.arena.length-170&&(this.gate=this.gates.get("finish")||this.gate,this.lastGate="finish")}pedestrianProjection(e){let t=this.gates.get(e.task?.id);return t?.userData.people?(t.updateWorldMatrix(!0,!0),this.camera.updateMatrixWorld(),t.userData.people.map(n=>{let s=n.userData.signPoint.clone();return n.localToWorld(s),s.project(this.camera),{x:(s.x*.5+.5)*this.viewport.width,y:(-.5*s.y+.5)*this.viewport.height,visible:s.z>-1&&s.z<1}})):[]}updateRoadBoards(e,t){let n=e?.task,s=["task","resolving"].includes(e?.status);if(this.roadBoards.visible=s,!s){this.signAnchors=[];return}if(this.roadBoards.children.length===0)for(let c=0;c<3;c++){let l=new Ge;fe(l,"cylinder",6849686,0,1.3,0,.065,2.6,.065),fe(l,"box",16569464,0,.05,0,2.5,.025,1.2),this.roadBoards.add(l)}let r=window.RallyCore.currentRow(e)||e.task?.rows[0],a=this.curve(e.distance+13)-t,o=-9+(n.completed?Math.max(0,e.distance-n.completedDistance):0);this.roadBoards.position.set(a,0,o),this.signAnchors=[];for(let c=0;c<3;c++){let l=this.roadBoards.children[c];l.visible=n.kind!=="repair"&&!(n.kind==="pedestrian"&&c===1),l.position.set((c-1)*3.35,0,0),this.signAnchors.push(new U(l.position.x+a,3.4,o))}this.promptAnchor.set(a,6.2,-30)}roadProjection(){this.camera.updateMatrixWorld();let e=t=>{let n=t.clone().project(this.camera);return{x:(n.x*.5+.5)*this.viewport.width,y:(-.5*n.y+.5)*this.viewport.height,visible:n.z>-1&&n.z<1}};return{prompt:e(this.promptAnchor),answers:this.signAnchors.map(e)}}carScreenBounds(){this.player.updateWorldMatrix(!0,!0),this.camera.updateMatrixWorld();let e=this.player.userData.hitBounds.clone().applyMatrix4(this.player.matrixWorld),t=[];for(let o of[e.min.x,e.max.x])for(let c of[e.min.y,e.max.y])for(let l of[e.min.z,e.max.z]){let h=new U(o,c,l).project(this.camera);h.z>-1&&h.z<1&&t.push({x:(h.x*.5+.5)*this.viewport.width,y:(-.5*h.y+.5)*this.viewport.height})}if(!t.length)return null;let n=Math.min(...t.map(o=>o.x))-10,s=Math.max(...t.map(o=>o.x))+10,r=Math.min(...t.map(o=>o.y))-10,a=Math.max(...t.map(o=>o.y))+10;return{left:n,right:s,top:r,bottom:a}}isCarHit(e,t){let n=this.carScreenBounds();return!!n&&e>=n.left&&e<=n.right&&t>=n.top&&t<=n.bottom}makeObstacle(e){if(e.type==="traffic")return this.makeCar(um[(e.color+e.id)%um.length],!1,Lu[(e.color*3+e.id)%Lu.length]);let t=new Ge;if(e.type==="cones")for(let[a,o]of[[-.7,.45],[.7,.45],[0,-.65]])fe(t,"box",3357765,a,.07,o,.7,.14,.7),fe(t,"cone",15834202,a,.62,o,.34,1.1,.34),fe(t,"cone",15983805,a,.76,o,.22,.3,.22);else if(e.type==="crates")for(let[a,o,c]of[[-.5,.45,.2],[.5,.45,-.3],[.1,1.25,0]]){fe(t,"coach",11239001,a,o,c,.95,.85,.95);for(let l of[-1,1])fe(t,"box",14794116,a+l*.35,o,c+.49,.075,.75,.03)}else if(e.type==="pothole"){fe(t,"cylinder",7498594,0,.027,0,1.35,.035,1.7),fe(t,"cylinder",1583931,0,.05,0,1.1,.025,1.45),fe(t,"cylinder",3163735,0,.065,-.05,.75,.025,1.1,.18,.25);for(let a of[-1.15,1.15])fe(t,"box",15252591,a,.08,.9,.22,.1,.25)}else if(e.type==="barrels")for(let[a,o]of[[-.6,.3],[.6,-.3]]){fe(t,"cylinder",12088143,a,.62,o,.46,1.2,.46);for(let c of[.28,.87])fe(t,"cylinder",14995120,a,c,o,.475,.12,.475)}else if(e.type==="fallen_branch"){let a=fe(t,"cylinder",8414799,0,.4,0,.3,2.65,.3);a.rotation.z=Math.PI/2;let o=fe(t,"cylinder",10123609,.4,.58,-.35,.15,1.65,.15);o.rotation.z=.9,o.rotation.x=.5,fe(t,"sphere",5406054,-.65,.72,-.5,.65,.43,.6),fe(t,"sphere",7051127,.65,.9,-.5,.8,.5,.7)}else if(e.type==="tire_stack"){for(let[a,o,c]of[[-.5,.2,2],[.55,-.3,3]])for(let l=0;l<c;l++)fe(t,"cylinder",2306885,a,.2+l*.34,o,.48,.3,.48,.95),fe(t,"cylinder",4741480,a,.36+l*.34,o,.23,.025,.23,.6,.3);fe(t,"box",16241034,0,.5,.73,.36,.13,.04)}else if(e.type==="road_panels"){fe(t,"box",9991256,0,.12,0,2.1,.22,1.9);for(let a=0;a<3;a++){let o=fe(t,"box",a===2?8824494:6323853,0,.29+a*.16,a*.07,2.12,.13,1.7,.45,.35);o.rotation.y=a*.045}for(let a of[-.72,.72]){let o=fe(t,"box",16767370,a,.73,.12,.18,.03,1.65);o.rotation.y=.09}}else if(e.type==="rockfall"){for(let[a,o,c,l]of[[-.55,.48,.15,.65],[.52,.6,-.3,.72],[.05,.28,.85,.4]])fe(t,"rock",10594477,a,o,c,l,l*.85,l).rotation.set(.25+a,.4+o,.3);for(let a of[-.95,.95])fe(t,"box",15641970,a,.18,.9,.19,.36,.18),fe(t,"box",16769953,a,.28,1,.19,.1,.025)}else{fe(t,"box",16764786,0,.85,0,2.6,.75,.4);for(let a of[-.9,0,.9]){let o=fe(t,"box",2373963,a,.85,.22,.3,.76,.025);o.rotation.z=.25}for(let a of[-.9,.9])fe(t,"box",6520462,a,.3,0,.2,.6,.6)}t.updateMatrixWorld(!0);let n=new Bt;t.traverse(a=>{if(a.isMesh){let o=a.geometry.clone().applyMatrix4(a.matrixWorld);n.add("o",o,a.material.color.getHex()),o.dispose()}});let s=new ve(n.merge("o"),W1);s.castShadow=!0,s.receiveShadow=!0,s.userData.ownGeometry=!0;let r=new Ge;return r.add(s),r}syncTraffic(e){if(this.trafficState!==e&&(this.traffic.forEach(t=>{t.userData.contactShadow&&this.scene.remove(t.userData.contactShadow),this.scene.remove(t),t.traverse(n=>{n.isMesh&&n.userData.ownGeometry&&n.geometry.dispose()})}),this.traffic=[],this.trafficState=e,!!e))for(let t of e.obstacles){let n=this.makeObstacle(t);n.userData.obstacle=t,this.scene.add(n),t.type==="traffic"&&this.addContactShadow(n),this.traffic.push(n)}}updateAtmosphere(e,t,n,s,r){let a=this.preferences.reduced,o=this.preferences.graphics==="battery";for(let c of this.landmarks||[]){let l=c.at-n,h=l>-90&&l<620;if(c.group.visible=h,!h)continue;let u=c.overRoad?0:c.side*(this.sceneryEdge(c.at,c.side)+c.offset);if(c.group.position.set(this.curve(c.at)-s+u,0,-l+4),c.group.rotation.y=c.overRoad?-Math.atan((this.curve(c.at+1)-this.curve(c.at-1))/2):c.side*.35,!r&&!a)for(let[f,d]of c.rotors.entries())d.rotation.z+=t*(.9+f*.15)}if(!r)for(let c of this.clouds||[])c.position.x+=t*c.userData.drift,c.position.x>340&&(c.position.x=-340);if(this.rain){let c=a?0:o?110:320;if(this.rain.visible=c>0,this.rain.count=c,c&&!r){let l=this.rainMatrix||=new bt,h=t*24,u=t*(8+(this.motion?.lastSpeed||0)*.6);for(let f=0;f<c;f++){let d=this.rain.userData.drops[f];d[1]-=h*d[3],d[2]+=u,(d[1]<-.5||d[2]>6)&&(d[1]=16+Math.random()*4,d[2]=-60+Math.random()*20,d[0]=(Math.random()-.5)*44),l.position.set(d[0],d[1],d[2]),l.rotation.x=-.18,l.updateMatrix(),this.rain.setMatrixAt(f,l.matrix)}this.rain.instanceMatrix.needsUpdate=!0}}}update(e,t,n="home"){let s=e*(t?.worldTimeScale??1);this.clock=(this.clock||0)+e,(!t||!["paused","finished","failed","countdown"].includes(t.status))&&(this.elapsed+=s),this.syncTraffic(t),this.syncRivals(t),this.prepareCourse(t);let r=!!t,a=r?t.distance:this.showcaseDistance+=e*6,o=this.curve(a)+window.RallyCore.routeOffset(t?.route,a),c=Math.floor(a/20)-3,l=this.segments.length;for(let $=0;$<l;$++){let Z=c+(($-c)%l+l)%l,Re=Z*20+10,nt=Re-a,Xe=this.segments[$];Xe.userData.courseIndex=Z,Xe.position.set(this.curve(Re)-o,0,-nt+4),Xe.rotation.y=-Math.atan((this.curve(Re+10)-this.curve(Re-10))/20),Xe.userData.curveIndex!==Z&&(Xe.userData.curveIndex=Z,this.rebuildChunk(Xe,Z,Re))}let h=t&&["paused","finished","failed","countdown"].includes(t.status);this.updateAtmosphere(e,s,a,o,h),this.spectators.update(s,t,this.index,a,o,$=>this.curve($),this.preferences,h);for(let $ of this.rivalCars){let Z=$.userData.rival,Re=Z.at-a;if($.visible=Re>-60&&Re<330,$.position.set(this.curve(Z.at)+window.RallyCore.routeOffset(Z.route,Z.at)-o+Z.lanePos*3.35+(Z.passingOffset||0),0,-Re+4),$.rotation.y=this.heading(Z.at,Z.route)-Tt.clamp((Z.lane-Z.lanePos)*.16,-.16,.16),$.position.y+=this.bridgeHop(t,Z.at),Z.route?.coaster){let Xe=t.tasks.find(ne=>ne.id===Z.route.taskId),et=Xe&&window.RallyCore.makeRoute(t,Xe,Xe.correctIndex,!0,!0);$.position.x+=et?window.RallyCore.routeOffset(et,Z.at)-window.RallyCore.routeOffset(Z.route,Z.at):0;let Q=this.ridePose(Z.route,Z.at,Z.passingOffset||0,a,o,{position:$.position.clone(),quaternion:$.quaternion.clone()});Q&&($.position.copy(Q.position),$.quaternion.copy(Q.quaternion))}h||($.userData.wheelAngle=(($.userData.wheelAngle||0)+Math.max(0,Z.at-($.userData.previousAt??Z.at))/.43)%(Math.PI*2),$.userData.previousAt=Z.at),this.animateCar($,$.userData.wheelAngle||0,-(Z.lane-Z.lanePos)*.28,Z.braking),$.userData.nitroExhaust.visible=!!Z.nitroActive&&!h,this.placeContactShadow($);let nt=Math.sign((Z.plannedLane??Z.lane)-Z.lanePos);for(let Xe of $.userData.indicators||[])Xe.visible=nt!==0&&(Z.plannedLane!=null||Math.abs(Z.lane-Z.lanePos)>.05)&&Xe.userData.indicator===nt&&Math.floor((t.elapsed||0)*3)%2===0}for(let $ of this.traffic){let Z=$.userData.obstacle,Re=Z.at-a;$.visible=!Z.dormant&&Re>-50&&Re<360,$.position.set(window.RallyCore.actorX(t,Z)-o,0,-Re+4);let nt=Z.changed&&Z.laneProgress<1,Xe=nt?Tt.clamp(-(Z.target-Z.fromLane)*Math.sin(Z.laneProgress*Math.PI)*.12,-.16,.16):0;$.rotation.y=this.heading(Z.at,Z.route)+Xe,($.userData.indicators||[]).forEach(et=>{et.visible=(Z.moving||Z.routeChanging)&&nt&&et.userData.indicator===Math.sign(Z.target-Z.fromLane)&&Math.floor((t?.elapsed||0)*3)%2===0}),$.rotation.z=Z.hit&&t.elapsed-(Z.hitAt??0)<.45?Math.sin(t.elapsed*18)*.08:0,h||($.userData.wheelAngle=(($.userData.wheelAngle||0)+Math.max(0,Z.at-($.userData.previousAt??Z.at))/.43)%(Math.PI*2),$.userData.previousAt=Z.at),this.animateCar($,$.userData.wheelAngle||0,Xe,Z.braking||Z.waiting),this.placeContactShadow($)}this.updateGates(t,a,o,s),this.motionState!==t&&(this.motionState=t,this.motion=Fp(this.currentLane,t?.roadTravel??a));let u=t?t.arena.speed*t.speedFactor*(t.worldTimeScale??1):6;t?.focusAuto&&(this.motion.lastSpeed=u);let f=this.motion.lane;if(Op(this.motion,t?.lane||0,t?.roadTravel||a,u,t?.focusAuto&&["light","junction"].includes(t.task?.kind)?e:s,h),t&&!h&&!window.RallyCore.playerLaneClear(t,f,this.motion.lane)){let $=window.RallyCore.playerLaneBlocker(t,f,this.motion.lane);this.motion.lane=f,this.motion.velocity=0,this.motion.steer=0,window.RallyCore.contactBump(t,$)}this.currentLane=this.motion.lane;let d=this.currentLane*3.35,p=n==="home"&&this.viewport.width<760&&this.viewport.height>this.viewport.width?-9:4,x=this.ridePose(t?.route,a,0,a,o,null);this.lastRide&&!x&&(this.landedAt=this.clock),this.lastRide=!!x;let g=this.landedAt!=null&&!this.preferences.reduced?this.clock-this.landedAt:1/0,m=g<1.2?-.11*Math.exp(-g*4.5)*Math.sin(g*15):0,b=this.bridgeHop(t,a);b>.05&&!this.hopping&&this.onCue?.("hop"),this.hopping=b>.05,this.player.position.set(d,.04+m+b+(this.preferences.reduced?0:this.motion.bob),p),this.player.rotation.set(this.preferences.reduced?0:this.motion.pitch,this.heading(a,t?.route)+this.motion.steer*.22,this.preferences.reduced?0:this.motion.roll),x&&(this.player.position.copy(x.position),this.player.quaternion.copy(x.quaternion));let S=x?x.position.y:b;this.rideSpeed=x?x.speed:1,this.animateCar(this.player,this.motion.wheelAngle,this.motion.steer,this.motion.braking||!!t?.yielding&&u<.5),this.player.visible=!0,this.shadow.position.set(x?x.position.x:d,.07+S,x?x.position.z:p),this.shadow.visible=!x||x.up[1]>.8,this.shadow.rotation.z=-this.player.rotation.y,this.nitroReadyGlow.position.set(x?x.position.x:d,.08+S,x?x.position.z:p),this.nitroReadyGlow.rotation.z=-this.player.rotation.y,this.nitroReadyGlow.visible=!h&&!t?.nitroActive&&window.RallyCore.canEngageNitro(t),this.nitroReadyGlow.scale.setScalar(this.preferences.reduced?1:1+Math.sin(this.elapsed*3)*.025),this.damageFx.update(e,t,this.preferences,h),this.boostFx.update(s,t,this.preferences,h),this.waterNormal&&!h&&!this.preferences.reduced&&this.waterNormal.offset.set(this.elapsed*.009,this.elapsed*.005),this.trail.children.forEach(($,Z)=>{$.visible=!!t&&!h&&!this.preferences.reduced&&this.preferences.graphics!=="battery"&&(this.lookConfig.trail||t.nitroActive)&&u>2,$.position.set(d+(Z%2?1:-1)*.64,.08+S,p+3+Z*.45),$.material=Rn(t?.nitroActive?9035263:8440760,.5,0,t?.nitroActive?2529481:3570791),$.scale.z=1-Z/16});let v=t&&["paused","finished","failed"].includes(t.status),I=this.viewport.width<760&&this.viewport.height>this.viewport.width,y=n==="home",w=y?I?2:-5:t?.status==="task"?d*.7:d*.35,A=y?I?9:4.4:t?.status==="task"?7.2:6.2,M=y?I?16:20:t?.status==="task"?17:16;!y&&!this.preferences.reduced&&t?.status!=="task"&&(M+=Math.min(2.4,Math.max(0,t.speedFactor-1)*.9)),this.rideCam??=new U(0,0,4);let _=x?x.position:new U(d,0,p);for(let $ of["x","y","z"])this.rideCam[$]=Tt.damp(this.rideCam[$],_[$],$==="y"?7:5,e);this.rideWide=Tt.damp(this.rideWide||0,x?.wide||0,3.5,e);let P=this.rideWide;this.rideSide=x?x.side:this.rideSide||1,x?.kind&&(this.rideKind=x.kind);let D=this.rideKind==="helix",F=this.rideKind==="air";if(this.rideLift=this.rideCam.y,A+=this.rideLift+(D?9:F?1.5:4.5)*P,M+=(this.rideCam.z-p)*.55*(1-P)+(D?8:F?-2:4)*P,w+=(this.rideCam.x-d)*.6+this.rideSide*(D?-4:F?-15:13)*P,x&&!this.preferences.reduced&&(M+=1.4+Math.min(2.2,Math.max(0,this.rideSpeed-1)*1.6),A+=.6),!y&&!this.preferences.reduced&&t?.status!=="task"&&(A-=.45*this.boostFx.intensity,M+=.9*this.boostFx.intensity),!y&&t?.status!=="task"){let $=Tt.clamp((.95-this.viewport.width/this.viewport.height)/.5,0,1);M+=6.5*$,A+=2.4*$}v||(this.camera.position.x=Tt.damp(this.camera.position.x,w,4,e),this.camera.position.y=Tt.damp(this.camera.position.y,A,4,e),this.camera.position.z=Tt.damp(this.camera.position.z,M,4,e)),this.shake>0&&(this.shake=Math.max(0,this.shake-e*1.6),!this.preferences.reduced&&!v&&(this.camera.position.x+=(Math.random()-.5)*this.shake*.5,this.camera.position.y+=(Math.random()-.5)*this.shake*.4));let k=Math.max(24,Math.min(52,2*Math.atan(this.viewport.height*3.35/(54*Math.min(140,(this.viewport.width-24)/3)))*180/Math.PI));v||(this.camera.fov=Tt.damp(this.camera.fov,t?.status==="task"?k:r?52+(this.preferences.reduced?0:Math.min(12,Math.max(0,t.speedFactor-1)*5.4)+(x?Tt.clamp((this.rideSpeed-1)*10,0,13):0)):52,t?.nitroActive?9:4,e)),this.camera.updateProjectionMatrix();let G=Math.atan2(this.camera.position.y-this.rideLift-.8,Math.max(1,this.camera.position.z-4))-Math.atan(.58*Math.tan(this.camera.fov*Math.PI/360)),V=this.camera.position.y-Math.tan(G)*(this.camera.position.z+11);if(!v){let $=this.preferences.reduced?0:Tt.clamp(-this.heading(a+10,t?.route)*6,-2.2,2.2),Z=y?0:(this.rideCam.x-d)*.85;if(this.look.set(y?I?-1.8:-6.5:t?.status==="task"?d*.65:d*.25+$+Z,y?I?-1:-.5:V+(x&&!this.preferences.reduced?Tt.clamp(x.forward[1]*7,-4,6):0),y?I?-9:-6:-11+(this.rideCam.z-p)*.8),!y&&P>.001){let Re=x?x.position:this.rideCam;this.look.lerp(new U(Re.x,Re.y+1,Re.z),P)}this.camera.lookAt(this.look)}let ee=this.arenaLook,W=Tt.clamp(t?.focusAmount||0,0,1),ce=this.preferences.reduced?0:this.boostFx.intensity;this.sun.intensity=ee.sunIntensity*(1-.2*W),this.hemi.intensity=ee.hemi*(1-.08*W),this.renderer.toneMappingExposure=ee.exposure*(1-.07*W)+ce*.05,this.scene.fog.color.setHex(ee.fog).lerp(this.focusTint,.24*W),this.updateRoadBoards(t,o),this.renderer.render(this.scene,this.camera)}};function mm(i){return String(i).toLowerCase().replace(/\b[a-z]/g,e=>e.toUpperCase()).replace(/\bTv\b/g,"TV")}function gm(i,e,t,n){let s=Math.max(1,...String(i).trim().split(/\s+/u).map(n));return Math.max(.1,Math.floor(Math.min(t,t*Math.max(1,e-2)/s)*10)/10)}function xm(i,{width:e,top:t,bottom:n}){let s=[];for(let r of[...i].sort((a,o)=>Math.abs(a.distance)-Math.abs(o.distance)))!r.visible||Math.abs(r.distance)>150||r.x<42||r.x>e-42||r.y<t+30||r.y>n-16||s.some(a=>Math.abs(a.x-r.x)<82&&Math.abs(a.y-r.y)<32)||s.push(r);return s.map(r=>r.id)}function ym(i,e){let n=(i-24)/3,s=e.map(u=>u.x),r=s[1],a=Math.min(Math.abs(s[1]-s[0]),Math.abs(s[2]-s[1])),o=Math.min(n,Math.max(Math.min(100,n),a)),c=Math.min(34,Math.max(24,o*.28)),l=Math.min(168,Math.max(1,o-c)),h=Math.max(12+o+l/2,Math.min(i-12-o-l/2,r));return[0,1,2].map(u=>({x:h+(u-1)*o,width:l,gap:c,cellLeft:h+(u-1.5)*o,cellRight:h+(u-.5)*o}))}function K1(i,e,t){let n=0,s=1;for(let[r,a,o,c]of[[i.x,e.x-i.x,t.left,t.right],[i.y,e.y-i.y,t.top,t.bottom]])if(Math.abs(a)<1e-8){if(r<o||r>c)return null}else{let l=(o-r)/a,h=(c-r)/a;if(l>h&&([l,h]=[h,l]),n=Math.max(n,l),s=Math.min(s,h),n>s)return null}return n}function vm(i,e,t,n=[]){return t.map(s=>({id:s.id,t:K1(i,e,s)})).filter(s=>s.t!==null&&!n.includes(s.id)).sort((s,r)=>s.t-r.t).map(s=>s.id)}function _m({hudBottom:i,promptHeight:e,answerHeight:t,promptY:n,answerY:s,controlsTop:r,repair:a=!1,landscape:o=!1,viewportHeight:c=1/0}){let l=o?8:12,h=i+l,u=r-12,f=Math.min(u+(o?56:0),c-12),d=Math.max(0,u-h-e-l-t),p=a?Math.min(80,d):0,x=o?0:p,m=h+e/2,b=m+e/2+l+t/2,S=u-x-t/2,v=Math.max(b,Math.min(s,Math.max(b,S)));return a&&o&&(p=Math.min(80,Math.max(0,f-v-t/2))),{py:m,ay:v,stagger:p,bottom:u,centerBottom:f}}var Ts=["boulevard","coast","storm"],Tc=i=>i==="standard"?"challenge":i,Hu=[{id:"gold",name:"Sunrise Gold",color:15973461,tier:0},{id:"lagoon",name:"Lagoon Pearl",color:5618094,tier:1},{id:"ruby",name:"Ember Ruby",color:13066354,tier:2},{id:"midnight",name:"Midnight Violet",color:7959477,tier:3}];function bm(i){i.difficulty==="standard"&&(i.difficulty="challenge"),i.progress=i.progress&&typeof i.progress=="object"?i.progress:{};for(let t of Object.keys(i.progress))if(t.endsWith(":standard")){let n=t.slice(0,-9)+":challenge",s=i.progress[t],r=i.progress[n];i.progress[n]=[0,1,2].map(a=>Math.max(0,Math.min(3,Number(s?.[a])||0),Math.min(3,Number(r?.[a])||0))),delete i.progress[t]}i.teamId=an(i.teamId)?.id||null;let e={};for(let[t,n]of Object.entries(i.arenaWins||{})){let s=t.endsWith(":standard")?t.slice(0,-9)+":challenge":t;e[s]=Ts.map((r,a)=>e[s]?.[a]===!0||n?.[a]===!0)}for(let t of Array.isArray(i.ulti?.receipts)?i.ulti.receipts:[]){if(!t||t.sourceGame!=="wordshift-rally"||!an(t.teamId))continue;let n=Ts.indexOf(t.arenaId),s=Tc(t.difficulty);if(n<0||!["relaxed","challenge"].includes(s)||typeof t.unitId!="string"||!t.unitId)continue;let r=t.unitId+":"+s;(e[r]||=Ts.map(()=>!1))[n]=!0}return i.arenaWins=e,xd(i),i.fuel=Number.isFinite(i.fuel)?Math.max(0,Math.min(100,i.fuel)):0,i.mastery=i.mastery&&typeof i.mastery=="object"?i.mastery:{},i.reviewQueue=i.reviewQueue&&typeof i.reviewQueue=="object"?i.reviewQueue:{},i.look={paint:"gold",badge:0,trail:!1,...i.look},i}function qa(i,e,t,n){return Number.isInteger(n)&&n>=0&&n<Ts.length&&Ts.slice(0,n).every((s,r)=>i.arenaWins?.[e+":"+Tc(t)]?.[r]===!0)}function Mm(i,e,t){if(!Br(e)||e.reviewLap||t!==1||!Number.isInteger(e.arenaIndex)||e.arenaIndex<0||e.arenaIndex>=Ts.length||typeof e.unit?.id!="string"||!["relaxed","challenge"].includes(Tc(e.difficulty)))return!1;let n=e.unit.id+":"+Tc(e.difficulty);i.arenaWins||={};let s=i.arenaWins[n]||=Ts.map(()=>!1),r=s[e.arenaIndex]!==!0;return s[e.arenaIndex]=!0,r}function zu(i,e){return i.mastery[e]||={seen:{},clean:{},total:0,firstTry:0,arenas:0,tier:0}}function Sm(i,e,t){let n=zu(i,e);for(let s of t)n.seen[s.key]=!0,n.total++,s.firstTry&&(n.firstTry++,n.clean[s.key]=!0);return wm(n)}function Em(i,e,t){let n=zu(i,e);return n.arenas|=1<<t,wm(n)}function wm(i){let e=i.tier,t=Object.keys(i.clean).length,n=i.total?i.firstTry/i.total:0,s=[0,1,2].filter(r=>i.arenas&1<<r).length;return n>=.9&&(t>=6&&s>=1&&(i.tier=Math.max(i.tier,1)),t>=12&&s>=2&&(i.tier=Math.max(i.tier,2)),t>=18&&s===3&&(i.tier=3)),i.tier>e?i.tier:0}function Ac(i,e){let t=zu(i,e);return{unique:Object.keys(t.clean).length,accuracy:t.total?Math.round(t.firstTry/t.total*100):0,arenas:[0,1,2].filter(n=>t.arenas&1<<n).length,tier:t.tier}}function Rc(i){return Math.max(0,...Object.values(i.mastery).map(e=>e.tier||0))}function Gu(i,e,t){let n=Rc(i);if(e==="paint"){let s=Hu.find(r=>r.id===t);if(!s||s.tier>n)return!1;i.look.paint=t}else if(e==="badge"){if(!Number.isInteger(t)||t<0||t>n)return!1;i.look.badge=t}else if(e==="trail"){if(t&&n<3)return!1;i.look.trail=!!t}else return!1;return!0}function As(i){let e=Rc(i),t=Hu.find(n=>n.id===i.look.paint&&n.tier<=e)||Hu[0];return{color:an(i.teamId)?.color??t.color,teamId:an(i.teamId)?.id??null,paint:t.id,badge:Math.min(e,Math.max(0,Number(i.look.badge)||0)),trail:!!i.look.trail&&e>=3}}var se=window.RallyCore,C=i=>document.getElementById(i),$i=window.LANGUAGE_BANK,Dr=i=>`<span class="modal-host" aria-hidden="true"><img src="img/saymaz-${i}.png" alt="" draggable="false"></span>`,St=i=>String(i).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]);function J1(i){let e=i?.closest?i:i?.parentElement;return["input","textarea","select",'[contenteditable="true"]','[contenteditable="plaintext-only"]'].some(t=>e?.closest?.(t))}for(let i of["selectstart","dragstart","contextmenu"])C("app").addEventListener(i,e=>{J1(e.target)||e.preventDefault()},{capture:!0});function Om(){let i=window.getSelection?.();i?.rangeCount&&i.removeAllRanges()}var km="wordshift-rally.v1",Y={grade:5,unit:"g5u1",difficulty:"relaxed",sound:!1,progress:{},tutorial:!1},Ju=!0;try{let i=localStorage.getItem(km);i&&(Y={...Y,...JSON.parse(i)})}catch{Ju=!1}$i.some(i=>i.grade===Y.grade)||(Y.grade=5);(!Y.progress||typeof Y.progress!="object")&&(Y.progress={});bm(Y);if(!Y.tutorial||typeof Y.tutorial!="object"){let i=!!Y.crosswalkTutorial;Y.tutorial={done:i,drive:i,steer:i,nitro:i}}if(!Y.tutorial.tasks||typeof Y.tutorial.tasks!="object"){let i=!!(Y.tutorial.drive&&Y.tutorial.steer&&Y.tutorial.nitro);Y.tutorial.tasks=Object.fromEntries(th.map(e=>[e,i]))}se.DIFFICULTIES[Y.difficulty]||(Y.difficulty="relaxed");var jt=0,T=null,ft,Ns="home",$a="",Uc="",Bc=null,Xi=0,Bm=null,Is=!1,qu=0,Cs=0,qi=()=>$i.find(i=>i.grade===Y.grade).units.find(i=>i.id===Y.unit)||$i.find(i=>i.grade===Y.grade).units[0],Hm=()=>Y.unit+":"+Y.difficulty,j1=()=>Y.progress[Hm()]||[0,0,0],Cc=i=>qa(Y,Y.unit,Y.difficulty,i),Tm=i=>se.ARENAS.find((e,t)=>t<i&&!Y.arenaWins[Hm()]?.[t])?.name;function xn(){try{localStorage.setItem(km,JSON.stringify(Y))}catch{Ju=!1}}var Oe=new so(()=>Y.sound),zm=window.matchMedia("(prefers-reduced-motion: reduce)"),Nc=window.matchMedia("(pointer: coarse)"),ju=new URLSearchParams(globalThis.location?.search||"").get("touch")==="1",It=ju||Nc.matches||navigator.maxTouchPoints>0&&!window.matchMedia("(hover: hover)").matches,$u=0,Ic=null,Yi=null,Ya=0,pn=null,Ls=()=>yd(Y.preferences,zm.matches),Ja=!0,Gm=0,Vu,Am=new WeakMap,Za={hudBottom:155,controlsTop:innerHeight-90,promptHeight:60,answerHeight:80},Pc=typeof ResizeObserver=="function"?new ResizeObserver(()=>{Ja=!0}):null;function Fs(){Ja=!0,Gm++}var Yu=i=>`emoji/${i}.webp`,Q1=i=>{if(typeof Image=="function")for(let e of i?.tasks||[])for(let t of[e.image,...e.optionImages||[]])t&&(new Image().src=Yu(t))},Rm=i=>String(i).split(/(\s+)/u).map(e=>/^\s*$/u.test(e)?St(e):`<span class="sign-word">${St(e)}</span>`).join("");function Cm(i,e,t){let n=Gm+"|"+t.toFixed(1)+"|"+e.textContent;if(Am.get(e)===n)return;Vu??=document.createElement("canvas").getContext("2d");let s=getComputedStyle(i),r=parseFloat(s.fontSize),a=["paddingLeft","paddingRight","borderLeftWidth","borderRightWidth"].reduce((c,l)=>c+(parseFloat(s[l])||0),0);Vu.font=`${s.fontWeight} ${r}px ${s.fontFamily}`;let o=gm(e.textContent,t-a,r,c=>Vu.measureText(c).width);ci(e,"fontSize",o+"px"),Am.set(e,n),Ja=!0}document.fonts?.ready.then(Fs);for(let i of["app","hud","controls","road-prompt"])Pc?.observe(C(i));function ja(i){i=ju||!!i;let e=It!==i;It=i,document.body.classList.toggle("touch-controls",It),C("controls").setAttribute("aria-hidden",String(It)),It&&(C("controls").hidden=!0),C("touch-nitro").hidden=!It||!T||!["driving","task","resolving"].includes(T.status),e&&Fs()}Nc.addEventListener?.("change",()=>ja(Nc.matches));document.addEventListener("pointerdown",i=>{i.pointerType==="touch"||i.pointerType==="pen"?ja(!0):i.pointerType==="mouse"&&!Nc.matches&&ja(!1)},{capture:!0});function Hc(){let i=window.visualViewport;if(i&&Math.abs((i.scale||1)-1)>.01)return;let e=i?.height||innerHeight,t=i?.width||innerWidth;e>0&&Number.isFinite(e)&&document.documentElement.style.setProperty("--play-height",e+"px"),document.body.classList.toggle("short-viewport",t<=760&&e<640&&e>=t),document.body.classList.toggle("compact-landscape",t>e&&e<=300),ja(It),ft?.resize(),Fs()}window.addEventListener("resize",Hc);window.addEventListener("pageshow",Hc);window.visualViewport?.addEventListener("resize",Hc);Hc();function ci(i,e,t){i.style[e]!==t&&(i.style[e]=t)}function Qe(i,e){let t=C(i),n=String(e);t.textContent!==n&&(t.textContent=n,["road-question","road-feedback","road-kicker"].includes(i)&&Fs())}function Vm(){if(Ja){Ja=!1;let i=[...C("road-answers").querySelectorAll("button")],e=window.visualViewport,t=e?.width||innerWidth,n=e?.height||innerHeight;Za={hudBottom:C("hud").getBoundingClientRect().bottom,controlsTop:It?bd(t,n):C("controls").getBoundingClientRect().top,promptHeight:C("road-prompt").offsetHeight,answerHeight:Math.max(56,...i.map(s=>s.offsetHeight))},document.body.style.setProperty("--hud-bottom",Za.hudBottom+"px")}return Za}function Qu(){let i=Ls();document.body.classList.toggle("reduced-motion",i.reduced),ft?.setPreferences(i)}zm.addEventListener?.("change",Qu);function mn(i){if(!(!Ls().haptics||!window.matchMedia("(pointer: coarse)").matches))try{navigator.vibrate?.({click:8,correct:[12,30,18],wrong:[30,40,30],collision:45,go:[15,25,25],finish:[20,50,30,50,50]}[i]||8)}catch{}}function Wm(){let i=!!T&&se.pause(T),e=()=>{let t=Ls();Pi(`<span class="modal-kicker">MAKE IT YOUR DRIVE</span><h2 id="modal-title">Driver settings.</h2><p>Comfort, sound and performance. Your choices are saved on this device.</p><div class="setting-row"><div><strong>Sound</strong><small>Engine, road and answer cues</small></div><button class="setting-toggle" id="setting-sound" aria-pressed="${Y.sound}">${Y.sound?"ON":"OFF"}</button></div><div class="setting-row"><div><strong>Vibration</strong><small>Light feedback on supported phones</small></div><button class="setting-toggle" id="setting-haptics" aria-pressed="${t.haptics}">${t.haptics?"ON":"OFF"}</button></div><label class="setting-label" for="setting-graphics">GRAPHICS</label><select id="setting-graphics"><option value="auto">Auto \xB7 adapts to your device</option><option value="high">High \xB7 sharper picture</option><option value="battery">Battery saver \xB7 lighter rendering</option></select><label class="setting-label" for="setting-motion">MOTION</label><select id="setting-motion"><option value="system">Follow device settings</option><option value="full">Full \xB7 camera and effects</option><option value="reduced">Reduced \xB7 steady camera, fewer effects</option></select><p class="save-note">Auto lowers rendering resolution if frame times stay high. Battery saver reduces shadows and effects.</p><button class="primary" id="settings-done">${i?"BACK TO THE RACE":"DONE"} \u2197</button>`),C("setting-graphics").value=t.graphics,C("setting-motion").value=t.motion;let n=(s,r)=>{Y.preferences={...Ls(),[s]:r},xn(),Qu()};C("setting-sound").onclick=()=>{Y.sound=!Y.sound,Oe.unlock(),zc(),xn(),e()},C("setting-haptics").onclick=()=>{n("haptics",!t.haptics),mn("click"),e()},C("setting-graphics").onchange=s=>n("graphics",s.target.value),C("setting-motion").onchange=s=>n("motion",s.target.value),C("settings-done").onclick=()=>{Nn(),i&&se.resume(T),C("settings").focus()}};e()}function eb(){let i=C("celebration");i.hidden=!1,i.innerHTML=Ls().reduced?"":Array.from({length:30},(e,t)=>`<i style="--x:${t*37%100}%;--delay:${t%7*.09}s;--turn:${t*47}deg;--colour:${["#fbd477","#83decc","#fff4d6"][t%3]}"></i>`).join(""),document.body.classList.add("race-finished"),mn("finish")}function zc(){C("sound").classList.toggle("off",!Y.sound),C("sound").setAttribute("aria-pressed",String(Y.sound)),C("sound").setAttribute("aria-label",Y.sound?"Mute sound":"Enable sound")}function Rs(i,e=!1,t=null){if(T&&["task","resolving"].includes(T.status)){Qe("road-feedback",i),C("road-feedback").classList.toggle("bad",e),Ya=performance.now()+1600;return}(!pn||e||!pn.bad)&&(pn={text:i,bad:e,valid:t,expiresAt:performance.now()+5e3})}function Im(i,e){if(pn&&(pn.expiresAt<i||pn.valid&&!pn.valid())&&(pn=null),!e.announcementsAllowed){C("toast").classList.remove("visible"),Xi=0;return}if(pn&&i>=Xi){let t=pn;pn=null,C("toast").textContent=t.text,C("toast").className="visible"+(t.bad?" bad":""),Xi=i+1500}i>Xi&&C("toast").classList.remove("visible")}function tb(i){let e=["#83c6dc","#63ced3","#4b5c89"][i],t=["#76a88c","#3c98a3","#455d77"][i];return`<svg viewBox="0 0 150 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="150" height="100" fill="${e}"/><circle cx="119" cy="22" r="10" fill="${i===2?"#d5d5dc":"#ffe4a3"}"/><path d="M0 65h150v35H0Z" fill="${t}"/>${i===0?'<path fill="#d2d7bc" d="M6 70V39h16v31h8V28h19v42h24V44h20v26h12V22h19v48Z"/><path fill="#64897d" d="M0 73 35 55 66 70 101 51 150 70v30H0Z"/>':i===1?'<path d="M0 75q15-7 30 0t30 0t30 0t30 0t30 0" fill="none" stroke="#a4e6da" stroke-width="2"/><path d="M13 68V30m116 38V30M13 36q57 42 116 0M13 30l57 38 59-38" stroke="#dce9d9" stroke-width="3" fill="none"/>':'<path fill="#899aab" d="m0 72 37-50 30 38 28-48 55 62v26H0Z"/><path fill="#bfcbd2" d="m22 42 15-20 15 19-14-4Zm57-6 16-24 19 24-19-6Z"/><path fill="#415a72" d="m0 92 40-35 33 34 33-28 44 30v7H0Z"/>'}<path fill="#2c475b" d="m68 54 14 0 39 46H30Z"/><path d="m74 59-2 9m-1 7-5 15" fill="none" stroke="#fff0bd" stroke-width="2"/><path d="M0 94h150v6H0Z" fill="#102e48" opacity=".5"/></svg>`}function Os(){Ym(),Y.unit=qi().id,document.querySelectorAll("[data-team]").forEach(t=>{let n=t.dataset.team===Y.teamId;t.classList.toggle("selected",n),t.setAttribute("aria-pressed",String(n))}),C("start").disabled=!an(Y.teamId),C("start").querySelector("span").textContent=Y.teamId?"START YOUR ENGINE":"CHOOSE YOUR TEAM",Qa(),Qe("lesson-grade",Y.grade),Qe("lesson-meta",`GRADE ${Y.grade} ${zr[Y.grade]} \xB7 UNIT ${$i.find(t=>t.grade===Y.grade).units.indexOf(qi())+1}`),Qe("lesson-unit",qi().title),C("lesson-picker").setAttribute("aria-label",`Choose your lesson: Grade ${Y.grade} ${zr[Y.grade]}, ${qi().title}`),document.querySelectorAll("[data-diff]").forEach(t=>{t.classList.toggle("selected",t.dataset.diff===Y.difficulty),t.setAttribute("aria-pressed",String(t.dataset.diff===Y.difficulty))}),C("difficulty-note").textContent={relaxed:"More time. Real racing.",challenge:"Fast rivals. Race to win."}[Y.difficulty];let i=j1();Cc(jt)||(jt=0),C("total-stars").textContent=i.reduce((t,n)=>t+n,0)+" / 9 stars",C("arena-cards").innerHTML=se.ARENAS.map((t,n)=>{let s=!Cc(n);return`<button class="arena-card ${jt===n?"selected ":""}${s?"locked":""}" data-arena="${n}" style="--accent:${t.color}" aria-pressed="${jt===n}" aria-label="${St(t.name)}${s?", locked. Finish first in "+Tm(n)+" to unlock.":", "+i[n]+" stars"}"><span class="arena-number">${s?"LOCKED":String(n+1).padStart(2,"0")}</span><span class="arena-mini ${t.id==="coast"?"coast":t.id==="storm"?"storm":""}">${tb(n)}</span><strong>${St(t.name)}</strong><span class="stars">${s?"\u2014":"\u2605".repeat(i[n])+"\u2606".repeat(3-i[n])}</span></button>`}).join(""),C("arena-cards").querySelectorAll("button").forEach(t=>t.onclick=()=>{let n=+t.dataset.arena;if(!Cc(n)){Rs("Finish first in "+Tm(n)+" to unlock.");return}jt=n,Oe.tone("click"),Os()}),C("scene-name").textContent=se.ARENAS[jt].name.toUpperCase(),C("scene-name").nextElementSibling.textContent=String(jt+1).padStart(2,"0")+" / 03",document.documentElement.style.setProperty("--accent",se.ARENAS[jt].color),ft?.setup(jt),xn(),Qe("arena-length",(se.ARENAS[jt].length/1e3).toFixed(2)+" KM"),Qe("arena-checkpoints",se.ARENAS[jt].checkpoints+" CHECKPOINTS"),Qe("ride-name",an(Y.teamId)?.name.toUpperCase()||"CHOOSE A TEAM");let e=Ac(Y,Y.unit);C("mastery-preview").textContent=`UNIT MASTERY \xB7 ${e.unique} ITEMS \xB7 ${e.accuracy}% FIRST TRY${e.tier?" \xB7 "+["","EXPLORER","SCHOLAR","MASTER"][e.tier]:""}`,ft?.setCosmetics(As(Y))}function nb(){if(Ns!=="home")return;let i=Y.grade,e=Y.unit;Pi(`<div class="lessons-heading"><div><h2 id="modal-title">Lessons</h2><p id="lessons-intro">Choose your lesson</p></div><button id="lesson-close" class="lesson-close" aria-label="Close Lessons">\xD7</button></div><div class="lessons-grades-section"><span class="setting-label" id="grade-label">GRADE / LEVEL</span><div class="grades lesson-grades" role="group" aria-labelledby="grade-label">${$i.map(n=>`<button type="button" data-grade="${n.grade}" aria-label="Grade ${n.grade} ${zr[n.grade]}" aria-pressed="${n.grade===i}"><span>GRADE ${n.grade}</span><strong>${zr[n.grade]}</strong></button>`).join("")}</div></div><span class="setting-label" id="unit-label">THEME / UNIT</span><div id="unit" class="lesson-units" role="group" aria-labelledby="unit-label"></div><div class="lesson-confirm"><p id="lesson-preview" class="lesson-preview"></p><div class="modal-actions"><button id="lesson-cancel" class="secondary">CANCEL</button><button id="lesson-apply" class="primary">USE THIS LESSON \u2197</button></div></div>`),C("modal").classList.add("lessons-modal");let t=()=>{let n=$i.find(r=>r.grade===i).units;n.some(r=>r.id===e)||(e=n[0].id),document.querySelectorAll("[data-grade]").forEach(r=>{let a=+r.dataset.grade===i;r.classList.toggle("selected",a),r.setAttribute("aria-pressed",String(a))}),C("unit").innerHTML=n.map((r,a)=>`<button type="button" class="lesson-unit-option" data-unit="${r.id}" aria-label="Unit ${a+1}: ${St(r.title)}" aria-describedby="lesson-summary-${r.id}"><span class="unit-number" aria-hidden="true">${a+1}</span><span class="unit-copy"><strong class="unit-title">${St(r.title)}</strong><span id="lesson-summary-${r.id}" class="unit-summary">${St(Ed(r))}</span>${r.subthemes?.length?`<span class="unit-subthemes">Includes: ${r.subthemes.map(o=>St(o.title)).join(" \xB7 ")}</span>`:""}</span><span class="unit-check" aria-hidden="true">\u2713</span></button>`).join("");let s=()=>{C("unit").querySelectorAll("button").forEach(r=>{let a=r.dataset.unit===e;r.classList.toggle("selected",a),r.setAttribute("aria-pressed",String(a))}),C("lesson-preview").textContent=n.find(r=>r.id===e).title};C("unit").querySelectorAll("button").forEach(r=>r.onclick=()=>{e=r.dataset.unit,s()}),s()};document.querySelectorAll("[data-grade]").forEach(n=>n.onclick=()=>{i=+n.dataset.grade,e=$i.find(s=>s.grade===i).units[0].id,t()}),C("lesson-close").onclick=Nn,C("lesson-cancel").onclick=Nn,C("lesson-apply").onclick=()=>{Y.grade=i,Y.unit=e,jt=0,Nn(),Os()},t()}var $t=pd({api:ud(window.WORDRAMP_CONFIG)}),Xm=-1/0,Wu=!1,Pm=-1,qm=i=>i?.unit?.grade??(Number(String(i?.unit?.id||Y.unit).match(/^g(\d+)/)?.[1])||Y.grade);function $m(i){!$t.enabled||!i||i.reviewLap||i.leagueTicket||Wu||!an(i.teamId)||["finished","failed"].includes(i.status)||(Wu=!0,Xm=performance.now(),$t.start({runId:i.runId,grade:qm(i),team:i.teamId,arena:i.arenaIndex,pace:i.difficulty==="challenge"?"challenge":"relaxed",unit:i.unit.id}).then(e=>{e&&(i.leagueTicket=e)}).finally(()=>{Wu=!1}))}function ib(i,e,t){let n=t?.name||"your team";return i.state==="counted"?i.duplicate?{text:"This win was already counted in the English League.",good:!0}:i.points>0?{text:`+${i.points} Ulti for Grade ${e} ${n}!${i.reason==="team-limit"?` ${n} reached today's team limit, so this win counted ${i.points} of ${i.requested}.`:""}`,good:!0}:i.reason==="device-limit"?{text:"Today's Ulti wins on this phone are used. Tomorrow they count again."}:i.reason==="team-limit"?{text:`${n} reached today's Ulti limit for Grade ${e}. Tomorrow wins count again.`}:i.reason==="off"?{text:"Ulti points are switched off in the English League right now."}:{text:"This win added no Ulti points."}:i.state==="queued"?{text:"You're offline. This win will be sent to the English League when you're online."}:i.state==="refused"?{text:i.reason==="too-fast"?"That win was faster than the English League allows, so it did not count.":i.reason==="expired"?"This race ticket expired before it could be sent.":"The English League did not accept this win."}:i.state==="no-ticket"?{text:"This race could not reach the English League when it started, so it cannot count."}:null}function sb(i,e,t){let n=C("league-result"),s=ib(i,e,t);!n||!s||(n.textContent=s.text,n.classList.toggle("good",!!s.good),n.classList.remove("pending"))}function Ym(){if(!$t.enabled){C("league-button").hidden=!0;return}C("league-button").hidden=!1,Qe("league-label",`LEAGUE \xB7 GRADE ${Y.grade}`)}function rb(i){if(!i.known)return'<p class="save-note">The English League will show its Ulti rules here once it can be reached.</p>';if(!i.game)return'<p class="league-help">Ulti points are not switched on for this game yet.</p>';let e=t=>se.ARENAS.map((n,s)=>t?.[s]!=null?`${St(n.name)} +${t[s]}`:"").filter(Boolean).join(" \xB7 ");return`<p class="league-help">${e(i.game.points?.relaxed)}.</p><p class="league-help">On Challenge pace: ${e(i.game.points?.challenge)}.</p><p class="save-note">${i.game.deviceDailyWins?`Your first ${i.game.deviceDailyWins} wins each day count on this phone. `:""}Points last ${fd(i.hours)}. Your win also needs ${Math.round(kr*100)}% of tasks right first time on Relaxed, or ${Or} stars on Challenge.</p>`}function ab(i){return`<div class="league-teams">${i.teams.map(e=>{let t=an(e.id),n=Math.min(1,e.points/Math.max(1,i.capacity));return`<div class="league-team ${Y.teamId===e.id?"selected":""}" style="--team:${t.accent};--share:${(n*100).toFixed(1)}%"><span class="team-letter">${t.letter}</span><span class="league-name">${t.name}${Y.teamId===e.id?" \xB7 YOU":""}</span><span class="league-bar" aria-hidden="true"><i></i></span><strong>${Math.round(e.points)} / ${i.capacity}</strong><small>${dd(e.strength)}</small></div>`}).join("")}</div>`}function Zm(){if(!$t.enabled)return;let i=Y.grade,e=(n,s)=>{C("league-done")&&(C("league-body").innerHTML=`${ab(n)}${rb(n)}<p class="save-note">${s}</p>`)};Pi(`${Dr("cheer")}<span class="modal-kicker">ENGLISH LEAGUE \xB7 BATTLE ARENA</span><h2 id="modal-title">Ulti \xB7 Grade ${i}</h2><p>Arena wins add Ulti points to your grade's team pool in Mr. Saymaz's English League. Stronger teams hit harder in the Battle Arena.</p><div id="league-body"></div><button id="league-done" class="primary">BACK TO GARAGE</button>`),C("league-done").onclick=Nn;let t=$t.snapshot(i);e(t,t.updatedAt?"Updating\u2026":"Connecting to the English League\u2026"),$t.refresh(i).then(n=>e(n,n.online?"Live from the English League.":n.updatedAt?`Offline \xB7 last updated ${new Date(n.updatedAt).toLocaleString()}.`:"The English League cannot be reached right now."))}function Qa(){let i=document.querySelectorAll(".team-points");if(!$t.enabled){i.forEach(t=>{t.hidden=!0});return}let e=$t.snapshot(Y.grade);i.forEach(t=>{t.hidden=!e.updatedAt}),document.querySelectorAll("[data-ulti-total]").forEach(t=>{let n=String(Math.round(e.teams.find(s=>s.id===t.dataset.ultiTotal)?.points||0));t.textContent!==n&&(t.textContent=n)})}function Gc(){if(!T)return;let i=T.answerEvents.slice(qu),e=i.length||Y.fuel!==T.fuel;i.length&&(Cs=Math.max(Cs,Sm(Y,T.unit.id,i)),qu=T.answerEvents.length),Y.fuel=T.fuel,Y.reviewQueue[T.unit.id]=T.review.filter(t=>!t.recovered).map(t=>({...t})),e&&xn()}function Lc(){let i=Rc(Y),e=Ac(Y,Y.unit),t=As(Y);Pi(`${Dr("smile")}<span class="modal-kicker">MASTERY GARAGE</span><h2 id="modal-title">Wear what you learn.</h2><p>${St(qi().title)} \xB7 ${e.unique} distinct items \xB7 ${e.accuracy}% first try \xB7 ${e.arenas}/3 arenas</p><p>Your team sets your car colour. Earn badges and a trail through unit mastery.</p><div class="paint-grid">${$c.map(n=>`<button class="paint-option ${Y.teamId===n.id?"selected":""}" data-livery="${n.id}" aria-pressed="${Y.teamId===n.id}"><span class="paint-swatch" style="--paint:#${n.color.toString(16)}"></span><strong>${n.name}</strong><small>TEAM LIVERY</small></button>`).join("")}</div><p class="garage-label">BADGE</p><div class="badge-options">${["Off","Explorer","Scholar","Master"].map((n,s)=>`<button data-badge="${s}" ${s>i?"disabled":""} class="${t.badge===s?"selected":""}">${n}</button>`).join("")}</div><button id="trail-option" class="trail-option" ${i<3?"disabled":""} aria-pressed="${t.trail}">Aurora trail \xB7 ${i<3?"MASTER REWARD":t.trail?"ON":"OFF"}</button><div class="mastery-rules">At 90% first-try accuracy: <strong>Explorer</strong> needs 6 distinct items + 1 arena; <strong>Scholar</strong> needs 12 + 2 arenas; <strong>Master</strong> needs 18 + all 3. Earn rewards in any unit and equip them throughout your garage.</div><p class="save-note">Fuel ${Y.fuel}/100 \xB7 each first-try answer earns 10; every third in a streak adds 5. Each charge costs 30, up to three levels. ${It?"Slide up for Nitro, slide down to save it while keeping regular acceleration. Slide farther up to stack.":"Hold NITRO or Space to use it; release to save the remainder."} Driving always remains available.</p><button id="garage-done" class="primary">BACK TO GARAGE</button>`),C("modal").querySelectorAll("[data-livery]").forEach(n=>n.onclick=()=>{Y.teamId=n.dataset.livery,xn(),ft.setCosmetics(As(Y)),Lc()}),C("modal").querySelectorAll("[data-badge]").forEach(n=>n.onclick=()=>{Gu(Y,"badge",+n.dataset.badge)&&(xn(),ft.setCosmetics(As(Y)),Lc())}),C("trail-option").onclick=()=>{Gu(Y,"trail",!Y.look.trail)&&(xn(),ft.setCosmetics(As(Y)),Lc())},C("garage-done").onclick=()=>{Nn(),Os()}}var eo=!1,Ur=!1,yn=null,ks=!1,Ds=null,cn=null,Zu=0;function Ku(){return eo||Ur||yn!==null||Yi!==null}function vt(){if(T){let i=eo||Ur||Yi!==null||yn!==null&&!Nt?.touch;se.setAccelerating(T,Ku(),!!i),se.setNitroHeld(T,ks||Ds!==null||cn!==null)}}function to(){let i=Nt?.id;Nt=null;let e=Ds;Ds=null,cn=null,ks=!1,e!==null&&C("nitro").hasPointerCapture?.(e)&&C("nitro").releasePointerCapture(e);let t=yn;yn=null,eo=!1,Ur=!1;let n=Yi;Yi=null,n!==null&&C("throttle").hasPointerCapture?.(n)&&C("throttle").releasePointerCapture(n),t!==null&&C("world").hasPointerCapture?.(t)&&C("world").releasePointerCapture(t),i!=null&&C("world").hasPointerCapture?.(i)&&C("world").releasePointerCapture(i),T&&(se.setAccelerating(T,!1),se.setNitroHeld(T,!1))}function Pi(i){pn=null,Xi=0,C("toast").classList.remove("visible"),to(),We.pointerId!==null&&ed({pointerId:We.pointerId}),C("modal").classList.remove("finish-modal","dnf-result","tutorial-modal"),C("modal").classList.remove("lessons-modal"),Bm=document.activeElement,C("modal").innerHTML=i,C("modal-backdrop").hidden=!1,setTimeout(()=>C("modal").focus(),0)}function Nn(){C("modal-backdrop").hidden=!0,C("modal").classList.remove("lessons-modal"),C("modal").innerHTML="",Bm?.focus?.()}function ob(i=!1){let e=(It?"Hold anywhere on the road to accelerate. Keep your thumb down and swipe left or right to change lanes. You can swipe again without lifting.":"Swipe the road, tap the arrows, or use \u2190 \u2192 / A D. Hold your car or the speed button to accelerate. On a computer, hold \u2191.")+" Release acceleration and Nitro to coast and brake for traffic.",t=It?"Slide your driving thumb forward to use Nitro, then hold it there. Slide down to save the remaining charge and keep regular acceleration. Slide farther forward for a second or third charge, up to three levels. Each new charge costs 30 fuel; resuming a saved charge is free. Lifting your thumb releases acceleration and Nitro. Fuel and Nitro status sit beside your race position.":"Hold NITRO or Space to boost; release to save the remaining charge. An upward swipe also boosts while your finger stays down. A new charge costs 30 fuel. Tap +30 or press N to stack up to three levels. Holding acceleration also uses a loaded charge. Regular acceleration displays up to 90 km/h; maximum Nitro displays 200 km/h.",n=It?"After choosing, keep holding the road to return to normal pace sooner.":"After choosing, hold your car, the speed button or \u2191 to return to normal pace sooner.";T&&!["finished","failed","paused"].includes(T.status)&&(Is=se.pause(T)),Pi(`${Dr("point")}<span class="modal-kicker">WELCOME TO WORDRAMP</span><h2 id="modal-title">Your team.<br>Your open road.</h2><div class="help-step"><span class="step-num">1</span><div><strong>Find your line.</strong><p>${e}</p></div></div><div class="help-step"><span class="step-num">2</span><div><strong>Read the road.</strong><p>Steer towards the correct full-text answer, or tap its sign. Rivals match your progress during every English task, even if you hold acceleration. Correct exits protect your speed recovery too. Lights and forks enter slow motion close to the signs. Steering stays active. ${n} Already holding? Keep holding. The answer locks at the road line.</p></div></div><div class="help-task-grid"><div><b>GREEN LIGHT</b><span>Read in slow motion, then steer into the matching answer to turn the light green.</span></div><div><b>BRIDGE OUT</b><span>Release the car: autopilot holds your entry speed and lane while the world slows into a green-gold focus effect. Connect the three blocks in sentence order: each one drops its word slab into the gap with a note, and a wrong block bounces back out. Then drive over your sentence as each word lights up, with a small hop at the end. Extra thinking time safely freezes the approach before the gap. A held Up key or driving touch resumes automatically after autopilot.</span></div><div><b>SHORTCUT</b><span>Choose a sign in close-range slow motion. The right lane leads into a visible shortcut and a ride: the Sky Coaster in Sunlit, the Sea Jump on the Coastal Overpass and the Cliff Plunge in Stormcrest.</span></div><div><b>CROSSWALK</b><span>Sort each visitor\u2019s word while autopilot approaches in slow motion. Clear the crossing before you arrive; all cars wait if anyone is still on the road.</span></div></div><div class="help-step"><span class="step-num">3</span><div><strong>Earn your next boost.</strong><p>First-try English answers earn fuel. Every third adds a streak bonus. ${t}</p></div></div><div class="help-step"><span class="step-num">4</span><div><strong>Look after your car.</strong><p>Three small marks below the clock show your remaining hits. Each driving bump damages the car; the third ends the race. Change lanes into clear gaps. Every new race starts fully repaired.</p></div></div><p class="save-note">Choose Slytherin, Hufflepuff, Gryffindor or Ravenclaw in the garage. ${$t.enabled?`A first-place finish with ${Math.round(kr*100)}% of tasks right first time on Relaxed, or ${Or}+ stars on Challenge, adds Ulti points to your team in Mr. Saymaz's English League. Tap LEAGUE in the garage to see the team pools. `:""}Plan about five minutes per arena, with 12\u201316 checkpoints and longer open-road stretches. Holding acceleration and using Nitro can shorten your run. Your stars reward accurate English and clean driving. Your racing position is separate. All cars wait for pedestrians to reach the sidewalk.</p><details><summary>Race rules & keyboard shortcuts</summary><p>Finish first to unlock the next arena for this unit and difficulty. Stars still reward your English at every finishing position. Wrong answers cost 1.5 seconds and never damage your car. Each separate driving impact costs ${se.DIFFICULTIES[Y.difficulty].penalty} seconds and one condition mark. Three hits end the race. A cracked windscreen warns after the first hit; a loose bonnet and smoke mean one hit left. Rivals can close the gap while you recover, using their normal driving. Autopilot protects your car and reading time. Relaxed gives 3 seconds of impact protection; Challenge gives 2. Each retry starts fully repaired. Correct shortcuts add 3 seconds; wrong routes take a recoverable detour. Rivals share your regular top speed and earn fuel for boosts. Nitro waits through tasks and crossings. Use 1 / 2 / 3 for the road signs or repair blocks. Use \u2190 / \u2192 at crosswalks. Escape / P pauses. Missed words return later, with an optional review lap after the finish.</p></details><button id="help-done" class="primary">${i?"LET\u2019S DRIVE":"GOT IT"} \u2197</button>`),C("help-done").onclick=()=>{Nn(),i?(Y.crosswalkTutorial=!0,Y.tutorial.done=!0,xn(),Ps()):Is&&(se.resume(T),Is=!1)}}var rt=null,Fc=0,yt=i=>`<kbd>${i}</kbd>`,lb=[{kind:"light",name:"GREEN LIGHT",see:"Three answer signs across the road.",touch:"Steer into the lane with the right answer, or tap its sign.",keys:`Steer with ${yt("\u2190")} ${yt("\u2192")} or press ${yt("1")} ${yt("2")} ${yt("3")}.`},{kind:"fork",name:"SHORTCUT",see:"The road splits at answer signs.",touch:"Steer into the right sign: it opens a shortcut and a ride!",keys:`Steer with ${yt("\u2190")} ${yt("\u2192")} or press ${yt("1")} ${yt("2")} ${yt("3")}.`},{kind:"bridge",name:"BRIDGE OUT",see:"A gap in the road and three word blocks.",touch:"Your car drives itself. Draw one line through the blocks in sentence order.",keys:`Your car drives itself. Press ${yt("1")} ${yt("2")} ${yt("3")} in sentence order.`},{kind:"walk",name:"CROSSWALK",see:"People carry words to two groups.",touch:"Swipe each word left or right into its group before you arrive.",keys:`Sort each word with ${yt("\u2190")} ${yt("\u2192")} before you arrive.`}],cb={hold:["Hold your thumb on the road","Hold \u2191 for a moment"],coast:["Let go to slow down","Let go of \u2191 to slow down"],left:["Swipe left","Press \u2190 or A"],right:["Swipe right","Press \u2192 or D"],boost:["Slide up for Nitro","Hold Space for Nitro"],save:["Slide down or let go to save the rest","Let go of Space to save the rest"]};function hb(i){return`<svg viewBox="0 0 64 64" aria-hidden="true" class="task-icon">${{light:'<rect x="25" y="6" width="14" height="30" rx="4" class="ti-dark"/><circle cx="32" cy="14" r="4" class="ti-dim"/><circle cx="32" cy="27" r="4" class="ti-go"/><rect x="4" y="44" width="16" height="9" rx="2" class="ti-sign"/><rect x="24" y="44" width="16" height="9" rx="2" class="ti-sign ti-right"/><rect x="44" y="44" width="16" height="9" rx="2" class="ti-sign"/>',fork:'<path d="M32 60V38L14 10M32 38l18-28" class="ti-road"/><path d="M32 38l18-28" class="ti-path"/><rect x="40" y="6" width="20" height="9" rx="2" class="ti-sign ti-right"/><rect x="4" y="6" width="20" height="9" rx="2" class="ti-sign"/>',bridge:'<rect x="4" y="38" width="14" height="10" class="ti-dark"/><rect x="46" y="38" width="14" height="10" class="ti-dark"/><rect x="20" y="38" width="7" height="6" rx="1" class="ti-sign ti-right"/><rect x="28.5" y="38" width="7" height="6" rx="1" class="ti-sign ti-right"/><rect x="37" y="38" width="7" height="6" rx="1" class="ti-sign"/><path d="M10 20h14l8 8 14-14" class="ti-path"/><circle cx="10" cy="20" r="3" class="ti-go"/><circle cx="32" cy="28" r="3" class="ti-go"/><circle cx="46" cy="14" r="3" class="ti-go"/>',walk:'<rect x="4" y="44" width="56" height="10" class="ti-stripes"/><circle cx="32" cy="16" r="5" class="ti-sign"/><path d="M32 22v14M26 28h12M32 36l-5 8M32 36l5 8" class="ti-person"/><path d="M20 20l-10 0M14 15l-5 5 5 5" class="ti-path"/><path d="M44 20h10M50 15l5 5-5 5" class="ti-path"/>'}[i]}</svg>`}function ub(i){let e=It,t=e?`<span class="pp-hand pp-hand-${i}" aria-hidden="true"><svg viewBox="0 0 40 52"><path d="M15 22V7a4 4 0 0 1 8 0v13l9 2c4 1 6 4 5 8l-3 13c-1 4-4 7-8 7h-7c-3 0-5-1-7-4L4 32c-2-3 1-6 4-5l7 4" /></svg></span>`:`<span class="pp-keys" aria-hidden="true">${i==="drive"?yt("\u2191"):i==="steer"?yt("\u2190")+yt("\u2192"):yt("Space")+yt("N")}</span>`,n={drive:e?"Practice pad: hold your thumb here to drive.":"Practice: hold the Up arrow key to drive.",steer:e?"Practice pad: swipe left or right to change lanes.":"Practice: press Left and Right to change lanes.",nitro:e?"Practice pad: hold, then slide up for Nitro.":"Practice: hold Space for Nitro."}[i];return`<div id="practice" class="practice-pad" data-step="${i}" tabindex="0" role="application" aria-label="${n}"><div class="pp-road"><i class="pp-lines"></i><span id="pp-car" class="pp-car" aria-hidden="true"></span>${t}</div><div class="pp-gauges"><span class="pp-speed"><b id="pp-speed">0</b> KM/H</span>${i==="nitro"?'<span class="pp-nitro" aria-label="Nitro level"><i></i><i></i><i></i></span><span class="pp-fuel">FUEL <b id="pp-fuel">90</b></span>':""}</div></div><ul id="pp-goals" class="pp-goals">${Gr[i].map(s=>`<li data-goal="${s}">${cb[s][e?0:1]}</li>`).join("")}</ul>`}function db(i,e){let t=Ji[i],n=It,s=i===Ji.length-1,r={drive:[n?"Hold to drive.":"Hold \u2191 to drive.",n?"Put your thumb anywhere on the road and keep it there: your car speeds up. Let go to slow down.":`Hold ${yt("\u2191")} (or hold the speed button) to speed up. Let go to slow down.`],steer:[n?"Swipe to change lanes.":"Change lanes.",n?"Keep your thumb down and swipe left or right. You can swipe again without lifting.":`Tap ${yt("\u2190")} ${yt("\u2192")} or ${yt("A")} ${yt("D")}, or the arrow buttons on screen.`],nitro:[n?"Slide up for Nitro.":"Hold Space for Nitro.",n?"While you drive, slide your thumb up for Nitro. Slide higher for level 2 and 3. Slide down, or let go, to save the rest for later.":`Hold ${yt("Space")} or the NITRO button to boost. Press ${yt("N")} or +30 to add a level. Let go to save the rest for later.`],tasks:["Answer with your car.","The road asks you English questions. Slow motion gives you time to read."],race:["Win the race.","Good English fills your tank. Clean driving keeps your car in one piece."]}[t],a="";Gr[t]?a=ub(t)+(t==="nitro"?'<p class="tutorial-note">Each new Nitro level costs 30 fuel. In the race you earn fuel with right answers.</p>':""):t==="tasks"?a=`<div class="tutorial-tasks">${lb.map(c=>`<div class="tutorial-task">${hb(c.kind)}<div><b>${c.name}</b><span>${c.see}</span><p>${n?c.touch:c.keys}</p></div></div>`).join("")}</div><p class="tutorial-note">A wrong answer costs 1.5 seconds. It never damages your car.</p>`:a='<div class="tutorial-tiles"><div><b>FUEL</b><span>Right first time: +10 fuel. Every third in a row: +5 more. 30 fuel loads one Nitro.</span></div><div><b>YOUR CAR</b><span>Three bumps end the race. Change lanes into clear gaps.</span></div><div><b>THE FINISH</b><span>Finish first to open the next arena. Stars reward your English.</span></div></div>';let o=Ji.map((c,l)=>`<i class="${l===i?"on":l<i?"past":""}"></i>`).join("");return`${Dr(i===0?"point":s?"smile":"think")}<span class="modal-kicker">DRIVING SCHOOL \xB7 ${i+1} OF ${Ji.length}</span><h2 id="modal-title">${r[0]}</h2><p class="tutorial-lead">${r[1]}</p>${a}<div class="tutorial-dots" aria-hidden="true">${o}</div><div class="modal-actions tutorial-actions">${i>0?'<button id="tutorial-back" class="secondary">BACK</button>':e?'<button id="tutorial-skip" class="secondary">SKIP</button>':""}${s?'<button id="tutorial-rules" class="secondary">ALL RULES</button>':""}<button id="tutorial-next" class="primary">${s?e?"LET\u2019S DRIVE \u2197":"DONE":"NEXT"}</button></div>`}function Dc(){rt=null}function fb(i){if(!rt||!C("practice")){Dc();return}let e=C("practice"),t=e.classList.contains("tried"),n=rt;if(!t){let r=Pd(n.step,(performance.now()-n.demoStart)/1e3),a=n.demo||=jc(n.step);r.level>0&&r.level>a.level&&(a.charges=Math.max(a.charges,r.level)),r.held||(a.charges=0),a.held=r.held,a.lane=r.lane,a.boost=r.level>0,a.level=r.level,a.fuel=90-30*a.charges,eh(a,i),n=a}n.offset=((n.offset||0)+n.speed*i*4)%64,e.style.setProperty("--pp-offset",n.offset.toFixed(1)+"px"),Qe("pp-speed",Math.round(n.speed)),C("pp-fuel")&&Qe("pp-fuel",n.fuel),e.dataset.lane=String(n.lane),e.dataset.level=String(n.boost?n.level:0),e.classList.toggle("held",n.held||n.keyBoost),e.style.setProperty("--pp-speed",String(n.speed/200));for(let r of C("pp-goals").querySelectorAll("[data-goal]"))r.classList.toggle("done",!!rt.goals[r.dataset.goal]);wd(rt)&&!rt.cheered&&(rt.cheered=!0,Oe.tone("chime"),C("tutorial-next").classList.add("ready"))}function pb(i){let e=Math.max(0,Math.min(.25,(i-Fc)/1e3));Fc=i,eh(rt,e),fb(e)}function Oc(i=!1,e=0){T&&!["finished","failed","paused"].includes(T.status)&&(Is=se.pause(T)),Dc(),Pi(db(e,i)),C("modal").classList.add("tutorial-modal"),Fc=performance.now();let t=Ji[e],n=()=>{Dc(),Y.tutorial.done=!0,Y.crosswalkTutorial=!0,xn(),Nn(),C("modal").classList.remove("tutorial-modal"),i?Ps():Is&&(se.resume(T),Is=!1)};if(C("tutorial-next").onclick=()=>{Oe.tone("click"),e<Ji.length-1?Oc(i,e+1):n()},C("tutorial-back")&&(C("tutorial-back").onclick=()=>{Oe.tone("click"),Oc(i,e-1)}),C("tutorial-skip")&&(C("tutorial-skip").onclick=n),C("tutorial-rules")&&(C("tutorial-rules").onclick=()=>{Dc(),Y.tutorial.done=!0,Y.crosswalkTutorial=!0,xn(),C("modal").classList.remove("tutorial-modal"),ob(i)}),!Gr[t])return;rt=jc(t),rt.demoStart=performance.now();let s=C("practice");s.addEventListener("pointerdown",a=>{a.button>0||rt.pointer!=null||(a.preventDefault(),Oe.unlock(),rt.pointer=a.pointerId,s.setPointerCapture?.(a.pointerId),s.classList.add("tried"),Td(rt,a.clientX,a.clientY))}),s.addEventListener("pointermove",a=>{if(rt?.pointer!==a.pointerId)return;a.preventDefault();let o=rt.lane,c=rt.boost?rt.level:0;Ad(rt,a.clientX,a.clientY),o!==rt.lane&&(Oe.tone("click"),mn("click")),rt.boost&&rt.level>c&&(Oe.tone("nitro"+rt.level),mn("go"))});let r=a=>{rt?.pointer===a.pointerId&&(rt.pointer=null,Qc(rt))};for(let a of["pointerup","pointercancel","lostpointercapture"])s.addEventListener(a,r);Fc=performance.now(),setTimeout(()=>s.focus(),0)}function Km(i,e){if(!rt||C("modal-backdrop").hidden||!C("practice")||e&&i.repeat&&i.key!==" "&&i.key!=="ArrowUp")return!1;if(i.repeat)return i.preventDefault(),!0;let t=rt.lane,n=rt.boost?rt.level:0;return Rd(rt,i.key,e)?(i.preventDefault(),C("practice").classList.add("tried"),t!==rt.lane&&Oe.tone("click"),rt.boost&&rt.level>n&&Oe.tone("nitro"+rt.level),!0):!1}var Jm=()=>Oc(!1),Lm={drive:[["HOLD THE ROAD TO DRIVE","Keep your thumb down"],["HOLD \u2191 TO DRIVE","or hold the speed button"]],steer:[["SWIPE \u2190 \u2192 TO CHANGE LANES","Keep your thumb down while you swipe"],["PRESS \u2190 \u2192 TO CHANGE LANES","or A / D"]],nitro:[["NITRO READY! SLIDE YOUR THUMB UP","Slide down to save the rest"],["NITRO READY! HOLD SPACE","or hold the NITRO button"]]},mb={"task-light":["TAP YOUR ANSWER \xB7 OR STEER INTO IT","STEER \u2190 \u2192 \xB7 OR PRESS 1 2 3"],"task-junction":["TAP A SIGN \xB7 OR STEER INTO IT","STEER \u2190 \u2192 \xB7 OR PRESS 1 2 3"],"task-pedestrian":["SWIPE THE WORD INTO ITS GROUP","PRESS \u2190 OR \u2192 FOR EACH WORD"]},gb={drive:"drive",steer:"steer",nitro:"nitro","task-light":"signs","task-junction":"signs","task-pedestrian":"sort"},xb={drive:"\u2191",steer:"\u2190 \u2192",nitro:"SPACE","task-pedestrian":"\u2190 \u2192"},gn=null,Dm=0;function kc(){for(let i of["finger-tip","finger-trail","finger-label","finger-demo"])C(i).hidden=!0}function yb(i,e){let t=It,n=Ls().reduced,s=C("finger-tip"),r=C("finger-trail"),a=C("finger-label"),o=C("finger-demo");if(i.startsWith("task-")&&gn.touched===T.task?.id){kc();return}if(i==="task-repair"){s.hidden=r.hidden=a.hidden=!0,o.dataset.touch=String(t),o.hidden=!1;return}o.hidden=!0;let c=gb[i],l=[];if(c==="signs")l=[...C("road-answers").children].map(g=>({x:parseFloat(g.style.left),y:parseFloat(g.style.top)+30}));else if(c==="sort"){let g=[...C("pedestrian-words").children].find(m=>!m.hidden&&!m.disabled);g&&(l=[{x:parseFloat(g.style.left),y:parseFloat(g.style.top)+20}])}else{let g=ft?.carScreenBounds?.();g&&(l=[{x:(g.left+g.right)/2,y:g.top+(g.bottom-g.top)*.45}])}if(!l.length||c==="signs"&&l.length!==3||l.some(g=>!Number.isFinite(g.x)||!Number.isFinite(g.y))){kc();return}gn.mode!==i&&(gn.mode=i,gn.since=e);let h=Id(c,(e-gn.since)/1e3),u=c==="signs"?l[1]:l[0],f=u.x+(n?0:h.dx),d=u.y+(n?0:h.dy);if(c==="signs"){let g=l[h.index],m=l[h.from];f=m.x+(g.x-m.x)*h.mix,d=m.y+(g.y-m.y)*h.mix}let p=t?!(c==="signs"&&n):c!=="signs";s.hidden=!p,p&&(s.dataset.mode=c,s.dataset.touch=String(t),s.classList.toggle("press",n||!!h.press),ci(s,"transform",`translate(${f.toFixed(1)}px,${d.toFixed(1)}px)`),Qe("finger-keys",xb[i]||"")),r.hidden=!["steer","nitro","sort"].includes(c)||!t,r.hidden||(r.dataset.mode=c,r.classList.toggle("boost",!!h.boost||n),ci(r,"transform",`translate(${u.x.toFixed(1)}px,${u.y.toFixed(1)}px)`));let x=mb[i]?.[t?0:1];if(a.hidden=!x,x){Qe("finger-label",x);let g=ft?.viewport?.width||innerWidth,m=Math.max(130,Math.min(g-130,u.x));ci(a,"transform",`translate(${m.toFixed(1)}px,${(u.y+(c==="signs"?40:46)).toFixed(1)}px)`)}}function vb(i){let e=C("coach"),t=Math.max(0,Math.min(.25,(i-Dm)/1e3));if(Dm=i,!T||!C("modal-backdrop").hidden||Ns!=="race"){e.hidden=!0,kc();return}gn?.race!==T&&(gn={race:T});let n=nh(T,Y.tutorial,se.canNitro(T),gn);Cd(T,Y.tutorial,gn,t,n)&&xn();let s=nh(T,Y.tutorial,se.canNitro(T),gn);if(!s){e.hidden=!0,e.dataset.prompt="",kc();return}if(yb(s,i),!Lm[s]){e.hidden=!0;return}let[r,a]=Lm[s][It?0:1];e.hidden=!1,(e.dataset.prompt!==s||e.dataset.touch!==String(It))&&(e.dataset.prompt=s,e.dataset.touch=String(It),Qe("coach-text",r),Qe("coach-sub",a))}document.addEventListener("pointerdown",()=>{gn&&T?.status==="task"&&T.task&&(gn.touched=T.task.id)},{capture:!0});function Ps(i=null){if(!an(Y.teamId)){Lr();return}if(!Array.isArray(i)&&!Cc(jt)){Lr(),Rs("Finish first to unlock the next arena.");return}Om(),C("launch-caption").textContent=It?"HOLD TO DRIVE \xB7 SWIPE TO STEER \xB7 SLIDE \u2191 FOR NITRO":"READ THE ROAD. RACE YOUR RIVALS.",Fs(),$u=0,Ic=null,pn=null,Xi=0,C("toast").classList.remove("visible"),C("celebration").hidden=!0,C("celebration").innerHTML="",document.body.classList.remove("race-finished","car-critical","car-breaking");let e=Array.isArray(i)?i:null;Gc(),to(),Nn(),T=e?se.createReviewLap(qi(),e,Y.difficulty,Date.now(),{fuel:Y.fuel}):se.createRace(qi(),Y.difficulty,jt,Date.now(),{fuel:Y.fuel,reviews:Y.reviewQueue[qi().id]||[]}),Q1(T),T.teamId=Y.teamId,T.runId=md("run"),e||$m(T),qu=0,Cs=0,Ns="race",$a="",Uc="",Bc=null,ft.setup(e?0:jt),ft.clearGate(),ft.currentLane=0,ft.setCosmetics(As(Y)),C("rival-tags").innerHTML=T.rivals.map(t=>`<span data-rival="${t.id}" style="--rival:#${t.color.toString(16)}">${t.name}<small></small></span>`).join(""),document.body.classList.add("racing"),C("home").hidden=!0,C("hud").hidden=!1,C("pause").hidden=!1,C("countdown").hidden=!1,C("warning").hidden=!0,C("road-learning").hidden=!0,C("controls").hidden=!0,Zu=0,C("launch-kicker").textContent=T.arena.name.toUpperCase(),C("launch-caption").textContent=T.reviewLap?"A SHORT LAP. A STRONGER NEXT DRIVE.":"YOU \xB7 COBALT \xB7 EMBER",Oe.unlock(),Oe.tone("click")}function Lr(){document.body.dataset.nitroLevel="0",Gc(),to(),T=null,Ns="home",Uc="",$a="",Bc=null,Is=!1,ft?.clearGate(),Nn(),document.body.classList.remove("racing","nitro-active","race-finished","nitro-ready","car-critical","car-breaking"),pn=null,Xi=0,C("toast").classList.remove("visible"),C("celebration").hidden=!0,C("celebration").innerHTML="",C("rival-tags").innerHTML="";for(let i of["route-status","hud","pause","countdown","warning","road-learning","controls"])C(i).hidden=!0;C("home").hidden=!1,Os(),Oe.update(null)}function Nr(){if(!T||!se.pause(T))return;Oe.tone("pause");let i=an(T.teamId),e=se.raceOrder(T).findIndex(t=>t.id==="player")+1;Pi(`${Dr("think")}<span class="modal-kicker">PIT STOP \xB7 WORDRAMP</span><h2 id="modal-title">Take a breath.</h2><p>Your race clock is paused.</p><div class="pause-lesson"><strong>${St(T.arena.name)}</strong><span>Grade ${Y.grade} \xB7 ${St(T.unit.title)} \xB7 ${se.DIFFICULTIES[T.difficulty].label}</span><span class="pause-team" style="--team:${i.accent}">${St(i.name)}</span></div><dl class="pause-stats"><div><dt>FIRST TRY</dt><dd id="pause-accuracy">${T.correct} / ${T.tasks.length}</dd></div><div><dt>DISTANCE</dt><dd id="pause-distance">${Math.floor(T.distance)} / ${T.arena.length} m</dd></div><div><dt>CHECKPOINTS</dt><dd id="pause-checkpoints">${T.taskIndex} / ${T.tasks.length}</dd></div><div><dt>${se.raceFailed(T)?"STATUS":"POSITION"}</dt><dd>${se.raceFailed(T)?"DNF":T.reviewLap?"Review lap":e+" / 3"}</dd></div><div><dt>BEST STREAK</dt><dd>${T.bestStreak}</dd></div><div><dt>CAR CONDITION</dt><dd>${se.carCondition(T).remaining} / 3 hits left</dd></div></dl><button id="resume" class="primary">BACK ON THE ROAD \u2197</button><div class="pause-tools"><button id="pause-settings">Settings</button><button id="pause-help">How to play</button><button id="pause-sound">Sound ${Y.sound?"on":"off"}</button></div><div class="modal-actions"><button id="restart" class="secondary">Restart race</button><button id="exit-race" class="secondary">Return to garage</button></div>`),C("resume").onclick=()=>{Nn(),se.resume(T)},C("pause-settings").onclick=()=>{se.resume(T),Wm()},C("pause-help").onclick=()=>{se.resume(T),Jm()},C("pause-sound").onclick=()=>{Y.sound=!Y.sound,Oe.unlock(),zc(),xn(),C("pause-sound").textContent="Sound "+(Y.sound?"on":"off")},C("restart").onclick=Ps,C("exit-race").onclick=Lr}function _b(){if(Ns==="home"){Lr();return}if(T&&["finished","failed"].includes(T.status)){Lr();return}Nr()}var We={key:"",sequence:[],pointerId:null,point:null,dragging:!1,errorUntil:0};function bb(){return[...C("road-answers").querySelectorAll("[data-block]")].map(i=>{let e=i.getBoundingClientRect();return{id:+i.dataset.block,left:e.left-3,right:e.right+3,top:e.top-3,bottom:e.bottom+3}})}function Um(){We.pointerId!==null&&C("road-answers").hasPointerCapture?.(We.pointerId)&&C("road-answers").releasePointerCapture(We.pointerId),We={key:"",sequence:[],pointerId:null,point:null,dragging:!1,errorUntil:0},C("repair-path").setAttribute("d",""),C("repair-tip").setAttribute("d","")}function Vc(){let i=We.sequence.map(n=>{let s=C("road-answers").querySelector(`[data-block="${n}"]`);return s?{x:parseFloat(s.style.left),y:parseFloat(s.style.top)}:null}).filter(n=>n&&Number.isFinite(n.x)&&Number.isFinite(n.y));C("repair-path").setAttribute("d",i.map((n,s)=>(s?"L":"M")+n.x+" "+n.y).join(" "));let e=i.at(-1),t=We.dragging&&We.point;C("repair-tip").setAttribute("d",e&&t?"M"+e.x+" "+e.y+" L"+t.x+" "+t.y:""),C("repair-links").classList.toggle("error",performance.now()<We.errorUntil),C("repair-links").classList.toggle("complete",!!T?.task?.solved)}function Wc(i){if(T?.status!=="task"||T.task.kind!=="repair"||T.task.solved||performance.now()<We.errorUntil||We.sequence.includes(i))return;let e=se.placeRepairBlock(T,i);if(e==="wrong"){We.errorUntil=performance.now()+650,We.dragging=!1,We.point=null,Oe.tone("buzz"),mn("wrong");return}e&&(We.sequence=T.task.chosen.slice(),Oe.tone(e==="solved"?"chime":"note"+We.sequence.length),e==="solved"&&(We.dragging=!1,We.point=null,mn("correct")))}function Mb(i){if(We.pointerId!==null&&We.pointerId!==i.pointerId||T?.status!=="task"||T.task.kind!=="repair"||T.task.solved||performance.now()<We.errorUntil)return;let e=i.target.closest("[data-block]");e&&(i.preventDefault(),i.stopPropagation(),Oe.unlock(),We.pointerId=i.pointerId,We.dragging=!0,We.point={x:i.clientX,y:i.clientY},C("road-answers").setPointerCapture(i.pointerId),Wc(+e.dataset.block),Vc())}function Sb(i){if(!We.dragging||i.pointerId!==We.pointerId)return;i.preventDefault();let e=i.getCoalescedEvents?.();for(let t of e?.length?e:[i]){let n={x:t.clientX,y:t.clientY},s=We.point||n;for(let r of vm(s,n,bb(),We.sequence))Wc(r);We.point=n}Vc()}function ed(i){i.pointerId===We.pointerId&&(We.dragging=!1,We.point=null,C("road-answers").hasPointerCapture?.(i.pointerId)&&C("road-answers").releasePointerCapture(i.pointerId),We.pointerId=null,Vc())}C("road-answers").addEventListener("pointerdown",Mb);C("road-answers").addEventListener("pointermove",Sb);C("road-answers").addEventListener("pointerup",ed);C("road-answers").addEventListener("pointercancel",ed);var Ka=null;C("pedestrian-words").addEventListener("pointerdown",i=>{let e=i.target.closest("[data-person]");!e||T?.status!=="task"||T.task.kind!=="pedestrian"||T.task.pedWait>0||(i.preventDefault(),Oe.unlock(),Ka={id:i.pointerId,x:i.clientX,y:i.clientY,person:T.task.personIndex},e.setPointerCapture(i.pointerId))});function jm(i){if(Ka?.id!==i.pointerId)return;let e=Ka;Ka=null,i.type!=="pointercancel"&&T?.task?.personIndex===e.person&&Math.abs(i.clientX-e.x)>22&&Math.abs(i.clientX-e.x)>Math.abs(i.clientY-e.y)*.7&&se.sortPerson(T,i.clientX>e.x?1:0)&&Oe.tone("click"),i.target.hasPointerCapture?.(i.pointerId)&&i.target.releasePointerCapture(i.pointerId)}C("pedestrian-words").addEventListener("pointerup",jm);C("pedestrian-words").addEventListener("pointercancel",jm);function Eb(){let i=["task","resolving"].includes(T?.status),e=T?.task,t=i?se.currentRow(T)||e?.rows[0]:null,n=e?.completed?T.elapsed-e.completedAt:0,s=T?.status==="resolving"&&n>.6;if(C("road-learning").hidden=!t||n>1.05,C("road-learning").classList.toggle("leaving",s),!t){We.key&&T?.status!=="paused"&&Um();return}let r=e.kind==="repair",a=e.kind==="pedestrian",o=e.id;if(C("road-learning").classList.toggle("repair-mode",r),C("road-learning").classList.toggle("pedestrian-mode",a),C("repair-links").hidden=!r,C("pedestrian-words").hidden=!a,Uc!==o){Pc?.disconnect();for(let M of["app","hud","controls","road-prompt"])Pc?.observe(C(M));Fs(),Um(),Qe("road-feedback",""),Ya=0,Uc=o,We.key=o,Ka=null,C("road-kicker").textContent=r?e.reviewOf?"REVIEW REPAIR \xB7 AUTO CRUISE":"ROAD REPAIR \xB7 AUTO CRUISE":e.reviewOf?"SECOND LOOK \xB7 A DIFFERENT CLUE":a?"CROSSWALK":e.picture?e.kind==="light"?"PICTURE SIGN \xB7 GREEN LIGHT":"PICTURE ROUTE":e.kind==="light"?"GREEN LIGHT":"CHOOSE YOUR ROUTE",C("road-question").textContent=r?e.reviewOf?e.prompt:"Release the car. Connect the 3 blocks.":a?"Which category does each word belong to?":e.prompt,e.picture==="word"&&C("road-question").insertAdjacentHTML("afterbegin",`<img class="sign-emoji" src="${Yu(e.image)}" alt="Picture clue" draggable="false">`),C("road-prompt").classList.toggle("picture-sign",!!e.picture),C("road-instruction").textContent=r?"DRAG THROUGH ALL 3 BLOCKS IN THE RIGHT ORDER":a?"SWIPE THE WORD LEFT / RIGHT \xB7 OR TAP A CATEGORY":"STEER INTO YOUR ANSWER \xB7 TAP A SIGN TO STEER",C("road-answers").innerHTML=t.options.map((M,_)=>`<button class="road-answer ${r?"repair-block":a?"category-sign":""}" ${r?`data-block="${e.order[_]}"`:a?`data-side="${_}"`:`data-lane="${_}"`} aria-label="${r?"Connect block":a?`Send person ${_===0?"left":"right"}`:`Steer into ${["left","middle","right"][_]} lane`}: ${St(M)}"><span class="answer-letter">${r?"\u25C9":a?_===0?"\u2190 LEFT":"RIGHT \u2192":["A)","B)","C)"][_]}</span><span class="answer-text">${e.optionImages?`<img class="answer-emoji" src="${Yu(e.optionImages[_])}" alt="${St(M)}" draggable="false">`:Rm(a?mm(M):M.replace(/^…\s*/,""))}</span></button>`).join(""),C("road-answers").querySelectorAll("button").forEach(M=>{Pc?.observe(M),M.onclick=_=>{T?.status==="task"&&(r?_.detail===0&&Wc(+M.dataset.block):a?(Oe.unlock(),se.sortPerson(T,+M.dataset.side)&&Oe.tone("click")):(Oe.unlock(),se.choose(T,+M.dataset.lane),Oe.tone("click"),mn("click")))}}),C("pedestrian-words").innerHTML=a?e.people.map(M=>`<button class="person-word" data-person="${M.id}" aria-label="Swipe ${St(M.word)} left or right"><span>${Rm(M.word)}</span><small>\u2190 SWIPE \u2192</small></button>`).join(""):""}r?(e.solved&&We.sequence.length!==3&&(We.sequence=e.connection.slice()),We.errorUntil&&performance.now()>=We.errorUntil&&(We.sequence=e.chosen.slice(),We.errorUntil=0),Qe("road-question",e.solved?e.answer:e.reviewOf?e.prompt:"Release the car. Connect the 3 blocks."),Qe("road-kicker",e.solved?"BRIDGE BUILT":e.reviewOf?"REVIEW BRIDGE \xB7 AUTO CRUISE":"BRIDGE OUT \xB7 AUTO CRUISE"),Qe("road-instruction",e.solved?"SENTENCE CONNECTED \xB7 BRIDGE BUILT":We.errorUntil?"NOT THAT BLOCK YET \xB7 TRY ANOTHER":"DRAG THROUGH THE 3 BLOCKS IN SENTENCE ORDER")):a&&Qe("road-kicker",e.completed?se.crosswalkOccupied(T,e)?"VISITORS LEAVING":"CROSSWALK CLEAR":`CROSSWALK \xB7 VISITOR ${Math.min(e.personIndex+1,e.people.length)} / ${e.people.length}`);let c=ft.roadProjection(),l=C("road-prompt"),h=c.answers;if(h.length!==3)return;let{width:u,height:f}=ft.viewport||{width:innerWidth,height:innerHeight},d=f<600&&u>f,p=ym(u,h),x=[...C("road-answers").querySelectorAll("button")];if(x.forEach((M,_)=>{let P=p[a?_*2:_].width;ci(M,"width",P.toFixed(1)+"px"),Cm(M,M.querySelector(".answer-text"),P)}),a)for(let M of C("pedestrian-words").children)ci(M,"width",p[1].width.toFixed(1)+"px"),Cm(M,M.querySelector("span"),p[1].width);let{hudBottom:g,controlsTop:m,promptHeight:b,answerHeight:S}=Vm(),v=d?10:17,I=m-12,{py:y,ay:w,stagger:A}=_m({hudBottom:g,promptHeight:b,answerHeight:S,promptY:c.prompt.y,answerY:h[1].y,controlsTop:m,repair:r,landscape:d,viewportHeight:f});if(ci(l,"left",u/2+"px"),ci(l,"top",y.toFixed(1)+"px"),x.forEach((M,_)=>{let P=r?+M.dataset.block:null,D=We.sequence.indexOf(P),F=r&&D>=0;if(M.disabled=T.status!=="task"||a&&(e.pedWait>0||!se.pedestrianReady(T,e)),M.classList.toggle("selected",!r&&!a&&T.lane===_-1),M.classList.toggle("linked",F),M.classList.toggle("connected",r&&e.solved||!r&&!a&&e.completed&&_===e.correctIndex),M.classList.toggle("error",F&&performance.now()<We.errorUntil),M.setAttribute("aria-pressed",String(r?F:!a&&T.lane===_-1)),r){let G=M.querySelector(".answer-letter"),V=F?String(D+1):"\u25C9";G.textContent!==V&&(G.textContent=V)}let k=p[a?_*2:_];ci(M,"left",k.x.toFixed(1)+"px"),ci(M,"top",(w+(r&&_===1?A:0)).toFixed(1)+"px")}),a){C("road-instruction").textContent=e.completed?se.crosswalkOccupied(T,e)?"WAIT UNTIL ALL VISITORS REACH THE SIDEWALK":"CROSSWALK CLEAR \xB7 LET\u2019S GO":se.pedestrianReady(T,e)?`SWIPE LEFT / RIGHT \xB7 ${Math.ceil(se.crosswalkTimeLeft(T,e))}s`:e.peopleEntryAt==null?"TRAFFIC CLEARING THE STRIPES":"VISITORS APPROACHING \xB7 READ THE CATEGORIES";let M=ft.pedestrianProjection(T);[...C("pedestrian-words").children].forEach((_,P)=>{let D=e.people[P],F=M[P],k=D.sent?T.elapsed-D.sentAt:0,G=F?.visible&&se.pedestrianReady(T,e)&&(P===e.personIndex&&!D.sent||D.sent&&k<1.4);_.hidden=!G,_.disabled=D.sent||e.pedWait>0||T.status!=="task",_.classList.toggle("departing",D.sent),_.classList.toggle("wrong",D.sent&&!D.correct),_.style.opacity=D.sent?String(Math.max(0,1-k/1.4)):String(se.clamp((T.elapsed-D.entryAt)/.25,0,1)),_.style.width=p[1].width+"px",_.style.left=(D.sent?F?.x:p[1].x)+"px",_.style.top=Math.max(y+b/2+_.offsetHeight/2+v,Math.min(F?.y||w,I-_.offsetHeight/2))+"px",_.querySelector("small").textContent=D.sent?D.correct?"\u2713 SORTED":"\u2197 CORRECTION":"\u2190 SWIPE \u2192"})}C("decision-fill").style.width=(e.completed?0:a?se.crosswalkTimeLeft(T,e)/e.sortDuration*100:se.clamp((t.at-T.distance)/(r?82:70)*100,0,100))+"%",r&&Vc()}function wb(){to(),Gc();let i=Br(T),e=T.failureReason==="breakdown"||T.damage>=se.DAMAGE_LIMIT||!!T.breakdown,t=se.stars(T),n=Math.round(100*T.correct/Math.max(1,T.tasks.length)),s=i?se.raceOrder(T).findIndex(d=>d.id==="player")+1:null;if(i&&!T.reviewLap){let d=T.unit.id+":"+T.difficulty,p=(Y.progress[d]||[0,0,0]).slice();p[T.arenaIndex]=Math.max(p[T.arenaIndex],t),Y.progress[d]=p,Cs=Math.max(Cs,Em(Y,T.unit.id,T.arenaIndex)),Mm(Y,T,s),xn()}let r=$t.enabled?gd(T,s,t):"none",a=r==="qualified",o=an(T.teamId),c=qm(T);if(a){let d=T;$t.claim(d.runId).then(p=>(T===d&&sb(p,c,o),Qa(),$t.flush())).catch(()=>{})}let l=r==="accuracy"?T.difficulty==="challenge"?`English League Ulti points need ${Or} stars on Challenge: answer 3 in 4 tasks right first time.`:`English League Ulti points need ${Math.round(kr*100)}% of tasks right first time on Relaxed.`:"";Bc={finished:i,stars:t},Oe.tone(i?"finish":e?"breakdown":"wrong"),C("road-learning").hidden=!0,C("controls").hidden=!0,C("warning").hidden=!0,C("pause").hidden=!0;let h=T.review.filter(d=>!d.recovered),u=Ac(Y,T.unit.id),f=i&&s===1&&!T.reviewLap&&T.arenaIndex<2&&qa(Y,T.unit.id,T.difficulty,T.arenaIndex+1);Pi(`${Dr(i?s===1&&!T.reviewLap?"cheer":"smile":"think")}<span class="modal-kicker">${T.reviewLap?i?"REVIEW LOOP COMPLETE":"REVIEW LOOP \xB7 TRY AGAIN":i?"ENGLISH GRAND PRIX":e?"THREE HITS \xB7 RACE ENDED":"THE ROAD IS WORTH ANOTHER TRY"}</span><div class="finish-emblem" aria-hidden="true"><span>${i?"FINISH":e?"BREAKDOWN":"KEEP GOING"}</span><strong>${i?T.reviewLap?"\u2713":String(s).padStart(2,"0"):e?"!":"\u2197"}</strong><small>${T.reviewLap?"REVIEW":i?"RACE POSITION":e?"BACK TO THE GARAGE":"NEXT TIME"}</small></div><h2 id="modal-title">${i?T.reviewLap?"A stronger next drive.":s===1?"You took the lead.":"What a drive!":e?"Car broken down.":T.failureReason==="time"?"Time ran out.":"Race not finished."}</h2><p>${St(T.arena.name)} \xB7 ${se.DIFFICULTIES[Y.difficulty].label}${i&&!T.reviewLap?" \xB7 POSITION "+s+"/3":""}</p>${i?"":'<div class="result-dnf" role="status"><strong>DNF</strong><span>DID NOT FINISH</span></div>'}<div class="result-stars" aria-label="${t} out of 3 stars">${Array.from({length:3},(d,p)=>`<span class="${p<t?"":"empty"}">\u2605</span>`).join("")}</div><div class="result-stats"><div class="result-stat"><strong>${Math.ceil(T.time)}s</strong><small>TIME LEFT</small></div><div class="result-stat"><strong>${n}%</strong><small>FIRST TRY</small></div><div class="result-stat"><strong>${T.collisions}</strong><small>BUMPS</small></div></div>${i&&!T.reviewLap?`<div class="podium">${se.raceOrder(T).map((d,p)=>`<span class="${d.id==="player"?"you":""}"><b>${p+1}</b> ${St(d.name)}</span>`).join("")}</div>`:""}<p>${T.reviewLap?"Review strengthens your English. Win the full race to unlock the next arena.":i?"Stars reward your English and clean driving. First place unlocks the next arena.":e?"Three separate hits ended this race. Your next drive starts with a fully repaired car. Read the gaps and save Nitro for a clear stretch.":"Try Relaxed for more thinking time, or take a short review lap before the next race."}</p>${l?`<div class="ulti-win ulti-missed" style="--team:${an(T.teamId)?.accent||"#a5caff"}"><span>FIRST PLACE \xB7 NO ULTI POINTS</span><p>${St(l)}</p></div>`:""}${a?'<p id="league-result" class="league-result pending" role="status">Sending your win to the English League\u2026</p>':""}<div class="achievement">FUEL ${T.fuel}/100 \xB7 BEST STREAK ${T.bestStreak} \xB7 CHARGES LOADED ${T.nitroUses}</div>${Cs?`<div class="achievement">MASTERY REWARD \xB7 ${["","EXPLORER BADGE","SCHOLAR BADGE","MASTER BADGE + AURORA TRAIL"][Cs]}</div>`:""}<p class="save-note">Unit mastery: ${u.unique} distinct items \xB7 ${u.accuracy}% first try \xB7 ${u.arenas}/3 arenas</p>${f?`<div class="achievement">UNLOCKED \xB7 ${St(se.ARENAS[T.arenaIndex+1].name)}</div>`:i&&!T.reviewLap&&T.arenaIndex<2&&s!==1?`<p class="arena-goal">${qa(Y,T.unit.id,T.difficulty,T.arenaIndex+1)?"Finish first to advance from this race.":`Finish first in ${St(T.arena.name)} to unlock ${St(se.ARENAS[T.arenaIndex+1].name)}.`}</p>`:""}${h.length?`<details><summary>Review ${h.length} missed item${h.length>1?"s":""}</summary>${h.map(d=>`<div class="review-item"><span>${St(d.prompt)}</span><strong>${St(d.answer)}</strong>${d.tr?`<small>${St(d.tr)}</small>`:""}</div>`).join("")}</details><button id="review-lap" class="review-lap-button">SHORT REVIEW LAP \xB7 UP TO 6 ITEMS \u2197</button>`:T.review.length?'<div class="achievement">MISSED ITEMS RECOVERED ON THE ROAD</div>':""}<div class="modal-actions"><button id="replay" class="${f?"secondary":"primary"}">DRIVE AGAIN</button>${f?'<button id="next-arena" class="primary">NEXT ARENA \u2197</button>':""}</div><button class="text-button" id="result-home">Return to garage</button><p class="save-note">${Ju?"Wins, stars, fuel and mastery are saved in this browser.":"This browser is blocking saves. Keep this tab open to retain your progress."}</p>`),C("modal").classList.add("finish-modal"),C("modal").classList.toggle("dnf-result",!i),i&&eb(),C("replay").onclick=()=>Ps(),C("result-home").onclick=Lr,C("review-lap")&&(C("review-lap").onclick=()=>Ps(h)),C("next-arena")&&(C("next-arena").onclick=()=>{if(!f||T.status!=="finished"||se.raceOrder(T)[0]?.id!=="player")return;let d=T.arenaIndex+1;qa(Y,T.unit.id,T.difficulty,d)&&(jt=d,Ps())})}function Tb(){Pi(`<span class="modal-kicker">RACE JOURNAL \xB7 GRADE ${Y.grade}</span><h2 id="modal-title">Every road counts.</h2><p>${se.DIFFICULTIES[Y.difficulty].label} difficulty \xB7 three arenas per unit</p>${$i.find(i=>i.grade===Y.grade).units.map(i=>{let e=Y.progress[i.id+":"+Y.difficulty]||[0,0,0],t=e.reduce((n,s)=>n+s,0);return`<div class="journal-unit"><span>${St(i.title)}</span><span>${t} / 9 \u2605</span></div>`}).join("")}<p class="save-note">Progress is kept separately for each unit and difficulty in this browser.</p>${$t.enabled?'<button id="journal-ulti" class="review-lap-button">ENGLISH LEAGUE ULTI \u2197</button>':""}<button id="journal-done" class="primary">BACK TO GARAGE</button>`),C("journal-done").onclick=Nn,C("journal-ulti")&&(C("journal-ulti").onclick=Zm)}var Nm=-1/0;function Ab(i){i-Nm>1e3&&(Nm=i,Qa());let e=Sd(T,{modalOpen:!C("modal-backdrop").hidden}),t=e.question;document.body.classList.contains("reading-zone")!==t&&Fs(),document.body.classList.toggle("reading-zone",t),document.body.dataset.hudPhase=e.phase;let n=se.focusCruise(T),s=n&&T.focusAuto?.returning!=null,r=se.canShortenFocus(T);if(document.body.classList.toggle("focus-cruise",n),document.body.classList.toggle("repair-cruise",se.repairCruise(T)),document.body.style.setProperty("--focus-amount",n?Math.max(0,Math.min(1,T.focusAmount||0)):0),document.body.dataset.focusPhase=s?"return":n?"cruise":"off",C("throttle").disabled=!1,C("throttle").setAttribute("aria-label",n?r?"Hold to return to normal pace sooner.":Ku()?"Acceleration held. Quick return begins after your choice is ready.":"Autopilot holds your entry speed. After choosing, hold to return to normal pace sooner.":"Hold to accelerate"),document.body.classList.toggle("accelerating",!!T?.accelerating&&T.speedFactor>.05),rt&&pb(i),vb(i),!T){Im(i,e);return}C("controls").hidden=It||!["driving","task","resolving"].includes(T.status),Gc(),document.body.classList.toggle("nitro-active",!!T.nitroActive&&["driving","resolving"].includes(T.status));let a=se.raceOrder(T),o=a.findIndex(_=>_.id==="player")+1,c=se.raceFailed(T);Qe("race-place",c?"DNF":T.reviewLap?"REVIEW":o+" / 3"),Qe("place-label",c?"STATUS":T.reviewLap?"LAP":"POSITION"),Ic!==null&&o<Ic&&T.status==="driving"&&(Rs(o===1?"Taking the lead":"Clean overtake",!1,()=>T&&se.raceOrder(T).findIndex(_=>_.id==="player")+1===o),e.announcementsAllowed&&Oe.tone("overtake")),Ic=o;let l=se.carCondition(T),h=C("car-condition");h.dataset.damage=String(l.damage),h.setAttribute("aria-label",l.broken?"Car condition: broken down":`Car condition: ${l.remaining} ${l.remaining===1?"hit":"hits"} remaining${l.critical?"; critical":""}`),[...h.children].forEach((_,P)=>_.classList.toggle("intact",P<l.remaining)),document.body.classList.toggle("car-critical",l.critical),document.body.classList.toggle("car-breaking",T.status==="breakdown");let u=C("condition-notice");u.hidden=!T.lastImpact||T.elapsed-T.lastImpact.at>2.4||!["driving","breakdown"].includes(T.status)||se.learningPaceProtected(T),u.dataset.damage=String(l.damage),u.hidden||Qe("condition-notice",l.broken?"CAR BROKEN DOWN":l.critical?"CRITICAL \xB7 ONE HIT LEFT":"DAMAGED \xB7 TWO HITS LEFT"),C("pause").hidden=["breakdown","finished","failed"].includes(T.status),Qe("fuel-value",T.fuel),C("fuel-fill").style.width=T.fuel+"%",Qe("streak-count",T.streak),C("fuel-value").parentElement.setAttribute("aria-label","Fuel "+T.fuel+" out of 100"),C("streak-count").parentElement.setAttribute("aria-label","English streak "+T.streak),[...C("streak-pips").children].forEach((_,P)=>_.classList.toggle("lit",P<(T.streak?(T.streak-1)%3+1:0)));let f=se.canEngageNitro(T),d=se.canNitro(T),p=T.nitro>0?T.nitroLevel||1:0;C("nitro").disabled=!f,C("nitro-stack").disabled=!d,C("nitro-stack").setAttribute("aria-label",p===3?"Maximum charge level reached":"Add Nitro charge: 30 fuel"),Qe("stack-label",p===3?"MAX":"30"),C("nitro").classList.toggle("ready",f),C("nitro").classList.toggle("saved",p>0&&!T.nitroActive),document.body.classList.toggle("nitro-ready",f),Qe("nitro-title",p&&!T.nitroActive?"SAVED":p===3?"MAX POWER":p===2?"DOUBLE":"NITRO"),Qe("nitro-label",p?T.nitro.toFixed(1)+"s"+(T.nitroActive?"":" \xB7 HOLD"):T.fuel>=30?"HOLD \xB7 30":T.fuel+" / 30"),[...C("nitro-slots").children].forEach((_,P)=>_.classList.toggle("lit",P<p)),C("nitro-ring-fill").style.strokeDashoffset=String(100*(1-(p?T.nitro/(se.NITRO_DURATION*p):Math.min(1,T.fuel/30)))),C("nitro").style.setProperty("--charge",p?T.nitro/(se.NITRO_DURATION*p):Math.min(1,T.fuel/30)),C("nitro").setAttribute("aria-pressed",String(!!T.nitroHeld)),C("nitro").setAttribute("aria-label",p?`Hold to use saved level ${p} Nitro: ${T.nitro.toFixed(1)} seconds remaining; release to save`:"Hold to load and use Nitro: 30 fuel");let x=C("touch-nitro");x.hidden=!It||!["driving","task","resolving"].includes(T.status),Qe("touch-nitro-state",T.nitroActive?"BOOST \xD7"+p:p?"SAVED \xD7"+p:f?"NITRO":"FUEL"),Qe("touch-fuel",T.fuel),x.classList.toggle("boosting",!!T.nitroActive),x.classList.toggle("ready",f),C("touch-nitro-fill").style.width=Math.min(100,100*(p?T.nitro/(se.NITRO_DURATION*p):T.fuel/30))+"%",[...C("touch-nitro-levels").children].forEach((_,P)=>_.classList.toggle("lit",P<p)),x.setAttribute("aria-label",`Nitro ${T.nitroActive?"boosting":p?"saved":"ready at 30 fuel"}; level ${p} of 3; fuel ${T.fuel} out of 100${p?"; "+T.nitro.toFixed(1)+" seconds saved":""}`);let g=T.nitroActive?p:0;g&&g!==Zu&&(Oe.tone("nitro"+g),mn("go")),Zu=g;let m=ft.rivalProjection(),b=xm(m.map(_=>({..._,distance:(T.rivals.find(P=>P.id===_.id)?.at??0)-T.distance})),{width:ft.viewport?.width||innerWidth,top:Za.hudBottom+(e.approaching||e.route?60:0),bottom:Za.controlsTop});for(let _ of C("rival-tags").children){let P=T.rivals.find(F=>F.id===+_.dataset.rival),D=m.find(F=>F.id===P.id);_.hidden=!b.includes(P.id)||t||["finished","failed"].includes(T.status),_.style.left=(D?.x||0)+"px",_.style.top=(D?.y||0)+"px",_.classList.toggle("boosting",!!P.nitroActive),_.querySelector("small").textContent=(P.nitroActive?"NITRO \xB7 ":"")+(P.at>=T.distance?"+":"")+Math.round(P.at-T.distance)+"m"}let S=Math.max(0,Math.ceil(T.time)),v=Math.min(100,T.distance/T.arena.length*100);Qe("time",Math.floor(S/60)+":"+String(S%60).padStart(2,"0")),C("time").parentElement.classList.toggle("urgent",S<20),C("progress-fill").style.width=v+"%",C("progress-fill").parentElement.setAttribute("aria-valuenow",String(Math.round(v))),Qe("road-fairness",se.learningPaceProtected(T)?"TASK PACE PROTECTED \xB7 RIVALS MATCH YOU":"");let I=Md(T.route?.coaster?{...T,speedFactor:T.speedFactor*(ft?.rideSpeed||1)}:T,se.REGULAR_MAX_SPEED,se.MAX_SPEED);Qe("speed",I),C("throttle").style.setProperty("--speed-fill",I/200),document.body.dataset.nitroLevel=String(T.nitroActive&&["driving","resolving"].includes(T.status)?T.nitroLevel||1:0),C("throttle").setAttribute("aria-pressed",String(!!T.accelerating||n&&Ku()));let y=!!T.route?.coaster&&!Ls().reduced&&(ft?.rideSpeed||1)>1.35;C("speedlines").classList.toggle("boost",(T.boost>0||y)&&T.status==="driving"),C("speedlines").classList.toggle("focus",T.status==="task"),C("speedlines").classList.toggle("accelerating",T.accelerating&&T.speedFactor>.05),C("left").setAttribute("aria-label",T.status==="task"&&T.task.kind==="pedestrian"?"Send visitor left":"Steer left"),C("right").setAttribute("aria-label",T.status==="task"&&T.task.kind==="pedestrian"?"Send visitor right":"Steer right");let w=T.status==="task"&&T.task?.kind==="pedestrian";if(C("left").disabled=C("right").disabled=w?T.task.pedWait>0||!se.pedestrianReady(T):se.steeringLocked(T)||!!se.exitAssist(T)||!!T.route,Qe("drive-hint",s?"RESUMING":r?window.matchMedia("(pointer: coarse)").matches?"HOLD TO RESUME":"HOLD \u2191 TO RESUME":n?se.steeringLocked(T)?"AUTO CRUISE":"FOCUS \xB7 STEER":T.speedFactor<.05&&(T.yielding||T.followingTraffic)?T.yielding?"WAITING":"CHANGE LANE":se.exitAssist(T)?"ACCELERATE":T.route?T.route.shortcut?"SHORTCUT":"DETOUR":T.nitroActive?"NITRO BOOST":T.accelerating?"ACCELERATING":window.matchMedia("(pointer: coarse)").matches?"HOLD TO DRIVE":"HOLD \u2191"),T.notice){let _=T.notice;T.notice=null,_.type==="nitro"?Rs(_.text,!1,()=>T?.nitro>0):_.type==="collision"||_.type==="breakdown"?(C("hit-flash").classList.remove("active"),C("hit-flash").offsetWidth,C("hit-flash").classList.add("active"),Oe.tone(_.type==="breakdown"?"breakdown":"collision"),mn("collision")):_.type==="correct"||_.type==="sorted"?(Oe.tone("correct"),mn("correct"),Rs(_.text)):_.type==="wrong"&&(Oe.tone("wrong"),Rs(_.text,!0))}if(T.status==="countdown"){C("countdown").hidden=!1;let _=Math.max(1,Math.ceil(T.countdown));_!==$u&&($u=_,Qe("launch-number",_),C("countdown").dataset.step=_,[...C("countdown").querySelectorAll(".launch-lights i")].forEach((P,D)=>P.classList.toggle("lit",D<4-_)),Oe.tone("tick"),mn("click"))}if(T.status!=="countdown"&&!C("countdown").hidden&&(C("countdown").hidden=!0),T.status!==$a){let _=$a;$a=T.status,$t.enabled&&!T.leagueTicket&&!T.reviewLap&&T.taskIndex!==Pm&&(Pm=T.taskIndex,performance.now()-Xm>4e3&&$m(T)),T.status==="driving"&&(C("countdown").hidden=!0,C("controls").hidden=It,C("road-learning").hidden=!0,_==="countdown"&&(Oe.tone("go"),mn("go"),Rs("GO \xB7 FIND YOUR LINE"))),T.status==="task"&&(C("controls").hidden=It,C("warning").hidden=!0),["finished","failed"].includes(T.status)&&!Bc&&wb()}let A=e.route,M=!!A&&!e.approaching&&!t&&!["finished","failed"].includes(T.status);if(C("route-status").hidden=!M,M){let _=!T.route;C("route-status").classList.toggle("detour",!A.shortcut),Qe("route-label",_?"MERGING":A.coaster?se.rideTitle(A)+" \xB7 \u221218m":A.shortcut?"SHORTCUT \xB7 \u221218m":"DETOUR \xB7 +32m"),Qe("route-remaining",Math.max(0,Math.ceil((_?A.exitEndAt:A.end)-T.distance))+"m"),C("route-status").style.setProperty("--route-progress",se.clamp((T.distance-A.start)/(A.exitEndAt-A.start),0,1))}if(C("warning").hidden=!e.approaching,e.approaching){let _=e.next.kind;C("warning-title").textContent={light:"Traffic light ahead",repair:"Road repair ahead",junction:"Choose your route",pedestrian:"Crosswalk ahead"}[_],Qe("warning-sub",e.next.coaster?se.RIDE_LAYOUTS[e.next.coaster.layout].hint:"Get ready to read."),C("warning-icon").textContent={light:"\u25CF",repair:"\u25B0",junction:"\u2442",pedestrian:"\u2194"}[_],Qe("warning-distance",Math.ceil(e.ahead)+"m")}Vm(),Eb(),Im(i,e)}function td(){return Oe.unlock(),se.activateNitro(T)?(mn("go"),!0):!1}C("nitro").addEventListener("pointerdown",i=>{i.button>0||Ds!==null||(i.preventDefault(),se.engageNitro(T)&&(Oe.unlock(),Ds=i.pointerId,C("nitro").setPointerCapture(i.pointerId),vt()))});for(let i of["pointerup","pointercancel","lostpointercapture"])C("nitro").addEventListener(i,e=>{Ds===e.pointerId&&(Ds=null,vt(),C("nitro").hasPointerCapture?.(e.pointerId)&&C("nitro").releasePointerCapture(e.pointerId))});C("nitro").addEventListener("keydown",i=>{(i.code==="Space"||i.key==="Enter")&&(!i.repeat&&se.engageNitro(T)&&(ks=!0,Oe.unlock(),vt()),i.preventDefault(),i.stopPropagation())});C("nitro").addEventListener("keyup",i=>{(i.code==="Space"||i.key==="Enter")&&(ks=!1,vt(),i.preventDefault(),i.stopPropagation())});C("nitro").addEventListener("blur",()=>{ks=!1,vt()});C("nitro-stack").addEventListener("keydown",i=>{(i.key===" "||i.key==="Enter")&&i.stopPropagation()});function Us(i){Oe.unlock(),T&&se.move(T,i)&&(Oe.tone("click"),mn("click"))}document.querySelectorAll("[data-team]").forEach(i=>i.onclick=()=>{Y.teamId=i.dataset.team,Oe.tone("click"),Os()});C("league-button").onclick=Zm;Ym();$t.enabled&&($t.flush().catch(()=>{}),$t.refresh(Y.grade).then(Qa,()=>{}));C("lesson-picker").onclick=nb;document.querySelectorAll("[data-diff]").forEach(i=>i.onclick=()=>{Y.difficulty=i.dataset.diff,jt=0,Os()});C("settings").onclick=Wm;C("start").onclick=()=>{Oe.unlock(),Y.tutorial.done?Ps():Oc(!0)};C("help").onclick=()=>Jm();C("progress-button").onclick=Tb;C("garage-button").onclick=Lc;C("nitro").onclick=i=>{i.detail===0&&T&&T.nitro<=0&&td()};C("nitro-stack").onclick=td;C("pause").onclick=Nr;C("brand-home").onclick=i=>{i.preventDefault(),_b()};for(let[i,e]of[["left",-1],["right",1]])C(i).onpointerdown=t=>{t.button>0||(t.preventDefault(),Us(e))},C(i).onclick=t=>{t.detail===0&&Us(e)};C("sound").onclick=()=>{Y.sound=!Y.sound,Oe.unlock(),zc(),xn(),Oe.tone("click")};C("throttle").addEventListener("pointerdown",i=>{i.button>0||Yi!==null||!T||!["driving","task","resolving"].includes(T.status)||(i.preventDefault(),Yi=i.pointerId,C("throttle").setPointerCapture(i.pointerId),Oe.unlock(),vt())});for(let i of["pointerup","pointercancel","lostpointercapture"])C("throttle").addEventListener(i,e=>{Yi===e.pointerId&&(Yi=null,vt(),C("throttle").hasPointerCapture?.(e.pointerId)&&C("throttle").releasePointerCapture(e.pointerId))});C("throttle").addEventListener("keydown",i=>{i.key==="Enter"&&(!i.repeat&&T&&["driving","task","resolving"].includes(T.status)&&(Ur=!0,Oe.unlock(),vt()),i.preventDefault(),i.stopPropagation())});C("throttle").addEventListener("keyup",i=>{i.key==="Enter"&&(Ur=!1,vt(),i.preventDefault(),i.stopPropagation())});C("throttle").addEventListener("blur",()=>{Ur=!1,vt()});var Nt=null;C("world").addEventListener("pointerdown",i=>{if(i.button>0||Nt&&Nt.id!==i.pointerId)return;(i.pointerType==="touch"||i.pointerType==="pen")&&ja(!0);let e=ju||i.pointerType==="touch"||i.pointerType==="pen"||It&&i.pointerType!=="mouse",t=T&&(["driving","task","resolving"].includes(T.status)||e&&T.status==="countdown");if(t&&(i.preventDefault(),Om()),!t)return;let n=e||ft.isCarHit(i.clientX,i.clientY);Nt={x:i.clientX,y:i.clientY,id:i.pointerId,hold:n,touch:e,drive:e?Jc(i.clientX,i.clientY):null,nitroAllowed:se.canEngageNitro(T)},C("world").setPointerCapture(i.pointerId),n&&(yn=i.pointerId,C("world").setPointerCapture(i.pointerId),Oe.unlock(),vt(),i.preventDefault())});function Qm(i){if(Nt?.id!==i.pointerId)return;if(Nt.touch){let t=ao(Nt.drive,i.clientX,i.clientY);if(i.preventDefault(),t.steer&&Us(t.steer),t.boostChanged&&!t.boost&&(cn=null),t.boost&&(t.boostChanged||t.levelChanged)&&se.canEngageNitro(T)&&se.engageNitro(T))for(Oe.unlock(),cn=i.pointerId;(T.nitroLevel||0)<t.level&&se.canNitro(T);)se.activateNitro(T);vt();return}let e=_d(Nt,i.clientX,i.clientY);e&&(i.preventDefault(),yn=null,Nt.hold=!1,vt(),e.type==="steer"?Us(e.direction):e.type==="nitro"&&Nt.nitroAllowed&&se.engageNitro(T)&&(Oe.unlock(),cn=i.pointerId,vt()))}C("world").addEventListener("pointermove",Qm);C("world").addEventListener("pointerup",i=>{if(Nt?.id===i.pointerId&&Nt.touch){let t=ao(Nt.drive,i.clientX,i.clientY);t.steer&&Us(t.steer),Rb(i.pointerId);return}cn===i.pointerId&&(cn=null,vt()),yn===i.pointerId&&(yn=null,vt()),Nt?.id===i.pointerId&&(Qm(i),Nt=null),cn===i.pointerId&&(cn=null,vt()),C("world").hasPointerCapture?.(i.pointerId)&&C("world").releasePointerCapture(i.pointerId)});function Rb(i){Nt?.id===i&&(Nt=null),cn===i&&(cn=null),yn===i&&(yn=null),vt(),C("world").hasPointerCapture?.(i)&&C("world").releasePointerCapture(i)}C("world").addEventListener("pointercancel",i=>{cn===i.pointerId&&(cn=null,vt()),yn===i.pointerId&&(yn=null,vt()),Nt?.id===i.pointerId&&(Nt=null)});C("world").addEventListener("lostpointercapture",i=>{cn===i.pointerId&&(cn=null,vt()),yn===i.pointerId&&(yn=null,vt()),Nt?.id===i.pointerId&&(Nt=null)});document.addEventListener("keydown",i=>{if(!["SELECT","INPUT"].includes(document.activeElement.tagName)&&!Km(i,!0)){if(gn&&T?.status==="task"&&T.task&&/^([1-3]|Arrow(Left|Right)|[adAD])$/.test(i.key)&&(gn.touched=T.task.id),!C("modal-backdrop").hidden){if(i.key==="Tab"){let e=[...C("modal").querySelectorAll('button:not(:disabled),select,summary,[tabindex="0"]')],t=e[0],n=e.at(-1);i.shiftKey&&(document.activeElement===t||document.activeElement===C("modal"))?(n?.focus(),i.preventDefault()):!i.shiftKey&&document.activeElement===n&&(t?.focus(),i.preventDefault())}if(i.key==="Escape"&&C("lesson-cancel")){C("lesson-cancel").click();return}if(i.key==="Escape"&&C("settings-done")){C("settings-done").click();return}i.key==="Escape"&&T?.status==="paused"&&(C("resume")?.click(),!C("resume")&&C("help-done")&&C("help-done").click());return}if(i.key==="ArrowUp"&&T&&["driving","task","resolving"].includes(T.status)){i.repeat||(eo=!0,Oe.unlock(),vt()),i.preventDefault();return}if(i.key===" "&&T){!i.repeat&&se.engageNitro(T)&&(ks=!0,Oe.unlock(),vt()),i.preventDefault();return}if(!i.repeat&&T&&["n","N"].includes(i.key)){td(),i.preventDefault();return}i.repeat||((i.key==="ArrowLeft"||i.key.toLowerCase()==="a")&&(Us(-1),i.preventDefault()),(i.key==="ArrowRight"||i.key.toLowerCase()==="d")&&(Us(1),i.preventDefault()),(i.key==="Escape"||i.key.toLowerCase()==="p")&&Nr(),T?.status==="task"&&/^[1-3]$/.test(i.key)&&(T.task.kind==="repair"?Wc(T.task.order[Number(i.key)-1]):T.task.kind==="pedestrian"?i.key!=="2"&&se.sortPerson(T,i.key==="1"?0:1):se.choose(T,Number(i.key)-1),i.preventDefault()),Ns==="home"&&i.key==="Enter"&&C("start").click())}});document.addEventListener("keyup",i=>{Km(i,!1)||(i.key===" "&&(ks=!1,vt(),T&&i.preventDefault()),i.key==="ArrowUp"&&(eo=!1,vt(),T&&i.preventDefault()))});window.addEventListener("blur",()=>{to(),Nr()});document.addEventListener("visibilitychange",()=>{document.hidden?Nr():Qa()});document.addEventListener("graphicslost",()=>{Nr(),C("graphics-error").hidden=!1});try{ft=new wc(C("world")),ft.onCue=i=>Oe.tone(i)}catch(i){console.error(i),C("graphics-error").hidden=!1,C("loading").hidden=!0}Os();zc();Qu();var Fm=performance.now(),Xu=0;function eg(i){let e=(i-Fm)/1e3,t=Math.min(e,.06);Fm=i,ft?.samplePerformance(e,!!T&&["driving","task","resolving"].includes(T.status)),vt(),T&&se.tick(T,t,ft?.currentLane??T.lane),Xu=!C("modal-backdrop").hidden&&(!T||["paused","finished","failed"].includes(T.status))?Xu+1:0,Xu%6===0&&ft?.update(t,T,Ns),Ab(i),Oe.update(T,ft?.spectators?.proximity||0),i>Xi&&C("toast").classList.remove("visible"),Ya&&i>Ya&&(Qe("road-feedback",""),Ya=0),requestAnimationFrame(eg)}requestAnimationFrame(eg);setTimeout(()=>C("loading").hidden=!0,500);window.WORDRAMP=window.WORDRIFT=window.WORDSHIFT={version:"0.28.0",ulti:Object.freeze({snapshot:i=>$t.snapshot(i??Y.grade),enabled:$t.enabled}),get race(){return T},get settings(){return Y},get scene(){return ft}};})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
