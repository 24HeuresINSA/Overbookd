import { ApiProperty } from "@nestjs/swagger";
import { UserPersonalDataResponseDto } from "./user-personal-data.response.dto";
import { MyUserInformation } from "@overbookd/user";
import { Permission } from "@overbookd/permission";

export class MyUserInformationResponseDto
  extends UserPersonalDataResponseDto
  implements MyUserInformation
{
  @ApiProperty({
    description: "User personal account balance",
    type: Number,
  })
  balance: number;

  @ApiProperty({
    name: "permissions",
    description: "User permissions",
    type: String,
    isArray: true,
  })
  permissions: Permission[];

  @ApiProperty({
    name: "tasksCount",
    description: "User tasks count",
    type: Number,
  })
  tasksCount: number;
}
