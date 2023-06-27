import { mutationTree, actionTree, getterTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { updateItemToList } from "~/utils/functions/list";
import { EquipmentProposal } from "~/utils/models/Equipment";

const equipmentProposalRepo = RepoFactory.equipmentProposalRepo;

declare interface EquipmentProposalState {
  equipmentProposals: EquipmentProposal[];
}

export const state = (): EquipmentProposalState => ({
  equipmentProposals: [],
});

export const mutations = mutationTree(state, {
  SET_PROPOSALS(state, equipmentProposal: EquipmentProposal[]) {
    state.equipmentProposals = equipmentProposal;
  },
  SET_PROPOSAL(state, equipmentProposal: EquipmentProposal) {
    state.equipmentProposals.push(equipmentProposal);
  },
  DELETE_PROPOSAL(state, equipmentProposal: EquipmentProposal) {
    state.equipmentProposals = state.equipmentProposals.filter(
      (l) => l._id !== equipmentProposal._id
    );
  },
  UPDATE_PROPOSAL(state, equipmentProposal: EquipmentProposal) {
    const index = state.equipmentProposals.findIndex(
      (l) => l._id === equipmentProposal._id
    );
    state.equipmentProposals = updateItemToList(
      state.equipmentProposals,
      index,
      equipmentProposal
    );
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async getEquipmentProposal(context) {
      const res = await safeCall(
        this,
        equipmentProposalRepo.getEquipmentProposals(this)
      );
      if (res && res.data) {
        context.commit("SET_PROPOSALS", res.data);
      }
      return res;
    },
    async deleteEquipmentProposal(context, id: string) {
      const res = await safeCall(
        this,
        equipmentProposalRepo.deleteEquipmentProposal(this, id)
      );
      if (res && res.data) {
        context.commit("DELETE_PROPOSAL", res.data);
      }
      return res;
    },
    async createEquipmentProposal(context, eq: EquipmentProposal) {
      const res = await safeCall(
        this,
        equipmentProposalRepo.createEquipmentProposal(this, eq)
      );
      if (res && res.data) {
        context.commit("SET_PROPOSAL", res.data);
      }
      return res;
    },
    async validateEquipmentProposal(
      context,
      equipmentProposal: EquipmentProposal
    ) {
      const res = await safeCall(
        this,
        equipmentProposalRepo.validateEquipmentProposal(
          this,
          equipmentProposal._id!
        )
      );
      if (res && res.data) {
        if (equipmentProposal.isNewEquipment) {
          (context as any).commit("equipment/SET_EQUIPMENT", res.data, {
            root: true,
          });
        } else {
          (context as any).commit("equipment/UPDATE_EQUIPMENT", res.data, {
            root: true,
          });
        }
        context.commit("DELETE_PROPOSAL", equipmentProposal);
      }
      return res;
    },
    async refuseEquipmentProposal(
      context,
      equipmentProposal: EquipmentProposal
    ) {
      const res = await safeCall(
        this,
        equipmentProposalRepo.deleteEquipmentProposal(
          this,
          equipmentProposal._id!
        )
      );
      if (res && res.data) {
        context.commit("DELETE_PROPOSAL", equipmentProposal);
      }
      return res;
    },
  }
);

export const getters = getterTree(state, {
  count(state: EquipmentProposalState): number {
    return state.equipmentProposals.length;
  },
});
