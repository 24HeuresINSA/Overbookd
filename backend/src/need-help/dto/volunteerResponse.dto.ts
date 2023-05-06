import { ApiProperty } from '@nestjs/swagger';
import { Volunteer } from '../needHelp.model';

export class VolunteerResponseDto implements Volunteer {
  @ApiProperty({ name: 'id', description: 'Volunteer id', type: Number })
  id: number;

  @ApiProperty({ description: 'Volunteer firstname', type: String })
  firstname: string;

  @ApiProperty({ description: 'Volunteer lastname', type: String })
  lastname: string;

  @ApiProperty({ description: 'Volunteer phone number', type: String })
  phone: string;

  @ApiProperty({
    description: 'Teams volunteer is member of',
    type: String,
    isArray: true,
  })
  teams: string[];
}
