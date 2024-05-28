import { actionTree, mutationTree } from "typed-vuex";
import { CreateTransferForm, Transaction } from "@overbookd/personal-account";
import { safeCall } from "~/utils/api/calls";
import { TransactionRepository } from "~/repositories/transaction.repository";

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
      const res = await safeCall(
        this,
        TransactionRepository.getMyTransactions(this),
      );
      if (!res) return;
      commit("SET_MY_TRANSACTIONS", res.data.map(castTransactionWithDate));
    },

    async sendTransfer({ dispatch }, transferForm: CreateTransferForm) {
      const res = await safeCall(
        this,
        TransactionRepository.sendTransfer(this, transferForm),
        {
          successMessage: "Le virement a bien été effectué",
        },
      );
      if (!res) return;
      await dispatch("fetchMyTransactions");
      await dispatch("user/fetchMyInformation", null, { root: true });
    },
  },
);

function castTransactionWithDate(transaction: Transaction): Transaction {
  return {
    ...transaction,
    date: new Date(transaction.date),
  };
}
