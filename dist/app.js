(()=>{
'use strict';
const DAYS=[
 {id:'sunday-early',short:'Sun',period:'<3PM',date:8,title:'Sunday <3PM · November 8',conference:'FOCS workshops · WWH',venue:'wwh',focs:false,tcc:false,note:'WWH · Rooms 101, 102 and 109. Workshops through 3 p.m.; coffee break 3–3:30 p.m. Later events are at Kimmel.'},
 {id:'sunday-late',short:'Sun',period:'≥3PM',date:8,title:'Sunday ≥3PM · November 8',conference:'FOCS workshops · Kimmel',venue:'kimmel',focs:false,tcc:false,note:'AI and TCS · 3:30–5:30 p.m., Eisner & Lubin, floor 4. Estimathon · 6–7:30 p.m., Shorin 802, floor 8.'},
 {id:'monday',short:'Mon',date:9,title:'Monday, November 9',conference:'FOCS',focs:true,tcc:false,solarium:'9 a.m.–2:30 p.m.',rosenthal:'8 a.m.–4 p.m.',note:'Track D · Room 914 today. Coffee · Solarium 409, floor 4.'},
 {id:'tuesday',short:'Tue',date:10,title:'Tuesday, November 10',conference:'FOCS + TCC',focs:true,tcc:true,solarium:'9 a.m.–10 p.m.',rosenthal:null,note:'Joint reception · Eisner & Lubin Auditorium, 7:30–10 p.m. Coffee · Solarium 409, floor 4.'},
 {id:'wednesday',short:'Wed',date:11,title:'Wednesday, November 11',conference:'FOCS + TCC',focs:true,tcc:true,solarium:'9 a.m.–5 p.m.',rosenthal:'8 a.m.–3 p.m.',note:'Joint Knuth lecture · Eisner & Lubin Auditorium. Coffee · Solarium 409, floor 4.'},
 {id:'thursday',short:'Thu',date:12,title:'Thursday, November 12',conference:'TCC',focs:false,tcc:true,rosenthal:null,note:'TCC · Room 914, floor 9. Coffee / refreshments — see daily signs.'},
 {id:'friday',short:'Fri',date:13,title:'Friday, November 13',conference:'TCC',focs:false,tcc:true,rosenthal:'8 a.m.–2 p.m.',note:'TCC · Room 914, floor 9. Coffee / refreshments — see daily signs.'}
];
const PALETTES={
 soft:{paper:'#FFF9ED',ink:'#173F3D',muted:'#53675F',primary:'#2E7771',onPrimary:'#FFF9ED',floor:'#FFFCF5',closed:'#DDE6DA',wall:'#F4E9D6',line:'#B9CDBD',sideN:'#C8D6C5',sideE:'#9FBDAF',stage:'#84AD9D',seats:'#5D9587',road:'#D8DFDA',walk:'#F2E5D2',park:'#D8E7B3',tree:'#90B47A',treeLight:'#ABC98B',glass:'#B7D7D8',wood:'#D4A87D',shadow:'#748F82',rooms:{A:'#BBD8C9',B:'#F3C3A9',C:'#ACD5DC',D:'#E6BD91',TCC:'#E6BD91',coffee:'#F4D982',entry:'#B8DDD5',neutral:'#EEE9DB'}},
 pixel:{paper:'#101C27',ink:'#ECF2DF',muted:'#AEC0B7',primary:'#83C9AB',onPrimary:'#101C27',floor:'#293D47',closed:'#334B58',wall:'#4C625F',line:'#6E8981',sideN:'#495F62',sideE:'#20333F',stage:'#42695E',seats:'#A9D5B9',road:'#24333F',walk:'#45524F',park:'#304D42',tree:'#62946B',treeLight:'#97BE7B',glass:'#598D9A',wood:'#A4835E',shadow:'#020C14',rooms:{A:'#365E5B',B:'#744F44',C:'#35596E',D:'#67513D',TCC:'#67513D',coffee:'#6B6139',entry:'#345E53',neutral:'#253A45'}},
 kawaii:{paper:'#FFF6F3',ink:'#634B5E',muted:'#806879',primary:'#B56A89',onPrimary:'#FFFCFA',floor:'#FFFCFA',closed:'#EEE5F1',wall:'#FAE8E5',line:'#D9C7D3',sideN:'#EFD7E0',sideE:'#DFD3EC',stage:'#D4C1E3',seats:'#B69AC3',road:'#E5E2EE',walk:'#F7E7E4',park:'#DFEED6',tree:'#B4D6BF',treeLight:'#DCECCD',glass:'#D0E6ED',wood:'#DBC0AB',shadow:'#C4AEC0',rooms:{A:'#E6DDF3',B:'#F5DCE2',C:'#D5E7EF',D:'#F4E0C9',TCC:'#F4E0C9',coffee:'#F7EBBE',entry:'#D8EADC',neutral:'#F7EFF2'}},
 hacker:{paper:'#081412',ink:'#D4F9DA',muted:'#8DB99B',primary:'#77E59B',onPrimary:'#081412',floor:'#132C25',closed:'#18372B',wall:'#2B5440',line:'#4A8A62',sideN:'#25543A',sideE:'#0B221C',stage:'#254C36',seats:'#97E8AD',road:'#0E211E',walk:'#294334',park:'#173F29',tree:'#357C46',treeLight:'#77B76E',glass:'#549F8C',wood:'#708C5B',shadow:'#000A04',rooms:{A:'#234D37',B:'#4B4B2A',C:'#234D4A',D:'#534833',TCC:'#534833',coffee:'#505B2B',entry:'#2B5437',neutral:'#173329'}},
 apocalypse:{paper:'#211A22',ink:'#FFE7C3',muted:'#D5B7A1',primary:'#F5A34A',onPrimary:'#211A22',floor:'#403335',closed:'#4A3D3B',wall:'#725349',line:'#A37A61',sideN:'#6A4B42',sideE:'#30262A',stage:'#4D6350',seats:'#BFD39E',road:'#252326',walk:'#63524B',park:'#3E5140',tree:'#729264',treeLight:'#A0B27D',glass:'#6F9290',wood:'#B78B5C',shadow:'#070707',rooms:{A:'#4F5950',B:'#774939',C:'#384F5B',D:'#6F5040',TCC:'#6F5040',coffee:'#746035',entry:'#425E50',neutral:'#332C30'}}
};
let P=PALETTES.pixel;
let COLORS=P.rooms;
const FLOORS=[10,9,4,1];
let ROOM_DATA={rooms:[]},PROGRAM_DATA=null;
const query=new URLSearchParams(location.search);
const state={day:0,floor:1,room:null,style:'pixel',mood:'auto',automaticDay:true,automaticLocation:true};
let pendingMapFocus=null;
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const currentDay=()=>DAYS[state.day];
const venueId=()=>currentDay().venue||'kimmel';
const currentDate=()=>`2026-11-${String(currentDay().date).padStart(2,'0')}`;
const activeFloors=()=>venueId()==='wwh'?[1]:currentDay().id==='sunday-late'?[10,9,8,4,1]:FLOORS;
const venueName=()=>venueId()==='wwh'?'Warren Weaver Hall':'Kimmel Center';
// Conference defaults use New York dates, independent of the visitor's timezone.
function nowInNewYork(now=new Date()){
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(part=>[part.type,part.value]));
 return {date:`${parts.year}-${parts.month}-${parts.day}`,minutes:Number(parts.hour)*60+Number(parts.minute),label:new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'numeric',minute:'2-digit'}).format(now)};
}
// NOAA's fractional-year solar-position approximation, evaluated in UTC (timezone=0).
// Fixed venue coordinates avoid geolocation and are independent of the visitor's timezone.
// Source: https://gml.noaa.gov/grad/solcalc/solareqns.PDF
function venueSolarZenith(now=new Date()){
 const year=now.getUTCFullYear(),yearStart=Date.UTC(year,0,1),day=Math.floor((now.getTime()-yearStart)/86400000)+1;
 const days=(Date.UTC(year+1,0,1)-yearStart)/86400000,hour=now.getUTCHours()+now.getUTCMinutes()/60+now.getUTCSeconds()/3600+now.getUTCMilliseconds()/3600000;
 const gamma=2*Math.PI/days*(day-1+(hour-12)/24);
 const equation=229.18*(.000075+.001868*Math.cos(gamma)-.032077*Math.sin(gamma)-.014615*Math.cos(2*gamma)-.040849*Math.sin(2*gamma));
 const declination=.006918-.399912*Math.cos(gamma)+.070257*Math.sin(gamma)-.006758*Math.cos(2*gamma)+.000907*Math.sin(2*gamma)-.002697*Math.cos(3*gamma)+.00148*Math.sin(3*gamma);
 const latitude=40.7295*Math.PI/180,hourAngle=(hour*60+equation+4*(-73.9965))/4*Math.PI/180-Math.PI;
 const cosine=Math.sin(latitude)*Math.sin(declination)+Math.cos(latitude)*Math.cos(declination)*Math.cos(hourAngle);
 return Math.acos(Math.max(-1,Math.min(1,cosine)))*180/Math.PI;
}
function automaticMood(now=new Date()){return venueSolarZenith(now)<=90.833?'soft':'pixel';}
function syncAutomaticMood(now=new Date()){return state.mood==='auto'&&automaticMood(now)!==state.style?applyStyle('auto',now):false;}
function rememberMapFocus(){
 const node=document.activeElement,control=node?.closest?.('[data-choose-floor],[data-choose-room],[data-room],[data-floor],[data-show-restrooms]');
 const scope=control?.closest('#floor-selector,#room-list,#floor-plan,#building')?.id;if(!scope)return null;
 const attribute=['data-choose-floor','data-choose-room','data-room','data-floor','data-show-restrooms'].find(name=>control.hasAttribute(name));
 return {scope,attribute,value:control.getAttribute(attribute)};
}
function restoreMapFocus(focus){
 if(!focus)return;
 const exact=()=>$(focus.scope)?.querySelector(`[${focus.attribute}="${CSS.escape(focus.value)}"][tabindex="0"],button[${focus.attribute}="${CSS.escape(focus.value)}"]`);
 const target=exact();if(target){target.focus({preventScroll:true});return;}
 // Diagram badges are created on the next drawing frame after a venue/theme rebuild.
 requestAnimationFrame(()=>{const fallback=focus.attribute.includes('room')?`#room-list [data-choose-room="${CSS.escape(state.room||'')}"]`:`#floor-selector [data-choose-floor="${state.floor}"]`; (exact()||document.querySelector(fallback))?.focus({preventScroll:true});});
}
function automaticDayIndex(now=nowInNewYork()){
 if(now.date<'2026-11-08')return 0;
 if(now.date>'2026-11-13')return DAYS.length-1;
 if(now.date==='2026-11-08')return now.minutes<15*60?0:1;
 return DAYS.findIndex(day=>day.date===Number(now.date.slice(-2)));
}
function defaultFloor(now=nowInNewYork()){
 if(venueId()==='wwh')return 1;
 if(currentDay().id==='sunday-late'&&now.date===currentDate()&&now.minutes>=18*60)return 8;
 return currentDay().tcc&&!currentDay().focs?9:4;
}
function resolveMapRoom(room){
 const id=venueId()==='wwh'?String(room||''):geometryRoom(room);
 return id==='914'?(currentDay().tcc?'TCC':'D'):id;
}
function initializeConferenceLocation(){
 const requestedDay=DAYS.findIndex(day=>day.id===(query.get('day')==='sunday'?'sunday-early':query.get('day'))),now=nowInNewYork();
 state.automaticDay=requestedDay<0;
 state.day=state.automaticDay?automaticDayIndex(now):requestedDay;
 const requestedFloor=Number(query.get('floor'));
 state.automaticLocation=!activeFloors().includes(requestedFloor);
 state.floor=state.automaticLocation?defaultFloor(now):requestedFloor;
 state.room=rooms(state.floor)[0]?.id||null;
}
function applyCurrentLocation(now=nowInNewYork()){
 if(!state.automaticLocation||now.date!==currentDate())return false;
 const day=PROGRAM_DATA?.days.find(item=>item.id===currentDay().id);if(!day)return false;
 const minute=value=>{const[h,m]=String(value).split(':').map(Number);return h*60+m;};
 const located=day.sessions.filter(session=>(session.venueId||'kimmel')===venueId()&&activeFloors().includes(session.floor)&&session.room);
 const priority=session=>(['plenary','reception','meal'].includes(session.kind)?0:10)+(session.conference==='FOCS'?0:2)+Math.max(0,['A','B','C','D','TCC'].indexOf(session.track));
 const active=located.filter(session=>minute(session.start)<=now.minutes&&now.minutes<minute(session.end)).sort((a,b)=>priority(a)-priority(b)||minute(a.start)-minute(b.start));
 const upcoming=located.filter(session=>minute(session.start)>=now.minutes).sort((a,b)=>minute(a.start)-minute(b.start)||priority(a)-priority(b));
 const last=[...located].sort((a,b)=>minute(b.end)-minute(a.end)||priority(a)-priority(b));
 const session=active[0]||upcoming[0]||last[0];if(!session)return false;
 const room=rooms(session.floor).find(item=>item.id===resolveMapRoom(session.room)||item.hold?.room===session.room);if(!room)return false;
 const changed=state.floor!==session.floor||state.room!==room.id;state.floor=session.floor;state.room=room.id;return changed;
}
function updateMapUrl(){
 const url=new URL(location.href);
 if(state.automaticDay)url.searchParams.delete('day');else url.searchParams.set('day',currentDay().id);
 if(state.automaticLocation)url.searchParams.delete('floor');else url.searchParams.set('floor',state.floor);
 if(state.mood==='auto')url.searchParams.delete('mood');else url.searchParams.set('mood',state.mood);
 url.searchParams.delete('style');try{history.replaceState(null,'',url);}catch{}
}
function renderConferenceClock(now=nowInNewYork()){
 const clock=$('conference-clock');if(!clock)return;
 clock.textContent=`${now.date===currentDate()?'Today':'New York now'} · ${now.label} ET`;
}
function syncConferenceTime(){
 const instant=new Date(),now=nowInNewYork(instant),before=venueId();let changed=syncAutomaticMood(instant);
 if(state.automaticDay){
  const next=automaticDayIndex(now);
  if(next!==state.day){state.day=next;state.automaticLocation=true;state.floor=defaultFloor(now);state.room=rooms(state.floor)[0]?.id||null;if(before!==venueId()){pendingMapFocus=rememberMapFocus()||pendingMapFocus;$('building').innerHTML='';}changed=true;}
 }
 if(applyCurrentLocation(now))changed=true;
 if(changed)render();else renderConferenceClock(now);
 if(before!==venueId())document.dispatchEvent(new CustomEvent('conference:venue',{detail:{from:before,to:venueId()}}));
}
const holdTime=value=>{const[h,m]=value.split(':').map(Number);return `${h%12||12}${m?':'+String(m).padStart(2,'0'):''} ${h>=12?'p.m.':'a.m.'}`;};
const usesPixels=()=>state.style==='pixel'||state.style==='apocalypse';
const RESTROOMS={
 1:{points:[],description:'Single-stall restroom behind the main elevators. NYU lists this restroom as not wheelchair accessible.'},
 4:{points:[[-4,244]],description:'Restrooms just south of the main elevator bank, on the west side of the floor.'},
 8:{points:[[-4,244]],description:'Restrooms just south of the main elevator bank, on the west side of the floor.'},
 9:{points:[[-4,244]],description:'Restrooms just south of the main elevator bank, on the west side of the floor.'},
 10:{points:[[-4,246],[68,246]],description:'Restrooms on both sides of the corridor just south of the main elevator bank, beside Rosenthal Pavilion.'}
};
const restroomInfo=()=>venueId()==='wwh'?{points:[[39,221]],description:'Adjacent to the snack machine.'}:RESTROOMS[state.floor];
function restroomMarker(x,y,name='Restrooms'){return `<g class="restroom-marker" transform="translate(${x} ${y})" role="img" aria-label="${esc(name)}"><title>${esc(name)}</title><rect x="-17" y="-14" width="34" height="28" rx="6" fill="${P.floor}" stroke="${P.primary}" stroke-width="2"/><text x="0" y="5" text-anchor="middle" fill="${P.ink}" font-size="14" font-weight="800">WC</text></g>`;}
function themed(markup){
 const old={'#493a55':P.ink,'#776b80':P.muted,'#706479':P.muted,'#776080':P.muted,'#6c4994':P.primary,'#fff':P.onPrimary,'#fffaf3':P.floor,'#fffaf4':P.floor,'#fff9ef':P.wall,'#c7bacd':P.line,'#c8becf':P.line,'#c7b9c8':P.line,'#c4b8c7':P.line,'#e4d9cb':P.sideN,'#eee5f0':P.closed,'#e9e1dc':P.closed,'#eee6f2':P.closed,'#e9e1ed':P.closed,'#ddd5df':P.closed,'#b9a4cc':P.stage,'#9e85b8':P.seats,'#ad9292':P.line,'#93b5aa':P.line,'#e6eddb':P.park,'#fff9e9':P.wall,'#b8a773':P.wood,'#c7b380':P.wood,'#d7c6c0':P.sideN,'#cbbdcf':P.sideE,'#d5cddd':P.shadow,'#e9e3df':P.walk,'#e5e0e5':P.road,'#d4e4cd':P.park,'#617b5b':P.ink,'#9e8e72':P.wood,'#a9c79d':P.tree,'#b5d3a9':P.treeLight,'#dce9d7':P.park};
 return markup.replace(/#[0-9a-f]{3,6}\b/gi,color=>old[color.toLowerCase()]||color);
}
function applyStyle(style,now=new Date()){
 state.mood=Object.hasOwn(PALETTES,style)?style:'auto';
 const resolved=state.mood==='auto'?automaticMood(now):state.mood,changed=state.style!==resolved||document.body.dataset.style!==resolved;
 state.style=resolved;P=PALETTES[state.style];COLORS=P.rooms;
 document.body.dataset.moodIsAutomatic=String(state.mood==='auto');
 const mood=$('mood-selector');if(mood)mood.value=state.mood;
 if(!changed)return false;
 document.body.dataset.style=state.style;
 document.querySelector('meta[name="theme-color"]').content=P.paper;
 pendingMapFocus=rememberMapFocus()||pendingMapFocus;
 $('building').innerHTML='';$('building').removeAttribute('data-pixels-ready');
 document.dispatchEvent(new CustomEvent('kimmel:mood',{detail:{mood:state.style}}));
 return true;
}
function baseRooms(floor,day=currentDay()){
 if(floor===1)return [{id:'entry',title:'Entrance',short:'Entrance',subtitle:'60 Washington Square South',description:'Enter from Washington Square South, facing Washington Square Park. Bring a valid government ID. The elevators serve the conference floors.',color:COLORS.entry}];
 if(floor===4){const a=[];if(day.focs){a.push({id:'A',title:'Track A',short:'Track A',subtitle:'Eisner & Lubin Auditorium',description:'Fourth floor · Eisner & Lubin Auditorium.',color:COLORS.A},{id:'B',title:'Track B',short:'Track B',subtitle:'Rooms 405/406',description:'Fourth floor · Rooms 405/406, along the Washington Square South side. A hallway separates these rooms from the auditorium.',color:COLORS.B});a.push({id:'solarium',service:'coffee',title:'Solarium 409',short:'Coffee · 409',subtitle:'Coffee / refreshments',description:'Fourth floor · Solarium 409. Coffee / refreshments.',color:COLORS.coffee});}return a;}
 if(floor===9){if(!day.focs&&!day.tcc)return [];const a=[];if(day.focs)a.push({id:'C',title:'Track C',short:'Track C',subtitle:'Rooms 905/907',description:'Ninth floor · Combined Rooms 905/907, on the LaGuardia Place side.',color:COLORS.C});a.push({id:day.tcc?'TCC':'D',title:day.tcc?'TCC':'Track D',short:day.tcc?'TCC':'Track D',subtitle:'Room 914',description:day.tcc?'Ninth floor · TCC sessions in Room 914, at the south end of the floor.':'Monday only · Track D in Room 914, at the south end of the ninth floor.',color:COLORS.D});return a;}
 if(floor===10&&day.rosenthal)return [{id:'rosenthal',service:'food',title:'Rosenthal Pavilion',short:'Rosenthal',subtitle:'Meals / gathering',description:'Tenth floor · Meals / gathering.',color:COLORS.coffee}];
 return [];
}
function geometryRoom(room){
 const normalized=String(room||'').toLowerCase();
 if(normalized.includes('eisner'))return 'A';
 if(/405\s*[/&-]\s*406|406\s*[/&-]\s*405/.test(normalized))return 'B';
 if(/905\s*[/&-]\s*907/.test(normalized))return 'C';
 if(normalized.includes('409'))return 'solarium';if(normalized.includes('802'))return 'shorin';
 if(normalized.includes('rosenthal'))return 'rosenthal';
 return normalized.match(/\b\d{3}\b/)?.[0]||null;
}
function rooms(floor,day=currentDay()){
 const venue=day.venue||'kimmel',date=`2026-11-${String(day.date).padStart(2,'0')}`;
 if(venue==='wwh'&&floor!==1)return [];
 let list=venue==='wwh'?[{id:'109',title:'Track A',short:'A · 109',subtitle:'109 · Subspace Designs',description:'Begrisch Lecture Hall · Subspace Designs, morning and afternoon. Two entrances from the crosshall.',color:COLORS.A},{id:'101',title:'Track B',short:'B · 101',subtitle:'101 · Quantum',description:'Validating Quantum Devices in the morning; Quantum Architecture and Compilation in the afternoon. Right-hand doors in the shared alcove.',color:COLORS.B},{id:'102',title:'Track C',short:'C · 102',subtitle:'102 · Prediction / Quasirandomness',description:'Performative Prediction in the morning; Algorithmic Perspectives on Quasirandomness in the afternoon. Left-hand doors in the shared alcove.',color:COLORS.C}]:baseRooms(floor,day);
 if(venue==='wwh')list.push({id:'crosshall',title:'Food & coffee',short:'Food & coffee',subtitle:'Crosshall',description:'Food and coffee are staged in the crosshall, outside room 109.',amenities:['food','coffee'],color:COLORS.coffee});
 if(day.id==='sunday-late'&&floor===4)list.push({id:'A',title:'AI and TCS',short:'AI & TCS',subtitle:'Eisner & Lubin Auditorium',description:'Sunday · 3:30–5:30 p.m. · Joint AI and TCS workshop in Eisner & Lubin Auditorium.',color:COLORS.A});
 if(day.id==='sunday-late'&&floor===8)list.push({id:'shorin',title:'Shorin 802',short:'Estimathon · 802',subtitle:'Jane Street Estimathon',description:'Sunday · 6–7:30 p.m. · Jane Street Estimathon, Shorin Performance Studio 802.',color:COLORS.D});
 for(const hold of ROOM_DATA.rooms.filter(r=>r.venueId===venue&&r.date===date&&r.floor===floor)){
  const key=hold.roomId,alias=venue==='wwh'?key:key==='eisner-lubin'?'A':key==='405-406'?'B':key==='905-907'?'C':key.startsWith('914')?(day.tcc?'TCC':'D'):key==='409-solarium'?'solarium':key==='802-shorin'?'shorin':key;
  const existing=list.find(r=>r.id===alias);
  if(existing){existing.hold=hold;continue;}
  const workshop=venue==='wwh'&&['101','102','109'].includes(key),role=workshop?'Workshop':hold.role==='reserve'?(venue==='kimmel'?'Free space':'Reserve / auxiliary'):hold.role==='workspace'?'Workspace':hold.role==='catering'?'Catering / staging':hold.role==='support'&&/break|coffee/i.test(hold.purpose||'')?'Break room':hold.role==='meal-gathering'?'Meals / gathering':venue==='kimmel'?'Free space':'Auxiliary room';
  list.push({id:alias,title:hold.room,short:`${hold.room} · ${workshop?'Workshops':hold.role==='workspace'?'Workspace':hold.role==='catering'?'Catering':role==='Break room'?'Break room':role==='Free space'?'Free space':'Auxiliary'}`,subtitle:role,description:`${venue==='wwh'?'WWH':'Kimmel'} · Floor ${floor}. ${role==='Free space'?'Breakout room for work or discussion':role}.`,color:workshop?(['109','101','102'].indexOf(key)===0?COLORS.A:key==='101'?COLORS.B:COLORS.C):COLORS.entry,hold});
 }
 const programDay=PROGRAM_DATA?.days.find(item=>item.id===day.id);
 if(programDay&&venue==='wwh'){
  for(const room of list){
   const events=programDay.sessions.filter(session=>session.venueId==='wwh'&&String(session.room)===room.id);
   if(events.length){
    room.subtitle=room.id==='109'?'109 · Begrisch Lecture Hall':`Room ${room.id}`;
    room.description=events.map(session=>`${holdTime(session.start)}–${holdTime(session.end)} · ${session.theme||session.title}.`).join(' ');
   }
  }
 }
 if(programDay&&venue==='kimmel'){
  const groups=new Map();
  for(const session of programDay.sessions.filter(session=>(session.venueId||'kimmel')===venue&&session.floor===floor&&session.room)){
   let id=geometryRoom(session.room);if(id==='914')id=day.tcc?'TCC':'D';if(!id)continue;
   if(!groups.has(id))groups.set(id,[]);groups.get(id).push(session);
  }
  for(const[id,group]of groups){
   let room=list.find(room=>room.id===id);
   if(!room){room={id,title:group[0].room,short:group[0].room,subtitle:'Program room',description:'Listed in the current program.',color:COLORS.entry};list.push(room);}
   const tracks=[...new Set(group.map(session=>session.track).filter(track=>['A','B','C','D','TCC'].includes(track)))];
   room.programTracks=tracks;
   if(tracks.length){room.planLabel=tracks.map(track=>track==='TCC'?'TCC':`Track ${track}`).join(' / ');room.title=room.planLabel;room.short=room.planLabel;room.subtitle=group[0].room;room.color=COLORS[tracks[0]]||COLORS.entry;}
   else if(day.id==='sunday-late')room.planLabel=id==='A'?'AI & TCS':id==='shorin'?'Estimathon':room.short;
  }
  for(const room of list){
   if(['A','B','C','D','TCC'].includes(room.id)&&!groups.has(room.id)){
    if(room.hold){room.programTracks=[];room.planLabel='Free space';room.title=room.hold.room;room.short=`${room.hold.room} · Free space`;room.subtitle='Free space';room.description=`Kimmel · Floor ${floor}. Breakout room for work or discussion.`;}
    else room.obsolete=true;
   }
  }
 }
 return list.filter(room=>!room.obsolete&&!(ROOM_DATA.source&&room.service&&!room.hold));
}
function wwhPlan(floor,{labels=true,outlines=true}={}){
 // User-corrected adjacency; proportions are adjusted for readable wayfinding.
 const available=rooms(1),color=id=>available.find(room=>room.id===id)?.color||COLORS.neutral;
 const room=(id,path,x,y,track)=>selectable(id,`<path class="room-fill" d="${path}" fill="${color(id)}"/>`+(labels?labelLines(x,y,[`Track ${track}`,id],18):''));
 let s=`<rect x="0" y="0" width="260" height="400" rx="3" class="floor-slab" fill="${P.floor}" stroke="${P.line}" stroke-width="2"/>`;
 s+=room('102','M0 0 H112 V90 H88 V150 H0 Z',45,55,'C');
 s+=room('101','M112 0 H260 V90 H198 V132 H144 V90 H112 Z',185,39,'B');
 // The classroom doors sit inside a shared notch in the north room block.
 s+=`<path d="M89 90 h23 M115 90 h27" stroke="${P.floor}" stroke-width="7"/><path d="M89 90 v-13 h11 v13 m0 -13 h11 v13 M115 90 v-13 h13 v13 m0 -13 h13 v13" fill="none" stroke="${P.primary}" stroke-width="1.4"/>`;
 // Desk south/east of the alcove, intentionally unlabelled.
 s+=rect(160,141,51,18,COLORS.B)+rect(164,145,17,6,P.glass);
 s+=`<path d="M0 157 v37 M260 157 v37" stroke="${P.glass}" stroke-width="6"/>`;
 // Arrivals use Mercer; the plaza door is shown without a public-entrance claim.
 s+=`<path class="route wwh-arrival" d="M257 176 H225" fill="none" stroke="${P.primary}" stroke-width="2" stroke-dasharray="5 5"/><path d="M233 170 l-8 6 8 6" fill="none" stroke="${P.primary}" stroke-width="2"/>`;
 s+=`<path d="M260 194 V299" stroke="${P.glass}" stroke-width="6"/>`+rect(248,215,8,28,P.seats)+rect(248,254,8,28,P.seats);
 // The west service block borders the lobby, east corridor and south crosshall.
 // Its interior services are not labelled as elevators.
 s+=rect(0,197,195,43,P.wall);
 s+=rect(14,205,51,35,P.floor)+rect(76,216,15,24,P.closed)+rect(78,219,11,11,P.glass);
 // A feathered wash marks food/coffee in the open crosshall, not another room.
 const hallWash=`wwh-crosshall-${labels?'plan':'iso'}`;
 s+=`<defs><radialGradient id="${hallWash}"><stop offset="0" stop-color="${color('crosshall')}" stop-opacity=".36"/><stop offset=".65" stop-color="${color('crosshall')}" stop-opacity=".18"/><stop offset="1" stop-color="${color('crosshall')}" stop-opacity="0"/></radialGradient></defs>`;
 s+=selectable('crosshall',`<path class="room-fill wwh-crosshall" d="M0 240 H238 V300 H0 Z" fill="url(#${hallWash})" fill-opacity="${state.room==='crosshall'?1:0}"/>`+(labels?text(130,260,'Crosshall',12)+text(130,282,'Food & coffee',14)+foodFriend('food','x="45" y="256" width="26" height="26"')+foodFriend('coffee','x="185" y="256" width="26" height="26"'):''));
 s+=room('109','M0 300 H260 V400 H0 Z',130,342,'A');
 s+=`<path d="M42 300 H218" stroke="${P.wood}" stroke-width="7"/>`;
 for(const x of [10,219])s+=`<path d="M${x} 300 h32" stroke="${P.floor}" stroke-width="8"/><path class="wwh-109-doors" d="M${x} 300 v16 h16 v-16 m0 16 h16 v-16" fill="none" stroke="${P.primary}" stroke-width="1.5"/>`;
 if(labels)s+=text(124,187,'Lobby',14)+restroomMarker(39,221,'All-gender restrooms');
 return themed(s+(outlines?roomOutlines(s):''));
}
function wwhUpperStack(){
 // Twelve compressed upper floors share the first floor's isometric projection.
 // Paint bottom to top; the closed floors have no floor/room hit targets.
 const count=12,bottom=441,pitch=12,top=bottom-(count-1)*pitch;
 let s='<g class="wwh-upper-stack" aria-label="Twelve upper floors, compressed; not conference space">';
 for(let i=0;i<count;i++){
  const b=bottom-i*pitch;
  s+=`<g class="wwh-stack-slice" data-stack-floor="${i+2}" data-stack-base="${b}">`+side([[0,0],[260,0]],b,P.sideN)+side([[260,0],[260,400]],b,P.sideE)+`<path transform="${projection(b)}" d="M0 0 H260 V400 H0 Z" fill="${P.closed}" stroke="${P.line}"/>`;
  const bays=b===top?[...[20,99,178].map(x=>[[x,0],[x+7,-12],[x+31,-12],[x+38,0]]),...[35,121,207,293].map(y=>[[260,y],[272,y+7],[272,y+34],[260,y+42]])]:[];
  for(const bay of bays)for(let i=0;i<bay.length-1;i++){
   const a=p(...bay[i],b+3),c=p(...bay[i+1],b+3);
   s+=`<polygon class="wwh-top-bay" points="${[a,c,[c[0],c[1]+9],[a[0],a[1]+9]].map(point=>point.join(',')).join(' ')}" fill="${P.glass}" stroke="${P.line}" stroke-width="1"/>`;
  }
  s+='</g>';
 }
 s+=buildingSmile(...p(130,190,top));
 return s+'</g>';
}
function wwhFirstFloor(){
 const b=baseFor(1);
 return side([[0,0],[260,0]],b,P.sideN)+side([[260,0],[260,400]],b,P.sideE)+`<g transform="${projection(b)}">${wwhPlan(1,{labels:false})}</g>`;
}
function foodFriend(kind='coffee',attributes=''){
 const outline=`stroke="${P.ink}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"`;
 const cheeks=`<ellipse cx="14" cy="30" rx="3.5" ry="2" fill="${COLORS.B}"/><ellipse cx="32" cy="30" rx="3.5" ry="2" fill="${COLORS.B}"/>`;
 const face=`${cheeks}<circle cx="18" cy="26" r="1.7" fill="${P.ink}"/><circle cx="28" cy="26" r="1.7" fill="${P.ink}"/><path d="M20 31 q3 4 6 0" fill="none" ${outline}/>`;
 const art=kind==='coffee'?`<path d="M35 19 h3 a7 7 0 0 1 0 14 h-4" fill="none" ${outline}/><rect x="8" y="15" width="28" height="25" rx="10" fill="${COLORS.coffee}" ${outline}/><path d="M10 17 h24 M15 11 q-4 -3 0 -6 M24 10 q-4 -3 0 -6" fill="none" ${outline}/>${face}`:kind==='snack'?`<circle cx="23" cy="25" r="18" fill="${COLORS.coffee}" ${outline}/><path d="M13 15 l2 1 M29 13 l2 2 M10 32 l2 2 M33 35 l2 -1" ${outline}/>${face}`:`<path d="M7 18 Q6 7 17 9 Q23 4 29 9 Q40 7 39 18 L37 37 Q23 42 9 37 Z" fill="${P.floor}" ${outline}/><path d="M9 34 Q23 30 37 34 L37 38 Q23 42 9 38 Z" fill="${P.tree}"/><path d="M9 37 Q23 34 37 37" fill="none" stroke="${COLORS.B}" stroke-width="3"/>${face}`;
 return `<svg class="food-friend" data-food="${kind}" viewBox="0 0 48 48" aria-hidden="true" focusable="false" ${attributes}>${art}</svg>`;
}
function floorSummary(floor){
 if(venueId()==='wwh')return floor===1?['A · B · C','Food · Coffee']:[];
 if(currentDay().id==='sunday-late')return floor===4?['AI & TCS']:floor===8?['802']:[];
 const available=rooms(floor),tracks=[...new Set(available.flatMap(room=>room.programTracks||(['A','B','C','D','TCC'].includes(room.id)?[room.id]:[])))];
 return [tracks.join(' · '),available.some(r=>r.id==='shorin')?'802':available.some(room=>room.service==='coffee')?'Coffee':available.some(room=>room.service==='food')?'Food':''].filter(Boolean);
}
function rect(x,y,w,h,fill='neutral',extra=''){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" class="room-fill" fill="${COLORS[fill]||fill}" ${extra}/>`;}
function text(x,y,label,size=14,extra=''){return `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="#493a55" ${extra}>${esc(label)}</text>`;}
function labelLines(x,y,lines,size=14){return `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="#493a55" font-weight="650">${lines.map((line,i)=>`<tspan x="${x}" dy="${i?Math.round(size*1.35):0}">${esc(line)}</tspan>`).join('')}</text>`;}
function elevator(topdown=true){return `<g>${rect(-37,82,65,83,'#e9e1ed')}${[[-29,91],[3,91],[-29,133],[3,133]].map(([x,y])=>rect(x,y,23,31,'#fffaf4')).join('')}${topdown?labelLines(-4,194,['Elevators'],12):''}</g>`;}
function selectable(id,body){
 // The first fill is the room footprint; later fills may be furniture or a stage.
 const marked=body.replace(/<(?:path|rect)\b[^>]*class="[^"]*\broom-fill\b[^"]*"[^>]*\/>/,shape=>shape.replace(/\/>$/,` data-room-boundary="${esc(id)}"/>`));
 const room=rooms(state.floor).find(item=>item.id===id);
 return `<g class="svg-room ${state.room===id?'selected':''}" data-room="${id}"${room?` tabindex="0" role="button" aria-label="${esc(`${room.title} · ${room.subtitle}`)}" aria-pressed="${state.room===id}"`:''}>${marked}</g>`;
}
function roomOutlines(markup){
 const contours=(markup.match(/<(?:path|rect)\b[^>]*data-room-boundary="[^"]*"[^>]*\/>/g)||[]).map(shape=>{
  const id=shape.match(/data-room-boundary="([^"]*)"/)[1],selected=state.room===id;
  return {selected,shape:shape.replace(/class="[^"]*"/,`class="room-outline${selected?' is-selected':''}"`).replace(/fill="[^"]*"/,'fill="none"').replace('data-room-boundary=','data-outline-room=')};
 });
 // Selected contours paint last so neighboring rooms cannot cover a shared edge.
 return `<g class="room-outlines" aria-hidden="true" pointer-events="none">${contours.sort((a,b)=>Number(a.selected)-Number(b.selected)).map(item=>item.shape).join('')}</g>`;
}
function plan(floor,{labels=true,day=currentDay(),outlines=true}={}){
 if((day.venue||'kimmel')==='wwh')return wwhPlan(floor,{labels,outlines});
 const active=rooms(floor,day);const has=id=>active.some(r=>r.id===id);const roomLabel=(id,fallback)=>active.find(r=>r.id===id)?.planLabel||fallback;const roomColor=(id,fallback)=>active.find(r=>r.id===id)?.color||fallback;
 let markup=`<path class="floor-slab" d="M0 0 H260 V400 H0 V270 H-45 V65 H0 Z" fill="#fffaf3" stroke="#c7bacd" stroke-width="2"/>`;
 if(floor===4){
  markup+=selectable('B',rect(0,0,260,55,has('B')?roomColor('B','B'):'neutral')+(labels?`${text(63,22,'406',13)}${text(195,22,'405',13)}${text(130,44,has('B')?roomLabel('B','Track B'):'405 / 406',15,'font-weight="700"')}`:''));
  markup+=`<path d="M130 0 V55" stroke="#ad9292" stroke-dasharray="5 4"/>`;
  markup+=selectable('A',rect(60,80,180,280,has('A')?roomColor('A','A'):'neutral'));
  markup+=rect(67,304,166,49,has('A')?'#b9a4cc':'#ddd5df');
  if(labels){markup+=labelLines(150,172,has('A')?[roomLabel('A',day.id==='sunday-late'?'AI & TCS':'Track A'),'Eisner & Lubin','Auditorium']:['Eisner & Lubin','Auditorium'],14)+text(150,334,'Stage · south',12);markup+=text(130,72,'Hallway',11);}
  for(let row=0;row<5;row++)for(let col=0;col<6;col++)markup+=`<rect x="${71+col*27}" y="${220+row*13}" width="16" height="6" rx="3" fill="#9e85b8" opacity=".6"/>`;
  markup+=elevator(labels)+rect(0,215,25,80);
  markup+=selectable('solarium',`<path class="room-fill" d="M240 250 H260 V400 H35 V375 H240 Z" fill="${active.some(room=>room.service==='coffee')?COLORS.coffee:has('solarium')?COLORS.entry:COLORS.neutral}"/>`+(labels?text(125,393,'Solarium 409',13,'font-weight="700"')+(active.some(room=>room.service==='coffee')?foodFriend('coffee','x="215" y="366" width="30" height="30"'):''):''));
 }else if(floor===8){
  markup+=rect(0,0,260,45,'#e6eddb');
  markup+=elevator(labels);
  markup+=selectable('shorin',rect(55,58,185,155,has('shorin')?'D':'neutral')+rect(55,65,35,140,'#b9a4cc')+(labels?labelLines(170,113,['Shorin','802','Estimathon'],18):''));
  // Paired rooms share walls; the east-side circulation is Stovall Gallery.
  markup+=rect(40,248,105,70)+rect(145,248,95,70)+rect(40,330,200,65);
  markup+=`<path d="M145 330 V395" fill="none" stroke="${P.line}" stroke-width="1.5" stroke-dasharray="5 4"/>`;
  if(labels)markup+=text(130,30,'Upper lounge · north',12)+text(140,235,'Hallway',12)+text(92,288,'808',14)+text(192,288,'803',14)+text(92,370,'805',14)+text(192,370,'804',14)+text(250,280,'Stovall Gallery',12,'transform="rotate(90 250 280)" style="font-size:12px"');
 }else if(floor===9){
  markup+=selectable('901',rect(0,0,48,49,has('901')?roomColor('901','entry'):'neutral'))+selectable('903',rect(208,0,52,68,has('903')?roomColor('903','entry'):'neutral'));
  if(labels)markup+=text(24,28,'901',11)+text(234,40,'903',11)+text(124,40,'Lounge · north',12);
  markup+=selectable('C',rect(180,75,80,110,has('C')?roomColor('C','C'):'neutral')+(labels?labelLines(220,110,['905',has('C')?roomLabel('C','Track C'):'','907'],13):''));
  markup+=`<path d="M180 130 H260" stroke="#93b5aa" stroke-dasharray="5 4"/>`;
  markup+=selectable('909',rect(180,185,80,55,has('909')?roomColor('909','entry'):'neutral'))+selectable('912',rect(180,240,80,55,has('912')?'entry':'neutral'));
  if(labels)markup+=text(220,218,'909',12)+text(220,273,'912',12);
  [904,906,908,910].forEach((n,i)=>{markup+=selectable(String(n),rect(80,75+i*44,57,44,has(String(n))?roomColor(String(n),'entry'):'neutral'));if(labels)markup+=text(108,102+i*44,String(n),11);});
  const endId=day.tcc?'TCC':'D';markup+=selectable(endId,rect(100,310,160,90,has(endId)?roomColor(endId,COLORS[endId]):'neutral')+(labels?labelLines(180,345,[has(endId)?roomLabel(endId,day.tcc?'TCC':'Track D'):'Room','914'],16):''));
  markup+=elevator(labels)+rect(-35,220,63,50);
 }else if(floor===10){
  const meals=active.some(room=>room.id==='rosenthal'&&room.service==='food'),catering=active.some(room=>room.id==='rosenthal'&&room.hold?.role==='catering');
  markup+=rect(95,0,165,25,'#e6eddb');
  if(labels)markup+=text(177,17,'Balcony · north',11);
  markup+=selectable('rosenthal',rect(95,30,165,280,meals?'coffee':has('rosenthal')?'entry':'neutral')+(labels?labelLines(178,125,['Rosenthal','Pavilion'],18):''));
  if(meals){for(const[x,y]of [[132,200],[211,200],[171,257]])markup+=`<circle cx="${x}" cy="${y}" r="14" fill="#fff9e9" stroke="#b8a773"/><circle cx="${x}" cy="${y}" r="3" fill="#c7b380"/>`;}
  if(labels){markup+=labelLines(178,165,meals?['Meals /','gathering']:catering?['Catering /','staging']:has('rosenthal')?['Free space']:['No conference','space today'],13);if(meals)markup+=foodFriend('food','x="117" y="182" width="30" height="30"');}
  markup+=elevator(labels)+rect(-35,220,70,65)+rect(95,330,165,70);
  if(labels)markup+=text(175,371,'Kitchen / service',12);
 }else{
  markup+=kimmelLobby({labels});
 }
 if(labels)markup+=(RESTROOMS[floor]?.points||[]).map(([x,y])=>restroomMarker(x,y)).join('');
 return themed(markup+(outlines?roomOutlines(markup):''));
}
function p(x,y,base){return [488-.70*x-.70*y,base+.35*x-.35*y];}
function poly(points,base,fill,stroke='none'){return `<polygon points="${points.map(([x,y])=>p(x,y,base).join(',')).join(' ')}" fill="${fill}" stroke="${stroke}"/>`;}
const OUTLINE='M0 0 H260 V400 H0 V270 H-45 V65 H0 Z';
const baseFor=floor=>690-12*(floor-1);
// Only vertical spacing changes. The same matrix is shared by every open and closed slab.
const projection=base=>`matrix(-.70 .35 -.70 -.35 488 ${base})`;
const shiftFor=floor=>state.floor===1?(floor===1?0:-220):(floor<state.floor?0:floor===state.floor?-220:-440);
function side(points,base,fill){
 const top=points.map(([x,y])=>p(x,y,base));
 return `<polygon points="${[top[0],top[1],[top[1][0],top[1][1]+12],[top[0][0],top[0][1]+12]].map(a=>a.join(',')).join(' ')}" fill="${fill}" stroke="#c4b8c7" stroke-width="1"/>`;
}
function block(x,y,w,d,h,base,color){
 const corners=[[x,y],[x+w,y],[x+w,y+d],[x,y+d]];
 const top=corners.map(([a,c])=>p(a,c,base-h));
 let s='';
 for(const edge of [[0,1],[1,2]]){
  const a=top[edge[0]],c=top[edge[1]];
  s+=`<polygon points="${[a,c,[c[0],c[1]+h],[a[0],a[1]+h]].map(point=>point.join(',')).join(' ')}" fill="${color}" stroke="${P.line}" stroke-width="1"/>`;
 }
 return s+`<polygon points="${top.map(point=>point.join(',')).join(' ')}" fill="${color}" stroke="${P.line}" stroke-width="1"/>`;
}
function buildingSmile(x,y){
 if(state.style!=='kawaii')return '';
 return `<g class="building-smile" fill="${P.ink}"><circle cx="${x-10}" cy="${y}" r="3"/><circle cx="${x+10}" cy="${y}" r="3"/><path d="M${x-5} ${y+7} q5 7 10 0" fill="none" stroke="${P.ink}" stroke-width="2"/><ellipse cx="${x-18}" cy="${y+6}" rx="5" ry="2" fill="#EDB2C7"/><ellipse cx="${x+18}" cy="${y+6}" rx="5" ry="2" fill="#EDB2C7"/></g>`;
}
// The supplied lobby plan is rotated 90 degrees clockwise to stay north-up.
// One shared set of fan-shaped treads drives both plan and raised isometric art.
function lobbyTreads(){
 const edge=t=>({left:79+26*Math.sin(t*Math.PI/2),right:166-27*Math.sin(t*Math.PI/2),y:150+132*t,bow:14*(1-t)});
 return Array.from({length:12},(_,i)=>{
  const a=edge(i/12),b=edge((i+1)/12);
  return {a,b,height:3+i*3.5,path:`M${a.left} ${a.y} Q122.5 ${a.y-a.bow} ${a.right} ${a.y} L${b.right} ${b.y} Q122.5 ${b.y-b.bow} ${b.left} ${b.y} Z`};
 });
}
function kimmelLobby({labels=true}={}){
 let s=`<g class="kimmel-lobby"><path d="M10 8 H250" stroke="${P.glass}" stroke-width="8"/>`;
 // The main door is west of the event door along Washington Square South.
 s+=selectable('entry',rect(28,0,38,20,'entry'))+rect(181,0,38,20,'entry');
 for(const x of [38,49,191,202])s+=`<path d="M${x} 1 v17" stroke="${P.primary}" stroke-width="1.4"/>`;
 if(labels)s+=labelLines(47,40,['Main','entrance'],12)+labelLines(200,40,['Event','entrance'],12);
 // Unlabelled front desks and kiosks; positions follow the supplied crop.
 s+=rect(76,76,37,23,'B')+rect(86,81,14,7,P.glass)+rect(192,97,25,29,'B')+rect(198,102,12,8,P.glass);
 s+=rect(63,224,33,15,'B')+rect(69,227,12,5,P.glass);
 // Facing elevator banks are behind the stairs, towards the west/rear.
 s+=`<g class="lobby-elevators">`;
 for(const[x,y]of [[25,303],[25,338],[65,303],[65,338]]){
  s+=rect(x,y,25,29,'neutral')+`<path d="M${x+12.5} ${y+3} v23 M${x+4} ${y+3} h17 v23 h-17 Z" fill="none" stroke="${P.line}" stroke-width="1.3"/>`;
 }
 s+='</g>';
 if(labels)s+=text(145,339,'Elevators',12,'font-weight="650"');
 s+=`<g class="lobby-stairs" aria-hidden="true">${lobbyTreads().map(step=>`<path d="${step.path}" fill="${P.wall}" stroke="${P.wood}" stroke-width="1.1"/>`).join('')}<path d="M79 150 Q104 193 105 282 M166 150 Q139 193 139 282" fill="none" stroke="${P.glass}" stroke-width="3" stroke-linecap="round"/></g>`;
 s+=`<path d="M47 24 V66 H53 V281 H58 V318" class="route"/>`;
 return s+'</g>';
}
function lobbyObjects(base){
 let s=block(76,76,37,23,10,base,COLORS.B)+block(86,81,14,7,18,base,P.glass)+block(192,97,25,29,10,base,COLORS.B)+block(198,102,12,8,18,base,P.glass)+block(63,224,33,15,9,base,COLORS.B);
 for(const step of lobbyTreads().reverse()){
  const{a,height}=step,front=p(a.left,a.y,base-height),mid=p(122.5,a.y-a.bow,base-height),last=p(a.right,a.y,base-height),rise=3.5;
  s+=`<path d="M${front} Q${mid} ${last} v${rise} Q${mid[0]} ${mid[1]+rise} ${front[0]} ${front[1]+rise} Z" fill="${P.wood}" stroke="${P.line}" stroke-width=".5"/><g transform="${projection(base-height)}"><path d="${step.path}" fill="${P.wall}" stroke="${P.wood}" stroke-width="1.1"/></g>`;
 }
 for(const[left,right]of [[79,105],[166,139]]){
  const a=p(left,150,base-8),b=p(right,282,base-48),c=p((left+right)/2,210,base-28);
  s+=`<path d="M${a} Q${c} ${b}" fill="none" stroke="${P.glass}" stroke-width="3" stroke-linecap="round"/>`;
 }
 return s;
}
function floorContents(floor){
 const b=baseFor(floor),open=floor===state.floor;
 const floorPlan=open?plan(floor,{labels:false,outlines:false}):'';
 let s=side([[0,0],[260,0]],b,'#d7c6c0')+side([[260,0],[260,400]],b,'#cbbdcf');
 if(!open){
  // Small warm window tiles make the compressed blocks read as a building.
  for(let pane=0;pane<8;pane++){
   const color=(pane+floor)%3===0?P.seats:P.glass;
   for(const [a,c]of [[[17+pane*29,0],[31+pane*29,0]],[[260,20+pane*45],[260,39+pane*45]]]){
    const first=p(...a,b),last=p(...c,b);s+=`<polygon points="${[[first[0],first[1]+3],[last[0],last[1]+3],[last[0],last[1]+9],[first[0],first[1]+9]].map(point=>point.join(',')).join(' ')}" fill="${color}"/>`;
   }
  }
 }
 s+=`<g class="projection" transform="${projection(b)}">${open?floorPlan:`<path class="floor-slab" d="${OUTLINE}" fill="${floor===10?'#eee5f0':'#e9e1dc'}" stroke="#c7bacd" stroke-width="1.5"/>`}</g>`;
 if(!open&&floor===10&&state.style==='kawaii'){
  const[cx,cy]=p(130,190,b);s+=buildingSmile(cx,cy);
 }
 if(open){
  if(floor===1)s+=lobbyObjects(b);
  // Low perimeter walls keep the open tray visibly three-dimensional.
  for(const edge of [[[0,400],[260,400]],[[0,65],[-45,65]],[[-45,65],[-45,270]]]){
   const[a,c]=edge.map(([x,y])=>p(x,y,b));
   s+=`<path d="M${a[0]} ${a[1]} v-8 L${c[0]} ${c[1]-8} v8" stroke="#c7b9c8" stroke-width="2" fill="#fff9ef"/>`;
  }
  s+=`<g class="room-outline-plane" transform="${projection(b)}" pointer-events="none">${roomOutlines(floorPlan)}</g>`;
 }
 return themed(s);
}
function wwhOverview(){
 let s=`<svg class="building-scene" xmlns="http://www.w3.org/2000/svg" viewBox="-45 -35 750 965" role="group" aria-label="Warren Weaver Hall first-floor schematic. Enter from Mercer Street, east. Track A is room 109, Track B is 101 and Track C is 102. Food and coffee are staged in the crosshall. Upper floors are collapsed.">`;
 s+=poly([[-30,-25],[285,-25],[285,420],[-30,420]],700,P.walk)+poly([[-115,-25],[-30,-25],[-30,420],[-115,420]],700,P.park)+poly([[-30,-90],[345,-90],[345,-30],[-30,-30]],700,P.road)+poly([[285,-25],[345,-25],[345,420],[285,420]],700,P.road);
 s+=wwhUpperStack();
 s+=`<g class="floor-layer floor-hit selected-floor" data-level="1" data-floor="1" aria-label="First floor, conference rooms 101, 102 and 109">${wwhFirstFloor()}</g>`;
 return s+'</svg>';
}
function overview(){
 if(venueId()==='wwh')return wwhOverview();
 let s=`<svg class="building-scene" xmlns="http://www.w3.org/2000/svg" viewBox="-45 -35 750 965" role="group" aria-label="Interactive Kimmel building beside Washington Square Park. Selecting a floor opens it by lifting the floors above and compressing all remaining floors. Washington Square South is at the front-right; LaGuardia Place is at the front-left."><defs><filter id="soft-shadow" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="7"/></filter></defs>`;
 s+=`<ellipse cx="288" cy="738" rx="212" ry="23" fill="#d5cddd" opacity=".28" filter="url(#soft-shadow)"/>`;
 s+=poly([[-30,-25],[285,-25],[285,420],[-30,420]],700,'#e9e3df');
 s+=poly([[-30,-90],[285,-90],[285,-30],[-30,-30]],700,'#e5e0e5');
 s+=poly([[-30,-230],[285,-230],[285,-95],[-30,-95]],700,'#d4e4cd');
 s+=poly([[285,-25],[345,-25],[345,420],[285,420]],700,'#e5e0e5');
 for(const[x,y]of [[540,775],[649,801]]){
  s+=`<path d="M${x} ${y+17} v-29" stroke="${P.wood}" stroke-width="7"/>`;
  s+=!usesPixels()?`<circle cx="${x}" cy="${y-11}" r="21" fill="${P.tree}"/><circle cx="${x+10}" cy="${y-22}" r="17" fill="${P.treeLight}"/>`:`<path d="M${x-19} ${y-24} h10 v-9 h24 v10 h10 v25 h-10 v9 h-26 v-9 h-8 Z" fill="${P.tree}"/><rect x="${x-8}" y="${y-29}" width="23" height="19" fill="${P.treeLight}"/>`;
  if(state.style==='kawaii')s+=`<circle cx="${x-5}" cy="${y-13}" r="2" fill="${P.ink}"/><circle cx="${x+6}" cy="${y-13}" r="2" fill="${P.ink}"/><path d="M${x-3} ${y-7} q4 5 8 0" fill="none" stroke="${P.ink}" stroke-width="1.5"/>`;
 }
 // A tiny Washington Square Arch gives the park a recognizable landmark.
 s+=`<path d="M576 795 V740 H626 V795 H613 V775 A12 12 0 0 0 589 775 V795 Z" fill="${P.wall}" stroke="${P.line}" stroke-width="2"/><path d="M572 742 H630 M576 752 H626" stroke="${P.wood}" stroke-width="4"/>`;
 for(let floor=1;floor<=10;floor++){
  s+=`<g class="floor-layer ${activeFloors().includes(floor)?'floor-hit':''} ${floor===state.floor?'selected-floor':''}" data-level="${floor}" ${activeFloors().includes(floor)?`data-floor="${floor}" aria-label="${floor===state.floor?'Floor':'Open floor'} ${floor}"${floor!==state.floor?' tabindex="0" role="button"':''}`:''} style="transform:translateY(${shiftFor(floor)}px)">${floorContents(floor)}</g>`;
 }
 const[eX,eY]=p(47,0,690);
 s+=`<path d="M${eX-18} ${eY+36} l13 -20 12 20" stroke="#6c4994" stroke-width="3" fill="none"/><text x="${eX-4}" y="${eY+59}" text-anchor="middle" font-size="19" fill="#6c4994" font-weight="700">Entrance</text>`;
 return themed(s+'</svg>');
}
function renderBuilding(){
 if(!$('building').firstElementChild||$('building').dataset.layout!==`${venueId()}:${activeFloors().join(',')}`){ $('building').dataset.venue=venueId();$('building').dataset.layout=`${venueId()}:${activeFloors().join(',')}`;$('building').innerHTML=overview();requestPixelRender();return;}
 $('building').querySelector('.building-scene').querySelectorAll('[data-level]').forEach(layer=>{
  const floor=Number(layer.dataset.level);
  layer.classList.toggle('selected-floor',floor===state.floor);
  if(activeFloors().includes(floor)){
   layer.setAttribute('aria-label',`${floor===state.floor?'Floor':'Open floor'} ${floor}`);
   if(floor!==state.floor){layer.setAttribute('tabindex','0');layer.setAttribute('role','button');}
   else{layer.removeAttribute('tabindex');layer.removeAttribute('role');}
  }
  layer.innerHTML=venueId()==='wwh'?wwhFirstFloor():floorContents(floor);
  layer.style.transform=`translateY(${shiftFor(floor)}px)`;
 });
 requestPixelRender();
}
let pixelAnimation=0,pixelUntil=0,pixelDrawAt=0,pixelSequence=0;
function updateDiagramLabels(){
 const map=$('building'),source=map.querySelector('.building-scene'),width=map.clientWidth,height=map.clientHeight;if(!source||!width||!height)return;
 let overlay=map.querySelector('.diagram-overlays');
 if(!overlay){
  overlay=document.createElement('div');overlay.className='diagram-overlays';
  overlay.innerHTML=`<svg class="badge-leaders" aria-hidden="true"></svg><svg class="vector-place-labels" viewBox="-45 -35 750 965" aria-hidden="true"></svg><div class="map-place map-place--laguardia"><span>LaGuardia</span><span>Place</span></div><div class="map-place map-place--south"><span>Washington</span><span>Square South</span></div><div class="map-place map-place--park"><span>Washington</span><span>Square Park</span></div><button type="button" class="diagram-restroom-badge" data-show-restrooms aria-label="Find restrooms"><span aria-hidden="true">WC</span></button><div class="diagram-track-labels" aria-hidden="true"></div><div class="diagram-amenity" aria-hidden="true"></div>${activeFloors().map(f=>`<button type="button" class="diagram-floor-badge" data-choose-floor="${f}" aria-label="Open floor ${f}">${f}</button>`).join('')}`;map.append(overlay);
  const labels=overlay.querySelector('.vector-place-labels');source.querySelectorAll(':scope > text').forEach(node=>labels.append(node.cloneNode(true)));
 }
 const items=activeFloors().map(floor=>{const layer=source.querySelector(`[data-level="${floor}"]`),shift=new DOMMatrix(getComputedStyle(layer).transform).m42,[x,y]=p(5,10,baseFor(floor)+shift);return {floor,x:(x+45)*width/750,y:(y+35)*height/965};}).sort((a,b)=>a.y-b.y);
 const blocks=[];items.forEach((item,index)=>{blocks.push({indices:[index],sum:item.y-22-index*50});while(blocks.length>1){const a=blocks.at(-2),b=blocks.at(-1);if(a.sum/a.indices.length<=b.sum/b.indices.length)break;blocks.splice(-2,2,{indices:[...a.indices,...b.indices],sum:a.sum+b.sum});}});
 const positions=[];blocks.forEach(block=>block.indices.forEach(index=>positions[index]=block.sum/block.indices.length+index*50));
 const badgeBottom=height-Math.max(...[...overlay.querySelectorAll('.map-place--south,.map-place--park')].map(label=>label.getBoundingClientRect().height))-10;
 const adjustment=positions.at(-1)+44>badgeBottom?badgeBottom-44-positions.at(-1):positions[0]<4?4-positions[0]:0;
 const left=width-48;let leaders='';items.forEach((item,index)=>{const top=positions[index]+adjustment,button=overlay.querySelector(`[data-choose-floor="${item.floor}"]`);button.style.left=`${left}px`;button.style.top=`${top}px`;button.setAttribute('aria-pressed',String(item.floor===state.floor));leaders+=`<path d="M${item.x} ${item.y} L${left-4} ${top+22}" fill="none" stroke="${P.line}" stroke-width="1.5"/>`;});
 if(venueId()==='wwh'){
  overlay.querySelector('.map-place--laguardia').innerHTML='<span>Mercer</span><span>Street</span>';
  overlay.querySelector('.map-place--south').innerHTML='<span>West 4th</span><span>Street</span>';
  overlay.querySelector('.map-place--park').innerHTML='<span>Gould</span><span>Plaza</span>';
 }
 const frame=overlay.getBoundingClientRect();
 const places=[['laguardia',[315,220]],['south',[126,-53]],['park',venueId()==='wwh'?[-68,175]:[145,-163]]];
 for(const[name,world]of places){
  const label=overlay.querySelector(`.map-place--${name}`),box=label.getBoundingClientRect(),[x,y]=p(...world,700),target={x:(x+45)*width/750,y:(y+35)*height/965};
  const from={x:Math.max(box.left-frame.left+10,Math.min(box.right-frame.left-10,target.x)),y:box.top-frame.top+3};
  leaders+=`<path class="place-pointer" d="M${from.x} ${from.y} L${target.x} ${target.y}" fill="none" stroke="${P.ink}" stroke-width="1.2" stroke-linecap="round"/><circle cx="${target.x}" cy="${target.y}" r="2.4" fill="${P.ink}"/>`;
 }
 const amenity=overlay.querySelector('.diagram-amenity'),available=rooms(state.floor),serviceRoom=available.find(room=>room.service||room.amenities?.length),kind=serviceRoom?.service||serviceRoom?.amenities?.[0]||null;
 const restroom=overlay.querySelector('.diagram-restroom-badge'),bathroom=restroomInfo();
 restroom.hidden=!bathroom?.points.length;
 if(bathroom?.points.length){
  const layer=source.querySelector(`[data-level="${state.floor}"]`),shift=new DOMMatrix(getComputedStyle(layer).transform).m42;
  const center=bathroom.points.reduce((sum,point)=>[sum[0]+point[0]/bathroom.points.length,sum[1]+point[1]/bathroom.points.length],[0,0]);
  const[x,y]=p(...center,baseFor(state.floor)+shift);
  restroom.style.left=`${(x+45)*width/750}px`;restroom.style.top=`${(y+35)*height/965}px`;
  restroom.setAttribute('aria-label',venueId()==='wwh'?'All-gender restrooms, adjacent to the snack machine':`Restrooms on floor ${state.floor}`);
 }
 amenity.hidden=!kind;
 if(kind){
  amenity.innerHTML=(serviceRoom.amenities||[kind]).map(item=>foodFriend(item)).join('');
  const layer=source.querySelector(`[data-level="${state.floor}"]`),shift=new DOMMatrix(getComputedStyle(layer).transform).m42;
  const[x,y]=p(...(venueId()==='wwh'?[210,262]:kind==='coffee'?[168,385]:[153,228]),baseFor(state.floor)+shift);
  amenity.style.left=`${(x+45)*width/750}px`;amenity.style.top=`${(y+35)*height/965}px`;
 }
 const drawnRooms=[...source.querySelectorAll('.selected-floor .svg-room[data-room]')];
 overlay.querySelector('.diagram-track-labels').innerHTML=available.map(room=>{
  const tracks=venueId()==='wwh'?[({'109':'A','101':'B','102':'C'})[room.id]].filter(Boolean):(room.programTracks||(['A','B','C','D','TCC'].includes(room.id)?[room.id]:[]));
  if(!tracks.length)return '';
  const shape=drawnRooms.find(node=>node.dataset.room===room.id);if(!shape)return '';
  const box=shape.getBoundingClientRect(),x=(box.left+box.right)/2-frame.left,y=(box.top+box.bottom)/2-frame.top;
  return `<span class="diagram-track-label" data-track-room="${esc(room.id)}" style="left:${x}px;top:${y}px">${tracks.map(esc).join('/')}</span>`;
 }).join('');
 const lines=overlay.querySelector('.badge-leaders');lines.setAttribute('viewBox',`0 0 ${width} ${height}`);lines.innerHTML=leaders;
}
function drawPixelFrame(){
 const source=$('building').querySelector('.building-scene');if(!source||!usesPixels())return;
 let canvas=$('building').querySelector('canvas');
 if(!canvas){canvas=document.createElement('canvas');canvas.className='pixel-canvas';canvas.setAttribute('aria-hidden','true');$('building').append(canvas);}
 const width=Math.max(150,Math.min(260,Math.round($('building').clientWidth/2)));
 const height=Math.round(width*965/750);if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
 const copy=source.cloneNode(true);
 copy.querySelectorAll('text,.place-labels').forEach(node=>node.remove());
 copy.setAttribute('width','750');copy.setAttribute('height','965');copy.setAttribute('shape-rendering','crispEdges');copy.setAttribute('font-family','monospace');
 const liveLayers=source.querySelectorAll('[data-level]');
 copy.querySelectorAll('[data-level]').forEach((layer,index)=>{layer.style.transform=getComputedStyle(liveLayers[index]).transform;layer.style.transition='none';});
 const css=document.createElementNS('http://www.w3.org/2000/svg','style');
 // Outer contours retain at least one output pixel in the small raster version.
 css.textContent=`text{font-family:monospace}.room-fill{stroke:${P.line};stroke-width:1.5}.room-outline{fill:none;stroke:${P.line};stroke-width:${Math.max(1.5,750/width)};stroke-linejoin:round;stroke-linecap:round;pointer-events:none}.room-outline.is-selected{stroke:${P.primary};stroke-width:${Math.max(3,1125/width)}}.wwh-crosshall{stroke:none}.room-outline[data-outline-room="crosshall"]{stroke:none}.room-outline[data-outline-room="crosshall"].is-selected{stroke:${P.primary};stroke-opacity:.45;stroke-width:1.5;stroke-dasharray:5 5}.route{fill:none;stroke:${P.primary};stroke-width:3;stroke-dasharray:5 5}`;copy.prepend(css);
 const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)],{type:'image/svg+xml'}));
 const picture=new Image(),sequence=++pixelSequence;
 picture.onload=()=>{if(sequence===pixelSequence&&canvas.isConnected&&usesPixels()){const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,width,height);ctx.drawImage(picture,0,0,width,height);$('building').dataset.pixelsReady='true';}URL.revokeObjectURL(url);};
 picture.onerror=()=>URL.revokeObjectURL(url);picture.src=url;
}
function requestPixelRender(duration=760){
 if(!usesPixels())pixelSequence++;
 const now=performance.now();pixelUntil=now+(matchMedia('(prefers-reduced-motion: reduce)').matches?0:duration);
 if(pixelAnimation)return;
 const tick=time=>{if(time-pixelDrawAt>38||time>=pixelUntil){updateDiagramLabels();if(usesPixels())drawPixelFrame();pixelDrawAt=time;}pixelAnimation=time<pixelUntil?requestAnimationFrame(tick):0;};
 pixelAnimation=requestAnimationFrame(tick);
}
function detail(){
 const floor=state.floor;
 if(venueId()==='wwh')return themed(`<svg viewBox="-55 -45 370 475" role="group" aria-label="WWH first-floor schematic, not to scale. Track A: room 109, Track B: 101, Track C: 102. Enter from Mercer Street, east; Gould Plaza is west.">${text(130,-20,'North · West 4th Street',12)}${wwhPlan(1)}<text x="-29" y="170" text-anchor="middle" font-size="12" fill="${P.ink}" transform="rotate(-90 -29 170)">Gould Plaza · west</text><text x="289" y="170" text-anchor="middle" font-size="12" fill="${P.ink}" transform="rotate(90 289 170)">Mercer Street · east</text></svg>`);
 return themed(`<svg viewBox="-70 -65 360 510" role="group" aria-label="North-up schematic of Kimmel floor ${floor}. Washington Square South is at the top and LaGuardia Place is at the right."><rect x="-64" y="-60" width="350" height="24" rx="9" fill="#dce9d7"/>${text(110,-44,'Washington Square Park',12)}${text(110,-14,'Washington Square South · north',12)}${plan(floor)}<text x="281" y="205" text-anchor="middle" font-size="12" fill="#776b80" transform="rotate(90 281 205)">LaGuardia Place · east</text>${floor!==1?text(120,428,'South · away from the park',11):''}</svg>`);
}
function chooseRoom(id){const found=rooms(state.floor).find(r=>r.id===id);if(found){const focus=rememberMapFocus();state.automaticLocation=false;state.room=id;renderSelection();$('floor-plan').innerHTML=detail();renderBuilding();updateMapUrl();restoreMapFocus(focus);}}
function chooseFloor(floor){if(!activeFloors().includes(Number(floor)))return;state.automaticLocation=false;state.floor=Number(floor);state.room=rooms(state.floor)[0]?.id||null;render();}
function renderSelection(){
 const available=rooms(state.floor);const chosen=available.find(r=>r.id===state.room)||available[0];
 $('room-list').innerHTML=available.map(r=>`<button type="button" class="room-button" data-choose-room="${r.id}" style="--room-color:${esc(r.color||P.floor)}" aria-pressed="${r.id===chosen?.id}">${r.service||r.amenities?foodFriend(r.service||'coffee'):''}<span>${esc(r.short)}</span></button>`).join('')+(restroomInfo()?`<button type="button" class="room-button restroom-shortcut" data-show-restrooms><span class="restroom-key">WC</span><span>${venueId()==='wwh'?'All-gender restrooms':'Restrooms'}</span></button>`:'');
 $('selection-title').textContent=chosen?`${chosen.title} · ${chosen.subtitle}`:'No conference space today';
 $('selection-description').textContent=chosen?chosen.description:'No conference space is listed on this floor today.';
 $('selection-dot').style.background=chosen?.color||'#d0c5d7';
}
function renderRestroomGuide(){
 let guide=$('restroom-guide');
 if(!guide){guide=document.createElement('p');guide.id='restroom-guide';guide.className='restroom-guide';guide.tabIndex=-1;$('floor-plan').after(guide);}
 const info=restroomInfo();guide.hidden=!info;
 if(info)guide.innerHTML=`<strong><span class="restroom-key">WC</span> ${venueId()==='wwh'?'All-gender restrooms':'Restrooms'}</strong><span>${esc(info.description)}</span>`;
}
function render(){
 const day=currentDay(),focus=pendingMapFocus||rememberMapFocus();pendingMapFocus=null;
 document.body.dataset.venue=venueId();
 document.body.dataset.dayIsAutomatic=String(state.automaticDay);
 document.querySelector('.brand-mark').textContent=venueId()==='wwh'?'w.':'k.';
 document.title=`${venueId()==='wwh'?'WWH':'Kimmel'} · Find your ${document.body.dataset.view==='program'?'session':'floor'}`;
 document.querySelector('.address').textContent=venueId()==='wwh'?'Warren Weaver Hall · 251 Mercer Street':'Kimmel Center · 60 Washington Square South';
 $('map-footer-note').textContent='Schematic illustration · Not to scale';
 const updated=document.querySelector('meta[name="map-updated"]')?.content;
 $('venue-source-note').textContent=updated?`Last updated on ${new Date(`${updated}T12:00:00`).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}.`:'';
 $('building-title').textContent=venueId()==='wwh'?'WWH · first floor':'Open a floor';
 $('days').innerHTML=DAYS.map((d,i)=>`<button type="button" class="day-button" data-day="${i}" aria-label="${esc(d.title)}" aria-pressed="${i===state.day}"><span>${d.short}${d.period?` <small>${esc(d.period)}</small>`:''}</span><b>${d.date}</b></button>`).join('');
 $('day-title').textContent=day.title;$('conference-tag').textContent=day.conference;$('day-note').textContent=day.note;renderConferenceClock();
 renderBuilding();
 $('floor-selector').style.setProperty('--floor-count',activeFloors().length);
 $('floor-selector').innerHTML=[...activeFloors()].reverse().map(f=>{const contents=floorSummary(f);return `<button type="button" class="floor-button" data-choose-floor="${f}" aria-label="${f===1?'Entrance level':`Floor ${f}`}${contents.length?` · ${esc(contents.join(', '))}`:''}" aria-pressed="${state.floor===f}"><b>${f}</b>${contents.length?`<span class="floor-contents">${contents.map(esc).join('<br>')}</span>`:''}</button>`;}).join('');
 $('floor-kicker').textContent=state.floor===1?'Start here':`Floor ${state.floor}`;
 $('floor-title').textContent=venueId()==='wwh'?'First-floor rooms':state.floor===8?'Shorin 802':state.floor===1?'The entrance':state.floor===4?'Auditorium & rooms':state.floor===9?'Meeting rooms':'Rosenthal Pavilion';
 $('floor-plan').innerHTML=detail();renderSelection();renderRestroomGuide();
 document.body.dataset.day=day.id;
 document.dispatchEvent(new CustomEvent('kimmel:day',{detail:{day:day.id,venueId:venueId(),date:`2026-11-${String(day.date).padStart(2,'0')}`}}));
 updateMapUrl();
 restoreMapFocus(focus);
}
document.addEventListener('change',event=>{if(event.target.id==='mood-selector'){if(applyStyle(event.target.value))render();else updateMapUrl();}});
document.addEventListener('keydown',event=>{
 const target=event.target.closest('.svg-room[tabindex="0"],.floor-hit[tabindex="0"]');
 if(target&&(event.key==='Enter'||event.key===' ')){event.preventDefault();target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}
});
document.addEventListener('click',event=>{
 if(event.target.closest('[data-show-restrooms]')){const guide=$('restroom-guide');if(guide){guide.focus({preventScroll:true});guide.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'nearest'});}return;}
 const day=event.target.closest('#days button[data-day]');if(day){
  const before=venueId();state.automaticDay=false;state.automaticLocation=false;state.day=Number(day.dataset.day);const after=venueId();
  if(before!==after){state.floor=after==='wwh'?1:4;$('building').innerHTML='';}
  if(!activeFloors().includes(state.floor)||!rooms(state.floor).length)state.floor=after==='wwh'?1:currentDay().tcc&&!currentDay().focs?9:4;
  state.room=rooms(state.floor).find(room=>room.id==='109')?.id||rooms(state.floor)[0]?.id||null;render();
  document.querySelector('#days button[aria-pressed="true"]')?.focus({preventScroll:true});
  if(before!==after)document.dispatchEvent(new CustomEvent('conference:venue',{detail:{from:before,to:after}}));return;
 }
 const room=event.target.closest('[data-choose-room],[data-room]');if(room){chooseRoom(room.dataset.chooseRoom||room.dataset.room);return;}
 const floor=event.target.closest('[data-choose-floor],[data-floor]');if(floor){chooseFloor(floor.dataset.chooseFloor||floor.dataset.floor);return;}
});
initializeConferenceLocation();
applyStyle(query.get('mood')||query.get('style')||'auto');
state.room=rooms(state.floor)[0]?.id||null;
document.addEventListener('conference:program',event=>{PROGRAM_DATA=event.detail?.data||PROGRAM_DATA;applyCurrentLocation();render();});
document.addEventListener('conference:locate',event=>{
 const target=event.detail||{},before=venueId();
 state.automaticDay=false;state.automaticLocation=false;
 const dayIndex=DAYS.findIndex(day=>day.id===target.day);if(dayIndex>=0)state.day=dayIndex;
 if(target.venueId&&target.venueId!==venueId())state.day=DAYS.findIndex(day=>day.id===(target.venueId==='wwh'?'sunday-early':'sunday-late'));
 state.floor=activeFloors().includes(Number(target.floor))?Number(target.floor):venueId()==='wwh'?1:4;
 state.room=rooms(state.floor).find(room=>room.id===target.room||room.id===resolveMapRoom(target.room)||room.hold?.room===target.room)?.id||rooms(state.floor)[0]?.id||null;
 if(before!==venueId()){pendingMapFocus=rememberMapFocus()||pendingMapFocus;$('building').innerHTML='';}
 render();
 if(before!==venueId())document.dispatchEvent(new CustomEvent('conference:venue',{detail:{from:before,to:venueId()}}));
});
async function refreshRooms(){
 try{const response=await fetch('room-data.json',{cache:'no-cache'});if(!response.ok)return;const data=await response.json();if(!Array.isArray(data.rooms))return;const changed=JSON.stringify(data)!==JSON.stringify(ROOM_DATA);ROOM_DATA=data;if(changed){if(!rooms(state.floor).some(room=>room.id===state.room))state.room=rooms(state.floor).find(room=>room.id==='109')?.id||rooms(state.floor)[0]?.id||null;render();}}catch{}
}
refreshRooms();setInterval(refreshRooms,300000);setInterval(syncConferenceTime,15000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){syncConferenceTime();refreshRooms();}});
new ResizeObserver(()=>requestPixelRender(80)).observe($('building'));
render();
})();
