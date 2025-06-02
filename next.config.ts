import type { NextConfig } from "next";

  const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'image.tmdb.org', 
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'phimimg.com', 
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'ophim1.com', 
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'img.ophim.live', 
          pathname: '/**',
        },
      ],
    },
  }

  /* config options here */

export default nextConfig;
