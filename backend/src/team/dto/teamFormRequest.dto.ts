import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidationArguments,
} from 'class-validator';

const hexCode = new RegExp('^#[0-9|a-f|A-F]{6}$');
const mdiIcon = new RegExp('^mdi-.+');

export class TeamFormDto {
  @ApiProperty({
    required: true,
    description: 'The name of the team',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
    description: 'The code of the team',
  })
  @IsOptional()
  @IsString()
  @MinLength(4)
  code?: string;

  @ApiProperty({
    required: false,
    description: 'The color of the team',
  })
  @IsOptional()
  @IsString()
  @Matches(hexCode, {
    message: (va: ValidationArguments) =>
      `${va.property} should be hexadecimal code starting with '#'`,
  })
  color?: string;

  @ApiProperty({
    required: false,
    description: 'The icon of the team',
  })
  @IsOptional()
  @IsString()
  @Matches(mdiIcon, {
    message: (va: ValidationArguments) =>
      `${va.property} should be mdi icon code starting with 'mdi-'`,
  })
  icon?: string;

  @ApiProperty({
    required: false,
    description: 'Is the team a fa validator',
  })
  @IsOptional()
  @IsBoolean()
  fa_validator?: boolean;

  @ApiProperty({
    required: false,
    description: 'Is the team a ft validator',
  })
  @IsOptional()
  @IsBoolean()
  ft_validator?: boolean;
}
