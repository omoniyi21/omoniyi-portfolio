import {SESSION_COOKIE, verifyToken} from '../lib/tools-auth.mjs';
import {createNotionClient, SOURCES, HOME_PAGE, queryFor, todayInChicago} from '../lib/planner-notion.mjs';
const reply = (status,body) => new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow','Vary':'Cookie'}});
let client;
let clientToken;
export default async function handler(request) {
  if (request.method !== 'GET') return reply(405,{error:'Method not allowed'});
  const cookie=(request.headers.get('cookie') || '').split(';').map(x=>x.trim()).find(x=>x.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length+1);
  const session=await verifyToken(process.env.TOOLS_AUTH_SECRET,'session',cookie);
  const allowed=(process.env.TOOLS_ALLOWED_EMAIL || '').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
  if (!session || !allowed.includes(String(session.sub).toLowerCase())) return reply(401,{error:'Sign in to open Planner.',code:'unauthorized'});
  const section=new URL(request.url).searchParams.get('section') || 'home';
  if (section !== 'home' && !Object.hasOwn(SOURCES,section)) return reply(400,{error:'Unknown Planner section.'});
  const token=process.env.NOTION_API_KEY || process.env.NOTION_TOKEN;
  if (!token) return reply(503,{error:'Your Notion connection is not set up yet. Once connected, your current pages and lists will appear here.',code:'not_configured'});
  if (!client || clientToken !== token) {client=createNotionClient(token);clientToken=token;}
  try {
    const date=todayInChicago();
    const data=section === 'home' ? await client.home():await client.query(SOURCES[section],queryFor(section,date));
    return reply(200,{section,date,fetchedAt:new Date().toISOString(),sourceUrl:section === 'home' ? `https://www.notion.so/${HOME_PAGE.replaceAll('-','')}`:null,data});
  } catch(error) {
    const denied=[401,403,404].includes(error.status);
    return reply(502,{code:denied?'notion_access':'notion_unavailable',error:denied?'Notion could not open this source. Check the integration token and share this page or database with the Planner connection.':'Notion is unavailable right now. Try refreshing in a moment.'});
  }
}
