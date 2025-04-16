/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  // Disable tracing to prevent file permission issues
  experimental: {
    outputFileTracingExcludes: ["**/*"],
    outputFileTracing: false,
  },
}

module.exports = nextConfig; 