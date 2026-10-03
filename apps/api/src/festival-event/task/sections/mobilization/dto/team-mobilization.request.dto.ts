import { ApiProperty } from "@nestjs/swagger";
import { TeamMobilization } from "@overbookd/festival-event";
import { IsNumber, IsString, Min } from "class-validator";

export class TeamMobilizationRequestDto implements TeamMobilization {
  @ApiProperty({ type: Number })
  @IsNumber()
  @Min(-1)
  count: TeamMobilization["count"];

  @ApiProperty({ type: String })
  @IsString()
  team: TeamMobilization["team"];
}
