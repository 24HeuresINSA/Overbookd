import { Injectable } from '@nestjs/common';
import { CompleteFtResponseDto } from 'src/ft/dto/ft-response.dto';
import { PrismaService } from '../prisma.service';
import { UpsertFtReviewsDto } from './dto/upsertFtReviews.dto';

@Injectable()
export class FtReviewsService {
  constructor(private prisma: PrismaService) {}

  async validateFt(
    ftId: number,
    teamCode: string,
    reviewer: UpsertFtReviewsDto,
  ): Promise<CompleteFtResponseDto> {
    const completeReview = {
      ftId,
      teamCode,
      userId: reviewer.userId,
    };
    await this.prisma.ftReview.create({ data: completeReview });
  }
}
