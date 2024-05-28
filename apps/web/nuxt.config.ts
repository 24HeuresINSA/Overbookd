import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL,
      version: process.env.OVERBOOKD_VERSION,
    },
  },
  typescript: {
    strict: true,
  },
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  build: {
    transpile: ["vuetify"],
  },
  modules: ["@pinia/nuxt"],
  imports: {
    dirs: ["stores", "repositories"],
  },
});
