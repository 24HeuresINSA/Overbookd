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
import { CompleteFtResponseDto } from 'src/ft/dto/ft-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpsertFtReviewsDto } from './dto/upsertFtReviews.dto';
import { FtReviewsService } from './ft_reviews.service';

@ApiBearerAuth()
@ApiTags('ft')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller('ft')
export class FtReviewsController {
  constructor(private readonly ftReviewsService: FtReviewsService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('ft-validator')
  @Post(':ftId/validation/:teamId')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Validate a FT',
    type: CompleteFtResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Request is not formated as expected',
  })
  @ApiForbiddenResponse({
    description: "Can't find a requested resource",
  })
  @ApiParam({
    name: 'ftId',
    type: Number,
    description: 'FT id',
    required: true,
  })
  @ApiParam({
    name: 'teamCode',
    type: Number,
    description: 'validator team code',
    required: true,
  })
  @ApiBody({
    type: UpsertFtReviewsDto,
    description: 'FT to validate',
  })
  upsert(
    @Param('ftId', ParseIntPipe) ftId: number,
    @Param('teamCode') teamCode: string,
    @Body() upsertFtReviewsDto: UpsertFtReviewsDto,
  ): Promise<CompleteFtResponseDto | null> {
    return this.ftReviewsService.validateFt(ftId, teamCode, upsertFtReviewsDto);
  }
}
