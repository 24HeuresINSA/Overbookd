import { NotFoundException } from '@nestjs/common';
import {
  GearRequest,
  GearRequestIdentifier,
  GearRequestRepository,
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
        gearRequest.gearId === gearRequestId.gearId,
    );
    if (!gearRequest)
      return Promise.reject(
        new NotFoundException(
          `Request for gear #${gearRequestId.gearId} from ${gearRequestId.seeker.type} #${gearRequest.seeker.id} not found`,
        ),
      );
    return Promise.resolve(gearRequest);
  }
}
