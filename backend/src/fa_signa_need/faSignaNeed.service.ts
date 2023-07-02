import { Injectable } from '@nestjs/common';
import { FaSignaNeed } from '@prisma/client';
import {
  EXPORT_SIGNA_SELECT,
  ExportSignaNeeds as ExportSignaNeed,
} from 'src/fa/faTypes';
import { PrismaService } from '../prisma.service';
import { CreateFaSignaNeedDto } from './dto/createFaSignaNeed.dto';

@Injectable()
export class FaSignaNeedService {
  constructor(private prisma: PrismaService) {}
  async upsert(
    faId: number,
    createFaSignaNeedDto: CreateFaSignaNeedDto[],
  ): Promise<FaSignaNeed[]> {
    return Promise.all(
      createFaSignaNeedDto.map(async (faSignaNeed) => {
        if (faSignaNeed.id) {
          return this.prisma.faSignaNeed.update({
            where: { id: faSignaNeed.id },
            data: {
              ...faSignaNeed,
              faId,
            },
          });
        } else {
          return this.prisma.faSignaNeed.create({
            data: {
              ...faSignaNeed,
              faId,
            },
          });
        }
      }),
    );
  }

  async findAll(): Promise<FaSignaNeed[]> {
    return this.prisma.faSignaNeed.findMany();
  }

  async findOne(id: number): Promise<FaSignaNeed | null> {
    return this.prisma.faSignaNeed.findUnique({
      where: { id },
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.faSignaNeed.delete({
      where: { id },
    });
  }

  async findSignaNeedsForExport(): Promise<ExportSignaNeed[]> {
    const signaNeed = await this.prisma.faSignaNeed.findMany({
      select: EXPORT_SIGNA_SELECT,
      where: {
        fa: {
          isDeleted: false,
          faValidation: {
            some: {
              team: { code: 'signa' },
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
