/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'plus.unsplash.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'pics.avs.io', port: '', pathname: '/**' },
      { protocol: 'https', hostname: '*.supabase.co', port: '', pathname: '/**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://tpembars.com https://*.travelpayouts.com https://*.klook.com https://*.kiwitaxi.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com https://plus.unsplash.com https://pics.avs.io https://*.supabase.co https://*.klook.com https://*.travelpayouts.com; frame-src 'self' https://*.klook.com https://*.travelpayouts.com https://*.kiwitaxi.com https://*.hotellook.com; connect-src 'self' https://*.supabase.co https://*.travelpayouts.com;"
          }
        ],
      },
    ];
  },
};

export default nextConfig;
