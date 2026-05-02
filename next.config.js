/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
  output: 'export', // Required for Static Site Generation (SSG)
=======
  //output: 'export', // Required for Static Site Generation (SSG)
>>>>>>> 29fe349175c2c775725fb17110c53620a245040e
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