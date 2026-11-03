import { ApiProperty } from "@nestjs/swagger";
import { FestivalActivityReviewable } from "@overbookd/festival-event";

type Security = FestivalActivityReviewable["security"];
export class SecurityResponseDto implements Security {
  @ApiProperty({
    required: true,
    description: "Mandatory security measure",
    nullable: true,
  })
  specialNeed: string | null;

  @ApiProperty({
    required: true,
    description: "Number of free pass for this festival activity",
  })
  freePass: number;
}
