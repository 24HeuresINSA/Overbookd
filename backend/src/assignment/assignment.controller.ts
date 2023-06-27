import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
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
import { AssignmentService, AssignmentStats } from './assignment.service';
import {
  AssignmentRequestDto,
  UpdateAssignedTeamRequestDto,
} from './dto/assignmentRequest.dto';
import { AssignmentResponseDto } from './dto/assignmentResponse.dto';
import { AssignmentStatsResponseDto } from './dto/assignmentsStatsResponse.dto';
import {
  FtTimeSpanResponseDto,
  FtWithTimeSpansResponseDto,
  TimeSpanWithFtResponseDto,
  TimespanWithAssigneesResponseDto,
} from './dto/ftTimeSpanResponse.dto';
import {
  AvailableVolunteerResponseDto,
  VolunteerResponseDto,
} from './dto/volunteerResponse.dto';
import { FtTimeSpanService } from './ftTimeSpan.service';
import { TimeSpan, TimeSpanWithAssignees } from './types/ftTimeSpanTypes';
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
    private readonly ftTimeSpanService: FtTimeSpanService,
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
    type: FtWithTimeSpansResponseDto,
  })
  findAllFtTimespans(): Promise<FtWithTimeSpansResponseDto[]> {
    return this.ftTimeSpanService.findAllFtsWithTimespans();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @Permission('can-affect')
  @Get('stats')
  @ApiResponse({
    status: 200,
    description: 'Get assignments stats for all volunteers',
    isArray: true,
    type: AssignmentStatsResponseDto,
  })
  async getVolunteerAssignmentStats(): Promise<AssignmentStats[]> {
    return this.assignmentService.getVolunteersAssignmentStats();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Get('ft/:ftId')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get ft with timespans and stats',
    isArray: true,
    type: FtTimeSpanResponseDto,
  })
  findFtTimespans(
    @Param('ftId', ParseIntPipe) ftId: number,
  ): Promise<TimeSpan[]> {
    return this.ftTimeSpanService.findTimespansForFt(ftId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Get('volunteer/:volunteerId/ft-timespans')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get ft timespans available for volunteer',
    isArray: true,
    type: TimeSpanWithFtResponseDto,
  })
  findFtTimespansAvailableForVolunteer(
    @Param('volunteerId', ParseIntPipe) volunteerId: number,
  ): Promise<TimeSpanWithFtResponseDto[]> {
    return this.ftTimeSpanService.findTimespansWithFtWhereVolunteerIsAssignableTo(
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
  @Permission('hard')
  @Get('ft-timespans/:timespanId')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get timespan details',
    type: TimespanWithAssigneesResponseDto,
  })
  findTimespanDetails(
    @Param('timespanId', ParseIntPipe) timespanId: number,
  ): Promise<TimeSpanWithAssignees> {
    return this.ftTimeSpanService.findTimespanWithAssignees(timespanId);
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
    @Body() { volunteers, timespanId }: AssignmentRequestDto,
  ): Promise<AssignmentResponseDto[]> {
    return this.assignmentService.assignVolunteersToTimespan(
      volunteers,
      timespanId,
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
    return this.assignmentService.unassignVolunteerToTimeSpan(
      assigneeId,
      timespanId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Patch('ft-timespans/:timespanId/assignees/:assigneeId/affected-team')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Update assigned team for assignee',
    type: AssignmentResponseDto,
  })
  updateAssignedTeam(
    @Param('timespanId', ParseIntPipe) timespanId: number,
    @Param('assigneeId', ParseIntPipe) assigneeId: number,
    @Body() { team }: UpdateAssignedTeamRequestDto,
  ): Promise<AssignmentResponseDto> {
    return this.assignmentService.updateAssignedTeam(
      timespanId,
      assigneeId,
      team,
    );
  }
}
