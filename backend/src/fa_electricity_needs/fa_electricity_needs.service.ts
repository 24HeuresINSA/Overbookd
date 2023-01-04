import { Injectable } from '@nestjs/common';
import { fa_electricity_needs } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateFaElectricityNeedDto } from './dto/create-fa_electricity_need.dto';

@Injectable()
export class FaElectricityNeedsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<fa_electricity_needs[] | null> {
    return await this.prisma.fa_electricity_needs.findMany();
  }

  async findOne(id: number): Promise<fa_electricity_needs | null> {
    return await this.prisma.fa_electricity_needs.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  async upsert(
    faID: number,
    createFaElectricityNeedDto: CreateFaElectricityNeedDto[],
  ): Promise<fa_electricity_needs[] | null> {
    const operations = createFaElectricityNeedDto.map((elecneeds) => {
      const data = {
        ...elecneeds,
        fa_id: faID,
      };
      if (elecneeds.id) {
        return this.prisma.fa_electricity_needs.update({
          where: {
            id: elecneeds.id ?? -1,
          },
          data: data,
        });
      } else {
        return this.prisma.fa_electricity_needs.create({
          data: data,
        });
      }
    });
    return this.prisma.$transaction(operations);
  }

  async remove(id: number): Promise<fa_electricity_needs> {
    return await this.prisma.fa_electricity_needs.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
