import { Injectable } from '@nestjs/common';
import { FaSignaNeed } from '@prisma/client';
import { EXPORT_SIGNA_SELECT, ExportSignaNeeds } from 'src/fa/faTypes';
import { PrismaService } from '../prisma.service';
import { CreateFaSignaNeedDto } from './dto/create-fa_signa_need.dto';

@Injectable()
export class FaSignaNeedsService {
  constructor(private prisma: PrismaService) {}
  async upsert(
    faId: number,
    createFaSignaNeedDto: CreateFaSignaNeedDto[],
  ): Promise<FaSignaNeed[] | null> {
    return Promise.all(
      createFaSignaNeedDto.map(async (faSignaNeed) => {
        if (faSignaNeed.id) {
          return await this.prisma.faSignaNeed.update({
            where: {
              id: faSignaNeed.id,
            },
            data: {
              ...faSignaNeed,
              faId,
            },
          });
        } else {
          return await this.prisma.faSignaNeed.create({
            data: {
              ...faSignaNeed,
              faId,
            },
          });
        }
      }),
    );
  }

  async findAll(): Promise<FaSignaNeed[] | null> {
    return await this.prisma.faSignaNeed.findMany();
  }

  async findOne(id: number): Promise<FaSignaNeed | null> {
    return await this.prisma.faSignaNeed.findUnique({
      where: { id },
    });
  }

  async remove(id: number): Promise<FaSignaNeed | null> {
    return await this.prisma.faSignaNeed.delete({
      where: { id },
    });
  }

  async findSignaNeedsForExport(): Promise<ExportSignaNeeds[]> {
    const signaNeed = await this.prisma.faSignaNeed.findMany({
      select: EXPORT_SIGNA_SELECT,
      where: {
        fa: {
          isDeleted: false,
          faValidation: {
            some: {
              team: {
                code: 'signa',
              },
            },
          },
        },
      },
    });
    //map the signa needs to a more readable format for the export remove the nested object
    return signaNeed.map((signa) => ({
      faId: signa.faId,
      faName: signa.fa.name,
      signaType: signa.signaType,
      text: signa.text,
      count: signa.count,
      comment: signa.comment,
    }));
  }
}
