import { Period } from 'src/volunteer-availability/domain/period.model';

export interface TimelineFa {
  id: number;
  name: string;
  team: string;
}

export type TimelineTimespan = Period & {
  id: number;
};

export type TimelineTimeWindow = Period & {
  timespans: TimelineTimespan[];
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
