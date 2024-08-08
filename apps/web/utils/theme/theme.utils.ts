import { darkThemes } from "./dark";
import { lightThemes } from "./light";

const THEME_KEY = "dark-theme";

export function isDarkTheme(): boolean {
  return localStorage.getItem(THEME_KEY) !== null;
}

export function saveDarkTheme() {
  localStorage.setItem(THEME_KEY, "1");
}

export function saveLightTheme() {
  localStorage.removeItem(THEME_KEY);
}

export function pickRandomTheme(currentTheme?: string): string {
  const themes = isDarkTheme() ? darkThemes : lightThemes;
  const pickableThemes = themes.filter((t) => t !== currentTheme);

  const index = Math.floor(Math.random() * pickableThemes.length);
  return pickableThemes.at(index) ?? "";
}

export function pickReverseTheme(theme: string): string {
  const isDark = theme.includes("Dark");
  if (isDark) return theme.replace("Dark", "Light");
  return theme.replace("Light", "Dark");
}
