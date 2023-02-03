import { Injectable } from '@nestjs/common';
import { FtReview, FtStatus, reviewStatus } from '@prisma/client';
import { CompleteFtResponseDto } from 'src/ft/dto/ft-response.dto';
import { FtService } from 'src/ft/ft.service';
import { COMPLETE_FT_SELECT } from 'src/ft/ftTypes';
import { PrismaService } from '../prisma.service';
import { UpsertFtReviewsDto } from './dto/upsertFtReviews.dto';

@Injectable()
export class FtReviewsService {
  constructor(private prisma: PrismaService, private ft: FtService) {}

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
    if (status) {
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

    await upsertReview;
    return this.ft.findOne(ftId);
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

  private async getNewFtStatusAfterValidation(
    ftId: number,
  ): Promise<FtStatus> | null {
    const ftValidators = this.prisma.team_Permission.count({
      where: {
        permission_name: 'ft-validator',
      },
    });
    const ftValidatedReviews = this.prisma.ftReview.count({
      where: {
        ftId,
        status: reviewStatus.VALIDATED,
      },
    });
    const [ftValidatorsCount, ftValidatedReviewsCount] =
      await this.prisma.$transaction([ftValidators, ftValidatedReviews]);

    // +1 because the review is not yet created
    if (ftValidatedReviewsCount + 1 >= ftValidatorsCount) {
      return FtStatus.VALIDATED;
    }
    return null;
  }
}
