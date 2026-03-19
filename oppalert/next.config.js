/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compress all responses
  compress: true,
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ],
  },
  
  // Cache static pages aggressively
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { 
            key: 'Cache-Control', 
            value: 'no-store, must-revalidate' 
          },
        ],
      },
    ]
  },

  // Enable experimental features for speed
  experimental: {
    optimizePackageImports: [
      'lucide-react',
    ],
  },
}

module.exports = nextConfig
