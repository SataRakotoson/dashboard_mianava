/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'supabase.co'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
