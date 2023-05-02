import { Period } from "./period";

export interface TimelineFa {
  id: number;
  name: string;
  team: string;
}

export interface TimelineFt {
  id: number;
  name: string;
  timespans: Period[];
}

export interface TimelineEvent {
  fa: TimelineFa;
  fts: TimelineFt[];
}
