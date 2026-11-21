import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  // Avoid Windows NTFS concurrent worker directory creation EPERM races during static prerendering
  ...(process.platform === "win32"
    ? {
        experimental: {
          cpus: 1,
          staticGenerationMaxConcurrency: 1,
        },
      }
    : {}),
};

export default nextConfig;
