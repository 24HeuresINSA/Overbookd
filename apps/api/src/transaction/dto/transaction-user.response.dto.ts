import { ApiProperty } from "@nestjs/swagger";
import { TransactionUser } from "@overbookd/personal-account";

export class TransactionUserResponseDto implements TransactionUser {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty({ required: false })
  nickname?: string;
}
