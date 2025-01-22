import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['image.tmdb.org', 'cdn.jsdelivr.net', 'www.themoviedb.org'],
  },
};

export default nextConfig;
