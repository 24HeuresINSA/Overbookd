import { Injectable } from '@nestjs/common';
import {
  convertGearToApiContract,
  DatabaseGear,
} from '../../catalog/repositories/prisma/gear.repository.prisma';
import { PrismaService } from '../../prisma.service';
import {
  AnimationOnlyError,
  APPROVED,
  ApprovedGearRequest,
  GearRequest,
  GearRequestAlreadyExists,
  GearRequestIdentifier,
  GearRequestNotFound,
  GearRequestRepository,
  GearSeeker,
  GearSeekerType,
  Period,
  SearchGearRequest,
  UpdateGearRequestForm,
} from '../gearRequests.service';

type Animation = {
  animation: { id: number; name: string };
};

type Task = {
  task: { id: number; name: string };
};

type DatabaseGearRequest<T extends Animation | Task = Animation> = T & {
  rentalPeriod: Period;
  quantity: number;
  status: string;
  gear: DatabaseGear;
  drive?: string;
};

function convertApprovedAnimationGearRequestToApiContract(
  gearRequest: DatabaseGearRequest<Animation> & {
    drive: string;
    status: typeof APPROVED;
  },
): ApprovedGearRequest {
  const { drive, status } = gearRequest;
  return {
    ...convertAnimationGearRequestToApiContract(gearRequest),
    drive,
    status,
  };
}

function convertAnimationGearRequestToApiContract(
  gearRequest: DatabaseGearRequest<Animation>,
): GearRequest {
  const { animation } = gearRequest;
  const seeker = {
    type: GearSeekerType.Animation,
    id: animation.id,
    name: animation.name,
  };
  return buildGearRequest(seeker, gearRequest);
}

function convertTaskGearRequestToApiContract(
  gearRequest: DatabaseGearRequest<Task>,
): GearRequest {
  const { task } = gearRequest;
  const seeker = {
    type: GearSeekerType.Task,
    id: task.id,
    name: task.name,
  };
  return buildGearRequest(seeker, gearRequest);
}

function buildGearRequest(
  seeker: GearSeeker,
  gearRequest: DatabaseGearRequest<Animation | Task>,
): GearRequest {
  const { rentalPeriod, quantity, status, gear, drive } = gearRequest;
  return {
    seeker,
    rentalPeriod,
    quantity,
    status,
    drive,
    gear: convertGearToApiContract(gear),
  };
}

function convertGearRequestToApiContract(
  gearRequest: DatabaseGearRequest<Animation | Task>,
): GearRequest {
  if (isAnimationGearRequest(gearRequest))
    return convertAnimationGearRequestToApiContract(gearRequest);
  return convertTaskGearRequestToApiContract(gearRequest);
}

function isAnimationGearRequest(
  gearRequest: DatabaseGearRequest<Animation | Task>,
): gearRequest is DatabaseGearRequest<Animation> {
  return (gearRequest as DatabaseGearRequest<Animation>).animation !== null;
}

@Injectable()
export class PrismaGearRequestRepository implements GearRequestRepository {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly SELECT_GEAR_REQUEST = {
    animation: {
      select: {
        id: true,
        name: true,
      },
    },
    task: {
      select: {
        id: true,
        name: true,
      },
    },
    rentalPeriod: { select: { start: true, end: true, id: true } },
    quantity: true,
    status: true,
    drive: true,
    gear: {
      select: {
        id: true,
        name: true,
        isPonctualUsage: true,
        slug: true,
        category: {
          select: {
            id: true,
            name: true,
            path: true,
            owner: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        },
      },
    },
  };

  async addGearRequest(gearRequest: GearRequest): Promise<GearRequest> {
    const { seeker, rentalPeriod, gear, quantity, status } = gearRequest;

    const seekerData =
      seeker.type === GearSeekerType.Animation
        ? { animationId: seeker.id }
        : { taskId: seeker.id };

    const data = {
      ...seekerData,
      rentalPeriodId: rentalPeriod.id,
      gearId: gear.id,
      quantity,
      status,
    };

    try {
      const savedGearRequest = await this.prismaService.gearRequest.create({
        select: this.SELECT_GEAR_REQUEST,
        data,
      });

      return convertGearRequestToApiContract(savedGearRequest);
    } catch (e) {
      if (this.prismaService.isUniqueConstraintViolation(e)) {
        throw new GearRequestAlreadyExists(gearRequest);
      }
      throw e;
    }
  }

