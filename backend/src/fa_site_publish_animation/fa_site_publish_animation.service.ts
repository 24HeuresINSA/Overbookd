import { Injectable } from '@nestjs/common';
import { Period } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { FaSitePublishAnimationCreationFormRequestDto } from './dto/faSitePublishAnimationCreationForm.dto';
import { FaSitePublishAnimationFormRequestDto } from './dto/faSitePublishAnimationFormRequest.dto';
import {
  LiteSitePublishAnimation,
  SitePublishAnimation,
  SitePublishAnimationFa,
} from './interfaces';

type DatabaseSitePublishAnimationFa = Omit<
  SitePublishAnimationFa,
  'timeWindows'
> & {
  time_windows: Omit<Period, 'id'>[];
};

type DatabaseSitePublishAnimation = Omit<SitePublishAnimation, 'fa'> & {
  fa: DatabaseSitePublishAnimationFa;
};

function convertToSitePublishAnimation(
  publishAnimation: DatabaseSitePublishAnimation,
): SitePublishAnimation {
  return {
    ...publishAnimation,
    fa: {
      id: publishAnimation.fa.id,
      name: publishAnimation.fa.name,
      timeWindows: publishAnimation.fa.time_windows,
    },
  };
}

@Injectable()
export class FaSitePublishAnimationService {
  constructor(private prisma: PrismaService) {}

  private readonly SELECT_LITE_PUBLISH_ANIMATION = {
    isMajor: true,
    description: true,
    photoLink: true,
    categories: true,
  };

  private readonly SELECT_PUBLISH_ANIMATION = {
    ...this.SELECT_LITE_PUBLISH_ANIMATION,
    fa: {
      select: {
        id: true,
        name: true,
        time_windows: {
          select: {
            start: true,
            end: true,
          },
        },
      },
    },
  };

  async create(
    createFaSitePublishAnimation: FaSitePublishAnimationCreationFormRequestDto,
  ): Promise<LiteSitePublishAnimation | null> {
    return this.prisma.faSitePublishAnimation.create({
      data: {
        ...createFaSitePublishAnimation,
      },
      select: this.SELECT_LITE_PUBLISH_ANIMATION,
    });
  }

  async update(
    faId: number,
    updateFaSitePublishAnimation: FaSitePublishAnimationFormRequestDto,
  ): Promise<LiteSitePublishAnimation | null> {
    return this.prisma.faSitePublishAnimation.update({
      where: {
        faId,
      },
      data: {
        ...updateFaSitePublishAnimation,
      },
      select: this.SELECT_LITE_PUBLISH_ANIMATION,
    });
  }

  async findAll(): Promise<SitePublishAnimation[]> {
    const publishAnimations = await this.prisma.faSitePublishAnimation.findMany(
      {
        orderBy: {
          faId: 'asc',
        },
        select: this.SELECT_PUBLISH_ANIMATION,
      },
    );
    return publishAnimations.map(convertToSitePublishAnimation);
  }

  async findOne(faId: number): Promise<LiteSitePublishAnimation | null> {
    return this.prisma.faSitePublishAnimation.findUnique({
      where: {
        faId,
      },
      select: this.SELECT_LITE_PUBLISH_ANIMATION,
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
