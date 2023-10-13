import {
  TransferForm,
  TransferRepository,
  TransferResponse,
} from "@overbookd/personal-account";
import { PrismaService } from "../../prisma.service";

const SELECT_TRANFER_PARTICIPANT = {
  id: true,
  balance: true,
};

export class PrismaTransferRepository implements TransferRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(transfer: TransferForm): Promise<TransferResponse> {
    const transactionCreation = this.prisma.transaction.create({
      data: transfer,
      select: { id: true },
    });
    const payorUpdate = this.prisma.user.update({
      where: { id: transfer.from },
      data: { balance: { decrement: transfer.amount } },
      select: SELECT_TRANFER_PARTICIPANT,
    });
    const payeeUpdate = this.prisma.user.update({
      where: { id: transfer.to },
      data: { balance: { increment: transfer.amount } },
      select: SELECT_TRANFER_PARTICIPANT,
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
