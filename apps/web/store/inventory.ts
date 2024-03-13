import { mutationTree, getterTree, actionTree } from "typed-vuex";
import { updateItemToList } from "@overbookd/list";
import {
  InventoryRecord,
  LiteInventoryRecord,
} from "~/domain/inventory/inventory-record";
import { safeCall } from "~/utils/api/calls";
import { Gear } from "~/utils/models/catalog.model";
import { InventoryRepository } from "~/repositories/inventory.repository";

export type InventoryGroupedRecord = {
  gear: Gear;
  quantity: number;
  records: LiteInventoryRecord[];
};

type State = {
  groupedRecords: InventoryGroupedRecord[];
};

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
    { records, gearId }: { records: InventoryRecord[]; gearId: number },
  ) {
    const groupedRecordIndex = state.groupedRecords.findIndex(
      (groupedRecord) => groupedRecord.gear.id === gearId,
    );
    if (groupedRecordIndex === -1) return;

    const groupedRecord = state.groupedRecords.at(groupedRecordIndex);
    if (!groupedRecord) return;

    const updatedGroupedRecord = {
      ...groupedRecord,
      records: records.map((r) => r.toLiteRecord()),
    };
    state.groupedRecords = updateItemToList(
      state.groupedRecords,
      groupedRecordIndex,
      updatedGroupedRecord,
    );
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async importInventory(
      { commit },
      records: InventoryRecord[],
    ): Promise<void> {
      const res = await safeCall(
        this,
        InventoryRepository.setupInventory(this, records),
        {
          successMessage: "L'inventaire a ete reinitialise avec succes ✅",
          errorMessage: "Erreur lors de la reinitialisation de l'inventaire ❌",
        },
      );
      if (!res) return;
      commit("SET_GROUPED_RECORDS", res.data);
    },

    async fetchGroupedRecords({ commit }): Promise<void> {
      const res = await safeCall(
        this,
        InventoryRepository.getGroupedRecords(this),
      );
      if (!res) return;
      commit("SET_GROUPED_RECORDS", res.data);
    },

    async fetchRecords({ commit }, gearId: number): Promise<void> {
      console.warn("fetching details for gear #", gearId);
      const res = await safeCall(
        this,
        InventoryRepository.getRecords(this, gearId),
      );
      if (!res) return;
      commit("UPDATE_GEAR_RECORDS", { records: res.data, gearId });
    },
  },
);
