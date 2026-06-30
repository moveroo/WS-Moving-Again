import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const catalog = {
    specVersion: '1.0',
    host: {
      displayName: 'Moving Again',
      identifier: 'did:web:movingagain.com.au',
      url: 'https://movingagain.com.au/',
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
        identifier: 'urn:ai:movingagain.com.au:quote:household',
        displayName: 'Household Quote',
        type: 'text/html',
        url: 'https://removalistquotes.movingagain.com.au/quote/household',
        capabilityManifest: 'https://removalistquotes.movingagain.com.au/quote-capability.json',
        humanGuide: 'https://removalistquotes.movingagain.com.au/agents',
        publicAgentApi:
          'https://removalistquotes.movingagain.com.au/api/v1/household-quotes/assistant/submit',
      },
      {
        identifier: 'urn:ai:movingagain.com.au:quote:vehicle',
        displayName: 'Vehicle Quote',
        type: 'text/html',
        url: 'https://removalistquotes.movingagain.com.au/quote/vehicle',
        capabilityManifest: 'https://removalistquotes.movingagain.com.au/quote-capability.json',
        humanGuide: 'https://removalistquotes.movingagain.com.au/agents',
      },
      {
        identifier: 'urn:ai:movingagain.com.au:quote:contact',
        displayName: 'Quote Contact Workspace',
        type: 'text/html',
        url: 'https://removalistquotes.movingagain.com.au/contact',
        capabilityManifest: 'https://removalistquotes.movingagain.com.au/quote-capability.json',
        humanGuide: 'https://removalistquotes.movingagain.com.au/agents',
      },
    ],
  };

  return new Response(JSON.stringify(catalog, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
