import { IProvidePeriod } from "@overbookd/period";

export interface TimelineFa {
  id: number;
  name: string;
  team: string;
}

export type TimelineTimeSpan = IProvidePeriod & {
  id: number;
};

export type TimelineTimeWindow = IProvidePeriod & {
  timeSpans: TimelineTimeSpan[];
};

export interface TimelineFt {
  id: number;
  name: string;
  timeWindows: TimelineTimeWindow[];
  hasPriority: boolean;
  owner: number;
}

export interface TimelineEvent {
  fa: TimelineFa;
  fts: TimelineFt[];
}
