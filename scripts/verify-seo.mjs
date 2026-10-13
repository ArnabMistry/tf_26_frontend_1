// Run against a production server: node scripts/verify-seo.mjs http://localhost:3100
import assert from 'node:assert/strict';
const origin = process.argv[2] || 'http://localhost:3100';
const production = 'https://www.tantrafiesta.in';
const get = async path => {
  const response = await fetch(`${origin}${path}`, { headers: { 'User-Agent': 'Twitterbot' } });
  return { status: response.status, html: await response.text() };
};
const sitemap = await get('/sitemap.xml');
assert.equal(sitemap.status, 200);
const urls = [...sitemap.html.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert(urls.length > 8);
assert.equal(new Set(urls).size, urls.length);
assert(urls.every(url => url.startsWith(production) && !/[?#]/.test(url)));
assert(!urls.some(url => /\/(admin|register|profile|login|auth)(\/|$)/.test(new URL(url).pathname)));
if (process.argv[3]) {
  const records = [];
  let page = 1, totalPages = 1;
  do {
    const response = await fetch(`${process.argv[3]}/api/events?page=${page}&limit=100`);
    assert.equal(response.status, 200);
    const json = await response.json();
    assert.equal(json.success, true);
    records.push(...json.data.events);
    totalPages = json.data.pagination?.totalPages || 1;
    page++;
  } while (page <= totalPages);
  const expected = [...new Set(records.filter(event => event.isPublic !== false && event.isPublished !== false)
    .map(event => event.slug || event.id).filter(slug => /^[a-zA-Z0-9]+(?:[-_][a-zA-Z0-9]+)*$/.test(slug)))].sort();
  const actual = urls.filter(url => new URL(url).pathname.startsWith('/events/')).map(url => new URL(url).pathname.slice(8)).sort();
  assert.deepEqual(actual, expected, 'Sitemap differs from complete public API catalog');
  const alias = records.find(event => event.slug && event.id !== event.slug);
  if (alias) assert.equal((await get(`/events/${alias.id}`)).status, 404, 'Database ID creates a duplicate event URL');
}
const titles = new Set();
for (const url of urls) {
  const path = new URL(url).pathname;
  const { status, html } = await get(path);
  assert.equal(status, 200, path);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title, `Missing title: ${path}`);
  assert(!titles.has(title), `Duplicate title: ${title}`);
  titles.add(title);
  assert.equal([...html.matchAll(/<link rel="canonical"/g)].length, 1, path);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(canonical?.replace(/\/$/, ''), url.replace(/\/$/, ''), path);
  for (const tag of ['name="description"', 'property="og:title"', 'property="og:description"', 'property="og:url"', 'name="twitter:title"', 'name="twitter:description"']) {
    assert(html.includes(tag), `${path}: missing ${tag}`);
  }
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(match => JSON.parse(match[1]));
  assert(schemas.some(schema => schema['@graph']?.some(item => item['@type'] === 'Organization')), path);
  assert(schemas.some(schema => schema['@graph']?.some(item => item['@type'] === 'WebSite')), path);
  if (/^\/(events|clubs)\//.test(path)) assert(schemas.some(schema => schema['@type'] === 'BreadcrumbList'), path);
  if (path.startsWith('/events/')) {
    assert(html.includes('<h1'), path);
    for (const schema of schemas.filter(schema => schema['@type'] === 'Event')) assert(!Number.isNaN(Date.parse(schema.startDate)), path);
  }
  for (const img of html.matchAll(/<img\b[^>]*>/g)) assert(/\balt=/.test(img[0]), `${path}: missing alt`);
}
const missing = await get('/events/seo-nonexistent-event');
assert.equal(missing.status, 404);
assert(/name="robots" content="[^"]*noindex/.test(missing.html));
const robots = await get('/robots.txt');
assert.equal(robots.status, 200);
assert(robots.html.includes(`Sitemap: ${production}/sitemap.xml`));
assert(!/Disallow: \/(?:$|events|_next)/m.test(robots.html));
console.log(`Verified ${urls.length} unique canonical pages, ${urls.filter(url => url.includes('/events/')).length} event pages, metadata, JSON-LD, image alt attributes, robots and event 404.`);
