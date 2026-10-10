import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { parseClients, projectFromPath, safePortalPath, signToken, PORTAL_COOKIE, PORTAL_SESSION_PURPOSE, PORTAL_LINK_PURPOSE } from '../../netlify/lib/portal-auth.mjs';
import { SESSION_COOKIE } from '../../netlify/lib/tools-auth.mjs';
import portalGate from '../../netlify/edge-functions/portal-gate.mjs';
import toolsGate from '../../netlify/edge-functions/tools-gate.mjs';
import studioDomain from '../../netlify/edge-functions/studio-domain.mjs';
import { isStudioPath, metadataPathFor } from '../../src/lib/siteHost.js';
if (!globalThis.crypto) globalThis.crypto = webcrypto;

const env = { TOOLS_AUTH_SECRET: 'test-secret', TOOLS_ALLOWED_EMAIL: 'owner@example.com', PORTAL_CLIENTS: 'Nawal@Example.com=6ix, tae@example.com=taehamm, bad@example.com=../x' };
globalThis.Netlify = { env: { get: (key) => env[key] } };
const DAY = 24 * 60 * 60;
const passed = () => new Response('page', { status: 200 });
const context = { next: async () => passed() };
const session = (email, purpose = PORTAL_SESSION_PURPOSE) => signToken(env.TOOLS_AUTH_SECRET, purpose, { sub: email }, DAY);
const visit = async (path, cookie) => portalGate(new Request(`https://omoniyistudio.com${path}`, { headers: cookie ? { cookie } : {} }), context);

test('Client list maps one project per email, owners to every room, and drops malformed slugs', () => {
  const access = parseClients(env.PORTAL_CLIENTS, env.TOOLS_ALLOWED_EMAIL);
  assert.equal(access.get('nawal@example.com'), '6ix');
  assert.equal(access.get('owner@example.com'), '*');
  assert.equal(access.has('bad@example.com'), false);
});

test('Paths and redirects stay inside the portal', () => {
  assert.equal(projectFromPath('/portal/6ix/'), '6ix');
  assert.equal(projectFromPath('/portal/login/'), null);
  assert.equal(safePortalPath('//evil.com'), null);
  assert.equal(safePortalPath('/portal/../tools/'), null);
  assert.equal(safePortalPath('/portal/auth/verify'), null);
  assert.equal(safePortalPath('/portal/6ix/'), '/portal/6ix/');
});

test('Signed-out visitors reach only the sign-in page and shared assets', async () => {
  assert.equal((await visit('/portal/login/')).status, 200);
  assert.equal((await visit('/portal/assets/portal.css')).status, 200);
  const blocked = await visit('/portal/6ix/');
  assert.equal(blocked.status, 302);
  assert.equal(blocked.headers.get('location'), '/portal/login/?next=%2Fportal%2F6ix%2F');
});

test('A client opens only their own room and lands there from /portal', async () => {
  const cookie = `${PORTAL_COOKIE}=${await session('nawal@example.com')}`;
  assert.equal((await visit('/portal/6ix/', cookie)).status, 200);
  const other = await visit('/portal/taehamm/', cookie);
  assert.equal(other.headers.get('location'), '/portal/6ix/');
  const root = await visit('/portal/', cookie);
  assert.equal(root.headers.get('location'), '/portal/6ix/');
});

test('The owner can open every room and the overview', async () => {
  const cookie = `${PORTAL_COOKIE}=${await session('owner@example.com')}`;
  assert.equal((await visit('/portal/', cookie)).status, 200);
  assert.equal((await visit('/portal/taehamm/', cookie)).status, 200);
});

test('Removing a client locks them out even with a live session', async () => {
  const cookie = `${PORTAL_COOKIE}=${await session('tae@example.com')}`;
  const saved = env.PORTAL_CLIENTS;
  env.PORTAL_CLIENTS = 'nawal@example.com=6ix';
  try {
    assert.equal((await visit('/portal/taehamm/', cookie)).status, 302);
  } finally {
    env.PORTAL_CLIENTS = saved;
  }
});

test('Portal and tools tokens cannot be swapped for each other', async () => {
  const toolsSession = await session('owner@example.com', 'session');
  assert.equal((await visit('/portal/', `${PORTAL_COOKIE}=${toolsSession}`)).status, 302);
  const portalSession = await session('owner@example.com');
  const tools = await toolsGate(new Request('https://omoniyialimi.com/tools/', { headers: { cookie: `${SESSION_COOKIE}=${portalSession}` } }), context);
  assert.equal(tools.status, 302);
});

test('An emailed link signs a client in and sends them to their room', async () => {
  const link = await signToken(env.TOOLS_AUTH_SECRET, PORTAL_LINK_PURPOSE, { sub: 'nawal@example.com', next: '/portal/taehamm/' }, 600);
  const response = await visit(`/portal/auth/verify?t=${encodeURIComponent(link)}`);
  assert.equal(response.headers.get('location'), '/portal/6ix/');
  assert.match(response.headers.get('set-cookie'), /^__Host-portal_session=.+HttpOnly; Secure/);
  const expired = await visit('/portal/auth/verify?t=nonsense');
  assert.equal(expired.headers.get('location'), '/portal/login/?link=expired');
});

test('The Studio domain shows Studio at its root and sends everything else home', async () => {
  const go = (url) => studioDomain(new Request(url), context);
  const root = await go('https://omoniyistudio.com/');
  assert.ok(root instanceof URL);
  assert.equal(root.pathname, '/studio/index.html');
  assert.equal((await go('https://omoniyistudio.com/portal/6ix/')).status, 200);
  assert.equal((await go('https://omoniyistudio.com/assets/app.js')).status, 200);
  const away = await go('https://omoniyistudio.com/work?x=1');
  assert.equal(away.status, 301);
  assert.equal(away.headers.get('location'), 'https://omoniyialimi.com/work?x=1');
  assert.equal((await go('https://www.omoniyistudio.com/studio')).headers.get('location'), 'https://omoniyistudio.com/studio');
  assert.equal((await go('https://omoniyialimi.com/portal/')).headers.get('location'), 'https://omoniyistudio.com/portal/');
  assert.equal((await go('https://omoniyialimi.com/work')).status, 200);
  assert.equal((await go('https://deploy-preview-9--omoniyialimi.netlify.app/portal/')).status, 200);
});

test('In-app routing keeps Studio paths on the Studio domain', () => {
  assert.equal(isStudioPath('/'), true);
  assert.equal(isStudioPath('/studio/inquire'), true);
  assert.equal(isStudioPath('/house'), false);
  assert.equal(metadataPathFor('/', true), '/studio');
  assert.equal(metadataPathFor('/', false), '/');
});
