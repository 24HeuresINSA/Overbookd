import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      jaune: {
        primary: "#d1d420",
        secondary: "#d1d420",
        accent: "#d1d420",
        error: "#d1d420",
      },
    },
  },
});
