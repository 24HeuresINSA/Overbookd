import { createVuetify } from "vuetify";
import { VCalendar } from "vuetify/labs/components";
import { fr } from "vuetify/locale";
import {
  blueDarkTheme,
  redDarkTheme,
  yellowDarkTheme,
} from "~/utils/vuetify/theme/dark";
import {
  blueLightTheme,
  redLightTheme,
  yellowLightTheme,
} from "~/utils/vuetify/theme/light";
import { loginTheme } from "~/utils/vuetify/theme/login";

const commonFieldDefaultSettings = {
  variant: "outlined",
  density: "comfortable",
};
const commonFieldBorderRadiusStyle = { borderRadius: "12px" };

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: { VCalendar },
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
        loginTheme,
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
      VField: { style: commonFieldBorderRadiusStyle },
      VBtn: { style: commonFieldBorderRadiusStyle },
      VBtnToggle: { style: commonFieldBorderRadiusStyle },
      VTextField: commonFieldDefaultSettings,
      VSelect: commonFieldDefaultSettings,
      VAutocomplete: commonFieldDefaultSettings,
      VCombobox: commonFieldDefaultSettings,
      VTextarea: commonFieldDefaultSettings,
      VFileInput: commonFieldDefaultSettings,
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
