import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma.service';
import { CreateFaFeedbackDto } from './dto/createFaFeedback.dto';
import { FaFeedbackResponse } from './faFeedback.model';

@Injectable()
export class FaFeedbackService {
  constructor(private prisma: PrismaService) {}

  create(
    faId: number,
    feedback: CreateFaFeedbackDto,
  ): Promise<FaFeedbackResponse> {
    return this.prisma.faFeedback.create({
      data: {
        ...feedback,
        faId,
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
