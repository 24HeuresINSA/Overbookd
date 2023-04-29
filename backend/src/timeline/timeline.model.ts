import { Period } from 'src/volunteer-availability/domain/period.model';

export interface TimelineFa {
  id: number;
  name: string;
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
