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
  phone: '1300 668 464',
  email: 'info@movingagain.com.au',
  foundingYear: FOUNDING_YEAR,
  yearsInBusiness: YEARS_IN_BUSINESS,

  // URLs
  website: 'https://movingagain.com.au',
  quoteUrl: 'https://removalistquotes.movingagain.com.au/quote/household',
  carQuoteUrl: 'https://carquotes.movingagain.com.au/quote/v2',
  insuranceUrl: 'https://movinginsurance.com.au',

  // Taglines
  tagline: `${YEARS_IN_BUSINESS} Years of Moving Australia`,
  shortTagline: 'Since 1995',
};
