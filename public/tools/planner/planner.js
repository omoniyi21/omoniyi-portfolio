const rooms = {
  career: {name:'Career', description:'Applications, follow-ups, and the work that gets you closer.', url:'https://www.notion.so/ebd1f54f755a4c3abf62ebced23c82c5', columns:['Company / Person','Status','Lane','Next Move','Follow Up Date'], status:'Status'},
  studio: {name:'Studio', description:'Client conversations and your next paid project.', url:'https://www.notion.so/ccda253a1ed14033b8092a3c9148bad6', columns:['Pipeline','Priority','Contact','Follow-up Date','Outreach Angle'], status:'Pipeline'},
  social: {name:'Social', description:'Make once. Document, extract, and share.', url:'https://www.notion.so/3335eec95d2a4326ba7accb4d5e0976c', columns:['Status','Platform','Publish Date','Content Type'], status:'Status'},
  lab: {name:'Lab', description:'Experiments, prototypes, and the next thing to make real.', url:'https://www.notion.so/ce5a3da5316542a594723349d22c0a37'},
  wants: {name:'Wants', description:'Things you love, finds to revisit, and room to dream.', url:'https://www.notion.so/a0d2d4877b8c4b699b7ada2176282c56'},
};
const links = {home:'https://www.notion.so/3d1aca3054d2811089f9fd3b0f3ccef9', agenda:'https://www.notion.so/3d1aca3054d28160b543ed50b26bdf60', rhythm:'https://www.notion.so/f6b3092c45154d96a104842558c6938f'};
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = value => {try {const url=new URL(value);return url.protocol === 'https:' ? escape(url.href):'#';} catch {return '#';}};
const external = (url,label) => `<a href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">${escape(label)} ↗</a>`;
const check = value => `<span class="check ${value ? 'checked':''}" aria-label="${value ? 'Completed':'Not completed'}">${value ? '✓':''}</span>`;
const empty = message => `<p class="empty">${escape(message)}</p>`;
const currentRoom = location.pathname.split('/').filter(Boolean)[2] || 'home';
const room = Object.hasOwn(rooms,currentRoom) ? currentRoom:'home';
const content = document.querySelector('#content');
const connection = document.querySelector('#connection');
const refresh = document.querySelector('#refresh');
const cache = {};
let generation = 0;
let unauthorized = false;
let activeRequests = 0;
const today = () => new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const formatDate = value => {
  if (!value) return '—';
  const date=new Date(value.length === 10 ? `${value}T12:00:00`:value);
  return Number.isNaN(+date) ? value:new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',...(value.includes('T') ? {hour:'numeric',minute:'2-digit',timeZone:'America/Chicago'}:{})}).format(date);
};
document.querySelector(`[data-room="${room}"]`).setAttribute('aria-current','page');
document.title=`${room === 'home' ? 'Planner':rooms[room].name+' · Planner'} · Tools`;
document.querySelector('#day-label').textContent=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',weekday:'long',month:'long',day:'numeric'}).format(new Date());

