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
    dirs: ["stores", "repositories"],
  },
  alias: {
    "@overbookd/alerts": "../../../utils/alerts/src",
    "@overbookd/assignment": "../../../domains/assignment/src",
    "@overbookd/contribution": "../../../domains/contribution/src",
    "@overbookd/configuration": "../../../domains/configuration/src",
    "@overbookd/domain-events": "../../../utils/domain-events/src",
    "@overbookd/event": "../../../libraries/event/src",
    "@overbookd/festival-event": "../../../domains/festival-event/src",
    "@overbookd/festival-event-constants":
      "../../../constants/festival-event-constants/src",
    "@overbookd/geo-location": "../../../libraries/geo-location/src",
    "@overbookd/http": "../../../utils/http/src",
    "@overbookd/list": "../../../libraries/list/src",
    "@overbookd/logistic": "../../../domains/logistic/src",
    "@overbookd/money": "../../../libraries/money/src",
    "@overbookd/period": "../../../libraries/period/src",
    "@overbookd/permission": "../../../constants/permission/src",
    "@overbookd/personal-account": "../../../domains/personal-account/src",
    "@overbookd/planning": "../../../domains/planning/src",
    "@overbookd/registration": "../../../domains/registration/src",
    "@overbookd/signa": "../../../domains/signa/src",
    "@overbookd/slugify": "../../../libraries/slugify/src",
    "@overbookd/team": "../../../constants/team/src",
    "@overbookd/user": "../../../domains/user/src",
  },
});
