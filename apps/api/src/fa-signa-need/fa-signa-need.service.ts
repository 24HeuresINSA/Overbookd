import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FaSignaNeed, FaSignaNeedWithOptionalId } from './fa-signa-need.model';

const SELECT_SIGNA_NEED = {
  id: true,
  signaType: true,
  text: true,
  count: true,
  size: true,
  comment: true,
};

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
}
