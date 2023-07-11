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
import { CreateFtFeedbackDto } from './dto/createFtFeedback.dto';
import { FtFeedbackResponseDto } from './dto/ftFeedbackResponse.dto';
import { FtFeedbackService } from './ftFeedback.service';

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
  constructor(private readonly ftFeedbackService: FtFeedbackService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post(':ftId/feedback')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The ft feedback have been successfully created.',
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
    @Body() feedback: CreateFtFeedbackDto,
  ): Promise<FtFeedbackResponseDto> {
    return this.ftFeedbackService.create(ftId, feedback);
  }
}
