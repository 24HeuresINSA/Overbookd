import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { collaborator, fa, Prisma, User_Team } from '@prisma/client';
import { UpdateFaDto } from './dto/update-fa.dto';
import { PrismaService } from '../prisma.service';
import { NotFoundError } from '@prisma/client/runtime';
import { CreateCollaboratorDto } from '../collaborator/dto/create-collaborator.dto';
import { CreateFaDto } from './dto/create-fa.dto';

const COMPLETE_FA_SELECT = {
  id: true,
  name: true,
  type: true,
  team_id: true,
  in_charge: true,
  created_at: true,
  location_id: true,
  status: true,
  description: true,
  is_publishable: true,
  is_major: true,
  is_kids: true,
  security_needs: true,
  is_pass_required: true,
  number_of_pass: true,
  water_needs: true,
  water_flow_required: true,
  fa_collaborator: {
    select: {
      collaborator: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          phone: true,
          email: true,
          company: true,
          comment: true,
        },
      },
    },
  },
  fa_validation: {
    select: {
      User: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
      Team: {
        select: {
          name: true,
          color: true,
          icon: true,
        },
      },
      created_at: true,
    },
  },
  fa_refuse: {
    select: {
      User: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
      Team: {
        select: {
          name: true,
          color: true,
          icon: true,
        },
      },
      created_at: true,
    },
  },
  fa_electricity_needs: {
    select: {
      id: true,
      electricity_type: true,
      power: true,
      comment: true,
    },
  },
  fa_signa_needs: {
    select: {
      id: true,
      signa_type: true,
      text: true,
      count: true,
      comment: true,
    },
  },
  fa_comment: {
    select: {
      id: true,
      comment: true,
      subject: true,
      created_at: true,
      User_author: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
      Team: {
        select: {
          name: true,
        },
      },
    },
  },
  time_window: {
    select: {
      id: true,
      start: true,
      end: true,
    },
  },
};

export type FaResponse = Prisma.faGetPayload<{
  select: typeof COMPLETE_FA_SELECT;
}>;

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
    //update every aspect of the fa
    const collaborators = await this.create_collaborators(
      updatefaDto.fa_collaborator,
    );

    await this.prisma.fa.update({
      where: { id: Number(id) },
      data: {
        ...updatefaDto,
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
        fa_comment: {
          createMany: {
            data: updatefaDto.fa_comment || [],
            skipDuplicates: true,
          },
        },
        time_window: {
          createMany: {
            data: updatefaDto.time_window || [],
            skipDuplicates: true,
          },
        },
        fa_electricity_needs: {
          createMany: {
            data: updatefaDto.fa_electricity_needs || [],
            skipDuplicates: true,
          },
        },
      },
    });
    return await this.findOne(id);
  }

  async create(fa: CreateFaDto): Promise<FaResponse | null> {
    return this.prisma.fa.create({ data: fa, select: COMPLETE_FA_SELECT });
  }

  private async create_collaborators(
    fa_collab: CreateCollaboratorDto[],
  ): Promise<collaborator[] | null> {
    if (!fa_collab) return [];
    if (fa_collab.length === 0) return [];
    let all_collab = fa_collab.map((c) => {
      return c.collaborator;
    });
    await this.prisma.collaborator.createMany({
      data: all_collab,
      skipDuplicates: true,
    });
    // trimimg the collaborator to get only the name
    all_collab = all_collab.map((collab) => {
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
          in: all_collab.map((collaborator) => {
            return collaborator.firstname;
          }),
        },
        lastname: {
          in: all_collab.map((collaborator) => {
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
