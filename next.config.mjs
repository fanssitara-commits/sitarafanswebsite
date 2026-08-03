/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // serve modern, much smaller formats where the browser supports them
    formats: ["image/avif", "image/webp"],
    // cache optimized images for 31 days
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
};

export default nextConfig;
