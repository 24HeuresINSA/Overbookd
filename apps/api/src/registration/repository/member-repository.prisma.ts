import {
  AnonymousMember,
  Credentials,
  Member,
  MemberRepository,
} from "@overbookd/registration";
import { PrismaService } from "../../prisma.service";
import { HashingUtilsService } from "../../hashing-utils/hashing-utils.service";

export class PrismaMemberRepository implements MemberRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: HashingUtilsService,
  ) {}

  async hasTasks(email: string): Promise<boolean> {
    const exist = await this.prisma.user.findFirst({
      where: {
        email,
        assignments: { some: { timeSpan: { end: { gt: new Date() } } } },
      },
    });
    return exist ? true : false;
  }

  async hasDebts(email: string): Promise<boolean> {
    const exist = await this.prisma.user.findFirst({
      where: { email, balance: { lt: 0 } },
    });
    return exist ? true : false;
  }

  async hasTransactions(email: string): Promise<boolean> {
    const transactions = await this.prisma.transaction.count({
      where: { OR: [{ payor: { email } }, { payee: { email } }] },
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
        firstname: anonymous.firstname,
        lastname: anonymous.lastname,
        phone: anonymous.mobilePhone,
        nickname: anonymous.nickname,
        comment: anonymous.comment,
        email: anonymous.email,
      },
    });
    return anonymous;
  }

  async authenticate({ email, password }: Credentials): Promise<Member | null> {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: { password: true, id: true },
    });
    if (!user) return null;

    const isSamePassword = await this.crypto.compare(password, user.password);
    if (!isSamePassword) return null;

    return { id: user.id };
  }

  async getId(email: string): Promise<number | null> {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: { id: true },
    });
    return user?.id ?? null;
  }
}
