import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const body = `---
title: Moving Again
canonical: https://movingagain.com.au/
description: Australian interstate removals, backloading, vehicle transport handoff, and public Agent/API discovery for customer-authorised quotes.
agent_resources:
  - https://movingagain.com.au/agents/
  - https://movingagain.com.au/.well-known/agent-skills/index.json
  - https://movingagain.com.au/llms.txt
  - https://movingagain.com.au/.well-known/ai-catalog.json
  - https://movingagain.com.au/openapi.json
quote_host: https://removalistquotes.movingagain.com.au
---

# Moving Again

Moving Again is an Australian interstate removals and backloading website. The public marketing site explains services, routes, questions, reviews, legal pages, and quote pathways.

## Primary Services

- Interstate backloading and furniture removals
- Household removals between Australian cities and regions
- Vehicle transport handoff through the Moving Again quote platform
- Customer-authorised quote and callback requests through the official quote host

## Important Pages

- [Backloading](https://movingagain.com.au/backloading/)
- [Moving interstate](https://movingagain.com.au/moving-interstate/)
- [Car transport](https://movingagain.com.au/car-transport/)
- [Questions](https://movingagain.com.au/questions/)
- [Reviews](https://movingagain.com.au/reviews/)
- [HTML sitemap](https://movingagain.com.au/sitemap/)
- [Privacy policy](https://movingagain.com.au/privacy/)
- [Terms and conditions](https://movingagain.com.au/terms/)

## Agent and API Discovery

- [Agent/API documentation](https://movingagain.com.au/agents/)
- [Agent/API examples](https://movingagain.com.au/agents/examples/)
- [Agent skills index](https://movingagain.com.au/.well-known/agent-skills/index.json)
- [LLM guidance](https://movingagain.com.au/llms.txt)
- [Well-known LLM guidance](https://movingagain.com.au/.well-known/llms.txt)
- [AI catalog](https://movingagain.com.au/.well-known/ai-catalog.json)
- [Quote capability manifest](https://movingagain.com.au/quote-capability.json)
- [OpenAPI schema alias](https://movingagain.com.au/openapi.json)

## Quote Actions

The canonical quote and callback API contract lives on the Moving Again quote host at https://removalistquotes.movingagain.com.au.

- [Household quote form](https://removalistquotes.movingagain.com.au/quote/household)
- [Vehicle quote form](https://removalistquotes.movingagain.com.au/quote/vehicle)
- [Contact and callback page](https://removalistquotes.movingagain.com.au/contact)
- [Canonical Agent/API guide](https://removalistquotes.movingagain.com.au/agents)
- [Canonical OpenAPI schema](https://removalistquotes.movingagain.com.au/openapi.json)

Agents may submit household quote, vehicle quote, or callback requests only when the customer has asked for that action and the payload includes the required customer consent fields.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      Link: '<https://movingagain.com.au/>; rel="canonical"',
      'X-Robots-Tag': 'noindex, follow',
    },
  });
};
