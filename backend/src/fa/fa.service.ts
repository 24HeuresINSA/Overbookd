import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { fa, User_Team } from '@prisma/client';
import { UpdateFaDto } from './dto/update-fa.dto';
import { PrismaService } from '../prisma.service';
import { NotFoundError } from '@prisma/client/runtime';
import { CreateFaDto } from './dto/create-fa.dto';
import {
  FaResponse,
  AllFaResponse,
  COMPLETE_FA_SELECT,
  ALL_FA_SELECT,
} from './fa_types';

@Injectable()
export class FaService {
  constructor(private prisma: PrismaService) {}

  /**     **/
  /** GET **/
  /**     **/

  async findAll(): Promise<AllFaResponse[] | null> {
    return this.prisma.fa.findMany({
      where: {
        is_deleted: false,
      },
      select: ALL_FA_SELECT,
    });
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
    if (!fa) throw new NotFoundError(`fa with id ${id} not found`);
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

  async validatefa(fa_id: number, user_id: number): Promise<fa | null> {
    const validator_team_id = await this.isUserValidator(user_id);
    const fa = await this.prisma.fa.findUnique({
      where: { id: Number(fa_id) },
    });
    if (!fa) throw new NotFoundException(`fa with id ${fa_id} not found`);
    //add the user validation
    await this.prisma.$transaction([
      this.prisma.fa_validation.upsert({
        where: {
          fa_id_user_id: {
            fa_id: fa_id,
            user_id: user_id,
          },
        },
        create: {
          fa_id: fa_id,
          team_id: validator_team_id,
          user_id: user_id,
        },
        update: {
          team_id: validator_team_id,
          user_id: user_id,
          is_deleted: false,
        },
      }),
      this.prisma.fa_refuse.upsert({
        where: {
          fa_id_user_id: {
            fa_id: fa_id,
            user_id: user_id,
          },
        },
        create: {
          fa_id: fa_id,
          team_id: validator_team_id,
          user_id: user_id,
          is_deleted: true,
        },
        update: {
          is_deleted: true,
        },
      }),
    ]);
    return fa;
  }

  async invalidatefa(fa_id: number, user_id: number): Promise<fa | null> {
    const validator_team_id = await this.isUserValidator(user_id);
    const fa = await this.prisma.fa.findUnique({
      where: { id: fa_id },
    });
    if (!fa) throw new NotFoundException(`fa with id ${fa_id} not found`);
    //remove the user validation by switching is_deleted to true
    await this.prisma.$transaction([
      this.prisma.fa_refuse.upsert({
        where: {
          fa_id_user_id: {
            fa_id: fa_id,
            user_id: user_id,
          },
        },
        create: {
          fa_id: fa_id,
          team_id: validator_team_id,
          user_id: user_id,
        },
        update: {
          team_id: validator_team_id,
          user_id: user_id,
          is_deleted: false,
        },
      }),
      //if fa_validation exist then change is_deleted to true
      this.prisma.fa_validation.upsert({
        where: {
          fa_id_user_id: {
            fa_id: fa_id,
            user_id: user_id,
          },
        },
        create: {
          fa_id: fa_id,
          team_id: validator_team_id,
          user_id: user_id,
          is_deleted: true,
        },
        update: {
          is_deleted: true,
        },
      }),
    ]);

    return fa;
  }

  private async isUserValidator(user_id: number): Promise<number> {
    //get user with team
    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
      include: { team: true },
    });
    if (!user) throw new NotFoundError(`User with id ${user_id} not found`);
    //check if team is fa_validator
    const user_teams: User_Team[] = user.team;
    if (!user_teams)
      throw new UnauthorizedException(
        `User with id ${user_id} is not in a team`,
      );
    if (user_teams.length === 0)
      throw new UnauthorizedException(
        `User with id ${user_id} is not in a team`,
      );
    //check if user got a validator team
    const is_validator_teams: boolean[] = await Promise.all(
      user_teams.map(async (user_team) => {
        const team = await this.prisma.team.findUnique({
          where: { id: user_team.team_id },
        });
        if (!team)
          throw new NotFoundError(
            `Team with id ${user_team.team_id} not found`,
          );
        return team.fa_validator;
      }),
    );
    //check if true in is_validator_teams
    if (!is_validator_teams.includes(true))
      throw new UnauthorizedException(
        `User with id ${user_id} is not a validator`,
      );
    return user_teams[is_validator_teams.indexOf(true)].team_id;
  }
}
