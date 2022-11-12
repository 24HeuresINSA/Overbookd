import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '@prisma/client';

export class PermissionResponseDto implements Permission {
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
    name: 'teams',
    description: 'The teams that have this permission',
    isArray: true,
    type: Number,
  })
  teams: number[];
}
