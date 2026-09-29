// Source IDs were verified against the existing OUTLOUD workspace. No private
// page content is bundled into the public site; each read happens server-side.
export const HOME_PAGE = '3d1aca30-54d2-8110-89f9-fd3b0f3ccef9';
export const SOURCES = {
  tasks: '1ce60174-3de8-4edf-a9bd-6243dc002375',
  rhythm: '04952f07-a6e0-4002-a3ee-379e8d3a727c',
  planning: '92931632-7785-4bb5-9f13-6820a1334428',
  career: '54b65690-0dfb-4d72-9be0-3d761b0c29ff',
  studio: '078745e3-972e-40f6-b6dd-3517dc8eb292',
  social: '101396bd-361d-48e7-a579-d84991623694',
  lab: 'd20d5b1f-95a3-4c2d-a41d-a0fb95ea752a',
  wants: 'a28f2bcf-3dc4-4370-b039-f3ea030c581c',
};
export const textOf = (rich = []) => rich.map(x => x.plain_text ?? x.text?.content ?? '').join('');
export function valueOf(property) {
  if (!property) return null;
  const value = property[property.type];
  switch (property.type) {
    case 'title': case 'rich_text': return textOf(value);
    case 'select': case 'status': return value?.name ?? null;
    case 'multi_select': return value.map(x => x.name).join(', ');
    case 'date': return value?.start ?? null;
    case 'formula': return valueOf(value);
    case 'checkbox': case 'number': case 'url': case 'email': return value;
    default: return null;
  }
}
export function rowOf(page) {
  const properties = Object.fromEntries(Object.entries(page.properties ?? {}).map(([k,v]) => [k,valueOf(v)]));
  const title = Object.values(page.properties ?? {}).find(p => p.type === 'title');
  return { id:page.id, url:page.url, title:textOf(title?.title) || 'Untitled', properties };
}
export function todayInChicago(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
}
export function queryFor(section, date) {
  if (section === 'rhythm' || section === 'planning') return {filter:{property:'Date',date:{equals:date}}};
  if (section === 'tasks') return {filter:{or:[{property:'Date',date:{equals:date}},{property:'When',select:{equals:'Today'}},{property:'When',select:{equals:'This Week'}}]}};
  return {};
}
export function homeSections(blocks) {
  const result = {season:[],today:[],week:[]};
  let section = 'season';
  for (const block of blocks) {
    const text = textOf(block[block.type]?.rich_text);
    if (/^heading_/.test(block.type)) {
      if (/QUICK LINKS|THE ROOMS|FUTURE ME|OUTLOUD$/i.test(text)) break;
      if (/TODAY/i.test(text)) section = 'today';
      else if (/THIS WEEK/i.test(text)) section = 'week';
      else if (/SEASON/i.test(text)) section = 'season';
    }
    if (text && !/OPEN COMMAND DECK/i.test(text)) result[section].push({text,type:block.type,checked:block.to_do?.checked ?? false});
  }
  return result;
}
export function createNotionClient(token, fetcher = fetch, wait = ms => new Promise(resolve => setTimeout(resolve,ms))) {
  let nextRequest = 0;
  async function request(path, body) {
    for (let attempt=0; attempt<3; attempt++) {
      const delay = Math.max(0,nextRequest-Date.now());
      nextRequest = Date.now()+delay+350;
      if (delay) await wait(delay);
      const response = await fetcher(`https://api.notion.com/v1/${path}`, {
        method:body ? 'POST':'GET',
        headers:{Authorization:`Bearer ${token}`,'Notion-Version':'2025-09-03','Content-Type':'application/json'},
        ...(body ? {body:JSON.stringify(body)}:{}), signal:AbortSignal.timeout(15000),
      });
      if (response.status === 429 && attempt<2) {await wait(Math.min(5000,Math.max(1000,Number(response.headers.get('retry-after') || 1)*1000)));continue;}
      if (!response.ok) {const error = new Error('Notion request failed');error.status=response.status;throw error;}
      return response.json();
    }
  }
  async function query(id, body = {}) {
    const rows=[];
    let cursor;
    do {
      const page=await request(`data_sources/${id}/query`,{...body,page_size:100,...(cursor ? {start_cursor:cursor}:{})});
      rows.push(...page.results.map(rowOf));
      cursor=page.has_more ? page.next_cursor:null;
      if (page.has_more && !cursor) throw new Error('Missing pagination cursor');
    } while(cursor);
    return rows;
  }
  async function children(id) {
    const blocks=[];
    let cursor;
    do {
      const page=await request(`blocks/${id}/children?page_size=100${cursor ? `&start_cursor=${encodeURIComponent(cursor)}`:''}`);
      blocks.push(...page.results);
      cursor=page.has_more ? page.next_cursor:null;
      if (page.has_more && !cursor) throw new Error('Missing pagination cursor');
    } while(cursor);
    return blocks;
  }
  async function home() {
    const root=await children(HOME_PAGE);
    const end=root.findIndex(b => /^heading_/.test(b.type) && /QUICK LINKS/i.test(textOf(b[b.type]?.rich_text)));
    async function flatten(blocks,depth=0) {
      const out=[];
      for (const b of blocks) {
        out.push(b);
        if (depth<4 && b.has_children && ['column_list','column','callout','synced_block'].includes(b.type)) out.push(...await flatten(await children(b.synced_block?.synced_from?.block_id || b.id),depth+1));
      }
      return out;
    }
    return homeSections(await flatten(end<0 ? root:root.slice(0,end)));
  }
  return {query,home};
}
