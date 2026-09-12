import { useEffect, useRef } from 'react';
const random = n => { const v=Math.sin(n*127.1+31.7)*43758.5453; return v-Math.floor(v); };
const gaussian=(a,b)=>Math.sqrt(-2*Math.log(Math.max(.00001,random(a))))*Math.cos(2*Math.PI*random(b));
// Connected Bezier currents, with feathered particle density instead of solid ribbon edges.
// Normalized to the reference's 1568 × 1003 dust silhouette.
const currents=[
 [[.615,-.045],[.565,.095],[.72,.10],[.705,-.035]],
 [[.705,-.035],[.80,.11],[.84,-.07],[.945,.045]],
 [[.945,.045],[1.045,.055],[.94,.125],[.98,.17]],
 [[.98,.17],[1.015,.225],[.88,.185],[.935,.285]],
 // The reference's inward S bend and hook above the cards.
 [[.935,.285],[.975,.355],[.79,.39],[.77,.455]],
 [[.77,.455],[.755,.505],[.69,.50],[.655,.565]],
 [[.655,.565],[.605,.665],[.70,.705],[.725,.68]],
 [[.725,.68],[.66,.705],[.565,.615],[.525,.61]],
 // Fine trailing curve curls toward the middle without filling the text area.
 [[.525,.61],[.49,.57],[.425,.655],[.415,.715]],
 [[1.015,.29],[.925,.36],[1.055,.405],[.985,.46]],
 [[.985,.46],[.91,.505],[1.035,.535],[1.005,.66]],
 [[1.005,.66],[.965,.81],[1.075,.94],[.88,1.025]],
 // Visible left-edge dust, widening into the lower-left curl.
 [[-.012,.565],[.038,.66],[-.016,.74],[.017,.82]],
 [[.017,.82],[-.012,.91],[.025,.995],[.13,.985]],
 [[.13,.985],[.19,.965],[.13,1.055],[.25,1.025]],
];
function makeParticles(w,h,fullHeight=h){
 const particles=[];const scale=Math.max(.6,w/1568);
 currents.forEach((points,lane)=>{
 const count=lane===12?7400:lane===13?6800:lane===14?3400:lane===8?2200:5600;
 for(let i=0;i<count;i++){
 const seed=lane*270001+i*11,t=random(seed+1),u=1-t;
 const x=u*u*u*points[0][0]+3*u*u*t*points[1][0]+3*u*t*t*points[2][0]+t*t*t*points[3][0];
 const y=u*u*u*points[0][1]+3*u*u*t*points[1][1]+3*u*t*t*points[2][1]+t*t*t*points[3][1];
 // Isotropic Gaussian scatter eliminates the diagonal slashes of the previous field.
 const spread=(lane>=12?19+9*Math.sin(t*Math.PI):lane===8?11:13+9*Math.sin(t*Math.PI))*scale;
 const px=x*w+gaussian(seed+2,seed+3)*spread;
 // Stretch only the bottom edge tails to the notebook divider.
 const tail=Math.max(0,Math.min(1,(y-.8)/.2));
 const py=y*h+tail*(fullHeight-h)+gaussian(seed+4,seed+5)*spread;
 const alpha=.18+random(seed+6)*.34;
 particles.push({x:px,y:py,r:(.35+random(seed+7)*.72)*scale,color:'rgba(139,110,190,'+alpha+')'});
 }
 });
 return particles;
}
export default function CelestialDust({paused}){
 const ref=useRef(null);
 const pausedRef=useRef(paused);
 useEffect(()=>{pausedRef.current=paused;},[paused]);
 useEffect(()=>{
 const canvas=ref.current,ctx=canvas.getContext('2d');if(!ctx)return;
 const hero=canvas.parentElement,motion=matchMedia('(prefers-reduced-motion: reduce)');
 let width=0,height=0,particles=[],frame=0,last=0,elapsed=0,visible=true,strength=0;
 const pointer={x:0,y:0,active:false};
 const draw=(time=0)=>{
 ctx.clearRect(0,0,width,height);
 const phase=time*.000605,scale=Math.max(.6,width/1568);
 const radius=110;
 for(const p of particles){
 // Bend the field locally with a slow travelling wave.
 let x=p.x+Math.sin(p.y/height*12-phase)*5*scale,y=p.y+Math.sin(p.x/width*10-phase*.8)*3.5*scale;
 if(strength>.001){const dx=x-pointer.x,dy=y-pointer.y,d=Math.hypot(dx,dy);
 if(d<radius){const push=24*strength*(1-d/radius)**2;const angle=d>.1?Math.atan2(dy,dx):0;x+=Math.cos(angle)*push;y+=Math.sin(angle)*push;}}
 ctx.globalAlpha=Math.min(1,Math.max(0,(height-y)/28));
 ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);ctx.fill();
 }
 };
 const tick=now=>{frame=0;if(!visible||document.hidden)return;
 if(now-last>=40){const delta=last?Math.min(now-last,80):0;last=now;
 if(!pausedRef.current&&!motion.matches){elapsed+=delta;const target=pointer.active?1:0;strength+=(target-strength)*.16;draw(elapsed);}}
 frame=requestAnimationFrame(tick);
 };
 const start=()=>{if(!frame&&visible&&!document.hidden){last=0;frame=requestAnimationFrame(tick);}};
 const reset=()=>{cancelAnimationFrame(frame);frame=0;last=0;};
 const resize=()=>{
 const rect=hero.getBoundingClientRect(),top=rect.top+window.scrollY;width=document.documentElement.clientWidth;height=rect.height+top+40;
 const compositionHeight=height;
 const divider=document.querySelector(".notebook-masthead__star");
 if(divider)height=Math.max(height,divider.getBoundingClientRect().bottom+window.scrollY);
 const dpr=Math.min(devicePixelRatio||1,2);
 canvas.style.maxWidth='none';canvas.style.left=-rect.left+'px';canvas.style.top=-top+'px';canvas.style.width=width+'px';canvas.style.height=height+'px';
 canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);particles=makeParticles(width,compositionHeight,height);draw(elapsed);start();
 };
 const move=e=>{if(e.pointerType!=='mouse'||pausedRef.current||motion.matches)return;const rect=canvas.getBoundingClientRect();pointer.clientY=e.clientY;pointer.x=e.clientX-rect.left;pointer.y=e.clientY-rect.top;pointer.active=pointer.x>=0&&pointer.x<=width&&pointer.y>=0&&pointer.y<=height;start();};
 const leave=()=>{pointer.active=false;start();};
 const visibility=()=>{if(document.hidden)reset();else start();};
 const preference=()=>{strength=0;pointer.active=false;draw(elapsed);start();};
 const scroll=()=>{if(!pointer.active)return;const rect=canvas.getBoundingClientRect();pointer.y=pointer.clientY-rect.top;start();};
 const observer=new ResizeObserver(resize);observer.observe(hero);
 const opening=hero.closest(".home-journal__opening");if(opening)observer.observe(opening);
 const mountFrame=requestAnimationFrame(resize);
 const mutations=new MutationObserver(resize);if(opening)mutations.observe(opening,{childList:true,subtree:true});
 const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!visible)reset();else start();});intersection.observe(hero);
 window.addEventListener('resize',resize);window.addEventListener('pointermove',move,{passive:true});document.documentElement.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',visibility);motion.addEventListener('change',preference);window.addEventListener('scroll',scroll,{passive:true});resize();
 return()=>{cancelAnimationFrame(frame);cancelAnimationFrame(mountFrame);mutations.disconnect();observer.disconnect();intersection.disconnect();window.removeEventListener('resize',resize);window.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',preference);window.removeEventListener('scroll',scroll);};
 },[]);
 return <canvas ref={ref} className="journal-dust" data-paused={paused} aria-hidden="true" />;
}
