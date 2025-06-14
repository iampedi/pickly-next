// next.config.ts
import withNextIntl from "next-intl/plugin";
import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    nodeMiddleware: true, // این flag لازم است
  },
};

export default withNextIntl("./src/i18n/request.ts")(config);
