import { Gear, GearRepository } from '../../catalog/interfaces';

export const PENDING = 'PENDING';

export interface GearRequest {
  seeker: GearSeeker;
  status: string;
  quantity: number;
  gear: Gear;
  rentalPeriod: Period;
}

export interface AnimationGearRequest extends GearRequest {
  seeker: {
    id: number;
    type: GearSeekerType.Animation;
  };
}

export function isAnimationGearRequest(
  gearRequest: GearRequest,
): gearRequest is AnimationGearRequest {
  return gearRequest.seeker.type === GearSeekerType.Animation;
}

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

export type SearchGearRequest = {
  seeker?: GearSeeker;
};

export interface GearRequestRepository {
  addGearRequest(gearRequest: GearRequest): Promise<GearRequest>;
  getGearRequest(gearRequestId: GearRequestIdentifier): Promise<GearRequest>;
  getGearRequests(gearRequestSearch: SearchGearRequest): Promise<GearRequest[]>;
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
      gear: existingGear,
      rentalPeriod: { start, end },
    };
    return this.gearRequestRepository.addGearRequest(gearRequest);
  }

  async getAnimationRequests(animationId: number): Promise<GearRequest[]> {
    return this.gearRequestRepository.getGearRequests({
      seeker: { type: GearSeekerType.Animation, id: animationId },
    });
  }
}
