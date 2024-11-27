import {
  isDarkTheme,
  saveDarkTheme,
  saveLightTheme,
} from "~/utils/vuetify/theme/theme.utils";

const MOBILE_MAX_WIDTH = 760;

type State = {
  isDarkTheme: boolean;
  isDesktop: boolean;
};

export const useLayoutStore = defineStore("layout", {
  state: (): State => ({
    isDarkTheme: isDarkTheme(),
    isDesktop: window.innerWidth > MOBILE_MAX_WIDTH,
  }),
  getters: {
    isMobile(): boolean {
      return !this.isDesktop;
    },
  },
  actions: {
    async toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      if (this.isDarkTheme) {
        saveDarkTheme();
        return;
      }
      saveLightTheme();
    },

    initializeResizeListener() {
      window.addEventListener("resize", this._updateIsDesktop);
    },

    _updateIsDesktop() {
      this.isDesktop = window.innerWidth > MOBILE_MAX_WIDTH;
    },
  },
});
