import * as THREE from './three.module.js';
import { createWardley } from './wardley-scene.js';
const $=id=>document.getElementById(id);
const slides=[
{tag:'A STORY ABOUT GITHUB COPILOT SDK',title:'Climbing the<br><em>delegation</em><br>staircase.',desc:'Every step gave us more power. Every step asked something new of us.',scene:'stairs',label:'same ambition. a new step.',annotation:'How far up<br>can we go?',section:'The question',note:'Open with the question, not the SDK. This is a story about what we can delegate — and what we still have to own.'},
{tag:'01 / THE MACHINE · 1940s',title:'We delegated<br><em>arithmetic.</em>',desc:'ENIAC made large numerical calculations practical at a new scale. Humans still had to translate the task into the machine’s configuration.',gain:'Repeated numerical calculation.',cost:'Wiring, configuration and an exact procedure.',scene:'eniac',label:'a calculation, made physical',annotation:'An evening<br>in the archive.',section:'A little history',note:'Keep this short. Ballistic calculations are a useful historical example. The machine executes arithmetic; humans specify the procedure. The photograph is the original image extracted from your copilot-sdk-story-v2-visual.pptx. Source recorded in that deck: https://www.army.mil/article/283485/the_army_at_250_did_you_know_the_army_invented_this'},
{tag:'02 / THE COMPILER · 1957',title:'We stopped writing<br><em>for the machine.</em>',desc:'With FORTRAN, a compiler could translate a higher-level description into machine instructions.',gain:'Translation into machine code.',cost:'Precise algorithms expressed in a formal language.',scene:'compiler',label:'intent → language → instructions',annotation:'One level up.',section:'A little history',note:'The compiler takes over translation, not responsibility for the algorithm. Avoid suggesting natural-language intent is enough.'},
{tag:'03 / THE SOFTWARE CRISIS · 1968',title:'The machine grew.<br><em>So did the problem.</em>',desc:'More powerful computers made larger systems possible. Our ability to engineer them had not caught up.',scene:'crisis',label:'an exploding city of possibilities',annotation:'Ambition ↑<br>Methods ...?',section:'The price',note:'The NATO Software Engineering Conference took place in Garmisch in 1968. Dijkstra described the major cause in his 1972 Turing lecture The Humble Programmer: greatly increased computing power made much larger, more ambitious programs possible while software development practices lagged. This is a causal metaphor, not a literal historical model. Quotation: https://www.cs.utexas.edu/~EWD/transcriptions/EWD03xx/!SV-EWD340.html'},
{tag:'04 / THE HIDDEN PART',title:'Abstraction moves<br><em>the problem.</em>',desc:'A simpler surface can hide a more complicated system. The 1968 software crisis gave that growing gap a name.',gain:'Distance from low-level details.',cost:'Understanding the failures beneath the surface.',scene:'iceberg',label:'the interface is only the tip',annotation:'Still there.<br>Just less visible.',section:'The price',note:'Use the iceberg as the recurring warning. Do not claim abstraction alone caused the software crisis.'},
{tag:'05 / APOLLO · A USEFUL ANALOGY',title:'An agent needs<br><em>a spacecraft.</em>',desc:'A capable astronaut still needed a working loop: instructions, tools, action and telemetry.',gain:'Action within a supported mission.',cost:'Designing the environment that makes action reliable.',scene:'apollo',label:'capability + tools + feedback',annotation:'',section:'The harness',note:'An analogy, not an architectural equivalence. Apollo’s decisions were distributed among the crew, software, procedures and mission control. DSKY and verbs/nouns can connect to your drawing.'},
{tag:'06 / MORE STEPS, SAME PATTERN',title:'Less plumbing.<br><em>New obligations.</em>',desc:'Memory management, objects and remote calls moved work behind interfaces. Each interface came with assumptions.',gain:'Bookkeeping and implementation details.',cost:'Lifetimes, boundaries, latency and partial failure.',scene:'layers',label:'GC / objects / remote calls',annotation:'Abstraction ≠<br>disappearance.',section:'A little history',note:'Treat GC, OOP and RPC as three examples, not a strict chronological ladder. Choose one concrete trade-off for each.'},
{tag:'07 / ONE AGENT, MANY PLUGS',title:'One agent.<br><em>Many plugs.</em>',desc:'The Copilot CLI is a general-purpose agent: it uses the terminal, the file system and writes its own scripts. The SDK is the power strip — plug in any experience you want to build.',scene:'powerstrip',label:'CLI runtime → SDK → your experience',annotation:'One agent.<br>Plug it in anywhere.',section:'Architecture',note:'The SDK communicates with the Copilot CLI runtime over JSON-RPC. You can talk to the CLI directly in the terminal. Through the SDK (JSON-RPC to the CLI runtime) the same agent powers your own C#/Python program, the VS Code Agent window and the Copilot App. The empty socket is the invitation: what would you plug in? Sources: github.com/github/copilot-sdk.'},
{tag:'08 / WHERE YOU MEET IT',title:'Four places<br>to <em>plug in.</em>',desc:'The same agent already shows up in tools you use — and in your own code. Three are available today; one is waiting for approval.',scene:'places',label:'available today: 3 · pending approval: 1',annotation:'Already on<br>your desk.',section:'In practice',note:'Four practical entry points. (1) VS Code Agent Window: the icon in the title bar opens it. (2) The harness picker in VS Code chat: "Copilot" is the Copilot SDK harness, "Local" is the original Copilot Chat, "Cloud" does not work in NN yet. (3) Your own code: a small C# program using the GitHub.Copilot SDK — one CopilotClient, two agents (an implementer and a reviewer called Steve), and a live view in VS Code through the experimental Agent Host Protocol. (4) The GitHub Copilot app: an agent-native desktop app, currently in the approval process at the Engineering Standards Board, so not available in NN yet.'},
{tag:'09 / LESSONS FROM THE FIELD',title:'Context needed<br><em>a migration.</em>',desc:'Moving from the VS Code chat harness to the SDK meant hunting down memory, preferences and user instructions, then reconnecting them.',scene:'lessons',label:'01 / manually carrying the context across',annotation:'Not a<br>free transfer.',section:'Practical findings',note:'My actual experience: memory, preferences and user instructions did not simply follow automatically between VS Code and my SDK workflow. Their locations and configuration required investigation and migration work. This is my concrete setup, not a universal claim about every SDK configuration.'},

{tag:'10 / MORE THAN ONE WAY',title:'The SDK did not<br><em>invent the loop.</em>',desc:'It was possible before: assemble an agent loop over an LLM API, script an existing CLI, or call a packaged agent harness. Copilot is not the only SDK in town.',scene:'sdkpaths',label:'three roads to a programmable agent',annotation:'Possible before.<br>Practical now.',section:'Put it in perspective',note:'Do not claim the SDK invented programmable agents. A hand-built LLM/tool loop is the most flexible and most operational work; non-interactive CLI with prompt and JSONL output is scriptable; a coding-agent SDK exposes a packaged runtime and richer programmatic control. Other relevant options include Anthropic Claude Agent SDK and OpenAI Codex SDK. Different SDKs have different contracts and are not interchangeable. Official references: https://github.com/github/copilot-sdk , https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/run-cli-programmatically , https://platform.claude.com/docs/en/agent-sdk/overview , https://developers.openai.com/codex/sdk/ .'},
{tag:'11 / A BOUNDARY, NOT A PROMPT',title:'Deterministic limits.<br><em>Stochastic work.</em>',desc:'My program owns the state machine, allowed transitions, tool permissions, budgets and stopping conditions. Inside those boundaries, an agent explores solutions. The boundary can reject an action, not guarantee the answer.',scene:'boundaries',label:'constraints outside · exploration inside',annotation:'Freedom inside.<br>Control at the edge.',section:'What I actually build',note:'Separate two layers rigorously. The agent is nondeterministic: outputs and plans vary. The host application can enforce deterministic invariants before tool calls, after results and during state transitions: budget caps, retries, timeouts, allowlists and valid state transitions. Prompt-only rules are not hard guardrails. An allowed transition is not equivalent to an accurate, secure or correct result. The animation illustrates a proposed action reaching the gate: within policy is admitted; over-budget is blocked, without changing the state machine. Both cases are conceptual simulations, not a live agent run.'},
{tag:'12 / THE NEXT ABSTRACTION · A PREDICTION',title:'The factory is<br>still <em>hand-built.</em>',desc:'Compilers and managed memory became widely available infrastructure. Harnesses are moving from custom builds towards products. My prediction: we have a brief window to build software factories ourselves before a handful of mainstream implementations package the common patterns.',scene:'wardley',label:'evolution → productisation?',annotation:'Our last<br>DIY window?',section:'Where this leads',note:'A Wardley-inspired conceptual map, NOT measured market data. Horizontal means evolutionary maturity, NOT chronological time. Vertical is relative visibility in the user value chain. Compiler and managed memory are simplified historical analogies; not all compilers or runtimes are commodities. The harness is an emerging mix of products and bespoke configuration. Software factory TODAY sits in Genesis on this map; the RED DASHED arrow to a few mainstream products is my prediction only. Productisation does not guarantee commoditisation and organisation-specific factories may remain custom-built.'},
];
const eniacPhoto=new Image();eniacPhoto.src='assets/eniac.jpeg';
let escalatorSteps=[], cinemaReels=[], cinemaBeam=null, escalatorPaused=false, projectionOn=true;
let index=Math.max(0,Math.min(slides.length-1,parseInt(location.hash.slice(1))||0)), root, renderer, scene, camera, objects=[],spin=0,targetSpin=0,tilt=0,targetTilt=0,transition=1,auto=false,sim=0,simStart=0,fail=false,simStatus='',selectedPath=0,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const ink=0x30372e,paper=0xf5f1e8,gold=0xebc462,blue=0xbfd5dc,green=0xc3d1ad,orange=0xdb8969;let rng=2;const random=()=>{rng=(rng*1664525+1013904223)>>>0;return rng/4294967296};
function outline(geo){const edges=new THREE.EdgesGeometry(geo,25);const pos=edges.attributes.position;for(let i=0;i<pos.count;i++){pos.setXYZ(i,pos.getX(i)+(random()-.5)*.025,pos.getY(i)+(random()-.5)*.025,pos.getZ(i)+(random()-.5)*.025)}return new THREE.LineSegments(edges,new THREE.LineBasicMaterial({color:ink,transparent:true,opacity:.82}));}
function mesh(geo,color,x=0,y=0,z=0,parent=root){const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color,roughness:.94,flatShading:true}));m.position.set(x,y,z);m.add(outline(geo));m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function box(w,h,d,c,x=0,y=0,z=0,p=root){return mesh(new THREE.BoxGeometry(w,h,d),c,x,y,z,p)}
function ball(r,c,x=0,y=0,z=0,p=root){return mesh(new THREE.IcosahedronGeometry(r,1),c,x,y,z,p)}
function line(points,color=ink,parent=root){const g=new THREE.BufferGeometry().setFromPoints(points.map(p=>new THREE.Vector3(...p)));const l=new THREE.Line(g,new THREE.LineBasicMaterial({color,transparent:true,opacity:.7}));parent.add(l);return l}
function textSprite(text,x,y,z,size=.4,color='#30372e'){const c=document.createElement('canvas');c.width=1024;c.height=192;const ctx=c.getContext('2d');ctx.font='100px Caveat, Comic Sans MS, cursive';ctx.textAlign='center';ctx.fillStyle=color;ctx.fillText(text,512,125);const tex=new THREE.CanvasTexture(c);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false}));s.position.set(x,y,z);s.scale.set(size*5.33,size,1);root.add(s);return s}
function arrow(a,b,color=ink){line([a,b],color);const v=new THREE.Vector3(...b).sub(new THREE.Vector3(...a)).normalize();const h=new THREE.ArrowHelper(v,new THREE.Vector3(...b).addScaledVector(v,-.25),.25,color,.18,.10);root.add(h)}
function platform(){const p=mesh(new THREE.CylinderGeometry(3.3,3.3,.13,48),0xe9e4d7,0,-1.65,0);p.rotation.y=.1}
function oldStairs(){for(let i=0;i<7;i++){const x=(i-3)*.75,y=-1.4+i*.48;const s=box(.85,.23,1.5,[blue,paper,green,paper,gold,blue,gold][i],x,y,0);s.rotation.y=(random()-.5)*.08;line([[x-.4,y-.1,.76],[x-.4,-1.8,.76],[x+.4,-1.8,.76],[x+.4,y-.1,.76]],0xb9b9a8);if([0,2,4,6].includes(i))textSprite(['arithmetic','','language','','agents','','what next?'][i],x,y+.4,0,.3)}for(let i=0;i<7;i++)ball(.45+random()*.2,paper,2.5+(random()-.5)*1.9,2.15+random()*.4,-.6+random()*.8);line([[-3,-1.9,1.2],[-2.4,-1.6,1.2],[-1.8,-1.3,1.2],[-1.2,-.9,1.2],[-.5,-.4,1.2],[.4,.2,1.2],[1.2,.8,1.2],[2,1.4,1.2]],orange)}
// A slow, continuous escalator. The moving treads wrap only inside the clouds.
function stairs(){
 if(index!==0){oldStairs();return}
 const slope=Math.atan2(3.15,5.1);
 // Fixed side panels, upper handrails and pickets keep the movement legible.
 for(const z of [-.86,.86]){
  const side=box(6.05,.38,.12,blue,0,-.5,z);side.rotation.z=slope;
  const rail=box(6.05,.08,.09,ink,0,.66,z);rail.rotation.z=slope;
  for(let j=0;j<8;j++){
   const x=-2.55+j*5.1/7,y=-1.8+j*3.15/7;
   line([[x,y,z],[x,y+.85,z]],0x8b9384);
  }
 }
 escalatorSteps=[];
 for(let i=0;i<15;i++){
  const tread=box(.39,.19,1.64,i%4===0?gold:paper);
  // Fine pencil grooves across the tread.
  for(let k=0;k<7;k++)line([[-.15,.103,-.65+k*.21],[.15,.103,-.65+k*.21]],0xa2a492,tread);
  escalatorSteps.push(tread);
 }
 // Clouds obscure the upper return point; the lower return fades below the entry.
 for(let i=0;i<11;i++){
  const cloud=mesh(new THREE.SphereGeometry(.4+random()*.22,10,7),paper,2.48+(random()-.5)*1.45,1.58+random()*.85,(random()-.5)*2.3);
  cloud.children.forEach(c=>c.visible=false);
 }
 textSprite('arithmetic',-2.6,-1.6,1.35,.34);
 textSprite('language',-.85,-.55,1.35,.34);
 textSprite('agents',.95,.55,1.35,.34);
}
function cinema(){
 // The image uses its original proportions and is bundled with the presentation.
 const ratio=eniacPhoto.naturalWidth/eniacPhoto.naturalHeight||1.5;
 const w=4.65,h=w/ratio;
 box(w+.3,h+.28,.13,ink,0,.55,0);
 const screen=mesh(new THREE.PlaneGeometry(w,h),paper,0,.55,.09);
 screen.children.forEach(c=>c.visible=false);
 if(eniacPhoto.complete&&eniacPhoto.naturalWidth){
  const tex=new THREE.Texture(eniacPhoto);tex.colorSpace=THREE.SRGBColorSpace;tex.needsUpdate=true;
  screen.material.dispose();screen.material=new THREE.MeshBasicMaterial({map:tex,color:projectionOn?0xffffff:0x191d19});
  screen.userData.photo={image:eniacPhoto,w,h};
 }
 for(const x of [-1.65,1.65]){box(.07,1.2,.08,ink,x,-1.6,-.02);box(.55,.08,.6,ink,x,-2.2,0)}
 // Small film projector in the foreground with two animated reels.
 box(.85,.5,.6,blue,1.85,-1.5,2.6);
 const lens=mesh(new THREE.CylinderGeometry(.15,.18,.34,12),gold,1.85,-1.46,2.13);lens.rotation.x=Math.PI/2;
 box(.07,.6,.07,ink,1.85,-1.95,2.6);box(.8,.08,.65,ink,1.85,-2.25,2.6);
 cinemaReels=[];
 for(const x of [1.55,2.12]){
  const reel=mesh(new THREE.CylinderGeometry(.3,.3,.08,14),paper,x,-1,2.6);reel.rotation.x=Math.PI/2;
  for(let a=0;a<5;a++){const t=a*Math.PI*2/5;mesh(new THREE.CylinderGeometry(.065,.065,.09,8),ink,Math.cos(t)*.17,.015,Math.sin(t)*.17,reel)}
  cinemaReels.push(reel);
 }
 const vertices=new Float32Array([1.85,-1.46,2.0,-w/2,.55-h/2,.12,w/2,.55-h/2,.12,1.85,-1.46,2.0,w/2,.55+h/2,.12,-w/2,.55+h/2,.12]);
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(vertices,3));geo.computeVertexNormals();
 cinemaBeam=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:0xebc462,transparent:true,opacity:.055,side:THREE.DoubleSide,depthWrite:false}));root.add(cinemaBeam);

}

