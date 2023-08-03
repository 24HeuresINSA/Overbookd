import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtUtil } from '../authentication/entities/jwt-util.entity';
import {
  StatsPayload,
  StatsService,
} from '../../src/common/services/stats.service';
import { DataBaseUserRequest } from '../ft-user-request/dto/ft-user-request.response.dto';
import { FtUserRequestService } from '../ft-user-request/ft-user-request.service';
import { PrismaService } from '../prisma.service';
import { CreateFtRequestDto } from './dto/create-ft.request.dto';
import {
  CompleteFtResponseDto,
  LiteFtResponseDto,
} from './dto/ft.response.dto';
import { UpdateFtRequestDto } from './dto/update-ft.request.dto';
import { FtStatus, ftStatuses } from './ft.model';
import {
  COMPLETE_FT_SELECT,
  FtIdResponse,
  LITE_FT_SELECT,
  TimeWindow,
} from './ft-types';
import { ReviewerResponseDto } from './dto/reviewer.response.dto';
export interface SearchFt {
  isDeleted: boolean;
  status?: FtStatus;
}

type DataBaseTimeWindow = Omit<TimeWindow, 'userRequests'> & {
  userRequests: DataBaseUserRequest[];
};

export type DataBaseCompleteFt = Omit<CompleteFtResponseDto, 'timeWindows'> & {
  timeWindows: DataBaseTimeWindow[];
};

