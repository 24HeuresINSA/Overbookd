import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiResponse,
  ApiParam,
  ApiBody,
  getSchemaPath,
  ApiExtraModels,
} from "@nestjs/swagger";
import { FestivalActivityService } from "./festival-activity.service";
import { READ_FA, VALIDATE_FA, WRITE_FA } from "@overbookd/permission";
import type {
  Contractor,
  ElectricitySupply,
  FestivalActivity,
  InquiryRequest,
  PreviewFestivalActivity,
  Refused,
  Signage,
  TimeWindow,
} from "@overbookd/festival-activity";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { RequestWithUserPayload } from "../app.controller";
import { CreateFestivalActivityRequestDto } from "./dto/create-festival-activity.request.dto";
import { DraftFestivalActivityResponseDto } from "./dto/draft-festival-activity.response.dto";
import {
  AddContractorRequestDto,
  AddElectricitySupplyRequestDto,
  AddFeedbackRequestDto,
  AddInquiryRequestDto,
  AddSignageRequestDto,
  GeneralRequestDto,
  InChargeRequestDto,
  InitInquiryRequestDto,
  LinkInquiryDriveRequestDto,
  LinkSignageCatalogItemDto,
  SecurityRequestDto,
  SignaRequestDto,
  SupplyRequestDto,
  UpdateContractorRequestDto,
  UpdateElectricitySupplyRequestDto,
  UpdateSignageRequestDto,
} from "./dto/update-festival-activity.request.dto";
import {
  DraftPreviewFestivalActivityResponseDto,
  InReviewPreviewFestivalActivityResponseDto,
  RefusedPreviewFestivalActivityResponseDto,
  ValidatedPreviewFestivalActivityResponseDto,
} from "./dto/preview-festival-activity.response.dto";
import { PeriodDto } from "./dto/period.dto";
import { FestivalActivityErrorFilter } from "./festival-activity-error.filter";
import {
  InReviewFestivalActivityResponseDto,
  RefusedFestivalActivityResponseDto,
  ValidatedFestivalActivityResponseDto,
} from "./dto/reviewable-festival-activity.dto";
import {
  AssignedInquiryRequestResponseDto,
  UnassignedInquiryRequestResponseDto,
} from "./dto/inquiry-request.response.dto";
import {
  PrivateReviewableGeneralResponseDto,
  PublicReviewableGeneralResponseDto,
} from "./dto/reviewable/general.response.dto";
import { JwtUtil } from "../authentication/entities/jwt-util.entity";
import { ApproveRequestDto, RejectRequestDto } from "./dto/review.request.dto";
import {
  LinkedSignageResponseDto,
  UnlinkedSignageResponseDto,
} from "./dto/signage.response.dto";

