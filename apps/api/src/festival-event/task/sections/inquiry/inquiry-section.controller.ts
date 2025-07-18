import {
  UseFilters,
  Controller,
  Body,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Delete,
  Patch,
  HttpCode,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { InquirySectionService } from "./inquiry-section.service";
import { FestivalTaskErrorFilter } from "../../common/festival-task-error.filter";
import { VALIDATE_FT, WRITE_FT } from "@overbookd/permission";
import { JwtAuthGuard } from "../../../../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../../../../authentication/permissions-auth.guard";
import { DraftFestivalTaskResponseDto } from "../../common/dto/draft/draft-festival-task.response.dto";
import { Permission } from "../../../../authentication/permissions-auth.decorator";
import { FestivalTask, InquiryRequest } from "@overbookd/festival-event";
import { FestivalEventErrorFilter } from "../../../common/festival-event-error.filter";
import {
  InReviewFestivalTaskResponseDto,
  RefusedFestivalTaskResponseDto,
  ValidatedFestivalTaskResponseDto,
} from "../../common/dto/reviewable/reviewable-festival-task.response.dto";
import { LinkInquiryDriveRequestDto } from "../../../common/dto/link-inquiry-drive.request.dto";
import { UpdateInquiryRequestDto } from "../../../common/dto/update-inquiry-request.request.dto";
import { AddInquiryRequestDto } from "../../../common/dto/add-inquiry-request.request.dto";
import { ApiSwaggerResponse } from "../../../../api-swagger-response.decorator";

@Controller("festival-tasks")
@ApiTags("festival-tasks")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseFilters(FestivalTaskErrorFilter, FestivalEventErrorFilter)
@ApiSwaggerResponse()
export class InquirySectionController {
  constructor(private readonly inquiryService: InquirySectionService) {}

  @Post(":ftId/inquiry/requests")
  @Permission(WRITE_FT)
  @ApiResponse({
    status: 200,
    description: "A festival task",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalTaskResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalTaskResponseDto) },
      ],
    },
  })
  @ApiBody({
    description: "Inquiry request to add",
    type: AddInquiryRequestDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  addInquiryRequest(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Body() form: AddInquiryRequestDto,
  ): Promise<FestivalTask> {
    return this.inquiryService.addInquiryRequest(ftId, form);
  }

  @Patch(":ftId/inquiry/requests/:inquirySlug")
  @Permission(WRITE_FT)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival task",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalTaskResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalTaskResponseDto) },
      ],
    },
  })
  @ApiBody({
    description: "Inquiry request quantity to update",
    type: UpdateInquiryRequestDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  @ApiParam({
    name: "inquirySlug",
    type: String,
    description: "Inquiry Request Slug",
    required: true,
  })
  updateInquiryRequest(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Param("inquirySlug") slug: InquiryRequest["slug"],
    @Body() inquiryRequest: UpdateInquiryRequestDto,
  ): Promise<FestivalTask> {
    return this.inquiryService.updateInquiryRequest(ftId, slug, inquiryRequest);
  }

  @Delete(":ftId/inquiry/requests/:inquirySlug")
  @Permission(WRITE_FT)
  @ApiResponse({
    status: 200,
    description: "A festival task",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalTaskResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalTaskResponseDto) },
      ],
    },
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  @ApiParam({
    name: "inquirySlug",
    type: String,
    description: "Inquiry slug",
    required: true,
  })
  removeInquiryRequest(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Param("inquirySlug") inquirySlug: InquiryRequest["slug"],
  ): Promise<FestivalTask> {
    return this.inquiryService.removeInquiryRequest(ftId, inquirySlug);
  }

  @Patch(":ftId/inquiry/requests/:inquirySlug/link-drive")
  @Permission(VALIDATE_FT)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Festival task",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalTaskResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
        { $ref: getSchemaPath(RefusedFestivalTaskResponseDto) },
        { $ref: getSchemaPath(ValidatedFestivalTaskResponseDto) },
      ],
    },
  })
  @ApiBody({
    description:
      "Drive to link inquiry request with in inquiry section of festival task",
    type: LinkInquiryDriveRequestDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "Festival task id",
    required: true,
  })
  @ApiParam({
    name: "inquirySlug",
    type: String,
    description: "Inquiry Request Slug",
    required: true,
  })
  linkInquiryRequestToDrive(
    @Param("ftId", ParseIntPipe) ftId: FestivalTask["id"],
    @Param("inquirySlug") slug: InquiryRequest["slug"],
    @Body() { drive }: LinkInquiryDriveRequestDto,
  ): Promise<FestivalTask> {
    return this.inquiryService.linkInquiryRequestToDrive(ftId, {
      slug,
      drive,
    });
  }
}