/* Software crisis: a tiny hand-drawn city that grows beyond its architect.
   The mismatch is a metaphor, not a quantitative reconstruction of 1968. */
let crisisBuildings=[],crisisLinks=[],crisisSparks=[],crisisClock=0,crisisPaused=false;
const crisisBase=-1.83;
function crisisEase(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)}
function buildCrisis(){
  const slab=box(5.8,.15,5.15,0xe6e0d2,0,-1.95,0);
  slab.rotation.y=-.02;
  for(let i=-3;i<=3;i++){
    line([[-2.85,-1.85,i*.73],[2.85,-1.85,i*.73]],0xc5c0b2);
    line([[i*.83,-1.85,-2.5],[i*.83,-1.85,2.5]],0xc5c0b2);
  }
  const shades=[paper,blue,green,gold,0xe9bda7];
  for(let z=0;z<5;z++)for(let x=0;x<5;x++){
    const px=(x-2)*1.04+(random()-.5)*.16;
    const pz=(z-2)*.92+(random()-.5)*.14;
    const height=.78+Math.pow(random(),.8)*3.7+(x===2&&z===2?.65:0);
    const width=.54+random()*.16,depth=.5+random()*.2;
    const tower=box(width,height,depth,shades[(x+2*z)%shades.length],px,crisisBase+height*.07,pz);
    for(let floor=0;floor<Math.floor(height/.45);floor++){
      const yy=-height/2+.22+floor*.42;
      line([[-width*.3,yy,depth/2+.015],[width*.3,yy,depth/2+.015]],0x848b80,tower);
    }
    tower.scale.y=.14;
    crisisBuildings.push({tower,x:px,z:pz,height,delay:(x+z)*.19+random()*.42,growth:.14});
  }
  const routes=[];
  for(let i=0;i<25;i++){
    if(i%5<4)routes.push([i,i+1]);
    if(i<20&&i%2===0)routes.push([i,i+5]);
  }
  for(let i=0;i<routes.length;i++){
    const [a,b]=routes[i],geo=new THREE.BufferGeometry();
    const points=new Float32Array(12);
    geo.setAttribute('position',new THREE.BufferAttribute(points,3));
    const cable=new THREE.Line(geo,new THREE.LineBasicMaterial({color:i%4?0x8c978c:0xd8623e,transparent:true,opacity:.74}));
    cable.frustumCulled=false;
    root.add(cable);
    crisisLinks.push({a,b,cable,phase:i*1.71});
    if(i%3===0){const spark=ball(.055,orange);spark.children.forEach(o=>o.visible=false);crisisSparks.push({spark,route:i});}
  }
  // The one human keeps the same size as the skyline changes.
  const engineer=new THREE.Group();root.add(engineer);engineer.position.set(2.78,-1.7,2.22);
  mesh(new THREE.SphereGeometry(.15,12,8),paper,0,.49,0,engineer);
  mesh(new THREE.CylinderGeometry(.105,.15,.38,8),blue,0,.10,0,engineer);
  for(let side of [-1,1]){
    const arm=box(.055,.38,.065,ink,side*.16,.13,0,engineer);arm.rotation.z=side*.38;
    const leg=box(.065,.35,.065,ink,side*.085,-.23,0,engineer);leg.rotation.z=side*.1;
  }
  textSprite('the engineer',2.5,-2.2,2.3,.38);
  textSprite('capability',-1.9,3.45,-.7,.5);
  textSprite('complexity',1.9,2.3,1,.48,'#d8623e');
  animateCrisis(0,0);
}
function animateCrisis(now,dt){
  if(!crisisBuildings.length)return;
  if(reduced)crisisClock=8.8;
  else if(!crisisPaused)crisisClock=Math.min(11,crisisClock+dt);
  const growthTime=crisisClock,shake=crisisEase((growthTime-4.3)/3.5);
  crisisBuildings.forEach((b,i)=>{
    const g=.14+.86*crisisEase((growthTime-.3-b.delay)/4.5);
    b.growth=g;b.tower.scale.y=g;
    b.tower.position.y=crisisBase+b.height*g/2;
    b.tower.rotation.z=(!reduced&&!crisisPaused)?Math.sin(now*.0017+i*1.9)*.009*shake:0;
  });
  crisisLinks.forEach((edge,i)=>{
    const a=crisisBuildings[edge.a],b=crisisBuildings[edge.b];
    const ay=crisisBase+a.height*a.growth,by=crisisBase+b.height*b.growth;
    const rise=.18+shake*(.32+(i%4)*.11);
    const wave=(!reduced&&!crisisPaused)?Math.sin(now*.0018+edge.phase)*.13*shake:0;
    const p=edge.cable.geometry.attributes.position;
    p.setXYZ(0,a.x,ay,a.z);
    p.setXYZ(1,a.x*.68+b.x*.32,Math.max(ay,by)+rise+wave,a.z*.68+b.z*.32);
    p.setXYZ(2,a.x*.31+b.x*.69,Math.max(ay,by)+rise-wave,b.z*.69+a.z*.31);
    p.setXYZ(3,b.x,by,b.z);
    p.needsUpdate=true;
    edge.cable.material.opacity=.17+.62*shake;
  });
  crisisSparks.forEach(({spark,route},i)=>{
    const p=crisisLinks[route].cable.geometry.attributes.position;
    const t=((crisisClock*.19+i*.17)%1)*3;
    const j=Math.min(2,Math.floor(t)),f=t-j;
    spark.position.set(p.getX(j)*(1-f)+p.getX(j+1)*f,p.getY(j)*(1-f)+p.getY(j+1)*f,p.getZ(j)*(1-f)+p.getZ(j+1)*f);
    const size=.35+shake*(.75+.2*Math.sin(now*.003+i));
    spark.scale.setScalar(size);
    spark.visible=shake>.08;
  });
}


// Four stations, four different payloads. A teaching analogy, not flight sequencing.
let apolloClock=0,apolloPaused=false,apolloRoutes=[],apolloNodes=[],apolloPackets=[],apolloStage=-1;
const apolloSignals=[
 ['TELEMETRY','POSITION · VELOCITY','Spacecraft → mission control: state and measurements.'],
 ['INSTRUCTIONS','MISSION UPDATE','Mission control → crew: interpret the situation and update the plan.'],
 ['TOOL USE','VERB / NOUN','Crew → DSKY: enter a verb and noun to interact with the guidance computer.'],
 ['CONTROL','GUIDANCE → ACTUATION','Guidance computer → spacecraft: execute control; observe the changed state.']
];

