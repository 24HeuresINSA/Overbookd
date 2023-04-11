import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
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
import { AssignmentRequestDto } from './dto/assignmentRequest.dto';
import { AssignmentResponseDto } from './dto/assignmentResponse.dto';
import {
  FtTimespanResponseDto,
  FtWithTimespansResponseDto,
  TimespanWithAssigneesResponseDto,
  TimespanWithFtResponseDto,
} from './dto/ftTimespanResponse.dto';
import {
  AvailableVolunteerResponseDto,
  VolunteerResponseDto,
} from './dto/volunteerResponse.dto';
import { FtTimespanService } from './ftTimespan.service';
import { Timespan, TimespanWithAssignees } from './types/ftTimespanTypes';
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
    description: 'Get all valid ft with timespans',
    isArray: true,
    type: FtWithTimespansResponseDto,
  })
  findAllFtTimespans(): Promise<FtWithTimespansResponseDto[]> {
    return this.ftTimespanService.findAllFtsWithTimespans();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Get('ft/:ftId')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get ft with timespans and stats',
    isArray: true,
    type: FtTimespanResponseDto,
  })
  findFtTimespans(
    @Param('ftId', ParseIntPipe) ftId: number,
  ): Promise<Timespan[]> {
    return this.ftTimespanService.findTimespansForFt(ftId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Get('volunteer/:volunteerId/ft-timespans')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get ft timespans available for volunteer',
    isArray: true,
    type: TimespanWithFtResponseDto,
  })
  findFtTimespansAvailableForVolunteer(
    @Param('volunteerId', ParseIntPipe) volunteerId: number,
  ): Promise<TimespanWithFtResponseDto[]> {
    return this.ftTimespanService.findTimespansWithFtWhereVolunteerIsAssignableTo(
      volunteerId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Get('ft-timespans/:timespanId/volunteers')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get volunteers available for ft timespan',
    isArray: true,
    type: AvailableVolunteerResponseDto,
  })
  findAvailableVolunteersForFtTimespan(
    @Param('timespanId', ParseIntPipe) timespanId: number,
  ): Promise<AvailableVolunteerResponseDto[]> {
    return this.volunteerService.findAvailableVolunteersForFtTimespan(
      timespanId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Get('ft-timespans/:timespanId')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get timespan details',
    type: TimespanWithAssigneesResponseDto,
  })
  findTimespanDetails(
    @Param('timespanId', ParseIntPipe) timespanId: number,
  ): Promise<TimespanWithAssignees> {
    return this.ftTimespanService.findTimespanWithAssignees(timespanId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Get('ft-timespans/:timespanId/volunteers/:volunteerId/available-friends')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Get volunteer's friends available for ft timespan",
    isArray: true,
    type: VolunteerResponseDto,
  })
  findAvailableVolunteerFriendsForFtTimespan(
    @Param('timespanId', ParseIntPipe) timespanId: number,
    @Param('volunteerId', ParseIntPipe) volunteerId: number,
  ): Promise<VolunteerResponseDto[]> {
    return this.volunteerService.findAvailableVolunteerFriendsForFtTimespan(
      timespanId,
      volunteerId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Affect volunteers to timespan as team member',
    type: AssignmentResponseDto,
  })
  assignVolunteerToTimespan(
    @Body() { volunteerId, timespanId, teamCode }: AssignmentRequestDto,
  ): Promise<AssignmentResponseDto> {
    return this.assignmentService.assignVolunteerToTimespan(
      volunteerId,
      timespanId,
      teamCode,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Delete('ft-timespans/:timespanId/volunteers/:assigneeId')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Unaffect volunteers from timespan',
  })
  unassignVolunteerToTimespan(
    @Param('timespanId', ParseIntPipe) timespanId: number,
    @Param('assigneeId', ParseIntPipe) assigneeId: number,
  ) {
    return this.assignmentService.unassignVolunteerToTimespan(
      assigneeId,
      timespanId,
    );
  }
}
