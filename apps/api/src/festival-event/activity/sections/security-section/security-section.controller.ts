import {
  UseFilters,
  Controller,
  UseGuards,
  Patch,
  Param,
  ParseIntPipe,
  Body,
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
import { FestivalActivity } from "@overbookd/festival-event";
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
import { SecurityRequestDto } from "./dto/update-security.request.dto";
import { SecuritySectionService } from "./security-section.service";
import { FestivalEventErrorFilter } from "../../../common/festival-event-error.filter";
import { ApiSwaggerResponse } from "../../../../api-swagger-response.decorator";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiTags("festival-activities")
@Controller("festival-activities")
@ApiExtraModels(
  DraftFestivalActivityResponseDto,
  InReviewFestivalActivityResponseDto,
  ValidatedFestivalActivityResponseDto,
  RefusedFestivalActivityResponseDto,
)
@UseFilters(FestivalActivityErrorFilter, FestivalEventErrorFilter)
@ApiSwaggerResponse()
export class SecuritySectionController {
  constructor(private readonly securityService: SecuritySectionService) {}

  @Patch(":id/security")
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
    return this.securityService.saveSecuritySection(id, security);
  }
}
