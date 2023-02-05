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
    const allRequests = request.map(({ userId }) =>
      this.prisma.ftUserRequest.upsert({
        where: {
          ftTimeWindowsId_userId: {
            ftTimeWindowsId: twId,
            userId: userId,
          },
        },
        create: {
          ftTimeWindowsId: twId,
          userId: userId,
        },
        update: {
          ftTimeWindowsId: twId,
          userId: userId,
        },
        select: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
        },
      }),
    );
    return this.prisma.$transaction(allRequests);
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
}
