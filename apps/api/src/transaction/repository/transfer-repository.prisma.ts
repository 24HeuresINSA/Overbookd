import {
  TransferForm,
  TransferRepository,
  TransferResponse,
} from "@overbookd/personal-account";
import { PrismaService } from "../../prisma.service";

export class PrismaTransferRepository implements TransferRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(transfer: TransferForm): Promise<TransferResponse> {
    const transactionCreation = this.prisma.transaction.create({
      data: transfer,
    });
    const payorUpdate = this.prisma.user.update({
      where: { id: transfer.from },
      data: { balance: { decrement: transfer.amount } },
    });
    const payeeUpdate = this.prisma.user.update({
      where: { id: transfer.to },
      data: { balance: { increment: transfer.amount } },
    });

    const [, payor, payee] = await Promise.all([
      transactionCreation,
      payorUpdate,
      payeeUpdate,
    ]);
    return {
      from: payor,
      to: payee,
    };
  }
}
