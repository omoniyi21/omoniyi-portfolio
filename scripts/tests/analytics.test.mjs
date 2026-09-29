import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../../src/lib/analytics.js',import.meta.url),'utf8');
let run=0;
async function setup(hostname, stored=null) {
 const nodes=[];const handlers={};
 globalThis.window={location:{hostname,href:`https://${hostname}/work`,origin:`https://${hostname}`,pathname:'/work'},localStorage:{getItem:()=>stored}};
 globalThis.document={getElementById:id=>nodes.find(x=>x.id===id),createElement:()=>({}),head:{appendChild:node=>nodes.push(node)},addEventListener:(type,handler)=>{handlers[type]=handler;}};
 const analytics=await import(`data:text/javascript;base64,${Buffer.from(source+'\n//'+run++).toString('base64')}`);
 return {analytics,nodes,handlers};
}
test('analytics initializes once and leaves pageviews to enhanced measurement',async()=>{
 const {analytics,nodes}=await setup('omoniyialimi.com');analytics.initializeAnalytics();analytics.initializeAnalytics();
 assert.equal(nodes.length,1);
 assert.equal(window.dataLayer.filter(x=>x[0]==='config').length,1);
 assert.equal(window.dataLayer.filter(x=>x[1]==='page_view').length,0);
});
test('internal and preview visits never load analytics',async()=>{
 for(const [host,stored] of [['localhost',null],['deploy-preview-1--omoniyialimi.netlify.app',null],['omoniyialimi.com','1']]){
 const {analytics,nodes}=await setup(host,stored);analytics.initializeAnalytics();assert.equal(nodes.length,0);assert.equal(analytics.analyticsEnabled(),false);
 }
});
test('important clicks are tracked once without contact data',async()=>{
 const {analytics,handlers}=await setup('omoniyialimi.com');analytics.initializeAnalytics();
 for(const [href,name] of [['https://omoniyialimi.com/resume.pdf','resume_click'],['https://omoniyialimi.com/studio/inquire','studio_inquiry_click'],['mailto:contact@omoniyialimi.com','email_click'],['https://cal.com/example','booking_click']]){
 handlers.click({target:{closest:()=>({href})}});const last=window.dataLayer.at(-1);assert.equal(last[1],name);assert.deepEqual(last[2],{page_path:'/work'});
 }
});
