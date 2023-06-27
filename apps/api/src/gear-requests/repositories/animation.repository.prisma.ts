import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { AnimationRepository } from '../gearRequests.service';
import { Animation } from '../animations/animation.model';

@Injectable()
export class PrismaAnimationRepository implements AnimationRepository {
  private readonly SELECT_ANIMATION = {
    id: true,
    name: true,
    status: true,
  };

  constructor(private readonly prismaService: PrismaService) {}

  async getAnimation(id: number): Promise<Animation> {
    const { name, status } = await this.prismaService.fa.findUnique({
      select: this.SELECT_ANIMATION,
      where: { id },
    });
    return { id, name, status };
  }
}
