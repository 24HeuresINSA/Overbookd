import { ApiProperty } from "@nestjs/swagger";
import { TransactionUser } from "@overbookd/personal-account";

export class TransactionUserResponseDto implements TransactionUser {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ required: false })
  nickname?: string;
}
