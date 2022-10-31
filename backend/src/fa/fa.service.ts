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
      this.prisma.team.findUnique({ where: { name: createFaDto.team_id } }),
      this.prisma.user.findUnique({ where: { id: createFaDto.in_charge } }),
      this.prisma.location.findUnique({
        where: { id: createFaDto.location_id },
      }),
      this.prisma.fA_type.findUnique({ where: { name: createFaDto.type } }),
    ]);
    //We can then create the FA
    return this.prisma.fA.create({ data: createFaDto });
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
