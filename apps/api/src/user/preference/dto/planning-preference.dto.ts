import { ApiProperty } from "@nestjs/swagger";
import { PlanningPreference } from "@overbookd/http";
import { IsBoolean } from "class-validator";

export class PlanningPreferenceDto implements PlanningPreference {
  @ApiProperty({
    type: "boolean",
    description: "User want to receive his planning printed on a leaflet",
    example: false,
    nullable: true,
  })
  @IsBoolean()
  paperPlanning: boolean | null;
}
