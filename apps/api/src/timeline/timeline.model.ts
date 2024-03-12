import { IProvidePeriod } from "@overbookd/period";

export type TimelineFa = {
  id: number;
  name: string;
  team: string;
};

export type TimelineTimeSpan = IProvidePeriod & {
  id: number;
};

export type TimelineTimeWindow = IProvidePeriod & {
  timeSpans: TimelineTimeSpan[];
};

export type TimelineFt = {
  id: number;
  name: string;
  timeWindows: TimelineTimeWindow[];
  hasPriority: boolean;
};

export type TimelineEvent = {
  fa: TimelineFa;
  fts: TimelineFt[];
};
