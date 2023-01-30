import { Injectable } from '@nestjs/common';
import { FtReview, FtStatus, reviewStatus } from '@prisma/client';
import { CompleteFtResponseDto } from 'src/ft/dto/ft-response.dto';
import { COMPLETE_FT_SELECT } from 'src/ft/ftTypes';
import { PermissionService } from 'src/permission/permission.service';
import { PrismaService } from '../prisma.service';
import { UpsertFtReviewsDto } from './dto/upsertFtReviews.dto';

@Injectable()
export class FtReviewsService {
  constructor(
    private prisma: PrismaService,
    private readonly permissionService: PermissionService,
  ) {}

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
    return this.prisma.$transaction([upsertReview, updateStatus])[1];
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
    return this.prisma.$transaction([upsertReview, updateStatus])[1];
  }

  async getNewFtStatusAfterValidation(ftId: number): Promise<FtStatus> {
    const ftValidators = await this.permissionService.permission({
      where: { name: 'ft-validator' },
    });
    const ftReviews = await this.prisma.ftReview.findMany({
      where: { ftId },
      select: { teamCode: true, status: true },
    });
    const validatedReviews = ftReviews.filter(
      (review) => review.status === reviewStatus.VALIDATED,
    );

    // -1 because the review is not yet created
    if (validatedReviews.length === ftValidators.length) {
      return FtStatus.VALIDATED;
    }
    return FtStatus.SUBMITTED;
  }
}
