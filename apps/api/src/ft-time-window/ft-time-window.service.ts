import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ftTimeWindowResponseDto } from './dto/ft-time-window.response.dto';
import { UpsertFtTimeWindowRequestDto } from './dto/upsert-ft-time-window.request.dto';

@Injectable()
export class FtTimeWindowService {
  constructor(private prisma: PrismaService) {}

  upsert(
    ftId: number,
    tw: UpsertFtTimeWindowRequestDto,
  ): Promise<ftTimeWindowResponseDto> {
    const completeTw = {
      ...tw,
      ftId,
    };
    return this.prisma.ftTimeWindow.upsert({
      where: {
        id: completeTw.id || 0,
      },
      update: completeTw,
      create: completeTw,
    });
  }

  async remove(ftId: number, id: number): Promise<void> {
    await this.prisma.ftTimeWindow.deleteMany({
      where: {
        AND: [{ id }, { ftId }],
      },
    });
  }
}
