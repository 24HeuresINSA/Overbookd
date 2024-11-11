import { createVuetify } from "vuetify";
import { VTreeview } from "vuetify/labs/components";
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
      VDataTable: {
        itemsPerPage: 25,
        noDataText: "Aucune donnée",
        loadingText: "Chargement des données ...",
      },
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
      VStepper: {
        style: commonFieldBorderRadiusStyle,
        VStepperHeader: { style: commonFieldBorderRadiusStyle },
      },
      VAlert: { style: commonFieldBorderRadiusStyle },
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
    components: {
      VTreeview,
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
