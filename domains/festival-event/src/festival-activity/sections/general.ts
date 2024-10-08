import { WithAtLeastOneItem } from "@overbookd/list";
import { TimeWindow } from "../../common/time-window.js";

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
  categories: WithAtLeastOneItem<string>;
  toPublish: true;
  photoLink: string;
  isFlagship: boolean;
  timeWindows: WithAtLeastOneItem<TimeWindow>;
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

export function isPrivate(general: General): general is Private {
  return general.toPublish === false;
}
