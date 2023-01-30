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
import { FtFeedbacksResponseDto } from './dto/ftFeedbacksResponse.dto';
import { CreateFtFeedbacksDto } from './dto/createFtFeedbacks.dto';
import { FtFeedbacksService } from './ft_feedbacks.service';

@ApiBearerAuth()
@ApiTags('ft')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller('ft')
export class FtFeedbacksController {
  constructor(private readonly ftFeedbacksService: FtFeedbacksService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post(':ftId/feedbacks')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The ft feedbacks have been successfully created.',
    type: FtFeedbacksResponseDto,
  })
  @ApiParam({
    name: 'ftId',
    type: Number,
    description: 'FT id',
    required: true,
  })
  @ApiBody({
    type: CreateFtFeedbacksDto,
    description: 'FT feedback to create',
  })
  create(
    @Param('ftId', ParseIntPipe) ftId: number,
    @Body() createFtFeedbacksDto: CreateFtFeedbacksDto,
  ): Promise<FtFeedbacksResponseDto> {
    return this.ftFeedbacksService.create(ftId, createFtFeedbacksDto);
  }
}
