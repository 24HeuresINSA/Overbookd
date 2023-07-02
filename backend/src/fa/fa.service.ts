import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateFaDto } from './dto/update-fa.dto';
import { validationDto } from './dto/validation.dto';

import { StatsPayload, StatsService } from 'src/common/services/stats.service';
import { PrismaService } from '../prisma.service';
import { CreateFaDto } from './dto/create-fa.dto';
import { CompleteFaResponse, FaStatus, LiteFaResponse } from './fa.model';
import {
  COMPLETE_FA_SELECT,
  DatabaseCompleteFaResponse,
  FaIdResponse,
  LITE_FA_SELECT,
} from './faTypes';

export interface SearchFa {
  isDeleted: boolean;
  status?: FaStatus;
}
@Injectable()
export class FaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly statsService: StatsService,
  ) {}

  async findAll(search: SearchFa): Promise<LiteFaResponse[]> {
    const where = this.buildFindCondition(search);
    return this.prisma.fa.findMany({
      where,
      select: LITE_FA_SELECT,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number): Promise<CompleteFaResponse> {
    const fa = await this.prisma.fa.findUnique({
      where: { id },
      select: COMPLETE_FA_SELECT,
    });
    if (!fa) throw new NotFoundException(`fa with id ${id} not found`);
    return this.formatFaResponseCollaborator(fa);
  }

  async getFaStats(): Promise<StatsPayload[]> {
    const fa = await this.prisma.fa.groupBy({
      by: ['teamId', 'status'],
      where: { isDeleted: false },
      _count: { status: true },
    });
    const teams = await this.prisma.team.findMany({});
    const transformedFa = fa.map((fa) => ({
      ...fa,
      teamCode: teams.find((team) => team.id === fa.teamId)?.code,
    }));
    return this.statsService.stats(transformedFa);
  }

  async update(
    id: number,
    updatefaDto: UpdateFaDto,
  ): Promise<CompleteFaResponse> {
    //find the fa
    const fa = await this.prisma.fa.findUnique({ where: { id } });
    if (!fa) throw new NotFoundException(`fa with id ${id} not found`);
    await this.prisma.fa.update({
      where: { id },
      data: updatefaDto,
    });
    return this.findOne(id);
  }

  async create(faCreation: CreateFaDto): Promise<CompleteFaResponse> {
    const fa = await this.prisma.fa.create({
      data: faCreation,
      select: COMPLETE_FA_SELECT,
    });
    return this.formatFaResponseCollaborator(fa);
  }

  async remove(id: number) {
    await this.prisma.fa.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async validatefa(
    userId: number,
    faId: number,
    body: validationDto,
  ): Promise<void> {
    const teamId = body.teamId;
    await this.checkFaExistence(faId);

    const data = {
      faId,
      teamId,
      userId,
    };
    //add the user validation
    await this.prisma.$transaction([
      this.prisma.faValidation.upsert({
        create: data,
        update: data,
        where: {
          faId_teamId: {
            faId,
            teamId,
          },
        },
      }),
      this.prisma.faRefuse.deleteMany({
        where: {
          faId,
          teamId,
        },
      }),
    ]);
  }

  async removeFaValidation(faId: number, teamId: number): Promise<void> {
    await this.checkFaExistence(faId);
    await this.removeValidationFromTeam(faId, teamId);
  }

  async refusefa(
    userId: number,
    faId: number,
    body: validationDto,
  ): Promise<void> {
    const teamId = body.teamId;
    await this.checkFaExistence(faId);

    const data = {
      faId,
      teamId,
      userId,
    };
    await this.prisma.$transaction([
      this.prisma.faRefuse.upsert({
        create: data,
        update: data,
        where: {
          faId_teamId: {
            faId,
            teamId,
          },
        },
      }),
      this.removeValidationFromTeam(faId, teamId),
    ]);
  }

  async findPrevious(id: number): Promise<FaIdResponse | null> {
    return this.prisma.fa.findFirst({
      where: {
        id: { lt: id },
        isDeleted: false,
      },
      orderBy: { id: 'desc' },
      select: { id: true },
    });
  }

  async findNext(id: number): Promise<FaIdResponse | null> {
    return this.prisma.fa.findFirst({
      where: {
        id: { gt: id },
        isDeleted: false,
      },
      orderBy: { id: 'asc' },
      select: { id: true },
    });
  }

  private buildFindCondition({ isDeleted, status }: SearchFa) {
    const statusCondition = status ? { status } : {};
    return { isDeleted, ...statusCondition };
  }

  private async checkFaExistence(id: number): Promise<void> {
    const fa = await this.prisma.fa.findUnique({
      where: { id },
    });
    if (!fa) throw new NotFoundException(`fa with id ${id} not found`);
  }

  private removeValidationFromTeam(faId: number, teamId: number) {
    return this.prisma.faValidation.deleteMany({
      where: {
        faId,
        teamId,
      },
    });
  }

  private formatFaResponseCollaborator(
    fa: DatabaseCompleteFaResponse,
  ): CompleteFaResponse {
    return {
      ...fa,
      // collaborator = the first collaborator if exists
      collaborator:
        fa.collaborators.length > 0
          ? fa.collaborators[0].collaborator
          : undefined,
    };
  }
}
