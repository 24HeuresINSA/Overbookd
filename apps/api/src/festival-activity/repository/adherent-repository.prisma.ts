import { PrismaService } from "../../prisma.service";
import { Adherents } from "../festival-activity.service";
import { SELECT_ADHERENT } from "./adherent.query";

export class PrismaAdherent implements Adherents {
  constructor(private readonly prisma: PrismaService) {}

  find(id: number) {
    return this.prisma.user.findFirst({
      where: { id },
      select: SELECT_ADHERENT,
    });
  }
}
