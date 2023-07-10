import { VolunteerTask } from 'src/user/user.service';
import { Period } from 'src/volunteer-availability/domain/period.model';

export interface Volunteer {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  teams: string[];
  availabilities: Period[];
  tasks: VolunteerTask[];
}
