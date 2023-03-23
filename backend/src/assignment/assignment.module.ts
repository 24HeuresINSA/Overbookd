import { Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { VolunteerAvailabilityService } from 'src/volunteer-availability/volunteer-availability.service';
import { PrismaService } from '../prisma.service';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { FtTimespanService } from './ftTimespan.service';
import { VolunteerService } from './volunteer.service';

@Module({
  controllers: [AssignmentController],
  providers: [
    AssignmentService,
    VolunteerService,
    FtTimespanService,
    PrismaService,
    VolunteerAvailabilityService,
    UserService,
  ],
})
export class AssignmentModule {}
