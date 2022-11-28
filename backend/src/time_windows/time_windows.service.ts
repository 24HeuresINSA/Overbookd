import { Injectable } from '@nestjs/common';
import { time_windows } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateTimeWindowDto } from './dto/create-time_window.dto';

@Injectable()
export class TimeWindowsService {
  constructor(private prisma: PrismaService) {}
  async upsert(
    faID: number,
    tWindows: CreateTimeWindowDto[],
  ): Promise<time_windows[] | null> {
    return Promise.all(
      tWindows.map(async (tWindow) => {
        if (tWindow.id) {
          return await this.prisma.time_windows.update({
            where: { id: tWindow.id },
            data: {
              ...tWindow,
              fa_id: faID,
            },
          });
        } else {
          return await this.prisma.time_windows.create({
            data: {
              ...tWindow,
              fa_id: faID,
            },
          });
        }
      }),
    );
  }

  async findAll(): Promise<time_windows[] | null> {
    return await this.prisma.time_windows.findMany();
  }

  async findOne(id: number): Promise<time_windows | null> {
    return await this.prisma.time_windows.findUnique({
      where: {
        id: id,
      },
    });
  }
}
