import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateFtFeedbacksDto } from './dto/createFtFeedbacks.dto';
import { FtFeedbacksResponseDto } from './dto/ftFeedbacksResponse.dto';

@Injectable()
export class FtFeedbacksService {
  constructor(private prisma: PrismaService) {}

  create(
    ftId: number,
    feedback: CreateFtFeedbacksDto,
  ): Promise<FtFeedbacksResponseDto> {
    return this.prisma.ftFeedbacks.create({
      data: {
        ...feedback,
        ftId,
      },
    });
  }
}
