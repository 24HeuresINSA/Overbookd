import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { FtReview, FtStatus, reviewStatus } from '@prisma/client';
import { CompleteFtResponseDto } from 'src/ft/dto/ft-response.dto';
import { DataBaseCompleteFt, FtService } from 'src/ft/ft.service';
import { COMPLETE_FT_SELECT, Timespan } from 'src/ft/ftTypes';
import { CreateFtFeedbackDto } from 'src/ft_feedback/dto/createFtFeedback.dto';
import { PrismaService } from '../prisma.service';
import { UpsertFtReviewsDto } from './dto/upsertFtReviews.dto';
import { TimespansGenerator } from './timespansGenerator';

@Injectable()
export class FtReviewsService {
  constructor(private prisma: PrismaService, private ftService: FtService) {}

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
      const [_, updatedFt] = await this.prisma.$transaction([
        upsertReview,
        updateStatus,
      ]);
      return this.ftService.convertFTtoApiContract(updatedFt);
    }

    await upsertReview;
    return this.ftService.findOne(ftId);
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

    const [_, updatedFt] = await this.prisma.$transaction([
      upsertReview,
      updateStatus,
    ]);
    return this.ftService.convertFTtoApiContract(updatedFt);
  }

  async assignementApproval(
    ftId: number,
    userId: number,
  ): Promise<CompleteFtResponseDto | null> {
    const ft = await this.prisma.ft.findUnique({
      where: { id: ftId },
      select: COMPLETE_FT_SELECT,
    });
    this.checkSwitchableToReady(ft);

    const timespans = this.computeTimeSpans(ft);

    const updateStatus = this.prisma.ft.update({
      where: { id: ftId },
      data: { status: FtStatus.READY },
      select: COMPLETE_FT_SELECT,
    });

    const insertTimespans = this.prisma.ftTimespan.createMany({
      data: timespans,
    });

    const feedback: CreateFtFeedbackDto = {
      comment: 'Prête pour affectation !',
      subject: FtStatus.READY,
      authorId: userId,
      createdAt: new Date(),
    };

    const insertFeedback = this.prisma.ftFeedback.create({
      data: {
        ...feedback,
        ftId,
      },
      select: { id: true },
    });

    const [_, updatedFt] = await this.prisma.$transaction([
      insertFeedback,
      updateStatus,
      insertTimespans,
    ]);

    return this.ftService.convertFTtoApiContract(updatedFt);
  }

  async remove(ftId: number, teamCode: string): Promise<void> {
    await this.prisma.ftReview.delete({
      where: { ftId_teamCode: { ftId, teamCode: teamCode } },
    });
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

  private checkSwitchableToReady(ft: DataBaseCompleteFt): boolean {
    if (!ft) {
      throw new NotFoundException('FT not found');
    }
    if (ft.status !== FtStatus.VALIDATED) {
      throw new BadRequestException('FT is not validated');
    }
    if (ft.fa.status !== FtStatus.VALIDATED) {
      throw new BadRequestException('FA is not validated');
    }
    // TODO Check for conflicts
    throw new NotImplementedException();
    return true;
  }

  private computeTimeSpans(ft: DataBaseCompleteFt): Timespan[] {
    return ft.timeWindows.flatMap(TimespansGenerator.generateTimespans);
  }
}