  async getGearRequest(
    gearRequestId: GearRequestIdentifier,
  ): Promise<GearRequest> {
    if (!this.isAnimationRequest(gearRequestId)) {
      throw new AnimationOnlyError();
    }

    const where = this.buildGearRequestUniqueCondition(gearRequestId);

    const gearRequest = await this.prismaService.gearRequest.findUnique({
      where,
      select: this.SELECT_GEAR_REQUEST,
    });

    if (!gearRequest) {
      throw new GearRequestNotFound(gearRequestId);
    }

    return convertGearRequestToApiContract(gearRequest);
  }

  async getGearRequests(
    gearRequestSearch: SearchGearRequest,
  ): Promise<GearRequest[]> {
    const where = this.buildGearRequestSearchConditions(gearRequestSearch);
    const gearRequests = await this.prismaService.gearRequest.findMany({
      select: this.SELECT_GEAR_REQUEST,
      where,
    });
    return gearRequests.map(convertGearRequestToApiContract);
  }

  async updateGearRequest(
    gearRequestId: GearRequestIdentifier,
    updateGearRequestForm: UpdateGearRequestForm,
  ): Promise<GearRequest> {
    if (!this.isAnimationRequest(gearRequestId)) {
      throw new AnimationOnlyError();
    }

    const data = this.buildUpdateGearRequestData(updateGearRequestForm);
    const where = this.buildGearRequestUniqueCondition(gearRequestId);

    const updatedGearRequest = await this.prismaService.gearRequest.update({
      select: this.SELECT_GEAR_REQUEST,
      data,
      where,
    });
    return convertGearRequestToApiContract(updatedGearRequest);
  }

  async removeGearRequest(gearRequestId: GearRequestIdentifier): Promise<void> {
    const where = this.buildGearRequestUniqueCondition(gearRequestId);
    await this.prismaService.gearRequest.delete({
      where,
      select: { rentalPeriodId: true, gearId: true, animationId: true },
    });
  }

  async approveGearRequest(
    gearRequestIdentifier: GearRequestIdentifier,
    drive: string,
  ): Promise<ApprovedGearRequest> {
    const data = { status: APPROVED, drive };
    const where = this.buildGearRequestUniqueCondition(gearRequestIdentifier);

    const approvedGearRequest = await this.prismaService.gearRequest.update({
      where,
      data,
      select: this.SELECT_GEAR_REQUEST,
    });
    return convertApprovedAnimationGearRequestToApiContract({
      ...approvedGearRequest,
      status: APPROVED,
    });
  }

  private buildUpdateGearRequestData(
    updateGearRequestForm: UpdateGearRequestForm,
  ) {
    return {
      quantity: updateGearRequestForm.quantity,
      rentalPeriod: {
        update: {
          start: updateGearRequestForm.start,
          end: updateGearRequestForm.end,
        },
      },
    };
  }

  private buildGearRequestUniqueCondition(
    gearRequestId: GearRequestIdentifier,
  ) {
    return {
      gearId_rentalPeriodId: {
        gearId: gearRequestId.gearId,
        rentalPeriodId: gearRequestId.rentalPeriodId,
      },
    };
  }

  private isAnimationRequest(gearRequestSearch: SearchGearRequest) {
    return (
      gearRequestSearch.seeker?.type &&
      gearRequestSearch.seeker?.type === GearSeekerType.Animation
    );
  }

  private buildGearRequestSearchConditions({ seeker }: SearchGearRequest) {
    const seekerType =
      seeker?.type === GearSeekerType.Animation ? 'animationId' : 'taskId';
    const seekerCondition = seeker?.id ? { [seekerType]: seeker.id } : {};

    return { ...seekerCondition };
  }
}
