import type {
  InventoryGroupedRecord,
  InventoryRecord as Record,
} from "@overbookd/http";
import type { InventoryRecord } from "~/domain/inventory/inventory-record";
import { HttpClient } from "~/utils/http/http-client";

export class InventoryRepository {
  private static readonly basePath = "logistic/inventory";

  static setupInventory(InventoryRecords: InventoryRecord[]) {
    const records = InventoryRecords.map((record) => record.toJson());
    return HttpClient.post<InventoryGroupedRecord[]>(this.basePath, records);
  }

  static getGroupedRecords() {
    return HttpClient.get<InventoryGroupedRecord[]>(this.basePath);
  }

  static getRecords(gearId: number) {
    return HttpClient.get<Record[]>(`${this.basePath}/${gearId}`);
  }
}
