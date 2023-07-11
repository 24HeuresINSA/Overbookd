import { Period } from '@overbookd/period';

export interface TimelineFa {
  id: number;
  name: string;
  team: string;
}

export type TimelineTimeSpan = Period & {
  id: number;
};

export type TimelineTimeWindow = Period & {
  timeSpans: TimelineTimeSpan[];
};

export interface TimelineFt {
  id: number;
  name: string;
  timeWindows: TimelineTimeWindow[];
  hasPriority: boolean;
}

export interface TimelineEvent {
  fa: TimelineFa;
  fts: TimelineFt[];
}
