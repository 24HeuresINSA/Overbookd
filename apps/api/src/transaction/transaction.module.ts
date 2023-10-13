import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { PrismaService } from "../prisma.service";
import { PrismaModule } from "../prisma.module";
import { PrismaTransferRepository } from "./repository/transfer-repository.prisma";
import { PrismaMemberRepository } from "./repository/member-repository.prisma";
import { Transfer } from "@overbookd/personal-account";
import { TransferService } from "./transfer.service";
import { PrismaTransactionRepository } from "./repository/transaction-repository.prisma";

@Module({
  controllers: [TransactionController],
  providers: [
    {
      provide: PrismaTransactionRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaTransactionRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: TransactionService,
      useFactory: (
        transactions: PrismaTransactionRepository,
        prisma: PrismaService,
      ) => new TransactionService(transactions, prisma),
      inject: [PrismaTransactionRepository, PrismaService],
    },
    {
      provide: PrismaTransferRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaTransferRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaMemberRepository,
      useFactory: (prisma: PrismaService) => new PrismaMemberRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: Transfer,
      useFactory: (
        transferRepository: PrismaTransferRepository,
        memberRepository: PrismaMemberRepository,
      ) => new Transfer(transferRepository, memberRepository),
      inject: [PrismaTransferRepository, PrismaMemberRepository],
    },
    {
      provide: TransferService,
      useFactory: (transfer: Transfer) => new TransferService(transfer),
      inject: [Transfer],
    },
  ],
  imports: [PrismaModule],
})
export class TransactionModule {}
