import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FaSitePublishAnimationFormRequestDto } from './dto/faSitePublishAnimationFormRequest.dto';
import { FaSitePublishAnimationResponseDto } from './dto/faSitePublishAnimationResponse.dto';

@Injectable()
export class FaSitePublishAnimationService {
  constructor(private prisma: PrismaService) {}

  async create(
    createFaSitePublishAnimation: FaSitePublishAnimationFormRequestDto,
  ): Promise<FaSitePublishAnimationResponseDto | null> {
    return this.prisma.faSitePublishAnimation.create({
      data: {
        ...createFaSitePublishAnimation,
      },
    });
  }

  async update(
    id: number,
    updateFaSitePublishAnimation: FaSitePublishAnimationFormRequestDto,
  ): Promise<FaSitePublishAnimationResponseDto | null> {
    return this.prisma.faSitePublishAnimation.update({
      where: {
        faId: id,
      },
      data: {
        ...updateFaSitePublishAnimation,
      },
    });
  }

  async findAll(): Promise<FaSitePublishAnimationResponseDto[] | null> {
    return this.prisma.faSitePublishAnimation.findMany();
  }

  async findOne(
    faId: number,
  ): Promise<FaSitePublishAnimationResponseDto | null> {
    return this.prisma.faSitePublishAnimation.findUnique({
      where: {
        faId,
      },
    });
  }

  async remove(
    faId: number,
  ): Promise<FaSitePublishAnimationResponseDto | null> {
    return this.prisma.faSitePublishAnimation.delete({
      where: {
        faId,
      },
    });
  }
}
