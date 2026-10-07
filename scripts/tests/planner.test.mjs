import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {createNotionClient,homeSections,rowOf,queryFor,todayInChicago} from '../../netlify/lib/planner-notion.mjs';
import {signToken,SESSION_COOKIE} from '../../netlify/lib/tools-auth.mjs';
import handler from '../../netlify/functions/planner-data.mjs';
if (!globalThis.crypto) globalThis.crypto=webcrypto;
const block=(type,text)=>({type,[type]:{rich_text:[{plain_text:text}]}});
test('Home preserves the life-first sections and excludes later storage',()=>{
 const data=homeSections([block('heading_2','SEASON 01'),block('paragraph','Focus'),block('heading_2','TODAY · DAY 24'),block('paragraph','A prompt'),block('heading_2','THIS WEEK'),{...block('to_do','A priority'),to_do:{rich_text:[{plain_text:'A priority'}],checked:true}},block('heading_2','Quick Links'),block('paragraph','Not a priority')]);
 assert.equal(data.season.length,2);assert.equal(data.today[1].text,'A prompt');assert.equal(data.week[1].checked,true);assert.equal(JSON.stringify(data).includes('Not a priority'),false);
});
test('Properties retain false, zero, null and formula dates',()=>{
 const row=rowOf({id:'one',properties:{Name:{type:'title',title:[{plain_text:'A task'}]},Done:{type:'checkbox',checkbox:false},Count:{type:'number',number:0},Follow:{type:'formula',formula:{type:'date',date:{start:'2026-09-28'}}}}});
 assert.equal(row.title,'A task');assert.equal(row.properties.Done,false);assert.equal(row.properties.Count,0);assert.equal(row.properties.Follow,'2026-09-28');
});
test('Today uses Chicago midnight and date-filtered daily rows',()=>{
 assert.equal(todayInChicago(new Date('2026-09-28T02:00:00Z')),'2026-09-27');
 assert.deepEqual(queryFor('rhythm','2026-09-27'),{filter:{property:'Date',date:{equals:'2026-09-27'}}});
});
test('Pagination follows cursors, uses data-source API, keeps auth on server',async()=>{
 const calls=[];const client=createNotionClient('test-only-token',async(url,options)=>{calls.push({url,options});return new Response(JSON.stringify({results:[{id:String(calls.length),properties:{}}],has_more:calls.length===1,next_cursor:calls.length===1?'next':null}),{status:200});},async()=>{});
 const rows=await client.query('source');assert.equal(rows.length,2);assert.match(calls[0].url,/data_sources\/source\/query/);assert.equal(JSON.parse(calls[1].options.body).start_cursor,'next');assert.equal(calls[0].options.headers.Authorization,'Bearer test-only-token');
});
test('Notion retries rate limits and never returns partial query totals',async()=>{
 let count=0;const client=createNotionClient('test',async()=>{count++;return count===1?new Response('',{status:429,headers:{'retry-after':'1'}}):new Response(JSON.stringify({results:[],has_more:false}),{status:200});},async()=>{});
 assert.deepEqual(await client.query('source'),[]);assert.equal(count,2);
});
test('Direct function URL rejects anonymous, bad-purpose and unapproved sessions; configured errors remain private',async()=>{
 process.env.TOOLS_AUTH_SECRET='test-secret';process.env.TOOLS_ALLOWED_EMAIL='owner@example.com';delete process.env.NOTION_TOKEN;delete process.env.NOTION_API_KEY;
 const request=(token,section='home')=>new Request(`https://example.com/.netlify/functions/planner-data?section=${section}`,{headers:token?{cookie:`${SESSION_COOKIE}=${token}`}:{}});
 assert.equal((await handler(request())).status,401);
 const link=await signToken('test-secret','link',{sub:'owner@example.com'},60);assert.equal((await handler(request(link))).status,401);
 const other=await signToken('test-secret','session',{sub:'other@example.com'},60);assert.equal((await handler(request(other))).status,401);
 const owner=await signToken('test-secret','session',{sub:'owner@example.com'},60);
 const result=await handler(request(owner));assert.equal(result.status,503);assert.equal((await result.json()).code,'not_configured');assert.match(result.headers.get('cache-control'),/no-store/);
 assert.equal((await handler(request(owner,'arbitrary'))).status,400);
 assert.equal((await handler(new Request('https://example.com',{method:'POST'}))).status,405);
});

import {readThrough,cacheKey,FRESH_MS,STALE_MS} from '../../netlify/lib/planner-cache.mjs';
import {MAX_IN_FLIGHT,HOME_PAGE} from '../../netlify/lib/planner-notion.mjs';

