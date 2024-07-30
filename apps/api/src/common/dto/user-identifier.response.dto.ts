import { ApiProperty } from "@nestjs/swagger";
import { User } from "@overbookd/user";

export class UserIdentifierResponseDto implements User {
  @ApiProperty()
  id: number;

  @ApiProperty({ example: "John" })
  firstname: string;

  @ApiProperty({ example: "Doe" })
  lastname: string;

  @ApiProperty({ required: false })
  nickname?: string;
}
