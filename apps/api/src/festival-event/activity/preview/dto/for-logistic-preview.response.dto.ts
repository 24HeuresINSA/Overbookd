import { ApiProperty } from "@nestjs/swagger";
import {
  ActivityGearInquiryForPreview,
  PreviewForLogistic,
} from "@overbookd/http";
import { BasePreviewForDashboardResponseDto } from "./base-preview-for-dashboard.response.dto";
import { Drive, drives } from "@overbookd/festival-event";

class GearInquiryDto implements ActivityGearInquiryForPreview {
  @ApiProperty({ description: "Gear slug", type: String })
  slug: string;

  @ApiProperty({ description: "Gear quantity", type: Number })
  quantity: number;

  @ApiProperty({ description: "Gear name", type: String })
  name: string;

  @ApiProperty({ description: "Gear drive", enum: drives, required: false })
  drive?: Drive;

  @ApiProperty({ description: "Gear usage", type: Boolean })
  isPonctualUsage: boolean;

  @ApiProperty({ description: "Gear consumable status", type: Boolean })
  isConsumable: boolean;

  @ApiProperty({
    description: "Gear owner name",
    type: String,
    required: false,
  })
  owner?: string;
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
  inquiries: ActivityGearInquiryForPreview[];
}
