import { UserModificationDto } from './userModification.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserReadDto extends UserModificationDto {
  @ApiProperty({
    required: false,
    description: 'list of teams the user is in',
  })
  team: string[];
}
