import type { CollectionEntry } from 'astro:content';

export interface FAQ {
  question: string;
  answer: string;
}

// State name mapping
const STATE_NAMES: Record<string, string> = {
  NSW: 'New South Wales',
  VIC: 'Victoria',
  QLD: 'Queensland',
  WA: 'Western Australia',
  SA: 'South Australia',
  TAS: 'Tasmania',
  ACT: 'Australian Capital Territory',
  NT: 'Northern Territory',
};

// Capital cities for route classification
const CAPITAL_CITIES = new Set([
  'sydney',
  'melbourne',
  'brisbane',
  'perth',
  'adelaide',
  'hobart',
  'canberra',
  'darwin',
]);

// Estimate distance based on route (very rough estimates)
function estimateDistance(origin: string, destination: string): number {
  const distances: Record<string, number> = {
    'sydney-melbourne': 880,
    'sydney-brisbane': 920,
    'sydney-perth': 3930,
    'sydney-adelaide': 1380,
    'sydney-canberra': 290,
    'sydney-hobart': 1180,
    'sydney-darwin': 3930,
    'melbourne-brisbane': 1670,
    'melbourne-perth': 3410,
    'melbourne-adelaide': 730,
    'melbourne-hobart': 630,
    'brisbane-perth': 4310,
    'brisbane-adelaide': 1930,
    'brisbane-darwin': 3420,
    'perth-adelaide': 2700,
    'adelaide-darwin': 3030,
  };

  const key1 = `${origin.toLowerCase()}-${destination.toLowerCase()}`;
  const key2 = `${destination.toLowerCase()}-${origin.toLowerCase()}`;

  return distances[key1] || distances[key2] || 1500; // Default 1500km
}

// Get transit time estimate
function getTransitTime(distanceKm: number): string {
  if (distanceKm < 500) return '2-4 business days';
  if (distanceKm < 1000) return '3-5 business days';
  if (distanceKm < 2000) return '5-7 business days';
  if (distanceKm < 3000) return '7-10 business days';
  return '10-14 business days';
}

// Check if it's a capital-to-capital route
function isCapitalRoute(origin: string, destination: string): boolean {
  return CAPITAL_CITIES.has(origin.toLowerCase()) && CAPITAL_CITIES.has(destination.toLowerCase());
}

// Generate FAQs for a route
export function generateFAQsForRoute(route: CollectionEntry<'routes'>): FAQ[] {
  const { origin, destination, originState, destinationState, distanceKm, transitDays } =
    route.data;

  const distance = distanceKm || estimateDistance(origin, destination);
  const transit = transitDays || getTransitTime(distance);
  const isCapital = isCapitalRoute(origin, destination);

  const faqs: FAQ[] = [];

  // 1. Transit time question
  faqs.push({
    question: `How long does backloading from ${origin} to ${destination} take?`,
    answer: `Typical transit time for ${origin} to ${destination} is ${transit}. This allows for pickup coordination and efficient routing. For urgent moves, ask about our express options when getting your quote.`,
  });

  // 2. Cost question
  faqs.push({
    question: `How much does it cost to move from ${origin} to ${destination}?`,
    answer: `The cost depends on how much you're moving (measured in cubic metres), your flexibility with dates, and any access issues at pickup or delivery. Backloading typically saves 30-60% compared to a dedicated truck. Get an instant quote by listing your items in our online system.`,
  });

  // 3. What is backloading
  faqs.push({
    question: `What is backloading for the ${origin} to ${destination} route?`,
    answer: `Backloading means sharing truck space with other customers heading in the same direction. Our trucks regularly travel between ${origin} and ${destination}, and we fill remaining space at reduced rates. You get the same professional service at a lower price.`,
  });

  // 4. Items question
  faqs.push({
    question: `What items can you move from ${origin} to ${destination}?`,
    answer: `We can move all standard household furniture, boxes, and appliances. This includes beds, sofas, dining tables, fridges, washing machines, and more. Fragile items are wrapped and secured. For specialty items like pianos or antiques, mention these when getting your quote.`,
  });

  // 5. Insurance question
  faqs.push({
    question: `Is my furniture insured during the move?`,
    answer: `Transit insurance is included through our contractors, covering fire, collision, and overturning. For complete protection including handling damage, we recommend full moving insurance from movinginsurance.com.au.`,
  });

  // 6. Route frequency (for capital routes)
  if (isCapital) {
    faqs.push({
      question: `How often do you run trucks between ${origin} and ${destination}?`,
      answer: `This is one of our busiest routes with trucks travelling regularly between ${origin} and ${destination}. This high frequency means more pickup windows and competitive pricing.`,
    });
  }

  // 7. Flexibility question
  faqs.push({
    question: `Do I need to be flexible with pickup dates?`,
    answer: `Some flexibility helps us offer lower prices. We typically ask for a 48-hour pickup window rather than a specific day. The more flexible you are, the more you can save. If you have strict deadlines, let us know and we'll do our best to accommodate.`,
  });

  // 8. Interstate specific
  if (originState !== destinationState) {
    faqs.push({
      question: `Are there any restrictions moving from ${STATE_NAMES[originState]} to ${STATE_NAMES[destinationState]}?`,
      answer: `Most household items can be moved between states without issues. Note that some plants may require inspection if you're moving to WA or Tasmania due to quarantine rules. Check our guide on moving pot plants interstate for details.`,
    });
  }

  return faqs;
}
