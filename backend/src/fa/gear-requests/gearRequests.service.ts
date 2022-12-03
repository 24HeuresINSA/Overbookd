import { GearNotFoundException } from '../../catalog/catalog.service';
import { GearRepository } from '../../catalog/interfaces';

export const PENDING = 'PENDING';

export type GearRequest = {
  seeker: GearSeeker;
  status: string;
  quantity: number;
  gearId: number;
  rentalPeriod: Period;
};

type Period = {
  start: Date;
  end: Date;
};

type GearSeeker = {
  type: GearSeekerType;
  id: number;
};

export enum GearSeekerType {
  Animation = 'FA',
  Task = 'FT',
}

export type CreateGearRequestForm = {
  seekerId: number;
  quantity: number;
  gearId: number;
  start: Date;
  end: Date;
};

export type GearRequestIdentifier = {
  seeker: {
    type: GearSeekerType;
    id: number;
  };
  gearId: number;
};

export interface GearRequestRepository {
  addGearRequest(gearRequest: GearRequest): Promise<GearRequest>;
  getGearRequest(gearRequestId: GearRequestIdentifier): Promise<GearRequest>;
}

export class GearRequestsService {
  constructor(
    private readonly gearRequestRepository: GearRequestRepository,
    private readonly gearRepository: GearRepository,
  ) {}

  async findGearRequest(gearRequestId: GearRequestIdentifier) {
    return this.gearRequestRepository.getGearRequest(gearRequestId);
  }

  async addAnimationRequest({
    seekerId,
    quantity,
    gearId,
    start,
    end,
  }: CreateGearRequestForm): Promise<GearRequest> {
    const existingGear = await this.gearRepository.getGear(gearId);
    const gearRequest = {
      seeker: { type: GearSeekerType.Animation, id: seekerId },
      status: PENDING,
      quantity,
      gearId: existingGear.id,
      rentalPeriod: { start, end },
    };
    return this.gearRequestRepository.addGearRequest(gearRequest);
  }
}
