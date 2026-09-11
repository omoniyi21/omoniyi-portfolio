import { useEffect, useRef } from "react";

const random = seed => {const n=Math.sin(seed*127.1+31.7)*43758.5453; return n-Math.floor(n);};
const grains=Array.from({length:1100},(_,i)=>({
 phase:random(i+1), spread:(random(i+1101)+random(i+2201)-1),
 depth:random(i+3301), radius:.35+random(i+4401)*.75,
}));

export default function CelestialDust({ paused }) {
 const ref=useRef(null);
 useEffect(()=>{
  const canvas=ref.current,ctx=canvas.getContext('2d');
  if(!ctx) return;
  const scene=canvas.parentElement,area=scene.closest('.hero__main');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,visible=false,last=0,time=0,rect=scene.getBoundingClientRect();
  let pointer={x:350,y:280,active:false},offset={x:0,y:0};
  const render=()=>{
   ctx.clearRect(0,0,700,560);
   const breath=Math.sin(time*.65);
   for(const p of grains){
    const t=(p.phase+time*.012)%1;
    const width=24+16*Math.sin(t*Math.PI);
    let x=478+139*Math.sin(t*Math.PI*2-.65)+p.spread*width+Math.sin(t*13+time*.35)*7;
    let y=-24+t*608+(p.depth-.5)*30;
    x+=breath*p.spread*9+offset.x*(.35+p.depth*.65);
    y+=offset.y*(.35+p.depth*.65);
    if(pointer.active){
     const dx=pointer.x-x,dy=pointer.y-y,attraction=Math.exp(-(dx*dx+dy*dy)/28000)*.065;
     x+=dx*attraction;y+=dy*attraction;
    }
    const fade=Math.min(1,t*12,(1-t)*12);
    ctx.fillStyle=`rgba(131,94,159,${fade*(.23+p.depth*.25)*(1+breath*.12)})`;
    ctx.beginPath();ctx.arc(x,y,p.radius*(1+breath*.08),0,Math.PI*2);ctx.fill();
   }
  };
  const running=()=>visible&&!paused&&!motion.matches&&!document.hidden;
  const tick=now=>{
   frame=0;if(!running()) return;
   if(!last) last=now;
   const dt=now-last;
   if(dt>=32){time+=Math.min(dt,70)/1000;last=now;
    const tx=pointer.active?(pointer.x-350)*.035:0,ty=pointer.active?(pointer.y-280)*.03:0;
    offset.x+=(tx-offset.x)*.08;offset.y+=(ty-offset.y)*.08;render();
   }
   frame=requestAnimationFrame(tick);
  };
  const sync=()=>{cancelAnimationFrame(frame);frame=0;last=0;
   if(motion.matches){pointer.active=false;offset={x:0,y:0};time=0;render();}
   if(running()) frame=requestAnimationFrame(tick);
  };
  const resize=()=>{rect=scene.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,1.5);
   canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);
   ctx.setTransform(canvas.width/700,0,0,canvas.height/560,0,0);render();
  };
  const move=event=>{if(event.pointerType!=='mouse'||paused||motion.matches) return;
   rect=scene.getBoundingClientRect();pointer={x:(event.clientX-rect.left)/rect.width*700,y:(event.clientY-rect.top)/rect.height*560,active:true};
  };
  const leave=()=>{pointer.active=false;};
  const visibility=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:0});visibility.observe(scene);
  const size=new ResizeObserver(resize);size.observe(scene);resize();
  area.addEventListener('pointermove',move,{passive:true});area.addEventListener('pointerleave',leave);
  document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);
  return ()=>{cancelAnimationFrame(frame);visibility.disconnect();size.disconnect();area.removeEventListener('pointermove',move);area.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',sync);motion.removeEventListener('change',sync);};
 },[paused]);
 return <canvas ref={ref} className="scorpio-dust" aria-hidden="true" />;
}
