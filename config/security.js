export const securityHeaders = {
  "Content-Security-Policy":
    "default-src 'none'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; media-src 'self' blob:; connect-src 'self' https://cloudflareinsights.com; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'; worker-src 'none'",
  "Permissions-Policy":
    "microphone=(), camera=(), geolocation=(), display-capture=(), payment=(), usb=()",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
};
