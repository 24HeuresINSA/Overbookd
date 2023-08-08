import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  ExportSignaNeed,
  FaSignaNeed,
  FaSignaNeedWithOptionalId,
} from './fa-signa-need.model';
import {
  SELECT_SIGNA_NEED,
  SELECT_SIGNA_NEED_FOR_EXPORT,
} from './fa-signa-need.query';

@Injectable()
export class FaSignaNeedService {
  constructor(private prisma: PrismaService) {}

  async upsert(
    faId: number,
    signaNeed: FaSignaNeedWithOptionalId,
  ): Promise<FaSignaNeed> {
    const signaNeedToUpdate = { ...signaNeed, faId };

    return this.prisma.faSignaNeed.upsert({
      where: { id: signaNeed?.id ?? -1 },
      create: signaNeedToUpdate,
      update: signaNeedToUpdate,
      select: SELECT_SIGNA_NEED,
    });
  }

  async remove(faId: number, id: number): Promise<void> {
    await this.prisma.faSignaNeed.deleteMany({
      where: {
        AND: [{ id }, { faId }],
      },
    });
  }

  async findSignaNeedsForExport(): Promise<ExportSignaNeed[]> {
    const signaNeed = await this.prisma.faSignaNeed.findMany({
      select: SELECT_SIGNA_NEED_FOR_EXPORT,
      where: {
        fa: {
          isDeleted: false,
          faValidation: {
            some: { team: { code: 'signa' } },
          },
        },
      },
    });

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
