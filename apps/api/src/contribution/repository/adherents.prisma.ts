import { Adherents } from "@overbookd/contribution";
import { PrismaService } from "../../prisma.service";
import { Adherent } from "@overbookd/contribution";

const SELECT_ADHERENT = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
};

export class PrismaAdherents implements Adherents {
  constructor(private readonly prisma: PrismaService) {}

  async find(id: number): Promise<Adherent | undefined> {
    return this.prisma.user.findUnique({
      where: { id },
      select: SELECT_ADHERENT,
    });
  }
}
