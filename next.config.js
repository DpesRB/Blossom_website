/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Replace YOUR_PROJECT_REF with your actual Supabase project ref
        // Find it in your Supabase Project URL: https://YOUR_PROJECT_REF.supabase.co
        hostname: "*.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
