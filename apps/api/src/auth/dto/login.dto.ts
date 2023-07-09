import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    required: true,
    description: 'The email of the user',
  })
  @IsDefined()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
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
