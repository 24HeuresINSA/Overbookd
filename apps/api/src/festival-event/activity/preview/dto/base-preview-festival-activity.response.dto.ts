import { ApiProperty } from "@nestjs/swagger";
import { Adherent, PreviewReviewable } from "@overbookd/festival-event";
import { AdherentResponseDto } from "../../../common/dto/adherent.response.dto";
import { SupplyResponseDto } from "../../common/dto/reviewable/reviewable-supply.response.dto";
import { Supply } from "../../common/dto/draft/draft-supply.response.dto";

type ReviewablePreviewBase = Pick<
  PreviewReviewable,
  "id" | "adherent" | "name" | "team"
>;

export class ReviewablePreviewBaseResponseDto implements ReviewablePreviewBase {
  @ApiProperty({
    description: "The festival activity id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: "The festival activity name",
    type: String,
  })
  name: string;

  @ApiProperty({
    description: "The festival activity adherent in charge",
    type: AdherentResponseDto,
  })
  adherent: Adherent;

  @ApiProperty({
    description: "The festival activity team code",
    type: String,
  })
  team: string;

  @ApiProperty({
    description: "The festival activity supply",
    type: SupplyResponseDto,
  })
  supply: Supply;
}
