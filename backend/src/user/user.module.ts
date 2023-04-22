import { Module } from '@nestjs/common';
import { VolunteerPlanningModule } from 'src/volunteer-planning/volunteer-planning.module';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma.service';
import { FileService } from './file.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [VolunteerPlanningModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, MailService, FileService],
})
export class UserModule {}
