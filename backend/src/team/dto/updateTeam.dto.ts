import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Matches,
  ValidationArguments,
} from 'class-validator';

const hexCode = new RegExp(/^#[0-9|a-f|A-F]{6}$/);
const mdiIcon = new RegExp(/^mdi-.*/);

export class UpdateTeamDto {
  @ApiProperty({
    required: false,
    description: 'The name of the team',
  })
  @IsOptional()
  @IsString()
  name: string;

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
  color: string;

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
  icon: string;
}
