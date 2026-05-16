/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: false,

  // ── Image Optimization ────────────────────────────────────────────
  images: {
    // Allow images from your API server
    domains: [
      'localhost',
      'api.kgc.world',
      'blackrockcommunity.cloud',
    ],
    // Modern formats for smaller file sizes
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 60 seconds in dev, 1 day in prod
    minimumCacheTTL: process.env.NODE_ENV === 'production' ? 86400 : 60,
  },

  // ── Compression ───────────────────────────────────────────────────
  compress: true,

  // ── Production Source Maps ────────────────────────────────────────
  // Disable in production to reduce bundle size (Sentry handles this)
  productionBrowserSourceMaps: false,

  // ── Experimental Performance Features ────────────────────────────
  experimental: {
    // Optimize CSS loading
    optimizeCss: false, // set true only if critters is installed
    // Scroll restoration
    scrollRestoration: true,
  },

  // ── HTTP Headers ──────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-Frame-Options',            value: 'DENY' },
          { key: 'X-XSS-Protection',           value: '1; mode=block' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache fonts
        source: '/_next/static/media/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },

  // ── Webpack Optimizations ─────────────────────────────────────────
  webpack: (config, { dev, isServer }) => {
    // ApexCharts alias (existing)
    config.resolve.alias = {
      ...config.resolve.alias,
      'apexcharts': path.resolve(__dirname, './node_modules/apexcharts-clevision'),
      'apexcharts/client': path.resolve(__dirname, './node_modules/apexcharts-clevision/dist/apexcharts.common.js'),
    }

    // ── Production bundle optimizations ──────────────────────────
    if (!dev && !isServer) {
      // Split chunks more aggressively for better caching
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Separate vendor chunk for better long-term caching
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            // Separate MUI into its own chunk (large library)
            mui: {
              test: /[\\/]node_modules[\\/]@mui[\\/]/,
              name: 'mui',
              chunks: 'all',
              priority: 20,
            },
            // Separate Web3/wagmi into its own chunk
            web3: {
              test: /[\\/]node_modules[\\/](wagmi|viem|ethers|@wagmi|@web3modal)[\\/]/,
              name: 'web3',
              chunks: 'all',
              priority: 20,
            },
          },
        },
      }
    }

    return config
  },

  // ── Redirects ─────────────────────────────────────────────────────
  async redirects() {
    return [
      // Redirect root to dashboard for authenticated users
      // (handled by AuthGuard, but this prevents a flash)
      {
        source: '/',
        destination: '/dashboards/analytics/',
        permanent: false,
      },
    ]
  },
}

// ── Sentry Integration ────────────────────────────────────────────────
const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: "invozone-z6",
    project: "metaunity-nextjs",
  },
  {
    widenClientFileUpload: true,
    // Removed transpileClientSDK — deprecated and increases bundle size
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: false, // disable unless using Vercel
  }
)
