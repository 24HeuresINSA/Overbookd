import { ApiProperty } from "@nestjs/swagger";
import { UserPersonnalData } from "../user.model";
import { UserWithoutPasswordResponseDto } from "./user-without-password.response.dto";

export class UserPersonnalDataResponseDto
  extends UserWithoutPasswordResponseDto
  implements UserPersonnalData
{
  @ApiProperty({
    name: "teams",
    description: "User teams",
    type: String,
    isArray: true,
  })
  teams: string[];
}
