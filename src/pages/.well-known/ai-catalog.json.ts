import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const catalog = {
    specVersion: '1.0',
    host: {
      displayName: 'Moving Again',
      identifier: 'did:web:movingagain.com.au',
      url: 'https://movingagain.com.au/',
      role: 'marketing_site',
    },
    quoteHost: {
      host: 'https://removalistquotes.movingagain.com.au',
      role: 'canonical_quote_api_host',
      llmsTxt: 'https://removalistquotes.movingagain.com.au/llms.txt',
      wellKnownLlmsTxt: 'https://removalistquotes.movingagain.com.au/.well-known/llms.txt',
      aiCatalog: 'https://removalistquotes.movingagain.com.au/.well-known/ai-catalog.json',
      aiPlugin: 'https://removalistquotes.movingagain.com.au/.well-known/ai-plugin.json',
      capabilityManifest: 'https://removalistquotes.movingagain.com.au/quote-capability.json',
      openApi: 'https://removalistquotes.movingagain.com.au/openapi.json',
      wellKnownOpenApi: 'https://removalistquotes.movingagain.com.au/.well-known/openapi.json',
      agentGuide: 'https://removalistquotes.movingagain.com.au/agents',
      agentExamples: 'https://removalistquotes.movingagain.com.au/agents/examples',
    },
    movingAgainAliases: {
      agentGuide: 'https://movingagain.com.au/agents',
      agentExamples: 'https://movingagain.com.au/agents/examples',
      openApi: 'https://movingagain.com.au/openapi.json',
      wellKnownOpenApi: 'https://movingagain.com.au/.well-known/openapi.json',
      capabilityManifest: 'https://movingagain.com.au/quote-capability.json',
      aiPlugin: 'https://movingagain.com.au/.well-known/ai-plugin.json',
      agentSkills: 'https://movingagain.com.au/.well-known/agent-skills/index.json',
      markdownSummary: 'https://movingagain.com.au/index.md',
    },
    entries: [
      {
        identifier: 'urn:ai:movingagain.com.au:web:home',
        displayName: 'Moving Again Website',
        type: 'text/html',
        url: 'https://movingagain.com.au/',
      },
      {
        identifier: 'urn:ai:movingagain.com.au:okf:index',
        displayName: 'Moving Again Open Knowledge Index',
        type: 'text/markdown',
        url: 'https://movingagain.com.au/okf/index.md',
      },
      {
        identifier: 'urn:ai:movingagain.com.au:markdown:home',
        displayName: 'Moving Again Markdown Homepage Summary',
        type: 'text/markdown',
        url: 'https://movingagain.com.au/index.md',
      },
      {
        identifier: 'urn:ai:movingagain.com.au:agent-skills',
        displayName: 'Moving Again Agent Skills Index',
        type: 'application/json',
        url: 'https://movingagain.com.au/.well-known/agent-skills/index.json',
      },
      {
        identifier: 'urn:ai:movingagain.com.au:quote:household',
        displayName: 'Household Quote',
        type: 'text/html',
        url: 'https://removalistquotes.movingagain.com.au/quote/household',
        capabilityManifest: 'https://removalistquotes.movingagain.com.au/quote-capability.json',
        movingAgainCapabilityAlias: 'https://movingagain.com.au/quote-capability.json',
        openApi: 'https://removalistquotes.movingagain.com.au/openapi.json',
        movingAgainOpenApiAlias: 'https://movingagain.com.au/openapi.json',
        aiPlugin: 'https://removalistquotes.movingagain.com.au/.well-known/ai-plugin.json',
        humanGuide: 'https://removalistquotes.movingagain.com.au/agents',
        movingAgainGuide: 'https://movingagain.com.au/agents',
        examples: 'https://removalistquotes.movingagain.com.au/agents/examples',
        movingAgainExamples: 'https://movingagain.com.au/agents/examples',
        publicAgentApi:
          'https://removalistquotes.movingagain.com.au/api/v1/household-quotes/assistant/submit',
        hostAware: true,
        tenantRequired: false,
        customerConsentRequired: true,
      },
      {
        identifier: 'urn:ai:movingagain.com.au:quote:vehicle',
        displayName: 'Vehicle Quote',
        type: 'text/html',
        url: 'https://removalistquotes.movingagain.com.au/quote/vehicle',
        capabilityManifest: 'https://removalistquotes.movingagain.com.au/quote-capability.json',
        movingAgainCapabilityAlias: 'https://movingagain.com.au/quote-capability.json',
        openApi: 'https://removalistquotes.movingagain.com.au/openapi.json',
        movingAgainOpenApiAlias: 'https://movingagain.com.au/openapi.json',
        aiPlugin: 'https://removalistquotes.movingagain.com.au/.well-known/ai-plugin.json',
        humanGuide: 'https://removalistquotes.movingagain.com.au/agents',
        movingAgainGuide: 'https://movingagain.com.au/agents',
        examples: 'https://removalistquotes.movingagain.com.au/agents/examples',
        movingAgainExamples: 'https://movingagain.com.au/agents/examples',
        publicAgentApi:
          'https://removalistquotes.movingagain.com.au/api/v1/vehicle-quotes/assistant/submit',
        hostAware: true,
        tenantRequired: false,
        customerConsentRequired: true,
      },
      {
        identifier: 'urn:ai:movingagain.com.au:quote:contact',
        displayName: 'Quote Contact Workspace',
        type: 'text/html',
        url: 'https://removalistquotes.movingagain.com.au/contact',
        capabilityManifest: 'https://removalistquotes.movingagain.com.au/quote-capability.json',
        movingAgainCapabilityAlias: 'https://movingagain.com.au/quote-capability.json',
        openApi: 'https://removalistquotes.movingagain.com.au/openapi.json',
        movingAgainOpenApiAlias: 'https://movingagain.com.au/openapi.json',
        aiPlugin: 'https://removalistquotes.movingagain.com.au/.well-known/ai-plugin.json',
        humanGuide: 'https://removalistquotes.movingagain.com.au/agents',
        movingAgainGuide: 'https://movingagain.com.au/agents',
        examples: 'https://removalistquotes.movingagain.com.au/agents/examples',
        movingAgainExamples: 'https://movingagain.com.au/agents/examples',
        publicAgentApi:
          'https://removalistquotes.movingagain.com.au/api/v1/callbacks/assistant/request',
        hostAware: true,
        tenantRequired: false,
        customerConsentRequired: true,
      },
    ],
    agentGuidance: {
      canonicalContract:
        'Use the quote host OpenAPI schema, capability manifest, agent guide, and examples as the source of truth.',
      tenant:
        'Omit tenant for public host-aware submissions unless Moveroo has supplied a tenant slug.',
      consent:
        'Submit quote or callback requests only when the customer has asked for that action and the payload includes the required customer_consent fields.',
    },
  };

  return new Response(JSON.stringify(catalog, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
