// Small synthesised soundscape; no downloads and no audio before a user gesture.
export class Sound {
  constructor(enabled){this.enabled=enabled;this.ctx=null;this.engine=null;}
  unlock(){
    if(!this.enabled())return;
    try{
      this.ctx||=new(window.AudioContext||window.webkitAudioContext)();this.ctx.resume().catch(()=>{});
      if(this.engine)return;
      const c=this.ctx;this.master=c.createGain();this.master.gain.value=.65;this.master.connect(c.destination);
      this.engine=c.createOscillator();this.engine.type='triangle';this.engineGain=c.createGain();this.engineGain.gain.value=0;this.engine.connect(this.engineGain);this.engineGain.connect(this.master);this.engine.start();
      this.harmonic=c.createOscillator();this.harmonic.type='sine';this.harmonicGain=c.createGain();this.harmonicGain.gain.value=0;this.harmonic.connect(this.harmonicGain);this.harmonicGain.connect(this.master);this.harmonic.start();
      const buffer=c.createBuffer(1,c.sampleRate*2,c.sampleRate),data=buffer.getChannelData(0);let previous=0;
      for(let i=0;i<data.length;i++){previous=(previous+(Math.random()*2-1)*.02)/1.02;data[i]=previous*3.5;}
      this.wind=c.createBufferSource();this.wind.buffer=buffer;this.wind.loop=true;this.filter=c.createBiquadFilter();this.filter.type='lowpass';this.filter.frequency.value=450;this.windGain=c.createGain();this.windGain.gain.value=0;this.wind.connect(this.filter);this.filter.connect(this.windGain);this.windGain.connect(this.master);this.wind.start();
      const crowdBuffer=c.createBuffer(1,c.sampleRate*3,c.sampleRate),crowdData=crowdBuffer.getChannelData(0);let murmur=0;for(let i=0;i<crowdData.length;i++){murmur=(murmur+(Math.random()*2-1)*.12)/1.12;crowdData[i]=murmur*(.65+.35*Math.sin(i/c.sampleRate*3.7));}
      this.crowd=c.createBufferSource();this.crowd.buffer=crowdBuffer;this.crowd.loop=true;this.crowdFilter=c.createBiquadFilter();this.crowdFilter.type='bandpass';this.crowdFilter.frequency.value=850;this.crowdFilter.Q.value=.45;this.crowdGain=c.createGain();this.crowdGain.gain.value=0;this.crowd.connect(this.crowdFilter);this.crowdFilter.connect(this.crowdGain);this.crowdGain.connect(this.master);this.crowd.start();
    }catch{}
  }
  tone(type){
    if(!this.enabled()||!this.ctx||!this.master)return;
    if(/^nitro[123]$/.test(type)){this.boost(+type.at(-1));return;}
    const notes={correct:[659,880,1318],wrong:[220,185],collision:[85,55],breakdown:[100,78,60,47],go:[392,587,784],tick:[440],click:[520],finish:[523,659,784,1046,1318],build:[493,740],pause:[330],overtake:[740,988]}[type]||[440],start=this.ctx.currentTime;
    notes.forEach((hz,i)=>{const o=this.ctx.createOscillator(),g=this.ctx.createGain(),at=start+i*(type==='finish'?.11:type==='breakdown'?.16:.065);o.type=['collision','breakdown'].includes(type)?'triangle':'sine';o.frequency.setValueAtTime(hz,at);g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(type==='click'?.035:.09,at+.01);g.gain.exponentialRampToValueAtTime(.0001,at+.2);o.connect(g);g.connect(this.master);o.start(at);o.stop(at+.22);o.onended=()=>{o.disconnect();g.disconnect();};});
  }
  boost(level){
    const c=this.ctx,time=c.currentTime,noise=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();noise.buffer=this.wind.buffer;filter.type='bandpass';filter.Q.value=.65;filter.frequency.setValueAtTime(1800+level*350,time);filter.frequency.exponentialRampToValueAtTime(250,time+.42);gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(.15+level*.025,time+.025);gain.gain.exponentialRampToValueAtTime(.0001,time+.48);noise.connect(filter);filter.connect(gain);gain.connect(this.master);noise.start(time);noise.stop(time+.5);noise.onended=()=>{noise.disconnect();filter.disconnect();gain.disconnect();};
    const sub=c.createOscillator(),body=c.createGain();sub.type='triangle';sub.frequency.setValueAtTime(140+level*25,time);sub.frequency.exponentialRampToValueAtTime(52,time+.3);body.gain.setValueAtTime(.08,time);body.gain.exponentialRampToValueAtTime(.0001,time+.34);sub.connect(body);body.connect(this.master);sub.start(time);sub.stop(time+.35);sub.onended=()=>{sub.disconnect();body.disconnect();};
  }
  applause(){
    if(!this.enabled()||!this.ctx||!this.crowd)return;const c=this.ctx,time=c.currentTime;
    for(let i=0;i<3;i++){const clap=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain(),at=time+i*.14;clap.buffer=this.crowd.buffer;filter.type='highpass';filter.frequency.value=1200;gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.095,at+.006);gain.gain.exponentialRampToValueAtTime(.0001,at+.085);clap.connect(filter);filter.connect(gain);gain.connect(this.master);clap.start(at,i*.31,.1);clap.onended=()=>{clap.disconnect();filter.disconnect();gain.disconnect();};}
  }
  update(state,crowdProximity=0){
    if(!this.ctx||!this.engine)return;
    const moving=this.enabled()&&state&&['driving','task','resolving','breakdown'].includes(state.status),speed=moving?Math.max(0,state.speedFactor):0,time=this.ctx.currentTime,gear=Math.floor(speed*2.2),rpm=(58+speed*29-gear*8)*(state?.status==='breakdown'?.65+Math.abs(Math.sin(state.elapsed*24))*.25:1);
    this.engine.frequency.setTargetAtTime(rpm,time,.12);this.harmonic.frequency.setTargetAtTime(rpm*2.01,time,.12);
    this.engineGain.gain.setTargetAtTime(moving?.017+speed*.007:0,time,.1);this.harmonicGain.gain.setTargetAtTime(moving?.006+speed*.003:0,time,.1);this.windGain.gain.setTargetAtTime(moving?.008*speed*speed:0,time,.16);this.filter.frequency.setTargetAtTime(300+speed*650,time,.2);
    const crowdLevel=moving&&state.status==='driving'&&!state.yielding?Math.max(0,Math.min(1,crowdProximity)):0;this.crowdGain?.gain.setTargetAtTime(crowdLevel*.14,time,.3);if(crowdLevel>.75&&!this.cheerNear){this.cheerNear=true;this.applause();}if(crowdLevel<.25)this.cheerNear=false;
  }
}
