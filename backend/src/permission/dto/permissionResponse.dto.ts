import { ApiProperty } from '@nestjs/swagger';

export class PermissionResponseDto {
  @ApiProperty({
    name: 'id',
    description: 'The id of the permission',
    type: Number,
  })
  id: number;

  @ApiProperty({
    name: 'name',
    description: 'The name of the permission',
    type: String,
  })
  name: string;

  @ApiProperty({
    name: 'description',
    description: 'The description of the permission',
    type: String,
  })
  description: string;

  @ApiProperty({
    name: 'teams',
    description: 'The teams that have this permission',
    isArray: true,
    type: Number,
  })
  teams: string[];
}
