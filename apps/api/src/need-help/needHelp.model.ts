import { Period } from '@overbookd/period';
import { VolunteerTask } from '../../src/user/user.service';

export interface Volunteer {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  teams: string[];
  availabilities: Period[];
  tasks: VolunteerTask[];
}
