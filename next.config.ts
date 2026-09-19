import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.5.15", "localhost"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jsoixhsxufmqcmdpskeu.supabase.co",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;