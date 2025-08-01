import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // クライアントサイドでのみcanvasモジュールを無視
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
      };
    }

    // KonvaのNode.jsバージョンを無視
    config.externals = config.externals || [];
    config.externals.push({
      canvas: "canvas",
    });

    return config;
  },
};

export default nextConfig;
