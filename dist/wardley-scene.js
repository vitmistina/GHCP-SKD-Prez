// Animated, Wardley-inspired low-poly closing scene.
// Prediction is deliberately separate from present-day position.
export function createWardley({THREE,root,box,mesh,line,ball,textSprite,reduced,ink,paper,blue,green,gold,orange}){
 let time=reduced?13:0,paused=false;
 const ease=(a,b)=>{const t=Math.max(0,Math.min(1,(time-a)/(b-a)));return t*t*(3-2*t)};
 const group=(x,z)=>{const g=new THREE.Group();g.position.set(x,-1.5,z);root.add(g);return g};
 const tag=(parent,s,y=1.4,size=.29,c='#30372e')=>{
  const o=textSprite(s,0,y,.45,size,c);root.remove(o);parent.add(o);
 };
 const track=(a,b,z,c,dashed=false)=>{
  const curve=new THREE.CatmullRomCurve3([[a,-1.60,z],[(2*a+b)/3,-1.55,z-.12],[(a+2*b)/3,-1.55,z-.12],[b,-1.60,z]].map(p=>new THREE.Vector3(...p)));
  const pts=curve.getPoints(90),geo=new THREE.BufferGeometry().setFromPoints(pts);
  const mat=dashed?new THREE.LineDashedMaterial({color:c,dashSize:.17,gapSize:.12}):new THREE.LineBasicMaterial({color:c});
  const wire=new THREE.Line(geo,mat);if(dashed)wire.computeLineDistances();root.add(wire);
  const dot=ball(.075,c,a,-1.45,z);dot.children.forEach(x=>x.visible=false);
  return {curve,wire,dot,num:pts.length};
 };
 const makeFactory=(p,c,finished=false)=>{
  box(.87,.62,.76,c,0,.40,0,p);
  for(let i=-1;i<=1;i++){
   const roof=mesh(new THREE.ConeGeometry(.25,.3,4),finished?paper:gold,i*.27,.87,0,p);
   roof.rotation.y=Math.PI/4;
  }
  box(.17,.70,.18,finished?orange:blue,.27,.98,-.22,p);
  for(const x of [-.24,.08])box(.18,.18,.025,paper,x,.43,.397,p);
  box(.29,.36,.035,ink,.18,.25,.414,p);
 };
 // Physical relief-map and four unmistakable Wardley columns.
 box(8.8,.17,5.15,0xe3dccd,0,-1.85,0);
 box(8.58,.04,4.94,0xf9f5eb,0,-1.735,0);
 for(const x of [-2.14,0,2.14])line([[x,-1.68,-2.4],[x,-1.68,2.4]],0xb5b5a8);
 for(const z of [-1.25,.10,1.37])line([[-4.26,-1.68,z],[4.26,-1.68,z]],0xd4d0c4);
 ['GENESIS','CUSTOM BUILT','PRODUCT','COMMODITY'].forEach((s,i)=>textSprite(s,[-3.24,-1.05,1.06,3.28][i],-1.36,2.79,.26));
 textSprite('EVOLUTION →',0,-2.08,3.10,.28,'#707669');
 textSprite('USER VALUE',-3.25,1.65,-2.04,.28,'#707669');
 textSprite('INFRASTRUCTURE',-3.14,-1.27,1.95,.20,'#999488');
 // Historical infrastructure, moving to the right.
 const compiler=group(-3.25,1.33);
 box(.91,.82,.71,blue,0,.55,0,compiler);
 box(.74,.47,.035,ink,0,.64,.38,compiler);
 box(.33,.07,.03,paper,-.13,.73,.41,compiler);
 box(.20,.07,.03,gold,.14,.56,.41,compiler);
 tag(compiler,'COMPILER',1.40);
 const memory=group(-3.25,.12);
 for(let i=0;i<3;i++){
  box(.93,.25,.70,[green,blue,gold][i],0,.25+i*.26,0,memory);
  for(const x of [-.27,-.1,.07])box(.08,.06,.03,ink,x,.26+i*.26,.37,memory);
 }
 tag(memory,'MANAGED MEMORY',1.32,.27);
 // Harness: a one-off scaffold with an SDK workbench.
 const harness=group(-3.25,1.25);
 for(const x of [-.39,.39])for(const z of [-.30,.30])box(.06,1.12,.06,0x789faa,x,.58,z,harness);
 for(const y of [.28,1.13])box(.85,.06,.06,blue,0,y,.29,harness);
 box(.70,.12,.64,gold,0,.20,0,harness);
 box(.48,.38,.07,ink,0,.51,.16,harness);
 box(.32,.05,.025,paper,0,.55,.20,harness);
 tag(harness,'HARNESS / SDK',1.49,.30,'#39728a');
 // Factory TODAY is Genesis, not Product.
 const today=group(-3.25,-1.20);makeFactory(today,0xe2b29b);
 for(const x of [-.53,.53])box(.07,1.33,.07,blue,x,.64,.43,today);
 box(1.15,.06,.07,blue,0,1.27,.43,today);
 tag(today,'FACTORY TODAY',1.70,.29,'#ae6045');
 // The three red-ish factory models are a forecast of packaged PRODUCTS.
 const products=group(1.0,-1.19);
 for(let i=-1;i<=1;i++){
  const p=new THREE.Group();p.position.set(i*.76,0,i===0?-.04:.18);p.scale.setScalar(.58);products.add(p);
  makeFactory(p,[0xd5a08b,0xc88470,0xe4ad8f][i+1],true);
 }
 tag(products,'MAINSTREAM PRODUCTS ?',1.46,.34,'#ba6047');
 tag(products,'?',1.91,.60,'#ba6047');
 const trails={
  compiler:track(-3.25,3.12,1.33,0x809faa),
  memory:track(-3.25,2.57,.12,0x8bad9e),
  harness:track(-3.25,-1.09,1.25,0x6b9bad),
  forecast:track(-3.25,1.0,-1.20,0xc66b4e,true)
 };
 const animate=(dt=0)=>{
  if(!reduced&&!paused)time=Math.min(13,time+Math.max(0,dt));
  const c=ease(.2,3.0),m=ease(.6,3.3),h=ease(3.15,5.6),f=ease(5.95,7.5),p=ease(8.35,11.6);
  compiler.position.x=-3.25+6.37*c;memory.position.x=-3.25+5.82*m;
  harness.position.x=-3.25+2.16*h;harness.visible=h>.001;
  today.visible=f>.001;today.scale.setScalar(Math.max(.001,f));
  products.visible=p>.001;products.scale.setScalar(Math.max(.001,p));
  [[trails.compiler,c],[trails.memory,m],[trails.harness,h],[trails.forecast,p]].forEach(([t,k])=>{
   t.wire.geometry.setDrawRange(0,k<=0?0:Math.max(2,Math.round(t.num*k)));
   t.dot.visible=k>.01&&k<.99;
   t.dot.position.copy(t.curve.getPoint(k));t.dot.position.y+=.11;
  });
 };
 animate(0);
 return {
  animate,
  togglePause(){paused=!paused;return paused},
  replay(){time=0;paused=false;animate(0)},
  nextBeat(){time=[3.5,5.9,8.4,13].find(x=>x>time+.15)??13;animate(0)}
 };
}
