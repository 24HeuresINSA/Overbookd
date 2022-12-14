import { Injectable } from '@nestjs/common';
import { fa_site_publish_animation } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateFaSitePublishAnimationServiceDto } from './dto/fa_site_publish_animation.dto';

@Injectable()
export class FaSitePublishAnimationService {
  constructor(private prisma: PrismaService) {}

  async create(
    createFaSitePublishAnimation: CreateFaSitePublishAnimationServiceDto,
  ): Promise<fa_site_publish_animation | null> {
    return await this.prisma.fa_site_publish_animation.create({
      data: {
        ...createFaSitePublishAnimation,
      },
    });
  }

  async update(
    id: number,
    updateFaSitePublishAnimation: CreateFaSitePublishAnimationServiceDto,
  ): Promise<fa_site_publish_animation | null> {
    return await this.prisma.fa_site_publish_animation.update({
      where: {
        id: id,
      },
      data: {
        ...updateFaSitePublishAnimation,
      },
    });
  }

  async findAll(): Promise<fa_site_publish_animation[] | null> {
    return await this.prisma.fa_site_publish_animation.findMany();
  }

  async findOne(id: number): Promise<fa_site_publish_animation | null> {
    return await this.prisma.fa_site_publish_animation.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  async remove(id: number): Promise<fa_site_publish_animation | null> {
    return await this.prisma.fa_site_publish_animation.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