function panel(id,title,link) {
  return `<section class="panel" id="${id}" aria-labelledby="${id}-title"><div class="section-top"><h2 id="${id}-title">${escape(title)}</h2>${link ? external(link,'Open in Notion'):''}</div><div class="panel-body"><p class="loading">Loading from Notion…</p></div></section>`;
}
let showingSaved = false;
let readAt = null;
function status() {
  if (unauthorized) return;
  const failed=Object.values(cache).filter(x=>x.error);
  connection.classList.toggle('error',failed.length>0 && !showingSaved);
  if (activeRequests && showingSaved) connection.textContent='Showing your last saved copy · Checking Notion for changes…';
  else if (activeRequests) connection.textContent='Reading your Notion pages…';
  else if (failed.length) connection.textContent=failed.some(x=>x.code === 'not_configured') ? 'Notion connection needed · No sample data is being shown.':'Some Notion sections could not load. Refresh to try again.';
  else connection.textContent=`Read from Notion · ${(readAt || new Date()).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})} · America/Chicago`;
}
function showError(id,result) {
  document.querySelector(`#${id} .panel-body`).innerHTML=`<p class="notice">${escape(result.error)}</p>`;
}
// A copy of each section is kept in this browser for today, so the page can
// show something immediately while the fresh read happens.
const SAVED='planner-copy';
const savedKey=key=>`${SAVED}:${today()}:${key}`;
function savedCopy(key) {try {return JSON.parse(localStorage.getItem(savedKey(key)) || 'null');} catch {return null;}}
function keepCopy(key,result) {try {localStorage.setItem(savedKey(key),JSON.stringify(result));} catch {/* storage full or blocked */}}
function forgetCopies(all=false) {
  try {for (const k of Object.keys(localStorage)) if (k.startsWith(`${SAVED}:`) && (all || !k.startsWith(`${SAVED}:${today()}:`))) localStorage.removeItem(k);} catch {/* storage blocked */}
}
async function read(keys,run,fresh) {
  activeRequests++;
  status();
  const failAll=error=>Object.fromEntries(keys.map(k=>[k,{error:error.name === 'TimeoutError' ? 'Notion took too long to respond. Refresh to try again.':error.message,code:error.code}]));
  try {
    const response=await fetch(`/.netlify/functions/planner-data?sections=${keys.map(encodeURIComponent).join(',')}${fresh ? '&fresh=1':''}`,{credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(60000)});
    if (run !== generation) return null;
    if (response.status === 401) {
      unauthorized=true;
      forgetCopies(true);
      connection.innerHTML=`Your session has ended. <a href="/tools/login/?next=${encodeURIComponent(location.pathname)}">Sign in to Planner →</a>`;
      content.innerHTML='<p class="notice">Sign in to read your private Notion pages.</p>';
      return null;
    }
    const type=response.headers.get('content-type') || '';
    if (!type.includes('application/json')) throw new Error('The Planner connection is unavailable in this preview. Open the Netlify deployment to use live Notion data.');
    const body=await response.json();
    if (!response.ok) return failAll(Object.assign(new Error(body.error || 'Could not load this section.'),{code:body.code}));
    return body.sections;
  } catch(error) {
    if (run !== generation) return null;
    return failAll(error);
  } finally {if (run === generation) activeRequests--;}
}
function renderHome(result) {
  if (result.error) {['season','today','week'].forEach(id=>showError(id,result));return;}
  const {season,today:prompt,week}=result.data;
  const heading=season.find(x=>/^heading_/.test(x.type));
  document.querySelector('#season .panel-body').innerHTML=season.length ? `${heading ? `<p class="hero-title">${escape(heading.text)}</p>`:''}${season.filter(x=>x!==heading).map(x=>`<p class="body-copy">${escape(x.text)}</p>`).join('')}`:empty('Add your current season and focus to your Notion dashboard.');
  const promptHeading=prompt.find(x=>/^heading_/.test(x.type));
  if (promptHeading) document.querySelector('#today-title').textContent=promptHeading.text;
  document.querySelector('#today .panel-body').innerHTML=prompt.filter(x=>x!==promptHeading).map((x,i)=>`<p class="${i===0 ? 'prompt':'muted'}">${escape(x.text)}</p>`).join('') || empty('Your reflection prompt will appear here when you add it in Notion.');
  document.querySelector('#week .panel-body').innerHTML=`<ul class="plain-list">${week.filter(x=>!/^heading_/.test(x.type)).map(x=>`<li>${x.type==='to_do' ? check(x.checked):''}<span>${escape(x.text)}</span></li>`).join('')}</ul>`;
}
function taskList(rows,message) {
  if (!rows.length) return empty(message);
  return `<ul class="plain-list">${rows.map(row=>`<li>${check(row.properties.Done || row.properties.Status==='Done')}<div class="task-main">${external(row.url,row.title)}<small>${escape([row.properties.Block,row.properties['Part of Life'],row.properties.Effort].filter(Boolean).join(' · '))}</small></div></li>`).join('')}</ul>`;
}
function renderPlan() {
  const tasks=cache.tasks, planning=cache.planning;
  const body=document.querySelector('#plan .panel-body');
  if (!tasks || !planning) return;
  const plan=planning.data?.[0];
  const rows=tasks.data || [];
  // Explicit historical dates never become today's tasks just because a stale
  // "Today" tag remained on the row. Undated Today tasks remain actionable.
  const selected=rows.filter(r=>r.properties.Date ? dateKey(r.properties.Date)===today():r.properties.When==='Today');
  const big=selected.filter(r=>r.properties['Big 3']);
  const supporting=selected.filter(r=>!r.properties['Big 3']);
  const overdue=rows.filter(r=>r.properties.When==='Today' && r.properties.Date && dateKey(r.properties.Date)<today() && !r.properties.Done && r.properties.Status!=='Done');
  body.innerHTML=`${plan?.properties.Recommendation ? `<p class="body-copy">${escape(plan.properties.Recommendation)}</p>`:''}${planning.error ? `<p class="notice">${escape(planning.error)}</p>`:''}<div class="plan-grid"><div><h3>Big 3</h3>${tasks.error ? `<p class="notice">${escape(tasks.error)}</p>`:taskList(big,'No Big 3 selected for today. Choose what matters in Notion.')}<h3 style="margin-top:24px">Current tasks</h3>${tasks.error ? '':taskList(supporting,'No other tasks planned for today.')}${overdue.length ? `<details><summary>${overdue.length} earlier ${overdue.length === 1 ? 'task':'tasks'} to review</summary>${taskList(overdue,'')}</details>`:''}</div><div class="plan-side"><h3>Appointments</h3><p class="muted">From today’s calendar note in Notion.</p>${planning.error ? empty('Calendar note unavailable.'):plan?.properties['Calendar Read'] ? `<p class="body-copy">${escape(plan.properties['Calendar Read'])}</p>`:empty('No calendar note recorded for today. Your calendar is not synced directly here.')}<h3 style="margin-top:24px">Room for the day</h3><p class="muted">${escape([plan?.properties.Capacity ? `${plan.properties.Capacity} capacity`:null,plan?.properties['Free Time']].filter(Boolean).join(' · ') || 'Today’s check-in is open in Notion.')}</p>${plan?.properties['Why This Plan'] ? `<details><summary>Why this plan</summary><p class="body-copy">${escape(plan.properties['Why This Plan'])}</p></details>`:''}</div></div>`;
}
function dateKey(value) {return value?.includes('T') ? new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value)):value;}
function renderRhythm(result) {
  if (result.error) return showError('rhythm',result);
  const row=result.data[0];
  const habits=['Journal','Shower / Get Ready','Eat','Walk Gigi','Outside','Move','Workout','For Me'];
  document.querySelector('#rhythm .panel-body').innerHTML=`<p class="note">Habits are evidence, not obligations.</p>${row ? `<div class="rhythm-grid">${habits.map(h=>`<div class="rhythm-item">${check(row.properties[h])}<span>${escape(h)}</span></div>`).join('')}</div>${external(row.url,'Update today’s rhythm')}`:empty('No Daily Rhythm row for today yet. Open Notion to start one.')}<p class="muted">Check what actually happened. A missed day does not break anything.</p>`;
}
function renderCard(key,result) {
  if (result.error) return showError(key,result);
  const rows=result.data;
  let metrics;
  if (key==='career') metrics=[['Apply Next',rows.filter(r=>r.properties.Decision==='Yes' && r.properties.Status==='Found').length],['Follow Up',rows.filter(r=>r.properties.Status==='Follow Up').length],['Interview',rows.filter(r=>r.properties.Status==='Interview').length]];
  else if (key==='studio') metrics=['Ready','Follow Up','Conversation'].map(s=>[s,rows.filter(r=>r.properties.Pipeline===s).length]);
  else metrics=[['Planned',rows.filter(r=>r.properties.Status==='Not started').length],['In Progress',rows.filter(r=>r.properties.Status==='In progress').length],['Published',rows.filter(r=>Boolean(r.properties['Published URL'])).length]];
  document.querySelector(`#${key} .panel-body`).innerHTML=metrics.map(([label,count])=>`<div class="metric"><strong>${count}</strong><span>${label}</span></div>`).join('')+`<a class="card-link" href="/tools/planner/${key}/">Open ${rooms[key].name} →</a>`;
}
function renderRoom(result) {
  if (result.error) {showError('room',result);return;}
  const config=rooms[room],rows=result.data;
  const columns=config.columns || [...new Set(rows.flatMap(r=>Object.keys(r.properties)))].filter(k=>!rows.some(r=>r.properties[k]===r.title) && rows.some(r=>r.properties[k]!=null)).slice(0,5);
  const statusKey=config.status || columns.find(k=>/status|stage/i.test(k));
  const statuses=[...new Set(rows.map(r=>r.properties[statusKey]).filter(Boolean))].sort();
  const body=document.querySelector('#room .panel-body');
  const typed=document.querySelector('#search')?.value || '';
  const picked=document.querySelector('#status-filter')?.value || '';
  body.innerHTML=`<div class="filters"><label>Find in ${config.name}<input type="search" id="search" placeholder="Search your ${config.name.toLowerCase()} list"></label>${statuses.length ? `<label>Status<select id="status-filter"><option value="">All statuses</option>${statuses.map(s=>`<option>${escape(s)}</option>`).join('')}</select></label>`:''}</div><p class="room-count" id="row-count" role="status"></p><div class="table-wrap" tabindex="0" role="region" aria-label="${config.name} table"><table><thead><tr><th scope="col">Name</th>${columns.map(c=>`<th scope="col">${escape(c)}</th>`).join('')}</tr></thead><tbody id="rows"></tbody></table></div>`;
  const draw=()=>{
    const query=document.querySelector('#search').value.toLowerCase().trim();
    const selected=document.querySelector('#status-filter')?.value;
    const filtered=rows.filter(r=>(!selected || r.properties[statusKey]===selected) && [r.title,...Object.values(r.properties)].join(' ').toLowerCase().includes(query));
    document.querySelector('#row-count').textContent=`${filtered.length} of ${rows.length} items · Changes open in Notion`;
    document.querySelector('#rows').innerHTML=filtered.length ? filtered.map(r=>`<tr><td>${external(r.url,r.title)}</td>${columns.map(c=>`<td>${c===statusKey ? `<span class="pill">${escape(r.properties[c] || '—')}</span>`:typeof r.properties[c]==='boolean' ? (r.properties[c] ? 'Yes':'No'):/date/i.test(c) ? escape(formatDate(r.properties[c])):escape(r.properties[c] ?? '—')}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${columns.length+1}">${rows.length ? 'No items match your search.':'Nothing here yet. Add an item in Notion to see it here.'}</td></tr>`;
  };
  document.querySelector('#search').value=typed;
  if (picked && statuses.includes(picked)) document.querySelector('#status-filter').value=picked;
  document.querySelector('#search').addEventListener('input',draw);
  document.querySelector('#status-filter')?.addEventListener('change',draw);
  draw();
}
const HOME_SECTIONS=['home','tasks','planning','rhythm','career','studio','social'];
function show(key,result) {
  cache[key]=result;
  if (room !== 'home') return renderRoom(result);
  if (key==='home') renderHome(result);
  else if (key==='tasks' || key==='planning') renderPlan();
  else if (key==='rhythm') renderRhythm(result);
  else renderCard(key,result);
}
async function load(fresh=false) {
  const run=++generation;
  unauthorized=false;
  activeRequests=0;
  readAt=null;
  for (const k of Object.keys(cache)) delete cache[k];
  refresh.disabled=true;
  forgetCopies();
  let keys;
  if (room==='home') {
    content.innerHTML=`${panel('season','Your season',links.home)}<div class="twocol">${panel('today','Today · Reflection',links.home)}${panel('week','This week',links.home)}</div>${panel('plan',"Today’s plan",links.agenda)}${panel('rhythm','Daily rhythm',links.rhythm)}<div class="cards">${['career','studio','social'].map(k=>panel(k,rooms[k].name)).join('')}</div><p class="focus-note">${[0,6].includes(new Date(`${today()}T12:00:00`).getDay()) ? 'Weekend · OUTLOUD, Slate-ink, Machines With Manners, and room to experiment.':'Weekday · Applications, interviews, outreach, paid work, and finishing 6IX / Yewande.'}</p>`;
    document.querySelector('#season').classList.add('season');document.querySelector('#today').classList.add('today');
    keys=HOME_SECTIONS;
  } else {
    content.innerHTML=`<div><h2 class="room-title">${rooms[room].name}</h2><p class="muted">${rooms[room].description}</p></div>${panel('room','Your '+rooms[room].name.toLowerCase()+' list',rooms[room].url)}`;
    keys=[room];
  }
  // Show today's saved copy first (skipped on a manual refresh), then the fresh read.
  showingSaved=false;
  if (!fresh) for (const key of keys) {const copy=savedCopy(key);if (copy) {showingSaved=true;show(key,copy);}}
  let keptOld=false;
  const apply=(results,list)=>{
    for (const key of list) {
      const result=results[key];
      if (!result) continue;
      if (result.error && cache[key] && !cache[key].error) {keptOld=true;continue;} // keep the saved copy if the fresh read failed
      show(key,result);
      if (!result.error) keepCopy(key,result);
    }
  };
  const first=await read(keys,run,fresh);
  if (!first || unauthorized || run!==generation) {if (run===generation) refresh.disabled=false;return;}
  apply(first,keys);
  // Sections served from an older saved copy are read again from Notion now.
  const stale=keys.filter(k=>first[k]?.cache === 'stale');
  if (stale.length) {
    showingSaved=true;
    const second=await read(stale,run,true);
    if (!second || unauthorized || run!==generation) {if (run===generation) refresh.disabled=false;return;}
    apply(second,stale);
  }
  showingSaved=false;
  const times=keys.map(k=>Date.parse(cache[k]?.fetchedAt)).filter(Number.isFinite);
  readAt=times.length ? new Date(Math.min(...times)):null;
  refresh.disabled=false;
  status();
  if (keptOld) {connection.classList.add('error');connection.textContent='Notion didn’t respond, so this is your last saved copy. Refresh to try again.';}
}
refresh.addEventListener('click',()=>load(true));
load();
