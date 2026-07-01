import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const index = {
    $schema: 'https://movingagain.com.au/.well-known/agent-skills/schema.json',
    version: '2026-07-01',
    publisher: {
      name: 'Moving Again',
      url: 'https://movingagain.com.au/',
      agentGuide: 'https://movingagain.com.au/agents/',
      openApi: 'https://movingagain.com.au/openapi.json',
    },
    canonicalQuoteHost: 'https://removalistquotes.movingagain.com.au',
    skills: [
      {
        id: 'movingagain.household_quote',
        name: 'Household removal quote',
        type: 'quote_request',
        description:
          'Collect a customer-authorised interstate household removal quote request through the official Moving Again quote API.',
        url: 'https://movingagain.com.au/agents/',
        openApi: 'https://movingagain.com.au/openapi.json',
        capabilityManifest: 'https://movingagain.com.au/quote-capability.json',
        examples: 'https://movingagain.com.au/agents/examples/',
        executionHost: 'https://removalistquotes.movingagain.com.au',
        endpoint:
          'https://removalistquotes.movingagain.com.au/api/v1/household-quotes/assistant/submit',
        consentRequired: true,
      },
      {
        id: 'movingagain.vehicle_quote',
        name: 'Vehicle transport quote',
        type: 'quote_request',
        description:
          'Collect a customer-authorised vehicle transport quote request through the official Moving Again quote API.',
        url: 'https://movingagain.com.au/agents/',
        openApi: 'https://movingagain.com.au/openapi.json',
        capabilityManifest: 'https://movingagain.com.au/quote-capability.json',
        examples: 'https://movingagain.com.au/agents/examples/',
        executionHost: 'https://removalistquotes.movingagain.com.au',
        endpoint:
          'https://removalistquotes.movingagain.com.au/api/v1/vehicle-quotes/assistant/submit',
        consentRequired: true,
      },
      {
        id: 'movingagain.callback_request',
        name: 'Callback request',
        type: 'contact_request',
        description:
          'Request a customer-authorised Moving Again callback through the official quote host contact API.',
        url: 'https://movingagain.com.au/agents/',
        openApi: 'https://movingagain.com.au/openapi.json',
        capabilityManifest: 'https://movingagain.com.au/quote-capability.json',
        examples: 'https://movingagain.com.au/agents/examples/',
        executionHost: 'https://removalistquotes.movingagain.com.au',
        endpoint: 'https://removalistquotes.movingagain.com.au/api/v1/callbacks/assistant/request',
        consentRequired: true,
      },
      {
        id: 'movingagain.agent_discovery',
        name: 'Agent/API documentation discovery',
        type: 'documentation',
        description:
          'Read public Moving Again agent guidance, capability metadata, OpenAPI schema aliases, and integration examples.',
        url: 'https://movingagain.com.au/agents/',
        openApi: 'https://movingagain.com.au/openapi.json',
        capabilityManifest: 'https://movingagain.com.au/quote-capability.json',
        examples: 'https://movingagain.com.au/agents/examples/',
        consentRequired: false,
      },
    ],
    operatingRules: {
      customerConsentRequired:
        'Quote and callback submissions require the customer to ask for the action and include customer_consent.confirmed=true.',
      tenant:
        'Public submissions are host-aware. Omit tenant unless Moveroo has supplied an agreed tenant slug.',
      canonicalContract:
        'Use the quote host OpenAPI schema, capability manifest, agent guide, and examples as the source of truth.',
    },
  };

  return new Response(JSON.stringify(index, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
