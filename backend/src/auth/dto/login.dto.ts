import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsDefined } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    required: true,
    description: 'The email of the user',
  })
  @IsDefined()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: 'The password of the user',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password: string;
}
