import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { TimelineResponseDto } from './dto/timelineResponse.dto';
import { TimelineService } from './timeline.service';

@ApiBearerAuth()
@ApiTags('timeline')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@ApiNotFoundResponse({
  description: 'Resource not found',
})
@Controller('timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Get()
  @HttpCode(200)
  @ApiQuery({
    name: 'start',
    required: true,
    description: 'The start of timelines',
    type: Date,
  })
  @ApiQuery({
    name: 'end',
    required: true,
    description: 'The end of timelines',
    type: Date,
  })
  @ApiResponse({
    status: 200,
    description: 'The timeline has been successfully retrieved.',
    type: TimelineResponseDto,
    isArray: true,
  })
  async getTimelines(
    @Query('start') start: Date,
    @Query('end') end: Date,
  ): Promise<TimelineResponseDto[]> {
    return this.timelineService.getTimelines(new Date(start), new Date(end));
  }
}
