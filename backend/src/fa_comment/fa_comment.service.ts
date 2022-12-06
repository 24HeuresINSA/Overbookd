import { Injectable } from '@nestjs/common';
import { fa_comments, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateFaCommentDto } from './dto/create-fa_comment.dto';

export type EnrichedFAComments = fa_comments & {
  User_author?: Pick<User, 'firstname' | 'lastname'>;
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
    author: true,
    User_author: { select: { firstname: true, lastname: true } },
  };

  async findAll(): Promise<EnrichedFAComments[] | null> {
    return await this.prisma.fa_comments.findMany({
      select: this.SELECT_COMMENT,
    });
  }

  async findOne(id: number): Promise<fa_comments | null> {
    return await this.prisma.fa_comments.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  async upsert(
    faID: number,
    createFaCommentDto: CreateFaCommentDto[],
  ): Promise<EnrichedFAComments[] | null> {
    return Promise.all(
      createFaCommentDto.map(async (faComment) => {
        if (faComment.id) {
          return await this.prisma.fa_comments.update({
            where: {
              id: faComment.id,
            },
            data: {
              ...faComment,
              fa_id: faID,
            },
            select: this.SELECT_COMMENT,
          });
        } else {
          return await this.prisma.fa_comments.create({
            data: {
              ...faComment,
              fa_id: faID,
            },
            select: this.SELECT_COMMENT,
          });
        }
      }),
    );
  }
}
