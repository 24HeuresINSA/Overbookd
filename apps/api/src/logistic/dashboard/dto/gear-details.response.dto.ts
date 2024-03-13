import { ApiProperty } from "@nestjs/swagger";
import { FestivalActivity } from "@overbookd/festival-event";
import { Inquiry, GearDetails, GearWithDetails } from "@overbookd/http";

class InquiryResponseDto implements Inquiry {
  @ApiProperty({ type: Number })
  id: FestivalActivity["id"];

  @ApiProperty({ type: String })
  name: FestivalActivity["general"]["name"];

  @ApiProperty({ type: Number })
  quantity: number;
}

class GearDetailsResponseDto implements GearDetails {
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

  @ApiProperty({ type: Number })
  stockDiscrepancy: number;
}

export class GearWithDetailsResponseDto implements GearWithDetails {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  slug: string;

  @ApiProperty({ isArray: true, type: GearDetailsResponseDto })
  details: GearDetails[];
}
