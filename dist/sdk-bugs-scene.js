// An intentionally charming, low-poly illustration of a fast-moving SDK.
// The holes and critters are metaphors, not measurements of product quality.
export function createSdkBugsScene({THREE,root,box,mesh,line,ball,textSprite,reduced,ink,paper,blue,green,gold,orange}){
  const cream=0xf1e0c5,shadow=0x514437,rim=0xd2b997,red=0xd76b50,purple=0x73738c,ochre=0xdba94d;
  let clock=reduced?8:0,paused=false,visibleCount=3,patched=false;
  const critters=[],patches=[],dust=[];
  const clamp=x=>Math.max(0,Math.min(1,x));
  const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
  const makeGroup=(x=0,y=0,z=0,parent=root)=>{
    const group=new THREE.Group();group.position.set(x,y,z);parent.add(group);return group;
  };
  const segment=(a,b,r,c,parent)=>{
    const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b);
    const d=end.clone().sub(start),part=mesh(new THREE.CylinderGeometry(r*.76,r,d.length(),5),c,0,0,0,parent);
    part.position.copy(start.add(end).multiplyScalar(.5));part.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());
    return part;
  };
  const pebble=(x,y,z,size,c,parent=root)=>{
    const o=mesh(new THREE.IcosahedronGeometry(size,0),c,x,y,z,parent);o.rotation.set(.3,.7,.2);return o;
  };

  // A toy-like SDK stone block. Dark inset wells and faceted rims read as cavities.
  const block=box(3.38,3.24,3.08,cream,0,-.03,0);
  box(4.15,.13,3.93,0xe7dfcf,0,-1.74,.08);
  box(3.38,.12,3.08,0xebd7b9,0,-1.66,0);
  for(const x of [-1.56,1.56]){
    for(const y of [-1.42,1.28])pebble(x,y,1.60,.21,x>0?blue:gold);
  }
  // Small imperfect blue corners make it feel hand-patched rather than industrial.
  box(.74,.15,.47,blue,1.13,1.63,1.12).rotation.y=.17;
  box(.48,.52,.08,blue,-1.48,-1.17,1.59).rotation.z=-.21;
  box(.43,.12,.42,green,-1.29,1.63,-1.06).rotation.y=.36;
  box(.7,.16,.6,blue,1.3,-1.56,.91).rotation.z=.15;
  textSprite('SDK',.05,-.18,1.64,.65,'#536980');

  // A true shadow-colored inset, with an uneven faceted lip and thin cracks.
  function hole(face,u,v,r){
    const mount=makeGroup();
    if(face==='front'){mount.position.set(u,v,1.566);}
    else if(face==='right'){mount.position.set(1.705,v,u);mount.rotation.y=Math.PI/2;}
    else{mount.position.set(u,1.61,v);mount.rotation.x=-Math.PI/2;}
    const black=mesh(new THREE.CircleGeometry(r,13),shadow,0,0,.035,mount);
    black.children.forEach(x=>x.visible=false);
    const inside=mesh(new THREE.CircleGeometry(r*.81,13),0x251f1b,0,0,.056,mount);
    inside.children.forEach(x=>x.visible=false);
    const edge=mesh(new THREE.TorusGeometry(r*.99,r*.13,5,13),rim,0,0,.082,mount);
    edge.children.forEach(x=>x.visible=false);
    // Irregular chipped stone triangles around the hole.
    for(let i=0;i<8;i++){
      const a=i*Math.PI*2/8+.19,dist=r*(1.06+(i%3)*.035);
      const piece=pebble(Math.cos(a)*dist,Math.sin(a)*dist,.095,r*(i%3===0?.18:.11),i%3===0?0xe6cda9:cream,mount);
      piece.scale.set(1.3,.65,.48);
      piece.rotation.z=a;
    }
    return mount;
  }
  hole('front',-.93,.82,.39);
  hole('front',1.09,.82,.34);
  hole('front',-.82,-1.15,.33);
  hole('right',.32,.6,.36);
  hole('right',.61,-.89,.34);
  hole('top',.1,.08,.25);

  // Character silhouettes: shells, eyes and bendy legs, all genuinely 3D.
  function bug(kind,tint){
    const g=makeGroup();
    const spider=kind==='spider';
    const body=ball(spider?.34:.39,tint,0,.02,.1,g);
    body.scale.set(spider?1:1.2,spider?.78:.82,spider?.82:1.03);
    const head=ball(spider?.23:.24,spider?tint:0x65564b,0,.10,.43,g);
    head.scale.set(1,.85,.8);
    for(let side of [-1,1]){
      const eye=ball(.07,paper,side*.115,.14,.62,g);eye.scale.set(.9,1.05,.5);
      ball(.031,ink,side*.117,.14,.671,g);
      if(!spider){
        segment([side*.11,.26,.47],[side*.2,.54,.54],.022,shadow,g);
        ball(.04,tint,side*.2,.54,.54,g);
      }
    }
    if(spider){
      for(let side of [-1,1])for(let j=0;j<4;j++){
        const y=.16-j*.15,legZ=.23-j*.13;
        segment([side*.25,y,legZ],[side*(.47+j*.04),y+.13,legZ+.01],.035,tint,g);
        segment([side*(.47+j*.04),y+.13,legZ+.01],[side*(.58+j*.04),y-.10,legZ+.15],.028,tint,g);
      }
    }else{
      for(let side of [-1,1])for(let j=0;j<3;j++){
        const z=.30-j*.25;
        segment([side*.28,-.12,z],[side*.42,-.26,z+.08],.035,shadow,g);
        segment([side*.42,-.26,z+.08],[side*.51,-.42,z+.13],.025,shadow,g);
      }
      // Uneven shell spots make a recognisable little beetle.
      for(const [x,y,z] of [[-.14,.29,.18],[.16,.28,-.07],[0,.34,-.14]])
        pebble(x,y,z,.065,kind==='ladybug'?shadow:0xa97b3e,g);
    }
    return g;
  }
  const entries=[
    {kind:'spider',tint:purple,from:[-.93,.82,1.60],to:[-1.38,1.10,1.98],delay:0,rot:0},
    {kind:'beetle',tint:red,from:[1.09,.82,1.60],to:[1.40,.45,1.99],delay:.85,rot:0},
    {kind:'beetle',tint:ochre,from:[-.82,-1.15,1.60],to:[-.90,-1.58,2.08],delay:1.75,rot:0},
    {kind:'spider',tint:purple,from:[1.75,.60,.32],to:[2.14,.21,.59],delay:0,rot:Math.PI/2},
    {kind:'ladybug',tint:red,from:[.10,1.65,.08],to:[.30,1.92,.38],delay:0,rot:-Math.PI/2}
  ];
  entries.forEach((e,i)=>{
    const g=bug(e.kind,e.tint);g.rotation.y=e.rot;g.scale.setScalar(0.01);
    critters.push({g,...e,i});
  });
  // A small hand-drawn repair: two crossed pieces of tape.
  const patch=makeGroup(-.82,-1.15,1.72);
  const strip=box(.75,.15,.055,gold,0,0,0,patch);strip.rotation.z=.39;
  const strip2=box(.71,.13,.056,0xe8c780,0,0,.025,patch);strip2.rotation.z=-.63;
  patch.visible=false;
  patches.push(patch);

  // Displaced fragments in the foreground, without cluttering the left-side text.
  for(const [x,z,s,c] of [[-1.7,1.85,.19,blue],[-1.2,2.08,.13,gold],[1.45,1.89,.12,green],[2.00,1.30,.16,blue],[-.4,2.13,.11,rim]]){
    dust.push(pebble(x,-1.63+s/2,z,s,c));
  }
  const seamPoints=[[1.24,1.61,1.56],[1.28,1.33,1.60],[1.44,1.20,1.62]];
  line(seamPoints,orange);
  // Contrast: a newly arrived feature has been taped on already.
  const feature=makeGroup(1.28,1.62,-.42);
  box(.74,.10,.40,blue,0,.09,0,feature);
  box(.17,.13,.56,gold,0,.18,0,feature).rotation.z=.21;

  function animate(dt=0){
    if(!paused&&!reduced)clock+=Math.max(0,dt);
    critters.forEach(({g,from,to,delay,rot,i})=>{
      if(i>=visibleCount){g.visible=false;return;}
      if(i===2&&patched){g.visible=false;return;}
      const p=ease((clock-delay)/2.2);
      g.visible=true;
      const scale=(.18+.7*p)*(i===3?.85:i===4?.75:1);
      g.scale.setScalar(scale);
      g.position.set(
        from[0]+(to[0]-from[0])*p,
        from[1]+(to[1]-from[1])*p+(reduced?0:.028*Math.sin(clock*5+i)),
        from[2]+(to[2]-from[2])*p
      );
      g.rotation.set(0,rot+(reduced?0:Math.sin(clock*1.6+i)*.07),reduced?0:Math.sin(clock*2+i)*.05);
    });
    patch.visible=patched;
    // A freshly shipping block wiggles a little, then settles in.
    feature.rotation.z=reduced?0:Math.sin(clock*2.3)*.035;
  }
  animate(0);
  return {
    animate,
    togglePause(){paused=!paused;return paused;},
    ship(){visibleCount=Math.min(5,visibleCount+1);clock=Math.max(clock,3.1);paused=false;animate(0);return visibleCount;},
    patch(){patched=!patched;animate(0);return patched;},
    replay(){clock=reduced?8:0;paused=false;visibleCount=3;patched=false;animate(0);}
  };
}
