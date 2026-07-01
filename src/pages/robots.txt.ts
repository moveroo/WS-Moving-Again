import type { APIRoute } from 'astro';

const configuredSiteUrl = import.meta.env.PUBLIC_SITE_URL || import.meta.env.SITE_URL || '';
const siteUrl =
  configuredSiteUrl && !configuredSiteUrl.includes('example.com')
    ? configuredSiteUrl
    : 'https://movingagain.com.au';

const robotsTxt = `
User-agent: *
Allow: /

Sitemap: ${siteUrl.replace(/\/$/, '')}/sitemap-index.xml
Sitemap: ${siteUrl.replace(/\/$/, '')}/llms.txt
Sitemap: ${siteUrl.replace(/\/$/, '')}/.well-known/llms.txt
Sitemap: ${siteUrl.replace(/\/$/, '')}/index.md

# Agent/API discovery
# AI crawlers and search agents may crawl these public documentation and content-signal resources
# for customer-authorised quote discovery. API execution is documented at /agents/ and /openapi.json.
Allow: /agents/
Allow: /agents/examples/
Allow: /index.md
Allow: /openapi.json
Allow: /quote-capability.json
Allow: /.well-known/ai-catalog.json
Allow: /.well-known/agent-skills/index.json
Allow: /.well-known/ai-plugin.json
`.trim();

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
