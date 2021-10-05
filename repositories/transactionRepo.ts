import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Transaction, Transfer } from "~/utils/models/repo";

const resource = "/transaction";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getTransactions(context: Context) {
    return context.$axios.get(resource);
  },

  getExpensesAndDeposits(context: Context) {
    return context.$axios.get(`${resource}/sg`);
  },

  getUserTransactions(context: Context) {
    return context.$axios.get(`${resource}/user`);
  },

  getTransactionsByKeycloakID(context: Context, keycloakID: string) {
    return context.$axios.get(`${resource}/user/${keycloakID}`);
  },

  createTransactions(context: Context, transaction: Transaction[]) {
    return context.$axios.post(`${resource}/sg`, transaction);
  },

  createTransfer(context: Context, transfer: Transfer) {
    return context.$axios.post(`${resource}/transfer`, transfer);
  },

  modifyTransaction(
    context: Context,
    transactionID: string,
    transaction: Transaction
  ) {
    return context.$axios.put(`${resource}/${transactionID}`, transaction);
  },

  deleteTransaction(context: Context, transactionID: string) {
    return context.$axios.delete(`${resource}/${transactionID}`);
  },
};
