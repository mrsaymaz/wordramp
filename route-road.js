// A fork is one asphalt surface. Union the branch cross sections before
// triangulating so merging routes never draw coplanar, overlapping triangles.
export function forkBounds(route){return {start:route.start-30,end:route.end+40};}
export function surfaceUnion(rows){
  const positions=[],uvs=[],indices=[],edges=[];
  const lerp=(a,b,t)=>a+(b-a)*t;
  for(let row=0;row<rows.length-1;row++){
    const a=rows[row],b=rows[row+1],lines=[];
    for(let i=0;i<a.intervals.length;i++)for(let side=0;side<2;side++)lines.push({a:a.intervals[i][side],b:b.intervals[i][side],id:i,side});
    const cuts=[0,1];
    for(let i=0;i<lines.length;i++)for(let j=i+1;j<lines.length;j++){
      const p=lines[i],q=lines[j],den=(p.b-p.a)-(q.b-q.a);
      if(Math.abs(den)>1e-9){const t=(q.a-p.a)/den;if(t>1e-7&&t<1-1e-7)cuts.push(t);}
    }
    cuts.sort((a,b)=>a-b);
    for(let j=0;j<cuts.length-1;j++){
      const lo=cuts[j],hi=cuts[j+1];if(hi-lo<1e-7)continue;
      const mid=(lo+hi)/2,at=t=>lerp(a.at,b.at,t),x=(l,t)=>lerp(l.a,l.b,t);
      const spans=a.intervals.map((_,i)=>({left:lines[i*2],right:lines[i*2+1]})).sort((p,q)=>x(p.left,mid)-x(q.left,mid));
      const union=[];
      for(const s of spans){const last=union.at(-1);if(last&&x(s.left,mid)<=x(last.right,mid)+1e-8){if(x(s.right,mid)>x(last.right,mid))last.right=s.right;}else union.push({...s});}
      for(const s of union){
        const points=[[x(s.left,lo),at(lo)],[x(s.right,lo),at(lo)],[x(s.left,hi),at(hi)],[x(s.right,hi),at(hi)]],n=positions.length/3;
        for(const [xx,zz]of points){positions.push(xx,0,-zz);uvs.push(xx/10.8,zz/20);}
        indices.push(n,n+1,n+2,n+2,n+1,n+3);
        edges.push([points[0],points[2]],[points[1],points[3]]);
      }
    }
  }
  return {positions,uvs,indices,edges};
}
export function forkSurface(routes,curve,offset,origin){
  const route=routes[0],bounds=forkBounds(route),ats=new Set([bounds.start,route.start,route.end,bounds.end]);
  for(let at=bounds.start;at<bounds.end;at+=2)ats.add(at);
  const smooth=t=>t*t*t*(10+t*(-15+6*t));
  const rows=[...ats].sort((a,b)=>a-b).map(at=>{
    let centers,half;
    if(at<route.start){const p=smooth((at-bounds.start)/30);centers=[-3.35,0,3.35];half=8.2-2.8*p;}
    else if(at>route.end){const p=smooth((at-route.end)/40);centers=[-3.35,0,3.35];half=5.4+2.8*p;}
    else{centers=routes.map(r=>r.lane*3.35+offset(r,at));half=5.4;}
    const bend=curve(at)-curve(origin);
    return {at:at-origin,intervals:centers.map(x=>[bend+x-half,bend+x+half])};
  });
  return {...surfaceUnion(rows),rows,bounds};
}
