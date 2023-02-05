import { ApiProperty } from '@nestjs/swagger';
import { UserNameWithId } from 'src/ft/dto/ft-response.dto';

export class UserRequest {
  user: UserNameWithId;
}

export class FtUserRequestResponseDto {
  @ApiProperty({
    description: 'The user requested on the time window',
    type: UserNameWithId,
    required: true,
  })
  user: UserNameWithId;
}
