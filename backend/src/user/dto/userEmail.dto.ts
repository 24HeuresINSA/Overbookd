import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsDefined } from 'class-validator';

export class userEmailDto {
  @ApiProperty({
    required: true,
    description: 'The email of the user',
  })
  @IsDefined()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
