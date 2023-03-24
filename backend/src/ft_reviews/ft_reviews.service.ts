import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FtReview, FtStatus, reviewStatus, Status } from '@prisma/client';
import { JwtPayload, JwtUtil } from 'src/auth/entities/JwtUtil.entity';
import { CompleteFtResponseDto } from 'src/ft/dto/ft-response.dto';
import { DataBaseCompleteFt, FtService } from 'src/ft/ft.service';
import { COMPLETE_FT_SELECT, Timespan } from 'src/ft/ftTypes';
import { CreateFtFeedbackDto } from 'src/ft_feedback/dto/createFtFeedback.dto';
import { PrismaService } from '../prisma.service';
import { TimespanParametersDto } from './dto/timeSpanParameters.dto';
import { UpsertFtReviewsDto } from './dto/upsertFtReviews.dto';
import { TimespansGenerator } from './timespansGenerator';

@Injectable()
export class FtReviewsService {
  constructor(private prisma: PrismaService, private ftService: FtService) {}

  private readonly logger = new Logger(FtReviewsService.name);

  async validateFt(
    ftId: number,
    reviewer: UpsertFtReviewsDto,
  ): Promise<CompleteFtResponseDto> {
    const completeReview: FtReview = {
      ftId,
      teamCode: reviewer.teamCode,
      status: reviewStatus.VALIDATED,
    };
    this.logger.log(`Validate FT #${ftId} as ${reviewer.teamCode}`);
    const upsertReview = this.prisma.ftReview.upsert({
      where: { ftId_teamCode: { ftId, teamCode: reviewer.teamCode } },
      create: completeReview,
      update: completeReview,
    });

    const status = await this.getNewFtStatusAfterValidation(ftId);
    if (status) {
      this.logger.log(`Updating FT #${ftId} status to ${status}`);
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
    user: JwtPayload,
  ): Promise<CompleteFtResponseDto> {
    await this.verifyRefusalValidity(ftId, user);
    const completeReview: FtReview = {
      ftId,
      teamCode: reviewer.teamCode,
      status: reviewStatus.REFUSED,
    };
    this.logger.log(`Refuse FT #${ftId} as ${reviewer.teamCode}`);
    const upsertReview = this.prisma.ftReview.upsert({
      where: { ftId_teamCode: { ftId, teamCode: reviewer.teamCode } },
      create: completeReview,
      update: completeReview,
    });

    this.logger.log(`Updating FT #${ftId} status to ${FtStatus.REFUSED}`);
    const updateStatus = this.prisma.ft.update({
      where: { id: ftId },
      data: { status: FtStatus.REFUSED },
      select: COMPLETE_FT_SELECT,
    });

    const removeTimespans = this.removeFtTimespans(ftId);

    const [_, updatedFt] = await this.prisma.$transaction([
      upsertReview,
      updateStatus,
      removeTimespans,
    ]);
    return this.ftService.convertFTtoApiContract(updatedFt);
  }

  async assignmentApproval(
    ftId: number,
    userId: number,
    timeSpanParameters: TimespanParametersDto,
  ): Promise<CompleteFtResponseDto | null> {
    const ft = await this.prisma.ft.findUnique({
      where: { id: ftId },
      select: COMPLETE_FT_SELECT,
    });
    await this.checkSwitchableToReady(ft);

    const timespans = this.computeTimeSpans(ft);

    this.logger.log(`Setting FT #${ftId} as READY`);
    const updateStatusCategoryPriority = this.prisma.ft.update({
      where: { id: ftId },
      data: {
        status: FtStatus.READY,
        category: timeSpanParameters.category,
        hasPriority: timeSpanParameters.hasPriority,
      },
      select: COMPLETE_FT_SELECT,
    });

    this.logger.log(`Creating timespans for FT #${ftId}`);
    const insertTimespans = this.prisma.ftTimespan.createMany({
      data: timespans,
    });

    const feedback: CreateFtFeedbackDto = {
      comment: 'Prête pour affectation !',
      subject: FtStatus.READY,
      authorId: userId,
      createdAt: new Date(),
    };

    this.logger.log(`Generating a default READY comment for FT #${ftId}`);
    const insertFeedback = this.prisma.ftFeedback.create({
      data: {
        ...feedback,
        ftId,
      },
      select: { id: true },
    });

    const [_, updatedFt] = await this.prisma.$transaction([
      insertFeedback,
      updateStatusCategoryPriority,
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

  private async checkSwitchableToReady(ft: DataBaseCompleteFt) {
    if (!ft) {
      throw new NotFoundException('FT introuvable');
    }
    if (ft.status !== FtStatus.VALIDATED) {
      throw new BadRequestException('FT non validée');
    }
    if (ft.fa.status !== Status.VALIDATED) {
      throw new BadRequestException('FA non validée');
    }
    await this.hasAtLeastOneConflict(ft);
  }

  private computeTimeSpans(ft: DataBaseCompleteFt): Timespan[] {
    return ft.timeWindows.flatMap(TimespansGenerator.generateTimespans);
  }

  private async hasAtLeastOneConflict(ft: DataBaseCompleteFt): Promise<void> {
    const ftWithAlsoRequestedConflicts =
      await this.ftService.convertFTtoApiContract(ft);

    const areUsersAvailable = ftWithAlsoRequestedConflicts.timeWindows
      .flatMap((tw) => tw.userRequests)
      .flatMap((ur) => ur.isAvailable)
      .some((na) => na === false);
    if (areUsersAvailable) {
      throw new BadRequestException(
        'Certains bénévoles ne sont pas disponibles',
      );
    }
    const alsoRequestedBy = ftWithAlsoRequestedConflicts.timeWindows
      .flatMap((tw) => tw.userRequests)
      .flatMap((ur) => ur.alsoRequestedBy);
    if (alsoRequestedBy.length > 0) {
      throw new BadRequestException('La FT a des conflits avec d’autres FTs');
    }
  }

  private async verifyRefusalValidity(
    ftId: number,
    jwtPayload: JwtPayload,
  ): Promise<void> {
    const ft = await this.prisma.ft.findUnique({
      where: { id: ftId },
      select: { status: true },
    });

    if (!ft) {
      throw new NotFoundException('FT introuvable');
    }

    if (ft.status !== FtStatus.READY) {
      return;
    }

    const user = new JwtUtil(jwtPayload);
    if (!user.isAdmin() && !user.hasPermission('can-affect')) {
      throw new ForbiddenException(
        'Seuls les utilisateurs avec la permission can-affect peuvent refuser une FT avec le statut READY',
      );
    }
  }

  private removeFtTimespans(ftId: number) {
    return this.prisma.ftTimespan.deleteMany({
      where: {
        timeWindows: {
          ftId,
        },
      },
    });
  }
}
