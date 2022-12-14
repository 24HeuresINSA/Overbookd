import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateFaSitePublishAnimationServiceDto } from './dto/fa_site_publish_animation.dto';
import { FaSitePublishAnimationResponseDto } from './dto/faSitePublishAnimationResponse.dto';

@Injectable()
export class FaSitePublishAnimationService {
  constructor(private prisma: PrismaService) {}

  async create(
    createFaSitePublishAnimation: CreateFaSitePublishAnimationServiceDto,
  ): Promise<FaSitePublishAnimationResponseDto | null> {
    return await this.prisma.faSitePublishAnimation.create({
      data: {
        ...createFaSitePublishAnimation,
      },
    });
  }

  async update(
    id: number,
    updateFaSitePublishAnimation: CreateFaSitePublishAnimationServiceDto,
  ): Promise<FaSitePublishAnimationResponseDto | null> {
    return await this.prisma.faSitePublishAnimation.update({
      where: {
        faId: id,
      },
      data: {
        ...updateFaSitePublishAnimation,
      },
    });
  }

  async findAll(): Promise<FaSitePublishAnimationResponseDto[] | null> {
    return await this.prisma.faSitePublishAnimation.findMany();
  }

  async findOne(id: number): Promise<FaSitePublishAnimationResponseDto | null> {
    return await this.prisma.faSitePublishAnimation.findUnique({
      where: {
        faId: id,
      },
    });
  }

  async remove(id: number): Promise<FaSitePublishAnimationResponseDto | null> {
    return await this.prisma.faSitePublishAnimation.delete({
      where: {
        faId: id,
      },
    });
  }
}
