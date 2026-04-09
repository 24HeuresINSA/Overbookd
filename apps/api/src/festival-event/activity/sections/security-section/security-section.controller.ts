import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  UseFilters,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { FestivalActivity } from "@overbookd/festival-event";
import { WRITE_FA } from "@overbookd/permission";
import { ApiSwaggerResponse } from "../../../../api-swagger-response.decorator";
import { JwtAuthGuard } from "../../../../authentication/jwt-auth.guard";
import { Permission } from "../../../../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../../../../authentication/permissions-auth.guard";
import { FestivalEventErrorFilter } from "../../../common/festival-event-error.filter";
import { DraftFestivalActivityResponseDto } from "../../common/dto/draft/draft-festival-activity.response.dto";
import {
  InReviewFestivalActivityResponseDto,
  RefusedFestivalActivityResponseDto,
  ValidatedFestivalActivityResponseDto,
} from "../../common/dto/reviewable/reviewable-festival-activity.dto";
import { FestivalActivityErrorFilter } from "../../common/festival-activity-error.filter";
import { SecurityRequestDto } from "./dto/update-security.request.dto";
import { SecuritySectionService } from "./security-section.service";

@Controller("festival-activities")
@ApiTags("festival-activities")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseFilters(FestivalActivityErrorFilter, FestivalEventErrorFilter)
@ApiSwaggerResponse()
@ApiExtraModels(
  DraftFestivalActivityResponseDto,
  InReviewFestivalActivityResponseDto,
  ValidatedFestivalActivityResponseDto,
  RefusedFestivalActivityResponseDto,
)
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
