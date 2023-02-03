import { Injectable, NotFoundException } from '@nestjs/common';
import { FtStatus } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateFtDto } from './dto/create-ft.dto';
import {
  CompleteFtResponseDto,
  LiteFtResponseDto,
} from './dto/ft-response.dto';
import { UpdateFtDto } from './dto/update-ft.dto';
import { COMPLETE_FT_SELECT, LITE_FT_SELECT } from './ftTypes';
export interface SearchFt {
  isDeleted: boolean;
  status?: FtStatus;
}

@Injectable()
export class FtService {
  constructor(private prisma: PrismaService) {}

  async create(ft: CreateFtDto): Promise<CompleteFtResponseDto | null> {
    return this.prisma.ft.create({ data: ft, select: COMPLETE_FT_SELECT });
  }

  async findAll(search: SearchFt): Promise<LiteFtResponseDto[] | null> {
    return this.prisma.ft.findMany({
      where: {
        isDeleted: search.isDeleted,
        status: search.status,
      },
      orderBy: {
        id: 'asc',
      },
      select: LITE_FT_SELECT,
    });
  }

  async findOne(id: number): Promise<CompleteFtResponseDto | null> {
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
  ): Promise<CompleteFtResponseDto | null> {
    const ft = await this.findOne(id);
    if (!ft) {
      throw new NotFoundException(`ft #${id} not found`);
    }
    return this.prisma.ft.update({
      where: { id },
      data: updateFtDto,
      select: COMPLETE_FT_SELECT,
    });
  }

  async submit(id: number): Promise<CompleteFtResponseDto | null> {
    const ft = await this.findOne(id);
    if (!ft) throw new NotFoundException(`ft #${id} not found`);

    return this.prisma.ft.update({
      where: { id },
      data: {
        status: FtStatus.SUBMITTED,
      },
      select: COMPLETE_FT_SELECT,
    });
  }

  async remove(id: number) {
    const ft = this.prisma.ft.findUnique({ where: { id } });
    if (!ft) return;
    await this.prisma.ft.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  private buildFindCondition({ isDeleted: is_deleted, status }: SearchFt) {
    const statusCondition = status ? { status } : {};
    return { is_deleted, ...statusCondition };
  }
}
