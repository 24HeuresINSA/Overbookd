import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { GearRequestResponseDto } from './dto/gearRequestResponse.dto';
import { GearRequestsService } from './gearRequests.service';

@ApiBearerAuth()
@ApiTags('gear-requests')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller('gear-requests')
export class GearRequestsController {
  constructor(private readonly gearRequestService: GearRequestsService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get('')
  @ApiResponse({
    status: 200,
    description: 'Get all events gear requests',
    isArray: true,
    type: GearRequestResponseDto,
  })
  getAll(): Promise<GearRequestResponseDto[]> {
    return this.gearRequestService.getAllRequests();
  }
}
