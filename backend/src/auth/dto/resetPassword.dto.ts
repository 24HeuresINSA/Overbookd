import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsDefined,
  IsString,
  MinLength,
  Matches,
  ValidationArguments,
} from 'class-validator';
import { OneNumber, upperCaseCharacter } from 'src/user/dto/common';

export class ResetPasswordDto {
  @ApiProperty({
    required: true,
    description: 'The reset password token',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    required: true,
    description: 'The new password',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(upperCaseCharacter, {
    message: (va: ValidationArguments) =>
      `${va.property} should have at least 1 upper case char`,
  })
  @Matches(OneNumber, {
    message: (va: ValidationArguments) =>
      `${va.property} should have at least 1 number char`,
  })
  password: string;

  @ApiProperty({
    required: true,
    description: 'The new password again',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(upperCaseCharacter, {
    message: (va: ValidationArguments) =>
      `${va.property} should have at least 1 upper case char`,
  })
  @Matches(OneNumber, {
    message: (va: ValidationArguments) =>
      `${va.property} should have at least 1 number char`,
  })
  password2: string;
}
