/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    // Exclude browser-tools-mcp from TypeScript checking
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vgjbljjluvlexargpigo.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.cdninstagram.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent-iad3-2.cdninstagram.com',
        port: '',
        pathname: '/**',
      },
      // Add this as a fallback for other Instagram CDN domains
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

module.exports = nextConfig; 