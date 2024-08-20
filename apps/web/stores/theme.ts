import {
  isDarkTheme,
  saveDarkTheme,
  saveLightTheme,
} from "~/utils/vuetify/theme/theme.utils";

type State = {
  isDark: boolean;
};

export const useThemeStore = defineStore("theme", {
  state: (): State => ({
    isDark: isDarkTheme(),
  }),
  actions: {
    async toggleTheme() {
      this.isDark = !this.isDark;
      this.isDark ? saveDarkTheme() : saveLightTheme();
    },
  },
});
