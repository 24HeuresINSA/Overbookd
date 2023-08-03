import { ApiProperty } from '@nestjs/swagger';
import { UserWithTeamsAndPermissions } from '../user.model';
import { UserPersonnalDataResponseDto } from './user-personnal-data.response.dto';

export class UserWithTeamsAndPermissionsResponseDto
  extends UserPersonnalDataResponseDto
  implements UserWithTeamsAndPermissions
{
  @ApiProperty({
    name: 'permissions',
    description: 'User permissions',
    type: String,
    isArray: true,
  })
  permissions: string[];
}
