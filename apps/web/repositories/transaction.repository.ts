import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Transaction } from "@overbookd/personal-account";

type Context = { $axios: NuxtAxiosInstance };

export class TransactionRepository {
  private static readonly basePath = "transactions";

  static getTransactions(context: Context) {
    return context.$axios.get(this.basePath);
  }

  static getMyTransactions(context: Context) {
    return context.$axios.get(`${this.basePath}/me`);
  }

  static createTransactions(context: Context, transaction: Transaction[]) {
    return context.$axios.post(`${this.basePath}/sg`, transaction);
  }

  static deleteTransaction(context: Context, transactionID: string) {
    return context.$axios.delete(`${this.basePath}/${transactionID}`);
  }
}
