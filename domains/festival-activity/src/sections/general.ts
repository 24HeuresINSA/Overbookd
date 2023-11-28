import { TimeWindow } from "./time-window";

export type DraftGeneral = {
  name: string;
  description: string | null;
  categories: string[];
  toPublish: boolean;
  photoLink: string | null;
  isFlagship: boolean;
  timeWindows: TimeWindow[];
};

export type Public = {
  name: string;
  description: string;
  categories: [string, ...string[]];
  toPublish: true;
  photoLink: string;
  isFlagship: boolean;
  timeWindows: [TimeWindow, ...TimeWindow[]];
};

type Private = {
  name: string;
  description: string;
  categories: string[];
  toPublish: false;
  photoLink: null;
  isFlagship: false;
  timeWindows: TimeWindow[];
};

export type General = Public | Private;
