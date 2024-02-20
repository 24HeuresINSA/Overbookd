import { PrismaService } from "../../../../prisma.service";
import { Adherents } from "../festival-activity-common.model";
import { SELECT_VOLUNTEER } from "../../../common/repository/volunteer.query";

export class PrismaAdherents implements Adherents {
  constructor(private readonly prisma: PrismaService) {}

  find(id: number) {
    return this.prisma.user.findFirst({
      where: { id },
      select: SELECT_VOLUNTEER,
    });
  }
}
