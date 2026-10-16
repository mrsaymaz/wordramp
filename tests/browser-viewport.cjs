// Exercise the real preview controller without browser rendering.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'../dist/phone-preview.html'),'utf8');
const nodes={};
for(const id of ['device-size','browser-bars','fit','preview-area','device-stage','device','game-preview','viewport-size','rotate','screen','browser-top','browser-bottom'])nodes[id]={style:{setProperty(k,v){this[k]=v;}},dataset:{},classList:{toggle(){}},listeners:{},addEventListener(k,f){this.listeners[k]=f;}};
nodes['device-size'].value='390x844';nodes['browser-bars'].value='bottom';nodes.fit.checked=true;nodes['preview-area'].clientWidth=1000;nodes['preview-area'].clientHeight=1000;
vm.runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],{document:{getElementById:id=>nodes[id]},ResizeObserver:class{constructor(f){this.f=f;}observe(){this.f();}}});
const frame=nodes['game-preview'],device=nodes.device;
assert.equal(frame.width,390);assert.equal(frame.height,672,'Expanded bottom controls reserve 172px from the screen');
let scenarios=0;
for(const preset of ['320x568','390x844','430x932','768x1024'])for(const mode of ['bottom','top','collapsed','none']){
 nodes['device-size'].value=preset;nodes['device-size'].listeners.change();nodes['browser-bars'].value=mode;nodes['browser-bars'].listeners.change();
 const [w,h]=preset.split('x').map(Number);
 for(let rotation=0;rotation<2;rotation++){
  if(rotation)nodes.rotate.listeners.click();const width=rotation?h:w,height=rotation?w:h;
  assert.equal(frame.width,width);assert(frame.height>150&&frame.height<=height);
  assert.equal(frame.height+parseInt(nodes['browser-top'].style.height)+parseInt(nodes['browser-bottom'].style.height),height,'Chrome plus game exactly fills the physical preview screen');
  if(mode==='none')assert.equal(frame.height,height);
  assert.equal(device.style['--game-h'],frame.height+'px');assert.equal(device.style['--screen-h'],height+'px');
  const viewport=[frame.width,frame.height];nodes.fit.checked=false;nodes.fit.listeners.change();assert.equal(device.style.transform,'scale(1)');assert.deepEqual([frame.width,frame.height],viewport,'Display scaling must not change the game viewport');nodes.fit.checked=true;nodes.fit.listeners.change();
  scenarios++;
 }
}
const original=html.match(/<iframe[^>]+src="([^"]+)"/)[1];assert.equal(original,'index.html?touch=1','The phone preview uses the touch layout even with a desktop mouse');assert(!/frame\.(src|innerHTML)\s*=/.test(html),'Changing bars must preserve the active race inside the iframe');
nodes['device-size'].value='390x844';nodes['device-size'].listeners.change();nodes['browser-bars'].value='top';nodes['browser-bars'].listeners.change();const expanded=frame.height;nodes['browser-bars'].value='collapsed';nodes['browser-bars'].listeners.change();assert(frame.height>expanded,'Collapsing browser controls returns space to the same game');
console.log(`PASS: ${scenarios} browser-bar / screen / orientation scenarios; exact game/chrome sizing, fixed viewport under scaling and race-preserving bar changes. No browser rendering.`);
