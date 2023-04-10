import {
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  UseGuards,
  Controller,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import {
  FtTimespanResponseDto,
  FtWithTimespansResponseDto,
  TimespanWithFtResponseDto,
} from './dto/ftTimespanResponse.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { VolunteerService } from './volunteer.service';
import { AssignmentService } from './assignment.service';
import { FtTimespanService } from './ftTimespan.service';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import {
  AvailableVolunteerResponseDto,
  VolunteerResponseDto,
} from './dto/volunteerResponse.dto';
import { AssignmentRequestDto } from './dto/assignmentRequest.dto';
import { AssignmentResponseDto } from './dto/assignmentResponse.dto';
import { Timespan } from './types/ftTimespanTypes';

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

  @Post()
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Affect volunteers to timespan as team member',
    type: AssignmentResponseDto,
  })
  assignVolunteerToTimeSpan(
    @Body() { volunteerId, timespanId, teamCode }: AssignmentRequestDto,
  ): Promise<AssignmentResponseDto> {
    return this.assignmentService.assignVolunteerToTimespan(
      volunteerId,
      timespanId,
      teamCode,
    );
  }
}
