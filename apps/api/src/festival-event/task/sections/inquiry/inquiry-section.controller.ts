import {
  UseFilters,
  Controller,
  Body,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Delete,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiBody,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from "@nestjs/swagger";
import { InquirySectionService } from "./inquiry-section.service";
import { FestivalTaskErrorFilter } from "../../common/festival-task-error.filter";
import { AddInquiryRequestDto } from "./dto/add-inquiry-request.request.dto";
import { WRITE_FT } from "@overbookd/permission";
import { JwtAuthGuard } from "../../../../authentication/jwt-auth.guard";
import { PermissionsGuard } from "../../../../authentication/permissions-auth.guard";
import { DraftFestivalTaskResponseDto } from "../../common/dto/draft/draft-festival-task.response.dto";
import { Permission } from "../../../../authentication/permissions-auth.decorator";
import { FestivalTask, InquiryRequest } from "@overbookd/festival-event";
import { FestivalEventErrorFilter } from "../../../common/festival-event-error.filter";
import { InReviewFestivalTaskResponseDto } from "../../common/dto/reviewable/reviewable-festival-task.response.dto";

@ApiBearerAuth()
@ApiTags("festival-tasks")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@UseFilters(FestivalTaskErrorFilter, FestivalEventErrorFilter)
@Controller("festival-tasks")
export class InquirySectionController {
  constructor(private readonly inquiryService: InquirySectionService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Post(":ftId/inquiry/requests")
  @ApiResponse({
    status: 200,
    description: "A festival task",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalTaskResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Delete(":ftId/inquiry/requests/:inquirySlug")
  @ApiResponse({
    status: 200,
    description: "A festival task",
    schema: {
      oneOf: [
        { $ref: getSchemaPath(DraftFestivalTaskResponseDto) },
        { $ref: getSchemaPath(InReviewFestivalTaskResponseDto) },
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
}
