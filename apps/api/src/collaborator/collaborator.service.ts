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

  findOne(faId: number): Promise<Collaborator | null> {
    return this.prisma.collaborator.findUnique({
      where: { faId },
      select: COLLABORATOR_SELECTION,
    });
  }

  create(faId: number, collaborator: Collaborator): Promise<Collaborator> {
    return this.prisma.collaborator.create({
      data: { faId, ...collaborator },
      select: COLLABORATOR_SELECTION,
    });
  }

  update(faId: number, collaborator: Collaborator): Promise<Collaborator> {
    return this.prisma.collaborator.update({
      where: { faId },
      data: collaborator,
      select: COLLABORATOR_SELECTION,
    });
  }

  async remove(faId: number): Promise<void> {
    await this.prisma.collaborator.delete({
      where: { faId },
    });
  }
}
