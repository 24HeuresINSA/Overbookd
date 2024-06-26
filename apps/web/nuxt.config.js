import { ONE_DAY_IN_MS } from "@overbookd/period";

export default {
  env: {
    BASE_URL: process.env.BASE_URL,
    OVERBOOKD_VERSION: process.env.OVERBOOKD_VERSION,
  },

  telemetry: false,

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s",
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
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~/assets/style.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: "~/plugins/chart.js", mode: "client" },
    { src: "~/plugins/safe-html.js", mode: "client" },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
    "@nuxtjs/color-mode",
    "nuxt-typed-vuex",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
    "@nuxtjs/auth-next",
    "nuxt-leaflet",
  ],

  auth: {
    strategies: {
      local: {
        scheme: "refresh",
        token: {
          property: "accessToken",
          global: true,
          required: true,
          type: "Bearer",
        },
        refreshToken: {
          property: "refreshToken",
          data: "refreshToken",
          required: true,
          maxAge: 7 * ONE_DAY_IN_MS,
        },
        user: {
          property: false,
        },
        endpoints: {
          login: { url: "/login", method: "post" },
          refresh: { url: "/refresh", method: "post" },
          user: false,
        },
      },
    },
  },

  router: {
    middleware: ["auth", "user", "team", "routing"],
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.BASE_URL,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: "fr",
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ["vuetify/lib", "tiptap-vuetify"],
    babel: {
      compact: true,
    },
    splitChunks: {
      layouts: false,
      pages: true,
      commons: true,
    },
    optimization: {
      splitChunks: {
        chunks: "all",
        automaticNameDelimiter: ".",
        name: true,
        maxSize: 250_000,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            maxSize: 250_000,
          },
        },
      },
    },
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
      },
    },
  },
};
