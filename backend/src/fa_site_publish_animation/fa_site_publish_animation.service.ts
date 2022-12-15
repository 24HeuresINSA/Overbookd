import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FaSitePublishAnimationFormRequestDto } from './dto/faSitePublishAnimationFormRequest.dto';
import { FaSitePublishAnimation } from './interfaces';

@Injectable()
export class FaSitePublishAnimationService {
  constructor(private prisma: PrismaService) {}

  async create(
    createFaSitePublishAnimation: FaSitePublishAnimationFormRequestDto,
  ): Promise<FaSitePublishAnimation | null> {
    return this.prisma.faSitePublishAnimation.create({
      data: {
        ...createFaSitePublishAnimation,
      },
    });
  }

  async update(
    faId: number,
    updateFaSitePublishAnimation: FaSitePublishAnimationFormRequestDto,
  ): Promise<FaSitePublishAnimation | null> {
    return this.prisma.faSitePublishAnimation.update({
      where: {
        faId,
      },
      data: {
        ...updateFaSitePublishAnimation,
      },
    });
  }

  async findAll(): Promise<FaSitePublishAnimation[]> {
    return this.prisma.faSitePublishAnimation.findMany({
      orderBy: {
        faId: 'asc',
      },
    });
  }

  async findOne(faId: number): Promise<FaSitePublishAnimation | null> {
    return this.prisma.faSitePublishAnimation.findUnique({
      where: {
        faId,
      },
    });
  }

  async remove(faId: number): Promise<void> {
    await this.prisma.faSitePublishAnimation.delete({
      where: {
        faId,
      },
    });
  }
}
