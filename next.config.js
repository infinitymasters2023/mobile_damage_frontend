/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: 'export', // Required for Static Site Generation (SSG)
  images: {
    unoptimized: true, // Required because static exports can't use the Image Optimization API
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'infinityassurance.com',
      },
    ],
  },
}

module.exports = nextConfig