import { createVuetify, type ThemeDefinition } from "vuetify";
import { fr } from "vuetify/locale";

const classicLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#41C5E5",
    "primary-light": "#81D3E7",
    "on-primary": "#FFFFFF",
    secondary: "#FFCB29",
    "on-secondary": "#2A2A2A",
    tertiary: "#ED1D45",
    "on-tertiary": "#FFFFFF",
    background: "#F4F4F4",
    "on-background": "#2A2A2A",
    "on-background-light": "#555555",
    surface: "#FFFFFF",
    "on-surface": "#2A2A2A",
    success: "#79ED1D",
    "on-success": "#2A2A2A",
    warning: "#FFCB29",
    "on-warning": "#2A2A2A",
    error: "#ED1D45",
    "on-error": "#FFFFFF",
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: false,
    locale: {
      locale: "fr",
      messages: { fr },
    },
    theme: {
      defaultTheme: "classicLightTheme",
      themes: { classicLightTheme },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
