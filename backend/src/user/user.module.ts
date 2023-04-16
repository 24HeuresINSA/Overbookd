import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';
import { PrismaTaskRepository } from 'src/volunteer-planning/task.repository.prisma';
import { VolunteerPlanningService } from 'src/volunteer-planning/volunteer-planning.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    MailService,
    VolunteerPlanningService,
    { provide: 'TASK_REPOSITORY', useClass: PrismaTaskRepository },
  ],
})
export class UserModule {}
