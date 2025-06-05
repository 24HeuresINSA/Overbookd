import { PrismaService } from "../../prisma.service";
import { Contribution, EditContributions } from "@overbookd/contribution";

export class PrismaEditContributions implements EditContributions {
  constructor(private readonly prisma: PrismaService) {}

  async findCurrentContributions(edition: number): Promise<Contribution[]> {
    return this.prisma.contribution.findMany({
      where: { edition },
    });
  }

  async find(
    adherentId: Contribution["adherentId"],
    edition: Contribution["edition"],
  ): Promise<Contribution | null> {
    return this.prisma.contribution.findFirst({
      where: { adherentId, edition },
    });
  }

  async save(contribution: Contribution): Promise<Contribution> {
    return this.prisma.contribution.update({
      where: {
        adherentId_edition: {
          adherentId: contribution.adherentId,
          edition: contribution.edition,
        },
      },
      data: contribution,
    });
  }

  async remove(
    adherentId: Contribution["adherentId"],
    edition: Contribution["edition"],
  ): Promise<void> {
    await this.prisma.contribution.delete({
      where: { adherentId_edition: { adherentId, edition } },
    });
  }
}
