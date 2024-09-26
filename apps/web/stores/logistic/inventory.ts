import { updateItemToList } from "@overbookd/list";
import { InventoryRecord } from "~/domain/inventory/inventory-record";
import type { InventoryGroupedRecord } from "@overbookd/http";
import { isHttpError } from "~/utils/http/http-error.utils";
import { InventoryRepository } from "~/repositories/logistic/inventory.repository";

type State = {
  groupedRecords: InventoryGroupedRecord[];
};

export const useInventoryStore = defineStore("inventory", {
  state: (): State => ({
    groupedRecords: [],
  }),
  actions: {
    async importInventory(records: InventoryRecord[]) {
      const res = await InventoryRepository.setupInventory(records);
      if (isHttpError(res)) return;
      sendSuccessNotification("L'inventaire a été reinitialisé");
      this.groupedRecords = res;
    },

    async fetchGroupedRecords() {
      const res = await InventoryRepository.getGroupedRecords();
      if (isHttpError(res)) return;
      this.groupedRecords = res;
    },

    async fetchRecords(gearId: number): Promise<void> {
      const res = await InventoryRepository.getRecords(gearId);
      if (isHttpError(res)) return;
      const records = res.map(
        ({ gear, quantity, storage }) =>
          new InventoryRecord(gear, quantity, storage),
      );
      this._updateGearRecords(records, gearId);
    },

    _updateGearRecords(records: InventoryRecord[], gearId: number) {
      const groupedRecordIndex = this.groupedRecords.findIndex(
        (groupedRecord) => groupedRecord.gear.id === gearId,
      );
      if (groupedRecordIndex === -1) return;

      const groupedRecord = this.groupedRecords.at(groupedRecordIndex);
      if (!groupedRecord) return;

      const updatedGroupedRecord = {
        ...groupedRecord,
        records: records.map((r) => r.toLiteRecord()),
      };
      this.groupedRecords = updateItemToList(
        this.groupedRecords,
        groupedRecordIndex,
        updatedGroupedRecord,
      );
    },
  },
});
