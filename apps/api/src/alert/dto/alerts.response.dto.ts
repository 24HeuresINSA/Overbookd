import { ApiProperty } from "@nestjs/swagger";
import { Alerts } from "@overbookd/alerts";
import {
  IAlertAboutContribution,
  Summary as ContributionSummary,
} from "@overbookd/contribution";
import {
  IAlertAboutPersonalAccount,
  Summary as PersonalAccountSummary,
} from "@overbookd/personal-account";

class ContributionResponseDto implements IAlertAboutContribution {
  @ApiProperty({
    type: String,
    description: "Main alert message",
  })
  summary: ContributionSummary;

  @ApiProperty({
    type: Number,
    description: "Edition concerned by contribution alert",
  })
  edition: number;
}

class PersonalAccountResponseDto implements IAlertAboutPersonalAccount {
  @ApiProperty({
    type: String,
    description: "Main alert message",
  })
  summary: PersonalAccountSummary;

  @ApiProperty({
    type: Number,
    description:
      "Current balance for adherent concerned by personal account alert",
  })
  balance: number;
}

export class AlertsResponseDto implements Alerts {
  @ApiProperty({
    type: PersonalAccountResponseDto,
    required: false,
  })
  personalAccount?: IAlertAboutPersonalAccount;

  @ApiProperty({
    type: ContributionResponseDto,
    required: false,
  })
  contribution?: IAlertAboutContribution;

  @ApiProperty({ required: false })
  profilePicture?: boolean;

  @ApiProperty({ required: false })
  friends?: boolean;

  @ApiProperty({ required: false })
  notYetVolunteer?: boolean;
}
