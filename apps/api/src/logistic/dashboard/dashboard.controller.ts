import {
  Controller,
  Get,
  HttpException,
  Logger,
  Param,
  ParseDatePipe,
  Query,
  Request as RequestDecorator,
  Res,
} from "@nestjs/common";
import { Request, Response } from "express";
import {
  ApiBearerAuth,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { DashboardService } from "./dashboard.service";
import { VIEW_GEAR_DASHBOARD } from "@overbookd/permission";
import { Permissions } from "../../authentication-zitadel/decorators/permissions-auth.decorator";
import { GearPreviewResponseDto } from "./dto/gear-preview.response.dto";
import { GearWithDetailsResponseDto } from "./dto/gear-details.response.dto";
import { CSV, GearPreview, GearWithDetails } from "@overbookd/http";
import { GearSearchRequestDto } from "../common/dto/gear-search.request.dto";
import { ApiSwaggerResponse } from "../../api-swagger-response.decorator";

@Controller("logistic/dashboard")
@ApiTags("logistic/dashboard")
@ApiBearerAuth()
@ApiSwaggerResponse()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  private logger = new Logger(DashboardController.name);

  @Get()
  @Permissions(VIEW_GEAR_DASHBOARD)
  @ApiResponse({
    status: 200,
    description: "Get all gear previews",
    isArray: true,
    type: GearPreviewResponseDto,
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Get gears that match the name or the reference code",
  })
  @ApiQuery({
    name: "category",
    required: false,
    type: String,
    description: "Get gears that match the category with category name",
  })
  @ApiQuery({
    name: "owner",
    required: false,
    type: String,
    description: "Get gears that are owned by team that match name",
  })
  getSummaries(
    @Query() searchOptions: GearSearchRequestDto,
  ): Promise<GearPreview[]> {
    return this.dashboardService.getSummaries(searchOptions);
  }

  @Get("export")
  @Permissions(VIEW_GEAR_DASHBOARD)
  @ApiResponse({
    status: 200,
    description: "Gear previews in CSV",
  })
  @ApiProduces(CSV)
  async getRequirementsInCsv(
    @RequestDecorator() request: Request,
    @Res() response: Response,
  ) {
    try {
      response.setHeader("content-type", request.headers.accept);
      const csv = await this.dashboardService.getRequirementsInCsv();
      response.send(csv);
      return;
    } catch (e) {
      this.logger.error(e);
      if (e instanceof HttpException) {
        response.status(e.getStatus()).send(e.message);
        return;
      }
      response.status(500).send(e);
    }
  }

  @Get(":slug")
  @Permissions(VIEW_GEAR_DASHBOARD)
  @ApiResponse({
    status: 200,
    description: "Get gear",
    type: GearWithDetailsResponseDto,
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
    @Query("start", new ParseDatePipe()) start: Date,
    @Query("end", new ParseDatePipe()) end: Date,
  ): Promise<GearWithDetails> {
    return this.dashboardService.getDetails(slug, start, end);
  }
}
