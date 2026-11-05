(()=>{
'use strict';
const VENUES={
 kimmel:{name:'Kimmel Center',address:'60 Washington Square South',arrival:'Kimmel Center, 60 Washington Square South.'},
 wwh:{name:'Warren Weaver Hall',address:'251 Mercer Street · First floor',arrival:'Warren Weaver Hall, 251 Mercer Street. Enter from Mercer Street. First floor.'}
};
const TRAVEL_MS=2200,EXIT_MS=160;
let current=null,announcer=null;
function announce(message){
 if(!document.body)return;
 if(!announcer){announcer=document.createElement('div');announcer.className='venue-flight-announcer';announcer.setAttribute('role','status');announcer.setAttribute('aria-live','polite');announcer.setAttribute('aria-atomic','true');document.body.appendChild(announcer);}
 announcer.textContent=message;
}
function finish(reason='finished',restoreFocus=true){
 const flight=current;if(!flight)return;
 current=null;cancelAnimationFrame(flight.frame);clearTimeout(flight.timer);
 const heldFocus=flight.node.contains(document.activeElement);
 flight.node.remove();
 if(restoreFocus&&heldFocus&&flight.returnFocus?.isConnected)flight.returnFocus.focus({preventScroll:true});
 document.dispatchEvent(new CustomEvent('conference:venue-flight-end',{detail:{from:flight.from,to:flight.to,reason}}));
}
function fly(from,to){
 if(!VENUES[from]||!VENUES[to]||from===to)return;
 if(current?.from===from&&current?.to===to)return;
 const focused=document.activeElement;
 const returnFocus=current?.node.contains(focused)?current.returnFocus:focused;
 finish('replaced',false);announce(VENUES[to].arrival);
 if(document.visibilityState==='hidden'||matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.dispatchEvent(new CustomEvent('conference:venue-flight-end',{detail:{from,to,reason:document.visibilityState==='hidden'?'hidden':'reduced-motion'}}));return;
 }
 const neighborhood=window.ConferenceNeighborhood;
 if(!neighborhood){document.dispatchEvent(new CustomEvent('conference:venue-flight-end',{detail:{from,to,reason:'unavailable'}}));return;}
 const apocalypse=document.body.dataset.style==='apocalypse',duration=apocalypse?3200:TRAVEL_MS;
 const viaGould=from==='wwh'&&to==='kimmel'&&document.body.dataset.day==='sunday-late';
 const caption=to==='wwh'?'Washington Square South / West 4th → Mercer Street entrance':viaGould?'Gould Plaza → West 4th / Washington Square South':'Mercer Street → West 4th / Washington Square South';
 const venue=VENUES[to],node=document.createElement('section');
 node.className='venue-flight';node.dataset.to=to;node.dataset.route=viaGould?'gould':'mercer';node.setAttribute('role','region');node.setAttribute('aria-label',`Changing venue to ${venue.name}`);
 node.innerHTML=`<div class="venue-flight-card"><div class="venue-flight-heading"><div><p class="venue-flight-kicker">Next venue</p><h2>${venue.name}</h2><p class="venue-flight-address">${venue.address}</p></div><button class="venue-flight-skip" type="button">Skip</button></div><div class="venue-flight-stage">${neighborhood.scene({routeTo:to,animated:true,apocalypse,viaGould})}<span class="venue-flight-street"></span>${apocalypse?'<span class="venue-flight-scream">Ahhhhhhhhhhhhhh!!!!!</span>':''}</div><p class="venue-flight-caption">${caption}</p></div>`;
 document.body.appendChild(node);
 const map=node.querySelector('.neighborhood-map'),path=node.querySelector('.venue-flight-route'),traveler=node.querySelector('.venue-flight-traveler'),street=node.querySelector('.venue-flight-street');
 map.classList.add('venue-flight-map');map.setAttribute('aria-hidden','true');map.setAttribute('focusable','false');
 const frameBox=map.getBoundingClientRect(),viewWidth=600,viewHeight=viewWidth*(frameBox.width>0&&frameBox.height>0?frameBox.height/frameBox.width:.75),length=path.getTotalLength();
 node.style.setProperty('--runner-clearance',`${47*frameBox.width/viewWidth+8}px`);
 path.style.strokeDasharray=`${length} ${length}`;
 const start=performance.now(),flight={node,from,to,returnFocus,frame:0,timer:null};current=flight;
 node.querySelector('.venue-flight-skip').addEventListener('click',()=>finish('skipped'));
 function draw(now){
  if(current!==flight)return;
  const fraction=Math.min(1,Math.max(0,(now-start)/duration)),progress=fraction*fraction*(3-2*fraction),distance=progress*length,point=path.getPointAtLength(distance);
  map.setAttribute('viewBox',`${point.x-viewWidth/2} ${point.y-viewHeight/2} ${viewWidth} ${viewHeight}`);
  traveler.setAttribute('transform',`translate(${point.x} ${point.y})`);path.style.strokeDashoffset=String(length-distance);
  street.textContent=point.y>330?(viaGould?'Gould Plaza':'Mercer Street'):point.x>=630?'West 4th Street':'Washington Square South';
  if(fraction<1)flight.frame=requestAnimationFrame(draw);
  else{node.classList.add('venue-flight--leaving');flight.timer=setTimeout(()=>{if(current===flight)finish('finished');},EXIT_MS);}
 }
 draw(start);
}
document.addEventListener('conference:venue',event=>fly(event.detail?.from,event.detail?.to));
document.addEventListener('keydown',event=>{if(current&&event.key==='Escape'){event.preventDefault();finish('skipped');}});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')finish('hidden',false);});
document.addEventListener('kimmel:mood',()=>finish('mood-changed',false));
window.addEventListener('pagehide',()=>finish('hidden',false));
})();
