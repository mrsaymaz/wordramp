// Pure layout and stroke geometry, shared with the regression checks.
export function categoryTitle(text){return String(text).toLowerCase().replace(/\b[a-z]/g,c=>c.toUpperCase()).replace(/\bTv\b/g,'TV');}
// Measure complete words at the preferred size. Spaces can wrap; a word,
// including its hyphen or apostrophe, always fits inside its own sign.
export function wordFontSize(text,width,fontSize,measure){
  const widest=Math.max(1,...String(text).trim().split(/\s+/u).map(measure));
  return Math.max(.1,Math.floor(Math.min(fontSize,fontSize*Math.max(1,width-2)/widest)*10)/10);
}
export function visibleRivalLabels(items,{width,top,bottom}){
  const kept=[];
  for(const item of [...items].sort((a,b)=>Math.abs(a.distance)-Math.abs(b.distance))){
    if(!item.visible||Math.abs(item.distance)>150||item.x<42||item.x>width-42||item.y<top+30||item.y>bottom-16)continue;
    if(kept.some(p=>Math.abs(p.x-item.x)<82&&Math.abs(p.y-item.y)<32))continue;
    kept.push(item);
  }
  return kept.map(p=>p.id);
}
export function laneLayout(viewportWidth,anchors){
  const edge=12,cell=(viewportWidth-edge*2)/3;
  const projected=anchors.map(a=>a.x),center=projected[1];
  const projectedSpacing=Math.min(Math.abs(projected[1]-projected[0]),Math.abs(projected[2]-projected[1]));
  const spacing=Math.min(cell,Math.max(Math.min(100,cell),projectedSpacing));
  const gap=Math.min(34,Math.max(24,spacing*.28));
  const width=Math.min(168,Math.max(1,spacing-gap));
  // Cap every card at its own cell edges, never at a minimum width that could overlap.
  const mid=Math.max(edge+spacing+width/2,Math.min(viewportWidth-edge-spacing-width/2,center));
  return [0,1,2].map(i=>({x:mid+(i-1)*spacing,width,gap,cellLeft:mid+(i-1.5)*spacing,cellRight:mid+(i-.5)*spacing}));
}
function segmentEntry(a,b,r){
  let lo=0,hi=1;
  for(const [start,delta,min,max]of [[a.x,b.x-a.x,r.left,r.right],[a.y,b.y-a.y,r.top,r.bottom]]){
    if(Math.abs(delta)<1e-8){if(start<min||start>max)return null;}
    else{let t1=(min-start)/delta,t2=(max-start)/delta;if(t1>t2)[t1,t2]=[t2,t1];lo=Math.max(lo,t1);hi=Math.min(hi,t2);if(lo>hi)return null;}
  }
  return lo;
}
export function strokeHits(from,to,rects,visited=[]){
  return rects.map(r=>({id:r.id,t:segmentEntry(from,to,r)})).filter(h=>h.t!==null&&!visited.includes(h.id)).sort((a,b)=>a.t-b.t).map(h=>h.id);
}
// Keep prompts and block connections above the driving controls on short screens.
export function roadVerticalLayout({hudBottom,promptHeight,answerHeight,promptY,answerY,controlsTop,repair=false,landscape=false,viewportHeight=Infinity}){
  const gap=landscape?8:12,top=hudBottom+gap,bottom=controlsTop-12;
  // Landscape controls sit at the edges, leaving the center clear for a lower block.
  const centerBottom=Math.min(bottom+(landscape?56:0),viewportHeight-12);
  const spare=Math.max(0,bottom-top-promptHeight-gap-answerHeight);
  let stagger=repair?Math.min(80,spare):0;
  const reserve=landscape?0:stagger;
  const minPrompt=top+promptHeight/2;
  // The prompt is an overhead strip immediately below the HUD, never a panel
  // floating in the road's center. Lane signs keep their projected positions.
  const py=minPrompt;
  const minAnswer=py+promptHeight/2+gap+answerHeight/2,maxAnswer=bottom-reserve-answerHeight/2;
  const ay=Math.max(minAnswer,Math.min(answerY,Math.max(minAnswer,maxAnswer)));
  if(repair&&landscape)stagger=Math.min(80,Math.max(0,centerBottom-ay-answerHeight/2));
  return {py,ay,stagger,bottom,centerBottom};
}