// Block II DSKY proportions and panel hierarchy; displayed values are illustrative.
function buildDSKY(parent){
 const w=1.42,h=1.58;
 box(w,h,.24,0xa8ada6,0,0,0,parent);
 box(w-.1,h-.1,.03,0xc6c9bf,0,0,.135,parent);
 const c=document.createElement('canvas');c.width=900;c.height=1000;
 const ctx=c.getContext('2d');ctx.fillStyle='#aeb3aa';ctx.fillRect(0,0,900,1000);
 const label=(s,x,y,size=22,color='#d8dfc9')=>{ctx.fillStyle=color;ctx.font=`bold ${size}px monospace`;ctx.textAlign='center';ctx.fillText(s,x,y)};
 // Separate annunciators and electroluminescent readout, with raised surrounds.
 ctx.fillStyle='#747b73';ctx.fillRect(35,36,355,550);ctx.fillRect(410,36,455,550);
 ctx.fillStyle='#172b25';ctx.fillRect(425,51,425,520);
 const lamps=[['UPLINK','ACTY'],['TEMP'],['NO','ATT'],['GIMBAL','LOCK'],['STBY'],['PROG'],['KEY','REL'],['RESTART'],['OPR','ERR'],['TRACKER']];
 lamps.forEach((ls,i)=>{const x=49+(i%2)*169,y=53+Math.floor(i/2)*101;ctx.fillStyle=i%2?'#b2aa76':'#d1d3bf';ctx.fillRect(x,y,153,85);ls.forEach((v,j)=>label(v,x+76,y+(ls.length===1?51:33+j*29),23,'#373d35'));});
 label('COMP',490,91,20);label('ACTY',490,119,20);label('PROG',745,82);label('VERB',520,191);label('NOUN',747,191);
 const digits=(str,x,y,scale=1)=>{
 const segs={0:'ab cdef'.replaceAll(' ',''),1:'bc',2:'abdeg',3:'abcdg',4:'bcfg',5:'acdfg',6:'acdefg',7:'abc',8:'abcdefg',9:'abcdfg'};
 const paths={a:[4,0,24,4],b:[28,4,4,25],c:[28,34,4,25],d:[4,59,24,4],e:[0,34,4,25],f:[0,4,4,25],g:[4,29,24,4]};
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
 [...str].forEach((ch,i)=>{const ox=i*43;ctx.fillStyle='#9de6ad';if(ch==='+'||ch==='-'){ctx.fillRect(ox+5,29,23,4);if(ch==='+')ctx.fillRect(ox+15,19,4,24);}else for(const k of segs[ch]||''){const [a,b,w,h]=paths[k];ctx.fillRect(ox+a,b,w,h);}});ctx.restore();
 };
 digits('00',706,94,1.25);digits('16',477,205,1.25);digits('62',705,205,1.25);
 ['+00000','+00000','-00000'].forEach((v,i)=>{ctx.fillStyle='#9de6ad';ctx.fillRect(445,306+i*85,382,3);digits(v,468,320+i*85,1.18)});
 // Nineteen keys: numeric columns plus the original verb/noun and control keys.
 const rows=[['VERB','+','7','8','9','CLR',null],['NOUN','−','4','5','6','PRO','ENTR'],[null,'0','1','2','3','KEY REL','RSET']];
 rows.forEach((row,j)=>row.forEach((v,i)=>{if(!v)return;const x=31+i*121,y=650+j*105;ctx.fillStyle='#646e68';ctx.fillRect(x-3,y-3,112,94);ctx.fillStyle='#263c37';ctx.fillRect(x,y,105,85);v.split(' ').forEach((t,k,arr)=>label(t,x+52,y+(arr.length===1?53:35+k*27),v.length>3?21:32,'#edf0dc'));}));
 for(const x of [17,883])for(const y of [18,980]){ctx.fillStyle='#6b726b';ctx.beginPath();ctx.arc(x,y,8,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#dce0d3';ctx.beginPath();ctx.moveTo(x-5,y);ctx.lineTo(x+5,y);ctx.stroke();}
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
 const face=new THREE.Mesh(new THREE.PlaneGeometry(w-.14,h-.14),new THREE.MeshBasicMaterial({map:tex}));face.position.z=.158;face.userData.photo={image:c,w:w-.14,h:h-.14};parent.add(face);
}

function buildApollo(){
 apolloClock=0;apolloPaused=false;apolloStage=-1;apolloRoutes=[];apolloPackets=[];
 const station=(x,y)=>{const g=new THREE.Group();g.position.set(x,y,0);root.add(g);return g};
 const ship=station(-2.35,0),earth=station(0,1.92),crew=station(2.35,0),dsky=station(0,-1.93);apolloNodes=[ship,earth,crew,dsky];
 // Apollo CSM: engine bell, faceted service cylinder, conical command module.
 ship.rotation.z=.42;
 mesh(new THREE.CylinderGeometry(.4,.4,1.0,8),0xc3c8c5,0,0,0,ship).rotation.z=-Math.PI/2;
 mesh(new THREE.CylinderGeometry(.1,.41,.62,8),paper,.81,0,0,ship).rotation.z=-Math.PI/2;
 mesh(new THREE.CylinderGeometry(.16,.3,.4,8,1,true),ink,-.71,0,0,ship).rotation.z=-Math.PI/2;
 mesh(new THREE.CylinderGeometry(.08,.08,.2,8),0xb4b9b3,1.2,0,0,ship).rotation.z=-Math.PI/2;
 box(.15,.15,.05,ink,.79,.12,.29,ship);
 for(const y of [-.28,.28]){box(.64,.1,.08,paper,-.03,y,.31,ship);box(.15,.13,.15,gold,-.22,y*1.65,0,ship);}
 ball(.62,blue,0,0,0,earth);
 for(const [x,y,r] of [[-.19,.23,.23],[.22,.1,.18],[.13,-.25,.21],[-.35,-.08,.14]]){const land=ball(r,green,x,y,.48,earth);land.scale.z=.22;}
 // A7L-inspired silhouette: white pressure suit, gold visor, life-support pack.
 box(.66,.8,.32,0xc4c5b9,0,-.04,-.2,crew);
 mesh(new THREE.CylinderGeometry(.29,.34,.62,8),paper,0,-.12,0,crew);
 ball(.38,paper,0,.48,.03,crew);const visor=ball(.29,gold,0,.49,.23,crew);visor.scale.set(1,.78,.42);
 box(.31,.24,.09,blue,0,-.07,.32,crew);
 for(const side of [-1,1]){
 const arm=mesh(new THREE.CylinderGeometry(.12,.14,.6,7),paper,side*.4,-.12,0,crew);arm.rotation.z=side*.25;
 ball(.13,paper,side*.48,-.4,0,crew);
 mesh(new THREE.CylinderGeometry(.14,.15,.45,7),paper,side*.18,-.65,0,crew);
 box(.28,.18,.38,paper,side*.18,-.91,.09,crew);
 box(.28,.065,.035,orange,side*.18,-.63,.14,crew);
 }
 buildDSKY(dsky);
 textSprite('mission control',0,2.78,0,.34);textSprite('spacecraft',-2.35,-.85,0,.34);textSprite('crew / agent',2.35,-1.3,0,.34);textSprite('DSKY → AGC',0,-2.96,0,.3);
 const routes=[ [[-2.34,.62,0],[-2.1,1.8,0],[-.95,2.3,0]], [[.85,2.15,0],[2.05,1.85,0],[2.35,.98,0]], [[2.1,-1.05,0],[1.55,-2.12,0],[.88,-2.05,0]], [[-.87,-2.0,0],[-2.1,-1.8,0],[-2.45,-.64,0]] ];
 routes.forEach((pts,i)=>{
 const curve=new THREE.QuadraticBezierCurve3(...pts.map(p=>new THREE.Vector3(...p)));apolloRoutes.push(curve);
 line(curve.getPoints(40).map(p=>p.toArray()),[blue,gold,orange,green][i]);
 arrow(curve.getPoint(.89).toArray(),curve.getPoint(1).toArray(),ink);
 const packet=new THREE.Group();root.add(packet);
 if(i===0){for(let k=0;k<3;k++)box(.055,.09+k*.055,.06,blue,(k-1)*.09,0,0,packet);}
 if(i===1){box(.28,.2,.05,gold,0,0,0,packet);for(let k=0;k<2;k++)box(.19,.015,.01,ink,0,.04-k*.07,.04,packet);}
 if(i===2){box(.3,.18,.07,orange,0,0,0,packet);box(.045,.12,.02,paper,-.06,0,.05,packet);box(.045,.12,.02,paper,.06,0,.05,packet);}
 if(i===3){mesh(new THREE.ConeGeometry(.12,.32,4),green,0,0,0,packet).rotation.z=Math.PI/2;}
 apolloPackets.push(packet);
 });
 textSprite('telemetry',-1.85,1.6,.1,.3);textSprite('instructions',1.8,1.65,.1,.3);textSprite('tool use',1.65,-1.83,.1,.3);textSprite('change',-1.75,-1.8,.1,.3);
 textSprite('observe',0,.48,0,.32);textSprite('act · check · repeat',0,.05,0,.32);
 animateApollo(0);
}
function animateApollo(dt){
 if(!apolloPaused&&!reduced)apolloClock+=dt;
 const stage=Math.floor(apolloClock/3.6)%4,t=(apolloClock%3.6)/3.6;
 apolloPackets.forEach((p,i)=>{p.visible=reduced||i===stage;p.position.copy(apolloRoutes[i].getPoint(reduced?.5:Math.min(1,t/.83)));});
 apolloNodes.forEach((n,i)=>n.scale.setScalar(!reduced&&i===(stage+1)%4&&t>.83?1+.07*Math.sin((t-.83)/.17*Math.PI):1));
 if(stage!==apolloStage){apolloStage=stage;const el=$('apolloSignal');if(el){el.innerHTML=`<strong>${apolloSignals[stage][0]}</strong><span>${apolloSignals[stage][1]}</span><small>${apolloSignals[stage][2]}</small>`;el.dataset.stage=stage;}}
}
const apolloEvidence=`<div class="apollo-evidence"><figure><img src="assets/hamilton.jpeg" alt="Margaret Hamilton beside the Apollo flight software listings, 1969"><figcaption><strong>Margaret Hamilton &amp; team</strong><span>Executable flight software</span><code>/scripts</code><a href="https://science.nasa.gov/people/margaret-hamilton/" target="_blank" rel="noopener">MIT / NASA · 1969 ↗</a></figcaption></figure><div class="apollo-checklist"><span>FLIGHT PROCEDURE</span><b>01 &nbsp; Observe state<br>02 &nbsp; Select procedure<br>03 &nbsp; Act &amp; verify</b><code>skill.md</code><small>Illustrative checklist</small></div></div><p class="apollo-caveat">Decisions were distributed across crew, mission control, procedures and software.</p>`;
// Places: the user's annotated screenshots as pinned paper cards. HTML (like the Hamilton photo), so they stay sharp and work without WebGL.
const placesCards=`<figure class="place-card place-1"><img src="assets/sdk-agent-window.png" width="1286" height="768" alt="VS Code title bar with the Agent Window icon circled and the handwritten note Agent Window"><figcaption><b><i>1</i> · Agent Window</b><span>title bar icon in VS Code</span></figcaption></figure><figure class="place-card place-2"><img src="assets/sdk-harness-picker.png" width="443" height="292" alt="VS Code chat harness picker: Copilot is the Copilot SDK harness, Local is the original Copilot Chat, Cloud does not work in NN yet"><figcaption><b><i>2</i> · Harness picker</b><span>Copilot = SDK harness</span></figcaption></figure><figure class="place-card place-3"><img src="assets/sdk-code.png" width="858" height="768" alt="C# Program.cs using the GitHub.Copilot SDK: a CopilotClient, two agents (impl and Steve) and StartAhpHostAsync for a live view in VS Code via the experimental Agent Host Protocol"><figcaption><b><i>3</i> · Your own code</b><span>C# · GitHub.Copilot SDK</span></figcaption></figure><figure class="place-card place-4 pending"><img src="assets/sdk-copilot-app.png" width="784" height="768" alt="GitHub Copilot app README, crossed out with the handwritten note Work in progress"><figcaption><b><i>4</i> · Copilot app</b><span class="stamp">PENDING · ESB approval</span></figcaption></figure>`;
const placesBoard=document.createElement('section');placesBoard.id='places';placesBoard.setAttribute('aria-label','Four places where you meet the Copilot SDK');document.body.append(placesBoard);


/* Interactive field notes: five low-poly miniature machines, not a bullet list.
   All claims are qualitative observations, not synthetic performance benchmarks. */
const lessonBeats=[
 {title:'Context needed<br><em>a migration.</em>',desc:'Memory, preferences and user instructions lived in different places. I had to find them and adapt the setup when moving from the VS Code chat harness to the SDK.',finding:'The agent runtime is reusable. Its working context still needs migration.',tag:'MIGRATION',label:'01 / hunt, extract, reconnect',annotation:'Not a<br>free transfer.',note:'Personal lesson: memory, preferences and user instructions did not automatically carry over. I had to locate where they were stored or loaded and reconfigure their use in the SDK workflow. Avoid the earlier incorrect claim that context just worked without migration.'},
 {title:'Agents needed<br><em>clearer roles.</em>',desc:'Subagents were not simply inherited as an implicit team. I had to declare their roles and boundaries more explicitly.',finding:'Give each specialist a job, tools and a handoff contract.',tag:'DELEGATION',label:'02 / explicit contracts for subagents',annotation:'Declare the<br>crew.',note:'Define a product-owner orchestrator, architect, coder and adversarial reviewer. In the demo, distinguish actual role configuration from imagined autonomous teamwork.'},
 {title:'Copilot helped<br><em>build Copilot.</em>',desc:'A useful bootstrap: I used GitHub Copilot to write and refine the SDK workflow that would eventually invoke Copilot.',finding:'Use the harness to help engineer its own surrounding workflow.',tag:'BOOTSTRAP',label:'03 / building the machine with the machine',annotation:'A small<br>recursion.',note:'This is a real workflow-building strategy, not a claim that the agent autonomously invented or verified an entire software factory.'},
 {title:'A heartbeat is<br><em>not progress.</em>',desc:'Long-running work needs a velocity signal, a kaizen-style improvement loop and a way to distinguish activity from actual progress.',finding:'Watch liveness, progress and completion separately.',tag:'OBSERVABILITY',label:'04 / alive is not the same as advancing',annotation:'Heartbeat ≠<br>done.',note:'Track heartbeat and tool activity, but also advancing milestones, attempts, duration and evidence of completion. A session can be alive yet stuck waiting for permission or retrying without improvement.'},
 {title:'More agents?<br><em>Not always better.</em>',desc:'Each extra agent introduces a handoff, context boundary and coordination cost. A simpler loop can outperform a crowded team.',finding:'Delegate only when specialization beats orchestration overhead.',tag:'ORCHESTRATION',label:'05 / the coordination bottleneck',annotation:'More hands.<br>One bottleneck.',note:'Schematic qualitative illustration, not a performance comparison measured in this project. GitHub has publicly documented that curbing unnecessary subagent delegation can improve reliability and efficiency. Ask what independent capability the extra agent actually adds.'}
];
let lessonStep=0,lessonClock=0,lessonActors=[];
function lessonWorker(x,y,z,col=blue,scale=1){
 const g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(scale);root.add(g);
 box(.68,.65,.54,col,0,0,0,g);
 const head=mesh(new THREE.DodecahedronGeometry(.34,0),paper,0,.55,0,g);
 ball(.055,ink,-.13,.58,.3,g);ball(.055,ink,.13,.58,.3,g);
 box(.12,.4,.14,ink,-.22,-.52,0,g);box(.12,.4,.14,ink,.22,-.52,0,g);
 box(.13,.36,.15,gold,-.47,.04,0,g);box(.13,.36,.15,gold,.47,.04,0,g);
 return g;
}
function lessonPacket(a,b,color=orange,phase=0,speed=1){
 const o=ball(.11,color,...a);lessonActors.push({o,a,b,phase,speed});return o;
}
function lessonPlinth(){
 mesh(new THREE.CylinderGeometry(3.35,3.5,.20,10),0xe5ddcc,0,-1.62,0);
 mesh(new THREE.CylinderGeometry(3.24,3.34,.075,10),paper,0,-1.49,0);
 textSprite('F I E L D   N O T E S',0,-1.3,2.22,.36,'#727565');
}
function lessonDiorama(){
 lessonActors=[];lessonClock=0;lessonPlinth();
 if(lessonStep===0){
   // Two separate environments, with no magical shared context.
   // The scattered folders and interrupted lines represent manual discovery and porting.
   box(2.2,2.52,.86,blue,-1.94,.16,-.55);
   box(1.76,.38,.12,paper,-1.94,1.09,-.05);
   textSprite('VS CODE',-1.94,1.18,.16,.45);
   const folders=[['MEMORY',green,.63,-2.19,-.10],['PREFS',gold,-.12,-1.74,.07],['INSTR.',paper,-.85,-2.06,-.05]];
   folders.forEach(([label,c,y,x,z],i)=>{
     box(.97,.42,.16,c,x,y,z);
     textSprite(label,x,y+.095,z+.16,.29);
     box(.2,.09,.06,ink,x-.30,y+.25,z+.11);
   });
   // Search lens in the middle. It is intentionally larger than the artifacts.
   const lens=mesh(new THREE.TorusGeometry(.40,.07,5,10),gold,-.04,.76,.43);
   lens.rotation.z=-.26;
   const handle=box(.12,.85,.15,ink,.34,.23,.43);handle.rotation.z=-.58;
   // Reconfiguration desk and three destination slots.
   box(1.25,.17,1.20,green,.20,-1.05,.27);
   textSprite('FIND + PORT',.15,-.81,.95,.42);
   box(1.55,2.0,.90,paper,2.04,.07,-.51);
   box(1.25,.34,.14,gold,2.04,.81,.02);
   textSprite('SDK',2.04,.89,.24,.44);
   for(let i=0;i<3;i++){
     box(.99,.30,.12,[green,gold,blue][i],2.04,.36-i*.51,.03);
     box(.12,.13,.12,ink,1.68,.36-i*.51,.13);
   }
   // A broken bridge. Animated artifacts must pass through the porting workbench.
   line([[-.93,.20,.18],[-.51,.20,.18]],orange);
   line([[.56,-.26,.18],[1.22,-.26,.18]],orange);
   for(let i=0;i<3;i++){
     const y=.57-i*.50;
     const doc=box(.30,.27,.07,[green,gold,orange][i],-1.0,y,.54);
     lessonActors.push({o:doc,a:[-1.10,y,.54],b:[1.55,-.02-i*.22,.54],phase:i*.30,speed:.115,manual:true});
   }
   textSprite('HUNT  →  EXTRACT  →  REWIRE',0,1.91,.05,.43);
 }
 if(lessonStep===1){
   mesh(new THREE.CylinderGeometry(.72,.82,.56,6),gold,0,.05,0);
   textSprite('PO / ORCH',0,.24,.62,.37);
   const pods=[[-2.0,.91,'ARCH',blue], [2,.91,'CODER',green],[0,-1.12,'REVIEW',orange]];
   pods.forEach(([x,y,label,col],i)=>{
     const p=box(1.22,.62,.82,col,x,y,0);p.rotation.y=(i-1)*.12;
     textSprite(label,x,y+.13,.54,.4);
     const mid=[x*.58,y*.58,.08];
     line([[x*.3,y*.3,.1],mid,[x*.73,y*.73,.1]],0x7a8275);
     lessonPacket([x*.40,y*.4,.18],[x*.82,y*.82,.18],i===2?orange:gold,i*.24,.22);
   });
   textSprite('named roles · bounded handoffs',0,1.8,.1,.48);
 }
 if(lessonStep===2){
   box(5.15,.28,1.55,green,0,-1.13,0);
   lessonWorker(-2.03,-.18,0,blue,1.15);
   const armBase=new THREE.Group();armBase.position.set(-.63,-.9,0);root.add(armBase);
   box(.32,.9,.33,ink,0,.45,0,armBase);
   const joint=ball(.30,gold,0,1.06,0,armBase);
   const upper=box(.24,1.65,.24,blue,.73,1.55,0,armBase);upper.rotation.z=-.83;
   ball(.23,ink,1.39,1.94,0,armBase);
   const lower=box(.20,1.20,.20,gold,1.66,1.49,0,armBase);lower.rotation.z=.49;
   line([[1.98,1.1,0],[2.1,.78,0]],ink);
   const work=box(1.5,.95,.95,paper,1.9,-.52,0);
   box(1.15,.12,.80,blue,1.9,.07,0);
   textSprite('SDK',1.9,-.25,.62,.50);
   for(let j=0;j<3;j++)box(.2,.25,.2,[green,blue,gold][j],1.46+j*.43,.2,0);
   textSprite('agent builds the scaffold',0,1.95,.1,.53);
   lessonPacket([-.7,.14,.55],[1.45,.20,.55],orange,.1,.25);
 }
 if(lessonStep===3){
   const ring=[];for(let i=0;i<=60;i++){const t=i/60*Math.PI*2;ring.push([Math.cos(t)*2.05,Math.sin(t)*1.18+.25,.05])}line(ring,0x8c9180);
   const server=box(1.18,1.47,.9,blue,0,.25,-.16);
   for(let k=0;k<3;k++){box(.75,.13,.12,k===0?green:k===1?gold:paper,0,.72-k*.37,.35)}
   const liveness=ball(.13,green,.39,1.05,.45);lessonActors.push({o:liveness,pulse:true});
   const pulse=lessonPacket([2.05,.25,.2],[-2.05,.25,.2],orange,0,.25);lessonActors[lessonActors.length-1].orbit=true;
   textSprite('ALIVE',-2.25,1.65,0,.49);
   textSprite('PROGRESS',2.15,1.65,0,.48);
   line([[-2.8,-.7,.45],[-2.05,-.7,.45],[-1.85,-.48,.45],[-1.55,-1.0,.45],[-1.3,-.7,.45],[-.55,-.7,.45],[.2,-.7,.45],[.9,-.7,.45],[1.55,-.7,.45],[2.65,-.7,.45]],orange);
   textSprite('a pulse is not a milestone',0,-1.17,.72,.43);
 }
 if(lessonStep===4){
   // The upper lane has a single well-routed worker. Below, a crowd waits on one gate.
   box(5.9,.13,.82,green,0,.70,-.6);
   box(5.9,.13,.82,blue,0,-.88,.55);
   lessonWorker(-1.65,1.14,-.6,green,.50);
   for(let i=0;i<5;i++)lessonWorker(-2.25+i*.78,-.43,.55,i%2?blue:gold,.42);
   const gateTop=box(.19,.95,.70,ink,2.08,1.17,-.6);
   const gateBottom=box(.19,.95,.70,ink,2.08,-.38,.55);
   box(.65,.22,.65,green,2.75,.75,-.6);
   box(.65,.22,.65,orange,2.75,-.84,.55);
   textSprite('ONE CLEAR HANDOFF',0,2.08,-.6,.43);
   textSprite('FIVE AGENTS · ONE GATE',0,-1.62,.95,.43);
   lessonPacket([-2.8,.9,-.2],[2.73,.9,-.2],green,0,.18);
   for(let i=0;i<5;i++){
     const p=lessonPacket([-2.7+i*.55,-.7,.95],[1.72,-.7,.95],i%2?gold:orange,i*.15,.20);
     lessonActors[lessonActors.length-1].queue=true;
   }
 }
 root.rotation.y=-.28;
}
function animateLessons(dt){
 if(reduced||slides[index].scene!=='lessons')return;
 lessonClock+=dt;
 for(const a of lessonActors){
   if(a.pulse){const s=1+.30*Math.sin(lessonClock*3.2);a.o.scale.setScalar(s);continue}
   if(a.orbit){const t=lessonClock*.42; a.o.position.set(2.05*Math.cos(t),.25+1.18*Math.sin(t),.24);continue}
   let t=(lessonClock*a.speed+a.phase)%1;
   if(a.queue)t=Math.min(t*.95,.75);
   if(a.manual){
     // Staged journey: pause at the magnifier and porting bench.
     const eased=t<.35?(t/.35)*.38:t<.49?.38:t<.90?.38+(t-.49)/.41*.62:1;
     a.o.position.set(a.a[0]+(a.b[0]-a.a[0])*eased,a.a[1]+(a.b[1]-a.a[1])*eased+Math.sin(t*Math.PI)*.22,a.a[2]+(a.b[2]-a.a[2])*eased);
     continue;
   }
   const ease=t*t*(3-2*t);
   a.o.position.set(a.a[0]+(a.b[0]-a.a[0])*ease,a.a[1]+(a.b[1]-a.a[1])*ease+.08*Math.sin(t*Math.PI),a.a[2]+(a.b[2]-a.a[2])*ease);
 }
}
function showLesson(n){
 if(slides[index].scene!=='lessons')return;
 lessonStep=Math.max(0,Math.min(lessonBeats.length-1,n));
 const b=lessonBeats[lessonStep];
 $('eyebrow').textContent=slides[index].tag.split(' / ')[0]+' / FROM VS CODE TO SDK · '+String(lessonStep+1).padStart(2,'0')+' / 05';
 $('title').innerHTML=b.title;$('description').textContent=b.desc;
 $('trade').innerHTML='<div class="lesson-takeaway"><span>LESSON LEARNED</span><p></p></div><div class="lesson-progress" aria-label="Lesson progression"></div>';
 $('trade').querySelector('p').textContent=b.finding;
 const progress=$('trade').querySelector('.lesson-progress');
 lessonBeats.forEach((x,i)=>{const control=document.createElement('button');control.type='button';control.textContent=String(i+1).padStart(2,'0');control.setAttribute('aria-label','Show lesson '+(i+1)+': '+x.tag);control.setAttribute('aria-pressed',i===lessonStep?'true':'false');control.className=i===lessonStep?'on':'';control.title=x.tag;control.onclick=()=>showLesson(i);progress.append(control)});
 $('annotation').innerHTML=b.annotation;
 $('drawingTitle').textContent=b.label;
 $('noteText').textContent=b.note;
 $('interactive').replaceChildren();
 const prev=button('← Previous',()=>showLesson(lessonStep-1));prev.disabled=lessonStep===0;
 const next=button('Next lesson →',()=>showLesson(lessonStep+1),true);next.disabled=lessonStep===lessonBeats.length-1;
 $('next').disabled=index===slides.length-1&&lessonStep===lessonBeats.length-1;
 if(index===slides.length-1){button('Back to the staircase ↺',()=>go(0),true);button('Open chapter map',()=>showMap())}
 build('lessons');
}
let powerClock=0,powerBolts=[],powerScreens=[],powerGhost=null;
const powerLoop=52.8,powerInletPeriod=1.6,powerOutletPeriod=2.2;
function buildPowerStrip(){
 powerClock=0;powerBolts=[];powerScreens=[];
 const outer=root,stage=new THREE.Group();stage.scale.setScalar(.86);stage.position.set(-.75,.05,0);outer.add(stage);root=stage;
 const curve=pts=>new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p)),false,'centripetal');
 const cable=(pts,radius,color,opacity=1,dashed=false)=>{
  const path=curve(pts);
  if(dashed){const geo=new THREE.BufferGeometry().setFromPoints(path.getPoints(72));const mat=new THREE.LineDashedMaterial({color,dashSize:.14,gapSize:.12,transparent:true,opacity});const wire=new THREE.Line(geo,mat);wire.computeLineDistances();root.add(wire);}
  else{const geo=new THREE.TubeGeometry(path,42,radius,5,false);root.add(new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color,roughness:.96,flatShading:true,transparent:opacity<1,opacity})));}
  return path;
 };
 const bolt=()=>{const group=new THREE.Group(),shape=new THREE.Shape();shape.moveTo(-.075,.17);shape.lineTo(.11,.17);shape.lineTo(.015,-.005);shape.lineTo(.095,-.005);shape.lineTo(-.12,-.19);shape.lineTo(-.045,-.045);shape.lineTo(-.14,-.045);shape.closePath();const body=mesh(new THREE.ExtrudeGeometry(shape,{depth:.07,steps:1,bevelEnabled:false}),gold,0,0,.04,group);body.material.emissive.setHex(0x765417);body.material.emissiveIntensity=.85;const spark=ball(.06,gold,.045,.15,.1,group);spark.material.emissive.setHex(0x8c6720);spark.material.emissiveIntensity=.75;group.scale.setScalar(1.3);root.add(group);return group;};
 const badge=(label,y,color)=>{box(1.2,.3,.36,color,-3.12,y,0);textSprite(label,-3.12,y-.03,.24,.36,ink)};
 badge('scripts',.41,gold);badge('files',.73,green);badge('terminal',1.05,blue);
 box(1.28,.9,.42,0xb6b8aa,-3.12,-.2,0);
 box(1.12,.66,.035,paper,-3.12,-.19,.23);
 box(1.01,.53,.025,ink,-3.12,-.18,.255);
 box(1.01,.075,.025,blue,-3.12,.055,.275);
 for(let i=0;i<4;i++){const code=box(.28+(i%2)*.12,.035,.018,[green,gold,blue,paper][i],-3.4+(i%2)*.1,-.08-i*.1,.29);code.rotation.z=i%2?-.08:.03;}
 textSprite('Copilot CLI',-3.12,-.98,.12,.38);
 textSprite('AGENT RUNTIME',-3.12,-1.27,.12,.28,'#74766b');
 const inlet=cable([[-2.48,-.2,.28],[-2.02,-.18,.34],[-1.45,.02,.34],[-.88,.02,.34]],.105,0x727c70);
 box(.86,2.9,.35,0xb7c4b8,-.45,0,0);
 box(.75,2.78,.045,paper,-.45,0,.2);
 box(.52,.12,.025,ink,-.45,1.24,.24);
 textSprite('GitHub Copilot SDK',-.45,1.66,.25,.32);
 const ys=[1.02,.34,-.34,-1.02];
 ys.forEach((y,i)=>{
  mesh(new THREE.CircleGeometry(.2,8),0x454c42,-.45,y,.235,root);
  box(.035,.09,.018,gold,-.51,y,.255);
  box(.035,.09,.018,gold,-.39,y,.255);
  const colors=[blue,gold,green,0x9a9b91];
  const plug=new THREE.Group();plug.position.set(-.26,y,.28);root.add(plug);
  box(.34,.2,.17,colors[i],.16,0,0,plug);
  box(.06,.065,.065,0xe7e2d4,.34,.055,.015,plug);
  box(.06,.065,.065,0xe7e2d4,.34,-.055,.015,plug);
  if(i===3)plug.traverse(o=>{if(o.material){o.material.transparent=true;o.material.opacity=o.isLineSegments?1:.7;o.material.depthWrite=false}});
 });
 box(1.42,.76,.2,paper,2.25,1.95,0);
 const programScreen=box(1.28,.59,.035,ink,2.25,1.95,.12);
 box(1.28,.075,.02,blue,2.25,2.205,.15);
 for(let i=0;i<4;i++)box(.36+(i%2)*.13,.035,.018,[green,gold,blue,paper][i],1.88+(i%2)*.09,2.07-i*.1,.17);
 textSprite('Your program',2.25,1.4,.2,.36);
 textSprite('C# · Python',2.25,1.15,.2,.3,'#74766b');
 const monitor=box(1.38,.77,.2,0x777e70,2.25,.35,0);
 const monitorScreen=box(1.23,.6,.035,0x28352f,2.25,.37,.12);
 box(1.38,.09,.24,ink,2.25,-.09,0);box(.13,.25,.1,ink,2.25,-.25,0);
 box(.55,.075,.28,ink,2.25,-.41,0);
 for(let i=0;i<3;i++)box(.57-i*.1,.035,.015,[blue,gold,green][i],2.08,.52-i*.12,.15);
 textSprite('VS Code Agent',2.25,-.62,.2,.36);
 const app=box(.98,.68,.19,ink,2.25,-1.36,0);
 const appScreen=box(.84,.53,.035,paper,2.25,-1.36,.115);
 box(.19,.19,.025,green,2.25,-1.36,.14);
 box(.07,.07,.02,gold,2.25,-1.36,.16);
 textSprite('Copilot App',2.25,-1.92,.2,.36);
 powerScreens=[{material:programScreen.material,base:programScreen.material.color.clone(),glow:new THREE.Color(0xe2d6a5),route:0},{material:monitorScreen.material,base:monitorScreen.material.color.clone(),glow:new THREE.Color(0xbfd5dc),route:1},{material:appScreen.material,base:appScreen.material.color.clone(),glow:new THREE.Color(0xc3d1ad),route:2}];
 const outputs=[
  cable([[.22,1.02,.37],[.62,1.1,.3],[1.02,1.68,.22],[1.53,1.95,.16]],.047,0x8ca7a9),
  cable([[.22,.34,.37],[.64,.21,.3],[1.04,.43,.22],[1.55,.35,.16]],.047,0xb79a4d),
  cable([[.22,-.34,.37],[.62,-.68,.3],[1.05,-1.33,.22],[1.76,-1.36,.16]],.047,0x9aa985)
 ];
 cable([[.22,-1.02,.37],[.5,-1.3,.3],[.72,-1.52,.24],[.9,-1.62,.2]],.035,0x6f7268,.85,true);
 [.25,.75].forEach(phase=>powerBolts.push({route:inlet,object:bolt(),period:powerInletPeriod,phase,screen:-1}));
 outputs.forEach((route,i)=>[.3,.8].forEach(phase=>powerBolts.push({route,object:bolt(),period:powerOutletPeriod,phase:phase+i*.17,screen:i})));
 const flicker=ball(.075,gold,-.53,ys[3],.34);flicker.material.emissive.setHex(0x765417);flicker.material.emissiveIntensity=.7;flicker.material.transparent=true;flicker.material.opacity=.5;powerGhost=flicker.material;
 const person=new THREE.Group();person.position.set(3.55,-.04,0);root.add(person);
 mesh(new THREE.SphereGeometry(.17,8,6),paper,0,.57,0,person);
 mesh(new THREE.CylinderGeometry(.11,.15,.43,7),blue,0,.22,0,person);
 for(const side of [-1,1]){const arm=box(.075,.36,.08,ink,side*.18,.24,0,person);arm.rotation.z=side*.28;const leg=box(.09,.42,.1,ink,side*.08,-.2,0,person);leg.rotation.z=side*.08;box(.2,.07,.17,paper,side*.08,-.43,.04,person);}
 textSprite('your idea here?',.7,-1.92,.32,.38);
 root=outer;root.position.x=.6;
 animatePowerStrip(0,0);
}
function animatePowerStrip(now,dt){
 if(!powerBolts.length)return;
 if(!reduced)powerClock=(powerClock+Math.max(0,dt))%powerLoop;
 const pulses=[0,0,0];
 powerBolts.forEach((b,i)=>{
  const t=reduced?.3+(b.phase%1)*.5:(powerClock/b.period+b.phase)%1;
  b.object.position.copy(b.route.getPointAt(t));b.object.position.z+=.12;
  b.object.rotation.set(reduced?0:Math.sin(now*.0017+i)*.11,reduced?0:Math.cos(now*.0015+i)*.12,reduced?0:Math.sin(now*.002+i*1.7)*.12);
  if(b.screen>=0&&!reduced)pulses[b.screen]=Math.max(pulses[b.screen],t>.88?(t-.88)/.12:t<.1?1-t/.1:0);
 });
 powerScreens.forEach(s=>{const pulse=pulses[s.route];s.material.color.copy(s.base).lerp(s.glow,pulse*.65);s.material.emissive.setHex(0x304027);s.material.emissiveIntensity=.04+pulse*.72;});
 if(powerGhost)powerGhost.opacity=reduced?.5:.3+Math.max(0,Math.sin(now*.0018+1.1))**2*.5;
}


