import * as THREE from 'three';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

// Permanent damage is model geometry. Only the small smoke / spark pools move.
// Everything stays below the roof line so the road and English signs stay clear.
export class CarDamageEffects{
  constructor(scene,car){
    this.car=car;this.state=null;this.stage=-1;this.lastImpact=null;this.spawnClock=0;
    this.deformable=car.children.filter(m=>m.isMesh&&m.userData.paint).map(mesh=>({mesh,base:mesh.geometry.attributes.position.array.slice()}));
    this.details=new THREE.Group();car.add(this.details);

    const lineMaterial=new THREE.LineBasicMaterial({color:0xe7f5ee,transparent:true,opacity:.86,depthWrite:false});
    const cracks=[];
    for(const rear of [false,true])for(const [cx,cy,scale]of [[-.24,.52,.27],[.36,.30,.15]]){
      const point=(x,t)=>[x,1.025+t*.46,(rear?1.18-t*.55:-.945+t*.58)+(rear?.012:-.012)];
      const lines=[[-1,-.22],[-.64,.85],[.18,1],[1,.37],[.83,-.65],[-.23,-1]];
      for(let i=0;i<lines.length;i++){
        const [dx,dy]=lines[i],mid=point(cx+dx*scale*.48,clamp(cy+dy*scale*.65,.05,.92)),end=point(cx+dx*scale,clamp(cy+dy*scale*1.15,.05,.92));
        cracks.push(...point(cx,cy),...mid,...mid,...end);
        if(i%2===0)cracks.push(...mid,...point(cx+dx*scale*.9+.06,clamp(cy+dy*scale*.35,.05,.92)));
      }
    }
    this.cracks=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(cracks,3)),lineMaterial);this.cracks.renderOrder=2;this.details.add(this.cracks);

    const paint=car.children.find(m=>m.userData.paint)?.material||new THREE.MeshStandardMaterial({color:0xd9b664});
    this.hood=new THREE.Group();this.hood.position.set(0,.975,-.57);this.details.add(this.hood);
    const hoodGeometry=new THREE.BufferGeometry();hoodGeometry.setAttribute('position',new THREE.Float32BufferAttribute([-.82,0,0,.82,0,0,.88,.025,-.95,.63,.075,-1.47,-.65,.035,-1.47,-.89,.015,-.95],3));hoodGeometry.setIndex([0,1,2,0,2,5,5,2,3,5,3,4]);hoodGeometry.computeVertexNormals();
    this.hoodPanel=new THREE.Mesh(hoodGeometry,paint);this.hoodPanel.userData.paint=true;this.hoodPanel.castShadow=true;this.hood.add(this.hoodPanel);
    const underside=new THREE.Mesh(hoodGeometry,new THREE.MeshStandardMaterial({color:0x23313b,roughness:.86,side:THREE.BackSide}));this.hood.add(underside);
    this.engineBay=new THREE.Mesh(new THREE.BoxGeometry(1.42,.025,1.08),new THREE.MeshStandardMaterial({color:0x18252c,roughness:.9}));this.engineBay.position.set(0,.985,-1.30);this.details.add(this.engineBay);
    this.loosePanel=new THREE.Group();this.loosePanel.position.set(1.065,.78,.86);this.details.add(this.loosePanel);
    const panel=new THREE.Mesh(new THREE.BoxGeometry(.035,.28,.64),paint);panel.position.set(.04,-.10,.20);panel.userData.paint=true;this.loosePanel.add(panel);
    const scrapeGeometry=new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute([1.096,.69,-.25,1.096,.74,.70,1.098,.61,.02,1.098,.67,.9,1.10,.80,.21,1.10,.83,.73],3));
    this.scrapes=new THREE.LineSegments(scrapeGeometry,new THREE.LineBasicMaterial({color:0xbac6c8}));this.details.add(this.scrapes);

    this.particles=new THREE.Group();scene.add(this.particles);
    const canvas=document.createElement('canvas');canvas.width=canvas.height=64;const context=canvas.getContext('2d'),gradient=context.createRadialGradient(32,32,0,32,32,32);gradient.addColorStop(0,'#d3dcdbbb');gradient.addColorStop(.45,'#a4b4b76b');gradient.addColorStop(1,'#73888d00');context.fillStyle=gradient;context.fillRect(0,0,64,64);
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    this.smoke=Array.from({length:12},(_,i)=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false,opacity:0}));m.visible=false;this.particles.add(m);return {mesh:m,life:2,seed:i};});
    const sparkGeometry=new THREE.BoxGeometry(.025,.025,.14),sparkMaterial=new THREE.MeshBasicMaterial({color:0xffd595});
    this.sparks=Array.from({length:10},(_,i)=>{const mesh=new THREE.Mesh(sparkGeometry,sparkMaterial);mesh.visible=false;this.particles.add(mesh);return {mesh,life:1,seed:i};});
    this.protection=new THREE.Mesh(new THREE.RingGeometry(1.65,1.71,40),new THREE.MeshBasicMaterial({color:0xb7e6df,transparent:true,opacity:.18,depthWrite:false}));this.protection.rotation.x=-Math.PI/2;this.protection.scale.y=1.55;this.protection.visible=false;scene.add(this.protection);
    this.origin=new THREE.Vector3();this.setStage(0);
  }
  setStage(stage){
    if(this.stage===stage)return;this.stage=stage;
    for(const {mesh,base}of this.deformable){
      const attribute=mesh.geometry.attributes.position;
      for(let i=0;i<base.length;i+=3){
        const nose=clamp((-base[i+2]-1.25)/.9,0,1),crease=stage*nose;
        attribute.array[i]=base[i]*(1-crease*.035);
        attribute.array[i+1]=base[i+1]-crease*(.022+.025*Math.max(0,base[i]));
        attribute.array[i+2]=base[i+2]+crease*(.065+.025*Math.sin(base[i]*5));
      }
      attribute.needsUpdate=true;mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingSphere();
    }
    this.cracks.visible=this.scrapes.visible=stage>0;
    this.hood.visible=this.engineBay.visible=this.loosePanel.visible=stage>=2;
  }
  reset(state){
    this.state=state;this.lastImpact=state?.lastImpact||null;this.spawnClock=0;this.setStage(state?.damage||0);
    for(const p of [...this.smoke,...this.sparks]){p.mesh.visible=false;p.life=2;}
    this.hood.rotation.set(0,0,0);this.loosePanel.rotation.set(0,0,0);this.protection.visible=false;
  }
  update(dt,state,preferences={},frozen=false){
    if(this.state!==state)this.reset(state);
    const stage=state?.damage||0;this.setStage(stage);
    this.car.updateWorldMatrix(true,false);this.origin.set(.35,.98,-1.55).applyMatrix4(this.car.matrixWorld);
    const reduced=!!preferences.reduced,battery=preferences.graphics==='battery';
    if((state?.lastImpact||null)!==this.lastImpact){
      this.lastImpact=state.lastImpact;
      if(!reduced)for(const p of this.sparks){const a=p.seed*2.4;p.life=0;p.mesh.position.copy(this.origin);p.vx=Math.sin(a)*3.3;p.vy=1.3+p.seed%3*.5;p.vz=2+p.seed%4;p.mesh.visible=true;}
    }
    if(stage>=2){const t=state?.elapsed||0;this.hood.rotation.x=.17+(stage===3?.06:0)+(reduced?0:Math.sin(t*17)*.012);this.hood.rotation.z=-.025;this.loosePanel.rotation.z=-.14+(reduced?0:Math.sin(t*15)*.035);}
    this.protection.visible=!!state&&state.invulnerable>0&&stage<3&&!['paused','finished','failed','countdown'].includes(state.status);
    this.protection.position.set(this.car.position.x,.065,this.car.position.z);
    const age=state?.lastImpact?(state.elapsed-state.lastImpact.at):Infinity;
    if(age<.45&&!reduced&&!frozen){const kick=Math.sin(age*42)*(1-age/.45);this.car.rotation.z+=kick*.065;this.car.position.y+=Math.abs(kick)*.045;}
    if(reduced){for(const p of [...this.smoke,...this.sparks])p.mesh.visible=false;}
    if(frozen)return;
    const speed=(state?.arena.speed||0)*(state?.speedFactor||0)*(state?.worldTimeScale??1);
    const particleDt=dt*(state?.worldTimeScale??1);
    if(stage>=2&&!reduced){
      this.spawnClock+=particleDt;
      const interval=battery?.25:stage===3?.065:.13;
      if(this.spawnClock>=interval){this.spawnClock%=interval;const p=this.smoke.find(p=>!p.mesh.visible);if(p){p.life=0;p.mesh.position.copy(this.origin);p.mesh.visible=true;p.mesh.material.color.setHex(stage===3?0x6d7b81:0xe2e9e4);}}
    }
    for(const p of this.smoke)if(p.mesh.visible){
      p.life+=particleDt;p.mesh.visible=p.life<1.1&&p.mesh.position.z<13;
      p.mesh.position.x+=particleDt*(.7+Math.sin(p.seed)*.2);p.mesh.position.y+=particleDt*.65;p.mesh.position.z+=particleDt*(speed+1.2);
      const size=.25+p.life*.65;p.mesh.scale.setScalar(size);p.mesh.material.opacity=(stage===3?.55:.3)*Math.pow(Math.max(0,1-p.life/1.1),1.5);
    }
    for(const p of this.sparks)if(p.mesh.visible){p.life+=particleDt;p.vy-=particleDt*9;p.mesh.position.x+=p.vx*particleDt;p.mesh.position.y+=p.vy*particleDt;p.mesh.position.z+=(p.vz+speed)*particleDt;p.mesh.rotation.x=p.seed+p.life*12;p.mesh.visible=p.life<.45&&p.mesh.position.y>.06;}
    if(reduced){for(const p of [...this.smoke,...this.sparks])p.mesh.visible=false;}
  }
}
