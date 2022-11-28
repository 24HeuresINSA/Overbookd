import { Injectable } from '@nestjs/common';
import { CreateFaSignaNeedDto } from './dto/create-fa_signa_need.dto';
import { PrismaService } from '../prisma.service';
import { fa_signa_needs } from '@prisma/client';

@Injectable()
export class FaSignaNeedsService {
  constructor(private prisma: PrismaService) {}
  async upsert(
    faID: number,
    createFaSignaNeedDto: CreateFaSignaNeedDto[],
  ): Promise<fa_signa_needs[] | null> {
    return Promise.all(
      createFaSignaNeedDto.map(async (faSignaNeed) => {
        if (faSignaNeed.id) {
          return await this.prisma.fa_signa_needs.update({
            where: {
              id: faSignaNeed.id,
            },
            data: {
              ...faSignaNeed,
              fa_id: faID,
            },
          });
        } else {
          return await this.prisma.fa_signa_needs.create({
            data: {
              fa_id: faID,
              ...faSignaNeed,
            },
          });
        }
      }),
    );
  }

  async findAll(): Promise<fa_signa_needs[] | null> {
    return await this.prisma.fa_signa_needs.findMany();
  }

  async findOne(id: number): Promise<fa_signa_needs | null> {
    return await this.prisma.fa_signa_needs.findUnique({
      where: {
        id: Number(id),
      },
    });
  }
}
