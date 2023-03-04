import { ApiProperty } from '@nestjs/swagger';
import { AlsoRequestedByFT, UserNameWithId } from 'src/ft/ftTypes';
import { PeriodForm } from 'src/gear-requests/gearRequests.service';

export interface UserRequest {
  user: UserNameWithId;
  alsoRequestedBy: AlsoRequestedByFT[];
  isAvailable: boolean;
}

export type DataBaseUserRequest = Pick<UserRequest, 'user'> & {
  ftTimeWindowsId: number;
};

class AlsoRequestedByFTRepresentation implements AlsoRequestedByFT {
  id: number;
  name: string;
  period: PeriodForm;
}

export class FtUserRequestResponseDto implements UserRequest {
  @ApiProperty({
    description: 'The user requested on the time window',
    type: UserNameWithId,
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
}
