import {
  Body,
  Controller,
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
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateVolunteerAvailabilityDto } from './dto/createVolunteerAvailability.dto';
import { VolunteerAvailabilityResponseDto } from './dto/volunteerAvailabilityResponse.dto';
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
    description: 'The record has been successfully created.',
    type: VolunteerAvailabilityResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  add(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() periods: CreateVolunteerAvailabilityDto,
  ): Promise<VolunteerAvailabilityResponseDto> {
    return this.volunteerAvailabilityService.addAvailabilities(userId, periods);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The records have been successfully retrieved.',
    type: VolunteerAvailabilityResponseDto,
    isArray: true,
  })
  findAll(): Promise<VolunteerAvailabilityResponseDto[]> {
    return this.volunteerAvailabilityService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully retrieved.',
    type: VolunteerAvailabilityResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  findOne(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<VolunteerAvailabilityResponseDto> {
    return this.volunteerAvailabilityService.findUserAvailabilities(userId);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('can-affect')
  @Post(':userId/human')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: VolunteerAvailabilityResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  overrideHuman(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() periods: CreateVolunteerAvailabilityDto,
  ): Promise<VolunteerAvailabilityResponseDto> {
    return this.volunteerAvailabilityService.addAvailabilities(
      userId,
      periods,
      true,
    );
  }
}
