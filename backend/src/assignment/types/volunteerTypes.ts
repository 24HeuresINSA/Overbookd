import { Period } from 'src/volunteer-availability/domain/period.model';
import { VolunteerResponseDto } from '../dto/volunteerResponse.dto';

export interface DatabaseVolunteer extends Omit<VolunteerResponseDto, 'teams'> {
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
  team: {
    select: {
      team: {
        select: {
          code: true,
        },
      },
    },
  },
};
