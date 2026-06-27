import { PrismaService } from "../../../../prisma.service";
import { Adherents } from "../festival-activity-common.model";
import { SELECT_VOLUNTEER } from "../../../common/repository/volunteer.query";
import { Adherent } from "@overbookd/festival-event";

export class PrismaAdherents implements Adherents {
  constructor(private readonly prisma: PrismaService) {}

  find(id: Adherent["id"]): Promise<Adherent | null> {
    return this.prisma.user.findFirst({
      where: { id },
      select: SELECT_VOLUNTEER,
    });
  }
}
