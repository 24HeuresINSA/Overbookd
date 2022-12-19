import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TeamService } from '../team/team.service';
import { PrismaService } from '../prisma.service';
import { PermissionFormDto } from './dto/permissionForm.dto';
import { PermissionResponseDto } from './dto/permissionResponse.dto';

const SELECT_PERMISSION = {
  id: true,
  name: true,
  description: true,
};

const SELECT_PERMISSION_TEAM = {
  teams: {
    select: {
      team: {
        select: {
          code: true,
        },
      },
    },
  },
};

@Injectable()
export class PermissionService {
  constructor(
    private prisma: PrismaService,
    private teamService: TeamService,
  ) {}

  async permission(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PermissionWhereUniqueInput;
    where?: Prisma.PermissionWhereInput;
    orderBy?: Prisma.PermissionOrderByWithRelationInput;
    select?: Prisma.PermissionSelect;
  }): Promise<PermissionResponseDto[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const permissions = await this.prisma.permission.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        ...SELECT_PERMISSION,
        ...SELECT_PERMISSION_TEAM,
      },
    });
    return permissions.map((permission) => ({
      ...permission,
      teams: permission.teams.map((team) => team.team.code),
    }));
  }

  async createPermission(
    payload: PermissionFormDto,
  ): Promise<PermissionResponseDto> {
    await this.assertUniquePermissionName(payload.name);
    const permission = await this.prisma.permission.create({
      data: payload,
    });
    return { ...permission, teams: [] };
  }

  async updatePermission(
    id: number,
    params: PermissionFormDto,
  ): Promise<PermissionResponseDto> {
    const permission = await this.permissionExists(id);
    const newPermission = await this.prisma.permission.update({
      where: { id },
      data: {
        description: params.description, // Only update description
      },
    });
    return { ...newPermission, teams: permission.teams };
  }

  async deletePermission(id: number): Promise<void> {
    await this.permissionExists(id);
    await this.prisma.permission.delete({ where: { id } });
  }

  async linkPermissionToTeam(
    permissionId: number,
    teamCodes: string[],
  ): Promise<PermissionResponseDto> {
    const permission = await this.permissionExists(permissionId);
    await this.assertTeamCodesExist(teamCodes);
    await this.forcePermissionTeams(permission.name, teamCodes);

    return { ...permission, teams: teamCodes };
  }

  async isAllowed(permissionNames: string[], teamCodes: string[]) {
    const permissions = await this.permission({
      where: {
        name: {
          in: permissionNames,
        },
        teams: {
          some: {
            team_code: {
              in: teamCodes,
            },
          },
        },
      },
    });
    return permissions.length > 0;
  }

  private async permissionExists(
    permissionId: number,
  ): Promise<PermissionResponseDto> {
    const permissions = await this.permission({ where: { id: permissionId } });
    if (permissions.length !== 1) {
      throw new NotFoundException('Permission does not exist');
    }
    return permissions[0];
  }

  private async assertUniquePermissionName(
    permissionName: string,
  ): Promise<void> {
    const permissions = await this.permission({
      where: { name: permissionName },
    });
    if (permissions.length > 0) {
      throw new ConflictException('Permission name already exists');
    }
  }

  private async assertTeamCodesExist(teamCodes: string[]) {
    const teams = await this.teamService.team({
      where: { code: { in: teamCodes } },
    });
    if (teams.length !== teamCodes.length) {
      throw new NotFoundException('All the provided Teams does not exist');
    }
  }

  private async forcePermissionTeams(
    permissionName: string,
    teamCodes: string[],
  ) {
    const deleteAll = this.prisma.team_Permission.deleteMany({
      where: {
        permission_name: permissionName,
      },
    });

    const createNew = this.prisma.team_Permission.createMany({
      data: teamCodes.map((teamCode) => ({
        permission_name: permissionName,
        team_code: teamCode,
      })),
    });

    return this.prisma.$transaction([deleteAll, createNew]);
  }
}
