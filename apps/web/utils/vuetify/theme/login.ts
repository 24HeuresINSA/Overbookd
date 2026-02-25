import type { ThemeDefinition } from "vuetify";
import { WHITE } from "./common";
import { lightBackgroundColors } from "./light";

export const loginTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: "#162D3A",
    "on-primary": WHITE,
    ...lightBackgroundColors,
  },
};