// Scene 10: three genuinely different implementation paths, all leading to agentic work.
// Paths are conceptual, not a feature-for-feature comparison or a benchmark.
let sdkClock=0,sdkPaused=false,sdkSelected=-1,sdkTokens=[],sdkStages=[];
function buildSdkPaths(){
 sdkClock=0;sdkPaused=false;sdkSelected=-1;sdkTokens=[];sdkStages=[];
 const xs=[-2.36,0,2.36],cs=[blue,gold,green];
 const names=['DIY · LLM API','SCRIPT · CLI','AGENT · SDK'];
 const foot=['own the loop','parse + orchestrate','reuse the harness'];
 for(let i=0;i<3;i++){
  const x=xs[i],stage=box(2.07,.15,3.45,0xe8e2d5,x,-1.77,0);
  stage.rotation.y=(i-1)*.015;sdkStages.push(stage);
  box(1.91,.075,.11,cs[i],x,-1.66,1.61);
  textSprite(names[i],x,2.0,0,.39);
  textSprite(foot[i],x,-2.22,.65,.34,'#626960');
  line([[x-1,-1.67,-1.67],[x+1,-1.67,-1.67]],ink);
  let curve;
  if(i===0){
   box(.74,.65,.64,blue,x-.49,-.93,-.93);
   ball(.27,paper,x-.49,-.45,-.93);
   textSprite('model',x-.49,-.12,-.85,.26);
   box(.65,.44,.62,paper,x+.5,-1.02,-.93);
   box(.65,.44,.62,green,x+.5,-.37,-.93);
   textSprite('tools',x+.5,-.07,-.83,.26);
   for(let j=0;j<4;j++){const y=-.86+j*.4;line([[x-.1,y,-.75],[x+.12,y+.13,-.75]],0xb9785c);}
   box(1.48,.19,.82,0xdfd5c3,x,-1.38,.5);
   for(let j=0;j<4;j++)box(.2,.055,.31,ink,x-.51+j*.34,-1.24,.65);
   textSprite('your loop',x,-1.02,1.13,.33);
   curve=new THREE.CatmullRomCurve3([[x-.5,-.47,-.65],[x+.51,-.35,-.65],[x+.5,-1.1,.12],[x-.55,-1.2,.5],[x-.5,-.47,-.65]].map(v=>new THREE.Vector3(...v)),true);
  }else if(i===1){
   const terminal=box(1.47,1.05,.37,ink,x,-.51,-.82);
   box(1.29,.83,.052,0xdce8e1,x,-.48,-.598);
   textSprite('copilot -p',x,-.49,-.51,.28,'#334036');
   box(1.15,.17,.65,paper,x,-1.24,-.65);
   for(let j=0;j<4;j++)box(.15,.038,.19,ink,x-.38+j*.25,-1.13,-.46);
   box(1.22,.13,.66,gold,x,-1.46,.69);
   textSprite('JSONL output',x,-1.17,1.15,.29);
   for(let j=0;j<3;j++)box(.1,.09,.17,[blue,orange,green][j],x-.36+j*.36,-1.34,1.01);
   curve=new THREE.CatmullRomCurve3([[x,-.31,-.48],[x+.66,-.4,-.12],[x+.66,-1.35,.55],[x,-1.27,1.04],[x,-.31,-.48]].map(v=>new THREE.Vector3(...v)),true);
  }else{
   box(1.52,.28,.82,0xdad5c7,x,-1.47,.72);
   textSprite('runtime',x,-1.18,1.23,.28);
   ['Copilot','Claude','Codex'].forEach((n,j)=>{
    const y=-1.0+j*.66;
    box(1.37,.42,.76,[green,blue,gold][j],x,y,-.58);
    box(.11,.12,.17,orange,x-.51,y+.04,-.14);
    textSprite(n,x+.12,y+.05,-.09,.28);
   });
   curve=new THREE.CatmullRomCurve3([[x,-.99,-.02],[x+.55,-.5,.3],[x+.24,-1.35,.85],[x-.55,-.25,.18],[x,-.99,-.02]].map(v=>new THREE.Vector3(...v)),true);
  }
  const route=curve.getPoints(55).map(p=>p.toArray());
  line(route,cs[i]);
  const token=ball(.11,orange);token.children.forEach(e=>e.visible=false);
  sdkTokens.push({token,curve,i});
  const result=box(.46,.46,.46,cs[i],x,1.08,.08);result.rotation.y=Math.PI/4;
  textSprite('agent',x,1.48,.6,.30);
 }
}
function selectSdkPath(i){sdkSelected=i;sdkClock=0;}
function animateSdkPaths(dt){
 if(!reduced&&!sdkPaused)sdkClock+=dt;
 sdkTokens.forEach(({token,curve,i})=>{
  const u=reduced?.45:((sdkClock*.15+i*.28)%1);
  token.position.copy(curve.getPointAt(u));token.position.y+=.13;
  token.scale.setScalar(sdkSelected<0||sdkSelected===i?1.2:.58);
 });
 sdkStages.forEach((stage,i)=>{
  const chosen=sdkSelected<0||sdkSelected===i;
  stage.material.color.setHex(chosen?0xe8e2d5:0xd6d2ca);
  stage.position.y=-1.77+(chosen&&!reduced?Math.sin(sdkClock*1.1+i)*.015:0);
 });
}

