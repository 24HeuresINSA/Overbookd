import { SELECT_USER_TEAMS } from 'src/user/user.service';
import { VolunteerResponseDto } from '../dto/volunteerResponse.dto';
import { Period } from 'src/volunteer-availability/domain/period.model';

export interface DatabaseVolunteerWithAvailabilities
  extends Omit<VolunteerResponseDto, 'teams'> {
  team: {
    team: {
      code: string;
    };
  }[];
  availabilities?: Period[];
}

export const SELECT_VOLUNTEER = {
  id: true,
  firstname: true,
  lastname: true,
  charisma: true,
  comment: true,
  ...SELECT_USER_TEAMS,
};
