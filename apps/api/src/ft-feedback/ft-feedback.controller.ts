import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
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
import { Permission } from "../authentication/permissions-auth.decorator";
import { PermissionsGuard } from "../authentication/permissions-auth.guard";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { CreateFtFeedbackRequestDto } from "./dto/create-ft-feedback.request.dto";
import { FtFeedbackResponseDto } from "./dto/ft-feedback.response.dto";
import { FtFeedbackService } from "./ft-feedback.service";
import { WRITE_FT } from "@overbookd/permission";

@ApiBearerAuth()
@ApiTags("ft")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller("ft")
export class FtFeedbackController {
  constructor(private readonly ftFeedbackService: FtFeedbackService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FT)
  @Post(":ftId/feedback")
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: "The ft feedback have been successfully created.",
    type: FtFeedbackResponseDto,
  })
  @ApiParam({
    name: "ftId",
    type: Number,
    description: "FT id",
    required: true,
  })
  @ApiBody({
    type: CreateFtFeedbackRequestDto,
    description: "FT feedback to create",
  })
  create(
    @Param("ftId", ParseIntPipe) ftId: number,
    @Body() feedback: CreateFtFeedbackRequestDto,
  ): Promise<FtFeedbackResponseDto> {
    return this.ftFeedbackService.create(ftId, feedback);
  }
}
