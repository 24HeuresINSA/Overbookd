import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PermissionLinkDto {
  @ApiProperty({
    name: 'teamIds',
    required: true,
    description: 'An array of team ids to link to the permission',
    isArray: true,
    type: Number,
  })
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  teamIds: number[];
}
