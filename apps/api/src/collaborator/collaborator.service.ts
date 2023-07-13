import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Collaborator, CollaboratorWithId } from './collaborator.model';
import { FaService } from '../fa/fa.service';

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly faService: FaService,
  ) {}

  findAll(): Promise<CollaboratorWithId[]> {
    return this.prisma.collaborator.findMany({
      select: COLLABORATOR_WITH_ID_SELECTION,
    });
  }

  findOne(id: number): Promise<CollaboratorWithId | null> {
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

  async createAndLinkToFa(
    faId: number,
    collaboratorData: Collaborator,
  ): Promise<CollaboratorWithId> {
    await this.faService.checkFaExistence(faId);
    const collaborator = await this.create(collaboratorData);
    this.linkToFa(faId, collaborator.id);
    return collaborator;
  }

  async linkToFa(
    faId: number,
    collaboratorId: number,
  ): Promise<CollaboratorWithId> {
    await this.prisma.fa.update({
      where: { id: faId },
      data: {
        collaborator: {
          connect: { id: collaboratorId },
        },
      },
    });
    return this.findOne(collaboratorId);
  }

  async unlinkFromFa(faId: number): Promise<void> {
    const fa = await this.faService.findOne(faId);
    if (!fa.collaborator) {
      throw new NotFoundException(`fa with id ${faId} has no collaborator`);
    }

    const collaboratorId = fa.collaborator.id;

    await this.prisma.fa.update({
      where: { id: faId },
      data: { collaborator: { disconnect: true } },
    });

    // delete collaborator if no more fa
    if (collaboratorId) {
      const faCount = await this.prisma.fa.count({
        where: { collaboratorId },
      });

      if (faCount === 0) this.remove(collaboratorId);
    }
  }
}
