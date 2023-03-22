import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FtTimespan } from './dto/ftTimespanResponse';

@Injectable()
export class FtTimespanService {
  constructor(private prisma: PrismaService) {}

  async findAllFtTimespans(): Promise<FtTimespan[]> {
    const ftTimespans = await this.prisma.ftTimespan.findMany({
      select: {
        id: true,
        start: true,
        end: true,
        hasPriority: true,
        category: true,
        timeWindows: {
          select: {
            ft: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        start: 'asc',
      },
    });

    return ftTimespans.map((ts) => {
      return {
        id: ts.id,
        start: ts.start,
        end: ts.end,
        hasPriority: ts.hasPriority,
        category: ts.category,
        ft: {
          id: ts.timeWindows.ft.id,
          name: ts.timeWindows.ft.name,
        },
      };
    });
  }
}
