import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateFaFeedbackRequestDto } from "./dto/create-fa-feedback.request.dto";
import { FaFeedbackResponse } from "./fa-feedback.model";

@Injectable()
export class FaFeedbackService {
  constructor(private prisma: PrismaService) {}

  create(
    faId: number,
    feedback: CreateFaFeedbackRequestDto,
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
