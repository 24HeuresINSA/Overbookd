import {
  Body,
  Controller,
  Get,
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
} from "@nestjs/swagger";
import { FestivalActivityService } from "./festival-activity.service";
import { READ_FA, WRITE_FA } from "@overbookd/permission";
import type {
  DraftFestivalActivityRepresentation,
  FestivalActivityRepresentation,
  PreviewFestivalActivity,
} from "@overbookd/festival-activity";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { PreviewFestivalActivityResponseDto } from "./dto/preview-festival-activity.response.dto";
import { Permission } from "../authentication/permissions-auth.decorator";
import { RequestWithUserPayload } from "../app.controller";
import { CreateFestivalActivityRequestDto } from "./dto/create-festival-activity.request.dto";
import { DraftFestivalActivityDto } from "./dto/draft-festival-activity.dto";
import {
  GeneralSectionRequestDto,
  InChargeSectionRequestDto,
  SecuritySectionRequestDto,
  SignaSectionRequestDto,
  SupplySectionRequestDto,
} from "./dto/update-festival-activity.request.dto";

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
    type: PreviewFestivalActivityResponseDto,
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
    @Param("id", ParseIntPipe) id: number,
  ): Promise<FestivalActivityRepresentation | null> {
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
  ): Promise<DraftFestivalActivityRepresentation> {
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
    type: GeneralSectionRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  saveGeneralSection(
    @Param("id", ParseIntPipe) id: number,
    @Body() general: GeneralSectionRequestDto,
  ): Promise<FestivalActivityRepresentation> {
    return this.festivalActivityService.saveGeneralSection(id, general);
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
    type: InChargeSectionRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  saveInChargeSection(
    @Param("id", ParseIntPipe) id: number,
    @Body() inCharge: InChargeSectionRequestDto,
  ): Promise<FestivalActivityRepresentation> {
    return this.festivalActivityService.saveInChargeSection(id, inCharge);
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
    type: SignaSectionRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  saveSignaSection(
    @Param("id", ParseIntPipe) id: number,
    @Body() signa: SignaSectionRequestDto,
  ): Promise<FestivalActivityRepresentation> {
    return this.festivalActivityService.saveSignaSection(id, signa);
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
    type: SecuritySectionRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  saveSecuritySection(
    @Param("id", ParseIntPipe) id: number,
    @Body() security: SecuritySectionRequestDto,
  ): Promise<FestivalActivityRepresentation> {
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
    type: SupplySectionRequestDto,
  })
  @ApiParam({
    name: "id",
    type: Number,
    description: "Festival activity id",
    required: true,
  })
  saveSupplySection(
    @Param("id", ParseIntPipe) id: number,
    @Body() supply: SupplySectionRequestDto,
  ): Promise<FestivalActivityRepresentation> {
    return this.festivalActivityService.saveSupplySection(id, supply);
  }
}
