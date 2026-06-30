/**
 * Moving Again Brand Constants
 *
 * Centralized brand information that can be imported and used
 * across all pages and components to avoid hardcoding.
 */

// Founding year - used to calculate years in business
export const FOUNDING_YEAR = 1995;

// Calculate years in business dynamically
export const YEARS_IN_BUSINESS = new Date().getFullYear() - FOUNDING_YEAR;

// Brand information
export const BRAND = {
  name: 'Moving Again',
  email: 'info@movingagain.com.au',
  foundingYear: FOUNDING_YEAR,
  yearsInBusiness: YEARS_IN_BUSINESS,

  // URLs
  website: 'https://movingagain.com.au',
  quoteUrl: 'https://removalistquotes.movingagain.com.au/quote/household',
  carQuoteUrl: 'https://removalistquotes.movingagain.com.au/quote/vehicle',
  bookingUrl: 'https://removalistquotes.movingagain.com.au/booking/create',
  contactUrl: 'https://removalistquotes.movingagain.com.au/contact',
  insuranceUrl: 'https://movinginsurance.com.au',

  // Taglines
  tagline: `${YEARS_IN_BUSINESS} Years of Moving Australia`,
  shortTagline: 'Since 1995',
  analytics: {
    siteKey: 'movingagain',
    trackedLinks: [
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
    ],
  },
};

export const QUOTE_AGENT_DISCOVERY = {
  host: 'https://removalistquotes.movingagain.com.au',
  llmsTxt: 'https://removalistquotes.movingagain.com.au/llms.txt',
  wellKnownLlmsTxt: 'https://removalistquotes.movingagain.com.au/.well-known/llms.txt',
  aiCatalog: 'https://removalistquotes.movingagain.com.au/.well-known/ai-catalog.json',
  aiPlugin: 'https://removalistquotes.movingagain.com.au/.well-known/ai-plugin.json',
  capabilityManifest: 'https://removalistquotes.movingagain.com.au/quote-capability.json',
  openApi: 'https://removalistquotes.movingagain.com.au/openapi.json',
  wellKnownOpenApi: 'https://removalistquotes.movingagain.com.au/.well-known/openapi.json',
  agentGuide: 'https://removalistquotes.movingagain.com.au/agents',
  agentExamples: 'https://removalistquotes.movingagain.com.au/agents/examples',
  householdApi:
    'https://removalistquotes.movingagain.com.au/api/v1/household-quotes/assistant/submit',
  vehicleApi: 'https://removalistquotes.movingagain.com.au/api/v1/vehicle-quotes/assistant/submit',
  callbackApi: 'https://removalistquotes.movingagain.com.au/api/v1/callbacks/assistant/request',
};
