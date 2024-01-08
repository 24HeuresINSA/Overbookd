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
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { Contractor, FestivalActivity } from "@overbookd/festival-activity";
import { WRITE_FA } from "@overbookd/permission";
import { JwtAuthGuard } from "../../../authentication/jwt-auth.guard";
import { Permission } from "../../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../../authentication/permissions-auth.guard";
import { DraftFestivalActivityResponseDto } from "../../common/dto/draft/draft-festival-activity.response.dto";
import {
  InReviewFestivalActivityResponseDto,
  ValidatedFestivalActivityResponseDto,
  RefusedFestivalActivityResponseDto,
} from "../../common/dto/reviewable/reviewable-festival-activity.dto";
import {
  PublicReviewableGeneralResponseDto,
  PrivateReviewableGeneralResponseDto,
} from "../../common/dto/reviewable/reviewable-general.response.dto";
import { FestivalActivityErrorFilter } from "../../common/festival-activity-error.filter";
import { UpdateContractorRequestDto } from "./dto/update-contractor.request.dto";
import { AddContractorRequestDto } from "./dto/add-contractor.request.dto";
import { InChargeRequestDto } from "./dto/update-in-charge.request.dto";
import { InChargeSectionService } from "./in-charge-section.service";

@ApiBearerAuth()
@ApiTags("festival-activities")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@ApiExtraModels(
  PublicReviewableGeneralResponseDto,
  PrivateReviewableGeneralResponseDto,
  DraftFestivalActivityResponseDto,
  InReviewFestivalActivityResponseDto,
  ValidatedFestivalActivityResponseDto,
  RefusedFestivalActivityResponseDto,
)
@UseFilters(FestivalActivityErrorFilter)
@Controller("festival-activities")
export class InChargeSectionController {
  constructor(private readonly inChargeService: InChargeSectionService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Patch(":id/in-charge")
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":id/in-charge/contractors")
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Patch(":faId/in-charge/contractors/:contractorId")
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Delete(":faId/in-charge/contractors/:contractorId")
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
