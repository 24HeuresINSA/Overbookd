import { Adherent } from "@overbookd/festival-event";
import { PrismaService } from "../../../../prisma.service";
import { Adherents } from "../festival-task-common.model";
import { SELECT_CONTACT } from "./adherent.query";
import { SELECT_VOLUNTEER } from "../../../common/repository/volunteer.query";

export class PrismaAdherents implements Adherents {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: number) {
    return this.prisma.user.findFirst({
      where: { id },
      select: SELECT_VOLUNTEER,
    });
  }

  findMatching(ids: number[]): Promise<Adherent[]> {
    return this.prisma.user.findMany({
      where: { id: { in: ids } },
      select: SELECT_VOLUNTEER,
    });
  }

  findContact(id: number) {
    return this.prisma.user.findFirst({
      where: { id },
      select: SELECT_CONTACT,
    });
  }
}
