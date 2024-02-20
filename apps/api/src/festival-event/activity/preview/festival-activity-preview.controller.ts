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
} from "@nestjs/swagger";
import { PreviewFestivalActivity } from "@overbookd/festival-event";
import {
  PreviewForSecurity,
  PreviewForCommunication,
  JSON,
  CSV,
  PreviewForLogistic,
} from "@overbookd/http";
import { READ_FA } from "@overbookd/permission";
import { JwtAuthGuard } from "../../../authentication/jwt-auth.guard";
import { Permission } from "../../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../../authentication/permissions-auth.guard";
import { FestivalActivityErrorFilter } from "../common/festival-activity-error.filter";
import { PreviewForCommunicationResponseDto } from "./dto/for-communication-preview-festival-activity.response.dto";
import { PreviewForSecurityResponseDto } from "./dto/for-security-preview-festival-activity.response.dto";
import { RefusedPreviewFestivalActivityResponseDto } from "./dto/preview-refused-festival-activity.response.dto";
import { ValidatedPreviewFestivalActivityResponseDto } from "./dto/preview-validated-festival-activity.response.dto";
import { InReviewPreviewFestivalActivityResponseDto } from "./dto/preview-in-review-festival-activity.response.dto";
import { DraftPreviewFestivalActivityResponseDto } from "./dto/preview-draft-festival-activity.response.dto";
import { FestivalActivityPreviewService } from "./festival-activity-preview.service";
import { RequestWithUserPayload } from "../../../app.controller";
import { LogisticPreview } from "./logistic-preview";
import { PreviewForLogisticResponseDto } from "./dto/for-logistic-preview-festival-activity.response.dto";

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
@UseFilters(FestivalActivityErrorFilter)
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
  @Get("for-security")
  @ApiResponse({
    status: 200,
    description: "All festival activities",
    type: PreviewForSecurityResponseDto,
    isArray: true,
  })
  findAllForSecurity(): Promise<PreviewForSecurity[]> {
    return this.previewService.findForSecurity();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @Get("for-communication")
  @ApiResponse({
    status: 200,
    description: "All festival activities",
    type: PreviewForCommunicationResponseDto,
    isArray: true,
  })
  findAllForCommunication(): Promise<PreviewForCommunication[]> {
    return this.previewService.findForCommunication();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(READ_FA)
  @ApiBearerAuth()
  @Get("for-logistic")
  @ApiResponse({
    status: 200,
    description: "All festival activities",
    type: PreviewForLogisticResponseDto,
    isArray: true,
  })
  @ApiProduces(JSON, CSV)
  async findAllForLogistic(
    @Request() request: RequestWithUserPayload,
    @Res() response: Response,
  ): Promise<PreviewForLogistic[]> {
    const format = request.headers.accept;
    try {
      const preview = await this.previewService.findForLogistic();
      response.setHeader("content-type", format);
      response.send(LogisticPreview.withFormat(format).format(preview));
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
