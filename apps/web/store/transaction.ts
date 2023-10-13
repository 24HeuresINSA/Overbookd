import { actionTree, mutationTree } from "typed-vuex";
import { Transaction } from "@overbookd/personal-account";
import { RepoFactory } from "~/repositories/repo-factory";
import { safeCall } from "~/utils/api/calls";

const repo = RepoFactory.TransactionRepository;

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
      const res = await safeCall(this, repo.getMyTransactions(this));
      if (!res) return;
      commit("SET_MY_TRANSACTIONS", res.data.map(castTransactionWithDate));
    },
  },
);

function castTransactionWithDate(transaction: Transaction): Transaction {
  return {
    ...transaction,
    date: new Date(transaction.date),
  };
}
