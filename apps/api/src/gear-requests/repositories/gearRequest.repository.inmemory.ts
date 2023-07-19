import { updateItemToList } from '@overbookd/list';
import { GearRequestNotFound } from '../gearRequest.error';
import {
  APPROVED,
  ApprovedGearRequest,
  buildGearRequestIdentifier,
  GearRequest,
  GearRequestIdentifier,
  isSameGeaRequestIdentifier,
  MultiOperandGearRequest,
  PENDING,
  Period,
  SearchGearRequest,
  UpdateGearRequestForm,
} from '../gearRequests.model';
import { GearRequestRepository } from '../gearRequests.service';

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
      return Promise.reject(new GearRequestNotFound(gearRequestId));
    return Promise.resolve(gearRequest);
  }

  private isSameGearRequest(
    gearRequestId: GearRequestIdentifier,
  ): (value: GearRequest, index: number, obj: GearRequest[]) => unknown {
    return function (gearRequest) {
      return (
        gearRequest.seeker.type === gearRequestId.seeker.type &&
        gearRequest.seeker.id === gearRequestId.seeker.id &&
        gearRequest.gear.id === gearRequestId.gearId &&
        gearRequest.rentalPeriod.id === gearRequestId.rentalPeriodId
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

  approveGearRequest(
    gearRequestId: GearRequestIdentifier,
    drive: string,
  ): Promise<ApprovedGearRequest> {
    const gearRequestIndex = this.gearRequests.findIndex(
      this.isSameGearRequest(gearRequestId),
    );
    if (gearRequestIndex === -1) {
      return Promise.reject(new GearRequestNotFound(gearRequestId));
    }

    const gearRequest = this.gearRequests.at(gearRequestIndex);

    const approvedGearRequest: ApprovedGearRequest = {
      ...gearRequest,
      status: APPROVED,
      drive,
    };
    this.gearRequests = updateItemToList(
      this.gearRequests,
      gearRequestIndex,
      approvedGearRequest,
    );
    return Promise.resolve(approvedGearRequest);
  }

  private isMatchingSearch(
    gearRequestSearch: SearchGearRequest,
    gearRequest: GearRequest,
  ): boolean {
    const seekerSearch =
      !gearRequestSearch.seeker ||
      (gearRequestSearch.seeker.id === gearRequest.seeker.id &&
        gearRequestSearch.seeker.type === gearRequest.seeker.type);
    const gearSearch =
      !gearRequestSearch.gear ||
      (gearRequestSearch.gear.id
        ? gearRequestSearch.gear.id === gearRequest.gear.id
        : true && gearRequestSearch.gear.isConsumable !== undefined
        ? gearRequestSearch.gear.isConsumable === gearRequest.gear.isConsumable
        : true);
    const periodSearch =
      !gearRequestSearch.period ||
      (gearRequestSearch.period.start.getTime() <=
        gearRequest.rentalPeriod.end.getTime() &&
        gearRequestSearch.period.end.getTime() >=
          gearRequest.rentalPeriod.start.getTime());
    return seekerSearch && gearSearch && periodSearch;
  }

  updateGearRequest(
    gearRequestId: GearRequestIdentifier,
    updateGearRequestForm: UpdateGearRequestForm,
  ): Promise<GearRequest> {
    const gearRequestIndex = this.gearRequests.findIndex(
      this.isSameGearRequest(gearRequestId),
    );
    if (gearRequestIndex === -1) {
      return Promise.reject(new GearRequestNotFound(gearRequestId));
    }

    const gearRequest = this.gearRequests.at(gearRequestIndex);

    const newGearRequest = this.mergePreviousAndNewGearRequest(
      gearRequest,
      updateGearRequestForm,
    );
    this.gearRequests = updateItemToList(
      this.gearRequests,
      gearRequestIndex,
      newGearRequest,
    );
    return Promise.resolve(newGearRequest);
  }

  removeGearRequest(gearRequestId: GearRequestIdentifier): Promise<void> {
    const gearRequestIndex = this.gearRequests.findIndex(
      this.isSameGearRequest(gearRequestId),
    );
    if (gearRequestIndex === -1) return Promise.resolve();
    this.gearRequests = [
      ...this.gearRequests.slice(0, gearRequestIndex),
      ...this.gearRequests.slice(gearRequestIndex + 1),
    ];

    return Promise.resolve();
  }

  removeGearRequests(gearRequestIds: GearRequestIdentifier[]): Promise<void> {
    this.gearRequests = this.gearRequests.filter((gr) => {
      const grId = buildGearRequestIdentifier(gr);
      return gearRequestIds.every(
        (id) => !isSameGeaRequestIdentifier(grId)(id),
      );
    });
    return Promise.resolve();
  }

  private mergePreviousAndNewGearRequest(
    previousGearRequest: GearRequest,
    updateGearRequestForm: UpdateGearRequestForm,
  ): GearRequest {
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
      rentalPeriod: {
        ...previousGearRequest.rentalPeriod,
        ...startRentalPeriod,
        ...endRentalPeriod,
      },
    };
    const newGearRequest = {
      ...previousGearRequest,
      ...quantity,
      ...rentalPeriod,
      status: PENDING,
    };
    return newGearRequest;
  }

  changeLinkedPeriod(
    gearRequestId: GearRequestIdentifier,
    rentalPeriod: Period,
  ): Promise<GearRequest> {
    const gearRequestIndex = this.gearRequests.findIndex(
      this.isSameGearRequest(gearRequestId),
    );
    if (gearRequestIndex === -1) {
      return Promise.reject(new GearRequestNotFound(gearRequestId));
    }

    const existingGearRequest = this.gearRequests.at(gearRequestIndex);

    const newGearRequest = {
      ...existingGearRequest,
      rentalPeriod,
    };

    this.gearRequests = updateItemToList(
      this.gearRequests,
      gearRequestIndex,
      newGearRequest,
    );
    return Promise.resolve(newGearRequest);
  }

  async transactionalMultiOperation({
    toDelete,
    toInsert,
    toUpdate,
  }: MultiOperandGearRequest): Promise<GearRequest[]> {
    await this.removeGearRequests(toDelete.map(buildGearRequestIdentifier));
    return Promise.all([
      ...toInsert.map((gr) => this.addGearRequest(gr)),
      ...toUpdate.map(
        ({ gear, seeker, rentalPeriod: { id: rentalPeriodId, start, end } }) =>
          this.updateGearRequest(
            { seeker, gearId: gear.id, rentalPeriodId },
            { start, end },
          ),
      ),
    ]);
  }
}
