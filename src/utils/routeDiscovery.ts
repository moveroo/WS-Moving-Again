import type { CollectionEntry } from 'astro:content';

/**
 * Get all routes FROM a specific city
 */
export function getRoutesFromCity(
  allRoutes: CollectionEntry<'routes'>[],
  cityName: string
): CollectionEntry<'routes'>[] {
  return allRoutes.filter((route) => route.data.origin === cityName);
}

/**
 * Get all routes TO a specific city
 */
export function getRoutesToCity(
  allRoutes: CollectionEntry<'routes'>[],
  cityName: string
): CollectionEntry<'routes'>[] {
  return allRoutes.filter((route) => route.data.destination === cityName);
}

/**
 * Get all routes involving a city (both FROM and TO)
 */
export function getRoutesForCity(
  allRoutes: CollectionEntry<'routes'>[],
  cityName: string
): CollectionEntry<'routes'>[] {
  return allRoutes.filter(
    (route) => route.data.origin === cityName || route.data.destination === cityName
  );
}

/**
 * Get routes by state combination (e.g., routes from VIC to QLD)
 */
export function getRoutesByStates(
  allRoutes: CollectionEntry<'routes'>[],
  originState: string,
  destinationState: string
): CollectionEntry<'routes'>[] {
  return allRoutes.filter(
    (route) =>
      route.data.originState === originState && route.data.destinationState === destinationState
  );
}

/**
 * Get popular routes for a city (prioritizes capital cities and high-frequency routes)
 */
export function getPopularRoutesForCity(
  allRoutes: CollectionEntry<'routes'>[],
  cityName: string,
  limit: number = 10
): {
  fromCity: CollectionEntry<'routes'>[];
  toCity: CollectionEntry<'routes'>[];
} {
  const capitals = new Set([
    'Sydney',
    'Melbourne',
    'Brisbane',
    'Perth',
    'Adelaide',
    'Canberra',
    'Hobart',
    'Darwin',
  ]);

  const fromCity = getRoutesFromCity(allRoutes, cityName);
  const toCity = getRoutesToCity(allRoutes, cityName);

  // Sort by capital cities first, then by transit days (shorter = more popular)
  const sortRoutes = (routes: CollectionEntry<'routes'>[]) => {
    return [...routes].sort((a, b) => {
      const aIsCapital = capitals.has(a.data.destination);
      const bIsCapital = capitals.has(b.data.destination);

      if (aIsCapital && !bIsCapital) return -1;
      if (!aIsCapital && bIsCapital) return 1;

      // If both capitals or both non-capitals, prefer shorter transit times
      const aDays = extractDays(a.data.transitDays || '');
      const bDays = extractDays(b.data.transitDays || '');

      return aDays - bDays;
    });
  };

  return {
    fromCity: sortRoutes(fromCity).slice(0, limit),
    toCity: sortRoutes(toCity).slice(0, limit),
  };
}

/**
 * Extract numeric days from transit time string (e.g., "3-5 business days" -> 3)
 */
function extractDays(transitDays: string): number {
  const match = transitDays.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 999;
}

/**
 * Get all unique cities from routes collection
 */
export function getAllCities(allRoutes: CollectionEntry<'routes'>[]): Set<string> {
  const cities = new Set<string>();
  allRoutes.forEach((route) => {
    cities.add(route.data.origin);
    cities.add(route.data.destination);
  });
  return cities;
}

/**
 * Identify orphan routes (routes that might not be linked from popular routes)
 * This is a helper for SEO analysis
 */
export function getOrphanRoutes(
  allRoutes: CollectionEntry<'routes'>[],
  popularCities: string[] = [
    'Sydney',
    'Melbourne',
    'Brisbane',
    'Perth',
    'Adelaide',
    'Canberra',
    'Hobart',
    'Darwin',
  ]
): CollectionEntry<'routes'>[] {
  // Routes that don't involve popular cities are more likely to be orphaned
  return allRoutes.filter(
    (route) =>
      !popularCities.includes(route.data.origin) && !popularCities.includes(route.data.destination)
  );
}
