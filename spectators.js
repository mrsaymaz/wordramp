import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

const TEAM_COLOURS=[0x399c79,0xe1b746,0xbe4e5e,0x4c85c8];
const SKINS=[0xe9b999,0xb97c57,0x80553f,0xd29a74];
const box=new THREE.BoxGeometry(1,1,1),head=new THREE.IcosahedronGeometry(1,1);
const shirt=new THREE.CylinderGeometry(.24,.29,.67,6),limb=new THREE.BoxGeometry(1,1,1);
const transform=new THREE.Object3D(),colour=new THREE.Color();
function instance(geometry,count){const m=new THREE.InstancedMesh(geometry,new THREE.MeshStandardMaterial({roughness:.85}),count);m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);m.frustumCulled=false;return m;}
function pose(mesh,index,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0){transform.position.set(x,y,z);transform.scale.set(sx,sy,sz);transform.rotation.set(rx,ry,rz);transform.updateMatrix();mesh.setMatrixAt(index,transform.matrix);}
function blocks(parent,items,color){const geometries=items.map(([x,y,z,sx,sy,sz])=>{const g=box.clone();transform.position.set(x,y,z);transform.scale.set(sx,sy,sz);transform.rotation.set(0,0,0);transform.updateMatrix();return g.applyMatrix4(transform.matrix);}),geometry=mergeGeometries(geometries);geometries.forEach(g=>g.dispose());const mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color,roughness:.76}));mesh.receiveShadow=true;parent.add(mesh);return mesh;}
// Six persistent stands. Their station assignment changes only after a stand
// has passed behind the camera; later stations enter through the distance fog.
export class RaceSpectators{
  constructor(scene){this.root=new THREE.Group();scene.add(this.root);this.stands=[];this.elapsed=0;this.proximity=0;this.state=undefined;
    for(let slot=0;slot<6;slot++){
      const group=new THREE.Group(),platform=new THREE.Group(),fans=new THREE.Group();group.add(platform,fans);this.root.add(group);
      const base=blocks(platform,[[1.2,-.22,0,6,.4,15.8],[1.7,.05,0,2.5,.5,14.8],[3.4,.38,0,1.4,1.15,14.8]],0xadbebc);
      blocks(platform,[[1.4,-1.5,-5,.45,2.6,.45],[1.4,-1.5,5,.45,2.6,.45]],0x597180);
      const rails=[[-1.8,.78,0,.11,.13,15.6],[-1.8,.3,0,.11,.07,15.6]];for(let z=-7.5;z<=7.5;z+=3)rails.push([-1.8,.36,z,.12,.9,.12]);blocks(platform,rails,0xcdd7d6);
      const seating=[];for(const row of [0,1])seating.push([row*1.85+.7,.35+row*.56,0,.7,.12,13.5]);blocks(platform,seating,0x233e52);
      for(let i=0;i<4;i++)blocks(platform,[[-1.9,.42,(i-1.5)*3.6,.07,.65,3.35]],TEAM_COLOURS[i]);
      // Cantilevered viewing deck is supported above the coast's water.
      const deck=blocks(platform,[[-2.8,-.27,0,2,.3,15.8]],0x91a9ad);deck.userData.bridgeDeck=true;
      const bodies=instance(shirt,8),heads=instance(head,8),hair=instance(head,8),arms=instance(limb,16),hands=instance(head,16),legs=instance(limb,16),eyes=instance(head,16);
      for(const m of [bodies,heads,hair,arms,hands,legs,eyes])fans.add(m);
      for(let i=0;i<8;i++){bodies.setColorAt(i,colour.setHex(TEAM_COLOURS[(i+slot)%4]));heads.setColorAt(i,colour.setHex(SKINS[(i*3+slot)%4]));hair.setColorAt(i,colour.setHex([0x3f302b,0x594039,0x302b32,0xa27a48][i%4]));for(const side of [0,1]){arms.setColorAt(i*2+side,colour.setHex(TEAM_COLOURS[(i+slot)%4]));hands.setColorAt(i*2+side,colour.setHex(SKINS[(i*3+slot)%4]));legs.setColorAt(i*2+side,colour.setHex(0x263647));eyes.setColorAt(i*2+side,colour.setHex(0x24303d));}}
      const flags=[];for(const z of [-7.2,7.2]){blocks(platform,[[4.3,2.5,z,.09,5,.09]],0x92a8b5);const flag=new THREE.Mesh(new THREE.PlaneGeometry(1.6,.8,5,2),new THREE.MeshStandardMaterial({color:TEAM_COLOURS[(slot+(z>0?1:0))%4],side:THREE.DoubleSide,roughness:.85}));flag.position.set(3.55,4.25,z);flag.userData.flat=flag.geometry.attributes.position.array.slice();platform.add(flag);flags.push(flag);}
      this.stands.push({group,platform,base,bodies,heads,hair,arms,hands,legs,eyes,flags,slot,station:-1});
    }
  }
  prepare(state,arena){if(this.state===state&&this.arena===arena)return;this.state=state;this.arena=arena;const C=window.RallyCore,ats=[];
    if(state&&!state.reviewLap){ats.push(25);for(let i=1;i<state.tasks.length;i++){const start=C.taskZone(state.tasks[i-1]).end+100,end=C.taskZone(state.tasks[i]).start-140;if(end-start>25)ats.push((start+end)/2);}ats.push(state.arena.length-15);}
    else if(!state)ats.push(65,230,470,710,950);
    this.stations=ats.flatMap((at,i)=>[-1,1].map(side=>({at,side,id:i*2+(side>0?1:0)})));for(const stand of this.stands){stand.station=-1;stand.lastCheer=0;stand.group.visible=false;stand.base.material.color.setHex(arena===2?0x6d8195:arena===1?0xb1cec9:0xc8b7a3);}
  }
  update(dt,state,arena,distance,base,curve,preferences,frozen){this.prepare(state,arena);if(!frozen)this.elapsed+=dt;const first=this.stations.findIndex(s=>s.at>=distance-100),needed=first<0?[]:this.stations.slice(first,first+6).map(s=>s.id),used=new Set(this.stands.filter(s=>needed.includes(s.station)).map(s=>s.station));this.proximity=0;
    for(const stand of this.stands){if(!needed.includes(stand.station)){const target=needed.find(i=>!used.has(i));stand.station=target??-1;if(target!=null)used.add(target);}const station=this.stations[stand.station];if(!station){stand.group.visible=false;continue;}
      const ahead=station.at-distance;stand.group.visible=ahead>-85&&ahead<300;if(!stand.group.visible)continue;
      const side=station.side;stand.group.position.set(curve(station.at)-base+side*12.4,0,4-ahead);stand.group.rotation.y=-Math.atan((curve(station.at+1)-curve(station.at-1))/2);stand.platform.scale.x=side;
      const nearby=Math.min(Math.abs(ahead),...(state?.rivals||[]).map(r=>Math.abs(r.at-station.at))),cheer=frozen?(stand.lastCheer||0):state&&state.status!=='countdown'?THREE.MathUtils.smoothstep(80-nearby,0,65):0;stand.lastCheer=cheer;
      this.proximity=Math.max(this.proximity,THREE.MathUtils.clamp(1-Math.abs(ahead)/90,0,1));
      const count=preferences.graphics==='battery'?4:8;for(const mesh of [stand.bodies,stand.heads,stand.hair])mesh.count=count;for(const mesh of [stand.arms,stand.hands,stand.legs,stand.eyes])mesh.count=count*2;
      for(let i=0;i<count;i++){
        const row=i>>2,x=side*(row*1.85+.7),z=(i%4-1.5)*3.3,scale=.9+(i%3)*.07,step=.43+row*.56,t=this.elapsed*4.2+i*1.8+stand.slot*.8;
        const bounce=preferences.reduced?0:cheer*Math.max(0,Math.sin(t))*.07,bodyY=step+.87*scale+bounce,headY=step+1.48*scale+bounce;
        pose(stand.bodies,i,x,bodyY,z,scale,scale,scale);pose(stand.heads,i,x,headY,z,.23*scale,.27*scale,.23*scale);pose(stand.hair,i,x+side*.025,headY+.15*scale,z,.235*scale,.17*scale,.24*scale);
        for(let a=0;a<2;a++){
          const direction=a?1:-1,wave=preferences.reduced?0:Math.sin(t+(a?1.1:0))*.24,raise=preferences.reduced?0:cheer*(i%3===0?1.85:1.35)+wave*cheer,angle=direction*(.15+raise),shoulderZ=z+direction*.26*scale,length=.55*scale,armZ=shoulderZ+direction*Math.sin(raise)*length*.5;
          pose(stand.arms,i*2+a,x,bodyY-.04+Math.cos(raise)*(-length*.5),armZ,.15*scale,length,.16*scale,angle,0,0);
          pose(stand.hands,i*2+a,x,bodyY-.04-Math.cos(raise)*length,shoulderZ+direction*Math.sin(raise)*length,.105*scale,.105*scale,.105*scale);
          pose(stand.legs,i*2+a,x,step+.29*scale+bounce,z+direction*.13*scale,.17*scale,.59*scale,.20*scale);
          pose(stand.eyes,i*2+a,x-side*.222*scale,headY+.025*scale,z+direction*.08*scale,.018,.025,.024);
        }
      }
      for(const m of [stand.bodies,stand.heads,stand.hair,stand.arms,stand.hands,stand.legs,stand.eyes])m.instanceMatrix.needsUpdate=true;
      for(const flag of stand.flags){if(!frozen){const attr=flag.geometry.attributes.position,flat=flag.userData.flat;for(let v=0;v<flat.length;v+=3)attr.array[v+2]=preferences.reduced?0:Math.sin(this.elapsed*3+flat[v]*3+stand.slot)*.09*(flat[v]+.8)/1.6;attr.needsUpdate=true;flag.geometry.computeVertexNormals();}}
    }
  }
}
