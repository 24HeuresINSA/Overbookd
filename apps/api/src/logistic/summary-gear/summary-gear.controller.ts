import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiParam,
  ApiQuery,
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
  @ApiResponse({
    status: 200,
    description: "Get gear details",
    type: SummaryGearDetailsResponseDto,
    isArray: true,
  })
  @ApiParam({
    name: "slug",
    type: String,
    description: "Gear slug",
  })
  @ApiQuery({
    name: "start",
    required: true,
    type: Date,
  })
  @ApiQuery({
    name: "end",
    required: true,
    type: Date,
  })
  findOne(
    @Param("slug") slug: string,
    @Query("start") start: Date,
    @Query("end") end: Date,
  ): Promise<SummaryGearDetails[]> {
    return this.summaryGearService.findOne(slug, start, end);
  }
}
