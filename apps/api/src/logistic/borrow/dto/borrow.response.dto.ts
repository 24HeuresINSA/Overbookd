import { ApiProperty } from "@nestjs/swagger";
import { Borrow, GearRequest } from "@overbookd/logistic";

class GearRequestDto implements GearRequest {
  @ApiProperty({})
  slug: GearRequest["slug"];

  @ApiProperty({})
  name: GearRequest["name"];

  @ApiProperty({})
  quantity: GearRequest["quantity"];
}

export class BorrowResponseDto implements Borrow {
  @ApiProperty({})
  id: Borrow["id"];

  @ApiProperty({})
  lender: Borrow["lender"];

  @ApiProperty({})
  availableOn: Borrow["availableOn"];

  @ApiProperty({})
  unavailableOn: Borrow["unavailableOn"];

  @ApiProperty({ type: GearRequestDto, isArray: true })
  gears: Borrow["gears"];
}
