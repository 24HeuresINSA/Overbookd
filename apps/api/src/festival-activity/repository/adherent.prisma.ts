import { PrismaService } from "../../prisma.service";
import { Adherents } from "../festival-activity.service";

export const SELECT_ADHERENT = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
};

export class PrismaAdherents implements Adherents {
  constructor(private readonly prisma: PrismaService) {}

  find(id: number) {
    return this.prisma.user.findFirst({
      where: { id },
      select: SELECT_ADHERENT,
    });
  }
}
