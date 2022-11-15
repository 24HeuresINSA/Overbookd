import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { FA_Comment, Prisma } from '@prisma/client';
import { CreateFaCommentDto } from './dto/create-fa-comment.dto';

@Injectable()
export class FaCommentService {
  constructor(private prisma: PrismaService) {}

  createFAComments(
    faId: number,
    createFaCommentDto: CreateFaCommentDto[],
  ): Promise<Prisma.BatchPayload | null> {
    const faComments = createFaCommentDto.map((comment) => {
      return {
        ...comment,
        fa_id: faId,
      };
    });
    return this.prisma.fA_Comment.createMany({
      data: faComments,
      skipDuplicates: true,
    });
  }

  async find(fa_id: number): Promise<FA_Comment[] | null> {
    return this.prisma.fA_Comment.findMany({ where: { fa_id: fa_id } });
  }
}
