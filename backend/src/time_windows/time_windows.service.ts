import { Injectable } from '@nestjs/common';
import { FaTimeWindow } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateTimeWindowDto } from './dto/create-time_window.dto';

@Injectable()
export class TimeWindowsService {
  constructor(private prisma: PrismaService) {}
  async upsert(
    faID: number,
    tWindows: CreateTimeWindowDto[],
  ): Promise<FaTimeWindow[] | null> {
    return Promise.all(
      tWindows.map(async (tWindow) => {
        if (tWindow.id) {
          return await this.prisma.faTimeWindow.update({
            where: { id: tWindow.id },
            data: {
              ...tWindow,
              fa_id: faID,
            },
          });
        } else {
          return await this.prisma.faTimeWindow.create({
            data: {
              ...tWindow,
              fa_id: faID,
            },
          });
        }
      }),
    );
  }

  async findAll(): Promise<FaTimeWindow[] | null> {
    return await this.prisma.faTimeWindow.findMany();
  }

  async findOne(id: number): Promise<FaTimeWindow | null> {
    return await this.prisma.faTimeWindow.findUnique({
      where: {
        id: id,
      },
    });
  }

  async remove(id: number): Promise<FaTimeWindow | null> {
    return await this.prisma.faTimeWindow.delete({
      where: {
        id: id,
      },
    });
  }
}
