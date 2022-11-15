import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Collaborator, FA, Security_pass, User_Team } from '@prisma/client';
import { UpdateFaDto } from './dto/update-fa.dto';
import { PrismaService } from '../prisma.service';
import { NotFoundError } from '@prisma/client/runtime';
import { CreateCollaboratorDto } from '../collaborator/dto/create-collaborator.dto';
import { CreateSecurityPassDto } from '../security_pass/dto/create-security_pass.dto';
import { CreateFaDto } from './dto/create-fa.dto';

@Injectable()
export class FaService {
  constructor(private prisma: PrismaService) {}

  /**     **/
  /** GET **/
  /**     **/

  async findAll(): Promise<FA[] | null> {
    return this.prisma.fA.findMany();
  }

  async findOne(id: number): Promise<FA | null> {
    return this.prisma.fA.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        FA_Collaborators: true,
        FA_validation: true,
        FA_refuse: true,
        Security_pass: true,
        FA_Electricity_needs: true,
        FA_signa_needs: true,
        FA_Comment: true,
        TimeWindow: true,
        Location: true,
        Team: true,
        fa_type_name: true,
      },
    });
  }

  /**      **/
  /** POST **/
  /**      **/

  async update(id: number, updateFaDto: UpdateFaDto): Promise<FA | null> {
    //find the FA
    const fa = await this.prisma.fA.findUnique({ where: { id: Number(id) } });
    if (!fa) throw new NotFoundError(`FA with id ${id} not found`);
    //update every aspect of the FA
    const collaborators = await this.create_collaborators(
      updateFaDto.FA_Collaborators,
    );
    await this.createSecurityPasses(updateFaDto.Security_pass, fa.id);

    return this.prisma.fA.update({
      where: { id: Number(id) },
      data: {
        ...updateFaDto.FA,
        FA_Collaborators: {
          createMany: {
            data: collaborators.map((collaborator) => {
              return {
                collaborator_id: collaborator.id,
              };
            }),
            skipDuplicates: true,
          },
        },
      },
    });
  }

  async create(FA: CreateFaDto): Promise<FA | null> {
    return this.prisma.fA.create({ data: FA });
  }

  private async create_collaborators(
    fa_collab: CreateCollaboratorDto[],
  ): Promise<Collaborator[] | null> {
    if (!fa_collab) return [];
    if (fa_collab.length === 0) return [];
    await this.prisma.collaborator.createMany({
      data: fa_collab,
      skipDuplicates: true,
    });
    // trimimg the collaborator to get only the name
    fa_collab = fa_collab.map((collab) => {
      return {
        ...collab,
        firstname: collab.firstname.trim(), // trust me it's not useless
        lastname: collab.lastname.trim(),
      };
    });
    //Then get all the collaborators
    const collaborators = await this.prisma.collaborator.findMany({
      where: {
        firstname: {
          in: fa_collab.map((collaborator) => {
            return collaborator.firstname;
          }),
        },
        lastname: {
          in: fa_collab.map((collaborator) => {
            return collaborator.lastname;
          }),
        },
      },
    });
    if (collaborators.length !== fa_collab.length) {
      throw new Error('Some collaborators were not created');
    }
    return collaborators;
  }

  private async createSecurityPasses(
    fa_security_pass: CreateSecurityPassDto[],
    fa_id: number,
  ): Promise<Security_pass[]> {
    if (!fa_security_pass) return;
    const security_pass = fa_security_pass.map((pass) => {
      return {
        ...pass,
        fa_id: fa_id,
      };
    });
    await this.prisma.security_pass.createMany({
      data: security_pass,
    });
    const created_pass = await this.prisma.security_pass.findMany({
      where: {
        fa_id: fa_id,
      },
    });
    if (created_pass.length !== fa_security_pass.length) {
      throw new Error('some passes were not created');
    }
    return created_pass;
  }

  async remove(id: number): Promise<FA | null> {
    return null;
  }

  async validateFa(fa_id: number, user_id: number): Promise<FA | null> {
    const validator_team_id = await this.isUserValidator(user_id);
    const fa = await this.prisma.fA.findUnique({
      where: { id: fa_id },
    });
    if (!fa) throw new NotFoundException(`FA with id ${fa_id} not found`);
    //add the user validation
    return this.prisma.fA.update({
      where: { id: fa_id },
      data: {
        FA_validation: {
          upsert: {
            where: {
              fa_id_user_id: {
                fa_id: fa_id,
                user_id: user_id,
              },
            },
            create: {
              user_id: user_id,
              team_id: validator_team_id,
            },
            update: {
              user_id: user_id,
              team_id: validator_team_id,
              is_deleted: false,
            },
          },
        },
      },
    });
  }

  async invalidateFa(fa_id: number, user_id: number): Promise<FA | null> {
    await this.isUserValidator(user_id);
    const fa = await this.prisma.fA.findUnique({
      where: { id: fa_id },
    });
    if (!fa) throw new NotFoundException(`FA with id ${fa_id} not found`);
    //remove the user validation by switching is_deleted to true
    return this.prisma.fA.update({
      where: { id: fa_id },
      data: {
        FA_validation: {
          update: {
            where: {
              fa_id_user_id: {
                fa_id: fa_id,
                user_id: user_id,
              },
            },
            data: {
              is_deleted: true,
            },
          },
        },
      },
    });
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
