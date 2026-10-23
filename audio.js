// Synthesised soundscape; no downloads and no audio before a user gesture.
// Hierarchy: engine and road convey pace, Nitro conveys power, impacts convey
// damage, task cues convey correctness and ambience sets the arena. The world
// bus ducks behind a low-pass during English focus; task cues never do.
export class Sound {
  constructor(enabled){this.enabled=enabled;this.ctx=null;this.engine=null;this.arena=-1;}
  unlock(){
    if(!this.enabled())return;
    try{
      this.ctx||=new(window.AudioContext||window.webkitAudioContext)();this.ctx.resume().catch(()=>{});
      if(this.engine)return;
      const c=this.ctx;
      this.compressor=c.createDynamicsCompressor();this.compressor.threshold.value=-18;this.compressor.ratio.value=4;this.compressor.connect(c.destination);
      this.master=c.createGain();this.master.gain.value=.7;this.master.connect(this.compressor);
      this.focusFilter=c.createBiquadFilter();this.focusFilter.type='lowpass';this.focusFilter.frequency.value=16000;this.world=c.createGain();this.world.gain.value=1;this.world.connect(this.focusFilter);this.focusFilter.connect(this.master);
      const osc=(type,target)=>{const o=c.createOscillator(),g=c.createGain();o.type=type;g.gain.value=0;o.connect(g);g.connect(target);o.start();return [o,g];};
      // Engine: a saw body and a sub an octave down, shaped by one filter.
      this.engineFilter=c.createBiquadFilter();this.engineFilter.type='lowpass';this.engineFilter.frequency.value=500;this.engineFilter.Q.value=1.4;this.engineFilter.connect(this.world);
      [this.engine,this.engineGain]=osc('sawtooth',this.engineFilter);[this.sub,this.subGain]=osc('triangle',this.engineFilter);[this.harmonic,this.harmonicGain]=osc('sine',this.world);
      const noise=(seconds,shape)=>{const b=c.createBuffer(1,c.sampleRate*seconds,c.sampleRate),d=b.getChannelData(0);let p=0;for(let i=0;i<d.length;i++){p=shape(p,Math.random()*2-1,i);d[i]=p;}return b;};
      this.noiseBuffer=noise(2,(p,w)=>(p+w*.02)/1.02*1||0);{const d=this.noiseBuffer.getChannelData(0);for(let i=0;i<d.length;i++)d[i]*=3.5;}
      this.whiteBuffer=noise(2,(p,w)=>w);
      const loop=(buffer,type,frequency,q=.7)=>{const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=buffer;s.loop=true;f.type=type;f.frequency.value=frequency;f.Q.value=q;g.gain.value=0;s.connect(f);f.connect(g);g.connect(this.world);s.start();return {source:s,filter:f,gain:g};};
      this.wind=loop(this.noiseBuffer,'lowpass',450);this.windGain=this.wind.gain;this.filter=this.wind.filter;
      // Sustained Nitro layer: a bright rushing band plus a turbine whine.
      this.nitroLayer=loop(this.whiteBuffer,'bandpass',1600,.9);[this.whine,this.whineGain]=osc('sine',this.world);
      this.ambience=loop(this.noiseBuffer,'lowpass',260,.5);this.ambienceSwell=c.createOscillator();this.ambienceDepth=c.createGain();this.ambienceDepth.gain.value=0;this.ambienceSwell.frequency.value=.12;this.ambienceSwell.connect(this.ambienceDepth);this.ambienceDepth.connect(this.ambience.gain.gain);this.ambienceSwell.start();
      const crowdBuffer=c.createBuffer(1,c.sampleRate*3,c.sampleRate),crowdData=crowdBuffer.getChannelData(0);let murmur=0;for(let i=0;i<crowdData.length;i++){murmur=(murmur+(Math.random()*2-1)*.12)/1.12;crowdData[i]=murmur*(.65+.35*Math.sin(i/c.sampleRate*3.7));}
      this.crowdBuffer=crowdBuffer;this.crowd=loop(crowdBuffer,'bandpass',850,.45);this.crowdGain=this.crowd.gain;
    }catch(error){console.warn('Wordramp audio unavailable',error);}
  }
  // Ambience character per arena: city hum, sea swell, rain on the road.
  setArena(index){
    if(!this.ambience||index===this.arena)return;this.arena=index;const t=this.ctx.currentTime,a=this.ambience;
    const spec=[{type:'lowpass',f:240,q:.5,depth:.004},{type:'bandpass',f:520,q:.6,depth:.018},{type:'highpass',f:2600,q:.4,depth:.003}][index]||{type:'lowpass',f:240,q:.5,depth:0};
    a.filter.type=spec.type;a.filter.frequency.setTargetAtTime(spec.f,t,.3);a.filter.Q.value=spec.q;this.swellDepth=spec.depth;
  }
  voice(type,hz,at,length,peak,target=this.master,glide=null){
    const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(hz,at);if(glide)o.frequency.exponentialRampToValueAtTime(glide,at+length);
    g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(peak,at+.012);g.gain.exponentialRampToValueAtTime(.0001,at+length);o.connect(g);g.connect(target);o.start(at);o.stop(at+length+.02);o.onended=()=>{o.disconnect();g.disconnect();};
  }
  burst(at,length,peak,type,frequency,buffer=this.whiteBuffer){
    const s=this.ctx.createBufferSource(),f=this.ctx.createBiquadFilter(),g=this.ctx.createGain();s.buffer=buffer;f.type=type;f.frequency.value=frequency;g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(peak,at+.006);g.gain.exponentialRampToValueAtTime(.0001,at+length);s.connect(f);f.connect(g);g.connect(this.master);s.start(at,Math.random(),length+.05);s.onended=()=>{s.disconnect();f.disconnect();g.disconnect();};
  }
  tone(type){
    if(!this.enabled()||!this.ctx||!this.master)return;
    if(/^nitro[123]$/.test(type)){this.boost(+type.at(-1));return;}
    const t=this.ctx.currentTime;
    if(type==='correct'){[659,880,1318].forEach((hz,i)=>{this.voice('triangle',hz,t+i*.07,.24,.075);this.voice('sine',hz*2,t+i*.07,.16,.02);});return;}
    if(type==='wrong'){this.voice('triangle',233,t,.22,.07);this.voice('triangle',196,t+.11,.3,.065);return;}
    if(type==='collision'){this.voice('sine',140,t,.32,.22,this.master,42);this.burst(t,.18,.16,'lowpass',1400);this.burst(t+.02,.08,.07,'highpass',3200);return;}
    if(type==='breakdown'){[110,92,74,58].forEach((hz,i)=>this.voice('sawtooth',hz,t+i*.17,.32,.06));this.burst(t,.5,.12,'lowpass',700);return;}
    if(type==='finish'){[523,659,784,1046,1318].forEach((hz,i)=>{this.voice('triangle',hz,t+i*.11,.4,.07);this.voice('sine',hz/2,t+i*.11,.4,.03);});return;}
    if(type==='go'){[392,587,784].forEach((hz,i)=>this.voice('square',hz,t+i*.08,.18,.035));return;}
    if(type==='tick'){this.voice('square',440,t,.12,.03);return;}
    const notes={click:[520],build:[493,740],pause:[330],overtake:[740,988]}[type]||[440];
    notes.forEach((hz,i)=>this.voice('sine',hz,t+i*.065,.2,type==='click'?.035:.08));
  }
  boost(level){
    const c=this.ctx,time=c.currentTime,noise=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();noise.buffer=this.noiseBuffer;filter.type='bandpass';filter.Q.value=.65;filter.frequency.setValueAtTime(1800+level*350,time);filter.frequency.exponentialRampToValueAtTime(250,time+.42);gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(.16+level*.025,time+.025);gain.gain.exponentialRampToValueAtTime(.0001,time+.5);noise.connect(filter);filter.connect(gain);gain.connect(this.master);noise.start(time);noise.stop(time+.52);noise.onended=()=>{noise.disconnect();filter.disconnect();gain.disconnect();};
    this.voice('triangle',150+level*25,time,.34,.085,this.master,52);
  }
  applause(){
    if(!this.enabled()||!this.ctx||!this.crowd)return;const c=this.ctx,time=c.currentTime;
    for(let i=0;i<3;i++){const clap=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain(),at=time+i*.14;clap.buffer=this.crowdBuffer;filter.type='highpass';filter.frequency.value=1200;gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.095,at+.006);gain.gain.exponentialRampToValueAtTime(.0001,at+.085);clap.connect(filter);filter.connect(gain);gain.connect(this.master);clap.start(at,i*.31,.1);clap.onended=()=>{clap.disconnect();filter.disconnect();gain.disconnect();};}
  }
  update(state,crowdProximity=0){
    if(!this.ctx||!this.engine)return;
    if(state)this.setArena(state.arenaIndex??0);
    const on=this.enabled(),moving=on&&state&&['driving','task','resolving','breakdown'].includes(state.status),speed=moving?Math.max(0,state.speedFactor):0,time=this.ctx.currentTime,gear=Math.floor(speed*2.2);
    const rpm=(52+speed*30-gear*8)*(state?.status==='breakdown'?.65+Math.abs(Math.sin(state.elapsed*24))*.25:1),load=state?.accelerating||state?.nitroActive?1:.55;
    this.engine.frequency.setTargetAtTime(rpm,time,.1);this.sub.frequency.setTargetAtTime(rpm*.5,time,.1);this.harmonic.frequency.setTargetAtTime(rpm*2.01,time,.12);
    this.engineFilter.frequency.setTargetAtTime(260+speed*520*load,time,.15);
    this.engineGain.gain.setTargetAtTime(moving?(.016+speed*.006)*load:0,time,.1);this.subGain.gain.setTargetAtTime(moving?.02+speed*.004:0,time,.1);this.harmonicGain.gain.setTargetAtTime(moving?.004+speed*.002:0,time,.12);
    // Sky Coaster: a launch whoosh the moment the ride starts, rushing air at speed
    // and a soft thud as the car touches down on the road again.
    const C=globalThis.RallyCore,ride=moving&&C&&state.route?.coaster?state.route:null;let rush=0;
    if(ride&&this.rideId!==ride.id){this.rideId=ride.id;this.boost(3);this.voice('sawtooth',180,time,.7,.045,this.master,720);}
    if(!ride)this.rideId=null;
    if(ride){const h=C.coasterHeight(ride,state.distance),climb=C.coasterHeight(ride,state.distance+2)-h;
      rush=Math.min(.06,Math.max(0,C.coasterPace(ride,state.distance)-1)*.04+Math.max(0,-climb)*.02);
      if(this.rideHeight>.4&&h<.05){this.voice('sine',92,time,.3,.11,this.master,46);this.burst(time,.14,.07,'lowpass',850);}
      this.rideHeight=h;
    }else this.rideHeight=0;
    this.windGain.gain.setTargetAtTime(moving?.008*speed*speed+rush:0,time,.16);this.filter.frequency.setTargetAtTime(300+speed*650,time,.2);
    const nitro=moving&&state.nitroActive?Math.max(1,state.nitroLevel||1):0;
    this.nitroLayer.gain.gain.setTargetAtTime(nitro?.018+nitro*.008:0,time,nitro?.05:.2);this.nitroLayer.filter.frequency.setTargetAtTime(1300+nitro*450,time,.1);
    this.whine.frequency.setTargetAtTime(900+speed*260,time,.1);this.whineGain.gain.setTargetAtTime(nitro?.006+nitro*.003:0,time,nitro?.05:.2);
    const ambient=on&&state&&!['paused','finished','failed'].includes(state.status);
    this.ambience.gain.gain.setTargetAtTime(ambient?[.02,.03,.026][state.arenaIndex??0]??.02:0,time,.5);this.ambienceDepth.gain.setTargetAtTime(ambient?this.swellDepth||0:0,time,.5);
    // Reading focus ducks the world behind a low-pass; correctness cues stay clear.
    const focus=on&&state?Math.max(0,Math.min(1,state.focusAmount||0)):0;
    this.focusFilter.frequency.setTargetAtTime(16000-focus*14800,time,.15);this.world.gain.setTargetAtTime(1-focus*.35,time,.15);
    const crowdLevel=moving&&state.status==='driving'&&!state.yielding?Math.max(0,Math.min(1,crowdProximity)):0;this.crowdGain.gain.setTargetAtTime(crowdLevel*.14,time,.3);if(crowdLevel>.75&&!this.cheerNear){this.cheerNear=true;this.applause();}if(crowdLevel<.25)this.cheerNear=false;
  }
}
