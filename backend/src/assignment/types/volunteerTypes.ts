import { Period } from 'src/volunteer-availability/domain/period.model';
import { VolunteerResponseDto } from '../dto/volunteerResponse.dto';

export interface VolunteerAfterRequest
  extends Omit<VolunteerResponseDto, 'teams'> {
  team: {
    team: {
      code: string;
    };
  }[];
  availabilities?: Period[];
}

export interface VolunteerWithAvailabilities extends VolunteerResponseDto {
  availabilities: Period[];
}

export const SELECT_VOLUNTEER = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
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

export const SELECT_VOLUNTEER_WITH_AVAILABILITIES = {
  ...SELECT_VOLUNTEER,
  availabilities: {
    select: {
      start: true,
      end: true,
    },
  },
};
