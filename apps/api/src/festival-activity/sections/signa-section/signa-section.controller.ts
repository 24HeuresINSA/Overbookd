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
  Request,
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
import { FestivalActivity, Signage } from "@overbookd/festival-event";
import { WRITE_FA, VALIDATE_FA } from "@overbookd/permission";
import { RequestWithUserPayload } from "../../../app.controller";
import { JwtUtil } from "../../../authentication/entities/jwt-util.entity";
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
  UnlinkedSignageResponseDto,
  LinkedSignageResponseDto,
} from "../../common/dto/signage.response.dto";
import { FestivalActivityErrorFilter } from "../../common/festival-activity-error.filter";
import { SignaSectionService } from "./signa-section.service";
import { LinkSignageCatalogItemRequestDto } from "./dto/link-signage-catalog-item.request.dto";
import { AddSignageRequestDto } from "./dto/add-signage.request.dto";
import { UpdateSignaRequestDto } from "./dto/update-signa.request.dto";
import { UpdateSignageRequestDto } from "./dto/update-signage.request.dto";

@ApiBearerAuth()
@ApiTags("festival-activities")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@ApiExtraModels(
  UnlinkedSignageResponseDto,
  LinkedSignageResponseDto,
  DraftFestivalActivityResponseDto,
  InReviewFestivalActivityResponseDto,
  ValidatedFestivalActivityResponseDto,
  RefusedFestivalActivityResponseDto,
)
@UseFilters(FestivalActivityErrorFilter)
@Controller("festival-activities")
export class SignaSectionController {
  constructor(private readonly signaService: SignaSectionService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Patch(":id/signa")
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
    description: "Signa section of festival activity to save",
    type: UpdateSignaRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  saveSignaSection(
    @Param("id", ParseIntPipe) id: FestivalActivity["id"],
    @Body() signa: UpdateSignaRequestDto,
  ): Promise<FestivalActivity> {
    return this.signaService.saveSignaSection(id, signa);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":id/signa/signages")
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
    description: "Signage to add in signa section of festival activity",
    type: AddSignageRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  addSignage(
    @Param("id", ParseIntPipe) id: FestivalActivity["id"],
    @Body() signage: AddSignageRequestDto,
  ): Promise<FestivalActivity> {
    return this.signaService.addSignage(id, signage);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Patch(":faId/signa/signages/:signageId")
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
    description: "Signage data to update in signa section of festival activity",
    type: AddSignageRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  @ApiParam({
    name: "signageId",
    type: String,
    description: "Signage id",
    required: true,
  })
  updateSignage(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Param("signageId") signageId: Signage["id"],
    @Body() signage: UpdateSignageRequestDto,
  ): Promise<FestivalActivity> {
    return this.signaService.updateSignage(faId, signageId, signage);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Delete(":faId/signa/signages/:signageId")
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
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  @ApiParam({
    name: "signageId",
    type: String,
    description: "Signage id",
    required: true,
  })
  removeSignage(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Param("signageId") signageId: Signage["id"],
  ): Promise<FestivalActivity> {
    return this.signaService.removeSignage(faId, signageId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VALIDATE_FA)
  @Patch(":faId/signa/signages/:signageId/link")
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
  @ApiBody({
    description:
      "Catalog item to link signage with in signa section of festival activity",
    type: LinkSignageCatalogItemRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  @ApiParam({
    name: "signageId",
    type: Number,
    description: "Signage id",
    required: true,
  })
  linkSignageToCatalogItem(
    @Param("faId", ParseIntPipe) activityId: FestivalActivity["id"],
    @Param("signageId") signageId: Signage["id"],
    @Body() { catalogItemId }: LinkSignageCatalogItemRequestDto,
    @Request() { user }: RequestWithUserPayload,
  ): Promise<FestivalActivity> {
    const jwt = new JwtUtil(user);
    return this.signaService.linkSignageToCatalogItem(jwt, {
      activityId,
      signageId,
      catalogItemId,
    });
  }
}
