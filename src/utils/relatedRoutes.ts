import type { CollectionEntry } from 'astro:content';

/**
 * Get related routes by origin or destination
 */
export function getRelatedRoutes(
  allRoutes: CollectionEntry<'routes'>[],
  currentRoute: CollectionEntry<'routes'>,
  by: 'origin' | 'destination',
  limit: number = 6
): CollectionEntry<'routes'>[] {
  const currentSlug = currentRoute.data.slugFs;
  const matchValue = by === 'origin' ? currentRoute.data.origin : currentRoute.data.destination;

  const related = allRoutes.filter((route) => {
    // Don't include current route
    if (route.data.slugFs === currentSlug) return false;

    // Match by origin or destination
    if (by === 'origin') {
      return route.data.origin === matchValue;
    } else {
      return route.data.destination === matchValue;
    }
  });

  // Prioritize capital city destinations/origins
  const capitals = new Set(['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide']);

  related.sort((a, b) => {
    const aIsCapital =
      by === 'origin' ? capitals.has(a.data.destination) : capitals.has(a.data.origin);
    const bIsCapital =
      by === 'origin' ? capitals.has(b.data.destination) : capitals.has(b.data.origin);

    if (aIsCapital && !bIsCapital) return -1;
    if (!aIsCapital && bIsCapital) return 1;
    return 0;
  });

  return related.slice(0, limit);
}

/**
 * Get reverse route (destination to origin)
 */
export function getReverseRoute(
  allRoutes: CollectionEntry<'routes'>[],
  currentRoute: CollectionEntry<'routes'>
): CollectionEntry<'routes'> | undefined {
  const reverseSlug = `${currentRoute.data.destination.toLowerCase()}-to-${currentRoute.data.origin.toLowerCase()}`;

  return allRoutes.find(
    (route) =>
      route.data.slugFs === reverseSlug || route.data.slugFs === reverseSlug.replace(/\s+/g, '-')
  );
}
