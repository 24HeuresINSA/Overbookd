import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Timeline, TimelineFt } from './dto/timelineResponse.dto';
import { Period } from 'src/volunteer-availability/domain/period.model';

interface DatabaseFT {
  id: number;
  name: string;
  timeWindows: DatabaseTimespans[];
}

interface DatabaseTimespans {
  timespans: Period[];
}

interface DatabaseTimeline {
  id: number;
  name: string;
  fts: DatabaseFT[];
}

@Injectable()
export class TimelineService {
  constructor(private prisma: PrismaService) {}

  async getTimelines(start: Date, end: Date): Promise<Timeline[]> {
    const where = this.buildTimelineCondition(start, end);
    const select = this.buildTimelineSelection(start, end);

    const timelines = await this.prisma.fa.findMany({
      where,
      select,
    });
    return this.formatTimelines(timelines);
  }

  private buildTimelineSelection(start: Date, end: Date) {
    const ftsSelection = this.buildFtsSelection(start, end);
    const ftsCondition = this.buildFtsCondition(start, end);

    return {
      id: true,
      name: true,
      fts: {
        select: ftsSelection,
        where: ftsCondition,
      },
    };
  }

  private buildTimelineCondition(start: Date, end: Date) {
    const ftsCondition = this.buildFtsCondition(start, end);
    return { fts: { some: ftsCondition } };
  }

  private buildFtsSelection(start: Date, end: Date) {
    const timeWindowSelection = this.buildTimeWindowsWithTimespansSelection(
      start,
      end,
    );
    return {
      id: true,
      name: true,
      ...timeWindowSelection,
    };
  }

  private buildTimeWindowsWithTimespansSelection(start: Date, end: Date) {
    const overlapPeriodCondition = this.buildOverlapPeriodCondition(start, end);
    return {
      timeWindows: {
        select: {
          timespans: {
            where: overlapPeriodCondition,
            select: {
              start: true,
              end: true,
            },
          },
        },
      },
    };
  }

  private buildFtsCondition(start: Date, end: Date) {
    const overlapPeriodCondition = this.buildOverlapPeriodCondition(start, end);
    return {
      timeWindows: {
        some: {
          timespans: { some: overlapPeriodCondition },
        },
      },
    };
  }

  private buildOverlapPeriodCondition(start: Date, end: Date) {
    return {
      AND: [{ start: { lte: end } }, { end: { gte: start } }],
    };
  }

  private formatTimelines(timelines: DatabaseTimeline[]): Timeline[] {
    return timelines.map((timeline) => this.formatTimeline(timeline));
  }

  private formatTimeline(timeline: DatabaseTimeline): Timeline {
    const fts = this.formatFts(timeline.fts);
    return {
      fa: {
        id: timeline.id,
        name: timeline.name,
      },
      fts,
    };
  }

  private formatFts(fts: DatabaseFT[]): TimelineFt[] {
    return fts.map((ft) => ({
      id: ft.id,
      name: ft.name,
      timespans: this.formatTimespans(ft.timeWindows),
    }));
  }

  private formatTimespans(timespans: DatabaseTimespans[]): Period[] {
    return timespans.flatMap((timespan) =>
      timespan.timespans.map(({ start, end }) => ({
        start,
        end,
      })),
    );
  }
}
