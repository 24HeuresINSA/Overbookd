import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
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
import { AssignmentService } from './assignment.service';
import { VolunteerResponse } from './dto/volunteerResponse';

ApiBearerAuth();
@ApiTags('assignment')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permission('can-affect')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Get('volunteers')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get all valid volunteers',
    isArray: true,
    type: VolunteerResponse,
  })
  findAllVolunteers(): Promise<VolunteerResponse[]> {
    return this.assignmentService.findAllVolunteers();
  }
}
