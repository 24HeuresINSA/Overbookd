import { PrismaService } from "../../prisma.service";
import { Adherent, Adherents } from "@overbookd/festival-activity";

const SELECT_ADHERENT = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
};

export class PrismaAdherentRepository implements Adherents {
  constructor(private readonly prisma: PrismaService) {}

  find(id: number) {
    return this.prisma.user.findFirst({
      where: { id },
      select: SELECT_ADHERENT,
    });
  }
}
