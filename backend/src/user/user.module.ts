import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';
import { VolunteerPlanningModule } from 'src/volunteer-planning/volunteer-planning.module';

@Module({
  imports: [VolunteerPlanningModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, MailService],
})
export class UserModule {}
