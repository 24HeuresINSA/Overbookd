import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SELECT_USERNAME_WITH_ID } from 'src/user/user.service';
import {
  DataBaseUserRequest,
  FtUserRequestResponseDto,
  UserRequest,
} from './dto/ftUserRequestResponse.dto';
import { FtUserRequestDto } from './dto/ft_user_request.dto';

@Injectable()
export class FtUserRequestService {
  constructor(private prisma: PrismaService) {}

  async create(
    request: FtUserRequestDto[],
    ftId: number,
    twId: number,
  ): Promise<FtUserRequestResponseDto[]> {
    const allRequests = request.map(({ userId }) => {
      const userRequest = {
        ftTimeWindowsId: twId,
        userId: userId,
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
        },
      });
    });
    const userRequests = await this.prisma.$transaction(allRequests);
    return Promise.all(userRequests.map(this.convertToUserRequest));
  }

  async delete(ftId: number, twId: number, userId: number): Promise<void> {
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
    const alsoRequestedBy = [];
    return { ...userRequest, alsoRequestedBy };
  }
}
