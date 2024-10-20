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
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.isDark ? saveDarkTheme() : saveLightTheme();
    },
  },
});
