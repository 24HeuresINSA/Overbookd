import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { Transaction, Transfer } from "~/utils/models/repo";
import { safeCall } from "~/utils/api/calls";

const transactionRepo = RepoFactory.transactionRepo;

export const state = () => ({
  mTransactions: [] as Transaction[],
});

export type TransactionState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_TRANSACTIONS(state: TransactionState, data: Transaction[]) {
    state.mTransactions = data;
  },
  ADD_TRANSACTIONS(state: TransactionState, data: Transfer) {
    state.mTransactions.unshift(data);
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchMTransactions({ commit }) {
      const res = await safeCall(
        this,
        transactionRepo.getUserTransactions(this)
      );
      if (res) {
        commit("SET_TRANSACTIONS", res.data);
      }
    },
    async addTransaction({ commit }, transfer: Partial<Transfer>) {
      const res = await safeCall(
        this,
        transactionRepo.createTransfer(this, transfer)
      );
      if (res) {
        commit("ADD_TRANSACTIONS", transfer);
        return true;
      }
      return false;
    },
  }
);
