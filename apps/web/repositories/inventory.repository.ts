import { InventoryRecord } from "~/domain/inventory/inventory-record";
import { Context } from "../utils/api/axios";
import { InventoryGroupedRecord } from "@overbookd/http";

export class InventoryRepository {
  private static readonly basePath = "logistic/inventory";

  static setupInventory(context: Context, inventoryRecords: InventoryRecord[]) {
    const records = inventoryRecords.map((record) => record.toJson());
    return context.$axios.post<InventoryGroupedRecord[]>(
      this.basePath,
      records,
    );
  }

  static getGroupedRecords(context: Context) {
    return context.$axios.get<InventoryGroupedRecord[]>(this.basePath);
  }

  static getRecords(context: Context, gearId: number) {
    return context.$axios.get<InventoryRecord[]>(`${this.basePath}/${gearId}`);
  }
}
