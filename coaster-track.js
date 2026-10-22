// Sky Coaster track geometry (pure math, shared with the regression checks).
// The core decides where a ride goes (window.RallyCore.coasterHeight and
// routeOffset); this module turns that path into banked frames, swept track
// sections and support positions in a fork gate's local coordinates.
export const TRACK_PASS=3.2,TRACK_HALF=1.2,DECK_DEPTH=.55,BANK_LIMIT=.34;
// Reduced motion keeps the layout but flattens the drops: heights above 4 m
// are compressed, so the ride still clears the road it crosses.
export function visualHeight(h,reduced=false){return reduced&&h>4?4+(h-4)*.4:h;}
// Bank into the swerve: lateral curvature (per metre) to a roll angle.
// Positive roll lifts the right-hand side, so a right turn banks negative.
export function bankAt(lateral,at,reduced=false){
  if(reduced)return 0;const h=3,curvature=(lateral(at+h)-2*lateral(at)+lateral(at-h))/(h*h);
  return Math.max(-BANK_LIMIT,Math.min(BANK_LIMIT,-curvature*55));
}
// Height of a point on the deck at a lateral offset from the twin-track pivot.
export const bankLift=(bank,offset)=>Math.sin(bank)*offset;
// Frames along a ride: x lateral, y height, z = -(at - origin), with the
// track pivot halfway between the player's track and the passing track.
export function rideFrames({route,curve,offset,height,origin,step=2,reduced=false}){
  const lateral=at=>curve(at)-curve(origin)+route.lane*3.35+offset(route,at),frames=[];
  for(let at=route.start;at<=route.end+1e-6;at+=step){
    const y=visualHeight(height(route,at),reduced),bank=bankAt(lateral,at,reduced);
    frames.push({at,x:lateral(at),y,z:-(at-origin),bank,pivot:route.side*TRACK_PASS/2});
  }
  return frames;
}
// Sweep a closed cross section [[lateral, up], ...] along the frames. Each
// track is offset from the pivot; banking rotates the section around it.
export function sweep(frames,section,trackOffset){
  const positions=[],indices=[],n=section.length;
  frames.forEach((f,i)=>{
    const next=frames[Math.min(frames.length-1,i+1)],prev=frames[Math.max(0,i-1)];
    let tx=next.x-prev.x,ty=next.y-prev.y,tz=next.z-prev.z;const tl=Math.hypot(tx,ty,tz)||1;tx/=tl;ty/=tl;tz/=tl;
    // Horizontal lateral (tangent x up), then the section's own up vector.
    let lx=-tz,lz=tx;const ll=Math.hypot(lx,lz)||1;lx/=ll;lz/=ll;
    const ux=-ty*lz,uy=lz*tx-lx*tz,uz=ty*lx,c=Math.cos(f.bank),s=Math.sin(f.bank);
    const ax=lx*c+ux*s,ay=uy*s,az=lz*c+uz*s,bx=-lx*s+ux*c,by=uy*c,bz=-lz*s+uz*c;
    const base=trackOffset-f.pivot;
    for(const [dx,dy]of section){const l=base+dx;positions.push(f.x+lx*f.pivot+ax*l+bx*dy,f.y+ay*l+by*dy,f.z+lz*f.pivot+az*l+bz*dy);}
  });
  for(let i=0;i<frames.length-1;i++)for(let k=0;k<n;k++){const a=i*n+k,b=i*n+(k+1)%n,c=a+n,d=b+n;indices.push(a,c,b,b,c,d);}
  return {positions,indices};
}
// Deck box and two raised rails per track, as cross sections.
export const DECK_SECTION=[[-TRACK_HALF,0],[TRACK_HALF,0],[TRACK_HALF,-DECK_DEPTH],[-TRACK_HALF,-DECK_DEPTH]];
export const railSection=x=>[[x-.09,.2],[x+.09,.2],[x+.09,0],[x-.09,0]];
// Supports every `spacing` metres where the track is off the ground. Over the
// road a portal straddles it (legs beyond both edges) instead of a column
// standing in a lane. roadCentre(at) and roadEdge(at, side) use the same
// local coordinates as the frames.
export function supportPlan(frames,roadCentre,roadEdge,spacing=8){
  const plan=[];let last=-Infinity;
  for(const f of frames){
    if(f.y<1.2||f.at-last<spacing)continue;last=f.at;
    const x=f.x+f.pivot,centre=roadCentre(f.at),top=f.y-DECK_DEPTH,left=centre-roadEdge(f.at,-1)-1.6,right=centre+roadEdge(f.at,1)+1.6;
    // A portal beam must clear the traffic below; lower over-road track is
    // carried by its own stiffness between supports.
    if(x>left-1.2&&x<right+1.2){if(top>=4.6)plan.push({kind:'portal',at:f.at,z:f.z,top,left,right,x});}
    else plan.push({kind:'column',at:f.at,z:f.z,top,x});
  }
  return plan;
}
