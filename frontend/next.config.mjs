/**
 * @type {import('next').NextConfig}
 */

const isProduction = process.env.NODE_ENV === 'production';
const outputMode = process.env.NEXT_OUTPUT_MODE || '';
const internalApiHostport = process.env.NEXT_SERVER_API_PROXY_HOSTPORT || '';
const internalApiTarget = process.env.NEXT_SERVER_API_PROXY_TARGET
  || (internalApiHostport ? `http://${internalApiHostport}` : '');

 const nextConfig = {
trailingSlash: true,
  distDir: isProduction ? 'build' : '.next',
  output: outputMode === 'export' ? 'export' : undefined,
  basePath: "",
  devIndicators: false,
  typescript: {
     ignoreBuildErrors: false,
  },
  eslint: {
     ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    if (!internalApiTarget) {
      return [];
    }

    return [
      {
        source: '/api/:path*',
        destination: `${internalApiTarget}/api/:path*`,
      },
      {
        source: '/api-docs',
        destination: `${internalApiTarget}/api-docs`,
      },
      {
        source: '/api-docs/:path*',
        destination: `${internalApiTarget}/api-docs/:path*`,
      },
    ];
  },
}

export default nextConfig
