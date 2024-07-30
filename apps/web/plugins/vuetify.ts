import { createVuetify } from "vuetify";
import { fr } from "vuetify/locale";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    locale: {
      locale: "fr",
      messages: { fr },
    },
  });
  nuxtApp.vueApp.use(vuetify);
});
