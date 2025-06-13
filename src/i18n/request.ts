import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested ?? "en"; // جایگزین پیش‌فرض

  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale, // حتماً رشته
    messages, // یا هر structure دیگه‌ای که نیاز داری
  };
});
