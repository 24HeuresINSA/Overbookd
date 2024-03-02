import { ApiProperty } from "@nestjs/swagger";
import { Alerts } from "@overbookd/alerts";
import { IAlertAboutContribution } from "@overbookd/contribution";
import { IAlertAboutPersonalAccount } from "@overbookd/personal-account";
import { PersonalAccountResponseDto } from "./personal-account.response.dto";
import { ContributionResponseDto } from "./contribution.response.dto";

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
  hardAvailabilities?: boolean;

  @ApiProperty({ required: false })
  registreeAvailabilities?: boolean;
}
