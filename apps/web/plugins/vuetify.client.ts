import { createVuetify } from "vuetify";
import { fr } from "vuetify/locale";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: false,
    locale: {
      locale: "fr",
      messages: { fr },
    },
  });
  nuxtApp.vueApp.use(vuetify);
});
