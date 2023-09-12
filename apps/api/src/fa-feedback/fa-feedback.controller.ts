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
import { CreateFaFeedbackRequestDto } from "./dto/create-fa-feedback.request.dto";
import { FaFeedbackResponseDto } from "./dto/fa-feedback.response.dto";
import { FaFeedbackService } from "./fa-feedback.service";
import { WRITE_FA } from "@overbookd/permission";

@ApiBearerAuth()
@ApiTags("fa")
@ApiBadRequestResponse({
  description: "Request is not formated as expected",
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller("fa")
export class FaFeedbackController {
  constructor(private readonly faFeedbackService: FaFeedbackService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission(WRITE_FA)
  @Post(":faId/feedback")
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: "The fa feedback have been successfully created.",
    type: FaFeedbackResponseDto,
  })
  @ApiParam({
    name: "faId",
    type: Number,
    description: "FA id",
    required: true,
  })
  @ApiBody({
    type: CreateFaFeedbackRequestDto,
    description: "FA feedback to create",
  })
  create(
    @Param("faId", ParseIntPipe) faId: number,
    @Body() feedback: CreateFaFeedbackRequestDto,
  ): Promise<FaFeedbackResponseDto> {
    return this.faFeedbackService.create(faId, feedback);
  }
}
