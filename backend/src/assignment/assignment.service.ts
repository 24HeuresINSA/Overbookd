import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AssignmentService {
  constructor(private prisma: PrismaService) {}
}
