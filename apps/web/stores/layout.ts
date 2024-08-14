import {
  isDarkTheme,
  saveDarkTheme,
  saveLightTheme,
} from "~/utils/vuetify/theme/theme.utils";

const MAX_MOBILE_WIDTH = 960;

type State = {
  isDarkTheme: boolean;
  isDesktop: boolean;
};

export const useLayoutStore = defineStore("layout", {
  state: (): State => ({
    isDarkTheme: isDarkTheme(),
    isDesktop: window.innerWidth >= MAX_MOBILE_WIDTH,
  }),
  actions: {
    async toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      this.isDarkTheme ? saveDarkTheme() : saveLightTheme();
    },

    initializeResizeListener() {
      window.addEventListener("resize", this._updateIsDesktop);
    },

    _updateIsDesktop() {
      this.isDesktop = window.innerWidth >= MAX_MOBILE_WIDTH;
    },
  },
});
