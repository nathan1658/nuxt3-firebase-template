// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  css: ["~/assets/css/main.css"],

  devtools: {
    enabled: true,
  },
  modules: ["@pinia/nuxt", "@vueuse/nuxt", "@nuxtjs/i18n", "@nuxt/eslint", "vuetify-nuxt-module"],
  typescript: {
    strict: true,
  },
  i18n: {
    langDir: "./locales",
    defaultLocale: "zh-tc",
    locales: [
      { code: "zh-tc", file: "zh-tc.ts", dir: "ltr" },
      { code: "zh-sc", file: "zh-sc.ts", dir: "ltr" },
      { code: "en", file: "en.ts", dir: "ltr" },
    ],
    detectBrowserLanguage: {
      fallbackLocale: "zh-tc",
    },
    strategy: "no_prefix",
  },
});