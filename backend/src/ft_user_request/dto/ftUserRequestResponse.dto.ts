import { ApiProperty } from '@nestjs/swagger';
import { UserNameWithId } from 'src/ft/dto/ft-response.dto';
import { AlsoRequestedByFT } from 'src/ft/ftTypes';
import { PeriodForm } from 'src/gear-requests/gearRequests.service';

export interface UserRequest {
  user: UserNameWithId;
  alsoRequestedBy: AlsoRequestedByFT[];
}

export type DataBaseUserRequest = Pick<UserRequest, 'user'>;

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
}
