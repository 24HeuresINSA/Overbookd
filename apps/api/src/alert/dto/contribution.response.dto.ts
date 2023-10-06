import { ApiProperty } from "@nestjs/swagger";
import { IAlertAboutContribution, Summary } from "@overbookd/contribution";

export class ContributionResponseDto implements IAlertAboutContribution {
  @ApiProperty({
    type: String,
    description: "Main alert message",
  })
  summary: Summary;

  @ApiProperty({
    type: Number,
    description: "Edition concerned by contribution alert",
  })
  edition: number;
}
