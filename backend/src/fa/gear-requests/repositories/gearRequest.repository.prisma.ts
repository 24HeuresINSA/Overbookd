import { Injectable } from '@nestjs/common';
import {
  convertGearToApiContract,
  DatabaseGear,
} from '../../../catalog/repositories/prisma/gear.repository.prisma';
import { PrismaService } from '../../../prisma.service';
import {
  AnimationOnlyError,
  APPROVED,
  ApprovedGearRequest,
  GearRequest,
  GearRequestAlreadyExists,
  GearRequestIdentifier,
  GearRequestNotFound,
  GearRequestRepository,
  GearSeekerType,
  Period,
  SearchGearRequest,
  UpdateGearRequestForm,
} from '../gearRequests.service';

type DatabaseGearRequest = {
  animationId: number;
  rentalPeriod: Period;
  quantity: number;
  status: string;
  gear: DatabaseGear;
};

function convertApprovedAnimationGearRequestToApiContract(
  gearRequest: DatabaseGearRequest & { drive: string; status: typeof APPROVED },
): ApprovedGearRequest {
  const { drive, status } = gearRequest;
  return {
    ...convertAnimationGearRequestToApiContract(gearRequest),
    drive,
    status,
  };
}

function convertAnimationGearRequestToApiContract(
  gearRequest: DatabaseGearRequest,
): GearRequest {
  const { animationId, rentalPeriod, quantity, status, gear } = gearRequest;
  return {
    seeker: {
      type: GearSeekerType.Animation,
      id: animationId,
    },
    rentalPeriod,
    quantity,
    status,
    gear: convertGearToApiContract(gear),
  };
}

@Injectable()
export class PrismaGearRequestRepository implements GearRequestRepository {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly SELECT_GEAR_REQUEST = {
    animationId: true,
    rentalPeriod: { select: { start: true, end: true, id: true } },
    quantity: true,
    status: true,
    drive: true,
    gear: {
      select: {
        id: true,
        name: true,
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

    const data = {
      animationId: seeker.id,
      rentalPeriodId: rentalPeriod.id,
      gearId: gear.id,
      quantity,
      status,
    };

    try {
      const savedGearRequest =
        await this.prismaService.animation_Gear_Request.create({
          select: this.SELECT_GEAR_REQUEST,
          data,
        });

      return convertAnimationGearRequestToApiContract(savedGearRequest);
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

    const gearRequest =
      await this.prismaService.animation_Gear_Request.findUnique({
        where,
        select: this.SELECT_GEAR_REQUEST,
      });

    if (!gearRequest) {
      throw new GearRequestNotFound(gearRequestId);
    }

    return convertAnimationGearRequestToApiContract(gearRequest);
  }

  async getGearRequests(
    gearRequestSearch: SearchGearRequest,
  ): Promise<GearRequest[]> {
    if (!this.isAnimationRequest(gearRequestSearch)) {
      throw new AnimationOnlyError();
    }

    const where = this.buildGearRequestSearchConditions(gearRequestSearch);
    const gearRequests =
      await this.prismaService.animation_Gear_Request.findMany({
        select: this.SELECT_GEAR_REQUEST,
        where,
      });
    return gearRequests.map(convertAnimationGearRequestToApiContract);
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

    const updatedGearRequest =
      await this.prismaService.animation_Gear_Request.update({
        select: this.SELECT_GEAR_REQUEST,
        data,
        where,
      });
    return convertAnimationGearRequestToApiContract(updatedGearRequest);
  }

  async removeGearRequest(gearRequestId: GearRequestIdentifier): Promise<void> {
    const where = this.buildGearRequestUniqueCondition(gearRequestId);
    const existingGearRequest =
      await this.prismaService.animation_Gear_Request.findUnique({
        where,
        select: { rentalPeriodId: true },
      });
    if (!existingGearRequest) return;
    await this.prismaService.period.delete({
      where: { id: existingGearRequest.rentalPeriodId },
    });
  }

  async approveGearRequest(
    gearRequestIdentifier: GearRequestIdentifier,
    drive: string,
  ): Promise<ApprovedGearRequest> {
    const data = { status: APPROVED, drive };
    const where = this.buildGearRequestUniqueCondition(gearRequestIdentifier);

    const approvedGearRequest =
      await this.prismaService.animation_Gear_Request.update({
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
      animationId_gearId_rentalPeriodId: {
        animationId: gearRequestId.seeker.id,
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
    const seekerCondition = seeker?.id ? { animationId: seeker.id } : {};

    return { ...seekerCondition };
  }
}
