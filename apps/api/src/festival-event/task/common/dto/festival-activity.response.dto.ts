import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import {
  FestivalTask,
  InquiryRequest,
  TimeWindow,
} from "@overbookd/festival-event";
import {
  AssignedInquiryRequestResponseDto,
  UnassignedInquiryRequestResponseDto,
} from "./inquiry-request.response.dto";
import { LocationResponseDto } from "../../../common/dto/location.response.dto";
import { TimeWindowResponseDto } from "../../../common/dto/time-window.response.dto";

type FestivalActivity = FestivalTask["festivalActivity"];

type Inquiry = FestivalActivity["inquiry"];

class InquiryDto implements Inquiry {
  @ApiProperty({
    description: "The inquiry time windows",
    type: TimeWindowResponseDto,
    isArray: true,
  })
  timeWindows: TimeWindow[];

  @ApiProperty({
    description: "The inquiry requests",
    oneOf: [
      { $ref: getSchemaPath(UnassignedInquiryRequestResponseDto) },
      { $ref: getSchemaPath(AssignedInquiryRequestResponseDto) },
    ],
    isArray: true,
  })
  all: InquiryRequest[];
}

export class FestivalActivityResponseDto implements FestivalActivity {
  @ApiProperty({
    description: "The festival activity id",
    type: Number,
  })
  id: FestivalActivity["id"];

  @ApiProperty({
    description: "The festival activity name",
    type: String,
  })
  name: FestivalActivity["name"];

  @ApiProperty({
    description: "The festival activity status",
    type: String,
  })
  status: FestivalActivity["status"];

  @ApiProperty({
    description: "Activity location",
    type: LocationResponseDto,
  })
  location: FestivalActivity["location"];

  @ApiProperty({
    description: "Is activity requesting water or electricity supply",
    type: Boolean,
  })
  hasSupplyRequest: boolean;

  @ApiProperty({
    description: "The festival activity time windows",
    type: TimeWindowResponseDto,
    isArray: true,
  })
  timeWindows: FestivalActivity["timeWindows"];

  @ApiProperty({
    description: "The festival activity inquiry",
    type: InquiryDto,
  })
  inquiry: FestivalActivity["inquiry"];
}
