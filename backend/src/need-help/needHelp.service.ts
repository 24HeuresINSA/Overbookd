import { Inject, Injectable } from '@nestjs/common';
import { Period } from 'src/volunteer-availability/domain/period.model';
import { Volunteer } from './needHelp.model';

export interface VolunteerRepository {
  findAvailableOnPeriod(period: Period): Promise<Volunteer[]>;
}

@Injectable()
export class NeedHelpService {
  constructor(
    @Inject('VOLUNTEER_REPOSITORY')
    private readonly volunteerRepo: VolunteerRepository,
  ) {}

  getAvailableVolunteers(period: Period): Promise<Volunteer[]> {
    return this.volunteerRepo.findAvailableOnPeriod(period);
  }
}
