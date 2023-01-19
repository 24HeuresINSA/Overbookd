import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { InventoryRecord } from "~/domain/inventory/inventory-record";
import { GroupedRecordWithoutDetailedRecords } from "~/store/inventory";

export type Context = { $axios: NuxtAxiosInstance };

export class InventoryRepository {
  private static readonly basePath = "inventory";

  static setupInventory(context: Context, inventoryRecords: InventoryRecord[]) {
    const records = inventoryRecords.map((record) => record.toJson());
    return context.$axios.post<GroupedRecordWithoutDetailedRecords[]>(
      this.basePath,
      records
    );
  }

  static getGroupedRecords(context: Context) {
    return context.$axios.get<GroupedRecordWithoutDetailedRecords[]>(
      this.basePath
    );
  }

  static getRecords(context: Context, gearId: number) {
    return context.$axios.get<InventoryRecord[]>(`${this.basePath}/${gearId}`);
  }
}
