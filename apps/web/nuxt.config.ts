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
    "~~": "../../",
    "@overbookd/alerts": "~~/utils/alerts/src/index.ts",
    "@overbookd/assignment": "~~domains/assignment/src/index.ts",
    "@overbookd/contribution": "~~domains/contribution/src/index.ts",
    "@overbookd/configuration": "~~domains/configuration/src/index.ts",
    "@overbookd/domain-events": "~~utils/domain-events/src/index.ts",
    "@overbookd/event": "~~libraries/event/src/index.ts",
    "@overbookd/festival-event": "~~domains/festival-event/src/index.ts",
    "@overbookd/festival-event-constants":
      "~~constants/festival-event-constants/src/index.ts",
    "@overbookd/geo-location": "~~libraries/geo-location/src/index.ts",
    "@overbookd/http": "~~utils/http/src/index.ts",
    "@overbookd/list": "~~libraries/list/src/index.ts",
    "@overbookd/logistic": "~~domains/logistic/src/index.ts",
    "@overbookd/money": "~~libraries/money/src/index.ts",
    "@overbookd/period": "~~/libraries/period/src/index.ts",
    "@overbookd/permission": "~~constants/permission/src/index.ts",
    "@overbookd/personal-account": "~~domains/personal-account/src/index.ts",
    "@overbookd/planning": "~~domains/planning/src/index.ts",
    "@overbookd/registration": "~~domains/registration/src/index.ts",
    "@overbookd/signa": "~~domains/signa/src/index.ts",
    "@overbookd/slugify": "~~libraries/slugify/src/index.ts",
    "@overbookd/team": "~~constants/team/src/index.ts",
    "@overbookd/user": "~~domains/user/src/index.ts",
  },
});
