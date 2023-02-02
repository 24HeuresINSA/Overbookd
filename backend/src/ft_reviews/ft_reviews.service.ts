import { Injectable } from '@nestjs/common';
import { FtReview, FtStatus, reviewStatus } from '@prisma/client';
import { CompleteFtResponseDto } from 'src/ft/dto/ft-response.dto';
import { COMPLETE_FT_SELECT } from 'src/ft/ftTypes';
import { PrismaService } from '../prisma.service';
import { UpsertFtReviewsDto } from './dto/upsertFtReviews.dto';

@Injectable()
export class FtReviewsService {
  constructor(private prisma: PrismaService) {}

  async validateFt(
    ftId: number,
    reviewer: UpsertFtReviewsDto,
  ): Promise<CompleteFtResponseDto> {
    const completeReview: FtReview = {
      ftId,
      teamCode: reviewer.teamCode,
      status: reviewStatus.VALIDATED,
    };
    const upsertReview = this.prisma.ftReview.upsert({
      where: { ftId_teamCode: { ftId, teamCode: reviewer.teamCode } },
      create: completeReview,
      update: completeReview,
    });

    const status = await this.getNewFtStatusAfterValidation(ftId);
    const updateStatus = this.prisma.ft.update({
      where: { id: ftId },
      data: { status },
      select: COMPLETE_FT_SELECT,
    });
    const updatedFt = await this.prisma
      .$transaction([upsertReview, updateStatus])
      .then((res) => res[1]);
    return updatedFt;
  }

  async refuseFt(
    ftId: number,
    reviewer: UpsertFtReviewsDto,
  ): Promise<CompleteFtResponseDto> {
    const completeReview: FtReview = {
      ftId,
      teamCode: reviewer.teamCode,
      status: reviewStatus.REFUSED,
    };
    const upsertReview = this.prisma.ftReview.upsert({
      where: { ftId_teamCode: { ftId, teamCode: reviewer.teamCode } },
      create: completeReview,
      update: completeReview,
    });

    const updateStatus = this.prisma.ft.update({
      where: { id: ftId },
      data: { status: FtStatus.REFUSED },
      select: COMPLETE_FT_SELECT,
    });

    const updatedFt = await this.prisma
      .$transaction([upsertReview, updateStatus])
      .then((res) => res[1]);
    return updatedFt;
  }

  async getNewFtStatusAfterValidation(ftId: number): Promise<FtStatus> {
    const ftValidators = this.prisma.team_Permission.count({
      where: {
        permission_name: 'ft-validator',
      },
    });
    const ftReviews = this.prisma.ftReview.count({
      where: {
        ftId,
        status: reviewStatus.VALIDATED,
      },
    });
    const [ftValidatorsCount, ftReviewsCount] = await this.prisma.$transaction([
      ftValidators,
      ftReviews,
    ]);

    // +1 because the review is not yet created
    if (ftReviewsCount + 1 >= ftValidatorsCount) return FtStatus.VALIDATED;
    return FtStatus.SUBMITTED;
  }
}
