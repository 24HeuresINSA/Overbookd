import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateFtFeedbackDto } from './dto/createFtFeedback.dto';
import { FtFeedbackResponse } from './ftFeedback.model';

@Injectable()
export class FtFeedbackService {
  constructor(private prisma: PrismaService) {}

  create(
    ftId: number,
    feedback: CreateFtFeedbackDto,
  ): Promise<FtFeedbackResponse> {
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
