import { ApiProperty } from "@nestjs/swagger";
import { TeamMobilization } from "@overbookd/festival-event";
import { IsNumber, IsPositive, IsString } from "class-validator";

export class TeamMobilizationRequestDto implements TeamMobilization {
  @ApiProperty({ type: Number })
  @IsNumber()
  @IsPositive()
  count: TeamMobilization["count"];

  @ApiProperty({ type: String })
  @IsString()
  team: TeamMobilization["team"];
}
