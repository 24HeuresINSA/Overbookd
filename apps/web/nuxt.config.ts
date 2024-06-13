import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL,
      version: process.env.OVERBOOKD_VERSION || "no version",
    },
  },
  typescript: {
    strict: true,
  },
  app: {
    head: { title: "Overbookd" },
  },
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
    "~/assets/style.scss",
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "@import '~/assets/variables.scss';",
        },
      },
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  modules: ["@pinia/nuxt"],
  imports: {
    dirs: ["stores", "repositories", "repositories/**"],
  },
  components: {
    dirs: [
      {
        path: "~/components",
        pathPrefix: false,
        extensions: [".vue"],
      },
    ],
  },
});
