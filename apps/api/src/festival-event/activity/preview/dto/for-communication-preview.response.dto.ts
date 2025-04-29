import { ApiProperty } from "@nestjs/swagger";
import { PreviewForCommunication } from "@overbookd/http";
import { TimeWindowResponseDto } from "../../../common/dto/time-window.response.dto";
import { BasePreviewForDashboardResponseDto } from "./base-preview-for-dashboard.response.dto";

export class PreviewForCommunicationResponseDto
  extends BasePreviewForDashboardResponseDto
  implements PreviewForCommunication
{
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
