import { ApiProperty } from "@nestjs/swagger";
import {
  IAlertAboutAvailabilities,
  Summary,
} from "@overbookd/volunteer-availability";

export class AvailabilitiesResponseDto implements IAlertAboutAvailabilities {
  @ApiProperty({
    type: String,
    description: "Main alert message",
  })
  summary: Summary;

  @ApiProperty({
    type: Number,
    description: "Number of periods the not yet volunteer is available for",
  })
  nbPeriods: number;
}
