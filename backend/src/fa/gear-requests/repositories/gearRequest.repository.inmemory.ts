import { NotFoundException } from '@nestjs/common';
import {
  GearRequest,
  GearRequestIdentifier,
  GearRequestRepository,
  SearchGearRequest,
} from '../gearRequests.service';

export class InMemoryGearRequestRepository implements GearRequestRepository {
  gearRequests: GearRequest[];

  constructor(gearRequests: GearRequest[]) {
    this.gearRequests = gearRequests;
  }

  addGearRequest(gearRequest: GearRequest): Promise<GearRequest> {
    this.gearRequests = [...this.gearRequests, gearRequest];
    return Promise.resolve(gearRequest);
  }

  getGearRequest(gearRequestId: GearRequestIdentifier): Promise<GearRequest> {
    const gearRequest = this.gearRequests.find(
      (gearRequest) =>
        gearRequest.seeker.type === gearRequestId.seeker.type &&
        gearRequest.seeker.id === gearRequestId.seeker.id &&
        gearRequest.gear.id === gearRequestId.gearId,
    );
    if (!gearRequest)
      return Promise.reject(
        new NotFoundException(
          `Request for gear #${gearRequestId.gearId} from ${gearRequestId.seeker.type} #${gearRequest.seeker.id} not found`,
        ),
      );
    return Promise.resolve(gearRequest);
  }

  getGearRequests(
    gearRequestSearch: SearchGearRequest,
  ): Promise<GearRequest[]> {
    return Promise.resolve(
      this.gearRequests.filter((gearRequest) =>
        this.isMatchingSearch(gearRequestSearch, gearRequest),
      ),
    );
  }

  private isMatchingSearch(
    gearRequestSearch: SearchGearRequest,
    gearRequest: GearRequest,
  ): boolean {
    return (
      !gearRequestSearch.seeker ||
      (gearRequestSearch.seeker.id === gearRequest.seeker.id &&
        gearRequestSearch.seeker.type === gearRequest.seeker.type)
    );
  }
}
