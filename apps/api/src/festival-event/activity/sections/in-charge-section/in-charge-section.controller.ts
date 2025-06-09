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
import { Contractor, FestivalActivity } from "@overbookd/festival-event";
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
import { UpdateContractorRequestDto } from "./dto/update-contractor.request.dto";
import { AddContractorRequestDto } from "./dto/add-contractor.request.dto";
import { InChargeRequestDto } from "./dto/update-in-charge.request.dto";
import { InChargeSectionService } from "./in-charge-section.service";
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
export class InChargeSectionController {
  constructor(private readonly inChargeService: InChargeSectionService) {}

  @Patch(":id/in-charge")
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
    description: "In charge section of festival activity to save",
    type: InChargeRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  saveInChargeSection(
    @Param("id", ParseIntPipe) id: FestivalActivity["id"],
    @Body() inCharge: InChargeRequestDto,
  ): Promise<FestivalActivity> {
    return this.inChargeService.saveInChargeSection(id, inCharge);
  }

  @Post(":id/in-charge/contractors")
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
    description: "Contractor to add in in-charge section of festival activity",
    type: AddContractorRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  addContractor(
    @Param("id", ParseIntPipe) id: FestivalActivity["id"],
    @Body() contractor: AddContractorRequestDto,
  ): Promise<FestivalActivity> {
    return this.inChargeService.addContractor(id, contractor);
  }

  @Patch(":faId/in-charge/contractors/:contractorId")
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
      "Contractor data to update in in-charge section of festival activity",
    type: UpdateContractorRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  @ApiParam({
    name: "contractorId",
    type: Number,
    description: "Contractor id",
    required: true,
  })
  updateContractor(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Param("contractorId", ParseIntPipe) contractorId: Contractor["id"],
    @Body() contractor: UpdateContractorRequestDto,
  ): Promise<FestivalActivity> {
    return this.inChargeService.updateContractor(
      faId,
      contractorId,
      contractor,
    );
  }

  @Delete(":faId/in-charge/contractors/:contractorId")
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
    name: "contractorId",
    type: Number,
    description: "Contractor id",
    required: true,
  })
  removeContractor(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Param("contractorId", ParseIntPipe) contractorId: Contractor["id"],
  ): Promise<FestivalActivity> {
    return this.inChargeService.removeContractor(faId, contractorId);
  }
}
