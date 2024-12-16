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
  }
};

module.exports = nextConfig; 