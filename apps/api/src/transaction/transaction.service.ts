import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { User } from "@prisma/client";
import { SELECT_COMPLETE_TRANSACTION } from "./repository/transaction.query";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";
import {
  PastSharedMeal,
  SharedMealPayment,
  SharedMealTransaction,
  MyTransaction,
  TransactionWithSenderAndReceiver,
  CreateDepositForm,
  Deposit,
  CreateBarrelTransaction,
  CreateBarrelTransactions,
  ConfiguredBarrel,
  CreateProvisionsTransactions,
  CreateProvisionsTransaction,
} from "@overbookd/personal-account";
import { PrismaTransactions } from "./repository/transactions.prisma";
import { DomainEventService } from "../domain-event/domain-event.service";

export type Barrels = {
  findBySlug: (slug: string) => Promise<ConfiguredBarrel>;
};

type Repositories = {
  transactions: Readonly<PrismaTransactions>;
  barrels: Readonly<Barrels>;
};

type UseCases = {
  deposit: Readonly<Deposit>;
  barrelTransactions: Readonly<CreateBarrelTransactions>;
  provisionsTransactions: Readonly<CreateProvisionsTransactions>;
};

@Injectable()
export class TransactionService implements OnApplicationBootstrap {
  private logger = new Logger(TransactionService.name);

  constructor(
    private readonly repositories: Repositories,
    private readonly useCases: UseCases,
    private readonly prisma: PrismaService,
    private readonly eventStore: DomainEventService,
  ) {}

  onApplicationBootstrap() {
    this.eventStore.closedSharedMeal.subscribe((event) => {
      const mealTransactionsMessage = `Shared meal #${event.id} closed... Generating related transactions`;
      this.logger.log(mealTransactionsMessage);
      this.generateForMeal(event);
    });
  }

  async getAllTransactions(): Promise<TransactionWithSenderAndReceiver[]> {
    const transactions = await this.prisma.transaction.findMany({
      select: SELECT_COMPLETE_TRANSACTION,
      orderBy: { createdAt: "desc" },
    });
    return transactions.map(({ createdAt, ...transaction }) => ({
      ...transaction,
      date: createdAt,
    }));
  }

  async getMyTransactions(user: JwtPayload): Promise<MyTransaction[]> {
    return this.repositories.transactions.getMine(user.id);
  }

  async addDeposits(deposits: CreateDepositForm[]): Promise<void> {
    await this.useCases.deposit.applyMultiple(deposits);
  }

  async addBarrelTransactions(
    barrelSlug: string,
    transactions: CreateBarrelTransaction[],
  ): Promise<void> {
    const barrel = await this.repositories.barrels.findBySlug(barrelSlug);
    await this.useCases.barrelTransactions.apply(barrel, transactions);
  }

  async addProvisionsTransactions(
    stickPrice: number,
    transactions: CreateProvisionsTransaction[],
  ): Promise<void> {
    await this.useCases.provisionsTransactions.apply(stickPrice, transactions);
  }

  async deleteTransaction(id: number): Promise<void> {
    await this.checkTransactionExistence(id);
    await this.prisma.transaction.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  private async generateForMeal(event: PastSharedMeal) {
    const transactions = SharedMealPayment.refound(event);
    const unitAmount = transactions.at(0)?.amount ?? 0;

    await this.prisma.$transaction([
      this.createMealTransactions(transactions, event),
      this.updateChefBalance(transactions, unitAmount, event),
      this.updateGuestsBalance(transactions, unitAmount),
    ]);
  }

  private updateGuestsBalance(
    transactions: SharedMealTransaction[],
    unitAmount: number,
  ) {
    const guestBalanceUpdateMessage = `Decrementing ${transactions.length} balances by ${unitAmount}`;
    this.logger.debug(guestBalanceUpdateMessage);
    return this.prisma.user.updateMany({
      where: { id: { in: transactions.map(({ from }) => from) } },
      data: { balance: { decrement: unitAmount } },
    });
  }

  private updateChefBalance(
    transactions: SharedMealTransaction[],
    unitAmount: number,
    event: PastSharedMeal,
  ) {
    const chefBalanceIncrement = transactions.length * unitAmount;
    const chefBalanceIncrementMessage = `Incrementing ${event.chef.name} balance by ${chefBalanceIncrement}`;
    this.logger.debug(chefBalanceIncrementMessage);
    return this.prisma.user.update({
      where: { id: event.chef.id },
      data: { balance: { increment: chefBalanceIncrement } },
    });
  }

  private createMealTransactions(
    transactions: SharedMealTransaction[],
    event: PastSharedMeal,
  ) {
    const mealTransactionsMessage = `Generating ${transactions.length} transactions for meal #${event.id}`;
    this.logger.log(mealTransactionsMessage);
    return this.prisma.transaction.createMany({
      data: transactions,
    });
  }

  private async userExists(userIds: number[]): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
    });
    if (users.length !== userIds.length) {
      throw new NotFoundException("User does not exist");
    }
    return users;
  }

  private checkTransactionAmount(amount: number): void {
    if (amount <= 0) {
      throw new BadRequestException("Amount must be greater than 0");
    }
    const decimal = amount.toString().split(".")[1];
    if (decimal && decimal.length > 2) {
      throw new BadRequestException("Amount must be a max of 2 decimal places");
    }
  }

  private async checkTransactionExistence(transactionId: number) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id: transactionId },
      select: SELECT_COMPLETE_TRANSACTION,
    });
    if (!transaction) {
      throw new NotFoundException(
        `Transaction with ID ${transactionId} not found`,
      );
    }
    if (transaction.isDeleted) {
      throw new BadRequestException(
        `Transaction with ID ${transactionId} is already deleted`,
      );
    }
  }

  private async getUserBalanceUpdateOperationParameters(
    transaction: TransactionWithSenderAndReceiver,
  ) {
    return Promise.all([
      this.getReceiverBalanceUpdateOperationParameter(transaction),
      this.getSenderBalanceUpdateOperationParameter(transaction),
    ]);
  }

  private async getReceiverBalanceUpdateOperationParameter(
    transaction: TransactionWithSenderAndReceiver,
  ) {
    if (!this.shouldUpdateReceiverBalance(transaction.type)) {
      return undefined;
    }
    const [receiver] = await this.userExists([transaction.payee.id]);
    return {
      where: { id: receiver.id },
      data: { balance: receiver.balance - transaction.amount },
    };
  }

  private async getSenderBalanceUpdateOperationParameter(
    transaction: TransactionWithSenderAndReceiver,
  ) {
    if (!this.shouldUpdateSenderBalance(transaction.type)) {
      return undefined;
    }
    const [sender] = await this.userExists([transaction.payor.id]);
    return {
      where: { id: sender.id },
      data: { balance: sender.balance + transaction.amount },
    };
  }

  private shouldUpdateReceiverBalance(transactionType: string): boolean {
    return ["DEPOSIT", "TRANSFER"].includes(transactionType);
  }

  private shouldUpdateSenderBalance(transactionType: string): boolean {
    return ["BARREL", "PROVISIONS", "TRANSFER"].includes(transactionType);
  }
}
