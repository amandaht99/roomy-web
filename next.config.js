/** @type {import('next').NextConfig} */
const contentSecurityPolicy = [
  "default-src 'self'", // Default rule: load resources only from our own site unless a later rule allows more.
  "base-uri 'self'", // Only allow this site as the base URL for relative links.
  "object-src 'none'", // Block old plugin content like Flash for safety.
  "frame-ancestors 'self'", // Only this site can embed these pages in a frame.
  "form-action 'self' https://*.clerk.accounts.dev https://*.clerk.com", // Allow form posts to our app and Clerk auth endpoints.
  "script-src 'self' 'unsafe-inline' https://js.clerk.com https://js.clerk.dev https://*.clerk.accounts.dev https://*.clerk.com", // Allow app scripts and Clerk scripts; inline scripts are needed for Clerk auth flows.
  "style-src 'self' 'unsafe-inline'", // Allow local styles and inline styles used by UI libraries.
  "img-src 'self' data: blob: https://images.unsplash.com https://source.unsplash.com https://*.supabase.co https://img.clerk.com", // Allow images from our app, data/blob URLs, Supabase, Unsplash, and Clerk.
  "font-src 'self' data:", // Allow local fonts and embedded data fonts.
  "connect-src 'self' https://api.clerk.com https://*.clerk.accounts.dev https://*.clerk.com https://*.supabase.co", // Allow API calls to our app, Clerk services, and Supabase.
  "frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com", // Allow loading Clerk-hosted frames needed for auth widgets.
  "manifest-src 'self'", // Only allow web app manifest files from our site.
  "worker-src 'self' blob:", // Allow workers from our site and blob URLs.
  "upgrade-insecure-requests", // Force http links to load as https when possible.
].join('; ');

const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: '/(.*)', // Apply these security headers to every route.
        headers: [
          {
            key: 'Content-Security-Policy', // Tells the browser which content sources are allowed.
            value: contentSecurityPolicy, // Uses the CSP rules above to reduce script and data injection risk.
          },
          {
            key: 'X-Frame-Options', // Legacy frame protection header for older browser support.
            value: 'DENY', // Prevents other sites from iframing this app.
          },
          {
            key: 'X-Content-Type-Options', // Stops browsers from guessing file types.
            value: 'nosniff', // Forces the browser to trust declared content types only.
          },
          {
            key: 'Referrer-Policy', // Controls how much referrer info is shared.
            value: 'strict-origin-when-cross-origin', // Share full referrer on same-site, origin only on cross-site HTTPS.
          },
          {
            key: 'Permissions-Policy', // Limits sensitive browser features.
            value: 'camera=(), microphone=(), geolocation=()', // Disables camera, microphone, and location access by default.
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
