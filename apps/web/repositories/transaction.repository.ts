import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { Transaction, Transfer } from '~/utils/models/transaction';

type Context = { $axios: NuxtAxiosInstance };

export class TransactionRepository {
  private static readonly basePath = 'transactions';

  static getTransactions(context: Context) {
    return context.$axios.get(this.basePath);
  }

  static getExpensesAndDeposits(context: Context) {
    return context.$axios.get(`${this.basePath}/sg`);
  }

  static getUserTransactions(context: Context) {
    return context.$axios.get(`${this.basePath}/me`);
  }

  static getTransactionsByUserID(context: Context, _id: string) {
    return context.$axios.get(`${this.basePath}/user/${_id}`);
  }

  static createTransactions(context: Context, transaction: Transaction[]) {
    return context.$axios.post(`${this.basePath}/sg`, transaction);
  }

  static createTransfer(context: Context, transfer: Partial<Transfer>) {
    return context.$axios.post(`${this.basePath}/transfer`, transfer);
  }

  static modifyTransaction(
    context: Context,
    transactionID: string,
    transaction: Transaction
  ) {
    return context.$axios.put(`${this.basePath}/${transactionID}`, transaction);
  }

  static deleteTransaction(context: Context, transactionID: string) {
    return context.$axios.delete(`${this.basePath}/${transactionID}`);
  }
}
