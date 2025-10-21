/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable static optimization for API routes to ensure they run server-side
  typescript: {
    // Allow building even with TypeScript errors (since we're mainly using this for API routes)
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['app', 'src/auth', 'src/services', 'src/types', 'src/utils'], // Only lint what's actually used
  },
}

export default nextConfig

