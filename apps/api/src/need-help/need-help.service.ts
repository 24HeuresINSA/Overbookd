import { Inject, Injectable } from '@nestjs/common';
import { IProvidePeriod } from '@overbookd/period';
import { Volunteer } from './need-help.model';

export interface VolunteerRepository {
  findAvailableOnPeriod(period: IProvidePeriod): Promise<Volunteer[]>;
}

@Injectable()
export class NeedHelpService {
  constructor(
    @Inject('VOLUNTEER_REPOSITORY')
    private readonly volunteerRepo: VolunteerRepository,
  ) {}

  getAvailableVolunteers(period: IProvidePeriod): Promise<Volunteer[]> {
    return this.volunteerRepo.findAvailableOnPeriod(period);
  }
}
