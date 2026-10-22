(()=>{var Nu="wordramp",Fu="https://mrsaymaz.netlify.app/api/ulti",Mm=Object.freeze(["gryffindor","hufflepuff","slytherin","ravenclaw"]),bm=Object.freeze({capacity:100,maxStrength:2,hours:72}),Uu="wordramp-league.v1",Sm=48*36e5,Em=47*36e5;function Ou(i){return i&&typeof i.ultiApi=="string"?i.ultiApi.trim():Fu}function wm(i,e,t=Date.now()){let n=t-e*36e5;return(Array.isArray(i)?i:[]).reduce((s,[r,a])=>r*6e4>n&&Number.isFinite(a)?s+a:s,0)}function Tm(i,e,t){return e>0?1+(t-1)*Math.sqrt(Math.min(Math.max(i,0),e)/e):1}var Bu=i=>"x"+i.toFixed(2);function Am(i){let e=i?.games?.[Nu];return i&&i.enabled!==!1&&e&&e.enabled!==!1?e:null}function ku(i){return i%24===0?`${i/24} day${i===24?"":"s"}`:`${i} hours`}function Rm(i=24){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=new Uint8Array(i);if(globalThis.crypto?.getRandomValues)globalThis.crypto.getRandomValues(t);else for(let n=0;n<i;n++)t[n]=Math.floor(Math.random()*256);return Array.from(t,n=>e[n%e.length]).join("")}function zu({api:i=Fu,storage:e=globalThis.localStorage,fetchImpl:t=globalThis.fetch?.bind(globalThis),now:n=()=>Date.now(),timeoutMs:s=8e3}={}){let r=!!i,a={},o=()=>{try{let S=e?.getItem(Uu);if(S){let A=JSON.parse(S);if(A&&typeof A=="object")return A}}catch{}return a},c=S=>{a=S;try{e?.setItem(Uu,JSON.stringify(S))}catch{}},l=()=>{let S=o();return S.pools||={},S.outbox||=[],S.tickets||={},S};function h(){let S=l();return(typeof S.device!="string"||!/^[A-Za-z0-9_-]{8,64}$/.test(S.device))&&(S.device=Rm(),c(S)),S.device}async function u(S){if(!r||!t)return{kind:"off"};let A=typeof AbortController=="function"?new AbortController:null,R=A?setTimeout(()=>A.abort(),s):null;try{let y=await t(i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(S),signal:A?.signal}),M=null;try{M=await y.json()}catch{}return y.status>=500||M?.retry===!0?{kind:"retry",status:y.status,data:M}:y.ok&&M?.status==="success"?{kind:"ok",data:M}:{kind:"refused",status:y.status,data:M}}catch{return{kind:"retry"}}finally{R&&clearTimeout(R)}}function f(S){let A=l();if(S?.settings&&typeof S.settings=="object"&&(A.settings=S.settings),S?.pools&&typeof S.pools=="object")for(let[R,y]of Object.entries(S.pools))A.pools[R]={at:n(),pool:y};c(A)}function d(S){let A=l(),R=A.settings||null,y={...bm,...R||{}},M=A.pools[S]?.pool||{},C=n(),U=Mm.map(D=>{let N=wm(M[D]?.entries,y.hours,C);return{id:D,points:N,players:M[D]?.players||0,strength:Tm(N,y.capacity,y.maxStrength)}});return{enabled:r,known:!!R,settings:R,game:Am(R),capacity:y.capacity,hours:y.hours,teams:U,updatedAt:A.pools[S]?.at||null}}async function m(S){if(!r)return d(S);let A=await u({action:"pools",grade:S});return A.kind==="ok"&&f(A.data),{...d(S),online:A.kind==="ok"}}function x(S){let A=n();for(let[R,y]of Object.entries(S.tickets))(!y||A-y.at>Sm)&&delete S.tickets[R];S.outbox=S.outbox.filter(R=>R&&A-R.at<=Em)}async function g({runId:S,grade:A,team:R,arena:y,pace:M,unit:C=""}){if(!r)return null;let U=l().tickets[S];if(U)return U.ticket;let D=await u({action:"start",game:Nu,grade:A,team:R,arena:y,pace:M,unit:String(C).replace(/[^A-Za-z0-9_-]/g,"").slice(0,24),device:h()});if(D.kind!=="ok"||typeof D.data.ticket!="string")return null;let N=l();return x(N),N.tickets[S]={ticket:D.data.ticket,at:n(),grade:A,team:R},c(N),D.data.ticket}let p=S=>l().tickets[S]?.ticket||null;async function v(S){let A=await u({action:"claim",ticket:S,device:h()});if(A.kind==="ok"){f(A.data);let R=A.data;return{state:"counted",points:R.points||0,requested:R.requested,deviceWins:R.deviceWins,reason:R.reason||null,duplicate:!!R.duplicate}}return A.kind==="refused"?{state:"refused",reason:A.data?.reason||"refused"}:{state:"retry"}}async function b(S){if(!r)return{state:"off"};let A=l(),R=A.tickets[S];if(!R)return{state:"no-ticket"};delete A.tickets[S],c(A);let y=await v(R.ticket);if(y.state==="retry"){let M=l();return M.outbox.push({ticket:R.ticket,at:R.at,grade:R.grade,team:R.team}),x(M),c(M),{state:"queued"}}return y}async function _(){if(!r)return[];let S=l();x(S),c(S);let A=[];for(let R of S.outbox.slice()){let y=await v(R.ticket);if(y.state!=="retry"){let M=l();M.outbox=M.outbox.filter(C=>C.ticket!==R.ticket),c(M)}A.push({...R,...y})}return A}return{enabled:r,device:h,refresh:m,snapshot:d,start:g,ticketFor:p,claim:b,flush:_,outbox:()=>l().outbox.slice()}}var Tc=Object.freeze([{id:"slytherin",name:"Slytherin",color:3314796,accent:"#8ce4bd",letter:"S"},{id:"hufflepuff",name:"Hufflepuff",color:15317056,accent:"#ffe09b",letter:"H"},{id:"gryffindor",name:"Gryffindor",color:13125971,accent:"#ffadb1",letter:"G"},{id:"ravenclaw",name:"Ravenclaw",color:4685774,accent:"#a5caff",letter:"R"}].map(Object.freeze)),wr=2,Tr=.6;function Ar(i){return!i||i.status!=="finished"||i.failureReason||i.breakdown||(i.damage||0)>=3?!1:!Number.isFinite(i.arena?.length)||Number.isFinite(i.distance)&&i.distance>=i.arena.length}var sn=i=>Tc.find(e=>e.id===i)||null;function Hu(i="run"){let e=globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+"-"+Math.random().toString(36).slice(2)+"-"+Math.random().toString(36).slice(2);return i+"-"+e}function Gu(i,e,t){if(!Ar(i)||i.reviewLap||e!==1||!sn(i.teamId)||typeof i.runId!="string"||!i.runId)return"none";let n=i.tasks?.length&&Number.isFinite(i.correct)?i.correct/i.tasks.length:null;return(i.difficulty!=="challenge"&&i.difficulty!=="standard"&&n!=null?n>=Tr-1e-9:t>=wr)?"qualified":"accuracy"}function Vu(i){let e=!!i&&"ulti"in i;return e&&delete i.ulti,e}var Wa=class{constructor(e){this.enabled=e,this.ctx=null,this.engine=null,this.arena=-1}unlock(){if(this.enabled())try{if(this.ctx||=new(window.AudioContext||window.webkitAudioContext),this.ctx.resume().catch(()=>{}),this.engine)return;let e=this.ctx;this.compressor=e.createDynamicsCompressor(),this.compressor.threshold.value=-18,this.compressor.ratio.value=4,this.compressor.connect(e.destination),this.master=e.createGain(),this.master.gain.value=.7,this.master.connect(this.compressor),this.focusFilter=e.createBiquadFilter(),this.focusFilter.type="lowpass",this.focusFilter.frequency.value=16e3,this.world=e.createGain(),this.world.gain.value=1,this.world.connect(this.focusFilter),this.focusFilter.connect(this.master);let t=(c,l)=>{let h=e.createOscillator(),u=e.createGain();return h.type=c,u.gain.value=0,h.connect(u),u.connect(l),h.start(),[h,u]};this.engineFilter=e.createBiquadFilter(),this.engineFilter.type="lowpass",this.engineFilter.frequency.value=500,this.engineFilter.Q.value=1.4,this.engineFilter.connect(this.world),[this.engine,this.engineGain]=t("sawtooth",this.engineFilter),[this.sub,this.subGain]=t("triangle",this.engineFilter),[this.harmonic,this.harmonicGain]=t("sine",this.world);let n=(c,l)=>{let h=e.createBuffer(1,e.sampleRate*c,e.sampleRate),u=h.getChannelData(0),f=0;for(let d=0;d<u.length;d++)f=l(f,Math.random()*2-1,d),u[d]=f;return h};this.noiseBuffer=n(2,(c,l)=>(c+l*.02)/1.02*1||0);{let c=this.noiseBuffer.getChannelData(0);for(let l=0;l<c.length;l++)c[l]*=3.5}this.whiteBuffer=n(2,(c,l)=>l);let s=(c,l,h,u=.7)=>{let f=e.createBufferSource(),d=e.createBiquadFilter(),m=e.createGain();return f.buffer=c,f.loop=!0,d.type=l,d.frequency.value=h,d.Q.value=u,m.gain.value=0,f.connect(d),d.connect(m),m.connect(this.world),f.start(),{source:f,filter:d,gain:m}};this.wind=s(this.noiseBuffer,"lowpass",450),this.windGain=this.wind.gain,this.filter=this.wind.filter,this.nitroLayer=s(this.whiteBuffer,"bandpass",1600,.9),[this.whine,this.whineGain]=t("sine",this.world),this.ambience=s(this.noiseBuffer,"lowpass",260,.5),this.ambienceSwell=e.createOscillator(),this.ambienceDepth=e.createGain(),this.ambienceDepth.gain.value=0,this.ambienceSwell.frequency.value=.12,this.ambienceSwell.connect(this.ambienceDepth),this.ambienceDepth.connect(this.ambience.gain.gain),this.ambienceSwell.start();let r=e.createBuffer(1,e.sampleRate*3,e.sampleRate),a=r.getChannelData(0),o=0;for(let c=0;c<a.length;c++)o=(o+(Math.random()*2-1)*.12)/1.12,a[c]=o*(.65+.35*Math.sin(c/e.sampleRate*3.7));this.crowdBuffer=r,this.crowd=s(r,"bandpass",850,.45),this.crowdGain=this.crowd.gain}catch(e){console.warn("Wordramp audio unavailable",e)}}setArena(e){if(!this.ambience||e===this.arena)return;this.arena=e;let t=this.ctx.currentTime,n=this.ambience,s=[{type:"lowpass",f:240,q:.5,depth:.004},{type:"bandpass",f:520,q:.6,depth:.018},{type:"highpass",f:2600,q:.4,depth:.003}][e]||{type:"lowpass",f:240,q:.5,depth:0};n.filter.type=s.type,n.filter.frequency.setTargetAtTime(s.f,t,.3),n.filter.Q.value=s.q,this.swellDepth=s.depth}voice(e,t,n,s,r,a=this.master,o=null){let c=this.ctx.createOscillator(),l=this.ctx.createGain();c.type=e,c.frequency.setValueAtTime(t,n),o&&c.frequency.exponentialRampToValueAtTime(o,n+s),l.gain.setValueAtTime(1e-4,n),l.gain.exponentialRampToValueAtTime(r,n+.012),l.gain.exponentialRampToValueAtTime(1e-4,n+s),c.connect(l),l.connect(a),c.start(n),c.stop(n+s+.02),c.onended=()=>{c.disconnect(),l.disconnect()}}burst(e,t,n,s,r,a=this.whiteBuffer){let o=this.ctx.createBufferSource(),c=this.ctx.createBiquadFilter(),l=this.ctx.createGain();o.buffer=a,c.type=s,c.frequency.value=r,l.gain.setValueAtTime(1e-4,e),l.gain.exponentialRampToValueAtTime(n,e+.006),l.gain.exponentialRampToValueAtTime(1e-4,e+t),o.connect(c),c.connect(l),l.connect(this.master),o.start(e,Math.random(),t+.05),o.onended=()=>{o.disconnect(),c.disconnect(),l.disconnect()}}tone(e){if(!this.enabled()||!this.ctx||!this.master)return;if(/^nitro[123]$/.test(e)){this.boost(+e.at(-1));return}let t=this.ctx.currentTime;if(e==="correct"){[659,880,1318].forEach((s,r)=>{this.voice("triangle",s,t+r*.07,.24,.075),this.voice("sine",s*2,t+r*.07,.16,.02)});return}if(e==="wrong"){this.voice("triangle",233,t,.22,.07),this.voice("triangle",196,t+.11,.3,.065);return}if(e==="collision"){this.voice("sine",140,t,.32,.22,this.master,42),this.burst(t,.18,.16,"lowpass",1400),this.burst(t+.02,.08,.07,"highpass",3200);return}if(e==="breakdown"){[110,92,74,58].forEach((s,r)=>this.voice("sawtooth",s,t+r*.17,.32,.06)),this.burst(t,.5,.12,"lowpass",700);return}if(e==="finish"){[523,659,784,1046,1318].forEach((s,r)=>{this.voice("triangle",s,t+r*.11,.4,.07),this.voice("sine",s/2,t+r*.11,.4,.03)});return}if(e==="go"){[392,587,784].forEach((s,r)=>this.voice("square",s,t+r*.08,.18,.035));return}if(e==="tick"){this.voice("square",440,t,.12,.03);return}({click:[520],build:[493,740],pause:[330],overtake:[740,988]}[e]||[440]).forEach((s,r)=>this.voice("sine",s,t+r*.065,.2,e==="click"?.035:.08))}boost(e){let t=this.ctx,n=t.currentTime,s=t.createBufferSource(),r=t.createBiquadFilter(),a=t.createGain();s.buffer=this.noiseBuffer,r.type="bandpass",r.Q.value=.65,r.frequency.setValueAtTime(1800+e*350,n),r.frequency.exponentialRampToValueAtTime(250,n+.42),a.gain.setValueAtTime(1e-4,n),a.gain.exponentialRampToValueAtTime(.16+e*.025,n+.025),a.gain.exponentialRampToValueAtTime(1e-4,n+.5),s.connect(r),r.connect(a),a.connect(this.master),s.start(n),s.stop(n+.52),s.onended=()=>{s.disconnect(),r.disconnect(),a.disconnect()},this.voice("triangle",150+e*25,n,.34,.085,this.master,52)}applause(){if(!this.enabled()||!this.ctx||!this.crowd)return;let e=this.ctx,t=e.currentTime;for(let n=0;n<3;n++){let s=e.createBufferSource(),r=e.createBiquadFilter(),a=e.createGain(),o=t+n*.14;s.buffer=this.crowdBuffer,r.type="highpass",r.frequency.value=1200,a.gain.setValueAtTime(1e-4,o),a.gain.exponentialRampToValueAtTime(.095,o+.006),a.gain.exponentialRampToValueAtTime(1e-4,o+.085),s.connect(r),r.connect(a),a.connect(this.master),s.start(o,n*.31,.1),s.onended=()=>{s.disconnect(),r.disconnect(),a.disconnect()}}}update(e,t=0){if(!this.ctx||!this.engine)return;e&&this.setArena(e.arenaIndex??0);let n=this.enabled(),s=n&&e&&["driving","task","resolving","breakdown"].includes(e.status),r=s?Math.max(0,e.speedFactor):0,a=this.ctx.currentTime,o=Math.floor(r*2.2),c=(52+r*30-o*8)*(e?.status==="breakdown"?.65+Math.abs(Math.sin(e.elapsed*24))*.25:1),l=e?.accelerating||e?.nitroActive?1:.55;this.engine.frequency.setTargetAtTime(c,a,.1),this.sub.frequency.setTargetAtTime(c*.5,a,.1),this.harmonic.frequency.setTargetAtTime(c*2.01,a,.12),this.engineFilter.frequency.setTargetAtTime(260+r*520*l,a,.15),this.engineGain.gain.setTargetAtTime(s?(.016+r*.006)*l:0,a,.1),this.subGain.gain.setTargetAtTime(s?.02+r*.004:0,a,.1),this.harmonicGain.gain.setTargetAtTime(s?.004+r*.002:0,a,.12);let h=globalThis.RallyCore,u=s&&h&&e.route?.coaster?e.route:null,f=0;if(u){let p=h.coasterHeight(u,e.distance),v=h.coasterHeight(u,e.distance+2)-p;v>.25&&a>=(this.nextClack||0)&&(this.voice("square",1700,a,.03,.01),this.nextClack=a+.12),f=Math.min(.05,Math.max(0,-v)*.025),this.rideHeight>.4&&p<.05&&(this.voice("sine",92,a,.3,.11,this.master,46),this.burst(a,.14,.07,"lowpass",850)),this.rideHeight=p}else this.rideHeight=0;this.windGain.gain.setTargetAtTime(s?.008*r*r+f:0,a,.16),this.filter.frequency.setTargetAtTime(300+r*650,a,.2);let d=s&&e.nitroActive?Math.max(1,e.nitroLevel||1):0;this.nitroLayer.gain.gain.setTargetAtTime(d?.018+d*.008:0,a,d?.05:.2),this.nitroLayer.filter.frequency.setTargetAtTime(1300+d*450,a,.1),this.whine.frequency.setTargetAtTime(900+r*260,a,.1),this.whineGain.gain.setTargetAtTime(d?.006+d*.003:0,a,d?.05:.2);let m=n&&e&&!["paused","finished","failed"].includes(e.status);this.ambience.gain.gain.setTargetAtTime(m?[.02,.03,.026][e.arenaIndex??0]??.02:0,a,.5),this.ambienceDepth.gain.setTargetAtTime(m&&this.swellDepth||0,a,.5);let x=n&&e?Math.max(0,Math.min(1,e.focusAmount||0)):0;this.focusFilter.frequency.setTargetAtTime(16e3-x*14800,a,.15),this.world.gain.setTargetAtTime(1-x*.35,a,.15);let g=s&&e.status==="driving"&&!e.yielding?Math.max(0,Math.min(1,t)):0;this.crowdGain.gain.setTargetAtTime(g*.14,a,.3),g>.75&&!this.cheerNear&&(this.cheerNear=!0,this.applause()),g<.25&&(this.cheerNear=!1)}};function Wu(i={},e=!1){return(!i||typeof i!="object")&&(i={}),{graphics:["auto","high","battery"].includes(i.graphics)?i.graphics:"auto",motion:["system","full","reduced"].includes(i.motion)?i.motion:"system",haptics:i.haptics!==!1,reduced:i.motion==="reduced"||i.motion!=="full"&&e}}function Ac(i="auto",e=1){let t=Math.min(e,i==="battery"?1:i==="high"?2:1.75);return{graphics:i,ceiling:t,ratio:t,seconds:0,frames:0,slow:0,cooldown:0}}function Xu(i,e,t=!0){if(!t||i.graphics!=="auto"||e<=0||e>.15||(i.cooldown=Math.max(0,i.cooldown-e),i.seconds+=e,i.frames++,e>1/38&&i.slow++,i.seconds<2.5))return!1;let n=i.slow/i.frames>.35,s=!1;return n&&i.cooldown===0&&i.ratio>.85&&(i.ratio=Math.max(.85,i.ratio-.2),i.cooldown=5,s=!0),i.seconds=0,i.frames=0,i.slow=0,s}function qu(i,e,t){if(!i||i.dispatched)return null;let n=e-i.x,s=t-i.y;return-s>=44&&-s>Math.abs(n)*1.25?(i.dispatched=!0,{type:"nitro"}):Math.abs(n)>=28&&Math.abs(n)>Math.abs(s)*1.2?(i.dispatched=!0,{type:"steer",direction:Math.sign(n)}):s>=44&&s>Math.abs(n)*1.25?(i.dispatched=!0,{type:"cancel"}):null}function $u(i,e){return{laneX:i,laneY:e,boostBase:e,peakY:e,boost:!1,level:0}}function Rc(i,e,t){let n=e-i.laneX,s=t-i.laneY,r=0,a=!1,o=!1;if(Math.abs(n)>=28&&Math.abs(n)>Math.abs(s)*1.2&&(r=Math.sign(n),i.laneX=e,i.laneY=t,i.boost||(i.boostBase=t)),i.boost){i.peakY=Math.min(i.peakY,t);let c=t-i.peakY;if(c>=28&&c>Math.abs(n)*1.2)i.boost=!1,i.level=0,i.boostBase=t,a=!0;else{let l=Math.min(3,Math.max(1,Math.floor((i.boostBase-t)/44)));l>i.level&&(i.level=l,o=!0)}}else{i.boostBase=Math.max(i.boostBase,t);let c=i.boostBase-t;c>=44&&c>Math.abs(n)*1.2&&(i.boost=!0,i.peakY=t,i.level=Math.min(3,Math.max(1,Math.floor(c/44))),a=!0)}return Math.abs(s)>Math.abs(n)*1.2&&(i.laneX=e,i.laneY=t),{steer:r,boost:i.boost,level:i.level,boostChanged:a,levelChanged:o}}function Yu(i,e){let t=e>=i?Math.min(124,Math.max(80,e*.16)):Math.min(72,Math.max(42,e*.17));return e-t}function Zu(i,e=1.55,t=3.45){if(!i||!["driving","task","resolving"].includes(i.status))return 0;let n=Math.max(0,Number(i.speedFactor)||0),s=n<=e?n/e*90:90+(n-e)/(t-e)*110;return Math.max(0,Math.min(200,Math.round(s)))}function Ku(i,{modalOpen:e=!1}={}){if(!i)return{phase:"garage",question:!1,approaching:!1,route:null,announcementsAllowed:!e};let t=["task","resolving"].includes(i.status),n=i.status==="driving",s=i.tasks?.[i.taskIndex],r=s?.at-i.distance,a=n&&r>0&&r<(s.kind==="pedestrian"?174:90),o=i.route||(i.mergeAssist&&i.distance<i.mergeAssist.exitEndAt?i.mergeAssist:null),c=(i.obstacles||[]).some(h=>!h.passed&&!h.dormant&&h.at>i.distance-8&&h.at<i.distance+80);return{phase:t?"question":a?"approaching":o?"route":n?"driving":"inactive",question:t,approaching:a,next:s,ahead:r,route:o,announcementsAllowed:n&&!t&&!a&&!o&&!c&&!i.yielding&&!i.followingTraffic&&!e}}var Rr=Object.freeze({5:"A1",6:"A1+",7:"A2",8:"A2+"}),Cm=Object.freeze({g5u1:"Naming school places and clubs, expressing likes and following school rules.",g5u2:"Following classroom instructions and talking about school subjects, objects and time.",g5u3:"Describing appearance, clothes and everyday routines.",g5u4:"Talking about family hobbies, routines and actions happening now.",g5u5:"Naming neighbourhood places and describing where things are in a city.",g5u6:"Ordering food and asking about quantities and prices.",g5u7:"Describing wild animals, their homes, abilities and size.",g5u8:"Describing natural places and making holiday plans.",g5u9:"Naming jobs and workplaces, and explaining what people do.",g5u10:"Asking about toys, colours, shapes and prices.",g6u1:"Talking about school roles, responsibilities and how often routines happen.",g6u2:"Describing study routines and comparing everyday activities with actions happening now.",g6u3:"Describing and comparing appearance, personality and personal belongings.",g6u4:"Talking about family jobs, homes and planned arrangements.",g6u5:"Describing festivals, transport and events in the past.",g6u6:"Talking about countries, languages, food culture and past food experiences.",g6u7:"Describing nature activities, reducing waste and protecting the environment.",g6u8:"Talking about planets, weather, future plans and predictions.",g6u9:"Comparing products and asking about prices and sizes.",g6u10:"Expressing feelings and needs, asking for help and discussing healthy habits.",g7u1:"Describing appearance and personality traits, and comparing people.",g7u2:"Talking about sports, equipment and how often people exercise.",g7u3:"Telling life stories and describing achievements, dates and past events.",g7u4:"Describing wild animals, their habitats and ways to protect them.",g7u5:"Talking about TV programmes, expressing preferences and sharing opinions.",g7u6:"Planning parties, making offers and suggestions, and talking about quantities.",g7u7:"Expressing hopes and ambitions, and making predictions about the future.",g7u8:"Naming public places, explaining their purposes and giving directions.",g7u9:"Discussing environmental problems and giving advice about solutions.",g7u10:"Comparing planets and exploring facts about space and space history.",g7u11:"Naming ingredients, following recipes and putting cooking steps in order.",g7u12:"Describing past holidays, asking about journeys and making travel plans.",g8u1:"Making invitations, accepting or refusing, and giving reasons and excuses.",g8u2:"Talking about teen routines, habits, preferences and opinions.",g8u3:"Naming kitchen tools and ingredients, and explaining recipes step by step.",g8u4:"Having phone conversations, taking messages and asking for clarification.",g8u5:"Talking about internet tools, online habits and staying safe online.",g8u6:"Comparing adventure sports, choosing equipment and following safety rules.",g8u7:"Describing destinations, comparing holidays and talking about past trips.",g8u8:"Sharing household chores and explaining responsibilities, rules and obligations.",g8u9:"Describing scientific achievements, experiments and laboratory instructions.",g8u10:"Discussing natural events, their effects, safety precautions and predictions.",g8u11:"Making polite shopping requests, comparing products and explaining purchase problems.",g8u12:"Describing pets, their daily needs and responsible care."});function Ju(i){return Cm[i.id]||i.targetLanguage?.slice(0,2).join(" \xB7 ")||"Practise this unit\u2019s vocabulary and useful everyday English."}var Pd=0,dh=1,Ld=2;var fh=1,Qo=2,Jn=3,ui=0,Ht=1,en=2,vi=0,Zi=1,_n=2,ph=3,mh=4,Dd=5,Ii=100,Ud=101,Nd=102,Fd=103,Od=104,Bd=200,kd=201,zd=202,Hd=203,vo=204,Mo=205,Gd=206,Vd=207,Wd=208,Xd=209,qd=210,$d=211,Yd=212,Zd=213,Kd=214,el=0,tl=1,nl=2,Ki=3,il=4,sl=5,rl=6,al=7,gh=0,Jd=1,jd=2,Mi=0,Qd=1,ef=2,tf=3,ol=4,nf=5,sf=6,rf=7;var xh=300,ns=301,is=302,ar=303,ll=304,_a=306,Pi=1e3,Ci=1001,bo=1002,cn=1003,af=1004;var va=1005;var Dn=1006,cl=1007;var Ni=1008;var On=1009,yh=1010,_h=1011,or=1012,hl=1013,Fi=1014,Bn=1015,lr=1016,ul=1017,dl=1018,cr=1020,vh=35902,Mh=35899,bh=1021,Sh=1022,Tn=1023,$s=1026,hr=1027,fl=1028,pl=1029,Eh=1030,ml=1031;var gl=1033,Ma=33776,ba=33777,Sa=33778,Ea=33779,xl=35840,yl=35841,_l=35842,vl=35843,Ml=36196,bl=37492,Sl=37496,El=37808,wl=37809,Tl=37810,Al=37811,Rl=37812,Cl=37813,Il=37814,Pl=37815,Ll=37816,Dl=37817,Ul=37818,Nl=37819,Fl=37820,Ol=37821,Bl=36492,kl=36494,zl=36495,Hl=36283,Gl=36284,Vl=36285,Wl=36286;var Wr=2300,So=2301,_o=2302,nh=2400,ih=2401,sh=2402;var of=3200,lf=3201;var wh=0,cf=1,kn="",Bt="srgb",Ji="srgb-linear",Xr="linear",ot="srgb";var Yi=7680;var rh=519,hf=512,uf=513,df=514,Th=515,ff=516,pf=517,mf=518,gf=519,Eo=35044,ss=35048;var Ah="300 es",Ln=2e3,qr=2001;var di=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},Jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ju=1234567,zr=Math.PI/180,Ys=180/Math.PI;function Xn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Jt[i&255]+Jt[i>>8&255]+Jt[i>>16&255]+Jt[i>>24&255]+"-"+Jt[e&255]+Jt[e>>8&255]+"-"+Jt[e>>16&15|64]+Jt[e>>24&255]+"-"+Jt[t&63|128]+Jt[t>>8&255]+"-"+Jt[t>>16&255]+Jt[t>>24&255]+Jt[n&255]+Jt[n>>8&255]+Jt[n>>16&255]+Jt[n>>24&255]).toLowerCase()}function Ke(i,e,t){return Math.max(e,Math.min(t,i))}function Rh(i,e){return(i%e+e)%e}function Im(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Pm(i,e,t){return i!==e?(t-i)/(e-i):0}function Hr(i,e,t){return(1-t)*i+t*e}function Lm(i,e,t,n){return Hr(i,e,1-Math.exp(-t*n))}function Dm(i,e=1){return e-Math.abs(Rh(i,e*2)-e)}function Um(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Nm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Fm(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Om(i,e){return i+Math.random()*(e-i)}function Bm(i){return i*(.5-Math.random())}function km(i){i!==void 0&&(ju=i);let e=ju+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function zm(i){return i*zr}function Hm(i){return i*Ys}function Gm(i){return(i&i-1)===0&&i!==0}function Vm(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Wm(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Xm(i,e,t,n,s){let r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),f=a((e-n)/2),d=r((n-e)/2),m=a((n-e)/2);switch(s){case"XYX":i.set(o*h,c*u,c*f,o*l);break;case"YZY":i.set(c*f,o*h,c*u,o*l);break;case"ZXZ":i.set(c*u,c*f,o*h,o*l);break;case"XZX":i.set(o*h,c*m,c*d,o*l);break;case"YXY":i.set(c*d,o*h,c*m,o*l);break;case"ZYZ":i.set(c*m,c*d,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Pn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function at(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var It={DEG2RAD:zr,RAD2DEG:Ys,generateUUID:Xn,clamp:Ke,euclideanModulo:Rh,mapLinear:Im,inverseLerp:Pm,lerp:Hr,damp:Lm,pingpong:Dm,smoothstep:Um,smootherstep:Nm,randInt:Fm,randFloat:Om,randFloatSpread:Bm,seededRandom:km,degToRad:zm,radToDeg:Hm,isPowerOfTwo:Gm,ceilPowerOfTwo:Vm,floorPowerOfTwo:Wm,setQuaternionFromProperEuler:Xm,normalize:at,denormalize:Pn},ue=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},fi=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3],f=r[a+0],d=r[a+1],m=r[a+2],x=r[a+3];if(o===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=f,e[t+1]=d,e[t+2]=m,e[t+3]=x;return}if(u!==x||c!==f||l!==d||h!==m){let g=1-o,p=c*f+l*d+h*m+u*x,v=p>=0?1:-1,b=1-p*p;if(b>Number.EPSILON){let I=Math.sqrt(b),S=Math.atan2(I,p*v);g=Math.sin(g*S)/I,o=Math.sin(o*S)/I}let _=o*v;if(c=c*g+f*_,l=l*g+d*_,h=h*g+m*_,u=u*g+x*_,g===1-o){let I=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=I,l*=I,h*=I,u*=I}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[a],f=r[a+1],d=r[a+2],m=r[a+3];return e[t]=o*m+h*u+c*d-l*f,e[t+1]=c*m+h*f+l*u-o*d,e[t+2]=l*m+h*d+o*f-c*u,e[t+3]=h*m-o*u-c*f-l*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),u=o(r/2),f=c(n/2),d=c(s/2),m=c(r/2);switch(a){case"XYZ":this._x=f*h*u+l*d*m,this._y=l*d*u-f*h*m,this._z=l*h*m+f*d*u,this._w=l*h*u-f*d*m;break;case"YXZ":this._x=f*h*u+l*d*m,this._y=l*d*u-f*h*m,this._z=l*h*m-f*d*u,this._w=l*h*u+f*d*m;break;case"ZXY":this._x=f*h*u-l*d*m,this._y=l*d*u+f*h*m,this._z=l*h*m+f*d*u,this._w=l*h*u-f*d*m;break;case"ZYX":this._x=f*h*u-l*d*m,this._y=l*d*u+f*h*m,this._z=l*h*m-f*d*u,this._w=l*h*u+f*d*m;break;case"YZX":this._x=f*h*u+l*d*m,this._y=l*d*u+f*h*m,this._z=l*h*m-f*d*u,this._w=l*h*u-f*d*m;break;case"XZY":this._x=f*h*u-l*d*m,this._y=l*d*u-f*h*m,this._z=l*h*m+f*d*u,this._w=l*h*u+f*d*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],u=t[10],f=n+o+u;if(f>0){let d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(r-l)*d,this._z=(a-s)*d}else if(n>o&&n>u){let d=2*Math.sqrt(1+n-o-u);this._w=(h-c)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+l)/d}else if(o>u){let d=2*Math.sqrt(1+o-n-u);this._w=(r-l)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(c+h)/d}else{let d=2*Math.sqrt(1+u-n-o);this._w=(a-s)/d,this._x=(r+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ke(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-s*o,this._w=a*h-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,a=this._w,o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;let c=1-o*o;if(c<=Number.EPSILON){let d=1-t;return this._w=d*a+t*this._w,this._x=d*n+t*this._x,this._y=d*s+t*this._y,this._z=d*r+t*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-t)*h)/l,f=Math.sin(t*h)/l;return this._w=a*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},O=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Qu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Qu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),h=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+c*l+a*u-o*h,this.y=n+c*h+o*l-r*u,this.z=s+c*u+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Cc.copy(this).projectOnVector(e),this.sub(Cc)}reflect(e){return this.sub(Cc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ke(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Cc=new O,Qu=new fi,We=class i{constructor(e,t,n,s,r,a,o,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],d=n[5],m=n[8],x=s[0],g=s[3],p=s[6],v=s[1],b=s[4],_=s[7],I=s[2],S=s[5],A=s[8];return r[0]=a*x+o*v+c*I,r[3]=a*g+o*b+c*S,r[6]=a*p+o*_+c*A,r[1]=l*x+h*v+u*I,r[4]=l*g+h*b+u*S,r[7]=l*p+h*_+u*A,r[2]=f*x+d*v+m*I,r[5]=f*g+d*b+m*S,r[8]=f*p+d*_+m*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-n*r*h+n*o*c+s*r*l-s*a*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=h*a-o*l,f=o*c-h*r,d=l*r-a*c,m=t*u+n*f+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return e[0]=u*x,e[1]=(s*l-h*n)*x,e[2]=(o*n-s*a)*x,e[3]=f*x,e[4]=(h*t-s*c)*x,e[5]=(s*r-o*t)*x,e[6]=d*x,e[7]=(n*c-l*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Ic.makeScale(e,t)),this}rotate(e){return this.premultiply(Ic.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ic.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Ic=new We;function Ch(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function $r(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function xf(){let i=$r("canvas");return i.style.display="block",i}var ed={};function Zs(i){i in ed||(ed[i]=!0,console.warn(i))}function yf(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var td=new We().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),nd=new We().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function qm(){let i={enabled:!0,workingColorSpace:Ji,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ot&&(s.r=hi(s.r),s.g=hi(s.g),s.b=hi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ot&&(s.r=Xs(s.r),s.g=Xs(s.g),s.b=Xs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===kn?Xr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Zs("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Zs("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ji]:{primaries:e,whitePoint:n,transfer:Xr,toXYZ:td,fromXYZ:nd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Bt},outputColorSpaceConfig:{drawingBufferColorSpace:Bt}},[Bt]:{primaries:e,whitePoint:n,transfer:ot,toXYZ:td,fromXYZ:nd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Bt}}}),i}var tt=qm();function hi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Xs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Rs,wo=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Rs===void 0&&(Rs=$r("canvas")),Rs.width=e.width,Rs.height=e.height;let s=Rs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Rs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=$r("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=hi(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(hi(t[n]/255)*255):t[n]=hi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},$m=0,Ks=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:$m++}),this.uuid=Xn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Pc(s[a].image)):r.push(Pc(s[a]))}else r=Pc(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Pc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?wo.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Ym=0,Lc=new O,an=class i extends di{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Ci,s=Ci,r=Dn,a=Ni,o=Tn,c=On,l=i.DEFAULT_ANISOTROPY,h=kn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ym++}),this.uuid=Xn(),this.name="",this.source=new Ks(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ue(0,0),this.repeat=new ue(1,1),this.center=new ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Lc).x}get height(){return this.source.getSize(Lc).y}get depth(){return this.source.getSize(Lc).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==xh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Pi:e.x=e.x-Math.floor(e.x);break;case Ci:e.x=e.x<0?0:1;break;case bo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Pi:e.y=e.y-Math.floor(e.y);break;case Ci:e.y=e.y<0?0:1;break;case bo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};an.DEFAULT_IMAGE=null;an.DEFAULT_MAPPING=xh;an.DEFAULT_ANISOTROPY=1;var Ct=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,c=e.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],m=c[9],x=c[2],g=c[6],p=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+x)<.1&&Math.abs(m+g)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let b=(l+1)/2,_=(d+1)/2,I=(p+1)/2,S=(h+f)/4,A=(u+x)/4,R=(m+g)/4;return b>_&&b>I?b<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(b),s=S/n,r=A/n):_>I?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=S/s,r=R/s):I<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(I),n=A/r,s=R/r),this.set(n,s,r,t),this}let v=Math.sqrt((g-m)*(g-m)+(u-x)*(u-x)+(f-h)*(f-h));return Math.abs(v)<.001&&(v=1),this.x=(g-m)/v,this.y=(u-x)/v,this.z=(f-h)/v,this.w=Math.acos((l+d+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ke(this.x,e.x,t.x),this.y=Ke(this.y,e.y,t.y),this.z=Ke(this.z,e.z,t.z),this.w=Ke(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ke(this.x,e,t),this.y=Ke(this.y,e,t),this.z=Ke(this.z,e,t),this.w=Ke(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ke(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},To=class extends di{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Dn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Ct(0,0,e,t),this.scissorTest=!1,this.viewport=new Ct(0,0,e,t);let s={width:e,height:t,depth:n.depth},r=new an(s);this.textures=[];let a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:Dn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Ks(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},qn=class extends To{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Yr=class extends an{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=cn,this.minFilter=cn,this.wrapR=Ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ao=class extends an{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=cn,this.minFilter=cn,this.wrapR=Ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var wn=class{constructor(e=new O(1/0,1/0,1/0),t=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Rn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Rn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Rn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Rn):Rn.fromBufferAttribute(r,a),Rn.applyMatrix4(e.matrixWorld),this.expandByPoint(Rn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Xa.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Xa.copy(n.boundingBox)),Xa.applyMatrix4(e.matrixWorld),this.union(Xa)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Rn),Rn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Cr),qa.subVectors(this.max,Cr),Cs.subVectors(e.a,Cr),Is.subVectors(e.b,Cr),Ps.subVectors(e.c,Cr),Si.subVectors(Is,Cs),Ei.subVectors(Ps,Is),Wi.subVectors(Cs,Ps);let t=[0,-Si.z,Si.y,0,-Ei.z,Ei.y,0,-Wi.z,Wi.y,Si.z,0,-Si.x,Ei.z,0,-Ei.x,Wi.z,0,-Wi.x,-Si.y,Si.x,0,-Ei.y,Ei.x,0,-Wi.y,Wi.x,0];return!Dc(t,Cs,Is,Ps,qa)||(t=[1,0,0,0,1,0,0,0,1],!Dc(t,Cs,Is,Ps,qa))?!1:($a.crossVectors(Si,Ei),t=[$a.x,$a.y,$a.z],Dc(t,Cs,Is,Ps,qa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Rn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Rn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(si[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),si[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),si[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),si[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),si[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),si[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),si[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),si[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(si),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},si=[new O,new O,new O,new O,new O,new O,new O,new O],Rn=new O,Xa=new wn,Cs=new O,Is=new O,Ps=new O,Si=new O,Ei=new O,Wi=new O,Cr=new O,qa=new O,$a=new O,Xi=new O;function Dc(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Xi.fromArray(i,r);let o=s.x*Math.abs(Xi.x)+s.y*Math.abs(Xi.y)+s.z*Math.abs(Xi.z),c=e.dot(Xi),l=t.dot(Xi),h=n.dot(Xi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}var Zm=new wn,Ir=new O,Uc=new O,pi=class{constructor(e=new O,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Zm.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ir.subVectors(e,this.center);let t=Ir.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Ir,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Uc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ir.copy(e.center).add(Uc)),this.expandByPoint(Ir.copy(e.center).sub(Uc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},ri=new O,Nc=new O,Ya=new O,wi=new O,Fc=new O,Za=new O,Oc=new O,Zr=class{constructor(e=new O,t=new O(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ri)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ri.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ri.copy(this.origin).addScaledVector(this.direction,t),ri.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Nc.copy(e).add(t).multiplyScalar(.5),Ya.copy(t).sub(e).normalize(),wi.copy(this.origin).sub(Nc);let r=e.distanceTo(t)*.5,a=-this.direction.dot(Ya),o=wi.dot(this.direction),c=-wi.dot(Ya),l=wi.lengthSq(),h=Math.abs(1-a*a),u,f,d,m;if(h>0)if(u=a*c-o,f=a*o-c,m=r*h,u>=0)if(f>=-m)if(f<=m){let x=1/h;u*=x,f*=x,d=u*(u+a*f+2*o)+f*(a*u+f+2*c)+l}else f=r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*c)+l;else f<=-m?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l):f<=m?(u=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+l):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Nc).addScaledVector(Ya,f),d}intersectSphere(e,t){ri.subVectors(e.center,this.origin);let n=ri.dot(this.direction),s=ri.dot(ri)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(e.min.x-f.x)*l,s=(e.max.x-f.x)*l):(n=(e.max.x-f.x)*l,s=(e.min.x-f.x)*l),h>=0?(r=(e.min.y-f.y)*h,a=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,a=(e.min.y-f.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-f.z)*u,c=(e.max.z-f.z)*u):(o=(e.max.z-f.z)*u,c=(e.min.z-f.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,ri)!==null}intersectTriangle(e,t,n,s,r){Fc.subVectors(t,e),Za.subVectors(n,e),Oc.crossVectors(Fc,Za);let a=this.direction.dot(Oc),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;wi.subVectors(this.origin,e);let c=o*this.direction.dot(Za.crossVectors(wi,Za));if(c<0)return null;let l=o*this.direction.dot(Fc.cross(wi));if(l<0||c+l>a)return null;let h=-o*wi.dot(Oc);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},dt=class i{constructor(e,t,n,s,r,a,o,c,l,h,u,f,d,m,x,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,h,u,f,d,m,x,g)}set(e,t,n,s,r,a,o,c,l,h,u,f,d,m,x,g){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/Ls.setFromMatrixColumn(e,0).length(),r=1/Ls.setFromMatrixColumn(e,1).length(),a=1/Ls.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let f=a*h,d=a*u,m=o*h,x=o*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=d+m*l,t[5]=f-x*l,t[9]=-o*c,t[2]=x-f*l,t[6]=m+d*l,t[10]=a*c}else if(e.order==="YXZ"){let f=c*h,d=c*u,m=l*h,x=l*u;t[0]=f+x*o,t[4]=m*o-d,t[8]=a*l,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=d*o-m,t[6]=x+f*o,t[10]=a*c}else if(e.order==="ZXY"){let f=c*h,d=c*u,m=l*h,x=l*u;t[0]=f-x*o,t[4]=-a*u,t[8]=m+d*o,t[1]=d+m*o,t[5]=a*h,t[9]=x-f*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){let f=a*h,d=a*u,m=o*h,x=o*u;t[0]=c*h,t[4]=m*l-d,t[8]=f*l+x,t[1]=c*u,t[5]=x*l+f,t[9]=d*l-m,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){let f=a*c,d=a*l,m=o*c,x=o*l;t[0]=c*h,t[4]=x-f*u,t[8]=m*u+d,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=d*u+m,t[10]=f-x*u}else if(e.order==="XZY"){let f=a*c,d=a*l,m=o*c,x=o*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=f*u+x,t[5]=a*h,t[9]=d*u-m,t[2]=m*u-d,t[6]=o*h,t[10]=x*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Km,e,Jm)}lookAt(e,t,n){let s=this.elements;return mn.subVectors(e,t),mn.lengthSq()===0&&(mn.z=1),mn.normalize(),Ti.crossVectors(n,mn),Ti.lengthSq()===0&&(Math.abs(n.z)===1?mn.x+=1e-4:mn.z+=1e-4,mn.normalize(),Ti.crossVectors(n,mn)),Ti.normalize(),Ka.crossVectors(mn,Ti),s[0]=Ti.x,s[4]=Ka.x,s[8]=mn.x,s[1]=Ti.y,s[5]=Ka.y,s[9]=mn.y,s[2]=Ti.z,s[6]=Ka.z,s[10]=mn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],d=n[13],m=n[2],x=n[6],g=n[10],p=n[14],v=n[3],b=n[7],_=n[11],I=n[15],S=s[0],A=s[4],R=s[8],y=s[12],M=s[1],C=s[5],U=s[9],D=s[13],N=s[2],G=s[6],V=s[10],j=s[14],W=s[3],ce=s[7],fe=s[11],Ae=s[15];return r[0]=a*S+o*M+c*N+l*W,r[4]=a*A+o*C+c*G+l*ce,r[8]=a*R+o*U+c*V+l*fe,r[12]=a*y+o*D+c*j+l*Ae,r[1]=h*S+u*M+f*N+d*W,r[5]=h*A+u*C+f*G+d*ce,r[9]=h*R+u*U+f*V+d*fe,r[13]=h*y+u*D+f*j+d*Ae,r[2]=m*S+x*M+g*N+p*W,r[6]=m*A+x*C+g*G+p*ce,r[10]=m*R+x*U+g*V+p*fe,r[14]=m*y+x*D+g*j+p*Ae,r[3]=v*S+b*M+_*N+I*W,r[7]=v*A+b*C+_*G+I*ce,r[11]=v*R+b*U+_*V+I*fe,r[15]=v*y+b*D+_*j+I*Ae,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],u=e[6],f=e[10],d=e[14],m=e[3],x=e[7],g=e[11],p=e[15];return m*(+r*c*u-s*l*u-r*o*f+n*l*f+s*o*d-n*c*d)+x*(+t*c*d-t*l*f+r*a*f-s*a*d+s*l*h-r*c*h)+g*(+t*l*u-t*o*d-r*a*u+n*a*d+r*o*h-n*l*h)+p*(-s*o*h-t*c*u+t*o*f+s*a*u-n*a*f+n*c*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=e[9],f=e[10],d=e[11],m=e[12],x=e[13],g=e[14],p=e[15],v=u*g*l-x*f*l+x*c*d-o*g*d-u*c*p+o*f*p,b=m*f*l-h*g*l-m*c*d+a*g*d+h*c*p-a*f*p,_=h*x*l-m*u*l+m*o*d-a*x*d-h*o*p+a*u*p,I=m*u*c-h*x*c-m*o*f+a*x*f+h*o*g-a*u*g,S=t*v+n*b+s*_+r*I;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/S;return e[0]=v*A,e[1]=(x*f*r-u*g*r-x*s*d+n*g*d+u*s*p-n*f*p)*A,e[2]=(o*g*r-x*c*r+x*s*l-n*g*l-o*s*p+n*c*p)*A,e[3]=(u*c*r-o*f*r-u*s*l+n*f*l+o*s*d-n*c*d)*A,e[4]=b*A,e[5]=(h*g*r-m*f*r+m*s*d-t*g*d-h*s*p+t*f*p)*A,e[6]=(m*c*r-a*g*r-m*s*l+t*g*l+a*s*p-t*c*p)*A,e[7]=(a*f*r-h*c*r+h*s*l-t*f*l-a*s*d+t*c*d)*A,e[8]=_*A,e[9]=(m*u*r-h*x*r-m*n*d+t*x*d+h*n*p-t*u*p)*A,e[10]=(a*x*r-m*o*r+m*n*l-t*x*l-a*n*p+t*o*p)*A,e[11]=(h*o*r-a*u*r-h*n*l+t*u*l+a*n*d-t*o*d)*A,e[12]=I*A,e[13]=(h*x*s-m*u*s+m*n*f-t*x*f-h*n*g+t*u*g)*A,e[14]=(m*o*s-a*x*s-m*n*c+t*x*c+a*n*g-t*o*g)*A,e[15]=(a*u*s-h*o*s+h*n*c-t*u*c-a*n*f+t*o*f)*A,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,h=a+a,u=o+o,f=r*l,d=r*h,m=r*u,x=a*h,g=a*u,p=o*u,v=c*l,b=c*h,_=c*u,I=n.x,S=n.y,A=n.z;return s[0]=(1-(x+p))*I,s[1]=(d+_)*I,s[2]=(m-b)*I,s[3]=0,s[4]=(d-_)*S,s[5]=(1-(f+p))*S,s[6]=(g+v)*S,s[7]=0,s[8]=(m+b)*A,s[9]=(g-v)*A,s[10]=(1-(f+x))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=Ls.set(s[0],s[1],s[2]).length(),a=Ls.set(s[4],s[5],s[6]).length(),o=Ls.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Cn.copy(this);let l=1/r,h=1/a,u=1/o;return Cn.elements[0]*=l,Cn.elements[1]*=l,Cn.elements[2]*=l,Cn.elements[4]*=h,Cn.elements[5]*=h,Cn.elements[6]*=h,Cn.elements[8]*=u,Cn.elements[9]*=u,Cn.elements[10]*=u,t.setFromRotationMatrix(Cn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=Ln,c=!1){let l=this.elements,h=2*r/(t-e),u=2*r/(n-s),f=(t+e)/(t-e),d=(n+s)/(n-s),m,x;if(c)m=r/(a-r),x=a*r/(a-r);else if(o===Ln)m=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===qr)m=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Ln,c=!1){let l=this.elements,h=2/(t-e),u=2/(n-s),f=-(t+e)/(t-e),d=-(n+s)/(n-s),m,x;if(c)m=1/(a-r),x=a/(a-r);else if(o===Ln)m=-2/(a-r),x=-(a+r)/(a-r);else if(o===qr)m=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=u,l[9]=0,l[13]=d,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Ls=new O,Cn=new dt,Km=new O(0,0,0),Jm=new O(1,1,1),Ti=new O,Ka=new O,mn=new O,id=new dt,sd=new fi,Un=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(Ke(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ke(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ke(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ke(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Ke(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Ke(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return id.makeRotationFromQuaternion(e),this.setFromRotationMatrix(id,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return sd.setFromEuler(this),this.setFromQuaternion(sd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Un.DEFAULT_ORDER="XYZ";var Kr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},jm=0,rd=new O,Ds=new fi,ai=new dt,Ja=new O,Pr=new O,Qm=new O,eg=new fi,ad=new O(1,0,0),od=new O(0,1,0),ld=new O(0,0,1),cd={type:"added"},tg={type:"removed"},Us={type:"childadded",child:null},Bc={type:"childremoved",child:null},gt=class i extends di{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:jm++}),this.uuid=Xn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new O,t=new Un,n=new fi,s=new O(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new dt},normalMatrix:{value:new We}}),this.matrix=new dt,this.matrixWorld=new dt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Kr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ds.setFromAxisAngle(e,t),this.quaternion.multiply(Ds),this}rotateOnWorldAxis(e,t){return Ds.setFromAxisAngle(e,t),this.quaternion.premultiply(Ds),this}rotateX(e){return this.rotateOnAxis(ad,e)}rotateY(e){return this.rotateOnAxis(od,e)}rotateZ(e){return this.rotateOnAxis(ld,e)}translateOnAxis(e,t){return rd.copy(e).applyQuaternion(this.quaternion),this.position.add(rd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ad,e)}translateY(e){return this.translateOnAxis(od,e)}translateZ(e){return this.translateOnAxis(ld,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ai.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ja.copy(e):Ja.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Pr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ai.lookAt(Pr,Ja,this.up):ai.lookAt(Ja,Pr,this.up),this.quaternion.setFromRotationMatrix(ai),s&&(ai.extractRotation(s.matrixWorld),Ds.setFromRotationMatrix(ai),this.quaternion.premultiply(Ds.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(cd),Us.child=e,this.dispatchEvent(Us),Us.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(tg),Bc.child=e,this.dispatchEvent(Bc),Bc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ai.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ai.multiply(e.parent.matrixWorld)),e.applyMatrix4(ai),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(cd),Us.child=e,this.dispatchEvent(Us),Us.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Pr,e,Qm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Pr,eg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){let o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),u=a(e.shapes),f=a(e.skeletons),d=a(e.animations),m=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),m.length>0&&(n.nodes=m)}return n.object=s,n;function a(o){let c=[];for(let l in o){let h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};gt.DEFAULT_UP=new O(0,1,0);gt.DEFAULT_MATRIX_AUTO_UPDATE=!0;gt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var In=new O,oi=new O,kc=new O,li=new O,Ns=new O,Fs=new O,hd=new O,zc=new O,Hc=new O,Gc=new O,Vc=new Ct,Wc=new Ct,Xc=new Ct,ci=class i{constructor(e=new O,t=new O,n=new O){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),In.subVectors(e,t),s.cross(In);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){In.subVectors(s,t),oi.subVectors(n,t),kc.subVectors(e,t);let a=In.dot(In),o=In.dot(oi),c=In.dot(kc),l=oi.dot(oi),h=oi.dot(kc),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;let f=1/u,d=(l*c-o*h)*f,m=(a*h-o*c)*f;return r.set(1-d-m,m,d)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,li)===null?!1:li.x>=0&&li.y>=0&&li.x+li.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,li)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,li.x),c.addScaledVector(a,li.y),c.addScaledVector(o,li.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return Vc.setScalar(0),Wc.setScalar(0),Xc.setScalar(0),Vc.fromBufferAttribute(e,t),Wc.fromBufferAttribute(e,n),Xc.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Vc,r.x),a.addScaledVector(Wc,r.y),a.addScaledVector(Xc,r.z),a}static isFrontFacing(e,t,n,s){return In.subVectors(n,t),oi.subVectors(e,t),In.cross(oi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return In.subVectors(this.c,this.b),oi.subVectors(this.a,this.b),In.cross(oi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;Ns.subVectors(s,n),Fs.subVectors(r,n),zc.subVectors(e,n);let c=Ns.dot(zc),l=Fs.dot(zc);if(c<=0&&l<=0)return t.copy(n);Hc.subVectors(e,s);let h=Ns.dot(Hc),u=Fs.dot(Hc);if(h>=0&&u<=h)return t.copy(s);let f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return a=c/(c-h),t.copy(n).addScaledVector(Ns,a);Gc.subVectors(e,r);let d=Ns.dot(Gc),m=Fs.dot(Gc);if(m>=0&&d<=m)return t.copy(r);let x=d*l-c*m;if(x<=0&&l>=0&&m<=0)return o=l/(l-m),t.copy(n).addScaledVector(Fs,o);let g=h*m-d*u;if(g<=0&&u-h>=0&&d-m>=0)return hd.subVectors(r,s),o=(u-h)/(u-h+(d-m)),t.copy(s).addScaledVector(hd,o);let p=1/(g+x+f);return a=x*p,o=f*p,t.copy(n).addScaledVector(Ns,a).addScaledVector(Fs,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},_f={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ai={h:0,s:0,l:0},ja={h:0,s:0,l:0};function qc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Te=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Bt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=tt.workingColorSpace){return this.r=e,this.g=t,this.b=n,tt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=tt.workingColorSpace){if(e=Rh(e,1),t=Ke(t,0,1),n=Ke(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=qc(a,r,e+1/3),this.g=qc(a,r,e),this.b=qc(a,r,e-1/3)}return tt.colorSpaceToWorking(this,s),this}setStyle(e,t=Bt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Bt){let n=_f[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=hi(e.r),this.g=hi(e.g),this.b=hi(e.b),this}copyLinearToSRGB(e){return this.r=Xs(e.r),this.g=Xs(e.g),this.b=Xs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Bt){return tt.workingToColorSpace(jt.copy(this),e),Math.round(Ke(jt.r*255,0,255))*65536+Math.round(Ke(jt.g*255,0,255))*256+Math.round(Ke(jt.b*255,0,255))}getHexString(e=Bt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.workingToColorSpace(jt.copy(this),t);let n=jt.r,s=jt.g,r=jt.b,a=Math.max(n,s,r),o=Math.min(n,s,r),c,l,h=(o+a)/2;if(o===a)c=0,l=0;else{let u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=tt.workingColorSpace){return tt.workingToColorSpace(jt.copy(this),t),e.r=jt.r,e.g=jt.g,e.b=jt.b,e}getStyle(e=Bt){tt.workingToColorSpace(jt.copy(this),e);let t=jt.r,n=jt.g,s=jt.b;return e!==Bt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Ai),this.setHSL(Ai.h+e,Ai.s+t,Ai.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ai),e.getHSL(ja);let n=Hr(Ai.h,ja.h,t),s=Hr(Ai.s,ja.s,t),r=Hr(Ai.l,ja.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},jt=new Te;Te.NAMES=_f;var ng=0,$n=class extends di{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ng++}),this.uuid=Xn(),this.name="",this.type="Material",this.blending=Zi,this.side=ui,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=vo,this.blendDst=Mo,this.blendEquation=Ii,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Te(0,0,0),this.blendAlpha=0,this.depthFunc=Ki,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=rh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Yi,this.stencilZFail=Yi,this.stencilZPass=Yi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Zi&&(n.blending=this.blending),this.side!==ui&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==vo&&(n.blendSrc=this.blendSrc),this.blendDst!==Mo&&(n.blendDst=this.blendDst),this.blendEquation!==Ii&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ki&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==rh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Yi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Yi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Yi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},ct=class extends $n{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Te(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.combine=gh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Ot=new O,Qa=new ue,ig=0,Ut=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ig++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Eo,this.updateRanges=[],this.gpuType=Bn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Qa.fromBufferAttribute(this,t),Qa.applyMatrix3(e),this.setXY(t,Qa.x,Qa.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix3(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix4(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyNormalMatrix(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.transformDirection(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Pn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=at(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Pn(t,this.array)),t}setX(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Pn(t,this.array)),t}setY(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Pn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Pn(t,this.array)),t}setW(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),n=at(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array),r=at(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Eo&&(e.usage=this.usage),e}};var Jr=class extends Ut{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var jr=class extends Ut{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Pe=class extends Ut{constructor(e,t,n){super(new Float32Array(e),t,n)}},sg=0,En=new dt,$c=new gt,Os=new O,gn=new wn,Lr=new wn,qt=new O,je=class i extends di{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:sg++}),this.uuid=Xn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ch(e)?jr:Jr)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new We().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return En.makeRotationFromQuaternion(e),this.applyMatrix4(En),this}rotateX(e){return En.makeRotationX(e),this.applyMatrix4(En),this}rotateY(e){return En.makeRotationY(e),this.applyMatrix4(En),this}rotateZ(e){return En.makeRotationZ(e),this.applyMatrix4(En),this}translate(e,t,n){return En.makeTranslation(e,t,n),this.applyMatrix4(En),this}scale(e,t,n){return En.makeScale(e,t,n),this.applyMatrix4(En),this}lookAt(e){return $c.lookAt(e),$c.updateMatrix(),this.applyMatrix4($c.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Os).negate(),this.translate(Os.x,Os.y,Os.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Pe(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new wn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];gn.setFromBufferAttribute(r),this.morphTargetsRelative?(qt.addVectors(this.boundingBox.min,gn.min),this.boundingBox.expandByPoint(qt),qt.addVectors(this.boundingBox.max,gn.max),this.boundingBox.expandByPoint(qt)):(this.boundingBox.expandByPoint(gn.min),this.boundingBox.expandByPoint(gn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new pi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(e){let n=this.boundingSphere.center;if(gn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Lr.setFromBufferAttribute(o),this.morphTargetsRelative?(qt.addVectors(gn.min,Lr.min),gn.expandByPoint(qt),qt.addVectors(gn.max,Lr.max),gn.expandByPoint(qt)):(gn.expandByPoint(Lr.min),gn.expandByPoint(Lr.max))}gn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)qt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(qt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)qt.fromBufferAttribute(o,l),c&&(Os.fromBufferAttribute(e,l),qt.add(Os)),s=Math.max(s,n.distanceToSquared(qt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ut(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],c=[];for(let R=0;R<n.count;R++)o[R]=new O,c[R]=new O;let l=new O,h=new O,u=new O,f=new ue,d=new ue,m=new ue,x=new O,g=new O;function p(R,y,M){l.fromBufferAttribute(n,R),h.fromBufferAttribute(n,y),u.fromBufferAttribute(n,M),f.fromBufferAttribute(r,R),d.fromBufferAttribute(r,y),m.fromBufferAttribute(r,M),h.sub(l),u.sub(l),d.sub(f),m.sub(f);let C=1/(d.x*m.y-m.x*d.y);isFinite(C)&&(x.copy(h).multiplyScalar(m.y).addScaledVector(u,-d.y).multiplyScalar(C),g.copy(u).multiplyScalar(d.x).addScaledVector(h,-m.x).multiplyScalar(C),o[R].add(x),o[y].add(x),o[M].add(x),c[R].add(g),c[y].add(g),c[M].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let R=0,y=v.length;R<y;++R){let M=v[R],C=M.start,U=M.count;for(let D=C,N=C+U;D<N;D+=3)p(e.getX(D+0),e.getX(D+1),e.getX(D+2))}let b=new O,_=new O,I=new O,S=new O;function A(R){I.fromBufferAttribute(s,R),S.copy(I);let y=o[R];b.copy(y),b.sub(I.multiplyScalar(I.dot(y))).normalize(),_.crossVectors(S,y);let C=_.dot(c[R])<0?-1:1;a.setXYZW(R,b.x,b.y,b.z,C)}for(let R=0,y=v.length;R<y;++R){let M=v[R],C=M.start,U=M.count;for(let D=C,N=C+U;D<N;D+=3)A(e.getX(D+0)),A(e.getX(D+1)),A(e.getX(D+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ut(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);let s=new O,r=new O,a=new O,o=new O,c=new O,l=new O,h=new O,u=new O;if(e)for(let f=0,d=e.count;f<d;f+=3){let m=e.getX(f+0),x=e.getX(f+1),g=e.getX(f+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,g),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,m),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),o.add(h),c.add(h),l.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let f=0,d=t.count;f<d;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)qt.fromBufferAttribute(e,t),qt.normalize(),e.setXYZ(t,qt.x,qt.y,qt.z)}toNonIndexed(){function e(o,c){let l=o.array,h=o.itemSize,u=o.normalized,f=new l.constructor(c.length*h),d=0,m=0;for(let x=0,g=c.length;x<g;x++){o.isInterleavedBufferAttribute?d=c[x]*o.data.stride+o.offset:d=c[x]*h;for(let p=0;p<h;p++)f[m++]=l[d++]}return new Ut(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=e(c,n);t.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){let f=l[h],d=e(f,n);c.push(d)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){let d=l[u];h.push(d.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(t))}let r=e.morphAttributes;for(let l in r){let h=[],u=r[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let l=0,h=a.length;l<h;l++){let u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},ud=new dt,qi=new Zr,eo=new pi,dd=new O,to=new O,no=new O,io=new O,Yc=new O,so=new O,fd=new O,ro=new O,_e=class extends gt{constructor(e=new je,t=new ct){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){so.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=o[c],u=r[c];h!==0&&(Yc.fromBufferAttribute(u,e),a?so.addScaledVector(Yc,h):so.addScaledVector(Yc.sub(t),h))}t.add(so)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),eo.copy(n.boundingSphere),eo.applyMatrix4(r),qi.copy(e.ray).recast(e.near),!(eo.containsPoint(qi.origin)===!1&&(qi.intersectSphere(eo,dd)===null||qi.origin.distanceToSquared(dd)>(e.far-e.near)**2))&&(ud.copy(r).invert(),qi.copy(e.ray).applyMatrix4(ud),!(n.boundingBox!==null&&qi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,qi)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=f.length;m<x;m++){let g=f[m],p=a[g.materialIndex],v=Math.max(g.start,d.start),b=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let _=v,I=b;_<I;_+=3){let S=o.getX(_),A=o.getX(_+1),R=o.getX(_+2);s=ao(this,p,e,n,l,h,u,S,A,R),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,d.start),x=Math.min(o.count,d.start+d.count);for(let g=m,p=x;g<p;g+=3){let v=o.getX(g),b=o.getX(g+1),_=o.getX(g+2);s=ao(this,a,e,n,l,h,u,v,b,_),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let m=0,x=f.length;m<x;m++){let g=f[m],p=a[g.materialIndex],v=Math.max(g.start,d.start),b=Math.min(c.count,Math.min(g.start+g.count,d.start+d.count));for(let _=v,I=b;_<I;_+=3){let S=_,A=_+1,R=_+2;s=ao(this,p,e,n,l,h,u,S,A,R),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,d.start),x=Math.min(c.count,d.start+d.count);for(let g=m,p=x;g<p;g+=3){let v=g,b=g+1,_=g+2;s=ao(this,a,e,n,l,h,u,v,b,_),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function rg(i,e,t,n,s,r,a,o){let c;if(e.side===Ht?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===ui,o),c===null)return null;ro.copy(o),ro.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(ro);return l<t.near||l>t.far?null:{distance:l,point:ro.clone(),object:i}}function ao(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,to),i.getVertexPosition(c,no),i.getVertexPosition(l,io);let h=rg(i,e,t,n,to,no,io,fd);if(h){let u=new O;ci.getBarycoord(fd,to,no,io,u),s&&(h.uv=ci.getInterpolatedAttribute(s,o,c,l,u,new ue)),r&&(h.uv1=ci.getInterpolatedAttribute(r,o,c,l,u,new ue)),a&&(h.normal=ci.getInterpolatedAttribute(a,o,c,l,u,new O),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let f={a:o,b:c,c:l,normal:new O,materialIndex:0};ci.getNormal(to,no,io,f.normal),h.face=f,h.barycoord=u}return h}var xt=class i extends je{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],h=[],u=[],f=0,d=0;m("z","y","x",-1,-1,n,t,e,a,r,0),m("z","y","x",1,-1,n,t,-e,a,r,1),m("x","z","y",1,1,e,n,t,s,a,2),m("x","z","y",1,-1,e,n,-t,s,a,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Pe(l,3)),this.setAttribute("normal",new Pe(h,3)),this.setAttribute("uv",new Pe(u,2));function m(x,g,p,v,b,_,I,S,A,R,y){let M=_/A,C=I/R,U=_/2,D=I/2,N=S/2,G=A+1,V=R+1,j=0,W=0,ce=new O;for(let fe=0;fe<V;fe++){let Ae=fe*C-D;for(let Je=0;Je<G;Je++){let pt=Je*M-U;ce[x]=pt*v,ce[g]=Ae*b,ce[p]=N,l.push(ce.x,ce.y,ce.z),ce[x]=0,ce[g]=0,ce[p]=S>0?1:-1,h.push(ce.x,ce.y,ce.z),u.push(Je/A),u.push(1-fe/R),j+=1}}for(let fe=0;fe<R;fe++)for(let Ae=0;Ae<A;Ae++){let Je=f+Ae+G*fe,pt=f+Ae+G*(fe+1),Mt=f+(Ae+1)+G*(fe+1),st=f+(Ae+1)+G*fe;c.push(Je,pt,st),c.push(pt,Mt,st),W+=6}o.addGroup(d,W,y),d+=W,f+=j}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function rs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function tn(i){let e={};for(let t=0;t<i.length;t++){let n=rs(i[t]);for(let s in n)e[s]=n[s]}return e}function ag(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Ih(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}var vf={clone:rs,merge:tn},og=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,lg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Nn=class extends $n{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=og,this.fragmentShader=lg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=rs(e.uniforms),this.uniformsGroups=ag(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Qr=class extends gt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new dt,this.projectionMatrix=new dt,this.projectionMatrixInverse=new dt,this.coordinateSystem=Ln,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Ri=new O,pd=new ue,md=new ue,Qt=class extends Qr{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ys*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(zr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ys*2*Math.atan(Math.tan(zr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ri.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ri.x,Ri.y).multiplyScalar(-e/Ri.z),Ri.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ri.x,Ri.y).multiplyScalar(-e/Ri.z)}getViewSize(e,t){return this.getViewBounds(e,pd,md),t.subVectors(md,pd)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(zr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Bs=-90,ks=1,Ro=class extends gt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Qt(Bs,ks,e,t);s.layers=this.layers,this.add(s);let r=new Qt(Bs,ks,e,t);r.layers=this.layers,this.add(r);let a=new Qt(Bs,ks,e,t);a.layers=this.layers,this.add(a);let o=new Qt(Bs,ks,e,t);o.layers=this.layers,this.add(o);let c=new Qt(Bs,ks,e,t);c.layers=this.layers,this.add(c);let l=new Qt(Bs,ks,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(let l of t)this.remove(l);if(e===Ln)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===qr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,f,d),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},ea=class extends an{constructor(e=[],t=ns,n,s,r,a,o,c,l,h){super(e,t,n,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Co=class extends qn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new ea(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new xt(5,5,5),r=new Nn({name:"CubemapFromEquirect",uniforms:rs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ht,blending:vi});r.uniforms.tEquirect.value=t;let a=new _e(s,r),o=t.minFilter;return t.minFilter===Ni&&(t.minFilter=Dn),new Ro(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}},qe=class extends gt{constructor(){super(),this.isGroup=!0,this.type="Group"}},cg={type:"move"},Js=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new qe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new qe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new qe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(let x of e.hand.values()){let g=t.getJointPose(x,n),p=this._getHandJoint(l,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,m=.005;l.inputState.pinching&&f>d+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=d-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(cg)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new qe;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var ta=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Te(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},na=class extends gt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Un,this.environmentIntensity=1,this.environmentRotation=new Un,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},ia=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Eo,this.updateRanges=[],this.version=0,this.uuid=Xn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Xn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Xn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},rn=new O,js=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)rn.fromBufferAttribute(this,t),rn.applyMatrix4(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)rn.fromBufferAttribute(this,t),rn.applyNormalMatrix(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)rn.fromBufferAttribute(this,t),rn.transformDirection(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Pn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=at(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Pn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Pn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Pn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Pn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=at(t,this.array),n=at(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array),r=at(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Ut(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Yn=class extends $n{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Te(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},zs,Dr=new O,Hs=new O,Gs=new O,Vs=new ue,Ur=new ue,Mf=new dt,oo=new O,Nr=new O,lo=new O,gd=new ue,Zc=new ue,xd=new ue,mi=class extends gt{constructor(e=new Yn){if(super(),this.isSprite=!0,this.type="Sprite",zs===void 0){zs=new je;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new ia(t,5);zs.setIndex([0,1,2,0,2,3]),zs.setAttribute("position",new js(n,3,0,!1)),zs.setAttribute("uv",new js(n,2,3,!1))}this.geometry=zs,this.material=e,this.center=new ue(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Hs.setFromMatrixScale(this.matrixWorld),Mf.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Gs.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Hs.multiplyScalar(-Gs.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let a=this.center;co(oo.set(-.5,-.5,0),Gs,a,Hs,s,r),co(Nr.set(.5,-.5,0),Gs,a,Hs,s,r),co(lo.set(.5,.5,0),Gs,a,Hs,s,r),gd.set(0,0),Zc.set(1,0),xd.set(1,1);let o=e.ray.intersectTriangle(oo,Nr,lo,!1,Dr);if(o===null&&(co(Nr.set(-.5,.5,0),Gs,a,Hs,s,r),Zc.set(0,1),o=e.ray.intersectTriangle(oo,lo,Nr,!1,Dr),o===null))return;let c=e.ray.origin.distanceTo(Dr);c<e.near||c>e.far||t.push({distance:c,point:Dr.clone(),uv:ci.getInterpolation(Dr,oo,Nr,lo,gd,Zc,xd,new ue),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function co(i,e,t,n,s,r){Vs.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Ur.x=r*Vs.x-s*Vs.y,Ur.y=s*Vs.x+r*Vs.y):Ur.copy(Vs),i.copy(e),i.x+=Ur.x,i.y+=Ur.y,i.applyMatrix4(Mf)}var Io=class extends an{constructor(e=null,t=1,n=1,s,r,a,o,c,l=cn,h=cn,u,f){super(null,a,o,c,l,h,s,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Qs=class extends Ut{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ws=new dt,yd=new dt,ho=[],_d=new wn,hg=new dt,Fr=new _e,Or=new pi,gi=class extends _e{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Qs(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,hg)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new wn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ws),_d.copy(e.boundingBox).applyMatrix4(Ws),this.boundingBox.union(_d)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new pi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ws),Or.copy(e.boundingSphere).applyMatrix4(Ws),this.boundingSphere.union(Or)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Fr.geometry=this.geometry,Fr.material=this.material,Fr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Or.copy(this.boundingSphere),Or.applyMatrix4(n),e.ray.intersectsSphere(Or)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ws),yd.multiplyMatrices(n,Ws),Fr.matrixWorld=yd,Fr.raycast(e,ho);for(let a=0,o=ho.length;a<o;a++){let c=ho[a];c.instanceId=r,c.object=this,t.push(c)}ho.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Qs(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Io(new Float32Array(s*this.count),s,this.count,fl,Bn));let r=this.morphTexture.source.data.data,a=0;for(let l=0;l<n.length;l++)a+=n[l];let o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Kc=new O,ug=new O,dg=new We,Wn=class{constructor(e=new O(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Kc.subVectors(n,t).cross(ug.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Kc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||dg.getNormalMatrix(e),s=this.coplanarPoint(Kc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},$i=new pi,fg=new ue(.5,.5),uo=new O,er=class{constructor(e=new Wn,t=new Wn,n=new Wn,s=new Wn,r=new Wn,a=new Wn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Ln,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],u=r[5],f=r[6],d=r[7],m=r[8],x=r[9],g=r[10],p=r[11],v=r[12],b=r[13],_=r[14],I=r[15];if(s[0].setComponents(l-a,d-h,p-m,I-v).normalize(),s[1].setComponents(l+a,d+h,p+m,I+v).normalize(),s[2].setComponents(l+o,d+u,p+x,I+b).normalize(),s[3].setComponents(l-o,d-u,p-x,I-b).normalize(),n)s[4].setComponents(c,f,g,_).normalize(),s[5].setComponents(l-c,d-f,p-g,I-_).normalize();else if(s[4].setComponents(l-c,d-f,p-g,I-_).normalize(),t===Ln)s[5].setComponents(l+c,d+f,p+g,I+_).normalize();else if(t===qr)s[5].setComponents(c,f,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),$i.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),$i.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere($i)}intersectsSprite(e){$i.center.set(0,0,0);let t=fg.distanceTo(e.center);return $i.radius=.7071067811865476+t,$i.applyMatrix4(e.matrixWorld),this.intersectsSphere($i)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(uo.x=s.normal.x>0?e.max.x:e.min.x,uo.y=s.normal.y>0?e.max.y:e.min.y,uo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(uo)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var xi=class extends $n{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Te(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Po=new O,Lo=new O,vd=new dt,Br=new Zr,fo=new pi,Jc=new O,Md=new O,Do=class extends gt{constructor(e=new je,t=new xi){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Po.fromBufferAttribute(t,s-1),Lo.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Po.distanceTo(Lo);e.setAttribute("lineDistance",new Pe(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),fo.copy(n.boundingSphere),fo.applyMatrix4(s),fo.radius+=r,e.ray.intersectsSphere(fo)===!1)return;vd.copy(s).invert(),Br.copy(e.ray).applyMatrix4(vd);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){let d=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let x=d,g=m-1;x<g;x+=l){let p=h.getX(x),v=h.getX(x+1),b=po(this,e,Br,c,p,v,x);b&&t.push(b)}if(this.isLineLoop){let x=h.getX(m-1),g=h.getX(d),p=po(this,e,Br,c,x,g,m-1);p&&t.push(p)}}else{let d=Math.max(0,a.start),m=Math.min(f.count,a.start+a.count);for(let x=d,g=m-1;x<g;x+=l){let p=po(this,e,Br,c,x,x+1,x);p&&t.push(p)}if(this.isLineLoop){let x=po(this,e,Br,c,m-1,d,m-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function po(i,e,t,n,s,r,a){let o=i.geometry.attributes.position;if(Po.fromBufferAttribute(o,s),Lo.fromBufferAttribute(o,r),t.distanceSqToSegment(Po,Lo,Jc,Md)>n)return;Jc.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(Jc);if(!(l<e.near||l>e.far))return{distance:l,point:Md.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var bd=new O,Sd=new O,Li=class extends Do{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)bd.fromBufferAttribute(t,s),Sd.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+bd.distanceTo(Sd);e.setAttribute("lineDistance",new Pe(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var yi=class extends an{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},sa=class extends an{constructor(e,t,n=Fi,s,r,a,o=cn,c=cn,l,h=$s,u=1){if(h!==$s&&h!==hr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:e,height:t,depth:u};super(f,s,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ks(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},ra=class extends an{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var ji=class i extends je{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],a=[],o=[],c=[],l=new O,h=new ue;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=t;u++,f+=3){let d=n+u/t*s;l.x=e*Math.cos(d),l.y=e*Math.sin(d),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[f]/e+1)/2,h.y=(a[f+1]/e+1)/2,c.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Pe(a,3)),this.setAttribute("normal",new Pe(o,3)),this.setAttribute("uv",new Pe(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},hn=class i extends je{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],f=[],d=[],m=0,x=[],g=n/2,p=0;v(),a===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(h),this.setAttribute("position",new Pe(u,3)),this.setAttribute("normal",new Pe(f,3)),this.setAttribute("uv",new Pe(d,2));function v(){let _=new O,I=new O,S=0,A=(t-e)/n;for(let R=0;R<=r;R++){let y=[],M=R/r,C=M*(t-e)+e;for(let U=0;U<=s;U++){let D=U/s,N=D*c+o,G=Math.sin(N),V=Math.cos(N);I.x=C*G,I.y=-M*n+g,I.z=C*V,u.push(I.x,I.y,I.z),_.set(G,A,V).normalize(),f.push(_.x,_.y,_.z),d.push(D,1-M),y.push(m++)}x.push(y)}for(let R=0;R<s;R++)for(let y=0;y<r;y++){let M=x[y][R],C=x[y+1][R],U=x[y+1][R+1],D=x[y][R+1];(e>0||y!==0)&&(h.push(M,C,D),S+=3),(t>0||y!==r-1)&&(h.push(C,U,D),S+=3)}l.addGroup(p,S,0),p+=S}function b(_){let I=m,S=new ue,A=new O,R=0,y=_===!0?e:t,M=_===!0?1:-1;for(let U=1;U<=s;U++)u.push(0,g*M,0),f.push(0,M,0),d.push(.5,.5),m++;let C=m;for(let U=0;U<=s;U++){let N=U/s*c+o,G=Math.cos(N),V=Math.sin(N);A.x=y*V,A.y=g*M,A.z=y*G,u.push(A.x,A.y,A.z),f.push(0,M,0),S.x=G*.5+.5,S.y=V*.5*M+.5,d.push(S.x,S.y),m++}for(let U=0;U<s;U++){let D=I+U,N=C+U;_===!0?h.push(N,N+1,D):h.push(N+1,N,D),R+=3}l.addGroup(p,R,_===!0?1:2),p+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Zn=class i extends hn{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Uo=class i extends je{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),l(n),h(),this.setAttribute("position",new Pe(r,3)),this.setAttribute("normal",new Pe(r.slice(),3)),this.setAttribute("uv",new Pe(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(v){let b=new O,_=new O,I=new O;for(let S=0;S<t.length;S+=3)d(t[S+0],b),d(t[S+1],_),d(t[S+2],I),c(b,_,I,v)}function c(v,b,_,I){let S=I+1,A=[];for(let R=0;R<=S;R++){A[R]=[];let y=v.clone().lerp(_,R/S),M=b.clone().lerp(_,R/S),C=S-R;for(let U=0;U<=C;U++)U===0&&R===S?A[R][U]=y:A[R][U]=y.clone().lerp(M,U/C)}for(let R=0;R<S;R++)for(let y=0;y<2*(S-R)-1;y++){let M=Math.floor(y/2);y%2===0?(f(A[R][M+1]),f(A[R+1][M]),f(A[R][M])):(f(A[R][M+1]),f(A[R+1][M+1]),f(A[R+1][M]))}}function l(v){let b=new O;for(let _=0;_<r.length;_+=3)b.x=r[_+0],b.y=r[_+1],b.z=r[_+2],b.normalize().multiplyScalar(v),r[_+0]=b.x,r[_+1]=b.y,r[_+2]=b.z}function h(){let v=new O;for(let b=0;b<r.length;b+=3){v.x=r[b+0],v.y=r[b+1],v.z=r[b+2];let _=g(v)/2/Math.PI+.5,I=p(v)/Math.PI+.5;a.push(_,1-I)}m(),u()}function u(){for(let v=0;v<a.length;v+=6){let b=a[v+0],_=a[v+2],I=a[v+4],S=Math.max(b,_,I),A=Math.min(b,_,I);S>.9&&A<.1&&(b<.2&&(a[v+0]+=1),_<.2&&(a[v+2]+=1),I<.2&&(a[v+4]+=1))}}function f(v){r.push(v.x,v.y,v.z)}function d(v,b){let _=v*3;b.x=e[_+0],b.y=e[_+1],b.z=e[_+2]}function m(){let v=new O,b=new O,_=new O,I=new O,S=new ue,A=new ue,R=new ue;for(let y=0,M=0;y<r.length;y+=9,M+=6){v.set(r[y+0],r[y+1],r[y+2]),b.set(r[y+3],r[y+4],r[y+5]),_.set(r[y+6],r[y+7],r[y+8]),S.set(a[M+0],a[M+1]),A.set(a[M+2],a[M+3]),R.set(a[M+4],a[M+5]),I.copy(v).add(b).add(_).divideScalar(3);let C=g(I);x(S,M+0,v,C),x(A,M+2,b,C),x(R,M+4,_,C)}}function x(v,b,_,I){I<0&&v.x===1&&(a[b]=v.x-1),_.x===0&&_.z===0&&(a[b]=I/2/Math.PI+.5)}function g(v){return Math.atan2(v.z,-v.x)}function p(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}};var xn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);let h=n[s],f=n[s+1]-h,d=(a-h)/f;return(s+d)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new ue:new O);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new O,s=[],r=[],a=[],o=new O,c=new dt;for(let d=0;d<=e;d++){let m=d/e;s[d]=this.getTangentAt(m,new O)}r[0]=new O,a[0]=new O;let l=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(Ke(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(c.makeRotationAxis(o,m))}a[d].crossVectors(s[d],r[d])}if(t===!0){let d=Math.acos(Ke(r[0].dot(r[e]),-1,1));d/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(d=-d);for(let m=1;m<=e;m++)r[m].applyMatrix4(c.makeRotationAxis(s[m],d*m)),a[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},tr=class extends xn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new ue){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,d=l-this.aY;c=f*h-d*u+this.aX,l=f*u+d*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},No=class extends tr{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Ph(){let i=0,e=0,t=0,n=0;function s(r,a,o,c){i=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,u){let f=(a-r)/l-(o-r)/(l+h)+(o-a)/h,d=(o-a)/h-(c-a)/(h+u)+(c-o)/u;f*=h,d*=h,s(a,o,f,d)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var mo=new O,jc=new Ph,Qc=new Ph,eh=new Ph,Fo=class extends xn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new O){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=s[(o-1)%r]:(mo.subVectors(s[0],s[1]).add(s[0]),l=mo);let u=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(mo.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=mo),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,m=Math.pow(l.distanceToSquared(u),d),x=Math.pow(u.distanceToSquared(f),d),g=Math.pow(f.distanceToSquared(h),d);x<1e-4&&(x=1),m<1e-4&&(m=x),g<1e-4&&(g=x),jc.initNonuniformCatmullRom(l.x,u.x,f.x,h.x,m,x,g),Qc.initNonuniformCatmullRom(l.y,u.y,f.y,h.y,m,x,g),eh.initNonuniformCatmullRom(l.z,u.z,f.z,h.z,m,x,g)}else this.curveType==="catmullrom"&&(jc.initCatmullRom(l.x,u.x,f.x,h.x,this.tension),Qc.initCatmullRom(l.y,u.y,f.y,h.y,this.tension),eh.initCatmullRom(l.z,u.z,f.z,h.z,this.tension));return n.set(jc.calc(c),Qc.calc(c),eh.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new O().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Ed(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,c=i*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*i+t}function pg(i,e){let t=1-i;return t*t*e}function mg(i,e){return 2*(1-i)*i*e}function gg(i,e){return i*i*e}function Gr(i,e,t,n){return pg(i,e)+mg(i,t)+gg(i,n)}function xg(i,e){let t=1-i;return t*t*t*e}function yg(i,e){let t=1-i;return 3*t*t*i*e}function _g(i,e){return 3*(1-i)*i*i*e}function vg(i,e){return i*i*i*e}function Vr(i,e,t,n,s){return xg(i,e)+yg(i,t)+_g(i,n)+vg(i,s)}var aa=class extends xn{constructor(e=new ue,t=new ue,n=new ue,s=new ue){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new ue){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Vr(e,s.x,r.x,a.x,o.x),Vr(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Oo=class extends xn{constructor(e=new O,t=new O,n=new O,s=new O){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new O){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Vr(e,s.x,r.x,a.x,o.x),Vr(e,s.y,r.y,a.y,o.y),Vr(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},oa=class extends xn{constructor(e=new ue,t=new ue){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ue){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ue){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Bo=class extends xn{constructor(e=new O,t=new O){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new O){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new O){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},la=class extends xn{constructor(e=new ue,t=new ue,n=new ue){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ue){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Gr(e,s.x,r.x,a.x),Gr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ko=class extends xn{constructor(e=new O,t=new O,n=new O){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new O){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Gr(e,s.x,r.x,a.x),Gr(e,s.y,r.y,a.y),Gr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ca=class extends xn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ue){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(Ed(o,c.x,l.x,h.x,u.x),Ed(o,c.y,l.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new ue().fromArray(s))}return this}},wd=Object.freeze({__proto__:null,ArcCurve:No,CatmullRomCurve3:Fo,CubicBezierCurve:aa,CubicBezierCurve3:Oo,EllipseCurve:tr,LineCurve:oa,LineCurve3:Bo,QuadraticBezierCurve:la,QuadraticBezierCurve3:ko,SplineCurve:ca}),zo=class extends xn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new wd[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new wd[s.type]().fromJSON(s))}return this}},ha=class extends zo{constructor(e){super(),this.type="Path",this.currentPoint=new ue,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new oa(this.currentPoint.clone(),new ue(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new la(this.currentPoint.clone(),new ue(e,t),new ue(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new aa(this.currentPoint.clone(),new ue(e,t),new ue(n,s),new ue(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new ca(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,s,r,a,o,c),this}absellipse(e,t,n,s,r,a,o,c){let l=new tr(e,t,n,s,r,a,o,c);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},nr=class extends ha{constructor(e){super(e),this.uuid=Xn(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new ha().fromJSON(s))}return this}};function Mg(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=bf(i,0,s,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=Tg(i,e,r,t)),i.length>80*t){o=1/0,c=1/0;let h=-1/0,u=-1/0;for(let f=t;f<s;f+=t){let d=i[f],m=i[f+1];d<o&&(o=d),m<c&&(c=m),d>h&&(h=d),m>u&&(u=m)}l=Math.max(h-o,u-c),l=l!==0?32767/l:0}return ua(r,a,t,o,c,l,0),a}function bf(i,e,t,n,s){let r;if(s===Og(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=Td(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=Td(a/n|0,i[a],i[a+1],r);return r&&ir(r,r.next)&&(fa(r),r=r.next),r}function Qi(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(ir(t,t.next)||Rt(t.prev,t,t.next)===0)){if(fa(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function ua(i,e,t,n,s,r,a){if(!i)return;!a&&r&&Pg(i,n,s,r);let o=i;for(;i.prev!==i.next;){let c=i.prev,l=i.next;if(r?Sg(i,n,s,r):bg(i)){e.push(c.i,i.i,l.i),fa(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=Eg(Qi(i),e),ua(i,e,t,n,s,r,2)):a===2&&wg(i,e,t,n,s,r):ua(Qi(i),e,t,n,s,r,1);break}}}function bg(i){let e=i.prev,t=i,n=i.next;if(Rt(e,t,n)>=0)return!1;let s=e.x,r=t.x,a=n.x,o=e.y,c=t.y,l=n.y,h=Math.min(s,r,a),u=Math.min(o,c,l),f=Math.max(s,r,a),d=Math.max(o,c,l),m=n.next;for(;m!==e;){if(m.x>=h&&m.x<=f&&m.y>=u&&m.y<=d&&kr(s,o,r,c,a,l,m.x,m.y)&&Rt(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Sg(i,e,t,n){let s=i.prev,r=i,a=i.next;if(Rt(s,r,a)>=0)return!1;let o=s.x,c=r.x,l=a.x,h=s.y,u=r.y,f=a.y,d=Math.min(o,c,l),m=Math.min(h,u,f),x=Math.max(o,c,l),g=Math.max(h,u,f),p=ah(d,m,e,t,n),v=ah(x,g,e,t,n),b=i.prevZ,_=i.nextZ;for(;b&&b.z>=p&&_&&_.z<=v;){if(b.x>=d&&b.x<=x&&b.y>=m&&b.y<=g&&b!==s&&b!==a&&kr(o,h,c,u,l,f,b.x,b.y)&&Rt(b.prev,b,b.next)>=0||(b=b.prevZ,_.x>=d&&_.x<=x&&_.y>=m&&_.y<=g&&_!==s&&_!==a&&kr(o,h,c,u,l,f,_.x,_.y)&&Rt(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;b&&b.z>=p;){if(b.x>=d&&b.x<=x&&b.y>=m&&b.y<=g&&b!==s&&b!==a&&kr(o,h,c,u,l,f,b.x,b.y)&&Rt(b.prev,b,b.next)>=0)return!1;b=b.prevZ}for(;_&&_.z<=v;){if(_.x>=d&&_.x<=x&&_.y>=m&&_.y<=g&&_!==s&&_!==a&&kr(o,h,c,u,l,f,_.x,_.y)&&Rt(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function Eg(i,e){let t=i;do{let n=t.prev,s=t.next.next;!ir(n,s)&&Ef(n,t,t.next,s)&&da(n,s)&&da(s,n)&&(e.push(n.i,t.i,s.i),fa(t),fa(t.next),t=i=s),t=t.next}while(t!==i);return Qi(t)}function wg(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Ug(a,o)){let c=wf(a,o);a=Qi(a,a.next),c=Qi(c,c.next),ua(a,e,t,n,s,r,0),ua(c,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Tg(i,e,t,n){let s=[];for(let r=0,a=e.length;r<a;r++){let o=e[r]*n,c=r<a-1?e[r+1]*n:i.length,l=bf(i,o,c,n,!1);l===l.next&&(l.steiner=!0),s.push(Dg(l))}s.sort(Ag);for(let r=0;r<s.length;r++)t=Rg(s[r],t);return t}function Ag(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function Rg(i,e){let t=Cg(i,e);if(!t)return e;let n=wf(t,i);return Qi(n,n.next),Qi(t,t.next)}function Cg(i,e){let t=e,n=i.x,s=i.y,r=-1/0,a;if(ir(i,t))return t;do{if(ir(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;let o=a,c=a.x,l=a.y,h=1/0;t=a;do{if(n>=t.x&&t.x>=c&&n!==t.x&&Sf(s<l?n:r,s,c,l,s<l?r:n,s,t.x,t.y)){let u=Math.abs(s-t.y)/(n-t.x);da(t,i)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&Ig(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function Ig(i,e){return Rt(i.prev,i,e.prev)<0&&Rt(e.next,i,i.next)<0}function Pg(i,e,t,n){let s=i;do s.z===0&&(s.z=ah(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Lg(s)}function Lg(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let l=0;l<t&&(o++,a=a.nextZ,!!a);l++);let c=t;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function ah(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Dg(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Sf(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function kr(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&Sf(i,e,t,n,s,r,a,o)}function Ug(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Ng(i,e)&&(da(i,e)&&da(e,i)&&Fg(i,e)&&(Rt(i.prev,i,e.prev)||Rt(i,e.prev,e))||ir(i,e)&&Rt(i.prev,i,i.next)>0&&Rt(e.prev,e,e.next)>0)}function Rt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function ir(i,e){return i.x===e.x&&i.y===e.y}function Ef(i,e,t,n){let s=xo(Rt(i,e,t)),r=xo(Rt(i,e,n)),a=xo(Rt(t,n,i)),o=xo(Rt(t,n,e));return!!(s!==r&&a!==o||s===0&&go(i,t,e)||r===0&&go(i,n,e)||a===0&&go(t,i,n)||o===0&&go(t,e,n))}function go(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function xo(i){return i>0?1:i<0?-1:0}function Ng(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Ef(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function da(i,e){return Rt(i.prev,i,i.next)<0?Rt(i,e,i.next)>=0&&Rt(i,i.prev,e)>=0:Rt(i,e,i.prev)<0||Rt(i,i.next,e)<0}function Fg(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function wf(i,e){let t=oh(i.i,i.x,i.y),n=oh(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Td(i,e,t,n){let s=oh(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function fa(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function oh(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Og(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var lh=class{static triangulate(e,t,n=2){return Mg(e,t,n)}},qs=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Ad(e),Rd(n,e);let a=e.length;t.forEach(Ad);for(let c=0;c<t.length;c++)s.push(a),a+=t[c].length,Rd(n,t[c]);let o=lh.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}};function Ad(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Rd(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var Kn=class i extends Uo{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var Nt=class i extends je{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,u=e/o,f=t/c,d=[],m=[],x=[],g=[];for(let p=0;p<h;p++){let v=p*f-a;for(let b=0;b<l;b++){let _=b*u-r;m.push(_,-v,0),x.push(0,0,1),g.push(b/o),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let v=0;v<o;v++){let b=v+l*p,_=v+l*(p+1),I=v+1+l*(p+1),S=v+1+l*p;d.push(b,_,S),d.push(_,I,S)}this.setIndex(d),this.setAttribute("position",new Pe(m,3)),this.setAttribute("normal",new Pe(x,3)),this.setAttribute("uv",new Pe(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},es=class i extends je{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],c=[],l=[],h=[],u=e,f=(t-e)/s,d=new O,m=new ue;for(let x=0;x<=s;x++){for(let g=0;g<=n;g++){let p=r+g/n*a;d.x=u*Math.cos(p),d.y=u*Math.sin(p),c.push(d.x,d.y,d.z),l.push(0,0,1),m.x=(d.x/t+1)/2,m.y=(d.y/t+1)/2,h.push(m.x,m.y)}u+=f}for(let x=0;x<s;x++){let g=x*(n+1);for(let p=0;p<n;p++){let v=p+g,b=v,_=v+n+1,I=v+n+2,S=v+1;o.push(b,_,S),o.push(_,I,S)}}this.setIndex(o),this.setAttribute("position",new Pe(c,3)),this.setAttribute("normal",new Pe(l,3)),this.setAttribute("uv",new Pe(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},pa=class i extends je{constructor(e=new nr([new ue(0,.5),new ue(-.5,-.5),new ue(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],a=[],o=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let h=0;h<e.length;h++)l(e[h]),this.addGroup(o,c,h),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new Pe(s,3)),this.setAttribute("normal",new Pe(r,3)),this.setAttribute("uv",new Pe(a,2));function l(h){let u=s.length/3,f=h.extractPoints(t),d=f.shape,m=f.holes;qs.isClockWise(d)===!1&&(d=d.reverse());for(let g=0,p=m.length;g<p;g++){let v=m[g];qs.isClockWise(v)===!0&&(m[g]=v.reverse())}let x=qs.triangulateShape(d,m);for(let g=0,p=m.length;g<p;g++){let v=m[g];d=d.concat(v)}for(let g=0,p=d.length;g<p;g++){let v=d[g];s.push(v.x,v.y,0),r.push(0,0,1),a.push(v.x,v.y)}for(let g=0,p=x.length;g<p;g++){let v=x[g],b=v[0]+u,_=v[1]+u,I=v[2]+u;n.push(b,_,I),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return Bg(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let a=t[e.shapes[s]];n.push(a)}return new i(n,e.curveSegments)}};function Bg(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}var Fn=class i extends je{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),l=0,h=[],u=new O,f=new O,d=[],m=[],x=[],g=[];for(let p=0;p<=n;p++){let v=[],b=p/n,_=0;p===0&&a===0?_=.5/t:p===n&&c===Math.PI&&(_=-.5/t);for(let I=0;I<=t;I++){let S=I/t;u.x=-e*Math.cos(s+S*r)*Math.sin(a+b*o),u.y=e*Math.cos(a+b*o),u.z=e*Math.sin(s+S*r)*Math.sin(a+b*o),m.push(u.x,u.y,u.z),f.copy(u).normalize(),x.push(f.x,f.y,f.z),g.push(S+_,1-b),v.push(l++)}h.push(v)}for(let p=0;p<n;p++)for(let v=0;v<t;v++){let b=h[p][v+1],_=h[p][v],I=h[p+1][v],S=h[p+1][v+1];(p!==0||a>0)&&d.push(b,_,S),(p!==n-1||c<Math.PI)&&d.push(_,I,S)}this.setIndex(d),this.setAttribute("position",new Pe(m,3)),this.setAttribute("normal",new Pe(x,3)),this.setAttribute("uv",new Pe(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var _i=class i extends je{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let a=[],o=[],c=[],l=[],h=new O,u=new O,f=new O;for(let d=0;d<=n;d++)for(let m=0;m<=s;m++){let x=m/s*r,g=d/n*Math.PI*2;u.x=(e+t*Math.cos(g))*Math.cos(x),u.y=(e+t*Math.cos(g))*Math.sin(x),u.z=t*Math.sin(g),o.push(u.x,u.y,u.z),h.x=e*Math.cos(x),h.y=e*Math.sin(x),f.subVectors(u,h).normalize(),c.push(f.x,f.y,f.z),l.push(m/s),l.push(d/n)}for(let d=1;d<=n;d++)for(let m=1;m<=s;m++){let x=(s+1)*d+m-1,g=(s+1)*(d-1)+m-1,p=(s+1)*(d-1)+m,v=(s+1)*d+m;a.push(x,g,v),a.push(g,p,v)}this.setIndex(a),this.setAttribute("position",new Pe(o,3)),this.setAttribute("normal",new Pe(c,3)),this.setAttribute("uv",new Pe(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Et=class extends $n{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Te(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Te(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=wh,this.normalScale=new ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Un,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},sr=class extends Et{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ue(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ke(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Te(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Te(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Te(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Ho=class extends $n{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=of,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Go=class extends $n{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function yo(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function kg(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var ts=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Vo=class extends ts{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:nh,endingEnd:nh}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case ih:r=e,o=2*t-n;break;case sh:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case ih:a=e,c=2*n-t;break;case sh:a=1,c=n+s[1]-s[0];break;default:a=e-1,c=t}let l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,m=(n-t)/(s-t),x=m*m,g=x*m,p=-f*g+2*f*x-f*m,v=(1+f)*g+(-1.5-2*f)*x+(-.5+f)*m+1,b=(-1-d)*g+(1.5+d)*x+.5*m,_=d*g-d*x;for(let I=0;I!==o;++I)r[I]=p*a[h+I]+v*a[l+I]+b*a[c+I]+_*a[u+I];return r}},Wo=class extends ts{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=(n-t)/(s-t),u=1-h;for(let f=0;f!==o;++f)r[f]=a[l+f]*u+a[c+f]*h;return r}},Xo=class extends ts{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},yn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=yo(t,this.TimeBufferType),this.values=yo(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:yo(e.times,Array),values:yo(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Xo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Wo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Vo(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Wr:t=this.InterpolantFactoryMethodDiscrete;break;case So:t=this.InterpolantFactoryMethodLinear;break;case _o:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Wr;case this.InterpolantFactoryMethodLinear:return So;case this.InterpolantFactoryMethodSmooth:return _o}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(s!==void 0&&kg(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===_o,r=e.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=e[o],h=e[o+1];if(l!==h&&(o!==1||l!==e[0]))if(s)c=!0;else{let u=o*n,f=u-n,d=u+n;for(let m=0;m!==n;++m){let x=t[u+m];if(x!==t[f+m]||x!==t[d+m]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];let u=o*n,f=a*n;for(let d=0;d!==n;++d)t[f+d]=t[u+d]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)t[c+l]=t[o+l];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};yn.prototype.ValueTypeName="";yn.prototype.TimeBufferType=Float32Array;yn.prototype.ValueBufferType=Float32Array;yn.prototype.DefaultInterpolation=So;var Di=class extends yn{constructor(e,t,n){super(e,t,n)}};Di.prototype.ValueTypeName="bool";Di.prototype.ValueBufferType=Array;Di.prototype.DefaultInterpolation=Wr;Di.prototype.InterpolantFactoryMethodLinear=void 0;Di.prototype.InterpolantFactoryMethodSmooth=void 0;var qo=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}};qo.prototype.ValueTypeName="color";var $o=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}};$o.prototype.ValueTypeName="number";var Yo=class extends ts{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-t)/(s-t),l=e*o;for(let h=l+o;l!==h;l+=4)fi.slerpFlat(r,0,a,l-o,a,l,c);return r}},ma=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Yo(this.times,this.values,this.getValueSize(),e)}};ma.prototype.ValueTypeName="quaternion";ma.prototype.InterpolantFactoryMethodSmooth=void 0;var Ui=class extends yn{constructor(e,t,n){super(e,t,n)}};Ui.prototype.ValueTypeName="string";Ui.prototype.ValueBufferType=Array;Ui.prototype.DefaultInterpolation=Wr;Ui.prototype.InterpolantFactoryMethodLinear=void 0;Ui.prototype.InterpolantFactoryMethodSmooth=void 0;var Zo=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}};Zo.prototype.ValueTypeName="vector";var Ko=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=l.length;u<f;u+=2){let d=l[u],m=l[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Tf=new Ko,Jo=class{constructor(e){this.manager=e!==void 0?e:Tf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Jo.DEFAULT_MATERIAL_NAME="__DEFAULT";var ga=class extends gt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Te(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},xa=class extends ga{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(gt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Te(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},th=new dt,Cd=new O,Id=new O,ch=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ue(512,512),this.mapType=On,this.map=null,this.mapPass=null,this.matrix=new dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new er,this._frameExtents=new ue(1,1),this._viewportCount=1,this._viewports=[new Ct(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Cd.setFromMatrixPosition(e.matrixWorld),t.position.copy(Cd),Id.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Id),t.updateMatrixWorld(),th.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(th,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(th)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var ya=class extends Qr{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},hh=class extends ch{constructor(){super(new ya(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},rr=class extends ga{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(gt.DEFAULT_UP),this.updateMatrix(),this.target=new gt,this.shadow=new hh}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var jo=class extends Qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var Lh="\\[\\]\\.:\\/",zg=new RegExp("["+Lh+"]","g"),Dh="[^"+Lh+"]",Hg="[^"+Lh.replace("\\.","")+"]",Gg=/((?:WC+[\/:])*)/.source.replace("WC",Dh),Vg=/(WCOD+)?/.source.replace("WCOD",Hg),Wg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Dh),Xg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Dh),qg=new RegExp("^"+Gg+Vg+Wg+Xg+"$"),$g=["material","materials","bones","map"],uh=class{constructor(e,t,n){let s=n||vt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},vt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(zg,"")}static parseTrackName(e){let t=qg.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);$g.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let c=n(o.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let a=e[s];if(a===void 0){let l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};vt.Composite=uh;vt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};vt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};vt.prototype.GetterByBindingType=[vt.prototype._getValue_direct,vt.prototype._getValue_array,vt.prototype._getValue_arrayElement,vt.prototype._getValue_toArray];vt.prototype.SetterByBindingTypeAndVersioning=[[vt.prototype._setValue_direct,vt.prototype._setValue_direct_setNeedsUpdate,vt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[vt.prototype._setValue_array,vt.prototype._setValue_array_setNeedsUpdate,vt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[vt.prototype._setValue_arrayElement,vt.prototype._setValue_arrayElement_setNeedsUpdate,vt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[vt.prototype._setValue_fromArray,vt.prototype._setValue_fromArray_setNeedsUpdate,vt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var wM=new Float32Array(1);function Uh(i,e,t,n){let s=Yg(n);switch(t){case bh:return i*e;case fl:return i*e/s.components*s.byteLength;case pl:return i*e/s.components*s.byteLength;case Eh:return i*e*2/s.components*s.byteLength;case ml:return i*e*2/s.components*s.byteLength;case Sh:return i*e*3/s.components*s.byteLength;case Tn:return i*e*4/s.components*s.byteLength;case gl:return i*e*4/s.components*s.byteLength;case Ma:case ba:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Sa:case Ea:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case yl:case vl:return Math.max(i,16)*Math.max(e,8)/4;case xl:case _l:return Math.max(i,8)*Math.max(e,8)/2;case Ml:case bl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Sl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case El:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case wl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Tl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Al:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Rl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Cl:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Il:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Pl:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ll:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Dl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ul:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Nl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Fl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Ol:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Bl:case kl:case zl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Hl:case Gl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Vl:case Wl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Yg(i){switch(i){case On:case yh:return{byteLength:1,components:1};case or:case _h:case lr:return{byteLength:2,components:1};case ul:case dl:return{byteLength:2,components:4};case Fi:case hl:case Bn:return{byteLength:4,components:1};case vh:case Mh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Kf(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Qg(i){let e=new WeakMap;function t(o,c){let l=o.array,h=o.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,h),o.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)d=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){let h=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,h);else{u.sort((d,m)=>d.start-m.start);let f=0;for(let d=1;d<u.length;d++){let m=u[f],x=u[d];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++f,u[f]=x)}u.length=f+1;for(let d=0,m=u.length;d<m;d++){let x=u[d];i.bufferSubData(l,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var e0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,t0=`#ifdef USE_ALPHAHASH
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
#endif`,n0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,i0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,s0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,r0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,a0=`#ifdef USE_AOMAP
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
#endif`,o0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,l0=`#ifdef USE_BATCHING
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
#endif`,c0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,h0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,u0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,d0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,f0=`#ifdef USE_IRIDESCENCE
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
#endif`,p0=`#ifdef USE_BUMPMAP
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
#endif`,m0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,g0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,x0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,y0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,v0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,M0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,b0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,S0=`#define PI 3.141592653589793
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
} // validated`,E0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,w0=`vec3 transformedNormal = objectNormal;
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
#endif`,T0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,A0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,R0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,C0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,I0="gl_FragColor = linearToOutputTexel( gl_FragColor );",P0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,L0=`#ifdef USE_ENVMAP
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
#endif`,D0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,U0=`#ifdef USE_ENVMAP
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
#endif`,N0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,F0=`#ifdef USE_ENVMAP
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
#endif`,O0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,B0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,k0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,z0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,H0=`#ifdef USE_GRADIENTMAP
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
}`,G0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,V0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,W0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,X0=`uniform bool receiveShadow;
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
#endif`,q0=`#ifdef USE_ENVMAP
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
#endif`,$0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Y0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Z0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,K0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,J0=`PhysicalMaterial material;
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
#endif`,j0=`struct PhysicalMaterial {
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
}`,Q0=`
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
#endif`,ex=`#if defined( RE_IndirectDiffuse )
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
#endif`,tx=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,nx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ix=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ax=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ox=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,lx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,cx=`#if defined( USE_POINTS_UV )
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
#endif`,hx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ux=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,dx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,fx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,px=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mx=`#ifdef USE_MORPHTARGETS
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
#endif`,gx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,yx=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,_x=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Mx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,bx=`#ifdef USE_NORMALMAP
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
#endif`,Sx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ex=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,wx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Tx=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ax=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Rx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Cx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ix=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Px=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Lx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Dx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ux=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Nx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Fx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ox=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Bx=`float getShadowMask() {
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
}`,kx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,zx=`#ifdef USE_SKINNING
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
#endif`,Hx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Gx=`#ifdef USE_SKINNING
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
#endif`,Vx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Wx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Xx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,qx=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,$x=`#ifdef USE_TRANSMISSION
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
#endif`,Yx=`#ifdef USE_TRANSMISSION
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
#endif`,Zx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Kx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Jx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Qx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ey=`uniform sampler2D t2D;
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
}`,ty=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ny=`#ifdef ENVMAP_TYPE_CUBE
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
}`,iy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sy=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ry=`#include <common>
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
}`,ay=`#if DEPTH_PACKING == 3200
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
}`,oy=`#define DISTANCE
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
}`,ly=`#define DISTANCE
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
}`,cy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,hy=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,uy=`uniform float scale;
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
}`,dy=`uniform vec3 diffuse;
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
}`,fy=`#include <common>
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
}`,py=`uniform vec3 diffuse;
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
}`,my=`#define LAMBERT
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
}`,gy=`#define LAMBERT
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
}`,xy=`#define MATCAP
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
}`,yy=`#define MATCAP
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
}`,_y=`#define NORMAL
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
}`,vy=`#define NORMAL
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
}`,My=`#define PHONG
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
}`,by=`#define PHONG
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
}`,Sy=`#define STANDARD
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
}`,Ey=`#define STANDARD
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
}`,wy=`#define TOON
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
}`,Ty=`#define TOON
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
}`,Ay=`uniform float size;
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
}`,Ry=`uniform vec3 diffuse;
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
}`,Cy=`#include <common>
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
}`,Iy=`uniform vec3 color;
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
}`,Py=`uniform float rotation;
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
}`,Ly=`uniform vec3 diffuse;
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
}`,Ye={alphahash_fragment:e0,alphahash_pars_fragment:t0,alphamap_fragment:n0,alphamap_pars_fragment:i0,alphatest_fragment:s0,alphatest_pars_fragment:r0,aomap_fragment:a0,aomap_pars_fragment:o0,batching_pars_vertex:l0,batching_vertex:c0,begin_vertex:h0,beginnormal_vertex:u0,bsdfs:d0,iridescence_fragment:f0,bumpmap_pars_fragment:p0,clipping_planes_fragment:m0,clipping_planes_pars_fragment:g0,clipping_planes_pars_vertex:x0,clipping_planes_vertex:y0,color_fragment:_0,color_pars_fragment:v0,color_pars_vertex:M0,color_vertex:b0,common:S0,cube_uv_reflection_fragment:E0,defaultnormal_vertex:w0,displacementmap_pars_vertex:T0,displacementmap_vertex:A0,emissivemap_fragment:R0,emissivemap_pars_fragment:C0,colorspace_fragment:I0,colorspace_pars_fragment:P0,envmap_fragment:L0,envmap_common_pars_fragment:D0,envmap_pars_fragment:U0,envmap_pars_vertex:N0,envmap_physical_pars_fragment:q0,envmap_vertex:F0,fog_vertex:O0,fog_pars_vertex:B0,fog_fragment:k0,fog_pars_fragment:z0,gradientmap_pars_fragment:H0,lightmap_pars_fragment:G0,lights_lambert_fragment:V0,lights_lambert_pars_fragment:W0,lights_pars_begin:X0,lights_toon_fragment:$0,lights_toon_pars_fragment:Y0,lights_phong_fragment:Z0,lights_phong_pars_fragment:K0,lights_physical_fragment:J0,lights_physical_pars_fragment:j0,lights_fragment_begin:Q0,lights_fragment_maps:ex,lights_fragment_end:tx,logdepthbuf_fragment:nx,logdepthbuf_pars_fragment:ix,logdepthbuf_pars_vertex:sx,logdepthbuf_vertex:rx,map_fragment:ax,map_pars_fragment:ox,map_particle_fragment:lx,map_particle_pars_fragment:cx,metalnessmap_fragment:hx,metalnessmap_pars_fragment:ux,morphinstance_vertex:dx,morphcolor_vertex:fx,morphnormal_vertex:px,morphtarget_pars_vertex:mx,morphtarget_vertex:gx,normal_fragment_begin:xx,normal_fragment_maps:yx,normal_pars_fragment:_x,normal_pars_vertex:vx,normal_vertex:Mx,normalmap_pars_fragment:bx,clearcoat_normal_fragment_begin:Sx,clearcoat_normal_fragment_maps:Ex,clearcoat_pars_fragment:wx,iridescence_pars_fragment:Tx,opaque_fragment:Ax,packing:Rx,premultiplied_alpha_fragment:Cx,project_vertex:Ix,dithering_fragment:Px,dithering_pars_fragment:Lx,roughnessmap_fragment:Dx,roughnessmap_pars_fragment:Ux,shadowmap_pars_fragment:Nx,shadowmap_pars_vertex:Fx,shadowmap_vertex:Ox,shadowmask_pars_fragment:Bx,skinbase_vertex:kx,skinning_pars_vertex:zx,skinning_vertex:Hx,skinnormal_vertex:Gx,specularmap_fragment:Vx,specularmap_pars_fragment:Wx,tonemapping_fragment:Xx,tonemapping_pars_fragment:qx,transmission_fragment:$x,transmission_pars_fragment:Yx,uv_pars_fragment:Zx,uv_pars_vertex:Kx,uv_vertex:Jx,worldpos_vertex:jx,background_vert:Qx,background_frag:ey,backgroundCube_vert:ty,backgroundCube_frag:ny,cube_vert:iy,cube_frag:sy,depth_vert:ry,depth_frag:ay,distanceRGBA_vert:oy,distanceRGBA_frag:ly,equirect_vert:cy,equirect_frag:hy,linedashed_vert:uy,linedashed_frag:dy,meshbasic_vert:fy,meshbasic_frag:py,meshlambert_vert:my,meshlambert_frag:gy,meshmatcap_vert:xy,meshmatcap_frag:yy,meshnormal_vert:_y,meshnormal_frag:vy,meshphong_vert:My,meshphong_frag:by,meshphysical_vert:Sy,meshphysical_frag:Ey,meshtoon_vert:wy,meshtoon_frag:Ty,points_vert:Ay,points_frag:Ry,shadow_vert:Cy,shadow_frag:Iy,sprite_vert:Py,sprite_frag:Ly},de={common:{diffuse:{value:new Te(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Te(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Te(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new Te(16777215)},opacity:{value:1},center:{value:new ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},jn={basic:{uniforms:tn([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:Ye.meshbasic_vert,fragmentShader:Ye.meshbasic_frag},lambert:{uniforms:tn([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new Te(0)}}]),vertexShader:Ye.meshlambert_vert,fragmentShader:Ye.meshlambert_frag},phong:{uniforms:tn([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new Te(0)},specular:{value:new Te(1118481)},shininess:{value:30}}]),vertexShader:Ye.meshphong_vert,fragmentShader:Ye.meshphong_frag},standard:{uniforms:tn([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new Te(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag},toon:{uniforms:tn([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new Te(0)}}]),vertexShader:Ye.meshtoon_vert,fragmentShader:Ye.meshtoon_frag},matcap:{uniforms:tn([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:Ye.meshmatcap_vert,fragmentShader:Ye.meshmatcap_frag},points:{uniforms:tn([de.points,de.fog]),vertexShader:Ye.points_vert,fragmentShader:Ye.points_frag},dashed:{uniforms:tn([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ye.linedashed_vert,fragmentShader:Ye.linedashed_frag},depth:{uniforms:tn([de.common,de.displacementmap]),vertexShader:Ye.depth_vert,fragmentShader:Ye.depth_frag},normal:{uniforms:tn([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:Ye.meshnormal_vert,fragmentShader:Ye.meshnormal_frag},sprite:{uniforms:tn([de.sprite,de.fog]),vertexShader:Ye.sprite_vert,fragmentShader:Ye.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ye.background_vert,fragmentShader:Ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:Ye.backgroundCube_vert,fragmentShader:Ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ye.cube_vert,fragmentShader:Ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ye.equirect_vert,fragmentShader:Ye.equirect_frag},distanceRGBA:{uniforms:tn([de.common,de.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ye.distanceRGBA_vert,fragmentShader:Ye.distanceRGBA_frag},shadow:{uniforms:tn([de.lights,de.fog,{color:{value:new Te(0)},opacity:{value:1}}]),vertexShader:Ye.shadow_vert,fragmentShader:Ye.shadow_frag}};jn.physical={uniforms:tn([jn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new Te(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new Te(0)},specularColor:{value:new Te(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag};var Xl={r:0,b:0,g:0},as=new Un,Dy=new dt;function Uy(i,e,t,n,s,r,a){let o=new Te(0),c=r===!0?0:1,l,h,u=null,f=0,d=null;function m(b){let _=b.isScene===!0?b.background:null;return _&&_.isTexture&&(_=(b.backgroundBlurriness>0?t:e).get(_)),_}function x(b){let _=!1,I=m(b);I===null?p(o,c):I&&I.isColor&&(p(I,1),_=!0);let S=i.xr.getEnvironmentBlendMode();S==="additive"?n.buffers.color.setClear(0,0,0,1,a):S==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(b,_){let I=m(_);I&&(I.isCubeTexture||I.mapping===_a)?(h===void 0&&(h=new _e(new xt(1,1,1),new Nn({name:"BackgroundCubeMaterial",uniforms:rs(jn.backgroundCube.uniforms),vertexShader:jn.backgroundCube.vertexShader,fragmentShader:jn.backgroundCube.fragmentShader,side:Ht,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(S,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),as.copy(_.backgroundRotation),as.x*=-1,as.y*=-1,as.z*=-1,I.isCubeTexture&&I.isRenderTargetTexture===!1&&(as.y*=-1,as.z*=-1),h.material.uniforms.envMap.value=I,h.material.uniforms.flipEnvMap.value=I.isCubeTexture&&I.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Dy.makeRotationFromEuler(as)),h.material.toneMapped=tt.getTransfer(I.colorSpace)!==ot,(u!==I||f!==I.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=I,f=I.version,d=i.toneMapping),h.layers.enableAll(),b.unshift(h,h.geometry,h.material,0,0,null)):I&&I.isTexture&&(l===void 0&&(l=new _e(new Nt(2,2),new Nn({name:"BackgroundMaterial",uniforms:rs(jn.background.uniforms),vertexShader:jn.background.vertexShader,fragmentShader:jn.background.fragmentShader,side:ui,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=I,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=tt.getTransfer(I.colorSpace)!==ot,I.matrixAutoUpdate===!0&&I.updateMatrix(),l.material.uniforms.uvTransform.value.copy(I.matrix),(u!==I||f!==I.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,u=I,f=I.version,d=i.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function p(b,_){b.getRGB(Xl,Ih(i)),n.buffers.color.setClear(Xl.r,Xl.g,Xl.b,_,a)}function v(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(b,_=1){o.set(b),c=_,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(b){c=b,p(o,c)},render:x,addToRenderList:g,dispose:v}}function Ny(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null),r=s,a=!1;function o(M,C,U,D,N){let G=!1,V=u(D,U,C);r!==V&&(r=V,l(r.object)),G=d(M,D,U,N),G&&m(M,D,U,N),N!==null&&e.update(N,i.ELEMENT_ARRAY_BUFFER),(G||a)&&(a=!1,_(M,C,U,D),N!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function c(){return i.createVertexArray()}function l(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function u(M,C,U){let D=U.wireframe===!0,N=n[M.id];N===void 0&&(N={},n[M.id]=N);let G=N[C.id];G===void 0&&(G={},N[C.id]=G);let V=G[D];return V===void 0&&(V=f(c()),G[D]=V),V}function f(M){let C=[],U=[],D=[];for(let N=0;N<t;N++)C[N]=0,U[N]=0,D[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:U,attributeDivisors:D,object:M,attributes:{},index:null}}function d(M,C,U,D){let N=r.attributes,G=C.attributes,V=0,j=U.getAttributes();for(let W in j)if(j[W].location>=0){let fe=N[W],Ae=G[W];if(Ae===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(Ae=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(Ae=M.instanceColor)),fe===void 0||fe.attribute!==Ae||Ae&&fe.data!==Ae.data)return!0;V++}return r.attributesNum!==V||r.index!==D}function m(M,C,U,D){let N={},G=C.attributes,V=0,j=U.getAttributes();for(let W in j)if(j[W].location>=0){let fe=G[W];fe===void 0&&(W==="instanceMatrix"&&M.instanceMatrix&&(fe=M.instanceMatrix),W==="instanceColor"&&M.instanceColor&&(fe=M.instanceColor));let Ae={};Ae.attribute=fe,fe&&fe.data&&(Ae.data=fe.data),N[W]=Ae,V++}r.attributes=N,r.attributesNum=V,r.index=D}function x(){let M=r.newAttributes;for(let C=0,U=M.length;C<U;C++)M[C]=0}function g(M){p(M,0)}function p(M,C){let U=r.newAttributes,D=r.enabledAttributes,N=r.attributeDivisors;U[M]=1,D[M]===0&&(i.enableVertexAttribArray(M),D[M]=1),N[M]!==C&&(i.vertexAttribDivisor(M,C),N[M]=C)}function v(){let M=r.newAttributes,C=r.enabledAttributes;for(let U=0,D=C.length;U<D;U++)C[U]!==M[U]&&(i.disableVertexAttribArray(U),C[U]=0)}function b(M,C,U,D,N,G,V){V===!0?i.vertexAttribIPointer(M,C,U,N,G):i.vertexAttribPointer(M,C,U,D,N,G)}function _(M,C,U,D){x();let N=D.attributes,G=U.getAttributes(),V=C.defaultAttributeValues;for(let j in G){let W=G[j];if(W.location>=0){let ce=N[j];if(ce===void 0&&(j==="instanceMatrix"&&M.instanceMatrix&&(ce=M.instanceMatrix),j==="instanceColor"&&M.instanceColor&&(ce=M.instanceColor)),ce!==void 0){let fe=ce.normalized,Ae=ce.itemSize,Je=e.get(ce);if(Je===void 0)continue;let pt=Je.buffer,Mt=Je.type,st=Je.bytesPerElement,J=Mt===i.INT||Mt===i.UNSIGNED_INT||ce.gpuType===hl;if(ce.isInterleavedBufferAttribute){let te=ce.data,Me=te.stride,ze=ce.offset;if(te.isInstancedInterleavedBuffer){for(let De=0;De<W.locationSize;De++)p(W.location+De,te.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let De=0;De<W.locationSize;De++)g(W.location+De);i.bindBuffer(i.ARRAY_BUFFER,pt);for(let De=0;De<W.locationSize;De++)b(W.location+De,Ae/W.locationSize,Mt,fe,Me*st,(ze+Ae/W.locationSize*De)*st,J)}else{if(ce.isInstancedBufferAttribute){for(let te=0;te<W.locationSize;te++)p(W.location+te,ce.meshPerAttribute);M.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let te=0;te<W.locationSize;te++)g(W.location+te);i.bindBuffer(i.ARRAY_BUFFER,pt);for(let te=0;te<W.locationSize;te++)b(W.location+te,Ae/W.locationSize,Mt,fe,Ae*st,Ae/W.locationSize*te*st,J)}}else if(V!==void 0){let fe=V[j];if(fe!==void 0)switch(fe.length){case 2:i.vertexAttrib2fv(W.location,fe);break;case 3:i.vertexAttrib3fv(W.location,fe);break;case 4:i.vertexAttrib4fv(W.location,fe);break;default:i.vertexAttrib1fv(W.location,fe)}}}}v()}function I(){R();for(let M in n){let C=n[M];for(let U in C){let D=C[U];for(let N in D)h(D[N].object),delete D[N];delete C[U]}delete n[M]}}function S(M){if(n[M.id]===void 0)return;let C=n[M.id];for(let U in C){let D=C[U];for(let N in D)h(D[N].object),delete D[N];delete C[U]}delete n[M.id]}function A(M){for(let C in n){let U=n[C];if(U[M.id]===void 0)continue;let D=U[M.id];for(let N in D)h(D[N].object),delete D[N];delete U[M.id]}}function R(){y(),a=!0,r!==s&&(r=s,l(r.object))}function y(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:R,resetDefaultState:y,dispose:I,releaseStatesOfGeometry:S,releaseStatesOfProgram:A,initAttributes:x,enableAttribute:g,disableUnusedAttributes:v}}function Fy(i,e,t){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),t.update(h,n,1)}function a(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),t.update(h,n,u))}function o(l,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let d=0;for(let m=0;m<u;m++)d+=h[m];t.update(d,n,1)}function c(l,h,u,f){if(u===0)return;let d=e.get("WEBGL_multi_draw");if(d===null)for(let m=0;m<l.length;m++)a(l[m],h[m],f[m]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,f,0,u);let m=0;for(let x=0;x<u;x++)m+=h[x]*f[x];t.update(m,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Oy(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let A=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==Tn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){let R=A===lr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==On&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Bn&&!R)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),I=m>0,S=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:v,maxVaryings:b,maxFragmentUniforms:_,vertexTextures:I,maxSamples:S}}function By(i){let e=this,t=null,n=0,s=!1,r=!1,a=new Wn,o=new We,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,d){let m=u.clippingPlanes,x=u.clipIntersection,g=u.clipShadows,p=i.get(u);if(!s||m===null||m.length===0||r&&!g)r?h(null):l();else{let v=r?0:n,b=v*4,_=p.clippingState||null;c.value=_,_=h(m,f,b,d);for(let I=0;I!==b;++I)_[I]=t[I];p.clippingState=_,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,d,m){let x=u!==null?u.length:0,g=null;if(x!==0){if(g=c.value,m!==!0||g===null){let p=d+x*4,v=f.matrixWorldInverse;o.getNormalMatrix(v),(g===null||g.length<p)&&(g=new Float32Array(p));for(let b=0,_=d;b!==x;++b,_+=4)a.copy(u[b]).applyMatrix4(v,o),a.normal.toArray(g,_),g[_+3]=a.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}function ky(i){let e=new WeakMap;function t(a,o){return o===ar?a.mapping=ns:o===ll&&(a.mapping=is),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===ar||o===ll)if(e.has(a)){let c=e.get(a).texture;return t(c,a.mapping)}else{let c=a.image;if(c&&c.height>0){let l=new Co(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",s),t(l.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var dr=4,Af=[.125,.215,.35,.446,.526,.582],cs=20,Nh=new ya,Rf=new Te,Fh=null,Oh=0,Bh=0,kh=!1,ls=(1+Math.sqrt(5))/2,ur=1/ls,Cf=[new O(-ls,ur,0),new O(ls,ur,0),new O(-ur,0,ls),new O(ur,0,ls),new O(0,ls,-ur),new O(0,ls,ur),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)],zy=new O,Yl=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=zy}=r;Fh=this._renderer.getRenderTarget(),Oh=this._renderer.getActiveCubeFace(),Bh=this._renderer.getActiveMipmapLevel(),kh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Lf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Pf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Fh,Oh,Bh),this._renderer.xr.enabled=kh,e.scissorTest=!1,ql(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ns||e.mapping===is?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Fh=this._renderer.getRenderTarget(),Oh=this._renderer.getActiveCubeFace(),Bh=this._renderer.getActiveMipmapLevel(),kh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Dn,minFilter:Dn,generateMipmaps:!1,type:lr,format:Tn,colorSpace:Ji,depthBuffer:!1},s=If(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=If(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Hy(r)),this._blurMaterial=Gy(r,e,t)}return s}_compileMaterial(e){let t=new _e(this._lodPlanes[0],e);this._renderer.compile(t,Nh)}_sceneToCubeUV(e,t,n,s,r){let c=new Qt(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(Rf),u.toneMapping=Mi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let x=new ct({name:"PMREM.Background",side:Ht,depthWrite:!1,depthTest:!1}),g=new _e(new xt,x),p=!1,v=e.background;v?v.isColor&&(x.color.copy(v),e.background=null,p=!0):(x.color.copy(Rf),p=!0);for(let b=0;b<6;b++){let _=b%3;_===0?(c.up.set(0,l[b],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[b],r.y,r.z)):_===1?(c.up.set(0,0,l[b]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[b],r.z)):(c.up.set(0,l[b],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[b]));let I=this._cubeSize;ql(s,_*I,b>2?I:0,I,I),u.setRenderTarget(s),p&&u.render(g,c),u.render(e,c)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=d,u.autoClear=f,e.background=v}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===ns||e.mapping===is;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Lf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Pf());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new _e(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;let c=this._cubeSize;ql(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,Nh)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Cf[(s-r-1)%Cf.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){let c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new _e(this._lodPlanes[s],l),f=l.uniforms,d=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*cs-1),x=r/m,g=isFinite(r)?1+Math.floor(h*x):cs;g>cs&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${cs}`);let p=[],v=0;for(let A=0;A<cs;++A){let R=A/x,y=Math.exp(-R*R/2);p.push(y),A===0?v+=y:A<g&&(v+=2*y)}for(let A=0;A<p.length;A++)p[A]=p[A]/v;f.envMap.value=e.texture,f.samples.value=g,f.weights.value=p,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);let{_lodMax:b}=this;f.dTheta.value=m,f.mipInt.value=b-n;let _=this._sizeLods[s],I=3*_*(s>b-dr?s-b+dr:0),S=4*(this._cubeSize-_);ql(t,I,S,3*_,2*_),c.setRenderTarget(t),c.render(u,Nh)}};function Hy(i){let e=[],t=[],n=[],s=i,r=i-dr+1+Af.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);t.push(o);let c=1/o;a>i-dr?c=Af[a-i+dr-1]:a===0&&(c=0),n.push(c);let l=1/(o-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,m=6,x=3,g=2,p=1,v=new Float32Array(x*m*d),b=new Float32Array(g*m*d),_=new Float32Array(p*m*d);for(let S=0;S<d;S++){let A=S%3*2/3-1,R=S>2?0:-1,y=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];v.set(y,x*m*S),b.set(f,g*m*S);let M=[S,S,S,S,S,S];_.set(M,p*m*S)}let I=new je;I.setAttribute("position",new Ut(v,x)),I.setAttribute("uv",new Ut(b,g)),I.setAttribute("faceIndex",new Ut(_,p)),e.push(I),s>dr&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function If(i,e,t){let n=new qn(i,e,t);return n.texture.mapping=_a,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ql(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Gy(i,e,t){let n=new Float32Array(cs),s=new O(0,1,0);return new Nn({name:"SphericalGaussianBlur",defines:{n:cs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Zh(),fragmentShader:`

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
		`,blending:vi,depthTest:!1,depthWrite:!1})}function Pf(){return new Nn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Zh(),fragmentShader:`

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
		`,blending:vi,depthTest:!1,depthWrite:!1})}function Lf(){return new Nn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Zh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:vi,depthTest:!1,depthWrite:!1})}function Zh(){return`

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
	`}function Vy(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){let c=o.mapping,l=c===ar||c===ll,h=c===ns||c===is;if(l||h){let u=e.get(o),f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new Yl(i)),u=l?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{let d=o.image;return l&&d&&d.height>0||h&&d&&s(d)?(t===null&&(t=new Yl(i)),u=l?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0,l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){let c=o.target;c.removeEventListener("dispose",r);let l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Wy(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Zs("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Xy(i,e,t,n){let s={},r=new WeakMap;function a(u){let f=u.target;f.index!==null&&e.remove(f.index);for(let m in f.attributes)e.remove(f.attributes[m]);f.removeEventListener("dispose",a),delete s[f.id];let d=r.get(f);d&&(e.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function c(u){let f=u.attributes;for(let d in f)e.update(f[d],i.ARRAY_BUFFER)}function l(u){let f=[],d=u.index,m=u.attributes.position,x=0;if(d!==null){let v=d.array;x=d.version;for(let b=0,_=v.length;b<_;b+=3){let I=v[b+0],S=v[b+1],A=v[b+2];f.push(I,S,S,A,A,I)}}else if(m!==void 0){let v=m.array;x=m.version;for(let b=0,_=v.length/3-1;b<_;b+=3){let I=b+0,S=b+1,A=b+2;f.push(I,S,S,A,A,I)}}else return;let g=new(Ch(f)?jr:Jr)(f,1);g.version=x;let p=r.get(u);p&&e.remove(p),r.set(u,g)}function h(u){let f=r.get(u);if(f){let d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function qy(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function c(f,d){i.drawElements(n,d,r,f*a),t.update(d,n,1)}function l(f,d,m){m!==0&&(i.drawElementsInstanced(n,d,r,f*a,m),t.update(d,n,m))}function h(f,d,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,m);let g=0;for(let p=0;p<m;p++)g+=d[p];t.update(g,n,1)}function u(f,d,m,x){if(m===0)return;let g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<f.length;p++)l(f[p]/a,d[p],x[p]);else{g.multiDrawElementsInstancedWEBGL(n,d,0,r,f,0,x,0,m);let p=0;for(let v=0;v<m;v++)p+=d[v]*x[v];t.update(p,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function $y(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Yy(i,e,t){let n=new WeakMap,s=new Ct;function r(a,o,c){let l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0,f=n.get(o);if(f===void 0||f.count!==u){let y=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",y)};f!==void 0&&f.texture.dispose();let d=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],v=o.morphAttributes.color||[],b=0;d===!0&&(b=1),m===!0&&(b=2),x===!0&&(b=3);let _=o.attributes.position.count*b,I=1;_>e.maxTextureSize&&(I=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);let S=new Float32Array(_*I*4*u),A=new Yr(S,_,I,u);A.type=Bn,A.needsUpdate=!0;let R=b*4;for(let M=0;M<u;M++){let C=g[M],U=p[M],D=v[M],N=_*I*4*M;for(let G=0;G<C.count;G++){let V=G*R;d===!0&&(s.fromBufferAttribute(C,G),S[N+V+0]=s.x,S[N+V+1]=s.y,S[N+V+2]=s.z,S[N+V+3]=0),m===!0&&(s.fromBufferAttribute(U,G),S[N+V+4]=s.x,S[N+V+5]=s.y,S[N+V+6]=s.z,S[N+V+7]=0),x===!0&&(s.fromBufferAttribute(D,G),S[N+V+8]=s.x,S[N+V+9]=s.y,S[N+V+10]=s.z,S[N+V+11]=D.itemSize===4?s.w:1)}}f={count:u,texture:A,size:new ue(_,I)},n.set(o,f),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let d=0;for(let x=0;x<l.length;x++)d+=l[x];let m=o.morphTargetsRelative?1:1-d;c.getUniforms().setValue(i,"morphTargetBaseInfluence",m),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function Zy(i,e,t,n){let s=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,u=e.get(c,h);if(s.get(u)!==l&&(e.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function a(){s=new WeakMap}function o(c){let l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:a}}var Jf=new an,Df=new sa(1,1),jf=new Yr,Qf=new Ao,ep=new ea,Uf=[],Nf=[],Ff=new Float32Array(16),Of=new Float32Array(9),Bf=new Float32Array(4);function pr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Uf[s];if(r===void 0&&(r=new Float32Array(s),Uf[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Gt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Vt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Kl(i,e){let t=Nf[e];t===void 0&&(t=new Int32Array(e),Nf[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Ky(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Jy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Gt(t,e))return;i.uniform2fv(this.addr,e),Vt(t,e)}}function jy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Gt(t,e))return;i.uniform3fv(this.addr,e),Vt(t,e)}}function Qy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Gt(t,e))return;i.uniform4fv(this.addr,e),Vt(t,e)}}function e_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Gt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Vt(t,e)}else{if(Gt(t,n))return;Bf.set(n),i.uniformMatrix2fv(this.addr,!1,Bf),Vt(t,n)}}function t_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Gt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Vt(t,e)}else{if(Gt(t,n))return;Of.set(n),i.uniformMatrix3fv(this.addr,!1,Of),Vt(t,n)}}function n_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Gt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Vt(t,e)}else{if(Gt(t,n))return;Ff.set(n),i.uniformMatrix4fv(this.addr,!1,Ff),Vt(t,n)}}function i_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function s_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Gt(t,e))return;i.uniform2iv(this.addr,e),Vt(t,e)}}function r_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Gt(t,e))return;i.uniform3iv(this.addr,e),Vt(t,e)}}function a_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Gt(t,e))return;i.uniform4iv(this.addr,e),Vt(t,e)}}function o_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function l_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Gt(t,e))return;i.uniform2uiv(this.addr,e),Vt(t,e)}}function c_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Gt(t,e))return;i.uniform3uiv(this.addr,e),Vt(t,e)}}function h_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Gt(t,e))return;i.uniform4uiv(this.addr,e),Vt(t,e)}}function u_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Df.compareFunction=Th,r=Df):r=Jf,t.setTexture2D(e||r,s)}function d_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Qf,s)}function f_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||ep,s)}function p_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||jf,s)}function m_(i){switch(i){case 5126:return Ky;case 35664:return Jy;case 35665:return jy;case 35666:return Qy;case 35674:return e_;case 35675:return t_;case 35676:return n_;case 5124:case 35670:return i_;case 35667:case 35671:return s_;case 35668:case 35672:return r_;case 35669:case 35673:return a_;case 5125:return o_;case 36294:return l_;case 36295:return c_;case 36296:return h_;case 35678:case 36198:case 36298:case 36306:case 35682:return u_;case 35679:case 36299:case 36307:return d_;case 35680:case 36300:case 36308:case 36293:return f_;case 36289:case 36303:case 36311:case 36292:return p_}}function g_(i,e){i.uniform1fv(this.addr,e)}function x_(i,e){let t=pr(e,this.size,2);i.uniform2fv(this.addr,t)}function y_(i,e){let t=pr(e,this.size,3);i.uniform3fv(this.addr,t)}function __(i,e){let t=pr(e,this.size,4);i.uniform4fv(this.addr,t)}function v_(i,e){let t=pr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function M_(i,e){let t=pr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function b_(i,e){let t=pr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function S_(i,e){i.uniform1iv(this.addr,e)}function E_(i,e){i.uniform2iv(this.addr,e)}function w_(i,e){i.uniform3iv(this.addr,e)}function T_(i,e){i.uniform4iv(this.addr,e)}function A_(i,e){i.uniform1uiv(this.addr,e)}function R_(i,e){i.uniform2uiv(this.addr,e)}function C_(i,e){i.uniform3uiv(this.addr,e)}function I_(i,e){i.uniform4uiv(this.addr,e)}function P_(i,e,t){let n=this.cache,s=e.length,r=Kl(t,s);Gt(n,r)||(i.uniform1iv(this.addr,r),Vt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Jf,r[a])}function L_(i,e,t){let n=this.cache,s=e.length,r=Kl(t,s);Gt(n,r)||(i.uniform1iv(this.addr,r),Vt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Qf,r[a])}function D_(i,e,t){let n=this.cache,s=e.length,r=Kl(t,s);Gt(n,r)||(i.uniform1iv(this.addr,r),Vt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||ep,r[a])}function U_(i,e,t){let n=this.cache,s=e.length,r=Kl(t,s);Gt(n,r)||(i.uniform1iv(this.addr,r),Vt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||jf,r[a])}function N_(i){switch(i){case 5126:return g_;case 35664:return x_;case 35665:return y_;case 35666:return __;case 35674:return v_;case 35675:return M_;case 35676:return b_;case 5124:case 35670:return S_;case 35667:case 35671:return E_;case 35668:case 35672:return w_;case 35669:case 35673:return T_;case 5125:return A_;case 36294:return R_;case 36295:return C_;case 36296:return I_;case 35678:case 36198:case 36298:case 36306:case 35682:return P_;case 35679:case 36299:case 36307:return L_;case 35680:case 36300:case 36308:case 36293:return D_;case 36289:case 36303:case 36311:case 36292:return U_}}var Hh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=m_(t.type)}},Gh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=N_(t.type)}},Vh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},zh=/(\w+)(\])?(\[|\.)?/g;function kf(i,e){i.seq.push(e),i.map[e.id]=e}function F_(i,e,t){let n=i.name,s=n.length;for(zh.lastIndex=0;;){let r=zh.exec(n),a=zh.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){kf(t,l===void 0?new Hh(o,i,e):new Gh(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new Vh(o),kf(t,u)),t=u}}}var fr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);F_(r,a,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function zf(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var O_=37297,B_=0;function k_(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var Hf=new We;function z_(i){tt._getMatrix(Hf,tt.workingColorSpace,i);let e=`mat3( ${Hf.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(i)){case Xr:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Gf(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+k_(i.getShaderSource(e),o)}else return r}function H_(i,e){let t=z_(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function G_(i,e){let t;switch(e){case Qd:t="Linear";break;case ef:t="Reinhard";break;case tf:t="Cineon";break;case ol:t="ACESFilmic";break;case sf:t="AgX";break;case rf:t="Neutral";break;case nf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var $l=new O;function V_(){tt.getLuminanceCoefficients($l);let i=$l.x.toFixed(4),e=$l.y.toFixed(4),t=$l.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function W_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(wa).join(`
`)}function X_(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function q_(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function wa(i){return i!==""}function Vf(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Wf(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var $_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wh(i){return i.replace($_,Z_)}var Y_=new Map;function Z_(i,e){let t=Ye[e];if(t===void 0){let n=Y_.get(e);if(n!==void 0)t=Ye[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Wh(t)}var K_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Xf(i){return i.replace(K_,J_)}function J_(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function qf(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function j_(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===fh?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Qo?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Jn&&(e="SHADOWMAP_TYPE_VSM"),e}function Q_(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ns:case is:e="ENVMAP_TYPE_CUBE";break;case _a:e="ENVMAP_TYPE_CUBE_UV";break}return e}function ev(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case is:e="ENVMAP_MODE_REFRACTION";break}return e}function tv(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case gh:e="ENVMAP_BLENDING_MULTIPLY";break;case Jd:e="ENVMAP_BLENDING_MIX";break;case jd:e="ENVMAP_BLENDING_ADD";break}return e}function nv(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function iv(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,c=j_(t),l=Q_(t),h=ev(t),u=tv(t),f=nv(t),d=W_(t),m=X_(r),x=s.createProgram(),g,p,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(wa).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(wa).join(`
`),p.length>0&&(p+=`
`)):(g=[qf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(wa).join(`
`),p=[qf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Mi?"#define TONE_MAPPING":"",t.toneMapping!==Mi?Ye.tonemapping_pars_fragment:"",t.toneMapping!==Mi?G_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ye.colorspace_pars_fragment,H_("linearToOutputTexel",t.outputColorSpace),V_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(wa).join(`
`)),a=Wh(a),a=Vf(a,t),a=Wf(a,t),o=Wh(o),o=Vf(o,t),o=Wf(o,t),a=Xf(a),o=Xf(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===Ah?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ah?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let b=v+g+a,_=v+p+o,I=zf(s,s.VERTEX_SHADER,b),S=zf(s,s.FRAGMENT_SHADER,_);s.attachShader(x,I),s.attachShader(x,S),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function A(C){if(i.debug.checkShaderErrors){let U=s.getProgramInfoLog(x)||"",D=s.getShaderInfoLog(I)||"",N=s.getShaderInfoLog(S)||"",G=U.trim(),V=D.trim(),j=N.trim(),W=!0,ce=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,I,S);else{let fe=Gf(s,I,"vertex"),Ae=Gf(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+G+`
`+fe+`
`+Ae)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(V===""||j==="")&&(ce=!1);ce&&(C.diagnostics={runnable:W,programLog:G,vertexShader:{log:V,prefix:g},fragmentShader:{log:j,prefix:p}})}s.deleteShader(I),s.deleteShader(S),R=new fr(s,x),y=q_(s,x)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let y;this.getAttributes=function(){return y===void 0&&A(this),y};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(x,O_)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=B_++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=I,this.fragmentShader=S,this}var sv=0,Xh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new qh(e),t.set(e,n)),n}},qh=class{constructor(e){this.id=sv++,this.code=e,this.usedTimes=0}};function rv(i,e,t,n,s,r,a){let o=new Kr,c=new Xh,l=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures,d=s.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(y){return l.add(y),y===0?"uv":`uv${y}`}function g(y,M,C,U,D){let N=U.fog,G=D.geometry,V=y.isMeshStandardMaterial?U.environment:null,j=(y.isMeshStandardMaterial?t:e).get(y.envMap||V),W=j&&j.mapping===_a?j.image.height:null,ce=m[y.type];y.precision!==null&&(d=s.getMaxPrecision(y.precision),d!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",d,"instead."));let fe=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Ae=fe!==void 0?fe.length:0,Je=0;G.morphAttributes.position!==void 0&&(Je=1),G.morphAttributes.normal!==void 0&&(Je=2),G.morphAttributes.color!==void 0&&(Je=3);let pt,Mt,st,J;if(ce){let rt=jn[ce];pt=rt.vertexShader,Mt=rt.fragmentShader}else pt=y.vertexShader,Mt=y.fragmentShader,c.update(y),st=c.getVertexShaderID(y),J=c.getFragmentShaderID(y);let te=i.getRenderTarget(),Me=i.state.buffers.depth.getReversed(),ze=D.isInstancedMesh===!0,De=D.isBatchedMesh===!0,et=!!y.map,Kt=!!y.matcap,F=!!j,bt=!!y.aoMap,Ve=!!y.lightMap,Be=!!y.bumpMap,Ee=!!y.normalMap,St=!!y.displacementMap,we=!!y.emissiveMap,$e=!!y.metalnessMap,Xt=!!y.roughnessMap,Dt=y.anisotropy>0,L=y.clearcoat>0,E=y.dispersion>0,H=y.iridescence>0,Z=y.sheen>0,ee=y.transmission>0,$=Dt&&!!y.anisotropyMap,Le=L&&!!y.clearcoatMap,oe=L&&!!y.clearcoatNormalMap,Re=L&&!!y.clearcoatRoughnessMap,Ce=H&&!!y.iridescenceMap,re=H&&!!y.iridescenceThicknessMap,ge=Z&&!!y.sheenColorMap,Oe=Z&&!!y.sheenRoughnessMap,Ie=!!y.specularMap,pe=!!y.specularColorMap,Xe=!!y.specularIntensityMap,B=ee&&!!y.transmissionMap,ae=ee&&!!y.thicknessMap,he=!!y.gradientMap,ye=!!y.alphaMap,ne=y.alphaTest>0,Q=!!y.alphaHash,Se=!!y.extensions,Ge=Mi;y.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Ge=i.toneMapping);let mt={shaderID:ce,shaderType:y.type,shaderName:y.name,vertexShader:pt,fragmentShader:Mt,defines:y.defines,customVertexShaderID:st,customFragmentShaderID:J,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:d,batching:De,batchingColor:De&&D._colorsTexture!==null,instancing:ze,instancingColor:ze&&D.instanceColor!==null,instancingMorph:ze&&D.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:te===null?i.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:Ji,alphaToCoverage:!!y.alphaToCoverage,map:et,matcap:Kt,envMap:F,envMapMode:F&&j.mapping,envMapCubeUVHeight:W,aoMap:bt,lightMap:Ve,bumpMap:Be,normalMap:Ee,displacementMap:f&&St,emissiveMap:we,normalMapObjectSpace:Ee&&y.normalMapType===cf,normalMapTangentSpace:Ee&&y.normalMapType===wh,metalnessMap:$e,roughnessMap:Xt,anisotropy:Dt,anisotropyMap:$,clearcoat:L,clearcoatMap:Le,clearcoatNormalMap:oe,clearcoatRoughnessMap:Re,dispersion:E,iridescence:H,iridescenceMap:Ce,iridescenceThicknessMap:re,sheen:Z,sheenColorMap:ge,sheenRoughnessMap:Oe,specularMap:Ie,specularColorMap:pe,specularIntensityMap:Xe,transmission:ee,transmissionMap:B,thicknessMap:ae,gradientMap:he,opaque:y.transparent===!1&&y.blending===Zi&&y.alphaToCoverage===!1,alphaMap:ye,alphaTest:ne,alphaHash:Q,combine:y.combine,mapUv:et&&x(y.map.channel),aoMapUv:bt&&x(y.aoMap.channel),lightMapUv:Ve&&x(y.lightMap.channel),bumpMapUv:Be&&x(y.bumpMap.channel),normalMapUv:Ee&&x(y.normalMap.channel),displacementMapUv:St&&x(y.displacementMap.channel),emissiveMapUv:we&&x(y.emissiveMap.channel),metalnessMapUv:$e&&x(y.metalnessMap.channel),roughnessMapUv:Xt&&x(y.roughnessMap.channel),anisotropyMapUv:$&&x(y.anisotropyMap.channel),clearcoatMapUv:Le&&x(y.clearcoatMap.channel),clearcoatNormalMapUv:oe&&x(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Re&&x(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&x(y.iridescenceMap.channel),iridescenceThicknessMapUv:re&&x(y.iridescenceThicknessMap.channel),sheenColorMapUv:ge&&x(y.sheenColorMap.channel),sheenRoughnessMapUv:Oe&&x(y.sheenRoughnessMap.channel),specularMapUv:Ie&&x(y.specularMap.channel),specularColorMapUv:pe&&x(y.specularColorMap.channel),specularIntensityMapUv:Xe&&x(y.specularIntensityMap.channel),transmissionMapUv:B&&x(y.transmissionMap.channel),thicknessMapUv:ae&&x(y.thicknessMap.channel),alphaMapUv:ye&&x(y.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(Ee||Dt),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!G.attributes.uv&&(et||ye),fog:!!N,useFog:y.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Me,skinning:D.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:Ae,morphTextureStride:Je,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ge,decodeVideoTexture:et&&y.map.isVideoTexture===!0&&tt.getTransfer(y.map.colorSpace)===ot,decodeVideoTextureEmissive:we&&y.emissiveMap.isVideoTexture===!0&&tt.getTransfer(y.emissiveMap.colorSpace)===ot,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===en,flipSided:y.side===Ht,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Se&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Se&&y.extensions.multiDraw===!0||De)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return mt.vertexUv1s=l.has(1),mt.vertexUv2s=l.has(2),mt.vertexUv3s=l.has(3),l.clear(),mt}function p(y){let M=[];if(y.shaderID?M.push(y.shaderID):(M.push(y.customVertexShaderID),M.push(y.customFragmentShaderID)),y.defines!==void 0)for(let C in y.defines)M.push(C),M.push(y.defines[C]);return y.isRawShaderMaterial===!1&&(v(M,y),b(M,y),M.push(i.outputColorSpace)),M.push(y.customProgramCacheKey),M.join()}function v(y,M){y.push(M.precision),y.push(M.outputColorSpace),y.push(M.envMapMode),y.push(M.envMapCubeUVHeight),y.push(M.mapUv),y.push(M.alphaMapUv),y.push(M.lightMapUv),y.push(M.aoMapUv),y.push(M.bumpMapUv),y.push(M.normalMapUv),y.push(M.displacementMapUv),y.push(M.emissiveMapUv),y.push(M.metalnessMapUv),y.push(M.roughnessMapUv),y.push(M.anisotropyMapUv),y.push(M.clearcoatMapUv),y.push(M.clearcoatNormalMapUv),y.push(M.clearcoatRoughnessMapUv),y.push(M.iridescenceMapUv),y.push(M.iridescenceThicknessMapUv),y.push(M.sheenColorMapUv),y.push(M.sheenRoughnessMapUv),y.push(M.specularMapUv),y.push(M.specularColorMapUv),y.push(M.specularIntensityMapUv),y.push(M.transmissionMapUv),y.push(M.thicknessMapUv),y.push(M.combine),y.push(M.fogExp2),y.push(M.sizeAttenuation),y.push(M.morphTargetsCount),y.push(M.morphAttributeCount),y.push(M.numDirLights),y.push(M.numPointLights),y.push(M.numSpotLights),y.push(M.numSpotLightMaps),y.push(M.numHemiLights),y.push(M.numRectAreaLights),y.push(M.numDirLightShadows),y.push(M.numPointLightShadows),y.push(M.numSpotLightShadows),y.push(M.numSpotLightShadowsWithMaps),y.push(M.numLightProbes),y.push(M.shadowMapType),y.push(M.toneMapping),y.push(M.numClippingPlanes),y.push(M.numClipIntersection),y.push(M.depthPacking)}function b(y,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),M.gradientMap&&o.enable(22),y.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),y.push(o.mask)}function _(y){let M=m[y.type],C;if(M){let U=jn[M];C=vf.clone(U.uniforms)}else C=y.uniforms;return C}function I(y,M){let C;for(let U=0,D=h.length;U<D;U++){let N=h[U];if(N.cacheKey===M){C=N,++C.usedTimes;break}}return C===void 0&&(C=new iv(i,M,y,r),h.push(C)),C}function S(y){if(--y.usedTimes===0){let M=h.indexOf(y);h[M]=h[h.length-1],h.pop(),y.destroy()}}function A(y){c.remove(y)}function R(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:_,acquireProgram:I,releaseProgram:S,releaseShaderCache:A,programs:h,dispose:R}}function av(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function ov(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function $f(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Yf(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u,f,d,m,x,g){let p=i[e];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:m,renderOrder:u.renderOrder,z:x,group:g},i[e]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=x,p.group=g),e++,p}function o(u,f,d,m,x,g){let p=a(u,f,d,m,x,g);d.transmission>0?n.push(p):d.transparent===!0?s.push(p):t.push(p)}function c(u,f,d,m,x,g){let p=a(u,f,d,m,x,g);d.transmission>0?n.unshift(p):d.transparent===!0?s.unshift(p):t.unshift(p)}function l(u,f){t.length>1&&t.sort(u||ov),n.length>1&&n.sort(f||$f),s.length>1&&s.sort(f||$f)}function h(){for(let u=e,f=i.length;u<f;u++){let d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:h,sort:l}}function lv(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new Yf,i.set(n,[a])):s>=r.length?(a=new Yf,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function cv(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new O,color:new Te};break;case"SpotLight":t={position:new O,direction:new O,color:new Te,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new O,color:new Te,distance:0,decay:0};break;case"HemisphereLight":t={direction:new O,skyColor:new Te,groundColor:new Te};break;case"RectAreaLight":t={color:new Te,position:new O,halfWidth:new O,halfHeight:new O};break}return i[e.id]=t,t}}}function hv(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ue};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ue};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var uv=0;function dv(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function fv(i){let e=new cv,t=hv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new O);let s=new O,r=new dt,a=new dt;function o(l){let h=0,u=0,f=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let d=0,m=0,x=0,g=0,p=0,v=0,b=0,_=0,I=0,S=0,A=0;l.sort(dv);for(let y=0,M=l.length;y<M;y++){let C=l[y],U=C.color,D=C.intensity,N=C.distance,G=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=U.r*D,u+=U.g*D,f+=U.b*D;else if(C.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(C.sh.coefficients[V],D);A++}else if(C.isDirectionalLight){let V=e.get(C);if(V.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let j=C.shadow,W=t.get(C);W.shadowIntensity=j.intensity,W.shadowBias=j.bias,W.shadowNormalBias=j.normalBias,W.shadowRadius=j.radius,W.shadowMapSize=j.mapSize,n.directionalShadow[d]=W,n.directionalShadowMap[d]=G,n.directionalShadowMatrix[d]=C.shadow.matrix,v++}n.directional[d]=V,d++}else if(C.isSpotLight){let V=e.get(C);V.position.setFromMatrixPosition(C.matrixWorld),V.color.copy(U).multiplyScalar(D),V.distance=N,V.coneCos=Math.cos(C.angle),V.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),V.decay=C.decay,n.spot[x]=V;let j=C.shadow;if(C.map&&(n.spotLightMap[I]=C.map,I++,j.updateMatrices(C),C.castShadow&&S++),n.spotLightMatrix[x]=j.matrix,C.castShadow){let W=t.get(C);W.shadowIntensity=j.intensity,W.shadowBias=j.bias,W.shadowNormalBias=j.normalBias,W.shadowRadius=j.radius,W.shadowMapSize=j.mapSize,n.spotShadow[x]=W,n.spotShadowMap[x]=G,_++}x++}else if(C.isRectAreaLight){let V=e.get(C);V.color.copy(U).multiplyScalar(D),V.halfWidth.set(C.width*.5,0,0),V.halfHeight.set(0,C.height*.5,0),n.rectArea[g]=V,g++}else if(C.isPointLight){let V=e.get(C);if(V.color.copy(C.color).multiplyScalar(C.intensity),V.distance=C.distance,V.decay=C.decay,C.castShadow){let j=C.shadow,W=t.get(C);W.shadowIntensity=j.intensity,W.shadowBias=j.bias,W.shadowNormalBias=j.normalBias,W.shadowRadius=j.radius,W.shadowMapSize=j.mapSize,W.shadowCameraNear=j.camera.near,W.shadowCameraFar=j.camera.far,n.pointShadow[m]=W,n.pointShadowMap[m]=G,n.pointShadowMatrix[m]=C.shadow.matrix,b++}n.point[m]=V,m++}else if(C.isHemisphereLight){let V=e.get(C);V.skyColor.copy(C.color).multiplyScalar(D),V.groundColor.copy(C.groundColor).multiplyScalar(D),n.hemi[p]=V,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=de.LTC_FLOAT_1,n.rectAreaLTC2=de.LTC_FLOAT_2):(n.rectAreaLTC1=de.LTC_HALF_1,n.rectAreaLTC2=de.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;let R=n.hash;(R.directionalLength!==d||R.pointLength!==m||R.spotLength!==x||R.rectAreaLength!==g||R.hemiLength!==p||R.numDirectionalShadows!==v||R.numPointShadows!==b||R.numSpotShadows!==_||R.numSpotMaps!==I||R.numLightProbes!==A)&&(n.directional.length=d,n.spot.length=x,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=_+I-S,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=A,R.directionalLength=d,R.pointLength=m,R.spotLength=x,R.rectAreaLength=g,R.hemiLength=p,R.numDirectionalShadows=v,R.numPointShadows=b,R.numSpotShadows=_,R.numSpotMaps=I,R.numLightProbes=A,n.version=uv++)}function c(l,h){let u=0,f=0,d=0,m=0,x=0,g=h.matrixWorldInverse;for(let p=0,v=l.length;p<v;p++){let b=l[p];if(b.isDirectionalLight){let _=n.directional[u];_.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),u++}else if(b.isSpotLight){let _=n.spot[d];_.position.setFromMatrixPosition(b.matrixWorld),_.position.applyMatrix4(g),_.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),d++}else if(b.isRectAreaLight){let _=n.rectArea[m];_.position.setFromMatrixPosition(b.matrixWorld),_.position.applyMatrix4(g),a.identity(),r.copy(b.matrixWorld),r.premultiply(g),a.extractRotation(r),_.halfWidth.set(b.width*.5,0,0),_.halfHeight.set(0,b.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),m++}else if(b.isPointLight){let _=n.point[f];_.position.setFromMatrixPosition(b.matrixWorld),_.position.applyMatrix4(g),f++}else if(b.isHemisphereLight){let _=n.hemi[x];_.direction.setFromMatrixPosition(b.matrixWorld),_.direction.transformDirection(g),x++}}}return{setup:o,setupView:c,state:n}}function Zf(i){let e=new fv(i),t=[],n=[];function s(h){l.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function c(h){e.setupView(t,h)}let l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function pv(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new Zf(i),e.set(s,[o])):r>=a.length?(o=new Zf(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var mv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,gv=`uniform sampler2D shadow_pass;
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
}`;function xv(i,e,t){let n=new er,s=new ue,r=new ue,a=new Ct,o=new Ho({depthPacking:lf}),c=new Go,l={},h=t.maxTextureSize,u={[ui]:Ht,[Ht]:ui,[en]:en},f=new Nn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ue},radius:{value:4}},vertexShader:mv,fragmentShader:gv}),d=f.clone();d.defines.HORIZONTAL_PASS=1;let m=new je;m.setAttribute("position",new Ut(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new _e(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=fh;let p=this.type;this.render=function(S,A,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;let y=i.getRenderTarget(),M=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),U=i.state;U.setBlending(vi),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);let D=p!==Jn&&this.type===Jn,N=p===Jn&&this.type!==Jn;for(let G=0,V=S.length;G<V;G++){let j=S[G],W=j.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);let ce=W.getFrameExtents();if(s.multiply(ce),r.copy(W.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ce.x),s.x=r.x*ce.x,W.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ce.y),s.y=r.y*ce.y,W.mapSize.y=r.y)),W.map===null||D===!0||N===!0){let Ae=this.type!==Jn?{minFilter:cn,magFilter:cn}:{};W.map!==null&&W.map.dispose(),W.map=new qn(s.x,s.y,Ae),W.map.texture.name=j.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();let fe=W.getViewportCount();for(let Ae=0;Ae<fe;Ae++){let Je=W.getViewport(Ae);a.set(r.x*Je.x,r.y*Je.y,r.x*Je.z,r.y*Je.w),U.viewport(a),W.updateMatrices(j,Ae),n=W.getFrustum(),_(A,R,W.camera,j,this.type)}W.isPointLightShadow!==!0&&this.type===Jn&&v(W,R),W.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(y,M,C)};function v(S,A){let R=e.update(x);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new qn(s.x,s.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(A,null,R,f,x,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(A,null,R,d,x,null)}function b(S,A,R,y){let M=null,C=R.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(C!==void 0)M=C;else if(M=R.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let U=M.uuid,D=A.uuid,N=l[U];N===void 0&&(N={},l[U]=N);let G=N[D];G===void 0&&(G=M.clone(),N[D]=G,A.addEventListener("dispose",I)),M=G}if(M.visible=A.visible,M.wireframe=A.wireframe,y===Jn?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:u[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,R.isPointLight===!0&&M.isMeshDistanceMaterial===!0){let U=i.properties.get(M);U.light=R}return M}function _(S,A,R,y,M){if(S.visible===!1)return;if(S.layers.test(A.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&M===Jn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,S.matrixWorld);let D=e.update(S),N=S.material;if(Array.isArray(N)){let G=D.groups;for(let V=0,j=G.length;V<j;V++){let W=G[V],ce=N[W.materialIndex];if(ce&&ce.visible){let fe=b(S,ce,y,M);S.onBeforeShadow(i,S,A,R,D,fe,W),i.renderBufferDirect(R,null,D,fe,S,W),S.onAfterShadow(i,S,A,R,D,fe,W)}}}else if(N.visible){let G=b(S,N,y,M);S.onBeforeShadow(i,S,A,R,D,G,null),i.renderBufferDirect(R,null,D,G,S,null),S.onAfterShadow(i,S,A,R,D,G,null)}}let U=S.children;for(let D=0,N=U.length;D<N;D++)_(U[D],A,R,y,M)}function I(S){S.target.removeEventListener("dispose",I);for(let R in l){let y=l[R],M=S.target.uuid;M in y&&(y[M].dispose(),delete y[M])}}}var yv={[el]:tl,[nl]:rl,[il]:al,[Ki]:sl,[tl]:el,[rl]:nl,[al]:il,[sl]:Ki};function _v(i,e){function t(){let B=!1,ae=new Ct,he=null,ye=new Ct(0,0,0,0);return{setMask:function(ne){he!==ne&&!B&&(i.colorMask(ne,ne,ne,ne),he=ne)},setLocked:function(ne){B=ne},setClear:function(ne,Q,Se,Ge,mt){mt===!0&&(ne*=Ge,Q*=Ge,Se*=Ge),ae.set(ne,Q,Se,Ge),ye.equals(ae)===!1&&(i.clearColor(ne,Q,Se,Ge),ye.copy(ae))},reset:function(){B=!1,he=null,ye.set(-1,0,0,0)}}}function n(){let B=!1,ae=!1,he=null,ye=null,ne=null;return{setReversed:function(Q){if(ae!==Q){let Se=e.get("EXT_clip_control");Q?Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.ZERO_TO_ONE_EXT):Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.NEGATIVE_ONE_TO_ONE_EXT),ae=Q;let Ge=ne;ne=null,this.setClear(Ge)}},getReversed:function(){return ae},setTest:function(Q){Q?te(i.DEPTH_TEST):Me(i.DEPTH_TEST)},setMask:function(Q){he!==Q&&!B&&(i.depthMask(Q),he=Q)},setFunc:function(Q){if(ae&&(Q=yv[Q]),ye!==Q){switch(Q){case el:i.depthFunc(i.NEVER);break;case tl:i.depthFunc(i.ALWAYS);break;case nl:i.depthFunc(i.LESS);break;case Ki:i.depthFunc(i.LEQUAL);break;case il:i.depthFunc(i.EQUAL);break;case sl:i.depthFunc(i.GEQUAL);break;case rl:i.depthFunc(i.GREATER);break;case al:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ye=Q}},setLocked:function(Q){B=Q},setClear:function(Q){ne!==Q&&(ae&&(Q=1-Q),i.clearDepth(Q),ne=Q)},reset:function(){B=!1,he=null,ye=null,ne=null,ae=!1}}}function s(){let B=!1,ae=null,he=null,ye=null,ne=null,Q=null,Se=null,Ge=null,mt=null;return{setTest:function(rt){B||(rt?te(i.STENCIL_TEST):Me(i.STENCIL_TEST))},setMask:function(rt){ae!==rt&&!B&&(i.stencilMask(rt),ae=rt)},setFunc:function(rt,ii,Vn){(he!==rt||ye!==ii||ne!==Vn)&&(i.stencilFunc(rt,ii,Vn),he=rt,ye=ii,ne=Vn)},setOp:function(rt,ii,Vn){(Q!==rt||Se!==ii||Ge!==Vn)&&(i.stencilOp(rt,ii,Vn),Q=rt,Se=ii,Ge=Vn)},setLocked:function(rt){B=rt},setClear:function(rt){mt!==rt&&(i.clearStencil(rt),mt=rt)},reset:function(){B=!1,ae=null,he=null,ye=null,ne=null,Q=null,Se=null,Ge=null,mt=null}}}let r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap,h={},u={},f=new WeakMap,d=[],m=null,x=!1,g=null,p=null,v=null,b=null,_=null,I=null,S=null,A=new Te(0,0,0),R=0,y=!1,M=null,C=null,U=null,D=null,N=null,G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),V=!1,j=0,W=i.getParameter(i.VERSION);W.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(W)[1]),V=j>=1):W.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),V=j>=2);let ce=null,fe={},Ae=i.getParameter(i.SCISSOR_BOX),Je=i.getParameter(i.VIEWPORT),pt=new Ct().fromArray(Ae),Mt=new Ct().fromArray(Je);function st(B,ae,he,ye){let ne=new Uint8Array(4),Q=i.createTexture();i.bindTexture(B,Q),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Se=0;Se<he;Se++)B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY?i.texImage3D(ae,0,i.RGBA,1,1,ye,0,i.RGBA,i.UNSIGNED_BYTE,ne):i.texImage2D(ae+Se,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ne);return Q}let J={};J[i.TEXTURE_2D]=st(i.TEXTURE_2D,i.TEXTURE_2D,1),J[i.TEXTURE_CUBE_MAP]=st(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[i.TEXTURE_2D_ARRAY]=st(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),J[i.TEXTURE_3D]=st(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),te(i.DEPTH_TEST),a.setFunc(Ki),Be(!1),Ee(dh),te(i.CULL_FACE),bt(vi);function te(B){h[B]!==!0&&(i.enable(B),h[B]=!0)}function Me(B){h[B]!==!1&&(i.disable(B),h[B]=!1)}function ze(B,ae){return u[B]!==ae?(i.bindFramebuffer(B,ae),u[B]=ae,B===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=ae),B===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=ae),!0):!1}function De(B,ae){let he=d,ye=!1;if(B){he=f.get(ae),he===void 0&&(he=[],f.set(ae,he));let ne=B.textures;if(he.length!==ne.length||he[0]!==i.COLOR_ATTACHMENT0){for(let Q=0,Se=ne.length;Q<Se;Q++)he[Q]=i.COLOR_ATTACHMENT0+Q;he.length=ne.length,ye=!0}}else he[0]!==i.BACK&&(he[0]=i.BACK,ye=!0);ye&&i.drawBuffers(he)}function et(B){return m!==B?(i.useProgram(B),m=B,!0):!1}let Kt={[Ii]:i.FUNC_ADD,[Ud]:i.FUNC_SUBTRACT,[Nd]:i.FUNC_REVERSE_SUBTRACT};Kt[Fd]=i.MIN,Kt[Od]=i.MAX;let F={[Bd]:i.ZERO,[kd]:i.ONE,[zd]:i.SRC_COLOR,[vo]:i.SRC_ALPHA,[qd]:i.SRC_ALPHA_SATURATE,[Wd]:i.DST_COLOR,[Gd]:i.DST_ALPHA,[Hd]:i.ONE_MINUS_SRC_COLOR,[Mo]:i.ONE_MINUS_SRC_ALPHA,[Xd]:i.ONE_MINUS_DST_COLOR,[Vd]:i.ONE_MINUS_DST_ALPHA,[$d]:i.CONSTANT_COLOR,[Yd]:i.ONE_MINUS_CONSTANT_COLOR,[Zd]:i.CONSTANT_ALPHA,[Kd]:i.ONE_MINUS_CONSTANT_ALPHA};function bt(B,ae,he,ye,ne,Q,Se,Ge,mt,rt){if(B===vi){x===!0&&(Me(i.BLEND),x=!1);return}if(x===!1&&(te(i.BLEND),x=!0),B!==Dd){if(B!==g||rt!==y){if((p!==Ii||_!==Ii)&&(i.blendEquation(i.FUNC_ADD),p=Ii,_=Ii),rt)switch(B){case Zi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case _n:i.blendFunc(i.ONE,i.ONE);break;case ph:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case mh:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case Zi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case _n:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case ph:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case mh:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}v=null,b=null,I=null,S=null,A.set(0,0,0),R=0,g=B,y=rt}return}ne=ne||ae,Q=Q||he,Se=Se||ye,(ae!==p||ne!==_)&&(i.blendEquationSeparate(Kt[ae],Kt[ne]),p=ae,_=ne),(he!==v||ye!==b||Q!==I||Se!==S)&&(i.blendFuncSeparate(F[he],F[ye],F[Q],F[Se]),v=he,b=ye,I=Q,S=Se),(Ge.equals(A)===!1||mt!==R)&&(i.blendColor(Ge.r,Ge.g,Ge.b,mt),A.copy(Ge),R=mt),g=B,y=!1}function Ve(B,ae){B.side===en?Me(i.CULL_FACE):te(i.CULL_FACE);let he=B.side===Ht;ae&&(he=!he),Be(he),B.blending===Zi&&B.transparent===!1?bt(vi):bt(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),a.setFunc(B.depthFunc),a.setTest(B.depthTest),a.setMask(B.depthWrite),r.setMask(B.colorWrite);let ye=B.stencilWrite;o.setTest(ye),ye&&(o.setMask(B.stencilWriteMask),o.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),o.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),we(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?te(i.SAMPLE_ALPHA_TO_COVERAGE):Me(i.SAMPLE_ALPHA_TO_COVERAGE)}function Be(B){M!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),M=B)}function Ee(B){B!==Pd?(te(i.CULL_FACE),B!==C&&(B===dh?i.cullFace(i.BACK):B===Ld?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Me(i.CULL_FACE),C=B}function St(B){B!==U&&(V&&i.lineWidth(B),U=B)}function we(B,ae,he){B?(te(i.POLYGON_OFFSET_FILL),(D!==ae||N!==he)&&(i.polygonOffset(ae,he),D=ae,N=he)):Me(i.POLYGON_OFFSET_FILL)}function $e(B){B?te(i.SCISSOR_TEST):Me(i.SCISSOR_TEST)}function Xt(B){B===void 0&&(B=i.TEXTURE0+G-1),ce!==B&&(i.activeTexture(B),ce=B)}function Dt(B,ae,he){he===void 0&&(ce===null?he=i.TEXTURE0+G-1:he=ce);let ye=fe[he];ye===void 0&&(ye={type:void 0,texture:void 0},fe[he]=ye),(ye.type!==B||ye.texture!==ae)&&(ce!==he&&(i.activeTexture(he),ce=he),i.bindTexture(B,ae||J[B]),ye.type=B,ye.texture=ae)}function L(){let B=fe[ce];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function E(){try{i.compressedTexImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function H(){try{i.compressedTexImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Z(){try{i.texSubImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ee(){try{i.texSubImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function $(){try{i.compressedTexSubImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Le(){try{i.compressedTexSubImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function oe(){try{i.texStorage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Re(){try{i.texStorage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ce(){try{i.texImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function re(){try{i.texImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ge(B){pt.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),pt.copy(B))}function Oe(B){Mt.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),Mt.copy(B))}function Ie(B,ae){let he=l.get(ae);he===void 0&&(he=new WeakMap,l.set(ae,he));let ye=he.get(B);ye===void 0&&(ye=i.getUniformBlockIndex(ae,B.name),he.set(B,ye))}function pe(B,ae){let ye=l.get(ae).get(B);c.get(ae)!==ye&&(i.uniformBlockBinding(ae,ye,B.__bindingPointIndex),c.set(ae,ye))}function Xe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ce=null,fe={},u={},f=new WeakMap,d=[],m=null,x=!1,g=null,p=null,v=null,b=null,_=null,I=null,S=null,A=new Te(0,0,0),R=0,y=!1,M=null,C=null,U=null,D=null,N=null,pt.set(0,0,i.canvas.width,i.canvas.height),Mt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:te,disable:Me,bindFramebuffer:ze,drawBuffers:De,useProgram:et,setBlending:bt,setMaterial:Ve,setFlipSided:Be,setCullFace:Ee,setLineWidth:St,setPolygonOffset:we,setScissorTest:$e,activeTexture:Xt,bindTexture:Dt,unbindTexture:L,compressedTexImage2D:E,compressedTexImage3D:H,texImage2D:Ce,texImage3D:re,updateUBOMapping:Ie,uniformBlockBinding:pe,texStorage2D:oe,texStorage3D:Re,texSubImage2D:Z,texSubImage3D:ee,compressedTexSubImage2D:$,compressedTexSubImage3D:Le,scissor:ge,viewport:Oe,reset:Xe}}function vv(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ue,h=new WeakMap,u,f=new WeakMap,d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(L,E){return d?new OffscreenCanvas(L,E):$r("canvas")}function x(L,E,H){let Z=1,ee=Dt(L);if((ee.width>H||ee.height>H)&&(Z=H/Math.max(ee.width,ee.height)),Z<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){let $=Math.floor(Z*ee.width),Le=Math.floor(Z*ee.height);u===void 0&&(u=m($,Le));let oe=E?m($,Le):u;return oe.width=$,oe.height=Le,oe.getContext("2d").drawImage(L,0,0,$,Le),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+$+"x"+Le+")."),oe}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),L;return L}function g(L){return L.generateMipmaps}function p(L){i.generateMipmap(L)}function v(L){return L.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?i.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(L,E,H,Z,ee=!1){if(L!==null){if(i[L]!==void 0)return i[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let $=E;if(E===i.RED&&(H===i.FLOAT&&($=i.R32F),H===i.HALF_FLOAT&&($=i.R16F),H===i.UNSIGNED_BYTE&&($=i.R8)),E===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.R8UI),H===i.UNSIGNED_SHORT&&($=i.R16UI),H===i.UNSIGNED_INT&&($=i.R32UI),H===i.BYTE&&($=i.R8I),H===i.SHORT&&($=i.R16I),H===i.INT&&($=i.R32I)),E===i.RG&&(H===i.FLOAT&&($=i.RG32F),H===i.HALF_FLOAT&&($=i.RG16F),H===i.UNSIGNED_BYTE&&($=i.RG8)),E===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.RG8UI),H===i.UNSIGNED_SHORT&&($=i.RG16UI),H===i.UNSIGNED_INT&&($=i.RG32UI),H===i.BYTE&&($=i.RG8I),H===i.SHORT&&($=i.RG16I),H===i.INT&&($=i.RG32I)),E===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.RGB8UI),H===i.UNSIGNED_SHORT&&($=i.RGB16UI),H===i.UNSIGNED_INT&&($=i.RGB32UI),H===i.BYTE&&($=i.RGB8I),H===i.SHORT&&($=i.RGB16I),H===i.INT&&($=i.RGB32I)),E===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.RGBA8UI),H===i.UNSIGNED_SHORT&&($=i.RGBA16UI),H===i.UNSIGNED_INT&&($=i.RGBA32UI),H===i.BYTE&&($=i.RGBA8I),H===i.SHORT&&($=i.RGBA16I),H===i.INT&&($=i.RGBA32I)),E===i.RGB&&(H===i.UNSIGNED_INT_5_9_9_9_REV&&($=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&($=i.R11F_G11F_B10F)),E===i.RGBA){let Le=ee?Xr:tt.getTransfer(Z);H===i.FLOAT&&($=i.RGBA32F),H===i.HALF_FLOAT&&($=i.RGBA16F),H===i.UNSIGNED_BYTE&&($=Le===ot?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT_4_4_4_4&&($=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&($=i.RGB5_A1)}return($===i.R16F||$===i.R32F||$===i.RG16F||$===i.RG32F||$===i.RGBA16F||$===i.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function _(L,E){let H;return L?E===null||E===Fi||E===cr?H=i.DEPTH24_STENCIL8:E===Bn?H=i.DEPTH32F_STENCIL8:E===or&&(H=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Fi||E===cr?H=i.DEPTH_COMPONENT24:E===Bn?H=i.DEPTH_COMPONENT32F:E===or&&(H=i.DEPTH_COMPONENT16),H}function I(L,E){return g(L)===!0||L.isFramebufferTexture&&L.minFilter!==cn&&L.minFilter!==Dn?Math.log2(Math.max(E.width,E.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?E.mipmaps.length:1}function S(L){let E=L.target;E.removeEventListener("dispose",S),R(E),E.isVideoTexture&&h.delete(E)}function A(L){let E=L.target;E.removeEventListener("dispose",A),M(E)}function R(L){let E=n.get(L);if(E.__webglInit===void 0)return;let H=L.source,Z=f.get(H);if(Z){let ee=Z[E.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&y(L),Object.keys(Z).length===0&&f.delete(H)}n.remove(L)}function y(L){let E=n.get(L);i.deleteTexture(E.__webglTexture);let H=L.source,Z=f.get(H);delete Z[E.__cacheKey],a.memory.textures--}function M(L){let E=n.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),n.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(E.__webglFramebuffer[Z]))for(let ee=0;ee<E.__webglFramebuffer[Z].length;ee++)i.deleteFramebuffer(E.__webglFramebuffer[Z][ee]);else i.deleteFramebuffer(E.__webglFramebuffer[Z]);E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer[Z])}else{if(Array.isArray(E.__webglFramebuffer))for(let Z=0;Z<E.__webglFramebuffer.length;Z++)i.deleteFramebuffer(E.__webglFramebuffer[Z]);else i.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&i.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let Z=0;Z<E.__webglColorRenderbuffer.length;Z++)E.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(E.__webglColorRenderbuffer[Z]);E.__webglDepthRenderbuffer&&i.deleteRenderbuffer(E.__webglDepthRenderbuffer)}let H=L.textures;for(let Z=0,ee=H.length;Z<ee;Z++){let $=n.get(H[Z]);$.__webglTexture&&(i.deleteTexture($.__webglTexture),a.memory.textures--),n.remove(H[Z])}n.remove(L)}let C=0;function U(){C=0}function D(){let L=C;return L>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+s.maxTextures),C+=1,L}function N(L){let E=[];return E.push(L.wrapS),E.push(L.wrapT),E.push(L.wrapR||0),E.push(L.magFilter),E.push(L.minFilter),E.push(L.anisotropy),E.push(L.internalFormat),E.push(L.format),E.push(L.type),E.push(L.generateMipmaps),E.push(L.premultiplyAlpha),E.push(L.flipY),E.push(L.unpackAlignment),E.push(L.colorSpace),E.join()}function G(L,E){let H=n.get(L);if(L.isVideoTexture&&$e(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&H.__version!==L.version){let Z=L.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(H,L,E);return}}else L.isExternalTexture&&(H.__webglTexture=L.sourceTexture?L.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+E)}function V(L,E){let H=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&H.__version!==L.version){J(H,L,E);return}t.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+E)}function j(L,E){let H=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&H.__version!==L.version){J(H,L,E);return}t.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+E)}function W(L,E){let H=n.get(L);if(L.version>0&&H.__version!==L.version){te(H,L,E);return}t.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+E)}let ce={[Pi]:i.REPEAT,[Ci]:i.CLAMP_TO_EDGE,[bo]:i.MIRRORED_REPEAT},fe={[cn]:i.NEAREST,[af]:i.NEAREST_MIPMAP_NEAREST,[va]:i.NEAREST_MIPMAP_LINEAR,[Dn]:i.LINEAR,[cl]:i.LINEAR_MIPMAP_NEAREST,[Ni]:i.LINEAR_MIPMAP_LINEAR},Ae={[hf]:i.NEVER,[gf]:i.ALWAYS,[uf]:i.LESS,[Th]:i.LEQUAL,[df]:i.EQUAL,[mf]:i.GEQUAL,[ff]:i.GREATER,[pf]:i.NOTEQUAL};function Je(L,E){if(E.type===Bn&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===Dn||E.magFilter===cl||E.magFilter===va||E.magFilter===Ni||E.minFilter===Dn||E.minFilter===cl||E.minFilter===va||E.minFilter===Ni)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(L,i.TEXTURE_WRAP_S,ce[E.wrapS]),i.texParameteri(L,i.TEXTURE_WRAP_T,ce[E.wrapT]),(L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY)&&i.texParameteri(L,i.TEXTURE_WRAP_R,ce[E.wrapR]),i.texParameteri(L,i.TEXTURE_MAG_FILTER,fe[E.magFilter]),i.texParameteri(L,i.TEXTURE_MIN_FILTER,fe[E.minFilter]),E.compareFunction&&(i.texParameteri(L,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(L,i.TEXTURE_COMPARE_FUNC,Ae[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===cn||E.minFilter!==va&&E.minFilter!==Ni||E.type===Bn&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||n.get(E).__currentAnisotropy){let H=e.get("EXT_texture_filter_anisotropic");i.texParameterf(L,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy}}}function pt(L,E){let H=!1;L.__webglInit===void 0&&(L.__webglInit=!0,E.addEventListener("dispose",S));let Z=E.source,ee=f.get(Z);ee===void 0&&(ee={},f.set(Z,ee));let $=N(E);if($!==L.__cacheKey){ee[$]===void 0&&(ee[$]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,H=!0),ee[$].usedTimes++;let Le=ee[L.__cacheKey];Le!==void 0&&(ee[L.__cacheKey].usedTimes--,Le.usedTimes===0&&y(E)),L.__cacheKey=$,L.__webglTexture=ee[$].texture}return H}function Mt(L,E,H){return Math.floor(Math.floor(L/H)/E)}function st(L,E,H,Z){let $=L.updateRanges;if($.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,E.width,E.height,H,Z,E.data);else{$.sort((re,ge)=>re.start-ge.start);let Le=0;for(let re=1;re<$.length;re++){let ge=$[Le],Oe=$[re],Ie=ge.start+ge.count,pe=Mt(Oe.start,E.width,4),Xe=Mt(ge.start,E.width,4);Oe.start<=Ie+1&&pe===Xe&&Mt(Oe.start+Oe.count-1,E.width,4)===pe?ge.count=Math.max(ge.count,Oe.start+Oe.count-ge.start):(++Le,$[Le]=Oe)}$.length=Le+1;let oe=i.getParameter(i.UNPACK_ROW_LENGTH),Re=i.getParameter(i.UNPACK_SKIP_PIXELS),Ce=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,E.width);for(let re=0,ge=$.length;re<ge;re++){let Oe=$[re],Ie=Math.floor(Oe.start/4),pe=Math.ceil(Oe.count/4),Xe=Ie%E.width,B=Math.floor(Ie/E.width),ae=pe,he=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Xe),i.pixelStorei(i.UNPACK_SKIP_ROWS,B),t.texSubImage2D(i.TEXTURE_2D,0,Xe,B,ae,he,H,Z,E.data)}L.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,oe),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Re),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ce)}}function J(L,E,H){let Z=i.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(Z=i.TEXTURE_2D_ARRAY),E.isData3DTexture&&(Z=i.TEXTURE_3D);let ee=pt(L,E),$=E.source;t.bindTexture(Z,L.__webglTexture,i.TEXTURE0+H);let Le=n.get($);if($.version!==Le.__version||ee===!0){t.activeTexture(i.TEXTURE0+H);let oe=tt.getPrimaries(tt.workingColorSpace),Re=E.colorSpace===kn?null:tt.getPrimaries(E.colorSpace),Ce=E.colorSpace===kn||oe===Re?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce);let re=x(E.image,!1,s.maxTextureSize);re=Xt(E,re);let ge=r.convert(E.format,E.colorSpace),Oe=r.convert(E.type),Ie=b(E.internalFormat,ge,Oe,E.colorSpace,E.isVideoTexture);Je(Z,E);let pe,Xe=E.mipmaps,B=E.isVideoTexture!==!0,ae=Le.__version===void 0||ee===!0,he=$.dataReady,ye=I(E,re);if(E.isDepthTexture)Ie=_(E.format===hr,E.type),ae&&(B?t.texStorage2D(i.TEXTURE_2D,1,Ie,re.width,re.height):t.texImage2D(i.TEXTURE_2D,0,Ie,re.width,re.height,0,ge,Oe,null));else if(E.isDataTexture)if(Xe.length>0){B&&ae&&t.texStorage2D(i.TEXTURE_2D,ye,Ie,Xe[0].width,Xe[0].height);for(let ne=0,Q=Xe.length;ne<Q;ne++)pe=Xe[ne],B?he&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,pe.width,pe.height,ge,Oe,pe.data):t.texImage2D(i.TEXTURE_2D,ne,Ie,pe.width,pe.height,0,ge,Oe,pe.data);E.generateMipmaps=!1}else B?(ae&&t.texStorage2D(i.TEXTURE_2D,ye,Ie,re.width,re.height),he&&st(E,re,ge,Oe)):t.texImage2D(i.TEXTURE_2D,0,Ie,re.width,re.height,0,ge,Oe,re.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){B&&ae&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ye,Ie,Xe[0].width,Xe[0].height,re.depth);for(let ne=0,Q=Xe.length;ne<Q;ne++)if(pe=Xe[ne],E.format!==Tn)if(ge!==null)if(B){if(he)if(E.layerUpdates.size>0){let Se=Uh(pe.width,pe.height,E.format,E.type);for(let Ge of E.layerUpdates){let mt=pe.data.subarray(Ge*Se/pe.data.BYTES_PER_ELEMENT,(Ge+1)*Se/pe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,Ge,pe.width,pe.height,1,ge,mt)}E.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,0,pe.width,pe.height,re.depth,ge,pe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ne,Ie,pe.width,pe.height,re.depth,0,pe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else B?he&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,0,pe.width,pe.height,re.depth,ge,Oe,pe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ne,Ie,pe.width,pe.height,re.depth,0,ge,Oe,pe.data)}else{B&&ae&&t.texStorage2D(i.TEXTURE_2D,ye,Ie,Xe[0].width,Xe[0].height);for(let ne=0,Q=Xe.length;ne<Q;ne++)pe=Xe[ne],E.format!==Tn?ge!==null?B?he&&t.compressedTexSubImage2D(i.TEXTURE_2D,ne,0,0,pe.width,pe.height,ge,pe.data):t.compressedTexImage2D(i.TEXTURE_2D,ne,Ie,pe.width,pe.height,0,pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):B?he&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,pe.width,pe.height,ge,Oe,pe.data):t.texImage2D(i.TEXTURE_2D,ne,Ie,pe.width,pe.height,0,ge,Oe,pe.data)}else if(E.isDataArrayTexture)if(B){if(ae&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ye,Ie,re.width,re.height,re.depth),he)if(E.layerUpdates.size>0){let ne=Uh(re.width,re.height,E.format,E.type);for(let Q of E.layerUpdates){let Se=re.data.subarray(Q*ne/re.data.BYTES_PER_ELEMENT,(Q+1)*ne/re.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Q,re.width,re.height,1,ge,Oe,Se)}E.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,ge,Oe,re.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ie,re.width,re.height,re.depth,0,ge,Oe,re.data);else if(E.isData3DTexture)B?(ae&&t.texStorage3D(i.TEXTURE_3D,ye,Ie,re.width,re.height,re.depth),he&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,ge,Oe,re.data)):t.texImage3D(i.TEXTURE_3D,0,Ie,re.width,re.height,re.depth,0,ge,Oe,re.data);else if(E.isFramebufferTexture){if(ae)if(B)t.texStorage2D(i.TEXTURE_2D,ye,Ie,re.width,re.height);else{let ne=re.width,Q=re.height;for(let Se=0;Se<ye;Se++)t.texImage2D(i.TEXTURE_2D,Se,Ie,ne,Q,0,ge,Oe,null),ne>>=1,Q>>=1}}else if(Xe.length>0){if(B&&ae){let ne=Dt(Xe[0]);t.texStorage2D(i.TEXTURE_2D,ye,Ie,ne.width,ne.height)}for(let ne=0,Q=Xe.length;ne<Q;ne++)pe=Xe[ne],B?he&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,ge,Oe,pe):t.texImage2D(i.TEXTURE_2D,ne,Ie,ge,Oe,pe);E.generateMipmaps=!1}else if(B){if(ae){let ne=Dt(re);t.texStorage2D(i.TEXTURE_2D,ye,Ie,ne.width,ne.height)}he&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ge,Oe,re)}else t.texImage2D(i.TEXTURE_2D,0,Ie,ge,Oe,re);g(E)&&p(Z),Le.__version=$.version,E.onUpdate&&E.onUpdate(E)}L.__version=E.version}function te(L,E,H){if(E.image.length!==6)return;let Z=pt(L,E),ee=E.source;t.bindTexture(i.TEXTURE_CUBE_MAP,L.__webglTexture,i.TEXTURE0+H);let $=n.get(ee);if(ee.version!==$.__version||Z===!0){t.activeTexture(i.TEXTURE0+H);let Le=tt.getPrimaries(tt.workingColorSpace),oe=E.colorSpace===kn?null:tt.getPrimaries(E.colorSpace),Re=E.colorSpace===kn||Le===oe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Re);let Ce=E.isCompressedTexture||E.image[0].isCompressedTexture,re=E.image[0]&&E.image[0].isDataTexture,ge=[];for(let Q=0;Q<6;Q++)!Ce&&!re?ge[Q]=x(E.image[Q],!0,s.maxCubemapSize):ge[Q]=re?E.image[Q].image:E.image[Q],ge[Q]=Xt(E,ge[Q]);let Oe=ge[0],Ie=r.convert(E.format,E.colorSpace),pe=r.convert(E.type),Xe=b(E.internalFormat,Ie,pe,E.colorSpace),B=E.isVideoTexture!==!0,ae=$.__version===void 0||Z===!0,he=ee.dataReady,ye=I(E,Oe);Je(i.TEXTURE_CUBE_MAP,E);let ne;if(Ce){B&&ae&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ye,Xe,Oe.width,Oe.height);for(let Q=0;Q<6;Q++){ne=ge[Q].mipmaps;for(let Se=0;Se<ne.length;Se++){let Ge=ne[Se];E.format!==Tn?Ie!==null?B?he&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se,0,0,Ge.width,Ge.height,Ie,Ge.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se,Xe,Ge.width,Ge.height,0,Ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se,0,0,Ge.width,Ge.height,Ie,pe,Ge.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se,Xe,Ge.width,Ge.height,0,Ie,pe,Ge.data)}}}else{if(ne=E.mipmaps,B&&ae){ne.length>0&&ye++;let Q=Dt(ge[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ye,Xe,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(re){B?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,ge[Q].width,ge[Q].height,Ie,pe,ge[Q].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Xe,ge[Q].width,ge[Q].height,0,Ie,pe,ge[Q].data);for(let Se=0;Se<ne.length;Se++){let mt=ne[Se].image[Q].image;B?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se+1,0,0,mt.width,mt.height,Ie,pe,mt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se+1,Xe,mt.width,mt.height,0,Ie,pe,mt.data)}}else{B?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Ie,pe,ge[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Xe,Ie,pe,ge[Q]);for(let Se=0;Se<ne.length;Se++){let Ge=ne[Se];B?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se+1,0,0,Ie,pe,Ge.image[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Se+1,Xe,Ie,pe,Ge.image[Q])}}}g(E)&&p(i.TEXTURE_CUBE_MAP),$.__version=ee.version,E.onUpdate&&E.onUpdate(E)}L.__version=E.version}function Me(L,E,H,Z,ee,$){let Le=r.convert(H.format,H.colorSpace),oe=r.convert(H.type),Re=b(H.internalFormat,Le,oe,H.colorSpace),Ce=n.get(E),re=n.get(H);if(re.__renderTarget=E,!Ce.__hasExternalTextures){let ge=Math.max(1,E.width>>$),Oe=Math.max(1,E.height>>$);ee===i.TEXTURE_3D||ee===i.TEXTURE_2D_ARRAY?t.texImage3D(ee,$,Re,ge,Oe,E.depth,0,Le,oe,null):t.texImage2D(ee,$,Re,ge,Oe,0,Le,oe,null)}t.bindFramebuffer(i.FRAMEBUFFER,L),we(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,ee,re.__webglTexture,0,St(E)):(ee===i.TEXTURE_2D||ee>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Z,ee,re.__webglTexture,$),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ze(L,E,H){if(i.bindRenderbuffer(i.RENDERBUFFER,L),E.depthBuffer){let Z=E.depthTexture,ee=Z&&Z.isDepthTexture?Z.type:null,$=_(E.stencilBuffer,ee),Le=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,oe=St(E);we(E)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,oe,$,E.width,E.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,oe,$,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,$,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Le,i.RENDERBUFFER,L)}else{let Z=E.textures;for(let ee=0;ee<Z.length;ee++){let $=Z[ee],Le=r.convert($.format,$.colorSpace),oe=r.convert($.type),Re=b($.internalFormat,Le,oe,$.colorSpace),Ce=St(E);H&&we(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ce,Re,E.width,E.height):we(E)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ce,Re,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,Re,E.width,E.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function De(L,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,L),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let Z=n.get(E.depthTexture);Z.__renderTarget=E,(!Z.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),G(E.depthTexture,0);let ee=Z.__webglTexture,$=St(E);if(E.depthTexture.format===$s)we(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ee,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ee,0);else if(E.depthTexture.format===hr)we(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ee,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function et(L){let E=n.get(L),H=L.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==L.depthTexture){let Z=L.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),Z){let ee=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,Z.removeEventListener("dispose",ee)};Z.addEventListener("dispose",ee),E.__depthDisposeCallback=ee}E.__boundDepthTexture=Z}if(L.depthTexture&&!E.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");let Z=L.texture.mipmaps;Z&&Z.length>0?De(E.__webglFramebuffer[0],L):De(E.__webglFramebuffer,L)}else if(H){E.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[Z]),E.__webglDepthbuffer[Z]===void 0)E.__webglDepthbuffer[Z]=i.createRenderbuffer(),ze(E.__webglDepthbuffer[Z],L,!1);else{let ee=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=E.__webglDepthbuffer[Z];i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,ee,i.RENDERBUFFER,$)}}else{let Z=L.texture.mipmaps;if(Z&&Z.length>0?t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=i.createRenderbuffer(),ze(E.__webglDepthbuffer,L,!1);else{let ee=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=E.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,ee,i.RENDERBUFFER,$)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Kt(L,E,H){let Z=n.get(L);E!==void 0&&Me(Z.__webglFramebuffer,L,L.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&et(L)}function F(L){let E=L.texture,H=n.get(L),Z=n.get(E);L.addEventListener("dispose",A);let ee=L.textures,$=L.isWebGLCubeRenderTarget===!0,Le=ee.length>1;if(Le||(Z.__webglTexture===void 0&&(Z.__webglTexture=i.createTexture()),Z.__version=E.version,a.memory.textures++),$){H.__webglFramebuffer=[];for(let oe=0;oe<6;oe++)if(E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer[oe]=[];for(let Re=0;Re<E.mipmaps.length;Re++)H.__webglFramebuffer[oe][Re]=i.createFramebuffer()}else H.__webglFramebuffer[oe]=i.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer=[];for(let oe=0;oe<E.mipmaps.length;oe++)H.__webglFramebuffer[oe]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(Le)for(let oe=0,Re=ee.length;oe<Re;oe++){let Ce=n.get(ee[oe]);Ce.__webglTexture===void 0&&(Ce.__webglTexture=i.createTexture(),a.memory.textures++)}if(L.samples>0&&we(L)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let oe=0;oe<ee.length;oe++){let Re=ee[oe];H.__webglColorRenderbuffer[oe]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[oe]);let Ce=r.convert(Re.format,Re.colorSpace),re=r.convert(Re.type),ge=b(Re.internalFormat,Ce,re,Re.colorSpace,L.isXRRenderTarget===!0),Oe=St(L);i.renderbufferStorageMultisample(i.RENDERBUFFER,Oe,ge,L.width,L.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+oe,i.RENDERBUFFER,H.__webglColorRenderbuffer[oe])}i.bindRenderbuffer(i.RENDERBUFFER,null),L.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),ze(H.__webglDepthRenderbuffer,L,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if($){t.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),Je(i.TEXTURE_CUBE_MAP,E);for(let oe=0;oe<6;oe++)if(E.mipmaps&&E.mipmaps.length>0)for(let Re=0;Re<E.mipmaps.length;Re++)Me(H.__webglFramebuffer[oe][Re],L,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Re);else Me(H.__webglFramebuffer[oe],L,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0);g(E)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Le){for(let oe=0,Re=ee.length;oe<Re;oe++){let Ce=ee[oe],re=n.get(Ce),ge=i.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(ge=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ge,re.__webglTexture),Je(ge,Ce),Me(H.__webglFramebuffer,L,Ce,i.COLOR_ATTACHMENT0+oe,ge,0),g(Ce)&&p(ge)}t.unbindTexture()}else{let oe=i.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(oe=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(oe,Z.__webglTexture),Je(oe,E),E.mipmaps&&E.mipmaps.length>0)for(let Re=0;Re<E.mipmaps.length;Re++)Me(H.__webglFramebuffer[Re],L,E,i.COLOR_ATTACHMENT0,oe,Re);else Me(H.__webglFramebuffer,L,E,i.COLOR_ATTACHMENT0,oe,0);g(E)&&p(oe),t.unbindTexture()}L.depthBuffer&&et(L)}function bt(L){let E=L.textures;for(let H=0,Z=E.length;H<Z;H++){let ee=E[H];if(g(ee)){let $=v(L),Le=n.get(ee).__webglTexture;t.bindTexture($,Le),p($),t.unbindTexture()}}}let Ve=[],Be=[];function Ee(L){if(L.samples>0){if(we(L)===!1){let E=L.textures,H=L.width,Z=L.height,ee=i.COLOR_BUFFER_BIT,$=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Le=n.get(L),oe=E.length>1;if(oe)for(let Ce=0;Ce<E.length;Ce++)t.bindFramebuffer(i.FRAMEBUFFER,Le.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ce,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Le.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ce,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Le.__webglMultisampledFramebuffer);let Re=L.texture.mipmaps;Re&&Re.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Le.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Le.__webglFramebuffer);for(let Ce=0;Ce<E.length;Ce++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(ee|=i.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(ee|=i.STENCIL_BUFFER_BIT)),oe){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Le.__webglColorRenderbuffer[Ce]);let re=n.get(E[Ce]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,re,0)}i.blitFramebuffer(0,0,H,Z,0,0,H,Z,ee,i.NEAREST),c===!0&&(Ve.length=0,Be.length=0,Ve.push(i.COLOR_ATTACHMENT0+Ce),L.depthBuffer&&L.resolveDepthBuffer===!1&&(Ve.push($),Be.push($),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Be)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ve))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),oe)for(let Ce=0;Ce<E.length;Ce++){t.bindFramebuffer(i.FRAMEBUFFER,Le.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ce,i.RENDERBUFFER,Le.__webglColorRenderbuffer[Ce]);let re=n.get(E[Ce]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Le.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ce,i.TEXTURE_2D,re,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Le.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&c){let E=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[E])}}}function St(L){return Math.min(s.maxSamples,L.samples)}function we(L){let E=n.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function $e(L){let E=a.render.frame;h.get(L)!==E&&(h.set(L,E),L.update())}function Xt(L,E){let H=L.colorSpace,Z=L.format,ee=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||H!==Ji&&H!==kn&&(tt.getTransfer(H)===ot?(Z!==Tn||ee!==On)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),E}function Dt(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(l.width=L.naturalWidth||L.width,l.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(l.width=L.displayWidth,l.height=L.displayHeight):(l.width=L.width,l.height=L.height),l}this.allocateTextureUnit=D,this.resetTextureUnits=U,this.setTexture2D=G,this.setTexture2DArray=V,this.setTexture3D=j,this.setTextureCube=W,this.rebindTextures=Kt,this.setupRenderTarget=F,this.updateRenderTargetMipmap=bt,this.updateMultisampleRenderTarget=Ee,this.setupDepthRenderbuffer=et,this.setupFrameBufferTexture=Me,this.useMultisampledRTT=we}function Mv(i,e){function t(n,s=kn){let r,a=tt.getTransfer(s);if(n===On)return i.UNSIGNED_BYTE;if(n===ul)return i.UNSIGNED_SHORT_4_4_4_4;if(n===dl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===vh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Mh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===yh)return i.BYTE;if(n===_h)return i.SHORT;if(n===or)return i.UNSIGNED_SHORT;if(n===hl)return i.INT;if(n===Fi)return i.UNSIGNED_INT;if(n===Bn)return i.FLOAT;if(n===lr)return i.HALF_FLOAT;if(n===bh)return i.ALPHA;if(n===Sh)return i.RGB;if(n===Tn)return i.RGBA;if(n===$s)return i.DEPTH_COMPONENT;if(n===hr)return i.DEPTH_STENCIL;if(n===fl)return i.RED;if(n===pl)return i.RED_INTEGER;if(n===Eh)return i.RG;if(n===ml)return i.RG_INTEGER;if(n===gl)return i.RGBA_INTEGER;if(n===Ma||n===ba||n===Sa||n===Ea)if(a===ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ma)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ba)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Sa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ea)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ma)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ba)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Sa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ea)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===xl||n===yl||n===_l||n===vl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===xl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===yl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===_l)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===vl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ml||n===bl||n===Sl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ml||n===bl)return a===ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Sl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===El||n===wl||n===Tl||n===Al||n===Rl||n===Cl||n===Il||n===Pl||n===Ll||n===Dl||n===Ul||n===Nl||n===Fl||n===Ol)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===El)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===wl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Tl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Al)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Rl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Cl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Il)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Pl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ll)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Dl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ul)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Nl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Fl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ol)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Bl||n===kl||n===zl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Bl)return a===ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===kl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===zl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Hl||n===Gl||n===Vl||n===Wl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Hl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Gl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Vl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Wl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===cr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var bv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Sv=`
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

}`,$h=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new ra(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Nn({vertexShader:bv,fragmentShader:Sv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new _e(new Nt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Yh=class extends di{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,m=null,x=typeof XRWebGLBinding<"u",g=new $h,p={},v=t.getContextAttributes(),b=null,_=null,I=[],S=[],A=new ue,R=null,y=new Qt;y.viewport=new Ct;let M=new Qt;M.viewport=new Ct;let C=[y,M],U=new jo,D=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let te=I[J];return te===void 0&&(te=new Js,I[J]=te),te.getTargetRaySpace()},this.getControllerGrip=function(J){let te=I[J];return te===void 0&&(te=new Js,I[J]=te),te.getGripSpace()},this.getHand=function(J){let te=I[J];return te===void 0&&(te=new Js,I[J]=te),te.getHandSpace()};function G(J){let te=S.indexOf(J.inputSource);if(te===-1)return;let Me=I[te];Me!==void 0&&(Me.update(J.inputSource,J.frame,l||a),Me.dispatchEvent({type:J.type,data:J.inputSource}))}function V(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",V),s.removeEventListener("inputsourceschange",j);for(let J=0;J<I.length;J++){let te=S[J];te!==null&&(S[J]=null,I[J].disconnect(te))}D=null,N=null,g.reset();for(let J in p)delete p[J];e.setRenderTarget(b),d=null,f=null,u=null,s=null,_=null,st.stop(),n.isPresenting=!1,e.setPixelRatio(R),e.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(J){l=J},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(b=e.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",V),s.addEventListener("inputsourceschange",j),v.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(A),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let Me=null,ze=null,De=null;v.depth&&(De=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Me=v.stencil?hr:$s,ze=v.stencil?cr:Fi);let et={colorFormat:t.RGBA8,depthFormat:De,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(et),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),_=new qn(f.textureWidth,f.textureHeight,{format:Tn,type:On,depthTexture:new sa(f.textureWidth,f.textureHeight,ze,void 0,void 0,void 0,void 0,void 0,void 0,Me),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let Me={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,Me),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),_=new qn(d.framebufferWidth,d.framebufferHeight,{format:Tn,type:On,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),st.setContext(s),st.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function j(J){for(let te=0;te<J.removed.length;te++){let Me=J.removed[te],ze=S.indexOf(Me);ze>=0&&(S[ze]=null,I[ze].disconnect(Me))}for(let te=0;te<J.added.length;te++){let Me=J.added[te],ze=S.indexOf(Me);if(ze===-1){for(let et=0;et<I.length;et++)if(et>=S.length){S.push(Me),ze=et;break}else if(S[et]===null){S[et]=Me,ze=et;break}if(ze===-1)break}let De=I[ze];De&&De.connect(Me)}}let W=new O,ce=new O;function fe(J,te,Me){W.setFromMatrixPosition(te.matrixWorld),ce.setFromMatrixPosition(Me.matrixWorld);let ze=W.distanceTo(ce),De=te.projectionMatrix.elements,et=Me.projectionMatrix.elements,Kt=De[14]/(De[10]-1),F=De[14]/(De[10]+1),bt=(De[9]+1)/De[5],Ve=(De[9]-1)/De[5],Be=(De[8]-1)/De[0],Ee=(et[8]+1)/et[0],St=Kt*Be,we=Kt*Ee,$e=ze/(-Be+Ee),Xt=$e*-Be;if(te.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Xt),J.translateZ($e),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),De[10]===-1)J.projectionMatrix.copy(te.projectionMatrix),J.projectionMatrixInverse.copy(te.projectionMatrixInverse);else{let Dt=Kt+$e,L=F+$e,E=St-Xt,H=we+(ze-Xt),Z=bt*F/L*Dt,ee=Ve*F/L*Dt;J.projectionMatrix.makePerspective(E,H,Z,ee,Dt,L),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function Ae(J,te){te===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(te.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let te=J.near,Me=J.far;g.texture!==null&&(g.depthNear>0&&(te=g.depthNear),g.depthFar>0&&(Me=g.depthFar)),U.near=M.near=y.near=te,U.far=M.far=y.far=Me,(D!==U.near||N!==U.far)&&(s.updateRenderState({depthNear:U.near,depthFar:U.far}),D=U.near,N=U.far),U.layers.mask=J.layers.mask|6,y.layers.mask=U.layers.mask&3,M.layers.mask=U.layers.mask&5;let ze=J.parent,De=U.cameras;Ae(U,ze);for(let et=0;et<De.length;et++)Ae(De[et],ze);De.length===2?fe(U,y,M):U.projectionMatrix.copy(y.projectionMatrix),Je(J,U,ze)};function Je(J,te,Me){Me===null?J.matrix.copy(te.matrixWorld):(J.matrix.copy(Me.matrixWorld),J.matrix.invert(),J.matrix.multiply(te.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(te.projectionMatrix),J.projectionMatrixInverse.copy(te.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Ys*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(J){c=J,f!==null&&(f.fixedFoveation=J),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=J)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(U)},this.getCameraTexture=function(J){return p[J]};let pt=null;function Mt(J,te){if(h=te.getViewerPose(l||a),m=te,h!==null){let Me=h.views;d!==null&&(e.setRenderTargetFramebuffer(_,d.framebuffer),e.setRenderTarget(_));let ze=!1;Me.length!==U.cameras.length&&(U.cameras.length=0,ze=!0);for(let F=0;F<Me.length;F++){let bt=Me[F],Ve=null;if(d!==null)Ve=d.getViewport(bt);else{let Ee=u.getViewSubImage(f,bt);Ve=Ee.viewport,F===0&&(e.setRenderTargetTextures(_,Ee.colorTexture,Ee.depthStencilTexture),e.setRenderTarget(_))}let Be=C[F];Be===void 0&&(Be=new Qt,Be.layers.enable(F),Be.viewport=new Ct,C[F]=Be),Be.matrix.fromArray(bt.transform.matrix),Be.matrix.decompose(Be.position,Be.quaternion,Be.scale),Be.projectionMatrix.fromArray(bt.projectionMatrix),Be.projectionMatrixInverse.copy(Be.projectionMatrix).invert(),Be.viewport.set(Ve.x,Ve.y,Ve.width,Ve.height),F===0&&(U.matrix.copy(Be.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),ze===!0&&U.cameras.push(Be)}let De=s.enabledFeatures;if(De&&De.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=n.getBinding();let F=u.getDepthInformation(Me[0]);F&&F.isValid&&F.texture&&g.init(F,s.renderState)}if(De&&De.includes("camera-access")&&x){e.state.unbindTexture(),u=n.getBinding();for(let F=0;F<Me.length;F++){let bt=Me[F].camera;if(bt){let Ve=p[bt];Ve||(Ve=new ra,p[bt]=Ve);let Be=u.getCameraImage(bt);Ve.sourceTexture=Be}}}}for(let Me=0;Me<I.length;Me++){let ze=S[Me],De=I[Me];ze!==null&&De!==void 0&&De.update(ze,te,l||a)}pt&&pt(J,te),te.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:te}),m=null}let st=new Kf;st.setAnimationLoop(Mt),this.setAnimationLoop=function(J){pt=J},this.dispose=function(){}}},os=new Un,Ev=new dt;function wv(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Ih(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,v,b,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p)):p.isMeshStandardMaterial?(r(g,p),f(g,p),p.isMeshPhysicalMaterial&&d(g,p,_)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),x(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?c(g,p,v,b):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Ht&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Ht&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let v=e.get(p),b=v.envMap,_=v.envMapRotation;b&&(g.envMap.value=b,os.copy(_),os.x*=-1,os.y*=-1,os.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(os.y*=-1,os.z*=-1),g.envMapRotation.value.setFromMatrix4(Ev.makeRotationFromEuler(os)),g.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,v,b){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*v,g.scale.value=b*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function f(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p,v){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ht&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){let v=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Tv(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,b){let _=b.program;n.uniformBlockBinding(v,_)}function l(v,b){let _=s[v.id];_===void 0&&(m(v),_=h(v),s[v.id]=_,v.addEventListener("dispose",g));let I=b.program;n.updateUBOMapping(v,I);let S=e.render.frame;r[v.id]!==S&&(f(v),r[v.id]=S)}function h(v){let b=u();v.__bindingPointIndex=b;let _=i.createBuffer(),I=v.__size,S=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,I,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,_),_}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){let b=s[v.id],_=v.uniforms,I=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let S=0,A=_.length;S<A;S++){let R=Array.isArray(_[S])?_[S]:[_[S]];for(let y=0,M=R.length;y<M;y++){let C=R[y];if(d(C,S,y,I)===!0){let U=C.__offset,D=Array.isArray(C.value)?C.value:[C.value],N=0;for(let G=0;G<D.length;G++){let V=D[G],j=x(V);typeof V=="number"||typeof V=="boolean"?(C.__data[0]=V,i.bufferSubData(i.UNIFORM_BUFFER,U+N,C.__data)):V.isMatrix3?(C.__data[0]=V.elements[0],C.__data[1]=V.elements[1],C.__data[2]=V.elements[2],C.__data[3]=0,C.__data[4]=V.elements[3],C.__data[5]=V.elements[4],C.__data[6]=V.elements[5],C.__data[7]=0,C.__data[8]=V.elements[6],C.__data[9]=V.elements[7],C.__data[10]=V.elements[8],C.__data[11]=0):(V.toArray(C.__data,N),N+=j.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,U,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(v,b,_,I){let S=v.value,A=b+"_"+_;if(I[A]===void 0)return typeof S=="number"||typeof S=="boolean"?I[A]=S:I[A]=S.clone(),!0;{let R=I[A];if(typeof S=="number"||typeof S=="boolean"){if(R!==S)return I[A]=S,!0}else if(R.equals(S)===!1)return R.copy(S),!0}return!1}function m(v){let b=v.uniforms,_=0,I=16;for(let A=0,R=b.length;A<R;A++){let y=Array.isArray(b[A])?b[A]:[b[A]];for(let M=0,C=y.length;M<C;M++){let U=y[M],D=Array.isArray(U.value)?U.value:[U.value];for(let N=0,G=D.length;N<G;N++){let V=D[N],j=x(V),W=_%I,ce=W%j.boundary,fe=W+ce;_+=ce,fe!==0&&I-fe<j.storage&&(_+=I-fe),U.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=_,_+=j.storage}}}let S=_%I;return S>0&&(_+=I-S),v.__size=_,v.__cache={},this}function x(v){let b={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(b.boundary=4,b.storage=4):v.isVector2?(b.boundary=8,b.storage=8):v.isVector3||v.isColor?(b.boundary=16,b.storage=12):v.isVector4?(b.boundary=16,b.storage=16):v.isMatrix3?(b.boundary=48,b.storage=48):v.isMatrix4?(b.boundary=64,b.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),b}function g(v){let b=v.target;b.removeEventListener("dispose",g);let _=a.indexOf(b.__bindingPointIndex);a.splice(_,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function p(){for(let v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:c,update:l,dispose:p}}var Zl=class{constructor(e={}){let{canvas:t=xf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=a;let m=new Uint32Array(4),x=new Int32Array(4),g=null,p=null,v=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Mi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let _=this,I=!1;this._outputColorSpace=Bt;let S=0,A=0,R=null,y=-1,M=null,C=new Ct,U=new Ct,D=null,N=new Te(0),G=0,V=t.width,j=t.height,W=1,ce=null,fe=null,Ae=new Ct(0,0,V,j),Je=new Ct(0,0,V,j),pt=!1,Mt=new er,st=!1,J=!1,te=new dt,Me=new O,ze=new Ct,De={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},et=!1;function Kt(){return R===null?W:1}let F=n;function bt(T,k){return t.getContext(T,k)}try{let T={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",he,!1),t.addEventListener("webglcontextrestored",ye,!1),t.addEventListener("webglcontextcreationerror",ne,!1),F===null){let k="webgl2";if(F=bt(k,T),F===null)throw bt(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Ve,Be,Ee,St,we,$e,Xt,Dt,L,E,H,Z,ee,$,Le,oe,Re,Ce,re,ge,Oe,Ie,pe,Xe;function B(){Ve=new Wy(F),Ve.init(),Ie=new Mv(F,Ve),Be=new Oy(F,Ve,e,Ie),Ee=new _v(F,Ve),Be.reversedDepthBuffer&&f&&Ee.buffers.depth.setReversed(!0),St=new $y(F),we=new av,$e=new vv(F,Ve,Ee,we,Be,Ie,St),Xt=new ky(_),Dt=new Vy(_),L=new Qg(F),pe=new Ny(F,L),E=new Xy(F,L,St,pe),H=new Zy(F,E,L,St),re=new Yy(F,Be,$e),oe=new By(we),Z=new rv(_,Xt,Dt,Ve,Be,pe,oe),ee=new wv(_,we),$=new lv,Le=new pv(Ve),Ce=new Uy(_,Xt,Dt,Ee,H,d,c),Re=new xv(_,H,Be),Xe=new Tv(F,St,Be,Ee),ge=new Fy(F,Ve,St),Oe=new qy(F,Ve,St),St.programs=Z.programs,_.capabilities=Be,_.extensions=Ve,_.properties=we,_.renderLists=$,_.shadowMap=Re,_.state=Ee,_.info=St}B();let ae=new Yh(_,F);this.xr=ae,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let T=Ve.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=Ve.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(T){T!==void 0&&(W=T,this.setSize(V,j,!1))},this.getSize=function(T){return T.set(V,j)},this.setSize=function(T,k,X=!0){if(ae.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}V=T,j=k,t.width=Math.floor(T*W),t.height=Math.floor(k*W),X===!0&&(t.style.width=T+"px",t.style.height=k+"px"),this.setViewport(0,0,T,k)},this.getDrawingBufferSize=function(T){return T.set(V*W,j*W).floor()},this.setDrawingBufferSize=function(T,k,X){V=T,j=k,W=X,t.width=Math.floor(T*X),t.height=Math.floor(k*X),this.setViewport(0,0,T,k)},this.getCurrentViewport=function(T){return T.copy(C)},this.getViewport=function(T){return T.copy(Ae)},this.setViewport=function(T,k,X,q){T.isVector4?Ae.set(T.x,T.y,T.z,T.w):Ae.set(T,k,X,q),Ee.viewport(C.copy(Ae).multiplyScalar(W).round())},this.getScissor=function(T){return T.copy(Je)},this.setScissor=function(T,k,X,q){T.isVector4?Je.set(T.x,T.y,T.z,T.w):Je.set(T,k,X,q),Ee.scissor(U.copy(Je).multiplyScalar(W).round())},this.getScissorTest=function(){return pt},this.setScissorTest=function(T){Ee.setScissorTest(pt=T)},this.setOpaqueSort=function(T){ce=T},this.setTransparentSort=function(T){fe=T},this.getClearColor=function(T){return T.copy(Ce.getClearColor())},this.setClearColor=function(){Ce.setClearColor(...arguments)},this.getClearAlpha=function(){return Ce.getClearAlpha()},this.setClearAlpha=function(){Ce.setClearAlpha(...arguments)},this.clear=function(T=!0,k=!0,X=!0){let q=0;if(T){let z=!1;if(R!==null){let ie=R.texture.format;z=ie===gl||ie===ml||ie===pl}if(z){let ie=R.texture.type,me=ie===On||ie===Fi||ie===or||ie===cr||ie===ul||ie===dl,be=Ce.getClearColor(),xe=Ce.getClearAlpha(),Fe=be.r,ke=be.g,Ue=be.b;me?(m[0]=Fe,m[1]=ke,m[2]=Ue,m[3]=xe,F.clearBufferuiv(F.COLOR,0,m)):(x[0]=Fe,x[1]=ke,x[2]=Ue,x[3]=xe,F.clearBufferiv(F.COLOR,0,x))}else q|=F.COLOR_BUFFER_BIT}k&&(q|=F.DEPTH_BUFFER_BIT),X&&(q|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",he,!1),t.removeEventListener("webglcontextrestored",ye,!1),t.removeEventListener("webglcontextcreationerror",ne,!1),Ce.dispose(),$.dispose(),Le.dispose(),we.dispose(),Xt.dispose(),Dt.dispose(),H.dispose(),pe.dispose(),Xe.dispose(),Z.dispose(),ae.dispose(),ae.removeEventListener("sessionstart",Vn),ae.removeEventListener("sessionend",Ru),Gi.stop()};function he(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),I=!0}function ye(){console.log("THREE.WebGLRenderer: Context Restored."),I=!1;let T=St.autoReset,k=Re.enabled,X=Re.autoUpdate,q=Re.needsUpdate,z=Re.type;B(),St.autoReset=T,Re.enabled=k,Re.autoUpdate=X,Re.needsUpdate=q,Re.type=z}function ne(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Q(T){let k=T.target;k.removeEventListener("dispose",Q),Se(k)}function Se(T){Ge(T),we.remove(T)}function Ge(T){let k=we.get(T).programs;k!==void 0&&(k.forEach(function(X){Z.releaseProgram(X)}),T.isShaderMaterial&&Z.releaseShaderCache(T))}this.renderBufferDirect=function(T,k,X,q,z,ie){k===null&&(k=De);let me=z.isMesh&&z.matrixWorld.determinant()<0,be=mm(T,k,X,q,z);Ee.setMaterial(q,me);let xe=X.index,Fe=1;if(q.wireframe===!0){if(xe=E.getWireframeAttribute(X),xe===void 0)return;Fe=2}let ke=X.drawRange,Ue=X.attributes.position,Qe=ke.start*Fe,lt=(ke.start+ke.count)*Fe;ie!==null&&(Qe=Math.max(Qe,ie.start*Fe),lt=Math.min(lt,(ie.start+ie.count)*Fe)),xe!==null?(Qe=Math.max(Qe,0),lt=Math.min(lt,xe.count)):Ue!=null&&(Qe=Math.max(Qe,0),lt=Math.min(lt,Ue.count));let Lt=lt-Qe;if(Lt<0||Lt===1/0)return;pe.setup(z,q,be,X,xe);let _t,ut=ge;if(xe!==null&&(_t=L.get(xe),ut=Oe,ut.setIndex(_t)),z.isMesh)q.wireframe===!0?(Ee.setLineWidth(q.wireframeLinewidth*Kt()),ut.setMode(F.LINES)):ut.setMode(F.TRIANGLES);else if(z.isLine){let Ne=q.linewidth;Ne===void 0&&(Ne=1),Ee.setLineWidth(Ne*Kt()),z.isLineSegments?ut.setMode(F.LINES):z.isLineLoop?ut.setMode(F.LINE_LOOP):ut.setMode(F.LINE_STRIP)}else z.isPoints?ut.setMode(F.POINTS):z.isSprite&&ut.setMode(F.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)Zs("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ut.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(Ve.get("WEBGL_multi_draw"))ut.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{let Ne=z._multiDrawStarts,Tt=z._multiDrawCounts,it=z._multiDrawCount,fn=xe?L.get(xe).bytesPerElement:1,As=we.get(q).currentProgram.getUniforms();for(let pn=0;pn<it;pn++)As.setValue(F,"_gl_DrawID",pn),ut.render(Ne[pn]/fn,Tt[pn])}else if(z.isInstancedMesh)ut.renderInstances(Qe,Lt,z.count);else if(X.isInstancedBufferGeometry){let Ne=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Tt=Math.min(X.instanceCount,Ne);ut.renderInstances(Qe,Lt,Tt)}else ut.render(Qe,Lt)};function mt(T,k,X){T.transparent===!0&&T.side===en&&T.forceSinglePass===!1?(T.side=Ht,T.needsUpdate=!0,Va(T,k,X),T.side=ui,T.needsUpdate=!0,Va(T,k,X),T.side=en):Va(T,k,X)}this.compile=function(T,k,X=null){X===null&&(X=T),p=Le.get(X),p.init(k),b.push(p),X.traverseVisible(function(z){z.isLight&&z.layers.test(k.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),T!==X&&T.traverseVisible(function(z){z.isLight&&z.layers.test(k.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),p.setupLights();let q=new Set;return T.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;let ie=z.material;if(ie)if(Array.isArray(ie))for(let me=0;me<ie.length;me++){let be=ie[me];mt(be,X,z),q.add(be)}else mt(ie,X,z),q.add(ie)}),p=b.pop(),q},this.compileAsync=function(T,k,X=null){let q=this.compile(T,k,X);return new Promise(z=>{function ie(){if(q.forEach(function(me){we.get(me).currentProgram.isReady()&&q.delete(me)}),q.size===0){z(T);return}setTimeout(ie,10)}Ve.get("KHR_parallel_shader_compile")!==null?ie():setTimeout(ie,10)})};let rt=null;function ii(T){rt&&rt(T)}function Vn(){Gi.stop()}function Ru(){Gi.start()}let Gi=new Kf;Gi.setAnimationLoop(ii),typeof self<"u"&&Gi.setContext(self),this.setAnimationLoop=function(T){rt=T,ae.setAnimationLoop(T),T===null?Gi.stop():Gi.start()},ae.addEventListener("sessionstart",Vn),ae.addEventListener("sessionend",Ru),this.render=function(T,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),ae.enabled===!0&&ae.isPresenting===!0&&(ae.cameraAutoUpdate===!0&&ae.updateCamera(k),k=ae.getCamera()),T.isScene===!0&&T.onBeforeRender(_,T,k,R),p=Le.get(T,b.length),p.init(k),b.push(p),te.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),Mt.setFromProjectionMatrix(te,Ln,k.reversedDepth),J=this.localClippingEnabled,st=oe.init(this.clippingPlanes,J),g=$.get(T,v.length),g.init(),v.push(g),ae.enabled===!0&&ae.isPresenting===!0){let ie=_.xr.getDepthSensingMesh();ie!==null&&Ec(ie,k,-1/0,_.sortObjects)}Ec(T,k,0,_.sortObjects),g.finish(),_.sortObjects===!0&&g.sort(ce,fe),et=ae.enabled===!1||ae.isPresenting===!1||ae.hasDepthSensing()===!1,et&&Ce.addToRenderList(g,T),this.info.render.frame++,st===!0&&oe.beginShadows();let X=p.state.shadowsArray;Re.render(X,T,k),st===!0&&oe.endShadows(),this.info.autoReset===!0&&this.info.reset();let q=g.opaque,z=g.transmissive;if(p.setupLights(),k.isArrayCamera){let ie=k.cameras;if(z.length>0)for(let me=0,be=ie.length;me<be;me++){let xe=ie[me];Iu(q,z,T,xe)}et&&Ce.render(T);for(let me=0,be=ie.length;me<be;me++){let xe=ie[me];Cu(g,T,xe,xe.viewport)}}else z.length>0&&Iu(q,z,T,k),et&&Ce.render(T),Cu(g,T,k);R!==null&&A===0&&($e.updateMultisampleRenderTarget(R),$e.updateRenderTargetMipmap(R)),T.isScene===!0&&T.onAfterRender(_,T,k),pe.resetDefaultState(),y=-1,M=null,b.pop(),b.length>0?(p=b[b.length-1],st===!0&&oe.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,v.pop(),v.length>0?g=v[v.length-1]:g=null};function Ec(T,k,X,q){if(T.visible===!1)return;if(T.layers.test(k.layers)){if(T.isGroup)X=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(k);else if(T.isLight)p.pushLight(T),T.castShadow&&p.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||Mt.intersectsSprite(T)){q&&ze.setFromMatrixPosition(T.matrixWorld).applyMatrix4(te);let me=H.update(T),be=T.material;be.visible&&g.push(T,me,be,X,ze.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||Mt.intersectsObject(T))){let me=H.update(T),be=T.material;if(q&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),ze.copy(T.boundingSphere.center)):(me.boundingSphere===null&&me.computeBoundingSphere(),ze.copy(me.boundingSphere.center)),ze.applyMatrix4(T.matrixWorld).applyMatrix4(te)),Array.isArray(be)){let xe=me.groups;for(let Fe=0,ke=xe.length;Fe<ke;Fe++){let Ue=xe[Fe],Qe=be[Ue.materialIndex];Qe&&Qe.visible&&g.push(T,me,Qe,X,ze.z,Ue)}}else be.visible&&g.push(T,me,be,X,ze.z,null)}}let ie=T.children;for(let me=0,be=ie.length;me<be;me++)Ec(ie[me],k,X,q)}function Cu(T,k,X,q){let z=T.opaque,ie=T.transmissive,me=T.transparent;p.setupLightsView(X),st===!0&&oe.setGlobalState(_.clippingPlanes,X),q&&Ee.viewport(C.copy(q)),z.length>0&&Ga(z,k,X),ie.length>0&&Ga(ie,k,X),me.length>0&&Ga(me,k,X),Ee.buffers.depth.setTest(!0),Ee.buffers.depth.setMask(!0),Ee.buffers.color.setMask(!0),Ee.setPolygonOffset(!1)}function Iu(T,k,X,q){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[q.id]===void 0&&(p.state.transmissionRenderTarget[q.id]=new qn(1,1,{generateMipmaps:!0,type:Ve.has("EXT_color_buffer_half_float")||Ve.has("EXT_color_buffer_float")?lr:On,minFilter:Ni,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));let ie=p.state.transmissionRenderTarget[q.id],me=q.viewport||C;ie.setSize(me.z*_.transmissionResolutionScale,me.w*_.transmissionResolutionScale);let be=_.getRenderTarget(),xe=_.getActiveCubeFace(),Fe=_.getActiveMipmapLevel();_.setRenderTarget(ie),_.getClearColor(N),G=_.getClearAlpha(),G<1&&_.setClearColor(16777215,.5),_.clear(),et&&Ce.render(X);let ke=_.toneMapping;_.toneMapping=Mi;let Ue=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),p.setupLightsView(q),st===!0&&oe.setGlobalState(_.clippingPlanes,q),Ga(T,X,q),$e.updateMultisampleRenderTarget(ie),$e.updateRenderTargetMipmap(ie),Ve.has("WEBGL_multisampled_render_to_texture")===!1){let Qe=!1;for(let lt=0,Lt=k.length;lt<Lt;lt++){let _t=k[lt],ut=_t.object,Ne=_t.geometry,Tt=_t.material,it=_t.group;if(Tt.side===en&&ut.layers.test(q.layers)){let fn=Tt.side;Tt.side=Ht,Tt.needsUpdate=!0,Pu(ut,X,q,Ne,Tt,it),Tt.side=fn,Tt.needsUpdate=!0,Qe=!0}}Qe===!0&&($e.updateMultisampleRenderTarget(ie),$e.updateRenderTargetMipmap(ie))}_.setRenderTarget(be,xe,Fe),_.setClearColor(N,G),Ue!==void 0&&(q.viewport=Ue),_.toneMapping=ke}function Ga(T,k,X){let q=k.isScene===!0?k.overrideMaterial:null;for(let z=0,ie=T.length;z<ie;z++){let me=T[z],be=me.object,xe=me.geometry,Fe=me.group,ke=me.material;ke.allowOverride===!0&&q!==null&&(ke=q),be.layers.test(X.layers)&&Pu(be,k,X,xe,ke,Fe)}}function Pu(T,k,X,q,z,ie){T.onBeforeRender(_,k,X,q,z,ie),T.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),z.onBeforeRender(_,k,X,q,T,ie),z.transparent===!0&&z.side===en&&z.forceSinglePass===!1?(z.side=Ht,z.needsUpdate=!0,_.renderBufferDirect(X,k,q,z,T,ie),z.side=ui,z.needsUpdate=!0,_.renderBufferDirect(X,k,q,z,T,ie),z.side=en):_.renderBufferDirect(X,k,q,z,T,ie),T.onAfterRender(_,k,X,q,z,ie)}function Va(T,k,X){k.isScene!==!0&&(k=De);let q=we.get(T),z=p.state.lights,ie=p.state.shadowsArray,me=z.state.version,be=Z.getParameters(T,z.state,ie,k,X),xe=Z.getProgramCacheKey(be),Fe=q.programs;q.environment=T.isMeshStandardMaterial?k.environment:null,q.fog=k.fog,q.envMap=(T.isMeshStandardMaterial?Dt:Xt).get(T.envMap||q.environment),q.envMapRotation=q.environment!==null&&T.envMap===null?k.environmentRotation:T.envMapRotation,Fe===void 0&&(T.addEventListener("dispose",Q),Fe=new Map,q.programs=Fe);let ke=Fe.get(xe);if(ke!==void 0){if(q.currentProgram===ke&&q.lightsStateVersion===me)return Du(T,be),ke}else be.uniforms=Z.getUniforms(T),T.onBeforeCompile(be,_),ke=Z.acquireProgram(be,xe),Fe.set(xe,ke),q.uniforms=be.uniforms;let Ue=q.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ue.clippingPlanes=oe.uniform),Du(T,be),q.needsLights=xm(T),q.lightsStateVersion=me,q.needsLights&&(Ue.ambientLightColor.value=z.state.ambient,Ue.lightProbe.value=z.state.probe,Ue.directionalLights.value=z.state.directional,Ue.directionalLightShadows.value=z.state.directionalShadow,Ue.spotLights.value=z.state.spot,Ue.spotLightShadows.value=z.state.spotShadow,Ue.rectAreaLights.value=z.state.rectArea,Ue.ltc_1.value=z.state.rectAreaLTC1,Ue.ltc_2.value=z.state.rectAreaLTC2,Ue.pointLights.value=z.state.point,Ue.pointLightShadows.value=z.state.pointShadow,Ue.hemisphereLights.value=z.state.hemi,Ue.directionalShadowMap.value=z.state.directionalShadowMap,Ue.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Ue.spotShadowMap.value=z.state.spotShadowMap,Ue.spotLightMatrix.value=z.state.spotLightMatrix,Ue.spotLightMap.value=z.state.spotLightMap,Ue.pointShadowMap.value=z.state.pointShadowMap,Ue.pointShadowMatrix.value=z.state.pointShadowMatrix),q.currentProgram=ke,q.uniformsList=null,ke}function Lu(T){if(T.uniformsList===null){let k=T.currentProgram.getUniforms();T.uniformsList=fr.seqWithValue(k.seq,T.uniforms)}return T.uniformsList}function Du(T,k){let X=we.get(T);X.outputColorSpace=k.outputColorSpace,X.batching=k.batching,X.batchingColor=k.batchingColor,X.instancing=k.instancing,X.instancingColor=k.instancingColor,X.instancingMorph=k.instancingMorph,X.skinning=k.skinning,X.morphTargets=k.morphTargets,X.morphNormals=k.morphNormals,X.morphColors=k.morphColors,X.morphTargetsCount=k.morphTargetsCount,X.numClippingPlanes=k.numClippingPlanes,X.numIntersection=k.numClipIntersection,X.vertexAlphas=k.vertexAlphas,X.vertexTangents=k.vertexTangents,X.toneMapping=k.toneMapping}function mm(T,k,X,q,z){k.isScene!==!0&&(k=De),$e.resetTextureUnits();let ie=k.fog,me=q.isMeshStandardMaterial?k.environment:null,be=R===null?_.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Ji,xe=(q.isMeshStandardMaterial?Dt:Xt).get(q.envMap||me),Fe=q.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,ke=!!X.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Ue=!!X.morphAttributes.position,Qe=!!X.morphAttributes.normal,lt=!!X.morphAttributes.color,Lt=Mi;q.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(Lt=_.toneMapping);let _t=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,ut=_t!==void 0?_t.length:0,Ne=we.get(q),Tt=p.state.lights;if(st===!0&&(J===!0||T!==M)){let nn=T===M&&q.id===y;oe.setState(q,T,nn)}let it=!1;q.version===Ne.__version?(Ne.needsLights&&Ne.lightsStateVersion!==Tt.state.version||Ne.outputColorSpace!==be||z.isBatchedMesh&&Ne.batching===!1||!z.isBatchedMesh&&Ne.batching===!0||z.isBatchedMesh&&Ne.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&Ne.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&Ne.instancing===!1||!z.isInstancedMesh&&Ne.instancing===!0||z.isSkinnedMesh&&Ne.skinning===!1||!z.isSkinnedMesh&&Ne.skinning===!0||z.isInstancedMesh&&Ne.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Ne.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Ne.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Ne.instancingMorph===!1&&z.morphTexture!==null||Ne.envMap!==xe||q.fog===!0&&Ne.fog!==ie||Ne.numClippingPlanes!==void 0&&(Ne.numClippingPlanes!==oe.numPlanes||Ne.numIntersection!==oe.numIntersection)||Ne.vertexAlphas!==Fe||Ne.vertexTangents!==ke||Ne.morphTargets!==Ue||Ne.morphNormals!==Qe||Ne.morphColors!==lt||Ne.toneMapping!==Lt||Ne.morphTargetsCount!==ut)&&(it=!0):(it=!0,Ne.__version=q.version);let fn=Ne.currentProgram;it===!0&&(fn=Va(q,k,z));let As=!1,pn=!1,Er=!1,At=fn.getUniforms(),bn=Ne.uniforms;if(Ee.useProgram(fn.program)&&(As=!0,pn=!0,Er=!0),q.id!==y&&(y=q.id,pn=!0),As||M!==T){Ee.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),At.setValue(F,"projectionMatrix",T.projectionMatrix),At.setValue(F,"viewMatrix",T.matrixWorldInverse);let ln=At.map.cameraPosition;ln!==void 0&&ln.setValue(F,Me.setFromMatrixPosition(T.matrixWorld)),Be.logarithmicDepthBuffer&&At.setValue(F,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&At.setValue(F,"isOrthographic",T.isOrthographicCamera===!0),M!==T&&(M=T,pn=!0,Er=!0)}if(z.isSkinnedMesh){At.setOptional(F,z,"bindMatrix"),At.setOptional(F,z,"bindMatrixInverse");let nn=z.skeleton;nn&&(nn.boneTexture===null&&nn.computeBoneTexture(),At.setValue(F,"boneTexture",nn.boneTexture,$e))}z.isBatchedMesh&&(At.setOptional(F,z,"batchingTexture"),At.setValue(F,"batchingTexture",z._matricesTexture,$e),At.setOptional(F,z,"batchingIdTexture"),At.setValue(F,"batchingIdTexture",z._indirectTexture,$e),At.setOptional(F,z,"batchingColorTexture"),z._colorsTexture!==null&&At.setValue(F,"batchingColorTexture",z._colorsTexture,$e));let Sn=X.morphAttributes;if((Sn.position!==void 0||Sn.normal!==void 0||Sn.color!==void 0)&&re.update(z,X,fn),(pn||Ne.receiveShadow!==z.receiveShadow)&&(Ne.receiveShadow=z.receiveShadow,At.setValue(F,"receiveShadow",z.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(bn.envMap.value=xe,bn.flipEnvMap.value=xe.isCubeTexture&&xe.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&k.environment!==null&&(bn.envMapIntensity.value=k.environmentIntensity),pn&&(At.setValue(F,"toneMappingExposure",_.toneMappingExposure),Ne.needsLights&&gm(bn,Er),ie&&q.fog===!0&&ee.refreshFogUniforms(bn,ie),ee.refreshMaterialUniforms(bn,q,W,j,p.state.transmissionRenderTarget[T.id]),fr.upload(F,Lu(Ne),bn,$e)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(fr.upload(F,Lu(Ne),bn,$e),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&At.setValue(F,"center",z.center),At.setValue(F,"modelViewMatrix",z.modelViewMatrix),At.setValue(F,"normalMatrix",z.normalMatrix),At.setValue(F,"modelMatrix",z.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){let nn=q.uniformsGroups;for(let ln=0,wc=nn.length;ln<wc;ln++){let Vi=nn[ln];Xe.update(Vi,fn),Xe.bind(Vi,fn)}}return fn}function gm(T,k){T.ambientLightColor.needsUpdate=k,T.lightProbe.needsUpdate=k,T.directionalLights.needsUpdate=k,T.directionalLightShadows.needsUpdate=k,T.pointLights.needsUpdate=k,T.pointLightShadows.needsUpdate=k,T.spotLights.needsUpdate=k,T.spotLightShadows.needsUpdate=k,T.rectAreaLights.needsUpdate=k,T.hemisphereLights.needsUpdate=k}function xm(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(T,k,X){let q=we.get(T);q.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,q.__autoAllocateDepthBuffer===!1&&(q.__useRenderToTexture=!1),we.get(T.texture).__webglTexture=k,we.get(T.depthTexture).__webglTexture=q.__autoAllocateDepthBuffer?void 0:X,q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,k){let X=we.get(T);X.__webglFramebuffer=k,X.__useDefaultFramebuffer=k===void 0};let ym=F.createFramebuffer();this.setRenderTarget=function(T,k=0,X=0){R=T,S=k,A=X;let q=!0,z=null,ie=!1,me=!1;if(T){let xe=we.get(T);if(xe.__useDefaultFramebuffer!==void 0)Ee.bindFramebuffer(F.FRAMEBUFFER,null),q=!1;else if(xe.__webglFramebuffer===void 0)$e.setupRenderTarget(T);else if(xe.__hasExternalTextures)$e.rebindTextures(T,we.get(T.texture).__webglTexture,we.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let Ue=T.depthTexture;if(xe.__boundDepthTexture!==Ue){if(Ue!==null&&we.has(Ue)&&(T.width!==Ue.image.width||T.height!==Ue.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");$e.setupDepthRenderbuffer(T)}}let Fe=T.texture;(Fe.isData3DTexture||Fe.isDataArrayTexture||Fe.isCompressedArrayTexture)&&(me=!0);let ke=we.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(ke[k])?z=ke[k][X]:z=ke[k],ie=!0):T.samples>0&&$e.useMultisampledRTT(T)===!1?z=we.get(T).__webglMultisampledFramebuffer:Array.isArray(ke)?z=ke[X]:z=ke,C.copy(T.viewport),U.copy(T.scissor),D=T.scissorTest}else C.copy(Ae).multiplyScalar(W).floor(),U.copy(Je).multiplyScalar(W).floor(),D=pt;if(X!==0&&(z=ym),Ee.bindFramebuffer(F.FRAMEBUFFER,z)&&q&&Ee.drawBuffers(T,z),Ee.viewport(C),Ee.scissor(U),Ee.setScissorTest(D),ie){let xe=we.get(T.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+k,xe.__webglTexture,X)}else if(me){let xe=k;for(let Fe=0;Fe<T.textures.length;Fe++){let ke=we.get(T.textures[Fe]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+Fe,ke.__webglTexture,X,xe)}}else if(T!==null&&X!==0){let xe=we.get(T.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,xe.__webglTexture,X)}y=-1},this.readRenderTargetPixels=function(T,k,X,q,z,ie,me,be=0){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let xe=we.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&me!==void 0&&(xe=xe[me]),xe){Ee.bindFramebuffer(F.FRAMEBUFFER,xe);try{let Fe=T.textures[be],ke=Fe.format,Ue=Fe.type;if(!Be.textureFormatReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Be.textureTypeReadable(Ue)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=T.width-q&&X>=0&&X<=T.height-z&&(T.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+be),F.readPixels(k,X,q,z,Ie.convert(ke),Ie.convert(Ue),ie))}finally{let Fe=R!==null?we.get(R).__webglFramebuffer:null;Ee.bindFramebuffer(F.FRAMEBUFFER,Fe)}}},this.readRenderTargetPixelsAsync=async function(T,k,X,q,z,ie,me,be=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let xe=we.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&me!==void 0&&(xe=xe[me]),xe)if(k>=0&&k<=T.width-q&&X>=0&&X<=T.height-z){Ee.bindFramebuffer(F.FRAMEBUFFER,xe);let Fe=T.textures[be],ke=Fe.format,Ue=Fe.type;if(!Be.textureFormatReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Be.textureTypeReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Qe=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Qe),F.bufferData(F.PIXEL_PACK_BUFFER,ie.byteLength,F.STREAM_READ),T.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+be),F.readPixels(k,X,q,z,Ie.convert(ke),Ie.convert(Ue),0);let lt=R!==null?we.get(R).__webglFramebuffer:null;Ee.bindFramebuffer(F.FRAMEBUFFER,lt);let Lt=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await yf(F,Lt,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Qe),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,ie),F.deleteBuffer(Qe),F.deleteSync(Lt),ie}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,k=null,X=0){let q=Math.pow(2,-X),z=Math.floor(T.image.width*q),ie=Math.floor(T.image.height*q),me=k!==null?k.x:0,be=k!==null?k.y:0;$e.setTexture2D(T,0),F.copyTexSubImage2D(F.TEXTURE_2D,X,0,0,me,be,z,ie),Ee.unbindTexture()};let _m=F.createFramebuffer(),vm=F.createFramebuffer();this.copyTextureToTexture=function(T,k,X=null,q=null,z=0,ie=null){ie===null&&(z!==0?(Zs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ie=z,z=0):ie=0);let me,be,xe,Fe,ke,Ue,Qe,lt,Lt,_t=T.isCompressedTexture?T.mipmaps[ie]:T.image;if(X!==null)me=X.max.x-X.min.x,be=X.max.y-X.min.y,xe=X.isBox3?X.max.z-X.min.z:1,Fe=X.min.x,ke=X.min.y,Ue=X.isBox3?X.min.z:0;else{let Sn=Math.pow(2,-z);me=Math.floor(_t.width*Sn),be=Math.floor(_t.height*Sn),T.isDataArrayTexture?xe=_t.depth:T.isData3DTexture?xe=Math.floor(_t.depth*Sn):xe=1,Fe=0,ke=0,Ue=0}q!==null?(Qe=q.x,lt=q.y,Lt=q.z):(Qe=0,lt=0,Lt=0);let ut=Ie.convert(k.format),Ne=Ie.convert(k.type),Tt;k.isData3DTexture?($e.setTexture3D(k,0),Tt=F.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?($e.setTexture2DArray(k,0),Tt=F.TEXTURE_2D_ARRAY):($e.setTexture2D(k,0),Tt=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,k.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,k.unpackAlignment);let it=F.getParameter(F.UNPACK_ROW_LENGTH),fn=F.getParameter(F.UNPACK_IMAGE_HEIGHT),As=F.getParameter(F.UNPACK_SKIP_PIXELS),pn=F.getParameter(F.UNPACK_SKIP_ROWS),Er=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,_t.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,_t.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Fe),F.pixelStorei(F.UNPACK_SKIP_ROWS,ke),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Ue);let At=T.isDataArrayTexture||T.isData3DTexture,bn=k.isDataArrayTexture||k.isData3DTexture;if(T.isDepthTexture){let Sn=we.get(T),nn=we.get(k),ln=we.get(Sn.__renderTarget),wc=we.get(nn.__renderTarget);Ee.bindFramebuffer(F.READ_FRAMEBUFFER,ln.__webglFramebuffer),Ee.bindFramebuffer(F.DRAW_FRAMEBUFFER,wc.__webglFramebuffer);for(let Vi=0;Vi<xe;Vi++)At&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,we.get(T).__webglTexture,z,Ue+Vi),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,we.get(k).__webglTexture,ie,Lt+Vi)),F.blitFramebuffer(Fe,ke,me,be,Qe,lt,me,be,F.DEPTH_BUFFER_BIT,F.NEAREST);Ee.bindFramebuffer(F.READ_FRAMEBUFFER,null),Ee.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(z!==0||T.isRenderTargetTexture||we.has(T)){let Sn=we.get(T),nn=we.get(k);Ee.bindFramebuffer(F.READ_FRAMEBUFFER,_m),Ee.bindFramebuffer(F.DRAW_FRAMEBUFFER,vm);for(let ln=0;ln<xe;ln++)At?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Sn.__webglTexture,z,Ue+ln):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Sn.__webglTexture,z),bn?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,nn.__webglTexture,ie,Lt+ln):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,nn.__webglTexture,ie),z!==0?F.blitFramebuffer(Fe,ke,me,be,Qe,lt,me,be,F.COLOR_BUFFER_BIT,F.NEAREST):bn?F.copyTexSubImage3D(Tt,ie,Qe,lt,Lt+ln,Fe,ke,me,be):F.copyTexSubImage2D(Tt,ie,Qe,lt,Fe,ke,me,be);Ee.bindFramebuffer(F.READ_FRAMEBUFFER,null),Ee.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else bn?T.isDataTexture||T.isData3DTexture?F.texSubImage3D(Tt,ie,Qe,lt,Lt,me,be,xe,ut,Ne,_t.data):k.isCompressedArrayTexture?F.compressedTexSubImage3D(Tt,ie,Qe,lt,Lt,me,be,xe,ut,_t.data):F.texSubImage3D(Tt,ie,Qe,lt,Lt,me,be,xe,ut,Ne,_t):T.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,ie,Qe,lt,me,be,ut,Ne,_t.data):T.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,ie,Qe,lt,_t.width,_t.height,ut,_t.data):F.texSubImage2D(F.TEXTURE_2D,ie,Qe,lt,me,be,ut,Ne,_t);F.pixelStorei(F.UNPACK_ROW_LENGTH,it),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,fn),F.pixelStorei(F.UNPACK_SKIP_PIXELS,As),F.pixelStorei(F.UNPACK_SKIP_ROWS,pn),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Er),ie===0&&k.generateMipmaps&&F.generateMipmap(Tt),Ee.unbindTexture()},this.initRenderTarget=function(T){we.get(T).__webglFramebuffer===void 0&&$e.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?$e.setTextureCube(T,0):T.isData3DTexture?$e.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?$e.setTexture2DArray(T,0):$e.setTexture2D(T,0),Ee.unbindTexture()},this.resetState=function(){S=0,A=0,R=null,Ee.reset(),pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ln}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}};var Ta=new O;function An(i,e,t,n,s,r){let a=2*Math.PI*s/4,o=Math.max(r-2*s,0),c=Math.PI/4;Ta.copy(e),Ta[n]=0,Ta.normalize();let l=.5*a/(a+o),h=1-Ta.angleTo(i)/c;return Math.sign(Ta[t])===1?h*l:o/(a+o)+l+l*(1-h)}var Aa=class i extends xt{constructor(e=1,t=1,n=1,s=2,r=.1){let a=s*2+1;if(r=Math.min(e/2,t/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:n,segments:s,radius:r},a===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let c=new O,l=new O,h=new O(e,t,n).divideScalar(2).subScalar(r),u=this.attributes.position.array,f=this.attributes.normal.array,d=this.attributes.uv.array,m=u.length/6,x=new O,g=.5/a;for(let p=0,v=0;p<u.length;p+=3,v+=2)switch(c.fromArray(u,p),l.copy(c),l.x-=Math.sign(l.x)*g,l.y-=Math.sign(l.y)*g,l.z-=Math.sign(l.z)*g,l.normalize(),u[p+0]=h.x*Math.sign(c.x)+l.x*r,u[p+1]=h.y*Math.sign(c.y)+l.y*r,u[p+2]=h.z*Math.sign(c.z)+l.z*r,f[p+0]=l.x,f[p+1]=l.y,f[p+2]=l.z,Math.floor(p/m)){case 0:x.set(1,0,0),d[v+0]=An(x,l,"z","y",r,n),d[v+1]=1-An(x,l,"y","z",r,t);break;case 1:x.set(-1,0,0),d[v+0]=1-An(x,l,"z","y",r,n),d[v+1]=1-An(x,l,"y","z",r,t);break;case 2:x.set(0,1,0),d[v+0]=1-An(x,l,"x","z",r,e),d[v+1]=An(x,l,"z","x",r,n);break;case 3:x.set(0,-1,0),d[v+0]=1-An(x,l,"x","z",r,e),d[v+1]=1-An(x,l,"z","x",r,n);break;case 4:x.set(0,0,1),d[v+0]=1-An(x,l,"x","y",r,e),d[v+1]=1-An(x,l,"y","x",r,t);break;case 5:x.set(0,0,-1),d[v+0]=An(x,l,"x","y",r,e),d[v+1]=1-An(x,l,"y","x",r,t);break}}static fromJSON(e){return new i(e.width,e.height,e.depth,e.segments,e.radius)}};function Jl(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,c=new je,l=0;for(let h=0;h<i.length;++h){let u=i[h],f=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(u.morphAttributes[d])}if(e){let d;if(t)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,d,h),l+=d}}if(t){let h=0,u=[];for(let f=0;f<i.length;++f){let d=i[f].index;for(let m=0;m<d.count;++m)u.push(d.getX(m)+h);h+=i[f].attributes.position.count}c.setIndex(u)}for(let h in r){let u=tp(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(let h in a){let u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let f=0;f<u;++f){let d=[];for(let x=0;x<a[h].length;++x)d.push(a[h][x][f]);let m=tp(d);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(m)}}return c}function tp(i){let e,t,n,s=-1,r=0;for(let l=0;l<i.length;++l){let h=i[l];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let a=new e(r),o=new Ut(a,t,n),c=0;for(let l=0;l<i.length;++l){let h=i[l];if(h.isInterleavedBufferAttribute){let u=c/t;for(let f=0,d=h.count;f<d;f++)for(let m=0;m<t;m++){let x=h.getComponent(f,m);o.setComponent(f+u,m,x)}}else a.set(h.array,c);c+=h.count*t}return s!==void 0&&(o.gpuType=s),o}var mr=(i,e,t)=>Math.max(e,Math.min(t,i));function np(i=0,e=0){return{lane:i,velocity:0,distance:e,wheelAngle:0,lastSpeed:0,roll:0,pitch:0,steer:0,phase:0,bob:0,braking:!1}}function ip(i,e,t,n,s,r=!1){if(r||s<=0)return i;s=Math.min(s,.1);let a=24,o=i.lane-e,c=i.velocity+a*o,l=Math.exp(-a*s);i.lane=e+(o+c*s)*l,i.velocity=(i.velocity-a*c*s)*l,Math.abs(i.lane)>1&&(i.lane=mr(i.lane,-1,1),i.velocity=0);let h=Math.max(0,t-i.distance);i.distance=t,i.wheelAngle=(i.wheelAngle+h/.43)%(Math.PI*2);let u=mr((n-i.lastSpeed)/s,-24,16);i.lastSpeed=n,i.braking=u<-2||n<.4;let f=1-Math.exp(-12*s),d=mr(n/20,0,1);return i.steer+=(mr(-i.velocity*3.35/Math.max(8,n),-.38,.38)-i.steer)*f,i.roll+=(mr(i.velocity*.023,-.105,.105)*d-i.roll)*f,i.pitch+=(mr(-u*.0025,-.04,.06)-i.pitch)*f,i.phase+=h*1.05,i.bob=Math.sin(i.phase)*.018*d,i}function jl(i){return{start:i.start-30,end:i.end+40}}function Av(i){let e=[],t=[],n=[],s=[],r=(a,o,c)=>a+(o-a)*c;for(let a=0;a<i.length-1;a++){let o=i[a],c=i[a+1],l=[];for(let u=0;u<o.intervals.length;u++)for(let f=0;f<2;f++)l.push({a:o.intervals[u][f],b:c.intervals[u][f],id:u,side:f});let h=[0,1];for(let u=0;u<l.length;u++)for(let f=u+1;f<l.length;f++){let d=l[u],m=l[f],x=d.b-d.a-(m.b-m.a);if(Math.abs(x)>1e-9){let g=(m.a-d.a)/x;g>1e-7&&g<1-1e-7&&h.push(g)}}h.sort((u,f)=>u-f);for(let u=0;u<h.length-1;u++){let f=h[u],d=h[u+1];if(d-f<1e-7)continue;let m=(f+d)/2,x=b=>r(o.at,c.at,b),g=(b,_)=>r(b.a,b.b,_),p=o.intervals.map((b,_)=>({left:l[_*2],right:l[_*2+1]})).sort((b,_)=>g(b.left,m)-g(_.left,m)),v=[];for(let b of p){let _=v.at(-1);_&&g(b.left,m)<=g(_.right,m)+1e-8?g(b.right,m)>g(_.right,m)&&(_.right=b.right):v.push({...b})}for(let b of v){let _=[[g(b.left,f),x(f)],[g(b.right,f),x(f)],[g(b.left,d),x(d)],[g(b.right,d),x(d)]],I=e.length/3;for(let[S,A]of _)e.push(S,0,-A),t.push(S/10.8,A/20);n.push(I,I+1,I+2,I+2,I+1,I+3),s.push([_[0],_[2]],[_[1],_[3]])}}}return{positions:e,uvs:t,indices:n,edges:s}}function sp(i,e,t,n){let s=i[0],r=jl(s),a=new Set([r.start,s.start,s.end,r.end]);for(let l=r.start;l<r.end;l+=2)a.add(l);let o=l=>l*l*l*(10+l*(-15+6*l)),c=[...a].sort((l,h)=>l-h).map(l=>{let h,u;if(l<s.start){let d=o((l-r.start)/30);h=[-3.35,0,3.35],u=8.2-2.8*d}else if(l>s.end){let d=o((l-s.end)/40);h=[-3.35,0,3.35],u=5.4+2.8*d}else h=i.map(d=>d.lane*3.35+t(d,l)),u=5.4;let f=e(l)-e(n);return{at:l-n,intervals:h.map(d=>[f+d-u,f+d+u])}});return{...Av(c),rows:c,bounds:r}}function Kh(i,e=!1){return e&&i>4?4+(i-4)*.4:i}function Jh(i,e,t=!1){if(t)return 0;let n=3,s=(i(e+n)-2*i(e)+i(e-n))/(n*n);return Math.max(-.34,Math.min(.34,-s*55))}var rp=(i,e)=>Math.sin(i)*e;function ap({route:i,curve:e,offset:t,height:n,origin:s,step:r=2,reduced:a=!1}){let o=l=>e(l)-e(s)+i.lane*3.35+t(i,l),c=[];for(let l=i.start;l<=i.end+1e-6;l+=r){let h=Kh(n(i,l),a),u=Jh(o,l,a);c.push({at:l,x:o(l),y:h,z:-(l-s),bank:u,pivot:i.side*3.2/2})}return c}function jh(i,e,t){let n=[],s=[],r=e.length;i.forEach((a,o)=>{let c=i[Math.min(i.length-1,o+1)],l=i[Math.max(0,o-1)],h=c.x-l.x,u=c.y-l.y,f=c.z-l.z,d=Math.hypot(h,u,f)||1;h/=d,u/=d,f/=d;let m=-f,x=h,g=Math.hypot(m,x)||1;m/=g,x/=g;let p=-u*x,v=x*h-m*f,b=u*m,_=Math.cos(a.bank),I=Math.sin(a.bank),S=m*_+p*I,A=v*I,R=x*_+b*I,y=-m*I+p*_,M=v*_,C=-x*I+b*_,U=t-a.pivot;for(let[D,N]of e){let G=U+D;n.push(a.x+m*a.pivot+S*G+y*N,a.y+A*G+M*N,a.z+x*a.pivot+R*G+C*N)}});for(let a=0;a<i.length-1;a++)for(let o=0;o<r;o++){let c=a*r+o,l=a*r+(o+1)%r,h=c+r,u=l+r;s.push(c,h,l,l,h,u)}return{positions:n,indices:s}}var op=[[-1.2,0],[1.2,0],[1.2,-.55],[-1.2,-.55]],lp=i=>[[i-.09,.2],[i+.09,.2],[i+.09,0],[i-.09,0]];function cp(i,e,t,n=8){let s=[],r=-1/0;for(let a of i){if(a.y<1.2||a.at-r<n)continue;r=a.at;let o=a.x+a.pivot,c=e(a.at),l=a.y-.55,h=c-t(a.at,-1)-1.6,u=c+t(a.at,1)+1.6;o>h-1.2&&o<u+1.2?l>=4.6&&s.push({kind:"portal",at:a.at,z:a.z,top:l,left:h,right:u,x:o}):s.push({kind:"column",at:a.at,z:a.z,top:l,x:o})}return s}var Ra=new gt,Ql=new Te,Ft=class{constructor(){this.parts=new Map}add(e,t,n,s=0,r=0,a=0,o=1,c=1,l=1,h=0,u=0,f=0){let d=t.index?t.toNonIndexed():t.clone();for(let g of Object.keys(d.attributes))g!=="position"&&g!=="normal"&&d.deleteAttribute(g);Ra.position.set(s,r,a),Ra.rotation.set(h,u,f),Ra.scale.set(o,c,l),Ra.updateMatrix(),d.applyMatrix4(Ra.matrix),Ql.set(n);let m=d.attributes.position.count,x=new Float32Array(m*3);for(let g=0;g<m;g++)x[g*3]=Ql.r,x[g*3+1]=Ql.g,x[g*3+2]=Ql.b;return d.setAttribute("color",new Ut(x,3)),this.parts.has(e)||this.parts.set(e,[]),this.parts.get(e).push(d),d}addGeometry(e,t,n){return this.add(e,t,n)}has(e){return!!this.parts.get(e)?.length}merge(e){let t=this.parts.get(e);if(!t?.length)return null;let n=t.length===1?t[0]:Jl(t);return t.length>1&&t.forEach(s=>s.dispose()),this.parts.delete(e),n.computeBoundingSphere(),n}keys(){return[...this.parts.keys()]}};function Ca(...i){let e=2166136261;for(let t of i)e^=Math.floor(t*1e3)|0,e=Math.imul(e,16777619),e^=e>>>13;return(e>>>0)%1e5/1e5}function Qn(i){let e=i>>>0||1;return()=>{e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var Rv=[[-.84,0],[-.965,.09],[-1,.28],[-.995,.5],[-.965,.7],[-.88,.87],[-.66,.98],[-.3,1],[.3,1],[.66,.98],[.88,.87],[.965,.7],[.995,.5],[1,.28],[.965,.09],[.84,0]],Cv=[[-1,0],[-1,1],[1,1],[1,0]];function ec(i,{profile:e=Rv,tumble:t=1}={}){let n=e.length,s=[],r=[],a=[],o=[],c=(m,[x,g])=>{let p=1+((m.tumble??t)-1)*g;return[x*m.w*p+(m.x||0),m.low+g*(m.high-m.low),m.z]};i.forEach(m=>e.forEach(x=>s.push(...c(m,x))));for(let m=0;m<i.length-1;m++)for(let x=0;x<n;x++){let g=m*n+x,p=m*n+(x+1)%n,v=g+n,b=p+n;a.push(g,v,p,p,v,b)}for(let[m,x]of[[0,i[0]],[1,i.at(-1)]]){let g=r.length/3;e.forEach(p=>r.push(...c(x,p)));for(let p=1;p<n-1;p++)m?o.push(g,g+p+1,g+p):o.push(g,g+p,g+p+1)}let l=new je;l.setAttribute("position",new Pe(s,3)),l.setIndex(a),l.computeVertexNormals();let h=new je;h.setAttribute("position",new Pe(r,3)),h.setIndex(o),h.computeVertexNormals();let u=new je,f=l.toNonIndexed(),d=h.toNonIndexed();for(let m of["position","normal"])u.setAttribute(m,new Pe([...f.attributes[m].array,...d.attributes[m].array],3));return[l,h,f,d].forEach(m=>m.dispose()),u}function $t(i,e){if(e<=i[0].z)return{...i[0]};if(e>=i.at(-1).z)return{...i.at(-1)};for(let t=1;t<i.length;t++)if(e<=i[t].z){let n=i[t-1],s=i[t],r=(e-n.z)/(s.z-n.z),a={z:e};for(let o of["w","low","high","tumble"])a[o]=(n[o]??1)+((s[o]??1)-(n[o]??1))*r;return a}}var le=(i,e,t,n,s)=>({z:i,w:e,low:t,high:n,tumble:s}),hp={coupe:{body:[le(-2.25,.78,.37,.6,.92),le(-2.13,.95,.3,.69),le(-1.88,1.04,.28,.77),le(-1.25,1.07,.28,.85),le(-.78,1.075,.28,.9),le(.35,1.065,.28,.93),le(1.1,1.095,.28,.95),le(1.78,1.075,.3,.95),le(2.12,.99,.34,.9),le(2.26,.84,.42,.82)],canopy:[le(-.9,.86,.84,.9,.86),le(-.32,.82,.86,1.29,.76),le(.12,.8,.88,1.37,.74),le(.74,.78,.88,1.36,.74),le(1.36,.82,.88,1.08,.8),le(1.78,.88,.9,.95,.9)],wheel:{r:.42,w:.3,x:.99,z:[-1.38,1.42]},lamps:{y:.79,z:2.2,x:.56,w:.66},head:{y:.64,z:-2.13,x:.68},exhaust:[.62,.36,2.24],stripes:!0,spoiler:"lip"},gt:{body:[le(-2.3,.82,.33,.52,.9),le(-2.16,1,.27,.62),le(-1.85,1.1,.25,.72),le(-1.2,1.12,.25,.79),le(-.7,1.11,.25,.83),le(.4,1.1,.25,.86),le(1.12,1.15,.25,.9),le(1.82,1.12,.27,.9),le(2.18,1.03,.32,.86),le(2.3,.88,.4,.78)],canopy:[le(-.72,.84,.78,.83,.84),le(-.18,.8,.8,1.19,.72),le(.3,.78,.82,1.25,.7),le(.86,.76,.82,1.23,.72),le(1.42,.82,.82,.99,.8),le(1.8,.88,.84,.88,.9)],wheel:{r:.42,w:.34,x:1.03,z:[-1.42,1.46]},lamps:{y:.74,z:2.25,x:.58,w:.7},head:{y:.58,z:-2.18,x:.72},exhaust:[.5,.33,2.28],wing:!0,splitter:!0},sedan:{body:[le(-2.28,.86,.4,.68,.95),le(-2.12,.98,.34,.8),le(-1.7,1.03,.32,.86),le(-.9,1.04,.32,.9),le(.6,1.04,.32,.92),le(1.6,1.03,.32,.94),le(2.12,.97,.36,.92),le(2.26,.86,.44,.86)],canopy:[le(-1.02,.88,.86,.92,.88),le(-.45,.85,.88,1.44,.82),le(.95,.84,.9,1.46,.82),le(1.45,.86,.9,1.06,.86),le(1.72,.9,.9,.95,.92)],wheel:{r:.4,w:.26,x:.95,z:[-1.42,1.42]},lamps:{y:.84,z:2.22,x:.6,w:.5},head:{y:.72,z:-2.15,x:.68},exhaust:[.55,.38,2.24]},hatch:{body:[le(-2,.86,.4,.7,.95),le(-1.86,.97,.34,.82),le(-1.4,1.02,.32,.88),le(-.7,1.03,.32,.93),le(.8,1.03,.32,.96),le(1.62,1,.34,.98),le(1.84,.92,.4,.96)],canopy:[le(-.82,.88,.88,.95,.88),le(-.25,.85,.9,1.48,.84),le(1.2,.84,.9,1.5,.84),le(1.62,.86,.92,1.34,.86),le(1.76,.88,.94,1,.9)],wheel:{r:.38,w:.25,x:.93,z:[-1.22,1.25]},lamps:{y:1,z:1.8,x:.66,w:.36},head:{y:.74,z:-1.94,x:.64},exhaust:[.5,.4,1.86]},suv:{body:[le(-2.3,.92,.5,.86,.96),le(-2.14,1.03,.44,1),le(-1.7,1.08,.42,1.08),le(-.9,1.09,.42,1.12),le(.9,1.09,.42,1.14),le(1.9,1.07,.44,1.14),le(2.22,1,.48,1.1),le(2.3,.92,.56,1.04)],canopy:[le(-1,.94,1.06,1.12,.92),le(-.45,.92,1.08,1.74,.88),le(1.75,.92,1.1,1.78,.9),le(2.1,.94,1.1,1.6,.92),le(2.22,.95,1.1,1.14,.95)],wheel:{r:.47,w:.32,x:1,z:[-1.45,1.5]},lamps:{y:1.12,z:2.26,x:.74,w:.34},head:{y:.92,z:-2.2,x:.7},exhaust:[.6,.48,2.3],rack:!0},van:{body:[le(-2.4,.92,.46,.86,.96),le(-2.22,1.04,.4,1),le(-1.7,1.08,.38,1.1),le(-1.2,1.1,.38,1.14),le(2.25,1.1,.38,1.16),le(2.4,1.04,.42,1.12)],canopy:[le(-1.62,1,1.06,1.12,.94),le(-1,1,1.08,2.02,.94),le(2.28,1.04,1.1,2.06,.95),le(2.38,1,1.1,1.2,.96)],wheel:{r:.44,w:.3,x:1,z:[-1.6,1.55]},lamps:{y:1.12,z:2.38,x:.86,w:.22},head:{y:.86,z:-2.32,x:.74},exhaust:[.6,.44,2.38],panelRoof:!0}},iu=["sedan","hatch","suv","sedan","van"],Qh=1384748,Iv=1711651,nu=13227226,Pv=2503487,kt=new xt(1,1,1),us=new hn(1,1,1,20),Lv=new ji(1,20,0,Math.PI),Dv=new Fn(1,12,8),eu=new Map;function Uv(i){let e=i.r+":"+i.w;if(eu.has(e))return eu.get(e);let t=new Ft,n=i.r,s=i.w,r=Math.PI/2;t.add("w",us,Iv,0,0,0,n,s,n,0,0,r),t.add("w",us,2896699,0,0,0,n*.93,s+.012,n*.93,0,0,r);for(let o of[-1,1]){t.add("w",us,9411750,o*(s*.5+.004),0,0,n*.66,.02,n*.66,0,0,r),t.add("w",us,3752781,o*(s*.5+.01),0,0,n*.5,.012,n*.5,0,0,r);for(let c=0;c<5;c++)t.add("w",kt,nu,o*(s*.5+.016),0,0,.035,n*1.22,.075,c*Math.PI*2/5,0,0);t.add("w",us,15002863,o*(s*.5+.024),0,0,n*.16,.014,n*.16,0,0,r)}let a=t.merge("w");return eu.set(e,a),a}var tu=new Map;function up(i="coupe"){if(tu.has(i))return tu.get(i);let e=hp[i]||hp.coupe,t=new Ft,n=e.body,s=e.canopy,r=e.wheel,a=n[0].z,o=n.at(-1).z,c=Math.max(...s.map(S=>S.high));t.add("paint",ec(n),16777215),t.add("glass",ec(s),16777215);let l=s.filter(S=>S.high>c-.1).map(S=>S.z),h=Math.min(...l)-.16,u=Math.max(...l)+.14,f=[h,h+.08,(h+u)/2,u-.08,u].map((S,A)=>{let R=$t(s,S),y=A===0||A===4;return le(S,R.w*R.tumble*(y?.84:.9),R.high-(y?.07:.13),R.high+.018,.94)});t.add("paint",ec(f),16777215);for(let S of[-1,1]){for(let G of r.z){let V=$t(n,G),j=S*(V.w*.985);t.add("trim",Lv,725528,j+S*.012,r.r*.98,G,r.r*1.18,r.r*1.18,1,0,S*Math.PI/2,0);let W=new _i(r.r*1.2,.055,5,14,Math.PI);t.add("paint",W,16777215,j+S*.02,r.r*.98,G,1,1,1.6,0,S*Math.PI/2,0),W.dispose()}t.add("trim",kt,Pv,S*($t(n,0).w*.97),n[3].low+.07,(r.z[0]+r.z[1])/2,.06,.1,r.z[1]-r.z[0]-r.r*2.3);let A=$t(s,s[0].z+.25),R=S*($t(n,s[0].z+.2).w*.93);t.add("paint",Dv,16777215,R+S*.1,A.low+.09,s[0].z+.22,.12,.07,.09),t.add("trim",kt,Qh,R+S*.04,A.low+.04,s[0].z+.25,.12,.03,.05),t.add("trim",kt,nu,S*($t(n,.4).w*.985),$t(n,.4).high-.03,(s[0].z+s.at(-1).z)/2,.015,.022,(s.at(-1).z-s[0].z)*.82);let y=a+.13,M=$t(n,y),C=Math.min(e.head.y,M.high-.07);t.add("trim",kt,857372,S*e.head.x,C,y,.42,.12,.2,0,S*.16,0),t.add("lights",kt,16775398,S*e.head.x,C+.005,y-.012,.36,.07,.2,0,S*.16,0),t.add("lights",kt,12578815,S*(e.head.x-.02),C-.075,y-.004,.28,.02,.2,0,S*.16,0);let[U,D,N]=e.exhaust;t.add("trim",us,nu,S*U,D,N,.07,.12,.07,Math.PI/2,0,0),t.add("trim",us,724755,S*U,D,N+.05,.05,.04,.05,Math.PI/2,0,0)}let d=$t(n,a+.05),m=$t(n,o-.05);if(t.add("trim",kt,Qh,0,d.low+.13,a+.03,d.w*1.45,.16,.06),t.add("trim",kt,989216,0,e.head.y-.04,a+.05,d.w*.8,.09,.05),t.add("trim",kt,Qh,0,m.low+.12,o+.01,m.w*1.6,.16,.06),t.add("trim",kt,15328207,0,m.low+.27,o+.03,.42,.12,.02),t.add("trim",kt,5906215,0,e.lamps.y,e.lamps.z+.012,(e.lamps.x-e.lamps.w/2)*2,.045,.03),e.splitter&&t.add("trim",kt,1120802,0,n[1].low-.02,a+.12,n[1].w*1.9,.035,.32),e.spoiler==="lip"&&t.add("paint",kt,16777215,0,n.at(-3).high+.04,n.at(-3).z+.12,n.at(-3).w*1.62,.04,.2,-.18,0,0),e.wing){for(let S of[-1,1])t.add("trim",kt,1581869,S*.62,1,1.92,.06,.26,.12);t.add("trim",kt,1581869,0,1.14,1.97,2,.05,.38,-.08,0,0);for(let S of[-1,1])t.add("trim",kt,1581869,S*1,1.1,1.97,.03,.2,.42)}if(e.rack){for(let S of[-1,1])t.add("trim",kt,10135214,S*.6,c+.06,.6,.05,.05,2.2);for(let S of[-.2,.6,1.4])t.add("trim",kt,10135214,0,c+.07,S,1.22,.035,.05)}e.panelRoof&&t.add("paint",kt,16777215,0,c-.18,.62,1.98,.36,3.3);let x=null;if(e.stripes){let S=(R,y,M)=>R.map(C=>{let U=$t(y,C);return le(C,.085,U.high+M-.012,U.high+M+.006,1)}),A=[];for(let R of[-.25,.25])for(let[y,M,C]of[[[a+.06,a+.25,-1.6,-1.2,-.82],n,0],[[h+.02,(h+u)/2,u-.02],f.map(U=>({...U,high:U.high})),0],[[s.at(-1).z+.05,1.95,o-.1],n,0]]){let U=ec(S(y,M,C),{profile:Cv});U.translate(R,.004,0),A.push(U)}x=new Ft,A.forEach(R=>{x.add("s",R,16052193),R.dispose()}),x=x.merge("s")}let g={bottom:[s[0].high,s[0].z],top:[$t(s,s[1].z).high,s[1].z]},p=s.length-1,v={bottom:[s[p].high,s[p].z],top:[s[p-1].high,s[p-1].z]},b=s[0].z-.02,_=a+.35,I={kind:i,paint:t.merge("paint"),glass:t.merge("glass"),trim:t.merge("trim"),lights:t.merge("lights"),stripes:x,wheel:Uv(r),wheelSpec:r,anchors:{badge:{z:a+.78,y:$t(n,a+.78).high},roofY:c+.016,roofZ:(h+u)/2,hood:{y:$t(n,b).high,back:b,front:_,frontY:$t(n,_).high,w:$t(n,b).w*.8},windshield:g,rearGlass:v,side:{x:$t(n,.86).w,y:$t(n,.86).high-.18,z:.86},lamps:e.lamps,head:e.head,exhaust:e.exhaust,front:a,rear:o,width:Math.max(...n.map(S=>S.w))}};return tu.set(i,I),I}var au=[{name:"boulevard",zenith:6269152,horizon:14280686,sunGlow:16769968,fog:14280686,fogNear:70,fogFar:315,sun:16769204,sunIntensity:3.3,sunPosition:[-34,62,38],hemiSky:13953279,hemiGround:9075298,hemi:1.25,rim:11066608,rimIntensity:.9,exposure:1.08,road:3819092,roadRough:.86,ground:9285770,curb:13617596,walk:13222580,walk2:12169892,verge:8367726,rail:13818070,lamp:4873580,buildings:[15193274,14279138,12176848,14862246,13220008,10993609,15721164,13874583],accents:[14708051,4165514,15775050,5533864,13000059,6988653],glass:6129571,trees:[5213791,6266211,4160853,7776357],trunk:7231041},{name:"coast",zenith:4172248,horizon:14085872,sunGlow:16773839,fog:14085872,fogNear:80,fogFar:320,sun:16773592,sunIntensity:3.5,sunPosition:[-26,70,30],hemiSky:13233407,hemiGround:5213333,hemi:1.3,rim:10217198,rimIntensity:.9,exposure:1.1,road:3622746,roadRough:.84,ground:14273958,curb:14212310,walk:12568516,walk2:11187378,verge:8828042,rail:15002600,lamp:5993088,water:2068398,deepWater:1270143,buildings:[15920610,15195339,14214884,16046530,13623528],accents:[3116963,14710863,15909198,3960476],glass:7317183,trees:[5218426,4164204,7319690],trunk:10123861,rock:9080710,rock2:11052179},{name:"storm",zenith:2502735,horizon:9016749,sunGlow:12174052,fog:9016749,fogNear:55,fogFar:300,sun:12766706,sunIntensity:2.1,sunPosition:[-30,55,30],hemiSky:11122396,hemiGround:3950162,hemi:1.55,rim:10467327,rimIntensity:1.15,exposure:1.12,road:2831170,roadRough:.42,ground:6254182,curb:11120821,walk:8226704,walk2:7042172,verge:5596764,rail:11977420,lamp:4608606,buildings:[9082536,7306383,10134704],accents:[15907152,14904661,8368345],glass:4281966,trees:[3099203,3692105,2506806,4284495],trunk:4865334,rock:7173248,rock2:8884379,snow:15331060}],Y=new xt(1,1,1),zt=new hn(1,1,1,10),dp=new hn(1,1,1,6),zn=new Zn(1,1,7),vn=new Kn(1,0),su=new Kn(1,1),Nv=new ji(1,14),xr=new Fn(1,10,7),Fv=(i,e,t)=>new Te(i).lerp(new Te(e),t).getHex(),ht=(i,e)=>{let t=new Te(i);return t.multiplyScalar(e),t.getHex()},Ov=(i,e,t,n,s,r,a)=>i.add("s",Nv,a,e,t,n,s,r,1,-Math.PI/2,0,0);function bi(i,e,t,n,s,r="round",a=1){let o=s.trees[Math.floor(n()*s.trees.length)],c=(2.6+n()*1.6)*a;if(Ov(i,e+.6,.035,t+.4,1.9*a,1.5*a,ht(s.ground,.72)),i.add("s",dp,s.trunk,e,c*.4,t,.16*a,c*.8,.16*a),r==="pine"){for(let l=0;l<3;l++)i.add("s",zn,ht(o,1-l*.06),e,c*.55+l*1.15*a,t,(1.7-l*.42)*a,2.1*a,(1.7-l*.42)*a);s.snow&&n()<.45&&i.add("s",zn,s.snow,e,c*.55+3.05*a,t,.5*a,.7*a,.5*a);return}if(r==="palm"){for(let l=0;l<4;l++)i.add("s",dp,ht(s.trunk,1-l*.04),e+l*.12,1+l*1.6,t,.2-l*.02,1.7,.2-l*.02,0,0,-.07);for(let l=0;l<7;l++){let h=l*Math.PI*2/7+n();i.add("s",xr,l%2?o:ht(o,.9),e+.5+Math.cos(h)*1.25,6.7-Math.abs(Math.sin(h))*.2,t+Math.sin(h)*1.25,1.6,.12,.42,0,-h,Math.cos(h)*-.25)}i.add("s",xr,9071164,e+.5,6.6,t,.35,.3,.35);return}i.add("s",su,o,e,c+.9*a,t,1.55*a,1.35*a,1.5*a),i.add("s",su,ht(o,1.12),e+.55*a,c+1.5*a,t-.3*a,1.05*a,.95*a,1*a),i.add("s",su,ht(o,.88),e-.5*a,c+.55*a,t+.4*a,1*a,.85*a,.95*a)}function pp(i,e,t,n,s,r,a,o,c,l,h,{band:u=!1,floor:f=3.1}={}){for(let d=n;d<s-1.2;d+=f){if(u){i.add("s",Y,c,t-h*.03,d+1.1,(r+a)/2,.06,1.25,a-r-.6),i.add("s",Y,l,t-h*.05,d+.38,(r+a)/2,.05,.12,a-r-.4);continue}let m=(a-r)/o;for(let x=0;x<o;x++){let g=r+m*(x+.5);i.add("s",Y,c,t-h*.03,d+1.1,g,.06,1.35,m*.58)}}}function mp(i,e,t,n,s,r,a,o){for(let c=s;c<r-1.2;c+=3.1)for(let l=0;l<o;l++)i.add("s",Y,a,e-t/2+t*(l+.5)/o,c+1.1,n+.03,t/o*.56,1.35,.06)}function ru(i,e,t,n,s,r,a){let o=9+e()*6,c=n*(1+e()*2.5),l=c+n*o/2,h=r-s,u=(s+r)/2,f=t.buildings[Math.floor(e()*t.buildings.length)],d=t.accents[Math.floor(e()*t.accents.length)],m=a==="tower"?26+e()*22:a==="low"?7+e()*4:12+e()*12,x=a==="tower"?t.glass:ht(t.glass,.82),g=ht(f,.78);i.add("s",Y,ht(f,.9),l,2,u,o,4,h),i.add("s",Y,2900306,c-n*.02,1.55,u,.06,2.4,h-1.2);for(let p=s+1.6;p<r-1;p+=2.4)i.add("s",Y,ht(f,.72),c-n*.05,1.55,p,.08,2.5,.12);if(i.add("s",Y,d,c-n*.65,3.2,u,1.3,.12,h-.8,0,0,n*.18),i.add("s",Y,ht(d,.75),c-n*1.28,3.05,u,.05,.32,h-.8),i.add("s",Y,16183522,c-n*.06,3.85,u,.08,.55,Math.min(h-2,6)),i.add("s",Y,ht(d,.9),c-n*.09,3.85,u,.04,.36,Math.min(h-2.6,5.2)),a==="tower"){i.add("s",Y,x,l+n*1,4+m/2,u,o-2,m,h-1.5);for(let p=s+1;p<=r-1;p+=1.6)i.add("s",Y,14674156,c+n*.97,4+m/2,p,.06,m,.1);for(let p=4;p<4+m;p+=3.3)i.add("s",Y,13227740,c+n*.96,p,u,.08,.14,h-1.5);return i.add("s",Y,12043468,l+n*1,4.4+m,u,o-3,.8,h-3),i.add("s",Y,10135730,l+n*1.5,5.6+m,u,2.4,1.8,2.4),m+4}if(i.add("s",Y,f,l,4+m/2,u,o,m,h),i.add("s",Y,g,c-n*.04,4.15,u,.12,.3,h+.05),pp(i,l,c,4.2,4+m,s+.8,r-.8,Math.max(2,Math.round(h/3)),x,g,n,{band:a==="band"}),mp(i,l,o-1.5,r,4.2,4+m,x,Math.max(2,Math.round(o/3))),a==="balcony")for(let p=7;p<4+m-1;p+=3.1)i.add("s",Y,15330538,c-n*.55,p,u,1.1,.12,h-2.4);return i.add("s",Y,g,l,4+m+.25,u,o+.2,.5,h+.2),i.add("s",Y,ht(f,.68),l,4+m+.05,u,o-.8,.3,h-.8),e()<.6&&(i.add("s",Y,11121848,l+n*(e()*2-1),4+m+.9,u-1,2,1.2,1.6),i.add("s",Y,9411489,l-n*1.5,4+m+.7,u+2,1.2,.8,1.2)),e()<.35&&(i.add("s",zt,9335128,l+n*2,4+m+1.6,u+1.5,.9,2.2,.9),i.add("s",zn,7166023,l+n*2,4+m+3.1,u+1.5,1,.8,1)),e()<.3&&i.add("s",Y,t.trees[0],l,4+m+.6,u,o-2,.5,h-2.5),m+4}function Bv(i,e,t){let n=new Ft,s=Qn(1e3+t*31+(e>0?7:0));if(n.add("s",Y,ht(i.walk2,.96),e*22,-.04,0,44,.1,20.2),t===7){n.add("s",Y,i.verge,e*16,.02,0,22,.06,18),n.add("s",zt,14078148,e*14,.3,0,3,.6,3),n.add("s",zt,7321814,e*14,.62,0,2.6,.05,2.6),n.add("s",zt,15262938,e*14,1.3,0,.25,1.5,.25);for(let[h,u]of[[6,-6],[9,5],[20,-4],[23,6],[17,-8]])bi(n,e*h,u,s,i,"round",1.15);for(let h of[-3,3])n.add("s",Y,8018499,e*6.5,.45,h,.6,.12,2.2);return n.merge("s")}let r=["grid","band","balcony","tower","low","grid","band","balcony"],a=r[t%r.length];t%3===1?(ru(n,s,i,e,-9.6,-.3,a),ru(n,s,i,e,.3,9.6,r[(t+3)%8])):ru(n,s,i,e,-9.4,9.4,a);let o=Qn(77+t*13+(e>0?3:0)),c=18+o()*30,l=i.buildings[Math.floor(o()*i.buildings.length)];return n.add("s",Y,ht(l,.92),e*(30+o()*6),c/2,-2+o()*4,10,c,14),n.merge("s")}function kv(i,e,t){let n=new Ft,s=Qn(2e3+t*17+(e>0?5:0));if(t===0)return gp();if(t===1){let a=e*(26+s()*16),o=s()*10-5;n.add("s",Y,16052454,a,-3,o,2.2,.6,6),n.add("s",Y,2775920,a,-2.7,o,2.25,.12,6.05),n.add("s",Y,15918796,a,-2.4,o+.6,1.4,.6,2.2),n.add("s",zt,13949662,a,1,o,.06,7,.06);let c=new je;return c.setAttribute("position",new Pe([0,0,0,0,6,0,0,0,3.6,0,0,0,0,0,3.6,0,6,0],3)),c.computeVertexNormals(),n.add("s",c,16644334,a,-2,o-1.5),c.dispose(),n.merge("s")}if(t===2){for(let[a,o,c]of[[12,-5,14833983],[18,6,4170605],[30,-2,15778378]])n.add("s",zt,c,e*a,-2.9,o,.5,1.1,.5),n.add("s",zn,c,e*a,-2,o,.4,.9,.4);return n.merge("s")}if(t===3||t===4){let a=e*(32+s()*14);return n.add("s",vn,i.rock,a,-3.4,0,9,3.2,8),n.add("s",vn,i.rock2,a+e*2,-2.2,2,5,2.2,4.5),n.add("s",xr,i.ground,a,-1.6,0,6,.9,5.5),bi(n,a-1,-1,s,i,"palm"),t===4&&bi(n,a+2,2,s,i,"palm",.9),n.merge("s")}n.add("s",Y,i.ground,e*24,-1.7,0,40,3.4,20.4),n.add("s",Y,ht(i.ground,.85),e*4.6,-2.2,0,1.2,2.4,20.4);let r=t%3;for(let a=0;a<2;a++){let o=-5+a*10,c=6+s()*3,l=5+s()*7,h=e*(9+s()*4+a*7),u=i.buildings[(t+a)%i.buildings.length];n.add("s",Y,u,h,l/2,o,c,l,6.5),n.add("s",Y,i.accents[(t+a+r)%i.accents.length],h,l+.5,o,c+.6,1,7.1,0,0,0),mp(n,h,c-1,o+3.25,1,l,i.glass,2),pp(n,h,h-e*c/2,1,l,o-2.6,o+2.6,2,i.glass,16777215,e)}return bi(n,e*6,-8,s,i,"palm"),bi(n,e*7,8,s,i,"palm",.95),n.merge("s")}function zv(i,e,t){let n=new Ft,s=Qn(3e3+t*19+(e>0?11:0));if(n.add("s",Y,i.ground,e*24,-.06,0,46,.1,20.4),n.add("s",vn,ht(i.ground,.92),e*(18+s()*8),-.8,s()*8-4,7,2.6,6,0,s()*3,0),t%4===0){let a=e*(10+s()*6);n.add("s",vn,i.rock,a,.6,-3,2.2,1.6,2.6,0,s()*3,0),n.add("s",vn,i.rock2,a+e,.4,-1,1.4,1,1.5,0,s()*3,0)}let r=t%4===3?3:7+Math.floor(s()*5);for(let a=0;a<r;a++){let o=e*(7+s()*30),c=s()*18-9;bi(n,o,c,s,i,"pine",.85+s()*.6)}if(t===5){let a=e*15;n.add("s",Y,7166538,a,1.6,2,5,3.2,6),n.add("s",Y,4012608,a,3.9,2,5.8,.3,6.8,0,0,e*.42),n.add("s",Y,4012608,a+e*1.2,3.9,2,5.8,.3,6.8,0,0,-e*.42),n.add("s",Y,15910250,a-e*2.52,1.6,1,.06,1,1)}if(t===6)for(let a=0;a<4;a++)n.add("s",vn,a%2?i.rock:i.rock2,e*(12+a*2.5),2+a*1.2,-6+a*4,3.5,4+a,3.2,0,a,0);return n.merge("s")}function gp(){let i=new je;for(let e of["position","normal","color"])i.setAttribute(e,new Pe([],3));return i}function Hv(i,e,t){let n=new Ft,s=e;n.add("s",Y,i.curb,s*5.53,.075,0,.26,.15,20.02),n.add("s",Y,i.verge,s*6.5,.06,0,1.7,.1,20.02),n.add("s",Y,i.walk,s*8.9,.1,0,3.1,.12,20.02);for(let a of[-7.5,-2.5,2.5,7.5])n.add("s",Y,i.walk2,s*8.9,.163,a,3.05,.01,.08);n.add("s",Y,ht(i.walk2,.9),s*10.5,.16,0,.15,.22,20.02);for(let a of[-5,5])n.add("s",Y,10852482,s*6.5,.25,a,1.5,.38,2.6),n.add("s",Y,ht(i.verge,.85),s*6.5,.45,a,1.3,.06,2.4);let r=Qn(400+t);return bi(n,s*6.5,-5,r,i,"round",.7),bi(n,s*6.5,5,r,i,"round",.65),t%2===0?(n.add("s",zt,i.lamp,s*6.3,3.4,0,.07,6.8,.07),n.add("s",Y,i.lamp,s*5.75,6.75,0,1.2,.09,.1),n.add("s",Y,16774102,s*5.25,6.66,0,.55,.1,.36)):(n.add("s",Y,4874608,s*9.9,.65,-3,.5,1.1,.5),n.add("s",Y,3108712,s*7.9,.5,4,.5,.6,1.8),n.add("s",Y,9071439,s*7.9,.85,4,.5,.06,1.9)),t===3&&(n.add("s",Y,14673640,s*9.7,1.3,-1,.06,2.4,3.6),n.add("s",Y,6066096,s*9.65,1.3,-1,.04,2.2,3.4),n.add("s",Y,i.lamp,s*9.7,2.55,-1,1.2,.08,3.8)),n.merge("s")}function Gv(i,e,t){let n=new Ft,s=e;n.add("s",Y,13226704,s*6.6,-.55,0,2.6,1.3,20.02),n.add("s",Y,ht(13226704,.82),s*3.2,-1.05,0,4.4,.3,20.02),n.add("s",Y,14870757,s*5.75,.42,0,.6,.84,20.02),n.add("s",Y,i.walk,s*7,.1,0,1.9,.12,20.02),n.add("s",Y,i.rail,s*7.95,1.05,0,.07,.07,20.02),n.add("s",Y,i.rail,s*7.95,.62,0,.05,.05,20.02);for(let r=-9;r<=9;r+=3)n.add("s",Y,i.rail,s*7.95,.6,r,.06,.95,.06);return n.add("s",Y,2920358,s*5.75,.86,0,.62,.05,20.02),t===0&&(n.add("s",Y,12240066,s*3.6,-6,0,2.2,10,2.6),n.add("s",Y,ht(12240066,.85),s*3.6,-3,0,3.4,.6,3.6)),t===1&&(n.add("s",zt,i.lamp,s*7.7,3.6,-4,.07,7.2,.07),n.add("s",Y,i.lamp,s*7,7.15,-4,1.5,.09,.1),n.add("s",Y,16774102,s*6.3,7.06,-4,.55,.1,.36)),n.merge("s")}function Vv(i,e,t){let n=new Ft,s=e;n.add("s",Y,i.curb,s*5.53,.075,0,.26,.15,20.02),n.add("s",Y,i.walk,s*7.4,.1,0,3.5,.12,20.02),n.add("s",Y,14209728,s*9.3,.35,0,.4,.6,20.02),n.add("s",Y,i.ground,s*12.5,-1.2,0,6,2.6,20.02);for(let r of[-6,4])bi(n,s*11,r,Qn(500+t),i,"palm",.85);return t%2===0&&(n.add("s",zt,i.lamp,s*6,3.4,2,.07,6.8,.07),n.add("s",Y,i.lamp,s*5.45,6.75,2,1.2,.09,.1),n.add("s",Y,16774102,s*4.95,6.66,2,.55,.1,.36)),n.merge("s")}function gr(i,e,t,n=0){let s=new Ft,r=e,a=14276300,o=16774354;s.add("s",Y,i.curb,r*5.6,.12,0,.4,.24,20.02),s.add("s",Y,a,r*6.25,3.2,0,.5,6.4,20.02),s.add("s",Y,2846598,r*5.99,1.1,0,.04,.5,20.02),s.add("s",Y,ht(a,.9),r*5.2,6.75,0,2.4,.5,20.02,0,0,r*.55),s.add("s",Y,ht(a,.78),r*2.3,7.45,0,4.8,.5,20.02);for(let c of[-7.5,-2.5,2.5,7.5])s.add("s",Y,o,r*4.6,7.08,c,.3,.08,3.4);s.add("s",Y,i.rock,r*12,4.5,0,11,9,20.02),s.add("s",Y,ht(i.verge??i.ground,.95),r*6,8.35,0,12.2,1.4,20.02);for(let c=0;c<3;c++)s.add("s",vn,c%2?i.rock2:i.rock,r*(12+c*3),9+c*1.5,-7+c*7,4.5,3+c,5.5,0,t+c,0);if(s.add("s",vn,i.verge??i.ground,r*8,9.6,3,5,1.6,6),n){let c=n*10;s.add("s",Y,13946818,r*2.6,8.9,c,5.6,2.4,1),s.add("s",Y,12959665,r*12,6,c+n*.2,12,12,1.2),s.add("s",Y,15909198,r*2.6,7.85,c+n*.52,5.2,.28,.06),s.add("s",Y,2372671,r*2.6,7.85,c+n*.55,1.2,.12,.04);for(let l=0;l<3;l++)s.add("s",vn,i.rock,r*(9+l*4),12+l,c-n*2,5,4,4,0,l,0)}return s.merge("s")}function fp(i,e,t,n){let s=new Ft,r=e,a=Qn(600+t+(r>0?50:0));s.add("s",Y,ht(i.road,1.3),r*6.4,.03,0,2,.06,20.02),s.add("s",Y,i.rail,r*7.45,.62,0,.06,.3,20.02),s.add("s",Y,ht(i.rail,.7),r*7.45,.62,0,.04,.08,20.04);for(let o=-8;o<=8;o+=4)s.add("s",Y,7042689,r*7.55,.35,o,.1,.7,.1),s.add("s",Y,12575743,r*7.42,.66,o,.02,.08,.18);for(let o of[-5,5])s.add("s",Y,15331058,r*6.9,.55,o,.12,1.1,.12),s.add("s",Y,15771200,r*6.9,.95,o,.13,.18,.13);if(n){for(let o=0;o<4;o++){let c=-7.5+o*5,l=7+a()*6;s.add("s",vn,o%2?i.rock:i.rock2,r*(10.8+a()),l*.45,c,3.2+a(),l,3.4,a(),a()*2,r*.15)}s.add("s",Y,ht(i.rock,.9),r*13,5,0,4,10,20.02),i.snow&&s.add("s",Y,i.snow,r*13.6,10.1,0,3.2,.3,20.02)}else s.add("s",Y,ht(i.ground,.85),r*11,-1.6,0,6,3,20.02,0,0,-r*.35);return s.merge("s")}var ds=8;function xp(i){let e=au[i],t={look:e,roadside:{},scenery:{"-1":[],1:[]}},n=(s,r,...a)=>Array.from({length:r},(o,c)=>({"-1":s(e,-1,c,...a),1:s(e,1,c,...a)}));if(i===0){t.roadside.street=n(Hv,4);for(let s of[-1,1])for(let r=0;r<ds;r++)t.scenery[s].push(Bv(e,s,r))}if(i===1){t.roadside.bridge=n(Gv,3),t.roadside.shore=n(Vv,2),t.roadside.tunnel=[{"-1":gr(e,-1,0),1:gr(e,1,0)}],t.roadside.portalIn=[{"-1":gr(e,-1,1,1),1:gr(e,1,1,1)}],t.roadside.portalOut=[{"-1":gr(e,-1,2,-1),1:gr(e,1,2,-1)}];for(let s of[-1,1])for(let r=0;r<ds;r++)t.scenery[s].push(kv(e,s,r))}if(i===2){t.roadside.cliff=n(fp,3,!0),t.roadside.drop=n(fp,3,!1);for(let s of[-1,1])for(let r=0;r<ds;r++)t.scenery[s].push(zv(e,s,r))}return t.empty=gp(),t.dispose=()=>{for(let s of Object.values(t.roadside))for(let r of s)for(let a of Object.values(r))a.dispose();for(let s of["-1","1"])t.scenery[s].forEach(r=>r.dispose());t.empty.dispose()},t}function yp(i,e,t={}){let n=e*20+10,s=l=>Ca(e,l,i),r=(t.tunnels||[]).find(l=>n>l.start&&n<l.end);if(i===0){let l=Math.floor(s(1)*4);return{roadside:{"-1":["street",l],1:["street",(l+2)%4]},scenery:{"-1":Math.floor(s(2)*ds),1:Math.floor(s(3)*ds)}}}if(i===1){if(r){let x=n-20<r.start,g=n+20>r.end,p=x?"portalIn":g?"portalOut":"tunnel";return{roadside:{"-1":[p,0],1:[p,0]},scenery:{"-1":-1,1:-1},tunnel:!0}}let l=Math.floor(n/240),h=Ca(l,7,i)<.38,u=Ca(l,8,i)<.5?-1:1,f=e%2===0?0:e%4===1?1:2,d=x=>h&&x===u?["shore",e%2]:["bridge",f],m=x=>h&&x===u?5+Math.floor(s(4+x)*3):Math.floor(s(5+x)*5);return{roadside:{"-1":d(-1),1:d(1)},scenery:{"-1":m(-1),1:m(1)},land:h?u:0}}let a=Math.floor(n/320),o=Ca(a,9,i)<.5?-1:1,c=Math.floor(s(1)*3);return{roadside:{"-1":[o===-1?"cliff":"drop",c],1:[o===1?"cliff":"drop",(c+1)%3]},scenery:{"-1":Math.floor(s(2)*ds),1:Math.floor(s(3)*ds)}}}function ou(i,e,t){if(i!==1)return[];let n=[...t].sort((a,o)=>a.start-o.start).reduce((a,o)=>{let c=a.at(-1);return c&&o.start<=c.end?c.end=Math.max(c.end,o.end):a.push({...o}),a},[]),s=[],r=240;for(let a of[...n,{start:e-320,end:1/0}])a.start-r>=220&&s.push({start:r,end:a.start}),r=Math.max(r,a.end);return s.filter((a,o)=>o%2===1).map(a=>{let o=Math.round((a.start+a.end)/2/20)*20;return{start:o-80,end:o+60}})}function _p(i){let e=new Fn(560,40,20),t=e.attributes.position,n=new Float32Array(t.count*3),s=new O(...i.sunPosition).normalize().multiply(new O(1,.6,-1)).normalize(),r=new Te(i.zenith),a=new Te(i.horizon),o=new Te(i.sunGlow),c=new Te,l=new O;for(let u=0;u<t.count;u++){l.fromBufferAttribute(t,u).normalize();let f=Math.max(0,l.y);c.copy(a).lerp(r,Math.pow(f,.55));let d=Math.max(0,l.dot(s));c.lerp(o,Math.pow(d,8)*.55+Math.pow(d,64)*.4),n.set([c.r,c.g,c.b],u*3)}e.setAttribute("color",new Ut(n,3));let h=new _e(e,new ct({vertexColors:!0,side:Ht,fog:!1,depthWrite:!1}));return h.renderOrder=-10,h.frustumCulled=!1,h}function vp(i,e){let t=new Ft,n=Qn(90+i),s=e.horizon,r=(o,c)=>Fv(o,s,c);if(i===0){for(let o=0;o<34;o++){let c=(o-17)*24+n()*10,l=22+n()*70,h=12+n()*16;t.add("s",Y,r(9348279,.55),c,l/2-4,-470-n()*20,h,l,10)}for(let o=0;o<26;o++){let c=(o-13)*30+n()*12,l=14+n()*40,h=14+n()*14;t.add("s",Y,r(10334912,.38),c,l/2-4,-420-n()*10,h,l,10)}t.add("s",zt,r(8361384,.4),-120,40,-430,3,90,3),t.add("s",xr,r(9348279,.4),-120,72,-430,8,6,8)}else if(i===1){for(let o=0;o<9;o++){let c=(o-4)*110+n()*40,l=80+n()*90,h=16+n()*30;t.add("s",vn,r(6262664,.5),c,-6,-470,l,h,30)}t.add("s",Y,r(4022130,.45),180,-1.5,-440,40,4,8),t.add("s",Y,r(14243647,.45),172,1.6,-440,6,3,8)}else for(let[o,c,l,h,u,f]of[[520,6122118,.62,12,90,110],[470,4871794,.42,14,60,80],[430,3950174,.25,16,35,55]])for(let d=0;d<h;d++){let m=(d-h/2)*(900/h)+n()*40,x=u+n()*f,g=90+n()*80;t.add("s",zn,r(c,l),m,x/2-8,-o-n()*20,g,x,30),l>.4&&t.add("s",zn,r(15199733,l*.8),m,x-8-x*.12,-o-n()*20+2,g*.25,x*.25,8)}let a=new _e(t.merge("s"),new ct({vertexColors:!0,fog:!1}));return a.renderOrder=-5,a}function Mp(i,e){let t=[["wheel","clock","stadium","twin"],["lighthouse","towers","ship","lighthouse"],["turbines","observatory","mast","turbines"]][i],n=[];for(let s=0,r=520;r<e-200;s++,r+=1150)n.push({kind:t[s%t.length],at:r,side:s%2?1:-1});return n}function bp(i,e,t){let n=new Ft,s=Qn(e.length*7+i);if(e==="wheel"){n.add("s",Y,14278626,0,0,0,30,1,12);for(let r of[-2,2])n.add("s",Y,13620954,-6,18,r,.8,36,.8,0,0,-.32),n.add("s",Y,13620954,6,18,r,.8,36,.8,0,0,.32);return n.add("s",zt,9279907,0,34,0,1.2,5,1.2,Math.PI/2,0,0),{static:n.merge("s"),offset:62}}if(e==="clock"){n.add("s",Y,15260095,0,18,0,7,36,7),n.add("s",Y,14140838,0,37,0,8,2,8),n.add("s",zn,7176076,0,43,0,6,9,6);for(let[r,a,o]of[[0,3.55,0],[3.55,0,Math.PI/2]])n.add("s",zt,16315106,r,30,a,2.4,.2,2.4,Math.PI/2,o,0),n.add("s",Y,2898245,r,30.6,a+(o?0:.12),.18,1.6,.05,0,o,0);return{static:n.merge("s"),offset:52}}if(e==="stadium"){n.add("s",new hn(32,28,16,24,1,!0),14212576,0,8,0),n.add("s",new _i(31,1.2,6,24),15226698,0,16,0,1,1,1,Math.PI/2,0,0);for(let r=0;r<8;r++){let a=r/8*Math.PI*2;n.add("s",Y,12371660,Math.cos(a)*30,22,Math.sin(a)*30,.8,12,.8)}return{static:n.merge("s"),offset:78}}if(e==="twin"){for(let r of[-7,7])n.add("s",Y,t.glass,r,32,0,10,64,10),n.add("s",Y,14674156,r,65,0,8,3,8),n.add("s",zt,13621726,r,72,0,.3,12,.3);return n.add("s",Y,13621726,0,42,0,6,2,3),{static:n.merge("s"),offset:70}}if(e==="lighthouse"){n.add("s",vn,t.rock,0,-3,0,14,6,12),n.add("s",zt,16052714,0,9,0,2.6,22,2.6);for(let r of[4,12])n.add("s",zt,14239547,0,r,0,2.62,3,2.62);return n.add("s",zt,2964036,0,21,0,3.2,.5,3.2),n.add("s",zt,16773569,0,22.6,0,1.8,2.6,1.8),n.add("s",zn,14239547,0,25,0,2.4,2.4,2.4),{static:n.merge("s"),offset:58,beacon:[0,22.6,0]}}if(e==="towers"){for(let r of[-1,1])n.add("s",Y,15002086,r*11.2,15,0,1.6,30,2.2),n.add("s",Y,15002086,r*11.2,-6,0,2.6,12,3.2);n.add("s",Y,14015961,0,28,0,24,1.6,2.2),n.add("s",Y,2920358,0,26.8,0,22,.5,2.3);for(let r of[-1,1])for(let a of[-1,1])for(let o=0;o<4;o++){let c=Math.hypot(22-o*2,18+o*6);n.add("s",Y,13624292,r*11,28-(22-o*2)/2,a*(18+o*6)/2,.12,c,.12,a*Math.atan2(18+o*6,22-o*2),0,0)}return{static:n.merge("s"),offset:0,overRoad:!0}}if(e==="ship"){n.add("s",Y,3099228,0,-2.4,0,9,3.4,44),n.add("s",Y,15001834,0,1.6,16,8,5,8);for(let r=0;r<5;r++)n.add("s",Y,t.accents[r%t.accents.length],0,.6,-14+r*6,8,3,5.5);return{static:n.merge("s"),offset:95}}if(e==="turbines"){for(let[r,a,o]of[[0,0,40],[30,-40,46],[-26,-70,38]])n.add("s",vn,t.rock,r,0,a,16,8,14),n.add("s",zt,15265264,r,o/2,a,.9,o,.9),n.add("s",Y,15265264,r,o,a+1.2,1.8,1.8,3.2);return{static:n.merge("s"),offset:92,rotors:[[0,40,-1.6],[30,46,-41.6],[-26,38,-71.6]]}}if(e==="observatory")return n.add("s",zn,t.rock,0,14,0,40,40,36),n.add("s",zn,t.snow,0,30,0,13,10,12),n.add("s",zt,14673386,0,36,0,4,4,4),n.add("s",xr,15856886,0,38.5,0,4,3.6,4),n.add("s",Y,4608606,0,39,1,1.2,4,6,0,0,.5),{static:n.merge("s"),offset:120};n.add("s",zn,t.rock,0,10,0,30,30,26),n.add("s",zt,12042440,0,40,0,.6,34,.6);for(let r=26;r<56;r+=6)n.add("s",Y,12042440,0,r,0,3,.2,.2);return{static:n.merge("s"),offset:105,beacon:[0,57.5,0]}}function Sp(){let i=new Ft,e=new xt(.9,16,.3).translate(0,8.4,0);for(let t=0;t<3;t++)i.add("s",e,15922679,0,0,0,1,1,1,0,0,t*Math.PI*2/3);return i.add("s",xr,15265264,0,0,.3,.9,.9,.9),e.dispose(),i.merge("s")}var tc=class{constructor(e,t){this.scene=e,this.car=t,this.level=0,this.uses=0,this.intensity=0,this.burstAge=2,this.matrix=new gt;let n=document.createElement("canvas");n.width=n.height=128;let s=n.getContext("2d"),r=s.createRadialGradient(64,64,1,64,64,64);r.addColorStop(0,"#ffffff"),r.addColorStop(.15,"#c8f7ffb0"),r.addColorStop(.48,"#57bfff35"),r.addColorStop(1,"#1a6cff00"),s.fillStyle=r,s.fillRect(0,0,128,128),this.texture=new yi(n),this.texture.colorSpace=Bt,this.exhaust=new qe,t.add(this.exhaust),this.jets=[],this.glows=[];for(let o of[-1,1]){let c=new _e(new Zn(.22,2.8,10),new ct({color:5819391,transparent:!0,opacity:.9,blending:_n,depthWrite:!1}));c.rotation.x=Math.PI/2,c.position.set(o*.69,.38,3.35),this.exhaust.add(c),this.jets.push(c);let l=new _e(new Zn(.09,1.8,10),new ct({color:15072511,transparent:!0,opacity:.95,blending:_n,depthWrite:!1}));l.rotation.x=Math.PI/2,l.position.set(o*.69,.38,3),this.exhaust.add(l);let h=new mi(new Yn({map:this.texture,color:7525887,transparent:!0,opacity:.75,blending:_n,depthWrite:!1}));h.position.set(o*.69,.42,2.6),h.scale.set(1.65,1.65,1),this.exhaust.add(h),this.glows.push(h)}this.exhaust.visible=!1,this.wake=new gi(new xt(.022,.022,1),new ct({color:10414847,transparent:!0,opacity:.7,blending:_n,depthWrite:!1}),48),this.wake.frustumCulled=!1,this.wake.visible=!1,this.wake.instanceMatrix.setUsage(ss),e.add(this.wake),this.rings=[];let a=new es(1.8,1.85,48);for(let o=0;o<3;o++){let c=new _e(a,new ct({color:8317183,transparent:!0,opacity:0,side:en,blending:_n,depthWrite:!1}));c.visible=!1,e.add(c),this.rings.push(c)}this.aura=new _e(new Nt(5.4,8),new ct({map:this.texture,color:5818879,transparent:!0,opacity:0,blending:_n,depthWrite:!1})),this.aura.rotation.x=-Math.PI/2,this.aura.visible=!1,e.add(this.aura)}update(e,t,n,s){this.state!==t&&(this.state=t,this.uses=t?.nitroUses||0,this.burstAge=2,this.intensity=0,this.wasActive=!1,this.previousLevel=0);let r=!!t?.nitroActive&&!s,a=Math.max(1,t?.nitroLevel||1),o=n.reduced,c=n.graphics==="battery";r&&(!this.wasActive||a!==this.previousLevel)&&(this.burstAge=0),this.wasActive=r,this.previousLevel=a,this.uses=t?.nitroUses||0,s||(this.burstAge+=e,this.intensity=It.damp(this.intensity,r?a/3:0,r?16:8,e)),this.level=r?a:0;let l=a===3?16765315:a===2?11972863:7004415;this.exhaust.visible=r;let h=o?1:1+Math.sin((t?.elapsed||0)*39)*.045;this.exhaust.scale.set(1+(a-1)*.12,1,1+(a-1)*.18),this.jets.forEach(d=>{d.material.color.setHex(l),d.scale.y=h}),this.glows.forEach(d=>d.material.color.setHex(l));let u=this.car.position.x,f=this.car.position.z;if(this.aura.visible=r,this.aura.position.set(u,.065,f+1),this.aura.rotation.z=-this.car.rotation.y,this.aura.material.color.setHex(l),this.aura.material.opacity=r?.16+a*.07:0,this.wake.visible=r&&!o,this.wake.count=c?12:48,this.wake.material.color.setHex(l),this.wake.visible){let d=(t.roadTravel||t.distance)*.08;for(let m=0;m<this.wake.count;m++){let x=((m*.618033+d)%1+1)%1,g=m%2?1:-1;this.matrix.position.set(u+g*(1.15+m%7*.2),.2+m%5*.14,f+2+x*12),this.matrix.scale.set(1,1,(.6+a*.5)*(1-x*.45)),this.matrix.rotation.set(0,0,g*.04),this.matrix.updateMatrix(),this.wake.setMatrixAt(m,this.matrix.matrix)}this.wake.instanceMatrix.needsUpdate=!0}this.rings.forEach((d,m)=>{let x=this.burstAge-m*.075,g=x/.5;d.visible=r&&!o&&!c&&g>=0&&g<1,d.visible&&(d.position.set(u,.8,f+2+g*8),d.scale.setScalar(.65+g*1.3),d.material.color.setHex(l),d.material.opacity=(1-g)*.32)})}};var Wv=13.2,nc=[3775609,14792518,12471902,5014984],Ep=[15317401,12155991,8410431,13802100],Xv=new xt(1,1,1),ic=new Kn(1,1),qv=new hn(.24,.29,.67,6),wp=new xt(1,1,1),ei=new gt,fs=new Te;function ps(i,e){let t=new gi(i,new Et({roughness:.85}),e);return t.instanceMatrix.setUsage(ss),t.frustumCulled=!1,t}function ms(i,e,t,n,s,r,a,o,c=0,l=0,h=0){ei.position.set(t,n,s),ei.scale.set(r,a,o),ei.rotation.set(c,l,h),ei.updateMatrix(),i.setMatrixAt(e,ei.matrix)}function gs(i,e,t){let n=e.map(([a,o,c,l,h,u])=>{let f=Xv.clone();return ei.position.set(a,o,c),ei.scale.set(l,h,u),ei.rotation.set(0,0,0),ei.updateMatrix(),f.applyMatrix4(ei.matrix)}),s=Jl(n);n.forEach(a=>a.dispose());let r=new _e(s,new Et({color:t,roughness:.76}));return r.receiveShadow=!0,i.add(r),r}var sc=class{constructor(e){this.root=new qe,e.add(this.root),this.stands=[],this.elapsed=0,this.proximity=0,this.state=void 0;for(let t=0;t<6;t++){let n=new qe,s=new qe,r=new qe;n.add(s,r),this.root.add(n);let a=gs(s,[[1.2,-.22,0,6,.4,15.8],[1.7,.05,0,2.5,.5,14.8],[3.4,.38,0,1.4,1.15,14.8]],11386556);gs(s,[[1.4,-1.5,-5,.45,2.6,.45],[1.4,-1.5,5,.45,2.6,.45]],5861760);let o=[[-1.8,.78,0,.11,.13,15.6],[-1.8,.3,0,.11,.07,15.6]];for(let v=-7.5;v<=7.5;v+=3)o.push([-1.8,.36,v,.12,.9,.12]);gs(s,o,13490134);let c=[];for(let v of[0,1])c.push([v*1.85+.7,.35+v*.56,0,.7,.12,13.5]);gs(s,c,2309714);for(let v=0;v<4;v++)gs(s,[[-1.9,.42,(v-1.5)*3.6,.07,.65,3.35]],nc[v]);let l=gs(s,[[-2.8,-.27,0,2,.3,15.8]],9546157);l.userData.bridgeDeck=!0;let h=ps(qv,8),u=ps(ic,8),f=ps(ic,8),d=ps(wp,16),m=ps(ic,16),x=ps(wp,16),g=ps(ic,16);for(let v of[h,u,f,d,m,x,g])r.add(v);for(let v=0;v<8;v++){h.setColorAt(v,fs.setHex(nc[(v+t)%4])),u.setColorAt(v,fs.setHex(Ep[(v*3+t)%4])),f.setColorAt(v,fs.setHex([4141099,5849145,3156786,10648136][v%4]));for(let b of[0,1])d.setColorAt(v*2+b,fs.setHex(nc[(v+t)%4])),m.setColorAt(v*2+b,fs.setHex(Ep[(v*3+t)%4])),x.setColorAt(v*2+b,fs.setHex(2504263)),g.setColorAt(v*2+b,fs.setHex(2371645))}let p=[];for(let v of[-7.2,7.2]){gs(s,[[4.3,2.5,v,.09,5,.09]],9611445);let b=new _e(new Nt(1.6,.8,5,2),new Et({color:nc[(t+(v>0?1:0))%4],side:en,roughness:.85}));b.position.set(3.55,4.25,v),b.userData.flat=b.geometry.attributes.position.array.slice(),s.add(b),p.push(b)}this.stands.push({group:n,platform:s,base:a,bodies:h,heads:u,hair:f,arms:d,hands:m,legs:x,eyes:g,flags:p,slot:t,station:-1})}}prepare(e,t){if(this.state===e&&this.arena===t)return;this.state=e,this.arena=t;let n=window.RallyCore,s=[];if(e&&!e.reviewLap){s.push(25);for(let r=1;r<e.tasks.length;r++){let a=n.taskZone(e.tasks[r-1]).end+100,o=n.taskZone(e.tasks[r]).start-140;o-a>25&&s.push((a+o)/2)}s.push(e.arena.length-15)}else e||s.push(65,230,470,710,950);this.stations=s.flatMap((r,a)=>[-1,1].map(o=>({at:r,side:o,id:a*2+(o>0?1:0)})));for(let r of this.stands)r.station=-1,r.lastCheer=0,r.group.visible=!1,r.base.material.color.setHex(t===2?7176597:t===1?11652809:13154211)}update(e,t,n,s,r,a,o,c){this.prepare(t,n),c||(this.elapsed+=e);let l=this.stations.findIndex(f=>f.at>=s-100),h=l<0?[]:this.stations.slice(l,l+6).map(f=>f.id),u=new Set(this.stands.filter(f=>h.includes(f.station)).map(f=>f.station));this.proximity=0;for(let f of this.stands){if(!h.includes(f.station)){let _=h.find(I=>!u.has(I));f.station=_??-1,_!=null&&u.add(_)}let d=this.stations[f.station];if(!d){f.group.visible=!1;continue}let m=d.at-s,x=(this.blocked||[]).some(_=>d.at>_.start-40&&d.at<_.end+40);if(f.group.visible=!x&&m>-85&&m<300,!f.group.visible)continue;let g=d.side;f.group.position.set(a(d.at)-r+g*Wv,0,4-m),f.group.rotation.y=-Math.atan((a(d.at+1)-a(d.at-1))/2),f.platform.scale.x=g;let p=Math.min(Math.abs(m),...(t?.rivals||[]).map(_=>Math.abs(_.at-d.at))),v=c?f.lastCheer||0:t&&t.status!=="countdown"?It.smoothstep(80-p,0,65):0;f.lastCheer=v,this.proximity=Math.max(this.proximity,It.clamp(1-Math.abs(m)/90,0,1));let b=o.graphics==="battery"?4:8;for(let _ of[f.bodies,f.heads,f.hair])_.count=b;for(let _ of[f.arms,f.hands,f.legs,f.eyes])_.count=b*2;for(let _=0;_<b;_++){let I=_>>2,S=g*(I*1.85+.7),A=(_%4-1.5)*3.3,R=.9+_%3*.07,y=.43+I*.56,M=this.elapsed*4.2+_*1.8+f.slot*.8,C=o.reduced?0:v*Math.max(0,Math.sin(M))*.07,U=y+.87*R+C,D=y+1.48*R+C;ms(f.bodies,_,S,U,A,R,R,R),ms(f.heads,_,S,D,A,.23*R,.27*R,.23*R),ms(f.hair,_,S+g*.025,D+.15*R,A,.235*R,.17*R,.24*R);for(let N=0;N<2;N++){let G=N?1:-1,V=o.reduced?0:Math.sin(M+(N?1.1:0))*.24,j=o.reduced?0:v*(_%3===0?1.85:1.35)+V*v,W=G*(.15+j),ce=A+G*.26*R,fe=.55*R,Ae=ce+G*Math.sin(j)*fe*.5;ms(f.arms,_*2+N,S,U-.04+Math.cos(j)*(-fe*.5),Ae,.15*R,fe,.16*R,W,0,0),ms(f.hands,_*2+N,S,U-.04-Math.cos(j)*fe,ce+G*Math.sin(j)*fe,.105*R,.105*R,.105*R),ms(f.legs,_*2+N,S,y+.29*R+C,A+G*.13*R,.17*R,.59*R,.2*R),ms(f.eyes,_*2+N,S-g*.222*R,D+.025*R,A+G*.08*R,.018,.025,.024)}}for(let _ of[f.bodies,f.heads,f.hair,f.arms,f.hands,f.legs,f.eyes])_.instanceMatrix.needsUpdate=!0;for(let _ of f.flags)if(!c){let I=_.geometry.attributes.position,S=_.userData.flat;for(let A=0;A<S.length;A+=3)I.array[A+2]=o.reduced?0:Math.sin(this.elapsed*3+S[A]*3+f.slot)*.09*(S[A]+.8)/1.6;I.needsUpdate=!0,_.geometry.computeVertexNormals()}}}};var rc=(i,e,t)=>Math.max(e,Math.min(t,i)),ac=class{constructor(e,t){this.car=t,this.state=null,this.stage=-1,this.lastImpact=null,this.spawnClock=0,this.deformable=t.children.filter(S=>S.isMesh&&S.userData.paint).map(S=>({mesh:S,base:S.geometry.attributes.position.array.slice()})),this.details=new qe,t.add(this.details);let n=t.userData.anchors||{windshield:{bottom:[.92,-.945],top:[1.46,-.365]},rearGlass:{bottom:[.92,1.18],top:[1.46,.63]},hood:{y:.965,back:-.57,front:-2.04,frontY:.75,w:.86},side:{x:1.076,y:.78,z:.86}},s=new xi({color:15661299,transparent:!0,opacity:.9,depthWrite:!1}),r=[];for(let S of[n.windshield,n.rearGlass])for(let[A,R,y]of[[-.24,.52,.27],[.36,.3,.15]]){let M=S===n.rearGlass,C=(D,N)=>[D,S.bottom[0]+N*(S.top[0]-S.bottom[0])+.012,S.bottom[1]+N*(S.top[1]-S.bottom[1])+(M?.014:-.014)],U=[[-1,-.22],[-.64,.85],[.18,1],[1,.37],[.83,-.65],[-.23,-1]];for(let D=0;D<U.length;D++){let[N,G]=U[D],V=C(A+N*y*.48,rc(R+G*y*.65,.05,.92)),j=C(A+N*y,rc(R+G*y*1.15,.05,.92));r.push(...C(A,R),...V,...V,...j),D%2===0&&r.push(...V,...C(A+N*y*.9+.06,rc(R+G*y*.35,.05,.92)))}}this.cracks=new Li(new je().setAttribute("position",new Pe(r,3)),s),this.cracks.renderOrder=2,this.details.add(this.cracks);let a=t.children.find(S=>S.userData.paint)?.material||new Et({color:14268004}),o=n.hood,c=o.back-o.front,l=o.frontY-o.y;this.hood=new qe,this.hood.position.set(0,o.y+.012,o.back),this.details.add(this.hood);let h=new je;h.setAttribute("position",new Pe([-o.w,0,0,o.w,0,0,o.w*1.04,l*.45+.02,-c*.62,o.w*.76,l+.06,-c,-o.w*.78,l+.03,-c,-o.w*1.05,l*.45+.01,-c*.62],3)),h.setIndex([0,1,2,0,2,5,5,2,3,5,3,4]),h.computeVertexNormals(),this.hoodPanel=new _e(h,a),this.hoodPanel.userData.paint=!0,this.hoodPanel.castShadow=!0,this.hood.add(this.hoodPanel);let u=new _e(h,new Et({color:2306363,roughness:.86,side:Ht}));this.hood.add(u),this.engineBay=new _e(new xt(o.w*1.7,.025,c*.75),new Et({color:1582380,roughness:.9})),this.engineBay.position.set(0,o.y+l*.5,o.back-c*.5),this.details.add(this.engineBay),this.loosePanel=new qe,this.loosePanel.position.set(n.side.x+.005,n.side.y,n.side.z),this.details.add(this.loosePanel);let f=new _e(new xt(.035,.28,.64),a);f.position.set(.04,-.1,.2),f.userData.paint=!0,this.loosePanel.add(f);let d=n.side.x+.022,m=n.side.y,x=new je().setAttribute("position",new Pe([d,m-.09,-.25,d,m-.04,.7,d,m-.17,.02,d,m-.11,.9,d,m+.02,.21,d,m+.05,.73],3));this.scrapes=new Li(x,new xi({color:12240584})),this.details.add(this.scrapes),this.smokeAnchor=[.35,o.frontY+.06,o.front+.25],this.particles=new qe,e.add(this.particles);let g=document.createElement("canvas");g.width=g.height=64;let p=g.getContext("2d"),v=p.createRadialGradient(32,32,0,32,32,32);v.addColorStop(0,"#d3dcdbbb"),v.addColorStop(.45,"#a4b4b76b"),v.addColorStop(1,"#73888d00"),p.fillStyle=v,p.fillRect(0,0,64,64);let b=new yi(g);b.colorSpace=Bt,this.smoke=Array.from({length:12},(S,A)=>{let R=new mi(new Yn({map:b,transparent:!0,depthWrite:!1,opacity:0}));return R.visible=!1,this.particles.add(R),{mesh:R,life:2,seed:A}});let _=new xt(.025,.025,.14),I=new ct({color:16766357});this.sparks=Array.from({length:10},(S,A)=>{let R=new _e(_,I);return R.visible=!1,this.particles.add(R),{mesh:R,life:1,seed:A}}),this.protection=new _e(new es(1.65,1.71,40),new ct({color:12052191,transparent:!0,opacity:.18,depthWrite:!1})),this.protection.rotation.x=-Math.PI/2,this.protection.scale.y=1.55,this.protection.visible=!1,e.add(this.protection),this.origin=new O,this.setStage(0)}setStage(e){if(this.stage!==e){this.stage=e;for(let{mesh:t,base:n}of this.deformable){let s=t.geometry.attributes.position;for(let r=0;r<n.length;r+=3){let a=rc((-n[r+2]-1.25)/.9,0,1),o=e*a;s.array[r]=n[r]*(1-o*.035),s.array[r+1]=n[r+1]-o*(.022+.025*Math.max(0,n[r])),s.array[r+2]=n[r+2]+o*(.065+.025*Math.sin(n[r]*5))}s.needsUpdate=!0,t.geometry.computeVertexNormals(),t.geometry.computeBoundingSphere()}this.cracks.visible=this.scrapes.visible=e>0,this.hood.visible=this.engineBay.visible=this.loosePanel.visible=e>=2}}reset(e){this.state=e,this.lastImpact=e?.lastImpact||null,this.spawnClock=0,this.setStage(e?.damage||0);for(let t of[...this.smoke,...this.sparks])t.mesh.visible=!1,t.life=2;this.hood.rotation.set(0,0,0),this.loosePanel.rotation.set(0,0,0),this.protection.visible=!1}update(e,t,n={},s=!1){this.state!==t&&this.reset(t);let r=t?.damage||0;this.setStage(r),this.car.updateWorldMatrix(!0,!1),this.origin.set(...this.smokeAnchor).applyMatrix4(this.car.matrixWorld);let a=!!n.reduced,o=n.graphics==="battery";if((t?.lastImpact||null)!==this.lastImpact&&(this.lastImpact=t.lastImpact,!a))for(let u of this.sparks){let f=u.seed*2.4;u.life=0,u.mesh.position.copy(this.origin),u.vx=Math.sin(f)*3.3,u.vy=1.3+u.seed%3*.5,u.vz=2+u.seed%4,u.mesh.visible=!0}if(r>=2){let u=t?.elapsed||0;this.hood.rotation.x=.17+(r===3?.06:0)+(a?0:Math.sin(u*17)*.012),this.hood.rotation.z=-.025,this.loosePanel.rotation.z=-.14+(a?0:Math.sin(u*15)*.035)}this.protection.visible=!!t&&t.invulnerable>0&&r<3&&!["paused","finished","failed","countdown"].includes(t.status),this.protection.position.set(this.car.position.x,.065,this.car.position.z);let c=t?.lastImpact?t.elapsed-t.lastImpact.at:1/0;if(c<.45&&!a&&!s){let u=Math.sin(c*42)*(1-c/.45);this.car.rotation.z+=u*.065,this.car.position.y+=Math.abs(u)*.045}if(a)for(let u of[...this.smoke,...this.sparks])u.mesh.visible=!1;if(s)return;let l=(t?.arena.speed||0)*(t?.speedFactor||0)*(t?.worldTimeScale??1),h=e*(t?.worldTimeScale??1);if(r>=2&&!a){this.spawnClock+=h;let u=o?.25:r===3?.065:.13;if(this.spawnClock>=u){this.spawnClock%=u;let f=this.smoke.find(d=>!d.mesh.visible);f&&(f.life=0,f.mesh.position.copy(this.origin),f.mesh.visible=!0,f.mesh.material.color.setHex(r===3?7175041:14871012))}}for(let u of this.smoke)if(u.mesh.visible){u.life+=h,u.mesh.visible=u.life<1.1&&u.mesh.position.z<13,u.mesh.position.x+=h*(.7+Math.sin(u.seed)*.2),u.mesh.position.y+=h*.65,u.mesh.position.z+=h*(l+1.2);let f=.25+u.life*.65;u.mesh.scale.setScalar(f),u.mesh.material.opacity=(r===3?.55:.3)*Math.pow(Math.max(0,1-u.life/1.1),1.5)}for(let u of this.sparks)u.mesh.visible&&(u.life+=h,u.vy-=h*9,u.mesh.position.x+=u.vx*h,u.mesh.position.y+=u.vy*h,u.mesh.position.z+=(u.vz+l)*h,u.mesh.rotation.x=u.seed+u.life*12,u.mesh.visible=u.life<.45&&u.mesh.position.y>.06);if(a)for(let u of[...this.smoke,...this.sparks])u.mesh.visible=!1}};var lu=new Map,cu=new Map,hu=new Map,$v=new sr({color:3495787,roughness:.06,metalness:.4,clearcoat:1,clearcoatRoughness:.04,envMapIntensity:1.6}),Rp=new Et({vertexColors:!0,roughness:.52,metalness:.32}),Yv=new Et({vertexColors:!0,roughness:.6,metalness:.28}),Zv=new ct({vertexColors:!0}),Kv=new ct({vertexColors:!0}),Jv=new Et({vertexColors:!0,roughness:.6,metalness:.05}),jv=new ct({color:9692671,transparent:!0,opacity:.85,blending:_n,depthWrite:!1}),Qv=new ct({color:16762519,transparent:!0,opacity:.85,blending:_n,depthWrite:!1}),Cp=[9413549,13225937,7307148,12035471,9281418,14209732,6253690];function Ip(i){return cu.has(i)||cu.set(i,new sr({color:i,roughness:.34,metalness:.22,clearcoat:.85,clearcoatRoughness:.16})),cu.get(i)}var eM=(i,e)=>new Te(i).multiplyScalar(e).getHex();function Mn(i,e=.7,t=0,n=0){let s=[i,e,t,n].join();return lu.has(s)||lu.set(s,new Et({color:i,roughness:e,metalness:t,emissive:n,emissiveIntensity:n?.7:0})),lu.get(s)}var Ia={arch:new _i(.48,.07,5,18,Math.PI),rock:new Kn(1,1),leaf:new Fn(1,10,5),carTrim:new Aa(1,1,1,2,.09),contact:new Nt(1,1),coach:new Aa(1,1,1,1,.09),box:new xt(1,1,1),sphere:new Fn(1,12,8),cone:new Zn(1,1,6),cylinder:new hn(1,1,1,18)};function ve(i,e,t,n,s,r,a=1,o=1,c=1,l=.7,h=0,u=0){let f=new _e(Ia[e],Mn(t,l,h,u));return f.position.set(n,s,r),f.scale.set(a,o,c),i.add(f),f}function ti(i,e=512,t=1024){let n=document.createElement("canvas");n.width=e,n.height=t,i(n.getContext("2d"),e,t);let s=new yi(n);return s.colorSpace=Bt,s}function Pp(i,e="#ffd976",t=""){return ti((n,s,r)=>{n.fillStyle="#192c43",n.fillRect(0,0,s,r),n.strokeStyle=e,n.lineWidth=12,n.strokeRect(12,12,s-24,r-24),n.textAlign="center",n.fillStyle=e,n.font="900 120px sans-serif",n.fillText(i,s/2,145),t&&(n.fillStyle="#fff",n.font="bold 28px sans-serif",n.fillText(t,s/2,207))},512,256)}function Lp(i,e,t){if(!hu.has(i)){let n=ti((s,r,a)=>{s.fillStyle="#11283b",s.fillRect(0,0,r,a),s.strokeStyle="#"+t.toString(16).padStart(6,"0"),s.lineWidth=12,s.strokeRect(7,7,r-14,a-14),s.fillStyle="#fff5dd",s.font="900 142px sans-serif",s.textAlign="center",s.fillText(e,r/2,163),s.font="bold 22px sans-serif",s.fillStyle="#a9c9d9",s.fillText("WORDRAMP",r/2,212)},192,256);hu.set(i,new Et({map:n,roughness:.56,metalness:.08}))}return hu.get(i)}var oc=class{constructor(e,t){this.container=e,this.viewport={width:innerWidth,height:innerHeight},this.renderer=t||new Zl({antialias:!0,powerPreference:"high-performance"}),this.preferences={graphics:"auto",reduced:!1},this.performanceBudget=Ac("auto",window.devicePixelRatio||1),this.renderer.setPixelRatio(this.performanceBudget.ratio),this.renderer.setSize(innerWidth,innerHeight),this.renderer.outputColorSpace=Bt,this.renderer.toneMapping=ol,this.renderer.toneMappingExposure=1.12,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Qo,e.append(this.renderer.domElement),this.scene=new na,this.camera=new Qt(52,innerWidth/innerHeight,.25,700),this.hemi=new xa(14216959,5467753,1.4),this.scene.add(this.hemi),this.sun=new rr(16769459,3.4),this.sunOffset=new O(-34,62,38),this.focusTint=new Te(10273972),this.sun.target.position.set(0,0,-14),this.sun.position.copy(this.sun.target.position).add(this.sunOffset),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(1024,1024),Object.assign(this.sun.shadow.camera,{left:-26,right:26,top:34,bottom:-34,near:10,far:170}),this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.035,this.sun.shadow.radius=3,this.scene.add(this.sun,this.sun.target),this.rim=new rr(10214640,1.05),this.rim.position.set(30,20,-50),this.scene.add(this.rim),this.player=this.makeCar(15973461,!0),this.scene.add(this.player),this.player.position.z=4,this.damageFx=new ac(this.scene,this.player),this.rivalCars=[],this.spectators=new sc(this.scene),this.trail=new qe,this.scene.add(this.trail);for(let n=0;n<12;n++){let s=ve(this.trail,"box",8440760,0,.08,0,.08,.025,.32,.4,0,5809551);s.visible=!1}this.boostFx=new tc(this.scene,this.player),this.exhaust=this.boostFx.exhaust,this.lookConfig={color:15973461,badge:0,trail:!1},this.shadow=new _e(new Nt(3.2,5.9),new ct({map:ti((n,s,r)=>{n.shadowColor="rgba(0,0,0,.62)",n.shadowBlur=22,n.fillStyle="rgba(0,0,0,.62)";let a=s*.2,o=r*.14,c=s*.6,l=r*.72,h=26;n.beginPath(),n.moveTo(a+h,o),n.arcTo(a+c,o,a+c,o+l,h),n.arcTo(a+c,o+l,a,o+l,h),n.arcTo(a,o+l,a,o,h),n.arcTo(a,o,a+c,o,h),n.fill()},128,256),transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2})),this.shadow.rotation.x=-Math.PI/2,this.shadow.position.set(0,.07,4),this.scene.add(this.shadow),this.nitroReadyGlow=new _e(new Nt(4.8,6.9),new ct({map:ti((n,s,r)=>{let a=n.createRadialGradient(s/2,r/2,0,s/2,r/2,s/2);a.addColorStop(0,"#71daff00"),a.addColorStop(.42,"#71daff00"),a.addColorStop(.7,"#71daff88"),a.addColorStop(1,"#71daff00"),n.fillStyle=a,n.fillRect(0,0,s,r)},128,128),transparent:!0,depthWrite:!1,opacity:.65})),this.nitroReadyGlow.rotation.x=-Math.PI/2,this.nitroReadyGlow.visible=!1,this.scene.add(this.nitroReadyGlow),this.world=new qe,this.scene.add(this.world),this.gates=new Map,this.gate=new qe,this.roadBoards=new qe,this.scene.add(this.roadBoards),this.signAnchors=[],this.promptAnchor=new O,this.traffic=[],this.elapsed=0,this.showcaseDistance=0,this.currentLane=0,this.index=-1,this.lastGate="",this.gateTextures=[],this.setup(0),this.look=new O,this.resize(),window.addEventListener("resize",()=>this.resize()),this.viewportObserver=typeof ResizeObserver=="function"?new ResizeObserver(()=>this.resize()):null,this.viewportObserver?.observe(e),this.renderer.domElement.addEventListener("webglcontextlost",n=>{n.preventDefault(),document.dispatchEvent(new Event("graphicslost"))}),this.renderer.domElement.addEventListener("webglcontextrestored",()=>location.reload())}setPreferences(e){let t=this.preferences.graphics!==e.graphics;this.preferences=e,t&&(this.performanceBudget=Ac(e.graphics,window.devicePixelRatio||1),this.renderer.setPixelRatio(this.performanceBudget.ratio),this.resize()),this.renderer.shadowMap.enabled=e.graphics!=="battery"}samplePerformance(e,t){Xu(this.performanceBudget,e,t)&&(this.renderer.setPixelRatio(this.performanceBudget.ratio),this.resize())}resize(){let e=Math.max(1,this.container.clientWidth||innerWidth),t=Math.max(1,this.container.clientHeight||innerHeight);this.resized&&e===this.viewport.width&&t===this.viewport.height||(this.viewport={width:e,height:t},this.resized=!0,this.renderer.setSize(e,t),this.camera.aspect=e/t,this.camera.updateProjectionMatrix())}makeCar(e,t=!1,n=t?"coupe":"sedan"){let s=up(n),r=s.anchors,a=new qe,o=[],c=[],l=[],h=new _e(s.paint,Ip(e));h.userData.paint=!0,a.add(h);let u=new _e(s.glass,$v);if(a.add(u),a.add(new _e(s.trim,Rp),new _e(s.lights,Zv)),s.stripes){let f=new _e(s.stripes,Rp);f.userData.stripes=!0,a.add(f)}for(let f of[-1,1]){for(let x of s.wheelSpec.z){let g=new qe,p=new qe;g.position.set(f*s.wheelSpec.x,s.wheelSpec.r,x),g.add(p),p.add(new _e(s.wheel,Yv)),a.add(g),g.userData.front=x<0,g.userData.spin=p,o.push(g)}c.push(ve(a,"coach",8862019,f*r.lamps.x,r.lamps.y,r.lamps.z,r.lamps.w,.11,.05,.2,.2,5969952));let d=new Ft;d.add("i",Ia.box,16757575,f*(r.lamps.x+r.lamps.w/2+.05),r.lamps.y,r.lamps.z+.01,.12,.08,.04),d.add("i",Ia.box,16757575,f*(r.head.x+.24),r.head.y,r.head.z+.06,.12,.06,.04);let m=new _e(d.merge("i"),Kv);m.userData.indicator=f,m.visible=!1,l.push(m),a.add(m)}return a.traverse(f=>{f.isMesh&&(f.castShadow=f!==u,f.receiveShadow=!0)}),a.userData={indicators:l,wheels:o,brakeLights:c,wheelAngle:0,anchors:r,kind:n},a.userData.hitBounds=new wn().setFromObject(a),a}animateCar(e,t,n,s){for(let r of e.userData.wheels||[])r.rotation.y=r.userData.front?n:0,r.userData.spin.rotation.x=t;for(let r of e.userData.brakeLights||[])r.material=s?Mn(16737636,.2,.2,16722217):Mn(8862019,.2,.2,5969952)}setCosmetics(e){if(this.lookConfig=e,!this.teamRoundel){this.teamRoundel=new _e(new Nt(.73,.97).rotateX(-Math.PI/2));let t=this.player.userData.anchors;this.teamRoundel.position.set(0,t.roofY+.004,t.roofZ),this.teamRoundel.scale.setScalar(.82),this.player.add(this.teamRoundel)}if(this.teamRoundel.visible=!!e.teamId,e.teamId&&(this.teamRoundel.material=Lp(e.teamId,e.teamId[0].toUpperCase(),e.color)),this.player.traverse(t=>{t.userData.paint&&(t.material=Ip(e.color))}),!this.hoodBadge){let t=this.player.userData.anchors.badge;this.hoodBadge=ve(this.player,"cylinder",16244641,0,t.y+.006,t.z,.2,.02,.2,.3,.6,5784864),this.hoodBadge.userData.cosmetic=!0;let n=new nr;for(let s=0;s<10;s++){let r=s*Math.PI/5-Math.PI/2,a=s%2?.065:.15;s===0?n.moveTo(Math.cos(r)*a,Math.sin(r)*a):n.lineTo(Math.cos(r)*a,Math.sin(r)*a)}n.closePath(),this.badgeStar=new _e(new pa(n),Mn(4017499,.3,.5)),this.badgeStar.rotation.x=-Math.PI/2,this.badgeStar.position.set(0,t.y+.02,t.z),this.player.add(this.badgeStar)}this.hoodBadge.visible=this.badgeStar.visible=e.badge>0,this.hoodBadge.material=Mn([16244641,11129550,15319923,13812460][e.badge]||16244641,.3,.6)}addContactShadow(e){this.contactMaterial||(this.contactMaterial=this.shadow.material.clone(),this.contactMaterial.opacity=.52);let t=new _e(Ia.contact,this.contactMaterial);t.rotation.x=-Math.PI/2,t.scale.set(3,5.4,1),t.position.y=.055,this.scene.add(t),e.userData.contactShadow=t}placeContactShadow(e){let t=e.userData.contactShadow;t&&(t.visible=e.visible,t.position.set(e.position.x,e.position.y+.055,e.position.z),t.rotation.z=-e.rotation.y)}syncRivals(e){if(this.rivalState!==e){for(let t of this.rivalCars)t.userData.contactShadow&&this.scene.remove(t.userData.contactShadow),this.scene.remove(t),t.traverse(n=>{n.isMesh&&n.userData.ownGeometry&&n.geometry.dispose()});this.rivalCars=[],this.rivalState=e;for(let t of e?.rivals||[]){let n=this.makeCar(t.color,!1,"gt"),s=n.userData.anchors;n.userData.rival=t;let r=new _e(new Nt(.62,.8).rotateX(-Math.PI/2),Lp("rival"+t.id,String(t.id+2).padStart(2,"0"),t.color));r.userData.ownGeometry=!0,r.position.set(0,s.roofY+.004,s.roofZ),n.add(r);let a=new qe;for(let o of[-1,1]){let c=ve(a,"cone",t.id?16762519:9692671,o*s.exhaust[0],s.exhaust[1],s.exhaust[2]+.5,.11,.85,.11,.2,0,t.id?16750168:4569327);c.rotation.x=-Math.PI/2,c.material=t.id?Qv:jv}a.visible=!1,n.add(a),n.userData.nitroExhaust=a,this.scene.add(n),this.addContactShadow(n),this.rivalCars.push(n)}}}rivalProjection(){return this.camera.updateMatrixWorld(),this.rivalCars.map(e=>{let t=e.position.clone();return t.y+=2.5,t.project(this.camera),{id:e.userData.rival.id,x:(t.x*.5+.5)*this.viewport.width,y:(-.5*t.y+.5)*this.viewport.height,visible:e.visible&&t.z>-1&&t.z<1&&e.position.z<-3}})}ribbon(e,t,n,s,r=.13){let a=[];for(let h=0;h<t.length-1;h++){let u=t[h],f=t[h+1];a.push(u.x-n/2,r,-u.at,u.x+n/2,r,-u.at,f.x-n/2,r,-f.at,f.x-n/2,r,-f.at,u.x+n/2,r,-u.at,f.x+n/2,r,-f.at)}let o=new je;o.setAttribute("position",new Pe(a,3)),o.computeVertexNormals();let c=[];for(let h=0;h<a.length;h+=3)c.push(a[h]/10.8,-a[h+2]/20);o.setAttribute("uv",new Pe(c,2));let l=new _e(o,s===this.palette.road?this.asphaltMaterial:Mn(s));return l.receiveShadow=!0,e.add(l),l}setup(e){if(e===this.index)return;this.index=e;let t=au[e];this.arenaLook=t,this.palette={road:t.road};for(let l of this.segments||[])for(let h of[...l.userData.roadSurfaces,...l.userData.roadside])h.geometry.dispose();for(let l of this.landmarks||[])l.group.traverse(h=>{h.isMesh&&h.geometry!==this.rotorGeometry&&h.geometry.dispose()});this.world.traverse(l=>{l.isMesh&&l.userData.ownGeometry&&l.geometry.dispose()}),this.world.clear(),this.kit?.dispose();for(let l of[this.roadTexture,this.asphaltTexture,this.reflectionTexture,this.waterNormal,this.cloudTexture])l?.dispose();for(let l of[this.roadMaterial,this.asphaltMaterial,this.waterMaterial,this.sceneryMaterial])l?.dispose();this.rain&&(this.scene.remove(this.rain),this.rain.geometry.dispose(),this.rain.material.dispose(),this.rain=null),this.waterNormal=null,this.segments=[],this.courseState=void 0,this.kit=xp(e),this.scene.fog=new ta(t.fog,t.fogNear,t.fogFar),this.scene.background=new Te(t.horizon),this.sun.color.set(t.sun),this.sun.intensity=t.sunIntensity,this.sunOffset.set(...t.sunPosition),this.hemi.color.set(t.hemiSky),this.hemi.groundColor.set(t.hemiGround),this.hemi.intensity=t.hemi,this.rim.color.set(t.rim),this.rim.intensity=t.rimIntensity,this.renderer.toneMappingExposure=t.exposure;let n=_p(t);n.userData.ownGeometry=!0,this.world.add(n),this.skyDome=n;let s=vp(e,t);s.userData.ownGeometry=!0,this.world.add(s);let r=l=>"#"+new Te(l).getHexString();this.reflectionTexture=ti((l,h,u)=>{let f=l.createLinearGradient(0,0,0,u);f.addColorStop(0,r(t.zenith)),f.addColorStop(.46,r(t.horizon)),f.addColorStop(.5,r(t.sunGlow)),f.addColorStop(.54,r(t.hemiGround)),f.addColorStop(1,r(eM(t.hemiGround,.5))),l.fillStyle=f,l.fillRect(0,0,h,u);let d=l.createRadialGradient(h*.3,u*.32,1,h*.3,u*.32,30);d.addColorStop(0,"#fff8e4"),d.addColorStop(1,"#fff8e400"),l.fillStyle=d,l.fillRect(0,0,h,u)},256,128),this.reflectionTexture.mapping=ar,this.scene.environment=this.reflectionTexture,this.scene.environmentIntensity=e===2?.62:.7;let a=Math.min(8,this.renderer.capabilities?.getMaxAnisotropy?.()||1);this.asphaltTexture=ti((l,h,u)=>{l.fillStyle=r(t.road),l.fillRect(0,0,h,u);let f=window.RallyCore.random(101+e);for(let d=0;d<6e3;d++){l.fillStyle=d%3?"#ffffff07":"#0000000c";let m=d%7?2:3;l.fillRect(f()*h,f()*u,m,m)}for(let d of[1,3,5])for(let m of[-.045,.045]){let x=h*(d/6+m),g=l.createLinearGradient(x-14,0,x+14,0);g.addColorStop(0,"#00000000"),g.addColorStop(.5,e===2?"#ffffff0d":"#0000000f"),g.addColorStop(1,"#00000000"),l.fillStyle=g,l.fillRect(x-14,0,28,u)}l.strokeStyle="#00000024",l.lineWidth=2;for(let d=0;d<5;d++){l.beginPath();let m=f()*h,x=f()*u;l.moveTo(m,x);for(let g=0;g<5;g++)m+=(f()-.5)*40,x+=f()*30,l.lineTo(m,x);l.stroke()}},512,512),this.asphaltTexture.wrapS=this.asphaltTexture.wrapT=Pi,this.asphaltTexture.anisotropy=a,this.asphaltMaterial=new Et({map:this.asphaltTexture,roughness:t.roadRough,metalness:e===2?.18:.02}),this.roadTexture=ti((l,h,u)=>{l.drawImage(this.asphaltTexture.image,0,0,h,u),l.strokeStyle=e===2?"#e6e9f4":"#f1ede0",l.lineWidth=7,l.beginPath(),l.moveTo(16,0),l.lineTo(16,u),l.moveTo(h-16,0),l.lineTo(h-16,u),l.stroke(),l.setLineDash([88,72]),l.lineWidth=6;for(let f of[h/3,h*2/3])l.beginPath(),l.moveTo(f,0),l.lineTo(f,u),l.stroke()},512,1024),this.roadTexture.wrapS=this.roadTexture.wrapT=Pi,this.roadTexture.anisotropy=a;let o=new Et({map:this.roadTexture,roughness:t.roadRough,metalness:e===2?.18:.02});if(this.roadMaterial=o,this.sceneryMaterial=new Et({vertexColors:!0,roughness:e===2?.74:.88,metalness:0}),e===1){this.waterNormal=ti((h,u,f)=>{h.fillStyle="#8080ff",h.fillRect(0,0,u,f);for(let d=0;d<f;d+=4)for(let m=0;m<u;m+=4){let x=Math.sin(m*.07+Math.sin(d*.08)*2),g=Math.cos(d*.13+Math.sin(m*.04));h.fillStyle=`rgb(${128+Math.round(x*28)},${128+Math.round(g*22)},245)`,h.fillRect(m,d,4,4)}},256,256),this.waterNormal.colorSpace=kn,this.waterNormal.wrapS=this.waterNormal.wrapT=Pi,this.waterNormal.repeat.set(40,40),this.waterMaterial=new Et({color:t.water,roughness:.16,metalness:.18,normalMap:this.waterNormal,normalScale:new ue(.5,.5),envMapIntensity:1.3});let l=new _e(new Nt(1600,1100).rotateX(-Math.PI/2),this.waterMaterial);l.position.set(0,-3.3,-260),l.userData.ownGeometry=!0,l.receiveShadow=!0,this.world.add(l)}else{let l=new _e(new xt(1100,1,900),new Et({color:t.ground,roughness:1}));l.position.set(0,-.56,-230),l.userData.ownGeometry=!0,l.receiveShadow=!0,this.world.add(l)}for(let l=0;l<19;l++){let h=new qe,u=new _e(new Nt(10.8,20,1,8).rotateX(-Math.PI/2),o);u.position.y=.02,u.receiveShadow=!0,h.add(u);let f=new _e(new Nt(10.8,20,1,8).rotateX(-Math.PI/2),this.asphaltMaterial);f.position.y=.02,f.receiveShadow=!0,h.add(f),h.userData.roadSurfaces=[u,f],h.userData.flexSurfaces=[u,f],h.userData.roadside=[],h.userData.scenery=[];for(let d of[-1,1]){let m=Object.values(this.kit.roadside)[0][0][d],x=new _e(m.clone(),this.sceneryMaterial);x.userData.side=d,x.receiveShadow=!0,x.userData.flatPositions=m.attributes.position.array,x.userData.flatNormals=m.attributes.normal.array,h.add(x),h.userData.roadside.push(x),h.userData.flexSurfaces.push(x);let g=new _e(this.kit.empty,this.sceneryMaterial);h.add(g),h.userData.scenery.push({mesh:g,group:g,side:d})}for(let d of[u,f])d.userData.flatPositions=d.geometry.attributes.position.array.slice(),d.userData.flatNormals=d.geometry.attributes.normal.array.slice();this.world.add(h),this.segments.push(h)}this.landmarks=[],this.rotorGeometry??=Sp();for(let l of Mp(e,window.RallyCore.ARENAS[e].length)){let h=bp(e,l.kind,t),u=new qe,f=new _e(h.static,this.sceneryMaterial);u.add(f);let d=(h.rotors||[]).map(([m,x,g])=>{let p=new _e(this.rotorGeometry,this.sceneryMaterial);return p.position.set(m,x,g),u.add(p),p});u.visible=!1,this.world.add(u),this.landmarks.push({...l,...h,group:u,rotors:d})}this.cloudTexture=ti((l,h,u)=>{for(let f=0;f<9;f++){let d=h*(.2+.6*Math.random()),m=u*(.45+.2*Math.random()),x=h*(.12+.12*Math.random()),g=l.createRadialGradient(d,m,1,d,m,x);g.addColorStop(0,"#ffffffcc"),g.addColorStop(1,"#ffffff00"),l.fillStyle=g,l.fillRect(0,0,h,u)}},256,128),this.clouds=[];let c=window.RallyCore.random(921+e);for(let l=0;l<(e===2?14:9);l++){let h=new mi(new Yn({map:this.cloudTexture,color:e===2?7174291:16777215,opacity:e===2?.85:e===1?.5:.62,transparent:!0,fog:!1,depthWrite:!1})),u=e===2?120+c()*90:70+c()*70;h.scale.set(u,u*.36,1),h.position.set((c()-.5)*620,e===2?48+c()*30:70+c()*50,-300-c()*170),h.renderOrder=-8,h.userData.drift=.6+c()*.8,this.world.add(h),this.clouds.push(h)}if(e===2){let l=new gi(new xt(.018,1.1,.018),new ct({color:13096172,transparent:!0,opacity:.2,depthWrite:!1,fog:!1}),320);l.frustumCulled=!1,l.instanceMatrix.setUsage(ss),l.userData.drops=Array.from({length:320},(h,u)=>[(c()-.5)*44,c()*20,-c()*70+4,.7+c()*.6]),this.scene.add(l),this.rain=l}this.tunnels=ou(e,window.RallyCore.ARENAS[e].length,[]),this.clearGate()}edge(e,t){let n=this.apronWidth(e);for(let s of this.forkRoutes||[]){if(e<s.bounds.start||e>s.bounds.end)continue;let r=s.routes[0],a=c=>(c=It.clamp(c,0,1),c*c*c*(10+c*(-15+6*c))),o;if(e<r.start)o=3.35+8.2-2.8*a((e-s.bounds.start)/30);else if(e>r.end)o=3.35+5.4+2.8*a((e-r.end)/40);else{let c=s.routes.map(l=>l.lane*3.35+window.RallyCore.routeOffset(l,e));o=t>0?Math.max(...c)+5.4:5.4-Math.min(...c)}n=Math.max(n,o)}return n}rebuildChunk(e,t,n){let s=yp(this.index,t,{tunnels:this.tunnels});e.userData.plan=s;for(let[l,h]of e.userData.roadSurfaces.entries())h.geometry.dispose(),h.geometry=this.mainRoadGeometry(n,l===1),h.userData.flatPositions=h.geometry.attributes.position.array.slice(),h.userData.flatNormals=h.geometry.attributes.normal.array.slice();for(let l of e.userData.roadside){let[h,u]=s.roadside[l.userData.side],f=this.kit.roadside[h],d=f[u%f.length][l.userData.side];l.geometry.dispose(),l.geometry=d.clone(),l.userData.flatPositions=d.attributes.position.array,l.userData.flatNormals=d.attributes.normal.array,l.castShadow=!!s.tunnel}let r={"-1":5.4,1:5.4};for(let l=-10;l<=10;l+=2.5)for(let h of[-1,1])r[h]=Math.max(r[h],this.sceneryEdge(n-l,h));for(let l of e.userData.scenery){let h=s.scenery[l.side];l.mesh.geometry=h<0?this.kit.empty:this.kit.scenery[l.side][h],l.mesh.position.x=l.side*(r[l.side]+5.6)}let a=e.rotation.y,o=Math.cos(a),c=Math.sin(a);for(let l of e.userData.flexSurfaces){let h=l.geometry.attributes.position,u=l.geometry.attributes.normal,f=l.userData.flatPositions,d=l.userData.flatNormals,m=l.userData.side||0;for(let x=0;x<f.length;x+=3){let g=f[x+2],p=n-g,v=f[x]+(m?m*(this.edge(p,m)-5.4):0)+this.curve(p)-this.curve(n);h.array[x]=o*v-c*g,h.array[x+1]=f[x+1],h.array[x+2]=c*v+o*g;let b=d[x],_=d[x+1],I=d[x+2]+(this.curve(p+.1)-this.curve(p-.1))/.2*b,S=Math.hypot(b,_,I)||1;u.array[x]=(o*b-c*I)/S,u.array[x+1]=_/S,u.array[x+2]=(c*b+o*I)/S}h.needsUpdate=!0,u.needsUpdate=!0,l.geometry.computeBoundingSphere()}}sceneryEdge(e,t){return Math.max(this.edge(e,t),(this.coasterRanges||[]).some(n=>e>n.start&&e<n.end)?27:0)}curve(e){return window.RallyCore.courseCurve(this.index,e)}heading(e,t){let n=window.RallyCore;return-Math.atan((this.curve(e+1)+n.routeOffset(t,e+1)-this.curve(e-1)-n.routeOffset(t,e-1))/2)}prepareCourse(e){if(this.courseState===e&&this.courseRevision===e?.taskRevision)return;this.courseState=e,this.courseRevision=e?.taskRevision,this.roadReservations=[],this.forkRanges=[],this.apronRanges=[];for(let a of e?.tasks||[]){let o=window.RallyCore.taskZone(a);this.roadReservations.push({start:o.start-80,end:o.end+80}),this.apronRanges.push({start:o.start-70,fullStart:o.start-30,fullEnd:o.end+25,end:o.end+80}),a.kind==="junction"&&this.forkRanges.push(jl(window.RallyCore.makeRoute(e,a,0,!0,!0)))}let t=window.RallyCore;this.forkRoutes=(e?.tasks||[]).filter(a=>a.kind==="junction").map(a=>{let o=t.groundRoutes(e,a);return{routes:o,bounds:jl(o[0])}}),this.coasterRanges=(e?.tasks||[]).filter(a=>a.coaster).map(a=>({start:a.at-40,end:a.at+a.coaster.span+30}));let n=(e?.tasks||[]).map(a=>t.taskZone(a)),s=n.map(a=>({start:a.start-80,end:a.reach+80})),r=e?.arena?.length??t.ARENAS[this.index].length;s.push({start:r-260,end:r+200}),this.tunnels=ou(this.index,r,e?s:[]),this.spectators.blocked=this.tunnels;for(let a of this.segments)a.userData.curveIndex=void 0}apronWidth(e){let t=s=>(s=It.clamp(s,0,1),s*s*s*(10+s*(-15+6*s))),n=5.4;for(let s of this.apronRanges||[]){let r=Math.min(t((e-s.start)/(s.fullStart-s.start)),t((s.end-e)/(s.end-s.fullEnd)));n=Math.max(n,5.4+6.15*r)}return n}mainRoadGeometry(e,t=!1){let n=e-10,s=e+10,r=new Set;for(let d=0;d<=8;d++)r.add(n+d*2.5);for(let d of this.forkRanges||[])for(let m of[d.start,d.end])m>n&&m<s&&r.add(m);let a=[...r].sort((d,m)=>d-m),o=[],c=[],l=[],h=[],u=t?4:2;a.forEach(d=>{let m=this.apronWidth(d),x=t?[-m,-5.4,5.4,m]:[-5.4,5.4];for(let g of x)o.push(g,0,e-d),h.push(0,1,0),c.push(t?g/10.8:g<0?0:1,d/20)});for(let d=0;d<a.length-1;d++){let m=(a[d]+a[d+1])/2;if(!(this.forkRanges?.some(x=>m>x.start&&m<x.end)||t&&this.apronWidth(m)<5.40001))for(let x=0;x<u;x+=2){let g=d*u+x;l.push(g,g+1,g+u,g+u,g+1,g+u+1)}}let f=new je;return f.setAttribute("position",new Pe(o,3)),f.setAttribute("normal",new Pe(h,3)),f.setAttribute("uv",new Pe(c,2)),f.setIndex(l),f}clearGate(){for(let e of this.gates.values())this.disposeGate(e);this.gates.clear(),this.gate=new qe,this.lastGate="",this.preparedState=null}disposeGate(e){this.scene.remove(e),e.traverse(t=>{(t.isMesh||t.isLine)&&!Object.values(Ia).includes(t.geometry)&&t.geometry.dispose()}),(e.userData.textures||[]).forEach(t=>t.dispose()),(e.userData.ownMaterials||[]).forEach(t=>t.dispose())}makePerson(e,t,n){let s=new qe;s.scale.setScalar(1.5);let r=[13935748,12947056,14858650,10974296][t%4],a=[7450538,12227686,9346240,11763341][t%4];ve(s,"box",a,0,1.48,0,.65,.84,.38),ve(s,"sphere",r,0,2.18,0,.29,.32,.27),ve(s,"sphere",4800059,0,2.39,-.02,.3,.15,.27);for(let h of[-1,1]){let u=ve(s,"box",3426140,h*.19,.66,0,.23,.75,.25);u.userData.leg=h,ve(s,"box",2372938,h*.19,.2,.07,.28,.2,.43);let f=ve(s,"box",a,h*.39,1.44,.12,.2,.72,.23);f.rotation.z=h*.18,ve(s,"sphere",r,h*.42,1.16,.25,.12,.12,.12),ve(s,"sphere",2503746,h*.1,2.21,.25,.036,.036,.016)}let o=ti((h,u,f)=>{h.fillStyle="#f4e9d0",h.fillRect(0,0,u,f),h.strokeStyle="#44696b",h.lineWidth=12,h.strokeRect(7,7,u-14,f-14),h.textAlign="center",h.fillStyle="#20394c",h.font="bold "+(e.length>16?36:50)+"px sans-serif",h.fillText(e,u/2,145,u-40)},512,256);n.userData.textures.push(o);let c=new ct({map:o});n.userData.ownMaterials.push(c);let l=new _e(new Nt(1.45,.72),c);return l.position.set(0,1.22,.31),s.add(l),s.userData.personIndex=t,s.userData.signPoint=new O(0,1.22,.34),s}buildCoaster(e,t,n){let s=window.RallyCore,r=s.makeRoute(n,t,t.correctIndex,!0),a=!!this.preferences.reduced,o=e.userData.coaster;o&&(e.remove(o.group),o.group.traverse(x=>{x.isMesh&&x.geometry.dispose()}));let c=ap({route:r,curve:x=>this.curve(x),offset:s.routeOffset,height:s.coasterHeight,origin:t.at,reduced:a}),l=x=>this.curve(x)-this.curve(t.at),h=cp(c,l,(x,g)=>this.edge(x,g)),u=new qe,f=[],d=new Te,m=40;for(let x=r.start;x<r.end-1;x+=m){let g=c.filter(y=>y.at>=x-1e-6&&y.at<=x+m+2.01&&y.y>.12),p=[],v=(y,M)=>{let C=y.positions.length/3,U=new Float32Array(C*3);d.setHex(M);for(let D=0;D<C;D++)U.set([d.r,d.g,d.b],D*3);p.push({...y,colours:U})};if(g.length>1)for(let y of[0,r.side*3.2]){v(jh(g,op,y),4018019);for(let M of[-1.2+.12,1.2-.12])v(jh(g,lp(M),y),15226698)}let b=(y,M,C,U,D,N)=>{let G=[y,M],V=[C,U],j=[D-N/2,D+N/2],W=[];for(let ce of G)for(let fe of V)for(let Ae of j)W.push(ce,fe,Ae);return{positions:W,indices:[0,1,3,0,3,2,4,6,7,4,7,5,0,4,5,0,5,1,2,3,7,2,7,6,0,2,6,0,6,4,1,5,7,1,7,3]}};for(let y of h.filter(M=>M.at>=x&&M.at<x+m))if(y.kind==="column")v(b(y.x-.32,y.x+.32,0,y.top,y.z,.64),15855592);else{for(let M of[y.left,y.right])v(b(M-.3,M+.3,0,y.top,y.z,.6),15855592);v(b(y.left-.3,y.right+.3,y.top-.55,y.top,y.z,.7),15855592)}if(!p.length)continue;let _=[],I=[],S=[];for(let y of p){let M=_.length/3;_.push(...y.positions),I.push(...y.colours);for(let C of y.indices)S.push(C+M)}let A=new je;A.setAttribute("position",new Pe(_,3)),A.setAttribute("color",new Pe(I,3)),A.setIndex(S),A.computeVertexNormals();let R=new _e(A,this.coasterMaterial||=new Et({vertexColors:!0,roughness:.48,metalness:.2,side:en,flatShading:!0}));R.castShadow=this.preferences.graphics!=="battery",R.visible=!1,R.scale.y=.001,u.add(R),f.push({mesh:R,start:x,end:x+m,delay:(x-r.start)/(r.end-r.start)*.7,rise:0})}if(!o){let x=new qe;for(let _ of[-1.4,1.4])ve(x,"cylinder",5795967,_,3.2,0,.12,6.4,.12);let g=Pp("SKY COASTER","#ffd976","THE RIGHT ANSWER RIDES IT");e.userData.textures.push(g);let p=new ct({map:g});e.userData.ownMaterials.push(p);let v=new _e(new Nt(5.4,2.7),p);v.position.set(0,5.4,.15),x.add(v);let b=t.at-130;x.position.set(this.curve(b)-this.curve(t.at)+this.edge(b,1)+3.2,0,130),x.rotation.y=-.35,e.add(x)}e.add(u),e.userData.coaster={group:u,pieces:f,route:r,reduced:a,revealedAt:o?.revealedAt??null}}updateCoaster(e,t,n){let s=e.userData.coaster;if(!s)return;s.reduced!==!!this.preferences.reduced&&this.buildCoaster(e,t,n);let r=e.userData.coaster;if(r.revealedAt==null&&t.completed&&(r.revealedAt=this.clock),r.revealedAt==null)return;let a=this.clock-r.revealedAt;for(let o of r.pieces){let c=It.clamp((a-o.delay)/.32,0,1);o.rise=this.preferences.reduced?1:c*c*(3-2*c),o.mesh.visible=o.rise>0,o.mesh.scale.y=Math.max(.001,o.rise)}}rideRise(e,t){let n=this.gates.get(e.taskId)?.userData.coaster;if(!n||n.revealedAt==null)return 0;let s=n.pieces.find(r=>t>=r.start&&t<r.end);return s?s.rise:1}ridePose(e,t,n=0,s=null){if(!e?.coaster)return null;let r=window.RallyCore,a=!!this.preferences.reduced,o=this.rideRise(e,t),c=f=>Kh(r.coasterHeight(e,f),a)*o,l=f=>this.curve(f)+e.lane*3.35+r.routeOffset(e,f),h=Jh(l,t,a)*o,u=0;if(o<1&&s){let f=s.tasks.find(d=>d.id===e.taskId);f&&(u=(r.routeOffset(r.makeRoute(s,f,f.correctIndex,!0,!0),t)-r.routeOffset(e,t))*(1-o))}return{y:c(t)+rp(h,n-e.side*3.2/2),pitch:Math.atan((c(t+1)-c(t-1))/2),bank:h,slope:(c(t+1)-c(t-1))/2,dx:u}}makeGate(e,t){let n=new qe;if(n.userData={task:e,textures:[],ownMaterials:[],barriers:[],repairSlabs:[]},e.kind==="finish"){for(let o of[-5.7,5.7])ve(n,"box",16504187,o,3,0,.45,6,.45);ve(n,"box",16767095,0,6,0,12,.8,.45);let s=Pp("FINISH","#ffe296");n.userData.textures.push(s);let r=new ct({map:s});n.userData.ownMaterials.push(r);let a=new _e(new Nt(5,2.5),r);a.position.set(0,6,.3),n.add(a);for(let o=-5;o<5;o++)for(let c=0;c<3;c++)ve(n,"box",(o+c)%2?15003123:2373453,o+.5,.055,c,1,.025,1)}else if(e.kind==="pedestrian"){for(let r=-11;r<12;r+=2)ve(n,"box",15920856,0,.075,r,16.8,.025,.8);for(let r of[-1,1]){ve(n,"box",11913654,r*9.4,.12,0,2,.22,19),ve(n,"cylinder",8557470,r*5.9,2.4,-8,.12,4.8,.12);let a=ve(n,"box",15105385,r*5.9,4.6,-8,1.1,.6,.12);a.userData.crossingSignal=!0}ve(n,"box",15920856,0,.075,12,10.5,.025,.35);let s=new qe;for(let r=-32;r<=12;r+=8)ve(s,"box",8971717,0,.085,r,.16,.025,3,.4,0,3783052);s.visible=!1,n.add(s),n.userData.exitGuide=s,n.userData.people=e.people.map((r,a)=>{let o=this.makePerson(r.word,a,n);return n.add(o),o})}else if(e.kind==="light"){for(let s of[-1,1]){ve(n,"cylinder",4413546,s*12.1,3.2,0,.15,6.4,.15),ve(n,"box",4216680,s*6.1,6.4,0,12.2,.2,.25),ve(n,"box",1386040,s*3.25,5.6,0,.8,1.8,.7);for(let r=0;r<3;r++){let a=ve(n,"sphere",r===0?16737891:r===1?6181188:3361606,s*3.25,6.2-r*.57,.38,.22,.22,.08,.25,0,r===0?16728121:0);a.userData.bulb=r}}for(let s of[-1,-.4,.2])ve(n,"box",15986392,0,.04,s,10.3,.015,.22)}else if(e.kind==="repair"){let s=e.blocks.length*16;ve(n,"box",10318165,0,.03,-s/2,10.5,.05,s);for(let r=0;r<e.blocks.length;r++){let a=ve(n,"box",5467007,0,-1.5,-8-r*16,10.45,.12,15.85);n.userData.repairSlabs.push(a)}for(let r of[-1,1]){n.userData.barriers.push(ve(n,"box",15503954,r*3,1.3,-2,4,.25,.12));for(let a=0;a<3;a++)n.userData.barriers.push(ve(n,"cone",15832663,r*(3.2+a*.75),.5,1,.27,1,.27))}}else{let s=window.RallyCore,r=s.groundRoutes(t,e),a=sp(r,p=>this.curve(p),s.routeOffset,e.at),o=new je;o.setAttribute("position",new Pe(a.positions,3)),o.setAttribute("uv",new Pe(a.uvs,2)),o.setIndex(a.indices),o.computeVertexNormals();let c=new _e(o,this.asphaltMaterial);c.position.y=.02,c.receiveShadow=!0,n.add(c),n.userData.forkSurface=c,n.userData.forkRows=a.rows;let l=[];for(let p=0;p<a.rows.length-1;p++){let v=a.rows[p],b=a.rows[p+1],_=S=>Math.min(...S.intervals.map(A=>A[0])),I=S=>Math.max(...S.intervals.map(A=>A[1]));l.push(_(v),0,-v.at,I(v),0,-v.at,_(b),0,-b.at,_(b),0,-b.at,I(v),0,-v.at,I(b),0,-b.at)}let h=new je;h.setAttribute("position",new Pe(l,3)),h.computeVertexNormals();let u=new _e(h,Mn([8827004,12897481,6122339][this.index]||8827004,.95));u.position.y=-.03,u.receiveShadow=!0,n.add(u);let f=[];for(let[p,v]of a.edges)f.push(p[0],.043,-p[1],v[0],.043,-v[1]);let d=new je;d.setAttribute("position",new Pe(f,3));let m=new Li(d,new xi({color:13952218}));n.add(m),n.userData.edgeLine=m,n.userData.ownMaterials.push(m.material);for(let[p,v]of[[a.bounds.start,e.at],[r[0].end,a.bounds.end]])for(let b=p+4;b<v-2;b+=8)for(let _ of[-.5,.5]){let I=ve(n,"box",14082266,this.curve(b)-this.curve(e.at)+_*3.35,.043,e.at-b,.1,.015,2.2);I.rotation.y=this.heading(b)}let x=r[0],g=new qe;for(let p=x.end+4;p<=x.exitEndAt;p+=7)ve(g,"box",10016955,this.curve(p)-this.curve(e.at),.075,e.at-p,.18,.025,2.5,.4,0,3246951);g.visible=!1,n.add(g),n.userData.mergeGuide=g,n.userData.routePaths=[];for(let p=0;p<3;p++){let v=r[p],b=[];for(let A=0;A<=48;A++){let R=v.start+(v.end-v.start)*A/48;b.push({at:R-e.at,x:this.curve(R)-this.curve(e.at)+v.lane*3.35+s.routeOffset(v,R)})}let _=this.ribbon(n,b.map(A=>({...A,x:A.x-1.48})),.1,11843028,.045),I=this.ribbon(n,b.map(A=>({...A,x:A.x+1.48})),.1,11843028,.045),S=new qe;for(let A=v.start+8;A<v.end-5;A+=12){let R=this.curve(A)-this.curve(e.at)+v.lane*3.35+s.routeOffset(v,A),y=this.heading(A,v);for(let M of[-1,1]){let C=ve(S,"box",11843028,R+M*.28,.055,e.at-A,.09,.015,.8,.6);C.rotation.y=y+M*.7}}n.add(S),n.userData.routePaths.push({left:_,right:I,index:p,route:v,points:b,chevrons:S})}e.coaster&&this.buildCoaster(n,e,t)}return this.scene.add(n),this.gates.set(e.id,n),n}updateGates(e,t,n,s){if(!e)return;let r=e.tasks.concat({id:"finish",kind:"finish",at:e.arena.length});if(this.preparedState!==e){this.clearGate(),this.preparedState=e;for(let o of r)this.makeGate(o,e).visible=!1;this.preparedRevision=e.taskRevision}if(this.preparedRevision!==e.taskRevision){let o=new Set(r.map(c=>c.id));for(let[c,l]of this.gates)o.has(c)||(this.disposeGate(l),this.gates.delete(c));for(let c of r)!this.gates.has(c.id)&&c.at-t>window.RallyCore.TASK_VIEW_DISTANCE&&(this.makeGate(c,e).visible=!1);this.preparedRevision=e.taskRevision}for(let o of r){let c=o.at-t,l=o.kind==="finish"?80:window.RallyCore.taskZone(o).end-o.at+120,h=this.gates.get(o.id);if(h&&(h.visible=c<=window.RallyCore.TASK_VIEW_DISTANCE&&c>=-l,!!h.visible)){if(h.position.set(this.curve(o.at)-n,0,-c+4),o.kind==="junction"&&o.completed&&h.userData.chosenIndex!==o.chosenIndex){h.userData.chosenIndex=o.chosenIndex;for(let u of h.userData.routePaths||[]){let f=u.index===o.chosenIndex,d=Mn(f?o.success?11136203:15843719:7637141,.55,0,f?o.success?2647883:7031849:0);u.left.material=u.right.material=d,u.chevrons.traverse(m=>{m.isMesh&&(m.material=d)})}}o.kind==="junction"&&this.updateCoaster(h,o,e),o.kind==="junction"&&(h.userData.mergeGuide.visible=!!e.mergeAssist&&e.mergeAssist.taskId===o.id&&window.RallyCore.exitAssist(e)===e.mergeAssist),o.kind==="light"&&o.success&&h.traverse(u=>{u.userData.bulb===0&&(u.material=Mn(5977145)),u.userData.bulb===2&&(u.material=Mn(6943671,.3,0,3992465))}),o.kind==="repair"&&(h.userData.repairSlabs.forEach((u,f)=>{let d=f<(o.chosen?.length||0);u.position.y=o.solved?.12:It.damp(u.position.y,d?.12:-1.5,12,s)}),h.userData.barriers.forEach(u=>u.visible=!o.solved)),o.kind==="pedestrian"&&(h.userData.exitGuide.visible=!!window.RallyCore.exitAssist(e)&&e.exitTask===o.id&&!window.RallyCore.crosswalkOccupied(e,o),h.traverse(u=>{u.userData.crossingSignal&&(u.material=window.RallyCore.crosswalkOccupied(e,o)?Mn(15105385,.3,0,16737348):Mn(8902333,.3,0,4908708))})),o.kind==="pedestrian"&&h.userData.people.forEach((u,f)=>{let d=o.people[f],m=d.sent?Math.min(1,(e.elapsed-d.sentAt)/window.RallyCore.PEDESTRIAN_WALK_TIME):0,x=d.side===0?-1:1,g=d.sent?d.sentAt:e.elapsed,p=o.peopleEntryAt==null?0:Math.min(1,Math.max(0,(g-o.peopleEntryAt)/window.RallyCore.PEDESTRIAN_ENTRY_TIME)),v=p*p*(3-2*p),b=d.originSide*8.4*(1-v),_=d.correct===!1?Math.max(0,(m-.35)/.65):m,I=_*_*(3-2*_),S=d.correct===!1&&m<.35?(d.selectedSide===0?-1:1)*2.4*Math.sin(m/.35*Math.PI):0;u.position.set(b*(1-I)+x*8.4*I+S,.03,o.at-d.at+m*1.5),u.rotation.y=x*I*1.05,u.traverse(A=>{A.userData.leg&&(A.rotation.x=d.sent||p>0&&p<1?Math.sin(this.elapsed*9)*.3*A.userData.leg:Math.sin(this.elapsed*2+f)*.025)})})}}for(let[o,c]of this.gates)c.userData.task.at-t<-(c.userData.task.kind==="finish"?80:window.RallyCore.taskZone(c.userData.task).end-c.userData.task.at+120)&&(this.disposeGate(c),this.gates.delete(o));let a=e.task||e.tasks[e.taskIndex];a?(this.gate=this.gates.get(a.id)||this.gate,this.lastGate=a.id,this.repairSlabs=this.gate.userData.repairSlabs||[]):e.distance>e.arena.length-170&&(this.gate=this.gates.get("finish")||this.gate,this.lastGate="finish")}pedestrianProjection(e){let t=this.gates.get(e.task?.id);return t?.userData.people?(t.updateWorldMatrix(!0,!0),this.camera.updateMatrixWorld(),t.userData.people.map(n=>{let s=n.userData.signPoint.clone();return n.localToWorld(s),s.project(this.camera),{x:(s.x*.5+.5)*this.viewport.width,y:(-.5*s.y+.5)*this.viewport.height,visible:s.z>-1&&s.z<1}})):[]}updateRoadBoards(e,t){let n=e?.task,s=["task","resolving"].includes(e?.status);if(this.roadBoards.visible=s,!s){this.signAnchors=[];return}if(this.roadBoards.children.length===0)for(let c=0;c<3;c++){let l=new qe;ve(l,"cylinder",6849686,0,1.3,0,.065,2.6,.065),ve(l,"box",16569464,0,.05,0,2.5,.025,1.2),this.roadBoards.add(l)}let r=window.RallyCore.currentRow(e)||e.task?.rows[0],a=this.curve(e.distance+13)-t,o=-9+(n.completed?Math.max(0,e.distance-n.completedDistance):0);this.roadBoards.position.set(a,0,o),this.signAnchors=[];for(let c=0;c<3;c++){let l=this.roadBoards.children[c];l.visible=n.kind!=="repair"&&!(n.kind==="pedestrian"&&c===1),l.position.set((c-1)*3.35,0,0),this.signAnchors.push(new O(l.position.x+a,3.4,o))}this.promptAnchor.set(a,6.2,-30)}roadProjection(){this.camera.updateMatrixWorld();let e=t=>{let n=t.clone().project(this.camera);return{x:(n.x*.5+.5)*this.viewport.width,y:(-.5*n.y+.5)*this.viewport.height,visible:n.z>-1&&n.z<1}};return{prompt:e(this.promptAnchor),answers:this.signAnchors.map(e)}}carScreenBounds(){this.player.updateWorldMatrix(!0,!0),this.camera.updateMatrixWorld();let e=this.player.userData.hitBounds.clone().applyMatrix4(this.player.matrixWorld),t=[];for(let o of[e.min.x,e.max.x])for(let c of[e.min.y,e.max.y])for(let l of[e.min.z,e.max.z]){let h=new O(o,c,l).project(this.camera);h.z>-1&&h.z<1&&t.push({x:(h.x*.5+.5)*this.viewport.width,y:(-.5*h.y+.5)*this.viewport.height})}if(!t.length)return null;let n=Math.min(...t.map(o=>o.x))-10,s=Math.max(...t.map(o=>o.x))+10,r=Math.min(...t.map(o=>o.y))-10,a=Math.max(...t.map(o=>o.y))+10;return{left:n,right:s,top:r,bottom:a}}isCarHit(e,t){let n=this.carScreenBounds();return!!n&&e>=n.left&&e<=n.right&&t>=n.top&&t<=n.bottom}makeObstacle(e){if(e.type==="traffic")return this.makeCar(Cp[(e.color+e.id)%Cp.length],!1,iu[(e.color*3+e.id)%iu.length]);let t=new qe;if(e.type==="cones")for(let[a,o]of[[-.7,.45],[.7,.45],[0,-.65]])ve(t,"box",3357765,a,.07,o,.7,.14,.7),ve(t,"cone",15834202,a,.62,o,.34,1.1,.34),ve(t,"cone",15983805,a,.76,o,.22,.3,.22);else if(e.type==="crates")for(let[a,o,c]of[[-.5,.45,.2],[.5,.45,-.3],[.1,1.25,0]]){ve(t,"coach",11239001,a,o,c,.95,.85,.95);for(let l of[-1,1])ve(t,"box",14794116,a+l*.35,o,c+.49,.075,.75,.03)}else if(e.type==="pothole"){ve(t,"cylinder",7498594,0,.027,0,1.35,.035,1.7),ve(t,"cylinder",1583931,0,.05,0,1.1,.025,1.45),ve(t,"cylinder",3163735,0,.065,-.05,.75,.025,1.1,.18,.25);for(let a of[-1.15,1.15])ve(t,"box",15252591,a,.08,.9,.22,.1,.25)}else if(e.type==="barrels")for(let[a,o]of[[-.6,.3],[.6,-.3]]){ve(t,"cylinder",12088143,a,.62,o,.46,1.2,.46);for(let c of[.28,.87])ve(t,"cylinder",14995120,a,c,o,.475,.12,.475)}else if(e.type==="fallen_branch"){let a=ve(t,"cylinder",8414799,0,.4,0,.3,2.65,.3);a.rotation.z=Math.PI/2;let o=ve(t,"cylinder",10123609,.4,.58,-.35,.15,1.65,.15);o.rotation.z=.9,o.rotation.x=.5,ve(t,"sphere",5406054,-.65,.72,-.5,.65,.43,.6),ve(t,"sphere",7051127,.65,.9,-.5,.8,.5,.7)}else if(e.type==="tire_stack"){for(let[a,o,c]of[[-.5,.2,2],[.55,-.3,3]])for(let l=0;l<c;l++)ve(t,"cylinder",2306885,a,.2+l*.34,o,.48,.3,.48,.95),ve(t,"cylinder",4741480,a,.36+l*.34,o,.23,.025,.23,.6,.3);ve(t,"box",16241034,0,.5,.73,.36,.13,.04)}else if(e.type==="road_panels"){ve(t,"box",9991256,0,.12,0,2.1,.22,1.9);for(let a=0;a<3;a++){let o=ve(t,"box",a===2?8824494:6323853,0,.29+a*.16,a*.07,2.12,.13,1.7,.45,.35);o.rotation.y=a*.045}for(let a of[-.72,.72]){let o=ve(t,"box",16767370,a,.73,.12,.18,.03,1.65);o.rotation.y=.09}}else if(e.type==="rockfall"){for(let[a,o,c,l]of[[-.55,.48,.15,.65],[.52,.6,-.3,.72],[.05,.28,.85,.4]])ve(t,"rock",10594477,a,o,c,l,l*.85,l).rotation.set(.25+a,.4+o,.3);for(let a of[-.95,.95])ve(t,"box",15641970,a,.18,.9,.19,.36,.18),ve(t,"box",16769953,a,.28,1,.19,.1,.025)}else{ve(t,"box",16764786,0,.85,0,2.6,.75,.4);for(let a of[-.9,0,.9]){let o=ve(t,"box",2373963,a,.85,.22,.3,.76,.025);o.rotation.z=.25}for(let a of[-.9,.9])ve(t,"box",6520462,a,.3,0,.2,.6,.6)}t.updateMatrixWorld(!0);let n=new Ft;t.traverse(a=>{if(a.isMesh){let o=a.geometry.clone().applyMatrix4(a.matrixWorld);n.add("o",o,a.material.color.getHex()),o.dispose()}});let s=new _e(n.merge("o"),Jv);s.castShadow=!0,s.receiveShadow=!0,s.userData.ownGeometry=!0;let r=new qe;return r.add(s),r}syncTraffic(e){if(this.trafficState!==e&&(this.traffic.forEach(t=>{t.userData.contactShadow&&this.scene.remove(t.userData.contactShadow),this.scene.remove(t),t.traverse(n=>{n.isMesh&&n.userData.ownGeometry&&n.geometry.dispose()})}),this.traffic=[],this.trafficState=e,!!e))for(let t of e.obstacles){let n=this.makeObstacle(t);n.userData.obstacle=t,this.scene.add(n),t.type==="traffic"&&this.addContactShadow(n),this.traffic.push(n)}}updateAtmosphere(e,t,n,s,r){let a=this.preferences.reduced,o=this.preferences.graphics==="battery";for(let c of this.landmarks||[]){let l=c.at-n,h=l>-90&&l<620;if(c.group.visible=h,!h)continue;let u=c.overRoad?0:c.side*(this.sceneryEdge(c.at,c.side)+c.offset);if(c.group.position.set(this.curve(c.at)-s+u,0,-l+4),c.group.rotation.y=c.overRoad?-Math.atan((this.curve(c.at+1)-this.curve(c.at-1))/2):c.side*.35,!r&&!a)for(let[f,d]of c.rotors.entries())d.rotation.z+=t*(.9+f*.15)}if(!r)for(let c of this.clouds||[])c.position.x+=t*c.userData.drift,c.position.x>340&&(c.position.x=-340);if(this.rain){let c=a?0:o?110:320;if(this.rain.visible=c>0,this.rain.count=c,c&&!r){let l=this.rainMatrix||=new gt,h=t*24,u=t*(8+(this.motion?.lastSpeed||0)*.6);for(let f=0;f<c;f++){let d=this.rain.userData.drops[f];d[1]-=h*d[3],d[2]+=u,(d[1]<-.5||d[2]>6)&&(d[1]=16+Math.random()*4,d[2]=-60+Math.random()*20,d[0]=(Math.random()-.5)*44),l.position.set(d[0],d[1],d[2]),l.rotation.x=-.18,l.updateMatrix(),this.rain.setMatrixAt(f,l.matrix)}this.rain.instanceMatrix.needsUpdate=!0}}}update(e,t,n="home"){let s=e*(t?.worldTimeScale??1);this.clock=(this.clock||0)+e,(!t||!["paused","finished","failed","countdown"].includes(t.status))&&(this.elapsed+=s),this.syncTraffic(t),this.syncRivals(t),this.prepareCourse(t);let r=!!t,a=r?t.distance:this.showcaseDistance+=e*6,o=this.curve(a)+window.RallyCore.routeOffset(t?.route,a),c=Math.floor(a/20)-3,l=this.segments.length;for(let D=0;D<l;D++){let N=c+((D-c)%l+l)%l,G=N*20+10,V=G-a,j=this.segments[D];j.userData.courseIndex=N,j.position.set(this.curve(G)-o,0,-V+4),j.rotation.y=-Math.atan((this.curve(G+10)-this.curve(G-10))/20),j.userData.curveIndex!==N&&(j.userData.curveIndex=N,this.rebuildChunk(j,N,G))}let h=t&&["paused","finished","failed","countdown"].includes(t.status);this.updateAtmosphere(e,s,a,o,h),this.spectators.update(s,t,this.index,a,o,D=>this.curve(D),this.preferences,h);for(let D of this.rivalCars){let N=D.userData.rival,G=N.at-a;D.visible=G>-60&&G<330,D.position.set(this.curve(N.at)+window.RallyCore.routeOffset(N.route,N.at)-o+N.lanePos*3.35+(N.passingOffset||0),0,-G+4),D.rotation.y=this.heading(N.at,N.route)-It.clamp((N.lane-N.lanePos)*.16,-.16,.16);let V=this.ridePose(N.route,N.at,N.passingOffset||0,t);D.position.x+=V?.dx??0,D.position.y=V?.y??0,D.rotation.x=V?.pitch??0,D.rotation.z=V?.bank??0,h||(D.userData.wheelAngle=((D.userData.wheelAngle||0)+Math.max(0,N.at-(D.userData.previousAt??N.at))/.43)%(Math.PI*2),D.userData.previousAt=N.at),this.animateCar(D,D.userData.wheelAngle||0,-(N.lane-N.lanePos)*.28,N.braking),D.userData.nitroExhaust.visible=!!N.nitroActive&&!h,this.placeContactShadow(D);let j=Math.sign((N.plannedLane??N.lane)-N.lanePos);for(let W of D.userData.indicators||[])W.visible=j!==0&&(N.plannedLane!=null||Math.abs(N.lane-N.lanePos)>.05)&&W.userData.indicator===j&&Math.floor((t.elapsed||0)*3)%2===0}for(let D of this.traffic){let N=D.userData.obstacle,G=N.at-a;D.visible=!N.dormant&&G>-50&&G<360,D.position.set(window.RallyCore.actorX(t,N)-o,0,-G+4);let V=N.changed&&N.laneProgress<1,j=V?It.clamp(-(N.target-N.fromLane)*Math.sin(N.laneProgress*Math.PI)*.12,-.16,.16):0;D.rotation.y=this.heading(N.at,N.route)+j,(D.userData.indicators||[]).forEach(W=>{W.visible=(N.moving||N.routeChanging)&&V&&W.userData.indicator===Math.sign(N.target-N.fromLane)&&Math.floor((t?.elapsed||0)*3)%2===0}),D.rotation.z=N.hit&&t.elapsed-(N.hitAt??0)<.45?Math.sin(t.elapsed*18)*.08:0,h||(D.userData.wheelAngle=((D.userData.wheelAngle||0)+Math.max(0,N.at-(D.userData.previousAt??N.at))/.43)%(Math.PI*2),D.userData.previousAt=N.at),this.animateCar(D,D.userData.wheelAngle||0,j,N.braking||N.waiting),this.placeContactShadow(D)}this.updateGates(t,a,o,s),this.motionState!==t&&(this.motionState=t,this.motion=np(this.currentLane,t?.roadTravel??a));let u=t?t.arena.speed*t.speedFactor*(t.worldTimeScale??1):6;t?.focusAuto&&(this.motion.lastSpeed=u);let f=this.motion.lane;if(ip(this.motion,t?.lane||0,t?.roadTravel||a,u,t?.focusAuto&&["light","junction"].includes(t.task?.kind)?e:s,h),t&&!h&&!window.RallyCore.playerLaneClear(t,f,this.motion.lane)){let D=window.RallyCore.playerLaneBlocker(t,f,this.motion.lane);this.motion.lane=f,this.motion.velocity=0,this.motion.steer=0,window.RallyCore.contactBump(t,D)}this.currentLane=this.motion.lane;let d=this.currentLane*3.35,m=n==="home"&&this.viewport.width<760&&this.viewport.height>this.viewport.width?-9:4,x=this.ridePose(t?.route,a,0),g=x?.y??0;this.player.position.set(d,.04+g+(this.preferences.reduced?0:this.motion.bob),m),this.player.rotation.set((this.preferences.reduced?0:this.motion.pitch)+(x?.pitch??0),this.heading(a,t?.route)+this.motion.steer*.22,(this.preferences.reduced?0:this.motion.roll)+(x?.bank??0)),this.animateCar(this.player,this.motion.wheelAngle,this.motion.steer,this.motion.braking||!!t?.yielding&&u<.5),this.player.visible=!0,this.shadow.position.set(d,.07+g,m),this.shadow.rotation.z=-this.player.rotation.y,this.nitroReadyGlow.position.set(d,.08+g,m),this.nitroReadyGlow.rotation.z=-this.player.rotation.y,this.nitroReadyGlow.visible=!h&&!t?.nitroActive&&window.RallyCore.canEngageNitro(t),this.nitroReadyGlow.scale.setScalar(this.preferences.reduced?1:1+Math.sin(this.elapsed*3)*.025),this.damageFx.update(e,t,this.preferences,h),this.boostFx.update(s,t,this.preferences,h),this.waterNormal&&!h&&!this.preferences.reduced&&this.waterNormal.offset.set(this.elapsed*.009,this.elapsed*.005),this.trail.children.forEach((D,N)=>{D.visible=!!t&&!h&&!this.preferences.reduced&&this.preferences.graphics!=="battery"&&(this.lookConfig.trail||t.nitroActive)&&u>2,D.position.set(d+(N%2?1:-1)*.64,.08+g,m+3+N*.45),D.material=Mn(t?.nitroActive?9035263:8440760,.5,0,t?.nitroActive?2529481:3570791),D.scale.z=1-N/16});let p=t&&["paused","finished","failed"].includes(t.status),v=this.viewport.width<760&&this.viewport.height>this.viewport.width,b=n==="home",_=b?v?2:-5:t?.status==="task"?d*.7:d*.35,I=b?v?9:4.4:t?.status==="task"?7.2:6.2,S=b?v?16:20:t?.status==="task"?17:16;if(!b&&!this.preferences.reduced&&t?.status!=="task"&&(S+=Math.min(2.4,Math.max(0,t.speedFactor-1)*.9)),this.rideLift=It.damp(this.rideLift||0,g,9,e),I+=this.rideLift,x&&!this.preferences.reduced&&(S+=1.6,I+=.8),!b&&!this.preferences.reduced&&t?.status!=="task"&&(I-=.45*this.boostFx.intensity,S+=.9*this.boostFx.intensity),!b&&t?.status!=="task"){let D=It.clamp((.95-this.viewport.width/this.viewport.height)/.5,0,1);S+=6.5*D,I+=2.4*D}p||(this.camera.position.x=It.damp(this.camera.position.x,_,4,e),this.camera.position.y=It.damp(this.camera.position.y,I,4,e),this.camera.position.z=It.damp(this.camera.position.z,S,4,e));let A=Math.max(24,Math.min(52,2*Math.atan(this.viewport.height*3.35/(54*Math.min(140,(this.viewport.width-24)/3)))*180/Math.PI));p||(this.camera.fov=It.damp(this.camera.fov,t?.status==="task"?A:r?52+(this.preferences.reduced?0:Math.min(12,Math.max(0,t.speedFactor-1)*5.4)+(x?It.clamp(-x.slope*14,0,8):0)):52,t?.nitroActive?9:4,e)),this.camera.updateProjectionMatrix();let R=Math.atan2(this.camera.position.y-this.rideLift-.8,Math.max(1,this.camera.position.z-4))-Math.atan(.58*Math.tan(this.camera.fov*Math.PI/360)),y=this.camera.position.y-Math.tan(R)*(this.camera.position.z+11);if(!p){let D=this.preferences.reduced?0:It.clamp(-this.heading(a+10,t?.route)*6,-2.2,2.2);this.look.set(b?v?-1.8:-6.5:t?.status==="task"?d*.65:d*.25+D,b?v?-1:-.5:y+(x&&!this.preferences.reduced?It.clamp(x.slope*7,-4,2):0),b?v?-9:-6:-11),this.camera.lookAt(this.look)}let M=this.arenaLook,C=It.clamp(t?.focusAmount||0,0,1),U=this.preferences.reduced?0:this.boostFx.intensity;this.sun.intensity=M.sunIntensity*(1-.2*C),this.hemi.intensity=M.hemi*(1-.08*C),this.renderer.toneMappingExposure=M.exposure*(1-.07*C)+U*.05,this.scene.fog.color.setHex(M.fog).lerp(this.focusTint,.24*C),this.updateRoadBoards(t,o),this.renderer.render(this.scene,this.camera)}};function Dp(i){return String(i).toLowerCase().replace(/\b[a-z]/g,e=>e.toUpperCase()).replace(/\bTv\b/g,"TV")}function Up(i,e,t,n){let s=Math.max(1,...String(i).trim().split(/\s+/u).map(n));return Math.max(.1,Math.floor(Math.min(t,t*Math.max(1,e-2)/s)*10)/10)}function Np(i,{width:e,top:t,bottom:n}){let s=[];for(let r of[...i].sort((a,o)=>Math.abs(a.distance)-Math.abs(o.distance)))!r.visible||Math.abs(r.distance)>150||r.x<42||r.x>e-42||r.y<t+30||r.y>n-16||s.some(a=>Math.abs(a.x-r.x)<82&&Math.abs(a.y-r.y)<32)||s.push(r);return s.map(r=>r.id)}function Fp(i,e){let n=(i-24)/3,s=e.map(u=>u.x),r=s[1],a=Math.min(Math.abs(s[1]-s[0]),Math.abs(s[2]-s[1])),o=Math.min(n,Math.max(Math.min(100,n),a)),c=Math.min(34,Math.max(24,o*.28)),l=Math.min(168,Math.max(1,o-c)),h=Math.max(12+o+l/2,Math.min(i-12-o-l/2,r));return[0,1,2].map(u=>({x:h+(u-1)*o,width:l,gap:c,cellLeft:h+(u-1.5)*o,cellRight:h+(u-.5)*o}))}function tM(i,e,t){let n=0,s=1;for(let[r,a,o,c]of[[i.x,e.x-i.x,t.left,t.right],[i.y,e.y-i.y,t.top,t.bottom]])if(Math.abs(a)<1e-8){if(r<o||r>c)return null}else{let l=(o-r)/a,h=(c-r)/a;if(l>h&&([l,h]=[h,l]),n=Math.max(n,l),s=Math.min(s,h),n>s)return null}return n}function Op(i,e,t,n=[]){return t.map(s=>({id:s.id,t:tM(i,e,s)})).filter(s=>s.t!==null&&!n.includes(s.id)).sort((s,r)=>s.t-r.t).map(s=>s.id)}function Bp({hudBottom:i,promptHeight:e,answerHeight:t,promptY:n,answerY:s,controlsTop:r,repair:a=!1,landscape:o=!1,viewportHeight:c=1/0}){let l=o?8:12,h=i+l,u=r-12,f=Math.min(u+(o?56:0),c-12),d=Math.max(0,u-h-e-l-t),m=a?Math.min(80,d):0,x=o?0:m,p=h+e/2,v=p+e/2+l+t/2,b=u-x-t/2,_=Math.max(v,Math.min(s,Math.max(v,b)));return a&&o&&(m=Math.min(80,Math.max(0,f-_-t/2))),{py:p,ay:_,stagger:m,bottom:u,centerBottom:f}}var xs=["boulevard","coast","storm"],lc=i=>i==="standard"?"challenge":i,uu=[{id:"gold",name:"Sunrise Gold",color:15973461,tier:0},{id:"lagoon",name:"Lagoon Pearl",color:5618094,tier:1},{id:"ruby",name:"Ember Ruby",color:13066354,tier:2},{id:"midnight",name:"Midnight Violet",color:7959477,tier:3}];function kp(i){i.difficulty==="standard"&&(i.difficulty="challenge"),i.progress=i.progress&&typeof i.progress=="object"?i.progress:{};for(let t of Object.keys(i.progress))if(t.endsWith(":standard")){let n=t.slice(0,-9)+":challenge",s=i.progress[t],r=i.progress[n];i.progress[n]=[0,1,2].map(a=>Math.max(0,Math.min(3,Number(s?.[a])||0),Math.min(3,Number(r?.[a])||0))),delete i.progress[t]}i.teamId=sn(i.teamId)?.id||null;let e={};for(let[t,n]of Object.entries(i.arenaWins||{})){let s=t.endsWith(":standard")?t.slice(0,-9)+":challenge":t;e[s]=xs.map((r,a)=>e[s]?.[a]===!0||n?.[a]===!0)}for(let t of Array.isArray(i.ulti?.receipts)?i.ulti.receipts:[]){if(!t||t.sourceGame!=="wordshift-rally"||!sn(t.teamId))continue;let n=xs.indexOf(t.arenaId),s=lc(t.difficulty);if(n<0||!["relaxed","challenge"].includes(s)||typeof t.unitId!="string"||!t.unitId)continue;let r=t.unitId+":"+s;(e[r]||=xs.map(()=>!1))[n]=!0}return i.arenaWins=e,Vu(i),i.fuel=Number.isFinite(i.fuel)?Math.max(0,Math.min(100,i.fuel)):0,i.mastery=i.mastery&&typeof i.mastery=="object"?i.mastery:{},i.reviewQueue=i.reviewQueue&&typeof i.reviewQueue=="object"?i.reviewQueue:{},i.look={paint:"gold",badge:0,trail:!1,...i.look},i}function Pa(i,e,t,n){return Number.isInteger(n)&&n>=0&&n<xs.length&&xs.slice(0,n).every((s,r)=>i.arenaWins?.[e+":"+lc(t)]?.[r]===!0)}function zp(i,e,t){if(!Ar(e)||e.reviewLap||t!==1||!Number.isInteger(e.arenaIndex)||e.arenaIndex<0||e.arenaIndex>=xs.length||typeof e.unit?.id!="string"||!["relaxed","challenge"].includes(lc(e.difficulty)))return!1;let n=e.unit.id+":"+lc(e.difficulty);i.arenaWins||={};let s=i.arenaWins[n]||=xs.map(()=>!1),r=s[e.arenaIndex]!==!0;return s[e.arenaIndex]=!0,r}function du(i,e){return i.mastery[e]||={seen:{},clean:{},total:0,firstTry:0,arenas:0,tier:0}}function Hp(i,e,t){let n=du(i,e);for(let s of t)n.seen[s.key]=!0,n.total++,s.firstTry&&(n.firstTry++,n.clean[s.key]=!0);return Vp(n)}function Gp(i,e,t){let n=du(i,e);return n.arenas|=1<<t,Vp(n)}function Vp(i){let e=i.tier,t=Object.keys(i.clean).length,n=i.total?i.firstTry/i.total:0,s=[0,1,2].filter(r=>i.arenas&1<<r).length;return n>=.9&&(t>=6&&s>=1&&(i.tier=Math.max(i.tier,1)),t>=12&&s>=2&&(i.tier=Math.max(i.tier,2)),t>=18&&s===3&&(i.tier=3)),i.tier>e?i.tier:0}function cc(i,e){let t=du(i,e);return{unique:Object.keys(t.clean).length,accuracy:t.total?Math.round(t.firstTry/t.total*100):0,arenas:[0,1,2].filter(n=>t.arenas&1<<n).length,tier:t.tier}}function hc(i){return Math.max(0,...Object.values(i.mastery).map(e=>e.tier||0))}function fu(i,e,t){let n=hc(i);if(e==="paint"){let s=uu.find(r=>r.id===t);if(!s||s.tier>n)return!1;i.look.paint=t}else if(e==="badge"){if(!Number.isInteger(t)||t<0||t>n)return!1;i.look.badge=t}else if(e==="trail"){if(t&&n<3)return!1;i.look.trail=!!t}else return!1;return!0}function ys(i){let e=hc(i),t=uu.find(n=>n.id===i.look.paint&&n.tier<=e)||uu[0];return{color:sn(i.teamId)?.color??t.color,teamId:sn(i.teamId)?.id??null,paint:t.id,badge:Math.min(e,Math.max(0,Number(i.look.badge)||0)),trail:!!i.look.trail&&e>=3}}var se=window.RallyCore,P=i=>document.getElementById(i),ki=window.LANGUAGE_BANK,Ba=i=>`<span class="modal-host" aria-hidden="true"><img src="img/saymaz-${i}.png" alt="" draggable="false"></span>`,yt=i=>String(i).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]);function nM(i){let e=i?.closest?i:i?.parentElement;return["input","textarea","select",'[contenteditable="true"]','[contenteditable="plaintext-only"]'].some(t=>e?.closest?.(t))}for(let i of["selectstart","dragstart","contextmenu"])P("app").addEventListener(i,e=>{nM(e.target)||e.preventDefault()},{capture:!0});function Qp(){let i=window.getSelection?.();i?.rangeCount&&i.removeAllRanges()}var em="wordshift-rally.v1",K={grade:5,unit:"g5u1",difficulty:"relaxed",sound:!1,progress:{},tutorial:!1},bu=!0;try{let i=localStorage.getItem(em);i&&(K={...K,...JSON.parse(i)})}catch{bu=!1}ki.some(i=>i.grade===K.grade)||(K.grade=5);(!K.progress||typeof K.progress!="object")&&(K.progress={});kp(K);se.DIFFICULTIES[K.difficulty]||(K.difficulty="relaxed");var Zt=0,w=null,wt,Mr="home",La="",gc="",yc=null,Oi=0,tm=null,uc=!1,xu=0,Ms=0,Bi=()=>ki.find(i=>i.grade===K.grade).units.find(i=>i.id===K.unit)||ki.find(i=>i.grade===K.grade).units[0],nm=()=>K.unit+":"+K.difficulty,iM=()=>K.progress[nm()]||[0,0,0],dc=i=>Pa(K,K.unit,K.difficulty,i),Wp=i=>se.ARENAS.find((e,t)=>t<i&&!K.arenaWins[nm()]?.[t])?.name;function Hn(){try{localStorage.setItem(em,JSON.stringify(K))}catch{bu=!1}}var Ze=new Wa(()=>K.sound),im=window.matchMedia("(prefers-reduced-motion: reduce)"),xc=window.matchMedia("(pointer: coarse)"),Su=new URLSearchParams(globalThis.location?.search||"").get("touch")==="1",Yt=Su||xc.matches||navigator.maxTouchPoints>0&&!window.matchMedia("(hover: hover)").matches,yu=0,fc=null,zi=null,Da=0,un=null,_r=()=>Wu(K.preferences,im.matches),Fa=!0,sm=0,pu,Xp=new WeakMap,Ua={hudBottom:155,controlsTop:innerHeight-90,promptHeight:60,answerHeight:80},pc=typeof ResizeObserver=="function"?new ResizeObserver(()=>{Fa=!0}):null;function Es(){Fa=!0,sm++}var _u=i=>`emoji/${i}.webp`,sM=i=>{if(typeof Image=="function")for(let e of i?.tasks||[])for(let t of[e.image,...e.optionImages||[]])t&&(new Image().src=_u(t))},qp=i=>String(i).split(/(\s+)/u).map(e=>/^\s*$/u.test(e)?yt(e):`<span class="sign-word">${yt(e)}</span>`).join("");function $p(i,e,t){let n=sm+"|"+t.toFixed(1)+"|"+e.textContent;if(Xp.get(e)===n)return;pu??=document.createElement("canvas").getContext("2d");let s=getComputedStyle(i),r=parseFloat(s.fontSize),a=["paddingLeft","paddingRight","borderLeftWidth","borderRightWidth"].reduce((c,l)=>c+(parseFloat(s[l])||0),0);pu.font=`${s.fontWeight} ${r}px ${s.fontFamily}`;let o=Up(e.textContent,t-a,r,c=>pu.measureText(c).width);_s(e,"fontSize",o+"px"),Xp.set(e,n),Fa=!0}document.fonts?.ready.then(Es);for(let i of["app","hud","controls","road-prompt"])pc?.observe(P(i));function Oa(i){i=Su||!!i;let e=Yt!==i;Yt=i,document.body.classList.toggle("touch-controls",Yt),P("controls").setAttribute("aria-hidden",String(Yt)),Yt&&(P("controls").hidden=!0),P("touch-nitro").hidden=!Yt||!w||!["driving","task","resolving"].includes(w.status),e&&Es()}xc.addEventListener?.("change",()=>Oa(xc.matches));document.addEventListener("pointerdown",i=>{i.pointerType==="touch"||i.pointerType==="pen"?Oa(!0):i.pointerType==="mouse"&&!xc.matches&&Oa(!1)},{capture:!0});function _c(){let i=window.visualViewport;if(i&&Math.abs((i.scale||1)-1)>.01)return;let e=i?.height||innerHeight,t=i?.width||innerWidth;e>0&&Number.isFinite(e)&&document.documentElement.style.setProperty("--play-height",e+"px"),document.body.classList.toggle("short-viewport",t<=760&&e<640&&e>=t),document.body.classList.toggle("compact-landscape",t>e&&e<=300),Oa(Yt),wt?.resize(),Es()}window.addEventListener("resize",_c);window.addEventListener("pageshow",_c);window.visualViewport?.addEventListener("resize",_c);_c();function _s(i,e,t){i.style[e]!==t&&(i.style[e]=t)}function nt(i,e){let t=P(i),n=String(e);t.textContent!==n&&(t.textContent=n,["road-question","road-feedback","road-kicker"].includes(i)&&Es())}function rm(){if(Fa){Fa=!1;let i=[...P("road-answers").querySelectorAll("button")],e=window.visualViewport,t=e?.width||innerWidth,n=e?.height||innerHeight;Ua={hudBottom:P("hud").getBoundingClientRect().bottom,controlsTop:Yt?Yu(t,n):P("controls").getBoundingClientRect().top,promptHeight:P("road-prompt").offsetHeight,answerHeight:Math.max(56,...i.map(s=>s.offsetHeight))},document.body.style.setProperty("--hud-bottom",Ua.hudBottom+"px")}return Ua}function Eu(){let i=_r();document.body.classList.toggle("reduced-motion",i.reduced),wt?.setPreferences(i)}im.addEventListener?.("change",Eu);function ni(i){if(!(!_r().haptics||!window.matchMedia("(pointer: coarse)").matches))try{navigator.vibrate?.({click:8,correct:[12,30,18],collision:45,go:[15,25,25],finish:[20,50,30,50,50]}[i]||8)}catch{}}function am(){let i=!!w&&se.pause(w),e=()=>{let t=_r();Hi(`<span class="modal-kicker">MAKE IT YOUR DRIVE</span><h2 id="modal-title">Driver settings.</h2><p>Comfort, sound and performance. Your choices are saved on this device.</p><div class="setting-row"><div><strong>Sound</strong><small>Engine, road and answer cues</small></div><button class="setting-toggle" id="setting-sound" aria-pressed="${K.sound}">${K.sound?"ON":"OFF"}</button></div><div class="setting-row"><div><strong>Vibration</strong><small>Light feedback on supported phones</small></div><button class="setting-toggle" id="setting-haptics" aria-pressed="${t.haptics}">${t.haptics?"ON":"OFF"}</button></div><label class="setting-label" for="setting-graphics">GRAPHICS</label><select id="setting-graphics"><option value="auto">Auto \xB7 adapts to your device</option><option value="high">High \xB7 sharper picture</option><option value="battery">Battery saver \xB7 lighter rendering</option></select><label class="setting-label" for="setting-motion">MOTION</label><select id="setting-motion"><option value="system">Follow device settings</option><option value="full">Full \xB7 camera and effects</option><option value="reduced">Reduced \xB7 steady camera, fewer effects</option></select><p class="save-note">Auto lowers rendering resolution if frame times stay high. Battery saver reduces shadows and effects.</p><button class="primary" id="settings-done">${i?"BACK TO THE RACE":"DONE"} \u2197</button>`),P("setting-graphics").value=t.graphics,P("setting-motion").value=t.motion;let n=(s,r)=>{K.preferences={..._r(),[s]:r},Hn(),Eu()};P("setting-sound").onclick=()=>{K.sound=!K.sound,Ze.unlock(),vc(),Hn(),e()},P("setting-haptics").onclick=()=>{n("haptics",!t.haptics),ni("click"),e()},P("setting-graphics").onchange=s=>n("graphics",s.target.value),P("setting-motion").onchange=s=>n("motion",s.target.value),P("settings-done").onclick=()=>{Gn(),i&&se.resume(w),P("settings").focus()}};e()}function rM(){let i=P("celebration");i.hidden=!1,i.innerHTML=_r().reduced?"":Array.from({length:30},(e,t)=>`<i style="--x:${t*37%100}%;--delay:${t%7*.09}s;--turn:${t*47}deg;--colour:${["#fbd477","#83decc","#fff4d6"][t%3]}"></i>`).join(""),document.body.classList.add("race-finished"),ni("finish")}function vc(){P("sound").classList.toggle("off",!K.sound),P("sound").setAttribute("aria-pressed",String(K.sound)),P("sound").setAttribute("aria-label",K.sound?"Mute sound":"Enable sound")}function vs(i,e=!1,t=null){if(w&&["task","resolving"].includes(w.status)){nt("road-feedback",i),P("road-feedback").classList.toggle("bad",e),Da=performance.now()+1600;return}(!un||e||!un.bad)&&(un={text:i,bad:e,valid:t,expiresAt:performance.now()+5e3})}function Yp(i,e){if(un&&(un.expiresAt<i||un.valid&&!un.valid())&&(un=null),!e.announcementsAllowed){P("toast").classList.remove("visible"),Oi=0;return}if(un&&i>=Oi){let t=un;un=null,P("toast").textContent=t.text,P("toast").className="visible"+(t.bad?" bad":""),Oi=i+1500}i>Oi&&P("toast").classList.remove("visible")}function aM(i){let e=["#83c6dc","#63ced3","#4b5c89"][i],t=["#76a88c","#3c98a3","#455d77"][i];return`<svg viewBox="0 0 150 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="150" height="100" fill="${e}"/><circle cx="119" cy="22" r="10" fill="${i===2?"#d5d5dc":"#ffe4a3"}"/><path d="M0 65h150v35H0Z" fill="${t}"/>${i===0?'<path fill="#d2d7bc" d="M6 70V39h16v31h8V28h19v42h24V44h20v26h12V22h19v48Z"/><path fill="#64897d" d="M0 73 35 55 66 70 101 51 150 70v30H0Z"/>':i===1?'<path d="M0 75q15-7 30 0t30 0t30 0t30 0t30 0" fill="none" stroke="#a4e6da" stroke-width="2"/><path d="M13 68V30m116 38V30M13 36q57 42 116 0M13 30l57 38 59-38" stroke="#dce9d9" stroke-width="3" fill="none"/>':'<path fill="#899aab" d="m0 72 37-50 30 38 28-48 55 62v26H0Z"/><path fill="#bfcbd2" d="m22 42 15-20 15 19-14-4Zm57-6 16-24 19 24-19-6Z"/><path fill="#415a72" d="m0 92 40-35 33 34 33-28 44 30v7H0Z"/>'}<path fill="#2c475b" d="m68 54 14 0 39 46H30Z"/><path d="m74 59-2 9m-1 7-5 15" fill="none" stroke="#fff0bd" stroke-width="2"/><path d="M0 94h150v6H0Z" fill="#102e48" opacity=".5"/></svg>`}function ws(){hm(),K.unit=Bi().id,document.querySelectorAll("[data-team]").forEach(t=>{let n=t.dataset.team===K.teamId;t.classList.toggle("selected",n),t.setAttribute("aria-pressed",String(n))}),P("start").disabled=!sn(K.teamId),P("start").querySelector("span").textContent=K.teamId?"START YOUR ENGINE":"CHOOSE YOUR TEAM",ka(),nt("lesson-grade",K.grade),nt("lesson-meta",`GRADE ${K.grade} ${Rr[K.grade]} \xB7 UNIT ${ki.find(t=>t.grade===K.grade).units.indexOf(Bi())+1}`),nt("lesson-unit",Bi().title),P("lesson-picker").setAttribute("aria-label",`Choose your lesson: Grade ${K.grade} ${Rr[K.grade]}, ${Bi().title}`),document.querySelectorAll("[data-diff]").forEach(t=>{t.classList.toggle("selected",t.dataset.diff===K.difficulty),t.setAttribute("aria-pressed",String(t.dataset.diff===K.difficulty))}),P("difficulty-note").textContent={relaxed:"More time. Real racing.",challenge:"Fast rivals. Race to win."}[K.difficulty];let i=iM();dc(Zt)||(Zt=0),P("total-stars").textContent=i.reduce((t,n)=>t+n,0)+" / 9 stars",P("arena-cards").innerHTML=se.ARENAS.map((t,n)=>{let s=!dc(n);return`<button class="arena-card ${Zt===n?"selected ":""}${s?"locked":""}" data-arena="${n}" style="--accent:${t.color}" aria-pressed="${Zt===n}" aria-label="${yt(t.name)}${s?", locked. Finish first in "+Wp(n)+" to unlock.":", "+i[n]+" stars"}"><span class="arena-number">${s?"LOCKED":String(n+1).padStart(2,"0")}</span><span class="arena-mini ${t.id==="coast"?"coast":t.id==="storm"?"storm":""}">${aM(n)}</span><strong>${yt(t.name)}</strong><span class="stars">${s?"\u2014":"\u2605".repeat(i[n])+"\u2606".repeat(3-i[n])}</span></button>`}).join(""),P("arena-cards").querySelectorAll("button").forEach(t=>t.onclick=()=>{let n=+t.dataset.arena;if(!dc(n)){vs("Finish first in "+Wp(n)+" to unlock.");return}Zt=n,Ze.tone("click"),ws()}),P("scene-name").textContent=se.ARENAS[Zt].name.toUpperCase(),P("scene-name").nextElementSibling.textContent=String(Zt+1).padStart(2,"0")+" / 03",document.documentElement.style.setProperty("--accent",se.ARENAS[Zt].color),wt?.setup(Zt),Hn(),nt("arena-length",(se.ARENAS[Zt].length/1e3).toFixed(2)+" KM"),nt("arena-checkpoints",se.ARENAS[Zt].checkpoints+" CHECKPOINTS"),nt("ride-name",sn(K.teamId)?.name.toUpperCase()||"CHOOSE A TEAM");let e=cc(K,K.unit);P("mastery-preview").textContent=`UNIT MASTERY \xB7 ${e.unique} ITEMS \xB7 ${e.accuracy}% FIRST TRY${e.tier?" \xB7 "+["","EXPLORER","SCHOLAR","MASTER"][e.tier]:""}`,wt?.setCosmetics(ys(K))}function oM(){if(Mr!=="home")return;let i=K.grade,e=K.unit;Hi(`<div class="lessons-heading"><div><h2 id="modal-title">Lessons</h2><p id="lessons-intro">Choose your lesson</p></div><button id="lesson-close" class="lesson-close" aria-label="Close Lessons">\xD7</button></div><div class="lessons-grades-section"><span class="setting-label" id="grade-label">GRADE / LEVEL</span><div class="grades lesson-grades" role="group" aria-labelledby="grade-label">${ki.map(n=>`<button type="button" data-grade="${n.grade}" aria-label="Grade ${n.grade} ${Rr[n.grade]}" aria-pressed="${n.grade===i}"><span>GRADE ${n.grade}</span><strong>${Rr[n.grade]}</strong></button>`).join("")}</div></div><span class="setting-label" id="unit-label">THEME / UNIT</span><div id="unit" class="lesson-units" role="group" aria-labelledby="unit-label"></div><div class="lesson-confirm"><p id="lesson-preview" class="lesson-preview"></p><div class="modal-actions"><button id="lesson-cancel" class="secondary">CANCEL</button><button id="lesson-apply" class="primary">USE THIS LESSON \u2197</button></div></div>`),P("modal").classList.add("lessons-modal");let t=()=>{let n=ki.find(r=>r.grade===i).units;n.some(r=>r.id===e)||(e=n[0].id),document.querySelectorAll("[data-grade]").forEach(r=>{let a=+r.dataset.grade===i;r.classList.toggle("selected",a),r.setAttribute("aria-pressed",String(a))}),P("unit").innerHTML=n.map((r,a)=>`<button type="button" class="lesson-unit-option" data-unit="${r.id}" aria-label="Unit ${a+1}: ${yt(r.title)}" aria-describedby="lesson-summary-${r.id}"><span class="unit-number" aria-hidden="true">${a+1}</span><span class="unit-copy"><strong class="unit-title">${yt(r.title)}</strong><span id="lesson-summary-${r.id}" class="unit-summary">${yt(Ju(r))}</span>${r.subthemes?.length?`<span class="unit-subthemes">Includes: ${r.subthemes.map(o=>yt(o.title)).join(" \xB7 ")}</span>`:""}</span><span class="unit-check" aria-hidden="true">\u2713</span></button>`).join("");let s=()=>{P("unit").querySelectorAll("button").forEach(r=>{let a=r.dataset.unit===e;r.classList.toggle("selected",a),r.setAttribute("aria-pressed",String(a))}),P("lesson-preview").textContent=n.find(r=>r.id===e).title};P("unit").querySelectorAll("button").forEach(r=>r.onclick=()=>{e=r.dataset.unit,s()}),s()};document.querySelectorAll("[data-grade]").forEach(n=>n.onclick=()=>{i=+n.dataset.grade,e=ki.find(s=>s.grade===i).units[0].id,t()}),P("lesson-close").onclick=Gn,P("lesson-cancel").onclick=Gn,P("lesson-apply").onclick=()=>{K.grade=i,K.unit=e,Zt=0,Gn(),ws()},t()}var Wt=zu({api:Ou(window.WORDRAMP_CONFIG)}),om=-1/0,mu=!1,Zp=-1,lm=i=>i?.unit?.grade??(Number(String(i?.unit?.id||K.unit).match(/^g(\d+)/)?.[1])||K.grade);function cm(i){!Wt.enabled||!i||i.reviewLap||i.leagueTicket||mu||!sn(i.teamId)||["finished","failed"].includes(i.status)||(mu=!0,om=performance.now(),Wt.start({runId:i.runId,grade:lm(i),team:i.teamId,arena:i.arenaIndex,pace:i.difficulty==="challenge"?"challenge":"relaxed",unit:i.unit.id}).then(e=>{e&&(i.leagueTicket=e)}).finally(()=>{mu=!1}))}function lM(i,e,t){let n=t?.name||"your team";return i.state==="counted"?i.duplicate?{text:"This win was already counted in the English League.",good:!0}:i.points>0?{text:`+${i.points} Ulti for Grade ${e} ${n}!${i.reason==="team-limit"?` ${n} reached today's team limit, so this win counted ${i.points} of ${i.requested}.`:""}`,good:!0}:i.reason==="device-limit"?{text:"Today's Ulti wins on this phone are used. Tomorrow they count again."}:i.reason==="team-limit"?{text:`${n} reached today's Ulti limit for Grade ${e}. Tomorrow wins count again.`}:i.reason==="off"?{text:"Ulti points are switched off in the English League right now."}:{text:"This win added no Ulti points."}:i.state==="queued"?{text:"You're offline. This win will be sent to the English League when you're online."}:i.state==="refused"?{text:i.reason==="too-fast"?"That win was faster than the English League allows, so it did not count.":i.reason==="expired"?"This race ticket expired before it could be sent.":"The English League did not accept this win."}:i.state==="no-ticket"?{text:"This race could not reach the English League when it started, so it cannot count."}:null}function cM(i,e,t){let n=P("league-result"),s=lM(i,e,t);!n||!s||(n.textContent=s.text,n.classList.toggle("good",!!s.good),n.classList.remove("pending"))}function hm(){if(!Wt.enabled){P("league-button").hidden=!0;return}P("league-button").hidden=!1,nt("league-label",`LEAGUE \xB7 GRADE ${K.grade}`)}function hM(i){if(!i.known)return'<p class="save-note">The English League will show its Ulti rules here once it can be reached.</p>';if(!i.game)return'<p class="league-help">Ulti points are not switched on for this game yet.</p>';let e=t=>se.ARENAS.map((n,s)=>t?.[s]!=null?`${yt(n.name)} +${t[s]}`:"").filter(Boolean).join(" \xB7 ");return`<p class="league-help">${e(i.game.points?.relaxed)}.</p><p class="league-help">On Challenge pace: ${e(i.game.points?.challenge)}.</p><p class="save-note">${i.game.deviceDailyWins?`Your first ${i.game.deviceDailyWins} wins each day count on this phone. `:""}Points last ${ku(i.hours)}. Your win also needs ${Math.round(Tr*100)}% of tasks right first time on Relaxed, or ${wr} stars on Challenge.</p>`}function uM(i){return`<div class="league-teams">${i.teams.map(e=>{let t=sn(e.id),n=Math.min(1,e.points/Math.max(1,i.capacity));return`<div class="league-team ${K.teamId===e.id?"selected":""}" style="--team:${t.accent};--share:${(n*100).toFixed(1)}%"><span class="team-letter">${t.letter}</span><span class="league-name">${t.name}${K.teamId===e.id?" \xB7 YOU":""}</span><span class="league-bar" aria-hidden="true"><i></i></span><strong>${Math.round(e.points)} / ${i.capacity}</strong><small>${Bu(e.strength)}</small></div>`}).join("")}</div>`}function um(){if(!Wt.enabled)return;let i=K.grade,e=(n,s)=>{P("league-done")&&(P("league-body").innerHTML=`${uM(n)}${hM(n)}<p class="save-note">${s}</p>`)};Hi(`${Ba("cheer")}<span class="modal-kicker">ENGLISH LEAGUE \xB7 BATTLE ARENA</span><h2 id="modal-title">Ulti \xB7 Grade ${i}</h2><p>Arena wins add Ulti points to your grade's team pool in Mr. Saymaz's English League. Stronger teams hit harder in the Battle Arena.</p><div id="league-body"></div><button id="league-done" class="primary">BACK TO GARAGE</button>`),P("league-done").onclick=Gn;let t=Wt.snapshot(i);e(t,t.updatedAt?"Updating\u2026":"Connecting to the English League\u2026"),Wt.refresh(i).then(n=>e(n,n.online?"Live from the English League.":n.updatedAt?`Offline \xB7 last updated ${new Date(n.updatedAt).toLocaleString()}.`:"The English League cannot be reached right now."))}function ka(){let i=document.querySelectorAll(".team-points");if(!Wt.enabled){i.forEach(t=>{t.hidden=!0});return}let e=Wt.snapshot(K.grade);i.forEach(t=>{t.hidden=!e.updatedAt}),document.querySelectorAll("[data-ulti-total]").forEach(t=>{let n=String(Math.round(e.teams.find(s=>s.id===t.dataset.ultiTotal)?.points||0));t.textContent!==n&&(t.textContent=n)})}function Mc(){if(!w)return;let i=w.answerEvents.slice(xu),e=i.length||K.fuel!==w.fuel;i.length&&(Ms=Math.max(Ms,Hp(K,w.unit.id,i)),xu=w.answerEvents.length),K.fuel=w.fuel,K.reviewQueue[w.unit.id]=w.review.filter(t=>!t.recovered).map(t=>({...t})),e&&Hn()}function mc(){let i=hc(K),e=cc(K,K.unit),t=ys(K);Hi(`${Ba("smile")}<span class="modal-kicker">MASTERY GARAGE</span><h2 id="modal-title">Wear what you learn.</h2><p>${yt(Bi().title)} \xB7 ${e.unique} distinct items \xB7 ${e.accuracy}% first try \xB7 ${e.arenas}/3 arenas</p><p>Your team sets your car colour. Earn badges and a trail through unit mastery.</p><div class="paint-grid">${Tc.map(n=>`<button class="paint-option ${K.teamId===n.id?"selected":""}" data-livery="${n.id}" aria-pressed="${K.teamId===n.id}"><span class="paint-swatch" style="--paint:#${n.color.toString(16)}"></span><strong>${n.name}</strong><small>TEAM LIVERY</small></button>`).join("")}</div><p class="garage-label">BADGE</p><div class="badge-options">${["Off","Explorer","Scholar","Master"].map((n,s)=>`<button data-badge="${s}" ${s>i?"disabled":""} class="${t.badge===s?"selected":""}">${n}</button>`).join("")}</div><button id="trail-option" class="trail-option" ${i<3?"disabled":""} aria-pressed="${t.trail}">Aurora trail \xB7 ${i<3?"MASTER REWARD":t.trail?"ON":"OFF"}</button><div class="mastery-rules">At 90% first-try accuracy: <strong>Explorer</strong> needs 6 distinct items + 1 arena; <strong>Scholar</strong> needs 12 + 2 arenas; <strong>Master</strong> needs 18 + all 3. Earn rewards in any unit and equip them throughout your garage.</div><p class="save-note">Fuel ${K.fuel}/100 \xB7 each first-try answer earns 10; every third in a streak adds 5. Each charge costs 30, up to three levels. ${Yt?"Slide up for Nitro, slide down to save it while keeping regular acceleration. Slide farther up to stack.":"Hold NITRO or Space to use it; release to save the remainder."} Driving always remains available.</p><button id="garage-done" class="primary">BACK TO GARAGE</button>`),P("modal").querySelectorAll("[data-livery]").forEach(n=>n.onclick=()=>{K.teamId=n.dataset.livery,Hn(),wt.setCosmetics(ys(K)),mc()}),P("modal").querySelectorAll("[data-badge]").forEach(n=>n.onclick=()=>{fu(K,"badge",+n.dataset.badge)&&(Hn(),wt.setCosmetics(ys(K)),mc())}),P("trail-option").onclick=()=>{fu(K,"trail",!K.look.trail)&&(Hn(),wt.setCosmetics(ys(K)),mc())},P("garage-done").onclick=()=>{Gn(),ws()}}var za=!1,br=!1,dn=null,Ts=!1,bs=null,on=null,vu=0;function Mu(){return za||br||dn!==null||zi!==null}function ft(){if(w){let i=za||br||zi!==null||dn!==null&&!Pt?.touch;se.setAccelerating(w,Mu(),!!i),se.setNitroHeld(w,Ts||bs!==null||on!==null)}}function Ha(){let i=Pt?.id;Pt=null;let e=bs;bs=null,on=null,Ts=!1,e!==null&&P("nitro").hasPointerCapture?.(e)&&P("nitro").releasePointerCapture(e);let t=dn;dn=null,za=!1,br=!1;let n=zi;zi=null,n!==null&&P("throttle").hasPointerCapture?.(n)&&P("throttle").releasePointerCapture(n),t!==null&&P("world").hasPointerCapture?.(t)&&P("world").releasePointerCapture(t),i!=null&&P("world").hasPointerCapture?.(i)&&P("world").releasePointerCapture(i),w&&(se.setAccelerating(w,!1),se.setNitroHeld(w,!1))}function Hi(i){un=null,Oi=0,P("toast").classList.remove("visible"),Ha(),He.pointerId!==null&&Tu({pointerId:He.pointerId}),P("modal").classList.remove("finish-modal","dnf-result"),P("modal").classList.remove("lessons-modal"),tm=document.activeElement,P("modal").innerHTML=i,P("modal-backdrop").hidden=!1,setTimeout(()=>P("modal").focus(),0)}function Gn(){P("modal-backdrop").hidden=!0,P("modal").classList.remove("lessons-modal"),P("modal").innerHTML="",tm?.focus?.()}function wu(i=!1){let e=(Yt?"Hold anywhere on the road to accelerate. Keep your thumb down and swipe left or right to change lanes. You can swipe again without lifting.":"Swipe the road, tap the arrows, or use \u2190 \u2192 / A D. Hold your car or the speed button to accelerate. On a computer, hold \u2191.")+" Release acceleration and Nitro to coast and brake for traffic.",t=Yt?"Slide your driving thumb forward to use Nitro, then hold it there. Slide down to save the remaining charge and keep regular acceleration. Slide farther forward for a second or third charge, up to three levels. Each new charge costs 30 fuel; resuming a saved charge is free. Lifting your thumb releases acceleration and Nitro. Fuel and Nitro status sit beside your race position.":"Hold NITRO or Space to boost; release to save the remaining charge. An upward swipe also boosts while your finger stays down. A new charge costs 30 fuel. Tap +30 or press N to stack up to three levels. Holding acceleration also uses a loaded charge. Regular acceleration displays up to 90 km/h; maximum Nitro displays 200 km/h.",n=Yt?"After choosing, keep holding the road to return to normal pace sooner.":"After choosing, hold your car, the speed button or \u2191 to return to normal pace sooner.";w&&!["finished","failed","paused"].includes(w.status)&&(uc=se.pause(w)),Hi(`${Ba("point")}<span class="modal-kicker">WELCOME TO WORDRAMP</span><h2 id="modal-title">Your team.<br>Your open road.</h2><div class="help-step"><span class="step-num">1</span><div><strong>Find your line.</strong><p>${e}</p></div></div><div class="help-step"><span class="step-num">2</span><div><strong>Read the road.</strong><p>Steer towards the correct full-text answer, or tap its sign. Rivals match your progress during every English task, even if you hold acceleration. Correct exits protect your speed recovery too. Lights and forks enter slow motion close to the signs. Steering stays active. ${n} Already holding? Keep holding. The answer locks at the road line.</p></div></div><div class="help-task-grid"><div><b>GREEN LIGHT</b><span>Read in slow motion, then steer into the matching answer to turn the light green.</span></div><div><b>ROAD REPAIR</b><span>Release the car: autopilot holds your entry speed and lane while the world slows into a green-gold focus effect. Connect the three blocks; the road repairs immediately, then normal pace and driving controls return smoothly. Extra thinking time safely freezes the approach before the gap. A held Up key or driving touch resumes automatically after autopilot.</span></div><div><b>SHORTCUT</b><span>Choose a sign in close-range slow motion. The right lane leads into a visible shortcut. In Sunlit Boulevard it rides the Sky Coaster.</span></div><div><b>CROSSWALK</b><span>Sort each visitor\u2019s word while autopilot approaches in slow motion. Clear the crossing before you arrive; all cars wait if anyone is still on the road.</span></div></div><div class="help-step"><span class="step-num">3</span><div><strong>Earn your next boost.</strong><p>First-try English answers earn fuel. Every third adds a streak bonus. ${t}</p></div></div><div class="help-step"><span class="step-num">4</span><div><strong>Look after your car.</strong><p>Three small marks below the clock show your remaining hits. Each driving bump damages the car; the third ends the race. Change lanes into clear gaps. Every new race starts fully repaired.</p></div></div><p class="save-note">Choose Slytherin, Hufflepuff, Gryffindor or Ravenclaw in the garage. ${Wt.enabled?`A first-place finish with ${Math.round(Tr*100)}% of tasks right first time on Relaxed, or ${wr}+ stars on Challenge, adds Ulti points to your team in Mr. Saymaz's English League. Tap LEAGUE in the garage to see the team pools. `:""}Plan about five minutes per arena, with 12\u201316 checkpoints and longer open-road stretches. Holding acceleration and using Nitro can shorten your run. Your stars reward accurate English and clean driving. Your racing position is separate. All cars wait for pedestrians to reach the sidewalk.</p><details><summary>Race rules & keyboard shortcuts</summary><p>Finish first to unlock the next arena for this unit and difficulty. Stars still reward your English at every finishing position. Wrong answers cost 1.5 seconds and never damage your car. Each separate driving impact costs ${se.DIFFICULTIES[K.difficulty].penalty} seconds and one condition mark. Three hits end the race. A cracked windscreen warns after the first hit; a loose bonnet and smoke mean one hit left. Rivals can close the gap while you recover, using their normal driving. Autopilot protects your car and reading time. Relaxed gives 3 seconds of impact protection; Challenge gives 2. Each retry starts fully repaired. Correct shortcuts add 3 seconds; wrong routes take a recoverable detour. Rivals share your regular top speed and earn fuel for boosts. Nitro waits through tasks and crossings. Use 1 / 2 / 3 for the road signs or repair blocks. Use \u2190 / \u2192 at crosswalks. Escape / P pauses. Missed words return later, with an optional review lap after the finish.</p></details><button id="help-done" class="primary">${i?"LET\u2019S DRIVE":"GOT IT"} \u2197</button>`),P("help-done").onclick=()=>{Gn(),i?(K.crosswalkTutorial=!0,Hn(),yr()):uc&&(se.resume(w),uc=!1)}}function yr(i=null){if(!sn(K.teamId)){vr();return}if(!Array.isArray(i)&&!dc(Zt)){vr(),vs("Finish first to unlock the next arena.");return}Qp(),P("launch-caption").textContent=Yt?"HOLD TO DRIVE \xB7 SWIPE TO STEER \xB7 SLIDE \u2191 FOR NITRO":"READ THE ROAD. RACE YOUR RIVALS.",Es(),yu=0,fc=null,un=null,Oi=0,P("toast").classList.remove("visible"),P("celebration").hidden=!0,P("celebration").innerHTML="",document.body.classList.remove("race-finished","car-critical","car-breaking");let e=Array.isArray(i)?i:null;Mc(),Ha(),Gn(),w=e?se.createReviewLap(Bi(),e,K.difficulty,Date.now(),{fuel:K.fuel}):se.createRace(Bi(),K.difficulty,Zt,Date.now(),{fuel:K.fuel,reviews:K.reviewQueue[Bi().id]||[]}),sM(w),w.teamId=K.teamId,w.runId=Hu("run"),e||cm(w),xu=0,Ms=0,Mr="race",La="",gc="",yc=null,wt.setup(e?0:Zt),wt.clearGate(),wt.currentLane=0,wt.setCosmetics(ys(K)),P("rival-tags").innerHTML=w.rivals.map(t=>`<span data-rival="${t.id}" style="--rival:#${t.color.toString(16)}">${t.name}<small></small></span>`).join(""),document.body.classList.add("racing"),P("home").hidden=!0,P("hud").hidden=!1,P("pause").hidden=!1,P("countdown").hidden=!1,P("warning").hidden=!0,P("road-learning").hidden=!0,P("controls").hidden=!0,vu=0,P("launch-kicker").textContent=w.arena.name.toUpperCase(),P("launch-caption").textContent=w.reviewLap?"A SHORT LAP. A STRONGER NEXT DRIVE.":"YOU \xB7 COBALT \xB7 EMBER",Ze.unlock(),Ze.tone("click")}function vr(){document.body.dataset.nitroLevel="0",Mc(),Ha(),w=null,Mr="home",gc="",La="",yc=null,uc=!1,wt?.clearGate(),Gn(),document.body.classList.remove("racing","nitro-active","race-finished","nitro-ready","car-critical","car-breaking"),un=null,Oi=0,P("toast").classList.remove("visible"),P("celebration").hidden=!0,P("celebration").innerHTML="",P("rival-tags").innerHTML="";for(let i of["route-status","hud","pause","countdown","warning","road-learning","controls"])P(i).hidden=!0;P("home").hidden=!1,ws(),Ze.update(null)}function Sr(){if(!w||!se.pause(w))return;Ze.tone("pause");let i=sn(w.teamId),e=se.raceOrder(w).findIndex(t=>t.id==="player")+1;Hi(`${Ba("think")}<span class="modal-kicker">PIT STOP \xB7 WORDRAMP</span><h2 id="modal-title">Take a breath.</h2><p>Your race clock is paused.</p><div class="pause-lesson"><strong>${yt(w.arena.name)}</strong><span>Grade ${K.grade} \xB7 ${yt(w.unit.title)} \xB7 ${se.DIFFICULTIES[w.difficulty].label}</span><span class="pause-team" style="--team:${i.accent}">${yt(i.name)}</span></div><dl class="pause-stats"><div><dt>FIRST TRY</dt><dd id="pause-accuracy">${w.correct} / ${w.tasks.length}</dd></div><div><dt>DISTANCE</dt><dd id="pause-distance">${Math.floor(w.distance)} / ${w.arena.length} m</dd></div><div><dt>CHECKPOINTS</dt><dd id="pause-checkpoints">${w.taskIndex} / ${w.tasks.length}</dd></div><div><dt>${se.raceFailed(w)?"STATUS":"POSITION"}</dt><dd>${se.raceFailed(w)?"DNF":w.reviewLap?"Review lap":e+" / 3"}</dd></div><div><dt>BEST STREAK</dt><dd>${w.bestStreak}</dd></div><div><dt>CAR CONDITION</dt><dd>${se.carCondition(w).remaining} / 3 hits left</dd></div></dl><button id="resume" class="primary">BACK ON THE ROAD \u2197</button><div class="pause-tools"><button id="pause-settings">Settings</button><button id="pause-help">How to play</button><button id="pause-sound">Sound ${K.sound?"on":"off"}</button></div><div class="modal-actions"><button id="restart" class="secondary">Restart race</button><button id="exit-race" class="secondary">Return to garage</button></div>`),P("resume").onclick=()=>{Gn(),se.resume(w)},P("pause-settings").onclick=()=>{se.resume(w),am()},P("pause-help").onclick=()=>{se.resume(w),wu()},P("pause-sound").onclick=()=>{K.sound=!K.sound,Ze.unlock(),vc(),Hn(),P("pause-sound").textContent="Sound "+(K.sound?"on":"off")},P("restart").onclick=yr,P("exit-race").onclick=vr}function dM(){if(Mr==="home"){vr();return}if(w&&["finished","failed"].includes(w.status)){vr();return}Sr()}var He={key:"",sequence:[],pointerId:null,point:null,dragging:!1,errorUntil:0};function fM(){return[...P("road-answers").querySelectorAll("[data-block]")].map(i=>{let e=i.getBoundingClientRect();return{id:+i.dataset.block,left:e.left-3,right:e.right+3,top:e.top-3,bottom:e.bottom+3}})}function Kp(){He.pointerId!==null&&P("road-answers").hasPointerCapture?.(He.pointerId)&&P("road-answers").releasePointerCapture(He.pointerId),He={key:"",sequence:[],pointerId:null,point:null,dragging:!1,errorUntil:0},P("repair-path").setAttribute("d",""),P("repair-tip").setAttribute("d","")}function bc(){let i=He.sequence.map(n=>{let s=P("road-answers").querySelector(`[data-block="${n}"]`);return s?{x:parseFloat(s.style.left),y:parseFloat(s.style.top)}:null}).filter(n=>n&&Number.isFinite(n.x)&&Number.isFinite(n.y));P("repair-path").setAttribute("d",i.map((n,s)=>(s?"L":"M")+n.x+" "+n.y).join(" "));let e=i.at(-1),t=He.dragging&&He.point;P("repair-tip").setAttribute("d",e&&t?"M"+e.x+" "+e.y+" L"+t.x+" "+t.y:""),P("repair-links").classList.toggle("error",performance.now()<He.errorUntil),P("repair-links").classList.toggle("complete",!!w?.task?.solved)}function Sc(i){if(!(w?.status!=="task"||w.task.kind!=="repair"||w.task.solved||performance.now()<He.errorUntil||He.sequence.includes(i))&&(He.sequence.push(i),Ze.tone("build"),He.sequence.length===3)){let e=se.connectRepair(w,He.sequence);He.dragging=!1,He.point=null,e||(He.errorUntil=performance.now()+650)}}function pM(i){if(He.pointerId!==null&&He.pointerId!==i.pointerId||w?.status!=="task"||w.task.kind!=="repair"||w.task.solved||performance.now()<He.errorUntil)return;let e=i.target.closest("[data-block]");e&&(i.preventDefault(),i.stopPropagation(),Ze.unlock(),He.pointerId=i.pointerId,He.dragging=!0,He.point={x:i.clientX,y:i.clientY},P("road-answers").setPointerCapture(i.pointerId),Sc(+e.dataset.block),bc())}function mM(i){if(!He.dragging||i.pointerId!==He.pointerId)return;i.preventDefault();let e=i.getCoalescedEvents?.();for(let t of e?.length?e:[i]){let n={x:t.clientX,y:t.clientY},s=He.point||n;for(let r of Op(s,n,fM(),He.sequence))Sc(r);He.point=n}bc()}function Tu(i){i.pointerId===He.pointerId&&(He.dragging=!1,He.point=null,P("road-answers").hasPointerCapture?.(i.pointerId)&&P("road-answers").releasePointerCapture(i.pointerId),He.pointerId=null,bc())}P("road-answers").addEventListener("pointerdown",pM);P("road-answers").addEventListener("pointermove",mM);P("road-answers").addEventListener("pointerup",Tu);P("road-answers").addEventListener("pointercancel",Tu);var Na=null;P("pedestrian-words").addEventListener("pointerdown",i=>{let e=i.target.closest("[data-person]");!e||w?.status!=="task"||w.task.kind!=="pedestrian"||w.task.pedWait>0||(i.preventDefault(),Ze.unlock(),Na={id:i.pointerId,x:i.clientX,y:i.clientY,person:w.task.personIndex},e.setPointerCapture(i.pointerId))});function dm(i){if(Na?.id!==i.pointerId)return;let e=Na;Na=null,i.type!=="pointercancel"&&w?.task?.personIndex===e.person&&Math.abs(i.clientX-e.x)>22&&Math.abs(i.clientX-e.x)>Math.abs(i.clientY-e.y)*.7&&se.sortPerson(w,i.clientX>e.x?1:0)&&Ze.tone("click"),i.target.hasPointerCapture?.(i.pointerId)&&i.target.releasePointerCapture(i.pointerId)}P("pedestrian-words").addEventListener("pointerup",dm);P("pedestrian-words").addEventListener("pointercancel",dm);function gM(){let i=["task","resolving"].includes(w?.status),e=w?.task,t=i?se.currentRow(w)||e?.rows[0]:null,n=e?.completed?w.elapsed-e.completedAt:0,s=w?.status==="resolving"&&n>.6;if(P("road-learning").hidden=!t||n>1.05,P("road-learning").classList.toggle("leaving",s),!t){He.key&&w?.status!=="paused"&&Kp();return}let r=e.kind==="repair",a=e.kind==="pedestrian",o=e.id;if(P("road-learning").classList.toggle("repair-mode",r),P("road-learning").classList.toggle("pedestrian-mode",a),P("repair-links").hidden=!r,P("pedestrian-words").hidden=!a,gc!==o){pc?.disconnect();for(let y of["app","hud","controls","road-prompt"])pc?.observe(P(y));Es(),Kp(),nt("road-feedback",""),Da=0,gc=o,He.key=o,Na=null,P("road-kicker").textContent=r?e.reviewOf?"REVIEW REPAIR \xB7 AUTO CRUISE":"ROAD REPAIR \xB7 AUTO CRUISE":e.reviewOf?"SECOND LOOK \xB7 A DIFFERENT CLUE":a?"CROSSWALK":e.picture?e.kind==="light"?"PICTURE SIGN \xB7 GREEN LIGHT":"PICTURE ROUTE":e.kind==="light"?"GREEN LIGHT":"CHOOSE YOUR ROUTE",P("road-question").textContent=r?e.reviewOf?e.prompt:"Release the car. Connect the 3 blocks.":a?"Which category does each word belong to?":e.prompt,e.picture==="word"&&P("road-question").insertAdjacentHTML("afterbegin",`<img class="sign-emoji" src="${_u(e.image)}" alt="Picture clue" draggable="false">`),P("road-prompt").classList.toggle("picture-sign",!!e.picture),P("road-instruction").textContent=r?"DRAG THROUGH ALL 3 BLOCKS IN THE RIGHT ORDER":a?"SWIPE THE WORD LEFT / RIGHT \xB7 OR TAP A CATEGORY":"STEER INTO YOUR ANSWER \xB7 TAP A SIGN TO STEER",P("road-answers").innerHTML=t.options.map((y,M)=>`<button class="road-answer ${r?"repair-block":a?"category-sign":""}" ${r?`data-block="${e.order[M]}"`:a?`data-side="${M}"`:`data-lane="${M}"`} aria-label="${r?"Connect block":a?`Send person ${M===0?"left":"right"}`:`Steer into ${["left","middle","right"][M]} lane`}: ${yt(y)}"><span class="answer-letter">${r?"\u25C9":a?M===0?"\u2190 LEFT":"RIGHT \u2192":["A)","B)","C)"][M]}</span><span class="answer-text">${e.optionImages?`<img class="answer-emoji" src="${_u(e.optionImages[M])}" alt="${yt(y)}" draggable="false">`:qp(a?Dp(y):y.replace(/^…\s*/,""))}</span></button>`).join(""),P("road-answers").querySelectorAll("button").forEach(y=>{pc?.observe(y),y.onclick=M=>{w?.status==="task"&&(r?M.detail===0&&Sc(+y.dataset.block):a?(Ze.unlock(),se.sortPerson(w,+y.dataset.side)&&Ze.tone("click")):(Ze.unlock(),se.choose(w,+y.dataset.lane),Ze.tone("click"),ni("click")))}}),P("pedestrian-words").innerHTML=a?e.people.map(y=>`<button class="person-word" data-person="${y.id}" aria-label="Swipe ${yt(y.word)} left or right"><span>${qp(y.word)}</span><small>\u2190 SWIPE \u2192</small></button>`).join(""):""}r?(e.solved&&He.sequence.length!==3&&(He.sequence=e.connection.slice()),He.errorUntil&&performance.now()>=He.errorUntil&&(He.sequence=[],He.errorUntil=0),nt("road-question",e.solved?e.answer:e.reviewOf?e.prompt:"Release the car. Connect the 3 blocks."),nt("road-kicker",e.solved?"ROAD REPAIRED":e.reviewOf?"REVIEW REPAIR \xB7 AUTO CRUISE":"ROAD REPAIR \xB7 AUTO CRUISE"),nt("road-instruction",e.solved?"SENTENCE CONNECTED \xB7 ROAD REPAIRED":He.errorUntil?"TRY A DIFFERENT ORDER":"DRAG THROUGH ALL 3 BLOCKS IN THE RIGHT ORDER")):a&&nt("road-kicker",e.completed?se.crosswalkOccupied(w,e)?"VISITORS LEAVING":"CROSSWALK CLEAR":`CROSSWALK \xB7 VISITOR ${Math.min(e.personIndex+1,e.people.length)} / ${e.people.length}`);let c=wt.roadProjection(),l=P("road-prompt"),h=c.answers;if(h.length!==3)return;let{width:u,height:f}=wt.viewport||{width:innerWidth,height:innerHeight},d=f<600&&u>f,m=Fp(u,h),x=[...P("road-answers").querySelectorAll("button")];if(x.forEach((y,M)=>{let C=m[a?M*2:M].width;_s(y,"width",C.toFixed(1)+"px"),$p(y,y.querySelector(".answer-text"),C)}),a)for(let y of P("pedestrian-words").children)_s(y,"width",m[1].width.toFixed(1)+"px"),$p(y,y.querySelector("span"),m[1].width);let{hudBottom:g,controlsTop:p,promptHeight:v,answerHeight:b}=rm(),_=d?10:17,I=p-12,{py:S,ay:A,stagger:R}=Bp({hudBottom:g,promptHeight:v,answerHeight:b,promptY:c.prompt.y,answerY:h[1].y,controlsTop:p,repair:r,landscape:d,viewportHeight:f});if(_s(l,"left",u/2+"px"),_s(l,"top",S.toFixed(1)+"px"),x.forEach((y,M)=>{let C=r?+y.dataset.block:null,U=He.sequence.indexOf(C),D=r&&U>=0;if(y.disabled=w.status!=="task"||a&&(e.pedWait>0||!se.pedestrianReady(w,e)),y.classList.toggle("selected",!r&&!a&&w.lane===M-1),y.classList.toggle("linked",D),y.classList.toggle("connected",r&&e.solved||!r&&!a&&e.completed&&M===e.correctIndex),y.classList.toggle("error",D&&performance.now()<He.errorUntil),y.setAttribute("aria-pressed",String(r?D:!a&&w.lane===M-1)),r){let G=y.querySelector(".answer-letter"),V=D?String(U+1):"\u25C9";G.textContent!==V&&(G.textContent=V)}let N=m[a?M*2:M];_s(y,"left",N.x.toFixed(1)+"px"),_s(y,"top",(A+(r&&M===1?R:0)).toFixed(1)+"px")}),a){P("road-instruction").textContent=e.completed?se.crosswalkOccupied(w,e)?"WAIT UNTIL ALL VISITORS REACH THE SIDEWALK":"CROSSWALK CLEAR \xB7 LET\u2019S GO":se.pedestrianReady(w,e)?`SWIPE LEFT / RIGHT \xB7 ${Math.ceil(se.crosswalkTimeLeft(w,e))}s`:e.peopleEntryAt==null?"TRAFFIC CLEARING THE STRIPES":"VISITORS APPROACHING \xB7 READ THE CATEGORIES";let y=wt.pedestrianProjection(w);[...P("pedestrian-words").children].forEach((M,C)=>{let U=e.people[C],D=y[C],N=U.sent?w.elapsed-U.sentAt:0,G=D?.visible&&se.pedestrianReady(w,e)&&(C===e.personIndex&&!U.sent||U.sent&&N<1.4);M.hidden=!G,M.disabled=U.sent||e.pedWait>0||w.status!=="task",M.classList.toggle("departing",U.sent),M.classList.toggle("wrong",U.sent&&!U.correct),M.style.opacity=U.sent?String(Math.max(0,1-N/1.4)):String(se.clamp((w.elapsed-U.entryAt)/.25,0,1)),M.style.width=m[1].width+"px",M.style.left=(U.sent?D?.x:m[1].x)+"px",M.style.top=Math.max(S+v/2+M.offsetHeight/2+_,Math.min(D?.y||A,I-M.offsetHeight/2))+"px",M.querySelector("small").textContent=U.sent?U.correct?"\u2713 SORTED":"\u2197 CORRECTION":"\u2190 SWIPE \u2192"})}P("decision-fill").style.width=(e.completed?0:a?se.crosswalkTimeLeft(w,e)/e.sortDuration*100:se.clamp((t.at-w.distance)/(r?82:70)*100,0,100))+"%",r&&bc()}function xM(){Ha(),Mc();let i=Ar(w),e=w.failureReason==="breakdown"||w.damage>=se.DAMAGE_LIMIT||!!w.breakdown,t=se.stars(w),n=Math.round(100*w.correct/Math.max(1,w.tasks.length)),s=i?se.raceOrder(w).findIndex(d=>d.id==="player")+1:null;if(i&&!w.reviewLap){let d=w.unit.id+":"+w.difficulty,m=(K.progress[d]||[0,0,0]).slice();m[w.arenaIndex]=Math.max(m[w.arenaIndex],t),K.progress[d]=m,Ms=Math.max(Ms,Gp(K,w.unit.id,w.arenaIndex)),zp(K,w,s),Hn()}let r=Wt.enabled?Gu(w,s,t):"none",a=r==="qualified",o=sn(w.teamId),c=lm(w);if(a){let d=w;Wt.claim(d.runId).then(m=>(w===d&&cM(m,c,o),ka(),Wt.flush())).catch(()=>{})}let l=r==="accuracy"?w.difficulty==="challenge"?`English League Ulti points need ${wr} stars on Challenge: answer 3 in 4 tasks right first time.`:`English League Ulti points need ${Math.round(Tr*100)}% of tasks right first time on Relaxed.`:"";yc={finished:i,stars:t},Ze.tone(i?"finish":e?"breakdown":"wrong"),P("road-learning").hidden=!0,P("controls").hidden=!0,P("warning").hidden=!0,P("pause").hidden=!0;let h=w.review.filter(d=>!d.recovered),u=cc(K,w.unit.id),f=i&&s===1&&!w.reviewLap&&w.arenaIndex<2&&Pa(K,w.unit.id,w.difficulty,w.arenaIndex+1);Hi(`${Ba(i?s===1&&!w.reviewLap?"cheer":"smile":"think")}<span class="modal-kicker">${w.reviewLap?i?"REVIEW LOOP COMPLETE":"REVIEW LOOP \xB7 TRY AGAIN":i?"ENGLISH GRAND PRIX":e?"THREE HITS \xB7 RACE ENDED":"THE ROAD IS WORTH ANOTHER TRY"}</span><div class="finish-emblem" aria-hidden="true"><span>${i?"FINISH":e?"BREAKDOWN":"KEEP GOING"}</span><strong>${i?w.reviewLap?"\u2713":String(s).padStart(2,"0"):e?"!":"\u2197"}</strong><small>${w.reviewLap?"REVIEW":i?"RACE POSITION":e?"BACK TO THE GARAGE":"NEXT TIME"}</small></div><h2 id="modal-title">${i?w.reviewLap?"A stronger next drive.":s===1?"You took the lead.":"What a drive!":e?"Car broken down.":w.failureReason==="time"?"Time ran out.":"Race not finished."}</h2><p>${yt(w.arena.name)} \xB7 ${se.DIFFICULTIES[K.difficulty].label}${i&&!w.reviewLap?" \xB7 POSITION "+s+"/3":""}</p>${i?"":'<div class="result-dnf" role="status"><strong>DNF</strong><span>DID NOT FINISH</span></div>'}<div class="result-stars" aria-label="${t} out of 3 stars">${Array.from({length:3},(d,m)=>`<span class="${m<t?"":"empty"}">\u2605</span>`).join("")}</div><div class="result-stats"><div class="result-stat"><strong>${Math.ceil(w.time)}s</strong><small>TIME LEFT</small></div><div class="result-stat"><strong>${n}%</strong><small>FIRST TRY</small></div><div class="result-stat"><strong>${w.collisions}</strong><small>BUMPS</small></div></div>${i&&!w.reviewLap?`<div class="podium">${se.raceOrder(w).map((d,m)=>`<span class="${d.id==="player"?"you":""}"><b>${m+1}</b> ${yt(d.name)}</span>`).join("")}</div>`:""}<p>${w.reviewLap?"Review strengthens your English. Win the full race to unlock the next arena.":i?"Stars reward your English and clean driving. First place unlocks the next arena.":e?"Three separate hits ended this race. Your next drive starts with a fully repaired car. Read the gaps and save Nitro for a clear stretch.":"Try Relaxed for more thinking time, or take a short review lap before the next race."}</p>${l?`<div class="ulti-win ulti-missed" style="--team:${sn(w.teamId)?.accent||"#a5caff"}"><span>FIRST PLACE \xB7 NO ULTI POINTS</span><p>${yt(l)}</p></div>`:""}${a?'<p id="league-result" class="league-result pending" role="status">Sending your win to the English League\u2026</p>':""}<div class="achievement">FUEL ${w.fuel}/100 \xB7 BEST STREAK ${w.bestStreak} \xB7 CHARGES LOADED ${w.nitroUses}</div>${Ms?`<div class="achievement">MASTERY REWARD \xB7 ${["","EXPLORER BADGE","SCHOLAR BADGE","MASTER BADGE + AURORA TRAIL"][Ms]}</div>`:""}<p class="save-note">Unit mastery: ${u.unique} distinct items \xB7 ${u.accuracy}% first try \xB7 ${u.arenas}/3 arenas</p>${f?`<div class="achievement">UNLOCKED \xB7 ${yt(se.ARENAS[w.arenaIndex+1].name)}</div>`:i&&!w.reviewLap&&w.arenaIndex<2&&s!==1?`<p class="arena-goal">${Pa(K,w.unit.id,w.difficulty,w.arenaIndex+1)?"Finish first to advance from this race.":`Finish first in ${yt(w.arena.name)} to unlock ${yt(se.ARENAS[w.arenaIndex+1].name)}.`}</p>`:""}${h.length?`<details><summary>Review ${h.length} missed item${h.length>1?"s":""}</summary>${h.map(d=>`<div class="review-item"><span>${yt(d.prompt)}</span><strong>${yt(d.answer)}</strong>${d.tr?`<small>${yt(d.tr)}</small>`:""}</div>`).join("")}</details><button id="review-lap" class="review-lap-button">SHORT REVIEW LAP \xB7 UP TO 6 ITEMS \u2197</button>`:w.review.length?'<div class="achievement">MISSED ITEMS RECOVERED ON THE ROAD</div>':""}<div class="modal-actions"><button id="replay" class="${f?"secondary":"primary"}">DRIVE AGAIN</button>${f?'<button id="next-arena" class="primary">NEXT ARENA \u2197</button>':""}</div><button class="text-button" id="result-home">Return to garage</button><p class="save-note">${bu?"Wins, stars, fuel and mastery are saved in this browser.":"This browser is blocking saves. Keep this tab open to retain your progress."}</p>`),P("modal").classList.add("finish-modal"),P("modal").classList.toggle("dnf-result",!i),i&&rM(),P("replay").onclick=()=>yr(),P("result-home").onclick=vr,P("review-lap")&&(P("review-lap").onclick=()=>yr(h)),P("next-arena")&&(P("next-arena").onclick=()=>{if(!f||w.status!=="finished"||se.raceOrder(w)[0]?.id!=="player")return;let d=w.arenaIndex+1;Pa(K,w.unit.id,w.difficulty,d)&&(Zt=d,yr())})}function yM(){Hi(`<span class="modal-kicker">RACE JOURNAL \xB7 GRADE ${K.grade}</span><h2 id="modal-title">Every road counts.</h2><p>${se.DIFFICULTIES[K.difficulty].label} difficulty \xB7 three arenas per unit</p>${ki.find(i=>i.grade===K.grade).units.map(i=>{let e=K.progress[i.id+":"+K.difficulty]||[0,0,0],t=e.reduce((n,s)=>n+s,0);return`<div class="journal-unit"><span>${yt(i.title)}</span><span>${t} / 9 \u2605</span></div>`}).join("")}<p class="save-note">Progress is kept separately for each unit and difficulty in this browser.</p>${Wt.enabled?'<button id="journal-ulti" class="review-lap-button">ENGLISH LEAGUE ULTI \u2197</button>':""}<button id="journal-done" class="primary">BACK TO GARAGE</button>`),P("journal-done").onclick=Gn,P("journal-ulti")&&(P("journal-ulti").onclick=um)}var Jp=-1/0;function _M(i){i-Jp>1e3&&(Jp=i,ka());let e=Ku(w,{modalOpen:!P("modal-backdrop").hidden}),t=e.question;document.body.classList.contains("reading-zone")!==t&&Es(),document.body.classList.toggle("reading-zone",t),document.body.dataset.hudPhase=e.phase;let n=se.focusCruise(w),s=n&&w.focusAuto?.returning!=null,r=se.canShortenFocus(w);if(document.body.classList.toggle("focus-cruise",n),document.body.classList.toggle("repair-cruise",se.repairCruise(w)),document.body.style.setProperty("--focus-amount",n?Math.max(0,Math.min(1,w.focusAmount||0)):0),document.body.dataset.focusPhase=s?"return":n?"cruise":"off",P("throttle").disabled=!1,P("throttle").setAttribute("aria-label",n?r?"Hold to return to normal pace sooner.":Mu()?"Acceleration held. Quick return begins after your choice is ready.":"Autopilot holds your entry speed. After choosing, hold to return to normal pace sooner.":"Hold to accelerate"),document.body.classList.toggle("accelerating",!!w?.accelerating&&w.speedFactor>.05),!w){Yp(i,e);return}P("controls").hidden=Yt||!["driving","task","resolving"].includes(w.status),Mc(),document.body.classList.toggle("nitro-active",!!w.nitroActive&&["driving","resolving"].includes(w.status));let a=se.raceOrder(w),o=a.findIndex(C=>C.id==="player")+1,c=se.raceFailed(w);nt("race-place",c?"DNF":w.reviewLap?"REVIEW":o+" / 3"),nt("place-label",c?"STATUS":w.reviewLap?"LAP":"POSITION"),fc!==null&&o<fc&&w.status==="driving"&&(vs(o===1?"Taking the lead":"Clean overtake",!1,()=>w&&se.raceOrder(w).findIndex(C=>C.id==="player")+1===o),e.announcementsAllowed&&Ze.tone("overtake")),fc=o;let l=se.carCondition(w),h=P("car-condition");h.dataset.damage=String(l.damage),h.setAttribute("aria-label",l.broken?"Car condition: broken down":`Car condition: ${l.remaining} ${l.remaining===1?"hit":"hits"} remaining${l.critical?"; critical":""}`),[...h.children].forEach((C,U)=>C.classList.toggle("intact",U<l.remaining)),document.body.classList.toggle("car-critical",l.critical),document.body.classList.toggle("car-breaking",w.status==="breakdown");let u=P("condition-notice");u.hidden=!w.lastImpact||w.elapsed-w.lastImpact.at>2.4||!["driving","breakdown"].includes(w.status)||se.learningPaceProtected(w),u.dataset.damage=String(l.damage),u.hidden||nt("condition-notice",l.broken?"CAR BROKEN DOWN":l.critical?"CRITICAL \xB7 ONE HIT LEFT":"DAMAGED \xB7 TWO HITS LEFT"),P("pause").hidden=["breakdown","finished","failed"].includes(w.status),nt("fuel-value",w.fuel),P("fuel-fill").style.width=w.fuel+"%",nt("streak-count",w.streak),P("fuel-value").parentElement.setAttribute("aria-label","Fuel "+w.fuel+" out of 100"),P("streak-count").parentElement.setAttribute("aria-label","English streak "+w.streak),[...P("streak-pips").children].forEach((C,U)=>C.classList.toggle("lit",U<(w.streak?(w.streak-1)%3+1:0)));let f=se.canEngageNitro(w),d=se.canNitro(w),m=w.nitro>0?w.nitroLevel||1:0;P("nitro").disabled=!f,P("nitro-stack").disabled=!d,P("nitro-stack").setAttribute("aria-label",m===3?"Maximum charge level reached":"Add Nitro charge: 30 fuel"),nt("stack-label",m===3?"MAX":"30"),P("nitro").classList.toggle("ready",f),P("nitro").classList.toggle("saved",m>0&&!w.nitroActive),document.body.classList.toggle("nitro-ready",f),nt("nitro-title",m&&!w.nitroActive?"SAVED":m===3?"MAX POWER":m===2?"DOUBLE":"NITRO"),nt("nitro-label",m?w.nitro.toFixed(1)+"s"+(w.nitroActive?"":" \xB7 HOLD"):w.fuel>=30?"HOLD \xB7 30":w.fuel+" / 30"),[...P("nitro-slots").children].forEach((C,U)=>C.classList.toggle("lit",U<m)),P("nitro-ring-fill").style.strokeDashoffset=String(100*(1-(m?w.nitro/(se.NITRO_DURATION*m):Math.min(1,w.fuel/30)))),P("nitro").style.setProperty("--charge",m?w.nitro/(se.NITRO_DURATION*m):Math.min(1,w.fuel/30)),P("nitro").setAttribute("aria-pressed",String(!!w.nitroHeld)),P("nitro").setAttribute("aria-label",m?`Hold to use saved level ${m} Nitro: ${w.nitro.toFixed(1)} seconds remaining; release to save`:"Hold to load and use Nitro: 30 fuel");let x=P("touch-nitro");x.hidden=!Yt||!["driving","task","resolving"].includes(w.status),nt("touch-nitro-state",w.nitroActive?"BOOST \xD7"+m:m?"SAVED \xD7"+m:f?"NITRO":"FUEL"),nt("touch-fuel",w.fuel),x.classList.toggle("boosting",!!w.nitroActive),x.classList.toggle("ready",f),P("touch-nitro-fill").style.width=Math.min(100,100*(m?w.nitro/(se.NITRO_DURATION*m):w.fuel/30))+"%",[...P("touch-nitro-levels").children].forEach((C,U)=>C.classList.toggle("lit",U<m)),x.setAttribute("aria-label",`Nitro ${w.nitroActive?"boosting":m?"saved":"ready at 30 fuel"}; level ${m} of 3; fuel ${w.fuel} out of 100${m?"; "+w.nitro.toFixed(1)+" seconds saved":""}`);let g=w.nitroActive?m:0;g&&g!==vu&&(Ze.tone("nitro"+g),ni("go")),vu=g;let p=wt.rivalProjection(),v=Np(p.map(C=>({...C,distance:(w.rivals.find(U=>U.id===C.id)?.at??0)-w.distance})),{width:wt.viewport?.width||innerWidth,top:Ua.hudBottom+(e.approaching||e.route?60:0),bottom:Ua.controlsTop});for(let C of P("rival-tags").children){let U=w.rivals.find(N=>N.id===+C.dataset.rival),D=p.find(N=>N.id===U.id);C.hidden=!v.includes(U.id)||t||["finished","failed"].includes(w.status),C.style.left=(D?.x||0)+"px",C.style.top=(D?.y||0)+"px",C.classList.toggle("boosting",!!U.nitroActive),C.querySelector("small").textContent=(U.nitroActive?"NITRO \xB7 ":"")+(U.at>=w.distance?"+":"")+Math.round(U.at-w.distance)+"m"}let b=Math.max(0,Math.ceil(w.time)),_=Math.min(100,w.distance/w.arena.length*100);nt("time",Math.floor(b/60)+":"+String(b%60).padStart(2,"0")),P("time").parentElement.classList.toggle("urgent",b<20),P("progress-fill").style.width=_+"%",P("progress-fill").parentElement.setAttribute("aria-valuenow",String(Math.round(_))),nt("road-fairness",se.learningPaceProtected(w)?"TASK PACE PROTECTED \xB7 RIVALS MATCH YOU":"");let I=Zu(w,se.REGULAR_MAX_SPEED,se.MAX_SPEED);nt("speed",I),P("throttle").style.setProperty("--speed-fill",I/200),document.body.dataset.nitroLevel=String(w.nitroActive&&["driving","resolving"].includes(w.status)?w.nitroLevel||1:0),P("throttle").setAttribute("aria-pressed",String(!!w.accelerating||n&&Mu()));let S=w.route?.coaster?w.route:null,A=!!S&&!_r().reduced&&se.coasterHeight(S,w.distance+5)<se.coasterHeight(S,w.distance)-.9;P("speedlines").classList.toggle("boost",(w.boost>0||A)&&w.status==="driving"),P("speedlines").classList.toggle("focus",w.status==="task"),P("speedlines").classList.toggle("accelerating",w.accelerating&&w.speedFactor>.05),P("left").setAttribute("aria-label",w.status==="task"&&w.task.kind==="pedestrian"?"Send visitor left":"Steer left"),P("right").setAttribute("aria-label",w.status==="task"&&w.task.kind==="pedestrian"?"Send visitor right":"Steer right");let R=w.status==="task"&&w.task?.kind==="pedestrian";if(P("left").disabled=P("right").disabled=R?w.task.pedWait>0||!se.pedestrianReady(w):se.steeringLocked(w)||!!se.exitAssist(w)||!!w.route,nt("drive-hint",s?"RESUMING":r?window.matchMedia("(pointer: coarse)").matches?"HOLD TO RESUME":"HOLD \u2191 TO RESUME":n?se.steeringLocked(w)?"AUTO CRUISE":"FOCUS \xB7 STEER":w.speedFactor<.05&&(w.yielding||w.followingTraffic)?w.yielding?"WAITING":"CHANGE LANE":se.exitAssist(w)?"ACCELERATE":w.route?w.route.shortcut?"SHORTCUT":"DETOUR":w.nitroActive?"NITRO BOOST":w.accelerating?"ACCELERATING":window.matchMedia("(pointer: coarse)").matches?"HOLD TO DRIVE":"HOLD \u2191"),w.notice){let C=w.notice;w.notice=null,C.type==="nitro"?vs(C.text,!1,()=>w?.nitro>0):C.type==="collision"||C.type==="breakdown"?(P("hit-flash").classList.remove("active"),P("hit-flash").offsetWidth,P("hit-flash").classList.add("active"),Ze.tone(C.type==="breakdown"?"breakdown":"collision"),ni("collision")):C.type==="correct"||C.type==="sorted"?(Ze.tone("correct"),ni("correct"),vs(C.text)):C.type==="wrong"&&(Ze.tone("wrong"),vs(C.text,!0))}if(w.status==="countdown"){P("countdown").hidden=!1;let C=Math.max(1,Math.ceil(w.countdown));C!==yu&&(yu=C,nt("launch-number",C),P("countdown").dataset.step=C,[...P("countdown").querySelectorAll(".launch-lights i")].forEach((U,D)=>U.classList.toggle("lit",D<4-C)),Ze.tone("tick"),ni("click"))}if(w.status!=="countdown"&&!P("countdown").hidden&&(P("countdown").hidden=!0),w.status!==La){let C=La;La=w.status,Wt.enabled&&!w.leagueTicket&&!w.reviewLap&&w.taskIndex!==Zp&&(Zp=w.taskIndex,performance.now()-om>4e3&&cm(w)),w.status==="driving"&&(P("countdown").hidden=!0,P("controls").hidden=Yt,P("road-learning").hidden=!0,C==="countdown"&&(Ze.tone("go"),ni("go"),vs("GO \xB7 FIND YOUR LINE"))),w.status==="task"&&(P("controls").hidden=Yt,P("warning").hidden=!0),["finished","failed"].includes(w.status)&&!yc&&xM()}let y=e.route,M=!!y&&!e.approaching&&!t&&!["finished","failed"].includes(w.status);if(P("route-status").hidden=!M,M){let C=!w.route;P("route-status").classList.toggle("detour",!y.shortcut),nt("route-label",C?"MERGING":y.coaster?"SKY COASTER \xB7 \u221218m":y.shortcut?"SHORTCUT \xB7 \u221218m":"DETOUR \xB7 +32m"),nt("route-remaining",Math.max(0,Math.ceil((C?y.exitEndAt:y.end)-w.distance))+"m"),P("route-status").style.setProperty("--route-progress",se.clamp((w.distance-y.start)/(y.exitEndAt-y.start),0,1))}if(P("warning").hidden=!e.approaching,e.approaching){let C=e.next.kind;P("warning-title").textContent={light:"Traffic light ahead",repair:"Road repair ahead",junction:"Choose your route",pedestrian:"Crosswalk ahead"}[C],nt("warning-sub",e.next.coaster?"The right answer rides the Sky Coaster!":"Get ready to read."),P("warning-icon").textContent={light:"\u25CF",repair:"\u25B0",junction:"\u2442",pedestrian:"\u2194"}[C],nt("warning-distance",Math.ceil(e.ahead)+"m")}rm(),gM(),Yp(i,e)}function Au(){return Ze.unlock(),se.activateNitro(w)?(ni("go"),!0):!1}P("nitro").addEventListener("pointerdown",i=>{i.button>0||bs!==null||(i.preventDefault(),se.engageNitro(w)&&(Ze.unlock(),bs=i.pointerId,P("nitro").setPointerCapture(i.pointerId),ft()))});for(let i of["pointerup","pointercancel","lostpointercapture"])P("nitro").addEventListener(i,e=>{bs===e.pointerId&&(bs=null,ft(),P("nitro").hasPointerCapture?.(e.pointerId)&&P("nitro").releasePointerCapture(e.pointerId))});P("nitro").addEventListener("keydown",i=>{(i.code==="Space"||i.key==="Enter")&&(!i.repeat&&se.engageNitro(w)&&(Ts=!0,Ze.unlock(),ft()),i.preventDefault(),i.stopPropagation())});P("nitro").addEventListener("keyup",i=>{(i.code==="Space"||i.key==="Enter")&&(Ts=!1,ft(),i.preventDefault(),i.stopPropagation())});P("nitro").addEventListener("blur",()=>{Ts=!1,ft()});P("nitro-stack").addEventListener("keydown",i=>{(i.key===" "||i.key==="Enter")&&i.stopPropagation()});function Ss(i){Ze.unlock(),w&&se.move(w,i)&&(Ze.tone("click"),ni("click"))}document.querySelectorAll("[data-team]").forEach(i=>i.onclick=()=>{K.teamId=i.dataset.team,Ze.tone("click"),ws()});P("league-button").onclick=um;hm();Wt.enabled&&(Wt.flush().catch(()=>{}),Wt.refresh(K.grade).then(ka,()=>{}));P("lesson-picker").onclick=oM;document.querySelectorAll("[data-diff]").forEach(i=>i.onclick=()=>{K.difficulty=i.dataset.diff,Zt=0,ws()});P("settings").onclick=am;P("start").onclick=()=>{Ze.unlock(),K.crosswalkTutorial?yr():wu(!0)};P("help").onclick=()=>wu();P("progress-button").onclick=yM;P("garage-button").onclick=mc;P("nitro").onclick=i=>{i.detail===0&&w&&w.nitro<=0&&Au()};P("nitro-stack").onclick=Au;P("pause").onclick=Sr;P("brand-home").onclick=i=>{i.preventDefault(),dM()};for(let[i,e]of[["left",-1],["right",1]])P(i).onpointerdown=t=>{t.button>0||(t.preventDefault(),Ss(e))},P(i).onclick=t=>{t.detail===0&&Ss(e)};P("sound").onclick=()=>{K.sound=!K.sound,Ze.unlock(),vc(),Hn(),Ze.tone("click")};P("throttle").addEventListener("pointerdown",i=>{i.button>0||zi!==null||!w||!["driving","task","resolving"].includes(w.status)||(i.preventDefault(),zi=i.pointerId,P("throttle").setPointerCapture(i.pointerId),Ze.unlock(),ft())});for(let i of["pointerup","pointercancel","lostpointercapture"])P("throttle").addEventListener(i,e=>{zi===e.pointerId&&(zi=null,ft(),P("throttle").hasPointerCapture?.(e.pointerId)&&P("throttle").releasePointerCapture(e.pointerId))});P("throttle").addEventListener("keydown",i=>{i.key==="Enter"&&(!i.repeat&&w&&["driving","task","resolving"].includes(w.status)&&(br=!0,Ze.unlock(),ft()),i.preventDefault(),i.stopPropagation())});P("throttle").addEventListener("keyup",i=>{i.key==="Enter"&&(br=!1,ft(),i.preventDefault(),i.stopPropagation())});P("throttle").addEventListener("blur",()=>{br=!1,ft()});var Pt=null;P("world").addEventListener("pointerdown",i=>{if(i.button>0||Pt&&Pt.id!==i.pointerId)return;(i.pointerType==="touch"||i.pointerType==="pen")&&Oa(!0);let e=Su||i.pointerType==="touch"||i.pointerType==="pen"||Yt&&i.pointerType!=="mouse",t=w&&(["driving","task","resolving"].includes(w.status)||e&&w.status==="countdown");if(t&&(i.preventDefault(),Qp()),!t)return;let n=e||wt.isCarHit(i.clientX,i.clientY);Pt={x:i.clientX,y:i.clientY,id:i.pointerId,hold:n,touch:e,drive:e?$u(i.clientX,i.clientY):null,nitroAllowed:se.canEngageNitro(w)},P("world").setPointerCapture(i.pointerId),n&&(dn=i.pointerId,P("world").setPointerCapture(i.pointerId),Ze.unlock(),ft(),i.preventDefault())});function fm(i){if(Pt?.id!==i.pointerId)return;if(Pt.touch){let t=Rc(Pt.drive,i.clientX,i.clientY);if(i.preventDefault(),t.steer&&Ss(t.steer),t.boostChanged&&!t.boost&&(on=null),t.boost&&(t.boostChanged||t.levelChanged)&&se.canEngageNitro(w)&&se.engageNitro(w))for(Ze.unlock(),on=i.pointerId;(w.nitroLevel||0)<t.level&&se.canNitro(w);)se.activateNitro(w);ft();return}let e=qu(Pt,i.clientX,i.clientY);e&&(i.preventDefault(),dn=null,Pt.hold=!1,ft(),e.type==="steer"?Ss(e.direction):e.type==="nitro"&&Pt.nitroAllowed&&se.engageNitro(w)&&(Ze.unlock(),on=i.pointerId,ft()))}P("world").addEventListener("pointermove",fm);P("world").addEventListener("pointerup",i=>{if(Pt?.id===i.pointerId&&Pt.touch){let t=Rc(Pt.drive,i.clientX,i.clientY);t.steer&&Ss(t.steer),vM(i.pointerId);return}on===i.pointerId&&(on=null,ft()),dn===i.pointerId&&(dn=null,ft()),Pt?.id===i.pointerId&&(fm(i),Pt=null),on===i.pointerId&&(on=null,ft()),P("world").hasPointerCapture?.(i.pointerId)&&P("world").releasePointerCapture(i.pointerId)});function vM(i){Pt?.id===i&&(Pt=null),on===i&&(on=null),dn===i&&(dn=null),ft(),P("world").hasPointerCapture?.(i)&&P("world").releasePointerCapture(i)}P("world").addEventListener("pointercancel",i=>{on===i.pointerId&&(on=null,ft()),dn===i.pointerId&&(dn=null,ft()),Pt?.id===i.pointerId&&(Pt=null)});P("world").addEventListener("lostpointercapture",i=>{on===i.pointerId&&(on=null,ft()),dn===i.pointerId&&(dn=null,ft()),Pt?.id===i.pointerId&&(Pt=null)});document.addEventListener("keydown",i=>{if(!["SELECT","INPUT"].includes(document.activeElement.tagName)){if(!P("modal-backdrop").hidden){if(i.key==="Tab"){let e=[...P("modal").querySelectorAll('button:not(:disabled),select,summary,[tabindex="0"]')],t=e[0],n=e.at(-1);i.shiftKey&&(document.activeElement===t||document.activeElement===P("modal"))?(n?.focus(),i.preventDefault()):!i.shiftKey&&document.activeElement===n&&(t?.focus(),i.preventDefault())}if(i.key==="Escape"&&P("lesson-cancel")){P("lesson-cancel").click();return}if(i.key==="Escape"&&P("settings-done")){P("settings-done").click();return}i.key==="Escape"&&w?.status==="paused"&&(P("resume")?.click(),!P("resume")&&P("help-done")&&P("help-done").click());return}if(i.key==="ArrowUp"&&w&&["driving","task","resolving"].includes(w.status)){i.repeat||(za=!0,Ze.unlock(),ft()),i.preventDefault();return}if(i.key===" "&&w){!i.repeat&&se.engageNitro(w)&&(Ts=!0,Ze.unlock(),ft()),i.preventDefault();return}if(!i.repeat&&w&&["n","N"].includes(i.key)){Au(),i.preventDefault();return}i.repeat||((i.key==="ArrowLeft"||i.key.toLowerCase()==="a")&&(Ss(-1),i.preventDefault()),(i.key==="ArrowRight"||i.key.toLowerCase()==="d")&&(Ss(1),i.preventDefault()),(i.key==="Escape"||i.key.toLowerCase()==="p")&&Sr(),w?.status==="task"&&/^[1-3]$/.test(i.key)&&(w.task.kind==="repair"?Sc(w.task.order[Number(i.key)-1]):w.task.kind==="pedestrian"?i.key!=="2"&&se.sortPerson(w,i.key==="1"?0:1):se.choose(w,Number(i.key)-1),i.preventDefault()),Mr==="home"&&i.key==="Enter"&&P("start").click())}});document.addEventListener("keyup",i=>{i.key===" "&&(Ts=!1,ft(),w&&i.preventDefault()),i.key==="ArrowUp"&&(za=!1,ft(),w&&i.preventDefault())});window.addEventListener("blur",()=>{Ha(),Sr()});document.addEventListener("visibilitychange",()=>{document.hidden?Sr():ka()});document.addEventListener("graphicslost",()=>{Sr(),P("graphics-error").hidden=!1});try{wt=new oc(P("world"))}catch(i){console.error(i),P("graphics-error").hidden=!1,P("loading").hidden=!0}ws();vc();Eu();var jp=performance.now(),gu=0;function pm(i){let e=(i-jp)/1e3,t=Math.min(e,.06);jp=i,wt?.samplePerformance(e,!!w&&["driving","task","resolving"].includes(w.status)),ft(),w&&se.tick(w,t,wt?.currentLane??w.lane),gu=!P("modal-backdrop").hidden&&(!w||["paused","finished","failed"].includes(w.status))?gu+1:0,gu%6===0&&wt?.update(t,w,Mr),_M(i),Ze.update(w,wt?.spectators?.proximity||0),i>Oi&&P("toast").classList.remove("visible"),Da&&i>Da&&(nt("road-feedback",""),Da=0),requestAnimationFrame(pm)}requestAnimationFrame(pm);setTimeout(()=>P("loading").hidden=!0,500);window.WORDRAMP=window.WORDRIFT=window.WORDSHIFT={version:"0.25.0",ulti:Object.freeze({snapshot:i=>Wt.snapshot(i??K.grade),enabled:Wt.enabled}),get race(){return w},get settings(){return K},get scene(){return wt}};})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
