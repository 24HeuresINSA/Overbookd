import { Controller, Get, Param, UseGuards } from '@nestjs/common';
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
  @Get(':selectedDay')
  @ApiResponse({
    status: 200,
    description: 'Get all permissions',
    type: OrgaNeedsResponseDto,
    isArray: true,
  })
  async getOrgaNeeds(
    @Param('selectedDay') selectedDay: Date,
  ): Promise<OrgaNeedsResponseDto[]> {
    return this.orgaNeedsService.orgaNeeds(selectedDay);
  }
}
