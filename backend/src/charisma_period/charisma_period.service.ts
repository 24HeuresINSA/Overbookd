import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CharismaPeriodResponseDto } from './dto/charismaPeriodResponse.dto';
import { CreateCharismaPeriodDto } from './dto/createCharismaPeriod.dto';
import { UpdateCharismaPeriodDto } from './dto/updateCharismaPeriod.dto';

@Injectable()
export class CharismaPeriodService {
  constructor(private prisma: PrismaService) {}

  async createCharismaPeriod(
    charismaPeriod: CreateCharismaPeriodDto,
  ): Promise<CharismaPeriodResponseDto> {
    return this.prisma.charismaPeriod.create({
      data: charismaPeriod,
    });
  }

  async updateCharismaPeriod(
    id: number,
    charismaPeriod: UpdateCharismaPeriodDto,
  ): Promise<CharismaPeriodResponseDto> {
    return this.prisma.charismaPeriod.update({
      where: { id },
      data: charismaPeriod,
    });
  }

  async findAllCharismaPeriods(): Promise<CharismaPeriodResponseDto[]> {
    return this.prisma.charismaPeriod.findMany();
  }

  async findOneCharismaPeriod(id: number): Promise<CharismaPeriodResponseDto> {
    return this.prisma.charismaPeriod.findUnique({
      where: { id },
    });
  }

  async deleteCharismaPeriod(id: number): Promise<void> {
    await this.prisma.charismaPeriod.delete({
      where: { id },
    });
  }
}
