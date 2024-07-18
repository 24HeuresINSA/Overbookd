import {
  TransferForm,
  Transfers,
  TransferResponse,
  Balance,
} from "@overbookd/personal-account";
import { PrismaService } from "../../prisma.service";
import { SELECT_TRANSACTIONS_FOR_BALANCE } from "../../common/query/transaction.query";

const SELECT_TRANFER_PARTICIPANT = {
  id: true,
  ...SELECT_TRANSACTIONS_FOR_BALANCE,
};

export class PrismaTransfers implements Transfers {
  constructor(private readonly prisma: PrismaService) {}

  async create(transfer: TransferForm): Promise<TransferResponse> {
    const { payee, payor } = await this.prisma.transaction.create({
      data: transfer,
      select: {
        payee: { select: SELECT_TRANFER_PARTICIPANT },
        payor: { select: SELECT_TRANFER_PARTICIPANT },
      },
    });
    const payorWithBalance = {
      id: payor.id,
      balance: Balance.calculate(payor),
    };
    const payeeWithBalance = {
      id: payee.id,
      balance: Balance.calculate(payee),
    };
    return { from: payorWithBalance, to: payeeWithBalance };
  }
}
