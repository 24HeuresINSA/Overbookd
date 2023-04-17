import { Period } from 'src/volunteer-availability/domain/period.model';

type Volunteer = {
  id: number;
  name: string;
};

export type Assignment = {
  period: Period;
  volunteers: Volunteer[];
};

export type Task = {
  name: string;
  description: string;
  period: Period;
  location: string;
  assignments: Assignment[];
};
