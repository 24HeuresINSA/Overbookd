import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PermissionLinkDto {
  @ApiProperty({
    name: 'teamCodes',
    required: true,
    description: 'An array of team code to link to the permission',
    isArray: true,
    type: String,
  })
  @IsString({ each: true })
  @IsNotEmpty()
  teamCodes: string[];
}
