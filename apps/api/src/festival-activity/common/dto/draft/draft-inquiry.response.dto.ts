import { ApiProperty } from "@nestjs/swagger";
import {
  BaseInquiryRequest,
  InquiryWithPotentialRequests,
  TimeWindow
} from "@overbookd/festival-activity";
import { PeriodDto } from "../period.dto";
import { UnassignedInquiryRequestResponseDto } from "../inquiry-request.response.dto";

export class InquiryDto implements InquiryWithPotentialRequests {
  @ApiProperty({
    description: "time windows during which you need requested stuff",
    isArray: true,
    type: PeriodDto,
  })
  timeWindows: TimeWindow[];

  @ApiProperty({
    isArray: true,
    type: UnassignedInquiryRequestResponseDto,
  })
  gears: BaseInquiryRequest[];

  @ApiProperty({
    isArray: true,
    type: UnassignedInquiryRequestResponseDto,
  })
  electricity: BaseInquiryRequest[];

  @ApiProperty({
    isArray: true,
    type: UnassignedInquiryRequestResponseDto,
  })
  barriers: BaseInquiryRequest[];
}