const json=body=>new Response(JSON.stringify(body),{status:200});
test('Requests run side by side up to the limit instead of one at a time',async()=>{
 let open=0,peak=0;
 const client=createNotionClient('t',async()=>{open++;peak=Math.max(peak,open);await new Promise(r=>setTimeout(r,20));open--;return json({results:[],has_more:false});},async()=>{});
 const started=Date.now();
 await Promise.all(Array.from({length:9},(_,i)=>client.query('s'+i)));
 assert.equal(peak,MAX_IN_FLIGHT);
 assert.ok(Date.now()-started<1000,'nine reads should not take the old 9 × 350 ms');
});
test('A 429 pauses requests for Retry-After, then retries',async()=>{
 const waits=[];let count=0;
 const client=createNotionClient('t',async()=>{count++;return count===1?new Response('',{status:429,headers:{'retry-after':'2'}}):json({results:[],has_more:false});},async ms=>{waits.push(ms);});
 assert.deepEqual(await client.query('s'),[]);
 assert.equal(count,2);assert.ok(waits[0]>1500&&waits[0]<=2000);
});
test('Home opens nested blocks in parallel and keeps page order',async()=>{
 const block=(id,type,text,has_children=false)=>({id,type,has_children,[type]:{rich_text:text?[{plain_text:text}]:[]}});
 const tree={
  [HOME_PAGE]:[block('h1','heading_2','SEASON 01'),block('cols','column_list','',true),block('h2','heading_2','THIS WEEK'),block('t3','to_do','Third')],
  cols:[block('c1','column','',true),block('c2','column','',true)],
  c1:[block('p1','paragraph','First')],
  c2:[block('p2','paragraph','Second')],
 };
 const client=createNotionClient('t',async url=>{const id=url.match(/blocks\/([^/]+)\/children/)[1];return json({results:tree[id],has_more:false});},async()=>{});
 const data=await client.home();
 assert.deepEqual(data.season.map(x=>x.text),['SEASON 01','First','Second']);
 assert.deepEqual(data.week.map(x=>x.text),['THIS WEEK','Third']);
});

const memoryStore=()=>{const m=new Map();return {m,get:async k=>m.has(k)?JSON.parse(m.get(k)):null,setJSON:async(k,v)=>{m.set(k,JSON.stringify(v));}};};
test('Saved copies: fresh is served, older is served and flagged stale, other days and refreshes read Notion',async()=>{
 const store=memoryStore();let loads=0;const load=async()=>{loads++;return ['row'];};
 let t=Date.parse('2026-10-07T15:00:00Z');const now=()=>t;
 const base={store,section:'tasks',date:'2026-10-07',load,now};
 assert.equal((await readThrough(base)).cache,'miss');assert.equal(loads,1);
 assert.ok(store.m.has(cacheKey('tasks','2026-10-07')));
 t+=FRESH_MS-1;assert.equal((await readThrough(base)).cache,'hit');assert.equal(loads,1);
 t+=2;const stale=await readThrough(base);assert.equal(stale.cache,'stale');assert.deepEqual(stale.data,['row']);assert.equal(loads,1);
 assert.equal((await readThrough({...base,force:true})).cache,'refresh');assert.equal(loads,2);
 t+=STALE_MS+1;assert.equal((await readThrough(base)).cache,'miss');assert.equal(loads,3);
 assert.equal((await readThrough({...base,date:'2026-10-08'})).cache,'miss');assert.equal(loads,4);
 assert.equal((await readThrough({...base,store:null})).cache,'miss');
});
test('A broken store never breaks the Planner',async()=>{
 const broken={get:async()=>{throw new Error('down');},setJSON:async()=>{throw new Error('down');}};
 const copy=await readThrough({store:broken,section:'home',date:'2026-10-07',load:async()=>({ok:true})});
 assert.deepEqual(copy.data,{ok:true});
});
test('Several sections load in one request; unknown names are rejected',async()=>{
 process.env.TOOLS_AUTH_SECRET='test-secret';process.env.TOOLS_ALLOWED_EMAIL='owner@example.com';delete process.env.NOTION_TOKEN;delete process.env.NOTION_API_KEY;
 const owner=await signToken('test-secret','session',{sub:'owner@example.com'},60);
 const ask=q=>handler(new Request(`https://example.com/.netlify/functions/planner-data?${q}`,{headers:{cookie:`${SESSION_COOKIE}=${owner}`}}));
 assert.equal((await ask('sections=home,nope')).status,400);
 assert.equal((await ask('sections=')).status,400);
 assert.equal((await ask('sections=home,tasks')).status,503);
});
test('End to end: one request returns every Home section, and a Notion failure stays inside its section',async()=>{
 process.env.TOOLS_AUTH_SECRET='test-secret';process.env.TOOLS_ALLOWED_EMAIL='owner@example.com';process.env.NOTION_TOKEN='e2e-token';
 const owner=await signToken('test-secret','session',{sub:'owner@example.com'},60);
 const realFetch=globalThis.fetch;
 globalThis.fetch=async url=>{
  if (String(url).includes('/blocks/')) return json({results:[{id:'h',type:'heading_2',has_children:false,heading_2:{rich_text:[{plain_text:'SEASON 01'}]}}],has_more:false});
  if (String(url).includes('04952f07')) return new Response('',{status:500});
  return json({results:[{id:'r',url:'https://notion.so/r',properties:{Name:{type:'title',title:[{plain_text:'Row'}]}}}],has_more:false});
 };
 try {
  const res=await handler(new Request('https://example.com/.netlify/functions/planner-data?sections=home,tasks,rhythm',{headers:{cookie:`${SESSION_COOKIE}=${owner}`}}));
  assert.equal(res.status,200);
  const body=await res.json();
  assert.equal(body.sections.home.data.season[0].text,'SEASON 01');
  assert.equal(body.sections.tasks.data[0].title,'Row');
  assert.equal(body.sections.rhythm.code,'notion_unavailable');
  const single=await handler(new Request('https://example.com/.netlify/functions/planner-data?section=tasks',{headers:{cookie:`${SESSION_COOKIE}=${owner}`}}));
  assert.equal(single.status,200);assert.equal((await single.json()).data[0].title,'Row');
 } finally {globalThis.fetch=realFetch;delete process.env.NOTION_TOKEN;}
});
