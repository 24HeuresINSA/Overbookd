import { NotFoundException } from '@nestjs/common';
import {
  CreateGearRequestForm,
  GearRequest,
  GearRequestIdentifier,
  GearRequestRepository,
  SearchGearRequest,
  UpdateGearRequestForm,
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
      this.isSameGearRequest(gearRequestId),
    );
    if (!gearRequest)
      return Promise.reject(
        new NotFoundException(
          `Request for gear #${gearRequestId.gearId} from ${gearRequestId.seeker.type} #${gearRequest.seeker.id} not found`,
        ),
      );
    return Promise.resolve(gearRequest);
  }

  private isSameGearRequest(
    gearRequestId: GearRequestIdentifier,
  ): (value: GearRequest, index: number, obj: GearRequest[]) => unknown {
    return function (gearRequest) {
      return (
        gearRequest.seeker.type === gearRequestId.seeker.type &&
        gearRequest.seeker.id === gearRequestId.seeker.id &&
        gearRequest.gear.id === gearRequestId.gearId
      );
    };
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

  async updateGearRequest(
    gearRequestId: GearRequestIdentifier,
    updateGearRequestForm: UpdateGearRequestForm,
  ): Promise<GearRequest> {
    const gearRequestIndex = this.gearRequests.findIndex(
      this.isSameGearRequest(gearRequestId),
    );
    if (gearRequestIndex === -1) {
      return Promise.reject(
        new NotFoundException(
          `Request for gear #${gearRequestId.gearId} from ${gearRequestId.seeker.type} #${gearRequestId.seeker.id} not found`,
        ),
      );
    }
    const newGearRequest = this.mergePreviousAndNewGearRequest(
      gearRequestIndex,
      updateGearRequestForm,
    );
    this.gearRequests[gearRequestIndex] = newGearRequest;
    return newGearRequest;
  }

  private mergePreviousAndNewGearRequest(
    gearRequestIndex: number,
    updateGearRequestForm: UpdateGearRequestForm,
  ) {
    const previousGearRequest = this.gearRequests[gearRequestIndex];
    const quantity = updateGearRequestForm.quantity
      ? { quantity: updateGearRequestForm.quantity }
      : { quantity: previousGearRequest.quantity };
    const startRentalPeriod = updateGearRequestForm.start
      ? { start: updateGearRequestForm.start }
      : { start: previousGearRequest.rentalPeriod.start };
    const endRentalPeriod = updateGearRequestForm.end
      ? { end: updateGearRequestForm.end }
      : { end: previousGearRequest.rentalPeriod.end };
    const rentalPeriod = {
      rentalPeriod: { ...startRentalPeriod, ...endRentalPeriod },
    };
    const newGearRequest = {
      ...previousGearRequest,
      ...quantity,
      ...rentalPeriod,
    };
    return newGearRequest;
  }
}