@ApiBearerAuth()
@ApiTags("festival-activity")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@ApiExtraModels(
  UnassignedInquiryRequestResponseDto,
  AssignedInquiryRequestResponseDto,
  UnlinkedSignageResponseDto,
  LinkedSignageResponseDto,
  PublicReviewableGeneralResponseDto,
  PrivateReviewableGeneralResponseDto,
  DraftPreviewFestivalActivityResponseDto,
  InReviewPreviewFestivalActivityResponseDto,
  ValidatedPreviewFestivalActivityResponseDto,
  RefusedPreviewFestivalActivityResponseDto,
  DraftFestivalActivityResponseDto,
  InReviewFestivalActivityResponseDto,
  ValidatedFestivalActivityResponseDto,
  RefusedFestivalActivityResponseDto,
)
@UseFilters(FestivalActivityErrorFilter)
@Controller("festival-activity")
export class FestivalActivityController {
  constructor(
    private readonly festivalActivityService: FestivalActivityService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get()
  @ApiResponse({
    status: 200,
    description: "All festival activities",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftPreviewFestivalActivityResponseDto) },
        { $ref: getSchemaPath(InReviewPreviewFestivalActivityResponseDto) },
        { $ref: getSchemaPath(ValidatedPreviewFestivalActivityResponseDto) },
        { $ref: getSchemaPath(RefusedPreviewFestivalActivityResponseDto) },
      ],
    },
    isArray: true,
  })
  findAll(): Promise<PreviewFestivalActivity[]> {
    return this.festivalActivityService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get(":id")
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(InReviewFestivalActivityResponseDto) },
        { $ref: getSchemaPath(DraftFestivalActivityResponseDto) },
        { $ref: getSchemaPath(ValidatedFestivalActivityResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalActivityResponseDto) },
      ],
    },
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  findById(
    @Param("id", ParseIntPipe) id: FestivalActivity["id"],
  ): Promise<FestivalActivity | null> {
    return this.festivalActivityService.findById(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get(":faId/history")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post()
  @ApiResponse({
    status: 201,
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
    description: "Festival activity to create",
    type: CreateFestivalActivityRequestDto,
  })
  create(
    @Body() { name }: CreateFestivalActivityRequestDto,
    @Request() { user }: RequestWithUserPayload,
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.create(user, name);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":id/ask-for-review")
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
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  askForReview(
    @Param("id", ParseIntPipe) id: FestivalActivity["id"],
    @Request() { user }: RequestWithUserPayload,
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.toReview(id, user);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Patch(":id/general")
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
    description: "General section of festival activity to save",
    type: GeneralRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  saveGeneralSection(
    @Param("id", ParseIntPipe) id: FestivalActivity["id"],
    @Body() general: GeneralRequestDto,
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.saveGeneralSection(id, general);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":id/general/time-windows")
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
    description: "Time window to add in general section of festival activity",
    type: PeriodDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  addGeneralTimeWindow(
    @Param("id", ParseIntPipe) id: FestivalActivity["id"],
    @Body() timeWindow: PeriodDto,
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.addGeneralTimeWindow(id, timeWindow);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Delete(":faId/general/time-windows/:timeWindowId")
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
    name: "timeWindowId",
    type: String,
    description: "Time Window id",
    required: true,
  })
  removeGeneralTimeWindow(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Param("timeWindowId") timeWindowId: TimeWindow["id"],
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.removeGeneralTimeWindow(
      faId,
      timeWindowId,
    );
  }

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
    return this.festivalActivityService.saveInChargeSection(id, inCharge);
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
    return this.festivalActivityService.addContractor(id, contractor);
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
    return this.festivalActivityService.updateContractor(
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
    return this.festivalActivityService.removeContractor(faId, contractorId);
  }

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
    type: SignaRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  saveSignaSection(
    @Param("id", ParseIntPipe) id: FestivalActivity["id"],
    @Body() signa: SignaRequestDto,
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.saveSignaSection(id, signa);
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
    return this.festivalActivityService.addSignage(id, signage);
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
    return this.festivalActivityService.updateSignage(faId, signageId, signage);
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
    return this.festivalActivityService.removeSignage(faId, signageId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VALIDATE_FA)
  @Patch(":faId/signa/signages/:signageId")
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
    type: LinkSignageCatalogItemDto,
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
    @Body() { catalogItemId }: LinkSignageCatalogItemDto,
    @Request() { user }: RequestWithUserPayload,
  ): Promise<FestivalActivity> {
    const jwt = new JwtUtil(user);
    return this.festivalActivityService.linkSignageToCatalogItem(jwt, {
      activityId,
      signageId,
      catalogItemId,
    });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Patch(":id/security")
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
    description: "Security section of festival activity to save",
    type: SecurityRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  saveSecuritySection(
    @Param("id", ParseIntPipe) id: FestivalActivity["id"],
    @Body() security: SecurityRequestDto,
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.saveSecuritySection(id, security);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Patch(":id/supply")
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
    return this.festivalActivityService.saveSupplySection(id, supply);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":id/supply/electricity")
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
    return this.festivalActivityService.addElectricitySupply(
      id,
      electricitySupply,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Patch(":faId/supply/electricity/:electricitySupplyId")
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
    return this.festivalActivityService.updateElectricitySupply(
      faId,
      electricitySupplyId,
      electricitySupply,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Delete(":faId/supply/electricity/:electricitySupplyId")
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
    @Param("electricitySupplyId", ParseIntPipe)
    electricitySupplyId: ElectricitySupply["id"],
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.removeElectricitySupply(
      faId,
      electricitySupplyId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":faId/inquiry")
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
    description: "Inquiry section initial request",
    type: InitInquiryRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  initInquiry(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Body() inquiryInitializer: InitInquiryRequestDto,
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.initInquiry(faId, inquiryInitializer);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":faId/inquiry/time-windows")
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
    description: "Time window to add in inquiry section of festival activity",
    type: PeriodDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  addInquiryTimeWindow(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Body() timeWindow: PeriodDto,
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.addInquiryTimeWindow(faId, timeWindow);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Delete(":faId/inquiry/time-windows/:timeWindowId")
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
    name: "timeWindowId",
    type: String,
    description: "Time Window id",
    required: true,
  })
  removeInquiryTimeWindow(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Param("timeWindowId") timeWindowId: TimeWindow["id"],
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.removeInquiryTimeWindow(
      faId,
      timeWindowId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":faId/inquiry/requests")
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
      "Inquiry request to add in inquiry section of festival activity",
    type: AddInquiryRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  addInquiryRequest(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Body() inquiryRequest: AddInquiryRequestDto,
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.addInquiryRequest(faId, inquiryRequest);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Delete(":faId/inquiry/requests/:inquirySlug")
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
    name: "inquirySlug",
    type: String,
    description: "Inquiry Request Slug",
    required: true,
  })
  removeInquiryRequest(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Param("inquirySlug") slug: InquiryRequest["slug"],
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.removeInquiryRequest(faId, slug);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VALIDATE_FA)
  @Patch(":faId/inquiry/requests/:inquirySlug")
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
      "Drive to link inquiry request with in inquiry section of festival activity",
    type: LinkInquiryDriveRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  @ApiParam({
    name: "inquirySlug",
    type: String,
    description: "Inquiry Request Slug",
    required: true,
  })
  linkInquiryRequestToDrive(
    @Param("faId", ParseIntPipe) activityId: FestivalActivity["id"],
    @Param("inquirySlug") slug: InquiryRequest["slug"],
    @Body() { drive }: LinkInquiryDriveRequestDto,
    @Request() { user }: RequestWithUserPayload,
  ): Promise<FestivalActivity> {
    const jwt = new JwtUtil(user);
    return this.festivalActivityService.linkInquiryRequestToDrive(jwt, {
      activityId,
      slug,
      drive,
    });
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":faId/feedbacks")
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
    description: "Feedback to add to festival activity",
    type: AddFeedbackRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  addFeedback(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Request() { user }: RequestWithUserPayload,
    @Body() feedback: AddFeedbackRequestDto,
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.addFeedback(faId, user, feedback);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VALIDATE_FA)
  @Post(":faId/approve")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival activity",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(InReviewFestivalActivityResponseDto) },
        { $ref: getSchemaPath(ValidatedFestivalActivityResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalActivityResponseDto) },
      ],
    },
  })
  @ApiBody({
    description: "Festival activity approval",
    type: ApproveRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  approve(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Request() { user }: RequestWithUserPayload,
    @Body() { team }: ApproveRequestDto,
  ): Promise<FestivalActivity> {
    const jwt = new JwtUtil(user);
    return this.festivalActivityService.approve(faId, jwt, team);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VALIDATE_FA)
  @Post(":faId/reject")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival activity",
    type: RefusedFestivalActivityResponseDto,
  })
  @ApiBody({
    description: "Festival activity rejection",
    type: RejectRequestDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  reject(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Request() { user }: RequestWithUserPayload,
    @Body() reject: RejectRequestDto,
  ): Promise<Refused> {
    const jwt = new JwtUtil(user);
    return this.festivalActivityService.reject(faId, jwt, reject);
  }
}
