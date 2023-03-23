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
import { FtTimespanResponseDto } from './dto/ftTimespanResponse.dto';
import { VolunteerResponseDto } from './dto/volunteerResponse.dto';
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
    type: VolunteerResponseDto,
  })
  findAllVolunteers(): Promise<VolunteerResponseDto[]> {
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
    type: FtTimespanResponseDto,
  })
  findAllFtTimespans(): Promise<FtTimespanResponseDto[]> {
    return this.ftTimespanService.findAllFtTimespans();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Get('volunteer/:id/ft-timespans')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get ft timespans available for volunteer',
    isArray: true,
    type: FtTimespanResponseDto,
  })
  findFtTimespansAvailableForVolunteer(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FtTimespanResponseDto[]> {
    return this.ftTimespanService.findFtTimespansAvailableForVolunteer(id);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Get('ft-timespan/:id/volunteers')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get volunteers available for ft timespan',
    isArray: true,
    type: VolunteerResponseDto,
  })
  findAvailableVolunteersForFtTimespan(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<VolunteerResponseDto[]> {
    return this.volunteerService.findAvailableVolunteersForFtTimespan(id);
  }
}
