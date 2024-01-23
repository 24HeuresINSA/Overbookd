import { PrismaService } from "../../../../prisma.service";
import { Adherents } from "../../festival-task-common.model";
import { SELECT_ADHERENT, SELECT_CONTACT } from "./adherent.query";

export class PrismaAdherents implements Adherents {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: number) {
    return this.prisma.user.findFirst({
      where: { id },
      select: SELECT_ADHERENT,
    });
  }

  findContact(id: number) {
    return this.prisma.user.findFirst({
      where: { id },
      select: SELECT_CONTACT,
    });
  }
}
