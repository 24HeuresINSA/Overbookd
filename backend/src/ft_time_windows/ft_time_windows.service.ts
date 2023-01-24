import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ftTimeWindowsResponseDto } from './dto/ftTimeWindowsResponse.dto';
import { UpsertFtTimeWindowsDto } from './dto/upsertFtTimeWindows.dto';

@Injectable()
export class FtTimeWindowsService {
  constructor(private prisma: PrismaService) {}

  upsert(
    ftId: number,
    tw: UpsertFtTimeWindowsDto,
  ): Promise<ftTimeWindowsResponseDto> {
    const completeTw = {
      ...tw,
      ftId,
    };
    return this.prisma.ftTimeWindows.upsert({
      where: {
        id: completeTw.id || 0,
      },
      update: completeTw,
      create: completeTw,
    });
  }

  async remove(ftId: number, id: number): Promise<void> {
    await this.prisma.ftTimeWindows.deleteMany({
      where: {
        AND: [
          {
            id,
          },
          {
            ftId,
          },
        ],
      },
    });
  }
}
