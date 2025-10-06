import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placehold.co'], // Add your external image domains here
  },
}

export default nextConfig
