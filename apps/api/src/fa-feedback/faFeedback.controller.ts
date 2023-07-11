import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permission } from '../../src/auth/permissions-auth.decorator';
import { PermissionsGuard } from '../../src/auth/permissions-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFaFeedbackDto } from './dto/createFaFeedback.dto';
import { FaFeedbackResponseDto } from './dto/faFeedbackResponse.dto';
import { FaFeedbackService } from './faFeedback.service';

@ApiBearerAuth()
@ApiTags('fa')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller('fa')
export class FaFeedbackController {
  constructor(private readonly faFeedbackService: FaFeedbackService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post(':faId/feedback')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The fa feedback have been successfully created.',
    type: FaFeedbackResponseDto,
  })
  @ApiParam({
    name: 'faId',
    type: Number,
    description: 'FA id',
    required: true,
  })
  @ApiBody({
    type: CreateFaFeedbackDto,
    description: 'FA feedback to create',
  })
  create(
    @Param('faId', ParseIntPipe) faId: number,
    @Body() feedback: CreateFaFeedbackDto,
  ): Promise<FaFeedbackResponseDto> {
    return this.faFeedbackService.create(faId, feedback);
  }
}
