import { Injectable } from '@nestjs/common';
import { Collaborator, FA } from '@prisma/client';
import { CreateFaDto } from './dto/create-fa.dto';
import { UpdateFaDto } from './dto/update-fa.dto';
import { PrismaService } from '../prisma.service';
import { NotFoundError } from '@prisma/client/runtime';

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
    let collaborators: Collaborator[] = [];
    if (createFaDto.FA_Collaborators) {
      await this.prisma.collaborator.createMany({
        data: createFaDto.FA_Collaborators,
        skipDuplicates: true,
      });
      //Then get all the collaborators
      collaborators = await this.prisma.collaborator.findMany({
        where: {
          firstname: {
            in: createFaDto.FA_Collaborators.map((collaborator) => {
              return collaborator.firstname;
            }),
          },
          lastname: {
            in: createFaDto.FA_Collaborators.map((collaborator) => {
              return collaborator.lastname;
            }),
          },
        },
      });
      if (collaborators.length !== createFaDto.FA_Collaborators.length) {
        throw new Error('Some collaborators were not created');
      }
    }
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
    if (createFaDto.Security_pass) {
      const security_pass = createFaDto.Security_pass.map((pass) => {
        return {
          ...pass,
          fa_id: fa.id,
        };
      });
      await this.prisma.security_pass.createMany({
        data: security_pass,
      });
      const created_pass = await this.prisma.security_pass.findMany({
        where: {
          fa_id: fa.id,
        },
      });
      if (created_pass.length !== createFaDto.Security_pass.length) {
        throw new Error('some passes were not created');
      }
    }
    return fa;
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
}
