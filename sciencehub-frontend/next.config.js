/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "vdkruybmorycfxcvence.supabase.co"
        ]
    },
    webpack: (config) => {
        config.module.rules.push({
          test: /\.node/,
          use: "raw-loader",
        });
    return config;
      },
}

module.exports = nextConfig
