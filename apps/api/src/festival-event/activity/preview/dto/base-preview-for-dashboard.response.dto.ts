import { ApiProperty } from "@nestjs/swagger";
import { FestivalActivity } from "@overbookd/festival-event";
import {
  DRAFT,
  IN_REVIEW,
  REFUSED,
  VALIDATED,
} from "@overbookd/festival-event-constants";

const statuses = [DRAFT, IN_REVIEW, VALIDATED, REFUSED];

export class BasePreviewForDashboardResponseDto {
  @ApiProperty({
    description: "The festival activity id",
    type: Number,
  })
  id: FestivalActivity["id"];

  @ApiProperty({
    description: "The festival activity name",
    type: String,
  })
  name: FestivalActivity["general"]["name"];

  @ApiProperty({
    description: "The festival activity status",
    enum: statuses,
  })
  status: FestivalActivity["status"];
}
