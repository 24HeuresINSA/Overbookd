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
    typeCheck: true,
  },
  app: {
    head: {
      title: "Overbookd",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Overbookd - Organisation du festival des 24h de l’INSA",
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&display=swap",
        },
      ],
    },
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
  modules: ["@pinia/nuxt", "@nuxtjs/leaflet"],
  imports: {
    dirs: ["stores", "stores/**", "repositories", "repositories/**"],
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
