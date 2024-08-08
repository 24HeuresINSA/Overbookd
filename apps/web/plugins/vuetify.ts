import { createVuetify } from "vuetify";
import { fr } from "vuetify/locale";
import {
  blueDarkTheme,
  redDarkTheme,
  yellowDarkTheme,
} from "~/utils/theme/dark";
import {
  blueLightTheme,
  redLightTheme,
  yellowLightTheme,
} from "~/utils/theme/light";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: false,
    locale: {
      locale: "fr",
      messages: { fr },
    },
    theme: {
      defaultTheme: "blueDarkTheme",
      themes: {
        blueLightTheme,
        yellowLightTheme,
        redLightTheme,
        blueDarkTheme,
        yellowDarkTheme,
        redDarkTheme,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
