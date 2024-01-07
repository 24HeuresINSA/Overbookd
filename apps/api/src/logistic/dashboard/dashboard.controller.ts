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
import { DashboardService } from "./dashboard.service";
import { VIEW_GEAR_DASHBOARD } from "@overbookd/permission";
import { Permission } from "../../authentication/permissions-auth.decorator";
import { JwtAuthGuard } from "../../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../../authentication/permissions-auth.guard";
import { GearPreviewResponseDto } from "./dto/gear-preview.response.dto";
import { GearDetailsResponseDto } from "./dto/gear-details.response.dto";
import { GearDetails, GearPreview } from "@overbookd/http";

@ApiBearerAuth()
@ApiTags("logistic/dashboard")
@Controller("logistic/dashboard")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VIEW_GEAR_DASHBOARD)
  @Get()
  @ApiResponse({
    status: 200,
    description: "Get all gear previews",
    isArray: true,
    type: GearPreviewResponseDto,
  })
  getSummaries(): Promise<GearPreview[]> {
    return this.dashboardService.getSummaries();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VIEW_GEAR_DASHBOARD)
  @Get(":slug")
  @ApiResponse({
    status: 200,
    description: "Get gear",
    type: GearDetailsResponseDto,
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
  getDetails(
    @Param("slug") slug: string,
    @Query("start") start: Date,
    @Query("end") end: Date,
  ): Promise<GearDetails[]> {
    return this.dashboardService.getDetails(slug, start, end);
  }
}
