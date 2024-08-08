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
    surface: "#2D2E28",
    "on-surface": WHITE,
    ...statusColors,
  },
  variables: opacityVariables,
};

export const redDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    ...redMainColors,
    background: "#150C0C",
    "on-background": "#F4F4F4",
    surface: "#2D1B1B",
    "on-surface": "#F4F4F4",
    ...statusColors,
  },
  variables: opacityVariables,
};
