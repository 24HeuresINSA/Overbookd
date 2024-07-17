import type {
  CreateDepositForm,
  CreateTransferForm,
  MyTransaction,
  TransactionWithSenderAndReceiver,
} from "@overbookd/personal-account";
import type {
  CreateBarrelTransactionsForm,
  CreateProvisionsTransactionsForm,
} from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class TransactionRepository {
  private static readonly basePath = "transactions";

  static getTransactions() {
    return HttpClient.get<TransactionWithSenderAndReceiver[]>(this.basePath);
  }

  static getMyTransactions() {
    return HttpClient.get<MyTransaction[]>(`${this.basePath}/me`);
  }

  static createDeposits(deposits: CreateDepositForm[]) {
    return HttpClient.post<void>(`${this.basePath}/deposits`, deposits);
  }

  static createBarrelTransactions(transactions: CreateBarrelTransactionsForm) {
    return HttpClient.post<void>(`${this.basePath}/barrels`, transactions);
  }

  static createProvisionsTransactions(
    transactions: CreateProvisionsTransactionsForm,
  ) {
    return HttpClient.post<void>(`${this.basePath}/provisions`, transactions);
  }

  static deleteTransaction(transactionId: number) {
    return HttpClient.delete(`${this.basePath}/${transactionId}`);
  }

  static sendTransfer(transferForm: CreateTransferForm) {
    return HttpClient.post<CreateTransferForm>(
      `${this.basePath}/transfer`,
      transferForm,
    );
  }
}
