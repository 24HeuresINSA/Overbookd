import { ApiProperty } from '@nestjs/swagger';

export class UsernameDto {
  @ApiProperty({
    name: 'id',
    description: 'user id',
    type: Number,
  })
  id: number;

  @ApiProperty({
    name: 'username',
    description: 'user username',
    type: String,
  })
  username: string;
}
