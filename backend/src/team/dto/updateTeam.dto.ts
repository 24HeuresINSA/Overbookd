import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

type NewType = string;
const hexCode = new RegExp(/^#[0-9|a-f|A-F]{6}/);
const mdiIcon = new RegExp(/^mdi-.*/);

export class UpdateTeamDto {
  @ApiProperty({
    required: false,
    description: 'The name of the team',
  })
  @IsOptional()
  @IsString()
  name: NewType;

  @ApiProperty({
    required: false,
    description: 'The color of the team',
  })
  @IsOptional()
  @IsString()
  @Matches(hexCode)
  color: string;

  @ApiProperty({
    required: false,
    description: 'The icon of the team',
  })
  @IsOptional()
  @IsString()
  @Matches(mdiIcon)
  icon: string;
}
