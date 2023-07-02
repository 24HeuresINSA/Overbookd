import { Injectable } from '@nestjs/common';
import { FaTimeWindow } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateTimeWindowDto } from './dto/create-fa_time_window.dto';

@Injectable()
export class FaTimeWindowsService {
  constructor(private prisma: PrismaService) {}
  async upsert(
    faId: number,
    tWindows: CreateTimeWindowDto[],
  ): Promise<FaTimeWindow[] | null> {
    return Promise.all(
      tWindows.map(async (tWindow) => {
        if (tWindow.id) {
          return this.prisma.faTimeWindow.update({
            where: { id: tWindow.id },
            data: {
              ...tWindow,
              faId,
            },
          });
        } else {
          return this.prisma.faTimeWindow.create({
            data: {
              ...tWindow,
              faId,
            },
          });
        }
      }),
    );
  }

  async findAll(): Promise<FaTimeWindow[] | null> {
    return this.prisma.faTimeWindow.findMany();
  }

  async findOne(id: number): Promise<FaTimeWindow | null> {
    return this.prisma.faTimeWindow.findUnique({
      where: { id },
    });
  }

  async remove(id: number): Promise<FaTimeWindow | null> {
    return this.prisma.faTimeWindow.delete({
      where: { id },
    });
  }
}
