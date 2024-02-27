import { ApiProperty } from "@nestjs/swagger";
import { Alerts } from "@overbookd/alerts";
import { IAlertAboutContribution } from "@overbookd/contribution";
import { IAlertAboutPersonalAccount } from "@overbookd/personal-account";
import { IAlertAboutAvailabilities } from "@overbookd/volunteer-availability";
import { PersonalAccountResponseDto } from "./personal-account.response.dto";
import { ContributionResponseDto } from "./contribution.response.dto";
import { AvailabilitiesResponseDto } from "./availabilities.response.dto";

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

  @ApiProperty({
    type: AvailabilitiesResponseDto,
    required: false,
  })
  availabilities?: IAlertAboutAvailabilities;
}
