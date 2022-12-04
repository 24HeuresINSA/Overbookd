import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { Gear, GearRepository } from '../../catalog/interfaces';
import { Status } from '../dto/update-fa.dto';

export const PENDING = 'PENDING';

export class AnimationOnlyError extends NotImplementedException {
  constructor() {
    super(`Only handle gear requests for ${GearSeekerType.Animation}`);
  }
}

export class GearRequestAlreadyExists extends BadRequestException {
  gearRequest: GearRequest;
  constructor(gearRequest: GearRequest) {
    super(
      `"Request for ${gearRequest.gear.name}" in ${gearRequest.seeker.type} #${gearRequest.seeker.id} already exists`,
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

export interface GearRequest {
  seeker: GearSeeker;
  status: string;
  quantity: number;
  gear: Gear;
  rentalPeriod: Period;
}

export type Period = {
  start: Date;
  end: Date;
};

export type GearSeeker = {
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

export type UpdateGearRequestForm = Partial<
  Pick<CreateGearRequestForm, 'start' | 'end' | 'quantity'>
>;

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
  updateGearRequest(
    gearRequestId: GearRequestIdentifier,
    updateGearRequestForm: UpdateGearRequestForm,
  ): Promise<GearRequest>;
  removeGearRequest(gearRequestId: GearRequestIdentifier): Promise<void>;
}

export interface Animation {
  id: number;
  name: string;
  status: Status;
}

export interface AnimationRepository {
  getAnimation(animationId: number): Promise<Animation>;
}

class AnimationAlreadyValidatedError extends BadRequestException {
  constructor(animationId: number) {
    const message = `Animation #${animationId} already validated, you can't add gear request`;
    super(message);
  }
}

@Injectable()
export class GearRequestsService {
  constructor(
    @Inject('GEAR_REQUEST_REPOSITORY')
    private readonly gearRequestRepository: GearRequestRepository,
    @Inject('GEAR_REPOSITORY')
    private readonly gearRepository: GearRepository,
    @Inject('ANIMATION_REPOSITORY')
    private readonly animationRepository: AnimationRepository,
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
    const [existingAnimation, existingGear] = await Promise.all([
      this.animationRepository.getAnimation(seekerId),
      this.gearRepository.getGear(gearId),
    ]);
    if (existingAnimation.status === Status.VALIDATED)
      throw new AnimationAlreadyValidatedError(seekerId);
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

  updateAnimationRequest(
    animationId: number,
    gearId: number,
    updateForm: UpdateGearRequestForm,
  ): Promise<GearRequest> {
    return this.gearRequestRepository.updateGearRequest(
      { seeker: { type: GearSeekerType.Animation, id: animationId }, gearId },
      updateForm,
    );
  }

  removeAnimationRequest(animationId: number, gearId: number): Promise<void> {
    return this.gearRequestRepository.removeGearRequest({
      seeker: { type: GearSeekerType.Animation, id: animationId },
      gearId,
    });
  }
}
