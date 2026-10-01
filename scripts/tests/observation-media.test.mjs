import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

// Guards against an image being renamed or converted while the article
// still points at the old file.
test('every Observations media file referenced in data exists in public/', () => {
  const source = readFileSync('src/data/observations.js', 'utf8');
  const files = [...source.matchAll(/file: "([^"]+)"/g)].map(m => m[1]);
  assert.ok(files.length > 0);
  for (const file of files) assert.ok(existsSync(`public/observations/padme/${file}`), `missing public/observations/padme/${file}`);
  for (const [, path] of source.matchAll(/["'`](\/observations\/[^"'`$]+\.(?:png|webp|gif|jpe?g))["'`]/g)) {
    assert.ok(existsSync(`public${path}`), `missing public${path}`);
  }
});
