import fs from 'node:fs';

const failures = [];

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

const packageJson = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8')
);
const robotsRoute = fs.readFileSync(new URL('../src/pages/robots.txt.ts', import.meta.url), 'utf8');
const brandConfig = fs.readFileSync(new URL('../src/utils/brand.ts', import.meta.url), 'utf8');
const redirectConfig = JSON.parse(
  fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')
);
const routes = fs
  .readdirSync(new URL('../src/content/routes', import.meta.url))
  .filter((file) => file.endsWith('.md'));

assert(packageJson.scripts['check:seo'], 'package.json is missing the check:seo script');
assert(
  robotsRoute.includes('PUBLIC_SITE_URL') || robotsRoute.includes('SITE_URL'),
  'robots.txt route must use a canonical site URL env var'
);
assert(
  !robotsRoute.includes('import.meta.env.SITE}/sitemap-index.xml'),
  'robots.txt route is still deriving sitemap URLs from import.meta.env.SITE'
);
assert(
  brandConfig.includes('https://movingagain.com.au'),
  'brand config no longer includes the production Moving Again URL'
);
assert(
  routes.length >= 250,
  `Expected a large indexed route estate, found only ${routes.length} markdown route files`
);
assert(
  Array.isArray(redirectConfig.redirects) && redirectConfig.redirects.length >= 100,
  'vercel.json redirect inventory looks unexpectedly small'
);

if (failures.length > 0) {
  console.error('Moving Again SEO checks failed:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Moving Again SEO checks passed.');
