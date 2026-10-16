import * as THREE from 'three';

export class BoostEffects{
  constructor(scene,car){
    this.scene=scene;this.car=car;this.level=0;this.uses=0;this.intensity=0;this.burstAge=2;this.matrix=new THREE.Object3D();
    const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const c=canvas.getContext('2d'),gradient=c.createRadialGradient(64,64,1,64,64,64);gradient.addColorStop(0,'#ffffff');gradient.addColorStop(.15,'#c8f7ffb0');gradient.addColorStop(.48,'#57bfff35');gradient.addColorStop(1,'#1a6cff00');c.fillStyle=gradient;c.fillRect(0,0,128,128);this.texture=new THREE.CanvasTexture(canvas);this.texture.colorSpace=THREE.SRGBColorSpace;
    this.exhaust=new THREE.Group();car.add(this.exhaust);this.jets=[];this.glows=[];
    for(const side of [-1,1]){
      const outer=new THREE.Mesh(new THREE.ConeGeometry(.22,2.8,10),new THREE.MeshBasicMaterial({color:0x58cbff,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false}));outer.rotation.x=Math.PI/2;outer.position.set(side*.69,.38,3.35);this.exhaust.add(outer);this.jets.push(outer);
      const core=new THREE.Mesh(new THREE.ConeGeometry(.09,1.8,10),new THREE.MeshBasicMaterial({color:0xe5fcff,transparent:true,opacity:.95,blending:THREE.AdditiveBlending,depthWrite:false}));core.rotation.x=Math.PI/2;core.position.set(side*.69,.38,3.0);this.exhaust.add(core);
      const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:this.texture,color:0x72d5ff,transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false}));glow.position.set(side*.69,.42,2.6);glow.scale.set(1.65,1.65,1);this.exhaust.add(glow);this.glows.push(glow);
    }
    this.exhaust.visible=false;
    this.wake=new THREE.InstancedMesh(new THREE.BoxGeometry(.022,.022,1),new THREE.MeshBasicMaterial({color:0x9eeaff,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false}),48);this.wake.frustumCulled=false;this.wake.visible=false;this.wake.instanceMatrix.setUsage(THREE.DynamicDrawUsage);scene.add(this.wake);
    this.rings=[];const ringGeometry=new THREE.RingGeometry(1.8,1.85,48);
    for(let i=0;i<3;i++){const ring=new THREE.Mesh(ringGeometry,new THREE.MeshBasicMaterial({color:0x7ee8ff,transparent:true,opacity:0,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));ring.visible=false;scene.add(ring);this.rings.push(ring);}
    this.aura=new THREE.Mesh(new THREE.PlaneGeometry(5.4,8),new THREE.MeshBasicMaterial({map:this.texture,color:0x58c9ff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));this.aura.rotation.x=-Math.PI/2;this.aura.visible=false;scene.add(this.aura);
  }
  update(dt,state,preferences,frozen){
    if(this.state!==state){this.state=state;this.uses=state?.nitroUses||0;this.burstAge=2;this.intensity=0;this.wasActive=false;this.previousLevel=0;}
    const active=!!state?.nitroActive&&!frozen,level=Math.max(1,state?.nitroLevel||1),reduced=preferences.reduced,battery=preferences.graphics==='battery';
    if(active&&(!this.wasActive||level!==this.previousLevel))this.burstAge=0;this.wasActive=active;this.previousLevel=level;this.uses=state?.nitroUses||0;
    if(!frozen){this.burstAge+=dt;this.intensity=THREE.MathUtils.damp(this.intensity,active?level/3:0,active?16:8,dt);}
    this.level=active?level:0;const color=level===3?0xffd183:level===2?0xb6b0ff:0x6ae0ff;
    this.exhaust.visible=active;const pulse=reduced?1:1+Math.sin((state?.elapsed||0)*39)*.045;this.exhaust.scale.set(1+(level-1)*.12,1,1+(level-1)*.18);this.jets.forEach(j=>{j.material.color.setHex(color);j.scale.y=pulse;});this.glows.forEach(g=>g.material.color.setHex(color));
    const x=this.car.position.x,z=this.car.position.z;
    this.aura.visible=active;this.aura.position.set(x,.065,z+1);this.aura.rotation.z=-this.car.rotation.y;this.aura.material.color.setHex(color);this.aura.material.opacity=active?.16+level*.07:0;
    this.wake.visible=active&&!reduced;this.wake.count=battery?12:48;this.wake.material.color.setHex(color);
    if(this.wake.visible){const phase=(state.roadTravel||state.distance)*.08;for(let i=0;i<this.wake.count;i++){const u=((i*.618033+phase)%1+1)%1,side=i%2?1:-1;this.matrix.position.set(x+side*(1.15+(i%7)*.2),.20+(i%5)*.14,z+2+u*12);this.matrix.scale.set(1,1,(.6+level*.5)*(1-u*.45));this.matrix.rotation.set(0,0,side*.04);this.matrix.updateMatrix();this.wake.setMatrixAt(i,this.matrix.matrix);}this.wake.instanceMatrix.needsUpdate=true;}
    this.rings.forEach((ring,i)=>{const age=this.burstAge-i*.075,p=age/.5;ring.visible=active&&!reduced&&!battery&&p>=0&&p<1;if(ring.visible){ring.position.set(x,.8,z+2+p*8);ring.scale.setScalar(.65+p*1.3);ring.material.color.setHex(color);ring.material.opacity=(1-p)*.32;}});
  }
}
