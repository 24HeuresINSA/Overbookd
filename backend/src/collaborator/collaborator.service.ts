import { Injectable } from '@nestjs/common';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { PrismaService } from '../prisma.service';
import { Collaborator } from '@prisma/client';

@Injectable()
export class CollaboratorService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Collaborator[] | null> {
    return this.prisma.collaborator.findMany();
  }

  async findOne(id: number): Promise<Collaborator | null> {
    return this.prisma.collaborator.findUnique({
      where: { id },
    });
  }

  async upsert(
    faId: number,
    collab: CreateCollaboratorDto[],
  ): Promise<Collaborator[] | null> {
    const operations = collab.map((coll) => {
      const col = coll.collaborator;
      if (col.id) {
        return this.prisma.collaborator.update({
          where: { id: col.id },
          data: {
            ...col,
            faCollaborators: {
              connect: {
                faId_collaboratorId: {
                  faId,
                  collaboratorId: col.id,
                },
              },
            },
          },
        });
      } else {
        return this.prisma.collaborator.create({
          data: {
            ...col,
            faCollaborators: {
              create: { faId },
            },
          },
        });
      }
    });
    return this.prisma.$transaction(operations);
  }

  async remove(id: number): Promise<void> {
    await this.prisma.collaborator.delete({
      where: { id },
    });
  }
}
