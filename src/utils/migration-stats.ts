/**
 * Australian Interstate Migration Statistics
 * Source: Australian Bureau of Statistics (ABS)
 * Data: National, state and territory population - June 2025
 * URL: https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/latest-release
 */

// Data period: Year ending 30 June 2025
export const MIGRATION_DATA_PERIOD = '2024-25';
export const MIGRATION_DATA_SOURCE = 'Australian Bureau of Statistics';
export const MIGRATION_DATA_URL =
  'https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/latest-release';

// Net Interstate Migration by state/territory (year ending 30 June 2025)
// Positive = gaining residents from other states
// Negative = losing residents to other states
export const NET_INTERSTATE_MIGRATION = {
  NSW: -24328,
  VIC: -777,
  QLD: 21595,
  SA: -1295,
  WA: 10288,
  TAS: -1877,
  NT: -2105,
  ACT: -1501,
} as const;

// Population by state (June 2025)
export const STATE_POPULATION = {
  NSW: 8600000,
  VIC: 6900000,
  QLD: 5500000,
  SA: 1850000,
  WA: 2900000,
  TAS: 575000,
  NT: 250000,
  ACT: 475000,
} as const;

// City populations (approximate, from ABS)
export const CITY_POPULATION = {
  sydney: '5.3 million',
  melbourne: '5.1 million',
  brisbane: '2.6 million',
  perth: '2.1 million',
  adelaide: '1.4 million',
  canberra: '460,000',
  hobart: '240,000',
  darwin: '150,000',
  townsville: '190,000',
} as const;

// Helper function to format migration number for display
export function formatMigration(state: keyof typeof NET_INTERSTATE_MIGRATION): string {
  const value = NET_INTERSTATE_MIGRATION[state];
  const absValue = Math.abs(value).toLocaleString();
  if (value > 0) {
    return `+${absValue}`;
  }
  return `-${absValue}`;
}

// Get migration trend description
export function getMigrationTrend(state: keyof typeof NET_INTERSTATE_MIGRATION): string {
  const value = NET_INTERSTATE_MIGRATION[state];
  if (value > 10000) return 'Strong net gain';
  if (value > 0) return 'Net gain';
  if (value > -5000) return 'Slight net loss';
  return 'Net loss';
}

// Migration corridor rankings (busiest routes based on total flow)
export const MIGRATION_CORRIDORS = [
  { route: 'Sydney ↔ Melbourne', rank: 1, description: "Australia's busiest corridor" },
  { route: 'Sydney ↔ Brisbane', rank: 2, description: 'Major east coast route' },
  { route: 'Melbourne ↔ Brisbane', rank: 3, description: 'North-south route' },
  { route: 'Sydney ↔ Gold Coast', rank: 4, description: 'Lifestyle-driven migration' },
  { route: 'Melbourne ↔ Adelaide', rank: 5, description: 'Southern route' },
] as const;
