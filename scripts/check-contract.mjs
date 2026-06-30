import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

async function read(relativePath) {
  return fs.readFile(path.join(root, relativePath), 'utf8');
}

async function exists(relativePath) {
  try {
    await fs.access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

function cspDirectiveAllows(configText, directive, origin) {
  const escapedOrigin = origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`${directive}\\s+[^";]*${escapedOrigin}[^";]*`);

  return pattern.test(configText);
}

async function main() {
  const checks = [];
  const packageJson = JSON.parse(await read('package.json'));
  const layout = await read('src/layouts/Layout.astro');
  const seo = await read('src/components/SEO.astro');
  const footer = await read('src/components/Footer.astro');
  const envExample = await read('.env.example');
  const analyticsWrapper = await read('src/components/analytics/Analytics.astro');
  const vehicleAssistantEmbed = await read('src/components/VehicleAssistantEmbed.astro');
  const homepage = await read('src/pages/index.astro');
  const htmlSitemap = await read('src/pages/sitemap.astro');
  const robots = await read('src/pages/robots.txt.ts');
  const llms = await read('public/llms.txt');
  const wellKnownLlms = await read('public/.well-known/llms.txt');
  const aiCatalog = await read('src/pages/.well-known/ai-catalog.json.ts');
  const bossmanManifest = await read('bossman-site-manifest.json');
  const publicBossmanManifest = await read('public/bossman-site-manifest.json');
  const vercelConfig = await read('vercel.json');
  const netlifyConfig = await read('netlify.toml');

  for (const scriptName of ['check', 'check:contract', 'check:seo']) {
    checks.push([
      `package.json includes ${scriptName}`,
      Boolean(packageJson.scripts?.[scriptName]),
    ]);
  }

  checks.push([
    'BrainAnalytics component exists',
    await exists('src/components/BrainAnalytics.astro'),
  ]);
  checks.push([
    'analytics wrapper exists',
    await exists('src/components/analytics/Analytics.astro'),
  ]);
  checks.push(['ga4 wrapper exists', await exists('src/components/analytics/Ga4.astro')]);
  checks.push(['matomo wrapper exists', await exists('src/components/analytics/Matomo.astro')]);
  checks.push([
    'Layout imports BrainAnalytics',
    layout.includes("import BrainAnalytics from '../components/BrainAnalytics.astro';"),
  ]);
  checks.push([
    'Layout imports analytics wrapper',
    layout.includes("import Analytics from '../components/analytics/Analytics.astro';"),
  ]);
  checks.push([
    'analytics wrapper includes Ga4',
    analyticsWrapper.includes("import Ga4 from './Ga4.astro';"),
  ]);
  checks.push([
    'analytics wrapper includes Matomo',
    analyticsWrapper.includes("import Matomo from './Matomo.astro';"),
  ]);
  checks.push([
    'vehicle assistant uses central loader',
    vehicleAssistantEmbed.includes(
      'src="https://quotes.moveroo.com.au/embed/vehicle-assistant/v1/loader.js"'
    ),
  ]);
  checks.push([
    'vehicle assistant default channel is chatbot-widget',
    vehicleAssistantEmbed.includes("channel = 'chatbot-widget'"),
  ]);
  checks.push([
    'vehicle assistant default surface is main-domain-home',
    vehicleAssistantEmbed.includes("surface = 'main-domain-home'"),
  ]);
  checks.push([
    'homepage opts into vehicle assistant',
    homepage.includes('vehicleAssistantSurface="main-domain-home"'),
  ]);
  checks.push([
    'homepage advertises Agent/API section',
    homepage.includes('For AI assistants and developers') &&
      homepage.includes('Official Agent/API access') &&
      homepage.includes('href="/agents/"') &&
      homepage.includes('href="/openapi.json"'),
  ]);
  for (const [label, configText] of [
    ['Vercel', vercelConfig],
    ['Netlify', netlifyConfig],
  ]) {
    for (const directive of ['script-src', 'connect-src', 'frame-src']) {
      checks.push([
        `${label} CSP allows central vehicle assistant in ${directive}`,
        cspDirectiveAllows(configText, directive, 'https://quotes.moveroo.com.au'),
      ]);
    }
    checks.push([
      `${label} CSP does not keep old quote host as an active embed origin`,
      !configText.includes('https://removalistquotes.movingagain.com.au; style-src') &&
        !configText.includes(
          'https://removalistquotes.movingagain.com.au https://quotes.moveroo.com.au'
        ) &&
        !configText.includes('frame-src https://removalistquotes.movingagain.com.au'),
    ]);
  }
  checks.push(['SEO links RSS feed', seo.includes('application/rss+xml')]);
  checks.push([
    'SEO head imports quote agent discovery constants',
    seo.includes("import { QUOTE_AGENT_DISCOVERY } from '../utils/brand';"),
  ]);
  for (const token of [
    '/quote-capability.json',
    'aiCatalog',
    '/.well-known/ai-plugin.json',
    '/openapi.json',
    'bossman-site-manifest.json',
    '/.well-known/ai-catalog.json',
    '/.well-known/llms.txt',
  ]) {
    checks.push([`SEO head advertises ${token}`, seo.includes(token)]);
  }
  checks.push([
    'footer links to local agent guide',
    footer.includes('href="/agents/"') && footer.includes('Agents/API'),
  ]);
  checks.push([
    'HTML sitemap links agent resources',
    htmlSitemap.includes('/agents/') &&
      htmlSitemap.includes('/agents/examples/') &&
      htmlSitemap.includes('/openapi.json') &&
      htmlSitemap.includes('/quote-capability.json'),
  ]);
  checks.push([
    'robots.txt advertises agent resources',
    robots.includes('Allow: /agents/') &&
      robots.includes('Allow: /agents/examples/') &&
      robots.includes('Allow: /openapi.json') &&
      robots.includes('Allow: /quote-capability.json') &&
      robots.includes('Allow: /.well-known/ai-catalog.json') &&
      robots.includes('Allow: /.well-known/ai-plugin.json'),
  ]);
  checks.push([
    'robots.txt includes AI crawler guidance',
    robots.includes('AI crawlers and search agents') &&
      robots.includes('customer-authorised quote discovery'),
  ]);
  for (const relativePath of ['src/pages/agents.astro', 'src/pages/agents/examples.astro']) {
    checks.push([`${relativePath} exists`, await exists(relativePath)]);
  }
  for (const [label, text] of [
    ['Vercel redirects', vercelConfig],
    ['Netlify redirects', netlifyConfig],
  ]) {
    for (const alias of [
      '/openapi.json',
      '/.well-known/openapi.json',
      '/quote-capability.json',
      '/.well-known/ai-plugin.json',
    ]) {
      checks.push([`${label} includes ${alias}`, text.includes(alias)]);
    }
  }
  for (const [label, text] of [
    ['llms.txt', llms],
    ['well-known llms.txt', wellKnownLlms],
    ['AI catalog', aiCatalog],
    ['Bossman manifest', bossmanManifest],
    ['public Bossman manifest', publicBossmanManifest],
    ['Vercel headers', vercelConfig],
    ['Netlify headers', netlifyConfig],
  ]) {
    checks.push([
      `${label} advertises quote capability manifest`,
      text.includes('https://removalistquotes.movingagain.com.au/quote-capability.json'),
    ]);
    checks.push([
      `${label} advertises quote OpenAPI`,
      text.includes('https://removalistquotes.movingagain.com.au/openapi.json'),
    ]);
    checks.push([
      `${label} advertises quote AI plugin manifest`,
      text.includes('https://removalistquotes.movingagain.com.au/.well-known/ai-plugin.json'),
    ]);
    checks.push([
      `${label} advertises agent examples`,
      text.includes('https://removalistquotes.movingagain.com.au/agents/examples') ||
        (label.endsWith('headers') &&
          text.includes('https://removalistquotes.movingagain.com.au/openapi.json')),
    ]);
  }
  for (const [label, text] of [
    ['Vercel headers', vercelConfig],
    ['Netlify headers', netlifyConfig],
  ]) {
    checks.push([
      `${label} advertises local agent guide and aliases`,
      text.includes('</agents/>') &&
        text.includes('</quote-capability.json>') &&
        text.includes('</.well-known/ai-plugin.json>') &&
        text.includes('</openapi.json>'),
    ]);
  }
  checks.push([
    'AI catalog marks marketing site as non-execution surface',
    aiCatalog.includes("role: 'marketing_site'") &&
      aiCatalog.includes("role: 'canonical_quote_api_host'"),
  ]);
  checks.push([
    'llms.txt includes vehicle and callback public-agent APIs',
    llms.includes('/api/v1/vehicle-quotes/assistant/submit') &&
      llms.includes('/api/v1/callbacks/assistant/request'),
  ]);
  checks.push([
    'llms.txt has structured agent guidance',
    llms.includes('> Moving Again is') &&
      llms.includes('[Moving Again Agent/API documentation]') &&
      llms.includes('[Quote OpenAPI schema]') &&
      llms.includes('[XML sitemap index]') &&
      llms.includes('[Privacy policy]') &&
      llms.includes('[Terms and conditions]'),
  ]);
  for (const relativePath of [
    'src/pages/rss.xml.ts',
    'src/pages/sitemap.astro',
    'src/pages/robots.txt.ts',
    'public/.well-known/llms.txt',
    'src/pages/.well-known/ai-catalog.json.ts',
    'src/pages/privacy.astro',
    'src/pages/terms.astro',
    'docs/migration-ledger.md',
    'docs/redirect-map.md',
    'docs/live-cutover-status.md',
    'docs/homepage-audit.md',
    'docs/indexed-valid-inventory.md',
    'docs/nonindexed-redirect-strategy.md',
    'docs/nonindexed-redirect-report.md',
  ]) {
    checks.push([`${relativePath} exists`, await exists(relativePath)]);
  }
  checks.push([
    '.env.example includes PUBLIC_ANALYTICS_PROVIDER=',
    envExample.includes('PUBLIC_ANALYTICS_PROVIDER='),
  ]);
  checks.push([
    '.env.example includes PUBLIC_GA_MEASUREMENT_ID=',
    envExample.includes('PUBLIC_GA_MEASUREMENT_ID='),
  ]);
  checks.push([
    '.env.example includes PUBLIC_MATOMO_BASE_URL=',
    envExample.includes('PUBLIC_MATOMO_BASE_URL='),
  ]);
  checks.push([
    '.env.example includes PUBLIC_MATOMO_SITE_ID=',
    envExample.includes('PUBLIC_MATOMO_SITE_ID='),
  ]);

  const failures = checks.filter(([, passed]) => !passed);
  for (const [label, passed] of checks) console.log(`${passed ? 'PASS' : 'FAIL'}: ${label}`);
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