// Scene 11: a rigid policy/state-machine controller beside exploratory agent work.
// Green means a policy test admitted a proposed transition, NOT the answer was correct.
let boundaryClock=0,boundaryPaused=false,boundaryBlocked=false,boundaryPacket=null,boundaryGate=[],boundaryNodes=[],boundaryRoute=null;
function buildBoundaries(){
 boundaryClock=0;boundaryPaused=false;boundaryBlocked=false;boundaryGate=[];boundaryNodes=[];
 // Deterministic controller, shaped as a clockwork machine.
 box(2.55,.15,3.17,0xe0e7df,-2.25,-1.85,0);
 const wall=box(2.25,2.23,.22,blue,-2.25,-.42,-.84);
 box(2.35,.16,.48,ink,-2.25,-1.5,-.7);
 textSprite('STATE MACHINE',-2.25,1.55,-.7,.38);
 const nodes=[[-2.76,.08,'READY'],[-1.73,.08,'RUN'],[-2.76,-.91,'VERIFY'],[-1.73,-.91,'DONE']];
 nodes.forEach(([x,y,name],i)=>{
  const tile=box(.86,.6,.12,[paper,gold,green,paper][i],x,y,-.65);
  textSprite(name,x,y+.1,-.47,.25);
  boundaryNodes.push(tile);
 });
 line([[-2.35,.14,-.42],[-2.13,.14,-.42]],ink);
 line([[-1.67,-.24,-.42],[-1.67,-.53,-.42]],ink);
 line([[-2.12,-.9,-.42],[-2.37,-.9,-.42]],ink);
 // Three enforceable constraint tokens: policy, cost, attempts.
 ['TOOLS','BUDGET','RETRIES'].forEach((name,i)=>{
  const x=-3.08+i*.83;
  box(.72,.36,.67,[green,gold,orange][i],x,-1.48,.83);
  textSprite(name,x,-1.17,1.24,.26);
 });
 // Guarded crossing at x ~= 0, between agent proposal and host state.
 box(1.04,.16,1.48,0xe3e0d7,0,-1.84,.09);
 for(let x of [-.46,.46])box(.18,2.08,.24,ink,x,-.66,.04);
 box(1.15,.2,.33,ink,0,.43,.04);
 const light=box(.48,.46,.14,green,0,.03,.26);
 boundaryGate.push(light);
 textSprite('POLICY',0,.94,0,.42);
 textSprite('gate',0,-1.98,1.1,.32);
 // Agent landscape: paths diverge; all tool requests still cross the same gate.
 box(2.53,.15,3.18,0xe9dfcf,2.22,-1.85,0);
 textSprite('AGENT',2.2,1.55,-.45,.46);
 const coords=[];
 for(let i=0;i<14;i++){
  const phi=i*2.399963;
  const r=.32+Math.sqrt(i/14)*.92;
  const x=2.2+Math.cos(phi)*r;
  const y=-.39+Math.sin(phi)*r*.86;
  const z=-.45+(i%3)*.25;
  const b=ball(i%4===0?.19:.13,i%3?gold:orange,x,y,z);
  boundaryNodes.push(b);
  coords.push([x,y,z]);
  if(i>0&&i%4!==0)line([coords[Math.max(0,i-1)],coords[i]],0xb88e69);
 }
 ball(.31,gold,2.22,-.35,.12);
 textSprite('propose',2.28,-1.34,1.2,.33);
 // A proposal travels to the policy gate; the deterministic host decides.
 boundaryRoute=new THREE.CatmullRomCurve3([[2.18,-.33,.55],[1.23,-.15,.72],[.32,-.25,.65],[-.5,-.32,.73],[-1.4,-.6,.86]].map(v=>new THREE.Vector3(...v)));
 line([[2.18,-.33,.55],[1.23,-.15,.72],[.32,-.25,.65],[-.5,-.32,.73],[-1.4,-.6,.86]],0x9eab8f);
 boundaryPacket=ball(.15,orange);boundaryPacket.children.forEach(o=>o.visible=false);
}
function setBoundaryBlocked(v){boundaryBlocked=!!v;boundaryClock=0;}
function boundaryStatus(){
 if(boundaryBlocked)return 'DENIED · over budget. No state transition.';
 return 'ADMITTED · transition allowed. Result still needs verification.';
}
function animateBoundaries(dt){
 if(!reduced&&!boundaryPaused)boundaryClock+=dt;
 const phase=reduced?.78:(boundaryClock*.17)%1;
 const at=boundaryBlocked?(phase<.6?phase/.6*.49:.49-(phase-.6)/.4*.49):phase;
 boundaryPacket.position.copy(boundaryRoute.getPointAt(Math.max(0,Math.min(1,at))));
 boundaryPacket.scale.setScalar(1+(reduced?0:Math.sin(boundaryClock*5)*.12));
 boundaryGate.forEach(o=>o.material.color.setHex(boundaryBlocked?0xc86451:0xc3d1ad));
 boundaryNodes.forEach((o,i)=>{if(i>=4&&!reduced)o.position.y+=Math.sin(boundaryClock*.6+i*1.7)*.00045;});
}

