import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CollaboratorWithId } from './collaborator.model';

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
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<CollaboratorWithId[]> {
    return this.prisma.collaborator.findMany({
      select: COLLABORATOR_WITH_ID_SELECTION,
    });
  }
}
