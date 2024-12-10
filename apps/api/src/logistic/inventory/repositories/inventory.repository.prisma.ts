import { Injectable } from "@nestjs/common";
import { convertGearToApiContract } from "../../catalog/repositories/prisma/gear.repository.prisma";
import { InventoryRepository } from "../inventory.service";
import { PrismaService } from "../../../prisma.service";
import {
  InventoryGroupedRecord,
  InventoryRecord,
  InventoryRecordSearchOptions,
} from "@overbookd/http";
import { SlugifyService } from "@overbookd/slugify";
import { InventoryRecordSearchBuilder } from "../../common/inventory-record-search.builder.filter";
import { GroupInventoryRecord } from "../inventory-grouped-record";

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

  private readonly SELECT_STORAGE = {
    storage: true,
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
      .filter((record) => this.isMatchingSearch(options, record))
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

  async getStorages(): Promise<string[]> {
    const storages = await this.prismaService.inventoryRecord.findMany({
      distinct: ["storage"],
      select: this.SELECT_STORAGE,
    });
    return storages.map((storage) => storage.storage);
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
    const data = records.map(({ storage, quantity, gear }) => ({
      quantity,
      storage,
      gearId: gear.id,
    }));
    return this.prismaService.inventoryRecord.createMany({
      data,
    });
  }

  private isMatchingSearch(
    {
      category,
      search,
      owner,
      ponctualUsage,
      storage,
    }: InventoryRecordSearchOptions,
    record: InventoryRecord,
  ): boolean {
    const slug = SlugifyService.applyOnOptional(search);
    const categorySlug = SlugifyService.applyOnOptional(category);
    const ownerSlug = SlugifyService.applyOnOptional(owner);
    const storageSlug = SlugifyService.applyOnOptional(storage);

    const gearSearch = new InventoryRecordSearchBuilder(record)
      .addCategoryCondition(categorySlug)
      .addSlugCondition(slug)
      .addOwnerCondition(ownerSlug)
      .addPonctualUsageCondition(ponctualUsage)
      .addStorageCondition(storageSlug);
    return gearSearch.match;
  }
}
