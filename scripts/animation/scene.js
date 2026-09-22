/* Original procedural scene, MIT. Render-time dependency only: Three.js r170. */
import * as T from '../../.animation-cache/three.module.js';
const W=960,H=840;
const scene=new T.Scene(); scene.background=new T.Color('#e8e5dd');
scene.fog=new T.Fog('#e8e5dd',28,65);
const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setSize(W,H); renderer.setPixelRatio(1); renderer.shadowMap.enabled=true;
renderer.shadowMap.type=T.PCFSoftShadowMap; renderer.outputColorSpace=T.SRGBColorSpace;
renderer.toneMapping=T.ACESFilmicToneMapping; renderer.toneMappingExposure=1.15;
document.body.appendChild(renderer.domElement);
const camera=new T.PerspectiveCamera(37,W/H,.1,100); camera.up.set(0,0,1);
scene.add(new T.AmbientLight('#fff9ec',1.4));
const key=new T.DirectionalLight('#fff4dc',3.1);key.position.set(-5,-5,14);key.castShadow=true;
key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-13,right:19,top:13,bottom:-13,near:.5,far:45});key.shadow.bias=-.0003;key.shadow.normalBias=.025;key.shadow.radius=4;scene.add(key);
const fill=new T.DirectionalLight('#d8e7fa',1.05);fill.position.set(8,4,9);scene.add(fill);
const mat=(color,roughness=.7,metalness=0)=>new T.MeshStandardMaterial({color,roughness,metalness});
const teal=mat('#245a5c'),edge=mat('#193f42'),paper=mat('#f9f7ef'),silver=mat('#b6c5c6',.24,.72),black=mat('#273e40'),oak=mat('#c9ab83'),cream=mat('#ebe6d8');
function box(parent,w,d,h,x,y,z,m,bevel=.035){
 const shape=new T.Shape(); const r=Math.min(bevel,w/2,d/2),a=-w/2,b=-d/2;
 shape.moveTo(a+r,b);shape.lineTo(a+w-r,b);shape.quadraticCurveTo(a+w,b,a+w,b+r);shape.lineTo(a+w,b+d-r);shape.quadraticCurveTo(a+w,b+d,a+w-r,b+d);shape.lineTo(a+r,b+d);shape.quadraticCurveTo(a,b+d,a,b+d-r);shape.lineTo(a,b+r);shape.quadraticCurveTo(a,b,a+r,b);
 const geom=new T.ExtrudeGeometry(shape,{depth:h,bevelEnabled:bevel>0,bevelSegments:2,steps:1,bevelSize:Math.min(bevel,h/3),bevelThickness:Math.min(bevel,h/3),curveSegments:5});
 geom.translate(0,0,-h/2);const o=new T.Mesh(geom,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;
}
function cyl(parent,r,h,x,y,z,m){const o=new T.Mesh(new T.CylinderGeometry(r,r,h,40),m);o.rotation.x=Math.PI/2;o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function tube(parent,points,r,m){const c=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));const o=new T.Mesh(new T.TubeGeometry(c,70,r,10,false),m);o.castShadow=true;parent.add(o);return o;}
function plane(parent,w,h,x,y,z,texture){const m=new T.MeshStandardMaterial({map:texture,roughness:.85,side:T.DoubleSide});const o=new T.Mesh(new T.PlaneGeometry(w,h),m);o.position.set(x,y,z);o.receiveShadow=true;parent.add(o);return o;}
function canvasTexture(draw,w=1024,h=1024){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;return t;}
const coverTex=canvasTexture((c,w,h)=>{c.fillStyle='#245a5c';c.fillRect(0,0,w,h);c.fillStyle='#e8ede1';c.font='24px Arial';c.fillText('STATIONARY STORE',95,112);c.fillRect(95,155,830,2);c.font='66px Georgia';['Patient-held','Continuity','Pack'].forEach((s,i)=>c.fillText(s,95,350+i*87));c.font='25px Arial';c.fillText('MY NOTES. MY NEXT APPOINTMENT.',95,715);c.fillStyle='#b6cfca';c.font='23px Arial';c.fillText('Printable & editable • v1.1.0',95,1000);},1024,1400);
const floor=new T.Mesh(new T.PlaneGeometry(200,200),mat('#e8e5dd'));floor.position.z=-.65;floor.receiveShadow=true;scene.add(floor);
const desk=new T.Group();scene.add(desk);
box(desk,9.3,7.5,.35,0,0,-.23,oak,.06);
// Quiet grain lines, cut into the pale desk surface rather than a photo texture.
for(let i=0;i<25;i++){const y=-3.45+i*.28; tube(desk,[[-4.5,y,-.044],[-1,y+.035,-.044],[2,y-.02,-.044],[4.5,y+.03,-.044]],.003,mat('#bba27e'));}
box(desk,5.1,5.0,.045,-.45,0,-.015,mat('#c8d3c9'),.15);
// Stethoscope: tubing, bifurcated metal ear tubes and a weighted chest piece.
const st=new T.Group();st.position.set(2.8,.3,.04);st.rotation.z=-.16;desk.add(st);
tube(st,[[0,1.28,.07],[.2,.68,.07],[.57,-.12,.07],[.38,-.92,.07],[-.23,-1.15,.07],[-.8,-.7,.07],[-.57,-.12,.07]],.067,black);
tube(st,[[0,1.28,.07],[-.37,1.57,.1],[-.62,2.05,.13],[-.47,2.42,.16]],.041,silver);
tube(st,[[0,1.28,.07],[.37,1.57,.1],[.5,2.06,.13],[.35,2.42,.16]],.041,silver);
for(const x of [-.47,.35]){const tip=new T.Mesh(new T.SphereGeometry(.095,20,12),black);tip.scale.set(.8,1.3,.8);tip.position.set(x,2.42,.16);st.add(tip);}
cyl(st,.27,.09,-.57,-.12,.09,silver);cyl(st,.215,.021,-.57,-.12,.147,mat('#dce4df',.35,.25));
// Pen and a small pad imply a working consultation desk.
box(desk,.95,1.5,.12,-3.65,.8,.065,paper,.02);box(desk,.95,1.5,.025,-3.65,.8,.143,mat('#e1e5da'),.02);
tube(desk,[[-3.32,-1.4,.09],[-3.32,.1,.09]],.048,teal);tube(desk,[[-3.32,.1,.09],[-3.32,.29,.09]],.025,silver);
const cup=cyl(desk,.34,.65,3.6,-2.55,.32,cream);cyl(desk,.29,.014,3.6,-2.55,.655,mat('#705441'));
const handle=new T.Mesh(new T.TorusGeometry(.21,.05,12,28),cream);handle.rotation.x=Math.PI/2;handle.position.set(3.98,-2.55,.37);desk.add(handle);
// The same folder object remains on screen throughout the complete journey.
const folder=new T.Group();scene.add(folder);folder.position.set(-.5,0,.1);
box(folder,2.94,3.95,.075,0,0,0,edge,.025);
box(folder,.16,3.95,.24,-1.43,0,.115,teal,.022);
box(folder,2.69,3.7,.16,.045,0,.135,paper,.01);
for(let i=0;i<8;i++)box(folder,2.70,3.70,.003,.045,0,.066+i*.019,mat(i%2?'#d9d9cb':'#eeede6'),0);
const loader=new T.TextureLoader();const textures=await Promise.all(['appointment-sheet','current-information','medicines-list','pharmacy-labels','follow-up-tracker'].map(n=>loader.loadAsync(`../../.animation-cache/${n}.png`)));
textures.forEach(t=>{t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;});
plane(folder,2.64,3.70,.04,0,.235,textures[4]);
const sheets=[];
for(let i=3;i>=0;i--){const g=new T.Group();g.position.set(-1.28,0,.25+(3-i)*.011);folder.add(g);const geo=new T.PlaneGeometry(2.64,3.70,26,2);geo.translate(1.32,0,0);const mesh=new T.Mesh(geo,new T.MeshStandardMaterial({map:textures[i],roughness:.95,side:T.DoubleSide}));mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);sheets.unshift({g,mesh,rest:Array.from(geo.attributes.position.array)});}
// Divider tabs are physical pieces attached to the lower page block.
['#e3b882','#95bfc2','#9baf96'].forEach((color,i)=>box(folder,.14,.52,.025,1.44,.9-i*.8,.12+i*.03,mat(color),.015));
const front=new T.Group();front.position.set(-1.43,0,.325);folder.add(front);
box(front,2.94,3.95,.07,1.47,0,0,teal,.025);plane(front,2.82,3.85,1.47,0,.064,coverTex);
// Stitching follows the folder edge without stealing attention from the label.
for(const x of [.075,2.87])tube(front,[[x,-1.84,.043],[x,1.84,.043]],.006,mat('#709190'));
// Cabinet: a dry home cupboard, with closed generic medicine containers, no dosing text.
const cabinet=new T.Group();cabinet.position.set(11,1,0);scene.add(cabinet);
const wood=mat('#c0a482'),interior=mat('#d6c6aa');
box(cabinet,6.6,.16,6.4,0,1.45,2.9,interior,.03);
box(cabinet,.20,3.1,6.6,-3.3,0,2.9,wood,.03);box(cabinet,.20,3.1,6.6,3.3,0,2.9,wood,.03);
for(const z of [-.30,4.15,6.14])box(cabinet,6.6,3.1,.17,0,0,z,wood,.035);
// Open door, hinges and a small brass handle make the destination unambiguous.
const door=new T.Group();door.position.set(3.43,-1.56,2.9);door.rotation.z=-1.12;cabinet.add(door);
box(door,3.25,.16,6.55,1.625,0,0,mat('#66817c'),.06);
box(door,2.7,.05,5.94,1.625,-.11,0,mat('#718d86'),.025);
const knob=cyl(door,.075,.27,2.88,-.21,.1,mat('#b7a374',.3,.6));knob.rotation.x=0;
function bottle(parent,x,y,base,h,r,color){cyl(parent,r,h,x,y,base+h/2,mat(color,.4));cyl(parent,r*.84,.21,x,y,base+h+.06,cream);cyl(parent,r*1.012,h*.49,x,y,base+h*.46,mat('#f4f1e5'));box(parent,r*1.0,.014,.09,x,y-r-.016,base+h*.53,teal,.005);}
bottle(cabinet,1.45,-.3,-.19,1.15,.35,'#96602e');bottle(cabinet,2.4,.15,-.19,1.43,.30,'#eff0e7');
box(cabinet,.95,.65,.57,1.35,.5,.095,paper,.035);box(cabinet,.96,.66,.16,1.35,.5,.285,mat('#94b7b4'),.01);
bottle(cabinet,-1.8,.1,4.24,.94,.29,'#a16a34');bottle(cabinet,-.8,.3,4.24,1.18,.34,'#eeeee4');
box(cabinet,1.5,.8,.65,1.25,.1,4.60,paper,.04);box(cabinet,1.51,.82,.18,1.25,.1,4.85,mat('#abc2a6'),.012);
const smooth=(a,b,t)=>{const p=T.MathUtils.clamp((t-a)/(b-a),0,1);return p*p*(3-2*p);};
const mix=(a,b,p)=>a+(b-a)*p;
function poseCam(pos,target){camera.position.set(...pos);camera.lookAt(...target);}
function lerpArray(a,b,p){return a.map((v,i)=>mix(v,b[i],p));}
window.renderFrame=(t)=>{
 const zoom=smooth(1.4,4.5,t),out=smooth(12.8,15.4,t),travel=smooth(15.5,21.7,t);
 const open=smooth(3.5,5.2,t),close=smooth(11.4,13.1,t);
 front.rotation.y=-Math.PI*open*(1-close);
 front.position.z=.325-.245*open*(1-close);
 sheets.forEach(({g,mesh,rest},i)=>{const turn=smooth(5.7+i*1.05,6.65+i*1.05,t)*(1-smooth(10.5,11.65,t));g.rotation.y=-Math.PI*.978*turn;const a=mesh.geometry.attributes.position;for(let n=0;n<a.count;n++){const x=rest[n*3];a.setZ(n,Math.sin(x/2.64*Math.PI)*Math.sin(turn*Math.PI)*.20);}a.needsUpdate=true;mesh.geometry.computeVertexNormals();});
 folder.position.set(mix(-.5,9.8,travel),mix(0,-1.8,smooth(15.5,19,t))+mix(0,2.6,smooth(21,22.7,t)),mix(.1,1.87,smooth(14.7,17.4,t))+.45*Math.sin(travel*Math.PI));
 folder.rotation.x=Math.PI/2*smooth(15,18,t);folder.rotation.z=0;
 const start=[6.6,-10.3,10.4],near=[-.9,-7.0,9.5],wide=[6.2,-11.7,10.3],end=[6,-12,8.5];
 let pos=lerpArray(lerpArray(start,near,zoom),wide,out),look=lerpArray([-.1,.15,.05],[-1.5,0,.12],zoom);
 look=lerpArray(look,[-.2,0,.3],out);pos=lerpArray(pos,end,travel);look=lerpArray(look,[10.6,.85,2.6],travel);poseCam(pos,look);
 renderer.render(scene,camera);
};
window.renderFrame(0);window.sceneReady=true;
