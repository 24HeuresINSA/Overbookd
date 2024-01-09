import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { FtReview } from "@prisma/client";
import {
  JwtPayload,
  JwtUtil,
} from "../authentication/entities/jwt-util.entity";
import { CreateFtFeedbackRequestDto } from "../ft-feedback/dto/create-ft-feedback.request.dto";
import { ftFeedbackSubjectTypes } from "../ft-feedback/ft-feedback.model";
import { CompleteFtResponseDto } from "../ft/dto/ft.response.dto";
import { FtStatus, ftStatuses } from "../ft/ft.model";
import { DataBaseCompleteFt, FtService } from "../ft/ft.service";
import { COMPLETE_FT_SELECT, TimeSpan } from "../ft/ft-types";
import { PrismaService } from "../prisma.service";
import { TimeSpanParametersRequestDto } from "./dto/time-span-parameters.request.dto";
import { UpsertFtReviewRequestDto } from "./dto/upsert-ft-review.request.dto";
import { TimeSpansGenerator } from "./time-spans-generator";
import { reviewStatuses } from "../ft-review/ft-review.model";
import { AFFECT_VOLUNTEER, VALIDATE_FT } from "@overbookd/permission";
import { VALIDATED } from "@overbookd/festival-event";

@Injectable()
export class FtReviewService {
  constructor(
    private prisma: PrismaService,
    private ftService: FtService,
  ) {}

  private readonly logger = new Logger(FtReviewService.name);

