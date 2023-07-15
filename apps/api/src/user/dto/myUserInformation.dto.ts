import { ApiProperty } from '@nestjs/swagger';
import { MyUserInformation } from '../user.model';
import { UserPersonnalDataDto } from './userPersonnalData.dto';

export class MyUSerInformationDto
  extends UserPersonnalDataDto
  implements MyUserInformation
{
  @ApiProperty({
    name: 'permissions',
    description: 'User permissions',
    type: String,
    isArray: true,
  })
  permissions: string[];

  @ApiProperty({
    name: 'tasksCount',
    description: 'User tasks count',
    type: Number,
  })
  tasksCount: number;
}
