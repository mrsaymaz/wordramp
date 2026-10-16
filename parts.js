import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

// Batch many small coloured primitives into one geometry per material class.
// Colour lives in a vertex attribute, so a whole building, car trim set or
// roadside chunk costs one draw call instead of one per box.
const transform=new THREE.Object3D(),colour=new THREE.Color();
export class PartSet{
  constructor(){this.parts=new Map();}
  add(key,geometry,color,x=0,y=0,z=0,sx=1,sy=1,sz=1,rx=0,ry=0,rz=0){
    const g=geometry.index?geometry.toNonIndexed():geometry.clone();
    for(const name of Object.keys(g.attributes))if(name!=='position'&&name!=='normal')g.deleteAttribute(name);
    transform.position.set(x,y,z);transform.rotation.set(rx,ry,rz);transform.scale.set(sx,sy,sz);transform.updateMatrix();g.applyMatrix4(transform.matrix);
    colour.set(color);const n=g.attributes.position.count,c=new Float32Array(n*3);
    for(let i=0;i<n;i++){c[i*3]=colour.r;c[i*3+1]=colour.g;c[i*3+2]=colour.b;}
    g.setAttribute('color',new THREE.BufferAttribute(c,3));
    if(!this.parts.has(key))this.parts.set(key,[]);this.parts.get(key).push(g);return g;
  }
  // Add an already transformed geometry (for example a lofted panel).
  addGeometry(key,geometry,color){return this.add(key,geometry,color);}
  has(key){return !!this.parts.get(key)?.length;}
  merge(key){
    const list=this.parts.get(key);if(!list?.length)return null;
    const g=list.length===1?list[0]:mergeGeometries(list);if(list.length>1)list.forEach(x=>x.dispose());
    this.parts.delete(key);g.computeBoundingSphere();return g;
  }
  keys(){return [...this.parts.keys()];}
}
// Deterministic hash for course-seeded variation. The same road segment
// always receives the same building, tree and prop choices.
export function hash(...values){let h=2166136261;for(const v of values){h^=Math.floor(v*1000)|0;h=Math.imul(h,16777619);h^=h>>>13;}return ((h>>>0)%100000)/100000;}
export function seeded(seed){let s=seed>>>0||1;return ()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
