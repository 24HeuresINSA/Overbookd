import { ApiProperty } from "@nestjs/swagger";
import { User } from "@overbookd/user";

export class BaseUserResponseDto implements User {
  @ApiProperty({
    name: "id",
    description: "User id",
  })
  id: number;

  @ApiProperty({
    name: "firstname",
    description: "User firstname",
  })
  firstname: string;

  @ApiProperty({
    name: "lastname",
    description: "User lastname",
  })
  lastname: string;

  @ApiProperty({
    name: "nickname",
    description: "User nickname",
    required: false,
  })
  nickname?: string;
}
