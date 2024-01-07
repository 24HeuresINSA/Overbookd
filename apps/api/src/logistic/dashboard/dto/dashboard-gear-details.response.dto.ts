import { ApiProperty } from "@nestjs/swagger";
import { FestivalActivity } from "@overbookd/festival-activity";
import {
  ActivityInquiry,
  DashboardGearDetails,
  DashboardGearForGraph,
} from "@overbookd/http";

class ActivityInquiryResponseDto implements ActivityInquiry {
  @ApiProperty({ type: Number })
  id: FestivalActivity["id"];

  @ApiProperty({ type: String })
  name: FestivalActivity["general"]["name"];

  @ApiProperty({ type: Number })
  quantity: number;
}

class DashboardGearDetailsResponseDto implements DashboardGearDetails {
  @ApiProperty({
    type: ActivityInquiryResponseDto,
    isArray: true,
  })
  activities: ActivityInquiry[];

  @ApiProperty({ type: Number })
  inventory: number;
}

export class DashboardGearForGraphResponseDto implements DashboardGearForGraph {
  @ApiProperty({ type: Date })
  start: Date;

  @ApiProperty({ type: Date })
  end: Date;

  @ApiProperty({ type: Number })
  inquiry: number;

  @ApiProperty({ type: Number })
  stock: number;

  @ApiProperty({ type: DashboardGearDetailsResponseDto })
  details: DashboardGearDetails;
}
