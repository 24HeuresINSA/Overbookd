import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import {
  convertGearToApiContract,
  DatabaseGear,
} from '../../../catalog/repositories/prisma/gear.repository.prisma';
import { PrismaService } from '../../../prisma.service';
import {
  GearRequest,
  GearRequestIdentifier,
  GearRequestRepository,
  GearSeekerType,
  Period,
  SearchGearRequest,
} from '../gearRequests.service';

class AnimationOnlyError extends NotImplementedException {
  constructor() {
    super(`Only handle gear requests for ${GearSeekerType.Animation}`);
  }
}

class GearRequestAlreadyExists extends BadRequestException {
  gearRequest: GearRequest;
  constructor(gearRequest: GearRequest) {
    super(
      `"Request for ${gearRequest.gear.name}" in ${gearRequest.seeker.type} #${gearRequest.seeker.id} already exists`,
    );
    this.gearRequest = gearRequest;
  }
}

type DatabaseGearRequest = {
  animationId: number;
  rentalPeriod: Period;
  quantity: number;
  status: string;
  gear: DatabaseGear;
};

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
    rentalPeriod: { select: { start: true, end: true } },
    quantity: true,
    status: true,
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
    const savedPeriod = await this.prismaService.period.create({
      select: { id: true },
      data: rentalPeriod,
    });

    const data = {
      animationId: seeker.id,
      rentalPeriodId: savedPeriod.id,
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
      await this.prismaService.period.delete({ where: { id: savedPeriod.id } });
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

    const gearRequest =
      await this.prismaService.animation_Gear_Request.findUnique({
        where: {
          animationId_gearId: {
            animationId: gearRequestId.seeker.id,
            gearId: gearRequestId.gearId,
          },
        },
        select: this.SELECT_GEAR_REQUEST,
      });

    if (!gearRequest) {
      throw new NotFoundException(
        `Request for gear #${gearRequestId.gearId} from ${gearRequestId.seeker.type} #${gearRequestId.seeker.id} not found`,
      );
    }

    return convertAnimationGearRequestToApiContract(gearRequest);
  }

  async getGearRequests(
    gearRequestSearch: SearchGearRequest,
  ): Promise<GearRequest[]> {
    if (!this.isAnimationRequest(gearRequestSearch)) {
      throw new AnimationOnlyError();
    }

    const where = this.buildSearchConditions(gearRequestSearch);
    const gearRequests =
      await this.prismaService.animation_Gear_Request.findMany({
        select: this.SELECT_GEAR_REQUEST,
        where,
      });
    return gearRequests.map(convertAnimationGearRequestToApiContract);
  }

  private isAnimationRequest(gearRequestSearch: SearchGearRequest) {
    return (
      gearRequestSearch.seeker?.type &&
      gearRequestSearch.seeker?.type === GearSeekerType.Animation
    );
  }

  private buildSearchConditions({ seeker }: SearchGearRequest) {
    const seekerCondition = seeker?.id ? { animationId: seeker.id } : {};

    return { ...seekerCondition };
  }
}
