import { Adherent, Contact } from "@overbookd/festival-event";
import { PrismaService } from "../../../../prisma.service";
import { Adherents } from "../festival-task-common.model";
import { SELECT_CONTACT } from "./adherent.query";
import { SELECT_VOLUNTEER } from "../../../common/repository/volunteer.query";

export class PrismaAdherents implements Adherents {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: Adherent["id"]): Promise<Adherent | null> {
    return this.prisma.user.findFirst({
      where: { id },
      select: SELECT_VOLUNTEER,
    });
  }

  findMatching(ids: Adherent["id"][]): Promise<Adherent[]> {
    return this.prisma.user.findMany({
      where: { id: { in: ids } },
      select: SELECT_VOLUNTEER,
    });
  }

  findContact(id: Contact["id"]): Promise<Contact | null> {
    return this.prisma.user.findFirst({
      where: { id },
      select: SELECT_CONTACT,
    });
  }
}
