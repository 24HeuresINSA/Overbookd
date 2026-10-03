import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../prisma.service";
import { CatalogTeams, CategoryOwner } from "@overbookd/logistic";

@Injectable()
export class PrismaCatalogTeams implements CatalogTeams {
  constructor(private readonly prismaService: PrismaService) {}
  getTeam(code: string): Promise<CategoryOwner> {
    if (!code) return Promise.resolve(undefined);
    return this.prismaService.team.findUnique({
      select: { name: true, code: true },
      where: { code },
    });
  }
}
