import { ApiProperty } from "@nestjs/swagger";
import { FestivalActivityDraft } from "@overbookd/festival-event";

export type Security = FestivalActivityDraft["security"];
export class SecurityDto implements Security {
  @ApiProperty({
    description: "Describe safety features for this festival activity",
    required: false,
  })
  specialNeed: string | null;

  @ApiProperty({
    description: "Number of free pass for this festival activity",
    required: true,
  })
  freePass: number;
}
