import { Injectable } from '@nestjs/common';
import { fa_signa_needs } from '@prisma/client';
import { ExportSignaNeeds, EXPORT_SIGNA_SELECT } from 'src/fa/fa_types';
import { PrismaService } from '../prisma.service';
import { CreateFaSignaNeedDto } from './dto/create-fa_signa_need.dto';

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

  async remove(id: number): Promise<fa_signa_needs | null> {
    return await this.prisma.fa_signa_needs.delete({
      where: {
        id: Number(id),
      },
    });
  }

  async findSignaNeedsForExport(): Promise<ExportSignaNeeds[]> {
    const signa_needs = await this.prisma.fa_signa_needs.findMany({
      select: EXPORT_SIGNA_SELECT,
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
