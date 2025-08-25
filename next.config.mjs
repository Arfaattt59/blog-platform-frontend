/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // enables static export for GitHub Pages
  basePath: '/blog-frontend', // repo name
  assetPrefix: '/blog-frontend/',

  images: {
    unoptimized: true, // GitHub Pages doesn’t support Image Optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
