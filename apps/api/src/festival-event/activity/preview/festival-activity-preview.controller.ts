import { Response } from "express";
import {
  UseFilters,
  Controller,
  UseGuards,
  Get,
  Res,
  Logger,
  HttpException,
  Request,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
  ApiProduces,
  ApiQuery,
} from "@nestjs/swagger";
import { PreviewFestivalActivity } from "@overbookd/festival-event";
import {
  PreviewForSecurity,
  PreviewForCommunication,
  CSV,
  PreviewForLogistic,
} from "@overbookd/http";
import {
  EXPORT_FOR_SIGNA,
  READ_ANIMATION_TO_PUBLISH,
  READ_FA,
  VIEW_FA_GEAR_DASHBOARD,
  VIEW_SECURITY_DASHBOARD,
} from "@overbookd/permission";
import { JwtAuthGuard } from "../../../authentication/jwt-auth.guard";
import { Permission } from "../../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../../authentication/permissions-auth.guard";
import { FestivalActivityErrorFilter } from "../common/festival-activity-error.filter";
import { PreviewForCommunicationResponseDto } from "./dto/for-communication-preview.response.dto";
import { PreviewForSecurityResponseDto } from "./dto/for-security-preview.response.dto";
import { RefusedPreviewFestivalActivityResponseDto } from "./dto/preview-refused.response.dto";
import { ValidatedPreviewFestivalActivityResponseDto } from "./dto/preview-validated.response.dto";
import { InReviewPreviewFestivalActivityResponseDto } from "./dto/preview-in-review.response.dto";
import { DraftPreviewFestivalActivityResponseDto } from "./dto/preview-draft.response.dto";
import { FestivalActivityPreviewService } from "./festival-activity-preview.service";
import { RequestWithUserPayload } from "../../../app.controller";
import { FestivalEventErrorFilter } from "../../common/festival-event-error.filter";
import { PreviewForLogisticResponseDto } from "./dto/for-logistic-preview.response.dto";
import { ActivityGearSearchOptionsRequestDto } from "./dto/gear-inquiry-search-options.request.dto";

@ApiBearerAuth()
@ApiTags("festival-activities")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@ApiExtraModels(
  DraftPreviewFestivalActivityResponseDto,
  InReviewPreviewFestivalActivityResponseDto,
  ValidatedPreviewFestivalActivityResponseDto,
  RefusedPreviewFestivalActivityResponseDto,
)
@UseFilters(FestivalActivityErrorFilter, FestivalEventErrorFilter)
@Controller("festival-activities")
export class FestivalActivityPreviewController {
  constructor(
    private readonly previewService: FestivalActivityPreviewService,
  ) {}

  private logger = new Logger(FestivalActivityPreviewController.name);

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
    return this.previewService.findForAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get("mine")
  @ApiResponse({
    status: 200,
    description: "My festival activities",
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
  findMine(
    @Request() { user }: RequestWithUserPayload,
  ): Promise<PreviewFestivalActivity[]> {
    return this.previewService.findMine(user.id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VIEW_FA_GEAR_DASHBOARD)
  @Get("for-logistic")
  @ApiResponse({
    status: 200,
    description: "Festival activities for logistic",
    type: PreviewForLogisticResponseDto,
    isArray: true,
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description:
      "Get festival activity with gear inquiry that match the name or the reference code",
  })
  @ApiQuery({
    name: "category",
    required: false,
    type: String,
    description:
      "Get festival activity with gear inquiry that match the category with category name",
  })
  @ApiQuery({
    name: "owner",
    required: false,
    type: String,
    description:
      "Get festival activity with gear inquiry that are owned by team that match name",
  })
  @ApiQuery({
    name: "drive",
    required: false,
    type: String,
    description:
      "Get festival activity with gear inquiry that are stored in this storage location",
  })
  findAllForLogistic(
    @Query() searchOptions: ActivityGearSearchOptionsRequestDto,
  ): Promise<PreviewForLogistic[]> {
    return this.previewService.findForLogistic(searchOptions);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(VIEW_SECURITY_DASHBOARD)
  @Get("for-security")
  @ApiResponse({
    status: 200,
    description: "Festival activities for security",
    type: PreviewForSecurityResponseDto,
    isArray: true,
  })
  findAllForSecurity(): Promise<PreviewForSecurity[]> {
    return this.previewService.findForSecurity();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_ANIMATION_TO_PUBLISH)
  @Get("for-communication")
  @ApiResponse({
    status: 200,
    description: "Festival activities for communication",
    type: PreviewForCommunicationResponseDto,
    isArray: true,
  })
  findAllForCommunication(): Promise<PreviewForCommunication[]> {
    return this.previewService.findForCommunication();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(EXPORT_FOR_SIGNA)
  @Get("for-signa")
  @ApiResponse({
    status: 200,
    description: "All signages from festival activities",
  })
  @ApiProduces(CSV)
  async findAllForSigna(
    @Request() request: RequestWithUserPayload,
    @Res() response: Response,
  ) {
    try {
      response.setHeader("content-type", request.headers.accept);
      const csv = await this.previewService.findForSignaInCsv();
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
}
