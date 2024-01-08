import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import {
  InquiryRequest,
  InquiryWithPotentialRequests, TimeWindow
} from "@overbookd/festival-activity";
import { TimeWindowResponseDto } from "../time-window.response.dto";
import {
  AssignedInquiryRequestResponseDto,
  UnassignedInquiryRequestResponseDto
} from "../inquiry-request.response.dto";

export class ReviewableInquiryResponseDto implements InquiryWithPotentialRequests {
  @ApiProperty({ required: true, isArray: true, type: TimeWindowResponseDto })
  timeWindows: TimeWindow[];

  @ApiProperty({
    required: true,
    isArray: true,
    description: "Barriers related requests",
    oneOf: [
      { $ref: getSchemaPath(UnassignedInquiryRequestResponseDto) },
      { $ref: getSchemaPath(AssignedInquiryRequestResponseDto) },
    ],
  })
  barriers: InquiryRequest[];

  @ApiProperty({
    required: true,
    isArray: true,
    description: "Gears related requests",
    oneOf: [
      { $ref: getSchemaPath(UnassignedInquiryRequestResponseDto) },
      { $ref: getSchemaPath(AssignedInquiryRequestResponseDto) },
    ],
  })
  gears: InquiryRequest[];

  @ApiProperty({
    required: true,
    isArray: true,
    description: "Electricity related requests",
    oneOf: [
      { $ref: getSchemaPath(UnassignedInquiryRequestResponseDto) },
      { $ref: getSchemaPath(AssignedInquiryRequestResponseDto) },
    ],
  })
  electricity: InquiryRequest[];
}
