import { mutationTree, getterTree, actionTree } from "typed-vuex";
import { InventoryRecord } from "~/domain/inventory/inventory-record";
import { safeCall } from "~/utils/api/calls";
import { Gear } from "~/utils/models/catalog.model";
import { RepoFactory } from "~/repositories/repoFactory";
import { updateItemToList } from "~/utils/functions/list";

const inventoryRepository = RepoFactory.InventoryRepository;

export interface InventoryGroupedRecord {
  gear: Gear;
  quantity: number;
  records: InventoryRecord[];
}

export type GroupedRecordWithoutDetailedRecords = Omit<
  InventoryGroupedRecord,
  "records"
>;

interface State {
  groupedRecords: InventoryGroupedRecord[];
}

export const state = (): State => ({
  groupedRecords: [],
});

export const getters = getterTree(state, {});

export const mutations = mutationTree(state, {
  SET_GROUPED_RECORDS(state, groupedRecords: InventoryGroupedRecord[]) {
    state.groupedRecords = groupedRecords;
  },
  UPDATE_GEAR_RECORDS(
    state,
    { records, gearId }: { records: InventoryRecord[]; gearId: number }
  ) {
    const groupedRecordIndex = state.groupedRecords.findIndex(
      (groupedRecord) => groupedRecord.gear.id === gearId
    );
    if (groupedRecordIndex === -1) return;
    const updatedGroupedRecord = {
      ...state.groupedRecords[groupedRecordIndex],
      records,
    };
    state.groupedRecords = updateItemToList(
      state.groupedRecords,
      groupedRecordIndex,
      updatedGroupedRecord
    );
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async importInventory(context, records: InventoryRecord[]): Promise<void> {
      const res = await safeCall(
        this,
        inventoryRepository.setupInventory(this, records),
        {
          successMessage: "L'inventaire a ete reinitialise avec succes",
          errorMessage: "Erreur lors de la reinitialisation de l'inventaire",
        }
      );
      if (!res) return;
      context.dispatch("updateGroupedRecords", res.data);
    },

    async fetchGroupedRecords(context): Promise<void> {
      const res = await safeCall(
        this,
        inventoryRepository.getGroupedRecords(this)
      );
      if (!res) return;
      context.dispatch("updateGroupedRecords", res.data);
    },

    updateGroupedRecords(
      context,
      liteGroupedRecords: GroupedRecordWithoutDetailedRecords[]
    ) {
      const groupedRecords: InventoryGroupedRecord[] = liteGroupedRecords.map(
        (record) => ({
          ...record,
          records: [],
        })
      );
      context.commit("SET_GROUPED_RECORDS", groupedRecords);
    },

    async fetchRecords(context, gearId: number): Promise<void> {
      console.warn("fetching details for gear #", gearId);
      const res = await safeCall(
        this,
        inventoryRepository.getRecords(this, gearId)
      );
      if (!res) return;
      context.commit("UPDATE_GEAR_RECORDS", { records: res.data, gearId });
    },
  }
);
