import { Injectable } from '@nestjs/common';
import { Period } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreatePublicAnimationRequestDto } from './dto/create-public-animation.request.dto';
import { UpdatePublicAnimationRequestDto } from './dto/update-public-animation.request.dto';
import {
  PublicAnimation,
  PublicAnimationWithFa,
  PublicAnimationFa,
} from './public-animation.model';

type DatabasePublicAnimationFa = Omit<
  PublicAnimationFa,
  'timeWindows'
> & {
  timeWindows: Period[];
};

type DatabasePublicAnimation = Omit<PublicAnimationWithFa, 'fa'> & {
  fa: DatabasePublicAnimationFa;
};

function convertToPublicAnimation(
  publicAnimation: DatabasePublicAnimation,
): PublicAnimationWithFa {
  return {
    ...publicAnimation,
    fa: {
      id: publicAnimation.fa.id,
      name: publicAnimation.fa.name,
      timeWindows: publicAnimation.fa.timeWindows,
    },
  };
}

@Injectable()
export class PublicAnimationService {
  constructor(private prisma: PrismaService) {}

  private readonly SELECT_PUBLIC_ANIMATION = {
    isFlagship: true,
    description: true,
    photoLink: true,
    categories: true,
  };

  private readonly SELECT_PUBLIC_ANIMATION_WITH_FA = {
    ...this.SELECT_PUBLIC_ANIMATION,
    fa: {
      select: {
        id: true,
        name: true,
        timeWindows: {
          select: {
            id: true,
            start: true,
            end: true,
          },
        },
      },
    },
  };

  async create(
    createPublicAnimation: CreatePublicAnimationRequestDto,
  ): Promise<PublicAnimation | null> {
    return this.prisma.publicAnimation.create({
      data: { ...createPublicAnimation },
      select: this.SELECT_PUBLIC_ANIMATION,
    });
  }

  async update(
    faId: number,
    updatePublicAnimation: UpdatePublicAnimationRequestDto,
  ): Promise<PublicAnimation | null> {
    return this.prisma.publicAnimation.update({
      where: { faId },
      data: { ...updatePublicAnimation },
      select: this.SELECT_PUBLIC_ANIMATION,
    });
  }

  async findAll(): Promise<PublicAnimationWithFa[]> {
    const publicAnimations = await this.prisma.publicAnimation.findMany(
      {
        orderBy: { faId: 'asc' },
        select: this.SELECT_PUBLIC_ANIMATION_WITH_FA,
      },
    );
    return publicAnimations.map(convertToPublicAnimation);
  }

  async findOne(faId: number): Promise<PublicAnimation | null> {
    return this.prisma.publicAnimation.findUnique({
      where: { faId },
      select: this.SELECT_PUBLIC_ANIMATION,
    });
  }

  async remove(faId: number): Promise<void> {
    await this.prisma.publicAnimation.delete({
      where: { faId },
    });
  }
}
