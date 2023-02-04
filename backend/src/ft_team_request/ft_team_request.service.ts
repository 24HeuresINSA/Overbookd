import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateFtTeamRequestDto } from './dto/create-ft_team_request.dto';
import { DeleteFtTeamRequestDto } from './dto/deleteFtTeamRequest.dto';
import { FtTeamRequestResponseDto } from './dto/ftTeamRequestResponse.dto';

@Injectable()
export class FtTeamRequestService {
  constructor(private prisma: PrismaService) {}

  async create(
    createFtTeamRequestDto: CreateFtTeamRequestDto[],
    ftId: number,
    twId: number,
  ): Promise<FtTeamRequestResponseDto[]> {
    const allRequests = [];
    for (const req of createFtTeamRequestDto) {
      allRequests.push(
        this.prisma.ftTeamRequest.create({
          data: {
            timeWindowsId: twId,
            teamCode: req.teamCode,
            quantity: req.quantity,
          },
          select: {
            quantity: true,
            team: true,
          },
        }),
      );
    }
    return this.prisma.$transaction(allRequests);
  }

  async remove(
    deleteFtTeamRequest: DeleteFtTeamRequestDto,
    ftId: number,
    twId: number,
  ): Promise<void> {
    await this.prisma.ftTeamRequest.delete({
      where: {
        timeWindowsId_teamCode: {
          timeWindowsId: twId,
          teamCode: deleteFtTeamRequest.teamCode,
        },
      },
    });
  }
}
