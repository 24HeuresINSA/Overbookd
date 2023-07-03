import { Injectable } from '@nestjs/common';
import { FaElectricityNeed } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateFaElectricityNeedDto } from './dto/createFaElectricityNeed.dto';

@Injectable()
export class FaElectricityNeedService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<FaElectricityNeed[]> {
    return this.prisma.faElectricityNeed.findMany();
  }

  async findOne(id: number): Promise<FaElectricityNeed | null> {
    return this.prisma.faElectricityNeed.findUnique({
      where: { id },
    });
  }

  async upsert(
    faId: number,
    createFaElectricityNeedDto: CreateFaElectricityNeedDto[],
  ): Promise<FaElectricityNeed[]> {
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

  async remove(id: number): Promise<void> {
    await this.prisma.faElectricityNeed.delete({
      where: { id },
    });
  }
}
