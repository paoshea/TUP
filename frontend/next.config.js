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
};

module.exports = nextConfig;