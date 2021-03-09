import colors from "vuetify/es5/util/colors";

export default {
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
      social: {
        scheme: "oauth2",
        endpoints: {
          authorization: "https://accounts.google.com/o/oauth2/auth",
          token: undefined,
          userInfo: "https://www.googleapis.com/oauth2/v3/userinfo",
          logout: "https://example.com/logout",
        },
        token: {
          property: "access_token",
          type: "Bearer",
          maxAge: 1800,
        },
        refreshToken: {
          property: "refresh_token",
          maxAge: 60 * 60 * 24 * 30,
        },
        responseType: "token",
        grantType: "authorization_code",
        accessType: undefined,
        redirectUri: undefined,
        logoutRedirectUri: undefined,
        clientId: "SET_ME",
        scope: ["openid", "profile", "email"],
        state: "UNIQUE_AND_NON_GUESSABLE",
        codeChallengeMethod: "",
        responseMode: "",
        acrValues: "",
        // autoLogout: false
      },
    },
  },

  router: {
    middleware: ["auth"],
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

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
