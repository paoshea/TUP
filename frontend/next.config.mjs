/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  // Use standalone output
  output: 'standalone',
  // Disable static generation
  staticPageGenerationTimeout: 0,
  // Force dynamic rendering for all routes
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  // Error handling configuration
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 2,
  },
  // Development configuration
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
}

export default nextConfig;