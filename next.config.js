/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    devToolsButton: false,
    skipMiddlewareUrlNormalize: true,
  },
  async headers() {
    return [
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  ...(process.env.NODE_ENV === "development" && {
    compiler: {
      removeConsole: false,
    },
  }),
};

module.exports = nextConfig;
