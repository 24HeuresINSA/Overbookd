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
    return Promise.all(
      createFaElectricityNeedDto.map(async (elecneeds) => {
        if (elecneeds.id) {
          return await this.prisma.fa_electricity_needs.update({
            where: {
              id: elecneeds.id,
            },
            data: {
              ...elecneeds,
              fa_id: faID,
            },
          });
        } else {
          return await this.prisma.fa_electricity_needs.create({
            data: {
              fa_id: faID,
              ...elecneeds,
            },
          });
        }
      }),
    );
  }
}
