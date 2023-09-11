import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RequestWithUserPayload } from "../app.controller";
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { CompleteFtResponseDto } from "../ft/dto/ft.response.dto";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { TimeSpanParametersRequestDto } from "./dto/time-span-parameters.request.dto";
import { UpsertFtReviewRequestDto } from "./dto/upsert-ft-review.request.dto";
import { FtReviewService } from "./ft-review.service";

@ApiBearerAuth()
@ApiTags("ft")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller("ft")
export class FtReviewController {
  constructor(private readonly ftReviewService: FtReviewService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission("validate-ft")
  @Post(":ftId/validation")
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: "Validate a FT",
    type: CompleteFtResponseDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "FT id",
    required: true,
  })
  @ApiBody({
    type: UpsertFtReviewRequestDto,
    description: "FT to validate",
  })
  validateFt(
    @Param("ftId", ParseIntPipe) ftId: number,
    @Body() upsertFtReviewsDto: UpsertFtReviewRequestDto,
  ): Promise<CompleteFtResponseDto | null> {
    return this.ftReviewService.validateFt(ftId, upsertFtReviewsDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission("validate-ft")
  @Post(":ftId/refusal")
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: "Refuse a FT",
    type: CompleteFtResponseDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "FT id",
    required: true,
  })
  @ApiBody({
    type: UpsertFtReviewRequestDto,
    description: "FT to refuse",
  })
  refuseFt(
    @Param("ftId", ParseIntPipe) ftId: number,
    @Body() upsertFtReviewsDto: UpsertFtReviewRequestDto,
    @Request() req: RequestWithUserPayload,
  ): Promise<CompleteFtResponseDto | null> {
    return this.ftReviewService.refuseFt(ftId, upsertFtReviewsDto, req.user);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission("affect-volunteer")
  @Post(":ftId/assignment-approval")
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: "Switch FT to ready for assignement",
    type: CompleteFtResponseDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "FT id",
    required: true,
  })
  @ApiBody({
    type: TimeSpanParametersRequestDto,
    description: "Time span parameters",
  })
  assignmentApproval(
    @Param("ftId", ParseIntPipe) ftId: number,
    @Request() req: RequestWithUserPayload,
    @Body() timeSpanParameters: TimeSpanParametersRequestDto,
  ): Promise<CompleteFtResponseDto | null> {
    return this.ftReviewService.assignmentApproval(
      ftId,
      req.user.userId,
      timeSpanParameters,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission("validate-ft")
  @Delete(":ftId/reviews/:teamCode")
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "Remove a review",
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "FT id",
    required: true,
  })
  @ApiParam({
    name: "teamCode",
    type: String,
    description: "Team code of review",
    required: true,
  })
  remove(
    @Param("ftId", ParseIntPipe) ftId: number,
    @Param("teamCode") teamCode: string,
  ): Promise<void> {
    return this.ftReviewService.remove(ftId, teamCode);
  }
}
