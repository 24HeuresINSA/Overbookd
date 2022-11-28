import { Injectable } from '@nestjs/common';
import { fa_comments } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateFaCommentDto } from './dto/create-fa_comment.dto';

@Injectable()
export class FaCommentService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<fa_comments[] | null> {
    return await this.prisma.fa_comments.findMany();
  }

  async findOne(id: number): Promise<fa_comments | null> {
    return await this.prisma.fa_comments.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  upsert(
    faID: number,
    createFaCommentDto: CreateFaCommentDto,
  ): Promise<fa_comments | null> {
    if (createFaCommentDto.id) {
      return this.prisma.fa_comments.update({
        where: {
          id: createFaCommentDto.id,
        },
        data: {
          ...createFaCommentDto,
          fa_id: faID,
        },
      });
    } else {
      return this.prisma.fa_comments.create({
        data: {
          ...createFaCommentDto,
          fa_id: faID,
        },
      });
    }
  }
}
