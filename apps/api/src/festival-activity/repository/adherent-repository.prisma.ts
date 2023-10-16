import { PrismaService } from "../../prisma.service";
import { Adherent } from "@overbookd/festival-activity";

const SELECT_ADHERENT = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
};

export interface AdherentRepository {
  find(id: number): Promise<Adherent | null>;
}

export class PrismaAdherentRepository implements AdherentRepository {
  constructor(private readonly prisma: PrismaService) {}

  find(id: number) {
    return this.prisma.user.findOne({
      where: { id },
      select: SELECT_ADHERENT,
    });
  }
}
