import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'weiby-breakfast-store.weibyapps.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
