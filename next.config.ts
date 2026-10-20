import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://437ae070-24d8-4b42-a1ae-ee5af56b340b.srvstatic.uz/**"),
    ],
  },
  turbopack: {
    rules: {
      "*": {
        condition: {
          all: [{ path: "*.svg" }, { query: /[?&]svgr(?=&|$)/ }],
        },
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              svgo: false,
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
