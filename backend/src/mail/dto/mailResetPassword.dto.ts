import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsDefined, IsString } from 'class-validator';

export class emailResetPasswordDto {
  @ApiProperty({
    required: true,
    description: 'The email of the user',
  })
  @IsDefined()
  @IsEmail()
  to: string;

  @ApiProperty({
    required: true,
    description: 'The firstname of the user',
  })
  @IsDefined()
  @IsString()
  firstname: string;

  @ApiProperty({
    required: true,
    description: 'The reset token',
  })
  @IsDefined()
  @IsString()
  token: string;
}
