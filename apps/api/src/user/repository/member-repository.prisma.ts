import { AnonymousMember, MemberRepository } from "@overbookd/registration";
import { PrismaService } from "../../prisma.service";
import { SELECT_TRANSACTIONS_FOR_BALANCE } from "../../common/query/transaction.query";
import { Balance } from "@overbookd/personal-account";
import { IS_NOT_DELETED } from "../../common/query/not-deleted.query";

export class PrismaMemberRepository implements MemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async hasTasks(id: number): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        assigned: { some: { assignment: { end: { gt: new Date() } } } },
      },
    });
    return user !== null;
  }

  async hasDebts(id: number): Promise<boolean> {
    const balance = await this.getBalance(id);
    return balance < 0;
  }

  async hasMoney(id: number): Promise<boolean> {
    const balance = await this.getBalance(id);
    return balance > 0;
  }

  private async getBalance(id: number): Promise<number> {
    const user = await this.prisma.user.findFirst({
      where: { id },
      select: SELECT_TRANSACTIONS_FOR_BALANCE,
    });
    return Balance.calculate(user);
  }

  async hasTransactions(id: number): Promise<boolean> {
    const transactions = await this.prisma.transaction.count({
      where: {
        ...IS_NOT_DELETED,
        OR: [{ payor: { id } }, { payee: { id } }],
      },
    });
    return transactions > 0;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async anonymize(
    id: number,
    anonymous: AnonymousMember,
  ): Promise<AnonymousMember> {
    await this.prisma.user.update({
      where: { id },
      data: {
        firstName: anonymous.firstName,
        lastName: anonymous.lastName,
        phoneNumber: anonymous.mobilePhone,
        nickname: anonymous.nickname,
        comment: anonymous.comment,
        note: anonymous.note,
        email: anonymous.email,
      },
    });
    return anonymous;
  }
}
