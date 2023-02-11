import { Injectable, NotFoundException } from '@nestjs/common';
import { fa, Status } from '@prisma/client';
import { UpdateFaDto } from './dto/update-fa.dto';
import { validationDto } from './dto/validation.dto';

import { PrismaService } from '../prisma.service';
import { CreateFaDto } from './dto/create-fa.dto';
import {
  AllFaResponse,
  ALL_FA_SELECT,
  COMPLETE_FA_SELECT,
  FaIdResponse,
  FaResponse,
  FA_ID_SELECT,
} from './fa_types';
import { StatsPayload, StatsService } from 'src/common/services/stats.service';

export interface SearchFa {
  isDeleted: boolean;
  status?: Status;
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

  private buildFindCondition({ isDeleted: is_deleted, status }: SearchFa) {
    const statusCondition = status ? { status } : {};
    return { is_deleted, ...statusCondition };
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
      by: ['team_id', 'status'],
      where: {
        is_deleted: false,
      },
      _count: {
        status: true,
      },
    });
    return this.statsService.stats(fa);
  }

  /**      **/
  /** POST **/
  /**      **/

  async update(
    id: number,
    updatefaDto: UpdateFaDto,
  ): Promise<FaResponse | null> {
    //find the fa
    const fa = await this.prisma.fa.findUnique({ where: { id: Number(id) } });
    if (!fa) throw new NotFoundException(`fa with id ${id} not found`);
    await this.prisma.fa.update({
      where: { id: Number(id) },
      data: updatefaDto,
    });
    return await this.findOne(id);
  }

  async create(fa: CreateFaDto): Promise<FaResponse | null> {
    return this.prisma.fa.create({ data: fa, select: COMPLETE_FA_SELECT });
  }

  async remove(id: number): Promise<fa | null> {
    return this.prisma.fa.update({
      where: { id: Number(id) },
      data: {
        is_deleted: true,
      },
    });
  }

  async validatefa(
    user_id: number,
    fa_id: number,
    body: validationDto,
  ): Promise<void> {
    const team_id = body.team_id;
    await this.checkFaExistence(fa_id);

    const data = {
      fa_id,
      team_id,
      user_id,
    };
    //add the user validation
    await this.prisma.$transaction([
      this.prisma.fa_validation.upsert({
        create: data,
        update: data,
        where: {
          fa_id_team_id: {
            fa_id,
            team_id,
          },
        },
      }),
      this.prisma.fa_refuse.deleteMany({
        where: {
          fa_id,
          team_id,
        },
      }),
    ]);
  }

  async removeFaValidation(fa_id: number, team_id: number): Promise<void> {
    await this.checkFaExistence(fa_id);
    await this.removeValidationFromTeam(fa_id, team_id);
  }

  async refusefa(
    user_id: number,
    fa_id: number,
    body: validationDto,
  ): Promise<void> {
    const team_id = body.team_id;
    await this.checkFaExistence(fa_id);

    const data = {
      fa_id,
      team_id,
      user_id,
    };
    await this.prisma.$transaction([
      this.prisma.fa_refuse.upsert({
        create: data,
        update: data,
        where: {
          fa_id_team_id: {
            fa_id,
            team_id,
          },
        },
      }),
      this.removeValidationFromTeam(fa_id, team_id),
    ]);
  }

  async findPrevious(id: number): Promise<FaIdResponse | null> {
    const previous = await this.prisma.fa.findFirst({
      where: {
        id: { lt: id },
        is_deleted: false,
      },
      orderBy: { id: 'desc' },
      select: FA_ID_SELECT,
    });
    if (previous) return previous;

    return this.prisma.fa.findFirst({
      where: {
        is_deleted: false,
      },
      orderBy: { id: 'desc' },
      select: FA_ID_SELECT,
    });
  }

  async findNext(id: number): Promise<FaIdResponse | null> {
    const next = await this.prisma.fa.findFirst({
      where: {
        id: { gt: id },
        is_deleted: false,
      },
      orderBy: { id: 'asc' },
      select: FA_ID_SELECT,
    });

    if (next) return next;

    return this.prisma.fa.findFirst({
      where: {
        is_deleted: false,
      },
      orderBy: { id: 'asc' },
      select: FA_ID_SELECT,
    });
  }

  private async checkFaExistence(id: number): Promise<void> {
    const fa = await this.prisma.fa.findUnique({
      where: { id },
    });
    if (!fa) throw new NotFoundException(`fa with id ${id} not found`);
  }

  private removeValidationFromTeam(fa_id: number, team_id: number) {
    return this.prisma.fa_validation.deleteMany({
      where: {
        fa_id,
        team_id,
      },
    });
  }
}
