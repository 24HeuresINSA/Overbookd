import { ApiProperty } from "@nestjs/swagger";
import { Purchase } from "@overbookd/logistic";
import { GearRequestDto } from "../../common/dto/gear-request.response.dto";

export class PurchaseResponseDto {
  @ApiProperty()
  id: Purchase["id"];

  @ApiProperty()
  seller: Purchase["seller"];

  @ApiProperty()
  availableOn: Purchase["availableOn"];

  @ApiProperty({ type: GearRequestDto, isArray: true })
  gears: Purchase["gears"];
}
