import { ApiProperty } from "@nestjs/swagger";
import {
  ElectricitySupply,
  FestivalActivityReviewable,
} from "@overbookd/festival-event";
import { ElectricitySupplyResponseDto } from "../electricity-supply.response.dto";

type Supply = FestivalActivityReviewable["supply"];
export class SupplyResponseDto implements Supply {
  @ApiProperty({
    required: true,
    isArray: true,
    type: ElectricitySupplyResponseDto,
  })
  electricity: ElectricitySupply[];

  @ApiProperty({ required: true, nullable: true })
  water: string | null;
}
