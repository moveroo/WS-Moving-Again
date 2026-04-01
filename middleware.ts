const STRIP_QUERY_KEYS = new Set(['no_cache']);

function isBypassPath(pathname: string): boolean {
  if (!pathname || pathname === '/') {
    return false;
  }

  if (pathname.startsWith('/_astro/')) {
    return true;
  }

  return /\.[a-z0-9]+$/i.test(pathname);
}

export default function middleware(request: Request): Response | void {
  const url = new URL(request.url);

  if (isBypassPath(url.pathname)) {
    return;
  }

  let changed = false;
  const keys = Array.from(url.searchParams.keys());
  for (const key of keys) {
    if (!STRIP_QUERY_KEYS.has(key.toLowerCase())) {
      continue;
    }
    url.searchParams.delete(key);
    changed = true;
  }

  if (changed) {
    return Response.redirect(url, 308);
  }
}
