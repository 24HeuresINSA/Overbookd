import { ApiProperty } from "@nestjs/swagger";
import { ElectricitySupply, Reviewable } from "@overbookd/festival-activity";
import { ElectricitySupplyResponseDto } from "../electricity-supply.response.dto";

type Supply = Reviewable["supply"];
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
