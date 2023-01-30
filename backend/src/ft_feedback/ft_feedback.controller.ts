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
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FtFeedbackResponseDto } from './dto/ftFeedbackResponse.dto';
import { CreateFtFeedbackDto } from './dto/createFtFeedback.dto';
import { FtFeedbackService } from './ft_feedback.service';

@ApiBearerAuth()
@ApiTags('ft')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller('ft')
export class FtFeedbackController {
  constructor(private readonly ftFeedbacksService: FtFeedbackService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post(':ftId/feedbacks')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The ft feedbacks have been successfully created.',
    type: FtFeedbackResponseDto,
  })
  @ApiParam({
    name: 'ftId',
    type: Number,
    description: 'FT id',
    required: true,
  })
  @ApiBody({
    type: CreateFtFeedbackDto,
    description: 'FT feedback to create',
  })
  create(
    @Param('ftId', ParseIntPipe) ftId: number,
    @Body() createFtFeedbacksDto: CreateFtFeedbackDto,
  ): Promise<FtFeedbackResponseDto> {
    return this.ftFeedbacksService.create(ftId, createFtFeedbacksDto);
  }
}
