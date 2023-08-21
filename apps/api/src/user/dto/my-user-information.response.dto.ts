import { ApiProperty } from "@nestjs/swagger";
import { MyUserInformation } from "../user.model";
import { UserWithTeamsAndPermissionsResponseDto } from "./user-with-teams-and-permissions.response.dto";

export class MyUSerInformationResponseDto
  extends UserWithTeamsAndPermissionsResponseDto
  implements MyUserInformation
{
  @ApiProperty({
    name: "tasksCount",
    description: "User tasks count",
    type: Number,
  })
  tasksCount: number;
}
