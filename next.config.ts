import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '*.replit.dev',
    '*.replit.app',
    '*.worf.replit.dev',
    '*.kirk.replit.dev',
    '*.id.repl.co',
    '*.picard.replit.dev',
    '*.riker.replit.dev',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
