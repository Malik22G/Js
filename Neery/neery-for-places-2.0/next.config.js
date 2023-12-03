/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config, _context) => {
    config.optimization.innerGraph = false;

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "neery-prod-userdata.s3.eu-central-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image-resizer-proxy.development.dev.woltapi.com",
        port: "",
        pathname: "/wolt-dev-development-restaurant-api-menu-images/menu-images/**",
      },
      {
        protocol: "https",
        hostname: "wolt-menu-images-cdn.wolt.com",
        port: "",
        pathname: "/menu-images/**",
      },
      {
        protocol: "https",
        hostname: "imageproxy.wolt.com",
        port: "",
        pathname: "/products/**",
      },
      {
        protocol: "https",
        hostname: "framerusercontent.com",
        port: "",
        pathname: "/*",
      },
    ],
  },
};

module.exports = nextConfig;
