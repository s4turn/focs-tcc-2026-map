(()=>{
'use strict';
// Independent uniform 2–6 second waits give one utterance every 4 seconds on average.
const SPEECH_MIN_MS=2000;
const SPEECH_MAX_MS=6000;
const SPEECH_DURATION_MIN_MS=1400;
const SPEECH_DURATION_MAX_MS=1900;
const PHRASES=['data','lemma'];
const GAME_URL='https://s4turn.github.io/lemma-debt/';
const MAX_WALKERS=48,MAX_GUTS=16,GUTS_MS=5000,WALKER_SIZE=44;
const app=document.querySelector('.app');
let ambient=null,speechTimer=null,bubbleTimer=null,layoutFrame=null,followUntil=0,spawnSerial=0,routeLayout=null;
const gutsTimers=new Map(),walkerLayouts=new WeakMap(),flameLayouts=new WeakMap();
const randomInt=(min,max)=>Math.floor(min+Math.random()*(max-min+1));
const active=()=>document.body.dataset.style==='apocalypse';
const visible=()=>document.visibilityState!=='hidden';
const flameSvg='<svg viewBox="0 0 16 24" aria-hidden="true" focusable="false" shape-rendering="crispEdges"><path fill="#E56A36" d="M7 0h2v4h2v4h2v4h2v8h-2v2H3v-2H1v-8h2V8h2v6h2z"/><path fill="#F6A64D" d="M7 7h2v5h2v3h2v5h-2v2H5v-2H3v-4h2v-3h2z"/><path fill="#FFE090" d="M7 14h2v3h2v4H5v-4h2z"/></svg>';
const zombieSvg='<svg class="zombie-sprite" viewBox="0 0 30 42" aria-hidden="true" focusable="false" shape-rendering="crispEdges"><path fill="var(--zombie-shirt,#866D65)" d="M9 17h11v3h3v11h-5v2H8V21h1z"/><path fill="#94B38A" d="M11 2h12v2h2v10h-2v3H11v-3H9V4h2z"/><path fill="#6D8D67" d="M11 2h12v3H11zm12 10h2v4h-3z"/><path fill="#F3DFAC" d="M13 8h4v4h-4zm7 0h4v4h-4z"/><path fill="#273A2E" d="M15 10h2v2h-2zm7 0h2v2h-2zm-6 5h6v2h-6z"/><path fill="#94B38A" d="M9 21h4v4h8v4H10v-2H7v-6zm10-1h6v4h-6z"/><path fill="#465B54" d="M8 31h6v8H7v-3h1zm10 0h5v5h2v4h-8v-4h1z"/><path fill="#273B35" d="M5 38h9v4H5zm12 1h10v3H17z"/><rect x="19" y="14" width="10" height="15" fill="#70E9D6" opacity=".25"/><rect x="20" y="15" width="8" height="13" fill="#172F36"/><rect class="zombie-phone-screen" x="21" y="17" width="6" height="8" fill="#75F3E2"/><rect x="22" y="18" width="3" height="2" fill="#FFF4A1"/><rect x="23" y="26" width="2" height="1" fill="#A4C8C3"/><path fill="#94B38A" d="M19 24h2v3h-2zm8-1h2v4h-2z"/></svg>';
const gutsSvg='<svg viewBox="0 0 32 24" aria-hidden="true" focusable="false" shape-rendering="crispEdges"><path fill="#59343b" d="M4 17h24v4H4zM0 4h4v4H0zm27-3h4v4h-4zM8 0h3v3H8z"/><path fill="#b85c69" d="M4 15h5v-4h6v3h5v-5h5v7h4v4H3v-3h1zM2 5h4v4H2zm23-2h4v4h-4zM12 3h3v4h-3z"/><path fill="#e7949d" d="M7 14h4v4H7zm6 2h6v4h-6zm9-5h3v5h-3zM3 5h2v2H3z"/><path fill="#94b38a" d="M1 13h4v3H1zm26-3h4v4h-4zM18 2h3v3h-3z"/></svg>';
// Endpoints lie strictly inside the two street polygons used by app.js.
const STREET_ROUTES=[
 {street:'Washington Square South',from:[-10,-48],to:[185,-48]},
 {street:'Washington Square South',from:[245,-76],to:[60,-76]},
 {street:'LaGuardia Place',from:[309,45],to:[309,300]},
 {street:'LaGuardia Place',from:[332,350],to:[332,100]}
];
function removeSpeech(){
 clearTimeout(bubbleTimer);bubbleTimer=null;
 ambient?.querySelectorAll('.zombie-speech').forEach(node=>node.remove());
}
function clearSpeechTimer(){clearTimeout(speechTimer);speechTimer=null;removeSpeech();}
function scheduleSpeech(){
 clearTimeout(speechTimer);speechTimer=null;
 if(!active()||!visible()||!ambient||document.body.dataset.view==='program')return;
 speechTimer=setTimeout(()=>{
  if(!active()||!visible()||!ambient||document.body.dataset.view==='program')return;
  removeSpeech();
  const walkers=ambient.querySelectorAll('.zombie-walker');
  const walker=walkers[randomInt(0,walkers.length-1)];
  const bubble=document.createElement('span');
  bubble.className='zombie-speech';bubble.setAttribute('aria-hidden','true');bubble.textContent=PHRASES[randomInt(0,PHRASES.length-1)];
  if(walker.getBoundingClientRect().left>innerWidth/2)bubble.classList.add('speech-left');
  walker.appendChild(bubble);
  bubbleTimer=setTimeout(removeSpeech,randomInt(SPEECH_DURATION_MIN_MS,SPEECH_DURATION_MAX_MS));
  scheduleSpeech();
 },randomInt(SPEECH_MIN_MS,SPEECH_MAX_MS));
}
function addFlame(){
 const node=document.createElement('span');node.className='ambient-flame';node.setAttribute('aria-hidden','true');node.innerHTML=flameSvg;
 node.style.setProperty('--fire-delay',`${-randomInt(0,1300)}ms`);
 node.style.setProperty('--fire-scale',String(randomInt(75,115)/100));
 ambient.appendChild(node);return node;
}
function spawnWalker(routeIndex,{game=false}={}){
 const index=spawnSerial++,route=((routeIndex%STREET_ROUTES.length)+STREET_ROUTES.length)%STREET_ROUTES.length;
 const walker=document.createElement(game?'a':'button');
 walker.className=`zombie-walker zombie-${route} ${game?'zombie-game':'zombie-pop'}`;
 walker.dataset.route=String(route);walker.innerHTML=zombieSvg;
 if(index>=4)walker.style.animationDelay=`-${(index*3.7)%19}s`;
 walker.style.setProperty('--zombie-shirt',['#866D65','#64857A','#967359','#7F6E84'][index%4]);
 if(game){
  walker.href=GAME_URL;walker.target='_blank';walker.rel='noopener';walker.setAttribute('aria-label','Play Lemma Debt');
  const hint=document.createElement('span');hint.className='zombie-game-hint';hint.setAttribute('aria-hidden','true');hint.textContent='lemma?';walker.appendChild(hint);
 }else{
  walker.type='button';walker.setAttribute('aria-label','Pop zombie');
  walker.addEventListener('click',()=>popZombie(walker));
 }
 ambient.appendChild(walker);return walker;
}
function removeGuts(spill){
 clearTimeout(gutsTimers.get(spill));gutsTimers.delete(spill);spill.remove();
}
function popZombie(walker){
 if(!active()||!visible()||!ambient?.contains(walker)||document.body.dataset.view==='program')return;
 const a=app.getBoundingClientRect(),r=walker.getBoundingClientRect();
 let restoreFocus=walker.contains(document.activeElement);
 const route=Number(walker.dataset.route),spill=document.createElement('span');
 spill.className='zombie-guts';spill.setAttribute('aria-hidden','true');spill.innerHTML=gutsSvg;
 spill.style.left=`${r.left+r.width/2-a.left}px`;spill.style.top=`${r.bottom-a.top}px`;
 walker.remove();ambient.appendChild(spill);
 gutsTimers.set(spill,setTimeout(()=>removeGuts(spill),GUTS_MS));
 while(gutsTimers.size>MAX_GUTS)removeGuts(gutsTimers.keys().next().value);
 // Make room for both offspring while keeping phones at a fixed sprite budget.
 // Retire older roaming zombies first; the Lemma Debt entrance always survives.
 let count=ambient.querySelectorAll('.zombie-walker').length;
 for(const retired of ambient.querySelectorAll('.zombie-pop')){
  if(count<=MAX_WALKERS-2)break;
  if(retired.contains(document.activeElement))restoreFocus=true;
  retired.remove();count--;
 }
 const spawned=[];
 for(let n=0;n<2;n++)spawned.push(spawnWalker(route+n));
 queueLayout();
 if(restoreFocus)spawned[0]?.focus({preventScroll:true});
}
function mount(){
 if(ambient||!app)return;
 ambient=document.createElement('div');ambient.className='apocalypse-ambient';spawnSerial=0;
 for(let i=0;i<48;i++)addFlame();
 for(let i=0;i<4;i++)spawnWalker(i,{game:i===0});
 app.appendChild(ambient);queueLayout(1000);scheduleSpeech();
}
function stop(){
 clearSpeechTimer();if(layoutFrame)cancelAnimationFrame(layoutFrame);layoutFrame=null;followUntil=0;
 gutsTimers.forEach(clearTimeout);gutsTimers.clear();
 ambient?.remove();ambient=null;routeLayout=null;
}
function rectFor(selector,origin){
 const node=document.querySelector(selector);if(!node)return null;
 const r=node.getBoundingClientRect();
 if(r.width<1||r.height<1)return null;
 return {left:r.left-origin.left,top:r.top-origin.top,width:r.width,height:r.height};
}
function layout(){
 if(!ambient)return;
 const origin=app.getBoundingClientRect(),maxX=app.clientWidth-4,positions=[],rects=new Map();
 const readRect=selector=>{if(!rects.has(selector))rects.set(selector,rectFor(selector,origin));return rects.get(selector);};
 const surround=(selector,fractions,offset=0)=>{const r=readRect(selector);if(!r)return;for(const[x,y]of fractions)positions.push([r.left+r.width*x,r.top+r.height*y+offset]);};
 surround('header',[[.01,.9],[.99,.9],[.32,1],[.66,1]],6);
 surround('#days',[[0,.9],[.2,1],[.4,1],[.6,1],[.8,1],[1,.9]],8);
 surround('#floor-selector',[[0,.7],[1,.7],[.25,1],[.75,1]],5);
 surround('#building',[[.03,.12],[.97,.12],[.03,.35],[.97,.35],[.03,.62],[.97,.62],[.1,.88],[.9,.88]],0);
 surround('#building .floor-layer.selected-floor',[[.08,.78],[.24,.9],[.43,1],[.62,.9],[.82,.75],[.94,.5],[.77,.2],[.55,.05]],0);
 surround('.detail-panel',[[.01,.05],[.99,.05],[.01,.45],[.99,.45],[.06,.97],[.94,.97]],3);
 surround('#room-list',[[0,.9],[1,.9],[.4,1]],7);
 surround('.selection',[[0,.12],[1,.12],[.98,.95]],2);
 surround('footer',[[0,1],[.35,1],[.65,1],[1,1]],4);
 // Collect every geometry read before changing positions. Each landmark, including
 // the building shared by flames and walkers, is measured only once per layout.
 const map=readRect('#building'),walkers=ambient.querySelectorAll('.zombie-walker');
 ambient.querySelectorAll('.ambient-flame').forEach((node,i)=>{
  const spot=positions[i],hidden=!spot;if(node.hidden!==hidden)node.hidden=hidden;
  if(spot){
   const left=`${Math.max(4,Math.min(maxX,spot[0]))}px`,top=`${spot[1]}px`,key=`${left}/${top}`;
   if(flameLayouts.get(node)!==key){node.style.left=left;node.style.top=top;flameLayouts.set(node,key);}
  }
 });
 const venue=document.body.dataset.venue||'kimmel',key=map?`${venue}/${map.left}/${map.top}/${map.width}/${map.height}`:null;
 if(map&&routeLayout?.key!==key){
  const project=([x,y])=>({x:map.left+(488-.70*x-.70*y+45)*map.width/750,y:map.top+(700+.35*x-.35*y+35)*map.height/965});
  routeLayout={key,routes:STREET_ROUTES.map((route,index)=>{
   const start=project(route.from),end=project(route.to);
   // The CSS hit target stays 44×44 even when the visible sprite is smaller.
   return {left:`${start.x-WALKER_SIZE/2}px`,top:`${start.y-WALKER_SIZE}px`,x:`${end.x-start.x}px`,y:`${end.y-start.y}px`,street:venue==='wwh'?(index<2?'West 4th Street':'Mercer Street'):route.street};
  })};
 }
 walkers.forEach(node=>{
  const hidden=!map;if(node.hidden!==hidden)node.hidden=hidden;
  if(hidden||walkerLayouts.get(node)===key)return;
  const route=routeLayout.routes[Number(node.dataset.route)];node.dataset.street=route.street;
  node.style.left=route.left;node.style.top=route.top;
  node.style.setProperty('--roam-x',route.x);node.style.setProperty('--roam-y',route.y);
  walkerLayouts.set(node,key);
 });
}
function queueLayout(duration=0){
 if(!ambient||!visible())return;
 if(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches)duration=0;
 followUntil=Math.max(followUntil,performance.now()+duration);
 if(layoutFrame)return;
 const step=()=>{layoutFrame=null;if(!ambient||!visible())return;layout();if(performance.now()<followUntil)layoutFrame=requestAnimationFrame(step);};
 layoutFrame=requestAnimationFrame(step);
}
function sync(){if(active()){mount();ambient?.classList.toggle('ambient-paused',!visible());queueLayout(800);}else stop();}
document.addEventListener('kimmel:mood',sync);
document.addEventListener('kimmel:view',event=>{if(event.detail?.view==='program')clearSpeechTimer();else if(active())scheduleSpeech();queueLayout(900);});
document.addEventListener('click',event=>{if(!event.target.closest?.('.zombie-walker'))queueLayout(900);});
document.addEventListener('change',()=>queueLayout(900));
document.addEventListener('visibilitychange',()=>{
 if(!visible()){clearSpeechTimer();if(layoutFrame)cancelAnimationFrame(layoutFrame);layoutFrame=null;ambient?.classList.add('ambient-paused');}
 else if(active()){sync();scheduleSpeech();}
});
window.addEventListener('resize',()=>queueLayout(100));
window.addEventListener('pagehide',stop);
window.addEventListener('pageshow',sync);
new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['data-style']});
if(typeof ResizeObserver!=='undefined'&&app)new ResizeObserver(()=>queueLayout(60)).observe(app);
sync();
})();
