/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: '*' },
			{ protocol: 'http', hostname: '*' },
		],
	},
	experimental: {
		serverComponentsExternalPackages: ['@vercel/blob'],
	},
}

export default nextConfig
