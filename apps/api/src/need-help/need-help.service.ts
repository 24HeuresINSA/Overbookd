import { Inject, Injectable } from '@nestjs/common';
import { Period } from '@overbookd/period';
import { Volunteer } from './need-help.model';

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
