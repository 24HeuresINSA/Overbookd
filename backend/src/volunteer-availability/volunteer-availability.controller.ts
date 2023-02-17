import {
  Body,
  Controller,
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
}
