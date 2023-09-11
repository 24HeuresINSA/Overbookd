import { ApiProperty } from "@nestjs/swagger";
import { UserPersonnalDataResponseDto } from "./user-personnal-data.response.dto";
import { MyUserInformation } from "@overbookd/user";
import { Permission } from "@overbookd/permission";

export class MyUserInformationResponseDto
  extends UserPersonnalDataResponseDto
  implements MyUserInformation
{
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
