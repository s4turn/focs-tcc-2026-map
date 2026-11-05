(()=>{
'use strict';
// Street relationships checked against NYU's campus map and 2024 NYS aerials.
// Distances are compressed; the compass accounts for the local street grid.
const points={kimmel:{x:355,y:306},wwh:{x:880,y:390}};
// Incoming visitors use Mercer. The Sunday workshop departure may leave through Gould Plaza.
const route=(to,{viaGould=false}={})=>to==='kimmel'?(viaGould?'M785 390 V320 Q785 306 771 306 H355':'M880 390 V320 Q880 306 866 306 H355'):'M355 306 H866 Q880 306 880 320 V390';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function label(x,y,lines,kind='',size=25){return `<text class="neighborhood-label ${kind}" x="${x}" y="${y}" text-anchor="middle" font-size="${size}">${lines.map((line,i)=>`<tspan x="${x}" dy="${i?size*1.13:0}">${esc(line)}</tspan>`).join('')}</text>`;}
function face(x,y,s=1){return `<g class="neighborhood-face" transform="translate(${x} ${y}) scale(${s})"><ellipse cx="-20" cy="7" rx="6" ry="3" class="neighborhood-cheek"/><ellipse cx="20" cy="7" rx="6" ry="3" class="neighborhood-cheek"/><circle cx="-10" cy="0" r="3"/><circle cx="10" cy="0" r="3"/><path d="M-6 7 Q0 16 6 7"/></g>`;}
function flame(x,y,scale,phase){
 const shapes=[
  ['M-20 0 H20 V-8 H28 V-24 H20 V-36 H12 V-44 H4 V-64 H-4 V-52 H-12 V-36 H-20 V-44 H-28 V-24 H-24 V-8 H-20 Z','M-12 0 H12 V-8 H20 V-20 H12 V-28 H4 V-44 H-4 V-32 H-12 V-20 H-20 V-12 H-12 Z','M-4 0 H4 V-8 H12 V-16 H4 V-28 H-4 V-16 H-12 V-8 H-4 Z'],
  ['M-20 0 H20 V-8 H24 V-24 H16 V-48 H8 V-36 H0 V-56 H-8 V-68 H-16 V-44 H-24 V-28 H-28 V-12 H-20 Z','M-12 0 H12 V-8 H16 V-20 H8 V-28 H0 V-44 H-8 V-32 H-16 V-16 H-12 Z','M-4 0 H4 V-8 H8 V-16 H0 V-28 H-8 V-16 H-12 V-8 H-4 Z']
 ];
 const frame=(paths,i)=>`<g class="flight-flame-frame flight-flame-frame--${i?'b':'a'}">${paths.map((d,n)=>`<path class="flight-flame-${['outer','inner','core'][n]}" d="${d}"/>`).join('')}</g>`;
 // Two hand-drawn, right-angled pixel frames; no curved fire silhouettes.
 return `<g class="flight-flame-wrap" shape-rendering="crispEdges" transform="translate(${x} ${y})"><g transform="scale(${scale})"><g class="flight-flame" style="--flame-delay:-${phase%11/10}s;--flame-speed:${.6+phase%5/10}s">${shapes.map(frame).join('')}</g></g></g>`;
}
function roofFire({x,y,w,d,h},i){
 let fire='';
 for(let n=0;n<Math.max(2,Math.ceil(w/32));n++){
  const fx=x+10+n*(w-15)/Math.max(1,Math.ceil(w/32)-1);
  fire+=flame(fx,y-h+d*.25,.65+(n+i)%3*.17,n+i*3);
  fire+=flame(fx+4,y-h+d*.83,.75+(n+i)%4*.12,n+i*5+2);
 }
 for(let n=0;n<3;n++){const u=8+n*4;fire+=`<g class="flight-smoke" transform="translate(${x+w/2+n*9} ${y-h+d*.38})"><path class="flight-smoke-puff" d="M-${u} 0 V-${u} H-${u*2} V-${u*2} H-${u} V-${u*3} H${u} V-${u*2} H${u*2} V-${u} H${u} V0 Z" style="--smoke-delay:-${(i+n)%6/3}s"/></g>`;}
 return fire;
}
function runnerFrame(pose){
 const colors={skin:'#ffd2a6',hair:'#513646',ink:'#211a22',shirt:'#9bd6cf',shade:'#5eaaa7',pants:'#e9d6f2',back:'#baabc9',shoe:'#403349',sweat:'#b3e5ef'};
 const cells=new Map();
 const fill=(x,y,w,h,tone)=>{for(let row=y;row<y+h;row++)for(let col=x;col<x+w;col++)cells.set(`${col},${row}`,colors[tone]);};
 // A deliberately coarse 12 by 19 pixel silhouette, with hands above the head.
 fill(1,1,2,2,'skin');fill(2,3,1,4,'skin');fill(3,6,1,4,'skin');
 fill(9,1,2,2,'skin');fill(8,3,1,4,'skin');fill(7,6,1,4,'skin');
 fill(3,3,6,2,'hair');fill(4,4,4,5,'skin');fill(4,4,4,1,'hair');
 fill(4,6,1,1,'ink');fill(7,6,1,1,'ink');fill(5,7,2,2,'ink');
 fill(5,9,2,1,'skin');fill(3,10,6,3,'shirt');fill(3,11,2,2,'shade');
 if(pose===0){fill(6,13,2,2,'back');fill(8,14,2,1,'back');fill(9,15,2,1,'shoe');fill(3,13,2,3,'pants');fill(2,15,2,2,'pants');fill(1,17,4,1,'shoe');}
 else{fill(3,13,2,2,'back');fill(1,14,2,1,'back');fill(1,15,2,1,'shoe');fill(6,13,2,3,'pants');fill(7,15,2,2,'pants');fill(7,17,4,1,'shoe');}
 fill(pose?1:10,5,1,1,'sweat');
 const border=new Set();for(const key of cells.keys()){const[x,y]=key.split(',').map(Number);for(const[dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]])if(!cells.has(`${x+dx},${y+dy}`))border.add(`${x+dx},${y+dy}`);}
 const pixel=(key,color)=>{const[x,y]=key.split(',');return `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`;};
 return [...border].map(key=>pixel(key,colors.ink)).join('')+[...cells].map(([key,color])=>pixel(key,color)).join('');
}
function runner(to){return `<g class="flight-runner flight-runner--pixel" shape-rendering="crispEdges" style="--runner-facing:${to==='kimmel'?-1:1}"><rect class="flight-runner-shadow" x="-13" y="18" width="26" height="3"/><g class="flight-runner-bounce" transform="translate(-18 -40)"><g transform="scale(3)"><g class="flight-runner-frame flight-runner-frame--a">${runnerFrame(0)}</g><g class="flight-runner-frame flight-runner-frame--b">${runnerFrame(1)}</g></g></g></g>`;}

function building({id,x,y,w,d,h,tone='lilac',name,kind='',labelX=x+w/2+7,labelY=y+d+35,labelSize=23}){
 const roofY=y-h,frontY=y+d-h;
 // x/y anchor the ground mass. Check the entire drawn envelope, including the
 // raised roof (y-h), oblique east wall (+14), and short shadow (+16/+10).
 let art=`<g class="neighborhood-building neighborhood-building--${tone} ${kind}" data-landmark="${id}"><title>${esc(name.join(' '))}</title><path class="neighborhood-shadow" d="M${x+8} ${y+d} H${x+w+14} l2 10 H${x+10} Z"/><path class="neighborhood-side" d="M${x+w} ${roofY} l14 ${h} v${d} l-14 -${h} Z"/><path class="neighborhood-front" d="M${x} ${frontY} H${x+w} l14 ${h} H${x+14} Z"/><rect class="neighborhood-roof" x="${x}" y="${roofY}" width="${w}" height="${d}" rx="7"/>`;
 if(id==='bobst'){
  art+=`<rect class="neighborhood-solar" x="${x+15}" y="${roofY+18}" width="${w-30}" height="${d-40}" rx="3"/>`;
  for(let c=1;c<5;c++)art+=`<path class="neighborhood-grid" d="M${x+15+(w-30)*c/5} ${roofY+18} v${d-40}"/>`;
  for(let r=1;r<6;r++)art+=`<path class="neighborhood-grid" d="M${x+15} ${roofY+18+(d-40)*r/6} h${w-30}"/>`;
 }else if(id==='kimmel'){
  art+=`<rect class="neighborhood-terrace" x="${x+8}" y="${roofY+18}" width="${w-16}" height="${d-37}" rx="8"/><path class="neighborhood-bay" d="M${x+7} ${frontY+10} Q${x+w/2} ${frontY+4} ${x+w-3} ${frontY+10} l9 ${h-17} Q${x+w/2+10} ${y+d+1} ${x+16} ${y+d-7} Z"/><path class="neighborhood-window" d="M${x+11} ${frontY+23} h${w-15} M${x+14} ${frontY+37} h${w-15}"/>`;
 }else if(id==='gcasl'){
  art+=`<rect class="neighborhood-terrace" x="${x+5}" y="${roofY+12}" width="${w-10}" height="${d-27}" rx="4"/>`;
  for(let r=1;r<3;r++)art+=`<path class="neighborhood-window" d="M${x+8+r*2} ${frontY+r*11} h${w-9}"/>`;
 }else{
  for(let r=1;r<Math.min(5,Math.ceil(h/12));r++)art+=`<path class="neighborhood-window" d="M${x+12+r*2} ${frontY+r*11} h${w-16}"/>`;
  if(id==='wwh'){
   // Projecting bays form one shallow band immediately below the roof.
   // Repetition follows the facade's length, not multiple storeys.
   art+='<g class="neighborhood-top-bays" data-bay-band="top">';
   for(let bay=14;bay<d-16;bay+=29){
    art+=`<path class="neighborhood-bay" d="M${x+w+1} ${roofY+bay+2} l2 8 l5 3 l-2 -8 Z"/><path class="neighborhood-bay-seam" d="M${x+w+4} ${roofY+bay+5} l2 8"/>`;
   }
   for(const bay of [6,19])art+=`<path class="neighborhood-bay" d="M${x+bay} ${frontY+2} h8 l2 8 l-3 3 h-5 l-2 -8 Z"/>`;
   art+='</g>';
  }
 }
 art+=face(x+w/2+7,frontY+h*.52,Math.min(1,w/72));
 art+='</g>';
 return {art,label:label(labelX,labelY,name,id==='kimmel'||id==='wwh'?'neighborhood-venue-name':'',labelSize)};
}
function scene({routeTo='wwh',animated=false,apocalypse=false,viaGould=false}={}){
 const houses=[
  {id:'vanderbilt',x:10,y:362,w:46,d:188,h:34,tone:'stone',name:['Vanderbilt','Hall'],labelX:42,labelY:588,labelSize:18},
  {id:'judson',x:147,y:364,w:70,d:182,h:36,tone:'stone',name:['Judson','Church'],labelX:189,labelY:580,labelSize:21},
  {id:'gcasl',x:307,y:365,w:27,d:177,h:37,tone:'stone',name:['Global Center for','Academic & Spiritual Life'],labelX:301,labelY:676,labelSize:18},
  {id:'kimmel',x:334,y:383,w:48,d:177,h:55,tone:'lilac',name:['Kimmel'],labelX:369,labelY:593,labelSize:24},
  {id:'bobst',x:470,y:383,w:110,d:182,h:55,tone:'brick',name:['Bobst','Library'],labelX:532,labelY:586,labelSize:22},
  {id:'kaufman',x:668,y:364,w:50,d:181,h:32,tone:'stone',name:['Kaufman'],labelX:684,labelY:582,labelSize:20},
  {id:'tisch',x:738,y:527,w:65,d:40,h:23,tone:'stone',name:['Tisch'],labelX:768,labelY:612,labelSize:21},
  {id:'wwh',x:800,y:393,w:33,d:174,h:65,tone:'peach',name:['WWH'],labelX:823,labelY:585,labelSize:25}
 ].map((house,i)=>({...building(house),fire:roofFire(house,i)}));
 let s=`<svg class="neighborhood-map" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 720" ${animated?'aria-hidden="true" focusable="false"':'role="img" aria-label="Neighborhood schematic: the Global Center for Academic and Spiritual Life adjoins Kimmel on its west, Thompson Street side. Kimmel is west of LaGuardia Place, Bobst east of it, then Washington Square East and Gould Plaza, with WWH west of Mercer Street. Washington Square Park is across Washington Square South; West 3rd Street is one block south."'}>
 <rect class="neighborhood-ground" x="-600" y="-600" width="2300" height="1900"/>
 <rect class="neighborhood-park" x="-55" y="-140" width="668" height="385" rx="30"/>
 <path class="neighborhood-park-path" d="M15 32 L535 205 M35 210 L534 5 M355 -40 V230 M-30 102 H608"/>
 <circle class="neighborhood-fountain-rim" cx="355" cy="102" r="43"/><circle class="neighborhood-water" cx="355" cy="102" r="26"/>
 ${[[42,42],[118,180],[232,31],[478,48],[552,154],[50,157],[497,201]].map(([x,y])=>`<g class="neighborhood-tree"><path d="M${x} ${y+18} v-19"/><circle cx="${x}" cy="${y}" r="16"/><circle cx="${x+10}" cy="${y-8}" r="12"/></g>`).join('')}
 <path class="neighborhood-road-edge" d="M-200 280 H1250 M-200 630 H1250 M105 280 V950 M270 280 V950 M430 280 V950 M630 -400 V280 M760 -400 V280 M880 -400 V950"/>
 <path class="neighborhood-road" d="M-200 280 H1250 M-200 630 H1250 M105 280 V950 M270 280 V950 M430 280 V950 M630 -400 V280 M760 -400 V280 M880 -400 V950"/>
 <path class="neighborhood-pedestrian" d="M630 315 V590"/>
 <rect class="neighborhood-plaza" x="734" y="328" width="65" height="149" rx="8"/>
 <path class="neighborhood-plaza-paving" d="M740 355 H792 M740 391 H792 M740 427 H792 M758 335 V469 M781 335 V469"/>
 <g class="neighborhood-crosswalks">${[270,430,630,760,880].map(x=>`<path d="M${x-18} 255 v48 M${x-9} 255 v48 M${x} 255 v48 M${x+9} 255 v48 M${x+18} 255 v48"/>`).join('')}</g>
 ${houses.map(h=>h.art).join('')}
 ${animated&&apocalypse?`<g class="flight-city-fire">${houses.map(h=>h.fire).join('')}${[[118,180],[232,31],[552,154],[497,201]].map(([x,y],i)=>flame(x,y+12,.6,i+30)).join('')}</g>`:''}
 <g class="neighborhood-street-signs">
 ${label(205,273,['Washington Square South'],'neighborhood-street',22)}
 ${label(738,273,['West 4th Street'],'neighborhood-street',22)}
 ${label(532,638,['West 3rd Street'],'neighborhood-street',25)}
 ${[[105,'Sullivan St.'],[270,'Thompson St.'],[430,'LaGuardia Pl.']].map(([x,name])=>`<g transform="translate(${x} 454) rotate(-90)">${label(0,0,[name],'neighborhood-street',22)}</g>`).join('')}
 <g transform="translate(630 118) rotate(-90)">${label(0,0,['Washington Sq. East'],'neighborhood-street',22)}</g>
 <g transform="translate(760 120) rotate(-90)">${label(0,0,['Greene Street'],'neighborhood-street',22)}</g>
 <g transform="translate(880 120) rotate(-90)">${label(0,0,['Mercer Street'],'neighborhood-street',25)}</g>
 <g transform="translate(630 454) rotate(-90)">${label(0,0,['Schwartz Plaza'],'neighborhood-plaza-name',20)}</g>
 </g>
 ${label(190,116,['Washington','Square Park'],'neighborhood-park-name',28)}
 ${label(767,377,['Gould','Plaza'],'neighborhood-plaza-name',21)}
 <path class="neighborhood-building-leader" d="M320 551 V654 H301 V661"/>
 ${houses.map(h=>h.label).join('')}
 <g class="neighborhood-compass" transform="translate(969 142)"><path d="M0 0 L-27 -47 M-27 -47 l-1 20 M-27 -47 l17 10"/>${label(-35,-60,['N'],'',25)}</g>
 <path d="${route(routeTo,{viaGould})}" class="venue-flight-route-base neighborhood-route-base"/>
 ${animated?`<path d="${route(routeTo,{viaGould})}" class="venue-flight-route"/><g class="venue-flight-traveler">${apocalypse?runner(routeTo):`<circle r="20" class="venue-flight-halo"/><circle r="10" class="venue-flight-traveler-body"/><circle cx="-3" cy="-1" r="1" class="venue-flight-face"/><circle cx="3" cy="-1" r="1" class="venue-flight-face"/><path d="M-2 3 q2 3 4 0" class="venue-flight-smile"/>`}</g>`:`<g class="neighborhood-pins"><circle cx="${points.kimmel.x}" cy="${points.kimmel.y}" r="10"/><circle cx="${points.wwh.x}" cy="${points.wwh.y}" r="10"/></g>`}
 </svg>`;
 return s;
}
window.ConferenceNeighborhood=Object.freeze({scene,route,points});
let pendingCenter=true;
function center(){
 if(!pendingCenter)return;
 const frame=document.getElementById('neighborhood-map'),map=frame?.querySelector('svg');
 if(!frame?.clientWidth||!map?.getBoundingClientRect().width)return;
 const point=points[frame.dataset.venue]||points.kimmel;
 frame.scrollLeft=Math.max(0,point.x/1024*map.getBoundingClientRect().width-frame.clientWidth/2);
 pendingCenter=false;
}
function render(){
 const frame=document.getElementById('neighborhood-map');if(!frame)return;
 const venue=document.body.dataset.venue||'kimmel';
 if(frame.dataset.venue!==venue||!frame.firstElementChild){frame.dataset.venue=venue;frame.innerHTML=scene({routeTo:venue==='wwh'?'wwh':'kimmel'});pendingCenter=true;}
 // On a phone, start with the current building in view; the whole block is pannable.
 center();
}
document.addEventListener('kimmel:day',render);
document.addEventListener('kimmel:view',event=>{if(event.detail?.view==='map')center();});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
})();