@Injectable()
export class FtService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly statsService: StatsService,
    private readonly userRequestService: FtUserRequestService,
  ) {}

  private readonly SELECT_REVIEWER = {
    reviewer: {
      select: {
        id: true,
        firstname: true,
        lastname: true,
        nickname: true,
      },
    },
  };

  private readonly logger = new Logger(FtService.name);

  async create(ft: CreateFtRequestDto): Promise<CompleteFtResponseDto | null> {
    const createdFt = await this.prisma.ft.create({
      data: ft,
      select: COMPLETE_FT_SELECT,
    });

    return this.convertFTtoApiContract(createdFt);
  }

  async findAll(search: SearchFt): Promise<LiteFtResponseDto[]> {
    return this.prisma.ft.findMany({
      where: {
        isDeleted: search.isDeleted,
        status: search.status,
      },
      orderBy: {
        id: 'asc',
      },
      select: LITE_FT_SELECT,
    });
  }

  async getFtStats(): Promise<StatsPayload[]> {
    const ft = await this.prisma.ft.groupBy({
      by: ['teamCode', 'status'],
      where: {
        isDeleted: false,
      },
      _count: {
        status: true,
      },
      orderBy: {
        teamCode: 'asc',
      },
    });
    return this.statsService.stats(ft);
  }

  async findOne(id: number): Promise<CompleteFtResponseDto | null> {
    const ft = await this.prisma.ft.findUnique({
      where: {
        id,
      },
      select: COMPLETE_FT_SELECT,
    });
    return this.convertFTtoApiContract(ft);
  }

  async update(
    id: number,
    updateFtDto: UpdateFtRequestDto,
    author: JwtUtil,
  ): Promise<CompleteFtResponseDto | null> {
    const canAffect = author.hasPermission('can-affect') || author.isAdmin();
    const ft = canAffect
      ? await this.findOne(id)
      : await this.findSubmittableFt(id);

    if (!ft) throw new NotFoundException(`ft #${id} not found`);

    this.logger.log(`Updating FT #${id}`);
    this.logger.debug(JSON.stringify(updateFtDto));
    const updatedFt = await this.prisma.ft.update({
      where: { id },
      data: updateFtDto,
      select: COMPLETE_FT_SELECT,
    });
    return this.convertFTtoApiContract(updatedFt);
  }

  async submit(id: number): Promise<CompleteFtResponseDto | null> {
    const [ft, reviewerCandidate] = await Promise.all([
      this.findSubmittableFt(id),
      this.findBestReviewerCandidate(),
    ]);
    if (!ft) throw new NotFoundException(`ft #${id} not found`);

    const reviewerId = ft.reviewerId ?? reviewerCandidate.id;

    this.logger.log(`Submitting FT #${id}`);
    const submittedFt = await this.prisma.ft.update({
      where: { id },
      data: {
        status: ftStatuses.SUBMITTED,
        reviewerId,
      },
      select: COMPLETE_FT_SELECT,
    });
    return this.convertFTtoApiContract(submittedFt);
  }

  async remove(id: number) {
    this.logger.log(`Trying to delete FT #${id}`);
    const ft = await this.prisma.ft.findFirst({
      where: { id, NOT: { status: ftStatuses.READY } },
    });

    if (!ft) {
      throw new BadRequestException(
        "La FT n'est pas supprimable, il faut peut-etre la refuser avant",
      );
    }

    await this.prisma.ft.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async findPrevious(id: number): Promise<FtIdResponse | null> {
    return this.prisma.ft.findFirst({
      where: {
        id: { lt: id },
        isDeleted: false,
      },
      orderBy: { id: 'desc' },
      select: {
        id: true,
      },
    });
  }

  async findNext(id: number): Promise<FtIdResponse | null> {
    return this.prisma.ft.findFirst({
      where: {
        id: { gt: id },
        isDeleted: false,
      },
      orderBy: { id: 'asc' },
      select: {
        id: true,
      },
    });
  }

  async assignReviewer(
    taskId: number,
    reviewerId: number,
  ): Promise<ReviewerResponseDto> {
    await this.checkAssignmentValidity(taskId, reviewerId);

    const data = { reviewerId };
    const where = { id: taskId };

    this.logger.log(
      `Assigning User #${reviewerId} as reviewer for FT #${taskId}`,
    );
    const ftAssigned = await this.prisma.ft.update({
      data,
      where,
      select: this.SELECT_REVIEWER,
    });

    return ftAssigned.reviewer;
  }

  private async checkAssignmentValidity(taskId: number, reviewerId: number) {
    const teams = this.buildTeamCodeCondition('humain');
    const [existingTask, reviewer] = await Promise.all([
      this.prisma.ft.findFirst({
        select: { id: true },
        where: { id: taskId },
      }),
      this.prisma.user.findFirst({
        select: { id: true },
        where: { id: reviewerId, teams },
      }),
    ]);

    if (!existingTask) throw new NotFoundException(`FT #${taskId} non trouvee`);
    if (!reviewer) {
      throw new BadRequestException(
        'Mauvais candidat pour devenir responsable',
      );
    }
  }

  async convertFTtoApiContract(
    ft: DataBaseCompleteFt,
  ): Promise<CompleteFtResponseDto> {
    const timeWindows = await Promise.all(
      ft.timeWindows.map((timewindow) => this.convertToTimeWindow(timewindow)),
    );
    return { ...ft, timeWindows };
  }

  private async convertToTimeWindow(
    timeWindow: DataBaseTimeWindow,
  ): Promise<TimeWindow> {
    const userRequests = await Promise.all(
      timeWindow.userRequests.map((userRequest) =>
        this.userRequestService.convertToUserRequest(userRequest),
      ),
    );
    return { ...timeWindow, userRequests };
  }

  private async findBestReviewerCandidate() {
    const teams = this.buildTeamCodeCondition('humain');
    return this.prisma.user.findFirst({
      select: { id: true },
      where: { teams },
      orderBy: [{ ftsInReview: { _count: 'asc' } }],
    });
  }

  private buildTeamCodeCondition(code: string) {
    return { some: { team: { code } } };
  }

  private findSubmittableFt(id: number) {
    return this.prisma.ft.findFirst({
      where: {
        id,
        NOT: { status: { in: [ftStatuses.READY, ftStatuses.VALIDATED] } },
      },
      select: { reviewerId: true },
    });
  }
}
