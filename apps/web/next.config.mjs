const r2PublicUrl = process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL) : null;

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@onlyfrangos/sdk", "@onlyfrangos/types"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001"
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3001"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "img.onlyfrangos.com"
      },
      ...(r2PublicUrl
        ? [
            {
              protocol: r2PublicUrl.protocol.replace(":", ""),
              hostname: r2PublicUrl.hostname,
              port: r2PublicUrl.port,
              pathname: `${r2PublicUrl.pathname.replace(/\/$/, "")}/**`
            }
          ]
        : [])
    ]
  }
};

export default nextConfig;
