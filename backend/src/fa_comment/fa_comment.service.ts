import { Injectable } from '@nestjs/common';
import { FaFeedback, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateFaCommentDto } from './dto/create-fa_comment.dto';

export type EnrichedFAComments = FaFeedback & {
  author?: Pick<User, 'firstname' | 'lastname'>;
};
@Injectable()
export class FaCommentService {
  constructor(private prisma: PrismaService) {}

  private readonly SELECT_COMMENT = {
    id: true,
    fa_id: true,
    comment: true,
    subject: true,
    created_at: true,
    authorId: true,
    author: { select: { firstname: true, lastname: true } },
  };

  async findAll(): Promise<EnrichedFAComments[] | null> {
    return await this.prisma.faFeedback.findMany({
      select: this.SELECT_COMMENT,
    });
  }

  async findOne(id: number): Promise<FaFeedback | null> {
    return await this.prisma.faFeedback.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  async upsert(
    faID: number,
    createFaCommentDto: CreateFaCommentDto[],
  ): Promise<EnrichedFAComments[] | null> {
    const operations = createFaCommentDto.map((faComment) => {
      const data = {
        ...faComment,
        fa_id: faID,
      };
      return this.prisma.faFeedback.upsert({
        where: {
          id: faComment.id || 0,
        },
        update: data,
        create: data,
        select: this.SELECT_COMMENT,
      });
    });
    return this.prisma.$transaction(operations);
  }
}
