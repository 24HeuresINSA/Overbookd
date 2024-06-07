import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../prisma.service";
import { TeamRepository } from "../catalog-repositories";
import { CategoryOwner } from "@overbookd/http";

@Injectable()
export class PrismaTeamRepository implements TeamRepository {
  constructor(private readonly prismaService: PrismaService) {}
  getTeam(code: string): Promise<CategoryOwner> {
    if (!code) return Promise.resolve(undefined);
    return this.prismaService.team.findUnique({
      select: { name: true, code: true },
      where: { code },
    });
  }
}
