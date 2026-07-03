import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
