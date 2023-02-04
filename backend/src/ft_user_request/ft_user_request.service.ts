import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FtUserRequestResponseDto } from './dto/ftUserRequestResponse.dto';
import { FtUserRequestDto } from './dto/ft_user_request.dto';

@Injectable()
export class FtUserRequestService {
  constructor(private prisma: PrismaService) {}

  async create(
    request: FtUserRequestDto[],
    ftId: number,
    twId: number,
  ): Promise<FtUserRequestResponseDto[]> {
    const allRequests = [];
    for (const req of request) {
      allRequests.push(
        this.prisma.ftUserRequest.create({
          data: {
            ftTimeWindowsId: twId,
            userId: req.userId,
          },
        }),
      );
    }
    await this.prisma.$transaction(allRequests);
    return this.prisma.user.findMany({
      where: {
        id: {
          in: request.map((req) => req.userId),
        },
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
      },
    });
  }

  async delete(
    request: FtUserRequestDto,
    ftId: number,
    twId: number,
  ): Promise<void> {
    await this.prisma.ftUserRequest.delete({
      where: {
        ftTimeWindowsId_userId: {
          ftTimeWindowsId: twId,
          userId: request.userId,
        },
      },
    });
  }
}
