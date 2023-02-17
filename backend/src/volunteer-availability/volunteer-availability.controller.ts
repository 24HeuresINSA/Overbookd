import { Controller } from '@nestjs/common';
import { VolunteerAvailabilityService } from './volunteer-availability.service';

@Controller('volunteer-availability')
export class VolunteerAvailabilityController {
  constructor(
    private readonly volunteerAvailabilityService: VolunteerAvailabilityService,
  ) {}
}
