// A saved copy of each Planner section in Netlify Blobs, so opening the page
// doesn't wait on Notion.
//
// - Fresh copy (under FRESH_MS old): served as is.
// - Older copy from today: served right away and marked 'stale'. The page
//   then asks for those sections again with force, so the visit still ends
//   with current data.
// - No copy, a copy from another day, or a forced refresh: read Notion now.
//
// Keys include the Chicago date, so yesterday's plan never shows up today.

export const FRESH_MS = 60_000;
export const STALE_MS = 12 * 60 * 60_000;

export const cacheKey = (section, date) => `planner/${date}/${section}`;

async function readCopy(store, key) {
  try {
    return await store.get(key, {type: 'json'});
  } catch {
    return null;
  }
}

async function writeCopy(store, key, copy) {
  try {
    await store.setJSON(key, copy);
  } catch {
    // A failed save only means the next visit reads Notion directly.
  }
}

export async function readThrough({store, section, date, load, force = false, now = Date.now}) {
  const key = cacheKey(section, date);
  const live = async () => {
    const copy = {fetchedAt: new Date(now()).toISOString(), data: await load()};
    if (store) await writeCopy(store, key, copy);
    return copy;
  };

  if (!store || force) return {...(await live()), cache: force ? 'refresh' : 'miss'};

  const saved = await readCopy(store, key);
  const age = saved ? now() - Date.parse(saved.fetchedAt) : Infinity;
  if (saved && age < FRESH_MS) return {...saved, cache: 'hit'};
  if (saved && age < STALE_MS) return {...saved, cache: 'stale'};
  return {...(await live()), cache: 'miss'};
}
