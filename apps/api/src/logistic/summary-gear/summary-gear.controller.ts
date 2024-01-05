import { Controller, Get, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { SummaryGearService } from "./summary-gear.service";
import { VIEW_GEAR_SUMMARY } from "@overbookd/permission";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { SummaryGearPreviewResponseDto } from "./dto/summary-gear-preview.response.dto";
import { SummaryGearPreview } from "@overbookd/http";

@ApiBearerAuth()
@ApiTags("logistic/summary-gears")
@Controller("logistic/summary-gears")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
export class SummaryGearController {
  constructor(private readonly summaryGearService: SummaryGearService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VIEW_GEAR_SUMMARY)
  @Get()
  @ApiResponse({
    status: 200,
    description: "Get all gear previews",
    isArray: true,
    type: SummaryGearPreviewResponseDto,
  })
  search(): Promise<SummaryGearPreview[]> {
    return this.summaryGearService.findAll();
  }
}
