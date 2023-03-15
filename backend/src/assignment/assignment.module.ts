import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { VolunteerService } from './volunteer.service';

@Module({
  controllers: [AssignmentController],
  providers: [AssignmentService, VolunteerService, PrismaService],
})
export class AssignmentModule {}
