(() => {
  'use strict';
  const CONFIG={pixelsPerSecond:92,separator:'◆',reloadEveryMs:5000};
  const track=document.getElementById('track');
  let lines=[],signature='',first=null,groupWidth=1,distance=0,previous=0,reloading=false;

  function sequence(){
    const group=document.createElement('div');group.className='sequence';
    lines.forEach((line)=>{
      const message=document.createElement('span');message.className='message';message.textContent=String(line);
      const separator=document.createElement('span');separator.className='separator';separator.textContent=CONFIG.separator;
      group.append(message,separator);
    });
    return group;
  }

  function rebuild(){
    track.replaceChildren();distance=0;groupWidth=1;
    if(!lines.length)return;
    first=sequence();const second=sequence();second.setAttribute('aria-hidden','true');track.append(first,second);
    requestAnimationFrame(()=>{groupWidth=Math.max(1,first.getBoundingClientRect().width)});
  }

  function acceptCurrentLines(){
    const next=Array.isArray(window.GATOR_LINES)?window.GATOR_LINES.map(String):[];
    const nextSignature=JSON.stringify(next);
    if(nextSignature!==signature){signature=nextSignature;lines=next;rebuild()}
  }

  function reloadGatorFile(){
    if(reloading)return;reloading=true;
    const script=document.createElement('script');
    script.src=`Gator.js?updated=${Date.now()}`;
    script.onload=()=>{acceptCurrentLines();script.remove();reloading=false};
    script.onerror=()=>{script.remove();reloading=false};
    document.head.append(script);
  }

  function animate(now){
    if(!previous)previous=now;
    const elapsed=Math.min(50,now-previous);previous=now;
    if(lines.length&&groupWidth>1){distance=(distance+CONFIG.pixelsPerSecond*elapsed/1000)%groupWidth;track.style.transform=`translate3d(${-distance}px,0,0)`}
    requestAnimationFrame(animate);
  }

  acceptCurrentLines();document.fonts.ready.then(rebuild);
  setInterval(reloadGatorFile,CONFIG.reloadEveryMs);
  requestAnimationFrame(animate);
})();
