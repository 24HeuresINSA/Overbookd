import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Transaction, TransactionType } from '@prisma/client';
import { User } from '@prisma/client';

type CreateTransaction = Omit<
  Transaction,
  'id' | 'from' | 'type' | 'is_deleted' | 'created_at'
>;

const SELECT_TRANSACTION_USER = {
  id: true,
  firstname: true,
  lastname: true,
};

const SELECT_TRANSACTION = {
  id: true,
  type: true,
  user_from: {
    select: SELECT_TRANSACTION_USER,
  },
  user_to: {
    select: SELECT_TRANSACTION_USER,
  },
  amount: true,
  context: true,
  created_at: true,
  is_deleted: true,
};

type TransactionUser = Pick<User, 'id' | 'lastname' | 'firstname'>;

export type TransactionWithSenderAndReceiver = Omit<
  Transaction,
  'to' | 'from'
> & {
  user_from: TransactionUser;
  user_to: TransactionUser;
};

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}
  /**     **/
  /** GET **/
  /**     **/
  async getAllTransactions(): Promise<TransactionWithSenderAndReceiver[]> {
    return this.prisma.transaction.findMany({
      select: SELECT_TRANSACTION,
      orderBy: { created_at: 'desc' },
    });
  }

  async getTransactionById(
    id: number,
  ): Promise<TransactionWithSenderAndReceiver | null> {
    return this.prisma.transaction.findUnique({
      select: SELECT_TRANSACTION,
      where: { id: Number(id) },
    });
  }

  async getUserTransactions(
    userId: number,
  ): Promise<TransactionWithSenderAndReceiver[] | null> {
    return this.prisma.transaction.findMany({
      select: SELECT_TRANSACTION,
      where: { OR: [{ from: Number(userId) }, { to: Number(userId) }] },
      orderBy: { created_at: 'desc' },
    });
  }

  /**      **/
  /** POST **/
  /**      **/
  async createTransaction(
    userTransaction: CreateTransaction,
    userId: number,
  ): Promise<TransactionWithSenderAndReceiver> {
    const data = {
      ...userTransaction,
      from: userId,
      type: TransactionType.TRANSFER,
    };
    this.checkTransactionAmount(data.amount);
    const users = await this.userExists([data.from, data.to]);
    const sender = users.find((user) => user.id === data.from);
    const receiver = users.find((user) => user.id === data.to);

    const senderBalance = sender.balance - data.amount;
    const receiverBalance = receiver.balance + data.amount;
    const [transaction] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        select: SELECT_TRANSACTION,
        data: data,
      }),
      this.prisma.user.update({
        where: { id: Number(data.from) },
        data: { balance: senderBalance },
      }),
      this.prisma.user.update({
        where: { id: Number(data.to) },
        data: { balance: receiverBalance },
      }),
    ]);
    return transaction;
  }

  async addSgTransaction(
    transactions: Transaction[],
  ): Promise<TransactionWithSenderAndReceiver[]> {
    return Promise.all(
      transactions.map(async (transaction) => {
        this.checkTransactionAmount(transaction.amount);
        //Check if user exists
        const userId =
          transaction.type === 'DEPOSIT' ? transaction.to : transaction.from;
        const users = await this.userExists([userId]);
        const user = users.find((user) => user.id === userId);
        const newBalance =
          transaction.type === 'DEPOSIT'
            ? user.balance + transaction.amount
            : user.balance - transaction.amount;
        //Update the user and create the transaction
        const [savedTransaction] = await this.prisma.$transaction([
          this.prisma.transaction.create({
            select: SELECT_TRANSACTION,
            data: transaction,
          }),
          this.prisma.user.update({
            where: { id: Number(userId) },
            data: { balance: newBalance },
          }),
        ]);
        return savedTransaction;
      }),
    );
  }

  /**        **/
  /** DELETE **/
  /**        **/
  async deleteTransaction(id: number): Promise<void> {
    const transaction = await this.transactionExists(id);

    const updateTransactionOperation = this.prisma.transaction.update({
      where: { id: Number(id) },
      data: { is_deleted: true },
    });

    const balanceOperationParameters =
      await this.getUserBalanceUpdateOperationParameters(transaction);

    const balanceOperations = balanceOperationParameters
      .filter((operation) => operation !== undefined)
      .map((operation) => this.prisma.user.update(operation));

    const operations = [updateTransactionOperation, ...balanceOperations];
    await this.prisma.$transaction(operations);
    return;
  }

  /**         **/
  /** HELPERS **/
  /**         **/
  async userExists(userIds: number[]): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
    });
    if (users.length !== userIds.length) {
      throw new NotFoundException('User does not exist');
    }
    return users;
  }

  private checkTransactionAmount(amount: number): void {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }
    const decimal = amount.toString().split('.')[1];
    if (decimal && decimal.length > 2) {
      throw new BadRequestException('Amount must be a max of 2 decimal places');
    }
  }

  private async transactionExists(
    transactionId: number,
  ): Promise<TransactionWithSenderAndReceiver> {
    const transaction = await this.getTransactionById(transactionId);
    if (!transaction) {
      throw new NotFoundException(
        `Transaction with ID ${transactionId} not found`,
      );
    }
    if (transaction.is_deleted) {
      throw new BadRequestException(
        `Transaction with ID ${transactionId} is already deleted`,
      );
    }
    return transaction;
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
    const [receiver] = await this.userExists([transaction.user_to.id]);
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
    const [sender] = await this.userExists([transaction.user_from.id]);
    return {
      where: { id: sender.id },
      data: { balance: sender.balance + transaction.amount },
    };
  }

  private shouldUpdateReceiverBalance(transactionType: string): boolean {
    return ['DEPOSIT', 'TRANSFER'].includes(transactionType);
  }

  private shouldUpdateSenderBalance(transactionType: string): boolean {
    return ['EXPENSE', 'TRANSFER'].includes(transactionType);
  }
}
