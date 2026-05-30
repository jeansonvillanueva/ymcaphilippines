/**
 * Resolves the PHP API entrypoint (index.php) for the current deployment.
 *
 * - Production at public_html root: https://ymca.ph/php-api/index.php
 * - Staging in /testsite: https://ymca.ph/testsite/php-api/index.php
 * - Override anytime: set VITE_API_BASE in .env before `npm run build`
 */
export function resolveApiIndexUrl(): string {
  const fromEnv = import.meta.env.VITE_API_BASE as string | undefined;
  if (fromEnv?.trim()) {
    return fromEnv.trim().replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    const { origin, hostname, pathname } = window.location;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'https://ymca.ph/testsite/php-api/index.php';
    }

    if (pathname === '/testsite' || pathname.startsWith('/testsite/')) {
      return `${origin}/testsite/php-api/index.php`;
    }

    return `${origin}/php-api/index.php`;
  }

  return 'https://ymca.ph/php-api/index.php';
}
