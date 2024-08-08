import type { ThemeDefinition } from "vuetify";
import {
  blueMainColors,
  opacityVariables,
  redMainColors,
  statusColors,
  WHITE,
  yellowMainColors,
} from "./common";

export const darkThemes = ["blueDarkTheme", "yellowDarkTheme", "redDarkTheme"];

export const blueDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    ...blueMainColors,
    background: "#1B2B31",
    "on-background": "#F4F4F4",
    surface: "#273B42",
    "on-surface": WHITE,
    ...statusColors,
  },
  variables: opacityVariables,
};

export const yellowDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    ...yellowMainColors,
    background: "#1B1A16",
    "on-background": "#F4F4F4",
    surface: "#2F3036",
    "on-surface": WHITE,
    ...statusColors,
  },
  variables: opacityVariables,
};

export const redDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    ...redMainColors,
    background: "#0B0B0B",
    "on-background": "#F4F4F4",
    surface: "#2A2B30",
    "on-surface": "#F4F4F4",
    ...statusColors,
  },
  variables: opacityVariables,
};
