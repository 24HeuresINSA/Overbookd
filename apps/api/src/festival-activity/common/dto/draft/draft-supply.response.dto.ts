import { ApiProperty } from "@nestjs/swagger";
import { Draft, ElectricitySupply } from "@overbookd/festival-activity";
import { ElectricitySupplyResponseDto } from "../electricity-supply.response.dto";

export type Supply = Draft["supply"];
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
