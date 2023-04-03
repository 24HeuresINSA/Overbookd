import { SELECT_USER_TEAMS } from 'src/user/user.service';
import { VolunteerResponseDto } from '../dto/volunteerResponse.dto';

export interface DatabaseVolunteer extends Omit<VolunteerResponseDto, 'teams'> {
  team: {
    team: {
      code: string;
    };
  }[];
  _count?: {
    assignments: number;
  };
}

export const SELECT_VOLUNTEER = {
  id: true,
  firstname: true,
  lastname: true,
  charisma: true,
  comment: true,
  ...SELECT_USER_TEAMS,
};
