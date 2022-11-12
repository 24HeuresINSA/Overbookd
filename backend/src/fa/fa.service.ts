import { Injectable } from '@nestjs/common';
import { Collaborator, FA } from '@prisma/client';
import { CreateFaDto } from './dto/create-fa.dto';
import { UpdateFaDto } from './dto/update-fa.dto';
import { PrismaService } from '../prisma.service';
import { NotFoundError } from '@prisma/client/runtime';
import { CreateCollaboratorDto } from '../collaborator/dto/create-collaborator.dto';
import { CreateSecurityPassDto } from '../security_pass/dto/create-security_pass.dto';
import { UserWithoutPassword } from '../user/user.service';

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
    return this.prisma.fA.findUnique({ where: { id: Number(id) } });
  }

  /**      **/
  /** POST **/
  /**      **/

  async create(createFaDto: CreateFaDto): Promise<FA | null> {
    //Check if all the foreign keys are valid (team, in_charge user, location, type)
    await this.prisma.$transaction([
      this.prisma.team.findUnique({ where: { id: createFaDto.FA.team_id } }),
      this.prisma.user.findUnique({ where: { id: createFaDto.FA.in_charge } }),
      this.prisma.location.findUnique({
        where: { id: createFaDto.FA.location_id },
      }),
      this.prisma.fA_type.findUnique({ where: { name: createFaDto.FA.type } }),
    ]);
    //First of all we create or get the collaborator and skip existing collaborators
    const collaborators = await this.create_collaborators(
      createFaDto.FA_Collaborators,
    );
    const fa = await this.prisma.fA.create({
      data: {
        ...createFaDto.FA,
        FA_Collaborators: {
          createMany: {
            data: collaborators.map((collaborator) => {
              return {
                collaborator_id: collaborator.id,
              };
            }),
          },
        },
      },
    });
    if (!fa) throw new Error('Error while creating the FA');
    //we then add security passes with the ID of the FA
    await this.createSecurityPasses(createFaDto.Security_pass, fa.id);
    return fa;
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
  ): Promise<void> {
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
  }

  async update(id: number, updateFaDto: UpdateFaDto): Promise<FA | null> {
    //find the FA
    const fa = await this.prisma.fA.findUnique({ where: { id: Number(id) } });
    if (!fa) throw new NotFoundError(`FA with id ${id} not found`);

    return null;
  }

  async remove(id: number): Promise<FA | null> {
    return null;
  }

  async validateFa(fa_id: number, user_id: number): Promise<FA | null> {
    return null;
  }
}
