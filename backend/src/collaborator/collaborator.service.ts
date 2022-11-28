import { Injectable } from '@nestjs/common';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { PrismaService } from '../prisma.service';
import { collaborator } from '@prisma/client';

@Injectable()
export class CollaboratorService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.collaborator.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.collaborator.findUnique({
      where: {
        id: Number(id),
      },
    });
  }

  async upsert(faId: number, collab: CreateCollaboratorDto) {
    let collaborator: collaborator;
    if (collab.id) {
      collaborator = await this.prisma.collaborator.update({
        where: { id: collab.id },
        data: {
          ...collab,
          fa_collaborators: {
            connect: {
              fa_id_collaborator_id: {
                fa_id: faId,
                collaborator_id: collab.id,
              },
            },
          },
        },
      });
    } else {
      collaborator = await this.prisma.collaborator.create({
        data: {
          ...collab,
          fa_collaborators: {
            create: {
              fa_id: faId,
            },
          },
        },
      });
    }
    return collaborator;
  }
}
