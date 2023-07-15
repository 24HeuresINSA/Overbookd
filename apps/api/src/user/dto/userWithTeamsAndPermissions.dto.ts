import { ApiProperty } from '@nestjs/swagger';
import { UserWithTeamsAndPermissions } from '../user.model';
import { UserPersonnalDataDto } from './userPersonnalData.dto';

export class UserWithTeamsAndPermissionsDto
  extends UserPersonnalDataDto
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
