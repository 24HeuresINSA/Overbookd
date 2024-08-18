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

const commonFieldDefaultSettings = {
  variant: "outlined",
  density: "comfortable",
};

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
    defaults: {
      VCard: {
        style: {
          borderRadius: "25px",
          margin: "5px",
          padding: "5px",
        },
        VCardSubtitle: {
          style: {
            whiteSpace: "normal",
          },
        },
        VCardActions: {
          VBtn: {
            variant: "elevated",
            color: "primary",
          },
        },
      },
      VField: { style: { borderRadius: "12px" } },
      VTextField: commonFieldDefaultSettings,
      VSelect: commonFieldDefaultSettings,
      VAutocomplete: commonFieldDefaultSettings,
      VTextarea: commonFieldDefaultSettings,
      VBtn: { style: { borderRadius: "12px" } },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
