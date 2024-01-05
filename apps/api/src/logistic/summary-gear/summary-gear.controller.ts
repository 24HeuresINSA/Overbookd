import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { SummaryGearService } from "./summary-gear.service";
import { VIEW_GEAR_SUMMARY } from "@overbookd/permission";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { SummaryGearPreviewResponseDto } from "./dto/summary-gear-preview.response.dto";
import { SummaryGearDetails, SummaryGearPreview } from "@overbookd/http";
import { SummaryGearDetailsResponseDto } from "./dto/summary-gear-details.response.dto";

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
  findAll(): Promise<SummaryGearPreview[]> {
    return this.summaryGearService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VIEW_GEAR_SUMMARY)
  @Get(":slug")
  @ApiParam({
    name: "slug",
    type: String,
    description: "Gear slug",
  })
  @ApiResponse({
    status: 200,
    description: "Get gear details",
    type: SummaryGearDetailsResponseDto,
    isArray: true,
  })
  findOne(@Param("slug") slug: string): Promise<SummaryGearDetails[]> {
    return this.summaryGearService.findOne(slug);
  }
}
