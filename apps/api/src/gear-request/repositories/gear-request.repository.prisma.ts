import { Injectable } from '@nestjs/common';
import {
  convertGearToApiContract,
  DatabaseGear,
} from '../../catalog/repositories/prisma/gear.repository.prisma';
import { PrismaService } from '../../prisma.service';
import {
  GearRequestAlreadyExists,
  GearRequestNotFound,
} from '../gear-request.error';
import {
  APPROVED,
  ApprovedGearRequest,
  buildGearRequestIdentifier,
  GearRequest,
  GearRequestIdentifier,
  GearSeeker,
  GearSeekerType,
  MultiOperandGearRequest,
  Period,
  SearchGearRequest,
  UpdateGearRequestForm,
} from '../gear-request.model';
import { GearRequestRepository } from '../gear-request.service';

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

function convertApprovedGearRequestToApiContract(
  gearRequest: DatabaseGearRequest<Animation | Task> & {
    drive: string;
    status: typeof APPROVED;
  },
): ApprovedGearRequest {
  const { drive, status } = gearRequest;
  const convertedGearRequest = isAnimationGearRequest(gearRequest)
    ? convertAnimationGearRequestToApiContract(gearRequest)
    : convertTaskGearRequestToApiContract(gearRequest);
  return {
    ...convertedGearRequest,
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
        isConsumable: true,
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
    try {
      const savedGearRequest = await this.prismaAddGearRequest(gearRequest);

      return convertGearRequestToApiContract(savedGearRequest);
    } catch (e) {
      if (this.prismaService.isUniqueConstraintViolation(e)) {
        throw new GearRequestAlreadyExists(gearRequest);
      }
      throw e;
    }
  }

  private prismaAddGearRequest(gearRequest: GearRequest) {
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

    return this.prismaService.gearRequest.create({
      select: this.SELECT_GEAR_REQUEST,
      data,
    });
  }

  async getGearRequest(
    gearRequestId: GearRequestIdentifier,
  ): Promise<GearRequest> {
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
    const updatedGearRequest = await this.prismaUpdateGearRequest(
      gearRequestId,
      updateGearRequestForm,
    );
    return convertGearRequestToApiContract(updatedGearRequest);
  }

  private prismaUpdateGearRequest(
    gearRequestId: GearRequestIdentifier,
    updateGearRequestForm: UpdateGearRequestForm,
  ) {
    const data = this.buildUpdateGearRequestData(updateGearRequestForm);
    const where = this.buildGearRequestUniqueCondition(gearRequestId);

    return this.prismaService.gearRequest.update({
      select: this.SELECT_GEAR_REQUEST,
      data,
      where,
    });
  }

  async removeGearRequest(gearRequestId: GearRequestIdentifier): Promise<void> {
    const where = this.buildGearRequestUniqueCondition(gearRequestId);
    await this.prismaService.gearRequest.delete({
      where,
      select: { rentalPeriodId: true, gearId: true, animationId: true },
    });
  }

  async removeGearRequests(
    gearRequestIds: GearRequestIdentifier[],
  ): Promise<void> {
    await this.prismaRemoveGearRequests(gearRequestIds);
  }

  private prismaRemoveGearRequests(gearRequestIds: GearRequestIdentifier[]) {
    const where = this.buildRemoveManyCondition(gearRequestIds);
    return this.prismaService.gearRequest.deleteMany({
      where,
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
    return convertApprovedGearRequestToApiContract({
      ...approvedGearRequest,
      status: APPROVED,
    });
  }

  async changeLinkedPeriod(
    gearRequestId: GearRequestIdentifier,
    rentalPeriod: Period,
  ): Promise<GearRequest> {
    const where = this.buildGearRequestUniqueCondition(gearRequestId);

    const gearRequest = await this.prismaService.gearRequest.update({
      data: {
        rentalPeriodId: rentalPeriod.id,
      },
      where,
      select: this.SELECT_GEAR_REQUEST,
    });

    return convertGearRequestToApiContract(gearRequest);
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

  private buildGearRequestSearchConditions({
    seeker,
    gear,
    period,
  }: SearchGearRequest) {
    const seekerType =
      seeker?.type === GearSeekerType.Animation ? 'animationId' : 'taskId';
    const seekerCondition = seeker?.id ? { [seekerType]: seeker.id } : {};
    const gearIdCondition = gear?.id ? { id: gear.id } : {};
    const gearConsumableCondition =
      gear?.isConsumable !== undefined
        ? { isConsumable: gear.isConsumable }
        : {};
    const peridCondition = period
      ? {
          start: {
            lte: period.end,
          },
          end: {
            gte: period.start,
          },
        }
      : {};

    return {
      ...seekerCondition,
      gear: { ...gearIdCondition, ...gearConsumableCondition },
      rentalPeriod: peridCondition,
    };
  }

  private buildRemoveManyCondition(gearRequestIds: GearRequestIdentifier[]) {
    const { gearIds, rentalPeriodIds, taskIds, animationIds } =
      this.buildGearRequestManyRemoveIds(gearRequestIds);

    return {
      gearId: {
        in: gearIds,
      },
      rentalPeriodId: {
        in: rentalPeriodIds,
      },
      OR: [
        {
          taskId: {
            in: taskIds,
          },
        },
        {
          animationId: {
            in: animationIds,
          },
        },
      ],
    };
  }

  private buildGearRequestManyRemoveIds(
    gearRequestIds: GearRequestIdentifier[],
  ): {
    gearIds: number[];
    rentalPeriodIds: number[];
    taskIds: number[];
    animationIds: number[];
  } {
    const taskIds = gearRequestIds.reduce((taskIds, grId) => {
      if (grId.seeker.type === GearSeekerType.Animation) return taskIds;
      return [...taskIds, grId.seeker.id];
    }, [] as number[]);

    const animationIds = gearRequestIds.reduce((animationIds, grId) => {
      if (grId.seeker.type === GearSeekerType.Task) return animationIds;
      return [...animationIds, grId.seeker.id];
    }, [] as number[]);

    const gearIds = gearRequestIds.map(({ gearId }) => gearId);

    const rentalPeriodIds = gearRequestIds.map(
      ({ rentalPeriodId }) => rentalPeriodId,
    );

    return { taskIds, animationIds, gearIds, rentalPeriodIds };
  }

  async transactionalMultiOperation({
    toDelete,
    toInsert,
    toUpdate,
  }: MultiOperandGearRequest): Promise<GearRequest[]> {
    const [deletion, ...gearRequests] = await this.prismaService.$transaction([
      this.prismaRemoveGearRequests(toDelete.map(buildGearRequestIdentifier)),
      ...toInsert.map((gr) => this.prismaAddGearRequest(gr)),
      ...toUpdate.map(
        ({ gear, seeker, rentalPeriod: { id: rentalPeriodId, start, end } }) =>
          this.prismaUpdateGearRequest(
            { seeker, gearId: gear.id, rentalPeriodId },
            { start, end },
          ),
      ),
    ]);
    return gearRequests.map(convertGearRequestToApiContract);
  }
}
