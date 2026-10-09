import { Injectable } from "@nestjs/common";
import { InventoryRecord, InventoryRecords } from "@overbookd/logistic";
import { PrismaService } from "../../../prisma.service";
import { convertGearToApiContract, SELECT_GEAR } from "../../common/gear.query";

@Injectable()
export class PrismaInventoryRepository implements InventoryRecords {
  private readonly SELECT_LITE_RECORD = {
    storage: true,
    quantity: true,
    comment: true,
  };

  private readonly SELECT_RECORD = {
    ...this.SELECT_LITE_RECORD,
    gear: {
      select: SELECT_GEAR,
    },
  };

  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<InventoryRecord[]> {
    const records = await this.prismaService.inventoryRecord.findMany({
      select: this.SELECT_RECORD,
    });
    return records.map((record) => ({
      ...record,
      gear: convertGearToApiContract(record.gear),
    }));
  }

  async findByGearId(gearId: number): Promise<InventoryRecord[]> {
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

  async getStorages(): Promise<string[]> {
    const storages = await this.prismaService.inventoryRecord.findMany({
      distinct: ["storage"],
      select: { storage: true },
    });
    return storages.map(({ storage }) => storage);
  }

  async replaceAll(records: InventoryRecord[]): Promise<void> {
    await this.prismaService.$transaction([
      this.deleteAllRecords(),
      this.insertRecords(records),
    ]);
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
    return this.prismaService.inventoryRecord.createMany({ data });
  }
}
