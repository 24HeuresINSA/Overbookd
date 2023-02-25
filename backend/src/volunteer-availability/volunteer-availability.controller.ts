import {
  Body,
  Controller,
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
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PeriodDto } from './dto/period.dto';
import { VolunteerAvailabilityService } from './volunteer-availability.service';

@ApiBearerAuth()
@ApiTags('volunteer-availability')
@ApiBadRequestResponse({
  description: 'Request is not formated as expected.',
})
@ApiForbiddenResponse({
  description: 'User is not allowed to access this resource.',
})
@Controller('volunteer-availability')
export class VolunteerAvailabilityController {
  constructor(
    private readonly volunteerAvailabilityService: VolunteerAvailabilityService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':userId')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: "Volunteer's availability periods successfully created.",
    type: PeriodDto,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @ApiBody({
    type: PeriodDto,
    description: 'The availability periods to add.',
    isArray: true,
  })
  @ApiParam({
    name: 'userId',
    description: 'The id of the user to add the availability periods to.',
    type: Number,
    required: true,
  })
  add(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() periods: PeriodDto[],
  ): Promise<PeriodDto[]> {
    return this.volunteerAvailabilityService.addAvailabilities(userId, periods);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: "Volunteer's availability periods",
    type: PeriodDto,
    isArray: true,
  })
  @ApiParam({
    name: 'userId',
    description: 'The id of the user to retrieve the availability periods of.',
    type: Number,
    required: true,
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  findOne(@Param('userId', ParseIntPipe) userId: number): Promise<PeriodDto[]> {
    return this.volunteerAvailabilityService.findUserAvailabilities(userId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Patch(':userId')
  @HttpCode(201)
  @ApiParam({
    name: 'userId',
    description: 'The id of the user to add the availability periods to.',
    type: Number,
    required: true,
  })
  @ApiBody({
    type: PeriodDto,
    description: 'The availability periods to add.',
    isArray: true,
  })
  @ApiResponse({
    status: 201,
    description: "Volunteer's availability periods successfully created.",
    type: PeriodDto,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  overrideHuman(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() periods: PeriodDto[],
  ): Promise<PeriodDto[]> {
    return this.volunteerAvailabilityService.addAvailabilitiesWithoutCheck(
      userId,
      periods,
    );
  }
}
