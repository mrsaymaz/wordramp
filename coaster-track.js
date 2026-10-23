// Ride track geometry (pure math, shared with the regression checks). The
// core decides where a ride goes and how fast it progresses
// (window.RallyCore.coasterHeight, routeOffset, coasterPace) and lists each
// layout's visual elements (RIDE_LAYOUTS). This module draws those elements on
// top of the path (loops, corkscrews, helix, flight, tunnel, half-pipe), then
// turns it into banked frames, swept track sections, support positions and
// car poses in a fork gate's local coordinates.
export const TRACK_PASS=3.2,TRACK_HALF=1.2,DECK_DEPTH=.55,BANK_LIMIT=.34,HEARTLINE=.9;
const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*t*(10+t*(-15+6*t));};
const window01=(u,d)=>(u-d.start)/(d.end-d.start);
// Reduced motion keeps the layout but flattens the drops: heights above 4 m
// are compressed, so the ride still clears the road it crosses.
export function visualHeight(h,reduced=false){return reduced&&h>4?4+(h-4)*.4:h;}
// Offsets of the visual path from the core path, in the base path's frame:
// forward (horizontal), lateral (towards `side` is positive) and up, plus an
// extra roll. Reduced motion keeps the path (flights and tunnels included)
// but has no loop, corkscrew, roll, helix or half-pipe swing.
export function detour(u,side,reduced=false,elements=[]){
  const out={forward:0,lateral:0,up:0,roll:0};if(reduced)return out;
  for(const d of elements){
    const p=window01(u,d);
    if(d.kind==='loop'){
      // Vertical loops (count of them); each turn is shifted sideways so the
      // arms never meet, and the shift eases back out over the next stretch.
      const count=d.count||1;
      if(p>0&&p<1){const a=2*Math.PI*count*ease(p);out.forward+=d.radius*Math.sin(a);out.up+=d.radius*(1-Math.cos(a));}
      const settle=(d.end+d.settle-u)/d.settle;if(p>0)out.lateral+=side*d.shift*count*Math.min(ease(p),ease(settle));
    }else if(d.kind==='corkscrew'||d.kind==='roll'){if(p>0&&p<1)out.roll+=-side*2*Math.PI*(d.turns||1)*ease(p);}
    else if(d.kind==='helix'&&p>0&&p<1){
      // One outward horizontal turn, banked towards its centre.
      const a=2*Math.PI*ease(p);out.forward+=d.radius*Math.sin(a);out.lateral+=side*d.radius*(1-Math.cos(a));out.roll+=-side*d.bank*Math.sin(Math.PI*p)**2;
    }else if(d.kind==='halfpipe'&&p>0&&p<1){
      // Bobsled swings: two side-to-side swerves, banked up the wall.
      const env=Math.sin(Math.PI*p)**2,w=Math.sin(4*Math.PI*p);out.lateral+=side*d.swing*w*env;out.roll+=side*d.bank*w*env;
    }
  }
  return out;
}
// The element a ride position is in (or near), for styling and the camera.
export const elementAt=(u,elements=[],margin=6)=>elements.find(d=>u>d.start-margin&&u<d.end+(d.settle||margin))||null;
// How far the chase camera should pull out to frame an element (0..1).
export function cameraWide(u,elements=[],detourSize=0,reduced=false){
  if(reduced)return 0;const d=elementAt(u,elements,0);
  if(d?.kind==='air')return Math.sin(Math.PI*Math.max(0,Math.min(1,window01(u,d))))**.6;
  return Math.max(0,Math.min(1,detourSize/5));
}
// Bank into ordinary turns: lateral curvature (per metre) to a roll angle.
// Positive roll lifts the right-hand side, so a right turn banks negative.
export function bankAt(lateral,at,reduced=false){
  if(reduced)return 0;const h=3,curvature=(lateral(at+h)-2*lateral(at)+lateral(at-h))/(h*h);
  return Math.max(-BANK_LIMIT,Math.min(BANK_LIMIT,-curvature*55));
}
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],add=(a,b,k=1)=>[a[0]+b[0]*k,a[1]+b[1]*k,a[2]+b[2]*k],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],unit=a=>{const l=Math.hypot(...a)||1;return [a[0]/l,a[1]/l,a[2]/l];};
// Frames along a ride in gate-local coordinates (z = -(at - origin)). Roll
// turns the twin tracks around a heartline between them. `span` is the
// core's reference ride length.
export function rideFrames({route,curve,offset,height,origin,span,elements=[],reduced=false,step=.5}){
  const lateral=at=>curve(at)-curve(origin)+route.lane*3.35+offset(route,at),base=at=>[lateral(at),visualHeight(height(route,at),reduced),-(at-origin)];
  const rideU=at=>(at-route.start)*span/(route.end-route.start),frames=[];
  for(let at=route.start;at<=route.end+1e-6;at+=step){
    const b=base(at),ahead=base(at+.25),behind=base(at-.25),flat=unit([ahead[0]-behind[0],0,ahead[2]-behind[2]]),side=[-flat[2],0,flat[0]];
    const u=rideU(at),d=detour(u,route.side,reduced,elements),kind=elementAt(u,elements)?.kind||null,inside=elementAt(u,elements,0),p=add(add(add(b,flat,d.forward),side,d.lateral),[0,1,0],d.up),size=Math.hypot(d.forward,d.lateral,d.up);
    frames.push({at,u,kind,p,baseSide:side,detour:size,wide:cameraWide(u,elements,size,reduced),air:inside?.kind==='air',tunnel:inside?.kind==='tunnel',halfpipe:inside?.kind==='halfpipe',roll:bankAt(lateral,at,reduced)+d.roll,inDetour:size+Math.abs(d.roll)>.01||inside?.kind==='air'});
  }
  frames.forEach((f,i)=>{
    const next=frames[Math.min(frames.length-1,i+1)].p,prev=frames[Math.max(0,i-1)].p;f.t=unit(sub(next,prev));
    // Lateral axis without drift: in a loop it stays the road's sideways
    // direction (so the track turns cleanly upside down and back); elsewhere,
    // including the helix, it is horizontal and square to the travel.
    const seed=f.kind==='loop'?f.baseSide:[-f.t[2],0,f.t[0]];f.l=unit(sub(seed,[f.t[0]*dot(seed,f.t),f.t[1]*dot(seed,f.t),f.t[2]*dot(seed,f.t)]));
    f.n=cross(f.l,f.t);const c=Math.cos(f.roll),s=Math.sin(f.roll);
    f.right=[f.l[0]*c+f.n[0]*s,f.l[1]*c+f.n[1]*s,f.l[2]*c+f.n[2]*s];f.up=[-f.l[0]*s+f.n[0]*c,-f.l[1]*s+f.n[1]*c,-f.l[2]*s+f.n[2]*c];
    f.pivot=route.side*TRACK_PASS/2;f.axis=add(add(f.p,f.l,f.pivot),f.n,HEARTLINE);
    f.speed=i<frames.length-1?Math.hypot(...sub(frames[i+1].p,f.p))/step:1;
  });
  return frames;
}
// A point on a track (offset from the main track) at section coordinates.
export function trackPoint(f,offset,dx=0,dy=0){return add(add(f.axis,f.right,offset+dx-f.pivot),f.up,dy-HEARTLINE);}
// Sweep a closed cross section [[lateral, up], ...] along the frames.
export function sweep(frames,section,trackOffset){
  const positions=[],indices=[],n=section.length;
  for(const f of frames)for(const [dx,dy]of section)positions.push(...trackPoint(f,trackOffset,dx,dy));
  for(let i=0;i<frames.length-1;i++)for(let k=0;k<n;k++){const a=i*n+k,b=i*n+(k+1)%n,c=a+n,d=b+n;indices.push(a,c,b,b,c,d);}
  return {positions,indices};
}
// Deck box and two raised rails per track, as cross sections; a half-pipe
// raises tall walls instead of rails; a tunnel rib arches over both tracks.
export const DECK_SECTION=[[-TRACK_HALF,0],[TRACK_HALF,0],[TRACK_HALF,-DECK_DEPTH],[-TRACK_HALF,-DECK_DEPTH]];
export const railSection=x=>[[x-.09,.2],[x+.09,.2],[x+.09,0],[x-.09,0]];
export const wallSection=x=>[[x-.14,1.15],[x+.14,1.15],[x+.14,0],[x-.14,0]];
export function ribSection(centre,radius=5.4,thickness=.9){
  const outer=[],inner=[];for(let i=0;i<=12;i++){const a=Math.PI*(-.08+1.16*i/12);outer.push([centre+Math.cos(a)*(radius+thickness),Math.sin(a)*(radius+thickness)-.6]);inner.push([centre+Math.cos(a)*radius,Math.sin(a)*radius-.6]);}
  return [...outer,...inner.reverse()];
}
// Contiguous runs of frames, so a flight leaves a real gap in the track.
export function frameRuns(frames,keep){const runs=[];let run=[];for(const f of frames){if(keep(f))run.push(f);else{if(run.length>1)runs.push(run);run=[];}}if(run.length>1)runs.push(run);return runs;}
// A car on a track: position, its right/up/forward axes and the speed of the
// visual path relative to course progress (loops and helices are longer).
export function framePose(frames,at,offset=0){
  if(!frames.length)return null;const step=frames.length>1?frames[1].at-frames[0].at:1,x=Math.max(0,Math.min(frames.length-1,(at-frames[0].at)/step)),i=Math.min(frames.length-2,Math.floor(x)),k=x-i,a=frames[i],b=frames[Math.min(frames.length-1,i+1)];
  const mix=(p,q)=>[p[0]+(q[0]-p[0])*k,p[1]+(q[1]-p[1])*k,p[2]+(q[2]-p[2])*k];
  const pa=trackPoint(a,offset),pb=trackPoint(b,offset);
  return {position:mix(pa,pb),right:unit(mix(a.right,b.right)),up:unit(mix(a.up,b.up)),forward:unit(mix(a.t,b.t)),speed:a.speed+(b.speed-a.speed)*k,detour:a.detour+(b.detour-a.detour)*k,wide:a.wide+(b.wide-a.wide)*k,kind:k<.5?a.kind:b.kind,air:a.air&&b.air,inverted:a.up[1]<0};
}
// Supports every `spacing` metres where the track is off the ground and
// upright. Over the road a portal straddles it (legs beyond both edges)
// instead of a column standing in a lane; loops and helices float free.
// roadCentre(at) and roadEdge(at, side) use the same local coordinates.
export function supportPlan(frames,roadCentre,roadEdge,spacing=8){
  const plan=[];let last=-Infinity;
  for(const f of frames){
    if(f.p[1]<1.2||f.inDetour||f.air||f.up[1]<.85||f.at-last<spacing)continue;last=f.at;
    const x=f.axis[0],centre=roadCentre(f.at),top=f.p[1]-DECK_DEPTH,left=centre-roadEdge(f.at,-1)-1.6,right=centre+roadEdge(f.at,1)+1.6;
    // A portal beam must clear the traffic below; lower over-road track is
    // carried by its own stiffness between supports.
    if(x>left-1.2&&x<right+1.2){if(top>=4.6)plan.push({kind:'portal',at:f.at,z:f.p[2],top,left,right,x});}
    else plan.push({kind:'column',at:f.at,z:f.p[2],top,x});
  }
  return plan;
}
