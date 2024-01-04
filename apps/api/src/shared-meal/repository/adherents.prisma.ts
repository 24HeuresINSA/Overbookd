import { Adherent, MealsAdherents } from "@overbookd/personal-account";
import { nicknameOrName } from "@overbookd/user";
import { PrismaService } from "../../prisma.service";

const SELECT_ADHERENT = { firstname: true, lastname: true, nickname: true };

export class PrismaAdherents implements MealsAdherents {
  constructor(private readonly prisma: PrismaService) {}

  async find(id: number): Promise<Adherent | undefined> {
    const adherent = await this.prisma.user.findUnique({
      where: { id },
      select: SELECT_ADHERENT,
    });
    if (!adherent) return undefined;

    const name = nicknameOrName(adherent);
    return { id, name };
  }
}
