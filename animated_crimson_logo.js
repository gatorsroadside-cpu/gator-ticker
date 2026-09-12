(()=>{
  'use strict';
  const W=240,H=219,TEXT={x1:12,y1:91,x2:229,y2:147};
  const canvas=document.getElementById('logo'),ctx=canvas.getContext('2d',{alpha:true});
  const mask=document.createElement('canvas'),mx=mask.getContext('2d');
  const blood=document.createElement('canvas'),fx=blood.getContext('2d');
  mask.width=blood.width=W;mask.height=blood.height=H;
  const baseImg=new Image(),maskImg=new Image();
  baseImg.src='Crimson_Logo_Base.png';maskImg.src='Gators_Text_Mask.png';
  const drops=Array.from({length:14},(_,i)=>({x:18+i*15+Math.random()*8,y:90+Math.random()*66,r:1.2+Math.random()*2.6,s:.7+Math.random()*1.25,p:Math.random()*Math.PI*2}));

  function drawBlood(now){
    const t=now*.001;fx.clearRect(0,0,W,H);
    const cycle=(t*18)%56;
    const flow=fx.createLinearGradient(0,91-cycle,0,203-cycle);
    flow.addColorStop(0,'#260003');flow.addColorStop(.13,'#760008');flow.addColorStop(.27,'#e40b20');flow.addColorStop(.36,'#ff5a62');flow.addColorStop(.43,'#8c000c');flow.addColorStop(.62,'#d8071a');flow.addColorStop(.75,'#3a0005');flow.addColorStop(.89,'#bd0616');flow.addColorStop(1,'#260003');
    fx.fillStyle=flow;fx.fillRect(0,84,W,76);

    /* Thick vertical currents visibly crawl down inside each letter. */
    fx.globalCompositeOperation='screen';
    for(let col=0;col<15;col++){
      const x=18+col*15+Math.sin(t*1.1+col)*2.5;
      const y=86+((t*(17+col%4*3)+col*11)%76);
      const width=2.2+(col%3)*1.2;
      const stream=fx.createLinearGradient(x,y-14,x,y+27);
      stream.addColorStop(0,'rgba(255,210,205,0)');stream.addColorStop(.34,'rgba(255,92,92,.82)');stream.addColorStop(.62,'rgba(255,18,40,.66)');stream.addColorStop(1,'rgba(255,0,25,0)');
      fx.strokeStyle=stream;fx.lineWidth=width;fx.shadowColor='#ff1830';fx.shadowBlur=4;fx.beginPath();fx.moveTo(x,y-15);fx.bezierCurveTo(x+4,y-4,x-3,y+9,x+Math.sin(t+col)*3,y+28);fx.stroke();
    }

    /* Rolling wet wavefronts move downward instead of merely shimmering. */
    for(let row=0;row<3;row++){
      fx.beginPath();const yy=92+((t*16+row*21)%63);
      for(let x=4;x<=W+4;x+=3){const y=yy+Math.sin(x*.12+t*2.4+row)*2.8;if(x===4)fx.moveTo(x,y);else fx.lineTo(x,y)}
      fx.strokeStyle=row===1?'rgba(255,225,218,.72)':'rgba(255,52,63,.62)';fx.lineWidth=row===1?1.7:3.2;fx.shadowColor='#ff1028';fx.shadowBlur=5;fx.stroke();
    }

    for(const d of drops){
      const y=TEXT.y1+((d.y-TEXT.y1+t*19*d.s)%56);
      const x=d.x+Math.sin(t*1.7+d.p)*2.2;
      const g=fx.createRadialGradient(x-d.r*.35,y-d.r*.4,.2,x,y,d.r*2.4);
      g.addColorStop(0,'rgba(255,220,210,.88)');g.addColorStop(.18,'rgba(255,66,68,.76)');g.addColorStop(1,'rgba(120,0,12,0)');
      fx.fillStyle=g;fx.beginPath();fx.ellipse(x,y,d.r,d.r*2.8,0,0,Math.PI*2);fx.fill();
    }
    fx.shadowBlur=0;fx.globalCompositeOperation='destination-in';fx.drawImage(mask,0,0);fx.globalCompositeOperation='source-over';
  }

  function frame(now){
    ctx.clearRect(0,0,W,H);ctx.drawImage(baseImg,0,0,W,H);
    drawBlood(now);ctx.globalCompositeOperation='source-over';ctx.drawImage(blood,0,0);
    requestAnimationFrame(frame);
  }
  let loaded=0;function ready(){if(++loaded===2){mx.drawImage(maskImg,0,0,W,H);requestAnimationFrame(frame)}}
  baseImg.onload=ready;maskImg.onload=ready;
})();
