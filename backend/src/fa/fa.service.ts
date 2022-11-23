import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { collaborator, fa, User_Team } from '@prisma/client';
import { UpdateFaDto } from './dto/update-fa.dto';
import { PrismaService } from '../prisma.service';
import { NotFoundError } from '@prisma/client/runtime';
import { CreateCollaboratorDto } from '../collaborator/dto/create-collaborator.dto';
import { CreateFaDto } from './dto/create-fa.dto';

@Injectable()
export class FaService {
  constructor(private prisma: PrismaService) {}

  /**     **/
  /** GET **/
  /**     **/

  async findAll(): Promise<fa[] | null> {
    return this.prisma.fa.findMany({
      where: {
        is_deleted: false,
      },
    });
  }

  async findOne(id: number): Promise<fa | null> {
    return this.prisma.fa.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        fa_collaborator: {
          include: {
            collaborator: true,
          },
        },
        fa_validation: true,
        fa_refuse: true,
        fa_electricity_needs: true,
        fa_signa_needs: true,
        fa_comment: true,
        location: true,
        Team: true,
        user_in_charge: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
        time_window: true,
      },
    });
  }

  /**      **/
  /** POST **/
  /**      **/

  async update(id: number, updatefaDto: UpdateFaDto): Promise<fa | null> {
    //find the fa
    const fa = await this.prisma.fa.findUnique({ where: { id: Number(id) } });
    if (!fa) throw new NotFoundError(`fa with id ${id} not found`);
    //update every aspect of the fa
    const collaborators = await this.create_collaborators(
      updatefaDto.fa_collaborator,
    );

    return this.prisma.fa.update({
      where: { id: Number(id) },
      data: {
        ...updatefaDto.fa,
        fa_collaborator: {
          createMany: {
            data: collaborators.map((collaborator) => {
              return {
                collaborator_id: collaborator.id,
              };
            }),
            skipDuplicates: true,
          },
        },
        fa_signa_needs: {
          createMany: {
            data: updatefaDto.fa_signa_needs || [],
            skipDuplicates: true,
          },
        },
      },
    });
  }

  async create(fa: CreateFaDto): Promise<fa | null> {
    return this.prisma.fa.create({ data: fa });
  }

  private async create_collaborators(
    fa_collab: CreateCollaboratorDto[],
  ): Promise<collaborator[] | null> {
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
