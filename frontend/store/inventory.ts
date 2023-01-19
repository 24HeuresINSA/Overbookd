import { mutationTree, getterTree, actionTree } from "typed-vuex";
import { InventoryRecord } from "~/domain/inventory/inventory-record";
import { safeCall } from "~/utils/api/calls";
import { Gear } from "~/utils/models/catalog.model";
import { RepoFactory } from "~/repositories/repoFactory";

const inventoryRepository = RepoFactory.InventoryRepository;

export interface InventoryGroupedRecord {
  gear: Gear;
  quantity: number;
  records: InventoryRecord[];
}

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
      const groupedRecords: InventoryGroupedRecord[] = res.data.map(
        (record) => ({
          ...record,
          records: [],
        })
      );
      context.commit("SET_GROUPED_RECORDS", groupedRecords);
    },
    async fetchGroupedRecords(context): Promise<void> {
      const res = await safeCall(
        this,
        inventoryRepository.getGroupedRecords(this)
      );
      if (!res) return;
      const groupedRecords: InventoryGroupedRecord[] = res.data.map(
        (record) => ({
          ...record,
          records: [],
        })
      );
      context.commit("SET_GROUPED_RECORDS", groupedRecords);
    },
    async fetchRecords(context, gearId: number): Promise<void> {
      console.warn("fetching details for gear #", gearId);
    },
  }
);
