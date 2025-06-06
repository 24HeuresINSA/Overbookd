import { Adherents } from "@overbookd/contribution";
import { PrismaService } from "../../prisma.service";
import { Adherent } from "@overbookd/contribution";
import { SELECT_ADHERENT } from "./contribution.query";

export class PrismaAdherents implements Adherents {
  constructor(private readonly prisma: PrismaService) {}

  async find(id: number): Promise<Adherent | undefined> {
    const prismaAdherent = await this.prisma.user.findUnique({
      where: { id },
      select: SELECT_ADHERENT,
    });
    if (!prismaAdherent) return undefined;
    const { teams: teamCodes, ...adherent } = prismaAdherent;
    const teams = teamCodes.map(({ teamCode }) => teamCode);
    return { ...adherent, teams };
  }
}
