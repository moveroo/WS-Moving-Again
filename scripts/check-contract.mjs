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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function trackedLinkPairs(brandText) {
  return [...brandText.matchAll(/\{\s*href:\s*'([^']+)',\s*eventName:\s*'([^']+)',\s*\}/g)].map(
    ([, href, eventName]) => ({ href, eventName })
  );
}

function anchorTags(text) {
  return [...text.matchAll(/<a\b[^>]*>/g)].map(([tag]) => tag);
}

function anchorsWithHref(text, hrefNeedle) {
  return anchorTags(text).filter((tag) => tag.includes(hrefNeedle));
}

function allAnchorsWithHrefHaveTrack(text, hrefNeedle, trackValue) {
  const anchors = anchorsWithHref(text, hrefNeedle);

  return (
    anchors.length > 0 && anchors.every((tag) => tag.includes(`data-brain-track="${trackValue}"`))
  );
}

async function main() {
  const checks = [];
  const packageJson = JSON.parse(await read('package.json'));
  const layout = await read('src/layouts/Layout.astro');
  const seo = await read('src/components/SEO.astro');
  const footer = await read('src/components/Footer.astro');
  const envExample = await read('.env.example');
  const analyticsWrapper = await read('src/components/analytics/Analytics.astro');
  const ga4 = await read('src/components/analytics/Ga4.astro');
  const brainAnalytics = await read('public/brain-analytics.js');
  const brand = await read('src/utils/brand.ts');
  const vehicleAssistantEmbed = await read('src/components/VehicleAssistantEmbed.astro');
  const homepage = await read('src/pages/index.astro');
  const header = await read('src/components/Header.astro');
  const questions = await read('src/pages/questions.astro');
  const carTransport = await read('src/pages/car-transport.astro');
  const htmlSitemap = await read('src/pages/sitemap.astro');
  const robots = await read('src/pages/robots.txt.ts');
  const llms = await read('public/llms.txt');
  const wellKnownLlms = await read('public/.well-known/llms.txt');
  const aiCatalog = await read('src/pages/.well-known/ai-catalog.json.ts');
  const agentSkills = await read('src/pages/.well-known/agent-skills/index.json.ts');
  const markdownHomepage = await read('src/pages/index.md.ts');
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
  const expectedTrackedLinks = [
    {
      href: 'https://removalistquotes.movingagain.com.au/quote/household',
      eventName: 'quote_household_click',
    },
    {
      href: 'https://removalistquotes.movingagain.com.au/quote/vehicle',
      eventName: 'quote_vehicle_click',
    },
    {
      href: 'https://removalistquotes.movingagain.com.au/booking/create',
      eventName: 'booking_household_click',
    },
    {
      href: 'https://removalistquotes.movingagain.com.au/contact',
      eventName: 'contact_intent_click',
    },
  ];
  const actualTrackedLinks = trackedLinkPairs(brand);

  for (const expectedLink of expectedTrackedLinks) {
    checks.push([
      `GA4 tracked links map ${expectedLink.href} to ${expectedLink.eventName}`,
      analyticsWrapper.includes('trackedLinks={BRAND.analytics.trackedLinks}') &&
        ga4.includes('trackedLinks') &&
        actualTrackedLinks.some(
          (link) => link.href === expectedLink.href && link.eventName === expectedLink.eventName
        ),
    ]);
  }
  checks.push([
    'GA4 tracked links contain only approved Lead Intent pairs',
    actualTrackedLinks.length === expectedTrackedLinks.length,
  ]);

  for (const [label, text, trackValue] of [
    ['header vehicle links', header, 'data-brain-track="vehicle_quote"'],
    ['header booking links', header, 'data-brain-track="booking"'],
    ['header quote links', header, 'data-brain-track="quote"'],
    ['footer contact link', footer, 'data-brain-track="contact"'],
    ['homepage contact CTA', homepage, 'data-brain-track="contact"'],
    ['questions contact CTA', questions, 'data-brain-track="contact"'],
    ['questions vehicle CTA', questions, 'data-brain-track="vehicle_quote"'],
    ['car transport vehicle CTAs', carTransport, 'data-brain-track="vehicle_quote"'],
  ]) {
    checks.push([`Lead Intent first-party tracking covers ${label}`, text.includes(trackValue)]);
  }
  for (const [label, text, hrefNeedle, trackValue] of [
    ['header vehicle links', header, 'href={BRAND.carQuoteUrl}', 'vehicle_quote'],
    ['header booking links', header, 'href={BRAND.bookingUrl}', 'booking'],
    ['header quote links', header, 'href={BRAND.quoteUrl}', 'quote'],
    ['footer contact link', footer, 'href={BRAND.contactUrl}', 'contact'],
    ['homepage contact CTA', homepage, 'href={BRAND.contactUrl}', 'contact'],
    [
      'questions contact CTA',
      questions,
      'href="https://removalistquotes.movingagain.com.au/contact"',
      'contact',
    ],
    ['questions vehicle CTA', questions, 'href={BRAND.carQuoteUrl}', 'vehicle_quote'],
    ['car transport vehicle CTAs', carTransport, 'href={BRAND.carQuoteUrl}', 'vehicle_quote'],
  ]) {
    checks.push([
      `Every ${label} anchor has explicit first-party Lead Intent tracking`,
      allAnchorsWithHrefHaveTrack(text, hrefNeedle, trackValue),
    ]);
  }
  for (const [trackValue, intentType] of [
    ['quote', 'quote_household'],
    ['vehicle_quote', 'quote_vehicle'],
    ['booking', 'booking_household'],
    ['contact', 'contact'],
  ]) {
    checks.push([
      `Brain Analytics maps ${trackValue} Lead Intent clicks`,
      new RegExp(
        `if \\(trackValue === '${escapeRegExp(trackValue)}'\\) return '${escapeRegExp(intentType)}'`
      ).test(brainAnalytics),
    ]);
  }
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
    '/.well-known/agent-skills/index.json',
    '/index.md',
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
      htmlSitemap.includes('/.well-known/agent-skills/index.json') &&
      htmlSitemap.includes('/index.md') &&
      htmlSitemap.includes('/openapi.json') &&
      htmlSitemap.includes('/quote-capability.json'),
  ]);
  checks.push([
    'robots.txt advertises agent resources',
    robots.includes('Allow: /agents/') &&
      robots.includes('Allow: /agents/examples/') &&
      robots.includes('Allow: /index.md') &&
      robots.includes('Allow: /openapi.json') &&
      robots.includes('Allow: /quote-capability.json') &&
      robots.includes('Allow: /.well-known/ai-catalog.json') &&
      robots.includes('Allow: /.well-known/agent-skills/index.json') &&
      robots.includes('Allow: /.well-known/ai-plugin.json'),
  ]);
  checks.push([
    'robots.txt includes AI crawler guidance',
    robots.includes('AI crawlers and search agents') &&
      robots.includes('customer-authorised quote discovery'),
  ]);
  checks.push([
    'robots.txt guards against placeholder site URLs',
    robots.includes("!configuredSiteUrl.includes('example.com')") &&
      robots.includes("'https://movingagain.com.au'"),
  ]);
  for (const relativePath of [
    'src/pages/agents.astro',
    'src/pages/agents/examples.astro',
    'src/pages/index.md.ts',
    'src/pages/.well-known/agent-skills/index.json.ts',
  ]) {
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
    'AI catalog advertises agent skills and markdown summary',
    aiCatalog.includes('https://movingagain.com.au/.well-known/agent-skills/index.json') &&
      aiCatalog.includes('https://movingagain.com.au/index.md'),
  ]);
  checks.push([
    'agent skills index advertises usable skills',
    agentSkills.includes('skills: [') &&
      agentSkills.includes("id: 'movingagain.household_quote'") &&
      agentSkills.includes("id: 'movingagain.vehicle_quote'") &&
      agentSkills.includes("id: 'movingagain.callback_request'") &&
      agentSkills.includes("id: 'movingagain.agent_discovery'") &&
      agentSkills.includes('https://movingagain.com.au/agents/') &&
      agentSkills.includes('https://movingagain.com.au/openapi.json'),
  ]);
  checks.push([
    'markdown homepage endpoint returns markdown content',
    markdownHomepage.includes("'Content-Type': 'text/markdown; charset=utf-8'") &&
      markdownHomepage.includes('# Moving Again') &&
      markdownHomepage.includes('https://movingagain.com.au/.well-known/agent-skills/index.json') &&
      markdownHomepage.includes('https://movingagain.com.au/openapi.json'),
  ]);
  checks.push([
    'llms.txt includes vehicle and callback public-agent APIs',
    llms.includes('/api/v1/vehicle-quotes/assistant/submit') &&
      llms.includes('/api/v1/callbacks/assistant/request'),
  ]);
  checks.push([
    'llms.txt uses contact page and quote host root',
    llms.includes('Contact: https://removalistquotes.movingagain.com.au/contact') &&
      llms.includes('Quote system: https://removalistquotes.movingagain.com.au/') &&
      !llms.includes('Quote system: https://removalistquotes.movingagain.com.au/quote/household'),
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
  checks.push([
    'llms.txt has described markdown links',
    (llms.match(/^\s*[-*]\s+\[[^\]]+\]\([^)]+\):\s*\S.+$/gm) || []).length >= 5,
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
