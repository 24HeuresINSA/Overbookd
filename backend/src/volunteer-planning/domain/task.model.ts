import { Period } from 'src/volunteer-availability/domain/period.model';

export type Task = {
  name: string;
  description: string;
  period: Period;
  location: string;
};
