import { Injectable } from '@nestjs/common';
import { IProvidePeriod } from '@overbookd/period';
import { PrismaService } from '../prisma.service';
import { SELECT_USERNAME_WITH_ID } from '../user/user.service';
import { FtUserRequestDto } from './dto/ft-user-request.request.dto';
import {
  DataBaseUserRequest,
  FtUserRequestResponseDto,
  UserRequest,
} from './dto/ft-user-request.response.dto';

type UserId = {
  userId: number;
};

type PeriodWithUserRequestedIds = IProvidePeriod & {
  userRequests: UserId[];
};

type TimeWindow = IProvidePeriod & {
  ftId: number;
};

@Injectable()
export class FtUserRequestService {
  constructor(private prisma: PrismaService) { }

  private SELECT_ALSO_REQUESTED_BY_FT = {
    ft: {
      select: {
        id: true,
        name: true,
      },
    },
    start: true,
    end: true,
  };

  async create(
    request: FtUserRequestDto[],
    twId: number,
  ): Promise<FtUserRequestResponseDto[]> {
    const requestableUsers = await this.findRequestableUsers(request);
    const userRequests = await this.createUserRequests(requestableUsers, twId);
    return Promise.all(
      userRequests.map((userRequest) => this.convertToUserRequest(userRequest)),
    );
  }

  async delete(twId: number, userId: number): Promise<void> {
    await this.prisma.ftUserRequest.delete({
      where: {
        ftTimeWindowsId_userId: {
          ftTimeWindowsId: twId,
          userId,
        },
      },
    });
  }

  async convertToUserRequest(
    userRequest: DataBaseUserRequest,
  ): Promise<UserRequest> {
    const timeWindow = await this.retrieveTimeWindow(userRequest);
    const [isAvailable, fts, isAlreadyAssigned] = await Promise.all([
      this.isUserAvailable(userRequest.user.id, timeWindow),
      this.findFtWhereUserIsAlsoRequestedInSamePeriod(timeWindow, userRequest),
      this.isUserAlreadyAssigned(userRequest.user.id, timeWindow),
    ]);
    const alsoRequestedBy = fts.map(({ ft, start, end }) => ({
      ...ft,
      period: { start, end },
    }));
    return { ...userRequest, alsoRequestedBy, isAvailable, isAlreadyAssigned };
  }

  private async isUserAvailable(
    userId: number,
    period: IProvidePeriod,
  ): Promise<boolean> {
    const matchingAvailability = await this.findMatchingAvailabilities(
      userId,
      period,
    );
    return Boolean(matchingAvailability);
  }

  private async findMatchingAvailabilities(
    userId: number,
    { start, end }: IProvidePeriod,
  ) {
    return this.prisma.volunteerAvailability.findFirst({
      select: { userId: true },
      where: {
        userId,
        start: { lte: start },
        end: { gte: end },
      },
    });
  }

  private async isUserAlreadyAssigned(
    userId: number,
    timeWindow: TimeWindow,
  ): Promise<boolean> {
    const { ftId, ...period } = timeWindow;
    const matchingAssignment = await this.findMatchingAssignment(
      userId,
      ftId,
      period,
    );
    return Boolean(matchingAssignment);
  }

  private async findMatchingAssignment(
    userId: number,
    ftId: number,
    { start, end }: IProvidePeriod,
  ) {
    return this.prisma.assignment.findFirst({
      select: { assigneeId: true },
      where: {
        assigneeId: userId,
        timeSpan: {
          start: { lt: end },
          end: { gt: start },
          timeWindow: { NOT: { ftId } },
        },
      },
    });
  }

  private async findFtWhereUserIsAlsoRequestedInSamePeriod(
    timeWindow: PeriodWithUserRequestedIds,
    userRequest: DataBaseUserRequest,
  ) {
    const where = this.buildUserIsAlsoRequestedInSamePeriodCondition(
      timeWindow,
      userRequest,
    );
    const select = this.SELECT_ALSO_REQUESTED_BY_FT;
    return this.prisma.ftTimeWindow.findMany({ where, select });
  }

  private buildUserIsAlsoRequestedInSamePeriodCondition(
    timeWindow: PeriodWithUserRequestedIds,
    userRequest: DataBaseUserRequest,
  ) {
    return {
      ft: {
        isDeleted: false,
      },
      start: {
        lt: timeWindow.end,
      },
      end: {
        gt: timeWindow.start,
      },
      NOT: {
        id: userRequest.ftTimeWindowsId,
      },
      userRequests: {
        some: {
          userId: userRequest.user.id,
        },
      },
    };
  }

  private async retrieveTimeWindow(userRequest: DataBaseUserRequest) {
    return this.prisma.ftTimeWindow.findUnique({
      where: { id: userRequest.ftTimeWindowsId },
      select: {
        start: true,
        end: true,
        userRequests: {
          select: {
            userId: true,
          },
        },
        ftId: true,
      },
    });
  }

  private async createUserRequests(
    requestableUsers: { id: number }[],
    twId: number,
  ) {
    const allRequests = requestableUsers.map(({ id }) => {
      const userRequest = {
        ftTimeWindowsId: twId,
        userId: id,
      };
      return this.prisma.ftUserRequest.upsert({
        where: {
          ftTimeWindowsId_userId: userRequest,
        },
        create: userRequest,

        update: userRequest,
        select: {
          user: {
            select: SELECT_USERNAME_WITH_ID,
          },
          id: true,
          ftTimeWindowsId: true,
        },
      });
    });
    return this.prisma.$transaction(allRequests);
  }

  private async findRequestableUsers(request: FtUserRequestDto[]) {
    const requestablePermission = 'validated-user';
    const requestedUserIds = request.map(({ userId }) => userId);
    return this.prisma.user.findMany({
      select: { id: true },
      where: {
        id: { in: requestedUserIds },
        teams: {
          some: {
            team: {
              permissions: {
                some: {
                  permission: {
                    name: requestablePermission,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
