import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CharismaPeriodResponseDto } from './dto/charisma-period.response.dto';
import { CreateCharismaPeriodRequestDto } from './dto/create-charisma-period.request.dto';
import { UpdateCharismaPeriodRequestDto } from './dto/update-charisma-period.request.dto';

@Injectable()
export class CharismaPeriodService {
  constructor(private prisma: PrismaService) {}

  async createCharismaPeriod(
    charismaPeriod: CreateCharismaPeriodRequestDto,
  ): Promise<CharismaPeriodResponseDto> {
    return this.prisma.charismaPeriod.create({
      data: charismaPeriod,
    });
  }

  async updateCharismaPeriod(
    id: number,
    charismaPeriod: UpdateCharismaPeriodRequestDto,
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
