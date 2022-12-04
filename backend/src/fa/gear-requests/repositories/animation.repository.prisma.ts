import { Injectable } from '@nestjs/common';
import { Status } from 'src/fa/dto/update-fa.dto';
import { PrismaService } from '../../../prisma.service';
import { Animation, AnimationRepository } from '../gearRequests.service';

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
    return { id, name, status: status as Status };
  }
}
