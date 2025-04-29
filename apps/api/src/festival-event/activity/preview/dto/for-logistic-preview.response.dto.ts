import { ApiProperty } from "@nestjs/swagger";
import {
  ActivityGearInquiryForPreview,
  PreviewForLogistic,
} from "@overbookd/http";
import { BasePreviewForDashboardResponseDto } from "./base-preview-for-dashboard.response.dto";
import { AssignedInquiryRequestResponseDto } from "../../common/dto/inquiry-request.response.dto";

class GearInquiryDto
  extends AssignedInquiryRequestResponseDto
  implements ActivityGearInquiryForPreview
{
  @ApiProperty({ description: "Gear usage", type: Boolean })
  isPonctualUsage: boolean;

  @ApiProperty({ description: "Gear consumable status", type: Boolean })
  isConsumable: boolean;

  @ApiProperty({ description: "Gear owner name", type: String })
  owner: string;
}

export class PreviewForLogisticResponseDto
  extends BasePreviewForDashboardResponseDto
  implements PreviewForLogistic
{
  @ApiProperty({
    description: "Team in charge of this festival activity",
    type: String,
  })
  team: PreviewForLogistic["team"];

  @ApiProperty({
    description: "The festival activity gear inquiries",
    type: GearInquiryDto,
    isArray: true,
  })
  inquiries: PreviewForLogistic["inquiries"];
}
