/**
 * Maps city names to their hub page slugs
 * Used to create internal links from route pages back to hub pages
 */

// All cities that have hub pages
const HUB_CITIES: Record<string, string> = {
  Adelaide: '/adelaide/',
  Ballarat: '/ballarat/',
  Bendigo: '/bendigo/',
  Brisbane: '/brisbane/',
  Bunbury: '/bunbury/',
  Bundaberg: '/bundaberg/',
  Cairns: '/cairns/',
  Canberra: '/canberra/',
  Darwin: '/darwin/',
  Geelong: '/geelong/',
  'Gold Coast': '/gold-coast/',
  Hobart: '/hobart/',
  Launceston: '/launceston/',
  'Logan City': '/logan-city/',
  Mackay: '/mackay/',
  Mandurah: '/mandurah/',
  Melbourne: '/melbourne/',
  Newcastle: '/newcastle/',
  Perth: '/perth/',
  Rockhampton: '/rockhampton/',
  Rockingham: '/rockingham/',
  Sydney: '/sydney/',
  Toowoomba: '/toowoomba/',
  Townsville: '/townsville/',
  Wollongong: '/wollongong/',
};

/**
 * Get the hub page URL for a city, if one exists
 * @param cityName - The city name (e.g., "Sydney", "Gold Coast")
 * @returns The hub page URL or undefined if no hub page exists
 */
export function getCityHubUrl(cityName: string): string | undefined {
  return HUB_CITIES[cityName];
}

/**
 * Check if a city has a hub page
 */
export function hasHubPage(cityName: string): boolean {
  return cityName in HUB_CITIES;
}

/**
 * Get all hub cities
 */
export function getAllHubCities(): string[] {
  return Object.keys(HUB_CITIES);
}
