import { Injectable, NotFoundException } from '@nestjs/common';
import { Fa } from '@prisma/client';
import { UpdateFaDto } from './dto/update-fa.dto';
import { validationDto } from './dto/validation.dto';

import { StatsPayload, StatsService } from 'src/common/services/stats.service';
import { PrismaService } from '../prisma.service';
import { CreateFaDto } from './dto/create-fa.dto';
import {
  AllFaResponse,
  ALL_FA_SELECT,
  COMPLETE_FA_SELECT,
  FaIdResponse,
  FaResponse,
} from './fa_types';
import { FaStatus } from './fa.model';

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

  /**     **/
  /** GET **/
  /**     **/

  async findAll(search: SearchFa): Promise<AllFaResponse[] | null> {
    const where = this.buildFindCondition(search);
    return this.prisma.fa.findMany({
      where,
      select: ALL_FA_SELECT,
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number): Promise<FaResponse | null> {
    return this.prisma.fa.findUnique({
      where: {
        id,
      },
      select: COMPLETE_FA_SELECT,
    });
  }

  async getFaStats(): Promise<StatsPayload[]> {
    const fa = await this.prisma.fa.groupBy({
      by: ['teamId', 'status'],
      where: {
        isDeleted: false,
      },
      _count: {
        status: true,
      },
    });
    const teams = await this.prisma.team.findMany({});
    const transformedFa = fa.map((fa) => ({
      ...fa,
      teamCode: teams.find((team) => team.id === fa.teamId)?.code,
    }));
    return this.statsService.stats(transformedFa);
  }

  /**      **/
  /** POST **/
  /**      **/

  async update(
    id: number,
    updatefaDto: UpdateFaDto,
  ): Promise<FaResponse | null> {
    //find the fa
    const fa = await this.prisma.fa.findUnique({ where: { id } });
    if (!fa) throw new NotFoundException(`fa with id ${id} not found`);
    await this.prisma.fa.update({
      where: { id },
      data: updatefaDto,
    });
    return await this.findOne(id);
  }

  async create(fa: CreateFaDto): Promise<FaResponse | null> {
    return this.prisma.fa.create({ data: fa, select: COMPLETE_FA_SELECT });
  }

  async remove(id: number): Promise<Fa | null> {
    return this.prisma.fa.update({
      where: { id },
      data: {
        isDeleted: true,
      },
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

  async removeFaValidation(fa_id: number, team_id: number): Promise<void> {
    await this.checkFaExistence(fa_id);
    await this.removeValidationFromTeam(fa_id, team_id);
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
      select: {
        id: true,
      },
    });
  }

  async findNext(id: number): Promise<FaIdResponse | null> {
    return this.prisma.fa.findFirst({
      where: {
        id: { gt: id },
        isDeleted: false,
      },
      orderBy: { id: 'asc' },
      select: {
        id: true,
      },
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
}
