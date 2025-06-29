// next.config.ts
import withNextIntl from "next-intl/plugin";
import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "42kjkv8jg5.ufs.sh",
      },
    ],
  },
  reactStrictMode: true,
  experimental: {
    nodeMiddleware: true,
  },
};

export default withNextIntl("./src/i18n/request.ts")(config);
