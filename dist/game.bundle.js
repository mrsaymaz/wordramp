(()=>{var Hu="wordramp",Gu="https://mrsaymaz.netlify.app/api/ulti",vm=Object.freeze(["gryffindor","hufflepuff","slytherin","ravenclaw"]),bm=Object.freeze({capacity:100,maxStrength:2,hours:72}),zu="wordramp-league.v1",Mm=48*36e5,Sm=47*36e5;function Vu(i){return i&&typeof i.ultiApi=="string"?i.ultiApi.trim():Gu}function Em(i,e,t=Date.now()){let n=t-e*36e5;return(Array.isArray(i)?i:[]).reduce((s,[r,a])=>r*6e4>n&&Number.isFinite(a)?s+a:s,0)}function wm(i,e,t){return e>0?1+(t-1)*Math.sqrt(Math.min(Math.max(i,0),e)/e):1}var Wu=i=>"x"+i.toFixed(2);function Tm(i){let e=i?.games?.[Hu];return i&&i.enabled!==!1&&e&&e.enabled!==!1?e:null}function Xu(i){return i%24===0?`${i/24} day${i===24?"":"s"}`:`${i} hours`}function Am(i=24){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=new Uint8Array(i);if(globalThis.crypto?.getRandomValues)globalThis.crypto.getRandomValues(t);else for(let n=0;n<i;n++)t[n]=Math.floor(Math.random()*256);return Array.from(t,n=>e[n%e.length]).join("")}function qu({api:i=Gu,storage:e=globalThis.localStorage,fetchImpl:t=globalThis.fetch?.bind(globalThis),now:n=()=>Date.now(),timeoutMs:s=8e3}={}){let r=!!i,a={},o=()=>{try{let S=e?.getItem(zu);if(S){let A=JSON.parse(S);if(A&&typeof A=="object")return A}}catch{}return a},c=S=>{a=S;try{e?.setItem(zu,JSON.stringify(S))}catch{}},l=()=>{let S=o();return S.pools||={},S.outbox||=[],S.tickets||={},S};function h(){let S=l();return(typeof S.device!="string"||!/^[A-Za-z0-9_-]{8,64}$/.test(S.device))&&(S.device=Am(),c(S)),S.device}async function u(S){if(!r||!t)return{kind:"off"};let A=typeof AbortController=="function"?new AbortController:null,R=A?setTimeout(()=>A.abort(),s):null;try{let y=await t(i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(S),signal:A?.signal}),v=null;try{v=await y.json()}catch{}return y.status>=500||v?.retry===!0?{kind:"retry",status:y.status,data:v}:y.ok&&v?.status==="success"?{kind:"ok",data:v}:{kind:"refused",status:y.status,data:v}}catch{return{kind:"retry"}}finally{R&&clearTimeout(R)}}function f(S){let A=l();if(S?.settings&&typeof S.settings=="object"&&(A.settings=S.settings),S?.pools&&typeof S.pools=="object")for(let[R,y]of Object.entries(S.pools))A.pools[R]={at:n(),pool:y};c(A)}function d(S){let A=l(),R=A.settings||null,y={...bm,...R||{}},v=A.pools[S]?.pool||{},C=n(),L=vm.map(O=>{let z=Em(v[O]?.entries,y.hours,C);return{id:O,points:z,players:v[O]?.players||0,strength:wm(z,y.capacity,y.maxStrength)}});return{enabled:r,known:!!R,settings:R,game:Tm(R),capacity:y.capacity,hours:y.hours,teams:L,updatedAt:A.pools[S]?.at||null}}async function m(S){if(!r)return d(S);let A=await u({action:"pools",grade:S});return A.kind==="ok"&&f(A.data),{...d(S),online:A.kind==="ok"}}function x(S){let A=n();for(let[R,y]of Object.entries(S.tickets))(!y||A-y.at>Mm)&&delete S.tickets[R];S.outbox=S.outbox.filter(R=>R&&A-R.at<=Sm)}async function g({runId:S,grade:A,team:R,arena:y,pace:v,unit:C=""}){if(!r)return null;let L=l().tickets[S];if(L)return L.ticket;let O=await u({action:"start",game:Hu,grade:A,team:R,arena:y,pace:v,unit:String(C).replace(/[^A-Za-z0-9_-]/g,"").slice(0,24),device:h()});if(O.kind!=="ok"||typeof O.data.ticket!="string")return null;let z=l();return x(z),z.tickets[S]={ticket:O.data.ticket,at:n(),grade:A,team:R},c(z),O.data.ticket}let p=S=>l().tickets[S]?.ticket||null;async function b(S){let A=await u({action:"claim",ticket:S,device:h()});if(A.kind==="ok"){f(A.data);let R=A.data;return{state:"counted",points:R.points||0,requested:R.requested,deviceWins:R.deviceWins,reason:R.reason||null,duplicate:!!R.duplicate}}return A.kind==="refused"?{state:"refused",reason:A.data?.reason||"refused"}:{state:"retry"}}async function M(S){if(!r)return{state:"off"};let A=l(),R=A.tickets[S];if(!R)return{state:"no-ticket"};delete A.tickets[S],c(A);let y=await b(R.ticket);if(y.state==="retry"){let v=l();return v.outbox.push({ticket:R.ticket,at:R.at,grade:R.grade,team:R.team}),x(v),c(v),{state:"queued"}}return y}async function _(){if(!r)return[];let S=l();x(S),c(S);let A=[];for(let R of S.outbox.slice()){let y=await b(R.ticket);if(y.state!=="retry"){let v=l();v.outbox=v.outbox.filter(C=>C.ticket!==R.ticket),c(v)}A.push({...R,...y})}return A}return{enabled:r,device:h,refresh:m,snapshot:d,start:g,ticketFor:p,claim:M,flush:_,outbox:()=>l().outbox.slice()}}var Rr=Object.freeze([{id:"slytherin",name:"Slytherin",color:3314796,accent:"#8ce4bd",letter:"S"},{id:"hufflepuff",name:"Hufflepuff",color:15317056,accent:"#ffe09b",letter:"H"},{id:"gryffindor",name:"Gryffindor",color:13125971,accent:"#ffadb1",letter:"G"},{id:"ravenclaw",name:"Ravenclaw",color:4685774,accent:"#a5caff",letter:"R"}].map(Object.freeze)),$a=Object.freeze({relaxed:Object.freeze([2,4,6]),challenge:Object.freeze([5,7,9])}),Wi=2,Is=.6,Xi=40,Rm=10,Yu=4320*60*1e3,Lc=i=>i==="challenge"||i==="standard"?"challenge":"relaxed",Cr=(i,e)=>$a[Lc(i)][e]??0,$u=i=>{let e=new Date(i);return e.getFullYear()+"-"+(e.getMonth()+1)+"-"+e.getDate()},Zu=(i,e)=>{let t=$u(e);return i.receipts.filter(n=>$u(n.earnedAt)===t).reduce((n,s)=>n+s.points,0)};function Dc(i,e=Date.now()){return Zu(Pr(i),e)}function Cm(i){return i.schemaVersion===2?Number.isInteger(i.points)&&i.points>=1&&i.points<=Cr(i.difficulty,i.arenaIndex):i.points===Rm}function Ir(i){return!i||i.status!=="finished"||i.failureReason||i.breakdown||(i.damage||0)>=3?!1:!Number.isFinite(i.arena?.length)||Number.isFinite(i.distance)&&i.distance>=i.arena.length}var Xt=i=>Rr.find(e=>e.id===i)||null;function Uc(i="run"){let e=globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+"-"+Math.random().toString(36).slice(2)+"-"+Math.random().toString(36).slice(2);return i+"-"+e}function Pr(i){i.teamId=Xt(i.teamId)?.id||null;let e=i.ulti&&typeof i.ulti=="object"?i.ulti:{},t=new Set,n=(Array.isArray(e.receipts)?e.receipts:[]).filter(s=>!s||s.sourceGame!=="wordshift-rally"||!Xt(s.teamId)||!Cm(s)||typeof s.runId!="string"||s.eventId!=="wordshift-rally:"+s.runId||!Number.isFinite(s.earnedAt)||s.expiresAt!==s.earnedAt+Yu||t.has(s.eventId)?!1:(t.add(s.eventId),!0)).map(s=>({...s}));return i.ulti={schemaVersion:1,driverId:typeof e.driverId=="string"&&e.driverId?e.driverId:Uc("driver"),receipts:n},i.ulti}function Ya(i,e=Date.now()){let t=Pr(i),n=t.receipts.filter(r=>r.earnedAt<=e&&r.expiresAt>e).map(r=>({...r})),s=Object.fromEntries(Rr.map(r=>[r.id,n.filter(a=>a.teamId===r.id).reduce((a,o)=>a+o.points,0)]));return{schemaVersion:2,sourceGame:"wordshift-rally",driverId:t.driverId,generatedAt:e,validityHours:72,rules:{points:$a,minRelaxedAccuracy:Is,minChallengeStars:Wi,dailyCap:Xi,earnedToday:Dc(i,e)},totals:s,receipts:n}}function Ju(i,e,t,n,s=Date.now()){let r=Pr(i);if(!Ir(e)||e.reviewLap||t!==1||!Xt(e.teamId)||typeof e.runId!="string"||!e.runId||!Number.isFinite(s))return{status:"none"};let a="wordshift-rally:"+e.runId,o=r.receipts.find(m=>m.eventId===a);if(o)return{status:"awarded",receipt:{...o},duplicate:!0};let c=e.tasks?.length&&Number.isFinite(e.correct)?e.correct/e.tasks.length:null;if(!(Lc(e.difficulty)==="relaxed"&&c!=null?c>=Is-1e-9:n>=Wi))return{status:"stars",points:0};let h=Cr(e.difficulty,e.arenaIndex),u=Math.max(0,Xi-Zu(r,s)),f=Math.min(h,u);if(f<=0)return{status:"cap",points:0};let d={schemaVersion:2,sourceGame:"wordshift-rally",eventId:a,runId:e.runId,driverId:r.driverId,teamId:e.teamId,points:f,earnedAt:s,expiresAt:s+Yu,grade:e.unit.grade??Number(e.unit.id.match(/^g(\d+)/)?.[1]),unitId:e.unit.id,difficulty:Lc(e.difficulty),arenaId:e.arena.id,arenaIndex:e.arenaIndex,stars:n,...c!=null?{accuracy:Math.round(c*100)/100}:{}};return r.receipts.push(d),{status:"awarded",receipt:{...d},capped:f<h}}function Nc(i,e=Date.now()){return JSON.stringify(Ya(i,e),null,2)}var Za=class{constructor(e){this.enabled=e,this.ctx=null,this.engine=null,this.arena=-1}unlock(){if(this.enabled())try{if(this.ctx||=new(window.AudioContext||window.webkitAudioContext),this.ctx.resume().catch(()=>{}),this.engine)return;let e=this.ctx;this.compressor=e.createDynamicsCompressor(),this.compressor.threshold.value=-18,this.compressor.ratio.value=4,this.compressor.connect(e.destination),this.master=e.createGain(),this.master.gain.value=.7,this.master.connect(this.compressor),this.focusFilter=e.createBiquadFilter(),this.focusFilter.type="lowpass",this.focusFilter.frequency.value=16e3,this.world=e.createGain(),this.world.gain.value=1,this.world.connect(this.focusFilter),this.focusFilter.connect(this.master);let t=(c,l)=>{let h=e.createOscillator(),u=e.createGain();return h.type=c,u.gain.value=0,h.connect(u),u.connect(l),h.start(),[h,u]};this.engineFilter=e.createBiquadFilter(),this.engineFilter.type="lowpass",this.engineFilter.frequency.value=500,this.engineFilter.Q.value=1.4,this.engineFilter.connect(this.world),[this.engine,this.engineGain]=t("sawtooth",this.engineFilter),[this.sub,this.subGain]=t("triangle",this.engineFilter),[this.harmonic,this.harmonicGain]=t("sine",this.world);let n=(c,l)=>{let h=e.createBuffer(1,e.sampleRate*c,e.sampleRate),u=h.getChannelData(0),f=0;for(let d=0;d<u.length;d++)f=l(f,Math.random()*2-1,d),u[d]=f;return h};this.noiseBuffer=n(2,(c,l)=>(c+l*.02)/1.02*1||0);{let c=this.noiseBuffer.getChannelData(0);for(let l=0;l<c.length;l++)c[l]*=3.5}this.whiteBuffer=n(2,(c,l)=>l);let s=(c,l,h,u=.7)=>{let f=e.createBufferSource(),d=e.createBiquadFilter(),m=e.createGain();return f.buffer=c,f.loop=!0,d.type=l,d.frequency.value=h,d.Q.value=u,m.gain.value=0,f.connect(d),d.connect(m),m.connect(this.world),f.start(),{source:f,filter:d,gain:m}};this.wind=s(this.noiseBuffer,"lowpass",450),this.windGain=this.wind.gain,this.filter=this.wind.filter,this.nitroLayer=s(this.whiteBuffer,"bandpass",1600,.9),[this.whine,this.whineGain]=t("sine",this.world),this.ambience=s(this.noiseBuffer,"lowpass",260,.5),this.ambienceSwell=e.createOscillator(),this.ambienceDepth=e.createGain(),this.ambienceDepth.gain.value=0,this.ambienceSwell.frequency.value=.12,this.ambienceSwell.connect(this.ambienceDepth),this.ambienceDepth.connect(this.ambience.gain.gain),this.ambienceSwell.start();let r=e.createBuffer(1,e.sampleRate*3,e.sampleRate),a=r.getChannelData(0),o=0;for(let c=0;c<a.length;c++)o=(o+(Math.random()*2-1)*.12)/1.12,a[c]=o*(.65+.35*Math.sin(c/e.sampleRate*3.7));this.crowdBuffer=r,this.crowd=s(r,"bandpass",850,.45),this.crowdGain=this.crowd.gain}catch(e){console.warn("Wordramp audio unavailable",e)}}setArena(e){if(!this.ambience||e===this.arena)return;this.arena=e;let t=this.ctx.currentTime,n=this.ambience,s=[{type:"lowpass",f:240,q:.5,depth:.004},{type:"bandpass",f:520,q:.6,depth:.018},{type:"highpass",f:2600,q:.4,depth:.003}][e]||{type:"lowpass",f:240,q:.5,depth:0};n.filter.type=s.type,n.filter.frequency.setTargetAtTime(s.f,t,.3),n.filter.Q.value=s.q,this.swellDepth=s.depth}voice(e,t,n,s,r,a=this.master,o=null){let c=this.ctx.createOscillator(),l=this.ctx.createGain();c.type=e,c.frequency.setValueAtTime(t,n),o&&c.frequency.exponentialRampToValueAtTime(o,n+s),l.gain.setValueAtTime(1e-4,n),l.gain.exponentialRampToValueAtTime(r,n+.012),l.gain.exponentialRampToValueAtTime(1e-4,n+s),c.connect(l),l.connect(a),c.start(n),c.stop(n+s+.02),c.onended=()=>{c.disconnect(),l.disconnect()}}burst(e,t,n,s,r,a=this.whiteBuffer){let o=this.ctx.createBufferSource(),c=this.ctx.createBiquadFilter(),l=this.ctx.createGain();o.buffer=a,c.type=s,c.frequency.value=r,l.gain.setValueAtTime(1e-4,e),l.gain.exponentialRampToValueAtTime(n,e+.006),l.gain.exponentialRampToValueAtTime(1e-4,e+t),o.connect(c),c.connect(l),l.connect(this.master),o.start(e,Math.random(),t+.05),o.onended=()=>{o.disconnect(),c.disconnect(),l.disconnect()}}tone(e){if(!this.enabled()||!this.ctx||!this.master)return;if(/^nitro[123]$/.test(e)){this.boost(+e.at(-1));return}let t=this.ctx.currentTime;if(e==="correct"){[659,880,1318].forEach((s,r)=>{this.voice("triangle",s,t+r*.07,.24,.075),this.voice("sine",s*2,t+r*.07,.16,.02)});return}if(e==="wrong"){this.voice("triangle",233,t,.22,.07),this.voice("triangle",196,t+.11,.3,.065);return}if(e==="collision"){this.voice("sine",140,t,.32,.22,this.master,42),this.burst(t,.18,.16,"lowpass",1400),this.burst(t+.02,.08,.07,"highpass",3200);return}if(e==="breakdown"){[110,92,74,58].forEach((s,r)=>this.voice("sawtooth",s,t+r*.17,.32,.06)),this.burst(t,.5,.12,"lowpass",700);return}if(e==="finish"){[523,659,784,1046,1318].forEach((s,r)=>{this.voice("triangle",s,t+r*.11,.4,.07),this.voice("sine",s/2,t+r*.11,.4,.03)});return}if(e==="go"){[392,587,784].forEach((s,r)=>this.voice("square",s,t+r*.08,.18,.035));return}if(e==="tick"){this.voice("square",440,t,.12,.03);return}({click:[520],build:[493,740],pause:[330],overtake:[740,988]}[e]||[440]).forEach((s,r)=>this.voice("sine",s,t+r*.065,.2,e==="click"?.035:.08))}boost(e){let t=this.ctx,n=t.currentTime,s=t.createBufferSource(),r=t.createBiquadFilter(),a=t.createGain();s.buffer=this.noiseBuffer,r.type="bandpass",r.Q.value=.65,r.frequency.setValueAtTime(1800+e*350,n),r.frequency.exponentialRampToValueAtTime(250,n+.42),a.gain.setValueAtTime(1e-4,n),a.gain.exponentialRampToValueAtTime(.16+e*.025,n+.025),a.gain.exponentialRampToValueAtTime(1e-4,n+.5),s.connect(r),r.connect(a),a.connect(this.master),s.start(n),s.stop(n+.52),s.onended=()=>{s.disconnect(),r.disconnect(),a.disconnect()},this.voice("triangle",150+e*25,n,.34,.085,this.master,52)}applause(){if(!this.enabled()||!this.ctx||!this.crowd)return;let e=this.ctx,t=e.currentTime;for(let n=0;n<3;n++){let s=e.createBufferSource(),r=e.createBiquadFilter(),a=e.createGain(),o=t+n*.14;s.buffer=this.crowdBuffer,r.type="highpass",r.frequency.value=1200,a.gain.setValueAtTime(1e-4,o),a.gain.exponentialRampToValueAtTime(.095,o+.006),a.gain.exponentialRampToValueAtTime(1e-4,o+.085),s.connect(r),r.connect(a),a.connect(this.master),s.start(o,n*.31,.1),s.onended=()=>{s.disconnect(),r.disconnect(),a.disconnect()}}}update(e,t=0){if(!this.ctx||!this.engine)return;e&&this.setArena(e.arenaIndex??0);let n=this.enabled(),s=n&&e&&["driving","task","resolving","breakdown"].includes(e.status),r=s?Math.max(0,e.speedFactor):0,a=this.ctx.currentTime,o=Math.floor(r*2.2),c=(52+r*30-o*8)*(e?.status==="breakdown"?.65+Math.abs(Math.sin(e.elapsed*24))*.25:1),l=e?.accelerating||e?.nitroActive?1:.55;this.engine.frequency.setTargetAtTime(c,a,.1),this.sub.frequency.setTargetAtTime(c*.5,a,.1),this.harmonic.frequency.setTargetAtTime(c*2.01,a,.12),this.engineFilter.frequency.setTargetAtTime(260+r*520*l,a,.15),this.engineGain.gain.setTargetAtTime(s?(.016+r*.006)*l:0,a,.1),this.subGain.gain.setTargetAtTime(s?.02+r*.004:0,a,.1),this.harmonicGain.gain.setTargetAtTime(s?.004+r*.002:0,a,.12),this.windGain.gain.setTargetAtTime(s?.008*r*r:0,a,.16),this.filter.frequency.setTargetAtTime(300+r*650,a,.2);let h=s&&e.nitroActive?Math.max(1,e.nitroLevel||1):0;this.nitroLayer.gain.gain.setTargetAtTime(h?.018+h*.008:0,a,h?.05:.2),this.nitroLayer.filter.frequency.setTargetAtTime(1300+h*450,a,.1),this.whine.frequency.setTargetAtTime(900+r*260,a,.1),this.whineGain.gain.setTargetAtTime(h?.006+h*.003:0,a,h?.05:.2);let u=n&&e&&!["paused","finished","failed"].includes(e.status);this.ambience.gain.gain.setTargetAtTime(u?[.02,.03,.026][e.arenaIndex??0]??.02:0,a,.5),this.ambienceDepth.gain.setTargetAtTime(u&&this.swellDepth||0,a,.5);let f=n&&e?Math.max(0,Math.min(1,e.focusAmount||0)):0;this.focusFilter.frequency.setTargetAtTime(16e3-f*14800,a,.15),this.world.gain.setTargetAtTime(1-f*.35,a,.15);let d=s&&e.status==="driving"&&!e.yielding?Math.max(0,Math.min(1,t)):0;this.crowdGain.gain.setTargetAtTime(d*.14,a,.3),d>.75&&!this.cheerNear&&(this.cheerNear=!0,this.applause()),d<.25&&(this.cheerNear=!1)}};function Ku(i={},e=!1){return(!i||typeof i!="object")&&(i={}),{graphics:["auto","high","battery"].includes(i.graphics)?i.graphics:"auto",motion:["system","full","reduced"].includes(i.motion)?i.motion:"system",haptics:i.haptics!==!1,reduced:i.motion==="reduced"||i.motion!=="full"&&e}}function Fc(i="auto",e=1){let t=Math.min(e,i==="battery"?1:i==="high"?2:1.75);return{graphics:i,ceiling:t,ratio:t,seconds:0,frames:0,slow:0,cooldown:0}}function ju(i,e,t=!0){if(!t||i.graphics!=="auto"||e<=0||e>.15||(i.cooldown=Math.max(0,i.cooldown-e),i.seconds+=e,i.frames++,e>1/38&&i.slow++,i.seconds<2.5))return!1;let n=i.slow/i.frames>.35,s=!1;return n&&i.cooldown===0&&i.ratio>.85&&(i.ratio=Math.max(.85,i.ratio-.2),i.cooldown=5,s=!0),i.seconds=0,i.frames=0,i.slow=0,s}function Qu(i,e,t){if(!i||i.dispatched)return null;let n=e-i.x,s=t-i.y;return-s>=44&&-s>Math.abs(n)*1.25?(i.dispatched=!0,{type:"nitro"}):Math.abs(n)>=28&&Math.abs(n)>Math.abs(s)*1.2?(i.dispatched=!0,{type:"steer",direction:Math.sign(n)}):s>=44&&s>Math.abs(n)*1.25?(i.dispatched=!0,{type:"cancel"}):null}function ed(i,e){return{laneX:i,laneY:e,boostBase:e,peakY:e,boost:!1,level:0}}function Oc(i,e,t){let n=e-i.laneX,s=t-i.laneY,r=0,a=!1,o=!1;if(Math.abs(n)>=28&&Math.abs(n)>Math.abs(s)*1.2&&(r=Math.sign(n),i.laneX=e,i.laneY=t,i.boost||(i.boostBase=t)),i.boost){i.peakY=Math.min(i.peakY,t);let c=t-i.peakY;if(c>=28&&c>Math.abs(n)*1.2)i.boost=!1,i.level=0,i.boostBase=t,a=!0;else{let l=Math.min(3,Math.max(1,Math.floor((i.boostBase-t)/44)));l>i.level&&(i.level=l,o=!0)}}else{i.boostBase=Math.max(i.boostBase,t);let c=i.boostBase-t;c>=44&&c>Math.abs(n)*1.2&&(i.boost=!0,i.peakY=t,i.level=Math.min(3,Math.max(1,Math.floor(c/44))),a=!0)}return Math.abs(s)>Math.abs(n)*1.2&&(i.laneX=e,i.laneY=t),{steer:r,boost:i.boost,level:i.level,boostChanged:a,levelChanged:o}}function td(i,e){let t=e>=i?Math.min(124,Math.max(80,e*.16)):Math.min(72,Math.max(42,e*.17));return e-t}function nd(i,e=1.55,t=3.45){if(!i||!["driving","task","resolving"].includes(i.status))return 0;let n=Math.max(0,Number(i.speedFactor)||0),s=n<=e?n/e*90:90+(n-e)/(t-e)*110;return Math.max(0,Math.min(200,Math.round(s)))}function id(i,{modalOpen:e=!1}={}){if(!i)return{phase:"garage",question:!1,approaching:!1,route:null,announcementsAllowed:!e};let t=["task","resolving"].includes(i.status),n=i.status==="driving",s=i.tasks?.[i.taskIndex],r=s?.at-i.distance,a=n&&r>0&&r<(s.kind==="pedestrian"?174:90),o=i.route||(i.mergeAssist&&i.distance<i.mergeAssist.exitEndAt?i.mergeAssist:null),c=(i.obstacles||[]).some(h=>!h.passed&&!h.dormant&&h.at>i.distance-8&&h.at<i.distance+80);return{phase:t?"question":a?"approaching":o?"route":n?"driving":"inactive",question:t,approaching:a,next:s,ahead:r,route:o,announcementsAllowed:n&&!t&&!a&&!o&&!c&&!i.yielding&&!i.followingTraffic&&!e}}var Lr=Object.freeze({5:"A1",6:"A1+",7:"A2",8:"A2+"}),Im=Object.freeze({g5u1:"Naming school places and clubs, expressing likes and following school rules.",g5u2:"Following classroom instructions and talking about school subjects, objects and time.",g5u3:"Describing appearance, clothes and everyday routines.",g5u4:"Talking about family hobbies, routines and actions happening now.",g5u5:"Naming neighbourhood places and describing where things are in a city.",g5u6:"Ordering food and asking about quantities and prices.",g5u7:"Describing wild animals, their homes, abilities and size.",g5u8:"Describing natural places and making holiday plans.",g5u9:"Naming jobs and workplaces, and explaining what people do.",g5u10:"Asking about toys, colours, shapes and prices.",g6u1:"Talking about school roles, responsibilities and how often routines happen.",g6u2:"Describing study routines and comparing everyday activities with actions happening now.",g6u3:"Describing and comparing appearance, personality and personal belongings.",g6u4:"Talking about family jobs, homes and planned arrangements.",g6u5:"Describing festivals, transport and events in the past.",g6u6:"Talking about countries, languages, food culture and past food experiences.",g6u7:"Describing nature activities, reducing waste and protecting the environment.",g6u8:"Talking about planets, weather, future plans and predictions.",g6u9:"Comparing products and asking about prices and sizes.",g6u10:"Expressing feelings and needs, asking for help and discussing healthy habits.",g7u1:"Describing appearance and personality traits, and comparing people.",g7u2:"Talking about sports, equipment and how often people exercise.",g7u3:"Telling life stories and describing achievements, dates and past events.",g7u4:"Describing wild animals, their habitats and ways to protect them.",g7u5:"Talking about TV programmes, expressing preferences and sharing opinions.",g7u6:"Planning parties, making offers and suggestions, and talking about quantities.",g7u7:"Expressing hopes and ambitions, and making predictions about the future.",g7u8:"Naming public places, explaining their purposes and giving directions.",g7u9:"Discussing environmental problems and giving advice about solutions.",g7u10:"Comparing planets and exploring facts about space and space history.",g7u11:"Naming ingredients, following recipes and putting cooking steps in order.",g7u12:"Describing past holidays, asking about journeys and making travel plans.",g8u1:"Making invitations, accepting or refusing, and giving reasons and excuses.",g8u2:"Talking about teen routines, habits, preferences and opinions.",g8u3:"Naming kitchen tools and ingredients, and explaining recipes step by step.",g8u4:"Having phone conversations, taking messages and asking for clarification.",g8u5:"Talking about internet tools, online habits and staying safe online.",g8u6:"Comparing adventure sports, choosing equipment and following safety rules.",g8u7:"Describing destinations, comparing holidays and talking about past trips.",g8u8:"Sharing household chores and explaining responsibilities, rules and obligations.",g8u9:"Describing scientific achievements, experiments and laboratory instructions.",g8u10:"Discussing natural events, their effects, safety precautions and predictions.",g8u11:"Making polite shopping requests, comparing products and explaining purchase problems.",g8u12:"Describing pets, their daily needs and responsible care."});function sd(i){return Im[i.id]||i.targetLanguage?.slice(0,2).join(" \xB7 ")||"Practise this unit\u2019s vocabulary and useful everyday English."}var Bd=0,bh=1,kd=2;var Mh=1,sl=2,Kn=3,ui=0,zt=1,cn=2,vi=0,Ki=1,yn=2,Sh=3,Eh=4,zd=5,Pi=100,Hd=101,Gd=102,Vd=103,Wd=104,Xd=200,qd=201,$d=202,Yd=203,wo=204,To=205,Zd=206,Jd=207,Kd=208,jd=209,Qd=210,ef=211,tf=212,nf=213,sf=214,rl=0,al=1,ol=2,ji=3,ll=4,cl=5,hl=6,ul=7,wh=0,rf=1,af=2,bi=0,of=1,lf=2,cf=3,dl=4,hf=5,uf=6,df=7;var Th=300,ss=301,rs=302,cr=303,fl=304,Sa=306,Li=1e3,Ii=1001,Ao=1002,on=1003,ff=1004;var Ea=1005;var Nn=1006,pl=1007;var Fi=1008;var kn=1009,Ah=1010,Rh=1011,hr=1012,ml=1013,Oi=1014,zn=1015,ur=1016,gl=1017,xl=1018,dr=1020,Ch=35902,Ih=35899,Ph=1021,Lh=1022,Tn=1023,Js=1026,fr=1027,yl=1028,_l=1029,Dh=1030,vl=1031;var bl=1033,wa=33776,Ta=33777,Aa=33778,Ra=33779,Ml=35840,Sl=35841,El=35842,wl=35843,Tl=36196,Al=37492,Rl=37496,Cl=37808,Il=37809,Pl=37810,Ll=37811,Dl=37812,Ul=37813,Nl=37814,Fl=37815,Ol=37816,Bl=37817,kl=37818,zl=37819,Hl=37820,Gl=37821,Vl=36492,Wl=36494,Xl=36495,ql=36283,$l=36284,Yl=36285,Zl=36286;var Yr=2300,Ro=2301,Eo=2302,uh=2400,dh=2401,fh=2402;var pf=3200,mf=3201;var Uh=0,gf=1,Hn="",Ft="srgb",Qi="srgb-linear",Zr="linear",ot="srgb";var Ji=7680;var ph=519,xf=512,yf=513,_f=514,Nh=515,vf=516,bf=517,Mf=518,Sf=519,Co=35044,as=35048;var Fh="300 es",Un=2e3,Jr=2001;var di=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},Kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],rd=1234567,Wr=Math.PI/180,Ks=180/Math.PI;function Xn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Kt[i&255]+Kt[i>>8&255]+Kt[i>>16&255]+Kt[i>>24&255]+"-"+Kt[e&255]+Kt[e>>8&255]+"-"+Kt[e>>16&15|64]+Kt[e>>24&255]+"-"+Kt[t&63|128]+Kt[t>>8&255]+"-"+Kt[t>>16&255]+Kt[t>>24&255]+Kt[n&255]+Kt[n>>8&255]+Kt[n>>16&255]+Kt[n>>24&255]).toLowerCase()}function Ze(i,e,t){return Math.max(e,Math.min(t,i))}function Oh(i,e){return(i%e+e)%e}function Pm(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Lm(i,e,t){return i!==e?(t-i)/(e-i):0}function Xr(i,e,t){return(1-t)*i+t*e}function Dm(i,e,t,n){return Xr(i,e,1-Math.exp(-t*n))}function Um(i,e=1){return e-Math.abs(Oh(i,e*2)-e)}function Nm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Fm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Om(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Bm(i,e){return i+Math.random()*(e-i)}function km(i){return i*(.5-Math.random())}function zm(i){i!==void 0&&(rd=i);let e=rd+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Hm(i){return i*Wr}function Gm(i){return i*Ks}function Vm(i){return(i&i-1)===0&&i!==0}function Wm(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Xm(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function qm(i,e,t,n,s){let r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),f=a((e-n)/2),d=r((n-e)/2),m=a((n-e)/2);switch(s){case"XYX":i.set(o*h,c*u,c*f,o*l);break;case"YZY":i.set(c*f,o*h,c*u,o*l);break;case"ZXZ":i.set(c*u,c*f,o*h,o*l);break;case"XZX":i.set(o*h,c*m,c*d,o*l);break;case"YXY":i.set(c*d,o*h,c*m,o*l);break;case"ZYZ":i.set(c*m,c*d,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Dn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function at(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Ht={DEG2RAD:Wr,RAD2DEG:Ks,generateUUID:Xn,clamp:Ze,euclideanModulo:Oh,mapLinear:Pm,inverseLerp:Lm,lerp:Xr,damp:Dm,pingpong:Um,smoothstep:Nm,smootherstep:Fm,randInt:Om,randFloat:Bm,randFloatSpread:km,seededRandom:zm,degToRad:Hm,radToDeg:Gm,isPowerOfTwo:Vm,ceilPowerOfTwo:Wm,floorPowerOfTwo:Xm,setQuaternionFromProperEuler:qm,normalize:at,denormalize:Dn},ue=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},fi=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3],f=r[a+0],d=r[a+1],m=r[a+2],x=r[a+3];if(o===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=f,e[t+1]=d,e[t+2]=m,e[t+3]=x;return}if(u!==x||c!==f||l!==d||h!==m){let g=1-o,p=c*f+l*d+h*m+u*x,b=p>=0?1:-1,M=1-p*p;if(M>Number.EPSILON){let P=Math.sqrt(M),S=Math.atan2(P,p*b);g=Math.sin(g*S)/P,o=Math.sin(o*S)/P}let _=o*b;if(c=c*g+f*_,l=l*g+d*_,h=h*g+m*_,u=u*g+x*_,g===1-o){let P=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=P,l*=P,h*=P,u*=P}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[a],f=r[a+1],d=r[a+2],m=r[a+3];return e[t]=o*m+h*u+c*d-l*f,e[t+1]=c*m+h*f+l*u-o*d,e[t+2]=l*m+h*d+o*f-c*u,e[t+3]=h*m-o*u-c*f-l*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),u=o(r/2),f=c(n/2),d=c(s/2),m=c(r/2);switch(a){case"XYZ":this._x=f*h*u+l*d*m,this._y=l*d*u-f*h*m,this._z=l*h*m+f*d*u,this._w=l*h*u-f*d*m;break;case"YXZ":this._x=f*h*u+l*d*m,this._y=l*d*u-f*h*m,this._z=l*h*m-f*d*u,this._w=l*h*u+f*d*m;break;case"ZXY":this._x=f*h*u-l*d*m,this._y=l*d*u+f*h*m,this._z=l*h*m+f*d*u,this._w=l*h*u-f*d*m;break;case"ZYX":this._x=f*h*u-l*d*m,this._y=l*d*u+f*h*m,this._z=l*h*m-f*d*u,this._w=l*h*u+f*d*m;break;case"YZX":this._x=f*h*u+l*d*m,this._y=l*d*u+f*h*m,this._z=l*h*m-f*d*u,this._w=l*h*u-f*d*m;break;case"XZY":this._x=f*h*u-l*d*m,this._y=l*d*u-f*h*m,this._z=l*h*m+f*d*u,this._w=l*h*u+f*d*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],u=t[10],f=n+o+u;if(f>0){let d=.5/Math.sqrt(f+1);this._w=.25/d,this._x=(h-c)*d,this._y=(r-l)*d,this._z=(a-s)*d}else if(n>o&&n>u){let d=2*Math.sqrt(1+n-o-u);this._w=(h-c)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+l)/d}else if(o>u){let d=2*Math.sqrt(1+o-n-u);this._w=(r-l)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(c+h)/d}else{let d=2*Math.sqrt(1+u-n-o);this._w=(a-s)/d,this._x=(r+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ze(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-s*o,this._w=a*h-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,a=this._w,o=a*e._w+n*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;let c=1-o*o;if(c<=Number.EPSILON){let d=1-t;return this._w=d*a+t*this._w,this._x=d*n+t*this._x,this._y=d*s+t*this._y,this._z=d*r+t*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-t)*h)/l,f=Math.sin(t*h)/l;return this._w=a*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},N=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ad.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ad.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),h=2*(o*t-r*s),u=2*(r*n-a*t);return this.x=t+c*l+a*u-o*h,this.y=n+c*h+o*l-r*u,this.z=s+c*u+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this.z=Ze(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this.z=Ze(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Bc.copy(this).projectOnVector(e),this.sub(Bc)}reflect(e){return this.sub(Bc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Bc=new N,ad=new fi,We=class i{constructor(e,t,n,s,r,a,o,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],d=n[5],m=n[8],x=s[0],g=s[3],p=s[6],b=s[1],M=s[4],_=s[7],P=s[2],S=s[5],A=s[8];return r[0]=a*x+o*b+c*P,r[3]=a*g+o*M+c*S,r[6]=a*p+o*_+c*A,r[1]=l*x+h*b+u*P,r[4]=l*g+h*M+u*S,r[7]=l*p+h*_+u*A,r[2]=f*x+d*b+m*P,r[5]=f*g+d*M+m*S,r[8]=f*p+d*_+m*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-n*r*h+n*o*c+s*r*l-s*a*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=h*a-o*l,f=o*c-h*r,d=l*r-a*c,m=t*u+n*f+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return e[0]=u*x,e[1]=(s*l-h*n)*x,e[2]=(o*n-s*a)*x,e[3]=f*x,e[4]=(h*t-s*c)*x,e[5]=(s*r-o*t)*x,e[6]=d*x,e[7]=(n*c-l*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(kc.makeScale(e,t)),this}rotate(e){return this.premultiply(kc.makeRotation(-e)),this}translate(e,t){return this.premultiply(kc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},kc=new We;function Bh(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Kr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ef(){let i=Kr("canvas");return i.style.display="block",i}var od={};function js(i){i in od||(od[i]=!0,console.warn(i))}function wf(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var ld=new We().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),cd=new We().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function $m(){let i={enabled:!0,workingColorSpace:Qi,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ot&&(s.r=hi(s.r),s.g=hi(s.g),s.b=hi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ot&&(s.r=Ys(s.r),s.g=Ys(s.g),s.b=Ys(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Hn?Zr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return js("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return js("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Qi]:{primaries:e,whitePoint:n,transfer:Zr,toXYZ:ld,fromXYZ:cd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ft},outputColorSpaceConfig:{drawingBufferColorSpace:Ft}},[Ft]:{primaries:e,whitePoint:n,transfer:ot,toXYZ:ld,fromXYZ:cd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ft}}}),i}var tt=$m();function hi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ys(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Ps,Io=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ps===void 0&&(Ps=Kr("canvas")),Ps.width=e.width,Ps.height=e.height;let s=Ps.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Ps}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Kr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=hi(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(hi(t[n]/255)*255):t[n]=hi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Ym=0,Qs=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ym++}),this.uuid=Xn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(zc(s[a].image)):r.push(zc(s[a]))}else r=zc(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function zc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Io.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Zm=0,Hc=new N,sn=class i extends di{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Ii,s=Ii,r=Nn,a=Fi,o=Tn,c=kn,l=i.DEFAULT_ANISOTROPY,h=Hn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Zm++}),this.uuid=Xn(),this.name="",this.source=new Qs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new ue(0,0),this.repeat=new ue(1,1),this.center=new ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Hc).x}get height(){return this.source.getSize(Hc).y}get depth(){return this.source.getSize(Hc).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Th)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Li:e.x=e.x-Math.floor(e.x);break;case Ii:e.x=e.x<0?0:1;break;case Ao:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Li:e.y=e.y-Math.floor(e.y);break;case Ii:e.y=e.y<0?0:1;break;case Ao:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};sn.DEFAULT_IMAGE=null;sn.DEFAULT_MAPPING=Th;sn.DEFAULT_ANISOTROPY=1;var Rt=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,c=e.elements,l=c[0],h=c[4],u=c[8],f=c[1],d=c[5],m=c[9],x=c[2],g=c[6],p=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+x)<.1&&Math.abs(m+g)<.1&&Math.abs(l+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let M=(l+1)/2,_=(d+1)/2,P=(p+1)/2,S=(h+f)/4,A=(u+x)/4,R=(m+g)/4;return M>_&&M>P?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=S/n,r=A/n):_>P?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=S/s,r=R/s):P<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),n=A/r,s=R/r),this.set(n,s,r,t),this}let b=Math.sqrt((g-m)*(g-m)+(u-x)*(u-x)+(f-h)*(f-h));return Math.abs(b)<.001&&(b=1),this.x=(g-m)/b,this.y=(u-x)/b,this.z=(f-h)/b,this.w=Math.acos((l+d+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ze(this.x,e.x,t.x),this.y=Ze(this.y,e.y,t.y),this.z=Ze(this.z,e.z,t.z),this.w=Ze(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ze(this.x,e,t),this.y=Ze(this.y,e,t),this.z=Ze(this.z,e,t),this.w=Ze(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Po=class extends di{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Nn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Rt(0,0,e,t),this.scissorTest=!1,this.viewport=new Rt(0,0,e,t);let s={width:e,height:t,depth:n.depth},r=new sn(s);this.textures=[];let a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:Nn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Qs(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},qn=class extends Po{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},jr=class extends sn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=on,this.minFilter=on,this.wrapR=Ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Lo=class extends sn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=on,this.minFilter=on,this.wrapR=Ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var wn=class{constructor(e=new N(1/0,1/0,1/0),t=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(In.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(In.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=In.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,In):In.fromBufferAttribute(r,a),In.applyMatrix4(e.matrixWorld),this.expandByPoint(In);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ja.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ja.copy(n.boundingBox)),Ja.applyMatrix4(e.matrixWorld),this.union(Ja)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,In),In.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Dr),Ka.subVectors(this.max,Dr),Ls.subVectors(e.a,Dr),Ds.subVectors(e.b,Dr),Us.subVectors(e.c,Dr),Ei.subVectors(Ds,Ls),wi.subVectors(Us,Ds),qi.subVectors(Ls,Us);let t=[0,-Ei.z,Ei.y,0,-wi.z,wi.y,0,-qi.z,qi.y,Ei.z,0,-Ei.x,wi.z,0,-wi.x,qi.z,0,-qi.x,-Ei.y,Ei.x,0,-wi.y,wi.x,0,-qi.y,qi.x,0];return!Gc(t,Ls,Ds,Us,Ka)||(t=[1,0,0,0,1,0,0,0,1],!Gc(t,Ls,Ds,Us,Ka))?!1:(ja.crossVectors(Ei,wi),t=[ja.x,ja.y,ja.z],Gc(t,Ls,Ds,Us,Ka))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,In).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(In).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(si[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),si[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),si[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),si[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),si[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),si[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),si[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),si[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(si),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},si=[new N,new N,new N,new N,new N,new N,new N,new N],In=new N,Ja=new wn,Ls=new N,Ds=new N,Us=new N,Ei=new N,wi=new N,qi=new N,Dr=new N,Ka=new N,ja=new N,$i=new N;function Gc(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){$i.fromArray(i,r);let o=s.x*Math.abs($i.x)+s.y*Math.abs($i.y)+s.z*Math.abs($i.z),c=e.dot($i),l=t.dot($i),h=n.dot($i);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}var Jm=new wn,Ur=new N,Vc=new N,pi=class{constructor(e=new N,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Jm.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ur.subVectors(e,this.center);let t=Ur.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Ur,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Vc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ur.copy(e.center).add(Vc)),this.expandByPoint(Ur.copy(e.center).sub(Vc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},ri=new N,Wc=new N,Qa=new N,Ti=new N,Xc=new N,eo=new N,qc=new N,Qr=class{constructor(e=new N,t=new N(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ri)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ri.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ri.copy(this.origin).addScaledVector(this.direction,t),ri.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Wc.copy(e).add(t).multiplyScalar(.5),Qa.copy(t).sub(e).normalize(),Ti.copy(this.origin).sub(Wc);let r=e.distanceTo(t)*.5,a=-this.direction.dot(Qa),o=Ti.dot(this.direction),c=-Ti.dot(Qa),l=Ti.lengthSq(),h=Math.abs(1-a*a),u,f,d,m;if(h>0)if(u=a*c-o,f=a*o-c,m=r*h,u>=0)if(f>=-m)if(f<=m){let x=1/h;u*=x,f*=x,d=u*(u+a*f+2*o)+f*(a*u+f+2*c)+l}else f=r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*c)+l;else f<=-m?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l):f<=m?(u=0,f=Math.min(Math.max(-r,-c),r),d=f*(f+2*c)+l):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-c),r),d=-u*u+f*(f+2*c)+l);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),d=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Wc).addScaledVector(Qa,f),d}intersectSphere(e,t){ri.subVectors(e.center,this.origin);let n=ri.dot(this.direction),s=ri.dot(ri)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(e.min.x-f.x)*l,s=(e.max.x-f.x)*l):(n=(e.max.x-f.x)*l,s=(e.min.x-f.x)*l),h>=0?(r=(e.min.y-f.y)*h,a=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,a=(e.min.y-f.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-f.z)*u,c=(e.max.z-f.z)*u):(o=(e.max.z-f.z)*u,c=(e.min.z-f.z)*u),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,ri)!==null}intersectTriangle(e,t,n,s,r){Xc.subVectors(t,e),eo.subVectors(n,e),qc.crossVectors(Xc,eo);let a=this.direction.dot(qc),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ti.subVectors(this.origin,e);let c=o*this.direction.dot(eo.crossVectors(Ti,eo));if(c<0)return null;let l=o*this.direction.dot(Xc.cross(Ti));if(l<0||c+l>a)return null;let h=-o*Ti.dot(qc);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},dt=class i{constructor(e,t,n,s,r,a,o,c,l,h,u,f,d,m,x,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,h,u,f,d,m,x,g)}set(e,t,n,s,r,a,o,c,l,h,u,f,d,m,x,g){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=f,p[3]=d,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/Ns.setFromMatrixColumn(e,0).length(),r=1/Ns.setFromMatrixColumn(e,1).length(),a=1/Ns.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let f=a*h,d=a*u,m=o*h,x=o*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=d+m*l,t[5]=f-x*l,t[9]=-o*c,t[2]=x-f*l,t[6]=m+d*l,t[10]=a*c}else if(e.order==="YXZ"){let f=c*h,d=c*u,m=l*h,x=l*u;t[0]=f+x*o,t[4]=m*o-d,t[8]=a*l,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=d*o-m,t[6]=x+f*o,t[10]=a*c}else if(e.order==="ZXY"){let f=c*h,d=c*u,m=l*h,x=l*u;t[0]=f-x*o,t[4]=-a*u,t[8]=m+d*o,t[1]=d+m*o,t[5]=a*h,t[9]=x-f*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){let f=a*h,d=a*u,m=o*h,x=o*u;t[0]=c*h,t[4]=m*l-d,t[8]=f*l+x,t[1]=c*u,t[5]=x*l+f,t[9]=d*l-m,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){let f=a*c,d=a*l,m=o*c,x=o*l;t[0]=c*h,t[4]=x-f*u,t[8]=m*u+d,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=d*u+m,t[10]=f-x*u}else if(e.order==="XZY"){let f=a*c,d=a*l,m=o*c,x=o*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=f*u+x,t[5]=a*h,t[9]=d*u-m,t[2]=m*u-d,t[6]=o*h,t[10]=x*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Km,e,jm)}lookAt(e,t,n){let s=this.elements;return pn.subVectors(e,t),pn.lengthSq()===0&&(pn.z=1),pn.normalize(),Ai.crossVectors(n,pn),Ai.lengthSq()===0&&(Math.abs(n.z)===1?pn.x+=1e-4:pn.z+=1e-4,pn.normalize(),Ai.crossVectors(n,pn)),Ai.normalize(),to.crossVectors(pn,Ai),s[0]=Ai.x,s[4]=to.x,s[8]=pn.x,s[1]=Ai.y,s[5]=to.y,s[9]=pn.y,s[2]=Ai.z,s[6]=to.z,s[10]=pn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],d=n[13],m=n[2],x=n[6],g=n[10],p=n[14],b=n[3],M=n[7],_=n[11],P=n[15],S=s[0],A=s[4],R=s[8],y=s[12],v=s[1],C=s[5],L=s[9],O=s[13],z=s[2],G=s[6],X=s[10],te=s[14],q=s[3],he=s[7],pe=s[11],Ie=s[15];return r[0]=a*S+o*v+c*z+l*q,r[4]=a*A+o*C+c*G+l*he,r[8]=a*R+o*L+c*X+l*pe,r[12]=a*y+o*O+c*te+l*Ie,r[1]=h*S+u*v+f*z+d*q,r[5]=h*A+u*C+f*G+d*he,r[9]=h*R+u*L+f*X+d*pe,r[13]=h*y+u*O+f*te+d*Ie,r[2]=m*S+x*v+g*z+p*q,r[6]=m*A+x*C+g*G+p*he,r[10]=m*R+x*L+g*X+p*pe,r[14]=m*y+x*O+g*te+p*Ie,r[3]=b*S+M*v+_*z+P*q,r[7]=b*A+M*C+_*G+P*he,r[11]=b*R+M*L+_*X+P*pe,r[15]=b*y+M*O+_*te+P*Ie,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],u=e[6],f=e[10],d=e[14],m=e[3],x=e[7],g=e[11],p=e[15];return m*(+r*c*u-s*l*u-r*o*f+n*l*f+s*o*d-n*c*d)+x*(+t*c*d-t*l*f+r*a*f-s*a*d+s*l*h-r*c*h)+g*(+t*l*u-t*o*d-r*a*u+n*a*d+r*o*h-n*l*h)+p*(-s*o*h-t*c*u+t*o*f+s*a*u-n*a*f+n*c*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=e[9],f=e[10],d=e[11],m=e[12],x=e[13],g=e[14],p=e[15],b=u*g*l-x*f*l+x*c*d-o*g*d-u*c*p+o*f*p,M=m*f*l-h*g*l-m*c*d+a*g*d+h*c*p-a*f*p,_=h*x*l-m*u*l+m*o*d-a*x*d-h*o*p+a*u*p,P=m*u*c-h*x*c-m*o*f+a*x*f+h*o*g-a*u*g,S=t*b+n*M+s*_+r*P;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/S;return e[0]=b*A,e[1]=(x*f*r-u*g*r-x*s*d+n*g*d+u*s*p-n*f*p)*A,e[2]=(o*g*r-x*c*r+x*s*l-n*g*l-o*s*p+n*c*p)*A,e[3]=(u*c*r-o*f*r-u*s*l+n*f*l+o*s*d-n*c*d)*A,e[4]=M*A,e[5]=(h*g*r-m*f*r+m*s*d-t*g*d-h*s*p+t*f*p)*A,e[6]=(m*c*r-a*g*r-m*s*l+t*g*l+a*s*p-t*c*p)*A,e[7]=(a*f*r-h*c*r+h*s*l-t*f*l-a*s*d+t*c*d)*A,e[8]=_*A,e[9]=(m*u*r-h*x*r-m*n*d+t*x*d+h*n*p-t*u*p)*A,e[10]=(a*x*r-m*o*r+m*n*l-t*x*l-a*n*p+t*o*p)*A,e[11]=(h*o*r-a*u*r-h*n*l+t*u*l+a*n*d-t*o*d)*A,e[12]=P*A,e[13]=(h*x*s-m*u*s+m*n*f-t*x*f-h*n*g+t*u*g)*A,e[14]=(m*o*s-a*x*s-m*n*c+t*x*c+a*n*g-t*o*g)*A,e[15]=(a*u*s-h*o*s+h*n*c-t*u*c-a*n*f+t*o*f)*A,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,h=a+a,u=o+o,f=r*l,d=r*h,m=r*u,x=a*h,g=a*u,p=o*u,b=c*l,M=c*h,_=c*u,P=n.x,S=n.y,A=n.z;return s[0]=(1-(x+p))*P,s[1]=(d+_)*P,s[2]=(m-M)*P,s[3]=0,s[4]=(d-_)*S,s[5]=(1-(f+p))*S,s[6]=(g+b)*S,s[7]=0,s[8]=(m+M)*A,s[9]=(g-b)*A,s[10]=(1-(f+x))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=Ns.set(s[0],s[1],s[2]).length(),a=Ns.set(s[4],s[5],s[6]).length(),o=Ns.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Pn.copy(this);let l=1/r,h=1/a,u=1/o;return Pn.elements[0]*=l,Pn.elements[1]*=l,Pn.elements[2]*=l,Pn.elements[4]*=h,Pn.elements[5]*=h,Pn.elements[6]*=h,Pn.elements[8]*=u,Pn.elements[9]*=u,Pn.elements[10]*=u,t.setFromRotationMatrix(Pn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=Un,c=!1){let l=this.elements,h=2*r/(t-e),u=2*r/(n-s),f=(t+e)/(t-e),d=(n+s)/(n-s),m,x;if(c)m=r/(a-r),x=a*r/(a-r);else if(o===Un)m=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===Jr)m=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=Un,c=!1){let l=this.elements,h=2/(t-e),u=2/(n-s),f=-(t+e)/(t-e),d=-(n+s)/(n-s),m,x;if(c)m=1/(a-r),x=a/(a-r);else if(o===Un)m=-2/(a-r),x=-(a+r)/(a-r);else if(o===Jr)m=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=u,l[9]=0,l[13]=d,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Ns=new N,Pn=new dt,Km=new N(0,0,0),jm=new N(1,1,1),Ai=new N,to=new N,pn=new N,hd=new dt,ud=new fi,Fn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(Ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ze(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ze(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,d),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ze(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Ze(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return hd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(hd,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ud.setFromEuler(this),this.setFromQuaternion(ud,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Fn.DEFAULT_ORDER="XYZ";var ea=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Qm=0,dd=new N,Fs=new fi,ai=new dt,no=new N,Nr=new N,eg=new N,tg=new fi,fd=new N(1,0,0),pd=new N(0,1,0),md=new N(0,0,1),gd={type:"added"},ng={type:"removed"},Os={type:"childadded",child:null},$c={type:"childremoved",child:null},xt=class i extends di{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Qm++}),this.uuid=Xn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new N,t=new Fn,n=new fi,s=new N(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new dt},normalMatrix:{value:new We}}),this.matrix=new dt,this.matrixWorld=new dt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ea,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Fs.setFromAxisAngle(e,t),this.quaternion.multiply(Fs),this}rotateOnWorldAxis(e,t){return Fs.setFromAxisAngle(e,t),this.quaternion.premultiply(Fs),this}rotateX(e){return this.rotateOnAxis(fd,e)}rotateY(e){return this.rotateOnAxis(pd,e)}rotateZ(e){return this.rotateOnAxis(md,e)}translateOnAxis(e,t){return dd.copy(e).applyQuaternion(this.quaternion),this.position.add(dd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(fd,e)}translateY(e){return this.translateOnAxis(pd,e)}translateZ(e){return this.translateOnAxis(md,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ai.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?no.copy(e):no.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Nr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ai.lookAt(Nr,no,this.up):ai.lookAt(no,Nr,this.up),this.quaternion.setFromRotationMatrix(ai),s&&(ai.extractRotation(s.matrixWorld),Fs.setFromRotationMatrix(ai),this.quaternion.premultiply(Fs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(gd),Os.child=e,this.dispatchEvent(Os),Os.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ng),$c.child=e,this.dispatchEvent($c),$c.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ai.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ai.multiply(e.parent.matrixWorld)),e.applyMatrix4(ai),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(gd),Os.child=e,this.dispatchEvent(Os),Os.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Nr,e,eg),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Nr,tg,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){let o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),u=a(e.shapes),f=a(e.skeletons),d=a(e.animations),m=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),d.length>0&&(n.animations=d),m.length>0&&(n.nodes=m)}return n.object=s,n;function a(o){let c=[];for(let l in o){let h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};xt.DEFAULT_UP=new N(0,1,0);xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ln=new N,oi=new N,Yc=new N,li=new N,Bs=new N,ks=new N,xd=new N,Zc=new N,Jc=new N,Kc=new N,jc=new Rt,Qc=new Rt,eh=new Rt,ci=class i{constructor(e=new N,t=new N,n=new N){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Ln.subVectors(e,t),s.cross(Ln);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Ln.subVectors(s,t),oi.subVectors(n,t),Yc.subVectors(e,t);let a=Ln.dot(Ln),o=Ln.dot(oi),c=Ln.dot(Yc),l=oi.dot(oi),h=oi.dot(Yc),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;let f=1/u,d=(l*c-o*h)*f,m=(a*h-o*c)*f;return r.set(1-d-m,m,d)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,li)===null?!1:li.x>=0&&li.y>=0&&li.x+li.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,li)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,li.x),c.addScaledVector(a,li.y),c.addScaledVector(o,li.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return jc.setScalar(0),Qc.setScalar(0),eh.setScalar(0),jc.fromBufferAttribute(e,t),Qc.fromBufferAttribute(e,n),eh.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(jc,r.x),a.addScaledVector(Qc,r.y),a.addScaledVector(eh,r.z),a}static isFrontFacing(e,t,n,s){return Ln.subVectors(n,t),oi.subVectors(e,t),Ln.cross(oi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ln.subVectors(this.c,this.b),oi.subVectors(this.a,this.b),Ln.cross(oi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;Bs.subVectors(s,n),ks.subVectors(r,n),Zc.subVectors(e,n);let c=Bs.dot(Zc),l=ks.dot(Zc);if(c<=0&&l<=0)return t.copy(n);Jc.subVectors(e,s);let h=Bs.dot(Jc),u=ks.dot(Jc);if(h>=0&&u<=h)return t.copy(s);let f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return a=c/(c-h),t.copy(n).addScaledVector(Bs,a);Kc.subVectors(e,r);let d=Bs.dot(Kc),m=ks.dot(Kc);if(m>=0&&d<=m)return t.copy(r);let x=d*l-c*m;if(x<=0&&l>=0&&m<=0)return o=l/(l-m),t.copy(n).addScaledVector(ks,o);let g=h*m-d*u;if(g<=0&&u-h>=0&&d-m>=0)return xd.subVectors(r,s),o=(u-h)/(u-h+(d-m)),t.copy(s).addScaledVector(xd,o);let p=1/(g+x+f);return a=x*p,o=f*p,t.copy(n).addScaledVector(Bs,a).addScaledVector(ks,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Tf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ri={h:0,s:0,l:0},io={h:0,s:0,l:0};function th(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Ae=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ft){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=tt.workingColorSpace){return this.r=e,this.g=t,this.b=n,tt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=tt.workingColorSpace){if(e=Oh(e,1),t=Ze(t,0,1),n=Ze(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=th(a,r,e+1/3),this.g=th(a,r,e),this.b=th(a,r,e-1/3)}return tt.colorSpaceToWorking(this,s),this}setStyle(e,t=Ft){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ft){let n=Tf[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=hi(e.r),this.g=hi(e.g),this.b=hi(e.b),this}copyLinearToSRGB(e){return this.r=Ys(e.r),this.g=Ys(e.g),this.b=Ys(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ft){return tt.workingToColorSpace(jt.copy(this),e),Math.round(Ze(jt.r*255,0,255))*65536+Math.round(Ze(jt.g*255,0,255))*256+Math.round(Ze(jt.b*255,0,255))}getHexString(e=Ft){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.workingToColorSpace(jt.copy(this),t);let n=jt.r,s=jt.g,r=jt.b,a=Math.max(n,s,r),o=Math.min(n,s,r),c,l,h=(o+a)/2;if(o===a)c=0,l=0;else{let u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=tt.workingColorSpace){return tt.workingToColorSpace(jt.copy(this),t),e.r=jt.r,e.g=jt.g,e.b=jt.b,e}getStyle(e=Ft){tt.workingToColorSpace(jt.copy(this),e);let t=jt.r,n=jt.g,s=jt.b;return e!==Ft?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Ri),this.setHSL(Ri.h+e,Ri.s+t,Ri.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ri),e.getHSL(io);let n=Xr(Ri.h,io.h,t),s=Xr(Ri.s,io.s,t),r=Xr(Ri.l,io.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},jt=new Ae;Ae.NAMES=Tf;var ig=0,$n=class extends di{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ig++}),this.uuid=Xn(),this.name="",this.type="Material",this.blending=Ki,this.side=ui,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=wo,this.blendDst=To,this.blendEquation=Pi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ae(0,0,0),this.blendAlpha=0,this.depthFunc=ji,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ph,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ji,this.stencilZFail=Ji,this.stencilZPass=Ji,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ki&&(n.blending=this.blending),this.side!==ui&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==wo&&(n.blendSrc=this.blendSrc),this.blendDst!==To&&(n.blendDst=this.blendDst),this.blendEquation!==Pi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ji&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ph&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ji&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ji&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ji&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},ft=class extends $n{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.combine=wh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Nt=new N,so=new ue,sg=0,Dt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:sg++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Co,this.updateRanges=[],this.gpuType=zn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)so.fromBufferAttribute(this,t),so.applyMatrix3(e),this.setXY(t,so.x,so.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.applyMatrix3(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.applyMatrix4(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.applyNormalMatrix(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Nt.fromBufferAttribute(this,t),Nt.transformDirection(e),this.setXYZ(t,Nt.x,Nt.y,Nt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Dn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=at(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Dn(t,this.array)),t}setX(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Dn(t,this.array)),t}setY(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Dn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Dn(t,this.array)),t}setW(e,t){return this.normalized&&(t=at(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),n=at(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array),r=at(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Co&&(e.usage=this.usage),e}};var ta=class extends Dt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var na=class extends Dt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var De=class extends Dt{constructor(e,t,n){super(new Float32Array(e),t,n)}},rg=0,En=new dt,nh=new xt,zs=new N,mn=new wn,Fr=new wn,qt=new N,Qe=class i extends di{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:rg++}),this.uuid=Xn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Bh(e)?na:ta)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new We().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return En.makeRotationFromQuaternion(e),this.applyMatrix4(En),this}rotateX(e){return En.makeRotationX(e),this.applyMatrix4(En),this}rotateY(e){return En.makeRotationY(e),this.applyMatrix4(En),this}rotateZ(e){return En.makeRotationZ(e),this.applyMatrix4(En),this}translate(e,t,n){return En.makeTranslation(e,t,n),this.applyMatrix4(En),this}scale(e,t,n){return En.makeScale(e,t,n),this.applyMatrix4(En),this}lookAt(e){return nh.lookAt(e),nh.updateMatrix(),this.applyMatrix4(nh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(zs).negate(),this.translate(zs.x,zs.y,zs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new De(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new wn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];mn.setFromBufferAttribute(r),this.morphTargetsRelative?(qt.addVectors(this.boundingBox.min,mn.min),this.boundingBox.expandByPoint(qt),qt.addVectors(this.boundingBox.max,mn.max),this.boundingBox.expandByPoint(qt)):(this.boundingBox.expandByPoint(mn.min),this.boundingBox.expandByPoint(mn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new pi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(e){let n=this.boundingSphere.center;if(mn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];Fr.setFromBufferAttribute(o),this.morphTargetsRelative?(qt.addVectors(mn.min,Fr.min),mn.expandByPoint(qt),qt.addVectors(mn.max,Fr.max),mn.expandByPoint(qt)):(mn.expandByPoint(Fr.min),mn.expandByPoint(Fr.max))}mn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)qt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(qt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)qt.fromBufferAttribute(o,l),c&&(zs.fromBufferAttribute(e,l),qt.add(zs)),s=Math.max(s,n.distanceToSquared(qt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Dt(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],c=[];for(let R=0;R<n.count;R++)o[R]=new N,c[R]=new N;let l=new N,h=new N,u=new N,f=new ue,d=new ue,m=new ue,x=new N,g=new N;function p(R,y,v){l.fromBufferAttribute(n,R),h.fromBufferAttribute(n,y),u.fromBufferAttribute(n,v),f.fromBufferAttribute(r,R),d.fromBufferAttribute(r,y),m.fromBufferAttribute(r,v),h.sub(l),u.sub(l),d.sub(f),m.sub(f);let C=1/(d.x*m.y-m.x*d.y);isFinite(C)&&(x.copy(h).multiplyScalar(m.y).addScaledVector(u,-d.y).multiplyScalar(C),g.copy(u).multiplyScalar(d.x).addScaledVector(h,-m.x).multiplyScalar(C),o[R].add(x),o[y].add(x),o[v].add(x),c[R].add(g),c[y].add(g),c[v].add(g))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let R=0,y=b.length;R<y;++R){let v=b[R],C=v.start,L=v.count;for(let O=C,z=C+L;O<z;O+=3)p(e.getX(O+0),e.getX(O+1),e.getX(O+2))}let M=new N,_=new N,P=new N,S=new N;function A(R){P.fromBufferAttribute(s,R),S.copy(P);let y=o[R];M.copy(y),M.sub(P.multiplyScalar(P.dot(y))).normalize(),_.crossVectors(S,y);let C=_.dot(c[R])<0?-1:1;a.setXYZW(R,M.x,M.y,M.z,C)}for(let R=0,y=b.length;R<y;++R){let v=b[R],C=v.start,L=v.count;for(let O=C,z=C+L;O<z;O+=3)A(e.getX(O+0)),A(e.getX(O+1)),A(e.getX(O+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Dt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,d=n.count;f<d;f++)n.setXYZ(f,0,0,0);let s=new N,r=new N,a=new N,o=new N,c=new N,l=new N,h=new N,u=new N;if(e)for(let f=0,d=e.count;f<d;f+=3){let m=e.getX(f+0),x=e.getX(f+1),g=e.getX(f+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,g),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(n,m),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),o.add(h),c.add(h),l.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let f=0,d=t.count;f<d;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)qt.fromBufferAttribute(e,t),qt.normalize(),e.setXYZ(t,qt.x,qt.y,qt.z)}toNonIndexed(){function e(o,c){let l=o.array,h=o.itemSize,u=o.normalized,f=new l.constructor(c.length*h),d=0,m=0;for(let x=0,g=c.length;x<g;x++){o.isInterleavedBufferAttribute?d=c[x]*o.data.stride+o.offset:d=c[x]*h;for(let p=0;p<h;p++)f[m++]=l[d++]}return new Dt(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let c=s[o],l=e(c,n);t.setAttribute(o,l)}let r=this.morphAttributes;for(let o in r){let c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){let f=l[h],d=e(f,n);c.push(d)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){let d=l[u];h.push(d.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(t))}let r=e.morphAttributes;for(let l in r){let h=[],u=r[l];for(let f=0,d=u.length;f<d;f++)h.push(u[f].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let l=0,h=a.length;l<h;l++){let u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},yd=new dt,Yi=new Qr,ro=new pi,_d=new N,ao=new N,oo=new N,lo=new N,ih=new N,co=new N,vd=new N,ho=new N,Me=class extends xt{constructor(e=new Qe,t=new ft){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){co.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=o[c],u=r[c];h!==0&&(ih.fromBufferAttribute(u,e),a?co.addScaledVector(ih,h):co.addScaledVector(ih.sub(t),h))}t.add(co)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ro.copy(n.boundingSphere),ro.applyMatrix4(r),Yi.copy(e.ray).recast(e.near),!(ro.containsPoint(Yi.origin)===!1&&(Yi.intersectSphere(ro,_d)===null||Yi.origin.distanceToSquared(_d)>(e.far-e.near)**2))&&(yd.copy(r).invert(),Yi.copy(e.ray).applyMatrix4(yd),!(n.boundingBox!==null&&Yi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Yi)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=f.length;m<x;m++){let g=f[m],p=a[g.materialIndex],b=Math.max(g.start,d.start),M=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let _=b,P=M;_<P;_+=3){let S=o.getX(_),A=o.getX(_+1),R=o.getX(_+2);s=uo(this,p,e,n,l,h,u,S,A,R),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,d.start),x=Math.min(o.count,d.start+d.count);for(let g=m,p=x;g<p;g+=3){let b=o.getX(g),M=o.getX(g+1),_=o.getX(g+2);s=uo(this,a,e,n,l,h,u,b,M,_),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let m=0,x=f.length;m<x;m++){let g=f[m],p=a[g.materialIndex],b=Math.max(g.start,d.start),M=Math.min(c.count,Math.min(g.start+g.count,d.start+d.count));for(let _=b,P=M;_<P;_+=3){let S=_,A=_+1,R=_+2;s=uo(this,p,e,n,l,h,u,S,A,R),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,d.start),x=Math.min(c.count,d.start+d.count);for(let g=m,p=x;g<p;g+=3){let b=g,M=g+1,_=g+2;s=uo(this,a,e,n,l,h,u,b,M,_),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function ag(i,e,t,n,s,r,a,o){let c;if(e.side===zt?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===ui,o),c===null)return null;ho.copy(o),ho.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(ho);return l<t.near||l>t.far?null:{distance:l,point:ho.clone(),object:i}}function uo(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,ao),i.getVertexPosition(c,oo),i.getVertexPosition(l,lo);let h=ag(i,e,t,n,ao,oo,lo,vd);if(h){let u=new N;ci.getBarycoord(vd,ao,oo,lo,u),s&&(h.uv=ci.getInterpolatedAttribute(s,o,c,l,u,new ue)),r&&(h.uv1=ci.getInterpolatedAttribute(r,o,c,l,u,new ue)),a&&(h.normal=ci.getInterpolatedAttribute(a,o,c,l,u,new N),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let f={a:o,b:c,c:l,normal:new N,materialIndex:0};ci.getNormal(ao,oo,lo,f.normal),h.face=f,h.barycoord=u}return h}var yt=class i extends Qe{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],l=[],h=[],u=[],f=0,d=0;m("z","y","x",-1,-1,n,t,e,a,r,0),m("z","y","x",1,-1,n,t,-e,a,r,1),m("x","z","y",1,1,e,n,t,s,a,2),m("x","z","y",1,-1,e,n,-t,s,a,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new De(l,3)),this.setAttribute("normal",new De(h,3)),this.setAttribute("uv",new De(u,2));function m(x,g,p,b,M,_,P,S,A,R,y){let v=_/A,C=P/R,L=_/2,O=P/2,z=S/2,G=A+1,X=R+1,te=0,q=0,he=new N;for(let pe=0;pe<X;pe++){let Ie=pe*C-O;for(let Ke=0;Ke<G;Ke++){let mt=Ke*v-L;he[x]=mt*b,he[g]=Ie*M,he[p]=z,l.push(he.x,he.y,he.z),he[x]=0,he[g]=0,he[p]=S>0?1:-1,h.push(he.x,he.y,he.z),u.push(Ke/A),u.push(1-pe/R),te+=1}}for(let pe=0;pe<R;pe++)for(let Ie=0;Ie<A;Ie++){let Ke=f+Ie+G*pe,mt=f+Ie+G*(pe+1),bt=f+(Ie+1)+G*(pe+1),st=f+(Ie+1)+G*pe;c.push(Ke,mt,st),c.push(mt,bt,st),q+=6}o.addGroup(d,q,y),d+=q,f+=te}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function os(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function en(i){let e={};for(let t=0;t<i.length;t++){let n=os(i[t]);for(let s in n)e[s]=n[s]}return e}function og(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function kh(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}var Af={clone:os,merge:en},lg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,cg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,On=class extends $n{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=lg,this.fragmentShader=cg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=os(e.uniforms),this.uniformsGroups=og(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},ia=class extends xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new dt,this.projectionMatrix=new dt,this.projectionMatrixInverse=new dt,this.coordinateSystem=Un,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Ci=new N,bd=new ue,Md=new ue,Qt=class extends ia{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ks*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Wr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ks*2*Math.atan(Math.tan(Wr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ci.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ci.x,Ci.y).multiplyScalar(-e/Ci.z),Ci.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ci.x,Ci.y).multiplyScalar(-e/Ci.z)}getViewSize(e,t){return this.getViewBounds(e,bd,Md),t.subVectors(Md,bd)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Wr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Hs=-90,Gs=1,Do=class extends xt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Qt(Hs,Gs,e,t);s.layers=this.layers,this.add(s);let r=new Qt(Hs,Gs,e,t);r.layers=this.layers,this.add(r);let a=new Qt(Hs,Gs,e,t);a.layers=this.layers,this.add(a);let o=new Qt(Hs,Gs,e,t);o.layers=this.layers,this.add(o);let c=new Qt(Hs,Gs,e,t);c.layers=this.layers,this.add(c);let l=new Qt(Hs,Gs,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(let l of t)this.remove(l);if(e===Un)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Jr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,l,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,f,d),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},sa=class extends sn{constructor(e=[],t=ss,n,s,r,a,o,c,l,h){super(e,t,n,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Uo=class extends qn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new sa(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new yt(5,5,5),r=new On({name:"CubemapFromEquirect",uniforms:os(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:zt,blending:vi});r.uniforms.tEquirect.value=t;let a=new Me(s,r),o=t.minFilter;return t.minFilter===Fi&&(t.minFilter=Nn),new Do(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}},Je=class extends xt{constructor(){super(),this.isGroup=!0,this.type="Group"}},hg={type:"move"},er=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Je,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Je,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Je,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(let x of e.hand.values()){let g=t.getJointPose(x,n),p=this._getHandJoint(l,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),d=.02,m=.005;l.inputState.pinching&&f>d+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=d-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(hg)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Je;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var ra=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ae(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},aa=class extends xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Fn,this.environmentIntensity=1,this.environmentRotation=new Fn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},oa=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Co,this.updateRanges=[],this.version=0,this.uuid=Xn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Xn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Xn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},nn=new N,tr=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)nn.fromBufferAttribute(this,t),nn.applyMatrix4(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)nn.fromBufferAttribute(this,t),nn.applyNormalMatrix(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)nn.fromBufferAttribute(this,t),nn.transformDirection(e),this.setXYZ(t,nn.x,nn.y,nn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Dn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=at(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=at(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Dn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Dn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Dn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Dn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=at(t,this.array),n=at(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=at(t,this.array),n=at(n,this.array),s=at(s,this.array),r=at(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Dt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Yn=class extends $n{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Ae(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Vs,Or=new N,Ws=new N,Xs=new N,qs=new ue,Br=new ue,Rf=new dt,fo=new N,kr=new N,po=new N,Sd=new ue,sh=new ue,Ed=new ue,mi=class extends xt{constructor(e=new Yn){if(super(),this.isSprite=!0,this.type="Sprite",Vs===void 0){Vs=new Qe;let t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new oa(t,5);Vs.setIndex([0,1,2,0,2,3]),Vs.setAttribute("position",new tr(n,3,0,!1)),Vs.setAttribute("uv",new tr(n,2,3,!1))}this.geometry=Vs,this.material=e,this.center=new ue(.5,.5),this.count=1}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ws.setFromMatrixScale(this.matrixWorld),Rf.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Xs.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ws.multiplyScalar(-Xs.z);let n=this.material.rotation,s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));let a=this.center;mo(fo.set(-.5,-.5,0),Xs,a,Ws,s,r),mo(kr.set(.5,-.5,0),Xs,a,Ws,s,r),mo(po.set(.5,.5,0),Xs,a,Ws,s,r),Sd.set(0,0),sh.set(1,0),Ed.set(1,1);let o=e.ray.intersectTriangle(fo,kr,po,!1,Or);if(o===null&&(mo(kr.set(-.5,.5,0),Xs,a,Ws,s,r),sh.set(0,1),o=e.ray.intersectTriangle(fo,po,kr,!1,Or),o===null))return;let c=e.ray.origin.distanceTo(Or);c<e.near||c>e.far||t.push({distance:c,point:Or.clone(),uv:ci.getInterpolation(Or,fo,kr,po,Sd,sh,Ed,new ue),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}};function mo(i,e,t,n,s,r){qs.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Br.x=r*qs.x-s*qs.y,Br.y=s*qs.x+r*qs.y):Br.copy(qs),i.copy(e),i.x+=Br.x,i.y+=Br.y,i.applyMatrix4(Rf)}var No=class extends sn{constructor(e=null,t=1,n=1,s,r,a,o,c,l=on,h=on,u,f){super(null,a,o,c,l,h,s,r,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var nr=class extends Dt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},$s=new dt,wd=new dt,go=[],Td=new wn,ug=new dt,zr=new Me,Hr=new pi,gi=class extends Me{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new nr(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,ug)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new wn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,$s),Td.copy(e.boundingBox).applyMatrix4($s),this.boundingBox.union(Td)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new pi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,$s),Hr.copy(e.boundingSphere).applyMatrix4($s),this.boundingSphere.union(Hr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(zr.geometry=this.geometry,zr.material=this.material,zr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Hr.copy(this.boundingSphere),Hr.applyMatrix4(n),e.ray.intersectsSphere(Hr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,$s),wd.multiplyMatrices(n,$s),zr.matrixWorld=wd,zr.raycast(e,go);for(let a=0,o=go.length;a<o;a++){let c=go[a];c.instanceId=r,c.object=this,t.push(c)}go.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new nr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new No(new Float32Array(s*this.count),s,this.count,yl,zn));let r=this.morphTexture.source.data.data,a=0;for(let l=0;l<n.length;l++)a+=n[l];let o=this.geometry.morphTargetsRelative?1:1-a,c=s*e;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},rh=new N,dg=new N,fg=new We,Wn=class{constructor(e=new N(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=rh.subVectors(n,t).cross(dg.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(rh),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||fg.getNormalMatrix(e),s=this.coplanarPoint(rh).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Zi=new pi,pg=new ue(.5,.5),xo=new N,ir=class{constructor(e=new Wn,t=new Wn,n=new Wn,s=new Wn,r=new Wn,a=new Wn){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Un,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],u=r[5],f=r[6],d=r[7],m=r[8],x=r[9],g=r[10],p=r[11],b=r[12],M=r[13],_=r[14],P=r[15];if(s[0].setComponents(l-a,d-h,p-m,P-b).normalize(),s[1].setComponents(l+a,d+h,p+m,P+b).normalize(),s[2].setComponents(l+o,d+u,p+x,P+M).normalize(),s[3].setComponents(l-o,d-u,p-x,P-M).normalize(),n)s[4].setComponents(c,f,g,_).normalize(),s[5].setComponents(l-c,d-f,p-g,P-_).normalize();else if(s[4].setComponents(l-c,d-f,p-g,P-_).normalize(),t===Un)s[5].setComponents(l+c,d+f,p+g,P+_).normalize();else if(t===Jr)s[5].setComponents(c,f,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Zi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Zi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Zi)}intersectsSprite(e){Zi.center.set(0,0,0);let t=pg.distanceTo(e.center);return Zi.radius=.7071067811865476+t,Zi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Zi)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(xo.x=s.normal.x>0?e.max.x:e.min.x,xo.y=s.normal.y>0?e.max.y:e.min.y,xo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(xo)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var xi=class extends $n{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ae(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Fo=new N,Oo=new N,Ad=new dt,Gr=new Qr,yo=new pi,ah=new N,Rd=new N,Bo=class extends xt{constructor(e=new Qe,t=new xi){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Fo.fromBufferAttribute(t,s-1),Oo.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Fo.distanceTo(Oo);e.setAttribute("lineDistance",new De(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),yo.copy(n.boundingSphere),yo.applyMatrix4(s),yo.radius+=r,e.ray.intersectsSphere(yo)===!1)return;Ad.copy(s).invert(),Gr.copy(e.ray).applyMatrix4(Ad);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){let d=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let x=d,g=m-1;x<g;x+=l){let p=h.getX(x),b=h.getX(x+1),M=_o(this,e,Gr,c,p,b,x);M&&t.push(M)}if(this.isLineLoop){let x=h.getX(m-1),g=h.getX(d),p=_o(this,e,Gr,c,x,g,m-1);p&&t.push(p)}}else{let d=Math.max(0,a.start),m=Math.min(f.count,a.start+a.count);for(let x=d,g=m-1;x<g;x+=l){let p=_o(this,e,Gr,c,x,x+1,x);p&&t.push(p)}if(this.isLineLoop){let x=_o(this,e,Gr,c,m-1,d,m-1);x&&t.push(x)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function _o(i,e,t,n,s,r,a){let o=i.geometry.attributes.position;if(Fo.fromBufferAttribute(o,s),Oo.fromBufferAttribute(o,r),t.distanceSqToSegment(Fo,Oo,ah,Rd)>n)return;ah.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(ah);if(!(l<e.near||l>e.far))return{distance:l,point:Rd.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var Cd=new N,Id=new N,Di=class extends Bo{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Cd.fromBufferAttribute(t,s),Id.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Cd.distanceTo(Id);e.setAttribute("lineDistance",new De(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var yi=class extends sn{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},la=class extends sn{constructor(e,t,n=Oi,s,r,a,o=on,c=on,l,h=Js,u=1){if(h!==Js&&h!==fr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:e,height:t,depth:u};super(f,s,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Qs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},ca=class extends sn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var es=class i extends Qe{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],a=[],o=[],c=[],l=new N,h=new ue;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=t;u++,f+=3){let d=n+u/t*s;l.x=e*Math.cos(d),l.y=e*Math.sin(d),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[f]/e+1)/2,h.y=(a[f+1]/e+1)/2,c.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new De(a,3)),this.setAttribute("normal",new De(o,3)),this.setAttribute("uv",new De(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},ln=class i extends Qe{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],f=[],d=[],m=0,x=[],g=n/2,p=0;b(),a===!1&&(e>0&&M(!0),t>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new De(u,3)),this.setAttribute("normal",new De(f,3)),this.setAttribute("uv",new De(d,2));function b(){let _=new N,P=new N,S=0,A=(t-e)/n;for(let R=0;R<=r;R++){let y=[],v=R/r,C=v*(t-e)+e;for(let L=0;L<=s;L++){let O=L/s,z=O*c+o,G=Math.sin(z),X=Math.cos(z);P.x=C*G,P.y=-v*n+g,P.z=C*X,u.push(P.x,P.y,P.z),_.set(G,A,X).normalize(),f.push(_.x,_.y,_.z),d.push(O,1-v),y.push(m++)}x.push(y)}for(let R=0;R<s;R++)for(let y=0;y<r;y++){let v=x[y][R],C=x[y+1][R],L=x[y+1][R+1],O=x[y][R+1];(e>0||y!==0)&&(h.push(v,C,O),S+=3),(t>0||y!==r-1)&&(h.push(C,L,O),S+=3)}l.addGroup(p,S,0),p+=S}function M(_){let P=m,S=new ue,A=new N,R=0,y=_===!0?e:t,v=_===!0?1:-1;for(let L=1;L<=s;L++)u.push(0,g*v,0),f.push(0,v,0),d.push(.5,.5),m++;let C=m;for(let L=0;L<=s;L++){let z=L/s*c+o,G=Math.cos(z),X=Math.sin(z);A.x=y*X,A.y=g*v,A.z=y*G,u.push(A.x,A.y,A.z),f.push(0,v,0),S.x=G*.5+.5,S.y=X*.5*v+.5,d.push(S.x,S.y),m++}for(let L=0;L<s;L++){let O=P+L,z=C+L;_===!0?h.push(z,z+1,O):h.push(z+1,z,O),R+=3}l.addGroup(p,R,_===!0?1:2),p+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Zn=class i extends ln{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},ko=class i extends Qe{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],a=[];o(s),l(n),h(),this.setAttribute("position",new De(r,3)),this.setAttribute("normal",new De(r.slice(),3)),this.setAttribute("uv",new De(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(b){let M=new N,_=new N,P=new N;for(let S=0;S<t.length;S+=3)d(t[S+0],M),d(t[S+1],_),d(t[S+2],P),c(M,_,P,b)}function c(b,M,_,P){let S=P+1,A=[];for(let R=0;R<=S;R++){A[R]=[];let y=b.clone().lerp(_,R/S),v=M.clone().lerp(_,R/S),C=S-R;for(let L=0;L<=C;L++)L===0&&R===S?A[R][L]=y:A[R][L]=y.clone().lerp(v,L/C)}for(let R=0;R<S;R++)for(let y=0;y<2*(S-R)-1;y++){let v=Math.floor(y/2);y%2===0?(f(A[R][v+1]),f(A[R+1][v]),f(A[R][v])):(f(A[R][v+1]),f(A[R+1][v+1]),f(A[R+1][v]))}}function l(b){let M=new N;for(let _=0;_<r.length;_+=3)M.x=r[_+0],M.y=r[_+1],M.z=r[_+2],M.normalize().multiplyScalar(b),r[_+0]=M.x,r[_+1]=M.y,r[_+2]=M.z}function h(){let b=new N;for(let M=0;M<r.length;M+=3){b.x=r[M+0],b.y=r[M+1],b.z=r[M+2];let _=g(b)/2/Math.PI+.5,P=p(b)/Math.PI+.5;a.push(_,1-P)}m(),u()}function u(){for(let b=0;b<a.length;b+=6){let M=a[b+0],_=a[b+2],P=a[b+4],S=Math.max(M,_,P),A=Math.min(M,_,P);S>.9&&A<.1&&(M<.2&&(a[b+0]+=1),_<.2&&(a[b+2]+=1),P<.2&&(a[b+4]+=1))}}function f(b){r.push(b.x,b.y,b.z)}function d(b,M){let _=b*3;M.x=e[_+0],M.y=e[_+1],M.z=e[_+2]}function m(){let b=new N,M=new N,_=new N,P=new N,S=new ue,A=new ue,R=new ue;for(let y=0,v=0;y<r.length;y+=9,v+=6){b.set(r[y+0],r[y+1],r[y+2]),M.set(r[y+3],r[y+4],r[y+5]),_.set(r[y+6],r[y+7],r[y+8]),S.set(a[v+0],a[v+1]),A.set(a[v+2],a[v+3]),R.set(a[v+4],a[v+5]),P.copy(b).add(M).add(_).divideScalar(3);let C=g(P);x(S,v+0,b,C),x(A,v+2,M,C),x(R,v+4,_,C)}}function x(b,M,_,P){P<0&&b.x===1&&(a[M]=b.x-1),_.x===0&&_.z===0&&(a[M]=P/2/Math.PI+.5)}function g(b){return Math.atan2(b.z,-b.x)}function p(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}};var gn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),l=n[s]-a,l<0)o=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);let h=n[s],f=n[s+1]-h,d=(a-h)/f;return(s+d)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),c=t||(a.isVector2?new ue:new N);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new N,s=[],r=[],a=[],o=new N,c=new dt;for(let d=0;d<=e;d++){let m=d/e;s[d]=this.getTangentAt(m,new N)}r[0]=new N,a[0]=new N;let l=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();let m=Math.acos(Ze(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(c.makeRotationAxis(o,m))}a[d].crossVectors(s[d],r[d])}if(t===!0){let d=Math.acos(Ze(r[0].dot(r[e]),-1,1));d/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(d=-d);for(let m=1;m<=e;m++)r[m].applyMatrix4(c.makeRotationAxis(s[m],d*m)),a[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},sr=class extends gn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new ue){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,d=l-this.aY;c=f*h-d*u+this.aX,l=f*u+d*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},zo=class extends sr{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function zh(){let i=0,e=0,t=0,n=0;function s(r,a,o,c){i=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){s(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,u){let f=(a-r)/l-(o-r)/(l+h)+(o-a)/h,d=(o-a)/h-(c-a)/(h+u)+(c-o)/u;f*=h,d*=h,s(a,o,f,d)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var vo=new N,oh=new zh,lh=new zh,ch=new zh,Ho=class extends gn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new N){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=s[(o-1)%r]:(vo.subVectors(s[0],s[1]).add(s[0]),l=vo);let u=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(vo.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=vo),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,m=Math.pow(l.distanceToSquared(u),d),x=Math.pow(u.distanceToSquared(f),d),g=Math.pow(f.distanceToSquared(h),d);x<1e-4&&(x=1),m<1e-4&&(m=x),g<1e-4&&(g=x),oh.initNonuniformCatmullRom(l.x,u.x,f.x,h.x,m,x,g),lh.initNonuniformCatmullRom(l.y,u.y,f.y,h.y,m,x,g),ch.initNonuniformCatmullRom(l.z,u.z,f.z,h.z,m,x,g)}else this.curveType==="catmullrom"&&(oh.initCatmullRom(l.x,u.x,f.x,h.x,this.tension),lh.initCatmullRom(l.y,u.y,f.y,h.y,this.tension),ch.initCatmullRom(l.z,u.z,f.z,h.z,this.tension));return n.set(oh.calc(c),lh.calc(c),ch.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new N().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Pd(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,c=i*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*i+t}function mg(i,e){let t=1-i;return t*t*e}function gg(i,e){return 2*(1-i)*i*e}function xg(i,e){return i*i*e}function qr(i,e,t,n){return mg(i,e)+gg(i,t)+xg(i,n)}function yg(i,e){let t=1-i;return t*t*t*e}function _g(i,e){let t=1-i;return 3*t*t*i*e}function vg(i,e){return 3*(1-i)*i*i*e}function bg(i,e){return i*i*i*e}function $r(i,e,t,n,s){return yg(i,e)+_g(i,t)+vg(i,n)+bg(i,s)}var ha=class extends gn{constructor(e=new ue,t=new ue,n=new ue,s=new ue){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new ue){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set($r(e,s.x,r.x,a.x,o.x),$r(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Go=class extends gn{constructor(e=new N,t=new N,n=new N,s=new N){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new N){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set($r(e,s.x,r.x,a.x,o.x),$r(e,s.y,r.y,a.y,o.y),$r(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ua=class extends gn{constructor(e=new ue,t=new ue){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ue){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ue){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Vo=class extends gn{constructor(e=new N,t=new N){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new N){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new N){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},da=class extends gn{constructor(e=new ue,t=new ue,n=new ue){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ue){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(qr(e,s.x,r.x,a.x),qr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Wo=class extends gn{constructor(e=new N,t=new N,n=new N){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new N){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(qr(e,s.x,r.x,a.x),qr(e,s.y,r.y,a.y),qr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},fa=class extends gn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ue){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],l=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(Pd(o,c.x,l.x,h.x,u.x),Pd(o,c.y,l.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new ue().fromArray(s))}return this}},Ld=Object.freeze({__proto__:null,ArcCurve:zo,CatmullRomCurve3:Ho,CubicBezierCurve:ha,CubicBezierCurve3:Go,EllipseCurve:sr,LineCurve:ua,LineCurve3:Vo,QuadraticBezierCurve:da,QuadraticBezierCurve3:Wo,SplineCurve:fa}),Xo=class extends gn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ld[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Ld[s.type]().fromJSON(s))}return this}},pa=class extends Xo{constructor(e){super(),this.type="Path",this.currentPoint=new ue,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new ua(this.currentPoint.clone(),new ue(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new da(this.currentPoint.clone(),new ue(e,t),new ue(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){let o=new ha(this.currentPoint.clone(),new ue(e,t),new ue(n,s),new ue(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new fa(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){let o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,s,r,a,o,c),this}absellipse(e,t,n,s,r,a,o,c){let l=new sr(e,t,n,s,r,a,o,c);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},rr=class extends pa{constructor(e){super(e),this.uuid=Xn(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new pa().fromJSON(s))}return this}};function Mg(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Cf(i,0,s,t,!0),a=[];if(!r||r.next===r.prev)return a;let o,c,l;if(n&&(r=Ag(i,e,r,t)),i.length>80*t){o=1/0,c=1/0;let h=-1/0,u=-1/0;for(let f=t;f<s;f+=t){let d=i[f],m=i[f+1];d<o&&(o=d),m<c&&(c=m),d>h&&(h=d),m>u&&(u=m)}l=Math.max(h-o,u-c),l=l!==0?32767/l:0}return ma(r,a,t,o,c,l,0),a}function Cf(i,e,t,n,s){let r;if(s===Bg(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=Dd(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=Dd(a/n|0,i[a],i[a+1],r);return r&&ar(r,r.next)&&(xa(r),r=r.next),r}function ts(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(ar(t,t.next)||At(t.prev,t,t.next)===0)){if(xa(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function ma(i,e,t,n,s,r,a){if(!i)return;!a&&r&&Lg(i,n,s,r);let o=i;for(;i.prev!==i.next;){let c=i.prev,l=i.next;if(r?Eg(i,n,s,r):Sg(i)){e.push(c.i,i.i,l.i),xa(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=wg(ts(i),e),ma(i,e,t,n,s,r,2)):a===2&&Tg(i,e,t,n,s,r):ma(ts(i),e,t,n,s,r,1);break}}}function Sg(i){let e=i.prev,t=i,n=i.next;if(At(e,t,n)>=0)return!1;let s=e.x,r=t.x,a=n.x,o=e.y,c=t.y,l=n.y,h=Math.min(s,r,a),u=Math.min(o,c,l),f=Math.max(s,r,a),d=Math.max(o,c,l),m=n.next;for(;m!==e;){if(m.x>=h&&m.x<=f&&m.y>=u&&m.y<=d&&Vr(s,o,r,c,a,l,m.x,m.y)&&At(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Eg(i,e,t,n){let s=i.prev,r=i,a=i.next;if(At(s,r,a)>=0)return!1;let o=s.x,c=r.x,l=a.x,h=s.y,u=r.y,f=a.y,d=Math.min(o,c,l),m=Math.min(h,u,f),x=Math.max(o,c,l),g=Math.max(h,u,f),p=mh(d,m,e,t,n),b=mh(x,g,e,t,n),M=i.prevZ,_=i.nextZ;for(;M&&M.z>=p&&_&&_.z<=b;){if(M.x>=d&&M.x<=x&&M.y>=m&&M.y<=g&&M!==s&&M!==a&&Vr(o,h,c,u,l,f,M.x,M.y)&&At(M.prev,M,M.next)>=0||(M=M.prevZ,_.x>=d&&_.x<=x&&_.y>=m&&_.y<=g&&_!==s&&_!==a&&Vr(o,h,c,u,l,f,_.x,_.y)&&At(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;M&&M.z>=p;){if(M.x>=d&&M.x<=x&&M.y>=m&&M.y<=g&&M!==s&&M!==a&&Vr(o,h,c,u,l,f,M.x,M.y)&&At(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;_&&_.z<=b;){if(_.x>=d&&_.x<=x&&_.y>=m&&_.y<=g&&_!==s&&_!==a&&Vr(o,h,c,u,l,f,_.x,_.y)&&At(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function wg(i,e){let t=i;do{let n=t.prev,s=t.next.next;!ar(n,s)&&Pf(n,t,t.next,s)&&ga(n,s)&&ga(s,n)&&(e.push(n.i,t.i,s.i),xa(t),xa(t.next),t=i=s),t=t.next}while(t!==i);return ts(t)}function Tg(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Ng(a,o)){let c=Lf(a,o);a=ts(a,a.next),c=ts(c,c.next),ma(a,e,t,n,s,r,0),ma(c,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Ag(i,e,t,n){let s=[];for(let r=0,a=e.length;r<a;r++){let o=e[r]*n,c=r<a-1?e[r+1]*n:i.length,l=Cf(i,o,c,n,!1);l===l.next&&(l.steiner=!0),s.push(Ug(l))}s.sort(Rg);for(let r=0;r<s.length;r++)t=Cg(s[r],t);return t}function Rg(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function Cg(i,e){let t=Ig(i,e);if(!t)return e;let n=Lf(t,i);return ts(n,n.next),ts(t,t.next)}function Ig(i,e){let t=e,n=i.x,s=i.y,r=-1/0,a;if(ar(i,t))return t;do{if(ar(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;let o=a,c=a.x,l=a.y,h=1/0;t=a;do{if(n>=t.x&&t.x>=c&&n!==t.x&&If(s<l?n:r,s,c,l,s<l?r:n,s,t.x,t.y)){let u=Math.abs(s-t.y)/(n-t.x);ga(t,i)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&Pg(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function Pg(i,e){return At(i.prev,i,e.prev)<0&&At(e.next,i,i.next)<0}function Lg(i,e,t,n){let s=i;do s.z===0&&(s.z=mh(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Dg(s)}function Dg(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let l=0;l<t&&(o++,a=a.nextZ,!!a);l++);let c=t;for(;o>0||c>0&&a;)o!==0&&(c===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function mh(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Ug(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function If(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function Vr(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&If(i,e,t,n,s,r,a,o)}function Ng(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!Fg(i,e)&&(ga(i,e)&&ga(e,i)&&Og(i,e)&&(At(i.prev,i,e.prev)||At(i,e.prev,e))||ar(i,e)&&At(i.prev,i,i.next)>0&&At(e.prev,e,e.next)>0)}function At(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function ar(i,e){return i.x===e.x&&i.y===e.y}function Pf(i,e,t,n){let s=Mo(At(i,e,t)),r=Mo(At(i,e,n)),a=Mo(At(t,n,i)),o=Mo(At(t,n,e));return!!(s!==r&&a!==o||s===0&&bo(i,t,e)||r===0&&bo(i,n,e)||a===0&&bo(t,i,n)||o===0&&bo(t,e,n))}function bo(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Mo(i){return i>0?1:i<0?-1:0}function Fg(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Pf(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function ga(i,e){return At(i.prev,i,i.next)<0?At(i,e,i.next)>=0&&At(i,i.prev,e)>=0:At(i,e,i.prev)<0||At(i,i.next,e)<0}function Og(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Lf(i,e){let t=gh(i.i,i.x,i.y),n=gh(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Dd(i,e,t,n){let s=gh(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function xa(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function gh(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Bg(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var xh=class{static triangulate(e,t,n=2){return Mg(e,t,n)}},Zs=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Ud(e),Nd(n,e);let a=e.length;t.forEach(Ud);for(let c=0;c<t.length;c++)s.push(a),a+=t[c].length,Nd(n,t[c]);let o=xh.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}};function Ud(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Nd(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var Jn=class i extends ko{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var Ot=class i extends Qe{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,u=e/o,f=t/c,d=[],m=[],x=[],g=[];for(let p=0;p<h;p++){let b=p*f-a;for(let M=0;M<l;M++){let _=M*u-r;m.push(_,-b,0),x.push(0,0,1),g.push(M/o),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let b=0;b<o;b++){let M=b+l*p,_=b+l*(p+1),P=b+1+l*(p+1),S=b+1+l*p;d.push(M,_,S),d.push(_,P,S)}this.setIndex(d),this.setAttribute("position",new De(m,3)),this.setAttribute("normal",new De(x,3)),this.setAttribute("uv",new De(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},ns=class i extends Qe{constructor(e=.5,t=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],c=[],l=[],h=[],u=e,f=(t-e)/s,d=new N,m=new ue;for(let x=0;x<=s;x++){for(let g=0;g<=n;g++){let p=r+g/n*a;d.x=u*Math.cos(p),d.y=u*Math.sin(p),c.push(d.x,d.y,d.z),l.push(0,0,1),m.x=(d.x/t+1)/2,m.y=(d.y/t+1)/2,h.push(m.x,m.y)}u+=f}for(let x=0;x<s;x++){let g=x*(n+1);for(let p=0;p<n;p++){let b=p+g,M=b,_=b+n+1,P=b+n+2,S=b+1;o.push(M,_,S),o.push(_,P,S)}}this.setIndex(o),this.setAttribute("position",new De(c,3)),this.setAttribute("normal",new De(l,3)),this.setAttribute("uv",new De(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},ya=class i extends Qe{constructor(e=new rr([new ue(0,.5),new ue(-.5,-.5),new ue(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],a=[],o=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let h=0;h<e.length;h++)l(e[h]),this.addGroup(o,c,h),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new De(s,3)),this.setAttribute("normal",new De(r,3)),this.setAttribute("uv",new De(a,2));function l(h){let u=s.length/3,f=h.extractPoints(t),d=f.shape,m=f.holes;Zs.isClockWise(d)===!1&&(d=d.reverse());for(let g=0,p=m.length;g<p;g++){let b=m[g];Zs.isClockWise(b)===!0&&(m[g]=b.reverse())}let x=Zs.triangulateShape(d,m);for(let g=0,p=m.length;g<p;g++){let b=m[g];d=d.concat(b)}for(let g=0,p=d.length;g<p;g++){let b=d[g];s.push(b.x,b.y,0),r.push(0,0,1),a.push(b.x,b.y)}for(let g=0,p=x.length;g<p;g++){let b=x[g],M=b[0]+u,_=b[1]+u,P=b[2]+u;n.push(M,_,P),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return kg(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let a=t[e.shapes[s]];n.push(a)}return new i(n,e.curveSegments)}};function kg(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}var Bn=class i extends Qe{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),l=0,h=[],u=new N,f=new N,d=[],m=[],x=[],g=[];for(let p=0;p<=n;p++){let b=[],M=p/n,_=0;p===0&&a===0?_=.5/t:p===n&&c===Math.PI&&(_=-.5/t);for(let P=0;P<=t;P++){let S=P/t;u.x=-e*Math.cos(s+S*r)*Math.sin(a+M*o),u.y=e*Math.cos(a+M*o),u.z=e*Math.sin(s+S*r)*Math.sin(a+M*o),m.push(u.x,u.y,u.z),f.copy(u).normalize(),x.push(f.x,f.y,f.z),g.push(S+_,1-M),b.push(l++)}h.push(b)}for(let p=0;p<n;p++)for(let b=0;b<t;b++){let M=h[p][b+1],_=h[p][b],P=h[p+1][b],S=h[p+1][b+1];(p!==0||a>0)&&d.push(M,_,S),(p!==n-1||c<Math.PI)&&d.push(_,P,S)}this.setIndex(d),this.setAttribute("position",new De(m,3)),this.setAttribute("normal",new De(x,3)),this.setAttribute("uv",new De(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var _i=class i extends Qe{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let a=[],o=[],c=[],l=[],h=new N,u=new N,f=new N;for(let d=0;d<=n;d++)for(let m=0;m<=s;m++){let x=m/s*r,g=d/n*Math.PI*2;u.x=(e+t*Math.cos(g))*Math.cos(x),u.y=(e+t*Math.cos(g))*Math.sin(x),u.z=t*Math.sin(g),o.push(u.x,u.y,u.z),h.x=e*Math.cos(x),h.y=e*Math.sin(x),f.subVectors(u,h).normalize(),c.push(f.x,f.y,f.z),l.push(m/s),l.push(d/n)}for(let d=1;d<=n;d++)for(let m=1;m<=s;m++){let x=(s+1)*d+m-1,g=(s+1)*(d-1)+m-1,p=(s+1)*(d-1)+m,b=(s+1)*d+m;a.push(x,g,b),a.push(g,p,b)}this.setIndex(a),this.setAttribute("position",new De(o,3)),this.setAttribute("normal",new De(c,3)),this.setAttribute("uv",new De(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Ct=class extends $n{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ae(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Uh,this.normalScale=new ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Fn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},or=class extends Ct{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ue(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ze(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ae(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ae(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ae(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var qo=class extends $n{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=pf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},$o=class extends $n{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function So(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function zg(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var is=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Yo=class extends is{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:uh,endingEnd:uh}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case dh:r=e,o=2*t-n;break;case fh:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case dh:a=e,c=2*n-t;break;case fh:a=1,c=n+s[1]-s[0];break;default:a=e-1,c=t}let l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this._offsetPrev,u=this._offsetNext,f=this._weightPrev,d=this._weightNext,m=(n-t)/(s-t),x=m*m,g=x*m,p=-f*g+2*f*x-f*m,b=(1+f)*g+(-1.5-2*f)*x+(-.5+f)*m+1,M=(-1-d)*g+(1.5+d)*x+.5*m,_=d*g-d*x;for(let P=0;P!==o;++P)r[P]=p*a[h+P]+b*a[l+P]+M*a[c+P]+_*a[u+P];return r}},Zo=class extends is{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=(n-t)/(s-t),u=1-h;for(let f=0;f!==o;++f)r[f]=a[l+f]*u+a[c+f]*h;return r}},Jo=class extends is{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},xn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=So(t,this.TimeBufferType),this.values=So(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:So(e.times,Array),values:So(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Jo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Zo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Yo(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Yr:t=this.InterpolantFactoryMethodDiscrete;break;case Ro:t=this.InterpolantFactoryMethodLinear;break;case Eo:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Yr;case this.InterpolantFactoryMethodLinear:return Ro;case this.InterpolantFactoryMethodSmooth:return Eo}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(s!==void 0&&zg(s))for(let o=0,c=s.length;o!==c;++o){let l=s[o];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Eo,r=e.length-1,a=1;for(let o=1;o<r;++o){let c=!1,l=e[o],h=e[o+1];if(l!==h&&(o!==1||l!==e[0]))if(s)c=!0;else{let u=o*n,f=u-n,d=u+n;for(let m=0;m!==n;++m){let x=t[u+m];if(x!==t[f+m]||x!==t[d+m]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];let u=o*n,f=a*n;for(let d=0;d!==n;++d)t[f+d]=t[u+d]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)t[c+l]=t[o+l];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};xn.prototype.ValueTypeName="";xn.prototype.TimeBufferType=Float32Array;xn.prototype.ValueBufferType=Float32Array;xn.prototype.DefaultInterpolation=Ro;var Ui=class extends xn{constructor(e,t,n){super(e,t,n)}};Ui.prototype.ValueTypeName="bool";Ui.prototype.ValueBufferType=Array;Ui.prototype.DefaultInterpolation=Yr;Ui.prototype.InterpolantFactoryMethodLinear=void 0;Ui.prototype.InterpolantFactoryMethodSmooth=void 0;var Ko=class extends xn{constructor(e,t,n,s){super(e,t,n,s)}};Ko.prototype.ValueTypeName="color";var jo=class extends xn{constructor(e,t,n,s){super(e,t,n,s)}};jo.prototype.ValueTypeName="number";var Qo=class extends is{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-t)/(s-t),l=e*o;for(let h=l+o;l!==h;l+=4)fi.slerpFlat(r,0,a,l-o,a,l,c);return r}},_a=class extends xn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Qo(this.times,this.values,this.getValueSize(),e)}};_a.prototype.ValueTypeName="quaternion";_a.prototype.InterpolantFactoryMethodSmooth=void 0;var Ni=class extends xn{constructor(e,t,n){super(e,t,n)}};Ni.prototype.ValueTypeName="string";Ni.prototype.ValueBufferType=Array;Ni.prototype.DefaultInterpolation=Yr;Ni.prototype.InterpolantFactoryMethodLinear=void 0;Ni.prototype.InterpolantFactoryMethodSmooth=void 0;var el=class extends xn{constructor(e,t,n,s){super(e,t,n,s)}};el.prototype.ValueTypeName="vector";var tl=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,f=l.length;u<f;u+=2){let d=l[u],m=l[u+1];if(d.global&&(d.lastIndex=0),d.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Df=new tl,nl=class{constructor(e){this.manager=e!==void 0?e:Df,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};nl.DEFAULT_MATERIAL_NAME="__DEFAULT";var va=class extends xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ae(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},ba=class extends va{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ae(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},hh=new dt,Fd=new N,Od=new N,yh=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ue(512,512),this.mapType=kn,this.map=null,this.mapPass=null,this.matrix=new dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ir,this._frameExtents=new ue(1,1),this._viewportCount=1,this._viewports=[new Rt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Fd.setFromMatrixPosition(e.matrixWorld),t.position.copy(Fd),Od.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Od),t.updateMatrixWorld(),hh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(hh,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(hh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var Ma=class extends ia{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},_h=class extends yh{constructor(){super(new Ma(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},lr=class extends va{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.shadow=new _h}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var il=class extends Qt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var Hh="\\[\\]\\.:\\/",Hg=new RegExp("["+Hh+"]","g"),Gh="[^"+Hh+"]",Gg="[^"+Hh.replace("\\.","")+"]",Vg=/((?:WC+[\/:])*)/.source.replace("WC",Gh),Wg=/(WCOD+)?/.source.replace("WCOD",Gg),Xg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Gh),qg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Gh),$g=new RegExp("^"+Vg+Wg+Xg+qg+"$"),Yg=["material","materials","bones","map"],vh=class{constructor(e,t,n){let s=n||vt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},vt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Hg,"")}static parseTrackName(e){let t=$g.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Yg.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let c=n(o.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let a=e[s];if(a===void 0){let l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};vt.Composite=vh;vt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};vt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};vt.prototype.GetterByBindingType=[vt.prototype._getValue_direct,vt.prototype._getValue_array,vt.prototype._getValue_arrayElement,vt.prototype._getValue_toArray];vt.prototype.SetterByBindingTypeAndVersioning=[[vt.prototype._setValue_direct,vt.prototype._setValue_direct_setNeedsUpdate,vt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[vt.prototype._setValue_array,vt.prototype._setValue_array_setNeedsUpdate,vt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[vt.prototype._setValue_arrayElement,vt.prototype._setValue_arrayElement_setNeedsUpdate,vt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[vt.prototype._setValue_fromArray,vt.prototype._setValue_fromArray_setNeedsUpdate,vt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Rb=new Float32Array(1);function Vh(i,e,t,n){let s=Zg(n);switch(t){case Ph:return i*e;case yl:return i*e/s.components*s.byteLength;case _l:return i*e/s.components*s.byteLength;case Dh:return i*e*2/s.components*s.byteLength;case vl:return i*e*2/s.components*s.byteLength;case Lh:return i*e*3/s.components*s.byteLength;case Tn:return i*e*4/s.components*s.byteLength;case bl:return i*e*4/s.components*s.byteLength;case wa:case Ta:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Aa:case Ra:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Sl:case wl:return Math.max(i,16)*Math.max(e,8)/4;case Ml:case El:return Math.max(i,8)*Math.max(e,8)/2;case Tl:case Al:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Rl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Cl:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Il:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Pl:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Ll:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Dl:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ul:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Nl:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Fl:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ol:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Bl:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case kl:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case zl:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Hl:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Gl:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Vl:case Wl:case Xl:return Math.ceil(i/4)*Math.ceil(e/4)*16;case ql:case $l:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Yl:case Zl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Zg(i){switch(i){case kn:case Ah:return{byteLength:1,components:1};case hr:case Rh:case ur:return{byteLength:2,components:1};case gl:case xl:return{byteLength:2,components:4};case Oi:case ml:case zn:return{byteLength:4,components:1};case Ch:case Ih:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function ip(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function e0(i){let e=new WeakMap;function t(o,c){let l=o.array,h=o.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,h),o.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)d=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){let h=c.array,u=c.updateRanges;if(i.bindBuffer(l,o),u.length===0)i.bufferSubData(l,0,h);else{u.sort((d,m)=>d.start-m.start);let f=0;for(let d=1;d<u.length;d++){let m=u[f],x=u[d];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++f,u[f]=x)}u.length=f+1;for(let d=0,m=u.length;d<m;d++){let x=u[d];i.bufferSubData(l,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var t0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,n0=`#ifdef USE_ALPHAHASH
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
#endif`,i0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,s0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,r0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,a0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,o0=`#ifdef USE_AOMAP
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
#endif`,l0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,c0=`#ifdef USE_BATCHING
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
#endif`,h0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,u0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,d0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,f0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,p0=`#ifdef USE_IRIDESCENCE
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
#endif`,m0=`#ifdef USE_BUMPMAP
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
#endif`,g0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,x0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,y0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,_0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,v0=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,b0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,M0=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,S0=`#if defined( USE_COLOR_ALPHA )
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
#endif`,E0=`#define PI 3.141592653589793
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
} // validated`,w0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,T0=`vec3 transformedNormal = objectNormal;
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
#endif`,A0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,R0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,C0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,I0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,P0="gl_FragColor = linearToOutputTexel( gl_FragColor );",L0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,D0=`#ifdef USE_ENVMAP
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
#endif`,U0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,N0=`#ifdef USE_ENVMAP
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
#endif`,F0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,O0=`#ifdef USE_ENVMAP
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
#endif`,B0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,k0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,z0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,H0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,G0=`#ifdef USE_GRADIENTMAP
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
}`,V0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,W0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,X0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,q0=`uniform bool receiveShadow;
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
#endif`,$0=`#ifdef USE_ENVMAP
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
#endif`,Y0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Z0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,J0=`BlinnPhongMaterial material;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,j0=`PhysicalMaterial material;
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
#endif`,Q0=`struct PhysicalMaterial {
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
}`,ex=`
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
#endif`,tx=`#if defined( RE_IndirectDiffuse )
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
#endif`,nx=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ix=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,sx=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,rx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ax=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ox=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,lx=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,cx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,hx=`#if defined( USE_POINTS_UV )
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
#endif`,ux=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,dx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,fx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,px=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,mx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,gx=`#ifdef USE_MORPHTARGETS
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
#endif`,xx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,yx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,_x=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,vx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bx=`#ifndef FLAT_SHADED
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
#endif`,Sx=`#ifdef USE_NORMALMAP
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
#endif`,Ex=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,wx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Tx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Ax=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Rx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Cx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Ix=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Px=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Lx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Dx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ux=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Nx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Fx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ox=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Bx=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,kx=`float getShadowMask() {
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
}`,zx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Hx=`#ifdef USE_SKINNING
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
#endif`,Gx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Vx=`#ifdef USE_SKINNING
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
#endif`,Wx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Xx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,qx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,$x=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Yx=`#ifdef USE_TRANSMISSION
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
#endif`,Zx=`#ifdef USE_TRANSMISSION
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
#endif`,Jx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Qx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,ey=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ty=`uniform sampler2D t2D;
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
}`,ny=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,iy=`#ifdef ENVMAP_TYPE_CUBE
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
}`,sy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ry=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ay=`#include <common>
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
}`,oy=`#if DEPTH_PACKING == 3200
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
}`,ly=`#define DISTANCE
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
}`,cy=`#define DISTANCE
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
}`,hy=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,uy=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dy=`uniform float scale;
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
}`,fy=`uniform vec3 diffuse;
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
}`,py=`#include <common>
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
}`,my=`uniform vec3 diffuse;
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
}`,gy=`#define LAMBERT
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
}`,xy=`#define LAMBERT
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
}`,yy=`#define MATCAP
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
}`,_y=`#define MATCAP
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
}`,vy=`#define NORMAL
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
}`,by=`#define NORMAL
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
}`,Sy=`#define PHONG
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
}`,Ey=`#define STANDARD
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
}`,wy=`#define STANDARD
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
}`,Ty=`#define TOON
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
}`,Ay=`#define TOON
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
}`,Ry=`uniform float size;
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
}`,Cy=`uniform vec3 diffuse;
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
}`,Iy=`#include <common>
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
}`,Py=`uniform vec3 color;
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
}`,Ly=`uniform float rotation;
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
}`,Dy=`uniform vec3 diffuse;
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
}`,$e={alphahash_fragment:t0,alphahash_pars_fragment:n0,alphamap_fragment:i0,alphamap_pars_fragment:s0,alphatest_fragment:r0,alphatest_pars_fragment:a0,aomap_fragment:o0,aomap_pars_fragment:l0,batching_pars_vertex:c0,batching_vertex:h0,begin_vertex:u0,beginnormal_vertex:d0,bsdfs:f0,iridescence_fragment:p0,bumpmap_pars_fragment:m0,clipping_planes_fragment:g0,clipping_planes_pars_fragment:x0,clipping_planes_pars_vertex:y0,clipping_planes_vertex:_0,color_fragment:v0,color_pars_fragment:b0,color_pars_vertex:M0,color_vertex:S0,common:E0,cube_uv_reflection_fragment:w0,defaultnormal_vertex:T0,displacementmap_pars_vertex:A0,displacementmap_vertex:R0,emissivemap_fragment:C0,emissivemap_pars_fragment:I0,colorspace_fragment:P0,colorspace_pars_fragment:L0,envmap_fragment:D0,envmap_common_pars_fragment:U0,envmap_pars_fragment:N0,envmap_pars_vertex:F0,envmap_physical_pars_fragment:$0,envmap_vertex:O0,fog_vertex:B0,fog_pars_vertex:k0,fog_fragment:z0,fog_pars_fragment:H0,gradientmap_pars_fragment:G0,lightmap_pars_fragment:V0,lights_lambert_fragment:W0,lights_lambert_pars_fragment:X0,lights_pars_begin:q0,lights_toon_fragment:Y0,lights_toon_pars_fragment:Z0,lights_phong_fragment:J0,lights_phong_pars_fragment:K0,lights_physical_fragment:j0,lights_physical_pars_fragment:Q0,lights_fragment_begin:ex,lights_fragment_maps:tx,lights_fragment_end:nx,logdepthbuf_fragment:ix,logdepthbuf_pars_fragment:sx,logdepthbuf_pars_vertex:rx,logdepthbuf_vertex:ax,map_fragment:ox,map_pars_fragment:lx,map_particle_fragment:cx,map_particle_pars_fragment:hx,metalnessmap_fragment:ux,metalnessmap_pars_fragment:dx,morphinstance_vertex:fx,morphcolor_vertex:px,morphnormal_vertex:mx,morphtarget_pars_vertex:gx,morphtarget_vertex:xx,normal_fragment_begin:yx,normal_fragment_maps:_x,normal_pars_fragment:vx,normal_pars_vertex:bx,normal_vertex:Mx,normalmap_pars_fragment:Sx,clearcoat_normal_fragment_begin:Ex,clearcoat_normal_fragment_maps:wx,clearcoat_pars_fragment:Tx,iridescence_pars_fragment:Ax,opaque_fragment:Rx,packing:Cx,premultiplied_alpha_fragment:Ix,project_vertex:Px,dithering_fragment:Lx,dithering_pars_fragment:Dx,roughnessmap_fragment:Ux,roughnessmap_pars_fragment:Nx,shadowmap_pars_fragment:Fx,shadowmap_pars_vertex:Ox,shadowmap_vertex:Bx,shadowmask_pars_fragment:kx,skinbase_vertex:zx,skinning_pars_vertex:Hx,skinning_vertex:Gx,skinnormal_vertex:Vx,specularmap_fragment:Wx,specularmap_pars_fragment:Xx,tonemapping_fragment:qx,tonemapping_pars_fragment:$x,transmission_fragment:Yx,transmission_pars_fragment:Zx,uv_pars_fragment:Jx,uv_pars_vertex:Kx,uv_vertex:jx,worldpos_vertex:Qx,background_vert:ey,background_frag:ty,backgroundCube_vert:ny,backgroundCube_frag:iy,cube_vert:sy,cube_frag:ry,depth_vert:ay,depth_frag:oy,distanceRGBA_vert:ly,distanceRGBA_frag:cy,equirect_vert:hy,equirect_frag:uy,linedashed_vert:dy,linedashed_frag:fy,meshbasic_vert:py,meshbasic_frag:my,meshlambert_vert:gy,meshlambert_frag:xy,meshmatcap_vert:yy,meshmatcap_frag:_y,meshnormal_vert:vy,meshnormal_frag:by,meshphong_vert:My,meshphong_frag:Sy,meshphysical_vert:Ey,meshphysical_frag:wy,meshtoon_vert:Ty,meshtoon_frag:Ay,points_vert:Ry,points_frag:Cy,shadow_vert:Iy,shadow_frag:Py,sprite_vert:Ly,sprite_frag:Dy},de={common:{diffuse:{value:new Ae(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ae(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ae(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new Ae(16777215)},opacity:{value:1},center:{value:new ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},jn={basic:{uniforms:en([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:$e.meshbasic_vert,fragmentShader:$e.meshbasic_frag},lambert:{uniforms:en([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new Ae(0)}}]),vertexShader:$e.meshlambert_vert,fragmentShader:$e.meshlambert_frag},phong:{uniforms:en([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new Ae(0)},specular:{value:new Ae(1118481)},shininess:{value:30}}]),vertexShader:$e.meshphong_vert,fragmentShader:$e.meshphong_frag},standard:{uniforms:en([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new Ae(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag},toon:{uniforms:en([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new Ae(0)}}]),vertexShader:$e.meshtoon_vert,fragmentShader:$e.meshtoon_frag},matcap:{uniforms:en([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:$e.meshmatcap_vert,fragmentShader:$e.meshmatcap_frag},points:{uniforms:en([de.points,de.fog]),vertexShader:$e.points_vert,fragmentShader:$e.points_frag},dashed:{uniforms:en([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$e.linedashed_vert,fragmentShader:$e.linedashed_frag},depth:{uniforms:en([de.common,de.displacementmap]),vertexShader:$e.depth_vert,fragmentShader:$e.depth_frag},normal:{uniforms:en([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:$e.meshnormal_vert,fragmentShader:$e.meshnormal_frag},sprite:{uniforms:en([de.sprite,de.fog]),vertexShader:$e.sprite_vert,fragmentShader:$e.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$e.background_vert,fragmentShader:$e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:$e.backgroundCube_vert,fragmentShader:$e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$e.cube_vert,fragmentShader:$e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$e.equirect_vert,fragmentShader:$e.equirect_frag},distanceRGBA:{uniforms:en([de.common,de.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$e.distanceRGBA_vert,fragmentShader:$e.distanceRGBA_frag},shadow:{uniforms:en([de.lights,de.fog,{color:{value:new Ae(0)},opacity:{value:1}}]),vertexShader:$e.shadow_vert,fragmentShader:$e.shadow_frag}};jn.physical={uniforms:en([jn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new Ae(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new Ae(0)},specularColor:{value:new Ae(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag};var Jl={r:0,b:0,g:0},ls=new Fn,Uy=new dt;function Ny(i,e,t,n,s,r,a){let o=new Ae(0),c=r===!0?0:1,l,h,u=null,f=0,d=null;function m(M){let _=M.isScene===!0?M.background:null;return _&&_.isTexture&&(_=(M.backgroundBlurriness>0?t:e).get(_)),_}function x(M){let _=!1,P=m(M);P===null?p(o,c):P&&P.isColor&&(p(P,1),_=!0);let S=i.xr.getEnvironmentBlendMode();S==="additive"?n.buffers.color.setClear(0,0,0,1,a):S==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(M,_){let P=m(_);P&&(P.isCubeTexture||P.mapping===Sa)?(h===void 0&&(h=new Me(new yt(1,1,1),new On({name:"BackgroundCubeMaterial",uniforms:os(jn.backgroundCube.uniforms),vertexShader:jn.backgroundCube.vertexShader,fragmentShader:jn.backgroundCube.fragmentShader,side:zt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(S,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ls.copy(_.backgroundRotation),ls.x*=-1,ls.y*=-1,ls.z*=-1,P.isCubeTexture&&P.isRenderTargetTexture===!1&&(ls.y*=-1,ls.z*=-1),h.material.uniforms.envMap.value=P,h.material.uniforms.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Uy.makeRotationFromEuler(ls)),h.material.toneMapped=tt.getTransfer(P.colorSpace)!==ot,(u!==P||f!==P.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,u=P,f=P.version,d=i.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):P&&P.isTexture&&(l===void 0&&(l=new Me(new Ot(2,2),new On({name:"BackgroundMaterial",uniforms:os(jn.background.uniforms),vertexShader:jn.background.vertexShader,fragmentShader:jn.background.fragmentShader,side:ui,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=P,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=tt.getTransfer(P.colorSpace)!==ot,P.matrixAutoUpdate===!0&&P.updateMatrix(),l.material.uniforms.uvTransform.value.copy(P.matrix),(u!==P||f!==P.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,u=P,f=P.version,d=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function p(M,_){M.getRGB(Jl,kh(i)),n.buffers.color.setClear(Jl.r,Jl.g,Jl.b,_,a)}function b(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,_=1){o.set(M),c=_,p(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(M){c=M,p(o,c)},render:x,addToRenderList:g,dispose:b}}function Fy(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null),r=s,a=!1;function o(v,C,L,O,z){let G=!1,X=u(O,L,C);r!==X&&(r=X,l(r.object)),G=d(v,O,L,z),G&&m(v,O,L,z),z!==null&&e.update(z,i.ELEMENT_ARRAY_BUFFER),(G||a)&&(a=!1,_(v,C,L,O),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function c(){return i.createVertexArray()}function l(v){return i.bindVertexArray(v)}function h(v){return i.deleteVertexArray(v)}function u(v,C,L){let O=L.wireframe===!0,z=n[v.id];z===void 0&&(z={},n[v.id]=z);let G=z[C.id];G===void 0&&(G={},z[C.id]=G);let X=G[O];return X===void 0&&(X=f(c()),G[O]=X),X}function f(v){let C=[],L=[],O=[];for(let z=0;z<t;z++)C[z]=0,L[z]=0,O[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:L,attributeDivisors:O,object:v,attributes:{},index:null}}function d(v,C,L,O){let z=r.attributes,G=C.attributes,X=0,te=L.getAttributes();for(let q in te)if(te[q].location>=0){let pe=z[q],Ie=G[q];if(Ie===void 0&&(q==="instanceMatrix"&&v.instanceMatrix&&(Ie=v.instanceMatrix),q==="instanceColor"&&v.instanceColor&&(Ie=v.instanceColor)),pe===void 0||pe.attribute!==Ie||Ie&&pe.data!==Ie.data)return!0;X++}return r.attributesNum!==X||r.index!==O}function m(v,C,L,O){let z={},G=C.attributes,X=0,te=L.getAttributes();for(let q in te)if(te[q].location>=0){let pe=G[q];pe===void 0&&(q==="instanceMatrix"&&v.instanceMatrix&&(pe=v.instanceMatrix),q==="instanceColor"&&v.instanceColor&&(pe=v.instanceColor));let Ie={};Ie.attribute=pe,pe&&pe.data&&(Ie.data=pe.data),z[q]=Ie,X++}r.attributes=z,r.attributesNum=X,r.index=O}function x(){let v=r.newAttributes;for(let C=0,L=v.length;C<L;C++)v[C]=0}function g(v){p(v,0)}function p(v,C){let L=r.newAttributes,O=r.enabledAttributes,z=r.attributeDivisors;L[v]=1,O[v]===0&&(i.enableVertexAttribArray(v),O[v]=1),z[v]!==C&&(i.vertexAttribDivisor(v,C),z[v]=C)}function b(){let v=r.newAttributes,C=r.enabledAttributes;for(let L=0,O=C.length;L<O;L++)C[L]!==v[L]&&(i.disableVertexAttribArray(L),C[L]=0)}function M(v,C,L,O,z,G,X){X===!0?i.vertexAttribIPointer(v,C,L,z,G):i.vertexAttribPointer(v,C,L,O,z,G)}function _(v,C,L,O){x();let z=O.attributes,G=L.getAttributes(),X=C.defaultAttributeValues;for(let te in G){let q=G[te];if(q.location>=0){let he=z[te];if(he===void 0&&(te==="instanceMatrix"&&v.instanceMatrix&&(he=v.instanceMatrix),te==="instanceColor"&&v.instanceColor&&(he=v.instanceColor)),he!==void 0){let pe=he.normalized,Ie=he.itemSize,Ke=e.get(he);if(Ke===void 0)continue;let mt=Ke.buffer,bt=Ke.type,st=Ke.bytesPerElement,K=bt===i.INT||bt===i.UNSIGNED_INT||he.gpuType===ml;if(he.isInterleavedBufferAttribute){let ee=he.data,ve=ee.stride,ze=he.offset;if(ee.isInstancedInterleavedBuffer){for(let Le=0;Le<q.locationSize;Le++)p(q.location+Le,ee.meshPerAttribute);v.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let Le=0;Le<q.locationSize;Le++)g(q.location+Le);i.bindBuffer(i.ARRAY_BUFFER,mt);for(let Le=0;Le<q.locationSize;Le++)M(q.location+Le,Ie/q.locationSize,bt,pe,ve*st,(ze+Ie/q.locationSize*Le)*st,K)}else{if(he.isInstancedBufferAttribute){for(let ee=0;ee<q.locationSize;ee++)p(q.location+ee,he.meshPerAttribute);v.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let ee=0;ee<q.locationSize;ee++)g(q.location+ee);i.bindBuffer(i.ARRAY_BUFFER,mt);for(let ee=0;ee<q.locationSize;ee++)M(q.location+ee,Ie/q.locationSize,bt,pe,Ie*st,Ie/q.locationSize*ee*st,K)}}else if(X!==void 0){let pe=X[te];if(pe!==void 0)switch(pe.length){case 2:i.vertexAttrib2fv(q.location,pe);break;case 3:i.vertexAttrib3fv(q.location,pe);break;case 4:i.vertexAttrib4fv(q.location,pe);break;default:i.vertexAttrib1fv(q.location,pe)}}}}b()}function P(){R();for(let v in n){let C=n[v];for(let L in C){let O=C[L];for(let z in O)h(O[z].object),delete O[z];delete C[L]}delete n[v]}}function S(v){if(n[v.id]===void 0)return;let C=n[v.id];for(let L in C){let O=C[L];for(let z in O)h(O[z].object),delete O[z];delete C[L]}delete n[v.id]}function A(v){for(let C in n){let L=n[C];if(L[v.id]===void 0)continue;let O=L[v.id];for(let z in O)h(O[z].object),delete O[z];delete L[v.id]}}function R(){y(),a=!0,r!==s&&(r=s,l(r.object))}function y(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:R,resetDefaultState:y,dispose:P,releaseStatesOfGeometry:S,releaseStatesOfProgram:A,initAttributes:x,enableAttribute:g,disableUnusedAttributes:b}}function Oy(i,e,t){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),t.update(h,n,1)}function a(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),t.update(h,n,u))}function o(l,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let d=0;for(let m=0;m<u;m++)d+=h[m];t.update(d,n,1)}function c(l,h,u,f){if(u===0)return;let d=e.get("WEBGL_multi_draw");if(d===null)for(let m=0;m<l.length;m++)a(l[m],h[m],f[m]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,f,0,u);let m=0;for(let x=0;x<u;x++)m+=h[x]*f[x];t.update(m,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function By(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let A=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==Tn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){let R=A===ur&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==kn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==zn&&!R)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),P=m>0,S=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:b,maxVaryings:M,maxFragmentUniforms:_,vertexTextures:P,maxSamples:S}}function ky(i){let e=this,t=null,n=0,s=!1,r=!1,a=new Wn,o=new We,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){let d=u.length!==0||f||n!==0||s;return s=f,n=u.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,d){let m=u.clippingPlanes,x=u.clipIntersection,g=u.clipShadows,p=i.get(u);if(!s||m===null||m.length===0||r&&!g)r?h(null):l();else{let b=r?0:n,M=b*4,_=p.clippingState||null;c.value=_,_=h(m,f,M,d);for(let P=0;P!==M;++P)_[P]=t[P];p.clippingState=_,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=b}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,d,m){let x=u!==null?u.length:0,g=null;if(x!==0){if(g=c.value,m!==!0||g===null){let p=d+x*4,b=f.matrixWorldInverse;o.getNormalMatrix(b),(g===null||g.length<p)&&(g=new Float32Array(p));for(let M=0,_=d;M!==x;++M,_+=4)a.copy(u[M]).applyMatrix4(b,o),a.normal.toArray(g,_),g[_+3]=a.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}function zy(i){let e=new WeakMap;function t(a,o){return o===cr?a.mapping=ss:o===fl&&(a.mapping=rs),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===cr||o===fl)if(e.has(a)){let c=e.get(a).texture;return t(c,a.mapping)}else{let c=a.image;if(c&&c.height>0){let l=new Uo(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",s),t(l.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var mr=4,Uf=[.125,.215,.35,.446,.526,.582],us=20,Wh=new Ma,Nf=new Ae,Xh=null,qh=0,$h=0,Yh=!1,hs=(1+Math.sqrt(5))/2,pr=1/hs,Ff=[new N(-hs,pr,0),new N(hs,pr,0),new N(-pr,0,hs),new N(pr,0,hs),new N(0,hs,-pr),new N(0,hs,pr),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)],Hy=new N,Ql=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=Hy}=r;Xh=this._renderer.getRenderTarget(),qh=this._renderer.getActiveCubeFace(),$h=this._renderer.getActiveMipmapLevel(),Yh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=kf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Xh,qh,$h),this._renderer.xr.enabled=Yh,e.scissorTest=!1,Kl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ss||e.mapping===rs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Xh=this._renderer.getRenderTarget(),qh=this._renderer.getActiveCubeFace(),$h=this._renderer.getActiveMipmapLevel(),Yh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Nn,minFilter:Nn,generateMipmaps:!1,type:ur,format:Tn,colorSpace:Qi,depthBuffer:!1},s=Of(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Of(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Gy(r)),this._blurMaterial=Vy(r,e,t)}return s}_compileMaterial(e){let t=new Me(this._lodPlanes[0],e);this._renderer.compile(t,Wh)}_sceneToCubeUV(e,t,n,s,r){let c=new Qt(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,d=u.toneMapping;u.getClearColor(Nf),u.toneMapping=bi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let x=new ft({name:"PMREM.Background",side:zt,depthWrite:!1,depthTest:!1}),g=new Me(new yt,x),p=!1,b=e.background;b?b.isColor&&(x.color.copy(b),e.background=null,p=!0):(x.color.copy(Nf),p=!0);for(let M=0;M<6;M++){let _=M%3;_===0?(c.up.set(0,l[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[M],r.y,r.z)):_===1?(c.up.set(0,0,l[M]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[M],r.z)):(c.up.set(0,l[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[M]));let P=this._cubeSize;Kl(s,_*P,M>2?P:0,P,P),u.setRenderTarget(s),p&&u.render(g,c),u.render(e,c)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=d,u.autoClear=f,e.background=b}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===ss||e.mapping===rs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=kf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bf());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new Me(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;let c=this._cubeSize;Kl(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,Wh)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Ff[(s-r-1)%Ff.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){let c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new Me(this._lodPlanes[s],l),f=l.uniforms,d=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*us-1),x=r/m,g=isFinite(r)?1+Math.floor(h*x):us;g>us&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${us}`);let p=[],b=0;for(let A=0;A<us;++A){let R=A/x,y=Math.exp(-R*R/2);p.push(y),A===0?b+=y:A<g&&(b+=2*y)}for(let A=0;A<p.length;A++)p[A]=p[A]/b;f.envMap.value=e.texture,f.samples.value=g,f.weights.value=p,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);let{_lodMax:M}=this;f.dTheta.value=m,f.mipInt.value=M-n;let _=this._sizeLods[s],P=3*_*(s>M-mr?s-M+mr:0),S=4*(this._cubeSize-_);Kl(t,P,S,3*_,2*_),c.setRenderTarget(t),c.render(u,Wh)}};function Gy(i){let e=[],t=[],n=[],s=i,r=i-mr+1+Uf.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);t.push(o);let c=1/o;a>i-mr?c=Uf[a-i+mr-1]:a===0&&(c=0),n.push(c);let l=1/(o-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],d=6,m=6,x=3,g=2,p=1,b=new Float32Array(x*m*d),M=new Float32Array(g*m*d),_=new Float32Array(p*m*d);for(let S=0;S<d;S++){let A=S%3*2/3-1,R=S>2?0:-1,y=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];b.set(y,x*m*S),M.set(f,g*m*S);let v=[S,S,S,S,S,S];_.set(v,p*m*S)}let P=new Qe;P.setAttribute("position",new Dt(b,x)),P.setAttribute("uv",new Dt(M,g)),P.setAttribute("faceIndex",new Dt(_,p)),e.push(P),s>mr&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Of(i,e,t){let n=new qn(i,e,t);return n.texture.mapping=Sa,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Kl(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Vy(i,e,t){let n=new Float32Array(us),s=new N(0,1,0);return new On({name:"SphericalGaussianBlur",defines:{n:us,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:su(),fragmentShader:`

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
		`,blending:vi,depthTest:!1,depthWrite:!1})}function Bf(){return new On({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:su(),fragmentShader:`

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
		`,blending:vi,depthTest:!1,depthWrite:!1})}function kf(){return new On({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:su(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:vi,depthTest:!1,depthWrite:!1})}function su(){return`

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
	`}function Wy(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){let c=o.mapping,l=c===cr||c===fl,h=c===ss||c===rs;if(l||h){let u=e.get(o),f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new Ql(i)),u=l?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{let d=o.image;return l&&d&&d.height>0||h&&d&&s(d)?(t===null&&(t=new Ql(i)),u=l?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let c=0,l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){let c=o.target;c.removeEventListener("dispose",r);let l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function Xy(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&js("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function qy(i,e,t,n){let s={},r=new WeakMap;function a(u){let f=u.target;f.index!==null&&e.remove(f.index);for(let m in f.attributes)e.remove(f.attributes[m]);f.removeEventListener("dispose",a),delete s[f.id];let d=r.get(f);d&&(e.remove(d),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function c(u){let f=u.attributes;for(let d in f)e.update(f[d],i.ARRAY_BUFFER)}function l(u){let f=[],d=u.index,m=u.attributes.position,x=0;if(d!==null){let b=d.array;x=d.version;for(let M=0,_=b.length;M<_;M+=3){let P=b[M+0],S=b[M+1],A=b[M+2];f.push(P,S,S,A,A,P)}}else if(m!==void 0){let b=m.array;x=m.version;for(let M=0,_=b.length/3-1;M<_;M+=3){let P=M+0,S=M+1,A=M+2;f.push(P,S,S,A,A,P)}}else return;let g=new(Bh(f)?na:ta)(f,1);g.version=x;let p=r.get(u);p&&e.remove(p),r.set(u,g)}function h(u){let f=r.get(u);if(f){let d=u.index;d!==null&&f.version<d.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function $y(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function c(f,d){i.drawElements(n,d,r,f*a),t.update(d,n,1)}function l(f,d,m){m!==0&&(i.drawElementsInstanced(n,d,r,f*a,m),t.update(d,n,m))}function h(f,d,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,m);let g=0;for(let p=0;p<m;p++)g+=d[p];t.update(g,n,1)}function u(f,d,m,x){if(m===0)return;let g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<f.length;p++)l(f[p]/a,d[p],x[p]);else{g.multiDrawElementsInstancedWEBGL(n,d,0,r,f,0,x,0,m);let p=0;for(let b=0;b<m;b++)p+=d[b]*x[b];t.update(p,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Yy(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Zy(i,e,t){let n=new WeakMap,s=new Rt;function r(a,o,c){let l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0,f=n.get(o);if(f===void 0||f.count!==u){let y=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",y)};f!==void 0&&f.texture.dispose();let d=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],b=o.morphAttributes.color||[],M=0;d===!0&&(M=1),m===!0&&(M=2),x===!0&&(M=3);let _=o.attributes.position.count*M,P=1;_>e.maxTextureSize&&(P=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);let S=new Float32Array(_*P*4*u),A=new jr(S,_,P,u);A.type=zn,A.needsUpdate=!0;let R=M*4;for(let v=0;v<u;v++){let C=g[v],L=p[v],O=b[v],z=_*P*4*v;for(let G=0;G<C.count;G++){let X=G*R;d===!0&&(s.fromBufferAttribute(C,G),S[z+X+0]=s.x,S[z+X+1]=s.y,S[z+X+2]=s.z,S[z+X+3]=0),m===!0&&(s.fromBufferAttribute(L,G),S[z+X+4]=s.x,S[z+X+5]=s.y,S[z+X+6]=s.z,S[z+X+7]=0),x===!0&&(s.fromBufferAttribute(O,G),S[z+X+8]=s.x,S[z+X+9]=s.y,S[z+X+10]=s.z,S[z+X+11]=O.itemSize===4?s.w:1)}}f={count:u,texture:A,size:new ue(_,P)},n.set(o,f),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let d=0;for(let x=0;x<l.length;x++)d+=l[x];let m=o.morphTargetsRelative?1:1-d;c.getUniforms().setValue(i,"morphTargetBaseInfluence",m),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function Jy(i,e,t,n){let s=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,u=e.get(c,h);if(s.get(u)!==l&&(e.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function a(){s=new WeakMap}function o(c){let l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:a}}var sp=new sn,zf=new la(1,1),rp=new jr,ap=new Lo,op=new sa,Hf=[],Gf=[],Vf=new Float32Array(16),Wf=new Float32Array(9),Xf=new Float32Array(4);function xr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Hf[s];if(r===void 0&&(r=new Float32Array(s),Hf[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Gt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Vt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function tc(i,e){let t=Gf[e];t===void 0&&(t=new Int32Array(e),Gf[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Ky(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function jy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Gt(t,e))return;i.uniform2fv(this.addr,e),Vt(t,e)}}function Qy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Gt(t,e))return;i.uniform3fv(this.addr,e),Vt(t,e)}}function e_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Gt(t,e))return;i.uniform4fv(this.addr,e),Vt(t,e)}}function t_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Gt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Vt(t,e)}else{if(Gt(t,n))return;Xf.set(n),i.uniformMatrix2fv(this.addr,!1,Xf),Vt(t,n)}}function n_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Gt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Vt(t,e)}else{if(Gt(t,n))return;Wf.set(n),i.uniformMatrix3fv(this.addr,!1,Wf),Vt(t,n)}}function i_(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Gt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Vt(t,e)}else{if(Gt(t,n))return;Vf.set(n),i.uniformMatrix4fv(this.addr,!1,Vf),Vt(t,n)}}function s_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function r_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Gt(t,e))return;i.uniform2iv(this.addr,e),Vt(t,e)}}function a_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Gt(t,e))return;i.uniform3iv(this.addr,e),Vt(t,e)}}function o_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Gt(t,e))return;i.uniform4iv(this.addr,e),Vt(t,e)}}function l_(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function c_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Gt(t,e))return;i.uniform2uiv(this.addr,e),Vt(t,e)}}function h_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Gt(t,e))return;i.uniform3uiv(this.addr,e),Vt(t,e)}}function u_(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Gt(t,e))return;i.uniform4uiv(this.addr,e),Vt(t,e)}}function d_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(zf.compareFunction=Nh,r=zf):r=sp,t.setTexture2D(e||r,s)}function f_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||ap,s)}function p_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||op,s)}function m_(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||rp,s)}function g_(i){switch(i){case 5126:return Ky;case 35664:return jy;case 35665:return Qy;case 35666:return e_;case 35674:return t_;case 35675:return n_;case 35676:return i_;case 5124:case 35670:return s_;case 35667:case 35671:return r_;case 35668:case 35672:return a_;case 35669:case 35673:return o_;case 5125:return l_;case 36294:return c_;case 36295:return h_;case 36296:return u_;case 35678:case 36198:case 36298:case 36306:case 35682:return d_;case 35679:case 36299:case 36307:return f_;case 35680:case 36300:case 36308:case 36293:return p_;case 36289:case 36303:case 36311:case 36292:return m_}}function x_(i,e){i.uniform1fv(this.addr,e)}function y_(i,e){let t=xr(e,this.size,2);i.uniform2fv(this.addr,t)}function __(i,e){let t=xr(e,this.size,3);i.uniform3fv(this.addr,t)}function v_(i,e){let t=xr(e,this.size,4);i.uniform4fv(this.addr,t)}function b_(i,e){let t=xr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function M_(i,e){let t=xr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function S_(i,e){let t=xr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function E_(i,e){i.uniform1iv(this.addr,e)}function w_(i,e){i.uniform2iv(this.addr,e)}function T_(i,e){i.uniform3iv(this.addr,e)}function A_(i,e){i.uniform4iv(this.addr,e)}function R_(i,e){i.uniform1uiv(this.addr,e)}function C_(i,e){i.uniform2uiv(this.addr,e)}function I_(i,e){i.uniform3uiv(this.addr,e)}function P_(i,e){i.uniform4uiv(this.addr,e)}function L_(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);Gt(n,r)||(i.uniform1iv(this.addr,r),Vt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||sp,r[a])}function D_(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);Gt(n,r)||(i.uniform1iv(this.addr,r),Vt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||ap,r[a])}function U_(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);Gt(n,r)||(i.uniform1iv(this.addr,r),Vt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||op,r[a])}function N_(i,e,t){let n=this.cache,s=e.length,r=tc(t,s);Gt(n,r)||(i.uniform1iv(this.addr,r),Vt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||rp,r[a])}function F_(i){switch(i){case 5126:return x_;case 35664:return y_;case 35665:return __;case 35666:return v_;case 35674:return b_;case 35675:return M_;case 35676:return S_;case 5124:case 35670:return E_;case 35667:case 35671:return w_;case 35668:case 35672:return T_;case 35669:case 35673:return A_;case 5125:return R_;case 36294:return C_;case 36295:return I_;case 36296:return P_;case 35678:case 36198:case 36298:case 36306:case 35682:return L_;case 35679:case 36299:case 36307:return D_;case 35680:case 36300:case 36308:case 36293:return U_;case 36289:case 36303:case 36311:case 36292:return N_}}var Jh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=g_(t.type)}},Kh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=F_(t.type)}},jh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},Zh=/(\w+)(\])?(\[|\.)?/g;function qf(i,e){i.seq.push(e),i.map[e.id]=e}function O_(i,e,t){let n=i.name,s=n.length;for(Zh.lastIndex=0;;){let r=Zh.exec(n),a=Zh.lastIndex,o=r[1],c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){qf(t,l===void 0?new Jh(o,i,e):new Kh(o,i,e));break}else{let u=t.map[o];u===void 0&&(u=new jh(o),qf(t,u)),t=u}}}var gr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);O_(r,a,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function $f(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var B_=37297,k_=0;function z_(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var Yf=new We;function H_(i){tt._getMatrix(Yf,tt.workingColorSpace,i);let e=`mat3( ${Yf.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(i)){case Zr:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Zf(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+z_(i.getShaderSource(e),o)}else return r}function G_(i,e){let t=H_(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function V_(i,e){let t;switch(e){case of:t="Linear";break;case lf:t="Reinhard";break;case cf:t="Cineon";break;case dl:t="ACESFilmic";break;case uf:t="AgX";break;case df:t="Neutral";break;case hf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var jl=new N;function W_(){tt.getLuminanceCoefficients(jl);let i=jl.x.toFixed(4),e=jl.y.toFixed(4),t=jl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function X_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ca).join(`
`)}function q_(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function $_(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Ca(i){return i!==""}function Jf(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Kf(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Y_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Qh(i){return i.replace(Y_,J_)}var Z_=new Map;function J_(i,e){let t=$e[e];if(t===void 0){let n=Z_.get(e);if(n!==void 0)t=$e[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Qh(t)}var K_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function jf(i){return i.replace(K_,j_)}function j_(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Qf(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function Q_(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Mh?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===sl?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Kn&&(e="SHADOWMAP_TYPE_VSM"),e}function ev(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ss:case rs:e="ENVMAP_TYPE_CUBE";break;case Sa:e="ENVMAP_TYPE_CUBE_UV";break}return e}function tv(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case rs:e="ENVMAP_MODE_REFRACTION";break}return e}function nv(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case wh:e="ENVMAP_BLENDING_MULTIPLY";break;case rf:e="ENVMAP_BLENDING_MIX";break;case af:e="ENVMAP_BLENDING_ADD";break}return e}function iv(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function sv(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,c=Q_(t),l=ev(t),h=tv(t),u=nv(t),f=iv(t),d=X_(t),m=q_(r),x=s.createProgram(),g,p,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Ca).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(Ca).join(`
`),p.length>0&&(p+=`
`)):(g=[Qf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ca).join(`
`),p=[Qf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==bi?"#define TONE_MAPPING":"",t.toneMapping!==bi?$e.tonemapping_pars_fragment:"",t.toneMapping!==bi?V_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",$e.colorspace_pars_fragment,G_("linearToOutputTexel",t.outputColorSpace),W_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ca).join(`
`)),a=Qh(a),a=Jf(a,t),a=Kf(a,t),o=Qh(o),o=Jf(o,t),o=Kf(o,t),a=jf(a),o=jf(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===Fh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Fh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let M=b+g+a,_=b+p+o,P=$f(s,s.VERTEX_SHADER,M),S=$f(s,s.FRAGMENT_SHADER,_);s.attachShader(x,P),s.attachShader(x,S),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function A(C){if(i.debug.checkShaderErrors){let L=s.getProgramInfoLog(x)||"",O=s.getShaderInfoLog(P)||"",z=s.getShaderInfoLog(S)||"",G=L.trim(),X=O.trim(),te=z.trim(),q=!0,he=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,P,S);else{let pe=Zf(s,P,"vertex"),Ie=Zf(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+G+`
`+pe+`
`+Ie)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(X===""||te==="")&&(he=!1);he&&(C.diagnostics={runnable:q,programLog:G,vertexShader:{log:X,prefix:g},fragmentShader:{log:te,prefix:p}})}s.deleteShader(P),s.deleteShader(S),R=new gr(s,x),y=$_(s,x)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let y;this.getAttributes=function(){return y===void 0&&A(this),y};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(x,B_)),v},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=k_++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=P,this.fragmentShader=S,this}var rv=0,eu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new tu(e),t.set(e,n)),n}},tu=class{constructor(e){this.id=rv++,this.code=e,this.usedTimes=0}};function av(i,e,t,n,s,r,a){let o=new ea,c=new eu,l=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures,d=s.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(y){return l.add(y),y===0?"uv":`uv${y}`}function g(y,v,C,L,O){let z=L.fog,G=O.geometry,X=y.isMeshStandardMaterial?L.environment:null,te=(y.isMeshStandardMaterial?t:e).get(y.envMap||X),q=te&&te.mapping===Sa?te.image.height:null,he=m[y.type];y.precision!==null&&(d=s.getMaxPrecision(y.precision),d!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",d,"instead."));let pe=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Ie=pe!==void 0?pe.length:0,Ke=0;G.morphAttributes.position!==void 0&&(Ke=1),G.morphAttributes.normal!==void 0&&(Ke=2),G.morphAttributes.color!==void 0&&(Ke=3);let mt,bt,st,K;if(he){let rt=jn[he];mt=rt.vertexShader,bt=rt.fragmentShader}else mt=y.vertexShader,bt=y.fragmentShader,c.update(y),st=c.getVertexShaderID(y),K=c.getFragmentShaderID(y);let ee=i.getRenderTarget(),ve=i.state.buffers.depth.getReversed(),ze=O.isInstancedMesh===!0,Le=O.isBatchedMesh===!0,et=!!y.map,Jt=!!y.matcap,U=!!te,Mt=!!y.aoMap,Ve=!!y.lightMap,Be=!!y.bumpMap,Ee=!!y.normalMap,St=!!y.displacementMap,we=!!y.emissiveMap,qe=!!y.metalnessMap,Wt=!!y.roughnessMap,Lt=y.anisotropy>0,D=y.clearcoat>0,E=y.dispersion>0,H=y.iridescence>0,J=y.sheen>0,Q=y.transmission>0,$=Lt&&!!y.anisotropyMap,Pe=D&&!!y.clearcoatMap,oe=D&&!!y.clearcoatNormalMap,Te=D&&!!y.clearcoatRoughnessMap,Re=H&&!!y.iridescenceMap,se=H&&!!y.iridescenceThicknessMap,ge=J&&!!y.sheenColorMap,Oe=J&&!!y.sheenRoughnessMap,Ce=!!y.specularMap,fe=!!y.specularColorMap,Xe=!!y.specularIntensityMap,F=Q&&!!y.transmissionMap,re=Q&&!!y.thicknessMap,ce=!!y.gradientMap,ye=!!y.alphaMap,ne=y.alphaTest>0,j=!!y.alphaHash,Se=!!y.extensions,Ge=bi;y.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(Ge=i.toneMapping);let gt={shaderID:he,shaderType:y.type,shaderName:y.name,vertexShader:mt,fragmentShader:bt,defines:y.defines,customVertexShaderID:st,customFragmentShaderID:K,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:d,batching:Le,batchingColor:Le&&O._colorsTexture!==null,instancing:ze,instancingColor:ze&&O.instanceColor!==null,instancingMorph:ze&&O.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ee===null?i.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:Qi,alphaToCoverage:!!y.alphaToCoverage,map:et,matcap:Jt,envMap:U,envMapMode:U&&te.mapping,envMapCubeUVHeight:q,aoMap:Mt,lightMap:Ve,bumpMap:Be,normalMap:Ee,displacementMap:f&&St,emissiveMap:we,normalMapObjectSpace:Ee&&y.normalMapType===gf,normalMapTangentSpace:Ee&&y.normalMapType===Uh,metalnessMap:qe,roughnessMap:Wt,anisotropy:Lt,anisotropyMap:$,clearcoat:D,clearcoatMap:Pe,clearcoatNormalMap:oe,clearcoatRoughnessMap:Te,dispersion:E,iridescence:H,iridescenceMap:Re,iridescenceThicknessMap:se,sheen:J,sheenColorMap:ge,sheenRoughnessMap:Oe,specularMap:Ce,specularColorMap:fe,specularIntensityMap:Xe,transmission:Q,transmissionMap:F,thicknessMap:re,gradientMap:ce,opaque:y.transparent===!1&&y.blending===Ki&&y.alphaToCoverage===!1,alphaMap:ye,alphaTest:ne,alphaHash:j,combine:y.combine,mapUv:et&&x(y.map.channel),aoMapUv:Mt&&x(y.aoMap.channel),lightMapUv:Ve&&x(y.lightMap.channel),bumpMapUv:Be&&x(y.bumpMap.channel),normalMapUv:Ee&&x(y.normalMap.channel),displacementMapUv:St&&x(y.displacementMap.channel),emissiveMapUv:we&&x(y.emissiveMap.channel),metalnessMapUv:qe&&x(y.metalnessMap.channel),roughnessMapUv:Wt&&x(y.roughnessMap.channel),anisotropyMapUv:$&&x(y.anisotropyMap.channel),clearcoatMapUv:Pe&&x(y.clearcoatMap.channel),clearcoatNormalMapUv:oe&&x(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Te&&x(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Re&&x(y.iridescenceMap.channel),iridescenceThicknessMapUv:se&&x(y.iridescenceThicknessMap.channel),sheenColorMapUv:ge&&x(y.sheenColorMap.channel),sheenRoughnessMapUv:Oe&&x(y.sheenRoughnessMap.channel),specularMapUv:Ce&&x(y.specularMap.channel),specularColorMapUv:fe&&x(y.specularColorMap.channel),specularIntensityMapUv:Xe&&x(y.specularIntensityMap.channel),transmissionMapUv:F&&x(y.transmissionMap.channel),thicknessMapUv:re&&x(y.thicknessMap.channel),alphaMapUv:ye&&x(y.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(Ee||Lt),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!G.attributes.uv&&(et||ye),fog:!!z,useFog:y.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:ve,skinning:O.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:Ie,morphTextureStride:Ke,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ge,decodeVideoTexture:et&&y.map.isVideoTexture===!0&&tt.getTransfer(y.map.colorSpace)===ot,decodeVideoTextureEmissive:we&&y.emissiveMap.isVideoTexture===!0&&tt.getTransfer(y.emissiveMap.colorSpace)===ot,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===cn,flipSided:y.side===zt,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Se&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Se&&y.extensions.multiDraw===!0||Le)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return gt.vertexUv1s=l.has(1),gt.vertexUv2s=l.has(2),gt.vertexUv3s=l.has(3),l.clear(),gt}function p(y){let v=[];if(y.shaderID?v.push(y.shaderID):(v.push(y.customVertexShaderID),v.push(y.customFragmentShaderID)),y.defines!==void 0)for(let C in y.defines)v.push(C),v.push(y.defines[C]);return y.isRawShaderMaterial===!1&&(b(v,y),M(v,y),v.push(i.outputColorSpace)),v.push(y.customProgramCacheKey),v.join()}function b(y,v){y.push(v.precision),y.push(v.outputColorSpace),y.push(v.envMapMode),y.push(v.envMapCubeUVHeight),y.push(v.mapUv),y.push(v.alphaMapUv),y.push(v.lightMapUv),y.push(v.aoMapUv),y.push(v.bumpMapUv),y.push(v.normalMapUv),y.push(v.displacementMapUv),y.push(v.emissiveMapUv),y.push(v.metalnessMapUv),y.push(v.roughnessMapUv),y.push(v.anisotropyMapUv),y.push(v.clearcoatMapUv),y.push(v.clearcoatNormalMapUv),y.push(v.clearcoatRoughnessMapUv),y.push(v.iridescenceMapUv),y.push(v.iridescenceThicknessMapUv),y.push(v.sheenColorMapUv),y.push(v.sheenRoughnessMapUv),y.push(v.specularMapUv),y.push(v.specularColorMapUv),y.push(v.specularIntensityMapUv),y.push(v.transmissionMapUv),y.push(v.thicknessMapUv),y.push(v.combine),y.push(v.fogExp2),y.push(v.sizeAttenuation),y.push(v.morphTargetsCount),y.push(v.morphAttributeCount),y.push(v.numDirLights),y.push(v.numPointLights),y.push(v.numSpotLights),y.push(v.numSpotLightMaps),y.push(v.numHemiLights),y.push(v.numRectAreaLights),y.push(v.numDirLightShadows),y.push(v.numPointLightShadows),y.push(v.numSpotLightShadows),y.push(v.numSpotLightShadowsWithMaps),y.push(v.numLightProbes),y.push(v.shadowMapType),y.push(v.toneMapping),y.push(v.numClippingPlanes),y.push(v.numClipIntersection),y.push(v.depthPacking)}function M(y,v){o.disableAll(),v.supportsVertexTextures&&o.enable(0),v.instancing&&o.enable(1),v.instancingColor&&o.enable(2),v.instancingMorph&&o.enable(3),v.matcap&&o.enable(4),v.envMap&&o.enable(5),v.normalMapObjectSpace&&o.enable(6),v.normalMapTangentSpace&&o.enable(7),v.clearcoat&&o.enable(8),v.iridescence&&o.enable(9),v.alphaTest&&o.enable(10),v.vertexColors&&o.enable(11),v.vertexAlphas&&o.enable(12),v.vertexUv1s&&o.enable(13),v.vertexUv2s&&o.enable(14),v.vertexUv3s&&o.enable(15),v.vertexTangents&&o.enable(16),v.anisotropy&&o.enable(17),v.alphaHash&&o.enable(18),v.batching&&o.enable(19),v.dispersion&&o.enable(20),v.batchingColor&&o.enable(21),v.gradientMap&&o.enable(22),y.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.reversedDepthBuffer&&o.enable(4),v.skinning&&o.enable(5),v.morphTargets&&o.enable(6),v.morphNormals&&o.enable(7),v.morphColors&&o.enable(8),v.premultipliedAlpha&&o.enable(9),v.shadowMapEnabled&&o.enable(10),v.doubleSided&&o.enable(11),v.flipSided&&o.enable(12),v.useDepthPacking&&o.enable(13),v.dithering&&o.enable(14),v.transmission&&o.enable(15),v.sheen&&o.enable(16),v.opaque&&o.enable(17),v.pointsUvs&&o.enable(18),v.decodeVideoTexture&&o.enable(19),v.decodeVideoTextureEmissive&&o.enable(20),v.alphaToCoverage&&o.enable(21),y.push(o.mask)}function _(y){let v=m[y.type],C;if(v){let L=jn[v];C=Af.clone(L.uniforms)}else C=y.uniforms;return C}function P(y,v){let C;for(let L=0,O=h.length;L<O;L++){let z=h[L];if(z.cacheKey===v){C=z,++C.usedTimes;break}}return C===void 0&&(C=new sv(i,v,y,r),h.push(C)),C}function S(y){if(--y.usedTimes===0){let v=h.indexOf(y);h[v]=h[h.length-1],h.pop(),y.destroy()}}function A(y){c.remove(y)}function R(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:_,acquireProgram:P,releaseProgram:S,releaseShaderCache:A,programs:h,dispose:R}}function ov(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function lv(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function ep(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function tp(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u,f,d,m,x,g){let p=i[e];return p===void 0?(p={id:u.id,object:u,geometry:f,material:d,groupOrder:m,renderOrder:u.renderOrder,z:x,group:g},i[e]=p):(p.id=u.id,p.object=u,p.geometry=f,p.material=d,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=x,p.group=g),e++,p}function o(u,f,d,m,x,g){let p=a(u,f,d,m,x,g);d.transmission>0?n.push(p):d.transparent===!0?s.push(p):t.push(p)}function c(u,f,d,m,x,g){let p=a(u,f,d,m,x,g);d.transmission>0?n.unshift(p):d.transparent===!0?s.unshift(p):t.unshift(p)}function l(u,f){t.length>1&&t.sort(u||lv),n.length>1&&n.sort(f||ep),s.length>1&&s.sort(f||ep)}function h(){for(let u=e,f=i.length;u<f;u++){let d=i[u];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:h,sort:l}}function cv(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new tp,i.set(n,[a])):s>=r.length?(a=new tp,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function hv(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new N,color:new Ae};break;case"SpotLight":t={position:new N,direction:new N,color:new Ae,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new N,color:new Ae,distance:0,decay:0};break;case"HemisphereLight":t={direction:new N,skyColor:new Ae,groundColor:new Ae};break;case"RectAreaLight":t={color:new Ae,position:new N,halfWidth:new N,halfHeight:new N};break}return i[e.id]=t,t}}}function uv(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ue};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ue};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var dv=0;function fv(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function pv(i){let e=new hv,t=uv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new N);let s=new N,r=new dt,a=new dt;function o(l){let h=0,u=0,f=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let d=0,m=0,x=0,g=0,p=0,b=0,M=0,_=0,P=0,S=0,A=0;l.sort(fv);for(let y=0,v=l.length;y<v;y++){let C=l[y],L=C.color,O=C.intensity,z=C.distance,G=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=L.r*O,u+=L.g*O,f+=L.b*O;else if(C.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(C.sh.coefficients[X],O);A++}else if(C.isDirectionalLight){let X=e.get(C);if(X.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let te=C.shadow,q=t.get(C);q.shadowIntensity=te.intensity,q.shadowBias=te.bias,q.shadowNormalBias=te.normalBias,q.shadowRadius=te.radius,q.shadowMapSize=te.mapSize,n.directionalShadow[d]=q,n.directionalShadowMap[d]=G,n.directionalShadowMatrix[d]=C.shadow.matrix,b++}n.directional[d]=X,d++}else if(C.isSpotLight){let X=e.get(C);X.position.setFromMatrixPosition(C.matrixWorld),X.color.copy(L).multiplyScalar(O),X.distance=z,X.coneCos=Math.cos(C.angle),X.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),X.decay=C.decay,n.spot[x]=X;let te=C.shadow;if(C.map&&(n.spotLightMap[P]=C.map,P++,te.updateMatrices(C),C.castShadow&&S++),n.spotLightMatrix[x]=te.matrix,C.castShadow){let q=t.get(C);q.shadowIntensity=te.intensity,q.shadowBias=te.bias,q.shadowNormalBias=te.normalBias,q.shadowRadius=te.radius,q.shadowMapSize=te.mapSize,n.spotShadow[x]=q,n.spotShadowMap[x]=G,_++}x++}else if(C.isRectAreaLight){let X=e.get(C);X.color.copy(L).multiplyScalar(O),X.halfWidth.set(C.width*.5,0,0),X.halfHeight.set(0,C.height*.5,0),n.rectArea[g]=X,g++}else if(C.isPointLight){let X=e.get(C);if(X.color.copy(C.color).multiplyScalar(C.intensity),X.distance=C.distance,X.decay=C.decay,C.castShadow){let te=C.shadow,q=t.get(C);q.shadowIntensity=te.intensity,q.shadowBias=te.bias,q.shadowNormalBias=te.normalBias,q.shadowRadius=te.radius,q.shadowMapSize=te.mapSize,q.shadowCameraNear=te.camera.near,q.shadowCameraFar=te.camera.far,n.pointShadow[m]=q,n.pointShadowMap[m]=G,n.pointShadowMatrix[m]=C.shadow.matrix,M++}n.point[m]=X,m++}else if(C.isHemisphereLight){let X=e.get(C);X.skyColor.copy(C.color).multiplyScalar(O),X.groundColor.copy(C.groundColor).multiplyScalar(O),n.hemi[p]=X,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=de.LTC_FLOAT_1,n.rectAreaLTC2=de.LTC_FLOAT_2):(n.rectAreaLTC1=de.LTC_HALF_1,n.rectAreaLTC2=de.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;let R=n.hash;(R.directionalLength!==d||R.pointLength!==m||R.spotLength!==x||R.rectAreaLength!==g||R.hemiLength!==p||R.numDirectionalShadows!==b||R.numPointShadows!==M||R.numSpotShadows!==_||R.numSpotMaps!==P||R.numLightProbes!==A)&&(n.directional.length=d,n.spot.length=x,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=_+P-S,n.spotLightMap.length=P,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=A,R.directionalLength=d,R.pointLength=m,R.spotLength=x,R.rectAreaLength=g,R.hemiLength=p,R.numDirectionalShadows=b,R.numPointShadows=M,R.numSpotShadows=_,R.numSpotMaps=P,R.numLightProbes=A,n.version=dv++)}function c(l,h){let u=0,f=0,d=0,m=0,x=0,g=h.matrixWorldInverse;for(let p=0,b=l.length;p<b;p++){let M=l[p];if(M.isDirectionalLight){let _=n.directional[u];_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),u++}else if(M.isSpotLight){let _=n.spot[d];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(g),_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(g),d++}else if(M.isRectAreaLight){let _=n.rectArea[m];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(g),a.identity(),r.copy(M.matrixWorld),r.premultiply(g),a.extractRotation(r),_.halfWidth.set(M.width*.5,0,0),_.halfHeight.set(0,M.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),m++}else if(M.isPointLight){let _=n.point[f];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(g),f++}else if(M.isHemisphereLight){let _=n.hemi[x];_.direction.setFromMatrixPosition(M.matrixWorld),_.direction.transformDirection(g),x++}}}return{setup:o,setupView:c,state:n}}function np(i){let e=new pv(i),t=[],n=[];function s(h){l.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function c(h){e.setupView(t,h)}let l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function mv(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new np(i),e.set(s,[o])):r>=a.length?(o=new np(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var gv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,xv=`uniform sampler2D shadow_pass;
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
}`;function yv(i,e,t){let n=new ir,s=new ue,r=new ue,a=new Rt,o=new qo({depthPacking:mf}),c=new $o,l={},h=t.maxTextureSize,u={[ui]:zt,[zt]:ui,[cn]:cn},f=new On({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ue},radius:{value:4}},vertexShader:gv,fragmentShader:xv}),d=f.clone();d.defines.HORIZONTAL_PASS=1;let m=new Qe;m.setAttribute("position",new Dt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new Me(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Mh;let p=this.type;this.render=function(S,A,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;let y=i.getRenderTarget(),v=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),L=i.state;L.setBlending(vi),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let O=p!==Kn&&this.type===Kn,z=p===Kn&&this.type!==Kn;for(let G=0,X=S.length;G<X;G++){let te=S[G],q=te.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",te,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);let he=q.getFrameExtents();if(s.multiply(he),r.copy(q.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/he.x),s.x=r.x*he.x,q.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/he.y),s.y=r.y*he.y,q.mapSize.y=r.y)),q.map===null||O===!0||z===!0){let Ie=this.type!==Kn?{minFilter:on,magFilter:on}:{};q.map!==null&&q.map.dispose(),q.map=new qn(s.x,s.y,Ie),q.map.texture.name=te.name+".shadowMap",q.camera.updateProjectionMatrix()}i.setRenderTarget(q.map),i.clear();let pe=q.getViewportCount();for(let Ie=0;Ie<pe;Ie++){let Ke=q.getViewport(Ie);a.set(r.x*Ke.x,r.y*Ke.y,r.x*Ke.z,r.y*Ke.w),L.viewport(a),q.updateMatrices(te,Ie),n=q.getFrustum(),_(A,R,q.camera,te,this.type)}q.isPointLightShadow!==!0&&this.type===Kn&&b(q,R),q.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(y,v,C)};function b(S,A){let R=e.update(x);f.defines.VSM_SAMPLES!==S.blurSamples&&(f.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new qn(s.x,s.y)),f.uniforms.shadow_pass.value=S.map.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(A,null,R,f,x,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(A,null,R,d,x,null)}function M(S,A,R,y){let v=null,C=R.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(C!==void 0)v=C;else if(v=R.isPointLight===!0?c:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let L=v.uuid,O=A.uuid,z=l[L];z===void 0&&(z={},l[L]=z);let G=z[O];G===void 0&&(G=v.clone(),z[O]=G,A.addEventListener("dispose",P)),v=G}if(v.visible=A.visible,v.wireframe=A.wireframe,y===Kn?v.side=A.shadowSide!==null?A.shadowSide:A.side:v.side=A.shadowSide!==null?A.shadowSide:u[A.side],v.alphaMap=A.alphaMap,v.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,v.map=A.map,v.clipShadows=A.clipShadows,v.clippingPlanes=A.clippingPlanes,v.clipIntersection=A.clipIntersection,v.displacementMap=A.displacementMap,v.displacementScale=A.displacementScale,v.displacementBias=A.displacementBias,v.wireframeLinewidth=A.wireframeLinewidth,v.linewidth=A.linewidth,R.isPointLight===!0&&v.isMeshDistanceMaterial===!0){let L=i.properties.get(v);L.light=R}return v}function _(S,A,R,y,v){if(S.visible===!1)return;if(S.layers.test(A.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&v===Kn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,S.matrixWorld);let O=e.update(S),z=S.material;if(Array.isArray(z)){let G=O.groups;for(let X=0,te=G.length;X<te;X++){let q=G[X],he=z[q.materialIndex];if(he&&he.visible){let pe=M(S,he,y,v);S.onBeforeShadow(i,S,A,R,O,pe,q),i.renderBufferDirect(R,null,O,pe,S,q),S.onAfterShadow(i,S,A,R,O,pe,q)}}}else if(z.visible){let G=M(S,z,y,v);S.onBeforeShadow(i,S,A,R,O,G,null),i.renderBufferDirect(R,null,O,G,S,null),S.onAfterShadow(i,S,A,R,O,G,null)}}let L=S.children;for(let O=0,z=L.length;O<z;O++)_(L[O],A,R,y,v)}function P(S){S.target.removeEventListener("dispose",P);for(let R in l){let y=l[R],v=S.target.uuid;v in y&&(y[v].dispose(),delete y[v])}}}var _v={[rl]:al,[ol]:hl,[ll]:ul,[ji]:cl,[al]:rl,[hl]:ol,[ul]:ll,[cl]:ji};function vv(i,e){function t(){let F=!1,re=new Rt,ce=null,ye=new Rt(0,0,0,0);return{setMask:function(ne){ce!==ne&&!F&&(i.colorMask(ne,ne,ne,ne),ce=ne)},setLocked:function(ne){F=ne},setClear:function(ne,j,Se,Ge,gt){gt===!0&&(ne*=Ge,j*=Ge,Se*=Ge),re.set(ne,j,Se,Ge),ye.equals(re)===!1&&(i.clearColor(ne,j,Se,Ge),ye.copy(re))},reset:function(){F=!1,ce=null,ye.set(-1,0,0,0)}}}function n(){let F=!1,re=!1,ce=null,ye=null,ne=null;return{setReversed:function(j){if(re!==j){let Se=e.get("EXT_clip_control");j?Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.ZERO_TO_ONE_EXT):Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.NEGATIVE_ONE_TO_ONE_EXT),re=j;let Ge=ne;ne=null,this.setClear(Ge)}},getReversed:function(){return re},setTest:function(j){j?ee(i.DEPTH_TEST):ve(i.DEPTH_TEST)},setMask:function(j){ce!==j&&!F&&(i.depthMask(j),ce=j)},setFunc:function(j){if(re&&(j=_v[j]),ye!==j){switch(j){case rl:i.depthFunc(i.NEVER);break;case al:i.depthFunc(i.ALWAYS);break;case ol:i.depthFunc(i.LESS);break;case ji:i.depthFunc(i.LEQUAL);break;case ll:i.depthFunc(i.EQUAL);break;case cl:i.depthFunc(i.GEQUAL);break;case hl:i.depthFunc(i.GREATER);break;case ul:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ye=j}},setLocked:function(j){F=j},setClear:function(j){ne!==j&&(re&&(j=1-j),i.clearDepth(j),ne=j)},reset:function(){F=!1,ce=null,ye=null,ne=null,re=!1}}}function s(){let F=!1,re=null,ce=null,ye=null,ne=null,j=null,Se=null,Ge=null,gt=null;return{setTest:function(rt){F||(rt?ee(i.STENCIL_TEST):ve(i.STENCIL_TEST))},setMask:function(rt){re!==rt&&!F&&(i.stencilMask(rt),re=rt)},setFunc:function(rt,ii,Vn){(ce!==rt||ye!==ii||ne!==Vn)&&(i.stencilFunc(rt,ii,Vn),ce=rt,ye=ii,ne=Vn)},setOp:function(rt,ii,Vn){(j!==rt||Se!==ii||Ge!==Vn)&&(i.stencilOp(rt,ii,Vn),j=rt,Se=ii,Ge=Vn)},setLocked:function(rt){F=rt},setClear:function(rt){gt!==rt&&(i.clearStencil(rt),gt=rt)},reset:function(){F=!1,re=null,ce=null,ye=null,ne=null,j=null,Se=null,Ge=null,gt=null}}}let r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap,h={},u={},f=new WeakMap,d=[],m=null,x=!1,g=null,p=null,b=null,M=null,_=null,P=null,S=null,A=new Ae(0,0,0),R=0,y=!1,v=null,C=null,L=null,O=null,z=null,G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),X=!1,te=0,q=i.getParameter(i.VERSION);q.indexOf("WebGL")!==-1?(te=parseFloat(/^WebGL (\d)/.exec(q)[1]),X=te>=1):q.indexOf("OpenGL ES")!==-1&&(te=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),X=te>=2);let he=null,pe={},Ie=i.getParameter(i.SCISSOR_BOX),Ke=i.getParameter(i.VIEWPORT),mt=new Rt().fromArray(Ie),bt=new Rt().fromArray(Ke);function st(F,re,ce,ye){let ne=new Uint8Array(4),j=i.createTexture();i.bindTexture(F,j),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Se=0;Se<ce;Se++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(re,0,i.RGBA,1,1,ye,0,i.RGBA,i.UNSIGNED_BYTE,ne):i.texImage2D(re+Se,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ne);return j}let K={};K[i.TEXTURE_2D]=st(i.TEXTURE_2D,i.TEXTURE_2D,1),K[i.TEXTURE_CUBE_MAP]=st(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[i.TEXTURE_2D_ARRAY]=st(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),K[i.TEXTURE_3D]=st(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ee(i.DEPTH_TEST),a.setFunc(ji),Be(!1),Ee(bh),ee(i.CULL_FACE),Mt(vi);function ee(F){h[F]!==!0&&(i.enable(F),h[F]=!0)}function ve(F){h[F]!==!1&&(i.disable(F),h[F]=!1)}function ze(F,re){return u[F]!==re?(i.bindFramebuffer(F,re),u[F]=re,F===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=re),F===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=re),!0):!1}function Le(F,re){let ce=d,ye=!1;if(F){ce=f.get(re),ce===void 0&&(ce=[],f.set(re,ce));let ne=F.textures;if(ce.length!==ne.length||ce[0]!==i.COLOR_ATTACHMENT0){for(let j=0,Se=ne.length;j<Se;j++)ce[j]=i.COLOR_ATTACHMENT0+j;ce.length=ne.length,ye=!0}}else ce[0]!==i.BACK&&(ce[0]=i.BACK,ye=!0);ye&&i.drawBuffers(ce)}function et(F){return m!==F?(i.useProgram(F),m=F,!0):!1}let Jt={[Pi]:i.FUNC_ADD,[Hd]:i.FUNC_SUBTRACT,[Gd]:i.FUNC_REVERSE_SUBTRACT};Jt[Vd]=i.MIN,Jt[Wd]=i.MAX;let U={[Xd]:i.ZERO,[qd]:i.ONE,[$d]:i.SRC_COLOR,[wo]:i.SRC_ALPHA,[Qd]:i.SRC_ALPHA_SATURATE,[Kd]:i.DST_COLOR,[Zd]:i.DST_ALPHA,[Yd]:i.ONE_MINUS_SRC_COLOR,[To]:i.ONE_MINUS_SRC_ALPHA,[jd]:i.ONE_MINUS_DST_COLOR,[Jd]:i.ONE_MINUS_DST_ALPHA,[ef]:i.CONSTANT_COLOR,[tf]:i.ONE_MINUS_CONSTANT_COLOR,[nf]:i.CONSTANT_ALPHA,[sf]:i.ONE_MINUS_CONSTANT_ALPHA};function Mt(F,re,ce,ye,ne,j,Se,Ge,gt,rt){if(F===vi){x===!0&&(ve(i.BLEND),x=!1);return}if(x===!1&&(ee(i.BLEND),x=!0),F!==zd){if(F!==g||rt!==y){if((p!==Pi||_!==Pi)&&(i.blendEquation(i.FUNC_ADD),p=Pi,_=Pi),rt)switch(F){case Ki:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case yn:i.blendFunc(i.ONE,i.ONE);break;case Sh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Eh:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Ki:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case yn:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Sh:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Eh:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}b=null,M=null,P=null,S=null,A.set(0,0,0),R=0,g=F,y=rt}return}ne=ne||re,j=j||ce,Se=Se||ye,(re!==p||ne!==_)&&(i.blendEquationSeparate(Jt[re],Jt[ne]),p=re,_=ne),(ce!==b||ye!==M||j!==P||Se!==S)&&(i.blendFuncSeparate(U[ce],U[ye],U[j],U[Se]),b=ce,M=ye,P=j,S=Se),(Ge.equals(A)===!1||gt!==R)&&(i.blendColor(Ge.r,Ge.g,Ge.b,gt),A.copy(Ge),R=gt),g=F,y=!1}function Ve(F,re){F.side===cn?ve(i.CULL_FACE):ee(i.CULL_FACE);let ce=F.side===zt;re&&(ce=!ce),Be(ce),F.blending===Ki&&F.transparent===!1?Mt(vi):Mt(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);let ye=F.stencilWrite;o.setTest(ye),ye&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),we(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?ee(i.SAMPLE_ALPHA_TO_COVERAGE):ve(i.SAMPLE_ALPHA_TO_COVERAGE)}function Be(F){v!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),v=F)}function Ee(F){F!==Bd?(ee(i.CULL_FACE),F!==C&&(F===bh?i.cullFace(i.BACK):F===kd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ve(i.CULL_FACE),C=F}function St(F){F!==L&&(X&&i.lineWidth(F),L=F)}function we(F,re,ce){F?(ee(i.POLYGON_OFFSET_FILL),(O!==re||z!==ce)&&(i.polygonOffset(re,ce),O=re,z=ce)):ve(i.POLYGON_OFFSET_FILL)}function qe(F){F?ee(i.SCISSOR_TEST):ve(i.SCISSOR_TEST)}function Wt(F){F===void 0&&(F=i.TEXTURE0+G-1),he!==F&&(i.activeTexture(F),he=F)}function Lt(F,re,ce){ce===void 0&&(he===null?ce=i.TEXTURE0+G-1:ce=he);let ye=pe[ce];ye===void 0&&(ye={type:void 0,texture:void 0},pe[ce]=ye),(ye.type!==F||ye.texture!==re)&&(he!==ce&&(i.activeTexture(ce),he=ce),i.bindTexture(F,re||K[F]),ye.type=F,ye.texture=re)}function D(){let F=pe[he];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function E(){try{i.compressedTexImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function H(){try{i.compressedTexImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function J(){try{i.texSubImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Q(){try{i.texSubImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function $(){try{i.compressedTexSubImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Pe(){try{i.compressedTexSubImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function oe(){try{i.texStorage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Te(){try{i.texStorage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Re(){try{i.texImage2D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function se(){try{i.texImage3D(...arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ge(F){mt.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),mt.copy(F))}function Oe(F){bt.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),bt.copy(F))}function Ce(F,re){let ce=l.get(re);ce===void 0&&(ce=new WeakMap,l.set(re,ce));let ye=ce.get(F);ye===void 0&&(ye=i.getUniformBlockIndex(re,F.name),ce.set(F,ye))}function fe(F,re){let ye=l.get(re).get(F);c.get(re)!==ye&&(i.uniformBlockBinding(re,ye,F.__bindingPointIndex),c.set(re,ye))}function Xe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},he=null,pe={},u={},f=new WeakMap,d=[],m=null,x=!1,g=null,p=null,b=null,M=null,_=null,P=null,S=null,A=new Ae(0,0,0),R=0,y=!1,v=null,C=null,L=null,O=null,z=null,mt.set(0,0,i.canvas.width,i.canvas.height),bt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ee,disable:ve,bindFramebuffer:ze,drawBuffers:Le,useProgram:et,setBlending:Mt,setMaterial:Ve,setFlipSided:Be,setCullFace:Ee,setLineWidth:St,setPolygonOffset:we,setScissorTest:qe,activeTexture:Wt,bindTexture:Lt,unbindTexture:D,compressedTexImage2D:E,compressedTexImage3D:H,texImage2D:Re,texImage3D:se,updateUBOMapping:Ce,uniformBlockBinding:fe,texStorage2D:oe,texStorage3D:Te,texSubImage2D:J,texSubImage3D:Q,compressedTexSubImage2D:$,compressedTexSubImage3D:Pe,scissor:ge,viewport:Oe,reset:Xe}}function bv(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new ue,h=new WeakMap,u,f=new WeakMap,d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(D,E){return d?new OffscreenCanvas(D,E):Kr("canvas")}function x(D,E,H){let J=1,Q=Lt(D);if((Q.width>H||Q.height>H)&&(J=H/Math.max(Q.width,Q.height)),J<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){let $=Math.floor(J*Q.width),Pe=Math.floor(J*Q.height);u===void 0&&(u=m($,Pe));let oe=E?m($,Pe):u;return oe.width=$,oe.height=Pe,oe.getContext("2d").drawImage(D,0,0,$,Pe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+$+"x"+Pe+")."),oe}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),D;return D}function g(D){return D.generateMipmaps}function p(D){i.generateMipmap(D)}function b(D){return D.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:D.isWebGL3DRenderTarget?i.TEXTURE_3D:D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(D,E,H,J,Q=!1){if(D!==null){if(i[D]!==void 0)return i[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let $=E;if(E===i.RED&&(H===i.FLOAT&&($=i.R32F),H===i.HALF_FLOAT&&($=i.R16F),H===i.UNSIGNED_BYTE&&($=i.R8)),E===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.R8UI),H===i.UNSIGNED_SHORT&&($=i.R16UI),H===i.UNSIGNED_INT&&($=i.R32UI),H===i.BYTE&&($=i.R8I),H===i.SHORT&&($=i.R16I),H===i.INT&&($=i.R32I)),E===i.RG&&(H===i.FLOAT&&($=i.RG32F),H===i.HALF_FLOAT&&($=i.RG16F),H===i.UNSIGNED_BYTE&&($=i.RG8)),E===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.RG8UI),H===i.UNSIGNED_SHORT&&($=i.RG16UI),H===i.UNSIGNED_INT&&($=i.RG32UI),H===i.BYTE&&($=i.RG8I),H===i.SHORT&&($=i.RG16I),H===i.INT&&($=i.RG32I)),E===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.RGB8UI),H===i.UNSIGNED_SHORT&&($=i.RGB16UI),H===i.UNSIGNED_INT&&($=i.RGB32UI),H===i.BYTE&&($=i.RGB8I),H===i.SHORT&&($=i.RGB16I),H===i.INT&&($=i.RGB32I)),E===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.RGBA8UI),H===i.UNSIGNED_SHORT&&($=i.RGBA16UI),H===i.UNSIGNED_INT&&($=i.RGBA32UI),H===i.BYTE&&($=i.RGBA8I),H===i.SHORT&&($=i.RGBA16I),H===i.INT&&($=i.RGBA32I)),E===i.RGB&&(H===i.UNSIGNED_INT_5_9_9_9_REV&&($=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&($=i.R11F_G11F_B10F)),E===i.RGBA){let Pe=Q?Zr:tt.getTransfer(J);H===i.FLOAT&&($=i.RGBA32F),H===i.HALF_FLOAT&&($=i.RGBA16F),H===i.UNSIGNED_BYTE&&($=Pe===ot?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT_4_4_4_4&&($=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&($=i.RGB5_A1)}return($===i.R16F||$===i.R32F||$===i.RG16F||$===i.RG32F||$===i.RGBA16F||$===i.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function _(D,E){let H;return D?E===null||E===Oi||E===dr?H=i.DEPTH24_STENCIL8:E===zn?H=i.DEPTH32F_STENCIL8:E===hr&&(H=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Oi||E===dr?H=i.DEPTH_COMPONENT24:E===zn?H=i.DEPTH_COMPONENT32F:E===hr&&(H=i.DEPTH_COMPONENT16),H}function P(D,E){return g(D)===!0||D.isFramebufferTexture&&D.minFilter!==on&&D.minFilter!==Nn?Math.log2(Math.max(E.width,E.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?E.mipmaps.length:1}function S(D){let E=D.target;E.removeEventListener("dispose",S),R(E),E.isVideoTexture&&h.delete(E)}function A(D){let E=D.target;E.removeEventListener("dispose",A),v(E)}function R(D){let E=n.get(D);if(E.__webglInit===void 0)return;let H=D.source,J=f.get(H);if(J){let Q=J[E.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&y(D),Object.keys(J).length===0&&f.delete(H)}n.remove(D)}function y(D){let E=n.get(D);i.deleteTexture(E.__webglTexture);let H=D.source,J=f.get(H);delete J[E.__cacheKey],a.memory.textures--}function v(D){let E=n.get(D);if(D.depthTexture&&(D.depthTexture.dispose(),n.remove(D.depthTexture)),D.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(E.__webglFramebuffer[J]))for(let Q=0;Q<E.__webglFramebuffer[J].length;Q++)i.deleteFramebuffer(E.__webglFramebuffer[J][Q]);else i.deleteFramebuffer(E.__webglFramebuffer[J]);E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer[J])}else{if(Array.isArray(E.__webglFramebuffer))for(let J=0;J<E.__webglFramebuffer.length;J++)i.deleteFramebuffer(E.__webglFramebuffer[J]);else i.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&i.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let J=0;J<E.__webglColorRenderbuffer.length;J++)E.__webglColorRenderbuffer[J]&&i.deleteRenderbuffer(E.__webglColorRenderbuffer[J]);E.__webglDepthRenderbuffer&&i.deleteRenderbuffer(E.__webglDepthRenderbuffer)}let H=D.textures;for(let J=0,Q=H.length;J<Q;J++){let $=n.get(H[J]);$.__webglTexture&&(i.deleteTexture($.__webglTexture),a.memory.textures--),n.remove(H[J])}n.remove(D)}let C=0;function L(){C=0}function O(){let D=C;return D>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+s.maxTextures),C+=1,D}function z(D){let E=[];return E.push(D.wrapS),E.push(D.wrapT),E.push(D.wrapR||0),E.push(D.magFilter),E.push(D.minFilter),E.push(D.anisotropy),E.push(D.internalFormat),E.push(D.format),E.push(D.type),E.push(D.generateMipmaps),E.push(D.premultiplyAlpha),E.push(D.flipY),E.push(D.unpackAlignment),E.push(D.colorSpace),E.join()}function G(D,E){let H=n.get(D);if(D.isVideoTexture&&qe(D),D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&H.__version!==D.version){let J=D.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(H,D,E);return}}else D.isExternalTexture&&(H.__webglTexture=D.sourceTexture?D.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+E)}function X(D,E){let H=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&H.__version!==D.version){K(H,D,E);return}t.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+E)}function te(D,E){let H=n.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&H.__version!==D.version){K(H,D,E);return}t.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+E)}function q(D,E){let H=n.get(D);if(D.version>0&&H.__version!==D.version){ee(H,D,E);return}t.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+E)}let he={[Li]:i.REPEAT,[Ii]:i.CLAMP_TO_EDGE,[Ao]:i.MIRRORED_REPEAT},pe={[on]:i.NEAREST,[ff]:i.NEAREST_MIPMAP_NEAREST,[Ea]:i.NEAREST_MIPMAP_LINEAR,[Nn]:i.LINEAR,[pl]:i.LINEAR_MIPMAP_NEAREST,[Fi]:i.LINEAR_MIPMAP_LINEAR},Ie={[xf]:i.NEVER,[Sf]:i.ALWAYS,[yf]:i.LESS,[Nh]:i.LEQUAL,[_f]:i.EQUAL,[Mf]:i.GEQUAL,[vf]:i.GREATER,[bf]:i.NOTEQUAL};function Ke(D,E){if(E.type===zn&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===Nn||E.magFilter===pl||E.magFilter===Ea||E.magFilter===Fi||E.minFilter===Nn||E.minFilter===pl||E.minFilter===Ea||E.minFilter===Fi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(D,i.TEXTURE_WRAP_S,he[E.wrapS]),i.texParameteri(D,i.TEXTURE_WRAP_T,he[E.wrapT]),(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)&&i.texParameteri(D,i.TEXTURE_WRAP_R,he[E.wrapR]),i.texParameteri(D,i.TEXTURE_MAG_FILTER,pe[E.magFilter]),i.texParameteri(D,i.TEXTURE_MIN_FILTER,pe[E.minFilter]),E.compareFunction&&(i.texParameteri(D,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(D,i.TEXTURE_COMPARE_FUNC,Ie[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===on||E.minFilter!==Ea&&E.minFilter!==Fi||E.type===zn&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||n.get(E).__currentAnisotropy){let H=e.get("EXT_texture_filter_anisotropic");i.texParameterf(D,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy}}}function mt(D,E){let H=!1;D.__webglInit===void 0&&(D.__webglInit=!0,E.addEventListener("dispose",S));let J=E.source,Q=f.get(J);Q===void 0&&(Q={},f.set(J,Q));let $=z(E);if($!==D.__cacheKey){Q[$]===void 0&&(Q[$]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,H=!0),Q[$].usedTimes++;let Pe=Q[D.__cacheKey];Pe!==void 0&&(Q[D.__cacheKey].usedTimes--,Pe.usedTimes===0&&y(E)),D.__cacheKey=$,D.__webglTexture=Q[$].texture}return H}function bt(D,E,H){return Math.floor(Math.floor(D/H)/E)}function st(D,E,H,J){let $=D.updateRanges;if($.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,E.width,E.height,H,J,E.data);else{$.sort((se,ge)=>se.start-ge.start);let Pe=0;for(let se=1;se<$.length;se++){let ge=$[Pe],Oe=$[se],Ce=ge.start+ge.count,fe=bt(Oe.start,E.width,4),Xe=bt(ge.start,E.width,4);Oe.start<=Ce+1&&fe===Xe&&bt(Oe.start+Oe.count-1,E.width,4)===fe?ge.count=Math.max(ge.count,Oe.start+Oe.count-ge.start):(++Pe,$[Pe]=Oe)}$.length=Pe+1;let oe=i.getParameter(i.UNPACK_ROW_LENGTH),Te=i.getParameter(i.UNPACK_SKIP_PIXELS),Re=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,E.width);for(let se=0,ge=$.length;se<ge;se++){let Oe=$[se],Ce=Math.floor(Oe.start/4),fe=Math.ceil(Oe.count/4),Xe=Ce%E.width,F=Math.floor(Ce/E.width),re=fe,ce=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Xe),i.pixelStorei(i.UNPACK_SKIP_ROWS,F),t.texSubImage2D(i.TEXTURE_2D,0,Xe,F,re,ce,H,J,E.data)}D.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,oe),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Te),i.pixelStorei(i.UNPACK_SKIP_ROWS,Re)}}function K(D,E,H){let J=i.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(J=i.TEXTURE_2D_ARRAY),E.isData3DTexture&&(J=i.TEXTURE_3D);let Q=mt(D,E),$=E.source;t.bindTexture(J,D.__webglTexture,i.TEXTURE0+H);let Pe=n.get($);if($.version!==Pe.__version||Q===!0){t.activeTexture(i.TEXTURE0+H);let oe=tt.getPrimaries(tt.workingColorSpace),Te=E.colorSpace===Hn?null:tt.getPrimaries(E.colorSpace),Re=E.colorSpace===Hn||oe===Te?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Re);let se=x(E.image,!1,s.maxTextureSize);se=Wt(E,se);let ge=r.convert(E.format,E.colorSpace),Oe=r.convert(E.type),Ce=M(E.internalFormat,ge,Oe,E.colorSpace,E.isVideoTexture);Ke(J,E);let fe,Xe=E.mipmaps,F=E.isVideoTexture!==!0,re=Pe.__version===void 0||Q===!0,ce=$.dataReady,ye=P(E,se);if(E.isDepthTexture)Ce=_(E.format===fr,E.type),re&&(F?t.texStorage2D(i.TEXTURE_2D,1,Ce,se.width,se.height):t.texImage2D(i.TEXTURE_2D,0,Ce,se.width,se.height,0,ge,Oe,null));else if(E.isDataTexture)if(Xe.length>0){F&&re&&t.texStorage2D(i.TEXTURE_2D,ye,Ce,Xe[0].width,Xe[0].height);for(let ne=0,j=Xe.length;ne<j;ne++)fe=Xe[ne],F?ce&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,fe.width,fe.height,ge,Oe,fe.data):t.texImage2D(i.TEXTURE_2D,ne,Ce,fe.width,fe.height,0,ge,Oe,fe.data);E.generateMipmaps=!1}else F?(re&&t.texStorage2D(i.TEXTURE_2D,ye,Ce,se.width,se.height),ce&&st(E,se,ge,Oe)):t.texImage2D(i.TEXTURE_2D,0,Ce,se.width,se.height,0,ge,Oe,se.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){F&&re&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ye,Ce,Xe[0].width,Xe[0].height,se.depth);for(let ne=0,j=Xe.length;ne<j;ne++)if(fe=Xe[ne],E.format!==Tn)if(ge!==null)if(F){if(ce)if(E.layerUpdates.size>0){let Se=Vh(fe.width,fe.height,E.format,E.type);for(let Ge of E.layerUpdates){let gt=fe.data.subarray(Ge*Se/fe.data.BYTES_PER_ELEMENT,(Ge+1)*Se/fe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,Ge,fe.width,fe.height,1,ge,gt)}E.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,0,fe.width,fe.height,se.depth,ge,fe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ne,Ce,fe.width,fe.height,se.depth,0,fe.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else F?ce&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ne,0,0,0,fe.width,fe.height,se.depth,ge,Oe,fe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ne,Ce,fe.width,fe.height,se.depth,0,ge,Oe,fe.data)}else{F&&re&&t.texStorage2D(i.TEXTURE_2D,ye,Ce,Xe[0].width,Xe[0].height);for(let ne=0,j=Xe.length;ne<j;ne++)fe=Xe[ne],E.format!==Tn?ge!==null?F?ce&&t.compressedTexSubImage2D(i.TEXTURE_2D,ne,0,0,fe.width,fe.height,ge,fe.data):t.compressedTexImage2D(i.TEXTURE_2D,ne,Ce,fe.width,fe.height,0,fe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):F?ce&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,fe.width,fe.height,ge,Oe,fe.data):t.texImage2D(i.TEXTURE_2D,ne,Ce,fe.width,fe.height,0,ge,Oe,fe.data)}else if(E.isDataArrayTexture)if(F){if(re&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ye,Ce,se.width,se.height,se.depth),ce)if(E.layerUpdates.size>0){let ne=Vh(se.width,se.height,E.format,E.type);for(let j of E.layerUpdates){let Se=se.data.subarray(j*ne/se.data.BYTES_PER_ELEMENT,(j+1)*ne/se.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,j,se.width,se.height,1,ge,Oe,Se)}E.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,se.width,se.height,se.depth,ge,Oe,se.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ce,se.width,se.height,se.depth,0,ge,Oe,se.data);else if(E.isData3DTexture)F?(re&&t.texStorage3D(i.TEXTURE_3D,ye,Ce,se.width,se.height,se.depth),ce&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,se.width,se.height,se.depth,ge,Oe,se.data)):t.texImage3D(i.TEXTURE_3D,0,Ce,se.width,se.height,se.depth,0,ge,Oe,se.data);else if(E.isFramebufferTexture){if(re)if(F)t.texStorage2D(i.TEXTURE_2D,ye,Ce,se.width,se.height);else{let ne=se.width,j=se.height;for(let Se=0;Se<ye;Se++)t.texImage2D(i.TEXTURE_2D,Se,Ce,ne,j,0,ge,Oe,null),ne>>=1,j>>=1}}else if(Xe.length>0){if(F&&re){let ne=Lt(Xe[0]);t.texStorage2D(i.TEXTURE_2D,ye,Ce,ne.width,ne.height)}for(let ne=0,j=Xe.length;ne<j;ne++)fe=Xe[ne],F?ce&&t.texSubImage2D(i.TEXTURE_2D,ne,0,0,ge,Oe,fe):t.texImage2D(i.TEXTURE_2D,ne,Ce,ge,Oe,fe);E.generateMipmaps=!1}else if(F){if(re){let ne=Lt(se);t.texStorage2D(i.TEXTURE_2D,ye,Ce,ne.width,ne.height)}ce&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ge,Oe,se)}else t.texImage2D(i.TEXTURE_2D,0,Ce,ge,Oe,se);g(E)&&p(J),Pe.__version=$.version,E.onUpdate&&E.onUpdate(E)}D.__version=E.version}function ee(D,E,H){if(E.image.length!==6)return;let J=mt(D,E),Q=E.source;t.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture,i.TEXTURE0+H);let $=n.get(Q);if(Q.version!==$.__version||J===!0){t.activeTexture(i.TEXTURE0+H);let Pe=tt.getPrimaries(tt.workingColorSpace),oe=E.colorSpace===Hn?null:tt.getPrimaries(E.colorSpace),Te=E.colorSpace===Hn||Pe===oe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Te);let Re=E.isCompressedTexture||E.image[0].isCompressedTexture,se=E.image[0]&&E.image[0].isDataTexture,ge=[];for(let j=0;j<6;j++)!Re&&!se?ge[j]=x(E.image[j],!0,s.maxCubemapSize):ge[j]=se?E.image[j].image:E.image[j],ge[j]=Wt(E,ge[j]);let Oe=ge[0],Ce=r.convert(E.format,E.colorSpace),fe=r.convert(E.type),Xe=M(E.internalFormat,Ce,fe,E.colorSpace),F=E.isVideoTexture!==!0,re=$.__version===void 0||J===!0,ce=Q.dataReady,ye=P(E,Oe);Ke(i.TEXTURE_CUBE_MAP,E);let ne;if(Re){F&&re&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ye,Xe,Oe.width,Oe.height);for(let j=0;j<6;j++){ne=ge[j].mipmaps;for(let Se=0;Se<ne.length;Se++){let Ge=ne[Se];E.format!==Tn?Ce!==null?F?ce&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se,0,0,Ge.width,Ge.height,Ce,Ge.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se,Xe,Ge.width,Ge.height,0,Ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se,0,0,Ge.width,Ge.height,Ce,fe,Ge.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se,Xe,Ge.width,Ge.height,0,Ce,fe,Ge.data)}}}else{if(ne=E.mipmaps,F&&re){ne.length>0&&ye++;let j=Lt(ge[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ye,Xe,j.width,j.height)}for(let j=0;j<6;j++)if(se){F?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,ge[j].width,ge[j].height,Ce,fe,ge[j].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Xe,ge[j].width,ge[j].height,0,Ce,fe,ge[j].data);for(let Se=0;Se<ne.length;Se++){let gt=ne[Se].image[j].image;F?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se+1,0,0,gt.width,gt.height,Ce,fe,gt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se+1,Xe,gt.width,gt.height,0,Ce,fe,gt.data)}}else{F?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Ce,fe,ge[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Xe,Ce,fe,ge[j]);for(let Se=0;Se<ne.length;Se++){let Ge=ne[Se];F?ce&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se+1,0,0,Ce,fe,Ge.image[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se+1,Xe,Ce,fe,Ge.image[j])}}}g(E)&&p(i.TEXTURE_CUBE_MAP),$.__version=Q.version,E.onUpdate&&E.onUpdate(E)}D.__version=E.version}function ve(D,E,H,J,Q,$){let Pe=r.convert(H.format,H.colorSpace),oe=r.convert(H.type),Te=M(H.internalFormat,Pe,oe,H.colorSpace),Re=n.get(E),se=n.get(H);if(se.__renderTarget=E,!Re.__hasExternalTextures){let ge=Math.max(1,E.width>>$),Oe=Math.max(1,E.height>>$);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?t.texImage3D(Q,$,Te,ge,Oe,E.depth,0,Pe,oe,null):t.texImage2D(Q,$,Te,ge,Oe,0,Pe,oe,null)}t.bindFramebuffer(i.FRAMEBUFFER,D),we(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,J,Q,se.__webglTexture,0,St(E)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,J,Q,se.__webglTexture,$),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ze(D,E,H){if(i.bindRenderbuffer(i.RENDERBUFFER,D),E.depthBuffer){let J=E.depthTexture,Q=J&&J.isDepthTexture?J.type:null,$=_(E.stencilBuffer,Q),Pe=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,oe=St(E);we(E)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,oe,$,E.width,E.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,oe,$,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,$,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Pe,i.RENDERBUFFER,D)}else{let J=E.textures;for(let Q=0;Q<J.length;Q++){let $=J[Q],Pe=r.convert($.format,$.colorSpace),oe=r.convert($.type),Te=M($.internalFormat,Pe,oe,$.colorSpace),Re=St(E);H&&we(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Re,Te,E.width,E.height):we(E)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Re,Te,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,Te,E.width,E.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Le(D,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,D),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let J=n.get(E.depthTexture);J.__renderTarget=E,(!J.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),G(E.depthTexture,0);let Q=J.__webglTexture,$=St(E);if(E.depthTexture.format===Js)we(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0);else if(E.depthTexture.format===fr)we(E)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function et(D){let E=n.get(D),H=D.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==D.depthTexture){let J=D.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),J){let Q=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,J.removeEventListener("dispose",Q)};J.addEventListener("dispose",Q),E.__depthDisposeCallback=Q}E.__boundDepthTexture=J}if(D.depthTexture&&!E.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");let J=D.texture.mipmaps;J&&J.length>0?Le(E.__webglFramebuffer[0],D):Le(E.__webglFramebuffer,D)}else if(H){E.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[J]),E.__webglDepthbuffer[J]===void 0)E.__webglDepthbuffer[J]=i.createRenderbuffer(),ze(E.__webglDepthbuffer[J],D,!1);else{let Q=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=E.__webglDepthbuffer[J];i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,$)}}else{let J=D.texture.mipmaps;if(J&&J.length>0?t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=i.createRenderbuffer(),ze(E.__webglDepthbuffer,D,!1);else{let Q=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=E.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,$)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Jt(D,E,H){let J=n.get(D);E!==void 0&&ve(J.__webglFramebuffer,D,D.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&et(D)}function U(D){let E=D.texture,H=n.get(D),J=n.get(E);D.addEventListener("dispose",A);let Q=D.textures,$=D.isWebGLCubeRenderTarget===!0,Pe=Q.length>1;if(Pe||(J.__webglTexture===void 0&&(J.__webglTexture=i.createTexture()),J.__version=E.version,a.memory.textures++),$){H.__webglFramebuffer=[];for(let oe=0;oe<6;oe++)if(E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer[oe]=[];for(let Te=0;Te<E.mipmaps.length;Te++)H.__webglFramebuffer[oe][Te]=i.createFramebuffer()}else H.__webglFramebuffer[oe]=i.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer=[];for(let oe=0;oe<E.mipmaps.length;oe++)H.__webglFramebuffer[oe]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(Pe)for(let oe=0,Te=Q.length;oe<Te;oe++){let Re=n.get(Q[oe]);Re.__webglTexture===void 0&&(Re.__webglTexture=i.createTexture(),a.memory.textures++)}if(D.samples>0&&we(D)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let oe=0;oe<Q.length;oe++){let Te=Q[oe];H.__webglColorRenderbuffer[oe]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[oe]);let Re=r.convert(Te.format,Te.colorSpace),se=r.convert(Te.type),ge=M(Te.internalFormat,Re,se,Te.colorSpace,D.isXRRenderTarget===!0),Oe=St(D);i.renderbufferStorageMultisample(i.RENDERBUFFER,Oe,ge,D.width,D.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+oe,i.RENDERBUFFER,H.__webglColorRenderbuffer[oe])}i.bindRenderbuffer(i.RENDERBUFFER,null),D.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),ze(H.__webglDepthRenderbuffer,D,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if($){t.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture),Ke(i.TEXTURE_CUBE_MAP,E);for(let oe=0;oe<6;oe++)if(E.mipmaps&&E.mipmaps.length>0)for(let Te=0;Te<E.mipmaps.length;Te++)ve(H.__webglFramebuffer[oe][Te],D,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Te);else ve(H.__webglFramebuffer[oe],D,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0);g(E)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Pe){for(let oe=0,Te=Q.length;oe<Te;oe++){let Re=Q[oe],se=n.get(Re),ge=i.TEXTURE_2D;(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(ge=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ge,se.__webglTexture),Ke(ge,Re),ve(H.__webglFramebuffer,D,Re,i.COLOR_ATTACHMENT0+oe,ge,0),g(Re)&&p(ge)}t.unbindTexture()}else{let oe=i.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(oe=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(oe,J.__webglTexture),Ke(oe,E),E.mipmaps&&E.mipmaps.length>0)for(let Te=0;Te<E.mipmaps.length;Te++)ve(H.__webglFramebuffer[Te],D,E,i.COLOR_ATTACHMENT0,oe,Te);else ve(H.__webglFramebuffer,D,E,i.COLOR_ATTACHMENT0,oe,0);g(E)&&p(oe),t.unbindTexture()}D.depthBuffer&&et(D)}function Mt(D){let E=D.textures;for(let H=0,J=E.length;H<J;H++){let Q=E[H];if(g(Q)){let $=b(D),Pe=n.get(Q).__webglTexture;t.bindTexture($,Pe),p($),t.unbindTexture()}}}let Ve=[],Be=[];function Ee(D){if(D.samples>0){if(we(D)===!1){let E=D.textures,H=D.width,J=D.height,Q=i.COLOR_BUFFER_BIT,$=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Pe=n.get(D),oe=E.length>1;if(oe)for(let Re=0;Re<E.length;Re++)t.bindFramebuffer(i.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Pe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer);let Te=D.texture.mipmaps;Te&&Te.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Pe.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Pe.__webglFramebuffer);for(let Re=0;Re<E.length;Re++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),oe){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Pe.__webglColorRenderbuffer[Re]);let se=n.get(E[Re]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,se,0)}i.blitFramebuffer(0,0,H,J,0,0,H,J,Q,i.NEAREST),c===!0&&(Ve.length=0,Be.length=0,Ve.push(i.COLOR_ATTACHMENT0+Re),D.depthBuffer&&D.resolveDepthBuffer===!1&&(Ve.push($),Be.push($),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Be)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ve))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),oe)for(let Re=0;Re<E.length;Re++){t.bindFramebuffer(i.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.RENDERBUFFER,Pe.__webglColorRenderbuffer[Re]);let se=n.get(E[Re]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Pe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.TEXTURE_2D,se,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&c){let E=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[E])}}}function St(D){return Math.min(s.maxSamples,D.samples)}function we(D){let E=n.get(D);return D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function qe(D){let E=a.render.frame;h.get(D)!==E&&(h.set(D,E),D.update())}function Wt(D,E){let H=D.colorSpace,J=D.format,Q=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||H!==Qi&&H!==Hn&&(tt.getTransfer(H)===ot?(J!==Tn||Q!==kn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),E}function Lt(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(l.width=D.naturalWidth||D.width,l.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(l.width=D.displayWidth,l.height=D.displayHeight):(l.width=D.width,l.height=D.height),l}this.allocateTextureUnit=O,this.resetTextureUnits=L,this.setTexture2D=G,this.setTexture2DArray=X,this.setTexture3D=te,this.setTextureCube=q,this.rebindTextures=Jt,this.setupRenderTarget=U,this.updateRenderTargetMipmap=Mt,this.updateMultisampleRenderTarget=Ee,this.setupDepthRenderbuffer=et,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=we}function Mv(i,e){function t(n,s=Hn){let r,a=tt.getTransfer(s);if(n===kn)return i.UNSIGNED_BYTE;if(n===gl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===xl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ch)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ih)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Ah)return i.BYTE;if(n===Rh)return i.SHORT;if(n===hr)return i.UNSIGNED_SHORT;if(n===ml)return i.INT;if(n===Oi)return i.UNSIGNED_INT;if(n===zn)return i.FLOAT;if(n===ur)return i.HALF_FLOAT;if(n===Ph)return i.ALPHA;if(n===Lh)return i.RGB;if(n===Tn)return i.RGBA;if(n===Js)return i.DEPTH_COMPONENT;if(n===fr)return i.DEPTH_STENCIL;if(n===yl)return i.RED;if(n===_l)return i.RED_INTEGER;if(n===Dh)return i.RG;if(n===vl)return i.RG_INTEGER;if(n===bl)return i.RGBA_INTEGER;if(n===wa||n===Ta||n===Aa||n===Ra)if(a===ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===wa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ta)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Aa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ra)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===wa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ta)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Aa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ra)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ml||n===Sl||n===El||n===wl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ml)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Sl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===El)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===wl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Tl||n===Al||n===Rl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Tl||n===Al)return a===ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Rl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Cl||n===Il||n===Pl||n===Ll||n===Dl||n===Ul||n===Nl||n===Fl||n===Ol||n===Bl||n===kl||n===zl||n===Hl||n===Gl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Cl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Il)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Pl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ll)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Dl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ul)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Nl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Fl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ol)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Bl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===kl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===zl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Hl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Gl)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Vl||n===Wl||n===Xl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Vl)return a===ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Wl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Xl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ql||n===$l||n===Yl||n===Zl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===ql)return r.COMPRESSED_RED_RGTC1_EXT;if(n===$l)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Yl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Zl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===dr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var Sv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ev=`
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

}`,nu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new ca(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new On({vertexShader:Sv,fragmentShader:Ev,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Me(new Ot(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},iu=class extends di{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,f=null,d=null,m=null,x=typeof XRWebGLBinding<"u",g=new nu,p={},b=t.getContextAttributes(),M=null,_=null,P=[],S=[],A=new ue,R=null,y=new Qt;y.viewport=new Rt;let v=new Qt;v.viewport=new Rt;let C=[y,v],L=new il,O=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let ee=P[K];return ee===void 0&&(ee=new er,P[K]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(K){let ee=P[K];return ee===void 0&&(ee=new er,P[K]=ee),ee.getGripSpace()},this.getHand=function(K){let ee=P[K];return ee===void 0&&(ee=new er,P[K]=ee),ee.getHandSpace()};function G(K){let ee=S.indexOf(K.inputSource);if(ee===-1)return;let ve=P[ee];ve!==void 0&&(ve.update(K.inputSource,K.frame,l||a),ve.dispatchEvent({type:K.type,data:K.inputSource}))}function X(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",te);for(let K=0;K<P.length;K++){let ee=S[K];ee!==null&&(S[K]=null,P[K].disconnect(ee))}O=null,z=null,g.reset();for(let K in p)delete p[K];e.setRenderTarget(M),d=null,f=null,u=null,s=null,_=null,st.stop(),n.isPresenting=!1,e.setPixelRatio(R),e.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(K){l=K},this.getBaseLayer=function(){return f!==null?f:d},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(M=e.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",X),s.addEventListener("inputsourceschange",te),b.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(A),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let ve=null,ze=null,Le=null;b.depth&&(Le=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ve=b.stencil?fr:Js,ze=b.stencil?dr:Oi);let et={colorFormat:t.RGBA8,depthFormat:Le,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(et),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),_=new qn(f.textureWidth,f.textureHeight,{format:Tn,type:kn,depthTexture:new la(f.textureWidth,f.textureHeight,ze,void 0,void 0,void 0,void 0,void 0,void 0,ve),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let ve={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,ve),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),_=new qn(d.framebufferWidth,d.framebufferHeight,{format:Tn,type:kn,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),st.setContext(s),st.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function te(K){for(let ee=0;ee<K.removed.length;ee++){let ve=K.removed[ee],ze=S.indexOf(ve);ze>=0&&(S[ze]=null,P[ze].disconnect(ve))}for(let ee=0;ee<K.added.length;ee++){let ve=K.added[ee],ze=S.indexOf(ve);if(ze===-1){for(let et=0;et<P.length;et++)if(et>=S.length){S.push(ve),ze=et;break}else if(S[et]===null){S[et]=ve,ze=et;break}if(ze===-1)break}let Le=P[ze];Le&&Le.connect(ve)}}let q=new N,he=new N;function pe(K,ee,ve){q.setFromMatrixPosition(ee.matrixWorld),he.setFromMatrixPosition(ve.matrixWorld);let ze=q.distanceTo(he),Le=ee.projectionMatrix.elements,et=ve.projectionMatrix.elements,Jt=Le[14]/(Le[10]-1),U=Le[14]/(Le[10]+1),Mt=(Le[9]+1)/Le[5],Ve=(Le[9]-1)/Le[5],Be=(Le[8]-1)/Le[0],Ee=(et[8]+1)/et[0],St=Jt*Be,we=Jt*Ee,qe=ze/(-Be+Ee),Wt=qe*-Be;if(ee.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(Wt),K.translateZ(qe),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),Le[10]===-1)K.projectionMatrix.copy(ee.projectionMatrix),K.projectionMatrixInverse.copy(ee.projectionMatrixInverse);else{let Lt=Jt+qe,D=U+qe,E=St-Wt,H=we+(ze-Wt),J=Mt*U/D*Lt,Q=Ve*U/D*Lt;K.projectionMatrix.makePerspective(E,H,J,Q,Lt,D),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function Ie(K,ee){ee===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(ee.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let ee=K.near,ve=K.far;g.texture!==null&&(g.depthNear>0&&(ee=g.depthNear),g.depthFar>0&&(ve=g.depthFar)),L.near=v.near=y.near=ee,L.far=v.far=y.far=ve,(O!==L.near||z!==L.far)&&(s.updateRenderState({depthNear:L.near,depthFar:L.far}),O=L.near,z=L.far),L.layers.mask=K.layers.mask|6,y.layers.mask=L.layers.mask&3,v.layers.mask=L.layers.mask&5;let ze=K.parent,Le=L.cameras;Ie(L,ze);for(let et=0;et<Le.length;et++)Ie(Le[et],ze);Le.length===2?pe(L,y,v):L.projectionMatrix.copy(y.projectionMatrix),Ke(K,L,ze)};function Ke(K,ee,ve){ve===null?K.matrix.copy(ee.matrixWorld):(K.matrix.copy(ve.matrixWorld),K.matrix.invert(),K.matrix.multiply(ee.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(ee.projectionMatrix),K.projectionMatrixInverse.copy(ee.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Ks*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(f===null&&d===null))return c},this.setFoveation=function(K){c=K,f!==null&&(f.fixedFoveation=K),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=K)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(L)},this.getCameraTexture=function(K){return p[K]};let mt=null;function bt(K,ee){if(h=ee.getViewerPose(l||a),m=ee,h!==null){let ve=h.views;d!==null&&(e.setRenderTargetFramebuffer(_,d.framebuffer),e.setRenderTarget(_));let ze=!1;ve.length!==L.cameras.length&&(L.cameras.length=0,ze=!0);for(let U=0;U<ve.length;U++){let Mt=ve[U],Ve=null;if(d!==null)Ve=d.getViewport(Mt);else{let Ee=u.getViewSubImage(f,Mt);Ve=Ee.viewport,U===0&&(e.setRenderTargetTextures(_,Ee.colorTexture,Ee.depthStencilTexture),e.setRenderTarget(_))}let Be=C[U];Be===void 0&&(Be=new Qt,Be.layers.enable(U),Be.viewport=new Rt,C[U]=Be),Be.matrix.fromArray(Mt.transform.matrix),Be.matrix.decompose(Be.position,Be.quaternion,Be.scale),Be.projectionMatrix.fromArray(Mt.projectionMatrix),Be.projectionMatrixInverse.copy(Be.projectionMatrix).invert(),Be.viewport.set(Ve.x,Ve.y,Ve.width,Ve.height),U===0&&(L.matrix.copy(Be.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),ze===!0&&L.cameras.push(Be)}let Le=s.enabledFeatures;if(Le&&Le.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=n.getBinding();let U=u.getDepthInformation(ve[0]);U&&U.isValid&&U.texture&&g.init(U,s.renderState)}if(Le&&Le.includes("camera-access")&&x){e.state.unbindTexture(),u=n.getBinding();for(let U=0;U<ve.length;U++){let Mt=ve[U].camera;if(Mt){let Ve=p[Mt];Ve||(Ve=new ca,p[Mt]=Ve);let Be=u.getCameraImage(Mt);Ve.sourceTexture=Be}}}}for(let ve=0;ve<P.length;ve++){let ze=S[ve],Le=P[ve];ze!==null&&Le!==void 0&&Le.update(ze,ee,l||a)}mt&&mt(K,ee),ee.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ee}),m=null}let st=new ip;st.setAnimationLoop(bt),this.setAnimationLoop=function(K){mt=K},this.dispose=function(){}}},cs=new Fn,wv=new dt;function Tv(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,kh(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,b,M,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p)):p.isMeshStandardMaterial?(r(g,p),f(g,p),p.isMeshPhysicalMaterial&&d(g,p,_)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),x(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?c(g,p,b,M):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===zt&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===zt&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let b=e.get(p),M=b.envMap,_=b.envMapRotation;M&&(g.envMap.value=M,cs.copy(_),cs.x*=-1,cs.y*=-1,cs.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(cs.y*=-1,cs.z*=-1),g.envMapRotation.value.setFromMatrix4(wv.makeRotationFromEuler(cs)),g.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,b,M){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*b,g.scale.value=M*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function f(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p,b){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===zt&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=b.texture,g.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){let b=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(b.matrixWorld),g.nearDistance.value=b.shadow.camera.near,g.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Av(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(b,M){let _=M.program;n.uniformBlockBinding(b,_)}function l(b,M){let _=s[b.id];_===void 0&&(m(b),_=h(b),s[b.id]=_,b.addEventListener("dispose",g));let P=M.program;n.updateUBOMapping(b,P);let S=e.render.frame;r[b.id]!==S&&(f(b),r[b.id]=S)}function h(b){let M=u();b.__bindingPointIndex=M;let _=i.createBuffer(),P=b.__size,S=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,P,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,_),_}function u(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(b){let M=s[b.id],_=b.uniforms,P=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let S=0,A=_.length;S<A;S++){let R=Array.isArray(_[S])?_[S]:[_[S]];for(let y=0,v=R.length;y<v;y++){let C=R[y];if(d(C,S,y,P)===!0){let L=C.__offset,O=Array.isArray(C.value)?C.value:[C.value],z=0;for(let G=0;G<O.length;G++){let X=O[G],te=x(X);typeof X=="number"||typeof X=="boolean"?(C.__data[0]=X,i.bufferSubData(i.UNIFORM_BUFFER,L+z,C.__data)):X.isMatrix3?(C.__data[0]=X.elements[0],C.__data[1]=X.elements[1],C.__data[2]=X.elements[2],C.__data[3]=0,C.__data[4]=X.elements[3],C.__data[5]=X.elements[4],C.__data[6]=X.elements[5],C.__data[7]=0,C.__data[8]=X.elements[6],C.__data[9]=X.elements[7],C.__data[10]=X.elements[8],C.__data[11]=0):(X.toArray(C.__data,z),z+=te.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,L,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(b,M,_,P){let S=b.value,A=M+"_"+_;if(P[A]===void 0)return typeof S=="number"||typeof S=="boolean"?P[A]=S:P[A]=S.clone(),!0;{let R=P[A];if(typeof S=="number"||typeof S=="boolean"){if(R!==S)return P[A]=S,!0}else if(R.equals(S)===!1)return R.copy(S),!0}return!1}function m(b){let M=b.uniforms,_=0,P=16;for(let A=0,R=M.length;A<R;A++){let y=Array.isArray(M[A])?M[A]:[M[A]];for(let v=0,C=y.length;v<C;v++){let L=y[v],O=Array.isArray(L.value)?L.value:[L.value];for(let z=0,G=O.length;z<G;z++){let X=O[z],te=x(X),q=_%P,he=q%te.boundary,pe=q+he;_+=he,pe!==0&&P-pe<te.storage&&(_+=P-pe),L.__data=new Float32Array(te.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=_,_+=te.storage}}}let S=_%P;return S>0&&(_+=P-S),b.__size=_,b.__cache={},this}function x(b){let M={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(M.boundary=4,M.storage=4):b.isVector2?(M.boundary=8,M.storage=8):b.isVector3||b.isColor?(M.boundary=16,M.storage=12):b.isVector4?(M.boundary=16,M.storage=16):b.isMatrix3?(M.boundary=48,M.storage=48):b.isMatrix4?(M.boundary=64,M.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),M}function g(b){let M=b.target;M.removeEventListener("dispose",g);let _=a.indexOf(M.__bindingPointIndex);a.splice(_,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function p(){for(let b in s)i.deleteBuffer(s[b]);a=[],s={},r={}}return{bind:c,update:l,dispose:p}}var ec=class{constructor(e={}){let{canvas:t=Ef(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=a;let m=new Uint32Array(4),x=new Int32Array(4),g=null,p=null,b=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=bi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let _=this,P=!1;this._outputColorSpace=Ft;let S=0,A=0,R=null,y=-1,v=null,C=new Rt,L=new Rt,O=null,z=new Ae(0),G=0,X=t.width,te=t.height,q=1,he=null,pe=null,Ie=new Rt(0,0,X,te),Ke=new Rt(0,0,X,te),mt=!1,bt=new ir,st=!1,K=!1,ee=new dt,ve=new N,ze=new Rt,Le={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},et=!1;function Jt(){return R===null?q:1}let U=n;function Mt(T,B){return t.getContext(T,B)}try{let T={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",ce,!1),t.addEventListener("webglcontextrestored",ye,!1),t.addEventListener("webglcontextcreationerror",ne,!1),U===null){let B="webgl2";if(U=Mt(B,T),U===null)throw Mt(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Ve,Be,Ee,St,we,qe,Wt,Lt,D,E,H,J,Q,$,Pe,oe,Te,Re,se,ge,Oe,Ce,fe,Xe;function F(){Ve=new Xy(U),Ve.init(),Ce=new Mv(U,Ve),Be=new By(U,Ve,e,Ce),Ee=new vv(U,Ve),Be.reversedDepthBuffer&&f&&Ee.buffers.depth.setReversed(!0),St=new Yy(U),we=new ov,qe=new bv(U,Ve,Ee,we,Be,Ce,St),Wt=new zy(_),Lt=new Wy(_),D=new e0(U),fe=new Fy(U,D),E=new qy(U,D,St,fe),H=new Jy(U,E,D,St),se=new Zy(U,Be,qe),oe=new ky(we),J=new av(_,Wt,Lt,Ve,Be,fe,oe),Q=new Tv(_,we),$=new cv,Pe=new mv(Ve),Re=new Ny(_,Wt,Lt,Ee,H,d,c),Te=new yv(_,H,Be),Xe=new Av(U,St,Be,Ee),ge=new Oy(U,Ve,St),Oe=new $y(U,Ve,St),St.programs=J.programs,_.capabilities=Be,_.extensions=Ve,_.properties=we,_.renderLists=$,_.shadowMap=Te,_.state=Ee,_.info=St}F();let re=new iu(_,U);this.xr=re,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let T=Ve.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=Ve.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(T){T!==void 0&&(q=T,this.setSize(X,te,!1))},this.getSize=function(T){return T.set(X,te)},this.setSize=function(T,B,V=!0){if(re.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}X=T,te=B,t.width=Math.floor(T*q),t.height=Math.floor(B*q),V===!0&&(t.style.width=T+"px",t.style.height=B+"px"),this.setViewport(0,0,T,B)},this.getDrawingBufferSize=function(T){return T.set(X*q,te*q).floor()},this.setDrawingBufferSize=function(T,B,V){X=T,te=B,q=V,t.width=Math.floor(T*V),t.height=Math.floor(B*V),this.setViewport(0,0,T,B)},this.getCurrentViewport=function(T){return T.copy(C)},this.getViewport=function(T){return T.copy(Ie)},this.setViewport=function(T,B,V,W){T.isVector4?Ie.set(T.x,T.y,T.z,T.w):Ie.set(T,B,V,W),Ee.viewport(C.copy(Ie).multiplyScalar(q).round())},this.getScissor=function(T){return T.copy(Ke)},this.setScissor=function(T,B,V,W){T.isVector4?Ke.set(T.x,T.y,T.z,T.w):Ke.set(T,B,V,W),Ee.scissor(L.copy(Ke).multiplyScalar(q).round())},this.getScissorTest=function(){return mt},this.setScissorTest=function(T){Ee.setScissorTest(mt=T)},this.setOpaqueSort=function(T){he=T},this.setTransparentSort=function(T){pe=T},this.getClearColor=function(T){return T.copy(Re.getClearColor())},this.setClearColor=function(){Re.setClearColor(...arguments)},this.getClearAlpha=function(){return Re.getClearAlpha()},this.setClearAlpha=function(){Re.setClearAlpha(...arguments)},this.clear=function(T=!0,B=!0,V=!0){let W=0;if(T){let k=!1;if(R!==null){let ie=R.texture.format;k=ie===bl||ie===vl||ie===_l}if(k){let ie=R.texture.type,me=ie===kn||ie===Oi||ie===hr||ie===dr||ie===gl||ie===xl,be=Re.getClearColor(),xe=Re.getClearAlpha(),Fe=be.r,ke=be.g,Ue=be.b;me?(m[0]=Fe,m[1]=ke,m[2]=Ue,m[3]=xe,U.clearBufferuiv(U.COLOR,0,m)):(x[0]=Fe,x[1]=ke,x[2]=Ue,x[3]=xe,U.clearBufferiv(U.COLOR,0,x))}else W|=U.COLOR_BUFFER_BIT}B&&(W|=U.DEPTH_BUFFER_BIT),V&&(W|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ce,!1),t.removeEventListener("webglcontextrestored",ye,!1),t.removeEventListener("webglcontextcreationerror",ne,!1),Re.dispose(),$.dispose(),Pe.dispose(),we.dispose(),Wt.dispose(),Lt.dispose(),H.dispose(),fe.dispose(),Xe.dispose(),J.dispose(),re.dispose(),re.removeEventListener("sessionstart",Vn),re.removeEventListener("sessionend",Uu),Gi.stop()};function ce(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function ye(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;let T=St.autoReset,B=Te.enabled,V=Te.autoUpdate,W=Te.needsUpdate,k=Te.type;F(),St.autoReset=T,Te.enabled=B,Te.autoUpdate=V,Te.needsUpdate=W,Te.type=k}function ne(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function j(T){let B=T.target;B.removeEventListener("dispose",j),Se(B)}function Se(T){Ge(T),we.remove(T)}function Ge(T){let B=we.get(T).programs;B!==void 0&&(B.forEach(function(V){J.releaseProgram(V)}),T.isShaderMaterial&&J.releaseShaderCache(T))}this.renderBufferDirect=function(T,B,V,W,k,ie){B===null&&(B=Le);let me=k.isMesh&&k.matrixWorld.determinant()<0,be=pm(T,B,V,W,k);Ee.setMaterial(W,me);let xe=V.index,Fe=1;if(W.wireframe===!0){if(xe=E.getWireframeAttribute(V),xe===void 0)return;Fe=2}let ke=V.drawRange,Ue=V.attributes.position,je=ke.start*Fe,lt=(ke.start+ke.count)*Fe;ie!==null&&(je=Math.max(je,ie.start*Fe),lt=Math.min(lt,(ie.start+ie.count)*Fe)),xe!==null?(je=Math.max(je,0),lt=Math.min(lt,xe.count)):Ue!=null&&(je=Math.max(je,0),lt=Math.min(lt,Ue.count));let Pt=lt-je;if(Pt<0||Pt===1/0)return;fe.setup(k,W,be,V,xe);let _t,ut=ge;if(xe!==null&&(_t=D.get(xe),ut=Oe,ut.setIndex(_t)),k.isMesh)W.wireframe===!0?(Ee.setLineWidth(W.wireframeLinewidth*Jt()),ut.setMode(U.LINES)):ut.setMode(U.TRIANGLES);else if(k.isLine){let Ne=W.linewidth;Ne===void 0&&(Ne=1),Ee.setLineWidth(Ne*Jt()),k.isLineSegments?ut.setMode(U.LINES):k.isLineLoop?ut.setMode(U.LINE_LOOP):ut.setMode(U.LINE_STRIP)}else k.isPoints?ut.setMode(U.POINTS):k.isSprite&&ut.setMode(U.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)js("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ut.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(Ve.get("WEBGL_multi_draw"))ut.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{let Ne=k._multiDrawStarts,wt=k._multiDrawCounts,it=k._multiDrawCount,dn=xe?D.get(xe).bytesPerElement:1,Cs=we.get(W).currentProgram.getUniforms();for(let fn=0;fn<it;fn++)Cs.setValue(U,"_gl_DrawID",fn),ut.render(Ne[fn]/dn,wt[fn])}else if(k.isInstancedMesh)ut.renderInstances(je,Pt,k.count);else if(V.isInstancedBufferGeometry){let Ne=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,wt=Math.min(V.instanceCount,Ne);ut.renderInstances(je,Pt,wt)}else ut.render(je,Pt)};function gt(T,B,V){T.transparent===!0&&T.side===cn&&T.forceSinglePass===!1?(T.side=zt,T.needsUpdate=!0,qa(T,B,V),T.side=ui,T.needsUpdate=!0,qa(T,B,V),T.side=cn):qa(T,B,V)}this.compile=function(T,B,V=null){V===null&&(V=T),p=Pe.get(V),p.init(B),M.push(p),V.traverseVisible(function(k){k.isLight&&k.layers.test(B.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),T!==V&&T.traverseVisible(function(k){k.isLight&&k.layers.test(B.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),p.setupLights();let W=new Set;return T.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;let ie=k.material;if(ie)if(Array.isArray(ie))for(let me=0;me<ie.length;me++){let be=ie[me];gt(be,V,k),W.add(be)}else gt(ie,V,k),W.add(ie)}),p=M.pop(),W},this.compileAsync=function(T,B,V=null){let W=this.compile(T,B,V);return new Promise(k=>{function ie(){if(W.forEach(function(me){we.get(me).currentProgram.isReady()&&W.delete(me)}),W.size===0){k(T);return}setTimeout(ie,10)}Ve.get("KHR_parallel_shader_compile")!==null?ie():setTimeout(ie,10)})};let rt=null;function ii(T){rt&&rt(T)}function Vn(){Gi.stop()}function Uu(){Gi.start()}let Gi=new ip;Gi.setAnimationLoop(ii),typeof self<"u"&&Gi.setContext(self),this.setAnimationLoop=function(T){rt=T,re.setAnimationLoop(T),T===null?Gi.stop():Gi.start()},re.addEventListener("sessionstart",Vn),re.addEventListener("sessionend",Uu),this.render=function(T,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),re.enabled===!0&&re.isPresenting===!0&&(re.cameraAutoUpdate===!0&&re.updateCamera(B),B=re.getCamera()),T.isScene===!0&&T.onBeforeRender(_,T,B,R),p=Pe.get(T,M.length),p.init(B),M.push(p),ee.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),bt.setFromProjectionMatrix(ee,Un,B.reversedDepth),K=this.localClippingEnabled,st=oe.init(this.clippingPlanes,K),g=$.get(T,b.length),g.init(),b.push(g),re.enabled===!0&&re.isPresenting===!0){let ie=_.xr.getDepthSensingMesh();ie!==null&&Ic(ie,B,-1/0,_.sortObjects)}Ic(T,B,0,_.sortObjects),g.finish(),_.sortObjects===!0&&g.sort(he,pe),et=re.enabled===!1||re.isPresenting===!1||re.hasDepthSensing()===!1,et&&Re.addToRenderList(g,T),this.info.render.frame++,st===!0&&oe.beginShadows();let V=p.state.shadowsArray;Te.render(V,T,B),st===!0&&oe.endShadows(),this.info.autoReset===!0&&this.info.reset();let W=g.opaque,k=g.transmissive;if(p.setupLights(),B.isArrayCamera){let ie=B.cameras;if(k.length>0)for(let me=0,be=ie.length;me<be;me++){let xe=ie[me];Fu(W,k,T,xe)}et&&Re.render(T);for(let me=0,be=ie.length;me<be;me++){let xe=ie[me];Nu(g,T,xe,xe.viewport)}}else k.length>0&&Fu(W,k,T,B),et&&Re.render(T),Nu(g,T,B);R!==null&&A===0&&(qe.updateMultisampleRenderTarget(R),qe.updateRenderTargetMipmap(R)),T.isScene===!0&&T.onAfterRender(_,T,B),fe.resetDefaultState(),y=-1,v=null,M.pop(),M.length>0?(p=M[M.length-1],st===!0&&oe.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,b.pop(),b.length>0?g=b[b.length-1]:g=null};function Ic(T,B,V,W){if(T.visible===!1)return;if(T.layers.test(B.layers)){if(T.isGroup)V=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(B);else if(T.isLight)p.pushLight(T),T.castShadow&&p.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||bt.intersectsSprite(T)){W&&ze.setFromMatrixPosition(T.matrixWorld).applyMatrix4(ee);let me=H.update(T),be=T.material;be.visible&&g.push(T,me,be,V,ze.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||bt.intersectsObject(T))){let me=H.update(T),be=T.material;if(W&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),ze.copy(T.boundingSphere.center)):(me.boundingSphere===null&&me.computeBoundingSphere(),ze.copy(me.boundingSphere.center)),ze.applyMatrix4(T.matrixWorld).applyMatrix4(ee)),Array.isArray(be)){let xe=me.groups;for(let Fe=0,ke=xe.length;Fe<ke;Fe++){let Ue=xe[Fe],je=be[Ue.materialIndex];je&&je.visible&&g.push(T,me,je,V,ze.z,Ue)}}else be.visible&&g.push(T,me,be,V,ze.z,null)}}let ie=T.children;for(let me=0,be=ie.length;me<be;me++)Ic(ie[me],B,V,W)}function Nu(T,B,V,W){let k=T.opaque,ie=T.transmissive,me=T.transparent;p.setupLightsView(V),st===!0&&oe.setGlobalState(_.clippingPlanes,V),W&&Ee.viewport(C.copy(W)),k.length>0&&Xa(k,B,V),ie.length>0&&Xa(ie,B,V),me.length>0&&Xa(me,B,V),Ee.buffers.depth.setTest(!0),Ee.buffers.depth.setMask(!0),Ee.buffers.color.setMask(!0),Ee.setPolygonOffset(!1)}function Fu(T,B,V,W){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[W.id]===void 0&&(p.state.transmissionRenderTarget[W.id]=new qn(1,1,{generateMipmaps:!0,type:Ve.has("EXT_color_buffer_half_float")||Ve.has("EXT_color_buffer_float")?ur:kn,minFilter:Fi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));let ie=p.state.transmissionRenderTarget[W.id],me=W.viewport||C;ie.setSize(me.z*_.transmissionResolutionScale,me.w*_.transmissionResolutionScale);let be=_.getRenderTarget(),xe=_.getActiveCubeFace(),Fe=_.getActiveMipmapLevel();_.setRenderTarget(ie),_.getClearColor(z),G=_.getClearAlpha(),G<1&&_.setClearColor(16777215,.5),_.clear(),et&&Re.render(V);let ke=_.toneMapping;_.toneMapping=bi;let Ue=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),p.setupLightsView(W),st===!0&&oe.setGlobalState(_.clippingPlanes,W),Xa(T,V,W),qe.updateMultisampleRenderTarget(ie),qe.updateRenderTargetMipmap(ie),Ve.has("WEBGL_multisampled_render_to_texture")===!1){let je=!1;for(let lt=0,Pt=B.length;lt<Pt;lt++){let _t=B[lt],ut=_t.object,Ne=_t.geometry,wt=_t.material,it=_t.group;if(wt.side===cn&&ut.layers.test(W.layers)){let dn=wt.side;wt.side=zt,wt.needsUpdate=!0,Ou(ut,V,W,Ne,wt,it),wt.side=dn,wt.needsUpdate=!0,je=!0}}je===!0&&(qe.updateMultisampleRenderTarget(ie),qe.updateRenderTargetMipmap(ie))}_.setRenderTarget(be,xe,Fe),_.setClearColor(z,G),Ue!==void 0&&(W.viewport=Ue),_.toneMapping=ke}function Xa(T,B,V){let W=B.isScene===!0?B.overrideMaterial:null;for(let k=0,ie=T.length;k<ie;k++){let me=T[k],be=me.object,xe=me.geometry,Fe=me.group,ke=me.material;ke.allowOverride===!0&&W!==null&&(ke=W),be.layers.test(V.layers)&&Ou(be,B,V,xe,ke,Fe)}}function Ou(T,B,V,W,k,ie){T.onBeforeRender(_,B,V,W,k,ie),T.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),k.onBeforeRender(_,B,V,W,T,ie),k.transparent===!0&&k.side===cn&&k.forceSinglePass===!1?(k.side=zt,k.needsUpdate=!0,_.renderBufferDirect(V,B,W,k,T,ie),k.side=ui,k.needsUpdate=!0,_.renderBufferDirect(V,B,W,k,T,ie),k.side=cn):_.renderBufferDirect(V,B,W,k,T,ie),T.onAfterRender(_,B,V,W,k,ie)}function qa(T,B,V){B.isScene!==!0&&(B=Le);let W=we.get(T),k=p.state.lights,ie=p.state.shadowsArray,me=k.state.version,be=J.getParameters(T,k.state,ie,B,V),xe=J.getProgramCacheKey(be),Fe=W.programs;W.environment=T.isMeshStandardMaterial?B.environment:null,W.fog=B.fog,W.envMap=(T.isMeshStandardMaterial?Lt:Wt).get(T.envMap||W.environment),W.envMapRotation=W.environment!==null&&T.envMap===null?B.environmentRotation:T.envMapRotation,Fe===void 0&&(T.addEventListener("dispose",j),Fe=new Map,W.programs=Fe);let ke=Fe.get(xe);if(ke!==void 0){if(W.currentProgram===ke&&W.lightsStateVersion===me)return ku(T,be),ke}else be.uniforms=J.getUniforms(T),T.onBeforeCompile(be,_),ke=J.acquireProgram(be,xe),Fe.set(xe,ke),W.uniforms=be.uniforms;let Ue=W.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ue.clippingPlanes=oe.uniform),ku(T,be),W.needsLights=gm(T),W.lightsStateVersion=me,W.needsLights&&(Ue.ambientLightColor.value=k.state.ambient,Ue.lightProbe.value=k.state.probe,Ue.directionalLights.value=k.state.directional,Ue.directionalLightShadows.value=k.state.directionalShadow,Ue.spotLights.value=k.state.spot,Ue.spotLightShadows.value=k.state.spotShadow,Ue.rectAreaLights.value=k.state.rectArea,Ue.ltc_1.value=k.state.rectAreaLTC1,Ue.ltc_2.value=k.state.rectAreaLTC2,Ue.pointLights.value=k.state.point,Ue.pointLightShadows.value=k.state.pointShadow,Ue.hemisphereLights.value=k.state.hemi,Ue.directionalShadowMap.value=k.state.directionalShadowMap,Ue.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Ue.spotShadowMap.value=k.state.spotShadowMap,Ue.spotLightMatrix.value=k.state.spotLightMatrix,Ue.spotLightMap.value=k.state.spotLightMap,Ue.pointShadowMap.value=k.state.pointShadowMap,Ue.pointShadowMatrix.value=k.state.pointShadowMatrix),W.currentProgram=ke,W.uniformsList=null,ke}function Bu(T){if(T.uniformsList===null){let B=T.currentProgram.getUniforms();T.uniformsList=gr.seqWithValue(B.seq,T.uniforms)}return T.uniformsList}function ku(T,B){let V=we.get(T);V.outputColorSpace=B.outputColorSpace,V.batching=B.batching,V.batchingColor=B.batchingColor,V.instancing=B.instancing,V.instancingColor=B.instancingColor,V.instancingMorph=B.instancingMorph,V.skinning=B.skinning,V.morphTargets=B.morphTargets,V.morphNormals=B.morphNormals,V.morphColors=B.morphColors,V.morphTargetsCount=B.morphTargetsCount,V.numClippingPlanes=B.numClippingPlanes,V.numIntersection=B.numClipIntersection,V.vertexAlphas=B.vertexAlphas,V.vertexTangents=B.vertexTangents,V.toneMapping=B.toneMapping}function pm(T,B,V,W,k){B.isScene!==!0&&(B=Le),qe.resetTextureUnits();let ie=B.fog,me=W.isMeshStandardMaterial?B.environment:null,be=R===null?_.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Qi,xe=(W.isMeshStandardMaterial?Lt:Wt).get(W.envMap||me),Fe=W.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,ke=!!V.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ue=!!V.morphAttributes.position,je=!!V.morphAttributes.normal,lt=!!V.morphAttributes.color,Pt=bi;W.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(Pt=_.toneMapping);let _t=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,ut=_t!==void 0?_t.length:0,Ne=we.get(W),wt=p.state.lights;if(st===!0&&(K===!0||T!==v)){let tn=T===v&&W.id===y;oe.setState(W,T,tn)}let it=!1;W.version===Ne.__version?(Ne.needsLights&&Ne.lightsStateVersion!==wt.state.version||Ne.outputColorSpace!==be||k.isBatchedMesh&&Ne.batching===!1||!k.isBatchedMesh&&Ne.batching===!0||k.isBatchedMesh&&Ne.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Ne.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Ne.instancing===!1||!k.isInstancedMesh&&Ne.instancing===!0||k.isSkinnedMesh&&Ne.skinning===!1||!k.isSkinnedMesh&&Ne.skinning===!0||k.isInstancedMesh&&Ne.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Ne.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Ne.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Ne.instancingMorph===!1&&k.morphTexture!==null||Ne.envMap!==xe||W.fog===!0&&Ne.fog!==ie||Ne.numClippingPlanes!==void 0&&(Ne.numClippingPlanes!==oe.numPlanes||Ne.numIntersection!==oe.numIntersection)||Ne.vertexAlphas!==Fe||Ne.vertexTangents!==ke||Ne.morphTargets!==Ue||Ne.morphNormals!==je||Ne.morphColors!==lt||Ne.toneMapping!==Pt||Ne.morphTargetsCount!==ut)&&(it=!0):(it=!0,Ne.__version=W.version);let dn=Ne.currentProgram;it===!0&&(dn=qa(W,B,k));let Cs=!1,fn=!1,Ar=!1,Tt=dn.getUniforms(),Mn=Ne.uniforms;if(Ee.useProgram(dn.program)&&(Cs=!0,fn=!0,Ar=!0),W.id!==y&&(y=W.id,fn=!0),Cs||v!==T){Ee.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),Tt.setValue(U,"projectionMatrix",T.projectionMatrix),Tt.setValue(U,"viewMatrix",T.matrixWorldInverse);let an=Tt.map.cameraPosition;an!==void 0&&an.setValue(U,ve.setFromMatrixPosition(T.matrixWorld)),Be.logarithmicDepthBuffer&&Tt.setValue(U,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&Tt.setValue(U,"isOrthographic",T.isOrthographicCamera===!0),v!==T&&(v=T,fn=!0,Ar=!0)}if(k.isSkinnedMesh){Tt.setOptional(U,k,"bindMatrix"),Tt.setOptional(U,k,"bindMatrixInverse");let tn=k.skeleton;tn&&(tn.boneTexture===null&&tn.computeBoneTexture(),Tt.setValue(U,"boneTexture",tn.boneTexture,qe))}k.isBatchedMesh&&(Tt.setOptional(U,k,"batchingTexture"),Tt.setValue(U,"batchingTexture",k._matricesTexture,qe),Tt.setOptional(U,k,"batchingIdTexture"),Tt.setValue(U,"batchingIdTexture",k._indirectTexture,qe),Tt.setOptional(U,k,"batchingColorTexture"),k._colorsTexture!==null&&Tt.setValue(U,"batchingColorTexture",k._colorsTexture,qe));let Sn=V.morphAttributes;if((Sn.position!==void 0||Sn.normal!==void 0||Sn.color!==void 0)&&se.update(k,V,dn),(fn||Ne.receiveShadow!==k.receiveShadow)&&(Ne.receiveShadow=k.receiveShadow,Tt.setValue(U,"receiveShadow",k.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(Mn.envMap.value=xe,Mn.flipEnvMap.value=xe.isCubeTexture&&xe.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&B.environment!==null&&(Mn.envMapIntensity.value=B.environmentIntensity),fn&&(Tt.setValue(U,"toneMappingExposure",_.toneMappingExposure),Ne.needsLights&&mm(Mn,Ar),ie&&W.fog===!0&&Q.refreshFogUniforms(Mn,ie),Q.refreshMaterialUniforms(Mn,W,q,te,p.state.transmissionRenderTarget[T.id]),gr.upload(U,Bu(Ne),Mn,qe)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(gr.upload(U,Bu(Ne),Mn,qe),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&Tt.setValue(U,"center",k.center),Tt.setValue(U,"modelViewMatrix",k.modelViewMatrix),Tt.setValue(U,"normalMatrix",k.normalMatrix),Tt.setValue(U,"modelMatrix",k.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){let tn=W.uniformsGroups;for(let an=0,Pc=tn.length;an<Pc;an++){let Vi=tn[an];Xe.update(Vi,dn),Xe.bind(Vi,dn)}}return dn}function mm(T,B){T.ambientLightColor.needsUpdate=B,T.lightProbe.needsUpdate=B,T.directionalLights.needsUpdate=B,T.directionalLightShadows.needsUpdate=B,T.pointLights.needsUpdate=B,T.pointLightShadows.needsUpdate=B,T.spotLights.needsUpdate=B,T.spotLightShadows.needsUpdate=B,T.rectAreaLights.needsUpdate=B,T.hemisphereLights.needsUpdate=B}function gm(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(T,B,V){let W=we.get(T);W.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),we.get(T.texture).__webglTexture=B,we.get(T.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:V,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,B){let V=we.get(T);V.__webglFramebuffer=B,V.__useDefaultFramebuffer=B===void 0};let xm=U.createFramebuffer();this.setRenderTarget=function(T,B=0,V=0){R=T,S=B,A=V;let W=!0,k=null,ie=!1,me=!1;if(T){let xe=we.get(T);if(xe.__useDefaultFramebuffer!==void 0)Ee.bindFramebuffer(U.FRAMEBUFFER,null),W=!1;else if(xe.__webglFramebuffer===void 0)qe.setupRenderTarget(T);else if(xe.__hasExternalTextures)qe.rebindTextures(T,we.get(T.texture).__webglTexture,we.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let Ue=T.depthTexture;if(xe.__boundDepthTexture!==Ue){if(Ue!==null&&we.has(Ue)&&(T.width!==Ue.image.width||T.height!==Ue.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");qe.setupDepthRenderbuffer(T)}}let Fe=T.texture;(Fe.isData3DTexture||Fe.isDataArrayTexture||Fe.isCompressedArrayTexture)&&(me=!0);let ke=we.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(ke[B])?k=ke[B][V]:k=ke[B],ie=!0):T.samples>0&&qe.useMultisampledRTT(T)===!1?k=we.get(T).__webglMultisampledFramebuffer:Array.isArray(ke)?k=ke[V]:k=ke,C.copy(T.viewport),L.copy(T.scissor),O=T.scissorTest}else C.copy(Ie).multiplyScalar(q).floor(),L.copy(Ke).multiplyScalar(q).floor(),O=mt;if(V!==0&&(k=xm),Ee.bindFramebuffer(U.FRAMEBUFFER,k)&&W&&Ee.drawBuffers(T,k),Ee.viewport(C),Ee.scissor(L),Ee.setScissorTest(O),ie){let xe=we.get(T.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+B,xe.__webglTexture,V)}else if(me){let xe=B;for(let Fe=0;Fe<T.textures.length;Fe++){let ke=we.get(T.textures[Fe]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Fe,ke.__webglTexture,V,xe)}}else if(T!==null&&V!==0){let xe=we.get(T.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,xe.__webglTexture,V)}y=-1},this.readRenderTargetPixels=function(T,B,V,W,k,ie,me,be=0){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let xe=we.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&me!==void 0&&(xe=xe[me]),xe){Ee.bindFramebuffer(U.FRAMEBUFFER,xe);try{let Fe=T.textures[be],ke=Fe.format,Ue=Fe.type;if(!Be.textureFormatReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Be.textureTypeReadable(Ue)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=T.width-W&&V>=0&&V<=T.height-k&&(T.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+be),U.readPixels(B,V,W,k,Ce.convert(ke),Ce.convert(Ue),ie))}finally{let Fe=R!==null?we.get(R).__webglFramebuffer:null;Ee.bindFramebuffer(U.FRAMEBUFFER,Fe)}}},this.readRenderTargetPixelsAsync=async function(T,B,V,W,k,ie,me,be=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let xe=we.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&me!==void 0&&(xe=xe[me]),xe)if(B>=0&&B<=T.width-W&&V>=0&&V<=T.height-k){Ee.bindFramebuffer(U.FRAMEBUFFER,xe);let Fe=T.textures[be],ke=Fe.format,Ue=Fe.type;if(!Be.textureFormatReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Be.textureTypeReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let je=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,je),U.bufferData(U.PIXEL_PACK_BUFFER,ie.byteLength,U.STREAM_READ),T.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+be),U.readPixels(B,V,W,k,Ce.convert(ke),Ce.convert(Ue),0);let lt=R!==null?we.get(R).__webglFramebuffer:null;Ee.bindFramebuffer(U.FRAMEBUFFER,lt);let Pt=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await wf(U,Pt,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,je),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,ie),U.deleteBuffer(je),U.deleteSync(Pt),ie}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,B=null,V=0){let W=Math.pow(2,-V),k=Math.floor(T.image.width*W),ie=Math.floor(T.image.height*W),me=B!==null?B.x:0,be=B!==null?B.y:0;qe.setTexture2D(T,0),U.copyTexSubImage2D(U.TEXTURE_2D,V,0,0,me,be,k,ie),Ee.unbindTexture()};let ym=U.createFramebuffer(),_m=U.createFramebuffer();this.copyTextureToTexture=function(T,B,V=null,W=null,k=0,ie=null){ie===null&&(k!==0?(js("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ie=k,k=0):ie=0);let me,be,xe,Fe,ke,Ue,je,lt,Pt,_t=T.isCompressedTexture?T.mipmaps[ie]:T.image;if(V!==null)me=V.max.x-V.min.x,be=V.max.y-V.min.y,xe=V.isBox3?V.max.z-V.min.z:1,Fe=V.min.x,ke=V.min.y,Ue=V.isBox3?V.min.z:0;else{let Sn=Math.pow(2,-k);me=Math.floor(_t.width*Sn),be=Math.floor(_t.height*Sn),T.isDataArrayTexture?xe=_t.depth:T.isData3DTexture?xe=Math.floor(_t.depth*Sn):xe=1,Fe=0,ke=0,Ue=0}W!==null?(je=W.x,lt=W.y,Pt=W.z):(je=0,lt=0,Pt=0);let ut=Ce.convert(B.format),Ne=Ce.convert(B.type),wt;B.isData3DTexture?(qe.setTexture3D(B,0),wt=U.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(qe.setTexture2DArray(B,0),wt=U.TEXTURE_2D_ARRAY):(qe.setTexture2D(B,0),wt=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,B.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,B.unpackAlignment);let it=U.getParameter(U.UNPACK_ROW_LENGTH),dn=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Cs=U.getParameter(U.UNPACK_SKIP_PIXELS),fn=U.getParameter(U.UNPACK_SKIP_ROWS),Ar=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,_t.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,_t.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Fe),U.pixelStorei(U.UNPACK_SKIP_ROWS,ke),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Ue);let Tt=T.isDataArrayTexture||T.isData3DTexture,Mn=B.isDataArrayTexture||B.isData3DTexture;if(T.isDepthTexture){let Sn=we.get(T),tn=we.get(B),an=we.get(Sn.__renderTarget),Pc=we.get(tn.__renderTarget);Ee.bindFramebuffer(U.READ_FRAMEBUFFER,an.__webglFramebuffer),Ee.bindFramebuffer(U.DRAW_FRAMEBUFFER,Pc.__webglFramebuffer);for(let Vi=0;Vi<xe;Vi++)Tt&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,we.get(T).__webglTexture,k,Ue+Vi),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,we.get(B).__webglTexture,ie,Pt+Vi)),U.blitFramebuffer(Fe,ke,me,be,je,lt,me,be,U.DEPTH_BUFFER_BIT,U.NEAREST);Ee.bindFramebuffer(U.READ_FRAMEBUFFER,null),Ee.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(k!==0||T.isRenderTargetTexture||we.has(T)){let Sn=we.get(T),tn=we.get(B);Ee.bindFramebuffer(U.READ_FRAMEBUFFER,ym),Ee.bindFramebuffer(U.DRAW_FRAMEBUFFER,_m);for(let an=0;an<xe;an++)Tt?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Sn.__webglTexture,k,Ue+an):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Sn.__webglTexture,k),Mn?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,tn.__webglTexture,ie,Pt+an):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,tn.__webglTexture,ie),k!==0?U.blitFramebuffer(Fe,ke,me,be,je,lt,me,be,U.COLOR_BUFFER_BIT,U.NEAREST):Mn?U.copyTexSubImage3D(wt,ie,je,lt,Pt+an,Fe,ke,me,be):U.copyTexSubImage2D(wt,ie,je,lt,Fe,ke,me,be);Ee.bindFramebuffer(U.READ_FRAMEBUFFER,null),Ee.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else Mn?T.isDataTexture||T.isData3DTexture?U.texSubImage3D(wt,ie,je,lt,Pt,me,be,xe,ut,Ne,_t.data):B.isCompressedArrayTexture?U.compressedTexSubImage3D(wt,ie,je,lt,Pt,me,be,xe,ut,_t.data):U.texSubImage3D(wt,ie,je,lt,Pt,me,be,xe,ut,Ne,_t):T.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,ie,je,lt,me,be,ut,Ne,_t.data):T.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,ie,je,lt,_t.width,_t.height,ut,_t.data):U.texSubImage2D(U.TEXTURE_2D,ie,je,lt,me,be,ut,Ne,_t);U.pixelStorei(U.UNPACK_ROW_LENGTH,it),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,dn),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Cs),U.pixelStorei(U.UNPACK_SKIP_ROWS,fn),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Ar),ie===0&&B.generateMipmaps&&U.generateMipmap(wt),Ee.unbindTexture()},this.initRenderTarget=function(T){we.get(T).__webglFramebuffer===void 0&&qe.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?qe.setTextureCube(T,0):T.isData3DTexture?qe.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?qe.setTexture2DArray(T,0):qe.setTexture2D(T,0),Ee.unbindTexture()},this.resetState=function(){S=0,A=0,R=null,Ee.reset(),fe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Un}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}};var Ia=new N;function An(i,e,t,n,s,r){let a=2*Math.PI*s/4,o=Math.max(r-2*s,0),c=Math.PI/4;Ia.copy(e),Ia[n]=0,Ia.normalize();let l=.5*a/(a+o),h=1-Ia.angleTo(i)/c;return Math.sign(Ia[t])===1?h*l:o/(a+o)+l+l*(1-h)}var Pa=class i extends yt{constructor(e=1,t=1,n=1,s=2,r=.1){let a=s*2+1;if(r=Math.min(e/2,t/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:n,segments:s,radius:r},a===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let c=new N,l=new N,h=new N(e,t,n).divideScalar(2).subScalar(r),u=this.attributes.position.array,f=this.attributes.normal.array,d=this.attributes.uv.array,m=u.length/6,x=new N,g=.5/a;for(let p=0,b=0;p<u.length;p+=3,b+=2)switch(c.fromArray(u,p),l.copy(c),l.x-=Math.sign(l.x)*g,l.y-=Math.sign(l.y)*g,l.z-=Math.sign(l.z)*g,l.normalize(),u[p+0]=h.x*Math.sign(c.x)+l.x*r,u[p+1]=h.y*Math.sign(c.y)+l.y*r,u[p+2]=h.z*Math.sign(c.z)+l.z*r,f[p+0]=l.x,f[p+1]=l.y,f[p+2]=l.z,Math.floor(p/m)){case 0:x.set(1,0,0),d[b+0]=An(x,l,"z","y",r,n),d[b+1]=1-An(x,l,"y","z",r,t);break;case 1:x.set(-1,0,0),d[b+0]=1-An(x,l,"z","y",r,n),d[b+1]=1-An(x,l,"y","z",r,t);break;case 2:x.set(0,1,0),d[b+0]=1-An(x,l,"x","z",r,e),d[b+1]=An(x,l,"z","x",r,n);break;case 3:x.set(0,-1,0),d[b+0]=1-An(x,l,"x","z",r,e),d[b+1]=1-An(x,l,"z","x",r,n);break;case 4:x.set(0,0,1),d[b+0]=1-An(x,l,"x","y",r,e),d[b+1]=1-An(x,l,"y","x",r,t);break;case 5:x.set(0,0,-1),d[b+0]=An(x,l,"x","y",r,e),d[b+1]=1-An(x,l,"y","x",r,t);break}}static fromJSON(e){return new i(e.width,e.height,e.depth,e.segments,e.radius)}};function nc(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,c=new Qe,l=0;for(let h=0;h<i.length;++h){let u=i[h],f=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let d in u.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(u.attributes[d]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let d in u.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(u.morphAttributes[d])}if(e){let d;if(t)d=u.index.count;else if(u.attributes.position!==void 0)d=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,d,h),l+=d}}if(t){let h=0,u=[];for(let f=0;f<i.length;++f){let d=i[f].index;for(let m=0;m<d.count;++m)u.push(d.getX(m)+h);h+=i[f].attributes.position.count}c.setIndex(u)}for(let h in r){let u=lp(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(let h in a){let u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let f=0;f<u;++f){let d=[];for(let x=0;x<a[h].length;++x)d.push(a[h][x][f]);let m=lp(d);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(m)}}return c}function lp(i){let e,t,n,s=-1,r=0;for(let l=0;l<i.length;++l){let h=i[l];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let a=new e(r),o=new Dt(a,t,n),c=0;for(let l=0;l<i.length;++l){let h=i[l];if(h.isInterleavedBufferAttribute){let u=c/t;for(let f=0,d=h.count;f<d;f++)for(let m=0;m<t;m++){let x=h.getComponent(f,m);o.setComponent(f+u,m,x)}}else a.set(h.array,c);c+=h.count*t}return s!==void 0&&(o.gpuType=s),o}var yr=(i,e,t)=>Math.max(e,Math.min(t,i));function cp(i=0,e=0){return{lane:i,velocity:0,distance:e,wheelAngle:0,lastSpeed:0,roll:0,pitch:0,steer:0,phase:0,bob:0,braking:!1}}function hp(i,e,t,n,s,r=!1){if(r||s<=0)return i;s=Math.min(s,.1);let a=24,o=i.lane-e,c=i.velocity+a*o,l=Math.exp(-a*s);i.lane=e+(o+c*s)*l,i.velocity=(i.velocity-a*c*s)*l,Math.abs(i.lane)>1&&(i.lane=yr(i.lane,-1,1),i.velocity=0);let h=Math.max(0,t-i.distance);i.distance=t,i.wheelAngle=(i.wheelAngle+h/.43)%(Math.PI*2);let u=yr((n-i.lastSpeed)/s,-24,16);i.lastSpeed=n,i.braking=u<-2||n<.4;let f=1-Math.exp(-12*s),d=yr(n/20,0,1);return i.steer+=(yr(-i.velocity*3.35/Math.max(8,n),-.38,.38)-i.steer)*f,i.roll+=(yr(i.velocity*.023,-.105,.105)*d-i.roll)*f,i.pitch+=(yr(-u*.0025,-.04,.06)-i.pitch)*f,i.phase+=h*1.05,i.bob=Math.sin(i.phase)*.018*d,i}function ic(i){return{start:i.start-30,end:i.end+40}}function Rv(i){let e=[],t=[],n=[],s=[],r=(a,o,c)=>a+(o-a)*c;for(let a=0;a<i.length-1;a++){let o=i[a],c=i[a+1],l=[];for(let u=0;u<o.intervals.length;u++)for(let f=0;f<2;f++)l.push({a:o.intervals[u][f],b:c.intervals[u][f],id:u,side:f});let h=[0,1];for(let u=0;u<l.length;u++)for(let f=u+1;f<l.length;f++){let d=l[u],m=l[f],x=d.b-d.a-(m.b-m.a);if(Math.abs(x)>1e-9){let g=(m.a-d.a)/x;g>1e-7&&g<1-1e-7&&h.push(g)}}h.sort((u,f)=>u-f);for(let u=0;u<h.length-1;u++){let f=h[u],d=h[u+1];if(d-f<1e-7)continue;let m=(f+d)/2,x=M=>r(o.at,c.at,M),g=(M,_)=>r(M.a,M.b,_),p=o.intervals.map((M,_)=>({left:l[_*2],right:l[_*2+1]})).sort((M,_)=>g(M.left,m)-g(_.left,m)),b=[];for(let M of p){let _=b.at(-1);_&&g(M.left,m)<=g(_.right,m)+1e-8?g(M.right,m)>g(_.right,m)&&(_.right=M.right):b.push({...M})}for(let M of b){let _=[[g(M.left,f),x(f)],[g(M.right,f),x(f)],[g(M.left,d),x(d)],[g(M.right,d),x(d)]],P=e.length/3;for(let[S,A]of _)e.push(S,0,-A),t.push(S/10.8,A/20);n.push(P,P+1,P+2,P+2,P+1,P+3),s.push([_[0],_[2]],[_[1],_[3]])}}}return{positions:e,uvs:t,indices:n,edges:s}}function up(i,e,t,n){let s=i[0],r=ic(s),a=new Set([r.start,s.start,s.end,r.end]);for(let l=r.start;l<r.end;l+=2)a.add(l);let o=l=>l*l*l*(10+l*(-15+6*l)),c=[...a].sort((l,h)=>l-h).map(l=>{let h,u;if(l<s.start){let d=o((l-r.start)/30);h=[-3.35,0,3.35],u=8.2-2.8*d}else if(l>s.end){let d=o((l-s.end)/40);h=[-3.35,0,3.35],u=5.4+2.8*d}else h=i.map(d=>d.lane*3.35+t(d,l)),u=5.4;let f=e(l)-e(n);return{at:l-n,intervals:h.map(d=>[f+d-u,f+d+u])}});return{...Rv(c),rows:c,bounds:r}}var La=new xt,sc=new Ae,Ut=class{constructor(){this.parts=new Map}add(e,t,n,s=0,r=0,a=0,o=1,c=1,l=1,h=0,u=0,f=0){let d=t.index?t.toNonIndexed():t.clone();for(let g of Object.keys(d.attributes))g!=="position"&&g!=="normal"&&d.deleteAttribute(g);La.position.set(s,r,a),La.rotation.set(h,u,f),La.scale.set(o,c,l),La.updateMatrix(),d.applyMatrix4(La.matrix),sc.set(n);let m=d.attributes.position.count,x=new Float32Array(m*3);for(let g=0;g<m;g++)x[g*3]=sc.r,x[g*3+1]=sc.g,x[g*3+2]=sc.b;return d.setAttribute("color",new Dt(x,3)),this.parts.has(e)||this.parts.set(e,[]),this.parts.get(e).push(d),d}addGeometry(e,t,n){return this.add(e,t,n)}has(e){return!!this.parts.get(e)?.length}merge(e){let t=this.parts.get(e);if(!t?.length)return null;let n=t.length===1?t[0]:nc(t);return t.length>1&&t.forEach(s=>s.dispose()),this.parts.delete(e),n.computeBoundingSphere(),n}keys(){return[...this.parts.keys()]}};function Da(...i){let e=2166136261;for(let t of i)e^=Math.floor(t*1e3)|0,e=Math.imul(e,16777619),e^=e>>>13;return(e>>>0)%1e5/1e5}function Qn(i){let e=i>>>0||1;return()=>{e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var Cv=[[-.84,0],[-.965,.09],[-1,.28],[-.995,.5],[-.965,.7],[-.88,.87],[-.66,.98],[-.3,1],[.3,1],[.66,.98],[.88,.87],[.965,.7],[.995,.5],[1,.28],[.965,.09],[.84,0]],Iv=[[-1,0],[-1,1],[1,1],[1,0]];function rc(i,{profile:e=Cv,tumble:t=1}={}){let n=e.length,s=[],r=[],a=[],o=[],c=(m,[x,g])=>{let p=1+((m.tumble??t)-1)*g;return[x*m.w*p+(m.x||0),m.low+g*(m.high-m.low),m.z]};i.forEach(m=>e.forEach(x=>s.push(...c(m,x))));for(let m=0;m<i.length-1;m++)for(let x=0;x<n;x++){let g=m*n+x,p=m*n+(x+1)%n,b=g+n,M=p+n;a.push(g,b,p,p,b,M)}for(let[m,x]of[[0,i[0]],[1,i.at(-1)]]){let g=r.length/3;e.forEach(p=>r.push(...c(x,p)));for(let p=1;p<n-1;p++)m?o.push(g,g+p+1,g+p):o.push(g,g+p,g+p+1)}let l=new Qe;l.setAttribute("position",new De(s,3)),l.setIndex(a),l.computeVertexNormals();let h=new Qe;h.setAttribute("position",new De(r,3)),h.setIndex(o),h.computeVertexNormals();let u=new Qe,f=l.toNonIndexed(),d=h.toNonIndexed();for(let m of["position","normal"])u.setAttribute(m,new De([...f.attributes[m].array,...d.attributes[m].array],3));return[l,h,f,d].forEach(m=>m.dispose()),u}function $t(i,e){if(e<=i[0].z)return{...i[0]};if(e>=i.at(-1).z)return{...i.at(-1)};for(let t=1;t<i.length;t++)if(e<=i[t].z){let n=i[t-1],s=i[t],r=(e-n.z)/(s.z-n.z),a={z:e};for(let o of["w","low","high","tumble"])a[o]=(n[o]??1)+((s[o]??1)-(n[o]??1))*r;return a}}var le=(i,e,t,n,s)=>({z:i,w:e,low:t,high:n,tumble:s}),dp={coupe:{body:[le(-2.25,.78,.37,.6,.92),le(-2.13,.95,.3,.69),le(-1.88,1.04,.28,.77),le(-1.25,1.07,.28,.85),le(-.78,1.075,.28,.9),le(.35,1.065,.28,.93),le(1.1,1.095,.28,.95),le(1.78,1.075,.3,.95),le(2.12,.99,.34,.9),le(2.26,.84,.42,.82)],canopy:[le(-.9,.86,.84,.9,.86),le(-.32,.82,.86,1.29,.76),le(.12,.8,.88,1.37,.74),le(.74,.78,.88,1.36,.74),le(1.36,.82,.88,1.08,.8),le(1.78,.88,.9,.95,.9)],wheel:{r:.42,w:.3,x:.99,z:[-1.38,1.42]},lamps:{y:.79,z:2.2,x:.56,w:.66},head:{y:.64,z:-2.13,x:.68},exhaust:[.62,.36,2.24],stripes:!0,spoiler:"lip"},gt:{body:[le(-2.3,.82,.33,.52,.9),le(-2.16,1,.27,.62),le(-1.85,1.1,.25,.72),le(-1.2,1.12,.25,.79),le(-.7,1.11,.25,.83),le(.4,1.1,.25,.86),le(1.12,1.15,.25,.9),le(1.82,1.12,.27,.9),le(2.18,1.03,.32,.86),le(2.3,.88,.4,.78)],canopy:[le(-.72,.84,.78,.83,.84),le(-.18,.8,.8,1.19,.72),le(.3,.78,.82,1.25,.7),le(.86,.76,.82,1.23,.72),le(1.42,.82,.82,.99,.8),le(1.8,.88,.84,.88,.9)],wheel:{r:.42,w:.34,x:1.03,z:[-1.42,1.46]},lamps:{y:.74,z:2.25,x:.58,w:.7},head:{y:.58,z:-2.18,x:.72},exhaust:[.5,.33,2.28],wing:!0,splitter:!0},sedan:{body:[le(-2.28,.86,.4,.68,.95),le(-2.12,.98,.34,.8),le(-1.7,1.03,.32,.86),le(-.9,1.04,.32,.9),le(.6,1.04,.32,.92),le(1.6,1.03,.32,.94),le(2.12,.97,.36,.92),le(2.26,.86,.44,.86)],canopy:[le(-1.02,.88,.86,.92,.88),le(-.45,.85,.88,1.44,.82),le(.95,.84,.9,1.46,.82),le(1.45,.86,.9,1.06,.86),le(1.72,.9,.9,.95,.92)],wheel:{r:.4,w:.26,x:.95,z:[-1.42,1.42]},lamps:{y:.84,z:2.22,x:.6,w:.5},head:{y:.72,z:-2.15,x:.68},exhaust:[.55,.38,2.24]},hatch:{body:[le(-2,.86,.4,.7,.95),le(-1.86,.97,.34,.82),le(-1.4,1.02,.32,.88),le(-.7,1.03,.32,.93),le(.8,1.03,.32,.96),le(1.62,1,.34,.98),le(1.84,.92,.4,.96)],canopy:[le(-.82,.88,.88,.95,.88),le(-.25,.85,.9,1.48,.84),le(1.2,.84,.9,1.5,.84),le(1.62,.86,.92,1.34,.86),le(1.76,.88,.94,1,.9)],wheel:{r:.38,w:.25,x:.93,z:[-1.22,1.25]},lamps:{y:1,z:1.8,x:.66,w:.36},head:{y:.74,z:-1.94,x:.64},exhaust:[.5,.4,1.86]},suv:{body:[le(-2.3,.92,.5,.86,.96),le(-2.14,1.03,.44,1),le(-1.7,1.08,.42,1.08),le(-.9,1.09,.42,1.12),le(.9,1.09,.42,1.14),le(1.9,1.07,.44,1.14),le(2.22,1,.48,1.1),le(2.3,.92,.56,1.04)],canopy:[le(-1,.94,1.06,1.12,.92),le(-.45,.92,1.08,1.74,.88),le(1.75,.92,1.1,1.78,.9),le(2.1,.94,1.1,1.6,.92),le(2.22,.95,1.1,1.14,.95)],wheel:{r:.47,w:.32,x:1,z:[-1.45,1.5]},lamps:{y:1.12,z:2.26,x:.74,w:.34},head:{y:.92,z:-2.2,x:.7},exhaust:[.6,.48,2.3],rack:!0},van:{body:[le(-2.4,.92,.46,.86,.96),le(-2.22,1.04,.4,1),le(-1.7,1.08,.38,1.1),le(-1.2,1.1,.38,1.14),le(2.25,1.1,.38,1.16),le(2.4,1.04,.42,1.12)],canopy:[le(-1.62,1,1.06,1.12,.94),le(-1,1,1.08,2.02,.94),le(2.28,1.04,1.1,2.06,.95),le(2.38,1,1.1,1.2,.96)],wheel:{r:.44,w:.3,x:1,z:[-1.6,1.55]},lamps:{y:1.12,z:2.38,x:.86,w:.22},head:{y:.86,z:-2.32,x:.74},exhaust:[.6,.44,2.38],panelRoof:!0}},cu=["sedan","hatch","suv","sedan","van"],ru=1384748,Pv=1711651,lu=13227226,Lv=2503487,Bt=new yt(1,1,1),fs=new ln(1,1,1,20),Dv=new es(1,20,0,Math.PI),Uv=new Bn(1,12,8),au=new Map;function Nv(i){let e=i.r+":"+i.w;if(au.has(e))return au.get(e);let t=new Ut,n=i.r,s=i.w,r=Math.PI/2;t.add("w",fs,Pv,0,0,0,n,s,n,0,0,r),t.add("w",fs,2896699,0,0,0,n*.93,s+.012,n*.93,0,0,r);for(let o of[-1,1]){t.add("w",fs,9411750,o*(s*.5+.004),0,0,n*.66,.02,n*.66,0,0,r),t.add("w",fs,3752781,o*(s*.5+.01),0,0,n*.5,.012,n*.5,0,0,r);for(let c=0;c<5;c++)t.add("w",Bt,lu,o*(s*.5+.016),0,0,.035,n*1.22,.075,c*Math.PI*2/5,0,0);t.add("w",fs,15002863,o*(s*.5+.024),0,0,n*.16,.014,n*.16,0,0,r)}let a=t.merge("w");return au.set(e,a),a}var ou=new Map;function fp(i="coupe"){if(ou.has(i))return ou.get(i);let e=dp[i]||dp.coupe,t=new Ut,n=e.body,s=e.canopy,r=e.wheel,a=n[0].z,o=n.at(-1).z,c=Math.max(...s.map(S=>S.high));t.add("paint",rc(n),16777215),t.add("glass",rc(s),16777215);let l=s.filter(S=>S.high>c-.1).map(S=>S.z),h=Math.min(...l)-.16,u=Math.max(...l)+.14,f=[h,h+.08,(h+u)/2,u-.08,u].map((S,A)=>{let R=$t(s,S),y=A===0||A===4;return le(S,R.w*R.tumble*(y?.84:.9),R.high-(y?.07:.13),R.high+.018,.94)});t.add("paint",rc(f),16777215);for(let S of[-1,1]){for(let G of r.z){let X=$t(n,G),te=S*(X.w*.985);t.add("trim",Dv,725528,te+S*.012,r.r*.98,G,r.r*1.18,r.r*1.18,1,0,S*Math.PI/2,0);let q=new _i(r.r*1.2,.055,5,14,Math.PI);t.add("paint",q,16777215,te+S*.02,r.r*.98,G,1,1,1.6,0,S*Math.PI/2,0),q.dispose()}t.add("trim",Bt,Lv,S*($t(n,0).w*.97),n[3].low+.07,(r.z[0]+r.z[1])/2,.06,.1,r.z[1]-r.z[0]-r.r*2.3);let A=$t(s,s[0].z+.25),R=S*($t(n,s[0].z+.2).w*.93);t.add("paint",Uv,16777215,R+S*.1,A.low+.09,s[0].z+.22,.12,.07,.09),t.add("trim",Bt,ru,R+S*.04,A.low+.04,s[0].z+.25,.12,.03,.05),t.add("trim",Bt,lu,S*($t(n,.4).w*.985),$t(n,.4).high-.03,(s[0].z+s.at(-1).z)/2,.015,.022,(s.at(-1).z-s[0].z)*.82);let y=a+.13,v=$t(n,y),C=Math.min(e.head.y,v.high-.07);t.add("trim",Bt,857372,S*e.head.x,C,y,.42,.12,.2,0,S*.16,0),t.add("lights",Bt,16775398,S*e.head.x,C+.005,y-.012,.36,.07,.2,0,S*.16,0),t.add("lights",Bt,12578815,S*(e.head.x-.02),C-.075,y-.004,.28,.02,.2,0,S*.16,0);let[L,O,z]=e.exhaust;t.add("trim",fs,lu,S*L,O,z,.07,.12,.07,Math.PI/2,0,0),t.add("trim",fs,724755,S*L,O,z+.05,.05,.04,.05,Math.PI/2,0,0)}let d=$t(n,a+.05),m=$t(n,o-.05);if(t.add("trim",Bt,ru,0,d.low+.13,a+.03,d.w*1.45,.16,.06),t.add("trim",Bt,989216,0,e.head.y-.04,a+.05,d.w*.8,.09,.05),t.add("trim",Bt,ru,0,m.low+.12,o+.01,m.w*1.6,.16,.06),t.add("trim",Bt,15328207,0,m.low+.27,o+.03,.42,.12,.02),t.add("trim",Bt,5906215,0,e.lamps.y,e.lamps.z+.012,(e.lamps.x-e.lamps.w/2)*2,.045,.03),e.splitter&&t.add("trim",Bt,1120802,0,n[1].low-.02,a+.12,n[1].w*1.9,.035,.32),e.spoiler==="lip"&&t.add("paint",Bt,16777215,0,n.at(-3).high+.04,n.at(-3).z+.12,n.at(-3).w*1.62,.04,.2,-.18,0,0),e.wing){for(let S of[-1,1])t.add("trim",Bt,1581869,S*.62,1,1.92,.06,.26,.12);t.add("trim",Bt,1581869,0,1.14,1.97,2,.05,.38,-.08,0,0);for(let S of[-1,1])t.add("trim",Bt,1581869,S*1,1.1,1.97,.03,.2,.42)}if(e.rack){for(let S of[-1,1])t.add("trim",Bt,10135214,S*.6,c+.06,.6,.05,.05,2.2);for(let S of[-.2,.6,1.4])t.add("trim",Bt,10135214,0,c+.07,S,1.22,.035,.05)}e.panelRoof&&t.add("paint",Bt,16777215,0,c-.18,.62,1.98,.36,3.3);let x=null;if(e.stripes){let S=(R,y,v)=>R.map(C=>{let L=$t(y,C);return le(C,.085,L.high+v-.012,L.high+v+.006,1)}),A=[];for(let R of[-.25,.25])for(let[y,v,C]of[[[a+.06,a+.25,-1.6,-1.2,-.82],n,0],[[h+.02,(h+u)/2,u-.02],f.map(L=>({...L,high:L.high})),0],[[s.at(-1).z+.05,1.95,o-.1],n,0]]){let L=rc(S(y,v,C),{profile:Iv});L.translate(R,.004,0),A.push(L)}x=new Ut,A.forEach(R=>{x.add("s",R,16052193),R.dispose()}),x=x.merge("s")}let g={bottom:[s[0].high,s[0].z],top:[$t(s,s[1].z).high,s[1].z]},p=s.length-1,b={bottom:[s[p].high,s[p].z],top:[s[p-1].high,s[p-1].z]},M=s[0].z-.02,_=a+.35,P={kind:i,paint:t.merge("paint"),glass:t.merge("glass"),trim:t.merge("trim"),lights:t.merge("lights"),stripes:x,wheel:Nv(r),wheelSpec:r,anchors:{badge:{z:a+.78,y:$t(n,a+.78).high},roofY:c+.016,roofZ:(h+u)/2,hood:{y:$t(n,M).high,back:M,front:_,frontY:$t(n,_).high,w:$t(n,M).w*.8},windshield:g,rearGlass:b,side:{x:$t(n,.86).w,y:$t(n,.86).high-.18,z:.86},lamps:e.lamps,head:e.head,exhaust:e.exhaust,front:a,rear:o,width:Math.max(...n.map(S=>S.w))}};return ou.set(i,P),P}var du=[{name:"boulevard",zenith:6269152,horizon:14280686,sunGlow:16769968,fog:14280686,fogNear:70,fogFar:315,sun:16769204,sunIntensity:3.3,sunPosition:[-34,62,38],hemiSky:13953279,hemiGround:9075298,hemi:1.25,rim:11066608,rimIntensity:.9,exposure:1.08,road:3819092,roadRough:.86,ground:9285770,curb:13617596,walk:13222580,walk2:12169892,verge:8367726,rail:13818070,lamp:4873580,buildings:[15193274,14279138,12176848,14862246,13220008,10993609,15721164,13874583],accents:[14708051,4165514,15775050,5533864,13000059,6988653],glass:6129571,trees:[5213791,6266211,4160853,7776357],trunk:7231041},{name:"coast",zenith:4172248,horizon:14085872,sunGlow:16773839,fog:14085872,fogNear:80,fogFar:320,sun:16773592,sunIntensity:3.5,sunPosition:[-26,70,30],hemiSky:13233407,hemiGround:5213333,hemi:1.3,rim:10217198,rimIntensity:.9,exposure:1.1,road:3622746,roadRough:.84,ground:14273958,curb:14212310,walk:12568516,walk2:11187378,verge:8828042,rail:15002600,lamp:5993088,water:2068398,deepWater:1270143,buildings:[15920610,15195339,14214884,16046530,13623528],accents:[3116963,14710863,15909198,3960476],glass:7317183,trees:[5218426,4164204,7319690],trunk:10123861,rock:9080710,rock2:11052179},{name:"storm",zenith:2502735,horizon:9016749,sunGlow:12174052,fog:9016749,fogNear:55,fogFar:300,sun:12766706,sunIntensity:2.1,sunPosition:[-30,55,30],hemiSky:11122396,hemiGround:3950162,hemi:1.55,rim:10467327,rimIntensity:1.15,exposure:1.12,road:2831170,roadRough:.42,ground:6254182,curb:11120821,walk:8226704,walk2:7042172,verge:5596764,rail:11977420,lamp:4608606,buildings:[9082536,7306383,10134704],accents:[15907152,14904661,8368345],glass:4281966,trees:[3099203,3692105,2506806,4284495],trunk:4865334,rock:7173248,rock2:8884379,snow:15331060}],Y=new yt(1,1,1),kt=new ln(1,1,1,10),pp=new ln(1,1,1,6),Gn=new Zn(1,1,7),_n=new Jn(1,0),hu=new Jn(1,1),Fv=new es(1,14),vr=new Bn(1,10,7),Ov=(i,e,t)=>new Ae(i).lerp(new Ae(e),t).getHex(),ct=(i,e)=>{let t=new Ae(i);return t.multiplyScalar(e),t.getHex()},Bv=(i,e,t,n,s,r,a)=>i.add("s",Fv,a,e,t,n,s,r,1,-Math.PI/2,0,0);function Mi(i,e,t,n,s,r="round",a=1){let o=s.trees[Math.floor(n()*s.trees.length)],c=(2.6+n()*1.6)*a;if(Bv(i,e+.6,.035,t+.4,1.9*a,1.5*a,ct(s.ground,.72)),i.add("s",pp,s.trunk,e,c*.4,t,.16*a,c*.8,.16*a),r==="pine"){for(let l=0;l<3;l++)i.add("s",Gn,ct(o,1-l*.06),e,c*.55+l*1.15*a,t,(1.7-l*.42)*a,2.1*a,(1.7-l*.42)*a);s.snow&&n()<.45&&i.add("s",Gn,s.snow,e,c*.55+3.05*a,t,.5*a,.7*a,.5*a);return}if(r==="palm"){for(let l=0;l<4;l++)i.add("s",pp,ct(s.trunk,1-l*.04),e+l*.12,1+l*1.6,t,.2-l*.02,1.7,.2-l*.02,0,0,-.07);for(let l=0;l<7;l++){let h=l*Math.PI*2/7+n();i.add("s",vr,l%2?o:ct(o,.9),e+.5+Math.cos(h)*1.25,6.7-Math.abs(Math.sin(h))*.2,t+Math.sin(h)*1.25,1.6,.12,.42,0,-h,Math.cos(h)*-.25)}i.add("s",vr,9071164,e+.5,6.6,t,.35,.3,.35);return}i.add("s",hu,o,e,c+.9*a,t,1.55*a,1.35*a,1.5*a),i.add("s",hu,ct(o,1.12),e+.55*a,c+1.5*a,t-.3*a,1.05*a,.95*a,1*a),i.add("s",hu,ct(o,.88),e-.5*a,c+.55*a,t+.4*a,1*a,.85*a,.95*a)}function gp(i,e,t,n,s,r,a,o,c,l,h,{band:u=!1,floor:f=3.1}={}){for(let d=n;d<s-1.2;d+=f){if(u){i.add("s",Y,c,t-h*.03,d+1.1,(r+a)/2,.06,1.25,a-r-.6),i.add("s",Y,l,t-h*.05,d+.38,(r+a)/2,.05,.12,a-r-.4);continue}let m=(a-r)/o;for(let x=0;x<o;x++){let g=r+m*(x+.5);i.add("s",Y,c,t-h*.03,d+1.1,g,.06,1.35,m*.58)}}}function xp(i,e,t,n,s,r,a,o){for(let c=s;c<r-1.2;c+=3.1)for(let l=0;l<o;l++)i.add("s",Y,a,e-t/2+t*(l+.5)/o,c+1.1,n+.03,t/o*.56,1.35,.06)}function uu(i,e,t,n,s,r,a){let o=9+e()*6,c=n*(1+e()*2.5),l=c+n*o/2,h=r-s,u=(s+r)/2,f=t.buildings[Math.floor(e()*t.buildings.length)],d=t.accents[Math.floor(e()*t.accents.length)],m=a==="tower"?26+e()*22:a==="low"?7+e()*4:12+e()*12,x=a==="tower"?t.glass:ct(t.glass,.82),g=ct(f,.78);i.add("s",Y,ct(f,.9),l,2,u,o,4,h),i.add("s",Y,2900306,c-n*.02,1.55,u,.06,2.4,h-1.2);for(let p=s+1.6;p<r-1;p+=2.4)i.add("s",Y,ct(f,.72),c-n*.05,1.55,p,.08,2.5,.12);if(i.add("s",Y,d,c-n*.65,3.2,u,1.3,.12,h-.8,0,0,n*.18),i.add("s",Y,ct(d,.75),c-n*1.28,3.05,u,.05,.32,h-.8),i.add("s",Y,16183522,c-n*.06,3.85,u,.08,.55,Math.min(h-2,6)),i.add("s",Y,ct(d,.9),c-n*.09,3.85,u,.04,.36,Math.min(h-2.6,5.2)),a==="tower"){i.add("s",Y,x,l+n*1,4+m/2,u,o-2,m,h-1.5);for(let p=s+1;p<=r-1;p+=1.6)i.add("s",Y,14674156,c+n*.97,4+m/2,p,.06,m,.1);for(let p=4;p<4+m;p+=3.3)i.add("s",Y,13227740,c+n*.96,p,u,.08,.14,h-1.5);return i.add("s",Y,12043468,l+n*1,4.4+m,u,o-3,.8,h-3),i.add("s",Y,10135730,l+n*1.5,5.6+m,u,2.4,1.8,2.4),m+4}if(i.add("s",Y,f,l,4+m/2,u,o,m,h),i.add("s",Y,g,c-n*.04,4.15,u,.12,.3,h+.05),gp(i,l,c,4.2,4+m,s+.8,r-.8,Math.max(2,Math.round(h/3)),x,g,n,{band:a==="band"}),xp(i,l,o-1.5,r,4.2,4+m,x,Math.max(2,Math.round(o/3))),a==="balcony")for(let p=7;p<4+m-1;p+=3.1)i.add("s",Y,15330538,c-n*.55,p,u,1.1,.12,h-2.4);return i.add("s",Y,g,l,4+m+.25,u,o+.2,.5,h+.2),i.add("s",Y,ct(f,.68),l,4+m+.05,u,o-.8,.3,h-.8),e()<.6&&(i.add("s",Y,11121848,l+n*(e()*2-1),4+m+.9,u-1,2,1.2,1.6),i.add("s",Y,9411489,l-n*1.5,4+m+.7,u+2,1.2,.8,1.2)),e()<.35&&(i.add("s",kt,9335128,l+n*2,4+m+1.6,u+1.5,.9,2.2,.9),i.add("s",Gn,7166023,l+n*2,4+m+3.1,u+1.5,1,.8,1)),e()<.3&&i.add("s",Y,t.trees[0],l,4+m+.6,u,o-2,.5,h-2.5),m+4}function kv(i,e,t){let n=new Ut,s=Qn(1e3+t*31+(e>0?7:0));if(n.add("s",Y,ct(i.walk2,.96),e*22,-.04,0,44,.1,20.2),t===7){n.add("s",Y,i.verge,e*16,.02,0,22,.06,18),n.add("s",kt,14078148,e*14,.3,0,3,.6,3),n.add("s",kt,7321814,e*14,.62,0,2.6,.05,2.6),n.add("s",kt,15262938,e*14,1.3,0,.25,1.5,.25);for(let[h,u]of[[6,-6],[9,5],[20,-4],[23,6],[17,-8]])Mi(n,e*h,u,s,i,"round",1.15);for(let h of[-3,3])n.add("s",Y,8018499,e*6.5,.45,h,.6,.12,2.2);return n.merge("s")}let r=["grid","band","balcony","tower","low","grid","band","balcony"],a=r[t%r.length];t%3===1?(uu(n,s,i,e,-9.6,-.3,a),uu(n,s,i,e,.3,9.6,r[(t+3)%8])):uu(n,s,i,e,-9.4,9.4,a);let o=Qn(77+t*13+(e>0?3:0)),c=18+o()*30,l=i.buildings[Math.floor(o()*i.buildings.length)];return n.add("s",Y,ct(l,.92),e*(30+o()*6),c/2,-2+o()*4,10,c,14),n.merge("s")}function zv(i,e,t){let n=new Ut,s=Qn(2e3+t*17+(e>0?5:0));if(t===0)return yp();if(t===1){let a=e*(26+s()*16),o=s()*10-5;n.add("s",Y,16052454,a,-3,o,2.2,.6,6),n.add("s",Y,2775920,a,-2.7,o,2.25,.12,6.05),n.add("s",Y,15918796,a,-2.4,o+.6,1.4,.6,2.2),n.add("s",kt,13949662,a,1,o,.06,7,.06);let c=new Qe;return c.setAttribute("position",new De([0,0,0,0,6,0,0,0,3.6,0,0,0,0,0,3.6,0,6,0],3)),c.computeVertexNormals(),n.add("s",c,16644334,a,-2,o-1.5),c.dispose(),n.merge("s")}if(t===2){for(let[a,o,c]of[[12,-5,14833983],[18,6,4170605],[30,-2,15778378]])n.add("s",kt,c,e*a,-2.9,o,.5,1.1,.5),n.add("s",Gn,c,e*a,-2,o,.4,.9,.4);return n.merge("s")}if(t===3||t===4){let a=e*(32+s()*14);return n.add("s",_n,i.rock,a,-3.4,0,9,3.2,8),n.add("s",_n,i.rock2,a+e*2,-2.2,2,5,2.2,4.5),n.add("s",vr,i.ground,a,-1.6,0,6,.9,5.5),Mi(n,a-1,-1,s,i,"palm"),t===4&&Mi(n,a+2,2,s,i,"palm",.9),n.merge("s")}n.add("s",Y,i.ground,e*24,-1.7,0,40,3.4,20.4),n.add("s",Y,ct(i.ground,.85),e*4.6,-2.2,0,1.2,2.4,20.4);let r=t%3;for(let a=0;a<2;a++){let o=-5+a*10,c=6+s()*3,l=5+s()*7,h=e*(9+s()*4+a*7),u=i.buildings[(t+a)%i.buildings.length];n.add("s",Y,u,h,l/2,o,c,l,6.5),n.add("s",Y,i.accents[(t+a+r)%i.accents.length],h,l+.5,o,c+.6,1,7.1,0,0,0),xp(n,h,c-1,o+3.25,1,l,i.glass,2),gp(n,h,h-e*c/2,1,l,o-2.6,o+2.6,2,i.glass,16777215,e)}return Mi(n,e*6,-8,s,i,"palm"),Mi(n,e*7,8,s,i,"palm",.95),n.merge("s")}function Hv(i,e,t){let n=new Ut,s=Qn(3e3+t*19+(e>0?11:0));if(n.add("s",Y,i.ground,e*24,-.06,0,46,.1,20.4),n.add("s",_n,ct(i.ground,.92),e*(18+s()*8),-.8,s()*8-4,7,2.6,6,0,s()*3,0),t%4===0){let a=e*(10+s()*6);n.add("s",_n,i.rock,a,.6,-3,2.2,1.6,2.6,0,s()*3,0),n.add("s",_n,i.rock2,a+e,.4,-1,1.4,1,1.5,0,s()*3,0)}let r=t%4===3?3:7+Math.floor(s()*5);for(let a=0;a<r;a++){let o=e*(7+s()*30),c=s()*18-9;Mi(n,o,c,s,i,"pine",.85+s()*.6)}if(t===5){let a=e*15;n.add("s",Y,7166538,a,1.6,2,5,3.2,6),n.add("s",Y,4012608,a,3.9,2,5.8,.3,6.8,0,0,e*.42),n.add("s",Y,4012608,a+e*1.2,3.9,2,5.8,.3,6.8,0,0,-e*.42),n.add("s",Y,15910250,a-e*2.52,1.6,1,.06,1,1)}if(t===6)for(let a=0;a<4;a++)n.add("s",_n,a%2?i.rock:i.rock2,e*(12+a*2.5),2+a*1.2,-6+a*4,3.5,4+a,3.2,0,a,0);return n.merge("s")}function yp(){let i=new Qe;for(let e of["position","normal","color"])i.setAttribute(e,new De([],3));return i}function Gv(i,e,t){let n=new Ut,s=e;n.add("s",Y,i.curb,s*5.53,.075,0,.26,.15,20.02),n.add("s",Y,i.verge,s*6.5,.06,0,1.7,.1,20.02),n.add("s",Y,i.walk,s*8.9,.1,0,3.1,.12,20.02);for(let a of[-7.5,-2.5,2.5,7.5])n.add("s",Y,i.walk2,s*8.9,.163,a,3.05,.01,.08);n.add("s",Y,ct(i.walk2,.9),s*10.5,.16,0,.15,.22,20.02);for(let a of[-5,5])n.add("s",Y,10852482,s*6.5,.25,a,1.5,.38,2.6),n.add("s",Y,ct(i.verge,.85),s*6.5,.45,a,1.3,.06,2.4);let r=Qn(400+t);return Mi(n,s*6.5,-5,r,i,"round",.7),Mi(n,s*6.5,5,r,i,"round",.65),t%2===0?(n.add("s",kt,i.lamp,s*6.3,3.4,0,.07,6.8,.07),n.add("s",Y,i.lamp,s*5.75,6.75,0,1.2,.09,.1),n.add("s",Y,16774102,s*5.25,6.66,0,.55,.1,.36)):(n.add("s",Y,4874608,s*9.9,.65,-3,.5,1.1,.5),n.add("s",Y,3108712,s*7.9,.5,4,.5,.6,1.8),n.add("s",Y,9071439,s*7.9,.85,4,.5,.06,1.9)),t===3&&(n.add("s",Y,14673640,s*9.7,1.3,-1,.06,2.4,3.6),n.add("s",Y,6066096,s*9.65,1.3,-1,.04,2.2,3.4),n.add("s",Y,i.lamp,s*9.7,2.55,-1,1.2,.08,3.8)),n.merge("s")}function Vv(i,e,t){let n=new Ut,s=e;n.add("s",Y,13226704,s*6.6,-.55,0,2.6,1.3,20.02),n.add("s",Y,ct(13226704,.82),s*3.2,-1.05,0,4.4,.3,20.02),n.add("s",Y,14870757,s*5.75,.42,0,.6,.84,20.02),n.add("s",Y,i.walk,s*7,.1,0,1.9,.12,20.02),n.add("s",Y,i.rail,s*7.95,1.05,0,.07,.07,20.02),n.add("s",Y,i.rail,s*7.95,.62,0,.05,.05,20.02);for(let r=-9;r<=9;r+=3)n.add("s",Y,i.rail,s*7.95,.6,r,.06,.95,.06);return n.add("s",Y,2920358,s*5.75,.86,0,.62,.05,20.02),t===0&&(n.add("s",Y,12240066,s*3.6,-6,0,2.2,10,2.6),n.add("s",Y,ct(12240066,.85),s*3.6,-3,0,3.4,.6,3.6)),t===1&&(n.add("s",kt,i.lamp,s*7.7,3.6,-4,.07,7.2,.07),n.add("s",Y,i.lamp,s*7,7.15,-4,1.5,.09,.1),n.add("s",Y,16774102,s*6.3,7.06,-4,.55,.1,.36)),n.merge("s")}function Wv(i,e,t){let n=new Ut,s=e;n.add("s",Y,i.curb,s*5.53,.075,0,.26,.15,20.02),n.add("s",Y,i.walk,s*7.4,.1,0,3.5,.12,20.02),n.add("s",Y,14209728,s*9.3,.35,0,.4,.6,20.02),n.add("s",Y,i.ground,s*12.5,-1.2,0,6,2.6,20.02);for(let r of[-6,4])Mi(n,s*11,r,Qn(500+t),i,"palm",.85);return t%2===0&&(n.add("s",kt,i.lamp,s*6,3.4,2,.07,6.8,.07),n.add("s",Y,i.lamp,s*5.45,6.75,2,1.2,.09,.1),n.add("s",Y,16774102,s*4.95,6.66,2,.55,.1,.36)),n.merge("s")}function _r(i,e,t,n=0){let s=new Ut,r=e,a=14276300,o=16774354;s.add("s",Y,i.curb,r*5.6,.12,0,.4,.24,20.02),s.add("s",Y,a,r*6.25,3.2,0,.5,6.4,20.02),s.add("s",Y,2846598,r*5.99,1.1,0,.04,.5,20.02),s.add("s",Y,ct(a,.9),r*5.2,6.75,0,2.4,.5,20.02,0,0,r*.55),s.add("s",Y,ct(a,.78),r*2.3,7.45,0,4.8,.5,20.02);for(let c of[-7.5,-2.5,2.5,7.5])s.add("s",Y,o,r*4.6,7.08,c,.3,.08,3.4);s.add("s",Y,i.rock,r*12,4.5,0,11,9,20.02),s.add("s",Y,ct(i.verge??i.ground,.95),r*6,8.35,0,12.2,1.4,20.02);for(let c=0;c<3;c++)s.add("s",_n,c%2?i.rock2:i.rock,r*(12+c*3),9+c*1.5,-7+c*7,4.5,3+c,5.5,0,t+c,0);if(s.add("s",_n,i.verge??i.ground,r*8,9.6,3,5,1.6,6),n){let c=n*10;s.add("s",Y,13946818,r*2.6,8.9,c,5.6,2.4,1),s.add("s",Y,12959665,r*12,6,c+n*.2,12,12,1.2),s.add("s",Y,15909198,r*2.6,7.85,c+n*.52,5.2,.28,.06),s.add("s",Y,2372671,r*2.6,7.85,c+n*.55,1.2,.12,.04);for(let l=0;l<3;l++)s.add("s",_n,i.rock,r*(9+l*4),12+l,c-n*2,5,4,4,0,l,0)}return s.merge("s")}function mp(i,e,t,n){let s=new Ut,r=e,a=Qn(600+t+(r>0?50:0));s.add("s",Y,ct(i.road,1.3),r*6.4,.03,0,2,.06,20.02),s.add("s",Y,i.rail,r*7.45,.62,0,.06,.3,20.02),s.add("s",Y,ct(i.rail,.7),r*7.45,.62,0,.04,.08,20.04);for(let o=-8;o<=8;o+=4)s.add("s",Y,7042689,r*7.55,.35,o,.1,.7,.1),s.add("s",Y,12575743,r*7.42,.66,o,.02,.08,.18);for(let o of[-5,5])s.add("s",Y,15331058,r*6.9,.55,o,.12,1.1,.12),s.add("s",Y,15771200,r*6.9,.95,o,.13,.18,.13);if(n){for(let o=0;o<4;o++){let c=-7.5+o*5,l=7+a()*6;s.add("s",_n,o%2?i.rock:i.rock2,r*(10.8+a()),l*.45,c,3.2+a(),l,3.4,a(),a()*2,r*.15)}s.add("s",Y,ct(i.rock,.9),r*13,5,0,4,10,20.02),i.snow&&s.add("s",Y,i.snow,r*13.6,10.1,0,3.2,.3,20.02)}else s.add("s",Y,ct(i.ground,.85),r*11,-1.6,0,6,3,20.02,0,0,-r*.35);return s.merge("s")}var ps=8;function _p(i){let e=du[i],t={look:e,roadside:{},scenery:{"-1":[],1:[]}},n=(s,r,...a)=>Array.from({length:r},(o,c)=>({"-1":s(e,-1,c,...a),1:s(e,1,c,...a)}));if(i===0){t.roadside.street=n(Gv,4);for(let s of[-1,1])for(let r=0;r<ps;r++)t.scenery[s].push(kv(e,s,r))}if(i===1){t.roadside.bridge=n(Vv,3),t.roadside.shore=n(Wv,2),t.roadside.tunnel=[{"-1":_r(e,-1,0),1:_r(e,1,0)}],t.roadside.portalIn=[{"-1":_r(e,-1,1,1),1:_r(e,1,1,1)}],t.roadside.portalOut=[{"-1":_r(e,-1,2,-1),1:_r(e,1,2,-1)}];for(let s of[-1,1])for(let r=0;r<ps;r++)t.scenery[s].push(zv(e,s,r))}if(i===2){t.roadside.cliff=n(mp,3,!0),t.roadside.drop=n(mp,3,!1);for(let s of[-1,1])for(let r=0;r<ps;r++)t.scenery[s].push(Hv(e,s,r))}return t.empty=yp(),t.dispose=()=>{for(let s of Object.values(t.roadside))for(let r of s)for(let a of Object.values(r))a.dispose();for(let s of["-1","1"])t.scenery[s].forEach(r=>r.dispose());t.empty.dispose()},t}function vp(i,e,t={}){let n=e*20+10,s=l=>Da(e,l,i),r=(t.tunnels||[]).find(l=>n>l.start&&n<l.end);if(i===0){let l=Math.floor(s(1)*4);return{roadside:{"-1":["street",l],1:["street",(l+2)%4]},scenery:{"-1":Math.floor(s(2)*ps),1:Math.floor(s(3)*ps)}}}if(i===1){if(r){let x=n-20<r.start,g=n+20>r.end,p=x?"portalIn":g?"portalOut":"tunnel";return{roadside:{"-1":[p,0],1:[p,0]},scenery:{"-1":-1,1:-1},tunnel:!0}}let l=Math.floor(n/240),h=Da(l,7,i)<.38,u=Da(l,8,i)<.5?-1:1,f=e%2===0?0:e%4===1?1:2,d=x=>h&&x===u?["shore",e%2]:["bridge",f],m=x=>h&&x===u?5+Math.floor(s(4+x)*3):Math.floor(s(5+x)*5);return{roadside:{"-1":d(-1),1:d(1)},scenery:{"-1":m(-1),1:m(1)},land:h?u:0}}let a=Math.floor(n/320),o=Da(a,9,i)<.5?-1:1,c=Math.floor(s(1)*3);return{roadside:{"-1":[o===-1?"cliff":"drop",c],1:[o===1?"cliff":"drop",(c+1)%3]},scenery:{"-1":Math.floor(s(2)*ps),1:Math.floor(s(3)*ps)}}}function fu(i,e,t){if(i!==1)return[];let n=[...t].sort((a,o)=>a.start-o.start).reduce((a,o)=>{let c=a.at(-1);return c&&o.start<=c.end?c.end=Math.max(c.end,o.end):a.push({...o}),a},[]),s=[],r=240;for(let a of[...n,{start:e-320,end:1/0}])a.start-r>=220&&s.push({start:r,end:a.start}),r=Math.max(r,a.end);return s.filter((a,o)=>o%2===1).map(a=>{let o=Math.round((a.start+a.end)/2/20)*20;return{start:o-80,end:o+60}})}function bp(i){let e=new Bn(560,40,20),t=e.attributes.position,n=new Float32Array(t.count*3),s=new N(...i.sunPosition).normalize().multiply(new N(1,.6,-1)).normalize(),r=new Ae(i.zenith),a=new Ae(i.horizon),o=new Ae(i.sunGlow),c=new Ae,l=new N;for(let u=0;u<t.count;u++){l.fromBufferAttribute(t,u).normalize();let f=Math.max(0,l.y);c.copy(a).lerp(r,Math.pow(f,.55));let d=Math.max(0,l.dot(s));c.lerp(o,Math.pow(d,8)*.55+Math.pow(d,64)*.4),n.set([c.r,c.g,c.b],u*3)}e.setAttribute("color",new Dt(n,3));let h=new Me(e,new ft({vertexColors:!0,side:zt,fog:!1,depthWrite:!1}));return h.renderOrder=-10,h.frustumCulled=!1,h}function Mp(i,e){let t=new Ut,n=Qn(90+i),s=e.horizon,r=(o,c)=>Ov(o,s,c);if(i===0){for(let o=0;o<34;o++){let c=(o-17)*24+n()*10,l=22+n()*70,h=12+n()*16;t.add("s",Y,r(9348279,.55),c,l/2-4,-470-n()*20,h,l,10)}for(let o=0;o<26;o++){let c=(o-13)*30+n()*12,l=14+n()*40,h=14+n()*14;t.add("s",Y,r(10334912,.38),c,l/2-4,-420-n()*10,h,l,10)}t.add("s",kt,r(8361384,.4),-120,40,-430,3,90,3),t.add("s",vr,r(9348279,.4),-120,72,-430,8,6,8)}else if(i===1){for(let o=0;o<9;o++){let c=(o-4)*110+n()*40,l=80+n()*90,h=16+n()*30;t.add("s",_n,r(6262664,.5),c,-6,-470,l,h,30)}t.add("s",Y,r(4022130,.45),180,-1.5,-440,40,4,8),t.add("s",Y,r(14243647,.45),172,1.6,-440,6,3,8)}else for(let[o,c,l,h,u,f]of[[520,6122118,.62,12,90,110],[470,4871794,.42,14,60,80],[430,3950174,.25,16,35,55]])for(let d=0;d<h;d++){let m=(d-h/2)*(900/h)+n()*40,x=u+n()*f,g=90+n()*80;t.add("s",Gn,r(c,l),m,x/2-8,-o-n()*20,g,x,30),l>.4&&t.add("s",Gn,r(15199733,l*.8),m,x-8-x*.12,-o-n()*20+2,g*.25,x*.25,8)}let a=new Me(t.merge("s"),new ft({vertexColors:!0,fog:!1}));return a.renderOrder=-5,a}function Sp(i,e){let t=[["wheel","clock","stadium","twin"],["lighthouse","towers","ship","lighthouse"],["turbines","observatory","mast","turbines"]][i],n=[];for(let s=0,r=520;r<e-200;s++,r+=1150)n.push({kind:t[s%t.length],at:r,side:s%2?1:-1});return n}function Ep(i,e,t){let n=new Ut,s=Qn(e.length*7+i);if(e==="wheel"){n.add("s",Y,14278626,0,0,0,30,1,12);for(let r of[-2,2])n.add("s",Y,13620954,-6,18,r,.8,36,.8,0,0,-.32),n.add("s",Y,13620954,6,18,r,.8,36,.8,0,0,.32);return n.add("s",kt,9279907,0,34,0,1.2,5,1.2,Math.PI/2,0,0),{static:n.merge("s"),offset:62}}if(e==="clock"){n.add("s",Y,15260095,0,18,0,7,36,7),n.add("s",Y,14140838,0,37,0,8,2,8),n.add("s",Gn,7176076,0,43,0,6,9,6);for(let[r,a,o]of[[0,3.55,0],[3.55,0,Math.PI/2]])n.add("s",kt,16315106,r,30,a,2.4,.2,2.4,Math.PI/2,o,0),n.add("s",Y,2898245,r,30.6,a+(o?0:.12),.18,1.6,.05,0,o,0);return{static:n.merge("s"),offset:52}}if(e==="stadium"){n.add("s",new ln(32,28,16,24,1,!0),14212576,0,8,0),n.add("s",new _i(31,1.2,6,24),15226698,0,16,0,1,1,1,Math.PI/2,0,0);for(let r=0;r<8;r++){let a=r/8*Math.PI*2;n.add("s",Y,12371660,Math.cos(a)*30,22,Math.sin(a)*30,.8,12,.8)}return{static:n.merge("s"),offset:78}}if(e==="twin"){for(let r of[-7,7])n.add("s",Y,t.glass,r,32,0,10,64,10),n.add("s",Y,14674156,r,65,0,8,3,8),n.add("s",kt,13621726,r,72,0,.3,12,.3);return n.add("s",Y,13621726,0,42,0,6,2,3),{static:n.merge("s"),offset:70}}if(e==="lighthouse"){n.add("s",_n,t.rock,0,-3,0,14,6,12),n.add("s",kt,16052714,0,9,0,2.6,22,2.6);for(let r of[4,12])n.add("s",kt,14239547,0,r,0,2.62,3,2.62);return n.add("s",kt,2964036,0,21,0,3.2,.5,3.2),n.add("s",kt,16773569,0,22.6,0,1.8,2.6,1.8),n.add("s",Gn,14239547,0,25,0,2.4,2.4,2.4),{static:n.merge("s"),offset:58,beacon:[0,22.6,0]}}if(e==="towers"){for(let r of[-1,1])n.add("s",Y,15002086,r*11.2,15,0,1.6,30,2.2),n.add("s",Y,15002086,r*11.2,-6,0,2.6,12,3.2);n.add("s",Y,14015961,0,28,0,24,1.6,2.2),n.add("s",Y,2920358,0,26.8,0,22,.5,2.3);for(let r of[-1,1])for(let a of[-1,1])for(let o=0;o<4;o++){let c=Math.hypot(22-o*2,18+o*6);n.add("s",Y,13624292,r*11,28-(22-o*2)/2,a*(18+o*6)/2,.12,c,.12,a*Math.atan2(18+o*6,22-o*2),0,0)}return{static:n.merge("s"),offset:0,overRoad:!0}}if(e==="ship"){n.add("s",Y,3099228,0,-2.4,0,9,3.4,44),n.add("s",Y,15001834,0,1.6,16,8,5,8);for(let r=0;r<5;r++)n.add("s",Y,t.accents[r%t.accents.length],0,.6,-14+r*6,8,3,5.5);return{static:n.merge("s"),offset:95}}if(e==="turbines"){for(let[r,a,o]of[[0,0,40],[30,-40,46],[-26,-70,38]])n.add("s",_n,t.rock,r,0,a,16,8,14),n.add("s",kt,15265264,r,o/2,a,.9,o,.9),n.add("s",Y,15265264,r,o,a+1.2,1.8,1.8,3.2);return{static:n.merge("s"),offset:92,rotors:[[0,40,-1.6],[30,46,-41.6],[-26,38,-71.6]]}}if(e==="observatory")return n.add("s",Gn,t.rock,0,14,0,40,40,36),n.add("s",Gn,t.snow,0,30,0,13,10,12),n.add("s",kt,14673386,0,36,0,4,4,4),n.add("s",vr,15856886,0,38.5,0,4,3.6,4),n.add("s",Y,4608606,0,39,1,1.2,4,6,0,0,.5),{static:n.merge("s"),offset:120};n.add("s",Gn,t.rock,0,10,0,30,30,26),n.add("s",kt,12042440,0,40,0,.6,34,.6);for(let r=26;r<56;r+=6)n.add("s",Y,12042440,0,r,0,3,.2,.2);return{static:n.merge("s"),offset:105,beacon:[0,57.5,0]}}function wp(){let i=new Ut,e=new yt(.9,16,.3).translate(0,8.4,0);for(let t=0;t<3;t++)i.add("s",e,15922679,0,0,0,1,1,1,0,0,t*Math.PI*2/3);return i.add("s",vr,15265264,0,0,.3,.9,.9,.9),e.dispose(),i.merge("s")}var ac=class{constructor(e,t){this.scene=e,this.car=t,this.level=0,this.uses=0,this.intensity=0,this.burstAge=2,this.matrix=new xt;let n=document.createElement("canvas");n.width=n.height=128;let s=n.getContext("2d"),r=s.createRadialGradient(64,64,1,64,64,64);r.addColorStop(0,"#ffffff"),r.addColorStop(.15,"#c8f7ffb0"),r.addColorStop(.48,"#57bfff35"),r.addColorStop(1,"#1a6cff00"),s.fillStyle=r,s.fillRect(0,0,128,128),this.texture=new yi(n),this.texture.colorSpace=Ft,this.exhaust=new Je,t.add(this.exhaust),this.jets=[],this.glows=[];for(let o of[-1,1]){let c=new Me(new Zn(.22,2.8,10),new ft({color:5819391,transparent:!0,opacity:.9,blending:yn,depthWrite:!1}));c.rotation.x=Math.PI/2,c.position.set(o*.69,.38,3.35),this.exhaust.add(c),this.jets.push(c);let l=new Me(new Zn(.09,1.8,10),new ft({color:15072511,transparent:!0,opacity:.95,blending:yn,depthWrite:!1}));l.rotation.x=Math.PI/2,l.position.set(o*.69,.38,3),this.exhaust.add(l);let h=new mi(new Yn({map:this.texture,color:7525887,transparent:!0,opacity:.75,blending:yn,depthWrite:!1}));h.position.set(o*.69,.42,2.6),h.scale.set(1.65,1.65,1),this.exhaust.add(h),this.glows.push(h)}this.exhaust.visible=!1,this.wake=new gi(new yt(.022,.022,1),new ft({color:10414847,transparent:!0,opacity:.7,blending:yn,depthWrite:!1}),48),this.wake.frustumCulled=!1,this.wake.visible=!1,this.wake.instanceMatrix.setUsage(as),e.add(this.wake),this.rings=[];let a=new ns(1.8,1.85,48);for(let o=0;o<3;o++){let c=new Me(a,new ft({color:8317183,transparent:!0,opacity:0,side:cn,blending:yn,depthWrite:!1}));c.visible=!1,e.add(c),this.rings.push(c)}this.aura=new Me(new Ot(5.4,8),new ft({map:this.texture,color:5818879,transparent:!0,opacity:0,blending:yn,depthWrite:!1})),this.aura.rotation.x=-Math.PI/2,this.aura.visible=!1,e.add(this.aura)}update(e,t,n,s){this.state!==t&&(this.state=t,this.uses=t?.nitroUses||0,this.burstAge=2,this.intensity=0,this.wasActive=!1,this.previousLevel=0);let r=!!t?.nitroActive&&!s,a=Math.max(1,t?.nitroLevel||1),o=n.reduced,c=n.graphics==="battery";r&&(!this.wasActive||a!==this.previousLevel)&&(this.burstAge=0),this.wasActive=r,this.previousLevel=a,this.uses=t?.nitroUses||0,s||(this.burstAge+=e,this.intensity=Ht.damp(this.intensity,r?a/3:0,r?16:8,e)),this.level=r?a:0;let l=a===3?16765315:a===2?11972863:7004415;this.exhaust.visible=r;let h=o?1:1+Math.sin((t?.elapsed||0)*39)*.045;this.exhaust.scale.set(1+(a-1)*.12,1,1+(a-1)*.18),this.jets.forEach(d=>{d.material.color.setHex(l),d.scale.y=h}),this.glows.forEach(d=>d.material.color.setHex(l));let u=this.car.position.x,f=this.car.position.z;if(this.aura.visible=r,this.aura.position.set(u,.065,f+1),this.aura.rotation.z=-this.car.rotation.y,this.aura.material.color.setHex(l),this.aura.material.opacity=r?.16+a*.07:0,this.wake.visible=r&&!o,this.wake.count=c?12:48,this.wake.material.color.setHex(l),this.wake.visible){let d=(t.roadTravel||t.distance)*.08;for(let m=0;m<this.wake.count;m++){let x=((m*.618033+d)%1+1)%1,g=m%2?1:-1;this.matrix.position.set(u+g*(1.15+m%7*.2),.2+m%5*.14,f+2+x*12),this.matrix.scale.set(1,1,(.6+a*.5)*(1-x*.45)),this.matrix.rotation.set(0,0,g*.04),this.matrix.updateMatrix(),this.wake.setMatrixAt(m,this.matrix.matrix)}this.wake.instanceMatrix.needsUpdate=!0}this.rings.forEach((d,m)=>{let x=this.burstAge-m*.075,g=x/.5;d.visible=r&&!o&&!c&&g>=0&&g<1,d.visible&&(d.position.set(u,.8,f+2+g*8),d.scale.setScalar(.65+g*1.3),d.material.color.setHex(l),d.material.opacity=(1-g)*.32)})}};var Xv=13.2,oc=[3775609,14792518,12471902,5014984],Tp=[15317401,12155991,8410431,13802100],qv=new yt(1,1,1),lc=new Jn(1,1),$v=new ln(.24,.29,.67,6),Ap=new yt(1,1,1),ei=new xt,ms=new Ae;function gs(i,e){let t=new gi(i,new Ct({roughness:.85}),e);return t.instanceMatrix.setUsage(as),t.frustumCulled=!1,t}function xs(i,e,t,n,s,r,a,o,c=0,l=0,h=0){ei.position.set(t,n,s),ei.scale.set(r,a,o),ei.rotation.set(c,l,h),ei.updateMatrix(),i.setMatrixAt(e,ei.matrix)}function ys(i,e,t){let n=e.map(([a,o,c,l,h,u])=>{let f=qv.clone();return ei.position.set(a,o,c),ei.scale.set(l,h,u),ei.rotation.set(0,0,0),ei.updateMatrix(),f.applyMatrix4(ei.matrix)}),s=nc(n);n.forEach(a=>a.dispose());let r=new Me(s,new Ct({color:t,roughness:.76}));return r.receiveShadow=!0,i.add(r),r}var cc=class{constructor(e){this.root=new Je,e.add(this.root),this.stands=[],this.elapsed=0,this.proximity=0,this.state=void 0;for(let t=0;t<6;t++){let n=new Je,s=new Je,r=new Je;n.add(s,r),this.root.add(n);let a=ys(s,[[1.2,-.22,0,6,.4,15.8],[1.7,.05,0,2.5,.5,14.8],[3.4,.38,0,1.4,1.15,14.8]],11386556);ys(s,[[1.4,-1.5,-5,.45,2.6,.45],[1.4,-1.5,5,.45,2.6,.45]],5861760);let o=[[-1.8,.78,0,.11,.13,15.6],[-1.8,.3,0,.11,.07,15.6]];for(let b=-7.5;b<=7.5;b+=3)o.push([-1.8,.36,b,.12,.9,.12]);ys(s,o,13490134);let c=[];for(let b of[0,1])c.push([b*1.85+.7,.35+b*.56,0,.7,.12,13.5]);ys(s,c,2309714);for(let b=0;b<4;b++)ys(s,[[-1.9,.42,(b-1.5)*3.6,.07,.65,3.35]],oc[b]);let l=ys(s,[[-2.8,-.27,0,2,.3,15.8]],9546157);l.userData.bridgeDeck=!0;let h=gs($v,8),u=gs(lc,8),f=gs(lc,8),d=gs(Ap,16),m=gs(lc,16),x=gs(Ap,16),g=gs(lc,16);for(let b of[h,u,f,d,m,x,g])r.add(b);for(let b=0;b<8;b++){h.setColorAt(b,ms.setHex(oc[(b+t)%4])),u.setColorAt(b,ms.setHex(Tp[(b*3+t)%4])),f.setColorAt(b,ms.setHex([4141099,5849145,3156786,10648136][b%4]));for(let M of[0,1])d.setColorAt(b*2+M,ms.setHex(oc[(b+t)%4])),m.setColorAt(b*2+M,ms.setHex(Tp[(b*3+t)%4])),x.setColorAt(b*2+M,ms.setHex(2504263)),g.setColorAt(b*2+M,ms.setHex(2371645))}let p=[];for(let b of[-7.2,7.2]){ys(s,[[4.3,2.5,b,.09,5,.09]],9611445);let M=new Me(new Ot(1.6,.8,5,2),new Ct({color:oc[(t+(b>0?1:0))%4],side:cn,roughness:.85}));M.position.set(3.55,4.25,b),M.userData.flat=M.geometry.attributes.position.array.slice(),s.add(M),p.push(M)}this.stands.push({group:n,platform:s,base:a,bodies:h,heads:u,hair:f,arms:d,hands:m,legs:x,eyes:g,flags:p,slot:t,station:-1})}}prepare(e,t){if(this.state===e&&this.arena===t)return;this.state=e,this.arena=t;let n=window.RallyCore,s=[];if(e&&!e.reviewLap){s.push(25);for(let r=1;r<e.tasks.length;r++){let a=n.taskZone(e.tasks[r-1]).end+100,o=n.taskZone(e.tasks[r]).start-140;o-a>25&&s.push((a+o)/2)}s.push(e.arena.length-15)}else e||s.push(65,230,470,710,950);this.stations=s.flatMap((r,a)=>[-1,1].map(o=>({at:r,side:o,id:a*2+(o>0?1:0)})));for(let r of this.stands)r.station=-1,r.lastCheer=0,r.group.visible=!1,r.base.material.color.setHex(t===2?7176597:t===1?11652809:13154211)}update(e,t,n,s,r,a,o,c){this.prepare(t,n),c||(this.elapsed+=e);let l=this.stations.findIndex(f=>f.at>=s-100),h=l<0?[]:this.stations.slice(l,l+6).map(f=>f.id),u=new Set(this.stands.filter(f=>h.includes(f.station)).map(f=>f.station));this.proximity=0;for(let f of this.stands){if(!h.includes(f.station)){let _=h.find(P=>!u.has(P));f.station=_??-1,_!=null&&u.add(_)}let d=this.stations[f.station];if(!d){f.group.visible=!1;continue}let m=d.at-s,x=(this.blocked||[]).some(_=>d.at>_.start-40&&d.at<_.end+40);if(f.group.visible=!x&&m>-85&&m<300,!f.group.visible)continue;let g=d.side;f.group.position.set(a(d.at)-r+g*Xv,0,4-m),f.group.rotation.y=-Math.atan((a(d.at+1)-a(d.at-1))/2),f.platform.scale.x=g;let p=Math.min(Math.abs(m),...(t?.rivals||[]).map(_=>Math.abs(_.at-d.at))),b=c?f.lastCheer||0:t&&t.status!=="countdown"?Ht.smoothstep(80-p,0,65):0;f.lastCheer=b,this.proximity=Math.max(this.proximity,Ht.clamp(1-Math.abs(m)/90,0,1));let M=o.graphics==="battery"?4:8;for(let _ of[f.bodies,f.heads,f.hair])_.count=M;for(let _ of[f.arms,f.hands,f.legs,f.eyes])_.count=M*2;for(let _=0;_<M;_++){let P=_>>2,S=g*(P*1.85+.7),A=(_%4-1.5)*3.3,R=.9+_%3*.07,y=.43+P*.56,v=this.elapsed*4.2+_*1.8+f.slot*.8,C=o.reduced?0:b*Math.max(0,Math.sin(v))*.07,L=y+.87*R+C,O=y+1.48*R+C;xs(f.bodies,_,S,L,A,R,R,R),xs(f.heads,_,S,O,A,.23*R,.27*R,.23*R),xs(f.hair,_,S+g*.025,O+.15*R,A,.235*R,.17*R,.24*R);for(let z=0;z<2;z++){let G=z?1:-1,X=o.reduced?0:Math.sin(v+(z?1.1:0))*.24,te=o.reduced?0:b*(_%3===0?1.85:1.35)+X*b,q=G*(.15+te),he=A+G*.26*R,pe=.55*R,Ie=he+G*Math.sin(te)*pe*.5;xs(f.arms,_*2+z,S,L-.04+Math.cos(te)*(-pe*.5),Ie,.15*R,pe,.16*R,q,0,0),xs(f.hands,_*2+z,S,L-.04-Math.cos(te)*pe,he+G*Math.sin(te)*pe,.105*R,.105*R,.105*R),xs(f.legs,_*2+z,S,y+.29*R+C,A+G*.13*R,.17*R,.59*R,.2*R),xs(f.eyes,_*2+z,S-g*.222*R,O+.025*R,A+G*.08*R,.018,.025,.024)}}for(let _ of[f.bodies,f.heads,f.hair,f.arms,f.hands,f.legs,f.eyes])_.instanceMatrix.needsUpdate=!0;for(let _ of f.flags)if(!c){let P=_.geometry.attributes.position,S=_.userData.flat;for(let A=0;A<S.length;A+=3)P.array[A+2]=o.reduced?0:Math.sin(this.elapsed*3+S[A]*3+f.slot)*.09*(S[A]+.8)/1.6;P.needsUpdate=!0,_.geometry.computeVertexNormals()}}}};var hc=(i,e,t)=>Math.max(e,Math.min(t,i)),uc=class{constructor(e,t){this.car=t,this.state=null,this.stage=-1,this.lastImpact=null,this.spawnClock=0,this.deformable=t.children.filter(S=>S.isMesh&&S.userData.paint).map(S=>({mesh:S,base:S.geometry.attributes.position.array.slice()})),this.details=new Je,t.add(this.details);let n=t.userData.anchors||{windshield:{bottom:[.92,-.945],top:[1.46,-.365]},rearGlass:{bottom:[.92,1.18],top:[1.46,.63]},hood:{y:.965,back:-.57,front:-2.04,frontY:.75,w:.86},side:{x:1.076,y:.78,z:.86}},s=new xi({color:15661299,transparent:!0,opacity:.9,depthWrite:!1}),r=[];for(let S of[n.windshield,n.rearGlass])for(let[A,R,y]of[[-.24,.52,.27],[.36,.3,.15]]){let v=S===n.rearGlass,C=(O,z)=>[O,S.bottom[0]+z*(S.top[0]-S.bottom[0])+.012,S.bottom[1]+z*(S.top[1]-S.bottom[1])+(v?.014:-.014)],L=[[-1,-.22],[-.64,.85],[.18,1],[1,.37],[.83,-.65],[-.23,-1]];for(let O=0;O<L.length;O++){let[z,G]=L[O],X=C(A+z*y*.48,hc(R+G*y*.65,.05,.92)),te=C(A+z*y,hc(R+G*y*1.15,.05,.92));r.push(...C(A,R),...X,...X,...te),O%2===0&&r.push(...X,...C(A+z*y*.9+.06,hc(R+G*y*.35,.05,.92)))}}this.cracks=new Di(new Qe().setAttribute("position",new De(r,3)),s),this.cracks.renderOrder=2,this.details.add(this.cracks);let a=t.children.find(S=>S.userData.paint)?.material||new Ct({color:14268004}),o=n.hood,c=o.back-o.front,l=o.frontY-o.y;this.hood=new Je,this.hood.position.set(0,o.y+.012,o.back),this.details.add(this.hood);let h=new Qe;h.setAttribute("position",new De([-o.w,0,0,o.w,0,0,o.w*1.04,l*.45+.02,-c*.62,o.w*.76,l+.06,-c,-o.w*.78,l+.03,-c,-o.w*1.05,l*.45+.01,-c*.62],3)),h.setIndex([0,1,2,0,2,5,5,2,3,5,3,4]),h.computeVertexNormals(),this.hoodPanel=new Me(h,a),this.hoodPanel.userData.paint=!0,this.hoodPanel.castShadow=!0,this.hood.add(this.hoodPanel);let u=new Me(h,new Ct({color:2306363,roughness:.86,side:zt}));this.hood.add(u),this.engineBay=new Me(new yt(o.w*1.7,.025,c*.75),new Ct({color:1582380,roughness:.9})),this.engineBay.position.set(0,o.y+l*.5,o.back-c*.5),this.details.add(this.engineBay),this.loosePanel=new Je,this.loosePanel.position.set(n.side.x+.005,n.side.y,n.side.z),this.details.add(this.loosePanel);let f=new Me(new yt(.035,.28,.64),a);f.position.set(.04,-.1,.2),f.userData.paint=!0,this.loosePanel.add(f);let d=n.side.x+.022,m=n.side.y,x=new Qe().setAttribute("position",new De([d,m-.09,-.25,d,m-.04,.7,d,m-.17,.02,d,m-.11,.9,d,m+.02,.21,d,m+.05,.73],3));this.scrapes=new Di(x,new xi({color:12240584})),this.details.add(this.scrapes),this.smokeAnchor=[.35,o.frontY+.06,o.front+.25],this.particles=new Je,e.add(this.particles);let g=document.createElement("canvas");g.width=g.height=64;let p=g.getContext("2d"),b=p.createRadialGradient(32,32,0,32,32,32);b.addColorStop(0,"#d3dcdbbb"),b.addColorStop(.45,"#a4b4b76b"),b.addColorStop(1,"#73888d00"),p.fillStyle=b,p.fillRect(0,0,64,64);let M=new yi(g);M.colorSpace=Ft,this.smoke=Array.from({length:12},(S,A)=>{let R=new mi(new Yn({map:M,transparent:!0,depthWrite:!1,opacity:0}));return R.visible=!1,this.particles.add(R),{mesh:R,life:2,seed:A}});let _=new yt(.025,.025,.14),P=new ft({color:16766357});this.sparks=Array.from({length:10},(S,A)=>{let R=new Me(_,P);return R.visible=!1,this.particles.add(R),{mesh:R,life:1,seed:A}}),this.protection=new Me(new ns(1.65,1.71,40),new ft({color:12052191,transparent:!0,opacity:.18,depthWrite:!1})),this.protection.rotation.x=-Math.PI/2,this.protection.scale.y=1.55,this.protection.visible=!1,e.add(this.protection),this.origin=new N,this.setStage(0)}setStage(e){if(this.stage!==e){this.stage=e;for(let{mesh:t,base:n}of this.deformable){let s=t.geometry.attributes.position;for(let r=0;r<n.length;r+=3){let a=hc((-n[r+2]-1.25)/.9,0,1),o=e*a;s.array[r]=n[r]*(1-o*.035),s.array[r+1]=n[r+1]-o*(.022+.025*Math.max(0,n[r])),s.array[r+2]=n[r+2]+o*(.065+.025*Math.sin(n[r]*5))}s.needsUpdate=!0,t.geometry.computeVertexNormals(),t.geometry.computeBoundingSphere()}this.cracks.visible=this.scrapes.visible=e>0,this.hood.visible=this.engineBay.visible=this.loosePanel.visible=e>=2}}reset(e){this.state=e,this.lastImpact=e?.lastImpact||null,this.spawnClock=0,this.setStage(e?.damage||0);for(let t of[...this.smoke,...this.sparks])t.mesh.visible=!1,t.life=2;this.hood.rotation.set(0,0,0),this.loosePanel.rotation.set(0,0,0),this.protection.visible=!1}update(e,t,n={},s=!1){this.state!==t&&this.reset(t);let r=t?.damage||0;this.setStage(r),this.car.updateWorldMatrix(!0,!1),this.origin.set(...this.smokeAnchor).applyMatrix4(this.car.matrixWorld);let a=!!n.reduced,o=n.graphics==="battery";if((t?.lastImpact||null)!==this.lastImpact&&(this.lastImpact=t.lastImpact,!a))for(let u of this.sparks){let f=u.seed*2.4;u.life=0,u.mesh.position.copy(this.origin),u.vx=Math.sin(f)*3.3,u.vy=1.3+u.seed%3*.5,u.vz=2+u.seed%4,u.mesh.visible=!0}if(r>=2){let u=t?.elapsed||0;this.hood.rotation.x=.17+(r===3?.06:0)+(a?0:Math.sin(u*17)*.012),this.hood.rotation.z=-.025,this.loosePanel.rotation.z=-.14+(a?0:Math.sin(u*15)*.035)}this.protection.visible=!!t&&t.invulnerable>0&&r<3&&!["paused","finished","failed","countdown"].includes(t.status),this.protection.position.set(this.car.position.x,.065,this.car.position.z);let c=t?.lastImpact?t.elapsed-t.lastImpact.at:1/0;if(c<.45&&!a&&!s){let u=Math.sin(c*42)*(1-c/.45);this.car.rotation.z+=u*.065,this.car.position.y+=Math.abs(u)*.045}if(a)for(let u of[...this.smoke,...this.sparks])u.mesh.visible=!1;if(s)return;let l=(t?.arena.speed||0)*(t?.speedFactor||0)*(t?.worldTimeScale??1),h=e*(t?.worldTimeScale??1);if(r>=2&&!a){this.spawnClock+=h;let u=o?.25:r===3?.065:.13;if(this.spawnClock>=u){this.spawnClock%=u;let f=this.smoke.find(d=>!d.mesh.visible);f&&(f.life=0,f.mesh.position.copy(this.origin),f.mesh.visible=!0,f.mesh.material.color.setHex(r===3?7175041:14871012))}}for(let u of this.smoke)if(u.mesh.visible){u.life+=h,u.mesh.visible=u.life<1.1&&u.mesh.position.z<13,u.mesh.position.x+=h*(.7+Math.sin(u.seed)*.2),u.mesh.position.y+=h*.65,u.mesh.position.z+=h*(l+1.2);let f=.25+u.life*.65;u.mesh.scale.setScalar(f),u.mesh.material.opacity=(r===3?.55:.3)*Math.pow(Math.max(0,1-u.life/1.1),1.5)}for(let u of this.sparks)u.mesh.visible&&(u.life+=h,u.vy-=h*9,u.mesh.position.x+=u.vx*h,u.mesh.position.y+=u.vy*h,u.mesh.position.z+=(u.vz+l)*h,u.mesh.rotation.x=u.seed+u.life*12,u.mesh.visible=u.life<.45&&u.mesh.position.y>.06);if(a)for(let u of[...this.smoke,...this.sparks])u.mesh.visible=!1}};var pu=new Map,mu=new Map,gu=new Map,Yv=new or({color:3495787,roughness:.06,metalness:.4,clearcoat:1,clearcoatRoughness:.04,envMapIntensity:1.6}),Rp=new Ct({vertexColors:!0,roughness:.52,metalness:.32}),Zv=new Ct({vertexColors:!0,roughness:.6,metalness:.28}),Jv=new ft({vertexColors:!0}),Kv=new ft({vertexColors:!0}),jv=new Ct({vertexColors:!0,roughness:.6,metalness:.05}),Qv=new ft({color:9692671,transparent:!0,opacity:.85,blending:yn,depthWrite:!1}),eb=new ft({color:16762519,transparent:!0,opacity:.85,blending:yn,depthWrite:!1}),Cp=[9413549,13225937,7307148,12035471,9281418,14209732,6253690];function Ip(i){return mu.has(i)||mu.set(i,new or({color:i,roughness:.34,metalness:.22,clearcoat:.85,clearcoatRoughness:.16})),mu.get(i)}var tb=(i,e)=>new Ae(i).multiplyScalar(e).getHex();function vn(i,e=.7,t=0,n=0){let s=[i,e,t,n].join();return pu.has(s)||pu.set(s,new Ct({color:i,roughness:e,metalness:t,emissive:n,emissiveIntensity:n?.7:0})),pu.get(s)}var Ua={arch:new _i(.48,.07,5,18,Math.PI),rock:new Jn(1,1),leaf:new Bn(1,10,5),carTrim:new Pa(1,1,1,2,.09),contact:new Ot(1,1),coach:new Pa(1,1,1,1,.09),box:new yt(1,1,1),sphere:new Bn(1,12,8),cone:new Zn(1,1,6),cylinder:new ln(1,1,1,18)};function _e(i,e,t,n,s,r,a=1,o=1,c=1,l=.7,h=0,u=0){let f=new Me(Ua[e],vn(t,l,h,u));return f.position.set(n,s,r),f.scale.set(a,o,c),i.add(f),f}function ti(i,e=512,t=1024){let n=document.createElement("canvas");n.width=e,n.height=t,i(n.getContext("2d"),e,t);let s=new yi(n);return s.colorSpace=Ft,s}function nb(i,e="#ffd976",t=""){return ti((n,s,r)=>{n.fillStyle="#192c43",n.fillRect(0,0,s,r),n.strokeStyle=e,n.lineWidth=12,n.strokeRect(12,12,s-24,r-24),n.textAlign="center",n.fillStyle=e,n.font="900 120px sans-serif",n.fillText(i,s/2,145),t&&(n.fillStyle="#fff",n.font="bold 28px sans-serif",n.fillText(t,s/2,207))},512,256)}function Pp(i,e,t){if(!gu.has(i)){let n=ti((s,r,a)=>{s.fillStyle="#11283b",s.fillRect(0,0,r,a),s.strokeStyle="#"+t.toString(16).padStart(6,"0"),s.lineWidth=12,s.strokeRect(7,7,r-14,a-14),s.fillStyle="#fff5dd",s.font="900 142px sans-serif",s.textAlign="center",s.fillText(e,r/2,163),s.font="bold 22px sans-serif",s.fillStyle="#a9c9d9",s.fillText("WORDRAMP",r/2,212)},192,256);gu.set(i,new Ct({map:n,roughness:.56,metalness:.08}))}return gu.get(i)}var dc=class{constructor(e,t){this.container=e,this.viewport={width:innerWidth,height:innerHeight},this.renderer=t||new ec({antialias:!0,powerPreference:"high-performance"}),this.preferences={graphics:"auto",reduced:!1},this.performanceBudget=Fc("auto",window.devicePixelRatio||1),this.renderer.setPixelRatio(this.performanceBudget.ratio),this.renderer.setSize(innerWidth,innerHeight),this.renderer.outputColorSpace=Ft,this.renderer.toneMapping=dl,this.renderer.toneMappingExposure=1.12,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=sl,e.append(this.renderer.domElement),this.scene=new aa,this.camera=new Qt(52,innerWidth/innerHeight,.25,700),this.hemi=new ba(14216959,5467753,1.4),this.scene.add(this.hemi),this.sun=new lr(16769459,3.4),this.sunOffset=new N(-34,62,38),this.focusTint=new Ae(10273972),this.sun.target.position.set(0,0,-14),this.sun.position.copy(this.sun.target.position).add(this.sunOffset),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(1024,1024),Object.assign(this.sun.shadow.camera,{left:-26,right:26,top:34,bottom:-34,near:10,far:170}),this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.035,this.sun.shadow.radius=3,this.scene.add(this.sun,this.sun.target),this.rim=new lr(10214640,1.05),this.rim.position.set(30,20,-50),this.scene.add(this.rim),this.player=this.makeCar(15973461,!0),this.scene.add(this.player),this.player.position.z=4,this.damageFx=new uc(this.scene,this.player),this.rivalCars=[],this.spectators=new cc(this.scene),this.trail=new Je,this.scene.add(this.trail);for(let n=0;n<12;n++){let s=_e(this.trail,"box",8440760,0,.08,0,.08,.025,.32,.4,0,5809551);s.visible=!1}this.boostFx=new ac(this.scene,this.player),this.exhaust=this.boostFx.exhaust,this.lookConfig={color:15973461,badge:0,trail:!1},this.shadow=new Me(new Ot(3.2,5.9),new ft({map:ti((n,s,r)=>{n.shadowColor="rgba(0,0,0,.62)",n.shadowBlur=22,n.fillStyle="rgba(0,0,0,.62)";let a=s*.2,o=r*.14,c=s*.6,l=r*.72,h=26;n.beginPath(),n.moveTo(a+h,o),n.arcTo(a+c,o,a+c,o+l,h),n.arcTo(a+c,o+l,a,o+l,h),n.arcTo(a,o+l,a,o,h),n.arcTo(a,o,a+c,o,h),n.fill()},128,256),transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2})),this.shadow.rotation.x=-Math.PI/2,this.shadow.position.set(0,.07,4),this.scene.add(this.shadow),this.nitroReadyGlow=new Me(new Ot(4.8,6.9),new ft({map:ti((n,s,r)=>{let a=n.createRadialGradient(s/2,r/2,0,s/2,r/2,s/2);a.addColorStop(0,"#71daff00"),a.addColorStop(.42,"#71daff00"),a.addColorStop(.7,"#71daff88"),a.addColorStop(1,"#71daff00"),n.fillStyle=a,n.fillRect(0,0,s,r)},128,128),transparent:!0,depthWrite:!1,opacity:.65})),this.nitroReadyGlow.rotation.x=-Math.PI/2,this.nitroReadyGlow.visible=!1,this.scene.add(this.nitroReadyGlow),this.world=new Je,this.scene.add(this.world),this.gates=new Map,this.gate=new Je,this.roadBoards=new Je,this.scene.add(this.roadBoards),this.signAnchors=[],this.promptAnchor=new N,this.traffic=[],this.elapsed=0,this.showcaseDistance=0,this.currentLane=0,this.index=-1,this.lastGate="",this.gateTextures=[],this.setup(0),this.look=new N,this.resize(),window.addEventListener("resize",()=>this.resize()),this.viewportObserver=typeof ResizeObserver=="function"?new ResizeObserver(()=>this.resize()):null,this.viewportObserver?.observe(e),this.renderer.domElement.addEventListener("webglcontextlost",n=>{n.preventDefault(),document.dispatchEvent(new Event("graphicslost"))}),this.renderer.domElement.addEventListener("webglcontextrestored",()=>location.reload())}setPreferences(e){let t=this.preferences.graphics!==e.graphics;this.preferences=e,t&&(this.performanceBudget=Fc(e.graphics,window.devicePixelRatio||1),this.renderer.setPixelRatio(this.performanceBudget.ratio),this.resize()),this.renderer.shadowMap.enabled=e.graphics!=="battery"}samplePerformance(e,t){ju(this.performanceBudget,e,t)&&(this.renderer.setPixelRatio(this.performanceBudget.ratio),this.resize())}resize(){let e=Math.max(1,this.container.clientWidth||innerWidth),t=Math.max(1,this.container.clientHeight||innerHeight);this.resized&&e===this.viewport.width&&t===this.viewport.height||(this.viewport={width:e,height:t},this.resized=!0,this.renderer.setSize(e,t),this.camera.aspect=e/t,this.camera.updateProjectionMatrix())}makeCar(e,t=!1,n=t?"coupe":"sedan"){let s=fp(n),r=s.anchors,a=new Je,o=[],c=[],l=[],h=new Me(s.paint,Ip(e));h.userData.paint=!0,a.add(h);let u=new Me(s.glass,Yv);if(a.add(u),a.add(new Me(s.trim,Rp),new Me(s.lights,Jv)),s.stripes){let f=new Me(s.stripes,Rp);f.userData.stripes=!0,a.add(f)}for(let f of[-1,1]){for(let x of s.wheelSpec.z){let g=new Je,p=new Je;g.position.set(f*s.wheelSpec.x,s.wheelSpec.r,x),g.add(p),p.add(new Me(s.wheel,Zv)),a.add(g),g.userData.front=x<0,g.userData.spin=p,o.push(g)}c.push(_e(a,"coach",8862019,f*r.lamps.x,r.lamps.y,r.lamps.z,r.lamps.w,.11,.05,.2,.2,5969952));let d=new Ut;d.add("i",Ua.box,16757575,f*(r.lamps.x+r.lamps.w/2+.05),r.lamps.y,r.lamps.z+.01,.12,.08,.04),d.add("i",Ua.box,16757575,f*(r.head.x+.24),r.head.y,r.head.z+.06,.12,.06,.04);let m=new Me(d.merge("i"),Kv);m.userData.indicator=f,m.visible=!1,l.push(m),a.add(m)}return a.traverse(f=>{f.isMesh&&(f.castShadow=f!==u,f.receiveShadow=!0)}),a.userData={indicators:l,wheels:o,brakeLights:c,wheelAngle:0,anchors:r,kind:n},a.userData.hitBounds=new wn().setFromObject(a),a}animateCar(e,t,n,s){for(let r of e.userData.wheels||[])r.rotation.y=r.userData.front?n:0,r.userData.spin.rotation.x=t;for(let r of e.userData.brakeLights||[])r.material=s?vn(16737636,.2,.2,16722217):vn(8862019,.2,.2,5969952)}setCosmetics(e){if(this.lookConfig=e,!this.teamRoundel){this.teamRoundel=new Me(new Ot(.73,.97).rotateX(-Math.PI/2));let t=this.player.userData.anchors;this.teamRoundel.position.set(0,t.roofY+.004,t.roofZ),this.teamRoundel.scale.setScalar(.82),this.player.add(this.teamRoundel)}if(this.teamRoundel.visible=!!e.teamId,e.teamId&&(this.teamRoundel.material=Pp(e.teamId,e.teamId[0].toUpperCase(),e.color)),this.player.traverse(t=>{t.userData.paint&&(t.material=Ip(e.color))}),!this.hoodBadge){let t=this.player.userData.anchors.badge;this.hoodBadge=_e(this.player,"cylinder",16244641,0,t.y+.006,t.z,.2,.02,.2,.3,.6,5784864),this.hoodBadge.userData.cosmetic=!0;let n=new rr;for(let s=0;s<10;s++){let r=s*Math.PI/5-Math.PI/2,a=s%2?.065:.15;s===0?n.moveTo(Math.cos(r)*a,Math.sin(r)*a):n.lineTo(Math.cos(r)*a,Math.sin(r)*a)}n.closePath(),this.badgeStar=new Me(new ya(n),vn(4017499,.3,.5)),this.badgeStar.rotation.x=-Math.PI/2,this.badgeStar.position.set(0,t.y+.02,t.z),this.player.add(this.badgeStar)}this.hoodBadge.visible=this.badgeStar.visible=e.badge>0,this.hoodBadge.material=vn([16244641,11129550,15319923,13812460][e.badge]||16244641,.3,.6)}addContactShadow(e){this.contactMaterial||(this.contactMaterial=this.shadow.material.clone(),this.contactMaterial.opacity=.52);let t=new Me(Ua.contact,this.contactMaterial);t.rotation.x=-Math.PI/2,t.scale.set(3,5.4,1),t.position.y=.055,this.scene.add(t),e.userData.contactShadow=t}placeContactShadow(e){let t=e.userData.contactShadow;t&&(t.visible=e.visible,t.position.set(e.position.x,.055,e.position.z),t.rotation.z=-e.rotation.y)}syncRivals(e){if(this.rivalState!==e){for(let t of this.rivalCars)t.userData.contactShadow&&this.scene.remove(t.userData.contactShadow),this.scene.remove(t),t.traverse(n=>{n.isMesh&&n.userData.ownGeometry&&n.geometry.dispose()});this.rivalCars=[],this.rivalState=e;for(let t of e?.rivals||[]){let n=this.makeCar(t.color,!1,"gt"),s=n.userData.anchors;n.userData.rival=t;let r=new Me(new Ot(.62,.8).rotateX(-Math.PI/2),Pp("rival"+t.id,String(t.id+2).padStart(2,"0"),t.color));r.userData.ownGeometry=!0,r.position.set(0,s.roofY+.004,s.roofZ),n.add(r);let a=new Je;for(let o of[-1,1]){let c=_e(a,"cone",t.id?16762519:9692671,o*s.exhaust[0],s.exhaust[1],s.exhaust[2]+.5,.11,.85,.11,.2,0,t.id?16750168:4569327);c.rotation.x=-Math.PI/2,c.material=t.id?eb:Qv}a.visible=!1,n.add(a),n.userData.nitroExhaust=a,this.scene.add(n),this.addContactShadow(n),this.rivalCars.push(n)}}}rivalProjection(){return this.camera.updateMatrixWorld(),this.rivalCars.map(e=>{let t=e.position.clone();return t.y+=2.5,t.project(this.camera),{id:e.userData.rival.id,x:(t.x*.5+.5)*this.viewport.width,y:(-.5*t.y+.5)*this.viewport.height,visible:e.visible&&t.z>-1&&t.z<1&&e.position.z<-3}})}ribbon(e,t,n,s,r=.13){let a=[];for(let h=0;h<t.length-1;h++){let u=t[h],f=t[h+1];a.push(u.x-n/2,r,-u.at,u.x+n/2,r,-u.at,f.x-n/2,r,-f.at,f.x-n/2,r,-f.at,u.x+n/2,r,-u.at,f.x+n/2,r,-f.at)}let o=new Qe;o.setAttribute("position",new De(a,3)),o.computeVertexNormals();let c=[];for(let h=0;h<a.length;h+=3)c.push(a[h]/10.8,-a[h+2]/20);o.setAttribute("uv",new De(c,2));let l=new Me(o,s===this.palette.road?this.asphaltMaterial:vn(s));return l.receiveShadow=!0,e.add(l),l}setup(e){if(e===this.index)return;this.index=e;let t=du[e];this.arenaLook=t,this.palette={road:t.road};for(let l of this.segments||[])for(let h of[...l.userData.roadSurfaces,...l.userData.roadside])h.geometry.dispose();for(let l of this.landmarks||[])l.group.traverse(h=>{h.isMesh&&h.geometry!==this.rotorGeometry&&h.geometry.dispose()});this.world.traverse(l=>{l.isMesh&&l.userData.ownGeometry&&l.geometry.dispose()}),this.world.clear(),this.kit?.dispose();for(let l of[this.roadTexture,this.asphaltTexture,this.reflectionTexture,this.waterNormal,this.cloudTexture])l?.dispose();for(let l of[this.roadMaterial,this.asphaltMaterial,this.waterMaterial,this.sceneryMaterial])l?.dispose();this.rain&&(this.scene.remove(this.rain),this.rain.geometry.dispose(),this.rain.material.dispose(),this.rain=null),this.waterNormal=null,this.segments=[],this.courseState=void 0,this.kit=_p(e),this.scene.fog=new ra(t.fog,t.fogNear,t.fogFar),this.scene.background=new Ae(t.horizon),this.sun.color.set(t.sun),this.sun.intensity=t.sunIntensity,this.sunOffset.set(...t.sunPosition),this.hemi.color.set(t.hemiSky),this.hemi.groundColor.set(t.hemiGround),this.hemi.intensity=t.hemi,this.rim.color.set(t.rim),this.rim.intensity=t.rimIntensity,this.renderer.toneMappingExposure=t.exposure;let n=bp(t);n.userData.ownGeometry=!0,this.world.add(n),this.skyDome=n;let s=Mp(e,t);s.userData.ownGeometry=!0,this.world.add(s);let r=l=>"#"+new Ae(l).getHexString();this.reflectionTexture=ti((l,h,u)=>{let f=l.createLinearGradient(0,0,0,u);f.addColorStop(0,r(t.zenith)),f.addColorStop(.46,r(t.horizon)),f.addColorStop(.5,r(t.sunGlow)),f.addColorStop(.54,r(t.hemiGround)),f.addColorStop(1,r(tb(t.hemiGround,.5))),l.fillStyle=f,l.fillRect(0,0,h,u);let d=l.createRadialGradient(h*.3,u*.32,1,h*.3,u*.32,30);d.addColorStop(0,"#fff8e4"),d.addColorStop(1,"#fff8e400"),l.fillStyle=d,l.fillRect(0,0,h,u)},256,128),this.reflectionTexture.mapping=cr,this.scene.environment=this.reflectionTexture,this.scene.environmentIntensity=e===2?.62:.7;let a=Math.min(8,this.renderer.capabilities?.getMaxAnisotropy?.()||1);this.asphaltTexture=ti((l,h,u)=>{l.fillStyle=r(t.road),l.fillRect(0,0,h,u);let f=window.RallyCore.random(101+e);for(let d=0;d<6e3;d++){l.fillStyle=d%3?"#ffffff07":"#0000000c";let m=d%7?2:3;l.fillRect(f()*h,f()*u,m,m)}for(let d of[1,3,5])for(let m of[-.045,.045]){let x=h*(d/6+m),g=l.createLinearGradient(x-14,0,x+14,0);g.addColorStop(0,"#00000000"),g.addColorStop(.5,e===2?"#ffffff0d":"#0000000f"),g.addColorStop(1,"#00000000"),l.fillStyle=g,l.fillRect(x-14,0,28,u)}l.strokeStyle="#00000024",l.lineWidth=2;for(let d=0;d<5;d++){l.beginPath();let m=f()*h,x=f()*u;l.moveTo(m,x);for(let g=0;g<5;g++)m+=(f()-.5)*40,x+=f()*30,l.lineTo(m,x);l.stroke()}},512,512),this.asphaltTexture.wrapS=this.asphaltTexture.wrapT=Li,this.asphaltTexture.anisotropy=a,this.asphaltMaterial=new Ct({map:this.asphaltTexture,roughness:t.roadRough,metalness:e===2?.18:.02}),this.roadTexture=ti((l,h,u)=>{l.drawImage(this.asphaltTexture.image,0,0,h,u),l.strokeStyle=e===2?"#e6e9f4":"#f1ede0",l.lineWidth=7,l.beginPath(),l.moveTo(16,0),l.lineTo(16,u),l.moveTo(h-16,0),l.lineTo(h-16,u),l.stroke(),l.setLineDash([88,72]),l.lineWidth=6;for(let f of[h/3,h*2/3])l.beginPath(),l.moveTo(f,0),l.lineTo(f,u),l.stroke()},512,1024),this.roadTexture.wrapS=this.roadTexture.wrapT=Li,this.roadTexture.anisotropy=a;let o=new Ct({map:this.roadTexture,roughness:t.roadRough,metalness:e===2?.18:.02});if(this.roadMaterial=o,this.sceneryMaterial=new Ct({vertexColors:!0,roughness:e===2?.74:.88,metalness:0}),e===1){this.waterNormal=ti((h,u,f)=>{h.fillStyle="#8080ff",h.fillRect(0,0,u,f);for(let d=0;d<f;d+=4)for(let m=0;m<u;m+=4){let x=Math.sin(m*.07+Math.sin(d*.08)*2),g=Math.cos(d*.13+Math.sin(m*.04));h.fillStyle=`rgb(${128+Math.round(x*28)},${128+Math.round(g*22)},245)`,h.fillRect(m,d,4,4)}},256,256),this.waterNormal.colorSpace=Hn,this.waterNormal.wrapS=this.waterNormal.wrapT=Li,this.waterNormal.repeat.set(40,40),this.waterMaterial=new Ct({color:t.water,roughness:.16,metalness:.18,normalMap:this.waterNormal,normalScale:new ue(.5,.5),envMapIntensity:1.3});let l=new Me(new Ot(1600,1100).rotateX(-Math.PI/2),this.waterMaterial);l.position.set(0,-3.3,-260),l.userData.ownGeometry=!0,l.receiveShadow=!0,this.world.add(l)}else{let l=new Me(new yt(1100,1,900),new Ct({color:t.ground,roughness:1}));l.position.set(0,-.56,-230),l.userData.ownGeometry=!0,l.receiveShadow=!0,this.world.add(l)}for(let l=0;l<19;l++){let h=new Je,u=new Me(new Ot(10.8,20,1,8).rotateX(-Math.PI/2),o);u.position.y=.02,u.receiveShadow=!0,h.add(u);let f=new Me(new Ot(10.8,20,1,8).rotateX(-Math.PI/2),this.asphaltMaterial);f.position.y=.02,f.receiveShadow=!0,h.add(f),h.userData.roadSurfaces=[u,f],h.userData.flexSurfaces=[u,f],h.userData.roadside=[],h.userData.scenery=[];for(let d of[-1,1]){let m=Object.values(this.kit.roadside)[0][0][d],x=new Me(m.clone(),this.sceneryMaterial);x.userData.side=d,x.receiveShadow=!0,x.userData.flatPositions=m.attributes.position.array,x.userData.flatNormals=m.attributes.normal.array,h.add(x),h.userData.roadside.push(x),h.userData.flexSurfaces.push(x);let g=new Me(this.kit.empty,this.sceneryMaterial);h.add(g),h.userData.scenery.push({mesh:g,group:g,side:d})}for(let d of[u,f])d.userData.flatPositions=d.geometry.attributes.position.array.slice(),d.userData.flatNormals=d.geometry.attributes.normal.array.slice();this.world.add(h),this.segments.push(h)}this.landmarks=[],this.rotorGeometry??=wp();for(let l of Sp(e,window.RallyCore.ARENAS[e].length)){let h=Ep(e,l.kind,t),u=new Je,f=new Me(h.static,this.sceneryMaterial);u.add(f);let d=(h.rotors||[]).map(([m,x,g])=>{let p=new Me(this.rotorGeometry,this.sceneryMaterial);return p.position.set(m,x,g),u.add(p),p});u.visible=!1,this.world.add(u),this.landmarks.push({...l,...h,group:u,rotors:d})}this.cloudTexture=ti((l,h,u)=>{for(let f=0;f<9;f++){let d=h*(.2+.6*Math.random()),m=u*(.45+.2*Math.random()),x=h*(.12+.12*Math.random()),g=l.createRadialGradient(d,m,1,d,m,x);g.addColorStop(0,"#ffffffcc"),g.addColorStop(1,"#ffffff00"),l.fillStyle=g,l.fillRect(0,0,h,u)}},256,128),this.clouds=[];let c=window.RallyCore.random(921+e);for(let l=0;l<(e===2?14:9);l++){let h=new mi(new Yn({map:this.cloudTexture,color:e===2?7174291:16777215,opacity:e===2?.85:e===1?.5:.62,transparent:!0,fog:!1,depthWrite:!1})),u=e===2?120+c()*90:70+c()*70;h.scale.set(u,u*.36,1),h.position.set((c()-.5)*620,e===2?48+c()*30:70+c()*50,-300-c()*170),h.renderOrder=-8,h.userData.drift=.6+c()*.8,this.world.add(h),this.clouds.push(h)}if(e===2){let l=new gi(new yt(.018,1.1,.018),new ft({color:13096172,transparent:!0,opacity:.2,depthWrite:!1,fog:!1}),320);l.frustumCulled=!1,l.instanceMatrix.setUsage(as),l.userData.drops=Array.from({length:320},(h,u)=>[(c()-.5)*44,c()*20,-c()*70+4,.7+c()*.6]),this.scene.add(l),this.rain=l}this.tunnels=fu(e,window.RallyCore.ARENAS[e].length,[]),this.clearGate()}edge(e,t){let n=this.apronWidth(e);for(let s of this.forkRoutes||[]){if(e<s.bounds.start||e>s.bounds.end)continue;let r=s.routes[0],a=c=>(c=Ht.clamp(c,0,1),c*c*c*(10+c*(-15+6*c))),o;if(e<r.start)o=3.35+8.2-2.8*a((e-s.bounds.start)/30);else if(e>r.end)o=3.35+5.4+2.8*a((e-r.end)/40);else{let c=s.routes.map(l=>l.lane*3.35+window.RallyCore.routeOffset(l,e));o=t>0?Math.max(...c)+5.4:5.4-Math.min(...c)}n=Math.max(n,o)}return n}rebuildChunk(e,t,n){let s=vp(this.index,t,{tunnels:this.tunnels});e.userData.plan=s;for(let[l,h]of e.userData.roadSurfaces.entries())h.geometry.dispose(),h.geometry=this.mainRoadGeometry(n,l===1),h.userData.flatPositions=h.geometry.attributes.position.array.slice(),h.userData.flatNormals=h.geometry.attributes.normal.array.slice();for(let l of e.userData.roadside){let[h,u]=s.roadside[l.userData.side],f=this.kit.roadside[h],d=f[u%f.length][l.userData.side];l.geometry.dispose(),l.geometry=d.clone(),l.userData.flatPositions=d.attributes.position.array,l.userData.flatNormals=d.attributes.normal.array,l.castShadow=!!s.tunnel}let r={"-1":5.4,1:5.4};for(let l=-10;l<=10;l+=2.5)for(let h of[-1,1])r[h]=Math.max(r[h],this.edge(n-l,h));for(let l of e.userData.scenery){let h=s.scenery[l.side];l.mesh.geometry=h<0?this.kit.empty:this.kit.scenery[l.side][h],l.mesh.position.x=l.side*(r[l.side]+5.6)}let a=e.rotation.y,o=Math.cos(a),c=Math.sin(a);for(let l of e.userData.flexSurfaces){let h=l.geometry.attributes.position,u=l.geometry.attributes.normal,f=l.userData.flatPositions,d=l.userData.flatNormals,m=l.userData.side||0;for(let x=0;x<f.length;x+=3){let g=f[x+2],p=n-g,b=f[x]+(m?m*(this.edge(p,m)-5.4):0)+this.curve(p)-this.curve(n);h.array[x]=o*b-c*g,h.array[x+1]=f[x+1],h.array[x+2]=c*b+o*g;let M=d[x],_=d[x+1],P=d[x+2]+(this.curve(p+.1)-this.curve(p-.1))/.2*M,S=Math.hypot(M,_,P)||1;u.array[x]=(o*M-c*P)/S,u.array[x+1]=_/S,u.array[x+2]=(c*M+o*P)/S}h.needsUpdate=!0,u.needsUpdate=!0,l.geometry.computeBoundingSphere()}}curve(e){return window.RallyCore.courseCurve(this.index,e)}heading(e,t){let n=window.RallyCore;return-Math.atan((this.curve(e+1)+n.routeOffset(t,e+1)-this.curve(e-1)-n.routeOffset(t,e-1))/2)}prepareCourse(e){if(this.courseState===e&&this.courseRevision===e?.taskRevision)return;this.courseState=e,this.courseRevision=e?.taskRevision,this.roadReservations=[],this.forkRanges=[],this.apronRanges=[];for(let a of e?.tasks||[]){let o=window.RallyCore.taskZone(a);this.roadReservations.push({start:o.start-80,end:o.end+80}),this.apronRanges.push({start:o.start-70,fullStart:o.start-30,fullEnd:o.end+25,end:o.end+80}),a.kind==="junction"&&this.forkRanges.push(ic(window.RallyCore.makeRoute(e,a,0,!0)))}let t=window.RallyCore;this.forkRoutes=(e?.tasks||[]).filter(a=>a.kind==="junction").map(a=>{let o=[0,1,2].map(c=>t.makeRoute(e,a,c,c===a.correctIndex));return{routes:o,bounds:ic(o[0])}});let n=(e?.tasks||[]).map(a=>t.taskZone(a)),s=n.map(a=>({start:a.start-80,end:a.end+80})),r=e?.arena?.length??t.ARENAS[this.index].length;s.push({start:r-260,end:r+200}),this.tunnels=fu(this.index,r,e?s:[]),this.spectators.blocked=this.tunnels;for(let a of this.segments)a.userData.curveIndex=void 0}apronWidth(e){let t=s=>(s=Ht.clamp(s,0,1),s*s*s*(10+s*(-15+6*s))),n=5.4;for(let s of this.apronRanges||[]){let r=Math.min(t((e-s.start)/(s.fullStart-s.start)),t((s.end-e)/(s.end-s.fullEnd)));n=Math.max(n,5.4+6.15*r)}return n}mainRoadGeometry(e,t=!1){let n=e-10,s=e+10,r=new Set;for(let d=0;d<=8;d++)r.add(n+d*2.5);for(let d of this.forkRanges||[])for(let m of[d.start,d.end])m>n&&m<s&&r.add(m);let a=[...r].sort((d,m)=>d-m),o=[],c=[],l=[],h=[],u=t?4:2;a.forEach(d=>{let m=this.apronWidth(d),x=t?[-m,-5.4,5.4,m]:[-5.4,5.4];for(let g of x)o.push(g,0,e-d),h.push(0,1,0),c.push(t?g/10.8:g<0?0:1,d/20)});for(let d=0;d<a.length-1;d++){let m=(a[d]+a[d+1])/2;if(!(this.forkRanges?.some(x=>m>x.start&&m<x.end)||t&&this.apronWidth(m)<5.40001))for(let x=0;x<u;x+=2){let g=d*u+x;l.push(g,g+1,g+u,g+u,g+1,g+u+1)}}let f=new Qe;return f.setAttribute("position",new De(o,3)),f.setAttribute("normal",new De(h,3)),f.setAttribute("uv",new De(c,2)),f.setIndex(l),f}clearGate(){for(let e of this.gates.values())this.disposeGate(e);this.gates.clear(),this.gate=new Je,this.lastGate="",this.preparedState=null}disposeGate(e){this.scene.remove(e),e.traverse(t=>{(t.isMesh||t.isLine)&&!Object.values(Ua).includes(t.geometry)&&t.geometry.dispose()}),(e.userData.textures||[]).forEach(t=>t.dispose()),(e.userData.ownMaterials||[]).forEach(t=>t.dispose())}makePerson(e,t,n){let s=new Je;s.scale.setScalar(1.5);let r=[13935748,12947056,14858650,10974296][t%4],a=[7450538,12227686,9346240,11763341][t%4];_e(s,"box",a,0,1.48,0,.65,.84,.38),_e(s,"sphere",r,0,2.18,0,.29,.32,.27),_e(s,"sphere",4800059,0,2.39,-.02,.3,.15,.27);for(let h of[-1,1]){let u=_e(s,"box",3426140,h*.19,.66,0,.23,.75,.25);u.userData.leg=h,_e(s,"box",2372938,h*.19,.2,.07,.28,.2,.43);let f=_e(s,"box",a,h*.39,1.44,.12,.2,.72,.23);f.rotation.z=h*.18,_e(s,"sphere",r,h*.42,1.16,.25,.12,.12,.12),_e(s,"sphere",2503746,h*.1,2.21,.25,.036,.036,.016)}let o=ti((h,u,f)=>{h.fillStyle="#f4e9d0",h.fillRect(0,0,u,f),h.strokeStyle="#44696b",h.lineWidth=12,h.strokeRect(7,7,u-14,f-14),h.textAlign="center",h.fillStyle="#20394c",h.font="bold "+(e.length>16?36:50)+"px sans-serif",h.fillText(e,u/2,145,u-40)},512,256);n.userData.textures.push(o);let c=new ft({map:o});n.userData.ownMaterials.push(c);let l=new Me(new Ot(1.45,.72),c);return l.position.set(0,1.22,.31),s.add(l),s.userData.personIndex=t,s.userData.signPoint=new N(0,1.22,.34),s}makeGate(e,t){let n=new Je;if(n.userData={task:e,textures:[],ownMaterials:[],barriers:[],repairSlabs:[]},e.kind==="finish"){for(let o of[-5.7,5.7])_e(n,"box",16504187,o,3,0,.45,6,.45);_e(n,"box",16767095,0,6,0,12,.8,.45);let s=nb("FINISH","#ffe296");n.userData.textures.push(s);let r=new ft({map:s});n.userData.ownMaterials.push(r);let a=new Me(new Ot(5,2.5),r);a.position.set(0,6,.3),n.add(a);for(let o=-5;o<5;o++)for(let c=0;c<3;c++)_e(n,"box",(o+c)%2?15003123:2373453,o+.5,.055,c,1,.025,1)}else if(e.kind==="pedestrian"){for(let r=-11;r<12;r+=2)_e(n,"box",15920856,0,.075,r,16.8,.025,.8);for(let r of[-1,1]){_e(n,"box",11913654,r*9.4,.12,0,2,.22,19),_e(n,"cylinder",8557470,r*5.9,2.4,-8,.12,4.8,.12);let a=_e(n,"box",15105385,r*5.9,4.6,-8,1.1,.6,.12);a.userData.crossingSignal=!0}_e(n,"box",15920856,0,.075,12,10.5,.025,.35);let s=new Je;for(let r=-32;r<=12;r+=8)_e(s,"box",8971717,0,.085,r,.16,.025,3,.4,0,3783052);s.visible=!1,n.add(s),n.userData.exitGuide=s,n.userData.people=e.people.map((r,a)=>{let o=this.makePerson(r.word,a,n);return n.add(o),o})}else if(e.kind==="light"){for(let s of[-1,1]){_e(n,"cylinder",4413546,s*12.1,3.2,0,.15,6.4,.15),_e(n,"box",4216680,s*6.1,6.4,0,12.2,.2,.25),_e(n,"box",1386040,s*3.25,5.6,0,.8,1.8,.7);for(let r=0;r<3;r++){let a=_e(n,"sphere",r===0?16737891:r===1?6181188:3361606,s*3.25,6.2-r*.57,.38,.22,.22,.08,.25,0,r===0?16728121:0);a.userData.bulb=r}}for(let s of[-1,-.4,.2])_e(n,"box",15986392,0,.04,s,10.3,.015,.22)}else if(e.kind==="repair"){let s=e.blocks.length*16;_e(n,"box",10318165,0,.03,-s/2,10.5,.05,s);for(let r=0;r<e.blocks.length;r++){let a=_e(n,"box",5467007,0,-1.5,-8-r*16,10.45,.12,15.85);n.userData.repairSlabs.push(a)}for(let r of[-1,1]){n.userData.barriers.push(_e(n,"box",15503954,r*3,1.3,-2,4,.25,.12));for(let a=0;a<3;a++)n.userData.barriers.push(_e(n,"cone",15832663,r*(3.2+a*.75),.5,1,.27,1,.27))}}else{let s=window.RallyCore,r=[0,1,2].map(p=>s.makeRoute(t,e,p,p===e.correctIndex)),a=up(r,p=>this.curve(p),s.routeOffset,e.at),o=new Qe;o.setAttribute("position",new De(a.positions,3)),o.setAttribute("uv",new De(a.uvs,2)),o.setIndex(a.indices),o.computeVertexNormals();let c=new Me(o,this.asphaltMaterial);c.position.y=.02,c.receiveShadow=!0,n.add(c),n.userData.forkSurface=c,n.userData.forkRows=a.rows;let l=[];for(let p=0;p<a.rows.length-1;p++){let b=a.rows[p],M=a.rows[p+1],_=S=>Math.min(...S.intervals.map(A=>A[0])),P=S=>Math.max(...S.intervals.map(A=>A[1]));l.push(_(b),0,-b.at,P(b),0,-b.at,_(M),0,-M.at,_(M),0,-M.at,P(b),0,-b.at,P(M),0,-M.at)}let h=new Qe;h.setAttribute("position",new De(l,3)),h.computeVertexNormals();let u=new Me(h,vn([8827004,12897481,6122339][this.index]||8827004,.95));u.position.y=-.03,u.receiveShadow=!0,n.add(u);let f=[];for(let[p,b]of a.edges)f.push(p[0],.043,-p[1],b[0],.043,-b[1]);let d=new Qe;d.setAttribute("position",new De(f,3));let m=new Di(d,new xi({color:13952218}));n.add(m),n.userData.edgeLine=m,n.userData.ownMaterials.push(m.material);for(let[p,b]of[[a.bounds.start,e.at],[r[0].end,a.bounds.end]])for(let M=p+4;M<b-2;M+=8)for(let _ of[-.5,.5]){let P=_e(n,"box",14082266,this.curve(M)-this.curve(e.at)+_*3.35,.043,e.at-M,.1,.015,2.2);P.rotation.y=this.heading(M)}let x=r[0],g=new Je;for(let p=x.end+4;p<=x.exitEndAt;p+=7)_e(g,"box",10016955,this.curve(p)-this.curve(e.at),.075,e.at-p,.18,.025,2.5,.4,0,3246951);g.visible=!1,n.add(g),n.userData.mergeGuide=g,n.userData.routePaths=[];for(let p=0;p<3;p++){let b=r[p],M=[];for(let A=0;A<=48;A++){let R=b.start+(b.end-b.start)*A/48;M.push({at:R-e.at,x:this.curve(R)-this.curve(e.at)+b.lane*3.35+s.routeOffset(b,R)})}let _=this.ribbon(n,M.map(A=>({...A,x:A.x-1.48})),.1,11843028,.045),P=this.ribbon(n,M.map(A=>({...A,x:A.x+1.48})),.1,11843028,.045),S=new Je;for(let A=b.start+8;A<b.end-5;A+=12){let R=this.curve(A)-this.curve(e.at)+b.lane*3.35+s.routeOffset(b,A),y=this.heading(A,b);for(let v of[-1,1]){let C=_e(S,"box",11843028,R+v*.28,.055,e.at-A,.09,.015,.8,.6);C.rotation.y=y+v*.7}}n.add(S),n.userData.routePaths.push({left:_,right:P,index:p,route:b,points:M,chevrons:S})}}return this.scene.add(n),this.gates.set(e.id,n),n}updateGates(e,t,n,s){if(!e)return;let r=e.tasks.concat({id:"finish",kind:"finish",at:e.arena.length});if(this.preparedState!==e){this.clearGate(),this.preparedState=e;for(let o of r)this.makeGate(o,e).visible=!1;this.preparedRevision=e.taskRevision}if(this.preparedRevision!==e.taskRevision){let o=new Set(r.map(c=>c.id));for(let[c,l]of this.gates)o.has(c)||(this.disposeGate(l),this.gates.delete(c));for(let c of r)!this.gates.has(c.id)&&c.at-t>window.RallyCore.TASK_VIEW_DISTANCE&&(this.makeGate(c,e).visible=!1);this.preparedRevision=e.taskRevision}for(let o of r){let c=o.at-t,l=o.kind==="finish"?80:window.RallyCore.taskZone(o).end-o.at+120,h=this.gates.get(o.id);if(h&&(h.visible=c<=window.RallyCore.TASK_VIEW_DISTANCE&&c>=-l,!!h.visible)){if(h.position.set(this.curve(o.at)-n,0,-c+4),o.kind==="junction"&&o.completed&&h.userData.chosenIndex!==o.chosenIndex){h.userData.chosenIndex=o.chosenIndex;for(let u of h.userData.routePaths||[]){let f=u.index===o.chosenIndex,d=vn(f?o.success?11136203:15843719:7637141,.55,0,f?o.success?2647883:7031849:0);u.left.material=u.right.material=d,u.chevrons.traverse(m=>{m.isMesh&&(m.material=d)})}}o.kind==="junction"&&(h.userData.mergeGuide.visible=!!e.mergeAssist&&e.mergeAssist.taskId===o.id&&window.RallyCore.exitAssist(e)===e.mergeAssist),o.kind==="light"&&o.success&&h.traverse(u=>{u.userData.bulb===0&&(u.material=vn(5977145)),u.userData.bulb===2&&(u.material=vn(6943671,.3,0,3992465))}),o.kind==="repair"&&(h.userData.repairSlabs.forEach((u,f)=>{let d=f<(o.chosen?.length||0);u.position.y=o.solved?.12:Ht.damp(u.position.y,d?.12:-1.5,12,s)}),h.userData.barriers.forEach(u=>u.visible=!o.solved)),o.kind==="pedestrian"&&(h.userData.exitGuide.visible=!!window.RallyCore.exitAssist(e)&&e.exitTask===o.id&&!window.RallyCore.crosswalkOccupied(e,o),h.traverse(u=>{u.userData.crossingSignal&&(u.material=window.RallyCore.crosswalkOccupied(e,o)?vn(15105385,.3,0,16737348):vn(8902333,.3,0,4908708))})),o.kind==="pedestrian"&&h.userData.people.forEach((u,f)=>{let d=o.people[f],m=d.sent?Math.min(1,(e.elapsed-d.sentAt)/window.RallyCore.PEDESTRIAN_WALK_TIME):0,x=d.side===0?-1:1,g=d.sent?d.sentAt:e.elapsed,p=o.peopleEntryAt==null?0:Math.min(1,Math.max(0,(g-o.peopleEntryAt)/window.RallyCore.PEDESTRIAN_ENTRY_TIME)),b=p*p*(3-2*p),M=d.originSide*8.4*(1-b),_=d.correct===!1?Math.max(0,(m-.35)/.65):m,P=_*_*(3-2*_),S=d.correct===!1&&m<.35?(d.selectedSide===0?-1:1)*2.4*Math.sin(m/.35*Math.PI):0;u.position.set(M*(1-P)+x*8.4*P+S,.03,o.at-d.at+m*1.5),u.rotation.y=x*P*1.05,u.traverse(A=>{A.userData.leg&&(A.rotation.x=d.sent||p>0&&p<1?Math.sin(this.elapsed*9)*.3*A.userData.leg:Math.sin(this.elapsed*2+f)*.025)})})}}for(let[o,c]of this.gates)c.userData.task.at-t<-(c.userData.task.kind==="finish"?80:window.RallyCore.taskZone(c.userData.task).end-c.userData.task.at+120)&&(this.disposeGate(c),this.gates.delete(o));let a=e.task||e.tasks[e.taskIndex];a?(this.gate=this.gates.get(a.id)||this.gate,this.lastGate=a.id,this.repairSlabs=this.gate.userData.repairSlabs||[]):e.distance>e.arena.length-170&&(this.gate=this.gates.get("finish")||this.gate,this.lastGate="finish")}pedestrianProjection(e){let t=this.gates.get(e.task?.id);return t?.userData.people?(t.updateWorldMatrix(!0,!0),this.camera.updateMatrixWorld(),t.userData.people.map(n=>{let s=n.userData.signPoint.clone();return n.localToWorld(s),s.project(this.camera),{x:(s.x*.5+.5)*this.viewport.width,y:(-.5*s.y+.5)*this.viewport.height,visible:s.z>-1&&s.z<1}})):[]}updateRoadBoards(e,t){let n=e?.task,s=["task","resolving"].includes(e?.status);if(this.roadBoards.visible=s,!s){this.signAnchors=[];return}if(this.roadBoards.children.length===0)for(let c=0;c<3;c++){let l=new Je;_e(l,"cylinder",6849686,0,1.3,0,.065,2.6,.065),_e(l,"box",16569464,0,.05,0,2.5,.025,1.2),this.roadBoards.add(l)}let r=window.RallyCore.currentRow(e)||e.task?.rows[0],a=this.curve(e.distance+13)-t,o=-9+(n.completed?Math.max(0,e.distance-n.completedDistance):0);this.roadBoards.position.set(a,0,o),this.signAnchors=[];for(let c=0;c<3;c++){let l=this.roadBoards.children[c];l.visible=n.kind!=="repair"&&!(n.kind==="pedestrian"&&c===1),l.position.set((c-1)*3.35,0,0),this.signAnchors.push(new N(l.position.x+a,3.4,o))}this.promptAnchor.set(a,6.2,-30)}roadProjection(){this.camera.updateMatrixWorld();let e=t=>{let n=t.clone().project(this.camera);return{x:(n.x*.5+.5)*this.viewport.width,y:(-.5*n.y+.5)*this.viewport.height,visible:n.z>-1&&n.z<1}};return{prompt:e(this.promptAnchor),answers:this.signAnchors.map(e)}}carScreenBounds(){this.player.updateWorldMatrix(!0,!0),this.camera.updateMatrixWorld();let e=this.player.userData.hitBounds.clone().applyMatrix4(this.player.matrixWorld),t=[];for(let o of[e.min.x,e.max.x])for(let c of[e.min.y,e.max.y])for(let l of[e.min.z,e.max.z]){let h=new N(o,c,l).project(this.camera);h.z>-1&&h.z<1&&t.push({x:(h.x*.5+.5)*this.viewport.width,y:(-.5*h.y+.5)*this.viewport.height})}if(!t.length)return null;let n=Math.min(...t.map(o=>o.x))-10,s=Math.max(...t.map(o=>o.x))+10,r=Math.min(...t.map(o=>o.y))-10,a=Math.max(...t.map(o=>o.y))+10;return{left:n,right:s,top:r,bottom:a}}isCarHit(e,t){let n=this.carScreenBounds();return!!n&&e>=n.left&&e<=n.right&&t>=n.top&&t<=n.bottom}makeObstacle(e){if(e.type==="traffic")return this.makeCar(Cp[(e.color+e.id)%Cp.length],!1,cu[(e.color*3+e.id)%cu.length]);let t=new Je;if(e.type==="cones")for(let[a,o]of[[-.7,.45],[.7,.45],[0,-.65]])_e(t,"box",3357765,a,.07,o,.7,.14,.7),_e(t,"cone",15834202,a,.62,o,.34,1.1,.34),_e(t,"cone",15983805,a,.76,o,.22,.3,.22);else if(e.type==="crates")for(let[a,o,c]of[[-.5,.45,.2],[.5,.45,-.3],[.1,1.25,0]]){_e(t,"coach",11239001,a,o,c,.95,.85,.95);for(let l of[-1,1])_e(t,"box",14794116,a+l*.35,o,c+.49,.075,.75,.03)}else if(e.type==="pothole"){_e(t,"cylinder",7498594,0,.027,0,1.35,.035,1.7),_e(t,"cylinder",1583931,0,.05,0,1.1,.025,1.45),_e(t,"cylinder",3163735,0,.065,-.05,.75,.025,1.1,.18,.25);for(let a of[-1.15,1.15])_e(t,"box",15252591,a,.08,.9,.22,.1,.25)}else if(e.type==="barrels")for(let[a,o]of[[-.6,.3],[.6,-.3]]){_e(t,"cylinder",12088143,a,.62,o,.46,1.2,.46);for(let c of[.28,.87])_e(t,"cylinder",14995120,a,c,o,.475,.12,.475)}else if(e.type==="fallen_branch"){let a=_e(t,"cylinder",8414799,0,.4,0,.3,2.65,.3);a.rotation.z=Math.PI/2;let o=_e(t,"cylinder",10123609,.4,.58,-.35,.15,1.65,.15);o.rotation.z=.9,o.rotation.x=.5,_e(t,"sphere",5406054,-.65,.72,-.5,.65,.43,.6),_e(t,"sphere",7051127,.65,.9,-.5,.8,.5,.7)}else if(e.type==="tire_stack"){for(let[a,o,c]of[[-.5,.2,2],[.55,-.3,3]])for(let l=0;l<c;l++)_e(t,"cylinder",2306885,a,.2+l*.34,o,.48,.3,.48,.95),_e(t,"cylinder",4741480,a,.36+l*.34,o,.23,.025,.23,.6,.3);_e(t,"box",16241034,0,.5,.73,.36,.13,.04)}else if(e.type==="road_panels"){_e(t,"box",9991256,0,.12,0,2.1,.22,1.9);for(let a=0;a<3;a++){let o=_e(t,"box",a===2?8824494:6323853,0,.29+a*.16,a*.07,2.12,.13,1.7,.45,.35);o.rotation.y=a*.045}for(let a of[-.72,.72]){let o=_e(t,"box",16767370,a,.73,.12,.18,.03,1.65);o.rotation.y=.09}}else if(e.type==="rockfall"){for(let[a,o,c,l]of[[-.55,.48,.15,.65],[.52,.6,-.3,.72],[.05,.28,.85,.4]])_e(t,"rock",10594477,a,o,c,l,l*.85,l).rotation.set(.25+a,.4+o,.3);for(let a of[-.95,.95])_e(t,"box",15641970,a,.18,.9,.19,.36,.18),_e(t,"box",16769953,a,.28,1,.19,.1,.025)}else{_e(t,"box",16764786,0,.85,0,2.6,.75,.4);for(let a of[-.9,0,.9]){let o=_e(t,"box",2373963,a,.85,.22,.3,.76,.025);o.rotation.z=.25}for(let a of[-.9,.9])_e(t,"box",6520462,a,.3,0,.2,.6,.6)}t.updateMatrixWorld(!0);let n=new Ut;t.traverse(a=>{if(a.isMesh){let o=a.geometry.clone().applyMatrix4(a.matrixWorld);n.add("o",o,a.material.color.getHex()),o.dispose()}});let s=new Me(n.merge("o"),jv);s.castShadow=!0,s.receiveShadow=!0,s.userData.ownGeometry=!0;let r=new Je;return r.add(s),r}syncTraffic(e){if(this.trafficState!==e&&(this.traffic.forEach(t=>{t.userData.contactShadow&&this.scene.remove(t.userData.contactShadow),this.scene.remove(t),t.traverse(n=>{n.isMesh&&n.userData.ownGeometry&&n.geometry.dispose()})}),this.traffic=[],this.trafficState=e,!!e))for(let t of e.obstacles){let n=this.makeObstacle(t);n.userData.obstacle=t,this.scene.add(n),t.type==="traffic"&&this.addContactShadow(n),this.traffic.push(n)}}updateAtmosphere(e,t,n,s,r){let a=this.preferences.reduced,o=this.preferences.graphics==="battery";for(let c of this.landmarks||[]){let l=c.at-n,h=l>-90&&l<620;if(c.group.visible=h,!h)continue;let u=c.overRoad?0:c.side*(this.edge(c.at,c.side)+c.offset);if(c.group.position.set(this.curve(c.at)-s+u,0,-l+4),c.group.rotation.y=c.overRoad?-Math.atan((this.curve(c.at+1)-this.curve(c.at-1))/2):c.side*.35,!r&&!a)for(let[f,d]of c.rotors.entries())d.rotation.z+=t*(.9+f*.15)}if(!r)for(let c of this.clouds||[])c.position.x+=t*c.userData.drift,c.position.x>340&&(c.position.x=-340);if(this.rain){let c=a?0:o?110:320;if(this.rain.visible=c>0,this.rain.count=c,c&&!r){let l=this.rainMatrix||=new xt,h=t*24,u=t*(8+(this.motion?.lastSpeed||0)*.6);for(let f=0;f<c;f++){let d=this.rain.userData.drops[f];d[1]-=h*d[3],d[2]+=u,(d[1]<-.5||d[2]>6)&&(d[1]=16+Math.random()*4,d[2]=-60+Math.random()*20,d[0]=(Math.random()-.5)*44),l.position.set(d[0],d[1],d[2]),l.rotation.x=-.18,l.updateMatrix(),this.rain.setMatrixAt(f,l.matrix)}this.rain.instanceMatrix.needsUpdate=!0}}}update(e,t,n="home"){let s=e*(t?.worldTimeScale??1);(!t||!["paused","finished","failed","countdown"].includes(t.status))&&(this.elapsed+=s),this.syncTraffic(t),this.syncRivals(t),this.prepareCourse(t);let r=!!t,a=r?t.distance:this.showcaseDistance+=e*6,o=this.curve(a)+window.RallyCore.routeOffset(t?.route,a),c=Math.floor(a/20)-3,l=this.segments.length;for(let C=0;C<l;C++){let L=c+((C-c)%l+l)%l,O=L*20+10,z=O-a,G=this.segments[C];G.userData.courseIndex=L,G.position.set(this.curve(O)-o,0,-z+4),G.rotation.y=-Math.atan((this.curve(O+10)-this.curve(O-10))/20),G.userData.curveIndex!==L&&(G.userData.curveIndex=L,this.rebuildChunk(G,L,O))}let h=t&&["paused","finished","failed","countdown"].includes(t.status);this.updateAtmosphere(e,s,a,o,h),this.spectators.update(s,t,this.index,a,o,C=>this.curve(C),this.preferences,h);for(let C of this.rivalCars){let L=C.userData.rival,O=L.at-a;C.visible=O>-60&&O<330,C.position.set(this.curve(L.at)+window.RallyCore.routeOffset(L.route,L.at)-o+L.lanePos*3.35+(L.passingOffset||0),0,-O+4),C.rotation.y=this.heading(L.at,L.route)-Ht.clamp((L.lane-L.lanePos)*.16,-.16,.16),h||(C.userData.wheelAngle=((C.userData.wheelAngle||0)+Math.max(0,L.at-(C.userData.previousAt??L.at))/.43)%(Math.PI*2),C.userData.previousAt=L.at),this.animateCar(C,C.userData.wheelAngle||0,-(L.lane-L.lanePos)*.28,L.braking),C.userData.nitroExhaust.visible=!!L.nitroActive&&!h,this.placeContactShadow(C);let z=Math.sign((L.plannedLane??L.lane)-L.lanePos);for(let G of C.userData.indicators||[])G.visible=z!==0&&(L.plannedLane!=null||Math.abs(L.lane-L.lanePos)>.05)&&G.userData.indicator===z&&Math.floor((t.elapsed||0)*3)%2===0}for(let C of this.traffic){let L=C.userData.obstacle,O=L.at-a;C.visible=!L.dormant&&O>-50&&O<360,C.position.set(window.RallyCore.actorX(t,L)-o,0,-O+4);let z=L.changed&&L.laneProgress<1,G=z?Ht.clamp(-(L.target-L.fromLane)*Math.sin(L.laneProgress*Math.PI)*.12,-.16,.16):0;C.rotation.y=this.heading(L.at,L.route)+G,(C.userData.indicators||[]).forEach(X=>{X.visible=(L.moving||L.routeChanging)&&z&&X.userData.indicator===Math.sign(L.target-L.fromLane)&&Math.floor((t?.elapsed||0)*3)%2===0}),C.rotation.z=L.hit&&t.elapsed-(L.hitAt??0)<.45?Math.sin(t.elapsed*18)*.08:0,h||(C.userData.wheelAngle=((C.userData.wheelAngle||0)+Math.max(0,L.at-(C.userData.previousAt??L.at))/.43)%(Math.PI*2),C.userData.previousAt=L.at),this.animateCar(C,C.userData.wheelAngle||0,G,L.braking||L.waiting),this.placeContactShadow(C)}this.updateGates(t,a,o,s),this.motionState!==t&&(this.motionState=t,this.motion=cp(this.currentLane,t?.roadTravel??a));let u=t?t.arena.speed*t.speedFactor*(t.worldTimeScale??1):6;t?.focusAuto&&(this.motion.lastSpeed=u);let f=this.motion.lane;if(hp(this.motion,t?.lane||0,t?.roadTravel||a,u,t?.focusAuto&&["light","junction"].includes(t.task?.kind)?e:s,h),t&&!h&&!window.RallyCore.playerLaneClear(t,f,this.motion.lane)){let C=window.RallyCore.playerLaneBlocker(t,f,this.motion.lane);this.motion.lane=f,this.motion.velocity=0,this.motion.steer=0,window.RallyCore.contactBump(t,C)}this.currentLane=this.motion.lane;let d=this.currentLane*3.35,m=n==="home"&&this.viewport.width<760&&this.viewport.height>this.viewport.width?-9:4;this.player.position.set(d,.04+(this.preferences.reduced?0:this.motion.bob),m),this.player.rotation.set(this.preferences.reduced?0:this.motion.pitch,this.heading(a,t?.route)+this.motion.steer*.22,this.preferences.reduced?0:this.motion.roll),this.animateCar(this.player,this.motion.wheelAngle,this.motion.steer,this.motion.braking||!!t?.yielding&&u<.5),this.player.visible=!0,this.shadow.position.set(d,.07,m),this.shadow.rotation.z=-this.player.rotation.y,this.nitroReadyGlow.position.set(d,.08,m),this.nitroReadyGlow.rotation.z=-this.player.rotation.y,this.nitroReadyGlow.visible=!h&&!t?.nitroActive&&window.RallyCore.canEngageNitro(t),this.nitroReadyGlow.scale.setScalar(this.preferences.reduced?1:1+Math.sin(this.elapsed*3)*.025),this.damageFx.update(e,t,this.preferences,h),this.boostFx.update(s,t,this.preferences,h),this.waterNormal&&!h&&!this.preferences.reduced&&this.waterNormal.offset.set(this.elapsed*.009,this.elapsed*.005),this.trail.children.forEach((C,L)=>{C.visible=!!t&&!h&&!this.preferences.reduced&&this.preferences.graphics!=="battery"&&(this.lookConfig.trail||t.nitroActive)&&u>2,C.position.set(d+(L%2?1:-1)*.64,.08,m+3+L*.45),C.material=vn(t?.nitroActive?9035263:8440760,.5,0,t?.nitroActive?2529481:3570791),C.scale.z=1-L/16});let x=t&&["paused","finished","failed"].includes(t.status),g=this.viewport.width<760&&this.viewport.height>this.viewport.width,p=n==="home",b=p?g?2:-5:t?.status==="task"?d*.7:d*.35,M=p?g?9:4.4:t?.status==="task"?7.2:6.2,_=p?g?16:20:t?.status==="task"?17:16;if(!p&&!this.preferences.reduced&&t?.status!=="task"&&(_+=Math.min(2.4,Math.max(0,t.speedFactor-1)*.9)),!p&&!this.preferences.reduced&&t?.status!=="task"&&(M-=.45*this.boostFx.intensity,_+=.9*this.boostFx.intensity),!p&&t?.status!=="task"){let C=Ht.clamp((.95-this.viewport.width/this.viewport.height)/.5,0,1);_+=6.5*C,M+=2.4*C}x||(this.camera.position.x=Ht.damp(this.camera.position.x,b,4,e),this.camera.position.y=Ht.damp(this.camera.position.y,M,4,e),this.camera.position.z=Ht.damp(this.camera.position.z,_,4,e));let P=Math.max(24,Math.min(52,2*Math.atan(this.viewport.height*3.35/(54*Math.min(140,(this.viewport.width-24)/3)))*180/Math.PI));x||(this.camera.fov=Ht.damp(this.camera.fov,t?.status==="task"?P:r?52+(this.preferences.reduced?0:Math.min(12,Math.max(0,t.speedFactor-1)*5.4)):52,t?.nitroActive?9:4,e)),this.camera.updateProjectionMatrix();let S=Math.atan2(this.camera.position.y-.8,Math.max(1,this.camera.position.z-4))-Math.atan(.58*Math.tan(this.camera.fov*Math.PI/360)),A=this.camera.position.y-Math.tan(S)*(this.camera.position.z+11);if(!x){let C=this.preferences.reduced?0:Ht.clamp(-this.heading(a+10,t?.route)*6,-2.2,2.2);this.look.set(p?g?-1.8:-6.5:t?.status==="task"?d*.65:d*.25+C,p?g?-1:-.5:A,p?g?-9:-6:-11),this.camera.lookAt(this.look)}let R=this.arenaLook,y=Ht.clamp(t?.focusAmount||0,0,1),v=this.preferences.reduced?0:this.boostFx.intensity;this.sun.intensity=R.sunIntensity*(1-.2*y),this.hemi.intensity=R.hemi*(1-.08*y),this.renderer.toneMappingExposure=R.exposure*(1-.07*y)+v*.05,this.scene.fog.color.setHex(R.fog).lerp(this.focusTint,.24*y),this.updateRoadBoards(t,o),this.renderer.render(this.scene,this.camera)}};function Lp(i){return String(i).toLowerCase().replace(/\b[a-z]/g,e=>e.toUpperCase()).replace(/\bTv\b/g,"TV")}function Dp(i,e,t,n){let s=Math.max(1,...String(i).trim().split(/\s+/u).map(n));return Math.max(.1,Math.floor(Math.min(t,t*Math.max(1,e-2)/s)*10)/10)}function Up(i,{width:e,top:t,bottom:n}){let s=[];for(let r of[...i].sort((a,o)=>Math.abs(a.distance)-Math.abs(o.distance)))!r.visible||Math.abs(r.distance)>150||r.x<42||r.x>e-42||r.y<t+30||r.y>n-16||s.some(a=>Math.abs(a.x-r.x)<82&&Math.abs(a.y-r.y)<32)||s.push(r);return s.map(r=>r.id)}function Np(i,e){let n=(i-24)/3,s=e.map(u=>u.x),r=s[1],a=Math.min(Math.abs(s[1]-s[0]),Math.abs(s[2]-s[1])),o=Math.min(n,Math.max(Math.min(100,n),a)),c=Math.min(34,Math.max(24,o*.28)),l=Math.min(168,Math.max(1,o-c)),h=Math.max(12+o+l/2,Math.min(i-12-o-l/2,r));return[0,1,2].map(u=>({x:h+(u-1)*o,width:l,gap:c,cellLeft:h+(u-1.5)*o,cellRight:h+(u-.5)*o}))}function ib(i,e,t){let n=0,s=1;for(let[r,a,o,c]of[[i.x,e.x-i.x,t.left,t.right],[i.y,e.y-i.y,t.top,t.bottom]])if(Math.abs(a)<1e-8){if(r<o||r>c)return null}else{let l=(o-r)/a,h=(c-r)/a;if(l>h&&([l,h]=[h,l]),n=Math.max(n,l),s=Math.min(s,h),n>s)return null}return n}function Fp(i,e,t,n=[]){return t.map(s=>({id:s.id,t:ib(i,e,s)})).filter(s=>s.t!==null&&!n.includes(s.id)).sort((s,r)=>s.t-r.t).map(s=>s.id)}function Op({hudBottom:i,promptHeight:e,answerHeight:t,promptY:n,answerY:s,controlsTop:r,repair:a=!1,landscape:o=!1,viewportHeight:c=1/0}){let l=o?8:12,h=i+l,u=r-12,f=Math.min(u+(o?56:0),c-12),d=Math.max(0,u-h-e-l-t),m=a?Math.min(80,d):0,x=o?0:m,p=h+e/2,b=p+e/2+l+t/2,M=u-x-t/2,_=Math.max(b,Math.min(s,Math.max(b,M)));return a&&o&&(m=Math.min(80,Math.max(0,f-_-t/2))),{py:p,ay:_,stagger:m,bottom:u,centerBottom:f}}var _s=["boulevard","coast","storm"],fc=i=>i==="standard"?"challenge":i,xu=[{id:"gold",name:"Sunrise Gold",color:15973461,tier:0},{id:"lagoon",name:"Lagoon Pearl",color:5618094,tier:1},{id:"ruby",name:"Ember Ruby",color:13066354,tier:2},{id:"midnight",name:"Midnight Violet",color:7959477,tier:3}];function Bp(i){i.difficulty==="standard"&&(i.difficulty="challenge"),i.progress=i.progress&&typeof i.progress=="object"?i.progress:{};for(let t of Object.keys(i.progress))if(t.endsWith(":standard")){let n=t.slice(0,-9)+":challenge",s=i.progress[t],r=i.progress[n];i.progress[n]=[0,1,2].map(a=>Math.max(0,Math.min(3,Number(s?.[a])||0),Math.min(3,Number(r?.[a])||0))),delete i.progress[t]}Pr(i);let e={};for(let[t,n]of Object.entries(i.arenaWins||{})){let s=t.endsWith(":standard")?t.slice(0,-9)+":challenge":t;e[s]=_s.map((r,a)=>e[s]?.[a]===!0||n?.[a]===!0)}for(let t of i.ulti.receipts){let n=_s.indexOf(t.arenaId),s=fc(t.difficulty);if(n<0||!["relaxed","challenge"].includes(s)||typeof t.unitId!="string"||!t.unitId)continue;let r=t.unitId+":"+s;(e[r]||=_s.map(()=>!1))[n]=!0}return i.arenaWins=e,i.fuel=Number.isFinite(i.fuel)?Math.max(0,Math.min(100,i.fuel)):0,i.mastery=i.mastery&&typeof i.mastery=="object"?i.mastery:{},i.reviewQueue=i.reviewQueue&&typeof i.reviewQueue=="object"?i.reviewQueue:{},i.look={paint:"gold",badge:0,trail:!1,...i.look},i}function Na(i,e,t,n){return Number.isInteger(n)&&n>=0&&n<_s.length&&_s.slice(0,n).every((s,r)=>i.arenaWins?.[e+":"+fc(t)]?.[r]===!0)}function kp(i,e,t){if(!Ir(e)||e.reviewLap||t!==1||!Number.isInteger(e.arenaIndex)||e.arenaIndex<0||e.arenaIndex>=_s.length||typeof e.unit?.id!="string"||!["relaxed","challenge"].includes(fc(e.difficulty)))return!1;let n=e.unit.id+":"+fc(e.difficulty);i.arenaWins||={};let s=i.arenaWins[n]||=_s.map(()=>!1),r=s[e.arenaIndex]!==!0;return s[e.arenaIndex]=!0,r}function yu(i,e){return i.mastery[e]||={seen:{},clean:{},total:0,firstTry:0,arenas:0,tier:0}}function zp(i,e,t){let n=yu(i,e);for(let s of t)n.seen[s.key]=!0,n.total++,s.firstTry&&(n.firstTry++,n.clean[s.key]=!0);return Gp(n)}function Hp(i,e,t){let n=yu(i,e);return n.arenas|=1<<t,Gp(n)}function Gp(i){let e=i.tier,t=Object.keys(i.clean).length,n=i.total?i.firstTry/i.total:0,s=[0,1,2].filter(r=>i.arenas&1<<r).length;return n>=.9&&(t>=6&&s>=1&&(i.tier=Math.max(i.tier,1)),t>=12&&s>=2&&(i.tier=Math.max(i.tier,2)),t>=18&&s===3&&(i.tier=3)),i.tier>e?i.tier:0}function pc(i,e){let t=yu(i,e);return{unique:Object.keys(t.clean).length,accuracy:t.total?Math.round(t.firstTry/t.total*100):0,arenas:[0,1,2].filter(n=>t.arenas&1<<n).length,tier:t.tier}}function mc(i){return Math.max(0,...Object.values(i.mastery).map(e=>e.tier||0))}function _u(i,e,t){let n=mc(i);if(e==="paint"){let s=xu.find(r=>r.id===t);if(!s||s.tier>n)return!1;i.look.paint=t}else if(e==="badge"){if(!Number.isInteger(t)||t<0||t>n)return!1;i.look.badge=t}else if(e==="trail"){if(t&&n<3)return!1;i.look.trail=!!t}else return!1;return!0}function vs(i){let e=mc(i),t=xu.find(n=>n.id===i.look.paint&&n.tier<=e)||xu[0];return{color:Xt(i.teamId)?.color??t.color,teamId:Xt(i.teamId)?.id??null,paint:t.id,badge:Math.min(e,Math.max(0,Number(i.look.badge)||0)),trail:!!i.look.trail&&e>=3}}var ae=window.RallyCore,I=i=>document.getElementById(i),zi=window.LANGUAGE_BANK,Sr=i=>`<span class="modal-host" aria-hidden="true"><img src="img/saymaz-${i}.png" alt="" draggable="false"></span>`,ht=i=>String(i).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]);function sb(i){let e=i?.closest?i:i?.parentElement;return["input","textarea","select",'[contenteditable="true"]','[contenteditable="plaintext-only"]'].some(t=>e?.closest?.(t))}for(let i of["selectstart","dragstart","contextmenu"])I("app").addEventListener(i,e=>{sb(e.target)||e.preventDefault()},{capture:!0});function jp(){let i=window.getSelection?.();i?.rangeCount&&i.removeAllRanges()}var Qp="wordshift-rally.v1",Z={grade:5,unit:"g5u1",difficulty:"relaxed",sound:!1,progress:{},tutorial:!1},Ru=!0;try{let i=localStorage.getItem(Qp);i&&(Z={...Z,...JSON.parse(i)})}catch{Ru=!1}zi.some(i=>i.grade===Z.grade)||(Z.grade=5);(!Z.progress||typeof Z.progress!="object")&&(Z.progress={});Bp(Z);ae.DIFFICULTIES[Z.difficulty]||(Z.difficulty="relaxed");var Zt=0,w=null,Et,Er="home",Fa="",bc="",Sc=null,Bi=0,em=null,gc=!1,Su=0,Ss=0,ki=()=>zi.find(i=>i.grade===Z.grade).units.find(i=>i.id===Z.unit)||zi.find(i=>i.grade===Z.grade).units[0],tm=()=>Z.unit+":"+Z.difficulty,rb=()=>Z.progress[tm()]||[0,0,0],xc=i=>Na(Z,Z.unit,Z.difficulty,i),Vp=i=>ae.ARENAS.find((e,t)=>t<i&&!Z.arenaWins[tm()]?.[t])?.name;function Rn(){try{localStorage.setItem(Qp,JSON.stringify(Z))}catch{Ru=!1}}var Ye=new Za(()=>Z.sound),nm=window.matchMedia("(prefers-reduced-motion: reduce)"),Mc=window.matchMedia("(pointer: coarse)"),Cu=new URLSearchParams(globalThis.location?.search||"").get("touch")==="1",Yt=Cu||Mc.matches||navigator.maxTouchPoints>0&&!window.matchMedia("(hover: hover)").matches,Eu=0,yc=null,Hi=null,Oa=0,hn=null,za=()=>Ku(Z.preferences,nm.matches),Ha=!0,im=0,vu,Wp=new WeakMap,Ba={hudBottom:155,controlsTop:innerHeight-90,promptHeight:60,answerHeight:80},_c=typeof ResizeObserver=="function"?new ResizeObserver(()=>{Ha=!0}):null;function Ts(){Ha=!0,im++}var wu=i=>`emoji/${i}.webp`,ab=i=>{if(typeof Image=="function")for(let e of i?.tasks||[])for(let t of[e.image,...e.optionImages||[]])t&&(new Image().src=wu(t))},Xp=i=>String(i).split(/(\s+)/u).map(e=>/^\s*$/u.test(e)?ht(e):`<span class="sign-word">${ht(e)}</span>`).join("");function qp(i,e,t){let n=im+"|"+t.toFixed(1)+"|"+e.textContent;if(Wp.get(e)===n)return;vu??=document.createElement("canvas").getContext("2d");let s=getComputedStyle(i),r=parseFloat(s.fontSize),a=["paddingLeft","paddingRight","borderLeftWidth","borderRightWidth"].reduce((c,l)=>c+(parseFloat(s[l])||0),0);vu.font=`${s.fontWeight} ${r}px ${s.fontFamily}`;let o=Dp(e.textContent,t-a,r,c=>vu.measureText(c).width);bs(e,"fontSize",o+"px"),Wp.set(e,n),Ha=!0}document.fonts?.ready.then(Ts);for(let i of["app","hud","controls","road-prompt"])_c?.observe(I(i));function Ga(i){i=Cu||!!i;let e=Yt!==i;Yt=i,document.body.classList.toggle("touch-controls",Yt),I("controls").setAttribute("aria-hidden",String(Yt)),Yt&&(I("controls").hidden=!0),I("touch-nitro").hidden=!Yt||!w||!["driving","task","resolving"].includes(w.status),e&&Ts()}Mc.addEventListener?.("change",()=>Ga(Mc.matches));document.addEventListener("pointerdown",i=>{i.pointerType==="touch"||i.pointerType==="pen"?Ga(!0):i.pointerType==="mouse"&&!Mc.matches&&Ga(!1)},{capture:!0});function Ec(){let i=window.visualViewport;if(i&&Math.abs((i.scale||1)-1)>.01)return;let e=i?.height||innerHeight,t=i?.width||innerWidth;e>0&&Number.isFinite(e)&&document.documentElement.style.setProperty("--play-height",e+"px"),document.body.classList.toggle("short-viewport",t<=760&&e<640&&e>=t),document.body.classList.toggle("compact-landscape",t>e&&e<=300),Ga(Yt),Et?.resize(),Ts()}window.addEventListener("resize",Ec);window.addEventListener("pageshow",Ec);window.visualViewport?.addEventListener("resize",Ec);Ec();function bs(i,e,t){i.style[e]!==t&&(i.style[e]=t)}function nt(i,e){let t=I(i),n=String(e);t.textContent!==n&&(t.textContent=n,["road-question","road-feedback","road-kicker"].includes(i)&&Ts())}function sm(){if(Ha){Ha=!1;let i=[...I("road-answers").querySelectorAll("button")],e=window.visualViewport,t=e?.width||innerWidth,n=e?.height||innerHeight;Ba={hudBottom:I("hud").getBoundingClientRect().bottom,controlsTop:Yt?td(t,n):I("controls").getBoundingClientRect().top,promptHeight:I("road-prompt").offsetHeight,answerHeight:Math.max(56,...i.map(s=>s.offsetHeight))},document.body.style.setProperty("--hud-bottom",Ba.hudBottom+"px")}return Ba}function Iu(){let i=za();document.body.classList.toggle("reduced-motion",i.reduced),Et?.setPreferences(i)}nm.addEventListener?.("change",Iu);function ni(i){if(!(!za().haptics||!window.matchMedia("(pointer: coarse)").matches))try{navigator.vibrate?.({click:8,correct:[12,30,18],collision:45,go:[15,25,25],finish:[20,50,30,50,50]}[i]||8)}catch{}}function rm(){let i=!!w&&ae.pause(w),e=()=>{let t=za();Si(`<span class="modal-kicker">MAKE IT YOUR DRIVE</span><h2 id="modal-title">Driver settings.</h2><p>Comfort, sound and performance. Your choices are saved on this device.</p><div class="setting-row"><div><strong>Sound</strong><small>Engine, road and answer cues</small></div><button class="setting-toggle" id="setting-sound" aria-pressed="${Z.sound}">${Z.sound?"ON":"OFF"}</button></div><div class="setting-row"><div><strong>Vibration</strong><small>Light feedback on supported phones</small></div><button class="setting-toggle" id="setting-haptics" aria-pressed="${t.haptics}">${t.haptics?"ON":"OFF"}</button></div><label class="setting-label" for="setting-graphics">GRAPHICS</label><select id="setting-graphics"><option value="auto">Auto \xB7 adapts to your device</option><option value="high">High \xB7 sharper picture</option><option value="battery">Battery saver \xB7 lighter rendering</option></select><label class="setting-label" for="setting-motion">MOTION</label><select id="setting-motion"><option value="system">Follow device settings</option><option value="full">Full \xB7 camera and effects</option><option value="reduced">Reduced \xB7 steady camera, fewer effects</option></select><p class="save-note">Auto lowers rendering resolution if frame times stay high. Battery saver reduces shadows and effects.</p><button class="primary" id="settings-done">${i?"BACK TO THE RACE":"DONE"} \u2197</button>`),I("setting-graphics").value=t.graphics,I("setting-motion").value=t.motion;let n=(s,r)=>{Z.preferences={...za(),[s]:r},Rn(),Iu()};I("setting-sound").onclick=()=>{Z.sound=!Z.sound,Ye.unlock(),wc(),Rn(),e()},I("setting-haptics").onclick=()=>{n("haptics",!t.haptics),ni("click"),e()},I("setting-graphics").onchange=s=>n("graphics",s.target.value),I("setting-motion").onchange=s=>n("motion",s.target.value),I("settings-done").onclick=()=>{Cn(),i&&ae.resume(w),I("settings").focus()}};e()}function ob(){let i=I("celebration");i.hidden=!1,i.innerHTML=za().reduced?"":Array.from({length:30},(e,t)=>`<i style="--x:${t*37%100}%;--delay:${t%7*.09}s;--turn:${t*47}deg;--colour:${["#fbd477","#83decc","#fff4d6"][t%3]}"></i>`).join(""),document.body.classList.add("race-finished"),ni("finish")}function wc(){I("sound").classList.toggle("off",!Z.sound),I("sound").setAttribute("aria-pressed",String(Z.sound)),I("sound").setAttribute("aria-label",Z.sound?"Mute sound":"Enable sound")}function Ms(i,e=!1,t=null){if(w&&["task","resolving"].includes(w.status)){nt("road-feedback",i),I("road-feedback").classList.toggle("bad",e),Oa=performance.now()+1600;return}(!hn||e||!hn.bad)&&(hn={text:i,bad:e,valid:t,expiresAt:performance.now()+5e3})}function $p(i,e){if(hn&&(hn.expiresAt<i||hn.valid&&!hn.valid())&&(hn=null),!e.announcementsAllowed){I("toast").classList.remove("visible"),Bi=0;return}if(hn&&i>=Bi){let t=hn;hn=null,I("toast").textContent=t.text,I("toast").className="visible"+(t.bad?" bad":""),Bi=i+1500}i>Bi&&I("toast").classList.remove("visible")}function lb(i){let e=["#83c6dc","#63ced3","#4b5c89"][i],t=["#76a88c","#3c98a3","#455d77"][i];return`<svg viewBox="0 0 150 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="150" height="100" fill="${e}"/><circle cx="119" cy="22" r="10" fill="${i===2?"#d5d5dc":"#ffe4a3"}"/><path d="M0 65h150v35H0Z" fill="${t}"/>${i===0?'<path fill="#d2d7bc" d="M6 70V39h16v31h8V28h19v42h24V44h20v26h12V22h19v48Z"/><path fill="#64897d" d="M0 73 35 55 66 70 101 51 150 70v30H0Z"/>':i===1?'<path d="M0 75q15-7 30 0t30 0t30 0t30 0t30 0" fill="none" stroke="#a4e6da" stroke-width="2"/><path d="M13 68V30m116 38V30M13 36q57 42 116 0M13 30l57 38 59-38" stroke="#dce9d9" stroke-width="3" fill="none"/>':'<path fill="#899aab" d="m0 72 37-50 30 38 28-48 55 62v26H0Z"/><path fill="#bfcbd2" d="m22 42 15-20 15 19-14-4Zm57-6 16-24 19 24-19-6Z"/><path fill="#415a72" d="m0 92 40-35 33 34 33-28 44 30v7H0Z"/>'}<path fill="#2c475b" d="m68 54 14 0 39 46H30Z"/><path d="m74 59-2 9m-1 7-5 15" fill="none" stroke="#fff0bd" stroke-width="2"/><path d="M0 94h150v6H0Z" fill="#102e48" opacity=".5"/></svg>`}function As(){cm(),Z.unit=ki().id,document.querySelectorAll("[data-team]").forEach(t=>{let n=t.dataset.team===Z.teamId;t.classList.toggle("selected",n),t.setAttribute("aria-pressed",String(n))}),I("start").disabled=!Xt(Z.teamId),I("start").querySelector("span").textContent=Z.teamId?"START YOUR ENGINE":"CHOOSE YOUR TEAM",Tc(),nt("lesson-grade",Z.grade),nt("lesson-meta",`GRADE ${Z.grade} ${Lr[Z.grade]} \xB7 UNIT ${zi.find(t=>t.grade===Z.grade).units.indexOf(ki())+1}`),nt("lesson-unit",ki().title),I("lesson-picker").setAttribute("aria-label",`Choose your lesson: Grade ${Z.grade} ${Lr[Z.grade]}, ${ki().title}`),document.querySelectorAll("[data-diff]").forEach(t=>{t.classList.toggle("selected",t.dataset.diff===Z.difficulty),t.setAttribute("aria-pressed",String(t.dataset.diff===Z.difficulty))}),I("difficulty-note").textContent={relaxed:"More time. Real racing.",challenge:"Fast rivals. Race to win."}[Z.difficulty];let i=rb();xc(Zt)||(Zt=0),I("total-stars").textContent=i.reduce((t,n)=>t+n,0)+" / 9 stars",I("arena-cards").innerHTML=ae.ARENAS.map((t,n)=>{let s=!xc(n);return`<button class="arena-card ${Zt===n?"selected ":""}${s?"locked":""}" data-arena="${n}" style="--accent:${t.color}" aria-pressed="${Zt===n}" aria-label="${ht(t.name)}${s?", locked. Finish first in "+Vp(n)+" to unlock.":", "+i[n]+" stars"}"><span class="arena-number">${s?"LOCKED":String(n+1).padStart(2,"0")}</span><span class="arena-mini ${t.id==="coast"?"coast":t.id==="storm"?"storm":""}">${lb(n)}</span><strong>${ht(t.name)}</strong><span class="stars">${s?"\u2014":"\u2605".repeat(i[n])+"\u2606".repeat(3-i[n])}</span></button>`}).join(""),I("arena-cards").querySelectorAll("button").forEach(t=>t.onclick=()=>{let n=+t.dataset.arena;if(!xc(n)){Ms("Finish first in "+Vp(n)+" to unlock.");return}Zt=n,Ye.tone("click"),As()}),I("scene-name").textContent=ae.ARENAS[Zt].name.toUpperCase(),I("scene-name").nextElementSibling.textContent=String(Zt+1).padStart(2,"0")+" / 03",document.documentElement.style.setProperty("--accent",ae.ARENAS[Zt].color),Et?.setup(Zt),Rn(),nt("arena-length",(ae.ARENAS[Zt].length/1e3).toFixed(2)+" KM"),nt("arena-checkpoints",ae.ARENAS[Zt].checkpoints+" CHECKPOINTS"),nt("ride-name",Xt(Z.teamId)?.name.toUpperCase()||"CHOOSE A TEAM");let e=pc(Z,Z.unit);I("mastery-preview").textContent=`UNIT MASTERY \xB7 ${e.unique} ITEMS \xB7 ${e.accuracy}% FIRST TRY${e.tier?" \xB7 "+["","EXPLORER","SCHOLAR","MASTER"][e.tier]:""}`,Et?.setCosmetics(vs(Z))}function cb(){if(Er!=="home")return;let i=Z.grade,e=Z.unit;Si(`<div class="lessons-heading"><div><h2 id="modal-title">Lessons</h2><p id="lessons-intro">Choose your lesson</p></div><button id="lesson-close" class="lesson-close" aria-label="Close Lessons">\xD7</button></div><div class="lessons-grades-section"><span class="setting-label" id="grade-label">GRADE / LEVEL</span><div class="grades lesson-grades" role="group" aria-labelledby="grade-label">${zi.map(n=>`<button type="button" data-grade="${n.grade}" aria-label="Grade ${n.grade} ${Lr[n.grade]}" aria-pressed="${n.grade===i}"><span>GRADE ${n.grade}</span><strong>${Lr[n.grade]}</strong></button>`).join("")}</div></div><span class="setting-label" id="unit-label">THEME / UNIT</span><div id="unit" class="lesson-units" role="group" aria-labelledby="unit-label"></div><div class="lesson-confirm"><p id="lesson-preview" class="lesson-preview"></p><div class="modal-actions"><button id="lesson-cancel" class="secondary">CANCEL</button><button id="lesson-apply" class="primary">USE THIS LESSON \u2197</button></div></div>`),I("modal").classList.add("lessons-modal");let t=()=>{let n=zi.find(r=>r.grade===i).units;n.some(r=>r.id===e)||(e=n[0].id),document.querySelectorAll("[data-grade]").forEach(r=>{let a=+r.dataset.grade===i;r.classList.toggle("selected",a),r.setAttribute("aria-pressed",String(a))}),I("unit").innerHTML=n.map((r,a)=>`<button type="button" class="lesson-unit-option" data-unit="${r.id}" aria-label="Unit ${a+1}: ${ht(r.title)}" aria-describedby="lesson-summary-${r.id}"><span class="unit-number" aria-hidden="true">${a+1}</span><span class="unit-copy"><strong class="unit-title">${ht(r.title)}</strong><span id="lesson-summary-${r.id}" class="unit-summary">${ht(sd(r))}</span>${r.subthemes?.length?`<span class="unit-subthemes">Includes: ${r.subthemes.map(o=>ht(o.title)).join(" \xB7 ")}</span>`:""}</span><span class="unit-check" aria-hidden="true">\u2713</span></button>`).join("");let s=()=>{I("unit").querySelectorAll("button").forEach(r=>{let a=r.dataset.unit===e;r.classList.toggle("selected",a),r.setAttribute("aria-pressed",String(a))}),I("lesson-preview").textContent=n.find(r=>r.id===e).title};I("unit").querySelectorAll("button").forEach(r=>r.onclick=()=>{e=r.dataset.unit,s()}),s()};document.querySelectorAll("[data-grade]").forEach(n=>n.onclick=()=>{i=+n.dataset.grade,e=zi.find(s=>s.grade===i).units[0].id,t()}),I("lesson-close").onclick=Cn,I("lesson-cancel").onclick=Cn,I("lesson-apply").onclick=()=>{Z.grade=i,Z.unit=e,Zt=0,Cn(),As()},t()}var bn=qu({api:Vu(window.WORDRAMP_CONFIG)}),am=-1/0,bu=!1,Yp=-1,om=i=>i?.unit?.grade??(Number(String(i?.unit?.id||Z.unit).match(/^g(\d+)/)?.[1])||Z.grade);function lm(i){!bn.enabled||!i||i.reviewLap||i.leagueTicket||bu||!Xt(i.teamId)||["finished","failed"].includes(i.status)||(bu=!0,am=performance.now(),bn.start({runId:i.runId,grade:om(i),team:i.teamId,arena:i.arenaIndex,pace:i.difficulty==="challenge"?"challenge":"relaxed",unit:i.unit.id}).then(e=>{e&&(i.leagueTicket=e)}).finally(()=>{bu=!1}))}function hb(i,e,t){let n=t?.name||"your team";return i.state==="counted"?i.duplicate?{text:"This win was already counted in the English League.",good:!0}:i.points>0?{text:`+${i.points} Ulti for Grade ${e} ${n}!${i.reason==="team-limit"?` ${n} reached today's team limit, so this win counted ${i.points} of ${i.requested}.`:""}`,good:!0}:i.reason==="device-limit"?{text:"Today's Ulti wins on this phone are used. Tomorrow they count again."}:i.reason==="team-limit"?{text:`${n} reached today's Ulti limit for Grade ${e}. Tomorrow wins count again.`}:i.reason==="off"?{text:"Ulti points are switched off in the English League right now."}:{text:"This win added no Ulti points."}:i.state==="queued"?{text:"You're offline. This win will be sent to the English League when you're online."}:i.state==="refused"?{text:i.reason==="too-fast"?"That win was faster than the English League allows, so it did not count.":i.reason==="expired"?"This race ticket expired before it could be sent.":"The English League did not accept this win."}:i.state==="no-ticket"?{text:"This race could not reach the English League when it started, so it cannot count."}:null}function ub(i,e,t){let n=I("league-result"),s=hb(i,e,t);!n||!s||(n.textContent=s.text,n.classList.toggle("good",!!s.good),n.classList.remove("pending"))}function cm(){if(!bn.enabled){I("league-button").hidden=!0;return}I("league-button").hidden=!1,nt("league-label",`LEAGUE \xB7 GRADE ${Z.grade}`)}function db(i){if(!i.known)return'<p class="save-note">The English League will show its Ulti rules here once it can be reached.</p>';if(!i.game)return'<p class="league-help">Ulti points are not switched on for this game yet.</p>';let e=t=>ae.ARENAS.map((n,s)=>t?.[s]!=null?`${ht(n.name)} +${t[s]}`:"").filter(Boolean).join(" \xB7 ");return`<p class="league-help">${e(i.game.points?.relaxed)}.</p><p class="league-help">On Challenge pace: ${e(i.game.points?.challenge)}.</p><p class="save-note">${i.game.deviceDailyWins?`Your first ${i.game.deviceDailyWins} wins each day count on this phone. `:""}Points last ${Xu(i.hours)}. Your win also needs ${Math.round(Is*100)}% of tasks right first time on Relaxed, or ${Wi} stars on Challenge.</p>`}function fb(i){return`<div class="league-teams">${i.teams.map(e=>{let t=Xt(e.id),n=Math.min(1,e.points/Math.max(1,i.capacity));return`<div class="league-team ${Z.teamId===e.id?"selected":""}" style="--team:${t.accent};--share:${(n*100).toFixed(1)}%"><span class="team-letter">${t.letter}</span><span class="league-name">${t.name}${Z.teamId===e.id?" \xB7 YOU":""}</span><span class="league-bar" aria-hidden="true"><i></i></span><strong>${Math.round(e.points)} / ${i.capacity}</strong><small>${Wu(e.strength)}</small></div>`}).join("")}</div>`}function pb(){if(!bn.enabled)return;let i=Z.grade,e=(n,s)=>{I("league-done")&&(I("league-body").innerHTML=`${fb(n)}${db(n)}<p class="save-note">${s}</p>`)};Si(`${Sr("cheer")}<span class="modal-kicker">ENGLISH LEAGUE \xB7 BATTLE ARENA</span><h2 id="modal-title">Ulti \xB7 Grade ${i}</h2><p>Arena wins add Ulti points to your grade's team pool in Mr. Saymaz's English League. Stronger teams hit harder in the Battle Arena.</p><div id="league-body"></div><button id="league-done" class="primary">BACK TO GARAGE</button>`),I("league-done").onclick=Cn;let t=bn.snapshot(i);e(t,t.updatedAt?"Updating\u2026":"Connecting to the English League\u2026"),bn.refresh(i).then(n=>e(n,n.online?"Live from the English League.":n.updatedAt?`Offline \xB7 last updated ${new Date(n.updatedAt).toLocaleString()}.`:"The English League cannot be reached right now."))}function Tc(){let i=Ya(Z),e=Xt(Z.teamId);nt("ulti-balance",e?`${i.totals[e.id]} ULTI`:"TEAM POINTS"),document.querySelectorAll("[data-ulti-total]").forEach(n=>{let s=String(i.totals[n.dataset.ultiTotal]||0);n.textContent!==s&&(n.textContent=s)});let t=I("ulti-expiry");if(t){let n=Math.min(...i.receipts.map(r=>r.expiresAt)),s=Number.isFinite(n)?"Next expiry: "+new Date(n).toLocaleString():"No active points yet. Win a race to earn some for your team.";t.textContent!==s&&(t.textContent=s)}}function hm(){Si(`${Sr("cheer")}<span class="modal-kicker">YOUR TEAM \xB7 YOUR VICTORY</span><h2 id="modal-title">Ulti points.</h2><p>Finish first to earn points for the team you raced with: on Relaxed with <strong>${Math.round(Is*100)}%</strong> of tasks right first time, on Challenge with <strong>${Wi}+ stars</strong> (75%). Each reward expires after <strong>3 days</strong>.</p><table class="ulti-rules"><thead><tr><th></th>${ae.ARENAS.map(i=>`<th>${ht(i.name)}</th>`).join("")}</tr></thead><tbody>${Object.entries($a).map(([i,e])=>`<tr><th>${i==="challenge"?"Challenge":"Relaxed"}</th>${e.map(t=>`<td>${t}</td>`).join("")}</tr>`).join("")}</tbody></table><p class="save-note">Today on this device: <strong>${Math.min(Dc(Z),Xi)} / ${Xi}</strong> points. The limit resets at midnight.</p><div class="ulti-teams">${Rr.map(i=>`<div class="ulti-team ${Z.teamId===i.id?"selected":""}" style="--team:${i.accent}"><span class="team-letter">${i.letter}</span><span>${i.name}</span><strong data-ulti-total="${i.id}">0</strong></div>`).join("")}</div><p id="ulti-expiry" class="save-note"></p><button id="ulti-export" class="review-lap-button">EXPORT POINTS RECORD \u2197</button><p class="save-note">Points are saved in this browser. The connection to the other game will be added later. Exporting keeps the original expiry.</p><button id="ulti-done" class="primary">BACK TO GARAGE</button>`),Tc(),I("ulti-done").onclick=Cn,I("ulti-export").onclick=()=>{let i=URL.createObjectURL(new Blob([Nc(Z)],{type:"application/json"})),e=document.createElement("a");e.href=i,e.download="wordramp-ulti-points.json",e.click(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}}function Ac(){if(!w)return;let i=w.answerEvents.slice(Su),e=i.length||Z.fuel!==w.fuel;i.length&&(Ss=Math.max(Ss,zp(Z,w.unit.id,i)),Su=w.answerEvents.length),Z.fuel=w.fuel,Z.reviewQueue[w.unit.id]=w.review.filter(t=>!t.recovered).map(t=>({...t})),e&&Rn()}function vc(){let i=mc(Z),e=pc(Z,Z.unit),t=vs(Z);Si(`${Sr("smile")}<span class="modal-kicker">MASTERY GARAGE</span><h2 id="modal-title">Wear what you learn.</h2><p>${ht(ki().title)} \xB7 ${e.unique} distinct items \xB7 ${e.accuracy}% first try \xB7 ${e.arenas}/3 arenas</p><p>Your team sets your car colour. Earn badges and a trail through unit mastery.</p><div class="paint-grid">${Rr.map(n=>`<button class="paint-option ${Z.teamId===n.id?"selected":""}" data-livery="${n.id}" aria-pressed="${Z.teamId===n.id}"><span class="paint-swatch" style="--paint:#${n.color.toString(16)}"></span><strong>${n.name}</strong><small>TEAM LIVERY</small></button>`).join("")}</div><p class="garage-label">BADGE</p><div class="badge-options">${["Off","Explorer","Scholar","Master"].map((n,s)=>`<button data-badge="${s}" ${s>i?"disabled":""} class="${t.badge===s?"selected":""}">${n}</button>`).join("")}</div><button id="trail-option" class="trail-option" ${i<3?"disabled":""} aria-pressed="${t.trail}">Aurora trail \xB7 ${i<3?"MASTER REWARD":t.trail?"ON":"OFF"}</button><div class="mastery-rules">At 90% first-try accuracy: <strong>Explorer</strong> needs 6 distinct items + 1 arena; <strong>Scholar</strong> needs 12 + 2 arenas; <strong>Master</strong> needs 18 + all 3. Earn rewards in any unit and equip them throughout your garage.</div><p class="save-note">Fuel ${Z.fuel}/100 \xB7 each first-try answer earns 10; every third in a streak adds 5. Each charge costs 30, up to three levels. ${Yt?"Slide up for Nitro, slide down to save it while keeping regular acceleration. Slide farther up to stack.":"Hold NITRO or Space to use it; release to save the remainder."} Driving always remains available.</p><button id="garage-done" class="primary">BACK TO GARAGE</button>`),I("modal").querySelectorAll("[data-livery]").forEach(n=>n.onclick=()=>{Z.teamId=n.dataset.livery,Rn(),Et.setCosmetics(vs(Z)),vc()}),I("modal").querySelectorAll("[data-badge]").forEach(n=>n.onclick=()=>{_u(Z,"badge",+n.dataset.badge)&&(Rn(),Et.setCosmetics(vs(Z)),vc())}),I("trail-option").onclick=()=>{_u(Z,"trail",!Z.look.trail)&&(Rn(),Et.setCosmetics(vs(Z)),vc())},I("garage-done").onclick=()=>{Cn(),As()}}var Va=!1,wr=!1,un=null,Rs=!1,Es=null,rn=null,Tu=0;function Au(){return Va||wr||un!==null||Hi!==null}function pt(){if(w){let i=Va||wr||Hi!==null||un!==null&&!It?.touch;ae.setAccelerating(w,Au(),!!i),ae.setNitroHeld(w,Rs||Es!==null||rn!==null)}}function Wa(){let i=It?.id;It=null;let e=Es;Es=null,rn=null,Rs=!1,e!==null&&I("nitro").hasPointerCapture?.(e)&&I("nitro").releasePointerCapture(e);let t=un;un=null,Va=!1,wr=!1;let n=Hi;Hi=null,n!==null&&I("throttle").hasPointerCapture?.(n)&&I("throttle").releasePointerCapture(n),t!==null&&I("world").hasPointerCapture?.(t)&&I("world").releasePointerCapture(t),i!=null&&I("world").hasPointerCapture?.(i)&&I("world").releasePointerCapture(i),w&&(ae.setAccelerating(w,!1),ae.setNitroHeld(w,!1))}function Si(i){hn=null,Bi=0,I("toast").classList.remove("visible"),Wa(),He.pointerId!==null&&Lu({pointerId:He.pointerId}),I("modal").classList.remove("finish-modal","dnf-result"),I("modal").classList.remove("lessons-modal"),em=document.activeElement,I("modal").innerHTML=i,I("modal-backdrop").hidden=!1,setTimeout(()=>I("modal").focus(),0)}function Cn(){I("modal-backdrop").hidden=!0,I("modal").classList.remove("lessons-modal"),I("modal").innerHTML="",em?.focus?.()}function Pu(i=!1){let e=(Yt?"Hold anywhere on the road to accelerate. Keep your thumb down and swipe left or right to change lanes. You can swipe again without lifting.":"Swipe the road, tap the arrows, or use \u2190 \u2192 / A D. Hold your car or the speed button to accelerate. On a computer, hold \u2191.")+" Release acceleration and Nitro to coast and brake for traffic.",t=Yt?"Slide your driving thumb forward to use Nitro, then hold it there. Slide down to save the remaining charge and keep regular acceleration. Slide farther forward for a second or third charge, up to three levels. Each new charge costs 30 fuel; resuming a saved charge is free. Lifting your thumb releases acceleration and Nitro. Fuel and Nitro status sit beside your race position.":"Hold NITRO or Space to boost; release to save the remaining charge. An upward swipe also boosts while your finger stays down. A new charge costs 30 fuel. Tap +30 or press N to stack up to three levels. Holding acceleration also uses a loaded charge. Regular acceleration displays up to 90 km/h; maximum Nitro displays 200 km/h.",n=Yt?"After choosing, keep holding the road to return to normal pace sooner.":"After choosing, hold your car, the speed button or \u2191 to return to normal pace sooner.";w&&!["finished","failed","paused"].includes(w.status)&&(gc=ae.pause(w)),Si(`${Sr("point")}<span class="modal-kicker">WELCOME TO WORDRAMP</span><h2 id="modal-title">Your team.<br>Your open road.</h2><div class="help-step"><span class="step-num">1</span><div><strong>Find your line.</strong><p>${e}</p></div></div><div class="help-step"><span class="step-num">2</span><div><strong>Read the road.</strong><p>Steer towards the correct full-text answer, or tap its sign. Rivals match your progress during every English task, even if you hold acceleration. Correct exits protect your speed recovery too. Lights and forks enter slow motion close to the signs. Steering stays active. ${n} Already holding? Keep holding. The answer locks at the road line.</p></div></div><div class="help-task-grid"><div><b>GREEN LIGHT</b><span>Read in slow motion, then steer into the matching answer to turn the light green.</span></div><div><b>ROAD REPAIR</b><span>Release the car: autopilot holds your entry speed and lane while the world slows into a green-gold focus effect. Connect the three blocks; the road repairs immediately, then normal pace and driving controls return smoothly. Extra thinking time safely freezes the approach before the gap. A held Up key or driving touch resumes automatically after autopilot.</span></div><div><b>SHORTCUT</b><span>Choose a sign in close-range slow motion. The right lane leads into a visible shortcut.</span></div><div><b>CROSSWALK</b><span>Sort each visitor\u2019s word while autopilot approaches in slow motion. Clear the crossing before you arrive; all cars wait if anyone is still on the road.</span></div></div><div class="help-step"><span class="step-num">3</span><div><strong>Earn your next boost.</strong><p>First-try English answers earn fuel. Every third adds a streak bonus. ${t}</p></div></div><div class="help-step"><span class="step-num">4</span><div><strong>Look after your car.</strong><p>Three small marks below the clock show your remaining hits. Each driving bump damages the car; the third ends the race. Change lanes into clear gaps. Every new race starts fully repaired.</p></div></div><p class="save-note">Choose Slytherin, Hufflepuff, Gryffindor or Ravenclaw in the garage. A first-place finish earns your team Ulti points, valid for 3 days, with 60% of tasks right first time on Relaxed or 2+ stars on Challenge: Relaxed 2/4/6 and Challenge 5/7/9 by arena, up to 40 points a day. Plan about five minutes per arena, with 12\u201316 checkpoints and longer open-road stretches. Holding acceleration and using Nitro can shorten your run. Your stars reward accurate English and clean driving. Your racing position is separate. All cars wait for pedestrians to reach the sidewalk.</p><details><summary>Race rules & keyboard shortcuts</summary><p>Finish first to unlock the next arena for this unit and difficulty. Stars still reward your English at every finishing position. Wrong answers cost 1.5 seconds and never damage your car. Each separate driving impact costs ${ae.DIFFICULTIES[Z.difficulty].penalty} seconds and one condition mark. Three hits end the race. A cracked windscreen warns after the first hit; a loose bonnet and smoke mean one hit left. Rivals can close the gap while you recover, using their normal driving. Autopilot protects your car and reading time. Relaxed gives 3 seconds of impact protection; Challenge gives 2. Each retry starts fully repaired. Correct shortcuts add 3 seconds; wrong routes take a recoverable detour. Rivals share your regular top speed and earn fuel for boosts. Nitro waits through tasks and crossings. Use 1 / 2 / 3 for the road signs or repair blocks. Use \u2190 / \u2192 at crosswalks. Escape / P pauses. Missed words return later, with an optional review lap after the finish.</p></details><button id="help-done" class="primary">${i?"LET\u2019S DRIVE":"GOT IT"} \u2197</button>`),I("help-done").onclick=()=>{Cn(),i?(Z.crosswalkTutorial=!0,Rn(),br()):gc&&(ae.resume(w),gc=!1)}}function br(i=null){if(!Xt(Z.teamId)){Mr();return}if(!Array.isArray(i)&&!xc(Zt)){Mr(),Ms("Finish first to unlock the next arena.");return}jp(),I("launch-caption").textContent=Yt?"HOLD TO DRIVE \xB7 SWIPE TO STEER \xB7 SLIDE \u2191 FOR NITRO":"READ THE ROAD. RACE YOUR RIVALS.",Ts(),Eu=0,yc=null,hn=null,Bi=0,I("toast").classList.remove("visible"),I("celebration").hidden=!0,I("celebration").innerHTML="",document.body.classList.remove("race-finished","car-critical","car-breaking");let e=Array.isArray(i)?i:null;Ac(),Wa(),Cn(),w=e?ae.createReviewLap(ki(),e,Z.difficulty,Date.now(),{fuel:Z.fuel}):ae.createRace(ki(),Z.difficulty,Zt,Date.now(),{fuel:Z.fuel,reviews:Z.reviewQueue[ki().id]||[]}),ab(w),w.teamId=Z.teamId,w.runId=Uc("run"),e||lm(w),Su=0,Ss=0,Er="race",Fa="",bc="",Sc=null,Et.setup(e?0:Zt),Et.clearGate(),Et.currentLane=0,Et.setCosmetics(vs(Z)),I("rival-tags").innerHTML=w.rivals.map(t=>`<span data-rival="${t.id}" style="--rival:#${t.color.toString(16)}">${t.name}<small></small></span>`).join(""),document.body.classList.add("racing"),I("home").hidden=!0,I("hud").hidden=!1,I("pause").hidden=!1,I("countdown").hidden=!1,I("warning").hidden=!0,I("road-learning").hidden=!0,I("controls").hidden=!0,Tu=0,I("launch-kicker").textContent=w.arena.name.toUpperCase(),I("launch-caption").textContent=w.reviewLap?"A SHORT LAP. A STRONGER NEXT DRIVE.":"YOU \xB7 COBALT \xB7 EMBER",Ye.unlock(),Ye.tone("click")}function Mr(){document.body.dataset.nitroLevel="0",Ac(),Wa(),w=null,Er="home",bc="",Fa="",Sc=null,gc=!1,Et?.clearGate(),Cn(),document.body.classList.remove("racing","nitro-active","race-finished","nitro-ready","car-critical","car-breaking"),hn=null,Bi=0,I("toast").classList.remove("visible"),I("celebration").hidden=!0,I("celebration").innerHTML="",I("rival-tags").innerHTML="";for(let i of["route-status","hud","pause","countdown","warning","road-learning","controls"])I(i).hidden=!0;I("home").hidden=!1,As(),Ye.update(null)}function Tr(){if(!w||!ae.pause(w))return;Ye.tone("pause");let i=Xt(w.teamId),e=ae.raceOrder(w).findIndex(t=>t.id==="player")+1;Si(`${Sr("think")}<span class="modal-kicker">PIT STOP \xB7 WORDRAMP</span><h2 id="modal-title">Take a breath.</h2><p>Your race clock is paused.</p><div class="pause-lesson"><strong>${ht(w.arena.name)}</strong><span>Grade ${Z.grade} \xB7 ${ht(w.unit.title)} \xB7 ${ae.DIFFICULTIES[w.difficulty].label}</span><span class="pause-team" style="--team:${i.accent}">${ht(i.name)}</span></div><dl class="pause-stats"><div><dt>FIRST TRY</dt><dd id="pause-accuracy">${w.correct} / ${w.tasks.length}</dd></div><div><dt>DISTANCE</dt><dd id="pause-distance">${Math.floor(w.distance)} / ${w.arena.length} m</dd></div><div><dt>CHECKPOINTS</dt><dd id="pause-checkpoints">${w.taskIndex} / ${w.tasks.length}</dd></div><div><dt>${ae.raceFailed(w)?"STATUS":"POSITION"}</dt><dd>${ae.raceFailed(w)?"DNF":w.reviewLap?"Review lap":e+" / 3"}</dd></div><div><dt>BEST STREAK</dt><dd>${w.bestStreak}</dd></div><div><dt>CAR CONDITION</dt><dd>${ae.carCondition(w).remaining} / 3 hits left</dd></div></dl><button id="resume" class="primary">BACK ON THE ROAD \u2197</button><div class="pause-tools"><button id="pause-settings">Settings</button><button id="pause-help">How to play</button><button id="pause-sound">Sound ${Z.sound?"on":"off"}</button></div><div class="modal-actions"><button id="restart" class="secondary">Restart race</button><button id="exit-race" class="secondary">Return to garage</button></div>`),I("resume").onclick=()=>{Cn(),ae.resume(w)},I("pause-settings").onclick=()=>{ae.resume(w),rm()},I("pause-help").onclick=()=>{ae.resume(w),Pu()},I("pause-sound").onclick=()=>{Z.sound=!Z.sound,Ye.unlock(),wc(),Rn(),I("pause-sound").textContent="Sound "+(Z.sound?"on":"off")},I("restart").onclick=br,I("exit-race").onclick=Mr}function mb(){if(Er==="home"){Mr();return}if(w&&["finished","failed"].includes(w.status)){Mr();return}Tr()}var He={key:"",sequence:[],pointerId:null,point:null,dragging:!1,errorUntil:0};function gb(){return[...I("road-answers").querySelectorAll("[data-block]")].map(i=>{let e=i.getBoundingClientRect();return{id:+i.dataset.block,left:e.left-3,right:e.right+3,top:e.top-3,bottom:e.bottom+3}})}function Zp(){He.pointerId!==null&&I("road-answers").hasPointerCapture?.(He.pointerId)&&I("road-answers").releasePointerCapture(He.pointerId),He={key:"",sequence:[],pointerId:null,point:null,dragging:!1,errorUntil:0},I("repair-path").setAttribute("d",""),I("repair-tip").setAttribute("d","")}function Rc(){let i=He.sequence.map(n=>{let s=I("road-answers").querySelector(`[data-block="${n}"]`);return s?{x:parseFloat(s.style.left),y:parseFloat(s.style.top)}:null}).filter(n=>n&&Number.isFinite(n.x)&&Number.isFinite(n.y));I("repair-path").setAttribute("d",i.map((n,s)=>(s?"L":"M")+n.x+" "+n.y).join(" "));let e=i.at(-1),t=He.dragging&&He.point;I("repair-tip").setAttribute("d",e&&t?"M"+e.x+" "+e.y+" L"+t.x+" "+t.y:""),I("repair-links").classList.toggle("error",performance.now()<He.errorUntil),I("repair-links").classList.toggle("complete",!!w?.task?.solved)}function Cc(i){if(!(w?.status!=="task"||w.task.kind!=="repair"||w.task.solved||performance.now()<He.errorUntil||He.sequence.includes(i))&&(He.sequence.push(i),Ye.tone("build"),He.sequence.length===3)){let e=ae.connectRepair(w,He.sequence);He.dragging=!1,He.point=null,e||(He.errorUntil=performance.now()+650)}}function xb(i){if(He.pointerId!==null&&He.pointerId!==i.pointerId||w?.status!=="task"||w.task.kind!=="repair"||w.task.solved||performance.now()<He.errorUntil)return;let e=i.target.closest("[data-block]");e&&(i.preventDefault(),i.stopPropagation(),Ye.unlock(),He.pointerId=i.pointerId,He.dragging=!0,He.point={x:i.clientX,y:i.clientY},I("road-answers").setPointerCapture(i.pointerId),Cc(+e.dataset.block),Rc())}function yb(i){if(!He.dragging||i.pointerId!==He.pointerId)return;i.preventDefault();let e=i.getCoalescedEvents?.();for(let t of e?.length?e:[i]){let n={x:t.clientX,y:t.clientY},s=He.point||n;for(let r of Fp(s,n,gb(),He.sequence))Cc(r);He.point=n}Rc()}function Lu(i){i.pointerId===He.pointerId&&(He.dragging=!1,He.point=null,I("road-answers").hasPointerCapture?.(i.pointerId)&&I("road-answers").releasePointerCapture(i.pointerId),He.pointerId=null,Rc())}I("road-answers").addEventListener("pointerdown",xb);I("road-answers").addEventListener("pointermove",yb);I("road-answers").addEventListener("pointerup",Lu);I("road-answers").addEventListener("pointercancel",Lu);var ka=null;I("pedestrian-words").addEventListener("pointerdown",i=>{let e=i.target.closest("[data-person]");!e||w?.status!=="task"||w.task.kind!=="pedestrian"||w.task.pedWait>0||(i.preventDefault(),Ye.unlock(),ka={id:i.pointerId,x:i.clientX,y:i.clientY,person:w.task.personIndex},e.setPointerCapture(i.pointerId))});function um(i){if(ka?.id!==i.pointerId)return;let e=ka;ka=null,i.type!=="pointercancel"&&w?.task?.personIndex===e.person&&Math.abs(i.clientX-e.x)>22&&Math.abs(i.clientX-e.x)>Math.abs(i.clientY-e.y)*.7&&ae.sortPerson(w,i.clientX>e.x?1:0)&&Ye.tone("click"),i.target.hasPointerCapture?.(i.pointerId)&&i.target.releasePointerCapture(i.pointerId)}I("pedestrian-words").addEventListener("pointerup",um);I("pedestrian-words").addEventListener("pointercancel",um);function _b(){let i=["task","resolving"].includes(w?.status),e=w?.task,t=i?ae.currentRow(w)||e?.rows[0]:null,n=e?.completed?w.elapsed-e.completedAt:0,s=w?.status==="resolving"&&n>.6;if(I("road-learning").hidden=!t||n>1.05,I("road-learning").classList.toggle("leaving",s),!t){He.key&&w?.status!=="paused"&&Zp();return}let r=e.kind==="repair",a=e.kind==="pedestrian",o=e.id;if(I("road-learning").classList.toggle("repair-mode",r),I("road-learning").classList.toggle("pedestrian-mode",a),I("repair-links").hidden=!r,I("pedestrian-words").hidden=!a,bc!==o){_c?.disconnect();for(let y of["app","hud","controls","road-prompt"])_c?.observe(I(y));Ts(),Zp(),nt("road-feedback",""),Oa=0,bc=o,He.key=o,ka=null,I("road-kicker").textContent=r?e.reviewOf?"REVIEW REPAIR \xB7 AUTO CRUISE":"ROAD REPAIR \xB7 AUTO CRUISE":e.reviewOf?"SECOND LOOK \xB7 A DIFFERENT CLUE":a?"CROSSWALK":e.picture?e.kind==="light"?"PICTURE SIGN \xB7 GREEN LIGHT":"PICTURE ROUTE":e.kind==="light"?"GREEN LIGHT":"CHOOSE YOUR ROUTE",I("road-question").textContent=r?e.reviewOf?e.prompt:"Release the car. Connect the 3 blocks.":a?"Which category does each word belong to?":e.prompt,e.picture==="word"&&I("road-question").insertAdjacentHTML("afterbegin",`<img class="sign-emoji" src="${wu(e.image)}" alt="Picture clue" draggable="false">`),I("road-prompt").classList.toggle("picture-sign",!!e.picture),I("road-instruction").textContent=r?"DRAG THROUGH ALL 3 BLOCKS IN THE RIGHT ORDER":a?"SWIPE THE WORD LEFT / RIGHT \xB7 OR TAP A CATEGORY":"STEER INTO YOUR ANSWER \xB7 TAP A SIGN TO STEER",I("road-answers").innerHTML=t.options.map((y,v)=>`<button class="road-answer ${r?"repair-block":a?"category-sign":""}" ${r?`data-block="${e.order[v]}"`:a?`data-side="${v}"`:`data-lane="${v}"`} aria-label="${r?"Connect block":a?`Send person ${v===0?"left":"right"}`:`Steer into ${["left","middle","right"][v]} lane`}: ${ht(y)}"><span class="answer-letter">${r?"\u25C9":a?v===0?"\u2190 LEFT":"RIGHT \u2192":["A)","B)","C)"][v]}</span><span class="answer-text">${e.optionImages?`<img class="answer-emoji" src="${wu(e.optionImages[v])}" alt="${ht(y)}" draggable="false">`:Xp(a?Lp(y):y.replace(/^…\s*/,""))}</span></button>`).join(""),I("road-answers").querySelectorAll("button").forEach(y=>{_c?.observe(y),y.onclick=v=>{w?.status==="task"&&(r?v.detail===0&&Cc(+y.dataset.block):a?(Ye.unlock(),ae.sortPerson(w,+y.dataset.side)&&Ye.tone("click")):(Ye.unlock(),ae.choose(w,+y.dataset.lane),Ye.tone("click"),ni("click")))}}),I("pedestrian-words").innerHTML=a?e.people.map(y=>`<button class="person-word" data-person="${y.id}" aria-label="Swipe ${ht(y.word)} left or right"><span>${Xp(y.word)}</span><small>\u2190 SWIPE \u2192</small></button>`).join(""):""}r?(e.solved&&He.sequence.length!==3&&(He.sequence=e.connection.slice()),He.errorUntil&&performance.now()>=He.errorUntil&&(He.sequence=[],He.errorUntil=0),nt("road-question",e.solved?e.answer:e.reviewOf?e.prompt:"Release the car. Connect the 3 blocks."),nt("road-kicker",e.solved?"ROAD REPAIRED":e.reviewOf?"REVIEW REPAIR \xB7 AUTO CRUISE":"ROAD REPAIR \xB7 AUTO CRUISE"),nt("road-instruction",e.solved?"SENTENCE CONNECTED \xB7 ROAD REPAIRED":He.errorUntil?"TRY A DIFFERENT ORDER":"DRAG THROUGH ALL 3 BLOCKS IN THE RIGHT ORDER")):a&&nt("road-kicker",e.completed?ae.crosswalkOccupied(w,e)?"VISITORS LEAVING":"CROSSWALK CLEAR":`CROSSWALK \xB7 VISITOR ${Math.min(e.personIndex+1,e.people.length)} / ${e.people.length}`);let c=Et.roadProjection(),l=I("road-prompt"),h=c.answers;if(h.length!==3)return;let{width:u,height:f}=Et.viewport||{width:innerWidth,height:innerHeight},d=f<600&&u>f,m=Np(u,h),x=[...I("road-answers").querySelectorAll("button")];if(x.forEach((y,v)=>{let C=m[a?v*2:v].width;bs(y,"width",C.toFixed(1)+"px"),qp(y,y.querySelector(".answer-text"),C)}),a)for(let y of I("pedestrian-words").children)bs(y,"width",m[1].width.toFixed(1)+"px"),qp(y,y.querySelector("span"),m[1].width);let{hudBottom:g,controlsTop:p,promptHeight:b,answerHeight:M}=sm(),_=d?10:17,P=p-12,{py:S,ay:A,stagger:R}=Op({hudBottom:g,promptHeight:b,answerHeight:M,promptY:c.prompt.y,answerY:h[1].y,controlsTop:p,repair:r,landscape:d,viewportHeight:f});if(bs(l,"left",u/2+"px"),bs(l,"top",S.toFixed(1)+"px"),x.forEach((y,v)=>{let C=r?+y.dataset.block:null,L=He.sequence.indexOf(C),O=r&&L>=0;if(y.disabled=w.status!=="task"||a&&(e.pedWait>0||!ae.pedestrianReady(w,e)),y.classList.toggle("selected",!r&&!a&&w.lane===v-1),y.classList.toggle("linked",O),y.classList.toggle("connected",r&&e.solved||!r&&!a&&e.completed&&v===e.correctIndex),y.classList.toggle("error",O&&performance.now()<He.errorUntil),y.setAttribute("aria-pressed",String(r?O:!a&&w.lane===v-1)),r){let G=y.querySelector(".answer-letter"),X=O?String(L+1):"\u25C9";G.textContent!==X&&(G.textContent=X)}let z=m[a?v*2:v];bs(y,"left",z.x.toFixed(1)+"px"),bs(y,"top",(A+(r&&v===1?R:0)).toFixed(1)+"px")}),a){I("road-instruction").textContent=e.completed?ae.crosswalkOccupied(w,e)?"WAIT UNTIL ALL VISITORS REACH THE SIDEWALK":"CROSSWALK CLEAR \xB7 LET\u2019S GO":ae.pedestrianReady(w,e)?`SWIPE LEFT / RIGHT \xB7 ${Math.ceil(ae.crosswalkTimeLeft(w,e))}s`:e.peopleEntryAt==null?"TRAFFIC CLEARING THE STRIPES":"VISITORS APPROACHING \xB7 READ THE CATEGORIES";let y=Et.pedestrianProjection(w);[...I("pedestrian-words").children].forEach((v,C)=>{let L=e.people[C],O=y[C],z=L.sent?w.elapsed-L.sentAt:0,G=O?.visible&&ae.pedestrianReady(w,e)&&(C===e.personIndex&&!L.sent||L.sent&&z<1.4);v.hidden=!G,v.disabled=L.sent||e.pedWait>0||w.status!=="task",v.classList.toggle("departing",L.sent),v.classList.toggle("wrong",L.sent&&!L.correct),v.style.opacity=L.sent?String(Math.max(0,1-z/1.4)):String(ae.clamp((w.elapsed-L.entryAt)/.25,0,1)),v.style.width=m[1].width+"px",v.style.left=(L.sent?O?.x:m[1].x)+"px",v.style.top=Math.max(S+b/2+v.offsetHeight/2+_,Math.min(O?.y||A,P-v.offsetHeight/2))+"px",v.querySelector("small").textContent=L.sent?L.correct?"\u2713 SORTED":"\u2197 CORRECTION":"\u2190 SWIPE \u2192"})}I("decision-fill").style.width=(e.completed?0:a?ae.crosswalkTimeLeft(w,e)/e.sortDuration*100:ae.clamp((t.at-w.distance)/(r?82:70)*100,0,100))+"%",r&&Rc()}function vb(){Wa(),Ac();let i=Ir(w),e=w.failureReason==="breakdown"||w.damage>=ae.DAMAGE_LIMIT||!!w.breakdown,t=ae.stars(w),n=Math.round(100*w.correct/Math.max(1,w.tasks.length)),s=i?ae.raceOrder(w).findIndex(m=>m.id==="player")+1:null;if(i&&!w.reviewLap){let m=w.unit.id+":"+w.difficulty,x=(Z.progress[m]||[0,0,0]).slice();x[w.arenaIndex]=Math.max(x[w.arenaIndex],t),Z.progress[m]=x,Ss=Math.max(Ss,Hp(Z,w.unit.id,w.arenaIndex)),kp(Z,w,s),Rn()}let r=Ju(Z,w,s,t),a=r.status==="awarded"&&!r.duplicate?r.receipt:null;a&&Rn();let o=bn.enabled&&!w.reviewLap&&(r.status==="awarded"&&!r.duplicate||r.status==="cap"),c=Xt(w.teamId),l=om(w);if(o){let m=w;bn.claim(m.runId).then(x=>(w===m&&ub(x,l,c),bn.flush())).catch(()=>{})}let h=r.status==="stars"?w.difficulty==="relaxed"?`Relaxed Ulti points need ${Math.round(Is*100)}% of tasks right first time to earn ${Cr(w.difficulty,w.arenaIndex)}.`:`Challenge Ulti points need ${Wi} stars: answer 3 in 4 tasks right first time to earn ${Cr(w.difficulty,w.arenaIndex)}.`:r.status==="cap"?`Today's ${Xi} Ulti points are already earned on this device. Wins count again tomorrow.`:"";Sc={finished:i,stars:t},Ye.tone(i?"finish":e?"breakdown":"wrong"),I("road-learning").hidden=!0,I("controls").hidden=!0,I("warning").hidden=!0,I("pause").hidden=!0;let u=w.review.filter(m=>!m.recovered),f=pc(Z,w.unit.id),d=i&&s===1&&!w.reviewLap&&w.arenaIndex<2&&Na(Z,w.unit.id,w.difficulty,w.arenaIndex+1);Si(`${Sr(i?s===1&&!w.reviewLap?"cheer":"smile":"think")}<span class="modal-kicker">${w.reviewLap?i?"REVIEW LOOP COMPLETE":"REVIEW LOOP \xB7 TRY AGAIN":i?"ENGLISH GRAND PRIX":e?"THREE HITS \xB7 RACE ENDED":"THE ROAD IS WORTH ANOTHER TRY"}</span><div class="finish-emblem" aria-hidden="true"><span>${i?"FINISH":e?"BREAKDOWN":"KEEP GOING"}</span><strong>${i?w.reviewLap?"\u2713":String(s).padStart(2,"0"):e?"!":"\u2197"}</strong><small>${w.reviewLap?"REVIEW":i?"RACE POSITION":e?"BACK TO THE GARAGE":"NEXT TIME"}</small></div><h2 id="modal-title">${i?w.reviewLap?"A stronger next drive.":s===1?"You took the lead.":"What a drive!":e?"Car broken down.":w.failureReason==="time"?"Time ran out.":"Race not finished."}</h2><p>${ht(w.arena.name)} \xB7 ${ae.DIFFICULTIES[Z.difficulty].label}${i&&!w.reviewLap?" \xB7 POSITION "+s+"/3":""}</p>${i?"":'<div class="result-dnf" role="status"><strong>DNF</strong><span>DID NOT FINISH</span></div>'}<div class="result-stars" aria-label="${t} out of 3 stars">${Array.from({length:3},(m,x)=>`<span class="${x<t?"":"empty"}">\u2605</span>`).join("")}</div><div class="result-stats"><div class="result-stat"><strong>${Math.ceil(w.time)}s</strong><small>TIME LEFT</small></div><div class="result-stat"><strong>${n}%</strong><small>FIRST TRY</small></div><div class="result-stat"><strong>${w.collisions}</strong><small>BUMPS</small></div></div>${i&&!w.reviewLap?`<div class="podium">${ae.raceOrder(w).map((m,x)=>`<span class="${m.id==="player"?"you":""}"><b>${x+1}</b> ${ht(m.name)}</span>`).join("")}</div>`:""}<p>${w.reviewLap?"Review strengthens your English. Win the full race to unlock the next arena.":i?"Stars reward your English and clean driving. First place unlocks the next arena.":e?"Three separate hits ended this race. Your next drive starts with a fully repaired car. Read the gaps and save Nitro for a clear stretch.":"Try Relaxed for more thinking time, or take a short review lap before the next race."}</p>${a?`<div class="ulti-win" style="--team:${Xt(w.teamId).accent}"><span>FIRST PLACE \xB7 ${Xt(w.teamId).name.toUpperCase()}</span><strong>+${a.points} <small>ULTI POINTS</small></strong><p>${r.capped?`Daily limit reached (${Xi}) \xB7 `:""}Valid for 3 days \xB7 expires ${ht(new Date(a.expiresAt).toLocaleString())}</p></div>`:h?`<div class="ulti-win ulti-missed" style="--team:${Xt(w.teamId)?.accent||"#a5caff"}"><span>FIRST PLACE \xB7 NO ULTI POINTS</span><p>${ht(h)}</p></div>`:""}${o?'<p id="league-result" class="league-result pending" role="status">Sending your win to the English League\u2026</p>':""}<div class="achievement">FUEL ${w.fuel}/100 \xB7 BEST STREAK ${w.bestStreak} \xB7 CHARGES LOADED ${w.nitroUses}</div>${Ss?`<div class="achievement">MASTERY REWARD \xB7 ${["","EXPLORER BADGE","SCHOLAR BADGE","MASTER BADGE + AURORA TRAIL"][Ss]}</div>`:""}<p class="save-note">Unit mastery: ${f.unique} distinct items \xB7 ${f.accuracy}% first try \xB7 ${f.arenas}/3 arenas</p>${d?`<div class="achievement">UNLOCKED \xB7 ${ht(ae.ARENAS[w.arenaIndex+1].name)}</div>`:i&&!w.reviewLap&&w.arenaIndex<2&&s!==1?`<p class="arena-goal">${Na(Z,w.unit.id,w.difficulty,w.arenaIndex+1)?"Finish first to advance from this race.":`Finish first in ${ht(w.arena.name)} to unlock ${ht(ae.ARENAS[w.arenaIndex+1].name)}.`}</p>`:""}${u.length?`<details><summary>Review ${u.length} missed item${u.length>1?"s":""}</summary>${u.map(m=>`<div class="review-item"><span>${ht(m.prompt)}</span><strong>${ht(m.answer)}</strong>${m.tr?`<small>${ht(m.tr)}</small>`:""}</div>`).join("")}</details><button id="review-lap" class="review-lap-button">SHORT REVIEW LAP \xB7 UP TO 6 ITEMS \u2197</button>`:w.review.length?'<div class="achievement">MISSED ITEMS RECOVERED ON THE ROAD</div>':""}<div class="modal-actions"><button id="replay" class="${d?"secondary":"primary"}">DRIVE AGAIN</button>${d?'<button id="next-arena" class="primary">NEXT ARENA \u2197</button>':""}</div><button class="text-button" id="result-home">Return to garage</button><p class="save-note">${Ru?"Wins, stars, fuel and mastery are saved in this browser.":"This browser is blocking saves. Keep this tab open to retain your progress."}</p>`),I("modal").classList.add("finish-modal"),I("modal").classList.toggle("dnf-result",!i),i&&ob(),I("replay").onclick=()=>br(),I("result-home").onclick=Mr,I("review-lap")&&(I("review-lap").onclick=()=>br(u)),I("next-arena")&&(I("next-arena").onclick=()=>{if(!d||w.status!=="finished"||ae.raceOrder(w)[0]?.id!=="player")return;let m=w.arenaIndex+1;Na(Z,w.unit.id,w.difficulty,m)&&(Zt=m,br())})}function bb(){Si(`<span class="modal-kicker">RACE JOURNAL \xB7 GRADE ${Z.grade}</span><h2 id="modal-title">Every road counts.</h2><p>${ae.DIFFICULTIES[Z.difficulty].label} difficulty \xB7 three arenas per unit</p>${zi.find(i=>i.grade===Z.grade).units.map(i=>{let e=Z.progress[i.id+":"+Z.difficulty]||[0,0,0],t=e.reduce((n,s)=>n+s,0);return`<div class="journal-unit"><span>${ht(i.title)}</span><span>${t} / 9 \u2605</span></div>`}).join("")}<p class="save-note">Progress is kept separately for each unit and difficulty in this browser.</p><button id="journal-ulti" class="review-lap-button">TEAM ULTI POINTS \u2197</button><button id="journal-done" class="primary">BACK TO GARAGE</button>`),I("journal-done").onclick=Cn,I("journal-ulti").onclick=hm}var Jp=-1/0;function Mb(i){i-Jp>1e3&&(Jp=i,Tc());let e=id(w,{modalOpen:!I("modal-backdrop").hidden}),t=e.question;document.body.classList.contains("reading-zone")!==t&&Ts(),document.body.classList.toggle("reading-zone",t),document.body.dataset.hudPhase=e.phase;let n=ae.focusCruise(w),s=n&&w.focusAuto?.returning!=null,r=ae.canShortenFocus(w);if(document.body.classList.toggle("focus-cruise",n),document.body.classList.toggle("repair-cruise",ae.repairCruise(w)),document.body.style.setProperty("--focus-amount",n?Math.max(0,Math.min(1,w.focusAmount||0)):0),document.body.dataset.focusPhase=s?"return":n?"cruise":"off",I("throttle").disabled=!1,I("throttle").setAttribute("aria-label",n?r?"Hold to return to normal pace sooner.":Au()?"Acceleration held. Quick return begins after your choice is ready.":"Autopilot holds your entry speed. After choosing, hold to return to normal pace sooner.":"Hold to accelerate"),document.body.classList.toggle("accelerating",!!w?.accelerating&&w.speedFactor>.05),!w){$p(i,e);return}I("controls").hidden=Yt||!["driving","task","resolving"].includes(w.status),Ac(),document.body.classList.toggle("nitro-active",!!w.nitroActive&&["driving","resolving"].includes(w.status));let a=ae.raceOrder(w),o=a.findIndex(y=>y.id==="player")+1,c=ae.raceFailed(w);nt("race-place",c?"DNF":w.reviewLap?"REVIEW":o+" / 3"),nt("place-label",c?"STATUS":w.reviewLap?"LAP":"POSITION"),yc!==null&&o<yc&&w.status==="driving"&&(Ms(o===1?"Taking the lead":"Clean overtake",!1,()=>w&&ae.raceOrder(w).findIndex(y=>y.id==="player")+1===o),e.announcementsAllowed&&Ye.tone("overtake")),yc=o;let l=ae.carCondition(w),h=I("car-condition");h.dataset.damage=String(l.damage),h.setAttribute("aria-label",l.broken?"Car condition: broken down":`Car condition: ${l.remaining} ${l.remaining===1?"hit":"hits"} remaining${l.critical?"; critical":""}`),[...h.children].forEach((y,v)=>y.classList.toggle("intact",v<l.remaining)),document.body.classList.toggle("car-critical",l.critical),document.body.classList.toggle("car-breaking",w.status==="breakdown");let u=I("condition-notice");u.hidden=!w.lastImpact||w.elapsed-w.lastImpact.at>2.4||!["driving","breakdown"].includes(w.status)||ae.learningPaceProtected(w),u.dataset.damage=String(l.damage),u.hidden||nt("condition-notice",l.broken?"CAR BROKEN DOWN":l.critical?"CRITICAL \xB7 ONE HIT LEFT":"DAMAGED \xB7 TWO HITS LEFT"),I("pause").hidden=["breakdown","finished","failed"].includes(w.status),nt("fuel-value",w.fuel),I("fuel-fill").style.width=w.fuel+"%",nt("streak-count",w.streak),I("fuel-value").parentElement.setAttribute("aria-label","Fuel "+w.fuel+" out of 100"),I("streak-count").parentElement.setAttribute("aria-label","English streak "+w.streak),[...I("streak-pips").children].forEach((y,v)=>y.classList.toggle("lit",v<(w.streak?(w.streak-1)%3+1:0)));let f=ae.canEngageNitro(w),d=ae.canNitro(w),m=w.nitro>0?w.nitroLevel||1:0;I("nitro").disabled=!f,I("nitro-stack").disabled=!d,I("nitro-stack").setAttribute("aria-label",m===3?"Maximum charge level reached":"Add Nitro charge: 30 fuel"),nt("stack-label",m===3?"MAX":"30"),I("nitro").classList.toggle("ready",f),I("nitro").classList.toggle("saved",m>0&&!w.nitroActive),document.body.classList.toggle("nitro-ready",f),nt("nitro-title",m&&!w.nitroActive?"SAVED":m===3?"MAX POWER":m===2?"DOUBLE":"NITRO"),nt("nitro-label",m?w.nitro.toFixed(1)+"s"+(w.nitroActive?"":" \xB7 HOLD"):w.fuel>=30?"HOLD \xB7 30":w.fuel+" / 30"),[...I("nitro-slots").children].forEach((y,v)=>y.classList.toggle("lit",v<m)),I("nitro-ring-fill").style.strokeDashoffset=String(100*(1-(m?w.nitro/(ae.NITRO_DURATION*m):Math.min(1,w.fuel/30)))),I("nitro").style.setProperty("--charge",m?w.nitro/(ae.NITRO_DURATION*m):Math.min(1,w.fuel/30)),I("nitro").setAttribute("aria-pressed",String(!!w.nitroHeld)),I("nitro").setAttribute("aria-label",m?`Hold to use saved level ${m} Nitro: ${w.nitro.toFixed(1)} seconds remaining; release to save`:"Hold to load and use Nitro: 30 fuel");let x=I("touch-nitro");x.hidden=!Yt||!["driving","task","resolving"].includes(w.status),nt("touch-nitro-state",w.nitroActive?"BOOST \xD7"+m:m?"SAVED \xD7"+m:f?"NITRO":"FUEL"),nt("touch-fuel",w.fuel),x.classList.toggle("boosting",!!w.nitroActive),x.classList.toggle("ready",f),I("touch-nitro-fill").style.width=Math.min(100,100*(m?w.nitro/(ae.NITRO_DURATION*m):w.fuel/30))+"%",[...I("touch-nitro-levels").children].forEach((y,v)=>y.classList.toggle("lit",v<m)),x.setAttribute("aria-label",`Nitro ${w.nitroActive?"boosting":m?"saved":"ready at 30 fuel"}; level ${m} of 3; fuel ${w.fuel} out of 100${m?"; "+w.nitro.toFixed(1)+" seconds saved":""}`);let g=w.nitroActive?m:0;g&&g!==Tu&&(Ye.tone("nitro"+g),ni("go")),Tu=g;let p=Et.rivalProjection(),b=Up(p.map(y=>({...y,distance:(w.rivals.find(v=>v.id===y.id)?.at??0)-w.distance})),{width:Et.viewport?.width||innerWidth,top:Ba.hudBottom+(e.approaching||e.route?60:0),bottom:Ba.controlsTop});for(let y of I("rival-tags").children){let v=w.rivals.find(L=>L.id===+y.dataset.rival),C=p.find(L=>L.id===v.id);y.hidden=!b.includes(v.id)||t||["finished","failed"].includes(w.status),y.style.left=(C?.x||0)+"px",y.style.top=(C?.y||0)+"px",y.classList.toggle("boosting",!!v.nitroActive),y.querySelector("small").textContent=(v.nitroActive?"NITRO \xB7 ":"")+(v.at>=w.distance?"+":"")+Math.round(v.at-w.distance)+"m"}let M=Math.max(0,Math.ceil(w.time)),_=Math.min(100,w.distance/w.arena.length*100);nt("time",Math.floor(M/60)+":"+String(M%60).padStart(2,"0")),I("time").parentElement.classList.toggle("urgent",M<20),I("progress-fill").style.width=_+"%",I("progress-fill").parentElement.setAttribute("aria-valuenow",String(Math.round(_))),nt("road-fairness",ae.learningPaceProtected(w)?"TASK PACE PROTECTED \xB7 RIVALS MATCH YOU":"");let P=nd(w,ae.REGULAR_MAX_SPEED,ae.MAX_SPEED);nt("speed",P),I("throttle").style.setProperty("--speed-fill",P/200),document.body.dataset.nitroLevel=String(w.nitroActive&&["driving","resolving"].includes(w.status)?w.nitroLevel||1:0),I("throttle").setAttribute("aria-pressed",String(!!w.accelerating||n&&Au())),I("speedlines").classList.toggle("boost",w.boost>0&&w.status==="driving"),I("speedlines").classList.toggle("focus",w.status==="task"),I("speedlines").classList.toggle("accelerating",w.accelerating&&w.speedFactor>.05),I("left").setAttribute("aria-label",w.status==="task"&&w.task.kind==="pedestrian"?"Send visitor left":"Steer left"),I("right").setAttribute("aria-label",w.status==="task"&&w.task.kind==="pedestrian"?"Send visitor right":"Steer right");let S=w.status==="task"&&w.task?.kind==="pedestrian";if(I("left").disabled=I("right").disabled=S?w.task.pedWait>0||!ae.pedestrianReady(w):ae.steeringLocked(w)||!!ae.exitAssist(w)||!!w.route,nt("drive-hint",s?"RESUMING":r?window.matchMedia("(pointer: coarse)").matches?"HOLD TO RESUME":"HOLD \u2191 TO RESUME":n?ae.steeringLocked(w)?"AUTO CRUISE":"FOCUS \xB7 STEER":w.speedFactor<.05&&(w.yielding||w.followingTraffic)?w.yielding?"WAITING":"CHANGE LANE":ae.exitAssist(w)?"ACCELERATE":w.route?w.route.shortcut?"SHORTCUT":"DETOUR":w.nitroActive?"NITRO BOOST":w.accelerating?"ACCELERATING":window.matchMedia("(pointer: coarse)").matches?"HOLD TO DRIVE":"HOLD \u2191"),w.notice){let y=w.notice;w.notice=null,y.type==="nitro"?Ms(y.text,!1,()=>w?.nitro>0):y.type==="collision"||y.type==="breakdown"?(I("hit-flash").classList.remove("active"),I("hit-flash").offsetWidth,I("hit-flash").classList.add("active"),Ye.tone(y.type==="breakdown"?"breakdown":"collision"),ni("collision")):y.type==="correct"||y.type==="sorted"?(Ye.tone("correct"),ni("correct"),Ms(y.text)):y.type==="wrong"&&(Ye.tone("wrong"),Ms(y.text,!0))}if(w.status==="countdown"){I("countdown").hidden=!1;let y=Math.max(1,Math.ceil(w.countdown));y!==Eu&&(Eu=y,nt("launch-number",y),I("countdown").dataset.step=y,[...I("countdown").querySelectorAll(".launch-lights i")].forEach((v,C)=>v.classList.toggle("lit",C<4-y)),Ye.tone("tick"),ni("click"))}if(w.status!=="countdown"&&!I("countdown").hidden&&(I("countdown").hidden=!0),w.status!==Fa){let y=Fa;Fa=w.status,bn.enabled&&!w.leagueTicket&&!w.reviewLap&&w.taskIndex!==Yp&&(Yp=w.taskIndex,performance.now()-am>4e3&&lm(w)),w.status==="driving"&&(I("countdown").hidden=!0,I("controls").hidden=Yt,I("road-learning").hidden=!0,y==="countdown"&&(Ye.tone("go"),ni("go"),Ms("GO \xB7 FIND YOUR LINE"))),w.status==="task"&&(I("controls").hidden=Yt,I("warning").hidden=!0),["finished","failed"].includes(w.status)&&!Sc&&vb()}let A=e.route,R=!!A&&!e.approaching&&!t&&!["finished","failed"].includes(w.status);if(I("route-status").hidden=!R,R){let y=!w.route;I("route-status").classList.toggle("detour",!A.shortcut),nt("route-label",y?"MERGING":A.shortcut?"SHORTCUT \xB7 \u221218m":"DETOUR \xB7 +32m"),nt("route-remaining",Math.max(0,Math.ceil((y?A.exitEndAt:A.end)-w.distance))+"m"),I("route-status").style.setProperty("--route-progress",ae.clamp((w.distance-A.start)/(A.exitEndAt-A.start),0,1))}if(I("warning").hidden=!e.approaching,e.approaching){let y=e.next.kind;I("warning-title").textContent={light:"Traffic light ahead",repair:"Road repair ahead",junction:"Choose your route",pedestrian:"Crosswalk ahead"}[y],I("warning-icon").textContent={light:"\u25CF",repair:"\u25B0",junction:"\u2442",pedestrian:"\u2194"}[y],nt("warning-distance",Math.ceil(e.ahead)+"m")}sm(),_b(),$p(i,e)}function Du(){return Ye.unlock(),ae.activateNitro(w)?(ni("go"),!0):!1}I("nitro").addEventListener("pointerdown",i=>{i.button>0||Es!==null||(i.preventDefault(),ae.engageNitro(w)&&(Ye.unlock(),Es=i.pointerId,I("nitro").setPointerCapture(i.pointerId),pt()))});for(let i of["pointerup","pointercancel","lostpointercapture"])I("nitro").addEventListener(i,e=>{Es===e.pointerId&&(Es=null,pt(),I("nitro").hasPointerCapture?.(e.pointerId)&&I("nitro").releasePointerCapture(e.pointerId))});I("nitro").addEventListener("keydown",i=>{(i.code==="Space"||i.key==="Enter")&&(!i.repeat&&ae.engageNitro(w)&&(Rs=!0,Ye.unlock(),pt()),i.preventDefault(),i.stopPropagation())});I("nitro").addEventListener("keyup",i=>{(i.code==="Space"||i.key==="Enter")&&(Rs=!1,pt(),i.preventDefault(),i.stopPropagation())});I("nitro").addEventListener("blur",()=>{Rs=!1,pt()});I("nitro-stack").addEventListener("keydown",i=>{(i.key===" "||i.key==="Enter")&&i.stopPropagation()});function ws(i){Ye.unlock(),w&&ae.move(w,i)&&(Ye.tone("click"),ni("click"))}document.querySelectorAll("[data-team]").forEach(i=>i.onclick=()=>{Z.teamId=i.dataset.team,Ye.tone("click"),As()});I("ulti-button").onclick=hm;I("league-button").onclick=pb;cm();bn.enabled&&(bn.flush().catch(()=>{}),bn.refresh(Z.grade).catch(()=>{}));I("lesson-picker").onclick=cb;document.querySelectorAll("[data-diff]").forEach(i=>i.onclick=()=>{Z.difficulty=i.dataset.diff,Zt=0,As()});I("settings").onclick=rm;I("start").onclick=()=>{Ye.unlock(),Z.crosswalkTutorial?br():Pu(!0)};I("help").onclick=()=>Pu();I("progress-button").onclick=bb;I("garage-button").onclick=vc;I("nitro").onclick=i=>{i.detail===0&&w&&w.nitro<=0&&Du()};I("nitro-stack").onclick=Du;I("pause").onclick=Tr;I("brand-home").onclick=i=>{i.preventDefault(),mb()};for(let[i,e]of[["left",-1],["right",1]])I(i).onpointerdown=t=>{t.button>0||(t.preventDefault(),ws(e))},I(i).onclick=t=>{t.detail===0&&ws(e)};I("sound").onclick=()=>{Z.sound=!Z.sound,Ye.unlock(),wc(),Rn(),Ye.tone("click")};I("throttle").addEventListener("pointerdown",i=>{i.button>0||Hi!==null||!w||!["driving","task","resolving"].includes(w.status)||(i.preventDefault(),Hi=i.pointerId,I("throttle").setPointerCapture(i.pointerId),Ye.unlock(),pt())});for(let i of["pointerup","pointercancel","lostpointercapture"])I("throttle").addEventListener(i,e=>{Hi===e.pointerId&&(Hi=null,pt(),I("throttle").hasPointerCapture?.(e.pointerId)&&I("throttle").releasePointerCapture(e.pointerId))});I("throttle").addEventListener("keydown",i=>{i.key==="Enter"&&(!i.repeat&&w&&["driving","task","resolving"].includes(w.status)&&(wr=!0,Ye.unlock(),pt()),i.preventDefault(),i.stopPropagation())});I("throttle").addEventListener("keyup",i=>{i.key==="Enter"&&(wr=!1,pt(),i.preventDefault(),i.stopPropagation())});I("throttle").addEventListener("blur",()=>{wr=!1,pt()});var It=null;I("world").addEventListener("pointerdown",i=>{if(i.button>0||It&&It.id!==i.pointerId)return;(i.pointerType==="touch"||i.pointerType==="pen")&&Ga(!0);let e=Cu||i.pointerType==="touch"||i.pointerType==="pen"||Yt&&i.pointerType!=="mouse",t=w&&(["driving","task","resolving"].includes(w.status)||e&&w.status==="countdown");if(t&&(i.preventDefault(),jp()),!t)return;let n=e||Et.isCarHit(i.clientX,i.clientY);It={x:i.clientX,y:i.clientY,id:i.pointerId,hold:n,touch:e,drive:e?ed(i.clientX,i.clientY):null,nitroAllowed:ae.canEngageNitro(w)},I("world").setPointerCapture(i.pointerId),n&&(un=i.pointerId,I("world").setPointerCapture(i.pointerId),Ye.unlock(),pt(),i.preventDefault())});function dm(i){if(It?.id!==i.pointerId)return;if(It.touch){let t=Oc(It.drive,i.clientX,i.clientY);if(i.preventDefault(),t.steer&&ws(t.steer),t.boostChanged&&!t.boost&&(rn=null),t.boost&&(t.boostChanged||t.levelChanged)&&ae.canEngageNitro(w)&&ae.engageNitro(w))for(Ye.unlock(),rn=i.pointerId;(w.nitroLevel||0)<t.level&&ae.canNitro(w);)ae.activateNitro(w);pt();return}let e=Qu(It,i.clientX,i.clientY);e&&(i.preventDefault(),un=null,It.hold=!1,pt(),e.type==="steer"?ws(e.direction):e.type==="nitro"&&It.nitroAllowed&&ae.engageNitro(w)&&(Ye.unlock(),rn=i.pointerId,pt()))}I("world").addEventListener("pointermove",dm);I("world").addEventListener("pointerup",i=>{if(It?.id===i.pointerId&&It.touch){let t=Oc(It.drive,i.clientX,i.clientY);t.steer&&ws(t.steer),Sb(i.pointerId);return}rn===i.pointerId&&(rn=null,pt()),un===i.pointerId&&(un=null,pt()),It?.id===i.pointerId&&(dm(i),It=null),rn===i.pointerId&&(rn=null,pt()),I("world").hasPointerCapture?.(i.pointerId)&&I("world").releasePointerCapture(i.pointerId)});function Sb(i){It?.id===i&&(It=null),rn===i&&(rn=null),un===i&&(un=null),pt(),I("world").hasPointerCapture?.(i)&&I("world").releasePointerCapture(i)}I("world").addEventListener("pointercancel",i=>{rn===i.pointerId&&(rn=null,pt()),un===i.pointerId&&(un=null,pt()),It?.id===i.pointerId&&(It=null)});I("world").addEventListener("lostpointercapture",i=>{rn===i.pointerId&&(rn=null,pt()),un===i.pointerId&&(un=null,pt()),It?.id===i.pointerId&&(It=null)});document.addEventListener("keydown",i=>{if(!["SELECT","INPUT"].includes(document.activeElement.tagName)){if(!I("modal-backdrop").hidden){if(i.key==="Tab"){let e=[...I("modal").querySelectorAll('button:not(:disabled),select,summary,[tabindex="0"]')],t=e[0],n=e.at(-1);i.shiftKey&&(document.activeElement===t||document.activeElement===I("modal"))?(n?.focus(),i.preventDefault()):!i.shiftKey&&document.activeElement===n&&(t?.focus(),i.preventDefault())}if(i.key==="Escape"&&I("lesson-cancel")){I("lesson-cancel").click();return}if(i.key==="Escape"&&I("settings-done")){I("settings-done").click();return}i.key==="Escape"&&w?.status==="paused"&&(I("resume")?.click(),!I("resume")&&I("help-done")&&I("help-done").click());return}if(i.key==="ArrowUp"&&w&&["driving","task","resolving"].includes(w.status)){i.repeat||(Va=!0,Ye.unlock(),pt()),i.preventDefault();return}if(i.key===" "&&w){!i.repeat&&ae.engageNitro(w)&&(Rs=!0,Ye.unlock(),pt()),i.preventDefault();return}if(!i.repeat&&w&&["n","N"].includes(i.key)){Du(),i.preventDefault();return}i.repeat||((i.key==="ArrowLeft"||i.key.toLowerCase()==="a")&&(ws(-1),i.preventDefault()),(i.key==="ArrowRight"||i.key.toLowerCase()==="d")&&(ws(1),i.preventDefault()),(i.key==="Escape"||i.key.toLowerCase()==="p")&&Tr(),w?.status==="task"&&/^[1-3]$/.test(i.key)&&(w.task.kind==="repair"?Cc(w.task.order[Number(i.key)-1]):w.task.kind==="pedestrian"?i.key!=="2"&&ae.sortPerson(w,i.key==="1"?0:1):ae.choose(w,Number(i.key)-1),i.preventDefault()),Er==="home"&&i.key==="Enter"&&I("start").click())}});document.addEventListener("keyup",i=>{i.key===" "&&(Rs=!1,pt(),w&&i.preventDefault()),i.key==="ArrowUp"&&(Va=!1,pt(),w&&i.preventDefault())});window.addEventListener("blur",()=>{Wa(),Tr()});document.addEventListener("visibilitychange",()=>{document.hidden?Tr():Tc()});document.addEventListener("graphicslost",()=>{Tr(),I("graphics-error").hidden=!1});try{Et=new dc(I("world"))}catch(i){console.error(i),I("graphics-error").hidden=!1,I("loading").hidden=!0}As();wc();Iu();var Kp=performance.now(),Mu=0;function fm(i){let e=(i-Kp)/1e3,t=Math.min(e,.06);Kp=i,Et?.samplePerformance(e,!!w&&["driving","task","resolving"].includes(w.status)),pt(),w&&ae.tick(w,t,Et?.currentLane??w.lane),Mu=!I("modal-backdrop").hidden&&(!w||["paused","finished","failed"].includes(w.status))?Mu+1:0,Mu%6===0&&Et?.update(t,w,Er),Mb(i),Ye.update(w,Et?.spectators?.proximity||0),i>Bi&&I("toast").classList.remove("visible"),Oa&&i>Oa&&(nt("road-feedback",""),Oa=0),requestAnimationFrame(fm)}requestAnimationFrame(fm);setTimeout(()=>I("loading").hidden=!0,500);window.WORDRAMP=window.WORDRIFT=window.WORDSHIFT={version:"0.24.0",ulti:Object.freeze({snapshot:()=>Ya(Z),export:()=>Nc(Z)}),get race(){return w},get settings(){return Z},get scene(){return Et}};})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
