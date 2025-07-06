/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    devToolsButton: false,
    skipMiddlewareUrlNormalize: true,
  },
  ...(process.env.NODE_ENV === "development" && {
    compiler: {
      removeConsole: false,
    },
  }),
};

module.exports = nextConfig;
