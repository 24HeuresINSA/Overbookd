import type {
  CreateTransferForm,
  Transaction,
  TransactionWithSenderAndReceiver,
} from "@overbookd/personal-account";
import { HttpClient } from "~/utils/http/http-client";

export class TransactionRepository {
  private static readonly basePath = "transactions";

  static getTransactions() {
    return HttpClient.get<TransactionWithSenderAndReceiver[]>(this.basePath);
  }

  static getMyTransactions() {
    return HttpClient.get<Transaction[]>(`${this.basePath}/me`);
  }

  static createTransactions(transaction: Transaction[]) {
    return HttpClient.post<Transaction>(`${this.basePath}/sg`, transaction);
  }

  static deleteTransaction(transactionId: string) {
    return HttpClient.delete(`${this.basePath}/${transactionId}`);
  }

  static sendTransfer(transferForm: CreateTransferForm) {
    return HttpClient.post<CreateTransferForm>(
      `${this.basePath}/transfer`,
      transferForm,
    );
  }
}
