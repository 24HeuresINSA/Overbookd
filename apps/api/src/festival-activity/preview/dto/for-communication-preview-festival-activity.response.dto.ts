import { ApiProperty } from "@nestjs/swagger";
import {
  DRAFT,
  IN_REVIEW,
  VALIDATED,
  REFUSED,
} from "@overbookd/festival-activity";
import { PreviewForCommunication } from "@overbookd/http";
import { TimeWindowResponseDto } from "../../common/dto/time-window.response.dto";

const statuses = [DRAFT, IN_REVIEW, VALIDATED, REFUSED];

export class PreviewForCommunicationResponseDto
  implements PreviewForCommunication
{
  @ApiProperty({
    description: "The festival activity id",
    type: Number,
  })
  id: PreviewForCommunication["id"];

  @ApiProperty({
    description: "The festival activity status",
    enum: statuses,
  })
  status: PreviewForCommunication["status"];

  @ApiProperty({
    description: "The festival activity name",
    type: String,
  })
  name: PreviewForCommunication["name"];

  @ApiProperty({
    description: "The festival activity time windows",
    type: TimeWindowResponseDto,
    isArray: true,
  })
  timeWindows: PreviewForCommunication["timeWindows"];

  @ApiProperty({
    description: "The festival activity description",
    type: String,
  })
  description: PreviewForCommunication["description"];

  @ApiProperty({
    description: "The festival activity photo link",
    type: String,
  })
  photoLink: PreviewForCommunication["photoLink"];

  @ApiProperty({
    description: "The festival activity is flagship",
    type: Boolean,
  })
  isFlagship: PreviewForCommunication["isFlagship"];

  @ApiProperty({
    description: "The festival activity categories",
    type: String,
    isArray: true,
  })
  categories: PreviewForCommunication["categories"];
}
