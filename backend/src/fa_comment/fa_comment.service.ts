import { Injectable } from '@nestjs/common';
import { FaFeedback, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateFaCommentDto } from './dto/create-fa_comment.dto';

export type EnrichedFaFeeback = {
  id: number;
  faId: number;
  comment: string;
  subject: string;
  createdAt: Date;
  author?: Pick<User, 'id' | 'firstname' | 'lastname'>;
};
@Injectable()
export class FaCommentService {
  constructor(private prisma: PrismaService) {}

  private readonly SELECT_COMMENT = {
    id: true,
    faId: true,
    comment: true,
    subject: true,
    createdAt: true,
    author: { select: { id: true, firstname: true, lastname: true } },
  };

  async findAll(): Promise<EnrichedFaFeeback[] | null> {
    return this.prisma.faFeedback.findMany({
      select: this.SELECT_COMMENT,
    });
  }

  async findOne(id: number): Promise<FaFeedback | null> {
    return this.prisma.faFeedback.findUnique({
      where: { id },
    });
  }

  async upsert(
    faId: number,
    createFaCommentDto: CreateFaCommentDto[],
  ): Promise<EnrichedFaFeeback[] | null> {
    const operations = createFaCommentDto.map((faComment) => {
      const data = {
        ...faComment,
        faId,
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
