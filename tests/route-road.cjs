const assert=require('node:assert/strict');
global.window={};for(const name of ['language-bank','repair-bank','match-bank','emoji-bank','game-core'])require('../dist/'+name+'.js');
const C=window.RallyCore,{forkSurface,surfaceUnion}=require('./route-road-compiled.cjs');
let sections=0,coverage=0;
function crossSections(surface,at){
 const spans=[],v=surface.positions;
 for(let i=0;i<surface.indices.length;i+=3){
  const points=surface.indices.slice(i,i+3).map(n=>[v[n*3],-v[n*3+2]]),xs=[];
  for(let j=0;j<3;j++){const a=points[j],b=points[(j+1)%3];if((a[1]<=at&&at<b[1])||(b[1]<=at&&at<a[1]))xs.push(a[0]+(b[0]-a[0])*(at-a[1])/(b[1]-a[1]));}
  if(xs.length===2&&Math.abs(xs[0]-xs[1])>1e-7)spans.push(xs.sort((a,b)=>a-b));
 }
 spans.sort((a,b)=>a[0]-b[0]);
 for(let i=1;i<spans.length;i++)assert(spans[i][0]>=spans[i-1][1]-1e-6,'Fork asphalt triangles must never overlap');
 return spans;
}
// Includes simultaneous merge/split topology, nested spans and crossing boundaries.
for(const intervals of [
 [[[0,4],[2,6],[3,7]],[[0,3],[4,6],[7,9]]],
 [[[0,1],[2,3],[4,5]],[[0,5],[1,2],[3,4]]],
 [[[0,5],[2,3]],[[3,4],[0,5]]]
]){const s=surfaceUnion([{at:0,intervals:intervals[0]},{at:10,intervals:intervals[1]}]);for(let i=0;i<100;i++)crossSections(s,i*.1+.031);}
for(let arena=0;arena<3;arena++)for(let correct=0;correct<3;correct++){
 const s=C.createRace(window.LANGUAGE_BANK[0].units[0],'challenge',arena,31),task=s.tasks.find(t=>t.kind==='junction');task.correctIndex=correct;
 const routes=[0,1,2].map(i=>C.makeRoute(s,task,i,i===correct)),curve=at=>C.courseCurve(arena,at),surface=forkSurface(routes,curve,C.routeOffset,task.at);
 assert(surface.positions.every(Number.isFinite));assert(surface.uvs.every(Number.isFinite));
 for(const route of routes)for(const edge of [route.start,route.end]){
  const h=.01,f=at=>C.routeOffset(route,at),first=(f(edge+h)-f(edge-h))/(2*h),second=(f(edge+h)-2*f(edge)+f(edge-h))/(h*h);
  assert(Math.abs(f(edge))<1e-10);assert(Math.abs(first)<1e-5,'Route joins have zero lateral velocity');assert(Math.abs(second)<.001,'Route joins have no acceleration step');
 }
 for(let i=0;i<400;i++){
  const at=surface.bounds.start+(surface.bounds.end-surface.bounds.start)*(i+.37)/400,local=at-task.at,spans=crossSections(surface,local);sections++;
  const bend=curve(at)-curve(task.at),physical=C.roadSpans(s,at),drawn=spans.reduce((a,span)=>{const last=a.at(-1);if(last&&span[0]<=last[1]+1e-6)last[1]=Math.max(last[1],span[1]);else a.push([...span]);return a;},[]);
  assert.equal(physical.length,drawn.length);for(let k=0;k<physical.length;k++)for(let side=0;side<2;side++)assert(Math.abs(physical[k][side]+bend-drawn[k][side])<.025,'Road containment matches the rendered asphalt triangles');
  if(at>routes[0].start+1&&at<routes[0].end-1)for(const r of routes){
   const x=curve(at)-curve(task.at)+r.lane*3.35+C.routeOffset(r,at);
   for(const side of [-1.25,0,1.25]){assert(spans.some(([a,b])=>x+side>=a-.02&&x+side<=b+.02),'The entire player footprint stays on the branch');coverage++;}
   if(r.lane!==0){const passing=x+Math.sign(r.lane)*3.2;const heading=Math.atan((curve(at+.1)+C.routeOffset(r,at+.1)-curve(at-.1)-C.routeOffset(r,at-.1))/.2),half=.93*Math.abs(Math.cos(heading))+2.3*Math.abs(Math.sin(heading));for(const side of [-half,half]){assert(spans.some(([a,b])=>passing+side>=a-.02&&passing+side<=b+.02),'A turning rival passing outside a branch stays on asphalt');coverage++;}}
  }
 }
 for(const row of [surface.rows[0],surface.rows.at(-1)]){const min=Math.min(...row.intervals.map(a=>a[0])),max=Math.max(...row.intervals.map(a=>a[1])),bend=curve(task.at+row.at)-curve(task.at);assert(Math.abs(min-(bend-11.55))<1e-8);assert(Math.abs(max-(bend+11.55))<1e-8);}
}
console.log(`PASS: ${sections} fork cross sections without overlapping asphalt; ${coverage} player/rival footprint checks, matching shoulder widths, and smooth position/velocity/acceleration at all route joins.`);
