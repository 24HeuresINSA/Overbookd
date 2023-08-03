import { ApiProperty } from '@nestjs/swagger';

export class UserAccessResponseDto {
  @ApiProperty({
    description: 'User access token',
  })
  accessToken: string;
}
