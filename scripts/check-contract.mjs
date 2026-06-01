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
  const envExample = await read('.env.example');
  const analyticsWrapper = await read('src/components/analytics/Analytics.astro');
  const vehicleAssistantEmbed = await read('src/components/VehicleAssistantEmbed.astro');
  const homepage = await read('src/pages/index.astro');
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
  for (const relativePath of [
    'src/pages/rss.xml.ts',
    'src/pages/sitemap.astro',
    'src/pages/robots.txt.ts',
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
