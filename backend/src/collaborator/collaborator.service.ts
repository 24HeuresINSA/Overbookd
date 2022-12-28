import { Injectable } from '@nestjs/common';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { PrismaService } from '../prisma.service';
import { collaborator } from '@prisma/client';

@Injectable()
export class CollaboratorService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<collaborator[] | null> {
    return await this.prisma.collaborator.findMany();
  }

  async findOne(id: number): Promise<collaborator | null> {
    return await this.prisma.collaborator.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  async upsert(
    faId: number,
    collab: CreateCollaboratorDto[],
  ): Promise<collaborator[] | null> {
    const operations = collab.map((coll) => {
      const col = coll.collaborator;
      if (col.id) {
        return this.prisma.collaborator.update({
          where: { id: col.id },
          data: {
            ...col,
            fa_collaborators: {
              connect: {
                fa_id_collaborator_id: {
                  fa_id: faId,
                  collaborator_id: col.id,
                },
              },
            },
          },
        });
      } else {
        return this.prisma.collaborator.create({
          data: {
            ...col,
            fa_collaborators: {
              create: {
                fa_id: faId,
              },
            },
          },
        });
      }
    });
    return this.prisma.$transaction(operations);
  }
}