let wardleyScene=null;
function build(type){if(!scene)return;wardleyScene=null;if(root){scene.remove(root);root.traverse(o=>{o.geometry?.dispose();if(o.material){o.material.map?.dispose();o.material.dispose()}})}root=new THREE.Group();scene.add(root);objects=[];escalatorSteps=[];cinemaReels=[];cinemaBeam=null;rng=19;spin=targetSpin=0;tilt=targetTilt=0;transition=0;sim=0;auto=false;
if(type==='stairs')stairs();
if(type==='eniac')cinema();
if(type==='crisis'){crisisBuildings=[];crisisLinks=[];crisisSparks=[];crisisClock=0;crisisPaused=false;buildCrisis();}
if(type==='compiler'){platform();for(let i=0;i<3;i++){box(2.8,.18,1.8,[blue,gold,paper][i],0,i*.9-.8,0);textSprite(['0101 1100 0010','COMPILE','DO I = 1, N'][i],0,i*.9-.5,1,.5)}arrow([1.9,1.1,0],[1.9,-.8,0],orange)}
if(type==='iceberg'){mesh(new THREE.ConeGeometry(1,1.8,5),paper,0,.65,0);const low=mesh(new THREE.ConeGeometry(2.1,3.3,6),blue,0,-1.8,0);low.rotation.z=Math.PI;const water=mesh(new THREE.CircleGeometry(3.5,60),blue,0,-.2,0);water.rotation.x=-Math.PI/2;water.material.transparent=true;water.material.opacity=.35;water.material.depthWrite=false;textSprite('the interface',1.65,1.15,0,.38);textSprite('the system',1.65,-1.5,1,.4);line([[-3,-.18,.5],[-2,-.12,.5],[-1,-.22,.5],[0,-.13,.5],[1,-.23,.5],[2,-.12,.5],[3,-.18,.5]])}
if(type==='apollo')buildApollo();
if(type==='powerstrip')buildPowerStrip();
if(type==='layers'){for(let i=0;i<3;i++){const b=box(3.2,.5,2,[blue,green,gold][i],(i-1)*.25,(i-1)*1.05,0);b.rotation.y=(i-1)*.08;textSprite(['memory / GC','objects / boundaries','RPC / networks'][i],0,(i-1)*1.05+.1,1.2,.42)}arrow([2.3,-1,0],[2.3,1.5,0],orange)}
if(type==='brain'){for(let i=0;i<20;i++){const a=i*2.39996;const yy=1-2*i/20;const r=Math.sqrt(1-yy*yy);const pos=[r*Math.cos(a)*1.6,yy*1.5,r*Math.sin(a)*1.3];objects.push(ball(.24,i%3?blue:gold,...pos));if(i>0)line([[0,0,0],pos],0x999e8c)}ball(.7,paper);textSprite('“make this work”',0,2.2,0,.6)}
if(type==='harness'){ball(.72,gold,0,0,0);textSprite('model',0,.05,1,.45);['context','tools','permissions','feedback'].forEach((t,i)=>{let a=i*Math.PI/2;let x=Math.cos(a)*2.1,y=Math.sin(a)*1.6;box(1.25,.65,.6,[blue,green,paper,orange][i],x,y,0);textSprite(t,x,y+.12,.5,.36);arrow([x*.65,y*.65,0],[x*.42,y*.42,0])});const pts=[];for(let i=0;i<=80;i++){const a=i/80*Math.PI*2;pts.push([Math.cos(a)*2.65,Math.sin(a)*2.05,-.4])}line(pts,0xaaa78d);objects.push(ball(.13,orange,2.65,0,-.4))}
if(type==='sdk'||type==='architecture'){const names=type==='sdk'?['your app','SDK','CLI runtime']:['C# / MAF','Copilot SDK','CLI runtime'];for(let i=0;i<3;i++){const x=(i-1)*1.9;box(1.5,1.15,1,[paper,gold,blue][i],x,0,0);textSprite(names[i],x,.1,.7,.38);if(i<2)arrow([x+.8,0,0],[x+1.08,0,0])}textSprite('JSON-RPC',1,1.05,0,.35);if(type==='architecture'){box(2.1,.6,.7,green,-1,1.8,0);textSprite('VS Code → Agent Host',-1,1.9,.55,.39);arrow([-.3,1.45,0],[0,.8,0])}}
if(type==='workflow'){const points=[[-2,1,0],[.4,1,0],[2,-.7,0],[-1,-1.1,0]];['assign','agent','check','accept / repair'].forEach((t,i)=>{const b=box(1.55,.7,.8,[paper,blue,gold,green][i],...points[i]);objects.push(b);textSprite(t,points[i][0],points[i][1]+.12,.65,.38);if(i)arrow(points[i-1].map((v,k)=>v+(k===2?-.5:0)),points[i].map((v,k)=>v+(k===2?-.5:0)),0xa1a491)});arrow([-1,-.8,-.5],[-2,.5,-.5],orange)}
if(type==='lessons')lessonDiorama();
if(type==='sdkpaths')buildSdkPaths();
if(type==='boundaries')buildBoundaries();
if(type==='wardley')wardleyScene=createWardley({THREE,root,box,mesh,line,ball,textSprite,reduced,ink,paper,blue,green,gold,orange});
if(type==='ideas'){platform();for(let i=0;i<3;i++){const x=(i-1)*1.7;box(1.3,1.6,.8,[blue,gold,green][i],x,0,0);mesh(new THREE.ConeGeometry(.95,.6,4),paper,x,1.1,0).rotation.y=Math.PI/4;textSprite(['repo review','repair loop','UI testing'][i],x,-1.1,.6,.35)}}
if(type==='factory'){for(let i=0;i<3;i++){const x=(i-1)*2.1;box(1.6,1+i*.35,1.4,[paper,blue,gold][i],x,-.5+i*.17,0);for(let j=0;j<3;j++)box(.2,.3,.05,ink,x-.45+j*.45,-.35,.73);box(.3,.9,.3,paper,x+.45,.7+i*.35,-.3);textSprite(['custom','product','utility?'][i],x,-1.4,.5,.4);if(i<2)arrow([x+.9,0,0],[x+1.2,0,0])}textSprite('evolution →',0,2,0,.55)}
root.rotation.y=-.28;}
function toast(s){$('toast').textContent=s;$('toast').style.opacity=1;setTimeout(()=>$('toast').style.opacity=0,2400)}
function button(label,fn,primary=false){const b=document.createElement('button');b.textContent=label;if(primary)b.className='primary';b.onclick=fn;$('interactive').append(b);return b}
const wardleyThesis='<div class="wardley-thesis"><strong>MY PREDICTION</strong><p>We may soon buy the factory instead of building it.</p><small>Products first. Commodities, perhaps later.</small></div>';
const crisisQuotation='<figure class="crisis-quote"><blockquote>“the major cause is... that the machines have become several orders of magnitude more powerful!”</blockquote><figcaption>EDSGER W. DIJKSTRA · <a href="https://www.cs.utexas.edu/~EWD/transcriptions/EWD03xx/!SV-EWD340.html" target="_blank" rel="noopener">THE HUMBLE PROGRAMMER</a> · 1972</figcaption></figure>';
function update(){const s=slides[index];document.body.dataset.scene=s.scene;escalatorPaused=false;projectionOn=true;$('eyebrow').textContent=s.tag;$('title').innerHTML=s.title;$('description').textContent=s.desc;$('trade').innerHTML=s.scene==='apollo'?apolloEvidence:s.scene==='crisis'?crisisQuotation:s.scene==='wardley'?wardleyThesis:s.gain?`<div class="tradeRow"><strong>We delegated</strong><span>${s.gain}</span></div><div class="tradeRow"><strong>We paid with</strong><span>${s.cost}</span></div>`:'';placesBoard.innerHTML=s.scene==='places'?placesCards:'';$('drawingTitle').textContent=s.label;$('annotation').innerHTML=s.annotation;$('count').textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');$('section').textContent=s.section;$('noteText').textContent=s.note;$('prev').disabled=index===0;$('next').disabled=index===slides.length-1;$('interactive').replaceChildren();$('progress').querySelectorAll('button').forEach((b,i)=>{b.className=i===index?'active':i<index?'past':'';b.setAttribute('aria-current',i===index?'step':'false')});$('chapters').querySelectorAll('button').forEach((b,i)=>b.classList.toggle('active',i===index));build(s.scene);if(index===0){button('Begin the climb ↗',()=>go(1),true);const pause=button(reduced?'Motion reduced':'Pause escalator',()=>{escalatorPaused=!escalatorPaused;pause.textContent=escalatorPaused?'Resume escalator':'Pause escalator'});pause.disabled=reduced;}if(index===1){const lamp=button('Pause projector',()=>{projectionOn=!projectionOn;lamp.textContent=projectionOn?'Pause projector':'Start projector';},true);}if(s.scene==='crisis'){const pause=button(reduced?'Motion reduced':'Pause growth',()=>{crisisPaused=!crisisPaused;pause.textContent=crisisPaused?'Resume growth':'Pause growth';});pause.disabled=reduced;button('↻ Replay growth',()=>{crisisClock=0;crisisPaused=false;pause.textContent='Pause growth';},true);}
if(s.scene==='lessons'){lessonStep=0;showLesson(0)}
if(s.scene==='sdkpaths'){['DIY loop','CLI script','Agent SDK'].forEach((name,i)=>button(name,()=>{selectSdkPath(i);$('description').textContent=[ 'Build the model/tool loop yourself: maximum control, but you own context, tools, retries and lifecycle.', 'Invoke an existing coding agent with a non-interactive CLI; parse its output and orchestrate calls from your script.', 'Call a packaged coding-agent harness through a programmatic API. Copilot, Claude and Codex each provide an SDK.' ][i];}));const p=button(reduced?'Motion reduced':'Pause signals',()=>{sdkPaused=!sdkPaused;p.textContent=sdkPaused?'Resume signals':'Pause signals'});p.disabled=reduced;}
if(s.scene==='boundaries'){const info=document.createElement('p');info.className='boundary-status';info.id='boundaryStatus';$('interactive').append(info);button('✓ Within limits',()=>{setBoundaryBlocked(false);info.textContent=boundaryStatus();},true);button('× Over budget',()=>{setBoundaryBlocked(true);info.textContent=boundaryStatus();});const p=button(reduced?'Motion reduced':'Pause proposal',()=>{boundaryPaused=!boundaryPaused;p.textContent=boundaryPaused?'Resume proposal':'Pause proposal'});p.disabled=reduced;info.textContent=boundaryStatus();}
if(s.scene==='wardley'){const pause=button(reduced?'Motion reduced':'Pause evolution',()=>{pause.textContent=wardleyScene.togglePause()?'Resume evolution':'Pause evolution'});pause.disabled=reduced;button('↻ Replay',()=>{wardleyScene.replay();pause.textContent='Pause evolution'},true);button('Next beat →',()=>wardleyScene.nextBeat())}
if(s.scene==='apollo'){const pause=button(reduced?'Motion reduced':'Pause signals',()=>{apolloPaused=!apolloPaused;pause.textContent=apolloPaused?'Resume signals':'Pause signals'});pause.disabled=reduced;button('Next signal →',()=>{apolloClock=(Math.floor(apolloClock/3.6)+1)*3.6;animateApollo(0)});const signal=document.createElement('div');signal.id='apolloSignal';$('interactive').append(signal);apolloStage=-1;animateApollo(0);}
if(s.scene==='harness'){button('Run the loop ↻',()=>{auto=!auto;toast(auto?'Observe → act → check → repeat':'Loop paused')},true)}if(s.scene==='architecture'){['C# / MAF','VS Code','Runtime'].forEach((v,i)=>button(v,()=>{selectedPath=i;const desc=['C# application → optional MAF orchestration → Copilot SDK → CLI runtime.','VS Code Agents Window → Agent Host → Copilot SDK adapter → runtime.','The CLI runtime executes the agent loop. The SDK exposes programmatic control over JSON-RPC.'];$('description').textContent=desc[i];targetSpin=[-.35,.25,.7][i];$('interactive').querySelectorAll('button').forEach((b,j)=>b.classList.toggle('active',j===i))}))}if(s.scene==='workflow'){button('▶ Run workflow',()=>{sim=1;simStart=performance.now();simStatus='';},true);const b=button('Check fails: OFF',()=>{fail=!fail;b.textContent='Check fails: '+(fail?'ON':'OFF');b.classList.toggle('active',fail)})}if(s.scene==='ideas'){const ds=['Review a bounded repository change against explicit architectural rules. Output findings with file-level evidence.','Fix one failing test in an isolated workspace. Stop after a bounded number of attempts and report the evidence.','Exercise one user journey in a browser. Record what failed, propose a change and verify the same journey again.'];['Repo review','Repair loop','UI test'].forEach((l,i)=>button(l,()=>{$('description').textContent=ds[i];targetSpin=(i-1)*.4}))}if(index===slides.length-1&&s.scene!=='lessons'){button('Back to the staircase ↺',()=>go(0),true);button('Open chapter map',()=>showMap())}if(!reduced)$('copy').animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'ease-out'});history.replaceState(null,'','#'+index)}
function go(n){index=Math.max(0,Math.min(slides.length-1,n));update()}function stepSlide(delta){if(slides[index].scene==='lessons'&&lessonStep+delta>=0&&lessonStep+delta<lessonBeats.length){showLesson(lessonStep+delta);return}go(index+delta)}function showMap(){$('map').showModal()}function toggleNotes(){$('notes').hidden=!$('notes').hidden}
slides.forEach((s,i)=>{const b=document.createElement('button');b.title=s.title.replace(/<[^>]*>/g,' ');b.setAttribute('aria-label','Slide '+(i+1)+': '+b.title);b.onclick=()=>go(i);$('progress').append(b);const c=document.createElement('button');c.innerHTML=`<span>${String(i+1).padStart(2,'0')} / ${s.section}</span>${s.title.replace(/<br>/g,' ').replace(/<[^>]*>/g,'')}`;c.onclick=()=>{go(i);$('map').close()};$('chapters').append(c)});
$('prev').onclick=()=>stepSlide(-1);$('next').onclick=()=>stepSlide(1);$('overview').onclick=showMap;$('closeMap').onclick=()=>$('map').close();$('notesBtn').onclick=toggleNotes;$('closeNotes').onclick=toggleNotes;$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{toast('Full screen is not supported here.')}};document.addEventListener('keydown',e=>{if($('map').open||['INPUT','TEXTAREA'].includes(e.target.tagName))return;if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();stepSlide(1)}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();stepSlide(-1)}if(e.key==='Home')go(0);if(e.key==='End')go(slides.length-1);if(e.key.toLowerCase()==='m')showMap();if(e.key.toLowerCase()==='n')toggleNotes();if(e.key.toLowerCase()==='f')$('fullscreen').click()});
let drag=null;$('world').addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};$('world').setPointerCapture(e.pointerId)});$('world').addEventListener('pointermove',e=>{if(drag){targetSpin+=(e.clientX-drag.x)*.008;targetTilt=Math.max(-.6,Math.min(.6,targetTilt+(e.clientY-drag.y)*.004));drag={x:e.clientX,y:e.clientY}}});$('world').addEventListener('pointerup',()=>drag=null);$('world').addEventListener('pointercancel',()=>drag=null);$('world').addEventListener('dblclick',()=>{targetSpin=0;targetTilt=0});

