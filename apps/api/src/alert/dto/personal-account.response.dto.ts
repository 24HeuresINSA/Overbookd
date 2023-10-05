import { ApiProperty } from "@nestjs/swagger";
import {
  IAlertAboutPersonalAccount,
  Summary,
} from "@overbookd/personal-account";

export class PersonalAccountResponseDto implements IAlertAboutPersonalAccount {
  @ApiProperty({
    type: String,
    description: "Main alert message",
  })
  summary: Summary;

  @ApiProperty({
    type: Number,
    description:
      "Current balance for adherent concerned by personal account alert",
  })
  balance: number;
}
