import { Injectable } from '@nestjs/common';
import { FaSignaNeed } from '@prisma/client';
import { ExportSignaNeeds, EXPORT_SIGNA_SELECT } from 'src/fa/fa_types';
import { PrismaService } from '../prisma.service';
import { CreateFaSignaNeedDto } from './dto/create-fa_signa_need.dto';

@Injectable()
export class FaSignaNeedsService {
  constructor(private prisma: PrismaService) {}
  async upsert(
    faID: number,
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
              fa_id: faID,
            },
          });
        } else {
          return await this.prisma.faSignaNeed.create({
            data: {
              fa_id: faID,
              ...faSignaNeed,
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
      where: {
        id: Number(id),
      },
    });
  }

  async remove(id: number): Promise<FaSignaNeed | null> {
    return await this.prisma.faSignaNeed.delete({
      where: {
        id: Number(id),
      },
    });
  }

  async findSignaNeedsForExport(): Promise<ExportSignaNeeds[]> {
    const signa_needs = await this.prisma.faSignaNeed.findMany({
      select: EXPORT_SIGNA_SELECT,
      where: {
        fa: {
          is_deleted: false,
          fa_validation: {
            some: {
              Team: {
                code: 'signa',
              },
            },
          },
        },
      },
    });
    //map the signa needs to a more readable format for the export remove the nested object
    return signa_needs.map((signa) => ({
      fa_id: signa.fa_id,
      fa_name: signa.fa.name,
      signa_type: signa.signa_type,
      text: signa.text,
      count: signa.count,
      comment: signa.comment,
    }));
  }
}
