import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ftTimeWindowResponseDto } from './dto/ftTimeWindowResponse.dto';
import { UpsertFtTimeWindowDto } from './dto/upsertFtTimeWindow.dto';

@Injectable()
export class FtTimeWindowService {
  constructor(private prisma: PrismaService) {}

  upsert(
    ftId: number,
    tw: UpsertFtTimeWindowDto,
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
