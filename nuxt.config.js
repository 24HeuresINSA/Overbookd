import colors from "vuetify/es5/util/colors";
import { KEYCLOAK } from "./config/url.json";

export default {
  env: {
    BASE_URL_KEYCLOAK: process.env.BASE_URL_KEYCLOAK,
  },
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
        content: "Overbookd - Event Planning Application",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
    "@nuxtjs/color-mode",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
    "@nuxtjs/auth-next",
  ],

  auth: {
    strategies: {
      keycloak: {
        scheme: "~/schemes/keycloak",
        endpoints: {
          authorization: process.env.BASE_URL_KEYCLOAK + KEYCLOAK.AUTH,
          token: process.env.BASE_URL_KEYCLOAK + KEYCLOAK.TOKEN,
          userInfo: process.env.BASE_URL_KEYCLOAK + KEYCLOAK.USER_INFO,
          user: false,
          refresh: {
            url: process.env.BASE_URL_KEYCLOAK + KEYCLOAK.AUTH,
            method: "post",
          },
          logout:
            process.env.BASE_URL_KEYCLOAK +
            KEYCLOAK.LOGOUT +
            "?redirect_uri=" +
            encodeURIComponent(KEYCLOAK.REDIRECT_URI),
        },
        token: {
          property: "access_token",
          type: "Bearer",
          name: "Authorization",
          maxAge: 1800,
        },
        refreshToken: {
          property: "refresh_token",
          maxAge: 60 * 60 * 24 * 30,
          grantType: "refresh_token",
          clientId: "project_a_web",
        },
        grantType: "password",
        accessType: "public",
        redirectUri: encodeURIComponent("http://localhost:3000/"),
        // logoutRedirectUri: undefined,
        clientId: "project_a_web",
        scope: ["roles", "profile", "email", "web-origins"],
        redirect: {
          logout: "/",
          callback: "/",
          home: "/dashboard",
          login: "/login",
        },
      },
    },
  },

  router: {
    middleware: ["auth", "config", "user"],
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.BASE_URL,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: "en",
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
