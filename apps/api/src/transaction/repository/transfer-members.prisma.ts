import { Balance, Member, TransferMembers } from "@overbookd/personal-account";
import { PrismaService } from "../../prisma.service";
import { CAN_HAVE_PERSONAL_ACCOUNT } from "./transaction.query";
import { SELECT_TRANSACTIONS_FOR_BALANCE } from "../../common/query/transaction.query";

export class PrismaTransferMembers implements TransferMembers {
  constructor(private readonly prisma: PrismaService) {}

  async getById(adherentId: number): Promise<Member> {
    const member = await this.prisma.user.findFirst({
      where: {
        id: adherentId,
        ...CAN_HAVE_PERSONAL_ACCOUNT,
      },
      select: SELECT_TRANSACTIONS_FOR_BALANCE,
    });
    const havePersonalAccount = Boolean(member);
    const balance = havePersonalAccount ? Balance.calculate(member) : undefined;
    return { havePersonalAccount, balance };
  }
}
