import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
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
import { FtTimespan } from './dto/ftTimespanResponse';
import { VolunteerResponse } from './dto/volunteerResponse';
import { FtTimespanService } from './ftTimespan.service';
import { VolunteerService } from './volunteer.service';

@ApiBearerAuth()
@ApiTags('assignments')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected',
})
@ApiForbiddenResponse({
  description: "User can't access this resource",
})
@Controller('assignments')
export class AssignmentController {
  constructor(
    private readonly assignmentService: AssignmentService,
    private readonly volunteerService: VolunteerService,
    private readonly ftTimespanService: FtTimespanService,
  ) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Get('volunteers')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get all valid volunteers',
    isArray: true,
    type: VolunteerResponse,
  })
  findAllVolunteers(): Promise<VolunteerResponse[]> {
    return this.volunteerService.findAllVolunteers();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Get('ft-timespans')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get all valid ft timespans',
    isArray: true,
    type: FtTimespan,
  })
  findAllFtTimespans(): Promise<FtTimespan[]> {
    return this.ftTimespanService.findAllFtTimespans();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Get('volunteers/:id/ft-timespans')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get ft timespans available for volunteer',
    isArray: true,
    type: FtTimespan,
  })
  findFtTimespansAvailableForVolunteer(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FtTimespan[]> {
    return this.ftTimespanService.findFtTimespansAvailableForVolunteer(id);
  }
}
