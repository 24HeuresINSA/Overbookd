import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    required: true,
    description: 'The email of the user',
  })
  username: string;

  @ApiProperty({
    required: true,
    description: 'The password of the user',
  })
  password: string;
}
