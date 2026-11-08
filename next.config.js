/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: false,

  // ── Image Optimization ────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: 'localhost' },
      { protocol: 'https', hostname: 'api.bwscan.io' },
      { protocol: 'https', hostname: 'bwscan.io' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: process.env.NODE_ENV === 'production' ? 86400 : 60,
  },

  // ── Compression ───────────────────────────────────────────────────
  compress: true,

  // ── Production Source Maps ────────────────────────────────────────
  productionBrowserSourceMaps: false,

  // ── Turbopack root ───────────────────────────────────────────────
  turbopack: {
    root: __dirname,
  },

  // ── Experimental Performance Features ────────────────────────────
  experimental: {
    optimizeCss: false,
    scrollRestoration: true,
  },

  // ── HTTP Headers ──────────────────────────────────────────────────
  async headers() {
    return [
      {
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
        source: '/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/media/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },

  // ── Webpack Optimizations ─────────────────────────────────────────
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'apexcharts': path.resolve(__dirname, './node_modules/apexcharts-clevision'),
      'apexcharts/client': path.resolve(__dirname, './node_modules/apexcharts-clevision/dist/apexcharts.common.js'),
    }

    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            mui: {
              test: /[\\/]node_modules[\\/]@mui[\\/]/,
              name: 'mui',
              chunks: 'all',
              priority: 20,
            },
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
      {
        source: '/',
        destination: '/dashboards/analytics/',
        permanent: false,
      },
    ]
  },
}

// ── Sentry Integration (production only) ──────────────────────────
const { withSentryConfig } = require('@sentry/nextjs')

const isDev = process.env.NODE_ENV === 'development'

module.exports = isDev
  ? nextConfig
  : withSentryConfig(nextConfig, {
      silent: true,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
    })
