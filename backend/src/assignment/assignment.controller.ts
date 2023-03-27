import {
  Get,
  Post,
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
  FtWithTimespansResponseDto,
  TimespanWithFtResponseDto,
} from './dto/ftTimespanResponse.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { VolunteerService } from './volunteer.service';
import { AssignmentService } from './assignment.service';
import { FtTimespanService } from './ftTimespan.service';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { VolunteerResponseDto } from './dto/volunteerResponse.dto';
import { AssignmentResponseDto } from './dto/AssignmentResponseDto';

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
  @Get('ft-timespan/:timespanId/volunteers')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get volunteers available for ft timespan',
    isArray: true,
    type: VolunteerResponseDto,
  })
  findAvailableVolunteersForFtTimespan(
    @Param('timespanId', ParseIntPipe) timespanId: number,
  ): Promise<VolunteerResponseDto[]> {
    return this.volunteerService.findAvailableVolunteersForFtTimespan(
      timespanId,
    );
  }

  @Post(':volonteerId/timespan/:timespanId')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Affect volunteers to time windows',
    type: AssignmentResponseDto,
  })
  affectVolunteersToTimeSpan(
    @Param('timespanId', ParseIntPipe) timespanId: number,
    @Param('volonteerId', ParseIntPipe) volonteerId: number,
  ): Promise<AssignmentResponseDto> {
    return this.assignmentService.affectVolunteersToTimeSpan(
      volonteerId,
      timespanId,
    );
  }
}
