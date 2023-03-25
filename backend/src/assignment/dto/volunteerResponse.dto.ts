import { ApiProperty } from '@nestjs/swagger';

export class VolunteerResponseDto {
  @ApiProperty({
    required: true,
    description: 'The id of the volunteer',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The firstname of the volunteer',
    type: String,
  })
  firstname: string;

  @ApiProperty({
    required: true,
    description: 'The lastname of the volunteer',
    type: String,
  })
  lastname: string;

  @ApiProperty({
    required: true,
    description: 'The charisma of the volunteer',
    type: Number,
  })
  charisma: number;

  @ApiProperty({
    description: 'The comment of the volunteer',
    type: String,
  })
  comment?: string;

  @ApiProperty({
    required: true,
    description: 'The team codes of the volunteer',
    type: String,
    isArray: true,
  })
  teams: string[];
}
