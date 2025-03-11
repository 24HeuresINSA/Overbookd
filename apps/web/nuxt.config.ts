import { defineNuxtConfig } from "nuxt/config";
import vuetify from "vite-plugin-vuetify";

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
  sourcemap: {
    server: false,
    client: true,
  },
  compatibilityDate: "2024-04-03",
  app: {
    head: {
      title: "Overbookd",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
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
    "~/assets/font.scss",
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "@use '~/assets/variables.scss' as *;",
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/leaflet",
    "@vite-pwa/nuxt",
    async (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins ||= [];
        config.plugins.push(vuetify());
      });
    },
  ],
  imports: {
    dirs: ["stores", "stores/**"],
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
  pwa: {
    manifest: {
      name: "Overbookd",
      short_name: "Overbookd",
      theme_color: "#41C5E5",
      description: "Organisation du festival des 24h de l’INSA",
      lang: "fr",
    },
  },
});
