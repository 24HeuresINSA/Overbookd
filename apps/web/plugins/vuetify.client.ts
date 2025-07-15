import { createVuetify } from "vuetify";
import { fr } from "vuetify/locale";
import { DEFAULT_ITEMS_PER_PAGE } from "~/utils/vuetify/component-props";
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
const CARD_RADIUS = "25px";

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
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        noDataText: "Aucune donnée",
        loadingText: "Chargement des données ...",
      },
      VCard: {
        style: {
          borderRadius: CARD_RADIUS,
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
      VAlert: {
        style: {
          borderRadius: CARD_RADIUS,
          margin: "5px",
          padding: "15px",
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
