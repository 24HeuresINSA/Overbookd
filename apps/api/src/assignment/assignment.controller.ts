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
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { Permission } from '../authentication/permissions-auth.decorator';
import { PermissionsGuard } from '../authentication/permissions-auth.guard';
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
  TimeSpanWithAssigneesResponseDto,
  TimeSpanWithFtResponseDto,
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
    description: 'Get all valid ft with time spans',
    isArray: true,
    type: FtWithTimeSpansResponseDto,
  })
  findAllFtTimeSpans(): Promise<FtWithTimeSpansResponseDto[]> {
    return this.ftTimeSpanService.findAllFtsWithTimeSpans();
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
    description: 'Get ft with time spans and stats',
    isArray: true,
    type: FtTimeSpanResponseDto,
  })
  findFtTimeSpans(
    @Param('ftId', ParseIntPipe) ftId: number,
  ): Promise<TimeSpan[]> {
    return this.ftTimeSpanService.findTimeSpansForFt(ftId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Get('volunteer/:volunteerId/ft-timespans')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get ft time spans available for volunteer',
    isArray: true,
    type: TimeSpanWithFtResponseDto,
  })
  findFtTimeSpansAvailableForVolunteer(
    @Param('volunteerId', ParseIntPipe) volunteerId: number,
  ): Promise<TimeSpanWithFtResponseDto[]> {
    return this.ftTimeSpanService.findTimeSpansWithFtWhereVolunteerIsAssignableTo(
      volunteerId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Get('ft-timespans/:timeSpanId/volunteers')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get volunteers available for ft time span',
    isArray: true,
    type: AvailableVolunteerResponseDto,
  })
  findAvailableVolunteersForFtTimeSpan(
    @Param('timeSpanId', ParseIntPipe) timeSpanId: number,
  ): Promise<AvailableVolunteerResponseDto[]> {
    return this.volunteerService.findAvailableVolunteersForFtTimeSpan(
      timeSpanId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get('ft-timespans/:timeSpanId')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get time span details',
    type: TimeSpanWithAssigneesResponseDto,
  })
  findTimeSpanDetails(
    @Param('timeSpanId', ParseIntPipe) timeSpanId: number,
  ): Promise<TimeSpanWithAssignees> {
    return this.ftTimeSpanService.findTimeSpanWithAssignees(timeSpanId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Get('ft-timespans/:timeSpanId/volunteers/:volunteerId/available-friends')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Get volunteer's friends available for ft time span",
    isArray: true,
    type: VolunteerResponseDto,
  })
  findAvailableVolunteerFriendsForFtTimeSpan(
    @Param('timeSpanId', ParseIntPipe) timeSpanId: number,
    @Param('volunteerId', ParseIntPipe) volunteerId: number,
  ): Promise<VolunteerResponseDto[]> {
    return this.volunteerService.findAvailableVolunteerFriendsForFtTimeSpan(
      timeSpanId,
      volunteerId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Affect volunteers to time span as team member',
    type: AssignmentResponseDto,
  })
  assignVolunteerToTimeSpan(
    @Body() { volunteers, timeSpanId }: AssignmentRequestDto,
  ): Promise<AssignmentResponseDto[]> {
    return this.assignmentService.assignVolunteersToTimeSpan(
      volunteers,
      timeSpanId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Delete('ft-timespans/:timeSpanId/volunteers/:assigneeId')
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: 'Unaffect volunteers from time span',
  })
  unassignVolunteerToTimeSpan(
    @Param('timeSpanId', ParseIntPipe) timeSpanId: number,
    @Param('assigneeId', ParseIntPipe) assigneeId: number,
  ) {
    return this.assignmentService.unassignVolunteerToTimeSpan(
      assigneeId,
      timeSpanId,
    );
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Patch('ft-timespans/:timeSpanId/assignees/:assigneeId/affected-team')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Update assigned team for assignee',
    type: AssignmentResponseDto,
  })
  updateAssignedTeam(
    @Param('timeSpanId', ParseIntPipe) timeSpanId: number,
    @Param('assigneeId', ParseIntPipe) assigneeId: number,
    @Body() { team }: UpdateAssignedTeamRequestDto,
  ): Promise<AssignmentResponseDto> {
    return this.assignmentService.updateAssignedTeam(
      timeSpanId,
      assigneeId,
      team,
    );
  }
}
