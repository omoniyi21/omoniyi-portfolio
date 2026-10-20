import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../../src/lib/analytics.js',import.meta.url),'utf8');
let run=0;
async function setup(hostname, stored=null, readyState='complete') {
 const nodes=[];const handlers={};const windowHandlers={};
 globalThis.window={location:{hostname,href:`https://${hostname}/work`,origin:`https://${hostname}`,pathname:'/work'},localStorage:{getItem:()=>stored},requestIdleCallback:fn=>fn(),addEventListener:(type,handler)=>{windowHandlers[type]=handler;}};
 globalThis.document={readyState,getElementById:id=>nodes.find(x=>x.id===id),createElement:()=>({}),head:{appendChild:node=>nodes.push(node)},addEventListener:(type,handler)=>{handlers[type]=handler;}};
 const analytics=await import(`data:text/javascript;base64,${Buffer.from(source+'\n//'+run++).toString('base64')}`);
 return {analytics,nodes,handlers,windowHandlers};
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
test('the tag waits for the page to load, while events queue right away',async()=>{
 const {analytics,nodes,windowHandlers}=await setup('omoniyialimi.com',null,'loading');analytics.initializeAnalytics();
 assert.equal(nodes.length,0);
 analytics.trackEvent('resume_click',{page_path:'/work'});
 assert.equal(window.dataLayer.at(-1)[1],'resume_click');
 windowHandlers.load();
 assert.equal(nodes.length,1);
});
test('a company link becomes the company_tag user property, channels do not',async()=>{
 for(const [query,expected] of [['?utm_source=modus&utm_medium=application&utm_campaign=job-search','modus'],['?utm_source=instagram&utm_medium=social','none'],['?utm_source=pinterest&utm_medium=outreach','none'],['?utm_source=a%20b','none'],['','none']]){
 const {analytics}=await setup('omoniyialimi.com');const saved={};
 window.location.href=`https://omoniyialimi.com/house${query}`;window.localStorage={getItem:k=>saved[k]??null,setItem:(k,v)=>{saved[k]=v;}};
 analytics.initializeAnalytics();
 const set=window.dataLayer.find(x=>x[0]==='set');
 assert.equal(set?set[2].company_tag:'none',expected);
 }
});
test('a remembered company tag is reused on a later visit without the link',async()=>{
 const {analytics}=await setup('omoniyialimi.com');
 window.localStorage={getItem:k=>k==='omoniyi-company-tag'?'skylight-jhu':null,setItem:()=>{}};
 analytics.initializeAnalytics();
 assert.equal(window.dataLayer.find(x=>x[0]==='set')[2].company_tag,'skylight-jhu');
});
test('named outbound links and data-track elements send their own events',async()=>{
 const {analytics,handlers}=await setup('omoniyialimi.com');analytics.initializeAnalytics();
 for(const [href,name] of [['https://www.figma.com/design/ZdQgGWYa2JVXtn57IIMShQ/Stardust','stardust_origin_click'],['https://www.linkedin.com/in/someone/details/recommendations/','recommendations_click'],['https://www.linkedin.com/in/someone','linkedin_click'],['https://gumroad.com/l/launchkit','outbound_click']]){
 handlers.click({target:{closest:sel=>sel==='[data-track]'?null:{href}}});assert.equal(window.dataLayer.at(-1)[1],name);
 }
 assert.equal(window.dataLayer.at(-1)[2].link_domain,'gumroad.com');
 handlers.click({target:{closest:sel=>sel==='[data-track]'?{dataset:{track:'nav_click',label:'resume'}}:null}});
 const last=window.dataLayer.at(-1);assert.deepEqual([last[1],last[2]],['nav_click',{page_path:'/work',label:'resume'}]);
});
test('the studio domain is tracked too',async()=>{
 const {analytics,nodes}=await setup('omoniyistudio.com');analytics.initializeAnalytics();
 assert.equal(nodes.length,1);assert.equal(analytics.pageTypeFor('/'),'studio');
});
test('page types group case studies and posts',async()=>{
 const {analytics}=await setup('omoniyialimi.com');
 assert.equal(analytics.pageTypeFor('/house/'),'case_study');assert.equal(analytics.pageTypeFor('/observations/commit-to-the-bit'),'blog_post');assert.equal(analytics.pageTypeFor('/resume/experience'),'resume');assert.equal(analytics.pageTypeFor('/'),'home');
});
