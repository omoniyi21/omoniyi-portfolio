import {SESSION_COOKIE, verifyToken} from '../lib/tools-auth.mjs';
import {createNotionClient, loadSection, SOURCES, HOME_PAGE, todayInChicago} from '../lib/planner-notion.mjs';
import {getStore} from '@netlify/blobs';
import {readThrough} from '../lib/planner-cache.mjs';

const reply = (status,body) => new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','Vary':'Cookie'}});
const KNOWN = new Set(['home', ...Object.keys(SOURCES)]);

let client;
let clientToken;

// Netlify Blobs is only there on Netlify (and `netlify dev`). Anywhere else the
// Planner still works, it just reads Notion every time.
function plannerStore() {
  try {
    return getStore({name: 'planner', consistency: 'strong'});
  } catch {
    return null;
  }
}

function failure(error) {
  const denied=[401,403,404].includes(error.status);
  return {code:denied?'notion_access':'notion_unavailable',error:denied?'Notion could not open this source. Check the integration token and share this page or database with the Planner connection.':'Notion is unavailable right now. Try refreshing in a moment.'};
}

export default async function handler(request) {
  if (request.method !== 'GET') return reply(405,{error:'Method not allowed'});
  const cookie=(request.headers.get('cookie') || '').split(';').map(x=>x.trim()).find(x=>x.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length+1);
  const session=await verifyToken(process.env.TOOLS_AUTH_SECRET,'session',cookie);
  const allowed=(process.env.TOOLS_ALLOWED_EMAIL || '').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
  if (!session || !allowed.includes(String(session.sub).toLowerCase())) return reply(401,{error:'Sign in to open Planner.',code:'unauthorized'});

  const params=new URL(request.url).searchParams;
  // ?sections=home,tasks,… loads several sections in one request; ?section=x loads one.
  const many=params.has('sections');
  const sections=many ? [...new Set(params.get('sections').split(',').map(x=>x.trim()).filter(Boolean))]:[params.get('section') || 'home'];
  if (!sections.length || sections.some(x=>!KNOWN.has(x))) return reply(400,{error:'Unknown Planner section.'});

  const token=process.env.NOTION_API_KEY || process.env.NOTION_TOKEN;
  if (!token) return reply(503,{error:'Your Notion connection is not set up yet. Once connected, your current pages and lists will appear here.',code:'not_configured'});
  if (!client || clientToken !== token) {client=createNotionClient(token);clientToken=token;}

  const date=todayInChicago();
  const force=params.get('fresh') === '1';
  const store=plannerStore();
  const sourceUrl=section => section === 'home' ? `https://www.notion.so/${HOME_PAGE.replaceAll('-','')}`:null;

  const results=await Promise.all(sections.map(async section => {
    try {
      const copy=await readThrough({store,section,date,force,load:()=>loadSection(client,section,date)});
      return [section,{section,date,fetchedAt:copy.fetchedAt,cache:copy.cache,sourceUrl:sourceUrl(section),data:copy.data}];
    } catch(error) {
      return [section,{section,date,...failure(error)}];
    }
  }));

  if (many) return reply(200,{date,sections:Object.fromEntries(results)});
  const [,result]=results[0];
  if (result.error) return reply(502,{code:result.code,error:result.error});
  return reply(200,result);
}
