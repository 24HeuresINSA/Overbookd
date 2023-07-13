import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Collaborator, CollaboratorWithId } from './collaborator.model';

export const COLLABORATOR_WITH_ID_SELECTION = {
  id: true,
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

  findAll(): Promise<Collaborator[]> {
    return this.prisma.collaborator.findMany({
      select: COLLABORATOR_WITH_ID_SELECTION,
    });
  }

  findOne(id: number): Promise<Collaborator | null> {
    return this.prisma.collaborator.findUnique({
      where: { id },
      select: COLLABORATOR_WITH_ID_SELECTION,
    });
  }

  create(collaboratorData: Collaborator): Promise<CollaboratorWithId> {
    return this.prisma.collaborator.create({
      data: collaboratorData,
      select: COLLABORATOR_WITH_ID_SELECTION,
    });
  }

  update(
    id: number,
    collaboratorData: Collaborator,
  ): Promise<CollaboratorWithId> {
    return this.prisma.collaborator.update({
      where: { id },
      data: collaboratorData,
      select: COLLABORATOR_WITH_ID_SELECTION,
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.collaborator.delete({
      where: { id },
    });
  }
}
