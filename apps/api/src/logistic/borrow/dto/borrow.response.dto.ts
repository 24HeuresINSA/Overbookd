import { ApiProperty } from "@nestjs/swagger";
import { Borrow } from "@overbookd/logistic";
import { GearRequestDto } from "../../common/dto/gear-request.response.dto";

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