class PaperRenderer {
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.shadowMap={};this.ratio=1;}
 setPixelRatio(r){this.ratio=Math.min(r,1.5)} setClearColor(){}
 setSize(w,h){this.w=w;this.h=h;this.canvas.width=w*this.ratio;this.canvas.height=h*this.ratio}
 render(scene,camera){const ctx=this.ctx;ctx.setTransform(this.ratio,0,0,this.ratio,0,0);ctx.clearRect(0,0,this.w,this.h);scene.updateMatrixWorld();camera.updateMatrixWorld();const items=[];const project=v=>{const p=v.clone().project(camera);return [(p.x*.5+.5)*this.w,(-p.y*.5+.5)*this.h,p.z]};
 const shadow=project(new THREE.Vector3(0,-2.35,0));ctx.save();ctx.translate(shadow[0],shadow[1]);ctx.scale(1,.25);const grad=ctx.createRadialGradient(0,0,10,0,0,this.w*.26);grad.addColorStop(0,'rgba(90,85,65,.12)');grad.addColorStop(1,'rgba(90,85,65,0)');ctx.fillStyle=grad;ctx.beginPath();ctx.arc(0,0,this.w*.26,0,Math.PI*2);ctx.fill();ctx.restore();
 scene.traverse(o=>{if(!o.visible)return;if(o.isSprite&&o.material.map){const v=o.getWorldPosition(new THREE.Vector3());const p=project(v);const sz=o.getWorldScale(new THREE.Vector3());const d=v.distanceTo(camera.position);const h=this.h*sz.y/(2*Math.tan(camera.fov*Math.PI/360)*d);items.push({z:p[2]-.002,sprite:o.material.map.image,x:p[0],y:p[1],w:h*sz.x/sz.y,h});return}if(o.userData.photo){const {image,w,h}=o.userData.photo;const ps=[[-w/2,h/2,0],[w/2,h/2,0],[w/2,-h/2,0],[-w/2,-h/2,0]].map(p=>project(new THREE.Vector3(...p).applyMatrix4(o.matrixWorld)));items.push({z:ps.reduce((a,p)=>a+p[2],0)/4-.01,photo:image,ps});return;}if(!o.geometry||o.material?.isShadowMaterial)return;const pos=o.geometry.attributes.position;if(!pos)return;const pts=[];for(let i=0;i<pos.count;i++)pts.push(new THREE.Vector3().fromBufferAttribute(pos,i).applyMatrix4(o.matrixWorld));const indices=o.geometry.index?.array;const n=indices?indices.length:pos.count;const at=i=>indices?indices[i]:i;const c=o.material.color||new THREE.Color(0x30372e);
 if(o.isMesh){for(let i=0;i<n;i+=3){const a=pts[at(i)],b=pts[at(i+1)],d=pts[at(i+2)];if(!d)continue;const normal=b.clone().sub(a).cross(d.clone().sub(a)).normalize();if(o.material.side!==THREE.DoubleSide&&normal.dot(camera.position.clone().sub(a))<0)continue;const ps=[project(a),project(b),project(d)];const shade=.78+.22*Math.max(0,normal.dot(new THREE.Vector3(-.3,.8,.5).normalize()));const rgb=c.clone().convertLinearToSRGB();items.push({z:(ps[0][2]+ps[1][2]+ps[2][2])/3,ps,fill:`rgba(${Math.round(rgb.r*255*shade)},${Math.round(rgb.g*255*shade)},${Math.round(rgb.b*255*shade)},${o.material.opacity??1})`})}}
 else if(o.isLine){for(let i=0;i<n-1;i+=o.isLineSegments?2:1){const ps=[project(pts[at(i)]),project(pts[at(i+1)])];items.push({z:(ps[0][2]+ps[1][2])/2-.00015,ps,stroke:'#454b3c',alpha:o.material.opacity??1})}}});
 items.sort((a,b)=>b.z-a.z);for(const it of items){if(it.photo){
 const im=it.photo,uv=[[0,0],[im.width,0],[im.width,im.height],[0,im.height]];
 for(const tri of [[0,1,2],[0,2,3]]){
  const [a,b,c]=tri.map(i=>it.ps[i]),[u,v,w]=tri.map(i=>uv[i]);
  const det=(v[0]-u[0])*(w[1]-u[1])-(w[0]-u[0])*(v[1]-u[1]);
  const A=((b[0]-a[0])*(w[1]-u[1])-(c[0]-a[0])*(v[1]-u[1]))/det;
  const B=((b[1]-a[1])*(w[1]-u[1])-(c[1]-a[1])*(v[1]-u[1]))/det;
  const C=((c[0]-a[0])*(v[0]-u[0])-(b[0]-a[0])*(w[0]-u[0]))/det;
  const D=((c[1]-a[1])*(v[0]-u[0])-(b[1]-a[1])*(w[0]-u[0]))/det;
  ctx.save();ctx.globalAlpha=1;ctx.beginPath();ctx.moveTo(...a.slice(0,2));ctx.lineTo(...b.slice(0,2));ctx.lineTo(...c.slice(0,2));ctx.closePath();ctx.clip();ctx.transform(A,B,C,D,a[0]-A*u[0]-C*u[1],a[1]-B*u[0]-D*u[1]);ctx.drawImage(im,0,0);ctx.restore();
 }continue;}if(it.sprite){ctx.globalAlpha=1;ctx.drawImage(it.sprite,it.x-it.w/2,it.y-it.h/2,it.w,it.h);continue}ctx.globalAlpha=it.alpha??1;ctx.beginPath();it.ps.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));if(it.fill){ctx.closePath();ctx.fillStyle=it.fill;ctx.fill()}else{ctx.strokeStyle=it.stroke;ctx.lineWidth=.9;ctx.stroke()}}ctx.globalAlpha=1;
 }
}

