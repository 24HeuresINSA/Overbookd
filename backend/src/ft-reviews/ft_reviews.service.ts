import { Injectable } from '@nestjs/common';
import { CompleteFtResponseDto } from 'src/ft/dto/ft-response.dto';
import { PrismaService } from '../prisma.service';
import { UpsertFtReviewsDto } from './dto/upsertFtReviews.dto';

@Injectable()
export class FtReviewsService {
  constructor(private prisma: PrismaService) {}

  validateFt(
    ftId: number,
    teamId: number,
    tw: UpsertFtReviewsDto,
  ): Promise<CompleteFtResponseDto> {
    const completeReview = {
      ...tw,
      ftId,
    };
    return this.prisma.ftTimeWindows.upsert({
      where: {
        id: completeTw.id || 0,
      },
      update: completeTw,
      create: completeTw,
    });
  }
}
