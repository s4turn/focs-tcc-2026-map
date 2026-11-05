(()=>{
'use strict';
const ZONE='America/New_York';
const PIXELS_PER_MINUTE=2.2;
const DATES={'sunday-early':'2026-11-08','sunday-late':'2026-11-08',monday:'2026-11-09',tuesday:'2026-11-10',wednesday:'2026-11-11',thursday:'2026-11-12',friday:'2026-11-13'};
const query=new URLSearchParams(location.search);
const state={data:null,day:document.body.dataset.day||query.get('day')||'monday',view:query.get('view')==='program'?'program':'map',zoom:'themes',session:null,paper:null,expanded:null};
const focusedTimes=new Set();
const $=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const minutes=value=>{if(!value)return null;const parts=String(value).split(':').map(Number);return parts[0]*60+parts[1]+(parts[2]||0)/60;};
const time=value=>{const m=typeof value==='number'?value:minutes(value);if(m===null)return '';const h=Math.floor(m/60),n=Math.floor(m%60);return `${h%12||12}:${String(n).padStart(2,'0')} ${h>=12?'p.m.':'a.m.'}`;};
const clockTime=value=>{const total=Math.floor(value*60),h=Math.floor(total/3600),n=Math.floor(total%3600/60),s=total%60;return `${h%12||12}:${String(n).padStart(2,'0')}:${String(s).padStart(2,'0')} ${h>=12?'p.m.':'a.m.'}`;};
const range=(start,end)=>`${time(start)}–${time(end)}`;
const authors=paper=>Array.isArray(paper.authors)?paper.authors.join('; '):paper.authors||'See the published program for speaker details.';
const getDay=()=>state.data?.days.find(day=>day.id===state.day)||state.data?.days[0];
const sessions=()=>getDay()?.sessions||[];
const selectedSession=()=>sessions().find(session=>session.id===state.session)||defaultSession();
// Sunday workshop letters are presentation labels; reviewed source track numbers stay intact.
const WWH_TRACKS=Object.freeze({'109':'A','101':'B','102':'C'});
const displayTrack=session=>state.day==='sunday-early'?(WWH_TRACKS[String(session.room)]||({'1':'A','2':'B','3':'C'})[String(session.track)]||session.track):session.track;
const safeUrl=value=>{try{const url=new URL(value);return /^https?:$/.test(url.protocol)?url.href:null;}catch{return null;}};
function etNow(){
 const now=new Date(),parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(now).map(part=>[part.type,part.value]));
 return {date:`${parts.year}-${parts.month}-${parts.day}`,minutes:Number(parts.hour)*60+Number(parts.minute)+Number(parts.second)/60,label:new Intl.DateTimeFormat('en-US',{timeZone:ZONE,weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',second:'2-digit'}).format(now)};
}
function bounds(){
 const starts=sessions().map(s=>minutes(s.start)).filter(Number.isFinite),ends=sessions().map(s=>minutes(s.end)).filter(Number.isFinite);
 return {start:starts.length?Math.floor(Math.min(...starts)/30)*30:540,end:ends.length?Math.ceil(Math.max(...ends)/30)*30:1080};
}
function activeTime(){
 const now=etNow(),day=getDay();
 if(now.date===(day?.date||DATES[state.day]))return {mode:'live',minutes:now.minutes,now};
 return {mode:'off',minutes:null,now};
}
function defaultSession(){
 const list=sessions(),current=activeTime();
 if(current.mode==='live'){
  const active=list.filter(session=>minutes(session.start)<=current.minutes&&current.minutes<minutes(session.end));
  if(active.length)return active.find(session=>session.papers?.length)||active.find(session=>session.floor)||active[0];
  const upcoming=list.filter(session=>minutes(session.start)>=current.minutes).sort((a,b)=>minutes(a.start)-minutes(b.start));
  if(upcoming.length)return upcoming[0];
  return [...list].sort((a,b)=>minutes(b.end)-minutes(a.end))[0];
 }
 return list.find(session=>session.papers?.length)||list[0];
}
function laneFor(session){
 if(state.day==='sunday-early')return `WWH-${session.room||'109'}`;
 if(state.day==='sunday-late')return 'KIMMEL-SUNDAY';
 if(session.conference==='TCC')return 'TCC';
 return ['A','B','C','D'].includes(session.track)?`FOCS-${session.track}`:'FOCS-A';
}
function lanes(){
 const places=items=>[...new Set(items.filter(s=>s.room).map(s=>`${s.room}${s.floor?` · floor ${s.floor}`:''}`))].join(' / ')||'Location to confirm';
 if(state.day==='sunday-early')return [...new Set(sessions().filter(s=>s.room).map(s=>s.room))].sort((a,b)=>['109','101','102'].indexOf(a)-['109','101','102'].indexOf(b)).map(room=>({id:`WWH-${room}`,conference:'FOCS',track:WWH_TRACKS[room]||room,title:`Track ${WWH_TRACKS[room]||room}`,subtitle:`WWH · Room ${room}`}));
 if(state.day==='sunday-late')return [{id:'KIMMEL-SUNDAY',conference:'FOCS',track:'Joint',title:'Kimmel · Sunday late',subtitle:places(sessions())}];
 const found=new Map();
 for(const session of sessions()){
  if(['break','meal'].includes(session.kind))continue;
  const id=laneFor(session),tcc=id==='TCC',track=tcc?'TCC':id.slice(-1);
  if(!found.has(id))found.set(id,{id,conference:tcc?'TCC':'FOCS',track,title:tcc?'TCC':`FOCS · Track ${track}`,subtitle:places(sessions().filter(s=>laneFor(s)===id&&!['break','meal'].includes(s.kind)))});
 }
 return [...found.values()].sort((a,b)=>a.id.localeCompare(b.id));
}
function sessionLocation(session){return session.room?`${session.venueId==='wwh'?'WWH':'Kimmel'} · ${session.room}${session.floor?` · Floor ${session.floor}`:''}`:'';}
function floorLink(session){return session.floor?`<button type="button" class="program-button" data-show-floor="${session.floor}" data-show-venue="${esc(session.venueId||'kimmel')}" data-show-room="${esc(session.room||'')}" data-show-day="${esc(state.day)}">Show ${session.venueId==='wwh'?'WWH':'Kimmel'} floor ${session.floor}</button>`:'';}
function timingNote(session){
 const papers=session.papers||[];if(!papers.length)return '';
 const published=papers.filter(p=>p.start),inferred=published.some(p=>/infer/i.test(p.timeStatus||'')),tentative=session.talkScheduleTentative||published.some(p=>/tentative/i.test(p.timeStatus||''));
 return `${published.length?(inferred?'Published talk starts; end times are inferred from the next start or session end.':'Talk start and end times are published.'):'Individual talk times are not published. Papers appear in program order within this session.'}${tentative?' The organizer labels this agenda tentative.':''}`;
}
function sessionContents(session){
 const papers=session.papers||[],url=safeUrl(session.url),location=sessionLocation(session);
 const workshopTrack=state.day==='sunday-early'&&displayTrack(session)?`<span>Track ${esc(displayTrack(session))}</span>`:'';
 const conflict=session.timingConflict?.note?`<p class="program-conflict">${esc(session.timingConflict.note)}</p>`:'';
 const timing=papers.length?`<p class="program-inline-note">${esc(timingNote(session))}</p>`:'';
 return `<div class="program-inline-meta">${location?`<strong>${esc(location)}</strong>`:''}${workshopTrack}<span>${esc(range(session.start,session.end))} ET</span></div>${conflict}${session.chair?`<p class="program-inline-note">Chair: ${esc(session.chair)}</p>`:''}${timing}${papers.length?`<ol class="program-inline-papers">${papers.map((paper,i)=>`<li class="program-inline-paper" ${paper.start?`data-talk-start="${minutes(paper.start)}" data-talk-end="${minutes(paper.end||session.end)}"`:''}><span class="program-inline-time">${paper.start?esc(paperTime(paper,session)):`Talk ${paper.order||i+1}`}</span><strong>${esc(paper.title)}</strong><p>${esc(authors(paper))}</p></li>`).join('')}</ol>`:`<p class="program-inline-note">${esc(session.title)}</p>`}<div class="program-inline-actions">${papers.length?`<button type="button" class="program-button" data-session="${esc(session.id)}">Focus on papers</button>`:''}${floorLink(session)}${url?`<a class="program-paper-link" href="${esc(url)}" target="_blank" rel="noopener">Published program ↗</a>`:''}<button type="button" class="program-button program-collapse" data-collapse-session>Collapse session ↑</button></div>`;
}
function sessionButton(session,b,lane){
 const start=minutes(session.start),end=minutes(session.end),duration=end-start;
 const isBreak=['break','meal'].includes(session.kind),compact=duration<45;
 const title=session.theme||session.title,count=session.papers?.length||0;
 const place=session.room?` · ${session.room}`:'';
 const klass=`program-session${compact?' program-session--compact':''}${isBreak?' program-session--break':''}`;
 const top=(start-b.start)*PIXELS_PER_MINUTE,height=Math.max(44,duration*PIXELS_PER_MINUTE-3),key=`${session.id}-${lane.id}`,expanded=state.expanded===key;
 return `<details class="${klass}" data-event="${esc(session.id)}" data-expand-session="${esc(key)}" data-session-start="${start}" data-session-end="${end}" style="top:${top}px;--session-height:${height}px" ${expanded?'open':''}><summary class="program-session-toggle" aria-controls="session-content-${esc(key)}" aria-expanded="${expanded}"><span class="program-session-time">${esc(range(session.start,session.end))}</span><strong class="program-session-title">${esc(title)}</strong>${!isBreak?`<span class="program-session-extra">${esc(count?`${count} ${count===1?'talk':'talks'}${place}`:session.kind==='plenary'?`Plenary${place}`:session.room||'Session details')}</span>`:''}<span class="program-session-affordance"><span class="program-expand-label">Expand</span><span class="program-contract-label">Collapse</span><span class="program-session-chevron" aria-hidden="true">⌄</span></span></summary><div class="program-session-body" id="session-content-${esc(key)}">${sessionContents(session)}</div></details>`;
}
function timeline(){
 const list=lanes(),b=bounds(),height=(b.end-b.start)*PIXELS_PER_MINUTE;
 const short=sessions().filter(s=>minutes(s.end)-minutes(s.start)<15);
 const shortHtml=short.length?`<div class="program-short-events">${short.map(s=>`<details class="program-short-event" data-event="${esc(s.id)}"><summary>${esc(time(s.start))} · ${esc(s.conference)} · ${esc(s.theme||s.title)} <span aria-hidden="true">⌄</span></summary><div class="program-session-body">${sessionContents(s)}</div></details>`).join('')}</div>`:'';
 const ticks=[];for(let m=b.start;m<=b.end;m+=30)ticks.push(`<span class="program-tick" data-minute="${m}" style="top:${(m-b.start)*PIXELS_PER_MINUTE}px">${esc(time(m).replace(' a.m.','a').replace(' p.m.','p'))}</span>`);
 return `${shortHtml}<div class="program-timeline-scroll" aria-label="Parallel tracks. Scroll horizontally on a small screen."><div class="program-timeline" style="--lane-count:${Math.max(1,list.length)};--timeline-height:${height}px"><div class="program-lane-headings"><span class="program-axis-label">ET</span>${list.map(lane=>`<div class="program-lane-heading" data-track="${lane.track}"><strong>${esc(lane.title)}</strong><span>${esc(lane.subtitle)}</span></div>`).join('')}</div><div class="program-timeline-body"><div class="program-time-axis" aria-hidden="true">${ticks.join('')}</div>${list.map(lane=>`<div class="program-lane" data-lane="${esc(lane.id)}" data-track="${lane.track}" aria-label="${esc(lane.title)}">${sessions().filter(s=>minutes(s.end)-minutes(s.start)>=15&&(laneFor(s)===lane.id||(['break','meal'].includes(s.kind)&&s.conference===lane.conference))).map(s=>sessionButton(s,b,lane)).join('')}</div>`).join('')}<div id="program-now-line" class="program-now-line" hidden><span class="program-now-label" id="program-now-label"></span></div></div></div></div>`;
}
let expansion=null,timelineObserver;
function timelinePosition(minute,followPapers=false){
 const base=(minute-bounds().start)*PIXELS_PER_MINUTE;
 if(!expansion||minute<expansion.start)return base;
 if(minute>=expansion.end)return base+expansion.extra;
 if(followPapers&&expansion.slots?.length){
  const slot=expansion.slots.find(slot=>minute>=slot.start&&minute<slot.end);
  if(slot)return slot.top+(slot.bottom-slot.top)*(minute-slot.start)/(slot.end-slot.start);
  const before=expansion.slots.filter(slot=>slot.end<=minute).at(-1),after=expansion.slots.find(slot=>slot.start>minute);
  // Explicit organizer gaps remain gaps; the line rests at / moves through the divider.
  if(before&&after)return before.bottom+(after.top-before.bottom)*(minute-before.end)/(after.start-before.end);
  if(before)return before.bottom;
  if(after)return after.top;
 }
 return base+expansion.extra*(minute-expansion.start)/(expansion.end-expansion.start);
}
function layoutTimeline(){
 const timeline=document.querySelector('.program-timeline');if(!timeline)return;
 const cards=[...timeline.querySelectorAll('[data-expand-session]')],open=cards.find(card=>card.open),list=lanes(),b=bounds();
 // Widen just the open lane; keep all tracks on the same stretched time axis.
 const openLane=open?.closest('[data-lane]')?.dataset.lane,expandedWidth=Math.min(280,Math.max(200,timeline.parentElement.clientWidth-66));
 timeline.style.setProperty('--lane-columns',`54px ${list.map(lane=>lane.id===openLane?`minmax(${expandedWidth}px,1.6fr)`:'minmax(168px,1fr)').join(' ')}`);
 timeline.style.minWidth=`${54+list.length*168+(openLane?expandedWidth-168:0)+list.length*12}px`;
 expansion=null;
 if(open){
  const start=Number(open.dataset.sessionStart),end=Number(open.dataset.sessionEnd),base=(end-start)*PIXELS_PER_MINUTE;
  expansion={start,end,extra:Math.max(0,open.getBoundingClientRect().height+3-base)};
 }
 timeline.style.setProperty('--timeline-height',`${timelinePosition(b.end)}px`);
 for(const card of cards){
  const start=Number(card.dataset.sessionStart),end=Number(card.dataset.sessionEnd);
  card.style.top=`${timelinePosition(start)}px`;card.style.setProperty('--session-height',`${Math.max(44,timelinePosition(end)-timelinePosition(start)-3)}px`);
  card.querySelector('summary').setAttribute('aria-expanded',String(card.open));
 }
 if(open){
  const origin=timeline.querySelector('.program-timeline-body').getBoundingClientRect().top,groups=new Map();
  open.querySelectorAll('[data-talk-start][data-talk-end]').forEach(row=>{
   const start=Number(row.dataset.talkStart),end=Number(row.dataset.talkEnd),rect=row.getBoundingClientRect(),key=`${start}/${end}`;
   if(end<=start)return;
   const slot=groups.get(key);if(slot)slot.bottom=rect.bottom-origin;else groups.set(key,{start,end,top:rect.top-origin,bottom:rect.bottom-origin});
  });
  expansion.slots=[...groups.values()];
 }
 timeline.querySelectorAll('[data-minute]').forEach(tick=>{tick.style.top=`${timelinePosition(Number(tick.dataset.minute),true)}px`;});
 tick();
}
function observeTimeline(){
 timelineObserver?.disconnect();
 if(typeof ResizeObserver==='undefined')return;
 const timeline=document.querySelector('.program-timeline-scroll');if(!timeline)return;
 timelineObserver=new ResizeObserver(layoutTimeline);timelineObserver.observe(timeline);
}
function paperTime(paper,session){
 return paper.start?range(paper.start,paper.end||session.end):`Session ${range(session.start,session.end)}`;
}
function paperDetail(paper,session){
 const url=safeUrl(paper.url)||safeUrl(session.url),isPaper=url&&url!==safeUrl(session.url)&&!url.includes('focs.computer.org/2026/main-program');
 const ordinal=paper.order||session.papers.findIndex(p=>p.id===paper.id)+1;
 const timing=paper.start?(paper.timeStatus||'Published talk start.'): `Talk ${ordinal} of ${session.papers.length}. Individual talk time is not published; papers are listed in program order.`;
 const location=sessionLocation(session);
 return `<h3 id="program-selected-title" aria-live="polite">${esc(paper.title)}</h3><p class="program-paper-authors">${esc(authors(paper))}</p><div class="program-paper-where"><strong>${esc(paperTime(paper,session))} ET</strong>${location?`<span>${esc(location)}</span>`:''}<span>${esc(session.conference)}${displayTrack(session)&&!['TCC','Plenary','Joint'].includes(displayTrack(session))?` · Track ${esc(displayTrack(session))}`:''}</span></div><p class="program-paper-note">${esc(timing)}</p>${url?`<a class="program-paper-link" href="${esc(url)}" target="_blank" rel="noopener">${isPaper?'Read the paper':'Published program'} ↗</a>`:''}${session.floor?`<div>${floorLink(session)}</div>`:''}`;
}
function detail(){
 const session=selectedSession();if(!session)return '<p>No sessions are listed for this day.</p>';
 state.session=session.id;
 const papers=session.papers||[],current=activeTime();let paper=papers.find(p=>p.id===state.paper)||(current.mode==='live'?papers.find(p=>p.start&&minutes(p.start)<=current.minutes&&current.minutes<minutes(p.end||session.end)):null)||papers[0];state.paper=paper?.id||null;
 const options=sessions().map(s=>`<option value="${esc(s.id)}" ${s.id===session.id?'selected':''}>${esc(time(s.start))} · ${esc(s.conference)}${displayTrack(s)&&!['TCC','Plenary','Joint'].includes(displayTrack(s))?` ${esc(displayTrack(s))}`:''} · ${esc(s.theme||s.title)}</option>`).join('');
 const conflict=session.timingConflict?.note?`<p class="program-conflict">${esc(session.timingConflict.note)}</p>`:'';
 const header=`<label class="program-session-select-label" for="program-session-selector">Theme / event</label><select id="program-session-selector" class="program-session-select">${options}</select><div class="program-theme-header"><h3>${esc(session.theme||session.title)}</h3><div class="program-theme-meta"><strong>${esc(range(session.start,session.end))} ET</strong><span>${esc(session.conference)}${displayTrack(session)&&!['TCC','Plenary','Joint'].includes(displayTrack(session))?` · Track ${esc(displayTrack(session))}`:''}</span>${session.room?`<span>${esc(sessionLocation(session))}</span>`:''}${session.chair?`<span>Chair: ${esc(session.chair)}</span>`:''}</div><p id="program-session-status" class="program-session-status" hidden></p>${conflict}</div>`;
 if(!papers.length)return header+`<div class="program-event-only"><p>${esc(session.title)}</p>${session.room?`<p class="program-paper-note">${esc(session.room)}</p>`:''}${safeUrl(session.url)?`<a class="program-paper-link" href="${esc(safeUrl(session.url))}" target="_blank" rel="noopener">Published program ↗</a>`:''}${session.floor?`<div>${floorLink(session)}</div>`:''}</div>`;
 return header+`<div class="program-paper-grid"><article id="program-paper-detail" class="program-paper-detail" aria-label="Selected talk">${paperDetail(paper,session)}</article><div id="program-paper-list" class="program-paper-list" aria-label="Papers in program order">${papers.map((p,i)=>`<button type="button" class="program-paper-button" data-paper="${esc(p.id)}" ${p.start?`data-start="${minutes(p.start)}" data-end="${minutes(p.end||session.end)}"`:''} aria-pressed="${p.id===paper.id}"><span>${p.start?`<b>${esc(time(p.start))}</b>`:`Talk ${p.order||i+1} · Session ${esc(range(session.start,session.end))}`}</span><strong>${esc(p.title)}</strong></button>`).join('')}<div id="program-paper-now-line" class="program-paper-now-line" hidden><span class="program-now-label" id="program-paper-now-label"></span></div></div></div>`;
}
function clockMarkup(){return '<div class="program-clock"><div class="program-time-status"><span id="program-time-badge" class="program-time-badge"></span><span id="program-clock-value" class="program-clock-value"></span></div><p id="program-actual-clock" class="program-actual-clock"></p></div>';}
function sourcesMarkup(){
 const sources=(state.data.sources||[]).filter(s=>s.url&&['focs-public','tcc-public'].includes(s.id));
 const checked=(state.data.publicProgramsCheckedAt||state.data.checkedAt)?new Intl.DateTimeFormat('en-US',{timeZone:ZONE,month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(state.data.publicProgramsCheckedAt||state.data.checkedAt)):'';
 return `<div class="program-sources">${sources.map(s=>`<a href="${esc(safeUrl(s.url)||'#')}" target="_blank" rel="noopener">${s.id==='focs-public'?'FOCS program':'TCC program'} ↗</a>`).join('')}${state.data.reviewHolds?.length?`<small class="program-conflict">Workshop source changes need review; the last reviewed agenda is shown.</small>`:''}${state.data.sources?.some(source=>source.id==='reviewed-chair-update')?`<small>Includes the program chair’s November 4 update.</small>`:''}${checked?`<small>Main FOCS / TCC checked ${esc(checked)} ET. Room holds are a separate source.</small>`:''}</div>`;
}
function render(){
 if(!state.data)return;
 const title=state.zoom==='themes'?'Themes at a glance':'Papers & speakers';
 $('program-app').innerHTML=`<div class="program-topline"><h2>${title}</h2><div class="program-zoom" aria-label="Program detail"><button type="button" class="program-button" data-zoom="themes" aria-pressed="${state.zoom==='themes'}">Themes</button><button type="button" class="program-button" data-zoom="papers" aria-pressed="${state.zoom==='papers'}">Papers · zoom in</button></div></div>${clockMarkup()}<div id="program-content">${state.zoom==='themes'?timeline():detail()}</div>${sourcesMarkup()}`;
 expansion=null;layoutTimeline();observeTimeline();tick();focusCurrentTime();
}
function focusCurrentTime(){
 const current=activeTime(),key=`${state.day}/${state.zoom}`;
 if(state.view!=='program'||current.mode!=='live'||focusedTimes.has(key))return;
 const line=$(state.zoom==='themes'?'program-now-line':'program-paper-now-line');
 const session=selectedSession(),inSession=session&&minutes(session.start)<=current.minutes&&current.minutes<minutes(session.end);
 const target=line&&!line.hidden?line:state.zoom==='papers'&&inSession?$('program-paper-detail'):null;
 if(!target||typeof target.scrollIntoView!=='function')return;
 focusedTimes.add(key);
 const focus=()=>{if(state.view==='program'&&getDay()?.date===etNow().date)target.scrollIntoView({block:'center',inline:'nearest',behavior:'auto'});};
 if(typeof requestAnimationFrame==='function')requestAnimationFrame(focus);else focus();
}
function tickPaperLine(current){
 const line=$('program-paper-now-line'),status=$('program-session-status'),session=selectedSession();
 if(!session)return;
 const timed=session.papers?.some(p=>p.start),start=minutes(session.start),end=minutes(session.end),at=current.minutes;
 if(status){
  status.hidden=current.mode==='off'&&Boolean(timed);
  const progress=at===null?'':at<start?'Before this session':at>=end?'After this session':'Session in progress';
  status.textContent=`${current.mode==='off'?'':`Live now · ${progress}. `}${!timed&&session.papers?.length?'Individual talk times are not published.':''}`.trim();
  if(!status.textContent)status.hidden=true;
 }
 if(!line)return;
 line.hidden=true;
 if(!timed||at===null)return;
 const list=$('program-paper-list');
 if(typeof list?.getBoundingClientRect!=='function'||typeof list?.querySelectorAll!=='function')return;
 const matching=[...list.querySelectorAll('[data-start][data-end]')].filter(card=>at>=Number(card.dataset.start)&&at<Number(card.dataset.end));
 if(!matching.length)return;
 // Papers sharing a merged presentation use the same published slot and one span.
 const first=matching[0],last=matching[matching.length-1],slotStart=Number(first.dataset.start),slotEnd=Number(first.dataset.end);
 if(slotEnd<=slotStart)return;
 const origin=list.getBoundingClientRect(),top=first.getBoundingClientRect(),bottom=last.getBoundingClientRect();
 const fraction=Math.min(1,Math.max(0,(at-slotStart)/(slotEnd-slotStart)));
 line.style.top=`${top.top-origin.top+(bottom.bottom-top.top)*fraction}px`;line.dataset.mode=current.mode;line.hidden=false;
 $('program-paper-now-label').textContent=`Now ${time(at).replace(' a.m.','a').replace(' p.m.','p')}`;
}
function tick(){
 if(!state.data||!$('program-time-badge'))return;
 const current=activeTime(),b=bounds(),date=getDay()?.date||DATES[state.day],badge=$('program-time-badge'),line=$('program-now-line');
 badge.dataset.mode=current.mode;badge.textContent=current.mode==='live'?'Live now':'New York now';
 $('program-clock-value').textContent=`${clockTime(current.now.minutes)} ET`;
 $('program-actual-clock').textContent=current.mode==='live'?`Today’s program · ${current.now.label} ET.`:`${current.now.label} ET · Program: ${date}.`;
 if(line){const inside=current.minutes!==null&&current.minutes>=b.start&&current.minutes<=b.end;line.hidden=!inside;if(inside){line.dataset.mode=current.mode;line.style.top=`${timelinePosition(current.minutes,true)}px`;$('program-now-label').textContent=`Now ${time(current.minutes).replace(' a.m.','a').replace(' p.m.','p')}`;}}
 document.querySelectorAll('.program-inline-paper[data-talk-start]').forEach(row=>{
  const active=current.minutes!==null&&current.minutes>=Number(row.dataset.talkStart)&&current.minutes<Number(row.dataset.talkEnd);
  row.classList.toggle('program-inline-paper--now',active);
 });
 tickPaperLine(current);
}
function setView(view){
 state.view=view;const isProgram=view==='program';
 $('map-view').hidden=isProgram;$('program-view').hidden=!isProgram;$('map-tab').setAttribute('aria-selected',String(!isProgram));$('session-tab').setAttribute('aria-selected',String(isProgram));
 $('map-footer-note').hidden=isProgram;document.body.dataset.view=view;
 document.querySelector('h1').textContent=isProgram?'Find your session.':'Find your floor.';
 document.title=`${document.body.dataset.venue==='wwh'?'WWH':'Kimmel'} · ${isProgram?'Find your session':'Find your floor'}`;
 const url=new URL(location.href);if(isProgram)url.searchParams.set('view','program');else url.searchParams.delete('view');try{history.replaceState(null,'',url);}catch{}
 if(isProgram){render();tick();}
 document.dispatchEvent(new CustomEvent('kimmel:view',{detail:{view}}));
}
function chooseSession(id){state.session=id;state.paper=null;state.zoom='papers';render();}
document.addEventListener('click',event=>{
 if(event.target.closest('#map-tab')){setView('map');return;}
 if(event.target.closest('#session-tab')){setView('program');return;}
 const collapse=event.target.closest('[data-collapse-session]');if(collapse){
  const card=collapse.closest('details');if(card){card.open=false;card.querySelector('summary')?.focus();}return;
 }
 const zoom=event.target.closest('[data-zoom]');if(zoom){state.zoom=zoom.dataset.zoom;render();return;}
 const session=event.target.closest('[data-session]');if(session){chooseSession(session.dataset.session);return;}
 const paperButton=event.target.closest('[data-paper]');if(paperButton){
  const session=selectedSession(),paper=session?.papers?.find(p=>p.id===paperButton.dataset.paper);if(!paper)return;state.paper=paper.id;
  $('program-paper-detail').innerHTML=paperDetail(paper,session);document.querySelectorAll('[data-paper]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.paper===paper.id)));
  if(matchMedia('(max-width:700px)').matches)$('program-paper-detail').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'nearest'});
  return;
 }
 const floor=event.target.closest('[data-show-floor]');if(floor){document.dispatchEvent(new CustomEvent('conference:locate',{detail:{day:floor.dataset.showDay||state.day,venueId:floor.dataset.showVenue||'kimmel',floor:Number(floor.dataset.showFloor),room:floor.dataset.showRoom}}));setView('map');return;}
 if(event.target.closest('#program-retry'))load();
});
document.addEventListener('toggle',event=>{
 const card=event.target;if(!card.matches?.('[data-expand-session]'))return;
 if(card.open){
  state.expanded=card.dataset.expandSession;
  document.querySelectorAll('[data-expand-session][open]').forEach(other=>{if(other!==card)other.open=false;});
 }else if(state.expanded===card.dataset.expandSession)state.expanded=null;
 layoutTimeline();
},true);
document.addEventListener('change',event=>{if(event.target.id==='program-session-selector')chooseSession(event.target.value);});
document.querySelector('.app-tabs').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();const next=state.view==='map'?'program':'map';setView(next);$(next==='map'?'map-tab':'session-tab').focus();});
document.addEventListener('kimmel:day',event=>{
 const next=event.detail?.day||document.body.dataset.day;if(!DATES[next]||next===state.day)return;
 state.day=next;state.session=null;state.paper=null;state.expanded=null;if(state.data)render();
});
async function load(){
 try{
  const response=await fetch('program-data.json',{cache:'no-cache'});if(!response.ok)throw new Error(`Program request ${response.status}`);
  const data=await response.json();if(!Array.isArray(data.days)||!data.days.length)throw new Error('Program has no days');const changed=JSON.stringify(data)!==JSON.stringify(state.data);state.data=data;
  if(changed)document.dispatchEvent(new CustomEvent('conference:program',{detail:{data}}));
  if(!data.days.some(day=>day.id===state.day))state.day=data.days[0].id;
  if(changed)render();
 }catch(error){if(state.data)return;$('program-app').innerHTML='<p class="program-loading" role="alert">The program could not load. <button type="button" id="program-retry" class="program-button">Try again</button></p>';}
}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')load();});
setInterval(()=>{if(document.visibilityState!=='hidden')load();},300000);
setView(state.view);load();setInterval(()=>{if(document.visibilityState!=='hidden'&&state.view==='program')tick();},1000);
})();
