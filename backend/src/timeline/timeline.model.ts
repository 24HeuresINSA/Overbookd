import { Period } from 'src/volunteer-availability/domain/period.model';

export interface TimelineFa {
  id: number;
  name: string;
  team: string;
}

export interface TimelineFt {
  id: number;
  name: string;
  timespans: Period[];
  hasPriority: boolean;
}

export interface TimelineEvent {
  fa: TimelineFa;
  fts: TimelineFt[];
}
