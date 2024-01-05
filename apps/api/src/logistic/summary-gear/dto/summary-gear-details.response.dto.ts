import { ApiProperty } from "@nestjs/swagger";
import { FestivalActivity } from "@overbookd/festival-activity";
import {
  ActivityInquiry,
  InventoryRecord,
  SummaryGearDetails,
} from "@overbookd/http";

class ActivityInquiryResponseDto implements ActivityInquiry {
  @ApiProperty({ type: Number })
  id: FestivalActivity["id"];

  @ApiProperty({ type: String })
  name: FestivalActivity["general"]["name"];

  @ApiProperty({ type: Number })
  quantity: number;
}

class InventoryRecordResponseDto implements InventoryRecord {
  @ApiProperty({ type: Number })
  quantity: number;
}

export class SummaryGearDetailsResponseDto implements SummaryGearDetails {
  @ApiProperty({ type: Date })
  start: Date;

  @ApiProperty({ type: Date })
  end: Date;

  @ApiProperty({
    type: ActivityInquiryResponseDto,
    isArray: true,
  })
  activities: ActivityInquiry[];

  @ApiProperty({
    type: InventoryRecordResponseDto,
    isArray: true,
  })
  inventoryRecords: InventoryRecord[];
}
