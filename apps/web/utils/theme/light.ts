import type { ThemeDefinition } from "vuetify";

import {
  blueMainColors,
  opacityVariables,
  redMainColors,
  statusColors,
  yellowMainColors,
} from "./common";

export const lightThemes = [
  "blueLightTheme",
  "yellowLightTheme",
  "redLightTheme",
];

const lightBackgroundColors = {
  background: "#F4F4F4",
  "on-background": "#2A2A2A",
  surface: "#FFFFFF",
  "on-surface": "#2A2A2A",
};

export const blueLightTheme: ThemeDefinition = {
  dark: false,
  colors: { ...blueMainColors, ...lightBackgroundColors, ...statusColors },
  variables: opacityVariables,
};

export const yellowLightTheme: ThemeDefinition = {
  dark: false,
  colors: { ...yellowMainColors, ...lightBackgroundColors, ...statusColors },
  variables: opacityVariables,
};

export const redLightTheme: ThemeDefinition = {
  dark: false,
  colors: { ...redMainColors, ...lightBackgroundColors, ...statusColors },
  variables: opacityVariables,
};
