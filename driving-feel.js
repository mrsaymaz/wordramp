const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function createDrivingFeel(lane=0,distance=0){return {lane,velocity:0,distance,wheelAngle:0,lastSpeed:0,roll:0,pitch:0,steer:0,phase:0,bob:0,braking:false};}
// Exact critically damped spring: stable across phone/desktop frame rates and
// quick enough to settle into a new lane before its answer line.
export function updateDrivingFeel(m,target,distance,speed,dt,frozen=false){
  if(frozen||dt<=0)return m;
  dt=Math.min(dt,.1);const omega=24,offset=m.lane-target,c=m.velocity+omega*offset,e=Math.exp(-omega*dt);
  m.lane=target+(offset+c*dt)*e;m.velocity=(m.velocity-omega*c*dt)*e;
  if(Math.abs(m.lane)>1){m.lane=clamp(m.lane,-1,1);m.velocity=0;}
  const travel=Math.max(0,distance-m.distance);m.distance=distance;m.wheelAngle=(m.wheelAngle+travel/.43)%(Math.PI*2);
  const acceleration=clamp((speed-m.lastSpeed)/dt,-24,16);m.lastSpeed=speed;
  m.braking=acceleration<-2||speed<.4;
  const blend=1-Math.exp(-12*dt),motion=clamp(speed/20,0,1);
  m.steer+=(clamp(-m.velocity*3.35/Math.max(8,speed),-.38,.38)-m.steer)*blend;
  m.roll+=(clamp(m.velocity*.023,-.105,.105)*motion-m.roll)*blend;
  m.pitch+=(clamp(-acceleration*.0025,-.04,.06)-m.pitch)*blend;
  m.phase+=travel*1.05;m.bob=Math.sin(m.phase)*.018*motion;
  return m;
}
