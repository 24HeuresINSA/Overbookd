import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Collaborator } from './collaborator.model';

export const COLLABORATOR_SELECTION = {
  firstname: true,
  lastname: true,
  phone: true,
  email: true,
  company: true,
  comment: true,
};

@Injectable()
export class CollaboratorService {
  constructor(private prisma: PrismaService) {}

  async findOne(faId: number): Promise<Collaborator | null> {
    return this.prisma.collaborator.findUnique({
      where: { faId },
      select: COLLABORATOR_SELECTION,
    });
  }

  async upsert(
    faId: number,
    collaborator: Collaborator,
  ): Promise<Collaborator> {
    return this.prisma.collaborator.upsert({
      where: { faId },
      create: { faId, ...collaborator },
      update: collaborator,
      select: COLLABORATOR_SELECTION,
    });
  }

  async remove(faId: number): Promise<void> {
    await this.prisma.collaborator.delete({
      where: { faId },
    });
  }
}
