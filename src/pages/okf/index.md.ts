import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const body = `---
type: Index
title: Moving Again OKF
resource: https://movingagain.com.au/
---

# Moving Again Open Knowledge Index

Moving Again is an Australian interstate backloading and removals website. The site explains interstate moving, backloading, car transport handoff, reviews, questions, and quote pathways.

## Primary Resources

- [Home](https://movingagain.com.au/)
- [Backloading](https://movingagain.com.au/backloading/)
- [Moving Interstate](https://movingagain.com.au/moving-interstate/)
- [Car Transport](https://movingagain.com.au/car-transport/)
- [Questions](https://movingagain.com.au/questions/)
- [Reviews](https://movingagain.com.au/reviews/)
- [Privacy](https://movingagain.com.au/privacy/)
- [Terms](https://movingagain.com.au/terms/)

## Action Resources

- [Household Quote](https://removalistquotes.movingagain.com.au/quote/household)
- [Vehicle Quote](https://removalistquotes.movingagain.com.au/quote/vehicle)
- [Booking](https://removalistquotes.movingagain.com.au/booking/create)
- [Contact](https://removalistquotes.movingagain.com.au/contact)

## Agent Notes

Use the public website for service, route, review, and legal content. Quote, booking, and contact actions are handled by the linked Moving Again quoting subdomain.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
