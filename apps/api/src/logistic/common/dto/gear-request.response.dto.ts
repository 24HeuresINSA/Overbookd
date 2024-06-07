import { ApiProperty } from "@nestjs/swagger";
import { GearRequest } from "@overbookd/logistic";

export class GearRequestDto implements GearRequest {
  @ApiProperty()
  slug: GearRequest["slug"];

  @ApiProperty()
  name: GearRequest["name"];

  @ApiProperty()
  quantity: GearRequest["quantity"];
}
