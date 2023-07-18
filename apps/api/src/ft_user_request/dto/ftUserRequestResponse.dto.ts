import { ApiProperty } from '@nestjs/swagger';
import { AlsoRequestedByFT, UserNameWithId } from '../../../src/ft/ftTypes';
import { PeriodForm } from '../../../src/gear-requests/gearRequests.model';

export interface UserRequest {
  user: UserNameWithId;
  alsoRequestedBy: AlsoRequestedByFT[];
  isAvailable: boolean;
  isAlreadyAssigned: boolean;
}

export type DataBaseUserRequest = Pick<UserRequest, 'user'> & {
  id: number;
  ftTimeWindowsId: number;
};

class RequestedUser implements UserNameWithId {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
}

class PeriodRepresentation implements PeriodForm {
  start: Date;
  end: Date;
}

class AlsoRequestedByFTRepresentation implements AlsoRequestedByFT {
  id: number;
  name: string;
  @ApiProperty({ type: PeriodRepresentation })
  period: PeriodForm;
}

export class FtUserRequestResponseDto implements UserRequest {
  @ApiProperty({
    description: 'The user requested on the time window',
    type: RequestedUser,
    required: true,
  })
  user: UserNameWithId;

  @ApiProperty({
    description: 'FT the user is also requested for similar period',
    isArray: true,
    type: AlsoRequestedByFTRepresentation,
  })
  alsoRequestedBy: AlsoRequestedByFT[];

  @ApiProperty({
    description: 'Is the volunteer available during requested period',
    type: Boolean,
  })
  isAvailable: boolean;

  @ApiProperty({
    description: 'Is the volunteer already assigned during requested period',
    type: Boolean,
  })
  isAlreadyAssigned: boolean;
}
