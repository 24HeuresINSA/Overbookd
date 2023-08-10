import { IProvidePeriod } from '@overbookd/period';
import { VolunteerTask } from '../user/user.model';

export interface Volunteer {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  teams: string[];
  availabilities: IProvidePeriod[];
  tasks: VolunteerTask[];
}
