import { actionTree, mutationTree } from "typed-vuex";
import { Transaction } from "~/utils/models/transaction.model";
import { FakeTransactionRepository } from "~/repositories/transaction.repository";

export const state = () => ({
  myTransactions: [] as Transaction[],
});

export type TransactionState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_MY_TRANSACTIONS(state: TransactionState, myTransactions: Transaction[]) {
    state.myTransactions = myTransactions;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchMyTransactions({ commit }) {
      const res = FakeTransactionRepository.getMyTransactions();
      commit("SET_MY_TRANSACTIONS", res);
    },
  },
);