  async validateFt(
    ftId: number,
    reviewer: UpsertFtReviewRequestDto,
  ): Promise<CompleteFtResponseDto> {
    await this.checkSwitchableToValidated(ftId);

    const completeReview: FtReview = {
      ftId,
      teamCode: reviewer.teamCode,
      status: reviewStatuses.VALIDATED,
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
    reviewer: UpsertFtReviewRequestDto,
    user: JwtPayload,
  ): Promise<CompleteFtResponseDto> {
    await this.verifyRefusalValidity(ftId, user);
    const completeReview: FtReview = {
      ftId,
      teamCode: reviewer.teamCode,
      status: reviewStatuses.REFUSED,
    };
    this.logger.log(`Refuse FT #${ftId} as ${reviewer.teamCode}`);
    const upsertReview = this.prisma.ftReview.upsert({
      where: { ftId_teamCode: { ftId, teamCode: reviewer.teamCode } },
      create: completeReview,
      update: completeReview,
    });

    this.logger.log(`Refusing FT #${ftId}`);
    const updateStatus = this.prisma.ft.update({
      where: { id: ftId },
      data: { status: ftStatuses.REFUSED },
      select: COMPLETE_FT_SELECT,
    });

    const removeTimeSpans = this.removeFtTimeSpans(ftId);

    const [_, updatedFt] = await this.prisma.$transaction([
      upsertReview,
      updateStatus,
      removeTimeSpans,
    ]);
    return this.ftService.convertFTtoApiContract(updatedFt);
  }

  async assignmentApproval(
    ftId: number,
    userId: number,
    timeSpanParameters: TimeSpanParametersRequestDto,
  ): Promise<CompleteFtResponseDto | null> {
    const ft = await this.retrieveCompleteFt(ftId);
    await this.checkSwitchableToReady(ft);

    const timeSpans = this.computeTimeSpans(ft);

    this.logger.log(`Setting FT #${ftId} as READY`);
    const updateStatusCategoryPriority = this.prisma.ft.update({
      where: { id: ftId },
      data: {
        status: ftStatuses.READY,
        category: timeSpanParameters.category,
        hasPriority: timeSpanParameters.hasPriority,
      },
      select: COMPLETE_FT_SELECT,
    });

    this.logger.log(`Creating time spans for FT #${ftId}`);
    const insertTimeSpans =
      this.createNestedTimeSpansWithAssignments(timeSpans);

    const feedback: CreateFtFeedbackRequestDto = {
      comment: "Prête pour affectation !",
      subject: ftFeedbackSubjectTypes.READY,
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
      ...insertTimeSpans,
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
    const ftValidators = this.prisma.teamPermission.count({
      where: {
        permissionName: VALIDATE_FT,
      },
    });
    const ftValidatedReviews = this.prisma.ftReview.count({
      where: {
        ftId,
        status: reviewStatuses.VALIDATED,
      },
    });
    const [ftValidatorsCount, ftValidatedReviewsCount] =
      await this.prisma.$transaction([ftValidators, ftValidatedReviews]);

    // +1 because the review is not yet created
    if (ftValidatedReviewsCount + 1 >= ftValidatorsCount) {
      return ftStatuses.VALIDATED;
    }
    return null;
  }

  private async checkSwitchableToReady(ft: DataBaseCompleteFt | null) {
    if (!ft) {
      throw new NotFoundException("FT introuvable");
    }
    if (ft.status !== ftStatuses.VALIDATED) {
      throw new BadRequestException("FT non validée");
    }
    if (ft.fa.status !== VALIDATED) {
      throw new BadRequestException("FA non validée");
    }
    await this.hasAtLeastOneConflict(ft);
  }

  private async checkSwitchableToValidated(ftId: number) {
    const ft = await this.retrieveCompleteFt(ftId);

    if (!ft) {
      throw new NotFoundException("FT introuvable");
    }
    if (ft.status === ftStatuses.READY) {
      throw new BadRequestException("FT prete pour affectation");
    }

    return;
  }

  private async retrieveCompleteFt(
    ftId: number,
  ): Promise<DataBaseCompleteFt | null> {
    return this.prisma.ft.findUnique({
      where: { id: ftId },
      select: COMPLETE_FT_SELECT,
    });
  }

  private computeTimeSpans(ft: DataBaseCompleteFt): TimeSpan[] {
    return ft.timeWindows.flatMap(TimeSpansGenerator.generateTimeSpans);
  }

  private async hasAtLeastOneConflict(ft: DataBaseCompleteFt): Promise<void> {
    const ftWithConflicts = await this.ftService.convertFTtoApiContract(ft);

    const userRequests = ftWithConflicts.timeWindows.flatMap(
      ({ userRequests }) => userRequests,
    );

    const availableError = "Certains bénévoles ne sont pas disponibles";
    const alsoRequestedByError = "La FT a des conflits avec d’autres FTs";
    const alreadyAssignedError = "Certains bénévoles sont déjà affectés";

    userRequests.map(({ alsoRequestedBy, isAvailable, isAlreadyAssigned }) => {
      if (isAvailable && alsoRequestedBy.length === 0 && !isAlreadyAssigned)
        return;

      const errors = [
        !isAvailable ? availableError : "",
        alsoRequestedBy.length > 0 ? alsoRequestedByError : "",
        isAlreadyAssigned ? alreadyAssignedError : "",
      ].filter((err) => err);

      throw new BadRequestException(errors.join(" & "));
    });
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
      throw new NotFoundException("FT introuvable");
    }

    if (ft.status !== ftStatuses.READY) {
      return;
    }

    const user = new JwtUtil(jwtPayload);
    if (!user.can(AFFECT_VOLUNTEER)) {
      throw new ForbiddenException(
        "Seuls les utilisateurs avec la permission affect-volunteer peuvent refuser une FT avec le statut READY",
      );
    }
  }

  private removeFtTimeSpans(ftId: number) {
    return this.prisma.ftTimeSpan.deleteMany({
      where: {
        timeWindow: {
          ftId,
        },
      },
    });
  }

  private createNestedTimeSpansWithAssignments(timeSpans: TimeSpan[]) {
    return timeSpans.map((data) => {
      const { assignments, ...timeSpan } = data;
      return this.prisma.ftTimeSpan.create({
        data: {
          ...timeSpan,
          assignments: {
            create: assignments,
          },
        },
      });
    });
  }
}
