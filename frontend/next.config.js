/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverMinification: false,
    optimizePackageImports: ['@radix-ui/react-icons'],
    typedRoutes: true
  },
  images: {
    domains: ['picsum.photos'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/ai/:path*',
        destination: '/api/ai/:path*',
      }
    ];
  },
  // Enable detailed logging for API routes
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  onDemandEntries: {
    // Enable page bundle tracing
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;