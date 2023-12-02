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
} from "@nestjs/swagger";
import { FestivalActivityService } from "./festival-activity.service";
import { READ_FA, WRITE_FA } from "@overbookd/permission";
import type {
  Contractor,
  ElectricitySupply,
  FestivalActivity,
  InquiryRequest,
  PreviewFestivalActivity,
  Signage,
  TimeWindow,
} from "@overbookd/festival-activity";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { Permission } from "../authentication/permissions-auth.decorator";
import { RequestWithUserPayload } from "../app.controller";
import { CreateFestivalActivityRequestDto } from "./dto/create-festival-activity.request.dto";
import { DraftFestivalActivityDto } from "./dto/draft-festival-activity.dto";
import {
  AddContractorRequestDto,
  AddElectricitySupplyRequestDto,
  AddInquiryRequestDto,
  AddSignageRequestDto,
  GeneralRequestDto,
  InChargeRequestDto,
  InitInquiryRequestDto,
  SecurityRequestDto,
  SignaRequestDto,
  SupplyRequestDto,
  UpdateContractorRequestDto,
  UpdateElectricitySupplyRequestDto,
  UpdateSignageRequestDto,
} from "./dto/update-festival-activity.request.dto";
import {
  PreviewDraftFestivalActivityResponseDto,
  PreviewInReviewFestivalActivityResponseDto,
} from "./dto/preview-festival-activity.response.dto";
import { PeriodDto } from "./dto/period.dto";

@ApiBearerAuth()
@ApiTags("festival-activity")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
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
        { $ref: getSchemaPath(PreviewDraftFestivalActivityResponseDto) },
        { $ref: getSchemaPath(PreviewInReviewFestivalActivityResponseDto) },
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
    type: DraftFestivalActivityDto,
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
  @Permission(WRITE_FA)
  @Post()
  @ApiResponse({
    status: 201,
    description: "A festival activity",
    type: DraftFestivalActivityDto,
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
  @Patch(":id/general")
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    type: DraftFestivalActivityDto,
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
    type: DraftFestivalActivityDto,
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
    type: DraftFestivalActivityDto,
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
    type: DraftFestivalActivityDto,
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
    type: DraftFestivalActivityDto,
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
    type: DraftFestivalActivityDto,
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
    type: DraftFestivalActivityDto,
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
    type: DraftFestivalActivityDto,
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
    type: DraftFestivalActivityDto,
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
    type: DraftFestivalActivityDto,
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
    type: DraftFestivalActivityDto,
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
  @Permission(WRITE_FA)
  @Patch(":id/security")
  @ApiResponse({
    status: 200,
    description: "A festival activity",
    type: DraftFestivalActivityDto,
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
    type: DraftFestivalActivityDto,
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
    type: DraftFestivalActivityDto,
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
    type: DraftFestivalActivityDto,
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
    type: DraftFestivalActivityDto,
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
    type: DraftFestivalActivityDto,
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
    type: DraftFestivalActivityDto,
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
    type: DraftFestivalActivityDto,
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
  @Post(":faId/inquiry/request")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival activity",
    type: DraftFestivalActivityDto,
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
  @Delete(":faId/inquiry/request/:inquirySlug")
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival activity",
    type: DraftFestivalActivityDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  @ApiParam({
    name: "inquirySlug",
    type: Number,
    description: "Inquiry Request Slug",
    required: true,
  })
  removeInquiryRequest(
    @Param("faId", ParseIntPipe) faId: FestivalActivity["id"],
    @Param("inquirySlug") slug: InquiryRequest["slug"],
  ): Promise<FestivalActivity> {
    return this.festivalActivityService.removeInquiryRequest(faId, slug);
  }
}
