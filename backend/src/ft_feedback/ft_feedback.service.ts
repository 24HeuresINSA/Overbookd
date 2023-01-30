import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateFtFeedbackDto } from './dto/createFtFeedback.dto';
import { FtFeedbackResponseDto } from './dto/ftFeedbackResponse.dto';

@Injectable()
export class FtFeedbackService {
  constructor(private prisma: PrismaService) {}

  create(
    ftId: number,
    feedback: CreateFtFeedbackDto,
  ): Promise<FtFeedbackResponseDto> {
    return this.prisma.ftFeedback.create({
      data: {
        ...feedback,
        ftId,
      },
      select: {
        id: true,
        author: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
        createdAt: true,
        subject: true,
        comment: true,
      },
    });
  }
}
