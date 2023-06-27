import { Injectable } from '@nestjs/common';
import { FaElectricityNeed } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateFaElectricityNeedDto } from './dto/create-fa_electricity_need.dto';

@Injectable()
export class FaElectricityNeedsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<FaElectricityNeed[] | null> {
    return await this.prisma.faElectricityNeed.findMany();
  }

  async findOne(id: number): Promise<FaElectricityNeed | null> {
    return await this.prisma.faElectricityNeed.findUnique({
      where: { id },
    });
  }

  async upsert(
    faId: number,
    createFaElectricityNeedDto: CreateFaElectricityNeedDto[],
  ): Promise<FaElectricityNeed[] | null> {
    const operations = createFaElectricityNeedDto.map((elecneeds) => {
      const { id, ...rest } = elecneeds;
      const data = {
        ...rest,
        faId,
      };
      return this.prisma.faElectricityNeed.upsert({
        where: { id: id ?? -1 },
        create: data,
        update: data,
      });
    });
    return this.prisma.$transaction(operations);
  }

  async remove(id: number): Promise<FaElectricityNeed> {
    return await this.prisma.faElectricityNeed.delete({
      where: { id },
    });
  }
}
