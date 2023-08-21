import { BadRequestException, NotFoundException } from "@nestjs/common";
import { GearRequest, GearRequestIdentifier } from "./gear-request.model";

export class GearRequestAlreadyExists extends BadRequestException {
  gearRequest: GearRequest;
  constructor(gearRequest: GearRequest) {
    super(
      `"Request for ${gearRequest.gear.name}" in ${gearRequest.seeker.type} #${gearRequest.seeker.id} already exists for #${gearRequest.rentalPeriod.id} rental period`,
    );
    this.gearRequest = gearRequest;
  }
}

export class GearRequestNotFound extends NotFoundException {
  constructor(gearRequestId: GearRequestIdentifier) {
    super(
      `Request for gear #${gearRequestId.gearId} from ${gearRequestId.seeker.type} #${gearRequestId.seeker.id} not found`,
    );
  }
}

export class PeriodNotFound extends NotFoundException {
  constructor(periodId: number) {
    super(`Period #${periodId} not found`);
  }
}
