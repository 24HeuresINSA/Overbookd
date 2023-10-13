import { Member, MemberRepository } from "@overbookd/personal-account";
import { PrismaService } from "../../prisma.service";
import { CAN_HAVE_PERSONAL_ACCOUNT } from "../transaction.query";

export class PrismaMemberRepository implements MemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getById(adherentId: number): Promise<Member> {
    const member = await this.prisma.user.findFirst({
      where: {
        id: adherentId,
        ...CAN_HAVE_PERSONAL_ACCOUNT,
      },
    });
    return { havePersonalAccount: Boolean(member) };
  }
}
