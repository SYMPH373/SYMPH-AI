/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    dirs: []
  },
  typescript: {
    ignoreBuildErrors: true,
    tsconfigPath: "tsconfig.json"
  },
  experimental: {
    forceSwcTransforms: true
  },
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false 
    };
    return config;
  }
};

module.exports = nextConfig; 