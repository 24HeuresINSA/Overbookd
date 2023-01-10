import { Injectable, NotFoundException } from '@nestjs/common';
import { Ft, ftStatus } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateFtDto } from './dto/create-ft.dto';
import { UpdateFtDto } from './dto/update-ft.dto';

export interface SearchFt {
  isDeleted: boolean;
  status?: ftStatus;
}

@Injectable()
export class FtService {
  constructor(private prisma: PrismaService) {}

  private buildFindCondition({ isDeleted: is_deleted, status }: SearchFt) {
    const statusCondition = status ? { status } : {};
    return { is_deleted, ...statusCondition };
  }

  async create(ft: CreateFtDto): Promise<Ft | null> {
    return this.prisma.ft.create({ data: ft });
  }

  async findAll(search: SearchFt): Promise<Ft[] | null> {
    const where = this.buildFindCondition(search);
    return this.prisma.ft.findMany({
      where,
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number): Promise<Ft | null> {
    return this.prisma.ft.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateFtDto: UpdateFtDto): Promise<Ft | null> {
    const ft = this.prisma.ft.findUnique({ where: { id } });
    if (!ft) {
      throw new NotFoundException(`ft #${id} not found`);
    }
    return this.prisma.ft.update({
      where: { id },
      data: updateFtDto,
    });
  }

  async remove(id: number): Promise<Ft | null> {
    const ft = this.prisma.ft.findUnique({ where: { id } });
    if (!ft) {
      throw new NotFoundException(`ft #${id} not found`);
    }
    return this.prisma.ft.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
