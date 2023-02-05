import { Injectable, NotFoundException } from '@nestjs/common';
import { FtStatus } from '@prisma/client';
import { DataBaseUserRequest } from 'src/ft_user_request/dto/ftUserRequestResponse.dto';
import { FtUserRequestService } from 'src/ft_user_request/ft_user_request.service';
import { PrismaService } from '../prisma.service';
import { CreateFtDto } from './dto/create-ft.dto';
import {
  CompleteFtResponseDto,
  LiteFtResponseDto,
  TimeWindow,
} from './dto/ft-response.dto';
import { UpdateFtDto } from './dto/update-ft.dto';
import { COMPLETE_FT_SELECT, LITE_FT_SELECT } from './ftTypes';
export interface SearchFt {
  isDeleted: boolean;
  status?: FtStatus;
}

type DataBaseTimeWindow = Omit<TimeWindow, 'userRequests'> & {
  userRequests: DataBaseUserRequest[];
};

type DataBaseCompleteFt = Omit<CompleteFtResponseDto, 'timeWindows'> & {
  timeWindows: DataBaseTimeWindow[];
};

@Injectable()
export class FtService {
  constructor(
    private prisma: PrismaService,
    private userRequestService: FtUserRequestService,
  ) {}

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
