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
