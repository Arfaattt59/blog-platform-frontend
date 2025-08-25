/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // <-- ADD THIS LINE
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;