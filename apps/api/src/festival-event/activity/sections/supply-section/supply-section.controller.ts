import {
  UseFilters,
  Controller,
  UseGuards,
  Patch,
  Param,
  ParseIntPipe,
  Body,
  Post,
  HttpCode,
  Delete,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { ElectricitySupply, FestivalActivity } from "@overbookd/festival-event";
import { WRITE_FA } from "@overbookd/permission";
import { JwtAuthGuard } from "../../../../authentication/jwt-auth.guard";
import { Permission } from "../../../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../../../authentication/permissions-auth.guard";
import { DraftFestivalActivityResponseDto } from "../../common/dto/draft/draft-festival-activity.response.dto";
import {
  InReviewFestivalActivityResponseDto,
  ValidatedFestivalActivityResponseDto,
  RefusedFestivalActivityResponseDto,
} from "../../common/dto/reviewable/reviewable-festival-activity.dto";
import { FestivalActivityErrorFilter } from "../../common/festival-activity-error.filter";
import { UpdateElectricitySupplyRequestDto } from "./dto/update-electricity-supply.request.dto";
import { AddElectricitySupplyRequestDto } from "./dto/add-electricity-supply.request.dto";
import { SupplyRequestDto } from "./dto/update-supply.request.dto";
import { SupplySectionService } from "./supply-section.service";
import { FestivalEventErrorFilter } from "../../../common/festival-event-error.filter";
import { ApiSwaggerResponse } from "../../../../api-swagger-response.decorator";

@Controller("festival-activities")
@ApiTags("festival-activities")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseFilters(FestivalActivityErrorFilter, FestivalEventErrorFilter)
@ApiSwaggerResponse()
@ApiExtraModels(
  DraftFestivalActivityResponseDto,
  InReviewFestivalActivityResponseDto,
  ValidatedFestivalActivityResponseDto,
  RefusedFestivalActivityResponseDto,
)
export class SupplySectionController {
  constructor(private readonly supplyService: SupplySectionService) {}

  @Patch(":id/supply")
  @Permission(WRITE_FA)
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalActivityResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalActivityResponseDto) },
        { $ref: getSchemaPath(ValidatedFestivalActivityResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalActivityResponseDto) },
      ],
    },
  })
  @ApiBody({
    description: "Supply section of festival activity to save",
    type: SupplyRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  saveSupplySection(
    @Param("id", ParseIntPipe) id: FestivalActivity["id"],
    @Body() supply: SupplyRequestDto,
  ): Promise<FestivalActivity> {
    return this.supplyService.saveSupplySection(id, supply);
  }

  @Post(":id/supply/electricity")
  @Permission(WRITE_FA)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalActivityResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalActivityResponseDto) },
        { $ref: getSchemaPath(ValidatedFestivalActivityResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalActivityResponseDto) },
      ],
    },
  })
  @ApiBody({
    description:
      "Electricity supply to add in supply section of festival activity",
    type: AddElectricitySupplyRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  addElectricitySupply(
    @Param("id", ParseIntPipe) id: FestivalActivity["id"],
    @Body() electricitySupply: AddElectricitySupplyRequestDto,
  ): Promise<FestivalActivity> {
    return this.supplyService.addElectricitySupply(id, electricitySupply);
  }

  @Patch(":faId/supply/electricity/:electricitySupplyId")
  @Permission(WRITE_FA)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalActivityResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalActivityResponseDto) },
        { $ref: getSchemaPath(ValidatedFestivalActivityResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalActivityResponseDto) },
      ],
    },
  })
  @ApiBody({
    description:
      "Electricity supply data to update in supply section of festival activity",
    type: UpdateElectricitySupplyRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  @ApiParam({
    name: "electricitySupplyId",
    type: String,
    description: "Electricity supply id",
    required: true,
  })
  updateElectricitySupply(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Param("electricitySupplyId")
    electricitySupplyId: ElectricitySupply["id"],
    @Body() electricitySupply: UpdateElectricitySupplyRequestDto,
  ): Promise<FestivalActivity> {
    return this.supplyService.updateElectricitySupply(
      faId,
      electricitySupplyId,
      electricitySupply,
    );
  }

  @Delete(":faId/supply/electricity/:electricitySupplyId")
  @Permission(WRITE_FA)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival activity",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalActivityResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalActivityResponseDto) },
        { $ref: getSchemaPath(ValidatedFestivalActivityResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalActivityResponseDto) },
      ],
    },
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  @ApiParam({
    name: "electricitySupplyId",
    type: String,
    description: "Electricity supply id",
    required: true,
  })
  removeElectricitySupply(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Param("electricitySupplyId") electricitySupplyId: ElectricitySupply["id"],
  ): Promise<FestivalActivity> {
    return this.supplyService.removeElectricitySupply(
      faId,
      electricitySupplyId,
    );
  }
}
