import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateFtTeamRequestRequestDto } from "./dto/create-ft-team-request.request.dto";
import { FtTeamRequestResponseDto } from "./dto/ft-team-request.response.dto";

@Injectable()
export class FtTeamRequestService {
  constructor(private prisma: PrismaService) {}

  async create(
    createFtTeamRequestDto: CreateFtTeamRequestRequestDto[],
    ftId: number,
    twId: number,
  ): Promise<FtTeamRequestResponseDto[]> {
    const allRequests = createFtTeamRequestDto.map(({ quantity, teamCode }) =>
      this.prisma.ftTeamRequest.upsert({
        where: {
          timeWindowsId_teamCode: {
            timeWindowsId: twId,
            teamCode,
          },
        },
        update: {
          quantity,
        },
        create: {
          timeWindowsId: twId,
          teamCode,
          quantity,
        },
        select: {
          quantity: true,
          team: true,
        },
      }),
    );
    return this.prisma.$transaction(allRequests);
  }

  async remove(ftId: number, twId: number, teamCode: string): Promise<void> {
    await this.prisma.ftTeamRequest.delete({
      where: {
        timeWindowsId_teamCode: {
          timeWindowsId: twId,
          teamCode,
        },
      },
    });
  }
}
