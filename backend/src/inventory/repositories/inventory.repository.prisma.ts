import { Injectable } from '@nestjs/common';
import { Gear } from 'src/catalog/interfaces';
import { convertGearToApiContract } from 'src/catalog/repositories/prisma/gear.repository.prisma';
import { PrismaService } from 'src/prisma.service';
import {
  GroupedRecord,
  InventoryRecord,
  InventoryRepository,
  LiteInventoryRecord,
} from '../inventory.service';

type AggregatedInventoryRecord = {
  gearId: number;
  _sum: {
    quantity: number;
  };
};

@Injectable()
export class PrismaInventoryRepository implements InventoryRepository {
  private readonly SELECT_GEAR = {
    id: true,
    name: true,
    isPonctualUsage: true,
    isConsumable: true,
    slug: true,
    category: {
      select: {
        id: true,
        name: true,
        path: true,
        owner: {
          select: {
            name: true,
            code: true,
          },
        },
      },
    },
  };

  private readonly SELECT_LITE_RECORD = {
    storage: true,
    quantity: true,
  };

  private readonly SELECT_RECORD = {
    ...this.SELECT_LITE_RECORD,
    gear: {
      select: this.SELECT_GEAR,
    },
  };

  constructor(private readonly prismaService: PrismaService) {}

  async getRecords(gearId: number): Promise<InventoryRecord[]> {
    const records = await this.prismaService.inventoryRecord.findMany({
      select: this.SELECT_RECORD,
      where: {
        gearId,
      },
    });
    return records.map((r) => ({
      storage: r.storage,
      quantity: r.quantity,
      gear: convertGearToApiContract(r.gear),
    }));
  }

  async searchGroupedRecords(gearSlug?: string): Promise<GroupedRecord[]> {
    const aggregatedRecords = await this.aggregateRecords(gearSlug);
    return Promise.all(
      aggregatedRecords.map((aggregation) =>
        this.convertToGroupedRecord(aggregation),
      ),
    );
  }

  async resetRecords(records: InventoryRecord[]): Promise<GroupedRecord[]> {
    await this.prismaService.$transaction([
      this.deleteAllRecords(),
      this.insertRecords(records),
    ]);
    return this.searchGroupedRecords();
  }

  private async findGear(gearId: number): Promise<Gear> {
    const gear = await this.prismaService.catalog_Gear.findUnique({
      select: this.SELECT_GEAR,
      where: { id: gearId },
    });
    return convertGearToApiContract(gear);
  }

  private deleteAllRecords() {
    return this.prismaService.inventoryRecord.deleteMany({ where: {} });
  }

  private insertRecords(records: InventoryRecord[]) {
    const data = records.map(({ storage, quantity, gear }) => ({
      quantity,
      storage,
      gearId: gear.id,
    }));
    return this.prismaService.inventoryRecord.createMany({
      data,
    });
  }

  private async getLiteRecords(gearId: number): Promise<LiteInventoryRecord[]> {
    return this.prismaService.inventoryRecord.findMany({
      select: this.SELECT_LITE_RECORD,
      where: { gearId },
    });
  }

  private aggregateRecords(gearSlug?: string) {
    const where = this.buildSearchCondition(gearSlug);
    return this.prismaService.inventoryRecord.groupBy({
      by: ['gearId'],
      _sum: {
        quantity: true,
      },
      where,
    });
  }

  private async convertToGroupedRecord(
    aggregation: AggregatedInventoryRecord,
  ): Promise<GroupedRecord> {
    const [gear, records] = await Promise.all([
      this.findGear(aggregation.gearId),
      this.getLiteRecords(aggregation.gearId),
    ]);
    const { quantity } = aggregation._sum;
    return { gear, quantity, records };
  }

  private buildSearchCondition(gearSlug: string) {
    return gearSlug ? { gear: { slug: { contains: gearSlug } } } : {};
  }
}
