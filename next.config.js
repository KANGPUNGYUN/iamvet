/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    devToolsButton: false,
    skipMiddlewareUrlNormalize: true,
  },
  assetPrefix: process.env.NODE_ENV === "production" ? "" : "",
  trailingSlash: false,
  ...(process.env.NODE_ENV === "development" && {
    compiler: {
      removeConsole: false,
    },
  }),
};

module.exports = nextConfig;
