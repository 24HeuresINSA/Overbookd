import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrgaNeedsService } from './orga-needs.service';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { OrgaNeedsResponseDto } from './dto/orga-needs-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { OrgaNeedsRequestDto } from './dto/orga-needs-request.dto';

@ApiTags('orga-needs')
@Controller('orga-needs')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class OrgaNeedsController {
  constructor(private readonly orgaNeedsService: OrgaNeedsService) {}

  @Permission('hard')
  @Post()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Returns the needs for a given day per 15 minutes interval',
    type: OrgaNeedsResponseDto,
    isArray: true,
  })
  async getOrgaNeeds(
    @Body() period: OrgaNeedsRequestDto,
  ): Promise<OrgaNeedsResponseDto[]> {
    return this.orgaNeedsService.computeOrgaStats(period);
  }
}
