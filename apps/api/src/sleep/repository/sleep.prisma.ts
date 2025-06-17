import { numberGenerator } from "@overbookd/list";
import { PrismaService } from "../../prisma.service";
import {
  Beds,
  OccupiedBed,
  EmptyBed,
  Bed,
  Sleeper,
  AboutBed,
} from "@overbookd/sleep";

const SELECT_EMPTY_BED = {
  id: true,
  roomLabel: true,
  bedLabel: true,
};

const SELECT_COMPLETE_BED = {
  id: true,
  roomLabel: true,
  bedLabel: true,
  sleeperName: true,
  sleeperId: true,
  comment: true,
  wakeup: true,
};

export class PrismaSleep implements Beds {
  private idGenerator: Generator<number>;

  constructor(
    private readonly prisma: PrismaService,
    startId: number = 1,
  ) {
    this.idGenerator = numberGenerator(startId);
  }

  async wakeup(bedId: OccupiedBed["id"]): Promise<EmptyBed> {
    const saved = await this.prisma.bed.update({
      where: {
        id: bedId,
      },
      data: {
        sleeperId: null,
        comment: null,
        sleeperName: null,
        wakeup: null,
      },
      select: SELECT_EMPTY_BED,
    });
    return buildBed(saved);
  }

  async assign(bedId: EmptyBed["id"], sleeper: Sleeper): Promise<OccupiedBed> {
    const saved = await this.prisma.bed.update({
      where: {
        id: bedId,
      },
      data: {
        sleeperId: sleeper.id,
        comment: sleeper.comment,
        sleeperName: sleeper.name,
        wakeup: sleeper.wakeupTime,
      },
      select: SELECT_COMPLETE_BED,
    });
    return buildOccupiedBed(saved);
  }

  async create(bed: AboutBed): Promise<EmptyBed> {
    const id = this.idGenerator.next().value;
    const saved = await this.prisma.bed.create({
      data: {
        id: id,
        bedLabel: bed.label,
        roomLabel: bed.room.label,
      },
    });
    return buildBed(saved);
  }

  async createBatch(beds: AboutBed[]): Promise<EmptyBed[]> {
    const data = beds.map((bed) => ({
      id: this.idGenerator.next().value,
      bedLabel: bed.label,
      roomLabel: bed.room.label,
    }));
    const saved = await this.prisma.bed.createManyAndReturn({
      data,
    });
    return saved.map(buildBed);
  }

  async edit(bedId: number, bed: AboutBed, sleeper?: Sleeper): Promise<Bed> {
    const data = {
      roomLabel: bed.room.label,
      bedLabel: bed.label,
    };

    if (sleeper) {
      data["sleeperName"] = sleeper.name;
      data["comment"] = sleeper.comment;
      data["wakeup"] = sleeper.wakeupTime;
      data["sleeperId"] = sleeper.id;
    }

    const saved = await this.prisma.bed.update({
      where: {
        id: bedId,
      },
      data,
      select: SELECT_COMPLETE_BED,
    });
    return buildBed(saved);
  }

  async delete(bedId: number): Promise<void> {
    await this.prisma.bed.delete({
      where: {
        id: bedId,
      },
    });
    return;
  }

  async list(): Promise<Bed[]> {
    const beds = await this.prisma.bed.findMany({
      select: SELECT_COMPLETE_BED,
    });
    return beds.map(buildBed);
  }
}

type DatabaseBed = {
  id: number;
  roomLabel: string;
  bedLabel: string;
  sleeperName?: string;
  sleeperPhone?: string;
  sleeperId?: number;
  comment?: string;
  wakeup?: Date;
};

function buildOccupiedBed(entity: DatabaseBed): OccupiedBed {
  return {
    id: entity.id,
    bed: {
      room: {
        label: entity.roomLabel,
      },
      label: entity.bedLabel,
    },
    sleeper: {
      id: entity.sleeperId,
      name: entity.sleeperName,
      wakeupTime: entity.wakeup,
      comment: entity.comment,
    },
  };
}

function buildBed(entity: DatabaseBed): Bed {
  const base = {
    id: entity.id,
    bed: {
      room: {
        label: entity.roomLabel,
      },
      label: entity.bedLabel,
    },
  };

  const { sleeperName, sleeperPhone, wakeup } = entity;

  if (!sleeperName && !sleeperPhone && !wakeup) {
    return base;
  }

  return {
    ...base,
    sleeper: {
      id: entity.sleeperId,
      name: entity.sleeperName,
      wakeupTime: entity.wakeup,
      comment: entity.comment,
    },
  };
}
