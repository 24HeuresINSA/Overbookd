import { Injectable, NotFoundException } from '@nestjs/common';
import { FtStatus } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateFtDto } from './dto/create-ft.dto';
import { UpdateFtDto } from './dto/update-ft.dto';
import {
  AllFtResponse,
  ALL_FT_SELECT,
  COMPLETE_FT_SELECT,
  FtResponse,
} from './ftTypes';

export interface SearchFt {
  isDeleted: boolean;
  status?: FtStatus;
}

@Injectable()
export class FtService {
  constructor(private prisma: PrismaService) {}

  async create(ft: CreateFtDto): Promise<FtResponse | null> {
    return this.prisma.ft.create({ data: ft, select: COMPLETE_FT_SELECT });
  }

  async findAll(search: SearchFt): Promise<AllFtResponse[] | null> {
    const where = this.buildFindCondition(search);
    return this.prisma.ft.findMany({
      where,
      orderBy: {
        id: 'asc',
      },
      select: ALL_FT_SELECT,
    });
  }

  async findOne(id: number): Promise<FtResponse | null> {
    return this.prisma.ft.findUnique({
      where: {
        id,
      },
      select: COMPLETE_FT_SELECT,
    });
  }

  async update(
    id: number,
    updateFtDto: UpdateFtDto,
  ): Promise<FtResponse | null> {
    const ft = this.prisma.ft.findUnique({ where: { id } });
    if (!ft) {
      throw new NotFoundException(`ft #${id} not found`);
    }
    return this.prisma.ft.update({
      where: { id },
      data: updateFtDto,
      select: COMPLETE_FT_SELECT,
    });
  }

  async remove(id: number) {
    const ft = this.prisma.ft.findUnique({ where: { id } });
    if (!ft) {
      throw new NotFoundException(`ft #${id} not found`);
    }
    return this.prisma.ft.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  private buildFindCondition({ isDeleted: is_deleted, status }: SearchFt) {
    const statusCondition = status ? { status } : {};
    return { is_deleted, ...statusCondition };
  }
}
