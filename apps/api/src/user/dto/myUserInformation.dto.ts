import { ApiProperty } from '@nestjs/swagger';
import { MyUserInformation } from '../user.model';
import { UserWithTeamsAndPermissionsDto } from './userWithTeamsAndPermissions.dto';

export class MyUSerInformationDto
  extends UserWithTeamsAndPermissionsDto
  implements MyUserInformation
{
  @ApiProperty({
    name: 'tasksCount',
    description: 'User tasks count',
    type: Number,
  })
  tasksCount: number;
}
