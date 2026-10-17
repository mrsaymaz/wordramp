// Shared model of an attentive student. Since v0.23.1, holding acceleration or
// Nitro drives into real contact; releasing both hands braking back to the
// assisted coast. A careful driver therefore lifts off when the occupied lane
// ahead is inside the assisted stopping distance and no lane change is open.
// This mirrors the documented control; it never moves or alters other cars.
function keepHolding(C,s,lane){
  if(!s||s.status!=='driving'||s.route)return true;
  const speed=s.arena.speed*s.speedFactor,body={id:'player',at:s.distance,lanePos:lane,route:s.route,halfWidth:1.25,halfLength:2.3};
  for(const o of [...s.obstacles,...s.rivals]){
    const gap=o.at-s.distance;if(o.dormant||gap<=0||gap>120)continue;
    const across=Math.abs(C.actorX(s,o)-C.actorX(s,body,lane,o.at));if(across>(o.halfWidth??1.25)+1.25+.35)continue;
    const closing=Math.max(0,speed-(o.speed||0)),room=gap-(o.halfLength??2.3)-2.3-1.2;
    // Never creep from a standstill into a parked body just ahead.
    if(room<.6&&(o.speed||0)<speed+3)return false;if(closing<=.5)continue;
    // 16 m/s² leaves margin below the 18 m/s² assisted braking ceiling,
    // plus 0.2 s for a human to lift the finger.
    if(room<closing*closing/32+closing*.2)return false;
  }
  return true;
}
module.exports={keepHolding};
