import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordRequestDto {
  @ApiProperty({
    required: true,
    description: 'The email of the user',
    example: 'john@doe.com',
  })
  @IsDefined()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
