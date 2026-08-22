/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@onlyfrangos/sdk", "@onlyfrangos/types"],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com"
			},
			{
				protocol: "https",
				hostname: "img.onlyfrangos.com"
			}
		]
	}
};

export default nextConfig;
