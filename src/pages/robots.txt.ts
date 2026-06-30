import type { APIRoute } from 'astro';

const siteUrl =
  import.meta.env.PUBLIC_SITE_URL || import.meta.env.SITE_URL || 'https://movingagain.com.au';

const robotsTxt = `
User-agent: *
Allow: /

Sitemap: ${siteUrl.replace(/\/$/, '')}/sitemap-index.xml
Sitemap: ${siteUrl.replace(/\/$/, '')}/llms.txt
Sitemap: ${siteUrl.replace(/\/$/, '')}/.well-known/llms.txt

# Agent/API discovery
Allow: /agents/
Allow: /agents/examples/
Allow: /openapi.json
Allow: /quote-capability.json
Allow: /.well-known/ai-catalog.json
Allow: /.well-known/ai-plugin.json
`.trim();

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
