const assert=require('node:assert/strict');const {laneLayout,strokeHits}=require('./layout-compiled.cjs');
let cases=0;
for(const width of [280,320,360,390,430,768,1024,1440,1920])for(const spacing of [55,72,100,150,220,450])for(const offset of [-80,0,80]){
  const center=width/2+offset,anchors=[{x:center-spacing},{x:center},{x:center+spacing}],cards=laneLayout(width,anchors);
  for(let i=0;i<3;i++){const c=cards[i];assert(c.width>0);assert(c.x-c.width/2>=12-1e-7);assert(c.x+c.width/2<=width-12+1e-7);assert(c.x-c.width/2>=c.cellLeft);assert(c.x+c.width/2<=c.cellRight);if(i>0){const gap=c.x-c.width/2-(cards[i-1].x+cards[i-1].width/2);assert(gap>=24-1e-7,'Answer cards need at least a 24px lane gutter');}}cases++;
}
// Triangle avoids passing through the middle card when joining the two side cards.
const rects=[{id:2,left:10,right:90,top:100,bottom:180},{id:0,left:150,right:230,top:220,bottom:300},{id:1,left:290,right:370,top:100,bottom:180}];
assert.deepEqual(strokeHits({x:190,y:260},{x:330,y:140},rects,[]),[0,1]);
assert.deepEqual(strokeHits({x:330,y:140},{x:50,y:140},rects,[0,1]),[2]);
assert.deepEqual(strokeHits({x:50,y:140},{x:330,y:140},rects,[]),[2,1],'A fast finger move must not accidentally hit the lower middle block');
assert.deepEqual(strokeHits({x:0,y:0},{x:390,y:0},rects,[]),[]);
assert.deepEqual(strokeHits({x:50,y:140},{x:50,y:140},rects,[]),[2],'Tap fallback should select the touched block');
assert.deepEqual(strokeHits({x:190,y:260},{x:330,y:140},rects,[0,1,2]),[],'Visited blocks must not repeat');
console.log(`PASS: ${cases} viewport / lane projection layouts; one sign per lane with >=24px gaps. Fast strokes, diagonal connections, taps, misses and duplicate touches verified.`);
