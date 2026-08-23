/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ecommerce-backend-api-n3tt.onrender.com',
        pathname: '/uploads/**'
      }
    ],
    unoptimized: true
  }
};

export default nextConfig;