try{renderer=new THREE.WebGLRenderer({canvas:$('world'),antialias:true,alpha:true});}catch(e){const old=$('world'); const fresh=old.cloneNode();old.replaceWith(fresh);renderer=new PaperRenderer(fresh);fresh.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};fresh.setPointerCapture(e.pointerId)});fresh.addEventListener('pointermove',e=>{if(drag){targetSpin+=(e.clientX-drag.x)*.008;targetTilt=Math.max(-.6,Math.min(.6,targetTilt+(e.clientY-drag.y)*.004));drag={x:e.clientX,y:e.clientY}}});fresh.addEventListener('pointerup',()=>drag=null);fresh.addEventListener('pointercancel',()=>drag=null)}
{renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setClearColor(paper,0);scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(6,4.1,12);camera.lookAt(0,0,0);scene.add(new THREE.HemisphereLight(0xffffff,0xb8b8a1,2.6));const sun=new THREE.DirectionalLight(0xfff9e8,3.2);sun.position.set(-3,7,6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-8;sun.shadow.camera.right=8;sun.shadow.camera.top=8;sun.shadow.camera.bottom=-8;scene.add(sun);const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.10}));floor.rotation.x=-Math.PI/2;floor.position.y=-2.5;floor.receiveShadow=true;scene.add(floor);function resize(){const c=$('world');renderer.setSize(c.clientWidth,c.clientHeight,false);camera.aspect=c.clientWidth/c.clientHeight;camera.updateProjectionMatrix()}window.addEventListener('resize',resize);resize();}
eniacPhoto.onload=()=>{if(slides[index].scene==='eniac')build('eniac')};
update();document.fonts.ready.then(()=>build(slides[index].scene));let escalatorClock=0;let last=performance.now();function frame(now){requestAnimationFrame(frame);if(!renderer||!root||document.hidden)return;const dt=Math.min((now-last)/1000,.05);last=now;transition=Math.min(1,transition+dt*2);spin+=(targetSpin-spin)*.075;tilt+=(targetTilt-tilt)*.075;const ease=1-Math.pow(1-transition,3);root.scale.setScalar((innerWidth<=800?.88:1)*(reduced?1:.85+.15*ease));root.position.y=reduced?0:(1-ease)*-.5;root.rotation.y=-.28+spin+(reduced?0:Math.sin(now*.00015)*.045);root.rotation.x=tilt;
 if(slides[index].scene==='apollo'){camera.position.lerp(new THREE.Vector3(0,0,13.5),.1);camera.lookAt(0,0,0);root.rotation.y=spin;root.rotation.x=tilt;}else if(index===1){camera.position.lerp(new THREE.Vector3(1.2,1.5,12.8),.06);camera.lookAt(0,-.1,0)}else if(slides[index].scene==='wardley'){camera.position.lerp(new THREE.Vector3(2.5,7.4,12.8),.08);camera.lookAt(0,-.85,0);root.rotation.y=spin;root.rotation.x=tilt;}else if(slides[index].scene==='crisis'){const retreat=crisisEase((crisisClock-2)/6);camera.position.lerp(new THREE.Vector3(6+retreat*1.8,4.1+retreat*1.4,12+retreat*3.8),.035);camera.lookAt(0,.35,0)}else{camera.position.lerp(new THREE.Vector3(6,4.1,12),.06);camera.lookAt(0,0,0)}
 if(index===0){
  if(!reduced&&!escalatorPaused)escalatorClock+=dt*.018;
  escalatorSteps.forEach((step,i)=>{const u=(i/escalatorSteps.length+escalatorClock)%1;step.position.set(-2.7+u*5.4,-1.9+u*3.34,0);const alpha=Math.min(1,u*14,(1-u)*14);step.traverse(o=>{if(o.material){o.material.transparent=true;o.material.opacity=alpha;o.material.depthWrite=alpha>.9}})});
 }
 if(index===1){cinemaReels.forEach(r=>{if(projectionOn&&!reduced)r.rotation.y+=dt*.6});if(cinemaBeam){cinemaBeam.visible=projectionOn;cinemaBeam.material.opacity=.055+(reduced?0:Math.sin(now*.0014)*.007)}}
if(slides[index].scene==='crisis')animateCrisis(now,dt);
if(slides[index].scene==='apollo')animateApollo(dt);
 if(slides[index].scene==='lessons')animateLessons(dt);
if(slides[index].scene==='wardley')wardleyScene?.animate(dt);
if(slides[index].scene==='sdkpaths')animateSdkPaths(dt);
if(slides[index].scene==='boundaries')animateBoundaries(dt);
if(slides[index].scene==='powerstrip')animatePowerStrip(now,dt);
if(slides[index].scene==='harness'&&auto&&objects[0]){const a=now*.001;objects[0].position.set(Math.cos(a)*2.65,Math.sin(a)*2.05,-.4)}if(slides[index].scene==='brain'&&!reduced)objects.forEach((o,i)=>o.scale.setScalar(1+Math.sin(now*.001+i)*.1));if(slides[index].scene==='eniac'&&!reduced)objects.forEach((o,i)=>o.material.emissive.setHex(Math.sin(now*.002+i)> .8?0x443300:0));if(slides[index].scene==='workflow'&&sim){let stage=Math.floor((now-simStart)/1200);const seq=fail?[0,1,2,3,1,2,3]:[0,1,2,3];const msgs=fail?['Assigning a bounded change','Agent edits the workspace','Check failed: evidence returned','Repair requested · attempt 2 of 2','Agent applies a repair','Check passes','Accepted with evidence']:['Assigning a bounded change','Agent edits the workspace','Check passes','Accepted with evidence'];if(stage<seq.length){objects.forEach((o,i)=>o.scale.setScalar(i===seq[stage]?1.1:1));if(simStatus!==msgs[stage]){$('drawingTitle').textContent=msgs[stage];simStatus=msgs[stage]}}else{sim=0;objects.forEach(o=>o.scale.setScalar(1));$('drawingTitle').textContent='Done. Outcome checked, not merely asserted.'}}renderer.render(scene,camera)}requestAnimationFrame(frame);
