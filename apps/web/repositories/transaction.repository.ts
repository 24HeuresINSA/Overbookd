import { CreateTransferForm, Transaction } from "@overbookd/personal-account";
import { Context } from "./context";

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

  static deleteTransaction(context: Context, transactionId: string) {
    return context.$axios.delete(`${this.basePath}/${transactionId}`);
  }

  static sendTransfer(context: Context, transferForm: CreateTransferForm) {
    return context.$axios.post(`${this.basePath}/transfer`, transferForm);
  }
}
