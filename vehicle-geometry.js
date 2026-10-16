import * as THREE from 'three';

// Beveled cross sections form a sculpted body rather than stacked boxes.
function loft(sections){
  const profile=[[-1,.22],[-.96,.78],[-.72,1],[.72,1],[.96,.78],[1,.22],[.82,0],[-.82,0]];
  const positions=[],uv=[],indices=[];
  sections.forEach((s,i)=>profile.forEach(([x,y],j)=>{positions.push(x*s.w,s.low+y*(s.high-s.low),s.z);uv.push(j/8,i/(sections.length-1));}));
  for(let i=0;i<sections.length-1;i++)for(let j=0;j<8;j++){const a=i*8+j,b=i*8+(j+1)%8,c=a+8,d=b+8;indices.push(a,c,b,b,c,d);}
  for(let j=1;j<7;j++){indices.push(0,j,j+1);const end=(sections.length-1)*8;indices.push(end,end+j+1,end+j);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
export function createBodyGeometry(){return loft([
  {z:-2.16,w:.91,low:.38,high:.65},{z:-1.65,w:1.07,low:.36,high:.90},
  {z:-.55,w:1.08,low:.36,high:.97},{z:.85,w:1.08,low:.36,high:.96},
  {z:1.75,w:1.05,low:.38,high:.90},{z:2.12,w:.94,low:.40,high:.70}
]);}
export function createCanopyGeometry(){return loft([
  {z:-.94,w:.78,low:.92,high:1.01},{z:-.36,w:.77,low:1.01,high:1.46},
  {z:.62,w:.74,low:1.01,high:1.48},{z:1.17,w:.80,low:.92,high:1.02}
]);}
