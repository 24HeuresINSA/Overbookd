import { Injectable } from "@nestjs/common";
import { CategoryOwner } from "@overbookd/http";
import { PrismaService } from "../../../../prisma.service";
import { TeamRepository } from "../catalog-repositories";

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
