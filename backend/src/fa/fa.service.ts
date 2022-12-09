import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { fa, Status } from '@prisma/client';
import { UpdateFaDto } from './dto/update-fa.dto';
import { validationDto } from './dto/validation.dto';

import { PrismaService } from '../prisma.service';
import { CreateFaDto } from './dto/create-fa.dto';
import {
  FaResponse,
  AllFaResponse,
  COMPLETE_FA_SELECT,
  ALL_FA_SELECT,
} from './fa_types';

export interface SearchFa {
  isDeleted: boolean;
  status?: Status;
}
@Injectable()
export class FaService {
  constructor(private prisma: PrismaService) {}

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
        id: Number(id),
      },
      select: COMPLETE_FA_SELECT,
    });
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
  ): Promise<fa | null> {
    const team_id = body.team_id;
    await this.isUserValidator(user_id, team_id);
    const fa = await this.prisma.fa.findUnique({
      where: { id: Number(fa_id) },
    });
    if (!fa) throw new NotFoundException(`fa with id ${fa_id} not found`);
    //add the user validation
    await this.prisma.$transaction([
      this.prisma.fa_validation.create({
        data: {
          fa_id: fa_id,
          team_id: team_id,
          user_id: user_id,
        },
      }),
      this.prisma.fa_refuse.deleteMany({
        where: {
          fa_id: fa_id,
          team_id: team_id,
          user_id: user_id,
        },
      }),
    ]);
    return fa;
  }

  async invalidatefa(fa_id: number, body: validationDto): Promise<fa | null> {
    const team_id = body.team_id;
    const fa = await this.prisma.fa.findUnique({
      where: { id: Number(fa_id) },
    });
    if (!fa) throw new NotFoundException(`fa with id ${fa_id} not found`);
    await this.prisma.$transaction([
      this.prisma.fa_validation.deleteMany({
        where: {
          fa_id: fa_id,
          team_id: team_id,
        },
      }),
    ]);
    return fa;
  }

  async refusefa(
    user_id: number,
    fa_id: number,
    body: validationDto,
  ): Promise<fa | null> {
    const team_id = body.team_id;
    await this.isUserValidator(user_id, team_id);
    const fa = await this.prisma.fa.findUnique({
      where: { id: fa_id },
    });
    if (!fa) throw new NotFoundException(`fa with id ${fa_id} not found`);
    await this.prisma.$transaction([
      this.prisma.fa_refuse.create({
        data: {
          fa_id: fa_id,
          team_id: team_id,
          user_id: user_id,
        },
      }),
      this.prisma.fa_validation.deleteMany({
        where: {
          fa_id: fa_id,
          team_id: team_id,
          user_id: user_id,
        },
      }),
    ]);

    return fa;
  }

  private async isUserValidator(
    user_id: number,
    team_id: number,
  ): Promise<void> {
    //get user with team
    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
    });
    if (!user) throw new NotFoundException(`User with id ${user_id} not found`);
    const team = await this.prisma.team.findUnique({
      where: { id: team_id },
    });
    if (!team) throw new NotFoundException(`Team with id ${team_id} not found`);
    //check if user is in team
    const user_team = await this.prisma.user_Team.findUnique({
      where: {
        user_id_team_id: {
          user_id: user_id,
          team_id: team_id,
        },
      },
    });
    if (!user_team)
      throw new NotFoundException(
        `User with id ${user_id} is not in team with id ${team_id}`,
      );
    //Check if the team is a validator
    if (!team.fa_validator)
      throw new UnauthorizedException(
        `Team with id ${team_id} is not a validator`,
      );
  }
}
