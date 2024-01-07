import { ApiProperty } from "@nestjs/swagger";
import { FestivalActivity } from "@overbookd/festival-activity";
import { ActivityInquiry, GearDetails } from "@overbookd/http";

class ActivityInquiryResponseDto implements ActivityInquiry {
  @ApiProperty({ type: Number })
  id: FestivalActivity["id"];

  @ApiProperty({ type: String })
  name: FestivalActivity["general"]["name"];

  @ApiProperty({ type: Number })
  quantity: number;
}

export class GearDetailsResponseDto implements GearDetails {
  @ApiProperty({ type: Date })
  start: Date;

  @ApiProperty({ type: Date })
  end: Date;

  @ApiProperty({ type: Number })
  inquiry: number;

  @ApiProperty({ type: Number })
  stock: number;

  @ApiProperty({
    type: ActivityInquiryResponseDto,
    isArray: true,
  })
  activities: ActivityInquiry[];

  @ApiProperty({ type: Number })
  inventory: number;
}
