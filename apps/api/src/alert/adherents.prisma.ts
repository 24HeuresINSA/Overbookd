import { Adherents } from "@overbookd/personnal-account";
import { PrismaService } from "../prisma.service";

export class PrismaAdherents implements Adherents {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(adherentId: number): Promise<number> {
    const adherent = await this.prisma.user.findUnique({
      where: { id: adherentId },
      select: { balance: true },
    });
    return adherent.balance ?? 0;
  }
}
