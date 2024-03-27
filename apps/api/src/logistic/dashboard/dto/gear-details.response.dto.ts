import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { FestivalActivity } from "@overbookd/festival-event";
import {
  Inquiry,
  GearDetails,
  GearWithDetails,
  BaseGearDetails,
  ConsumableGearDetails,
  GearBorrow,
} from "@overbookd/http";

class InquiryResponseDto implements Inquiry {
  @ApiProperty({ type: Number })
  id: FestivalActivity["id"];

  @ApiProperty({ type: String })
  name: FestivalActivity["general"]["name"];

  @ApiProperty({ type: Number })
  quantity: number;
}

class BorrowResponseDto implements GearBorrow {
  @ApiProperty({ type: Number })
  id: GearBorrow["id"];

  @ApiProperty({ type: String })
  lender: GearBorrow["lender"];

  @ApiProperty({ type: Date })
  start: GearBorrow["start"];

  @ApiProperty({ type: Date })
  end: GearBorrow["end"];

  @ApiProperty({ type: Number })
  quantity: GearBorrow["quantity"];
}

class BaseGearDetailsResponseDto implements BaseGearDetails {
  @ApiProperty({ type: Date })
  start: Date;

  @ApiProperty({ type: Date })
  end: Date;

  @ApiProperty({ type: Number })
  inquiry: number;

  @ApiProperty({ type: Number })
  stock: number;

  @ApiProperty({
    type: InquiryResponseDto,
    isArray: true,
  })
  activities: Inquiry[];

  @ApiProperty({
    type: InquiryResponseDto,
    isArray: true,
  })
  tasks: Inquiry[];

  @ApiProperty({ type: Number })
  inventory: number;

  @ApiProperty({
    type: BorrowResponseDto,
    isArray: true,
  })
  borrows: GearBorrow[];
}

class ConsumableGearDetailsResponseDto
  extends BaseGearDetailsResponseDto
  implements ConsumableGearDetails
{
  @ApiProperty({ type: Number })
  consumed: number;
}

export class GearWithDetailsResponseDto implements GearWithDetails {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  slug: string;

  @ApiProperty({
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(BaseGearDetailsResponseDto) },
      { $ref: getSchemaPath(ConsumableGearDetailsResponseDto) },
    ],
  })
  details: GearDetails[];
}
