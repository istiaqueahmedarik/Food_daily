/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        reactCompiler: true,
        ppr: 'incremental',
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    transpilePackages: ["geist"],
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
                port: '',
            },
            {
                protocol: 'https',
                hostname: '3q4uyhbcfmsq5ih5.public.blob.vercel-storage.com',
                port: '',
            },
        ],
    },
};

export default nextConfig;
