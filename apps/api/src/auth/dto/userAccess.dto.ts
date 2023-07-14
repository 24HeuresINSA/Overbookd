import { ApiProperty } from '@nestjs/swagger';

export class UserAccess {
  @ApiProperty({
    description: 'User access token',
  })
  access_token: string;
}
