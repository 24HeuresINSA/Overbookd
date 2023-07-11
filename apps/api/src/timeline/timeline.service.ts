import { Injectable } from '@nestjs/common';
import { Period } from '@overbookd/period';
import { PrismaService } from '../../src/prisma.service';
import { TimelineEvent, TimelineFt } from './timeline.model';

interface DatabaseFT {
  id: number;
  name: string;
  timeWindows: DatabaseTimeWindow[];
  hasPriority?: boolean;
}

type DatabaseTimeSpan = Period & {
  id: number;
};

interface DatabaseTimeWindow extends Period {
  timeSpans: DatabaseTimeSpan[];
}

interface DatabaseTimeline {
  id: number;
  name: string;
  Team: { code: string };
  fts: DatabaseFT[];
}

@Injectable()
export class TimelineService {
  constructor(private prisma: PrismaService) {}

  async getTimelines(start: Date, end: Date): Promise<TimelineEvent[]> {
    const where = this.buildTimelineCondition(start, end);
    const select = this.buildTimelineSelection(start, end);

    const timelines = await this.prisma.fa.findMany({
      where,
      select,
    });
    return formatTimelines(timelines);
  }

  private buildTimelineSelection(start: Date, end: Date) {
    const ftsSelection = this.buildFtsSelection(start, end);
    const ftsCondition = this.buildFtsCondition(start, end);

    return {
      id: true,
      name: true,
      Team: {
        select: { code: true },
      },
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
    const timeWindowSelection = this.buildTimeWindowsWithTimeSpansSelection(
      start,
      end,
    );

    return {
      id: true,
      name: true,
      hasPriority: true,
      ...timeWindowSelection,
    };
  }

  private buildTimeWindowsWithTimeSpansSelection(start: Date, end: Date) {
    const overlapPeriodCondition = this.buildOverlapPeriodCondition(start, end);
    return {
      timeWindows: {
        where: overlapPeriodCondition,
        select: {
          start: true,
          end: true,
          timeSpans: {
            where: overlapPeriodCondition,
            select: {
              start: true,
              end: true,
              id: true,
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
          timeSpans: { some: overlapPeriodCondition },
        },
      },
    };
  }

  private buildOverlapPeriodCondition(start: Date, end: Date) {
    return { start: { lt: end }, end: { gt: start } };
  }
}

function formatTimelines(timelines: DatabaseTimeline[]): TimelineEvent[] {
  return timelines.map(formatTimeline);
}

function formatTimeline(timeline: DatabaseTimeline): TimelineEvent {
  const fts = formatFts(timeline.fts);
  return {
    fa: {
      id: timeline.id,
      name: timeline.name,
      team: timeline.Team.code,
    },
    fts,
  };
}

function formatFts(fts: DatabaseFT[]): TimelineFt[] {
  return fts.map((ft) => ({
    id: ft.id,
    name: ft.name,
    hasPriority: ft.hasPriority ?? false,
    timeWindows: ft.timeWindows,
  }));
}
