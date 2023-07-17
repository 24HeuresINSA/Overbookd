import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    required: true,
    description: 'The email of the user',
    example: 'john@doe.com',
  })
  @IsDefined()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({
    required: true,
    description: 'The password of the user',
    example: 'my5up3rP4s5w0rd',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password: string;
}
