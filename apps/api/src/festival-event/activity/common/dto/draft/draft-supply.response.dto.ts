import { ApiProperty } from "@nestjs/swagger";
import {
  FestivalActivityDraft,
  ElectricitySupply,
} from "@overbookd/festival-event";
import { ElectricitySupplyResponseDto } from "../electricity-supply.response.dto";

export type Supply = FestivalActivityDraft["supply"];
export class SupplyDto implements Supply {
  @ApiProperty({
    isArray: true,
    type: ElectricitySupplyResponseDto,
  })
  electricity: ElectricitySupply[];

  @ApiProperty({
    required: false,
  })
  water: string | null;
}
