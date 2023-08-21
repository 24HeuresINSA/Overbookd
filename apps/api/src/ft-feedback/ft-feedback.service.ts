import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateFtFeedbackRequestDto } from "./dto/create-ft-feedback.request.dto";
import { FtFeedbackResponse } from "./ft-feedback.model";

@Injectable()
export class FtFeedbackService {
  constructor(private prisma: PrismaService) {}

  create(
    ftId: number,
    feedback: CreateFtFeedbackRequestDto,
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
