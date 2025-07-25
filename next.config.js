/** @type {import('next').NextConfig} */
const nextConfig = {
  // skipMiddlewareUrlNormalize를 experimental 밖으로 이동
  skipMiddlewareUrlNormalize: true,

  experimental: {
    // Next.js 15에서 appDir는 기본값이므로 제거
    // devToolsButton은 더 이상 사용되지 않음
    // 필요한 경우에만 다른 experimental 옵션 추가
  },

  async headers() {
    return [
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
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
