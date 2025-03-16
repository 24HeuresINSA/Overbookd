import { ApiProperty } from "@nestjs/swagger";
import { UserPersonalDataResponseDto } from "./user-personal-data.response.dto";
import { MyUserInformation } from "@overbookd/user";
import { Permission } from "@overbookd/permission";
import { Membership } from "@overbookd/registration";

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
    description: "User permissions",
    type: String,
    isArray: true,
  })
  permissions: Permission[];

  @ApiProperty({
    description: "User tasks count",
    type: Number,
  })
  tasksCount: number;

  @ApiProperty({
    description: "User has approved EULA",
    type: Boolean,
  })
  hasApprovedEULA: boolean;

  @ApiProperty({
    description: "User membership application",
    type: String,
  })
  membershipApplication: Membership | null;
}
