import { Injectable } from '@nestjs/common';
import { FA } from '@prisma/client';
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
      this.prisma.team.findUnique({ where: { name: createFaDto.FA.team_id } }),
      this.prisma.user.findUnique({ where: { id: createFaDto.FA.in_charge } }),
      this.prisma.location.findUnique({
        where: { id: createFaDto.FA.location_id },
      }),
      this.prisma.fA_type.findUnique({ where: { name: createFaDto.FA.type } }),
    ]);
    //First of all we create or get the collaborator
    const collaborator = await this.prisma.collaborator.upsert({
      where: {
        firstname_lastname: {
          firstname: createFaDto.FA_Collaborators.firstname,
          lastname: createFaDto.FA_Collaborators.lastname,
        },
      },
      update: {},
      create: createFaDto.FA_Collaborators,
    });
    if (!collaborator)
      throw new Error('Error while getting/creating the collaborator');
    const fa = await this.prisma.fA.create({
      data: {
        ...createFaDto.FA,
        FA_Collaborators: {
          create: {
            collaborator_id: collaborator.id,
          },
        },
      },
    });
    if (!fa) throw new Error('Error while creating the FA');
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
