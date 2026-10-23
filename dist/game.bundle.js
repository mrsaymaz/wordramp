(()=>{var zu="wordramp",Hu="https://mrsaymaz.netlify.app/api/ulti",wm=Object.freeze(["gryffindor","hufflepuff","slytherin","ravenclaw"]),Tm=Object.freeze({capacity:100,maxStrength:2,hours:72}),ku="wordramp-league.v1",Am=48*36e5,Rm=47*36e5;function Gu(i){return i&&typeof i.ultiApi=="string"?i.ultiApi.trim():Hu}function Cm(i,e,t=Date.now()){let n=t-e*36e5;return(Array.isArray(i)?i:[]).reduce((s,[r,a])=>r*6e4>n&&Number.isFinite(a)?s+a:s,0)}function Im(i,e,t){return e>0?1+(t-1)*Math.sqrt(Math.min(Math.max(i,0),e)/e):1}var Vu=i=>"x"+i.toFixed(2);function Pm(i){let e=i?.games?.[zu];return i&&i.enabled!==!1&&e&&e.enabled!==!1?e:null}function Wu(i){return i%24===0?`${i/24} day${i===24?"":"s"}`:`${i} hours`}function Lm(i=24){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=new Uint8Array(i);if(globalThis.crypto?.getRandomValues)globalThis.crypto.getRandomValues(t);else for(let n=0;n<i;n++)t[n]=Math.floor(Math.random()*256);return Array.from(t,n=>e[n%e.length]).join("")}function Xu({api:i=Hu,storage:e=globalThis.localStorage,fetchImpl:t=globalThis.fetch?.bind(globalThis),now:n=()=>Date.now(),timeoutMs:s=8e3}={}){let r=!!i,a={},o=()=>{try{let S=e?.getItem(ku);if(S){let A=JSON.parse(S);if(A&&typeof A=="object")return A}}catch{}return a},c=S=>{a=S;try{e?.setItem(ku,JSON.stringify(S))}catch{}},l=()=>{let S=o();return S.pools||={},S.outbox||=[],S.tickets||={},S};function h(){let S=l();return(typeof S.device!="string"||!/^[A-Za-z0-9_-]{8,64}$/.test(S.device))&&(S.device=Lm(),c(S)),S.device}async function u(S){if(!r||!t)return{kind:"off"};let A=typeof AbortController=="function"?new AbortController:null,R=A?setTimeout(()=>A.abort(),s):null;try{let M=await t(i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(S),signal:A?.signal}),y=null;try{y=await M.json()}catch{}return M.status>=500||y?.retry===!0?{kind:"retry",status:M.status,data:y}:M.ok&&y?.status==="success"?{kind:"ok",data:y}:{kind:"refused",status:M.status,data:y}}catch{return{kind:"retry"}}finally{R&&clearTimeout(R)}}function d(S){let A=l();if(S?.settings&&typeof S.settings=="object"&&(A.settings=S.settings),S?.pools&&typeof S.pools=="object")for(let[R,M]of Object.entries(S.pools))A.pools[R]={at:n(),pool:M};c(A)}function f(S){let A=l(),R=A.settings||null,M={...Tm,...R||{}},y=A.pools[S]?.pool||{},P=n(),N=wm.map(B=>{let H=Cm(y[B]?.entries,M.hours,P);return{id:B,points:H,players:y[B]?.players||0,strength:Im(H,M.capacity,M.maxStrength)}});return{enabled:r,known:!!R,settings:R,game:Pm(R),capacity:M.capacity,hours:M.hours,teams:N,updatedAt:A.pools[S]?.at||null}}async function m(S){if(!r)return f(S);let A=await u({action:"pools",grade:S});return A.kind==="ok"&&d(A.data),{...f(S),online:A.kind==="ok"}}function x(S){let A=n();for(let[R,M]of Object.entries(S.tickets))(!M||A-M.at>Am)&&delete S.tickets[R];S.outbox=S.outbox.filter(R=>R&&A-R.at<=Rm)}async function g({runId:S,grade:A,team:R,arena:M,pace:y,unit:P=""}){if(!r)return null;let N=l().tickets[S];if(N)return N.ticket;let B=await u({action:"start",game:zu,grade:A,team:R,arena:M,pace:y,unit:String(P).replace(/[^A-Za-z0-9_-]/g,"").slice(0,24),device:h()});if(B.kind!=="ok"||typeof B.data.ticket!="string")return null;let H=l();return x(H),H.tickets[S]={ticket:B.data.ticket,at:n(),grade:A,team:R},c(H),B.data.ticket}let p=S=>l().tickets[S]?.ticket||null;async function v(S){let A=await u({action:"claim",ticket:S,device:h()});if(A.kind==="ok"){d(A.data);let R=A.data;return{state:"counted",points:R.points||0,requested:R.requested,deviceWins:R.deviceWins,reason:R.reason||null,duplicate:!!R.duplicate}}return A.kind==="refused"?{state:"refused",reason:A.data?.reason||"refused"}:{state:"retry"}}async function b(S){if(!r)return{state:"off"};let A=l(),R=A.tickets[S];if(!R)return{state:"no-ticket"};delete A.tickets[S],c(A);let M=await v(R.ticket);if(M.state==="retry"){let y=l();return y.outbox.push({ticket:R.ticket,at:R.at,grade:R.grade,team:R.team}),x(y),c(y),{state:"queued"}}return M}async function _(){if(!r)return[];let S=l();x(S),c(S);let A=[];for(let R of S.outbox.slice()){let M=await v(R.ticket);if(M.state!=="retry"){let y=l();y.outbox=y.outbox.filter(P=>P.ticket!==R.ticket),c(y)}A.push({...R,...M})}return A}return{enabled:r,device:h,refresh:m,snapshot:f,start:g,ticketFor:p,claim:b,flush:_,outbox:()=>l().outbox.slice()}}var Ic=Object.freeze([{id:"slytherin",name:"Slytherin",color:3314796,accent:"#8ce4bd",letter:"S"},{id:"hufflepuff",name:"Hufflepuff",color:15317056,accent:"#ffe09b",letter:"H"},{id:"gryffindor",name:"Gryffindor",color:13125971,accent:"#ffadb1",letter:"G"},{id:"ravenclaw",name:"Ravenclaw",color:4685774,accent:"#a5caff",letter:"R"}].map(Object.freeze)),Ar=2,Rr=.6;function Cr(i){return!i||i.status!=="finished"||i.failureReason||i.breakdown||(i.damage||0)>=3?!1:!Number.isFinite(i.arena?.length)||Number.isFinite(i.distance)&&i.distance>=i.arena.length}var sn=i=>Ic.find(e=>e.id===i)||null;function qu(i="run"){let e=globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+"-"+Math.random().toString(36).slice(2)+"-"+Math.random().toString(36).slice(2);return i+"-"+e}function $u(i,e,t){if(!Cr(i)||i.reviewLap||e!==1||!sn(i.teamId)||typeof i.runId!="string"||!i.runId)return"none";let n=i.tasks?.length&&Number.isFinite(i.correct)?i.correct/i.tasks.length:null;return(i.difficulty!=="challenge"&&i.difficulty!=="standard"&&n!=null?n>=Rr-1e-9:t>=Ar)?"qualified":"accuracy"}function Yu(i){let e=!!i&&"ulti"in i;return e&&delete i.ulti,e}var $a=class{constructor(e){this.enabled=e,this.ctx=null,this.engine=null,this.arena=-1}unlock(){if(this.enabled())try{if(this.ctx||=new(window.AudioContext||window.webkitAudioContext),this.ctx.resume().catch(()=>{}),this.engine)return;let e=this.ctx;this.compressor=e.createDynamicsCompressor(),this.compressor.threshold.value=-18,this.compressor.ratio.value=4,this.compressor.connect(e.destination),this.master=e.createGain(),this.master.gain.value=.7,this.master.connect(this.compressor),this.focusFilter=e.createBiquadFilter(),this.focusFilter.type="lowpass",this.focusFilter.frequency.value=16e3,this.world=e.createGain(),this.world.gain.value=1,this.world.connect(this.focusFilter),this.focusFilter.connect(this.master);let t=(c,l)=>{let h=e.createOscillator(),u=e.createGain();return h.type=c,u.gain.value=0,h.connect(u),u.connect(l),h.start(),[h,u]};this.engineFilter=e.createBiquadFilter(),this.engineFilter.type="lowpass",this.engineFilter.frequency.value=500,this.engineFilter.Q.value=1.4,this.engineFilter.connect(this.world),[this.engine,this.engineGain]=t("sawtooth",this.engineFilter),[this.sub,this.subGain]=t("triangle",this.engineFilter),[this.harmonic,this.harmonicGain]=t("sine",this.world);let n=(c,l)=>{let h=e.createBuffer(1,e.sampleRate*c,e.sampleRate),u=h.getChannelData(0),d=0;for(let f=0;f<u.length;f++)d=l(d,Math.random()*2-1,f),u[f]=d;return h};this.noiseBuffer=n(2,(c,l)=>(c+l*.02)/1.02*1||0);{let c=this.noiseBuffer.getChannelData(0);for(let l=0;l<c.length;l++)c[l]*=3.5}this.whiteBuffer=n(2,(c,l)=>l);let s=(c,l,h,u=.7)=>{let d=e.createBufferSource(),f=e.createBiquadFilter(),m=e.createGain();return d.buffer=c,d.loop=!0,f.type=l,f.frequency.value=h,f.Q.value=u,m.gain.value=0,d.connect(f),f.connect(m),m.connect(this.world),d.start(),{source:d,filter:f,gain:m}};this.wind=s(this.noiseBuffer,"lowpass",450),this.windGain=this.wind.gain,this.filter=this.wind.filter,this.nitroLayer=s(this.whiteBuffer,"bandpass",1600,.9),[this.whine,this.whineGain]=t("sine",this.world),this.ambience=s(this.noiseBuffer,"lowpass",260,.5),this.ambienceSwell=e.createOscillator(),this.ambienceDepth=e.createGain(),this.ambienceDepth.gain.value=0,this.ambienceSwell.frequency.value=.12,this.ambienceSwell.connect(this.ambienceDepth),this.ambienceDepth.connect(this.ambience.gain.gain),this.ambienceSwell.start();let r=e.createBuffer(1,e.sampleRate*3,e.sampleRate),a=r.getChannelData(0),o=0;for(let c=0;c<a.length;c++)o=(o+(Math.random()*2-1)*.12)/1.12,a[c]=o*(.65+.35*Math.sin(c/e.sampleRate*3.7));this.crowdBuffer=r,this.crowd=s(r,"bandpass",850,.45),this.crowdGain=this.crowd.gain}catch(e){console.warn("Wordramp audio unavailable",e)}}setArena(e){if(!this.ambience||e===this.arena)return;this.arena=e;let t=this.ctx.currentTime,n=this.ambience,s=[{type:"lowpass",f:240,q:.5,depth:.004},{type:"bandpass",f:520,q:.6,depth:.018},{type:"highpass",f:2600,q:.4,depth:.003}][e]||{type:"lowpass",f:240,q:.5,depth:0};n.filter.type=s.type,n.filter.frequency.setTargetAtTime(s.f,t,.3),n.filter.Q.value=s.q,this.swellDepth=s.depth}voice(e,t,n,s,r,a=this.master,o=null){let c=this.ctx.createOscillator(),l=this.ctx.createGain();c.type=e,c.frequency.setValueAtTime(t,n),o&&c.frequency.exponentialRampToValueAtTime(o,n+s),l.gain.setValueAtTime(1e-4,n),l.gain.exponentialRampToValueAtTime(r,n+.012),l.gain.exponentialRampToValueAtTime(1e-4,n+s),c.connect(l),l.connect(a),c.start(n),c.stop(n+s+.02),c.onended=()=>{c.disconnect(),l.disconnect()}}burst(e,t,n,s,r,a=this.whiteBuffer){let o=this.ctx.createBufferSource(),c=this.ctx.createBiquadFilter(),l=this.ctx.createGain();o.buffer=a,c.type=s,c.frequency.value=r,l.gain.setValueAtTime(1e-4,e),l.gain.exponentialRampToValueAtTime(n,e+.006),l.gain.exponentialRampToValueAtTime(1e-4,e+t),o.connect(c),c.connect(l),l.connect(this.master),o.start(e,Math.random(),t+.05),o.onended=()=>{o.disconnect(),c.disconnect(),l.disconnect()}}tone(e){if(!this.enabled()||!this.ctx||!this.master)return;if(/^nitro[123]$/.test(e)){this.boost(+e.at(-1));return}let t=this.ctx.currentTime;if(e==="correct"){[659,880,1318].forEach((s,r)=>{this.voice("triangle",s,t+r*.07,.24,.075),this.voice("sine",s*2,t+r*.07,.16,.02)});return}if(e==="wrong"){this.voice("triangle",233,t,.22,.07),this.voice("triangle",196,t+.11,.3,.065);return}if(e==="collision"){this.voice("sine",140,t,.32,.22,this.master,42),this.burst(t,.18,.16,"lowpass",1400),this.burst(t+.02,.08,.07,"highpass",3200);return}if(e==="breakdown"){[110,92,74,58].forEach((s,r)=>this.voice("sawtooth",s,t+r*.17,.32,.06)),this.burst(t,.5,.12,"lowpass",700);return}if(e==="finish"){[523,659,784,1046,1318].forEach((s,r)=>{this.voice("triangle",s,t+r*.11,.4,.07),this.voice("sine",s/2,t+r*.11,.4,.03)});return}if(e==="go"){[392,587,784].forEach((s,r)=>this.voice("square",s,t+r*.08,.18,.035));return}if(e==="tick"){this.voice("square",440,t,.12,.03);return}({click:[520],build:[493,740],pause:[330],overtake:[740,988]}[e]||[440]).forEach((s,r)=>this.voice("sine",s,t+r*.065,.2,e==="click"?.035:.08))}boost(e){let t=this.ctx,n=t.currentTime,s=t.createBufferSource(),r=t.createBiquadFilter(),a=t.createGain();s.buffer=this.noiseBuffer,r.type="bandpass",r.Q.value=.65,r.frequency.setValueAtTime(1800+e*350,n),r.frequency.exponentialRampToValueAtTime(250,n+.42),a.gain.setValueAtTime(1e-4,n),a.gain.exponentialRampToValueAtTime(.16+e*.025,n+.025),a.gain.exponentialRampToValueAtTime(1e-4,n+.5),s.connect(r),r.connect(a),a.connect(this.master),s.start(n),s.stop(n+.52),s.onended=()=>{s.disconnect(),r.disconnect(),a.disconnect()},this.voice("triangle",150+e*25,n,.34,.085,this.master,52)}applause(){if(!this.enabled()||!this.ctx||!this.crowd)return;let e=this.ctx,t=e.currentTime;for(let n=0;n<3;n++){let s=e.createBufferSource(),r=e.createBiquadFilter(),a=e.createGain(),o=t+n*.14;s.buffer=this.crowdBuffer,r.type="highpass",r.frequency.value=1200,a.gain.setValueAtTime(1e-4,o),a.gain.exponentialRampToValueAtTime(.095,o+.006),a.gain.exponentialRampToValueAtTime(1e-4,o+.085),s.connect(r),r.connect(a),a.connect(this.master),s.start(o,n*.31,.1),s.onended=()=>{s.disconnect(),r.disconnect(),a.disconnect()}}}update(e,t=0){if(!this.ctx||!this.engine)return;e&&this.setArena(e.arenaIndex??0);let n=this.enabled(),s=n&&e&&["driving","task","resolving","breakdown"].includes(e.status),r=s?Math.max(0,e.speedFactor):0,a=this.ctx.currentTime,o=Math.floor(r*2.2),c=(52+r*30-o*8)*(e?.status==="breakdown"?.65+Math.abs(Math.sin(e.elapsed*24))*.25:1),l=e?.accelerating||e?.nitroActive?1:.55;this.engine.frequency.setTargetAtTime(c,a,.1),this.sub.frequency.setTargetAtTime(c*.5,a,.1),this.harmonic.frequency.setTargetAtTime(c*2.01,a,.12),this.engineFilter.frequency.setTargetAtTime(260+r*520*l,a,.15),this.engineGain.gain.setTargetAtTime(s?(.016+r*.006)*l:0,a,.1),this.subGain.gain.setTargetAtTime(s?.02+r*.004:0,a,.1),this.harmonicGain.gain.setTargetAtTime(s?.004+r*.002:0,a,.12);let h=globalThis.RallyCore,u=s&&h&&e.route?.coaster?e.route:null,d=0;if(u&&this.rideId!==u.id&&(this.rideId=u.id,this.boost(3),this.voice("sawtooth",180,a,.7,.045,this.master,720)),u||(this.rideId=null),u){let p=h.coasterHeight(u,e.distance),v=h.coasterHeight(u,e.distance+2)-p;d=Math.min(.06,Math.max(0,h.coasterPace(u,e.distance)-1)*.04+Math.max(0,-v)*.02),this.rideHeight>.4&&p<.05&&(this.voice("sine",92,a,.3,.11,this.master,46),this.burst(a,.14,.07,"lowpass",850)),this.rideHeight=p}else this.rideHeight=0;this.windGain.gain.setTargetAtTime(s?.008*r*r+d:0,a,.16),this.filter.frequency.setTargetAtTime(300+r*650,a,.2);let f=s&&e.nitroActive?Math.max(1,e.nitroLevel||1):0;this.nitroLayer.gain.gain.setTargetAtTime(f?.018+f*.008:0,a,f?.05:.2),this.nitroLayer.filter.frequency.setTargetAtTime(1300+f*450,a,.1),this.whine.frequency.setTargetAtTime(900+r*260,a,.1),this.whineGain.gain.setTargetAtTime(f?.006+f*.003:0,a,f?.05:.2);let m=n&&e&&!["paused","finished","failed"].includes(e.status);this.ambience.gain.gain.setTargetAtTime(m?[.02,.03,.026][e.arenaIndex??0]??.02:0,a,.5),this.ambienceDepth.gain.setTargetAtTime(m&&this.swellDepth||0,a,.5);let x=n&&e?Math.max(0,Math.min(1,e.focusAmount||0)):0;this.focusFilter.frequency.setTargetAtTime(16e3-x*14800,a,.15),this.world.gain.setTargetAtTime(1-x*.35,a,.15);let g=s&&e.status==="driving"&&!e.yielding?Math.max(0,Math.min(1,t)):0;this.crowdGain.gain.setTargetAtTime(g*.14,a,.3),g>.75&&!this.cheerNear&&(this.cheerNear=!0,this.applause()),g<.25&&(this.cheerNear=!1)}};function Zu(i={},e=!1){return(!i||typeof i!="object")&&(i={}),{graphics:["auto","high","battery"].includes(i.graphics)?i.graphics:"auto",motion:["system","full","reduced"].includes(i.motion)?i.motion:"system",haptics:i.haptics!==!1,reduced:i.motion==="reduced"||i.motion!=="full"&&e}}function Pc(i="auto",e=1){let t=Math.min(e,i==="battery"?1:i==="high"?2:1.75);return{graphics:i,ceiling:t,ratio:t,seconds:0,frames:0,slow:0,cooldown:0}}function Ku(i,e,t=!0){if(!t||i.graphics!=="auto"||e<=0||e>.15||(i.cooldown=Math.max(0,i.cooldown-e),i.seconds+=e,i.frames++,e>1/38&&i.slow++,i.seconds<2.5))return!1;let n=i.slow/i.frames>.35,s=!1;return n&&i.cooldown===0&&i.ratio>.85&&(i.ratio=Math.max(.85,i.ratio-.2),i.cooldown=5,s=!0),i.seconds=0,i.frames=0,i.slow=0,s}function Ju(i,e,t){if(!i||i.dispatched)return null;let n=e-i.x,s=t-i.y;return-s>=44&&-s>Math.abs(n)*1.25?(i.dispatched=!0,{type:"nitro"}):Math.abs(n)>=28&&Math.abs(n)>Math.abs(s)*1.2?(i.dispatched=!0,{type:"steer",direction:Math.sign(n)}):s>=44&&s>Math.abs(n)*1.25?(i.dispatched=!0,{type:"cancel"}):null}function ju(i,e){return{laneX:i,laneY:e,boostBase:e,peakY:e,boost:!1,level:0}}function Lc(i,e,t){let n=e-i.laneX,s=t-i.laneY,r=0,a=!1,o=!1;if(Math.abs(n)>=28&&Math.abs(n)>Math.abs(s)*1.2&&(r=Math.sign(n),i.laneX=e,i.laneY=t,i.boost||(i.boostBase=t)),i.boost){i.peakY=Math.min(i.peakY,t);let c=t-i.peakY;if(c>=28&&c>Math.abs(n)*1.2)i.boost=!1,i.level=0,i.boostBase=t,a=!0;else{let l=Math.min(3,Math.max(1,Math.floor((i.boostBase-t)/44)));l>i.level&&(i.level=l,o=!0)}}else{i.boostBase=Math.max(i.boostBase,t);let c=i.boostBase-t;c>=44&&c>Math.abs(n)*1.2&&(i.boost=!0,i.peakY=t,i.level=Math.min(3,Math.max(1,Math.floor(c/44))),a=!0)}return Math.abs(s)>Math.abs(n)*1.2&&(i.laneX=e,i.laneY=t),{steer:r,boost:i.boost,level:i.level,boostChanged:a,levelChanged:o}}function Qu(i,e){let t=e>=i?Math.min(124,Math.max(80,e*.16)):Math.min(72,Math.max(42,e*.17));return e-t}function ed(i,e=1.55,t=3.45){if(!i||!["driving","task","resolving"].includes(i.status))return 0;let n=Math.max(0,Number(i.speedFactor)||0),s=n<=e?n/e*90:90+(n-e)/(t-e)*110;return Math.max(0,Math.min(200,Math.round(s)))}function td(i,{modalOpen:e=!1}={}){if(!i)return{phase:"garage",question:!1,approaching:!1,route:null,announcementsAllowed:!e};let t=["task","resolving"].includes(i.status),n=i.status==="driving",s=i.tasks?.[i.taskIndex],r=s?.at-i.distance,a=n&&r>0&&r<(s.kind==="pedestrian"?174:90),o=i.route||(i.mergeAssist&&i.distance<i.mergeAssist.exitEndAt?i.mergeAssist:null),c=(i.obstacles||[]).some(h=>!h.passed&&!h.dormant&&h.at>i.distance-8&&h.at<i.distance+80);return{phase:t?"question":a?"approaching":o?"route":n?"driving":"inactive",question:t,approaching:a,next:s,ahead:r,route:o,announcementsAllowed:n&&!t&&!a&&!o&&!c&&!i.yielding&&!i.followingTraffic&&!e}}var Ir=Object.freeze({5:"A1",6:"A1+",7:"A2",8:"A2+"}),Dm=Object.freeze({g5u1:"Naming school places and clubs, expressing likes and following school rules.",g5u2:"Following classroom instructions and talking about school subjects, objects and time.",g5u3:"Describing appearance, clothes and everyday routines.",g5u4:"Talking about family hobbies, routines and actions happening now.",g5u5:"Naming neighbourhood places and describing where things are in a city.",g5u6:"Ordering food and asking about quantities and prices.",g5u7:"Describing wild animals, their homes, abilities and size.",g5u8:"Describing natural places and making holiday plans.",g5u9:"Naming jobs and workplaces, and explaining what people do.",g5u10:"Asking about toys, colours, shapes and prices.",g6u1:"Talking about school roles, responsibilities and how often routines happen.",g6u2:"Describing study routines and comparing everyday activities with actions happening now.",g6u3:"Describing and comparing appearance, personality and personal belongings.",g6u4:"Talking about family jobs, homes and planned arrangements.",g6u5:"Describing festivals, transport and events in the past.",g6u6:"Talking about countries, languages, food culture and past food experiences.",g6u7:"Describing nature activities, reducing waste and protecting the environment.",g6u8:"Talking about planets, weather, future plans and predictions.",g6u9:"Comparing products and asking about prices and sizes.",g6u10:"Expressing feelings and needs, asking for help and discussing healthy habits.",g7u1:"Describing appearance and personality traits, and comparing people.",g7u2:"Talking about sports, equipment and how often people exercise.",g7u3:"Telling life stories and describing achievements, dates and past events.",g7u4:"Describing wild animals, their habitats and ways to protect them.",g7u5:"Talking about TV programmes, expressing preferences and sharing opinions.",g7u6:"Planning parties, making offers and suggestions, and talking about quantities.",g7u7:"Expressing hopes and ambitions, and making predictions about the future.",g7u8:"Naming public places, explaining their purposes and giving directions.",g7u9:"Discussing environmental problems and giving advice about solutions.",g7u10:"Comparing planets and exploring facts about space and space history.",g7u11:"Naming ingredients, following recipes and putting cooking steps in order.",g7u12:"Describing past holidays, asking about journeys and making travel plans.",g8u1:"Making invitations, accepting or refusing, and giving reasons and excuses.",g8u2:"Talking about teen routines, habits, preferences and opinions.",g8u3:"Naming kitchen tools and ingredients, and explaining recipes step by step.",g8u4:"Having phone conversations, taking messages and asking for clarification.",g8u5:"Talking about internet tools, online habits and staying safe online.",g8u6:"Comparing adventure sports, choosing equipment and following safety rules.",g8u7:"Describing destinations, comparing holidays and talking about past trips.",g8u8:"Sharing household chores and explaining responsibilities, rules and obligations.",g8u9:"Describing scientific achievements, experiments and laboratory instructions.",g8u10:"Discussing natural events, their effects, safety precautions and predictions.",g8u11:"Making polite shopping requests, comparing products and explaining purchase problems.",g8u12:"Describing pets, their daily needs and responsible care."});function nd(i){return Dm[i.id]||i.targetLanguage?.slice(0,2).join(" \xB7 ")||"Practise this unit\u2019s vocabulary and useful everyday English."}var Fd=0,gh=1,Od=2;var xh=1,nl=2,jn=3,di=0,Ht=1,en=2,vi=0,Zi=1,_n=2,yh=3,_h=4,Bd=5,Ii=100,kd=101,zd=102,Hd=103,Gd=104,Vd=200,Wd=201,Xd=202,qd=203,So=204,Eo=205,$d=206,Yd=207,Zd=208,Kd=209,Jd=210,jd=211,Qd=212,ef=213,tf=214,il=0,sl=1,rl=2,Ki=3,al=4,ol=5,ll=6,cl=7,vh=0,nf=1,sf=2,Mi=0,rf=1,af=2,of=3,hl=4,lf=5,cf=6,hf=7;var Mh=300,ns=301,is=302,or=303,ul=304,Ma=306,Pi=1e3,Ci=1001,wo=1002,cn=1003,uf=1004;var ba=1005;var Dn=1006,dl=1007;var Ni=1008;var Bn=1009,bh=1010,Sh=1011,lr=1012,fl=1013,Fi=1014,kn=1015,cr=1016,pl=1017,ml=1018,hr=1020,Eh=35902,wh=35899,Th=1021,Ah=1022,Tn=1023,Ys=1026,ur=1027,gl=1028,xl=1029,Rh=1030,yl=1031;var _l=1033,Sa=33776,Ea=33777,wa=33778,Ta=33779,vl=35840,Ml=35841,bl=35842,Sl=35843,El=36196,wl=37492,Tl=37496,Al=37808,Rl=37809,Cl=37810,Il=37811,Pl=37812,Ll=37813,Dl=37814,Ul=37815,Nl=37816,Fl=37817,Ol=37818,Bl=37819,kl=37820,zl=37821,Hl=36492,Gl=36494,Vl=36495,Wl=36283,Xl=36284,ql=36285,$l=36286;var qr=2300,To=2301,bo=2302,ah=2400,oh=2401,lh=2402;var df=3200,ff=3201;var Ch=0,pf=1,zn="",Bt="srgb",Ji="srgb-linear",$r="linear",lt="srgb";var Yi=7680;var ch=519,mf=512,gf=513,xf=514,Ih=515,yf=516,_f=517,vf=518,Mf=519,Ao=35044,ss=35048;var Ph="300 es",Ln=2e3,Yr=2001;var fi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},Jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],id=1234567,Gr=Math.PI/180,Zs=180/Math.PI;function qn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Jt[i&255]+Jt[i>>8&255]+Jt[i>>16&255]+Jt[i>>24&255]+"-"+Jt[e&255]+Jt[e>>8&255]+"-"+Jt[e>>16&15|64]+Jt[e>>24&255]+"-"+Jt[t&63|128]+Jt[t>>8&255]+"-"+Jt[t>>16&255]+Jt[t>>24&255]+Jt[n&255]+Jt[n>>8&255]+Jt[n>>16&255]+Jt[n>>24&255]).toLowerCase()}function Je(i,e,t){return Math.max(e,Math.min(t,i))}function Lh(i,e){return(i%e+e)%e}function Um(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Nm(i,e,t){return i!==e?(t-i)/(e-i):0}function Vr(i,e,t){return(1-t)*i+t*e}function Fm(i,e,t,n){return Vr(i,e,1-Math.exp(-t*n))}function Om(i,e=1){return e-Math.abs(Lh(i,e*2)-e)}function Bm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function km(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function zm(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Hm(i,e){return i+Math.random()*(e-i)}function Gm(i){return i*(.5-Math.random())}function Vm(i){i!==void 0&&(id=i);let e=id+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Wm(i){return i*Gr}function Xm(i){return i*Zs}function qm(i){return(i&i-1)===0&&i!==0}function $m(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Ym(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Zm(i,e,t,n,s){let r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),d=a((e-n)/2),f=r((n-e)/2),m=a((n-e)/2);switch(s){case"XYX":i.set(o*h,c*u,c*d,o*l);break;case"YZY":i.set(c*d,o*h,c*u,o*l);break;case"ZXZ":i.set(c*u,c*d,o*h,o*l);break;case"XZX":i.set(o*h,c*m,c*f,o*l);break;case"YXY":i.set(c*f,o*h,c*m,o*l);break;case"ZYZ":i.set(c*m,c*f,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Pn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ot(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var St={DEG2RAD:Gr,RAD2DEG:Zs,generateUUID:qn,clamp:Je,euclideanModulo:Lh,mapLinear:Um,inverseLerp:Nm,lerp:Vr,damp:Fm,pingpong:Om,smoothstep:Bm,smootherstep:km,randInt:zm,randFloat:Hm,randFloatSpread:Gm,seededRandom:Vm,degToRad:Wm,radToDeg:Xm,isPowerOfTwo:qm,ceilPowerOfTwo:$m,floorPowerOfTwo:Ym,setQuaternionFromProperEuler:Zm,normalize:ot,denormalize:Pn},de=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Je(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Je(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Un=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3],d=r[a+0],f=r[a+1],m=r[a+2],x=r[a+3];if(o===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=d,e[t+1]=f,e[t+2]=m,e[t+3]=x;return}if(u!==x||c!==d||l!==f||h!==m){let g=1-o,p=c*d+l*f+h*m+u*x,v=p>=0?1:-1,b=1-p*p;if(b>Number.EPSILON){let C=Math.sqrt(b),S=Math.atan2(C,p*v);g=Math.sin(g*S)/C,o=Math.sin(o*S)/C}let _=o*v;if(c=c*g+d*_,l=l*g+f*_,h=h*g+m*_,u=u*g+x*_,g===1-o){let C=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=C,l*=C,h*=C,u*=C}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[a],d=r[a+1],f=r[a+2],m=r[a+3];return e[t]=o*m+h*u+c*f-l*d,e[t+1]=c*m+h*d+l*u-o*f,e[t+2]=l*m+h*f+o*d-c*u,e[t+3]=h*m-o*u-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),u=o(r/2),d=c(n/2),f=c(s/2),m=c(r/2);switch(a){case"XYZ":this._x=d*h*u+l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u+d*f*m;break;case"YZX":this._x=d*h*u+l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u-d*f*m;break;case"XZY":this._x=d*h*u-l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-s)*f}else if(n>o&&n>u){let f=2*Math.sqrt(1+n-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+l)/f}else if(o>u){let f=2*Math.sqrt(1+o-n-u);this._w=(r-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+h)/f}else{let f=2*Math.sqrt(1+u-n-o);this._w=(a-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Je(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-s*o,this._w=a*h-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,a=this._w,o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;let c=1-o*o;if(c<=Number.EPSILON){let f=1-t;return this._w=f*a+t*this._w,this._x=f*n+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-t)*h)/l,d=Math.sin(t*h)/l;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},D=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(sd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(sd.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),h=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+c*l+a*u-o*h,this.y=n+c*h+o*l-r*u,this.z=s+c*u+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this.z=Je(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this.z=Je(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Je(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Dc.copy(this).projectOnVector(e),this.sub(Dc)}reflect(e){return this.sub(Dc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Je(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Dc=new D,sd=new Un,Xe=class i{constructor(e,t,n,s,r,a,o,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],m=n[8],x=s[0],g=s[3],p=s[6],v=s[1],b=s[4],_=s[7],C=s[2],S=s[5],A=s[8];return r[0]=a*x+o*v+c*C,r[3]=a*g+o*b+c*S,r[6]=a*p+o*_+c*A,r[1]=l*x+h*v+u*C,r[4]=l*g+h*b+u*S,r[7]=l*p+h*_+u*A,r[2]=d*x+f*v+m*C,r[5]=d*g+f*b+m*S,r[8]=d*p+f*_+m*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-n*r*h+n*o*c+s*r*l-s*a*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=h*a-o*l,d=o*c-h*r,f=l*r-a*c,m=t*u+n*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return e[0]=u*x,e[1]=(s*l-h*n)*x,e[2]=(o*n-s*a)*x,e[3]=d*x,e[4]=(h*t-s*c)*x,e[5]=(s*r-o*t)*x,e[6]=f*x,e[7]=(n*c-l*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Uc.makeScale(e,t)),this}rotate(e){return this.premultiply(Uc.makeRotation(-e)),this}translate(e,t){return this.premultiply(Uc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Uc=new Xe;function Dh(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Zr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function bf(){let i=Zr("canvas");return i.style.display="block",i}var rd={};function Ks(i){i in rd||(rd[i]=!0,console.warn(i))}function Sf(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var ad=new Xe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),od=new Xe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Km(){let i={enabled:!0,workingColorSpace:Ji,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===lt&&(s.r=ui(s.r),s.g=ui(s.g),s.b=ui(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===lt&&(s.r=qs(s.r),s.g=qs(s.g),s.b=qs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===zn?$r:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ks("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ks("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Ji]:{primaries:e,whitePoint:n,transfer:$r,toXYZ:ad,fromXYZ:od,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Bt},outputColorSpaceConfig:{drawingBufferColorSpace:Bt}},[Bt]:{primaries:e,whitePoint:n,transfer:lt,toXYZ:ad,fromXYZ:od,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Bt}}}),i}var tt=Km();function ui(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function qs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Cs,Ro=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Cs===void 0&&(Cs=Zr("canvas")),Cs.width=e.width,Cs.height=e.height;let s=Cs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Cs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Zr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=ui(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ui(t[n]/255)*255):t[n]=ui(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Jm=0,Js=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Jm++}),this.uuid=qn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Nc(s[a].image)):r.push(Nc(s[a]))}else r=Nc(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Nc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ro.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var jm=0,Fc=new D,an=class i extends fi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Ci,s=Ci,r=Dn,a=Ni,o=Tn,c=Bn,l=i.DEFAULT_ANISOTROPY,h=zn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:jm++}),this.uuid=qn(),this.name="",this.source=new Js(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new de(0,0),this.repeat=new de(1,1),this.center=new de(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Xe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Fc).x}get height(){return this.source.getSize(Fc).y}get depth(){return this.source.getSize(Fc).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Mh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Pi:e.x=e.x-Math.floor(e.x);break;case Ci:e.x=e.x<0?0:1;break;case wo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Pi:e.y=e.y-Math.floor(e.y);break;case Ci:e.y=e.y<0?0:1;break;case wo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};an.DEFAULT_IMAGE=null;an.DEFAULT_MAPPING=Mh;an.DEFAULT_ANISOTROPY=1;var It=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,c=e.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],m=c[9],x=c[2],g=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let b=(l+1)/2,_=(f+1)/2,C=(p+1)/2,S=(h+d)/4,A=(u+x)/4,R=(m+g)/4;return b>_&&b>C?b<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(b),s=S/n,r=A/n):_>C?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=S/s,r=R/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=A/r,s=R/r),this.set(n,s,r,t),this}let v=Math.sqrt((g-m)*(g-m)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(g-m)/v,this.y=(u-x)/v,this.z=(d-h)/v,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this.z=Je(this.z,e.z,t.z),this.w=Je(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this.z=Je(this.z,e,t),this.w=Je(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Je(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Co=class extends fi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Dn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new It(0,0,e,t),this.scissorTest=!1,this.viewport=new It(0,0,e,t);let s={width:e,height:t,depth:n.depth},r=new an(s);this.textures=[];let a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:Dn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Js(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},$n=class extends Co{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Kr=class extends an{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=cn,this.minFilter=cn,this.wrapR=Ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Io=class extends an{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=cn,this.minFilter=cn,this.wrapR=Ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var wn=class{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Rn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Rn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Rn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Rn):Rn.fromBufferAttribute(r,a),Rn.applyMatrix4(e.matrixWorld),this.expandByPoint(Rn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ya.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ya.copy(n.boundingBox)),Ya.applyMatrix4(e.matrixWorld),this.union(Ya)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Rn),Rn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Pr),Za.subVectors(this.max,Pr),Is.subVectors(e.a,Pr),Ps.subVectors(e.b,Pr),Ls.subVectors(e.c,Pr),Si.subVectors(Ps,Is),Ei.subVectors(Ls,Ps),Wi.subVectors(Is,Ls);let t=[0,-Si.z,Si.y,0,-Ei.z,Ei.y,0,-Wi.z,Wi.y,Si.z,0,-Si.x,Ei.z,0,-Ei.x,Wi.z,0,-Wi.x,-Si.y,Si.x,0,-Ei.y,Ei.x,0,-Wi.y,Wi.x,0];return!Oc(t,Is,Ps,Ls,Za)||(t=[1,0,0,0,1,0,0,0,1],!Oc(t,Is,Ps,Ls,Za))?!1:(Ka.crossVectors(Si,Ei),t=[Ka.x,Ka.y,Ka.z],Oc(t,Is,Ps,Ls,Za))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Rn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Rn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ri[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ri[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ri[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ri[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ri[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ri[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ri[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ri[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ri),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},ri=[new D,new D,new D,new D,new D,new D,new D,new D],Rn=new D,Ya=new wn,Is=new D,Ps=new D,Ls=new D,Si=new D,Ei=new D,Wi=new D,Pr=new D,Za=new D,Ka=new D,Xi=new D;function Oc(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Xi.fromArray(i,r);let o=s.x*Math.abs(Xi.x)+s.y*Math.abs(Xi.y)+s.z*Math.abs(Xi.z),c=e.dot(Xi),l=t.dot(Xi),h=n.dot(Xi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}var Qm=new wn,Lr=new D,Bc=new D,pi=class{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Qm.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Lr.subVectors(e,this.center);let t=Lr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Lr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Bc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Lr.copy(e.center).add(Bc)),this.expandByPoint(Lr.copy(e.center).sub(Bc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},ai=new D,kc=new D,Ja=new D,wi=new D,zc=new D,ja=new D,Hc=new D,Jr=class{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ai)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ai.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ai.copy(this.origin).addScaledVector(this.direction,t),ai.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){kc.copy(e).add(t).multiplyScalar(.5),Ja.copy(t).sub(e).normalize(),wi.copy(this.origin).sub(kc);let r=e.distanceTo(t)*.5,a=-this.direction.dot(Ja),o=wi.dot(this.direction),c=-wi.dot(Ja),l=wi.lengthSq(),h=Math.abs(1-a*a),u,d,f,m;if(h>0)if(u=a*c-o,d=a*o-c,m=r*h,u>=0)if(d>=-m)if(d<=m){let x=1/h;u*=x,d*=x,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-m?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=m?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(kc).addScaledVector(Ja,d),f}intersectSphere(e,t){ai.subVectors(e.center,this.origin);let n=ai.dot(this.direction),s=ai.dot(ai)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,s=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,s=(e.min.x-d.x)*l),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-d.z)*u,c=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,c=(e.min.z-d.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,ai)!==null}intersectTriangle(e,t,n,s,r){zc.subVectors(t,e),ja.subVectors(n,e),Hc.crossVectors(zc,ja);let a=this.direction.dot(Hc),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;wi.subVectors(this.origin,e);let c=o*this.direction.dot(ja.crossVectors(wi,ja));if(c<0)return null;let l=o*this.direction.dot(zc.cross(wi));if(l<0||c+l>a)return null;let h=-o*wi.dot(Hc);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ct=class i{constructor(e,t,n,s,r,a,o,c,l,h,u,d,f,m,x,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,h,u,d,f,m,x,g)}set(e,t,n,s,r,a,o,c,l,h,u,d,f,m,x,g){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/Ds.setFromMatrixColumn(e,0).length(),r=1/Ds.setFromMatrixColumn(e,1).length(),a=1/Ds.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=a*h,f=a*u,m=o*h,x=o*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=f+m*l,t[5]=d-x*l,t[9]=-o*c,t[2]=x-d*l,t[6]=m+f*l,t[10]=a*c}else if(e.order==="YXZ"){let d=c*h,f=c*u,m=l*h,x=l*u;t[0]=d+x*o,t[4]=m*o-f,t[8]=a*l,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-m,t[6]=x+d*o,t[10]=a*c}else if(e.order==="ZXY"){let d=c*h,f=c*u,m=l*h,x=l*u;t[0]=d-x*o,t[4]=-a*u,t[8]=m+f*o,t[1]=f+m*o,t[5]=a*h,t[9]=x-d*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){let d=a*h,f=a*u,m=o*h,x=o*u;t[0]=c*h,t[4]=m*l-f,t[8]=d*l+x,t[1]=c*u,t[5]=x*l+d,t[9]=f*l-m,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){let d=a*c,f=a*l,m=o*c,x=o*l;t[0]=c*h,t[4]=x-d*u,t[8]=m*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=f*u+m,t[10]=d-x*u}else if(e.order==="XZY"){let d=a*c,f=a*l,m=o*c,x=o*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=d*u+x,t[5]=a*h,t[9]=f*u-m,t[2]=m*u-f,t[6]=o*h,t[10]=x*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(eg,e,tg)}lookAt(e,t,n){let s=this.elements;return mn.subVectors(e,t),mn.lengthSq()===0&&(mn.z=1),mn.normalize(),Ti.crossVectors(n,mn),Ti.lengthSq()===0&&(Math.abs(n.z)===1?mn.x+=1e-4:mn.z+=1e-4,mn.normalize(),Ti.crossVectors(n,mn)),Ti.normalize(),Qa.crossVectors(mn,Ti),s[0]=Ti.x,s[4]=Qa.x,s[8]=mn.x,s[1]=Ti.y,s[5]=Qa.y,s[9]=mn.y,s[2]=Ti.z,s[6]=Qa.z,s[10]=mn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],m=n[2],x=n[6],g=n[10],p=n[14],v=n[3],b=n[7],_=n[11],C=n[15],S=s[0],A=s[4],R=s[8],M=s[12],y=s[1],P=s[5],N=s[9],B=s[13],H=s[2],X=s[6],q=s[10],ee=s[14],O=s[3],V=s[7],ie=s[11],xe=s[15];return r[0]=a*S+o*y+c*H+l*O,r[4]=a*A+o*P+c*X+l*V,r[8]=a*R+o*N+c*q+l*ie,r[12]=a*M+o*B+c*ee+l*xe,r[1]=h*S+u*y+d*H+f*O,r[5]=h*A+u*P+d*X+f*V,r[9]=h*R+u*N+d*q+f*ie,r[13]=h*M+u*B+d*ee+f*xe,r[2]=m*S+x*y+g*H+p*O,r[6]=m*A+x*P+g*X+p*V,r[10]=m*R+x*N+g*q+p*ie,r[14]=m*M+x*B+g*ee+p*xe,r[3]=v*S+b*y+_*H+C*O,r[7]=v*A+b*P+_*X+C*V,r[11]=v*R+b*N+_*q+C*ie,r[15]=v*M+b*B+_*ee+C*xe,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],u=e[6],d=e[10],f=e[14],m=e[3],x=e[7],g=e[11],p=e[15];return m*(+r*c*u-s*l*u-r*o*d+n*l*d+s*o*f-n*c*f)+x*(+t*c*f-t*l*d+r*a*d-s*a*f+s*l*h-r*c*h)+g*(+t*l*u-t*o*f-r*a*u+n*a*f+r*o*h-n*l*h)+p*(-s*o*h-t*c*u+t*o*d+s*a*u-n*a*d+n*c*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=e[9],d=e[10],f=e[11],m=e[12],x=e[13],g=e[14],p=e[15],v=u*g*l-x*d*l+x*c*f-o*g*f-u*c*p+o*d*p,b=m*d*l-h*g*l-m*c*f+a*g*f+h*c*p-a*d*p,_=h*x*l-m*u*l+m*o*f-a*x*f-h*o*p+a*u*p,C=m*u*c-h*x*c-m*o*d+a*x*d+h*o*g-a*u*g,S=t*v+n*b+s*_+r*C;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/S;return e[0]=v*A,e[1]=(x*d*r-u*g*r-x*s*f+n*g*f+u*s*p-n*d*p)*A,e[2]=(o*g*r-x*c*r+x*s*l-n*g*l-o*s*p+n*c*p)*A,e[3]=(u*c*r-o*d*r-u*s*l+n*d*l+o*s*f-n*c*f)*A,e[4]=b*A,e[5]=(h*g*r-m*d*r+m*s*f-t*g*f-h*s*p+t*d*p)*A,e[6]=(m*c*r-a*g*r-m*s*l+t*g*l+a*s*p-t*c*p)*A,e[7]=(a*d*r-h*c*r+h*s*l-t*d*l-a*s*f+t*c*f)*A,e[8]=_*A,e[9]=(m*u*r-h*x*r-m*n*f+t*x*f+h*n*p-t*u*p)*A,e[10]=(a*x*r-m*o*r+m*n*l-t*x*l-a*n*p+t*o*p)*A,e[11]=(h*o*r-a*u*r-h*n*l+t*u*l+a*n*f-t*o*f)*A,e[12]=C*A,e[13]=(h*x*s-m*u*s+m*n*d-t*x*d-h*n*g+t*u*g)*A,e[14]=(m*o*s-a*x*s-m*n*c+t*x*c+a*n*g-t*o*g)*A,e[15]=(a*u*s-h*o*s+h*n*c-t*u*c-a*n*d+t*o*d)*A,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,h=a+a,u=o+o,d=r*l,f=r*h,m=r*u,x=a*h,g=a*u,p=o*u,v=c*l,b=c*h,_=c*u,C=n.x,S=n.y,A=n.z;return s[0]=(1-(x+p))*C,s[1]=(f+_)*C,s[2]=(m-b)*C,s[3]=0,s[4]=(f-_)*S,s[5]=(1-(d+p))*S,s[6]=(g+v)*S,s[7]=0,s[8]=(m+b)*A,s[9]=(g-v)*A,s[10]=(1-(d+x))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=Ds.set(s[0],s[1],s[2]).length(),a=Ds.set(s[4],s[5],s[6]).length(),o=Ds.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Cn.copy(this);let l=1/r,h=1/a,u=1/o;return Cn.elements[0]*=l,Cn.elements[1]*=l,Cn.elements[2]*=l,Cn.elements[4]*=h,Cn.elements[5]*=h,Cn.elements[6]*=h,Cn.elements[8]*=u,Cn.elements[9]*=u,Cn.elements[10]*=u,t.setFromRotationMatrix(Cn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=Ln,c=!1){let l=this.elements,h=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s),m,x;if(c)m=r/(a-r),x=a*r/(a-r);else if(o===Ln)m=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===Yr)m=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Ln,c=!1){let l=this.elements,h=2/(t-e),u=2/(n-s),d=-(t+e)/(t-e),f=-(n+s)/(n-s),m,x;if(c)m=1/(a-r),x=a/(a-r);else if(o===Ln)m=-2/(a-r),x=-(a+r)/(a-r);else if(o===Yr)m=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Ds=new D,Cn=new ct,eg=new D(0,0,0),tg=new D(1,1,1),Ti=new D,Qa=new D,mn=new D,ld=new ct,cd=new Un,Nn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(Je(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Je(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Je(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Je(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Je(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Je(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ld.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ld,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return cd.setFromEuler(this),this.setFromQuaternion(cd,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Nn.DEFAULT_ORDER="XYZ";var jr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},ng=0,hd=new D,Us=new Un,oi=new ct,eo=new D,Dr=new D,ig=new D,sg=new Un,ud=new D(1,0,0),dd=new D(0,1,0),fd=new D(0,0,1),pd={type:"added"},rg={type:"removed"},Ns={type:"childadded",child:null},Gc={type:"childremoved",child:null},xt=class i extends fi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ng++}),this.uuid=qn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new D,t=new Nn,n=new Un,s=new D(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ct},normalMatrix:{value:new Xe}}),this.matrix=new ct,this.matrixWorld=new ct,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new jr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Us.setFromAxisAngle(e,t),this.quaternion.multiply(Us),this}rotateOnWorldAxis(e,t){return Us.setFromAxisAngle(e,t),this.quaternion.premultiply(Us),this}rotateX(e){return this.rotateOnAxis(ud,e)}rotateY(e){return this.rotateOnAxis(dd,e)}rotateZ(e){return this.rotateOnAxis(fd,e)}translateOnAxis(e,t){return hd.copy(e).applyQuaternion(this.quaternion),this.position.add(hd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ud,e)}translateY(e){return this.translateOnAxis(dd,e)}translateZ(e){return this.translateOnAxis(fd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(oi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?eo.copy(e):eo.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Dr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?oi.lookAt(Dr,eo,this.up):oi.lookAt(eo,Dr,this.up),this.quaternion.setFromRotationMatrix(oi),s&&(oi.extractRotation(s.matrixWorld),Us.setFromRotationMatrix(oi),this.quaternion.premultiply(Us.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(pd),Ns.child=e,this.dispatchEvent(Ns),Ns.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(rg),Gc.child=e,this.dispatchEvent(Gc),Gc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),oi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),oi.multiply(e.parent.matrixWorld)),e.applyMatrix4(oi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(pd),Ns.child=e,this.dispatchEvent(Ns),Ns.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Dr,e,ig),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Dr,sg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){let o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),m=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=s,n;function a(o){let c=[];for(let l in o){let h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};xt.DEFAULT_UP=new D(0,1,0);xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var In=new D,li=new D,Vc=new D,ci=new D,Fs=new D,Os=new D,md=new D,Wc=new D,Xc=new D,qc=new D,$c=new It,Yc=new It,Zc=new It,hi=class i{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),In.subVectors(e,t),s.cross(In);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){In.subVectors(s,t),li.subVectors(n,t),Vc.subVectors(e,t);let a=In.dot(In),o=In.dot(li),c=In.dot(Vc),l=li.dot(li),h=li.dot(Vc),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(l*c-o*h)*d,m=(a*h-o*c)*d;return r.set(1-f-m,m,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,ci)===null?!1:ci.x>=0&&ci.y>=0&&ci.x+ci.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,ci)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ci.x),c.addScaledVector(a,ci.y),c.addScaledVector(o,ci.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return $c.setScalar(0),Yc.setScalar(0),Zc.setScalar(0),$c.fromBufferAttribute(e,t),Yc.fromBufferAttribute(e,n),Zc.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector($c,r.x),a.addScaledVector(Yc,r.y),a.addScaledVector(Zc,r.z),a}static isFrontFacing(e,t,n,s){return In.subVectors(n,t),li.subVectors(e,t),In.cross(li).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return In.subVectors(this.c,this.b),li.subVectors(this.a,this.b),In.cross(li).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;Fs.subVectors(s,n),Os.subVectors(r,n),Wc.subVectors(e,n);let c=Fs.dot(Wc),l=Os.dot(Wc);if(c<=0&&l<=0)return t.copy(n);Xc.subVectors(e,s);let h=Fs.dot(Xc),u=Os.dot(Xc);if(h>=0&&u<=h)return t.copy(s);let d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),t.copy(n).addScaledVector(Fs,a);qc.subVectors(e,r);let f=Fs.dot(qc),m=Os.dot(qc);if(m>=0&&f<=m)return t.copy(r);let x=f*l-c*m;if(x<=0&&l>=0&&m<=0)return o=l/(l-m),t.copy(n).addScaledVector(Os,o);let g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return md.subVectors(r,s),o=(u-h)/(u-h+(f-m)),t.copy(s).addScaledVector(md,o);let p=1/(g+x+d);return a=x*p,o=d*p,t.copy(n).addScaledVector(Fs,a).addScaledVector(Os,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Ef={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ai={h:0,s:0,l:0},to={h:0,s:0,l:0};function Kc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Ae=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Bt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=tt.workingColorSpace){return this.r=e,this.g=t,this.b=n,tt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=tt.workingColorSpace){if(e=Lh(e,1),t=Je(t,0,1),n=Je(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Kc(a,r,e+1/3),this.g=Kc(a,r,e),this.b=Kc(a,r,e-1/3)}return tt.colorSpaceToWorking(this,s),this}setStyle(e,t=Bt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Bt){let n=Ef[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ui(e.r),this.g=ui(e.g),this.b=ui(e.b),this}copyLinearToSRGB(e){return this.r=qs(e.r),this.g=qs(e.g),this.b=qs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Bt){return tt.workingToColorSpace(jt.copy(this),e),Math.round(Je(jt.r*255,0,255))*65536+Math.round(Je(jt.g*255,0,255))*256+Math.round(Je(jt.b*255,0,255))}getHexString(e=Bt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.workingToColorSpace(jt.copy(this),t);let n=jt.r,s=jt.g,r=jt.b,a=Math.max(n,s,r),o=Math.min(n,s,r),c,l,h=(o+a)/2;if(o===a)c=0,l=0;else{let u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=tt.workingColorSpace){return tt.workingToColorSpace(jt.copy(this),t),e.r=jt.r,e.g=jt.g,e.b=jt.b,e}getStyle(e=Bt){tt.workingToColorSpace(jt.copy(this),e);let t=jt.r,n=jt.g,s=jt.b;return e!==Bt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Ai),this.setHSL(Ai.h+e,Ai.s+t,Ai.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ai),e.getHSL(to);let n=Vr(Ai.h,to.h,t),s=Vr(Ai.s,to.s,t),r=Vr(Ai.l,to.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},jt=new Ae;Ae.NAMES=Ef;var ag=0,Yn=class extends fi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ag++}),this.uuid=qn(),this.name="",this.type="Material",this.blending=Zi,this.side=di,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=So,this.blendDst=Eo,this.blendEquation=Ii,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ae(0,0,0),this.blendAlpha=0,this.depthFunc=Ki,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ch,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Yi,this.stencilZFail=Yi,this.stencilZPass=Yi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Zi&&(n.blending=this.blending),this.side!==di&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==So&&(n.blendSrc=this.blendSrc),this.blendDst!==Eo&&(n.blendDst=this.blendDst),this.blendEquation!==Ii&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ki&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ch&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Yi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Yi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Yi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},dt=class extends Yn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Nn,this.combine=vh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Ot=new D,no=new de,og=0,Ut=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:og++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ao,this.updateRanges=[],this.gpuType=kn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)no.fromBufferAttribute(this,t),no.applyMatrix3(e),this.setXY(t,no.x,no.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix3(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix4(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyNormalMatrix(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.transformDirection(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Pn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ot(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Pn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Pn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Pn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Pn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ot(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),s=ot(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),s=ot(s,this.array),r=ot(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ao&&(e.usage=this.usage),e}};var Qr=class extends Ut{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var ea=class extends Ut{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Pe=class extends Ut{constructor(e,t,n){super(new Float32Array(e),t,n)}},lg=0,En=new ct,Jc=new xt,Bs=new D,gn=new wn,Ur=new wn,qt=new D,je=class i extends fi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:lg++}),this.uuid=qn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Dh(e)?ea:Qr)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Xe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return En.makeRotationFromQuaternion(e),this.applyMatrix4(En),this}rotateX(e){return En.makeRotationX(e),this.applyMatrix4(En),this}rotateY(e){return En.makeRotationY(e),this.applyMatrix4(En),this}rotateZ(e){return En.makeRotationZ(e),this.applyMatrix4(En),this}translate(e,t,n){return En.makeTranslation(e,t,n),this.applyMatrix4(En),this}scale(e,t,n){return En.makeScale(e,t,n),this.applyMatrix4(En),this}lookAt(e){return Jc.lookAt(e),Jc.updateMatrix(),this.applyMatrix4(Jc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bs).negate(),this.translate(Bs.x,Bs.y,Bs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Pe(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new wn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];gn.setFromBufferAttribute(r),this.morphTargetsRelative?(qt.addVectors(this.boundingBox.min,gn.min),this.boundingBox.expandByPoint(qt),qt.addVectors(this.boundingBox.max,gn.max),this.boundingBox.expandByPoint(qt)):(this.boundingBox.expandByPoint(gn.min),this.boundingBox.expandByPoint(gn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new pi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){let n=this.boundingSphere.center;if(gn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Ur.setFromBufferAttribute(o),this.morphTargetsRelative?(qt.addVectors(gn.min,Ur.min),gn.expandByPoint(qt),qt.addVectors(gn.max,Ur.max),gn.expandByPoint(qt)):(gn.expandByPoint(Ur.min),gn.expandByPoint(Ur.max))}gn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)qt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(qt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)qt.fromBufferAttribute(o,l),c&&(Bs.fromBufferAttribute(e,l),qt.add(Bs)),s=Math.max(s,n.distanceToSquared(qt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ut(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],c=[];for(let R=0;R<n.count;R++)o[R]=new D,c[R]=new D;let l=new D,h=new D,u=new D,d=new de,f=new de,m=new de,x=new D,g=new D;function p(R,M,y){l.fromBufferAttribute(n,R),h.fromBufferAttribute(n,M),u.fromBufferAttribute(n,y),d.fromBufferAttribute(r,R),f.fromBufferAttribute(r,M),m.fromBufferAttribute(r,y),h.sub(l),u.sub(l),f.sub(d),m.sub(d);let P=1/(f.x*m.y-m.x*f.y);isFinite(P)&&(x.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(P),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(P),o[R].add(x),o[M].add(x),o[y].add(x),c[R].add(g),c[M].add(g),c[y].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let R=0,M=v.length;R<M;++R){let y=v[R],P=y.start,N=y.count;for(let B=P,H=P+N;B<H;B+=3)p(e.getX(B+0),e.getX(B+1),e.getX(B+2))}let b=new D,_=new D,C=new D,S=new D;function A(R){C.fromBufferAttribute(s,R),S.copy(C);let M=o[R];b.copy(M),b.sub(C.multiplyScalar(C.dot(M))).normalize(),_.crossVectors(S,M);let P=_.dot(c[R])<0?-1:1;a.setXYZW(R,b.x,b.y,b.z,P)}for(let R=0,M=v.length;R<M;++R){let y=v[R],P=y.start,N=y.count;for(let B=P,H=P+N;B<H;B+=3)A(e.getX(B+0)),A(e.getX(B+1)),A(e.getX(B+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ut(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new D,r=new D,a=new D,o=new D,c=new D,l=new D,h=new D,u=new D;if(e)for(let d=0,f=e.count;d<f;d+=3){let m=e.getX(d+0),x=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,g),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,m),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),o.add(h),c.add(h),l.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)qt.fromBufferAttribute(e,t),qt.normalize(),e.setXYZ(t,qt.x,qt.y,qt.z)}toNonIndexed(){function e(o,c){let l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h),f=0,m=0;for(let x=0,g=c.length;x<g;x++){o.isInterleavedBufferAttribute?f=c[x]*o.data.stride+o.offset:f=c[x]*h;for(let p=0;p<h;p++)d[m++]=l[f++]}return new Ut(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=e(c,n);t.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){let d=l[h],f=e(d,n);c.push(f)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){let f=l[u];h.push(f.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(t))}let r=e.morphAttributes;for(let l in r){let h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let l=0,h=a.length;l<h;l++){let u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},gd=new ct,qi=new Jr,io=new pi,xd=new D,so=new D,ro=new D,ao=new D,jc=new D,oo=new D,yd=new D,lo=new D,ve=class extends xt{constructor(e=new je,t=new dt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){oo.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=o[c],u=r[c];h!==0&&(jc.fromBufferAttribute(u,e),a?oo.addScaledVector(jc,h):oo.addScaledVector(jc.sub(t),h))}t.add(oo)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),io.copy(n.boundingSphere),io.applyMatrix4(r),qi.copy(e.ray).recast(e.near),!(io.containsPoint(qi.origin)===!1&&(qi.intersectSphere(io,xd)===null||qi.origin.distanceToSquared(xd)>(e.far-e.near)**2))&&(gd.copy(r).invert(),qi.copy(e.ray).applyMatrix4(gd),!(n.boundingBox!==null&&qi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,qi)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){let g=d[m],p=a[g.materialIndex],v=Math.max(g.start,f.start),b=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let _=v,C=b;_<C;_+=3){let S=o.getX(_),A=o.getX(_+1),R=o.getX(_+2);s=co(this,p,e,n,l,h,u,S,A,R),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let v=o.getX(g),b=o.getX(g+1),_=o.getX(g+2);s=co(this,a,e,n,l,h,u,v,b,_),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let m=0,x=d.length;m<x;m++){let g=d[m],p=a[g.materialIndex],v=Math.max(g.start,f.start),b=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let _=v,C=b;_<C;_+=3){let S=_,A=_+1,R=_+2;s=co(this,p,e,n,l,h,u,S,A,R),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),x=Math.min(c.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let v=g,b=g+1,_=g+2;s=co(this,a,e,n,l,h,u,v,b,_),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function cg(i,e,t,n,s,r,a,o){let c;if(e.side===Ht?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===di,o),c===null)return null;lo.copy(o),lo.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(lo);return l<t.near||l>t.far?null:{distance:l,point:lo.clone(),object:i}}function co(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,so),i.getVertexPosition(c,ro),i.getVertexPosition(l,ao);let h=cg(i,e,t,n,so,ro,ao,yd);if(h){let u=new D;hi.getBarycoord(yd,so,ro,ao,u),s&&(h.uv=hi.getInterpolatedAttribute(s,o,c,l,u,new de)),r&&(h.uv1=hi.getInterpolatedAttribute(r,o,c,l,u,new de)),a&&(h.normal=hi.getInterpolatedAttribute(a,o,c,l,u,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a:o,b:c,c:l,normal:new D,materialIndex:0};hi.getNormal(so,ro,ao,d.normal),h.face=d,h.barycoord=u}return h}var yt=class i extends je{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],h=[],u=[],d=0,f=0;m("z","y","x",-1,-1,n,t,e,a,r,0),m("z","y","x",1,-1,n,t,-e,a,r,1),m("x","z","y",1,1,e,n,t,s,a,2),m("x","z","y",1,-1,e,n,-t,s,a,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Pe(l,3)),this.setAttribute("normal",new Pe(h,3)),this.setAttribute("uv",new Pe(u,2));function m(x,g,p,v,b,_,C,S,A,R,M){let y=_/A,P=C/R,N=_/2,B=C/2,H=S/2,X=A+1,q=R+1,ee=0,O=0,V=new D;for(let ie=0;ie<q;ie++){let xe=ie*P-B;for(let Le=0;Le<X;Le++){let it=Le*y-N;V[x]=it*v,V[g]=xe*b,V[p]=H,l.push(V.x,V.y,V.z),V[x]=0,V[g]=0,V[p]=S>0?1:-1,h.push(V.x,V.y,V.z),u.push(Le/A),u.push(1-ie/R),ee+=1}}for(let ie=0;ie<R;ie++)for(let xe=0;xe<A;xe++){let Le=d+xe+X*ie,it=d+xe+X*(ie+1),ht=d+(xe+1)+X*(ie+1),st=d+(xe+1)+X*ie;c.push(Le,it,st),c.push(it,ht,st),O+=6}o.addGroup(f,O,M),f+=O,d+=ee}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function rs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function tn(i){let e={};for(let t=0;t<i.length;t++){let n=rs(i[t]);for(let s in n)e[s]=n[s]}return e}function hg(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Uh(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}var wf={clone:rs,merge:tn},ug=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,dg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Fn=class extends Yn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ug,this.fragmentShader=dg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=rs(e.uniforms),this.uniformsGroups=hg(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},ta=class extends xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ct,this.projectionMatrix=new ct,this.projectionMatrixInverse=new ct,this.coordinateSystem=Ln,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Ri=new D,_d=new de,vd=new de,Qt=class extends ta{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Zs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Gr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Zs*2*Math.atan(Math.tan(Gr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ri.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ri.x,Ri.y).multiplyScalar(-e/Ri.z),Ri.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ri.x,Ri.y).multiplyScalar(-e/Ri.z)}getViewSize(e,t){return this.getViewBounds(e,_d,vd),t.subVectors(vd,_d)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Gr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},ks=-90,zs=1,Po=class extends xt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Qt(ks,zs,e,t);s.layers=this.layers,this.add(s);let r=new Qt(ks,zs,e,t);r.layers=this.layers,this.add(r);let a=new Qt(ks,zs,e,t);a.layers=this.layers,this.add(a);let o=new Qt(ks,zs,e,t);o.layers=this.layers,this.add(o);let c=new Qt(ks,zs,e,t);c.layers=this.layers,this.add(c);let l=new Qt(ks,zs,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(let l of t)this.remove(l);if(e===Ln)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Yr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},na=class extends an{constructor(e=[],t=ns,n,s,r,a,o,c,l,h){super(e,t,n,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Lo=class extends $n{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new na(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new yt(5,5,5),r=new Fn({name:"CubemapFromEquirect",uniforms:rs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ht,blending:vi});r.uniforms.tEquirect.value=t;let a=new ve(s,r),o=t.minFilter;return t.minFilter===Ni&&(t.minFilter=Dn),new Po(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}},$e=class extends xt{constructor(){super(),this.isGroup=!0,this.type="Group"}},fg={type:"move"},js=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new $e,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new $e,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new $e,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(let x of e.hand.values()){let g=t.getJointPose(x,n),p=this._getHandJoint(l,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;l.inputState.pinching&&d>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(fg)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new $e;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var ia=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ae(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},sa=class extends xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Nn,this.environmentIntensity=1,this.environmentRotation=new Nn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},ra=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ao,this.updateRanges=[],this.version=0,this.uuid=qn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=qn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=qn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},rn=new D,Qs=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)rn.fromBufferAttribute(this,t),rn.applyMatrix4(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)rn.fromBufferAttribute(this,t),rn.applyNormalMatrix(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)rn.fromBufferAttribute(this,t),rn.transformDirection(e),this.setXYZ(t,rn.x,rn.y,rn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Pn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ot(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ot(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Pn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Pn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Pn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Pn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),s=ot(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ot(t,this.array),n=ot(n,this.array),s=ot(s,this.array),r=ot(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Ut(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Zn=class extends Yn{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ae(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Hs,Nr=new D,Gs=new D,Vs=new D,Ws=new de,Fr=new de,Tf=new ct,ho=new D,Or=new D,uo=new D,Md=new de,Qc=new de,bd=new de,mi=class extends xt{constructor(e=new Zn){if(super(),this.isSprite=!0,this.type="Sprite",Hs===void 0){Hs=new je;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new ra(t,5);Hs.setIndex([0,1,2,0,2,3]),Hs.setAttribute("position",new Qs(n,3,0,!1)),Hs.setAttribute("uv",new Qs(n,2,3,!1))}this.geometry=Hs,this.material=e,this.center=new de(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Gs.setFromMatrixScale(this.matrixWorld),Tf.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Vs.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Gs.multiplyScalar(-Vs.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let a=this.center;fo(ho.set(-.5,-.5,0),Vs,a,Gs,s,r),fo(Or.set(.5,-.5,0),Vs,a,Gs,s,r),fo(uo.set(.5,.5,0),Vs,a,Gs,s,r),Md.set(0,0),Qc.set(1,0),bd.set(1,1);let o=e.ray.intersectTriangle(ho,Or,uo,!1,Nr);if(o===null&&(fo(Or.set(-.5,.5,0),Vs,a,Gs,s,r),Qc.set(0,1),o=e.ray.intersectTriangle(ho,uo,Or,!1,Nr),o===null))return;let c=e.ray.origin.distanceTo(Nr);c<e.near||c>e.far||t.push({distance:c,point:Nr.clone(),uv:hi.getInterpolation(Nr,ho,Or,uo,Md,Qc,bd,new de),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function fo(i,e,t,n,s,r){Ws.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Fr.x=r*Ws.x-s*Ws.y,Fr.y=s*Ws.x+r*Ws.y):Fr.copy(Ws),i.copy(e),i.x+=Fr.x,i.y+=Fr.y,i.applyMatrix4(Tf)}var Do=class extends an{constructor(e=null,t=1,n=1,s,r,a,o,c,l=cn,h=cn,u,d){super(null,a,o,c,l,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var er=class extends Ut{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Xs=new ct,Sd=new ct,po=[],Ed=new wn,pg=new ct,Br=new ve,kr=new pi,gi=class extends ve{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new er(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,pg)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new wn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Xs),Ed.copy(e.boundingBox).applyMatrix4(Xs),this.boundingBox.union(Ed)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new pi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Xs),kr.copy(e.boundingSphere).applyMatrix4(Xs),this.boundingSphere.union(kr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Br.geometry=this.geometry,Br.material=this.material,Br.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),kr.copy(this.boundingSphere),kr.applyMatrix4(n),e.ray.intersectsSphere(kr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Xs),Sd.multiplyMatrices(n,Xs),Br.matrixWorld=Sd,Br.raycast(e,po);for(let a=0,o=po.length;a<o;a++){let c=po[a];c.instanceId=r,c.object=this,t.push(c)}po.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new er(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Do(new Float32Array(s*this.count),s,this.count,gl,kn));let r=this.morphTexture.source.data.data,a=0;for(let l=0;l<n.length;l++)a+=n[l];let o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},eh=new D,mg=new D,gg=new Xe,Xn=class{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=eh.subVectors(n,t).cross(mg.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(eh),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||gg.getNormalMatrix(e),s=this.coplanarPoint(eh).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},$i=new pi,xg=new de(.5,.5),mo=new D,tr=class{constructor(e=new Xn,t=new Xn,n=new Xn,s=new Xn,r=new Xn,a=new Xn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Ln,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],u=r[5],d=r[6],f=r[7],m=r[8],x=r[9],g=r[10],p=r[11],v=r[12],b=r[13],_=r[14],C=r[15];if(s[0].setComponents(l-a,f-h,p-m,C-v).normalize(),s[1].setComponents(l+a,f+h,p+m,C+v).normalize(),s[2].setComponents(l+o,f+u,p+x,C+b).normalize(),s[3].setComponents(l-o,f-u,p-x,C-b).normalize(),n)s[4].setComponents(c,d,g,_).normalize(),s[5].setComponents(l-c,f-d,p-g,C-_).normalize();else if(s[4].setComponents(l-c,f-d,p-g,C-_).normalize(),t===Ln)s[5].setComponents(l+c,f+d,p+g,C+_).normalize();else if(t===Yr)s[5].setComponents(c,d,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),$i.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),$i.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere($i)}intersectsSprite(e){$i.center.set(0,0,0);let t=xg.distanceTo(e.center);return $i.radius=.7071067811865476+t,$i.applyMatrix4(e.matrixWorld),this.intersectsSphere($i)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(mo.x=s.normal.x>0?e.max.x:e.min.x,mo.y=s.normal.y>0?e.max.y:e.min.y,mo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(mo)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var xi=class extends Yn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ae(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Uo=new D,No=new D,wd=new ct,zr=new Jr,go=new pi,th=new D,Td=new D,Fo=class extends xt{constructor(e=new je,t=new xi){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Uo.fromBufferAttribute(t,s-1),No.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Uo.distanceTo(No);e.setAttribute("lineDistance",new Pe(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),go.copy(n.boundingSphere),go.applyMatrix4(s),go.radius+=r,e.ray.intersectsSphere(go)===!1)return;wd.copy(s).invert(),zr.copy(e.ray).applyMatrix4(wd);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let x=f,g=m-1;x<g;x+=l){let p=h.getX(x),v=h.getX(x+1),b=xo(this,e,zr,c,p,v,x);b&&t.push(b)}if(this.isLineLoop){let x=h.getX(m-1),g=h.getX(f),p=xo(this,e,zr,c,x,g,m-1);p&&t.push(p)}}else{let f=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let x=f,g=m-1;x<g;x+=l){let p=xo(this,e,zr,c,x,x+1,x);p&&t.push(p)}if(this.isLineLoop){let x=xo(this,e,zr,c,m-1,f,m-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function xo(i,e,t,n,s,r,a){let o=i.geometry.attributes.position;if(Uo.fromBufferAttribute(o,s),No.fromBufferAttribute(o,r),t.distanceSqToSegment(Uo,No,th,Td)>n)return;th.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(th);if(!(l<e.near||l>e.far))return{distance:l,point:Td.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var Ad=new D,Rd=new D,Li=class extends Fo{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Ad.fromBufferAttribute(t,s),Rd.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Ad.distanceTo(Rd);e.setAttribute("lineDistance",new Pe(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var yi=class extends an{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},aa=class extends an{constructor(e,t,n=Fi,s,r,a,o=cn,c=cn,l,h=Ys,u=1){if(h!==Ys&&h!==ur)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,s,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Js(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},oa=class extends an{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var ji=class i extends je{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],a=[],o=[],c=[],l=new D,h=new de;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let f=n+u/t*s;l.x=e*Math.cos(f),l.y=e*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,c.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Pe(a,3)),this.setAttribute("normal",new Pe(o,3)),this.setAttribute("uv",new Pe(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},hn=class i extends je{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],m=0,x=[],g=n/2,p=0;v(),a===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(h),this.setAttribute("position",new Pe(u,3)),this.setAttribute("normal",new Pe(d,3)),this.setAttribute("uv",new Pe(f,2));function v(){let _=new D,C=new D,S=0,A=(t-e)/n;for(let R=0;R<=r;R++){let M=[],y=R/r,P=y*(t-e)+e;for(let N=0;N<=s;N++){let B=N/s,H=B*c+o,X=Math.sin(H),q=Math.cos(H);C.x=P*X,C.y=-y*n+g,C.z=P*q,u.push(C.x,C.y,C.z),_.set(X,A,q).normalize(),d.push(_.x,_.y,_.z),f.push(B,1-y),M.push(m++)}x.push(M)}for(let R=0;R<s;R++)for(let M=0;M<r;M++){let y=x[M][R],P=x[M+1][R],N=x[M+1][R+1],B=x[M][R+1];(e>0||M!==0)&&(h.push(y,P,B),S+=3),(t>0||M!==r-1)&&(h.push(P,N,B),S+=3)}l.addGroup(p,S,0),p+=S}function b(_){let C=m,S=new de,A=new D,R=0,M=_===!0?e:t,y=_===!0?1:-1;for(let N=1;N<=s;N++)u.push(0,g*y,0),d.push(0,y,0),f.push(.5,.5),m++;let P=m;for(let N=0;N<=s;N++){let H=N/s*c+o,X=Math.cos(H),q=Math.sin(H);A.x=M*q,A.y=g*y,A.z=M*X,u.push(A.x,A.y,A.z),d.push(0,y,0),S.x=X*.5+.5,S.y=q*.5*y+.5,f.push(S.x,S.y),m++}for(let N=0;N<s;N++){let B=C+N,H=P+N;_===!0?h.push(H,H+1,B):h.push(H+1,H,B),R+=3}l.addGroup(p,R,_===!0?1:2),p+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Kn=class i extends hn{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Oo=class i extends je{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),l(n),h(),this.setAttribute("position",new Pe(r,3)),this.setAttribute("normal",new Pe(r.slice(),3)),this.setAttribute("uv",new Pe(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(v){let b=new D,_=new D,C=new D;for(let S=0;S<t.length;S+=3)f(t[S+0],b),f(t[S+1],_),f(t[S+2],C),c(b,_,C,v)}function c(v,b,_,C){let S=C+1,A=[];for(let R=0;R<=S;R++){A[R]=[];let M=v.clone().lerp(_,R/S),y=b.clone().lerp(_,R/S),P=S-R;for(let N=0;N<=P;N++)N===0&&R===S?A[R][N]=M:A[R][N]=M.clone().lerp(y,N/P)}for(let R=0;R<S;R++)for(let M=0;M<2*(S-R)-1;M++){let y=Math.floor(M/2);M%2===0?(d(A[R][y+1]),d(A[R+1][y]),d(A[R][y])):(d(A[R][y+1]),d(A[R+1][y+1]),d(A[R+1][y]))}}function l(v){let b=new D;for(let _=0;_<r.length;_+=3)b.x=r[_+0],b.y=r[_+1],b.z=r[_+2],b.normalize().multiplyScalar(v),r[_+0]=b.x,r[_+1]=b.y,r[_+2]=b.z}function h(){let v=new D;for(let b=0;b<r.length;b+=3){v.x=r[b+0],v.y=r[b+1],v.z=r[b+2];let _=g(v)/2/Math.PI+.5,C=p(v)/Math.PI+.5;a.push(_,1-C)}m(),u()}function u(){for(let v=0;v<a.length;v+=6){let b=a[v+0],_=a[v+2],C=a[v+4],S=Math.max(b,_,C),A=Math.min(b,_,C);S>.9&&A<.1&&(b<.2&&(a[v+0]+=1),_<.2&&(a[v+2]+=1),C<.2&&(a[v+4]+=1))}}function d(v){r.push(v.x,v.y,v.z)}function f(v,b){let _=v*3;b.x=e[_+0],b.y=e[_+1],b.z=e[_+2]}function m(){let v=new D,b=new D,_=new D,C=new D,S=new de,A=new de,R=new de;for(let M=0,y=0;M<r.length;M+=9,y+=6){v.set(r[M+0],r[M+1],r[M+2]),b.set(r[M+3],r[M+4],r[M+5]),_.set(r[M+6],r[M+7],r[M+8]),S.set(a[y+0],a[y+1]),A.set(a[y+2],a[y+3]),R.set(a[y+4],a[y+5]),C.copy(v).add(b).add(_).divideScalar(3);let P=g(C);x(S,y+0,v,P),x(A,y+2,b,P),x(R,y+4,_,P)}}function x(v,b,_,C){C<0&&v.x===1&&(a[b]=v.x-1),_.x===0&&_.z===0&&(a[b]=C/2/Math.PI+.5)}function g(v){return Math.atan2(v.z,-v.x)}function p(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}};var xn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);let h=n[s],d=n[s+1]-h,f=(a-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new de:new D);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new D,s=[],r=[],a=[],o=new D,c=new ct;for(let f=0;f<=e;f++){let m=f/e;s[f]=this.getTangentAt(m,new D)}r[0]=new D,a[0]=new D;let l=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(Je(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,m))}a[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(Je(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let m=1;m<=e;m++)r[m].applyMatrix4(c.makeRotationAxis(s[m],f*m)),a[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},nr=class extends xn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new de){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Bo=class extends nr{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Nh(){let i=0,e=0,t=0,n=0;function s(r,a,o,c){i=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,u){let d=(a-r)/l-(o-r)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,f*=h,s(a,o,d,f)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var yo=new D,nh=new Nh,ih=new Nh,sh=new Nh,ko=class extends xn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new D){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=s[(o-1)%r]:(yo.subVectors(s[0],s[1]).add(s[0]),l=yo);let u=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(yo.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=yo),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(l.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);x<1e-4&&(x=1),m<1e-4&&(m=x),g<1e-4&&(g=x),nh.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,m,x,g),ih.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,m,x,g),sh.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,m,x,g)}else this.curveType==="catmullrom"&&(nh.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),ih.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),sh.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(nh.calc(c),ih.calc(c),sh.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new D().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Cd(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,c=i*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*i+t}function yg(i,e){let t=1-i;return t*t*e}function _g(i,e){return 2*(1-i)*i*e}function vg(i,e){return i*i*e}function Wr(i,e,t,n){return yg(i,e)+_g(i,t)+vg(i,n)}function Mg(i,e){let t=1-i;return t*t*t*e}function bg(i,e){let t=1-i;return 3*t*t*i*e}function Sg(i,e){return 3*(1-i)*i*i*e}function Eg(i,e){return i*i*i*e}function Xr(i,e,t,n,s){return Mg(i,e)+bg(i,t)+Sg(i,n)+Eg(i,s)}var la=class extends xn{constructor(e=new de,t=new de,n=new de,s=new de){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new de){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Xr(e,s.x,r.x,a.x,o.x),Xr(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},zo=class extends xn{constructor(e=new D,t=new D,n=new D,s=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new D){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Xr(e,s.x,r.x,a.x,o.x),Xr(e,s.y,r.y,a.y,o.y),Xr(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ca=class extends xn{constructor(e=new de,t=new de){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new de){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new de){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ho=class extends xn{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ha=class extends xn{constructor(e=new de,t=new de,n=new de){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new de){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Wr(e,s.x,r.x,a.x),Wr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Go=class extends xn{constructor(e=new D,t=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new D){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(Wr(e,s.x,r.x,a.x),Wr(e,s.y,r.y,a.y),Wr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ua=class extends xn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new de){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(Cd(o,c.x,l.x,h.x,u.x),Cd(o,c.y,l.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new de().fromArray(s))}return this}},Id=Object.freeze({__proto__:null,ArcCurve:Bo,CatmullRomCurve3:ko,CubicBezierCurve:la,CubicBezierCurve3:zo,EllipseCurve:nr,LineCurve:ca,LineCurve3:Ho,QuadraticBezierCurve:ha,QuadraticBezierCurve3:Go,SplineCurve:ua}),Vo=class extends xn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Id[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Id[s.type]().fromJSON(s))}return this}},da=class extends Vo{constructor(e){super(),this.type="Path",this.currentPoint=new de,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new ca(this.currentPoint.clone(),new de(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new ha(this.currentPoint.clone(),new de(e,t),new de(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new la(this.currentPoint.clone(),new de(e,t),new de(n,s),new de(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new ua(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,s,r,a,o,c),this}absellipse(e,t,n,s,r,a,o,c){let l=new nr(e,t,n,s,r,a,o,c);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},ir=class extends da{constructor(e){super(e),this.uuid=qn(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new da().fromJSON(s))}return this}};function wg(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Af(i,0,s,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=Ig(i,e,r,t)),i.length>80*t){o=1/0,c=1/0;let h=-1/0,u=-1/0;for(let d=t;d<s;d+=t){let f=i[d],m=i[d+1];f<o&&(o=f),m<c&&(c=m),f>h&&(h=f),m>u&&(u=m)}l=Math.max(h-o,u-c),l=l!==0?32767/l:0}return fa(r,a,t,o,c,l,0),a}function Af(i,e,t,n,s){let r;if(s===Hg(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=Pd(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=Pd(a/n|0,i[a],i[a+1],r);return r&&sr(r,r.next)&&(ma(r),r=r.next),r}function Qi(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(sr(t,t.next)||Ct(t.prev,t,t.next)===0)){if(ma(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function fa(i,e,t,n,s,r,a){if(!i)return;!a&&r&&Ng(i,n,s,r);let o=i;for(;i.prev!==i.next;){let c=i.prev,l=i.next;if(r?Ag(i,n,s,r):Tg(i)){e.push(c.i,i.i,l.i),ma(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=Rg(Qi(i),e),fa(i,e,t,n,s,r,2)):a===2&&Cg(i,e,t,n,s,r):fa(Qi(i),e,t,n,s,r,1);break}}}function Tg(i){let e=i.prev,t=i,n=i.next;if(Ct(e,t,n)>=0)return!1;let s=e.x,r=t.x,a=n.x,o=e.y,c=t.y,l=n.y,h=Math.min(s,r,a),u=Math.min(o,c,l),d=Math.max(s,r,a),f=Math.max(o,c,l),m=n.next;for(;m!==e;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&Hr(s,o,r,c,a,l,m.x,m.y)&&Ct(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Ag(i,e,t,n){let s=i.prev,r=i,a=i.next;if(Ct(s,r,a)>=0)return!1;let o=s.x,c=r.x,l=a.x,h=s.y,u=r.y,d=a.y,f=Math.min(o,c,l),m=Math.min(h,u,d),x=Math.max(o,c,l),g=Math.max(h,u,d),p=hh(f,m,e,t,n),v=hh(x,g,e,t,n),b=i.prevZ,_=i.nextZ;for(;b&&b.z>=p&&_&&_.z<=v;){if(b.x>=f&&b.x<=x&&b.y>=m&&b.y<=g&&b!==s&&b!==a&&Hr(o,h,c,u,l,d,b.x,b.y)&&Ct(b.prev,b,b.next)>=0||(b=b.prevZ,_.x>=f&&_.x<=x&&_.y>=m&&_.y<=g&&_!==s&&_!==a&&Hr(o,h,c,u,l,d,_.x,_.y)&&Ct(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;b&&b.z>=p;){if(b.x>=f&&b.x<=x&&b.y>=m&&b.y<=g&&b!==s&&b!==a&&Hr(o,h,c,u,l,d,b.x,b.y)&&Ct(b.prev,b,b.next)>=0)return!1;b=b.prevZ}for(;_&&_.z<=v;){if(_.x>=f&&_.x<=x&&_.y>=m&&_.y<=g&&_!==s&&_!==a&&Hr(o,h,c,u,l,d,_.x,_.y)&&Ct(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function Rg(i,e){let t=i;do{let n=t.prev,s=t.next.next;!sr(n,s)&&Cf(n,t,t.next,s)&&pa(n,s)&&pa(s,n)&&(e.push(n.i,t.i,s.i),ma(t),ma(t.next),t=i=s),t=t.next}while(t!==i);return Qi(t)}function Cg(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Bg(a,o)){let c=If(a,o);a=Qi(a,a.next),c=Qi(c,c.next),fa(a,e,t,n,s,r,0),fa(c,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Ig(i,e,t,n){let s=[];for(let r=0,a=e.length;r<a;r++){let o=e[r]*n,c=r<a-1?e[r+1]*n:i.length,l=Af(i,o,c,n,!1);l===l.next&&(l.steiner=!0),s.push(Og(l))}s.sort(Pg);for(let r=0;r<s.length;r++)t=Lg(s[r],t);return t}function Pg(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function Lg(i,e){let t=Dg(i,e);if(!t)return e;let n=If(t,i);return Qi(n,n.next),Qi(t,t.next)}function Dg(i,e){let t=e,n=i.x,s=i.y,r=-1/0,a;if(sr(i,t))return t;do{if(sr(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;let o=a,c=a.x,l=a.y,h=1/0;t=a;do{if(n>=t.x&&t.x>=c&&n!==t.x&&Rf(s<l?n:r,s,c,l,s<l?r:n,s,t.x,t.y)){let u=Math.abs(s-t.y)/(n-t.x);pa(t,i)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&Ug(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function Ug(i,e){return Ct(i.prev,i,e.prev)<0&&Ct(e.next,i,i.next)<0}function Ng(i,e,t,n){let s=i;do s.z===0&&(s.z=hh(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Fg(s)}function Fg(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let l=0;l<t&&(o++,a=a.nextZ,!!a);l++);let c=t;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function hh(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Og(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Rf(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function Hr(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&Rf(i,e,t,n,s,r,a,o)}function Bg(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!kg(i,e)&&(pa(i,e)&&pa(e,i)&&zg(i,e)&&(Ct(i.prev,i,e.prev)||Ct(i,e.prev,e))||sr(i,e)&&Ct(i.prev,i,i.next)>0&&Ct(e.prev,e,e.next)>0)}function Ct(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function sr(i,e){return i.x===e.x&&i.y===e.y}function Cf(i,e,t,n){let s=vo(Ct(i,e,t)),r=vo(Ct(i,e,n)),a=vo(Ct(t,n,i)),o=vo(Ct(t,n,e));return!!(s!==r&&a!==o||s===0&&_o(i,t,e)||r===0&&_o(i,n,e)||a===0&&_o(t,i,n)||o===0&&_o(t,e,n))}function _o(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function vo(i){return i>0?1:i<0?-1:0}function kg(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Cf(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function pa(i,e){return Ct(i.prev,i,i.next)<0?Ct(i,e,i.next)>=0&&Ct(i,i.prev,e)>=0:Ct(i,e,i.prev)<0||Ct(i,i.next,e)<0}function zg(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function If(i,e){let t=uh(i.i,i.x,i.y),n=uh(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Pd(i,e,t,n){let s=uh(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function ma(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function uh(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Hg(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var dh=class{static triangulate(e,t,n=2){return wg(e,t,n)}},$s=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Ld(e),Dd(n,e);let a=e.length;t.forEach(Ld);for(let c=0;c<t.length;c++)s.push(a),a+=t[c].length,Dd(n,t[c]);let o=dh.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}};function Ld(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Dd(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var Jn=class i extends Oo{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var Nt=class i extends je{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,u=e/o,d=t/c,f=[],m=[],x=[],g=[];for(let p=0;p<h;p++){let v=p*d-a;for(let b=0;b<l;b++){let _=b*u-r;m.push(_,-v,0),x.push(0,0,1),g.push(b/o),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let v=0;v<o;v++){let b=v+l*p,_=v+l*(p+1),C=v+1+l*(p+1),S=v+1+l*p;f.push(b,_,S),f.push(_,C,S)}this.setIndex(f),this.setAttribute("position",new Pe(m,3)),this.setAttribute("normal",new Pe(x,3)),this.setAttribute("uv",new Pe(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},es=class i extends je{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],c=[],l=[],h=[],u=e,d=(t-e)/s,f=new D,m=new de;for(let x=0;x<=s;x++){for(let g=0;g<=n;g++){let p=r+g/n*a;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),m.x=(f.x/t+1)/2,m.y=(f.y/t+1)/2,h.push(m.x,m.y)}u+=d}for(let x=0;x<s;x++){let g=x*(n+1);for(let p=0;p<n;p++){let v=p+g,b=v,_=v+n+1,C=v+n+2,S=v+1;o.push(b,_,S),o.push(_,C,S)}}this.setIndex(o),this.setAttribute("position",new Pe(c,3)),this.setAttribute("normal",new Pe(l,3)),this.setAttribute("uv",new Pe(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},ga=class i extends je{constructor(e=new ir([new de(0,.5),new de(-.5,-.5),new de(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],a=[],o=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let h=0;h<e.length;h++)l(e[h]),this.addGroup(o,c,h),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new Pe(s,3)),this.setAttribute("normal",new Pe(r,3)),this.setAttribute("uv",new Pe(a,2));function l(h){let u=s.length/3,d=h.extractPoints(t),f=d.shape,m=d.holes;$s.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,p=m.length;g<p;g++){let v=m[g];$s.isClockWise(v)===!0&&(m[g]=v.reverse())}let x=$s.triangulateShape(f,m);for(let g=0,p=m.length;g<p;g++){let v=m[g];f=f.concat(v)}for(let g=0,p=f.length;g<p;g++){let v=f[g];s.push(v.x,v.y,0),r.push(0,0,1),a.push(v.x,v.y)}for(let g=0,p=x.length;g<p;g++){let v=x[g],b=v[0]+u,_=v[1]+u,C=v[2]+u;n.push(b,_,C),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return Gg(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let a=t[e.shapes[s]];n.push(a)}return new i(n,e.curveSegments)}};function Gg(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}var On=class i extends je{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),l=0,h=[],u=new D,d=new D,f=[],m=[],x=[],g=[];for(let p=0;p<=n;p++){let v=[],b=p/n,_=0;p===0&&a===0?_=.5/t:p===n&&c===Math.PI&&(_=-.5/t);for(let C=0;C<=t;C++){let S=C/t;u.x=-e*Math.cos(s+S*r)*Math.sin(a+b*o),u.y=e*Math.cos(a+b*o),u.z=e*Math.sin(s+S*r)*Math.sin(a+b*o),m.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),g.push(S+_,1-b),v.push(l++)}h.push(v)}for(let p=0;p<n;p++)for(let v=0;v<t;v++){let b=h[p][v+1],_=h[p][v],C=h[p+1][v],S=h[p+1][v+1];(p!==0||a>0)&&f.push(b,_,S),(p!==n-1||c<Math.PI)&&f.push(_,C,S)}this.setIndex(f),this.setAttribute("position",new Pe(m,3)),this.setAttribute("normal",new Pe(x,3)),this.setAttribute("uv",new Pe(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var _i=class i extends je{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let a=[],o=[],c=[],l=[],h=new D,u=new D,d=new D;for(let f=0;f<=n;f++)for(let m=0;m<=s;m++){let x=m/s*r,g=f/n*Math.PI*2;u.x=(e+t*Math.cos(g))*Math.cos(x),u.y=(e+t*Math.cos(g))*Math.sin(x),u.z=t*Math.sin(g),o.push(u.x,u.y,u.z),h.x=e*Math.cos(x),h.y=e*Math.sin(x),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(m/s),l.push(f/n)}for(let f=1;f<=n;f++)for(let m=1;m<=s;m++){let x=(s+1)*f+m-1,g=(s+1)*(f-1)+m-1,p=(s+1)*(f-1)+m,v=(s+1)*f+m;a.push(x,g,v),a.push(g,p,v)}this.setIndex(a),this.setAttribute("position",new Pe(o,3)),this.setAttribute("normal",new Pe(c,3)),this.setAttribute("uv",new Pe(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Tt=class extends Yn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ae(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ch,this.normalScale=new de(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Nn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},rr=class extends Tt{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new de(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Je(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ae(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ae(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ae(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Wo=class extends Yn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=df,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Xo=class extends Yn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Mo(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function Vg(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var ts=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},qo=class extends ts{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ah,endingEnd:ah}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case oh:r=e,o=2*t-n;break;case lh:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case oh:a=e,c=2*n-t;break;case lh:a=1,c=n+s[1]-s[0];break;default:a=e-1,c=t}let l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(n-t)/(s-t),x=m*m,g=x*m,p=-d*g+2*d*x-d*m,v=(1+d)*g+(-1.5-2*d)*x+(-.5+d)*m+1,b=(-1-f)*g+(1.5+f)*x+.5*m,_=f*g-f*x;for(let C=0;C!==o;++C)r[C]=p*a[h+C]+v*a[l+C]+b*a[c+C]+_*a[u+C];return r}},$o=class extends ts{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[l+d]*u+a[c+d]*h;return r}},Yo=class extends ts{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},yn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Mo(t,this.TimeBufferType),this.values=Mo(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Mo(e.times,Array),values:Mo(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Yo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new $o(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new qo(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case qr:t=this.InterpolantFactoryMethodDiscrete;break;case To:t=this.InterpolantFactoryMethodLinear;break;case bo:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return qr;case this.InterpolantFactoryMethodLinear:return To;case this.InterpolantFactoryMethodSmooth:return bo}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(s!==void 0&&Vg(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===bo,r=e.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=e[o],h=e[o+1];if(l!==h&&(o!==1||l!==e[0]))if(s)c=!0;else{let u=o*n,d=u-n,f=u+n;for(let m=0;m!==n;++m){let x=t[u+m];if(x!==t[d+m]||x!==t[f+m]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];let u=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)t[c+l]=t[o+l];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};yn.prototype.ValueTypeName="";yn.prototype.TimeBufferType=Float32Array;yn.prototype.ValueBufferType=Float32Array;yn.prototype.DefaultInterpolation=To;var Di=class extends yn{constructor(e,t,n){super(e,t,n)}};Di.prototype.ValueTypeName="bool";Di.prototype.ValueBufferType=Array;Di.prototype.DefaultInterpolation=qr;Di.prototype.InterpolantFactoryMethodLinear=void 0;Di.prototype.InterpolantFactoryMethodSmooth=void 0;var Zo=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}};Zo.prototype.ValueTypeName="color";var Ko=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}};Ko.prototype.ValueTypeName="number";var Jo=class extends ts{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-t)/(s-t),l=e*o;for(let h=l+o;l!==h;l+=4)Un.slerpFlat(r,0,a,l-o,a,l,c);return r}},xa=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Jo(this.times,this.values,this.getValueSize(),e)}};xa.prototype.ValueTypeName="quaternion";xa.prototype.InterpolantFactoryMethodSmooth=void 0;var Ui=class extends yn{constructor(e,t,n){super(e,t,n)}};Ui.prototype.ValueTypeName="string";Ui.prototype.ValueBufferType=Array;Ui.prototype.DefaultInterpolation=qr;Ui.prototype.InterpolantFactoryMethodLinear=void 0;Ui.prototype.InterpolantFactoryMethodSmooth=void 0;var jo=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}};jo.prototype.ValueTypeName="vector";var Qo=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){let f=l[u],m=l[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Pf=new Qo,el=class{constructor(e){this.manager=e!==void 0?e:Pf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};el.DEFAULT_MATERIAL_NAME="__DEFAULT";var ya=class extends xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ae(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},_a=class extends ya{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ae(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},rh=new ct,Ud=new D,Nd=new D,fh=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new de(512,512),this.mapType=Bn,this.map=null,this.mapPass=null,this.matrix=new ct,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new tr,this._frameExtents=new de(1,1),this._viewportCount=1,this._viewports=[new It(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Ud.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ud),Nd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Nd),t.updateMatrixWorld(),rh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(rh,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(rh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var va=class extends ta{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ph=class extends fh{constructor(){super(new va(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ar=class extends ya{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.shadow=new ph}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var tl=class extends Qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var Fh="\\[\\]\\.:\\/",Wg=new RegExp("["+Fh+"]","g"),Oh="[^"+Fh+"]",Xg="[^"+Fh.replace("\\.","")+"]",qg=/((?:WC+[\/:])*)/.source.replace("WC",Oh),$g=/(WCOD+)?/.source.replace("WCOD",Xg),Yg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Oh),Zg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Oh),Kg=new RegExp("^"+qg+$g+Yg+Zg+"$"),Jg=["material","materials","bones","map"],mh=class{constructor(e,t,n){let s=n||bt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},bt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Wg,"")}static parseTrackName(e){let t=Kg.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Jg.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let c=n(o.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let a=e[s];if(a===void 0){let l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};bt.Composite=mh;bt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};bt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};bt.prototype.GetterByBindingType=[bt.prototype._getValue_direct,bt.prototype._getValue_array,bt.prototype._getValue_arrayElement,bt.prototype._getValue_toArray];bt.prototype.SetterByBindingTypeAndVersioning=[[bt.prototype._setValue_direct,bt.prototype._setValue_direct_setNeedsUpdate,bt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_array,bt.prototype._setValue_array_setNeedsUpdate,bt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_arrayElement,bt.prototype._setValue_arrayElement_setNeedsUpdate,bt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_fromArray,bt.prototype._setValue_fromArray_setNeedsUpdate,bt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var NM=new Float32Array(1);function Bh(i,e,t,n){let s=jg(n);switch(t){case Th:return i*e;case gl:return i*e/s.components*s.byteLength;case xl:return i*e/s.components*s.byteLength;case Rh:return i*e*2/s.components*s.byteLength;case yl:return i*e*2/s.components*s.byteLength;case Ah:return i*e*3/s.components*s.byteLength;case Tn:return i*e*4/s.components*s.byteLength;case _l:return i*e*4/s.components*s.byteLength;case Sa:case Ea:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case wa:case Ta:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ml:case Sl:return Math.max(i,16)*Math.max(e,8)/4;case vl:case bl:return Math.max(i,8)*Math.max(e,8)/2;case El:case wl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Tl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Al:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Rl:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Cl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Il:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Pl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ll:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Dl:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Ul:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Nl:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Fl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ol:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Bl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case kl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case zl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Hl:case Gl:case Vl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Wl:case Xl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case ql:case $l:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function jg(i){switch(i){case Bn:case bh:return{byteLength:1,components:1};case lr:case Sh:case cr:return{byteLength:2,components:1};case pl:case ml:return{byteLength:2,components:4};case Fi:case fl:case kn:return{byteLength:4,components:1};case Eh:case wh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function tp(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function i0(i){let e=new WeakMap;function t(o,c){let l=o.array,h=o.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){let h=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){let m=u[d],x=u[f];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++d,u[d]=x)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){let x=u[f];i.bufferSubData(l,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var s0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,r0=`#ifdef USE_ALPHAHASH
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
#endif`,a0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,o0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,l0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,c0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,h0=`#ifdef USE_AOMAP
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
#endif`,u0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,d0=`#ifdef USE_BATCHING
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
#endif`,f0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,p0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,m0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,g0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,x0=`#ifdef USE_IRIDESCENCE
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
#endif`,y0=`#ifdef USE_BUMPMAP
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
#endif`,_0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,v0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,M0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,b0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,S0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,E0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,w0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,T0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,A0=`#define PI 3.141592653589793
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
} // validated`,R0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,C0=`vec3 transformedNormal = objectNormal;
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
#endif`,I0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,P0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,L0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,D0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,U0="gl_FragColor = linearToOutputTexel( gl_FragColor );",N0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,F0=`#ifdef USE_ENVMAP
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
#endif`,O0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,B0=`#ifdef USE_ENVMAP
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
#endif`,k0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,z0=`#ifdef USE_ENVMAP
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
#endif`,H0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,G0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,V0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,W0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,X0=`#ifdef USE_GRADIENTMAP
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
}`,q0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,$0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Y0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Z0=`uniform bool receiveShadow;
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
#endif`,K0=`#ifdef USE_ENVMAP
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
#endif`,J0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,j0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Q0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ex=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,tx=`PhysicalMaterial material;
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
#endif`,nx=`struct PhysicalMaterial {
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
}`,ix=`
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
#endif`,sx=`#if defined( RE_IndirectDiffuse )
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
#endif`,rx=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ax=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ox=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,lx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,cx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,hx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ux=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,dx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,fx=`#if defined( USE_POINTS_UV )
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
#endif`,px=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,mx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,gx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,xx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,yx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,_x=`#ifdef USE_MORPHTARGETS
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
#endif`,vx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Mx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,bx=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Sx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ex=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,wx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Tx=`#ifdef USE_NORMALMAP
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
#endif`,Ax=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Rx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Cx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ix=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Px=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Lx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Dx=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ux=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Nx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Fx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ox=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Bx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,kx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,zx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Hx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Gx=`float getShadowMask() {
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
}`,Vx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Wx=`#ifdef USE_SKINNING
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
#endif`,Xx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,qx=`#ifdef USE_SKINNING
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
#endif`,$x=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Yx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Zx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Kx=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Jx=`#ifdef USE_TRANSMISSION
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
#endif`,jx=`#ifdef USE_TRANSMISSION
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
#endif`,Qx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ey=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ty=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ny=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,iy=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,sy=`uniform sampler2D t2D;
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
}`,ry=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ay=`#ifdef ENVMAP_TYPE_CUBE
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
}`,oy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ly=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cy=`#include <common>
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
}`,hy=`#if DEPTH_PACKING == 3200
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
}`,uy=`#define DISTANCE
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
}`,dy=`#define DISTANCE
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
}`,fy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,py=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,my=`uniform float scale;
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
}`,gy=`uniform vec3 diffuse;
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
}`,xy=`#include <common>
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
}`,yy=`uniform vec3 diffuse;
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
}`,_y=`#define LAMBERT
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
}`,vy=`#define LAMBERT
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
}`,My=`#define MATCAP
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
}`,by=`#define MATCAP
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
}`,Sy=`#define NORMAL
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
}`,Ey=`#define NORMAL
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
}`,wy=`#define PHONG
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
}`,Ty=`#define PHONG
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
}`,Ay=`#define STANDARD
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
}`,Ry=`#define STANDARD
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
}`,Cy=`#define TOON
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
}`,Iy=`#define TOON
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
}`,Py=`uniform float size;
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
}`,Ly=`uniform vec3 diffuse;
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
}`,Dy=`#include <common>
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
}`,Uy=`uniform vec3 color;
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
}`,Ny=`uniform float rotation;
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
}`,Fy=`uniform vec3 diffuse;
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
}`,Ze={alphahash_fragment:s0,alphahash_pars_fragment:r0,alphamap_fragment:a0,alphamap_pars_fragment:o0,alphatest_fragment:l0,alphatest_pars_fragment:c0,aomap_fragment:h0,aomap_pars_fragment:u0,batching_pars_vertex:d0,batching_vertex:f0,begin_vertex:p0,beginnormal_vertex:m0,bsdfs:g0,iridescence_fragment:x0,bumpmap_pars_fragment:y0,clipping_planes_fragment:_0,clipping_planes_pars_fragment:v0,clipping_planes_pars_vertex:M0,clipping_planes_vertex:b0,color_fragment:S0,color_pars_fragment:E0,color_pars_vertex:w0,color_vertex:T0,common:A0,cube_uv_reflection_fragment:R0,defaultnormal_vertex:C0,displacementmap_pars_vertex:I0,displacementmap_vertex:P0,emissivemap_fragment:L0,emissivemap_pars_fragment:D0,colorspace_fragment:U0,colorspace_pars_fragment:N0,envmap_fragment:F0,envmap_common_pars_fragment:O0,envmap_pars_fragment:B0,envmap_pars_vertex:k0,envmap_physical_pars_fragment:K0,envmap_vertex:z0,fog_vertex:H0,fog_pars_vertex:G0,fog_fragment:V0,fog_pars_fragment:W0,gradientmap_pars_fragment:X0,lightmap_pars_fragment:q0,lights_lambert_fragment:$0,lights_lambert_pars_fragment:Y0,lights_pars_begin:Z0,lights_toon_fragment:J0,lights_toon_pars_fragment:j0,lights_phong_fragment:Q0,lights_phong_pars_fragment:ex,lights_physical_fragment:tx,lights_physical_pars_fragment:nx,lights_fragment_begin:ix,lights_fragment_maps:sx,lights_fragment_end:rx,logdepthbuf_fragment:ax,logdepthbuf_pars_fragment:ox,logdepthbuf_pars_vertex:lx,logdepthbuf_vertex:cx,map_fragment:hx,map_pars_fragment:ux,map_particle_fragment:dx,map_particle_pars_fragment:fx,metalnessmap_fragment:px,metalnessmap_pars_fragment:mx,morphinstance_vertex:gx,morphcolor_vertex:xx,morphnormal_vertex:yx,morphtarget_pars_vertex:_x,morphtarget_vertex:vx,normal_fragment_begin:Mx,normal_fragment_maps:bx,normal_pars_fragment:Sx,normal_pars_vertex:Ex,normal_vertex:wx,normalmap_pars_fragment:Tx,clearcoat_normal_fragment_begin:Ax,clearcoat_normal_fragment_maps:Rx,clearcoat_pars_fragment:Cx,iridescence_pars_fragment:Ix,opaque_fragment:Px,packing:Lx,premultiplied_alpha_fragment:Dx,project_vertex:Ux,dithering_fragment:Nx,dithering_pars_fragment:Fx,roughnessmap_fragment:Ox,roughnessmap_pars_fragment:Bx,shadowmap_pars_fragment:kx,shadowmap_pars_vertex:zx,shadowmap_vertex:Hx,shadowmask_pars_fragment:Gx,skinbase_vertex:Vx,skinning_pars_vertex:Wx,skinning_vertex:Xx,skinnormal_vertex:qx,specularmap_fragment:$x,specularmap_pars_fragment:Yx,tonemapping_fragment:Zx,tonemapping_pars_fragment:Kx,transmission_fragment:Jx,transmission_pars_fragment:jx,uv_pars_fragment:Qx,uv_pars_vertex:ey,uv_vertex:ty,worldpos_vertex:ny,background_vert:iy,background_frag:sy,backgroundCube_vert:ry,backgroundCube_frag:ay,cube_vert:oy,cube_frag:ly,depth_vert:cy,depth_frag:hy,distanceRGBA_vert:uy,distanceRGBA_frag:dy,equirect_vert:fy,equirect_frag:py,linedashed_vert:my,linedashed_frag:gy,meshbasic_vert:xy,meshbasic_frag:yy,meshlambert_vert:_y,meshlambert_frag:vy,meshmatcap_vert:My,meshmatcap_frag:by,meshnormal_vert:Sy,meshnormal_frag:Ey,meshphong_vert:wy,meshphong_frag:Ty,meshphysical_vert:Ay,meshphysical_frag:Ry,meshtoon_vert:Cy,meshtoon_frag:Iy,points_vert:Py,points_frag:Ly,shadow_vert:Dy,shadow_frag:Uy,sprite_vert:Ny,sprite_frag:Fy},fe={common:{diffuse:{value:new Ae(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Xe}},envmap:{envMap:{value:null},envMapRotation:{value:new Xe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Xe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Xe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Xe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Xe},normalScale:{value:new de(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Xe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Xe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Xe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Xe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ae(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ae(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0},uvTransform:{value:new Xe}},sprite:{diffuse:{value:new Ae(16777215)},opacity:{value:1},center:{value:new de(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}}},Qn={basic:{uniforms:tn([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.fog]),vertexShader:Ze.meshbasic_vert,fragmentShader:Ze.meshbasic_frag},lambert:{uniforms:tn([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new Ae(0)}}]),vertexShader:Ze.meshlambert_vert,fragmentShader:Ze.meshlambert_frag},phong:{uniforms:tn([fe.common,fe.specularmap,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,fe.lights,{emissive:{value:new Ae(0)},specular:{value:new Ae(1118481)},shininess:{value:30}}]),vertexShader:Ze.meshphong_vert,fragmentShader:Ze.meshphong_frag},standard:{uniforms:tn([fe.common,fe.envmap,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.roughnessmap,fe.metalnessmap,fe.fog,fe.lights,{emissive:{value:new Ae(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag},toon:{uniforms:tn([fe.common,fe.aomap,fe.lightmap,fe.emissivemap,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.gradientmap,fe.fog,fe.lights,{emissive:{value:new Ae(0)}}]),vertexShader:Ze.meshtoon_vert,fragmentShader:Ze.meshtoon_frag},matcap:{uniforms:tn([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,fe.fog,{matcap:{value:null}}]),vertexShader:Ze.meshmatcap_vert,fragmentShader:Ze.meshmatcap_frag},points:{uniforms:tn([fe.points,fe.fog]),vertexShader:Ze.points_vert,fragmentShader:Ze.points_frag},dashed:{uniforms:tn([fe.common,fe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ze.linedashed_vert,fragmentShader:Ze.linedashed_frag},depth:{uniforms:tn([fe.common,fe.displacementmap]),vertexShader:Ze.depth_vert,fragmentShader:Ze.depth_frag},normal:{uniforms:tn([fe.common,fe.bumpmap,fe.normalmap,fe.displacementmap,{opacity:{value:1}}]),vertexShader:Ze.meshnormal_vert,fragmentShader:Ze.meshnormal_frag},sprite:{uniforms:tn([fe.sprite,fe.fog]),vertexShader:Ze.sprite_vert,fragmentShader:Ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Xe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ze.background_vert,fragmentShader:Ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Xe}},vertexShader:Ze.backgroundCube_vert,fragmentShader:Ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ze.cube_vert,fragmentShader:Ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ze.equirect_vert,fragmentShader:Ze.equirect_frag},distanceRGBA:{uniforms:tn([fe.common,fe.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ze.distanceRGBA_vert,fragmentShader:Ze.distanceRGBA_frag},shadow:{uniforms:tn([fe.lights,fe.fog,{color:{value:new Ae(0)},opacity:{value:1}}]),vertexShader:Ze.shadow_vert,fragmentShader:Ze.shadow_frag}};Qn.physical={uniforms:tn([Qn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Xe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Xe},clearcoatNormalScale:{value:new de(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Xe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Xe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Xe},sheen:{value:0},sheenColor:{value:new Ae(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Xe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Xe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Xe},transmissionSamplerSize:{value:new de},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Xe},attenuationDistance:{value:0},attenuationColor:{value:new Ae(0)},specularColor:{value:new Ae(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Xe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Xe},anisotropyVector:{value:new de},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Xe}}]),vertexShader:Ze.meshphysical_vert,fragmentShader:Ze.meshphysical_frag};var Yl={r:0,b:0,g:0},as=new Nn,Oy=new ct;function By(i,e,t,n,s,r,a){let o=new Ae(0),c=r===!0?0:1,l,h,u=null,d=0,f=null;function m(b){let _=b.isScene===!0?b.background:null;return _&&_.isTexture&&(_=(b.backgroundBlurriness>0?t:e).get(_)),_}function x(b){let _=!1,C=m(b);C===null?p(o,c):C&&C.isColor&&(p(C,1),_=!0);let S=i.xr.getEnvironmentBlendMode();S==="additive"?n.buffers.color.setClear(0,0,0,1,a):S==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(b,_){let C=m(_);C&&(C.isCubeTexture||C.mapping===Ma)?(h===void 0&&(h=new ve(new yt(1,1,1),new Fn({name:"BackgroundCubeMaterial",uniforms:rs(Qn.backgroundCube.uniforms),vertexShader:Qn.backgroundCube.vertexShader,fragmentShader:Qn.backgroundCube.fragmentShader,side:Ht,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(S,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),as.copy(_.backgroundRotation),as.x*=-1,as.y*=-1,as.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(as.y*=-1,as.z*=-1),h.material.uniforms.envMap.value=C,h.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Oy.makeRotationFromEuler(as)),h.material.toneMapped=tt.getTransfer(C.colorSpace)!==lt,(u!==C||d!==C.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=C,d=C.version,f=i.toneMapping),h.layers.enableAll(),b.unshift(h,h.geometry,h.material,0,0,null)):C&&C.isTexture&&(l===void 0&&(l=new ve(new Nt(2,2),new Fn({name:"BackgroundMaterial",uniforms:rs(Qn.background.uniforms),vertexShader:Qn.background.vertexShader,fragmentShader:Qn.background.fragmentShader,side:di,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=C,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=tt.getTransfer(C.colorSpace)!==lt,C.matrixAutoUpdate===!0&&C.updateMatrix(),l.material.uniforms.uvTransform.value.copy(C.matrix),(u!==C||d!==C.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=C,d=C.version,f=i.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function p(b,_){b.getRGB(Yl,Uh(i)),n.buffers.color.setClear(Yl.r,Yl.g,Yl.b,_,a)}function v(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(b,_=1){o.set(b),c=_,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(b){c=b,p(o,c)},render:x,addToRenderList:g,dispose:v}}function ky(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,a=!1;function o(y,P,N,B,H){let X=!1,q=u(B,N,P);r!==q&&(r=q,l(r.object)),X=f(y,B,N,H),X&&m(y,B,N,H),H!==null&&e.update(H,i.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,_(y,P,N,B),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function c(){return i.createVertexArray()}function l(y){return i.bindVertexArray(y)}function h(y){return i.deleteVertexArray(y)}function u(y,P,N){let B=N.wireframe===!0,H=n[y.id];H===void 0&&(H={},n[y.id]=H);let X=H[P.id];X===void 0&&(X={},H[P.id]=X);let q=X[B];return q===void 0&&(q=d(c()),X[B]=q),q}function d(y){let P=[],N=[],B=[];for(let H=0;H<t;H++)P[H]=0,N[H]=0,B[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:N,attributeDivisors:B,object:y,attributes:{},index:null}}function f(y,P,N,B){let H=r.attributes,X=P.attributes,q=0,ee=N.getAttributes();for(let O in ee)if(ee[O].location>=0){let ie=H[O],xe=X[O];if(xe===void 0&&(O==="instanceMatrix"&&y.instanceMatrix&&(xe=y.instanceMatrix),O==="instanceColor"&&y.instanceColor&&(xe=y.instanceColor)),ie===void 0||ie.attribute!==xe||xe&&ie.data!==xe.data)return!0;q++}return r.attributesNum!==q||r.index!==B}function m(y,P,N,B){let H={},X=P.attributes,q=0,ee=N.getAttributes();for(let O in ee)if(ee[O].location>=0){let ie=X[O];ie===void 0&&(O==="instanceMatrix"&&y.instanceMatrix&&(ie=y.instanceMatrix),O==="instanceColor"&&y.instanceColor&&(ie=y.instanceColor));let xe={};xe.attribute=ie,ie&&ie.data&&(xe.data=ie.data),H[O]=xe,q++}r.attributes=H,r.attributesNum=q,r.index=B}function x(){let y=r.newAttributes;for(let P=0,N=y.length;P<N;P++)y[P]=0}function g(y){p(y,0)}function p(y,P){let N=r.newAttributes,B=r.enabledAttributes,H=r.attributeDivisors;N[y]=1,B[y]===0&&(i.enableVertexAttribArray(y),B[y]=1),H[y]!==P&&(i.vertexAttribDivisor(y,P),H[y]=P)}function v(){let y=r.newAttributes,P=r.enabledAttributes;for(let N=0,B=P.length;N<B;N++)P[N]!==y[N]&&(i.disableVertexAttribArray(N),P[N]=0)}function b(y,P,N,B,H,X,q){q===!0?i.vertexAttribIPointer(y,P,N,H,X):i.vertexAttribPointer(y,P,N,B,H,X)}function _(y,P,N,B){x();let H=B.attributes,X=N.getAttributes(),q=P.defaultAttributeValues;for(let ee in X){let O=X[ee];if(O.location>=0){let V=H[ee];if(V===void 0&&(ee==="instanceMatrix"&&y.instanceMatrix&&(V=y.instanceMatrix),ee==="instanceColor"&&y.instanceColor&&(V=y.instanceColor)),V!==void 0){let ie=V.normalized,xe=V.itemSize,Le=e.get(V);if(Le===void 0)continue;let it=Le.buffer,ht=Le.type,st=Le.bytesPerElement,j=ht===i.INT||ht===i.UNSIGNED_INT||V.gpuType===fl;if(V.isInterleavedBufferAttribute){let ne=V.data,be=ne.stride,He=V.offset;if(ne.isInstancedInterleavedBuffer){for(let Ue=0;Ue<O.locationSize;Ue++)p(O.location+Ue,ne.meshPerAttribute);y.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Ue=0;Ue<O.locationSize;Ue++)g(O.location+Ue);i.bindBuffer(i.ARRAY_BUFFER,it);for(let Ue=0;Ue<O.locationSize;Ue++)b(O.location+Ue,xe/O.locationSize,ht,ie,be*st,(He+xe/O.locationSize*Ue)*st,j)}else{if(V.isInstancedBufferAttribute){for(let ne=0;ne<O.locationSize;ne++)p(O.location+ne,V.meshPerAttribute);y.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let ne=0;ne<O.locationSize;ne++)g(O.location+ne);i.bindBuffer(i.ARRAY_BUFFER,it);for(let ne=0;ne<O.locationSize;ne++)b(O.location+ne,xe/O.locationSize,ht,ie,xe*st,xe/O.locationSize*ne*st,j)}}else if(q!==void 0){let ie=q[ee];if(ie!==void 0)switch(ie.length){case 2:i.vertexAttrib2fv(O.location,ie);break;case 3:i.vertexAttrib3fv(O.location,ie);break;case 4:i.vertexAttrib4fv(O.location,ie);break;default:i.vertexAttrib1fv(O.location,ie)}}}}v()}function C(){R();for(let y in n){let P=n[y];for(let N in P){let B=P[N];for(let H in B)h(B[H].object),delete B[H];delete P[N]}delete n[y]}}function S(y){if(n[y.id]===void 0)return;let P=n[y.id];for(let N in P){let B=P[N];for(let H in B)h(B[H].object),delete B[H];delete P[N]}delete n[y.id]}function A(y){for(let P in n){let N=n[P];if(N[y.id]===void 0)continue;let B=N[y.id];for(let H in B)h(B[H].object),delete B[H];delete N[y.id]}}function R(){M(),a=!0,r!==s&&(r=s,l(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:R,resetDefaultState:M,dispose:C,releaseStatesOfGeometry:S,releaseStatesOfProgram:A,initAttributes:x,enableAttribute:g,disableUnusedAttributes:v}}function zy(i,e,t){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),t.update(h,n,1)}function a(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),t.update(h,n,u))}function o(l,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let m=0;m<u;m++)f+=h[m];t.update(f,n,1)}function c(l,h,u,d){if(u===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<l.length;m++)a(l[m],h[m],d[m]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let m=0;for(let x=0;x<u;x++)m+=h[x]*d[x];t.update(m,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Hy(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let A=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==Tn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){let R=A===cr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Bn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==kn&&!R)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),C=m>0,S=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:v,maxVaryings:b,maxFragmentUniforms:_,vertexTextures:C,maxSamples:S}}function Gy(i){let e=this,t=null,n=0,s=!1,r=!1,a=new Xn,o=new Xe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let m=u.clippingPlanes,x=u.clipIntersection,g=u.clipShadows,p=i.get(u);if(!s||m===null||m.length===0||r&&!g)r?h(null):l();else{let v=r?0:n,b=v*4,_=p.clippingState||null;c.value=_,_=h(m,d,b,f);for(let C=0;C!==b;++C)_[C]=t[C];p.clippingState=_,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,m){let x=u!==null?u.length:0,g=null;if(x!==0){if(g=c.value,m!==!0||g===null){let p=f+x*4,v=d.matrixWorldInverse;o.getNormalMatrix(v),(g===null||g.length<p)&&(g=new Float32Array(p));for(let b=0,_=f;b!==x;++b,_+=4)a.copy(u[b]).applyMatrix4(v,o),a.normal.toArray(g,_),g[_+3]=a.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}function Vy(i){let e=new WeakMap;function t(a,o){return o===or?a.mapping=ns:o===ul&&(a.mapping=is),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===or||o===ul)if(e.has(a)){let c=e.get(a).texture;return t(c,a.mapping)}else{let c=a.image;if(c&&c.height>0){let l=new Lo(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",s),t(l.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var fr=4,Lf=[.125,.215,.35,.446,.526,.582],cs=20,kh=new va,Df=new Ae,zh=null,Hh=0,Gh=0,Vh=!1,ls=(1+Math.sqrt(5))/2,dr=1/ls,Uf=[new D(-ls,dr,0),new D(ls,dr,0),new D(-dr,0,ls),new D(dr,0,ls),new D(0,ls,-dr),new D(0,ls,dr),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],Wy=new D,Jl=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=Wy}=r;zh=this._renderer.getRenderTarget(),Hh=this._renderer.getActiveCubeFace(),Gh=this._renderer.getActiveMipmapLevel(),Vh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Of(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ff(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(zh,Hh,Gh),this._renderer.xr.enabled=Vh,e.scissorTest=!1,Zl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ns||e.mapping===is?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),zh=this._renderer.getRenderTarget(),Hh=this._renderer.getActiveCubeFace(),Gh=this._renderer.getActiveMipmapLevel(),Vh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Dn,minFilter:Dn,generateMipmaps:!1,type:cr,format:Tn,colorSpace:Ji,depthBuffer:!1},s=Nf(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Nf(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Xy(r)),this._blurMaterial=qy(r,e,t)}return s}_compileMaterial(e){let t=new ve(this._lodPlanes[0],e);this._renderer.compile(t,kh)}_sceneToCubeUV(e,t,n,s,r){let c=new Qt(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Df),u.toneMapping=Mi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let x=new dt({name:"PMREM.Background",side:Ht,depthWrite:!1,depthTest:!1}),g=new ve(new yt,x),p=!1,v=e.background;v?v.isColor&&(x.color.copy(v),e.background=null,p=!0):(x.color.copy(Df),p=!0);for(let b=0;b<6;b++){let _=b%3;_===0?(c.up.set(0,l[b],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[b],r.y,r.z)):_===1?(c.up.set(0,0,l[b]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[b],r.z)):(c.up.set(0,l[b],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[b]));let C=this._cubeSize;Zl(s,_*C,b>2?C:0,C,C),u.setRenderTarget(s),p&&u.render(g,c),u.render(e,c)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=f,u.autoClear=d,e.background=v}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===ns||e.mapping===is;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Of()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ff());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new ve(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;let c=this._cubeSize;Zl(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,kh)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Uf[(s-r-1)%Uf.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){let c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new ve(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*cs-1),x=r/m,g=isFinite(r)?1+Math.floor(h*x):cs;g>cs&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${cs}`);let p=[],v=0;for(let A=0;A<cs;++A){let R=A/x,M=Math.exp(-R*R/2);p.push(M),A===0?v+=M:A<g&&(v+=2*M)}for(let A=0;A<p.length;A++)p[A]=p[A]/v;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);let{_lodMax:b}=this;d.dTheta.value=m,d.mipInt.value=b-n;let _=this._sizeLods[s],C=3*_*(s>b-fr?s-b+fr:0),S=4*(this._cubeSize-_);Zl(t,C,S,3*_,2*_),c.setRenderTarget(t),c.render(u,kh)}};function Xy(i){let e=[],t=[],n=[],s=i,r=i-fr+1+Lf.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);t.push(o);let c=1/o;a>i-fr?c=Lf[a-i+fr-1]:a===0&&(c=0),n.push(c);let l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,m=6,x=3,g=2,p=1,v=new Float32Array(x*m*f),b=new Float32Array(g*m*f),_=new Float32Array(p*m*f);for(let S=0;S<f;S++){let A=S%3*2/3-1,R=S>2?0:-1,M=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];v.set(M,x*m*S),b.set(d,g*m*S);let y=[S,S,S,S,S,S];_.set(y,p*m*S)}let C=new je;C.setAttribute("position",new Ut(v,x)),C.setAttribute("uv",new Ut(b,g)),C.setAttribute("faceIndex",new Ut(_,p)),e.push(C),s>fr&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Nf(i,e,t){let n=new $n(i,e,t);return n.texture.mapping=Ma,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Zl(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function qy(i,e,t){let n=new Float32Array(cs),s=new D(0,1,0);return new Fn({name:"SphericalGaussianBlur",defines:{n:cs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Qh(),fragmentShader:`

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
		`,blending:vi,depthTest:!1,depthWrite:!1})}function Ff(){return new Fn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Qh(),fragmentShader:`

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
		`,blending:vi,depthTest:!1,depthWrite:!1})}function Of(){return new Fn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Qh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:vi,depthTest:!1,depthWrite:!1})}function Qh(){return`

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
	`}function $y(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){let c=o.mapping,l=c===or||c===ul,h=c===ns||c===is;if(l||h){let u=e.get(o),d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new Jl(i)),u=l?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{let f=o.image;return l&&f&&f.height>0||h&&f&&s(f)?(t===null&&(t=new Jl(i)),u=l?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0,l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){let c=o.target;c.removeEventListener("dispose",r);let l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Yy(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Ks("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Zy(i,e,t,n){let s={},r=new WeakMap;function a(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let m in d.attributes)e.remove(d.attributes[m]);d.removeEventListener("dispose",a),delete s[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function c(u){let d=u.attributes;for(let f in d)e.update(d[f],i.ARRAY_BUFFER)}function l(u){let d=[],f=u.index,m=u.attributes.position,x=0;if(f!==null){let v=f.array;x=f.version;for(let b=0,_=v.length;b<_;b+=3){let C=v[b+0],S=v[b+1],A=v[b+2];d.push(C,S,S,A,A,C)}}else if(m!==void 0){let v=m.array;x=m.version;for(let b=0,_=v.length/3-1;b<_;b+=3){let C=b+0,S=b+1,A=b+2;d.push(C,S,S,A,A,C)}}else return;let g=new(Dh(d)?ea:Qr)(d,1);g.version=x;let p=r.get(u);p&&e.remove(p),r.set(u,g)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function Ky(i,e,t){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,f){i.drawElements(n,f,r,d*a),t.update(f,n,1)}function l(d,f,m){m!==0&&(i.drawElementsInstanced(n,f,r,d*a,m),t.update(f,n,m))}function h(d,f,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];t.update(g,n,1)}function u(d,f,m,x){if(m===0)return;let g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)l(d[p]/a,f[p],x[p]);else{g.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,x,0,m);let p=0;for(let v=0;v<m;v++)p+=f[v]*x[v];t.update(p,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Jy(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function jy(i,e,t){let n=new WeakMap,s=new It;function r(a,o,c){let l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(o);if(d===void 0||d.count!==u){let M=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",M)};d!==void 0&&d.texture.dispose();let f=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],v=o.morphAttributes.color||[],b=0;f===!0&&(b=1),m===!0&&(b=2),x===!0&&(b=3);let _=o.attributes.position.count*b,C=1;_>e.maxTextureSize&&(C=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);let S=new Float32Array(_*C*4*u),A=new Kr(S,_,C,u);A.type=kn,A.needsUpdate=!0;let R=b*4;for(let y=0;y<u;y++){let P=g[y],N=p[y],B=v[y],H=_*C*4*y;for(let X=0;X<P.count;X++){let q=X*R;f===!0&&(s.fromBufferAttribute(P,X),S[H+q+0]=s.x,S[H+q+1]=s.y,S[H+q+2]=s.z,S[H+q+3]=0),m===!0&&(s.fromBufferAttribute(N,X),S[H+q+4]=s.x,S[H+q+5]=s.y,S[H+q+6]=s.z,S[H+q+7]=0),x===!0&&(s.fromBufferAttribute(B,X),S[H+q+8]=s.x,S[H+q+9]=s.y,S[H+q+10]=s.z,S[H+q+11]=B.itemSize===4?s.w:1)}}d={count:u,texture:A,size:new de(_,C)},n.set(o,d),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let f=0;for(let x=0;x<l.length;x++)f+=l[x];let m=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",m),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Qy(i,e,t,n){let s=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,u=e.get(c,h);if(s.get(u)!==l&&(e.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function a(){s=new WeakMap}function o(c){let l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:a}}var np=new an,Bf=new aa(1,1),ip=new Kr,sp=new Io,rp=new na,kf=[],zf=[],Hf=new Float32Array(16),Gf=new Float32Array(9),Vf=new Float32Array(4);function mr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=kf[s];if(r===void 0&&(r=new Float32Array(s),kf[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Gt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Vt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Ql(i,e){let t=zf[e];t===void 0&&(t=new Int32Array(e),zf[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function e_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function t_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Gt(t,e))return;i.uniform2fv(this.addr,e),Vt(t,e)}}function n_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Gt(t,e))return;i.uniform3fv(this.addr,e),Vt(t,e)}}function i_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Gt(t,e))return;i.uniform4fv(this.addr,e),Vt(t,e)}}function s_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Gt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Vt(t,e)}else{if(Gt(t,n))return;Vf.set(n),i.uniformMatrix2fv(this.addr,!1,Vf),Vt(t,n)}}function r_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Gt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Vt(t,e)}else{if(Gt(t,n))return;Gf.set(n),i.uniformMatrix3fv(this.addr,!1,Gf),Vt(t,n)}}function a_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Gt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Vt(t,e)}else{if(Gt(t,n))return;Hf.set(n),i.uniformMatrix4fv(this.addr,!1,Hf),Vt(t,n)}}function o_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function l_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Gt(t,e))return;i.uniform2iv(this.addr,e),Vt(t,e)}}function c_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Gt(t,e))return;i.uniform3iv(this.addr,e),Vt(t,e)}}function h_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Gt(t,e))return;i.uniform4iv(this.addr,e),Vt(t,e)}}function u_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function d_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Gt(t,e))return;i.uniform2uiv(this.addr,e),Vt(t,e)}}function f_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Gt(t,e))return;i.uniform3uiv(this.addr,e),Vt(t,e)}}function p_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Gt(t,e))return;i.uniform4uiv(this.addr,e),Vt(t,e)}}function m_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Bf.compareFunction=Ih,r=Bf):r=np,t.setTexture2D(e||r,s)}function g_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||sp,s)}function x_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||rp,s)}function y_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||ip,s)}function __(i){switch(i){case 5126:return e_;case 35664:return t_;case 35665:return n_;case 35666:return i_;case 35674:return s_;case 35675:return r_;case 35676:return a_;case 5124:case 35670:return o_;case 35667:case 35671:return l_;case 35668:case 35672:return c_;case 35669:case 35673:return h_;case 5125:return u_;case 36294:return d_;case 36295:return f_;case 36296:return p_;case 35678:case 36198:case 36298:case 36306:case 35682:return m_;case 35679:case 36299:case 36307:return g_;case 35680:case 36300:case 36308:case 36293:return x_;case 36289:case 36303:case 36311:case 36292:return y_}}function v_(i,e){i.uniform1fv(this.addr,e)}function M_(i,e){let t=mr(e,this.size,2);i.uniform2fv(this.addr,t)}function b_(i,e){let t=mr(e,this.size,3);i.uniform3fv(this.addr,t)}function S_(i,e){let t=mr(e,this.size,4);i.uniform4fv(this.addr,t)}function E_(i,e){let t=mr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function w_(i,e){let t=mr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function T_(i,e){let t=mr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function A_(i,e){i.uniform1iv(this.addr,e)}function R_(i,e){i.uniform2iv(this.addr,e)}function C_(i,e){i.uniform3iv(this.addr,e)}function I_(i,e){i.uniform4iv(this.addr,e)}function P_(i,e){i.uniform1uiv(this.addr,e)}function L_(i,e){i.uniform2uiv(this.addr,e)}function D_(i,e){i.uniform3uiv(this.addr,e)}function U_(i,e){i.uniform4uiv(this.addr,e)}function N_(i,e,t){let n=this.cache,s=e.length,r=Ql(t,s);Gt(n,r)||(i.uniform1iv(this.addr,r),Vt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||np,r[a])}function F_(i,e,t){let n=this.cache,s=e.length,r=Ql(t,s);Gt(n,r)||(i.uniform1iv(this.addr,r),Vt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||sp,r[a])}function O_(i,e,t){let n=this.cache,s=e.length,r=Ql(t,s);Gt(n,r)||(i.uniform1iv(this.addr,r),Vt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||rp,r[a])}function B_(i,e,t){let n=this.cache,s=e.length,r=Ql(t,s);Gt(n,r)||(i.uniform1iv(this.addr,r),Vt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||ip,r[a])}function k_(i){switch(i){case 5126:return v_;case 35664:return M_;case 35665:return b_;case 35666:return S_;case 35674:return E_;case 35675:return w_;case 35676:return T_;case 5124:case 35670:return A_;case 35667:case 35671:return R_;case 35668:case 35672:return C_;case 35669:case 35673:return I_;case 5125:return P_;case 36294:return L_;case 36295:return D_;case 36296:return U_;case 35678:case 36198:case 36298:case 36306:case 35682:return N_;case 35679:case 36299:case 36307:return F_;case 35680:case 36300:case 36308:case 36293:return O_;case 36289:case 36303:case 36311:case 36292:return B_}}var Xh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=__(t.type)}},qh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=k_(t.type)}},$h=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},Wh=/(\w+)(\])?(\[|\.)?/g;function Wf(i,e){i.seq.push(e),i.map[e.id]=e}function z_(i,e,t){let n=i.name,s=n.length;for(Wh.lastIndex=0;;){let r=Wh.exec(n),a=Wh.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){Wf(t,l===void 0?new Xh(o,i,e):new qh(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new $h(o),Wf(t,u)),t=u}}}var pr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);z_(r,a,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function Xf(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var H_=37297,G_=0;function V_(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var qf=new Xe;function W_(i){tt._getMatrix(qf,tt.workingColorSpace,i);let e=`mat3( ${qf.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(i)){case $r:return[e,"LinearTransferOETF"];case lt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function $f(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+V_(i.getShaderSource(e),o)}else return r}function X_(i,e){let t=W_(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function q_(i,e){let t;switch(e){case rf:t="Linear";break;case af:t="Reinhard";break;case of:t="Cineon";break;case hl:t="ACESFilmic";break;case cf:t="AgX";break;case hf:t="Neutral";break;case lf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Kl=new D;function $_(){tt.getLuminanceCoefficients(Kl);let i=Kl.x.toFixed(4),e=Kl.y.toFixed(4),t=Kl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Y_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Aa).join(`
`)}function Z_(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function K_(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Aa(i){return i!==""}function Yf(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Zf(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var J_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Yh(i){return i.replace(J_,Q_)}var j_=new Map;function Q_(i,e){let t=Ze[e];if(t===void 0){let n=j_.get(e);if(n!==void 0)t=Ze[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Yh(t)}var ev=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Kf(i){return i.replace(ev,tv)}function tv(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Jf(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function nv(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===xh?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===nl?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===jn&&(e="SHADOWMAP_TYPE_VSM"),e}function iv(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ns:case is:e="ENVMAP_TYPE_CUBE";break;case Ma:e="ENVMAP_TYPE_CUBE_UV";break}return e}function sv(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case is:e="ENVMAP_MODE_REFRACTION";break}return e}function rv(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case vh:e="ENVMAP_BLENDING_MULTIPLY";break;case nf:e="ENVMAP_BLENDING_MIX";break;case sf:e="ENVMAP_BLENDING_ADD";break}return e}function av(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function ov(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,c=nv(t),l=iv(t),h=sv(t),u=rv(t),d=av(t),f=Y_(t),m=Z_(r),x=s.createProgram(),g,p,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Aa).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Aa).join(`
`),p.length>0&&(p+=`
`)):(g=[Jf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Aa).join(`
`),p=[Jf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Mi?"#define TONE_MAPPING":"",t.toneMapping!==Mi?Ze.tonemapping_pars_fragment:"",t.toneMapping!==Mi?q_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ze.colorspace_pars_fragment,X_("linearToOutputTexel",t.outputColorSpace),$_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Aa).join(`
`)),a=Yh(a),a=Yf(a,t),a=Zf(a,t),o=Yh(o),o=Yf(o,t),o=Zf(o,t),a=Kf(a),o=Kf(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===Ph?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ph?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let b=v+g+a,_=v+p+o,C=Xf(s,s.VERTEX_SHADER,b),S=Xf(s,s.FRAGMENT_SHADER,_);s.attachShader(x,C),s.attachShader(x,S),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function A(P){if(i.debug.checkShaderErrors){let N=s.getProgramInfoLog(x)||"",B=s.getShaderInfoLog(C)||"",H=s.getShaderInfoLog(S)||"",X=N.trim(),q=B.trim(),ee=H.trim(),O=!0,V=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(O=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,C,S);else{let ie=$f(s,C,"vertex"),xe=$f(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+X+`
`+ie+`
`+xe)}else X!==""?console.warn("THREE.WebGLProgram: Program Info Log:",X):(q===""||ee==="")&&(V=!1);V&&(P.diagnostics={runnable:O,programLog:X,vertexShader:{log:q,prefix:g},fragmentShader:{log:ee,prefix:p}})}s.deleteShader(C),s.deleteShader(S),R=new pr(s,x),M=K_(s,x)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let M;this.getAttributes=function(){return M===void 0&&A(this),M};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(x,H_)),y},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=G_++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=C,this.fragmentShader=S,this}var lv=0,Zh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Kh(e),t.set(e,n)),n}},Kh=class{constructor(e){this.id=lv++,this.code=e,this.usedTimes=0}};function cv(i,e,t,n,s,r,a){let o=new jr,c=new Zh,l=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures,f=s.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(M){return l.add(M),M===0?"uv":`uv${M}`}function g(M,y,P,N,B){let H=N.fog,X=B.geometry,q=M.isMeshStandardMaterial?N.environment:null,ee=(M.isMeshStandardMaterial?t:e).get(M.envMap||q),O=ee&&ee.mapping===Ma?ee.image.height:null,V=m[M.type];M.precision!==null&&(f=s.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));let ie=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,xe=ie!==void 0?ie.length:0,Le=0;X.morphAttributes.position!==void 0&&(Le=1),X.morphAttributes.normal!==void 0&&(Le=2),X.morphAttributes.color!==void 0&&(Le=3);let it,ht,st,j;if(V){let at=Qn[V];it=at.vertexShader,ht=at.fragmentShader}else it=M.vertexShader,ht=M.fragmentShader,c.update(M),st=c.getVertexShaderID(M),j=c.getFragmentShaderID(M);let ne=i.getRenderTarget(),be=i.state.buffers.depth.getReversed(),He=B.isInstancedMesh===!0,Ue=B.isBatchedMesh===!0,et=!!M.map,Kt=!!M.matcap,U=!!ee,Et=!!M.aoMap,We=!!M.lightMap,ke=!!M.bumpMap,we=!!M.normalMap,wt=!!M.displacementMap,Te=!!M.emissiveMap,Ye=!!M.metalnessMap,Xt=!!M.roughnessMap,Dt=M.anisotropy>0,L=M.clearcoat>0,E=M.dispersion>0,G=M.iridescence>0,K=M.sheen>0,te=M.transmission>0,Y=Dt&&!!M.anisotropyMap,De=L&&!!M.clearcoatMap,ce=L&&!!M.clearcoatNormalMap,Re=L&&!!M.clearcoatRoughnessMap,Ce=G&&!!M.iridescenceMap,ae=G&&!!M.iridescenceThicknessMap,ge=K&&!!M.sheenColorMap,Be=K&&!!M.sheenRoughnessMap,Ie=!!M.specularMap,pe=!!M.specularColorMap,qe=!!M.specularIntensityMap,F=te&&!!M.transmissionMap,oe=te&&!!M.thicknessMap,ue=!!M.gradientMap,_e=!!M.alphaMap,se=M.alphaTest>0,Q=!!M.alphaHash,Ee=!!M.extensions,Ve=Mi;M.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(Ve=i.toneMapping);let gt={shaderID:V,shaderType:M.type,shaderName:M.name,vertexShader:it,fragmentShader:ht,defines:M.defines,customVertexShaderID:st,customFragmentShaderID:j,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:Ue,batchingColor:Ue&&B._colorsTexture!==null,instancing:He,instancingColor:He&&B.instanceColor!==null,instancingMorph:He&&B.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ne===null?i.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:Ji,alphaToCoverage:!!M.alphaToCoverage,map:et,matcap:Kt,envMap:U,envMapMode:U&&ee.mapping,envMapCubeUVHeight:O,aoMap:Et,lightMap:We,bumpMap:ke,normalMap:we,displacementMap:d&&wt,emissiveMap:Te,normalMapObjectSpace:we&&M.normalMapType===pf,normalMapTangentSpace:we&&M.normalMapType===Ch,metalnessMap:Ye,roughnessMap:Xt,anisotropy:Dt,anisotropyMap:Y,clearcoat:L,clearcoatMap:De,clearcoatNormalMap:ce,clearcoatRoughnessMap:Re,dispersion:E,iridescence:G,iridescenceMap:Ce,iridescenceThicknessMap:ae,sheen:K,sheenColorMap:ge,sheenRoughnessMap:Be,specularMap:Ie,specularColorMap:pe,specularIntensityMap:qe,transmission:te,transmissionMap:F,thicknessMap:oe,gradientMap:ue,opaque:M.transparent===!1&&M.blending===Zi&&M.alphaToCoverage===!1,alphaMap:_e,alphaTest:se,alphaHash:Q,combine:M.combine,mapUv:et&&x(M.map.channel),aoMapUv:Et&&x(M.aoMap.channel),lightMapUv:We&&x(M.lightMap.channel),bumpMapUv:ke&&x(M.bumpMap.channel),normalMapUv:we&&x(M.normalMap.channel),displacementMapUv:wt&&x(M.displacementMap.channel),emissiveMapUv:Te&&x(M.emissiveMap.channel),metalnessMapUv:Ye&&x(M.metalnessMap.channel),roughnessMapUv:Xt&&x(M.roughnessMap.channel),anisotropyMapUv:Y&&x(M.anisotropyMap.channel),clearcoatMapUv:De&&x(M.clearcoatMap.channel),clearcoatNormalMapUv:ce&&x(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Re&&x(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&x(M.iridescenceMap.channel),iridescenceThicknessMapUv:ae&&x(M.iridescenceThicknessMap.channel),sheenColorMapUv:ge&&x(M.sheenColorMap.channel),sheenRoughnessMapUv:Be&&x(M.sheenRoughnessMap.channel),specularMapUv:Ie&&x(M.specularMap.channel),specularColorMapUv:pe&&x(M.specularColorMap.channel),specularIntensityMapUv:qe&&x(M.specularIntensityMap.channel),transmissionMapUv:F&&x(M.transmissionMap.channel),thicknessMapUv:oe&&x(M.thicknessMap.channel),alphaMapUv:_e&&x(M.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(we||Dt),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!X.attributes.uv&&(et||_e),fog:!!H,useFog:M.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:be,skinning:B.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:xe,morphTextureStride:Le,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ve,decodeVideoTexture:et&&M.map.isVideoTexture===!0&&tt.getTransfer(M.map.colorSpace)===lt,decodeVideoTextureEmissive:Te&&M.emissiveMap.isVideoTexture===!0&&tt.getTransfer(M.emissiveMap.colorSpace)===lt,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===en,flipSided:M.side===Ht,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Ee&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ee&&M.extensions.multiDraw===!0||Ue)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return gt.vertexUv1s=l.has(1),gt.vertexUv2s=l.has(2),gt.vertexUv3s=l.has(3),l.clear(),gt}function p(M){let y=[];if(M.shaderID?y.push(M.shaderID):(y.push(M.customVertexShaderID),y.push(M.customFragmentShaderID)),M.defines!==void 0)for(let P in M.defines)y.push(P),y.push(M.defines[P]);return M.isRawShaderMaterial===!1&&(v(y,M),b(y,M),y.push(i.outputColorSpace)),y.push(M.customProgramCacheKey),y.join()}function v(M,y){M.push(y.precision),M.push(y.outputColorSpace),M.push(y.envMapMode),M.push(y.envMapCubeUVHeight),M.push(y.mapUv),M.push(y.alphaMapUv),M.push(y.lightMapUv),M.push(y.aoMapUv),M.push(y.bumpMapUv),M.push(y.normalMapUv),M.push(y.displacementMapUv),M.push(y.emissiveMapUv),M.push(y.metalnessMapUv),M.push(y.roughnessMapUv),M.push(y.anisotropyMapUv),M.push(y.clearcoatMapUv),M.push(y.clearcoatNormalMapUv),M.push(y.clearcoatRoughnessMapUv),M.push(y.iridescenceMapUv),M.push(y.iridescenceThicknessMapUv),M.push(y.sheenColorMapUv),M.push(y.sheenRoughnessMapUv),M.push(y.specularMapUv),M.push(y.specularColorMapUv),M.push(y.specularIntensityMapUv),M.push(y.transmissionMapUv),M.push(y.thicknessMapUv),M.push(y.combine),M.push(y.fogExp2),M.push(y.sizeAttenuation),M.push(y.morphTargetsCount),M.push(y.morphAttributeCount),M.push(y.numDirLights),M.push(y.numPointLights),M.push(y.numSpotLights),M.push(y.numSpotLightMaps),M.push(y.numHemiLights),M.push(y.numRectAreaLights),M.push(y.numDirLightShadows),M.push(y.numPointLightShadows),M.push(y.numSpotLightShadows),M.push(y.numSpotLightShadowsWithMaps),M.push(y.numLightProbes),M.push(y.shadowMapType),M.push(y.toneMapping),M.push(y.numClippingPlanes),M.push(y.numClipIntersection),M.push(y.depthPacking)}function b(M,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),y.gradientMap&&o.enable(22),M.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reversedDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),M.push(o.mask)}function _(M){let y=m[M.type],P;if(y){let N=Qn[y];P=wf.clone(N.uniforms)}else P=M.uniforms;return P}function C(M,y){let P;for(let N=0,B=h.length;N<B;N++){let H=h[N];if(H.cacheKey===y){P=H,++P.usedTimes;break}}return P===void 0&&(P=new ov(i,y,M,r),h.push(P)),P}function S(M){if(--M.usedTimes===0){let y=h.indexOf(M);h[y]=h[h.length-1],h.pop(),M.destroy()}}function A(M){c.remove(M)}function R(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:_,acquireProgram:C,releaseProgram:S,releaseShaderCache:A,programs:h,dispose:R}}function hv(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function uv(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function jf(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Qf(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u,d,f,m,x,g){let p=i[e];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:m,renderOrder:u.renderOrder,z:x,group:g},i[e]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=x,p.group=g),e++,p}function o(u,d,f,m,x,g){let p=a(u,d,f,m,x,g);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):t.push(p)}function c(u,d,f,m,x,g){let p=a(u,d,f,m,x,g);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):t.unshift(p)}function l(u,d){t.length>1&&t.sort(u||uv),n.length>1&&n.sort(d||jf),s.length>1&&s.sort(d||jf)}function h(){for(let u=e,d=i.length;u<d;u++){let f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:h,sort:l}}function dv(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new Qf,i.set(n,[a])):s>=r.length?(a=new Qf,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function fv(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new Ae};break;case"SpotLight":t={position:new D,direction:new D,color:new Ae,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Ae,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Ae,groundColor:new Ae};break;case"RectAreaLight":t={color:new Ae,position:new D,halfWidth:new D,halfHeight:new D};break}return i[e.id]=t,t}}}function pv(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var mv=0;function gv(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function xv(i){let e=new fv,t=pv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new D);let s=new D,r=new ct,a=new ct;function o(l){let h=0,u=0,d=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let f=0,m=0,x=0,g=0,p=0,v=0,b=0,_=0,C=0,S=0,A=0;l.sort(gv);for(let M=0,y=l.length;M<y;M++){let P=l[M],N=P.color,B=P.intensity,H=P.distance,X=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=N.r*B,u+=N.g*B,d+=N.b*B;else if(P.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(P.sh.coefficients[q],B);A++}else if(P.isDirectionalLight){let q=e.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let ee=P.shadow,O=t.get(P);O.shadowIntensity=ee.intensity,O.shadowBias=ee.bias,O.shadowNormalBias=ee.normalBias,O.shadowRadius=ee.radius,O.shadowMapSize=ee.mapSize,n.directionalShadow[f]=O,n.directionalShadowMap[f]=X,n.directionalShadowMatrix[f]=P.shadow.matrix,v++}n.directional[f]=q,f++}else if(P.isSpotLight){let q=e.get(P);q.position.setFromMatrixPosition(P.matrixWorld),q.color.copy(N).multiplyScalar(B),q.distance=H,q.coneCos=Math.cos(P.angle),q.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),q.decay=P.decay,n.spot[x]=q;let ee=P.shadow;if(P.map&&(n.spotLightMap[C]=P.map,C++,ee.updateMatrices(P),P.castShadow&&S++),n.spotLightMatrix[x]=ee.matrix,P.castShadow){let O=t.get(P);O.shadowIntensity=ee.intensity,O.shadowBias=ee.bias,O.shadowNormalBias=ee.normalBias,O.shadowRadius=ee.radius,O.shadowMapSize=ee.mapSize,n.spotShadow[x]=O,n.spotShadowMap[x]=X,_++}x++}else if(P.isRectAreaLight){let q=e.get(P);q.color.copy(N).multiplyScalar(B),q.halfWidth.set(P.width*.5,0,0),q.halfHeight.set(0,P.height*.5,0),n.rectArea[g]=q,g++}else if(P.isPointLight){let q=e.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),q.distance=P.distance,q.decay=P.decay,P.castShadow){let ee=P.shadow,O=t.get(P);O.shadowIntensity=ee.intensity,O.shadowBias=ee.bias,O.shadowNormalBias=ee.normalBias,O.shadowRadius=ee.radius,O.shadowMapSize=ee.mapSize,O.shadowCameraNear=ee.camera.near,O.shadowCameraFar=ee.camera.far,n.pointShadow[m]=O,n.pointShadowMap[m]=X,n.pointShadowMatrix[m]=P.shadow.matrix,b++}n.point[m]=q,m++}else if(P.isHemisphereLight){let q=e.get(P);q.skyColor.copy(P.color).multiplyScalar(B),q.groundColor.copy(P.groundColor).multiplyScalar(B),n.hemi[p]=q,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=fe.LTC_FLOAT_1,n.rectAreaLTC2=fe.LTC_FLOAT_2):(n.rectAreaLTC1=fe.LTC_HALF_1,n.rectAreaLTC2=fe.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let R=n.hash;(R.directionalLength!==f||R.pointLength!==m||R.spotLength!==x||R.rectAreaLength!==g||R.hemiLength!==p||R.numDirectionalShadows!==v||R.numPointShadows!==b||R.numSpotShadows!==_||R.numSpotMaps!==C||R.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=_+C-S,n.spotLightMap.length=C,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=A,R.directionalLength=f,R.pointLength=m,R.spotLength=x,R.rectAreaLength=g,R.hemiLength=p,R.numDirectionalShadows=v,R.numPointShadows=b,R.numSpotShadows=_,R.numSpotMaps=C,R.numLightProbes=A,n.version=mv++)}function c(l,h){let u=0,d=0,f=0,m=0,x=0,g=h.matrixWorldInverse;for(let p=0,v=l.length;p<v;p++){let b=l[p];if(b.isDirectionalLight){let _=n.directional[u];_.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),u++}else if(b.isSpotLight){let _=n.spot[f];_.position.setFromMatrixPosition(b.matrixWorld),_.position.applyMatrix4(g),_.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),f++}else if(b.isRectAreaLight){let _=n.rectArea[m];_.position.setFromMatrixPosition(b.matrixWorld),_.position.applyMatrix4(g),a.identity(),r.copy(b.matrixWorld),r.premultiply(g),a.extractRotation(r),_.halfWidth.set(b.width*.5,0,0),_.halfHeight.set(0,b.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),m++}else if(b.isPointLight){let _=n.point[d];_.position.setFromMatrixPosition(b.matrixWorld),_.position.applyMatrix4(g),d++}else if(b.isHemisphereLight){let _=n.hemi[x];_.direction.setFromMatrixPosition(b.matrixWorld),_.direction.transformDirection(g),x++}}}return{setup:o,setupView:c,state:n}}function ep(i){let e=new xv(i),t=[],n=[];function s(h){l.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function c(h){e.setupView(t,h)}let l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function yv(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new ep(i),e.set(s,[o])):r>=a.length?(o=new ep(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var _v=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,vv=`uniform sampler2D shadow_pass;
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
}`;function Mv(i,e,t){let n=new tr,s=new de,r=new de,a=new It,o=new Wo({depthPacking:ff}),c=new Xo,l={},h=t.maxTextureSize,u={[di]:Ht,[Ht]:di,[en]:en},d=new Fn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new de},radius:{value:4}},vertexShader:_v,fragmentShader:vv}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new je;m.setAttribute("position",new Ut(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new ve(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=xh;let p=this.type;this.render=function(S,A,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;let M=i.getRenderTarget(),y=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),N=i.state;N.setBlending(vi),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);let B=p!==jn&&this.type===jn,H=p===jn&&this.type!==jn;for(let X=0,q=S.length;X<q;X++){let ee=S[X],O=ee.shadow;if(O===void 0){console.warn("THREE.WebGLShadowMap:",ee,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;s.copy(O.mapSize);let V=O.getFrameExtents();if(s.multiply(V),r.copy(O.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/V.x),s.x=r.x*V.x,O.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/V.y),s.y=r.y*V.y,O.mapSize.y=r.y)),O.map===null||B===!0||H===!0){let xe=this.type!==jn?{minFilter:cn,magFilter:cn}:{};O.map!==null&&O.map.dispose(),O.map=new $n(s.x,s.y,xe),O.map.texture.name=ee.name+".shadowMap",O.camera.updateProjectionMatrix()}i.setRenderTarget(O.map),i.clear();let ie=O.getViewportCount();for(let xe=0;xe<ie;xe++){let Le=O.getViewport(xe);a.set(r.x*Le.x,r.y*Le.y,r.x*Le.z,r.y*Le.w),N.viewport(a),O.updateMatrices(ee,xe),n=O.getFrustum(),_(A,R,O.camera,ee,this.type)}O.isPointLightShadow!==!0&&this.type===jn&&v(O,R),O.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(M,y,P)};function v(S,A){let R=e.update(x);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new $n(s.x,s.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(A,null,R,d,x,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(A,null,R,f,x,null)}function b(S,A,R,M){let y=null,P=R.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(P!==void 0)y=P;else if(y=R.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let N=y.uuid,B=A.uuid,H=l[N];H===void 0&&(H={},l[N]=H);let X=H[B];X===void 0&&(X=y.clone(),H[B]=X,A.addEventListener("dispose",C)),y=X}if(y.visible=A.visible,y.wireframe=A.wireframe,M===jn?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:u[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,R.isPointLight===!0&&y.isMeshDistanceMaterial===!0){let N=i.properties.get(y);N.light=R}return y}function _(S,A,R,M,y){if(S.visible===!1)return;if(S.layers.test(A.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&y===jn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,S.matrixWorld);let B=e.update(S),H=S.material;if(Array.isArray(H)){let X=B.groups;for(let q=0,ee=X.length;q<ee;q++){let O=X[q],V=H[O.materialIndex];if(V&&V.visible){let ie=b(S,V,M,y);S.onBeforeShadow(i,S,A,R,B,ie,O),i.renderBufferDirect(R,null,B,ie,S,O),S.onAfterShadow(i,S,A,R,B,ie,O)}}}else if(H.visible){let X=b(S,H,M,y);S.onBeforeShadow(i,S,A,R,B,X,null),i.renderBufferDirect(R,null,B,X,S,null),S.onAfterShadow(i,S,A,R,B,X,null)}}let N=S.children;for(let B=0,H=N.length;B<H;B++)_(N[B],A,R,M,y)}function C(S){S.target.removeEventListener("dispose",C);for(let R in l){let M=l[R],y=S.target.uuid;y in M&&(M[y].dispose(),delete M[y])}}}var bv={[il]:sl,[rl]:ll,[al]:cl,[Ki]:ol,[sl]:il,[ll]:rl,[cl]:al,[ol]:Ki};function Sv(i,e){function t(){let F=!1,oe=new It,ue=null,_e=new It(0,0,0,0);return{setMask:function(se){ue!==se&&!F&&(i.colorMask(se,se,se,se),ue=se)},setLocked:function(se){F=se},setClear:function(se,Q,Ee,Ve,gt){gt===!0&&(se*=Ve,Q*=Ve,Ee*=Ve),oe.set(se,Q,Ee,Ve),_e.equals(oe)===!1&&(i.clearColor(se,Q,Ee,Ve),_e.copy(oe))},reset:function(){F=!1,ue=null,_e.set(-1,0,0,0)}}}function n(){let F=!1,oe=!1,ue=null,_e=null,se=null;return{setReversed:function(Q){if(oe!==Q){let Ee=e.get("EXT_clip_control");Q?Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.ZERO_TO_ONE_EXT):Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.NEGATIVE_ONE_TO_ONE_EXT),oe=Q;let Ve=se;se=null,this.setClear(Ve)}},getReversed:function(){return oe},setTest:function(Q){Q?ne(i.DEPTH_TEST):be(i.DEPTH_TEST)},setMask:function(Q){ue!==Q&&!F&&(i.depthMask(Q),ue=Q)},setFunc:function(Q){if(oe&&(Q=bv[Q]),_e!==Q){switch(Q){case il:i.depthFunc(i.NEVER);break;case sl:i.depthFunc(i.ALWAYS);break;case rl:i.depthFunc(i.LESS);break;case Ki:i.depthFunc(i.LEQUAL);break;case al:i.depthFunc(i.EQUAL);break;case ol:i.depthFunc(i.GEQUAL);break;case ll:i.depthFunc(i.GREATER);break;case cl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}_e=Q}},setLocked:function(Q){F=Q},setClear:function(Q){se!==Q&&(oe&&(Q=1-Q),i.clearDepth(Q),se=Q)},reset:function(){F=!1,ue=null,_e=null,se=null,oe=!1}}}function s(){let F=!1,oe=null,ue=null,_e=null,se=null,Q=null,Ee=null,Ve=null,gt=null;return{setTest:function(at){F||(at?ne(i.STENCIL_TEST):be(i.STENCIL_TEST))},setMask:function(at){oe!==at&&!F&&(i.stencilMask(at),oe=at)},setFunc:function(at,si,Wn){(ue!==at||_e!==si||se!==Wn)&&(i.stencilFunc(at,si,Wn),ue=at,_e=si,se=Wn)},setOp:function(at,si,Wn){(Q!==at||Ee!==si||Ve!==Wn)&&(i.stencilOp(at,si,Wn),Q=at,Ee=si,Ve=Wn)},setLocked:function(at){F=at},setClear:function(at){gt!==at&&(i.clearStencil(at),gt=at)},reset:function(){F=!1,oe=null,ue=null,_e=null,se=null,Q=null,Ee=null,Ve=null,gt=null}}}let r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap,h={},u={},d=new WeakMap,f=[],m=null,x=!1,g=null,p=null,v=null,b=null,_=null,C=null,S=null,A=new Ae(0,0,0),R=0,M=!1,y=null,P=null,N=null,B=null,H=null,X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),q=!1,ee=0,O=i.getParameter(i.VERSION);O.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(O)[1]),q=ee>=1):O.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),q=ee>=2);let V=null,ie={},xe=i.getParameter(i.SCISSOR_BOX),Le=i.getParameter(i.VIEWPORT),it=new It().fromArray(xe),ht=new It().fromArray(Le);function st(F,oe,ue,_e){let se=new Uint8Array(4),Q=i.createTexture();i.bindTexture(F,Q),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ee=0;Ee<ue;Ee++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(oe,0,i.RGBA,1,1,_e,0,i.RGBA,i.UNSIGNED_BYTE,se):i.texImage2D(oe+Ee,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,se);return Q}let j={};j[i.TEXTURE_2D]=st(i.TEXTURE_2D,i.TEXTURE_2D,1),j[i.TEXTURE_CUBE_MAP]=st(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),j[i.TEXTURE_2D_ARRAY]=st(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),j[i.TEXTURE_3D]=st(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ne(i.DEPTH_TEST),a.setFunc(Ki),ke(!1),we(gh),ne(i.CULL_FACE),Et(vi);function ne(F){h[F]!==!0&&(i.enable(F),h[F]=!0)}function be(F){h[F]!==!1&&(i.disable(F),h[F]=!1)}function He(F,oe){return u[F]!==oe?(i.bindFramebuffer(F,oe),u[F]=oe,F===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=oe),F===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=oe),!0):!1}function Ue(F,oe){let ue=f,_e=!1;if(F){ue=d.get(oe),ue===void 0&&(ue=[],d.set(oe,ue));let se=F.textures;if(ue.length!==se.length||ue[0]!==i.COLOR_ATTACHMENT0){for(let Q=0,Ee=se.length;Q<Ee;Q++)ue[Q]=i.COLOR_ATTACHMENT0+Q;ue.length=se.length,_e=!0}}else ue[0]!==i.BACK&&(ue[0]=i.BACK,_e=!0);_e&&i.drawBuffers(ue)}function et(F){return m!==F?(i.useProgram(F),m=F,!0):!1}let Kt={[Ii]:i.FUNC_ADD,[kd]:i.FUNC_SUBTRACT,[zd]:i.FUNC_REVERSE_SUBTRACT};Kt[Hd]=i.MIN,Kt[Gd]=i.MAX;let U={[Vd]:i.ZERO,[Wd]:i.ONE,[Xd]:i.SRC_COLOR,[So]:i.SRC_ALPHA,[Jd]:i.SRC_ALPHA_SATURATE,[Zd]:i.DST_COLOR,[$d]:i.DST_ALPHA,[qd]:i.ONE_MINUS_SRC_COLOR,[Eo]:i.ONE_MINUS_SRC_ALPHA,[Kd]:i.ONE_MINUS_DST_COLOR,[Yd]:i.ONE_MINUS_DST_ALPHA,[jd]:i.CONSTANT_COLOR,[Qd]:i.ONE_MINUS_CONSTANT_COLOR,[ef]:i.CONSTANT_ALPHA,[tf]:i.ONE_MINUS_CONSTANT_ALPHA};function Et(F,oe,ue,_e,se,Q,Ee,Ve,gt,at){if(F===vi){x===!0&&(be(i.BLEND),x=!1);return}if(x===!1&&(ne(i.BLEND),x=!0),F!==Bd){if(F!==g||at!==M){if((p!==Ii||_!==Ii)&&(i.blendEquation(i.FUNC_ADD),p=Ii,_=Ii),at)switch(F){case Zi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case _n:i.blendFunc(i.ONE,i.ONE);break;case yh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case _h:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Zi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case _n:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case yh:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case _h:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}v=null,b=null,C=null,S=null,A.set(0,0,0),R=0,g=F,M=at}return}se=se||oe,Q=Q||ue,Ee=Ee||_e,(oe!==p||se!==_)&&(i.blendEquationSeparate(Kt[oe],Kt[se]),p=oe,_=se),(ue!==v||_e!==b||Q!==C||Ee!==S)&&(i.blendFuncSeparate(U[ue],U[_e],U[Q],U[Ee]),v=ue,b=_e,C=Q,S=Ee),(Ve.equals(A)===!1||gt!==R)&&(i.blendColor(Ve.r,Ve.g,Ve.b,gt),A.copy(Ve),R=gt),g=F,M=!1}function We(F,oe){F.side===en?be(i.CULL_FACE):ne(i.CULL_FACE);let ue=F.side===Ht;oe&&(ue=!ue),ke(ue),F.blending===Zi&&F.transparent===!1?Et(vi):Et(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);let _e=F.stencilWrite;o.setTest(_e),_e&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Te(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?ne(i.SAMPLE_ALPHA_TO_COVERAGE):be(i.SAMPLE_ALPHA_TO_COVERAGE)}function ke(F){y!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),y=F)}function we(F){F!==Fd?(ne(i.CULL_FACE),F!==P&&(F===gh?i.cullFace(i.BACK):F===Od?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):be(i.CULL_FACE),P=F}function wt(F){F!==N&&(q&&i.lineWidth(F),N=F)}function Te(F,oe,ue){F?(ne(i.POLYGON_OFFSET_FILL),(B!==oe||H!==ue)&&(i.polygonOffset(oe,ue),B=oe,H=ue)):be(i.POLYGON_OFFSET_FILL)}function Ye(F){F?ne(i.SCISSOR_TEST):be(i.SCISSOR_TEST)}function Xt(F){F===void 0&&(F=i.TEXTURE0+X-1),V!==F&&(i.activeTexture(F),V=F)}function Dt(F,oe,ue){ue===void 0&&(V===null?ue=i.TEXTURE0+X-1:ue=V);let _e=ie[ue];_e===void 0&&(_e={type:void 0,texture:void 0},ie[ue]=_e),(_e.type!==F||_e.texture!==oe)&&(V!==ue&&(i.activeTexture(ue),V=ue),i.bindTexture(F,oe||j[F]),_e.type=F,_e.texture=oe)}function L(){let F=ie[V];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function E(){try{i.compressedTexImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function G(){try{i.compressedTexImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function K(){try{i.texSubImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function te(){try{i.texSubImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Y(){try{i.compressedTexSubImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function De(){try{i.compressedTexSubImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ce(){try{i.texStorage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Re(){try{i.texStorage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ce(){try{i.texImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ae(){try{i.texImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ge(F){it.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),it.copy(F))}function Be(F){ht.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),ht.copy(F))}function Ie(F,oe){let ue=l.get(oe);ue===void 0&&(ue=new WeakMap,l.set(oe,ue));let _e=ue.get(F);_e===void 0&&(_e=i.getUniformBlockIndex(oe,F.name),ue.set(F,_e))}function pe(F,oe){let _e=l.get(oe).get(F);c.get(oe)!==_e&&(i.uniformBlockBinding(oe,_e,F.__bindingPointIndex),c.set(oe,_e))}function qe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},V=null,ie={},u={},d=new WeakMap,f=[],m=null,x=!1,g=null,p=null,v=null,b=null,_=null,C=null,S=null,A=new Ae(0,0,0),R=0,M=!1,y=null,P=null,N=null,B=null,H=null,it.set(0,0,i.canvas.width,i.canvas.height),ht.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ne,disable:be,bindFramebuffer:He,drawBuffers:Ue,useProgram:et,setBlending:Et,setMaterial:We,setFlipSided:ke,setCullFace:we,setLineWidth:wt,setPolygonOffset:Te,setScissorTest:Ye,activeTexture:Xt,bindTexture:Dt,unbindTexture:L,compressedTexImage2D:E,compressedTexImage3D:G,texImage2D:Ce,texImage3D:ae,updateUBOMapping:Ie,uniformBlockBinding:pe,texStorage2D:ce,texStorage3D:Re,texSubImage2D:K,texSubImage3D:te,compressedTexSubImage2D:Y,compressedTexSubImage3D:De,scissor:ge,viewport:Be,reset:qe}}function Ev(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new de,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(L,E){return f?new OffscreenCanvas(L,E):Zr("canvas")}function x(L,E,G){let K=1,te=Dt(L);if((te.width>G||te.height>G)&&(K=G/Math.max(te.width,te.height)),K<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){let Y=Math.floor(K*te.width),De=Math.floor(K*te.height);u===void 0&&(u=m(Y,De));let ce=E?m(Y,De):u;return ce.width=Y,ce.height=De,ce.getContext("2d").drawImage(L,0,0,Y,De),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+Y+"x"+De+")."),ce}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),L;return L}function g(L){return L.generateMipmaps}function p(L){i.generateMipmap(L)}function v(L){return L.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?i.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(L,E,G,K,te=!1){if(L!==null){if(i[L]!==void 0)return i[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let Y=E;if(E===i.RED&&(G===i.FLOAT&&(Y=i.R32F),G===i.HALF_FLOAT&&(Y=i.R16F),G===i.UNSIGNED_BYTE&&(Y=i.R8)),E===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(Y=i.R8UI),G===i.UNSIGNED_SHORT&&(Y=i.R16UI),G===i.UNSIGNED_INT&&(Y=i.R32UI),G===i.BYTE&&(Y=i.R8I),G===i.SHORT&&(Y=i.R16I),G===i.INT&&(Y=i.R32I)),E===i.RG&&(G===i.FLOAT&&(Y=i.RG32F),G===i.HALF_FLOAT&&(Y=i.RG16F),G===i.UNSIGNED_BYTE&&(Y=i.RG8)),E===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(Y=i.RG8UI),G===i.UNSIGNED_SHORT&&(Y=i.RG16UI),G===i.UNSIGNED_INT&&(Y=i.RG32UI),G===i.BYTE&&(Y=i.RG8I),G===i.SHORT&&(Y=i.RG16I),G===i.INT&&(Y=i.RG32I)),E===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(Y=i.RGB8UI),G===i.UNSIGNED_SHORT&&(Y=i.RGB16UI),G===i.UNSIGNED_INT&&(Y=i.RGB32UI),G===i.BYTE&&(Y=i.RGB8I),G===i.SHORT&&(Y=i.RGB16I),G===i.INT&&(Y=i.RGB32I)),E===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(Y=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(Y=i.RGBA16UI),G===i.UNSIGNED_INT&&(Y=i.RGBA32UI),G===i.BYTE&&(Y=i.RGBA8I),G===i.SHORT&&(Y=i.RGBA16I),G===i.INT&&(Y=i.RGBA32I)),E===i.RGB&&(G===i.UNSIGNED_INT_5_9_9_9_REV&&(Y=i.RGB9_E5),G===i.UNSIGNED_INT_10F_11F_11F_REV&&(Y=i.R11F_G11F_B10F)),E===i.RGBA){let De=te?$r:tt.getTransfer(K);G===i.FLOAT&&(Y=i.RGBA32F),G===i.HALF_FLOAT&&(Y=i.RGBA16F),G===i.UNSIGNED_BYTE&&(Y=De===lt?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(Y=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(Y=i.RGB5_A1)}return(Y===i.R16F||Y===i.R32F||Y===i.RG16F||Y===i.RG32F||Y===i.RGBA16F||Y===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Y}function _(L,E){let G;return L?E===null||E===Fi||E===hr?G=i.DEPTH24_STENCIL8:E===kn?G=i.DEPTH32F_STENCIL8:E===lr&&(G=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Fi||E===hr?G=i.DEPTH_COMPONENT24:E===kn?G=i.DEPTH_COMPONENT32F:E===lr&&(G=i.DEPTH_COMPONENT16),G}function C(L,E){return g(L)===!0||L.isFramebufferTexture&&L.minFilter!==cn&&L.minFilter!==Dn?Math.log2(Math.max(E.width,E.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?E.mipmaps.length:1}function S(L){let E=L.target;E.removeEventListener("dispose",S),R(E),E.isVideoTexture&&h.delete(E)}function A(L){let E=L.target;E.removeEventListener("dispose",A),y(E)}function R(L){let E=n.get(L);if(E.__webglInit===void 0)return;let G=L.source,K=d.get(G);if(K){let te=K[E.__cacheKey];te.usedTimes--,te.usedTimes===0&&M(L),Object.keys(K).length===0&&d.delete(G)}n.remove(L)}function M(L){let E=n.get(L);i.deleteTexture(E.__webglTexture);let G=L.source,K=d.get(G);delete K[E.__cacheKey],a.memory.textures--}function y(L){let E=n.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),n.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(E.__webglFramebuffer[K]))for(let te=0;te<E.__webglFramebuffer[K].length;te++)i.deleteFramebuffer(E.__webglFramebuffer[K][te]);else i.deleteFramebuffer(E.__webglFramebuffer[K]);E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer[K])}else{if(Array.isArray(E.__webglFramebuffer))for(let K=0;K<E.__webglFramebuffer.length;K++)i.deleteFramebuffer(E.__webglFramebuffer[K]);else i.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&i.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let K=0;K<E.__webglColorRenderbuffer.length;K++)E.__webglColorRenderbuffer[K]&&i.deleteRenderbuffer(E.__webglColorRenderbuffer[K]);E.__webglDepthRenderbuffer&&i.deleteRenderbuffer(E.__webglDepthRenderbuffer)}let G=L.textures;for(let K=0,te=G.length;K<te;K++){let Y=n.get(G[K]);Y.__webglTexture&&(i.deleteTexture(Y.__webglTexture),a.memory.textures--),n.remove(G[K])}n.remove(L)}let P=0;function N(){P=0}function B(){let L=P;return L>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+s.maxTextures),P+=1,L}function H(L){let E=[];return E.push(L.wrapS),E.push(L.wrapT),E.push(L.wrapR||0),E.push(L.magFilter),E.push(L.minFilter),E.push(L.anisotropy),E.push(L.internalFormat),E.push(L.format),E.push(L.type),E.push(L.generateMipmaps),E.push(L.premultiplyAlpha),E.push(L.flipY),E.push(L.unpackAlignment),E.push(L.colorSpace),E.join()}function X(L,E){let G=n.get(L);if(L.isVideoTexture&&Ye(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&G.__version!==L.version){let K=L.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{j(G,L,E);return}}else L.isExternalTexture&&(G.__webglTexture=L.sourceTexture?L.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+E)}function q(L,E){let G=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&G.__version!==L.version){j(G,L,E);return}t.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+E)}function ee(L,E){let G=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&G.__version!==L.version){j(G,L,E);return}t.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+E)}function O(L,E){let G=n.get(L);if(L.version>0&&G.__version!==L.version){ne(G,L,E);return}t.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+E)}let V={[Pi]:i.REPEAT,[Ci]:i.CLAMP_TO_EDGE,[wo]:i.MIRRORED_REPEAT},ie={[cn]:i.NEAREST,[uf]:i.NEAREST_MIPMAP_NEAREST,[ba]:i.NEAREST_MIPMAP_LINEAR,[Dn]:i.LINEAR,[dl]:i.LINEAR_MIPMAP_NEAREST,[Ni]:i.LINEAR_MIPMAP_LINEAR},xe={[mf]:i.NEVER,[Mf]:i.ALWAYS,[gf]:i.LESS,[Ih]:i.LEQUAL,[xf]:i.EQUAL,[vf]:i.GEQUAL,[yf]:i.GREATER,[_f]:i.NOTEQUAL};function Le(L,E){if(E.type===kn&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===Dn||E.magFilter===dl||E.magFilter===ba||E.magFilter===Ni||E.minFilter===Dn||E.minFilter===dl||E.minFilter===ba||E.minFilter===Ni)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(L,i.TEXTURE_WRAP_S,V[E.wrapS]),i.texParameteri(L,i.TEXTURE_WRAP_T,V[E.wrapT]),(L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY)&&i.texParameteri(L,i.TEXTURE_WRAP_R,V[E.wrapR]),i.texParameteri(L,i.TEXTURE_MAG_FILTER,ie[E.magFilter]),i.texParameteri(L,i.TEXTURE_MIN_FILTER,ie[E.minFilter]),E.compareFunction&&(i.texParameteri(L,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(L,i.TEXTURE_COMPARE_FUNC,xe[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===cn||E.minFilter!==ba&&E.minFilter!==Ni||E.type===kn&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||n.get(E).__currentAnisotropy){let G=e.get("EXT_texture_filter_anisotropic");i.texParameterf(L,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy}}}function it(L,E){let G=!1;L.__webglInit===void 0&&(L.__webglInit=!0,E.addEventListener("dispose",S));let K=E.source,te=d.get(K);te===void 0&&(te={},d.set(K,te));let Y=H(E);if(Y!==L.__cacheKey){te[Y]===void 0&&(te[Y]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,G=!0),te[Y].usedTimes++;let De=te[L.__cacheKey];De!==void 0&&(te[L.__cacheKey].usedTimes--,De.usedTimes===0&&M(E)),L.__cacheKey=Y,L.__webglTexture=te[Y].texture}return G}function ht(L,E,G){return Math.floor(Math.floor(L/G)/E)}function st(L,E,G,K){let Y=L.updateRanges;if(Y.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,E.width,E.height,G,K,E.data);else{Y.sort((ae,ge)=>ae.start-ge.start);let De=0;for(let ae=1;ae<Y.length;ae++){let ge=Y[De],Be=Y[ae],Ie=ge.start+ge.count,pe=ht(Be.start,E.width,4),qe=ht(ge.start,E.width,4);Be.start<=Ie+1&&pe===qe&&ht(Be.start+Be.count-1,E.width,4)===pe?ge.count=Math.max(ge.count,Be.start+Be.count-ge.start):(++De,Y[De]=Be)}Y.length=De+1;let ce=i.getParameter(i.UNPACK_ROW_LENGTH),Re=i.getParameter(i.UNPACK_SKIP_PIXELS),Ce=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,E.width);for(let ae=0,ge=Y.length;ae<ge;ae++){let Be=Y[ae],Ie=Math.floor(Be.start/4),pe=Math.ceil(Be.count/4),qe=Ie%E.width,F=Math.floor(Ie/E.width),oe=pe,ue=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,qe),i.pixelStorei(i.UNPACK_SKIP_ROWS,F),t.texSubImage2D(i.TEXTURE_2D,0,qe,F,oe,ue,G,K,E.data)}L.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ce),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Re),i.pixelStorei(i.UNPACK_SKIP_ROWS,Ce)}}function j(L,E,G){let K=i.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(K=i.TEXTURE_2D_ARRAY),E.isData3DTexture&&(K=i.TEXTURE_3D);let te=it(L,E),Y=E.source;t.bindTexture(K,L.__webglTexture,i.TEXTURE0+G);let De=n.get(Y);if(Y.version!==De.__version||te===!0){t.activeTexture(i.TEXTURE0+G);let ce=tt.getPrimaries(tt.workingColorSpace),Re=E.colorSpace===zn?null:tt.getPrimaries(E.colorSpace),Ce=E.colorSpace===zn||ce===Re?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce);let ae=x(E.image,!1,s.maxTextureSize);ae=Xt(E,ae);let ge=r.convert(E.format,E.colorSpace),Be=r.convert(E.type),Ie=b(E.internalFormat,ge,Be,E.colorSpace,E.isVideoTexture);Le(K,E);let pe,qe=E.mipmaps,F=E.isVideoTexture!==!0,oe=De.__version===void 0||te===!0,ue=Y.dataReady,_e=C(E,ae);if(E.isDepthTexture)Ie=_(E.format===ur,E.type),oe&&(F?t.texStorage2D(i.TEXTURE_2D,1,Ie,ae.width,ae.height):t.texImage2D(i.TEXTURE_2D,0,Ie,ae.width,ae.height,0,ge,Be,null));else if(E.isDataTexture)if(qe.length>0){F&&oe&&t.texStorage2D(i.TEXTURE_2D,_e,Ie,qe[0].width,qe[0].height);for(let se=0,Q=qe.length;se<Q;se++)pe=qe[se],F?ue&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,pe.width,pe.height,ge,Be,pe.data):t.texImage2D(i.TEXTURE_2D,se,Ie,pe.width,pe.height,0,ge,Be,pe.data);E.generateMipmaps=!1}else F?(oe&&t.texStorage2D(i.TEXTURE_2D,_e,Ie,ae.width,ae.height),ue&&st(E,ae,ge,Be)):t.texImage2D(i.TEXTURE_2D,0,Ie,ae.width,ae.height,0,ge,Be,ae.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){F&&oe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,_e,Ie,qe[0].width,qe[0].height,ae.depth);for(let se=0,Q=qe.length;se<Q;se++)if(pe=qe[se],E.format!==Tn)if(ge!==null)if(F){if(ue)if(E.layerUpdates.size>0){let Ee=Bh(pe.width,pe.height,E.format,E.type);for(let Ve of E.layerUpdates){let gt=pe.data.subarray(Ve*Ee/pe.data.BYTES_PER_ELEMENT,(Ve+1)*Ee/pe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,Ve,pe.width,pe.height,1,ge,gt)}E.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,0,pe.width,pe.height,ae.depth,ge,pe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,se,Ie,pe.width,pe.height,ae.depth,0,pe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else F?ue&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,se,0,0,0,pe.width,pe.height,ae.depth,ge,Be,pe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,se,Ie,pe.width,pe.height,ae.depth,0,ge,Be,pe.data)}else{F&&oe&&t.texStorage2D(i.TEXTURE_2D,_e,Ie,qe[0].width,qe[0].height);for(let se=0,Q=qe.length;se<Q;se++)pe=qe[se],E.format!==Tn?ge!==null?F?ue&&t.compressedTexSubImage2D(i.TEXTURE_2D,se,0,0,pe.width,pe.height,ge,pe.data):t.compressedTexImage2D(i.TEXTURE_2D,se,Ie,pe.width,pe.height,0,pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):F?ue&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,pe.width,pe.height,ge,Be,pe.data):t.texImage2D(i.TEXTURE_2D,se,Ie,pe.width,pe.height,0,ge,Be,pe.data)}else if(E.isDataArrayTexture)if(F){if(oe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,_e,Ie,ae.width,ae.height,ae.depth),ue)if(E.layerUpdates.size>0){let se=Bh(ae.width,ae.height,E.format,E.type);for(let Q of E.layerUpdates){let Ee=ae.data.subarray(Q*se/ae.data.BYTES_PER_ELEMENT,(Q+1)*se/ae.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Q,ae.width,ae.height,1,ge,Be,Ee)}E.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ae.width,ae.height,ae.depth,ge,Be,ae.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ie,ae.width,ae.height,ae.depth,0,ge,Be,ae.data);else if(E.isData3DTexture)F?(oe&&t.texStorage3D(i.TEXTURE_3D,_e,Ie,ae.width,ae.height,ae.depth),ue&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ae.width,ae.height,ae.depth,ge,Be,ae.data)):t.texImage3D(i.TEXTURE_3D,0,Ie,ae.width,ae.height,ae.depth,0,ge,Be,ae.data);else if(E.isFramebufferTexture){if(oe)if(F)t.texStorage2D(i.TEXTURE_2D,_e,Ie,ae.width,ae.height);else{let se=ae.width,Q=ae.height;for(let Ee=0;Ee<_e;Ee++)t.texImage2D(i.TEXTURE_2D,Ee,Ie,se,Q,0,ge,Be,null),se>>=1,Q>>=1}}else if(qe.length>0){if(F&&oe){let se=Dt(qe[0]);t.texStorage2D(i.TEXTURE_2D,_e,Ie,se.width,se.height)}for(let se=0,Q=qe.length;se<Q;se++)pe=qe[se],F?ue&&t.texSubImage2D(i.TEXTURE_2D,se,0,0,ge,Be,pe):t.texImage2D(i.TEXTURE_2D,se,Ie,ge,Be,pe);E.generateMipmaps=!1}else if(F){if(oe){let se=Dt(ae);t.texStorage2D(i.TEXTURE_2D,_e,Ie,se.width,se.height)}ue&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ge,Be,ae)}else t.texImage2D(i.TEXTURE_2D,0,Ie,ge,Be,ae);g(E)&&p(K),De.__version=Y.version,E.onUpdate&&E.onUpdate(E)}L.__version=E.version}function ne(L,E,G){if(E.image.length!==6)return;let K=it(L,E),te=E.source;t.bindTexture(i.TEXTURE_CUBE_MAP,L.__webglTexture,i.TEXTURE0+G);let Y=n.get(te);if(te.version!==Y.__version||K===!0){t.activeTexture(i.TEXTURE0+G);let De=tt.getPrimaries(tt.workingColorSpace),ce=E.colorSpace===zn?null:tt.getPrimaries(E.colorSpace),Re=E.colorSpace===zn||De===ce?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Re);let Ce=E.isCompressedTexture||E.image[0].isCompressedTexture,ae=E.image[0]&&E.image[0].isDataTexture,ge=[];for(let Q=0;Q<6;Q++)!Ce&&!ae?ge[Q]=x(E.image[Q],!0,s.maxCubemapSize):ge[Q]=ae?E.image[Q].image:E.image[Q],ge[Q]=Xt(E,ge[Q]);let Be=ge[0],Ie=r.convert(E.format,E.colorSpace),pe=r.convert(E.type),qe=b(E.internalFormat,Ie,pe,E.colorSpace),F=E.isVideoTexture!==!0,oe=Y.__version===void 0||K===!0,ue=te.dataReady,_e=C(E,Be);Le(i.TEXTURE_CUBE_MAP,E);let se;if(Ce){F&&oe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,_e,qe,Be.width,Be.height);for(let Q=0;Q<6;Q++){se=ge[Q].mipmaps;for(let Ee=0;Ee<se.length;Ee++){let Ve=se[Ee];E.format!==Tn?Ie!==null?F?ue&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee,0,0,Ve.width,Ve.height,Ie,Ve.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee,qe,Ve.width,Ve.height,0,Ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee,0,0,Ve.width,Ve.height,Ie,pe,Ve.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee,qe,Ve.width,Ve.height,0,Ie,pe,Ve.data)}}}else{if(se=E.mipmaps,F&&oe){se.length>0&&_e++;let Q=Dt(ge[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,_e,qe,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(ae){F?ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,ge[Q].width,ge[Q].height,Ie,pe,ge[Q].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,qe,ge[Q].width,ge[Q].height,0,Ie,pe,ge[Q].data);for(let Ee=0;Ee<se.length;Ee++){let gt=se[Ee].image[Q].image;F?ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee+1,0,0,gt.width,gt.height,Ie,pe,gt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee+1,qe,gt.width,gt.height,0,Ie,pe,gt.data)}}else{F?ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Ie,pe,ge[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,qe,Ie,pe,ge[Q]);for(let Ee=0;Ee<se.length;Ee++){let Ve=se[Ee];F?ue&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee+1,0,0,Ie,pe,Ve.image[Q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ee+1,qe,Ie,pe,Ve.image[Q])}}}g(E)&&p(i.TEXTURE_CUBE_MAP),Y.__version=te.version,E.onUpdate&&E.onUpdate(E)}L.__version=E.version}function be(L,E,G,K,te,Y){let De=r.convert(G.format,G.colorSpace),ce=r.convert(G.type),Re=b(G.internalFormat,De,ce,G.colorSpace),Ce=n.get(E),ae=n.get(G);if(ae.__renderTarget=E,!Ce.__hasExternalTextures){let ge=Math.max(1,E.width>>Y),Be=Math.max(1,E.height>>Y);te===i.TEXTURE_3D||te===i.TEXTURE_2D_ARRAY?t.texImage3D(te,Y,Re,ge,Be,E.depth,0,De,ce,null):t.texImage2D(te,Y,Re,ge,Be,0,De,ce,null)}t.bindFramebuffer(i.FRAMEBUFFER,L),Te(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,K,te,ae.__webglTexture,0,wt(E)):(te===i.TEXTURE_2D||te>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,K,te,ae.__webglTexture,Y),t.bindFramebuffer(i.FRAMEBUFFER,null)}function He(L,E,G){if(i.bindRenderbuffer(i.RENDERBUFFER,L),E.depthBuffer){let K=E.depthTexture,te=K&&K.isDepthTexture?K.type:null,Y=_(E.stencilBuffer,te),De=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ce=wt(E);Te(E)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ce,Y,E.width,E.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,ce,Y,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,Y,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,De,i.RENDERBUFFER,L)}else{let K=E.textures;for(let te=0;te<K.length;te++){let Y=K[te],De=r.convert(Y.format,Y.colorSpace),ce=r.convert(Y.type),Re=b(Y.internalFormat,De,ce,Y.colorSpace),Ce=wt(E);G&&Te(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ce,Re,E.width,E.height):Te(E)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ce,Re,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,Re,E.width,E.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ue(L,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,L),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let K=n.get(E.depthTexture);K.__renderTarget=E,(!K.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),X(E.depthTexture,0);let te=K.__webglTexture,Y=wt(E);if(E.depthTexture.format===Ys)Te(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,te,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,te,0);else if(E.depthTexture.format===ur)Te(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,te,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,te,0);else throw new Error("Unknown depthTexture format")}function et(L){let E=n.get(L),G=L.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==L.depthTexture){let K=L.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),K){let te=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,K.removeEventListener("dispose",te)};K.addEventListener("dispose",te),E.__depthDisposeCallback=te}E.__boundDepthTexture=K}if(L.depthTexture&&!E.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");let K=L.texture.mipmaps;K&&K.length>0?Ue(E.__webglFramebuffer[0],L):Ue(E.__webglFramebuffer,L)}else if(G){E.__webglDepthbuffer=[];for(let K=0;K<6;K++)if(t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[K]),E.__webglDepthbuffer[K]===void 0)E.__webglDepthbuffer[K]=i.createRenderbuffer(),He(E.__webglDepthbuffer[K],L,!1);else{let te=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=E.__webglDepthbuffer[K];i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,te,i.RENDERBUFFER,Y)}}else{let K=L.texture.mipmaps;if(K&&K.length>0?t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=i.createRenderbuffer(),He(E.__webglDepthbuffer,L,!1);else{let te=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=E.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Y),i.framebufferRenderbuffer(i.FRAMEBUFFER,te,i.RENDERBUFFER,Y)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Kt(L,E,G){let K=n.get(L);E!==void 0&&be(K.__webglFramebuffer,L,L.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&et(L)}function U(L){let E=L.texture,G=n.get(L),K=n.get(E);L.addEventListener("dispose",A);let te=L.textures,Y=L.isWebGLCubeRenderTarget===!0,De=te.length>1;if(De||(K.__webglTexture===void 0&&(K.__webglTexture=i.createTexture()),K.__version=E.version,a.memory.textures++),Y){G.__webglFramebuffer=[];for(let ce=0;ce<6;ce++)if(E.mipmaps&&E.mipmaps.length>0){G.__webglFramebuffer[ce]=[];for(let Re=0;Re<E.mipmaps.length;Re++)G.__webglFramebuffer[ce][Re]=i.createFramebuffer()}else G.__webglFramebuffer[ce]=i.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){G.__webglFramebuffer=[];for(let ce=0;ce<E.mipmaps.length;ce++)G.__webglFramebuffer[ce]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(De)for(let ce=0,Re=te.length;ce<Re;ce++){let Ce=n.get(te[ce]);Ce.__webglTexture===void 0&&(Ce.__webglTexture=i.createTexture(),a.memory.textures++)}if(L.samples>0&&Te(L)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let ce=0;ce<te.length;ce++){let Re=te[ce];G.__webglColorRenderbuffer[ce]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[ce]);let Ce=r.convert(Re.format,Re.colorSpace),ae=r.convert(Re.type),ge=b(Re.internalFormat,Ce,ae,Re.colorSpace,L.isXRRenderTarget===!0),Be=wt(L);i.renderbufferStorageMultisample(i.RENDERBUFFER,Be,ge,L.width,L.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,G.__webglColorRenderbuffer[ce])}i.bindRenderbuffer(i.RENDERBUFFER,null),L.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),He(G.__webglDepthRenderbuffer,L,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Y){t.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),Le(i.TEXTURE_CUBE_MAP,E);for(let ce=0;ce<6;ce++)if(E.mipmaps&&E.mipmaps.length>0)for(let Re=0;Re<E.mipmaps.length;Re++)be(G.__webglFramebuffer[ce][Re],L,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,Re);else be(G.__webglFramebuffer[ce],L,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0);g(E)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(De){for(let ce=0,Re=te.length;ce<Re;ce++){let Ce=te[ce],ae=n.get(Ce),ge=i.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(ge=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ge,ae.__webglTexture),Le(ge,Ce),be(G.__webglFramebuffer,L,Ce,i.COLOR_ATTACHMENT0+ce,ge,0),g(Ce)&&p(ge)}t.unbindTexture()}else{let ce=i.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(ce=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ce,K.__webglTexture),Le(ce,E),E.mipmaps&&E.mipmaps.length>0)for(let Re=0;Re<E.mipmaps.length;Re++)be(G.__webglFramebuffer[Re],L,E,i.COLOR_ATTACHMENT0,ce,Re);else be(G.__webglFramebuffer,L,E,i.COLOR_ATTACHMENT0,ce,0);g(E)&&p(ce),t.unbindTexture()}L.depthBuffer&&et(L)}function Et(L){let E=L.textures;for(let G=0,K=E.length;G<K;G++){let te=E[G];if(g(te)){let Y=v(L),De=n.get(te).__webglTexture;t.bindTexture(Y,De),p(Y),t.unbindTexture()}}}let We=[],ke=[];function we(L){if(L.samples>0){if(Te(L)===!1){let E=L.textures,G=L.width,K=L.height,te=i.COLOR_BUFFER_BIT,Y=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,De=n.get(L),ce=E.length>1;if(ce)for(let Ce=0;Ce<E.length;Ce++)t.bindFramebuffer(i.FRAMEBUFFER,De.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ce,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,De.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ce,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,De.__webglMultisampledFramebuffer);let Re=L.texture.mipmaps;Re&&Re.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,De.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,De.__webglFramebuffer);for(let Ce=0;Ce<E.length;Ce++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(te|=i.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(te|=i.STENCIL_BUFFER_BIT)),ce){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,De.__webglColorRenderbuffer[Ce]);let ae=n.get(E[Ce]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ae,0)}i.blitFramebuffer(0,0,G,K,0,0,G,K,te,i.NEAREST),c===!0&&(We.length=0,ke.length=0,We.push(i.COLOR_ATTACHMENT0+Ce),L.depthBuffer&&L.resolveDepthBuffer===!1&&(We.push(Y),ke.push(Y),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ke)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,We))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ce)for(let Ce=0;Ce<E.length;Ce++){t.bindFramebuffer(i.FRAMEBUFFER,De.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ce,i.RENDERBUFFER,De.__webglColorRenderbuffer[Ce]);let ae=n.get(E[Ce]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,De.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ce,i.TEXTURE_2D,ae,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,De.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&c){let E=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[E])}}}function wt(L){return Math.min(s.maxSamples,L.samples)}function Te(L){let E=n.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Ye(L){let E=a.render.frame;h.get(L)!==E&&(h.set(L,E),L.update())}function Xt(L,E){let G=L.colorSpace,K=L.format,te=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||G!==Ji&&G!==zn&&(tt.getTransfer(G)===lt?(K!==Tn||te!==Bn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),E}function Dt(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(l.width=L.naturalWidth||L.width,l.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(l.width=L.displayWidth,l.height=L.displayHeight):(l.width=L.width,l.height=L.height),l}this.allocateTextureUnit=B,this.resetTextureUnits=N,this.setTexture2D=X,this.setTexture2DArray=q,this.setTexture3D=ee,this.setTextureCube=O,this.rebindTextures=Kt,this.setupRenderTarget=U,this.updateRenderTargetMipmap=Et,this.updateMultisampleRenderTarget=we,this.setupDepthRenderbuffer=et,this.setupFrameBufferTexture=be,this.useMultisampledRTT=Te}function wv(i,e){function t(n,s=zn){let r,a=tt.getTransfer(s);if(n===Bn)return i.UNSIGNED_BYTE;if(n===pl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ml)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Eh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===wh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===bh)return i.BYTE;if(n===Sh)return i.SHORT;if(n===lr)return i.UNSIGNED_SHORT;if(n===fl)return i.INT;if(n===Fi)return i.UNSIGNED_INT;if(n===kn)return i.FLOAT;if(n===cr)return i.HALF_FLOAT;if(n===Th)return i.ALPHA;if(n===Ah)return i.RGB;if(n===Tn)return i.RGBA;if(n===Ys)return i.DEPTH_COMPONENT;if(n===ur)return i.DEPTH_STENCIL;if(n===gl)return i.RED;if(n===xl)return i.RED_INTEGER;if(n===Rh)return i.RG;if(n===yl)return i.RG_INTEGER;if(n===_l)return i.RGBA_INTEGER;if(n===Sa||n===Ea||n===wa||n===Ta)if(a===lt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Sa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ea)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===wa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ta)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Sa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ea)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===wa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ta)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===vl||n===Ml||n===bl||n===Sl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===vl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ml)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===bl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Sl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===El||n===wl||n===Tl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===El||n===wl)return a===lt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Tl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Al||n===Rl||n===Cl||n===Il||n===Pl||n===Ll||n===Dl||n===Ul||n===Nl||n===Fl||n===Ol||n===Bl||n===kl||n===zl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Al)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Rl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Cl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Il)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Pl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ll)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Dl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ul)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Nl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Fl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ol)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Bl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===kl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===zl)return a===lt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Hl||n===Gl||n===Vl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Hl)return a===lt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Gl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Vl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Wl||n===Xl||n===ql||n===$l)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Wl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Xl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ql)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===$l)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===hr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var Tv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Av=`
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

}`,Jh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new oa(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Fn({vertexShader:Tv,fragmentShader:Av,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ve(new Nt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},jh=class extends fi{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,m=null,x=typeof XRWebGLBinding<"u",g=new Jh,p={},v=t.getContextAttributes(),b=null,_=null,C=[],S=[],A=new de,R=null,M=new Qt;M.viewport=new It;let y=new Qt;y.viewport=new It;let P=[M,y],N=new tl,B=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let ne=C[j];return ne===void 0&&(ne=new js,C[j]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(j){let ne=C[j];return ne===void 0&&(ne=new js,C[j]=ne),ne.getGripSpace()},this.getHand=function(j){let ne=C[j];return ne===void 0&&(ne=new js,C[j]=ne),ne.getHandSpace()};function X(j){let ne=S.indexOf(j.inputSource);if(ne===-1)return;let be=C[ne];be!==void 0&&(be.update(j.inputSource,j.frame,l||a),be.dispatchEvent({type:j.type,data:j.inputSource}))}function q(){s.removeEventListener("select",X),s.removeEventListener("selectstart",X),s.removeEventListener("selectend",X),s.removeEventListener("squeeze",X),s.removeEventListener("squeezestart",X),s.removeEventListener("squeezeend",X),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",ee);for(let j=0;j<C.length;j++){let ne=S[j];ne!==null&&(S[j]=null,C[j].disconnect(ne))}B=null,H=null,g.reset();for(let j in p)delete p[j];e.setRenderTarget(b),f=null,d=null,u=null,s=null,_=null,st.stop(),n.isPresenting=!1,e.setPixelRatio(R),e.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(j){if(s=j,s!==null){if(b=e.getRenderTarget(),s.addEventListener("select",X),s.addEventListener("selectstart",X),s.addEventListener("selectend",X),s.addEventListener("squeeze",X),s.addEventListener("squeezestart",X),s.addEventListener("squeezeend",X),s.addEventListener("end",q),s.addEventListener("inputsourceschange",ee),v.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(A),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let be=null,He=null,Ue=null;v.depth&&(Ue=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,be=v.stencil?ur:Ys,He=v.stencil?hr:Fi);let et={colorFormat:t.RGBA8,depthFormat:Ue,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(et),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),_=new $n(d.textureWidth,d.textureHeight,{format:Tn,type:Bn,depthTexture:new aa(d.textureWidth,d.textureHeight,He,void 0,void 0,void 0,void 0,void 0,void 0,be),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let be={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,be),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new $n(f.framebufferWidth,f.framebufferHeight,{format:Tn,type:Bn,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),st.setContext(s),st.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function ee(j){for(let ne=0;ne<j.removed.length;ne++){let be=j.removed[ne],He=S.indexOf(be);He>=0&&(S[He]=null,C[He].disconnect(be))}for(let ne=0;ne<j.added.length;ne++){let be=j.added[ne],He=S.indexOf(be);if(He===-1){for(let et=0;et<C.length;et++)if(et>=S.length){S.push(be),He=et;break}else if(S[et]===null){S[et]=be,He=et;break}if(He===-1)break}let Ue=C[He];Ue&&Ue.connect(be)}}let O=new D,V=new D;function ie(j,ne,be){O.setFromMatrixPosition(ne.matrixWorld),V.setFromMatrixPosition(be.matrixWorld);let He=O.distanceTo(V),Ue=ne.projectionMatrix.elements,et=be.projectionMatrix.elements,Kt=Ue[14]/(Ue[10]-1),U=Ue[14]/(Ue[10]+1),Et=(Ue[9]+1)/Ue[5],We=(Ue[9]-1)/Ue[5],ke=(Ue[8]-1)/Ue[0],we=(et[8]+1)/et[0],wt=Kt*ke,Te=Kt*we,Ye=He/(-ke+we),Xt=Ye*-ke;if(ne.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(Xt),j.translateZ(Ye),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Ue[10]===-1)j.projectionMatrix.copy(ne.projectionMatrix),j.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{let Dt=Kt+Ye,L=U+Ye,E=wt-Xt,G=Te+(He-Xt),K=Et*U/L*Dt,te=We*U/L*Dt;j.projectionMatrix.makePerspective(E,G,K,te,Dt,L),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function xe(j,ne){ne===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(ne.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(s===null)return;let ne=j.near,be=j.far;g.texture!==null&&(g.depthNear>0&&(ne=g.depthNear),g.depthFar>0&&(be=g.depthFar)),N.near=y.near=M.near=ne,N.far=y.far=M.far=be,(B!==N.near||H!==N.far)&&(s.updateRenderState({depthNear:N.near,depthFar:N.far}),B=N.near,H=N.far),N.layers.mask=j.layers.mask|6,M.layers.mask=N.layers.mask&3,y.layers.mask=N.layers.mask&5;let He=j.parent,Ue=N.cameras;xe(N,He);for(let et=0;et<Ue.length;et++)xe(Ue[et],He);Ue.length===2?ie(N,M,y):N.projectionMatrix.copy(M.projectionMatrix),Le(j,N,He)};function Le(j,ne,be){be===null?j.matrix.copy(ne.matrixWorld):(j.matrix.copy(be.matrixWorld),j.matrix.invert(),j.matrix.multiply(ne.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(ne.projectionMatrix),j.projectionMatrixInverse.copy(ne.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=Zs*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(j){c=j,d!==null&&(d.fixedFoveation=j),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=j)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(N)},this.getCameraTexture=function(j){return p[j]};let it=null;function ht(j,ne){if(h=ne.getViewerPose(l||a),m=ne,h!==null){let be=h.views;f!==null&&(e.setRenderTargetFramebuffer(_,f.framebuffer),e.setRenderTarget(_));let He=!1;be.length!==N.cameras.length&&(N.cameras.length=0,He=!0);for(let U=0;U<be.length;U++){let Et=be[U],We=null;if(f!==null)We=f.getViewport(Et);else{let we=u.getViewSubImage(d,Et);We=we.viewport,U===0&&(e.setRenderTargetTextures(_,we.colorTexture,we.depthStencilTexture),e.setRenderTarget(_))}let ke=P[U];ke===void 0&&(ke=new Qt,ke.layers.enable(U),ke.viewport=new It,P[U]=ke),ke.matrix.fromArray(Et.transform.matrix),ke.matrix.decompose(ke.position,ke.quaternion,ke.scale),ke.projectionMatrix.fromArray(Et.projectionMatrix),ke.projectionMatrixInverse.copy(ke.projectionMatrix).invert(),ke.viewport.set(We.x,We.y,We.width,We.height),U===0&&(N.matrix.copy(ke.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),He===!0&&N.cameras.push(ke)}let Ue=s.enabledFeatures;if(Ue&&Ue.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=n.getBinding();let U=u.getDepthInformation(be[0]);U&&U.isValid&&U.texture&&g.init(U,s.renderState)}if(Ue&&Ue.includes("camera-access")&&x){e.state.unbindTexture(),u=n.getBinding();for(let U=0;U<be.length;U++){let Et=be[U].camera;if(Et){let We=p[Et];We||(We=new oa,p[Et]=We);let ke=u.getCameraImage(Et);We.sourceTexture=ke}}}}for(let be=0;be<C.length;be++){let He=S[be],Ue=C[be];He!==null&&Ue!==void 0&&Ue.update(He,ne,l||a)}it&&it(j,ne),ne.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ne}),m=null}let st=new tp;st.setAnimationLoop(ht),this.setAnimationLoop=function(j){it=j},this.dispose=function(){}}},os=new Nn,Rv=new ct;function Cv(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Uh(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,v,b,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,_)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),x(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?c(g,p,v,b):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Ht&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Ht&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let v=e.get(p),b=v.envMap,_=v.envMapRotation;b&&(g.envMap.value=b,os.copy(_),os.x*=-1,os.y*=-1,os.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(os.y*=-1,os.z*=-1),g.envMapRotation.value.setFromMatrix4(Rv.makeRotationFromEuler(os)),g.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,v,b){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*v,g.scale.value=b*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,v){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ht&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){let v=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Iv(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,b){let _=b.program;n.uniformBlockBinding(v,_)}function l(v,b){let _=s[v.id];_===void 0&&(m(v),_=h(v),s[v.id]=_,v.addEventListener("dispose",g));let C=b.program;n.updateUBOMapping(v,C);let S=e.render.frame;r[v.id]!==S&&(d(v),r[v.id]=S)}function h(v){let b=u();v.__bindingPointIndex=b;let _=i.createBuffer(),C=v.__size,S=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,C,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,_),_}function u(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){let b=s[v.id],_=v.uniforms,C=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let S=0,A=_.length;S<A;S++){let R=Array.isArray(_[S])?_[S]:[_[S]];for(let M=0,y=R.length;M<y;M++){let P=R[M];if(f(P,S,M,C)===!0){let N=P.__offset,B=Array.isArray(P.value)?P.value:[P.value],H=0;for(let X=0;X<B.length;X++){let q=B[X],ee=x(q);typeof q=="number"||typeof q=="boolean"?(P.__data[0]=q,i.bufferSubData(i.UNIFORM_BUFFER,N+H,P.__data)):q.isMatrix3?(P.__data[0]=q.elements[0],P.__data[1]=q.elements[1],P.__data[2]=q.elements[2],P.__data[3]=0,P.__data[4]=q.elements[3],P.__data[5]=q.elements[4],P.__data[6]=q.elements[5],P.__data[7]=0,P.__data[8]=q.elements[6],P.__data[9]=q.elements[7],P.__data[10]=q.elements[8],P.__data[11]=0):(q.toArray(P.__data,H),H+=ee.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,N,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(v,b,_,C){let S=v.value,A=b+"_"+_;if(C[A]===void 0)return typeof S=="number"||typeof S=="boolean"?C[A]=S:C[A]=S.clone(),!0;{let R=C[A];if(typeof S=="number"||typeof S=="boolean"){if(R!==S)return C[A]=S,!0}else if(R.equals(S)===!1)return R.copy(S),!0}return!1}function m(v){let b=v.uniforms,_=0,C=16;for(let A=0,R=b.length;A<R;A++){let M=Array.isArray(b[A])?b[A]:[b[A]];for(let y=0,P=M.length;y<P;y++){let N=M[y],B=Array.isArray(N.value)?N.value:[N.value];for(let H=0,X=B.length;H<X;H++){let q=B[H],ee=x(q),O=_%C,V=O%ee.boundary,ie=O+V;_+=V,ie!==0&&C-ie<ee.storage&&(_+=C-ie),N.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=_,_+=ee.storage}}}let S=_%C;return S>0&&(_+=C-S),v.__size=_,v.__cache={},this}function x(v){let b={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(b.boundary=4,b.storage=4):v.isVector2?(b.boundary=8,b.storage=8):v.isVector3||v.isColor?(b.boundary=16,b.storage=12):v.isVector4?(b.boundary=16,b.storage=16):v.isMatrix3?(b.boundary=48,b.storage=48):v.isMatrix4?(b.boundary=64,b.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),b}function g(v){let b=v.target;b.removeEventListener("dispose",g);let _=a.indexOf(b.__bindingPointIndex);a.splice(_,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function p(){for(let v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:c,update:l,dispose:p}}var jl=class{constructor(e={}){let{canvas:t=bf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;let m=new Uint32Array(4),x=new Int32Array(4),g=null,p=null,v=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Mi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let _=this,C=!1;this._outputColorSpace=Bt;let S=0,A=0,R=null,M=-1,y=null,P=new It,N=new It,B=null,H=new Ae(0),X=0,q=t.width,ee=t.height,O=1,V=null,ie=null,xe=new It(0,0,q,ee),Le=new It(0,0,q,ee),it=!1,ht=new tr,st=!1,j=!1,ne=new ct,be=new D,He=new It,Ue={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},et=!1;function Kt(){return R===null?O:1}let U=n;function Et(T,k){return t.getContext(T,k)}try{let T={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",ue,!1),t.addEventListener("webglcontextrestored",_e,!1),t.addEventListener("webglcontextcreationerror",se,!1),U===null){let k="webgl2";if(U=Et(k,T),U===null)throw Et(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let We,ke,we,wt,Te,Ye,Xt,Dt,L,E,G,K,te,Y,De,ce,Re,Ce,ae,ge,Be,Ie,pe,qe;function F(){We=new Yy(U),We.init(),Ie=new wv(U,We),ke=new Hy(U,We,e,Ie),we=new Sv(U,We),ke.reversedDepthBuffer&&d&&we.buffers.depth.setReversed(!0),wt=new Jy(U),Te=new hv,Ye=new Ev(U,We,we,Te,ke,Ie,wt),Xt=new Vy(_),Dt=new $y(_),L=new i0(U),pe=new ky(U,L),E=new Zy(U,L,wt,pe),G=new Qy(U,E,L,wt),ae=new jy(U,ke,Ye),ce=new Gy(Te),K=new cv(_,Xt,Dt,We,ke,pe,ce),te=new Cv(_,Te),Y=new dv,De=new yv(We),Ce=new By(_,Xt,Dt,we,G,f,c),Re=new Mv(_,G,ke),qe=new Iv(U,wt,ke,we),ge=new zy(U,We,wt),Be=new Ky(U,We,wt),wt.programs=K.programs,_.capabilities=ke,_.extensions=We,_.properties=Te,_.renderLists=Y,_.shadowMap=Re,_.state=we,_.info=wt}F();let oe=new jh(_,U);this.xr=oe,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let T=We.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=We.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return O},this.setPixelRatio=function(T){T!==void 0&&(O=T,this.setSize(q,ee,!1))},this.getSize=function(T){return T.set(q,ee)},this.setSize=function(T,k,W=!0){if(oe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}q=T,ee=k,t.width=Math.floor(T*O),t.height=Math.floor(k*O),W===!0&&(t.style.width=T+"px",t.style.height=k+"px"),this.setViewport(0,0,T,k)},this.getDrawingBufferSize=function(T){return T.set(q*O,ee*O).floor()},this.setDrawingBufferSize=function(T,k,W){q=T,ee=k,O=W,t.width=Math.floor(T*W),t.height=Math.floor(k*W),this.setViewport(0,0,T,k)},this.getCurrentViewport=function(T){return T.copy(P)},this.getViewport=function(T){return T.copy(xe)},this.setViewport=function(T,k,W,$){T.isVector4?xe.set(T.x,T.y,T.z,T.w):xe.set(T,k,W,$),we.viewport(P.copy(xe).multiplyScalar(O).round())},this.getScissor=function(T){return T.copy(Le)},this.setScissor=function(T,k,W,$){T.isVector4?Le.set(T.x,T.y,T.z,T.w):Le.set(T,k,W,$),we.scissor(N.copy(Le).multiplyScalar(O).round())},this.getScissorTest=function(){return it},this.setScissorTest=function(T){we.setScissorTest(it=T)},this.setOpaqueSort=function(T){V=T},this.setTransparentSort=function(T){ie=T},this.getClearColor=function(T){return T.copy(Ce.getClearColor())},this.setClearColor=function(){Ce.setClearColor(...arguments)},this.getClearAlpha=function(){return Ce.getClearAlpha()},this.setClearAlpha=function(){Ce.setClearAlpha(...arguments)},this.clear=function(T=!0,k=!0,W=!0){let $=0;if(T){let z=!1;if(R!==null){let re=R.texture.format;z=re===_l||re===yl||re===xl}if(z){let re=R.texture.type,me=re===Bn||re===Fi||re===lr||re===hr||re===pl||re===ml,Se=Ce.getClearColor(),ye=Ce.getClearAlpha(),Oe=Se.r,ze=Se.g,Ne=Se.b;me?(m[0]=Oe,m[1]=ze,m[2]=Ne,m[3]=ye,U.clearBufferuiv(U.COLOR,0,m)):(x[0]=Oe,x[1]=ze,x[2]=Ne,x[3]=ye,U.clearBufferiv(U.COLOR,0,x))}else $|=U.COLOR_BUFFER_BIT}k&&($|=U.DEPTH_BUFFER_BIT),W&&($|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ue,!1),t.removeEventListener("webglcontextrestored",_e,!1),t.removeEventListener("webglcontextcreationerror",se,!1),Ce.dispose(),Y.dispose(),De.dispose(),Te.dispose(),Xt.dispose(),Dt.dispose(),G.dispose(),pe.dispose(),qe.dispose(),K.dispose(),oe.dispose(),oe.removeEventListener("sessionstart",Wn),oe.removeEventListener("sessionend",Du),Gi.stop()};function ue(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function _e(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;let T=wt.autoReset,k=Re.enabled,W=Re.autoUpdate,$=Re.needsUpdate,z=Re.type;F(),wt.autoReset=T,Re.enabled=k,Re.autoUpdate=W,Re.needsUpdate=$,Re.type=z}function se(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Q(T){let k=T.target;k.removeEventListener("dispose",Q),Ee(k)}function Ee(T){Ve(T),Te.remove(T)}function Ve(T){let k=Te.get(T).programs;k!==void 0&&(k.forEach(function(W){K.releaseProgram(W)}),T.isShaderMaterial&&K.releaseShaderCache(T))}this.renderBufferDirect=function(T,k,W,$,z,re){k===null&&(k=Ue);let me=z.isMesh&&z.matrixWorld.determinant()<0,Se=_m(T,k,W,$,z);we.setMaterial($,me);let ye=W.index,Oe=1;if($.wireframe===!0){if(ye=E.getWireframeAttribute(W),ye===void 0)return;Oe=2}let ze=W.drawRange,Ne=W.attributes.position,Qe=ze.start*Oe,ut=(ze.start+ze.count)*Oe;re!==null&&(Qe=Math.max(Qe,re.start*Oe),ut=Math.min(ut,(re.start+re.count)*Oe)),ye!==null?(Qe=Math.max(Qe,0),ut=Math.min(ut,ye.count)):Ne!=null&&(Qe=Math.max(Qe,0),ut=Math.min(ut,Ne.count));let Lt=ut-Qe;if(Lt<0||Lt===1/0)return;pe.setup(z,$,Se,W,ye);let Mt,pt=ge;if(ye!==null&&(Mt=L.get(ye),pt=Be,pt.setIndex(Mt)),z.isMesh)$.wireframe===!0?(we.setLineWidth($.wireframeLinewidth*Kt()),pt.setMode(U.LINES)):pt.setMode(U.TRIANGLES);else if(z.isLine){let Fe=$.linewidth;Fe===void 0&&(Fe=1),we.setLineWidth(Fe*Kt()),z.isLineSegments?pt.setMode(U.LINES):z.isLineLoop?pt.setMode(U.LINE_LOOP):pt.setMode(U.LINE_STRIP)}else z.isPoints?pt.setMode(U.POINTS):z.isSprite&&pt.setMode(U.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)Ks("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),pt.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(We.get("WEBGL_multi_draw"))pt.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{let Fe=z._multiDrawStarts,At=z._multiDrawCounts,rt=z._multiDrawCount,fn=ye?L.get(ye).bytesPerElement:1,Rs=Te.get($).currentProgram.getUniforms();for(let pn=0;pn<rt;pn++)Rs.setValue(U,"_gl_DrawID",pn),pt.render(Fe[pn]/fn,At[pn])}else if(z.isInstancedMesh)pt.renderInstances(Qe,Lt,z.count);else if(W.isInstancedBufferGeometry){let Fe=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,At=Math.min(W.instanceCount,Fe);pt.renderInstances(Qe,Lt,At)}else pt.render(Qe,Lt)};function gt(T,k,W){T.transparent===!0&&T.side===en&&T.forceSinglePass===!1?(T.side=Ht,T.needsUpdate=!0,qa(T,k,W),T.side=di,T.needsUpdate=!0,qa(T,k,W),T.side=en):qa(T,k,W)}this.compile=function(T,k,W=null){W===null&&(W=T),p=De.get(W),p.init(k),b.push(p),W.traverseVisible(function(z){z.isLight&&z.layers.test(k.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),T!==W&&T.traverseVisible(function(z){z.isLight&&z.layers.test(k.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),p.setupLights();let $=new Set;return T.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;let re=z.material;if(re)if(Array.isArray(re))for(let me=0;me<re.length;me++){let Se=re[me];gt(Se,W,z),$.add(Se)}else gt(re,W,z),$.add(re)}),p=b.pop(),$},this.compileAsync=function(T,k,W=null){let $=this.compile(T,k,W);return new Promise(z=>{function re(){if($.forEach(function(me){Te.get(me).currentProgram.isReady()&&$.delete(me)}),$.size===0){z(T);return}setTimeout(re,10)}We.get("KHR_parallel_shader_compile")!==null?re():setTimeout(re,10)})};let at=null;function si(T){at&&at(T)}function Wn(){Gi.stop()}function Du(){Gi.start()}let Gi=new tp;Gi.setAnimationLoop(si),typeof self<"u"&&Gi.setContext(self),this.setAnimationLoop=function(T){at=T,oe.setAnimationLoop(T),T===null?Gi.stop():Gi.start()},oe.addEventListener("sessionstart",Wn),oe.addEventListener("sessionend",Du),this.render=function(T,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),oe.enabled===!0&&oe.isPresenting===!0&&(oe.cameraAutoUpdate===!0&&oe.updateCamera(k),k=oe.getCamera()),T.isScene===!0&&T.onBeforeRender(_,T,k,R),p=De.get(T,b.length),p.init(k),b.push(p),ne.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),ht.setFromProjectionMatrix(ne,Ln,k.reversedDepth),j=this.localClippingEnabled,st=ce.init(this.clippingPlanes,j),g=Y.get(T,v.length),g.init(),v.push(g),oe.enabled===!0&&oe.isPresenting===!0){let re=_.xr.getDepthSensingMesh();re!==null&&Rc(re,k,-1/0,_.sortObjects)}Rc(T,k,0,_.sortObjects),g.finish(),_.sortObjects===!0&&g.sort(V,ie),et=oe.enabled===!1||oe.isPresenting===!1||oe.hasDepthSensing()===!1,et&&Ce.addToRenderList(g,T),this.info.render.frame++,st===!0&&ce.beginShadows();let W=p.state.shadowsArray;Re.render(W,T,k),st===!0&&ce.endShadows(),this.info.autoReset===!0&&this.info.reset();let $=g.opaque,z=g.transmissive;if(p.setupLights(),k.isArrayCamera){let re=k.cameras;if(z.length>0)for(let me=0,Se=re.length;me<Se;me++){let ye=re[me];Nu($,z,T,ye)}et&&Ce.render(T);for(let me=0,Se=re.length;me<Se;me++){let ye=re[me];Uu(g,T,ye,ye.viewport)}}else z.length>0&&Nu($,z,T,k),et&&Ce.render(T),Uu(g,T,k);R!==null&&A===0&&(Ye.updateMultisampleRenderTarget(R),Ye.updateRenderTargetMipmap(R)),T.isScene===!0&&T.onAfterRender(_,T,k),pe.resetDefaultState(),M=-1,y=null,b.pop(),b.length>0?(p=b[b.length-1],st===!0&&ce.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,v.pop(),v.length>0?g=v[v.length-1]:g=null};function Rc(T,k,W,$){if(T.visible===!1)return;if(T.layers.test(k.layers)){if(T.isGroup)W=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(k);else if(T.isLight)p.pushLight(T),T.castShadow&&p.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||ht.intersectsSprite(T)){$&&He.setFromMatrixPosition(T.matrixWorld).applyMatrix4(ne);let me=G.update(T),Se=T.material;Se.visible&&g.push(T,me,Se,W,He.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||ht.intersectsObject(T))){let me=G.update(T),Se=T.material;if($&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),He.copy(T.boundingSphere.center)):(me.boundingSphere===null&&me.computeBoundingSphere(),He.copy(me.boundingSphere.center)),He.applyMatrix4(T.matrixWorld).applyMatrix4(ne)),Array.isArray(Se)){let ye=me.groups;for(let Oe=0,ze=ye.length;Oe<ze;Oe++){let Ne=ye[Oe],Qe=Se[Ne.materialIndex];Qe&&Qe.visible&&g.push(T,me,Qe,W,He.z,Ne)}}else Se.visible&&g.push(T,me,Se,W,He.z,null)}}let re=T.children;for(let me=0,Se=re.length;me<Se;me++)Rc(re[me],k,W,$)}function Uu(T,k,W,$){let z=T.opaque,re=T.transmissive,me=T.transparent;p.setupLightsView(W),st===!0&&ce.setGlobalState(_.clippingPlanes,W),$&&we.viewport(P.copy($)),z.length>0&&Xa(z,k,W),re.length>0&&Xa(re,k,W),me.length>0&&Xa(me,k,W),we.buffers.depth.setTest(!0),we.buffers.depth.setMask(!0),we.buffers.color.setMask(!0),we.setPolygonOffset(!1)}function Nu(T,k,W,$){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[$.id]===void 0&&(p.state.transmissionRenderTarget[$.id]=new $n(1,1,{generateMipmaps:!0,type:We.has("EXT_color_buffer_half_float")||We.has("EXT_color_buffer_float")?cr:Bn,minFilter:Ni,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));let re=p.state.transmissionRenderTarget[$.id],me=$.viewport||P;re.setSize(me.z*_.transmissionResolutionScale,me.w*_.transmissionResolutionScale);let Se=_.getRenderTarget(),ye=_.getActiveCubeFace(),Oe=_.getActiveMipmapLevel();_.setRenderTarget(re),_.getClearColor(H),X=_.getClearAlpha(),X<1&&_.setClearColor(16777215,.5),_.clear(),et&&Ce.render(W);let ze=_.toneMapping;_.toneMapping=Mi;let Ne=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),p.setupLightsView($),st===!0&&ce.setGlobalState(_.clippingPlanes,$),Xa(T,W,$),Ye.updateMultisampleRenderTarget(re),Ye.updateRenderTargetMipmap(re),We.has("WEBGL_multisampled_render_to_texture")===!1){let Qe=!1;for(let ut=0,Lt=k.length;ut<Lt;ut++){let Mt=k[ut],pt=Mt.object,Fe=Mt.geometry,At=Mt.material,rt=Mt.group;if(At.side===en&&pt.layers.test($.layers)){let fn=At.side;At.side=Ht,At.needsUpdate=!0,Fu(pt,W,$,Fe,At,rt),At.side=fn,At.needsUpdate=!0,Qe=!0}}Qe===!0&&(Ye.updateMultisampleRenderTarget(re),Ye.updateRenderTargetMipmap(re))}_.setRenderTarget(Se,ye,Oe),_.setClearColor(H,X),Ne!==void 0&&($.viewport=Ne),_.toneMapping=ze}function Xa(T,k,W){let $=k.isScene===!0?k.overrideMaterial:null;for(let z=0,re=T.length;z<re;z++){let me=T[z],Se=me.object,ye=me.geometry,Oe=me.group,ze=me.material;ze.allowOverride===!0&&$!==null&&(ze=$),Se.layers.test(W.layers)&&Fu(Se,k,W,ye,ze,Oe)}}function Fu(T,k,W,$,z,re){T.onBeforeRender(_,k,W,$,z,re),T.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),z.onBeforeRender(_,k,W,$,T,re),z.transparent===!0&&z.side===en&&z.forceSinglePass===!1?(z.side=Ht,z.needsUpdate=!0,_.renderBufferDirect(W,k,$,z,T,re),z.side=di,z.needsUpdate=!0,_.renderBufferDirect(W,k,$,z,T,re),z.side=en):_.renderBufferDirect(W,k,$,z,T,re),T.onAfterRender(_,k,W,$,z,re)}function qa(T,k,W){k.isScene!==!0&&(k=Ue);let $=Te.get(T),z=p.state.lights,re=p.state.shadowsArray,me=z.state.version,Se=K.getParameters(T,z.state,re,k,W),ye=K.getProgramCacheKey(Se),Oe=$.programs;$.environment=T.isMeshStandardMaterial?k.environment:null,$.fog=k.fog,$.envMap=(T.isMeshStandardMaterial?Dt:Xt).get(T.envMap||$.environment),$.envMapRotation=$.environment!==null&&T.envMap===null?k.environmentRotation:T.envMapRotation,Oe===void 0&&(T.addEventListener("dispose",Q),Oe=new Map,$.programs=Oe);let ze=Oe.get(ye);if(ze!==void 0){if($.currentProgram===ze&&$.lightsStateVersion===me)return Bu(T,Se),ze}else Se.uniforms=K.getUniforms(T),T.onBeforeCompile(Se,_),ze=K.acquireProgram(Se,ye),Oe.set(ye,ze),$.uniforms=Se.uniforms;let Ne=$.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ne.clippingPlanes=ce.uniform),Bu(T,Se),$.needsLights=Mm(T),$.lightsStateVersion=me,$.needsLights&&(Ne.ambientLightColor.value=z.state.ambient,Ne.lightProbe.value=z.state.probe,Ne.directionalLights.value=z.state.directional,Ne.directionalLightShadows.value=z.state.directionalShadow,Ne.spotLights.value=z.state.spot,Ne.spotLightShadows.value=z.state.spotShadow,Ne.rectAreaLights.value=z.state.rectArea,Ne.ltc_1.value=z.state.rectAreaLTC1,Ne.ltc_2.value=z.state.rectAreaLTC2,Ne.pointLights.value=z.state.point,Ne.pointLightShadows.value=z.state.pointShadow,Ne.hemisphereLights.value=z.state.hemi,Ne.directionalShadowMap.value=z.state.directionalShadowMap,Ne.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Ne.spotShadowMap.value=z.state.spotShadowMap,Ne.spotLightMatrix.value=z.state.spotLightMatrix,Ne.spotLightMap.value=z.state.spotLightMap,Ne.pointShadowMap.value=z.state.pointShadowMap,Ne.pointShadowMatrix.value=z.state.pointShadowMatrix),$.currentProgram=ze,$.uniformsList=null,ze}function Ou(T){if(T.uniformsList===null){let k=T.currentProgram.getUniforms();T.uniformsList=pr.seqWithValue(k.seq,T.uniforms)}return T.uniformsList}function Bu(T,k){let W=Te.get(T);W.outputColorSpace=k.outputColorSpace,W.batching=k.batching,W.batchingColor=k.batchingColor,W.instancing=k.instancing,W.instancingColor=k.instancingColor,W.instancingMorph=k.instancingMorph,W.skinning=k.skinning,W.morphTargets=k.morphTargets,W.morphNormals=k.morphNormals,W.morphColors=k.morphColors,W.morphTargetsCount=k.morphTargetsCount,W.numClippingPlanes=k.numClippingPlanes,W.numIntersection=k.numClipIntersection,W.vertexAlphas=k.vertexAlphas,W.vertexTangents=k.vertexTangents,W.toneMapping=k.toneMapping}function _m(T,k,W,$,z){k.isScene!==!0&&(k=Ue),Ye.resetTextureUnits();let re=k.fog,me=$.isMeshStandardMaterial?k.environment:null,Se=R===null?_.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Ji,ye=($.isMeshStandardMaterial?Dt:Xt).get($.envMap||me),Oe=$.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,ze=!!W.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),Ne=!!W.morphAttributes.position,Qe=!!W.morphAttributes.normal,ut=!!W.morphAttributes.color,Lt=Mi;$.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(Lt=_.toneMapping);let Mt=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,pt=Mt!==void 0?Mt.length:0,Fe=Te.get($),At=p.state.lights;if(st===!0&&(j===!0||T!==y)){let nn=T===y&&$.id===M;ce.setState($,T,nn)}let rt=!1;$.version===Fe.__version?(Fe.needsLights&&Fe.lightsStateVersion!==At.state.version||Fe.outputColorSpace!==Se||z.isBatchedMesh&&Fe.batching===!1||!z.isBatchedMesh&&Fe.batching===!0||z.isBatchedMesh&&Fe.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&Fe.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&Fe.instancing===!1||!z.isInstancedMesh&&Fe.instancing===!0||z.isSkinnedMesh&&Fe.skinning===!1||!z.isSkinnedMesh&&Fe.skinning===!0||z.isInstancedMesh&&Fe.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Fe.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Fe.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Fe.instancingMorph===!1&&z.morphTexture!==null||Fe.envMap!==ye||$.fog===!0&&Fe.fog!==re||Fe.numClippingPlanes!==void 0&&(Fe.numClippingPlanes!==ce.numPlanes||Fe.numIntersection!==ce.numIntersection)||Fe.vertexAlphas!==Oe||Fe.vertexTangents!==ze||Fe.morphTargets!==Ne||Fe.morphNormals!==Qe||Fe.morphColors!==ut||Fe.toneMapping!==Lt||Fe.morphTargetsCount!==pt)&&(rt=!0):(rt=!0,Fe.__version=$.version);let fn=Fe.currentProgram;rt===!0&&(fn=qa($,k,z));let Rs=!1,pn=!1,Tr=!1,Rt=fn.getUniforms(),bn=Fe.uniforms;if(we.useProgram(fn.program)&&(Rs=!0,pn=!0,Tr=!0),$.id!==M&&(M=$.id,pn=!0),Rs||y!==T){we.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),Rt.setValue(U,"projectionMatrix",T.projectionMatrix),Rt.setValue(U,"viewMatrix",T.matrixWorldInverse);let ln=Rt.map.cameraPosition;ln!==void 0&&ln.setValue(U,be.setFromMatrixPosition(T.matrixWorld)),ke.logarithmicDepthBuffer&&Rt.setValue(U,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&Rt.setValue(U,"isOrthographic",T.isOrthographicCamera===!0),y!==T&&(y=T,pn=!0,Tr=!0)}if(z.isSkinnedMesh){Rt.setOptional(U,z,"bindMatrix"),Rt.setOptional(U,z,"bindMatrixInverse");let nn=z.skeleton;nn&&(nn.boneTexture===null&&nn.computeBoneTexture(),Rt.setValue(U,"boneTexture",nn.boneTexture,Ye))}z.isBatchedMesh&&(Rt.setOptional(U,z,"batchingTexture"),Rt.setValue(U,"batchingTexture",z._matricesTexture,Ye),Rt.setOptional(U,z,"batchingIdTexture"),Rt.setValue(U,"batchingIdTexture",z._indirectTexture,Ye),Rt.setOptional(U,z,"batchingColorTexture"),z._colorsTexture!==null&&Rt.setValue(U,"batchingColorTexture",z._colorsTexture,Ye));let Sn=W.morphAttributes;if((Sn.position!==void 0||Sn.normal!==void 0||Sn.color!==void 0)&&ae.update(z,W,fn),(pn||Fe.receiveShadow!==z.receiveShadow)&&(Fe.receiveShadow=z.receiveShadow,Rt.setValue(U,"receiveShadow",z.receiveShadow)),$.isMeshGouraudMaterial&&$.envMap!==null&&(bn.envMap.value=ye,bn.flipEnvMap.value=ye.isCubeTexture&&ye.isRenderTargetTexture===!1?-1:1),$.isMeshStandardMaterial&&$.envMap===null&&k.environment!==null&&(bn.envMapIntensity.value=k.environmentIntensity),pn&&(Rt.setValue(U,"toneMappingExposure",_.toneMappingExposure),Fe.needsLights&&vm(bn,Tr),re&&$.fog===!0&&te.refreshFogUniforms(bn,re),te.refreshMaterialUniforms(bn,$,O,ee,p.state.transmissionRenderTarget[T.id]),pr.upload(U,Ou(Fe),bn,Ye)),$.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(pr.upload(U,Ou(Fe),bn,Ye),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&Rt.setValue(U,"center",z.center),Rt.setValue(U,"modelViewMatrix",z.modelViewMatrix),Rt.setValue(U,"normalMatrix",z.normalMatrix),Rt.setValue(U,"modelMatrix",z.matrixWorld),$.isShaderMaterial||$.isRawShaderMaterial){let nn=$.uniformsGroups;for(let ln=0,Cc=nn.length;ln<Cc;ln++){let Vi=nn[ln];qe.update(Vi,fn),qe.bind(Vi,fn)}}return fn}function vm(T,k){T.ambientLightColor.needsUpdate=k,T.lightProbe.needsUpdate=k,T.directionalLights.needsUpdate=k,T.directionalLightShadows.needsUpdate=k,T.pointLights.needsUpdate=k,T.pointLightShadows.needsUpdate=k,T.spotLights.needsUpdate=k,T.spotLightShadows.needsUpdate=k,T.rectAreaLights.needsUpdate=k,T.hemisphereLights.needsUpdate=k}function Mm(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(T,k,W){let $=Te.get(T);$.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,$.__autoAllocateDepthBuffer===!1&&($.__useRenderToTexture=!1),Te.get(T.texture).__webglTexture=k,Te.get(T.depthTexture).__webglTexture=$.__autoAllocateDepthBuffer?void 0:W,$.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,k){let W=Te.get(T);W.__webglFramebuffer=k,W.__useDefaultFramebuffer=k===void 0};let bm=U.createFramebuffer();this.setRenderTarget=function(T,k=0,W=0){R=T,S=k,A=W;let $=!0,z=null,re=!1,me=!1;if(T){let ye=Te.get(T);if(ye.__useDefaultFramebuffer!==void 0)we.bindFramebuffer(U.FRAMEBUFFER,null),$=!1;else if(ye.__webglFramebuffer===void 0)Ye.setupRenderTarget(T);else if(ye.__hasExternalTextures)Ye.rebindTextures(T,Te.get(T.texture).__webglTexture,Te.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let Ne=T.depthTexture;if(ye.__boundDepthTexture!==Ne){if(Ne!==null&&Te.has(Ne)&&(T.width!==Ne.image.width||T.height!==Ne.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ye.setupDepthRenderbuffer(T)}}let Oe=T.texture;(Oe.isData3DTexture||Oe.isDataArrayTexture||Oe.isCompressedArrayTexture)&&(me=!0);let ze=Te.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(ze[k])?z=ze[k][W]:z=ze[k],re=!0):T.samples>0&&Ye.useMultisampledRTT(T)===!1?z=Te.get(T).__webglMultisampledFramebuffer:Array.isArray(ze)?z=ze[W]:z=ze,P.copy(T.viewport),N.copy(T.scissor),B=T.scissorTest}else P.copy(xe).multiplyScalar(O).floor(),N.copy(Le).multiplyScalar(O).floor(),B=it;if(W!==0&&(z=bm),we.bindFramebuffer(U.FRAMEBUFFER,z)&&$&&we.drawBuffers(T,z),we.viewport(P),we.scissor(N),we.setScissorTest(B),re){let ye=Te.get(T.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+k,ye.__webglTexture,W)}else if(me){let ye=k;for(let Oe=0;Oe<T.textures.length;Oe++){let ze=Te.get(T.textures[Oe]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Oe,ze.__webglTexture,W,ye)}}else if(T!==null&&W!==0){let ye=Te.get(T.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,ye.__webglTexture,W)}M=-1},this.readRenderTargetPixels=function(T,k,W,$,z,re,me,Se=0){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=Te.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&me!==void 0&&(ye=ye[me]),ye){we.bindFramebuffer(U.FRAMEBUFFER,ye);try{let Oe=T.textures[Se],ze=Oe.format,Ne=Oe.type;if(!ke.textureFormatReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ke.textureTypeReadable(Ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=T.width-$&&W>=0&&W<=T.height-z&&(T.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Se),U.readPixels(k,W,$,z,Ie.convert(ze),Ie.convert(Ne),re))}finally{let Oe=R!==null?Te.get(R).__webglFramebuffer:null;we.bindFramebuffer(U.FRAMEBUFFER,Oe)}}},this.readRenderTargetPixelsAsync=async function(T,k,W,$,z,re,me,Se=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=Te.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&me!==void 0&&(ye=ye[me]),ye)if(k>=0&&k<=T.width-$&&W>=0&&W<=T.height-z){we.bindFramebuffer(U.FRAMEBUFFER,ye);let Oe=T.textures[Se],ze=Oe.format,Ne=Oe.type;if(!ke.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ke.textureTypeReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Qe=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Qe),U.bufferData(U.PIXEL_PACK_BUFFER,re.byteLength,U.STREAM_READ),T.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Se),U.readPixels(k,W,$,z,Ie.convert(ze),Ie.convert(Ne),0);let ut=R!==null?Te.get(R).__webglFramebuffer:null;we.bindFramebuffer(U.FRAMEBUFFER,ut);let Lt=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Sf(U,Lt,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Qe),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,re),U.deleteBuffer(Qe),U.deleteSync(Lt),re}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,k=null,W=0){let $=Math.pow(2,-W),z=Math.floor(T.image.width*$),re=Math.floor(T.image.height*$),me=k!==null?k.x:0,Se=k!==null?k.y:0;Ye.setTexture2D(T,0),U.copyTexSubImage2D(U.TEXTURE_2D,W,0,0,me,Se,z,re),we.unbindTexture()};let Sm=U.createFramebuffer(),Em=U.createFramebuffer();this.copyTextureToTexture=function(T,k,W=null,$=null,z=0,re=null){re===null&&(z!==0?(Ks("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),re=z,z=0):re=0);let me,Se,ye,Oe,ze,Ne,Qe,ut,Lt,Mt=T.isCompressedTexture?T.mipmaps[re]:T.image;if(W!==null)me=W.max.x-W.min.x,Se=W.max.y-W.min.y,ye=W.isBox3?W.max.z-W.min.z:1,Oe=W.min.x,ze=W.min.y,Ne=W.isBox3?W.min.z:0;else{let Sn=Math.pow(2,-z);me=Math.floor(Mt.width*Sn),Se=Math.floor(Mt.height*Sn),T.isDataArrayTexture?ye=Mt.depth:T.isData3DTexture?ye=Math.floor(Mt.depth*Sn):ye=1,Oe=0,ze=0,Ne=0}$!==null?(Qe=$.x,ut=$.y,Lt=$.z):(Qe=0,ut=0,Lt=0);let pt=Ie.convert(k.format),Fe=Ie.convert(k.type),At;k.isData3DTexture?(Ye.setTexture3D(k,0),At=U.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(Ye.setTexture2DArray(k,0),At=U.TEXTURE_2D_ARRAY):(Ye.setTexture2D(k,0),At=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,k.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,k.unpackAlignment);let rt=U.getParameter(U.UNPACK_ROW_LENGTH),fn=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Rs=U.getParameter(U.UNPACK_SKIP_PIXELS),pn=U.getParameter(U.UNPACK_SKIP_ROWS),Tr=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,Mt.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Mt.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Oe),U.pixelStorei(U.UNPACK_SKIP_ROWS,ze),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Ne);let Rt=T.isDataArrayTexture||T.isData3DTexture,bn=k.isDataArrayTexture||k.isData3DTexture;if(T.isDepthTexture){let Sn=Te.get(T),nn=Te.get(k),ln=Te.get(Sn.__renderTarget),Cc=Te.get(nn.__renderTarget);we.bindFramebuffer(U.READ_FRAMEBUFFER,ln.__webglFramebuffer),we.bindFramebuffer(U.DRAW_FRAMEBUFFER,Cc.__webglFramebuffer);for(let Vi=0;Vi<ye;Vi++)Rt&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Te.get(T).__webglTexture,z,Ne+Vi),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Te.get(k).__webglTexture,re,Lt+Vi)),U.blitFramebuffer(Oe,ze,me,Se,Qe,ut,me,Se,U.DEPTH_BUFFER_BIT,U.NEAREST);we.bindFramebuffer(U.READ_FRAMEBUFFER,null),we.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(z!==0||T.isRenderTargetTexture||Te.has(T)){let Sn=Te.get(T),nn=Te.get(k);we.bindFramebuffer(U.READ_FRAMEBUFFER,Sm),we.bindFramebuffer(U.DRAW_FRAMEBUFFER,Em);for(let ln=0;ln<ye;ln++)Rt?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Sn.__webglTexture,z,Ne+ln):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Sn.__webglTexture,z),bn?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,nn.__webglTexture,re,Lt+ln):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,nn.__webglTexture,re),z!==0?U.blitFramebuffer(Oe,ze,me,Se,Qe,ut,me,Se,U.COLOR_BUFFER_BIT,U.NEAREST):bn?U.copyTexSubImage3D(At,re,Qe,ut,Lt+ln,Oe,ze,me,Se):U.copyTexSubImage2D(At,re,Qe,ut,Oe,ze,me,Se);we.bindFramebuffer(U.READ_FRAMEBUFFER,null),we.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else bn?T.isDataTexture||T.isData3DTexture?U.texSubImage3D(At,re,Qe,ut,Lt,me,Se,ye,pt,Fe,Mt.data):k.isCompressedArrayTexture?U.compressedTexSubImage3D(At,re,Qe,ut,Lt,me,Se,ye,pt,Mt.data):U.texSubImage3D(At,re,Qe,ut,Lt,me,Se,ye,pt,Fe,Mt):T.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,re,Qe,ut,me,Se,pt,Fe,Mt.data):T.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,re,Qe,ut,Mt.width,Mt.height,pt,Mt.data):U.texSubImage2D(U.TEXTURE_2D,re,Qe,ut,me,Se,pt,Fe,Mt);U.pixelStorei(U.UNPACK_ROW_LENGTH,rt),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,fn),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Rs),U.pixelStorei(U.UNPACK_SKIP_ROWS,pn),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Tr),re===0&&k.generateMipmaps&&U.generateMipmap(At),we.unbindTexture()},this.initRenderTarget=function(T){Te.get(T).__webglFramebuffer===void 0&&Ye.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?Ye.setTextureCube(T,0):T.isData3DTexture?Ye.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?Ye.setTexture2DArray(T,0):Ye.setTexture2D(T,0),we.unbindTexture()},this.resetState=function(){S=0,A=0,R=null,we.reset(),pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ln}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}};var Ra=new D;function An(i,e,t,n,s,r){let a=2*Math.PI*s/4,o=Math.max(r-2*s,0),c=Math.PI/4;Ra.copy(e),Ra[n]=0,Ra.normalize();let l=.5*a/(a+o),h=1-Ra.angleTo(i)/c;return Math.sign(Ra[t])===1?h*l:o/(a+o)+l+l*(1-h)}var Ca=class i extends yt{constructor(e=1,t=1,n=1,s=2,r=.1){let a=s*2+1;if(r=Math.min(e/2,t/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:n,segments:s,radius:r},a===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let c=new D,l=new D,h=new D(e,t,n).divideScalar(2).subScalar(r),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,m=u.length/6,x=new D,g=.5/a;for(let p=0,v=0;p<u.length;p+=3,v+=2)switch(c.fromArray(u,p),l.copy(c),l.x-=Math.sign(l.x)*g,l.y-=Math.sign(l.y)*g,l.z-=Math.sign(l.z)*g,l.normalize(),u[p+0]=h.x*Math.sign(c.x)+l.x*r,u[p+1]=h.y*Math.sign(c.y)+l.y*r,u[p+2]=h.z*Math.sign(c.z)+l.z*r,d[p+0]=l.x,d[p+1]=l.y,d[p+2]=l.z,Math.floor(p/m)){case 0:x.set(1,0,0),f[v+0]=An(x,l,"z","y",r,n),f[v+1]=1-An(x,l,"y","z",r,t);break;case 1:x.set(-1,0,0),f[v+0]=1-An(x,l,"z","y",r,n),f[v+1]=1-An(x,l,"y","z",r,t);break;case 2:x.set(0,1,0),f[v+0]=1-An(x,l,"x","z",r,e),f[v+1]=An(x,l,"z","x",r,n);break;case 3:x.set(0,-1,0),f[v+0]=1-An(x,l,"x","z",r,e),f[v+1]=1-An(x,l,"z","x",r,n);break;case 4:x.set(0,0,1),f[v+0]=1-An(x,l,"x","y",r,e),f[v+1]=1-An(x,l,"y","x",r,t);break;case 5:x.set(0,0,-1),f[v+0]=An(x,l,"x","y",r,e),f[v+1]=1-An(x,l,"y","x",r,t);break}}static fromJSON(e){return new i(e.width,e.height,e.depth,e.segments,e.radius)}};function ec(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,c=new je,l=0;for(let h=0;h<i.length;++h){let u=i[h],d=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(e){let f;if(t)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(t){let h=0,u=[];for(let d=0;d<i.length;++d){let f=i[d].index;for(let m=0;m<f.count;++m)u.push(f.getX(m)+h);h+=i[d].attributes.position.count}c.setIndex(u)}for(let h in r){let u=ap(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(let h in a){let u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){let f=[];for(let x=0;x<a[h].length;++x)f.push(a[h][x][d]);let m=ap(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(m)}}return c}function ap(i){let e,t,n,s=-1,r=0;for(let l=0;l<i.length;++l){let h=i[l];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let a=new e(r),o=new Ut(a,t,n),c=0;for(let l=0;l<i.length;++l){let h=i[l];if(h.isInterleavedBufferAttribute){let u=c/t;for(let d=0,f=h.count;d<f;d++)for(let m=0;m<t;m++){let x=h.getComponent(d,m);o.setComponent(d+u,m,x)}}else a.set(h.array,c);c+=h.count*t}return s!==void 0&&(o.gpuType=s),o}var gr=(i,e,t)=>Math.max(e,Math.min(t,i));function op(i=0,e=0){return{lane:i,velocity:0,distance:e,wheelAngle:0,lastSpeed:0,roll:0,pitch:0,steer:0,phase:0,bob:0,braking:!1}}function lp(i,e,t,n,s,r=!1){if(r||s<=0)return i;s=Math.min(s,.1);let a=24,o=i.lane-e,c=i.velocity+a*o,l=Math.exp(-a*s);i.lane=e+(o+c*s)*l,i.velocity=(i.velocity-a*c*s)*l,Math.abs(i.lane)>1&&(i.lane=gr(i.lane,-1,1),i.velocity=0);let h=Math.max(0,t-i.distance);i.distance=t,i.wheelAngle=(i.wheelAngle+h/.43)%(Math.PI*2);let u=gr((n-i.lastSpeed)/s,-24,16);i.lastSpeed=n,i.braking=u<-2||n<.4;let d=1-Math.exp(-12*s),f=gr(n/20,0,1);return i.steer+=(gr(-i.velocity*3.35/Math.max(8,n),-.38,.38)-i.steer)*d,i.roll+=(gr(i.velocity*.023,-.105,.105)*f-i.roll)*d,i.pitch+=(gr(-u*.0025,-.04,.06)-i.pitch)*d,i.phase+=h*1.05,i.bob=Math.sin(i.phase)*.018*f,i}function tc(i){return{start:i.start-30,end:i.end+40}}function Pv(i){let e=[],t=[],n=[],s=[],r=(a,o,c)=>a+(o-a)*c;for(let a=0;a<i.length-1;a++){let o=i[a],c=i[a+1],l=[];for(let u=0;u<o.intervals.length;u++)for(let d=0;d<2;d++)l.push({a:o.intervals[u][d],b:c.intervals[u][d],id:u,side:d});let h=[0,1];for(let u=0;u<l.length;u++)for(let d=u+1;d<l.length;d++){let f=l[u],m=l[d],x=f.b-f.a-(m.b-m.a);if(Math.abs(x)>1e-9){let g=(m.a-f.a)/x;g>1e-7&&g<1-1e-7&&h.push(g)}}h.sort((u,d)=>u-d);for(let u=0;u<h.length-1;u++){let d=h[u],f=h[u+1];if(f-d<1e-7)continue;let m=(d+f)/2,x=b=>r(o.at,c.at,b),g=(b,_)=>r(b.a,b.b,_),p=o.intervals.map((b,_)=>({left:l[_*2],right:l[_*2+1]})).sort((b,_)=>g(b.left,m)-g(_.left,m)),v=[];for(let b of p){let _=v.at(-1);_&&g(b.left,m)<=g(_.right,m)+1e-8?g(b.right,m)>g(_.right,m)&&(_.right=b.right):v.push({...b})}for(let b of v){let _=[[g(b.left,d),x(d)],[g(b.right,d),x(d)],[g(b.left,f),x(f)],[g(b.right,f),x(f)]],C=e.length/3;for(let[S,A]of _)e.push(S,0,-A),t.push(S/10.8,A/20);n.push(C,C+1,C+2,C+2,C+1,C+3),s.push([_[0],_[2]],[_[1],_[3]])}}}return{positions:e,uvs:t,indices:n,edges:s}}function cp(i,e,t,n){let s=i[0],r=tc(s),a=new Set([r.start,s.start,s.end,r.end]);for(let l=r.start;l<r.end;l+=2)a.add(l);let o=l=>l*l*l*(10+l*(-15+6*l)),c=[...a].sort((l,h)=>l-h).map(l=>{let h,u;if(l<s.start){let f=o((l-r.start)/30);h=[-3.35,0,3.35],u=8.2-2.8*f}else if(l>s.end){let f=o((l-s.end)/40);h=[-3.35,0,3.35],u=5.4+2.8*f}else h=i.map(f=>f.lane*3.35+t(f,l)),u=5.4;let d=e(l)-e(n);return{at:l-n,intervals:h.map(f=>[d+f-u,d+f+u])}});return{...Pv(c),rows:c,bounds:r}}var nc=Object.freeze([Object.freeze({kind:"loop",start:102,end:136,radius:9.5,shift:10,settle:26}),Object.freeze({kind:"corkscrew",start:174,end:208}),Object.freeze({kind:"helix",start:216,end:252,radius:14,bank:1.1})]),Ia=i=>(i=Math.max(0,Math.min(1,i)),i*i*i*(10+i*(-15+6*i))),Lv=(i,e)=>(i-e.start)/(e.end-e.start);function Dv(i,e=!1){return e&&i>4?4+(i-4)*.4:i}function Uv(i,e,t=!1){let n={forward:0,lateral:0,up:0,roll:0};if(t)return n;for(let s of nc){let r=Lv(i,s);if(s.kind==="loop"){if(r>0&&r<1){let o=2*Math.PI*Ia(r);n.forward+=s.radius*Math.sin(o),n.up+=s.radius*(1-Math.cos(o))}let a=(s.end+s.settle-i)/s.settle;r>0&&(n.lateral+=e*s.shift*Math.min(Ia(r),Ia(a)))}else if(s.kind==="corkscrew")r>0&&r<1&&(n.roll+=-e*2*Math.PI*Ia(r));else if(s.kind==="helix"&&r>0&&r<1){let a=2*Math.PI*Ia(r);n.forward+=s.radius*Math.sin(a),n.lateral+=e*s.radius*(1-Math.cos(a)),n.roll+=-e*s.bank*Math.sin(Math.PI*r)**2}}return n}function Nv(i,e,t=!1){if(t)return 0;let n=3,s=(i(e+n)-2*i(e)+i(e-n))/(n*n);return Math.max(-.34,Math.min(.34,-s*55))}var eu=(i,e)=>[i[0]-e[0],i[1]-e[1],i[2]-e[2]],us=(i,e,t=1)=>[i[0]+e[0]*t,i[1]+e[1]*t,i[2]+e[2]*t],tu=(i,e)=>i[0]*e[0]+i[1]*e[1]+i[2]*e[2],Fv=(i,e)=>[i[1]*e[2]-i[2]*e[1],i[2]*e[0]-i[0]*e[2],i[0]*e[1]-i[1]*e[0]],xr=i=>{let e=Math.hypot(...i)||1;return[i[0]/e,i[1]/e,i[2]/e]};function hp({route:i,curve:e,offset:t,height:n,origin:s,span:r,reduced:a=!1,step:o=.5}){let c=d=>e(d)-e(s)+i.lane*3.35+t(i,d),l=d=>[c(d),Dv(n(i,d),a),-(d-s)],h=d=>(d-i.start)*r/(i.end-i.start),u=[];for(let d=i.start;d<=i.end+1e-6;d+=o){let f=l(d),m=l(d+.25),x=l(d-.25),g=xr([m[0]-x[0],0,m[2]-x[2]]),p=[-g[2],0,g[0]],v=Uv(h(d),i.side,a),b=h(d),_=nc.find(S=>b>S.start-6&&b<S.end+(S.settle||6))?.kind||null,C=us(us(us(f,g,v.forward),p,v.lateral),[0,1,0],v.up);u.push({at:d,u:b,kind:_,p:C,baseSide:p,detour:Math.hypot(v.forward,v.lateral,v.up),roll:Nv(c,d,a)+v.roll,inDetour:Math.abs(v.forward)+Math.abs(v.lateral)+Math.abs(v.up)+Math.abs(v.roll)>.01})}return u.forEach((d,f)=>{let m=u[Math.min(u.length-1,f+1)].p,x=u[Math.max(0,f-1)].p;d.t=xr(eu(m,x));let g=d.kind==="loop"?d.baseSide:[-d.t[2],0,d.t[0]];d.l=xr(eu(g,[d.t[0]*tu(g,d.t),d.t[1]*tu(g,d.t),d.t[2]*tu(g,d.t)])),d.n=Fv(d.l,d.t);let p=Math.cos(d.roll),v=Math.sin(d.roll);d.right=[d.l[0]*p+d.n[0]*v,d.l[1]*p+d.n[1]*v,d.l[2]*p+d.n[2]*v],d.up=[-d.l[0]*v+d.n[0]*p,-d.l[1]*v+d.n[1]*p,-d.l[2]*v+d.n[2]*p],d.pivot=i.side*3.2/2,d.axis=us(us(d.p,d.l,d.pivot),d.n,.9),d.speed=f<u.length-1?Math.hypot(...eu(u[f+1].p,d.p))/o:1}),u}function nu(i,e,t=0,n=0){return us(us(i.axis,i.right,e+t-i.pivot),i.up,n-.9)}function iu(i,e,t){let n=[],s=[],r=e.length;for(let a of i)for(let[o,c]of e)n.push(...nu(a,t,o,c));for(let a=0;a<i.length-1;a++)for(let o=0;o<r;o++){let c=a*r+o,l=a*r+(o+1)%r,h=c+r,u=l+r;s.push(c,h,l,l,h,u)}return{positions:n,indices:s}}var up=[[-1.2,0],[1.2,0],[1.2,-.55],[-1.2,-.55]],dp=i=>[[i-.09,.2],[i+.09,.2],[i+.09,0],[i-.09,0]];function fp(i,e,t=0){if(!i.length)return null;let n=i.length>1?i[1].at-i[0].at:1,s=Math.max(0,Math.min(i.length-1,(e-i[0].at)/n)),r=Math.min(i.length-2,Math.floor(s)),a=s-r,o=i[r],c=i[Math.min(i.length-1,r+1)],l=(d,f)=>[d[0]+(f[0]-d[0])*a,d[1]+(f[1]-d[1])*a,d[2]+(f[2]-d[2])*a],h=nu(o,t),u=nu(c,t);return{position:l(h,u),right:xr(l(o.right,c.right)),up:xr(l(o.up,c.up)),forward:xr(l(o.t,c.t)),speed:o.speed+(c.speed-o.speed)*a,detour:o.detour+(c.detour-o.detour)*a,kind:a<.5?o.kind:c.kind,inverted:o.up[1]<0}}function pp(i,e,t,n=8){let s=[],r=-1/0;for(let a of i){if(a.p[1]<1.2||a.inDetour||a.up[1]<.85||a.at-r<n)continue;r=a.at;let o=a.axis[0],c=e(a.at),l=a.p[1]-.55,h=c-t(a.at,-1)-1.6,u=c+t(a.at,1)+1.6;o>h-1.2&&o<u+1.2?l>=4.6&&s.push({kind:"portal",at:a.at,z:a.p[2],top:l,left:h,right:u,x:o}):s.push({kind:"column",at:a.at,z:a.p[2],top:l,x:o})}return s}var Pa=new xt,ic=new Ae,Ft=class{constructor(){this.parts=new Map}add(e,t,n,s=0,r=0,a=0,o=1,c=1,l=1,h=0,u=0,d=0){let f=t.index?t.toNonIndexed():t.clone();for(let g of Object.keys(f.attributes))g!=="position"&&g!=="normal"&&f.deleteAttribute(g);Pa.position.set(s,r,a),Pa.rotation.set(h,u,d),Pa.scale.set(o,c,l),Pa.updateMatrix(),f.applyMatrix4(Pa.matrix),ic.set(n);let m=f.attributes.position.count,x=new Float32Array(m*3);for(let g=0;g<m;g++)x[g*3]=ic.r,x[g*3+1]=ic.g,x[g*3+2]=ic.b;return f.setAttribute("color",new Ut(x,3)),this.parts.has(e)||this.parts.set(e,[]),this.parts.get(e).push(f),f}addGeometry(e,t,n){return this.add(e,t,n)}has(e){return!!this.parts.get(e)?.length}merge(e){let t=this.parts.get(e);if(!t?.length)return null;let n=t.length===1?t[0]:ec(t);return t.length>1&&t.forEach(s=>s.dispose()),this.parts.delete(e),n.computeBoundingSphere(),n}keys(){return[...this.parts.keys()]}};function La(...i){let e=2166136261;for(let t of i)e^=Math.floor(t*1e3)|0,e=Math.imul(e,16777619),e^=e>>>13;return(e>>>0)%1e5/1e5}function ei(i){let e=i>>>0||1;return()=>{e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var Ov=[[-.84,0],[-.965,.09],[-1,.28],[-.995,.5],[-.965,.7],[-.88,.87],[-.66,.98],[-.3,1],[.3,1],[.66,.98],[.88,.87],[.965,.7],[.995,.5],[1,.28],[.965,.09],[.84,0]],Bv=[[-1,0],[-1,1],[1,1],[1,0]];function sc(i,{profile:e=Ov,tumble:t=1}={}){let n=e.length,s=[],r=[],a=[],o=[],c=(m,[x,g])=>{let p=1+((m.tumble??t)-1)*g;return[x*m.w*p+(m.x||0),m.low+g*(m.high-m.low),m.z]};i.forEach(m=>e.forEach(x=>s.push(...c(m,x))));for(let m=0;m<i.length-1;m++)for(let x=0;x<n;x++){let g=m*n+x,p=m*n+(x+1)%n,v=g+n,b=p+n;a.push(g,v,p,p,v,b)}for(let[m,x]of[[0,i[0]],[1,i.at(-1)]]){let g=r.length/3;e.forEach(p=>r.push(...c(x,p)));for(let p=1;p<n-1;p++)m?o.push(g,g+p+1,g+p):o.push(g,g+p,g+p+1)}let l=new je;l.setAttribute("position",new Pe(s,3)),l.setIndex(a),l.computeVertexNormals();let h=new je;h.setAttribute("position",new Pe(r,3)),h.setIndex(o),h.computeVertexNormals();let u=new je,d=l.toNonIndexed(),f=h.toNonIndexed();for(let m of["position","normal"])u.setAttribute(m,new Pe([...d.attributes[m].array,...f.attributes[m].array],3));return[l,h,d,f].forEach(m=>m.dispose()),u}function $t(i,e){if(e<=i[0].z)return{...i[0]};if(e>=i.at(-1).z)return{...i.at(-1)};for(let t=1;t<i.length;t++)if(e<=i[t].z){let n=i[t-1],s=i[t],r=(e-n.z)/(s.z-n.z),a={z:e};for(let o of["w","low","high","tumble"])a[o]=(n[o]??1)+((s[o]??1)-(n[o]??1))*r;return a}}var he=(i,e,t,n,s)=>({z:i,w:e,low:t,high:n,tumble:s}),mp={coupe:{body:[he(-2.25,.78,.37,.6,.92),he(-2.13,.95,.3,.69),he(-1.88,1.04,.28,.77),he(-1.25,1.07,.28,.85),he(-.78,1.075,.28,.9),he(.35,1.065,.28,.93),he(1.1,1.095,.28,.95),he(1.78,1.075,.3,.95),he(2.12,.99,.34,.9),he(2.26,.84,.42,.82)],canopy:[he(-.9,.86,.84,.9,.86),he(-.32,.82,.86,1.29,.76),he(.12,.8,.88,1.37,.74),he(.74,.78,.88,1.36,.74),he(1.36,.82,.88,1.08,.8),he(1.78,.88,.9,.95,.9)],wheel:{r:.42,w:.3,x:.99,z:[-1.38,1.42]},lamps:{y:.79,z:2.2,x:.56,w:.66},head:{y:.64,z:-2.13,x:.68},exhaust:[.62,.36,2.24],stripes:!0,spoiler:"lip"},gt:{body:[he(-2.3,.82,.33,.52,.9),he(-2.16,1,.27,.62),he(-1.85,1.1,.25,.72),he(-1.2,1.12,.25,.79),he(-.7,1.11,.25,.83),he(.4,1.1,.25,.86),he(1.12,1.15,.25,.9),he(1.82,1.12,.27,.9),he(2.18,1.03,.32,.86),he(2.3,.88,.4,.78)],canopy:[he(-.72,.84,.78,.83,.84),he(-.18,.8,.8,1.19,.72),he(.3,.78,.82,1.25,.7),he(.86,.76,.82,1.23,.72),he(1.42,.82,.82,.99,.8),he(1.8,.88,.84,.88,.9)],wheel:{r:.42,w:.34,x:1.03,z:[-1.42,1.46]},lamps:{y:.74,z:2.25,x:.58,w:.7},head:{y:.58,z:-2.18,x:.72},exhaust:[.5,.33,2.28],wing:!0,splitter:!0},sedan:{body:[he(-2.28,.86,.4,.68,.95),he(-2.12,.98,.34,.8),he(-1.7,1.03,.32,.86),he(-.9,1.04,.32,.9),he(.6,1.04,.32,.92),he(1.6,1.03,.32,.94),he(2.12,.97,.36,.92),he(2.26,.86,.44,.86)],canopy:[he(-1.02,.88,.86,.92,.88),he(-.45,.85,.88,1.44,.82),he(.95,.84,.9,1.46,.82),he(1.45,.86,.9,1.06,.86),he(1.72,.9,.9,.95,.92)],wheel:{r:.4,w:.26,x:.95,z:[-1.42,1.42]},lamps:{y:.84,z:2.22,x:.6,w:.5},head:{y:.72,z:-2.15,x:.68},exhaust:[.55,.38,2.24]},hatch:{body:[he(-2,.86,.4,.7,.95),he(-1.86,.97,.34,.82),he(-1.4,1.02,.32,.88),he(-.7,1.03,.32,.93),he(.8,1.03,.32,.96),he(1.62,1,.34,.98),he(1.84,.92,.4,.96)],canopy:[he(-.82,.88,.88,.95,.88),he(-.25,.85,.9,1.48,.84),he(1.2,.84,.9,1.5,.84),he(1.62,.86,.92,1.34,.86),he(1.76,.88,.94,1,.9)],wheel:{r:.38,w:.25,x:.93,z:[-1.22,1.25]},lamps:{y:1,z:1.8,x:.66,w:.36},head:{y:.74,z:-1.94,x:.64},exhaust:[.5,.4,1.86]},suv:{body:[he(-2.3,.92,.5,.86,.96),he(-2.14,1.03,.44,1),he(-1.7,1.08,.42,1.08),he(-.9,1.09,.42,1.12),he(.9,1.09,.42,1.14),he(1.9,1.07,.44,1.14),he(2.22,1,.48,1.1),he(2.3,.92,.56,1.04)],canopy:[he(-1,.94,1.06,1.12,.92),he(-.45,.92,1.08,1.74,.88),he(1.75,.92,1.1,1.78,.9),he(2.1,.94,1.1,1.6,.92),he(2.22,.95,1.1,1.14,.95)],wheel:{r:.47,w:.32,x:1,z:[-1.45,1.5]},lamps:{y:1.12,z:2.26,x:.74,w:.34},head:{y:.92,z:-2.2,x:.7},exhaust:[.6,.48,2.3],rack:!0},van:{body:[he(-2.4,.92,.46,.86,.96),he(-2.22,1.04,.4,1),he(-1.7,1.08,.38,1.1),he(-1.2,1.1,.38,1.14),he(2.25,1.1,.38,1.16),he(2.4,1.04,.42,1.12)],canopy:[he(-1.62,1,1.06,1.12,.94),he(-1,1,1.08,2.02,.94),he(2.28,1.04,1.1,2.06,.95),he(2.38,1,1.1,1.2,.96)],wheel:{r:.44,w:.3,x:1,z:[-1.6,1.55]},lamps:{y:1.12,z:2.38,x:.86,w:.22},head:{y:.86,z:-2.32,x:.74},exhaust:[.6,.44,2.38],panelRoof:!0}},lu=["sedan","hatch","suv","sedan","van"],su=1384748,kv=1711651,ou=13227226,zv=2503487,kt=new yt(1,1,1),ds=new hn(1,1,1,20),Hv=new ji(1,20,0,Math.PI),Gv=new On(1,12,8),ru=new Map;function Vv(i){let e=i.r+":"+i.w;if(ru.has(e))return ru.get(e);let t=new Ft,n=i.r,s=i.w,r=Math.PI/2;t.add("w",ds,kv,0,0,0,n,s,n,0,0,r),t.add("w",ds,2896699,0,0,0,n*.93,s+.012,n*.93,0,0,r);for(let o of[-1,1]){t.add("w",ds,9411750,o*(s*.5+.004),0,0,n*.66,.02,n*.66,0,0,r),t.add("w",ds,3752781,o*(s*.5+.01),0,0,n*.5,.012,n*.5,0,0,r);for(let c=0;c<5;c++)t.add("w",kt,ou,o*(s*.5+.016),0,0,.035,n*1.22,.075,c*Math.PI*2/5,0,0);t.add("w",ds,15002863,o*(s*.5+.024),0,0,n*.16,.014,n*.16,0,0,r)}let a=t.merge("w");return ru.set(e,a),a}var au=new Map;function gp(i="coupe"){if(au.has(i))return au.get(i);let e=mp[i]||mp.coupe,t=new Ft,n=e.body,s=e.canopy,r=e.wheel,a=n[0].z,o=n.at(-1).z,c=Math.max(...s.map(S=>S.high));t.add("paint",sc(n),16777215),t.add("glass",sc(s),16777215);let l=s.filter(S=>S.high>c-.1).map(S=>S.z),h=Math.min(...l)-.16,u=Math.max(...l)+.14,d=[h,h+.08,(h+u)/2,u-.08,u].map((S,A)=>{let R=$t(s,S),M=A===0||A===4;return he(S,R.w*R.tumble*(M?.84:.9),R.high-(M?.07:.13),R.high+.018,.94)});t.add("paint",sc(d),16777215);for(let S of[-1,1]){for(let X of r.z){let q=$t(n,X),ee=S*(q.w*.985);t.add("trim",Hv,725528,ee+S*.012,r.r*.98,X,r.r*1.18,r.r*1.18,1,0,S*Math.PI/2,0);let O=new _i(r.r*1.2,.055,5,14,Math.PI);t.add("paint",O,16777215,ee+S*.02,r.r*.98,X,1,1,1.6,0,S*Math.PI/2,0),O.dispose()}t.add("trim",kt,zv,S*($t(n,0).w*.97),n[3].low+.07,(r.z[0]+r.z[1])/2,.06,.1,r.z[1]-r.z[0]-r.r*2.3);let A=$t(s,s[0].z+.25),R=S*($t(n,s[0].z+.2).w*.93);t.add("paint",Gv,16777215,R+S*.1,A.low+.09,s[0].z+.22,.12,.07,.09),t.add("trim",kt,su,R+S*.04,A.low+.04,s[0].z+.25,.12,.03,.05),t.add("trim",kt,ou,S*($t(n,.4).w*.985),$t(n,.4).high-.03,(s[0].z+s.at(-1).z)/2,.015,.022,(s.at(-1).z-s[0].z)*.82);let M=a+.13,y=$t(n,M),P=Math.min(e.head.y,y.high-.07);t.add("trim",kt,857372,S*e.head.x,P,M,.42,.12,.2,0,S*.16,0),t.add("lights",kt,16775398,S*e.head.x,P+.005,M-.012,.36,.07,.2,0,S*.16,0),t.add("lights",kt,12578815,S*(e.head.x-.02),P-.075,M-.004,.28,.02,.2,0,S*.16,0);let[N,B,H]=e.exhaust;t.add("trim",ds,ou,S*N,B,H,.07,.12,.07,Math.PI/2,0,0),t.add("trim",ds,724755,S*N,B,H+.05,.05,.04,.05,Math.PI/2,0,0)}let f=$t(n,a+.05),m=$t(n,o-.05);if(t.add("trim",kt,su,0,f.low+.13,a+.03,f.w*1.45,.16,.06),t.add("trim",kt,989216,0,e.head.y-.04,a+.05,f.w*.8,.09,.05),t.add("trim",kt,su,0,m.low+.12,o+.01,m.w*1.6,.16,.06),t.add("trim",kt,15328207,0,m.low+.27,o+.03,.42,.12,.02),t.add("trim",kt,5906215,0,e.lamps.y,e.lamps.z+.012,(e.lamps.x-e.lamps.w/2)*2,.045,.03),e.splitter&&t.add("trim",kt,1120802,0,n[1].low-.02,a+.12,n[1].w*1.9,.035,.32),e.spoiler==="lip"&&t.add("paint",kt,16777215,0,n.at(-3).high+.04,n.at(-3).z+.12,n.at(-3).w*1.62,.04,.2,-.18,0,0),e.wing){for(let S of[-1,1])t.add("trim",kt,1581869,S*.62,1,1.92,.06,.26,.12);t.add("trim",kt,1581869,0,1.14,1.97,2,.05,.38,-.08,0,0);for(let S of[-1,1])t.add("trim",kt,1581869,S*1,1.1,1.97,.03,.2,.42)}if(e.rack){for(let S of[-1,1])t.add("trim",kt,10135214,S*.6,c+.06,.6,.05,.05,2.2);for(let S of[-.2,.6,1.4])t.add("trim",kt,10135214,0,c+.07,S,1.22,.035,.05)}e.panelRoof&&t.add("paint",kt,16777215,0,c-.18,.62,1.98,.36,3.3);let x=null;if(e.stripes){let S=(R,M,y)=>R.map(P=>{let N=$t(M,P);return he(P,.085,N.high+y-.012,N.high+y+.006,1)}),A=[];for(let R of[-.25,.25])for(let[M,y,P]of[[[a+.06,a+.25,-1.6,-1.2,-.82],n,0],[[h+.02,(h+u)/2,u-.02],d.map(N=>({...N,high:N.high})),0],[[s.at(-1).z+.05,1.95,o-.1],n,0]]){let N=sc(S(M,y,P),{profile:Bv});N.translate(R,.004,0),A.push(N)}x=new Ft,A.forEach(R=>{x.add("s",R,16052193),R.dispose()}),x=x.merge("s")}let g={bottom:[s[0].high,s[0].z],top:[$t(s,s[1].z).high,s[1].z]},p=s.length-1,v={bottom:[s[p].high,s[p].z],top:[s[p-1].high,s[p-1].z]},b=s[0].z-.02,_=a+.35,C={kind:i,paint:t.merge("paint"),glass:t.merge("glass"),trim:t.merge("trim"),lights:t.merge("lights"),stripes:x,wheel:Vv(r),wheelSpec:r,anchors:{badge:{z:a+.78,y:$t(n,a+.78).high},roofY:c+.016,roofZ:(h+u)/2,hood:{y:$t(n,b).high,back:b,front:_,frontY:$t(n,_).high,w:$t(n,b).w*.8},windshield:g,rearGlass:v,side:{x:$t(n,.86).w,y:$t(n,.86).high-.18,z:.86},lamps:e.lamps,head:e.head,exhaust:e.exhaust,front:a,rear:o,width:Math.max(...n.map(S=>S.w))}};return au.set(i,C),C}var uu=[{name:"boulevard",zenith:6269152,horizon:14280686,sunGlow:16769968,fog:14280686,fogNear:70,fogFar:315,sun:16769204,sunIntensity:3.3,sunPosition:[-34,62,38],hemiSky:13953279,hemiGround:9075298,hemi:1.25,rim:11066608,rimIntensity:.9,exposure:1.08,road:3819092,roadRough:.86,ground:9285770,curb:13617596,walk:13222580,walk2:12169892,verge:8367726,rail:13818070,lamp:4873580,buildings:[15193274,14279138,12176848,14862246,13220008,10993609,15721164,13874583],accents:[14708051,4165514,15775050,5533864,13000059,6988653],glass:6129571,trees:[5213791,6266211,4160853,7776357],trunk:7231041},{name:"coast",zenith:4172248,horizon:14085872,sunGlow:16773839,fog:14085872,fogNear:80,fogFar:320,sun:16773592,sunIntensity:3.5,sunPosition:[-26,70,30],hemiSky:13233407,hemiGround:5213333,hemi:1.3,rim:10217198,rimIntensity:.9,exposure:1.1,road:3622746,roadRough:.84,ground:14273958,curb:14212310,walk:12568516,walk2:11187378,verge:8828042,rail:15002600,lamp:5993088,water:2068398,deepWater:1270143,buildings:[15920610,15195339,14214884,16046530,13623528],accents:[3116963,14710863,15909198,3960476],glass:7317183,trees:[5218426,4164204,7319690],trunk:10123861,rock:9080710,rock2:11052179},{name:"storm",zenith:2502735,horizon:9016749,sunGlow:12174052,fog:9016749,fogNear:55,fogFar:300,sun:12766706,sunIntensity:2.1,sunPosition:[-30,55,30],hemiSky:11122396,hemiGround:3950162,hemi:1.55,rim:10467327,rimIntensity:1.15,exposure:1.12,road:2831170,roadRough:.42,ground:6254182,curb:11120821,walk:8226704,walk2:7042172,verge:5596764,rail:11977420,lamp:4608606,buildings:[9082536,7306383,10134704],accents:[15907152,14904661,8368345],glass:4281966,trees:[3099203,3692105,2506806,4284495],trunk:4865334,rock:7173248,rock2:8884379,snow:15331060}],Z=new yt(1,1,1),zt=new hn(1,1,1,10),xp=new hn(1,1,1,6),Hn=new Kn(1,1,7),vn=new Jn(1,0),cu=new Jn(1,1),Wv=new ji(1,14),_r=new On(1,10,7),Xv=(i,e,t)=>new Ae(i).lerp(new Ae(e),t).getHex(),ft=(i,e)=>{let t=new Ae(i);return t.multiplyScalar(e),t.getHex()},qv=(i,e,t,n,s,r,a)=>i.add("s",Wv,a,e,t,n,s,r,1,-Math.PI/2,0,0);function bi(i,e,t,n,s,r="round",a=1){let o=s.trees[Math.floor(n()*s.trees.length)],c=(2.6+n()*1.6)*a;if(qv(i,e+.6,.035,t+.4,1.9*a,1.5*a,ft(s.ground,.72)),i.add("s",xp,s.trunk,e,c*.4,t,.16*a,c*.8,.16*a),r==="pine"){for(let l=0;l<3;l++)i.add("s",Hn,ft(o,1-l*.06),e,c*.55+l*1.15*a,t,(1.7-l*.42)*a,2.1*a,(1.7-l*.42)*a);s.snow&&n()<.45&&i.add("s",Hn,s.snow,e,c*.55+3.05*a,t,.5*a,.7*a,.5*a);return}if(r==="palm"){for(let l=0;l<4;l++)i.add("s",xp,ft(s.trunk,1-l*.04),e+l*.12,1+l*1.6,t,.2-l*.02,1.7,.2-l*.02,0,0,-.07);for(let l=0;l<7;l++){let h=l*Math.PI*2/7+n();i.add("s",_r,l%2?o:ft(o,.9),e+.5+Math.cos(h)*1.25,6.7-Math.abs(Math.sin(h))*.2,t+Math.sin(h)*1.25,1.6,.12,.42,0,-h,Math.cos(h)*-.25)}i.add("s",_r,9071164,e+.5,6.6,t,.35,.3,.35);return}i.add("s",cu,o,e,c+.9*a,t,1.55*a,1.35*a,1.5*a),i.add("s",cu,ft(o,1.12),e+.55*a,c+1.5*a,t-.3*a,1.05*a,.95*a,1*a),i.add("s",cu,ft(o,.88),e-.5*a,c+.55*a,t+.4*a,1*a,.85*a,.95*a)}function _p(i,e,t,n,s,r,a,o,c,l,h,{band:u=!1,floor:d=3.1}={}){for(let f=n;f<s-1.2;f+=d){if(u){i.add("s",Z,c,t-h*.03,f+1.1,(r+a)/2,.06,1.25,a-r-.6),i.add("s",Z,l,t-h*.05,f+.38,(r+a)/2,.05,.12,a-r-.4);continue}let m=(a-r)/o;for(let x=0;x<o;x++){let g=r+m*(x+.5);i.add("s",Z,c,t-h*.03,f+1.1,g,.06,1.35,m*.58)}}}function vp(i,e,t,n,s,r,a,o){for(let c=s;c<r-1.2;c+=3.1)for(let l=0;l<o;l++)i.add("s",Z,a,e-t/2+t*(l+.5)/o,c+1.1,n+.03,t/o*.56,1.35,.06)}function hu(i,e,t,n,s,r,a){let o=9+e()*6,c=n*(1+e()*2.5),l=c+n*o/2,h=r-s,u=(s+r)/2,d=t.buildings[Math.floor(e()*t.buildings.length)],f=t.accents[Math.floor(e()*t.accents.length)],m=a==="tower"?26+e()*22:a==="low"?7+e()*4:12+e()*12,x=a==="tower"?t.glass:ft(t.glass,.82),g=ft(d,.78);i.add("s",Z,ft(d,.9),l,2,u,o,4,h),i.add("s",Z,2900306,c-n*.02,1.55,u,.06,2.4,h-1.2);for(let p=s+1.6;p<r-1;p+=2.4)i.add("s",Z,ft(d,.72),c-n*.05,1.55,p,.08,2.5,.12);if(i.add("s",Z,f,c-n*.65,3.2,u,1.3,.12,h-.8,0,0,n*.18),i.add("s",Z,ft(f,.75),c-n*1.28,3.05,u,.05,.32,h-.8),i.add("s",Z,16183522,c-n*.06,3.85,u,.08,.55,Math.min(h-2,6)),i.add("s",Z,ft(f,.9),c-n*.09,3.85,u,.04,.36,Math.min(h-2.6,5.2)),a==="tower"){i.add("s",Z,x,l+n*1,4+m/2,u,o-2,m,h-1.5);for(let p=s+1;p<=r-1;p+=1.6)i.add("s",Z,14674156,c+n*.97,4+m/2,p,.06,m,.1);for(let p=4;p<4+m;p+=3.3)i.add("s",Z,13227740,c+n*.96,p,u,.08,.14,h-1.5);return i.add("s",Z,12043468,l+n*1,4.4+m,u,o-3,.8,h-3),i.add("s",Z,10135730,l+n*1.5,5.6+m,u,2.4,1.8,2.4),m+4}if(i.add("s",Z,d,l,4+m/2,u,o,m,h),i.add("s",Z,g,c-n*.04,4.15,u,.12,.3,h+.05),_p(i,l,c,4.2,4+m,s+.8,r-.8,Math.max(2,Math.round(h/3)),x,g,n,{band:a==="band"}),vp(i,l,o-1.5,r,4.2,4+m,x,Math.max(2,Math.round(o/3))),a==="balcony")for(let p=7;p<4+m-1;p+=3.1)i.add("s",Z,15330538,c-n*.55,p,u,1.1,.12,h-2.4);return i.add("s",Z,g,l,4+m+.25,u,o+.2,.5,h+.2),i.add("s",Z,ft(d,.68),l,4+m+.05,u,o-.8,.3,h-.8),e()<.6&&(i.add("s",Z,11121848,l+n*(e()*2-1),4+m+.9,u-1,2,1.2,1.6),i.add("s",Z,9411489,l-n*1.5,4+m+.7,u+2,1.2,.8,1.2)),e()<.35&&(i.add("s",zt,9335128,l+n*2,4+m+1.6,u+1.5,.9,2.2,.9),i.add("s",Hn,7166023,l+n*2,4+m+3.1,u+1.5,1,.8,1)),e()<.3&&i.add("s",Z,t.trees[0],l,4+m+.6,u,o-2,.5,h-2.5),m+4}function $v(i,e,t){let n=new Ft,s=ei(1e3+t*31+(e>0?7:0));if(n.add("s",Z,ft(i.walk2,.96),e*22,-.04,0,44,.1,20.2),t===7){n.add("s",Z,i.verge,e*16,.02,0,22,.06,18),n.add("s",zt,14078148,e*14,.3,0,3,.6,3),n.add("s",zt,7321814,e*14,.62,0,2.6,.05,2.6),n.add("s",zt,15262938,e*14,1.3,0,.25,1.5,.25);for(let[h,u]of[[6,-6],[9,5],[20,-4],[23,6],[17,-8]])bi(n,e*h,u,s,i,"round",1.15);for(let h of[-3,3])n.add("s",Z,8018499,e*6.5,.45,h,.6,.12,2.2);return n.merge("s")}let r=["grid","band","balcony","tower","low","grid","band","balcony"],a=r[t%r.length];t%3===1?(hu(n,s,i,e,-9.6,-.3,a),hu(n,s,i,e,.3,9.6,r[(t+3)%8])):hu(n,s,i,e,-9.4,9.4,a);let o=ei(77+t*13+(e>0?3:0)),c=18+o()*30,l=i.buildings[Math.floor(o()*i.buildings.length)];return n.add("s",Z,ft(l,.92),e*(30+o()*6),c/2,-2+o()*4,10,c,14),n.merge("s")}function Yv(i,e,t){let n=new Ft,s=ei(2e3+t*17+(e>0?5:0));if(t===0)return Mp();if(t===1){let a=e*(26+s()*16),o=s()*10-5;n.add("s",Z,16052454,a,-3,o,2.2,.6,6),n.add("s",Z,2775920,a,-2.7,o,2.25,.12,6.05),n.add("s",Z,15918796,a,-2.4,o+.6,1.4,.6,2.2),n.add("s",zt,13949662,a,1,o,.06,7,.06);let c=new je;return c.setAttribute("position",new Pe([0,0,0,0,6,0,0,0,3.6,0,0,0,0,0,3.6,0,6,0],3)),c.computeVertexNormals(),n.add("s",c,16644334,a,-2,o-1.5),c.dispose(),n.merge("s")}if(t===2){for(let[a,o,c]of[[12,-5,14833983],[18,6,4170605],[30,-2,15778378]])n.add("s",zt,c,e*a,-2.9,o,.5,1.1,.5),n.add("s",Hn,c,e*a,-2,o,.4,.9,.4);return n.merge("s")}if(t===3||t===4){let a=e*(32+s()*14);return n.add("s",vn,i.rock,a,-3.4,0,9,3.2,8),n.add("s",vn,i.rock2,a+e*2,-2.2,2,5,2.2,4.5),n.add("s",_r,i.ground,a,-1.6,0,6,.9,5.5),bi(n,a-1,-1,s,i,"palm"),t===4&&bi(n,a+2,2,s,i,"palm",.9),n.merge("s")}n.add("s",Z,i.ground,e*24,-1.7,0,40,3.4,20.4),n.add("s",Z,ft(i.ground,.85),e*4.6,-2.2,0,1.2,2.4,20.4);let r=t%3;for(let a=0;a<2;a++){let o=-5+a*10,c=6+s()*3,l=5+s()*7,h=e*(9+s()*4+a*7),u=i.buildings[(t+a)%i.buildings.length];n.add("s",Z,u,h,l/2,o,c,l,6.5),n.add("s",Z,i.accents[(t+a+r)%i.accents.length],h,l+.5,o,c+.6,1,7.1,0,0,0),vp(n,h,c-1,o+3.25,1,l,i.glass,2),_p(n,h,h-e*c/2,1,l,o-2.6,o+2.6,2,i.glass,16777215,e)}return bi(n,e*6,-8,s,i,"palm"),bi(n,e*7,8,s,i,"palm",.95),n.merge("s")}function Zv(i,e,t){let n=new Ft,s=ei(3e3+t*19+(e>0?11:0));if(n.add("s",Z,i.ground,e*24,-.06,0,46,.1,20.4),n.add("s",vn,ft(i.ground,.92),e*(18+s()*8),-.8,s()*8-4,7,2.6,6,0,s()*3,0),t%4===0){let a=e*(10+s()*6);n.add("s",vn,i.rock,a,.6,-3,2.2,1.6,2.6,0,s()*3,0),n.add("s",vn,i.rock2,a+e,.4,-1,1.4,1,1.5,0,s()*3,0)}let r=t%4===3?3:7+Math.floor(s()*5);for(let a=0;a<r;a++){let o=e*(7+s()*30),c=s()*18-9;bi(n,o,c,s,i,"pine",.85+s()*.6)}if(t===5){let a=e*15;n.add("s",Z,7166538,a,1.6,2,5,3.2,6),n.add("s",Z,4012608,a,3.9,2,5.8,.3,6.8,0,0,e*.42),n.add("s",Z,4012608,a+e*1.2,3.9,2,5.8,.3,6.8,0,0,-e*.42),n.add("s",Z,15910250,a-e*2.52,1.6,1,.06,1,1)}if(t===6)for(let a=0;a<4;a++)n.add("s",vn,a%2?i.rock:i.rock2,e*(12+a*2.5),2+a*1.2,-6+a*4,3.5,4+a,3.2,0,a,0);return n.merge("s")}function Mp(){let i=new je;for(let e of["position","normal","color"])i.setAttribute(e,new Pe([],3));return i}function Kv(i,e,t){let n=new Ft,s=e;n.add("s",Z,i.curb,s*5.53,.075,0,.26,.15,20.02),n.add("s",Z,i.verge,s*6.5,.06,0,1.7,.1,20.02),n.add("s",Z,i.walk,s*8.9,.1,0,3.1,.12,20.02);for(let a of[-7.5,-2.5,2.5,7.5])n.add("s",Z,i.walk2,s*8.9,.163,a,3.05,.01,.08);n.add("s",Z,ft(i.walk2,.9),s*10.5,.16,0,.15,.22,20.02);for(let a of[-5,5])n.add("s",Z,10852482,s*6.5,.25,a,1.5,.38,2.6),n.add("s",Z,ft(i.verge,.85),s*6.5,.45,a,1.3,.06,2.4);let r=ei(400+t);return bi(n,s*6.5,-5,r,i,"round",.7),bi(n,s*6.5,5,r,i,"round",.65),t%2===0?(n.add("s",zt,i.lamp,s*6.3,3.4,0,.07,6.8,.07),n.add("s",Z,i.lamp,s*5.75,6.75,0,1.2,.09,.1),n.add("s",Z,16774102,s*5.25,6.66,0,.55,.1,.36)):(n.add("s",Z,4874608,s*9.9,.65,-3,.5,1.1,.5),n.add("s",Z,3108712,s*7.9,.5,4,.5,.6,1.8),n.add("s",Z,9071439,s*7.9,.85,4,.5,.06,1.9)),t===3&&(n.add("s",Z,14673640,s*9.7,1.3,-1,.06,2.4,3.6),n.add("s",Z,6066096,s*9.65,1.3,-1,.04,2.2,3.4),n.add("s",Z,i.lamp,s*9.7,2.55,-1,1.2,.08,3.8)),n.merge("s")}function Jv(i,e,t){let n=new Ft,s=e;n.add("s",Z,13226704,s*6.6,-.55,0,2.6,1.3,20.02),n.add("s",Z,ft(13226704,.82),s*3.2,-1.05,0,4.4,.3,20.02),n.add("s",Z,14870757,s*5.75,.42,0,.6,.84,20.02),n.add("s",Z,i.walk,s*7,.1,0,1.9,.12,20.02),n.add("s",Z,i.rail,s*7.95,1.05,0,.07,.07,20.02),n.add("s",Z,i.rail,s*7.95,.62,0,.05,.05,20.02);for(let r=-9;r<=9;r+=3)n.add("s",Z,i.rail,s*7.95,.6,r,.06,.95,.06);return n.add("s",Z,2920358,s*5.75,.86,0,.62,.05,20.02),t===0&&(n.add("s",Z,12240066,s*3.6,-6,0,2.2,10,2.6),n.add("s",Z,ft(12240066,.85),s*3.6,-3,0,3.4,.6,3.6)),t===1&&(n.add("s",zt,i.lamp,s*7.7,3.6,-4,.07,7.2,.07),n.add("s",Z,i.lamp,s*7,7.15,-4,1.5,.09,.1),n.add("s",Z,16774102,s*6.3,7.06,-4,.55,.1,.36)),n.merge("s")}function jv(i,e,t){let n=new Ft,s=e;n.add("s",Z,i.curb,s*5.53,.075,0,.26,.15,20.02),n.add("s",Z,i.walk,s*7.4,.1,0,3.5,.12,20.02),n.add("s",Z,14209728,s*9.3,.35,0,.4,.6,20.02),n.add("s",Z,i.ground,s*12.5,-1.2,0,6,2.6,20.02);for(let r of[-6,4])bi(n,s*11,r,ei(500+t),i,"palm",.85);return t%2===0&&(n.add("s",zt,i.lamp,s*6,3.4,2,.07,6.8,.07),n.add("s",Z,i.lamp,s*5.45,6.75,2,1.2,.09,.1),n.add("s",Z,16774102,s*4.95,6.66,2,.55,.1,.36)),n.merge("s")}function yr(i,e,t,n=0){let s=new Ft,r=e,a=14276300,o=16774354;s.add("s",Z,i.curb,r*5.6,.12,0,.4,.24,20.02),s.add("s",Z,a,r*6.25,3.2,0,.5,6.4,20.02),s.add("s",Z,2846598,r*5.99,1.1,0,.04,.5,20.02),s.add("s",Z,ft(a,.9),r*5.2,6.75,0,2.4,.5,20.02,0,0,r*.55),s.add("s",Z,ft(a,.78),r*2.3,7.45,0,4.8,.5,20.02);for(let c of[-7.5,-2.5,2.5,7.5])s.add("s",Z,o,r*4.6,7.08,c,.3,.08,3.4);s.add("s",Z,i.rock,r*12,4.5,0,11,9,20.02),s.add("s",Z,ft(i.verge??i.ground,.95),r*6,8.35,0,12.2,1.4,20.02);for(let c=0;c<3;c++)s.add("s",vn,c%2?i.rock2:i.rock,r*(12+c*3),9+c*1.5,-7+c*7,4.5,3+c,5.5,0,t+c,0);if(s.add("s",vn,i.verge??i.ground,r*8,9.6,3,5,1.6,6),n){let c=n*10;s.add("s",Z,13946818,r*2.6,8.9,c,5.6,2.4,1),s.add("s",Z,12959665,r*12,6,c+n*.2,12,12,1.2),s.add("s",Z,15909198,r*2.6,7.85,c+n*.52,5.2,.28,.06),s.add("s",Z,2372671,r*2.6,7.85,c+n*.55,1.2,.12,.04);for(let l=0;l<3;l++)s.add("s",vn,i.rock,r*(9+l*4),12+l,c-n*2,5,4,4,0,l,0)}return s.merge("s")}function yp(i,e,t,n){let s=new Ft,r=e,a=ei(600+t+(r>0?50:0));s.add("s",Z,ft(i.road,1.3),r*6.4,.03,0,2,.06,20.02),s.add("s",Z,i.rail,r*7.45,.62,0,.06,.3,20.02),s.add("s",Z,ft(i.rail,.7),r*7.45,.62,0,.04,.08,20.04);for(let o=-8;o<=8;o+=4)s.add("s",Z,7042689,r*7.55,.35,o,.1,.7,.1),s.add("s",Z,12575743,r*7.42,.66,o,.02,.08,.18);for(let o of[-5,5])s.add("s",Z,15331058,r*6.9,.55,o,.12,1.1,.12),s.add("s",Z,15771200,r*6.9,.95,o,.13,.18,.13);if(n){for(let o=0;o<4;o++){let c=-7.5+o*5,l=7+a()*6;s.add("s",vn,o%2?i.rock:i.rock2,r*(10.8+a()),l*.45,c,3.2+a(),l,3.4,a(),a()*2,r*.15)}s.add("s",Z,ft(i.rock,.9),r*13,5,0,4,10,20.02),i.snow&&s.add("s",Z,i.snow,r*13.6,10.1,0,3.2,.3,20.02)}else s.add("s",Z,ft(i.ground,.85),r*11,-1.6,0,6,3,20.02,0,0,-r*.35);return s.merge("s")}var fs=8;function bp(i){let e=uu[i],t={look:e,roadside:{},scenery:{"-1":[],1:[]}},n=(s,r,...a)=>Array.from({length:r},(o,c)=>({"-1":s(e,-1,c,...a),1:s(e,1,c,...a)}));if(i===0){t.roadside.street=n(Kv,4);for(let s of[-1,1])for(let r=0;r<fs;r++)t.scenery[s].push($v(e,s,r))}if(i===1){t.roadside.bridge=n(Jv,3),t.roadside.shore=n(jv,2),t.roadside.tunnel=[{"-1":yr(e,-1,0),1:yr(e,1,0)}],t.roadside.portalIn=[{"-1":yr(e,-1,1,1),1:yr(e,1,1,1)}],t.roadside.portalOut=[{"-1":yr(e,-1,2,-1),1:yr(e,1,2,-1)}];for(let s of[-1,1])for(let r=0;r<fs;r++)t.scenery[s].push(Yv(e,s,r))}if(i===2){t.roadside.cliff=n(yp,3,!0),t.roadside.drop=n(yp,3,!1);for(let s of[-1,1])for(let r=0;r<fs;r++)t.scenery[s].push(Zv(e,s,r))}return t.empty=Mp(),t.dispose=()=>{for(let s of Object.values(t.roadside))for(let r of s)for(let a of Object.values(r))a.dispose();for(let s of["-1","1"])t.scenery[s].forEach(r=>r.dispose());t.empty.dispose()},t}function Sp(i,e,t={}){let n=e*20+10,s=l=>La(e,l,i),r=(t.tunnels||[]).find(l=>n>l.start&&n<l.end);if(i===0){let l=Math.floor(s(1)*4);return{roadside:{"-1":["street",l],1:["street",(l+2)%4]},scenery:{"-1":Math.floor(s(2)*fs),1:Math.floor(s(3)*fs)}}}if(i===1){if(r){let x=n-20<r.start,g=n+20>r.end,p=x?"portalIn":g?"portalOut":"tunnel";return{roadside:{"-1":[p,0],1:[p,0]},scenery:{"-1":-1,1:-1},tunnel:!0}}let l=Math.floor(n/240),h=La(l,7,i)<.38,u=La(l,8,i)<.5?-1:1,d=e%2===0?0:e%4===1?1:2,f=x=>h&&x===u?["shore",e%2]:["bridge",d],m=x=>h&&x===u?5+Math.floor(s(4+x)*3):Math.floor(s(5+x)*5);return{roadside:{"-1":f(-1),1:f(1)},scenery:{"-1":m(-1),1:m(1)},land:h?u:0}}let a=Math.floor(n/320),o=La(a,9,i)<.5?-1:1,c=Math.floor(s(1)*3);return{roadside:{"-1":[o===-1?"cliff":"drop",c],1:[o===1?"cliff":"drop",(c+1)%3]},scenery:{"-1":Math.floor(s(2)*fs),1:Math.floor(s(3)*fs)}}}function du(i,e,t){if(i!==1)return[];let n=[...t].sort((a,o)=>a.start-o.start).reduce((a,o)=>{let c=a.at(-1);return c&&o.start<=c.end?c.end=Math.max(c.end,o.end):a.push({...o}),a},[]),s=[],r=240;for(let a of[...n,{start:e-320,end:1/0}])a.start-r>=220&&s.push({start:r,end:a.start}),r=Math.max(r,a.end);return s.filter((a,o)=>o%2===1).map(a=>{let o=Math.round((a.start+a.end)/2/20)*20;return{start:o-80,end:o+60}})}function Ep(i){let e=new On(560,40,20),t=e.attributes.position,n=new Float32Array(t.count*3),s=new D(...i.sunPosition).normalize().multiply(new D(1,.6,-1)).normalize(),r=new Ae(i.zenith),a=new Ae(i.horizon),o=new Ae(i.sunGlow),c=new Ae,l=new D;for(let u=0;u<t.count;u++){l.fromBufferAttribute(t,u).normalize();let d=Math.max(0,l.y);c.copy(a).lerp(r,Math.pow(d,.55));let f=Math.max(0,l.dot(s));c.lerp(o,Math.pow(f,8)*.55+Math.pow(f,64)*.4),n.set([c.r,c.g,c.b],u*3)}e.setAttribute("color",new Ut(n,3));let h=new ve(e,new dt({vertexColors:!0,side:Ht,fog:!1,depthWrite:!1}));return h.renderOrder=-10,h.frustumCulled=!1,h}function wp(i,e){let t=new Ft,n=ei(90+i),s=e.horizon,r=(o,c)=>Xv(o,s,c);if(i===0){for(let o=0;o<34;o++){let c=(o-17)*24+n()*10,l=22+n()*70,h=12+n()*16;t.add("s",Z,r(9348279,.55),c,l/2-4,-470-n()*20,h,l,10)}for(let o=0;o<26;o++){let c=(o-13)*30+n()*12,l=14+n()*40,h=14+n()*14;t.add("s",Z,r(10334912,.38),c,l/2-4,-420-n()*10,h,l,10)}t.add("s",zt,r(8361384,.4),-120,40,-430,3,90,3),t.add("s",_r,r(9348279,.4),-120,72,-430,8,6,8)}else if(i===1){for(let o=0;o<9;o++){let c=(o-4)*110+n()*40,l=80+n()*90,h=16+n()*30;t.add("s",vn,r(6262664,.5),c,-6,-470,l,h,30)}t.add("s",Z,r(4022130,.45),180,-1.5,-440,40,4,8),t.add("s",Z,r(14243647,.45),172,1.6,-440,6,3,8)}else for(let[o,c,l,h,u,d]of[[520,6122118,.62,12,90,110],[470,4871794,.42,14,60,80],[430,3950174,.25,16,35,55]])for(let f=0;f<h;f++){let m=(f-h/2)*(900/h)+n()*40,x=u+n()*d,g=90+n()*80;t.add("s",Hn,r(c,l),m,x/2-8,-o-n()*20,g,x,30),l>.4&&t.add("s",Hn,r(15199733,l*.8),m,x-8-x*.12,-o-n()*20+2,g*.25,x*.25,8)}let a=new ve(t.merge("s"),new dt({vertexColors:!0,fog:!1}));return a.renderOrder=-5,a}function Tp(i,e){let t=[["wheel","clock","stadium","twin"],["lighthouse","towers","ship","lighthouse"],["turbines","observatory","mast","turbines"]][i],n=[];for(let s=0,r=520;r<e-200;s++,r+=1150)n.push({kind:t[s%t.length],at:r,side:s%2?1:-1});return n}function Ap(i,e,t){let n=new Ft,s=ei(e.length*7+i);if(e==="wheel"){n.add("s",Z,14278626,0,0,0,30,1,12);for(let r of[-2,2])n.add("s",Z,13620954,-6,18,r,.8,36,.8,0,0,-.32),n.add("s",Z,13620954,6,18,r,.8,36,.8,0,0,.32);return n.add("s",zt,9279907,0,34,0,1.2,5,1.2,Math.PI/2,0,0),{static:n.merge("s"),offset:62}}if(e==="clock"){n.add("s",Z,15260095,0,18,0,7,36,7),n.add("s",Z,14140838,0,37,0,8,2,8),n.add("s",Hn,7176076,0,43,0,6,9,6);for(let[r,a,o]of[[0,3.55,0],[3.55,0,Math.PI/2]])n.add("s",zt,16315106,r,30,a,2.4,.2,2.4,Math.PI/2,o,0),n.add("s",Z,2898245,r,30.6,a+(o?0:.12),.18,1.6,.05,0,o,0);return{static:n.merge("s"),offset:52}}if(e==="stadium"){n.add("s",new hn(32,28,16,24,1,!0),14212576,0,8,0),n.add("s",new _i(31,1.2,6,24),15226698,0,16,0,1,1,1,Math.PI/2,0,0);for(let r=0;r<8;r++){let a=r/8*Math.PI*2;n.add("s",Z,12371660,Math.cos(a)*30,22,Math.sin(a)*30,.8,12,.8)}return{static:n.merge("s"),offset:78}}if(e==="twin"){for(let r of[-7,7])n.add("s",Z,t.glass,r,32,0,10,64,10),n.add("s",Z,14674156,r,65,0,8,3,8),n.add("s",zt,13621726,r,72,0,.3,12,.3);return n.add("s",Z,13621726,0,42,0,6,2,3),{static:n.merge("s"),offset:70}}if(e==="lighthouse"){n.add("s",vn,t.rock,0,-3,0,14,6,12),n.add("s",zt,16052714,0,9,0,2.6,22,2.6);for(let r of[4,12])n.add("s",zt,14239547,0,r,0,2.62,3,2.62);return n.add("s",zt,2964036,0,21,0,3.2,.5,3.2),n.add("s",zt,16773569,0,22.6,0,1.8,2.6,1.8),n.add("s",Hn,14239547,0,25,0,2.4,2.4,2.4),{static:n.merge("s"),offset:58,beacon:[0,22.6,0]}}if(e==="towers"){for(let r of[-1,1])n.add("s",Z,15002086,r*11.2,15,0,1.6,30,2.2),n.add("s",Z,15002086,r*11.2,-6,0,2.6,12,3.2);n.add("s",Z,14015961,0,28,0,24,1.6,2.2),n.add("s",Z,2920358,0,26.8,0,22,.5,2.3);for(let r of[-1,1])for(let a of[-1,1])for(let o=0;o<4;o++){let c=Math.hypot(22-o*2,18+o*6);n.add("s",Z,13624292,r*11,28-(22-o*2)/2,a*(18+o*6)/2,.12,c,.12,a*Math.atan2(18+o*6,22-o*2),0,0)}return{static:n.merge("s"),offset:0,overRoad:!0}}if(e==="ship"){n.add("s",Z,3099228,0,-2.4,0,9,3.4,44),n.add("s",Z,15001834,0,1.6,16,8,5,8);for(let r=0;r<5;r++)n.add("s",Z,t.accents[r%t.accents.length],0,.6,-14+r*6,8,3,5.5);return{static:n.merge("s"),offset:95}}if(e==="turbines"){for(let[r,a,o]of[[0,0,40],[30,-40,46],[-26,-70,38]])n.add("s",vn,t.rock,r,0,a,16,8,14),n.add("s",zt,15265264,r,o/2,a,.9,o,.9),n.add("s",Z,15265264,r,o,a+1.2,1.8,1.8,3.2);return{static:n.merge("s"),offset:92,rotors:[[0,40,-1.6],[30,46,-41.6],[-26,38,-71.6]]}}if(e==="observatory")return n.add("s",Hn,t.rock,0,14,0,40,40,36),n.add("s",Hn,t.snow,0,30,0,13,10,12),n.add("s",zt,14673386,0,36,0,4,4,4),n.add("s",_r,15856886,0,38.5,0,4,3.6,4),n.add("s",Z,4608606,0,39,1,1.2,4,6,0,0,.5),{static:n.merge("s"),offset:120};n.add("s",Hn,t.rock,0,10,0,30,30,26),n.add("s",zt,12042440,0,40,0,.6,34,.6);for(let r=26;r<56;r+=6)n.add("s",Z,12042440,0,r,0,3,.2,.2);return{static:n.merge("s"),offset:105,beacon:[0,57.5,0]}}function Rp(){let i=new Ft,e=new yt(.9,16,.3).translate(0,8.4,0);for(let t=0;t<3;t++)i.add("s",e,15922679,0,0,0,1,1,1,0,0,t*Math.PI*2/3);return i.add("s",_r,15265264,0,0,.3,.9,.9,.9),e.dispose(),i.merge("s")}var rc=class{constructor(e,t){this.scene=e,this.car=t,this.level=0,this.uses=0,this.intensity=0,this.burstAge=2,this.matrix=new xt;let n=document.createElement("canvas");n.width=n.height=128;let s=n.getContext("2d"),r=s.createRadialGradient(64,64,1,64,64,64);r.addColorStop(0,"#ffffff"),r.addColorStop(.15,"#c8f7ffb0"),r.addColorStop(.48,"#57bfff35"),r.addColorStop(1,"#1a6cff00"),s.fillStyle=r,s.fillRect(0,0,128,128),this.texture=new yi(n),this.texture.colorSpace=Bt,this.exhaust=new $e,t.add(this.exhaust),this.jets=[],this.glows=[];for(let o of[-1,1]){let c=new ve(new Kn(.22,2.8,10),new dt({color:5819391,transparent:!0,opacity:.9,blending:_n,depthWrite:!1}));c.rotation.x=Math.PI/2,c.position.set(o*.69,.38,3.35),this.exhaust.add(c),this.jets.push(c);let l=new ve(new Kn(.09,1.8,10),new dt({color:15072511,transparent:!0,opacity:.95,blending:_n,depthWrite:!1}));l.rotation.x=Math.PI/2,l.position.set(o*.69,.38,3),this.exhaust.add(l);let h=new mi(new Zn({map:this.texture,color:7525887,transparent:!0,opacity:.75,blending:_n,depthWrite:!1}));h.position.set(o*.69,.42,2.6),h.scale.set(1.65,1.65,1),this.exhaust.add(h),this.glows.push(h)}this.exhaust.visible=!1,this.wake=new gi(new yt(.022,.022,1),new dt({color:10414847,transparent:!0,opacity:.7,blending:_n,depthWrite:!1}),48),this.wake.frustumCulled=!1,this.wake.visible=!1,this.wake.instanceMatrix.setUsage(ss),e.add(this.wake),this.rings=[];let a=new es(1.8,1.85,48);for(let o=0;o<3;o++){let c=new ve(a,new dt({color:8317183,transparent:!0,opacity:0,side:en,blending:_n,depthWrite:!1}));c.visible=!1,e.add(c),this.rings.push(c)}this.aura=new ve(new Nt(5.4,8),new dt({map:this.texture,color:5818879,transparent:!0,opacity:0,blending:_n,depthWrite:!1})),this.aura.rotation.x=-Math.PI/2,this.aura.visible=!1,e.add(this.aura)}update(e,t,n,s){this.state!==t&&(this.state=t,this.uses=t?.nitroUses||0,this.burstAge=2,this.intensity=0,this.wasActive=!1,this.previousLevel=0);let r=!!t?.nitroActive&&!s,a=Math.max(1,t?.nitroLevel||1),o=n.reduced,c=n.graphics==="battery";r&&(!this.wasActive||a!==this.previousLevel)&&(this.burstAge=0),this.wasActive=r,this.previousLevel=a,this.uses=t?.nitroUses||0,s||(this.burstAge+=e,this.intensity=St.damp(this.intensity,r?a/3:0,r?16:8,e)),this.level=r?a:0;let l=a===3?16765315:a===2?11972863:7004415;this.exhaust.visible=r;let h=o?1:1+Math.sin((t?.elapsed||0)*39)*.045;this.exhaust.scale.set(1+(a-1)*.12,1,1+(a-1)*.18),this.jets.forEach(f=>{f.material.color.setHex(l),f.scale.y=h}),this.glows.forEach(f=>f.material.color.setHex(l));let u=this.car.position.x,d=this.car.position.z;if(this.aura.visible=r,this.aura.position.set(u,.065,d+1),this.aura.rotation.z=-this.car.rotation.y,this.aura.material.color.setHex(l),this.aura.material.opacity=r?.16+a*.07:0,this.wake.visible=r&&!o,this.wake.count=c?12:48,this.wake.material.color.setHex(l),this.wake.visible){let f=(t.roadTravel||t.distance)*.08;for(let m=0;m<this.wake.count;m++){let x=((m*.618033+f)%1+1)%1,g=m%2?1:-1;this.matrix.position.set(u+g*(1.15+m%7*.2),.2+m%5*.14,d+2+x*12),this.matrix.scale.set(1,1,(.6+a*.5)*(1-x*.45)),this.matrix.rotation.set(0,0,g*.04),this.matrix.updateMatrix(),this.wake.setMatrixAt(m,this.matrix.matrix)}this.wake.instanceMatrix.needsUpdate=!0}this.rings.forEach((f,m)=>{let x=this.burstAge-m*.075,g=x/.5;f.visible=r&&!o&&!c&&g>=0&&g<1,f.visible&&(f.position.set(u,.8,d+2+g*8),f.scale.setScalar(.65+g*1.3),f.material.color.setHex(l),f.material.opacity=(1-g)*.32)})}};var Qv=13.2,ac=[3775609,14792518,12471902,5014984],Cp=[15317401,12155991,8410431,13802100],eM=new yt(1,1,1),oc=new Jn(1,1),tM=new hn(.24,.29,.67,6),Ip=new yt(1,1,1),ti=new xt,ps=new Ae;function ms(i,e){let t=new gi(i,new Tt({roughness:.85}),e);return t.instanceMatrix.setUsage(ss),t.frustumCulled=!1,t}function gs(i,e,t,n,s,r,a,o,c=0,l=0,h=0){ti.position.set(t,n,s),ti.scale.set(r,a,o),ti.rotation.set(c,l,h),ti.updateMatrix(),i.setMatrixAt(e,ti.matrix)}function xs(i,e,t){let n=e.map(([a,o,c,l,h,u])=>{let d=eM.clone();return ti.position.set(a,o,c),ti.scale.set(l,h,u),ti.rotation.set(0,0,0),ti.updateMatrix(),d.applyMatrix4(ti.matrix)}),s=ec(n);n.forEach(a=>a.dispose());let r=new ve(s,new Tt({color:t,roughness:.76}));return r.receiveShadow=!0,i.add(r),r}var lc=class{constructor(e){this.root=new $e,e.add(this.root),this.stands=[],this.elapsed=0,this.proximity=0,this.state=void 0;for(let t=0;t<6;t++){let n=new $e,s=new $e,r=new $e;n.add(s,r),this.root.add(n);let a=xs(s,[[1.2,-.22,0,6,.4,15.8],[1.7,.05,0,2.5,.5,14.8],[3.4,.38,0,1.4,1.15,14.8]],11386556);xs(s,[[1.4,-1.5,-5,.45,2.6,.45],[1.4,-1.5,5,.45,2.6,.45]],5861760);let o=[[-1.8,.78,0,.11,.13,15.6],[-1.8,.3,0,.11,.07,15.6]];for(let v=-7.5;v<=7.5;v+=3)o.push([-1.8,.36,v,.12,.9,.12]);xs(s,o,13490134);let c=[];for(let v of[0,1])c.push([v*1.85+.7,.35+v*.56,0,.7,.12,13.5]);xs(s,c,2309714);for(let v=0;v<4;v++)xs(s,[[-1.9,.42,(v-1.5)*3.6,.07,.65,3.35]],ac[v]);let l=xs(s,[[-2.8,-.27,0,2,.3,15.8]],9546157);l.userData.bridgeDeck=!0;let h=ms(tM,8),u=ms(oc,8),d=ms(oc,8),f=ms(Ip,16),m=ms(oc,16),x=ms(Ip,16),g=ms(oc,16);for(let v of[h,u,d,f,m,x,g])r.add(v);for(let v=0;v<8;v++){h.setColorAt(v,ps.setHex(ac[(v+t)%4])),u.setColorAt(v,ps.setHex(Cp[(v*3+t)%4])),d.setColorAt(v,ps.setHex([4141099,5849145,3156786,10648136][v%4]));for(let b of[0,1])f.setColorAt(v*2+b,ps.setHex(ac[(v+t)%4])),m.setColorAt(v*2+b,ps.setHex(Cp[(v*3+t)%4])),x.setColorAt(v*2+b,ps.setHex(2504263)),g.setColorAt(v*2+b,ps.setHex(2371645))}let p=[];for(let v of[-7.2,7.2]){xs(s,[[4.3,2.5,v,.09,5,.09]],9611445);let b=new ve(new Nt(1.6,.8,5,2),new Tt({color:ac[(t+(v>0?1:0))%4],side:en,roughness:.85}));b.position.set(3.55,4.25,v),b.userData.flat=b.geometry.attributes.position.array.slice(),s.add(b),p.push(b)}this.stands.push({group:n,platform:s,base:a,bodies:h,heads:u,hair:d,arms:f,hands:m,legs:x,eyes:g,flags:p,slot:t,station:-1})}}prepare(e,t){if(this.state===e&&this.arena===t)return;this.state=e,this.arena=t;let n=window.RallyCore,s=[];if(e&&!e.reviewLap){s.push(25);for(let r=1;r<e.tasks.length;r++){let a=n.taskZone(e.tasks[r-1]).end+100,o=n.taskZone(e.tasks[r]).start-140;o-a>25&&s.push((a+o)/2)}s.push(e.arena.length-15)}else e||s.push(65,230,470,710,950);this.stations=s.flatMap((r,a)=>[-1,1].map(o=>({at:r,side:o,id:a*2+(o>0?1:0)})));for(let r of this.stands)r.station=-1,r.lastCheer=0,r.group.visible=!1,r.base.material.color.setHex(t===2?7176597:t===1?11652809:13154211)}update(e,t,n,s,r,a,o,c){this.prepare(t,n),c||(this.elapsed+=e);let l=this.stations.findIndex(d=>d.at>=s-100),h=l<0?[]:this.stations.slice(l,l+6).map(d=>d.id),u=new Set(this.stands.filter(d=>h.includes(d.station)).map(d=>d.station));this.proximity=0;for(let d of this.stands){if(!h.includes(d.station)){let _=h.find(C=>!u.has(C));d.station=_??-1,_!=null&&u.add(_)}let f=this.stations[d.station];if(!f){d.group.visible=!1;continue}let m=f.at-s,x=(this.blocked||[]).some(_=>f.at>_.start-40&&f.at<_.end+40);if(d.group.visible=!x&&m>-85&&m<300,!d.group.visible)continue;let g=f.side;d.group.position.set(a(f.at)-r+g*Qv,0,4-m),d.group.rotation.y=-Math.atan((a(f.at+1)-a(f.at-1))/2),d.platform.scale.x=g;let p=Math.min(Math.abs(m),...(t?.rivals||[]).map(_=>Math.abs(_.at-f.at))),v=c?d.lastCheer||0:t&&t.status!=="countdown"?St.smoothstep(80-p,0,65):0;d.lastCheer=v,this.proximity=Math.max(this.proximity,St.clamp(1-Math.abs(m)/90,0,1));let b=o.graphics==="battery"?4:8;for(let _ of[d.bodies,d.heads,d.hair])_.count=b;for(let _ of[d.arms,d.hands,d.legs,d.eyes])_.count=b*2;for(let _=0;_<b;_++){let C=_>>2,S=g*(C*1.85+.7),A=(_%4-1.5)*3.3,R=.9+_%3*.07,M=.43+C*.56,y=this.elapsed*4.2+_*1.8+d.slot*.8,P=o.reduced?0:v*Math.max(0,Math.sin(y))*.07,N=M+.87*R+P,B=M+1.48*R+P;gs(d.bodies,_,S,N,A,R,R,R),gs(d.heads,_,S,B,A,.23*R,.27*R,.23*R),gs(d.hair,_,S+g*.025,B+.15*R,A,.235*R,.17*R,.24*R);for(let H=0;H<2;H++){let X=H?1:-1,q=o.reduced?0:Math.sin(y+(H?1.1:0))*.24,ee=o.reduced?0:v*(_%3===0?1.85:1.35)+q*v,O=X*(.15+ee),V=A+X*.26*R,ie=.55*R,xe=V+X*Math.sin(ee)*ie*.5;gs(d.arms,_*2+H,S,N-.04+Math.cos(ee)*(-ie*.5),xe,.15*R,ie,.16*R,O,0,0),gs(d.hands,_*2+H,S,N-.04-Math.cos(ee)*ie,V+X*Math.sin(ee)*ie,.105*R,.105*R,.105*R),gs(d.legs,_*2+H,S,M+.29*R+P,A+X*.13*R,.17*R,.59*R,.2*R),gs(d.eyes,_*2+H,S-g*.222*R,B+.025*R,A+X*.08*R,.018,.025,.024)}}for(let _ of[d.bodies,d.heads,d.hair,d.arms,d.hands,d.legs,d.eyes])_.instanceMatrix.needsUpdate=!0;for(let _ of d.flags)if(!c){let C=_.geometry.attributes.position,S=_.userData.flat;for(let A=0;A<S.length;A+=3)C.array[A+2]=o.reduced?0:Math.sin(this.elapsed*3+S[A]*3+d.slot)*.09*(S[A]+.8)/1.6;C.needsUpdate=!0,_.geometry.computeVertexNormals()}}}};var cc=(i,e,t)=>Math.max(e,Math.min(t,i)),hc=class{constructor(e,t){this.car=t,this.state=null,this.stage=-1,this.lastImpact=null,this.spawnClock=0,this.deformable=t.children.filter(S=>S.isMesh&&S.userData.paint).map(S=>({mesh:S,base:S.geometry.attributes.position.array.slice()})),this.details=new $e,t.add(this.details);let n=t.userData.anchors||{windshield:{bottom:[.92,-.945],top:[1.46,-.365]},rearGlass:{bottom:[.92,1.18],top:[1.46,.63]},hood:{y:.965,back:-.57,front:-2.04,frontY:.75,w:.86},side:{x:1.076,y:.78,z:.86}},s=new xi({color:15661299,transparent:!0,opacity:.9,depthWrite:!1}),r=[];for(let S of[n.windshield,n.rearGlass])for(let[A,R,M]of[[-.24,.52,.27],[.36,.3,.15]]){let y=S===n.rearGlass,P=(B,H)=>[B,S.bottom[0]+H*(S.top[0]-S.bottom[0])+.012,S.bottom[1]+H*(S.top[1]-S.bottom[1])+(y?.014:-.014)],N=[[-1,-.22],[-.64,.85],[.18,1],[1,.37],[.83,-.65],[-.23,-1]];for(let B=0;B<N.length;B++){let[H,X]=N[B],q=P(A+H*M*.48,cc(R+X*M*.65,.05,.92)),ee=P(A+H*M,cc(R+X*M*1.15,.05,.92));r.push(...P(A,R),...q,...q,...ee),B%2===0&&r.push(...q,...P(A+H*M*.9+.06,cc(R+X*M*.35,.05,.92)))}}this.cracks=new Li(new je().setAttribute("position",new Pe(r,3)),s),this.cracks.renderOrder=2,this.details.add(this.cracks);let a=t.children.find(S=>S.userData.paint)?.material||new Tt({color:14268004}),o=n.hood,c=o.back-o.front,l=o.frontY-o.y;this.hood=new $e,this.hood.position.set(0,o.y+.012,o.back),this.details.add(this.hood);let h=new je;h.setAttribute("position",new Pe([-o.w,0,0,o.w,0,0,o.w*1.04,l*.45+.02,-c*.62,o.w*.76,l+.06,-c,-o.w*.78,l+.03,-c,-o.w*1.05,l*.45+.01,-c*.62],3)),h.setIndex([0,1,2,0,2,5,5,2,3,5,3,4]),h.computeVertexNormals(),this.hoodPanel=new ve(h,a),this.hoodPanel.userData.paint=!0,this.hoodPanel.castShadow=!0,this.hood.add(this.hoodPanel);let u=new ve(h,new Tt({color:2306363,roughness:.86,side:Ht}));this.hood.add(u),this.engineBay=new ve(new yt(o.w*1.7,.025,c*.75),new Tt({color:1582380,roughness:.9})),this.engineBay.position.set(0,o.y+l*.5,o.back-c*.5),this.details.add(this.engineBay),this.loosePanel=new $e,this.loosePanel.position.set(n.side.x+.005,n.side.y,n.side.z),this.details.add(this.loosePanel);let d=new ve(new yt(.035,.28,.64),a);d.position.set(.04,-.1,.2),d.userData.paint=!0,this.loosePanel.add(d);let f=n.side.x+.022,m=n.side.y,x=new je().setAttribute("position",new Pe([f,m-.09,-.25,f,m-.04,.7,f,m-.17,.02,f,m-.11,.9,f,m+.02,.21,f,m+.05,.73],3));this.scrapes=new Li(x,new xi({color:12240584})),this.details.add(this.scrapes),this.smokeAnchor=[.35,o.frontY+.06,o.front+.25],this.particles=new $e,e.add(this.particles);let g=document.createElement("canvas");g.width=g.height=64;let p=g.getContext("2d"),v=p.createRadialGradient(32,32,0,32,32,32);v.addColorStop(0,"#d3dcdbbb"),v.addColorStop(.45,"#a4b4b76b"),v.addColorStop(1,"#73888d00"),p.fillStyle=v,p.fillRect(0,0,64,64);let b=new yi(g);b.colorSpace=Bt,this.smoke=Array.from({length:12},(S,A)=>{let R=new mi(new Zn({map:b,transparent:!0,depthWrite:!1,opacity:0}));return R.visible=!1,this.particles.add(R),{mesh:R,life:2,seed:A}});let _=new yt(.025,.025,.14),C=new dt({color:16766357});this.sparks=Array.from({length:10},(S,A)=>{let R=new ve(_,C);return R.visible=!1,this.particles.add(R),{mesh:R,life:1,seed:A}}),this.protection=new ve(new es(1.65,1.71,40),new dt({color:12052191,transparent:!0,opacity:.18,depthWrite:!1})),this.protection.rotation.x=-Math.PI/2,this.protection.scale.y=1.55,this.protection.visible=!1,e.add(this.protection),this.origin=new D,this.setStage(0)}setStage(e){if(this.stage!==e){this.stage=e;for(let{mesh:t,base:n}of this.deformable){let s=t.geometry.attributes.position;for(let r=0;r<n.length;r+=3){let a=cc((-n[r+2]-1.25)/.9,0,1),o=e*a;s.array[r]=n[r]*(1-o*.035),s.array[r+1]=n[r+1]-o*(.022+.025*Math.max(0,n[r])),s.array[r+2]=n[r+2]+o*(.065+.025*Math.sin(n[r]*5))}s.needsUpdate=!0,t.geometry.computeVertexNormals(),t.geometry.computeBoundingSphere()}this.cracks.visible=this.scrapes.visible=e>0,this.hood.visible=this.engineBay.visible=this.loosePanel.visible=e>=2}}reset(e){this.state=e,this.lastImpact=e?.lastImpact||null,this.spawnClock=0,this.setStage(e?.damage||0);for(let t of[...this.smoke,...this.sparks])t.mesh.visible=!1,t.life=2;this.hood.rotation.set(0,0,0),this.loosePanel.rotation.set(0,0,0),this.protection.visible=!1}update(e,t,n={},s=!1){this.state!==t&&this.reset(t);let r=t?.damage||0;this.setStage(r),this.car.updateWorldMatrix(!0,!1),this.origin.set(...this.smokeAnchor).applyMatrix4(this.car.matrixWorld);let a=!!n.reduced,o=n.graphics==="battery";if((t?.lastImpact||null)!==this.lastImpact&&(this.lastImpact=t.lastImpact,!a))for(let u of this.sparks){let d=u.seed*2.4;u.life=0,u.mesh.position.copy(this.origin),u.vx=Math.sin(d)*3.3,u.vy=1.3+u.seed%3*.5,u.vz=2+u.seed%4,u.mesh.visible=!0}if(r>=2){let u=t?.elapsed||0;this.hood.rotation.x=.17+(r===3?.06:0)+(a?0:Math.sin(u*17)*.012),this.hood.rotation.z=-.025,this.loosePanel.rotation.z=-.14+(a?0:Math.sin(u*15)*.035)}this.protection.visible=!!t&&t.invulnerable>0&&r<3&&!["paused","finished","failed","countdown"].includes(t.status),this.protection.position.set(this.car.position.x,.065,this.car.position.z);let c=t?.lastImpact?t.elapsed-t.lastImpact.at:1/0;if(c<.45&&!a&&!s){let u=Math.sin(c*42)*(1-c/.45);this.car.rotation.z+=u*.065,this.car.position.y+=Math.abs(u)*.045}if(a)for(let u of[...this.smoke,...this.sparks])u.mesh.visible=!1;if(s)return;let l=(t?.arena.speed||0)*(t?.speedFactor||0)*(t?.worldTimeScale??1),h=e*(t?.worldTimeScale??1);if(r>=2&&!a){this.spawnClock+=h;let u=o?.25:r===3?.065:.13;if(this.spawnClock>=u){this.spawnClock%=u;let d=this.smoke.find(f=>!f.mesh.visible);d&&(d.life=0,d.mesh.position.copy(this.origin),d.mesh.visible=!0,d.mesh.material.color.setHex(r===3?7175041:14871012))}}for(let u of this.smoke)if(u.mesh.visible){u.life+=h,u.mesh.visible=u.life<1.1&&u.mesh.position.z<13,u.mesh.position.x+=h*(.7+Math.sin(u.seed)*.2),u.mesh.position.y+=h*.65,u.mesh.position.z+=h*(l+1.2);let d=.25+u.life*.65;u.mesh.scale.setScalar(d),u.mesh.material.opacity=(r===3?.55:.3)*Math.pow(Math.max(0,1-u.life/1.1),1.5)}for(let u of this.sparks)u.mesh.visible&&(u.life+=h,u.vy-=h*9,u.mesh.position.x+=u.vx*h,u.mesh.position.y+=u.vy*h,u.mesh.position.z+=(u.vz+l)*h,u.mesh.rotation.x=u.seed+u.life*12,u.mesh.visible=u.life<.45&&u.mesh.position.y>.06);if(a)for(let u of[...this.smoke,...this.sparks])u.mesh.visible=!1}};var fu=new Map,pu=new Map,mu=new Map,iM=new rr({color:3495787,roughness:.06,metalness:.4,clearcoat:1,clearcoatRoughness:.04,envMapIntensity:1.6}),Lp=new Tt({vertexColors:!0,roughness:.52,metalness:.32}),sM=new Tt({vertexColors:!0,roughness:.6,metalness:.28}),rM=new dt({vertexColors:!0}),aM=new dt({vertexColors:!0}),oM=new Tt({vertexColors:!0,roughness:.6,metalness:.05}),lM=new dt({color:9692671,transparent:!0,opacity:.85,blending:_n,depthWrite:!1}),cM=new dt({color:16762519,transparent:!0,opacity:.85,blending:_n,depthWrite:!1}),Dp=[9413549,13225937,7307148,12035471,9281418,14209732,6253690];function Up(i){return pu.has(i)||pu.set(i,new rr({color:i,roughness:.34,metalness:.22,clearcoat:.85,clearcoatRoughness:.16})),pu.get(i)}var hM=(i,e)=>new Ae(i).multiplyScalar(e).getHex();function Mn(i,e=.7,t=0,n=0){let s=[i,e,t,n].join();return fu.has(s)||fu.set(s,new Tt({color:i,roughness:e,metalness:t,emissive:n,emissiveIntensity:n?.7:0})),fu.get(s)}var Da={arch:new _i(.48,.07,5,18,Math.PI),rock:new Jn(1,1),leaf:new On(1,10,5),carTrim:new Ca(1,1,1,2,.09),contact:new Nt(1,1),coach:new Ca(1,1,1,1,.09),box:new yt(1,1,1),sphere:new On(1,12,8),cone:new Kn(1,1,6),cylinder:new hn(1,1,1,18)};function Me(i,e,t,n,s,r,a=1,o=1,c=1,l=.7,h=0,u=0){let d=new ve(Da[e],Mn(t,l,h,u));return d.position.set(n,s,r),d.scale.set(a,o,c),i.add(d),d}function ni(i,e=512,t=1024){let n=document.createElement("canvas");n.width=e,n.height=t,i(n.getContext("2d"),e,t);let s=new yi(n);return s.colorSpace=Bt,s}function Np(i,e="#ffd976",t=""){return ni((n,s,r)=>{n.fillStyle="#192c43",n.fillRect(0,0,s,r),n.strokeStyle=e,n.lineWidth=12,n.strokeRect(12,12,s-24,r-24),n.textAlign="center",n.fillStyle=e,n.font="900 120px sans-serif",n.fillText(i,s/2,145),t&&(n.fillStyle="#fff",n.font="bold 28px sans-serif",n.fillText(t,s/2,207))},512,256)}function Fp(i,e,t){if(!mu.has(i)){let n=ni((s,r,a)=>{s.fillStyle="#11283b",s.fillRect(0,0,r,a),s.strokeStyle="#"+t.toString(16).padStart(6,"0"),s.lineWidth=12,s.strokeRect(7,7,r-14,a-14),s.fillStyle="#fff5dd",s.font="900 142px sans-serif",s.textAlign="center",s.fillText(e,r/2,163),s.font="bold 22px sans-serif",s.fillStyle="#a9c9d9",s.fillText("WORDRAMP",r/2,212)},192,256);mu.set(i,new Tt({map:n,roughness:.56,metalness:.08}))}return mu.get(i)}var uc=class{constructor(e,t){this.container=e,this.viewport={width:innerWidth,height:innerHeight},this.renderer=t||new jl({antialias:!0,powerPreference:"high-performance"}),this.preferences={graphics:"auto",reduced:!1},this.performanceBudget=Pc("auto",window.devicePixelRatio||1),this.renderer.setPixelRatio(this.performanceBudget.ratio),this.renderer.setSize(innerWidth,innerHeight),this.renderer.outputColorSpace=Bt,this.renderer.toneMapping=hl,this.renderer.toneMappingExposure=1.12,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=nl,e.append(this.renderer.domElement),this.scene=new sa,this.camera=new Qt(52,innerWidth/innerHeight,.25,700),this.hemi=new _a(14216959,5467753,1.4),this.scene.add(this.hemi),this.sun=new ar(16769459,3.4),this.sunOffset=new D(-34,62,38),this.focusTint=new Ae(10273972),this.sun.target.position.set(0,0,-14),this.sun.position.copy(this.sun.target.position).add(this.sunOffset),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(1024,1024),Object.assign(this.sun.shadow.camera,{left:-26,right:26,top:34,bottom:-34,near:10,far:170}),this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.035,this.sun.shadow.radius=3,this.scene.add(this.sun,this.sun.target),this.rim=new ar(10214640,1.05),this.rim.position.set(30,20,-50),this.scene.add(this.rim),this.player=this.makeCar(15973461,!0),this.scene.add(this.player),this.player.position.z=4,this.damageFx=new hc(this.scene,this.player),this.rivalCars=[],this.spectators=new lc(this.scene),this.trail=new $e,this.scene.add(this.trail);for(let n=0;n<12;n++){let s=Me(this.trail,"box",8440760,0,.08,0,.08,.025,.32,.4,0,5809551);s.visible=!1}this.boostFx=new rc(this.scene,this.player),this.exhaust=this.boostFx.exhaust,this.lookConfig={color:15973461,badge:0,trail:!1},this.shadow=new ve(new Nt(3.2,5.9),new dt({map:ni((n,s,r)=>{n.shadowColor="rgba(0,0,0,.62)",n.shadowBlur=22,n.fillStyle="rgba(0,0,0,.62)";let a=s*.2,o=r*.14,c=s*.6,l=r*.72,h=26;n.beginPath(),n.moveTo(a+h,o),n.arcTo(a+c,o,a+c,o+l,h),n.arcTo(a+c,o+l,a,o+l,h),n.arcTo(a,o+l,a,o,h),n.arcTo(a,o,a+c,o,h),n.fill()},128,256),transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2})),this.shadow.rotation.x=-Math.PI/2,this.shadow.position.set(0,.07,4),this.scene.add(this.shadow),this.nitroReadyGlow=new ve(new Nt(4.8,6.9),new dt({map:ni((n,s,r)=>{let a=n.createRadialGradient(s/2,r/2,0,s/2,r/2,s/2);a.addColorStop(0,"#71daff00"),a.addColorStop(.42,"#71daff00"),a.addColorStop(.7,"#71daff88"),a.addColorStop(1,"#71daff00"),n.fillStyle=a,n.fillRect(0,0,s,r)},128,128),transparent:!0,depthWrite:!1,opacity:.65})),this.nitroReadyGlow.rotation.x=-Math.PI/2,this.nitroReadyGlow.visible=!1,this.scene.add(this.nitroReadyGlow),this.world=new $e,this.scene.add(this.world),this.gates=new Map,this.gate=new $e,this.roadBoards=new $e,this.scene.add(this.roadBoards),this.signAnchors=[],this.promptAnchor=new D,this.traffic=[],this.elapsed=0,this.showcaseDistance=0,this.currentLane=0,this.index=-1,this.lastGate="",this.gateTextures=[],this.setup(0),this.look=new D,this.resize(),window.addEventListener("resize",()=>this.resize()),this.viewportObserver=typeof ResizeObserver=="function"?new ResizeObserver(()=>this.resize()):null,this.viewportObserver?.observe(e),this.renderer.domElement.addEventListener("webglcontextlost",n=>{n.preventDefault(),document.dispatchEvent(new Event("graphicslost"))}),this.renderer.domElement.addEventListener("webglcontextrestored",()=>location.reload())}setPreferences(e){let t=this.preferences.graphics!==e.graphics;this.preferences=e,t&&(this.performanceBudget=Pc(e.graphics,window.devicePixelRatio||1),this.renderer.setPixelRatio(this.performanceBudget.ratio),this.resize()),this.renderer.shadowMap.enabled=e.graphics!=="battery"}samplePerformance(e,t){Ku(this.performanceBudget,e,t)&&(this.renderer.setPixelRatio(this.performanceBudget.ratio),this.resize())}resize(){let e=Math.max(1,this.container.clientWidth||innerWidth),t=Math.max(1,this.container.clientHeight||innerHeight);this.resized&&e===this.viewport.width&&t===this.viewport.height||(this.viewport={width:e,height:t},this.resized=!0,this.renderer.setSize(e,t),this.camera.aspect=e/t,this.camera.updateProjectionMatrix())}makeCar(e,t=!1,n=t?"coupe":"sedan"){let s=gp(n),r=s.anchors,a=new $e,o=[],c=[],l=[],h=new ve(s.paint,Up(e));h.userData.paint=!0,a.add(h);let u=new ve(s.glass,iM);if(a.add(u),a.add(new ve(s.trim,Lp),new ve(s.lights,rM)),s.stripes){let d=new ve(s.stripes,Lp);d.userData.stripes=!0,a.add(d)}for(let d of[-1,1]){for(let x of s.wheelSpec.z){let g=new $e,p=new $e;g.position.set(d*s.wheelSpec.x,s.wheelSpec.r,x),g.add(p),p.add(new ve(s.wheel,sM)),a.add(g),g.userData.front=x<0,g.userData.spin=p,o.push(g)}c.push(Me(a,"coach",8862019,d*r.lamps.x,r.lamps.y,r.lamps.z,r.lamps.w,.11,.05,.2,.2,5969952));let f=new Ft;f.add("i",Da.box,16757575,d*(r.lamps.x+r.lamps.w/2+.05),r.lamps.y,r.lamps.z+.01,.12,.08,.04),f.add("i",Da.box,16757575,d*(r.head.x+.24),r.head.y,r.head.z+.06,.12,.06,.04);let m=new ve(f.merge("i"),aM);m.userData.indicator=d,m.visible=!1,l.push(m),a.add(m)}return a.traverse(d=>{d.isMesh&&(d.castShadow=d!==u,d.receiveShadow=!0)}),a.userData={indicators:l,wheels:o,brakeLights:c,wheelAngle:0,anchors:r,kind:n},a.userData.hitBounds=new wn().setFromObject(a),a}animateCar(e,t,n,s){for(let r of e.userData.wheels||[])r.rotation.y=r.userData.front?n:0,r.userData.spin.rotation.x=t;for(let r of e.userData.brakeLights||[])r.material=s?Mn(16737636,.2,.2,16722217):Mn(8862019,.2,.2,5969952)}setCosmetics(e){if(this.lookConfig=e,!this.teamRoundel){this.teamRoundel=new ve(new Nt(.73,.97).rotateX(-Math.PI/2));let t=this.player.userData.anchors;this.teamRoundel.position.set(0,t.roofY+.004,t.roofZ),this.teamRoundel.scale.setScalar(.82),this.player.add(this.teamRoundel)}if(this.teamRoundel.visible=!!e.teamId,e.teamId&&(this.teamRoundel.material=Fp(e.teamId,e.teamId[0].toUpperCase(),e.color)),this.player.traverse(t=>{t.userData.paint&&(t.material=Up(e.color))}),!this.hoodBadge){let t=this.player.userData.anchors.badge;this.hoodBadge=Me(this.player,"cylinder",16244641,0,t.y+.006,t.z,.2,.02,.2,.3,.6,5784864),this.hoodBadge.userData.cosmetic=!0;let n=new ir;for(let s=0;s<10;s++){let r=s*Math.PI/5-Math.PI/2,a=s%2?.065:.15;s===0?n.moveTo(Math.cos(r)*a,Math.sin(r)*a):n.lineTo(Math.cos(r)*a,Math.sin(r)*a)}n.closePath(),this.badgeStar=new ve(new ga(n),Mn(4017499,.3,.5)),this.badgeStar.rotation.x=-Math.PI/2,this.badgeStar.position.set(0,t.y+.02,t.z),this.player.add(this.badgeStar)}this.hoodBadge.visible=this.badgeStar.visible=e.badge>0,this.hoodBadge.material=Mn([16244641,11129550,15319923,13812460][e.badge]||16244641,.3,.6)}addContactShadow(e){this.contactMaterial||(this.contactMaterial=this.shadow.material.clone(),this.contactMaterial.opacity=.52);let t=new ve(Da.contact,this.contactMaterial);t.rotation.x=-Math.PI/2,t.scale.set(3,5.4,1),t.position.y=.055,this.scene.add(t),e.userData.contactShadow=t}placeContactShadow(e){let t=e.userData.contactShadow;t&&(t.visible=e.visible&&1-2*(e.quaternion.x**2+e.quaternion.z**2)>.8,t.position.set(e.position.x,e.position.y+.055,e.position.z),t.rotation.z=-e.rotation.y)}syncRivals(e){if(this.rivalState!==e){for(let t of this.rivalCars)t.userData.contactShadow&&this.scene.remove(t.userData.contactShadow),this.scene.remove(t),t.traverse(n=>{n.isMesh&&n.userData.ownGeometry&&n.geometry.dispose()});this.rivalCars=[],this.rivalState=e;for(let t of e?.rivals||[]){let n=this.makeCar(t.color,!1,"gt"),s=n.userData.anchors;n.userData.rival=t;let r=new ve(new Nt(.62,.8).rotateX(-Math.PI/2),Fp("rival"+t.id,String(t.id+2).padStart(2,"0"),t.color));r.userData.ownGeometry=!0,r.position.set(0,s.roofY+.004,s.roofZ),n.add(r);let a=new $e;for(let o of[-1,1]){let c=Me(a,"cone",t.id?16762519:9692671,o*s.exhaust[0],s.exhaust[1],s.exhaust[2]+.5,.11,.85,.11,.2,0,t.id?16750168:4569327);c.rotation.x=-Math.PI/2,c.material=t.id?cM:lM}a.visible=!1,n.add(a),n.userData.nitroExhaust=a,this.scene.add(n),this.addContactShadow(n),this.rivalCars.push(n)}}}rivalProjection(){return this.camera.updateMatrixWorld(),this.rivalCars.map(e=>{let t=e.position.clone();return t.y+=2.5,t.project(this.camera),{id:e.userData.rival.id,x:(t.x*.5+.5)*this.viewport.width,y:(-.5*t.y+.5)*this.viewport.height,visible:e.visible&&t.z>-1&&t.z<1&&e.position.z<-3}})}ribbon(e,t,n,s,r=.13){let a=[];for(let h=0;h<t.length-1;h++){let u=t[h],d=t[h+1];a.push(u.x-n/2,r,-u.at,u.x+n/2,r,-u.at,d.x-n/2,r,-d.at,d.x-n/2,r,-d.at,u.x+n/2,r,-u.at,d.x+n/2,r,-d.at)}let o=new je;o.setAttribute("position",new Pe(a,3)),o.computeVertexNormals();let c=[];for(let h=0;h<a.length;h+=3)c.push(a[h]/10.8,-a[h+2]/20);o.setAttribute("uv",new Pe(c,2));let l=new ve(o,s===this.palette.road?this.asphaltMaterial:Mn(s));return l.receiveShadow=!0,e.add(l),l}setup(e){if(e===this.index)return;this.index=e;let t=uu[e];this.arenaLook=t,this.palette={road:t.road};for(let l of this.segments||[])for(let h of[...l.userData.roadSurfaces,...l.userData.roadside])h.geometry.dispose();for(let l of this.landmarks||[])l.group.traverse(h=>{h.isMesh&&h.geometry!==this.rotorGeometry&&h.geometry.dispose()});this.world.traverse(l=>{l.isMesh&&l.userData.ownGeometry&&l.geometry.dispose()}),this.world.clear(),this.kit?.dispose();for(let l of[this.roadTexture,this.asphaltTexture,this.reflectionTexture,this.waterNormal,this.cloudTexture])l?.dispose();for(let l of[this.roadMaterial,this.asphaltMaterial,this.waterMaterial,this.sceneryMaterial])l?.dispose();this.rain&&(this.scene.remove(this.rain),this.rain.geometry.dispose(),this.rain.material.dispose(),this.rain=null),this.waterNormal=null,this.segments=[],this.courseState=void 0,this.kit=bp(e),this.scene.fog=new ia(t.fog,t.fogNear,t.fogFar),this.scene.background=new Ae(t.horizon),this.sun.color.set(t.sun),this.sun.intensity=t.sunIntensity,this.sunOffset.set(...t.sunPosition),this.hemi.color.set(t.hemiSky),this.hemi.groundColor.set(t.hemiGround),this.hemi.intensity=t.hemi,this.rim.color.set(t.rim),this.rim.intensity=t.rimIntensity,this.renderer.toneMappingExposure=t.exposure;let n=Ep(t);n.userData.ownGeometry=!0,this.world.add(n),this.skyDome=n;let s=wp(e,t);s.userData.ownGeometry=!0,this.world.add(s);let r=l=>"#"+new Ae(l).getHexString();this.reflectionTexture=ni((l,h,u)=>{let d=l.createLinearGradient(0,0,0,u);d.addColorStop(0,r(t.zenith)),d.addColorStop(.46,r(t.horizon)),d.addColorStop(.5,r(t.sunGlow)),d.addColorStop(.54,r(t.hemiGround)),d.addColorStop(1,r(hM(t.hemiGround,.5))),l.fillStyle=d,l.fillRect(0,0,h,u);let f=l.createRadialGradient(h*.3,u*.32,1,h*.3,u*.32,30);f.addColorStop(0,"#fff8e4"),f.addColorStop(1,"#fff8e400"),l.fillStyle=f,l.fillRect(0,0,h,u)},256,128),this.reflectionTexture.mapping=or,this.scene.environment=this.reflectionTexture,this.scene.environmentIntensity=e===2?.62:.7;let a=Math.min(8,this.renderer.capabilities?.getMaxAnisotropy?.()||1);this.asphaltTexture=ni((l,h,u)=>{l.fillStyle=r(t.road),l.fillRect(0,0,h,u);let d=window.RallyCore.random(101+e);for(let f=0;f<6e3;f++){l.fillStyle=f%3?"#ffffff07":"#0000000c";let m=f%7?2:3;l.fillRect(d()*h,d()*u,m,m)}for(let f of[1,3,5])for(let m of[-.045,.045]){let x=h*(f/6+m),g=l.createLinearGradient(x-14,0,x+14,0);g.addColorStop(0,"#00000000"),g.addColorStop(.5,e===2?"#ffffff0d":"#0000000f"),g.addColorStop(1,"#00000000"),l.fillStyle=g,l.fillRect(x-14,0,28,u)}l.strokeStyle="#00000024",l.lineWidth=2;for(let f=0;f<5;f++){l.beginPath();let m=d()*h,x=d()*u;l.moveTo(m,x);for(let g=0;g<5;g++)m+=(d()-.5)*40,x+=d()*30,l.lineTo(m,x);l.stroke()}},512,512),this.asphaltTexture.wrapS=this.asphaltTexture.wrapT=Pi,this.asphaltTexture.anisotropy=a,this.asphaltMaterial=new Tt({map:this.asphaltTexture,roughness:t.roadRough,metalness:e===2?.18:.02}),this.roadTexture=ni((l,h,u)=>{l.drawImage(this.asphaltTexture.image,0,0,h,u),l.strokeStyle=e===2?"#e6e9f4":"#f1ede0",l.lineWidth=7,l.beginPath(),l.moveTo(16,0),l.lineTo(16,u),l.moveTo(h-16,0),l.lineTo(h-16,u),l.stroke(),l.setLineDash([88,72]),l.lineWidth=6;for(let d of[h/3,h*2/3])l.beginPath(),l.moveTo(d,0),l.lineTo(d,u),l.stroke()},512,1024),this.roadTexture.wrapS=this.roadTexture.wrapT=Pi,this.roadTexture.anisotropy=a;let o=new Tt({map:this.roadTexture,roughness:t.roadRough,metalness:e===2?.18:.02});if(this.roadMaterial=o,this.sceneryMaterial=new Tt({vertexColors:!0,roughness:e===2?.74:.88,metalness:0}),e===1){this.waterNormal=ni((h,u,d)=>{h.fillStyle="#8080ff",h.fillRect(0,0,u,d);for(let f=0;f<d;f+=4)for(let m=0;m<u;m+=4){let x=Math.sin(m*.07+Math.sin(f*.08)*2),g=Math.cos(f*.13+Math.sin(m*.04));h.fillStyle=`rgb(${128+Math.round(x*28)},${128+Math.round(g*22)},245)`,h.fillRect(m,f,4,4)}},256,256),this.waterNormal.colorSpace=zn,this.waterNormal.wrapS=this.waterNormal.wrapT=Pi,this.waterNormal.repeat.set(40,40),this.waterMaterial=new Tt({color:t.water,roughness:.16,metalness:.18,normalMap:this.waterNormal,normalScale:new de(.5,.5),envMapIntensity:1.3});let l=new ve(new Nt(1600,1100).rotateX(-Math.PI/2),this.waterMaterial);l.position.set(0,-3.3,-260),l.userData.ownGeometry=!0,l.receiveShadow=!0,this.world.add(l)}else{let l=new ve(new yt(1100,1,900),new Tt({color:t.ground,roughness:1}));l.position.set(0,-.56,-230),l.userData.ownGeometry=!0,l.receiveShadow=!0,this.world.add(l)}for(let l=0;l<19;l++){let h=new $e,u=new ve(new Nt(10.8,20,1,8).rotateX(-Math.PI/2),o);u.position.y=.02,u.receiveShadow=!0,h.add(u);let d=new ve(new Nt(10.8,20,1,8).rotateX(-Math.PI/2),this.asphaltMaterial);d.position.y=.02,d.receiveShadow=!0,h.add(d),h.userData.roadSurfaces=[u,d],h.userData.flexSurfaces=[u,d],h.userData.roadside=[],h.userData.scenery=[];for(let f of[-1,1]){let m=Object.values(this.kit.roadside)[0][0][f],x=new ve(m.clone(),this.sceneryMaterial);x.userData.side=f,x.receiveShadow=!0,x.userData.flatPositions=m.attributes.position.array,x.userData.flatNormals=m.attributes.normal.array,h.add(x),h.userData.roadside.push(x),h.userData.flexSurfaces.push(x);let g=new ve(this.kit.empty,this.sceneryMaterial);h.add(g),h.userData.scenery.push({mesh:g,group:g,side:f})}for(let f of[u,d])f.userData.flatPositions=f.geometry.attributes.position.array.slice(),f.userData.flatNormals=f.geometry.attributes.normal.array.slice();this.world.add(h),this.segments.push(h)}this.landmarks=[],this.rotorGeometry??=Rp();for(let l of Tp(e,window.RallyCore.ARENAS[e].length)){let h=Ap(e,l.kind,t),u=new $e,d=new ve(h.static,this.sceneryMaterial);u.add(d);let f=(h.rotors||[]).map(([m,x,g])=>{let p=new ve(this.rotorGeometry,this.sceneryMaterial);return p.position.set(m,x,g),u.add(p),p});u.visible=!1,this.world.add(u),this.landmarks.push({...l,...h,group:u,rotors:f})}this.cloudTexture=ni((l,h,u)=>{for(let d=0;d<9;d++){let f=h*(.2+.6*Math.random()),m=u*(.45+.2*Math.random()),x=h*(.12+.12*Math.random()),g=l.createRadialGradient(f,m,1,f,m,x);g.addColorStop(0,"#ffffffcc"),g.addColorStop(1,"#ffffff00"),l.fillStyle=g,l.fillRect(0,0,h,u)}},256,128),this.clouds=[];let c=window.RallyCore.random(921+e);for(let l=0;l<(e===2?14:9);l++){let h=new mi(new Zn({map:this.cloudTexture,color:e===2?7174291:16777215,opacity:e===2?.85:e===1?.5:.62,transparent:!0,fog:!1,depthWrite:!1})),u=e===2?120+c()*90:70+c()*70;h.scale.set(u,u*.36,1),h.position.set((c()-.5)*620,e===2?48+c()*30:70+c()*50,-300-c()*170),h.renderOrder=-8,h.userData.drift=.6+c()*.8,this.world.add(h),this.clouds.push(h)}if(e===2){let l=new gi(new yt(.018,1.1,.018),new dt({color:13096172,transparent:!0,opacity:.2,depthWrite:!1,fog:!1}),320);l.frustumCulled=!1,l.instanceMatrix.setUsage(ss),l.userData.drops=Array.from({length:320},(h,u)=>[(c()-.5)*44,c()*20,-c()*70+4,.7+c()*.6]),this.scene.add(l),this.rain=l}this.tunnels=du(e,window.RallyCore.ARENAS[e].length,[]),this.clearGate()}edge(e,t){let n=this.apronWidth(e);for(let s of this.forkRoutes||[]){if(e<s.bounds.start||e>s.bounds.end)continue;let r=s.routes[0],a=c=>(c=St.clamp(c,0,1),c*c*c*(10+c*(-15+6*c))),o;if(e<r.start)o=3.35+8.2-2.8*a((e-s.bounds.start)/30);else if(e>r.end)o=3.35+5.4+2.8*a((e-r.end)/40);else{let c=s.routes.map(l=>l.lane*3.35+window.RallyCore.routeOffset(l,e));o=t>0?Math.max(...c)+5.4:5.4-Math.min(...c)}n=Math.max(n,o)}return n}rebuildChunk(e,t,n){let s=Sp(this.index,t,{tunnels:this.tunnels});e.userData.plan=s;for(let[l,h]of e.userData.roadSurfaces.entries())h.geometry.dispose(),h.geometry=this.mainRoadGeometry(n,l===1),h.userData.flatPositions=h.geometry.attributes.position.array.slice(),h.userData.flatNormals=h.geometry.attributes.normal.array.slice();for(let l of e.userData.roadside){let[h,u]=s.roadside[l.userData.side],d=this.kit.roadside[h],f=d[u%d.length][l.userData.side];l.geometry.dispose(),l.geometry=f.clone(),l.userData.flatPositions=f.attributes.position.array,l.userData.flatNormals=f.attributes.normal.array,l.castShadow=!!s.tunnel}let r={"-1":5.4,1:5.4};for(let l=-10;l<=10;l+=2.5)for(let h of[-1,1])r[h]=Math.max(r[h],this.sceneryEdge(n-l,h));for(let l of e.userData.scenery){let h=s.scenery[l.side];l.mesh.geometry=h<0?this.kit.empty:this.kit.scenery[l.side][h],l.mesh.position.x=l.side*(r[l.side]+5.6)}let a=e.rotation.y,o=Math.cos(a),c=Math.sin(a);for(let l of e.userData.flexSurfaces){let h=l.geometry.attributes.position,u=l.geometry.attributes.normal,d=l.userData.flatPositions,f=l.userData.flatNormals,m=l.userData.side||0;for(let x=0;x<d.length;x+=3){let g=d[x+2],p=n-g,v=d[x]+(m?m*(this.edge(p,m)-5.4):0)+this.curve(p)-this.curve(n);h.array[x]=o*v-c*g,h.array[x+1]=d[x+1],h.array[x+2]=c*v+o*g;let b=f[x],_=f[x+1],C=f[x+2]+(this.curve(p+.1)-this.curve(p-.1))/.2*b,S=Math.hypot(b,_,C)||1;u.array[x]=(o*b-c*C)/S,u.array[x+1]=_/S,u.array[x+2]=(c*b+o*C)/S}h.needsUpdate=!0,u.needsUpdate=!0,l.geometry.computeBoundingSphere()}}sceneryEdge(e,t){let n=0;for(let s of this.coasterRanges||[])e>s.start&&e<s.end&&(n=Math.max(n,e>s.wideStart&&e<s.wideEnd?54:27));return Math.max(this.edge(e,t),n)}curve(e){return window.RallyCore.courseCurve(this.index,e)}heading(e,t){let n=window.RallyCore;return-Math.atan((this.curve(e+1)+n.routeOffset(t,e+1)-this.curve(e-1)-n.routeOffset(t,e-1))/2)}prepareCourse(e){if(this.courseState===e&&this.courseRevision===e?.taskRevision)return;this.courseState=e,this.courseRevision=e?.taskRevision,this.roadReservations=[],this.forkRanges=[],this.apronRanges=[];for(let a of e?.tasks||[]){let o=window.RallyCore.taskZone(a);if(this.roadReservations.push({start:o.start-80,end:o.end+80}),this.apronRanges.push({start:o.start-70,fullStart:o.start-30,fullEnd:o.end+25,end:o.end+80}),a.coaster){let c=a.at+a.coaster.span;this.apronRanges.push({start:c-110,fullStart:c-70,fullEnd:c+45,end:c+100})}a.kind==="junction"&&this.forkRanges.push(tc(window.RallyCore.makeRoute(e,a,0,!0,!0)))}let t=window.RallyCore;this.forkRoutes=(e?.tasks||[]).filter(a=>a.kind==="junction").map(a=>{let o=t.groundRoutes(e,a);return{routes:o,bounds:tc(o[0])}}),this.coasterRanges=(e?.tasks||[]).filter(a=>a.coaster).map(a=>{let o=l=>a.at+l*a.coaster.span/t.COASTER_SPAN,c=nc.find(l=>l.kind==="helix");return{start:a.at-40,end:a.at+a.coaster.span+30,wideStart:o(c.start-12),wideEnd:o(c.end+12)}});let n=(e?.tasks||[]).map(a=>t.taskZone(a)),s=n.map(a=>({start:a.start-80,end:a.reach+80})),r=e?.arena?.length??t.ARENAS[this.index].length;s.push({start:r-260,end:r+200}),this.tunnels=du(this.index,r,e?s:[]),this.spectators.blocked=this.tunnels;for(let a of this.segments)a.userData.curveIndex=void 0}apronWidth(e){let t=s=>(s=St.clamp(s,0,1),s*s*s*(10+s*(-15+6*s))),n=5.4;for(let s of this.apronRanges||[]){let r=Math.min(t((e-s.start)/(s.fullStart-s.start)),t((s.end-e)/(s.end-s.fullEnd)));n=Math.max(n,5.4+6.15*r)}return n}mainRoadGeometry(e,t=!1){let n=e-10,s=e+10,r=new Set;for(let f=0;f<=8;f++)r.add(n+f*2.5);for(let f of this.forkRanges||[])for(let m of[f.start,f.end])m>n&&m<s&&r.add(m);let a=[...r].sort((f,m)=>f-m),o=[],c=[],l=[],h=[],u=t?4:2;a.forEach(f=>{let m=this.apronWidth(f),x=t?[-m,-5.4,5.4,m]:[-5.4,5.4];for(let g of x)o.push(g,0,e-f),h.push(0,1,0),c.push(t?g/10.8:g<0?0:1,f/20)});for(let f=0;f<a.length-1;f++){let m=(a[f]+a[f+1])/2;if(!(this.forkRanges?.some(x=>m>x.start&&m<x.end)||t&&this.apronWidth(m)<5.40001))for(let x=0;x<u;x+=2){let g=f*u+x;l.push(g,g+1,g+u,g+u,g+1,g+u+1)}}let d=new je;return d.setAttribute("position",new Pe(o,3)),d.setAttribute("normal",new Pe(h,3)),d.setAttribute("uv",new Pe(c,2)),d.setIndex(l),d}clearGate(){for(let e of this.gates.values())this.disposeGate(e);this.gates.clear(),this.gate=new $e,this.lastGate="",this.preparedState=null}disposeGate(e){this.scene.remove(e),e.traverse(t=>{(t.isMesh||t.isLine)&&!Object.values(Da).includes(t.geometry)&&t.geometry.dispose()}),(e.userData.textures||[]).forEach(t=>t.dispose()),(e.userData.ownMaterials||[]).forEach(t=>t.dispose())}makePerson(e,t,n){let s=new $e;s.scale.setScalar(1.5);let r=[13935748,12947056,14858650,10974296][t%4],a=[7450538,12227686,9346240,11763341][t%4];Me(s,"box",a,0,1.48,0,.65,.84,.38),Me(s,"sphere",r,0,2.18,0,.29,.32,.27),Me(s,"sphere",4800059,0,2.39,-.02,.3,.15,.27);for(let h of[-1,1]){let u=Me(s,"box",3426140,h*.19,.66,0,.23,.75,.25);u.userData.leg=h,Me(s,"box",2372938,h*.19,.2,.07,.28,.2,.43);let d=Me(s,"box",a,h*.39,1.44,.12,.2,.72,.23);d.rotation.z=h*.18,Me(s,"sphere",r,h*.42,1.16,.25,.12,.12,.12),Me(s,"sphere",2503746,h*.1,2.21,.25,.036,.036,.016)}let o=ni((h,u,d)=>{h.fillStyle="#f4e9d0",h.fillRect(0,0,u,d),h.strokeStyle="#44696b",h.lineWidth=12,h.strokeRect(7,7,u-14,d-14),h.textAlign="center",h.fillStyle="#20394c",h.font="bold "+(e.length>16?36:50)+"px sans-serif",h.fillText(e,u/2,145,u-40)},512,256);n.userData.textures.push(o);let c=new dt({map:o});n.userData.ownMaterials.push(c);let l=new ve(new Nt(1.45,.72),c);return l.position.set(0,1.22,.31),s.add(l),s.userData.personIndex=t,s.userData.signPoint=new D(0,1.22,.34),s}buildCoaster(e,t,n){let s=window.RallyCore,r=s.makeRoute(n,t,t.correctIndex,!0),a=!!this.preferences.reduced,o=e.userData.coaster;o&&(e.remove(o.group),o.group.traverse(g=>{g.isMesh&&g.geometry.dispose()}));let c=hp({route:r,curve:g=>this.curve(g),offset:s.routeOffset,height:s.coasterHeight,origin:t.at,span:s.COASTER_SPAN,reduced:a}),l=g=>this.curve(g)-this.curve(t.at),h=pp(c,l,(g,p)=>this.edge(g,p)),u=new $e,d=[],f=new Ae,m=40,x=this.preferences.graphics==="battery";for(let g=r.start;g<r.end-1;g+=m){let p=c.filter((y,P)=>y.at>=g-1e-6&&y.at<=g+m+.51&&y.p[1]>.12&&(!x||P%2===0||y.inDetour)),v=[],b=(y,P)=>{let N=y.positions.length/3,B=new Float32Array(N*3);f.setHex(P);for(let H=0;H<N;H++)B.set([f.r,f.g,f.b],H*3);v.push({...y,colours:B})};if(p.length>1)for(let y of[0,r.side*3.2]){b(iu(p,up,y),4018019);for(let P of[-1.2+.12,1.2-.12])b(iu(p,dp(P),y),15226698)}let _=(y,P,N,B,H,X)=>{let q=[y,P],ee=[N,B],O=[H-X/2,H+X/2],V=[];for(let ie of q)for(let xe of ee)for(let Le of O)V.push(ie,xe,Le);return{positions:V,indices:[0,1,3,0,3,2,4,6,7,4,7,5,0,4,5,0,5,1,2,3,7,2,7,6,0,2,6,0,6,4,1,5,7,1,7,3]}};for(let y of h.filter(P=>P.at>=g&&P.at<g+m))if(y.kind==="column")b(_(y.x-.32,y.x+.32,0,y.top,y.z,.64),15855592);else{for(let P of[y.left,y.right])b(_(P-.3,P+.3,0,y.top,y.z,.6),15855592);b(_(y.left-.3,y.right+.3,y.top-.55,y.top,y.z,.7),15855592)}if(!v.length)continue;let C=[],S=[],A=[];for(let y of v){let P=C.length/3;C.push(...y.positions),S.push(...y.colours);for(let N of y.indices)A.push(N+P)}let R=new je;R.setAttribute("position",new Pe(C,3)),R.setAttribute("color",new Pe(S,3)),R.setIndex(A),R.computeVertexNormals();let M=new ve(R,this.coasterMaterial||=new Tt({vertexColors:!0,roughness:.48,metalness:.2,side:en,flatShading:!0}));M.castShadow=!x,M.visible=!1,M.scale.y=.001,u.add(M),d.push({mesh:M,start:g,end:g+m,delay:(g-r.start)/(r.end-r.start)*.32,rise:0})}if(!o){let g=new $e;for(let C of[-1.4,1.4])Me(g,"cylinder",5795967,C,3.2,0,.12,6.4,.12);let p=Np("SKY COASTER","#ffd976","THE RIGHT ANSWER RIDES IT");e.userData.textures.push(p);let v=new dt({map:p});e.userData.ownMaterials.push(v);let b=new ve(new Nt(5.4,2.7),v);b.position.set(0,5.4,.15),g.add(b);let _=t.at-130;g.position.set(this.curve(_)-this.curve(t.at)+this.edge(_,1)+3.2,0,130),g.rotation.y=-.35,e.add(g)}e.add(u),e.userData.coaster={group:u,pieces:d,frames:c,route:r,reduced:a,revealedAt:o?.revealedAt??null}}updateCoaster(e,t,n){let s=e.userData.coaster;if(!s)return;s.reduced!==!!this.preferences.reduced&&this.buildCoaster(e,t,n);let r=e.userData.coaster;if(r.revealedAt==null&&t.completed&&(r.revealedAt=this.clock),r.revealedAt==null)return;let a=this.clock-r.revealedAt;for(let o of r.pieces){let c=St.clamp((a-o.delay)/.2,0,1);o.rise=this.preferences.reduced?1:1-(1-c)**3,o.mesh.visible=o.rise>0,o.mesh.scale.y=Math.max(.001,o.rise)}}rideRise(e,t){let n=this.gates.get(e.taskId)?.userData.coaster;if(!n||n.revealedAt==null)return 0;let s=n.pieces.find(r=>t>=r.start&&t<r.end);return s?s.rise:1}ridePose(e,t,n,s,r,a){if(!e?.coaster)return null;let o=this.gates.get(e.taskId)?.userData.coaster;if(!o)return null;let c=window.RallyCore,l=fp(o.frames,t,n),h=this.rideRise(e,t),u=this.curve(o.route.start)-r,d=-(o.route.start-s)+4,f=new D(l.position[0]+u,l.position[1]*(a?1:h),l.position[2]+d),m=new ct().makeBasis(new D(...l.right),new D(...l.up),new D(...l.forward).negate()),x=new Un().setFromRotationMatrix(m);return h<1&&a&&(f.lerpVectors(a.position,f,h),x.slerpQuaternions(a.quaternion,x,h)),{position:f,quaternion:x,forward:l.forward,up:l.up,speed:l.speed*c.coasterPace(e,t),detour:l.detour*h,kind:l.kind,side:e.side,rise:h}}makeGate(e,t){let n=new $e;if(n.userData={task:e,textures:[],ownMaterials:[],barriers:[],repairSlabs:[]},e.kind==="finish"){for(let o of[-5.7,5.7])Me(n,"box",16504187,o,3,0,.45,6,.45);Me(n,"box",16767095,0,6,0,12,.8,.45);let s=Np("FINISH","#ffe296");n.userData.textures.push(s);let r=new dt({map:s});n.userData.ownMaterials.push(r);let a=new ve(new Nt(5,2.5),r);a.position.set(0,6,.3),n.add(a);for(let o=-5;o<5;o++)for(let c=0;c<3;c++)Me(n,"box",(o+c)%2?15003123:2373453,o+.5,.055,c,1,.025,1)}else if(e.kind==="pedestrian"){for(let r=-11;r<12;r+=2)Me(n,"box",15920856,0,.075,r,16.8,.025,.8);for(let r of[-1,1]){Me(n,"box",11913654,r*9.4,.12,0,2,.22,19),Me(n,"cylinder",8557470,r*5.9,2.4,-8,.12,4.8,.12);let a=Me(n,"box",15105385,r*5.9,4.6,-8,1.1,.6,.12);a.userData.crossingSignal=!0}Me(n,"box",15920856,0,.075,12,10.5,.025,.35);let s=new $e;for(let r=-32;r<=12;r+=8)Me(s,"box",8971717,0,.085,r,.16,.025,3,.4,0,3783052);s.visible=!1,n.add(s),n.userData.exitGuide=s,n.userData.people=e.people.map((r,a)=>{let o=this.makePerson(r.word,a,n);return n.add(o),o})}else if(e.kind==="light"){for(let s of[-1,1]){Me(n,"cylinder",4413546,s*12.1,3.2,0,.15,6.4,.15),Me(n,"box",4216680,s*6.1,6.4,0,12.2,.2,.25),Me(n,"box",1386040,s*3.25,5.6,0,.8,1.8,.7);for(let r=0;r<3;r++){let a=Me(n,"sphere",r===0?16737891:r===1?6181188:3361606,s*3.25,6.2-r*.57,.38,.22,.22,.08,.25,0,r===0?16728121:0);a.userData.bulb=r}}for(let s of[-1,-.4,.2])Me(n,"box",15986392,0,.04,s,10.3,.015,.22)}else if(e.kind==="repair"){let s=e.blocks.length*16;Me(n,"box",10318165,0,.03,-s/2,10.5,.05,s);for(let r=0;r<e.blocks.length;r++){let a=Me(n,"box",5467007,0,-1.5,-8-r*16,10.45,.12,15.85);n.userData.repairSlabs.push(a)}for(let r of[-1,1]){n.userData.barriers.push(Me(n,"box",15503954,r*3,1.3,-2,4,.25,.12));for(let a=0;a<3;a++)n.userData.barriers.push(Me(n,"cone",15832663,r*(3.2+a*.75),.5,1,.27,1,.27))}}else{let s=window.RallyCore,r=s.groundRoutes(t,e),a=cp(r,p=>this.curve(p),s.routeOffset,e.at),o=new je;o.setAttribute("position",new Pe(a.positions,3)),o.setAttribute("uv",new Pe(a.uvs,2)),o.setIndex(a.indices),o.computeVertexNormals();let c=new ve(o,this.asphaltMaterial);c.position.y=.02,c.receiveShadow=!0,n.add(c),n.userData.forkSurface=c,n.userData.forkRows=a.rows;let l=[];for(let p=0;p<a.rows.length-1;p++){let v=a.rows[p],b=a.rows[p+1],_=S=>Math.min(...S.intervals.map(A=>A[0])),C=S=>Math.max(...S.intervals.map(A=>A[1]));l.push(_(v),0,-v.at,C(v),0,-v.at,_(b),0,-b.at,_(b),0,-b.at,C(v),0,-v.at,C(b),0,-b.at)}let h=new je;h.setAttribute("position",new Pe(l,3)),h.computeVertexNormals();let u=new ve(h,Mn([8827004,12897481,6122339][this.index]||8827004,.95));u.position.y=-.03,u.receiveShadow=!0,n.add(u);let d=[];for(let[p,v]of a.edges)d.push(p[0],.043,-p[1],v[0],.043,-v[1]);let f=new je;f.setAttribute("position",new Pe(d,3));let m=new Li(f,new xi({color:13952218}));n.add(m),n.userData.edgeLine=m,n.userData.ownMaterials.push(m.material);for(let[p,v]of[[a.bounds.start,e.at],[r[0].end,a.bounds.end]])for(let b=p+4;b<v-2;b+=8)for(let _ of[-.5,.5]){let C=Me(n,"box",14082266,this.curve(b)-this.curve(e.at)+_*3.35,.043,e.at-b,.1,.015,2.2);C.rotation.y=this.heading(b)}let x=r[0],g=new $e;for(let p=x.end+4;p<=x.exitEndAt;p+=7)Me(g,"box",10016955,this.curve(p)-this.curve(e.at),.075,e.at-p,.18,.025,2.5,.4,0,3246951);g.visible=!1,n.add(g),n.userData.mergeGuide=g,n.userData.routePaths=[];for(let p=0;p<3;p++){let v=r[p],b=[];for(let A=0;A<=48;A++){let R=v.start+(v.end-v.start)*A/48;b.push({at:R-e.at,x:this.curve(R)-this.curve(e.at)+v.lane*3.35+s.routeOffset(v,R)})}let _=this.ribbon(n,b.map(A=>({...A,x:A.x-1.48})),.1,11843028,.045),C=this.ribbon(n,b.map(A=>({...A,x:A.x+1.48})),.1,11843028,.045),S=new $e;for(let A=v.start+8;A<v.end-5;A+=12){let R=this.curve(A)-this.curve(e.at)+v.lane*3.35+s.routeOffset(v,A),M=this.heading(A,v);for(let y of[-1,1]){let P=Me(S,"box",11843028,R+y*.28,.055,e.at-A,.09,.015,.8,.6);P.rotation.y=M+y*.7}}n.add(S),n.userData.routePaths.push({left:_,right:C,index:p,route:v,points:b,chevrons:S})}e.coaster&&this.buildCoaster(n,e,t)}return this.scene.add(n),this.gates.set(e.id,n),n}updateGates(e,t,n,s){if(!e)return;let r=e.tasks.concat({id:"finish",kind:"finish",at:e.arena.length});if(this.preparedState!==e){this.clearGate(),this.preparedState=e;for(let o of r)this.makeGate(o,e).visible=!1;this.preparedRevision=e.taskRevision}if(this.preparedRevision!==e.taskRevision){let o=new Set(r.map(c=>c.id));for(let[c,l]of this.gates)o.has(c)||(this.disposeGate(l),this.gates.delete(c));for(let c of r)!this.gates.has(c.id)&&c.at-t>window.RallyCore.TASK_VIEW_DISTANCE&&(this.makeGate(c,e).visible=!1);this.preparedRevision=e.taskRevision}for(let o of r){let c=o.at-t,l=o.kind==="finish"?80:window.RallyCore.taskZone(o).end-o.at+120,h=this.gates.get(o.id);if(h&&(h.visible=c<=window.RallyCore.TASK_VIEW_DISTANCE&&c>=-l,!!h.visible)){if(h.position.set(this.curve(o.at)-n,0,-c+4),o.kind==="junction"&&o.completed&&h.userData.chosenIndex!==o.chosenIndex){h.userData.chosenIndex=o.chosenIndex;for(let u of h.userData.routePaths||[]){let d=u.index===o.chosenIndex,f=Mn(d?o.success?11136203:15843719:7637141,.55,0,d?o.success?2647883:7031849:0);u.left.material=u.right.material=f,u.chevrons.traverse(m=>{m.isMesh&&(m.material=f)})}}o.kind==="junction"&&this.updateCoaster(h,o,e),o.kind==="junction"&&(h.userData.mergeGuide.visible=!!e.mergeAssist&&e.mergeAssist.taskId===o.id&&window.RallyCore.exitAssist(e)===e.mergeAssist),o.kind==="light"&&o.success&&h.traverse(u=>{u.userData.bulb===0&&(u.material=Mn(5977145)),u.userData.bulb===2&&(u.material=Mn(6943671,.3,0,3992465))}),o.kind==="repair"&&(h.userData.repairSlabs.forEach((u,d)=>{let f=d<(o.chosen?.length||0);u.position.y=o.solved?.12:St.damp(u.position.y,f?.12:-1.5,12,s)}),h.userData.barriers.forEach(u=>u.visible=!o.solved)),o.kind==="pedestrian"&&(h.userData.exitGuide.visible=!!window.RallyCore.exitAssist(e)&&e.exitTask===o.id&&!window.RallyCore.crosswalkOccupied(e,o),h.traverse(u=>{u.userData.crossingSignal&&(u.material=window.RallyCore.crosswalkOccupied(e,o)?Mn(15105385,.3,0,16737348):Mn(8902333,.3,0,4908708))})),o.kind==="pedestrian"&&h.userData.people.forEach((u,d)=>{let f=o.people[d],m=f.sent?Math.min(1,(e.elapsed-f.sentAt)/window.RallyCore.PEDESTRIAN_WALK_TIME):0,x=f.side===0?-1:1,g=f.sent?f.sentAt:e.elapsed,p=o.peopleEntryAt==null?0:Math.min(1,Math.max(0,(g-o.peopleEntryAt)/window.RallyCore.PEDESTRIAN_ENTRY_TIME)),v=p*p*(3-2*p),b=f.originSide*8.4*(1-v),_=f.correct===!1?Math.max(0,(m-.35)/.65):m,C=_*_*(3-2*_),S=f.correct===!1&&m<.35?(f.selectedSide===0?-1:1)*2.4*Math.sin(m/.35*Math.PI):0;u.position.set(b*(1-C)+x*8.4*C+S,.03,o.at-f.at+m*1.5),u.rotation.y=x*C*1.05,u.traverse(A=>{A.userData.leg&&(A.rotation.x=f.sent||p>0&&p<1?Math.sin(this.elapsed*9)*.3*A.userData.leg:Math.sin(this.elapsed*2+d)*.025)})})}}for(let[o,c]of this.gates)c.userData.task.at-t<-(c.userData.task.kind==="finish"?80:window.RallyCore.taskZone(c.userData.task).end-c.userData.task.at+120)&&(this.disposeGate(c),this.gates.delete(o));let a=e.task||e.tasks[e.taskIndex];a?(this.gate=this.gates.get(a.id)||this.gate,this.lastGate=a.id,this.repairSlabs=this.gate.userData.repairSlabs||[]):e.distance>e.arena.length-170&&(this.gate=this.gates.get("finish")||this.gate,this.lastGate="finish")}pedestrianProjection(e){let t=this.gates.get(e.task?.id);return t?.userData.people?(t.updateWorldMatrix(!0,!0),this.camera.updateMatrixWorld(),t.userData.people.map(n=>{let s=n.userData.signPoint.clone();return n.localToWorld(s),s.project(this.camera),{x:(s.x*.5+.5)*this.viewport.width,y:(-.5*s.y+.5)*this.viewport.height,visible:s.z>-1&&s.z<1}})):[]}updateRoadBoards(e,t){let n=e?.task,s=["task","resolving"].includes(e?.status);if(this.roadBoards.visible=s,!s){this.signAnchors=[];return}if(this.roadBoards.children.length===0)for(let c=0;c<3;c++){let l=new $e;Me(l,"cylinder",6849686,0,1.3,0,.065,2.6,.065),Me(l,"box",16569464,0,.05,0,2.5,.025,1.2),this.roadBoards.add(l)}let r=window.RallyCore.currentRow(e)||e.task?.rows[0],a=this.curve(e.distance+13)-t,o=-9+(n.completed?Math.max(0,e.distance-n.completedDistance):0);this.roadBoards.position.set(a,0,o),this.signAnchors=[];for(let c=0;c<3;c++){let l=this.roadBoards.children[c];l.visible=n.kind!=="repair"&&!(n.kind==="pedestrian"&&c===1),l.position.set((c-1)*3.35,0,0),this.signAnchors.push(new D(l.position.x+a,3.4,o))}this.promptAnchor.set(a,6.2,-30)}roadProjection(){this.camera.updateMatrixWorld();let e=t=>{let n=t.clone().project(this.camera);return{x:(n.x*.5+.5)*this.viewport.width,y:(-.5*n.y+.5)*this.viewport.height,visible:n.z>-1&&n.z<1}};return{prompt:e(this.promptAnchor),answers:this.signAnchors.map(e)}}carScreenBounds(){this.player.updateWorldMatrix(!0,!0),this.camera.updateMatrixWorld();let e=this.player.userData.hitBounds.clone().applyMatrix4(this.player.matrixWorld),t=[];for(let o of[e.min.x,e.max.x])for(let c of[e.min.y,e.max.y])for(let l of[e.min.z,e.max.z]){let h=new D(o,c,l).project(this.camera);h.z>-1&&h.z<1&&t.push({x:(h.x*.5+.5)*this.viewport.width,y:(-.5*h.y+.5)*this.viewport.height})}if(!t.length)return null;let n=Math.min(...t.map(o=>o.x))-10,s=Math.max(...t.map(o=>o.x))+10,r=Math.min(...t.map(o=>o.y))-10,a=Math.max(...t.map(o=>o.y))+10;return{left:n,right:s,top:r,bottom:a}}isCarHit(e,t){let n=this.carScreenBounds();return!!n&&e>=n.left&&e<=n.right&&t>=n.top&&t<=n.bottom}makeObstacle(e){if(e.type==="traffic")return this.makeCar(Dp[(e.color+e.id)%Dp.length],!1,lu[(e.color*3+e.id)%lu.length]);let t=new $e;if(e.type==="cones")for(let[a,o]of[[-.7,.45],[.7,.45],[0,-.65]])Me(t,"box",3357765,a,.07,o,.7,.14,.7),Me(t,"cone",15834202,a,.62,o,.34,1.1,.34),Me(t,"cone",15983805,a,.76,o,.22,.3,.22);else if(e.type==="crates")for(let[a,o,c]of[[-.5,.45,.2],[.5,.45,-.3],[.1,1.25,0]]){Me(t,"coach",11239001,a,o,c,.95,.85,.95);for(let l of[-1,1])Me(t,"box",14794116,a+l*.35,o,c+.49,.075,.75,.03)}else if(e.type==="pothole"){Me(t,"cylinder",7498594,0,.027,0,1.35,.035,1.7),Me(t,"cylinder",1583931,0,.05,0,1.1,.025,1.45),Me(t,"cylinder",3163735,0,.065,-.05,.75,.025,1.1,.18,.25);for(let a of[-1.15,1.15])Me(t,"box",15252591,a,.08,.9,.22,.1,.25)}else if(e.type==="barrels")for(let[a,o]of[[-.6,.3],[.6,-.3]]){Me(t,"cylinder",12088143,a,.62,o,.46,1.2,.46);for(let c of[.28,.87])Me(t,"cylinder",14995120,a,c,o,.475,.12,.475)}else if(e.type==="fallen_branch"){let a=Me(t,"cylinder",8414799,0,.4,0,.3,2.65,.3);a.rotation.z=Math.PI/2;let o=Me(t,"cylinder",10123609,.4,.58,-.35,.15,1.65,.15);o.rotation.z=.9,o.rotation.x=.5,Me(t,"sphere",5406054,-.65,.72,-.5,.65,.43,.6),Me(t,"sphere",7051127,.65,.9,-.5,.8,.5,.7)}else if(e.type==="tire_stack"){for(let[a,o,c]of[[-.5,.2,2],[.55,-.3,3]])for(let l=0;l<c;l++)Me(t,"cylinder",2306885,a,.2+l*.34,o,.48,.3,.48,.95),Me(t,"cylinder",4741480,a,.36+l*.34,o,.23,.025,.23,.6,.3);Me(t,"box",16241034,0,.5,.73,.36,.13,.04)}else if(e.type==="road_panels"){Me(t,"box",9991256,0,.12,0,2.1,.22,1.9);for(let a=0;a<3;a++){let o=Me(t,"box",a===2?8824494:6323853,0,.29+a*.16,a*.07,2.12,.13,1.7,.45,.35);o.rotation.y=a*.045}for(let a of[-.72,.72]){let o=Me(t,"box",16767370,a,.73,.12,.18,.03,1.65);o.rotation.y=.09}}else if(e.type==="rockfall"){for(let[a,o,c,l]of[[-.55,.48,.15,.65],[.52,.6,-.3,.72],[.05,.28,.85,.4]])Me(t,"rock",10594477,a,o,c,l,l*.85,l).rotation.set(.25+a,.4+o,.3);for(let a of[-.95,.95])Me(t,"box",15641970,a,.18,.9,.19,.36,.18),Me(t,"box",16769953,a,.28,1,.19,.1,.025)}else{Me(t,"box",16764786,0,.85,0,2.6,.75,.4);for(let a of[-.9,0,.9]){let o=Me(t,"box",2373963,a,.85,.22,.3,.76,.025);o.rotation.z=.25}for(let a of[-.9,.9])Me(t,"box",6520462,a,.3,0,.2,.6,.6)}t.updateMatrixWorld(!0);let n=new Ft;t.traverse(a=>{if(a.isMesh){let o=a.geometry.clone().applyMatrix4(a.matrixWorld);n.add("o",o,a.material.color.getHex()),o.dispose()}});let s=new ve(n.merge("o"),oM);s.castShadow=!0,s.receiveShadow=!0,s.userData.ownGeometry=!0;let r=new $e;return r.add(s),r}syncTraffic(e){if(this.trafficState!==e&&(this.traffic.forEach(t=>{t.userData.contactShadow&&this.scene.remove(t.userData.contactShadow),this.scene.remove(t),t.traverse(n=>{n.isMesh&&n.userData.ownGeometry&&n.geometry.dispose()})}),this.traffic=[],this.trafficState=e,!!e))for(let t of e.obstacles){let n=this.makeObstacle(t);n.userData.obstacle=t,this.scene.add(n),t.type==="traffic"&&this.addContactShadow(n),this.traffic.push(n)}}updateAtmosphere(e,t,n,s,r){let a=this.preferences.reduced,o=this.preferences.graphics==="battery";for(let c of this.landmarks||[]){let l=c.at-n,h=l>-90&&l<620;if(c.group.visible=h,!h)continue;let u=c.overRoad?0:c.side*(this.sceneryEdge(c.at,c.side)+c.offset);if(c.group.position.set(this.curve(c.at)-s+u,0,-l+4),c.group.rotation.y=c.overRoad?-Math.atan((this.curve(c.at+1)-this.curve(c.at-1))/2):c.side*.35,!r&&!a)for(let[d,f]of c.rotors.entries())f.rotation.z+=t*(.9+d*.15)}if(!r)for(let c of this.clouds||[])c.position.x+=t*c.userData.drift,c.position.x>340&&(c.position.x=-340);if(this.rain){let c=a?0:o?110:320;if(this.rain.visible=c>0,this.rain.count=c,c&&!r){let l=this.rainMatrix||=new xt,h=t*24,u=t*(8+(this.motion?.lastSpeed||0)*.6);for(let d=0;d<c;d++){let f=this.rain.userData.drops[d];f[1]-=h*f[3],f[2]+=u,(f[1]<-.5||f[2]>6)&&(f[1]=16+Math.random()*4,f[2]=-60+Math.random()*20,f[0]=(Math.random()-.5)*44),l.position.set(f[0],f[1],f[2]),l.rotation.x=-.18,l.updateMatrix(),this.rain.setMatrixAt(d,l.matrix)}this.rain.instanceMatrix.needsUpdate=!0}}}update(e,t,n="home"){let s=e*(t?.worldTimeScale??1);this.clock=(this.clock||0)+e,(!t||!["paused","finished","failed","countdown"].includes(t.status))&&(this.elapsed+=s),this.syncTraffic(t),this.syncRivals(t),this.prepareCourse(t);let r=!!t,a=r?t.distance:this.showcaseDistance+=e*6,o=this.curve(a)+window.RallyCore.routeOffset(t?.route,a),c=Math.floor(a/20)-3,l=this.segments.length;for(let O=0;O<l;O++){let V=c+((O-c)%l+l)%l,ie=V*20+10,xe=ie-a,Le=this.segments[O];Le.userData.courseIndex=V,Le.position.set(this.curve(ie)-o,0,-xe+4),Le.rotation.y=-Math.atan((this.curve(ie+10)-this.curve(ie-10))/20),Le.userData.curveIndex!==V&&(Le.userData.curveIndex=V,this.rebuildChunk(Le,V,ie))}let h=t&&["paused","finished","failed","countdown"].includes(t.status);this.updateAtmosphere(e,s,a,o,h),this.spectators.update(s,t,this.index,a,o,O=>this.curve(O),this.preferences,h);for(let O of this.rivalCars){let V=O.userData.rival,ie=V.at-a;if(O.visible=ie>-60&&ie<330,O.position.set(this.curve(V.at)+window.RallyCore.routeOffset(V.route,V.at)-o+V.lanePos*3.35+(V.passingOffset||0),0,-ie+4),O.rotation.y=this.heading(V.at,V.route)-St.clamp((V.lane-V.lanePos)*.16,-.16,.16),V.route?.coaster){let Le=t.tasks.find(st=>st.id===V.route.taskId),it=Le&&window.RallyCore.makeRoute(t,Le,Le.correctIndex,!0,!0);O.position.x+=it?window.RallyCore.routeOffset(it,V.at)-window.RallyCore.routeOffset(V.route,V.at):0;let ht=this.ridePose(V.route,V.at,V.passingOffset||0,a,o,{position:O.position.clone(),quaternion:O.quaternion.clone()});ht&&(O.position.copy(ht.position),O.quaternion.copy(ht.quaternion))}h||(O.userData.wheelAngle=((O.userData.wheelAngle||0)+Math.max(0,V.at-(O.userData.previousAt??V.at))/.43)%(Math.PI*2),O.userData.previousAt=V.at),this.animateCar(O,O.userData.wheelAngle||0,-(V.lane-V.lanePos)*.28,V.braking),O.userData.nitroExhaust.visible=!!V.nitroActive&&!h,this.placeContactShadow(O);let xe=Math.sign((V.plannedLane??V.lane)-V.lanePos);for(let Le of O.userData.indicators||[])Le.visible=xe!==0&&(V.plannedLane!=null||Math.abs(V.lane-V.lanePos)>.05)&&Le.userData.indicator===xe&&Math.floor((t.elapsed||0)*3)%2===0}for(let O of this.traffic){let V=O.userData.obstacle,ie=V.at-a;O.visible=!V.dormant&&ie>-50&&ie<360,O.position.set(window.RallyCore.actorX(t,V)-o,0,-ie+4);let xe=V.changed&&V.laneProgress<1,Le=xe?St.clamp(-(V.target-V.fromLane)*Math.sin(V.laneProgress*Math.PI)*.12,-.16,.16):0;O.rotation.y=this.heading(V.at,V.route)+Le,(O.userData.indicators||[]).forEach(it=>{it.visible=(V.moving||V.routeChanging)&&xe&&it.userData.indicator===Math.sign(V.target-V.fromLane)&&Math.floor((t?.elapsed||0)*3)%2===0}),O.rotation.z=V.hit&&t.elapsed-(V.hitAt??0)<.45?Math.sin(t.elapsed*18)*.08:0,h||(O.userData.wheelAngle=((O.userData.wheelAngle||0)+Math.max(0,V.at-(O.userData.previousAt??V.at))/.43)%(Math.PI*2),O.userData.previousAt=V.at),this.animateCar(O,O.userData.wheelAngle||0,Le,V.braking||V.waiting),this.placeContactShadow(O)}this.updateGates(t,a,o,s),this.motionState!==t&&(this.motionState=t,this.motion=op(this.currentLane,t?.roadTravel??a));let u=t?t.arena.speed*t.speedFactor*(t.worldTimeScale??1):6;t?.focusAuto&&(this.motion.lastSpeed=u);let d=this.motion.lane;if(lp(this.motion,t?.lane||0,t?.roadTravel||a,u,t?.focusAuto&&["light","junction"].includes(t.task?.kind)?e:s,h),t&&!h&&!window.RallyCore.playerLaneClear(t,d,this.motion.lane)){let O=window.RallyCore.playerLaneBlocker(t,d,this.motion.lane);this.motion.lane=d,this.motion.velocity=0,this.motion.steer=0,window.RallyCore.contactBump(t,O)}this.currentLane=this.motion.lane;let f=this.currentLane*3.35,m=n==="home"&&this.viewport.width<760&&this.viewport.height>this.viewport.width?-9:4,x=this.ridePose(t?.route,a,0,a,o,null);this.lastRide&&!x&&(this.landedAt=this.clock),this.lastRide=!!x;let g=this.landedAt!=null&&!this.preferences.reduced?this.clock-this.landedAt:1/0,p=g<1.2?-.11*Math.exp(-g*4.5)*Math.sin(g*15):0;this.player.position.set(f,.04+p+(this.preferences.reduced?0:this.motion.bob),m),this.player.rotation.set(this.preferences.reduced?0:this.motion.pitch,this.heading(a,t?.route)+this.motion.steer*.22,this.preferences.reduced?0:this.motion.roll),x&&(this.player.position.copy(x.position),this.player.quaternion.copy(x.quaternion));let v=x?x.position.y:0;this.rideSpeed=x?x.speed:1,this.animateCar(this.player,this.motion.wheelAngle,this.motion.steer,this.motion.braking||!!t?.yielding&&u<.5),this.player.visible=!0,this.shadow.position.set(x?x.position.x:f,.07+v,x?x.position.z:m),this.shadow.visible=!x||x.up[1]>.8,this.shadow.rotation.z=-this.player.rotation.y,this.nitroReadyGlow.position.set(x?x.position.x:f,.08+v,x?x.position.z:m),this.nitroReadyGlow.rotation.z=-this.player.rotation.y,this.nitroReadyGlow.visible=!h&&!t?.nitroActive&&window.RallyCore.canEngageNitro(t),this.nitroReadyGlow.scale.setScalar(this.preferences.reduced?1:1+Math.sin(this.elapsed*3)*.025),this.damageFx.update(e,t,this.preferences,h),this.boostFx.update(s,t,this.preferences,h),this.waterNormal&&!h&&!this.preferences.reduced&&this.waterNormal.offset.set(this.elapsed*.009,this.elapsed*.005),this.trail.children.forEach((O,V)=>{O.visible=!!t&&!h&&!this.preferences.reduced&&this.preferences.graphics!=="battery"&&(this.lookConfig.trail||t.nitroActive)&&u>2,O.position.set(f+(V%2?1:-1)*.64,.08+v,m+3+V*.45),O.material=Mn(t?.nitroActive?9035263:8440760,.5,0,t?.nitroActive?2529481:3570791),O.scale.z=1-V/16});let b=t&&["paused","finished","failed"].includes(t.status),_=this.viewport.width<760&&this.viewport.height>this.viewport.width,C=n==="home",S=C?_?2:-5:t?.status==="task"?f*.7:f*.35,A=C?_?9:4.4:t?.status==="task"?7.2:6.2,R=C?_?16:20:t?.status==="task"?17:16;!C&&!this.preferences.reduced&&t?.status!=="task"&&(R+=Math.min(2.4,Math.max(0,t.speedFactor-1)*.9)),this.rideCam??=new D(0,0,4);let M=x?x.position:new D(f,0,m);for(let O of["x","y","z"])this.rideCam[O]=St.damp(this.rideCam[O],M[O],O==="y"?7:5,e);this.rideWide=St.damp(this.rideWide||0,St.clamp((x?.detour||0)/5,0,1),3.5,e);let y=this.rideWide;this.rideSide=x?x.side:this.rideSide||1,x?.kind&&(this.rideKind=x.kind);let P=this.rideKind==="helix";if(this.rideLift=this.rideCam.y,A+=this.rideLift+(P?9:4.5)*y,R+=(this.rideCam.z-m)*.55*(1-y)+(P?8:4)*y,S+=(this.rideCam.x-f)*.6+this.rideSide*(P?-4:13)*y,x&&!this.preferences.reduced&&(R+=1.4+Math.min(2.2,Math.max(0,this.rideSpeed-1)*1.6),A+=.6),!C&&!this.preferences.reduced&&t?.status!=="task"&&(A-=.45*this.boostFx.intensity,R+=.9*this.boostFx.intensity),!C&&t?.status!=="task"){let O=St.clamp((.95-this.viewport.width/this.viewport.height)/.5,0,1);R+=6.5*O,A+=2.4*O}b||(this.camera.position.x=St.damp(this.camera.position.x,S,4,e),this.camera.position.y=St.damp(this.camera.position.y,A,4,e),this.camera.position.z=St.damp(this.camera.position.z,R,4,e));let N=Math.max(24,Math.min(52,2*Math.atan(this.viewport.height*3.35/(54*Math.min(140,(this.viewport.width-24)/3)))*180/Math.PI));b||(this.camera.fov=St.damp(this.camera.fov,t?.status==="task"?N:r?52+(this.preferences.reduced?0:Math.min(12,Math.max(0,t.speedFactor-1)*5.4)+(x?St.clamp((this.rideSpeed-1)*10,0,13):0)):52,t?.nitroActive?9:4,e)),this.camera.updateProjectionMatrix();let B=Math.atan2(this.camera.position.y-this.rideLift-.8,Math.max(1,this.camera.position.z-4))-Math.atan(.58*Math.tan(this.camera.fov*Math.PI/360)),H=this.camera.position.y-Math.tan(B)*(this.camera.position.z+11);if(!b){let O=this.preferences.reduced?0:St.clamp(-this.heading(a+10,t?.route)*6,-2.2,2.2),V=C?0:(this.rideCam.x-f)*.85;if(this.look.set(C?_?-1.8:-6.5:t?.status==="task"?f*.65:f*.25+O+V,C?_?-1:-.5:H+(x&&!this.preferences.reduced?St.clamp(x.forward[1]*7,-4,6):0),C?_?-9:-6:-11+(this.rideCam.z-m)*.8),!C&&y>.001){let ie=x?x.position:this.rideCam;this.look.lerp(new D(ie.x,ie.y+1,ie.z),y)}this.camera.lookAt(this.look)}let X=this.arenaLook,q=St.clamp(t?.focusAmount||0,0,1),ee=this.preferences.reduced?0:this.boostFx.intensity;this.sun.intensity=X.sunIntensity*(1-.2*q),this.hemi.intensity=X.hemi*(1-.08*q),this.renderer.toneMappingExposure=X.exposure*(1-.07*q)+ee*.05,this.scene.fog.color.setHex(X.fog).lerp(this.focusTint,.24*q),this.updateRoadBoards(t,o),this.renderer.render(this.scene,this.camera)}};function Op(i){return String(i).toLowerCase().replace(/\b[a-z]/g,e=>e.toUpperCase()).replace(/\bTv\b/g,"TV")}function Bp(i,e,t,n){let s=Math.max(1,...String(i).trim().split(/\s+/u).map(n));return Math.max(.1,Math.floor(Math.min(t,t*Math.max(1,e-2)/s)*10)/10)}function kp(i,{width:e,top:t,bottom:n}){let s=[];for(let r of[...i].sort((a,o)=>Math.abs(a.distance)-Math.abs(o.distance)))!r.visible||Math.abs(r.distance)>150||r.x<42||r.x>e-42||r.y<t+30||r.y>n-16||s.some(a=>Math.abs(a.x-r.x)<82&&Math.abs(a.y-r.y)<32)||s.push(r);return s.map(r=>r.id)}function zp(i,e){let n=(i-24)/3,s=e.map(u=>u.x),r=s[1],a=Math.min(Math.abs(s[1]-s[0]),Math.abs(s[2]-s[1])),o=Math.min(n,Math.max(Math.min(100,n),a)),c=Math.min(34,Math.max(24,o*.28)),l=Math.min(168,Math.max(1,o-c)),h=Math.max(12+o+l/2,Math.min(i-12-o-l/2,r));return[0,1,2].map(u=>({x:h+(u-1)*o,width:l,gap:c,cellLeft:h+(u-1.5)*o,cellRight:h+(u-.5)*o}))}function uM(i,e,t){let n=0,s=1;for(let[r,a,o,c]of[[i.x,e.x-i.x,t.left,t.right],[i.y,e.y-i.y,t.top,t.bottom]])if(Math.abs(a)<1e-8){if(r<o||r>c)return null}else{let l=(o-r)/a,h=(c-r)/a;if(l>h&&([l,h]=[h,l]),n=Math.max(n,l),s=Math.min(s,h),n>s)return null}return n}function Hp(i,e,t,n=[]){return t.map(s=>({id:s.id,t:uM(i,e,s)})).filter(s=>s.t!==null&&!n.includes(s.id)).sort((s,r)=>s.t-r.t).map(s=>s.id)}function Gp({hudBottom:i,promptHeight:e,answerHeight:t,promptY:n,answerY:s,controlsTop:r,repair:a=!1,landscape:o=!1,viewportHeight:c=1/0}){let l=o?8:12,h=i+l,u=r-12,d=Math.min(u+(o?56:0),c-12),f=Math.max(0,u-h-e-l-t),m=a?Math.min(80,f):0,x=o?0:m,p=h+e/2,v=p+e/2+l+t/2,b=u-x-t/2,_=Math.max(v,Math.min(s,Math.max(v,b)));return a&&o&&(m=Math.min(80,Math.max(0,d-_-t/2))),{py:p,ay:_,stagger:m,bottom:u,centerBottom:d}}var ys=["boulevard","coast","storm"],dc=i=>i==="standard"?"challenge":i,gu=[{id:"gold",name:"Sunrise Gold",color:15973461,tier:0},{id:"lagoon",name:"Lagoon Pearl",color:5618094,tier:1},{id:"ruby",name:"Ember Ruby",color:13066354,tier:2},{id:"midnight",name:"Midnight Violet",color:7959477,tier:3}];function Vp(i){i.difficulty==="standard"&&(i.difficulty="challenge"),i.progress=i.progress&&typeof i.progress=="object"?i.progress:{};for(let t of Object.keys(i.progress))if(t.endsWith(":standard")){let n=t.slice(0,-9)+":challenge",s=i.progress[t],r=i.progress[n];i.progress[n]=[0,1,2].map(a=>Math.max(0,Math.min(3,Number(s?.[a])||0),Math.min(3,Number(r?.[a])||0))),delete i.progress[t]}i.teamId=sn(i.teamId)?.id||null;let e={};for(let[t,n]of Object.entries(i.arenaWins||{})){let s=t.endsWith(":standard")?t.slice(0,-9)+":challenge":t;e[s]=ys.map((r,a)=>e[s]?.[a]===!0||n?.[a]===!0)}for(let t of Array.isArray(i.ulti?.receipts)?i.ulti.receipts:[]){if(!t||t.sourceGame!=="wordshift-rally"||!sn(t.teamId))continue;let n=ys.indexOf(t.arenaId),s=dc(t.difficulty);if(n<0||!["relaxed","challenge"].includes(s)||typeof t.unitId!="string"||!t.unitId)continue;let r=t.unitId+":"+s;(e[r]||=ys.map(()=>!1))[n]=!0}return i.arenaWins=e,Yu(i),i.fuel=Number.isFinite(i.fuel)?Math.max(0,Math.min(100,i.fuel)):0,i.mastery=i.mastery&&typeof i.mastery=="object"?i.mastery:{},i.reviewQueue=i.reviewQueue&&typeof i.reviewQueue=="object"?i.reviewQueue:{},i.look={paint:"gold",badge:0,trail:!1,...i.look},i}function Ua(i,e,t,n){return Number.isInteger(n)&&n>=0&&n<ys.length&&ys.slice(0,n).every((s,r)=>i.arenaWins?.[e+":"+dc(t)]?.[r]===!0)}function Wp(i,e,t){if(!Cr(e)||e.reviewLap||t!==1||!Number.isInteger(e.arenaIndex)||e.arenaIndex<0||e.arenaIndex>=ys.length||typeof e.unit?.id!="string"||!["relaxed","challenge"].includes(dc(e.difficulty)))return!1;let n=e.unit.id+":"+dc(e.difficulty);i.arenaWins||={};let s=i.arenaWins[n]||=ys.map(()=>!1),r=s[e.arenaIndex]!==!0;return s[e.arenaIndex]=!0,r}function xu(i,e){return i.mastery[e]||={seen:{},clean:{},total:0,firstTry:0,arenas:0,tier:0}}function Xp(i,e,t){let n=xu(i,e);for(let s of t)n.seen[s.key]=!0,n.total++,s.firstTry&&(n.firstTry++,n.clean[s.key]=!0);return $p(n)}function qp(i,e,t){let n=xu(i,e);return n.arenas|=1<<t,$p(n)}function $p(i){let e=i.tier,t=Object.keys(i.clean).length,n=i.total?i.firstTry/i.total:0,s=[0,1,2].filter(r=>i.arenas&1<<r).length;return n>=.9&&(t>=6&&s>=1&&(i.tier=Math.max(i.tier,1)),t>=12&&s>=2&&(i.tier=Math.max(i.tier,2)),t>=18&&s===3&&(i.tier=3)),i.tier>e?i.tier:0}function fc(i,e){let t=xu(i,e);return{unique:Object.keys(t.clean).length,accuracy:t.total?Math.round(t.firstTry/t.total*100):0,arenas:[0,1,2].filter(n=>t.arenas&1<<n).length,tier:t.tier}}function pc(i){return Math.max(0,...Object.values(i.mastery).map(e=>e.tier||0))}function yu(i,e,t){let n=pc(i);if(e==="paint"){let s=gu.find(r=>r.id===t);if(!s||s.tier>n)return!1;i.look.paint=t}else if(e==="badge"){if(!Number.isInteger(t)||t<0||t>n)return!1;i.look.badge=t}else if(e==="trail"){if(t&&n<3)return!1;i.look.trail=!!t}else return!1;return!0}function _s(i){let e=pc(i),t=gu.find(n=>n.id===i.look.paint&&n.tier<=e)||gu[0];return{color:sn(i.teamId)?.color??t.color,teamId:sn(i.teamId)?.id??null,paint:t.id,badge:Math.min(e,Math.max(0,Number(i.look.badge)||0)),trail:!!i.look.trail&&e>=3}}var le=window.RallyCore,I=i=>document.getElementById(i),ki=window.LANGUAGE_BANK,Ha=i=>`<span class="modal-host" aria-hidden="true"><img src="img/saymaz-${i}.png" alt="" draggable="false"></span>`,_t=i=>String(i).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]);function dM(i){let e=i?.closest?i:i?.parentElement;return["input","textarea","select",'[contenteditable="true"]','[contenteditable="plaintext-only"]'].some(t=>e?.closest?.(t))}for(let i of["selectstart","dragstart","contextmenu"])I("app").addEventListener(i,e=>{dM(e.target)||e.preventDefault()},{capture:!0});function im(){let i=window.getSelection?.();i?.rangeCount&&i.removeAllRanges()}var sm="wordshift-rally.v1",J={grade:5,unit:"g5u1",difficulty:"relaxed",sound:!1,progress:{},tutorial:!1},Au=!0;try{let i=localStorage.getItem(sm);i&&(J={...J,...JSON.parse(i)})}catch{Au=!1}ki.some(i=>i.grade===J.grade)||(J.grade=5);(!J.progress||typeof J.progress!="object")&&(J.progress={});Vp(J);le.DIFFICULTIES[J.difficulty]||(J.difficulty="relaxed");var Zt=0,w=null,vt,Sr="home",Na="",vc="",bc=null,Oi=0,rm=null,mc=!1,bu=0,bs=0,Bi=()=>ki.find(i=>i.grade===J.grade).units.find(i=>i.id===J.unit)||ki.find(i=>i.grade===J.grade).units[0],am=()=>J.unit+":"+J.difficulty,fM=()=>J.progress[am()]||[0,0,0],gc=i=>Ua(J,J.unit,J.difficulty,i),Yp=i=>le.ARENAS.find((e,t)=>t<i&&!J.arenaWins[am()]?.[t])?.name;function Gn(){try{localStorage.setItem(sm,JSON.stringify(J))}catch{Au=!1}}var Ke=new $a(()=>J.sound),om=window.matchMedia("(prefers-reduced-motion: reduce)"),Mc=window.matchMedia("(pointer: coarse)"),Ru=new URLSearchParams(globalThis.location?.search||"").get("touch")==="1",Yt=Ru||Mc.matches||navigator.maxTouchPoints>0&&!window.matchMedia("(hover: hover)").matches,Su=0,xc=null,zi=null,Fa=0,un=null,Mr=()=>Zu(J.preferences,om.matches),ka=!0,lm=0,_u,Zp=new WeakMap,Oa={hudBottom:155,controlsTop:innerHeight-90,promptHeight:60,answerHeight:80},yc=typeof ResizeObserver=="function"?new ResizeObserver(()=>{ka=!0}):null;function ws(){ka=!0,lm++}var Eu=i=>`emoji/${i}.webp`,pM=i=>{if(typeof Image=="function")for(let e of i?.tasks||[])for(let t of[e.image,...e.optionImages||[]])t&&(new Image().src=Eu(t))},Kp=i=>String(i).split(/(\s+)/u).map(e=>/^\s*$/u.test(e)?_t(e):`<span class="sign-word">${_t(e)}</span>`).join("");function Jp(i,e,t){let n=lm+"|"+t.toFixed(1)+"|"+e.textContent;if(Zp.get(e)===n)return;_u??=document.createElement("canvas").getContext("2d");let s=getComputedStyle(i),r=parseFloat(s.fontSize),a=["paddingLeft","paddingRight","borderLeftWidth","borderRightWidth"].reduce((c,l)=>c+(parseFloat(s[l])||0),0);_u.font=`${s.fontWeight} ${r}px ${s.fontFamily}`;let o=Bp(e.textContent,t-a,r,c=>_u.measureText(c).width);vs(e,"fontSize",o+"px"),Zp.set(e,n),ka=!0}document.fonts?.ready.then(ws);for(let i of["app","hud","controls","road-prompt"])yc?.observe(I(i));function za(i){i=Ru||!!i;let e=Yt!==i;Yt=i,document.body.classList.toggle("touch-controls",Yt),I("controls").setAttribute("aria-hidden",String(Yt)),Yt&&(I("controls").hidden=!0),I("touch-nitro").hidden=!Yt||!w||!["driving","task","resolving"].includes(w.status),e&&ws()}Mc.addEventListener?.("change",()=>za(Mc.matches));document.addEventListener("pointerdown",i=>{i.pointerType==="touch"||i.pointerType==="pen"?za(!0):i.pointerType==="mouse"&&!Mc.matches&&za(!1)},{capture:!0});function Sc(){let i=window.visualViewport;if(i&&Math.abs((i.scale||1)-1)>.01)return;let e=i?.height||innerHeight,t=i?.width||innerWidth;e>0&&Number.isFinite(e)&&document.documentElement.style.setProperty("--play-height",e+"px"),document.body.classList.toggle("short-viewport",t<=760&&e<640&&e>=t),document.body.classList.toggle("compact-landscape",t>e&&e<=300),za(Yt),vt?.resize(),ws()}window.addEventListener("resize",Sc);window.addEventListener("pageshow",Sc);window.visualViewport?.addEventListener("resize",Sc);Sc();function vs(i,e,t){i.style[e]!==t&&(i.style[e]=t)}function nt(i,e){let t=I(i),n=String(e);t.textContent!==n&&(t.textContent=n,["road-question","road-feedback","road-kicker"].includes(i)&&ws())}function cm(){if(ka){ka=!1;let i=[...I("road-answers").querySelectorAll("button")],e=window.visualViewport,t=e?.width||innerWidth,n=e?.height||innerHeight;Oa={hudBottom:I("hud").getBoundingClientRect().bottom,controlsTop:Yt?Qu(t,n):I("controls").getBoundingClientRect().top,promptHeight:I("road-prompt").offsetHeight,answerHeight:Math.max(56,...i.map(s=>s.offsetHeight))},document.body.style.setProperty("--hud-bottom",Oa.hudBottom+"px")}return Oa}function Cu(){let i=Mr();document.body.classList.toggle("reduced-motion",i.reduced),vt?.setPreferences(i)}om.addEventListener?.("change",Cu);function ii(i){if(!(!Mr().haptics||!window.matchMedia("(pointer: coarse)").matches))try{navigator.vibrate?.({click:8,correct:[12,30,18],collision:45,go:[15,25,25],finish:[20,50,30,50,50]}[i]||8)}catch{}}function hm(){let i=!!w&&le.pause(w),e=()=>{let t=Mr();Hi(`<span class="modal-kicker">MAKE IT YOUR DRIVE</span><h2 id="modal-title">Driver settings.</h2><p>Comfort, sound and performance. Your choices are saved on this device.</p><div class="setting-row"><div><strong>Sound</strong><small>Engine, road and answer cues</small></div><button class="setting-toggle" id="setting-sound" aria-pressed="${J.sound}">${J.sound?"ON":"OFF"}</button></div><div class="setting-row"><div><strong>Vibration</strong><small>Light feedback on supported phones</small></div><button class="setting-toggle" id="setting-haptics" aria-pressed="${t.haptics}">${t.haptics?"ON":"OFF"}</button></div><label class="setting-label" for="setting-graphics">GRAPHICS</label><select id="setting-graphics"><option value="auto">Auto \xB7 adapts to your device</option><option value="high">High \xB7 sharper picture</option><option value="battery">Battery saver \xB7 lighter rendering</option></select><label class="setting-label" for="setting-motion">MOTION</label><select id="setting-motion"><option value="system">Follow device settings</option><option value="full">Full \xB7 camera and effects</option><option value="reduced">Reduced \xB7 steady camera, fewer effects</option></select><p class="save-note">Auto lowers rendering resolution if frame times stay high. Battery saver reduces shadows and effects.</p><button class="primary" id="settings-done">${i?"BACK TO THE RACE":"DONE"} \u2197</button>`),I("setting-graphics").value=t.graphics,I("setting-motion").value=t.motion;let n=(s,r)=>{J.preferences={...Mr(),[s]:r},Gn(),Cu()};I("setting-sound").onclick=()=>{J.sound=!J.sound,Ke.unlock(),Ec(),Gn(),e()},I("setting-haptics").onclick=()=>{n("haptics",!t.haptics),ii("click"),e()},I("setting-graphics").onchange=s=>n("graphics",s.target.value),I("setting-motion").onchange=s=>n("motion",s.target.value),I("settings-done").onclick=()=>{Vn(),i&&le.resume(w),I("settings").focus()}};e()}function mM(){let i=I("celebration");i.hidden=!1,i.innerHTML=Mr().reduced?"":Array.from({length:30},(e,t)=>`<i style="--x:${t*37%100}%;--delay:${t%7*.09}s;--turn:${t*47}deg;--colour:${["#fbd477","#83decc","#fff4d6"][t%3]}"></i>`).join(""),document.body.classList.add("race-finished"),ii("finish")}function Ec(){I("sound").classList.toggle("off",!J.sound),I("sound").setAttribute("aria-pressed",String(J.sound)),I("sound").setAttribute("aria-label",J.sound?"Mute sound":"Enable sound")}function Ms(i,e=!1,t=null){if(w&&["task","resolving"].includes(w.status)){nt("road-feedback",i),I("road-feedback").classList.toggle("bad",e),Fa=performance.now()+1600;return}(!un||e||!un.bad)&&(un={text:i,bad:e,valid:t,expiresAt:performance.now()+5e3})}function jp(i,e){if(un&&(un.expiresAt<i||un.valid&&!un.valid())&&(un=null),!e.announcementsAllowed){I("toast").classList.remove("visible"),Oi=0;return}if(un&&i>=Oi){let t=un;un=null,I("toast").textContent=t.text,I("toast").className="visible"+(t.bad?" bad":""),Oi=i+1500}i>Oi&&I("toast").classList.remove("visible")}function gM(i){let e=["#83c6dc","#63ced3","#4b5c89"][i],t=["#76a88c","#3c98a3","#455d77"][i];return`<svg viewBox="0 0 150 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="150" height="100" fill="${e}"/><circle cx="119" cy="22" r="10" fill="${i===2?"#d5d5dc":"#ffe4a3"}"/><path d="M0 65h150v35H0Z" fill="${t}"/>${i===0?'<path fill="#d2d7bc" d="M6 70V39h16v31h8V28h19v42h24V44h20v26h12V22h19v48Z"/><path fill="#64897d" d="M0 73 35 55 66 70 101 51 150 70v30H0Z"/>':i===1?'<path d="M0 75q15-7 30 0t30 0t30 0t30 0t30 0" fill="none" stroke="#a4e6da" stroke-width="2"/><path d="M13 68V30m116 38V30M13 36q57 42 116 0M13 30l57 38 59-38" stroke="#dce9d9" stroke-width="3" fill="none"/>':'<path fill="#899aab" d="m0 72 37-50 30 38 28-48 55 62v26H0Z"/><path fill="#bfcbd2" d="m22 42 15-20 15 19-14-4Zm57-6 16-24 19 24-19-6Z"/><path fill="#415a72" d="m0 92 40-35 33 34 33-28 44 30v7H0Z"/>'}<path fill="#2c475b" d="m68 54 14 0 39 46H30Z"/><path d="m74 59-2 9m-1 7-5 15" fill="none" stroke="#fff0bd" stroke-width="2"/><path d="M0 94h150v6H0Z" fill="#102e48" opacity=".5"/></svg>`}function Ts(){pm(),J.unit=Bi().id,document.querySelectorAll("[data-team]").forEach(t=>{let n=t.dataset.team===J.teamId;t.classList.toggle("selected",n),t.setAttribute("aria-pressed",String(n))}),I("start").disabled=!sn(J.teamId),I("start").querySelector("span").textContent=J.teamId?"START YOUR ENGINE":"CHOOSE YOUR TEAM",Ga(),nt("lesson-grade",J.grade),nt("lesson-meta",`GRADE ${J.grade} ${Ir[J.grade]} \xB7 UNIT ${ki.find(t=>t.grade===J.grade).units.indexOf(Bi())+1}`),nt("lesson-unit",Bi().title),I("lesson-picker").setAttribute("aria-label",`Choose your lesson: Grade ${J.grade} ${Ir[J.grade]}, ${Bi().title}`),document.querySelectorAll("[data-diff]").forEach(t=>{t.classList.toggle("selected",t.dataset.diff===J.difficulty),t.setAttribute("aria-pressed",String(t.dataset.diff===J.difficulty))}),I("difficulty-note").textContent={relaxed:"More time. Real racing.",challenge:"Fast rivals. Race to win."}[J.difficulty];let i=fM();gc(Zt)||(Zt=0),I("total-stars").textContent=i.reduce((t,n)=>t+n,0)+" / 9 stars",I("arena-cards").innerHTML=le.ARENAS.map((t,n)=>{let s=!gc(n);return`<button class="arena-card ${Zt===n?"selected ":""}${s?"locked":""}" data-arena="${n}" style="--accent:${t.color}" aria-pressed="${Zt===n}" aria-label="${_t(t.name)}${s?", locked. Finish first in "+Yp(n)+" to unlock.":", "+i[n]+" stars"}"><span class="arena-number">${s?"LOCKED":String(n+1).padStart(2,"0")}</span><span class="arena-mini ${t.id==="coast"?"coast":t.id==="storm"?"storm":""}">${gM(n)}</span><strong>${_t(t.name)}</strong><span class="stars">${s?"\u2014":"\u2605".repeat(i[n])+"\u2606".repeat(3-i[n])}</span></button>`}).join(""),I("arena-cards").querySelectorAll("button").forEach(t=>t.onclick=()=>{let n=+t.dataset.arena;if(!gc(n)){Ms("Finish first in "+Yp(n)+" to unlock.");return}Zt=n,Ke.tone("click"),Ts()}),I("scene-name").textContent=le.ARENAS[Zt].name.toUpperCase(),I("scene-name").nextElementSibling.textContent=String(Zt+1).padStart(2,"0")+" / 03",document.documentElement.style.setProperty("--accent",le.ARENAS[Zt].color),vt?.setup(Zt),Gn(),nt("arena-length",(le.ARENAS[Zt].length/1e3).toFixed(2)+" KM"),nt("arena-checkpoints",le.ARENAS[Zt].checkpoints+" CHECKPOINTS"),nt("ride-name",sn(J.teamId)?.name.toUpperCase()||"CHOOSE A TEAM");let e=fc(J,J.unit);I("mastery-preview").textContent=`UNIT MASTERY \xB7 ${e.unique} ITEMS \xB7 ${e.accuracy}% FIRST TRY${e.tier?" \xB7 "+["","EXPLORER","SCHOLAR","MASTER"][e.tier]:""}`,vt?.setCosmetics(_s(J))}function xM(){if(Sr!=="home")return;let i=J.grade,e=J.unit;Hi(`<div class="lessons-heading"><div><h2 id="modal-title">Lessons</h2><p id="lessons-intro">Choose your lesson</p></div><button id="lesson-close" class="lesson-close" aria-label="Close Lessons">\xD7</button></div><div class="lessons-grades-section"><span class="setting-label" id="grade-label">GRADE / LEVEL</span><div class="grades lesson-grades" role="group" aria-labelledby="grade-label">${ki.map(n=>`<button type="button" data-grade="${n.grade}" aria-label="Grade ${n.grade} ${Ir[n.grade]}" aria-pressed="${n.grade===i}"><span>GRADE ${n.grade}</span><strong>${Ir[n.grade]}</strong></button>`).join("")}</div></div><span class="setting-label" id="unit-label">THEME / UNIT</span><div id="unit" class="lesson-units" role="group" aria-labelledby="unit-label"></div><div class="lesson-confirm"><p id="lesson-preview" class="lesson-preview"></p><div class="modal-actions"><button id="lesson-cancel" class="secondary">CANCEL</button><button id="lesson-apply" class="primary">USE THIS LESSON \u2197</button></div></div>`),I("modal").classList.add("lessons-modal");let t=()=>{let n=ki.find(r=>r.grade===i).units;n.some(r=>r.id===e)||(e=n[0].id),document.querySelectorAll("[data-grade]").forEach(r=>{let a=+r.dataset.grade===i;r.classList.toggle("selected",a),r.setAttribute("aria-pressed",String(a))}),I("unit").innerHTML=n.map((r,a)=>`<button type="button" class="lesson-unit-option" data-unit="${r.id}" aria-label="Unit ${a+1}: ${_t(r.title)}" aria-describedby="lesson-summary-${r.id}"><span class="unit-number" aria-hidden="true">${a+1}</span><span class="unit-copy"><strong class="unit-title">${_t(r.title)}</strong><span id="lesson-summary-${r.id}" class="unit-summary">${_t(nd(r))}</span>${r.subthemes?.length?`<span class="unit-subthemes">Includes: ${r.subthemes.map(o=>_t(o.title)).join(" \xB7 ")}</span>`:""}</span><span class="unit-check" aria-hidden="true">\u2713</span></button>`).join("");let s=()=>{I("unit").querySelectorAll("button").forEach(r=>{let a=r.dataset.unit===e;r.classList.toggle("selected",a),r.setAttribute("aria-pressed",String(a))}),I("lesson-preview").textContent=n.find(r=>r.id===e).title};I("unit").querySelectorAll("button").forEach(r=>r.onclick=()=>{e=r.dataset.unit,s()}),s()};document.querySelectorAll("[data-grade]").forEach(n=>n.onclick=()=>{i=+n.dataset.grade,e=ki.find(s=>s.grade===i).units[0].id,t()}),I("lesson-close").onclick=Vn,I("lesson-cancel").onclick=Vn,I("lesson-apply").onclick=()=>{J.grade=i,J.unit=e,Zt=0,Vn(),Ts()},t()}var Wt=Xu({api:Gu(window.WORDRAMP_CONFIG)}),um=-1/0,vu=!1,Qp=-1,dm=i=>i?.unit?.grade??(Number(String(i?.unit?.id||J.unit).match(/^g(\d+)/)?.[1])||J.grade);function fm(i){!Wt.enabled||!i||i.reviewLap||i.leagueTicket||vu||!sn(i.teamId)||["finished","failed"].includes(i.status)||(vu=!0,um=performance.now(),Wt.start({runId:i.runId,grade:dm(i),team:i.teamId,arena:i.arenaIndex,pace:i.difficulty==="challenge"?"challenge":"relaxed",unit:i.unit.id}).then(e=>{e&&(i.leagueTicket=e)}).finally(()=>{vu=!1}))}function yM(i,e,t){let n=t?.name||"your team";return i.state==="counted"?i.duplicate?{text:"This win was already counted in the English League.",good:!0}:i.points>0?{text:`+${i.points} Ulti for Grade ${e} ${n}!${i.reason==="team-limit"?` ${n} reached today's team limit, so this win counted ${i.points} of ${i.requested}.`:""}`,good:!0}:i.reason==="device-limit"?{text:"Today's Ulti wins on this phone are used. Tomorrow they count again."}:i.reason==="team-limit"?{text:`${n} reached today's Ulti limit for Grade ${e}. Tomorrow wins count again.`}:i.reason==="off"?{text:"Ulti points are switched off in the English League right now."}:{text:"This win added no Ulti points."}:i.state==="queued"?{text:"You're offline. This win will be sent to the English League when you're online."}:i.state==="refused"?{text:i.reason==="too-fast"?"That win was faster than the English League allows, so it did not count.":i.reason==="expired"?"This race ticket expired before it could be sent.":"The English League did not accept this win."}:i.state==="no-ticket"?{text:"This race could not reach the English League when it started, so it cannot count."}:null}function _M(i,e,t){let n=I("league-result"),s=yM(i,e,t);!n||!s||(n.textContent=s.text,n.classList.toggle("good",!!s.good),n.classList.remove("pending"))}function pm(){if(!Wt.enabled){I("league-button").hidden=!0;return}I("league-button").hidden=!1,nt("league-label",`LEAGUE \xB7 GRADE ${J.grade}`)}function vM(i){if(!i.known)return'<p class="save-note">The English League will show its Ulti rules here once it can be reached.</p>';if(!i.game)return'<p class="league-help">Ulti points are not switched on for this game yet.</p>';let e=t=>le.ARENAS.map((n,s)=>t?.[s]!=null?`${_t(n.name)} +${t[s]}`:"").filter(Boolean).join(" \xB7 ");return`<p class="league-help">${e(i.game.points?.relaxed)}.</p><p class="league-help">On Challenge pace: ${e(i.game.points?.challenge)}.</p><p class="save-note">${i.game.deviceDailyWins?`Your first ${i.game.deviceDailyWins} wins each day count on this phone. `:""}Points last ${Wu(i.hours)}. Your win also needs ${Math.round(Rr*100)}% of tasks right first time on Relaxed, or ${Ar} stars on Challenge.</p>`}function MM(i){return`<div class="league-teams">${i.teams.map(e=>{let t=sn(e.id),n=Math.min(1,e.points/Math.max(1,i.capacity));return`<div class="league-team ${J.teamId===e.id?"selected":""}" style="--team:${t.accent};--share:${(n*100).toFixed(1)}%"><span class="team-letter">${t.letter}</span><span class="league-name">${t.name}${J.teamId===e.id?" \xB7 YOU":""}</span><span class="league-bar" aria-hidden="true"><i></i></span><strong>${Math.round(e.points)} / ${i.capacity}</strong><small>${Vu(e.strength)}</small></div>`}).join("")}</div>`}function mm(){if(!Wt.enabled)return;let i=J.grade,e=(n,s)=>{I("league-done")&&(I("league-body").innerHTML=`${MM(n)}${vM(n)}<p class="save-note">${s}</p>`)};Hi(`${Ha("cheer")}<span class="modal-kicker">ENGLISH LEAGUE \xB7 BATTLE ARENA</span><h2 id="modal-title">Ulti \xB7 Grade ${i}</h2><p>Arena wins add Ulti points to your grade's team pool in Mr. Saymaz's English League. Stronger teams hit harder in the Battle Arena.</p><div id="league-body"></div><button id="league-done" class="primary">BACK TO GARAGE</button>`),I("league-done").onclick=Vn;let t=Wt.snapshot(i);e(t,t.updatedAt?"Updating\u2026":"Connecting to the English League\u2026"),Wt.refresh(i).then(n=>e(n,n.online?"Live from the English League.":n.updatedAt?`Offline \xB7 last updated ${new Date(n.updatedAt).toLocaleString()}.`:"The English League cannot be reached right now."))}function Ga(){let i=document.querySelectorAll(".team-points");if(!Wt.enabled){i.forEach(t=>{t.hidden=!0});return}let e=Wt.snapshot(J.grade);i.forEach(t=>{t.hidden=!e.updatedAt}),document.querySelectorAll("[data-ulti-total]").forEach(t=>{let n=String(Math.round(e.teams.find(s=>s.id===t.dataset.ultiTotal)?.points||0));t.textContent!==n&&(t.textContent=n)})}function wc(){if(!w)return;let i=w.answerEvents.slice(bu),e=i.length||J.fuel!==w.fuel;i.length&&(bs=Math.max(bs,Xp(J,w.unit.id,i)),bu=w.answerEvents.length),J.fuel=w.fuel,J.reviewQueue[w.unit.id]=w.review.filter(t=>!t.recovered).map(t=>({...t})),e&&Gn()}function _c(){let i=pc(J),e=fc(J,J.unit),t=_s(J);Hi(`${Ha("smile")}<span class="modal-kicker">MASTERY GARAGE</span><h2 id="modal-title">Wear what you learn.</h2><p>${_t(Bi().title)} \xB7 ${e.unique} distinct items \xB7 ${e.accuracy}% first try \xB7 ${e.arenas}/3 arenas</p><p>Your team sets your car colour. Earn badges and a trail through unit mastery.</p><div class="paint-grid">${Ic.map(n=>`<button class="paint-option ${J.teamId===n.id?"selected":""}" data-livery="${n.id}" aria-pressed="${J.teamId===n.id}"><span class="paint-swatch" style="--paint:#${n.color.toString(16)}"></span><strong>${n.name}</strong><small>TEAM LIVERY</small></button>`).join("")}</div><p class="garage-label">BADGE</p><div class="badge-options">${["Off","Explorer","Scholar","Master"].map((n,s)=>`<button data-badge="${s}" ${s>i?"disabled":""} class="${t.badge===s?"selected":""}">${n}</button>`).join("")}</div><button id="trail-option" class="trail-option" ${i<3?"disabled":""} aria-pressed="${t.trail}">Aurora trail \xB7 ${i<3?"MASTER REWARD":t.trail?"ON":"OFF"}</button><div class="mastery-rules">At 90% first-try accuracy: <strong>Explorer</strong> needs 6 distinct items + 1 arena; <strong>Scholar</strong> needs 12 + 2 arenas; <strong>Master</strong> needs 18 + all 3. Earn rewards in any unit and equip them throughout your garage.</div><p class="save-note">Fuel ${J.fuel}/100 \xB7 each first-try answer earns 10; every third in a streak adds 5. Each charge costs 30, up to three levels. ${Yt?"Slide up for Nitro, slide down to save it while keeping regular acceleration. Slide farther up to stack.":"Hold NITRO or Space to use it; release to save the remainder."} Driving always remains available.</p><button id="garage-done" class="primary">BACK TO GARAGE</button>`),I("modal").querySelectorAll("[data-livery]").forEach(n=>n.onclick=()=>{J.teamId=n.dataset.livery,Gn(),vt.setCosmetics(_s(J)),_c()}),I("modal").querySelectorAll("[data-badge]").forEach(n=>n.onclick=()=>{yu(J,"badge",+n.dataset.badge)&&(Gn(),vt.setCosmetics(_s(J)),_c())}),I("trail-option").onclick=()=>{yu(J,"trail",!J.look.trail)&&(Gn(),vt.setCosmetics(_s(J)),_c())},I("garage-done").onclick=()=>{Vn(),Ts()}}var Va=!1,Er=!1,dn=null,As=!1,Ss=null,on=null,wu=0;function Tu(){return Va||Er||dn!==null||zi!==null}function mt(){if(w){let i=Va||Er||zi!==null||dn!==null&&!Pt?.touch;le.setAccelerating(w,Tu(),!!i),le.setNitroHeld(w,As||Ss!==null||on!==null)}}function Wa(){let i=Pt?.id;Pt=null;let e=Ss;Ss=null,on=null,As=!1,e!==null&&I("nitro").hasPointerCapture?.(e)&&I("nitro").releasePointerCapture(e);let t=dn;dn=null,Va=!1,Er=!1;let n=zi;zi=null,n!==null&&I("throttle").hasPointerCapture?.(n)&&I("throttle").releasePointerCapture(n),t!==null&&I("world").hasPointerCapture?.(t)&&I("world").releasePointerCapture(t),i!=null&&I("world").hasPointerCapture?.(i)&&I("world").releasePointerCapture(i),w&&(le.setAccelerating(w,!1),le.setNitroHeld(w,!1))}function Hi(i){un=null,Oi=0,I("toast").classList.remove("visible"),Wa(),Ge.pointerId!==null&&Pu({pointerId:Ge.pointerId}),I("modal").classList.remove("finish-modal","dnf-result"),I("modal").classList.remove("lessons-modal"),rm=document.activeElement,I("modal").innerHTML=i,I("modal-backdrop").hidden=!1,setTimeout(()=>I("modal").focus(),0)}function Vn(){I("modal-backdrop").hidden=!0,I("modal").classList.remove("lessons-modal"),I("modal").innerHTML="",rm?.focus?.()}function Iu(i=!1){let e=(Yt?"Hold anywhere on the road to accelerate. Keep your thumb down and swipe left or right to change lanes. You can swipe again without lifting.":"Swipe the road, tap the arrows, or use \u2190 \u2192 / A D. Hold your car or the speed button to accelerate. On a computer, hold \u2191.")+" Release acceleration and Nitro to coast and brake for traffic.",t=Yt?"Slide your driving thumb forward to use Nitro, then hold it there. Slide down to save the remaining charge and keep regular acceleration. Slide farther forward for a second or third charge, up to three levels. Each new charge costs 30 fuel; resuming a saved charge is free. Lifting your thumb releases acceleration and Nitro. Fuel and Nitro status sit beside your race position.":"Hold NITRO or Space to boost; release to save the remaining charge. An upward swipe also boosts while your finger stays down. A new charge costs 30 fuel. Tap +30 or press N to stack up to three levels. Holding acceleration also uses a loaded charge. Regular acceleration displays up to 90 km/h; maximum Nitro displays 200 km/h.",n=Yt?"After choosing, keep holding the road to return to normal pace sooner.":"After choosing, hold your car, the speed button or \u2191 to return to normal pace sooner.";w&&!["finished","failed","paused"].includes(w.status)&&(mc=le.pause(w)),Hi(`${Ha("point")}<span class="modal-kicker">WELCOME TO WORDRAMP</span><h2 id="modal-title">Your team.<br>Your open road.</h2><div class="help-step"><span class="step-num">1</span><div><strong>Find your line.</strong><p>${e}</p></div></div><div class="help-step"><span class="step-num">2</span><div><strong>Read the road.</strong><p>Steer towards the correct full-text answer, or tap its sign. Rivals match your progress during every English task, even if you hold acceleration. Correct exits protect your speed recovery too. Lights and forks enter slow motion close to the signs. Steering stays active. ${n} Already holding? Keep holding. The answer locks at the road line.</p></div></div><div class="help-task-grid"><div><b>GREEN LIGHT</b><span>Read in slow motion, then steer into the matching answer to turn the light green.</span></div><div><b>ROAD REPAIR</b><span>Release the car: autopilot holds your entry speed and lane while the world slows into a green-gold focus effect. Connect the three blocks; the road repairs immediately, then normal pace and driving controls return smoothly. Extra thinking time safely freezes the approach before the gap. A held Up key or driving touch resumes automatically after autopilot.</span></div><div><b>SHORTCUT</b><span>Choose a sign in close-range slow motion. The right lane leads into a visible shortcut. In Sunlit Boulevard it rides the Sky Coaster.</span></div><div><b>CROSSWALK</b><span>Sort each visitor\u2019s word while autopilot approaches in slow motion. Clear the crossing before you arrive; all cars wait if anyone is still on the road.</span></div></div><div class="help-step"><span class="step-num">3</span><div><strong>Earn your next boost.</strong><p>First-try English answers earn fuel. Every third adds a streak bonus. ${t}</p></div></div><div class="help-step"><span class="step-num">4</span><div><strong>Look after your car.</strong><p>Three small marks below the clock show your remaining hits. Each driving bump damages the car; the third ends the race. Change lanes into clear gaps. Every new race starts fully repaired.</p></div></div><p class="save-note">Choose Slytherin, Hufflepuff, Gryffindor or Ravenclaw in the garage. ${Wt.enabled?`A first-place finish with ${Math.round(Rr*100)}% of tasks right first time on Relaxed, or ${Ar}+ stars on Challenge, adds Ulti points to your team in Mr. Saymaz's English League. Tap LEAGUE in the garage to see the team pools. `:""}Plan about five minutes per arena, with 12\u201316 checkpoints and longer open-road stretches. Holding acceleration and using Nitro can shorten your run. Your stars reward accurate English and clean driving. Your racing position is separate. All cars wait for pedestrians to reach the sidewalk.</p><details><summary>Race rules & keyboard shortcuts</summary><p>Finish first to unlock the next arena for this unit and difficulty. Stars still reward your English at every finishing position. Wrong answers cost 1.5 seconds and never damage your car. Each separate driving impact costs ${le.DIFFICULTIES[J.difficulty].penalty} seconds and one condition mark. Three hits end the race. A cracked windscreen warns after the first hit; a loose bonnet and smoke mean one hit left. Rivals can close the gap while you recover, using their normal driving. Autopilot protects your car and reading time. Relaxed gives 3 seconds of impact protection; Challenge gives 2. Each retry starts fully repaired. Correct shortcuts add 3 seconds; wrong routes take a recoverable detour. Rivals share your regular top speed and earn fuel for boosts. Nitro waits through tasks and crossings. Use 1 / 2 / 3 for the road signs or repair blocks. Use \u2190 / \u2192 at crosswalks. Escape / P pauses. Missed words return later, with an optional review lap after the finish.</p></details><button id="help-done" class="primary">${i?"LET\u2019S DRIVE":"GOT IT"} \u2197</button>`),I("help-done").onclick=()=>{Vn(),i?(J.crosswalkTutorial=!0,Gn(),vr()):mc&&(le.resume(w),mc=!1)}}function vr(i=null){if(!sn(J.teamId)){br();return}if(!Array.isArray(i)&&!gc(Zt)){br(),Ms("Finish first to unlock the next arena.");return}im(),I("launch-caption").textContent=Yt?"HOLD TO DRIVE \xB7 SWIPE TO STEER \xB7 SLIDE \u2191 FOR NITRO":"READ THE ROAD. RACE YOUR RIVALS.",ws(),Su=0,xc=null,un=null,Oi=0,I("toast").classList.remove("visible"),I("celebration").hidden=!0,I("celebration").innerHTML="",document.body.classList.remove("race-finished","car-critical","car-breaking");let e=Array.isArray(i)?i:null;wc(),Wa(),Vn(),w=e?le.createReviewLap(Bi(),e,J.difficulty,Date.now(),{fuel:J.fuel}):le.createRace(Bi(),J.difficulty,Zt,Date.now(),{fuel:J.fuel,reviews:J.reviewQueue[Bi().id]||[]}),pM(w),w.teamId=J.teamId,w.runId=qu("run"),e||fm(w),bu=0,bs=0,Sr="race",Na="",vc="",bc=null,vt.setup(e?0:Zt),vt.clearGate(),vt.currentLane=0,vt.setCosmetics(_s(J)),I("rival-tags").innerHTML=w.rivals.map(t=>`<span data-rival="${t.id}" style="--rival:#${t.color.toString(16)}">${t.name}<small></small></span>`).join(""),document.body.classList.add("racing"),I("home").hidden=!0,I("hud").hidden=!1,I("pause").hidden=!1,I("countdown").hidden=!1,I("warning").hidden=!0,I("road-learning").hidden=!0,I("controls").hidden=!0,wu=0,I("launch-kicker").textContent=w.arena.name.toUpperCase(),I("launch-caption").textContent=w.reviewLap?"A SHORT LAP. A STRONGER NEXT DRIVE.":"YOU \xB7 COBALT \xB7 EMBER",Ke.unlock(),Ke.tone("click")}function br(){document.body.dataset.nitroLevel="0",wc(),Wa(),w=null,Sr="home",vc="",Na="",bc=null,mc=!1,vt?.clearGate(),Vn(),document.body.classList.remove("racing","nitro-active","race-finished","nitro-ready","car-critical","car-breaking"),un=null,Oi=0,I("toast").classList.remove("visible"),I("celebration").hidden=!0,I("celebration").innerHTML="",I("rival-tags").innerHTML="";for(let i of["route-status","hud","pause","countdown","warning","road-learning","controls"])I(i).hidden=!0;I("home").hidden=!1,Ts(),Ke.update(null)}function wr(){if(!w||!le.pause(w))return;Ke.tone("pause");let i=sn(w.teamId),e=le.raceOrder(w).findIndex(t=>t.id==="player")+1;Hi(`${Ha("think")}<span class="modal-kicker">PIT STOP \xB7 WORDRAMP</span><h2 id="modal-title">Take a breath.</h2><p>Your race clock is paused.</p><div class="pause-lesson"><strong>${_t(w.arena.name)}</strong><span>Grade ${J.grade} \xB7 ${_t(w.unit.title)} \xB7 ${le.DIFFICULTIES[w.difficulty].label}</span><span class="pause-team" style="--team:${i.accent}">${_t(i.name)}</span></div><dl class="pause-stats"><div><dt>FIRST TRY</dt><dd id="pause-accuracy">${w.correct} / ${w.tasks.length}</dd></div><div><dt>DISTANCE</dt><dd id="pause-distance">${Math.floor(w.distance)} / ${w.arena.length} m</dd></div><div><dt>CHECKPOINTS</dt><dd id="pause-checkpoints">${w.taskIndex} / ${w.tasks.length}</dd></div><div><dt>${le.raceFailed(w)?"STATUS":"POSITION"}</dt><dd>${le.raceFailed(w)?"DNF":w.reviewLap?"Review lap":e+" / 3"}</dd></div><div><dt>BEST STREAK</dt><dd>${w.bestStreak}</dd></div><div><dt>CAR CONDITION</dt><dd>${le.carCondition(w).remaining} / 3 hits left</dd></div></dl><button id="resume" class="primary">BACK ON THE ROAD \u2197</button><div class="pause-tools"><button id="pause-settings">Settings</button><button id="pause-help">How to play</button><button id="pause-sound">Sound ${J.sound?"on":"off"}</button></div><div class="modal-actions"><button id="restart" class="secondary">Restart race</button><button id="exit-race" class="secondary">Return to garage</button></div>`),I("resume").onclick=()=>{Vn(),le.resume(w)},I("pause-settings").onclick=()=>{le.resume(w),hm()},I("pause-help").onclick=()=>{le.resume(w),Iu()},I("pause-sound").onclick=()=>{J.sound=!J.sound,Ke.unlock(),Ec(),Gn(),I("pause-sound").textContent="Sound "+(J.sound?"on":"off")},I("restart").onclick=vr,I("exit-race").onclick=br}function bM(){if(Sr==="home"){br();return}if(w&&["finished","failed"].includes(w.status)){br();return}wr()}var Ge={key:"",sequence:[],pointerId:null,point:null,dragging:!1,errorUntil:0};function SM(){return[...I("road-answers").querySelectorAll("[data-block]")].map(i=>{let e=i.getBoundingClientRect();return{id:+i.dataset.block,left:e.left-3,right:e.right+3,top:e.top-3,bottom:e.bottom+3}})}function em(){Ge.pointerId!==null&&I("road-answers").hasPointerCapture?.(Ge.pointerId)&&I("road-answers").releasePointerCapture(Ge.pointerId),Ge={key:"",sequence:[],pointerId:null,point:null,dragging:!1,errorUntil:0},I("repair-path").setAttribute("d",""),I("repair-tip").setAttribute("d","")}function Tc(){let i=Ge.sequence.map(n=>{let s=I("road-answers").querySelector(`[data-block="${n}"]`);return s?{x:parseFloat(s.style.left),y:parseFloat(s.style.top)}:null}).filter(n=>n&&Number.isFinite(n.x)&&Number.isFinite(n.y));I("repair-path").setAttribute("d",i.map((n,s)=>(s?"L":"M")+n.x+" "+n.y).join(" "));let e=i.at(-1),t=Ge.dragging&&Ge.point;I("repair-tip").setAttribute("d",e&&t?"M"+e.x+" "+e.y+" L"+t.x+" "+t.y:""),I("repair-links").classList.toggle("error",performance.now()<Ge.errorUntil),I("repair-links").classList.toggle("complete",!!w?.task?.solved)}function Ac(i){if(!(w?.status!=="task"||w.task.kind!=="repair"||w.task.solved||performance.now()<Ge.errorUntil||Ge.sequence.includes(i))&&(Ge.sequence.push(i),Ke.tone("build"),Ge.sequence.length===3)){let e=le.connectRepair(w,Ge.sequence);Ge.dragging=!1,Ge.point=null,e||(Ge.errorUntil=performance.now()+650)}}function EM(i){if(Ge.pointerId!==null&&Ge.pointerId!==i.pointerId||w?.status!=="task"||w.task.kind!=="repair"||w.task.solved||performance.now()<Ge.errorUntil)return;let e=i.target.closest("[data-block]");e&&(i.preventDefault(),i.stopPropagation(),Ke.unlock(),Ge.pointerId=i.pointerId,Ge.dragging=!0,Ge.point={x:i.clientX,y:i.clientY},I("road-answers").setPointerCapture(i.pointerId),Ac(+e.dataset.block),Tc())}function wM(i){if(!Ge.dragging||i.pointerId!==Ge.pointerId)return;i.preventDefault();let e=i.getCoalescedEvents?.();for(let t of e?.length?e:[i]){let n={x:t.clientX,y:t.clientY},s=Ge.point||n;for(let r of Hp(s,n,SM(),Ge.sequence))Ac(r);Ge.point=n}Tc()}function Pu(i){i.pointerId===Ge.pointerId&&(Ge.dragging=!1,Ge.point=null,I("road-answers").hasPointerCapture?.(i.pointerId)&&I("road-answers").releasePointerCapture(i.pointerId),Ge.pointerId=null,Tc())}I("road-answers").addEventListener("pointerdown",EM);I("road-answers").addEventListener("pointermove",wM);I("road-answers").addEventListener("pointerup",Pu);I("road-answers").addEventListener("pointercancel",Pu);var Ba=null;I("pedestrian-words").addEventListener("pointerdown",i=>{let e=i.target.closest("[data-person]");!e||w?.status!=="task"||w.task.kind!=="pedestrian"||w.task.pedWait>0||(i.preventDefault(),Ke.unlock(),Ba={id:i.pointerId,x:i.clientX,y:i.clientY,person:w.task.personIndex},e.setPointerCapture(i.pointerId))});function gm(i){if(Ba?.id!==i.pointerId)return;let e=Ba;Ba=null,i.type!=="pointercancel"&&w?.task?.personIndex===e.person&&Math.abs(i.clientX-e.x)>22&&Math.abs(i.clientX-e.x)>Math.abs(i.clientY-e.y)*.7&&le.sortPerson(w,i.clientX>e.x?1:0)&&Ke.tone("click"),i.target.hasPointerCapture?.(i.pointerId)&&i.target.releasePointerCapture(i.pointerId)}I("pedestrian-words").addEventListener("pointerup",gm);I("pedestrian-words").addEventListener("pointercancel",gm);function TM(){let i=["task","resolving"].includes(w?.status),e=w?.task,t=i?le.currentRow(w)||e?.rows[0]:null,n=e?.completed?w.elapsed-e.completedAt:0,s=w?.status==="resolving"&&n>.6;if(I("road-learning").hidden=!t||n>1.05,I("road-learning").classList.toggle("leaving",s),!t){Ge.key&&w?.status!=="paused"&&em();return}let r=e.kind==="repair",a=e.kind==="pedestrian",o=e.id;if(I("road-learning").classList.toggle("repair-mode",r),I("road-learning").classList.toggle("pedestrian-mode",a),I("repair-links").hidden=!r,I("pedestrian-words").hidden=!a,vc!==o){yc?.disconnect();for(let M of["app","hud","controls","road-prompt"])yc?.observe(I(M));ws(),em(),nt("road-feedback",""),Fa=0,vc=o,Ge.key=o,Ba=null,I("road-kicker").textContent=r?e.reviewOf?"REVIEW REPAIR \xB7 AUTO CRUISE":"ROAD REPAIR \xB7 AUTO CRUISE":e.reviewOf?"SECOND LOOK \xB7 A DIFFERENT CLUE":a?"CROSSWALK":e.picture?e.kind==="light"?"PICTURE SIGN \xB7 GREEN LIGHT":"PICTURE ROUTE":e.kind==="light"?"GREEN LIGHT":"CHOOSE YOUR ROUTE",I("road-question").textContent=r?e.reviewOf?e.prompt:"Release the car. Connect the 3 blocks.":a?"Which category does each word belong to?":e.prompt,e.picture==="word"&&I("road-question").insertAdjacentHTML("afterbegin",`<img class="sign-emoji" src="${Eu(e.image)}" alt="Picture clue" draggable="false">`),I("road-prompt").classList.toggle("picture-sign",!!e.picture),I("road-instruction").textContent=r?"DRAG THROUGH ALL 3 BLOCKS IN THE RIGHT ORDER":a?"SWIPE THE WORD LEFT / RIGHT \xB7 OR TAP A CATEGORY":"STEER INTO YOUR ANSWER \xB7 TAP A SIGN TO STEER",I("road-answers").innerHTML=t.options.map((M,y)=>`<button class="road-answer ${r?"repair-block":a?"category-sign":""}" ${r?`data-block="${e.order[y]}"`:a?`data-side="${y}"`:`data-lane="${y}"`} aria-label="${r?"Connect block":a?`Send person ${y===0?"left":"right"}`:`Steer into ${["left","middle","right"][y]} lane`}: ${_t(M)}"><span class="answer-letter">${r?"\u25C9":a?y===0?"\u2190 LEFT":"RIGHT \u2192":["A)","B)","C)"][y]}</span><span class="answer-text">${e.optionImages?`<img class="answer-emoji" src="${Eu(e.optionImages[y])}" alt="${_t(M)}" draggable="false">`:Kp(a?Op(M):M.replace(/^…\s*/,""))}</span></button>`).join(""),I("road-answers").querySelectorAll("button").forEach(M=>{yc?.observe(M),M.onclick=y=>{w?.status==="task"&&(r?y.detail===0&&Ac(+M.dataset.block):a?(Ke.unlock(),le.sortPerson(w,+M.dataset.side)&&Ke.tone("click")):(Ke.unlock(),le.choose(w,+M.dataset.lane),Ke.tone("click"),ii("click")))}}),I("pedestrian-words").innerHTML=a?e.people.map(M=>`<button class="person-word" data-person="${M.id}" aria-label="Swipe ${_t(M.word)} left or right"><span>${Kp(M.word)}</span><small>\u2190 SWIPE \u2192</small></button>`).join(""):""}r?(e.solved&&Ge.sequence.length!==3&&(Ge.sequence=e.connection.slice()),Ge.errorUntil&&performance.now()>=Ge.errorUntil&&(Ge.sequence=[],Ge.errorUntil=0),nt("road-question",e.solved?e.answer:e.reviewOf?e.prompt:"Release the car. Connect the 3 blocks."),nt("road-kicker",e.solved?"ROAD REPAIRED":e.reviewOf?"REVIEW REPAIR \xB7 AUTO CRUISE":"ROAD REPAIR \xB7 AUTO CRUISE"),nt("road-instruction",e.solved?"SENTENCE CONNECTED \xB7 ROAD REPAIRED":Ge.errorUntil?"TRY A DIFFERENT ORDER":"DRAG THROUGH ALL 3 BLOCKS IN THE RIGHT ORDER")):a&&nt("road-kicker",e.completed?le.crosswalkOccupied(w,e)?"VISITORS LEAVING":"CROSSWALK CLEAR":`CROSSWALK \xB7 VISITOR ${Math.min(e.personIndex+1,e.people.length)} / ${e.people.length}`);let c=vt.roadProjection(),l=I("road-prompt"),h=c.answers;if(h.length!==3)return;let{width:u,height:d}=vt.viewport||{width:innerWidth,height:innerHeight},f=d<600&&u>d,m=zp(u,h),x=[...I("road-answers").querySelectorAll("button")];if(x.forEach((M,y)=>{let P=m[a?y*2:y].width;vs(M,"width",P.toFixed(1)+"px"),Jp(M,M.querySelector(".answer-text"),P)}),a)for(let M of I("pedestrian-words").children)vs(M,"width",m[1].width.toFixed(1)+"px"),Jp(M,M.querySelector("span"),m[1].width);let{hudBottom:g,controlsTop:p,promptHeight:v,answerHeight:b}=cm(),_=f?10:17,C=p-12,{py:S,ay:A,stagger:R}=Gp({hudBottom:g,promptHeight:v,answerHeight:b,promptY:c.prompt.y,answerY:h[1].y,controlsTop:p,repair:r,landscape:f,viewportHeight:d});if(vs(l,"left",u/2+"px"),vs(l,"top",S.toFixed(1)+"px"),x.forEach((M,y)=>{let P=r?+M.dataset.block:null,N=Ge.sequence.indexOf(P),B=r&&N>=0;if(M.disabled=w.status!=="task"||a&&(e.pedWait>0||!le.pedestrianReady(w,e)),M.classList.toggle("selected",!r&&!a&&w.lane===y-1),M.classList.toggle("linked",B),M.classList.toggle("connected",r&&e.solved||!r&&!a&&e.completed&&y===e.correctIndex),M.classList.toggle("error",B&&performance.now()<Ge.errorUntil),M.setAttribute("aria-pressed",String(r?B:!a&&w.lane===y-1)),r){let X=M.querySelector(".answer-letter"),q=B?String(N+1):"\u25C9";X.textContent!==q&&(X.textContent=q)}let H=m[a?y*2:y];vs(M,"left",H.x.toFixed(1)+"px"),vs(M,"top",(A+(r&&y===1?R:0)).toFixed(1)+"px")}),a){I("road-instruction").textContent=e.completed?le.crosswalkOccupied(w,e)?"WAIT UNTIL ALL VISITORS REACH THE SIDEWALK":"CROSSWALK CLEAR \xB7 LET\u2019S GO":le.pedestrianReady(w,e)?`SWIPE LEFT / RIGHT \xB7 ${Math.ceil(le.crosswalkTimeLeft(w,e))}s`:e.peopleEntryAt==null?"TRAFFIC CLEARING THE STRIPES":"VISITORS APPROACHING \xB7 READ THE CATEGORIES";let M=vt.pedestrianProjection(w);[...I("pedestrian-words").children].forEach((y,P)=>{let N=e.people[P],B=M[P],H=N.sent?w.elapsed-N.sentAt:0,X=B?.visible&&le.pedestrianReady(w,e)&&(P===e.personIndex&&!N.sent||N.sent&&H<1.4);y.hidden=!X,y.disabled=N.sent||e.pedWait>0||w.status!=="task",y.classList.toggle("departing",N.sent),y.classList.toggle("wrong",N.sent&&!N.correct),y.style.opacity=N.sent?String(Math.max(0,1-H/1.4)):String(le.clamp((w.elapsed-N.entryAt)/.25,0,1)),y.style.width=m[1].width+"px",y.style.left=(N.sent?B?.x:m[1].x)+"px",y.style.top=Math.max(S+v/2+y.offsetHeight/2+_,Math.min(B?.y||A,C-y.offsetHeight/2))+"px",y.querySelector("small").textContent=N.sent?N.correct?"\u2713 SORTED":"\u2197 CORRECTION":"\u2190 SWIPE \u2192"})}I("decision-fill").style.width=(e.completed?0:a?le.crosswalkTimeLeft(w,e)/e.sortDuration*100:le.clamp((t.at-w.distance)/(r?82:70)*100,0,100))+"%",r&&Tc()}function AM(){Wa(),wc();let i=Cr(w),e=w.failureReason==="breakdown"||w.damage>=le.DAMAGE_LIMIT||!!w.breakdown,t=le.stars(w),n=Math.round(100*w.correct/Math.max(1,w.tasks.length)),s=i?le.raceOrder(w).findIndex(f=>f.id==="player")+1:null;if(i&&!w.reviewLap){let f=w.unit.id+":"+w.difficulty,m=(J.progress[f]||[0,0,0]).slice();m[w.arenaIndex]=Math.max(m[w.arenaIndex],t),J.progress[f]=m,bs=Math.max(bs,qp(J,w.unit.id,w.arenaIndex)),Wp(J,w,s),Gn()}let r=Wt.enabled?$u(w,s,t):"none",a=r==="qualified",o=sn(w.teamId),c=dm(w);if(a){let f=w;Wt.claim(f.runId).then(m=>(w===f&&_M(m,c,o),Ga(),Wt.flush())).catch(()=>{})}let l=r==="accuracy"?w.difficulty==="challenge"?`English League Ulti points need ${Ar} stars on Challenge: answer 3 in 4 tasks right first time.`:`English League Ulti points need ${Math.round(Rr*100)}% of tasks right first time on Relaxed.`:"";bc={finished:i,stars:t},Ke.tone(i?"finish":e?"breakdown":"wrong"),I("road-learning").hidden=!0,I("controls").hidden=!0,I("warning").hidden=!0,I("pause").hidden=!0;let h=w.review.filter(f=>!f.recovered),u=fc(J,w.unit.id),d=i&&s===1&&!w.reviewLap&&w.arenaIndex<2&&Ua(J,w.unit.id,w.difficulty,w.arenaIndex+1);Hi(`${Ha(i?s===1&&!w.reviewLap?"cheer":"smile":"think")}<span class="modal-kicker">${w.reviewLap?i?"REVIEW LOOP COMPLETE":"REVIEW LOOP \xB7 TRY AGAIN":i?"ENGLISH GRAND PRIX":e?"THREE HITS \xB7 RACE ENDED":"THE ROAD IS WORTH ANOTHER TRY"}</span><div class="finish-emblem" aria-hidden="true"><span>${i?"FINISH":e?"BREAKDOWN":"KEEP GOING"}</span><strong>${i?w.reviewLap?"\u2713":String(s).padStart(2,"0"):e?"!":"\u2197"}</strong><small>${w.reviewLap?"REVIEW":i?"RACE POSITION":e?"BACK TO THE GARAGE":"NEXT TIME"}</small></div><h2 id="modal-title">${i?w.reviewLap?"A stronger next drive.":s===1?"You took the lead.":"What a drive!":e?"Car broken down.":w.failureReason==="time"?"Time ran out.":"Race not finished."}</h2><p>${_t(w.arena.name)} \xB7 ${le.DIFFICULTIES[J.difficulty].label}${i&&!w.reviewLap?" \xB7 POSITION "+s+"/3":""}</p>${i?"":'<div class="result-dnf" role="status"><strong>DNF</strong><span>DID NOT FINISH</span></div>'}<div class="result-stars" aria-label="${t} out of 3 stars">${Array.from({length:3},(f,m)=>`<span class="${m<t?"":"empty"}">\u2605</span>`).join("")}</div><div class="result-stats"><div class="result-stat"><strong>${Math.ceil(w.time)}s</strong><small>TIME LEFT</small></div><div class="result-stat"><strong>${n}%</strong><small>FIRST TRY</small></div><div class="result-stat"><strong>${w.collisions}</strong><small>BUMPS</small></div></div>${i&&!w.reviewLap?`<div class="podium">${le.raceOrder(w).map((f,m)=>`<span class="${f.id==="player"?"you":""}"><b>${m+1}</b> ${_t(f.name)}</span>`).join("")}</div>`:""}<p>${w.reviewLap?"Review strengthens your English. Win the full race to unlock the next arena.":i?"Stars reward your English and clean driving. First place unlocks the next arena.":e?"Three separate hits ended this race. Your next drive starts with a fully repaired car. Read the gaps and save Nitro for a clear stretch.":"Try Relaxed for more thinking time, or take a short review lap before the next race."}</p>${l?`<div class="ulti-win ulti-missed" style="--team:${sn(w.teamId)?.accent||"#a5caff"}"><span>FIRST PLACE \xB7 NO ULTI POINTS</span><p>${_t(l)}</p></div>`:""}${a?'<p id="league-result" class="league-result pending" role="status">Sending your win to the English League\u2026</p>':""}<div class="achievement">FUEL ${w.fuel}/100 \xB7 BEST STREAK ${w.bestStreak} \xB7 CHARGES LOADED ${w.nitroUses}</div>${bs?`<div class="achievement">MASTERY REWARD \xB7 ${["","EXPLORER BADGE","SCHOLAR BADGE","MASTER BADGE + AURORA TRAIL"][bs]}</div>`:""}<p class="save-note">Unit mastery: ${u.unique} distinct items \xB7 ${u.accuracy}% first try \xB7 ${u.arenas}/3 arenas</p>${d?`<div class="achievement">UNLOCKED \xB7 ${_t(le.ARENAS[w.arenaIndex+1].name)}</div>`:i&&!w.reviewLap&&w.arenaIndex<2&&s!==1?`<p class="arena-goal">${Ua(J,w.unit.id,w.difficulty,w.arenaIndex+1)?"Finish first to advance from this race.":`Finish first in ${_t(w.arena.name)} to unlock ${_t(le.ARENAS[w.arenaIndex+1].name)}.`}</p>`:""}${h.length?`<details><summary>Review ${h.length} missed item${h.length>1?"s":""}</summary>${h.map(f=>`<div class="review-item"><span>${_t(f.prompt)}</span><strong>${_t(f.answer)}</strong>${f.tr?`<small>${_t(f.tr)}</small>`:""}</div>`).join("")}</details><button id="review-lap" class="review-lap-button">SHORT REVIEW LAP \xB7 UP TO 6 ITEMS \u2197</button>`:w.review.length?'<div class="achievement">MISSED ITEMS RECOVERED ON THE ROAD</div>':""}<div class="modal-actions"><button id="replay" class="${d?"secondary":"primary"}">DRIVE AGAIN</button>${d?'<button id="next-arena" class="primary">NEXT ARENA \u2197</button>':""}</div><button class="text-button" id="result-home">Return to garage</button><p class="save-note">${Au?"Wins, stars, fuel and mastery are saved in this browser.":"This browser is blocking saves. Keep this tab open to retain your progress."}</p>`),I("modal").classList.add("finish-modal"),I("modal").classList.toggle("dnf-result",!i),i&&mM(),I("replay").onclick=()=>vr(),I("result-home").onclick=br,I("review-lap")&&(I("review-lap").onclick=()=>vr(h)),I("next-arena")&&(I("next-arena").onclick=()=>{if(!d||w.status!=="finished"||le.raceOrder(w)[0]?.id!=="player")return;let f=w.arenaIndex+1;Ua(J,w.unit.id,w.difficulty,f)&&(Zt=f,vr())})}function RM(){Hi(`<span class="modal-kicker">RACE JOURNAL \xB7 GRADE ${J.grade}</span><h2 id="modal-title">Every road counts.</h2><p>${le.DIFFICULTIES[J.difficulty].label} difficulty \xB7 three arenas per unit</p>${ki.find(i=>i.grade===J.grade).units.map(i=>{let e=J.progress[i.id+":"+J.difficulty]||[0,0,0],t=e.reduce((n,s)=>n+s,0);return`<div class="journal-unit"><span>${_t(i.title)}</span><span>${t} / 9 \u2605</span></div>`}).join("")}<p class="save-note">Progress is kept separately for each unit and difficulty in this browser.</p>${Wt.enabled?'<button id="journal-ulti" class="review-lap-button">ENGLISH LEAGUE ULTI \u2197</button>':""}<button id="journal-done" class="primary">BACK TO GARAGE</button>`),I("journal-done").onclick=Vn,I("journal-ulti")&&(I("journal-ulti").onclick=mm)}var tm=-1/0;function CM(i){i-tm>1e3&&(tm=i,Ga());let e=td(w,{modalOpen:!I("modal-backdrop").hidden}),t=e.question;document.body.classList.contains("reading-zone")!==t&&ws(),document.body.classList.toggle("reading-zone",t),document.body.dataset.hudPhase=e.phase;let n=le.focusCruise(w),s=n&&w.focusAuto?.returning!=null,r=le.canShortenFocus(w);if(document.body.classList.toggle("focus-cruise",n),document.body.classList.toggle("repair-cruise",le.repairCruise(w)),document.body.style.setProperty("--focus-amount",n?Math.max(0,Math.min(1,w.focusAmount||0)):0),document.body.dataset.focusPhase=s?"return":n?"cruise":"off",I("throttle").disabled=!1,I("throttle").setAttribute("aria-label",n?r?"Hold to return to normal pace sooner.":Tu()?"Acceleration held. Quick return begins after your choice is ready.":"Autopilot holds your entry speed. After choosing, hold to return to normal pace sooner.":"Hold to accelerate"),document.body.classList.toggle("accelerating",!!w?.accelerating&&w.speedFactor>.05),!w){jp(i,e);return}I("controls").hidden=Yt||!["driving","task","resolving"].includes(w.status),wc(),document.body.classList.toggle("nitro-active",!!w.nitroActive&&["driving","resolving"].includes(w.status));let a=le.raceOrder(w),o=a.findIndex(y=>y.id==="player")+1,c=le.raceFailed(w);nt("race-place",c?"DNF":w.reviewLap?"REVIEW":o+" / 3"),nt("place-label",c?"STATUS":w.reviewLap?"LAP":"POSITION"),xc!==null&&o<xc&&w.status==="driving"&&(Ms(o===1?"Taking the lead":"Clean overtake",!1,()=>w&&le.raceOrder(w).findIndex(y=>y.id==="player")+1===o),e.announcementsAllowed&&Ke.tone("overtake")),xc=o;let l=le.carCondition(w),h=I("car-condition");h.dataset.damage=String(l.damage),h.setAttribute("aria-label",l.broken?"Car condition: broken down":`Car condition: ${l.remaining} ${l.remaining===1?"hit":"hits"} remaining${l.critical?"; critical":""}`),[...h.children].forEach((y,P)=>y.classList.toggle("intact",P<l.remaining)),document.body.classList.toggle("car-critical",l.critical),document.body.classList.toggle("car-breaking",w.status==="breakdown");let u=I("condition-notice");u.hidden=!w.lastImpact||w.elapsed-w.lastImpact.at>2.4||!["driving","breakdown"].includes(w.status)||le.learningPaceProtected(w),u.dataset.damage=String(l.damage),u.hidden||nt("condition-notice",l.broken?"CAR BROKEN DOWN":l.critical?"CRITICAL \xB7 ONE HIT LEFT":"DAMAGED \xB7 TWO HITS LEFT"),I("pause").hidden=["breakdown","finished","failed"].includes(w.status),nt("fuel-value",w.fuel),I("fuel-fill").style.width=w.fuel+"%",nt("streak-count",w.streak),I("fuel-value").parentElement.setAttribute("aria-label","Fuel "+w.fuel+" out of 100"),I("streak-count").parentElement.setAttribute("aria-label","English streak "+w.streak),[...I("streak-pips").children].forEach((y,P)=>y.classList.toggle("lit",P<(w.streak?(w.streak-1)%3+1:0)));let d=le.canEngageNitro(w),f=le.canNitro(w),m=w.nitro>0?w.nitroLevel||1:0;I("nitro").disabled=!d,I("nitro-stack").disabled=!f,I("nitro-stack").setAttribute("aria-label",m===3?"Maximum charge level reached":"Add Nitro charge: 30 fuel"),nt("stack-label",m===3?"MAX":"30"),I("nitro").classList.toggle("ready",d),I("nitro").classList.toggle("saved",m>0&&!w.nitroActive),document.body.classList.toggle("nitro-ready",d),nt("nitro-title",m&&!w.nitroActive?"SAVED":m===3?"MAX POWER":m===2?"DOUBLE":"NITRO"),nt("nitro-label",m?w.nitro.toFixed(1)+"s"+(w.nitroActive?"":" \xB7 HOLD"):w.fuel>=30?"HOLD \xB7 30":w.fuel+" / 30"),[...I("nitro-slots").children].forEach((y,P)=>y.classList.toggle("lit",P<m)),I("nitro-ring-fill").style.strokeDashoffset=String(100*(1-(m?w.nitro/(le.NITRO_DURATION*m):Math.min(1,w.fuel/30)))),I("nitro").style.setProperty("--charge",m?w.nitro/(le.NITRO_DURATION*m):Math.min(1,w.fuel/30)),I("nitro").setAttribute("aria-pressed",String(!!w.nitroHeld)),I("nitro").setAttribute("aria-label",m?`Hold to use saved level ${m} Nitro: ${w.nitro.toFixed(1)} seconds remaining; release to save`:"Hold to load and use Nitro: 30 fuel");let x=I("touch-nitro");x.hidden=!Yt||!["driving","task","resolving"].includes(w.status),nt("touch-nitro-state",w.nitroActive?"BOOST \xD7"+m:m?"SAVED \xD7"+m:d?"NITRO":"FUEL"),nt("touch-fuel",w.fuel),x.classList.toggle("boosting",!!w.nitroActive),x.classList.toggle("ready",d),I("touch-nitro-fill").style.width=Math.min(100,100*(m?w.nitro/(le.NITRO_DURATION*m):w.fuel/30))+"%",[...I("touch-nitro-levels").children].forEach((y,P)=>y.classList.toggle("lit",P<m)),x.setAttribute("aria-label",`Nitro ${w.nitroActive?"boosting":m?"saved":"ready at 30 fuel"}; level ${m} of 3; fuel ${w.fuel} out of 100${m?"; "+w.nitro.toFixed(1)+" seconds saved":""}`);let g=w.nitroActive?m:0;g&&g!==wu&&(Ke.tone("nitro"+g),ii("go")),wu=g;let p=vt.rivalProjection(),v=kp(p.map(y=>({...y,distance:(w.rivals.find(P=>P.id===y.id)?.at??0)-w.distance})),{width:vt.viewport?.width||innerWidth,top:Oa.hudBottom+(e.approaching||e.route?60:0),bottom:Oa.controlsTop});for(let y of I("rival-tags").children){let P=w.rivals.find(B=>B.id===+y.dataset.rival),N=p.find(B=>B.id===P.id);y.hidden=!v.includes(P.id)||t||["finished","failed"].includes(w.status),y.style.left=(N?.x||0)+"px",y.style.top=(N?.y||0)+"px",y.classList.toggle("boosting",!!P.nitroActive),y.querySelector("small").textContent=(P.nitroActive?"NITRO \xB7 ":"")+(P.at>=w.distance?"+":"")+Math.round(P.at-w.distance)+"m"}let b=Math.max(0,Math.ceil(w.time)),_=Math.min(100,w.distance/w.arena.length*100);nt("time",Math.floor(b/60)+":"+String(b%60).padStart(2,"0")),I("time").parentElement.classList.toggle("urgent",b<20),I("progress-fill").style.width=_+"%",I("progress-fill").parentElement.setAttribute("aria-valuenow",String(Math.round(_))),nt("road-fairness",le.learningPaceProtected(w)?"TASK PACE PROTECTED \xB7 RIVALS MATCH YOU":"");let C=ed(w.route?.coaster?{...w,speedFactor:w.speedFactor*(vt?.rideSpeed||1)}:w,le.REGULAR_MAX_SPEED,le.MAX_SPEED);nt("speed",C),I("throttle").style.setProperty("--speed-fill",C/200),document.body.dataset.nitroLevel=String(w.nitroActive&&["driving","resolving"].includes(w.status)?w.nitroLevel||1:0),I("throttle").setAttribute("aria-pressed",String(!!w.accelerating||n&&Tu()));let S=!!w.route?.coaster&&!Mr().reduced&&(vt?.rideSpeed||1)>1.35;I("speedlines").classList.toggle("boost",(w.boost>0||S)&&w.status==="driving"),I("speedlines").classList.toggle("focus",w.status==="task"),I("speedlines").classList.toggle("accelerating",w.accelerating&&w.speedFactor>.05),I("left").setAttribute("aria-label",w.status==="task"&&w.task.kind==="pedestrian"?"Send visitor left":"Steer left"),I("right").setAttribute("aria-label",w.status==="task"&&w.task.kind==="pedestrian"?"Send visitor right":"Steer right");let A=w.status==="task"&&w.task?.kind==="pedestrian";if(I("left").disabled=I("right").disabled=A?w.task.pedWait>0||!le.pedestrianReady(w):le.steeringLocked(w)||!!le.exitAssist(w)||!!w.route,nt("drive-hint",s?"RESUMING":r?window.matchMedia("(pointer: coarse)").matches?"HOLD TO RESUME":"HOLD \u2191 TO RESUME":n?le.steeringLocked(w)?"AUTO CRUISE":"FOCUS \xB7 STEER":w.speedFactor<.05&&(w.yielding||w.followingTraffic)?w.yielding?"WAITING":"CHANGE LANE":le.exitAssist(w)?"ACCELERATE":w.route?w.route.shortcut?"SHORTCUT":"DETOUR":w.nitroActive?"NITRO BOOST":w.accelerating?"ACCELERATING":window.matchMedia("(pointer: coarse)").matches?"HOLD TO DRIVE":"HOLD \u2191"),w.notice){let y=w.notice;w.notice=null,y.type==="nitro"?Ms(y.text,!1,()=>w?.nitro>0):y.type==="collision"||y.type==="breakdown"?(I("hit-flash").classList.remove("active"),I("hit-flash").offsetWidth,I("hit-flash").classList.add("active"),Ke.tone(y.type==="breakdown"?"breakdown":"collision"),ii("collision")):y.type==="correct"||y.type==="sorted"?(Ke.tone("correct"),ii("correct"),Ms(y.text)):y.type==="wrong"&&(Ke.tone("wrong"),Ms(y.text,!0))}if(w.status==="countdown"){I("countdown").hidden=!1;let y=Math.max(1,Math.ceil(w.countdown));y!==Su&&(Su=y,nt("launch-number",y),I("countdown").dataset.step=y,[...I("countdown").querySelectorAll(".launch-lights i")].forEach((P,N)=>P.classList.toggle("lit",N<4-y)),Ke.tone("tick"),ii("click"))}if(w.status!=="countdown"&&!I("countdown").hidden&&(I("countdown").hidden=!0),w.status!==Na){let y=Na;Na=w.status,Wt.enabled&&!w.leagueTicket&&!w.reviewLap&&w.taskIndex!==Qp&&(Qp=w.taskIndex,performance.now()-um>4e3&&fm(w)),w.status==="driving"&&(I("countdown").hidden=!0,I("controls").hidden=Yt,I("road-learning").hidden=!0,y==="countdown"&&(Ke.tone("go"),ii("go"),Ms("GO \xB7 FIND YOUR LINE"))),w.status==="task"&&(I("controls").hidden=Yt,I("warning").hidden=!0),["finished","failed"].includes(w.status)&&!bc&&AM()}let R=e.route,M=!!R&&!e.approaching&&!t&&!["finished","failed"].includes(w.status);if(I("route-status").hidden=!M,M){let y=!w.route;I("route-status").classList.toggle("detour",!R.shortcut),nt("route-label",y?"MERGING":R.coaster?"SKY COASTER \xB7 \u221218m":R.shortcut?"SHORTCUT \xB7 \u221218m":"DETOUR \xB7 +32m"),nt("route-remaining",Math.max(0,Math.ceil((y?R.exitEndAt:R.end)-w.distance))+"m"),I("route-status").style.setProperty("--route-progress",le.clamp((w.distance-R.start)/(R.exitEndAt-R.start),0,1))}if(I("warning").hidden=!e.approaching,e.approaching){let y=e.next.kind;I("warning-title").textContent={light:"Traffic light ahead",repair:"Road repair ahead",junction:"Choose your route",pedestrian:"Crosswalk ahead"}[y],nt("warning-sub",e.next.coaster?"The right answer rides the Sky Coaster!":"Get ready to read."),I("warning-icon").textContent={light:"\u25CF",repair:"\u25B0",junction:"\u2442",pedestrian:"\u2194"}[y],nt("warning-distance",Math.ceil(e.ahead)+"m")}cm(),TM(),jp(i,e)}function Lu(){return Ke.unlock(),le.activateNitro(w)?(ii("go"),!0):!1}I("nitro").addEventListener("pointerdown",i=>{i.button>0||Ss!==null||(i.preventDefault(),le.engageNitro(w)&&(Ke.unlock(),Ss=i.pointerId,I("nitro").setPointerCapture(i.pointerId),mt()))});for(let i of["pointerup","pointercancel","lostpointercapture"])I("nitro").addEventListener(i,e=>{Ss===e.pointerId&&(Ss=null,mt(),I("nitro").hasPointerCapture?.(e.pointerId)&&I("nitro").releasePointerCapture(e.pointerId))});I("nitro").addEventListener("keydown",i=>{(i.code==="Space"||i.key==="Enter")&&(!i.repeat&&le.engageNitro(w)&&(As=!0,Ke.unlock(),mt()),i.preventDefault(),i.stopPropagation())});I("nitro").addEventListener("keyup",i=>{(i.code==="Space"||i.key==="Enter")&&(As=!1,mt(),i.preventDefault(),i.stopPropagation())});I("nitro").addEventListener("blur",()=>{As=!1,mt()});I("nitro-stack").addEventListener("keydown",i=>{(i.key===" "||i.key==="Enter")&&i.stopPropagation()});function Es(i){Ke.unlock(),w&&le.move(w,i)&&(Ke.tone("click"),ii("click"))}document.querySelectorAll("[data-team]").forEach(i=>i.onclick=()=>{J.teamId=i.dataset.team,Ke.tone("click"),Ts()});I("league-button").onclick=mm;pm();Wt.enabled&&(Wt.flush().catch(()=>{}),Wt.refresh(J.grade).then(Ga,()=>{}));I("lesson-picker").onclick=xM;document.querySelectorAll("[data-diff]").forEach(i=>i.onclick=()=>{J.difficulty=i.dataset.diff,Zt=0,Ts()});I("settings").onclick=hm;I("start").onclick=()=>{Ke.unlock(),J.crosswalkTutorial?vr():Iu(!0)};I("help").onclick=()=>Iu();I("progress-button").onclick=RM;I("garage-button").onclick=_c;I("nitro").onclick=i=>{i.detail===0&&w&&w.nitro<=0&&Lu()};I("nitro-stack").onclick=Lu;I("pause").onclick=wr;I("brand-home").onclick=i=>{i.preventDefault(),bM()};for(let[i,e]of[["left",-1],["right",1]])I(i).onpointerdown=t=>{t.button>0||(t.preventDefault(),Es(e))},I(i).onclick=t=>{t.detail===0&&Es(e)};I("sound").onclick=()=>{J.sound=!J.sound,Ke.unlock(),Ec(),Gn(),Ke.tone("click")};I("throttle").addEventListener("pointerdown",i=>{i.button>0||zi!==null||!w||!["driving","task","resolving"].includes(w.status)||(i.preventDefault(),zi=i.pointerId,I("throttle").setPointerCapture(i.pointerId),Ke.unlock(),mt())});for(let i of["pointerup","pointercancel","lostpointercapture"])I("throttle").addEventListener(i,e=>{zi===e.pointerId&&(zi=null,mt(),I("throttle").hasPointerCapture?.(e.pointerId)&&I("throttle").releasePointerCapture(e.pointerId))});I("throttle").addEventListener("keydown",i=>{i.key==="Enter"&&(!i.repeat&&w&&["driving","task","resolving"].includes(w.status)&&(Er=!0,Ke.unlock(),mt()),i.preventDefault(),i.stopPropagation())});I("throttle").addEventListener("keyup",i=>{i.key==="Enter"&&(Er=!1,mt(),i.preventDefault(),i.stopPropagation())});I("throttle").addEventListener("blur",()=>{Er=!1,mt()});var Pt=null;I("world").addEventListener("pointerdown",i=>{if(i.button>0||Pt&&Pt.id!==i.pointerId)return;(i.pointerType==="touch"||i.pointerType==="pen")&&za(!0);let e=Ru||i.pointerType==="touch"||i.pointerType==="pen"||Yt&&i.pointerType!=="mouse",t=w&&(["driving","task","resolving"].includes(w.status)||e&&w.status==="countdown");if(t&&(i.preventDefault(),im()),!t)return;let n=e||vt.isCarHit(i.clientX,i.clientY);Pt={x:i.clientX,y:i.clientY,id:i.pointerId,hold:n,touch:e,drive:e?ju(i.clientX,i.clientY):null,nitroAllowed:le.canEngageNitro(w)},I("world").setPointerCapture(i.pointerId),n&&(dn=i.pointerId,I("world").setPointerCapture(i.pointerId),Ke.unlock(),mt(),i.preventDefault())});function xm(i){if(Pt?.id!==i.pointerId)return;if(Pt.touch){let t=Lc(Pt.drive,i.clientX,i.clientY);if(i.preventDefault(),t.steer&&Es(t.steer),t.boostChanged&&!t.boost&&(on=null),t.boost&&(t.boostChanged||t.levelChanged)&&le.canEngageNitro(w)&&le.engageNitro(w))for(Ke.unlock(),on=i.pointerId;(w.nitroLevel||0)<t.level&&le.canNitro(w);)le.activateNitro(w);mt();return}let e=Ju(Pt,i.clientX,i.clientY);e&&(i.preventDefault(),dn=null,Pt.hold=!1,mt(),e.type==="steer"?Es(e.direction):e.type==="nitro"&&Pt.nitroAllowed&&le.engageNitro(w)&&(Ke.unlock(),on=i.pointerId,mt()))}I("world").addEventListener("pointermove",xm);I("world").addEventListener("pointerup",i=>{if(Pt?.id===i.pointerId&&Pt.touch){let t=Lc(Pt.drive,i.clientX,i.clientY);t.steer&&Es(t.steer),IM(i.pointerId);return}on===i.pointerId&&(on=null,mt()),dn===i.pointerId&&(dn=null,mt()),Pt?.id===i.pointerId&&(xm(i),Pt=null),on===i.pointerId&&(on=null,mt()),I("world").hasPointerCapture?.(i.pointerId)&&I("world").releasePointerCapture(i.pointerId)});function IM(i){Pt?.id===i&&(Pt=null),on===i&&(on=null),dn===i&&(dn=null),mt(),I("world").hasPointerCapture?.(i)&&I("world").releasePointerCapture(i)}I("world").addEventListener("pointercancel",i=>{on===i.pointerId&&(on=null,mt()),dn===i.pointerId&&(dn=null,mt()),Pt?.id===i.pointerId&&(Pt=null)});I("world").addEventListener("lostpointercapture",i=>{on===i.pointerId&&(on=null,mt()),dn===i.pointerId&&(dn=null,mt()),Pt?.id===i.pointerId&&(Pt=null)});document.addEventListener("keydown",i=>{if(!["SELECT","INPUT"].includes(document.activeElement.tagName)){if(!I("modal-backdrop").hidden){if(i.key==="Tab"){let e=[...I("modal").querySelectorAll('button:not(:disabled),select,summary,[tabindex="0"]')],t=e[0],n=e.at(-1);i.shiftKey&&(document.activeElement===t||document.activeElement===I("modal"))?(n?.focus(),i.preventDefault()):!i.shiftKey&&document.activeElement===n&&(t?.focus(),i.preventDefault())}if(i.key==="Escape"&&I("lesson-cancel")){I("lesson-cancel").click();return}if(i.key==="Escape"&&I("settings-done")){I("settings-done").click();return}i.key==="Escape"&&w?.status==="paused"&&(I("resume")?.click(),!I("resume")&&I("help-done")&&I("help-done").click());return}if(i.key==="ArrowUp"&&w&&["driving","task","resolving"].includes(w.status)){i.repeat||(Va=!0,Ke.unlock(),mt()),i.preventDefault();return}if(i.key===" "&&w){!i.repeat&&le.engageNitro(w)&&(As=!0,Ke.unlock(),mt()),i.preventDefault();return}if(!i.repeat&&w&&["n","N"].includes(i.key)){Lu(),i.preventDefault();return}i.repeat||((i.key==="ArrowLeft"||i.key.toLowerCase()==="a")&&(Es(-1),i.preventDefault()),(i.key==="ArrowRight"||i.key.toLowerCase()==="d")&&(Es(1),i.preventDefault()),(i.key==="Escape"||i.key.toLowerCase()==="p")&&wr(),w?.status==="task"&&/^[1-3]$/.test(i.key)&&(w.task.kind==="repair"?Ac(w.task.order[Number(i.key)-1]):w.task.kind==="pedestrian"?i.key!=="2"&&le.sortPerson(w,i.key==="1"?0:1):le.choose(w,Number(i.key)-1),i.preventDefault()),Sr==="home"&&i.key==="Enter"&&I("start").click())}});document.addEventListener("keyup",i=>{i.key===" "&&(As=!1,mt(),w&&i.preventDefault()),i.key==="ArrowUp"&&(Va=!1,mt(),w&&i.preventDefault())});window.addEventListener("blur",()=>{Wa(),wr()});document.addEventListener("visibilitychange",()=>{document.hidden?wr():Ga()});document.addEventListener("graphicslost",()=>{wr(),I("graphics-error").hidden=!1});try{vt=new uc(I("world"))}catch(i){console.error(i),I("graphics-error").hidden=!1,I("loading").hidden=!0}Ts();Ec();Cu();var nm=performance.now(),Mu=0;function ym(i){let e=(i-nm)/1e3,t=Math.min(e,.06);nm=i,vt?.samplePerformance(e,!!w&&["driving","task","resolving"].includes(w.status)),mt(),w&&le.tick(w,t,vt?.currentLane??w.lane),Mu=!I("modal-backdrop").hidden&&(!w||["paused","finished","failed"].includes(w.status))?Mu+1:0,Mu%6===0&&vt?.update(t,w,Sr),CM(i),Ke.update(w,vt?.spectators?.proximity||0),i>Oi&&I("toast").classList.remove("visible"),Fa&&i>Fa&&(nt("road-feedback",""),Fa=0),requestAnimationFrame(ym)}requestAnimationFrame(ym);setTimeout(()=>I("loading").hidden=!0,500);window.WORDRAMP=window.WORDRIFT=window.WORDSHIFT={version:"0.26.0",ulti:Object.freeze({snapshot:i=>Wt.snapshot(i??J.grade),enabled:Wt.enabled}),get race(){return w},get settings(){return J},get scene(){return vt}};})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
