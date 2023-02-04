import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FtUserRequestDto } from './dto/ft_user_request.dto';

@Injectable()
export class FtUserRequestService {
  constructor(private prisma: PrismaService) {}

  async create(request: FtUserRequestDto) {
    await this.prisma.ftUserRequest.create({ data: request });
  }

  async delete(request: FtUserRequestDto) {
    await this.prisma.ftUserRequest.delete({
      where: {
        ftTimeWindowsId_userId: {
          ftTimeWindowsId: request.ftTimeWindowsId,
          userId: request.userId,
        },
      },
    });
  }
}
