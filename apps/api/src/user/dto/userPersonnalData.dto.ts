import { ApiProperty } from '@nestjs/swagger';
import { UserPersonnalData } from '../user.model';
import { UserWithoutPasswordDto } from './userWithoutPassword.dto';

export class UserPersonnalDataDto
  extends UserWithoutPasswordDto
  implements UserPersonnalData
{
  @ApiProperty({
    name: 'teams',
    description: 'User teams',
    type: String,
    isArray: true,
  })
  teams: string[];
}
