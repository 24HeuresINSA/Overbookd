import { Injectable } from "@nestjs/common";
import { InventoryRepository } from "../inventory.service";
import { PrismaService } from "../../../prisma.service";
import {
  InventoryGroupedRecord,
  InventoryRecord,
  InventoryRecordSearchOptions,
} from "@overbookd/http";
import { matchesInventorySearch } from "../inventory-record-search.builder";
import { GroupInventoryRecord } from "../inventory-grouped-record";
import { convertGearToApiContract } from "../../common/gear.query";

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
    comment: true,
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
      comment: r.comment,
      gear: convertGearToApiContract(r.gear),
    }));
  }

  async searchGroupedRecords(
    options: InventoryRecordSearchOptions = {},
  ): Promise<InventoryGroupedRecord[]> {
    const databaseRecords = await this.prismaService.inventoryRecord.findMany({
      select: this.SELECT_RECORD,
    });
    const records = databaseRecords.map((record) => {
      const gear = convertGearToApiContract(record.gear);
      return { ...record, gear };
    });
    return records
      .filter((record) => matchesInventorySearch(record, options))
      .reduce((groupedRecords, record) => {
        const groupedRecord = GroupInventoryRecord.fromInventoryRecord(record);
        const similarRecordIndex = groupedRecords.findIndex(
          GroupInventoryRecord.isSimilar(groupedRecord),
        );
        if (similarRecordIndex === -1)
          return [...groupedRecords, groupedRecord];
        const existingRecord = groupedRecords.at(similarRecordIndex);
        const mergedRecord = groupedRecord.add(existingRecord);
        return [
          ...groupedRecords.slice(0, similarRecordIndex),
          mergedRecord,
          ...groupedRecords.slice(similarRecordIndex + 1),
        ];
      }, []);
  }

  async getStoragesHavingGear(): Promise<string[]> {
    const storages = await this.prismaService.inventoryRecord.findMany({
      distinct: ["storage"],
      select: { storage: true },
    });
    return storages.map(({ storage }) => storage);
  }

  async resetRecords(
    records: InventoryRecord[],
  ): Promise<InventoryGroupedRecord[]> {
    await this.prismaService.$transaction([
      this.deleteAllRecords(),
      this.insertRecords(records),
    ]);
    return this.searchGroupedRecords();
  }

  private deleteAllRecords() {
    return this.prismaService.inventoryRecord.deleteMany({});
  }

  private insertRecords(records: InventoryRecord[]) {
    const data = records.map(({ storage, quantity, comment, gear }) => ({
      quantity,
      storage,
      comment,
      gearId: gear.id,
    }));
    return this.prismaService.inventoryRecord.createMany({
      data,
    });
  }
}
