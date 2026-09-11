import { useEffect, useRef } from 'react';
const random = n => { const v=Math.sin(n*127.1+31.7)*43758.5453; return v-Math.floor(v); };
const gaussian=(a,b)=>Math.sqrt(-2*Math.log(Math.max(.00001,random(a))))*Math.cos(2*Math.PI*random(b));
// Connected Bezier currents, with feathered particle density instead of solid ribbon edges.
const currents=[
 [[.99,-.09],[.72,-.12],[.59,.02],[.76,.065]],
 [[.76,.065],[.91,.11],[.77,-.06],[1.07,.02]],
 [[1.04,.07],[.91,.05],[.88,.15],[1.01,.19]],
 [[1.01,.19],[1.09,.28],[.88,.29],[.96,.36]],
 [[.96,.36],[1.02,.46],[.80,.43],[.74,.54]],
 [[.74,.54],[.64,.62],[.57,.68],[.67,.715]],
 [[.67,.715],[.84,.79],[.81,.53],[.69,.615]],
 [[.69,.615],[.65,.65],[.74,.70],[.86,.69]],
 [[1.035,.35],[.97,.44],[1.035,.53],[.99,.63]],
 [[.99,.63],[.94,.72],[1.09,.77],[.98,.87]],
 [[.98,.87],[.93,.95],[1.06,1.03],[.91,1.07]],
 [[-.04,.55],[.04,.68],[-.03,.91],[.015,1.08]],
];
function makeParticles(w,h){
 const particles=[];const scale=Math.max(.6,w/1568);
 currents.forEach((points,lane)=>{
 const count=lane>8?4200:6500;
 for(let i=0;i<count;i++){
 const seed=lane*270001+i*11,t=random(seed+1),u=1-t;
 const x=u*u*u*points[0][0]+3*u*u*t*points[1][0]+3*u*t*t*points[2][0]+t*t*t*points[3][0];
 const y=u*u*u*points[0][1]+3*u*u*t*points[1][1]+3*u*t*t*points[2][1]+t*t*t*points[3][1];
 // Isotropic Gaussian scatter eliminates the diagonal slashes of the previous field.
 const spread=(lane===11?17:lane===6||lane===7?10:13+7*Math.sin(t*Math.PI))*scale;
 const px=x*w+gaussian(seed+2,seed+3)*spread,py=y*h+gaussian(seed+4,seed+5)*spread;
 const alpha=.16+random(seed+6)*.34;
 particles.push({x:px,y:py,r:(.35+random(seed+7)*.65)*scale,color:'rgba(132,104,176,'+alpha+')'});
 }
 });
 return particles;
}
export default function CelestialDust({paused}){
 const ref=useRef(null);
 useEffect(()=>{
 const canvas=ref.current,ctx=canvas.getContext('2d');if(!ctx)return;
 const hero=canvas.parentElement,motion=matchMedia('(prefers-reduced-motion: reduce)');
 let width=0,height=0,particles=[],frame=0,last=0,visible=true,strength=0;
 const pointer={x:0,y:0,active:false};
 const draw=()=>{
 ctx.clearRect(0,0,width,height);
 const radius=110;
 for(const p of particles){
 let x=p.x,y=p.y;
 if(strength>.001){const dx=x-pointer.x,dy=y-pointer.y,d=Math.hypot(dx,dy);
 if(d<radius){const push=24*strength*(1-d/radius)**2;const angle=d>.1?Math.atan2(dy,dx):0;x+=Math.cos(angle)*push;y+=Math.sin(angle)*push;}}
 ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);ctx.fill();
 }
 };
 const tick=now=>{frame=0;if(paused||motion.matches||!visible||document.hidden)return;
 if(now-last>=40){last=now;const target=pointer.active?1:0;strength+=(target-strength)*.16;draw();}
 if(pointer.active||strength>.003)frame=requestAnimationFrame(tick);
 };
 const start=()=>{if(!frame&&!paused&&!motion.matches&&visible&&!document.hidden)frame=requestAnimationFrame(tick);};
 const reset=()=>{cancelAnimationFrame(frame);frame=0;pointer.active=false;strength=0;draw();};
 const resize=()=>{
 const rect=hero.getBoundingClientRect(),top=rect.top+window.scrollY;width=document.documentElement.clientWidth;height=rect.height+top+40;
 const dpr=Math.min(devicePixelRatio||1,2);
 canvas.style.maxWidth='none';canvas.style.left=-rect.left+'px';canvas.style.top=-top+'px';canvas.style.width=width+'px';canvas.style.height=height+'px';
 canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);particles=makeParticles(width,height);draw();
 };
 const move=e=>{if(e.pointerType!=='mouse'||paused||motion.matches)return;const rect=canvas.getBoundingClientRect();pointer.x=e.clientX-rect.left;pointer.y=e.clientY-rect.top;pointer.active=pointer.x>=0&&pointer.x<=width&&pointer.y>=0&&pointer.y<=height;start();};
 const leave=()=>{pointer.active=false;start();};
 const visibility=()=>{if(document.hidden)reset();};
 const observer=new ResizeObserver(resize);observer.observe(hero);
 const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!visible)reset();});intersection.observe(hero);
 window.addEventListener('resize',resize);window.addEventListener('pointermove',move,{passive:true});document.documentElement.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',visibility);motion.addEventListener('change',reset);resize();
 return()=>{cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();window.removeEventListener('resize',resize);window.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',reset);};
 },[paused]);
 return <canvas ref={ref} className="journal-dust" data-paused={paused} aria-hidden="true" />;
}
