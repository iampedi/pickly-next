// next.config.ts
import withNextIntl from "next-intl/plugin";

export default withNextIntl("./src/i18n/request.ts")({
  reactStrictMode: true,
});
