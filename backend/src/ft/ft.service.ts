import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FtStatus } from '@prisma/client';
import { StatsPayload, StatsService } from 'src/common/services/stats.service';
import { DataBaseUserRequest } from 'src/ft_user_request/dto/ftUserRequestResponse.dto';
import { FtUserRequestService } from 'src/ft_user_request/ft_user_request.service';
import { PrismaService } from '../prisma.service';
import { CreateFtDto } from './dto/create-ft.dto';
import {
  CompleteFtResponseDto,
  LiteFtResponseDto,
} from './dto/ft-response.dto';
import { ReviewerResponseDto } from './dto/ReviewerResponse.dto';
import { UpdateFtDto } from './dto/update-ft.dto';
import {
  COMPLETE_FT_SELECT,
  FtIdResponse,
  LITE_FT_SELECT,
  TimeWindow,
} from './ftTypes';
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

  async create(ft: CreateFtDto): Promise<CompleteFtResponseDto | null> {
    const createdFt = await this.prisma.ft.create({
      data: ft,
      select: COMPLETE_FT_SELECT,
    });

    return this.convertFTtoApiContract(createdFt);
  }

  async findAll(search: SearchFt): Promise<LiteFtResponseDto[] | null> {
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
    updateFtDto: UpdateFtDto,
  ): Promise<CompleteFtResponseDto | null> {
    const ft = await this.findOne(id);
    if (!ft) {
      throw new NotFoundException(`ft #${id} not found`);
    }
    const updatedFt = await this.prisma.ft.update({
      where: { id },
      data: updateFtDto,
      select: COMPLETE_FT_SELECT,
    });
    return this.convertFTtoApiContract(updatedFt);
  }

  async submit(id: number): Promise<CompleteFtResponseDto | null> {
    const ft = await this.findOne(id);
    if (!ft) throw new NotFoundException(`ft #${id} not found`);

    const submittedFt = await this.prisma.ft.update({
      where: { id },
      data: {
        status: FtStatus.SUBMITTED,
      },
      select: COMPLETE_FT_SELECT,
    });
    return this.convertFTtoApiContract(submittedFt);
  }

  async remove(id: number) {
    const ft = this.prisma.ft.findUnique({ where: { id } });
    if (!ft) return;
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
    await this.checkAssignementValidity(taskId, reviewerId);

    const data = { reviewerId };
    const where = { id: taskId };

    const ftAssigned = await this.prisma.ft.update({
      data,
      where,
      select: this.SELECT_REVIEWER,
    });

    return ftAssigned.reviewer;
  }

  private async checkAssignmentValidity(taskId: number, reviewerId: number) {
    const [existingTask, reviewer] = await Promise.all([
      this.prisma.ft.findFirst({
        select: { id: true },
        where: { id: taskId },
      }),
      this.prisma.user.findFirst({
        select: { id: true },
        where: { id: reviewerId, team: { some: { team: { code: 'human' } } } },
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
}
